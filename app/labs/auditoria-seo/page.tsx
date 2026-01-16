import { Metadata } from 'next'
import AuditoriaClient from './AuditoriaClient'

export const metadata: Metadata = {
  title: 'Auditoría SEO Gratis | Analiza tu Sitio Web | M&P Labs',
  description: 'Herramienta gratuita de auditoría SEO. Analiza tu sitio web y descubre errores de meta tags, headings, imágenes, velocidad y más. Reporte instantáneo.',
  keywords: ['auditoría SEO gratis', 'análisis SEO', 'revisar SEO sitio web', 'herramienta SEO Chile', 'M&P Labs', 'SEO checker'],
  openGraph: {
    title: 'Auditoría SEO Gratis | M&P Labs',
    description: 'Analiza tu sitio web gratis y descubre problemas SEO. Meta tags, headings, imágenes, velocidad y más.',
    url: 'https://www.mulleryperez.cl/labs/auditoria-seo',
    type: 'website',
    images: [{ url: '/og-auditoria-seo.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auditoría SEO Gratis | M&P Labs',
    description: 'Analiza tu sitio web gratis y descubre problemas SEO.'
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/labs/auditoria-seo'
  }
}

// Schema JSON-LD para la herramienta
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Auditoría SEO Gratis - M&P Labs',
  description: 'Herramienta gratuita de auditoría SEO. Analiza meta tags, headings, imágenes, velocidad y schema markup de cualquier sitio web.',
  url: 'https://www.mulleryperez.cl/labs/auditoria-seo',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CLP'
  },
  provider: {
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl'
  },
  featureList: [
    'Análisis de meta tags',
    'Revisión de headings H1-H6',
    'Auditoría de imágenes y alt text',
    'Detección de Schema Markup',
    'Verificación HTTPS',
    'Medición de velocidad de carga'
  ]
}

export default function AuditoriaSEOPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuditoriaClient />
    </>
  )
}
