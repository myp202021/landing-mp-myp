import { Metadata } from 'next'
import ROIROASClient from './ROIROASClient'

export const metadata: Metadata = {
  title: 'Calculadora ROI ROAS 2025 - Rentabilidad Campañas Gratis Chile',
  description: 'Calcula ROI y ROAS real de tus campañas 2025 | Compara rentabilidad por canal | Evalúa margen de ganancia | Google Ads, Meta, LinkedIn → Optimiza inversión gratis',
  keywords: 'calculadora roi chile, calculadora roas, roi google ads, roas meta ads, rentabilidad campañas digitales, optimizar inversión publicitaria chile, margen ganancia',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/utilidades/calculadora-roi-roas'
  },
  openGraph: {
    title: 'Calculadora ROI ROAS 2025 - Rentabilidad Campañas Gratis Chile',
    description: 'Calcula ROI y ROAS real de tus campañas 2025 | Compara rentabilidad por canal | Evalúa margen de ganancia | Optimiza inversión gratis',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-roi-roas.svg',
        width: 1200,
        height: 630,
        alt: 'Calculadora ROI ROAS - Rentabilidad Campañas Gratis | M&P'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora ROI ROAS 2025 - Rentabilidad Campañas Gratis Chile',
    description: 'Calcula ROI y ROAS real de tus campañas 2025 | Compara rentabilidad por canal | Evalúa margen de ganancia',
    images: ['https://www.mulleryperez.cl/og-roi-roas.svg']
  }
}

export default function Page() {
  return <ROIROASClient />
}
