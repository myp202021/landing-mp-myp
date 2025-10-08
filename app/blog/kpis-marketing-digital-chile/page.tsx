import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BarChart3, Target, TrendingUp, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'KPIs de Marketing Digital que SÍ Importan en 2025 (No Vanity Metrics)',
  description: 'CAC, LTV, ROAS, CPL, CPA: métricas reales de negocio. Benchmarks Chile 2025 por industria + plantilla Google Sheets gratis para tracking.',
  keywords: 'kpis marketing digital chile, cac ltv roas, metricas marketing digital, cpl cpa chile, vanity metrics, roi marketing chile 2025',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/kpis-marketing-digital-chile'
  },
  openGraph: {
    title: 'KPIs de Marketing Digital que SÍ Importan en 2025 (No Vanity Metrics)',
    description: 'CAC, LTV, ROAS, CPL, CPA: métricas reales de negocio. Benchmarks Chile 2025 por industria + plantilla Google Sheets gratis.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/kpis-marketing-digital-chile',
    publishedTime: '2025-01-05T10:00:00Z'
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
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">Performance Marketing</span>
            <p className="text-gray-500 mt-4">5 de enero, 2025 · 10 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            KPIs de Marketing Digital que SÍ Importan en 2025
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Deja de medir likes y alcance. Estas son las métricas que realmente mueven el negocio, con benchmarks reales de Chile 2025.
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                ❌ Vanity Metrics (No Sirven)
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>Impresiones / Alcance / Vistas</li>
                <li>Likes / Comentarios / Compartidos</li>
                <li>Seguidores / Fans de página</li>
                <li>CTR sin contexto de conversión</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-600" />
              KPIs que SÍ Importan
            </h2>

            <div className="space-y-8 mb-12">
              <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">1. CAC (Customer Acquisition Cost)</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Qué es:</strong> Cuánto gastas para conseguir un cliente nuevo.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-mono text-sm text-gray-800">
                    CAC = (Inversión Publicitaria + Costos de Marketing) / # Clientes Nuevos
                  </p>
                </div>
                <p className="text-gray-700 mb-4"><strong>Benchmark Chile 2025:</strong></p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• E-commerce: $12.800 - $28.500</li>
                  <li>• SaaS B2B: $45.000 - $89.000</li>
                  <li>• Servicios: $18.500 - $52.000</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2. LTV (Lifetime Value)</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Qué es:</strong> Cuánto dinero genera un cliente durante toda su relación contigo.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-mono text-sm text-gray-800">
                    LTV = Ticket Promedio × Frecuencia de Compra × Vida del Cliente
                  </p>
                </div>
                <p className="text-gray-700 font-semibold">🎯 Regla de Oro: LTV debe ser al menos 3x tu CAC</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">3. ROAS (Return on Ad Spend)</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Qué es:</strong> Por cada $1 invertido en publicidad, cuánto generas.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-mono text-sm text-gray-800">
                    ROAS = Revenue de Campañas / Inversión Publicitaria
                  </p>
                </div>
                <p className="text-gray-700 mb-4"><strong>Benchmark Chile 2025:</strong></p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• E-commerce: 3.5x - 6.8x</li>
                  <li>• B2B: 2.1x - 4.2x</li>
                  <li>• Retail: 4.2x - 5.9x</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">4. CPL (Cost Per Lead)</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Qué es:</strong> Cuánto pagas por cada lead (contacto calificado).
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-mono text-sm text-gray-800">
                    CPL = Inversión Publicitaria / # Leads Generados
                  </p>
                </div>
                <p className="text-gray-700 mb-4"><strong>Benchmark Chile 2025:</strong></p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Google Search: $18.500 - $45.300</li>
                  <li>• Meta Ads: $8.200 - $28.900</li>
                  <li>• LinkedIn B2B: $35.000 - $78.000</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">5. CPA (Cost Per Acquisition)</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Qué es:</strong> Cuánto pagas por cada conversión (venta, registro, demo).
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-mono text-sm text-gray-800">
                    CPA = Inversión Publicitaria / # Conversiones
                  </p>
                </div>
                <p className="text-gray-700 font-semibold">💡 Diferencia: CPL es contacto, CPA es acción completa</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              Cómo Usarlos en la Práctica
            </h2>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
              <h3 className="text-2xl font-bold mb-6">📊 Dashboard Ejecutivo Semanal</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">Adquisición:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• CPL por canal</li>
                    <li>• CAC total</li>
                    <li>• Tasa de conversión Lead → Cliente</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Rentabilidad:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• ROAS por campaña</li>
                    <li>• LTV/CAC ratio</li>
                    <li>• Revenue atribuido</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Herramientas para Medirlos
            </h2>

            <div className="space-y-4 mb-12">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">1. Google Analytics 4 + GTM</h3>
                <p className="text-gray-700 text-sm">Tracking de eventos, embudos de conversión, atribución por canal</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">2. Meta Pixel + Conversions API</h3>
                <p className="text-gray-700 text-sm">Tracking exacto de revenue, ROAS por ad set, atribución mejorada</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">3. CRM (HubSpot / Pipedrive)</h3>
                <p className="text-gray-700 text-sm">Ciclo de venta, tasa de cierre, LTV real por cohorte</p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">4. Calculadora CAC de M&P (Gratis)</h3>
                <p className="text-gray-700 text-sm mb-3">Calcula CAC, LTV/CAC ratio y rentabilidad por canal en 60 segundos</p>
                <Link href="/utilidades/calculadora-cac" className="text-blue-600 font-semibold hover:underline">
                  → Usar Calculadora CAC Gratis
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">✅ Resumen Ejecutivo</h2>
              <ul className="space-y-3">
                <li><strong>1. CAC:</strong> Cuánto pagas por cliente</li>
                <li><strong>2. LTV:</strong> Cuánto ganas por cliente</li>
                <li><strong>3. LTV/CAC:</strong> Debe ser mínimo 3:1</li>
                <li><strong>4. ROAS:</strong> Revenue / Ad Spend (mínimo 2.5x)</li>
                <li><strong>5. CPL:</strong> Optimiza por calidad, no cantidad</li>
              </ul>
              <p className="mt-6 font-semibold">
                📈 Si mides esto semanalmente, ya estás en el top 10% de empresas chilenas.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">¿No sabes cómo trackear estos KPIs?</h3>
            <p className="text-gray-600 mb-6">Implementamos tracking completo: GA4, Meta Pixel, Conversions API</p>
            <Link href="/#contacto" className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-colors">
              Solicitar Setup Gratis
            </Link>
          </div>
        </div>
      </article>

      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">© 2025 Muller y Pérez - Agencia de Marketing Digital y Performance</p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          </div>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'KPIs de Marketing Digital que SÍ Importan en 2025 (No Vanity Metrics)',
        datePublished: '2025-01-05T10:00:00Z',
        author: { '@type': 'Organization', name: 'Muller y Pérez' }
      })}} />
    </div>
  )
}
