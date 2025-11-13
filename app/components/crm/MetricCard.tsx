import { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue'
}: MetricCardProps) {
  // Determinar tamaño de fuente basado en longitud del valor
  const valueString = String(value)
  const getFontSize = () => {
    if (valueString.length > 10) return 'text-xl' // Valores muy largos
    if (valueString.length > 7) return 'text-2xl'  // Valores largos
    return 'text-3xl' // Valores normales
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200 min-h-[140px] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</div>
        {icon && <div className="text-xl">{icon}</div>}
      </div>
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <div className={`${getFontSize()} font-bold text-gray-900 leading-tight mb-1 break-words`}>
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-600 mt-1 line-clamp-2">{subtitle}</div>
        )}
      </div>
      {trend && (
        <div className={`text-xs mt-2 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </div>
  )
}
