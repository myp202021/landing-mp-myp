/**
 * TERMÓMETRO DE MARKETING DIGITAL CHILE
 * Actualiza semanalmente:
 * 1. USD / UF desde mindicador.cl (gratis, sin token)
 * 2. CPC estimado por industria (Google + Meta) ajustado al tipo de cambio
 * 3. CPA estimado por industria = CPC / CVR (tasas del predictor M&P)
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
// cvr: tasa de conversión promedio del predictor M&P (%)
const CPC_INDUSTRIAS = [
  { id: 'ecommerce',      label: 'E-commerce',              google: 248, metaRatio: 0.65, cvr: 2.1 },
  { id: 'moda_retail',    label: 'Moda y Retail',           google: 128, metaRatio: 0.70, cvr: 2.4 },
  { id: 'gastronomia',    label: 'Gastronomía',             google: 162, metaRatio: 0.72, cvr: 2.8 },
  { id: 'educacion',      label: 'Educación',               google: 146, metaRatio: 0.58, cvr: 4.2 },
  { id: 'tecnologia',     label: 'Tecnología / SaaS',       google: 39,  metaRatio: 0.52, cvr: 3.2 },
  { id: 'hogar',          label: 'Hogar y Decoración',      google: 165, metaRatio: 0.62, cvr: 2.1 },
  { id: 'belleza',        label: 'Belleza y Cuidado',       google: 251, metaRatio: 0.68, cvr: 2.9 },
  { id: 'deportes',       label: 'Deportes y Fitness',      google: 195, metaRatio: 0.65, cvr: 2.8 },
  { id: 'veterinaria',    label: 'Veterinaria y Mascotas',  google: 175, metaRatio: 0.68, cvr: 4.8 },
  { id: 'automotriz',     label: 'Automotriz',              google: 248, metaRatio: 0.55, cvr: 1.6 },
  { id: 'inmobiliaria',   label: 'Inmobiliaria',            google: 215, metaRatio: 0.58, cvr: 1.8 },
  { id: 'turismo',        label: 'Turismo y Viajes',        google: 421, metaRatio: 0.62, cvr: 2.1 },
  { id: 'salud',          label: 'Salud y Medicina',        google: 369, metaRatio: 0.55, cvr: 3.4 },
  { id: 'legal',          label: 'Servicios Legales',       google: 391, metaRatio: 0.42, cvr: 3.1 },
  { id: 'profesionales',  label: 'Servicios Profesionales', google: 295, metaRatio: 0.52, cvr: 3.2 },
  { id: 'construccion',   label: 'Construcción',            google: 385, metaRatio: 0.50, cvr: 2.1 },
  { id: 'logistica',      label: 'Logística y Transporte',  google: 310, metaRatio: 0.45, cvr: 2.4 },
  { id: 'seguros',        label: 'Seguros',                 google: 520, metaRatio: 0.50, cvr: 2.1 },
  { id: 'manufactura',    label: 'Manufactura B2B',         google: 425, metaRatio: 0.40, cvr: 2.8 },
  { id: 'energia',        label: 'Energía / Utilities',     google: 450, metaRatio: 0.42, cvr: 2.1 },
  { id: 'fintech',        label: 'Fintech',                 google: 479, metaRatio: 0.48, cvr: 2.8 },
  { id: 'agro',           label: 'Agro / Agroindustria',    google: 185, metaRatio: 0.45, cvr: 2.4 },
]
const USD_BASE = 935 // tasa de referencia cuando se calibraron los CPCs

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
    .select('usd_clp, cpc_data')
    .order('semana', { ascending: false })
    .order('año', { ascending: false })
    .limit(1)
    .single()

  const usdPrev   = prevData?.usd_clp || usd
  const usdVarPct = pct(usd, usdPrev)
  const cpcVarPct = usdVarPct // variación CPC = variación USD

  // 3. Calcular CPCs y CPAs ajustados al USD actual
  const ajuste = usd / USD_BASE
  const cpcData = CPC_INDUSTRIAS.map(ind => {
    const googleClp = round(ind.google * ajuste)
    const metaClp   = round(ind.google * ind.metaRatio * ajuste)
    // CPA = CPC / CVR   (CVR en decimal: 2.1% → 0.021)
    const cpaGoogle = round(googleClp / (ind.cvr / 100))
    const cpaMeta   = round(metaClp   / (ind.cvr / 100))
    return {
      id:             ind.id,
      label:          ind.label,
      google_clp:     googleClp,
      meta_clp:       metaClp,
      cpa_google_clp: cpaGoogle,
      cpa_meta_clp:   cpaMeta,
      cvr:            ind.cvr,
      google_var_pct: cpcVarPct,
      meta_var_pct:   cpcVarPct,
    }
  })

  console.log('✅ CPCs y CPAs calculados')
  cpcData.forEach(c => console.log(`   ${c.label}: G $${c.google_clp} / M $${c.meta_clp} | CPA G $${c.cpa_google_clp} / M $${c.cpa_meta_clp}`))

  // 4. Guardar en Supabase
  const { error } = await supabase.from('indicadores_semanales').upsert({
    slug, semana, año, fecha,
    usd_clp:     usd,
    uf_clp:      uf,
    usd_var_pct: usdVarPct,
    cpc_data:    cpcData,
  }, { onConflict: 'slug' })

  if (error) throw new Error(`Supabase error: ${error.message}`)

  console.log(`\n✅ Indicadores guardados — ${slug}`)
  console.log(`   USD: $${usd} CLP (${usdVarPct > 0 ? '+' : ''}${usdVarPct}% vs sem. ant.)`)
  console.log(`   UF: $${uf.toLocaleString('es-CL')} CLP`)
  console.log(`   CPC ajuste: ×${ajuste.toFixed(3)} vs base Sep 2025`)
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
