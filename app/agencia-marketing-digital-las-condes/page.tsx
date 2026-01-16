import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Phone, TrendingUp, Users, Target, BarChart3, Building2, Briefcase, CreditCard, Award } from 'lucide-react'
import { createLocalBusinessSchema, cityData } from '@/lib/metadata'

export const metadata = {
  title: 'Agencia de Marketing Digital en Las Condes | M&P',
  description: 'Agencia de marketing digital en Las Condes especializada en Google Ads, SEO y estrategias digitales para empresas del sector oriente. Oficinas en Badajoz 100.',
  keywords: ['marketing digital Las Condes', 'agencia marketing Las Condes', 'Google Ads Las Condes', 'SEO Las Condes', 'publicidad digital sector oriente'],
}

const localBusinessSchema = createLocalBusinessSchema(cityData['las-condes'])

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Tienen oficinas en Las Condes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, nuestras oficinas principales están ubicadas en Badajoz 100, Oficina 523, Las Condes. Estamos a pasos del metro El Golf y Tobalaba, en pleno corazón empresarial de Santiago."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el marketing digital en Las Condes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nuestros planes comienzan desde $650.000 CLP mensuales. Trabajamos con empresas de todos los tamaños del sector oriente, desde startups hasta corporaciones establecidas."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué industrias atienden en Las Condes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Atendemos principalmente servicios profesionales (abogados, contadores, consultoras), empresas de tecnología, sector financiero, retail premium y clínicas de salud del sector oriente."
      }
    }
  ]
}

const services = [
  {
    icon: Target,
    title: 'Google Ads Premium',
    description: 'Campañas de alto performance para empresas B2B y servicios profesionales del sector oriente.'
  },
  {
    icon: TrendingUp,
    title: 'SEO Competitivo',
    description: 'Posicionamiento en keywords de alta competencia para destacar en el mercado corporativo.'
  },
  {
    icon: Users,
    title: 'LinkedIn Ads',
    description: 'Estrategias B2B para captar ejecutivos y tomadores de decisión en el sector empresarial.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avanzado',
    description: 'Dashboards ejecutivos con métricas que importan: CAC, LTV, ROAS y pipeline de ventas.'
  }
]

const industries = [
  { icon: Briefcase, name: 'Servicios Profesionales', desc: 'Abogados, contadores, consultoras' },
  { icon: CreditCard, name: 'Finanzas', desc: 'Fintech, AFP, corredoras' },
  { icon: Building2, name: 'Inmobiliarias', desc: 'Proyectos premium, corretaje' },
  { icon: Award, name: 'Salud Premium', desc: 'Clínicas, centros médicos' }
]

const zones = [
  'El Golf',
  'Nueva Las Condes',
  'Apoquindo',
  'Manquehue',
  'Escuela Militar',
  'Tobalaba',
  'Kennedy',
  'Isidora Goyenechea'
]

const stats = [
  { value: 'Badajoz 100', label: 'Oficinas propias' },
  { value: '8+', label: 'Años en el mercado' },
  { value: '50+', label: 'Clientes sector oriente' },
  { value: '4.9★', label: 'Valoración Google' }
]

export default function AgenciaMarketingLasCondes() {
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
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-blue-300" />
              <span className="text-blue-100 text-sm font-medium">Badajoz 100, Of. 523 - Las Condes</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Agencia de Marketing Digital en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                Las Condes
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100/90 mb-8 leading-relaxed max-w-3xl">
              Con <strong className="text-white">oficinas propias en el corazón empresarial de Santiago</strong>,
              entendemos las necesidades del sector corporativo y profesional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-400 hover:to-indigo-400 transition-all shadow-lg shadow-blue-500/25"
              >
                Cotizar Proyecto
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/nosotros"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Conocer Oficinas
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-200/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué Las Condes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Tu Agencia en el Corazón Empresarial
            </h2>
            <p className="text-xl text-gray-600">
              Las Condes concentra el mayor número de empresas y servicios profesionales de Chile.
              Estamos donde están tus clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Centro Financiero</h3>
              <p className="text-gray-600">
                Las Condes es el Manhattan de Santiago. Bancos, AFP, aseguradoras y
                fintech tienen sus oficinas aquí.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Servicios Profesionales</h3>
              <p className="text-gray-600">
                Estudios de abogados, consultoras y firmas de contabilidad
                concentran su operación en la comuna.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Alta Competencia</h3>
              <p className="text-gray-600">
                El mercado es exigente. Necesitas una agencia que entienda
                el nivel de sofisticación del cliente corporativo.
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
              Servicios de Marketing Digital en Las Condes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluciones de alto nivel para empresas que exigen resultados
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrias */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industrias que Atendemos en Las Condes
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Experiencia en los sectores clave del mundo corporativo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <industry.icon className="w-10 h-10 text-blue-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-blue-200/80 text-sm">{industry.desc}</p>
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
                Cobertura en Todo el Sector Oriente
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Desde nuestras oficinas en Badajoz 100, atendemos empresas en todo
                Las Condes y comunas aledañas del sector oriente.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {zones.map((zone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-3"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                ¿Por qué elegirnos en Las Condes?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Oficinas propias en Badajoz 100 - reuniones presenciales cuando las necesites</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiencia con clientes corporativos y servicios profesionales</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Estrategias B2B y LinkedIn Ads para llegar a tomadores de decisión</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Reportería ejecutiva adaptada al lenguaje corporativo</span>
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Agenda una Reunión en Nuestras Oficinas
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Visítanos en Badajoz 100, Las Condes. Conversemos sobre cómo
            potenciar el marketing digital de tu empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cotizador"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all"
            >
              Solicitar Cotización
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+56992258137"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              <Phone className="w-5 h-5" />
              +56 9 9225 8137
            </a>
          </div>
        </div>
      </section>

      {/* Links Internos */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            También Atendemos en Comunas Cercanas
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/agencia-marketing-digital-vitacura" className="text-blue-600 hover:text-blue-700 font-medium">Vitacura</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-la-dehesa" className="text-blue-600 hover:text-blue-700 font-medium">La Dehesa</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-santiago" className="text-blue-600 hover:text-blue-700 font-medium">Santiago Centro</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-chile" className="text-blue-600 hover:text-blue-700 font-medium">Todo Chile</Link>
          </div>
        </div>
      </section>
    </>
  )
}
