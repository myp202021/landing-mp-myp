import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Plane, MapPin, Camera, Hotel, Mountain, Compass, CheckCircle, TrendingUp, Star, Calendar, Users, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital para Turismo y Agencias de Viajes en Chile | M&P',
  description: 'Agencia de marketing digital especializada en turismo en Chile. Aumentamos reservas para hoteles, agencias de viajes, tours y destinos turísticos con Google Ads, Meta Ads y SEO.',
  keywords: 'marketing digital turismo chile, marketing agencias de viajes, publicidad hoteles chile, SEO turismo, google ads turismo, marketing destinos turisticos',
  openGraph: {
    title: 'Marketing Digital para Turismo en Chile | M&P',
    description: 'Especialistas en marketing para la industria turística. Más reservas para hoteles, tours y agencias de viajes.',
    url: 'https://www.mulleryperez.cl/marketing-digital-turismo-chile',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/marketing-digital-turismo-chile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-turismo-chile',
      url: 'https://www.mulleryperez.cl/marketing-digital-turismo-chile',
      name: 'Marketing Digital para Turismo y Agencias de Viajes en Chile',
      description: 'Agencia especializada en marketing digital para el sector turístico en Chile.',
      isPartOf: { '@id': 'https://www.mulleryperez.cl/#website' },
      breadcrumb: { '@id': 'https://www.mulleryperez.cl/marketing-digital-turismo-chile#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-turismo-chile#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, item: { '@id': 'https://www.mulleryperez.cl/', name: 'Inicio' } },
        { '@type': 'ListItem', position: 2, item: { '@id': 'https://www.mulleryperez.cl/industrias', name: 'Industrias' } },
        { '@type': 'ListItem', position: 3, item: { name: 'Marketing Digital Turismo' } },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://www.mulleryperez.cl/marketing-digital-turismo-chile#service',
      name: 'Marketing Digital para Sector Turismo',
      description: 'Servicio especializado de marketing digital para hoteles, tours y agencias de viajes en Chile',
      provider: {
        '@type': 'Organization',
        name: 'Müller & Pérez',
        url: 'https://www.mulleryperez.cl',
      },
      areaServed: { '@type': 'Country', name: 'Chile' },
      serviceType: 'Marketing Digital Turismo',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cómo competir contra Booking y Despegar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No competimos directamente con OTAs. Nos enfocamos en captar reservas directas destacando beneficios exclusivos: mejor precio garantizado, experiencia personalizada, soporte local. Las campañas de marca y remarketing son clave para recuperar clientes que comparan en OTAs.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto invertir en marketing para turismo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La inversión recomendada depende de la temporalidad. En temporada alta, sugerimos invertir 3-5% de la facturación en marketing digital. Para hoteles medianos, esto significa $800.000-1.500.000 CLP/mes en gestión + pauta publicitaria.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué canales funcionan mejor para turismo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Ads (búsqueda y Hotel Ads) captura demanda existente. Meta Ads con contenido visual genera inspiración y remarketing. TikTok está creciendo para turismo joven. El email marketing es clave para fidelización y repetición de compra.',
          },
        },
      ],
    },
  ],
}

const services = [
  {
    icon: TrendingUp,
    title: 'Google Ads para Turismo',
    description: 'Campañas de búsqueda, Hotel Ads y Performance Max para captar viajeros buscando activamente.',
    features: ['Google Hotel Ads', 'Campañas de destino', 'Remarketing de abandono'],
  },
  {
    icon: Camera,
    title: 'Meta Ads Visual',
    description: 'Campañas en Instagram y Facebook con contenido visual que inspire a viajar.',
    features: ['Reels y Stories ads', 'Carruseles de destinos', 'Leads para tours'],
  },
  {
    icon: Globe,
    title: 'SEO Turístico',
    description: 'Posicionamiento para búsquedas como "hotel en San Pedro de Atacama" o "tours Patagonia".',
    features: ['SEO local y destino', 'Content marketing viajes', 'Blog de destinos'],
  },
  {
    icon: Calendar,
    title: 'Email Marketing',
    description: 'Campañas de fidelización, ofertas de temporada y recuperación de reservas abandonadas.',
    features: ['Automatizaciones pre-viaje', 'Ofertas last-minute', 'Programa de lealtad'],
  },
]

const segmentos = [
  { icon: Hotel, name: 'Hoteles y Lodges', desc: 'Reservas directas, packages' },
  { icon: Compass, name: 'Agencias de Viajes', desc: 'Paquetes, tours grupales' },
  { icon: Mountain, name: 'Operadores de Tours', desc: 'Excursiones, experiencias' },
  { icon: Plane, name: 'Destinos Turísticos', desc: 'Promoción de regiones' },
  { icon: Star, name: 'Turismo de Lujo', desc: 'Experiencias premium' },
  { icon: Users, name: 'Turismo MICE', desc: 'Eventos y convenciones' },
]

const destinos = [
  'San Pedro de Atacama',
  'Torres del Paine',
  'Isla de Pascua',
  'Valle de Elqui',
  'Carretera Austral',
  'Puerto Varas',
  'Viña del Mar',
  'Pucón'
]

export default function MarketingTurismoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern-travel.svg')] bg-repeat" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Plane className="w-5 h-5 text-sky-300" />
                <span className="text-sm font-medium">Marketing para Turismo</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Marketing Digital para{' '}
                <span className="text-sky-300">Turismo</span> en Chile
              </h1>

              <p className="text-xl text-sky-100 mb-8 max-w-3xl mx-auto">
                Aumentamos reservas directas para hoteles, agencias de viajes, tours y destinos turísticos.
                Estrategias que capturan viajeros y maximizan la temporada alta.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-sky-300">+85%</div>
                  <div className="text-sm text-sky-200">Reservas Directas</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-sky-300">6.2x</div>
                  <div className="text-sm text-sky-200">ROAS Promedio</div>
                </div>
                <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold text-sky-300">-25%</div>
                  <div className="text-sm text-sky-200">Comisiones OTA</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-sky-400 hover:bg-sky-300 text-sky-900 font-bold px-8 py-4 rounded-lg transition-colors"
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

        {/* Por qué Marketing Turismo */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                El Turismo Chileno se Reserva Online
              </h2>
              <p className="text-xl text-gray-600">
                El 92% de los viajeros investiga online antes de reservar.
                Captura esa demanda con estrategias de marketing digital especializadas.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Más Reservas Directas</h3>
                <p className="text-gray-600">
                  Reduce la dependencia de OTAs como Booking o Despegar.
                  Cada reserva directa ahorra 15-25% en comisiones.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Temporalidad</h3>
                <p className="text-gray-600">
                  Optimizamos presupuestos según temporada alta, media y baja.
                  Maximiza ocupación todo el año.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Alcance Internacional</h3>
                <p className="text-gray-600">
                  Campañas multiidioma para captar turismo extranjero.
                  Segmentación por país de origen y tipo de viajero.
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
                  Servicios de Marketing Turístico
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Estrategias específicas para la industria de viajes y hospitalidad
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
                      <service.icon className="w-7 h-7 text-sky-600" />
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

        {/* Segmentos */}
        <section className="py-20 bg-gradient-to-br from-sky-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Segmentos Turísticos que Atendemos
              </h2>
              <p className="text-xl text-sky-200 max-w-2xl mx-auto">
                Experiencia en todos los nichos de la industria turística chilena
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {segmentos.map((segmento, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <segmento.icon className="w-8 h-8 text-sky-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{segmento.name}</h3>
                  <p className="text-sky-200 text-sm">{segmento.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Destinos */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Destinos Turísticos en Chile
                </h2>
                <p className="text-xl text-gray-600">
                  Experiencia promocionando los destinos más icónicos del país
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {destinos.map((destino, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow-sm"
                  >
                    <MapPin className="w-5 h-5 text-sky-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{destino}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Preguntas Frecuentes sobre Marketing Turístico
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo competir contra Booking y Despegar?
                  </h3>
                  <p className="text-gray-600">
                    No competimos directamente con OTAs. Nos enfocamos en captar <strong>reservas directas</strong> destacando
                    beneficios exclusivos: mejor precio garantizado, experiencia personalizada, soporte local.
                    Las campañas de marca y remarketing son clave para recuperar clientes que comparan en OTAs.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cuánto invertir en marketing para turismo?
                  </h3>
                  <p className="text-gray-600">
                    La inversión recomendada depende de la temporalidad. En <strong>temporada alta</strong>, sugerimos invertir
                    3-5% de la facturación en marketing digital. Para hoteles medianos, esto significa
                    <strong> $800.000-1.500.000 CLP/mes</strong> en gestión + pauta publicitaria.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Qué canales funcionan mejor para turismo?
                  </h3>
                  <p className="text-gray-600">
                    <strong>Google Ads</strong> (búsqueda y Hotel Ads) captura demanda existente.
                    <strong> Meta Ads</strong> con contenido visual genera inspiración y remarketing.
                    <strong> TikTok</strong> está creciendo para turismo joven.
                    El <strong>email marketing</strong> es clave para fidelización y repetición de compra.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¿Cómo captar turismo extranjero?
                  </h3>
                  <p className="text-gray-600">
                    Creamos campañas segmentadas por país de origen con contenido en inglés, portugués y español.
                    <strong> Google Ads</strong> permite segmentar por ubicación del usuario, y Meta Ads por intereses de viaje.
                    Es clave entender la estacionalidad inversa del hemisferio norte.
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
              <Link href="/marketing-digital-ecommerce-chile" className="group block bg-blue-50 hover:bg-blue-100 rounded-xl p-6 transition-all border border-blue-100">
                <Hotel className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Ecommerce</h3>
                <p className="text-gray-600 text-sm mb-3">Venta online de tours, experiencias y packages</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-b2b-chile" className="group block bg-slate-50 hover:bg-slate-100 rounded-xl p-6 transition-all border border-slate-100">
                <Users className="w-8 h-8 text-slate-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-slate-600 transition-colors mb-2">B2B / MICE</h3>
                <p className="text-gray-600 text-sm mb-3">Eventos corporativos, convenciones y viajes empresariales</p>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/marketing-digital-inmobiliario-chile" className="group block bg-emerald-50 hover:bg-emerald-100 rounded-xl p-6 transition-all border border-emerald-100">
                <Mountain className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Inmobiliario</h3>
                <p className="text-gray-600 text-sm mb-3">Arriendo vacacional, segunda vivienda y proyectos turísticos</p>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">Ver industria <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-sky-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para Aumentar tus Reservas?
              </h2>
              <p className="text-xl text-sky-100 mb-8">
                Agenda una reunión estratégica gratuita. Analizamos tu negocio turístico y
                diseñamos una estrategia de marketing que maximice tu ocupación.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center justify-center gap-2 bg-sky-400 hover:bg-sky-300 text-sky-900 font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Solicitar Propuesta
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/labs/predictor"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Simular Resultados
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
