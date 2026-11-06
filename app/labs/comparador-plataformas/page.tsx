import type { Metadata } from 'next'
import ComparadorPlataformasClient from './ComparadorPlataformasClient'

const title = 'Comparador Google Ads vs Meta vs LinkedIn por industria'
const description = '¿Google Ads, Meta o LinkedIn? Compara qué plataforma te conviene según benchmarks de tu industria en Chile. Herramienta gratuita de M&P Labs.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/labs/comparador-plataformas' },
  openGraph: {
    title,
    description,
    url: 'https://www.mulleryperez.cl/labs/comparador-plataformas',
    type: 'website',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'Muller y Pérez' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.mulleryperez.cl/og-image.jpg'] },
}

export default function Page() {
  return <ComparadorPlataformasClient />
}
