import type { Metadata } from 'next'
import LabsClient from './LabsClient'

const title = 'M&P Labs: herramientas de marketing digital con datos e IA'
const description = 'Predictores, comparadores y herramientas con IA de Muller y Pérez para tomar mejores decisiones de inversión publicitaria en Chile.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/labs' },
  openGraph: {
    title,
    description,
    url: 'https://www.mulleryperez.cl/labs',
    type: 'website',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'Muller y Pérez' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.mulleryperez.cl/og-image.jpg'] },
}

export default function Page() {
  return <LabsClient />
}
