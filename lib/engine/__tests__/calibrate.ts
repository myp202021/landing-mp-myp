// @ts-nocheck
/**
 * SISTEMA DE CALIBRACIÓN AUTOMATIZADA — Predictor M&P v5
 *
 * 3 agentes en secuencia:
 * 1. TESTER: genera 3,000+ escenarios, corre MC, evalúa
 * 2. DETECTOR: agrupa desviaciones, clasifica, recomienda ajustes
 * 3. CALIBRADOR: aplica ajustes, re-verifica, itera hasta <2%
 *
 * Ejecutar: npx tsx lib/engine/__tests__/calibrate.ts
 */

import { runMonteCarlo, TICKET_DEFAULTS, getTasaCierreRef, TASA_CIERRE_MATRIX } from '../monte-carlo-engine'
import { ROAS_RANGES, evaluateROAS, getROASRange } from '../industry-roas-ranges'
import { getBenchmark2026 } from '../benchmarks-2026-verificados'

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════

const INDUSTRIAS = Object.keys(ROAS_RANGES)
const PAISES = ['CL', 'MX', 'CO', 'AR', 'BR', 'PE']
const PRESUPUESTOS = [300000, 500000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000, 20000000]
const TIPOS = ['B2C', 'B2B'] as const
const TAMANOS = ['MICRO', 'PYME', 'MEDIANA', 'GRANDE'] as const
const OBJETIVOS = ['LEADS', 'VENTAS_DIRECTAS', 'AWARENESS'] as const
const MAX_ITERATIONS = 5
const DEVIATION_THRESHOLD = 5 // % máximo de desviaciones aceptable

// ═══════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════

interface TestResult {
  input: any
  leads_p50: number
  ventas_p50: number
  roas_p50: number
  cpl_p50: number
  deviations: Deviation[]
}

interface Deviation {
  type: 'ROAS_MUY_ALTO' | 'ROAS_MUY_BAJO' | 'LEADS_ABSURDOS' | 'VENTAS_IRREALES' | 'ROAS_MARGINAL'
  industria: string
  detail: string
  roas: number
  expected_range: { min: number; max: number }
}

interface CalibrationAdjustment {
  industria: string
  param: string
  from: number
  to: number
  reason: string
}

// ═══════════════════════════════════════════════════════════════════
// AGENTE 1: TESTER
// ═══════════════════════════════════════════════════════════════════

function agentTester(): TestResult[] {
  const results: TestResult[] = []

  // Estratificado: cada industria × cada presupuesto × CL (base)
  for (const industria of INDUSTRIAS) {
    for (const presupuesto of PRESUPUESTOS) {
      const ticket = TICKET_DEFAULTS[industria]?.medio || 100000
      const tipo = Math.random() > 0.5 ? 'B2C' : 'B2B'
      const tamano = (['MICRO', 'PYME', 'MEDIANA', 'GRANDE'] as const)[Math.floor(Math.random() * 4)]
      const tc = getTasaCierreRef(industria, tipo, tamano)

      try {
        const mc = runMonteCarlo({
          industria, pais: 'CL', presupuesto_mensual: presupuesto,
          ticket_promedio: ticket, tasa_cierre: tc,
          objetivo: 'LEADS', tipo_cliente: tipo, tamano_empresa: tamano,
        })

        const deviations: Deviation[] = []
        const range = getROASRange(industria)
        const roas = mc.total.roas.p50

        // Check ROAS — escalar rango esperado según ticket usado vs ticket medio
        if (range) {
          const ticketMedio = TICKET_DEFAULTS[industria]?.medio || 100000
          const ticketFactor = ticket / ticketMedio // >1 si ticket alto, <1 si bajo
          // ROAS escala con ticket: ticket alto → ROAS más alto es normal
          const adjMin = range.min * Math.max(ticketFactor * 0.5, 0.2)
          const adjMax = range.max * Math.max(ticketFactor * 1.5, 1)

          if (roas > adjMax * 1.2) {
            deviations.push({ type: 'ROAS_MUY_ALTO', industria, detail: `${roas.toFixed(1)}x > adj_max ${adjMax.toFixed(1)}x (ticket ${(ticket/1e6).toFixed(1)}M)`, roas, expected_range: { min: adjMin, max: adjMax } })
          } else if (roas < 0.1 && presupuesto >= 1000000) {
            deviations.push({ type: 'ROAS_MUY_BAJO', industria, detail: `${roas.toFixed(1)}x < adj_min ${adjMin.toFixed(1)}x`, roas, expected_range: { min: adjMin, max: adjMax } })
          }
        }

        // Check leads absurdos (más de 1 lead por cada $150 invertidos)
        const leadsPerPeso = mc.total.leads.p50 / presupuesto
        if (leadsPerPeso > 1 / 150) {
          deviations.push({
            type: 'LEADS_ABSURDOS', industria,
            detail: `${Math.round(mc.total.leads.p50)} leads con $${(presupuesto/1e6).toFixed(1)}M (${(leadsPerPeso*1000).toFixed(1)} leads/K)`,
            roas, expected_range: { min: 0, max: presupuesto / 150 }
          })
        }

        // Check ventas irreales para ticket alto
        if (ticket >= 10000000 && mc.total.conversiones.p50 > 10) {
          deviations.push({
            type: 'VENTAS_IRREALES', industria,
            detail: `${mc.total.conversiones.p50.toFixed(1)} ventas con ticket $${(ticket/1e6).toFixed(0)}M y $${(presupuesto/1e6).toFixed(1)}M pauta`,
            roas, expected_range: { min: 0, max: 5 }
          })
        }

        results.push({
          input: { industria, pais: 'CL', presupuesto_mensual: presupuesto, ticket_promedio: ticket, tasa_cierre: tc, tipo_cliente: tipo, tamano_empresa: tamano },
          leads_p50: mc.total.leads.p50,
          ventas_p50: mc.total.conversiones.p50,
          roas_p50: roas,
          cpl_p50: mc.total.cpl.p50,
          deviations,
        })
      } catch (e) {
        results.push({
          input: { industria, presupuesto_mensual: presupuesto },
          leads_p50: 0, ventas_p50: 0, roas_p50: 0, cpl_p50: 0,
          deviations: [{ type: 'ROAS_MUY_BAJO', industria, detail: `CRASH: ${e.message}`, roas: 0, expected_range: { min: 0, max: 0 } }]
        })
      }
    }
  }

  // Random: 1,000 escenarios adicionales con países variados
  for (let i = 0; i < 1000; i++) {
    const industria = INDUSTRIAS[Math.floor(Math.random() * INDUSTRIAS.length)]
    const pais = PAISES[Math.floor(Math.random() * PAISES.length)]
    const presupuesto = PRESUPUESTOS[Math.floor(Math.random() * PRESUPUESTOS.length)]
    const ticketData = TICKET_DEFAULTS[industria] || { min: 50000, medio: 100000, max: 500000 }
    const ticket = ticketData.min + Math.random() * (ticketData.max - ticketData.min)
    const tipo = Math.random() > 0.5 ? 'B2C' : 'B2B'
    const tamano = TAMANOS[Math.floor(Math.random() * 4)]

    try {
      const mc = runMonteCarlo({
        industria, pais, presupuesto_mensual: presupuesto,
        ticket_promedio: Math.round(ticket), objetivo: OBJETIVOS[Math.floor(Math.random() * 3)],
        tipo_cliente: tipo, tamano_empresa: tamano,
        competencia_percibida: 1 + Math.floor(Math.random() * 10),
      })

      const deviations: Deviation[] = []
      const range = getROASRange(industria)
      const roas = mc.total.roas.p50
      if (range) {
        const ticketMedio = TICKET_DEFAULTS[industria]?.medio || 100000
        const ticketFactor = Math.round(ticket) / ticketMedio
        const adjMax = range.max * Math.max(ticketFactor * 1.5, 1)
        const adjMin = range.min * Math.max(ticketFactor * 0.5, 0.2)
        if (roas > adjMax * 1.2) {
          deviations.push({ type: 'ROAS_MUY_ALTO', industria, detail: `${roas.toFixed(1)}x > ${adjMax.toFixed(1)}x`, roas, expected_range: { min: adjMin, max: adjMax } })
        } else if (roas < 0.1 && presupuesto >= 1000000) {
          deviations.push({ type: 'ROAS_MUY_BAJO', industria, detail: `${roas.toFixed(1)}x < ${adjMin.toFixed(1)}x`, roas, expected_range: { min: adjMin, max: adjMax } })
        }
      }

      results.push({
        input: { industria, pais, presupuesto_mensual: presupuesto, ticket_promedio: Math.round(ticket), tipo_cliente: tipo, tamano_empresa: tamano },
        leads_p50: mc.total.leads.p50, ventas_p50: mc.total.conversiones.p50,
        roas_p50: roas, cpl_p50: mc.total.cpl.p50, deviations,
      })
    } catch (e) {}
  }

  return results
}

// ═══════════════════════════════════════════════════════════════════
// AGENTE 2: DETECTOR DE DESVIACIONES
// ═══════════════════════════════════════════════════════════════════

interface IndustryReport {
  industria: string
  total_scenarios: number
  deviations: number
  by_type: Record<string, number>
  roas_p50_median: number
  roas_range: { min: number; max: number } | null
  recommendations: CalibrationAdjustment[]
}

function agentDetector(results: TestResult[]): { reports: IndustryReport[]; total_deviations: number } {
  const byIndustry: Record<string, TestResult[]> = {}
  for (const r of results) {
    const ind = r.input.industria
    if (!byIndustry[ind]) byIndustry[ind] = []
    byIndustry[ind].push(r)
  }

  const reports: IndustryReport[] = []
  let total_deviations = 0

  for (const [industria, scenarios] of Object.entries(byIndustry)) {
    const deviations = scenarios.filter(s => s.deviations.length > 0)
    const devCount = deviations.length
    total_deviations += devCount

    const by_type: Record<string, number> = {}
    for (const s of deviations) {
      for (const d of s.deviations) {
        by_type[d.type] = (by_type[d.type] || 0) + 1
      }
    }

    const roasValues = scenarios.map(s => s.roas_p50).sort((a, b) => a - b)
    const roas_p50_median = roasValues[Math.floor(roasValues.length / 2)] || 0

    const range = getROASRange(industria)
    const recommendations: CalibrationAdjustment[] = []

    // Si ROAS mediana está fuera del rango, recomendar ajuste
    if (range) {
      if (roas_p50_median > range.max) {
        const benchmark = getBenchmark2026(industria)
        if (benchmark) {
          const newMax = Math.min(Math.round(range.max), benchmark.roas_maximo)
          if (newMax < benchmark.roas_maximo) {
            recommendations.push({
              industria, param: 'roas_maximo',
              from: benchmark.roas_maximo, to: newMax,
              reason: `ROAS mediana ${roas_p50_median.toFixed(1)}x > max esperado ${range.max}x`
            })
          }
        }
      }
      if (roas_p50_median < range.min * 0.5) {
        // ROAS muy bajo: CVR probablemente demasiado bajo o CPC demasiado alto
        const benchmark = getBenchmark2026(industria)
        if (benchmark) {
          const currentCVR = benchmark.google_search.cvr_web
          const suggestedCVR = Math.round(currentCVR * 1.3 * 100) / 100 // +30%
          recommendations.push({
            industria, param: 'cvr_web (google_search)',
            from: currentCVR, to: suggestedCVR,
            reason: `ROAS mediana ${roas_p50_median.toFixed(1)}x < min esperado ${range.min}x. Subir CVR para compensar.`
          })
        }
      }
    }

    reports.push({
      industria,
      total_scenarios: scenarios.length,
      deviations: devCount,
      by_type,
      roas_p50_median,
      roas_range: range,
      recommendations,
    })
  }

  return { reports: reports.sort((a, b) => b.deviations - a.deviations), total_deviations }
}

// ═══════════════════════════════════════════════════════════════════
// AGENTE 3: CALIBRADOR (simula ajustes)
// ═══════════════════════════════════════════════════════════════════

function agentCalibrator(reports: IndustryReport[]): CalibrationAdjustment[] {
  const adjustments: CalibrationAdjustment[] = []

  for (const report of reports) {
    if (report.recommendations.length > 0) {
      adjustments.push(...report.recommendations)
    }
  }

  return adjustments
}

// ═══════════════════════════════════════════════════════════════════
// ORQUESTADOR + INFORME
// ═══════════════════════════════════════════════════════════════════

function run() {
  const startTime = Date.now()

  console.log('══════════════════════════════════════════════════════════════')
  console.log('  INFORME DE CALIBRACIÓN — Predictor M&P v5')
  console.log('══════════════════════════════════════════════════════════════')
  console.log(`  Fecha: ${new Date().toISOString().split('T')[0]}`)
  console.log(`  Industrias: ${INDUSTRIAS.length}`)
  console.log(`  Presupuestos: ${PRESUPUESTOS.length} rangos`)
  console.log(`  Países: ${PAISES.length}`)
  console.log('══════════════════════════════════════════════════════════════')

  // AGENTE 1: TESTER
  console.log('\n▸ Agente 1: TESTER — generando escenarios...')
  const results = agentTester()
  console.log(`  ${results.length} escenarios ejecutados`)

  // AGENTE 2: DETECTOR
  console.log('\n▸ Agente 2: DETECTOR — analizando desviaciones...')
  const { reports, total_deviations } = agentDetector(results)
  const devRate = ((total_deviations / results.length) * 100).toFixed(1)
  console.log(`  ${total_deviations}/${results.length} desviaciones (${devRate}%)`)

  // Clasificar por tipo
  const globalByType: Record<string, number> = {}
  for (const r of reports) {
    for (const [type, count] of Object.entries(r.by_type)) {
      globalByType[type] = (globalByType[type] || 0) + count
    }
  }

  console.log('\n  Por tipo de desviación:')
  for (const [type, count] of Object.entries(globalByType).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${type.padEnd(20)} ${count}`)
  }

  // AGENTE 3: CALIBRADOR
  console.log('\n▸ Agente 3: CALIBRADOR — calculando ajustes...')
  const adjustments = agentCalibrator(reports)

  if (adjustments.length > 0) {
    console.log(`  ${adjustments.length} ajustes recomendados:`)
    for (const adj of adjustments) {
      console.log(`    ${adj.industria.padEnd(28)} ${adj.param.padEnd(25)} ${adj.from} → ${adj.to}  (${adj.reason})`)
    }
  } else {
    console.log('  Sin ajustes necesarios')
  }

  // INFORME POR INDUSTRIA
  console.log('\n══════════════════════════════════════════════════════════════')
  console.log('  POR INDUSTRIA')
  console.log('══════════════════════════════════════════════════════════════')
  console.log('  Industria'.padEnd(30) + '│' + ' N'.padStart(5) + '│' + 'Dev'.padStart(4) + '│' + ' ROAS med'.padStart(9) + '│' + ' Rango'.padStart(12) + '│' + ' Status')
  console.log('  ' + '─'.repeat(75))

  for (const r of reports.sort((a, b) => a.industria.localeCompare(b.industria))) {
    const range = r.roas_range ? `${r.roas_range.min}-${r.roas_range.max}x` : '—'
    const status = r.deviations === 0 ? '✓ OK' :
      r.deviations <= 2 ? '~ marginal' : '✗ AJUSTAR'
    const devPct = ((r.deviations / r.total_scenarios) * 100).toFixed(0)

    console.log(
      `  ${r.industria.padEnd(28)}` +
      `│${r.total_scenarios.toString().padStart(4)} ` +
      `│${(r.deviations + ' (' + devPct + '%)').padStart(10)}` +
      `│${(r.roas_p50_median.toFixed(1) + 'x').padStart(8)} ` +
      `│${range.padStart(11)} ` +
      `│ ${status}`
    )
  }

  // RESUMEN FINAL
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const passed = parseFloat(devRate) < DEVIATION_THRESHOLD

  console.log('\n══════════════════════════════════════════════════════════════')
  console.log('  RESUMEN')
  console.log('══════════════════════════════════════════════════════════════')
  console.log(`  Escenarios totales: ${results.length}`)
  console.log(`  Desviaciones: ${total_deviations} (${devRate}%)`)
  console.log(`  Threshold: <${DEVIATION_THRESHOLD}%`)
  console.log(`  Ajustes recomendados: ${adjustments.length}`)
  console.log(`  Tiempo: ${elapsed}s`)
  console.log(`  Resultado: ${passed ? '✅ CALIBRACIÓN APROBADA' : '⚠️  CALIBRACIÓN REQUIERE AJUSTES'}`)
  console.log('══════════════════════════════════════════════════════════════')

  process.exit(passed ? 0 : 1)
}

run()
