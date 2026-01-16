import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Factory, Cog, Package, Truck, BarChart3, Users, CheckCircle, TrendingUp, Phone, Globe, Building2, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para Manufactura e Industria en Chile | M&P',
  description: 'Agencia de marketing digital especializada en manufactura e industria en Chile. Generamos leads B2B para fábricas, distribuidores industriales y empresas manufactureras.',
  keywords: 'marketing digital manufactura chile, marketing industrial, publicidad fabricas, marketing B2B industrial, leads manufactura, marketing sector industrial',
  openGraph: {
    title: 'Marketing Digital para Manufactura en Chile | M&P',
    description: 'Especialistas en marketing para el sector manufacturero e industrial. Leads B2B calificados.',
    url: 'https://www.mulleryperez.cl/marketing-digital-manufactura-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-manufactura-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-manufactura-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-manufactura-chile',
      name: 'Marketing Digital para Manufactura e Industria en Chile',
      description: 'Agencia especializada en marketing digital para el sector manufacturero e industrial en Chile.',
      isPartOf: { '@id': 'https://www.mulleryperez.cl/#website' },
      breadcrumb: { '@id': 'https://www.mulleryperez.cl/marketing-digital-manufactura-chile#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-manufactura-chile#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, item: { '@id': 'https://www.mulleryperez.cl/', name: 'Inicio' } },
        { '@type': 'ListItem', position: 2, item: { '@id': 'https://www.mulleryperez.cl/industrias', name: 'Industrias' } },
        { '@type': 'ListItem', position: 3, item: { name: 'Marketing Digital Manufactura' } },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-manufactura-chile#service',
      name: 'Marketing Digital para Sector Manufacturero',
      description: 'Servicio especializado de marketing digital para fábricas e industria manufacturera en Chile',
      provider: {
        '@type': 'Organization',
        name: 'Müller & Pérez',
        url: 'https://www.mulleryperez.cl',
      },
      areaServed: { '@type': 'Country', name: 'Chile' },
      serviceType: 'Marketing Digital Manufactura',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Funciona el marketing digital para empresas manufactureras?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutamente. El 67% de los compradores industriales investigan online antes de contactar proveedores. Google Ads y LinkedIn Ads son especialmente efectivos para captar decisores de compra B2B en el sector manufacturero.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta un lead industrial en Chile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El CPL en manufactura varía entre $25.000-80.000 CLP dependiendo del nicho. Los tickets altos de venta B2B justifican estos costos. Un solo cliente puede representar contratos de millones de pesos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué canales usar para marketing industrial?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Ads captura búsquedas de productos específicos. LinkedIn Ads permite segmentar por cargo, industria y tamaño de empresa. El content marketing técnico y SEO generan leads a largo plazo.',
          },
        },
      ],
    },
  ],
}

const services = [
  {
    icon: TrendingUp,
    title: 'Google Ads Industrial',
    description: 'Campañas de búsqueda para captar compradores industriales buscando productos y proveedores específicos.',
    features: ['Keywords técnicos de nicho', 'Campañas de productos', 'Remarketing B2B'],
  },
  {
    icon: Users,
    title: 'LinkedIn Ads B2B',
    description: 'Segmentación precisa de decisores de compra: gerentes de operaciones, compras e ingeniería.',
    features: ['Segmentación por cargo', 'Lead Gen Forms', 'Account Based Marketing'],
  },
  {
    icon: Globe,
    title: 'SEO Industrial',
    description: 'Posicionamiento para búsquedas técnicas y de productos manufacturados.',
    features: ['SEO de fichas técnicas', 'Content marketing industrial', 'Catálogos online'],
  },
  {
    icon: BarChart3,
    title: 'Analítica B2B',
    description: 'Tracking del ciclo de venta largo, atribución de leads y ROI por canal.',
    features: ['CRM integration', 'Lead scoring', 'Pipeline analytics'],
  },
]

const sectores = [
  { icon: Factory, name: 'Fábricas y Plantas', desc: 'Producción industrial, maquinaria' },
  { icon: Cog, name: 'Metalmecánica', desc: 'Tornería, soldadura, estructuras' },
  { icon: Package, name: 'Embalaje y Packaging', desc: 'Envases, cajas, etiquetas' },
  { icon: Truck, name: 'Logística Industrial', desc: 'Almacenaje, distribución' },
  { icon: Wrench, name: 'Mantención Industrial', desc: 'Servicios técnicos, repuestos' },
  { icon: Building2, name: 'Insumos Industriales', desc: 'Materias primas, químicos' },
]

const beneficios = [
  { stat: '67%', desc: 'Compradores B2B investigan online' },
  { stat: '$45M', desc: 'Ticket promedio cliente industrial' },
  { stat: '18 meses', desc: 'Ciclo de vida promedio cliente' },
  { stat: '12x', desc: 'ROI promedio en B2B industrial' },
]

export default function MarketingManufacturaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Factory className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-medium">Marketing Industrial B2B</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-orange-400">Manufactura</span> en Chile
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Generamos leads B2B calificados para fábricas, distribuidores industriales y empresas manufactureras.
                Estrategias que entienden ciclos de venta largos y tickets altos.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-orange-400">$35.000</div>
                  <div className="text-sm text-gray-300">CPL Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-orange-400">12x</div>
                  <div className="text-sm text-gray-300">ROI Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-orange-400">85%</div>
                  <div className="text-sm text-gray-300">Leads Calificados</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
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

        {/* Stats Section */}
        <section className="py-16 bg-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-4 gap-6">
                {beneficios.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{item.stat}</div>
                    <div className="text-gray-600 text-sm">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Por qué Marketing Industrial */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                El Comprador Industrial También Está en Digital
              </h2>
              <p className="text-xl text-gray-600">
                El 67% de los decisores de compra B2B investigan proveedores online
                antes de solicitar una cotización. Si tu empresa no aparece, pierdes oportunidades.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Captura Demanda Técnica</h3>
                <p className="text-gray-600">
                  Búsquedas específicas como &quot;fabricante de envases PET Santiago&quot;
                  o &quot;tornería CNC Chile&quot; tienen alta intención de compra.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Alcanza Decisores</h3>
                <p className="text-gray-600">
                  LinkedIn Ads permite llegar directamente a gerentes de compras,
                  operaciones e ingeniería en empresas objetivo.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">ROI Medible</h3>
                <p className="text-gray-600">
                  Con tickets altos, cada cliente justifica la inversión.
                  Integramos CRM para trackear el ciclo completo de venta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Servicios de Marketing Industrial
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Estrategias B2B diseñadas para ciclos de venta largos y decisiones de compra complejas
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                      <service.icon className="w-7 h-7 text-orange-600" />
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

        {/* Sectores */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-slate-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sectores Manufactureros que Atendemos
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experiencia en diversos nichos del sector industrial chileno
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {sectores.map((sector, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <sector.icon className="w-8 h-8 text-orange-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{sector.name}</h3>
                  <p className="text-gray-300 text-sm">{sector.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes sobre Marketing Industrial
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Funciona el marketing digital para empresas manufactureras?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Absolutamente</strong>. El 67% de los compradores industriales investigan online antes de contactar
                    proveedores. Google Ads y LinkedIn Ads son especialmente efectivos para captar decisores de compra B2B
                    en el sector manufacturero.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto cuesta un lead industrial en Chile?
                  </h3>
                  <p className="text-gray-600">
                    El CPL en manufactura varía entre <strong>$25.000-80.000 CLP</strong> dependiendo del nicho.
                    Los tickets altos de venta B2B justifican estos costos.
                    Un solo cliente puede representar contratos de millones de pesos al año.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Qué canales usar para marketing industrial?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Google Ads</strong> captura búsquedas de productos específicos.
                    <strong> LinkedIn Ads</strong> permite segmentar por cargo, industria y tamaño de empresa.
                    El <strong>content marketing técnico</strong> y SEO generan leads a largo plazo con autoridad de marca.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo manejar ciclos de venta largos?
                  </h3>
                  <p className="text-gray-600">
                    Implementamos <strong>nurturing de leads</strong> con email marketing y remarketing.
                    Integramos con tu CRM para trackear el pipeline completo y atribuir correctamente las ventas
                    que pueden tardar 3-12 meses en cerrarse.
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
              <Link href="/marketing-digital-b2b-chile" className="group block bg-slate-50 hover:bg-slate-100 rounded-xl p-6 transition-all border border-slate-100">
                <Building2 className="w-8 h-8 text-slate-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-slate-600 transition-colors mb-2">B2B / Empresas</h3>
                <p className="text-gray-600 text-sm mb-3">Servicios empresariales, consultoría, software B2B</p>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-saas-chile" className="group block bg-purple-50 hover:bg-purple-100 rounded-xl p-6 transition-all border border-purple-100">
                <Cog className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">SaaS / Software</h3>
                <p className="text-gray-600 text-sm mb-3">ERP, MES, software industrial y automatización</p>
                <span className="inline-flex items-center gap-1 text-sm text-purple-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-ecommerce-chile" className="group block bg-blue-50 hover:bg-blue-100 rounded-xl p-6 transition-all border border-blue-100">
                <Package className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Ecommerce B2B</h3>
                <p className="text-gray-600 text-sm mb-3">Catálogos online, portales de distribución mayorista</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-slate-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Generar Leads Industriales?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Agenda una reunión estratégica gratuita. Analizamos tu empresa manufacturera y
                diseñamos una estrategia B2B que genere oportunidades comerciales reales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
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
