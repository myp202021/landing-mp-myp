/**
 * Servicio: Performance Marketing Chile
 * Página SEO optimizada para keywords de Performance Marketing en Chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Performance Marketing Chile | Agencia Estrategia Multicanal Data-Driven',
  description: 'Agencia Performance Marketing Chile. Estrategia integral data-driven combinando Google Ads, Meta Ads, LinkedIn, analítica avanzada y CRO. Equipo dedicado, ROI optimizado.',
  keywords: [
    'performance marketing chile',
    'agencia performance marketing',
    'marketing performance chile',
    'estrategia performance marketing',
    'agencia data driven chile',
    'marketing digital performance',
    'performance marketing b2b chile'
  ],
  path: '/servicios/performance-marketing'
})

export default function PerformanceMarketingPage() {
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
                name: 'Performance Marketing',
                item: 'https://www.mulleryperez.cl/servicios/performance-marketing'
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
            serviceType: 'Performance Marketing Chile - Estrategia Multicanal Data-Driven',
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
              'Agencia Performance Marketing Chile. Estrategia integral que combina Google Ads, Meta Ads, LinkedIn Ads, analítica avanzada, CRO y automatización. Equipo dedicado de 3+ profesionales, enfoque 100% en ROI y resultados medibles.',
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
                name: '¿Qué es Performance Marketing y en qué se diferencia del marketing tradicional?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Performance Marketing es marketing digital basado 100% en resultados medibles y optimizables. A diferencia del marketing tradicional (TV, radio, vallas), cada peso invertido es rastreable hasta la conversión final. Optimizamos continuamente para maximizar ROI usando datos en tiempo real. Pagas por resultados concretos: leads, ventas, registros. No por impresiones o alcance.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Cuánto cuesta contratar una agencia de Performance Marketing en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'El servicio de Performance Marketing comienza desde $1.490.000 CLP mensuales. Incluye estrategia multicanal (Google Ads + Meta Ads + LinkedIn), equipo dedicado de 3+ profesionales, analítica avanzada, CRO, creatividades, reportería ejecutiva y reuniones estratégicas. Es el servicio más completo para empresas que buscan crecimiento escalable y predecible.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué canales incluye una estrategia de Performance Marketing?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Incluye todos los canales pagados: Google Ads (Search, Shopping, Display, Performance Max), Meta Ads (Facebook, Instagram, WhatsApp), LinkedIn Ads (para B2B), YouTube Ads, remarketing cross-platform, email marketing automatizado, y landing pages optimizadas. La combinación de canales se define según tu industria, público objetivo y presupuesto disponible.'
                }
              },
              {
                '@type': 'Question',
                name: '¿En cuánto tiempo veo resultados con Performance Marketing?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Primeros resultados medibles en 15-30 días: campañas activas, primeros leads/ventas, métricas base establecidas. Optimización significativa en 45-60 días: algoritmos maduros, suficientes datos para decisiones estratégicas. Escalamiento rentable en 90+ días: ROI positivo consistente, procesos optimizados, crecimiento predecible mes a mes.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Performance Marketing funciona para empresas B2B en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sí, Performance Marketing es especialmente efectivo para B2B en Chile. Usamos LinkedIn Ads para targeting por cargo y empresa, Google Ads para capturar búsquedas comerciales, remarketing para ciclos de venta largos, y lead nurturing automatizado. B2B requiere enfoque en calidad de leads (no cantidad), MQL/SQL claros, y seguimiento hasta cierre comercial. Nuestro equipo tiene experiencia comprobada en B2B tech, servicios profesionales y manufactura.'
                }
              }
            ]
          })
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-green-500/20 backdrop-blur border border-green-400/30 rounded-full mb-6">
              <span className="text-green-200 font-semibold text-sm">
                🚀 Estrategia Multicanal • Data-Driven • ROI Optimizado
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Performance Marketing Chile
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Estrategia integral que combina Google Ads, Meta Ads, LinkedIn Ads, analítica avanzada y
              optimización continua. Máximo rendimiento de tu inversión con equipo dedicado de 3+
              profesionales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold shadow-lg text-center"
              >
                Solicitar Cotización
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

      {/* Qué es Performance Marketing */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Qué es Performance Marketing?
            </h2>
            <p className="text-gray-600 text-lg">
              Marketing digital basado 100% en resultados medibles y optimizables
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">❌ Marketing Tradicional</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Pagas por impresiones y alcance</li>
                <li>• No sabes qué funciona y qué no</li>
                <li>• Resultados difíciles de medir</li>
                <li>• Decisiones basadas en intuición</li>
                <li>• ROI incierto o negativo</li>
                <li>• Sin optimización continua</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">✅ Performance Marketing</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Pagas por resultados concretos (leads, ventas)</li>
                <li>• Cada peso invertido es rastreable</li>
                <li>• 100% medible en tiempo real</li>
                <li>• Decisiones basadas en datos</li>
                <li>• ROI positivo y predecible</li>
                <li>• Optimización diaria y continua</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              La Diferencia Clave
            </h3>
            <p className="text-gray-700 text-lg text-center leading-relaxed">
              En Performance Marketing, <strong>solo pagas por resultados</strong>. Si no hay
              conversiones, ajustamos la estrategia hasta que las haya. No vendemos impresiones ni
              alcance. Te decimos exactamente{' '}
              <span className="text-green-600 font-bold">
                cuánto cuesta conseguir un cliente nuevo
              </span>{' '}
              (CAC, CPA, CPL) y trabajamos para reducir ese costo cada mes.
            </p>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Qué Incluye Nuestro Servicio de Performance Marketing?
            </h2>
            <p className="text-gray-600 text-lg">
              Estrategia 360° con todos los canales y herramientas necesarias
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Google Ads Completo</h3>
              <p className="text-gray-700 text-sm">
                Search, Shopping, Display, Performance Max, YouTube Ads. Capturamos intención de
                búsqueda y remarketing cross-platform.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Meta Ads Completo</h3>
              <p className="text-gray-700 text-sm">
                Facebook, Instagram, WhatsApp Ads. Targeting preciso, creatividades dinámicas,
                remarketing automatizado y lead gen optimizado.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">LinkedIn Ads (B2B)</h3>
              <p className="text-gray-700 text-sm">
                Targeting por cargo, empresa, industria. Ideal para B2B tech, servicios profesionales
                y decisores empresariales.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analítica Avanzada</h3>
              <p className="text-gray-700 text-sm">
                Google Analytics 4, Data Studio, píxeles configurados, eventos personalizados,
                atribución multi-touch y dashboards en tiempo real.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                CRO & Landing Pages
              </h3>
              <p className="text-gray-700 text-sm">
                Conversion Rate Optimization, A/B testing, landing pages optimizadas, formularios
                inteligentes y user experience mejorada.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Creatividades In-House</h3>
              <p className="text-gray-700 text-sm">
                Diseñador dedicado: banners, videos, gráficas, adaptaciones por canal. Nuevas
                creatividades cada semana.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Automatización & CRM
              </h3>
              <p className="text-gray-700 text-sm">
                Lead nurturing automatizado, email marketing, secuencias por comportamiento,
                integración con CRM existente.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Equipo Dedicado (3+ personas)
              </h3>
              <p className="text-gray-700 text-sm">
                Paid Media Planner, Publicista y Diseñador asignados exclusivamente a tu cuenta. No
                eres un cliente más.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Reportería Ejecutiva
              </h3>
              <p className="text-gray-700 text-sm">
                Reportes semanales y mensuales con métricas clave: CPL, CPA, CAC, ROAS, LTV, ROI.
                Reuniones estratégicas mensuales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Para Quién es Performance Marketing?
          </h2>
          <p className="text-gray-600 text-lg">
            Este servicio es ideal si cumples con alguno de estos criterios
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border border-green-200">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Empresas en Crecimiento
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>
                  <strong>Facturación +$50M anuales</strong> o presupuesto marketing significativo
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>
                  Buscan <strong>escalar ventas de forma predecible</strong> y sostenible
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>
                  Necesitan <strong>equipo completo</strong> sin contrataciones internas
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>
                  Quieren <strong>visibilidad total</strong> de cada peso invertido
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Industrias Ideales</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  <strong>E-commerce</strong> con ticket promedio +$30.000
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  <strong>SaaS y Tecnología</strong> (B2B y B2C)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  <strong>Servicios Profesionales</strong> (consultoría, legal, contable)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  <strong>Educación Online</strong> (cursos, programas, certificaciones)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  <strong>Inmobiliaria</strong> (proyectos +UF 2.000)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>
                  <strong>Salud Privada</strong> (clínicas, centros médicos)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
          <h4 className="font-semibold text-gray-900 mb-2">⚠️ ¿No cumples estos criterios?</h4>
          <p className="text-gray-700">
            Si tu presupuesto es más acotado o recién estás empezando, considera nuestros servicios
            individuales de <Link href="/servicios/google-ads-chile" className="text-blue-600 font-semibold hover:underline">Google Ads Chile</Link> o{' '}
            <Link href="/servicios/meta-ads-chile" className="text-blue-600 font-semibold hover:underline">Meta Ads Chile</Link> desde $890.000/mes.
            Performance Marketing es para empresas que ya tienen tracción y buscan acelerar crecimiento.
          </p>
        </div>
      </section>

      {/* Nuestro proceso */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Cómo Trabajamos en Performance Marketing?
            </h2>
            <p className="text-gray-600 text-lg">
              Metodología probada en +50 empresas en Chile
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Diagnóstico Profundo (Semana 1)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Análisis completo de tu negocio: producto/servicio, competencia, mercado, público
                    objetivo, funnel actual, tecnología existente. Auditoría de campañas previas (si
                    existen). Definición de KPIs críticos y metas SMART.
                  </p>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <strong>Entregables:</strong> Documento de Diagnóstico, Benchmark Competitivo,
                    Recomendaciones Estratégicas.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-teal-500 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Estrategia Multicanal (Semana 2)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Diseño de estrategia integral: canales prioritarios, presupuesto por canal,
                    arquitectura de campañas, segmentación de audiencias, mensajes clave por etapa de
                    funnel. Setup técnico: píxeles, eventos, analytics, CRM integrations.
                  </p>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <strong>Entregables:</strong> Plan Estratégico 90 días, Roadmap de Canales, Setup
                    Técnico Completo.
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
                    Lanzamiento & Testing (Semanas 3-6)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Activación de todos los canales simultáneamente. Google Ads, Meta Ads, LinkedIn
                    Ads en modo learning. Testing de audiencias, mensajes, creatividades y landing
                    pages. Monitoreo diario, ajustes rápidos. Primeros resultados medibles.
                  </p>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <strong>Entregables:</strong> Campaña Activas, Primeros Leads/Ventas, Reporte
                    Semanal con Insights.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-indigo-500 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Optimización Continua (Mes 2+)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Con datos sólidos, optimizamos agresivamente: pausamos lo que no funciona,
                    escalamos lo que sí. CRO en landing pages, nuevas creatividades, expansión de
                    audiencias Lookalike, remarketing avanzado. ROI positivo consistente.
                  </p>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <strong>Entregables:</strong> Reportes Ejecutivos Mensuales, Reunión Estratégica,
                    Plan de Mejora Continua.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas que importan */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Las Métricas que Realmente Importan
          </h2>
          <p className="text-gray-600 text-lg">
            No vendemos impresiones. Te decimos cuánto cuesta conseguir un cliente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-2xl font-bold mb-2">CAC</h3>
            <p className="text-sm text-green-100">
              <strong>Costo de Adquisición de Cliente.</strong> Cuánto te cuesta conseguir un cliente
              nuevo, considerando toda la inversión en marketing.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-2xl font-bold mb-2">CPA</h3>
            <p className="text-sm text-blue-100">
              <strong>Costo Por Adquisición.</strong> Cuánto pagas por cada conversión (lead, venta,
              registro). El KPI más importante en performance.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-2xl font-bold mb-2">ROAS</h3>
            <p className="text-sm text-purple-100">
              <strong>Return On Ad Spend.</strong> Por cada $1 invertido en publicidad, cuánto
              retornas en ventas. Target: 3x-5x en ecommerce, 5x-10x en servicios.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-2xl font-bold mb-2">LTV</h3>
            <p className="text-sm text-orange-100">
              <strong>Lifetime Value.</strong> Valor total que genera un cliente durante toda su
              relación contigo. Crucial para saber cuánto puedes pagar por adquirirlo.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            La Fórmula del Éxito
          </h3>
          <div className="text-center text-gray-700">
            <p className="text-lg mb-2">
              <strong>LTV {">"} CAC</strong> (ojalá 3:1 o mejor)
            </p>
            <p className="text-sm">
              Si el valor de vida del cliente (LTV) es mayor que el costo de adquirirlo (CAC), tienes
              un negocio escalable. Nuestro trabajo es{' '}
              <span className="text-green-600 font-bold">maximizar LTV</span> y{' '}
              <span className="text-blue-600 font-bold">minimizar CAC</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Muller y Pérez para Performance Marketing?
            </h2>
            <p className="text-gray-600 text-lg">
              No somos otra agencia más. Esto es lo que nos diferencia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Equipo Dedicado Exclusivo
              </h3>
              <p className="text-gray-700">
                3+ profesionales asignados a tu cuenta: Paid Media Planner, Publicista, Diseñador. No
                eres un número más. Conocen tu negocio a fondo y trabajan solo para ti.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🔓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Transparencia Absoluta
              </h3>
              <p className="text-gray-700">
                Acceso completo a todas tus cuentas publicitarias. Las cuentas son tuyas, nosotros
                solo las administramos. Reportes en tiempo real, datos reales, sin maquillaje.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Data-Driven 100%
              </h3>
              <p className="text-gray-700">
                Decisiones basadas en datos, no en intuición. A/B testing continuo, analítica
                avanzada, dashboards en tiempo real. Optimizamos matemáticamente tu inversión.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-12 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold mb-4">Inversión: Desde $1.490.000/mes</h2>
            <p className="text-xl text-green-100 mb-8">
              Estrategia multicanal completa con equipo dedicado. El servicio más completo para
              empresas que buscan crecimiento escalable y predecible. Presupuesto publicitario se
              cotiza aparte según industria y objetivos.
            </p>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Incluye TODO:</h3>
              <ul className="text-left space-y-2 text-green-100">
                <li>✓ Google Ads + Meta Ads + LinkedIn Ads</li>
                <li>✓ Equipo dedicado de 3+ profesionales</li>
                <li>✓ Estrategia multicanal integrada</li>
                <li>✓ Analítica avanzada (GA4, Data Studio)</li>
                <li>✓ CRO & Landing Pages optimizadas</li>
                <li>✓ Creatividades in-house ilimitadas</li>
                <li>✓ Automatización & Lead Nurturing</li>
                <li>✓ Reportería ejecutiva semanal/mensual</li>
                <li>✓ Reuniones estratégicas mensuales</li>
                <li>✓ Acceso full a todas las cuentas</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-semibold shadow-lg"
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
          Preguntas Frecuentes sobre Performance Marketing
        </h2>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Qué es Performance Marketing y en qué se diferencia del marketing tradicional?
            </h3>
            <p className="text-gray-700">
              <strong>Performance Marketing</strong> es marketing digital basado 100% en resultados
              medibles y optimizables. A diferencia del marketing tradicional (TV, radio, vallas),
              cada peso invertido es rastreable hasta la conversión final. Optimizamos continuamente
              para maximizar ROI usando datos en tiempo real. Pagas por resultados concretos: leads,
              ventas, registros. No por impresiones o alcance.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Cuánto cuesta contratar una agencia de Performance Marketing en Chile?
            </h3>
            <p className="text-gray-700">
              El servicio de Performance Marketing comienza desde{' '}
              <strong>$1.490.000 CLP mensuales</strong>. Incluye estrategia multicanal (Google Ads +
              Meta Ads + LinkedIn), equipo dedicado de 3+ profesionales, analítica avanzada, CRO,
              creatividades, reportería ejecutiva y reuniones estratégicas. Es el servicio más
              completo para empresas que buscan crecimiento escalable y predecible.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Qué canales incluye una estrategia de Performance Marketing?
            </h3>
            <p className="text-gray-700">
              Incluye todos los canales pagados: <strong>Google Ads</strong> (Search, Shopping,
              Display, Performance Max), <strong>Meta Ads</strong> (Facebook, Instagram, WhatsApp),{' '}
              <strong>LinkedIn Ads</strong> (para B2B), <strong>YouTube Ads</strong>, remarketing
              cross-platform, email marketing automatizado, y landing pages optimizadas. La
              combinación de canales se define según tu industria, público objetivo y presupuesto
              disponible.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿En cuánto tiempo veo resultados con Performance Marketing?
            </h3>
            <p className="text-gray-700">
              <strong>Primeros resultados medibles en 15-30 días:</strong> campañas activas, primeros
              leads/ventas, métricas base establecidas. <strong>Optimización significativa en 45-60 días:</strong>{' '}
              algoritmos maduros, suficientes datos para decisiones estratégicas.{' '}
              <strong>Escalamiento rentable en 90+ días:</strong> ROI positivo consistente, procesos
              optimizados, crecimiento predecible mes a mes.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Performance Marketing funciona para empresas B2B en Chile?
            </h3>
            <p className="text-gray-700">
              <strong>Sí</strong>, Performance Marketing es especialmente efectivo para B2B en Chile.
              Usamos LinkedIn Ads para targeting por cargo y empresa, Google Ads para capturar
              búsquedas comerciales, remarketing para ciclos de venta largos, y lead nurturing
              automatizado. B2B requiere enfoque en calidad de leads (no cantidad), MQL/SQL claros, y
              seguimiento hasta cierre comercial. Nuestro equipo tiene experiencia comprobada en B2B
              tech, servicios profesionales y manufactura.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-r from-green-900 to-teal-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Escalar con Performance Marketing?</h2>
          <p className="text-xl text-green-100 mb-8">
            Solicita una auditoría estratégica gratuita. Te mostramos oportunidades concretas para
            mejorar ROI, reducir CAC y escalar ventas predeciblemente.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
          >
            Solicitar Auditoría Estratégica
          </Link>
        </div>
      </section>
    </div>
  )
}
