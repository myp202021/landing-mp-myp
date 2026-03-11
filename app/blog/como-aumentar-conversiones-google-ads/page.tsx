import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, CheckCircle, AlertTriangle, Zap, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cómo Aumentar Conversiones en Google Ads en 30 Días (Guía 2025-2026)',
  description: 'Estrategias probadas para aumentar conversiones en Google Ads: optimización de Quality Score, ajuste de pujas, extensiones y mejora de landing pages. Casos reales Chile.',
  keywords: 'aumentar conversiones google ads, mejorar conversiones sem, optimizar google ads, quality score, conversion rate optimization',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/como-aumentar-conversiones-google-ads'
  },
  openGraph: {
    title: 'Cómo Aumentar Conversiones en Google Ads en 30 Días (Guía 2025-2026)',
    description: 'Estrategias probadas para aumentar conversiones: Quality Score, pujas, extensiones y landing pages.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/como-aumentar-conversiones-google-ads',
    publishedTime: '2025-10-08T18:00:00Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cómo Aumentar Conversiones en Google Ads en 30 Días (Guía 2025-2026)',
    description: 'Estrategias probadas para aumentar conversiones en Google Ads: optimización de Quality Score, ajuste de pujas, extensiones y mejora de landing pages. Casos reales Chile.',
    url: 'https://www.mulleryperez.cl/blog/como-aumentar-conversiones-google-ads',
    datePublished: '2025-10-08T18:00:00Z',
    dateModified: '2026-03-10T00:00:00.000Z',
    author: {
      '@type': 'Person',
      name: 'Christopher Müller',
      url: 'https://www.mulleryperez.cl/equipo/christopher-muller',
      sameAs: [
        'https://www.linkedin.com/in/christophermullerm/',
        'https://www.mulleryperez.cl'
      ],
      jobTitle: 'CEO & Founder',
      worksFor: {
        '@type': 'Organization',
        name: 'Muller y Pérez',
        url: 'https://www.mulleryperez.cl'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mulleryperez.cl/logo-color.png'
      }
    },
    image: 'https://www.mulleryperez.cl/og-image.jpg',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/blog/como-aumentar-conversiones-google-ads'
    },
    articleSection: 'Marketing Digital',
    inLanguage: 'es-CL'
  }

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" /></Link>
          <Link href="/blog" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
        </div>
      </header>

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Google Ads</span>
            <p className="text-gray-500 mt-4">8 de octubre, 2025 · 15 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Cómo Aumentar Conversiones en Google Ads en 30 Días
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Tu campaña de Google Ads tiene clicks pero no convierte. Te mostramos las 8 estrategias que usamos en M&P para aumentar conversiones en promedio un 67% en 30 días, con casos reales de Chile 2025.
          </p>

          <div className="prose prose-lg max-w-none">
            {/* INTRO */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                📌 Lo que aprenderás en este artículo
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>Por qué tu campaña tiene clicks pero no convierte (diagnóstico rápido)</li>
                <li>8 estrategias para aumentar conversiones en 30 días</li>
                <li>Cómo optimizar Quality Score para pagar menos por click</li>
                <li>Landing pages que convierten: estructura y elementos clave</li>
                <li>Casos reales de Chile con resultados medibles</li>
              </ul>
            </div>

            {/* PROBLEMA */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                ❌ Síntomas de Campaña con Baja Conversión
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Muchos clicks, pocas conversiones:</strong> CTR alto pero CVR bajo</li>
                <li><strong>CPA altísimo:</strong> Pagas más de lo que ganas por cliente</li>
                <li><strong>Quality Score bajo (1-4):</strong> Google te cobra más por click</li>
                <li><strong>Bounce rate alto:</strong> Usuarios llegan y se van inmediatamente</li>
              </ul>
              <p className="mt-4 text-gray-700 font-semibold">
                💡 Si tienes 2 o más de estos síntomas, este artículo es para ti.
              </p>
            </div>

            {/* ESTRATEGIA 1 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              1. Optimiza Quality Score (Paga Menos por Click)
            </h2>

            <p className="text-gray-700 mb-6">
              Quality Score es la calificación que Google le da a tus anuncios (1-10). <strong>Un QS alto = pagas menos por click y apareces más arriba.</strong>
            </p>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Componentes del Quality Score</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-gray-900">1. CTR Esperado (40% del peso)</p>
                  <p className="text-gray-700">¿Tu anuncio es relevante? Google predice si la gente hará click.</p>
                  <p className="text-sm text-green-700 mt-2"><strong>✅ Cómo mejorarlo:</strong> Usa keywords exactas en el título del anuncio</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">2. Relevancia del Anuncio (30% del peso)</p>
                  <p className="text-gray-700">¿Tu anuncio responde la búsqueda del usuario?</p>
                  <p className="text-sm text-green-700 mt-2"><strong>✅ Cómo mejorarlo:</strong> Crea anuncios específicos por grupo de keywords</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">3. Experiencia en Landing Page (30% del peso)</p>
                  <p className="text-gray-700">¿Tu página carga rápido y es relevante?</p>
                  <p className="text-sm text-green-700 mt-2"><strong>✅ Cómo mejorarlo:</strong> Landing específica por keyword + carga {'<'} 2 seg</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl mb-8">
              <p className="text-lg font-bold text-gray-900 mb-2">📊 Caso Real Chile: E-commerce Moda</p>
              <p className="text-gray-700 mb-4">
                Cliente con QS promedio 4/10 → Aumentamos a 8/10 en 3 semanas
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Antes:</strong> CPC $850 | CVR 1.2% | CPA $70.800</li>
                <li>• <strong>Después:</strong> CPC $420 | CVR 3.8% | CPA $11.050</li>
                <li>• <strong>Resultado:</strong> CPA reducido en 84%, conversiones x3</li>
              </ul>
            </div>

            {/* ESTRATEGIA 2 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              2. Usa Extensiones de Anuncios (Aumenta CTR +20%)
            </h2>

            <p className="text-gray-700 mb-6">
              Las extensiones hacen que tu anuncio ocupe más espacio en Google = más visible = más clicks = más conversiones.
            </p>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Extensiones Obligatorias</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-gray-900">✅ Sitelinks (Enlaces de Sitio)</p>
                  <p className="text-gray-700 text-sm">Agrega 4-6 links adicionales a páginas específicas</p>
                  <p className="text-green-700 text-sm mt-1">Ejemplo: "Envío Gratis" | "Productos" | "Ofertas" | "Testimonios"</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">✅ Callouts (Textos Destacados)</p>
                  <p className="text-gray-700 text-sm">Resalta beneficios únicos</p>
                  <p className="text-green-700 text-sm mt-1">Ejemplo: "Garantía 30 días" | "Pago en cuotas" | "Stock inmediato"</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">✅ Structured Snippets (Fragmentos Estructurados)</p>
                  <p className="text-gray-700 text-sm">Muestra categorías o características</p>
                  <p className="text-green-700 text-sm mt-1">Ejemplo: Servicios: Instalación, Mantención, Soporte</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">✅ Call Extension (Extensión de Llamada)</p>
                  <p className="text-gray-700 text-sm">Agrega tu número de teléfono directo</p>
                  <p className="text-green-700 text-sm mt-1">Ejemplo: +56 9 9225 8137</p>
                </div>
              </div>
            </div>

            {/* ESTRATEGIA 3 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              3. Ajusta Pujas por Dispositivo y Horario
            </h2>

            <p className="text-gray-700 mb-6">
              No todos los horarios ni dispositivos convierten igual. <strong>Puja más donde conviertes mejor.</strong>
            </p>

            <div className="bg-white border-2 border-purple-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cómo Optimizar Pujas</h3>
              <div className="space-y-4 text-gray-700 text-sm">
                <p><strong>Paso 1:</strong> Ve a Campañas → Segmentos → Dispositivos</p>
                <p><strong>Paso 2:</strong> Identifica dispositivo con mejor CVR</p>
                <p><strong>Paso 3:</strong> Aumenta puja +20-50% en el mejor dispositivo</p>
                <p className="text-green-700 mt-4"><strong>Benchmark Chile 2025:</strong></p>
                <ul className="space-y-1 pl-4">
                  <li>• Mobile: CVR 2.1% promedio</li>
                  <li>• Desktop: CVR 3.8% promedio</li>
                  <li>• Tablet: CVR 2.9% promedio</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ajuste por Horario</h3>
              <p className="text-gray-700 mb-4 text-sm">
                Ve a Campañas → Cronograma de anuncios → Analiza conversiones por hora
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">Ejemplo: SaaS B2B Chile</p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• <strong>10:00-12:00:</strong> CVR 4.2% → Aumentar puja +40%</li>
                  <li>• <strong>15:00-18:00:</strong> CVR 3.8% → Aumentar puja +20%</li>
                  <li>• <strong>22:00-07:00:</strong> CVR 0.8% → Reducir puja -50% o pausar</li>
                </ul>
              </div>
            </div>

            {/* ESTRATEGIA 4 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              4. Optimiza tu Landing Page (CVR +150%)
            </h2>

            <p className="text-gray-700 mb-6">
              El 70% del problema de conversión NO está en Google Ads, está en tu landing page.
            </p>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Elementos Obligatorios de una Landing que Convierte</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold">1. Headline que coincida con el anuncio</p>
                    <p className="text-sm text-gray-600">Si anuncio dice "Envío Gratis", landing debe decir "Envío Gratis"</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold">2. Un solo CTA visible (botón grande)</p>
                    <p className="text-sm text-gray-600">No ofrezcas 5 opciones, solo 1 acción clara</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold">3. Velocidad {'<'} 2 segundos</p>
                    <p className="text-sm text-gray-600">Usa PageSpeed Insights. Si carga lento, pierdes 40% de visitantes</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold">4. Prueba social (testimonios, logos clientes)</p>
                    <p className="text-sm text-gray-600">3-5 testimonios con foto + nombre + empresa</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold">5. Mobile-first (70% del tráfico es móvil)</p>
                    <p className="text-sm text-gray-600">Botón grande, formulario corto, sin scroll infinito</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl mb-8">
              <p className="text-lg font-bold text-gray-900 mb-2">📊 Caso Real Chile: Servicios B2B</p>
              <p className="text-gray-700 mb-4">
                Rediseñamos landing page de formulario de contacto
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Antes:</strong> Formulario 8 campos | Velocidad 5.2seg | CVR 1.1%</li>
                <li>• <strong>Después:</strong> Formulario 3 campos | Velocidad 1.4seg | CVR 4.8%</li>
                <li>• <strong>Resultado:</strong> Conversiones aumentaron 336%</li>
              </ul>
            </div>

            {/* ESTRATEGIA 5 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              5. Implementa Remarketing (Convierte al 50% que se fue)
            </h2>

            <p className="text-gray-700 mb-6">
              El 97% de los visitantes se va sin convertir. El remarketing los trae de vuelta.
            </p>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Audiencias de Remarketing que Funcionan</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>1. Visitantes que vieron producto pero no compraron (últimos 30 días)</strong></p>
                <p className="text-sm text-gray-600 pl-4">Mensaje: "¿Olvidaste algo? 15% de descuento por hoy"</p>

                <p><strong>2. Usuarios que abandonaron carrito (últimos 7 días)</strong></p>
                <p className="text-sm text-gray-600 pl-4">Mensaje: "Tu carrito te espera + Envío gratis"</p>

                <p><strong>3. Visitantes de blog/contenido (últimos 90 días)</strong></p>
                <p className="text-sm text-gray-600 pl-4">Mensaje: "Demo gratuita de [producto]"</p>
              </div>
            </div>

            {/* ESTRATEGIA 6 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              6. Excluye Keywords Negativas (Ahorra 20-30% del presupuesto)
            </h2>

            <p className="text-gray-700 mb-6">
              Estás desperdiciando dinero en búsquedas irrelevantes. Las keywords negativas evitan que tu anuncio aparezca en búsquedas que NO convierten.
            </p>

            <div className="bg-white border-2 border-red-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Keywords Negativas Comunes en Chile</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-bold mb-2">Si vendes productos:</p>
                  <ul className="space-y-1">
                    <li>• "gratis"</li>
                    <li>• "download"</li>
                    <li>• "manual"</li>
                    <li>• "tutorial"</li>
                    <li>• "usado"</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">Si vendes servicios:</p>
                  <ul className="space-y-1">
                    <li>• "diy" (hazlo tú mismo)</li>
                    <li>• "curso"</li>
                    <li>• "gratis"</li>
                    <li>• "empleo"</li>
                    <li>• "trabajo"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ESTRATEGIA 7 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              7. Usa Match Types Correctamente
            </h2>

            <p className="text-gray-700 mb-6">
              Los tipos de concordancia determinan qué búsquedas activan tu anuncio.
            </p>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Recomendación 2025</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-bold text-green-700">✅ Concordancia de Frase (Phrase Match)</p>
                  <p className="text-sm">Keyword: "agencia marketing digital"</p>
                  <p className="text-sm text-gray-600">Aparece en: "mejor agencia marketing digital santiago"</p>
                  <p className="text-sm text-gray-600">NO aparece en: "agencia publicidad digital" (falta "marketing")</p>
                </div>
                <div>
                  <p className="font-bold text-yellow-700">⚠️ Concordancia Amplia (Broad Match)</p>
                  <p className="text-sm">Solo si tienes Smart Bidding + historial de conversiones</p>
                  <p className="text-sm text-gray-600">Google puede mostrar tu anuncio en búsquedas "relacionadas"</p>
                </div>
                <div>
                  <p className="font-bold text-red-700">❌ Concordancia Exacta (Exact Match) - Evitar en 2025</p>
                  <p className="text-sm">Ya no es tan "exacta" como antes, Google la amplió</p>
                </div>
              </div>
            </div>

            {/* ESTRATEGIA 8 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              8. Testea Anuncios Constantemente (A/B Testing)
            </h2>

            <p className="text-gray-700 mb-6">
              Nunca sabes qué copy va a funcionar mejor. Siempre ten al menos 2-3 anuncios activos por grupo.
            </p>

            <div className="bg-white border-2 border-purple-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Qué Testear</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Headlines:</strong> Beneficio vs Características vs Precio</li>
                <li><strong>CTAs:</strong> "Cotiza Gratis" vs "Ver Precios" vs "Hablar con Experto"</li>
                <li><strong>Tono:</strong> Urgencia ("Solo hoy") vs Autoridad ("Líderes desde 2015")</li>
                <li><strong>Estructura:</strong> Con precio vs Sin precio</li>
              </ul>
            </div>

            {/* CONCLUSIÓN */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Conclusión: De Clicks a Conversiones
            </h2>

            <p className="text-gray-700 mb-6">
              Aumentar conversiones en Google Ads no es magia, es método:
            </p>

            <ul className="space-y-2 text-gray-700 mb-8">
              <li>✅ <strong>Optimiza Quality Score</strong> para pagar menos por click</li>
              <li>✅ <strong>Usa todas las extensiones</strong> para ocupar más espacio</li>
              <li>✅ <strong>Ajusta pujas inteligentes</strong> por dispositivo y horario</li>
              <li>✅ <strong>Mejora tu landing page</strong> (ahí está el 70% del problema)</li>
              <li>✅ <strong>Implementa remarketing</strong> para recuperar visitantes</li>
            </ul>

            <p className="text-gray-700 mb-8">
              En M&P hemos aplicado estas estrategias en +150 campañas en Chile, aumentando conversiones en promedio un 67% en los primeros 30 días.
            </p>

            {/* CTA FINAL */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Tu campaña tiene clicks pero no convierte?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Hacemos una auditoría gratuita de tu cuenta de Google Ads y te mostramos exactamente dónde estás perdiendo dinero.
              </p>
              <Link
                href="https://wa.me/56992258137?text=Hola%2C%20quiero%20una%20auditor%C3%ADa%20de%20mi%20Google%20Ads"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Solicitar Auditoría Gratuita
              </Link>
              <p className="text-blue-100 text-sm mt-4">
                📊 Recibe un informe completo en 48 horas
              </p>
            </div>
          </div>
        </div>
      </article>


        {/* Related Posts */}
        <nav className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Artículos Relacionados</h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/ranking-agencias-marketing-digital-chile" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
              Ranking Agencias Marketing Digital Chile 2026 →
            </Link>
            <Link href="/mejores-agencias-performance-marketing-chile" className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
              Mejores Agencias Performance Marketing Chile →
            </Link>
            <Link href="/predictor" className="text-sm text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-lg">
              Predictor de Campañas →
            </Link>
            <Link href="/indicadores" className="text-sm text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-lg">
              Termómetro Marketing Digital Chile →
            </Link>
          </div>
        </nav>
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/"><img src="/logo-white.png" alt="Muller y Pérez" className="h-10 w-auto mx-auto mb-6" /></Link>
          <p className="text-gray-400">© 2025 Muller y Pérez. Marketing Digital Basado en Datos.</p>
        </div>
      </footer>
    </div>
  )
}
