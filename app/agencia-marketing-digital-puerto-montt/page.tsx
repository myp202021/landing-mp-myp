import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Phone, TrendingUp, Users, Target, BarChart3, Fish, Mountain, Ship, Palmtree } from 'lucide-react'
import { createLocalBusinessSchema, cityData } from '@/lib/metadata'

export const metadata = {
  title: 'Agencia de Marketing Digital en Puerto Montt | M&P',
  description: 'Agencia de marketing digital en Puerto Montt especializada en Google Ads, SEO y estrategias digitales para empresas de la Región de Los Lagos. Acuicultura, turismo y comercio.',
  keywords: ['marketing digital Puerto Montt', 'agencia marketing Puerto Montt', 'Google Ads Puerto Montt', 'SEO Puerto Montt', 'publicidad digital sur de Chile'],
}

const localBusinessSchema = createLocalBusinessSchema(cityData['puerto-montt'])

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el marketing digital en Puerto Montt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En M&P ofrecemos planes desde $500.000 CLP mensuales para empresas de Puerto Montt y la Región de Los Lagos. Trabajamos con empresas de acuicultura, turismo, comercio y servicios de la zona sur."
      }
    },
    {
      "@type": "Question",
      "name": "¿Trabajan con empresas de acuicultura y salmón?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, tenemos experiencia con empresas del sector acuícola, proveedores de la industria salmonera y servicios asociados. Entendemos las dinámicas B2B del sector y los ciclos de licitación."
      }
    },
    {
      "@type": "Question",
      "name": "¿Ofrecen servicios de marketing turístico para la Patagonia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutamente. Puerto Montt es la puerta de entrada a la Patagonia y trabajamos con hoteles, operadores turísticos y agencias de viaje que quieren captar turismo nacional e internacional."
      }
    }
  ]
}

const services = [
  {
    icon: Target,
    title: 'Google Ads Regional',
    description: 'Campañas segmentadas para captar clientes en Puerto Montt, Chiloé y toda la Región de Los Lagos.'
  },
  {
    icon: TrendingUp,
    title: 'SEO Local',
    description: 'Posicionamiento en búsquedas locales para que tu empresa aparezca primero en el sur de Chile.'
  },
  {
    icon: Users,
    title: 'Marketing Turístico',
    description: 'Estrategias para hoteles, tours y experiencias en la Patagonia Norte y Carretera Austral.'
  },
  {
    icon: BarChart3,
    title: 'Marketing B2B Acuicultura',
    description: 'Campañas especializadas para proveedores y servicios del sector salmonero.'
  }
]

const industries = [
  { icon: Fish, name: 'Acuicultura y Salmón', desc: 'Proveedores, servicios técnicos' },
  { icon: Mountain, name: 'Turismo Patagonia', desc: 'Tours, hoteles, experiencias' },
  { icon: Ship, name: 'Naviero y Portuario', desc: 'Transporte, logística marítima' },
  { icon: Palmtree, name: 'Comercio Regional', desc: 'Retail, servicios locales' }
]

const zones = [
  'Puerto Montt Centro',
  'Puerto Varas',
  'Frutillar',
  'Llanquihue',
  'Calbuco',
  'Castro (Chiloé)',
  'Ancud',
  'Osorno'
]

const stats = [
  { value: '40%', label: 'Menos competencia digital vs Santiago' },
  { value: '8+', label: 'Años de experiencia' },
  { value: '20+', label: 'Clientes en el sur' },
  { value: '4.5x', label: 'ROAS promedio turismo' }
]

export default function AgenciaMarketingPuertoMontt() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-teal-900 via-emerald-900 to-cyan-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-teal-300" />
              <span className="text-teal-100 text-sm font-medium">X Región de Los Lagos</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Agencia de Marketing Digital en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
                Puerto Montt
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-teal-100/90 mb-8 leading-relaxed max-w-3xl">
              Especialistas en marketing digital para la <strong className="text-white">Región de Los Lagos</strong>.
              Impulsamos empresas de acuicultura, turismo y comercio del sur de Chile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-400 hover:to-emerald-400 transition-all shadow-lg shadow-teal-500/25"
              >
                Cotizar Proyecto
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/portafolio"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Ver Casos de Éxito
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-teal-200/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué Puerto Montt */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Puerta de Entrada a la Patagonia
            </h2>
            <p className="text-xl text-gray-600">
              Puerto Montt es el centro económico del sur de Chile. Capital de la industria salmonera
              y punto de partida para el turismo patagónico.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Fish className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Industria Acuícola</h3>
              <p className="text-gray-600">
                Conocemos el sector salmonero, sus proveedores y las dinámicas B2B.
                Marketing especializado para la industria acuícola.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Mountain className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Turismo Patagonia</h3>
              <p className="text-gray-600">
                Captamos turistas nacionales e internacionales para hoteles,
                tours y experiencias en la Patagonia Norte.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <Ship className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Economía Regional</h3>
              <p className="text-gray-600">
                Puerto Montt tiene menos competencia digital que Santiago.
                Es el momento ideal para posicionar tu marca en la región.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Servicios de Marketing Digital en Puerto Montt
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluciones adaptadas a las necesidades del sur de Chile
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrias */}
      <section className="py-20 bg-gradient-to-br from-teal-900 to-emerald-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industrias que Atendemos en Los Lagos
            </h2>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Experiencia en los sectores clave de la X Región
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <industry.icon className="w-10 h-10 text-teal-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-teal-200/80 text-sm">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zonas de Cobertura */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Cobertura en toda la Región de Los Lagos
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Atendemos empresas desde Osorno hasta Chiloé, incluyendo Puerto Varas,
                Frutillar y toda la zona lacustre.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {zones.map((zone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-teal-50 rounded-lg px-4 py-3"
                  >
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir M&P en Puerto Montt?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiencia con empresas del sector acuícola y sus proveedores</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Marketing turístico para la Patagonia y Carretera Austral</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Campañas multiidioma para turismo internacional</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Reuniones virtuales y visitas presenciales cuando se requiera</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.name}</h3>
                  <p className="text-gray-600">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Impulsa tu Empresa en el Sur de Chile
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Agenda una consultoría gratuita y descubre cómo el marketing digital
            puede potenciar tu negocio en Puerto Montt y Los Lagos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cotizador"
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-50 transition-all"
            >
              Solicitar Cotización
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+56912345678"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              <Phone className="w-5 h-5" />
              Llamar Ahora
            </a>
          </div>
        </div>
      </section>

      {/* Links Internos */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            También Atendemos en Otras Ciudades
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/agencia-marketing-digital-santiago" className="text-teal-600 hover:text-teal-700 font-medium">Santiago</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-concepcion" className="text-teal-600 hover:text-teal-700 font-medium">Concepción</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-temuco" className="text-teal-600 hover:text-teal-700 font-medium">Temuco</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-valparaiso" className="text-teal-600 hover:text-teal-700 font-medium">Valparaíso</Link>
          </div>
        </div>
      </section>
    </>
  )
}
