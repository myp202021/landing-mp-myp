import { Metadata } from 'next'
import PredictorV2Client from './PredictorV2Client'

// Schema estructurado para SEO y AI Search
const predictorSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Predictor de Marketing Digital Chile 2025',
  description: 'Herramienta gratuita de diagnóstico consultivo para campañas de Google Ads y Meta Ads. Analiza viabilidad, recomienda plataformas y proyecta ROI para 12 industrias en Chile.',
  url: 'https://www.mulleryperez.cl/labs/predictor',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CLP'
  },
  creator: {
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl'
  },
  featureList: [
    'Diagnóstico de viabilidad para paid media',
    'Recomendación de plataforma (Google vs Meta vs LinkedIn)',
    'Proyección de ROAS, conversiones y revenue',
    'Análisis de 12 industrias con data real de Chile',
    'Distribución óptima de presupuesto',
    'Alertas de riesgo económico'
  ]
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es el Predictor de Marketing Digital?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Es una herramienta gratuita que analiza tu negocio y te dice si vale la pena invertir en publicidad digital. Te recomienda qué plataforma usar (Google, Meta o LinkedIn) y proyecta cuánto podrías ganar.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cómo funciona el diagnóstico consultivo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El predictor analiza tu industria, ticket promedio, presupuesto y objetivo de marketing. Calcula el ROAS esperado y te indica si el proyecto es viable económicamente o si perderías dinero.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Para qué industrias funciona?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Funciona para 12 industrias: E-commerce, SaaS/Tecnología, Fintech, Inmobiliaria, Salud, Educación, Servicios Profesionales, Automotriz, Turismo, Gastronomía, Moda/Retail y Belleza.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué diferencia hay entre Google Ads y Meta Ads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Google Ads captura demanda activa (personas buscando tu producto). Meta Ads genera demanda (personas que no te buscaban pero podrían interesarse). El predictor te dice cuál es mejor para tu caso.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué es el ROAS y cómo se calcula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ROAS (Return On Ad Spend) es el retorno sobre la inversión publicitaria. Se calcula dividiendo los ingresos generados por la inversión en ads. Un ROAS de 4x significa que por cada peso invertido, recuperas 4 pesos. Un ROAS menor a 1x indica pérdidas.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuánto presupuesto necesito para publicidad digital en Chile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El presupuesto mínimo viable depende de tu industria y ticket promedio. En general, recomendamos al menos $500.000 CLP/mes para Google Ads y $300.000 CLP/mes para Meta Ads. El predictor calcula el presupuesto óptimo para tu caso específico.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué es el CPL (Costo por Lead)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El CPL es el costo que pagas en promedio para conseguir un lead o prospecto. Varía por industria: en E-commerce puede ser $4.000-$8.000 CLP, mientras que en Fintech o B2B puede superar los $50.000 CLP por la mayor complejidad de la venta.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo toma ver resultados en Google Ads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Las campañas de Google Ads necesitan 2-4 semanas de aprendizaje inicial. Los resultados óptimos se alcanzan entre el mes 3 y 4, cuando el algoritmo ha acumulado suficiente data para optimizar. El predictor proyecta esta curva de maduración.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Por qué mi negocio podría no ser viable para paid media?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un negocio no es viable para paid media cuando el ticket promedio es muy bajo respecto al CPC de la industria, o cuando el margen no soporta el costo de adquisición. El predictor te alerta si tu ROAS proyectado es menor a 1x (pérdida de dinero).'
      }
    },
    {
      '@type': 'Question',
      name: '¿Qué datos necesito para usar el Predictor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Solo necesitas 4 datos: tu industria, ticket promedio (valor de venta), presupuesto mensual disponible y objetivo de marketing. Opcionalmente puedes agregar información sobre tu etapa de negocio y assets de contenido para un diagnóstico más preciso.'
      }
    }
  ]
}

export const metadata: Metadata = {
  title: 'Predictor Marketing Digital Chile 2025 - Diagnóstico Gratis | M&P Labs',
  description: 'Herramienta gratuita: analiza tu negocio y descubre si Google Ads o Meta Ads es mejor para ti. Proyección de ROAS, conversiones y recomendaciones para 12 industrias en Chile.',
  keywords: 'predictor google ads chile, calculadora meta ads, roas estimado, diagnóstico marketing digital, herramienta gratuita publicidad, simulador campañas chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/labs/predictor'
  },
  openGraph: {
    title: 'Predictor Marketing Digital Chile 2025 - Diagnóstico Gratuito',
    description: 'Analiza tu negocio en 2 minutos. Descubre si vale la pena invertir en Google Ads o Meta Ads y cuánto podrías ganar. 12 industrias, data real de Chile.',
    url: 'https://www.mulleryperez.cl/labs/predictor',
    siteName: 'Muller y Pérez',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-predictor.svg',
        width: 1200,
        height: 630,
        alt: 'Predictor Marketing Digital Chile 2025'
      }
    ],
    locale: 'es_CL',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Predictor Marketing Digital Chile 2025 - Diagnóstico Gratis',
    description: 'Analiza tu negocio y descubre qué plataforma te conviene. Google Ads vs Meta Ads vs LinkedIn. Proyección de ROAS para 12 industrias.',
    images: ['https://www.mulleryperez.cl/og-predictor.svg']
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function PredictorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(predictorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PredictorV2Client />
    </>
  )
}
