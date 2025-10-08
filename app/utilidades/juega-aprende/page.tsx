import { Metadata } from 'next'
import JuegaClient from './JuegaClient'

export const metadata: Metadata = {
  title: 'Simulador Marketing Digital 2025 - Juega y Aprende Gratis Chile',
  description: 'Simulador estrategias marketing 2025 | Invierte $1M virtual | 6 canales: Google Ads, Meta, SEO, Email, LinkedIn | Aprende ROI real jugando → Prueba gratis',
  keywords: 'simulador marketing digital chile, juego marketing digital, aprender google ads, estrategia marketing digital, roi marketing, canales digitales chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/utilidades/juega-aprende'
  },
  openGraph: {
    title: 'Simulador Marketing Digital 2025 - Juega y Aprende Gratis Chile',
    description: 'Simulador estrategias marketing 2025 | Invierte $1M virtual | 6 canales: Google Ads, Meta, SEO, Email, LinkedIn | Aprende ROI real jugando',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-juega.svg',
        width: 1200,
        height: 630,
        alt: 'Simulador Marketing Digital - Crea tu Estrategia | M&P'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simulador Marketing Digital 2025 - Juega y Aprende Gratis Chile',
    description: 'Simulador estrategias marketing 2025 | Invierte $1M virtual | 6 canales: Google Ads, Meta, SEO, Email, LinkedIn | Aprende ROI real jugando',
    images: ['https://www.mulleryperez.cl/og-juega.svg']
  }
}

export default function Page() {
  return <JuegaClient />
}
