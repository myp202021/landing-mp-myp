import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Play, Target, DollarSign, TrendingUp, CheckCircle, Smartphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'TikTok Ads en Chile 2025: Cómo una Agencia de Marketing Digital Transforma Creatividad en Performance',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 transforma TikTok Ads en performance real. Costos, formatos, estrategias y casos locales.',
  keywords: 'TikTok Ads Chile, publicidad en TikTok, costos TikTok Ads, agencia marketing digital performance, agencia de marketing digital',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/tiktok-ads-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'TikTok Ads en Chile 2025: Cómo una Agencia de Marketing Digital Transforma Creatividad en Performance',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 transforma TikTok Ads en performance real. Costos, formatos, estrategias y casos locales.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/tiktok-ads-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-white">
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
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold">TikTok Ads</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 14 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            TikTok Ads en Chile 2025: Cómo una Agencia de Marketing Digital Transforma Creatividad en Performance
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            TikTok pasó de ser una red de entretenimiento juvenil a convertirse en la plataforma con mayor crecimiento en inversión publicitaria en Chile 2025.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-pink-50 border-l-4 border-pink-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                TikTok pasó de ser una red de entretenimiento juvenil a convertirse en la plataforma con mayor crecimiento en inversión publicitaria en Chile 2025. Su algoritmo basado en intereses y comportamiento de consumo lo hace ideal no solo para awareness, sino también para performance.
              </p>
              <p className="text-gray-700">
                El gran error de muchas empresas es pensar que TikTok es solo "baile y humor". En realidad, bien gestionado, puede generar ventas con costos por lead más bajos que Meta o Google en ciertos rubros.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-pink-600" />
              Por qué TikTok Ads es clave en Chile 2025
            </h2>

            <div className="bg-white border-2 border-pink-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">•</span>
                  <span><strong>Crecimiento:</strong> incremento de inversión superior a 60% año a año</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">•</span>
                  <span><strong>Segmentación:</strong> intereses, audiencias lookalike, comportamiento in-app</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">•</span>
                  <span><strong>Engagement:</strong> CTR promedio superior al de Meta Ads en awareness</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">•</span>
                  <span><strong>Creatividad data-driven:</strong> testear múltiples formatos cortos</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Costos reales de TikTok Ads en Chile 2025
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">CPM promedio</h3>
                <p className="text-3xl font-black text-green-600 mb-2">$1.800 - $3.500</p>
                <p className="text-gray-600">CLP por mil impresiones</p>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">CPC promedio</h3>
                <p className="text-3xl font-black text-blue-600 mb-2">$200 - $450</p>
                <p className="text-gray-600">CLP por clic</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">CPL promedio</h3>
                <p className="text-3xl font-black text-purple-600 mb-2">$5.000 - $18.000</p>
                <p className="text-gray-600">CLP según rubro</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-600 to-purple-700 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ventaja competitiva</h3>
              <p className="text-xl">En muchos casos, los CPL en TikTok son 20-30% más bajos que en Meta Ads, lo que lo convierte en un canal atractivo para performance.</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Play className="w-8 h-8 text-purple-600" />
              Formatos de TikTok Ads
            </h2>

            <div className="space-y-6 mb-12">
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">In-Feed Ads</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Aparecen en el feed "Para ti"</li>
                  <li>Similares a un post orgánico</li>
                  <li>Recomendados para performance directo</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Top View</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Primer anuncio al abrir la app</li>
                  <li>Altísimo awareness</li>
                  <li>Costoso, ideal para lanzamientos masivos</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Spark Ads</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Promociona contenido de creadores o de la marca</li>
                  <li>Excelente para credibilidad y social proof</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Collection Ads</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Integración con catálogos de productos</li>
                  <li>Ideal para e-commerce</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Estrategia de funnel en TikTok Ads
            </h2>

            <div className="space-y-6 mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Etapa 1 – Awareness</h3>
                <ul className="space-y-2">
                  <li>• <strong>Objetivo:</strong> alcance masivo</li>
                  <li>• <strong>Formato:</strong> Top View + In-Feed</li>
                  <li>• <strong>Métrica clave:</strong> CPM y vistas de video</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Etapa 2 – Consideración</h3>
                <ul className="space-y-2">
                  <li>• <strong>Objetivo:</strong> tráfico y engagement</li>
                  <li>• <strong>Formato:</strong> In-Feed + Spark Ads</li>
                  <li>• <strong>Métrica clave:</strong> CTR y tiempo de visualización</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Etapa 3 – Conversión</h3>
                <ul className="space-y-2">
                  <li>• <strong>Objetivo:</strong> leads y ventas</li>
                  <li>• <strong>Formato:</strong> Collection Ads</li>
                  <li>• <strong>Métrica clave:</strong> CPL y ROAS</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Ejemplo práctico en Chile</h2>

            <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">E-commerce de ropa urbana en Santiago</h3>
              <ul className="space-y-2 mb-4">
                <li>• <strong>Presupuesto mensual:</strong> $3.000.000 CLP</li>
                <li>• <strong>CPM promedio:</strong> $2.000 CLP</li>
                <li>• <strong>CPL:</strong> $7.500 CLP (30% menor que en Meta)</li>
                <li>• <strong>Conversiones:</strong> 400 ventas en un mes</li>
              </ul>
              <p className="text-2xl font-bold">ROAS 4.8x gracias a creatividades con música en tendencia y Spark Ads con microinfluencers</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&amp;P para TikTok Ads
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define objetivos de funnel antes de lanzar</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa formatos distintos según etapa (In-Feed, Spark, Collection)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Testea mínimo 5-10 creatividades por campaña</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Integra TikTok Ads Manager con tu pixel y CRM</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Mide CPL, ROAS y CAC, no solo engagement</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              TikTok Ads en Chile 2025 dejó de ser una moda para transformarse en un canal estratégico de performance. Su bajo costo por lead y su capacidad de generar awareness masivo lo convierten en pieza clave para las marcas que buscan resultados medibles.
            </p>

            <p className="text-gray-700 mb-6">
              Eso sí, requiere de estrategia, datos y creatividad aplicada. Aquí es donde entra una agencia de marketing digital que pueda combinar contenido atractivo con optimización técnica y reportería clara.
            </p>

            <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres convertir TikTok en un canal de ventas real?
              </h3>
              <p className="text-xl text-pink-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos cómo transformar creatividad en performance.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-pink-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
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
