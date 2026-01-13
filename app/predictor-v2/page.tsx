import { Metadata } from 'next'
import PredictorV2Client from './PredictorV2Client'

export const metadata: Metadata = {
  title: 'Predictor v2 - Diagnóstico Consultivo | Muller y Pérez',
  description: 'Sistema de diagnóstico consultivo para marketing digital. Analiza tu negocio y recibe recomendaciones personalizadas de plataformas y campañas.',
  robots: 'noindex, nofollow', // URL de prueba, no indexar
  alternates: {
    canonical: 'https://www.mulleryperez.cl/predictor-v2'
  }
}

export default function PredictorV2Page() {
  return <PredictorV2Client />
}
