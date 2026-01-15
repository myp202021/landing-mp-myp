// @ts-nocheck
/**
 * BENCHMARKS VERIFICADOS 2024 - 12 INDUSTRIAS
 * Fuentes: WordStream, Triple Whale, Databox, XYZLab - Datos reales 2024
 * CPCs: Ubersuggest Chile (Calibrados con promedio ponderado por volumen)
 */

import { getCPCCalibrado } from '../config/cpc-calibrado-chile'

// Fuentes de datos utilizadas
export const FUENTES_BENCHMARKS = {
  wordstream_2024: "Facebook Ads Benchmarks 2024: Key Insights & New Data for Your Industry",
  wordstream_google_2025: "Google Ads Benchmarks 2025: Competitive Data & Insights",
  triplewhale_2024: "Facebook Ad Benchmarks by Industry (Updated Data)",
  databox_2024: "Facebook Ads Benchmarks for Your Industry [Original Data]",
  xyzlab_chile: "Meta Ads Benchmarks in Chile",
  statista_latam: "Latin American: GoogleAds CPC by country 2024",
  promodo_fintech: "Fintech Industry Benchmarks Report by Promodo",
  pcmi_chile_2024: "Chile 2024: Digital Payments and Ecommerce Insights",
  ubersuggest_chile_2024: "Ubersuggest Chile 2024: CPCs calibrados con promedio ponderado por volumen (333 keywords)"
}

export interface IndustryBenchmark {
  nombre: string
  codigo: string
  fuentes: string[]

  // Google Ads benchmarks
  google_search: {
    cpc_base: number        // CLP base
    ctr_base: number        // % promedio
    cvr_web: number         // % form completion
  }

  // Meta Ads benchmarks
  meta_ads: {
    cpc_base: number        // CLP base
    ctr_base: number        // % promedio
    cvr_web: number         // % lead generation
  }

  // Factores locales Chile
  chile_factor: number      // Multiplicador mercado local (0.5-1.0)

  // Límites de negocio
  max_conversiones_mes: number  // Límite realista por industria
  roas_maximo: number          // ROAS máximo realista
  cpa_minimo: number           // CPA mínimo viable (CLP)

  // Explicación tasa de cierre por industria
  tasa_cierre_explicacion: string

  // Mix de plataformas recomendado
  plataformas_recomendadas: string[]

  // Recomendaciones específicas para la industria
  recomendaciones: {
    estrategia_principal: string
    tipo_campana_recomendada: string
    creatividades: string
    audiencias: string
    tip_conversion: string
  }
}

export const BENCHMARKS_INDUSTRIAS_2024: Record<string, IndustryBenchmark> = {

  ECOMMERCE: {
    nombre: "E-commerce",
    codigo: "ECOMMERCE",
    fuentes: ["wordstream_2024", "triplewhale_2024", "pcmi_chile_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('ECOMMERCE'),  // $247.55 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 2.81,   // Ecommerce específico WordStream 2024
      cvr_web: 2.81     // Add to cart → Lead
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('ECOMMERCE') * 0.8),  // $198 CLP - Meta típicamente 80% de Google
      ctr_base: 1.57,   // Traffic campaigns promedio
      cvr_web: 8.78     // Lead campaigns conversion
    },
    chile_factor: 0.7,
    max_conversiones_mes: 800,
    roas_maximo: 15,
    cpa_minimo: 5000,
    tasa_cierre_explicacion: "% de carritos de compra que completan el checkout y pago exitoso",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "GOOGLE_SHOPPING", "TIKTOK", "GOOGLE_DISPLAY"],
    recomendaciones: {
      estrategia_principal: "Combina Google Shopping para intención de compra con Meta Ads para descubrimiento. Remarketing dinámico es esencial.",
      tipo_campana_recomendada: "Performance Max + Advantage+ Shopping en Meta. Prioriza catálogo dinámico.",
      creatividades: "Videos cortos de producto (15-30s), carruseles con precios, UGC de clientes reales. Muestra envío gratis y garantías.",
      audiencias: "Lookalikes de compradores, remarketing carrito abandonado (1-7 días), intereses en marcas competidoras.",
      tip_conversion: "Implementa abandoned cart emails + remarketing agresivo en primeras 24h. Ofrece descuento por primera compra."
    }
  },

  INMOBILIARIA: {
    nombre: "Bienes Raíces",
    codigo: "INMOBILIARIA",
    fuentes: ["wordstream_2024", "triplewhale_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('INMOBILIARIA'),  // $214.93 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 1.8,    // Sector inmobiliario
      cvr_web: 1.2      // Form completion rate
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('INMOBILIARIA') * 0.9),  // $193 CLP - Meta 90% de Google en real estate
      ctr_base: 2.60,   // Real estate lidera CTR en Meta
      cvr_web: 9.70     // Real estate CVR específico
    },
    chile_factor: 0.8,
    max_conversiones_mes: 60,
    roas_maximo: 25,
    cpa_minimo: 50000,
    tasa_cierre_explicacion: "% de formularios de contacto que se convierten en ventas cerradas",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "LINKEDIN", "GOOGLE_DISPLAY"],
    recomendaciones: {
      estrategia_principal: "Google Search para búsquedas activas + Meta para awareness de proyectos. El ciclo largo requiere nurturing constante.",
      tipo_campana_recomendada: "Search con keywords de ubicación + Lead Ads en Meta con formularios precargados.",
      creatividades: "Tours virtuales 360°, videos de drone del sector, renders de alta calidad. Destaca m², ubicación y financiamiento.",
      audiencias: "Segmentos de ingresos altos, intereses en inversión, lookalikes de compradores previos, remarketing largo (30-90 días).",
      tip_conversion: "Ofrece asesoría gratuita de financiamiento. Implementa WhatsApp Business para respuesta inmediata a leads."
    }
  },

  TURISMO: {
    nombre: "Turismo y Hotelería",
    codigo: "TURISMO",
    fuentes: ["wordstream_2024", "triplewhale_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('TURISMO'),  // $420.88 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 3.17,   // Promedio industrias
      cvr_web: 6.96     // Conversion rate promedio
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('TURISMO') * 0.7),  // $295 CLP - Meta 70% de Google en travel
      ctr_base: 2.20,   // Travel CTR específico
      cvr_web: 8.78     // Lead generation promedio
    },
    chile_factor: 0.6,
    max_conversiones_mes: 200,
    roas_maximo: 12,
    cpa_minimo: 15000,
    tasa_cierre_explicacion: "% de consultas/reservas que se convierten en pagos confirmados",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "YOUTUBE", "GOOGLE_DISPLAY"]
  },

  GASTRONOMIA: {
    nombre: "Restaurantes y Gastronomía",
    codigo: "GASTRONOMIA",
    fuentes: ["wordstream_2024", "databox_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('GASTRONOMIA'),  // $162.44 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 3.17,   // Promedio general
      cvr_web: 6.96     // Conversion promedio
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('GASTRONOMIA') * 0.85),  // $138 CLP - Meta 85% de Google en gastronomía
      ctr_base: 1.57,   // Traffic campaigns
      cvr_web: 18.25    // Restaurants CVR más alto
    },
    chile_factor: 0.5,
    max_conversiones_mes: 500,
    roas_maximo: 6,
    cpa_minimo: 3000,
    tasa_cierre_explicacion: "% de reservas online o pedidos que se convierten en consumo real",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "GOOGLE_LOCAL"]
  },

  AUTOMOTRIZ: {
    nombre: "Automotriz",
    codigo: "AUTOMOTRIZ",
    fuentes: ["wordstream_2024", "triplewhale_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('AUTOMOTRIZ'),  // $248.00 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 3.17,   // Promedio general
      cvr_web: 12.96    // Automotive tiene CVR más alto
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('AUTOMOTRIZ') * 0.95),  // $236 CLP - Meta 95% de Google en automotriz
      ctr_base: 1.57,   // Traffic campaigns promedio
      cvr_web: 4.86     // Automotive Meta CVR
    },
    chile_factor: 0.9,
    max_conversiones_mes: 120,
    roas_maximo: 20,
    cpa_minimo: 80000,
    tasa_cierre_explicacion: "% de cotizaciones o test drives que se convierten en ventas cerradas",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "YOUTUBE", "GOOGLE_DISPLAY"]
  },

  SALUD_MEDICINA: {
    nombre: "Salud y Medicina",
    codigo: "SALUD_MEDICINA",
    fuentes: ["wordstream_2024", "databox_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('SALUD_MEDICINA'),  // $369.13 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 3.17,   // Promedio general
      cvr_web: 6.96     // Healthcare conversion
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('SALUD_MEDICINA') * 0.85),  // $314 CLP - Meta 85% de Google en salud
      ctr_base: 0.73,   // Healthcare/Technology CTR bajo
      cvr_web: 4.81     // Physicians CVR bajo
    },
    chile_factor: 0.8,
    max_conversiones_mes: 200,
    roas_maximo: 15,
    cpa_minimo: 25000,
    tasa_cierre_explicacion: "% de citas agendadas que se convierten en tratamientos pagados",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "GOOGLE_LOCAL"]
  },

  EDUCACION: {
    nombre: "Educación y Capacitación",
    codigo: "EDUCACION",
    fuentes: ["wordstream_2024", "triplewhale_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('EDUCACION'),  // $145.65 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 3.17,   // Promedio general
      cvr_web: 10.05    // Education CVR específico
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('EDUCACION') * 0.75),  // $109 CLP - Meta 75% de Google en educación
      ctr_base: 1.57,   // Traffic campaigns promedio
      cvr_web: 10.05    // Education lead campaigns
    },
    chile_factor: 0.7,
    max_conversiones_mes: 250,
    roas_maximo: 12,
    cpa_minimo: 20000,
    tasa_cierre_explicacion: "% de inscripciones o demos que se convierten en matrículas pagadas",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "LINKEDIN", "YOUTUBE", "GOOGLE_DISPLAY"]
  },

  MODA_RETAIL: {
    nombre: "Moda y Retail",
    codigo: "MODA_RETAIL",
    fuentes: ["wordstream_2024", "triplewhale_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('MODA_RETAIL'),  // $127.94 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 3.17,   // Promedio general
      cvr_web: 7.96     // Fashion CVR mejorado (+112% en 2024)
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('MODA_RETAIL') * 0.9),  // $115 CLP - Meta 90% de Google en fashion
      ctr_base: 1.57,   // Traffic campaigns
      cvr_web: 8.78     // Lead campaigns promedio
    },
    chile_factor: 0.8,
    max_conversiones_mes: 400,
    roas_maximo: 15,
    cpa_minimo: 8000,
    tasa_cierre_explicacion: "% de carritos de compra que completan pago en productos de moda",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "GOOGLE_SHOPPING", "TIKTOK", "GOOGLE_DISPLAY"]
  },

  FINTECH: {
    nombre: "Fintech y Servicios Financieros",
    codigo: "FINTECH",
    fuentes: ["wordstream_2024", "promodo_fintech", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('FINTECH'),  // $478.97 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 1.9,    // Financial services CTR
      cvr_web: 4.74     // Finance CVR (-32.4% en 2024)
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('FINTECH') * 0.95),  // $455 CLP - Meta 95% de Google en fintech
      ctr_base: 0.88,   // Finance CTR más bajo
      cvr_web: 8.78     // Lead generation promedio
    },
    chile_factor: 1.0,
    max_conversiones_mes: 150,
    roas_maximo: 15,
    cpa_minimo: 40000,
    tasa_cierre_explicacion: "% de demos o consultas que se convierten en contratos firmados",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "LINKEDIN", "META_ADS", "GOOGLE_DISPLAY"]
  },

  SERVICIOS_LEGALES: {
    nombre: "Servicios Legales",
    codigo: "SERVICIOS_LEGALES",
    fuentes: ["wordstream_2024", "databox_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('SERVICIOS_LEGALES'),  // $391.34 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 3.17,   // Promedio general
      cvr_web: 6.96     // Legal services conversion
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('SERVICIOS_LEGALES') * 0.8),  // $313 CLP - Meta 80% de Google en legal
      ctr_base: 0.99,   // Legal CTR bajo
      cvr_web: 10.53    // Legal CVR alto
    },
    chile_factor: 0.9,
    max_conversiones_mes: 80,
    roas_maximo: 20,
    cpa_minimo: 100000,
    tasa_cierre_explicacion: "% de consultas legales que se convierten en casos contratados",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "LINKEDIN", "META_ADS"]
  },

  BELLEZA_PERSONAL: {
    nombre: "Belleza y Cuidado Personal",
    codigo: "BELLEZA_PERSONAL",
    fuentes: ["wordstream_2024", "triplewhale_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('BELLEZA_PERSONAL'),  // $250.97 CLP - Ubersuggest Chile (ponderado)
      ctr_base: 3.17,   // Promedio general
      cvr_web: 6.96     // Beauty conversion promedio
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('BELLEZA_PERSONAL') * 0.9),  // $226 CLP - Meta 90% de Google en belleza
      ctr_base: 1.57,   // Traffic campaigns
      cvr_web: 5.93     // Beauty CVR específico
    },
    chile_factor: 0.8,
    max_conversiones_mes: 300,
    roas_maximo: 10,
    cpa_minimo: 12000,
    tasa_cierre_explicacion: "% de citas o consultas que se convierten en tratamientos pagados",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "GOOGLE_LOCAL"]
  },

  TECNOLOGIA_SAAS: {
    nombre: "Tecnología y SaaS",
    codigo: "TECNOLOGIA_SAAS",
    fuentes: ["wordstream_2024", "triplewhale_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('TECNOLOGIA_SAAS'),  // $38.66 CLP - Ubersuggest Chile (ponderado) - ATENCION: CPC muy bajo
      ctr_base: 3.17,   // Promedio general
      cvr_web: 6.96     // Tech conversion promedio
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('TECNOLOGIA_SAAS') * 1.2),  // $46 CLP - Meta 120% de Google (excepción por bajo CPC base)
      ctr_base: 0.73,   // Technology CTR más bajo
      cvr_web: 8.78     // Lead generation promedio
    },
    chile_factor: 1.0,
    max_conversiones_mes: 150,
    roas_maximo: 15,
    cpa_minimo: 50000,
    tasa_cierre_explicacion: "% de demos o trials que se convierten en suscripciones pagadas",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "LINKEDIN", "META_ADS", "YOUTUBE", "GOOGLE_DISPLAY"]
  },

  // ============================================================================
  // NUEVAS INDUSTRIAS 2025
  // ============================================================================

  CONSTRUCCION_REMODELACION: {
    nombre: "Construcción y Remodelación",
    codigo: "CONSTRUCCION_REMODELACION",
    fuentes: ["wordstream_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('CONSTRUCCION_REMODELACION'),
      ctr_base: 2.5,
      cvr_web: 4.2
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('CONSTRUCCION_REMODELACION') * 0.85),
      ctr_base: 1.2,
      cvr_web: 6.5
    },
    chile_factor: 0.85,
    max_conversiones_mes: 80,
    roas_maximo: 18,
    cpa_minimo: 120000,
    tasa_cierre_explicacion: "% de cotizaciones que se convierten en proyectos contratados",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "GOOGLE_LOCAL", "GOOGLE_DISPLAY"]
  },

  DEPORTES_FITNESS: {
    nombre: "Deportes y Fitness",
    codigo: "DEPORTES_FITNESS",
    fuentes: ["wordstream_2024", "triplewhale_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('DEPORTES_FITNESS'),
      ctr_base: 3.5,
      cvr_web: 8.2
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('DEPORTES_FITNESS') * 0.75),
      ctr_base: 1.8,
      cvr_web: 12.5
    },
    chile_factor: 0.7,
    max_conversiones_mes: 350,
    roas_maximo: 10,
    cpa_minimo: 15000,
    tasa_cierre_explicacion: "% de pruebas gratis o consultas que se convierten en membresías",
    plataformas_recomendadas: ["META_ADS", "GOOGLE_SEARCH", "TIKTOK", "YOUTUBE", "GOOGLE_LOCAL"]
  },

  VETERINARIA_MASCOTAS: {
    nombre: "Veterinaria y Mascotas",
    codigo: "VETERINARIA_MASCOTAS",
    fuentes: ["wordstream_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('VETERINARIA_MASCOTAS'),
      ctr_base: 3.8,
      cvr_web: 9.5
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('VETERINARIA_MASCOTAS') * 0.8),
      ctr_base: 2.1,
      cvr_web: 14.2
    },
    chile_factor: 0.65,
    max_conversiones_mes: 400,
    roas_maximo: 8,
    cpa_minimo: 8000,
    tasa_cierre_explicacion: "% de consultas que se convierten en citas o compras",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "GOOGLE_LOCAL", "GOOGLE_SHOPPING"]
  },

  MANUFACTURA_INDUSTRIAL: {
    nombre: "Manufactura e Industrial",
    codigo: "MANUFACTURA_INDUSTRIAL",
    fuentes: ["wordstream_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('MANUFACTURA_INDUSTRIAL'),
      ctr_base: 2.2,
      cvr_web: 3.5
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('MANUFACTURA_INDUSTRIAL') * 0.95),
      ctr_base: 0.65,
      cvr_web: 5.2
    },
    chile_factor: 0.95,
    max_conversiones_mes: 40,
    roas_maximo: 25,
    cpa_minimo: 250000,
    tasa_cierre_explicacion: "% de RFQs o cotizaciones que se convierten en órdenes de compra",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "LINKEDIN", "GOOGLE_DISPLAY"]
  },

  LOGISTICA_TRANSPORTE: {
    nombre: "Logística y Transporte",
    codigo: "LOGISTICA_TRANSPORTE",
    fuentes: ["wordstream_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('LOGISTICA_TRANSPORTE'),
      ctr_base: 2.8,
      cvr_web: 4.8
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('LOGISTICA_TRANSPORTE') * 0.9),
      ctr_base: 0.85,
      cvr_web: 6.8
    },
    chile_factor: 0.9,
    max_conversiones_mes: 60,
    roas_maximo: 20,
    cpa_minimo: 150000,
    tasa_cierre_explicacion: "% de cotizaciones de flete que se convierten en contratos",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "LINKEDIN", "META_ADS", "GOOGLE_DISPLAY"]
  },

  SEGUROS: {
    nombre: "Seguros",
    codigo: "SEGUROS",
    fuentes: ["wordstream_2024", "promodo_fintech", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('SEGUROS'),
      ctr_base: 2.0,
      cvr_web: 3.8
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('SEGUROS') * 0.9),
      ctr_base: 0.75,
      cvr_web: 7.5
    },
    chile_factor: 1.0,
    max_conversiones_mes: 100,
    roas_maximo: 18,
    cpa_minimo: 80000,
    tasa_cierre_explicacion: "% de cotizaciones que se convierten en pólizas contratadas",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "LINKEDIN", "GOOGLE_DISPLAY"]
  },

  AGRICULTURA_AGROINDUSTRIA: {
    nombre: "Agricultura y Agroindustria",
    codigo: "AGRICULTURA_AGROINDUSTRIA",
    fuentes: ["wordstream_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('AGRICULTURA_AGROINDUSTRIA'),
      ctr_base: 2.6,
      cvr_web: 5.5
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('AGRICULTURA_AGROINDUSTRIA') * 0.85),
      ctr_base: 1.1,
      cvr_web: 8.2
    },
    chile_factor: 0.75,
    max_conversiones_mes: 50,
    roas_maximo: 15,
    cpa_minimo: 100000,
    tasa_cierre_explicacion: "% de cotizaciones de insumos/maquinaria que se convierten en compras",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "META_ADS", "LINKEDIN", "YOUTUBE"]
  },

  SERVICIOS_PROFESIONALES: {
    nombre: "Servicios Profesionales B2B",
    codigo: "SERVICIOS_PROFESIONALES",
    fuentes: ["wordstream_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('SERVICIOS_PROFESIONALES'),
      ctr_base: 2.9,
      cvr_web: 5.8
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('SERVICIOS_PROFESIONALES') * 0.85),
      ctr_base: 0.9,
      cvr_web: 9.2
    },
    chile_factor: 0.85,
    max_conversiones_mes: 80,
    roas_maximo: 18,
    cpa_minimo: 80000,
    tasa_cierre_explicacion: "% de reuniones o consultas que se convierten en contratos",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "LINKEDIN", "META_ADS", "GOOGLE_DISPLAY"]
  },

  ENERGIA_UTILITIES: {
    nombre: "Energía y Utilities",
    codigo: "ENERGIA_UTILITIES",
    fuentes: ["wordstream_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('ENERGIA_UTILITIES'),
      ctr_base: 2.3,
      cvr_web: 4.0
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('ENERGIA_UTILITIES') * 0.9),
      ctr_base: 0.7,
      cvr_web: 6.5
    },
    chile_factor: 0.95,
    max_conversiones_mes: 35,
    roas_maximo: 22,
    cpa_minimo: 200000,
    tasa_cierre_explicacion: "% de cotizaciones de proyectos energéticos que se convierten en contratos",
    plataformas_recomendadas: ["GOOGLE_SEARCH", "LINKEDIN", "GOOGLE_DISPLAY"]
  },

  HOGAR_DECORACION: {
    nombre: "Hogar y Decoración",
    codigo: "HOGAR_DECORACION",
    fuentes: ["wordstream_2024", "triplewhale_2024", "ubersuggest_chile_2024"],
    google_search: {
      cpc_base: getCPCCalibrado('HOGAR_DECORACION'),
      ctr_base: 3.2,
      cvr_web: 6.8
    },
    meta_ads: {
      cpc_base: Math.round(getCPCCalibrado('HOGAR_DECORACION') * 0.85),
      ctr_base: 1.65,
      cvr_web: 10.5
    },
    chile_factor: 0.75,
    max_conversiones_mes: 250,
    roas_maximo: 12,
    cpa_minimo: 18000,
    tasa_cierre_explicacion: "% de carritos o cotizaciones que se convierten en compras",
    plataformas_recomendadas: ["META_ADS", "GOOGLE_SEARCH", "GOOGLE_SHOPPING", "TIKTOK", "GOOGLE_DISPLAY"]
  }
}

// Validador de industrias disponibles
export const getIndustriasDisponibles = (): string[] => {
  return Object.keys(BENCHMARKS_INDUSTRIAS_2024)
}

// Obtener benchmark específico
export const getBenchmarkIndustria = (industria: string): IndustryBenchmark | null => {
  return BENCHMARKS_INDUSTRIAS_2024[industria] || null
}