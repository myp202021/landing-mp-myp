/**
 * RADAR DE PROPIEDADES — CyM Corredora
 * Scrapea PI con Apify cheerio-scraper (paginado), detecta nuevas, guarda en Supabase, envía email
 *
 * Comunas: Lo Barnechea, Vitacura, Las Condes, La Reina
 * Filtro: casas usadas ≥15.000 UF
 * Paginación: 4 páginas por comuna (~192 listings c/u)
 * Cron: 04:00 AM Chile (07:00 UTC)
 *
 * Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND, APIFY_TOKEN
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
  console.error('❌ APIFY_TOKEN no definido')
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

// ── Apify async run helper ──────────────────────────────

async function runApifyAsync(actorId, input, maxWaitSec = 600) {
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) }
  )
  if (!startRes.ok) throw new Error(`Apify start ${startRes.status}: ${(await startRes.text()).substring(0, 300)}`)
  const startData = await startRes.json()
  const runId = startData.data?.id
  const datasetId = startData.data?.defaultDatasetId
  if (!runId || !datasetId) throw new Error('Apify no devolvió runId/datasetId')
  console.log(`   🏃 Run iniciado: ${runId}`)

  const tStart = Date.now()
  let finalStatus = 'UNKNOWN'
  while ((Date.now() - tStart) / 1000 < maxWaitSec) {
    await new Promise(r => setTimeout(r, 10000))
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`)
    const statusData = await statusRes.json()
    const status = statusData.data?.status
    finalStatus = status
    const elapsed = Math.round((Date.now() - tStart) / 1000)
    process.stdout.write(`   ⏱️  [${elapsed}s] ${status}\r`)
    if (status === 'SUCCEEDED') {
      console.log(`\n   ✅ Run terminado en ${elapsed}s`)
      break
    }
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
      console.log(`\n   ❌ Run ${status} en ${elapsed}s`)
      break
    }
  }

  // Download logs for debug
  try {
    const logRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/log?token=${APIFY_TOKEN}`)
    if (logRes.ok) {
      const logText = await logRes.text()
      const lines = logText.split('\n').filter(l => l.trim())
      const relevant = lines.filter(l => /INFO|WARN|ERROR|listings|comuna|HTML length/i.test(l)).slice(-30)
      if (relevant.length > 0) {
        console.log('\n   📜 Apify logs (últimos relevantes):')
        relevant.forEach(l => console.log(`      ${l.substring(0, 200)}`))
      }
    }
  } catch (e) { console.log(`   ⚠️  No se pudieron bajar logs: ${e.message}`) }

  if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(finalStatus)) {
    throw new Error(`Apify run ${finalStatus}`)
  }

  const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&clean=true&format=json`)
  if (!itemsRes.ok) throw new Error(`Apify dataset ${itemsRes.status}`)
  return await itemsRes.json()
}

// ── Page function que se ejecuta dentro de Apify puppeteer ──

const PAGE_FUNCTION = `async function pageFunction(context) {
 try {
  const { request, page, log } = context
  const comuna = (request.userData && request.userData.comuna) || 'desconocida'
  const pageNum = (request.userData && request.userData.pageNum) || 1

  log.info('INICIO — p' + pageNum + ' — ' + request.url + ' — ' + comuna)

  try {
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36')
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-CL,es;q=0.9,en;q=0.8',
    })
  } catch (e) { log.warning('Fallo setear UA: ' + (e && e.message)) }

  // Visitar home primero para cookies de sesión
  try {
    await page.goto('https://www.portalinmobiliario.com/', { waitUntil: 'domcontentloaded', timeout: 30000 })
    await new Promise(function(r){ setTimeout(r, 2000) })
  } catch (e) { log.warning('Fallo visitar home: ' + (e && e.message)) }

  // Navegar a URL de búsqueda
  try {
    await page.goto(request.url, { waitUntil: 'networkidle2', timeout: 45000 })
    await new Promise(function(r){ setTimeout(r, 3000) })
  } catch (e) { log.warning('Fallo navegar a url: ' + (e && e.message)) }

  const html = await page.content()
  log.info('HTML length: ' + html.length + ' — ' + comuna + ' p' + pageNum)

  // Extraer published_tag (PUBLICADO HOY / ESTA SEMANA).
  // Contar ocurrencias globales primero para diagnóstico (si PI ya no expone estos tags, serán 0 y cambiamos estrategia).
  var totalHoy = (html.match(/PUBLICADO HOY/g) || []).length
  var totalSemana = (html.match(/PUBLICADO ESTA SEMANA/g) || []).length
  log.info('Ocurrencias en HTML — HOY: ' + totalHoy + ' · SEMANA: ' + totalSemana)

  var pubTags = {}
  // Regex tolerante: cualquier MLC id seguido (dentro de 5000 chars) por PUBLICADO HOY/SEMANA.
  var pubRegex = /"(MLC-?\\d+)"[\\s\\S]{0,5000}?"(PUBLICADO (?:HOY|ESTA SEMANA))"/g
  var pm
  while ((pm = pubRegex.exec(html)) !== null) {
    var mlcId = pm[1].replace(/^MLC(\\d)/, 'MLC-$1')
    if (!pubTags[mlcId]) pubTags[mlcId] = pm[2]
  }
  log.info('published_tag asociados a ID: ' + Object.keys(pubTags).length)

  // Extraer listings con regex
  var results = []
  var titleMatches = []
  var m
  var titleRe = /class="poly-component__title"[^>]*>([\\s\\S]*?)<\\//g
  while ((m = titleRe.exec(html)) !== null) titleMatches.push(m)

  var locMatches = []
  var locRe = /class="[^"]*poly-component__location[^"]*"[^>]*>([^<]+)</g
  while ((m = locRe.exec(html)) !== null) locMatches.push(m)

  var priceMatches = []
  var priceRe = /aria-label="([\\d.,]+)\\s*(UF|unidades de fomento|pesos)/gi
  while ((m = priceRe.exec(html)) !== null) priceMatches.push(m)

  var linkSet = {}
  var linkArr = []
  var linkRe = /href="(https?:\\/\\/(?:www\\.)?portalinmobiliario\\.com\\/MLC[^"]+)"/g
  while ((m = linkRe.exec(html)) !== null) {
    if (!linkSet[m[1]]) { linkSet[m[1]] = true; linkArr.push(m[1]) }
  }

  var attrMatches = []
  var attrRe = /class="poly-component__attributes-list"[^>]*>([\\s\\S]*?)<\\/ul/g
  while ((m = attrRe.exec(html)) !== null) attrMatches.push(m)

  var count = Math.min(titleMatches.length, priceMatches.length, locMatches.length)

  for (var i = 0; i < count; i++) {
    var title = titleMatches[i] && titleMatches[i][1] ? titleMatches[i][1].replace(/<[^>]+>/g, '').trim() : ''
    var priceRaw = (priceMatches[i] && priceMatches[i][1] ? priceMatches[i][1] : '0').replace(/[.,]/g, '')
    var currency = (priceMatches[i] && priceMatches[i][2] ? priceMatches[i][2] : '').toLowerCase()
    var priceUF = parseInt(priceRaw, 10) || 0
    if (currency === 'pesos' || priceUF > 500000) priceUF = Math.round(priceUF / 38000)

    var location = locMatches[i] && locMatches[i][1] ? locMatches[i][1].trim() : ''
    var link = linkArr[i] || ''
    var idMatch = link.match(/MLC-?\\d+/)
    var id = idMatch ? idMatch[0] : ''

    var beds = '', baths = '', m2 = ''
    if (attrMatches[i] && attrMatches[i][1]) {
      var attrHtml = attrMatches[i][1]
      var liRe = /<li[^>]*>([\\s\\S]*?)<\\/li/g
      var items = []
      var li
      while ((li = liRe.exec(attrHtml)) !== null) items.push(li[1].replace(/<[^>]+>/g, '').trim())
      for (var j = 0; j < items.length; j++) {
        var t = items[j]
        if (/dormitorio/i.test(t) && !beds) { var dm = t.match(/\\d+/); if (dm) beds = dm[0] }
        else if (/baño/i.test(t) && !baths) { var bm = t.match(/\\d+/); if (bm) baths = bm[0] }
        else if (/m²/i.test(t) && !m2)      { var sm = t.match(/[\\d.,]+/); if (sm) m2 = sm[0] }
      }
    }

    var barrio = location.indexOf(',') >= 0 ? location.split(',')[0].trim() : location
    var normalId = id.replace(/^MLC(\\d)/, 'MLC-$1')
    var published_tag = pubTags[normalId] || pubTags[id] || null

    if (id && priceUF > 0) {
      results.push({ id: id, comuna: comuna, barrio: barrio, title: title, price_uf: priceUF, beds: beds, baths: baths, m2: m2, location: location, link: link, published_tag: published_tag })
    }
  }

  log.info('Listings encontrados: ' + results.length + ' en ' + comuna + ' p' + pageNum)
  return { comuna: comuna, pageNum: pageNum, url: request.url, count: results.length, listings: results }
 } catch (err) {
  return { error: err.message || String(err), stack: err.stack || '', url: (context.request && context.request.url) || '' }
 }
}`

// ── Build startUrls con paginación ──────────────────────

function buildStartUrls() {
  const urls = []
  for (const s of SEARCHES) {
    for (let i = 0; i < OFFSETS.length; i++) {
      const offset = OFFSETS[i]
      const url = offset === 0 ? s.baseUrl : `${s.baseUrl}_Desde_${offset}`
      urls.push({
        url,
        userData: { comuna: s.comuna, pageNum: i + 1 },
      })
    }
  }
  return urls
}

// ── Scrape all via Apify ────────────────────────────────

async function scrapeAllViaApify() {
  const startUrls = buildStartUrls()
  console.log(`🕸️  Apify puppeteer-scraper — ${startUrls.length} URLs (${SEARCHES.length} comunas × ${PAGES_PER_COMUNA} páginas c/u)`)

  const input = {
    startUrls,
    pageFunction: PAGE_FUNCTION,
    proxyConfiguration: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] },
    maxRequestRetries: 2,
    maxConcurrency: 2,
    maxPagesPerCrawl: 20,
    headless: true,
    useChrome: true,
    ignoreSslErrors: false,
  }

  const datasetItems = await runApifyAsync('apify~puppeteer-scraper', input, 600)
  console.log(`   Apify devolvió ${datasetItems.length} páginas procesadas`)

  // Unir listings y dedupe por ID
  const seen = new Map()
  for (const item of datasetItems) {
    if (item.error) {
      console.log(`   ⚠️  Error en ${item.url}: ${item.error}`)
      continue
    }
    const comuna = item.comuna || 'Desconocida'
    for (const l of (item.listings || [])) {
      const locLower = (l.location || '').toLowerCase()
      const wrongRegion = INVALID_REGIONS.some(r => locLower.includes(r))
      if (l.price_uf < 15000 || wrongRegion || !l.id) continue
      if (!seen.has(l.id)) seen.set(l.id, l)
    }
  }

  // Log por comuna
  const porComuna = {}
  for (const l of seen.values()) {
    porComuna[l.comuna] = (porComuna[l.comuna] || 0) + 1
  }
  for (const s of SEARCHES) {
    console.log(`   ${s.comuna}: ${porComuna[s.comuna] || 0} casas (≥15.000 UF)`)
  }

  return Array.from(seen.values())
}

// ── Save to Supabase and detect new ─────────────────────

async function saveAndDetectNew(listings) {
  const today = new Date().toISOString().split('T')[0]

  // Traer TODOS los IDs existentes (paginado para esquivar el límite default de 1000 de Supabase).
  const existingIds = new Set()
  let from = 0
  const pageSize = 1000
  while (true) {
    const { data, error } = await supabase.from('pi_listings').select('id').range(from, from + pageSize - 1)
    if (error) { console.error('Error leyendo pi_listings:', error.message); break }
    if (!data || data.length === 0) break
    for (const e of data) existingIds.add(e.id)
    if (data.length < pageSize) break
    from += pageSize
  }
  console.log(`   IDs existentes en BD: ${existingIds.size}`)

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
  console.log('   Scraping vía Apify puppeteer-scraper (IP residencial)')
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

  const pubHoy = allListings.filter(l => l.published_tag === 'PUBLICADO HOY').length
  const pubSemana = allListings.filter(l => l.published_tag === 'PUBLICADO ESTA SEMANA').length

  const conTag = allListings.filter(l => l.published_tag).length
  console.log(`\n   Total único: ${allListings.length}`)
  console.log(`   Con published_tag: ${conTag} / ${allListings.length}`)
  console.log(`   Publicadas hoy: ${pubHoy}`)
  console.log(`   Publicadas esta semana: ${pubSemana}`)

  if (allListings.length > 0) {
    console.log('\n   📋 Sample (primeros 3):')
    allListings.slice(0, 3).forEach((l, i) => {
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
  await sendEmail(newListings, total, pubHoy, pubSemana)

  console.log('\n✅ Radar completado')
}

main().catch(err => {
  console.error('💥', err.message)
  process.exit(1)
})
