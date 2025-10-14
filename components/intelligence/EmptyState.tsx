'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, TrendingUp, Sparkles } from 'lucide-react'

interface EmptyStateProps {
  type: 'no_data' | 'first_contribution' | 'insufficient_samples'
  industry?: string
  channel?: string
}

export default function EmptyState({ type, industry, channel }: EmptyStateProps) {
  const content = {
    no_data: {
      icon: BarChart3,
      title: 'Sé el primero en tu industria',
      description: `Todavía no hay datos para ${industry} en ${channel}. ¡Sé pionero y comparte tus métricas!`,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      benefits: [
        'Recibirás un badge de Early Adopter',
        'Ayudarás a crear benchmarks para tu industria',
        'Obtendrás acceso prioritario a insights cuando haya más datos',
      ],
    },
    first_contribution: {
      icon: Sparkles,
      title: '¡Gracias por tu primera contribución!',
      description: 'Tus datos han sido registrados. Cuando más empresas compartan métricas en tu industria, podrás ver comparativas detalladas.',
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      benefits: [
        '🏆 Desbloqueaste: Badge "Primer Aporte"',
        '📊 Recibirás notificaciones cuando haya benchmarks disponibles',
        '🎯 Comparte este link con tu red para acelerar los datos',
      ],
    },
    insufficient_samples: {
      icon: Users,
      title: 'Pocos datos disponibles',
      description: `Solo ${2} empresas han compartido datos en esta combinación. Los benchmarks serán más precisos con al menos 10 contribuciones.`,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      benefits: [
        'Los datos actuales son preliminares',
        'Invita a colegas de tu industria a contribuir',
        'Con 10+ empresas, los percentiles serán estadísticamente significativos',
      ],
    },
  }

  const config = content[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mb-6`}
      >
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center max-w-md"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h3>
        <p className="text-gray-600 mb-6">{config.description}</p>

        {/* Benefits */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-left">
          <ul className="space-y-2">
            {config.benefits.map((benefit, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              alert('¡Link copiado! Compártelo con tu red')
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Compartir con mi red
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Variant for when user hasn't submitted data yet
export function InitialState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-8 px-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200"
    >
      <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Descubre cómo te comparas con tu industria
      </h3>
      <p className="text-gray-600 text-sm max-w-md mx-auto">
        Comparte tus métricas de forma anónima y recibe benchmarks detallados con percentiles, insights automáticos y recomendaciones accionables.
      </p>
    </motion.div>
  )
}
