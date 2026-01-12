import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, DollarSign, CheckCircle, Zap, Users, BarChart3, PlayCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing en Agroindustria en Chile 2025: Cómo una Agencia de Marketing Digital Potencia Exportaciones y Ventas Locales',
  description: 'Descubre cómo una agencia de marketing digital en Chile 2025 potencia exportaciones y ventas locales de agroindustria con estrategias multicanal y reportería ROI.',
  keywords: 'agencia de marketing digital, agroindustria Chile 2025, agencia marketing digital agroindustria, exportaciones Chile marketing, leads agroindustria',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/marketing-agroindustria-agencia-marketing-digital-chile-2025'
  },
  openGraph: {
    title: 'Marketing en Agroindustria en Chile 2025: Cómo una Agencia de Marketing Digital Potencia Exportaciones y Ventas Locales',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 potencia exportaciones y ventas locales de agroindustria con estrategias multicanal y reportería ROI.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/marketing-agroindustria-agencia-marketing-digital-chile-2025',
    publishedTime: '2025-02-03T00:00:00.000Z'
  }
}


  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Marketing en Agroindustria en Chile 2025: Cómo una Agencia de Marketing Digital Potencia Exportaciones y Ventas Locales',
    description: 'Descubre cómo una agencia de marketing digital en Chile 2025 potencia exportaciones y ventas locales de agroindustria con estrategias multicanal y reportería ROI.',
    url: 'https://www.mulleryperez.cl/blog/marketing-agroindustria-agencia-marketing-digital-chile-2025',
    datePublished: '2025-02-03T00:00:00.000Z',
    dateModified: '2025-02-03T00:00:00.000Z',
    author: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl'
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
      '@id': 'https://www.mulleryperez.cl/blog/marketing-agroindustria-agencia-marketing-digital-chile-2025'
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
            <p className="text-gray-500 mt-4">3 de febrero de 2025 · 10 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Marketing en Agroindustria en Chile 2025: Cómo una Agencia de Marketing Digital Potencia Exportaciones y Ventas Locales
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Introducción */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Introducción</h3>
              <p className="text-gray-700 mb-4">
                La agroindustria chilena es un motor clave de la economía: desde la fruta fresca hasta el vino, pasando por berries, frutos secos, salmonicultura y agroprocesados. En 2025, este sector enfrenta grandes oportunidades —como el crecimiento de exportaciones a Asia— pero también desafíos: mayores exigencias de trazabilidad, competencia internacional feroz y márgenes ajustados por costos logísticos.
              </p>
              <p className="text-gray-700 mb-4">
                Muchas empresas del rubro siguen apostando a ferias internacionales y brokers, pero dejan de lado el potencial de los canales digitales para posicionar su marca en mercados de alto valor y aumentar sus ventas locales. Aquí es donde una agencia de marketing digital juega un rol estratégico, ayudando a convertir la inversión en leads calificados, contratos de exportación y ventas B2B/B2C más rentables.
              </p>
              <p className="text-gray-700 mb-4">
                Particularidades del marketing en agroindustria
              </p>
            </div>

            {/* 1. Posicionamiento internacional */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              1. Posicionamiento internacional
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>LinkedIn Ads: llegar a importadores y distribuidores en Asia y Europa.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Google Ads internacionales: keywords como “export berries Chile”, “wine import South Korea”.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>Email marketing B2B: con catálogos descargables y fichas técnicas.</span>
                </li>
              </ul>
            </div>

            {/* 2. Marketing local B2C */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              2. Marketing local B2C
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Meta Ads y TikTok Ads: campañas de marca en supermercados y e-commerce.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Google Shopping: para posicionar productos agroprocesados en Chile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Influencers gastronómicos: recetas y contenido que conecte con consumidores locales.</span>
                </li>
              </ul>
            </div>

            {/* 3. Storytelling y confianza */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              3. Storytelling y confianza
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Resaltar certificaciones internacionales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Contar historias de origen: campo, familia, tradición.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Contenido audiovisual de procesos productivos.</span>
                </li>
              </ul>
            </div>

            {/* 4. Dashboards y métricas */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              4. Dashboards y métricas
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>CAC y ROI diferenciados para exportaciones y ventas locales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Medición de leads generados en ferias digitales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>Reporterías que integran CRM con campañas digitales.</span>
                </li>
              </ul>
            </div>

            {/* Ejemplo práctico en Chile */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              Ejemplo práctico en Chile
            </h2>

            <p className="text-gray-700 mb-4">Caso: exportadora de frutos secos en O’Higgins</p>

            <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Problema: dependencia excesiva de brokers y márgenes reducidos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Estrategia:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>LinkedIn Ads segmentando importadores europeos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Landing en inglés con catálogo descargable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Meta Ads en Chile para posicionar marca premium en supermercados.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>Resultados:</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>23 contratos internacionales en 12 meses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>CAC ↓ 31%.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold text-xl">•</span>
                  <span>ROI: 9.2x.</span>
                </li>
              </ul>
            </div>

            {/* Benchmarks en agroindustria en Chile 2025 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Benchmarks en agroindustria en Chile 2025
            </h2>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>CPL promedio internacional (LinkedIn Ads): $40.000 – $90.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>CPL promedio local (Meta Ads): $6.000 – $12.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>CAC exportaciones: $250.000 – $600.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-xl">•</span>
                  <span>ROI esperado: 5x – 12x.</span>
                </li>
              </ul>
            </div>

            {/* Costos del marketing agroindustrial con agencia */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              Costos del marketing agroindustrial con agencia
            </h2>

            <div className="bg-white border-2 border-orange-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Setup inicial (campañas internacionales + CRM + catálogos): $2.000.000 – $4.000.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Gestión mensual con agencia de marketing digital: $900.000 – $1.800.000 CLP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-xl">•</span>
                  <span>Inversión en Ads recomendada: desde $3M CLP (exportación) y $2M CLP (mercado local).</span>
                </li>
              </ul>
            </div>

            {/* Checklist M&P para agroindustria */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Checklist M&P para agroindustria
            </h2>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Usa LinkedIn Ads para captar importadores internacionales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Diseña landings bilingües con catálogos descargables.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Refuerza presencia local con Meta, Google Shopping y TikTok.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Destaca certificaciones y trazabilidad.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✅</span>
                  <span>Mide ROI separado para exportaciones y ventas locales.</span>
                </li>
              </ul>
            </div>

            {/* Una agencia de marketing digital con experiencia en agroindustria es capaz de diseñar campañas internacionales y locales que potencien exportaciones y ventas B2C, asegurando un crecimiento sostenible y rentable. */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Una agencia de marketing digital con experiencia en agroindustria es capaz de diseñar campañas internacionales y locales que potencien exportaciones y ventas B2C, asegurando un crecimiento sostenible y rentable.
            </h2>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">•</span>
                  <span>En M&P ayudamos a exportadoras y agroindustrias chilenas a escalar su negocio con performance digital, reportería financiera y estrategias adaptadas a cada mercado.</span>
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
