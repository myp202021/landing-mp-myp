import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Scale, FileText, Users, Shield, Search, Phone, CheckCircle, TrendingUp, Award, Building2, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para Abogados y Estudios Jurídicos en Chile | M&P',
  description: 'Agencia de marketing digital especializada en el sector legal en Chile. Generamos leads calificados para abogados, estudios jurídicos y servicios legales con Google Ads y SEO.',
  keywords: 'marketing digital abogados chile, marketing estudios jurídicos, publicidad abogados, SEO abogados chile, google ads abogados, leads abogados',
  openGraph: {
    title: 'Marketing Digital para Abogados en Chile | M&P',
    description: 'Especialistas en marketing para el sector legal. Leads calificados para abogados y estudios jurídicos.',
    url: 'https://www.mulleryperez.cl/marketing-digital-legal-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-legal-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-legal-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-legal-chile',
      name: 'Marketing Digital para Abogados y Estudios Jurídicos en Chile',
      description: 'Agencia especializada en marketing digital para el sector legal en Chile.',
      isPartOf: { '@id': 'https://www.mulleryperez.cl/#website' },
      breadcrumb: { '@id': 'https://www.mulleryperez.cl/marketing-digital-legal-chile#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-legal-chile#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, item: { '@id': 'https://www.mulleryperez.cl/', name: 'Inicio' } },
        { '@type': 'ListItem', position: 2, item: { '@id': 'https://www.mulleryperez.cl/industrias', name: 'Industrias' } },
        { '@type': 'ListItem', position: 3, item: { name: 'Marketing Digital Legal' } },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-legal-chile#service',
      name: 'Marketing Digital para Sector Legal',
      description: 'Servicio especializado de marketing digital para abogados y estudios jurídicos en Chile',
      provider: {
        '@type': 'Organization',
        name: 'Müller & Pérez',
        url: 'https://www.mulleryperez.cl',
      },
      areaServed: { '@type': 'Country', name: 'Chile' },
      serviceType: 'Marketing Digital Legal',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Pueden los abogados hacer publicidad en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, los abogados pueden hacer publicidad en Chile cumpliendo las normas del Colegio de Abogados. La publicidad debe ser veraz, no puede garantizar resultados y debe mantener la dignidad de la profesión. En M&P conocemos estas regulaciones y creamos campañas que cumplen con el código de ética.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta el marketing digital para abogados?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La inversión mínima recomendada es de $600.000 CLP mensuales en gestión + inversión publicitaria. El presupuesto en Google Ads para abogados parte desde $800.000 CLP/mes. El CPL (costo por lead) promedio en sector legal es de $18.000-35.000 CLP.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué tipo de casos puedo captar con Google Ads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Ads es efectivo para captar casos de derecho de familia, laboral, civil, accidentes, cobranza y servicios corporativos. Las palabras clave de alta intención como "abogado divorcio Santiago" o "demanda laboral" generan leads muy calificados.',
          },
        },
      ],
    },
  ],
}

const services = [
  {
    icon: Search,
    title: 'Google Ads para Abogados',
    description: 'Campañas de búsqueda para captar clientes que necesitan servicios legales específicos. Segmentación por tipo de caso y ubicación.',
    features: ['Palabras clave de alta intención', 'Extensiones de llamada', 'Landing pages especializadas'],
  },
  {
    icon: TrendingUp,
    title: 'SEO Legal',
    description: 'Posicionamiento orgánico para aparecer en búsquedas como "abogado laboral Santiago" o "estudio jurídico Las Condes".',
    features: ['SEO local por comuna', 'Contenido legal optimizado', 'Google Business Profile'],
  },
  {
    icon: FileText,
    title: 'Contenido Legal',
    description: 'Artículos y recursos que demuestran expertise y captan tráfico orgánico de potenciales clientes.',
    features: ['Blog jurídico', 'Guías legales descargables', 'FAQ por área de práctica'],
  },
  {
    icon: Users,
    title: 'Gestión de Reputación',
    description: 'Estrategias para construir autoridad y confianza online, esencial para el sector legal.',
    features: ['Reviews en Google', 'Testimonios de clientes', 'Directorio de abogados'],
  },
]

const areas = [
  { name: 'Derecho de Familia', desc: 'Divorcio, pensión alimenticia, custodia' },
  { name: 'Derecho Laboral', desc: 'Despidos, demandas, finiquitos' },
  { name: 'Derecho Civil', desc: 'Contratos, cobranza, arriendos' },
  { name: 'Accidentes y Daños', desc: 'Indemnizaciones, seguros' },
  { name: 'Derecho Corporativo', desc: 'Sociedades, compliance, M&A' },
  { name: 'Derecho Penal', desc: 'Defensas, querellas' },
]

export default function MarketingLegalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Scale className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">Marketing Legal Especializado</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-amber-400">Abogados</span> en Chile
              </h1>

              <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
                Generamos leads calificados para estudios jurídicos y abogados independientes.
                Conocemos las regulaciones éticas y creamos campañas que construyen autoridad.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-amber-400">$22.000</div>
                  <div className="text-sm text-slate-300">CPL Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-amber-400">35%</div>
                  <div className="text-sm text-slate-300">Tasa de Conversión</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-amber-400">6.5x</div>
                  <div className="text-sm text-slate-300">ROI Promedio</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Cotizar Ahora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/portafolio"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Ver Casos de Éxito
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Por qué Marketing Legal */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                ¿Por Qué Marketing Digital para tu Estudio Jurídico?
              </h2>
              <p className="text-xl text-gray-600">
                El 76% de las personas busca abogados en Google antes de tomar una decisión.
                Si tu estudio no aparece, estás perdiendo casos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                  <Search className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Captura Demanda Existente</h3>
                <p className="text-gray-600">
                  Miles de personas buscan abogados cada día en Google.
                  Capturamos esa demanda con campañas de búsqueda optimizadas.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cumplimiento Ético</h3>
                <p className="text-gray-600">
                  Conocemos las regulaciones del Colegio de Abogados.
                  Tu publicidad será profesional y cumplirá el código de ética.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Construye Autoridad</h3>
                <p className="text-gray-600">
                  Posiciona tu estudio como referente en tu área de práctica
                  con contenido de valor y presencia digital estratégica.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Servicios de Marketing para el Sector Legal
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Estrategias diseñadas específicamente para abogados y estudios jurídicos
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                      <service.icon className="w-7 h-7 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Áreas de Práctica */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Áreas de Práctica que Atendemos
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Experiencia en marketing para todas las especialidades legales
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {areas.map((area, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Scale className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{area.name}</h3>
                  <p className="text-slate-300 text-sm">{area.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes sobre Marketing Legal
              </h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Pueden los abogados hacer publicidad en Chile?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Sí</strong>, los abogados pueden hacer publicidad en Chile cumpliendo las normas del Colegio de Abogados.
                    La publicidad debe ser veraz, no puede garantizar resultados y debe mantener la dignidad de la profesión.
                    En M&P conocemos estas regulaciones y creamos campañas que cumplen con el código de ética.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto cuesta el marketing digital para abogados?
                  </h3>
                  <p className="text-gray-600">
                    La inversión mínima recomendada es de <strong>$600.000 CLP mensuales</strong> en gestión + inversión publicitaria.
                    El presupuesto en Google Ads para abogados parte desde <strong>$800.000 CLP/mes</strong>.
                    El CPL (costo por lead) promedio en sector legal es de $18.000-35.000 CLP dependiendo del área de práctica.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Qué tipo de casos puedo captar con Google Ads?
                  </h3>
                  <p className="text-gray-600">
                    Google Ads es efectivo para captar casos de <strong>derecho de familia, laboral, civil, accidentes, cobranza
                    y servicios corporativos</strong>. Las palabras clave de alta intención como &quot;abogado divorcio Santiago&quot;
                    o &quot;demanda laboral&quot; generan leads muy calificados con alta tasa de conversión.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Google Ads o SEO para mi estudio jurídico?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Ambos son complementarios</strong>. Google Ads genera resultados inmediatos y te permite captar casos urgentes.
                    El SEO es una inversión a mediano plazo que reduce costos y construye autoridad.
                    Recomendamos comenzar con Google Ads mientras se trabaja el posicionamiento orgánico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industrias Relacionadas */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Industrias Relacionadas</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/marketing-digital-b2b-chile" className="group block bg-slate-50 hover:bg-slate-100 rounded-xl p-6 transition-all border border-slate-100">
                <Building2 className="w-8 h-8 text-slate-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-slate-600 transition-colors mb-2">B2B / Empresas</h3>
                <p className="text-gray-600 text-sm mb-3">Servicios legales corporativos, compliance y asesoría empresarial</p>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-servicios-profesionales-chile" className="group block bg-cyan-50 hover:bg-cyan-100 rounded-xl p-6 transition-all border border-cyan-100">
                <Briefcase className="w-8 h-8 text-cyan-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors mb-2">Servicios Profesionales</h3>
                <p className="text-gray-600 text-sm mb-3">Contadores, consultores y profesionales independientes</p>
                <span className="inline-flex items-center gap-1 text-sm text-cyan-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-seguros-chile" className="group block bg-emerald-50 hover:bg-emerald-100 rounded-xl p-6 transition-all border border-emerald-100">
                <Shield className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Seguros</h3>
                <p className="text-gray-600 text-sm mb-3">Corredores de seguros y gestión de siniestros</p>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Captar Más Casos?
              </h2>
              <p className="text-xl text-slate-200 mb-8">
                Agenda una reunión estratégica gratuita. Analizamos tu práctica legal y
                diseñamos una estrategia de marketing ética y efectiva.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Propuesta
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+56912345678"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Llamar Ahora
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
