import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Trophy, DollarSign, FileText, GitCompare, BarChart3, BookOpen, Calculator, Briefcase, Users, Building2, GraduationCap, Heart, Home, ShoppingCart, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Recursos de Marketing Digital Chile | Guías, Rankings y Comparativas | M&P',
  description: 'Recursos gratuitos de marketing digital para Chile. Rankings de agencias, guías de precios, comparativas de plataformas y estadísticas del mercado chileno 2025.',
  keywords: 'recursos marketing digital chile, guias marketing digital, ranking agencias chile, precios agencias marketing, comparativas google ads meta ads, estadisticas marketing chile',
  openGraph: {
    title: 'Recursos de Marketing Digital Chile | M&P',
    description: 'Guías, rankings, comparativas y estadísticas del marketing digital en Chile.',
    url: 'https://www.mulleryperez.cl/recursos',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/recursos',
  },
}

const recursos = {
  rankings: [
    {
      titulo: 'Ranking Agencias Marketing Digital Chile',
      descripcion: 'Las mejores agencias de marketing digital en Chile según métricas de rendimiento.',
      href: '/ranking-agencias-marketing-digital-chile',
      icon: Trophy,
    },
    {
      titulo: 'Mejores Agencias Performance Marketing',
      descripcion: 'Top agencias especializadas en performance y resultados medibles.',
      href: '/mejores-agencias-performance-marketing-chile',
      icon: Trophy,
    },
    {
      titulo: 'Comparativa Agencias Chile',
      descripcion: 'Tabla comparativa de servicios, precios y especialidades.',
      href: '/comparativa-agencias-marketing-digital-chile',
      icon: BarChart3,
    },
  ],
  guias: [
    {
      titulo: 'Precios de Agencias en Chile',
      descripcion: 'Cuánto cobran las agencias de marketing digital en Chile 2025.',
      href: '/precios-agencia-marketing-digital-chile',
      icon: DollarSign,
    },
    {
      titulo: 'Cuánto Cuesta una Agencia',
      descripcion: 'Desglose completo de costos y qué incluye cada plan.',
      href: '/cuanto-cuesta-agencia-marketing-digital-chile',
      icon: DollarSign,
    },
    {
      titulo: 'Guía para Contratar Agencia',
      descripcion: 'Checklist y preguntas clave antes de contratar.',
      href: '/guia-contratar-agencia-marketing-digital',
      icon: FileText,
    },
  ],
  comparativas: [
    {
      titulo: 'Google Ads vs Meta Ads',
      descripcion: 'Comparativa completa: cuándo usar cada plataforma en Chile.',
      href: '/google-ads-vs-meta-ads-chile',
      icon: GitCompare,
    },
    {
      titulo: 'Agencia vs In-House',
      descripcion: 'Costos reales y cuándo conviene cada modelo.',
      href: '/agencia-marketing-digital-vs-inhouse',
      icon: GitCompare,
    },
  ],
  estadisticas: [
    {
      titulo: 'Estadísticas Marketing Digital Chile 2025',
      descripcion: 'Datos del mercado: inversión, CPL por industria, tendencias.',
      href: '/estadisticas-marketing-digital-chile-2025',
      icon: BarChart3,
    },
  ],
  especializados: [
    {
      titulo: 'Ranking Agencias Performance 2025',
      descripcion: 'Top agencias especializadas en performance marketing.',
      href: '/recursos/ranking-agencias-performance-marketing-chile-2025',
      icon: Trophy,
    },
    {
      titulo: 'Mejores Agencias Google Ads 2025',
      descripcion: 'Las mejores agencias certificadas de Google en Chile.',
      href: '/recursos/mejores-agencias-google-ads-chile-2025',
      icon: Trophy,
    },
    {
      titulo: 'Mejores Agencias Meta Ads 2025',
      descripcion: 'Top agencias especializadas en Facebook e Instagram.',
      href: '/recursos/mejores-agencias-meta-ads-chile-2025',
      icon: Trophy,
    },
  ],
  herramientas: [
    {
      titulo: 'Calculadora ROI / ROAS',
      descripcion: 'Calcula el retorno de tu inversión en marketing digital.',
      href: '/utilidades/calculadora-roi-roas',
      icon: Calculator,
    },
    {
      titulo: 'Calculadora CAC',
      descripcion: 'Estima tu costo de adquisición de clientes.',
      href: '/utilidades/calculadora-cac',
      icon: Calculator,
    },
    {
      titulo: 'Calculadora LTV',
      descripcion: 'Calcula el valor de vida de tus clientes.',
      href: '/utilidades/calculadora-ltv',
      icon: Calculator,
    },
    {
      titulo: 'Predictor de Resultados',
      descripcion: 'Simula resultados de campañas según tu industria.',
      href: '/labs/predictor',
      icon: BarChart3,
    },
    {
      titulo: 'Generador Buyer Persona',
      descripcion: 'Crea perfiles de cliente ideal con IA.',
      href: '/labs/buyer-gen',
      icon: Users,
    },
    {
      titulo: 'Todas las Utilidades',
      descripcion: 'Accede a todas las herramientas gratuitas.',
      href: '/utilidades',
      icon: Wrench,
    },
  ],
  industrias: [
    {
      titulo: 'Marketing Ecommerce',
      descripcion: 'Estrategias para tiendas online y retail.',
      href: '/marketing-digital-ecommerce-chile',
      icon: ShoppingCart,
    },
    {
      titulo: 'Marketing B2B',
      descripcion: 'Lead generation para empresas B2B.',
      href: '/marketing-digital-b2b-chile',
      icon: Briefcase,
    },
    {
      titulo: 'Marketing SaaS',
      descripcion: 'Growth marketing para software.',
      href: '/marketing-digital-saas-chile',
      icon: Building2,
    },
    {
      titulo: 'Marketing Salud',
      descripcion: 'Captación de pacientes para clínicas.',
      href: '/marketing-digital-salud-chile',
      icon: Heart,
    },
    {
      titulo: 'Marketing Inmobiliario',
      descripcion: 'Leads para inmobiliarias y corredoras.',
      href: '/marketing-digital-inmobiliario-chile',
      icon: Home,
    },
    {
      titulo: 'Marketing Educación',
      descripcion: 'Matrícula para instituciones educativas.',
      href: '/marketing-digital-educacion-chile',
      icon: GraduationCap,
    },
  ],
  sobreNosotros: [
    {
      titulo: 'Quiénes Somos',
      descripcion: 'Conoce al equipo de Muller y Pérez.',
      href: '/nosotros',
      icon: Users,
    },
    {
      titulo: 'M&P vs Otras Agencias',
      descripcion: 'Comparativa honesta: cuándo elegirnos (y cuándo no).',
      href: '/comparativa/muller-perez-vs-agencias-chile',
      icon: GitCompare,
    },
    {
      titulo: 'Nuestros Servicios',
      descripcion: 'Google Ads, Meta Ads, SEO y Performance.',
      href: '/servicios',
      icon: Briefcase,
    },
  ],
}

export default function RecursosPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Recursos de{' '}
              <span className="text-purple-400">Marketing Digital</span>
            </h1>
            <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
              Guías, rankings, comparativas y estadísticas del marketing digital en Chile.
              Todo lo que necesitas para tomar mejores decisiones.
            </p>
          </div>
        </div>
      </section>

      {/* Rankings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Trophy className="w-7 h-7 text-yellow-500" />
              Rankings de Agencias
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recursos.rankings.map((recurso) => {
                const Icon = recurso.icon
                return (
                  <Link
                    key={recurso.href}
                    href={recurso.href}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-yellow-300 transition-all"
                  >
                    <Icon className="w-8 h-8 text-yellow-500 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                      {recurso.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{recurso.descripcion}</p>
                    <span className="text-yellow-600 text-sm font-medium flex items-center gap-1">
                      Ver ranking <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Guías de Precios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-green-500" />
              Guías de Precios y Contratación
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recursos.guias.map((recurso) => {
                const Icon = recurso.icon
                return (
                  <Link
                    key={recurso.href}
                    href={recurso.href}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-green-300 transition-all"
                  >
                    <Icon className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {recurso.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{recurso.descripcion}</p>
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      Ver guía <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Comparativas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <GitCompare className="w-7 h-7 text-blue-500" />
              Comparativas
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recursos.comparativas.map((recurso) => {
                const Icon = recurso.icon
                return (
                  <Link
                    key={recurso.href}
                    href={recurso.href}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
                  >
                    <Icon className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {recurso.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{recurso.descripcion}</p>
                    <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                      Ver comparativa <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-purple-500" />
              Estadísticas del Mercado
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recursos.estadisticas.map((recurso) => {
                const Icon = recurso.icon
                return (
                  <Link
                    key={recurso.href}
                    href={recurso.href}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all"
                  >
                    <Icon className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {recurso.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{recurso.descripcion}</p>
                    <span className="text-purple-600 text-sm font-medium flex items-center gap-1">
                      Ver estadísticas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Especializados */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-orange-500" />
              Rankings Especializados 2025
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recursos.especializados.map((recurso) => {
                const Icon = recurso.icon
                return (
                  <Link
                    key={recurso.href}
                    href={recurso.href}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all"
                  >
                    <Icon className="w-8 h-8 text-orange-500 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {recurso.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{recurso.descripcion}</p>
                    <span className="text-orange-600 text-sm font-medium flex items-center gap-1">
                      Ver ranking <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Herramientas y Calculadoras */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Calculator className="w-7 h-7 text-emerald-500" />
              Herramientas y Calculadoras Gratuitas
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recursos.herramientas.map((recurso) => {
                const Icon = recurso.icon
                return (
                  <Link
                    key={recurso.href}
                    href={recurso.href}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all"
                  >
                    <Icon className="w-8 h-8 text-emerald-500 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {recurso.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{recurso.descripcion}</p>
                    <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                      Usar herramienta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Marketing por Industria */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Building2 className="w-7 h-7 text-blue-500" />
              Marketing Digital por Industria
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recursos.industrias.map((recurso) => {
                const Icon = recurso.icon
                return (
                  <Link
                    key={recurso.href}
                    href={recurso.href}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
                  >
                    <Icon className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {recurso.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{recurso.descripcion}</p>
                    <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                      Ver industria <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Muller y Pérez */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Users className="w-7 h-7 text-purple-500" />
              Sobre Muller y Pérez
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recursos.sobreNosotros.map((recurso) => {
                const Icon = recurso.icon
                return (
                  <Link
                    key={recurso.href}
                    href={recurso.href}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all"
                  >
                    <Icon className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {recurso.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{recurso.descripcion}</p>
                    <span className="text-purple-600 text-sm font-medium flex items-center gap-1">
                      Ver más <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Destacado */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-red-500" />
              Blog de Marketing Digital
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/tendencias-marketing-digital-chile-2025" className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-red-300 transition-all">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold mb-3">Tendencias</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">Tendencias Marketing Digital 2025</h3>
                <p className="text-gray-600 text-sm mb-4">Las principales tendencias que dominarán el marketing digital en Chile.</p>
                <span className="text-red-600 text-sm font-medium flex items-center gap-1">Leer artículo <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/blog/google-ads-vs-meta-ads-cual-elegir-chile-2025" className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-red-300 transition-all">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">Comparativa</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">Google Ads vs Meta Ads: Cuál Elegir</h3>
                <p className="text-gray-600 text-sm mb-4">Comparativa completa para decidir dónde invertir tu presupuesto.</p>
                <span className="text-red-600 text-sm font-medium flex items-center gap-1">Leer artículo <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <Link href="/blog" className="group block bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-6 hover:shadow-lg transition-all text-white">
                <BookOpen className="w-8 h-8 text-white/80 mb-4" />
                <h3 className="text-lg font-bold mb-2">Ver Todos los Artículos</h3>
                <p className="text-white/80 text-sm mb-4">Accede a más de 50 artículos sobre marketing digital en Chile.</p>
                <span className="text-white text-sm font-medium flex items-center gap-1">Ir al Blog <ArrowRight className="w-4 h-4" /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Necesitas Ayuda Personalizada?
            </h2>
            <p className="text-xl text-indigo-200 mb-8">
              Agenda una reunión estratégica gratuita. Analizamos tu caso
              y te orientamos sin compromiso.
            </p>
            <Link
              href="/cotizador"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-900 font-bold px-8 py-4 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Solicitar Asesoría Gratuita
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
