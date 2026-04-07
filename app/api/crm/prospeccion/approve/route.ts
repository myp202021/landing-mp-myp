import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND
const FROM_EMAIL = 'Müller & Pérez <contacto@mulleryperez.cl>'
const REPLY_TO = 'contacto@mulleryperez.cl'
const BCC = 'contacto@mulleryperez.cl'

const SUBJECTS: Record<string, string> = {
  inmobiliaria: 'Así se está moviendo la publicidad inmobiliaria en Chile — Análisis abril 2026',
  saas: 'Así se adquieren clientes en SaaS B2B en Chile — Análisis abril 2026',
}

const TEMPLATES: Record<string, string> = {
  inmobiliaria: 'inmobiliarias.html',
  saas: 'saas.html',
}

// Cache de templates
const templateCache: Record<string, string> = {}

function loadTemplate(industry: string): string | null {
  if (templateCache[industry]) return templateCache[industry]
  const file = TEMPLATES[industry]
  if (!file) return null
  try {
    // En Vercel, los archivos de public/ están en el filesystem
    const paths = [
      join(process.cwd(), 'templates', 'benchmarks', file),
      join(process.cwd(), 'public', 'benchmarks', file),
    ]
    for (const p of paths) {
      try {
        const html = readFileSync(p, 'utf-8')
        templateCache[industry] = html
        return html
      } catch {}
    }
  } catch {}
  return null
}

async function sendEmail(to: string, subject: string, html: string): Promise<string | null> {
  if (!RESEND_API_KEY) return null
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        bcc: [BCC],
        reply_to: REPLY_TO,
        subject,
        html,
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(JSON.stringify(data))
    return data.id || null
  } catch (err: any) {
    console.error('Resend error:', err.message)
    return null
  }
}

// POST /api/crm/prospeccion/approve
// action: 'approve' → envía email inmediato + marca emailed
// action: 'disqualify' → marca disqualified, no envía nada
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body
    const companyIds: number[] = body.company_ids || (body.company_id ? [body.company_id] : [])

    if (!companyIds.length || !['approve', 'disqualify'].includes(action)) {
      return NextResponse.json({ error: 'company_id(s) y action (approve|disqualify) requeridos' }, { status: 400 })
    }

    // ── DESCARTAR ──
    if (action === 'disqualify') {
      const { data, error } = await supabase
        .from('prospect_companies')
        .update({ status: 'disqualified' })
        .in('id', companyIds)
        .select('id, name, status')

      if (error) throw error
      return NextResponse.json({ updated: data, count: data?.length || 0, emails_sent: 0 })
    }

    // ── APROBAR + ENVIAR ──
    // Obtener empresas con contactos
    const { data: companies, error: fetchError } = await supabase
      .from('prospect_companies')
      .select(`
        id, name, industry, city, phone, website,
        prospect_contacts(id, contact_email, contact_name, email_type, is_primary, is_valid, verification_status)
      `)
      .in('id', companyIds)

    if (fetchError) throw fetchError

    // Cargar suppression list
    const { data: suppressions } = await supabase
      .from('prospect_suppressions')
      .select('email')
    const suppressedEmails = new Set((suppressions || []).map((s: any) => s.email.toLowerCase()))

    let sent = 0
    let skipped = 0
    const results: any[] = []

    for (const company of (companies || [])) {
      const contacts = company.prospect_contacts || []

      // Elegir mejor contacto válido
      const priority = ['sales', 'info', 'generic', 'personal', 'unknown']
      const validContacts = contacts
        .filter((c: any) => c.is_valid !== false)
        .sort((a: any, b: any) => {
          if (a.is_primary && !b.is_primary) return -1
          return priority.indexOf(a.email_type) - priority.indexOf(b.email_type)
        })

      const contact = validContacts[0]

      if (!contact) {
        // Sin contacto válido → no enviar, marcar sin email
        await supabase.from('prospect_companies').update({ status: 'disqualified' }).eq('id', company.id)
        results.push({ id: company.id, name: company.name, status: 'sin_email' })
        skipped++
        continue
      }

      // Check suppression
      if (suppressedEmails.has(contact.contact_email.toLowerCase())) {
        await supabase.from('prospect_companies').update({ status: 'disqualified' }).eq('id', company.id)
        results.push({ id: company.id, name: company.name, status: 'suprimido' })
        skipped++
        continue
      }

      // Cargar template de la industria
      const template = loadTemplate(company.industry)
      const subject = SUBJECTS[company.industry] || `Análisis de la industria ${company.industry} en Chile — 2026`

      if (!template) {
        results.push({ id: company.id, name: company.name, status: 'sin_template' })
        skipped++
        continue
      }

      // Enviar email
      const messageId = await sendEmail(contact.contact_email, subject, template)

      if (messageId) {
        // Marcar como emailed
        await supabase.from('prospect_companies').update({ status: 'emailed' }).eq('id', company.id)

        // Guardar outreach
        await supabase.from('prospect_outreach').insert({
          company_id: company.id,
          contact_id: contact.id,
          sequence_name: 'benchmark_industry',
          status: 'email_1_sent',
          current_step: 1,
          email_1_sent_at: new Date().toISOString(),
          email_1_subject: subject,
          resend_message_ids: [messageId],
        })

        results.push({ id: company.id, name: company.name, email: contact.contact_email, status: 'enviado', messageId })
        sent++
      } else {
        // Falló el envío pero no descartar
        await supabase.from('prospect_companies').update({ status: 'qualified' }).eq('id', company.id)
        results.push({ id: company.id, name: company.name, status: 'error_envio' })
        skipped++
      }
    }

    return NextResponse.json({
      results,
      emails_sent: sent,
      skipped,
      total: companyIds.length,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
