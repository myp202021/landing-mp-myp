import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShoppingCart, Building2, Cloud, Home, Heart, GraduationCap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital por Industria en Chile | Soluciones Especializadas | M&P',
  description: 'Estrategias de marketing digital especializadas por industria en Chile. Ecommerce, B2B, SaaS, Inmobiliario, Salud y Educación. Benchmarks y casos de éxito por sector.',
  keywords: 'marketing digital por industria chile, marketing especializado, marketing ecommerce, marketing b2b, marketing saas, marketing inmobiliario, marketing salud, marketing educacion',
  openGraph: {
    title: 'Marketing Digital por Industria | M&P',
    description: 'Soluciones de marketing especializadas para cada sector. Conocemos los benchmarks y mejores prácticas de tu industria.',
    url: 'https://www.mulleryperez.cl/industrias',
    siteName: 'Müller & Pérez',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.mulleryperez.cl/industrias',
  },
}

const industrias = [
  {
    titulo: 'Ecommerce',
    descripcion: 'Aumentamos ventas online con Google Shopping, Meta Ads y remarketing dinámico.',
    href: '/marketing-digital-ecommerce-chile',
    icon: ShoppingCart,
    color: 'blue',
    stats: { label: 'ROAS Promedio', value: '8.5x' },
  },
  {
    titulo: 'B2B / Empresas',
    descripcion: 'Generación de leads empresariales con LinkedIn Ads, Google Ads y ABM.',
    href: '/marketing-digital-b2b-chile',
    icon: Building2,
    color: 'slate',
    stats: { label: 'CPL Promedio', value: '$15.000' },
  },
  {
    titulo: 'SaaS / Software',
    descripcion: 'Growth marketing para reducir CAC y aumentar trial-to-paid.',
    href: '/marketing-digital-saas-chile',
    icon: Cloud,
    color: 'purple',
    stats: { label: 'Reducción CAC', value: '-40%' },
  },
  {
    titulo: 'Inmobiliario',
    descripcion: 'Leads calificados para corredoras, inmobiliarias y proyectos.',
    href: '/marketing-digital-inmobiliario-chile',
    icon: Home,
    color: 'emerald',
    stats: { label: 'CPL Promedio', value: '$12.000' },
  },
  {
    titulo: 'Salud / Clínicas',
    descripcion: 'Pacientes nuevos para clínicas, dentistas y especialistas. Marketing ético.',
    href: '/marketing-digital-salud-chile',
    icon: Heart,
    color: 'red',
    stats: { label: 'ROI Promedio', value: '8x' },
  },
  {
    titulo: 'Educación',
    descripcion: 'Campañas de matrícula para universidades, institutos y cursos online.',
    href: '/marketing-digital-educacion-chile',
    icon: GraduationCap,
    color: 'indigo',
    stats: { label: 'Lead-to-Matrícula', value: '12%' },
  },
]

const colorClasses: Record<string, { bg: string; icon: string; hover: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', hover: 'hover:border-blue-300' },
  slate: { bg: 'bg-slate-50', icon: 'text-slate-600', hover: 'hover:border-slate-300' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', hover: 'hover:border-purple-300' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'hover:border-emerald-300' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', hover: 'hover:border-red-300' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', hover: 'hover:border-indigo-300' },
}

export default function IndustriasPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Marketing Digital por{' '}
              <span className="text-blue-400">Industria</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Cada industria tiene sus propios desafíos, benchmarks y mejores prácticas.
              Conocemos tu sector y aplicamos estrategias probadas.
            </p>
          </div>
        </div>
      </section>

      {/* Grid de Industrias */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industrias.map((industria) => {
                const Icon = industria.icon
                const colors = colorClasses[industria.color]
                return (
                  <Link
                    key={industria.href}
                    href={industria.href}
                    className={`group block bg-white border border-gray-200 rounded-xl p-8 transition-all duration-300 hover:shadow-xl ${colors.hover}`}
                  >
                    <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 ${colors.icon}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {industria.titulo}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {industria.descripcion}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">{industria.stats.label}</div>
                        <div className={`text-2xl font-bold ${colors.icon}`}>{industria.stats.value}</div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué especialización */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Por Qué Marketing Especializado por Industria?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">2x</div>
                <div className="text-gray-700">Mejor conversión que campañas genéricas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">-35%</div>
                <div className="text-gray-700">Menor costo por adquisición</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">3x</div>
                <div className="text-gray-700">Más rápido en alcanzar ROI positivo</div>
              </div>
            </div>
            <p className="text-gray-600 mt-8 max-w-2xl mx-auto">
              Conocer los benchmarks de tu industria, el customer journey típico y las
              objeciones comunes nos permite crear campañas que conectan mejor con tu audiencia.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿No Encuentras tu Industria?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Trabajamos con múltiples sectores. Cuéntanos tu caso y
              diseñamos una estrategia personalizada.
            </p>
            <Link
              href="/cotizador"
              className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Solicitar Propuesta
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
