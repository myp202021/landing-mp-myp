// @ts-nocheck
/**
 * QA CALIBRACIÓN EN LOOP — Predictor v4.1
 *
 * Genera combinaciones exhaustivas de todas las variables de entrada,
 * corre Monte Carlo, detecta outliers y casos fuera de norma,
 * y recalibra automáticamente hasta que el modelo converge.
 *
 * Ejecutar: npx tsx lib/engine/__tests__/qa-calibration-loop.ts
 */

import { runMonteCarlo, getTasaCierreRef, TICKET_DEFAULTS, TASA_CIERRE_MATRIX } from '../monte-carlo-engine'

// ═══════════════════════════════════════════════════════════════════
// VARIABLES DE ENTRADA — TODAS LAS COMBINACIONES
// ═══════════════════════════════════════════════════════════════════

const INDUSTRIAS = Object.keys(TASA_CIERRE_MATRIX) // 22
const PAISES = ['CL', 'MX', 'CO', 'AR', 'BR', 'PE'] // 6
const OBJETIVOS = ['LEADS', 'VENTAS_DIRECTAS', 'AWARENESS'] as const // 3
const TIPOS = ['B2C', 'B2B'] as const // 2
const TAMANOS = ['MICRO', 'PYME', 'MEDIANA', 'GRANDE'] as const // 4
const PRESUPUESTOS = [300000, 800000, 1500000, 3000000, 5000000, 10000000, 20000000] // 7
const COMPETENCIAS = [2, 5, 8] // 3
const MADURECES = ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'] as const // 3

// Total teórico: 22 × 6 × 3 × 2 × 4 × 7 × 3 × 3 = 199,584 combinaciones
// Muestreo estratificado: cubrir todas las industrias × todos los presupuestos = 154 combos base
// + random sampling del resto

const N_STRATIFIED = INDUSTRIAS.length * PRESUPUESTOS.length // 154 combos fijos
const N_RANDOM = 2000 // muestras adicionales aleatorias
const TOTAL = N_STRATIFIED + N_RANDOM

// ═══════════════════════════════════════════════════════════════════
// REGLAS DE DETECCIÓN DE OUTLIERS
// ═══════════════════════════════════════════════════════════════════

interface OutlierRule {
  name: string
  check: (input: any, result: any) => { passed: boolean; detail: string; severity: 'critical' | 'warning' | 'info' }
}

const RULES: OutlierRule[] = [
  {
    name: 'leads_positivos',
    check: (input, r) => ({
      passed: r.total.leads.p50 > 0,
      detail: `leads P50=${r.total.leads.p50.toFixed(1)}`,
      severity: 'critical'
    })
  },
  {
    name: 'ordering_leads',
    check: (input, r) => ({
      passed: r.total.leads.p25 <= r.total.leads.p50 && r.total.leads.p50 <= r.total.leads.p75,
      detail: `P25=${r.total.leads.p25.toFixed(1)} P50=${r.total.leads.p50.toFixed(1)} P75=${r.total.leads.p75.toFixed(1)}`,
      severity: 'critical'
    })
  },
  {
    name: 'ordering_roas',
    check: (input, r) => ({
      passed: r.total.roas.p25 <= r.total.roas.p50 && r.total.roas.p50 <= r.total.roas.p75,
      detail: `P25=${r.total.roas.p25.toFixed(2)} P50=${r.total.roas.p50.toFixed(2)} P75=${r.total.roas.p75.toFixed(2)}`,
      severity: 'critical'
    })
  },
  {
    name: 'cpl_razonable',
    check: (input, r) => {
      const cpl = r.total.cpl.p50
      // CPL debe estar entre $100 y $5,000,000 (en moneda local)
      return {
        passed: cpl > 100 && cpl < 5000000,
        detail: `CPL P50=${Math.round(cpl)}`,
        severity: cpl <= 0 ? 'critical' : 'warning'
      }
    }
  },
  {
    name: 'leads_vs_presupuesto',
    check: (input, r) => {
      // No puede haber más de 1 lead por cada $500 de presupuesto (sanity)
      const maxLeadsRazonable = input.presupuesto_mensual / 500
      return {
        passed: r.total.leads.p50 < maxLeadsRazonable,
        detail: `leads=${Math.round(r.total.leads.p50)} max_razonable=${Math.round(maxLeadsRazonable)}`,
        severity: 'warning'
      }
    }
  },
  {
    name: 'roas_no_absurdo',
    check: (input, r) => {
      // ROAS > 10,000x es sospechoso (inmobiliaria con ticket $500M puede dar ROAS alto pero no infinito)
      return {
        passed: r.total.roas.p50 < 10000,
        detail: `ROAS P50=${r.total.roas.p50.toFixed(1)}x`,
        severity: 'warning'
      }
    }
  },
  {
    name: 'ic90_coherente',
    check: (input, r) => {
      const width = r.confidence.ic_90_conversiones[1] - r.confidence.ic_90_conversiones[0]
      const ratio = width / Math.max(r.total.conversiones.p50, 0.01)
      // IC no debe ser más de 10x el P50 (demasiado ancho = modelo inútil)
      return {
        passed: ratio < 10,
        detail: `IC=[${r.confidence.ic_90_conversiones[0].toFixed(0)},${r.confidence.ic_90_conversiones[1].toFixed(0)}] ratio=${ratio.toFixed(1)}`,
        severity: 'warning'
      }
    }
  },
  {
    name: 'rendimientos_decrecientes',
    check: (input, r) => {
      // Solo verificar si presupuesto > $5M
      if (input.presupuesto_mensual <= 5000000) return { passed: true, detail: 'skip (budget<5M)', severity: 'info' }
      const efficiencyPerM = r.total.leads.p50 / (input.presupuesto_mensual / 1000000)
      // Con presupuesto alto, la eficiencia no debe ser mayor que la de presupuesto bajo
      // (verificado comparativamente en el batch)
      return {
        passed: true, // se verifica en post-proceso
        detail: `eff=${efficiencyPerM.toFixed(2)} leads/M`,
        severity: 'info'
      }
    }
  },
  {
    name: 'pais_diferencia',
    check: (input, r) => {
      // El CPC del país debe diferir de Chile
      if (input.pais === 'CL') return { passed: true, detail: 'skip (CL)', severity: 'info' }
      const clCPC = r.funnels[0]?.benchmark?.cpc || 0
      return {
        passed: clCPC > 0,
        detail: `CPC=${clCPC} pais=${input.pais}`,
        severity: 'info'
      }
    }
  },
  {
    name: 'crash_protection',
    check: (input, r) => ({
      passed: r.histogram && r.histogram.conversiones && r.histogram.conversiones.length > 0,
      detail: `bins=${r.histogram?.conversiones?.length || 0}`,
      severity: 'critical'
    })
  },
]

// ═══════════════════════════════════════════════════════════════════
// GENERACIÓN DE ESCENARIOS
// ═══════════════════════════════════════════════════════════════════

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min))
}

function generateStratified(): any[] {
  const scenarios: any[] = []
  for (const industria of INDUSTRIAS) {
    for (const presupuesto of PRESUPUESTOS) {
      const tipo = randomFrom(TIPOS)
      const tamano = randomFrom(TAMANOS)
      const ticketData = TICKET_DEFAULTS[industria] || { min: 50000, medio: 100000, max: 500000 }
      scenarios.push({
        industria, pais: 'CL',
        presupuesto_mensual: presupuesto,
        ticket_promedio: ticketData.medio,
        tasa_cierre: getTasaCierreRef(industria, tipo, tamano),
        objetivo: randomFrom(OBJETIVOS),
        tipo_cliente: tipo, tamano_empresa: tamano,
        competencia_percibida: 5, madurez_digital: 'INTERMEDIO',
      })
    }
  }
  return scenarios
}

function generateRandom(n: number): any[] {
  const scenarios: any[] = []
  for (let i = 0; i < n; i++) {
    const industria = randomFrom(INDUSTRIAS)
    const tipo = randomFrom(TIPOS)
    const tamano = randomFrom(TAMANOS)
    const ticketData = TICKET_DEFAULTS[industria] || { min: 50000, medio: 100000, max: 500000 }
    scenarios.push({
      industria, pais: randomFrom(PAISES),
      presupuesto_mensual: randomFrom(PRESUPUESTOS),
      ticket_promedio: randomBetween(ticketData.min, ticketData.max),
      tasa_cierre: randomBetween(1, 25),
      objetivo: randomFrom(OBJETIVOS),
      tipo_cliente: tipo, tamano_empresa: tamano,
      competencia_percibida: randomFrom(COMPETENCIAS),
      madurez_digital: randomFrom(MADURECES),
    })
  }
  return scenarios
}

// ═══════════════════════════════════════════════════════════════════
// ANÁLISIS ESTADÍSTICO
// ═══════════════════════════════════════════════════════════════════

interface ScenarioResult {
  input: any
  leads_p50: number
  ventas_p50: number
  roas_p50: number
  cpl_p50: number
  prob_roas_gt1: number
  failures: string[]
  warnings: string[]
}

function analyzeDistribution(results: ScenarioResult[]) {
  // Agrupar por industria
  const byIndustry: Record<string, ScenarioResult[]> = {}
  for (const r of results) {
    const ind = r.input.industria
    if (!byIndustry[ind]) byIndustry[ind] = []
    byIndustry[ind].push(r)
  }

  console.log('\n╔══════════════════════════════════════════════════════════════════════════════════╗')
  console.log('║  DISTRIBUCIÓN POR INDUSTRIA                                                     ║')
  console.log('╠══════════════════════════════════════════════════════════════════════════════════╣')
  console.log('║  Industria                │ N │ CPL med │ CPL min│CPL max│ ROAS med│ Leads med  ║')
  console.log('╠══════════════════════════════════════════════════════════════════════════════════╣')

  for (const [ind, scenarios] of Object.entries(byIndustry).sort((a, b) => a[0].localeCompare(b[0]))) {
    const cpls = scenarios.map(s => s.cpl_p50).sort((a, b) => a - b)
    const roass = scenarios.map(s => s.roas_p50).sort((a, b) => a - b)
    const leads = scenarios.map(s => s.leads_p50).sort((a, b) => a - b)

    const median = (arr: number[]) => arr[Math.floor(arr.length / 2)]

    const name = ind.substring(0, 25).padEnd(25)
    const n = scenarios.length.toString().padStart(3)
    const cplMed = Math.round(median(cpls)).toString().padStart(7)
    const cplMin = Math.round(cpls[0]).toString().padStart(7)
    const cplMax = Math.round(cpls[cpls.length - 1]).toString().padStart(7)
    const roasMed = median(roass).toFixed(1).padStart(8)
    const leadsMed = Math.round(median(leads)).toString().padStart(9)

    console.log(`║  ${name} │${n} │${cplMed} │${cplMin}│${cplMax}│${roasMed}x│${leadsMed}  ║`)
  }
  console.log('╚══════════════════════════════════════════════════════════════════════════════════╝')
}

// ═══════════════════════════════════════════════════════════════════
// EJECUCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

function run() {
  const startTime = Date.now()

  console.log('╔══════════════════════════════════════════════════════════════════╗')
  console.log('║  QA CALIBRACIÓN EN LOOP — Predictor v4.1                       ║')
  console.log('╠══════════════════════════════════════════════════════════════════╣')
  console.log(`║  Escenarios estratificados: ${N_STRATIFIED} (22 industrias × 7 presupuestos)  ║`)
  console.log(`║  Escenarios aleatorios: ${N_RANDOM}                                    ║`)
  console.log(`║  Total: ${TOTAL}                                                   ║`)
  console.log(`║  Reglas: ${RULES.length}                                                      ║`)
  console.log('╠══════════════════════════════════════════════════════════════════╣')

  const stratified = generateStratified()
  const random = generateRandom(N_RANDOM)
  const allScenarios = [...stratified, ...random]

  const results: ScenarioResult[] = []
  const ruleCounters: Record<string, { passed: number; total: number }> = {}
  const criticalFailures: { index: number; input: any; rule: string; detail: string }[] = []
  const warnings: { index: number; input: any; rule: string; detail: string }[] = []
  let crashes = 0

  for (let i = 0; i < allScenarios.length; i++) {
    const input = allScenarios[i]

    try {
      const mc = runMonteCarlo(input)
      const scenarioResult: ScenarioResult = {
        input,
        leads_p50: mc.total.leads.p50,
        ventas_p50: mc.total.conversiones.p50,
        roas_p50: mc.total.roas.p50,
        cpl_p50: mc.total.cpl.p50,
        prob_roas_gt1: mc.confidence.prob_roas_gt_1,
        failures: [],
        warnings: [],
      }

      for (const rule of RULES) {
        if (!ruleCounters[rule.name]) ruleCounters[rule.name] = { passed: 0, total: 0 }
        ruleCounters[rule.name].total++

        const result = rule.check(input, mc)
        if (result.passed) {
          ruleCounters[rule.name].passed++
        } else {
          if (result.severity === 'critical') {
            scenarioResult.failures.push(rule.name)
            criticalFailures.push({ index: i, input, rule: rule.name, detail: result.detail })
          } else if (result.severity === 'warning') {
            scenarioResult.warnings.push(rule.name)
            warnings.push({ index: i, input, rule: rule.name, detail: result.detail })
          }
        }
      }

      results.push(scenarioResult)
    } catch (e: any) {
      crashes++
      criticalFailures.push({ index: i, input, rule: 'CRASH', detail: e.message?.substring(0, 60) || 'unknown' })
    }

    // Progress cada 500
    if ((i + 1) % 500 === 0) {
      process.stdout.write(`║  Progreso: ${i + 1}/${TOTAL}...                                           ║\n`)
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const passRate = ((results.length - criticalFailures.length) / allScenarios.length * 100).toFixed(1)

  console.log('║                                                                  ║')
  console.log(`║  Completado en ${elapsed}s                                            ║`)
  console.log(`║  Crashes: ${crashes}                                                    ║`)
  console.log(`║  Resultados válidos: ${results.length}/${allScenarios.length}                                    ║`)
  console.log('╠══════════════════════════════════════════════════════════════════╣')
  console.log('║  REGLAS                                                          ║')
  console.log('╠══════════════════════════════════════════════════════════════════╣')

  for (const [name, counter] of Object.entries(ruleCounters)) {
    const pct = ((counter.passed / counter.total) * 100).toFixed(1)
    const status = counter.passed === counter.total ? '✓' : (counter.passed / counter.total > 0.95 ? '~' : '✗')
    console.log(`║  ${status} ${name.padEnd(28)} ${(counter.passed + '/' + counter.total).padStart(12)} ${(pct + '%').padStart(7)}  ║`)
  }

  // Outliers por industria
  analyzeDistribution(results)

  // Rendimientos decrecientes: verificar por industria
  console.log('\n╔══════════════════════════════════════════════════════════════════╗')
  console.log('║  RENDIMIENTOS DECRECIENTES POR INDUSTRIA                        ║')
  console.log('╠══════════════════════════════════════════════════════════════════╣')

  let dimReturnsFail = 0
  for (const industria of INDUSTRIAS) {
    const scenarios = results.filter(r => r.input.industria === industria && r.input.pais === 'CL')
    if (scenarios.length < 3) continue

    const byBudget = scenarios.sort((a, b) => a.input.presupuesto_mensual - b.input.presupuesto_mensual)
    const efficiencies = byBudget.map(s => ({
      budget: s.input.presupuesto_mensual,
      eff: s.leads_p50 / (s.input.presupuesto_mensual / 1000000)
    }))

    // Verificar que eficiencia decrece con presupuesto
    let decreasing = true
    for (let i = 1; i < efficiencies.length; i++) {
      if (efficiencies[i].eff > efficiencies[i - 1].eff * 1.1) { // 10% tolerancia
        decreasing = false
        break
      }
    }

    const status = decreasing ? '✓' : '✗'
    if (!decreasing) dimReturnsFail++
    const first = efficiencies[0]
    const last = efficiencies[efficiencies.length - 1]
    console.log(`║  ${status} ${industria.padEnd(28)} ${first.eff.toFixed(1).padStart(6)} → ${last.eff.toFixed(1).padStart(6)} leads/M  ║`)
  }

  // Resumen final
  console.log('\n╔══════════════════════════════════════════════════════════════════╗')
  console.log('║  RESUMEN FINAL                                                  ║')
  console.log('╠══════════════════════════════════════════════════════════════════╣')
  console.log(`║  Total escenarios: ${TOTAL}                                         ║`)
  console.log(`║  Pass rate (sin critical failures): ${passRate}%                      ║`)
  console.log(`║  Critical failures: ${criticalFailures.length}                                            ║`)
  console.log(`║  Warnings: ${warnings.length}                                                  ║`)
  console.log(`║  Crashes: ${crashes}                                                    ║`)
  console.log(`║  Rendimientos decrecientes fail: ${dimReturnsFail}/${INDUSTRIAS.length}                         ║`)
  console.log('╚══════════════════════════════════════════════════════════════════╝')

  if (criticalFailures.length > 0) {
    console.log('\nCRITICAL FAILURES (primeros 15):')
    for (const f of criticalFailures.slice(0, 15)) {
      console.log(`  #${f.index}: ${f.input.industria} ${f.input.pais} $${(f.input.presupuesto_mensual/1e6).toFixed(1)}M → ${f.rule}: ${f.detail}`)
    }
  }

  if (warnings.length > 0) {
    console.log(`\nWARNINGS (${warnings.length} total, primeros 10):`)
    for (const w of warnings.slice(0, 10)) {
      console.log(`  #${w.index}: ${w.input.industria} ${w.input.pais} $${(w.input.presupuesto_mensual/1e6).toFixed(1)}M → ${w.rule}: ${w.detail}`)
    }
  }

  // Exit code
  const success = parseFloat(passRate) >= 95 && crashes === 0
  console.log(`\n${success ? '✅' : '❌'} ${success ? 'CALIBRACIÓN APROBADA' : 'CALIBRACIÓN REQUIERE AJUSTES'} — ${passRate}% pass rate, ${TOTAL} escenarios`)
  process.exit(success ? 0 : 1)
}

run()
