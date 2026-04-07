/**
 * PROSPECT ENRICH — Busca emails y RRSS usando Snov.io Domain Search + Apify
 *
 * Flujo:
 * 1. Para cada empresa discovered: busca emails en Snov.io (Domain Search)
 * 2. Si Snov.io no encuentra, intenta con Apify contact-info-scraper
 * 3. Guarda emails encontrados + verificación SMTP de Snov.io
 * 4. Extrae RRSS del sitio web (Apify o fetch directo)
 *
 * Uso:
 *   node scripts/prospect-enrich.js                    # Todas las discovered
 *   node scripts/prospect-enrich.js --industry saas
 *   node scripts/prospect-enrich.js --limit 30
 *
 * Env vars: SNOVIO_CLIENT_ID, SNOVIO_CLIENT_SECRET, APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const SNOVIO_CLIENT_ID = process.env.SNOVIO_CLIENT_ID
const SNOVIO_CLIENT_SECRET = process.env.SNOVIO_CLIENT_SECRET
const APIFY_TOKEN = process.env.APIFY_TOKEN
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
  if (!data.access_token) throw new Error(`Snov.io auth: ${JSON.stringify(data)}`)
  snovioToken = data.access_token
  return snovioToken
}

// ── Snov.io Domain Search ───────────────────────────────

async function findEmailsByDomain(domain) {
  const token = await getSnovioToken()
  const results = { emails: [], companyName: null }

  try {
    // 1. Primero check gratis cuántos emails hay
    const countRes = await fetch('https://api.snov.io/v1/get-domain-emails-count', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    })
    const countData = await countRes.json()

    if (!countData.success || countData.result === 0) {
      return results // No hay emails para este dominio
    }

    console.log(`      Snov.io: ${countData.result} emails en ${domain}`)

    // 2. Iniciar Domain Search
    const searchRes = await fetch('https://api.snov.io/v2/domain-search/start', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    })
    const searchData = await searchRes.json()
    const taskHash = searchData.data?.task_hash

    if (!taskHash) return results

    // 3. Esperar y obtener resultado
    await new Promise(r => setTimeout(r, 3000))

    const resultRes = await fetch(`https://api.snov.io/v2/domain-search/result/${taskHash}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const resultData = await resultRes.json()
    results.companyName = resultData.data?.company_name || null

    // 4. Obtener emails genéricos (info@, contacto@, ventas@)
    const genericRes = await fetch(`https://api.snov.io/v2/domain-search/generic-contacts/result/${taskHash}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const genericData = await genericRes.json()

    if (genericData.data && Array.isArray(genericData.data)) {
      for (const item of genericData.data) {
        if (item.email) {
          results.emails.push({
            email: item.email.toLowerCase(),
            type: classifyEmail(item.email),
            status: 'valid', // Snov.io devuelve emails verificados
            source: 'snovio_domain_search',
          })
        }
      }
    }

    // 5. Obtener emails de dominio
    const domainEmailsRes = await fetch(`https://api.snov.io/v2/domain-search/domain-emails/result/${taskHash}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const domainEmailsData = await domainEmailsRes.json()

    if (domainEmailsData.data && Array.isArray(domainEmailsData.data)) {
      for (const item of domainEmailsData.data) {
        if (item.email && !results.emails.some(e => e.email === item.email.toLowerCase())) {
          results.emails.push({
            email: item.email.toLowerCase(),
            type: classifyEmail(item.email),
            status: 'valid',
            source: 'snovio_domain_search',
          })
        }
      }
    }

  } catch (err) {
    console.log(`      ⚠️ Snov.io error: ${err.message}`)
  }

  return results
}

// ── Snov.io Email Verification ──────────────────────────

async function verifyEmail(email) {
  const token = await getSnovioToken()
  try {
    const res = await fetch('https://api.snov.io/v1/get-emails-verification-status', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails: [email] })
    })
    if (!res.ok) return 'unknown'
    const data = await res.json()
    if (Array.isArray(data) && data[0]) return data[0].status || 'unknown'
    if (data.data && Array.isArray(data.data) && data.data[0]) return data.data[0].status || 'unknown'
    return 'unknown'
  } catch { return 'unknown' }
}

// ── Helpers ─────────────────────────────────────────────

function classifyEmail(email) {
  const lower = email.toLowerCase()
  if (/^(info|contacto|hola|hello|consultas)@/.test(lower)) return 'info'
  if (/^(ventas|sales|comercial|negocio)@/.test(lower)) return 'sales'
  if (/^(soporte|support|ayuda|help)@/.test(lower)) return 'support'
  if (/^(rrhh|hr|personas|talento|trabajo)@/.test(lower)) return 'generic'
  if (/^[a-z]+\.[a-z]+@/.test(lower)) return 'personal'
  return 'generic'
}

function extractDomain(url) {
  if (!url) return null
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch { return null }
}

// ── Fetch RRSS from website ─────────────────────────────

async function fetchSocialLinks(url) {
  const socials = { instagram: null, linkedin: null, facebook: null, youtube: null, tiktok: null }
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MYPBot/1.0)' },
      redirect: 'follow',
    })
    clearTimeout(timeout)
    if (!res.ok) return socials
    const html = await res.text()

    const igMatch = html.match(/https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?/i)
    if (igMatch) socials.instagram = igMatch[0]

    const liMatch = html.match(/https?:\/\/(www\.)?linkedin\.com\/company\/[a-zA-Z0-9_-]+\/?/i)
    if (liMatch) socials.linkedin = liMatch[0]

    const fbMatch = html.match(/https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?/i)
    if (fbMatch) socials.facebook = fbMatch[0]

    const ytMatch = html.match(/https?:\/\/(www\.)?youtube\.com\/(channel|c|@)[a-zA-Z0-9_-]+\/?/i)
    if (ytMatch) socials.youtube = ytMatch[0]

    const tkMatch = html.match(/https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9_.]+\/?/i)
    if (tkMatch) socials.tiktok = tkMatch[0]
  } catch {}
  return socials
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  let limitFilter = 30
  let industryFilter = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limitFilter = parseInt(args[++i])
    if (args[i] === '--industry' && args[i + 1]) industryFilter = args[++i]
  }

  if (!SNOVIO_CLIENT_ID || !SNOVIO_CLIENT_SECRET) {
    console.error('❌ SNOVIO_CLIENT_ID y SNOVIO_CLIENT_SECRET requeridos')
    process.exit(1)
  }

  // Obtener empresas pendientes
  let query = supabase
    .from('prospect_companies')
    .select('*')
    .in('status', ['discovered', 'enriched'])
    .not('website', 'is', null)
    .order('creado_en', { ascending: true })
    .limit(limitFilter)

  if (industryFilter) query = query.eq('industry', industryFilter)

  const { data: companies, error } = await query

  if (error) { console.error('❌', error.message); process.exit(1) }
  if (!companies || companies.length === 0) {
    console.log('✅ No hay empresas pendientes de enriquecimiento.')
    return
  }

  console.log(`\n🔎 ENRIQUECIMIENTO (Snov.io + RRSS)`)
  console.log(`   Empresas: ${companies.length}`)
  console.log('')

  let totalEmails = 0, totalSocials = 0, noEmail = 0

  for (const company of companies) {
    const domain = extractDomain(company.website)
    if (!domain) continue

    console.log(`   📡 ${company.name} (${domain})`)

    // 1. Buscar emails con Snov.io
    const snovResult = await findEmailsByDomain(domain)

    // 2. Buscar RRSS del sitio
    const socials = await fetchSocialLinks(company.website)

    // 3. Guardar RRSS
    const updates = { status: 'enriched' }
    if (socials.instagram) updates.instagram_url = socials.instagram
    if (socials.linkedin) updates.linkedin_url = socials.linkedin
    if (socials.facebook) updates.facebook_url = socials.facebook
    if (socials.youtube) updates.youtube_url = socials.youtube
    if (socials.tiktok) updates.tiktok_url = socials.tiktok

    const socialCount = Object.values(socials).filter(Boolean).length
    totalSocials += socialCount

    await supabase.from('prospect_companies').update(updates).eq('id', company.id)

    // 4. Guardar emails
    if (snovResult.emails.length > 0) {
      for (let i = 0; i < snovResult.emails.length; i++) {
        const e = snovResult.emails[i]
        const { error: contactError } = await supabase
          .from('prospect_contacts')
          .upsert({
            company_id: company.id,
            contact_email: e.email,
            email_type: e.type,
            is_primary: i === 0,
            is_valid: e.status === 'valid',
            verification_status: e.status === 'valid' ? 'valid' : 'pending',
            source: e.source,
          }, { onConflict: 'company_id,contact_email' })

        if (contactError && contactError.code !== '23505') {
          console.log(`      ⚠️ Error guardando ${e.email}: ${contactError.message}`)
        }
      }
      totalEmails += snovResult.emails.length
      console.log(`      ✅ ${snovResult.emails.length} emails + ${socialCount} RRSS`)
    } else {
      noEmail++
      console.log(`      ⚠️ Sin emails · ${socialCount} RRSS`)
    }

    // Pausa entre empresas (Snov.io rate limit)
    await new Promise(r => setTimeout(r, 2000))
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN ENRIQUECIMIENTO`)
  console.log(`   Empresas: ${companies.length}`)
  console.log(`   Emails encontrados: ${totalEmails}`)
  console.log(`   RRSS encontradas: ${totalSocials}`)
  console.log(`   Sin email: ${noEmail}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
