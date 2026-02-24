import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, DollarSign, CheckCircle, Zap, Users, BarChart3, PlayCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Estrategias de Retargeting en Chile 2025: Cómo una Agencia de Marketing Digital Maximiza Conversiones',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 usa estrategias de retargeting para maximizar conversiones. Casos, costos y checklist práctico.',
  keywords: 'agencia de marketing digital, retargeting Chile, remarketing digital 2025, agencia marketing digital performance, conversiones marketing Chile',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/retargeting-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Estrategias de Retargeting en Chile 2025: Cómo una Agencia de Marketing Digital Maximiza Conversiones',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 usa estrategias de retargeting para maximizar conversiones. Casos, costos y checklist práctico.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/retargeting-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-01-16T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Estrategias de Retargeting en Chile 2025: Cómo una Agencia de Marketing Digital Maximiza Conversiones',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 usa estrategias de retargeting para maximizar conversiones. Casos, costos y checklist práctico.',
    url: 'https://www.mulleryperez.cl/blog/retargeting-agencia-marketing-digital-chile-2025',
    datePublished: '2025-01-16T00:00:00.000Z',
    dateModified: '2025-01-16T00:00:00.000Z',
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
      url: 'https://www.mulleryperez.cl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mulleryperez.cl/logo-color.png'
      }
    },
    image: 'https://www.mulleryperez.cl/og-image.jpg',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/blog/retargeting-agencia-marketing-digital-chile-2025'
    },
    articleSection: 'Marketing Digital',
    inLanguage: 'es-CL'
  }

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-white">
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

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
            <p className="text-gray-500 mt-4">16 de enero de 2025 · 10 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Estrategias de Retargeting en Chile 2025: Cómo una Agencia de Marketing Digital Maximiza Conversiones
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                En Chile 2025, conseguir tráfico ya no es el problema. Las empresas invierten millones en Google Ads, Meta Ads y TikTok Ads para atraer visitantes, pero el 95% de los usuarios abandona un sitio sin comprar ni dejar sus datos.
              </p>
              <p className="text-gray-700 mb-4">
                Aquí es donde entra el retargeting, la técnica de volver a impactar a esas audiencias que ya mostraron interés. Y aunque parece simple, la diferencia entre un retargeting amateur y el diseñado por una agencia de marketing digital puede significar duplicar o triplicar las conversiones.
              </p>
              <p className="text-gray-700 mb-4">
                ¿Qué es el retargeting?
              </p>
              <p className="text-gray-700 mb-4">
                El retargeting es la práctica de mostrar anuncios a personas que:
              </p>
            </div>

            {/* Por qué el retargeting es clave en 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Por qué el retargeting es clave en 2025
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>📈 CTR más alto: anuncios de retargeting suelen tener 2–3 veces más clics que campañas de prospecting.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>💸 CPL más bajo: el costo por lead disminuye hasta un 40%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>⚡ Conversiones aceleradas: reduce el ciclo de decisión.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>🤝 Construye confianza: muestra consistencia y cercanía con la marca.</span>
                </li>
              </ul>
            </div>

            {/* 1. Retargeting secuencial */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              1. Retargeting secuencial
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Día 1: recordatorio del producto/servicio.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Día 3: oferta de valor (ebook, caso de éxito).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Día 7: incentivo (descuento, reunión gratis).</span>
                </li>
              </ul>
            </div>

            {/* 2. Retargeting dinámico */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              2. Retargeting dinámico
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Catálogos conectados a Meta o Google Shopping.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Muestra al usuario exactamente el producto que vio.</span>
                </li>
              </ul>
            </div>

            {/* 3. Retargeting omnicanal */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              3. Retargeting omnicanal
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Impactar al usuario en múltiples plataformas: Google Display, Meta, TikTok, YouTube.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Consistencia de mensaje en todos los canales.</span>
                </li>
              </ul>
            </div>

            {/* 4. Retargeting por comportamiento */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              4. Retargeting por comportamiento
            </h2>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Usuarios que visitaron página de precios.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Leads que abrieron emails pero no respondieron.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Usuarios que interactuaron con el bot de WhatsApp.</span>
                </li>
              </ul>
            </div>

            {/* 5. Retargeting con IA */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              5. Retargeting con IA
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Modelos predictivos que calculan la probabilidad de conversión.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Impacto diferenciado según ticket promedio o industria.</span>
                </li>
              </ul>
            </div>

            {/* Costos de retargeting en Chile 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Costos de retargeting en Chile 2025
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>CPM promedio: $1.000 – $2.500 CLP (más bajo que prospecting).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>CPC promedio: $200 – $400 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>CPL promedio: $3.000 – $10.000 CLP (según industria).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Retargeting es el canal más eficiente en términos de costo-beneficio cuando se gestiona con estrategia.</span>
                </li>
              </ul>
            </div>

            {/* Ejemplo práctico en Chile */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Ejemplo práctico en Chile
            </h2>

            <p className="text-gray-700 mb-4">Caso: e-commerce de tecnología en Santiago</p>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Presupuesto mensual: $2.500.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Estrategia:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Retargeting dinámico de productos vistos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Secuencia de anuncios con casos de éxito.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Resultados en 3 meses:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>ROAS: 7.2x.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>CPL: $5.200 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Ventas ↑ 48% respecto a prospecting puro.</span>
                </li>
              </ul>
            </div>

            {/* Checklist M&P para retargeting */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para retargeting
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Define audiencias en base a comportamiento, no solo visitas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Diseña secuencias de anuncios diferenciados por etapa.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa catálogos dinámicos para productos y servicios.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Aplica omnicanalidad: Google, Meta, TikTok, YouTube.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Integra con dashboards para medir CPL, CAC y ROAS reales.</span>
                </li>
              </ul>
            </div>

            {/* El retargeting en Chile 2025 es más que “seguir” al usuario con un anuncio genérico. Cuando lo diseña una agencia de marketing digital, se transforma en un motor de conversiones con costos bajos y resultados comprobables. */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              El retargeting en Chile 2025 es más que “seguir” al usuario con un anuncio genérico. Cuando lo diseña una agencia de marketing digital, se transforma en un motor de conversiones con costos bajos y resultados comprobables.
            </h2>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>En M&P diseñamos estrategias de retargeting basadas en data, segmentación inteligente y creatividad, logrando que cada contacto perdido se convierta en una segunda oportunidad de venta.</span>
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
