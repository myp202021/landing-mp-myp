import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Phone, TrendingUp, Users, Target, BarChart3, Grape, Wheat, Store, Building2 } from 'lucide-react'
import { createLocalBusinessSchema, cityData } from '@/lib/metadata'

export const metadata = {
  title: 'Agencia de Marketing Digital en Talca | M&P',
  description: 'Agencia de marketing digital en Talca especializada en Google Ads, SEO y estrategias digitales para empresas de la Región del Maule. Agricultura, vinos y comercio.',
  keywords: ['marketing digital Talca', 'agencia marketing Talca', 'Google Ads Talca', 'SEO Talca', 'publicidad digital Maule'],
}

const localBusinessSchema = createLocalBusinessSchema(cityData.talca)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el marketing digital en Talca?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En M&P ofrecemos planes desde $500.000 CLP mensuales para empresas de Talca y la Región del Maule. Trabajamos con empresas agrícolas, vitivinícolas, comercio y servicios de la zona."
      }
    },
    {
      "@type": "Question",
      "name": "¿Trabajan con empresas agrícolas y exportadoras?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, tenemos experiencia con exportadoras de fruta, viñas y empresas del agro. El Maule es una de las principales regiones agrícolas de Chile y conocemos sus dinámicas comerciales."
      }
    },
    {
      "@type": "Question",
      "name": "¿Pueden ayudar a posicionar mi negocio en Talca?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutamente. Talca tiene menos competencia digital que Santiago, lo que representa una oportunidad para posicionar tu marca localmente con SEO y Google Ads a menor costo."
      }
    }
  ]
}

const services = [
  {
    icon: Target,
    title: 'Google Ads Regional',
    description: 'Campañas segmentadas para captar clientes en Talca, Curicó y toda la Región del Maule.'
  },
  {
    icon: TrendingUp,
    title: 'SEO Local',
    description: 'Posicionamiento en búsquedas locales para empresas de Talca y alrededores.'
  },
  {
    icon: Users,
    title: 'Marketing Agroindustrial',
    description: 'Estrategias para exportadoras, viñas y empresas del sector agrícola.'
  },
  {
    icon: BarChart3,
    title: 'Comercio Regional',
    description: 'Campañas para retail, servicios profesionales y comercio de la VII Región.'
  }
]

const industries = [
  { icon: Grape, name: 'Vitivinicultura', desc: 'Viñas, bodegas, enoturismo' },
  { icon: Wheat, name: 'Agroindustria', desc: 'Exportadoras, packing, agro' },
  { icon: Store, name: 'Comercio', desc: 'Retail, servicios, restaurantes' },
  { icon: Building2, name: 'Servicios Profesionales', desc: 'Consultoras, estudios, salud' }
]

const zones = [
  'Talca Centro',
  'Curicó',
  'Linares',
  'Constitución',
  'Cauquenes',
  'Molina',
  'San Javier',
  'Parral'
]

const stats = [
  { value: '50%', label: 'Menos competencia digital' },
  { value: '8+', label: 'Años de experiencia' },
  { value: '12+', label: 'Clientes en el Maule' },
  { value: '4.8x', label: 'ROAS promedio comercio' }
]

export default function AgenciaMarketingTalca() {
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
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-lime-900 via-green-900 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-lime-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-lime-300" />
              <span className="text-lime-100 text-sm font-medium">VII Región del Maule</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Agencia de Marketing Digital en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-green-300">
                Talca
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-lime-100/90 mb-8 leading-relaxed max-w-3xl">
              Especialistas en marketing digital para la <strong className="text-white">Región del Maule</strong>.
              Impulsamos empresas agrícolas, vitivinícolas y comercio de la zona central sur.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-lime-500 to-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-lime-400 hover:to-green-400 transition-all shadow-lg shadow-lime-500/25"
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
                  <div className="text-lime-200/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué Talca */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Corazón Agrícola de Chile
            </h2>
            <p className="text-xl text-gray-600">
              Talca y el Maule son el centro agrícola y vitivinícola de Chile.
              Región de vinos, frutas y una economía en crecimiento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-lime-50 to-green-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-lime-100 rounded-xl flex items-center justify-center mb-6">
                <Grape className="w-7 h-7 text-lime-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Valle del Maule</h3>
              <p className="text-gray-600">
                Principal región vitivinícola de Chile.
                Marketing para viñas, bodegas y enoturismo.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Wheat className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Agroindustria</h3>
              <p className="text-gray-600">
                Exportadoras de fruta, cereales y productos agrícolas.
                Marketing B2B para el sector agro.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-lime-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Store className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comercio Regional</h3>
              <p className="text-gray-600">
                Talca tiene menos competencia digital que Santiago.
                Oportunidad para posicionar tu negocio localmente.
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
              Servicios de Marketing Digital en Talca
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                <div className="w-14 h-14 bg-gradient-to-br from-lime-100 to-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-lime-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrias */}
      <section className="py-20 bg-gradient-to-br from-lime-900 to-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industrias que Atendemos en el Maule</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <industry.icon className="w-10 h-10 text-lime-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-lime-200/80 text-sm">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cobertura */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Cobertura en toda la Región del Maule
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Desde Talca hasta Curicó y Linares, cubrimos toda la VII Región.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {zones.map((zone, index) => (
                  <div key={index} className="flex items-center gap-2 bg-lime-50 rounded-lg px-4 py-3">
                    <CheckCircle className="w-5 h-5 text-lime-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-lime-100 to-green-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué elegir M&P en Talca?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lime-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiencia con viñas y empresas agroindustriales</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lime-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Menos competencia digital = mejores resultados a menor costo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lime-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Conocimiento del comercio y servicios de la zona</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lime-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Atención personalizada con reuniones virtuales y presenciales</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Preguntas Frecuentes</h2>
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
      <section className="py-20 bg-gradient-to-r from-lime-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Impulsa tu Empresa en el Maule</h2>
          <p className="text-xl text-lime-100 mb-8 max-w-2xl mx-auto">
            Agenda una consultoría gratuita y descubre cómo el marketing digital puede potenciar tu negocio en Talca.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cotizador" className="inline-flex items-center justify-center gap-2 bg-white text-lime-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-lime-50 transition-all">
              Solicitar Cotización <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+56912345678" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
              <Phone className="w-5 h-5" /> Llamar Ahora
            </a>
          </div>
        </div>
      </section>

      {/* Links Internos */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">También Atendemos en Otras Ciudades</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/agencia-marketing-digital-santiago" className="text-lime-600 hover:text-lime-700 font-medium">Santiago</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-rancagua" className="text-lime-600 hover:text-lime-700 font-medium">Rancagua</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-concepcion" className="text-lime-600 hover:text-lime-700 font-medium">Concepción</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-temuco" className="text-lime-600 hover:text-lime-700 font-medium">Temuco</Link>
          </div>
        </div>
      </section>
    </>
  )
}
