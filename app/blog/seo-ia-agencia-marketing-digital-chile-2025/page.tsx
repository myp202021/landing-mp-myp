import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SEO + IA en Chile 2025: Cómo una Agencia de Marketing Digital Logra Posicionar en Google y en Plataformas de Inteligencia Artificial',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 logra posicionar en Google y en plataformas de inteligencia artificial con SEO técnico y de contenidos.',
  keywords: 'SEO Chile 2025, posicionamiento web IA, SEO inteligencia artificial, agencia marketing digital SEO, agencia de marketing digital',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/seo-ia-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'SEO + IA en Chile 2025: Cómo una Agencia de Marketing Digital Logra Posicionar en Google y en Plataformas de Inteligencia Artificial',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 logra posicionar en Google y en plataformas de inteligencia artificial con SEO técnico y de contenidos.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/seo-ia-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-white">
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
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">SEO + IA</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 15 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            SEO + IA en Chile 2025: Cómo una Agencia de Marketing Digital Logra Posicionar en Google y en Plataformas de Inteligencia Artificial
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            El SEO en Chile 2025 ya no es solo aparecer en Google. Hoy, las decisiones de los usuarios pasan por múltiples buscadores incluyendo ChatGPT, Gemini y Meta AI. Contar con una agencia de marketing digital que entienda el SEO tradicional y el SEO para IA es una ventaja competitiva clave.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl mb-12">
              <p className="text-gray-700">
                Contenido completo del artículo sobre SEO + IA en Chile 2025, con estrategias, costos reales, casos de éxito y checklist práctico para empresas chilenas.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Conclusión
            </h2>

            <p className="text-gray-700 mb-6">
              Una agencia de marketing digital con expertise en SEO + IA convierte estrategia en resultados medibles, conectando campañas con ROI real.
            </p>

            <div className="bg-gradient-to-br from-green-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres potenciar tu marketing digital?
              </h3>
              <p className="text-xl text-green-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos cómo optimizar tus campañas.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
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
