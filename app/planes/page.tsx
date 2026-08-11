import { Metadata } from 'next'
import PlanesClient from './PlanesClient'

export const metadata: Metadata = {
  title: 'Planes de Marketing Digital Chile 2026',
  description: 'Planes de marketing digital en Chile desde $950.000+IVA: Silver, Gold y Platinum. Google Ads, Meta Ads, contenido, email marketing y equipo dedicado. Diagnóstico inicial incluido.',
  keywords: 'planes marketing digital chile, precios agencia marketing, plan paid media, plan redes sociales, agencia marketing precios 2026',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/planes'
  },
  openGraph: {
    title: 'Planes de Marketing Digital Chile 2026',
    description: 'Planes de marketing digital en Chile desde $950.000+IVA: Silver, Gold y Platinum. Google Ads, Meta Ads, contenido, email marketing y equipo dedicado. Diagnóstico inicial incluido.',
    type: 'website',
    url: 'https://www.mulleryperez.cl/planes'
  }
}

export default function PlanesPage() {
  return <PlanesClient />
}
