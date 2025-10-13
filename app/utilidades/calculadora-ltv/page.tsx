import { Metadata } from 'next'
import LTVClient from './LTVClient'

export const metadata: Metadata = {
  title: 'Calculadora LTV 2025 - Valor Tiempo Vida Cliente Gratis Chile',
  description: 'Calcula LTV (Lifetime Value) real de tus clientes 2025 | Proyecta ingresos por cliente | Evalúa LTV/CAC ratio | B2B y B2C → Optimiza retención y rentabilidad gratis',
  keywords: 'calculadora ltv chile, lifetime value, valor tiempo vida cliente, ltv cac ratio, retención clientes, churn rate chile, proyección ingresos clientes',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/utilidades/calculadora-ltv'
  },
  openGraph: {
    title: 'Calculadora LTV 2025 - Valor Tiempo Vida Cliente Gratis Chile',
    description: 'Calcula LTV (Lifetime Value) real de tus clientes 2025 | Proyecta ingresos por cliente | Evalúa LTV/CAC ratio | Optimiza retención',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-ltv.svg',
        width: 1200,
        height: 630,
        alt: 'Calculadora LTV - Valor Tiempo Vida Cliente Gratis | M&P'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora LTV 2025 - Valor Tiempo Vida Cliente Gratis Chile',
    description: 'Calcula LTV (Lifetime Value) real de tus clientes 2025 | Proyecta ingresos por cliente | Evalúa LTV/CAC ratio',
    images: ['https://www.mulleryperez.cl/og-ltv.svg']
  }
}

export default function Page() {
  return <LTVClient />
}
