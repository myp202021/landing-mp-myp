/**
 * Página SEO: Agencia Marketing Digital Concepción
 * Optimizada para rankear en Google con keywords de Concepción y VIII Región
 */

import { Metadata } from 'next'
import Link from 'next/link'
import {
  createMetadata,
  createWebPageSchema,
  createFAQPageSchema,
  createBreadcrumbSchema,
  createLocalBusinessSchema,
  cityData
} from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Agencia de Marketing Digital en Concepción',
  description: 'Agencia de marketing digital en Concepción: Google Ads, Meta Ads y performance para la VIII Región: Concepción, Talcahuano, San Pedro y Coronel.',
  keywords: [
    'agencia marketing digital concepcion',
    'marketing digital concepcion',
    'agencia google ads concepcion',
    'agencia publicidad digital concepcion',
    'marketing digital viii region',
    'agencia marketing digital biobio',
    'agencia meta ads concepcion',
    'publicidad digital concepcion',
    'agencia marketing digital talcahuano',
    'marketing digital san pedro de la paz',
    'agencia publicidad concepcion',
    'marketing digital chiguayante'
  ],
  path: '/agencia-marketing-digital-concepcion'
})

export default function AgenciaMarketingDigitalConcepcionPage() {
  const webPageSchema = createWebPageSchema(
    'Agencia Marketing Digital Concepción | Muller y Pérez',
    'Agencia marketing digital en Concepción especializada en Google Ads, Meta Ads y performance marketing para empresas de la VIII Región del Biobío',
    'https://www.mulleryperez.cl/agencia-marketing-digital-concepcion'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Agencia Marketing Digital Concepción', url: 'https://www.mulleryperez.cl/agencia-marketing-digital-concepcion' }
  ])

  // LocalBusiness Schema para Concepción
  const localBusinessSchema = createLocalBusinessSchema(cityData.concepcion)

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Atienden empresas de Concepción y la VIII Región?',
      answer: 'Sí, atendemos empresas de toda la VIII Región del Biobío incluyendo Concepción, Talcahuano, San Pedro de la Paz, Chiguayante, Coronel, Hualpén, Penco y Los Ángeles. Trabajamos de forma remota con reuniones virtuales y soporte en horario chileno.'
    },
    {
      question: '¿Cuánto cuesta una agencia de marketing digital en Concepción?',
      answer: 'Los servicios de marketing digital para empresas de Concepción tienen un costo desde $950.000 CLP mensuales. Esto incluye gestión de Google Ads o Meta Ads, equipo dedicado de 3 profesionales, reportería semanal y optimización continua. Nuestros precios son los mismos que en Santiago.'
    },
    {
      question: '¿Qué servicios de marketing digital ofrecen en Concepción?',
      answer: 'Ofrecemos servicios completos de marketing digital para Concepción: Google Ads (Search, Shopping, Display), Meta Ads (Facebook e Instagram), LinkedIn Ads para B2B, SEO, creación de contenido y análisis de datos. Todos enfocados en generar conversiones y ventas reales.'
    },
    {
      question: '¿Tienen experiencia con empresas industriales del Biobío?',
      answer: 'Sí, tenemos experiencia con empresas del sector industrial, forestal, pesquero y servicios B2B del Gran Concepción. Conocemos el mercado empresarial de la VIII Región y sabemos cómo generar leads calificados para empresas B2B.'
    },
    {
      question: '¿Cuánto demora ver resultados con marketing digital en Concepción?',
      answer: 'Los primeros resultados (leads y consultas) se ven desde la primera semana de campaña activa. Resultados optimizados se logran entre 4-8 semanas cuando ya tenemos data del comportamiento del público de la VIII Región.'
    }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 text-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-3xl">
              <nav className="text-emerald-200 text-sm mb-6">
                <Link href="/" className="hover:text-white">Inicio</Link>
                <span className="mx-2">/</span>
                <span className="text-white">Agencia Marketing Digital Concepción</span>
              </nav>

              <div className="inline-block px-4 py-2 bg-teal-500/20 backdrop-blur border border-teal-400/30 rounded-full mb-6">
                <span className="text-teal-200 font-semibold text-sm">
                  VIII Región: Concepción • Talcahuano • San Pedro • Chiguayante
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Agencia Marketing Digital<br />
                <span className="text-teal-300">Concepción</span>
              </h1>

              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Especialistas en Google Ads, Meta Ads y performance marketing para empresas del
                Gran Concepción y la VIII Región del Biobío. Resultados medibles y equipo
                dedicado para tu negocio.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/cotizador"
                  className="px-8 py-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold shadow-lg text-center"
                >
                  Solicitar Propuesta Gratis
                </Link>
                <Link
                  href="/labs/predictor"
                  className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold text-center"
                >
                  Simular ROI
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-teal-50 to-emerald-50 py-12 border-b border-teal-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">+30</div>
                <div className="text-gray-700 font-semibold">Clientes VIII Región</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">+200</div>
                <div className="text-gray-700 font-semibold">Campañas activas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">5.0★</div>
                <div className="text-gray-700 font-semibold">115 reseñas Google</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">24/7</div>
                <div className="text-gray-700 font-semibold">Monitoreo Campañas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Por qué Concepción Section */}
        <section className="container mx-auto px-6 max-w-6xl py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Marketing Digital para Empresas de Concepción
            </h2>
            <p className="text-gray-600 text-lg">
              Conocemos el mercado del Biobío y sus industrias clave
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-200">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sector Industrial
              </h3>
              <p className="text-gray-700">
                Empresas del sector industrial, forestal, pesquero y manufactura del Biobío.
                Generación de leads B2B calificados para empresas del Gran Concepción.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Servicios y Comercio
              </h3>
              <p className="text-gray-700">
                Retail, servicios profesionales y comercio del Gran Concepción.
                Targeting geolocalizado para captar clientes de la zona.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-xl p-6 border border-green-200">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Educación Superior
              </h3>
              <p className="text-gray-700">
                Universidades, institutos y centros de formación del Biobío.
                Campañas de matrícula y posicionamiento institucional.
              </p>
            </div>
          </div>
        </section>

        {/* Servicios Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Servicios de Marketing Digital en Concepción
              </h2>
              <p className="text-gray-600 text-lg">
                Soluciones completas para empresas de la VIII Región
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/servicios/google-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">
                  Google Ads Concepción
                </h3>
                <p className="text-gray-700 text-sm">
                  Campañas de búsqueda, shopping y display para captar clientes en el Biobío.
                </p>
              </Link>

              <Link href="/servicios/meta-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">
                  Meta Ads Concepción
                </h3>
                <p className="text-gray-700 text-sm">
                  Facebook e Instagram Ads con targeting geolocalizado para la VIII Región.
                </p>
              </Link>

              <Link href="/servicios/seo-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">
                  SEO Concepción
                </h3>
                <p className="text-gray-700 text-sm">
                  Posicionamiento orgánico local para aparecer en búsquedas del Biobío.
                </p>
              </Link>

              <Link href="/servicios/instagram-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">
                  Instagram Ads
                </h3>
                <p className="text-gray-700 text-sm">
                  Contenido visual para comercio, gastronomía y servicios locales.
                </p>
              </Link>

              <Link href="/servicios/facebook-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📘</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">
                  Facebook Ads
                </h3>
                <p className="text-gray-700 text-sm">
                  Campañas de conversión y remarketing para comercio del Gran Concepción.
                </p>
              </Link>

              <Link href="/servicios/performance-marketing" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600">
                  Performance Marketing
                </h3>
                <p className="text-gray-700 text-sm">
                  Estrategia integral multicanal con foco en resultados medibles.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Zonas que Atendemos */}
        <section className="container mx-auto px-6 max-w-6xl py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Zonas de la VIII Región que Atendemos
            </h2>
            <p className="text-gray-600 text-lg">
              Cobertura completa de marketing digital en el Biobío
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              'Concepción',
              'Talcahuano',
              'San Pedro de la Paz',
              'Chiguayante',
              'Coronel',
              'Hualpén',
              'Penco',
              'Tomé',
              'Los Ángeles',
              'Chillán',
              'Lota',
              'Arauco'
            ].map((zona) => (
              <div key={zona} className="bg-teal-50 rounded-lg p-4 text-center border border-teal-200">
                <span className="text-gray-800 font-medium">{zona}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Preguntas Frecuentes - Marketing Digital Concepción
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Atienden empresas de Concepción y la VIII Región?
                </h3>
                <p className="text-gray-700">
                  Sí, atendemos empresas de toda la VIII Región del Biobío incluyendo <strong>Concepción,
                  Talcahuano, San Pedro de la Paz, Chiguayante, Coronel, Hualpén</strong> y alrededores.
                  Trabajamos de forma remota con reuniones virtuales y soporte en horario chileno.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Cuánto cuesta una agencia de marketing digital en Concepción?
                </h3>
                <p className="text-gray-700">
                  Los servicios de marketing digital para empresas de Concepción tienen un costo
                  desde <strong>$950.000 CLP mensuales</strong>. Incluye gestión de Google Ads o
                  Meta Ads, equipo dedicado de 3 profesionales, reportería semanal y optimización continua.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Tienen experiencia con empresas industriales del Biobío?
                </h3>
                <p className="text-gray-700">
                  Sí, tenemos experiencia con empresas del <strong>sector industrial, forestal,
                  pesquero y servicios B2B</strong> del Gran Concepción. Conocemos el mercado
                  empresarial de la VIII Región y sabemos generar leads calificados para empresas B2B.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Cuánto demora ver resultados con marketing digital?
                </h3>
                <p className="text-gray-700">
                  Los primeros resultados (leads y consultas) se ven desde la <strong>primera
                  semana</strong> de campaña activa. Resultados optimizados se logran entre
                  4-8 semanas cuando ya tenemos data del comportamiento del público del Biobío.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="container mx-auto px-6 max-w-4xl py-16">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Crecer en Concepción?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Solicita una cotización gratuita y descubre cómo podemos ayudar a tu negocio
              a captar más clientes en la VIII Región del Biobío.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cotizador"
                className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
              >
                Solicitar Propuesta Gratis
              </Link>
              <Link
                href="/labs/predictor"
                className="inline-block px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold text-lg"
              >
                Simular ROI en Biobío
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
