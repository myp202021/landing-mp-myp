import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Play, Instagram, Music2, Users, DollarSign, Target, TrendingUp, BarChart3, CheckCircle, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'TikTok Ads vs Instagram Reels Chile 2025: ¿Cuál Elegir para tu Marca?',
  description: 'Comparativa completa entre TikTok Ads e Instagram Reels para el mercado chileno. CPM, audiencias, formatos y cuándo usar cada plataforma.',
  keywords: 'TikTok Ads Chile, Instagram Reels Chile, publicidad TikTok, publicidad Instagram, video marketing Chile 2025',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/tiktok-ads-vs-instagram-reels-chile-2025'
  },
  openGraph: {
    title: 'TikTok Ads vs Instagram Reels Chile 2025: ¿Cuál Elegir?',
    description: 'Comparativa completa entre TikTok Ads e Instagram Reels para el mercado chileno.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/tiktok-ads-vs-instagram-reels-chile-2025',
    publishedTime: '2025-01-15T00:00:00.000Z'
  }
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'TikTok Ads vs Instagram Reels Chile 2025: ¿Cuál Elegir para tu Marca?',
  description: 'Comparativa completa entre TikTok Ads e Instagram Reels para el mercado chileno. CPM, audiencias, formatos y cuándo usar cada plataforma.',
  url: 'https://www.mulleryperez.cl/blog/tiktok-ads-vs-instagram-reels-chile-2025',
  datePublished: '2025-01-15T00:00:00.000Z',
  dateModified: '2025-01-15T00:00:00.000Z',
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
    '@id': 'https://www.mulleryperez.cl/blog/tiktok-ads-vs-instagram-reels-chile-2025'
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
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold">Video Marketing</span>
            <p className="text-gray-500 mt-4">15 de enero de 2025 · 14 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            TikTok Ads vs Instagram Reels Chile 2025: ¿Cuál Elegir para tu Marca?
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            El video corto domina el marketing digital en Chile. Pero entre TikTok e Instagram Reels, ¿cuál es mejor para tu negocio? Aquí tienes la respuesta basada en datos reales.
          </p>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="w-6 h-6 text-pink-600" /> El Boom del Video Corto en Chile
              </h3>
              <p className="text-gray-700 mb-4">
                En 2025, el 67% de los chilenos consume contenido de video corto diariamente. TikTok llegó a <strong>8 millones de usuarios</strong> en Chile, mientras que Instagram mantiene <strong>12 millones de usuarios activos</strong>.
              </p>
              <p className="text-gray-700">
                Ambas plataformas son relevantes, pero tienen audiencias, costos y comportamientos muy diferentes. La elección correcta puede significar un 40% de diferencia en tu ROI.
              </p>
            </div>

            {/* Tabla Comparativa */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Comparativa: Números Reales Chile 2025
            </h2>

            <div className="overflow-x-auto my-8">
              <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-left font-bold text-gray-900">Métrica</th>
                    <th className="p-4 text-center font-bold text-gray-900">
                      <span className="inline-flex items-center gap-2">
                        <Music2 className="w-5 h-5" /> TikTok
                      </span>
                    </th>
                    <th className="p-4 text-center font-bold text-gray-900">
                      <span className="inline-flex items-center gap-2">
                        <Instagram className="w-5 h-5" /> Instagram
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="p-4 text-gray-700">Usuarios Chile</td>
                    <td className="p-4 text-center font-semibold">8 millones</td>
                    <td className="p-4 text-center font-semibold">12 millones</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td className="p-4 text-gray-700">Edad predominante</td>
                    <td className="p-4 text-center">16-30 años</td>
                    <td className="p-4 text-center">25-45 años</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-4 text-gray-700">CPM promedio</td>
                    <td className="p-4 text-center font-semibold text-green-600">$1.500 - $3.500</td>
                    <td className="p-4 text-center font-semibold text-orange-600">$4.000 - $8.000</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td className="p-4 text-gray-700">CPC promedio</td>
                    <td className="p-4 text-center font-semibold text-green-600">$80 - $200</td>
                    <td className="p-4 text-center font-semibold text-orange-600">$150 - $400</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-4 text-gray-700">Engagement rate</td>
                    <td className="p-4 text-center font-semibold text-green-600">5-9%</td>
                    <td className="p-4 text-center">2-4%</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50">
                    <td className="p-4 text-gray-700">Tiempo promedio sesión</td>
                    <td className="p-4 text-center font-semibold text-green-600">52 min</td>
                    <td className="p-4 text-center">28 min</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-4 text-gray-700">Conversión e-commerce</td>
                    <td className="p-4 text-center">1.5-3%</td>
                    <td className="p-4 text-center font-semibold text-green-600">2-4%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sección TikTok */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Music2 className="w-8 h-8 text-black" />
              Cuándo Elegir TikTok Ads
            </h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white p-6 rounded-2xl border border-green-200">
                <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> TikTok es ideal si...
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Tu audiencia tiene entre 16-35 años
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Vendes productos de impulso (moda, belleza, tech)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Buscas awareness y viralidad
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Tienes presupuesto limitado (CPM más bajo)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Puedes crear contenido nativo y auténtico
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-red-200">
                <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Evita TikTok si...
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Tu audiencia es +45 años
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Vendes servicios B2B de alto ticket
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    No puedes adaptar tu contenido al formato
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Necesitas conversiones inmediatas
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Tu marca es muy formal/corporativa
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-black text-white p-6 rounded-2xl my-8">
              <h4 className="font-bold mb-4">Caso Real: E-commerce de Moda en Chile</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-black text-pink-400">$1.800</p>
                  <p className="text-gray-400 text-sm">CPM promedio</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-pink-400">8.2%</p>
                  <p className="text-gray-400 text-sm">Engagement rate</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-pink-400">4.2x</p>
                  <p className="text-gray-400 text-sm">ROAS logrado</p>
                </div>
              </div>
            </div>

            {/* Sección Instagram */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Instagram className="w-8 h-8 text-pink-600" />
              Cuándo Elegir Instagram Reels
            </h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white p-6 rounded-2xl border border-green-200">
                <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Instagram es ideal si...
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Tu audiencia tiene entre 25-50 años
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Ya tienes presencia en Meta (Facebook/IG)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Buscas conversiones directas
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Vendes servicios o productos premium
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    Necesitas retargeting avanzado
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-red-200">
                <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Evita Instagram si...
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Tu presupuesto es muy limitado
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Buscas solo awareness masivo
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Tu audiencia es menor de 20 años
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    No tienes contenido de calidad
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    Quieres viralidad orgánica
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl my-8">
              <h4 className="font-bold mb-4">Caso Real: Clínica Dental Santiago</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-black">$45.000</p>
                  <p className="text-purple-200 text-sm">Costo por lead</p>
                </div>
                <div>
                  <p className="text-3xl font-black">3.8%</p>
                  <p className="text-purple-200 text-sm">Tasa de conversión</p>
                </div>
                <div>
                  <p className="text-3xl font-black">6.5x</p>
                  <p className="text-purple-200 text-sm">ROAS logrado</p>
                </div>
              </div>
            </div>

            {/* Estrategia Combinada */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              La Estrategia Ganadora: Usar Ambas
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 my-8">
              <p className="text-gray-700 mb-6">
                En M&P recomendamos una estrategia combinada para maximizar resultados:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-bold text-gray-900">TikTok para Awareness</h4>
                    <p className="text-gray-600">Usa TikTok para generar awareness y alcance masivo a bajo costo. El contenido viral aquí construye marca.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Instagram para Conversión</h4>
                    <p className="text-gray-600">Retargetea a quienes vieron tu contenido en TikTok con anuncios de conversión en Instagram.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Contenido Cross-Platform</h4>
                    <p className="text-gray-600">Adapta el mismo contenido a ambas plataformas, pero con ajustes de tono y formato.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribución de Presupuesto */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Distribución de Presupuesto Recomendada
            </h2>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center">
                <h4 className="font-bold text-gray-900 mb-4">E-commerce Joven</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">TikTok</span>
                    <span className="font-bold text-pink-600">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-gray-600">Instagram</span>
                    <span className="font-bold text-purple-600">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center">
                <h4 className="font-bold text-gray-900 mb-4">Servicios B2C</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">TikTok</span>
                    <span className="font-bold text-pink-600">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-gray-600">Instagram</span>
                    <span className="font-bold text-purple-600">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center">
                <h4 className="font-bold text-gray-900 mb-4">B2B / Premium</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">TikTok</span>
                    <span className="font-bold text-pink-600">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-gray-600">Instagram</span>
                    <span className="font-bold text-purple-600">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusión */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-8 rounded-2xl my-12">
              <h3 className="text-2xl font-bold mb-4">Conclusión</h3>
              <p className="mb-4">
                No existe una respuesta única. TikTok e Instagram Reels son complementarios, no competidores. La clave está en entender tu audiencia, tus objetivos y tu capacidad de crear contenido para cada plataforma.
              </p>
              <p className="mb-6">
                En M&P gestionamos campañas en ambas plataformas con una estrategia unificada. Si quieres saber cuál es la mejor distribución para tu negocio, te hacemos un análisis gratuito.
              </p>
              <Link
                href="/labs/comparador-plataformas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Comparar Plataformas para tu Industria <TrendingUp className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </div>
      </article>

      {/* CTA Final */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿TikTok, Instagram o ambos?</h2>
          <p className="text-gray-300 mb-8">
            Analizamos tu caso específico y te decimos exactamente dónde invertir para maximizar tu ROI.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Agendar Análisis Gratis
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
