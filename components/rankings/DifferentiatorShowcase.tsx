'use client'

import Link from 'next/link'
import { Zap, BarChart3, Users, Radar, Activity, Database } from 'lucide-react'

const herramientas = [
  {
    nombre: 'Predictor de Campañas',
    descripcion: 'Estima CPC, CPA y presupuesto óptimo por industria antes de invertir un peso. Basado en +1.200 keywords y datos reales del mercado chileno.',
    icon: BarChart3,
    color: 'from-blue-500 to-blue-700',
    url: '/predictor',
  },
  {
    nombre: 'Buyer Gen',
    descripcion: 'Genera buyer personas y segmentaciones con IA, integrando datos de campañas reales para targeting preciso en Google y Meta.',
    icon: Users,
    color: 'from-purple-500 to-purple-700',
    url: '/labs',
  },
  {
    nombre: 'Radar de Industrias',
    descripcion: 'Benchmarks de CPC, CVR y CPA por industria en Chile, actualizados semanalmente con datos de USD/CLP y UF.',
    icon: Radar,
    color: 'from-green-500 to-green-700',
    url: '/indicadores',
  },
  {
    nombre: 'Termómetro Marketing Digital',
    descripcion: 'Indicadores semanales del mercado digital chileno: CPC promedio, variación cambiaria y su impacto en costos de campañas.',
    icon: Activity,
    color: 'from-orange-500 to-orange-700',
    url: '/indicadores',
  },
  {
    nombre: 'CRM con Portal Cliente',
    descripcion: 'Cada cliente tiene acceso a su dashboard con métricas en tiempo real, cotizaciones y comunicación directa con el equipo.',
    icon: Database,
    color: 'from-teal-500 to-teal-700',
    url: '/crm/login',
  },
  {
    nombre: 'Monitor de Competencia',
    descripcion: 'Monitoreo automatizado de competidores en Instagram, LinkedIn y Facebook. Reportes diarios con detección de ofertas laborales.',
    icon: Zap,
    color: 'from-red-500 to-red-700',
    url: '/#contact',
  },
]

export default function DifferentiatorShowcase() {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">
            Tecnología propietaria
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            6 Herramientas que Ninguna Otra Agencia Tiene
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Muller y Pérez es la única agencia en Chile que desarrolla sus propias herramientas
            de performance marketing. No dependemos de plataformas de terceros para tomar decisiones.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {herramientas.map((h) => {
            const Icon = h.icon
            return (
              <Link
                key={h.nombre}
                href={h.url}
                className="group bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-gray-800 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {h.nombre}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {h.descripcion}
                </p>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Conoce nuestras herramientas en acción
          </Link>
        </div>
      </div>
    </section>
  )
}
