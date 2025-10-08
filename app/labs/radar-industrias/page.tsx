import { Metadata } from 'next'
import RadarClient from './RadarClient'

export const metadata: Metadata = {
  title: 'Radar Industrias Chile 2025 - Madurez Digital por Sector Gratis',
  description: 'Benchmarking madurez digital Chile 2025 | Compara 15 industrias: Google Ads, ROAS, IA, Core Web Vitals | Data real +200 empresas → Explora tu sector gratis',
  keywords: 'madurez digital chile, benchmarking digital chile, google ads por industria, roas por sector chile, velocidad web chile, transformación digital sectores',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/labs/radar-industrias'
  },
  openGraph: {
    title: 'Radar Industrias Chile 2025 - Madurez Digital por Sector Gratis',
    description: 'Benchmarking madurez digital Chile 2025 | Compara 15 industrias: Google Ads, ROAS, IA, Core Web Vitals | Data real +200 empresas',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-radar.svg',
        width: 1200,
        height: 630,
        alt: 'Radar de Industrias Chile 2024 - Madurez Digital | M&P Labs'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radar Industrias Chile 2025 - Madurez Digital por Sector Gratis',
    description: 'Benchmarking madurez digital Chile 2025 | Compara 15 industrias: Google Ads, ROAS, IA, Core Web Vitals | Data real +200 empresas',
    images: ['https://www.mulleryperez.cl/og-radar.svg']
  }
}

export default function Page() {
  return <RadarClient />
}
