import { Metadata } from 'next'

export const siteConfig = {
  name: 'Muller y Pérez - Marketing Digital',
  description: 'Agencia de marketing digital especializada en Google Ads, Meta Ads y estrategias de conversión en Chile',
  url: 'https://agencia.mulleryperez.cl',
  ogImage: 'https://agencia.mulleryperez.cl/og-image.jpg',
  links: {
    whatsapp: 'https://wa.me/56992225813'
  }
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    'marketing digital chile',
    'google ads chile',
    'meta ads chile',
    'publicidad digital',
    'agencia marketing digital',
    'ROI marketing',
    'conversiones digitales',
    'estrategia digital'
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
  },
  verification: {
    google: 'your-google-verification-code', // Reemplazar con código real
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
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
      addressLocality: 'Chile'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+56992225813',
      contactType: 'customer service',
      areaServed: 'CL',
      availableLanguage: 'Spanish'
    },
    sameAs: [
      siteConfig.links.whatsapp
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
