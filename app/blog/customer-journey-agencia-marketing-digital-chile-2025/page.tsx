import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Map, Target, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboards de Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Datos en Decisiones',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 implementa Customer Journey con estrategias de performance, costos reales y casos prácticos.',
  keywords: 'agencia de marketing digital, Customer Journey Chile, marketing digital Chile 2025',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/customer-journey-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Dashboards de Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Datos en Decisiones',
    description: 'Estrategias de Customer Journey en Chile 2025 por agencia de marketing digital experta en performance.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/customer-journey-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-10-09T00:00:00.000Z'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-white">
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
            <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-bold">Customer Journey</span>
            <p className="text-gray-500 mt-4">9 de octubre de 2025 · 21 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Dashboards de Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Datos en Decisiones
          </h1>

          <div className="prose prose-lg max-w-none">
            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">En Chile 2025, las gerencias ya no aceptan reportes de marketing llenos de impresiones, likes o clics sin contexto. Hoy, los directorios quieren ver marketing como si fueran estados financieros: ingresos, costos, margen y retorno.</p>
              <p className="text-gray-700 mb-4">El desafío es que muchas empresas acumulan datos dispersos en Google Ads, Meta Ads, LinkedIn, CRM, email marketing y WhatsApp, pero no los consolidan. El resultado: decisiones lentas y basadas en intuición.</p>
              <p className="text-gray-700 mb-4">Aquí es donde una agencia de marketing digital experta en performance entra en juego: construye dashboards que integran data en tiempo real, muestran CAC, LTV, ROAS y Payback, y permiten tomar decisiones de inversión con lógica financiera.</p>

            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Map className="w-8 h-8 text-teal-600" />
              Puntos Clave
            </h2>

            <div className="bg-white border-2 border-teal-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
            <p className="text-gray-700 mb-4">Dashboards de Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Datos en Decisiones</p>

            <p className="text-gray-700 mb-4">Aquí es donde una agencia de marketing digital experta en performance entra en juego: construye dashboards que integran data en tiempo real, muestran CAC, LTV, ROAS y Payback, y permiten tomar decisiones de inversión con lógica financiera.</p>

            <p className="text-gray-700 mb-4">¿Qué es un dashboard de marketing?</p>

            <p className="text-gray-700 mb-4">Un dashboard es una plataforma visual que concentra los datos clave del negocio en tiempo real.</p>

            <p className="text-gray-700 mb-4">👉 A diferencia de un Excel manual, un dashboard automatizado:</p>

                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Se conecta a las APIs de Google, Meta, TikTok, LinkedIn y CRM.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Actualiza datos en minutos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Muestra métricas financieras (no solo vanity metrics).</span>
                </li>
            <p className="text-gray-700 mb-4">Por qué los dashboards son clave en Chile 2025</p>

                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>⚡ Velocidad: decisiones semanales, no trimestrales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>📊 Precisión: elimina errores humanos de Excel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>💸 Control financiero: conecta inversión con retorno real.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>🤝 Transparencia: clientes y gerencias ven lo mismo que el equipo de marketing.</span>
                </li>
            <p className="text-gray-700 mb-4">Qué debe mostrar un dashboard de marketing en Chile</p>

            <p className="text-gray-700 mb-4">Una agencia de marketing digital que construye dashboards sabe que lo importante no es la estética, sino qué indicadores se miden.</p>

                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>CAC (Costo de Adquisición de Cliente).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>LTV (Valor del Cliente en el Tiempo).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>ROAS (Retorno sobre la Inversión Publicitaria).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Payback (meses en recuperar inversión).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>CPL, CPA, conversiones por canal.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Google Ads.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Meta Ads.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>LinkedIn Ads.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>TikTok Ads.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>CRM (HubSpot, Zoho, Pipedrive).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Google Analytics 4.</span>
                </li>
            <p className="text-gray-700 mb-4">1. Dashboard ejecutivo</p>

                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>KPIs financieros (CAC, LTV, ROI).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Ideal para directorios y gerencias.</span>
                </li>
            <p className="text-gray-700 mb-4">2. Dashboard operativo</p>

                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Rendimiento por campaña.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Ajustes de segmentación y creatividad.</span>
                </li>
            <p className="text-gray-700 mb-4">3. Dashboard comparativo</p>

                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Benchmarks por industria.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Comparación con meses anteriores.</span>
                </li>
            <div className="bg-gradient-to-r from-teal-600 to-pink-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ejemplo práctico en Chile</h3>
            </div>

            <div className="bg-gradient-to-r from-teal-600 to-pink-600 rounded-xl p-8 mb-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Caso: retail e-commerce en Santiago</h3>
            </div>

                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Problema: múltiples campañas en Google y Meta sin reportería clara.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Solución: dashboard integrado con Google Data Studio + APIs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Resultados:</span>
                </li>
            <p className="text-gray-700 mb-4">○	Visión en tiempo real de inversión vs ventas.</p>

            <p className="text-gray-700 mb-4">👉 El cliente pudo decidir mes a mes dónde recortar y dónde escalar inversión.</p>

            <p className="text-gray-700 mb-4">Costos de dashboards en Chile 2025</p>

                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Setup inicial: \$1.500.000 – \$4.000.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Mantenimiento mensual: \$500.000 – \$1.200.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Beneficio promedio: reducción de 20–40% en CAC al optimizar presupuesto.</span>
                </li>
            <p className="text-gray-700 mb-4">Checklist M&P para dashboards de marketing</p>

                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>✅ Define KPIs financieros antes que vanity metrics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>✅ Conecta APIs de Google, Meta, LinkedIn, TikTok y CRM.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>✅ Diseña dashboards separados: ejecutivo vs operativo.</span>
                </li>

              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusión</h2>

            <p className="text-gray-700 mb-4">
              En 2025, Customer Journey en Chile se ha convertido en una estrategia fundamental para las empresas que buscan resultados medibles y ROI positivo.
            </p>

            <p className="text-gray-700 mb-6">
              👉 En M&P diseñamos e implementamos estrategias de Customer Journey con foco en performance, integración multicanal y reportería financiera clara.
            </p>

            <div className="bg-gradient-to-br from-teal-600 to-pink-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Quieres implementar Customer Journey en tu empresa?
              </h3>
              <p className="text-xl text-teal-100 mb-8">
                Agenda una sesión estratégica gratuita y te mostramos cómo transformar tu inversión en resultados reales.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-teal-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
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
