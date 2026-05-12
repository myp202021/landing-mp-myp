import type { Metadata } from 'next'
import SGOClient from './SGOClient'

export const metadata: Metadata = {
  title: 'SGO — Libro de Obras Digital Chile | Software Gestión Obras Públicas',
  description: 'SGO es el software líder en Chile para gestión de obras de construcción y obras públicas. Libro de Obras Digital, Libro de Comunicaciones Electrónico y Gestor Documental. +700 obras conectadas.',
  alternates: { canonical: 'https://www.mulleryperez.cl/sgo' },
  openGraph: {
    title: 'SGO — Libro de Obras Digital Chile',
    description: 'Software de gestión para construcción y obras públicas. Libro de Obras Digital obligatorio MOP. +700 obras conectadas.',
    url: 'https://www.mulleryperez.cl/sgo',
    siteName: 'Muller y Pérez',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SGO — Libro de Obras Digital Chile | Software Gestión Obras Públicas',
    description: 'Software líder en Chile para gestión de obras. Libro de Obras Digital obligatorio MOP. +700 obras conectadas.',
  },
}

export default function SGOPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'SGO — Libro de Obras Digital Chile',
            description: 'SGO es el software líder en Chile para gestión de obras de construcción y obras públicas. Libro de Obras Digital, Libro de Comunicaciones Electrónico y Gestor Documental.',
            url: 'https://www.mulleryperez.cl/sgo',
            isPartOf: { '@type': 'WebSite', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.mulleryperez.cl' },
                { '@type': 'ListItem', position: 2, name: 'SGO — Libro de Obras Digital', item: 'https://www.mulleryperez.cl/sgo' },
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
            '@type': 'SoftwareApplication',
            name: 'SGO — Sistema de Gestión de Obras',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Software de gestión integral para obras de construcción y obras públicas en Chile. Incluye Libro de Obras Digital (LOD), Libro de Comunicaciones Electrónico (LCE), Libro de Consultoría Digital y Gestor Documental.',
            url: 'https://beta.sgo.cl',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'CLP',
              description: 'Contactar para cotización personalizada',
            },
            provider: {
              '@type': 'Organization',
              name: 'SGO',
              url: 'https://beta.sgo.cl',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Sucre 2680',
                addressLocality: 'Ñuñoa',
                addressRegion: 'Santiago',
                addressCountry: 'CL',
              },
              telephone: '+56 2 268 48 887',
              email: 'contacto@sgo.cl',
            },
            knowsAbout: [
              'Libro de Obras Digital Chile',
              'Software gestión obras públicas',
              'Libro de Comunicaciones Electrónico',
              'Gestión documental construcción',
              'Ministerio de Obras Públicas Chile',
              'Inspección fiscal obras',
              'Trazabilidad obras construcción',
              'Consultoría digital obras',
              'Normativa MOP Chile',
              'Gestión de obras civiles',
              'Control de obras públicas',
              'Digitalización construcción Chile',
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
              {
                '@type': 'Question',
                name: '¿Qué es el Libro de Obras Digital (LOD)?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'El Libro de Obras Digital (LOD) es la versión electrónica del libro de obras exigido por el Ministerio de Obras Públicas de Chile. Permite registrar en tiempo real todas las anotaciones, observaciones e instrucciones de una obra de construcción, con trazabilidad completa y validez legal.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Es obligatorio usar un Libro de Obras Digital en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sí. El Ministerio de Obras Públicas (MOP) de Chile exige el uso del Libro de Obras Digital para las empresas constructoras que ejecutan obras públicas. SGO cumple con todos los requisitos normativos establecidos por el MOP.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Qué productos incluye la plataforma SGO?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'SGO incluye cuatro productos principales: Libro de Obras Digital (LOD) para registro y trazabilidad de obras, Libro de Comunicaciones Electrónico (LCE) para comunicaciones formales entre actores, Libro de Consultoría Digital para gestión de consultorías, y Gestor Documental para administración centralizada de documentos de obra.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cuántas obras están conectadas a SGO?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'SGO tiene más de 700 obras conectadas en todo Chile, siendo utilizado por empresas constructoras, consultoras y equipos de inspección fiscal en proyectos de obras públicas.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Quiénes pueden usar SGO?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'SGO está diseñado para tres perfiles principales: empresas constructoras que ejecutan obras públicas y privadas, consultoras que supervisan y asesoran proyectos de construcción, e inspectores fiscales del MOP que requieren trazabilidad y control documental.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cómo puedo contactar a SGO para una demostración?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Puedes contactar a SGO llamando al +56 2 268 48 887, enviando un correo a contacto@sgo.cl, o visitando sus oficinas en Sucre 2680, Ñuñoa, Santiago. Para soporte técnico, el número es +56 2 292 98 180 o soporte@sgo.cl.',
                },
              },
            ],
          }),
        }}
      />
      <SGOClient />
    </>
  )
}
