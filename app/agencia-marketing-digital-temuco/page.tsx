/**
 * Página SEO: Agencia Marketing Digital Temuco
 * Optimizada para rankear en Google con keywords de Temuco y IX Región
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
  title: 'Agencia Marketing Digital Temuco | Google Ads y Performance',
  description: 'Agencia marketing digital en Temuco especializada en Google Ads, Meta Ads y performance marketing. Atendemos IX Región: Temuco, Padre Las Casas, Villarrica, Pucón y Angol.',
  keywords: [
    'agencia marketing digital temuco',
    'marketing digital temuco',
    'agencia google ads temuco',
    'agencia publicidad digital temuco',
    'marketing digital ix region',
    'agencia marketing digital araucania',
    'agencia meta ads temuco',
    'publicidad digital temuco',
    'agencia marketing digital villarrica',
    'marketing digital pucon',
    'agencia publicidad temuco',
    'marketing digital angol'
  ],
  path: '/agencia-marketing-digital-temuco'
})

export default function AgenciaMarketingDigitalTemucoPage() {
  const webPageSchema = createWebPageSchema(
    'Agencia Marketing Digital Temuco | Muller y Pérez',
    'Agencia marketing digital en Temuco especializada en Google Ads, Meta Ads y performance marketing para empresas de la IX Región de La Araucanía',
    'https://www.mulleryperez.cl/agencia-marketing-digital-temuco'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Agencia Marketing Digital Temuco', url: 'https://www.mulleryperez.cl/agencia-marketing-digital-temuco' }
  ])

  // LocalBusiness Schema para Temuco
  const localBusinessSchema = createLocalBusinessSchema(cityData.temuco)

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Atienden empresas de Temuco y la IX Región?',
      answer: 'Sí, atendemos empresas de toda la IX Región de La Araucanía incluyendo Temuco, Padre Las Casas, Villarrica, Pucón, Angol, Victoria, Lautaro y Curacautín. Trabajamos de forma remota con reuniones virtuales y soporte en horario chileno.'
    },
    {
      question: '¿Cuánto cuesta una agencia de marketing digital en Temuco?',
      answer: 'Los servicios de marketing digital para empresas de Temuco tienen un costo desde $950.000 CLP mensuales. Esto incluye gestión de Google Ads o Meta Ads, equipo dedicado de 3 profesionales, reportería semanal y optimización continua.'
    },
    {
      question: '¿Qué servicios de marketing digital ofrecen en Temuco?',
      answer: 'Ofrecemos servicios completos de marketing digital para Temuco: Google Ads (Search, Shopping, Display), Meta Ads (Facebook e Instagram), LinkedIn Ads para B2B, SEO, creación de contenido y análisis de datos. Todos enfocados en generar conversiones y ventas reales.'
    },
    {
      question: '¿Tienen experiencia con empresas turísticas de La Araucanía?',
      answer: 'Sí, tenemos amplia experiencia con hoteles, cabañas, restaurantes y tours de Pucón, Villarrica y la zona lacustre. Conocemos la estacionalidad del turismo en La Araucanía y optimizamos campañas para cada temporada.'
    },
    {
      question: '¿Cuánto demora ver resultados con marketing digital en Temuco?',
      answer: 'Los primeros resultados (leads y consultas) se ven desde la primera semana de campaña activa. Resultados optimizados se logran entre 4-8 semanas cuando ya tenemos data del comportamiento del público de La Araucanía.'
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
        <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-700 text-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-3xl">
              <nav className="text-amber-200 text-sm mb-6">
                <Link href="/" className="hover:text-white">Inicio</Link>
                <span className="mx-2">/</span>
                <span className="text-white">Agencia Marketing Digital Temuco</span>
              </nav>

              <div className="inline-block px-4 py-2 bg-orange-500/20 backdrop-blur border border-orange-400/30 rounded-full mb-6">
                <span className="text-orange-200 font-semibold text-sm">
                  IX Región: Temuco • Villarrica • Pucón • Angol
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Agencia Marketing Digital<br />
                <span className="text-orange-300">Temuco</span>
              </h1>

              <p className="text-xl text-amber-100 mb-8 leading-relaxed">
                Especialistas en Google Ads, Meta Ads y performance marketing para empresas de
                Temuco y la IX Región de La Araucanía. Resultados medibles y equipo dedicado para tu negocio.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/cotizador"
                  className="px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold shadow-lg text-center"
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
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-12 border-b border-orange-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">+20</div>
                <div className="text-gray-700 font-semibold">Clientes IX Región</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">+380%</div>
                <div className="text-gray-700 font-semibold">ROI Promedio</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">95%</div>
                <div className="text-gray-700 font-semibold">Retención Clientes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">24/7</div>
                <div className="text-gray-700 font-semibold">Monitoreo Campañas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Por qué Temuco Section */}
        <section className="container mx-auto px-6 max-w-6xl py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Marketing Digital para Empresas de Temuco
            </h2>
            <p className="text-gray-600 text-lg">
              Conocemos el mercado de La Araucanía y sus industrias clave
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
              <div className="text-4xl mb-4">🏔️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Turismo y Aventura
              </h3>
              <p className="text-gray-700">
                Hoteles, cabañas, restaurantes y tours de Pucón, Villarrica y la zona lacustre.
                Campañas estacionales optimizadas para alta y baja temporada.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              <div className="text-4xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sector Agrícola
              </h3>
              <p className="text-gray-700">
                Empresas agrícolas, forestales y agroindustriales de La Araucanía.
                Marketing B2B para maquinaria, insumos y servicios del agro.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-lime-50 rounded-xl p-6 border border-yellow-200">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Comercio y Servicios
              </h3>
              <p className="text-gray-700">
                Retail, servicios profesionales y comercio de Temuco.
                Targeting geolocalizado para captar clientes de la ciudad.
              </p>
            </div>
          </div>
        </section>

        {/* Servicios Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Servicios de Marketing Digital en Temuco
              </h2>
              <p className="text-gray-600 text-lg">
                Soluciones completas para empresas de La Araucanía
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/servicios/google-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600">
                  Google Ads Temuco
                </h3>
                <p className="text-gray-700 text-sm">
                  Campañas de búsqueda, shopping y display para captar clientes en La Araucanía.
                </p>
              </Link>

              <Link href="/servicios/meta-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600">
                  Meta Ads Temuco
                </h3>
                <p className="text-gray-700 text-sm">
                  Facebook e Instagram Ads con targeting geolocalizado para la IX Región.
                </p>
              </Link>

              <Link href="/servicios/seo-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600">
                  SEO Temuco
                </h3>
                <p className="text-gray-700 text-sm">
                  Posicionamiento orgánico local para aparecer en búsquedas de La Araucanía.
                </p>
              </Link>

              <Link href="/servicios/instagram-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600">
                  Instagram Ads
                </h3>
                <p className="text-gray-700 text-sm">
                  Contenido visual para turismo, gastronomía y comercio local.
                </p>
              </Link>

              <Link href="/servicios/facebook-ads-chile" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">📘</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600">
                  Facebook Ads
                </h3>
                <p className="text-gray-700 text-sm">
                  Campañas de conversión y remarketing para comercio de Temuco.
                </p>
              </Link>

              <Link href="/servicios/performance-marketing" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600">
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
              Zonas de la IX Región que Atendemos
            </h2>
            <p className="text-gray-600 text-lg">
              Cobertura completa de marketing digital en La Araucanía
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              'Temuco',
              'Padre Las Casas',
              'Villarrica',
              'Pucón',
              'Angol',
              'Victoria',
              'Lautaro',
              'Curacautín',
              'Nueva Imperial',
              'Pitrufquén',
              'Freire',
              'Carahue'
            ].map((zona) => (
              <div key={zona} className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                <span className="text-gray-800 font-medium">{zona}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Preguntas Frecuentes - Marketing Digital Temuco
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Atienden empresas de Temuco y la IX Región?
                </h3>
                <p className="text-gray-700">
                  Sí, atendemos empresas de toda la IX Región de La Araucanía incluyendo <strong>Temuco,
                  Padre Las Casas, Villarrica, Pucón, Angol</strong> y alrededores.
                  Trabajamos de forma remota con reuniones virtuales y soporte en horario chileno.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Cuánto cuesta una agencia de marketing digital en Temuco?
                </h3>
                <p className="text-gray-700">
                  Los servicios de marketing digital para empresas de Temuco tienen un costo
                  desde <strong>$950.000 CLP mensuales</strong>. Incluye gestión de Google Ads o
                  Meta Ads, equipo dedicado de 3 profesionales, reportería semanal y optimización continua.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Tienen experiencia con empresas turísticas de La Araucanía?
                </h3>
                <p className="text-gray-700">
                  Sí, tenemos amplia experiencia con <strong>hoteles, cabañas, restaurantes
                  y tours de Pucón y Villarrica</strong>. Conocemos la estacionalidad del
                  turismo lacustre y optimizamos campañas para cada temporada.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Cuánto demora ver resultados con marketing digital?
                </h3>
                <p className="text-gray-700">
                  Los primeros resultados (leads y consultas) se ven desde la <strong>primera
                  semana</strong> de campaña activa. Resultados optimizados se logran entre
                  4-8 semanas cuando ya tenemos data del comportamiento del público de La Araucanía.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="container mx-auto px-6 max-w-4xl py-16">
          <div className="bg-gradient-to-r from-amber-900 to-orange-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Crecer en Temuco?
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              Solicita una cotización gratuita y descubre cómo podemos ayudar a tu negocio
              a captar más clientes en la IX Región de La Araucanía.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cotizador"
                className="inline-block px-8 py-4 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
              >
                Solicitar Propuesta Gratis
              </Link>
              <Link
                href="/labs/predictor"
                className="inline-block px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold text-lg"
              >
                Simular ROI en Araucanía
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
