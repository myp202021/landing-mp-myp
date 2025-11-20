'use client'

import React from 'react'
import { TrendingUp, MousePointerClick, Eye, Target } from 'lucide-react'

interface CampaignSummaryCardsProps {
  resumen: {
    totalInversion: number
    totalClicks: number
    totalImpresiones: number
    ctrPromedio: number
    campanasActivas: number
  }
}

export default function CampaignSummaryCards({ resumen }: CampaignSummaryCardsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(num)
  }

  const cards = [
    {
      title: 'Total Invertido',
      value: formatCurrency(resumen.totalInversion),
      icon: TrendingUp,
      color: 'blue',
      description: `${resumen.campanasActivas} campaña(s) activa(s)`
    },
    {
      title: 'Total Clicks',
      value: formatNumber(resumen.totalClicks),
      icon: MousePointerClick,
      color: 'green',
      description: 'Clicks acumulados'
    },
    {
      title: 'Total Impresiones',
      value: formatNumber(resumen.totalImpresiones),
      icon: Eye,
      color: 'purple',
      description: 'Veces mostrado'
    },
    {
      title: 'CTR Promedio',
      value: `${resumen.ctrPromedio.toFixed(2)}%`,
      icon: Target,
      color: 'orange',
      description: 'Click-through rate'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        icon: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-900',
        icon: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-900',
        icon: 'text-purple-600'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        icon: 'text-orange-600'
      }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        const colors = getColorClasses(card.color)

        return (
          <div
            key={index}
            className={`${colors.bg} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${colors.bg} rounded-lg`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-600 mb-2">
              {card.title}
            </h3>

            <p className={`text-2xl font-bold ${colors.text} mb-1`}>
              {card.value}
            </p>

            <p className="text-xs text-gray-500">
              {card.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
