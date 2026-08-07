// @ts-nocheck
/**
 * ÓPTIMOS POR INDUSTRIA — Benchmarks dinámicos
 *
 * Retorna las referencias de mercado para una industria dada,
 * ajustadas por país, tipo cliente y tamaño empresa.
 * Sin factores del usuario — son los benchmarks puros.
 */

import { getBenchmark2026 } from './benchmarks-2026-verificados'
import { getCPCForCountry } from '../config/cpc-calibrado-2026'
import { getCountry } from '../config/latam-countries-2026'
import { getTasaCierreRef, TICKET_DEFAULTS } from './monte-carlo-engine'

export interface IndustryOptimal {
  industria: string
  industria_codigo: string
  pais: string
  tipo_cliente: string
  tamano: string

  // Benchmarks por plataforma (sin factores)
  google_search: {
    cpc: number         // CLP
    cpc_usd: number
    ctr: number         // %
    cvr: number         // %
    cpa_usd: number
  }
  google_display: {
    cpc_usd: number
    ctr: number
    cvr: number
    cpa_usd: number
  }
  meta_ads: {
    cpc: number         // CLP
    cpc_usd: number
    cpm_usd: number
    ctr: number
    cvr: number
    cpa_usd: number
    roas_benchmark?: number
  }

  // Referencias calculadas
  tasa_cierre_ref: number         // % según matrix
  ticket_ref: { min: number; medio: number; max: number }
  cpa_estimado: number            // CLP (CPC / CVR × tasa_cierre)
  roas_tipico: number             // benchmark ROAS o calculado
  presupuesto_optimo: { min: number; recomendado: number; max: number }
  max_conversiones_mes: number

  // Fuentes
  fuentes: string[]
  benchmark_year: number
}

/**
 * Calcula los óptimos de industria para mostrar como referencia.
 * Estos son los benchmarks PUROS sin factores del usuario.
 */
export function getIndustryOptimal(
  industria: string,
  pais: string = 'CL',
  tipo_cliente: string = 'B2C',
  tamano: string = 'PYME'
): IndustryOptimal | null {
  const benchmark = getBenchmark2026(industria)
  if (!benchmark) return null

  const country = getCountry(pais)
  const usdRate = country?.usd_exchange_rate || 935

  // CPCs sin factores del usuario
  const cpc_google = getCPCForCountry(industria, pais, 'google_search')
  const cpc_meta = getCPCForCountry(industria, pais, 'meta')

  // Tasa de cierre de referencia
  const tasa_cierre_ref = getTasaCierreRef(industria, tipo_cliente, tamano)

  // Ticket de referencia
  const ticket_ref = TICKET_DEFAULTS[industria] || { min: 50000, medio: 100000, max: 500000 }

  // CPA estimado (Google Search): CPC / (CVR% × tasa_cierre%)
  // CPA = presupuesto / conversiones = CPC / (CVR × tasa_cierre)
  const cvr_search = benchmark.google_search.cvr_web / 100
  const tasa = tasa_cierre_ref / 100
  const cpa_estimado = cpc_google / (cvr_search * tasa)

  // ROAS típico: ticket × tasa_cierre / CPA
  // O usar benchmark si existe
  const roas_tipico = benchmark.meta_ads.roas_benchmark ||
    (ticket_ref.medio * tasa / cpa_estimado) || 2.0

  // Presupuesto óptimo: basado en CPA × conversiones objetivo razonables
  const conv_objetivo_min = 10
  const conv_objetivo_rec = Math.min(benchmark.max_conversiones_mes * 0.3, 50)
  const conv_objetivo_max = Math.min(benchmark.max_conversiones_mes * 0.6, 100)

  const presupuesto_optimo = {
    min: Math.round(cpa_estimado * conv_objetivo_min),
    recomendado: Math.round(cpa_estimado * conv_objetivo_rec),
    max: Math.round(cpa_estimado * conv_objetivo_max),
  }

  return {
    industria: benchmark.nombre,
    industria_codigo: industria,
    pais,
    tipo_cliente,
    tamano,

    google_search: {
      cpc: cpc_google,
      cpc_usd: benchmark.google_search.cpc_usd,
      ctr: benchmark.google_search.ctr_base,
      cvr: benchmark.google_search.cvr_web,
      cpa_usd: benchmark.google_search.cpa_usd,
    },
    google_display: {
      cpc_usd: benchmark.google_display.cpc_usd,
      ctr: benchmark.google_display.ctr_base,
      cvr: benchmark.google_display.cvr_web,
      cpa_usd: benchmark.google_display.cpa_usd,
    },
    meta_ads: {
      cpc: cpc_meta,
      cpc_usd: benchmark.meta_ads.cpc_usd,
      cpm_usd: benchmark.meta_ads.cpm_usd,
      ctr: benchmark.meta_ads.ctr_base,
      cvr: benchmark.meta_ads.cvr_web,
      cpa_usd: benchmark.meta_ads.cpa_usd,
      roas_benchmark: benchmark.meta_ads.roas_benchmark,
    },

    tasa_cierre_ref,
    ticket_ref,
    cpa_estimado: Math.round(cpa_estimado),
    roas_tipico: +roas_tipico.toFixed(1),
    presupuesto_optimo,
    max_conversiones_mes: benchmark.max_conversiones_mes,

    fuentes: benchmark.fuentes_2026 || [],
    benchmark_year: 2026,
  }
}
