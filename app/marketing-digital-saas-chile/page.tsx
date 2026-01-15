import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Code2, Rocket, Target, BarChart3, Users, CheckCircle, TrendingUp, Zap, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para SaaS en Chile | Adquisición de Usuarios | M&P',
  description: 'Agencia especializada en marketing para empresas SaaS y tecnología en Chile. Generamos trials, demos y usuarios con Google Ads, LinkedIn y Content Marketing. CAC promedio -40% vs industria.',
  keywords: 'marketing saas chile, marketing digital tecnologia, growth marketing chile, adquisicion usuarios saas, marketing b2b saas, demand generation saas chile',
  openGraph: {
    title: 'Marketing Digital para SaaS en Chile | M&P',
    description: 'Especialistas en adquisición de usuarios para SaaS. Google Ads, LinkedIn y estrategias de content marketing.',
    url: 'https://www.mulleryperez.cl/marketing-digital-saas-chile',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-saas-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-saas-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-saas-chile',
      name: 'Marketing Digital para SaaS en Chile',
      description: 'Agencia especializada en marketing digital para empresas SaaS y tecnología en Chile.',
      isPartOf: { '@id': 'https://www.mulleryperez.cl/#website' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-saas-chile#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, item: { '@id': 'https://www.mulleryperez.cl/', name: 'Inicio' } },
        { '@type': 'ListItem', position: 2, item: { '@id': 'https://www.mulleryperez.cl/industrias', name: 'Industrias' } },
        { '@type': 'ListItem', position: 3, item: { name: 'Marketing Digital SaaS' } },
      ],
    },
    {
      '@type': 'Service',
      name: 'Marketing Digital para SaaS',
      description: 'Servicio de marketing digital especializado para empresas de software y tecnología',
      provider: { '@type': 'Organization', name: 'Muller y Pérez' },
      areaServed: { '@type': 'Country', name: 'Chile' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta adquirir un usuario SaaS en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El CAC para SaaS en Chile varía según el modelo: Self-serve $15.000-40.000 CLP, Sales-assisted $80.000-200.000 CLP, Enterprise $500.000+. El factor clave es el ratio LTV:CAC que debe ser mayor a 3:1.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Google Ads o LinkedIn para SaaS B2B?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Depende de tu modelo: Google Ads para capturar demanda activa (búsquedas de solución), LinkedIn para ABM y targeting por cargo/empresa. La combinación ideal es Google para bottom-funnel y LinkedIn para top/mid funnel.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué métricas de marketing son clave para SaaS?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Las métricas SaaS esenciales son: CAC (Costo de Adquisición), LTV (Lifetime Value), Trial-to-Paid Conversion, MRR de nuevos clientes, Payback Period. El marketing debe trackear contribución a cada una.',
          },
        },
      ],
    },
  ],
}

export default function MarketingSaaSPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Code2 className="w-5 h-5 text-violet-300" />
                <span className="text-sm font-medium">Marketing para SaaS</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-violet-300">SaaS</span> en Chile
              </h1>

              <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
                Generamos trials, demos y usuarios calificados para tu software.
                Estrategias de growth probadas en startups y scale-ups de tecnología.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-violet-300">-40%</div>
                  <div className="text-sm text-purple-200">CAC vs Industria</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-violet-300">12%</div>
                  <div className="text-sm text-purple-200">Trial-to-Paid</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-violet-300">4.2x</div>
                  <div className="text-sm text-purple-200">LTV:CAC Ratio</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Cotizar Growth Plan
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular CAC para mi SaaS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Desafíos SaaS */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Entendemos los Desafíos del Marketing SaaS
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  El marketing para software es diferente. Freemiums, trials, onboarding,
                  churn... necesitas un partner que hable tu idioma.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-red-800 mb-4">Problemas Típicos</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      Trials que no convierten a paid
                    </li>
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      CAC muy alto para el LTV actual
                    </li>
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      Agencias que no entienden métricas SaaS
                    </li>
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      Leads de baja calidad que no activan
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-green-800 mb-4">Nuestra Solución</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Optimización full-funnel: signup → activation → paid
                    </li>
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Unit economics como norte (LTV:CAC, Payback)
                    </li>
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Equipo con experiencia en startups tech
                    </li>
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ICP scoring + intent data para calidad
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estrategias SaaS */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Estrategias de Growth para SaaS
                </h2>
                <p className="text-xl text-gray-600">
                  Combinamos paid, content y product marketing para crecimiento sostenible
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Google Ads para SaaS</h3>
                  <p className="text-gray-600 mb-4">
                    Captura de demanda activa con keywords de alta intención.
                    Estructura por buyer journey y competencia.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Búsquedas de solución específica
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Comparativas y alternativas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Remarketing por engagement de producto
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">LinkedIn para B2B SaaS</h3>
                  <p className="text-gray-600 mb-4">
                    ABM y targeting por cargo para llegar a decisores.
                    Ideal para Enterprise y Mid-Market.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Segmentación por cargo y empresa
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lead Gen Forms nativos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Thought leadership ads
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Content + SEO</h3>
                  <p className="text-gray-600 mb-4">
                    Contenido que rankea y convierte. Blog posts, comparativas,
                    y recursos que generan pipeline orgánico.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Artículos bottom-funnel
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Páginas de comparativa
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lead magnets técnicos
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Rocket className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Product-Led Growth</h3>
                  <p className="text-gray-600 mb-4">
                    Marketing que soporta el modelo PLG. Optimización de
                    signup, onboarding y activación.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Optimización de trial flow
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      In-app messaging
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Upgrade campaigns
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                    <Zap className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Demand Generation</h3>
                  <p className="text-gray-600 mb-4">
                    Crear demanda donde no existe. Webinars, eventos virtuales,
                    y contenido de thought leadership.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Webinars con partners
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Contenido educativo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Community building
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                    <Globe className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Expansión Regional</h3>
                  <p className="text-gray-600 mb-4">
                    Estrategias para expandir tu SaaS en LATAM desde Chile.
                    Localización y go-to-market regional.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Campañas multi-país
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Localización de contenido
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Pricing por mercado
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks SaaS */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Benchmarks SaaS Chile 2025
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-sm">
                  <thead>
                    <tr className="bg-violet-50">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Modelo SaaS</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">CAC Típico</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Trial-to-Paid</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Payback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">Self-Serve / PLG</td>
                      <td className="px-6 py-4 text-center">$15.000 - $40.000</td>
                      <td className="px-6 py-4 text-center">8-15%</td>
                      <td className="px-6 py-4 text-center">2-4 meses</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">SMB Sales-Assisted</td>
                      <td className="px-6 py-4 text-center">$80.000 - $200.000</td>
                      <td className="px-6 py-4 text-center">15-25%</td>
                      <td className="px-6 py-4 text-center">4-8 meses</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Mid-Market</td>
                      <td className="px-6 py-4 text-center">$300.000 - $800.000</td>
                      <td className="px-6 py-4 text-center">20-35%</td>
                      <td className="px-6 py-4 text-center">8-14 meses</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Enterprise</td>
                      <td className="px-6 py-4 text-center">$1.000.000+</td>
                      <td className="px-6 py-4 text-center">25-40%</td>
                      <td className="px-6 py-4 text-center">12-18 meses</td>
                    </tr>
                    <tr className="bg-violet-50 font-bold">
                      <td className="px-6 py-4">M&P Promedio</td>
                      <td className="px-6 py-4 text-center text-violet-600">-40% vs benchmark</td>
                      <td className="px-6 py-4 text-center text-violet-600">+3pp vs benchmark</td>
                      <td className="px-6 py-4 text-center text-violet-600">-25% vs industria</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Métricas que Importan */}
        <section className="py-20 bg-violet-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Las Métricas que Importan en SaaS
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-violet-300 mb-2">CAC</h3>
                  <p className="text-purple-200 text-sm">
                    Costo de Adquisición de Cliente. Incluye marketing + ventas.
                    Debe ser recuperable en menos de 12 meses.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-violet-300 mb-2">LTV:CAC</h3>
                  <p className="text-purple-200 text-sm">
                    Ratio entre valor de vida y costo de adquisición.
                    Saludable: mayor a 3:1. Ideal: mayor a 5:1.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-violet-300 mb-2">Trial-to-Paid</h3>
                  <p className="text-purple-200 text-sm">
                    % de trials que convierten a clientes pagos.
                    Benchmark: 8-15% self-serve, 20-35% sales-assisted.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-violet-300 mb-2">MRR de Marketing</h3>
                  <p className="text-purple-200 text-sm">
                    Revenue mensual atribuible a marketing.
                    Clave para medir ROI real de campañas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes sobre Marketing SaaS
              </h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto cuesta adquirir un usuario SaaS en Chile?
                  </h3>
                  <p className="text-gray-600">
                    El CAC varía según el modelo: <strong>Self-serve $15.000-40.000</strong>,
                    SMB sales-assisted $80.000-200.000, Enterprise $1.000.000+.
                    Lo importante es que el <strong>LTV:CAC sea mayor a 3:1</strong>.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Google Ads o LinkedIn para SaaS B2B?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Ambos son complementarios:</strong> Google para capturar demanda activa
                    (personas buscando solución), LinkedIn para ABM y crear demanda en cuentas específicas.
                    El mix depende de tu ACV y ciclo de venta.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Qué es Product-Led Growth y cómo se complementa con marketing?
                  </h3>
                  <p className="text-gray-600">
                    PLG usa el producto como canal principal de adquisición (freemium, trials).
                    El marketing en PLG se enfoca en <strong>generar signups calificados y optimizar
                    activación</strong>, no solo leads.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo miden el éxito en campañas SaaS?
                  </h3>
                  <p className="text-gray-600">
                    No solo leads. Medimos: <strong>Signups calificados, tasa de activación,
                    trial-to-paid, CAC por canal, MRR atribuible a marketing</strong>, y payback period.
                    Integramos con tu stack (Segment, Amplitude, etc.).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-violet-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Escalar tu SaaS?
              </h2>
              <p className="text-xl text-purple-200 mb-8">
                Agenda una sesión de growth. Analizamos tus unit economics
                y diseñamos un plan de adquisición rentable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Growth Plan
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular CAC en Predictor
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Links internos */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Recursos para SaaS</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/marketing-digital-b2b-chile" className="group block bg-white hover:bg-violet-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-2">Marketing B2B Chile</h3>
                <p className="text-gray-600 text-sm mb-3">Estrategias generales para empresas B2B</p>
                <span className="inline-flex items-center gap-1 text-sm text-violet-600 font-medium">Ver más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/labs/predictor" className="group block bg-white hover:bg-violet-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-2">Predictor de Marketing</h3>
                <p className="text-gray-600 text-sm mb-3">Simula CAC y ROI para tu SaaS</p>
                <span className="inline-flex items-center gap-1 text-sm text-violet-600 font-medium">Usar herramienta <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-fintech-chile" className="group block bg-white hover:bg-violet-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-2">Marketing Fintech</h3>
                <p className="text-gray-600 text-sm mb-3">Estrategias para fintech y servicios financieros</p>
                <span className="inline-flex items-center gap-1 text-sm text-violet-600 font-medium">Ver más <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
