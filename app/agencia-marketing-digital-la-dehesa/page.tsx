import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Phone, TrendingUp, Users, Target, BarChart3, Home, Stethoscope, GraduationCap, TreePine } from 'lucide-react'
import { createLocalBusinessSchema, cityData } from '@/lib/metadata'

export const metadata = {
  title: 'Agencia de Marketing Digital en La Dehesa | M&P',
  description: 'Agencia de marketing digital en La Dehesa especializada en Google Ads, SEO y estrategias digitales para servicios profesionales, salud y educación del sector alto de Santiago.',
  keywords: ['marketing digital La Dehesa', 'agencia marketing La Dehesa', 'Google Ads La Dehesa', 'SEO La Dehesa', 'publicidad digital Lo Barnechea'],
}

const localBusinessSchema = createLocalBusinessSchema(cityData['la-dehesa'])

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Trabajan con clínicas y centros médicos en La Dehesa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, tenemos amplia experiencia con clínicas dentales, centros de especialidades médicas, consultas de psicología y centros de salud integrativa en el sector de La Dehesa y Lo Barnechea."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el marketing digital para empresas en La Dehesa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nuestros planes comienzan desde $650.000 CLP mensuales. Para clínicas y servicios profesionales de La Dehesa, ofrecemos estrategias personalizadas según el tipo de servicio y objetivos."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué tipo de empresas atienden en La Dehesa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Principalmente servicios profesionales (médicos, dentistas, abogados), colegios y centros educativos, inmobiliarias de proyectos premium y servicios para el hogar de alta gama."
      }
    }
  ]
}

const services = [
  {
    icon: Target,
    title: 'Google Ads Local',
    description: 'Campañas geo-segmentadas para captar pacientes y clientes del sector alto de Santiago.'
  },
  {
    icon: TrendingUp,
    title: 'SEO para Salud',
    description: 'Posicionamiento especializado para clínicas, dentistas y profesionales de la salud.'
  },
  {
    icon: Users,
    title: 'Social Media Premium',
    description: 'Gestión de redes sociales que reflejan la calidad de tus servicios profesionales.'
  },
  {
    icon: BarChart3,
    title: 'Marketing Educativo',
    description: 'Estrategias de captación para colegios y centros educativos del sector.'
  }
]

const industries = [
  { icon: Stethoscope, name: 'Salud y Medicina', desc: 'Clínicas, dentistas, especialistas' },
  { icon: GraduationCap, name: 'Educación', desc: 'Colegios, jardines, academias' },
  { icon: Home, name: 'Inmobiliario', desc: 'Proyectos premium, corretaje' },
  { icon: TreePine, name: 'Servicios Hogar', desc: 'Paisajismo, arquitectura, diseño' }
]

const zones = [
  'La Dehesa Centro',
  'El Arrayán',
  'Lo Barnechea',
  'Valle La Dehesa',
  'Santa María de Manquehue',
  'Farellones',
  'La Parva',
  'Chicureo'
]

const stats = [
  { value: '45%', label: 'Más consultas médicas' },
  { value: '8+', label: 'Años de experiencia' },
  { value: '35+', label: 'Clínicas y consultas' },
  { value: '3.8x', label: 'ROAS promedio salud' }
]

export default function AgenciaMarketingLaDehesa() {
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
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-100 text-sm font-medium">La Dehesa - Lo Barnechea</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Agencia de Marketing Digital en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                La Dehesa
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-100/90 mb-8 leading-relaxed max-w-3xl">
              Estrategias digitales para <strong className="text-white">profesionales de la salud, educación y servicios</strong>{' '}
              en el sector residencial más exclusivo de Santiago.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25"
              >
                Cotizar Proyecto
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/marketing-digital-salud-chile"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Marketing para Salud
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-emerald-200/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué La Dehesa */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              El Sector Residencial Más Exclusivo
            </h2>
            <p className="text-xl text-gray-600">
              La Dehesa combina naturaleza y exclusividad. Sus residentes buscan servicios
              de primera calidad cerca de sus hogares.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Stethoscope className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hub de Salud</h3>
              <p className="text-gray-600">
                Clínicas dentales, centros médicos y consultas de especialistas
                atienden a las familias del sector.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Polo Educativo</h3>
              <p className="text-gray-600">
                Los mejores colegios y centros educativos de Santiago
                se concentran en La Dehesa y Lo Barnechea.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <TreePine className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Calidad de Vida</h3>
              <p className="text-gray-600">
                Familias de alto patrimonio que valoran la calidad,
                la cercanía y el servicio personalizado.
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
              Servicios de Marketing Digital en La Dehesa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estrategias especializadas para servicios profesionales y salud
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrias */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industrias que Atendemos en La Dehesa
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Experiencia en los sectores clave del área residencial premium
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <industry.icon className="w-10 h-10 text-emerald-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-emerald-200/80 text-sm">{industry.desc}</p>
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
                Cobertura en La Dehesa y Lo Barnechea
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Desde el Valle de La Dehesa hasta los centros de ski,
                atendemos empresas en todo el sector precordillerano.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {zones.map((zone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-emerald-50 rounded-lg px-4 py-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                ¿Por qué M&P para La Dehesa?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Especialistas en marketing para sector salud y educación</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Campañas geo-segmentadas para captar pacientes del sector</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiencia con clínicas, consultas y centros médicos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Estrategias de captación para colegios y jardines</span>
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
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Potencia tu Clínica o Servicio en La Dehesa
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Agenda una consultoría y descubre cómo atraer más pacientes
            y clientes del sector alto de Santiago.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cotizador"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-all"
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
            <Link href="/agencia-marketing-digital-las-condes" className="text-emerald-600 hover:text-emerald-700 font-medium">Las Condes</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-vitacura" className="text-emerald-600 hover:text-emerald-700 font-medium">Vitacura</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-santiago" className="text-emerald-600 hover:text-emerald-700 font-medium">Santiago Centro</Link>
            <span className="text-gray-300">|</span>
            <Link href="/marketing-digital-salud-chile" className="text-emerald-600 hover:text-emerald-700 font-medium">Marketing Salud</Link>
          </div>
        </div>
      </section>
    </>
  )
}
