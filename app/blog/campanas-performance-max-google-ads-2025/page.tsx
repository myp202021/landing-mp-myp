import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Zap, TrendingUp, Target, AlertCircle, CheckCircle, BarChart3, DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Campañas Performance Max: Guía Completa Chile 2025',
  description: 'Todo sobre Performance Max (PMax): cómo funcionan, cuándo usarlas, configuración paso a paso, casos de éxito Chile y errores comunes. Guía actualizada 2025.',
  keywords: 'performance max google ads, pmax chile, campañas pmax, performance max tutorial, google ads 2025',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/campanas-performance-max-google-ads-2025'
  },
  openGraph: {
    title: 'Campañas Performance Max: Guía Completa Chile 2025',
    description: 'Guía completa de Performance Max: configuración, estrategias y casos reales Chile.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/campanas-performance-max-google-ads-2025',
    publishedTime: '2025-10-08T19:00:00Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Campañas Performance Max: Guía Completa Chile 2025',
    description: 'Todo sobre Performance Max (PMax): cómo funcionan, cuándo usarlas, configuración paso a paso, casos de éxito Chile y errores comunes. Guía actualizada 2025.',
    url: 'https://www.mulleryperez.cl/blog/campanas-performance-max-google-ads-2025',
    datePublished: '2025-10-08T19:00:00Z',
    dateModified: '2025-10-08T19:00:00Z',
    author: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl'
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
      '@id': 'https://www.mulleryperez.cl/blog/campanas-performance-max-google-ads-2025'
    },
    articleSection: 'Marketing Digital',
    inLanguage: 'es-CL'
  }

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
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
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">Google Ads</span>
            <p className="text-gray-500 mt-4">8 de octubre, 2025 · 18 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Campañas Performance Max: Guía Completa Chile 2025
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Performance Max es el tipo de campaña más potente (y controversial) de Google Ads. Aprende cuándo usarla, cómo configurarla correctamente y los errores que debes evitar, con casos reales de Chile 2025.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-purple-600" />
                📌 Lo que aprenderás
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>Qué es Performance Max y cómo funciona realmente</li>
                <li>Cuándo SÍ usar PMax (y cuándo NO)</li>
                <li>Configuración paso a paso con Asset Groups</li>
                <li>Estrategias para maximizar resultados</li>
                <li>3 casos reales de Chile con ROAS comprobado</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-600" />
              ¿Qué es Performance Max?
            </h2>

            <p className="text-gray-700 mb-6">
              Performance Max (PMax) es el tipo de campaña automatizada de Google Ads que:
            </p>

            <ul className="space-y-2 text-gray-700 mb-8">
              <li>✅ Aparece en TODAS las redes de Google (Search, Display, YouTube, Gmail, Discover, Maps)</li>
              <li>✅ Usa Machine Learning para optimizar automáticamente</li>
              <li>✅ Requiere menos configuración manual que campañas tradicionales</li>
              <li>⚠️ Te da MENOS control sobre dónde aparecen tus anuncios</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <p className="text-gray-900 font-bold mb-2">💡 Analogía Simple:</p>
              <p className="text-gray-700">
                PMax es como contratar a un vendedor con IA que decide por ti dónde, cuándo y a quién mostrar tus anuncios.
                Tú solo le das el objetivo (ventas, leads) y él optimiza todo automáticamente.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              ¿Cuándo SÍ Usar Performance Max?
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">✅ Usa PMax Si:</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>1. Tienes historial de conversiones (mínimo 30 en 30 días)</strong>
                  <p className="text-sm text-gray-600 pl-6">Google necesita datos para entrenar su algoritmo</p>
                </li>
                <li>
                  <strong>2. Vendes productos físicos (E-commerce)</strong>
                  <p className="text-sm text-gray-600 pl-6">PMax funciona increíble con feed de productos</p>
                </li>
                <li>
                  <strong>3. Quieres escalar rápido sin micromanagement</strong>
                  <p className="text-sm text-gray-600 pl-6">Deja que Google optimice mientras tú te enfocas en estrategia</p>
                </li>
                <li>
                  <strong>4. Tienes presupuesto {'>'} $500.000/mes</strong>
                  <p className="text-sm text-gray-600 pl-6">PMax necesita volumen para optimizar bien</p>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-red-200 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">❌ NO Uses PMax Si:</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>1. Eres nuevo en Google Ads ({'<'} 3 meses)</strong>
                  <p className="text-sm text-gray-600 pl-6">Primero aprende con Search y Display tradicionales</p>
                </li>
                <li>
                  <strong>2. Vendes servicios B2B de alto ticket ({'>'} $5M)</strong>
                  <p className="text-sm text-gray-600 pl-6">Necesitas control total sobre el mensaje y audiencia</p>
                </li>
                <li>
                  <strong>3. Tu presupuesto es {'<'} $200.000/mes</strong>
                  <p className="text-sm text-gray-600 pl-6">No hay suficiente data para que el algoritmo aprenda</p>
                </li>
                <li>
                  <strong>4. Necesitas aparecer solo en búsquedas específicas</strong>
                  <p className="text-sm text-gray-600 pl-6">PMax va a expandir a Display, YouTube, etc. sin que lo controles</p>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Cómo Configurar Performance Max (Paso a Paso)
            </h2>

            <div className="bg-gray-100 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Paso 1: Objetivo y Conversión</h3>
              <ol className="space-y-2 text-gray-700 list-decimal pl-6">
                <li>Google Ads → Campañas → Nueva Campaña</li>
                <li>Selecciona objetivo: <strong>Ventas</strong> o <strong>Generación de Leads</strong></li>
                <li>Tipo de campaña: <strong>Performance Max</strong></li>
                <li>Configura conversión principal (la más valiosa)</li>
              </ol>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Paso 2: Presupuesto y Pujas</h3>
              <div className="space-y-4 text-gray-700">
                <p><strong>Presupuesto Diario:</strong></p>
                <ul className="pl-6 space-y-1 text-sm">
                  <li>• Fórmula: (CPA objetivo × 30 conversiones) / 30 días</li>
                  <li>• Ejemplo: ($15.000 × 30) / 30 = $15.000/día</li>
                </ul>
                <p><strong>Estrategia de Puja:</strong></p>
                <ul className="pl-6 space-y-1 text-sm">
                  <li>✅ <strong>Maximizar conversiones</strong> (sin CPA objetivo) si tienes {'<'} 3 meses de data</li>
                  <li>✅ <strong>CPA objetivo</strong> si tienes historial sólido</li>
                  <li>✅ <strong>ROAS objetivo</strong> si eres E-commerce con valores variables</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Paso 3: Asset Groups (Lo Más Importante)</h3>
              <p className="text-gray-700 mb-4">
                Los Asset Groups son conjuntos de creatividades (textos, imágenes, videos) que Google combina automáticamente.
              </p>
              <div className="space-y-3 text-gray-700 text-sm">
                <p><strong>Necesitas:</strong></p>
                <ul className="pl-6 space-y-1">
                  <li>• 15 Headlines (títulos) de máximo 30 caracteres</li>
                  <li>• 4 Long Headlines (títulos largos) de máximo 90 caracteres</li>
                  <li>• 5 Descriptions (descripciones) de máximo 90 caracteres</li>
                  <li>• 20 imágenes (JPG/PNG) en diferentes formatos (cuadrado, horizontal, vertical)</li>
                  <li>• 5 logos (cuadrado 1:1 y horizontal 4:1)</li>
                  <li>• 1-5 videos YouTube (opcional pero recomendado)</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                ⚠️ Error Común #1: Asset Groups Genéricos
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Mal:</strong> Crear 1 Asset Group con mensajes mixtos
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Bien:</strong> Crear 2-3 Asset Groups segmentados por producto/servicio
              </p>
              <p className="text-sm text-gray-600">
                Ejemplo E-commerce: Asset Group 1 (Ropa Mujer) + Asset Group 2 (Ropa Hombre) + Asset Group 3 (Accesorios)
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Casos Reales Chile 2025
            </h2>

            <div className="space-y-8 mb-12">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Caso 1: E-commerce Moda (+180% Ventas)</h3>
                <p className="text-gray-700 mb-4">
                  Cliente de ropa online con feed de 850 productos
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold text-gray-900 mb-2">Configuración:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• 3 Asset Groups (Mujer, Hombre, Accesorios)</li>
                    <li>• Feed de productos vinculado a Merchant Center</li>
                    <li>• ROAS objetivo: 4.5x</li>
                    <li>• Presupuesto: $25.000/día</li>
                  </ul>
                </div>
                <p className="text-gray-700 mb-2"><strong>Resultados (90 días):</strong></p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Ventas: +180%</li>
                  <li>• ROAS: 6.2x (vs objetivo 4.5x)</li>
                  <li>• CPA: Reducido 42%</li>
                  <li>• Red principal: YouTube (38% conversiones) + Search (35%)</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Caso 2: SaaS B2B (+95% Leads Calificados)</h3>
                <p className="text-gray-700 mb-4">
                  Software de gestión para PYMEs (Ticket $890.000/año)
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold text-gray-900 mb-2">Configuración:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• 2 Asset Groups (Demo Gratis + Caso de Éxito)</li>
                    <li>• Señales de audiencia: CEOs, Gerentes PYME Chile</li>
                    <li>• CPA objetivo: $45.000</li>
                    <li>• Presupuesto: $18.000/día</li>
                  </ul>
                </div>
                <p className="text-gray-700 mb-2"><strong>Resultados (60 días):</strong></p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Leads: +95%</li>
                  <li>• CPA: $38.500 (vs objetivo $45.000)</li>
                  <li>• Tasa de calificación: 68% (vs 52% en Search tradicional)</li>
                  <li>• Red principal: Discover (42%) + YouTube (28%)</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Caso 3: Servicios Locales (+220% Cotizaciones)</h3>
                <p className="text-gray-700 mb-4">
                  Empresa de remodelación y construcción Santiago
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold text-gray-900 mb-4">Configuración:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• 3 Asset Groups (Cocinas, Baños, Ampliaciones)</li>
                    <li>• Videos de proyectos reales (antes/después)</li>
                    <li>• Segmentación geográfica: Santiago + comunas específicas</li>
                    <li>• CPA objetivo: $12.000</li>
                    <li>• Presupuesto: $12.000/día</li>
                  </ul>
                </div>
                <p className="text-gray-700 mb-2"><strong>Resultados (45 días):</strong></p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Cotizaciones: +220%</li>
                  <li>• CPA: $9.800 (vs objetivo $12.000)</li>
                  <li>• Tasa de cierre: 28%</li>
                  <li>• Red principal: YouTube (48%) + Maps (22%)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              5 Estrategias Avanzadas PMax
            </h2>

            <div className="space-y-6 mb-12">
              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Usa Señales de Audiencia (Audience Signals)</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Aunque PMax es automático, puedes "sugerir" audiencias para que Google parta por ahí.
                </p>
                <p className="text-green-700 text-sm">
                  ✅ Agrega: Listas de remarketing + Audiencias similares + Customer Match
                </p>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Excluye Placements Malos</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Ve a "Insights and reports" → "Where ads showed" → Excluye apps/sitios con alto gasto y 0 conversiones
                </p>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Vincula Google Merchant Center (E-commerce)</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Si vendes productos, vincular tu feed hace que PMax muestre automáticamente tus productos en Shopping, YouTube, Discover.
                </p>
                <p className="text-green-700 text-sm">
                  ✅ Resultado: +40-60% más impresiones en redes de Google
                </p>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Testea Asset Groups Separados por Funnel</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Asset Group 1: Top of Funnel (awareness) con contenido educativo
                </p>
                <p className="text-gray-700 text-sm">
                  Asset Group 2: Bottom of Funnel (conversión) con oferta directa
                </p>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Dale Tiempo (Mínimo 6 Semanas)</h3>
                <p className="text-gray-700 text-sm">
                  PMax necesita 2-3 semanas para aprender y 4-6 semanas para optimizar bien. No lo juzgues antes.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Conclusión: ¿Vale la Pena Performance Max?
            </h2>

            <p className="text-gray-700 mb-6">
              <strong>Sí, si tienes:</strong>
            </p>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li>✅ Historial de conversiones (30+ en 30 días)</li>
              <li>✅ Presupuesto {'>'} $500.000/mes</li>
              <li>✅ Tracking de conversiones bien configurado</li>
              <li>✅ Creatividades de calidad (imágenes, videos)</li>
            </ul>

            <p className="text-gray-700 mb-8">
              En M&P hemos visto mejoras de +60-180% en conversiones con PMax en cuentas que cumplen estos requisitos.
              Pero si recién empiezas, mejor partir con Search tradicional.
            </p>

            <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres implementar Performance Max?
              </h3>
              <p className="text-xl text-purple-100 mb-8">
                Te ayudamos a configurar, optimizar y escalar tus campañas PMax con estrategia basada en datos.
              </p>
              <Link
                href="https://wa.me/56992258137?text=Hola%2C%20quiero%20implementar%20Performance%20Max"
                className="inline-block bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Hablar con un Especialista
              </Link>
              <p className="text-purple-100 text-sm mt-4">
                📊 Configuración + Optimización en 48 horas
              </p>
            </div>
          </div>
        </div>
      </article>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/"><img src="/logo-white.png" alt="Muller y Pérez" className="h-10 w-auto mx-auto mb-6" /></Link>
          <p className="text-gray-400">© 2025 Muller y Pérez. Marketing Digital Basado en Datos.</p>
        </div>
      </footer>
    </div>
  )
}
