/**
 * MOTOR DE DECISION DE INVERSION DIGITAL - M&P
 *
 * Este motor NO optimiza volumen ni ventas.
 * Optimiza COHERENCIA del sistema de negocio.
 *
 * Filosofia M&P:
 * - Marketing no crea negocios rentables, los escala
 * - El cuello de botella rara vez es el trafico
 * - Mas leads != mejor negocio
 * - La capacidad operativa es una restriccion real
 * - Todo crecimiento tiene costo y riesgo
 */

// ============================================
// INTERFACES
// ============================================

export interface InputSimulador {
  // Variables del cliente (obligatorias)
  presupuesto_mensual: number      // CLP
  ticket_promedio: number          // CLP
  margen_bruto: number             // % (0-100)
  conversion_sitio: number         // % (0-100) - CVR del sitio/landing
  tasa_cierre: number              // % (0-100) - Cierre comercial
  capacidad_operativa: number      // Unidades maximas que puede atender/mes
  nivel_competencia: 'bajo' | 'medio' | 'alto'
  industria: string

  // Modo Pro (opcionales)
  variacion_mensual?: number       // % variacion esperada
  tolerancia_riesgo?: 'conservador' | 'moderado' | 'agresivo'
}

export interface ResultadoSimulador {
  // Metricas principales
  ventas_estimadas: { min: number, max: number, probable: number }
  utilidad_estimada: { min: number, max: number, probable: number }
  cac_efectivo: number
  punto_quiebre: number            // Presupuesto minimo para breakeven
  uso_capacidad: number            // % de capacidad usada

  // Score M&P (0-100)
  score_decision: number
  categoria_score: 'EXCELENTE' | 'VIABLE' | 'RIESGOSO' | 'NO_RECOMENDADO'

  // Diagnosticos (la parte "incomoda")
  diagnosticos: Diagnostico[]
  alertas_criticas: string[]

  // Desglose del score
  desglose_score: {
    coherencia_economica: number      // 0-30 puntos
    riesgo_operativo: number          // 0-25 puntos
    robustez_escenario: number        // 0-25 puntos
    dependencia_supuestos: number     // 0-20 puntos
  }

  // Eventos de realidad (stress test)
  stress_test: StressTestResult[]

  // Supuestos declarados
  supuestos: string[]
  limitaciones: string[]
}

export interface Diagnostico {
  tipo: 'critico' | 'advertencia' | 'info'
  mensaje: string
  recomendacion?: string
}

export interface StressTestResult {
  evento: string
  descripcion: string
  impacto: 'QUIEBRA' | 'PERDIDA' | 'REDUCCION' | 'RESISTENTE'
  nuevo_resultado: number  // Nueva utilidad estimada
  probabilidad: string     // Alta/Media/Baja
}

// ============================================
// BENCHMARKS POR INDUSTRIA (CPC Chile 2025)
// ============================================

const BENCHMARKS_CPC: { [key: string]: { cpc_base: number, cvr_industria: number } } = {
  'tecnologia': { cpc_base: 850, cvr_industria: 2.8 },
  'salud': { cpc_base: 720, cvr_industria: 3.2 },
  'educacion': { cpc_base: 580, cvr_industria: 4.1 },
  'finanzas': { cpc_base: 1200, cvr_industria: 2.1 },
  'retail': { cpc_base: 450, cvr_industria: 3.5 },
  'servicios': { cpc_base: 680, cvr_industria: 2.9 },
  'inmobiliaria': { cpc_base: 950, cvr_industria: 1.8 },
  'automotriz': { cpc_base: 780, cvr_industria: 2.2 },
  'gastronomia': { cpc_base: 380, cvr_industria: 4.5 },
  'turismo': { cpc_base: 520, cvr_industria: 3.8 },
  'construccion': { cpc_base: 620, cvr_industria: 2.5 },
  'legal': { cpc_base: 1100, cvr_industria: 2.0 }
}

const FACTOR_COMPETENCIA = {
  'bajo': 0.8,
  'medio': 1.0,
  'alto': 1.4
}

// ============================================
// MOTOR PRINCIPAL
// ============================================

export function calcularDecisionInversion(input: InputSimulador): ResultadoSimulador {

  // 1. Obtener benchmarks
  const benchmark = BENCHMARKS_CPC[input.industria] || { cpc_base: 700, cvr_industria: 3.0 }
  const factor_comp = FACTOR_COMPETENCIA[input.nivel_competencia]

  // 2. Calcular metricas base
  const cpc_real = benchmark.cpc_base * factor_comp
  const clicks = input.presupuesto_mensual / cpc_real

  // Usar CVR del cliente si es mejor que industria, sino promediar
  const cvr_efectivo = Math.min(input.conversion_sitio, benchmark.cvr_industria * 1.5)
  const leads = clicks * (cvr_efectivo / 100)

  // Conversiones con tasa de cierre
  const conversiones_brutas = leads * (input.tasa_cierre / 100)

  // LIMITE CRITICO: Capacidad operativa
  const conversiones_realizables = Math.min(conversiones_brutas, input.capacidad_operativa)
  const uso_capacidad = (conversiones_brutas / input.capacidad_operativa) * 100

  // Revenue y utilidad
  const revenue = conversiones_realizables * input.ticket_promedio
  const ganancia_bruta = revenue * (input.margen_bruto / 100)
  const utilidad = ganancia_bruta - input.presupuesto_mensual

  // CAC efectivo
  const cac = conversiones_realizables > 0 ? input.presupuesto_mensual / conversiones_realizables : Infinity

  // Punto de quiebre
  const roas_breakeven = 100 / input.margen_bruto
  const punto_quiebre = calcularPuntoQuiebre(input, benchmark, factor_comp)

  // 3. Calcular rangos (variacion)
  const variacion = input.variacion_mensual || 15
  const factor_min = 1 - (variacion / 100)
  const factor_max = 1 + (variacion / 100)

  const ventas_estimadas = {
    min: Math.floor(conversiones_realizables * factor_min),
    max: Math.ceil(conversiones_realizables * factor_max),
    probable: Math.round(conversiones_realizables)
  }

  const utilidad_estimada = {
    min: Math.round(utilidad * factor_min),
    max: Math.round(utilidad * factor_max),
    probable: Math.round(utilidad)
  }

  // 4. Calcular Score M&P
  const { score, desglose, categoria } = calcularScoreMYP(input, {
    conversiones_brutas,
    conversiones_realizables,
    uso_capacidad,
    utilidad,
    cac,
    roas_breakeven,
    revenue
  })

  // 5. Generar diagnosticos (la parte incomoda)
  const diagnosticos = generarDiagnosticos(input, {
    conversiones_brutas,
    conversiones_realizables,
    uso_capacidad,
    utilidad,
    cac,
    revenue
  })

  // 6. Alertas criticas
  const alertas_criticas = generarAlertasCriticas(input, {
    utilidad,
    uso_capacidad,
    cac,
    conversiones_realizables
  })

  // 7. Stress test (eventos de realidad)
  const stress_test = ejecutarStressTest(input, benchmark, factor_comp, {
    conversiones_realizables,
    revenue,
    utilidad
  })

  // 8. Supuestos y limitaciones
  const supuestos = [
    'Este modelo asume estabilidad de ticket. Si tu negocio es volatil, el riesgo real es mayor.',
    'Los benchmarks de CPC son promedios de mercado chileno 2025. Tu CPC real puede variar.',
    'La tasa de cierre ingresada se considera constante. En la realidad fluctua.',
    'No considera estacionalidad ni factores externos (economia, competencia nueva).',
    'Asume que la capacidad operativa es una restriccion real, no teorica.'
  ]

  const limitaciones = [
    'No puede predecir cambios en algoritmos de plataformas publicitarias.',
    'No considera el tiempo de aprendizaje de campanas (1-3 meses).',
    'No evalua calidad del producto/servicio ni satisfaccion del cliente.',
    'El score es una guia, no una garantia de resultados.'
  ]

  return {
    ventas_estimadas,
    utilidad_estimada,
    cac_efectivo: Math.round(cac),
    punto_quiebre: Math.round(punto_quiebre),
    uso_capacidad: Math.round(uso_capacidad),
    score_decision: score,
    categoria_score: categoria,
    diagnosticos,
    alertas_criticas,
    desglose_score: desglose,
    stress_test,
    supuestos,
    limitaciones
  }
}

// ============================================
// CALCULO DEL SCORE M&P
// ============================================

function calcularScoreMYP(
  input: InputSimulador,
  metricas: {
    conversiones_brutas: number
    conversiones_realizables: number
    uso_capacidad: number
    utilidad: number
    cac: number
    roas_breakeven: number
    revenue: number
  }
): { score: number, desglose: ResultadoSimulador['desglose_score'], categoria: ResultadoSimulador['categoria_score'] } {

  let coherencia_economica = 30  // Max 30 puntos
  let riesgo_operativo = 25      // Max 25 puntos
  let robustez_escenario = 25    // Max 25 puntos
  let dependencia_supuestos = 20 // Max 20 puntos

  // === COHERENCIA ECONOMICA (30 puntos) ===
  // Penalizar si CAC > margen por venta
  const margen_por_venta = input.ticket_promedio * (input.margen_bruto / 100)
  if (metricas.cac > margen_por_venta) {
    coherencia_economica -= 20  // Critico: CAC supera margen
  } else if (metricas.cac > margen_por_venta * 0.7) {
    coherencia_economica -= 10  // Advertencia: CAC muy alto
  }

  // Penalizar si utilidad es negativa
  if (metricas.utilidad < 0) {
    coherencia_economica -= 10
  }

  // Penalizar si ROAS < breakeven
  const roas_actual = metricas.revenue / input.presupuesto_mensual
  if (roas_actual < metricas.roas_breakeven) {
    coherencia_economica -= 5
  }

  // === RIESGO OPERATIVO (25 puntos) ===
  // Penalizar por exceso de capacidad
  if (metricas.uso_capacidad > 100) {
    riesgo_operativo -= 15  // Critico: Sobrecarga
  } else if (metricas.uso_capacidad > 85) {
    riesgo_operativo -= 8   // Alto riesgo de saturacion
  } else if (metricas.uso_capacidad > 70) {
    riesgo_operativo -= 4   // Cercano al limite
  }

  // Penalizar si hay desperdicio (leads no convertibles)
  const desperdicio = metricas.conversiones_brutas - metricas.conversiones_realizables
  if (desperdicio > metricas.conversiones_realizables * 0.3) {
    riesgo_operativo -= 10  // Mas del 30% de leads desperdiciados
  } else if (desperdicio > 0) {
    riesgo_operativo -= 5
  }

  // === ROBUSTEZ DEL ESCENARIO (25 puntos) ===
  // Penalizar por competencia alta
  if (input.nivel_competencia === 'alto') {
    robustez_escenario -= 10
  } else if (input.nivel_competencia === 'medio') {
    robustez_escenario -= 5
  }

  // Penalizar por margen bajo (menos margen de error)
  if (input.margen_bruto < 20) {
    robustez_escenario -= 10
  } else if (input.margen_bruto < 35) {
    robustez_escenario -= 5
  }

  // Penalizar por ticket bajo (vulnerable a CPC)
  if (input.ticket_promedio < 50000) {
    robustez_escenario -= 5
  }

  // === DEPENDENCIA DE SUPUESTOS (20 puntos) ===
  // Penalizar si conversion ingresada es muy alta vs industria
  const benchmark = BENCHMARKS_CPC[input.industria]
  if (benchmark && input.conversion_sitio > benchmark.cvr_industria * 2) {
    dependencia_supuestos -= 10  // Conversion irreal
  }

  // Penalizar si tasa de cierre es muy alta
  if (input.tasa_cierre > 30) {
    dependencia_supuestos -= 5
  }

  // Penalizar tolerancia agresiva
  if (input.tolerancia_riesgo === 'agresivo') {
    dependencia_supuestos -= 5
  }

  // Asegurar minimos
  coherencia_economica = Math.max(0, coherencia_economica)
  riesgo_operativo = Math.max(0, riesgo_operativo)
  robustez_escenario = Math.max(0, robustez_escenario)
  dependencia_supuestos = Math.max(0, dependencia_supuestos)

  const score = coherencia_economica + riesgo_operativo + robustez_escenario + dependencia_supuestos

  // Categoria
  let categoria: ResultadoSimulador['categoria_score']
  if (score >= 75) {
    categoria = 'EXCELENTE'
  } else if (score >= 55) {
    categoria = 'VIABLE'
  } else if (score >= 35) {
    categoria = 'RIESGOSO'
  } else {
    categoria = 'NO_RECOMENDADO'
  }

  return {
    score,
    desglose: {
      coherencia_economica,
      riesgo_operativo,
      robustez_escenario,
      dependencia_supuestos
    },
    categoria
  }
}

// ============================================
// DIAGNOSTICOS (LA PARTE INCOMODA)
// ============================================

function generarDiagnosticos(
  input: InputSimulador,
  metricas: {
    conversiones_brutas: number
    conversiones_realizables: number
    uso_capacidad: number
    utilidad: number
    cac: number
    revenue: number
  }
): Diagnostico[] {
  const diagnosticos: Diagnostico[] = []

  // Diagnostico 1: Problema de capacidad
  if (metricas.uso_capacidad > 100) {
    diagnosticos.push({
      tipo: 'critico',
      mensaje: 'Tu problema no es marketing, es capacidad.',
      recomendacion: `Estas generando ${Math.round(metricas.conversiones_brutas)} leads pero solo puedes atender ${input.capacidad_operativa}. Aumenta capacidad antes de invertir mas.`
    })
  }

  // Diagnostico 2: Financiando con perdida
  if (metricas.utilidad < 0) {
    diagnosticos.push({
      tipo: 'critico',
      mensaje: 'Este crecimiento se financia con perdida.',
      recomendacion: `Cada mes perderas $${Math.abs(metricas.utilidad).toLocaleString('es-CL')}. Revisa margen, ticket o presupuesto.`
    })
  }

  // Diagnostico 3: CAC insostenible
  const margen_por_venta = input.ticket_promedio * (input.margen_bruto / 100)
  if (metricas.cac > margen_por_venta) {
    diagnosticos.push({
      tipo: 'critico',
      mensaje: 'Tu CAC supera el margen por venta.',
      recomendacion: `Estas pagando $${Math.round(metricas.cac).toLocaleString('es-CL')} por cliente pero ganas $${Math.round(margen_por_venta).toLocaleString('es-CL')}. Modelo inviable.`
    })
  }

  // Diagnostico 4: Dependencia de cierre
  if (input.tasa_cierre < 5 && metricas.conversiones_realizables < 5) {
    diagnosticos.push({
      tipo: 'advertencia',
      mensaje: 'Este escenario solo funciona si mejoras cierre.',
      recomendacion: `Con ${input.tasa_cierre}% de cierre generas pocas ventas. Considera capacitacion comercial.`
    })
  }

  // Diagnostico 5: Margen muy bajo
  if (input.margen_bruto < 25) {
    diagnosticos.push({
      tipo: 'advertencia',
      mensaje: 'Margen bajo = poco margen de error.',
      recomendacion: `Con ${input.margen_bruto}% de margen, cualquier variacion en CPC te pone en rojo.`
    })
  }

  // Diagnostico 6: Competencia alta
  if (input.nivel_competencia === 'alto') {
    diagnosticos.push({
      tipo: 'advertencia',
      mensaje: 'Alta competencia infla tu CPC.',
      recomendacion: 'En mercados saturados el CPC puede subir 40%+ en temporadas altas.'
    })
  }

  // Diagnostico 7: Todo bien (raro)
  if (diagnosticos.length === 0) {
    diagnosticos.push({
      tipo: 'info',
      mensaje: 'Los numeros cierran. Eso no garantiza exito, pero tienes base.',
      recomendacion: 'Ejecuta con prudencia. Los primeros 3 meses son de aprendizaje.'
    })
  }

  return diagnosticos
}

// ============================================
// ALERTAS CRITICAS
// ============================================

function generarAlertasCriticas(
  input: InputSimulador,
  metricas: {
    utilidad: number
    uso_capacidad: number
    cac: number
    conversiones_realizables: number
  }
): string[] {
  const alertas: string[] = []

  if (metricas.utilidad < 0) {
    alertas.push('PERDIDA PROYECTADA: Este modelo genera perdidas.')
  }

  if (metricas.uso_capacidad > 100) {
    alertas.push('SOBRECARGA: Generaras mas leads de los que puedes atender.')
  }

  if (metricas.conversiones_realizables < 1) {
    alertas.push('SIN CONVERSIONES: Con estos parametros no alcanzas 1 venta/mes.')
  }

  const margen_por_venta = input.ticket_promedio * (input.margen_bruto / 100)
  if (metricas.cac > margen_por_venta * 2) {
    alertas.push('CAC CRITICO: Pagas mas del doble de lo que ganas por cliente.')
  }

  return alertas
}

// ============================================
// STRESS TEST (EVENTOS DE REALIDAD)
// ============================================

function ejecutarStressTest(
  input: InputSimulador,
  benchmark: { cpc_base: number, cvr_industria: number },
  factor_comp: number,
  metricas: {
    conversiones_realizables: number
    revenue: number
    utilidad: number
  }
): StressTestResult[] {
  const tests: StressTestResult[] = []

  // Evento 1: Subida de CPC (+30%)
  const cpc_inflado = benchmark.cpc_base * factor_comp * 1.3
  const clicks_reducidos = input.presupuesto_mensual / cpc_inflado
  const conversiones_cpc = clicks_reducidos * (input.conversion_sitio / 100) * (input.tasa_cierre / 100)
  const conversiones_real_cpc = Math.min(conversiones_cpc, input.capacidad_operativa)
  const revenue_cpc = conversiones_real_cpc * input.ticket_promedio
  const utilidad_cpc = (revenue_cpc * input.margen_bruto / 100) - input.presupuesto_mensual

  tests.push({
    evento: 'CPC +30%',
    descripcion: 'Subida de costos por mayor competencia o temporada alta',
    impacto: utilidad_cpc < 0 ? 'PERDIDA' : utilidad_cpc < metricas.utilidad * 0.5 ? 'REDUCCION' : 'RESISTENTE',
    nuevo_resultado: Math.round(utilidad_cpc),
    probabilidad: input.nivel_competencia === 'alto' ? 'Alta' : 'Media'
  })

  // Evento 2: Caida de conversion (-40%)
  const cvr_caido = input.conversion_sitio * 0.6
  const conversiones_cvr = (input.presupuesto_mensual / (benchmark.cpc_base * factor_comp)) * (cvr_caido / 100) * (input.tasa_cierre / 100)
  const conversiones_real_cvr = Math.min(conversiones_cvr, input.capacidad_operativa)
  const revenue_cvr = conversiones_real_cvr * input.ticket_promedio
  const utilidad_cvr = (revenue_cvr * input.margen_bruto / 100) - input.presupuesto_mensual

  tests.push({
    evento: 'Conversion -40%',
    descripcion: 'Caida de conversion por cambio de landing o audiencia',
    impacto: utilidad_cvr < 0 ? 'PERDIDA' : utilidad_cvr < metricas.utilidad * 0.5 ? 'REDUCCION' : 'RESISTENTE',
    nuevo_resultado: Math.round(utilidad_cvr),
    probabilidad: 'Media'
  })

  // Evento 3: Saturacion del equipo (capacidad -30%)
  const capacidad_reducida = input.capacidad_operativa * 0.7
  const conversiones_sat = Math.min(metricas.conversiones_realizables, capacidad_reducida)
  const revenue_sat = conversiones_sat * input.ticket_promedio
  const utilidad_sat = (revenue_sat * input.margen_bruto / 100) - input.presupuesto_mensual

  tests.push({
    evento: 'Capacidad -30%',
    descripcion: 'Enfermedad, renuncia o saturacion del equipo',
    impacto: utilidad_sat < 0 ? 'PERDIDA' : utilidad_sat < metricas.utilidad * 0.5 ? 'REDUCCION' : 'RESISTENTE',
    nuevo_resultado: Math.round(utilidad_sat),
    probabilidad: 'Baja'
  })

  // Evento 4: Combinado (CPC +20% y CVR -20%)
  const cpc_combo = benchmark.cpc_base * factor_comp * 1.2
  const cvr_combo = input.conversion_sitio * 0.8
  const conversiones_combo = (input.presupuesto_mensual / cpc_combo) * (cvr_combo / 100) * (input.tasa_cierre / 100)
  const conversiones_real_combo = Math.min(conversiones_combo, input.capacidad_operativa)
  const revenue_combo = conversiones_real_combo * input.ticket_promedio
  const utilidad_combo = (revenue_combo * input.margen_bruto / 100) - input.presupuesto_mensual

  tests.push({
    evento: 'Escenario Pesimista',
    descripcion: 'CPC +20% y Conversion -20% simultaneamente',
    impacto: utilidad_combo < -input.presupuesto_mensual * 0.5 ? 'QUIEBRA' : utilidad_combo < 0 ? 'PERDIDA' : 'REDUCCION',
    nuevo_resultado: Math.round(utilidad_combo),
    probabilidad: 'Baja'
  })

  return tests
}

// ============================================
// HELPERS
// ============================================

function calcularPuntoQuiebre(
  input: InputSimulador,
  benchmark: { cpc_base: number, cvr_industria: number },
  factor_comp: number
): number {
  // Punto de quiebre: presupuesto minimo para utilidad = 0
  // Utilidad = (Conv * Ticket * Margen) - Presupuesto = 0
  // Presupuesto = Conv * Ticket * Margen
  // Conv = (Presupuesto / CPC) * CVR * Cierre
  // Presupuesto = (Presupuesto / CPC) * CVR * Cierre * Ticket * Margen
  // Presupuesto * CPC = Presupuesto * CVR * Cierre * Ticket * Margen
  // CPC = CVR * Cierre * Ticket * Margen
  // Presupuesto_breakeven = buscar iterativamente

  const cpc = benchmark.cpc_base * factor_comp
  const cvr = input.conversion_sitio / 100
  const cierre = input.tasa_cierre / 100
  const ticket = input.ticket_promedio
  const margen = input.margen_bruto / 100

  // Formula simplificada: breakeven cuando ROAS = 1/margen
  // ROAS = (Conv * Ticket) / Presupuesto
  // Conv = (Presupuesto / CPC) * CVR * Cierre
  // ROAS = ((Presupuesto / CPC) * CVR * Cierre * Ticket) / Presupuesto
  // ROAS = (CVR * Cierre * Ticket) / CPC

  // Para breakeven: ROAS_min = 1/margen
  // Entonces el presupuesto minimo es aquel donde genera al menos 1 venta rentable

  const costo_por_venta = cpc / (cvr * cierre)  // CAC teorico
  const margen_por_venta = ticket * margen

  if (costo_por_venta > margen_por_venta) {
    // No hay punto de quiebre - modelo inviable
    return Infinity
  }

  // Presupuesto minimo para 1 venta
  return costo_por_venta
}
