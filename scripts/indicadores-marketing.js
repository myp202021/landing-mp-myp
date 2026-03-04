/**
 * TERMÓMETRO DE MARKETING DIGITAL CHILE
 * Actualiza semanalmente:
 * 1. USD / UF desde mindicador.cl (gratis, sin token)
 * 2. CPC estimado por industria (Google + Meta) ajustado al tipo de cambio
 * 3. Ofertas de trabajo digital en Chile (Computrabajo.cl via Apify Cheerio)
 *
 * Guarda en Supabase tabla: indicadores_semanales
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

// ─── Clientes ──────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ─── CPC base Google en CLP (Ubersuggest Chile, calibrado Sep 2025 ~$935) ──
// metaRatio: Meta CPC ÷ Google CPC (por industria, basado en benchmarks públicos)
const CPC_INDUSTRIAS = [
  { id: 'ecommerce',      label: 'E-commerce',              google: 248, metaRatio: 0.65 },
  { id: 'moda_retail',    label: 'Moda y Retail',           google: 128, metaRatio: 0.70 },
  { id: 'gastronomia',    label: 'Gastronomía',             google: 162, metaRatio: 0.72 },
  { id: 'educacion',      label: 'Educación',               google: 146, metaRatio: 0.58 },
  { id: 'tecnologia',     label: 'Tecnología / SaaS',       google: 39,  metaRatio: 0.52 },
  { id: 'hogar',          label: 'Hogar y Decoración',      google: 165, metaRatio: 0.62 },
  { id: 'belleza',        label: 'Belleza y Cuidado',       google: 251, metaRatio: 0.68 },
  { id: 'deportes',       label: 'Deportes y Fitness',      google: 195, metaRatio: 0.65 },
  { id: 'veterinaria',    label: 'Veterinaria y Mascotas',  google: 175, metaRatio: 0.68 },
  { id: 'automotriz',     label: 'Automotriz',              google: 248, metaRatio: 0.55 },
  { id: 'inmobiliaria',   label: 'Inmobiliaria',            google: 215, metaRatio: 0.58 },
  { id: 'turismo',        label: 'Turismo y Viajes',        google: 421, metaRatio: 0.62 },
  { id: 'salud',          label: 'Salud y Medicina',        google: 369, metaRatio: 0.55 },
  { id: 'legal',          label: 'Servicios Legales',       google: 391, metaRatio: 0.42 },
  { id: 'profesionales',  label: 'Servicios Profesionales', google: 295, metaRatio: 0.52 },
  { id: 'construccion',   label: 'Construcción',            google: 385, metaRatio: 0.50 },
  { id: 'logistica',      label: 'Logística y Transporte',  google: 310, metaRatio: 0.45 },
  { id: 'seguros',        label: 'Seguros',                 google: 520, metaRatio: 0.50 },
  { id: 'manufactura',    label: 'Manufactura B2B',         google: 425, metaRatio: 0.40 },
  { id: 'energia',        label: 'Energía / Utilities',     google: 450, metaRatio: 0.42 },
  { id: 'fintech',        label: 'Fintech',                 google: 479, metaRatio: 0.48 },
  { id: 'agro',           label: 'Agro / Agroindustria',    google: 185, metaRatio: 0.45 },
]
const USD_BASE = 935 // tasa de referencia cuando se calibraron los CPCs

// ─── Cargos digitales a monitorear ─────────────────────────────────────────
const CARGOS = [
  { id: 'community_manager',  label: 'Community Manager',          query: 'community manager' },
  { id: 'paid_media',         label: 'Paid Media / SEM',           query: 'paid media sem google ads' },
  { id: 'disenador_digital',  label: 'Diseñador Digital',          query: 'disenador digital web' },
  { id: 'analista_marketing', label: 'Analista Marketing Digital', query: 'analista marketing digital' },
  { id: 'jefe_marketing',     label: 'Jefe Marketing Digital',     query: 'jefe marketing digital' },
  { id: 'gerente_marketing',  label: 'Gerente / Director Mkt',     query: 'gerente director marketing' },
  { id: 'social_media',       label: 'Social Media Manager',       query: 'social media manager' },
  { id: 'publicista',         label: 'Publicista Digital',         query: 'publicista digital' },
  { id: 'seo_specialist',     label: 'SEO / SEM Specialist',       query: 'seo sem specialist' },
  { id: 'data_analyst',       label: 'Data Analyst Marketing',     query: 'data analyst analytics' },
  { id: 'performance',        label: 'Performance Marketing',      query: 'performance marketing' },
  { id: 'ux_ui',              label: 'UX/UI Designer',             query: 'disenador ux ui' },
  { id: 'subgerente',         label: 'Subgerente / Jefe Comercial',query: 'subgerente jefe comercial digital' },
  { id: 'content_manager',    label: 'Content Manager',            query: 'content manager' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────
function getSemanaISO(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return { semana: Math.ceil((((d - yearStart) / 86400000) + 1) / 7), año: d.getUTCFullYear() }
}

function round(n) { return Math.round(n) }
function pct(a, b) { if (!b || b === 0) return null; return Math.round(((a - b) / b) * 100 * 10) / 10 }

// ─── Fetch USD y UF desde mindicador.cl ─────────────────────────────────────
async function fetchIndicadores() {
  const [resUSD, resUF] = await Promise.all([
    fetch('https://mindicador.cl/api/dolar'),
    fetch('https://mindicador.cl/api/uf'),
  ])
  const dolarData = await resUSD.json()
  const ufData    = await resUF.json()
  return {
    usd: dolarData.serie[0].valor,
    uf:  ufData.serie[0].valor,
  }
}

// ─── Scraping ofertas de trabajo (fetch directo + cheerio, sin Apify) ───────
const cheerio = require('cheerio')

function slugify(q) {
  return q.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/ñ/g, 'n')
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')
}

async function fetchCount(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-CL,es;q=0.9',
        'Cache-Control': 'no-cache',
      },
      timeout: 15000,
    })
    if (!res.ok) return 0
    const html = await res.text()
    const $ = cheerio.load(html)

    // Buscar en h1, h2, meta description, title — patrón numérico + "empleo/trabajo/oferta"
    const targets = [
      $('h1').first().text(),
      $('h2').first().text(),
      $('title').text(),
      $('meta[name="description"]').attr('content') || '',
      $('[class*="count"], [class*="result"], [class*="total"]').first().text(),
    ]
    for (const t of targets) {
      const m = t.match(/([\d.,]+)\s*(?:empleo|trabajo|oferta|resultado)/i)
      if (m) {
        const n = parseInt(m[1].replace(/[.,]/g, ''))
        if (n > 0) return n
      }
    }
    return 0
  } catch { return 0 }
}

async function fetchOfertas() {
  console.log('🔍 Scrapeando ofertas de trabajo (Bumeran.cl + Laborum.cl)...')
  const results = []

  for (const cargo of CARGOS) {
    const slug = slugify(cargo.query)
    let count = 0

    // Intento 1: Bumeran Chile (SSR, red OCC)
    count = await fetchCount(`https://www.bumeran.cl/empleos-busqueda-${slug}-en-chile.html`)

    // Intento 2: Laborum Chile (SSR, red OCC)
    if (!count) {
      count = await fetchCount(`https://www.laborum.cl/empleos-en-chile/?q=${encodeURIComponent(cargo.query)}`)
    }

    // Intento 3: Trabajando.com
    if (!count) {
      count = await fetchCount(`https://www.trabajando.cl/trabajo/index?buscar%5Btexto%5D=${encodeURIComponent(cargo.query)}`)
    }

    console.log(`   ${cargo.label}: ${count}`)
    results.push({ cargo_id: cargo.id, count })
    await new Promise(r => setTimeout(r, 800))
  }

  return results
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const { semana, año } = getSemanaISO()
  const slug = `semana-${semana}-${año}`
  const fecha = new Date().toISOString().split('T')[0]

  console.log(`\n📊 Indicadores de Marketing — ${slug}`)

  // 1. Indicadores económicos
  console.log('💵 Obteniendo USD y UF...')
  const { usd, uf } = await fetchIndicadores()
  console.log(`   USD: $${usd} CLP | UF: $${uf.toLocaleString('es-CL')} CLP`)

  // 2. Semana anterior (para variaciones)
  const { data: prevData } = await supabase
    .from('indicadores_semanales')
    .select('usd_clp, ofertas_data')
    .order('semana', { ascending: false })
    .order('año', { ascending: false })
    .limit(1)
    .single()

  const usdPrev = prevData?.usd_clp || usd
  const usdVarPct = pct(usd, usdPrev)
  const cpcVarPct = usdVarPct // variación CPC = variación USD

  // 3. Calcular CPCs ajustados al USD actual
  const ajuste = usd / USD_BASE
  const cpcData = CPC_INDUSTRIAS.map(ind => {
    const googleClp = round(ind.google * ajuste)
    const metaClp   = round(ind.google * ind.metaRatio * ajuste)
    return {
      id:             ind.id,
      label:          ind.label,
      google_clp:     googleClp,
      meta_clp:       metaClp,
      google_var_pct: cpcVarPct,
      meta_var_pct:   cpcVarPct,
    }
  })

  // 4. Ofertas de trabajo
  let ofertasData = []
  let totalOfertas = 0
  let varTotalOfertas = null

  try {
    const rawOfertas = await fetchOfertas()
    const prevOfertasMap = {}
    if (prevData?.ofertas_data) {
      prevData.ofertas_data.forEach(o => { prevOfertasMap[o.id] = o.count })
    }

    ofertasData = CARGOS.map(c => {
      const item = rawOfertas.find(r => r.cargo_id === c.id)
      const count = item?.count || 0
      const prevCount = prevOfertasMap[c.id] || null
      return {
        id:        c.id,
        label:     c.label,
        count,
        var_pct:   prevCount !== null ? pct(count, prevCount) : null,
      }
    })

    totalOfertas = ofertasData.reduce((sum, o) => sum + o.count, 0)
    const prevTotal = prevData?.ofertas_data?.reduce((sum, o) => sum + (o.count || 0), 0) || null
    varTotalOfertas = prevTotal ? pct(totalOfertas, prevTotal) : null

    console.log(`💼 Ofertas totales en marketing digital: ${totalOfertas}`)
  } catch (err) {
    console.error('⚠️  Error scrapeando ofertas:', err.message)
  }

  // 5. Guardar en Supabase
  const { error } = await supabase.from('indicadores_semanales').upsert({
    slug, semana, año, fecha,
    usd_clp: usd,
    uf_clp: uf,
    usd_var_pct: usdVarPct,
    cpc_data: cpcData,
    ofertas_data: ofertasData,
    total_ofertas: totalOfertas,
    var_total_ofertas_pct: varTotalOfertas,
  }, { onConflict: 'slug' })

  if (error) throw new Error(`Supabase error: ${error.message}`)

  console.log(`\n✅ Indicadores guardados — ${slug}`)
  console.log(`   USD: $${usd} CLP (${usdVarPct > 0 ? '+' : ''}${usdVarPct}% vs sem. ant.)`)
  console.log(`   UF: $${uf.toLocaleString('es-CL')} CLP`)
  console.log(`   CPC ajuste: ×${ajuste.toFixed(3)} vs base Sep 2025`)
  console.log(`   Ofertas totales: ${totalOfertas}`)
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
