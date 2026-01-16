import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Shield, FileCheck, Users, Phone, Heart, Car, Home, Umbrella, CheckCircle, TrendingUp, Building2, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para Seguros y Corredores en Chile | M&P',
  description: 'Agencia de marketing digital especializada en seguros en Chile. Generamos leads calificados para corredores de seguros, aseguradoras y agentes con Google Ads y SEO.',
  keywords: 'marketing digital seguros chile, marketing corredores de seguros, publicidad seguros, SEO seguros chile, google ads seguros, leads seguros',
  openGraph: {
    title: 'Marketing Digital para Seguros en Chile | M&P',
    description: 'Especialistas en marketing para el sector asegurador. Leads calificados para corredores y aseguradoras.',
    url: 'https://www.mulleryperez.cl/marketing-digital-seguros-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-seguros-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-seguros-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-seguros-chile',
      name: 'Marketing Digital para Seguros y Corredores en Chile',
      description: 'Agencia especializada en marketing digital para el sector asegurador en Chile.',
      isPartOf: { '@id': 'https://www.mulleryperez.cl/#website' },
      breadcrumb: { '@id': 'https://www.mulleryperez.cl/marketing-digital-seguros-chile#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-seguros-chile#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, item: { '@id': 'https://www.mulleryperez.cl/', name: 'Inicio' } },
        { '@type': 'ListItem', position: 2, item: { '@id': 'https://www.mulleryperez.cl/industrias', name: 'Industrias' } },
        { '@type': 'ListItem', position: 3, item: { name: 'Marketing Digital Seguros' } },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-seguros-chile#service',
      name: 'Marketing Digital para Sector Seguros',
      description: 'Servicio especializado de marketing digital para corredores de seguros y aseguradoras en Chile',
      provider: {
        '@type': 'Organization',
        name: 'Müller & Pérez',
        url: 'https://www.mulleryperez.cl',
      },
      areaServed: { '@type': 'Country', name: 'Chile' },
      serviceType: 'Marketing Digital Seguros',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta un lead de seguros en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El costo por lead varía según el tipo de seguro: Auto $8.000-15.000 CLP, Vida $12.000-25.000 CLP, Salud $15.000-30.000 CLP, Hogar $10.000-18.000 CLP. La calidad del lead depende de la segmentación y landing page.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué canal es mejor para vender seguros online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Ads es el canal más efectivo para seguros por la intención de búsqueda. Meta Ads funciona bien para awareness y remarketing. La combinación de ambos con email marketing genera los mejores resultados.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puedo hacer marketing digital para seguros regulados?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, cumpliendo las normativas de la CMF y Superintendencia de Valores y Seguros. La publicidad debe ser veraz, indicar condiciones relevantes y no generar expectativas falsas. En M&P creamos campañas que cumplen todas las regulaciones.',
          },
        },
      ],
    },
  ],
}

const services = [
  {
    icon: TrendingUp,
    title: 'Google Ads para Seguros',
    description: 'Campañas de búsqueda optimizadas para captar clientes buscando cotizaciones de seguros específicos.',
    features: ['Segmentación por tipo de seguro', 'Extensiones de llamada', 'Comparadores de seguros'],
  },
  {
    icon: Users,
    title: 'Meta Ads para Awareness',
    description: 'Campañas en Facebook e Instagram para generar conocimiento de marca y remarketing.',
    features: ['Audiencias lookalike', 'Remarketing dinámico', 'Lead ads optimizados'],
  },
  {
    icon: FileCheck,
    title: 'Landing Pages de Cotización',
    description: 'Páginas optimizadas para maximizar conversiones con formularios de cotización efectivos.',
    features: ['Formularios multi-step', 'Cotizadores automáticos', 'Integración CRM'],
  },
  {
    icon: Phone,
    title: 'Call Tracking',
    description: 'Seguimiento de llamadas telefónicas para medir ROI real de tus campañas publicitarias.',
    features: ['Grabación de llamadas', 'Atribución de campañas', 'Scoring de leads'],
  },
]

const tiposSeguros = [
  { icon: Car, name: 'Seguro Automotriz', desc: 'SOAP, seguro auto, terceros' },
  { icon: Heart, name: 'Seguro de Vida', desc: 'Vida individual, APV, rentas' },
  { icon: Home, name: 'Seguro Hogar', desc: 'Incendio, contenido, sismo' },
  { icon: Umbrella, name: 'Seguros Generales', desc: 'Viaje, mascotas, responsabilidad' },
  { icon: Building2, name: 'Seguros Empresariales', desc: 'PYME, D&O, cyber' },
  { icon: Users, name: 'Seguros Colectivos', desc: 'Salud, vida, accidentes' },
]

export default function MarketingSegurosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5 text-emerald-300" />
                <span className="text-sm font-medium">Marketing para Seguros</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-emerald-300">Seguros</span> en Chile
              </h1>

              <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                Generamos leads calificados para corredores de seguros, aseguradoras y agentes.
                Estrategias que cumplen normativas CMF y maximizan conversiones.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-300">$12.000</div>
                  <div className="text-sm text-emerald-200">CPL Seguro Auto</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-300">28%</div>
                  <div className="text-sm text-emerald-200">Tasa Cierre</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-300">5.8x</div>
                  <div className="text-sm text-emerald-200">ROI Promedio</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-900 font-bold px-8 py-4 rounded-lg transition-colors"
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

        {/* Por qué Marketing Seguros */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                El Mercado de Seguros se Cotiza Online
              </h2>
              <p className="text-xl text-gray-600">
                El 68% de los chilenos compara seguros en internet antes de contratar.
                Si no estás visible, estás perdiendo ventas frente a la competencia digital.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Captura Cotizaciones</h3>
                <p className="text-gray-600">
                  Las búsquedas como &quot;cotizar seguro auto&quot; tienen alta intención.
                  Convertimos esas búsquedas en cotizaciones para tu correduría.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cumplimiento Regulatorio</h3>
                <p className="text-gray-600">
                  Conocemos las normativas CMF. Tu publicidad será efectiva
                  y cumplirá con todas las regulaciones del sector.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Leads Calificados</h3>
                <p className="text-gray-600">
                  No solo generamos leads, los calificamos.
                  Recibes prospectos con datos completos listos para cotizar.
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
                  Servicios de Marketing para Seguros
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Estrategias específicas para el sector asegurador chileno
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                      <service.icon className="w-7 h-7 text-emerald-600" />
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

        {/* Tipos de Seguros */}
        <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tipos de Seguros que Promocionamos
              </h2>
              <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
                Experiencia en todas las líneas de seguros del mercado chileno
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {tiposSeguros.map((tipo, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <tipo.icon className="w-8 h-8 text-emerald-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{tipo.name}</h3>
                  <p className="text-emerald-200 text-sm">{tipo.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benchmarks */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                CPL por Tipo de Seguro en Chile
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <Car className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">$12.000</div>
                  <div className="text-gray-600 font-medium">Seguro Auto</div>
                  <div className="text-sm text-gray-500 mt-2">CPL promedio</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <Heart className="w-10 h-10 text-red-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">$18.000</div>
                  <div className="text-gray-600 font-medium">Seguro Vida</div>
                  <div className="text-sm text-gray-500 mt-2">CPL promedio</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <Home className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">$14.000</div>
                  <div className="text-gray-600 font-medium">Seguro Hogar</div>
                  <div className="text-sm text-gray-500 mt-2">CPL promedio</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <Users className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">$25.000</div>
                  <div className="text-gray-600 font-medium">Seguro Salud</div>
                  <div className="text-sm text-gray-500 mt-2">CPL promedio</div>
                </div>
              </div>

              <p className="text-center text-gray-500 mt-8 text-sm">
                *CPL referencial basado en campañas de Google Ads en Chile 2024-2025
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes sobre Marketing de Seguros
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto cuesta un lead de seguros en Chile?
                  </h3>
                  <p className="text-gray-600">
                    El costo por lead varía según el tipo de seguro: <strong>Auto $8.000-15.000 CLP</strong>,
                    <strong> Vida $12.000-25.000 CLP</strong>, <strong>Salud $15.000-30.000 CLP</strong>,
                    <strong> Hogar $10.000-18.000 CLP</strong>. La calidad del lead depende de la segmentación y landing page.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Qué canal es mejor para vender seguros online?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Google Ads</strong> es el canal más efectivo para seguros por la intención de búsqueda.
                    <strong> Meta Ads</strong> funciona bien para awareness y remarketing.
                    La combinación de ambos con email marketing genera los mejores resultados.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Puedo hacer marketing digital para seguros regulados?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Sí</strong>, cumpliendo las normativas de la CMF y Superintendencia de Valores y Seguros.
                    La publicidad debe ser veraz, indicar condiciones relevantes y no generar expectativas falsas.
                    En M&P creamos campañas que cumplen todas las regulaciones.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo compito contra las grandes aseguradoras?
                  </h3>
                  <p className="text-gray-600">
                    Los corredores independientes tienen ventajas: atención personalizada, cotizaciones de múltiples compañías
                    y mejor servicio post-venta. Destacamos estos diferenciadores en las campañas para captar
                    clientes que buscan asesoría experta, no solo precio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industrias Relacionadas */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Industrias Relacionadas</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/marketing-digital-fintech-chile" className="group block bg-teal-50 hover:bg-teal-100 rounded-xl p-6 transition-all border border-teal-100">
                <Building2 className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors mb-2">Fintech</h3>
                <p className="text-gray-600 text-sm mb-3">Insurtech, seguros digitales y plataformas de comparación</p>
                <span className="inline-flex items-center gap-1 text-sm text-teal-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-legal-chile" className="group block bg-slate-50 hover:bg-slate-100 rounded-xl p-6 transition-all border border-slate-100">
                <Briefcase className="w-8 h-8 text-slate-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-slate-600 transition-colors mb-2">Legal</h3>
                <p className="text-gray-600 text-sm mb-3">Abogados especializados en seguros y siniestros</p>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-b2b-chile" className="group block bg-blue-50 hover:bg-blue-100 rounded-xl p-6 transition-all border border-blue-100">
                <Users className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">B2B / Empresas</h3>
                <p className="text-gray-600 text-sm mb-3">Seguros corporativos, PYME y colectivos</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Generar Más Cotizaciones?
              </h2>
              <p className="text-xl text-emerald-100 mb-8">
                Agenda una reunión estratégica gratuita. Analizamos tu correduría y
                diseñamos una estrategia de captación de leads efectiva.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-900 font-bold px-8 py-4 rounded-lg transition-colors"
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
