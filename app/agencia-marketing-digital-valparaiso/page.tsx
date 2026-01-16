/**
 * Página SEO: Agencia Marketing Digital Valparaíso
 * Optimizada para rankear en Google con keywords de Valparaíso y V Región
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
  title: 'Agencia Marketing Digital Valparaíso | Google Ads y Performance',
  description: 'Agencia marketing digital en Valparaíso especializada en Google Ads, Meta Ads y performance marketing. Atendemos V Región: Valparaíso, Viña del Mar, Quilpué, Villa Alemana y Con Con.',
  keywords: [
    'agencia marketing digital valparaiso',
    'marketing digital valparaiso',
    'agencia google ads valparaiso',
    'agencia publicidad digital valparaiso',
    'marketing digital v region',
    'agencia marketing digital quinta region',
    'agencia meta ads valparaiso',
    'publicidad digital valparaiso',
    'agencia marketing digital quilpue',
    'marketing digital villa alemana',
    'agencia publicidad valparaiso',
    'marketing digital con con'
  ],
  path: '/agencia-marketing-digital-valparaiso'
})

export default function AgenciaMarketingDigitalValparaisoPage() {
  const webPageSchema = createWebPageSchema(
    'Agencia Marketing Digital Valparaíso | Muller y Pérez',
    'Agencia marketing digital en Valparaíso especializada en Google Ads, Meta Ads y performance marketing para empresas de la V Región',
    'https://www.mulleryperez.cl/agencia-marketing-digital-valparaiso'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Agencia Marketing Digital Valparaíso', url: 'https://www.mulleryperez.cl/agencia-marketing-digital-valparaiso' }
  ])

  // LocalBusiness Schema para Valparaíso
  const localBusinessSchema = createLocalBusinessSchema(cityData.valparaiso)

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Atienden empresas de Valparaíso y la V Región?',
      answer: 'Sí, atendemos empresas de toda la V Región incluyendo Valparaíso, Viña del Mar, Quilpué, Villa Alemana, Con Con, Reñaca, Limache y San Antonio. Trabajamos de forma remota con reuniones virtuales y soporte en horario chileno.'
    },
    {
      question: '¿Cuánto cuesta una agencia de marketing digital en Valparaíso?',
      answer: 'Los servicios de marketing digital para empresas de Valparaíso tienen un costo desde $650.000 CLP mensuales. Esto incluye gestión de Google Ads o Meta Ads, equipo dedicado de 3 profesionales, reportería semanal y optimización continua.'
    },
    {
      question: '¿Qué servicios de marketing digital ofrecen en Valparaíso?',
      answer: 'Ofrecemos servicios completos de marketing digital para Valparaíso: Google Ads (Search, Shopping, Display), Meta Ads (Facebook e Instagram), LinkedIn Ads para B2B, SEO, creación de contenido y análisis de datos. Todos enfocados en generar conversiones y ventas reales.'
    },
    {
      question: '¿Tienen experiencia con empresas turísticas de la V Región?',
      answer: 'Sí, tenemos amplia experiencia con hoteles, restaurantes, tours y servicios turísticos de Valparaíso y Viña del Mar. Conocemos la estacionalidad del mercado costero y sabemos optimizar campañas para temporada alta y baja.'
    },
    {
      question: '¿Cuánto demora ver resultados con marketing digital en Valparaíso?',
      answer: 'Los primeros resultados (leads y consultas) se ven desde la primera semana de campaña activa. Resultados optimizados se logran entre 4-8 semanas cuando ya tenemos data del comportamiento del público de la V Región.'
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
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-700 text-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-3xl">
              <nav className="text-indigo-200 text-sm mb-6">
                <Link href="/" className="hover:text-white">Inicio</Link>
                <span className="mx-2">/</span>
                <span className="text-white">Agencia Marketing Digital Valparaíso</span>
              </nav>

              <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur border border-purple-400/30 rounded-full mb-6">
                <span className="text-purple-200 font-semibold text-sm">
                  V Región: Valparaíso • Viña del Mar • Quilpué • Con Con
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Agencia Marketing Digital<br />
                <span className="text-purple-300">Valparaíso</span>
              </h1>

              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                Especialistas en Google Ads, Meta Ads y performance marketing para empresas del
                Gran Valparaíso y la V Región. Resultados medibles y equipo dedicado para tu negocio.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/cotizador"
                  className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold shadow-lg text-center"
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
        <section className="bg-gradient-to-r from-purple-50 to-indigo-50 py-12 border-b border-purple-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">+25</div>
                <div className="text-gray-700 font-semibold">Clientes V Región</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">+380%</div>
                <div className="text-gray-700 font-semibold">ROI Promedio</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
                <div className="text-gray-700 font-semibold">Retención Clientes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                <div className="text-gray-700 font-semibold">Monitoreo Campañas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Por qué Valparaíso Section */}
        <section className="container mx-auto px-6 max-w-6xl py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Marketing Digital para Empresas de Valparaíso
            </h2>
            <p className="text-gray-600 text-lg">
              Conocemos el mercado de la V Región y sus industrias clave
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Turismo y Hotelería
              </h3>
              <p className="text-gray-700">
                Hoteles, restaurantes y servicios turísticos de Valparaíso, Viña del Mar y la costa.
                Campañas estacionales optimizadas para temporada alta y baja.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
              <div className="text-4xl mb-4">🚢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sector Portuario
              </h3>
              <p className="text-gray-700">
                Empresas de logística, comercio exterior y servicios portuarios.
                Generación de leads B2B calificados para el sector marítimo.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Comercio y Servicios
              </h3>
              <p className="text-gray-700">
                Retail, servicios profesionales y comercio del Gran Valparaíso.
                Targeting geolocalizado para captar clientes de la zona.
              </p>
            </div>
          </div>
        </section>

        {/* Servicios Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Servicios de Marketing Digital en Valparaíso
              </h2>
              <p className="text-gray-600 text-lg">
                Soluciones completas para empresas de la V Región
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/servicios/google-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  Google Ads Valparaíso
                </h3>
                <p className="text-gray-700 text-sm">
                  Campañas de búsqueda, shopping y display para captar clientes en la V Región.
                </p>
              </Link>

              <Link href="/servicios/meta-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  Meta Ads Valparaíso
                </h3>
                <p className="text-gray-700 text-sm">
                  Facebook e Instagram Ads con targeting geolocalizado para la V Región.
                </p>
              </Link>

              <Link href="/servicios/seo-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  SEO Valparaíso
                </h3>
                <p className="text-gray-700 text-sm">
                  Posicionamiento orgánico local para aparecer en búsquedas de la V Región.
                </p>
              </Link>

              <Link href="/servicios/instagram-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  Instagram Ads
                </h3>
                <p className="text-gray-700 text-sm">
                  Contenido visual para turismo, gastronomía y servicios locales.
                </p>
              </Link>

              <Link href="/servicios/facebook-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📘</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  Facebook Ads
                </h3>
                <p className="text-gray-700 text-sm">
                  Campañas de conversión y remarketing para comercio del Gran Valparaíso.
                </p>
              </Link>

              <Link href="/servicios/performance-marketing" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
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
              Zonas de la V Región que Atendemos
            </h2>
            <p className="text-gray-600 text-lg">
              Cobertura completa de marketing digital en la Quinta Región
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              'Valparaíso',
              'Viña del Mar',
              'Quilpué',
              'Villa Alemana',
              'Con Con',
              'Reñaca',
              'Limache',
              'Quillota',
              'San Antonio',
              'La Calera',
              'Los Andes',
              'San Felipe'
            ].map((zona) => (
              <div key={zona} className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                <span className="text-gray-800 font-medium">{zona}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Preguntas Frecuentes - Marketing Digital Valparaíso
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Atienden empresas de Valparaíso y la V Región?
                </h3>
                <p className="text-gray-700">
                  Sí, atendemos empresas de toda la V Región incluyendo <strong>Valparaíso,
                  Viña del Mar, Quilpué, Villa Alemana, Con Con, Reñaca</strong> y alrededores.
                  Trabajamos de forma remota con reuniones virtuales y soporte en horario chileno.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Cuánto cuesta una agencia de marketing digital en Valparaíso?
                </h3>
                <p className="text-gray-700">
                  Los servicios de marketing digital para empresas de Valparaíso tienen un costo
                  desde <strong>$650.000 CLP mensuales</strong>. Incluye gestión de Google Ads o
                  Meta Ads, equipo dedicado de 3 profesionales, reportería semanal y optimización continua.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Tienen experiencia con empresas turísticas de la V Región?
                </h3>
                <p className="text-gray-700">
                  Sí, tenemos amplia experiencia con <strong>hoteles, restaurantes, tours
                  y servicios turísticos</strong> de Valparaíso y Viña del Mar. Conocemos la
                  estacionalidad del mercado costero y optimizamos campañas para cada temporada.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Cuánto demora ver resultados con marketing digital?
                </h3>
                <p className="text-gray-700">
                  Los primeros resultados (leads y consultas) se ven desde la <strong>primera
                  semana</strong> de campaña activa. Resultados optimizados se logran entre
                  4-8 semanas cuando ya tenemos data del comportamiento del público de la V Región.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="container mx-auto px-6 max-w-4xl py-16">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Crecer en Valparaíso?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Solicita una cotización gratuita y descubre cómo podemos ayudar a tu negocio
              a captar más clientes en la V Región.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cotizador"
                className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
              >
                Solicitar Propuesta Gratis
              </Link>
              <Link
                href="/labs/predictor"
                className="inline-block px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold text-lg"
              >
                Simular ROI en V Región
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
