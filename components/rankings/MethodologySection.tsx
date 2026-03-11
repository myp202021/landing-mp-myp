import { BarChart3, TrendingUp, Zap, Eye, Target, Award, Cpu, Users, Palette, Lightbulb, Brain, Film, Layers, Settings } from 'lucide-react'
import type { RankingCriterion } from '@/lib/data/ranking-criteria'

const iconMap: Record<string, React.ElementType> = {
  BarChart3, TrendingUp, Zap, Eye, Target, Award, Cpu, Users, Palette, Lightbulb, Brain, Film, Layers, Settings,
  Radar: Target, // fallback
}

interface MethodologySectionProps {
  criterios: RankingCriterion[]
  totalAgenciasEvaluadas?: number
  fecha?: string
}

export default function MethodologySection({ criterios, totalAgenciasEvaluadas = 40, fecha = 'Marzo 2026' }: MethodologySectionProps) {
  return (
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Metodología de Evaluación
        </h2>
        <p className="text-gray-600 mb-8">
          Evaluamos +{totalAgenciasEvaluadas} agencias en Chile según {criterios.length} criterios ponderados. Última actualización: {fecha}.
          Los datos provienen de fuentes públicas (Clutch, Sortlist, AMDD, LinkedIn), sitios oficiales y métricas verificables.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {criterios.map((c) => {
            const Icon = iconMap[c.icon] || Target
            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{c.nombre}</h3>
                    <span className="text-xs font-bold text-blue-600">{c.peso}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{c.descripcion}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500">
            <strong>Nota:</strong> Este ranking refleja nuestra evaluación independiente basada en información pública disponible a {fecha}.
            Las puntuaciones pueden variar según la evolución de cada agencia. Si representas a una agencia y deseas actualizar tu información,
            escríbenos a contacto@mulleryperez.cl.
          </p>
        </div>
      </div>
    </section>
  )
}
