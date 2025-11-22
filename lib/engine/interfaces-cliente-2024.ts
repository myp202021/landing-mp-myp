// @ts-nocheck
/**
 * INTERFACES CLIENTE 2024 - VARIABLES X, Y, Z
 * Sistema rediseñado: Cliente aporta variables reales, sistema aporta benchmarks
 */

import { BENCHMARKS_INDUSTRIAS_2024 } from './benchmarks-2024-verificados'

// Variables que aporta el CLIENTE (X, Y, Z)
export interface InputCliente2024 {
  // === VARIABLES PRINCIPALES DEL NEGOCIO (X, Y, Z) ===

  // X - Presupuesto mensual (CLP libre)
  X_presupuesto_mensual: number

  // Y - Tasa de cierre real del cliente (% libre con explicación)
  Y_tasa_cierre: number

  // Z - Ticket promedio real del cliente (CLP libre)
  Z_ticket_promedio: number

  // === VARIABLES DE CONTEXTO DEL NEGOCIO ===

  // Industria (debe existir en benchmarks)
  industria: string

  // Tipo de cliente
  tipo_cliente: 'B2B' | 'B2C'

  // Nivel de competencia percibida por el cliente (1-10)
  competencia_percibida: number

  // Madurez digital del negocio
  madurez_digital: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'

  // Tipo de tomador de decisión
  decision_maker: 'PROPIETARIO' | 'GERENTE' | 'EMPLEADO'

  // Objetivo geográfico
  geo_objetivo: 'SANTIAGO' | 'REGIONES' | 'NACIONAL'

  // Ciclo de venta (afecta revenue realizado vs pipeline)
  ciclo_venta: 'INSTANTANEO' | 'MENOS_1_MES' | 'UNO_A_TRES_MESES' | 'MAS_3_MESES'

  // Margen bruto del negocio (% para calcular rentabilidad real)
  margen_bruto: number

  // Mes actual para estacionalidad (opcional)
  mes_actual?: number
}

// Explicaciones específicas por industria para tasa de cierre
export const getExplicacionTasaCierre = (industria: string): string => {
  const benchmark = BENCHMARKS_INDUSTRIAS_2024[industria]
  if (!benchmark) {
    return "% de leads que se convierten en ventas cerradas"
  }
  return benchmark.tasa_cierre_explicacion
}

// Validaciones de rangos por variable
export const RANGOS_VALIDACION = {
  X_presupuesto_mensual: {
    min: 100000,      // $100k CLP mínimo
    max: 50000000,    // $50M CLP máximo
    recomendado_min: 500000,  // $500k recomendado
    mensaje: "Presupuesto mensual en CLP. Mínimo recomendado: $500.000 CLP"
  },

  Y_tasa_cierre: {
    min: 0.1,         // 0.1% mínimo
    max: 50,          // 50% máximo realista
    recomendado_max: 25, // 25% recomendado
    mensaje: "% realista según tu industria. Ejemplo: 2-8% típico para la mayoría"
  },

  Z_ticket_promedio: {
    min: 1000,        // $1k CLP mínimo
    max: 1000000000,  // $1B CLP máximo
    recomendado_por_industria: true,
    mensaje: "Valor promedio por venta en CLP"
  },

  competencia_percibida: {
    min: 1,
    max: 10,
    mensaje: "Nivel de competencia percibida: 1=Baja, 10=Extrema"
  },

  margen_bruto: {
    min: 5,
    max: 95,
    recomendado_min: 20,
    recomendado_max: 80,
    mensaje: "Margen bruto del negocio en %. Ejemplo: 40% = por cada $100 de venta, $40 es ganancia bruta"
  }
}

// Tickets promedio recomendados por industria (referencia)
export const TICKETS_REFERENCIA_INDUSTRIA = {
  ECOMMERCE: { bajo: 15000, medio: 45000, alto: 120000 },
  INMOBILIARIA: { bajo: 80000000, medio: 180000000, alto: 400000000 },
  TURISMO: { bajo: 80000, medio: 250000, alto: 800000 },
  GASTRONOMIA: { bajo: 8000, medio: 25000, alto: 60000 },
  AUTOMOTRIZ: { bajo: 8000000, medio: 20000000, alto: 50000000 },
  SALUD_MEDICINA: { bajo: 50000, medio: 150000, alto: 500000 },
  EDUCACION: { bajo: 100000, medio: 300000, alto: 1000000 },
  MODA_RETAIL: { bajo: 20000, medio: 60000, alto: 200000 },
  FINTECH: { bajo: 200000, medio: 800000, alto: 3000000 },
  SERVICIOS_LEGALES: { bajo: 500000, medio: 1500000, alto: 5000000 },
  BELLEZA_PERSONAL: { bajo: 30000, medio: 80000, alto: 250000 },
  TECNOLOGIA_SAAS: { bajo: 500000, medio: 2000000, alto: 10000000 }
}

// Validador de input completo
export const validarInputCliente = (input: InputCliente2024): { valido: boolean, errores: string[] } => {
  const errores: string[] = []

  // Validar industria existe
  if (!BENCHMARKS_INDUSTRIAS_2024[input.industria]) {
    errores.push(`Industria '${input.industria}' no soportada. Disponibles: ${Object.keys(BENCHMARKS_INDUSTRIAS_2024).join(', ')}`)
  }

  // Validar presupuesto
  if (input.X_presupuesto_mensual < RANGOS_VALIDACION.X_presupuesto_mensual.min) {
    errores.push(`Presupuesto muy bajo. Mínimo: $${RANGOS_VALIDACION.X_presupuesto_mensual.min.toLocaleString()} CLP`)
  }
  if (input.X_presupuesto_mensual > RANGOS_VALIDACION.X_presupuesto_mensual.max) {
    errores.push(`Presupuesto muy alto. Máximo: $${RANGOS_VALIDACION.X_presupuesto_mensual.max.toLocaleString()} CLP`)
  }

  // Validar tasa de cierre
  if (input.Y_tasa_cierre < RANGOS_VALIDACION.Y_tasa_cierre.min) {
    errores.push(`Tasa de cierre muy baja. Mínimo: ${RANGOS_VALIDACION.Y_tasa_cierre.min}%`)
  }
  if (input.Y_tasa_cierre > RANGOS_VALIDACION.Y_tasa_cierre.max) {
    errores.push(`Tasa de cierre muy alta. Máximo realista: ${RANGOS_VALIDACION.Y_tasa_cierre.max}%`)
  }

  // Validar ticket promedio
  if (input.Z_ticket_promedio < RANGOS_VALIDACION.Z_ticket_promedio.min) {
    errores.push(`Ticket promedio muy bajo. Mínimo: $${RANGOS_VALIDACION.Z_ticket_promedio.min.toLocaleString()} CLP`)
  }
  if (input.Z_ticket_promedio > RANGOS_VALIDACION.Z_ticket_promedio.max) {
    errores.push(`Ticket promedio muy alto. Máximo: $${RANGOS_VALIDACION.Z_ticket_promedio.max.toLocaleString()} CLP`)
  }

  // Validar competencia
  if (input.competencia_percibida < 1 || input.competencia_percibida > 10) {
    errores.push('Competencia percibida debe estar entre 1 y 10')
  }

  // Validar margen bruto
  if (input.margen_bruto < RANGOS_VALIDACION.margen_bruto.min) {
    errores.push(`Margen bruto muy bajo. Mínimo: ${RANGOS_VALIDACION.margen_bruto.min}%`)
  }
  if (input.margen_bruto > RANGOS_VALIDACION.margen_bruto.max) {
    errores.push(`Margen bruto muy alto. Máximo: ${RANGOS_VALIDACION.margen_bruto.max}%`)
  }

  return {
    valido: errores.length === 0,
    errores
  }
}

// Helper para obtener rango de tickets recomendado
export const getTicketRecomendado = (industria: string): { bajo: number, medio: number, alto: number } => {
  return TICKETS_REFERENCIA_INDUSTRIA[industria] || TICKETS_REFERENCIA_INDUSTRIA.ECOMMERCE
}