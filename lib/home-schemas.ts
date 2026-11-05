/* Schemas JSON-LD del home (extraídos de LandingClient, nov 2026) */
export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  name: 'Muller y Pérez',
  description: 'Agencia de marketing digital y performance marketing especializada en Google Ads, Meta Ads y estrategias data-driven',
  url: 'https://www.mulleryperez.cl',
  telephone: '+56992258137',
  email: 'contacto@mulleryperez.cl',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Badajoz 100, Of 523',
    addressLocality: 'Las Condes',
    addressRegion: 'Región Metropolitana',
    postalCode: '7550000',
    addressCountry: 'CL'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '-33.4169',
    longitude: '-70.6036'
  },
  priceRange: '$$',
  serviceArea: {
    '@type': 'Country',
    name: 'Chile'
  },
  areaServed: 'CL',
  knowsAbout: ['Google Ads', 'Meta Ads', 'Performance Marketing', 'Marketing Digital', 'ROI', 'ROAS', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads', 'TikTok Ads'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Marketing Digital',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Google Ads Management',
          description: 'Gestión profesional de campañas Google Ads con equipo dedicado'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Meta Ads Management',
          description: 'Gestión de campañas en Facebook e Instagram Ads'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Performance Marketing',
          description: 'Estrategias de marketing basadas en datos y resultados medibles'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'LinkedIn Ads',
          description: 'Campañas B2B en LinkedIn para generación de leads calificados'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'TikTok Ads',
          description: 'Publicidad en TikTok para alcance y engagement'
        }
      }
    ]
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    ratingCount: '115'
  }
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Muller y Pérez',
  url: 'https://www.mulleryperez.cl',
  logo: 'https://www.mulleryperez.cl/logo-color.png',
  description: 'Agencia de marketing digital y performance marketing con más de 7 años de experiencia en Chile',
  foundingDate: '2020',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Badajoz 100, Of 523',
    addressLocality: 'Las Condes',
    addressRegion: 'Región Metropolitana',
    postalCode: '7550000',
    addressCountry: 'CL'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+56992258137',
    contactType: 'Customer Service',
    email: 'contacto@mulleryperez.cl',
    availableLanguage: 'Spanish'
  },
  sameAs: [
    'https://www.linkedin.com/company/m%C3%BCller-y-p%C3%A9rez/',
    'https://www.instagram.com/mulleryperez',
    'https://www.youtube.com/channel/UCgzocZZQLNnthZ82oEyblrA',
    'https://www.facebook.com/mulleryperez'
  ]
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cómo miden los resultados en Muller y Pérez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Medimos CPL (Costo por Lead), CPA (Costo por Adquisición), CAC (Costo de Adquisición de Cliente) y ROAS (Retorno de Inversión Publicitaria) - métricas de negocio real, no vanity metrics como impresiones o likes.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué incluye el equipo dedicado de Muller y Pérez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cada cliente cuenta con un equipo dedicado de 3 profesionales: un Paid Media Planner para estrategia y reportería, un Publicista para relato de marca y competencia, y un Diseñador para crear piezas visuales y contenido.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuál es el precio de los servicios de Muller y Pérez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Los planes comienzan desde $950.000 + IVA mensuales. Contamos con tres planes: Silver, Gold y Platinum, cada uno con diferentes niveles de campañas y servicios incluidos. Actualmente tenemos precios especiales los primeros 6 meses de funcionamiento.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Requieren contrato de permanencia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, en Muller y Pérez no trabajamos con contratos de permanencia. Si no funciona, te vas cuando quieras. Los clientes se quedan por resultados, no por obligaciones contractuales.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué plataformas publicitarias manejan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gestionamos campañas en Google Ads, Meta Ads (Facebook e Instagram), LinkedIn Ads y TikTok Ads. Cada plataforma se selecciona según los objetivos de negocio y el público objetivo del cliente.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué tipo de reportería entregan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Entregamos reportería ejecutiva semanal con KPIs clave y reportes mensuales completos que incluyen métricas de negocio, benchmark de competencia y plan para el próximo mes. También ofrecemos acceso 24/7 a las cuentas publicitarias para total transparencia.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué es una agencia de performance marketing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Una agencia de performance marketing es aquella que cobra y optimiza basándose en resultados medibles como conversiones, ventas o leads. En M&P trabajamos con modelo de performance, donde tu inversión está directamente ligada a resultados reales de negocio, no a métricas de vanidad.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta una agencia de marketing digital en Chile en 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Los costos de una agencia de marketing digital en Chile varían desde $950.000/mes hasta $2.5M/mes dependiendo del alcance y nivel de servicio. En M&P ofrecemos planes Silver ($950k), Gold ($1.500.000) y Platinum ($2.5M), todos con equipo dedicado de 3 profesionales y reportería semanal incluida.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué es marketing basado en datos o data-driven marketing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El marketing basado en datos (data-driven marketing) usa información real de comportamiento de usuarios para tomar decisiones estratégicas. En lugar de confiar en intuición o métricas como "me gusta" o "impresiones", nos enfocamos en CPL, CPA, CAC y ROAS para optimizar cada peso invertido en publicidad digital.'
      }
    }
  ]
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Performance Marketing',
  provider: {
    '@type': 'Organization',
    name: 'Muller y Pérez'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Chile'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Planes de Marketing Digital',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Plan Silver',
        price: '950000',
        priceCurrency: 'CLP',
        description: 'Google Ads + Meta Ads, 8 contenidos orgánicos al mes, jornada de grabación, reunión y reporte quincenal'
      },
      {
        '@type': 'Offer',
        name: 'Plan Gold',
        price: '1500000',
        priceCurrency: 'CLP',
        description: 'Google Ads + Meta Ads, 16 contenidos orgánicos al mes, auditoría SEO, panel de seguimiento diario, reunión y reporte semanal'
      },
      {
        '@type': 'Offer',
        name: 'Plan Platinum',
        price: '2500000',
        priceCurrency: 'CLP',
        description: 'Google Ads + Meta Ads, 24 contenidos orgánicos al mes, auditoría SEO, agentes IA, dashboard en vivo y review mensual'
      }
    ]
  }
}

