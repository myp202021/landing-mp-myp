/**
 * Página Servicio: Google Ads Chile
 * SEO optimizada para rankear "agencia google ads chile"
 */

import { Metadata } from 'next'
import Link from 'next/link'
import {
  createMetadata,
  createServiceSchema,
  createFAQPageSchema,
  createBreadcrumbSchema
} from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Agencia Google Ads Chile | Expertos Certificados en SEM y Performance',
  description: 'Agencia Google Ads en Chile especializada en campañas de alto rendimiento. Equipo certificado, transparencia total y resultados medibles. Desde $990.000/mes.',
  keywords: [
    'agencia google ads chile',
    'google ads chile',
    'agencia google ads santiago',
    'mejor agencia google ads chile',
    'especialistas google ads chile',
    'gestión google ads chile',
    'campañas google ads chile',
    'google adwords chile',
    'sem chile',
    'publicidad google chile'
  ],
  path: '/servicios/google-ads-chile'
})

export default function GoogleAdsChilePage() {
  // Schema markup
  const serviceSchema = createServiceSchema({
    name: 'Gestión Google Ads Chile',
    description: 'Servicio profesional de gestión de campañas Google Ads en Chile con equipo dedicado y optimización continua',
    serviceType: 'Publicidad Digital',
    price: '990000',
    priceCurrency: 'CLP'
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Servicios', url: 'https://www.mulleryperez.cl' },
    { name: 'Google Ads Chile', url: 'https://www.mulleryperez.cl/servicios/google-ads-chile' }
  ])

  const faqSchema = createFAQPageSchema([
    {
      question: '¿Cuánto cuesta una agencia de Google Ads en Chile?',
      answer: 'El costo de una agencia de Google Ads en Chile varía entre $600.000 y $1.500.000+ mensuales. En Muller y Pérez ofrecemos gestión profesional desde $990.000/mes con equipo dedicado de 3 personas, acceso full a tu cuenta y reportería semanal.'
    },
    {
      question: '¿Qué incluye el servicio de Google Ads?',
      answer: 'Nuestro servicio incluye: investigación de keywords, creación y optimización de campañas Search, Shopping, Display y Performance Max, gestión de presupuesto, optimización de pujas, testing de anuncios, análisis de conversiones, reportería semanal y reuniones mensuales estratégicas.'
    },
    {
      question: '¿Cuánto debería invertir en Google Ads mensualmente?',
      answer: 'Recomendamos un mínimo de $1.500.000 - $2.000.000 CLP mensuales en inversión publicitaria (además del fee de agencia) para tener data suficiente y optimizar correctamente. Con presupuestos menores, la fase de aprendizaje toma más tiempo.'
    },
    {
      question: '¿En cuánto tiempo se ven resultados con Google Ads?',
      answer: 'Los primeros leads pueden llegar desde el día 1 de activar las campañas. Sin embargo, la optimización real requiere 2-3 meses de data para alcanzar el costo por adquisición (CPA) óptimo. Trabajamos con transparencia total desde el inicio.'
    },
    {
      question: '¿Por qué elegir una agencia certificada de Google Ads?',
      answer: 'Las agencias certificadas Google Partner tienen acceso a soporte prioritario de Google, herramientas exclusivas, capacitación constante y han demostrado expertise manejando campañas exitosas. En M&P somos Google Partners certificados.'
    }
  ])

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="text-blue-200 hover:text-white transition">Inicio</Link>
              <span className="mx-2 text-blue-300">/</span>
              <span className="text-white font-semibold">Google Ads Chile</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full mb-6">
                  <span className="text-green-300 font-semibold">✓ Google Partner Certificado</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Agencia Google Ads Chile:<br />
                  <span className="text-blue-300">Resultados Medibles, Transparencia Total</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Somos una agencia especializada en <strong>Google Ads en Chile</strong> con equipo certificado,
                  acceso full a tu cuenta y foco 100% en performance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/#contact"
                    className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-center"
                  >
                    Solicitar Auditoría Gratis
                  </Link>
                  <Link
                    href="/#pricing"
                    className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-lg hover:bg-white/20 transition font-semibold text-center"
                  >
                    Ver Planes
                  </Link>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">¿Por Qué Google Ads?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">Intención de compra alta</strong>
                      <span className="text-blue-200">Usuarios buscando activamente tu servicio</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">Resultados desde día 1</strong>
                      <span className="text-blue-200">Tráfico calificado inmediato</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <strong className="block">100% medible</strong>
                      <span className="text-blue-200">Sabes cuánto te cuesta cada cliente</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <article className="container mx-auto px-6 max-w-5xl py-16">
          {/* Qué incluye */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              ¿Qué Incluye Nuestro Servicio de Google Ads en Chile?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Campañas Search (Búsqueda)
                </h3>
                <p className="text-gray-700">
                  Aparece en los primeros resultados cuando tus clientes potenciales buscan tu servicio en Google.
                  Optimización de keywords, anuncios y landing pages.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="text-4xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Campañas Shopping (E-commerce)
                </h3>
                <p className="text-gray-700">
                  Muestra tus productos con imagen, precio y disponibilidad directamente en Google. Ideal para
                  tiendas online con alto ROAS.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Campañas Display (Remarketing)
                </h3>
                <p className="text-gray-700">
                  Re-impacta a usuarios que visitaron tu sitio pero no convirtieron. Banners visuales en la red
                  de display de Google.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Performance Max (Automatización IA)
                </h3>
                <p className="text-gray-700">
                  La tecnología más avanzada de Google. Automatiza la distribución de presupuesto entre todos
                  los canales para maximizar conversiones.
                </p>
              </div>
            </div>
          </section>

          {/* Proceso */}
          <section className="mb-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Nuestro Proceso de Gestión de Google Ads
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Auditoría Inicial y Estrategia
                  </h3>
                  <p className="text-gray-700">
                    Analizamos tu situación actual (si ya tienes Google Ads) o hacemos research de mercado.
                    Definimos keywords, presupuesto y KPIs objetivos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Configuración y Lanzamiento
                  </h3>
                  <p className="text-gray-700">
                    Creamos las campañas optimizadas, configuramos tracking completo (conversiones, GA4, Tag Manager)
                    y lanzamos. Primeros resultados en 24-48 horas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Optimización Continua
                  </h3>
                  <p className="text-gray-700">
                    Monitoreamos diariamente, optimizamos semanalmente. Ajustamos pujas, pausamos keywords
                    no rentables, testeamos nuevos anuncios, mejoramos Quality Score.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Reportería y Escalamiento
                  </h3>
                  <p className="text-gray-700">
                    Reportes semanales automáticos + reunión mensual estratégica. Cuando las campañas están
                    rentables, escalamos presupuesto para crecer sin perder eficiencia.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Diferenciadores */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              ¿Por Qué Somos la Mejor Agencia de Google Ads en Chile?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Google Partner Certificado
                </h3>
                <p className="text-gray-700">
                  Equipo con certificaciones oficiales de Google y años de experiencia gestionando millones
                  en inversión publicitaria.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🔓</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Acceso Full a Tu Cuenta
                </h3>
                <p className="text-gray-700">
                  No somos propietarios de tu cuenta. Tienes acceso completo desde día 1. Si te vas, te llevas
                  todo tu historial.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Performance, No Vanidad
                </h3>
                <p className="text-gray-700">
                  No te vendemos "impresiones" o "clicks". Te decimos exactamente cuánto te cuesta conseguir
                  un cliente nuevo (CAC).
                </p>
              </div>
            </div>
          </section>

          {/* Precios */}
          <section className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Planes de Google Ads en Chile
            </h2>

            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Gold</h3>
                  <p className="text-gray-600">El más popular para empresas en crecimiento</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">$990.000</div>
                  <div className="text-gray-600">/ mes + IVA</div>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Equipo dedicado de 3 profesionales</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Todas las campañas Google Ads</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Acceso full a tu cuenta</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Reportería semanal</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Optimización diaria</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Reuniones mensuales estratégicas</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              * Presupuesto publicitario aparte (mínimo recomendado: $1.5M - $2M CLP/mes)
            </p>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes sobre Google Ads en Chile
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: '¿Cuánto cuesta una agencia de Google Ads en Chile?',
                  a: 'El costo de una agencia de Google Ads en Chile varía entre $600.000 y $1.500.000+ mensuales. En Muller y Pérez ofrecemos gestión profesional desde $990.000/mes con equipo dedicado de 3 personas, acceso full a tu cuenta y reportería semanal.'
                },
                {
                  q: '¿Qué incluye el servicio de Google Ads?',
                  a: 'Nuestro servicio incluye: investigación de keywords, creación y optimización de campañas Search, Shopping, Display y Performance Max, gestión de presupuesto, optimización de pujas, testing de anuncios, análisis de conversiones, reportería semanal y reuniones mensuales estratégicas.'
                },
                {
                  q: '¿Cuánto debería invertir en Google Ads mensualmente?',
                  a: 'Recomendamos un mínimo de $1.500.000 - $2.000.000 CLP mensuales en inversión publicitaria (además del fee de agencia) para tener data suficiente y optimizar correctamente. Con presupuestos menores, la fase de aprendizaje toma más tiempo.'
                },
                {
                  q: '¿En cuánto tiempo se ven resultados con Google Ads?',
                  a: 'Los primeros leads pueden llegar desde el día 1 de activar las campañas. Sin embargo, la optimización real requiere 2-3 meses de data para alcanzar el costo por adquisición (CPA) óptimo. Trabajamos con transparencia total desde el inicio.'
                },
                {
                  q: '¿Por qué elegir una agencia certificada de Google Ads?',
                  a: 'Las agencias certificadas Google Partner tienen acceso a soporte prioritario de Google, herramientas exclusivas, capacitación constante y han demostrado expertise manejando campañas exitosas. En M&P somos Google Partners certificados.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Crecer con Google Ads?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Solicita una auditoría gratuita de 30 minutos. Analizamos tu situación actual y te mostramos
              oportunidades concretas de mejora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-lg"
              >
                Solicitar Auditoría Gratis
              </Link>
              <Link
                href="/agencia-marketing-digital-chile"
                className="px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition font-semibold text-lg"
              >
                Conocer Todos los Servicios
              </Link>
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
