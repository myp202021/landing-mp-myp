import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing en Educación en Chile 2025: Cómo una Agencia de Marketing Digital Atrae Alumnos y Optimiza CAC',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 atrae alumnos para colegios, universidades y e-learning con estrategias multicanal y reportería CAC.',
  keywords: 'agencia de marketing digital, Marketing Educación, marketing digital Chile 2025',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/marketing-educacion-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Marketing en Educación en Chile 2025: Cómo una Agencia de Marketing Digital Atrae Alumnos y Optimiza CAC',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 atrae alumnos para colegios, universidades y e-learning con estrategias multicanal y reportería CAC.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/marketing-educacion-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-white">
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
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">Marketing Educación</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 14 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Marketing en Educación en Chile 2025: Cómo una Agencia de Marketing Digital Atrae Alumnos y Optimiza CAC
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            En Chile 2025, una agencia de marketing digital especializada transforma Marketing Educación en resultados medibles con estrategias basadas en datos y performance real.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700">
                Contenido estratégico sobre Marketing Educación en Chile 2025, incluyendo costos reales, estrategias comprobadas, casos de éxito locales y reportería financiera clara.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Por qué es clave en Chile 2025</h2>
            
            <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Estrategia basada en datos y performance real</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Optimización continua con IA y automatización</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Reportería financiera clara con CAC, LTV y ROI</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define objetivos y KPIs financieros desde el inicio</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Implementa tracking avanzado y modelos de atribución</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Mide CAC, LTV, ROI y Payback en tiempo real</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-6">
              En 2025, Marketing Educación en Chile requiere una agencia de marketing digital que combine estrategia, datos y tecnología para generar resultados medibles y escalables.
            </p>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres optimizar tu Marketing Educación?
              </h3>
              <p className="text-xl text-indigo-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos cómo generar resultados medibles.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
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
