import { Metadata } from 'next'
import PredictorV4Client from './PredictorV4Client'

// Schema estructurado para SEO y AI Search
const predictorSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Predictor de Campañas Digitales Chile y LATAM 2026',
  description: 'Herramienta gratuita para predecir resultados de campañas de Google Ads y Meta Ads con data verificada 2026. 22 industrias, 6 países LATAM. CPC, CTR, CVR, CPA y ROAS por industria.',
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
    'Predicción de resultados Google Ads y Meta Ads',
    'Data verificada 2026 (WordStream, Get-Ryze, Ubersuggest Chile)',
    'Recomendación de plataforma (Google vs Meta vs LinkedIn)',
    'Proyección de ROAS, conversiones y revenue en 3 escenarios',
    '22 industrias con benchmarks CPC, CTR, CVR, CPA',
    '6 países LATAM (Chile, México, Colombia, Argentina, Brasil, Perú)',
    'Distribución óptima de presupuesto por plataforma',
    'Análisis probabilístico con intervalos de confianza',
    'Escenarios conservador, base y favorable con datos reales'
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
        text: 'Funciona para 22 industrias: E-commerce, SaaS, Fintech, Inmobiliaria, Salud, Educación, Automotriz, Turismo, Gastronomía, Moda, Belleza, Legal, Construcción, Fitness, Veterinaria, Manufactura, Logística, Seguros, Agricultura, Servicios Profesionales, Energía y Hogar.'
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
  title: 'Predictor de Campañas Google Ads y Meta Ads Chile 2026 — Data Real por Industria | M&P Labs',
  description: 'Predice resultados de Google Ads y Meta Ads gratis con data verificada 2026. CPC, CTR, CVR, CPA y ROAS por industria. 22 industrias, 6 países LATAM. Simulador interactivo.',
  keywords: 'predictor google ads chile, calculadora meta ads, predictor campañas 2026, benchmarks cpc chile, roas estimado por industria, simulador campañas latam, costo google ads chile 2026, cpc por industria chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/labs/predictor'
  },
  openGraph: {
    title: 'Predictor de Campañas Digitales Chile y LATAM 2026 — Data Verificada',
    description: 'Predice CPC, conversiones, ROAS y CPA de tus campañas con data real 2026 de WordStream, Get-Ryze y Ubersuggest. 22 industrias, 6 países LATAM.',
    url: 'https://www.mulleryperez.cl/labs/predictor',
    siteName: 'Muller y Pérez',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-predictor.svg',
        width: 1200,
        height: 630,
        alt: 'Predictor Campañas Digitales Chile 2026'
      }
    ],
    locale: 'es_CL',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Predictor de Campañas Digitales Chile y LATAM 2026',
    description: 'Predice resultados de Google Ads y Meta Ads con data verificada 2026. 22 industrias, 6 países LATAM. CPC, CTR, CVR, ROAS por industria.',
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
      <PredictorV4Client />
    </>
  )
}
