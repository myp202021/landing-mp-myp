import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, DollarSign, TrendingUp, MapPin, BarChart3, CheckCircle, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Publicidad Digital en Chile 2025: Costos Reales por Industria y Región (Google & Meta)',
  description: 'Descubre los costos reales de la publicidad digital en Chile 2025. Benchmarks de Google y Meta Ads por industria y región, con ejemplos locales y proyecciones.',
  keywords: 'publicidad digital Chile 2025, costos publicidad digital Chile, CPL Google Meta Chile, benchmark campañas digitales Chile, marketing digital por industria Chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/publicidad-digital-chile-2025-costos-industria-region'
  },
  openGraph: {
    title: 'Publicidad Digital en Chile 2025: Costos Reales por Industria y Región (Google & Meta)',
    description: 'Descubre los costos reales de la publicidad digital en Chile 2025. Benchmarks de Google y Meta Ads por industria y región, con ejemplos locales y proyecciones.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/publicidad-digital-chile-2025-costos-industria-region',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Publicidad Digital en Chile 2025: Costos Reales por Industria y Región (Google & Meta)',
    description: 'Descubre los costos reales de la publicidad digital en Chile 2025. Benchmarks de Google y Meta Ads por industria y región, con ejemplos locales y proyecciones.',
    url: 'https://www.mulleryperez.cl/blog/publicidad-digital-chile-2025-costos-industria-region',
    datePublished: '2025-10-09T00:00:00.000Z',
    dateModified: '2025-10-09T00:00:00.000Z',
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
      '@id': 'https://www.mulleryperez.cl/blog/publicidad-digital-chile-2025-costos-industria-region'
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
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Costos</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 16 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Publicidad Digital en Chile 2025: Costos Reales por Industria y Región (Google &amp; Meta)
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Benchmarks actualizados de Google y Meta Ads por industria y región en Chile, con datos reales y proyecciones para maximizar tu inversión.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En 2025, la publicidad digital en Chile se ha vuelto más competitiva que nunca. Cada clic en Google Ads y Meta Ads representa no solo un costo, sino también una oportunidad de negocio que puede definir el éxito de una empresa.
              </p>
              <p className="text-gray-700 mb-4">
                El error más común es seguir usando "promedios globales" o benchmarks de otros países que no reflejan la realidad chilena. En M&amp;P hemos recopilado, analizado y modelado cientos de campañas en distintas industrias y regiones de Chile, y podemos afirmar con certeza: los costos reales de la publicidad digital varían enormemente según el rubro, la ciudad y la etapa del funnel.
              </p>
              <p className="text-gray-700">
                En este artículo te mostramos cómo leer esos costos, con benchmarks por industria y región, y cómo asignar presupuestos con lógica ingenieril.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              Factores que determinan el costo de la publicidad digital en Chile
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Industria y ticket promedio</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Un lead de inmobiliaria (ticket 2.000+ UF) cuesta mucho más que un lead de e-commerce con ticket $20.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>La escala del negocio define el CAC aceptable.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Región y ciudad</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Santiago concentra la mayor parte de la inversión, lo que eleva CPC y CPL.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Regiones como Temuco, Concepción o Antofagasta muestran menor competencia, pero menor volumen.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Plataforma y formato</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Google Search y PMax</strong> → capturan demanda activa, CPC alto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Meta Ads</strong> → segmentación masiva y remarketing, CPL más bajo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>LinkedIn Ads</strong> → costos altos pero leads de alto ticket B2B.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>TikTok</strong> → CPM bajo, pero foco en awareness.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Competencia en subasta</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Rubros como inmobiliario, educación superior y retail están saturados en Google.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Nichos como servicios industriales y B2B aún tienen espacios más económicos.</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Benchmarks de Google Ads en Chile 2025
            </h2>

            <p className="text-gray-700 mb-4 font-semibold">
              Costos promedio por industria (Google Search / PMax)
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Industria</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-blue-700">CPC</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-blue-700">CPL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🏠 Inmobiliarias</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$600 – $900 CLP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$12.000 – $20.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">👩‍🎓 Educación superior</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$450 – $700 CLP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$8.000 – $15.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🛒 Ecommerce retail</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$250 – $400 CLP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$2.000 – $4.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🏢 SaaS B2B</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$800 – $1.200 CLP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$18.000 – $40.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🚗 Automotriz</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$500 – $750 CLP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$10.000 – $20.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🏥 Salud privada</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$350 – $550 CLP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$7.000 – $12.000 CLP</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">👉 Insight:</p>
              <p className="text-gray-700">
                Google sigue siendo el canal de leads "calientes", pero a un costo creciente en industrias saturadas.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              Benchmarks de Meta Ads en Chile 2025
            </h2>

            <p className="text-gray-700 mb-4 font-semibold">
              Costos promedio por industria (Facebook / Instagram Ads)
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Industria</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-purple-700">CPL Meta Ads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🏠 Inmobiliarias</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$8.000 – $15.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">👩‍🎓 Educación superior</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$5.000 – $10.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🛒 Ecommerce retail</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$1.500 – $3.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🏢 SaaS B2B</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$12.000 – $25.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🚗 Automotriz</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$7.000 – $15.000 CLP</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">🏥 Salud privada</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$5.000 – $9.000 CLP</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">👉 Insight:</p>
              <p className="text-gray-700">
                Meta genera más leads que Google en la mayoría de los rubros, pero con menor calidad inicial. El remarketing es clave para filtrar.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              Comparativa Google vs Meta
            </h2>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Industria</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-blue-700">CPL Google Ads</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-purple-700">CPL Meta Ads</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Conclusión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Inmobiliarias</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$12.000–$20.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$8.000–$15.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Meta más barato, Google más calificado</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Educación</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$8.000–$15.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$5.000–$10.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Meta más económico para volumen, Google para leads más listos</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Retail</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$2.000–$4.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$1.500–$3.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Ambos válidos, depende de ticket promedio</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">SaaS B2B</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$18.000–$40.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$12.000–$25.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Google más caro, LinkedIn clave en este mix</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Automotriz</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$10.000–$20.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$7.000–$15.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Meta más competitivo, Google complementa</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Salud privada</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$7.000–$12.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">$5.000–$9.000</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Meta lidera en awareness y leads iniciales</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-red-600" />
              Costos por región en Chile
            </h2>

            <div className="bg-white border-2 border-red-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Santiago:</strong> CPC y CPL más altos por saturación.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Concepción y Temuco:</strong> CPC 20% más bajos que en Santiago, pero menor volumen.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Valparaíso y Viña:</strong> CPC similar a Santiago, con menos subastas B2B.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Antofagasta:</strong> CPC alto en industrias mineras, bajo en retail y educación.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">👉 Ejemplo inmobiliario:</h3>
              <ul className="space-y-2">
                <li>• CPL en Santiago: $15.000 CLP.</li>
                <li>• CPL en Temuco: $11.000 CLP.</li>
                <li>• CPL en Viña: $14.000 CLP.</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist para definir presupuesto por industria
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Calcula tu ticket promedio y CAC aceptable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Estudia benchmarks de tu industria en Chile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Ajusta por región (Santiago vs regiones).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Decide mix Google vs Meta según ciclo de venta.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Incluye remarketing obligatorio.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Evalúa escenario conservador, medio y agresivo.</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              En Chile 2025, hablar de "cuánto cuesta un lead en Google o Meta" sin contexto es un error. Los costos varían por industria, región y ticket promedio.
            </p>

            <p className="text-gray-700 mb-4">
              Un retail en Santiago no puede compararse con un SaaS B2B en Concepción, ni una inmobiliaria en Temuco con una clínica en Las Condes.
            </p>

            <p className="text-gray-700 mb-6">
              👉 La clave está en medir, comparar y ajustar con datos propios y benchmarks locales.
            </p>

            <p className="text-gray-700 mb-6">
              En M&amp;P diseñamos presupuestos publicitarios con lógica ingenieril, ajustados a cada rubro y región, para maximizar retorno y reducir CAC.
            </p>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres conocer los benchmarks exactos de tu industria?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos datos reales de tu rubro y región.
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
