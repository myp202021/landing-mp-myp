import type { Metadata } from 'next'
import ReporteCompetenciaClient from './ReporteCompetenciaClient'

const title = 'Radar de competencia publicitaria Chile — M&P Labs'
const description = 'Qué categorías están en tendencia, cuántos anuncios lanzan tus competidores y qué formatos dominan el mercado publicitario chileno.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/labs/reporte-competencia' },
  openGraph: {
    title,
    description,
    url: 'https://www.mulleryperez.cl/labs/reporte-competencia',
    type: 'website',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'Muller y Pérez' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.mulleryperez.cl/og-image.jpg'] },
}

export default function Page() {
  return <ReporteCompetenciaClient />
}
