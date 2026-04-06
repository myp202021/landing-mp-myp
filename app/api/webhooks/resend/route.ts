import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Webhook de Resend — recibe eventos de email (open, click, bounce, etc)
 * Configurar en Resend → Webhooks → URL: https://www.mulleryperez.cl/api/webhooks/resend
 *
 * Cuando un prospecto ABRE o RESPONDE un email:
 * → Se crea como lead real en el CRM (tabla leads)
 * → Se actualiza el status de la secuencia
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { type, data } = body
    // Resend webhook payload: { type: 'email.opened', data: { email_id, to, ... } }

    if (!type || !data) {
      return NextResponse.json({ ok: true }) // Ignore malformed
    }

    const emailId = data.email_id || data.id
    const toEmail = Array.isArray(data.to) ? data.to[0] : data.to

    // Mapear tipo de evento
    const eventTypeMap: Record<string, string> = {
      'email.sent': 'sent',
      'email.delivered': 'delivered',
      'email.opened': 'opened',
      'email.clicked': 'clicked',
      'email.bounced': 'bounced',
      'email.complained': 'complained',
    }

    const eventType = eventTypeMap[type]
    if (!eventType) {
      return NextResponse.json({ ok: true }) // Evento no relevante
    }

    // Buscar la secuencia de outreach que corresponde a este email
    const { data: outreach } = await supabase
      .from('prospect_outreach')
      .select(`
        *,
        prospect_companies(id, name, website, phone, industry, city),
        prospect_contacts(id, contact_email, contact_name),
        prospect_benchmarks(final_score)
      `)
      .contains('resend_message_ids', [emailId])
      .single()

    if (!outreach) {
      // No es un email de prospección, ignorar
      return NextResponse.json({ ok: true })
    }

    // Guardar evento
    await supabase.from('prospect_outreach_events').insert({
      outreach_id: outreach.id,
      resend_message_id: emailId,
      event_type: eventType,
      payload: data,
    })

    // ── BOUNCE → suprimir email ──
    if (eventType === 'bounced') {
      await supabase.from('prospect_outreach').update({ status: 'bounced' }).eq('id', outreach.id)
      await supabase.from('prospect_suppressions').upsert({
        email: toEmail?.toLowerCase(),
        reason: 'bounced',
      }, { onConflict: 'email' })
      return NextResponse.json({ ok: true, action: 'bounced' })
    }

    // ── COMPLAINED → suprimir ──
    if (eventType === 'complained') {
      await supabase.from('prospect_outreach').update({ status: 'unsubscribed' }).eq('id', outreach.id)
      await supabase.from('prospect_suppressions').upsert({
        email: toEmail?.toLowerCase(),
        reason: 'complained',
      }, { onConflict: 'email' })
      return NextResponse.json({ ok: true, action: 'suppressed' })
    }

    // ── OPENED o CLICKED → promover a lead en CRM ──
    if (eventType === 'opened' || eventType === 'clicked') {
      const company = outreach.prospect_companies
      const contact = outreach.prospect_contacts
      const benchmark = outreach.prospect_benchmarks

      if (!company || !contact) {
        return NextResponse.json({ ok: true })
      }

      // Verificar si ya existe como lead (no duplicar)
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', contact.contact_email)
        .limit(1)
        .single()

      if (!existingLead) {
        // Buscar cliente M&P para asignar
        const { data: mypCliente } = await supabase
          .from('clientes')
          .select('id')
          .or('nombre.ilike.%muller%,nombre.ilike.%m&p%,nombre.ilike.%myp%')
          .single()

        if (mypCliente) {
          await supabase.from('leads').insert({
            cliente_id: mypCliente.id,
            nombre: contact.contact_name || company.name,
            email: contact.contact_email,
            telefono: company.phone || null,
            empresa: company.name,
            fuente: 'outbound',
            observaciones: `Prospección automática | Score: ${benchmark?.final_score || '?'}/100 | Industria: ${company.industry} | ${company.city || 'Chile'} | Evento: ${eventType}`,
            contactado: true,
            vendido: false,
            fecha_ingreso: new Date().toISOString(),
          })
        }
      }

      // Actualizar status de la empresa
      await supabase
        .from('prospect_companies')
        .update({ status: eventType === 'clicked' ? 'replied' : 'emailed' })
        .eq('id', company.id)

      return NextResponse.json({ ok: true, action: 'lead_created' })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Webhook Resend error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
