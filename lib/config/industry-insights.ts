/**
 * INSIGHTS POR INDUSTRIA - M&P 2025
 *
 * Datos específicos, tips y benchmarks para cada industria
 * Usado por el Predictor v2 para dar recomendaciones contextuales
 */

export interface IndustryInsight {
  nombre: string
  emoji: string
  benchmark_roas: { min: number; promedio: number; top: number }
  benchmark_cpl: { min: number; promedio: number; max: number }
  tips: string[]
  errores_comunes: string[]
  mejor_plataforma: 'GOOGLE' | 'META' | 'LINKEDIN' | 'MIXTO'
  estacionalidad: string
  ciclo_venta_tipico: string
  kpis_clave: string[]
}

export const INDUSTRY_INSIGHTS: Record<string, IndustryInsight> = {
  ECOMMERCE: {
    nombre: 'E-commerce',
    emoji: '🛒',
    benchmark_roas: { min: 2.5, promedio: 4.2, top: 8.0 },
    benchmark_cpl: { min: 1500, promedio: 4500, max: 12000 },
    tips: [
      'Google Shopping es obligatorio - representa 60% de las ventas paid',
      'Remarketing dinámico recupera 15-25% de carritos abandonados',
      'Performance Max funciona mejor con +100 productos en feed',
      'Meta Catalog Ads complementa muy bien para discovery'
    ],
    errores_comunes: [
      'No tener feed de productos optimizado',
      'Ignorar el remarketing de carrito abandonado',
      'Pujar igual en móvil y desktop (comportamiento muy diferente)',
      'No segmentar por margen de producto'
    ],
    mejor_plataforma: 'GOOGLE',
    estacionalidad: 'Picos en Nov-Dic (Cyber, Black Friday, Navidad). Bajo en Ene-Feb.',
    ciclo_venta_tipico: '1-7 días',
    kpis_clave: ['ROAS', 'CAC', 'Ticket Promedio', 'Tasa Abandono']
  },

  TECNOLOGIA_SAAS: {
    nombre: 'Tecnología / SaaS',
    emoji: '💻',
    benchmark_roas: { min: 3.0, promedio: 6.0, top: 15.0 },
    benchmark_cpl: { min: 15000, promedio: 45000, max: 120000 },
    tips: [
      'LinkedIn es clave para decisores B2B - CPL alto pero mejor calidad',
      'Content marketing + retargeting tiene mejor ROI que cold ads',
      'Demos y trials gratuitos convierten 3x más que "Contáctanos"',
      'Case studies en landing pages aumentan conversión 40%'
    ],
    errores_comunes: [
      'Apuntar solo a keywords genéricas (muy caras)',
      'No tener nurturing de leads (ciclo largo)',
      'Landing pages sin social proof',
      'No trackear eventos de producto (signups, activación)'
    ],
    mejor_plataforma: 'LINKEDIN',
    estacionalidad: 'Q1 y Q4 son mejores (presupuestos nuevos y cierre de año)',
    ciclo_venta_tipico: '30-90 días',
    kpis_clave: ['CPL', 'SQL Rate', 'Trial-to-Paid', 'CAC Payback']
  },

  FINTECH: {
    nombre: 'Fintech',
    emoji: '💳',
    benchmark_roas: { min: 2.0, promedio: 4.5, top: 10.0 },
    benchmark_cpl: { min: 25000, promedio: 65000, max: 150000 },
    tips: [
      'Trust signals son críticos - certificaciones, logos de bancos',
      'Video explicativo aumenta conversión 80% en productos complejos',
      'Segmentar por intent: "comparar" vs "contratar" vs "qué es"',
      'Remarketing largo (60-90 días) por ciclo de decisión'
    ],
    errores_comunes: [
      'No cumplir normativas de publicidad financiera',
      'Landing pages sin información de seguridad/regulación',
      'Promesas de rentabilidad sin disclaimers',
      'No tener chatbot/soporte visible'
    ],
    mejor_plataforma: 'GOOGLE',
    estacionalidad: 'Enero (planificación financiera) y Sept-Nov (ahorro fin de año)',
    ciclo_venta_tipico: '14-60 días',
    kpis_clave: ['CPL', 'Costo por Cuenta Aperturada', 'LTV', 'Churn']
  },

  INMOBILIARIA: {
    nombre: 'Inmobiliaria',
    emoji: '🏠',
    benchmark_roas: { min: 5.0, promedio: 15.0, top: 40.0 },
    benchmark_cpl: { min: 8000, promedio: 25000, max: 80000 },
    tips: [
      'Google Local y Maps son fundamentales - 40% de búsquedas son locales',
      'Tours virtuales aumentan engagement 300%',
      'Segmentar por etapa: arriendo vs compra vs inversión',
      'WhatsApp Business como canal principal de contacto'
    ],
    errores_comunes: [
      'No geolocalizar campañas (nacional cuando es local)',
      'Fotos de baja calidad en anuncios',
      'No tener respuesta rápida (<2 horas)',
      'Landing sin información de ubicación y accesos'
    ],
    mejor_plataforma: 'GOOGLE',
    estacionalidad: 'Marzo-Mayo y Sept-Nov son peak. Verano es bajo.',
    ciclo_venta_tipico: '30-180 días',
    kpis_clave: ['CPL', 'Costo por Visita', 'Tasa de Cierre', 'Días en Mercado']
  },

  SALUD_MEDICINA: {
    nombre: 'Salud / Medicina',
    emoji: '🏥',
    benchmark_roas: { min: 4.0, promedio: 8.0, top: 20.0 },
    benchmark_cpl: { min: 5000, promedio: 18000, max: 50000 },
    tips: [
      'Google Local Services es obligatorio para clínicas',
      'Reseñas de Google son el factor #1 de decisión',
      'Contenido educativo genera 60% de los leads orgánicos',
      'Horarios de atención y disponibilidad deben ser visibles'
    ],
    errores_comunes: [
      'No responder reseñas (positivas y negativas)',
      'Publicidad de procedimientos sin certificaciones',
      'No tener agenda online',
      'Ignorar SEO local (ficha de Google My Business)'
    ],
    mejor_plataforma: 'GOOGLE',
    estacionalidad: 'Post-vacaciones (Marzo, Agosto) hay más demanda.',
    ciclo_venta_tipico: '1-14 días',
    kpis_clave: ['CPL', 'Costo por Cita', 'No-Show Rate', 'Lifetime Value Paciente']
  },

  EDUCACION: {
    nombre: 'Educación',
    emoji: '📚',
    benchmark_roas: { min: 3.0, promedio: 6.0, top: 12.0 },
    benchmark_cpl: { min: 8000, promedio: 22000, max: 60000 },
    tips: [
      'Video testimoniales de alumnos convierten 50% más',
      'Webinars gratuitos son el mejor lead magnet',
      'LinkedIn funciona muy bien para educación ejecutiva',
      'Segmentar por motivación: ascenso, cambio carrera, hobby'
    ],
    errores_comunes: [
      'No tener proceso de nurturing (decisión larga)',
      'Landing sin información de empleabilidad/resultados',
      'No ofrecer facilidades de pago',
      'Ignorar a los "investigadores" (padres, empresas)'
    ],
    mejor_plataforma: 'MIXTO',
    estacionalidad: 'Enero-Marzo (matrículas), Julio (segundo semestre)',
    ciclo_venta_tipico: '14-60 días',
    kpis_clave: ['CPL', 'Costo por Matrícula', 'Tasa de Deserción', 'NPS']
  },

  SERVICIOS_LEGALES: {
    nombre: 'Servicios Legales',
    emoji: '⚖️',
    benchmark_roas: { min: 5.0, promedio: 12.0, top: 30.0 },
    benchmark_cpl: { min: 15000, promedio: 40000, max: 100000 },
    tips: [
      'Google Search es rey - la gente busca cuando tiene el problema',
      'Contenido educativo (blog, videos) genera autoridad',
      'Urgencia es clave - respuesta en <1 hora',
      'Casos de éxito y testimoniales son fundamentales'
    ],
    errores_comunes: [
      'No tener respuesta inmediata (leads se enfrían rápido)',
      'Landing pages sin credenciales del abogado',
      'No segmentar por tipo de caso',
      'Publicidad genérica sin especialización'
    ],
    mejor_plataforma: 'GOOGLE',
    estacionalidad: 'Relativamente estable. Peaks post-vacaciones.',
    ciclo_venta_tipico: '1-7 días (urgencia)',
    kpis_clave: ['CPL', 'Costo por Caso', 'Valor Promedio Caso', 'Win Rate']
  },

  AUTOMOTRIZ: {
    nombre: 'Automotriz',
    emoji: '🚗',
    benchmark_roas: { min: 8.0, promedio: 20.0, top: 50.0 },
    benchmark_cpl: { min: 10000, promedio: 35000, max: 90000 },
    tips: [
      'Video es fundamental - test drives virtuales',
      'Segmentar por modelo, no solo marca',
      'Financiamiento es el gancho principal',
      'Remarketing largo (90+ días) por ciclo de decisión'
    ],
    errores_comunes: [
      'No tener stock actualizado en anuncios',
      'Ignorar el journey de investigación (3-6 meses)',
      'No ofrecer cotización online',
      'Landing sin simulador de crédito'
    ],
    mejor_plataforma: 'GOOGLE',
    estacionalidad: 'Marzo y Septiembre (patentes). Diciembre (bonos).',
    ciclo_venta_tipico: '30-180 días',
    kpis_clave: ['CPL', 'Costo por Test Drive', 'Costo por Venta', 'Margen']
  },

  TURISMO: {
    nombre: 'Turismo',
    emoji: '✈️',
    benchmark_roas: { min: 3.0, promedio: 7.0, top: 15.0 },
    benchmark_cpl: { min: 3000, promedio: 12000, max: 35000 },
    tips: [
      'Visual es todo - fotos y videos de alta calidad',
      'Meta Ads funciona muy bien para inspiración',
      'Remarketing con urgencia (pocos cupos, últimos días)',
      'User Generated Content aumenta conversión 25%'
    ],
    errores_comunes: [
      'No segmentar por tipo de viajero (familia, pareja, aventura)',
      'Ignorar la estacionalidad en bidding',
      'No tener precios claros en landing',
      'Fotos genéricas de stock'
    ],
    mejor_plataforma: 'META',
    estacionalidad: 'Peaks en vacaciones: Enero-Feb, Julio, Sept (fiestas patrias)',
    ciclo_venta_tipico: '7-60 días',
    kpis_clave: ['CPL', 'Costo por Reserva', 'Ticket Promedio', 'Anticipación']
  },

  GASTRONOMIA: {
    nombre: 'Gastronomía',
    emoji: '🍽️',
    benchmark_roas: { min: 2.0, promedio: 4.0, top: 8.0 },
    benchmark_cpl: { min: 1500, promedio: 5000, max: 15000 },
    tips: [
      'Google My Business es crítico - 70% busca cerca',
      'Fotos profesionales de platos aumentan CTR 40%',
      'Promociones con urgencia funcionan muy bien',
      'Delivery apps vs canal propio - analizar márgenes'
    ],
    errores_comunes: [
      'No tener ficha de Google actualizada',
      'Ignorar las reseñas',
      'Publicidad nacional cuando es hiperlocal',
      'No trackear pedidos por canal'
    ],
    mejor_plataforma: 'GOOGLE',
    estacionalidad: 'Fines de semana, feriados. Bajo en Enero.',
    ciclo_venta_tipico: '0-3 días',
    kpis_clave: ['Costo por Pedido', 'Ticket Promedio', 'Frecuencia', 'Reseñas']
  },

  MODA_RETAIL: {
    nombre: 'Moda / Retail',
    emoji: '👗',
    benchmark_roas: { min: 2.5, promedio: 5.0, top: 10.0 },
    benchmark_cpl: { min: 2000, promedio: 6000, max: 18000 },
    tips: [
      'Instagram/Meta es la plataforma principal',
      'Influencer marketing tiene mejor ROI que ads tradicionales',
      'Colecciones y lanzamientos generan urgencia',
      'User Generated Content es clave para confianza'
    ],
    errores_comunes: [
      'No invertir en fotografía de producto',
      'Ignorar el poder de Instagram Shopping',
      'No tener tallas/stock visible',
      'Política de cambios no clara'
    ],
    mejor_plataforma: 'META',
    estacionalidad: 'Cambios de temporada, Black Friday, Navidad',
    ciclo_venta_tipico: '1-14 días',
    kpis_clave: ['ROAS', 'AOV', 'Tasa de Devolución', 'LTV']
  },

  BELLEZA_PERSONAL: {
    nombre: 'Belleza / Cuidado Personal',
    emoji: '💄',
    benchmark_roas: { min: 2.5, promedio: 5.0, top: 12.0 },
    benchmark_cpl: { min: 3000, promedio: 10000, max: 30000 },
    tips: [
      'Before/After son el contenido más efectivo',
      'Video tutoriales generan engagement alto',
      'Reseñas y testimoniales son fundamentales',
      'Instagram y TikTok dominan el sector'
    ],
    errores_comunes: [
      'No mostrar resultados reales',
      'Ignorar la importancia de las reseñas',
      'Landing sin información de productos/técnicas',
      'No segmentar por tipo de servicio'
    ],
    mejor_plataforma: 'META',
    estacionalidad: 'Pre-eventos (matrimonios, graduaciones, fiestas)',
    ciclo_venta_tipico: '1-30 días',
    kpis_clave: ['CPL', 'Costo por Cita', 'Ticket Promedio', 'Recurrencia']
  }
}

export function getIndustryInsight(industria: string): IndustryInsight | null {
  return INDUSTRY_INSIGHTS[industria] || null
}
