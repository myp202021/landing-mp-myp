import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Cloud, Rocket, Target, BarChart3, Users, CheckCircle, TrendingUp, Zap, DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para SaaS en Chile | Growth Marketing | M&P',
  description: 'Agencia especializada en marketing para empresas SaaS en Chile. Reducimos CAC, aumentamos trials y optimizamos conversión a paid. Especialistas en PLG y SLG.',
  keywords: 'marketing saas chile, growth marketing saas, reducir cac saas, aumentar trials, marketing software chile, plg marketing chile',
  openGraph: {
    title: 'Marketing Digital para SaaS en Chile | M&P',
    description: 'Growth marketing especializado para SaaS. Reducimos CAC y aumentamos conversión.',
    url: 'https://www.mulleryperez.cl/marketing-digital-saas-chile',
    siteName: 'Müller & Pérez',
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
      description: 'Agencia especializada en growth marketing para empresas SaaS.',
    },
    {
      '@type': 'Service',
      name: 'Marketing Digital SaaS',
      description: 'Growth marketing especializado para empresas de software',
      provider: { '@type': 'Organization', name: 'Müller & Pérez' },
      areaServed: { '@type': 'Country', name: 'Chile' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuál es un buen CAC para SaaS en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El CAC ideal depende de tu LTV. La regla general es CAC:LTV de 1:3 o mejor. Para SaaS B2B en Chile, el CAC promedio es $80.000-150.000 CLP. Para SaaS B2C/SMB, $15.000-40.000 CLP.',
          },
        },
        {
          '@type': 'Question',
          name: '¿PLG o SLG para mi SaaS?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Product-Led Growth (PLG) funciona mejor con tickets bajos, productos self-service y usuarios técnicos. Sales-Led Growth (SLG) es mejor para enterprise, tickets altos y productos complejos. La mayoría de SaaS exitosos combinan ambos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo aumentar la conversión de trial a paid?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La conversión promedio trial-to-paid es 15-25%. Para mejorarla: onboarding optimizado, emails de activación, identificar el \'aha moment\', reducir fricción en upgrade, y targeting de usuarios con fit correcto desde el inicio.',
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
        <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Cloud className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">Growth Marketing SaaS</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-purple-400">SaaS</span> en Chile
              </h1>

              <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
                Reducimos tu CAC, aumentamos trials y optimizamos la conversión a paid.
                Especialistas en Product-Led Growth y Sales-Led Growth.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">-40%</div>
                  <div className="text-sm text-indigo-200">Reducción CAC</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">+85%</div>
                  <div className="text-sm text-indigo-200">Más Trials</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">28%</div>
                  <div className="text-sm text-indigo-200">Trial-to-Paid</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Cotizar Growth Plan
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular CAC/LTV
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Métricas SaaS */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Hablamos tu Idioma: Métricas SaaS
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  No nos enfocamos en vanity metrics. Optimizamos las métricas que importan para tu MRR.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                  <DollarSign className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">CAC</div>
                  <div className="text-sm text-gray-600">Customer Acquisition Cost</div>
                  <div className="mt-3 text-purple-600 font-medium">Reducimos en promedio 40%</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                  <TrendingUp className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">LTV:CAC</div>
                  <div className="text-sm text-gray-600">Lifetime Value Ratio</div>
                  <div className="mt-3 text-blue-600 font-medium">Objetivo mínimo 3:1</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                  <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">Trial-to-Paid</div>
                  <div className="text-sm text-gray-600">Conversión a cliente</div>
                  <div className="mt-3 text-green-600 font-medium">+28% promedio clientes</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
                  <Rocket className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">Activation</div>
                  <div className="text-sm text-gray-600">Usuarios que llegan al aha moment</div>
                  <div className="mt-3 text-orange-600 font-medium">Optimización de onboarding</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLG vs SLG */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  PLG + SLG: El Modelo Híbrido
                </h2>
                <p className="text-xl text-gray-600">
                  Combinamos Product-Led y Sales-Led Growth según tu producto y mercado
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Product-Led Growth</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    El producto es el principal driver de adquisición, conversión y expansión.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Freemium / Free Trial</div>
                        <div className="text-sm text-gray-600">Usuarios prueban antes de comprar</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Self-Service</div>
                        <div className="text-sm text-gray-600">Onboarding y upgrade sin fricción</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Viral Loops</div>
                        <div className="text-sm text-gray-600">El uso genera referidos naturales</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm font-medium text-purple-800">Ideal para:</div>
                    <div className="text-sm text-purple-700">Tickets bajos, usuarios técnicos, productos simples</div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Sales-Led Growth</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    El equipo de ventas guía al prospecto a través del proceso de compra.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Demo Personalizada</div>
                        <div className="text-sm text-gray-600">Llamadas de discovery y demo</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Enterprise Sales</div>
                        <div className="text-sm text-gray-600">Ciclos largos, múltiples stakeholders</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Custom Pricing</div>
                        <div className="text-sm text-gray-600">Negociación y contratos anuales</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Ideal para:</div>
                    <div className="text-sm text-blue-700">Tickets altos, enterprise, productos complejos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios SaaS */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Servicios de Growth Marketing para SaaS
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Paid Acquisition</h3>
                  <p className="text-gray-600 mb-4">
                    Google Ads y LinkedIn optimizados para signups y demos.
                    Targeting por intent y job titles.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Google Search para keywords de solución</li>
                    <li>• LinkedIn para targeting B2B</li>
                    <li>• Retargeting de visitantes y trials</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Content & SEO</h3>
                  <p className="text-gray-600 mb-4">
                    Contenido que atrae tráfico orgánico calificado
                    y posiciona tu expertise.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• SEO para keywords de problema</li>
                    <li>• Comparativas vs competencia</li>
                    <li>• Contenido de thought leadership</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Activation & Onboarding</h3>
                  <p className="text-gray-600 mb-4">
                    Optimización del onboarding para llevar
                    usuarios al aha moment más rápido.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Email sequences de activación</li>
                    <li>• In-app messaging</li>
                    <li>• A/B testing de onboarding flows</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Conversion Optimization</h3>
                  <p className="text-gray-600 mb-4">
                    Mejora de trial-to-paid y expansión de cuentas existentes.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Optimización de pricing page</li>
                    <li>• Upgrade prompts inteligentes</li>
                    <li>• Expansion revenue strategies</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Product Marketing</h3>
                  <p className="text-gray-600 mb-4">
                    Positioning, messaging y go-to-market
                    para features y productos.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Competitive positioning</li>
                    <li>• Feature launch campaigns</li>
                    <li>• Sales enablement content</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics & Attribution</h3>
                  <p className="text-gray-600 mb-4">
                    Tracking completo del funnel desde
                    first touch hasta revenue.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Multi-touch attribution</li>
                    <li>• Cohort analysis</li>
                    <li>• Revenue por canal y campaña</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Benchmarks SaaS Chile/LATAM 2025
              </h2>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Métrica</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Promedio</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900">Top 25%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">CAC B2B SaaS</td>
                      <td className="px-6 py-4 text-center">$120.000 CLP</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">$65.000 CLP</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">CAC SMB SaaS</td>
                      <td className="px-6 py-4 text-center">$35.000 CLP</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">$18.000 CLP</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Trial-to-Paid</td>
                      <td className="px-6 py-4 text-center">15%</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">25%+</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Free-to-Paid (Freemium)</td>
                      <td className="px-6 py-4 text-center">3%</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">5%+</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">LTV:CAC Ratio</td>
                      <td className="px-6 py-4 text-center">2.5:1</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">4:1+</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium">Payback Period</td>
                      <td className="px-6 py-4 text-center">18 meses</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">&lt;12 meses</td>
                    </tr>
                  </tbody>
                </table>
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
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuál es un buen CAC para SaaS en Chile?
                  </h3>
                  <p className="text-gray-600">
                    Depende de tu LTV. La regla es <strong>CAC:LTV de 1:3 o mejor</strong>. Para SaaS B2B en Chile,
                    el CAC promedio es $80.000-150.000 CLP. Para SaaS B2C/SMB, $15.000-40.000 CLP.
                    El payback period ideal es menor a 12 meses.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿PLG o SLG para mi SaaS?
                  </h3>
                  <p className="text-gray-600">
                    <strong>PLG</strong> funciona mejor con tickets bajos (&lt;$50 USD/mes), productos self-service
                    y usuarios técnicos. <strong>SLG</strong> es mejor para enterprise, tickets altos y productos
                    complejos. La mayoría de SaaS exitosos combinan ambos modelos.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo aumentar la conversión de trial a paid?
                  </h3>
                  <p className="text-gray-600">
                    La conversión promedio trial-to-paid es 15-25%. Para mejorarla: <strong>onboarding optimizado</strong>,
                    emails de activación, identificar el &apos;aha moment&apos;, reducir fricción en upgrade,
                    y targeting de usuarios con fit correcto desde el inicio.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿En qué canales debería invertir primero?
                  </h3>
                  <p className="text-gray-600">
                    Para SaaS B2B: <strong>Google Search (bottom funnel) + LinkedIn (targeting)</strong>.
                    Para SaaS SMB: Google Search + Content/SEO. El SEO es fundamental para SaaS por
                    el efecto compuesto a largo plazo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Escalar tu SaaS?
              </h2>
              <p className="text-xl text-indigo-200 mb-8">
                Agenda una sesión de growth strategy. Analizamos tu funnel,
                métricas actuales y oportunidades de mejora.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Growth Audit
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/utilidades/calculadora-cac"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Calcular mi CAC/LTV
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
