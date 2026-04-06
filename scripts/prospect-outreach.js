/**
 * PROSPECT OUTREACH — Envía benchmark de industria a empresas scrapeadas
 *
 * Lógica:
 * 1. Toma empresas con status=qualified + email
 * 2. Lee el HTML del benchmark de la industria (templates/benchmarks/{industria}.html)
 * 3. Envía el HTML completo como body del email via Resend
 * 4. NO crea lead en CRM — eso lo hace el webhook de Resend cuando abren/clickean
 *
 * Uso:
 *   node scripts/prospect-outreach.js --industry inmobiliaria       # Solo inmobiliarias calificadas
 *   node scripts/prospect-outreach.js --industry saas               # Solo SaaS calificadas
 *   node scripts/prospect-outreach.js --industry inmobiliaria --dry-run  # Preview sin enviar
 *   node scripts/prospect-outreach.js --industry saas --limit 30
 *
 * Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND (o RESEND_API_KEY)
 */

const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const RESEND_API_KEY = process.env.RESEND || process.env.RESEND_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ── Config ──────────────────────────────────────────────
const FROM_EMAIL = 'Müller & Pérez <contacto@mulleryperez.cl>'
const REPLY_TO = 'contacto@mulleryperez.cl'
const BCC = 'contacto@mulleryperez.cl'

// Asuntos por industria
const SUBJECT_BY_INDUSTRY = {
  inmobiliaria: 'Así se está moviendo la publicidad inmobiliaria en Chile — Análisis abril 2026',
  saas: 'Así se adquieren clientes en SaaS B2B en Chile — Análisis abril 2026',
}

// Templates por industria
const TEMPLATE_BY_INDUSTRY = {
  inmobiliaria: 'inmobiliarias.html',
  saas: 'saas.html',
}

// ── Load template ───────────────────────────────────────

function loadTemplate(industry) {
  const templateFile = TEMPLATE_BY_INDUSTRY[industry]
  if (!templateFile) {
    console.error(`❌ No hay template para industria: ${industry}`)
    console.log('   Industrias disponibles:', Object.keys(TEMPLATE_BY_INDUSTRY).join(', '))
    process.exit(1)
  }

  // Buscar en múltiples ubicaciones
  const paths = [
    path.join(__dirname, '..', 'templates', 'benchmarks', templateFile),
    path.join(__dirname, '..', 'templates', templateFile),
    path.join(process.cwd(), 'templates', 'benchmarks', templateFile),
  ]

  for (const p of paths) {
    if (fs.existsSync(p)) {
      console.log(`   📄 Template: ${p}`)
      return fs.readFileSync(p, 'utf-8')
    }
  }

  console.error(`❌ Template no encontrado: ${templateFile}`)
  console.error('   Buscado en:', paths.join('\n   '))
  process.exit(1)
}

// ── Send email ──────────────────────────────────────────

async function sendEmail(to, subject, html) {
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
  if (!res.ok) {
    throw new Error(`Resend error: ${JSON.stringify(data)}`)
  }
  return data.id
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')
  let limitFilter = 30
  let industryFilter = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limitFilter = parseInt(args[++i])
    if (args[i] === '--industry' && args[i + 1]) industryFilter = args[++i]
  }

  if (!industryFilter) {
    console.error('❌ Debes especificar --industry (inmobiliaria, saas)')
    process.exit(1)
  }

  if (!RESEND_API_KEY && !isDryRun) {
    console.error('❌ RESEND_API_KEY no definida. Usa --dry-run para probar.')
    process.exit(1)
  }

  // Cargar template HTML
  console.log(`\n✉️ OUTREACH ${isDryRun ? '(DRY RUN)' : ''} — ${industryFilter}`)
  const htmlTemplate = loadTemplate(industryFilter)
  const subject = SUBJECT_BY_INDUSTRY[industryFilter] || `Análisis de la industria ${industryFilter} en Chile — Abril 2026`
  console.log(`   📬 Asunto: ${subject}`)
  console.log(`   📨 Desde: ${FROM_EMAIL}`)
  console.log(`   📊 Límite: ${limitFilter}`)

  // Obtener empresas calificadas con contacto
  const { data: companies, error } = await supabase
    .from('prospect_companies')
    .select(`
      *,
      prospect_contacts!inner(id, contact_email, contact_name, email_type, is_primary)
    `)
    .eq('status', 'qualified')
    .eq('industry', industryFilter)
    .order('creado_en', { ascending: true })
    .limit(limitFilter)

  if (error) {
    console.error('❌ Error consultando:', error.message)
    process.exit(1)
  }

  if (!companies || companies.length === 0) {
    console.log('✅ No hay empresas calificadas pendientes de envío.')
    return
  }

  // Cargar suppression list
  const { data: suppressions } = await supabase
    .from('prospect_suppressions')
    .select('email')

  const suppressedEmails = new Set((suppressions || []).map(s => s.email.toLowerCase()))

  // Cargar emails ya en CRM
  const { data: crmLeads } = await supabase
    .from('leads')
    .select('email')
    .not('email', 'is', null)

  const crmEmails = new Set((crmLeads || []).map(l => l.email?.toLowerCase()).filter(Boolean))

  // Cargar outreach existentes
  const { data: existingOutreach } = await supabase
    .from('prospect_outreach')
    .select('company_id')

  const alreadySent = new Set((existingOutreach || []).map(o => o.company_id))

  console.log(`\n   Candidatas: ${companies.length}`)
  console.log(`   Suprimidas: ${suppressedEmails.size}`)
  console.log(`   Ya en CRM: ${crmEmails.size}`)
  console.log('')

  let sent = 0, skipped = 0

  for (const company of companies) {
    const contacts = company.prospect_contacts

    // Skip ya enviados
    if (alreadySent.has(company.id)) {
      skipped++
      continue
    }

    // Elegir mejor contacto (priorizar: sales > info > generic)
    const priority = ['sales', 'info', 'generic', 'personal', 'unknown']
    const sorted = contacts.sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1
      return priority.indexOf(a.email_type) - priority.indexOf(b.email_type)
    })
    const contact = sorted[0]

    // Check suppression
    if (suppressedEmails.has(contact.contact_email.toLowerCase())) {
      console.log(`   🚫 ${company.name} — email suprimido`)
      skipped++
      continue
    }

    // Check CRM duplicate
    if (crmEmails.has(contact.contact_email.toLowerCase())) {
      console.log(`   🔄 ${company.name} — ya existe en CRM`)
      skipped++
      continue
    }

    console.log(`   📧 ${company.name} → ${contact.contact_email}`)

    if (isDryRun) {
      sent++
      continue
    }

    try {
      const messageId = await sendEmail(contact.contact_email, subject, htmlTemplate)
      console.log(`      ✅ Enviado (${messageId})`)

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

      // Actualizar status empresa
      await supabase.from('prospect_companies').update({ status: 'emailed' }).eq('id', company.id)

      sent++

      // Pausa entre envíos (2 seg)
      await new Promise(r => setTimeout(r, 2000))

    } catch (err) {
      console.error(`      ❌ Error: ${err.message}`)

      if (err.message.includes('bounce') || err.message.includes('invalid')) {
        await supabase.from('prospect_suppressions').upsert({
          email: contact.contact_email.toLowerCase(),
          reason: 'bounced',
        }, { onConflict: 'email' })
      }
    }
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN OUTREACH ${isDryRun ? '(DRY RUN)' : ''}`)
  console.log(`   Industria: ${industryFilter}`)
  console.log(`   Enviados: ${sent}`)
  console.log(`   Saltados: ${skipped}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
