'use client'

import React from 'react'
import { TrendingUp, TrendingDown, MousePointerClick, Eye, Target, DollarSign, Activity } from 'lucide-react'

interface CampaignSummaryCardsProps {
  resumen: {
    totalInversion: number
    totalClicks: number
    totalImpresiones: number
    ctrPromedio: number
    cpcPromedio: number
    campanasActivas: number
    totalConversiones?: number
  }
  cambios?: {
    inversion: number
    clicks: number
    impresiones: number
    ctr: number
    cpc: number
    conversiones?: number
  }
}

export default function CampaignSummaryCards({ resumen, cambios }: CampaignSummaryCardsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(Math.round(num))
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(num)
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 inline ml-1" />
    if (change < 0) return <TrendingDown className="w-4 h-4 inline ml-1" />
    return null
  }

  const cards = [
    {
      title: 'Total Invertido',
      value: formatCurrency(resumen.totalInversion),
      icon: DollarSign,
      color: 'blue',
      description: `${resumen.campanasActivas} campaña(s) activa(s)`,
      change: cambios?.inversion
    },
    {
      title: 'Total Clicks',
      value: formatNumber(resumen.totalClicks),
      icon: MousePointerClick,
      color: 'green',
      description: 'Clicks acumulados',
      change: cambios?.clicks
    },
    {
      title: 'Total Impresiones',
      value: formatNumber(resumen.totalImpresiones),
      icon: Eye,
      color: 'purple',
      description: 'Veces mostrado',
      change: cambios?.impresiones
    },
    {
      title: 'CTR Promedio',
      value: `${resumen.ctrPromedio.toFixed(2)}%`,
      icon: Target,
      color: 'orange',
      description: 'Click-through rate',
      change: cambios?.ctr
    },
    {
      title: 'CPC Promedio',
      value: formatCurrency(resumen.cpcPromedio),
      icon: Activity,
      color: 'indigo',
      description: 'Costo por click',
      change: cambios?.cpc,
      inversed: true // Para CPC, menos es mejor
    }
  ]

  if (resumen.totalConversiones && resumen.totalConversiones > 0) {
    cards.push({
      title: 'Conversiones',
      value: formatNumber(resumen.totalConversiones),
      icon: TrendingUp,
      color: 'rose',
      description: 'Total conversiones',
      change: cambios?.conversiones
    })
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600', border: 'border-orange-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-900', icon: 'text-indigo-600', border: 'border-indigo-200' },
      rose: { bg: 'bg-rose-50', text: 'text-rose-900', icon: 'text-rose-600', border: 'border-rose-200' }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        const colors = getColorClasses(card.color)
        const hasChange = card.change !== undefined && card.change !== 0

        // Para métricas donde menos es mejor (CPC), invertir el color
        const effectiveChange = card.inversed ? -card.change! : card.change!

        return (
          <div
            key={index}
            className={`${colors.bg} rounded-lg p-5 border ${colors.border} hover:shadow-lg transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 ${colors.bg} rounded-lg border ${colors.border}`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
            </div>

            <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              {card.title}
            </h3>

            <p className={`text-2xl font-bold ${colors.text} mb-1`}>
              {card.value}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {card.description}
              </p>

              {hasChange && (
                <div className={`text-xs font-semibold ${getChangeColor(effectiveChange)}`}>
                  {formatChange(card.change!)}
                  {getChangeIcon(effectiveChange)}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
