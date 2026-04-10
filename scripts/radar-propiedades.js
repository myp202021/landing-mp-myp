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

// ── Scrape one commune (paginado) ───────────────────────
// PI usa `_Desde_N` para paginación (N = offset, 49 items por página)

async function fetchOnePage(url, cookies) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'es-CL,es;q=0.9',
      'Cookie': cookies,
    },
    redirect: 'follow',
  })
  return await res.text()
}

function parseListings(html, search) {
  const titleMatches = [...html.matchAll(/class="poly-component__title"[^>]*>([\s\S]*?)<\//g)]
  const locMatches = [...html.matchAll(/class="[^"]*poly-component__location[^"]*"[^>]*>([^<]+)</g)]
  const priceMatches = [...html.matchAll(/aria-label="([\d.,]+)\s*(UF|unidades de fomento|pesos)/gi)]
  const linkMatches = [...new Set(
    [...html.matchAll(/href="(https?:\/\/(?:www\.)?portalinmobiliario\.com\/MLC[^"]+)"/g)].map(m => m[1])
  )]
  const attrMatches = [...html.matchAll(/class="poly-component__attributes-list"[^>]*>([\s\S]*?)<\/ul/g)]

  const count = Math.min(titleMatches.length, priceMatches.length, locMatches.length)
  const listings = []

  for (let i = 0; i < count; i++) {
    const title = titleMatches[i]?.[1]?.replace(/<[^>]+>/g, '').trim() || ''
    const priceRaw = (priceMatches[i]?.[1] || '0').replace(/[.,]/g, '')
    const currency = (priceMatches[i]?.[2] || '').toLowerCase()
    let priceUF = parseInt(priceRaw)

    if (currency === 'pesos' || priceUF > 500000) {
      priceUF = Math.round(priceUF / 38000)
    }

    const location = locMatches[i]?.[1]?.trim() || ''
    const link = linkMatches[i] || ''
    const id = link.match(/MLC-?\d+/)?.[0] || ''

    const locLower = location.toLowerCase()
    const isWrongRegion = INVALID_REGIONS.some(r => locLower.includes(r))
    if (priceUF < 15000 || isWrongRegion || !id) continue

    let beds = '', baths = '', m2 = ''
    if (attrMatches[i]) {
      const attrItems = [...attrMatches[i][1].matchAll(/<li[^>]*>([\s\S]*?)<\/li/g)].map(a => a[1].replace(/<[^>]+>/g, '').trim())
      beds = attrItems.find(a => a.includes('dormitorio'))?.match(/\d+/)?.[0] || ''
      baths = attrItems.find(a => a.includes('baño'))?.match(/\d+/)?.[0] || ''
      m2 = attrItems.find(a => a.includes('m²'))?.match(/[\d.,]+/)?.[0] || ''
    }

    const barrio = location.split(',')[0]?.trim() || ''

    listings.push({ id, comuna: search.comuna, barrio, title, price_uf: priceUF, beds, baths, m2, location, link })
  }
  return listings
}

async function scrapePage(search) {
  // Fetch home para obtener cookies de sesión
  const cookieRes = await fetch('https://www.portalinmobiliario.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
    redirect: 'follow',
  })
  const cookies = cookieRes.headers.raw()['set-cookie']?.map(c => c.split(';')[0]).join('; ') || ''

  // Paginar: PI usa offsets 49, 97, 145 (49 items/página)
  const seen = new Map() // dedupe por id
  const offsets = [null, 49, 97, 145]
  for (const offset of offsets) {
    const url = offset ? `${search.baseUrl}_Desde_${offset + 1}` : search.baseUrl
    try {
      const html = await fetchOnePage(url, cookies)
      const found = parseListings(html, search)
      for (const l of found) if (!seen.has(l.id)) seen.set(l.id, l)
      // Si la página devuelve menos de 30 items, asumimos que es la última
      if (found.length < 30) break
    } catch (e) {
      console.warn(`   ⚠️ ${search.comuna} offset ${offset || 0}: ${e.message.substring(0, 60)}`)
      break
    }
    await new Promise(r => setTimeout(r, 800))
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
  console.log('🏠 RADAR PROPIEDADES — ' + new Date().toISOString().split('T')[0])
  console.log('   Comunas: Lo Barnechea, Vitacura, Las Condes, La Reina')
  console.log('   Filtro: casas usadas >15.000 UF\n')

  const allListings = []

  for (const search of SEARCHES) {
    process.stdout.write(`   ${search.comuna}...`)
    try {
      const listings = await scrapePage(search)
      allListings.push(...listings)
      console.log(` ${listings.length} propiedades`)
    } catch (e) {
      console.log(` ❌ ${e.message.substring(0, 50)}`)
    }
    await new Promise(r => setTimeout(r, 3000))
  }

  console.log(`\n   Total scrapeadas: ${allListings.length}`)

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
