/**
 * Servicio: Instagram Ads Chile
 * Página SEO optimizada para keywords de Instagram Ads en Chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Agencia Instagram Ads Chile | Publicidad Instagram & Marketing Instagram',
  description: 'Agencia especializada en Instagram Ads Chile. Campañas de alto impacto en Stories, Reels y Feed. Targeting preciso, contenido visual que convierte y resultados medibles desde $590.000/mes.',
  keywords: [
    'agencia instagram ads chile',
    'instagram ads chile',
    'publicidad instagram chile',
    'instagram marketing chile',
    'agencia instagram ads',
    'publicidad instagram ads',
    'marketing instagram chile',
    'instagram ads santiago',
    'agencia publicidad instagram',
    'instagram ads para empresas',
    'instagram ads para negocios',
    'instagram stories ads chile',
    'instagram reels ads chile',
    'campañas instagram chile',
    'gestión instagram ads',
    'anuncios instagram chile',
    'agencia instagram marketing'
  ],
  path: '/servicios/instagram-ads-chile'
})

export default function InstagramAdsChilePage() {
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
                name: 'Instagram Ads Chile',
                item: 'https://www.mulleryperez.cl/servicios/instagram-ads-chile'
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
            serviceType: 'Instagram Ads Chile - Publicidad y Marketing en Instagram',
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
              'Agencia especializada en Instagram Ads Chile. Campañas profesionales en Stories, Reels y Feed con contenido visual de alto impacto, targeting preciso por intereses y comportamiento, y optimización continua para conversión.',
            offers: {
              '@type': 'Offer',
              price: '590000',
              priceCurrency: 'CLP',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '590000',
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
                name: '¿Cuánto cuesta contratar una agencia Instagram Ads en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'El servicio de Instagram Ads Chile comienza desde $590.000 CLP mensuales. Este valor incluye estrategia de contenido visual, diseño de creatividades para Stories, Reels y Feed, gestión profesional de campañas, segmentación avanzada, optimización diaria y reportería ejecutiva semanal. La inversión publicitaria en Instagram se cotiza aparte según presupuesto y objetivos del cliente.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué formatos de anuncios funcionan mejor en Instagram Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Los formatos más efectivos en Instagram Chile son: 1) Stories (pantalla completa, alto engagement, ideal para promociones), 2) Reels (video corto vertical, máximo alcance orgánico + paid, audiencias jóvenes 18-34), 3) Feed Posts (imagen o video cuadrado, branding, productos visuales), 4) Carousel (múltiples imágenes, ideal para ecommerce y storytelling). Reels tiene el mejor ROI actualmente con CPM 30-40% más bajo que Stories.'
                }
              },
              {
                '@type': 'Question',
                name: '¿En cuánto tiempo veo resultados con Instagram Ads?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Los primeros resultados en Instagram Ads se ven entre 5-10 días de campaña activa. Instagram requiere fase de aprendizaje más corta que Facebook (30-40 conversiones por ad set vs 50 de Facebook). Resultados óptimos se alcanzan después de 21-30 días de optimización. Instagram genera engagement más rápido pero conversión puede tomar más tiempo dependiendo del funnel.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué tipo de negocios funcionan mejor con Instagram Ads en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Instagram Ads es ideal para: 1) Ecommerce de productos visuales (moda, belleza, decoración, alimentos), 2) Servicios para millennials y Gen Z (fitness, wellness, educación online), 3) Restaurantes y gastronomía (visual, geolocalización), 4) Turismo y hotelería (inspiracional, visual), 5) Bienes raíces (tours virtuales, lifestyle). Si tu producto se explica mejor con imagen/video que con texto, Instagram es tu canal.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Cuál es la diferencia entre Instagram Ads y Facebook Ads?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Aunque ambos usan Meta Ads Manager, hay diferencias clave: 1) Audiencia: Instagram es más joven (18-34 años 70% vs Facebook 35+ años 60%), 2) Contenido: Instagram requiere alta calidad visual, Facebook acepta más texto, 3) Engagement: Instagram tiene 2-3x más interacción orgánica, 4) Formatos: Instagram prioriza Stories/Reels vertical, Facebook prefiere landscape, 5) CPM: Instagram es 15-25% más caro pero mayor engagement. Lo ideal es combinar ambos en una estrategia Meta Ads integrada.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué presupuesto publicitario necesito para Instagram Ads Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Recomendamos mínimo $400.000 CLP mensuales en inversión publicitaria para Instagram Ads en Chile. Este presupuesto permite salir de fase de aprendizaje (~30 conversiones) y generar datos suficientes para optimización. Para campañas de awareness o engagement, se puede partir con $300.000. Para ecommerce y conversión directa, $600.000-800.000+ es ideal. CPM promedio en Chile: $3.500-5.500, CPC: $150-350.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Puedo conectar Instagram Shopping con mis anuncios?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sí, integramos Instagram Shopping en todas nuestras campañas de ecommerce. Configuramos tu catálogo de productos, creamos Collection Ads que permiten compra directa desde Instagram, y optimizamos Dynamic Product Ads (remarketing de productos vistos). Instagram Shopping reduce fricción en el funnel: el usuario ve producto en ad, hace tap, y compra sin salir de Instagram. Tasas de conversión 40-60% superiores a anuncios tradicionales.'
                }
              }
            ]
          })
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-full mb-6">
              <span className="text-white font-semibold text-sm">
                Stories • Reels • Feed • Shopping
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Agencia Instagram Ads Chile
            </h1>

            <p className="text-xl text-pink-50 mb-8 leading-relaxed">
              Campañas profesionales de alto impacto visual en Instagram. Genera ventas con Stories,
              Reels y Feed optimizados para conversión. Targeting preciso, contenido que conecta y
              resultados medibles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white text-pink-600 rounded-lg hover:bg-pink-50 transition font-semibold shadow-lg text-center"
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

      {/* Formatos de Instagram Ads */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Formatos de Instagram Ads que Dominamos
          </h2>
          <p className="text-gray-600 text-lg">
            Cada formato tiene su propósito. Nosotros sabemos cuándo usar cada uno.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instagram Stories Ads</h3>
            <p className="text-gray-700 text-sm mb-4">
              Pantalla completa vertical. Alto engagement. Ideal para promociones urgentes, lanzamientos
              y awareness.
            </p>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• Duración: 15 seg max por story</li>
              <li>• Formato: 9:16 vertical</li>
              <li>• CTA: Swipe up, botones</li>
              <li>• Mejor para: Urgencia, promo</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6 border border-pink-200">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instagram Reels Ads</h3>
            <p className="text-gray-700 text-sm mb-4">
              Video corto vertical. Máximo alcance. El formato con mejor ROI en 2025. Audiencia joven 18-34
              años.
            </p>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• Duración: 15-90 segundos</li>
              <li>• Formato: 9:16 vertical video</li>
              <li>• CPM: 30-40% más bajo</li>
              <li>• Mejor para: Alcance, viral</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instagram Feed Ads</h3>
            <p className="text-gray-700 text-sm mb-4">
              Imagen o video en el feed. Formato clásico. Ideal para branding, productos visuales y
              storytelling.
            </p>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• Formato: 1:1 cuadrado o 4:5</li>
              <li>• Imagen o video hasta 60 seg</li>
              <li>• Mayor tiempo de atención</li>
              <li>• Mejor para: Branding, producto</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl p-6 border border-yellow-200">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instagram Shopping Ads</h3>
            <p className="text-gray-700 text-sm mb-4">
              Catálogo de productos. Compra directa en Instagram. Ideal para ecommerce. Menos fricción,
              más conversión.
            </p>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• Catálogo integrado</li>
              <li>• Collection & Carousel Ads</li>
              <li>• Dynamic Product Ads</li>
              <li>• Mejor para: Ecommerce, retail</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Por qué Instagram Ads funciona */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Instagram Ads es el Canal Más Visual?
            </h2>
            <p className="text-gray-600 text-lg">
              Si tu producto se vende con una imagen, Instagram es tu plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                +8 Millones de Usuarios en Chile
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>75% de los chilenos con internet</strong> usa Instagram activamente. Es la red
                social #1 para audiencias 18-44 años. Alcanza a tu público donde pasa 53 minutos diarios.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• 70% de usuarios tienen entre 18-34 años</li>
                <li>• 51% son mujeres, 49% hombres (equilibrado)</li>
                <li>• 63% revisa Instagram varias veces al día</li>
                <li>• 81% usa Instagram para descubrir productos</li>
                <li>• 44% compra semanal basándose en Instagram</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Plataforma 100% Visual
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>El contenido visual convierte 40x mejor</strong> que texto plano. Instagram está
                diseñado para productos que se venden con imagen: moda, gastronomía, decoración, belleza.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Engagement 2-3x superior a Facebook</li>
                <li>• Formatos inmersivos: Stories, Reels, IGTV</li>
                <li>• Shopping integrado: catalogo nativo</li>
                <li>• Instagram prioriza contenido visual de calidad</li>
                <li>• Usuarios buscan inspiración, no solo información</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Segmentación por Intereses y Estilo de Vida
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>Targeting psicográfico avanzado.</strong> Alcanza usuarios por intereses, hobbies,
                comportamiento de compra y estilo de vida. No solo demografía.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Intereses: fitness, moda, food, travel, tech</li>
                <li>• Comportamientos: compradores online, viajeros</li>
                <li>• Lookalike de seguidores de competencia</li>
                <li>• Remarketing de visitantes web y engagement</li>
                <li>• Geolocalización precisa (radio de 1km+)</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Engagement Alto = Conversión Rápida
              </h3>
              <p className="text-gray-700 mb-4">
                <strong>Usuarios altamente comprometidos.</strong> Instagram genera interacción orgánica +
                paid más alta que cualquier plataforma. Más engagement = más confianza = más ventas.
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Tasa de engagement 4.7% (vs 0.08% Facebook)</li>
                <li>• Stories: 1 de cada 3 más vistos es un anuncio</li>
                <li>• Reels: alcance orgánico + paid combinado</li>
                <li>• Comentarios, shares, saves = señales sociales</li>
                <li>• UGC (User Generated Content) impulsa credibilidad</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye el servicio */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Qué Incluye Nuestro Servicio de Instagram Ads?
          </h2>
          <p className="text-gray-600 text-lg">
            Gestión end-to-end de tus campañas en Instagram con foco en contenido visual de calidad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Contenido Visual de Alto Impacto
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Diseño de piezas para Stories, Reels y Feed</li>
              <li>✓ Edición de video (hasta 60 seg por pieza)</li>
              <li>✓ Motion graphics y animaciones</li>
              <li>✓ Copywriting persuasivo y hashtags estratégicos</li>
              <li>✓ Testing A/B de creatividades semanalmente</li>
              <li>✓ Adaptación de formatos por objetivo (awareness, conversion)</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6 border border-pink-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Estrategia & Segmentación Avanzada
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Análisis de audiencia Instagram específica</li>
              <li>✓ Segmentación por intereses, comportamiento y estilo de vida</li>
              <li>✓ Lookalike de seguidores de competencia</li>
              <li>✓ Remarketing de engagement (likes, saves, comentarios)</li>
              <li>✓ Audiencias de visitantes web y carrito abandonado</li>
              <li>✓ Testing de públicos fríos vs cálidos</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Optimización & Reportes Ejecutivos
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Monitoreo diario de performance (CPM, CPC, CPL, CPA)</li>
              <li>✓ Optimización de creatividades (pausa de fatiga publicitaria)</li>
              <li>✓ Ajuste de presupuesto por rendimiento de ad set</li>
              <li>✓ Reportería ejecutiva semanal con insights accionables</li>
              <li>✓ Dashboard en tiempo real (Looker Studio)</li>
              <li>✓ Reuniones de estrategia mensuales</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Casos de uso por industria */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Para Qué Tipo de Negocios Funciona Instagram Ads?
            </h2>
            <p className="text-gray-600 text-lg">
              Si tu producto se explica mejor con una imagen que con texto, Instagram es tu canal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">👗</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Moda & Retail</h3>
              <p className="text-gray-700 text-sm">
                Catalogo visual, Instagram Shopping, Dynamic Product Ads. Lookbooks en Carousel. Stories
                para lanzamientos. Influencer partnerships.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">💄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belleza & Cosmética</h3>
              <p className="text-gray-700 text-sm">
                Tutoriales en Reels, antes/después en Stories. UGC (contenido de clientes). Reviews y
                testimonios visuales. Influencer marketing integrado.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🍔</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gastronomía & Food</h3>
              <p className="text-gray-700 text-sm">
                Food photography, video de platos. Geolocalización para restaurantes. Promociones en
                Stories. Menú highlights. Delivery integrado con DM.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Decoración & Hogar</h3>
              <p className="text-gray-700 text-sm">
                Inspiración visual, ambientación. Carousel de productos en contexto. Antes/después de
                espacios. Shopping tags en posts. Colaboraciones con arquitectos.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">✈️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Turismo & Hotelería</h3>
              <p className="text-gray-700 text-sm">
                Destinos inspiracionales. Stories de experiencias. Reels de tours. UGC de huéspedes.
                Geolocalización. Booking directo via DM o link en bio.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">💪</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fitness & Wellness</h3>
              <p className="text-gray-700 text-sm">
                Transformaciones físicas, rutinas de ejercicio en Reels. Testimoniales. Clases en vivo
                promocionadas. Planes nutricionales. Comunidad engaged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro proceso */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Cómo Trabajamos en Instagram Ads?
          </h2>
          <p className="text-gray-600 text-lg">
            Proceso estructurado enfocado en contenido visual de calidad y performance
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Auditoría Visual & Competencia (Semana 1)
                </h3>
                <p className="text-gray-700">
                  Analizamos tu feed actual, calidad de contenido, estética de marca y competencia en
                  Instagram. Identificamos qué tipo de contenido funciona en tu industria (Reels vs
                  Stories vs Feed). Definimos paleta de colores, estilo visual y tono de comunicación.
                  Instalamos Pixel de Meta y eventos de conversión.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-6 border-l-4 border-pink-500">
            <div className="flex items-start gap-4">
              <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Producción de Contenido & Setup (Semana 2)
                </h3>
                <p className="text-gray-700">
                  Creamos primeras creatividades: 8-12 piezas visuales (Stories, Reels, Feed) con
                  diferentes ángulos y mensajes. Escribimos copy persuasivo específico para Instagram
                  (corto, directo, con emojis estratégicos). Configuramos estructura de campañas y
                  audiencias en Meta Ads Manager. Lanzamos test inicial con 3-5 formatos diferentes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border-l-4 border-orange-500">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Testing & Aprendizaje (Semanas 3-4)
                </h3>
                <p className="text-gray-700">
                  Fase de aprendizaje del algoritmo: necesitamos ~30-40 conversiones por ad set en
                  Instagram (menos que Facebook). Probamos diferentes formatos (Stories vs Reels),
                  audiencias (frías vs cálidas) y mensajes. Identificamos qué creatividades tienen mejor
                  CTR y cuáles convierten. Pausamos lo que no funciona, duplicamos ganadoras.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl p-6 border-l-4 border-yellow-500">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Escala & Optimización Continua (Mes 2+)
                </h3>
                <p className="text-gray-700">
                  Escalamos presupuesto en audiencias y creatividades ganadoras (+20% semanal sin salir
                  de aprendizaje). Producimos contenido nuevo semanalmente (evitar fatiga publicitaria:
                  frecuencia mayor a 2.5 = refresh creativo). Implementamos remarketing avanzado de
                  engagement (usuarios que vieron video 75%+, guardaron post). Expandimos a Lookalikes y
                  nuevos intereses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciadores */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Somos la Mejor Agencia Instagram Ads Chile?
            </h2>
            <p className="text-gray-600 text-lg">
              Contenido visual de calidad + estrategia de performance = resultados reales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Diseño & Video In-House
              </h3>
              <p className="text-gray-700">
                Equipo creativo interno especializado en Instagram. Diseñador + Editor de video dedicados.
                No subcontratamos. Producción semanal de contenido. Sabemos qué formatos, colores y estilos
                funcionan en Chile.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Data-Driven Creativity
              </h3>
              <p className="text-gray-700">
                No hacemos "arte por el arte". Cada creatividad se diseña basándose en data: qué colores
                tienen mejor CTR, qué duración de Reels convierte más, qué copy genera engagement. Belleza
                + performance.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Especialización Instagram
              </h3>
              <p className="text-gray-700">
                No somos generalistas. Instagram requiere expertise específica: conocimiento de algoritmo
                de Reels, timing de Stories, formato de Shopping Ads. Gestionamos +$80M anuales solo en
                Instagram Ads.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Refresh Creativo Constante
              </h3>
              <p className="text-gray-700">
                Instagram penaliza fatiga publicitaria más rápido que Facebook. Producimos mínimo 4-6
                creatividades nuevas por semana. Testing constante de formatos (vertical vs cuadrado,
                video vs imagen estática).
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instagram Shopping Expert
              </h3>
              <p className="text-gray-700">
                Configuramos catálogos, Collection Ads, Dynamic Product Ads. Integramos Shopify, WooCommerce,
                VTEX. Sabemos cómo reducir fricción entre "ver producto" y "comprar" en Instagram.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Transparencia Total
              </h3>
              <p className="text-gray-700">
                Acceso completo a tu cuenta de Ads Manager. Reportes semanales con métricas reales: CPM,
                CPC, CPL, CPA, ROAS. Te mostramos qué funciona y qué no. Sin vanity metrics (likes no
                pagan cuentas).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estrategias Avanzadas */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Estrategias Avanzadas de Instagram Ads
          </h2>
          <p className="text-gray-600 text-lg">
            Tácticas que usamos para maximizar resultados y reducir costos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Remarketing Multi-Capa
            </h3>
            <p className="text-gray-700 mb-4">
              No todos los usuarios están listos para comprar en la primera visita. Implementamos secuencias
              de remarketing basadas en nivel de engagement:
            </p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>
                • <strong>Capa 1:</strong> Usuarios que vieron 75%+ de video en Reel (alta intención)
              </li>
              <li>
                • <strong>Capa 2:</strong> Usuarios que guardaron post o enviaron a un amigo
              </li>
              <li>
                • <strong>Capa 3:</strong> Visitantes web que no convirtieron (pixel tracking)
              </li>
              <li>
                • <strong>Capa 4:</strong> Carrito abandonado (urgencia + incentivo)
              </li>
              <li>
                • <strong>Capa 5:</strong> Post-compra (upsell, cross-sell, reactivación)
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6 border border-pink-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Lookalike Stacking
            </h3>
            <p className="text-gray-700 mb-4">
              Escalamos audiencias frías usando lookalikes inteligentes basados en tus mejores clientes:
            </p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>
                • <strong>LAL 1%:</strong> Audiencia más parecida a compradores (CPL bajo, volumen
                limitado)
              </li>
              <li>
                • <strong>LAL 2-3%:</strong> Balance entre precisión y escala (sweet spot)
              </li>
              <li>
                • <strong>LAL 4-6%:</strong> Mayor volumen, CPL más alto (awareness)
              </li>
              <li>
                • <strong>Seguidores competencia:</strong> Lookalike de quienes siguen a tu competencia
              </li>
              <li>
                • <strong>Engagement LAL:</strong> Usuarios similares a quienes interactúan con tu
                contenido
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Creative Testing Framework
            </h3>
            <p className="text-gray-700 mb-4">
              Probamos sistemáticamente variables creativas para identificar qué mueve la aguja:
            </p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>
                • <strong>Hook (3 primeros seg):</strong> Pregunta vs estadística vs problema vs beneficio
              </li>
              <li>
                • <strong>Formato:</strong> Stories vertical vs Reels vs Feed cuadrado vs Carousel
              </li>
              <li>
                • <strong>Duración video:</strong> 6-10 seg vs 15-20 seg vs 30-45 seg
              </li>
              <li>
                • <strong>CTA:</strong> Texto en pantalla vs voz vs botón vs swipe up
              </li>
              <li>
                • <strong>Estilo visual:</strong> UGC (orgánico) vs producido vs animado
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Optimización de Presupuesto por Objetivo
            </h3>
            <p className="text-gray-700 mb-4">
              Diferentes objetivos requieren diferentes estrategias de budget allocation:
            </p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>
                • <strong>Awareness:</strong> 70% Reels (CPM bajo), 30% Stories (impacto)
              </li>
              <li>
                • <strong>Engagement:</strong> 60% Reels orgánico + boost, 40% Feed posts
              </li>
              <li>
                • <strong>Tráfico web:</strong> 50% Stories con swipe up, 50% Feed con link en bio
              </li>
              <li>
                • <strong>Conversión:</strong> 40% Remarketing, 40% Lookalikes, 20% testing
              </li>
              <li>
                • <strong>Ecommerce:</strong> 50% Dynamic Ads, 30% Collection, 20% prospección
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Métricas que importan */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Métricas que Realmente Importan en Instagram Ads
            </h2>
            <p className="text-gray-600 text-lg">
              No medimos likes. Medimos retorno sobre inversión.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ROAS (Return on Ad Spend)</h3>
              <p className="text-gray-700 text-sm mb-2">
                Por cada $1 invertido en Instagram, cuántos $ generas en ventas.
              </p>
              <p className="text-purple-600 font-bold">Objetivo: 3-5x mínimo</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CPL (Costo por Lead)</h3>
              <p className="text-gray-700 text-sm mb-2">
                Cuánto cuesta conseguir un lead calificado (formulario, DM, WhatsApp).
              </p>
              <p className="text-purple-600 font-bold">Promedio Chile: $2.500-8.000</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CPA (Costo por Adquisición)</h3>
              <p className="text-gray-700 text-sm mb-2">
                Cuánto cuesta conseguir un cliente nuevo que paga.
              </p>
              <p className="text-purple-600 font-bold">Debe ser menor a LTV</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CTR (Click-Through Rate)</h3>
              <p className="text-gray-700 text-sm mb-2">
                % de personas que hacen clic después de ver tu anuncio.
              </p>
              <p className="text-purple-600 font-bold">Objetivo: 1.5-3%+</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">👁️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CPM (Costo por 1000 impresiones)</h3>
              <p className="text-gray-700 text-sm mb-2">
                Cuánto pagas por mostrar tu anuncio 1000 veces.
              </p>
              <p className="text-purple-600 font-bold">Chile: $3.500-5.500</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Engagement Rate</h3>
              <p className="text-gray-700 text-sm mb-2">
                % de interacción (likes, comentarios, shares, saves) sobre impresiones.
              </p>
              <p className="text-purple-600 font-bold">Benchmark: 2-5%</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Completion Rate</h3>
              <p className="text-gray-700 text-sm mb-2">
                % de usuarios que ven tu video completo (crítico para Reels).
              </p>
              <p className="text-purple-600 font-bold">Objetivo: 25-40%+</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Frecuencia</h3>
              <p className="text-gray-700 text-sm mb-2">
                Veces promedio que un usuario ve tu anuncio. Frecuencia alta = fatiga.
              </p>
              <p className="text-purple-600 font-bold">Ideal: 1.5-2.5</p>
            </div>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-12 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-6">📱</div>
            <h2 className="text-3xl font-bold mb-4">Inversión: Desde $590.000/mes</h2>
            <p className="text-xl text-pink-50 mb-8">
              Incluye estrategia de contenido visual, producción de creatividades (Stories, Reels, Feed),
              gestión de campañas, segmentación avanzada, optimización diaria y reportería ejecutiva.
              Presupuesto publicitario en Instagram se cotiza aparte.
            </p>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">¿Qué Incluye?</h3>
              <ul className="text-left space-y-2 text-pink-50">
                <li>✓ Estrategia de contenido visual Instagram-first</li>
                <li>✓ Producción semanal de 8-12 creatividades (Stories, Reels, Feed)</li>
                <li>✓ Edición de video profesional (hasta 60 seg por pieza)</li>
                <li>✓ Copywriting persuasivo y hashtags estratégicos</li>
                <li>✓ Segmentación avanzada por intereses y comportamiento</li>
                <li>✓ Configuración de Instagram Shopping (si aplica)</li>
                <li>✓ Remarketing multi-etapa automatizado</li>
                <li>✓ Testing A/B de formatos, audiencias y mensajes</li>
                <li>✓ Optimización diaria (CPM, CPC, CPL, CPA, ROAS)</li>
                <li>✓ Reportería ejecutiva semanal con insights accionables</li>
                <li>✓ Dashboard en tiempo real (Looker Studio)</li>
                <li>✓ Equipo dedicado: Estratega + Diseñador + Editor Video</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-3">Presupuesto Publicitario Recomendado</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-1">Starter</p>
                  <p className="text-2xl font-bold mb-1">$400K</p>
                  <p className="text-pink-100">Awareness, engagement</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Growth</p>
                  <p className="text-2xl font-bold mb-1">$600K</p>
                  <p className="text-pink-100">Generación de leads</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Scale</p>
                  <p className="text-2xl font-bold mb-1">$1M+</p>
                  <p className="text-pink-100">Ecommerce, conversión</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white text-pink-600 rounded-lg hover:bg-pink-50 transition font-semibold shadow-lg"
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
            Preguntas Frecuentes sobre Instagram Ads Chile
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Cuánto cuesta contratar una agencia Instagram Ads en Chile?
              </h3>
              <p className="text-gray-700">
                El servicio de Instagram Ads Chile comienza desde <strong>$590.000 CLP mensuales</strong>.
                Este valor incluye estrategia de contenido visual, diseño de creatividades para Stories,
                Reels y Feed, gestión profesional de campañas, segmentación avanzada, optimización diaria y
                reportería ejecutiva semanal. La inversión publicitaria en Instagram se cotiza aparte según
                presupuesto y objetivos del cliente.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Qué formatos de anuncios funcionan mejor en Instagram Chile?
              </h3>
              <p className="text-gray-700">
                Los formatos más efectivos en Instagram Chile son: <strong>1) Stories</strong> (pantalla
                completa, alto engagement, ideal para promociones urgentes), <strong>2) Reels</strong>{' '}
                (video corto vertical, máximo alcance orgánico + paid, audiencias jóvenes 18-34),{' '}
                <strong>3) Feed Posts</strong> (imagen o video cuadrado, branding, productos visuales),{' '}
                <strong>4) Carousel</strong> (múltiples imágenes, ideal para ecommerce y storytelling). Reels
                tiene el mejor ROI actualmente con CPM 30-40% más bajo que Stories.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿En cuánto tiempo veo resultados con Instagram Ads?
              </h3>
              <p className="text-gray-700">
                Los primeros resultados en Instagram Ads se ven entre <strong>5-10 días</strong> de campaña
                activa. Instagram requiere fase de aprendizaje más corta que Facebook (30-40 conversiones por
                ad set vs 50 de Facebook). Resultados óptimos se alcanzan después de{' '}
                <strong>21-30 días</strong> de optimización. Instagram genera engagement más rápido pero
                conversión puede tomar más tiempo dependiendo del funnel.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Qué tipo de negocios funcionan mejor con Instagram Ads en Chile?
              </h3>
              <p className="text-gray-700">
                Instagram Ads es ideal para: <strong>1) Ecommerce</strong> de productos visuales (moda,
                belleza, decoración, alimentos), <strong>2) Servicios</strong> para millennials y Gen Z
                (fitness, wellness, educación online), <strong>3) Restaurantes y gastronomía</strong>{' '}
                (visual, geolocalización), <strong>4) Turismo y hotelería</strong> (inspiracional, visual),{' '}
                <strong>5) Bienes raíces</strong> (tours virtuales, lifestyle). Si tu producto se explica
                mejor con imagen/video que con texto, Instagram es tu canal.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Cuál es la diferencia entre Instagram Ads y Facebook Ads?
              </h3>
              <p className="text-gray-700">
                Aunque ambos usan Meta Ads Manager, hay diferencias clave:{' '}
                <strong>1) Audiencia:</strong> Instagram es más joven (18-34 años 70% vs Facebook 35+ años
                60%), <strong>2) Contenido:</strong> Instagram requiere alta calidad visual, Facebook acepta
                más texto, <strong>3) Engagement:</strong> Instagram tiene 2-3x más interacción orgánica,{' '}
                <strong>4) Formatos:</strong> Instagram prioriza Stories/Reels vertical, Facebook prefiere
                landscape, <strong>5) CPM:</strong> Instagram es 15-25% más caro pero mayor engagement. Lo
                ideal es combinar ambos en una estrategia Meta Ads integrada.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Qué presupuesto publicitario necesito para Instagram Ads Chile?
              </h3>
              <p className="text-gray-700">
                Recomendamos mínimo <strong>$400.000 CLP mensuales</strong> en inversión publicitaria para
                Instagram Ads en Chile. Este presupuesto permite salir de fase de aprendizaje (~30
                conversiones) y generar datos suficientes para optimización. Para campañas de awareness o
                engagement, se puede partir con $300.000. Para ecommerce y conversión directa,{' '}
                <strong>$600.000-800.000+</strong> es ideal. CPM promedio en Chile: $3.500-5.500, CPC:
                $150-350.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Puedo conectar Instagram Shopping con mis anuncios?
              </h3>
              <p className="text-gray-700">
                Sí, integramos <strong>Instagram Shopping</strong> en todas nuestras campañas de ecommerce.
                Configuramos tu catálogo de productos, creamos Collection Ads que permiten compra directa
                desde Instagram, y optimizamos Dynamic Product Ads (remarketing de productos vistos).
                Instagram Shopping reduce fricción en el funnel: el usuario ve producto en ad, hace tap, y
                compra sin salir de Instagram. Tasas de conversión{' '}
                <strong>40-60% superiores</strong> a anuncios tradicionales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Dominar Instagram?</h2>
          <p className="text-xl text-pink-50 mb-8">
            Solicita una auditoría gratuita de tu cuenta de Instagram. Te mostramos oportunidades
            concretas para aumentar alcance, engagement y conversiones con Instagram Ads.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-4 bg-white text-pink-600 rounded-lg hover:bg-pink-50 transition font-semibold text-lg shadow-lg"
          >
            Solicitar Auditoría Gratuita
          </Link>
        </div>
      </section>
    </div>
  )
}
