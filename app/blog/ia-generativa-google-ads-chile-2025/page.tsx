import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Brain, Sparkles, Zap, Target, CheckCircle, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'IA Generativa para Google Ads Chile 2025: Guía Completa para Optimizar Campañas',
  description: 'Aprende a usar ChatGPT, Claude y Gemini para crear mejores campañas de Google Ads. Prompts, estrategias y casos reales en Chile 2025.',
  keywords: 'IA generativa Google Ads, ChatGPT Google Ads, Claude Ads, inteligencia artificial publicidad Chile, automatización campañas Google',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/ia-generativa-google-ads-chile-2025'
  },
  openGraph: {
    title: 'IA Generativa para Google Ads Chile 2025: Guía Completa',
    description: 'Aprende a usar ChatGPT, Claude y Gemini para crear mejores campañas de Google Ads en Chile.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/ia-generativa-google-ads-chile-2025',
    publishedTime: '2025-01-15T00:00:00.000Z'
  }
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'IA Generativa para Google Ads Chile 2025: Guía Completa para Optimizar Campañas',
  description: 'Aprende a usar ChatGPT, Claude y Gemini para crear mejores campañas de Google Ads. Prompts, estrategias y casos reales en Chile 2025.',
  url: 'https://www.mulleryperez.cl/blog/ia-generativa-google-ads-chile-2025',
  datePublished: '2025-01-15T00:00:00.000Z',
  dateModified: '2025-01-15T00:00:00.000Z',
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
    '@id': 'https://www.mulleryperez.cl/blog/ia-generativa-google-ads-chile-2025'
  },
  articleSection: 'Marketing Digital',
  inLanguage: 'es-CL'
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
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
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">IA & Automatización</span>
            <p className="text-gray-500 mt-4">15 de enero de 2025 · 15 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            IA Generativa para Google Ads Chile 2025: Guía Completa para Optimizar Campañas
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            La inteligencia artificial generativa cambió las reglas del juego en paid media. Aprende a usar ChatGPT, Claude y Gemini para crear copies más efectivos, optimizar pujas y escalar resultados.
          </p>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" /> ¿Por qué IA Generativa en Google Ads?
              </h3>
              <p className="text-gray-700 mb-4">
                En 2025, el 73% de los marketers en Latinoamérica ya usan alguna forma de IA para sus campañas. En Chile, las agencias que adoptaron IA generativa reportan un <strong>35% de reducción en tiempo de creación de anuncios</strong> y un <strong>22% de mejora en CTR</strong>.
              </p>
              <p className="text-gray-700">
                La IA no reemplaza al estratega, pero sí acelera la ejecución. Quien no la use, quedará en desventaja competitiva.
              </p>
            </div>

            {/* Sección 1: Herramientas */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              Las 3 Herramientas de IA que Debes Dominar
            </h2>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">ChatGPT (GPT-4)</h4>
                <p className="text-gray-600 text-sm">Ideal para brainstorming de copies, variaciones de anuncios y análisis de competencia. Mejor para volumen.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Claude (Anthropic)</h4>
                <p className="text-gray-600 text-sm">Excelente para análisis profundo, estrategia y textos más largos. Mejor razonamiento lógico.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Gemini (Google)</h4>
                <p className="text-gray-600 text-sm">Integración nativa con Google Ads. Ideal para análisis de datos y sugerencias dentro de la plataforma.</p>
              </div>
            </div>

            {/* Sección 2: Casos de Uso */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              5 Casos de Uso Prácticos para Chile
            </h2>

            <div className="space-y-6 my-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  1. Generación de Headlines RSA
                </h4>
                <p className="text-gray-700 mb-4">
                  Los Responsive Search Ads necesitan 15 headlines. Con IA puedes generar 50 variaciones en segundos y seleccionar las mejores.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-mono text-gray-600">
                    <strong>Prompt:</strong> "Genera 20 headlines de máximo 30 caracteres para un servicio de arriendo de autos en Santiago. Incluye precio, beneficio principal y urgencia. Tono profesional pero cercano."
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  2. Análisis de Competencia
                </h4>
                <p className="text-gray-700 mb-4">
                  Pega los anuncios de tu competencia y pide a la IA que identifique patrones, USPs y oportunidades.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-mono text-gray-600">
                    <strong>Prompt:</strong> "Analiza estos 5 anuncios de mi competencia [pegar anuncios]. Identifica: 1) Propuesta de valor principal, 2) Llamados a acción usados, 3) Gaps que puedo explotar, 4) Palabras clave que usan."
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  3. Optimización de Landing Pages
                </h4>
                <p className="text-gray-700 mb-4">
                  La IA puede revisar tu landing y sugerir mejoras específicas para aumentar conversiones.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-mono text-gray-600">
                    <strong>Prompt:</strong> "Actúa como experto en CRO. Revisa esta landing page [URL o contenido] y dame 10 mejoras concretas para aumentar la tasa de conversión. Prioriza por impacto."
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  4. Expansión de Keywords
                </h4>
                <p className="text-gray-700 mb-4">
                  Genera long-tail keywords y variaciones semánticas que el Keyword Planner no te muestra.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-mono text-gray-600">
                    <strong>Prompt:</strong> "Mi keyword principal es 'software de gestión empresarial Chile'. Genera 30 variaciones long-tail que incluyan: problemas que resuelve, industrias específicas, tamaño de empresa, y términos locales chilenos."
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  5. Scripts de Remarketing
                </h4>
                <p className="text-gray-700 mb-4">
                  Crea secuencias de anuncios para remarketing con mensajes progresivos.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-mono text-gray-600">
                    <strong>Prompt:</strong> "Crea una secuencia de 5 anuncios de remarketing para usuarios que visitaron mi página de precios pero no convirtieron. Producto: CRM para PYMEs. Día 1: recordatorio, Día 3: beneficio, Día 7: testimonial, Día 14: oferta, Día 21: urgencia."
                  </p>
                </div>
              </div>
            </div>

            {/* Sección 3: Errores Comunes */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              Errores que Debes Evitar
            </h2>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 my-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">❌</span>
                  <div>
                    <strong>Copiar y pegar sin revisar:</strong> La IA puede generar textos que violan políticas de Google Ads (exageraciones, claims médicos, etc.)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">❌</span>
                  <div>
                    <strong>No dar contexto local:</strong> Sin especificar "Chile" o "Santiago", la IA genera contenido genérico que no conecta con tu audiencia.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">❌</span>
                  <div>
                    <strong>Confiar ciegamente en los datos:</strong> La IA no tiene acceso a tu cuenta de Google Ads. Sus recomendaciones de pujas son estimaciones.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">❌</span>
                  <div>
                    <strong>No iterar:</strong> El primer output rara vez es el mejor. Pide 2-3 rondas de mejoras.
                  </div>
                </li>
              </ul>
            </div>

            {/* Sección 4: Framework */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-yellow-500" />
              Framework M&P para Prompts Efectivos
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 my-8">
              <p className="text-gray-700 mb-4">Usa esta estructura para obtener mejores resultados:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                  <span><strong>ROL:</strong> Define quién es la IA (experto en Google Ads, copywriter, etc.)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                  <span><strong>CONTEXTO:</strong> Tu industria, producto, audiencia, Chile</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                  <span><strong>TAREA:</strong> Qué necesitas exactamente (headlines, análisis, etc.)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                  <span><strong>FORMATO:</strong> Cómo quieres el output (lista, tabla, párrafos)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
                  <span><strong>RESTRICCIONES:</strong> Límites de caracteres, políticas, tono</span>
                </div>
              </div>
            </div>

            {/* Sección 5: Resultados */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-600" />
              Resultados Reales en Chile
            </h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                <p className="text-4xl font-black text-green-700 mb-2">+35%</p>
                <p className="text-gray-700">Reducción en tiempo de creación de anuncios</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                <p className="text-4xl font-black text-blue-700 mb-2">+22%</p>
                <p className="text-gray-700">Mejora promedio en CTR de campañas</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                <p className="text-4xl font-black text-purple-700 mb-2">3x</p>
                <p className="text-gray-700">Más variaciones de anuncios testeadas</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
                <p className="text-4xl font-black text-orange-700 mb-2">-18%</p>
                <p className="text-gray-700">Reducción en CPA promedio</p>
              </div>
            </div>

            {/* Conclusión */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl my-12">
              <h3 className="text-2xl font-bold mb-4">Conclusión</h3>
              <p className="mb-4">
                La IA generativa no es el futuro del marketing digital en Chile: es el presente. Las agencias y empresas que ya la adoptaron tienen una ventaja competitiva significativa.
              </p>
              <p className="mb-6">
                La clave está en usarla como acelerador, no como reemplazo del criterio estratégico. Un buen prompt + experiencia humana = resultados excepcionales.
              </p>
              <Link
                href="/labs/predictor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Prueba nuestro Predictor con IA <Zap className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </div>
      </article>

      {/* CTA Final */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Quieres implementar IA en tus campañas?</h2>
          <p className="text-gray-300 mb-8">
            En M&P usamos IA generativa para optimizar todas las campañas de nuestros clientes. Agenda una reunión y te mostramos cómo.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Agendar Reunión Gratis
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Muller y Pérez</p>
          <div className="flex gap-6 text-sm">
            <Link href="/blog" className="text-gray-500 hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/labs" className="text-gray-500 hover:text-blue-600 transition-colors">M&P Labs</Link>
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Inicio</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
