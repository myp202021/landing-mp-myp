/**
 * SEO Configuration - Muller y Pérez
 * Configuración centralizada de SEO para todas las páginas
 */

export interface PageSEO {
  title: string
  description: string
  keywords: string[]
  focusKeyphrase: string
  relatedKeywords: string[]
  slug: string
  canonicalUrl: string
  ogImage: string
  schemaType: 'WebPage' | 'Article' | 'SoftwareApplication'
}

export const SEO_CONFIG: Record<string, PageSEO> = {
  // HOMEPAGE
  home: {
    title: 'Muller y Pérez - Agencia Marketing Digital y Performance Chile 2025',
    description: 'Agencia líder en Marketing de Datos Chile 2025 | ROI +380% real | Expertos Google Ads & Meta | 95% retención clientes | Desde $650k/mes → Solicita auditoría gratis',
    keywords: [
      'agencia marketing digital chile',
      'agencia marketing datos chile',
      'google ads chile',
      'meta ads chile',
      'performance marketing chile',
      'ROI',
      'ROAS',
      'CPL',
      'CPA',
      'CAC',
      'agencia publicidad digital',
      'marketing digital santiago'
    ],
    focusKeyphrase: 'agencia marketing digital chile',
    relatedKeywords: [
      'agencia google ads chile',
      'agencia meta ads santiago',
      'performance marketing datos',
      'agencia publicidad digital chile',
      'marketing digital b2b chile',
      'agencia marketing ecommerce'
    ],
    slug: '',
    canonicalUrl: 'https://www.mulleryperez.cl/',
    ogImage: 'https://www.mulleryperez.cl/og-image.svg',
    schemaType: 'WebPage'
  },

  // M&P LABS - PREDICTOR
  predictor: {
    title: 'Predictor Google Ads Chile 2025 - Calcula ROI y Conversiones Gratis',
    description: 'Predictor Google Ads con data real de +200 campañas Chile | Calcula conversiones, revenue y ROI en 60 segundos | 15 industrias | Gratis 2025 → Pruébalo ahora',
    keywords: [
      'predictor google ads chile',
      'calculadora google ads',
      'estimar conversiones google ads',
      'roi google ads chile',
      'costo por lead chile',
      'herramienta google ads gratis',
      'calcular roas google ads',
      'proyeccion google ads chile'
    ],
    focusKeyphrase: 'predictor google ads chile',
    relatedKeywords: [
      'calculadora conversiones google ads',
      'estimar roi google ads',
      'herramienta google ads gratis chile',
      'calcular cpl google ads',
      'proyectar campañas google ads',
      'simulador google ads chile'
    ],
    slug: 'labs/predictor',
    canonicalUrl: 'https://www.mulleryperez.cl/labs/predictor',
    ogImage: 'https://www.mulleryperez.cl/og-predictor.svg',
    schemaType: 'SoftwareApplication'
  },

  // M&P LABS - BUYER GEN
  buyerGen: {
    title: 'Buyer Gen 2025 - Generador de Buyer Personas IA Gratis Chile',
    description: 'Crea buyer personas con IA en 4 pasos | +12 segmentos validados | Estrategia contenido + KPIs incluidos | Basado en data intelligence Chile 2025 → Genera tu buyer gratis',
    keywords: [
      'generador buyer personas chile',
      'buyer persona gratis',
      'crear buyer persona',
      'segmentación clientes chile',
      'estrategia contenido digital',
      'ICP ideal customer profile',
      'buyer persona ia',
      'generador icp gratis'
    ],
    focusKeyphrase: 'generador buyer personas chile',
    relatedKeywords: [
      'crear buyer persona gratis',
      'herramienta buyer persona',
      'icp generator chile',
      'segmentacion audiencias b2b',
      'buyer persona ecommerce',
      'perfil cliente ideal'
    ],
    slug: 'labs/buyer-gen',
    canonicalUrl: 'https://www.mulleryperez.cl/labs/buyer-gen',
    ogImage: 'https://www.mulleryperez.cl/og-buyer-gen.svg',
    schemaType: 'SoftwareApplication'
  },

  // M&P LABS - RADAR INDUSTRIAS
  radarIndustrias: {
    title: 'Radar Industrias Chile 2025 - Madurez Digital por Sector Gratis',
    description: 'Benchmarking madurez digital Chile 2025 | Compara 15 industrias: Google Ads, ROAS, IA, Core Web Vitals | Data real +200 empresas → Explora tu sector gratis',
    keywords: [
      'madurez digital chile',
      'benchmarking digital chile',
      'google ads por industria',
      'roas por sector chile',
      'velocidad web chile',
      'transformación digital sectores',
      'competencia digital industria',
      'analisis sectorial marketing'
    ],
    focusKeyphrase: 'madurez digital chile',
    relatedKeywords: [
      'benchmarking digital industrias',
      'comparativa sectores digitales',
      'roas promedio por industria',
      'transformacion digital sectorial',
      'analisis competencia digital',
      'kpis industria chile'
    ],
    slug: 'labs/radar-industrias',
    canonicalUrl: 'https://www.mulleryperez.cl/labs/radar-industrias',
    ogImage: 'https://www.mulleryperez.cl/og-radar.svg',
    schemaType: 'SoftwareApplication'
  },

  // UTILIDADES - CALCULADORA CAC
  calculadoraCAC: {
    title: 'Calculadora CAC 2025 - Costo Adquisición Cliente Gratis Chile',
    description: 'Calcula CAC real de tus campañas 2025 | Compara Google Ads vs Meta vs LinkedIn | Evalúa LTV/CAC ratio | 3 canales simultáneos → Optimiza tu inversión gratis',
    keywords: [
      'calculadora cac chile',
      'costo adquisición cliente',
      'cac google ads',
      'cac meta ads',
      'ltv cac ratio',
      'roi por canal',
      'optimizar inversión publicitaria chile',
      'calcular costo cliente'
    ],
    focusKeyphrase: 'calculadora cac chile',
    relatedKeywords: [
      'calcular costo adquisicion cliente',
      'cac por canal marketing',
      'ltv lifetime value calculator',
      'roi por plataforma publicitaria',
      'optimizar cac google ads',
      'reducir cac campañas'
    ],
    slug: 'utilidades/calculadora-cac',
    canonicalUrl: 'https://www.mulleryperez.cl/utilidades/calculadora-cac',
    ogImage: 'https://www.mulleryperez.cl/og-cac.svg',
    schemaType: 'SoftwareApplication'
  },

  // UTILIDADES - COMPARADOR WEB
  comparadorWeb: {
    title: 'Comparador Web 2025 - PageSpeed + Core Web Vitals Gratis Chile',
    description: 'Compara tu web vs 3 competidores 2025 | PageSpeed API real | Core Web Vitals: LCP, FCP, CLS, TBT | SEO performance mobile/desktop → Analiza gratis ahora',
    keywords: [
      'comparador velocidad web chile',
      'pagespeed insights chile',
      'core web vitals',
      'lcp fcp cls',
      'velocidad web competencia',
      'seo performance chile',
      'optimizar velocidad web',
      'google pagespeed chile'
    ],
    focusKeyphrase: 'comparador velocidad web chile',
    relatedKeywords: [
      'analizar velocidad web',
      'core web vitals checker',
      'pagespeed competencia',
      'optimizacion web vitals',
      'mejorar lcp cls',
      'performance web chile'
    ],
    slug: 'utilidades/comparador-web',
    canonicalUrl: 'https://www.mulleryperez.cl/utilidades/comparador-web',
    ogImage: 'https://www.mulleryperez.cl/og-comparador.svg',
    schemaType: 'SoftwareApplication'
  },

  // UTILIDADES - GENERADOR FUNNELS
  generadorFunnels: {
    title: 'Generador Funnels 2025 - Crea Embudos CRM Gratis Chile',
    description: 'Genera embudos ventas CRM en 4 pasos 2025 | B2B, B2C, e-commerce, WhatsApp | 8 modelos validados | Export CSV HubSpot/Pipedrive → Crea tu funnel gratis',
    keywords: [
      'generador funnels chile',
      'embudo ventas crm',
      'funnel b2b chile',
      'funnel ecommerce',
      'pipedrive hubspot',
      'crm ventas chile',
      'automatización ventas',
      'crear embudo ventas'
    ],
    focusKeyphrase: 'generador funnels chile',
    relatedKeywords: [
      'crear embudo ventas crm',
      'funnel b2b b2c',
      'pipeline ventas hubspot',
      'etapas funnel ecommerce',
      'automatizar embudo ventas',
      'crm pipeline chile'
    ],
    slug: 'utilidades/generador-funnels',
    canonicalUrl: 'https://www.mulleryperez.cl/utilidades/generador-funnels',
    ogImage: 'https://www.mulleryperez.cl/og-funnels.svg',
    schemaType: 'SoftwareApplication'
  },

  // UTILIDADES - JUEGA Y APRENDE
  juegaAprende: {
    title: 'Simulador Marketing Digital 2025 - Juega y Aprende Gratis Chile',
    description: 'Simulador estrategias marketing 2025 | Invierte $1M virtual | 6 canales: Google Ads, Meta, SEO, Email, LinkedIn | Aprende ROI real jugando → Prueba gratis',
    keywords: [
      'simulador marketing digital chile',
      'juego marketing digital',
      'aprender google ads',
      'estrategia marketing digital',
      'roi marketing',
      'canales digitales chile',
      'capacitacion marketing interactiva',
      'simulador estrategias digitales'
    ],
    focusKeyphrase: 'simulador marketing digital chile',
    relatedKeywords: [
      'juego estrategia marketing',
      'aprender marketing digital jugando',
      'simulador campañas digitales',
      'capacitacion marketing interactiva',
      'roi simulador',
      'planificador marketing digital'
    ],
    slug: 'utilidades/juega-aprende',
    canonicalUrl: 'https://www.mulleryperez.cl/utilidades/juega-aprende',
    ogImage: 'https://www.mulleryperez.cl/og-juega.svg',
    schemaType: 'SoftwareApplication'
  }
}

// HELPER: Get SEO config by page key
export const getSEOConfig = (pageKey: keyof typeof SEO_CONFIG): PageSEO => {
  return SEO_CONFIG[pageKey]
}

// HELPER: Generate metadata object for Next.js
export const generateMetadata = (pageKey: keyof typeof SEO_CONFIG) => {
  const seo = getSEOConfig(pageKey)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(', '),
    alternates: {
      canonical: seo.canonicalUrl
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.title
        }
      ],
      type: seo.schemaType === 'Article' ? 'article' : 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage]
    }
  }
}

// SCHEMA HELPERS for AI Search Optimization (GEO)
export const generateAISearchSchema = (pageKey: keyof typeof SEO_CONFIG) => {
  const seo = getSEOConfig(pageKey)

  return {
    '@context': 'https://schema.org',
    '@type': seo.schemaType,
    name: seo.title,
    description: seo.description,
    url: seo.canonicalUrl,
    keywords: seo.keywords.join(', '),
    inLanguage: 'es-CL',
    about: {
      '@type': 'Thing',
      name: seo.focusKeyphrase,
      sameAs: seo.relatedKeywords.map(k => `https://www.google.com/search?q=${encodeURIComponent(k)}`)
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mulleryperez.cl/logo-color.png'
      }
    }
  }
}
