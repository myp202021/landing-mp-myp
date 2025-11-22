// @ts-nocheck
/**
 * PONDERADORES Y FACTORES DEL SISTEMA 2024
 * No los define el cliente - son automáticos según benchmarks
 */

import { InputCliente2024 } from './interfaces-cliente-2024'

// Factores estacionales por industria y mes
export const FACTORES_ESTACIONALES = {
  ECOMMERCE: {
    1: 0.6,   // Enero - post navidad
    2: 0.7,   // Febrero - bajo
    3: 0.9,   // Marzo - recuperación
    4: 1.0,   // Abril - normal
    5: 1.1,   // Mayo - día madre
    6: 0.9,   // Junio - normal
    7: 0.8,   // Julio - invierno
    8: 0.9,   // Agosto - invierno
    9: 1.1,   // Septiembre - primavera
    10: 1.2,  // Octubre - preparación navidad
    11: 1.4,  // Noviembre - black friday
    12: 1.8   // Diciembre - navidad
  },

  INMOBILIARIA: {
    1: 0.8,   // Enero - vacaciones
    2: 0.85,  // Febrero - bajo
    3: 1.1,   // Marzo - vuelta actividad
    4: 1.2,   // Abril - otoño activo
    5: 1.15,  // Mayo - buen momento
    6: 0.9,   // Junio - invierno
    7: 0.85,  // Julio - invierno
    8: 0.9,   // Agosto - fin invierno
    9: 1.1,   // Septiembre - primavera
    10: 1.25, // Octubre - peak actividad
    11: 1.3,  // Noviembre - peak actividad
    12: 1.0   // Diciembre - cierre año
  },

  TURISMO: {
    1: 1.2,   // Enero - verano peak
    2: 1.3,   // Febrero - verano peak
    3: 1.0,   // Marzo - otoño
    4: 0.8,   // Abril - baja
    5: 0.7,   // Mayo - invierno
    6: 0.6,   // Junio - invierno
    7: 0.5,   // Julio - invierno bajo
    8: 0.6,   // Agosto - invierno
    9: 0.9,   // Septiembre - primavera
    10: 1.1,  // Octubre - primavera
    11: 1.2,  // Noviembre - preparación verano
    12: 1.4   // Diciembre - vacaciones navidad
  },

  // Aplicar patrón similar a todas las industrias
  GASTRONOMIA: {
    1: 0.8, 2: 0.9, 3: 1.0, 4: 1.0, 5: 1.1, 6: 0.9,
    7: 0.8, 8: 0.9, 9: 1.0, 10: 1.1, 11: 1.2, 12: 1.3
  },

  AUTOMOTRIZ: {
    1: 0.9, 2: 0.8, 3: 1.1, 4: 1.2, 5: 1.1, 6: 0.9,
    7: 0.8, 8: 0.9, 9: 1.0, 10: 1.2, 11: 1.3, 12: 1.1
  },

  SALUD_MEDICINA: {
    1: 0.9, 2: 0.9, 3: 1.1, 4: 1.1, 5: 1.0, 6: 1.0,
    7: 0.9, 8: 0.9, 9: 1.0, 10: 1.1, 11: 1.1, 12: 0.8
  },

  EDUCACION: {
    1: 0.7, 2: 0.8, 3: 1.3, 4: 1.2, 5: 1.0, 6: 0.8,
    7: 0.6, 8: 1.4, 9: 1.2, 10: 1.1, 11: 1.0, 12: 0.5
  },

  MODA_RETAIL: {
    1: 0.6, 2: 0.8, 3: 1.0, 4: 1.1, 5: 1.2, 6: 0.9,
    7: 0.8, 8: 0.9, 9: 1.1, 10: 1.2, 11: 1.5, 12: 1.7
  },

  FINTECH: {
    1: 1.1, 2: 1.0, 3: 1.1, 4: 1.0, 5: 1.0, 6: 1.0,
    7: 0.9, 8: 0.9, 9: 1.0, 10: 1.1, 11: 1.0, 12: 0.9
  },

  SERVICIOS_LEGALES: {
    1: 0.8, 2: 0.9, 3: 1.2, 4: 1.1, 5: 1.0, 6: 1.0,
    7: 0.9, 8: 0.9, 9: 1.0, 10: 1.1, 11: 1.1, 12: 0.8
  },

  BELLEZA_PERSONAL: {
    1: 0.9, 2: 1.0, 3: 1.1, 4: 1.0, 5: 1.2, 6: 0.9,
    7: 0.8, 8: 0.9, 9: 1.0, 10: 1.1, 11: 1.2, 12: 1.3
  },

  TECNOLOGIA_SAAS: {
    1: 1.0, 2: 1.0, 3: 1.1, 4: 1.0, 5: 1.0, 6: 1.0,
    7: 0.9, 8: 0.9, 9: 1.1, 10: 1.1, 11: 1.0, 12: 0.8
  }
}

// Factores por nivel de competencia percibida (1-10)
export const FACTORES_COMPETENCIA = {
  calcular: (nivel: number): number => {
    if (nivel <= 2) return 1.15      // Baja competencia = mejor performance
    if (nivel <= 4) return 1.05      // Media-baja
    if (nivel <= 6) return 1.0       // Media
    if (nivel <= 8) return 0.9       // Media-alta
    return 0.75                      // Alta/extrema competencia
  },

  impacto_cpc: (nivel: number): number => {
    if (nivel <= 2) return 0.8       // CPCs más bajos
    if (nivel <= 4) return 0.9
    if (nivel <= 6) return 1.0
    if (nivel <= 8) return 1.3
    return 1.6                       // CPCs mucho más altos
  }
}

// Factores por madurez digital
export const FACTORES_MADUREZ_DIGITAL = {
  PRINCIPIANTE: {
    performance_factor: 0.8,    // 20% menos performance
    cpc_factor: 1.1,           // CPCs más altos (peor optimización)
    cvr_factor: 0.9            // CVR más bajo (landing pages básicas)
  },
  INTERMEDIO: {
    performance_factor: 1.0,
    cpc_factor: 1.0,
    cvr_factor: 1.0
  },
  AVANZADO: {
    performance_factor: 1.3,    // 30% mejor performance
    cpc_factor: 0.9,           // CPCs más bajos (mejor optimización)
    cvr_factor: 1.2            // CVR más alto (landing pages optimizadas)
  }
}

// Factores por tipo de tomador de decisión
export const FACTORES_DECISION_MAKER = {
  PROPIETARIO: {
    factor_velocidad: 1.2,      // Decisiones más rápidas
    factor_presupuesto: 1.1     // Más flexible con presupuesto
  },
  GERENTE: {
    factor_velocidad: 1.0,      // Velocidad estándar
    factor_presupuesto: 1.0     // Presupuesto estándar
  },
  EMPLEADO: {
    factor_velocidad: 0.8,      // Decisiones más lentas
    factor_presupuesto: 0.9     // Presupuesto más limitado
  }
}

// Factores geográficos Chile
export const FACTORES_GEOGRAFICOS = {
  SANTIAGO: {
    cpc_multiplier: 1.3,        // CPCs más altos
    alcance_poblacion: 0.4,     // 40% población Chile
    competencia_factor: 1.3     // Mayor competencia
  },
  REGIONES: {
    cpc_multiplier: 0.8,        // CPCs más bajos
    alcance_poblacion: 0.6,     // 60% población Chile
    competencia_factor: 0.8     // Menor competencia
  },
  NACIONAL: {
    cpc_multiplier: 1.0,        // Promedio nacional
    alcance_poblacion: 1.0,     // 100% población
    competencia_factor: 1.0     // Competencia promedio
  }
}

// Factores por ciclo de venta (afecta revenue realizado vs pipeline)
export const FACTORES_CICLO_VENTA = {
  INSTANTANEO: {
    factor_revenue_realizado: 1.0,    // 100% del revenue se realiza en el mes
    descripcion: 'Compras instantáneas (ecommerce, impulso)'
  },
  MENOS_1_MES: {
    factor_revenue_realizado: 0.85,   // 85% realizado, 15% en pipeline
    descripcion: 'Ciclo corto típico B2C (1-30 días)'
  },
  UNO_A_TRES_MESES: {
    factor_revenue_realizado: 0.65,   // 65% realizado, 35% en pipeline
    descripcion: 'Ciclo medio B2B (1-3 meses)'
  },
  MAS_3_MESES: {
    factor_revenue_realizado: 0.45,   // 45% realizado, 55% en pipeline
    descripcion: 'Ciclo largo enterprise (>3 meses)'
  }
}

// Helper para calcular métricas de rentabilidad según margen bruto
export const calcularMetricasMargen = (revenue: number, presupuesto: number, margen_bruto: number) => {
  const revenue_bruto = revenue
  const costo_producto = revenue * (1 - margen_bruto / 100)
  const ganancia_bruta = revenue * (margen_bruto / 100)
  const ganancia_neta = ganancia_bruta - presupuesto
  const roi = presupuesto > 0 ? (ganancia_neta / presupuesto) * 100 : 0
  const roas_minimo_breakeven = margen_bruto > 0 ? 1 / (margen_bruto / 100) : 999

  return {
    revenue_bruto,           // Revenue total de ventas
    costo_producto,          // Costo de los productos vendidos
    ganancia_bruta,          // Revenue × (margen / 100)
    ganancia_neta,           // Ganancia bruta - presupuesto ads
    roi,                     // % de retorno sobre inversión
    roas_minimo_breakeven,   // ROAS necesario para breakeven
    es_rentable: ganancia_neta > 0
  }
}

// Factor de saturación por presupuesto e industria
export const calcularFactorSaturacion = (presupuesto: number, industria: string): number => {
  // Umbrales de saturación por industria (CLP)
  const umbrales = {
    ECOMMERCE: 5000000,        // $5M CLP
    INMOBILIARIA: 8000000,     // $8M CLP
    TURISMO: 4000000,          // $4M CLP
    GASTRONOMIA: 3000000,      // $3M CLP
    AUTOMOTRIZ: 10000000,      // $10M CLP
    SALUD_MEDICINA: 6000000,   // $6M CLP
    EDUCACION: 7000000,        // $7M CLP
    MODA_RETAIL: 5000000,      // $5M CLP
    FINTECH: 8000000,          // $8M CLP
    SERVICIOS_LEGALES: 12000000, // $12M CLP
    BELLEZA_PERSONAL: 4000000, // $4M CLP
    TECNOLOGIA_SAAS: 15000000  // $15M CLP
  }

  const umbral = umbrales[industria] || 5000000
  const ratio = presupuesto / umbral

  // Función de saturación: decrece después del umbral
  if (ratio <= 0.5) return 1.0        // Sin saturación
  if (ratio <= 1.0) return 0.95       // Saturación leve
  if (ratio <= 2.0) return 0.85       // Saturación media
  return 0.75                         // Saturación alta
}

// Calculador principal de factores
export const calcularTodosLosPonderadores = (input: InputCliente2024) => {
  const mes = input.mes_actual || new Date().getMonth() + 1

  // Factor estacional
  const factorEstacional = FACTORES_ESTACIONALES[input.industria]?.[mes] || 1.0

  // Factor competencia
  const factorCompetencia = FACTORES_COMPETENCIA.calcular(input.competencia_percibida)
  const factorCpcCompetencia = FACTORES_COMPETENCIA.impacto_cpc(input.competencia_percibida)

  // Factor madurez digital (con default)
  const factoresDigital = FACTORES_MADUREZ_DIGITAL[input.madurez_digital] || FACTORES_MADUREZ_DIGITAL.INTERMEDIO

  // Factor tomador decisión (con default)
  const factoresDecision = FACTORES_DECISION_MAKER[input.decision_maker] || FACTORES_DECISION_MAKER.GERENTE

  // Factor geográfico (con default)
  const factoresGeo = FACTORES_GEOGRAFICOS[input.geo_objetivo] || FACTORES_GEOGRAFICOS.NACIONAL

  // Factor saturación
  const factorSaturacion = calcularFactorSaturacion(input.X_presupuesto_mensual, input.industria)

  // Factor ciclo de venta (afecta revenue realizado, default MENOS_1_MES)
  const factorCicloVenta = FACTORES_CICLO_VENTA[input.ciclo_venta]?.factor_revenue_realizado || 0.85

  // Margen bruto (default 40%)
  const margenBruto = input.margen_bruto || 40

  return {
    estacional: factorEstacional,
    competencia: factorCompetencia,
    cpc_competencia: factorCpcCompetencia,
    digital: factoresDigital,
    decision: factoresDecision,
    geografico: factoresGeo,
    saturacion: factorSaturacion,
    ciclo_venta: factorCicloVenta,
    margen_bruto: margenBruto,

    // Factores combinados para cálculos
    factor_performance_total: factorEstacional * factorCompetencia * factoresDigital.performance_factor * factoresDecision.factor_velocidad * factorSaturacion,

    factor_cpc_total: factorCpcCompetencia * factoresDigital.cpc_factor * factoresGeo.cpc_multiplier,

    // CORRECCIÓN: Eliminar saturación aquí (ya está en factor_performance_total)
    factor_cvr_total: factoresDigital.cvr_factor,

    // Factor de revenue realizado (ciclo de venta)
    factor_revenue_realizado: factorCicloVenta
  }
}