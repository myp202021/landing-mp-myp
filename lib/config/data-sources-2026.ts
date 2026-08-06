/**
 * FUENTES DE DATOS 2026 — Atribución verificable
 * Cada benchmark en el predictor debe poder rastrearse a una fuente real.
 * Última actualización: Agosto 2026
 */

export interface DataSource {
  id: string
  name: string
  url: string
  publisher: string
  date_accessed: string
  metrics_provided: string[]
  industries_covered: number
  geographic_scope: string
  notes: string
}

export const DATA_SOURCES_2026: Record<string, DataSource> = {

  wordstream_google_2026: {
    id: 'wordstream_google_2026',
    name: 'Google Ads Benchmarks 2026: Competitive Data & Insights for Every Industry',
    url: 'https://www.wordstream.com/blog/2026-google-ads-benchmarks',
    publisher: 'WordStream (LocaliQ)',
    date_accessed: '2026-08-06',
    metrics_provided: ['CPC Search', 'CPC Display', 'CTR Search', 'CTR Display', 'CVR Search', 'CVR Display', 'CPL'],
    industries_covered: 23,
    geographic_scope: 'Global (US-weighted)',
    notes: 'Fuente más citada de benchmarks Google Ads. Datos basados en miles de cuentas reales de clientes LocaliQ/WordStream.'
  },

  getryze_google_2026: {
    id: 'getryze_google_2026',
    name: 'Google Ads Benchmarks 2026 — Avg CPC, CTR, CPA by Industry',
    url: 'https://www.get-ryze.ai/blog/google-ads-cost-benchmarks-by-industry-2026',
    publisher: 'Get-Ryze.ai',
    date_accessed: '2026-08-06',
    metrics_provided: ['CPC Search', 'CPC Display', 'CTR', 'CVR', 'CPA', 'YoY Change'],
    industries_covered: 20,
    geographic_scope: 'Global (US-weighted)',
    notes: 'Cross-referencia con WordStream. Incluye cambio YoY y datos Display separados.'
  },

  digitalapplied_google_2026: {
    id: 'digitalapplied_google_2026',
    name: 'Google Ads Benchmarks 2026: CPC, CTR, CVR by Industry',
    url: 'https://www.digitalapplied.com/blog/google-ads-benchmarks-2026-cpc-ctr-cvr-industry',
    publisher: 'DigitalApplied',
    date_accessed: '2026-08-06',
    metrics_provided: ['CPC Search', 'CPC Display', 'CTR Search', 'CTR Display', 'CVR Search', 'CVR Display', 'CPA Search', 'CPA Display', 'YoY Change'],
    industries_covered: 20,
    geographic_scope: 'Global (US-weighted)',
    notes: 'Tablas detalladas con Search y Display separados, cambio YoY por industria. Tercera fuente de verificación cruzada.'
  },

  getryze_meta_2026: {
    id: 'getryze_meta_2026',
    name: 'Meta Ads Benchmarks 2026: CPM, CPC, CPA & CTR by Industry',
    url: 'https://www.get-ryze.ai/blog/meta-ads-cost-benchmarks-by-industry-2026',
    publisher: 'Get-Ryze.ai',
    date_accessed: '2026-08-06',
    metrics_provided: ['CPM', 'CPC', 'CTR', 'CPA', 'ROAS (ecommerce)'],
    industries_covered: 18,
    geographic_scope: 'Global',
    notes: 'Benchmarks Meta Ads por industria con ROAS para verticales ecommerce.'
  },

  adamigo_meta_country_2026: {
    id: 'adamigo_meta_country_2026',
    name: 'Meta Ads CPM & CPC Benchmarks by Country 2026',
    url: 'https://www.adamigo.ai/blog/meta-ads-cpm-cpc-benchmarks-by-country-2026',
    publisher: 'Adamigo.ai',
    date_accessed: '2026-08-06',
    metrics_provided: ['CPM por país', 'CPC por país'],
    industries_covered: 0,
    geographic_scope: 'Global por país (incluye Chile, México, Colombia, Argentina, Brasil, Perú)',
    notes: 'Fuente principal para factores de ajuste por país LATAM. Datos de Meta Ads por geografía.'
  },

  ubersuggest_chile_2025: {
    id: 'ubersuggest_chile_2025',
    name: 'Ubersuggest Chile: CPCs calibrados con promedio ponderado por volumen',
    url: 'https://neilpatel.com/ubersuggest/',
    publisher: 'Neil Patel / Ubersuggest',
    date_accessed: '2025-09-30',
    metrics_provided: ['CPC ponderado por volumen (Chile)', 'CPC mediano', 'CPC min/max', 'Volumen búsqueda'],
    industries_covered: 22,
    geographic_scope: 'Chile específico',
    notes: '333 keywords analizadas. Promedio ponderado por volumen de búsqueda. Base más precisa para CPCs Chile. Se mantiene como baseline, enriquecido con datos 2026.'
  },

  statista_latam_2024: {
    id: 'statista_latam_2024',
    name: 'Search Advertising CPC Latin America',
    url: 'https://statista.com/statistics/1262495/search-advertising-cpc-latin-america',
    publisher: 'Statista',
    date_accessed: '2026-08-06',
    metrics_provided: ['CPC promedio por país LATAM'],
    industries_covered: 0,
    geographic_scope: 'Latinoamérica por país',
    notes: 'Datos Statista para contexto comparativo entre países. Acceso parcial (paywall).'
  }
}

// Helper para obtener fuentes usadas en una industria
export function getSourcesForIndustry(fuentes: string[]): DataSource[] {
  return fuentes
    .map(id => DATA_SOURCES_2026[id])
    .filter(Boolean)
}

// Texto corto de atribución para UI
export function getSourceAttribution(fuentes: string[]): string {
  const all = fuentes.map(id => DATA_SOURCES_2026[id]?.publisher).filter(Boolean)
  const unique: string[] = []
  all.forEach(p => { if (!unique.includes(p as string)) unique.push(p as string) })
  return unique.join(', ')
}
