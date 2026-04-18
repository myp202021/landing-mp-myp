import SiteHeader from '@/components/SiteHeader'
import ClippingClient from './ClippingClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Radar — Inteligencia Competitiva en Redes Sociales | Muller y Perez',
  description: 'Monitorea Instagram, Facebook, LinkedIn y prensa de tu competencia. Recibe cada manana un email con analisis IA, trends, contenido sugerido y PDF. Desde $27.990/mes. Prueba gratis 7 dias.',
  keywords: [
    'monitoreo competencia redes sociales chile',
    'clipping digital chile',
    'inteligencia competitiva redes sociales',
    'monitorear competencia instagram',
    'radar de competencia',
    'social media monitoring chile',
    'brand monitoring chile',
    'analisis competencia redes sociales',
  ],
  alternates: { canonical: 'https://www.mulleryperez.cl/clipping' },
  openGraph: {
    title: 'Radar — Inteligencia Competitiva en Redes Sociales',
    description: 'Monitorea a tu competencia en IG, FB, LinkedIn y prensa. Analisis IA + contenido sugerido + PDF. Desde $27.990/mes.',
    url: 'https://www.mulleryperez.cl/clipping',
    siteName: 'Muller y Perez',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Radar by Muller y Perez',
  description: 'Servicio de inteligencia competitiva en redes sociales. Monitoreo diario de Instagram, Facebook, LinkedIn y prensa con analisis IA y contenido sugerido.',
  brand: { '@type': 'Organization', name: 'Muller y Perez', url: 'https://www.mulleryperez.cl' },
  url: 'https://www.mulleryperez.cl/clipping',
  offers: [
    { '@type': 'Offer', name: 'Starter', price: '27990', priceCurrency: 'CLP', priceSpecification: { '@type': 'UnitPriceSpecification', price: '27990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
    { '@type': 'Offer', name: 'Pro', price: '54990', priceCurrency: 'CLP', priceSpecification: { '@type': 'UnitPriceSpecification', price: '54990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
    { '@type': 'Offer', name: 'Business', price: '94990', priceCurrency: 'CLP', priceSpecification: { '@type': 'UnitPriceSpecification', price: '94990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
  ],
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Que es Radar de Muller y Perez?', acceptedAnswer: { '@type': 'Answer', text: 'Radar es un servicio de inteligencia competitiva que monitorea las redes sociales de tu competencia (Instagram, Facebook, LinkedIn y prensa) y te envia un email diario con analisis IA, trends y contenido sugerido.' } },
    { '@type': 'Question', name: 'Cuanto cuesta Radar?', acceptedAnswer: { '@type': 'Answer', text: 'Radar tiene 3 planes: Starter desde $27.990/mes (5 cuentas Instagram), Pro desde $54.990/mes (15 cuentas multi-red con IA), y Business desde $94.990/mes (30 cuentas con benchmarking y PDF). Todos con 7 dias gratis.' } },
    { '@type': 'Question', name: 'Como se compara Radar con Brand24 o Meltwater?', acceptedAnswer: { '@type': 'Answer', text: 'Radar es hasta 10 veces mas barato que Meltwater y sin contrato anual. Se diferencia por incluir analisis IA en espanol nativo con recomendaciones accionables y contenido sugerido para publicar.' } },
  ],
}

export default function ClippingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <SiteHeader />
      <ClippingClient />
    </>
  )
}
