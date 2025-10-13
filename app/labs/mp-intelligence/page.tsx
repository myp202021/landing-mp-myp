import { Metadata } from 'next'
import MPIntelligenceClient from './MPIntelligenceClient'

export const metadata: Metadata = {
  title: 'M&P Intelligence 2025 - Benchmarks Marketing Chile Colaborativo',
  description: 'Red colaborativa de datos de marketing en Chile. Comparte métricas anónimas y recibe benchmarks reales de tu industria. CAC, ROAS, conversión por canal. Datos reales, no inventados.',
  keywords: 'benchmarks marketing chile, metricas publicidad chile, cac promedio chile, roas por industria, datos colaborativos marketing, intelligence marketing digital chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/labs/mp-intelligence'
  },
  openGraph: {
    title: 'M&P Intelligence - Benchmarks Marketing Chile Colaborativo',
    description: 'Red colaborativa de datos de marketing. Comparte métricas anónimas y recibe benchmarks reales de tu industria en Chile.',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-intelligence.svg',
        width: 1200,
        height: 630,
        alt: 'M&P Intelligence - Benchmarks Marketing Chile | M&P'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M&P Intelligence - Benchmarks Marketing Chile Colaborativo',
    description: 'Red colaborativa de datos de marketing. Comparte métricas y recibe benchmarks reales de tu industria.',
    images: ['https://www.mulleryperez.cl/og-intelligence.svg']
  }
}

export default function Page() {
  return <MPIntelligenceClient />
}
