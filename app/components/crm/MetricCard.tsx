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
    if (valueString.length > 12) return 'text-base' // Valores muy largos
    if (valueString.length > 9) return 'text-lg'   // Valores largos
    if (valueString.length > 6) return 'text-xl'   // Valores medianos
    return 'text-2xl' // Valores normales
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-3 border border-gray-200 hover:shadow-lg transition-shadow duration-200 min-h-[120px] flex flex-col">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide truncate max-w-[80%]">{title}</div>
        {icon && <div className="text-lg flex-shrink-0">{icon}</div>}
      </div>
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <div className={`${getFontSize()} font-bold text-gray-900 leading-tight mb-0.5 break-words`}>
          {value}
        </div>
        {subtitle && (
          <div className="text-[10px] text-gray-600 mt-0.5 line-clamp-1 truncate">{subtitle}</div>
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
