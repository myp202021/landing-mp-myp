import type { Metadata } from 'next'
import AdsLanding from './AdsLanding'

export const metadata: Metadata = {
  title: 'Agencia de Marketing Digital y Performance | Muller y Pérez',
  description:
    'Agencia de marketing digital en Chile especializada en Google Ads, Meta Ads y performance marketing. Equipo dedicado, métricas de negocio reales y sin contrato de permanencia.',
  keywords: [
    'agencia marketing digital',
    'agencia marketing digital chile',
    'agencia performance marketing',
    'agencia google ads chile',
    'agencia meta ads chile',
    'agencia publicidad digital',
    'marketing digital santiago',
    'agencia de performance',
    'marketing basado en datos',
    'agencia paid media chile',
  ],
  openGraph: {
    title: 'Agencia de Marketing Digital y Performance | Muller y Pérez',
    description:
      'Equipo dedicado, métricas de negocio reales, sin contrato de permanencia. +40 clientes activos en +15 industrias.',
    url: 'https://www.mulleryperez.cl/ads',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.mulleryperez.cl/ads' },
  robots: { index: true, follow: true },
}

export default function AdsPage() {
  return <AdsLanding />
}
