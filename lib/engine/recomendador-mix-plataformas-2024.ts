// @ts-nocheck
/**
 * RECOMENDADOR MIX DE PLATAFORMAS 2024
 * Sistema inteligente que recomienda la distribución de presupuesto por plataforma
 * considerando industria, estacionalidad, tipo de cliente y madurez digital
 */

import { BENCHMARKS_INDUSTRIAS_2024, getBenchmarkIndustria } from './benchmarks-2024-verificados'

// Tipos de campaña por plataforma
export interface CampañaPlataforma {
  plataforma: string
  tipos_campanas: string[]
  porcentaje_recomendado: number
  presupuesto_asignado: number
  justificacion: string
  factores_aplicados: {
    industria: number
    estacional: number
    competencia: number
    madurez_digital: number
  }
  metricas_esperadas: {
    cpc_estimado: number
    ctr_estimado: number
    cvr_estimado: number
    conversiones_esperadas: number
  }
}

export interface MixPlataformas {
  plataformas: CampañaPlataforma[]
  total_presupuesto: number
  total_conversiones_esperadas: number
  roas_mix_estimado: number
  justificacion_estrategica: string
  alertas: string[]
  variaciones_estacionales: {
    mes_actual: number
    recomendacion_ajuste: string
  }
}

// Configuración de plataformas por industria
const PLATAFORMAS_CONFIG = {
  // E-commerce: Foco en conversión directa
  ECOMMERCE: {
    'GOOGLE_SEARCH': {
      base: 45,
      tipos: ['Search Brand', 'Search Generic', 'Shopping'],
      cpc_factor: 1.0,
      cvr_factor: 1.2
    },
    'GOOGLE_SHOPPING': {
      base: 25,
      tipos: ['Shopping Campaign', 'Performance Max'],
      cpc_factor: 0.8,
      cvr_factor: 1.4
    },
    'META_ADS': {
      base: 20,
      tipos: ['Conversion', 'Catalog', 'Remarketing'],
      cpc_factor: 0.7,
      cvr_factor: 1.1
    },
    'GOOGLE_DISPLAY': {
      base: 10,
      tipos: ['Remarketing', 'Lookalike'],
      cpc_factor: 0.5,
      cvr_factor: 0.8
    }
  },

  // Inmobiliaria: Foco en leads de calidad
  INMOBILIARIA: {
    'GOOGLE_SEARCH': {
      base: 50,
      tipos: ['Search Brand', 'Search Local', 'Search Generic'],
      cpc_factor: 1.3,
      cvr_factor: 1.5
    },
    'META_ADS': {
      base: 30,
      tipos: ['Lead Generation', 'Lookalike', 'Interest Targeting'],
      cpc_factor: 1.0,
      cvr_factor: 1.3
    },
    'GOOGLE_LOCAL': {
      base: 15,
      tipos: ['Local Service Ads', 'Google My Business'],
      cpc_factor: 1.1,
      cvr_factor: 1.8
    },
    'LINKEDIN': {
      base: 5,
      tipos: ['Sponsored Content', 'Lead Gen Forms'],
      cpc_factor: 2.0,
      cvr_factor: 0.9
    }
  },

  // Fintech: Foco en decisores y confianza
  FINTECH: {
    'GOOGLE_SEARCH': {
      base: 40,
      tipos: ['Search Brand', 'Search Competitor', 'Search Generic'],
      cpc_factor: 1.4,
      cvr_factor: 1.1
    },
    'LINKEDIN': {
      base: 35,
      tipos: ['Sponsored Content', 'Lead Gen Forms', 'Thought Leadership'],
      cpc_factor: 2.2,
      cvr_factor: 1.4
    },
    'META_ADS': {
      base: 15,
      tipos: ['Lookalike', 'Interest Targeting', 'Video'],
      cpc_factor: 1.1,
      cvr_factor: 0.9
    },
    'GOOGLE_DISPLAY': {
      base: 10,
      tipos: ['Remarketing', 'In-Market Audiences'],
      cpc_factor: 0.8,
      cvr_factor: 0.7
    }
  },

  // SaaS/Tech: Foco en demos y trials
  TECNOLOGIA_SAAS: {
    'GOOGLE_SEARCH': {
      base: 35,
      tipos: ['Search Brand', 'Search Competitor', 'Search Generic'],
      cpc_factor: 1.2,
      cvr_factor: 1.3
    },
    'LINKEDIN': {
      base: 40,
      tipos: ['Sponsored Content', 'Lead Gen Forms', 'Event Promotion'],
      cpc_factor: 2.0,
      cvr_factor: 1.5
    },
    'META_ADS': {
      base: 15,
      tipos: ['Lookalike', 'Video', 'Retargeting'],
      cpc_factor: 1.0,
      cvr_factor: 1.1
    },
    'YOUTUBE': {
      base: 10,
      tipos: ['Product Demos', 'Thought Leadership', 'Tutorial'],
      cpc_factor: 0.9,
      cvr_factor: 0.8
    }
  },

  // Configuraciones para otras industrias
  AUTOMOTRIZ: {
    'GOOGLE_SEARCH': { base: 45, tipos: ['Search Brand', 'Search Model'], cpc_factor: 1.5, cvr_factor: 1.2 },
    'META_ADS': { base: 25, tipos: ['Video', 'Carousel', 'Lead Generation'], cpc_factor: 1.2, cvr_factor: 1.0 },
    'YOUTUBE': { base: 20, tipos: ['Video Test Drive', 'Brand Awareness'], cpc_factor: 1.0, cvr_factor: 0.9 },
    'GOOGLE_DISPLAY': { base: 10, tipos: ['Remarketing', 'In-Market Auto'], cpc_factor: 0.7, cvr_factor: 0.7 }
  },

  SALUD_MEDICINA: {
    'GOOGLE_SEARCH': { base: 60, tipos: ['Search Local', 'Search Condition'], cpc_factor: 2.0, cvr_factor: 1.4 },
    'GOOGLE_LOCAL': { base: 25, tipos: ['Local Service Ads'], cpc_factor: 1.8, cvr_factor: 1.8 },
    'META_ADS': { base: 15, tipos: ['Local Awareness', 'Lead Generation'], cpc_factor: 1.3, cvr_factor: 1.1 }
  },

  EDUCACION: {
    'GOOGLE_SEARCH': { base: 40, tipos: ['Search Course', 'Search Career'], cpc_factor: 1.8, cvr_factor: 1.3 },
    'META_ADS': { base: 30, tipos: ['Lead Generation', 'Video', 'Lookalike'], cpc_factor: 1.1, cvr_factor: 1.2 },
    'LINKEDIN': { base: 20, tipos: ['Lead Gen Forms', 'Professional Courses'], cpc_factor: 1.9, cvr_factor: 1.4 },
    'YOUTUBE': { base: 10, tipos: ['Course Previews', 'Success Stories'], cpc_factor: 0.8, cvr_factor: 0.9 }
  }
}

// Factores estacionales por industria
const FACTORES_ESTACIONALES = {
  ECOMMERCE: {
    Q1: 0.8, Q2: 1.0, Q3: 0.9, Q4: 1.5,
    picos: ['Black Friday', 'Cyber Monday', 'Navidad'],
    ajustes: { 11: 1.4, 12: 1.8 }
  },
  INMOBILIARIA: {
    Q1: 0.9, Q2: 1.2, Q3: 1.0, Q4: 1.1,
    picos: ['Marzo-Mayo', 'Septiembre-Noviembre'],
    ajustes: { 4: 1.2, 5: 1.15, 10: 1.25, 11: 1.3 }
  },
  FINTECH: {
    Q1: 1.1, Q2: 1.0, Q3: 0.9, Q4: 1.2,
    picos: ['Enero (planificación)', 'Diciembre (cierre)'],
    ajustes: { 1: 1.2, 12: 1.3 }
  },
  TECNOLOGIA_SAAS: {
    Q1: 1.2, Q2: 1.0, Q3: 0.8, Q4: 1.3,
    picos: ['Q1 (budgets)', 'Q4 (EOY purchases)'],
    ajustes: { 1: 1.3, 2: 1.2, 11: 1.2, 12: 1.4 }
  }
}

export class RecomendadorMixPlataformas2024 {

  static generarMixOptimo(input: {
    industria: string
    presupuesto_mensual: number
    tipo_cliente: 'B2B' | 'B2C' | 'MIXTO'
    competencia_nivel: number // 1-10
    madurez_digital: 'tradicional' | 'transicion' | 'digital_first'
    region: string
    mes_actual?: number
  }): MixPlataformas {

    const benchmark = getBenchmarkIndustria(input.industria)
    if (!benchmark) {
      throw new Error(`Industria ${input.industria} no soportada`)
    }

    // Obtener configuración base de plataformas
    const config_industria = PLATAFORMAS_CONFIG[input.industria] || PLATAFORMAS_CONFIG.ECOMMERCE
    const factores_estacionales = FACTORES_ESTACIONALES[input.industria] || FACTORES_ESTACIONALES.ECOMMERCE

    // Calcular factores de ajuste
    const factores = {
      competencia: this.calcularFactorCompetencia(input.competencia_nivel),
      madurez_digital: this.calcularFactorMadurezDigital(input.madurez_digital),
      tipo_cliente: this.calcularFactorTipoCliente(input.tipo_cliente),
      estacional: this.calcularFactorEstacional(input.mes_actual || new Date().getMonth() + 1, factores_estacionales)
    }

    // Generar mix de plataformas
    const plataformas = this.calcularDistribucionPlataformas(
      config_industria,
      input.presupuesto_mensual,
      factores,
      benchmark,
      input
    )

    // Calcular métricas totales
    const total_conversiones = plataformas.reduce((sum, p) => sum + p.metricas_esperadas.conversiones_esperadas, 0)
    const revenue_estimado = total_conversiones * 100000 // Placeholder ticket
    const roas_mix = revenue_estimado / input.presupuesto_mensual

    // Generar alertas y recomendaciones
    const alertas = this.generarAlertas(plataformas, input, factores)
    const justificacion = this.generarJustificacionEstrategica(input.industria, input.tipo_cliente, factores)

    return {
      plataformas,
      total_presupuesto: input.presupuesto_mensual,
      total_conversiones_esperadas: Math.round(total_conversiones),
      roas_mix_estimado: Math.round(roas_mix * 100) / 100,
      justificacion_estrategica: justificacion,
      alertas,
      variaciones_estacionales: {
        mes_actual: input.mes_actual || new Date().getMonth() + 1,
        recomendacion_ajuste: this.generarRecomendacionEstacional(
          input.industria,
          input.mes_actual || new Date().getMonth() + 1
        )
      }
    }
  }

  private static calcularFactorCompetencia(nivel: number): number {
    // Competencia alta = necesitas más presupuesto en Google Search
    if (nivel >= 8) return 1.3  // Alta competencia
    if (nivel >= 6) return 1.1  // Media-alta
    if (nivel >= 4) return 1.0  // Media
    return 0.9                  // Baja competencia
  }

  private static calcularFactorMadurezDigital(madurez: string): number {
    switch (madurez) {
      case 'tradicional': return 0.8  // Menos presupuesto en canales avanzados
      case 'transicion': return 1.0   // Balance normal
      case 'digital_first': return 1.2 // Más agresivo en digital
      default: return 1.0
    }
  }

  private static calcularFactorTipoCliente(tipo: string): number {
    switch (tipo) {
      case 'B2B': return 1.2  // Más foco en LinkedIn y Search
      case 'B2C': return 1.0  // Balance normal
      case 'MIXTO': return 1.1 // Ligero sesgo B2B
      default: return 1.0
    }
  }

  private static calcularFactorEstacional(mes: number, factores_industria: any): number {
    return factores_industria.ajustes?.[mes] || 1.0
  }

  private static calcularDistribucionPlataformas(
    config: any,
    presupuesto: number,
    factores: any,
    benchmark: any,
    input: any
  ): CampañaPlataforma[] {

    const plataformas: CampañaPlataforma[] = []
    let total_porcentaje = 0

    // Calcular porcentajes ajustados
    Object.keys(config).forEach(plataforma => {
      const config_plataforma = config[plataforma]
      let porcentaje_ajustado = config_plataforma.base

      // Aplicar ajustes según factores
      if (plataforma === 'GOOGLE_SEARCH' && factores.competencia > 1.1) {
        porcentaje_ajustado *= 1.2 // Más presupuesto en Search si hay competencia
      }

      if (plataforma === 'LINKEDIN' && input.tipo_cliente === 'B2B') {
        porcentaje_ajustado *= 1.3 // Más LinkedIn para B2B
      }

      if (plataforma === 'META_ADS' && input.tipo_cliente === 'B2C') {
        porcentaje_ajustado *= 1.2 // Más Meta para B2C
      }

      // Aplicar factor de madurez digital
      if (['YOUTUBE', 'GOOGLE_DISPLAY'].includes(plataforma)) {
        porcentaje_ajustado *= factores.madurez_digital
      }

      total_porcentaje += porcentaje_ajustado

      // Crear objeto plataforma
      const presupuesto_asignado = Math.round((presupuesto * porcentaje_ajustado) / 100)
      const cpc_estimado = benchmark.google_search.cpc_base * config_plataforma.cpc_factor
      const conversiones_esperadas = Math.round(presupuesto_asignado / cpc_estimado * 0.05) // 5% CVR estimado

      plataformas.push({
        plataforma,
        tipos_campanas: config_plataforma.tipos,
        porcentaje_recomendado: Math.round(porcentaje_ajustado),
        presupuesto_asignado,
        justificacion: this.generarJustificacionPlataforma(plataforma, input.industria, input.tipo_cliente),
        factores_aplicados: {
          industria: 1.0,
          estacional: factores.estacional,
          competencia: factores.competencia,
          madurez_digital: factores.madurez_digital
        },
        metricas_esperadas: {
          cpc_estimado: Math.round(cpc_estimado),
          ctr_estimado: benchmark.google_search.ctr_base * config_plataforma.cvr_factor,
          cvr_estimado: benchmark.google_search.cvr_web * config_plataforma.cvr_factor,
          conversiones_esperadas
        }
      })
    })

    // Normalizar porcentajes para que sumen 100%
    plataformas.forEach(p => {
      p.porcentaje_recomendado = Math.round((p.porcentaje_recomendado / total_porcentaje) * 100)
      p.presupuesto_asignado = Math.round((presupuesto * p.porcentaje_recomendado) / 100)
    })

    return plataformas.sort((a, b) => b.porcentaje_recomendado - a.porcentaje_recomendado)
  }

  private static generarJustificacionPlataforma(plataforma: string, industria: string, tipo_cliente: string): string {
    const justificaciones = {
      'GOOGLE_SEARCH': `Alta intención de compra para ${industria}. ROI comprobado.`,
      'META_ADS': tipo_cliente === 'B2C' ? 'Segmentación demográfica precisa para consumidores' : 'Awareness y remarketing B2B efectivo',
      'LINKEDIN': 'Esencial para decisores B2B y profesionales',
      'GOOGLE_SHOPPING': 'Crítico para productos visibles y comparación',
      'YOUTUBE': 'Video marketing para productos complejos',
      'GOOGLE_LOCAL': 'Fundamental para negocios con presencia local',
      'GOOGLE_DISPLAY': 'Remarketing y awareness a escala'
    }
    return justificaciones[plataforma] || 'Plataforma recomendada para esta industria'
  }

  private static generarJustificacionEstrategica(industria: string, tipo_cliente: string, factores: any): string {
    let justificacion = `Estrategia optimizada para ${industria} ${tipo_cliente}. `

    if (factores.competencia > 1.1) {
      justificacion += "Competencia alta: mayor inversión en Search para mantener visibilidad. "
    }

    if (factores.madurez_digital > 1.1) {
      justificacion += "Mercado digitalmente maduro: aprovechamos canales avanzados. "
    }

    if (factores.estacional > 1.1) {
      justificacion += "Temporada alta: aumentamos presupuesto en canales de alto ROI. "
    }

    return justificacion.trim()
  }

  private static generarAlertas(plataformas: CampañaPlataforma[], input: any, factores: any): string[] {
    const alertas: string[] = []

    // Alerta presupuesto bajo
    if (input.presupuesto_mensual < 1000000) {
      alertas.push('⚠️ Presupuesto bajo: Concentrar en 2-3 plataformas principales')
    }

    // Alerta competencia alta
    if (factores.competencia > 1.2) {
      alertas.push('🚨 Competencia muy alta: Considerar long-tail keywords y nichos')
    }

    // Alerta diversificación
    const plataforma_principal = plataformas[0]
    if (plataforma_principal.porcentaje_recomendado > 60) {
      alertas.push('📊 Alta concentración: Evaluar diversificar riesgo en otras plataformas')
    }

    return alertas
  }

  private static generarRecomendacionEstacional(industria: string, mes: number): string {
    const recomendaciones = {
      ECOMMERCE: {
        11: 'Black Friday: Incrementar Shopping y Display +40%',
        12: 'Navidad: Máximo presupuesto, foco en urgencia',
        1: 'Post-navidad: Reducir presupuesto 30%, foco en ofertas'
      },
      INMOBILIARIA: {
        3: 'Primavera: Aumentar Local Ads +25%',
        4: 'Peak temporada: Máximo presupuesto Search',
        10: 'Pre-verano: Incrementar Display para proyectos futuros'
      },
      FINTECH: {
        1: 'Planificación anual: Incrementar LinkedIn +30%',
        12: 'Cierre año: Foco en decisiones rápidas'
      }
    }

    return recomendaciones[industria]?.[mes] || 'Mantener distribución estándar'
  }
}