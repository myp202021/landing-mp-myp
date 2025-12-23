/**
 * Servicio: Facebook Ads Chile
 * Página SEO optimizada para keywords de Facebook Ads en Chile
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Agencia Facebook Ads Chile | Publicidad Facebook Santiago',
  description: 'Agencia especializada en Facebook Ads Chile. Campañas de alto impacto en Facebook e Instagram con targeting preciso, remarketing automatizado y conversión comprobada en Santiago y todo Chile.',
  keywords: [
    'agencia facebook ads chile',
    'publicidad facebook chile',
    'facebook ads santiago',
    'campañas facebook chile',
    'agencia facebook ads santiago',
    'publicidad facebook instagram',
    'facebook ads chile precio',
    'especialista facebook ads chile'
  ],
  path: '/servicios/facebook-ads-chile'
})

export default function FacebookAdsChilePage() {
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
                name: 'Facebook Ads Chile',
                item: 'https://www.mulleryperez.cl/servicios/facebook-ads-chile'
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
            serviceType: 'Facebook Ads Chile - Publicidad en Facebook e Instagram',
            provider: {
              '@type': 'Organization',
              name: 'Muller y Pérez',
              url: 'https://www.mulleryperez.cl'
            },
            areaServed: [
              {
                '@type': 'City',
                name: 'Santiago',
                '@id': 'https://www.wikidata.org/wiki/Q2887'
              },
              {
                '@type': 'Country',
                name: 'Chile'
              }
            ],
            description:
              'Agencia especializada en Facebook Ads Chile. Campañas profesionales en Facebook e Instagram con targeting avanzado, remarketing automatizado, integración con Meta Business Suite y resultados medibles.',
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

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Muller y Pérez - Agencia Facebook Ads Chile',
            description:
              'Agencia especializada en publicidad Facebook Chile con oficinas en Santiago. Expertos en campañas Facebook Ads para B2C y B2B.',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Santiago',
              addressCountry: 'CL'
            },
            areaServed: 'Chile',
            serviceType: 'Facebook Ads Management',
            url: 'https://www.mulleryperez.cl/servicios/facebook-ads-chile'
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
                name: '¿Cuánto cuesta contratar una agencia Facebook Ads en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'El servicio de gestión Facebook Ads Chile comienza desde $890.000 CLP mensuales. Este valor incluye estrategia completa, gestión profesional de campañas en Facebook e Instagram, diseño de creatividades, remarketing automatizado, integración con Meta Business Suite y reportería ejecutiva semanal. La inversión publicitaria en Facebook se cotiza aparte según presupuesto y objetivos del cliente.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué tipos de campañas Facebook Ads funcionan mejor en Chile?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'En Chile, las campañas de Conversión (Lead Generation y Ventas) tienen mejor ROI, especialmente con integración WhatsApp. Las campañas de Tráfico funcionan bien para ecommerce. Para branding, Alcance y Reconocimiento de Marca son efectivas. El Video View es ideal para productos que requieren demostración. La clave es el remarketing: recuperar carritos abandonados y usuarios que visitaron tu sitio.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Cómo funciona la integración de Facebook Ads con Instagram?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Facebook Ads e Instagram se gestionan desde Meta Business Suite. Una misma campaña puede publicarse en ambas plataformas simultáneamente. Instagram tiene mejores resultados para productos visuales, moda, belleza y lifestyle. Facebook funciona mejor para B2B, servicios profesionales y público +35 años. Recomendamos separar presupuestos por plataforma para optimización precisa y adaptar formatos: Stories para Instagram, Carruseles para Facebook.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué presupuesto publicitario necesito para Facebook Ads en Santiago?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Para Santiago y Región Metropolitana, recomendamos mínimo $400.000-$500.000 CLP mensuales en inversión publicitaria. Con este presupuesto alcanzas ~100.000-150.000 personas en tu público objetivo. Para campañas de conversión necesitas $800.000+ para salir de fase de aprendizaje (50 conversiones). En regiones el presupuesto puede ser menor por menor competencia. Para ecommerce con remarketing, $1.000.000+ es ideal.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Cuánto tiempo toma ver resultados con Facebook Ads?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Los primeros resultados (tráfico, engagement) se ven en 3-5 días. Para conversiones (leads, ventas), necesitas 7-14 días mientras el algoritmo aprende. Resultados óptimos se alcanzan después de 30-45 días cuando salimos de fase de aprendizaje y tenemos datos para optimizar. El pixel de Facebook necesita acumular conversiones para mejorar targeting. Paciencia en el primer mes es crítica para éxito a largo plazo.'
                }
              },
              {
                '@type': 'Question',
                name: '¿Qué es Meta Business Suite y por qué es importante?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Meta Business Suite es la plataforma unificada para gestionar Facebook, Instagram y WhatsApp Business. Permite programar contenido, responder mensajes, ver estadísticas y administrar anuncios desde un solo lugar. Es gratuita y esencial para profesionalizar tu presencia en Meta. Configuramos Meta Business Suite correctamente con Business Manager, Pixel de conversión, catálogos de productos y audiencias personalizadas para máximo rendimiento.'
                }
              }
            ]
          })
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur border border-blue-400/30 rounded-full mb-6">
              <span className="text-blue-200 font-semibold text-sm">
                Facebook Ads + Instagram Ads + Meta Business Suite
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Agencia Facebook Ads Chile
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Campañas de alto impacto en Facebook e Instagram para negocios en Santiago y todo
              Chile. Alcanza a tu audiencia ideal con targeting avanzado, remarketing automatizado y
              creatividades que generan conversiones reales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold shadow-lg text-center"
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

      {/* Estadísticas de Facebook en Chile */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 border-b border-blue-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">12M+</div>
              <div className="text-gray-700 font-semibold">Usuarios Facebook Chile</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">9M+</div>
              <div className="text-gray-700 font-semibold">Usuarios Instagram Chile</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">82%</div>
              <div className="text-gray-700 font-semibold">Penetración Internet</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2.5h</div>
              <div className="text-gray-700 font-semibold">Promedio diario en Meta</div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye el servicio */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Qué Incluye Nuestro Servicio de Facebook Ads Chile?
          </h2>
          <p className="text-gray-600 text-lg">
            Gestión profesional end-to-end de tus campañas publicitarias en Facebook e Instagram
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Estrategia & Targeting Avanzado
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Análisis de audiencia y buyer personas chilenos</li>
              <li>✓ Segmentación por intereses, comportamiento y demografía</li>
              <li>✓ Lookalike audiences basadas en tus clientes</li>
              <li>✓ Remarketing multi-etapa (visitantes, carrito, leads)</li>
              <li>✓ Geo-targeting preciso (Santiago, regiones, comunas)</li>
              <li>✓ A/B testing continuo de audiencias y mensajes</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Creatividades & Formatos
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Diseño de piezas visuales (imágenes + videos)</li>
              <li>✓ Copywriting persuasivo en español chileno</li>
              <li>✓ Stories, Reels, Carruseles, Collection Ads</li>
              <li>✓ Adaptación por plataforma (Facebook/Instagram)</li>
              <li>✓ Video marketing (15s, 30s, 60s)</li>
              <li>✓ Nuevas creatividades semanales (anti-fatiga)</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Optimización & Reporting
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Configuración de Meta Business Suite profesional</li>
              <li>✓ Instalación y configuración del Pixel de Facebook</li>
              <li>✓ Monitoreo diario de performance y ajustes</li>
              <li>✓ Optimización de CPM, CPC, CPL, CPA y ROAS</li>
              <li>✓ Reportería ejecutiva semanal y mensual</li>
              <li>✓ Acceso completo a tu Business Manager</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tipos de Campañas Facebook Ads */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tipos de Campañas Facebook Ads que Gestionamos
            </h2>
            <p className="text-gray-600 text-lg">
              Cada objetivo de negocio requiere un tipo de campaña específico
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Campañas de Conversión
              </h3>
              <p className="text-gray-700 mb-3 text-sm">
                Optimizadas para generar leads, ventas o acciones específicas en tu sitio web.
              </p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Lead Generation (formularios nativos)</li>
                <li>• Conversión en sitio web (compras, registros)</li>
                <li>• Mensajes (WhatsApp, Messenger, Instagram DM)</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-indigo-500">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Campañas de Tráfico</h3>
              <p className="text-gray-700 mb-3 text-sm">
                Envía visitantes calificados a tu sitio web, tienda online o landing page.
              </p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Tráfico al sitio web (ecommerce, blog)</li>
                <li>• Tráfico a apps (descargas, instalaciones)</li>
                <li>• Click-to-WhatsApp (conversación directa)</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500">
              <div className="text-3xl mb-3">📢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Campañas de Alcance
              </h3>
              <p className="text-gray-700 mb-3 text-sm">
                Maximiza el número de personas que ven tus anuncios en tu mercado objetivo.
              </p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Alcance masivo (lanzamientos, eventos)</li>
                <li>• Frequency capping (controlar impresiones)</li>
                <li>• Ideal para branding y awareness</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-pink-500">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Campañas de Engagement
              </h3>
              <p className="text-gray-700 mb-3 text-sm">
                Aumenta interacciones, comentarios, compartidos y reacciones en tus publicaciones.
              </p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Engagement en publicaciones</li>
                <li>• Me gusta en página de Facebook</li>
                <li>• Interacciones (comentarios, shares)</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-red-500">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Campañas de Video Views
              </h3>
              <p className="text-gray-700 mb-3 text-sm">
                Promociona videos para demostrar productos, educar o generar reconocimiento de marca.
              </p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• ThruPlay (video completo)</li>
                <li>• 2 segundos de visualización continua</li>
                <li>• Remarketing a usuarios que vieron video</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-orange-500">
              <div className="text-3xl mb-3">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Campañas de Catálogo
              </h3>
              <p className="text-gray-700 mb-3 text-sm">
                Dynamic Product Ads para mostrar productos automáticamente a usuarios interesados.
              </p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Anuncios dinámicos de productos</li>
                <li>• Catálogo sincronizado con ecommerce</li>
                <li>• Remarketing de productos vistos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Formatos de Anuncios */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Formatos de Anuncios Facebook e Instagram
          </h2>
          <p className="text-gray-600 text-lg">
            Utilizamos todos los formatos disponibles para maximizar resultados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📱</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Imagen y Video Simple
                </h3>
                <p className="text-gray-700 mb-4">
                  El formato más común y efectivo. Una imagen o video con texto, título y
                  llamado a la acción. Ideal para mensajes directos y ofertas específicas.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Imagen: 1080x1080px (cuadrado) o 1200x628px (horizontal)</li>
                  <li>✓ Video: 15-60 segundos, subtitulado en español</li>
                  <li>✓ Texto: máximo 125 caracteres para mejor rendimiento</li>
                  <li>✓ CTA claro: "Más información", "Comprar", "Contactar"</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎠</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Carrusel</h3>
                <p className="text-gray-700 mb-4">
                  Hasta 10 imágenes o videos desplazables, cada uno con su propio enlace. Perfecto
                  para mostrar múltiples productos, características o pasos de un proceso.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ 2-10 tarjetas por anuncio</li>
                  <li>✓ Cada tarjeta puede tener URL diferente</li>
                  <li>✓ Ideal para ecommerce y catálogos</li>
                  <li>✓ Formato: 1080x1080px por tarjeta</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📖</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Collection</h3>
                <p className="text-gray-700 mb-4">
                  Experiencia inmersiva mobile-first. Imagen o video principal + grid de productos
                  debajo. El usuario explora sin salir de Facebook/Instagram.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Imagen/video hero + 4-9 productos</li>
                  <li>✓ Experiencia de compra dentro de Facebook</li>
                  <li>✓ Requiere catálogo de productos configurado</li>
                  <li>✓ Ideal para fashion, beauty, retail</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-8 border border-pink-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📲</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Stories & Reels
                </h3>
                <p className="text-gray-700 mb-4">
                  Formato vertical inmersivo para Stories (24h) y Reels (permanente). Alto engagement
                  en audiencias jóvenes. Video corto, dinámico y auténtico.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ 9:16 vertical (1080x1920px)</li>
                  <li>✓ 15-30 segundos de duración</li>
                  <li>✓ Sin bordes negros, video a pantalla completa</li>
                  <li>✓ CTA integrado (Swipe Up, botones)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integración Instagram y Meta Business Suite */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Integración Facebook + Instagram + Meta Business Suite
            </h2>
            <p className="text-gray-600 text-lg">
              Gestión unificada de todo tu ecosistema Meta desde una sola plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Facebook + Instagram: Mejor Juntos
              </h3>
              <p className="text-gray-700 mb-4">
                Una misma campaña puede publicarse simultáneamente en Facebook e Instagram. El
                algoritmo de Meta optimiza automáticamente hacia la plataforma que mejor
                desempeño tiene para tu objetivo.
              </p>
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Cuándo usar Facebook vs Instagram?
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>
                    <strong>Facebook:</strong> B2B, servicios profesionales, público +35 años,
                    contenido educativo, artículos de blog
                  </li>
                  <li>
                    <strong>Instagram:</strong> B2C, productos visuales, moda, belleza,
                    gastronomía, lifestyle, público 18-34 años
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 text-sm">
                Nuestra recomendación: testear ambas plataformas simultáneamente durante 2-3 semanas,
                luego optimizar presupuesto hacia la que mejor convierte para tu negocio específico.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Meta Business Suite</h3>
              <p className="text-gray-700 mb-4">
                La plataforma unificada de Meta para gestionar Facebook, Instagram y WhatsApp Business
                desde un solo dashboard. Configuramos todo correctamente para máximo rendimiento.
              </p>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    Business Manager
                  </h4>
                  <p className="text-gray-700 text-xs">
                    Configuración profesional de cuentas publicitarias, píxeles, catálogos y
                    permisos de equipo
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    Bandeja Unificada
                  </h4>
                  <p className="text-gray-700 text-xs">
                    Responde mensajes de Facebook, Instagram y WhatsApp desde un solo lugar
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    Insights Integrados
                  </h4>
                  <p className="text-gray-700 text-xs">
                    Estadísticas unificadas de rendimiento orgánico y pagado en todas las
                    plataformas
                  </p>
                </div>
                <div className="bg-pink-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    Programación de Contenido
                  </h4>
                  <p className="text-gray-700 text-xs">
                    Programa publicaciones orgánicas en Facebook e Instagram con calendario visual
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Configuración Técnica Incluida
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-semibold mb-2">Pixel de Facebook</h4>
                <p className="text-blue-100 text-sm">
                  Instalación y configuración del Pixel de conversión en tu sitio web. Tracking de
                  eventos: PageView, AddToCart, Purchase, Lead, CompleteRegistration
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Audiencias Personalizadas</h4>
                <p className="text-blue-100 text-sm">
                  Creación de Custom Audiences (visitantes web, clientes, leads) y Lookalike
                  Audiences (clones de tus mejores clientes)
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">🏪</div>
                <h4 className="font-semibold mb-2">Catálogo de Productos</h4>
                <p className="text-blue-100 text-sm">
                  Sincronización de catálogo para Dynamic Product Ads. Compatible con Shopify,
                  WooCommerce, Magento y feeds personalizados
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audiencias Segmentadas */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Targeting & Audiencias en Facebook Ads
          </h2>
          <p className="text-gray-600 text-lg">
            La clave del éxito: llegar exactamente a quien necesita tu producto o servicio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Targeting Demográfico
            </h3>
            <p className="text-gray-700 mb-3 text-sm">
              Segmentación básica pero poderosa por características de tu cliente ideal.
            </p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• <strong>Ubicación:</strong> Santiago, regiones, comunas específicas, radio km</li>
              <li>• <strong>Edad:</strong> rangos de 18-65+ años</li>
              <li>• <strong>Género:</strong> hombres, mujeres, todos</li>
              <li>• <strong>Idioma:</strong> español (Chile)</li>
              <li>• <strong>Estado civil:</strong> solteros, casados, padres</li>
              <li>• <strong>Educación:</strong> secundaria, universitaria, postgrado</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Targeting por Intereses
            </h3>
            <p className="text-gray-700 mb-3 text-sm">
              Alcanza personas según sus gustos, hobbies y comportamiento en Facebook.
            </p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• <strong>Deportes:</strong> running, ciclismo, yoga, fitness</li>
              <li>• <strong>Tecnología:</strong> smartphones, gaming, software</li>
              <li>• <strong>Moda & Belleza:</strong> cosmética, ropa, accesorios</li>
              <li>• <strong>Gastronomía:</strong> restaurantes, cocina, vino</li>
              <li>• <strong>Viajes:</strong> viajeros frecuentes, turismo</li>
              <li>• <strong>Negocios:</strong> emprendimiento, marketing, ventas</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="text-3xl mb-3">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Targeting por Comportamiento
            </h3>
            <p className="text-gray-700 mb-3 text-sm">
              Segmenta por acciones reales que las personas realizan online y offline.
            </p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• <strong>Compradores online:</strong> ecommerce, Amazon, retail</li>
              <li>• <strong>Viajeros:</strong> vuelos, hoteles, viajes frecuentes</li>
              <li>• <strong>Dispositivo:</strong> iPhone, Android, tablet</li>
              <li>• <strong>Eventos:</strong> cumpleaños, aniversarios próximos</li>
              <li>• <strong>Job Role:</strong> CEO, gerentes, profesionales</li>
              <li>• <strong>Small Business Owners:</strong> emprendedores</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Audiencias Avanzadas (Custom & Lookalike)
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔄</span> Custom Audiences (Remarketing)
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  <strong>Visitantes del sitio web:</strong> últimos 30/60/90/180 días, páginas
                  específicas, tiempo de permanencia
                </li>
                <li>
                  <strong>Engagement en Facebook/Instagram:</strong> usuarios que vieron video,
                  interactuaron con post, visitaron perfil
                </li>
                <li>
                  <strong>Lista de clientes:</strong> upload de emails, teléfonos, IDs de CRM
                </li>
                <li>
                  <strong>Carrito abandonado:</strong> visitaron página producto/checkout pero no
                  compraron
                </li>
                <li>
                  <strong>Leads:</strong> personas que llenaron formulario pero no convirtieron
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">👥</span> Lookalike Audiences (Clones)
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  <strong>Lookalike de compradores:</strong> encuentra personas similares a tus
                  mejores clientes
                </li>
                <li>
                  <strong>Lookalike de leads:</strong> expande audiencia de prospectos calificados
                </li>
                <li>
                  <strong>Lookalike de alto LTV:</strong> clientes de mayor valor lifetime
                </li>
                <li>
                  <strong>% de similitud:</strong> 1% (muy similar) a 10% (más amplio)
                </li>
                <li>
                  <strong>País específico:</strong> Lookalike solo para Chile o regiones
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso B2C y B2B */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Facebook Ads para B2C y B2B en Chile
            </h2>
            <p className="text-gray-600 text-lg">
              Estrategias diferenciadas según tu modelo de negocio
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Facebook Ads para B2C (Consumidor Final)
              </h3>
              <p className="text-gray-700 mb-4">
                Ideal para productos y servicios dirigidos directamente al consumidor final. Alto
                volumen de conversiones con ciclo de venta corto.
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Industrias B2C que Funcionan
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Ecommerce (ropa, electrónica, hogar)</li>
                    <li>• Restaurantes y delivery de comida</li>
                    <li>• Gimnasios y centros deportivos</li>
                    <li>• Clínicas de estética y belleza</li>
                    <li>• Educación online y cursos</li>
                    <li>• Turismo y agencias de viaje</li>
                    <li>• Inmobiliarias (departamentos, casas)</li>
                    <li>• Automotriz (concesionarias, repuestos)</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Estrategia B2C</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>✓ Campañas de Conversión con Pixel optimizado</li>
                    <li>✓ Dynamic Product Ads (carritos abandonados)</li>
                    <li>✓ Video de productos y testimonials</li>
                    <li>✓ Ofertas y descuentos (urgencia + escasez)</li>
                    <li>✓ Instagram Shopping integrado</li>
                    <li>✓ Influencer partnerships y UGC</li>
                    <li>✓ Click-to-WhatsApp para consultas rápidas</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Métricas Clave B2C</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>ROAS:</strong> 3-5x mínimo (por cada $1 invertido, $3-5 retorno)</li>
                    <li>• <strong>CPA:</strong> costo por adquisición de cliente</li>
                    <li>• <strong>AOV:</strong> valor promedio del pedido</li>
                    <li>• <strong>CTR:</strong> 2-4% en campañas performantes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Facebook Ads para B2B (Empresas)
              </h3>
              <p className="text-gray-700 mb-4">
                Generación de leads calificados para empresas que venden a otras empresas. Ciclo de
                venta más largo pero ticket promedio más alto.
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Industrias B2B que Funcionan
                  </h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Software y SaaS (CRM, ERP, herramientas)</li>
                    <li>• Servicios profesionales (consultoría, legal)</li>
                    <li>• Agencias de marketing y publicidad</li>
                    <li>• Distribuidores mayoristas</li>
                    <li>• Capacitación empresarial</li>
                    <li>• Servicios financieros y seguros</li>
                    <li>• Proveedores industriales</li>
                    <li>• Tecnología y telecomunicaciones</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Estrategia B2B</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>✓ Lead Generation con formularios nativos</li>
                    <li>✓ Targeting por Job Title y Company Size</li>
                    <li>✓ Contenido educativo (whitepapers, webinars)</li>
                    <li>✓ Case studies y testimonios de clientes</li>
                    <li>✓ LinkedIn + Facebook Ads combinados</li>
                    <li>✓ Nurturing multi-touch con remarketing</li>
                    <li>✓ Integración con CRM (HubSpot, Salesforce)</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Métricas Clave B2B</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>CPL:</strong> $5.000-$15.000 CLP por lead calificado</li>
                    <li>• <strong>MQL → SQL:</strong> tasa de calificación de leads</li>
                    <li>• <strong>CAC:</strong> costo de adquisición de cliente</li>
                    <li>• <strong>LTV:</strong> valor lifetime del cliente B2B</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Funnel de Conversión en Facebook Ads
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl mb-2">👁️</div>
                <h4 className="font-semibold mb-2">1. Awareness</h4>
                <p className="text-blue-100 text-sm">
                  Alcance, Video Views, Brand Awareness
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">🤔</div>
                <h4 className="font-semibold mb-2">2. Consideración</h4>
                <p className="text-blue-100 text-sm">
                  Tráfico, Engagement, Lead Generation
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">🛒</div>
                <h4 className="font-semibold mb-2">3. Conversión</h4>
                <p className="text-blue-100 text-sm">
                  Ventas, Leads, Mensajes, Registros
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">🔄</div>
                <h4 className="font-semibold mb-2">4. Retención</h4>
                <p className="text-blue-100 text-sm">
                  Remarketing, Cross-sell, Upsell
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro proceso */}
      <section className="container mx-auto px-6 max-w-6xl py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Cómo Trabajamos en Facebook Ads?
          </h2>
          <p className="text-gray-600 text-lg">
            Proceso estructurado para maximizar performance desde día 1
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Auditoría & Diagnóstico (Semana 1)
                </h3>
                <p className="text-gray-700">
                  Analizamos tu industria, competencia en Chile, público objetivo y campañas previas
                  de Facebook Ads (si existen). Revisamos tu sitio web, instalamos Pixel de Facebook
                  correctamente, configuramos eventos de conversión (Lead, Purchase, AddToCart) y
                  definimos KPIs críticos según tu negocio (CPL, CPA, ROAS, LTV).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-500">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Estrategia & Setup (Semana 2)
                </h3>
                <p className="text-gray-700">
                  Diseñamos estructura de campañas (Awareness, Consideración, Conversión,
                  Remarketing), creamos audiencias segmentadas y desarrollamos primeras creatividades.
                  Configuramos Meta Business Suite profesionalmente con Business Manager, cuenta
                  publicitaria, píxel y catálogo de productos (si aplica). Escribimos copy persuasivo
                  en español chileno. Test inicial con 3-5 variantes de audiencia y 2-3 formatos de
                  anuncio.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Fase de Aprendizaje (Semanas 3-4)
                </h3>
                <p className="text-gray-700">
                  El algoritmo de Facebook aprende qué audiencias, mensajes y formatos funcionan mejor
                  para tu negocio. Durante esta fase crítica, necesitamos ~50 conversiones por ad set
                  para salir de aprendizaje y que el algoritmo optimice automáticamente. Optimizamos
                  diariamente: pausamos audiencias/creatividades de bajo rendimiento, escalamos lo que
                  funciona. Es normal ver CPL/CPA más alto en esta fase.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 border-l-4 border-pink-500">
            <div className="flex items-start gap-4">
              <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Optimización Continua (Mes 2+)
                </h3>
                <p className="text-gray-700">
                  Con datos sólidos (1000+ impresiones, 50+ conversiones), escalamos presupuesto en
                  audiencias ganadoras gradualmente (+20% cada 3-4 días). Lanzamos nuevas
                  creatividades semanalmente para evitar fatiga publicitaria (cuando el CTR baja 50%,
                  cambiamos creatividad). Implementamos remarketing avanzado multi-etapa (visitantes
                  web, carrito abandonado, leads no convertidos) y expandimos a Lookalike Audiences 1%
                  de tus mejores clientes. A/B testing continuo de audiencias, copy, formato y CTA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué nos diferencia */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegirnos como Tu Agencia Facebook Ads en Chile?
            </h2>
            <p className="text-gray-600 text-lg">
              No somos otra agencia más que promete likes y alcance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Transparencia Total
              </h3>
              <p className="text-gray-700">
                Acceso completo a tu Business Manager de Facebook. Las cuentas publicitarias son
                tuyas, nosotros solo las administramos. Reportes ejecutivos semanales con métricas
                reales: impresiones, clics, CPM, CPC, CPL, CPA, ROAS. Sin datos inflados ni vanity
                metrics.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Creatividades In-House
              </h3>
              <p className="text-gray-700">
                Diseñador gráfico y editor de video dedicado en tu equipo. No subcontratamos
                creatividades a freelancers. Nuevas piezas cada semana para evitar fatiga
                publicitaria. Sabemos qué formatos, colores y mensajes funcionan en el público
                chileno.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Enfoque en Performance
              </h3>
              <p className="text-gray-700">
                No vendemos likes, comentarios ni alcance. Te decimos exactamente cuánto cuesta
                conseguir un cliente nuevo (CPA) y cuánto retorno generas por cada peso invertido
                (ROAS). Optimizamos para conversiones reales que impactan tu bottom line. ROI
                positivo o no cobramos fee de gestión.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🇨🇱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Experiencia Local
              </h3>
              <p className="text-gray-700">
                +5 años gestionando campañas Facebook Ads específicamente en Chile. Conocemos el
                mercado local, comportamiento del consumidor chileno, estacionalidad (Cyber,
                Navidad, Dieciochocho) y regulaciones publicitarias. Copy en español chileno, no
                traducciones genéricas.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Optimización Diaria
              </h3>
              <p className="text-gray-700">
                Revisamos tus campañas todos los días, no solo cuando el reporte mensual. Ajustamos
                presupuestos, pausamos ad sets de bajo rendimiento, lanzamos nuevos tests. El
                algoritmo de Facebook cambia constantemente; nosotros nos adaptamos en tiempo real.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Integración Total
              </h3>
              <p className="text-gray-700">
                Integramos Facebook Ads con tu stack completo: Google Analytics 4, CRM (HubSpot,
                Salesforce), ecommerce (Shopify, WooCommerce), WhatsApp Business, email marketing.
                Visión 360° del customer journey desde primer clic hasta venta recurrente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-12 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-6">📱</div>
            <h2 className="text-3xl font-bold mb-4">Inversión: Desde $890.000/mes</h2>
            <p className="text-xl text-blue-100 mb-8">
              Incluye estrategia completa, gestión profesional de campañas Facebook e Instagram,
              diseño de creatividades, remarketing automatizado, integración Meta Business Suite y
              reportería ejecutiva. Presupuesto publicitario en Facebook se cotiza aparte según tu
              industria y objetivos.
            </p>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">¿Qué Incluye el Servicio?</h3>
              <ul className="text-left space-y-2 text-blue-100">
                <li>✓ Estrategia de Facebook Ads personalizada para Chile</li>
                <li>✓ Configuración de Meta Business Suite y Business Manager</li>
                <li>✓ Instalación y configuración del Pixel de Facebook</li>
                <li>✓ Creación de audiencias segmentadas (Custom + Lookalike)</li>
                <li>✓ Diseño de creatividades (imágenes, videos, carruseles)</li>
                <li>✓ Copywriting en español chileno orientado a conversión</li>
                <li>✓ Remarketing multi-etapa automatizado</li>
                <li>✓ Integración Facebook + Instagram + WhatsApp</li>
                <li>✓ Configuración de catálogo para Dynamic Product Ads</li>
                <li>✓ Reportería ejecutiva semanal y mensual con métricas reales</li>
                <li>✓ Optimización diaria de campañas y presupuestos</li>
                <li>✓ Equipo dedicado de 3 profesionales especializados</li>
              </ul>
            </div>

            <div className="bg-blue-900/50 backdrop-blur border border-blue-400/30 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-3">Presupuesto Publicitario Recomendado</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold mb-1">Inicial</div>
                  <div className="text-2xl font-bold mb-1">$500K</div>
                  <div className="text-blue-200 text-xs">Test y validación</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold mb-1">Óptimo</div>
                  <div className="text-2xl font-bold mb-1">$1M-$2M</div>
                  <div className="text-blue-200 text-xs">Escalamiento efectivo</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold mb-1">Agresivo</div>
                  <div className="text-2xl font-bold mb-1">$3M+</div>
                  <div className="text-blue-200 text-xs">Dominio de mercado</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold shadow-lg"
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
            Preguntas Frecuentes sobre Facebook Ads Chile
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Cuánto cuesta contratar una agencia Facebook Ads en Chile?
              </h3>
              <p className="text-gray-700">
                El servicio de gestión Facebook Ads Chile comienza desde{' '}
                <strong>$890.000 CLP mensuales</strong>. Este valor incluye estrategia completa,
                gestión profesional de campañas en Facebook e Instagram, diseño de creatividades,
                remarketing automatizado, integración con Meta Business Suite y reportería ejecutiva
                semanal. La inversión publicitaria en Facebook (ad spend) se cotiza aparte según
                presupuesto y objetivos del cliente. Recomendamos mínimo $500.000 CLP mensuales de ad
                spend para resultados óptimos.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Qué tipos de campañas Facebook Ads funcionan mejor en Chile?
              </h3>
              <p className="text-gray-700 mb-3">
                En Chile, las <strong>campañas de Conversión</strong> (Lead Generation y Ventas)
                tienen mejor ROI, especialmente con integración WhatsApp. Las{' '}
                <strong>campañas de Tráfico</strong> funcionan bien para ecommerce con remarketing
                implementado. Para branding, <strong>Alcance y Reconocimiento de Marca</strong> son
                efectivas. El <strong>Video View</strong> es ideal para productos que requieren
                demostración.
              </p>
              <p className="text-gray-700">
                La clave del éxito es el <strong>remarketing</strong>: recuperar carritos abandonados
                y usuarios que visitaron tu sitio. El 97% de los usuarios no compran en primera
                visita; remarketing puede recuperar hasta 30% de esas ventas perdidas.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Cómo funciona la integración de Facebook Ads con Instagram?
              </h3>
              <p className="text-gray-700 mb-3">
                Facebook Ads e Instagram se gestionan desde <strong>Meta Business Suite</strong>. Una
                misma campaña puede publicarse en ambas plataformas simultáneamente, y el algoritmo
                de Meta optimiza automáticamente hacia la plataforma que mejor convierte.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Instagram</strong> tiene mejores resultados para productos visuales, moda,
                belleza y lifestyle. Audiencia principalmente 18-34 años.{' '}
                <strong>Facebook</strong> funciona mejor para B2B, servicios profesionales y público
                +35 años.
              </p>
              <p className="text-gray-700">
                Nuestra recomendación: separar presupuestos por plataforma para optimización precisa.
                Adaptar formatos: <strong>Stories y Reels</strong> para Instagram,{' '}
                <strong>Carruseles y Videos largos</strong> para Facebook.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Qué presupuesto publicitario necesito para Facebook Ads en Santiago?
              </h3>
              <p className="text-gray-700 mb-3">
                Para Santiago y Región Metropolitana, recomendamos mínimo{' '}
                <strong>$400.000-$500.000 CLP mensuales</strong> en inversión publicitaria. Con este
                presupuesto alcanzas aproximadamente 100.000-150.000 personas en tu público objetivo,
                generando 2.000-3.000 clics al sitio web.
              </p>
              <p className="text-gray-700 mb-3">
                Para <strong>campañas de conversión</strong> (leads, ventas), necesitas{' '}
                <strong>$800.000+</strong> para salir de fase de aprendizaje del algoritmo (50
                conversiones mínimo). En regiones el presupuesto puede ser 30-40% menor por menor
                competencia y CPM más bajo.
              </p>
              <p className="text-gray-700">
                Para <strong>ecommerce con remarketing</strong>, $1.000.000+ es ideal. Esto permite
                presupuesto para prospección (60%) + remarketing (40%), la combinación óptima para
                maximizar ROAS.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Cuánto tiempo toma ver resultados con Facebook Ads?
              </h3>
              <p className="text-gray-700 mb-3">
                Los primeros resultados (tráfico, engagement) se ven en <strong>3-5 días</strong> de
                campaña activa. Para conversiones (leads, ventas), necesitas <strong>7-14 días</strong>{' '}
                mientras el algoritmo de Facebook aprende qué audiencias y creatividades funcionan
                mejor.
              </p>
              <p className="text-gray-700 mb-3">
                Resultados óptimos se alcanzan después de <strong>30-45 días</strong> cuando salimos
                de fase de aprendizaje y tenemos suficientes datos para optimizar. El Pixel de
                Facebook necesita acumular conversiones (~50 por ad set) para mejorar el targeting
                automáticamente.
              </p>
              <p className="text-gray-700">
                <strong>Paciencia en el primer mes es crítica.</strong> Muchos clientes cancelan
                prematuramente sin darle tiempo al algoritmo de madurar. El verdadero ROI se ve en
                mes 2-3 cuando todo está optimizado y escalamos presupuesto en audiencias ganadoras.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Qué es Meta Business Suite y por qué es importante?
              </h3>
              <p className="text-gray-700 mb-3">
                <strong>Meta Business Suite</strong> es la plataforma unificada gratuita para
                gestionar Facebook, Instagram y WhatsApp Business desde un solo lugar. Permite
                programar contenido, responder mensajes de todas las plataformas, ver estadísticas
                unificadas y administrar anuncios.
              </p>
              <p className="text-gray-700 mb-3">
                Es esencial para profesionalizar tu presencia en Meta. Incluye herramientas como:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">
                <li>
                  <strong>Business Manager:</strong> gestión de cuentas publicitarias, píxeles y
                  permisos de equipo
                </li>
                <li>
                  <strong>Bandeja unificada:</strong> todos los mensajes de Facebook, Instagram y
                  WhatsApp en un inbox
                </li>
                <li>
                  <strong>Insights:</strong> estadísticas de rendimiento orgánico y pagado
                  integradas
                </li>
                <li>
                  <strong>Programación:</strong> calendario visual para planificar contenido
                </li>
              </ul>
              <p className="text-gray-700">
                Configuramos Meta Business Suite correctamente con Business Manager, Pixel de
                conversión, catálogos de productos y audiencias personalizadas para máximo
                rendimiento de tus campañas Facebook Ads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Escalar Tu Negocio con Facebook Ads?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Solicita una auditoría gratuita de tu presencia en Facebook e Instagram. Te mostramos
            oportunidades concretas para aumentar conversiones, reducir costos y maximizar ROAS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
            >
              Solicitar Auditoría Gratuita
            </Link>
            <Link
              href="/servicios/meta-ads-chile"
              className="inline-block px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold text-lg"
            >
              Ver Meta Ads (Facebook + Instagram + WhatsApp)
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
