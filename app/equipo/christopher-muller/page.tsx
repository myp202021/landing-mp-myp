import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Christopher Müller — CEO & Founder | Muller y Pérez',
  description: 'Christopher Müller es CEO y Fundador de Muller y Pérez, agencia de performance marketing en Chile. Especialista en Google Ads, Meta Ads y estrategia digital data-driven con más de 6 años de experiencia.',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/equipo/christopher-muller'
  },
  openGraph: {
    title: 'Christopher Müller — CEO & Founder | Muller y Pérez',
    description: 'CEO y Fundador de Muller y Pérez. Especialista en performance marketing, Google Ads y Meta Ads en Chile.',
    url: 'https://www.mulleryperez.cl/equipo/christopher-muller',
    type: 'profile',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630 }]
  }
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Christopher Müller',
  url: 'https://www.mulleryperez.cl/equipo/christopher-muller',
  sameAs: [
    'https://www.linkedin.com/in/christophermullerm/',
    'https://www.mulleryperez.cl'
  ],
  jobTitle: 'CEO & Founder',
  worksFor: {
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl',
    foundingDate: '2019'
  },
  knowsAbout: [
    'Performance Marketing',
    'Google Ads',
    'Meta Ads',
    'Marketing Digital',
    'Data-Driven Marketing',
    'ROAS',
    'CAC',
    'Marketing B2B',
    'Marketing eCommerce',
    'Atribución de Marketing',
    'LinkedIn Ads',
    'Marketing Automation'
  ],
  nationality: {
    '@type': 'Country',
    name: 'Chile'
  },
  description: 'Christopher Müller es CEO y Fundador de Muller y Pérez, agencia de performance marketing con sede en Las Condes, Santiago de Chile. Fundada en 2019, la agencia gestiona más de 200 campañas activas con un ROAS promedio de 6.8x en e-commerce y 4.2x en B2B. Especialista en estrategias data-driven, atribución multi-touch y optimización de CAC/LTV.',
  alumniOf: [],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Google Ads Certified',
      credentialCategory: 'Certificación',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Google'
      }
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Meta Blueprint Certified',
      credentialCategory: 'Certificación',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Meta'
      }
    }
  ]
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.mulleryperez.cl/' },
    { '@type': 'ListItem', position: 2, name: 'Equipo', item: 'https://www.mulleryperez.cl/equipo' },
    { '@type': 'ListItem', position: 3, name: 'Christopher Müller', item: 'https://www.mulleryperez.cl/equipo/christopher-muller' }
  ]
}

export default function ChristopherMullerPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" /></Link>
          <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all">
            ← Inicio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-blue-600 font-semibold mb-4">Muller y Pérez — Equipo</p>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Christopher Müller
          </h1>
          <p className="text-xl text-blue-600 font-semibold mb-6">CEO & Founder</p>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Fundador de Muller y Pérez en 2019. Especialista en performance marketing data-driven:
            Google Ads, Meta Ads, atribución multi-touch y optimización de CAC/LTV para empresas en Chile.
            Más de 6 años gestionando campañas con resultados medibles en e-commerce, B2B, SaaS, salud e inmobiliario.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/christophermullerm/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-all"
            >
              LinkedIn
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-lg font-semibold text-sm hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              Ver Muller y Pérez
            </Link>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Especialidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Performance Marketing',
              'Google Ads',
              'Meta Ads',
              'LinkedIn Ads',
              'Atribución Multi-touch',
              'Marketing B2B',
              'Marketing eCommerce',
              'Data-Driven Strategy',
              'ROAS & CAC Optimization',
              'Marketing Automation',
              'Marketing SaaS',
              'Marketing Salud'
            ].map(skill => (
              <div key={skill} className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm font-medium text-blue-800">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Resultados en Muller y Pérez</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '+200', label: 'Campañas activas' },
              { num: '6.8x', label: 'ROAS e-commerce' },
              { num: '+380%', label: 'ROI promedio' },
              { num: '95%', label: 'Retención de clientes' }
            ].map(m => (
              <div key={m.label} className="text-center">
                <p className="text-3xl font-black text-blue-600">{m.num}</p>
                <p className="text-sm text-gray-500 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artículos */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Artículos</h2>
          <p className="text-gray-500 mb-8">Contenido sobre performance marketing, Google Ads, Meta Ads y estrategia digital en Chile.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
            Ver todos los artículos →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-blue-600 transition-all">mulleryperez.cl</Link>
        {' · '}
        <Link href="/blog" className="hover:text-blue-600 transition-all">Blog</Link>
      </footer>
    </div>
  )
}
