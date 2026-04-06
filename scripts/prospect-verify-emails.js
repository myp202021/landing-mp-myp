/**
 * PROSPECT VERIFY EMAILS — Valida emails con Snov.io antes de enviar
 *
 * Flujo: discover → enrich → VERIFY → benchmark → approve → outreach
 * Solo emails "valid" pasan. Invalid/disposable → suppression list.
 *
 * Uso:
 *   node scripts/prospect-verify-emails.js                      # Todas las enriched
 *   node scripts/prospect-verify-emails.js --industry saas      # Solo SaaS
 *   node scripts/prospect-verify-emails.js --limit 30
 *
 * Env vars: SNOVIO_CLIENT_ID, SNOVIO_CLIENT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const SNOVIO_CLIENT_ID = process.env.SNOVIO_CLIENT_ID
const SNOVIO_CLIENT_SECRET = process.env.SNOVIO_CLIENT_SECRET
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ── Snov.io Auth ────────────────────────────────────────

let snovioToken = null

async function getSnovioToken() {
  if (snovioToken) return snovioToken

  const res = await fetch('https://api.snov.io/v1/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: SNOVIO_CLIENT_ID,
      client_secret: SNOVIO_CLIENT_SECRET,
    })
  })

  const data = await res.json()
  if (!data.access_token) {
    throw new Error(`Snov.io auth falló: ${JSON.stringify(data)}`)
  }

  snovioToken = data.access_token
  console.log('   🔑 Snov.io autenticado')
  return snovioToken
}

// ── Snov.io Email Verification ──────────────────────────

async function verifyEmail(email) {
  const token = await getSnovioToken()

  // Paso 1: Agregar email a verificación
  const addRes = await fetch('https://api.snov.io/v1/add-emails-to-verification', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emails: [email] })
  })

  if (!addRes.ok) {
    const err = await addRes.text()
    console.log(`   ⚠️ Error agregando ${email}: ${err}`)
    return 'unknown'
  }

  // Pausa para que Snov.io procese
  await new Promise(r => setTimeout(r, 3000))

  // Paso 2: Consultar resultado
  const checkRes = await fetch('https://api.snov.io/v1/get-emails-verification-status', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emails: [email] })
  })

  if (!checkRes.ok) {
    return 'unknown'
  }

  const result = await checkRes.json()

  // Snov.io devuelve array con status por email
  if (result && Array.isArray(result) && result.length > 0) {
    return result[0].status || 'unknown'
  }

  // Formato alternativo
  if (result && result.data && Array.isArray(result.data)) {
    return result.data[0]?.status || 'unknown'
  }

  return 'unknown'
}

// Alternativa más simple: verificación individual
async function verifyEmailSimple(email) {
  const token = await getSnovioToken()

  const res = await fetch('https://api.snov.io/v1/get-emails-verification-status', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emails: [email] })
  })

  if (!res.ok) {
    // Intentar con endpoint alternativo
    const res2 = await fetch('https://api.snov.io/v1/prospect-email-verification', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })

    if (!res2.ok) return 'unknown'
    const data2 = await res2.json()
    return data2.status || data2.result || 'unknown'
  }

  const data = await res.json()

  // Parsear respuesta
  if (Array.isArray(data)) return data[0]?.status || 'unknown'
  if (data.data && Array.isArray(data.data)) return data.data[0]?.status || 'unknown'
  if (data.status) return data.status
  return 'unknown'
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  let limitFilter = 60
  let industryFilter = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limitFilter = parseInt(args[++i])
    if (args[i] === '--industry' && args[i + 1]) industryFilter = args[++i]
  }

  if (!SNOVIO_CLIENT_ID || !SNOVIO_CLIENT_SECRET) {
    console.error('❌ SNOVIO_CLIENT_ID y SNOVIO_CLIENT_SECRET requeridos')
    process.exit(1)
  }

  // Obtener contactos no verificados de empresas enriched
  let query = supabase
    .from('prospect_contacts')
    .select(`
      id, contact_email, company_id, is_valid,
      prospect_companies!inner(id, industry, status, name)
    `)
    .eq('is_valid', true) // Solo los que no han sido marcados como inválidos
    .in('prospect_companies.status', ['enriched', 'benchmarked'])
    .order('id', { ascending: true })
    .limit(limitFilter)

  if (industryFilter) {
    query = query.eq('prospect_companies.industry', industryFilter)
  }

  const { data: contacts, error } = await query

  if (error) {
    console.error('❌ Error consultando contactos:', error.message)
    process.exit(1)
  }

  if (!contacts || contacts.length === 0) {
    console.log('✅ No hay emails pendientes de verificación.')
    return
  }

  console.log(`\n🔍 VERIFICACIÓN DE EMAILS (Snov.io)`)
  console.log(`   Emails a verificar: ${contacts.length}`)
  if (industryFilter) console.log(`   Industria: ${industryFilter}`)
  console.log('')

  let valid = 0, invalid = 0, catchAll = 0, unknown = 0

  for (const contact of contacts) {
    const email = contact.contact_email
    const companyName = contact.prospect_companies?.name || '?'

    process.stdout.write(`   ${companyName} — ${email} ... `)

    try {
      const status = await verifyEmailSimple(email)

      switch (status) {
        case 'valid':
          console.log('✅ válido')
          valid++
          await supabase.from('prospect_contacts').update({ is_valid: true, verification_status: 'valid' }).eq('id', contact.id)
          break

        case 'invalid':
        case 'not_valid':
          console.log('❌ inválido → suppression')
          invalid++
          await supabase.from('prospect_contacts').update({ is_valid: false, verification_status: 'invalid' }).eq('id', contact.id)
          await supabase.from('prospect_suppressions').upsert({
            email: email.toLowerCase(),
            reason: 'bounced',
          }, { onConflict: 'email' })
          break

        case 'disposable':
          console.log('🗑️ disposable → suppression')
          invalid++
          await supabase.from('prospect_contacts').update({ is_valid: false, verification_status: 'disposable' }).eq('id', contact.id)
          await supabase.from('prospect_suppressions').upsert({
            email: email.toLowerCase(),
            reason: 'manual',
          }, { onConflict: 'email' })
          break

        case 'catch_all':
        case 'catch-all':
          console.log('⚠️ catch-all (dominio acepta todo)')
          catchAll++
          await supabase.from('prospect_contacts').update({ verification_status: 'catch_all' }).eq('id', contact.id)
          break

        default:
          console.log(`❓ ${status}`)
          unknown++
          await supabase.from('prospect_contacts').update({ verification_status: status || 'unknown' }).eq('id', contact.id)
          break
      }

      // Pausa entre verificaciones (Snov.io rate limit)
      await new Promise(r => setTimeout(r, 1500))

    } catch (err) {
      console.log(`💥 error: ${err.message}`)
      unknown++
    }
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN VERIFICACIÓN`)
  console.log(`   Total: ${contacts.length}`)
  console.log(`   ✅ Válidos: ${valid}`)
  console.log(`   ❌ Inválidos: ${invalid} (agregados a suppression)`)
  console.log(`   ⚠️ Catch-all: ${catchAll}`)
  console.log(`   ❓ Sin verificar: ${unknown}`)
  console.log(`   📧 Listos para envío: ${valid + catchAll}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
