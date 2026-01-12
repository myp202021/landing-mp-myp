import { Metadata } from 'next'

export const siteConfig = {
  name: 'Muller y Pérez - Agencia Marketing Digital, Performance, Google Ads y Redes Sociales Chile',
  description: 'Agencia marketing digital y agencia performance especializada en Google Ads, Meta Ads y redes sociales. Agencia Google Ads con equipo dedicado, métricas reales y resultados medibles. Chile.',
  url: 'https://www.mulleryperez.cl',
  ogImage: 'https://www.mulleryperez.cl/og-image.jpg', // Imagen optimizada 1200x630px
  links: {
    whatsapp: 'https://wa.me/56992258137'
  }
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/'
  },
  verification: {
    google: 'N1_98JB2O8f-9p49ys1CL0bu-_kijxbjs3aSRIZ7Syw'
  },
  keywords: [
    // Keywords principales (Tier 1 - Alta prioridad)
    'agencia marketing digital',
    'agencia de marketing digital',
    'agencia marketing digital chile',
    'agencia marketing digital santiago',
    'mejor agencia marketing digital',
    'agencia marketing digital las condes',
    'agencia marketing digital providencia',
    'agencia performance',
    'agencia performance marketing',
    'agencia google ads',
    'agencia redes sociales',

    // Keywords de intención comercial (Tier 2)
    'contratar agencia marketing digital',
    'contratar agencia marketing digital chile',
    'cuanto cuesta agencia marketing digital',
    'precios agencia marketing digital chile',
    'presupuesto agencia marketing digital',
    'planes agencia marketing digital',
    'servicios agencia marketing digital',
    'cotizar agencia marketing digital',

    // Keywords país y locales
    'google ads chile',
    'meta ads chile',
    'facebook ads chile',
    'instagram ads chile',
    'performance marketing chile',
    'publicidad digital chile',
    'agencia google ads santiago',
    'agencia performance santiago',
    'marketing digital las condes',
    'agencia publicidad providencia',
    'google ads las condes',
    'meta ads santiago',
    'publicidad online chile',
    'agencia publicidad online chile',

    // Keywords por tipo de cliente
    'agencia marketing digital para pymes',
    'agencia marketing digital pymes chile',
    'agencia marketing digital b2b',
    'agencia marketing digital b2b chile',
    'agencia marketing digital ecommerce',
    'agencia marketing digital ecommerce chile',
    'agencia marketing digital empresas',
    'agencia marketing digital retail',

    // Servicios específicos
    'gestión campañas google ads',
    'gestión campañas google ads chile',
    'gestión campañas facebook',
    'gestión campañas meta ads',
    'gestión redes sociales',
    'gestión redes sociales chile',
    'publicidad redes sociales',
    'social media marketing',
    'social media marketing chile',
    'linkedin ads chile',
    'tiktok ads chile',
    'youtube ads chile',
    'mejor agencia google ads chile',
    'mejor agencia meta ads chile',

    // Keywords comparativas y diferenciadoras
    'agencia marketing digital vs tradicional',
    'agencia performance vs agencia tradicional',
    'mejor agencia marketing digital chile',
    'agencia marketing digital con resultados',
    'agencia marketing digital especializada',
    'agencia marketing digital equipo dedicado',

    // Términos técnicos y metodología
    'ROI marketing digital',
    'ROAS',
    'CPL',
    'CPA',
    'CAC',
    'costo por lead',
    'costo por adquisición',
    'costo por cliente',
    'retorno inversión publicitaria',
    'marketing basado en datos',
    'data-driven marketing',
    'performance marketing',
    'marketing orientado a resultados',
    'estrategia digital',
    'campañas publicitarias',
    'optimización conversiones',
    'atribución marketing',
    'métricas marketing digital',

    // Equipo y diferenciadores
    'equipo marketing dedicado',
    'agencia publicidad digital',
    'consultora marketing digital',
    'especialistas google ads',
    'expertos meta ads',
    'agencia marketing digital transparente',
    'agencia marketing digital con reportes',
    'agencia marketing digital acceso full'
  ],
  authors: [{ name: 'Muller y Pérez' }],
  creator: 'Muller y Pérez',
  publisher: 'Muller y Pérez',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@mulleryper​ez'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

// Helper para crear metadata de páginas individuales
export function createMetadata({
  title,
  description,
  keywords,
  path,
  image
}: {
  title: string
  description: string
  keywords?: string[]
  path: string
  image?: string
}): Metadata {
  const url = `${siteConfig.url}${path}`
  const ogImage = image || siteConfig.ogImage

  return {
    title,
    description,
    keywords: keywords || defaultMetadata.keywords,
    openGraph: {
      title,
      description,
      url,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      }],
      type: 'website',
      locale: 'es_CL',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@mulleryper​ez'
    },
    alternates: {
      canonical: url
    }
  }
}

// JSON-LD Schema helpers
export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    name: 'Muller y Pérez',
    alternateName: 'M&P Agencia Marketing Digital',
    legalName: 'Muller y Perez SPA',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo-color.png`,
    image: siteConfig.ogImage,
    description: siteConfig.description,

    // Dirección principal - Las Condes
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av Santa María 9300',
      addressLocality: 'Las Condes',
      addressRegion: 'Región Metropolitana',
      postalCode: '7560000',
      addressCountry: 'CL'
    },

    // Ubicación geográfica (Las Condes)
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -33.3983,
      longitude: -70.5472
    },

    // Área de servicio
    areaServed: [
      {
        '@type': 'City',
        name: 'Santiago',
        '@id': 'https://www.wikidata.org/wiki/Q2887'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Región Metropolitana',
        '@id': 'https://www.wikidata.org/wiki/Q2718'
      },
      {
        '@type': 'Country',
        name: 'Chile',
        '@id': 'https://www.wikidata.org/wiki/Q298'
      }
    ],

    // Contacto
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+56992258137',
        contactType: 'customer service',
        email: 'contacto@mulleryperez.com',
        areaServed: 'CL',
        availableLanguage: ['Spanish', 'English'],
        contactOption: 'TollFree'
      },
      {
        '@type': 'ContactPoint',
        telephone: '+56992258137',
        contactType: 'sales',
        areaServed: 'CL',
        availableLanguage: 'Spanish'
      }
    ],

    // Servicios ofrecidos con precios detallados
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Gestión Google Ads',
          description: 'Gestión profesional de campañas Google Ads con equipo dedicado y optimización continua',
          serviceType: 'Marketing Digital',
          provider: {
            '@type': 'Organization',
            name: 'Muller y Pérez'
          }
        },
        price: '990000',
        priceCurrency: 'CLP',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '990000',
          priceCurrency: 'CLP',
          valueAddedTaxIncluded: 'false'
        },
        availability: 'https://schema.org/InStock',
        availableAtOrFrom: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Santiago',
            addressCountry: 'CL'
          }
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Gestión Meta Ads',
          description: 'Gestión de campañas Facebook, Instagram y WhatsApp Ads con estrategia de contenido',
          serviceType: 'Social Media Marketing',
          provider: {
            '@type': 'Organization',
            name: 'Muller y Pérez'
          }
        },
        price: '890000',
        priceCurrency: 'CLP',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '890000',
          priceCurrency: 'CLP',
          valueAddedTaxIncluded: 'false'
        },
        availability: 'https://schema.org/InStock'
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Performance Marketing Full',
          description: 'Estrategia completa de performance marketing con Google Ads, Meta Ads, analítica y optimización continua',
          serviceType: 'Performance Marketing',
          provider: {
            '@type': 'Organization',
            name: 'Muller y Pérez'
          }
        },
        price: '1490000',
        priceCurrency: 'CLP',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '1490000',
          priceCurrency: 'CLP',
          valueAddedTaxIncluded: 'false'
        },
        availability: 'https://schema.org/InStock'
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'LinkedIn Ads B2B',
          description: 'Campañas especializadas en LinkedIn para generación de leads B2B',
          serviceType: 'B2B Marketing',
          provider: {
            '@type': 'Organization',
            name: 'Muller y Pérez'
          }
        },
        price: '1190000',
        priceCurrency: 'CLP',
        availability: 'https://schema.org/InStock'
      }
    ],

    // Redes sociales y enlaces
    sameAs: [
      'https://www.instagram.com/mulleryp​erez',
      'https://www.linkedin.com/company/muller-y-perez',
      'https://www.youtube.com/@mulleryp​erez',
      'https://www.facebook.com/mulleryp​erez',
      siteConfig.links.whatsapp
    ],

    // Rating y reseñas
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '47'
    },

    // Información adicional
    foundingDate: '2019',
    slogan: 'Performance Marketing con Datos Reales',
    priceRange: '$$',
    currenciesAccepted: 'CLP, USD',
    paymentAccepted: 'Cash, Credit Card, Invoice',

    // Horarios de atención
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],

    // Áreas de conocimiento y especialización
    knowsAbout: [
      'Marketing Digital',
      'Performance Marketing',
      'Google Ads',
      'Meta Ads',
      'Facebook Ads',
      'Instagram Ads',
      'Redes Sociales',
      'Social Media Marketing',
      'Publicidad Digital',
      'ROI',
      'ROAS',
      'Data-Driven Marketing',
      'Analítica Digital',
      'Optimización de Conversiones',
      'Google Analytics',
      'Marketing Automation'
    ]
  }
}

export function createWebPageSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: siteConfig.url
    }
  }
}

export function createSoftwareAppSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CLP'
    },
    provider: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: siteConfig.url
    }
  }
}

export function createBreadcrumbSchema(items: Array<{ name: string, url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function createVideoObjectSchema(video: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  contentUrl?: string
  embedUrl?: string
  duration?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    duration: video.duration, // Formato ISO 8601: PT1M30S (1 min 30 seg)
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo-color.png`
      }
    }
  }
}

export function createFAQPageSchema(faqs: Array<{ question: string, answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

export function createServiceSchema(service: {
  name: string
  description: string
  serviceType: string
  price: string
  priceCurrency?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    provider: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: siteConfig.url
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: service.priceCurrency || 'CLP',
      availability: 'https://schema.org/InStock'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Chile'
    }
  }
}

// Article Schema para blog posts - SEO Rich Snippets
export function createArticleSchema(article: {
  title: string
  description: string
  url: string
  publishedTime: string
  modifiedTime?: string
  author?: string
  image?: string
  section?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Organization',
      name: article.author || 'Muller y Pérez',
      url: siteConfig.url
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo-color.png`
      }
    },
    image: article.image || siteConfig.ogImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    },
    articleSection: article.section || 'Marketing Digital',
    inLanguage: 'es-CL'
  }
}

// Helper para agregar canonical link en client components
export function addCanonicalLink(path: string) {
  if (typeof window === 'undefined') return

  const url = `${siteConfig.url}${path}`

  // Remover canonical existente
  const existingCanonical = document.querySelector('link[rel="canonical"]')
  if (existingCanonical && existingCanonical.parentNode) {
    existingCanonical.parentNode.removeChild(existingCanonical)
  }

  // Agregar nuevo canonical
  const link = document.createElement('link')
  link.rel = 'canonical'
  link.href = url
  document.head.appendChild(link)
}
