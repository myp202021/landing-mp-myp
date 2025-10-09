import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Activity, DollarSign, TrendingUp, BarChart3, CheckCircle, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Atribución y Métricas en Chile 2025: del CAC y LTV al Payback con Dashboards en Tiempo Real',
  description: 'Aprende cómo medir CAC, LTV y Payback en Chile 2025 con dashboards en tiempo real y modelos de atribución data-driven. Casos reales y benchmarks locales.',
  keywords: 'atribución marketing digital Chile, CAC marketing digital, LTV clientes Chile, payback campañas digitales, dashboards marketing Chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/atribucion-metricas-chile-2025'
  },
  openGraph: {
    title: 'Atribución y Métricas en Chile 2025: del CAC y LTV al Payback con Dashboards en Tiempo Real',
    description: 'Aprende cómo medir CAC, LTV y Payback en Chile 2025 con dashboards en tiempo real y modelos de atribución data-driven. Casos reales y benchmarks locales.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/atribucion-metricas-chile-2025',
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
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Métricas</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 17 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Atribución y Métricas en Chile 2025: del CAC y LTV al Payback con Dashboards en Tiempo Real
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Las métricas que realmente importan: CAC, LTV y Payback Period. Cómo medirlas con dashboards en tiempo real y modelos de atribución avanzados.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En Chile 2025, el marketing digital ya no se mide por likes ni impresiones. Las gerencias y directorios quieren saber con claridad:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>¿Cuánto cuesta realmente conseguir un cliente?</li>
                <li>¿Qué retorno genera cada peso invertido en publicidad digital?</li>
                <li>¿En cuánto tiempo recuperamos esa inversión?</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Para responder esas preguntas, es clave dominar tres métricas: CAC (Costo de Adquisición de Cliente), LTV (Valor del Cliente en el Tiempo) y Payback Period. Y lo más importante: conectarlas a dashboards en tiempo real que muestren resultados como si fueran estados financieros.
              </p>
              <p className="text-gray-700">
                En este artículo revisaremos cómo funcionan estas métricas en el contexto chileno, por qué son esenciales para asignar presupuesto, y cómo en M&amp;P usamos dashboards conectados a Google, Meta y CRM para tomar decisiones basadas en datos, no en percepciones.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              Las métricas que importan en 2025
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✅ CAC</h3>
                <p className="text-gray-700 mb-3 text-sm">(Costo de Adquisición de Cliente)</p>
                <p className="text-gray-700 mb-3 font-semibold">Fórmula:</p>
                <p className="text-gray-700 mb-3 text-sm">(Inversión en marketing + ventas) ÷ Nº de clientes adquiridos</p>
                <p className="text-gray-700 font-semibold">Ejemplo:</p>
                <p className="text-gray-700 text-sm">$5.000.000 invertidos ÷ 50 clientes = CAC $100.000 CLP</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✅ LTV</h3>
                <p className="text-gray-700 mb-3 text-sm">(Valor del Cliente en el Tiempo)</p>
                <p className="text-gray-700 mb-3 font-semibold">Fórmula:</p>
                <p className="text-gray-700 mb-3 text-sm">Ticket promedio × Nº de compras × Retención</p>
                <p className="text-gray-700 font-semibold">Ejemplo SaaS:</p>
                <p className="text-gray-700 text-sm">$500.000 anual × 3 años = LTV $1.500.000 CLP</p>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Payback Period</h3>
                <p className="text-gray-700 mb-3 text-sm">Tiempo en recuperar la inversión en marketing</p>
                <p className="text-gray-700 font-semibold mb-2">Ejemplo:</p>
                <p className="text-gray-700 text-sm mb-2">CAC $100.000</p>
                <p className="text-gray-700 text-sm mb-2">Margen mensual $50.000</p>
                <p className="text-gray-700 font-bold">→ payback = 2 meses</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">👉 Estas tres métricas juntas:</p>
              <p className="text-gray-700">
                Permiten saber si la inversión en marketing digital es rentable o no.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Eye className="w-8 h-8 text-orange-600" />
              ¿Por qué la atribución es un problema en Chile?
            </h2>

            <p className="text-gray-700 mb-4">
              En muchos directorios chilenos todavía se presentan reportes con métricas de vanidad: CTR, impresiones, clics.
            </p>

            <p className="text-gray-700 mb-4">
              El problema es que:
            </p>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>No se sabe qué canal realmente genera ventas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>No hay trazabilidad del journey del cliente.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Se subestima el rol de canales de awareness (TikTok, YouTube).</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">👉 Ejemplo común:</h3>
              <p className="mb-4">Un lead llega por Google Search, pero en realidad vio antes 3 anuncios en Instagram y un video en YouTube.</p>
              <p className="font-bold">Si atribuimos solo a Google, la lectura es parcial.</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              Modelos de atribución
            </h2>

            <p className="text-gray-700 mb-4">
              En 2025, los modelos más usados en Chile son:
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Modelo</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Last click</td>
                    <td className="px-6 py-4 text-sm text-gray-700">El más simple, pero engañoso (último clic)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">First click</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Útil para awareness, pero ignora conversiones intermedias (primer clic)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Lineal</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Distribuye valor en todos los puntos de contacto</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Time decay</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Pondera más los clics cercanos a la conversión</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Data-driven (IA)</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Asigna valor en base a machine learning</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">👉 En M&amp;P:</p>
              <p className="text-gray-700">
                Trabajamos con modelos híbridos: data-driven para performance + lineal para awareness.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Ejemplo práctico de atribución en Chile</h2>

            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Caso: educación superior en Santiago</h3>
              <ul className="space-y-2 mb-4">
                <li>• Lead promedio cuesta $9.000 CLP en Meta</li>
                <li>• Google Search reporta CPL de $12.000 CLP</li>
                <li>• CRM muestra que 70% de los matriculados habían visto anuncios en ambas plataformas</li>
              </ul>
              <p className="font-bold mb-2">👉 Con modelo last click:</p>
              <p className="mb-4">Parecería que Google es más caro.</p>
              <p className="font-bold mb-2">👉 Con modelo data-driven:</p>
              <p>Se entiende que Meta genera awareness y Google cierra la venta.</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Dashboards en tiempo real
            </h2>

            <p className="text-gray-700 mb-4">
              La clave no es solo calcular CAC o LTV en Excel. Es tener dashboards que se actualicen automáticamente con:
            </p>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Google Ads API</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Meta Ads API</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>CRM (HubSpot, Pipedrive, Zoho)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Google Analytics 4</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Qué debe mostrar un dashboard M&amp;P:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>CAC por canal y campaña</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>LTV por cohorte de clientes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>ROI y ROAS globales y por canal</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Payback en meses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Comparación con benchmarks de la industria en Chile</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <p className="text-gray-800 font-semibold mb-2">👉 Así:</p>
              <p className="text-gray-700">
                El gerente ve marketing digital como un estado de resultados: ingresos, costos, retorno.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-orange-600" />
              Cómo calcular CAC y LTV en distintos rubros
            </h2>

            <div className="space-y-6 mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Inmobiliarias</h3>
                <ul className="space-y-1 text-sm">
                  <li>• CPL promedio: $15.000 CLP</li>
                  <li>• Conversión a venta: 2%</li>
                  <li>• CAC: $750.000 CLP</li>
                  <li>• Ticket: 2.500 UF</li>
                </ul>
                <p className="mt-3 font-bold">👉 Altamente rentable, pero con payback de 6–12 meses.</p>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">SaaS B2B</h3>
                <ul className="space-y-1 text-sm">
                  <li>• CPL promedio: $25.000 CLP</li>
                  <li>• Conversión a cliente: 10%</li>
                  <li>• CAC: $250.000 CLP</li>
                  <li>• LTV: $3.000.000 CLP</li>
                </ul>
                <p className="mt-3 font-bold">👉 Rentable, payback en 3–4 meses.</p>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Retail</h3>
                <ul className="space-y-1 text-sm">
                  <li>• CPL promedio: $3.000 CLP</li>
                  <li>• Conversión: 5%</li>
                  <li>• CAC: $60.000 CLP</li>
                  <li>• Ticket promedio: $40.000 CLP</li>
                </ul>
                <p className="mt-3 font-bold">👉 Solo rentable si hay recurrencia.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&amp;P para medir con ingeniería
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define CAC, LTV y Payback como métricas base, no likes o clics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa modelos de atribución data-driven para entender journeys reales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Conecta dashboards a Google, Meta y CRM.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Compara con benchmarks locales de tu industria.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Ajusta presupuesto mes a mes según ROI real.</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              El marketing digital en Chile 2025 exige hablar el idioma de las finanzas, no de la vanidad.
            </p>

            <p className="text-gray-700 mb-4">
              CAC, LTV y Payback son las métricas que definen si una estrategia digital es sostenible. Los dashboards en tiempo real permiten que los directorios lean marketing digital como leen ventas, costos y utilidades.
            </p>

            <p className="text-gray-700 mb-6">
              👉 En M&amp;P ayudamos a empresas chilenas a pasar de métricas superficiales a modelos de atribución avanzados y reportería ejecutiva que convierte el marketing digital en una inversión tangible.
            </p>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres dashboards en tiempo real para tu negocio?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos cómo conectar Google, Meta y CRM en un solo dashboard.
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
