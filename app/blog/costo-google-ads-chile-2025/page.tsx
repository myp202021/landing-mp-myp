import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, DollarSign, Target, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Costo Real de Google Ads en Chile 2025: Guía Completa por Industria',
  description: 'Descubre cuánto cuesta Google Ads en Chile 2025: CPC promedio $250-$4.500, CPL $8.200-$67.900. Data real de +200 campañas por industria. Calculadora gratis incluida.',
  keywords: 'costo google ads chile, precio google ads chile 2025, cpc chile, cpl google ads, cuanto cuesta google ads, presupuesto google ads chile, google ads precio',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/costo-google-ads-chile-2025'
  },
  openGraph: {
    title: 'Costo Real de Google Ads en Chile 2025: Guía Completa por Industria',
    description: 'Descubre cuánto cuesta Google Ads en Chile 2025: CPC promedio $250-$4.500, CPL $8.200-$67.900. Data real de +200 campañas por industria.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/costo-google-ads-chile-2025',
    publishedTime: '2025-01-15T10:00:00Z',
    authors: ['Muller y Pérez'],
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Costo Google Ads Chile 2025'
      }
    ]
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" aria-label="Ir a inicio">
            <img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" />
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Meta */}
          <div className="mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Google Ads</span>
            <p className="text-gray-500 mt-4">15 de enero, 2025 · 12 min de lectura</p>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Costo Real de Google Ads en Chile 2025: Guía Completa por Industria
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            ¿Cuánto cuesta realmente Google Ads en Chile? Basado en data real de +200 campañas activas, te mostramos los costos promedio por industria, qué esperar de tu inversión y cómo optimizar cada peso.
          </p>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              ¿Cuánto cuesta Google Ads en Chile en 2025?
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              La respuesta corta: <strong>depende de tu industria, competencia y objetivos</strong>. Pero aquí está la data real:
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Promedios Chile 2025 (Data Real)</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>CPC promedio:</strong> $250 - $4.500 por clic</li>
                <li><strong>CPL promedio:</strong> $8.200 - $67.900 por lead</li>
                <li><strong>CPA promedio:</strong> $12.800 - $89.000 por adquisición</li>
                <li><strong>Presupuesto mínimo recomendado:</strong> $300.000 - $800.000/mes</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              Costos por Industria
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🛒 E-commerce</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>CPC: <strong>$280 - $850</strong></li>
                  <li>CPL: <strong>$8.200 - $15.400</strong></li>
                  <li>ROAS objetivo: <strong>3.5x - 6.8x</strong></li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💼 B2B / Servicios</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>CPC: <strong>$1.200 - $4.500</strong></li>
                  <li>CPL: <strong>$18.500 - $67.900</strong></li>
                  <li>ROAS objetivo: <strong>2.1x - 4.2x</strong></li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🏥 Salud / Clínicas</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>CPC: <strong>$680 - $2.100</strong></li>
                  <li>CPL: <strong>$12.300 - $28.900</strong></li>
                  <li>ROAS objetivo: <strong>3.2x - 5.4x</strong></li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🏠 Inmobiliaria</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>CPC: <strong>$950 - $3.200</strong></li>
                  <li>CPL: <strong>$15.800 - $42.500</strong></li>
                  <li>ROAS objetivo: <strong>2.8x - 4.9x</strong></li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Cómo Optimizar tu Presupuesto
            </h2>

            <div className="space-y-4 mb-12">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">1. Define tu CPL objetivo antes de empezar</h3>
                  <p className="text-gray-700">Si tu ticket promedio es $50.000 y cierras 30% de leads, tu CPL máximo debe ser $15.000 para ser rentable.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2. Comienza con campañas de Search de alto intento</h3>
                  <p className="text-gray-700">Keywords como "comprar X", "precio Y", "cotizar Z" tienen menor CPC y mayor conversión.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">3. Usa nuestro Predictor Google Ads</h3>
                  <p className="text-gray-700">
                    Calcula conversiones y revenue esperado con data real de tu industria. <Link href="/labs/predictor" className="text-blue-600 font-semibold hover:underline">Pruébalo gratis →</Link>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4. Mide CAC y LTV, no solo CPL</h3>
                  <p className="text-gray-700">
                    Un CPL de $40.000 puede ser excelente si tu LTV es $500.000. Usa nuestra <Link href="/utilidades/calculadora-cac" className="text-blue-600 font-semibold hover:underline">Calculadora CAC →</Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
              <h2 className="text-2xl font-bold mb-4">💡 Conclusión</h2>
              <p className="text-lg opacity-90 mb-4">
                Google Ads en Chile es rentable si mides correctamente y optimizas según tu industria. No existe un "costo estándar" - existe el costo que TÚ defines según tus números.
              </p>
              <p className="font-semibold">
                ¿Necesitas ayuda para optimizar tus campañas? Nuestro equipo maneja +$50M en inversión mensual.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Quieres reducir tu CPL en un 30-50%?</h3>
            <p className="text-gray-600 mb-6">Agenda una auditoría gratuita de tus campañas Google Ads</p>
            <Link
              href="/#contacto"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Solicitar Auditoría Gratis
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">© 2025 Muller y Pérez - Agencia de Marketing Digital y Performance</p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/labs" className="hover:text-blue-600 transition-colors">M&P Labs</Link>
          </div>
        </div>
      </footer>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Costo Real de Google Ads en Chile 2025: Guía Completa por Industria',
            description: 'Descubre cuánto cuesta Google Ads en Chile 2025: CPC promedio $250-$4.500, CPL $8.200-$67.900. Data real de +200 campañas por industria.',
            image: 'https://www.mulleryperez.cl/og-image.svg',
            author: {
              '@type': 'Person',
              name: 'Christopher Müller',
              url: 'https://www.mulleryperez.cl/equipo/christopher-muller',
              sameAs: [
                'https://www.linkedin.com/in/christophermullerm/',
                'https://www.mulleryperez.cl'
              ],
              jobTitle: 'CEO & Founder',
              worksFor: {
                '@type': 'Organization',
                name: 'Muller y Pérez',
                url: 'https://www.mulleryperez.cl'
              }
            },
            publisher: {
              '@type': 'Organization',
              name: 'Muller y Pérez',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.mulleryperez.cl/logo-color.png'
              }
            },
            datePublished: '2025-01-15T10:00:00Z',
            dateModified: '2025-01-15T10:00:00Z',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.mulleryperez.cl/blog/costo-google-ads-chile-2025'
            }
          })
        }}
      />
    </div>
  )
}
