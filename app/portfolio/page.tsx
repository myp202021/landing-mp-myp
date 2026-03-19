import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import PortfolioGrid from '@/components/PortfolioGrid'

export const metadata: Metadata = {
  title: 'Portfolio de Marketing Digital y Diseño en Chile | Muller y Pérez',
  description:
    'Portfolio de trabajos de diseño, campañas digitales y performance marketing para más de 20 industrias en Chile. Eventos, tecnología, inmobiliaria, producto e industria.',
  keywords: [
    'portfolio marketing digital Chile',
    'diseño campañas digitales',
    'performance marketing portfolio',
    'agencia marketing digital Chile trabajos',
    'diseño publicitario Chile',
    'campañas Google Ads Chile',
    'campañas Meta Ads Chile',
    'portfolio agencia publicidad Chile',
  ],
  alternates: {
    canonical: 'https://www.mulleryperez.cl/portfolio',
  },
  openGraph: {
    title: 'Portfolio de Marketing Digital y Diseño en Chile | Muller y Pérez',
    description:
      'Portfolio de trabajos de diseño, campañas digitales y performance marketing para más de 20 industrias en Chile.',
    url: 'https://www.mulleryperez.cl/portfolio',
    siteName: 'Muller y Pérez',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio de Marketing Digital - Muller y Pérez',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio de Marketing Digital y Diseño en Chile | Muller y Pérez',
    description:
      'Portfolio de trabajos de diseño, campañas digitales y performance marketing para más de 20 industrias en Chile.',
    images: ['/og-image.jpg'],
  },
}

export default function PortfolioPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://www.mulleryperez.cl',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portfolio',
        item: 'https://www.mulleryperez.cl/portfolio',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Volver al inicio">
            <Image
              src="/logo-myp.png"
              alt="Muller y Pérez - Agencia de Marketing Digital Chile"
              width={140}
              height={40}
              priority
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >
            &larr; Volver al inicio
          </Link>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[72px]" />

      {/* Main content */}
      <main>
        <PortfolioGrid />

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-[#0A0A14]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para crear campañas que convierten?
            </h2>
            <p className="text-lg text-blue-200/70 mb-8">
              Conversemos sobre tu proyecto. Te mostramos cómo nuestro equipo de 3
              profesionales puede impulsar tus resultados.
            </p>
            <Link
              href="/#contacto"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              Solicitar cotización
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
