import type { Metadata } from 'next'
import CalculadoraRoiClient from './CalculadoraRoiClient'

const title = 'Calculadora de inversión en Google Ads por objetivo de ventas'
const description = 'Calcula cuánto invertir en Google Ads según tu industria y tu objetivo de ventas mensuales. Herramienta gratuita de M&P Labs.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/labs/calculadora-roi' },
  openGraph: {
    title,
    description,
    url: 'https://www.mulleryperez.cl/labs/calculadora-roi',
    type: 'website',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'Muller y Pérez' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.mulleryperez.cl/og-image.jpg'] },
}

export default function Page() {
  return <CalculadoraRoiClient />
}
