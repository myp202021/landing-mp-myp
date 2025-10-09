import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, DollarSign, CheckCircle, Zap, Users, BarChart3, PlayCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Estrategias de ROI y ROAS en Chile 2025: Cómo una Agencia de Marketing Digital Mide lo que Importa',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 mide ROI y ROAS con tracking avanzado, benchmarks locales y reportería financiera.',
  keywords: 'agencia de marketing digital, ROI marketing digital Chile, ROAS Chile 2025, agencia marketing digital ROI, performance marketing Chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/roi-roas-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Estrategias de ROI y ROAS en Chile 2025: Cómo una Agencia de Marketing Digital Mide lo que Importa',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 mide ROI y ROAS con tracking avanzado, benchmarks locales y reportería financiera.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/roi-roas-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-01-22T00:00:00.000Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-white">
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
            <p className="text-gray-500 mt-4">22 de enero de 2025 · 10 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Estrategias de ROI y ROAS en Chile 2025: Cómo una Agencia de Marketing Digital Mide lo que Importa
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En Chile 2025, hablar de marketing digital sin mencionar ROI y ROAS es como hablar de finanzas sin ver utilidades. Las empresas ya no se conforman con “alcance” o “me gusta”: quieren entender cuánto dinero vuelve por cada peso invertido.
              </p>
              <p className="text-gray-700 mb-4">
                El problema es que muchas marcas confunden ROI (Retorno sobre la Inversión) con ROAS (Retorno sobre la Inversión Publicitaria) y terminan tomando decisiones equivocadas. Aquí es donde una agencia de marketing digital experta en performance separa métricas, educa al cliente y conecta resultados de campañas con reportería financiera real.
              </p>
              <p className="text-gray-700 mb-4">
                ROI vs ROAS: diferencias clave
              </p>
            </div>

            {/* Por qué medir ROI y ROAS en Chile 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Por qué medir ROI y ROAS en Chile 2025
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>💸 Presión de directorios: cada peso invertido debe justificar su retorno.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>📊 Alta competencia: con CPCs en alza, optimizar cada canal es vital.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>🤖 IA y atribución: la medición precisa ya no es opcional, es estratégica.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>⚡ Escalabilidad: sin claridad en ROI, es imposible crecer de forma sostenible.</span>
                </li>
              </ul>
            </div>

            {/* 1. Definición de objetivos financieros */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              1. Definición de objetivos financieros
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>ROI esperado: mínimo 30–50%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>ROAS meta: 4x en e-commerce, 6–8x en B2B.</span>
                </li>
              </ul>
            </div>

            {/* 2. Configuración de tracking avanzado */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              2. Configuración de tracking avanzado
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Conversion API en Meta Ads.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Google Tag Manager con eventos en GA4.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Integración de CRM (HubSpot, Pipedrive, Zoho).</span>
                </li>
              </ul>
            </div>

            {/* 3. Modelos de atribución */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              3. Modelos de atribución
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Last click (poco recomendado).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Multi-touch con IA.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Atribución basada en data-driven (GA4).</span>
                </li>
              </ul>
            </div>

            {/* 4. Reporterías financieras */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              4. Reporterías financieras
            </h2>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Dashboards que muestran ROI y ROAS lado a lado.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Ajustes de inversión según rentabilidad real, no solo volumen.</span>
                </li>
              </ul>
            </div>

            {/* Ejemplo práctico en Chile */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Ejemplo práctico en Chile
            </h2>

            <p className="text-gray-700 mb-4">Caso: inmobiliaria en Temuco</p>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Inversión mensual: $20M CLP en Google + Meta.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Ingresos atribuidos a Ads: $120M CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>ROAS: 6x.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Costos totales (Ads + agencia + equipo): $40M CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>ROI: 200%.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
              <p className="text-lg font-bold">👉 Con reportería clara, la empresa pudo demostrar ante el directorio que marketing no era un gasto, sino un motor de utilidades.</p>
            </div>

            {/* Benchmarks de ROI y ROAS por industria en Chile 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Benchmarks de ROI y ROAS por industria en Chile 2025
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>🛒 E-commerce: ROAS 4x – 6x, ROI 20–40%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>🏠 Inmobiliario: ROAS 6x – 10x, ROI 100–200%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>🎓 Educación: ROAS 3x – 5x, ROI 30–60%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>💻 SaaS B2B: ROAS 5x – 8x, ROI 200%+.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>👩‍⚕️ Salud privada: ROAS 3x – 6x, ROI 50–120%.</span>
                </li>
              </ul>
            </div>

            {/* Costos de implementar reportería ROI/ROAS */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Costos de implementar reportería ROI/ROAS
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Setup inicial (tracking y dashboards): $1.000.000 – $2.500.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Gestión mensual con agencia: $600.000 – $1.200.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Beneficio promedio: reducción de 15–25% en CAC gracias a optimización.</span>
                </li>
              </ul>
            </div>

            {/* Checklist M&P para ROI y ROAS */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para ROI y ROAS
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Diferencia siempre ROI de ROAS.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Configura tracking avanzado en todas las plataformas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa modelos de atribución data-driven.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Construye dashboards financieros, no solo de Ads.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Ajusta inversión en base a ROI y ROAS, no a likes o CTR.</span>
                </li>
              </ul>
            </div>

            {/* Una agencia de marketing digital experta convierte métricas dispersas en reporterías que hablan el idioma de gerentes y directorios, alineando marketing con los objetivos de negocio. */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              Una agencia de marketing digital experta convierte métricas dispersas en reporterías que hablan el idioma de gerentes y directorios, alineando marketing con los objetivos de negocio.
            </h2>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>En M&P, no solo medimos clicks: conectamos Ads con estados financieros para mostrar el verdadero impacto en crecimiento y utilidades.</span>
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
