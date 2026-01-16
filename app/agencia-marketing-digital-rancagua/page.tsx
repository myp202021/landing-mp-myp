import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Phone, TrendingUp, Users, Target, BarChart3, HardHat, Grape, Truck, Building2 } from 'lucide-react'
import { createLocalBusinessSchema, cityData } from '@/lib/metadata'

export const metadata = {
  title: 'Agencia de Marketing Digital en Rancagua | M&P',
  description: 'Agencia de marketing digital en Rancagua especializada en Google Ads, SEO y estrategias digitales para empresas de la Región de O\'Higgins. Minería, agricultura y comercio.',
  keywords: ['marketing digital Rancagua', 'agencia marketing Rancagua', 'Google Ads Rancagua', 'SEO Rancagua', 'publicidad digital O\'Higgins'],
}

const localBusinessSchema = createLocalBusinessSchema(cityData.rancagua)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el marketing digital en Rancagua?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En M&P ofrecemos planes desde $500.000 CLP mensuales para empresas de Rancagua y la Región de O'Higgins. Trabajamos con empresas de minería, agricultura, vitivinicultura y comercio."
      }
    },
    {
      "@type": "Question",
      "name": "¿Trabajan con empresas del sector minero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, tenemos experiencia con proveedores de El Teniente, contratistas y servicios mineros. Conocemos las dinámicas B2B del sector y los ciclos de licitación de CODELCO."
      }
    },
    {
      "@type": "Question",
      "name": "¿Pueden ayudar a viñas y exportadoras agrícolas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutamente. O'Higgins es la región agrícola y vitivinícola más importante de Chile. Trabajamos con viñas, exportadoras de fruta y empresas del agro."
      }
    }
  ]
}

const services = [
  {
    icon: Target,
    title: 'Google Ads B2B',
    description: 'Campañas para proveedores mineros y servicios industriales de la zona central.'
  },
  {
    icon: TrendingUp,
    title: 'SEO Regional',
    description: 'Posicionamiento en búsquedas locales para empresas de Rancagua y O\'Higgins.'
  },
  {
    icon: Users,
    title: 'Marketing Agroindustrial',
    description: 'Estrategias para exportadoras, viñas y empresas del sector agrícola.'
  },
  {
    icon: BarChart3,
    title: 'Comercio Regional',
    description: 'Campañas para retail, servicios y comercio de la sexta región.'
  }
]

const industries = [
  { icon: HardHat, name: 'Minería El Teniente', desc: 'Proveedores, contratistas' },
  { icon: Grape, name: 'Vitivinicultura', desc: 'Viñas, bodegas, enoturismo' },
  { icon: Truck, name: 'Agroindustria', desc: 'Exportadoras, packing, agro' },
  { icon: Building2, name: 'Comercio Regional', desc: 'Retail, servicios locales' }
]

const zones = [
  'Rancagua Centro',
  'Machalí',
  'San Fernando',
  'Santa Cruz',
  'Pichilemu',
  'Rengo',
  'Graneros',
  'Requínoa'
]

const stats = [
  { value: '45%', label: 'Menos competencia digital' },
  { value: '8+', label: 'Años de experiencia' },
  { value: '15+', label: 'Clientes en O\'Higgins' },
  { value: '5.5x', label: 'ROAS promedio B2B' }
]

export default function AgenciaMarketingRancagua() {
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
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-red-900 via-rose-900 to-pink-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-red-300" />
              <span className="text-red-100 text-sm font-medium">VI Región de O&apos;Higgins</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Agencia de Marketing Digital en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-rose-300">
                Rancagua
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-red-100/90 mb-8 leading-relaxed max-w-3xl">
              Especialistas en marketing digital para la <strong className="text-white">Región de O&apos;Higgins</strong>.
              Impulsamos empresas de minería, agricultura y comercio de la zona central.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-red-400 hover:to-rose-400 transition-all shadow-lg shadow-red-500/25"
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
                  <div className="text-red-200/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué Rancagua */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Corazón Minero y Agrícola de Chile
            </h2>
            <p className="text-xl text-gray-600">
              Rancagua es la capital de El Teniente, la mina subterránea más grande del mundo,
              y centro de la principal región agrícola de Chile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <HardHat className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Minería El Teniente</h3>
              <p className="text-gray-600">
                Conocemos el ecosistema de CODELCO y sus proveedores.
                Marketing B2B especializado para el sector minero.
              </p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                <Grape className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vinos del Valle</h3>
              <p className="text-gray-600">
                O&apos;Higgins produce el 40% del vino chileno.
                Marketing para viñas, bodegas y enoturismo.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <Truck className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Agroindustria</h3>
              <p className="text-gray-600">
                Principal región exportadora de fruta de Chile.
                Marketing para packing, exportadoras y agro.
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
              Servicios de Marketing Digital en Rancagua
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrias */}
      <section className="py-20 bg-gradient-to-br from-red-900 to-rose-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industrias que Atendemos en O&apos;Higgins</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <industry.icon className="w-10 h-10 text-red-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-red-200/80 text-sm">{industry.desc}</p>
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
                Cobertura en toda la Región de O&apos;Higgins
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Desde Rancagua hasta Pichilemu, cubrimos toda la VI Región incluyendo los valles vitivinícolas.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {zones.map((zone, index) => (
                  <div key={index} className="flex items-center gap-2 bg-red-50 rounded-lg px-4 py-3">
                    <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué elegir M&P en Rancagua?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiencia con proveedores de CODELCO El Teniente</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Marketing para viñas y enoturismo del Valle de Colchagua</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Conocimiento del sector agroindustrial y exportador</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Cercanía a Santiago con atención personalizada</span>
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
      <section className="py-20 bg-gradient-to-r from-red-600 to-rose-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Impulsa tu Empresa en O&apos;Higgins</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Agenda una consultoría gratuita y descubre cómo el marketing digital puede potenciar tu negocio en Rancagua.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cotizador" className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-50 transition-all">
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
            <Link href="/agencia-marketing-digital-santiago" className="text-red-600 hover:text-red-700 font-medium">Santiago</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-talca" className="text-red-600 hover:text-red-700 font-medium">Talca</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-valparaiso" className="text-red-600 hover:text-red-700 font-medium">Valparaíso</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-concepcion" className="text-red-600 hover:text-red-700 font-medium">Concepción</Link>
          </div>
        </div>
      </section>
    </>
  )
}
