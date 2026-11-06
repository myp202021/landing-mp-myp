import type { Metadata } from 'next'
import UtilidadesClient from './UtilidadesClient'

const title = 'Calculadoras y herramientas de marketing digital gratis'
const description = 'Calculadoras simples de CAC, LTV, ROI y ROAS, comparador web y generador de funnels para medir las métricas clave de tu negocio digital.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/utilidades' },
  openGraph: {
    title,
    description,
    url: 'https://www.mulleryperez.cl/utilidades',
    type: 'website',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'Muller y Pérez' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.mulleryperez.cl/og-image.jpg'] },
}

export default function Page() {
  return <UtilidadesClient />
}
