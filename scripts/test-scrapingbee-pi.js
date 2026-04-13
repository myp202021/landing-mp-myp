/**
 * TEST — ScrapingBee vs Supabase (Radar Propiedades)
 * Scrapea PI con ScrapingBee CON PAGINACIÓN, compara contra pi_listings existentes
 *
 * Uso: SCRAPINGBEE_API_KEY=xxx node scripts/test-scrapingbee-pi.js
 * (opcionalmente SUPABASE_URL + SUPABASE_SERVICE_KEY para comparar)
 */

const fetch = require('node-fetch')

const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_API_KEY
if (!SCRAPINGBEE_KEY) {
  console.error('❌ SCRAPINGBEE_API_KEY no definida')
  process.exit(1)
}

// PI muestra ~48 listings por página. Paginamos 4 páginas por comuna = ~192 listings
const PAGES_PER_COMUNA = 4
const OFFSETS = [0, 49, 97, 145] // _Desde_49, _Desde_97, _Desde_145

const SEARCHES = [
  { comuna: 'Lo Barnechea', baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/lo-barnechea-metropolitana/' },
  { comuna: 'Vitacura',     baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/vitacura-metropolitana/' },
  { comuna: 'Las Condes',   baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/las-condes-metropolitana/' },
  { comuna: 'La Reina',     baseUrl: 'https://www.portalinmobiliario.com/venta/casa/usada/la-reina-metropolitana/' },
]

const INVALID_REGIONS = ['maule', 'curicó', 'valparaíso', 'biobío', 'araucanía', 'coquimbo', 'ohiggins', 'atacama', 'los lagos', 'los ríos']

// ── Scrape una URL con ScrapingBee ──────────────────────

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
  console.log(`   ✅ ${label}: ${listings.length} listings (${html.length} chars)`)
  return listings
}

async function scrapeComuna(search) {
  const allListings = []
  for (let i = 0; i < OFFSETS.length; i++) {
    const offset = OFFSETS[i]
    const url = offset === 0 ? search.baseUrl : `${search.baseUrl}_Desde_${offset}`
    const listings = await scrapeOnePage(url, search.comuna, i + 1)
    allListings.push(...listings)
    // Si una página devuelve 0, no seguir paginando
    if (listings.length === 0) {
      console.log(`   ⏹️  ${search.comuna}: página ${i + 1} vacía, deteniendo paginación`)
      break
    }
    // Pausa entre páginas
    if (i < OFFSETS.length - 1) await new Promise(r => setTimeout(r, 2000))
  }
  return allListings
}

// ── Extraer listings del HTML (mismo código que producción) ──

function extractListings(html, comuna) {
  const results = []

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
      results.push({ id, comuna, barrio, title, price_uf: priceUF, beds, baths, m2, location, link })
    }
  }

  return results
}

// ── Comparar con Supabase ───────────────────────────────

async function compareWithSupabase(allListings) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    console.log('\n⚠️  Sin credenciales Supabase — no se puede comparar. Solo mostrando resultados ScrapingBee.')
    return
  }

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: existing, error } = await supabase.from('pi_listings').select('id, comuna, price_uf, title, first_seen, last_seen')
  if (error) {
    console.error(`❌ Error Supabase: ${error.message}`)
    return
  }

  const existingIds = new Set(existing.map(e => e.id))
  const scrapedIds = new Set(allListings.map(l => l.id))

  const nuevas = allListings.filter(l => !existingIds.has(l.id))
  const yaExisten = allListings.filter(l => existingIds.has(l.id))
  const noVistas = existing.filter(e => !scrapedIds.has(e.id))

  console.log('\n' + '═'.repeat(60))
  console.log('COMPARACIÓN ScrapingBee vs Supabase')
  console.log('═'.repeat(60))
  console.log(`   En Supabase:        ${existing.length} listings`)
  console.log(`   ScrapingBee hoy:    ${allListings.length} listings`)
  console.log(`   ✅ Ya existían:      ${yaExisten.length}`)
  console.log(`   🆕 NUEVAS (no en DB): ${nuevas.length}`)
  console.log(`   👻 En DB pero no hoy: ${noVistas.length}`)

  if (nuevas.length > 0) {
    console.log(`\n   🆕 Propiedades NUEVAS (mostrando primeras 10 de ${nuevas.length}):`)
    nuevas.slice(0, 10).forEach((l, i) => {
      console.log(`      ${i + 1}. [${l.comuna}] ${l.price_uf.toLocaleString()} UF · ${l.beds || '?'}D/${l.baths || '?'}B/${l.m2 || '?'}m² · ${l.id}`)
      console.log(`         ${l.title.substring(0, 60)}`)
    })
    if (nuevas.length > 10) console.log(`      ... y ${nuevas.length - 10} más`)
  }

  // Overlap por comuna
  console.log('\n   📊 Overlap por comuna:')
  for (const s of SEARCHES) {
    const enDB = existing.filter(e => e.comuna === s.comuna).length
    const scrapeados = allListings.filter(l => l.comuna === s.comuna).length
    const nuevosComuna = nuevas.filter(l => l.comuna === s.comuna).length
    console.log(`      ${s.comuna.padEnd(15)} DB: ${enDB.toString().padStart(3)} · Hoy: ${scrapeados.toString().padStart(3)} · Nuevas: ${nuevosComuna}`)
  }
}

// ── Main ────────────────────────────────────────────────

async function main() {
  console.log('🐝 TEST ScrapingBee — Radar Propiedades PI (CON PAGINACIÓN)')
  console.log('   Fecha: ' + new Date().toISOString().split('T')[0])
  console.log(`   Comunas: ${SEARCHES.map(s => s.comuna).join(', ')}`)
  console.log(`   Páginas por comuna: ${PAGES_PER_COMUNA} (~${PAGES_PER_COMUNA * 48} listings/comuna)`)
  console.log('   Filtro: casas usadas ≥15.000 UF')
  console.log('')

  // Scrapear secuencialmente comuna por comuna, paginando dentro de cada una
  const allListings = []
  for (const s of SEARCHES) {
    console.log(`\n── ${s.comuna} ──`)
    const listings = await scrapeComuna(s)
    allListings.push(...listings)
    console.log(`   Subtotal ${s.comuna}: ${listings.length} listings`)
    // Pausa entre comunas
    if (SEARCHES.indexOf(s) < SEARCHES.length - 1) {
      console.log('   ⏳ Pausa 3s entre comunas...')
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  // Dedupe por ID
  const seen = new Map()
  for (const l of allListings) {
    if (!seen.has(l.id)) seen.set(l.id, l)
  }
  const unique = Array.from(seen.values())

  console.log(`\n   Total único: ${unique.length} listings`)

  // Comparar con Supabase
  await compareWithSupabase(unique)

  console.log('\n✅ Test completado')
}

main().catch(err => {
  console.error('💥', err.message)
  process.exit(1)
})
