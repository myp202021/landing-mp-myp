// @ts-nocheck
/**
 * MOTOR MONTE CARLO v4 — Predictor M&P
 *
 * Simula 10,000 campañas posibles muestreando CPC, CTR, CVR
 * de distribuciones calibradas (LogNormal, Beta).
 * Retorna percentiles P5/P25/P50/P75/P95 por plataforma.
 *
 * Sin dependencias externas. Reproducible (PRNG seedeado).
 */

import {
  SeededRNG,
  logNormalFromMedian, sampleLogNormal,
  betaFromMeanCV, sampleBeta,
  extractPercentiles
} from './distributions'
import { getBenchmark2026 } from './benchmarks-2026-verificados'
import { getCPCForCountry } from '../config/cpc-calibrado-2026'
import { getCountry } from '../config/latam-countries-2026'

// ═══════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════

export interface MCInput {
  industria: string
  pais: string
  presupuesto_mensual: number
  ticket_promedio?: number        // opcional — usa default industria
  tasa_cierre?: number            // % (1-50) — opcional, usa matrix industria×B2B×tamaño
  objetivo: 'LEADS' | 'VENTAS_DIRECTAS' | 'AWARENESS'

  // Opcionales (con defaults)
  tipo_cliente?: 'B2B' | 'B2C' | 'MIXTO'
  tamano_empresa?: 'MICRO' | 'PYME' | 'MEDIANA' | 'GRANDE'  // nuevo
  competencia_percibida?: number  // 1-10, default 5
  madurez_digital?: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'
  ciclo_venta_dias?: number       // default por industria
  margen_bruto?: number           // %, default 40
  geo_objetivo?: 'SANTIAGO' | 'REGIONES' | 'NACIONAL'
}

export interface PlatformFunnel {
  platform: string
  budget_allocated: number
  allocation_pct: number
  // Percentiles para cada etapa del embudo
  impressions: PercentileSet
  clicks: PercentileSet
  leads: PercentileSet
  ventas: PercentileSet
  revenue: PercentileSet
  cpa: PercentileSet
  roas: PercentileSet
  // Benchmarks de la industria para comparación
  benchmark: {
    cpc: number
    ctr: number
    cvr: number
    cpa_usd: number
  }
}

export interface PercentileSet {
  p5: number
  p25: number
  p50: number
  p75: number
  p95: number
}

export interface MCResult {
  // Totales consolidados
  total: {
    conversiones: PercentileSet
    revenue: PercentileSet
    roas: PercentileSet
    cpa: PercentileSet
  }
  // Por plataforma
  funnels: PlatformFunnel[]
  // Métricas de confianza
  confidence: {
    prob_roas_gt_1: number        // P(ROAS > 1)
    prob_profitable: number       // P(ROAS > breakeven)
    roas_breakeven: number        // 1 / (margen/100)
    ic_90_conversiones: [number, number]
    ic_90_revenue: [number, number]
  }
  // Distribución raw para histograma (binned)
  histogram: {
    conversiones: { bin: number, count: number }[]
    roas: { bin: number, count: number }[]
  }
  // Metadata
  meta: {
    iterations: number
    seed: number
    industria: string
    pais: string
    presupuesto: number
    fuentes: string[]
    benchmark_year: number
  }
}

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════

const N_ITERATIONS = 10_000

// Sigma base para distribuciones (dispersión)
const SIGMA_CPC_SEARCH = 0.30
const SIGMA_CPC_DISPLAY = 0.35
const SIGMA_CPC_META = 0.35
const CV_CTR = 0.40  // Coef. variación para CTR
const CV_CVR = 0.50  // Coef. variación para CVR

// Umbrales de saturación por industria (rendimientos decrecientes)
const SATURATION_THRESHOLDS: Record<string, number> = {
  ECOMMERCE: 5_000_000,
  INMOBILIARIA: 8_000_000,
  TURISMO: 4_000_000,
  GASTRONOMIA: 3_000_000,
  AUTOMOTRIZ: 10_000_000,
  SALUD_MEDICINA: 6_000_000,
  EDUCACION: 7_000_000,
  MODA_RETAIL: 5_000_000,
  FINTECH: 8_000_000,
  SERVICIOS_LEGALES: 12_000_000,
  BELLEZA_PERSONAL: 4_000_000,
  TECNOLOGIA_SAAS: 15_000_000,
  CONSTRUCCION_REMODELACION: 6_000_000,
  DEPORTES_FITNESS: 4_000_000,
  VETERINARIA_MASCOTAS: 3_000_000,
  MANUFACTURA_INDUSTRIAL: 8_000_000,
  LOGISTICA_TRANSPORTE: 7_000_000,
  SEGUROS: 10_000_000,
  AGRICULTURA_AGROINDUSTRIA: 5_000_000,
  SERVICIOS_PROFESIONALES: 6_000_000,
  ENERGIA_UTILITIES: 8_000_000,
  HOGAR_DECORACION: 4_000_000,
}

// Tasa de cierre matrix: industria × tipo_cliente × tamaño
// Formato: { B2C: { MICRO, PYME, MEDIANA, GRANDE }, B2B: idem }
const TASA_CIERRE_MATRIX: Record<string, Record<string, Record<string, number>>> = {
  ECOMMERCE:                { B2C: { MICRO: 6, PYME: 8, MEDIANA: 10, GRANDE: 12 },  B2B: { MICRO: 3, PYME: 5, MEDIANA: 6, GRANDE: 8 } },
  INMOBILIARIA:             { B2C: { MICRO: 2, PYME: 3, MEDIANA: 4, GRANDE: 5 },    B2B: { MICRO: 2, PYME: 3, MEDIANA: 4, GRANDE: 5 } },
  TURISMO:                  { B2C: { MICRO: 8, PYME: 12, MEDIANA: 15, GRANDE: 18 }, B2B: { MICRO: 5, PYME: 8, MEDIANA: 10, GRANDE: 12 } },
  GASTRONOMIA:              { B2C: { MICRO: 12, PYME: 15, MEDIANA: 18, GRANDE: 20 },B2B: { MICRO: 8, PYME: 10, MEDIANA: 12, GRANDE: 15 } },
  AUTOMOTRIZ:               { B2C: { MICRO: 3, PYME: 5, MEDIANA: 6, GRANDE: 8 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 5, GRANDE: 6 } },
  SALUD_MEDICINA:           { B2C: { MICRO: 8, PYME: 10, MEDIANA: 12, GRANDE: 15 }, B2B: { MICRO: 5, PYME: 8, MEDIANA: 10, GRANDE: 12 } },
  EDUCACION:                { B2C: { MICRO: 5, PYME: 8, MEDIANA: 10, GRANDE: 12 },  B2B: { MICRO: 3, PYME: 5, MEDIANA: 8, GRANDE: 10 } },
  MODA_RETAIL:              { B2C: { MICRO: 8, PYME: 10, MEDIANA: 12, GRANDE: 15 }, B2B: { MICRO: 5, PYME: 8, MEDIANA: 10, GRANDE: 12 } },
  FINTECH:                  { B2C: { MICRO: 3, PYME: 5, MEDIANA: 6, GRANDE: 8 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 5, GRANDE: 6 } },
  SERVICIOS_LEGALES:        { B2C: { MICRO: 5, PYME: 8, MEDIANA: 10, GRANDE: 12 }, B2B: { MICRO: 3, PYME: 5, MEDIANA: 8, GRANDE: 10 } },
  BELLEZA_PERSONAL:         { B2C: { MICRO: 10, PYME: 12, MEDIANA: 15, GRANDE: 18 },B2B: { MICRO: 5, PYME: 8, MEDIANA: 10, GRANDE: 12 } },
  TECNOLOGIA_SAAS:          { B2C: { MICRO: 3, PYME: 5, MEDIANA: 6, GRANDE: 8 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 4, GRANDE: 5 } },
  CONSTRUCCION_REMODELACION:{ B2C: { MICRO: 3, PYME: 5, MEDIANA: 6, GRANDE: 8 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 5, GRANDE: 6 } },
  DEPORTES_FITNESS:         { B2C: { MICRO: 8, PYME: 10, MEDIANA: 12, GRANDE: 15 }, B2B: { MICRO: 5, PYME: 8, MEDIANA: 10, GRANDE: 12 } },
  VETERINARIA_MASCOTAS:     { B2C: { MICRO: 12, PYME: 15, MEDIANA: 18, GRANDE: 20 },B2B: { MICRO: 8, PYME: 10, MEDIANA: 12, GRANDE: 15 } },
  MANUFACTURA_INDUSTRIAL:   { B2C: { MICRO: 2, PYME: 3, MEDIANA: 4, GRANDE: 5 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 4, GRANDE: 5 } },
  LOGISTICA_TRANSPORTE:     { B2C: { MICRO: 3, PYME: 5, MEDIANA: 6, GRANDE: 8 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 5, GRANDE: 6 } },
  SEGUROS:                  { B2C: { MICRO: 3, PYME: 5, MEDIANA: 6, GRANDE: 8 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 5, GRANDE: 6 } },
  AGRICULTURA_AGROINDUSTRIA:{ B2C: { MICRO: 3, PYME: 5, MEDIANA: 6, GRANDE: 8 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 5, GRANDE: 6 } },
  SERVICIOS_PROFESIONALES:  { B2C: { MICRO: 3, PYME: 5, MEDIANA: 6, GRANDE: 8 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 5, GRANDE: 6 } },
  ENERGIA_UTILITIES:        { B2C: { MICRO: 2, PYME: 3, MEDIANA: 4, GRANDE: 5 },   B2B: { MICRO: 2, PYME: 3, MEDIANA: 4, GRANDE: 5 } },
  HOGAR_DECORACION:         { B2C: { MICRO: 8, PYME: 10, MEDIANA: 12, GRANDE: 15 }, B2B: { MICRO: 5, PYME: 8, MEDIANA: 10, GRANDE: 12 } },
}

/** Obtiene tasa de cierre de referencia según industria, tipo cliente y tamaño */
export function getTasaCierreRef(
  industria: string,
  tipo_cliente: string = 'B2C',
  tamano: string = 'PYME'
): number {
  const tipo = tipo_cliente === 'B2B' ? 'B2B' : 'B2C'
  const tam = ['MICRO', 'PYME', 'MEDIANA', 'GRANDE'].includes(tamano) ? tamano : 'PYME'
  return TASA_CIERRE_MATRIX[industria]?.[tipo]?.[tam] ?? 5
}

// Legacy export para compatibilidad
const TASA_CIERRE_DEFAULTS: Record<string, number> = Object.fromEntries(
  Object.entries(TASA_CIERRE_MATRIX).map(([k, v]) => [k, v.B2C.PYME])
)

// Ticket de referencia por industria (CLP)
const TICKET_DEFAULTS: Record<string, { min: number, medio: number, max: number }> = {
  ECOMMERCE: { min: 15_000, medio: 45_000, max: 200_000 },
  INMOBILIARIA: { min: 50_000_000, medio: 150_000_000, max: 500_000_000 },
  TURISMO: { min: 80_000, medio: 250_000, max: 2_000_000 },
  GASTRONOMIA: { min: 8_000, medio: 20_000, max: 80_000 },
  AUTOMOTRIZ: { min: 8_000_000, medio: 18_000_000, max: 50_000_000 },
  SALUD_MEDICINA: { min: 30_000, medio: 80_000, max: 500_000 },
  EDUCACION: { min: 100_000, medio: 500_000, max: 3_000_000 },
  MODA_RETAIL: { min: 15_000, medio: 40_000, max: 150_000 },
  FINTECH: { min: 50_000, medio: 300_000, max: 5_000_000 },
  SERVICIOS_LEGALES: { min: 500_000, medio: 2_000_000, max: 15_000_000 },
  BELLEZA_PERSONAL: { min: 15_000, medio: 40_000, max: 200_000 },
  TECNOLOGIA_SAAS: { min: 30_000, medio: 150_000, max: 1_000_000 },
  CONSTRUCCION_REMODELACION: { min: 500_000, medio: 3_000_000, max: 30_000_000 },
  DEPORTES_FITNESS: { min: 20_000, medio: 50_000, max: 300_000 },
  VETERINARIA_MASCOTAS: { min: 15_000, medio: 40_000, max: 200_000 },
  MANUFACTURA_INDUSTRIAL: { min: 1_000_000, medio: 10_000_000, max: 100_000_000 },
  LOGISTICA_TRANSPORTE: { min: 200_000, medio: 1_000_000, max: 10_000_000 },
  SEGUROS: { min: 50_000, medio: 200_000, max: 2_000_000 },
  AGRICULTURA_AGROINDUSTRIA: { min: 500_000, medio: 3_000_000, max: 30_000_000 },
  SERVICIOS_PROFESIONALES: { min: 200_000, medio: 800_000, max: 5_000_000 },
  ENERGIA_UTILITIES: { min: 1_000_000, medio: 5_000_000, max: 50_000_000 },
  HOGAR_DECORACION: { min: 30_000, medio: 100_000, max: 500_000 },
}

// Tipo cliente default por industria
const TIPO_CLIENTE_DEFAULTS: Record<string, 'B2B' | 'B2C'> = {
  ECOMMERCE: 'B2C', INMOBILIARIA: 'B2C', TURISMO: 'B2C', GASTRONOMIA: 'B2C',
  AUTOMOTRIZ: 'B2C', SALUD_MEDICINA: 'B2C', EDUCACION: 'B2C', MODA_RETAIL: 'B2C',
  FINTECH: 'B2C', SERVICIOS_LEGALES: 'B2C', BELLEZA_PERSONAL: 'B2C',
  TECNOLOGIA_SAAS: 'B2B', CONSTRUCCION_REMODELACION: 'B2C', DEPORTES_FITNESS: 'B2C',
  VETERINARIA_MASCOTAS: 'B2C', MANUFACTURA_INDUSTRIAL: 'B2B', LOGISTICA_TRANSPORTE: 'B2B',
  SEGUROS: 'B2C', AGRICULTURA_AGROINDUSTRIA: 'B2B', SERVICIOS_PROFESIONALES: 'B2B',
  ENERGIA_UTILITIES: 'B2B', HOGAR_DECORACION: 'B2C',
}

// ═══════════════════════════════════════════════════════════════════
// DISTRIBUCIÓN DE PRESUPUESTO POR PLATAFORMA
// ═══════════════════════════════════════════════════════════════════

interface PlatformAllocation {
  platform: string
  pct: number
}

function calcularAllocations(
  presupuesto: number,
  tipo_cliente: 'B2B' | 'B2C' | 'MIXTO',
  objetivo: string,
  industria: string
): PlatformAllocation[] {
  let allocations: PlatformAllocation[]

  // Base por tipo de cliente
  if (tipo_cliente === 'B2B') {
    allocations = [
      { platform: 'google_search', pct: 55 },
      { platform: 'meta_ads', pct: 25 },
      { platform: 'google_display', pct: 20 },
    ]
  } else {
    allocations = [
      { platform: 'google_search', pct: 45 },
      { platform: 'meta_ads', pct: 40 },
      { platform: 'google_display', pct: 15 },
    ]
  }

  // Modificar por objetivo
  if (objetivo === 'AWARENESS') {
    // +15% Meta/Display, -15% Search
    const searchIdx = allocations.findIndex(a => a.platform === 'google_search')
    const metaIdx = allocations.findIndex(a => a.platform === 'meta_ads')
    const displayIdx = allocations.findIndex(a => a.platform === 'google_display')
    if (searchIdx >= 0) allocations[searchIdx].pct -= 15
    if (metaIdx >= 0) allocations[metaIdx].pct += 10
    if (displayIdx >= 0) allocations[displayIdx].pct += 5
  } else if (objetivo === 'LEADS') {
    // +10% Search
    const searchIdx = allocations.findIndex(a => a.platform === 'google_search')
    const displayIdx = allocations.findIndex(a => a.platform === 'google_display')
    if (searchIdx >= 0) allocations[searchIdx].pct += 5
    if (displayIdx >= 0) allocations[displayIdx].pct -= 5
  }

  // Si presupuesto < $1M, solo 1 plataforma (la principal)
  if (presupuesto < 1_000_000) {
    allocations = [{ platform: allocations[0].platform, pct: 100 }]
  }
  // Si < $2M, solo 2 plataformas
  else if (presupuesto < 2_000_000) {
    allocations = allocations.slice(0, 2)
    const total = allocations.reduce((s, a) => s + a.pct, 0)
    allocations = allocations.map(a => ({ ...a, pct: Math.round(a.pct / total * 100) }))
  }

  // Normalizar a 100%
  const total = allocations.reduce((s, a) => s + a.pct, 0)
  if (total !== 100) {
    const factor = 100 / total
    allocations = allocations.map(a => ({ ...a, pct: Math.round(a.pct * factor) }))
    // Ajustar residuo al primero
    const newTotal = allocations.reduce((s, a) => s + a.pct, 0)
    allocations[0].pct += 100 - newTotal
  }

  return allocations
}

// ═══════════════════════════════════════════════════════════════════
// FACTORES DE AJUSTE (simplificado de ponderadores-sistema-2024)
// ═══════════════════════════════════════════════════════════════════

function calcularFactores(input: MCInput) {
  const competencia = input.competencia_percibida ?? 5
  const madurez = input.madurez_digital ?? 'INTERMEDIO'
  const geo = input.geo_objetivo ?? 'NACIONAL'

  // Factor CPC por competencia (más competencia → CPC más alto)
  const factor_cpc_competencia =
    competencia <= 3 ? 0.85 :
    competencia <= 5 ? 1.0 :
    competencia <= 7 ? 1.15 :
    1.35

  // Factor CPC por madurez digital (mejor quality score → CPC más bajo)
  const factor_cpc_madurez =
    madurez === 'PRINCIPIANTE' ? 1.15 :
    madurez === 'AVANZADO' ? 0.85 : 1.0

  // Factor CPC por geografía
  const factor_cpc_geo =
    geo === 'SANTIAGO' ? 1.15 :
    geo === 'REGIONES' ? 0.85 : 1.0

  // Factor CVR por madurez
  const factor_cvr =
    madurez === 'PRINCIPIANTE' ? 0.8 :
    madurez === 'AVANZADO' ? 1.2 : 1.0

  // Factor performance (afecta conversiones finales)
  const factor_performance_competencia =
    competencia <= 3 ? 1.1 :
    competencia <= 5 ? 1.0 :
    competencia <= 7 ? 0.9 : 0.8

  // Sigma: competencia alta → más dispersión (absorbe factor_performance)
  // competencia 1-3: sigma normal, resultados más predecibles
  // competencia 4-7: sigma normal
  // competencia 8-10: sigma +20%, más incertidumbre en la subasta
  const sigma_multiplier =
    competencia <= 3 ? 0.90 :
    competencia <= 7 ? 1.0 :
    1.20

  // Factor ciclo venta (afecta revenue realizado)
  const ciclo = input.ciclo_venta_dias ?? 30
  const factor_revenue_realizado =
    ciclo <= 1 ? 1.0 :    // Instantáneo
    ciclo <= 30 ? 0.85 :  // < 1 mes
    ciclo <= 90 ? 0.65 :  // 1-3 meses
    0.45                  // > 3 meses

  return {
    factor_cpc_total: factor_cpc_competencia * factor_cpc_madurez * factor_cpc_geo,
    factor_cvr,
    factor_revenue_realizado,
    sigma_multiplier
  }
}

// ═══════════════════════════════════════════════════════════════════
// RENDIMIENTOS DECRECIENTES
// ═══════════════════════════════════════════════════════════════════

function aplicarRendimientosDecrecientes(
  clicks: number,
  budget: number,
  industria: string
): number {
  const threshold = SATURATION_THRESHOLDS[industria] || 5_000_000
  if (budget <= threshold * 0.3) return clicks // Sin efecto para budgets bajos

  // clicks_efectivos = threshold * ln(1 + budget/threshold)
  // Normalizado para que budget=threshold → ~69% eficiencia
  const efficiency = threshold * Math.log(1 + budget / threshold) / budget
  return clicks * Math.min(efficiency, 1.0)
}

// ═══════════════════════════════════════════════════════════════════
// MOTOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

export function runMonteCarlo(input: MCInput): MCResult {
  const benchmark = getBenchmark2026(input.industria)
  if (!benchmark) {
    throw new Error(`Industria '${input.industria}' no soportada`)
  }

  const country = getCountry(input.pais || 'CL')
  const factores = calcularFactores(input)
  const tipo_cliente = input.tipo_cliente || TIPO_CLIENTE_DEFAULTS[input.industria] || 'B2C'

  const allocations = calcularAllocations(
    input.presupuesto_mensual,
    tipo_cliente,
    input.objetivo,
    input.industria
  )

  const margen_bruto = input.margen_bruto ?? 40
  const roas_breakeven = 1 / (margen_bruto / 100)

  // Tasa de cierre: usar input del usuario o referencia de mercado
  const tamano = input.tamano_empresa ?? 'PYME'
  const tasa_cierre_ref = getTasaCierreRef(input.industria, tipo_cliente, tamano)
  const tasa_cierre = input.tasa_cierre ?? tasa_cierre_ref
  const tasa_cierre_es_default = !input.tasa_cierre

  // Ticket: usar input del usuario o default industria
  const ticket_ref = TICKET_DEFAULTS[input.industria]?.medio ?? 100000
  const ticket_promedio = input.ticket_promedio ?? ticket_ref
  const ticket_es_default = !input.ticket_promedio

  // Seed basado en inputs para reproducibilidad
  const seed = hashInputs(input)
  const rng = new SeededRNG(seed)

  // Preparar distribuciones por plataforma
  const platformConfigs = allocations.map(alloc => {
    const p = alloc.platform
    const budget = input.presupuesto_mensual * alloc.pct / 100

    let cpc_median: number
    let ctr_mean: number
    let cvr_mean: number
    let sigma_cpc: number
    let cpa_usd_bench: number

    // getCPCForCountry ya retorna CPC ajustado al país (Ubersuggest para CL, USD×rate para otros)
    // NO multiplicar por chile_factor — eso sería doble ajuste
    if (p === 'google_search') {
      cpc_median = getCPCForCountry(input.industria, input.pais, 'google_search')
        * factores.factor_cpc_total
      ctr_mean = benchmark.google_search.ctr_base / 100
      cvr_mean = benchmark.google_search.cvr_web / 100 * factores.factor_cvr
      sigma_cpc = SIGMA_CPC_SEARCH * factores.sigma_multiplier
      cpa_usd_bench = benchmark.google_search.cpa_usd
    } else if (p === 'google_display') {
      cpc_median = getCPCForCountry(input.industria, input.pais, 'google_display')
        * factores.factor_cpc_total
      ctr_mean = benchmark.google_display.ctr_base / 100
      cvr_mean = benchmark.google_display.cvr_web / 100 * factores.factor_cvr
      sigma_cpc = SIGMA_CPC_DISPLAY * factores.sigma_multiplier
      cpa_usd_bench = benchmark.google_display.cpa_usd
    } else {
      // meta_ads
      cpc_median = getCPCForCountry(input.industria, input.pais, 'meta')
        * factores.factor_cpc_total
      ctr_mean = benchmark.meta_ads.ctr_base / 100
      cvr_mean = benchmark.meta_ads.cvr_web / 100 * factores.factor_cvr
      sigma_cpc = SIGMA_CPC_META * factores.sigma_multiplier
      cpa_usd_bench = benchmark.meta_ads.cpa_usd
    }

    // Asegurar valores mínimos
    cpc_median = Math.max(cpc_median, 10)
    ctr_mean = Math.max(ctr_mean, 0.001)
    cvr_mean = Math.max(cvr_mean, 0.001)

    return {
      ...alloc,
      budget,
      cpc_params: logNormalFromMedian(cpc_median, sigma_cpc),
      ctr_params: betaFromMeanCV(ctr_mean, CV_CTR),
      cvr_params: betaFromMeanCV(cvr_mean, CV_CVR),
      benchmark_cpc: cpc_median / factores.factor_cpc_total, // CPC sin ajustes usuario = benchmark puro
      benchmark_ctr: ctr_mean * 100,
      benchmark_cvr: cvr_mean / factores.factor_cvr * 100,
      cpa_usd_bench
    }
  })

  // Arrays de resultados por plataforma
  const platformResults = platformConfigs.map(() => ({
    impressions: new Float64Array(N_ITERATIONS),
    clicks: new Float64Array(N_ITERATIONS),
    leads: new Float64Array(N_ITERATIONS),
    ventas: new Float64Array(N_ITERATIONS),
    revenue: new Float64Array(N_ITERATIONS),
    cpa: new Float64Array(N_ITERATIONS),
    roas: new Float64Array(N_ITERATIONS),
  }))

  // Arrays totales
  const totalLeads = new Float64Array(N_ITERATIONS)        // LEADS = clicks × CVR (métrica principal)
  const totalConversiones = new Float64Array(N_ITERATIONS)  // VENTAS = leads × tasa_cierre
  const totalRevenue = new Float64Array(N_ITERATIONS)
  const totalRoas = new Float64Array(N_ITERATIONS)
  const totalCpa = new Float64Array(N_ITERATIONS)
  const totalCpl = new Float64Array(N_ITERATIONS)           // Costo por lead

  // ═══════════════════════════════════════════════════════
  // SIMULACIÓN: 10,000 iteraciones
  // ═══════════════════════════════════════════════════════

  for (let i = 0; i < N_ITERATIONS; i++) {
    let sumLeads = 0
    let sumConv = 0
    let sumRev = 0

    for (let p = 0; p < platformConfigs.length; p++) {
      const cfg = platformConfigs[p]
      const res = platformResults[p]

      // 1. Muestrear KPIs
      const cpc = sampleLogNormal(rng, cfg.cpc_params)
      const ctr = sampleBeta(rng, cfg.ctr_params)
      const cvr = sampleBeta(rng, cfg.cvr_params)

      // 2. Calcular embudo
      // factor_performance se absorbe en sigma (más competencia → más dispersión, no menos clicks)
      let clicks = cfg.budget / cpc
      clicks = aplicarRendimientosDecrecientes(clicks, cfg.budget, input.industria)

      const impressions = clicks / Math.max(ctr, 0.0001)
      const leads = clicks * cvr
      // Cap por max_conversiones_mes de la industria (proporcionado por plataforma)
      const maxConvPlatform = (benchmark.max_conversiones_mes || 200) * (cfg.pct / 100)
      const ventas = Math.min(leads * (tasa_cierre / 100), maxConvPlatform)
      const revenue = ventas * ticket_promedio * factores.factor_revenue_realizado

      // 3. Guardar
      res.impressions[i] = impressions
      res.clicks[i] = clicks
      res.leads[i] = leads
      res.ventas[i] = ventas
      res.revenue[i] = revenue
      res.cpa[i] = ventas > 0 ? cfg.budget / ventas : cfg.budget
      res.roas[i] = cfg.budget > 0 ? revenue / cfg.budget : 0

      sumLeads += leads
      sumConv += ventas
      sumRev += revenue
    }

    totalLeads[i] = sumLeads
    totalConversiones[i] = sumConv
    totalRevenue[i] = sumRev
    totalRoas[i] = input.presupuesto_mensual > 0 ? sumRev / input.presupuesto_mensual : 0
    totalCpa[i] = sumConv > 0 ? input.presupuesto_mensual / sumConv : input.presupuesto_mensual
    totalCpl[i] = sumLeads > 0 ? input.presupuesto_mensual / sumLeads : input.presupuesto_mensual
  }

  // ═══════════════════════════════════════════════════════
  // EXTRAER PERCENTILES
  // ═══════════════════════════════════════════════════════

  const toPercentileSet = (arr: Float64Array): PercentileSet => {
    const sorted = Array.from(arr).sort((a, b) => a - b)
    return {
      p5: percentileFromSorted(sorted, 5),
      p25: percentileFromSorted(sorted, 25),
      p50: percentileFromSorted(sorted, 50),
      p75: percentileFromSorted(sorted, 75),
      p95: percentileFromSorted(sorted, 95),
    }
  }

  // Funnels por plataforma
  const funnels: PlatformFunnel[] = platformConfigs.map((cfg, p) => {
    const res = platformResults[p]
    return {
      platform: cfg.platform,
      budget_allocated: cfg.budget,
      allocation_pct: cfg.pct,
      impressions: toPercentileSet(res.impressions),
      clicks: toPercentileSet(res.clicks),
      leads: toPercentileSet(res.leads),
      ventas: toPercentileSet(res.ventas),
      revenue: toPercentileSet(res.revenue),
      cpa: toPercentileSet(res.cpa),
      roas: toPercentileSet(res.roas),
      benchmark: {
        cpc: Math.round(cfg.benchmark_cpc),
        ctr: +cfg.benchmark_ctr.toFixed(2),
        cvr: +cfg.benchmark_cvr.toFixed(2),
        cpa_usd: cfg.cpa_usd_bench
      }
    }
  })

  // Totales
  const total = {
    leads: toPercentileSet(totalLeads),             // LEADS = clicks × CVR (Google Ads "conversiones")
    conversiones: toPercentileSet(totalConversiones), // VENTAS = leads × tasa_cierre
    revenue: toPercentileSet(totalRevenue),
    roas: toPercentileSet(totalRoas),
    cpa: toPercentileSet(totalCpa),                  // Costo por venta
    cpl: toPercentileSet(totalCpl),                  // Costo por lead
  }

  // Métricas de confianza
  let countRoasGt1 = 0
  let countProfitable = 0
  for (let i = 0; i < N_ITERATIONS; i++) {
    if (totalRoas[i] > 1) countRoasGt1++
    if (totalRoas[i] > roas_breakeven) countProfitable++
  }

  const confidence = {
    prob_roas_gt_1: +(countRoasGt1 / N_ITERATIONS * 100).toFixed(1),
    prob_profitable: +(countProfitable / N_ITERATIONS * 100).toFixed(1),
    roas_breakeven: +roas_breakeven.toFixed(2),
    ic_90_conversiones: [total.conversiones.p5, total.conversiones.p95] as [number, number],
    ic_90_revenue: [total.revenue.p5, total.revenue.p95] as [number, number],
  }

  // Histograma de conversiones (20 bins)
  const convHistogram = buildHistogram(Array.from(totalConversiones), 20)
  const roasHistogram = buildHistogram(Array.from(totalRoas), 20)

  // Fuentes de datos
  const fuentes = benchmark.fuentes_2026 || ['wordstream_2026', 'getryze_2026', 'ubersuggest_chile_2025']

  return {
    total,
    funnels,
    confidence,
    histogram: {
      conversiones: convHistogram,
      roas: roasHistogram,
    },
    meta: {
      iterations: N_ITERATIONS,
      seed,
      industria: benchmark.nombre,
      industria_codigo: input.industria,
      pais: input.pais || 'CL',
      presupuesto: input.presupuesto_mensual,
      ticket_promedio: ticket_promedio,
      ticket_es_default: ticket_es_default,
      ticket_ref: ticket_ref,
      tasa_cierre: tasa_cierre,
      tasa_cierre_es_default: tasa_cierre_es_default,
      tasa_cierre_ref: tasa_cierre_ref,
      tipo_cliente: tipo_cliente,
      tamano_empresa: tamano,
      fuentes,
      benchmark_year: 2026,
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════

function percentileFromSorted(sorted: number[], p: number): number {
  const index = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  const weight = index - lower
  return +(sorted[lower] * (1 - weight) + sorted[upper] * weight).toFixed(2)
}

function buildHistogram(data: number[], bins: number): { bin: number, count: number }[] {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const binWidth = range / bins

  const counts = new Array(bins).fill(0)
  for (const v of data) {
    const idx = Math.min(Math.floor((v - min) / binWidth), bins - 1)
    counts[idx]++
  }

  return counts.map((count, i) => ({
    bin: +(min + (i + 0.5) * binWidth).toFixed(2),
    count
  }))
}

function hashInputs(input: MCInput): number {
  const str = `${input.industria}|${input.pais}|${input.presupuesto_mensual}|${input.ticket_promedio}|${input.tasa_cierre}|${input.objetivo}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash)
}

// Exports para uso externo
export { TASA_CIERRE_DEFAULTS, TASA_CIERRE_MATRIX, TICKET_DEFAULTS, TIPO_CLIENTE_DEFAULTS }
