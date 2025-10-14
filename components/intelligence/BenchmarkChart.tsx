'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { MetricTooltip } from '../ui/Tooltip'

interface BenchmarkChartProps {
  yourValue: number
  p25: number  // 25th percentile
  median: number  // 50th percentile
  p75: number  // 75th percentile
  metric: 'cac' | 'roas' | 'conversion'
  format?: 'currency' | 'multiplier' | 'percentage'
}

export default function BenchmarkChart({
  yourValue,
  p25,
  median,
  p75,
  metric,
  format = 'currency'
}: BenchmarkChartProps) {
  const formatValue = (value: number) => {
    if (format === 'currency') {
      return `$${Math.round(value).toLocaleString('es-CL')}`
    }
    if (format === 'multiplier') {
      return `${value.toFixed(1)}x`
    }
    if (format === 'percentage') {
      return `${value.toFixed(1)}%`
    }
    return value.toString()
  }

  const data = [
    { name: 'Top 25%', value: p25, type: 'benchmark' },
    { name: 'Mediana', value: median, type: 'benchmark' },
    { name: 'Top 75%', value: p75, type: 'benchmark' },
    { name: 'Tú', value: yourValue, type: 'yours' },
  ]

  const getBarColor = (entry: any) => {
    if (entry.type === 'yours') {
      // Para CAC, menor es mejor. Para ROAS y conversion, mayor es mejor
      const isGood = metric === 'cac'
        ? yourValue < median
        : yourValue > median

      return isGood ? '#10b981' : '#ef4444'
    }
    return '#e5e7eb'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="font-semibold text-gray-900 mb-1">{data.name}</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatValue(data.value)}
          </div>
          {data.type === 'yours' && (
            <div className="text-xs text-gray-600 mt-1">
              Tu performance
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-sm font-semibold text-gray-700">
          Comparativa vs Industria
        </h4>
        <MetricTooltip metric={metric} />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={formatValue}
          />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />

          {/* Reference line for median */}
          <ReferenceLine
            y={median}
            stroke="#9ca3af"
            strokeDasharray="3 3"
            label={{
              value: 'Mediana industria',
              position: 'right',
              fill: '#6b7280',
              fontSize: 11,
            }}
          />

          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-200" />
          <span className="text-gray-600">Benchmarks industria</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-gray-600">Tú (arriba del promedio)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-gray-600">Tú (bajo el promedio)</span>
        </div>
      </div>
    </div>
  )
}
