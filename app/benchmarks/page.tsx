import { Metadata } from 'next'
import Link from 'next/link'
import BenchmarksClient from './BenchmarksClient'

export const metadata: Metadata = {
  title: 'Benchmarks Marketing Digital Chile 2025: CPC, CPL, CPA, ROAS por Industria',
  description: 'Benchmarks actualizados Q1 2025: CPC, CPL, CPA, ROAS y tasas de conversión por industria en Chile. Datos reales de +200 campañas. Descarga PDF gratis.',
  keywords: 'benchmarks marketing digital chile, cpc promedio chile, cpl chile 2025, cpa google ads, roas por industria, conversion rate chile, benchmarks google ads',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/benchmarks'
  },
  openGraph: {
    title: 'Benchmarks Marketing Digital Chile 2025',
    description: 'CPC, CPL, CPA, ROAS por industria. Datos reales +200 campañas. PDF gratis.',
    type: 'website',
    url: 'https://www.mulleryperez.cl/benchmarks'
  }
}

export default function BenchmarksPage() {
  return <BenchmarksClient />
}

