import { Metadata } from 'next'
import PredictorClient from './PredictorClient'

export const metadata: Metadata = {
  title: 'Predictor Google Ads Chile 2025 - Calcula ROI y Conversiones Gratis',
  description: 'Predictor Google Ads con data real de +200 campañas Chile | Calcula conversiones, revenue y ROI en 60 segundos | 15 industrias | Gratis 2025 → Pruébalo ahora',
  keywords: 'predictor google ads chile, calculadora google ads, estimar conversiones google ads, roi google ads chile, costo por lead chile, herramienta google ads gratis',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/labs/predictor'
  },
  openGraph: {
    title: 'Predictor Google Ads Chile 2025 - Calcula ROI y Conversiones Gratis',
    description: 'Predictor Google Ads con data real de +200 campañas Chile | Calcula conversiones, revenue y ROI en 60 segundos | 15 industrias | Gratis 2025',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-predictor.svg',
        width: 1200,
        height: 630,
        alt: 'Predictor Google Ads Chile'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Predictor Google Ads Chile 2025 - Calcula ROI y Conversiones Gratis',
    description: 'Predictor Google Ads con data real de +200 campañas Chile | Calcula conversiones, revenue y ROI en 60 segundos | 15 industrias',
    images: ['https://www.mulleryperez.cl/og-predictor.svg']
  }
}

export default function PredictorPage() {
  return <PredictorClient />
}
