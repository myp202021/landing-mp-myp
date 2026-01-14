import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CreditCard, Shield, Target, BarChart3, Users, CheckCircle, TrendingUp, Lock, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para Fintech en Chile | Adquisición de Clientes | M&P',
  description: 'Agencia especializada en marketing para fintech y servicios financieros en Chile. Generamos clientes con campañas que cumplen regulaciones CMF. CAC optimizado para unit economics.',
  keywords: 'marketing fintech chile, marketing digital servicios financieros, publicidad fintech, adquisicion clientes fintech, marketing banca digital chile, growth fintech',
  openGraph: {
    title: 'Marketing Digital para Fintech en Chile | M&P',
    description: 'Especialistas en adquisición de clientes para fintech. Campañas que cumplen regulación CMF.',
    url: 'https://www.mulleryperez.cl/marketing-digital-fintech-chile',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-fintech-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-fintech-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-fintech-chile',
      name: 'Marketing Digital para Fintech en Chile',
      description: 'Agencia especializada en marketing digital para empresas fintech y servicios financieros en Chile.',
      isPartOf: { '@id': 'https://www.mulleryperez.cl/#website' },
    },
    {
      '@type': 'Service',
      name: 'Marketing Digital para Fintech',
      description: 'Servicio de marketing digital especializado para empresas fintech y servicios financieros',
      provider: { '@type': 'Organization', name: 'Muller y Pérez' },
      areaServed: { '@type': 'Country', name: 'Chile' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta adquirir un cliente fintech en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El CAC en fintech chileno varía: Cuentas digitales $25.000-60.000 CLP, Créditos $80.000-200.000 CLP, Inversiones $100.000-300.000 CLP. El LTV debe ser al menos 3x el CAC para ser sostenible.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué regulaciones afectan la publicidad fintech en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La CMF regula la publicidad de servicios financieros. Requiere: información clara de tasas y costos, disclaimers sobre riesgos, prohibición de promesas de rentabilidad garantizada, y registro de campañas en algunos casos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Google Ads o Meta Ads para fintech?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Ads para capturar demanda activa (personas buscando soluciones financieras). Meta Ads para awareness y educación financiera. Ambos requieren verificación de anunciante financiero.',
          },
        },
      ],
    },
  ],
}

export default function MarketingFintechPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <CreditCard className="w-5 h-5 text-emerald-300" />
                <span className="text-sm font-medium">Marketing para Fintech</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-emerald-300">Fintech</span> en Chile
              </h1>

              <p className="text-xl text-teal-200 mb-8 max-w-3xl mx-auto">
                Adquisición de clientes para servicios financieros digitales.
                Campañas que cumplen regulaciones CMF y optimizan unit economics.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-300">$45.000</div>
                  <div className="text-sm text-teal-200">CAC Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-300">4.5x</div>
                  <div className="text-sm text-teal-200">LTV:CAC Ratio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-300">100%</div>
                  <div className="text-sm text-teal-200">Compliance CMF</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Cotizar Plan Fintech
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular CAC para mi Fintech
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Desafíos Fintech */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Entendemos los Desafíos del Marketing Fintech
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Marketing financiero requiere expertise específico. Regulaciones,
                  confianza del usuario, y unit economics complejos.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-red-800 mb-4">Problemas Comunes</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      Campañas rechazadas por incumplimiento regulatorio
                    </li>
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      CAC muy alto para el LTV del producto
                    </li>
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      Usuarios que no completan onboarding (KYC)
                    </li>
                    <li className="flex items-start gap-3 text-red-700">
                      <span className="text-red-500 mt-1">✗</span>
                      Desconfianza en servicios financieros nuevos
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-green-800 mb-4">Nuestra Solución</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Expertise en regulación CMF y compliance publicitario
                    </li>
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Optimización por LTV, no solo por lead
                    </li>
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Funnel completo: signup → KYC → activación
                    </li>
                    <li className="flex items-start gap-3 text-green-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      Contenido de educación financiera para trust
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tipos de Fintech */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Estrategias por Tipo de Fintech
                </h2>
                <p className="text-xl text-gray-600">
                  Cada vertical fintech tiene sus propios desafíos y oportunidades
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                    <CreditCard className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Cuentas Digitales</h3>
                  <p className="text-gray-600 mb-4">
                    Neobancos y cuentas vista. Foco en volumen y activación.
                    CAC objetivo bajo con alto potencial de cross-sell.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Campañas de referidos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Optimización de KYC flow
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Activation campaigns
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Building2 className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Créditos y Lending</h3>
                  <p className="text-gray-600 mb-4">
                    Créditos de consumo, hipotecarios, y BNPL.
                    Alto LTV pero CAC elevado.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lead scoring por probabilidad de aprobación
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Comparadores y simuladores
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Remarketing largo (60-90 días)
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Inversiones</h3>
                  <p className="text-gray-600 mb-4">
                    Brokers, robo-advisors, y plataformas de inversión.
                    Alto AUM goal, educación es clave.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Content marketing educativo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Webinars y eventos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Nurturing por perfil de riesgo
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Seguros Digitales</h3>
                  <p className="text-gray-600 mb-4">
                    Insurtech y seguros embebidos.
                    Oportunidad en nichos específicos.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Cotizadores online
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Segmentación por momento de vida
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Partnerships con e-commerce
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-cyan-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Pagos y Remesas</h3>
                  <p className="text-gray-600 mb-4">
                    Procesadores de pago, wallets, y transferencias internacionales.
                    Volumen es clave.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Campañas de merchant acquisition
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      B2B para e-commerce
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Comunidades de migrantes (remesas)
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                    <Lock className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Fintech B2B</h3>
                  <p className="text-gray-600 mb-4">
                    Factoring, tesorería, y servicios para empresas.
                    Ciclos largos, alto ticket.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      LinkedIn Ads para CFOs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Content de thought leadership
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      ABM para grandes empresas
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-20 bg-emerald-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Compliance Publicitario para Fintech
                </h2>
                <p className="text-xl text-emerald-200">
                  Campañas que cumplen regulaciones CMF y políticas de plataformas
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">Transparencia</h3>
                  <p className="text-emerald-200 text-sm">
                    Información clara de tasas, CAE, y costos totales.
                    Sin letra chica escondida.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">Disclaimers</h3>
                  <p className="text-emerald-200 text-sm">
                    Advertencias de riesgo cuando corresponde.
                    Formato según normativa CMF.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">Verificación</h3>
                  <p className="text-emerald-200 text-sm">
                    Proceso de verificación de anunciante financiero
                    en Google y Meta completado.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">Prohibiciones</h3>
                  <p className="text-emerald-200 text-sm">
                    Evitamos claims prohibidos: rentabilidad garantizada,
                    comparaciones engañosas, urgencia artificial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks Fintech */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Benchmarks Fintech Chile 2025
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-sm">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Tipo Fintech</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">CAC Típico</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">LTV Promedio</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Ciclo Activación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">Cuentas Digitales</td>
                      <td className="px-6 py-4 text-center">$25.000 - $60.000</td>
                      <td className="px-6 py-4 text-center">$150.000 - $400.000</td>
                      <td className="px-6 py-4 text-center">7-14 días</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Créditos Consumo</td>
                      <td className="px-6 py-4 text-center">$80.000 - $200.000</td>
                      <td className="px-6 py-4 text-center">$500.000 - $2.000.000</td>
                      <td className="px-6 py-4 text-center">3-7 días</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Inversiones</td>
                      <td className="px-6 py-4 text-center">$100.000 - $300.000</td>
                      <td className="px-6 py-4 text-center">$800.000 - $5.000.000</td>
                      <td className="px-6 py-4 text-center">14-30 días</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Seguros Digital</td>
                      <td className="px-6 py-4 text-center">$15.000 - $50.000</td>
                      <td className="px-6 py-4 text-center">$200.000 - $600.000</td>
                      <td className="px-6 py-4 text-center">1-3 días</td>
                    </tr>
                    <tr className="bg-emerald-50 font-bold">
                      <td className="px-6 py-4">M&P Promedio</td>
                      <td className="px-6 py-4 text-center text-emerald-600">-35% vs benchmark</td>
                      <td className="px-6 py-4 text-center text-emerald-600">+20% activación</td>
                      <td className="px-6 py-4 text-center text-emerald-600">-40% tiempo</td>
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
                Preguntas Frecuentes sobre Marketing Fintech
              </h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto cuesta adquirir un cliente fintech en Chile?
                  </h3>
                  <p className="text-gray-600">
                    Depende del producto: <strong>Cuentas digitales $25.000-60.000</strong>,
                    Créditos $80.000-200.000, Inversiones $100.000-300.000.
                    Lo clave es que el <strong>LTV sea al menos 3x el CAC</strong>.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Qué regulaciones afectan la publicidad fintech?
                  </h3>
                  <p className="text-gray-600">
                    La <strong>CMF regula publicidad de servicios financieros</strong>. Requiere:
                    transparencia en tasas y costos, disclaimers de riesgo, prohibición de
                    promesas de rentabilidad garantizada. También hay políticas de Google y Meta
                    que requieren verificación de anunciante financiero.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo generar confianza en una fintech nueva?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Trust signals son críticos:</strong> certificaciones y regulaciones visibles,
                    testimonios de usuarios reales, contenido educativo transparente, partnerships con
                    marcas conocidas, y presencia en medios de comunicación.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo optimizar el funnel de onboarding (KYC)?
                  </h3>
                  <p className="text-gray-600">
                    El KYC es donde se pierde más usuarios. Optimizamos:
                    <strong> UX del proceso de verificación, comunicación clara de pasos,
                    remarketing para abandonos</strong>, y seguimiento multicanal (email, SMS, WhatsApp)
                    para completar el proceso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Escalar tu Fintech?
              </h2>
              <p className="text-xl text-teal-200 mb-8">
                Agenda una sesión estratégica. Analizamos tus unit economics
                y diseñamos un plan de adquisición compliant y rentable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Plan Fintech
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Recursos para Fintech</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/marketing-digital-b2b-chile" className="group block bg-white hover:bg-emerald-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Marketing B2B Chile</h3>
                <p className="text-gray-600 text-sm mb-3">Estrategias generales para empresas B2B</p>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">Ver más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-saas-chile" className="group block bg-white hover:bg-emerald-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Marketing SaaS</h3>
                <p className="text-gray-600 text-sm mb-3">Estrategias para software y tecnología</p>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">Ver más <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/labs/predictor" className="group block bg-white hover:bg-emerald-50 rounded-xl p-6 transition-all border border-gray-100">
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Predictor de Marketing</h3>
                <p className="text-gray-600 text-sm mb-3">Simula CAC y ROI para tu fintech</p>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">Usar herramienta <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
