/**
 * PROSPECT DISCOVER — Descubrimiento de empresas por industria via Google Maps (Apify)
 *
 * Uso:
 *   node scripts/prospect-discover.js "inmobiliarias Santiago" 200
 *   node scripts/prospect-discover.js "empresas SaaS Chile" 100
 *   node scripts/prospect-discover.js "constructoras Valparaíso" 50
 *
 * Env vars: APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

// ── Config ──────────────────────────────────────────────
const APIFY_TOKEN = process.env.APIFY_TOKEN
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ── Queries por industria ──────────────────────────────
const INDUSTRY_QUERIES = {
  inmobiliarias: {
    industry: 'inmobiliaria',
    queries: [
      'inmobiliarias en Santiago Chile',
      'inmobiliarias en Viña del Mar Chile',
      'inmobiliarias en Concepción Chile',
      'corredora de propiedades Santiago',
      'venta de departamentos Santiago',
      'inmobiliarias nuevas Chile',
    ]
  },
  saas: {
    industry: 'saas',
    queries: [
      'empresas de software Santiago Chile',
      'empresas SaaS Chile',
      'startups tecnología Santiago',
      'software empresas Chile',
      'plataformas digitales Chile',
      'empresas tecnología Valparaíso Chile',
    ]
  }
}

// ── Helpers ─────────────────────────────────────────────

function extractDomain(url) {
  if (!url) return null
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch { return null }
}

function classifyEmail(email) {
  const lower = email.toLowerCase()
  if (/^(info|contacto|hola|hello)@/.test(lower)) return 'info'
  if (/^(ventas|sales|comercial)@/.test(lower)) return 'sales'
  if (/^(soporte|support|ayuda)@/.test(lower)) return 'support'
  return 'generic'
}

function extractCityFromAddress(address) {
  if (!address) return null
  // Buscar ciudades chilenas comunes
  const ciudades = [
    'Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Ñuñoa', 'La Reina',
    'Lo Barnechea', 'Huechuraba', 'Maipú', 'La Florida', 'Puente Alto',
    'Viña del Mar', 'Valparaíso', 'Concepción', 'Temuco', 'Antofagasta',
    'La Serena', 'Rancagua', 'Talca', 'Chillán', 'Puerto Montt', 'Iquique',
    'Arica', 'Calama', 'Osorno', 'Valdivia', 'Punta Arenas', 'Copiapó'
  ]
  for (const c of ciudades) {
    if (address.includes(c)) return c
  }
  return null
}

function extractRegionFromAddress(address) {
  if (!address) return null
  const regiones = {
    'Región Metropolitana': ['Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Ñuñoa', 'La Florida', 'Maipú', 'Puente Alto', 'Lo Barnechea', 'La Reina', 'Huechuraba'],
    'Valparaíso': ['Viña del Mar', 'Valparaíso', 'Quilpué', 'Villa Alemana'],
    'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chillán'],
    'Araucanía': ['Temuco'],
    'Antofagasta': ['Antofagasta', 'Calama'],
  }
  for (const [region, cities] of Object.entries(regiones)) {
    for (const city of cities) {
      if (address.includes(city)) return region
    }
  }
  return null
}

// ── Etapa 1: Google Maps Scraper ───────────────────────

async function discoverFromGoogleMaps(searchQuery, maxResults = 100) {
  console.log(`\n🔍 Buscando: "${searchQuery}" (max ${maxResults})`)

  const res = await fetch(
    `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=300`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchStringsArray: [searchQuery],
        maxCrawledPlacesPerSearch: maxResults,
        language: 'es',
        includeWebResults: false,
      })
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error(`❌ Apify Google Maps error: ${res.status} — ${err}`)
    return []
  }

  const results = await res.json()
  console.log(`   → ${results.length} resultados encontrados`)
  return results
}

// ── Etapa 2: Normalizar y guardar ──────────────────────

async function saveCompanies(results, industry, searchQuery, batchId) {
  let saved = 0, skipped = 0, errors = 0

  for (const r of results) {
    const website = r.website || r.url || null
    const domain = extractDomain(website)

    // Skip si no tiene sitio web
    if (!website || !domain) {
      skipped++
      continue
    }

    // Skip dominios genéricos (facebook, google, etc)
    if (/facebook\.com|google\.com|instagram\.com|linkedin\.com|yelp\.com|tripadvisor/.test(domain)) {
      skipped++
      continue
    }

    const company = {
      name: (r.title || r.name || '').trim(),
      website: website.startsWith('http') ? website : `https://${website}`,
      phone: r.phone || r.phoneUnformatted || null,
      address: r.address || r.street || null,
      city: extractCityFromAddress(r.address) || r.city || null,
      region: extractRegionFromAddress(r.address) || null,
      country: 'Chile',
      industry,
      category: r.categoryName || r.categories?.[0] || null,
      rating: r.totalScore || r.rating || null,
      reviews_count: r.reviewsCount || 0,
      source: 'google_maps',
      source_query: searchQuery,
      batch_id: batchId,
      status: 'discovered',
    }

    // Check si ya existe por dominio
    const { data: existing } = await supabase
      .from('prospect_companies')
      .select('id')
      .eq('website_domain', domain)
      .limit(1)
      .single()

    if (existing) {
      skipped++
      continue
    }

    // Insertar nueva
    const { error } = await supabase
      .from('prospect_companies')
      .insert(company)

    if (error) {
      if (error.code === '23505') { // duplicate
        skipped++
      } else {
        console.error(`   ❌ Error guardando ${company.name}: ${error.message}`)
        errors++
      }
    } else {
      saved++
    }
  }

  console.log(`   ✅ Guardadas: ${saved} | ⏭️ Duplicadas/sin web: ${skipped} | ❌ Errores: ${errors}`)
  return { saved, skipped, errors }
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Uso: node prospect-discover.js <industria|query> [maxResults]')
    console.log('Industrias predefinidas: inmobiliarias, saas')
    console.log('O query directa: "constructoras Santiago"')
    process.exit(1)
  }

  const input = args[0].toLowerCase()
  const maxPerQuery = parseInt(args[1]) || 100
  const batchId = `batch_${Date.now()}`

  let queries = []
  let industry = input

  // Check si es industria predefinida
  if (INDUSTRY_QUERIES[input]) {
    queries = INDUSTRY_QUERIES[input].queries
    industry = INDUSTRY_QUERIES[input].industry
    console.log(`\n📋 Industria: ${industry} — ${queries.length} queries predefinidas`)
  } else {
    // Query directa
    queries = [args[0]]
    industry = args[0].split(' ')[0] // primera palabra como industria
    console.log(`\n📋 Query directa: "${args[0]}"`)
  }

  console.log(`🆔 Batch ID: ${batchId}`)
  console.log(`📊 Max por query: ${maxPerQuery}`)

  let totalSaved = 0, totalSkipped = 0

  for (const query of queries) {
    const results = await discoverFromGoogleMaps(query, maxPerQuery)
    const { saved, skipped } = await saveCompanies(results, industry, query, batchId)
    totalSaved += saved
    totalSkipped += skipped

    // Pausa entre queries para no saturar Apify
    if (queries.indexOf(query) < queries.length - 1) {
      console.log('   ⏳ Esperando 5s entre queries...')
      await new Promise(r => setTimeout(r, 5000))
    }
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN DESCUBRIMIENTO`)
  console.log(`   Industria: ${industry}`)
  console.log(`   Queries ejecutadas: ${queries.length}`)
  console.log(`   Empresas guardadas: ${totalSaved}`)
  console.log(`   Duplicadas/filtradas: ${totalSkipped}`)
  console.log(`   Batch ID: ${batchId}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
