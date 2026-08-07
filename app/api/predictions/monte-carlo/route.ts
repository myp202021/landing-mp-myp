// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { runMonteCarlo, TASA_CIERRE_DEFAULTS, TICKET_DEFAULTS } from '../../../../lib/engine/monte-carlo-engine'
import { getBenchmark2026 } from '../../../../lib/engine/benchmarks-2026-verificados'
import { getCountry } from '../../../../lib/config/latam-countries-2026'
import { getSourceAttribution } from '../../../../lib/config/data-sources-2026'

/**
 * API PREDICTOR v4 — Motor Monte Carlo
 *
 * Input mínimo: industria, pais, presupuesto_mensual, ticket_promedio, tasa_cierre, objetivo
 * Output: percentiles P5/P25/P50/P75/P95, embudos por plataforma, métricas de confianza, histograma
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validación mínima
    if (!body.industria) {
      return NextResponse.json({ error: 'Industria es requerida' }, { status: 400 })
    }
    if (!body.presupuesto_mensual || body.presupuesto_mensual < 100000) {
      return NextResponse.json({ error: 'Presupuesto mensual mínimo: $100,000' }, { status: 400 })
    }

    // Defaults inteligentes
    const industria = body.industria
    const ticketDefault = TICKET_DEFAULTS[industria]?.medio || 100000
    const tasaCierreDefault = TASA_CIERRE_DEFAULTS[industria] || 5

    const input = {
      industria,
      pais: body.pais || 'CL',
      presupuesto_mensual: body.presupuesto_mensual,
      ticket_promedio: body.ticket_promedio || ticketDefault,
      tasa_cierre: body.tasa_cierre || tasaCierreDefault,
      objetivo: body.objetivo || 'LEADS',
      // Opcionales
      tipo_cliente: body.tipo_cliente,
      competencia_percibida: body.competencia_percibida,
      madurez_digital: body.madurez_digital,
      ciclo_venta_dias: body.ciclo_venta_dias,
      margen_bruto: body.margen_bruto,
      geo_objetivo: body.geo_objetivo,
    }

    // Ejecutar Monte Carlo (10,000 iteraciones)
    const result = runMonteCarlo(input)

    // Benchmark data para comparación
    const benchmark = getBenchmark2026(industria)
    const country = getCountry(input.pais)

    // Respuesta
    return NextResponse.json({
      // Resultado Monte Carlo completo
      montecarlo: result,

      // Contexto
      contexto: {
        industria: benchmark?.nombre || industria,
        industria_codigo: industria,
        pais: input.pais,
        pais_info: country,
        presupuesto: input.presupuesto_mensual,
        ticket: input.ticket_promedio,
        tasa_cierre: input.tasa_cierre,
        objetivo: input.objetivo,
        defaults_usados: {
          ticket: !body.ticket_promedio,
          tasa_cierre: !body.tasa_cierre,
          ticket_default: ticketDefault,
          tasa_cierre_default: tasaCierreDefault,
        }
      },

      // Benchmarks de la industria (para comparación visual)
      benchmarks: benchmark ? {
        google_search: {
          cpc_clp: benchmark.google_search.cpc_base,
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
          cpc_usd: benchmark.meta_ads.cpc_usd,
          cpc_clp: benchmark.meta_ads.cpc_base,
          cpm_usd: benchmark.meta_ads.cpm_usd,
          ctr: benchmark.meta_ads.ctr_base,
          cvr: benchmark.meta_ads.cvr_web,
          cpa_usd: benchmark.meta_ads.cpa_usd,
          roas_benchmark: benchmark.meta_ads.roas_benchmark,
        },
        max_conversiones_mes: benchmark.max_conversiones_mes,
        roas_maximo: benchmark.roas_maximo,
        recomendaciones: benchmark.recomendaciones,
        plataformas_recomendadas: benchmark.plataformas_recomendadas,
      } : null,

      // Fuentes
      fuentes: {
        year: 2026,
        sources: benchmark?.fuentes_2026 || [],
        attribution: getSourceAttribution(benchmark?.fuentes_2026 || []),
      },

      // Meta
      version: '4.0.0',
      motor: 'Monte Carlo 10K iteraciones',
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error Monte Carlo:', error)
    return NextResponse.json(
      {
        error: 'Error en predicción',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'M&P Predictor v4 — Motor Monte Carlo',
    version: '4.0.0',
    description: 'Predicción de campañas con simulación Monte Carlo (10K iteraciones), embudos por plataforma, percentiles P5/P25/P50/P75/P95',
    industries: 22,
    countries: 6,
    benchmark_year: 2026,
    endpoints: {
      POST: {
        required: ['industria', 'presupuesto_mensual'],
        optional: ['pais', 'ticket_promedio', 'tasa_cierre', 'objetivo', 'tipo_cliente', 'competencia_percibida', 'madurez_digital', 'ciclo_venta_dias', 'margen_bruto', 'geo_objetivo'],
      }
    }
  })
}
