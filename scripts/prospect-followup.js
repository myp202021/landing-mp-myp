/**
 * PROSPECT FOLLOW-UP — Envía emails 2 y 3 de la secuencia
 * Corre diariamente, revisa qué secuencias tienen next_send_at <= ahora
 *
 * Uso:
 *   node scripts/prospect-followup.js
 *   node scripts/prospect-followup.js --dry-run
 *
 * Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND (o RESEND_API_KEY)
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const RESEND_API_KEY = process.env.RESEND || process.env.RESEND_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const FROM_EMAIL = 'Müller & Pérez <contacto@mulleryperez.cl>'
const REPLY_TO = 'contacto@mulleryperez.cl'
const BCC = 'contacto@mulleryperez.cl'

// ── Templates ───────────────────────────────────────────

function generateEmail2(company, benchmark) {
  const subject = `${company.name}: 2 observaciones rápidas de su presencia digital`

  // Elegir 2 insights distintos al email 1
  const brechas = benchmark.brechas || []
  const acciones = benchmark.acciones || []

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">

<p>Hola,</p>

<p>La semana pasada les compartimos un análisis de <strong>${company.name}</strong>. Quería agregar dos puntos que pueden ser útiles:</p>

${brechas.length >= 2 ? `
<p><strong>1.</strong> ${brechas[1] || brechas[0]}</p>
<p><strong>2.</strong> ${brechas[2] || brechas[0]}</p>
` : `
<p>${benchmark.angulo_comercial || 'Detectamos oportunidades concretas de mejora en su presencia digital.'}</p>
`}

${acciones.length > 0 ? `
<p>Una acción rápida que pueden implementar esta semana: <strong>${acciones[0]}</strong></p>
` : ''}

<p>Si quieren revisar el benchmark completo (gratis, sin compromiso), me escriben y agendamos 15 minutos.</p>

<p style="margin-top: 24px; color: #666; font-size: 13px;">
Arturo Vargas<br>
<strong>Müller & Pérez</strong> — Performance Marketing<br>
+56 9 5419 7432
</p>

<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
<p style="color: #999; font-size: 11px;">
Responda "no contactar" si no desea recibir más comunicaciones.
</p>

</body>
</html>`

  return { subject, html }
}

function generateEmail3(company, benchmark) {
  const subject = `Último mensaje: benchmark gratuito para ${company.name}`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">

<p>Hola,</p>

<p>Este es mi último mensaje sobre esto. Tenemos listo un benchmark detallado de <strong>${company.name}</strong> con:</p>

<ul style="padding-left: 20px;">
  <li>Score completo por área (web, RRSS, SEO, pauta)</li>
  <li>Comparativo con empresas similares de ${company.industry}</li>
  <li>3 acciones concretas para mejorar resultados</li>
</ul>

<p>Es gratuito y sin compromiso. Si les interesa, me escriben. Si no, no los vuelvo a contactar por este tema.</p>

<p style="margin-top: 16px;">
  <a href="https://wa.me/56954197432?text=${encodeURIComponent(`Hola, quiero ver el benchmark de ${company.name}`)}" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ver benchmark por WhatsApp</a>
</p>

<p style="margin-top: 24px; color: #666; font-size: 13px;">
Arturo Vargas<br>
<strong>Müller & Pérez</strong> — Performance Marketing<br>
+56 9 5419 7432 · mulleryperez.cl
</p>

<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
<p style="color: #999; font-size: 11px;">
Responda "no contactar" si no desea recibir más comunicaciones.
</p>

</body>
</html>`

  return { subject, html }
}

// ── Send ────────────────────────────────────────────────

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
  if (!res.ok) throw new Error(`Resend: ${JSON.stringify(data)}`)
  return data.id
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const isDryRun = process.argv.includes('--dry-run')

  if (!RESEND_API_KEY && !isDryRun) {
    console.error('❌ RESEND_API_KEY no definida.')
    process.exit(1)
  }

  // Buscar secuencias que toca enviar
  const now = new Date().toISOString()

  const { data: pendientes, error } = await supabase
    .from('prospect_outreach')
    .select(`
      *,
      prospect_companies(*),
      prospect_contacts(contact_email, contact_name),
      prospect_benchmarks(*)
    `)
    .in('status', ['email_1_sent', 'email_2_sent'])
    .lte('next_send_at', now)
    .limit(50)

  if (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }

  if (!pendientes || pendientes.length === 0) {
    console.log('✅ No hay follow-ups pendientes.')
    return
  }

  // Cargar suppressions
  const { data: suppressions } = await supabase.from('prospect_suppressions').select('email')
  const suppressed = new Set((suppressions || []).map(s => s.email.toLowerCase()))

  console.log(`\n📬 FOLLOW-UP ${isDryRun ? '(DRY RUN)' : ''}`)
  console.log(`   Pendientes: ${pendientes.length}\n`)

  let sent = 0, skipped = 0

  for (const seq of pendientes) {
    const company = seq.prospect_companies
    const contact = seq.prospect_contacts
    const benchmark = seq.prospect_benchmarks

    if (!company || !contact || !benchmark) {
      skipped++
      continue
    }

    // Check suppression
    if (suppressed.has(contact.contact_email.toLowerCase())) {
      await supabase.from('prospect_outreach').update({ status: 'unsubscribed' }).eq('id', seq.id)
      skipped++
      continue
    }

    const step = seq.current_step + 1 // 2 o 3
    let email

    if (step === 2) {
      email = generateEmail2(company, benchmark)
    } else if (step === 3) {
      email = generateEmail3(company, benchmark)
    } else {
      // Secuencia completada
      await supabase.from('prospect_outreach').update({ status: 'completed' }).eq('id', seq.id)
      continue
    }

    console.log(`   📧 Email ${step} → ${company.name} (${contact.contact_email})`)

    if (isDryRun) {
      sent++
      continue
    }

    try {
      const messageId = await sendEmail(contact.contact_email, email.subject, email.html)
      console.log(`      ✅ Enviado (${messageId})`)

      const updates = {
        current_step: step,
        status: step === 2 ? 'email_2_sent' : 'email_3_sent',
        [`email_${step}_sent_at`]: new Date().toISOString(),
        [`email_${step}_subject`]: email.subject,
        [`email_${step}_html`]: email.html,
        resend_message_ids: [...(seq.resend_message_ids || []), messageId],
      }

      // Email 3 es el último → programar completado
      if (step === 3) {
        updates.next_send_at = null
        updates.status = 'completed'
      } else {
        // Email 2 → programar email 3 en 7 días
        updates.next_send_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }

      await supabase.from('prospect_outreach').update(updates).eq('id', seq.id)

      await supabase.from('prospect_outreach_events').insert({
        outreach_id: seq.id,
        resend_message_id: messageId,
        event_type: 'sent',
      })

      sent++
      await new Promise(r => setTimeout(r, 2000))

    } catch (err) {
      console.error(`      ❌ ${err.message}`)
      if (err.message.includes('bounce')) {
        await supabase.from('prospect_outreach').update({ status: 'bounced' }).eq('id', seq.id)
        await supabase.from('prospect_suppressions').upsert({
          email: contact.contact_email.toLowerCase(),
          reason: 'bounced',
        }, { onConflict: 'email' })
      }
    }
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN FOLLOW-UP`)
  console.log(`   Enviados: ${sent}`)
  console.log(`   Saltados: ${skipped}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
