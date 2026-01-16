import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, MapPin, Phone, Mail, TrendingUp, Users, Target, BarChart3, Building2, HardHat, Sun, Mountain } from 'lucide-react'
import { createLocalBusinessSchema, cityData } from '@/lib/metadata'

// Metadata para SEO
export const metadata = {
  title: 'Agencia de Marketing Digital en Antofagasta | M&P',
  description: 'Agencia de marketing digital en Antofagasta especializada en Google Ads, SEO y estrategias digitales para empresas mineras, comercio y servicios del Norte Grande.',
  keywords: ['marketing digital Antofagasta', 'agencia marketing Antofagasta', 'Google Ads Antofagasta', 'SEO Antofagasta', 'publicidad digital norte de Chile'],
  openGraph: {
    title: 'Agencia de Marketing Digital en Antofagasta | M&P',
    description: 'Expertos en marketing digital para empresas de Antofagasta y el Norte Grande. Especializados en minería, comercio y servicios.',
    url: 'https://www.mulleryperez.cl/agencia-marketing-digital-antofagasta',
    images: [{ url: 'https://www.mulleryperez.cl/og-antofagasta.jpg' }]
  }
}

const localBusinessSchema = createLocalBusinessSchema(cityData.antofagasta)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta contratar marketing digital en Antofagasta?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En M&P ofrecemos planes desde $500.000 CLP mensuales para empresas de Antofagasta. El costo varía según los servicios requeridos (Google Ads, SEO, redes sociales) y el tamaño de tu negocio. Trabajamos con empresas mineras, proveedores de servicios y comercio local."
      }
    },
    {
      "@type": "Question",
      "name": "¿Trabajan con empresas del sector minero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, tenemos amplia experiencia trabajando con empresas mineras, contratistas y proveedores de la industria. Entendemos los ciclos de licitación, la comunicación B2B y las particularidades del sector en el Norte Grande de Chile."
      }
    },
    {
      "@type": "Question",
      "name": "¿Ofrecen servicios presenciales en Antofagasta?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Trabajamos de forma remota con reuniones virtuales regulares. Sin embargo, realizamos visitas presenciales a Antofagasta para reuniones estratégicas importantes, sesiones fotográficas o eventos cuando sea necesario."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué resultados puedo esperar en Antofagasta?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los resultados varían según la industria, pero nuestros clientes en Antofagasta típicamente ven un aumento del 40-80% en leads calificados en los primeros 3 meses. El mercado del Norte Grande tiene menos competencia digital que Santiago, lo que genera oportunidades únicas."
      }
    }
  ]
}

const services = [
  {
    icon: Target,
    title: 'Google Ads para Minería',
    description: 'Campañas especializadas para proveedores mineros, contratistas y empresas de servicios del sector.'
  },
  {
    icon: TrendingUp,
    title: 'SEO Regional',
    description: 'Posicionamiento en búsquedas locales para que tu empresa aparezca primero en Antofagasta y el Norte Grande.'
  },
  {
    icon: Users,
    title: 'Marketing B2B',
    description: 'Estrategias para empresas que venden a otras empresas, licitaciones y contratos de largo plazo.'
  },
  {
    icon: BarChart3,
    title: 'Analítica y Reportes',
    description: 'Dashboards personalizados con métricas claras de ROI adaptadas al ciclo de ventas minero.'
  }
]

const industries = [
  { icon: HardHat, name: 'Minería y Contratistas', desc: 'Proveedores, servicios técnicos, equipos' },
  { icon: Building2, name: 'Comercio y Retail', desc: 'Tiendas, supermercados, servicios' },
  { icon: Sun, name: 'Energía Solar', desc: 'Empresas de energía renovable' },
  { icon: Mountain, name: 'Turismo Atacama', desc: 'Tours, hoteles, experiencias' }
]

const zones = [
  'Antofagasta Centro',
  'Calama',
  'Mejillones',
  'Taltal',
  'San Pedro de Atacama',
  'Tocopilla',
  'María Elena',
  'Sierra Gorda'
]

const stats = [
  { value: '45%', label: 'Menos competencia digital vs Santiago' },
  { value: '8+', label: 'Años de experiencia' },
  { value: '25+', label: 'Clientes en el Norte Grande' },
  { value: '3.2x', label: 'ROAS promedio sector minero' }
]

export default function AgenciaMarketingAntofagasta() {
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
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-cyan-900 via-blue-900 to-sky-800 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-100 text-sm font-medium">II Región de Antofagasta</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Agencia de Marketing Digital en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-300">
                Antofagasta
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-cyan-100/90 mb-8 leading-relaxed max-w-3xl">
              Especialistas en marketing digital para el <strong className="text-white">Norte Grande de Chile</strong>.
              Impulsamos el crecimiento de empresas mineras, proveedores y comercio regional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
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

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-cyan-200/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué Antofagasta Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Marketing Digital para el Motor Minero de Chile
            </h2>
            <p className="text-xl text-gray-600">
              Antofagasta representa el 50% del PIB minero de Chile. Entendemos las dinámicas únicas
              del Norte Grande, desde los ciclos de licitación hasta la comunicación con grandes corporaciones.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <HardHat className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expertise Minero</h3>
              <p className="text-gray-600">
                Conocemos el lenguaje técnico, los procesos de compra y las plataformas donde
                las mineras buscan proveedores. Marketing B2B especializado.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Sun className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mercado en Crecimiento</h3>
              <p className="text-gray-600">
                El Norte Grande tiene menos competencia digital que Santiago.
                Es el momento ideal para posicionar tu marca en la región.
              </p>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
                <Mountain className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Turismo Atacameño</h3>
              <p className="text-gray-600">
                San Pedro de Atacama y el desierto más árido del mundo atraen turismo mundial.
                Conectamos tu negocio con viajeros internacionales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Servicios de Marketing Digital en Antofagasta
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soluciones adaptadas a las necesidades específicas del mercado nortino
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrias Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industrias que Atendemos en el Norte Grande
            </h2>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
              Experiencia comprobada en los sectores clave de la II Región
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <industry.icon className="w-10 h-10 text-cyan-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-cyan-200/80 text-sm">{industry.desc}</p>
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
                Cobertura en toda la II Región
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Atendemos empresas en toda la Región de Antofagasta, desde el puerto hasta
                las faenas mineras en el interior, incluyendo el corredor turístico de Atacama.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {zones.map((zone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-cyan-50 rounded-lg px-4 py-3"
                  >
                    <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir M&P en Antofagasta?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiencia con clientes del sector minero y sus proveedores</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Entendemos los ciclos de licitación y procesos de compra B2B</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Estrategias para turismo en San Pedro de Atacama</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Reportes adaptados a KPIs de la industria minera</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Visitas presenciales cuando el proyecto lo requiera</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Preguntas Frecuentes sobre Marketing en Antofagasta
            </h2>

            <div className="space-y-6">
              {faqSchema.mainEntity.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.name}
                  </h3>
                  <p className="text-gray-600">
                    {faq.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Impulsa tu Empresa en el Norte Grande
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Agenda una consultoría gratuita y descubre cómo el marketing digital
            puede potenciar tu negocio en Antofagasta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cotizador"
              className="inline-flex items-center justify-center gap-2 bg-white text-cyan-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-cyan-50 transition-all"
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
            <Link href="/agencia-marketing-digital-santiago" className="text-cyan-600 hover:text-cyan-700 font-medium">
              Santiago
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-vina-del-mar" className="text-cyan-600 hover:text-cyan-700 font-medium">
              Viña del Mar
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-valparaiso" className="text-cyan-600 hover:text-cyan-700 font-medium">
              Valparaíso
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-concepcion" className="text-cyan-600 hover:text-cyan-700 font-medium">
              Concepción
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-temuco" className="text-cyan-600 hover:text-cyan-700 font-medium">
              Temuco
            </Link>
          </div>

          <div className="mt-8 text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Industrias Relacionadas</h4>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/industrias/b2b-servicios" className="text-cyan-600 hover:text-cyan-700">
                Servicios B2B
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/industrias/ecommerce" className="text-cyan-600 hover:text-cyan-700">
                Ecommerce
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/industrias/tecnologia-saas" className="text-cyan-600 hover:text-cyan-700">
                Tecnología
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
