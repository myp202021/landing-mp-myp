/**
 * Página SEO: Agencia Marketing Digital Viña del Mar
 * Optimizada para rankear en Google con keywords de Viña del Mar y V Región
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
  title: 'Agencia de Marketing Digital en Viña del Mar',
  description: 'Agencia de marketing digital en Viña del Mar: Google Ads, Meta Ads y performance para la V Región: Viña, Valparaíso, Concón y Quilpué.',
  keywords: [
    'agencia marketing digital viña del mar',
    'marketing digital viña del mar',
    'agencia google ads viña del mar',
    'agencia publicidad digital viña',
    'marketing digital valparaiso',
    'agencia marketing digital v region',
    'agencia meta ads viña del mar',
    'publicidad digital viña del mar',
    'agencia marketing digital reñaca',
    'marketing digital con con',
    'agencia publicidad valparaiso',
    'marketing digital quilpue'
  ],
  path: '/agencia-marketing-digital-vina-del-mar'
})

export default function AgenciaMarketingDigitalVinaDelMarPage() {
  const webPageSchema = createWebPageSchema(
    'Agencia Marketing Digital Viña del Mar | Muller y Pérez',
    'Agencia marketing digital en Viña del Mar especializada en Google Ads, Meta Ads y performance marketing para empresas de la V Región',
    'https://www.mulleryperez.cl/agencia-marketing-digital-vina-del-mar'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Agencia Marketing Digital Viña del Mar', url: 'https://www.mulleryperez.cl/agencia-marketing-digital-vina-del-mar' }
  ])

  // LocalBusiness Schema para Viña del Mar
  const localBusinessSchema = createLocalBusinessSchema(cityData['vina-del-mar'])

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Atienden empresas de Viña del Mar y la V Región?',
      answer: 'Sí, atendemos empresas de toda la V Región incluyendo Viña del Mar, Valparaíso, Con Con, Reñaca, Quilpué, Villa Alemana y alrededores. Trabajamos de forma remota con reuniones virtuales y soporte en horario chileno. También podemos coordinar reuniones presenciales cuando sea necesario.'
    },
    {
      question: '¿Cuánto cuesta una agencia de marketing digital en Viña del Mar?',
      answer: 'Los servicios de marketing digital para empresas de Viña del Mar y la V Región tienen un costo desde $950.000 CLP mensuales. Esto incluye gestión de Google Ads o Meta Ads, equipo dedicado de 3 profesionales, reportería semanal y optimización continua. Nuestros precios son competitivos y transparentes.'
    },
    {
      question: '¿Qué servicios de marketing digital ofrecen en Viña del Mar?',
      answer: 'Ofrecemos servicios completos de marketing digital para Viña del Mar: Google Ads (Search, Shopping, Display), Meta Ads (Facebook e Instagram), LinkedIn Ads para B2B, SEO, creación de contenido y análisis de datos. Todos nuestros servicios están enfocados en generar conversiones y ventas reales.'
    },
    {
      question: '¿Trabajan con empresas turísticas de Viña del Mar?',
      answer: 'Sí, tenemos amplia experiencia con hoteles, restaurantes, tours y servicios turísticos de la costa. Conocemos la estacionalidad del mercado viñamarino y sabemos cómo optimizar campañas para temporada alta (verano) y mantener presencia en temporada baja.'
    },
    {
      question: '¿Cuánto demora ver resultados con marketing digital en Viña del Mar?',
      answer: 'Los primeros resultados (leads y consultas) se ven desde la primera semana de campaña activa. Resultados optimizados se logran entre 4-8 semanas cuando ya tenemos data del comportamiento del público de la V Región. El mercado de Viña tiene particularidades estacionales que sabemos aprovechar.'
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
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-3xl">
              <nav className="text-blue-200 text-sm mb-6">
                <Link href="/" className="hover:text-white">Inicio</Link>
                <span className="mx-2">/</span>
                <span className="text-white">Agencia Marketing Digital Viña del Mar</span>
              </nav>

              <div className="inline-block px-4 py-2 bg-cyan-500/20 backdrop-blur border border-cyan-400/30 rounded-full mb-6">
                <span className="text-cyan-200 font-semibold text-sm">
                  V Región: Viña del Mar • Valparaíso • Con Con • Reñaca
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Agencia Marketing Digital<br />
                <span className="text-cyan-300">Viña del Mar</span>
              </h1>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Especialistas en Google Ads, Meta Ads y performance marketing para empresas de
                Viña del Mar, Valparaíso y toda la V Región. Resultados medibles y equipo
                dedicado para tu negocio.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/cotizador"
                  className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-semibold shadow-lg text-center"
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
        <section className="bg-gradient-to-r from-cyan-50 to-blue-50 py-12 border-b border-cyan-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">+50</div>
                <div className="text-gray-700 font-semibold">Clientes V Región</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">+200</div>
                <div className="text-gray-700 font-semibold">Campañas activas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">5.0★</div>
                <div className="text-gray-700 font-semibold">115 reseñas Google</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-700 font-semibold">Monitoreo Campañas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Por qué Viña Section */}
        <section className="container mx-auto px-6 max-w-6xl py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Marketing Digital para Empresas de Viña del Mar
            </h2>
            <p className="text-gray-600 text-lg">
              Conocemos el mercado de la V Región y sus particularidades estacionales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
              <div className="text-4xl mb-4">🏖️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Experiencia en Turismo
              </h3>
              <p className="text-gray-700">
                Hoteles, restaurantes, tours y servicios turísticos. Sabemos manejar la
                estacionalidad de Viña del Mar y maximizar resultados en temporada alta.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Comercio Local
              </h3>
              <p className="text-gray-700">
                Retail, servicios profesionales y comercio de Viña, Valparaíso y Con Con.
                Targeting geolocalizado para captar clientes de la zona.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Educación y Servicios
              </h3>
              <p className="text-gray-700">
                Universidades, institutos, clínicas y servicios profesionales de la V Región.
                Campañas enfocadas en el público universitario y profesional.
              </p>
            </div>
          </div>
        </section>

        {/* Servicios Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Servicios de Marketing Digital en Viña del Mar
              </h2>
              <p className="text-gray-600 text-lg">
                Soluciones completas para empresas de la V Región
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/servicios/google-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  Google Ads Viña del Mar
                </h3>
                <p className="text-gray-700 text-sm">
                  Campañas de búsqueda, shopping y display para captar clientes en Viña y la V Región.
                </p>
              </Link>

              <Link href="/servicios/meta-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  Meta Ads Viña del Mar
                </h3>
                <p className="text-gray-700 text-sm">
                  Facebook e Instagram Ads con targeting geolocalizado para la costa.
                </p>
              </Link>

              <Link href="/servicios/seo-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  SEO Viña del Mar
                </h3>
                <p className="text-gray-700 text-sm">
                  Posicionamiento orgánico local para aparecer en búsquedas de la V Región.
                </p>
              </Link>

              <Link href="/servicios/instagram-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  Instagram Ads
                </h3>
                <p className="text-gray-700 text-sm">
                  Contenido visual para hoteles, restaurantes y servicios turísticos.
                </p>
              </Link>

              <Link href="/servicios/facebook-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📘</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  Facebook Ads
                </h3>
                <p className="text-gray-700 text-sm">
                  Campañas de conversión y remarketing para comercio local.
                </p>
              </Link>

              <Link href="/servicios/performance-marketing" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
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
              Cobertura completa de marketing digital en la costa y valle central
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              'Viña del Mar',
              'Valparaíso',
              'Con Con',
              'Reñaca',
              'Quilpué',
              'Villa Alemana',
              'Olmué',
              'Limache',
              'Quillota',
              'La Calera',
              'San Antonio',
              'Algarrobo'
            ].map((zona) => (
              <div key={zona} className="bg-cyan-50 rounded-lg p-4 text-center border border-cyan-200">
                <span className="text-gray-800 font-medium">{zona}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Preguntas Frecuentes - Marketing Digital Viña del Mar
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Atienden empresas de Viña del Mar y la V Región?
                </h3>
                <p className="text-gray-700">
                  Sí, atendemos empresas de toda la V Región incluyendo <strong>Viña del Mar,
                  Valparaíso, Con Con, Reñaca, Quilpué, Villa Alemana</strong> y alrededores.
                  Trabajamos de forma remota con reuniones virtuales y soporte en horario chileno.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Cuánto cuesta una agencia de marketing digital en Viña del Mar?
                </h3>
                <p className="text-gray-700">
                  Los servicios de marketing digital para empresas de Viña del Mar tienen un costo
                  desde <strong>$950.000 CLP mensuales</strong>. Incluye gestión de Google Ads o
                  Meta Ads, equipo dedicado de 3 profesionales, reportería semanal y optimización continua.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Trabajan con empresas turísticas de Viña del Mar?
                </h3>
                <p className="text-gray-700">
                  Sí, tenemos amplia experiencia con <strong>hoteles, restaurantes, tours y
                  servicios turísticos</strong> de la costa. Conocemos la estacionalidad del
                  mercado viñamarino y sabemos cómo optimizar campañas para temporada alta.
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
          <div className="bg-gradient-to-r from-blue-900 to-cyan-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Crecer en Viña del Mar?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Solicita una cotización gratuita y descubre cómo podemos ayudar a tu negocio
              a captar más clientes en la V Región.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cotizador"
                className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
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
