import { Metadata } from 'next'
import CACClient from './CACClient'

export const metadata: Metadata = {
  title: 'Calculadora CAC 2025 - Costo Adquisición Cliente Gratis Chile',
  description: 'Calcula CAC real de tus campañas 2025 | Compara Google Ads vs Meta vs LinkedIn | Evalúa LTV/CAC ratio | 3 canales simultáneos → Optimiza tu inversión gratis',
  keywords: 'calculadora cac chile, costo adquisición cliente, cac google ads, cac meta ads, ltv cac ratio, roi por canal, optimizar inversión publicitaria chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/utilidades/calculadora-cac'
  },
  openGraph: {
    title: 'Calculadora CAC 2025 - Costo Adquisición Cliente Gratis Chile',
    description: 'Calcula CAC real de tus campañas 2025 | Compara Google Ads vs Meta vs LinkedIn | Evalúa LTV/CAC ratio | 3 canales simultáneos',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-cac.svg',
        width: 1200,
        height: 630,
        alt: 'Calculadora CAC - Costo Adquisición Cliente Gratis | M&P'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora CAC 2025 - Costo Adquisición Cliente Gratis Chile',
    description: 'Calcula CAC real de tus campañas 2025 | Compara Google Ads vs Meta vs LinkedIn | Evalúa LTV/CAC ratio | 3 canales simultáneos',
    images: ['https://www.mulleryperez.cl/og-cac.svg']
  }
}

export default function Page() {
  return <CACClient />
}
