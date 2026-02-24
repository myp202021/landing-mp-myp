import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, BarChart3, Target, CheckCircle, Zap, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing de Datos: No es un Juego, es Ingeniería',
  description: 'El marketing de datos no es azar: requiere ingeniería, modelos de decisión y métricas claras para lograr resultados sostenibles en Chile.',
  keywords: 'marketing de datos, ingeniería en marketing, marketing digital Chile, CAC, KPI marketing, ROI campañas digitales',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/marketing-de-datos-no-es-un-juego'
  },
  openGraph: {
    title: 'Marketing de Datos: No es un Juego, es Ingeniería',
    description: 'El marketing de datos no es azar: requiere ingeniería, modelos de decisión y métricas claras para lograr resultados sostenibles en Chile.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/marketing-de-datos-no-es-un-juego',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Marketing de Datos: No es un Juego, es Ingeniería',
    description: 'El marketing de datos no es azar: requiere ingeniería, modelos de decisión y métricas claras para lograr resultados sostenibles en Chile.',
    url: 'https://www.mulleryperez.cl/blog/marketing-de-datos-no-es-un-juego',
    datePublished: '2025-10-09T00:00:00.000Z',
    dateModified: '2025-10-09T00:00:00.000Z',
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
      '@id': 'https://www.mulleryperez.cl/blog/marketing-de-datos-no-es-un-juego'
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
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Performance Marketing</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 12 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Marketing de Datos: No es un Juego, es Ingeniería
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            El marketing digital moderno no es un juego de intuiciones. Es un sistema complejo de variables interdependientes que debe analizarse con lógica de ingeniería.
          </p>

          <div className="prose prose-lg max-w-none">
            {/* INTRO */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Introducción
              </h3>
              <p className="text-gray-700 mb-4">
                En Chile y Latinoamérica todavía se habla del marketing digital como si fuera un arte de prueba y error. Se invierte un presupuesto en Google o Meta, se observa un par de semanas, y si los clics parecen subir, se considera un éxito.
              </p>
              <p className="text-gray-700 mb-4">
                La realidad es otra: el marketing digital moderno no es un juego de intuiciones. Es un sistema complejo de variables interdependientes que debe analizarse con lógica de ingeniería. En M&P lo tratamos como tal: un modelo que requiere datos, pruebas controladas, dashboards en tiempo real y decisiones estratégicas con un nivel de confianza superior al 90%.
              </p>
              <p className="text-gray-700">
                Este artículo explica por qué el marketing de datos es ingeniería aplicada y no improvisación. Además, revisaremos las variables críticas, los tipos de campañas, y cómo construir un árbol de decisión que guíe la inversión publicitaria con precisión.
              </p>
            </div>

            {/* SECCIÓN 1 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Las variables que definen el éxito en marketing digital
            </h2>

            <p className="text-gray-700 mb-6">
              Para entender una campaña como un sistema ingenieril, primero debemos listar las variables de entrada. Cada decisión posterior dependerá de cómo estas interactúan entre sí:
            </p>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Variables económicas y de negocio:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Ticket promedio.</li>
                <li>Margen de contribución.</li>
                <li>Ciclo de venta (días, semanas o meses).</li>
                <li>Presupuesto disponible.</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Variables de mercado:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Competencia directa e indirecta.</li>
                <li>Saturación de subasta (Google Ads, Meta Ads, LinkedIn).</li>
                <li>Estacionalidad de la industria.</li>
                <li>Zona geográfica (Santiago vs. regiones).</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Variables de cliente:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Perfil del decisor (edad, cargo, poder de compra).</li>
                <li>Motivaciones de búsqueda (precio, calidad, rapidez, exclusividad).</li>
                <li>Nivel de awareness (frío, tibio, caliente).</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Variables de plataforma y canal:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Google Search vs. PMax.</li>
                <li>Meta (FB/IG) conversiones vs. awareness.</li>
                <li>LinkedIn Ads (B2B alto ticket).</li>
                <li>TikTok (awareness masivo).</li>
                <li>YouTube (inspiración + educación).</li>
              </ul>
            </div>

            {/* SECCIÓN 2 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Por qué los benchmarks genéricos fallan
            </h2>

            <p className="text-gray-700 mb-4">
              En Chile se suele preguntar: "¿Cuánto debería invertir una empresa promedio en marketing digital?". La respuesta es: depende.
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>En retail, $1.000.000 CLP puede rendir 300 leads al mes.</li>
              <li>En SaaS B2B, la misma inversión puede traer apenas 30 leads… pero con tickets 10 veces más altos.</li>
              <li>En inmobiliarias, un lead puede costar $15.000 CLP, pero el ROI final es positivo porque se mide en UF, no en pesos.</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold">Conclusión:</p>
              <p className="text-gray-700">Cada vertical requiere su propio benchmark ingenieril. Los promedios engañan y llevan a tomar decisiones erradas.</p>
            </div>

            {/* SECCIÓN 3 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              El rol de los tipos de campaña
            </h2>

            <p className="text-gray-700 mb-4">
              Cada tipo de campaña cumple una función en el ecosistema. Tratarlas todas igual es uno de los errores más comunes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Google Search / PMax:</p>
                <p className="text-gray-700 text-sm">Capturan demanda existente.</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Display / YouTube:</p>
                <p className="text-gray-700 text-sm">Amplían alcance y awareness.</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Remarketing:</p>
                <p className="text-gray-700 text-sm">Refuerza y filtra.</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">WhatsApp / Formularios:</p>
                <p className="text-gray-700 text-sm">Aceleran el contacto comercial.</p>
              </div>
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">TikTok y LinkedIn:</p>
                <p className="text-gray-700 text-sm">Potencian awareness y credibilidad según el perfil.</p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Ejemplo:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>En un SaaS chileno, Google Search trae leads inmediatos.</li>
                <li>LinkedIn eleva la autoridad de marca en decisores.</li>
                <li>Meta genera remarketing eficiente.</li>
              </ul>
            </div>

            {/* SECCIÓN 4 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Code className="w-8 h-8 text-purple-600" />
              Cómo funciona el árbol de decisión en M&P
            </h2>

            <p className="text-gray-700 mb-4">
              Cuando diseñamos campañas, aplicamos lógica de árbol de decisión:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-white border-l-4 border-blue-600 p-6 rounded-r-xl shadow-md">
                <p className="font-bold text-gray-900 mb-2">1. Definimos la meta:</p>
                <p className="text-gray-700">Leads, ventas, awareness, share of voice.</p>
              </div>

              <div className="bg-white border-l-4 border-green-600 p-6 rounded-r-xl shadow-md">
                <p className="font-bold text-gray-900 mb-2">2. Levantamos las variables:</p>
                <p className="text-gray-700">Ticket, zona, competencia, estacionalidad.</p>
              </div>

              <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <p className="font-bold text-gray-900 mb-2">3. Asignamos nodos:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                  <li>Si ticket es bajo → volumen y performance (Google PMax, Meta conversiones).</li>
                  <li>Si ticket es alto → autoridad + remarketing (LinkedIn + Google Search).</li>
                  <li>Si ciclo es largo → contenido educativo + nurturing (YouTube, email marketing).</li>
                  <li>Si competencia es fuerte → awareness para reducir CPC indirecto.</li>
                </ul>
              </div>

              <div className="bg-white border-l-4 border-orange-600 p-6 rounded-r-xl shadow-md">
                <p className="font-bold text-gray-900 mb-2">4. Asignamos escenarios de inversión:</p>
                <p className="text-gray-700">Conservador, medio, agresivo.</p>
              </div>

              <div className="bg-white border-l-4 border-pink-600 p-6 rounded-r-xl shadow-md">
                <p className="font-bold text-gray-900 mb-2">5. Calculamos KPI proyectados:</p>
                <p className="text-gray-700">CPC, CPL, CAC y ROAS esperado.</p>
              </div>
            </div>

            {/* SECCIÓN 5 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Ingeniería aplicada al marketing digital
            </h2>

            <p className="text-gray-700 mb-4">
              ¿Por qué decimos que esto es ingeniería y no marketing tradicional?
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
              <li>Porque usamos modelos probabilísticos y escenarios de simulación.</li>
              <li>Porque hacemos pruebas A/B multivariable con disciplina estadística.</li>
              <li>Porque calculamos niveles de confianza en las estimaciones.</li>
              <li>Porque redistribuimos inversión con lógica de optimización continua.</li>
            </ul>

            {/* EJEMPLO REAL */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ejemplo real: SaaS en Chile</h3>
              <ul className="space-y-2 mb-4">
                <li>• Ticket promedio: $500.000 CLP anual por usuario.</li>
                <li>• Presupuesto mensual: $1.000.000 CLP.</li>
                <li>• Estrategia clásica: invertir todo en Google. Resultado → CPL $40.000.</li>
              </ul>
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <p className="font-bold mb-2">Estrategia ingenieril:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Google Search: 50%.</li>
                  <li>• LinkedIn authority: 20%.</li>
                  <li>• Meta remarketing: 20%.</li>
                  <li>• YouTube educativo: 10%.</li>
                </ul>
              </div>
              <p className="text-xl font-bold">Resultado: CPL ajustado a $28.000, CAC con payback en 3 meses.</p>
            </div>

            {/* CHECKLIST */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist para pasar de intuición a ingeniería
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define ticket promedio y ciclo de venta antes de asignar presupuesto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa benchmarks de tu industria, no promedios globales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Construye un árbol de decisión de campañas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Simula escenarios (conservador, medio, agresivo).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Mide KPI de negocio: CAC, LTV, ROAS.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Redistribuye inversión mensualmente según evidencia.</span>
                </li>
              </ul>
            </div>

            {/* CONCLUSIÓN */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Conclusión
            </h2>

            <p className="text-gray-700 mb-4">
              El marketing digital ya no puede gestionarse como un juego de azar. Las empresas que siguen apostando al "prueba y error" pierden tiempo y dinero.
            </p>

            <p className="text-gray-700 mb-6">
              El camino real es tratarlo como lo que es: un sistema ingenieril de variables, hipótesis y optimización continua. En M&P acompañamos a las empresas chilenas con esa mirada, aplicando modelos de decisión, benchmarks locales y dashboards que muestran con claridad dónde invertir y qué cortar.
            </p>

            {/* CTA FINAL */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres dejar atrás la intuición y pasar al marketing de datos con lógica de ingeniería?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Conversemos y te mostramos cómo aplicar estos principios a tu negocio.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Hablar con un Especialista
              </Link>
            </div>
          </div>
        </div>
      </article>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/"><img src="/logo-blanco.png" alt="Muller y Pérez" className="h-10 w-auto mx-auto mb-6" /></Link>
          <p className="text-gray-400">© 2025 Muller y Pérez. Marketing Digital Basado en Datos.</p>
        </div>
      </footer>
    </div>
  )
}
