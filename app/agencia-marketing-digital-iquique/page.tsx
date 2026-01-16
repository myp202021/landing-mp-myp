import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Phone, TrendingUp, Users, Target, BarChart3, ShoppingBag, HardHat, Plane, Building2 } from 'lucide-react'
import { createLocalBusinessSchema, cityData } from '@/lib/metadata'

export const metadata = {
  title: 'Agencia de Marketing Digital en Iquique | M&P',
  description: 'Agencia de marketing digital en Iquique especializada en Google Ads, SEO y estrategias digitales. Zona Franca, minería, comercio y turismo en la I Región de Tarapacá.',
  keywords: ['marketing digital Iquique', 'agencia marketing Iquique', 'Google Ads Iquique', 'SEO Iquique', 'publicidad digital Tarapacá', 'Zona Franca Iquique'],
}

const localBusinessSchema = createLocalBusinessSchema(cityData.iquique)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el marketing digital en Iquique?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En M&P ofrecemos planes desde $500.000 CLP mensuales para empresas de Iquique y Tarapacá. Trabajamos con empresas de Zona Franca, minería, comercio y turismo de la región."
      }
    },
    {
      "@type": "Question",
      "name": "¿Trabajan con empresas de Zona Franca?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, tenemos amplia experiencia con importadores, distribuidores y comercios de ZOFRI. Conocemos las dinámicas del comercio mayorista y las estrategias para captar compradores de todo Chile."
      }
    },
    {
      "@type": "Question",
      "name": "¿Pueden ayudar a captar clientes de otras regiones?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutamente. Muchos negocios de Iquique venden a todo Chile. Creamos campañas nacionales segmentadas que destacan los beneficios de comprar en Zona Franca."
      }
    }
  ]
}

const services = [
  {
    icon: Target,
    title: 'Google Ads Nacional',
    description: 'Campañas para captar compradores de todo Chile interesados en productos de Zona Franca.'
  },
  {
    icon: TrendingUp,
    title: 'SEO Comercial',
    description: 'Posicionamiento para búsquedas como "comprar en ZOFRI" o "electrónica Iquique".'
  },
  {
    icon: Users,
    title: 'Marketing B2B Minería',
    description: 'Estrategias para proveedores mineros y servicios industriales del norte grande.'
  },
  {
    icon: BarChart3,
    title: 'Ecommerce ZOFRI',
    description: 'Campañas de Shopping y remarketing para tiendas online de Zona Franca.'
  }
]

const industries = [
  { icon: ShoppingBag, name: 'Zona Franca / ZOFRI', desc: 'Importadores, mayoristas, retail' },
  { icon: HardHat, name: 'Minería', desc: 'Proveedores, servicios técnicos' },
  { icon: Plane, name: 'Turismo', desc: 'Hoteles, tours, playas' },
  { icon: Building2, name: 'Comercio Regional', desc: 'Retail, servicios locales' }
]

const zones = [
  'Iquique Centro',
  'ZOFRI',
  'Alto Hospicio',
  'Playa Brava',
  'Cavancha',
  'Pica',
  'Pozo Almonte',
  'Huara'
]

const stats = [
  { value: '50%', label: 'Menos competencia digital' },
  { value: '8+', label: 'Años de experiencia' },
  { value: '18+', label: 'Clientes en el norte' },
  { value: '7.2x', label: 'ROAS promedio ecommerce' }
]

export default function AgenciaMarketingIquique() {
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
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span className="text-amber-100 text-sm font-medium">I Región de Tarapacá</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Agencia de Marketing Digital en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300">
                Iquique
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-amber-100/90 mb-8 leading-relaxed max-w-3xl">
              Especialistas en marketing digital para <strong className="text-white">Zona Franca y Tarapacá</strong>.
              Impulsamos empresas de comercio, minería y turismo del norte de Chile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
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
                  <div className="text-amber-200/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué Iquique */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Capital del Comercio del Norte
            </h2>
            <p className="text-xl text-gray-600">
              Iquique y su Zona Franca son el hub comercial del norte de Chile.
              ZOFRI atrae compradores de todo el país.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Zona Franca ZOFRI</h3>
              <p className="text-gray-600">
                Conocemos el comercio de Zona Franca, importadores y distribuidores.
                Marketing para vender a todo Chile desde Iquique.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <HardHat className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Minería y Proveedores</h3>
              <p className="text-gray-600">
                Tarapacá es tierra minera. Marketing B2B para proveedores
                y servicios industriales del sector.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Plane className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Turismo de Playa</h3>
              <p className="text-gray-600">
                Iquique tiene las mejores playas del norte. Cavancha y Playa Brava
                atraen turistas todo el año.
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
              Servicios de Marketing Digital en Iquique
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrias */}
      <section className="py-20 bg-gradient-to-br from-amber-900 to-orange-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industrias que Atendemos en Tarapacá</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <industry.icon className="w-10 h-10 text-amber-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-amber-200/80 text-sm">{industry.desc}</p>
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
                Cobertura en toda la Región de Tarapacá
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Desde Iquique hasta la pampa, cubrimos toda la I Región incluyendo Alto Hospicio y Pica.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {zones.map((zone, index) => (
                  <div key={index} className="flex items-center gap-2 bg-amber-50 rounded-lg px-4 py-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué elegir M&P en Iquique?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiencia con comercios de Zona Franca y ZOFRI</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Campañas nacionales para vender a todo Chile</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Marketing B2B para proveedores mineros</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Ecommerce y remarketing dinámico</span>
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
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Impulsa tu Negocio en el Norte Grande</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Agenda una consultoría gratuita y descubre cómo el marketing digital puede potenciar tu empresa en Iquique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cotizador" className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-50 transition-all">
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
            <Link href="/agencia-marketing-digital-antofagasta" className="text-amber-600 hover:text-amber-700 font-medium">Antofagasta</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-la-serena" className="text-amber-600 hover:text-amber-700 font-medium">La Serena</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-santiago" className="text-amber-600 hover:text-amber-700 font-medium">Santiago</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-valparaiso" className="text-amber-600 hover:text-amber-700 font-medium">Valparaíso</Link>
          </div>
        </div>
      </section>
    </>
  )
}
