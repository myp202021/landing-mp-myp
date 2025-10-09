import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, DollarSign, CheckCircle, Zap, Users, BarChart3, PlayCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Google Performance Max en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Automatización en Resultados',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 usa Google Performance Max para automatización inteligente y resultados medibles. Costos y estrategias.',
  keywords: 'agencia de marketing digital, Google Performance Max Chile, PMax Chile, automatización Google Ads, agencia marketing digital performance',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/google-performance-max-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Google Performance Max en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Automatización en Resultados',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 usa Google Performance Max para automatización inteligente y resultados medibles. Costos y estrategias.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/google-performance-max-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-01-12T00:00:00.000Z'
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
            <p className="text-gray-500 mt-4">12 de enero de 2025 · 10 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Google Performance Max en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Automatización en Resultados
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En Chile 2025, Google Performance Max (PMax) ya no es una novedad: es la herramienta predilecta de Google Ads para centralizar campañas multicanal con inteligencia artificial. Pero su efectividad depende directamente de cómo se configure, qué data se alimente y cómo se mida el rendimiento.
              </p>
              <p className="text-gray-700 mb-4">
                El problema es que muchas empresas se limitan a “encender” Performance Max sin estrategia, confiando ciegamente en la automatización. El resultado: inversión ineficiente y falta de control.
              </p>
              <p className="text-gray-700 mb-4">
                La diferencia está en contar con una agencia de marketing digital que combine lógica de performance, dashboards avanzados y modelos de atribución para transformar la IA de Google en ventas reales.
              </p>
              <p className="text-gray-700 mb-4">
                ¿Qué es Google Performance Max?
              </p>
              <p className="text-gray-700 mb-4">
                Performance Max es un tipo de campaña que usa inteligencia artificial para mostrar anuncios en todos los canales de Google:
              </p>
            </div>

            {/* Ventajas de Performance Max */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Ventajas de Performance Max
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>⚡ Cobertura total: aparece en todos los espacios publicitarios de Google.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>🤖 Automatización inteligente: aprendizaje automático para asignar presupuesto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>🎯 Optimización por conversiones: enfoca inversión en lo que genera resultados.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>📊 Acceso a insights: muestra audiencias y ubicaciones más rentables.</span>
                </li>
              </ul>
            </div>

            {/* Riesgos de usar PMax sin agencia de marketing digital */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Riesgos de usar PMax sin agencia de marketing digital
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>❌ Falta de control: Google decide qué anuncios mostrar y dónde.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>❌ Dependencia total de IA: sin supervisión, puede optimizar hacia métricas de vanidad.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>❌ Atribución borrosa: difícil saber qué canal específico generó el lead.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>❌ Creatividades pobres: sin un equipo creativo, los anuncios terminan genéricos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Aquí es donde una agencia de marketing digital agrega valor: estructura campañas con data, define audiencias personalizadas y mide CAC y ROAS reales.</span>
                </li>
              </ul>
            </div>

            {/* Costos de Performance Max en Chile 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Costos de Performance Max en Chile 2025
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>CPC promedio: $350 – $600 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>CPL promedio: $8.000 – $20.000 CLP según industria.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>ROAS promedio: 3.5x – 6x (con optimización profesional).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>En sectores como inmobiliarias y SaaS, PMax puede superar el rendimiento de campañas tradicionales de búsqueda si se trabaja con la estrategia adecuada.</span>
                </li>
              </ul>
            </div>

            {/* Estrategia de una agencia de marketing digital para PMax */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Estrategia de una agencia de marketing digital para PMax
            </h2>

            <p className="text-gray-700 mb-4">Paso 1 – Configuración inicial</p>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Definir objetivos (leads, ventas).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Conectar conversiones en Google Ads + GA4.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Subir creatividades optimizadas (imágenes, videos, headlines).</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 mb-4">Paso 2 – Alimentación de data</p>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Importar audiencias propias (CRM, clientes, visitantes web).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Usar listas de remarketing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Incluir señales de audiencia (intenciones de compra).</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 mb-4">Paso 3 – Optimización continua</p>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Monitorear CPL y CAC, no solo conversiones.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Ajustar creatividades y mensajes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Revisar insights de búsqueda y ubicaciones.</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 mb-4">Paso 4 – Dashboards de performance</p>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Conectar Google Ads API a dashboards M&P.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Medir ROI, ROAS, CAC y LTV por cohorte.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Reportar como “estado de resultados de marketing”.</span>
                </li>
              </ul>
            </div>

            {/* Ejemplo práctico en Chile */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              Ejemplo práctico en Chile
            </h2>

            <p className="text-gray-700 mb-4">Caso: SaaS B2B en Santiago</p>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Presupuesto mensual: $5.000.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>CPC promedio: $420 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>CPL: $12.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>CAC: $220.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>LTV: $2.500.000 CLP.  👉 Payback en 2 meses, con ROAS de 7.1x.</span>
                </li>
              </ul>
            </div>

            {/* Checklist M&P para Performance Max */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para Performance Max
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define KPIs financieros (CAC, ROAS, LTV), no solo clics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Alimenta PMax con audiencias propias y señales de valor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa creatividades profesionales adaptadas a cada canal.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Conecta dashboards para medición en tiempo real.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Evalúa semanalmente si PMax supera campañas de búsqueda tradicionales.</span>
                </li>
              </ul>
            </div>

            {/* Google Performance Max en Chile 2025 puede ser un arma de doble filo. Mal configurada, es una caja negra que gasta presupuesto sin control. Bien gestionada por una agencia de marketing digital, se transforma en una máquina de ventas automatizada con resultados comprobables. */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Google Performance Max en Chile 2025 puede ser un arma de doble filo. Mal configurada, es una caja negra que gasta presupuesto sin control. Bien gestionada por una agencia de marketing digital, se transforma en una máquina de ventas automatizada con resultados comprobables.
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>En M&P ayudamos a empresas a usar PMax con estrategia, data y reportería clara, logrando que cada peso invertido en Google Ads tenga trazabilidad financiera real.</span>
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
