import type { Metadata } from 'next'
import EbookMarketingDatos2025Client from './EbookMarketingDatos2025Client'

const title = 'Ebook Marketing de Datos 2025: datos e IA para reducir CAC'
const description = 'Ebook gratuito de Muller y Pérez: cómo las empresas en Chile usan datos e IA para reducir el CAC, mejorar el ROI y escalar campañas de forma predecible.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/recursos/ebook-marketing-datos-2025' },
  openGraph: {
    title,
    description,
    url: 'https://www.mulleryperez.cl/recursos/ebook-marketing-datos-2025',
    type: 'website',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'Muller y Pérez' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['https://www.mulleryperez.cl/og-image.jpg'] },
}

export default function Page() {
  return <EbookMarketingDatos2025Client />
}
