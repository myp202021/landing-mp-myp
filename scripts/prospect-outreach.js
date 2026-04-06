/**
 * PROSPECT OUTREACH — Califica y envía email 1 a prospectos benchmarkeados
 *
 * Lógica:
 * 1. Toma empresas con status=benchmarked + email + benchmark completo
 * 2. Filtra: score <= 65, no en suppression list, no duplicado en CRM
 * 3. Genera email personalizado con datos del benchmark
 * 4. Envía via Resend
 * 5. Crea lead en CRM
 *
 * Uso:
 *   node scripts/prospect-outreach.js                    # Todas las calificadas
 *   node scripts/prospect-outreach.js --dry-run          # Solo muestra, no envía
 *   node scripts/prospect-outreach.js --industry saas
 *   node scripts/prospect-outreach.js --limit 10
 *
 * Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND (o RESEND_API_KEY)
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const RESEND_API_KEY = process.env.RESEND || process.env.RESEND_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ── Config ──────────────────────────────────────────────
const FROM_EMAIL = 'Müller & Pérez <contacto@mulleryperez.cl>'
const REPLY_TO = 'contacto@mulleryperez.cl'
const BCC = 'contacto@mulleryperez.cl'  // Siempre copia interna
const MAX_SCORE_TO_SEND = 65  // Solo enviar si score <= 65 (oportunidad media-alta)

// ── Email template ──────────────────────────────────────

function generateEmail1(company, benchmark, contact) {
  const nombre = contact.contact_name || company.name
  const brechasPrincipal = benchmark.brechas[0] || 'brechas en su presencia digital'

  const subject = `${company.name}: ${benchmark.final_score}/100 en madurez digital — benchmark gratuito`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">

<p>Hola${contact.contact_name ? ` ${contact.contact_name}` : ''},</p>

<p>Analizamos la presencia digital de <strong>${company.name}</strong> como parte de un estudio de la industria ${company.industry} en ${company.city || 'Chile'}.</p>

<p>El resultado: <strong style="color: ${benchmark.final_score <= 39 ? '#e74c3c' : benchmark.final_score <= 69 ? '#f39c12' : '#27ae60'};">${benchmark.final_score}/100</strong> en madurez digital.</p>

<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
  <tr style="background: #f8f9fa;">
    <td style="padding: 8px; border: 1px solid #dee2e6;">Sitio Web</td>
    <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center; font-weight: bold;">${benchmark.website_score}/20</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #dee2e6;">Redes Sociales</td>
    <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center; font-weight: bold;">${(benchmark.instagram_score || 0) + (benchmark.linkedin_score || 0) + (benchmark.facebook_score || 0)}/40</td>
  </tr>
  <tr style="background: #f8f9fa;">
    <td style="padding: 8px; border: 1px solid #dee2e6;">SEO</td>
    <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center; font-weight: bold;">${benchmark.seo_score}/10</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #dee2e6;">Preparación para Pauta</td>
    <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center; font-weight: bold;">${benchmark.paid_readiness_score}/15</td>
  </tr>
</table>

<p><strong>Principal hallazgo:</strong> ${brechasPrincipal}</p>

${benchmark.brechas.length > 1 ? `
<p>También detectamos:</p>
<ul style="padding-left: 20px;">
  ${benchmark.brechas.slice(1, 3).map(b => `<li>${b}</li>`).join('\n  ')}
</ul>
` : ''}

<p>Tenemos el benchmark completo con acciones concretas. ¿Les interesa recibirlo? Son 15 minutos de revisión.</p>

<p style="margin-top: 24px;">
  <a href="https://wa.me/56954197432?text=${encodeURIComponent(`Hola, me interesa el benchmark de ${company.name}`)}" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Agendar por WhatsApp</a>
</p>

<p style="margin-top: 24px; color: #666; font-size: 13px;">
Arturo Vargas<br>
<strong>Müller & Pérez</strong> — Performance Marketing<br>
+56 9 5419 7432 · mulleryperez.cl
</p>

<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
<p style="color: #999; font-size: 11px;">
Este análisis se realizó con información pública disponible en la web. Si no desea recibir más comunicaciones, responda "no contactar" a este correo.
</p>

</body>
</html>`

  return { subject, html }
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
  return data.id // message_id
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')
  let limitFilter = 20
  let industryFilter = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limitFilter = parseInt(args[++i])
    if (args[i] === '--industry' && args[i + 1]) industryFilter = args[++i]
  }

  if (!RESEND_API_KEY && !isDryRun) {
    console.error('❌ RESEND_API_KEY no definida. Usa --dry-run para probar sin enviar.')
    process.exit(1)
  }

  // 1. Obtener empresas benchmarkeadas con contacto
  let query = supabase
    .from('prospect_companies')
    .select(`
      *,
      prospect_contacts!inner(id, contact_email, contact_name, email_type, is_primary),
      prospect_benchmarks!inner(*)
    `)
    .eq('status', 'qualified')
    .order('creado_en', { ascending: true })
    .limit(limitFilter)

  if (industryFilter) query = query.eq('industry', industryFilter)

  const { data: companies, error } = await query

  if (error) {
    console.error('❌ Error consultando:', error.message)
    process.exit(1)
  }

  if (!companies || companies.length === 0) {
    console.log('✅ No hay empresas pendientes de outreach.')
    return
  }

  // 2. Obtener suppression list
  const { data: suppressions } = await supabase
    .from('prospect_suppressions')
    .select('email')

  const suppressedEmails = new Set((suppressions || []).map(s => s.email.toLowerCase()))

  // 3. Obtener emails ya en CRM (evitar duplicados)
  const { data: crmLeads } = await supabase
    .from('leads')
    .select('email')
    .not('email', 'is', null)

  const crmEmails = new Set((crmLeads || []).map(l => l.email?.toLowerCase()).filter(Boolean))

  // 4. Obtener outreach ya enviados
  const { data: existingOutreach } = await supabase
    .from('prospect_outreach')
    .select('company_id')

  const alreadySent = new Set((existingOutreach || []).map(o => o.company_id))

  console.log(`\n✉️ OUTREACH ${isDryRun ? '(DRY RUN)' : ''}`)
  console.log(`   Candidatas: ${companies.length}`)
  console.log(`   Suprimidas: ${suppressedEmails.size}`)
  console.log(`   Ya en CRM: ${crmEmails.size}`)
  console.log('')

  let sent = 0, skipped = 0

  for (const company of companies) {
    const benchmark = company.prospect_benchmarks[0]
    const contacts = company.prospect_contacts

    // Filtrar por score
    if (benchmark.final_score > MAX_SCORE_TO_SEND) {
      console.log(`   ⏭️ ${company.name} — score ${benchmark.final_score} > ${MAX_SCORE_TO_SEND}, skip`)
      skipped++
      continue
    }

    // Filtrar ya enviados
    if (alreadySent.has(company.id)) {
      skipped++
      continue
    }

    // Elegir mejor contacto (priorizar: sales > info > generic > personal)
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

    // Generar email
    const { subject, html } = generateEmail1(company, benchmark, contact)

    console.log(`   📧 ${company.name} → ${contact.contact_email} (score: ${benchmark.final_score})`)
    console.log(`      Subject: ${subject}`)

    if (isDryRun) {
      sent++
      continue
    }

    try {
      // Enviar
      const messageId = await sendEmail(contact.contact_email, subject, html)
      console.log(`      ✅ Enviado (${messageId})`)

      // Guardar outreach
      await supabase.from('prospect_outreach').insert({
        company_id: company.id,
        contact_id: contact.id,
        benchmark_id: benchmark.id,
        sequence_name: 'benchmark_outbound',
        status: 'email_1_sent',
        current_step: 1,
        email_1_sent_at: new Date().toISOString(),
        email_1_subject: subject,
        email_1_html: html,
        resend_message_ids: [messageId],
        next_send_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // +4 días
      })

      // Guardar evento
      await supabase.from('prospect_outreach_events').insert({
        outreach_id: (await supabase.from('prospect_outreach').select('id').eq('company_id', company.id).single()).data?.id,
        resend_message_id: messageId,
        event_type: 'sent',
      })

      // Actualizar status empresa
      await supabase.from('prospect_companies').update({ status: 'emailed' }).eq('id', company.id)

      // Lead NO se crea aquí — se crea vía webhook de Resend cuando el prospecto
      // ABRE o HACE CLICK en el email. Ver /api/webhooks/resend/route.ts

      sent++

      // Pausa entre envíos (Resend rate limit: 10/seg free, pero mejor ser conservador)
      await new Promise(r => setTimeout(r, 2000))

    } catch (err) {
      console.error(`      ❌ Error: ${err.message}`)

      // Si rebotó, agregar a suppression
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
  console.log(`   Enviados: ${sent}`)
  console.log(`   Saltados: ${skipped}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
