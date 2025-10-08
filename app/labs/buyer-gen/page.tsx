import { Metadata } from 'next'
import BuyerGenClient from './BuyerGenClient'

export const metadata: Metadata = {
  title: 'Buyer Gen 2025 - Generador de Buyer Personas IA Gratis Chile',
  description: 'Crea buyer personas con IA en 4 pasos | +12 segmentos validados | Estrategia contenido + KPIs incluidos | Basado en data intelligence Chile 2025 → Genera tu buyer gratis',
  keywords: 'generador buyer personas chile, buyer persona gratis, crear buyer persona, segmentación clientes chile, estrategia contenido digital, ICP ideal customer profile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/labs/buyer-gen'
  },
  openGraph: {
    title: 'Buyer Gen 2025 - Generador de Buyer Personas IA Gratis Chile',
    description: 'Crea buyer personas con IA en 4 pasos | +12 segmentos validados | Estrategia contenido + KPIs incluidos | Basado en data intelligence Chile 2025',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-buyer-gen.svg',
        width: 1200,
        height: 630,
        alt: 'Buyer Gen - Generador de Buyer Personas Gratis | M&P Labs'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buyer Gen 2025 - Generador de Buyer Personas IA Gratis Chile',
    description: 'Crea buyer personas con IA en 4 pasos | +12 segmentos validados | Estrategia contenido + KPIs incluidos | Basado en data intelligence Chile',
    images: ['https://www.mulleryperez.cl/og-buyer-gen.svg']
  }
}

export default function Page() {
  return <BuyerGenClient />
}
