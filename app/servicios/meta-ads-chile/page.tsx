/**
 * Servicio: Meta Ads Chile (Facebook, Instagram, WhatsApp)
 * Página SEO optimizada para keywords de Meta Ads en Chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Agencia Meta Ads Chile | Facebook, Instagram y WhatsApp Ads',
  description: 'Agencia especializada en Meta Ads Chile (Facebook, Instagram, WhatsApp). Campañas de alto impacto con targeting preciso, remarketing automatizado y conversión comprobada.',
  keywords: [
    'agencia meta ads chile',
    'meta ads chile',
    'facebook ads chile',
    'instagram ads chile',
    'whatsapp ads chile',
    'agencia facebook ads',
    'publicidad facebook instagram',
    'meta business chile'
  ],
  path: '/servicios/meta-ads-chile'
})

export default function MetaAdsChilePage() {
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
                name: 'Meta Ads Chile',
                item: 'https://www.mulleryperez.cl/servicios/meta-ads-chile'
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
            serviceType: 'Meta Ads Chile - Facebook, Instagram y WhatsApp Ads',
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
              'Agencia especializada en Meta Ads Chile. Campañas profesionales en Facebook, Instagram y WhatsApp con targeting preciso, remarketing automatizado y resultados medibles.',
            offers: {
              '@type': 'Offer',
              price: '890000',
              priceCurrency: 'CLP',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '890000',
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
                name: '¿Cuánto cuesta contratar una agencia Meta Ads en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'El servicio de Meta Ads Chile comienza desde $890.000 CLP mensuales. Este valor incluye estrategia, gestión profesional de campañas en Facebook, Instagram y WhatsApp, diseño de creatividades, remarketing automatizado y reportería ejecutiva semanal. La inversión publicitaria en Meta se cotiza aparte según presupuesto del cliente.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué diferencia a Meta Ads de Google Ads?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Meta Ads funciona con targeting por intereses, comportamiento y demografía, ideal para productos visuales y branding. Es perfecto para alcanzar audiencias que aún no te conocen. Google Ads captura intención de búsqueda activa. Meta Ads genera demanda, Google Ads captura demanda existente. Lo óptimo es combinar ambos canales en una estrategia integrada.'
                }
              },
              {
                '@type': 'Question',
                name: '¿En cuánto tiempo veo resultados con Meta Ads?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Los primeros resultados se ven entre 7-14 días de campaña activa. El algoritmo de Meta necesita fase de aprendizaje (50 conversiones por ad set). Resultados óptimos se alcanzan después de 30-45 días de optimización continua. A diferencia de Google Ads, Meta Ads requiere más tiempo de maduración pero puede escalar significativamente.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué presupuesto publicitario necesito para Meta Ads Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Recomendamos mínimo $500.000 CLP mensuales en inversión publicitaria para Meta Ads. Este presupuesto permite salir de la fase de aprendizaje y generar suficientes conversiones para optimización. Para campañas de awareness o branding, se puede partir con menos. Para ecommerce y performance, $1.000.000+ es ideal para escalar rápidamente.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Puedo usar WhatsApp Business con Meta Ads?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sí, integramos WhatsApp Business como canal de conversión en todas nuestras campañas Meta Ads. Configuramos botones de WhatsApp en anuncios, respuestas automáticas 24/7, y flujos de conversación para calificación de leads. WhatsApp tiene tasas de respuesta 3-5x superiores a formularios tradicionales en Chile.'
                }
              }
            ]
          })
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-pink-500/20 backdrop-blur border border-pink-400/30 rounded-full mb-6">
              <span className="text-pink-200 font-semibold text-sm">
                📱 Facebook • Instagram • WhatsApp
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Agencia Meta Ads Chile
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Campañas profesionales de alto impacto en Facebook, Instagram y WhatsApp. Alcanza a tu
              audiencia ideal con targeting preciso, remarketing automatizado y creatividades que
              convierten.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-semibold shadow-lg text-center"
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

      {/* Qué incluye el servicio */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Qué Incluye Nuestro Servicio de Meta Ads?
          </h2>
          <p className="text-gray-600 text-lg">
            Gestión profesional end-to-end de tus campañas en el ecosistema Meta
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Estrategia & Targeting
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Análisis de audiencia y buyer personas</li>
              <li>✓ Segmentación por intereses y comportamiento</li>
              <li>✓ Lookalike audiences y custom audiences</li>
              <li>✓ Retargeting multi-etapa (web, carrito, post-compra)</li>
              <li>✓ A/B testing de audiencias y creatividades</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Creatividades & Contenido
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Diseño de piezas visuales (imagen + video)</li>
              <li>✓ Copywriting persuasivo orientado a conversión</li>
              <li>✓ Stories, Reels, Carousel, Collection Ads</li>
              <li>✓ Adaptación de formatos por plataforma</li>
              <li>✓ Testing continuo de mensajes y ángulos</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Optimización & Reporting
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Monitoreo diario de performance</li>
              <li>✓ Optimización de CPM, CPC, CPL, CPA</li>
              <li>✓ Ajuste de presupuesto por rendimiento</li>
              <li>✓ Reportería ejecutiva semanal y mensual</li>
              <li>✓ Reuniones de estrategia mensuales</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Por qué Meta Ads funciona */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Meta Ads Funciona para Tu Negocio?
            </h2>
            <p className="text-gray-600 text-lg">
              El poder del targeting más avanzado del mercado
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Alcance Masivo en Chile
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>+12 millones de usuarios activos</strong> en Facebook e Instagram en Chile.
                Accede a la red social #1 del país donde tu audiencia pasa 2+ horas diarias.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• 82% de los chilenos con internet usa Facebook</li>
                <li>• 75% usa Instagram activamente</li>
                <li>• WhatsApp: 95% de penetración en smartphones</li>
                <li>• Alcance por edad, ubicación, intereses y más</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Targeting Hipersegmentado
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>Precisión quirúrgica</strong> para llegar exactamente a tu cliente ideal.
                Segmenta por edad, género, ubicación, intereses, comportamiento de compra y más.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Targeting por cargo laboral y empresa (B2B)</li>
                <li>• Intereses específicos (hobbies, marcas, eventos)</li>
                <li>• Comportamientos de compra (viajeros, compradores online)</li>
                <li>• Lookalikes de tu base de clientes actuales</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Remarketing Automatizado
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>Recupera ventas perdidas</strong> con remarketing inteligente. Impacta a
                usuarios que visitaron tu web, abandonaron carrito o interactuaron con tu contenido.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Pixel de Meta instalado correctamente</li>
                <li>• Audiencias de visitantes, carrito abandonado, leads</li>
                <li>• Secuencias de remarketing por tiempo de inactividad</li>
                <li>• Dynamic Product Ads para ecommerce</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                WhatsApp como Canal de Venta
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>Conversión instantánea</strong> con WhatsApp Business integrado. Respuesta
                inmediata 24/7, chatbots inteligentes y conversaciones que cierran ventas.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Click-to-WhatsApp ads con botón directo</li>
                <li>• Respuestas automáticas y flujos conversacionales</li>
                <li>• Tasa de respuesta 3-5x vs formularios tradicionales</li>
                <li>• Seguimiento de conversaciones hasta la venta</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro proceso */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Cómo Trabajamos en Meta Ads?
          </h2>
          <p className="text-gray-600 text-lg">
            Proceso estructurado para maximizar performance desde día 1
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border-l-4 border-pink-500">
            <div className="flex items-start gap-4">
              <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Auditoría & Diagnóstico (Semana 1)
                </h3>
                <p className="text-gray-700">
                  Analizamos tu industria, competencia, público objetivo y campañas previas (si
                  existen). Instalamos Pixel de Meta, configuramos eventos de conversión y definimos
                  KPIs críticos (CPL, CPA, ROAS).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Estrategia & Setup (Semana 2)
                </h3>
                <p className="text-gray-700">
                  Diseñamos estructura de campañas, audiencias y creatividades. Creamos primeras
                  piezas visuales, escribimos copy persuasivo y configuramos Business Manager
                  profesionalmente. Test inicial con 3-5 variantes de audiencia y mensaje.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Fase de Aprendizaje (Semanas 3-4)
                </h3>
                <p className="text-gray-700">
                  El algoritmo de Meta aprende qué audiencias y mensajes funcionan mejor. Necesitamos
                  ~50 conversiones por ad set para salir de aprendizaje. Optimizamos diariamente:
                  pausamos lo que no funciona, escalamos lo que sí.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-500">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Optimización Continua (Mes 2+)
                </h3>
                <p className="text-gray-700">
                  Con datos sólidos, escalamos presupuesto en audiencias ganadoras. Lanzamos nuevas
                  creatividades semanalmente (evitar fatiga publicitaria). Implementamos remarketing
                  avanzado y expandimos a Lookalikes de tus mejores clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué nos diferencia */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegirnos como Tu Agencia Meta Ads?
            </h2>
            <p className="text-gray-600 text-lg">
              No somos otra agencia más que promete resultados mágicos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Transparencia Total
              </h3>
              <p className="text-gray-700">
                Acceso completo a tu Business Manager. Las cuentas son tuyas, nosotros solo las
                administramos. Reportes ejecutivos semanales con métricas reales: CPL, CPA, ROAS,
                LTV.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Creatividades In-House
              </h3>
              <p className="text-gray-700">
                Diseñador dedicado en tu equipo. No subcontratamos creatividades. Nuevas piezas cada
                semana para evitar fatiga publicitaria. Sabemos qué formatos funcionan en Chile.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Enfoque en Performance
              </h3>
              <p className="text-gray-700">
                No vendemos likes ni alcance. Te decimos cuánto cuesta conseguir un cliente nuevo
                (CPA). Optimizamos para conversiones reales, no vanity metrics. ROI positivo o no
                cobramos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-12 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-6">📱</div>
            <h2 className="text-3xl font-bold mb-4">Inversión: Desde $890.000/mes</h2>
            <p className="text-xl text-pink-100 mb-8">
              Incluye estrategia, gestión de campañas, diseño de creatividades, remarketing y
              reportería ejecutiva. Presupuesto publicitario en Meta se cotiza aparte según tu
              industria y objetivos.
            </p>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">¿Qué Incluye?</h3>
              <ul className="text-left space-y-2 text-pink-100">
                <li>✓ Estrategia de Meta Ads personalizada</li>
                <li>✓ Configuración de Business Manager y Pixel</li>
                <li>✓ Creación de audiencias y targeting avanzado</li>
                <li>✓ Diseño de creatividades (imágenes + videos)</li>
                <li>✓ Remarketing multi-etapa automatizado</li>
                <li>✓ Integración con WhatsApp Business</li>
                <li>✓ Reportería ejecutiva semanal y mensual</li>
                <li>✓ Equipo dedicado de 3 profesionales</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition font-semibold shadow-lg"
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
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Preguntas Frecuentes sobre Meta Ads Chile
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Cuánto cuesta contratar una agencia Meta Ads en Chile?
              </h3>
              <p className="text-gray-700">
                El servicio de Meta Ads Chile comienza desde <strong>$890.000 CLP mensuales</strong>
                . Este valor incluye estrategia, gestión profesional de campañas en Facebook,
                Instagram y WhatsApp, diseño de creatividades, remarketing automatizado y reportería
                ejecutiva semanal. La inversión publicitaria en Meta se cotiza aparte según
                presupuesto del cliente.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Qué diferencia a Meta Ads de Google Ads?
              </h3>
              <p className="text-gray-700">
                <strong>Meta Ads</strong> funciona con targeting por intereses, comportamiento y
                demografía, ideal para productos visuales y branding. Es perfecto para alcanzar
                audiencias que aún no te conocen. <strong>Google Ads</strong> captura intención de
                búsqueda activa. Meta Ads <em>genera demanda</em>, Google Ads{' '}
                <em>captura demanda</em> existente. Lo óptimo es combinar ambos canales en una
                estrategia integrada.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿En cuánto tiempo veo resultados con Meta Ads?
              </h3>
              <p className="text-gray-700">
                Los primeros resultados se ven entre <strong>7-14 días</strong> de campaña activa. El
                algoritmo de Meta necesita fase de aprendizaje (50 conversiones por ad set).
                Resultados óptimos se alcanzan después de <strong>30-45 días</strong> de optimización
                continua. A diferencia de Google Ads, Meta Ads requiere más tiempo de maduración pero
                puede escalar significativamente.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Qué presupuesto publicitario necesito para Meta Ads Chile?
              </h3>
              <p className="text-gray-700">
                Recomendamos mínimo <strong>$500.000 CLP mensuales</strong> en inversión publicitaria
                para Meta Ads. Este presupuesto permite salir de la fase de aprendizaje y generar
                suficientes conversiones para optimización. Para campañas de awareness o branding, se
                puede partir con menos. Para ecommerce y performance,{' '}
                <strong>$1.000.000+</strong> es ideal para escalar rápidamente.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Puedo usar WhatsApp Business con Meta Ads?
              </h3>
              <p className="text-gray-700">
                Sí, integramos <strong>WhatsApp Business</strong> como canal de conversión en todas
                nuestras campañas Meta Ads. Configuramos botones de WhatsApp en anuncios, respuestas
                automáticas 24/7, y flujos de conversación para calificación de leads. WhatsApp tiene
                tasas de respuesta <strong>3-5x superiores</strong> a formularios tradicionales en
                Chile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-r from-pink-900 to-purple-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Escalar con Meta Ads?</h2>
          <p className="text-xl text-pink-100 mb-8">
            Solicita una auditoría gratuita de tu presencia en Meta. Te mostramos oportunidades
            concretas para aumentar conversiones y reducir costos.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-4 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
          >
            Solicitar Auditoría Gratuita
          </Link>
        </div>
      </section>
    </div>
  )
}
