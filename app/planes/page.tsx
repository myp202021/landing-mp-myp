import { Metadata } from 'next'
import PlanesClient from './PlanesClient'

export const metadata: Metadata = {
  title: 'Planes de Marketing Digital Chile 2025 | Muller y Pérez',
  description: 'Planes desde $950.000: Silver, Gold y Platinum. Paid Media, RRSS, Email Marketing e Influencers. Diagnóstico inicial incluido.',
  keywords: 'planes marketing digital chile, precios agencia marketing, plan paid media, plan redes sociales, agencia marketing precios 2025',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/planes'
  },
  openGraph: {
    title: 'Planes de Marketing Digital Chile 2025 | Muller y Pérez',
    description: '3 planes desde $950K: Silver, Gold y Platinum. Equipo dedicado + diagnóstico inicial.',
    type: 'website',
    url: 'https://www.mulleryperez.cl/planes'
  }
}

export default function PlanesPage() {
  return <PlanesClient />
}
