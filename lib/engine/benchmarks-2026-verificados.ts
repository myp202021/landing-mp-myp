// @ts-nocheck
/**
 * BENCHMARKS VERIFICADOS 2026 — 22 INDUSTRIAS
 *
 * Fuentes verificadas (agosto 2026):
 * - WordStream 2026: Google Ads Benchmarks (23 industrias, CPC/CTR/CVR/CPL)
 * - Get-Ryze 2026: Google Ads + Meta Ads por industria (CPC/CTR/CVR/CPA/ROAS)
 * - DigitalApplied 2026: Google Ads Search + Display (CPC/CTR/CVR/CPA + YoY)
 * - Adamigo 2026: Meta Ads CPM/CPC por país
 * - Ubersuggest Chile 2025: CPCs Chile ponderados por volumen (333 keywords)
 *
 * Metodología:
 * - Datos USD globales de WordStream/Get-Ryze/DigitalApplied como base
 * - Cross-referencia entre 3 fuentes para validar cada métrica
 * - CPCs Chile de Ubersuggest como override cuando disponibles
 * - Factor Chile aplicado para ajustar datos globales al mercado local
 * - USD→CLP con rate $935 (ago 2026)
 */

import { getCPCCalibrado } from '../config/cpc-calibrado-chile'

const USD_CLP = 935

export interface IndustryBenchmark2026 {
  nombre: string
  codigo: string
  fuentes_2026: string[]

  // Google Ads Search
  google_search: {
    cpc_usd: number          // USD - fuente global
    cpc_base: number          // CLP - para Chile (Ubersuggest o calculado)
    ctr_base: number          // %
    cvr_web: number           // %
    cpa_usd: number           // USD - costo por conversión
    yoy_cpc_change: number    // % cambio YoY del CPC
  }

  // Google Ads Display
  google_display: {
    cpc_usd: number
    ctr_base: number
    cvr_web: number
    cpa_usd: number
  }

  // Meta Ads
  meta_ads: {
    cpc_usd: number           // USD
    cpc_base: number           // CLP - para Chile
    cpm_usd: number            // CPM USD
    ctr_base: number           // %
    cvr_web: number            // % lead gen / purchase
    cpa_usd: number            // USD
    roas_benchmark?: number    // ROAS para ecommerce verticals
  }

  // Factor Chile (ajuste mercado local)
  chile_factor: number

  // Límites de negocio
  max_conversiones_mes: number
  roas_maximo: number
  cpa_minimo: number            // CLP

  // Contexto
  tasa_cierre_explicacion: string
  plataformas_recomendadas: string[]
  source_year: 2026

  // Recomendaciones por industria
  recomendaciones: {
    estrategia_principal: string
    tipo_campana_recomendada: string
    creatividades: string
    audiencias: string
    tip_conversion: string
  }
}

// ═══════════════════════════════════════════════════════════════════════
// DATA 2026 — 22 INDUSTRIAS
// ═══════════════════════════════════════════════════════════════════════

export const BENCHMARKS_INDUSTRIAS_2026: Record<string, IndustryBenchmark2026> = {

  // ─── 1. E-COMMERCE ──────────────────────────────────────────────────
  ECOMMERCE: {
    nombre: 'E-commerce / Retail Online',
    codigo: 'ECOMMERCE',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 1.16,           // WordStream 2026: lowest CPC industry
      cpc_base: getCPCCalibrado('ECOMMERCE'),  // $248 CLP Ubersuggest Chile
      ctr_base: 4.10,           // Get-Ryze 2026
      cvr_web: 4.50,            // WordStream 2026 Apparel/Shopping
      cpa_usd: 37.54,           // DigitalApplied 2026
      yoy_cpc_change: 6
    },
    google_display: {
      cpc_usd: 0.28,            // DigitalApplied 2026
      ctr_base: 0.51,           // DigitalApplied 2026
      cvr_web: 0.48,
      cpa_usd: 58.33
    },
    meta_ads: {
      cpc_usd: 0.67,            // Get-Ryze Meta 2026
      cpc_base: Math.round(0.67 * USD_CLP * 0.7),  // Ajuste Chile
      cpm_usd: 10.42,           // Get-Ryze Meta 2026
      ctr_base: 1.55,           // Get-Ryze Meta 2026
      cvr_web: 8.78,
      cpa_usd: 32.14,
      roas_benchmark: 2.5       // Get-Ryze ecommerce ROAS
    },
    chile_factor: 0.7,
    max_conversiones_mes: 800,
    roas_maximo: 15,
    cpa_minimo: 5000,
    tasa_cierre_explicacion: '% de carritos que completan checkout y pago exitoso',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'GOOGLE_SHOPPING', 'META_ADS', 'TIKTOK', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Shopping para intención de compra + Meta Ads para descubrimiento + Remarketing dinámico cruzado.',
      tipo_campana_recomendada: 'Performance Max + Advantage+ Shopping. Catálogo dinámico obligatorio.',
      creatividades: 'Videos cortos producto (15-30s), carruseles con precios, UGC clientes reales. Envío gratis y garantías visibles.',
      audiencias: 'Lookalikes de compradores, remarketing carrito abandonado (1-7 días), intereses marcas competidoras.',
      tip_conversion: 'Abandoned cart emails + remarketing 24h. Descuento primera compra. Checkout simplificado.'
    }
  },

  // ─── 2. INMOBILIARIA ────────────────────────────────────────────────
  INMOBILIARIA: {
    nombre: 'Bienes Raíces / Inmobiliaria',
    codigo: 'INMOBILIARIA',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 2.81,            // DigitalApplied: Real Estate
      cpc_base: getCPCCalibrado('INMOBILIARIA'),  // $215 CLP Ubersuggest
      ctr_base: 4.23,           // DigitalApplied 2026
      cvr_web: 3.7,            // WordStream 2026            // DigitalApplied 2026
      cpa_usd: 66.75,
      yoy_cpc_change: 11
    },
    google_display: {
      cpc_usd: 0.44,
      ctr_base: 0.45,
      cvr_web: 0.68,
      cpa_usd: 64.71
    },
    meta_ads: {
      cpc_usd: 0.95,
      cpc_base: Math.round(0.95 * USD_CLP * 0.8),
      cpm_usd: 11.20,
      ctr_base: 2.75,           // Real Estate lidera CTR Meta
      cvr_web: 9.70,
      cpa_usd: 44.19
    },
    chile_factor: 0.8,
    max_conversiones_mes: 60,
    roas_maximo: 8,     // Ticket altísimo ($150M+) pero ciclo largo y baja tasa de cierre → cap realista
    cpa_minimo: 50000,
    tasa_cierre_explicacion: '% de formularios de contacto que se convierten en ventas cerradas',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'LINKEDIN', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para búsquedas activas + Meta para awareness de proyectos. Nurturing constante por ciclo largo.',
      tipo_campana_recomendada: 'Search keywords ubicación + Lead Ads Meta con formularios precargados.',
      creatividades: 'Tours virtuales 360°, videos drone, renders HD. Destacar m², ubicación, financiamiento, UF.',
      audiencias: 'Intereses en portales inmobiliarios, remarketing visitantes proyecto, lookalike compradores.',
      tip_conversion: 'Lead nurturing WhatsApp automatizado. Responder en <5 min. Agendar visita como objetivo.'
    }
  },

  // ─── 3. TURISMO ─────────────────────────────────────────────────────
  TURISMO: {
    nombre: 'Turismo y Hotelería',
    codigo: 'TURISMO',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 1.63,            // DigitalApplied: Travel & Hospitality
      cpc_base: getCPCCalibrado('TURISMO'),  // $421 CLP Ubersuggest
      ctr_base: 5.36,           // DigitalApplied 2026 (2do más alto)
      cvr_web: 5.83,            // WordStream 2026
      cpa_usd: 51.75,
      yoy_cpc_change: 7
    },
    google_display: {
      cpc_usd: 0.31,
      ctr_base: 0.52,
      cvr_web: 0.52,
      cpa_usd: 59.62
    },
    meta_ads: {
      cpc_usd: 0.61,
      cpc_base: Math.round(0.61 * USD_CLP * 0.75),
      cpm_usd: 10.90,
      ctr_base: 1.62,
      cvr_web: 6.50,
      cpa_usd: 31.20
    },
    chile_factor: 0.75,
    max_conversiones_mes: 200,
    roas_maximo: 12,
    cpa_minimo: 15000,
    tasa_cierre_explicacion: '% de consultas/cotizaciones que se convierten en reservas pagadas',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'GOOGLE_DISPLAY', 'YOUTUBE'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para intención directa ("hotel en X") + Meta/Instagram para inspiración visual.',
      tipo_campana_recomendada: 'Search + Display remarketing + Instagram Stories/Reels para destinos.',
      creatividades: 'Videos inmersivos del destino, carruseles antes/durante/después, testimonios de viajeros.',
      audiencias: 'Intereses viajes, remarketing buscadores, lookalike reservas anteriores, estacionalidad.',
      tip_conversion: 'Booking directo con descuento vs OTAs. Urgencia ("últimas 3 habitaciones"). Reseñas visibles.'
    }
  },

  // ─── 4. GASTRONOMÍA ─────────────────────────────────────────────────
  GASTRONOMIA: {
    nombre: 'Restaurantes y Gastronomía',
    codigo: 'GASTRONOMIA',
    fuentes_2026: ['wordstream_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 1.84,            // DigitalApplied: Restaurants & Food
      cpc_base: getCPCCalibrado('GASTRONOMIA'),  // $162 CLP Ubersuggest
      ctr_base: 5.19,
      cvr_web: 8.05,            // WordStream 2026
      cpa_usd: 55.93,
      yoy_cpc_change: 4
    },
    google_display: {
      cpc_usd: 0.34,
      ctr_base: 0.56,
      cvr_web: 0.54,
      cpa_usd: 62.96
    },
    meta_ads: {
      cpc_usd: 0.52,
      cpc_base: Math.round(0.52 * USD_CLP * 0.65),
      cpm_usd: 8.14,            // Uno de los más bajos
      ctr_base: 1.68,
      cvr_web: 5.50,
      cpa_usd: 23.88,
      roas_benchmark: 3.2
    },
    chile_factor: 0.65,
    max_conversiones_mes: 500,
    roas_maximo: 10,
    cpa_minimo: 3000,
    tasa_cierre_explicacion: '% de personas que ven el anuncio y efectivamente visitan o piden delivery',
    plataformas_recomendadas: ['META_ADS', 'GOOGLE_SEARCH', 'GOOGLE_MAPS', 'TIKTOK'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Meta/Instagram para food content + Google Maps/Local para capturar "cerca de mí".',
      tipo_campana_recomendada: 'Local Campaigns + Instagram Reels + Google Business Profile optimizado.',
      creatividades: 'Food photography profesional, videos platos estrella, behind-the-scenes cocina, UGC.',
      audiencias: 'Radio 5-10km del local, intereses gastronomía, remarketing visitantes web, delivery apps.',
      tip_conversion: 'Reserva directa con incentivo. Link WhatsApp visible. Menú digital con precios.'
    }
  },

  // ─── 5. AUTOMOTRIZ ──────────────────────────────────────────────────
  AUTOMOTRIZ: {
    nombre: 'Automotriz',
    codigo: 'AUTOMOTRIZ',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 2.46,
      cpc_base: getCPCCalibrado('AUTOMOTRIZ'),  // $248 CLP
      ctr_base: 4.68,           // DigitalApplied 2026
      cvr_web: 6.01,            // WordStream 2026            // Highest CVR across industries
      cpa_usd: 30.83,
      yoy_cpc_change: 5
    },
    google_display: {
      cpc_usd: 0.39,
      ctr_base: 0.49,
      cvr_web: 1.19,
      cpa_usd: 32.77
    },
    meta_ads: {
      cpc_usd: 0.89,
      cpc_base: Math.round(0.89 * USD_CLP * 0.7),
      cpm_usd: 12.88,
      ctr_base: 1.34,
      cvr_web: 5.20,
      cpa_usd: 49.48
    },
    chile_factor: 0.7,
    max_conversiones_mes: 80,
    roas_maximo: 20,
    cpa_minimo: 30000,
    tasa_cierre_explicacion: '% de cotizaciones/test drives que se convierten en ventas',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'YOUTUBE', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para intención de compra + YouTube para showcase + Meta remarketing.',
      tipo_campana_recomendada: 'Search por modelo/marca + YouTube TrueView + Lead Ads test drive.',
      creatividades: 'Videos 360° del vehículo, comparativas, testimonios dueños, financiamiento destacado.',
      audiencias: 'In-market auto buyers, remarketing visitantes ficha, lookalike compradores, intereses marca.',
      tip_conversion: 'Cotizador online instantáneo. Test drive como CTA principal. Financiamiento pre-aprobado.'
    }
  },

  // ─── 6. SALUD Y MEDICINA ────────────────────────────────────────────
  SALUD_MEDICINA: {
    nombre: 'Salud y Medicina',
    codigo: 'SALUD_MEDICINA',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 4.76,            // WordStream 2026 Physicians & Surgeons
      cpc_base: getCPCCalibrado('SALUD_MEDICINA'),  // $369 CLP Ubersuggest Chile
      ctr_base: 3.27,
      cvr_web: 12.43,            // WordStream 2026 Physicians — era 3.36% (DigitalApplied)
      cpa_usd: 40.04,            // WordStream 2026
      yoy_cpc_change: 6
    },
    google_display: {
      cpc_usd: 0.63,
      ctr_base: 0.44,
      cvr_web: 0.59,
      cpa_usd: 106.78
    },
    meta_ads: {
      cpc_usd: 2.71,            // Healthcare — alto CPC en Meta
      cpc_base: Math.round(2.71 * USD_CLP * 0.75),
      cpm_usd: 18.90,           // Uno de los más altos
      ctr_base: 1.33,
      cvr_web: 4.80,
      cpa_usd: 156.88
    },
    chile_factor: 0.75,
    max_conversiones_mes: 150,
    roas_maximo: 8,
    cpa_minimo: 20000,
    tasa_cierre_explicacion: '% de consultas/agendamientos que se convierten en pacientes atendidos',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para síntomas y tratamientos + Meta para awareness de especialidades.',
      tipo_campana_recomendada: 'Search por especialidad/síntoma + Lead Ads con agenda directa.',
      creatividades: 'Testimonios pacientes (con permiso), equipo médico, instalaciones, convenios Fonasa/Isapre.',
      audiencias: 'Búsquedas por síntomas, intereses salud, geo local (radio 10-20km), edad según especialidad.',
      tip_conversion: 'Agenda online directa. WhatsApp para consultas. Mostrar convenios y precios Fonasa.'
    }
  },

  // ─── 7. EDUCACIÓN ───────────────────────────────────────────────────
  EDUCACION: {
    nombre: 'Educación y Capacitación',
    codigo: 'EDUCACION',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 3.12,            // DigitalApplied: Education
      cpc_base: getCPCCalibrado('EDUCACION'),  // $146 CLP Ubersuggest
      ctr_base: 3.55,
      cvr_web: 13.14,            // WordStream 2026 Education — era 4.47%
      cpa_usd: 69.84,
      yoy_cpc_change: 7
    },
    google_display: {
      cpc_usd: 0.47,
      ctr_base: 0.43,
      cvr_web: 0.73,
      cpa_usd: 64.38
    },
    meta_ads: {
      cpc_usd: 1.06,
      cpc_base: Math.round(1.06 * USD_CLP * 0.7),
      cpm_usd: 7.60,            // El más bajo de todos
      ctr_base: 0.73,
      cvr_web: 7.50,
      cpa_usd: 7.85             // CPA más bajo — alto volumen
    },
    chile_factor: 0.7,
    max_conversiones_mes: 300,
    roas_maximo: 10,
    cpa_minimo: 8000,
    tasa_cierre_explicacion: '% de leads que se matriculan efectivamente en el programa',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'YOUTUBE', 'LINKEDIN'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para búsquedas de programas + Meta para awareness + YouTube para webinars.',
      tipo_campana_recomendada: 'Search por carrera/programa + Lead Ads + YouTube TrueView.',
      creatividades: 'Testimonios egresados, campus tour, empleabilidad, becas y financiamiento.',
      audiencias: 'Intereses educación, padres (para pregrado), profesionales (para postgrado), edad según programa.',
      tip_conversion: 'Landing por programa específico. Formulario corto. Llamada de seguimiento en <24h. Open days.'
    }
  },

  // ─── 8. MODA Y RETAIL ──────────────────────────────────────────────
  MODA_RETAIL: {
    nombre: 'Moda y Retail',
    codigo: 'MODA_RETAIL',
    fuentes_2026: ['wordstream_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 4.44,            // WordStream: Apparel/Fashion
      cpc_base: getCPCCalibrado('MODA_RETAIL'),  // $128 CLP
      ctr_base: 6.64,           // WordStream: muy alto CTR
      cvr_web: 4.50,            // WordStream 2026
      cpa_usd: 97.51,
      yoy_cpc_change: 8
    },
    google_display: {
      cpc_usd: 0.45,
      ctr_base: 0.48,
      cvr_web: 0.52,
      cpa_usd: 86.54
    },
    meta_ads: {
      cpc_usd: 0.45,            // Apparel — CPC más bajo de Meta
      cpc_base: Math.round(0.45 * USD_CLP * 0.7),
      cpm_usd: 9.23,
      ctr_base: 1.95,           // CTR alto por visual appeal
      cvr_web: 6.80,
      cpa_usd: 24.32,
      roas_benchmark: 2.9
    },
    chile_factor: 0.7,
    max_conversiones_mes: 600,
    roas_maximo: 12,
    cpa_minimo: 4000,
    tasa_cierre_explicacion: '% de visitas a producto que completan compra',
    plataformas_recomendadas: ['META_ADS', 'GOOGLE_SHOPPING', 'TIKTOK', 'GOOGLE_SEARCH'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Instagram/Meta como canal principal (visual) + Google Shopping para intención de compra.',
      tipo_campana_recomendada: 'Advantage+ Shopping + Instagram Reels + Google Shopping + remarketing.',
      creatividades: 'Lookbooks, try-on videos, UGC influencers, carruseles colecciones, Reels trending.',
      audiencias: 'Intereses moda, lookalike compradores, remarketing catálogo, engagement IG.',
      tip_conversion: 'Free shipping threshold. Código primera compra. Instagram Shopping directo. Size guide.'
    }
  },

  // ─── 9. FINTECH ─────────────────────────────────────────────────────
  FINTECH: {
    nombre: 'Fintech y Servicios Financieros',
    codigo: 'FINTECH',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 3.08,            // DigitalApplied: Finance & Banking
      cpc_base: getCPCCalibrado('FINTECH'),  // $479 CLP — el más alto Chile
      ctr_base: 3.41,
      cvr_web: 2.64,            // WordStream 2026
      cpa_usd: 65.25,
      yoy_cpc_change: 10
    },
    google_display: {
      cpc_usd: 0.51,
      ctr_base: 0.38,
      cvr_web: 0.82,
      cpa_usd: 62.20
    },
    meta_ads: {
      cpc_usd: 3.77,            // Finance — CPC más alto Meta
      cpc_base: Math.round(3.77 * USD_CLP * 0.8),
      cpm_usd: 18.60,
      ctr_base: 1.42,
      cvr_web: 3.80,
      cpa_usd: 77.42
    },
    chile_factor: 0.8,
    max_conversiones_mes: 200,
    roas_maximo: 15,
    cpa_minimo: 25000,
    tasa_cierre_explicacion: '% de registros/solicitudes que se convierten en clientes activos',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'LINKEDIN', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para intención ("crédito hipotecario", "cuenta digital") + LinkedIn B2B + Meta awareness.',
      tipo_campana_recomendada: 'Search brand + genérico + Lead Ads + LinkedIn InMail para B2B.',
      creatividades: 'Calculadoras interactivas, comparativas vs bancos, testimonios, seguridad y regulación.',
      audiencias: 'Intereses finanzas, in-market créditos, profesionales (LinkedIn), remarketing visitantes.',
      tip_conversion: 'Simulador de crédito como lead magnet. Onboarding simplificado. Confianza: CMF, encriptación.'
    }
  },

  // ─── 10. SERVICIOS LEGALES ──────────────────────────────────────────
  SERVICIOS_LEGALES: {
    nombre: 'Servicios Legales',
    codigo: 'SERVICIOS_LEGALES',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 6.75,            // WordStream: el CPC más alto
      cpc_base: getCPCCalibrado('SERVICIOS_LEGALES'),  // $391 CLP
      ctr_base: 2.31,           // DigitalApplied: más bajo CTR
      cvr_web: 5.55,            // WordStream 2026
      cpa_usd: 127.08,
      yoy_cpc_change: 14
    },
    google_display: {
      cpc_usd: 0.72,
      ctr_base: 0.24,
      cvr_web: 0.88,
      cpa_usd: 81.82
    },
    meta_ads: {
      cpc_usd: 3.45,
      cpc_base: Math.round(3.45 * USD_CLP * 0.75),
      cpm_usd: 20.85,
      ctr_base: 1.38,
      cvr_web: 3.20,
      cpa_usd: 187.60
    },
    chile_factor: 0.75,
    max_conversiones_mes: 40,
    roas_maximo: 20,
    cpa_minimo: 60000,
    tasa_cierre_explicacion: '% de consultas iniciales que se convierten en clientes con caso activo',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para urgencias legales + Meta para casos de largo plazo.',
      tipo_campana_recomendada: 'Search por tipo de caso + Call-only ads + Lead Ads formulario.',
      creatividades: 'Casos de éxito (sin nombres), consulta gratuita, experiencia del equipo, resultados concretos.',
      audiencias: 'Búsquedas "abogado + tipo caso", intereses legales, geo local, remarketing.',
      tip_conversion: 'Consulta gratuita como CTA. Respuesta <1 hora. WhatsApp directo. Mostrar especializaciones.'
    }
  },

  // ─── 11. BELLEZA Y CUIDADO PERSONAL ─────────────────────────────────
  BELLEZA_PERSONAL: {
    nombre: 'Belleza y Cuidado Personal',
    codigo: 'BELLEZA_PERSONAL',
    fuentes_2026: ['wordstream_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 4.62,            // WordStream: Beauty & Personal Care
      cpc_base: getCPCCalibrado('BELLEZA_PERSONAL'),  // $251 CLP
      ctr_base: 6.75,           // WordStream: muy alto
      cvr_web: 10.35,           // WordStream: alto CVR
      cpa_usd: 39.25,
      yoy_cpc_change: 7
    },
    google_display: {
      cpc_usd: 0.48,
      ctr_base: 0.42,
      cvr_web: 0.65,
      cpa_usd: 73.85
    },
    meta_ads: {
      cpc_usd: 1.81,
      cpc_base: Math.round(1.81 * USD_CLP * 0.7),
      cpm_usd: 9.80,
      ctr_base: 1.45,
      cvr_web: 7.20,
      cpa_usd: 25.49
    },
    chile_factor: 0.7,
    max_conversiones_mes: 300,
    roas_maximo: 10,
    cpa_minimo: 8000,
    tasa_cierre_explicacion: '% de agendamientos que se convierten en servicios pagados',
    plataformas_recomendadas: ['META_ADS', 'GOOGLE_SEARCH', 'TIKTOK', 'GOOGLE_MAPS'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Instagram/TikTok como canal principal (visual) + Google local para capturar intención.',
      tipo_campana_recomendada: 'Instagram Reels + Google Local/Maps + remarketing.',
      creatividades: 'Before/after, tutoriales, Reels tendencia, UGC, testimonios con fotos.',
      audiencias: 'Mujeres 25-55 intereses belleza, geo local radio 5-10km, lookalike clientes.',
      tip_conversion: 'Agenda online directa. Promo primera visita. Reviews Google visibles. WhatsApp rápido.'
    }
  },

  // ─── 12. TECNOLOGÍA Y SAAS ──────────────────────────────────────────
  TECNOLOGIA_SAAS: {
    nombre: 'Tecnología y SaaS',
    codigo: 'TECNOLOGIA_SAAS',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 3.33,            // DigitalApplied: B2B/SaaS
      cpc_base: getCPCCalibrado('TECNOLOGIA_SAAS'),  // $39 CLP — bajo en Chile
      ctr_base: 2.86,
      cvr_web: 4.85,            // WordStream 2026
      cpa_usd: 87.17,
      yoy_cpc_change: 12
    },
    google_display: {
      cpc_usd: 0.52,
      ctr_base: 0.32,
      cvr_web: 0.64,
      cpa_usd: 81.25
    },
    meta_ads: {
      cpc_usd: 2.52,
      cpc_base: Math.round(2.52 * USD_CLP * 0.8),
      cpm_usd: 15.20,
      ctr_base: 0.78,           // B2B Tech — CTR bajo en Meta
      cvr_web: 3.50,
      cpa_usd: 55.21
    },
    chile_factor: 0.8,
    max_conversiones_mes: 100,
    roas_maximo: 20,
    cpa_minimo: 40000,
    tasa_cierre_explicacion: '% de demos/trials que se convierten en clientes pagando',
    plataformas_recomendadas: ['LINKEDIN', 'GOOGLE_SEARCH', 'META_ADS', 'YOUTUBE'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'LinkedIn para B2B targeting + Google Search para intención + Content marketing para nurturing.',
      tipo_campana_recomendada: 'LinkedIn Sponsored Content + Search brand/genérico + YouTube demos.',
      creatividades: 'Demo en video, case studies, ROI calculator, comparativa vs competencia, webinars.',
      audiencias: 'LinkedIn por cargo/industria/empresa, Google in-market, remarketing demo page visitors.',
      tip_conversion: 'Free trial / freemium como entrada. Demo personalizada. ROI calculator como lead magnet.'
    }
  },

  // ─── 13. CONSTRUCCIÓN Y REMODELACIÓN ────────────────────────────────
  CONSTRUCCION_REMODELACION: {
    nombre: 'Construcción y Remodelación',
    codigo: 'CONSTRUCCION_REMODELACION',
    fuentes_2026: ['getryze_google_2026', 'digitalapplied_google_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 5.21,            // DigitalApplied: Home Improvement
      cpc_base: getCPCCalibrado('CONSTRUCCION_REMODELACION'),  // $385 CLP
      ctr_base: 3.28,
      cvr_web: 5.07,
      cpa_usd: 102.74,
      yoy_cpc_change: 13
    },
    google_display: {
      cpc_usd: 0.59,
      ctr_base: 0.36,
      cvr_web: 0.84,
      cpa_usd: 70.24
    },
    meta_ads: {
      cpc_usd: 1.62,
      cpc_base: Math.round(1.62 * USD_CLP * 0.75),
      cpm_usd: 13.40,
      ctr_base: 1.48,
      cvr_web: 4.50,
      cpa_usd: 89.45
    },
    chile_factor: 0.75,
    max_conversiones_mes: 50,
    roas_maximo: 15,
    cpa_minimo: 40000,
    tasa_cierre_explicacion: '% de cotizaciones que se convierten en proyectos contratados',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'GOOGLE_MAPS', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para intención urgente + Meta para proyectos planificados + Google Maps local.',
      tipo_campana_recomendada: 'Search por servicio + Local campaigns + Meta lead ads con portafolio.',
      creatividades: 'Before/after proyectos reales, videos timelapse, testimonios clientes, portafolio fotográfico.',
      audiencias: 'Propietarios de vivienda, intereses decoración/remodelación, geo local, remarketing.',
      tip_conversion: 'Cotización gratuita en 24h. Portafolio con fotos reales. WhatsApp directo. Garantía visible.'
    }
  },

  // ─── 14. DEPORTES Y FITNESS ─────────────────────────────────────────
  DEPORTES_FITNESS: {
    nombre: 'Deportes y Fitness',
    codigo: 'DEPORTES_FITNESS',
    fuentes_2026: ['wordstream_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 1.90,            // DigitalApplied: Fitness & Recreation
      cpc_base: getCPCCalibrado('DEPORTES_FITNESS'),  // $195 CLP
      ctr_base: 4.07,
      cvr_web: 3.41,
      cpa_usd: 55.72,
      yoy_cpc_change: 8
    },
    google_display: {
      cpc_usd: 0.38,
      ctr_base: 0.41,
      cvr_web: 0.57,
      cpa_usd: 66.67
    },
    meta_ads: {
      cpc_usd: 1.90,
      cpc_base: Math.round(1.90 * USD_CLP * 0.7),
      cpm_usd: 8.90,
      ctr_base: 1.01,
      cvr_web: 5.80,
      cpa_usd: 13.29            // CPA bajo
    },
    chile_factor: 0.7,
    max_conversiones_mes: 200,
    roas_maximo: 8,
    cpa_minimo: 10000,
    tasa_cierre_explicacion: '% de clases de prueba o evaluaciones que se convierten en membresías/planes',
    plataformas_recomendadas: ['META_ADS', 'GOOGLE_SEARCH', 'TIKTOK', 'GOOGLE_MAPS'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Instagram/TikTok para contenido motivacional + Google Local para "gym cerca de mí".',
      tipo_campana_recomendada: 'Instagram Reels + Google Maps + Lead Ads clase gratis.',
      creatividades: 'Transformaciones reales, rutinas, ambiente del centro, testimonios, UGC.',
      audiencias: 'Intereses fitness/salud, geo local 5km, lookalike miembros, enero/marzo (propósitos).',
      tip_conversion: 'Clase/evaluación gratis como puerta de entrada. Tour del centro. Planes flexibles sin compromiso.'
    }
  },

  // ─── 15. VETERINARIA Y MASCOTAS ─────────────────────────────────────
  VETERINARIA_MASCOTAS: {
    nombre: 'Veterinaria y Mascotas',
    codigo: 'VETERINARIA_MASCOTAS',
    fuentes_2026: ['wordstream_google_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 4.06,            // WordStream: Animals & Pets
      cpc_base: getCPCCalibrado('VETERINARIA_MASCOTAS'),  // $175 CLP
      ctr_base: 7.49,           // WordStream: alto CTR
      cvr_web: 16.22,           // WordStream: CVR más alto!
      cpa_usd: 31.50,
      yoy_cpc_change: 5
    },
    google_display: {
      cpc_usd: 0.42,
      ctr_base: 0.52,
      cvr_web: 1.10,
      cpa_usd: 38.18
    },
    meta_ads: {
      cpc_usd: 0.75,
      cpc_base: Math.round(0.75 * USD_CLP * 0.7),
      cpm_usd: 9.50,
      ctr_base: 1.80,
      cvr_web: 8.50,
      cpa_usd: 28.00
    },
    chile_factor: 0.7,
    max_conversiones_mes: 250,
    roas_maximo: 8,
    cpa_minimo: 8000,
    tasa_cierre_explicacion: '% de consultas/agendamientos que se convierten en visitas pagadas',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'GOOGLE_MAPS'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search/Maps para urgencias + Meta para servicios preventivos y productos.',
      tipo_campana_recomendada: 'Search por urgencia + Local campaigns + Meta awareness prevención.',
      creatividades: 'Fotos mascotas pacientes (con permiso), equipo veterinario, instalaciones, tips de cuidado.',
      audiencias: 'Dueños mascotas, geo local 5-10km, intereses pet care, remarketing.',
      tip_conversion: 'Agenda online 24/7. Urgencias visibles. WhatsApp directo. Mostrar precios base y convenios.'
    }
  },

  // ─── 16. MANUFACTURA E INDUSTRIAL ───────────────────────────────────
  MANUFACTURA_INDUSTRIAL: {
    nombre: 'Manufactura e Industrial',
    codigo: 'MANUFACTURA_INDUSTRIAL',
    fuentes_2026: ['getryze_google_2026', 'digitalapplied_google_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 4.18,            // DigitalApplied: Industrial & Commercial
      cpc_base: getCPCCalibrado('MANUFACTURA_INDUSTRIAL'),  // $425 CLP
      ctr_base: 2.44,
      cvr_web: 4.35,
      cpa_usd: 96.09,
      yoy_cpc_change: 8
    },
    google_display: {
      cpc_usd: 0.54,
      ctr_base: 0.29,
      cvr_web: 0.71,
      cpa_usd: 76.06
    },
    meta_ads: {
      cpc_usd: 2.10,
      cpc_base: Math.round(2.10 * USD_CLP * 0.8),
      cpm_usd: 14.50,
      ctr_base: 0.85,
      cvr_web: 2.80,
      cpa_usd: 75.00
    },
    chile_factor: 0.8,
    max_conversiones_mes: 30,
    roas_maximo: 25,
    cpa_minimo: 80000,
    tasa_cierre_explicacion: '% de cotizaciones que se convierten en órdenes de compra',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'LINKEDIN', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para productos/servicios específicos + LinkedIn para decision-makers B2B.',
      tipo_campana_recomendada: 'Search técnico + LinkedIn Sponsored Content + Display remarketing.',
      creatividades: 'Fichas técnicas, videos de proceso, certificaciones, casos de éxito industriales.',
      audiencias: 'LinkedIn por cargo (gerente operaciones, compras), Google keywords técnicos, remarketing.',
      tip_conversion: 'Cotización en 24h. Ficha técnica descargable como lead magnet. Visita a planta.'
    }
  },

  // ─── 17. LOGÍSTICA Y TRANSPORTE ─────────────────────────────────────
  LOGISTICA_TRANSPORTE: {
    nombre: 'Logística y Transporte',
    codigo: 'LOGISTICA_TRANSPORTE',
    fuentes_2026: ['getryze_google_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 4.90,            // DigitalApplied: Business Services proxy
      cpc_base: getCPCCalibrado('LOGISTICA_TRANSPORTE'),  // $310 CLP
      ctr_base: 3.04,
      cvr_web: 4.61,
      cpa_usd: 106.29,
      yoy_cpc_change: 10
    },
    google_display: {
      cpc_usd: 0.56,
      ctr_base: 0.34,
      cvr_web: 0.78,
      cpa_usd: 71.79
    },
    meta_ads: {
      cpc_usd: 1.80,
      cpc_base: Math.round(1.80 * USD_CLP * 0.8),
      cpm_usd: 13.00,
      ctr_base: 0.95,
      cvr_web: 3.20,
      cpa_usd: 56.25
    },
    chile_factor: 0.8,
    max_conversiones_mes: 40,
    roas_maximo: 15,
    cpa_minimo: 50000,
    tasa_cierre_explicacion: '% de cotizaciones de flete/servicio que se convierten en contratos',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'LINKEDIN', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para servicios específicos + LinkedIn para contratos corporativos.',
      tipo_campana_recomendada: 'Search por servicio/ruta + LinkedIn B2B + Display remarketing.',
      creatividades: 'Flota, certificaciones, tracking en tiempo real, cobertura geográfica, casos de éxito.',
      audiencias: 'Gerentes de operaciones/compras (LinkedIn), búsquedas de flete/mudanza, remarketing.',
      tip_conversion: 'Cotizador online instantáneo por ruta. Tracking visible. Seguros incluidos.'
    }
  },

  // ─── 18. SEGUROS ────────────────────────────────────────────────────
  SEGUROS: {
    nombre: 'Seguros',
    codigo: 'SEGUROS',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 6.22,            // DigitalApplied: Insurance (2do más caro)
      cpc_base: getCPCCalibrado('SEGUROS'),  // $520 CLP
      ctr_base: 2.53,
      cvr_web: 6.15,
      cpa_usd: 101.14,
      yoy_cpc_change: 11
    },
    google_display: {
      cpc_usd: 0.68,
      ctr_base: 0.27,
      cvr_web: 0.98,
      cpa_usd: 69.39
    },
    meta_ads: {
      cpc_usd: 2.98,
      cpc_base: Math.round(2.98 * USD_CLP * 0.8),
      cpm_usd: 21.40,           // CPM más alto de todos
      ctr_base: 1.24,
      cvr_web: 3.50,
      cpa_usd: 198.42
    },
    chile_factor: 0.8,
    max_conversiones_mes: 80,
    roas_maximo: 12,
    cpa_minimo: 40000,
    tasa_cierre_explicacion: '% de cotizaciones que se convierten en pólizas emitidas',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para intención directa ("seguro auto", "seguro vida") + Meta remarketing.',
      tipo_campana_recomendada: 'Search por tipo de seguro + Lead Ads cotización + Display remarketing.',
      creatividades: 'Cotizador simplificado, comparativa precios, testimonios, coberturas claras.',
      audiencias: 'In-market seguros, eventos de vida (auto nuevo, hijo, vivienda), remarketing cotizadores.',
      tip_conversion: 'Cotizador online en 2 minutos. Comparativa de planes visual. Llamada de asesor incluida.'
    }
  },

  // ─── 19. AGRICULTURA Y AGROINDUSTRIA ────────────────────────────────
  AGRICULTURA_AGROINDUSTRIA: {
    nombre: 'Agricultura y Agroindustria',
    codigo: 'AGRICULTURA_AGROINDUSTRIA',
    fuentes_2026: ['getryze_google_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 4.90,            // Business Services proxy
      cpc_base: getCPCCalibrado('AGRICULTURA_AGROINDUSTRIA'),  // $185 CLP
      ctr_base: 3.04,
      cvr_web: 4.61,
      cpa_usd: 106.29,
      yoy_cpc_change: 6
    },
    google_display: {
      cpc_usd: 0.56,
      ctr_base: 0.34,
      cvr_web: 0.78,
      cpa_usd: 71.79
    },
    meta_ads: {
      cpc_usd: 1.50,
      cpc_base: Math.round(1.50 * USD_CLP * 0.75),
      cpm_usd: 11.00,
      ctr_base: 1.10,
      cvr_web: 3.50,
      cpa_usd: 42.86
    },
    chile_factor: 0.75,
    max_conversiones_mes: 30,
    roas_maximo: 15,
    cpa_minimo: 60000,
    tasa_cierre_explicacion: '% de consultas que se convierten en ventas de insumos o contratos de servicio',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'META_ADS', 'LINKEDIN'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para insumos/maquinaria + Meta para awareness + LinkedIn para agroindustria.',
      tipo_campana_recomendada: 'Search por producto/servicio + Meta awareness temporada + LinkedIn B2B.',
      creatividades: 'Resultados en campo, fichas técnicas, testimonios agricultores, demos de producto.',
      audiencias: 'Agricultores, agrónomos, gerentes agroindustria (LinkedIn), geo regiones agrícolas.',
      tip_conversion: 'Demo en terreno. Ficha técnica descargable. WhatsApp asesor especializado.'
    }
  },

  // ─── 20. SERVICIOS PROFESIONALES B2B ────────────────────────────────
  SERVICIOS_PROFESIONALES: {
    nombre: 'Servicios Profesionales B2B',
    codigo: 'SERVICIOS_PROFESIONALES',
    fuentes_2026: ['wordstream_google_2026', 'getryze_google_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 4.90,            // DigitalApplied: Business Services
      cpc_base: getCPCCalibrado('SERVICIOS_PROFESIONALES'),  // $295 CLP
      ctr_base: 3.04,
      cvr_web: 4.61,
      cpa_usd: 106.29,
      yoy_cpc_change: 10
    },
    google_display: {
      cpc_usd: 0.56,
      ctr_base: 0.34,
      cvr_web: 0.78,
      cpa_usd: 71.79
    },
    meta_ads: {
      cpc_usd: 2.00,
      cpc_base: Math.round(2.00 * USD_CLP * 0.8),
      cpm_usd: 14.00,
      ctr_base: 1.00,
      cvr_web: 3.80,
      cpa_usd: 52.63
    },
    chile_factor: 0.8,
    max_conversiones_mes: 50,
    roas_maximo: 20,
    cpa_minimo: 50000,
    tasa_cierre_explicacion: '% de reuniones/propuestas que se convierten en contratos firmados',
    plataformas_recomendadas: ['LINKEDIN', 'GOOGLE_SEARCH', 'META_ADS'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'LinkedIn para targeting preciso B2B + Google Search para intención + Content marketing.',
      tipo_campana_recomendada: 'LinkedIn Sponsored Content + Search por servicio + remarketing.',
      creatividades: 'Cases de éxito, whitepapers, webinars, ROI demostrable, equipo profesional.',
      audiencias: 'LinkedIn por cargo/industria/tamaño empresa, Google keywords servicio, remarketing.',
      tip_conversion: 'Diagnóstico gratuito. Whitepaper como lead magnet. Reunión de 30 min sin compromiso.'
    }
  },

  // ─── 21. ENERGÍA Y UTILITIES ────────────────────────────────────────
  ENERGIA_UTILITIES: {
    nombre: 'Energía y Utilities',
    codigo: 'ENERGIA_UTILITIES',
    fuentes_2026: ['getryze_google_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 4.18,            // Industrial proxy
      cpc_base: getCPCCalibrado('ENERGIA_UTILITIES'),  // $450 CLP
      ctr_base: 2.44,
      cvr_web: 4.35,
      cpa_usd: 96.09,
      yoy_cpc_change: 8
    },
    google_display: {
      cpc_usd: 0.54,
      ctr_base: 0.29,
      cvr_web: 0.71,
      cpa_usd: 76.06
    },
    meta_ads: {
      cpc_usd: 2.30,
      cpc_base: Math.round(2.30 * USD_CLP * 0.8),
      cpm_usd: 16.00,
      ctr_base: 0.90,
      cvr_web: 2.50,
      cpa_usd: 92.00
    },
    chile_factor: 0.8,
    max_conversiones_mes: 25,
    roas_maximo: 20,
    cpa_minimo: 100000,
    tasa_cierre_explicacion: '% de cotizaciones de proyecto que se convierten en contratos',
    plataformas_recomendadas: ['GOOGLE_SEARCH', 'LINKEDIN', 'GOOGLE_DISPLAY'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Google Search para servicios específicos + LinkedIn para proyectos corporativos.',
      tipo_campana_recomendada: 'Search técnico + LinkedIn decision-makers + Display remarketing.',
      creatividades: 'Proyectos completados, certificaciones, ahorro energético cuantificado, sustentabilidad.',
      audiencias: 'Gerentes de operaciones/sustentabilidad (LinkedIn), búsquedas técnicas, remarketing.',
      tip_conversion: 'Estudio de ahorro energético gratuito. Caso de éxito con ROI. Reunión técnica.'
    }
  },

  // ─── 22. HOGAR Y DECORACIÓN ─────────────────────────────────────────
  HOGAR_DECORACION: {
    nombre: 'Hogar y Decoración',
    codigo: 'HOGAR_DECORACION',
    fuentes_2026: ['getryze_google_2026', 'getryze_meta_2026', 'ubersuggest_chile_2025'],
    google_search: {
      cpc_usd: 2.94,            // Get-Ryze: Home Goods
      cpc_base: getCPCCalibrado('HOGAR_DECORACION'),  // $165 CLP
      ctr_base: 3.71,
      cvr_web: 2.70,
      cpa_usd: 88.80,
      yoy_cpc_change: 9
    },
    google_display: {
      cpc_usd: 0.60,
      ctr_base: 0.38,
      cvr_web: 0.55,
      cpa_usd: 109.09
    },
    meta_ads: {
      cpc_usd: 0.73,
      cpc_base: Math.round(0.73 * USD_CLP * 0.7),
      cpm_usd: 11.67,
      ctr_base: 1.58,
      cvr_web: 6.20,
      cpa_usd: 35.82,
      roas_benchmark: 2.3
    },
    chile_factor: 0.7,
    max_conversiones_mes: 200,
    roas_maximo: 10,
    cpa_minimo: 8000,
    tasa_cierre_explicacion: '% de visitas a producto que completan compra',
    plataformas_recomendadas: ['META_ADS', 'GOOGLE_SHOPPING', 'GOOGLE_SEARCH', 'TIKTOK'],
    source_year: 2026,
    recomendaciones: {
      estrategia_principal: 'Instagram/Pinterest para inspiración + Google Shopping para compra directa.',
      tipo_campana_recomendada: 'Instagram carruseles + Google Shopping + remarketing catálogo dinámico.',
      creatividades: 'Ambientaciones reales, room makeovers, before/after, carruseles por estilo, Reels deco.',
      audiencias: 'Intereses decoración/diseño interior, propietarios, mudanza reciente, remarketing.',
      tip_conversion: 'Visualizador de producto en ambiente. Envío gratis sobre monto. Garantía de devolución.'
    }
  }
}

// ═══ Helpers ═══

export function getBenchmark2026(industria: string): IndustryBenchmark2026 | null {
  return BENCHMARKS_INDUSTRIAS_2026[industria] || null
}

export function getAllIndustries2026(): { codigo: string; nombre: string }[] {
  return Object.values(BENCHMARKS_INDUSTRIAS_2026).map(b => ({
    codigo: b.codigo,
    nombre: b.nombre
  }))
}

export function getIndustryComparison(industria: string, userCPC: number, userCTR: number, userCVR: number): {
  cpc_vs_industry: number  // % difference (negative = better than avg)
  ctr_vs_industry: number
  cvr_vs_industry: number
} | null {
  const bench = BENCHMARKS_INDUSTRIAS_2026[industria]
  if (!bench) return null
  return {
    cpc_vs_industry: +((userCPC / bench.google_search.cpc_base - 1) * 100).toFixed(1),
    ctr_vs_industry: +((userCTR / bench.google_search.ctr_base - 1) * 100).toFixed(1),
    cvr_vs_industry: +((userCVR / bench.google_search.cvr_web - 1) * 100).toFixed(1)
  }
}
