import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, BarChart3, Target, CheckCircle, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos)',
  description: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos). Guía completa con ejemplos reales, datos de Chile 2025 y estrategias prácticas.',
  keywords: 'que es cac, costo adquisicion cliente, como reducir cac',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/que-es-cac-como-calcularlo-reducirlo'
  },
  openGraph: {
    title: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos)',
    description: 'Guía completa con ejemplos reales y datos de Chile 2025.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/que-es-cac-como-calcularlo-reducirlo',
    publishedTime: '2025-10-08T20:08:06.152Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
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
            <p className="text-gray-500 mt-4">8 de octubre de 2025 · 12 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos)
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            [DESCRIPCIÓN INTRODUCTORIA - COMPLETAR AQUÍ]
          </p>

          <div className="prose prose-lg max-w-none">
            {/* INTRO */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                📌 Lo que aprenderás en este artículo
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>[PUNTO CLAVE 1]</li>
                <li>[PUNTO CLAVE 2]</li>
                <li>[PUNTO CLAVE 3]</li>
                <li>[PUNTO CLAVE 4]</li>
              </ul>
            </div>

            {/* SECCIÓN 1 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              [TÍTULO SECCIÓN 1]
            </h2>

            <p className="text-gray-700 mb-6">
              [CONTENIDO SECCIÓN 1 - COMPLETAR AQUÍ]
            </p>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Ejemplo Real Chile 2025</h3>
              <p className="text-gray-700 mb-4">
                [CASO DE ÉXITO O EJEMPLO - COMPLETAR AQUÍ]
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Resultados:</strong> [MÉTRICAS - COMPLETAR AQUÍ]
                </p>
              </div>
            </div>

            {/* SECCIÓN 2 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              [TÍTULO SECCIÓN 2]
            </h2>

            <p className="text-gray-700 mb-6">
              [CONTENIDO SECCIÓN 2 - COMPLETAR AQUÍ]
            </p>

            {/* SECCIÓN 3 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-600" />
              [TÍTULO SECCIÓN 3]
            </h2>

            <p className="text-gray-700 mb-6">
              [CONTENIDO SECCIÓN 3 - COMPLETAR AQUÍ]
            </p>

            {/* CONCLUSIÓN */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              🎯 Conclusión
            </h2>

            <p className="text-gray-700 mb-6">
              [CONCLUSIÓN - RESUMEN DE PUNTOS CLAVE]
            </p>

            {/* CTA FINAL */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Necesitas Ayuda con tu Estrategia?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                En M&P optimizamos campañas basadas en datos reales y resultados medibles.
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
