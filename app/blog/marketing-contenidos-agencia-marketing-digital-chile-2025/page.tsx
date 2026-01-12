import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, DollarSign, CheckCircle, Zap, Users, BarChart3, PlayCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing de Contenidos en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Blogs y Videos en Ventas',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 convierte blogs y videos en ventas con estrategias SEO, multicanal y reportería de ROI.',
  keywords: 'agencia de marketing digital, marketing de contenidos Chile 2025, agencia marketing digital contenidos, SEO y performance Chile, contenidos evergreen Chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/marketing-contenidos-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Marketing de Contenidos en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Blogs y Videos en Ventas',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 convierte blogs y videos en ventas con estrategias SEO, multicanal y reportería de ROI.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/marketing-contenidos-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-01-27T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Marketing de Contenidos en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Blogs y Videos en Ventas',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 convierte blogs y videos en ventas con estrategias SEO, multicanal y reportería de ROI.',
    url: 'https://www.mulleryperez.cl/blog/marketing-contenidos-agencia-marketing-digital-chile-2025',
    datePublished: '2025-01-27T00:00:00.000Z',
    dateModified: '2025-01-27T00:00:00.000Z',
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
      '@id': 'https://www.mulleryperez.cl/blog/marketing-contenidos-agencia-marketing-digital-chile-2025'
    },
    articleSection: 'Marketing Digital',
    inLanguage: 'es-CL'
  }

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-white">
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
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">Performance</span>
            <p className="text-gray-500 mt-4">27 de enero de 2025 · 10 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Marketing de Contenidos en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Blogs y Videos en Ventas
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En 2025, el marketing de contenidos ya no es publicar un par de artículos en un blog y esperar resultados. En Chile, donde la competencia digital crece cada mes, las marcas que logran diferenciarse son aquellas que transforman contenido en ventas reales, no en métricas de vanidad.
              </p>
              <p className="text-gray-700 mb-4">
                El error más común es creer que contenido es solo branding. En realidad, bien ejecutado, se convierte en una de las estrategias más efectivas para reducir CAC, aumentar LTV y generar confianza en el largo plazo.
              </p>
              <p className="text-gray-700 mb-4">
                Aquí es donde una agencia de marketing digital juega un rol clave: diseña contenidos estratégicos (blogs, videos, ebooks, newsletters, podcasts) con lógica de performance y reportería financiera.
              </p>
              <p className="text-gray-700 mb-4">
                ¿Por qué el marketing de contenidos es clave en Chile 2025?
              </p>
            </div>

            {/* 1. Investigación y planificación */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              1. Investigación y planificación
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Keywords de intención comercial y long-tail.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Análisis de competidores en Google y redes sociales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Definición de rubros prioritarios (ej: inmobiliario, SaaS, retail).</span>
                </li>
              </ul>
            </div>

            {/* 2. Producción de contenidos */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              2. Producción de contenidos
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Blogs evergreen: artículos de 2.500+ palabras con data local.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Videos cortos: para TikTok, Reels y YouTube Shorts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Ebooks y guías: para captar leads B2B.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Podcasts y webinars: para reforzar autoridad de marca.</span>
                </li>
              </ul>
            </div>

            {/* 3. Distribución multicanal */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              3. Distribución multicanal
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>SEO para búsquedas en Google.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Promoción en LinkedIn, Meta y TikTok.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Email marketing con flujos de nurturing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>WhatsApp para seguimiento post-descarga.</span>
                </li>
              </ul>
            </div>

            {/* 4. Medición de performance */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              4. Medición de performance
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Tráfico orgánico.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Leads generados por contenido.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Impacto en CAC y LTV.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>ROI atribuido a contenido.</span>
                </li>
              </ul>
            </div>

            {/* Ejemplo práctico en Chile */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              Ejemplo práctico en Chile
            </h2>

            <p className="text-gray-700 mb-4">Caso: empresa de software SaaS</p>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Problema: dependencia de Google Ads con CPL alto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Estrategia:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Blog con artículos sobre “tendencias de RRHH en Chile 2025”.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Videos cortos en LinkedIn con insights ejecutivos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Ebook descargable con benchmark de su industria.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Resultados:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Tráfico orgánico ↑ 240% en 6 meses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>CPL ↓ 31%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>ROI total: 7.2x.</span>
                </li>
              </ul>
            </div>

            {/* Benchmarks de marketing de contenidos en Chile 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Benchmarks de marketing de contenidos en Chile 2025
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Costo promedio por lead vía contenido: $6.000 – $12.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>CAC reducido en promedio: 20–35%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Tiempo para resultados visibles: 4–6 meses.</span>
                </li>
              </ul>
            </div>

            {/* Costos de implementar marketing de contenidos con agencia */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Costos de implementar marketing de contenidos con agencia
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Setup inicial (plan editorial + SEO): $1.200.000 – $2.500.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Gestión mensual con agencia de marketing digital: $600.000 – $1.500.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Producción audiovisual avanzada (videos/podcasts): desde $800.000 CLP adicionales.</span>
                </li>
              </ul>
            </div>

            {/* Checklist M&P para marketing de contenidos */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para marketing de contenidos
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define keywords con intención de negocio.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Diseña un calendario editorial de al menos 3–6 meses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Produce blogs evergreen de +2.500 palabras.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Integra blogs con campañas pagadas y nurturing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Mide CPL, CAC y ROI atribuibles al contenido.</span>
                </li>
              </ul>
            </div>

            {/* Una agencia de marketing digital experta convierte artículos y videos en un activo financiero para la empresa, con reportería clara de ROI y crecimiento. */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Una agencia de marketing digital experta convierte artículos y videos en un activo financiero para la empresa, con reportería clara de ROI y crecimiento.
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>En M&P diseñamos estrategias de contenido multicanal que no solo atraen tráfico, sino que convierten en ventas medibles.</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres transformar tu marketing digital?
              </h3>
              <p className="text-xl text-red-100 mb-8">
                Agenda una sesión estratégica gratuita con nuestros especialistas.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-red-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Hablar con un Especialista
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2025 Muller y Pérez · Agencia de Marketing Digital</p>
        </div>
      </footer>
    </div>
  )
}
