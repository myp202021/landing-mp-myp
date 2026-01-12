import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, Users, Target, BarChart3, Linkedin, CheckCircle, TrendingUp, Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital B2B en Chile | Generación de Leads Empresariales | M&P',
  description: 'Agencia especializada en marketing B2B en Chile. Generamos leads calificados para empresas con LinkedIn Ads, Google Ads, ABM y estrategias de contenido. CPL promedio $15.000.',
  keywords: 'marketing b2b chile, marketing digital empresas chile, generacion leads b2b, linkedin ads chile, abm chile, marketing industrial chile',
  openGraph: {
    title: 'Marketing Digital B2B en Chile | M&P',
    description: 'Especialistas en generación de leads B2B. LinkedIn Ads, Google Ads y ABM para empresas.',
    url: 'https://www.mulleryperez.cl/marketing-digital-b2b-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-b2b-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-b2b-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-b2b-chile',
      name: 'Marketing Digital B2B en Chile',
      description: 'Agencia especializada en marketing digital para empresas B2B en Chile.',
      isPartOf: { '@id': 'https://www.mulleryperez.cl/#website' },
    },
    {
      '@type': 'Service',
      name: 'Marketing Digital B2B',
      description: 'Servicio de marketing digital especializado para empresas B2B',
      provider: { '@type': 'Organization', name: 'Müller & Pérez' },
      areaServed: { '@type': 'Country', name: 'Chile' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta un lead B2B en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El CPL B2B en Chile varía según la industria: Tecnología/SaaS $12.000-25.000 CLP, Servicios profesionales $8.000-18.000 CLP, Industrial $15.000-35.000 CLP. En M&P logramos CPL promedio de $15.000 con alta calificación.',
          },
        },
        {
          '@type': 'Question',
          name: '¿LinkedIn Ads o Google Ads para B2B?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'LinkedIn es ideal para targeting por cargo, empresa e industria. Google Ads captura demanda activa. La combinación óptima es: LinkedIn para awareness y targeting preciso, Google para captura de búsquedas con intención.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué es ABM y cómo funciona?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Account Based Marketing (ABM) es una estrategia que enfoca recursos en cuentas específicas de alto valor. Identificamos empresas objetivo, creamos contenido personalizado y ejecutamos campañas multi-touch dirigidas a los tomadores de decisión.',
          },
        },
      ],
    },
  ],
}

export default function MarketingB2BPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Building2 className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Especialistas B2B</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital{' '}
                <span className="text-blue-400">B2B</span> en Chile
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Generamos leads empresariales calificados para tu negocio.
                LinkedIn Ads, Google Ads, ABM y estrategias de contenido que convierten.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400">$15.000</div>
                  <div className="text-sm text-slate-300">CPL Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400">42%</div>
                  <div className="text-sm text-slate-300">Tasa Calificación</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400">3.2x</div>
                  <div className="text-sm text-slate-300">ROI Promedio</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Cotizar Ahora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular Resultados B2B
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Desafíos B2B */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Entendemos los Desafíos del Marketing B2B
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Vender a empresas es diferente. Ciclos largos, múltiples decisores,
                  y la necesidad de demostrar valor en cada interacción.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-red-800 mb-4">Problemas Comunes</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      Leads que no son tomadores de decisión
                    </li>
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      CPL alto sin visibilidad de calidad
                    </li>
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      Ciclos de venta eternos sin seguimiento
                    </li>
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      Contenido genérico que no resuena
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-green-800 mb-4">Nuestra Solución</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Segmentación por cargo, empresa y tamaño
                    </li>
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Lead scoring automático con calificación
                    </li>
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Nurturing multi-touch con contenido relevante
                    </li>
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Contenido por etapa del buyer journey
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios B2B */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Estrategias B2B que Generan Pipeline
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Linkedin className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">LinkedIn Ads</h3>
                  <p className="text-gray-600 mb-4">
                    Campañas segmentadas por cargo, industria, tamaño de empresa y skills.
                    Formatos: Sponsored Content, Message Ads, Lead Gen Forms.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Targeting de decisores específicos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Retargeting por engagement
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      ABM con matched audiences
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Google Ads B2B</h3>
                  <p className="text-gray-600 mb-4">
                    Captura de demanda activa con keywords de alta intención comercial.
                    Search, Display selectivo y YouTube para awareness.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Keywords transaccionales B2B
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Remarketing por engagement
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Exclusión de consumidores
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Account Based Marketing</h3>
                  <p className="text-gray-600 mb-4">
                    Estrategia enfocada en cuentas de alto valor con contenido
                    personalizado y campañas multi-canal coordinadas.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Identificación de cuentas objetivo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Contenido personalizado por cuenta
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Orquestación multicanal
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Mail className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Email Marketing B2B</h3>
                  <p className="text-gray-600 mb-4">
                    Nurturing automatizado con contenido relevante para cada etapa
                    del ciclo de compra.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Secuencias por buyer stage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lead scoring automático
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Alertas de engagement
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Contenido B2B</h3>
                  <p className="text-gray-600 mb-4">
                    Whitepapers, casos de estudio, webinars y contenido que
                    posiciona tu expertise y genera leads.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lead magnets de alto valor
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Casos de estudio con ROI
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      SEO para keywords B2B
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Revenue Marketing</h3>
                  <p className="text-gray-600 mb-4">
                    Alineación marketing-ventas con métricas de revenue,
                    no solo leads.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Attribution multi-touch
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Pipeline velocity tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      ROI por canal y campaña
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks B2B */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Benchmarks B2B Chile 2025
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Industria</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">CPL Promedio</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Tasa Calificación</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Ciclo Venta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">Tecnología / SaaS</td>
                      <td className="px-6 py-4 text-center">$18.000 - $35.000</td>
                      <td className="px-6 py-4 text-center">35-45%</td>
                      <td className="px-6 py-4 text-center">2-4 meses</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Servicios Profesionales</td>
                      <td className="px-6 py-4 text-center">$12.000 - $25.000</td>
                      <td className="px-6 py-4 text-center">40-50%</td>
                      <td className="px-6 py-4 text-center">1-3 meses</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Industrial / Manufactura</td>
                      <td className="px-6 py-4 text-center">$20.000 - $45.000</td>
                      <td className="px-6 py-4 text-center">25-35%</td>
                      <td className="px-6 py-4 text-center">4-8 meses</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Fintech / Financiero</td>
                      <td className="px-6 py-4 text-center">$25.000 - $50.000</td>
                      <td className="px-6 py-4 text-center">30-40%</td>
                      <td className="px-6 py-4 text-center">3-6 meses</td>
                    </tr>
                    <tr className="bg-blue-50 font-bold">
                      <td className="px-6 py-4">M&P Promedio</td>
                      <td className="px-6 py-4 text-center text-blue-600">$15.000</td>
                      <td className="px-6 py-4 text-center text-blue-600">42%</td>
                      <td className="px-6 py-4 text-center text-blue-600">-30% vs industria</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes sobre Marketing B2B
              </h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto cuesta un lead B2B en Chile?
                  </h3>
                  <p className="text-gray-600">
                    El CPL B2B varía según industria: <strong>Tecnología/SaaS $12.000-25.000</strong>,
                    Servicios profesionales $8.000-18.000, Industrial $15.000-35.000.
                    En M&P logramos CPL promedio de <strong>$15.000 con 42% de tasa de calificación</strong>.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿LinkedIn Ads o Google Ads para B2B?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Ambos son complementarios:</strong> LinkedIn para targeting por cargo y empresa (awareness + consideration),
                    Google para captura de demanda activa (decision). La combinación óptima depende de tu ciclo de venta
                    y ticket promedio.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Qué es ABM y cuándo usarlo?
                  </h3>
                  <p className="text-gray-600">
                    Account Based Marketing enfoca recursos en cuentas específicas de alto valor.
                    <strong> Ideal cuando tienes tickets altos (+$10M CLP)</strong>, mercado limitado de empresas objetivo,
                    y ciclos de venta largos con múltiples stakeholders.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo miden la calidad de los leads?
                  </h3>
                  <p className="text-gray-600">
                    Usamos <strong>lead scoring automatizado</strong> basado en: cargo/seniority, tamaño empresa,
                    industria, engagement con contenido, y comportamiento en sitio. Solo contamos como MQL
                    leads que cumplen criterios mínimos de calificación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios Relacionados */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Servicios para B2B</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/servicios/google-ads-chile" className="group block bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Google Ads B2B</h3>
                <p className="text-gray-600 text-sm mb-3">Campañas de búsqueda para capturar demanda activa de empresas</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Ver servicio <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/servicios/meta-ads-chile" className="group block bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">LinkedIn Ads</h3>
                <p className="text-gray-600 text-sm mb-3">Targeting por cargo, industria y empresa para leads calificados</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Ver servicio <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/servicios/seo-chile" className="group block bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">SEO B2B</h3>
                <p className="text-gray-600 text-sm mb-3">Posicionamiento para palabras clave de alta intención comercial</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Ver servicio <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Relacionados */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Artículos sobre Marketing B2B</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/marketing-b2b-agencia-marketing-digital-chile-2025" className="group block bg-white hover:bg-blue-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">B2B</span>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Marketing B2B en Chile 2025</h3>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Leer más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/blog/linkedin-ads-b2b-chile-2025" className="group block bg-white hover:bg-blue-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold mb-3">LinkedIn</span>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">LinkedIn Ads para B2B Chile 2025</h3>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Leer más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/blog/que-es-cac-como-calcularlo-reducirlo" className="group block bg-white hover:bg-blue-50 rounded-xl p-6 transition-all shadow-sm">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-3">Métricas</span>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Qué es CAC y Cómo Reducirlo</h3>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Leer más <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Generar Más Pipeline B2B?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Agenda una sesión estratégica. Analizamos tu mercado objetivo
                y diseñamos un plan de generación de leads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Propuesta B2B
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/buyer-gen"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Crear Buyer Persona
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
