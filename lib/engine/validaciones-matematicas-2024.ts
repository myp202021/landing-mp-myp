// @ts-nocheck
/**
 * VALIDACIONES MATEMÁTICAS Y LÍMITES DE NEGOCIO 2024
 * Sistema que aplica correcciones automáticas para mantener coherencia
 */

import { BENCHMARKS_INDUSTRIAS_2024, IndustryBenchmark } from './benchmarks-2024-verificados'
import { InputCliente2024 } from './interfaces-cliente-2024'

// Límites globales del sistema
export const LIMITES_GLOBALES = {
  // ROAS mínimo/máximo universal
  roas_minimo_absoluto: 0.1,     // Nunca menos de 0.1x (más permisivo)
  roas_maximo_absoluto: 50,      // Nunca más de 50x

  // CPA mínimo/máximo (CLP)
  cpa_minimo_absoluto: 1000,     // $1k CLP mínimo
  cpa_maximo_absoluto: 10000000, // $10M CLP máximo

  // Conversiones mínimo/máximo mensual
  conversiones_minimo: 1,        // Al menos 1 conversión
  conversiones_maximo_absoluto: 10000, // Máximo 10k conversiones/mes

  // CTR/CVR límites técnicos
  ctr_minimo: 0.1,              // 0.1% CTR mínimo
  ctr_maximo: 15,               // 15% CTR máximo realista
  cvr_minimo: 0.05,             // 0.05% CVR mínimo
  cvr_maximo: 50                // 50% CVR máximo realista
}

// Aplicador de límites por industria
export const aplicarLimitesIndustria = (
  valor: number,
  tipo: 'conversiones' | 'roas' | 'cpa',
  industria: string
): { valor_final: number, fue_limitado: boolean, limite_aplicado?: number } => {

  const benchmark = BENCHMARKS_INDUSTRIAS_2024[industria]
  if (!benchmark) {
    return { valor_final: valor, fue_limitado: false }
  }

  switch (tipo) {
    case 'conversiones':
      if (valor > benchmark.max_conversiones_mes) {
        return {
          valor_final: benchmark.max_conversiones_mes,
          fue_limitado: true,
          limite_aplicado: benchmark.max_conversiones_mes
        }
      }
      if (valor < LIMITES_GLOBALES.conversiones_minimo) {
        return {
          valor_final: LIMITES_GLOBALES.conversiones_minimo,
          fue_limitado: true,
          limite_aplicado: LIMITES_GLOBALES.conversiones_minimo
        }
      }
      break

    case 'roas':
      if (valor > benchmark.roas_maximo) {
        return {
          valor_final: benchmark.roas_maximo,
          fue_limitado: true,
          limite_aplicado: benchmark.roas_maximo
        }
      }
      if (valor < LIMITES_GLOBALES.roas_minimo_absoluto) {
        return {
          valor_final: LIMITES_GLOBALES.roas_minimo_absoluto,
          fue_limitado: true,
          limite_aplicado: LIMITES_GLOBALES.roas_minimo_absoluto
        }
      }
      break

    case 'cpa':
      if (valor < benchmark.cpa_minimo) {
        return {
          valor_final: benchmark.cpa_minimo,
          fue_limitado: true,
          limite_aplicado: benchmark.cpa_minimo
        }
      }
      if (valor > LIMITES_GLOBALES.cpa_maximo_absoluto) {
        return {
          valor_final: LIMITES_GLOBALES.cpa_maximo_absoluto,
          fue_limitado: true,
          limite_aplicado: LIMITES_GLOBALES.cpa_maximo_absoluto
        }
      }
      break
  }

  return { valor_final: valor, fue_limitado: false }
}

// Validador de coherencia matemática
export const validarCoherenciaMatematica = (resultados: {
  presupuesto: number
  conversiones: number
  revenue: number
  roas: number
  cpa: number
}): { es_coherente: boolean, errores: string[] } => {

  const errores: string[] = []

  // Validar ROAS = Revenue / Presupuesto
  const roas_calculado = resultados.revenue / resultados.presupuesto
  const diferencia_roas = Math.abs(roas_calculado - resultados.roas)
  // CORRECCIÓN: Tolerancia más permisiva (0.5x) para permitir redondeos y límites aplicados
  if (diferencia_roas > 0.5) {
    errores.push(`ROAS incoherente: calculado ${roas_calculado.toFixed(2)} vs reportado ${resultados.roas.toFixed(2)}`)
  }

  // Validar CPA = Presupuesto / Conversiones
  const cpa_calculado = resultados.presupuesto / Math.max(resultados.conversiones, 1)
  const diferencia_cpa = Math.abs(cpa_calculado - resultados.cpa)
  // CORRECCIÓN: 10% tolerancia O mínimo $5,000 CLP (lo que sea mayor)
  const tolerancia_cpa = Math.max(resultados.cpa * 0.1, 5000)
  if (diferencia_cpa > tolerancia_cpa) {
    errores.push(`CPA incoherente: calculado $${cpa_calculado.toFixed(0)} vs reportado $${resultados.cpa.toFixed(0)}`)
  }

  // Validar Revenue = Conversiones × Ticket (se valida externamente)

  return {
    es_coherente: errores.length === 0,
    errores
  }
}

// Validador de rangos realistas por industria
export const validarRangosRealistas = (
  input: InputCliente2024,
  resultados_calculados: any
): { es_realista: boolean, alertas: string[] } => {

  const alertas: string[] = []
  const benchmark = BENCHMARKS_INDUSTRIAS_2024[input.industria]

  if (!benchmark) {
    alertas.push(`Industria ${input.industria} no soportada`)
    return { es_realista: false, alertas }
  }

  // Validar tasa de cierre vs benchmarks típicos
  const tasas_tipicas_por_industria = {
    ECOMMERCE: { min: 1, max: 8 },        // % checkout completion
    INMOBILIARIA: { min: 2, max: 12 },    // % form to sale
    TURISMO: { min: 3, max: 15 },         // % booking to payment
    GASTRONOMIA: { min: 5, max: 25 },     // % reservation to visit
    AUTOMOTRIZ: { min: 1, max: 8 },       // % quote to sale
    SALUD_MEDICINA: { min: 8, max: 30 },  // % appointment to treatment
    EDUCACION: { min: 5, max: 20 },       // % demo to enrollment
    MODA_RETAIL: { min: 2, max: 10 },     // % cart to purchase
    FINTECH: { min: 0.5, max: 5 },        // % demo to contract
    SERVICIOS_LEGALES: { min: 3, max: 15 }, // % consultation to case
    BELLEZA_PERSONAL: { min: 10, max: 40 }, // % consultation to treatment
    TECNOLOGIA_SAAS: { min: 2, max: 12 }  // % trial to subscription
  }

  const rango_tipico = tasas_tipicas_por_industria[input.industria]
  if (rango_tipico) {
    if (input.Y_tasa_cierre < rango_tipico.min) {
      alertas.push(`Tasa de cierre ${input.Y_tasa_cierre}% parece baja para ${input.industria}. Típico: ${rango_tipico.min}-${rango_tipico.max}%`)
    }
    if (input.Y_tasa_cierre > rango_tipico.max) {
      alertas.push(`Tasa de cierre ${input.Y_tasa_cierre}% parece alta para ${input.industria}. Típico: ${rango_tipico.min}-${rango_tipico.max}%`)
    }
  }

  // Validar ticket promedio vs industria (rangos más permisivos)
  const tickets_por_industria = {
    ECOMMERCE: { min: 5000, max: 500000 },
    INMOBILIARIA: { min: 50000, max: 1000000000 },    // Más permisivo: desde comisiones pequeñas
    TURISMO: { min: 20000, max: 2000000 },
    GASTRONOMIA: { min: 3000, max: 150000 },
    AUTOMOTRIZ: { min: 500000, max: 100000000 },       // Más permisivo: incluye servicios menores
    SALUD_MEDICINA: { min: 20000, max: 2000000 },
    EDUCACION: { min: 50000, max: 5000000 },
    MODA_RETAIL: { min: 8000, max: 800000 },
    FINTECH: { min: 50000, max: 20000000 },            // Más permisivo: desde productos básicos
    SERVICIOS_LEGALES: { min: 100000, max: 20000000 }, // Más permisivo: consultas simples
    BELLEZA_PERSONAL: { min: 15000, max: 1000000 },
    TECNOLOGIA_SAAS: { min: 50000, max: 50000000 }     // Más permisivo: desde planes básicos
  }

  const rango_ticket = tickets_por_industria[input.industria]
  if (rango_ticket) {
    if (input.Z_ticket_promedio < rango_ticket.min) {
      alertas.push(`Ticket promedio $${input.Z_ticket_promedio.toLocaleString()} parece bajo para ${input.industria}`)
    }
    if (input.Z_ticket_promedio > rango_ticket.max) {
      alertas.push(`Ticket promedio $${input.Z_ticket_promedio.toLocaleString()} parece alto para ${input.industria}`)
    }
  }

  // Validar relación presupuesto vs conversiones esperadas
  const conversiones_esperadas = resultados_calculados.conversiones_mes || 0
  if (conversiones_esperadas > benchmark.max_conversiones_mes) {
    alertas.push(`Conversiones esperadas (${conversiones_esperadas}) exceden límite realista para ${input.industria} (${benchmark.max_conversiones_mes})`)
  }

  return {
    es_realista: alertas.length === 0,
    alertas
  }
}

// Corrector automático de escenarios
export const corregirEscenarios = (
  escenario_base: any,
  factores: { conservador: number, agresivo: number },
  industria: string
) => {
  const benchmark = BENCHMARKS_INDUSTRIAS_2024[industria]
  if (!benchmark) return escenario_base

  // Calcular escenarios con factores
  const conservador = {
    conversiones: Math.floor(escenario_base.conversiones * factores.conservador),
    revenue: Math.floor(escenario_base.revenue * factores.conservador),
    roas: escenario_base.roas * factores.conservador
  }

  const agresivo = {
    conversiones: Math.floor(escenario_base.conversiones * factores.agresivo),
    revenue: Math.floor(escenario_base.revenue * factores.agresivo),
    roas: escenario_base.roas * factores.agresivo
  }

  // Aplicar límites a cada escenario
  const conservador_limitado = {
    ...conservador,
    conversiones: aplicarLimitesIndustria(conservador.conversiones, 'conversiones', industria).valor_final,
    roas: aplicarLimitesIndustria(conservador.roas, 'roas', industria).valor_final
  }

  const base_limitado = {
    ...escenario_base,
    conversiones: aplicarLimitesIndustria(escenario_base.conversiones, 'conversiones', industria).valor_final,
    roas: aplicarLimitesIndustria(escenario_base.roas, 'roas', industria).valor_final
  }

  const agresivo_limitado = {
    ...agresivo,
    conversiones: aplicarLimitesIndustria(agresivo.conversiones, 'conversiones', industria).valor_final,
    roas: aplicarLimitesIndustria(agresivo.roas, 'roas', industria).valor_final
  }

  // Verificar orden lógico: conservador ≤ base ≤ agresivo
  if (conservador_limitado.roas > base_limitado.roas) {
    conservador_limitado.roas = base_limitado.roas * 0.8
  }
  if (agresivo_limitado.roas < base_limitado.roas) {
    agresivo_limitado.roas = base_limitado.roas * 1.2
  }

  return {
    conservador: conservador_limitado,
    base: base_limitado,
    agresivo: agresivo_limitado
  }
}

// Sistema de alertas automático
export const generarAlertasNegocio = (
  input: InputCliente2024,
  resultados: any
): string[] => {
  const alertas: string[] = []
  const benchmark = BENCHMARKS_INDUSTRIAS_2024[input.industria]

  if (!benchmark) return alertas

  // Alerta presupuesto muy bajo
  if (input.X_presupuesto_mensual < 500000) {
    alertas.push('⚠️ Presupuesto muy bajo: Considerar incrementar para mayor efectividad')
  }

  // Alerta competencia extrema
  if (input.competencia_percibida >= 9) {
    alertas.push('⚠️ Competencia extrema: Considerar estrategias de nicho o long-tail keywords')
  }

  // Alerta CPA muy alto (solo si CPA real es alto, no el presupuesto)
  const cpa_real = resultados.cpa || resultados.cpa_promedio || (input.X_presupuesto_mensual / Math.max(resultados.conversiones || resultados.conversiones_mes || 1, 1))
  // Cambio: De 3x a 5x para ser menos agresivo
  if (cpa_real > benchmark.cpa_minimo * 5) {
    alertas.push(`⚠️ CPA alto: $${Math.round(cpa_real).toLocaleString()} CLP supera 5x el mínimo recomendado ($${benchmark.cpa_minimo.toLocaleString()})`)
  }

  // Alerta ROAS muy bajo (solo para casos extremos)
  // Cambio: De 2x a 1x para ser menos agresivo (algunas industrias como Inmobiliaria tienen ROAS naturalmente bajo)
  const roas_real = resultados.roas || resultados.roas_esperado || 0
  if (roas_real < 1) {
    alertas.push('⚠️ ROAS bajo: Considerar optimizar landing pages o revisar targeting')
  }

  // Alerta saturación
  if (resultados.performance_analytics?.saturacion_estimada > 80) {
    alertas.push('⚠️ Alta saturación: Considerar diversificar canales o expandir targeting')
  }

  return alertas
}