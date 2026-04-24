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
  brand: { '@type': 'Brand', name: 'Muller y Perez' },
  url: 'https://www.mulleryperez.cl/copilot',
  image: 'https://www.mulleryperez.cl/og-image.jpg',
  offers: [
    { '@type': 'Offer', name: 'Starter', price: '34990', priceCurrency: 'CLP', availability: 'https://schema.org/InStock', shippingDetails: { '@type': 'OfferShippingDetails', shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'CLP' }, deliveryTime: { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' }, transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' } }, shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CL' } }, hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'CL', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted', merchantReturnDays: 0 }, priceSpecification: { '@type': 'UnitPriceSpecification', price: '34990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
    { '@type': 'Offer', name: 'Pro', price: '69990', priceCurrency: 'CLP', availability: 'https://schema.org/InStock', shippingDetails: { '@type': 'OfferShippingDetails', shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'CLP' }, deliveryTime: { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' }, transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' } }, shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CL' } }, hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'CL', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted', merchantReturnDays: 0 }, priceSpecification: { '@type': 'UnitPriceSpecification', price: '69990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
    { '@type': 'Offer', name: 'Business', price: '119990', priceCurrency: 'CLP', availability: 'https://schema.org/InStock', shippingDetails: { '@type': 'OfferShippingDetails', shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'CLP' }, deliveryTime: { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' }, transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' } }, shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CL' } }, hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'CL', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted', merchantReturnDays: 0 }, priceSpecification: { '@type': 'UnitPriceSpecification', price: '119990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '12',
    bestRating: '5',
    worstRating: '1',
  },
  review: {
    '@type': 'Review',
    author: { '@type': 'Organization', name: 'Genera HR' },
    datePublished: '2026-03-15',
    reviewBody: 'Copilot nos permite saber exactamente qué está haciendo nuestra competencia cada día. Los copies sugeridos nos ahorran horas de trabajo semanal.',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  },
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
