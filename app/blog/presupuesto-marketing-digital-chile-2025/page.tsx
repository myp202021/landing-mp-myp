import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, DollarSign, TrendingUp, Target, CheckCircle, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cómo Planificar el Presupuesto de Marketing Digital en Chile 2025',
  description: 'Aprende a planificar el presupuesto de marketing digital en Chile 2025 con escenarios conservador, medio y agresivo, y benchmarks locales.',
  keywords: 'presupuesto marketing digital Chile, inversión marketing digital Chile, CAC, ROI campañas digitales, Google Ads Chile, Meta Ads Chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/presupuesto-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Cómo Planificar el Presupuesto de Marketing Digital en Chile 2025',
    description: 'Aprende a planificar el presupuesto de marketing digital en Chile 2025 con escenarios conservador, medio y agresivo, y benchmarks locales.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/presupuesto-marketing-digital-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
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
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">Presupuesto</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 16 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Cómo Planificar el Presupuesto de Marketing Digital en Chile 2025
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Un presupuesto bien planificado puede marcar la diferencia entre crecer o estancarse. Descubre cómo estructurarlo con lógica ingenieril y benchmarks locales.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En Chile muchas empresas todavía definen su presupuesto digital de forma intuitiva: "pongamos un monto y probemos". El problema es que el marketing digital ya no admite improvisación.
              </p>
              <p className="text-gray-700 mb-4">
                Con la alta competencia en Google, Meta, LinkedIn y TikTok, un presupuesto mal diseñado significa perder oportunidades, pagar CPL excesivos y, peor aún, no poder justificar la inversión frente al directorio.
              </p>
              <p className="text-gray-700">
                En M&P hemos acompañado a decenas de empresas en Chile y sabemos que un presupuesto bien planificado puede marcar la diferencia entre crecer o estancarse. En este artículo te mostramos cómo estructurarlo con lógica ingenieril, escenarios realistas y benchmarks locales.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              Las bases de un presupuesto sólido
            </h2>

            <p className="text-gray-700 mb-4">
              Antes de hablar de números, hay que definir las condiciones iniciales:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">✅ Objetivos de negocio:</h3>
                <p className="text-gray-700 text-sm">Leads, ventas, awareness, share of voice.</p>
              </div>
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">✅ Ticket promedio y margen:</h3>
                <p className="text-gray-700 text-sm">Cuánto deja cada venta y cuánto se puede reinvertir.</p>
              </div>
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">✅ Ciclo de venta:</h3>
                <p className="text-gray-700 text-sm">Corto (retail), medio (servicios), largo (inmobiliario, B2B).</p>
              </div>
              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">✅ Competencia y saturación:</h3>
                <p className="text-gray-700 text-sm">En qué plataformas invierte tu rubro.</p>
              </div>
              <div className="bg-white border-2 border-pink-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">✅ Benchmarks locales:</h3>
                <p className="text-gray-700 text-sm">CPL, CTR y CPC promedio en tu industria en Chile.</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">Error común:</p>
              <p className="text-gray-700">
                Asignar el presupuesto como un porcentaje arbitrario de ventas sin considerar variables críticas.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-600" />
              Escenarios de inversión típicos en Chile
            </h2>

            <p className="text-gray-700 mb-6">
              Para guiar la decisión, en M&P usamos escenarios de tres niveles: conservador, medio y agresivo.
            </p>

            <div className="space-y-6 mb-12">
              <div className="bg-white border-l-4 border-blue-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Escenario conservador (desde $200.000 CLP por canal)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Ideal para pruebas iniciales o empresas con tickets bajos.</li>
                  <li>Canales prioritarios: Google Search y Meta conversiones.</li>
                  <li>Esperable: leads de menor volumen pero con CPL aceptable.</li>
                </ul>
              </div>

              <div className="bg-white border-l-4 border-green-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Escenario medio ($700.000 – $1.500.000 CLP por canal)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Balance entre alcance y performance.</li>
                  <li>Permite incluir remarketing y awareness.</li>
                  <li>Ejemplo: SaaS B2B que destina $1.000.000 CLP a Google + $800.000 CLP a Meta.</li>
                </ul>
              </div>

              <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Escenario agresivo (+$2.000.000 CLP por canal)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Para empresas que buscan share of voice y posicionamiento de marca.</li>
                  <li>Permite campañas omnicanales (Google, Meta, LinkedIn, TikTok, YouTube).</li>
                  <li>Incluye pruebas con IA, creatividades dinámicas y optimización continua.</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-purple-600" />
              Cómo distribuir el presupuesto por canal
            </h2>

            <p className="text-gray-700 mb-4">
              En base a benchmarks chilenos, una distribución eficiente suele verse así:
            </p>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Distribución recomendada por canal</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span className="font-semibold">Google Ads (Search / PMax):</span>
                  <span className="text-2xl font-bold">40%</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span className="font-semibold">Meta Ads (FB/IG):</span>
                  <span className="text-2xl font-bold">35%</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span className="font-semibold">LinkedIn Ads (B2B ticket alto):</span>
                  <span className="text-2xl font-bold">15%</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span className="font-semibold">TikTok/YouTube:</span>
                  <span className="text-2xl font-bold">10%</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">Regla M&P:</p>
              <p className="text-gray-700">
                Google y Meta siguen siendo los pilares, pero cada año aumenta la participación de TikTok y LinkedIn en Chile.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              KPI que guían la planificación
            </h2>

            <p className="text-gray-700 mb-4">
              Planificar presupuesto no se trata de repartir dinero, sino de proyectar KPI de negocio:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">✅ CAC</p>
                <p className="text-gray-700 text-sm">Costo de Adquisición de Cliente.</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">✅ LTV</p>
                <p className="text-gray-700 text-sm">Valor del Cliente en el Tiempo.</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">✅ ROAS</p>
                <p className="text-gray-700 text-sm">Retorno de la Inversión en Publicidad.</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">✅ Payback Period</p>
                <p className="text-gray-700 text-sm">Tiempo en recuperar inversión.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ejemplo inmobiliario en Temuco</h3>
              <ul className="space-y-2">
                <li>• Inversión mensual: $3.000.000 CLP.</li>
                <li>• CPL promedio: $15.000 CLP.</li>
                <li>• Leads generados: 200.</li>
                <li>• Conversión a venta: 3%.</li>
                <li>• Ventas: 6 unidades (ticket 2.000 UF).</li>
              </ul>
              <p className="text-xl font-bold mt-4">Resultado: ROAS altamente positivo, aún con CPL elevado.</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para presupuestar con ingeniería
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define ticket promedio, margen y ciclo de venta.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Establece objetivos medibles (CAC, ROI, LTV).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Elige escenarios de inversión (conservador, medio, agresivo).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Asigna % por canal según industria.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Proyecta KPI en cada escenario.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Ajusta mensualmente con reportería real.</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              En 2025, planificar el presupuesto digital en Chile no es una tarea opcional: es la base para competir en un mercado donde cada clic cuesta más.
            </p>

            <p className="text-gray-700 mb-6">
              Un presupuesto sólido no solo permite optimizar campañas, sino también respaldar decisiones ante directorios y gerencias con datos duros. En M&P ayudamos a empresas de todos los tamaños a construir planes con lógica ingenieril, proyectando CAC, LTV y ROI antes de invertir.
            </p>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres saber cuál es el presupuesto óptimo para tu rubro?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Conversemos. Podemos simular escenarios y armar el mix de inversión más eficiente para tu empresa.
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
