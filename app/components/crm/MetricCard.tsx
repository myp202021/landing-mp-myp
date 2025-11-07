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
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-600">{title}</div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
      )}
      {trend && (
        <div className={`text-xs mt-2 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </div>
  )
}
