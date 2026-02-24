import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, DollarSign, CheckCircle, Zap, Users, BarChart3, PlayCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Estrategias de SEO en Chile 2025: Cómo una Agencia de Marketing Digital Combina Ads y Contenido para Dominar Búsquedas',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 combina SEO, Ads y contenido evergreen para dominar búsquedas y reducir CAC.',
  keywords: 'agencia de marketing digital, SEO Chile 2025, agencia marketing digital SEO, estrategias híbridas Ads SEO, contenido evergreen Chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/seo-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Estrategias de SEO en Chile 2025: Cómo una Agencia de Marketing Digital Combina Ads y Contenido para Dominar Búsquedas',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 combina SEO, Ads y contenido evergreen para dominar búsquedas y reducir CAC.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/seo-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-01-23T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Estrategias de SEO en Chile 2025: Cómo una Agencia de Marketing Digital Combina Ads y Contenido para Dominar Búsquedas',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 combina SEO, Ads y contenido evergreen para dominar búsquedas y reducir CAC.',
    url: 'https://www.mulleryperez.cl/blog/seo-agencia-marketing-digital-chile-2025',
    datePublished: '2025-01-23T00:00:00.000Z',
    dateModified: '2025-01-23T00:00:00.000Z',
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
      '@id': 'https://www.mulleryperez.cl/blog/seo-agencia-marketing-digital-chile-2025'
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
            <p className="text-gray-500 mt-4">23 de enero de 2025 · 10 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Estrategias de SEO en Chile 2025: Cómo una Agencia de Marketing Digital Combina Ads y Contenido para Dominar Búsquedas
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En Chile 2025, las búsquedas en Google y en plataformas de inteligencia artificial (ChatGPT, Gemini, Meta AI) se han convertido en el principal canal de descubrimiento de marcas y servicios. Sin embargo, la mayoría de las empresas sigue viendo SEO y Paid Media como estrategias separadas, cuando en realidad deben funcionar de manera integrada.
              </p>
              <p className="text-gray-700 mb-4">
                El error más común es pensar que con pagar anuncios basta, o que con publicar artículos de blog se logrará aparecer en la primera página de Google. La realidad es que en un mercado competitivo como el chileno, se necesita un enfoque híbrido: SEO estratégico + campañas de Ads + contenido evergreen.
              </p>
              <p className="text-gray-700 mb-4">
                Aquí es donde una agencia de marketing digital aporta valor real: diseñando estrategias de SEO que no solo posicionan en Google, sino que también refuerzan la conversión desde Ads y mejoran la autoridad de marca en el largo plazo.
              </p>
              <p className="text-gray-700 mb-4">
                ¿Por qué el SEO sigue siendo clave en Chile 2025?
              </p>
            </div>

            {/* 1. Investigación de keywords estratégicas */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              1. Investigación de keywords estratégicas
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Palabras clave de intención comercial (ej: “software RRHH Chile”, “cotizar arriendo oficinas Santiago”).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Keywords long-tail (ej: “mejor agencia de marketing digital en Chile 2025”).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Búsquedas relacionadas a problemas específicos (“cómo reducir CAC en campañas”).</span>
                </li>
              </ul>
            </div>

            {/* 2. Optimización técnica del sitio */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              2. Optimización técnica del sitio
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Velocidad de carga (Core Web Vitals).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Estructura SEO-friendly (H1, H2, meta tags, schema).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Indexación en buscadores y plataformas de IA.</span>
                </li>
              </ul>
            </div>

            {/* 3. Creación de contenido de valor */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              3. Creación de contenido de valor
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Artículos evergreen de 2.500+ palabras.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Comparativas, benchmarks y estudios de caso en Chile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Guías descargables para captar leads.</span>
                </li>
              </ul>
            </div>

            {/* 4. Estrategia híbrida SEO + Ads */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              4. Estrategia híbrida SEO + Ads
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Uso de Ads en keywords de alta competencia para acelerar posicionamiento.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Refuerzo de contenidos orgánicos con campañas de descubrimiento.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Retargeting a usuarios que llegan por SEO y no convierten de inmediato.</span>
                </li>
              </ul>
            </div>

            {/* 5. Linkbuilding y autoridad */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              5. Linkbuilding y autoridad
            </h2>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Generación de enlaces desde medios locales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Alianzas con portales de la industria.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Guest posting estratégico en blogs relevantes.</span>
                </li>
              </ul>
            </div>

            {/* Ejemplo práctico en Chile */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Ejemplo práctico en Chile
            </h2>

            <p className="text-gray-700 mb-4">Caso: empresa de construcción industrial</p>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Problema: dependencia excesiva de Google Ads, con CPL promedio de $25.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Estrategia:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Creación de blog con keywords long-tail (“optimización procesos industriales Chile”).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Optimización técnica del sitio (velocidad ↑ 48%).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Refuerzo con Ads en keywords competitivas mientras SEO ganaba tracción.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Resultados:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>CPL orgánico: $9.500 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Tráfico orgánico ↑ 210% en 6 meses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>ROI total: 5.4x.</span>
                </li>
              </ul>
            </div>

            {/* Costos de una estrategia SEO en Chile 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Costos de una estrategia SEO en Chile 2025
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Setup inicial (auditoría + optimización técnica): $1.200.000 – $2.500.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Gestión mensual con agencia: $500.000 – $1.500.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Tiempo estimado para resultados: 4–6 meses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Aunque SEO requiere paciencia, en Chile 2025 es una inversión estratégica que reduce la dependencia de Ads.</span>
                </li>
              </ul>
            </div>

            {/* Checklist M&P para SEO 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para SEO 2025
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Investiga keywords con intención de negocio, no solo volumen.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Optimiza técnica y estructuralmente el sitio.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Produce artículos largos, evergreen y con data local.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Refuerza con Ads para acelerar resultados.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Construye autoridad con links de calidad en Chile.</span>
                </li>
              </ul>
            </div>

            {/* Una agencia de marketing digital con expertise SEO sabe cómo conectar palabras clave con ventas reales, combinando contenido evergreen con campañas de Ads inteligentes. */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Una agencia de marketing digital con expertise SEO sabe cómo conectar palabras clave con ventas reales, combinando contenido evergreen con campañas de Ads inteligentes.
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>En M&P ayudamos a marcas chilenas a dominar búsquedas con estrategias híbridas, optimizando tanto tráfico orgánico como pagado.</span>
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
