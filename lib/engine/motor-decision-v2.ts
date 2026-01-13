// @ts-nocheck
/**
 * MOTOR DE DECISIÓN V2 - SISTEMA CONSULTIVO
 *
 * Este motor actúa como un consultor experto que:
 * 1. Analiza el contexto del negocio ANTES de los números
 * 2. Recomienda plataformas y tipos de campaña con justificación
 * 3. Alerta sobre condiciones no viables
 * 4. Prioriza según etapa y objetivos del negocio
 *
 * Basado en metodología M&P 2025
 */

import { CPC_CALIBRADO_CHILE } from '../config/cpc-calibrado-chile'
import { getBenchmarkIndustria } from './benchmarks-2024-verificados'

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export type EtapaNegocio = 'STARTUP' | 'CRECIMIENTO' | 'CONSOLIDADO'
export type ObjetivoMarketing = 'AWARENESS' | 'LEADS' | 'VENTAS_DIRECTAS'
export type NivelAssets = 'SIN_CONTENIDO' | 'BASICO' | 'PRODUCCION'
export type TipoCliente = 'B2B' | 'B2C' | 'MIXTO'

export interface InputConsultivo {
  // Datos del negocio
  industria: string
  tipo_cliente: TipoCliente
  ticket_promedio: number
  ventas_actuales_mes: number // Ventas actuales para medir capacidad
  margen_bruto: number // Porcentaje

  // Contexto estratégico
  etapa_negocio: EtapaNegocio
  objetivo_marketing: ObjetivoMarketing
  nivel_assets: NivelAssets

  // Presupuesto
  presupuesto_mensual: number

  // Opcionales
  competencia_percibida?: number // 1-10
  tiene_ecommerce?: boolean
  tiene_equipo_ventas?: boolean
  ciclo_venta_dias?: number
}

export interface DiagnosticoConsultivo {
  viable: boolean
  score_viabilidad: number // 0-100

  diagnostico_principal: string
  alertas_criticas: string[]

  plataforma_recomendada: 'GOOGLE' | 'META' | 'LINKEDIN' | 'MIXTO'
  justificacion_plataforma: string

  tipo_campana_recomendado: string
  justificacion_campana: string

  presupuesto_sugerido: {
    minimo_viable: number
    optimo: number
    maximo_eficiente: number
  }

  distribucion_recomendada: {
    plataforma: string
    porcentaje: number
    tipo_campana: string
    justificacion: string
  }[]

  advertencias: {
    tipo: 'CRITICA' | 'IMPORTANTE' | 'SUGERENCIA'
    mensaje: string
    accion_recomendada: string
  }[]

  siguiente_paso: string
}

// ============================================================================
// CONSTANTES DE DECISIÓN
// ============================================================================

// Ratio mínimo ticket/CPC para que Search sea viable
const RATIO_TICKET_CPC_MINIMO = 15

// Ratio mínimo para recomendar Google sobre Meta
const RATIO_TICKET_CPC_GOOGLE_VIABLE = 10

// CVR promedio para cálculo de ROAS
const CVR_PROMEDIO = 0.03

// Presupuestos mínimos por plataforma (CLP)
const PRESUPUESTO_MINIMO = {
  GOOGLE_SEARCH: 500000,
  META_ADS: 300000,
  LINKEDIN: 800000,
  YOUTUBE: 600000
}

// Multiplicadores de dificultad por etapa
const FACTOR_ETAPA = {
  STARTUP: { dificultad: 1.3, enfoque: 'validacion' },
  CRECIMIENTO: { dificultad: 1.0, enfoque: 'escala' },
  CONSOLIDADO: { dificultad: 0.8, enfoque: 'optimizacion' }
}

// ============================================================================
// MOTOR DE DECISIÓN
// ============================================================================

export class MotorDecisionV2 {

  /**
   * Genera diagnóstico consultivo completo
   */
  static diagnosticar(input: InputConsultivo): DiagnosticoConsultivo {

    // 1. Obtener datos de referencia
    const benchmark = getBenchmarkIndustria(input.industria)
    const cpc_industria = CPC_CALIBRADO_CHILE[input.industria]?.cpc_promedio || 300

    // 2. Calcular métricas de viabilidad
    const ratio_ticket_cpc = input.ticket_promedio / cpc_industria
    const capacidad_absorcion = this.calcularCapacidadAbsorcion(input)
    const viabilidad_search = this.evaluarViabilidadSearch(input, cpc_industria)

    // 3. Detectar alertas críticas
    const alertas_criticas = this.detectarAlertasCriticas(input, cpc_industria)

    // 4. Determinar plataforma principal
    const { plataforma, justificacion } = this.determinarPlataformaPrincipal(input, cpc_industria, benchmark)

    // 5. Determinar tipo de campaña
    const { tipo_campana, justificacion_campana } = this.determinarTipoCampana(input, plataforma)

    // 6. Calcular distribución óptima
    const distribucion = this.calcularDistribucionOptima(input, plataforma, cpc_industria)

    // 7. Calcular presupuestos sugeridos
    const presupuestos = this.calcularPresupuestosSugeridos(input, cpc_industria)

    // 8. Generar advertencias contextuales
    const advertencias = this.generarAdvertencias(input, cpc_industria, capacidad_absorcion)

    // 9. Calcular score de viabilidad
    const score_viabilidad = this.calcularScoreViabilidad(input, alertas_criticas, ratio_ticket_cpc)

    // 10. Generar diagnóstico principal
    const diagnostico_principal = this.generarDiagnosticoPrincipal(input, score_viabilidad, plataforma)

    // 11. Determinar siguiente paso
    const siguiente_paso = this.determinarSiguientePaso(input, score_viabilidad, alertas_criticas)

    return {
      viable: score_viabilidad >= 40 && alertas_criticas.length === 0,
      score_viabilidad,
      diagnostico_principal,
      alertas_criticas,
      plataforma_recomendada: plataforma,
      justificacion_plataforma: justificacion,
      tipo_campana_recomendado: tipo_campana,
      justificacion_campana,
      presupuesto_sugerido: presupuestos,
      distribucion_recomendada: distribucion,
      advertencias,
      siguiente_paso
    }
  }

  // ============================================================================
  // MÉTODOS DE ANÁLISIS
  // ============================================================================

  /**
   * Calcula capacidad del negocio para absorber leads/ventas adicionales
   */
  private static calcularCapacidadAbsorcion(input: InputConsultivo): number {
    // Si vende 100 al mes y quiere crecer, ¿cuánto puede crecer?
    const ventas_actuales = input.ventas_actuales_mes || 1

    // Factor según etapa
    const factor_etapa = {
      STARTUP: 5.0,      // Puede crecer 5x (está empezando)
      CRECIMIENTO: 2.0,  // Puede duplicar
      CONSOLIDADO: 1.3   // Puede crecer 30%
    }

    const capacidad_maxima = ventas_actuales * factor_etapa[input.etapa_negocio]
    return Math.round(capacidad_maxima)
  }

  /**
   * Evalúa si Google Search es viable para este negocio
   */
  private static evaluarViabilidadSearch(input: InputConsultivo, cpc: number): {
    viable: boolean
    razon: string
  } {
    const ratio = input.ticket_promedio / cpc

    // Regla: necesitas al menos 15x el CPC en ticket para que Search sea rentable
    if (ratio < RATIO_TICKET_CPC_MINIMO) {
      return {
        viable: false,
        razon: `Tu ticket ($${input.ticket_promedio.toLocaleString()}) es muy bajo vs el CPC ($${cpc.toLocaleString()}). Ratio: ${ratio.toFixed(1)}x (mínimo: ${RATIO_TICKET_CPC_MINIMO}x)`
      }
    }

    // Regla: presupuesto mínimo para Search
    if (input.presupuesto_mensual < PRESUPUESTO_MINIMO.GOOGLE_SEARCH) {
      return {
        viable: false,
        razon: `Presupuesto insuficiente para Google Search. Mínimo: $${PRESUPUESTO_MINIMO.GOOGLE_SEARCH.toLocaleString()}`
      }
    }

    return { viable: true, razon: 'Google Search es viable para tu negocio' }
  }

  /**
   * Detecta condiciones que hacen el proyecto inviable o muy riesgoso
   */
  private static detectarAlertasCriticas(input: InputConsultivo, cpc: number): string[] {
    const alertas: string[] = []

    // Alerta: Margen insuficiente
    if (input.margen_bruto < 20) {
      alertas.push(`Margen bruto muy bajo (${input.margen_bruto}%). Difícil lograr rentabilidad en paid media.`)
    }

    // Alerta: Ticket vs CPC inviable
    const ratio = input.ticket_promedio / cpc
    if (ratio < 8) {
      alertas.push(`Ratio ticket/CPC crítico (${ratio.toFixed(1)}x). El costo de adquisición superará tu margen.`)
    }

    // NUEVO: Alerta ROAS proyectado < 1x (no viable económicamente)
    // ROAS = (Conversiones × Ticket × Margen) / Presupuesto
    // Conversiones = (Presupuesto / CPC) × CVR
    const clicks_estimados = input.presupuesto_mensual / cpc
    const conversiones_estimadas = clicks_estimados * CVR_PROMEDIO
    const revenue_estimado = conversiones_estimadas * input.ticket_promedio
    const profit_estimado = revenue_estimado * (input.margen_bruto / 100)
    const roas_estimado = revenue_estimado / input.presupuesto_mensual

    if (roas_estimado < 1) {
      alertas.push(`ROAS proyectado ${roas_estimado.toFixed(2)}x. Con tu ticket ($${input.ticket_promedio.toLocaleString()}) y CPC ($${cpc.toLocaleString()}), perderías dinero. Necesitas ticket mínimo $${Math.round(cpc / CVR_PROMEDIO).toLocaleString()} o usar Meta Ads.`)
    } else if (profit_estimado < input.presupuesto_mensual) {
      alertas.push(`Rentabilidad negativa: el profit bruto ($${Math.round(profit_estimado).toLocaleString()}) no cubre la inversión ($${input.presupuesto_mensual.toLocaleString()}). Revisa margen o ticket.`)
    }

    // Alerta: Presupuesto muy bajo para la industria
    const presupuesto_minimo_industria = cpc * 100 // Al menos 100 clicks
    if (input.presupuesto_mensual < presupuesto_minimo_industria) {
      alertas.push(`Presupuesto insuficiente para ${input.industria}. Necesitas mínimo $${presupuesto_minimo_industria.toLocaleString()} para datos significativos.`)
    }

    // Alerta: B2B sin equipo de ventas
    if (input.tipo_cliente === 'B2B' && !input.tiene_equipo_ventas && input.objetivo_marketing === 'LEADS') {
      alertas.push('Generar leads B2B sin equipo de ventas resulta en leads desperdiciados.')
    }

    return alertas
  }

  /**
   * Determina la plataforma principal basándose en el contexto
   */
  private static determinarPlataformaPrincipal(
    input: InputConsultivo,
    cpc: number,
    benchmark: any
  ): { plataforma: 'GOOGLE' | 'META' | 'LINKEDIN' | 'MIXTO', justificacion: string } {

    const ratio_ticket_cpc = input.ticket_promedio / cpc

    // REGLA 1: B2B + ticket alto → LinkedIn primero
    if (input.tipo_cliente === 'B2B' && input.ticket_promedio > 1000000) {
      return {
        plataforma: 'LINKEDIN',
        justificacion: `Con ticket de $${(input.ticket_promedio/1000000).toFixed(1)}M y cliente B2B, LinkedIn ofrece mejor segmentación de decisores. El CPL más alto se compensa con calidad.`
      }
    }

    // REGLA 2: Objetivo Awareness → Meta/YouTube
    if (input.objetivo_marketing === 'AWARENESS') {
      return {
        plataforma: 'META',
        justificacion: 'Para awareness, Meta Ads (Instagram/Facebook) ofrece mejor costo por impresión y engagement. Google Search no es ideal para awareness.'
      }
    }

    // REGLA 3: Ticket bajo → Meta (antes de evaluar Google)
    // Si ticket < CPC × 10, Google Search no es viable económicamente
    if (ratio_ticket_cpc < RATIO_TICKET_CPC_GOOGLE_VIABLE) {
      return {
        plataforma: 'META',
        justificacion: `Tu ticket ($${input.ticket_promedio.toLocaleString()}) es muy bajo para Google Search (CPC $${cpc.toLocaleString()}, ratio ${ratio_ticket_cpc.toFixed(1)}x). Meta Ads tiene CPCs 50-70% más bajos y mejor ROAS para tickets bajos.`
      }
    }

    // REGLA 3b: Ticket medio-bajo + B2C → Meta preferible
    if (ratio_ticket_cpc < RATIO_TICKET_CPC_MINIMO && input.tipo_cliente === 'B2C') {
      return {
        plataforma: 'META',
        justificacion: `Tu ticket ($${input.ticket_promedio.toLocaleString()}) está en zona límite para Google. Meta Ads ofrece mejor relación costo/conversión para B2C con tickets medios.`
      }
    }

    // REGLA 4: E-commerce con catálogo + ticket viable → Google Shopping
    if (input.tiene_ecommerce && input.objetivo_marketing === 'VENTAS_DIRECTAS' && ratio_ticket_cpc >= RATIO_TICKET_CPC_GOOGLE_VIABLE) {
      return {
        plataforma: 'GOOGLE',
        justificacion: 'E-commerce con objetivo ventas y ticket viable: Google Shopping + Search capturan intención de compra activa. Meta como complemento para remarketing.'
      }
    }

    // REGLA 4b: E-commerce con ticket bajo → Meta con catálogo
    if (input.tiene_ecommerce && input.objetivo_marketing === 'VENTAS_DIRECTAS') {
      return {
        plataforma: 'META',
        justificacion: 'E-commerce con ticket bajo: Meta Catalog Ads son más rentables que Google Shopping. Usa Advantage+ Shopping para maximizar ROAS.'
      }
    }

    // REGLA 5: B2B + ciclo largo → Mix Google + LinkedIn
    if (input.tipo_cliente === 'B2B' && (input.ciclo_venta_dias || 30) > 30) {
      return {
        plataforma: 'MIXTO',
        justificacion: 'Ciclo de venta largo B2B: combinar Google Search (captura demanda) con LinkedIn (nurturing) maximiza conversión.'
      }
    }

    // REGLA 6: Intención alta + presupuesto suficiente + ticket viable → Google
    if (input.objetivo_marketing === 'LEADS' &&
        input.presupuesto_mensual >= PRESUPUESTO_MINIMO.GOOGLE_SEARCH &&
        ratio_ticket_cpc >= RATIO_TICKET_CPC_GOOGLE_VIABLE) {
      return {
        plataforma: 'GOOGLE',
        justificacion: 'Objetivo leads con presupuesto adecuado y ticket viable: Google Search captura demanda activa con mejor tasa de conversión que Meta.'
      }
    }

    // DEFAULT: Meta como opción más flexible
    return {
      plataforma: 'META',
      justificacion: 'Meta Ads ofrece flexibilidad y CPCs accesibles. Ideal para probar antes de escalar a Google.'
    }
  }

  /**
   * Determina el tipo de campaña recomendado
   */
  private static determinarTipoCampana(
    input: InputConsultivo,
    plataforma: 'GOOGLE' | 'META' | 'LINKEDIN' | 'MIXTO'
  ): { tipo_campana: string, justificacion_campana: string } {

    // Por etapa de negocio
    if (input.etapa_negocio === 'STARTUP') {
      return {
        tipo_campana: 'Validación de mensaje',
        justificacion_campana: 'En etapa startup, prioriza validar tu propuesta de valor antes de escalar. Campañas pequeñas A/B testing.'
      }
    }

    // Por objetivo
    switch (input.objetivo_marketing) {
      case 'AWARENESS':
        return {
          tipo_campana: plataforma === 'GOOGLE' ? 'YouTube + Display' : 'Video + Reach',
          justificacion_campana: 'Awareness requiere formatos visuales y alto alcance. Video es el formato más efectivo.'
        }

      case 'LEADS':
        if (plataforma === 'LINKEDIN') {
          return {
            tipo_campana: 'Lead Gen Forms + Sponsored Content',
            justificacion_campana: 'LinkedIn Lead Gen Forms tienen 2-3x mejor conversión que landing pages para B2B.'
          }
        }
        if (plataforma === 'META') {
          return {
            tipo_campana: 'Lead Ads + Lookalike',
            justificacion_campana: 'Lead Ads de Meta reducen fricción. Combinar con Lookalike de clientes actuales.'
          }
        }
        return {
          tipo_campana: 'Search + Lead Form Extensions',
          justificacion_campana: 'Google Search captura intención activa. Lead Form Extensions aumentan conversión.'
        }

      case 'VENTAS_DIRECTAS':
        if (input.tiene_ecommerce) {
          return {
            tipo_campana: 'Shopping + Performance Max',
            justificacion_campana: 'Para e-commerce, Shopping muestra productos directamente. Performance Max optimiza automáticamente.'
          }
        }
        return {
          tipo_campana: 'Search Transaccional + Remarketing',
          justificacion_campana: 'Keywords transaccionales (comprar, precio, cotizar) + remarketing a visitantes del sitio.'
        }
    }

    return {
      tipo_campana: 'Conversión',
      justificacion_campana: 'Campaña enfocada en conversiones medibles.'
    }
  }

  /**
   * Calcula distribución óptima del presupuesto
   */
  private static calcularDistribucionOptima(
    input: InputConsultivo,
    plataforma_principal: 'GOOGLE' | 'META' | 'LINKEDIN' | 'MIXTO',
    cpc: number
  ): { plataforma: string, porcentaje: number, tipo_campana: string, justificacion: string }[] {

    const distribucion: { plataforma: string, porcentaje: number, tipo_campana: string, justificacion: string }[] = []

    // Presupuesto bajo: concentrar en una plataforma
    if (input.presupuesto_mensual < 1000000) {
      if (plataforma_principal === 'GOOGLE') {
        distribucion.push({
          plataforma: 'Google Search',
          porcentaje: 100,
          tipo_campana: 'Search Brand + Generic',
          justificacion: 'Presupuesto limitado: concentrar en Search para máximo ROI'
        })
      } else if (plataforma_principal === 'META') {
        distribucion.push({
          plataforma: 'Meta Ads',
          porcentaje: 100,
          tipo_campana: 'Conversión + Lookalike',
          justificacion: 'Presupuesto limitado: Meta ofrece mejor alcance por peso'
        })
      } else {
        distribucion.push({
          plataforma: 'LinkedIn',
          porcentaje: 100,
          tipo_campana: 'Lead Gen Forms',
          justificacion: 'B2B con presupuesto limitado: LinkedIn aunque caro, mejor calidad'
        })
      }
      return distribucion
    }

    // Presupuesto medio-alto: distribuir estratégicamente
    switch (plataforma_principal) {
      case 'GOOGLE':
        distribucion.push({
          plataforma: 'Google Search',
          porcentaje: 60,
          tipo_campana: 'Search Brand + Generic',
          justificacion: 'Captura demanda activa con alta intención'
        })
        distribucion.push({
          plataforma: 'Meta Ads',
          porcentaje: 25,
          tipo_campana: 'Remarketing + Lookalike',
          justificacion: 'Remarketing a visitantes + expansión con Lookalike'
        })
        distribucion.push({
          plataforma: 'Google Display',
          porcentaje: 15,
          tipo_campana: 'Remarketing',
          justificacion: 'Refuerzo de marca a visitantes'
        })
        break

      case 'META':
        distribucion.push({
          plataforma: 'Meta Ads',
          porcentaje: 70,
          tipo_campana: 'Conversión + Video',
          justificacion: 'Plataforma principal para alcance y conversión'
        })
        distribucion.push({
          plataforma: 'Google Search',
          porcentaje: 30,
          tipo_campana: 'Search Brand',
          justificacion: 'Capturar búsquedas de marca generadas por Meta'
        })
        break

      case 'LINKEDIN':
        distribucion.push({
          plataforma: 'LinkedIn',
          porcentaje: 50,
          tipo_campana: 'Lead Gen + Sponsored Content',
          justificacion: 'Alcanzar decisores B2B directamente'
        })
        distribucion.push({
          plataforma: 'Google Search',
          porcentaje: 35,
          tipo_campana: 'Search B2B Keywords',
          justificacion: 'Capturar búsquedas activas de soluciones B2B'
        })
        distribucion.push({
          plataforma: 'Meta Ads',
          porcentaje: 15,
          tipo_campana: 'Remarketing',
          justificacion: 'Refuerzo a visitantes del sitio'
        })
        break

      case 'MIXTO':
        distribucion.push({
          plataforma: 'Google Search',
          porcentaje: 40,
          tipo_campana: 'Search Transaccional',
          justificacion: 'Captura demanda activa'
        })
        distribucion.push({
          plataforma: 'Meta Ads',
          porcentaje: 35,
          tipo_campana: 'Conversión + Video',
          justificacion: 'Generación de demanda y awareness'
        })
        distribucion.push({
          plataforma: 'LinkedIn',
          porcentaje: 25,
          tipo_campana: 'Lead Gen Forms',
          justificacion: 'Nurturing B2B de alto valor'
        })
        break
    }

    return distribucion
  }

  /**
   * Calcula presupuestos sugeridos
   */
  private static calcularPresupuestosSugeridos(
    input: InputConsultivo,
    cpc: number
  ): { minimo_viable: number, optimo: number, maximo_eficiente: number } {

    // Mínimo: suficiente para 100 clicks (datos significativos)
    const minimo_viable = Math.max(cpc * 100, PRESUPUESTO_MINIMO.META_ADS)

    // Óptimo: basado en objetivos de conversión
    // Si quiere X leads y CVR es ~3%, necesita X/0.03 clicks × CPC
    const leads_objetivo = input.etapa_negocio === 'STARTUP' ? 20 :
                          input.etapa_negocio === 'CRECIMIENTO' ? 50 : 100
    const cvr_estimado = 0.03
    const clicks_necesarios = leads_objetivo / cvr_estimado
    const optimo = Math.round(clicks_necesarios * cpc)

    // Máximo eficiente: punto de rendimientos decrecientes
    // Generalmente 3x el óptimo para industrias competitivas
    const factor_competencia = (input.competencia_percibida || 5) / 5
    const maximo_eficiente = Math.round(optimo * 2 * factor_competencia)

    return {
      minimo_viable: Math.round(minimo_viable / 100000) * 100000, // Redondear a 100k
      optimo: Math.round(optimo / 100000) * 100000,
      maximo_eficiente: Math.round(maximo_eficiente / 100000) * 100000
    }
  }

  /**
   * Genera advertencias contextuales
   */
  private static generarAdvertencias(
    input: InputConsultivo,
    cpc: number,
    capacidad_absorcion: number
  ): { tipo: 'CRITICA' | 'IMPORTANTE' | 'SUGERENCIA', mensaje: string, accion_recomendada: string }[] {

    const advertencias: { tipo: 'CRITICA' | 'IMPORTANTE' | 'SUGERENCIA', mensaje: string, accion_recomendada: string }[] = []

    // Advertencia: Sin assets de contenido
    if (input.nivel_assets === 'SIN_CONTENIDO') {
      advertencias.push({
        tipo: 'IMPORTANTE',
        mensaje: 'Sin contenido visual, tus campañas tendrán menor rendimiento',
        accion_recomendada: 'Invertir en al menos 3-5 piezas visuales antes de lanzar. Meta requiere creativos atractivos.'
      })
    }

    // Advertencia: Capacidad de absorción
    const leads_estimados = Math.round((input.presupuesto_mensual / cpc) * 0.03)
    if (leads_estimados > capacidad_absorcion) {
      advertencias.push({
        tipo: 'IMPORTANTE',
        mensaje: `Podrías generar ${leads_estimados} leads pero tu capacidad actual es ${capacidad_absorcion}`,
        accion_recomendada: 'Asegurar equipo/procesos para manejar volumen antes de escalar presupuesto.'
      })
    }

    // Advertencia: Etapa startup con presupuesto alto
    if (input.etapa_negocio === 'STARTUP' && input.presupuesto_mensual > 2000000) {
      advertencias.push({
        tipo: 'SUGERENCIA',
        mensaje: 'En etapa startup, presupuestos altos pueden quemar capital antes de validar',
        accion_recomendada: 'Empezar con $500k-1M para validar mensaje, luego escalar.'
      })
    }

    // Advertencia: B2B sin LinkedIn
    if (input.tipo_cliente === 'B2B' && input.ticket_promedio > 500000 && input.presupuesto_mensual >= PRESUPUESTO_MINIMO.LINKEDIN) {
      advertencias.push({
        tipo: 'SUGERENCIA',
        mensaje: 'Para B2B de alto ticket, LinkedIn suele tener mejor ROI que Meta',
        accion_recomendada: 'Considerar asignar 30-40% del presupuesto a LinkedIn.'
      })
    }

    // Advertencia: E-commerce sin Shopping
    if (input.tiene_ecommerce && input.objetivo_marketing === 'VENTAS_DIRECTAS') {
      advertencias.push({
        tipo: 'SUGERENCIA',
        mensaje: 'E-commerce sin Google Shopping pierde oportunidades de venta directa',
        accion_recomendada: 'Implementar Google Shopping + feed de productos optimizado.'
      })
    }

    return advertencias
  }

  /**
   * Calcula score de viabilidad del proyecto
   */
  private static calcularScoreViabilidad(
    input: InputConsultivo,
    alertas_criticas: string[],
    ratio_ticket_cpc: number
  ): number {
    let score = 50 // Base

    // Penalizar por alertas críticas
    score -= alertas_criticas.length * 20

    // Bonus por ratio ticket/CPC alto
    if (ratio_ticket_cpc >= 30) score += 20
    else if (ratio_ticket_cpc >= 20) score += 10
    else if (ratio_ticket_cpc < 10) score -= 15

    // Bonus por margen alto
    if (input.margen_bruto >= 50) score += 15
    else if (input.margen_bruto >= 35) score += 5
    else if (input.margen_bruto < 25) score -= 10

    // Bonus por etapa consolidada
    if (input.etapa_negocio === 'CONSOLIDADO') score += 10
    else if (input.etapa_negocio === 'STARTUP') score -= 5

    // Bonus por assets de contenido
    if (input.nivel_assets === 'PRODUCCION') score += 10
    else if (input.nivel_assets === 'SIN_CONTENIDO') score -= 10

    // Bonus por presupuesto adecuado
    if (input.presupuesto_mensual >= 2000000) score += 10
    else if (input.presupuesto_mensual < 500000) score -= 15

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Genera el diagnóstico principal en lenguaje natural
   */
  private static generarDiagnosticoPrincipal(
    input: InputConsultivo,
    score: number,
    plataforma: string
  ): string {

    if (score >= 80) {
      return `Excelente fit para paid media. Tu combinación de ${input.industria} ${input.tipo_cliente} con ticket de $${input.ticket_promedio.toLocaleString()} y margen ${input.margen_bruto}% tiene alto potencial. Recomiendo iniciar con ${plataforma}.`
    }

    if (score >= 60) {
      return `Proyecto viable con optimizaciones. ${input.industria} ${input.tipo_cliente} puede funcionar en paid media, pero hay factores a ajustar. ${plataforma} es tu mejor opción inicial.`
    }

    if (score >= 40) {
      return `Proyecto con riesgos moderados. Antes de invertir fuerte, valida con presupuesto pequeño. Tu ticket o margen limitan el potencial de escala.`
    }

    return `Proyecto de alto riesgo. Los números actuales no favorecen paid media. Considera mejorar margen, ticket o modelo de negocio antes de invertir en ads.`
  }

  /**
   * Determina el siguiente paso recomendado
   */
  private static determinarSiguientePaso(
    input: InputConsultivo,
    score: number,
    alertas: string[]
  ): string {

    if (alertas.length > 0) {
      return `Resolver primero: ${alertas[0]}`
    }

    if (input.nivel_assets === 'SIN_CONTENIDO') {
      return 'Paso 1: Producir 3-5 piezas de contenido visual antes de lanzar campañas.'
    }

    if (input.etapa_negocio === 'STARTUP') {
      return 'Paso 1: Campaña de validación con $500k por 30 días. Medir CPL y calidad de leads.'
    }

    if (score >= 60) {
      return 'Paso 1: Configurar tracking (Pixel + GA4), luego lanzar campaña piloto de 2 semanas.'
    }

    return 'Paso 1: Revisar modelo de negocio. El unit economics actual no soporta paid media rentable.'
  }
}

export default MotorDecisionV2
