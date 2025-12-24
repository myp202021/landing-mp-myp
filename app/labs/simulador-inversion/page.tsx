import { Metadata } from 'next'
import SimuladorClient from './SimuladorClient'

export const metadata: Metadata = {
  title: 'Simulador de Inversion Digital | M&P Labs',
  description: 'Evalua si tu negocio esta preparado para invertir en marketing digital. Simulador anti-humo con Score M&P, diagnosticos honestos y stress test de escenarios.',
  keywords: ['simulador inversion', 'marketing digital', 'ROI marketing', 'calculadora CAC', 'M&P Labs', 'decision inversion'],
  openGraph: {
    title: 'Simulador de Inversion Digital | M&P Labs',
    description: 'Evalua si tu negocio esta preparado para invertir en marketing digital. Diagnosticos honestos y stress test.',
    url: 'https://www.mulleryperez.cl/labs/simulador-inversion',
    type: 'website',
    images: [{ url: '/og-simulador.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simulador de Inversion Digital | M&P Labs',
    description: 'Evalua si tu negocio esta preparado para invertir en marketing digital.'
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/labs/simulador-inversion'
  }
}

export default function SimuladorInversionPage() {
  return <SimuladorClient />
}
