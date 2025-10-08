/**
 * M&P Landing Page v3 - Server Component with Metadata
 * Landing de alta conversión - Performance Marketing con datos reales
 * SEO Optimizado - Nivel Mundial
 */

import { Metadata } from 'next'
import LandingClient from './LandingClient'

export const metadata: Metadata = {
  title: 'Muller y Pérez - Agencia Marketing Digital y Performance Chile 2025',
  description: 'Agencia de marketing y performance líder en marketing de datos en Chile expertos en Google Ads Meta y campañas digitales',
  keywords: 'agencia marketing digital chile, agencia marketing datos chile, google ads chile, meta ads chile, performance marketing chile, ROI, ROAS, CPL, CPA, CAC, agencia publicidad digital, marketing digital santiago',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/'
  },
  openGraph: {
    title: 'Muller y Pérez - Agencia Marketing Digital y Performance Chile 2025',
    description: 'Agencia de marketing y performance líder en marketing de datos en Chile expertos en Google Ads Meta y campañas digitales',
    type: 'website',
    url: 'https://www.mulleryperez.cl',
    locale: 'es_CL',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Muller y Pérez - Agencia Marketing Digital'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muller y Pérez - Agencia Marketing Digital y Performance Chile 2025',
    description: 'Agencia de marketing y performance líder en marketing de datos en Chile expertos en Google Ads Meta y campañas digitales',
    images: ['https://www.mulleryperez.cl/og-image.svg']
  }
}

export default function LandingPage() {
  return <LandingClient />
}
