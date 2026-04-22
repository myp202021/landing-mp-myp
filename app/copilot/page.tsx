import SiteHeader from '@/components/SiteHeader'
import CopilotClient from './CopilotClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'M&P Copilot — Tu copiloto de marketing digital en Redes Sociales | Muller y Perez',
  description: 'Tu copiloto de marketing digital. Monitorea competencia en IG, FB, LinkedIn. Genera copies con IA, grillas mensuales, reportes ejecutivos. Desde $34.990/mes. Prueba gratis 7 dias.',
  keywords: [
    'copiloto marketing digital chile',
    'monitoreo competencia redes sociales chile',
    'clipping digital chile',
    'inteligencia competitiva redes sociales',
    'monitorear competencia instagram',
    'generador contenido IA chile',
    'social media monitoring chile',
    'grilla contenido IA',
    'analisis competencia redes sociales',
  ],
  alternates: { canonical: 'https://www.mulleryperez.cl/copilot' },
  openGraph: {
    title: 'M&P Copilot — Tu copiloto de marketing digital en Redes Sociales',
    description: 'Tu copiloto de marketing digital. Monitorea competencia, genera copies IA, grillas mensuales y reportes ejecutivos. Desde $34.990/mes.',
    url: 'https://www.mulleryperez.cl/copilot',
    siteName: 'Muller y Perez',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'M&P Copilot by Muller y Perez',
  description: 'Servicio de inteligencia competitiva en redes sociales. Monitoreo diario de Instagram, Facebook, LinkedIn y prensa con analisis IA y contenido sugerido.',
  brand: { '@type': 'Organization', name: 'Muller y Perez', url: 'https://www.mulleryperez.cl' },
  url: 'https://www.mulleryperez.cl/copilot',
  offers: [
    { '@type': 'Offer', name: 'Starter', price: '34990', priceCurrency: 'CLP', priceSpecification: { '@type': 'UnitPriceSpecification', price: '34990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
    { '@type': 'Offer', name: 'Pro', price: '69990', priceCurrency: 'CLP', priceSpecification: { '@type': 'UnitPriceSpecification', price: '69990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
    { '@type': 'Offer', name: 'Business', price: '119990', priceCurrency: 'CLP', priceSpecification: { '@type': 'UnitPriceSpecification', price: '119990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
  ],
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Que es M&P Copilot?', acceptedAnswer: { '@type': 'Answer', text: 'M&P Copilot es tu copiloto de marketing digital. Monitorea la competencia en Instagram, Facebook, LinkedIn y prensa, genera copies con IA, arma grillas mensuales y entrega reportes ejecutivos automaticamente.' } },
    { '@type': 'Question', name: 'Cuanto cuesta M&P Copilot?', acceptedAnswer: { '@type': 'Answer', text: 'Copilot tiene 3 planes: Starter desde $34.990/mes (5 cuentas Instagram), Pro desde $69.990/mes (15 cuentas multi-red con copies IA), y Business desde $119.990/mes (30 cuentas con guiones de reels y benchmark). Todos con 7 dias gratis.' } },
    { '@type': 'Question', name: 'Como se compara M&P Copilot con otras herramientas?', acceptedAnswer: { '@type': 'Answer', text: 'Copilot no solo monitorea, tambien genera contenido listo para publicar con 3 agentes IA, arma grillas mensuales y entrega reportes ejecutivos. Es mas economico que Meltwater y sin contrato anual.' } },
  ],
}

export default function CopilotPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <SiteHeader />
      <CopilotClient />
    </>
  )
}
