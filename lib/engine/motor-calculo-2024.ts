// @ts-nocheck
/**
 * MOTOR DE CÁLCULO 2024 - CADENA DE CONVERSIÓN DIGITAL
 *
 * FÓRMULA REAL IMPLEMENTADA:
 * 1. Clicks = Presupuesto (X) / CPC_promedio
 * 2. Leads = Clicks × CVR_promedio
 * 3. Conversiones = Leads × Tasa_Cierre (Y) × Factores_Performance
 * 4. Revenue = Conversiones × Ticket_Promedio (Z)
 * 5. ROAS = Revenue / Presupuesto
 *
 * VARIABLES PRINCIPALES:
 * - X = Presupuesto mensual (CLP)
 * - Y = Tasa de cierre comercial (%)
 * - Z = Ticket promedio (CLP)
 *
 * BENCHMARKS: CPCs calibrados con data real Ubersuggest Chile 2024
 * PONDERADORES: 12 factores (estacional, competencia, madurez digital, geo, saturación, etc.)
 */

import { InputCliente2024 } from './interfaces-cliente-2024'
import { BENCHMARKS_INDUSTRIAS_2024, getBenchmarkIndustria } from './benchmarks-2024-verificados'
import { calcularTodosLosPonderadores } from './ponderadores-sistema-2024'
import {
  aplicarLimitesIndustria,
  validarCoherenciaMatematica,
  validarRangosRealistas,
  corregirEscenarios,
  generarAlertasNegocio
} from './validaciones-matematicas-2024'

// Resultado completo del motor
export interface ResultadoCalculoCompleto2024 {
  // Métricas principales
  conversiones_mes: number
  revenue_mensual: number
  roas_esperado: number
  cpa_promedio: number

  // Escenarios diferenciados
  escenarios: {
    conservador: EscenarioCalculado
    base: EscenarioCalculado
    agresivo: EscenarioCalculado
  }

  // Analytics de performance
  performance_analytics: {
    clicks_estimados: number
    ctr_promedio: number
    cvr_promedio: number
    saturacion_estimada: number
    eficiencia_presupuesto: number
  }

  // Métricas de rentabilidad (margen bruto)
  rentabilidad: {
    revenue_bruto: number           // Revenue total generado
    revenue_realizado: number       // Revenue realizado según ciclo
    ganancia_bruta: number          // Revenue × margen_bruto
    ganancia_neta: number           // Ganancia bruta - presupuesto
    roi: number                     // % retorno inversión
    roas_minimo_breakeven: number   // ROAS para breakeven
    es_rentable: boolean
    margen_bruto_porcentaje: number
  }

  // Factores aplicados (transparencia)
  factores_aplicados: {
    estacional: number
    competencia: number
    madurez_digital: number
    geografico: number
    saturacion: number
    ciclo_venta: number
  }

  // Mix de campañas recomendado
  mix_campanas: {
    [plataforma: string]: {
      porcentaje_presupuesto: number
      presupuesto_asignado: number
      conversiones_esperadas: number
      plataforma_justificacion: string
    }
  }

  // Validaciones y alertas
  validaciones: {
    coherencia_matematica: boolean
    rangos_realistas: boolean
    errores: string[]
    alertas: string[]
  }

  // Metadata del cálculo
  metadata: {
    industria_utilizada: string
    benchmarks_aplicados: any
    fecha_calculo: string
    version_motor: string
  }
}

interface EscenarioCalculado {
  nombre: string
  probabilidad_exito: number
  conversiones: number
  revenue: number
  roas: number
  cpa: number
  explicacion: string
}

// MOTOR PRINCIPAL
export class MotorCalculo2024 {

  static calcular(input: InputCliente2024): ResultadoCalculoCompleto2024 {

    // 1. Obtener benchmarks de la industria
    const benchmark = getBenchmarkIndustria(input.industria)
    if (!benchmark) {
      throw new Error(`Industria '${input.industria}' no soportada`)
    }

    // 2. Calcular todos los ponderadores
    const ponderadores = calcularTodosLosPonderadores(input)

    // 3. NUEVA FÓRMULA: X × Y × Z × factores_sistema
    const resultados_base = this.calcularMetricasBase(input, benchmark, ponderadores)

    // 4. Aplicar límites y correcciones
    const resultados_corregidos = this.aplicarCorreccionesMatematics(resultados_base, input, benchmark)

    // 5. Generar escenarios diferenciados
    const escenarios = this.generarEscenariosDiferenciados(resultados_corregidos, input, benchmark)

    // 6. Calcular mix de campañas
    const mix_campanas = this.calcularMixCampanas(input, benchmark, resultados_corregidos)

    // 7. Generar analytics de performance
    const performance_analytics = this.calcularPerformanceAnalytics(input, resultados_corregidos, ponderadores)

    // 8. Calcular métricas de rentabilidad
    const rentabilidad = this.calcularMetricasRentabilidad(
      resultados_corregidos.revenue_bruto || resultados_corregidos.revenue,
      resultados_corregidos.revenue,
      input.X_presupuesto_mensual,
      input.margen_bruto
    )

    // 9. Ejecutar validaciones
    const validaciones = this.ejecutarValidaciones(input, resultados_corregidos)

    // 10. Consolidar resultado final
    return {
      // Métricas principales
      conversiones_mes: resultados_corregidos.conversiones,
      revenue_mensual: resultados_corregidos.revenue,
      roas_esperado: resultados_corregidos.roas,
      cpa_promedio: resultados_corregidos.cpa,

      escenarios,
      performance_analytics,
      rentabilidad,

      factores_aplicados: {
        estacional: ponderadores.estacional,
        competencia: ponderadores.competencia,
        madurez_digital: ponderadores.digital.performance_factor,
        geografico: ponderadores.geografico.cpc_multiplier,
        saturacion: ponderadores.saturacion,
        ciclo_venta: ponderadores.ciclo_venta
      },

      mix_campanas,
      validaciones,

      metadata: {
        industria_utilizada: input.industria,
        benchmarks_aplicados: benchmark,
        fecha_calculo: new Date().toISOString(),
        version_motor: "2024.1.0"
      }
    }
  }

  // PASO 3: Cálculos base con nueva fórmula
  private static calcularMetricasBase(
    input: InputCliente2024,
    benchmark: any,
    ponderadores: any
  ) {

    // === NUEVA FÓRMULA ===
    // X = presupuesto_mensual (variable cliente)
    // Y = tasa_cierre (variable cliente)
    // Z = ticket_promedio (variable cliente)

    // Calcular CPC real con factores
    const cpc_google = benchmark.google_search.cpc_base * benchmark.chile_factor * ponderadores.factor_cpc_total
    const cpc_meta = benchmark.meta_ads.cpc_base * benchmark.chile_factor * ponderadores.factor_cpc_total

    // CPC promedio ponderado (70% Google, 30% Meta por defecto)
    const cpc_promedio_ponderado = (cpc_google * 0.7) + (cpc_meta * 0.3)

    // Clicks estimados desde presupuesto (X)
    const clicks_estimados = input.X_presupuesto_mensual / cpc_promedio_ponderado

    // CTR promedio ponderado (NO aplicar factor_cvr_total aquí, es para CVR)
    const ctr_google = benchmark.google_search.ctr_base
    const ctr_meta = benchmark.meta_ads.ctr_base
    const ctr_promedio = (ctr_google * 0.7) + (ctr_meta * 0.3)

    // CVR promedio ponderado con factores (AQUÍ sí aplicar factor_cvr_total)
    const cvr_google = benchmark.google_search.cvr_web * ponderadores.factor_cvr_total
    const cvr_meta = benchmark.meta_ads.cvr_web * ponderadores.factor_cvr_total
    const cvr_promedio = (cvr_google * 0.7) + (cvr_meta * 0.3)

    // Leads digitales (clicks → conversiones web)
    // CVR ya es porcentaje, dividir por 100 para obtener decimal
    const leads_digitales = clicks_estimados * (cvr_promedio / 100)

    // NUEVA FÓRMULA: Aplicar tasa de cierre real del cliente (Y)
    const conversiones_brutas = leads_digitales * (input.Y_tasa_cierre / 100)

    // Aplicar factor de performance total
    const conversiones_con_factores = conversiones_brutas * ponderadores.factor_performance_total

    // Revenue usando ticket real del cliente (Z)
    const revenue_bruto = conversiones_con_factores * input.Z_ticket_promedio

    // Aplicar factor de ciclo de venta (revenue realizado vs pipeline)
    const revenue_realizado = revenue_bruto * ponderadores.factor_revenue_realizado

    // ROAS y CPA (usar revenue realizado)
    const roas_bruto = revenue_realizado / input.X_presupuesto_mensual
    const cpa_bruto = input.X_presupuesto_mensual / Math.max(conversiones_con_factores, 1)

    return {
      clicks_estimados: Math.round(clicks_estimados),
      leads_digitales: Math.round(leads_digitales),
      conversiones: Math.round(conversiones_con_factores),
      revenue: Math.round(revenue_realizado),  // Revenue realizado según ciclo
      revenue_bruto: Math.round(revenue_bruto), // Revenue total generado
      roas: roas_bruto,
      cpa: cpa_bruto,
      cpc_promedio: cpc_promedio_ponderado,
      ctr_promedio,
      cvr_promedio,
      factor_ciclo_venta: ponderadores.factor_revenue_realizado
    }
  }

  // PASO 4: Aplicar correcciones matemáticas
  private static aplicarCorreccionesMatematics(resultados: any, input: InputCliente2024, benchmark: any) {

    // Aplicar límites de conversiones por industria
    const limite_conversiones = aplicarLimitesIndustria(
      resultados.conversiones,
      'conversiones',
      input.industria
    )

    // Aplicar límites de ROAS por industria
    const limite_roas = aplicarLimitesIndustria(
      resultados.roas,
      'roas',
      input.industria
    )

    // Aplicar límites de CPA por industria
    const limite_cpa = aplicarLimitesIndustria(
      resultados.cpa,
      'cpa',
      input.industria
    )

    // Recalcular métricas coherentes con límites aplicados
    const conversiones_final = limite_conversiones.valor_final
    const roas_final = limite_roas.valor_final
    const revenue_final = Math.round(roas_final * input.X_presupuesto_mensual)
    const cpa_final = input.X_presupuesto_mensual / Math.max(conversiones_final, 1)

    // Log correcciones aplicadas
    if (limite_conversiones.fue_limitado) {
      console.log(`⚠️ LIMITE CONVERSIONES: ${input.industria} ${resultados.conversiones} → ${conversiones_final}`)
    }
    if (limite_roas.fue_limitado) {
      console.log(`⚠️ LIMITE ROAS: ${input.industria} ${resultados.roas.toFixed(2)} → ${roas_final.toFixed(2)}`)
    }

    return {
      ...resultados,
      conversiones: conversiones_final,
      revenue: revenue_final,
      roas: roas_final,
      cpa: cpa_final,
      limites_aplicados: {
        conversiones: limite_conversiones.fue_limitado,
        roas: limite_roas.fue_limitado,
        cpa: limite_cpa.fue_limitado
      }
    }
  }

  // PASO 5: Generar escenarios diferenciados
  private static generarEscenariosDiferenciados(resultados: any, input: InputCliente2024, benchmark: any) {

    const factores_escenario = {
      conservador: 0.7,  // 30% menos performance
      agresivo: 1.4      // 40% más performance
    }

    const escenarios_brutos = corregirEscenarios(
      {
        conversiones: resultados.conversiones,
        revenue: resultados.revenue,
        roas: resultados.roas
      },
      factores_escenario,
      input.industria
    )

    return {
      conservador: {
        nombre: "Conservador",
        probabilidad_exito: 85,
        conversiones: escenarios_brutos.conservador.conversiones,
        revenue: escenarios_brutos.conservador.revenue,
        roas: Math.round(escenarios_brutos.conservador.roas * 10) / 10,
        cpa: Math.round(input.X_presupuesto_mensual / Math.max(escenarios_brutos.conservador.conversiones, 1)),
        explicacion: this.getExplicacionEscenario('conservador', input.industria)
      },
      base: {
        nombre: "Realista",
        probabilidad_exito: 70,
        conversiones: escenarios_brutos.base.conversiones,
        revenue: escenarios_brutos.base.revenue,
        roas: Math.round(escenarios_brutos.base.roas * 10) / 10,
        cpa: Math.round(resultados.cpa),
        explicacion: this.getExplicacionEscenario('base', input.industria)
      },
      agresivo: {
        nombre: "Agresivo",
        probabilidad_exito: 50,
        conversiones: escenarios_brutos.agresivo.conversiones,
        revenue: escenarios_brutos.agresivo.revenue,
        roas: Math.round(escenarios_brutos.agresivo.roas * 10) / 10,
        cpa: Math.round(input.X_presupuesto_mensual / Math.max(escenarios_brutos.agresivo.conversiones, 1)),
        explicacion: this.getExplicacionEscenario('agresivo', input.industria)
      }
    }
  }

  // PASO 6: Calcular mix de campañas por plataforma
  private static calcularMixCampanas(input: InputCliente2024, benchmark: any, resultados: any) {
    const plataformas_recomendadas = benchmark.plataformas_recomendadas
    const presupuesto = input.X_presupuesto_mensual
    const mix: any = {}

    // Determinar complejidad del mix según presupuesto
    const es_presupuesto_bajo = presupuesto < 2000000  // < 2M
    const es_presupuesto_medio = presupuesto >= 2000000 && presupuesto < 5000000  // 2M-5M
    const es_presupuesto_alto = presupuesto >= 5000000  // > 5M

    // Distribución base por tipo de negocio y presupuesto
    if (input.tipo_cliente === 'B2B') {
      // B2B: Priorizar Google Search y LinkedIn
      if (plataformas_recomendadas.includes('GOOGLE_SEARCH')) {
        mix['GOOGLE_SEARCH'] = { porcentaje: es_presupuesto_bajo ? 70 : 50 }
      }
      if (plataformas_recomendadas.includes('LINKEDIN') && !es_presupuesto_bajo) {
        mix['LINKEDIN'] = { porcentaje: es_presupuesto_alto ? 30 : 25 }
      }
      if (plataformas_recomendadas.includes('META_ADS')) {
        mix['META_ADS'] = { porcentaje: es_presupuesto_bajo ? 30 : 15 }
      }
      // Agregar Google Display solo para presupuestos altos
      if (es_presupuesto_alto && plataformas_recomendadas.includes('GOOGLE_DISPLAY')) {
        mix['GOOGLE_DISPLAY'] = { porcentaje: 10 }
      }
    } else {
      // B2C: Más diversificado
      if (plataformas_recomendadas.includes('GOOGLE_SEARCH')) {
        mix['GOOGLE_SEARCH'] = { porcentaje: es_presupuesto_bajo ? 60 : 40 }
      }
      if (plataformas_recomendadas.includes('META_ADS')) {
        mix['META_ADS'] = { porcentaje: es_presupuesto_bajo ? 40 : 30 }
      }
      if (plataformas_recomendadas.includes('GOOGLE_SHOPPING') && !es_presupuesto_bajo) {
        mix['GOOGLE_SHOPPING'] = { porcentaje: 20 }
      }
      // Agregar plataformas adicionales para presupuestos altos
      if (es_presupuesto_alto) {
        if (plataformas_recomendadas.includes('TIKTOK')) {
          mix['TIKTOK'] = { porcentaje: 10 }
        }
        if (plataformas_recomendadas.includes('YOUTUBE')) {
          mix['YOUTUBE'] = { porcentaje: 10 }
        }
      }
    }

    // Normalizar porcentajes
    const total_porcentaje = Object.values(mix).reduce((sum: number, plat: any) => sum + plat.porcentaje, 0)

    // Calcular métricas por plataforma
    Object.keys(mix).forEach(plataforma => {
      const porcentaje_normalizado = (mix[plataforma].porcentaje / total_porcentaje) * 100
      const presupuesto_asignado = Math.round((input.X_presupuesto_mensual * porcentaje_normalizado) / 100)
      const conversiones_esperadas = Math.round((resultados.conversiones * porcentaje_normalizado) / 100)

      mix[plataforma] = {
        porcentaje_presupuesto: Math.round(porcentaje_normalizado),
        presupuesto_asignado,
        conversiones_esperadas,
        plataforma_justificacion: this.getJustificacionPlataforma(plataforma, input)
      }
    })

    return mix
  }

  // PASO 7: Analytics de performance
  private static calcularPerformanceAnalytics(input: InputCliente2024, resultados: any, ponderadores: any) {
    return {
      clicks_estimados: resultados.clicks_estimados,
      ctr_promedio: Math.round(resultados.ctr_promedio * 100) / 100,
      cvr_promedio: Math.round(resultados.cvr_promedio * 100) / 100,
      saturacion_estimada: Math.round((1 - ponderadores.saturacion) * 100),
      eficiencia_presupuesto: Math.round(ponderadores.saturacion * 100)
    }
  }

  // PASO 8: Validaciones completas
  private static ejecutarValidaciones(input: InputCliente2024, resultados: any) {

    // Validar coherencia matemática
    const coherencia = validarCoherenciaMatematica({
      presupuesto: input.X_presupuesto_mensual,
      conversiones: resultados.conversiones,
      revenue: resultados.revenue,
      roas: resultados.roas,
      cpa: resultados.cpa
    })

    // Validar rangos realistas
    const rangos = validarRangosRealistas(input, resultados)

    // Generar alertas de negocio
    const alertas_negocio = generarAlertasNegocio(input, resultados)

    return {
      coherencia_matematica: coherencia.es_coherente,
      rangos_realistas: rangos.es_realista,
      errores: [...coherencia.errores],
      alertas: [...rangos.alertas, ...alertas_negocio]
    }
  }

  // Helpers para explicaciones
  private static getExplicacionEscenario(tipo: string, industria: string): string {
    const explicaciones = {
      'conservador': `Escenario defensivo con métricas conservadoras para ${industria}`,
      'base': `Proyección realista basada en benchmarks 2024 para ${industria}`,
      'agresivo': `Escenario optimista con máximo performance para ${industria}`
    }
    return explicaciones[tipo] || 'Escenario calculado'
  }

  private static getJustificacionPlataforma(plataforma: string, input: InputCliente2024): string {
    const justificaciones = {
      'GOOGLE_SEARCH': 'Alta intención de compra, excellent ROI',
      'META_ADS': input.tipo_cliente === 'B2C' ? 'Segmentación demográfica efectiva' : 'Awareness y remarketing B2B',
      'LINKEDIN': 'Ideal para decisores B2B de alto nivel',
      'GOOGLE_SHOPPING': 'Esencial para productos e-commerce',
      'YOUTUBE': 'Video marketing para productos complejos',
      'GOOGLE_DISPLAY': 'Remarketing y awareness con amplio alcance',
      'TIKTOK': 'Audiencia joven, contenido viral y engagement'
    }
    return justificaciones[plataforma] || 'Plataforma recomendada'
  }

  // Calcular métricas de rentabilidad según margen bruto
  private static calcularMetricasRentabilidad(
    revenue_bruto: number,
    revenue_realizado: number,
    presupuesto: number,
    margen_bruto: number
  ) {
    const ganancia_bruta = revenue_realizado * (margen_bruto / 100)
    const ganancia_neta = ganancia_bruta - presupuesto
    const roi = presupuesto > 0 ? (ganancia_neta / presupuesto) * 100 : 0
    const roas_minimo_breakeven = margen_bruto > 0 ? 1 / (margen_bruto / 100) : 999

    return {
      revenue_bruto: Math.round(revenue_bruto),
      revenue_realizado: Math.round(revenue_realizado),
      ganancia_bruta: Math.round(ganancia_bruta),
      ganancia_neta: Math.round(ganancia_neta),
      roi: Math.round(roi * 100) / 100,
      roas_minimo_breakeven: Math.round(roas_minimo_breakeven * 100) / 100,
      es_rentable: ganancia_neta > 0,
      margen_bruto_porcentaje: margen_bruto
    }
  }
}