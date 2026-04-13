/**
 * RADAR DE PROPIEDADES — CyM Corredora
 * Scrapea PI con ScrapingBee (paginado), detecta nuevas, guarda en Supabase, envía email
 *
 * Comunas: Lo Barnechea, Vitacura, Las Condes, La Reina
 * Filtro: casas usadas ≥15.000 UF
 * Paginación: 4 páginas por comuna (~192 listings c/u)
 * Cron: 04:00 AM Chile (07:00 UTC)
 *
 * Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND, SCRAPINGBEE_API_KEY
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
)
const RESEND_API_KEY = process.env.RESEND || process.env.RESEND_API_KEY
const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_API_KEY

if (!SCRAPINGBEE_KEY) {
  console.error('❌ SCRAPINGBEE_API_KEY no definida')
  process.exit(1)
}

const PAGES_PER_COMUNA = 4
const OFFSETS = [0, 49, 97, 145]

const SEARCHES = [
  { comuna: 'Lo Barnechea', baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/lo-barnechea-metropolitana/' },
  { comuna: 'Vitacura',     baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/vitacura-metropolitana/' },
  { comuna: 'Las Condes',   baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/las-condes-metropolitana/' },
  { comuna: 'La Reina',     baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/la-reina-metropolitana/' },
]

const INVALID_REGIONS = ['maule', 'curicó', 'valparaíso', 'biobío', 'araucanía', 'coquimbo', 'ohiggins', 'atacama', 'los lagos', 'los ríos']

// ── ScrapingBee fetch ───────────────────────────────────

async function scrapeOnePage(url, comuna, pageNum) {
  const params = new URLSearchParams({
    api_key: SCRAPINGBEE_KEY,
    url,
    render_js: 'true',
    premium_proxy: 'true',
    country_code: 'cl',
    wait: '5000',
    block_ads: 'true',
  })

  const label = `${comuna} p${pageNum}`
  console.log(`   🐝 ${label}...`)

  const res = await fetch(`https://app.scrapingbee.com/api/v1?${params.toString()}`)
  if (!res.ok) {
    const body = await res.text()
    console.error(`   ❌ ${label}: HTTP ${res.status} — ${body.substring(0, 200)}`)
    return []
  }

  const html = await res.text()
  const listings = extractListings(html, comuna)
  console.log(`   ✅ ${label}: ${listings.length} listings`)
  return listings
}

async function scrapeComuna(search) {
  const allListings = []
  for (let i = 0; i < OFFSETS.length; i++) {
    const offset = OFFSETS[i]
    const url = offset === 0 ? search.baseUrl : `${search.baseUrl}_Desde_${offset}`
    const listings = await scrapeOnePage(url, search.comuna, i + 1)
    allListings.push(...listings)
    if (listings.length === 0) {
      console.log(`   ⏹️  ${search.comuna}: página ${i + 1} vacía, deteniendo`)
      break
    }
    if (i < OFFSETS.length - 1) await new Promise(r => setTimeout(r, 2000))
  }
  return allListings
}

// ── Extraer listings del HTML ───────────────────────────

function extractListings(html, comuna) {
  const results = []

  // Extraer tags de publicación por MLC ID desde el JSON embebido en PI
  const pubTags = {}
  const pubRegex = /"id":"(MLC-?\d+)"[\s\S]{0,3000}?(?:"float_highlight":\{"text":"(PUBLICADO (?:HOY|ESTA SEMANA))"|"components":\[)/g
  let pm
  while ((pm = pubRegex.exec(html)) !== null) {
    const mlcId = pm[1].replace(/^MLC(\d)/, 'MLC-$1')
    if (pm[2]) pubTags[mlcId] = pm[2]
  }

  // Extraer listings del HTML renderizado
  const titleMatches = [...html.matchAll(/class="poly-component__title"[^>]*>([\s\S]*?)<\//g)]
  const locMatches = [...html.matchAll(/class="[^"]*poly-component__location[^"]*"[^>]*>([^<]+)</g)]
  const priceMatches = [...html.matchAll(/aria-label="([\d.,]+)\s*(UF|unidades de fomento|pesos)/gi)]
  const linkArr = [...new Set(
    [...html.matchAll(/href="(https?:\/\/(?:www\.)?portalinmobiliario\.com\/MLC[^"]+)"/g)].map(m => m[1])
  )]
  const attrMatches = [...html.matchAll(/class="poly-component__attributes-list"[^>]*>([\s\S]*?)<\/ul/g)]

  const count = Math.min(titleMatches.length, priceMatches.length, locMatches.length)

  for (let i = 0; i < count; i++) {
    const title = titleMatches[i]?.[1]?.replace(/<[^>]+>/g, '').trim() || ''
    const priceRaw = (priceMatches[i]?.[1] || '0').replace(/[.,]/g, '')
    const currency = (priceMatches[i]?.[2] || '').toLowerCase()
    let priceUF = parseInt(priceRaw, 10) || 0
    if (currency === 'pesos' || priceUF > 500000) priceUF = Math.round(priceUF / 38000)

    const location = locMatches[i]?.[1]?.trim() || ''
    const link = linkArr[i] || ''
    const idMatch = link.match(/MLC-?\d+/)
    const id = idMatch ? idMatch[0] : ''

    let beds = '', baths = '', m2 = ''
    if (attrMatches[i]?.[1]) {
      const items = [...attrMatches[i][1].matchAll(/<li[^>]*>([\s\S]*?)<\/li/g)].map(a => a[1].replace(/<[^>]+>/g, '').trim())
      for (const t of items) {
        if (/dormitorio/i.test(t) && !beds) { const m = t.match(/\d+/); if (m) beds = m[0] }
        else if (/baño/i.test(t) && !baths) { const m = t.match(/\d+/); if (m) baths = m[0] }
        else if (/m²/i.test(t) && !m2)      { const m = t.match(/[\d.,]+/); if (m) m2 = m[0] }
      }
    }

    const barrio = location.includes(',') ? location.split(',')[0].trim() : location

    // Filtros
    const locLower = location.toLowerCase()
    const wrongRegion = INVALID_REGIONS.some(r => locLower.includes(r))

    if (priceUF >= 15000 && !wrongRegion && id) {
      // Normalizar ID para lookup de tag
      const normalId = id.replace(/^MLC(\d)/, 'MLC-$1')
      const published_tag = pubTags[normalId] || pubTags[id] || null

      results.push({ id, comuna, barrio, title, price_uf: priceUF, beds, baths, m2, location, link, published_tag })
    }
  }

  return results
}

// ── Save to Supabase and detect new ─────────────────────

async function saveAndDetectNew(listings) {
  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase.from('pi_listings').select('id')
  const existingIds = new Set((existing || []).map(e => e.id))

  const newListings = []
  let updated = 0

  for (const l of listings) {
    if (existingIds.has(l.id)) {
      await supabase.from('pi_listings').update({
        last_seen: today,
        is_new: false,
        published_tag: l.published_tag,
        price_uf: l.price_uf,
      }).eq('id', l.id)
      updated++
    } else {
      const { error } = await supabase.from('pi_listings').insert({
        ...l,
        first_seen: today,
        last_seen: today,
        is_new: true,
      })
      if (!error) newListings.push(l)
    }
  }

  // Marcar las que no se vieron hoy como no nuevas
  await supabase.from('pi_listings').update({ is_new: false }).neq('last_seen', today)

  return { newListings, updated, total: listings.length }
}

// ── Send email ──────────────────────────────────────────

async function sendEmail(newListings, totalScraped, pubHoy, pubSemana) {
  if (!RESEND_API_KEY) { console.log('⚠️ No RESEND key — skip email'); return }

  const today = new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const listingsHtml = newListings.length > 0
    ? newListings.map(l => {
        const tag = l.published_tag === 'PUBLICADO HOY'
          ? '<span style="background:#059669;color:white;padding:1px 6px;border-radius:8px;font-size:8px;font-weight:700;">HOY</span>'
          : l.published_tag === 'PUBLICADO ESTA SEMANA'
          ? '<span style="background:#D97706;color:white;padding:1px 6px;border-radius:8px;font-size:8px;font-weight:700;">ESTA SEMANA</span>'
          : ''
        return `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;">
          <strong style="color:#1B2A4A;">${l.comuna}</strong><br>
          <span style="color:#6b7280;font-size:11px;">${l.barrio}</span>
        </td>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;">${l.title.substring(0, 40)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:800;color:#1B2A4A;">${l.price_uf.toLocaleString()} UF</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:11px;">${l.beds || '—'} dorm · ${l.baths || '—'} baños · ${l.m2 || '—'} m²</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;">${tag}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;"><a href="${l.link}" style="color:#2563EB;font-size:11px;text-decoration:none;">Ver →</a></td>
      </tr>`}).join('')
    : '<tr><td colspan="6" style="padding:20px;text-align:center;color:#999;">No hay propiedades nuevas hoy.</td></tr>'

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
  <body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:20px 0;">
  <tr><td align="center">
  <table width="680" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;">

  <tr><td style="background:linear-gradient(135deg,#1B2A4A,#2D4A7A);padding:20px 28px;color:white;">
    <p style="margin:0;font-size:18px;font-weight:800;">Radar de Propiedades</p>
    <p style="margin:4px 0 0;font-size:11px;opacity:0.8;">${today} · Casas usadas ≥15.000 UF · Lo Barnechea · Vitacura · Las Condes · La Reina</p>
  </td></tr>

  <tr><td style="padding:20px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align:center;padding:12px;background:#D1FAE5;border-radius:8px;">
          <span style="display:block;font-size:28px;font-weight:900;color:#065F46;">${newListings.length}</span>
          <span style="font-size:10px;color:#065F46;text-transform:uppercase;">Nuevas en radar</span>
        </td>
        <td style="width:10px;"></td>
        <td style="text-align:center;padding:12px;background:#FEF3C7;border-radius:8px;">
          <span style="display:block;font-size:28px;font-weight:900;color:#92400E;">${pubHoy}</span>
          <span style="font-size:10px;color:#92400E;text-transform:uppercase;">Publicadas hoy</span>
        </td>
        <td style="width:10px;"></td>
        <td style="text-align:center;padding:12px;background:#DBEAFE;border-radius:8px;">
          <span style="display:block;font-size:28px;font-weight:900;color:#1E40AF;">${pubSemana}</span>
          <span style="font-size:10px;color:#1E40AF;text-transform:uppercase;">Esta semana</span>
        </td>
        <td style="width:10px;"></td>
        <td style="text-align:center;padding:12px;background:#EFF6FF;border-radius:8px;">
          <span style="display:block;font-size:28px;font-weight:900;color:#1B2A4A;">${totalScraped}</span>
          <span style="font-size:10px;color:#6b7280;text-transform:uppercase;">Total activas</span>
        </td>
      </tr>
    </table>
  </td></tr>

  ${newListings.length > 0 ? `
  <tr><td style="padding:0 28px 20px;">
    <p style="margin:0 0 8px;font-size:11px;color:#1B2A4A;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Propiedades nuevas en el radar</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr style="background:#1B2A4A;">
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Comuna</th>
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Título</th>
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Precio</th>
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Detalle</th>
        <th style="padding:6px 10px;color:white;font-size:9px;text-align:left;">Pub.</th>
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
    ? `🏠 ${newListings.length} propiedad${newListings.length > 1 ? 'es' : ''} nueva${newListings.length > 1 ? 's' : ''} (${pubHoy} publicadas hoy) — ${today}`
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
  console.log(`   Páginas por comuna: ${PAGES_PER_COMUNA} (~${PAGES_PER_COMUNA * 48} listings/comuna)`)
  console.log('   Filtro: casas usadas ≥15.000 UF')
  console.log('   Scraping vía ScrapingBee (IP residencial Chile)')
  if (isDryRun) console.log('   ⚠️  DRY-RUN — solo scraping, sin Supabase ni email')
  if (isBackfillSilent) console.log('   ⚠️  BACKFILL SILENCIOSO — inserta todo con is_new=false, sin email')
  console.log('')

  // Scrapear secuencialmente por comuna
  const allListings = []
  for (const s of SEARCHES) {
    console.log(`\n── ${s.comuna} ──`)
    const listings = await scrapeComuna(s)
    allListings.push(...listings)
    console.log(`   Subtotal ${s.comuna}: ${listings.length} listings`)
    if (SEARCHES.indexOf(s) < SEARCHES.length - 1) {
      console.log('   ⏳ Pausa 3s...')
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  // Dedupe por ID
  const seen = new Map()
  for (const l of allListings) {
    if (!seen.has(l.id)) seen.set(l.id, l)
  }
  const unique = Array.from(seen.values())

  const pubHoy = unique.filter(l => l.published_tag === 'PUBLICADO HOY').length
  const pubSemana = unique.filter(l => l.published_tag === 'PUBLICADO ESTA SEMANA').length

  console.log(`\n   Total único: ${unique.length}`)
  console.log(`   Publicadas hoy: ${pubHoy}`)
  console.log(`   Publicadas esta semana: ${pubSemana}`)

  if (unique.length > 0) {
    console.log('\n   📋 Sample (primeros 3):')
    unique.slice(0, 3).forEach((l, i) => {
      console.log(`      ${i + 1}. [${l.comuna}] ${l.price_uf.toLocaleString()} UF · ${l.beds || '?'}D/${l.baths || '?'}B/${l.m2 || '?'}m² · ${l.published_tag || 'antigua'} · ${l.title.substring(0, 50)}`)
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
    for (const l of unique) {
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
  const { newListings, updated, total } = await saveAndDetectNew(unique)
  console.log(`   Nuevas: ${newListings.length}`)
  console.log(`   Actualizadas: ${updated}`)

  // Send email
  await sendEmail(newListings, total, pubHoy, pubSemana)

  console.log('\n✅ Radar completado')
}

main().catch(err => {
  console.error('💥', err.message)
  process.exit(1)
})
