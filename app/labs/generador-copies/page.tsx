import type { Metadata } from 'next'
import GeneradorCopiesClient from './GeneradorCopiesClient'

const title = 'Generador de copies para anuncios con IA — M&P Labs'
const description = 'Genera headlines, descripciones y textos para anuncios de Google Ads, Meta, TikTok y LinkedIn en segundos. Herramienta gratuita de M&P Labs.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/labs/generador-copies' },
  openGraph: {
    title,
    description,
    url: 'https://www.mulleryperez.cl/labs/generador-copies',
    type: 'website',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'Muller y Pérez' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.mulleryperez.cl/og-image.jpg'] },
}

export default function Page() {
  return <GeneradorCopiesClient />
}
