/**
 * Servicio: Growth Marketing Chile
 * Página SEO optimizada para keywords de Growth Marketing en Chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Growth Marketing Chile | Agencia de Crecimiento Escalable y Data-Driven',
  description: 'Agencia de Growth Marketing en Chile. Estrategia de crecimiento integral: adquisición, activación, retención y revenue. Experimentación continua, datos y automatización para escalar tu negocio.',
  keywords: [
    'growth marketing chile',
    'agencia growth marketing chile',
    'growth marketing santiago',
    'agencia de crecimiento chile',
    'growth hacking chile',
    'estrategia de crecimiento digital chile',
    'growth marketing b2b chile',
    'agencia growth partner chile'
  ],
  path: '/servicios/growth-marketing'
})

export default function GrowthMarketingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: 'https://www.mulleryperez.cl'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Servicios',
                item: 'https://www.mulleryperez.cl/servicios'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Growth Marketing',
                item: 'https://www.mulleryperez.cl/servicios/growth-marketing'
              }
            ]
          })
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Growth Marketing Chile - Estrategia de Crecimiento Escalable',
            provider: {
              '@type': 'Organization',
              name: 'Muller y Pérez',
              url: 'https://www.mulleryperez.cl'
            },
            areaServed: {
              '@type': 'Country',
              name: 'Chile'
            },
            description:
              'Agencia de Growth Marketing en Chile. Estrategia de crecimiento integral combinando adquisición, activación, retención y revenue. Experimentación continua, automatización y analítica avanzada para escalar tu negocio de forma predecible.',
            offers: {
              '@type': 'Offer',
              price: '1490000',
              priceCurrency: 'CLP',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '1490000',
                priceCurrency: 'CLP',
                unitText: 'mes'
              }
            }
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: '¿Qué es Growth Marketing y en qué se diferencia del marketing digital?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Growth Marketing va más allá del marketing digital tradicional. Mientras el marketing digital se enfoca en atraer tráfico y generar leads, Growth Marketing trabaja todo el ciclo de vida del cliente: adquisición, activación, retención, referidos y revenue (framework AARRR). Usa experimentación rápida, datos y automatización para encontrar las palancas de crecimiento más eficientes.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Cuánto cuesta una agencia de Growth Marketing en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'El servicio de Growth Marketing en Chile parte desde $1.490.000 CLP mensuales. Incluye estrategia de crecimiento full-funnel, experimentación continua (A/B testing, CRO), campañas multicanal (Google Ads, Meta Ads, LinkedIn), automatización, analítica avanzada y equipo dedicado de 3+ profesionales. El presupuesto publicitario se cotiza aparte.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué es el framework AARRR en Growth Marketing?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'AARRR (Pirate Metrics) es el framework central del Growth Marketing: Adquisición (cómo llegan los usuarios), Activación (primera experiencia positiva), Retención (vuelven a usar tu producto), Referidos (recomiendan a otros) y Revenue (generan ingresos). Optimizar cada etapa permite crecer de forma exponencial y sostenible.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Growth Marketing funciona para empresas B2B en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sí. Growth Marketing es especialmente efectivo en B2B porque los ciclos de venta son largos y el costo de adquisición es alto. Aplicamos lead scoring, nurturing automatizado, contenido por etapa de funnel, LinkedIn Ads con targeting por cargo, y experimentación en cada punto de contacto para reducir el CAC y acelerar el pipeline.'
                }
              },
              {
                '@type': 'Question',
                name: '¿En cuánto tiempo se ven resultados con Growth Marketing?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Los primeros experimentos y quick wins se ven en 2-4 semanas. Resultados significativos en métricas de negocio (CAC, LTV, retención) entre 60-90 días. El crecimiento compuesto se nota a partir del mes 4-6 cuando los loops de crecimiento empiezan a retroalimentarse. Growth Marketing es una inversión que se acelera con el tiempo.'
                }
              }
            ]
          })
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur border border-purple-400/30 rounded-full mb-6">
              <span className="text-purple-200 font-semibold text-sm">
                Adquisición + Activación + Retención + Revenue
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Growth Marketing Chile
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Estrategia de crecimiento que va más allá de las campañas. Trabajamos todo el
              ciclo de vida del cliente con experimentación continua, datos y automatización
              para escalar tu negocio de forma predecible.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold shadow-lg text-center"
              >
                Solicitar Diagnóstico de Crecimiento
              </Link>
              <Link
                href="/servicios"
                className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold text-center"
              >
                Ver Todos los Servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Qué es Growth Marketing */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Qué es Growth Marketing?
            </h2>
            <p className="text-gray-600 text-lg">
              Crecimiento sistemático basado en datos, no en intuición
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Digital Tradicional</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Solo se enfoca en atraer tráfico</li>
                <li>Campañas aisladas sin conexión</li>
                <li>Reporta impresiones y clicks</li>
                <li>Ignora retención y recompra</li>
                <li>Crece linealmente con presupuesto</li>
                <li>Mismo playbook para todos</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Marketing</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Trabaja todo el ciclo de vida (AARRR)</li>
                <li>Estrategia integrada full-funnel</li>
                <li>Mide CAC, LTV, retención, revenue</li>
                <li>Optimiza retención y referidos</li>
                <li>Crece exponencialmente con loops</li>
                <li>Experimenta y adapta constantemente</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              La Diferencia Clave
            </h3>
            <p className="text-gray-700 text-lg text-center leading-relaxed">
              Growth Marketing no es solo conseguir clientes nuevos. Es construir un{' '}
              <span className="text-purple-600 font-bold">sistema de crecimiento</span> donde
              cada cliente adquirido se activa rápido, se retiene más tiempo, refiere a otros y
              genera más revenue. El resultado:{' '}
              <span className="text-indigo-600 font-bold">crecimiento compuesto</span> que se
              acelera cada mes.
            </p>
          </div>
        </div>
      </section>

      {/* Framework AARRR */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Framework AARRR: Las 5 Palancas de Crecimiento
            </h2>
            <p className="text-gray-600 text-lg">
              Optimizamos cada etapa del ciclo de vida del cliente
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  A
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Adquisición</h3>
                  <p className="text-gray-700">
                    Google Ads, Meta Ads, LinkedIn Ads, SEO, contenido. Encontramos los canales
                    más eficientes para tu industria y optimizamos el costo de adquisición (CAC)
                    con experimentación continua.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  A
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Activación</h3>
                  <p className="text-gray-700">
                    CRO, onboarding optimizado, landing pages, UX del primer contacto. Que el
                    usuario entienda tu propuesta de valor y tome acción en la primera visita.
                    Reducimos fricción en cada paso.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  R
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Retención</h3>
                  <p className="text-gray-700">
                    Email marketing automatizado, remarketing, nurturing por comportamiento,
                    contenido personalizado. Que tus clientes vuelvan, usen más tu producto y
                    no se vayan a la competencia.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500">
              <div className="flex items-start gap-4">
                <div className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  R
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Referidos</h3>
                  <p className="text-gray-700">
                    Programas de referidos, incentivos, NPS, viral loops. Convertimos a tus
                    clientes satisfechos en tu canal de adquisición más rentable. Un cliente
                    que refiere vale 3x más que un lead frío.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  R
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue</h3>
                  <p className="text-gray-700">
                    Upselling, cross-selling, pricing experiments, LTV optimization. Maximizamos
                    el valor de cada cliente a lo largo del tiempo. No basta con adquirir:
                    hay que monetizar eficientemente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Qué Incluye Nuestro Servicio de Growth Marketing?
          </h2>
          <p className="text-gray-600 text-lg">
            Todo lo que necesitas para crecer de forma sistemática
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Experimentación Continua</h3>
            <p className="text-gray-700 text-sm">
              Sprints de 2 semanas con hipótesis, tests y aprendizajes. A/B testing en ads,
              landing pages, emails, pricing. Cada experimento acumula conocimiento.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Campañas Multicanal</h3>
            <p className="text-gray-700 text-sm">
              Google Ads, Meta Ads, LinkedIn Ads, YouTube. Estrategia integrada donde
              cada canal tiene un rol específico en el funnel de crecimiento.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatización Inteligente</h3>
            <p className="text-gray-700 text-sm">
              Flujos automatizados de email, WhatsApp y remarketing por comportamiento.
              Lead scoring, nurturing y alertas de oportunidad. Tu funnel trabaja 24/7.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Analítica Full-Funnel</h3>
            <p className="text-gray-700 text-sm">
              Tracking completo desde el primer click hasta la recompra. Dashboards en
              tiempo real con CAC, LTV, payback period, cohortes de retención.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">CRO & Conversion</h3>
            <p className="text-gray-700 text-sm">
              Optimización de tasa de conversión en cada punto del funnel. Landing pages,
              formularios, checkout, onboarding. Cada 1% más de conversión es revenue directo.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Equipo Dedicado (3+ personas)</h3>
            <p className="text-gray-700 text-sm">
              Growth Strategist, Paid Media Specialist y Diseñador asignados exclusivamente
              a tu cuenta. Conocen tu negocio, tus datos y tus metas.
            </p>
          </div>
        </div>
      </section>

      {/* Growth Loops */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Growth Loops: Crecimiento que se Retroalimenta
            </h2>
            <p className="text-gray-600 text-lg">
              La diferencia entre crecer linealmente y crecer exponencialmente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Loop de Contenido</h3>
              <p className="text-gray-700 text-sm mb-4">
                Contenido SEO atrae tráfico orgánico. El tráfico genera datos. Los datos
                informan mejor contenido. Más contenido, más tráfico. Ciclo infinito.
              </p>
              <div className="text-sm text-purple-600 font-semibold bg-purple-50 p-2 rounded">
                Tráfico orgánico crece mes a mes sin más inversión
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-5xl mb-4">🗣️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Loop de Referidos</h3>
              <p className="text-gray-700 text-sm mb-4">
                Cliente satisfecho refiere a otro. Nuevo cliente también refiere. Cada
                referido tiene mejor tasa de conversión y mayor LTV que un lead frío.
              </p>
              <div className="text-sm text-indigo-600 font-semibold bg-indigo-50 p-2 rounded">
                CAC baja porque los referidos son casi gratis
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Loop de Datos</h3>
              <p className="text-gray-700 text-sm mb-4">
                Más clientes generan más datos. Más datos permiten mejor segmentación.
                Mejor segmentación reduce CAC. Menor CAC permite más clientes.
              </p>
              <div className="text-sm text-blue-600 font-semibold bg-blue-50 p-2 rounded">
                Campañas mejoran solas con volumen
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro proceso */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nuestro Proceso de Growth Marketing
          </h2>
          <p className="text-gray-600 text-lg">
            Metodología probada en +40 empresas en Chile
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Growth Audit (Semana 1-2)
                </h3>
                <p className="text-gray-700 mb-3">
                  Diagnóstico profundo de tu negocio: funnel actual, métricas base (CAC, LTV,
                  retención, churn), canales activos, competencia, producto. Identificamos los
                  cuellos de botella y las oportunidades de mayor impacto.
                </p>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Entregables:</strong> Growth Audit completo, Mapa de funnel con métricas,
                  Top 10 oportunidades priorizadas por impacto.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-indigo-500 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Growth Strategy (Semana 2-3)
                </h3>
                <p className="text-gray-700 mb-3">
                  Diseñamos la estrategia de crecimiento: North Star Metric, canales
                  prioritarios, roadmap de experimentos, stack tecnológico. Setup completo de
                  tracking, automatización y campañas.
                </p>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Entregables:</strong> Growth Strategy 90 días, Backlog de experimentos,
                  Setup técnico completo.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sprint de Experimentos (Semana 3-8)
                </h3>
                <p className="text-gray-700 mb-3">
                  Ejecutamos sprints de 2 semanas con 3-5 experimentos cada uno. Cada
                  experimento tiene hipótesis, métrica de éxito, duración y criterio de decisión.
                  Los ganadores se escalan, los perdedores generan aprendizaje.
                </p>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Entregables:</strong> Resultados por experimento, Quick wins implementados,
                  Reporte semanal con aprendizajes.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Escalamiento (Mes 3+)
                </h3>
                <p className="text-gray-700 mb-3">
                  Los experimentos ganadores se convierten en procesos. Escalamos los canales
                  rentables, activamos los growth loops, automatizamos lo repetitivo. El
                  crecimiento se vuelve predecible y compuesto.
                </p>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <strong>Entregables:</strong> Growth Dashboard ejecutivo, Reunión estratégica mensual,
                  Roadmap trimestral actualizado.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Para Quién es Growth Marketing?
            </h2>
            <p className="text-gray-600 text-lg">
              Ideal para empresas que ya tienen producto-mercado y quieren escalar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Empresas que Necesitan Growth
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">&#10003;</span>
                  <span>
                    <strong>Ya tienen clientes</strong> pero el crecimiento se estancó
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">&#10003;</span>
                  <span>
                    <strong>CAC subiendo</strong> y no saben cómo bajarlo
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">&#10003;</span>
                  <span>
                    <strong>Retención baja:</strong> clientes que compran una vez y no vuelven
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">&#10003;</span>
                  <span>
                    Quieren <strong>crecer sin multiplicar presupuesto</strong> proporcionalmente
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industrias Ideales</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">&bull;</span>
                  <span><strong>SaaS y Tecnología</strong> (B2B y B2C)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">&bull;</span>
                  <span><strong>E-commerce</strong> con potencial de recompra</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">&bull;</span>
                  <span><strong>Fintech y Servicios Financieros</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">&bull;</span>
                  <span><strong>Educación Online</strong> (cursos, membresías)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">&bull;</span>
                  <span><strong>Servicios Profesionales</strong> (consultoría, legal)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">&bull;</span>
                  <span><strong>Healthtech y Salud Privada</strong></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
            <h4 className="font-semibold text-gray-900 mb-2">
              ¿Recién estás empezando?
            </h4>
            <p className="text-gray-700">
              Si todavía no tienes producto-mercado validado o tu presupuesto es más acotado,
              te recomendamos empezar con{' '}
              <Link href="/servicios/google-ads-chile" className="text-blue-600 font-semibold hover:underline">
                Google Ads Chile
              </Link>{' '}
              o{' '}
              <Link href="/servicios/meta-ads-chile" className="text-blue-600 font-semibold hover:underline">
                Meta Ads Chile
              </Link>{' '}
              desde $890.000/mes. Growth Marketing es para empresas que ya tienen tracción y
              buscan acelerar.
            </p>
          </div>
        </div>
      </section>

      {/* Por qué M&P */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Por Qué Muller y Pérez para Growth Marketing?
          </h2>
          <p className="text-gray-600 text-lg">
            No somos una agencia genérica. Esto es lo que nos diferencia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Cultura de Experimentación
            </h3>
            <p className="text-gray-700">
              No vendemos paquetes fijos. Cada acción es un experimento con hipótesis y
              métrica de éxito. Iteramos rápido, descartamos lo que no funciona y
              escalamos lo que sí. Data sobre opiniones.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🔓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Transparencia Total
            </h3>
            <p className="text-gray-700">
              Acceso completo a tus cuentas publicitarias, dashboards y datos. Las
              cuentas son tuyas. Te mostramos exactamente qué funciona, qué no y
              por qué. Sin letra chica.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Stack Tecnológico Propio
            </h3>
            <p className="text-gray-700">
              Herramientas propias de análisis competitivo, predicción de CPC/CPA por
              industria y dashboards automatizados. No dependemos solo de herramientas
              genéricas. Tenemos tecnología que otras agencias no tienen.
            </p>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-12 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Inversión: Desde $1.490.000/mes</h2>
            <p className="text-xl text-purple-100 mb-8">
              Estrategia de crecimiento full-funnel con equipo dedicado. Experimentación
              continua, campañas multicanal, automatización y analítica avanzada.
              Presupuesto publicitario se cotiza aparte.
            </p>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Incluye:</h3>
              <ul className="text-left space-y-2 text-purple-100">
                <li>&#10003; Growth Audit + Estrategia full-funnel</li>
                <li>&#10003; Google Ads + Meta Ads + LinkedIn Ads</li>
                <li>&#10003; Sprints de experimentación cada 2 semanas</li>
                <li>&#10003; Automatización + Lead Nurturing</li>
                <li>&#10003; CRO + A/B Testing continuo</li>
                <li>&#10003; Equipo dedicado de 3+ profesionales</li>
                <li>&#10003; Analítica full-funnel (CAC, LTV, retención)</li>
                <li>&#10003; Growth Dashboard en tiempo real</li>
                <li>&#10003; Reuniones estratégicas mensuales</li>
                <li>&#10003; Acceso total a cuentas y datos</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold shadow-lg"
              >
                Solicitar Cotización
              </Link>
              <Link
                href="/servicios"
                className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold"
              >
                Ver Otros Servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Preguntas Frecuentes sobre Growth Marketing
        </h2>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Qué es Growth Marketing y en qué se diferencia del marketing digital?
            </h3>
            <p className="text-gray-700">
              <strong>Growth Marketing</strong> va más allá del marketing digital tradicional.
              Mientras el marketing digital se enfoca en atraer tráfico y generar leads, Growth
              Marketing trabaja todo el ciclo de vida del cliente: adquisición, activación,
              retención, referidos y revenue (framework AARRR). Usa experimentación rápida,
              datos y automatización para encontrar las palancas de crecimiento más eficientes.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Cuánto cuesta una agencia de Growth Marketing en Chile?
            </h3>
            <p className="text-gray-700">
              El servicio de Growth Marketing parte desde{' '}
              <strong>$1.490.000 CLP mensuales</strong>. Incluye estrategia de crecimiento
              full-funnel, experimentación continua, campañas multicanal (Google Ads, Meta Ads,
              LinkedIn), automatización, analítica avanzada y equipo dedicado de 3+
              profesionales. El presupuesto publicitario se cotiza aparte según tu industria.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Qué es el framework AARRR en Growth Marketing?
            </h3>
            <p className="text-gray-700">
              <strong>AARRR</strong> (Pirate Metrics) es el framework central del Growth
              Marketing: <strong>Adquisición</strong> (cómo llegan los usuarios),{' '}
              <strong>Activación</strong> (primera experiencia positiva),{' '}
              <strong>Retención</strong> (vuelven a usar tu producto),{' '}
              <strong>Referidos</strong> (recomiendan a otros) y{' '}
              <strong>Revenue</strong> (generan ingresos). Optimizar cada etapa permite
              crecer de forma exponencial y sostenible.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Growth Marketing funciona para empresas B2B en Chile?
            </h3>
            <p className="text-gray-700">
              <strong>Sí</strong>. Growth Marketing es especialmente efectivo en B2B porque los
              ciclos de venta son largos y el costo de adquisición es alto. Aplicamos lead
              scoring, nurturing automatizado, contenido por etapa de funnel, LinkedIn Ads con
              targeting por cargo, y experimentación en cada punto de contacto para reducir el
              CAC y acelerar el pipeline.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿En cuánto tiempo se ven resultados con Growth Marketing?
            </h3>
            <p className="text-gray-700">
              Los primeros experimentos y quick wins se ven en <strong>2-4 semanas</strong>.
              Resultados significativos en métricas de negocio (CAC, LTV, retención) entre{' '}
              <strong>60-90 días</strong>. El crecimiento compuesto se nota a partir del{' '}
              <strong>mes 4-6</strong> cuando los growth loops empiezan a retroalimentarse.
              Growth Marketing es una inversión que se acelera con el tiempo.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Crecer con Growth Marketing?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Solicita un Growth Audit gratuito. Analizamos tu funnel completo y te mostramos
            las oportunidades de mayor impacto para escalar tu negocio en Chile.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
          >
            Solicitar Growth Audit Gratuito
          </Link>
        </div>
      </section>
    </div>
  )
}
