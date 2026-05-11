import type { Metadata } from 'next'
import AgentesClient from './AgentesClient'

export const metadata: Metadata = {
  title: 'Agentes IA para Posicionamiento en Google y Buscadores de IA | Muller y Pérez',
  description: 'Agentes de IA que publican contenido SEO en tu blog todos los días. 24 artículos/mes con estructura optimizada para Google y buscadores de IA. Desde $49.990/mes.',
  alternates: { canonical: 'https://www.mulleryperez.cl/agentes' },
  openGraph: {
    title: 'Agentes IA — Posicionamiento en Google y Buscadores de IA',
    description: 'Tu sitio publicando contenido SEO todos los días. Automático. 24 artículos/mes desde $49.990.',
    url: 'https://www.mulleryperez.cl/agentes',
    siteName: 'Muller y Pérez',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentes IA — Posicionamiento en Google y Buscadores de IA | M&P',
    description: 'Agentes de IA que publican contenido SEO en tu blog automáticamente. Desde $49.990/mes.',
  },
}

export default function AgentesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Agentes IA para Posicionamiento en Google y Buscadores de IA',
            description: 'Agentes de IA que publican contenido SEO en tu blog todos los días. 24 artículos/mes con estructura optimizada.',
            url: 'https://www.mulleryperez.cl/agentes',
            isPartOf: { '@type': 'WebSite', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.mulleryperez.cl' },
                { '@type': 'ListItem', position: 2, name: 'Agentes IA', item: 'https://www.mulleryperez.cl/agentes' },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Agentes IA para SEO',
            description: 'Sistema de agentes de IA que genera y publica 24 artículos SEO al mes en tu blog de WordPress. Incluye estructura H1/H2, meta descriptions, tablas, FAQ y links internos.',
            brand: { '@type': 'Organization', name: 'Muller y Pérez' },
            offers: [
              { '@type': 'Offer', name: 'Setup Básico', price: '290000', priceCurrency: 'CLP', description: 'Diagnóstico SEO, schemas, meta descriptions, GSC, 5 artículos iniciales. Sitios hasta 10 páginas.' },
              { '@type': 'Offer', name: 'Setup Medio', price: '490000', priceCurrency: 'CLP', description: 'Todo lo del básico más 9 artículos, 2 rankings pilar, redirects, AI Search schema. Sitios hasta 30 páginas.' },
              { '@type': 'Offer', name: 'Blog IA Mensual', price: '49990', priceCurrency: 'CLP', description: '24 artículos/mes publicados automáticamente con estructura SEO completa.' },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: '¿Qué es un agente de IA para SEO?', acceptedAnswer: { '@type': 'Answer', text: 'Es un sistema automatizado que genera y publica artículos optimizados para Google y buscadores de IA en tu blog de WordPress todos los días. Cada artículo tiene estructura SEO profesional: títulos H1/H2, meta description, tabla comparativa, preguntas frecuentes y links internos.' } },
              { '@type': 'Question', name: '¿Cuántos artículos publica al mes?', acceptedAnswer: { '@type': 'Answer', text: '24 artículos mensuales: 20 artículos de blog (lunes a viernes) + 4 rankings o guías pilares (semanales). Cada artículo tiene mínimo 2.000 palabras y control de calidad automático.' } },
              { '@type': 'Question', name: '¿Funciona para aparecer en buscadores de IA?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Los schemas JSON-LD que configuramos en el setup le dicen a los buscadores de IA (como los asistentes de búsqueda) qué hace tu empresa, qué servicios ofreces y qué dicen tus clientes. Los artículos con FAQ estructuradas son la fuente principal de respuestas de la IA.' } },
              { '@type': 'Question', name: '¿Necesito WordPress?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, el agente publica directamente en WordPress a través de la API REST. Necesitas tener WordPress con Yoast SEO o RankMath instalado y acceso de administrador.' } },
              { '@type': 'Question', name: '¿Hay permanencia mínima?', acceptedAnswer: { '@type': 'Answer', text: 'No. El servicio es mes a mes, sin compromiso. Si cancelas, todo el contenido publicado queda en tu sitio y sigue generando tráfico.' } },
            ],
          }),
        }}
      />
      <AgentesClient />
    </>
  )
}
