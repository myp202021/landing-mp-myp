import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Phone, TrendingUp, Users, Target, BarChart3, Star, Sun, Wine, Building2 } from 'lucide-react'
import { createLocalBusinessSchema, cityData } from '@/lib/metadata'

export const metadata = {
  title: 'Agencia de Marketing Digital en La Serena | M&P',
  description: 'Agencia de marketing digital en La Serena especializada en Google Ads, SEO y estrategias digitales para empresas de la Región de Coquimbo. Turismo, astronomía y comercio.',
  keywords: ['marketing digital La Serena', 'agencia marketing La Serena', 'Google Ads La Serena', 'SEO La Serena', 'publicidad digital Coquimbo'],
}

const localBusinessSchema = createLocalBusinessSchema(cityData['la-serena'])

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el marketing digital en La Serena?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En M&P ofrecemos planes desde $500.000 CLP mensuales para empresas de La Serena y la Región de Coquimbo. Trabajamos con empresas de turismo, astronomía, comercio y servicios de la zona."
      }
    },
    {
      "@type": "Question",
      "name": "¿Trabajan con empresas de turismo astronómico?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, tenemos experiencia con observatorios, tours astronómicos y hoteles del Valle del Elqui. La Serena es capital del astroturismo y sabemos cómo captar ese mercado internacional."
      }
    },
    {
      "@type": "Question",
      "name": "¿Pueden ayudar a captar turistas internacionales?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutamente. Creamos campañas multiidioma en Google y Meta Ads para captar turistas de Europa, USA y Latinoamérica interesados en astronomía, playas y el Valle del Elqui."
      }
    }
  ]
}

const services = [
  {
    icon: Target,
    title: 'Google Ads Regional',
    description: 'Campañas segmentadas para captar clientes en La Serena, Coquimbo y el Valle del Elqui.'
  },
  {
    icon: TrendingUp,
    title: 'SEO Turístico',
    description: 'Posicionamiento para búsquedas como "tour astronómico Chile" o "hotel Valle del Elqui".'
  },
  {
    icon: Users,
    title: 'Marketing Astroturismo',
    description: 'Estrategias especializadas para observatorios, tours y experiencias astronómicas.'
  },
  {
    icon: BarChart3,
    title: 'Campañas Multiidioma',
    description: 'Publicidad en inglés, español y portugués para captar turismo internacional.'
  }
]

const industries = [
  { icon: Star, name: 'Astroturismo', desc: 'Observatorios, tours nocturnos' },
  { icon: Sun, name: 'Turismo de Playa', desc: 'Hoteles, resorts, arriendos' },
  { icon: Wine, name: 'Ruta del Pisco', desc: 'Viñas, destilerías, tours' },
  { icon: Building2, name: 'Comercio Regional', desc: 'Retail, servicios locales' }
]

const zones = [
  'La Serena Centro',
  'Coquimbo',
  'Valle del Elqui',
  'Vicuña',
  'Paihuano',
  'Ovalle',
  'Tongoy',
  'Guanaqueros'
]

const stats = [
  { value: '35%', label: 'Menos competencia digital' },
  { value: '8+', label: 'Años de experiencia' },
  { value: '15+', label: 'Clientes en Coquimbo' },
  { value: '5.8x', label: 'ROAS promedio turismo' }
]

export default function AgenciaMarketingLaSerena() {
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
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-indigo-300" />
              <span className="text-indigo-100 text-sm font-medium">IV Región de Coquimbo</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Agencia de Marketing Digital en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                La Serena
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-indigo-100/90 mb-8 leading-relaxed max-w-3xl">
              Especialistas en marketing digital para la <strong className="text-white">Región de Coquimbo</strong>.
              Impulsamos empresas de turismo, astronomía y comercio del norte chico.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-400 hover:to-purple-400 transition-all shadow-lg shadow-indigo-500/25"
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
                  <div className="text-indigo-200/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué La Serena */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Capital del Astroturismo en Chile
            </h2>
            <p className="text-xl text-gray-600">
              La Serena tiene los cielos más limpios del mundo. Capital de la astronomía,
              el Valle del Elqui y playas de clase mundial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Astroturismo</h3>
              <p className="text-gray-600">
                Captamos turistas de todo el mundo interesados en astronomía,
                observatorios y cielos estrellados del Valle del Elqui.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Wine className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ruta del Pisco</h3>
              <p className="text-gray-600">
                Marketing para viñas, destilerías y tours de la Ruta del Pisco.
                Enoturismo y experiencias gastronómicas.
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-6">
                <Sun className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Turismo de Playa</h3>
              <p className="text-gray-600">
                La Serena tiene las mejores playas del norte. Captamos turistas
                para hoteles, resorts y arriendos vacacionales.
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
              Servicios de Marketing Digital en La Serena
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrias */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industrias que Atendemos en Coquimbo</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <industry.icon className="w-10 h-10 text-indigo-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-indigo-200/80 text-sm">{industry.desc}</p>
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
                Cobertura en toda la Región de Coquimbo
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Desde La Serena hasta el Valle del Elqui, cubrimos toda la IV Región.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {zones.map((zone, index) => (
                  <div key={index} className="flex items-center gap-2 bg-indigo-50 rounded-lg px-4 py-3">
                    <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué elegir M&P en La Serena?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiencia en marketing turístico y astroturismo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Campañas multiidioma para turismo internacional</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Conocimiento del Valle del Elqui y sus atractivos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Reportes y métricas adaptadas a temporada turística</span>
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
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Impulsa tu Empresa en el Norte Chico</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Agenda una consultoría gratuita y descubre cómo el marketing digital puede potenciar tu negocio en La Serena.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cotizador" className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all">
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
            <Link href="/agencia-marketing-digital-santiago" className="text-indigo-600 hover:text-indigo-700 font-medium">Santiago</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-antofagasta" className="text-indigo-600 hover:text-indigo-700 font-medium">Antofagasta</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-iquique" className="text-indigo-600 hover:text-indigo-700 font-medium">Iquique</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-valparaiso" className="text-indigo-600 hover:text-indigo-700 font-medium">Valparaíso</Link>
          </div>
        </div>
      </section>
    </>
  )
}
