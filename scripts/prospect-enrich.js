/**
 * PROSPECT ENRICH — Enriquecimiento de empresas descubiertas
 * Extrae emails, teléfonos y redes sociales desde el sitio web (Apify Contact Info Scraper)
 *
 * Uso:
 *   node scripts/prospect-enrich.js                    # Enriquece todas las 'discovered'
 *   node scripts/prospect-enrich.js --batch batch_123  # Solo un batch
 *   node scripts/prospect-enrich.js --limit 50         # Max 50 empresas
 *   node scripts/prospect-enrich.js --industry saas    # Solo una industria
 *
 * Env vars: APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ── Helpers ─────────────────────────────────────────────

function classifyEmail(email) {
  const lower = email.toLowerCase()
  if (/^(info|contacto|hola|hello|consultas)@/.test(lower)) return 'info'
  if (/^(ventas|sales|comercial|negocio)@/.test(lower)) return 'sales'
  if (/^(soporte|support|ayuda|help)@/.test(lower)) return 'support'
  if (/^(rrhh|hr|personas|talento|trabajo)@/.test(lower)) return 'generic'
  // Si tiene nombre de persona probable
  if (/^[a-z]+\.[a-z]+@/.test(lower)) return 'personal'
  return 'generic'
}

function normalizeUrl(url) {
  if (!url) return null
  url = url.trim()
  if (!url.startsWith('http')) url = 'https://' + url
  return url
}

function extractSocialUrl(urls, platform) {
  if (!urls || !Array.isArray(urls)) return null
  const patterns = {
    instagram: /instagram\.com/i,
    linkedin: /linkedin\.com/i,
    facebook: /facebook\.com/i,
    youtube: /youtube\.com/i,
    tiktok: /tiktok\.com/i,
  }
  const match = urls.find(u => patterns[platform]?.test(u))
  return match || null
}

// ── Apify Contact Info Scraper ─────────────────────────

async function enrichBatch(urls) {
  // Procesar en chunks de 25 URLs para no sobrecargar
  const CHUNK_SIZE = 25
  const allResults = []

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE)
    console.log(`   📡 Enriqueciendo URLs ${i + 1}-${i + chunk.length} de ${urls.length}...`)

    const res = await fetch(
      `https://api.apify.com/v2/acts/vdrmota~contact-info-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=300`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: chunk.map(u => ({ url: u })),
          maxDepth: 2,             // Navegar hasta 2 niveles (contacto, about)
          maxRequestsPerStartUrl: 5,
          proxyConfiguration: { useApifyProxy: true },
        })
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error(`   ❌ Apify Contact Scraper error: ${res.status} — ${err}`)
      continue
    }

    const results = await res.json()
    allResults.push(...results)

    // Pausa entre chunks
    if (i + CHUNK_SIZE < urls.length) {
      console.log('   ⏳ Pausa 3s entre chunks...')
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  return allResults
}

// ── Guardar resultados ─────────────────────────────────

async function saveEnrichment(company, enrichData) {
  // Actualizar redes sociales en la empresa
  const socialUrls = enrichData.socialLinks || enrichData.socials || []
  const allUrls = [...socialUrls, ...(enrichData.urls || [])]

  const updates = {}
  const ig = extractSocialUrl(allUrls, 'instagram')
  const li = extractSocialUrl(allUrls, 'linkedin')
  const fb = extractSocialUrl(allUrls, 'facebook')
  const yt = extractSocialUrl(allUrls, 'youtube')
  const tk = extractSocialUrl(allUrls, 'tiktok')

  if (ig) updates.instagram_url = ig
  if (li) updates.linkedin_url = li
  if (fb) updates.facebook_url = fb
  if (yt) updates.youtube_url = yt
  if (tk) updates.tiktok_url = tk

  // Actualizar teléfono si no tenía
  const phones = enrichData.phones || enrichData.phoneNumbers || []
  if (phones.length > 0 && !company.phone) {
    updates.phone = phones[0]
  }

  // Marcar como enriquecida
  updates.status = 'enriched'

  await supabase
    .from('prospect_companies')
    .update(updates)
    .eq('id', company.id)

  // Guardar emails como contactos
  const emails = enrichData.emails || []
  const uniqueEmails = [...new Set(emails.map(e => e.toLowerCase()))]
    .filter(e => {
      // Filtrar emails basura
      if (e.includes('example.com')) return false
      if (e.includes('sentry.io')) return false
      if (e.includes('wixpress.com')) return false
      if (e.includes('wordpress.com') && !e.includes('@')) return false
      if (e.length < 5) return false
      return true
    })

  for (let i = 0; i < uniqueEmails.length; i++) {
    const email = uniqueEmails[i]
    const { error } = await supabase
      .from('prospect_contacts')
      .upsert({
        company_id: company.id,
        contact_email: email,
        email_type: classifyEmail(email),
        is_primary: i === 0,
        source: 'website_scrape',
      }, {
        onConflict: 'company_id,contact_email',
        ignoreDuplicates: true,
      })

    if (error && error.code !== '23505') {
      console.error(`   ⚠️ Error guardando email ${email}: ${error.message}`)
    }
  }

  return { emailsFound: uniqueEmails.length, socialsFound: Object.keys(updates).filter(k => k.endsWith('_url')).length }
}

// ── Main ────────────────────────────────────────────────

async function main() {
  // Parse args
  const args = process.argv.slice(2)
  let batchFilter = null
  let limitFilter = 200
  let industryFilter = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--batch' && args[i + 1]) batchFilter = args[++i]
    if (args[i] === '--limit' && args[i + 1]) limitFilter = parseInt(args[++i])
    if (args[i] === '--industry' && args[i + 1]) industryFilter = args[++i]
  }

  // Obtener empresas pendientes de enriquecimiento
  let query = supabase
    .from('prospect_companies')
    .select('*')
    .eq('status', 'discovered')
    .not('website', 'is', null)
    .order('creado_en', { ascending: true })
    .limit(limitFilter)

  if (batchFilter) query = query.eq('batch_id', batchFilter)
  if (industryFilter) query = query.eq('industry', industryFilter)

  const { data: companies, error } = await query

  if (error) {
    console.error('❌ Error consultando empresas:', error.message)
    process.exit(1)
  }

  if (!companies || companies.length === 0) {
    console.log('✅ No hay empresas pendientes de enriquecimiento.')
    return
  }

  console.log(`\n🔎 ENRIQUECIMIENTO DE PROSPECTOS`)
  console.log(`   Empresas a procesar: ${companies.length}`)
  if (batchFilter) console.log(`   Batch: ${batchFilter}`)
  if (industryFilter) console.log(`   Industria: ${industryFilter}`)

  // Preparar URLs
  const urls = companies.map(c => c.website)

  // Llamar Apify
  const enrichResults = await enrichBatch(urls)

  // Mapear resultados por URL
  const resultsByUrl = {}
  for (const r of enrichResults) {
    const url = r.url || r.startUrl
    if (url) resultsByUrl[url] = r
  }

  let totalEmails = 0, totalSocials = 0, noData = 0

  for (const company of companies) {
    // Buscar resultado por URL (flexible matching)
    let enrichData = resultsByUrl[company.website]
    if (!enrichData) {
      // Intentar match por dominio
      const domain = company.website_domain
      enrichData = Object.values(resultsByUrl).find(r => {
        const rUrl = r.url || r.startUrl || ''
        return rUrl.includes(domain)
      })
    }

    if (!enrichData || (!enrichData.emails?.length && !enrichData.socialLinks?.length)) {
      // Marcar como enriquecida pero sin datos
      await supabase.from('prospect_companies').update({ status: 'enriched' }).eq('id', company.id)
      noData++
      continue
    }

    const { emailsFound, socialsFound } = await saveEnrichment(company, enrichData)
    totalEmails += emailsFound
    totalSocials += socialsFound
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN ENRIQUECIMIENTO`)
  console.log(`   Empresas procesadas: ${companies.length}`)
  console.log(`   Emails encontrados: ${totalEmails}`)
  console.log(`   Redes sociales: ${totalSocials}`)
  console.log(`   Sin datos: ${noData}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
