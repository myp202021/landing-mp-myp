import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Phone, TrendingUp, Users, Target, BarChart3, Gem, Heart, ShoppingBag, Sparkles } from 'lucide-react'
import { createLocalBusinessSchema, cityData } from '@/lib/metadata'

export const metadata = {
  title: 'Agencia de Marketing Digital en Vitacura | M&P',
  description: 'Agencia de marketing digital en Vitacura especializada en Google Ads, SEO y estrategias digitales para marcas premium, retail de lujo y servicios exclusivos.',
  keywords: ['marketing digital Vitacura', 'agencia marketing Vitacura', 'Google Ads Vitacura', 'SEO Vitacura', 'publicidad digital premium'],
}

const localBusinessSchema = createLocalBusinessSchema(cityData.vitacura)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Trabajan con marcas de lujo en Vitacura?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, tenemos experiencia con marcas premium, retail de lujo, joyerías, galerías de arte y servicios exclusivos. Entendemos el lenguaje y las expectativas del cliente de alto patrimonio."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el marketing digital para empresas en Vitacura?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nuestros planes comienzan desde $950.000 CLP mensuales. Para marcas premium y campañas de posicionamiento de lujo, trabajamos con presupuestos personalizados según objetivos."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué diferencia su servicio para el mercado premium?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Entendemos que el cliente de Vitacura valora la exclusividad, la estética y el servicio personalizado. Nuestras estrategias reflejan estos valores en cada punto de contacto digital."
      }
    }
  ]
}

const services = [
  {
    icon: Target,
    title: 'Google Ads Selectivo',
    description: 'Campañas segmentadas para audiencias de alto patrimonio con keywords premium.'
  },
  {
    icon: Sparkles,
    title: 'Branding Digital',
    description: 'Posicionamiento de marca que refleja exclusividad y sofisticación en cada canal.'
  },
  {
    icon: Users,
    title: 'Social Ads Premium',
    description: 'Instagram y Facebook Ads con creatividades que conectan con el cliente exigente.'
  },
  {
    icon: BarChart3,
    title: 'Remarketing Exclusivo',
    description: 'Estrategias de retargeting para convertir visitantes en clientes de alto valor.'
  }
]

const industries = [
  { icon: Gem, name: 'Lujo y Joyería', desc: 'Relojes, joyas, accesorios premium' },
  { icon: Heart, name: 'Salud y Bienestar', desc: 'Clínicas estéticas, spa, wellness' },
  { icon: ShoppingBag, name: 'Retail Premium', desc: 'Boutiques, moda, decoración' },
  { icon: Sparkles, name: 'Servicios Exclusivos', desc: 'Concierge, eventos, catering' }
]

const zones = [
  'Alonso de Córdova',
  'Nueva Costanera',
  'Bicentenario',
  'Parque Arauco',
  'Kennedy Norte',
  'Vitacura Centro',
  'El Bosque Norte',
  'Cerro San Luis'
]

const stats = [
  { value: '35%', label: 'Mayor ticket promedio' },
  { value: '8+', label: 'Años de experiencia' },
  { value: '30+', label: 'Marcas premium' },
  { value: '5.2x', label: 'ROAS promedio lujo' }
]

export default function AgenciaMarketingVitacura() {
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
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-zinc-900 via-stone-900 to-neutral-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-stone-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span className="text-amber-100 text-sm font-medium">Vitacura - Sector Oriente</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Agencia de Marketing Digital en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                Vitacura
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-stone-200/90 mb-8 leading-relaxed max-w-3xl">
              Estrategias digitales para <strong className="text-white">marcas que valoran la exclusividad</strong>.
              Marketing premium para el cliente más exigente de Santiago.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cotizador"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-900 px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/25"
              >
                Cotizar Proyecto
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/portafolio"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Ver Casos Premium
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

      {/* Por qué Vitacura */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Marketing para el Mercado Premium
            </h2>
            <p className="text-xl text-gray-600">
              Vitacura es sinónimo de exclusividad. El cliente de esta comuna espera
              experiencias de primer nivel en cada interacción.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <Gem className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mercado de Lujo</h3>
              <p className="text-gray-600">
                Alonso de Córdova y Nueva Costanera concentran las marcas más exclusivas.
                Conocemos sus códigos y expectativas.
              </p>
            </div>

            <div className="bg-gradient-to-br from-stone-50 to-zinc-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-stone-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bienestar Premium</h3>
              <p className="text-gray-600">
                Clínicas estéticas, centros de wellness y servicios de salud
                de alta gama encuentran en Vitacura su público ideal.
              </p>
            </div>

            <div className="bg-gradient-to-br from-zinc-50 to-neutral-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-zinc-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Experiencia VIP</h3>
              <p className="text-gray-600">
                El cliente de Vitacura valora la atención personalizada.
                Nuestro servicio refleja esa misma filosofía.
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
              Servicios de Marketing Digital en Vitacura
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estrategias diseñadas para marcas que no buscan volumen, sino valor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-20 bg-gradient-to-br from-zinc-900 to-stone-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industrias Premium en Vitacura
            </h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto">
              Experiencia con los sectores más exclusivos del mercado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <industry.icon className="w-10 h-10 text-amber-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-stone-300/80 text-sm">{industry.desc}</p>
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
                Cobertura en Vitacura y Sector Oriente
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Desde el eje Alonso de Córdova hasta el Parque Bicentenario,
                conocemos cada rincón de Vitacura y sus dinámicas comerciales.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {zones.map((zone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-amber-50 rounded-lg px-4 py-3"
                  >
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                ¿Por qué M&P para Vitacura?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiencia con marcas de lujo y retail premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Creatividades que reflejan exclusividad y sofisticación</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Segmentación precisa para audiencias de alto patrimonio</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Atención personalizada con ejecutivo dedicado</span>
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
      <section className="py-20 bg-gradient-to-r from-amber-600 to-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
            Eleva tu Marca al Siguiente Nivel
          </h2>
          <p className="text-xl text-zinc-800 mb-8 max-w-2xl mx-auto">
            Agenda una consultoría y descubre cómo posicionar tu marca
            en el mercado premium de Vitacura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cotizador"
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-zinc-800 transition-all"
            >
              Solicitar Cotización
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+56992258137"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-zinc-900 text-zinc-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-zinc-900/10 transition-all"
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
            <Link href="/agencia-marketing-digital-las-condes" className="text-amber-600 hover:text-amber-700 font-medium">Las Condes</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-la-dehesa" className="text-amber-600 hover:text-amber-700 font-medium">La Dehesa</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-santiago" className="text-amber-600 hover:text-amber-700 font-medium">Santiago Centro</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agencia-marketing-digital-chile" className="text-amber-600 hover:text-amber-700 font-medium">Todo Chile</Link>
          </div>
        </div>
      </section>
    </>
  )
}
