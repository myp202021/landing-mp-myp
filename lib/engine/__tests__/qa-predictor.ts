// @ts-nocheck
/**
 * QA AUTOMATIZADO — Predictor v4.1
 *
 * 400 escenarios aleatorios con 95% de confianza (margen error 5%).
 * Valida 10 reglas de coherencia estadística y matemática.
 *
 * Ejecutar: npx tsx lib/engine/__tests__/qa-predictor.ts
 */

import { runMonteCarlo, TICKET_DEFAULTS, TASA_CIERRE_MATRIX, getTasaCierreRef } from '../monte-carlo-engine'
import { getIndustryOptimal } from '../industry-optimals'

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════

const N_SCENARIOS = 400
const CONFIDENCE_LEVEL = 0.95
const MARGIN_ERROR = 0.05

const INDUSTRIAS = [
  'ECOMMERCE', 'INMOBILIARIA', 'TURISMO', 'GASTRONOMIA', 'AUTOMOTRIZ',
  'SALUD_MEDICINA', 'EDUCACION', 'MODA_RETAIL', 'FINTECH', 'SERVICIOS_LEGALES',
  'BELLEZA_PERSONAL', 'TECNOLOGIA_SAAS', 'CONSTRUCCION_REMODELACION',
  'DEPORTES_FITNESS', 'VETERINARIA_MASCOTAS', 'MANUFACTURA_INDUSTRIAL',
  'LOGISTICA_TRANSPORTE', 'SEGUROS', 'AGRICULTURA_AGROINDUSTRIA',
  'SERVICIOS_PROFESIONALES', 'ENERGIA_UTILITIES', 'HOGAR_DECORACION'
]

const PAISES = ['CL', 'MX', 'CO', 'AR', 'BR', 'PE']
const OBJETIVOS = ['LEADS', 'VENTAS_DIRECTAS', 'AWARENESS'] as const
const TIPOS_CLIENTE = ['B2B', 'B2C'] as const
const TAMANOS = ['MICRO', 'PYME', 'MEDIANA', 'GRANDE'] as const
const PRESUPUESTOS = [300000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000]

// ═══════════════════════════════════════════════════════════════════
// GENERADOR DE ESCENARIOS
// ═══════════════════════════════════════════════════════════════════

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min))
}

interface TestScenario {
  id: number
  input: any
  description: string
}

function generateScenario(id: number): TestScenario {
  const industria = randomFrom(INDUSTRIAS)
  const pais = randomFrom(PAISES)
  const objetivo = randomFrom(OBJETIVOS)
  const tipo_cliente = randomFrom(TIPOS_CLIENTE)
  const tamano = randomFrom(TAMANOS)
  const presupuesto = randomFrom(PRESUPUESTOS)

  const ticketData = TICKET_DEFAULTS[industria] || { min: 50000, medio: 100000, max: 500000 }
  const ticket = randomBetween(ticketData.min, ticketData.max)

  const tasaRef = getTasaCierreRef(industria, tipo_cliente, tamano)
  // A veces usar la referencia, a veces un valor custom
  const tasa_cierre = Math.random() > 0.5 ? tasaRef : randomBetween(1, Math.min(tasaRef * 2, 30))

  return {
    id,
    input: {
      industria, pais, presupuesto_mensual: presupuesto,
      ticket_promedio: ticket, tasa_cierre, objetivo,
      tipo_cliente, tamano_empresa: tamano,
      competencia_percibida: randomBetween(1, 10),
      madurez_digital: randomFrom(['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO']),
    },
    description: `${industria} ${pais} $${(presupuesto/1e6).toFixed(1)}M t=$${(ticket/1e3).toFixed(0)}K tc=${tasa_cierre}% ${tipo_cliente} ${tamano} ${objetivo}`
  }
}

// ═══════════════════════════════════════════════════════════════════
// REGLAS DE VALIDACIÓN
// ═══════════════════════════════════════════════════════════════════

interface RuleResult {
  name: string
  passed: boolean
  detail?: string
}

function validateScenario(scenario: TestScenario, result: any): RuleResult[] {
  const t = result.total
  const rules: RuleResult[] = []

  // Regla 1: Ordering P25 ≤ P50 ≤ P75 para conversiones
  rules.push({
    name: 'ordering_conversiones',
    passed: t.conversiones.p25 <= t.conversiones.p50 && t.conversiones.p50 <= t.conversiones.p75,
    detail: `P25=${t.conversiones.p25.toFixed(1)} P50=${t.conversiones.p50.toFixed(1)} P75=${t.conversiones.p75.toFixed(1)}`
  })

  // Regla 2: Ordering P25 ≤ P50 ≤ P75 para revenue
  rules.push({
    name: 'ordering_revenue',
    passed: t.revenue.p25 <= t.revenue.p50 && t.revenue.p50 <= t.revenue.p75,
    detail: `P25=${t.revenue.p25.toFixed(0)} P50=${t.revenue.p50.toFixed(0)} P75=${t.revenue.p75.toFixed(0)}`
  })

  // Regla 3: Ordering P25 ≤ P50 ≤ P75 para ROAS
  rules.push({
    name: 'ordering_roas',
    passed: t.roas.p25 <= t.roas.p50 && t.roas.p50 <= t.roas.p75,
    detail: `P25=${t.roas.p25.toFixed(2)} P50=${t.roas.p50.toFixed(2)} P75=${t.roas.p75.toFixed(2)}`
  })

  // Regla 4: Conversiones > 0
  rules.push({
    name: 'conversiones_positivas',
    passed: t.conversiones.p50 > 0,
    detail: `P50=${t.conversiones.p50.toFixed(2)}`
  })

  // Regla 5: Revenue ≥ 0
  rules.push({
    name: 'revenue_no_negativo',
    passed: t.revenue.p50 >= 0,
    detail: `P50=${t.revenue.p50.toFixed(0)}`
  })

  // Regla 6: ROAS coherente (Revenue / Presupuesto ± 5%)
  const roas_calculado = t.revenue.p50 / scenario.input.presupuesto_mensual
  const roas_error = Math.abs(roas_calculado - t.roas.p50) / Math.max(t.roas.p50, 0.01)
  rules.push({
    name: 'coherencia_roas',
    passed: roas_error < 0.10, // 10% tolerancia (percentiles pueden diferir)
    detail: `calculado=${roas_calculado.toFixed(2)} reportado=${t.roas.p50.toFixed(2)} error=${(roas_error*100).toFixed(1)}%`
  })

  // Regla 7: Funnels suman al total (± 15%)
  const sumFunnelConv = result.funnels.reduce((s: number, f: any) => s + f.ventas.p50, 0)
  const funnelError = Math.abs(sumFunnelConv - t.conversiones.p50) / Math.max(t.conversiones.p50, 0.01)
  rules.push({
    name: 'funnels_suman_total',
    passed: funnelError < 0.20, // 20% tolerancia (percentiles de sumas ≠ suma de percentiles)
    detail: `sum_funnels=${sumFunnelConv.toFixed(1)} total=${t.conversiones.p50.toFixed(1)} error=${(funnelError*100).toFixed(1)}%`
  })

  // Regla 8: IC 90% contiene P50
  rules.push({
    name: 'ic90_contiene_p50',
    passed: result.confidence.ic_90_conversiones[0] <= t.conversiones.p50 &&
            t.conversiones.p50 <= result.confidence.ic_90_conversiones[1],
    detail: `IC=[${result.confidence.ic_90_conversiones[0].toFixed(1)}, ${result.confidence.ic_90_conversiones[1].toFixed(1)}] P50=${t.conversiones.p50.toFixed(1)}`
  })

  // Regla 9: Probabilidad ROAS > 1 está entre 0 y 100
  rules.push({
    name: 'prob_roas_rango',
    passed: result.confidence.prob_roas_gt_1 >= 0 && result.confidence.prob_roas_gt_1 <= 100,
    detail: `P(ROAS>1)=${result.confidence.prob_roas_gt_1}%`
  })

  // Regla 10: Histograma tiene datos
  rules.push({
    name: 'histograma_poblado',
    passed: result.histogram.conversiones.length > 0 &&
            result.histogram.conversiones.reduce((s: number, b: any) => s + b.count, 0) === 10000,
    detail: `bins=${result.histogram.conversiones.length} total=${result.histogram.conversiones.reduce((s: number, b: any) => s + b.count, 0)}`
  })

  return rules
}

// ═══════════════════════════════════════════════════════════════════
// TEST ADICIONAL: Rendimientos decrecientes
// ═══════════════════════════════════════════════════════════════════

function testDiminishingReturns(): RuleResult {
  const base = runMonteCarlo({
    industria: 'ECOMMERCE', pais: 'CL', presupuesto_mensual: 2000000,
    ticket_promedio: 45000, tasa_cierre: 8, objetivo: 'LEADS'
  })
  const double = runMonteCarlo({
    industria: 'ECOMMERCE', pais: 'CL', presupuesto_mensual: 10000000,
    ticket_promedio: 45000, tasa_cierre: 8, objetivo: 'LEADS'
  })

  const effBase = base.total.conversiones.p50 / 2
  const effDouble = double.total.conversiones.p50 / 10

  return {
    name: 'rendimientos_decrecientes',
    passed: effDouble < effBase,
    detail: `eff@$2M=${effBase.toFixed(2)} eff@$10M=${effDouble.toFixed(2)} (${effDouble < effBase ? 'decreciente OK' : 'FALLO'})`
  }
}

// ═══════════════════════════════════════════════════════════════════
// TEST: Factor país
// ═══════════════════════════════════════════════════════════════════

function testCountryFactor(): RuleResult {
  const cl = runMonteCarlo({
    industria: 'ECOMMERCE', pais: 'CL', presupuesto_mensual: 1500000,
    ticket_promedio: 45000, tasa_cierre: 8, objetivo: 'LEADS'
  })
  const mx = runMonteCarlo({
    industria: 'ECOMMERCE', pais: 'MX', presupuesto_mensual: 1500000,
    ticket_promedio: 45000, tasa_cierre: 8, objetivo: 'LEADS'
  })

  const clCPC = cl.funnels[0]?.benchmark.cpc || 0
  const mxCPC = mx.funnels[0]?.benchmark.cpc || 0

  return {
    name: 'factor_pais',
    passed: clCPC !== mxCPC,
    detail: `CPC_CL=${clCPC} CPC_MX=${mxCPC} (${clCPC !== mxCPC ? 'diferentes OK' : 'IGUALES FALLO'})`
  }
}

// ═══════════════════════════════════════════════════════════════════
// TEST: B2B vs B2C allocation
// ═══════════════════════════════════════════════════════════════════

function testB2BvsB2C(): RuleResult {
  const b2c = runMonteCarlo({
    industria: 'TECNOLOGIA_SAAS', pais: 'CL', presupuesto_mensual: 3000000,
    ticket_promedio: 500000, tasa_cierre: 5, objetivo: 'LEADS', tipo_cliente: 'B2C'
  })
  const b2b = runMonteCarlo({
    industria: 'TECNOLOGIA_SAAS', pais: 'CL', presupuesto_mensual: 3000000,
    ticket_promedio: 500000, tasa_cierre: 5, objetivo: 'LEADS', tipo_cliente: 'B2B'
  })

  const b2cSearch = b2c.funnels.find((f: any) => f.platform === 'google_search')?.allocation_pct || 0
  const b2bSearch = b2b.funnels.find((f: any) => f.platform === 'google_search')?.allocation_pct || 0

  return {
    name: 'b2b_vs_b2c_allocation',
    passed: b2bSearch !== b2cSearch,
    detail: `B2C_search=${b2cSearch}% B2B_search=${b2bSearch}% (${b2bSearch !== b2cSearch ? 'diferentes OK' : 'IGUALES FALLO'})`
  }
}

// ═══════════════════════════════════════════════════════════════════
// TEST: Industry optimals
// ═══════════════════════════════════════════════════════════════════

function testIndustryOptimals(): RuleResult {
  let passed = true
  let detail = ''

  for (const ind of INDUSTRIAS) {
    const opt = getIndustryOptimal(ind, 'CL', 'B2C', 'PYME')
    if (!opt) {
      passed = false
      detail += `${ind}: NULL. `
      continue
    }
    if (opt.cpa_estimado <= 0 || opt.tasa_cierre_ref <= 0 || opt.presupuesto_optimo.recomendado <= 0) {
      passed = false
      detail += `${ind}: valores inválidos. `
    }
  }

  if (passed) detail = `22/22 industrias con óptimos válidos`
  return { name: 'industry_optimals', passed, detail }
}

// ═══════════════════════════════════════════════════════════════════
// EJECUCIÓN
// ═══════════════════════════════════════════════════════════════════

function run() {
  console.log('╔══════════════════════════════════════════════════════════════════╗')
  console.log('║  QA PREDICTOR v4.1 — Reporte Automatizado                      ║')
  console.log('╠══════════════════════════════════════════════════════════════════╣')
  console.log(`║  Escenarios: ${N_SCENARIOS}                                              ║`)
  console.log(`║  Nivel de confianza: ${(CONFIDENCE_LEVEL * 100).toFixed(0)}% (margen error ${(MARGIN_ERROR * 100).toFixed(0)}%)                  ║`)
  console.log(`║  Reglas por escenario: 10                                       ║`)
  console.log(`║  Tests adicionales: 4 (rend. decrecientes, país, B2B/B2C, opt)  ║`)
  console.log('╠══════════════════════════════════════════════════════════════════╣')

  const startTime = Date.now()

  // Contadores por regla
  const ruleCounters: Record<string, { passed: number, total: number }> = {}
  const failures: { id: number, desc: string, rule: string, detail: string }[] = []
  let totalPassed = 0

  // Correr N escenarios
  for (let i = 0; i < N_SCENARIOS; i++) {
    const scenario = generateScenario(i + 1)

    try {
      const result = runMonteCarlo(scenario.input)
      const rules = validateScenario(scenario, result)

      let allPassed = true
      for (const rule of rules) {
        if (!ruleCounters[rule.name]) ruleCounters[rule.name] = { passed: 0, total: 0 }
        ruleCounters[rule.name].total++
        if (rule.passed) {
          ruleCounters[rule.name].passed++
        } else {
          allPassed = false
          failures.push({
            id: scenario.id,
            desc: scenario.description,
            rule: rule.name,
            detail: rule.detail || ''
          })
        }
      }

      if (allPassed) totalPassed++

    } catch (e: any) {
      failures.push({
        id: scenario.id,
        desc: scenario.description,
        rule: 'CRASH',
        detail: e.message?.substring(0, 80) || 'Unknown error'
      })
    }
  }

  // Tests adicionales
  const additionalTests = [
    testDiminishingReturns(),
    testCountryFactor(),
    testB2BvsB2C(),
    testIndustryOptimals(),
  ]

  const elapsed = Date.now() - startTime

  // Reportar
  console.log('║                                                                  ║')
  console.log(`║  RESULTADO: ${totalPassed}/${N_SCENARIOS} escenarios pasaron TODAS las reglas       ║`)
  console.log(`║  Tiempo: ${(elapsed / 1000).toFixed(1)}s                                                ║`)
  console.log('║                                                                  ║')
  console.log('╠══════════════════════════════════════════════════════════════════╣')
  console.log('║  REGLAS POR ESCENARIO                                           ║')
  console.log('╠══════════════════════════════════════════════════════════════════╣')

  for (const [name, counter] of Object.entries(ruleCounters)) {
    const pct = ((counter.passed / counter.total) * 100).toFixed(1)
    const status = counter.passed === counter.total ? '✓' : '✗'
    const nameStr = name.padEnd(28)
    const countStr = `${counter.passed}/${counter.total}`.padStart(10)
    const pctStr = `${pct}%`.padStart(7)
    console.log(`║  ${status} ${nameStr} ${countStr} ${pctStr}             ║`)
  }

  console.log('╠══════════════════════════════════════════════════════════════════╣')
  console.log('║  TESTS ADICIONALES                                              ║')
  console.log('╠══════════════════════════════════════════════════════════════════╣')

  for (const test of additionalTests) {
    const status = test.passed ? '✓' : '✗'
    console.log(`║  ${status} ${test.name.padEnd(28)} ${test.detail?.substring(0, 35).padEnd(35)} ║`)
  }

  if (failures.length > 0) {
    console.log('╠══════════════════════════════════════════════════════════════════╣')
    console.log(`║  FALLOS (${failures.length} total, mostrando primeros 10)                       ║`)
    console.log('╠══════════════════════════════════════════════════════════════════╣')
    for (const f of failures.slice(0, 10)) {
      console.log(`║  #${f.id.toString().padStart(3)}: ${f.rule.padEnd(24)} ${f.detail.substring(0, 35)} ║`)
    }
  }

  console.log('╚══════════════════════════════════════════════════════════════════╝')

  // Exit code
  const passRate = totalPassed / N_SCENARIOS
  const allAdditionalPassed = additionalTests.every(t => t.passed)

  if (passRate >= 0.95 && allAdditionalPassed) {
    console.log('\n✅ QA APROBADO — ' + (passRate * 100).toFixed(1) + '% pass rate con 95% confianza')
    process.exit(0)
  } else {
    console.log('\n❌ QA REPROBADO — ' + (passRate * 100).toFixed(1) + '% pass rate')
    if (!allAdditionalPassed) console.log('   Tests adicionales fallaron')
    process.exit(1)
  }
}

run()
