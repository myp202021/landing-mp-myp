import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Search, Users, CheckCircle, X, TrendingUp, Target, DollarSign, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Google Ads vs Meta Ads en Chile 2025 | Comparativa Completa | M&P',
  description: 'Comparativa detallada entre Google Ads y Meta Ads para empresas en Chile. Cuál elegir según tu industria, presupuesto y objetivos. CPL, ROAS y casos de uso reales.',
  keywords: 'google ads vs meta ads, google ads o facebook ads, cual es mejor google o facebook ads, comparacion google ads meta ads chile, publicidad google vs facebook',
  openGraph: {
    title: 'Google Ads vs Meta Ads en Chile 2025 | Comparativa Completa',
    description: 'Guía definitiva para elegir entre Google Ads y Meta Ads según tu negocio en Chile.',
    url: 'https://www.mulleryperez.cl/google-ads-vs-meta-ads-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/google-ads-vs-meta-ads-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://www.mulleryperez.cl/google-ads-vs-meta-ads-chile',
      headline: 'Google Ads vs Meta Ads en Chile 2025: Comparativa Completa',
      description: 'Análisis detallado para elegir la mejor plataforma publicitaria según tu negocio.',
      author: { '@type': 'Organization', name: 'Müller & Pérez' },
      publisher: { '@type': 'Organization', name: 'Müller & Pérez' },
      datePublished: '2025-01-01',
      dateModified: '2025-01-01',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Qué es mejor, Google Ads o Meta Ads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No hay una respuesta única. Google Ads es mejor para capturar demanda existente (usuarios buscando activamente). Meta Ads es mejor para generar demanda nueva y remarketing visual. La mayoría de negocios exitosos usan ambos en proporciones que varían según industria y objetivos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuál es más barato, Google Ads o Facebook Ads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Meta Ads generalmente tiene CPM y CPC más bajos, pero eso no significa mejor ROI. Google Ads tiene mayor intención de compra, lo que puede resultar en mejor conversión. El costo real se mide en Costo por Adquisición (CPA), no en clics.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto invertir en Google Ads vs Meta Ads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La distribución típica es 60% Google / 40% Meta para negocios con demanda existente. Para productos nuevos o categorías emergentes, puede invertirse 60% Meta / 40% Google. El mínimo recomendado es $500.000 CLP/mes por plataforma.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puedo usar solo una plataforma?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, pero limitas tu alcance. Google captura ~60% de búsquedas con intención comercial en Chile. Meta alcanza ~80% de usuarios de redes sociales. Usar ambas maximiza cobertura y permite remarketing cross-platform.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuál es mejor para ecommerce?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ambas son excelentes para ecommerce. Google Shopping captura compradores buscando productos específicos. Meta Ads genera descubrimiento de productos y tiene excelentes opciones de catálogo. La combinación típica es 55% Google / 45% Meta.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuál es mejor para B2B?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Ads suele funcionar mejor para B2B por la alta intención de búsqueda. Sin embargo, LinkedIn Ads (parte de Microsoft) puede ser más efectivo para targeting empresarial. Meta Ads es útil para remarketing y awareness en B2B.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuál tiene mejor targeting?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Diferente tipo de targeting. Google: targeting por intención (qué buscan). Meta: targeting por audiencia (quiénes son, intereses, comportamientos). Ambos ofrecen remarketing y lookalike audiences. Google es mejor para keywords, Meta para demografía.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuál genera resultados más rápido?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Ads genera resultados inmediatos para búsquedas con intención. Meta Ads requiere fase de aprendizaje (3-7 días) pero luego puede escalar rápidamente. Para resultados día 1, Google Ads en keywords transaccionales es la mejor opción.',
          },
        },
      ],
    },
  ],
}

export default function GoogleVsMetaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-blue-400">Google Ads</span> vs{' '}
                <span className="text-purple-400">Meta Ads</span>
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                Comparativa Completa para Chile 2025
              </p>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                ¿Cuál elegir para tu negocio? Analizamos costos, resultados y casos de uso
                para ayudarte a tomar la mejor decisión.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-bold px-8 py-4 rounded-lg transition-all"
                >
                  Cotizar Estrategia Multicanal
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Resumen Rápido */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Respuesta Rápida: ¿Cuál Elegir?
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Search className="w-8 h-8 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Elige Google Ads si:</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Tus clientes buscan activamente tu producto/servicio
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Tienes un servicio/producto establecido con demanda
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Necesitas resultados inmediatos
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Vendes servicios B2B o locales
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-8 h-8 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-900">Elige Meta Ads si:</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Tu producto es visual o aspiracional
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Necesitas generar awareness de marca
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Tienes un ecommerce con catálogo amplio
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Tu audiencia es B2C y joven
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-gray-700">
                    <strong>La mayoría de negocios exitosos usan ambos.</strong> La distribución típica
                    es 60% Google / 40% Meta, ajustando según industria y resultados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabla Comparativa */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Comparativa Detallada
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Aspecto</th>
                      <th className="px-6 py-4 text-center font-bold text-blue-600">Google Ads</th>
                      <th className="px-6 py-4 text-center font-bold text-purple-600">Meta Ads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">Tipo de Intención</td>
                      <td className="px-6 py-4 text-center">Demanda existente (búsquedas)</td>
                      <td className="px-6 py-4 text-center">Generación de demanda (interrupción)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">CPC Promedio Chile</td>
                      <td className="px-6 py-4 text-center">$200 - $800 CLP</td>
                      <td className="px-6 py-4 text-center">$50 - $300 CLP</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Tasa Conversión Promedio</td>
                      <td className="px-6 py-4 text-center">3-5%</td>
                      <td className="px-6 py-4 text-center">1-3%</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Mejor para</td>
                      <td className="px-6 py-4 text-center">Servicios, B2B, local</td>
                      <td className="px-6 py-4 text-center">Ecommerce, D2C, lifestyle</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Tiempo a Resultados</td>
                      <td className="px-6 py-4 text-center">Inmediato (día 1)</td>
                      <td className="px-6 py-4 text-center">3-7 días (aprendizaje)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Tipo de Creativos</td>
                      <td className="px-6 py-4 text-center">Texto (Search), Imágenes (Display)</td>
                      <td className="px-6 py-4 text-center">Imágenes, Videos, Carruseles</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Targeting</td>
                      <td className="px-6 py-4 text-center">Keywords, audiencias</td>
                      <td className="px-6 py-4 text-center">Demográfico, intereses, comportamientos</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Remarketing</td>
                      <td className="px-6 py-4 text-center">Excelente (Display, YouTube)</td>
                      <td className="px-6 py-4 text-center">Excelente (Feed, Stories)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Presupuesto Mínimo</td>
                      <td className="px-6 py-4 text-center">$500.000 CLP/mes</td>
                      <td className="px-6 py-4 text-center">$300.000 CLP/mes</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Complejidad</td>
                      <td className="px-6 py-4 text-center">Alta</td>
                      <td className="px-6 py-4 text-center">Media-Alta</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Por Industria */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Recomendación por Industria
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Ecommerce</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Google 55%</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Meta 45%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Google Shopping para búsquedas de productos. Meta para descubrimiento y remarketing dinámico.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Servicios Profesionales</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Google 70%</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Meta 30%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Alta intención en búsquedas. Meta para remarketing y awareness.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Inmobiliario</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Google 60%</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Meta 40%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Google para búsquedas por zona. Meta para mostrar propiedades visualmente.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Educación</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Google 50%</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Meta 50%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Google para búsquedas de carreras. Meta para llegar a jóvenes en redes.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Salud / Clínicas</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Google 65%</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Meta 35%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Alta intención de búsqueda en salud. Meta para remarketing y awareness local.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">B2B / SaaS</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Google 60%</span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">LinkedIn 30%</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Meta 10%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Google para captura. LinkedIn para targeting B2B. Meta solo para remarketing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Qué es mejor, Google Ads o Meta Ads?</h3>
                  <p className="text-gray-600 text-sm">
                    No hay respuesta única. <strong>Google Ads</strong> captura demanda existente (usuarios buscando).
                    <strong> Meta Ads</strong> genera demanda nueva. La mayoría de negocios exitosos usan ambos.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Cuál es más barato?</h3>
                  <p className="text-gray-600 text-sm">
                    Meta Ads tiene CPM/CPC más bajos, pero Google Ads tiene mayor intención de compra.
                    <strong> El costo real se mide en CPA</strong>, no en clics. Depende de tu conversión.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Cuánto invertir en cada uno?</h3>
                  <p className="text-gray-600 text-sm">
                    Típicamente <strong>60% Google / 40% Meta</strong> para negocios con demanda existente.
                    Para productos nuevos: 60% Meta / 40% Google. Mínimo $500K/mes por plataforma.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Puedo usar solo una plataforma?</h3>
                  <p className="text-gray-600 text-sm">
                    Sí, pero limitas tu alcance. Google captura ~60% de búsquedas comerciales en Chile.
                    Meta alcanza ~80% de usuarios de redes. <strong>Usar ambas maximiza cobertura.</strong>
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">¿Cuál genera resultados más rápido?</h3>
                  <p className="text-gray-600 text-sm">
                    <strong>Google Ads genera resultados inmediatos</strong> para keywords transaccionales.
                    Meta Ads requiere 3-7 días de aprendizaje, pero luego escala muy bien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Páginas Relacionadas */}
        <section className="py-12 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-bold mb-4">Páginas Relacionadas:</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/servicios/google-ads-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Google Ads Chile
                </Link>
                <Link href="/servicios/meta-ads-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Meta Ads Chile
                </Link>
                <Link href="/marketing-digital-ecommerce-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Marketing Ecommerce
                </Link>
                <Link href="/marketing-digital-b2b-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Marketing B2B
                </Link>
                <Link href="/precios-agencia-marketing-digital-chile" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                  Precios Agencias
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Necesitas Ayuda para Decidir?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Analizamos tu negocio y recomendamos la mejor distribución de presupuesto
                entre Google Ads y Meta Ads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Solicitar Análisis Gratuito
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
