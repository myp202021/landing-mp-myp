/**
 * RADAR DE PROPIEDADES — CyM Corredora
 * Scrapea PI diariamente, detecta nuevas publicaciones, guarda en Supabase, envía email
 *
 * Comunas: Lo Barnechea, Vitacura, Las Condes, La Reina
 * Filtro: casas usadas >15.000 UF
 * Cron: 04:00 AM Chile (07:00 UTC)
 *
 * Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
)
const RESEND_API_KEY = process.env.RESEND || process.env.RESEND_API_KEY
const APIFY_TOKEN = process.env.APIFY_TOKEN

if (!APIFY_TOKEN) {
  console.error('❌ APIFY_TOKEN no definido — PI bloquea IPs de datacenter, el scraping debe pasar por Apify')
  process.exit(1)
}

// Nota: PI rompió el filtro `_PriceRange_15000UF-0UF` en abril 2026 → ahora devuelve vacío.
// Solución: pedir todas las casas usadas por comuna y filtrar por precio ≥ 15.000 UF en código.
// Para capturar más resultados se paginan las primeras 4 páginas (49 items × 4 = ~196 por comuna).
const SEARCHES = [
  { comuna: 'Lo Barnechea', baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/lo-barnechea-metropolitana/' },
  { comuna: 'Vitacura',     baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/vitacura-metropolitana/' },
  { comuna: 'Las Condes',   baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/las-condes-metropolitana/' },
  { comuna: 'La Reina',     baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/la-reina-metropolitana/' },
]

const INVALID_REGIONS = ['maule', 'curicó', 'valparaíso', 'biobío', 'araucanía', 'coquimbo', 'ohiggins', 'atacama', 'los lagos', 'los ríos']

// ─────────────────────────────────────────────────────────
// Scraping vía Apify (apify/cheerio-scraper)
// ─────────────────────────────────────────────────────────
// PI bloquea IPs de datacenter (incluyendo GitHub Actions),
// por eso pasamos todos los requests a través de Apify que
// usa IPs residenciales y no es detectado como bot.
//
// Estrategia:
// 1. Generamos 16 startUrls: 4 comunas × 4 páginas (_Desde_1, 50, 98, 146)
// 2. Pasamos al actor apify/cheerio-scraper con una pageFunction
//    que extrae cada listing del DOM con selectores CSS
// 3. El actor ejecuta en Apify con IPs residenciales, retorna array
//    de listings que nosotros juntamos por comuna

function buildStartUrls() {
  const urls = []
  const offsets = [null, 49, 97, 145]  // página 1, 2, 3, 4
  for (const s of SEARCHES) {
    for (const off of offsets) {
      urls.push({
        url: off ? `${s.baseUrl}_Desde_${off + 1}` : s.baseUrl,
        userData: { comuna: s.comuna },
      })
    }
  }
  return urls
}

// Esta función se ejecuta DENTRO de Apify (no en Node de GH Actions)
// Usa cheerio ($) para parsear el DOM y retorna un array de listings.
const PAGE_FUNCTION = `async function pageFunction(context) {
  const { $, request } = context
  const comuna = request.userData.comuna
  const results = []

  $('.poly-card').each(function () {
    const card = $(this)
    const title = card.find('.poly-component__title').text().trim()
    const location = card.find('.poly-component__location').text().trim()

    // Precio en aria-label
    const priceLabel = card.find('.poly-price__current [aria-label]').attr('aria-label') || ''
    const priceMatch = priceLabel.match(/([\\d.,]+)\\s*(UF|unidades de fomento|pesos)/i)
    const priceRaw = priceMatch ? priceMatch[1].replace(/[.,]/g, '') : '0'
    const currency = priceMatch ? priceMatch[2].toLowerCase() : ''
    let priceUF = parseInt(priceRaw, 10) || 0
    if (currency === 'pesos' || priceUF > 500000) {
      priceUF = Math.round(priceUF / 38000)
    }

    // Link y ID MLC
    const link = card.find('a[href*="portalinmobiliario.com/MLC"]').first().attr('href') || ''
    const idMatch = link.match(/MLC-?\\d+/)
    const id = idMatch ? idMatch[0] : ''

    // Atributos (dorm/baño/m²)
    let beds = '', baths = '', m2 = ''
    card.find('.poly-component__attributes-list li').each(function () {
      const t = $(this).text().trim()
      if (/dormitorio/i.test(t) && !beds) { const m = t.match(/\\d+/); if (m) beds = m[0] }
      else if (/baño/i.test(t) && !baths) { const m = t.match(/\\d+/); if (m) baths = m[0] }
      else if (/m²/i.test(t) && !m2)     { const m = t.match(/[\\d.,]+/); if (m) m2 = m[0] }
    })

    const barrio = location.split(',')[0] ? location.split(',')[0].trim() : ''

    if (id && title && priceUF > 0) {
      results.push({
        id, comuna, barrio, title, price_uf: priceUF,
        beds, baths, m2, location, link
      })
    }
  })

  return { comuna, url: request.url, count: results.length, listings: results }
}`

async function scrapeAllViaApify() {
  const startUrls = buildStartUrls()
  console.log(`🕸️  Apify cheerio-scraper — ${startUrls.length} URLs (${SEARCHES.length} comunas × 4 páginas)`)

  const input = {
    startUrls,
    pageFunction: PAGE_FUNCTION,
    proxyConfiguration: { useApifyProxy: true },
    maxRequestRetries: 3,
    maxConcurrency: 4,
    ignoreSslErrors: false,
  }

  // run-sync-get-dataset-items ejecuta sincrónico y devuelve directamente los items del dataset
  const res = await fetch(
    `https://api.apify.com/v2/acts/apify~cheerio-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=280&memory=1024`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Apify ${res.status}: ${errText.substring(0, 300)}`)
  }

  const datasetItems = await res.json()
  console.log(`   Apify devolvió ${datasetItems.length} páginas procesadas`)

  // Cada item es { comuna, url, count, listings[] }. Unir todos y dedupe por id.
  const porComuna = {}
  const seen = new Map()
  for (const item of datasetItems) {
    const comuna = item.comuna || 'Desconocida'
    porComuna[comuna] = porComuna[comuna] || []
    for (const l of (item.listings || [])) {
      // Filtros que hacíamos antes:
      const locLower = (l.location || '').toLowerCase()
      const wrongRegion = INVALID_REGIONS.some(r => locLower.includes(r))
      if (l.price_uf < 15000 || wrongRegion || !l.id) continue
      if (seen.has(l.id)) continue
      seen.set(l.id, l)
      porComuna[comuna].push(l)
    }
  }

  // Log por comuna
  for (const s of SEARCHES) {
    console.log(`   ${s.comuna}: ${(porComuna[s.comuna] || []).length} casas (≥15.000 UF)`)
  }

  return Array.from(seen.values())
}

// ── Save to Supabase and detect new ─────────────────────

async function saveAndDetectNew(listings) {
  const today = new Date().toISOString().split('T')[0]

  // Get existing IDs
  const { data: existing } = await supabase.from('pi_listings').select('id')
  const existingIds = new Set((existing || []).map(e => e.id))

  const newListings = []
  let updated = 0

  for (const l of listings) {
    if (existingIds.has(l.id)) {
      // Update last_seen
      await supabase.from('pi_listings').update({ last_seen: today, is_new: false }).eq('id', l.id)
      updated++
    } else {
      // New listing!
      const { error } = await supabase.from('pi_listings').insert({
        ...l,
        first_seen: today,
        last_seen: today,
        is_new: true,
      })
      if (!error) newListings.push(l)
    }
  }

  // Mark old listings that weren't seen today
  await supabase.from('pi_listings').update({ is_new: false }).neq('last_seen', today)

  return { newListings, updated, total: listings.length }
}

// ── Send email with new listings ────────────────────────

async function sendEmail(newListings, totalScraped) {
  if (!RESEND_API_KEY) { console.log('⚠️ No RESEND key — skip email'); return }

  const today = new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const byComuna = {}
  newListings.forEach(l => byComuna[l.comuna] = (byComuna[l.comuna] || 0) + 1)

  const listingsHtml = newListings.length > 0
    ? newListings.map(l => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;">
          <strong style="color:#1B2A4A;">${l.comuna}</strong><br>
          <span style="color:#6b7280;font-size:11px;">${l.barrio}</span>
        </td>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;">${l.title.substring(0, 40)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:800;color:#1B2A4A;">${l.price_uf.toLocaleString()} UF</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:11px;">${l.beds || '—'} dorm · ${l.baths || '—'} baños · ${l.m2 || '—'} m²</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;"><a href="${l.link}" style="color:#2563EB;font-size:11px;text-decoration:none;">Ver →</a></td>
      </tr>`).join('')
    : '<tr><td colspan="5" style="padding:20px;text-align:center;color:#999;">No hay propiedades nuevas hoy.</td></tr>'

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
  <body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:20px 0;">
  <tr><td align="center">
  <table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;">

  <tr><td style="background:linear-gradient(135deg,#1B2A4A,#2D4A7A);padding:20px 28px;color:white;">
    <p style="margin:0;font-size:18px;font-weight:800;">Radar de Propiedades</p>
    <p style="margin:4px 0 0;font-size:11px;opacity:0.8;">${today} · Casas usadas >15.000 UF · Lo Barnechea · Vitacura · Las Condes · La Reina</p>
  </td></tr>

  <tr><td style="padding:20px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align:center;padding:12px;background:#D1FAE5;border-radius:8px;">
          <span style="display:block;font-size:28px;font-weight:900;color:#065F46;">${newListings.length}</span>
          <span style="font-size:10px;color:#065F46;text-transform:uppercase;">Nuevas hoy</span>
        </td>
        <td style="width:12px;"></td>
        <td style="text-align:center;padding:12px;background:#EFF6FF;border-radius:8px;">
          <span style="display:block;font-size:28px;font-weight:900;color:#1B2A4A;">${totalScraped}</span>
          <span style="font-size:10px;color:#6b7280;text-transform:uppercase;">Total activas</span>
        </td>
      </tr>
    </table>
  </td></tr>

  ${newListings.length > 0 ? `
  <tr><td style="padding:0 28px 20px;">
    <p style="margin:0 0 8px;font-size:11px;color:#1B2A4A;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Propiedades nuevas</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr style="background:#1B2A4A;">
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Comuna</th>
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Título</th>
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Precio</th>
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Detalle</th>
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Link</th>
      </tr>
      ${listingsHtml}
    </table>
  </td></tr>` : ''}

  <tr><td style="padding:16px 28px;background:#f8f9fa;border-top:1px solid #e5e7eb;">
    <p style="margin:0;font-size:10px;color:#9ca3af;text-align:center;">Radar de Propiedades · Muller y Pérez para CyM Corredora · Fuente: Portal Inmobiliario</p>
  </td></tr>

  </table></td></tr></table></body></html>`

  const subject = newListings.length > 0
    ? `🏠 ${newListings.length} propiedad${newListings.length > 1 ? 'es' : ''} nueva${newListings.length > 1 ? 's' : ''} — ${today}`
    : `Radar Propiedades — Sin novedades · ${today}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Radar Propiedades <contacto@mulleryperez.cl>',
      to: ['contacto@mulleryperez.cl'],
      subject,
      html,
    })
  })
  const data = await res.json()
  console.log(res.ok ? `✉️ Email enviado: ${data.id}` : `❌ Email error: ${JSON.stringify(data)}`)
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const isDryRun = process.argv.includes('--dry-run')
  const isBackfillSilent = process.argv.includes('--backfill-silent')

  console.log('🏠 RADAR PROPIEDADES — ' + new Date().toISOString().split('T')[0])
  console.log('   Comunas: Lo Barnechea, Vitacura, Las Condes, La Reina')
  console.log('   Filtro: casas usadas >15.000 UF')
  console.log('   Scraping vía Apify (PI bloquea IPs de datacenter)')
  if (isDryRun) console.log('   ⚠️  DRY-RUN — solo scraping, sin Supabase ni email')
  if (isBackfillSilent) console.log('   ⚠️  BACKFILL SILENCIOSO — inserta todo con is_new=false, sin email')
  console.log('')

  let allListings = []
  try {
    allListings = await scrapeAllViaApify()
  } catch (e) {
    console.error(`❌ Error Apify: ${e.message}`)
    process.exit(1)
  }

  console.log(`\n   Total scrapeadas: ${allListings.length}`)

  // Muestra sample de 3 listings para verificación
  if (allListings.length > 0) {
    console.log('\n   📋 Sample (primeros 3):')
    allListings.slice(0, 3).forEach((l, i) => {
      console.log(`      ${i + 1}. [${l.comuna}] ${l.price_uf.toLocaleString()} UF · ${l.beds || '?'}D/${l.baths || '?'}B/${l.m2 || '?'}m² · ${l.title.substring(0, 50)}`)
    })
  }

  if (isDryRun) {
    console.log('\n✅ Dry-run completado — sin tocar Supabase ni email')
    return
  }

  if (isBackfillSilent) {
    console.log('\n   🗃️  Backfill silencioso: insertando todo con is_new=false...')
    const today = new Date().toISOString().split('T')[0]
    let inserted = 0, skipped = 0
    const { data: existing } = await supabase.from('pi_listings').select('id')
    const existingIds = new Set((existing || []).map(e => e.id))
    for (const l of allListings) {
      if (existingIds.has(l.id)) { skipped++; continue }
      const { error } = await supabase.from('pi_listings').insert({
        ...l, first_seen: today, last_seen: today, is_new: false,
      })
      if (!error) inserted++
    }
    console.log(`   Insertadas: ${inserted} · Ya existían: ${skipped}`)
    console.log('\n✅ Backfill completado — sin email')
    return
  }

  // Save and detect new
  const { newListings, updated, total } = await saveAndDetectNew(allListings)
  console.log(`   Nuevas: ${newListings.length}`)
  console.log(`   Actualizadas: ${updated}`)

  // Send email
  await sendEmail(newListings, total)

  console.log('\n✅ Radar completado')
}

main().catch(err => {
  console.error('💥', err.message)
  process.exit(1)
})
