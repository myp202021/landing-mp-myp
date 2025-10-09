import { Metadata } from 'next'

export const siteConfig = {
  name: 'Muller y Pérez - Agencia Marketing Digital y Performance Chile',
  description: 'Agencia de marketing digital especializada en Google Ads, Meta Ads y estrategias de performance. Equipo dedicado, métricas reales, resultados medibles. Chile.',
  url: 'https://www.mulleryperez.cl',
  ogImage: 'https://www.mulleryperez.cl/og-image.svg', // TODO: Convertir a JPG 1200x630
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
  verification: {
    google: 'N1_98JB2O8f-9p49ys1CL0bu-_kijxbjs3aSRIZ7Syw'
  },
  keywords: [
    'agencia marketing digital chile',
    'google ads chile',
    'meta ads chile',
    'facebook ads chile',
    'instagram ads chile',
    'performance marketing',
    'performance marketing chile',
    'publicidad digital chile',
    'agencia publicidad digital',
    'ROI',
    'ROAS',
    'CPL',
    'CPA',
    'CAC',
    'costo por lead',
    'costo por adquisición',
    'retorno inversión publicitaria',
    'marketing basado en datos',
    'data-driven marketing',
    'agencia google ads',
    'agencia meta ads',
    'linkedin ads chile',
    'tiktok ads chile',
    'estrategia digital chile',
    'campañas publicitarias',
    'gestión campañas google ads',
    'gestión campañas facebook',
    'equipo marketing dedicado'
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
    image: `${siteConfig.url}/og-image.svg`,
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

    // Servicios ofrecidos
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Google Ads Management',
          description: 'Gestión profesional de campañas Google Ads'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Meta Ads Management',
          description: 'Gestión de campañas Facebook e Instagram Ads'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Performance Marketing',
          description: 'Estrategias de marketing basadas en datos y resultados medibles'
        }
      }
    ],

    // Redes sociales y enlaces
    sameAs: [
      siteConfig.links.whatsapp
    ],

    // Información adicional
    foundingDate: '2019',
    slogan: 'Performance Marketing con Datos Reales',
    priceRange: '$$',
    currenciesAccepted: 'CLP, USD',
    paymentAccepted: 'Cash, Credit Card, Invoice'
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
