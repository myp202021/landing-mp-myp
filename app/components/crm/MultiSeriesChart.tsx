'use client'

import React from 'react'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface ChartDataPoint {
  fecha: string
  inversion: number
  clicks: number
  impresiones: number
  ctr: number
}

interface MultiSeriesChartProps {
  data: ChartDataPoint[]
}

export default function MultiSeriesChart({ data }: MultiSeriesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            {formatDate(payload[0].payload.fecha)}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600">{entry.name}:</span>
              </span>
              <span className="font-semibold" style={{ color: entry.color }}>
                {entry.dataKey === 'inversion'
                  ? formatCurrency(entry.value)
                  : entry.value.toLocaleString('es-CL')}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Rendimiento General
        </h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          <p>No hay datos disponibles para el periodo seleccionado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Rendimiento General
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="fecha"
              tickFormatter={formatDate}
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              stroke="#3B82F6"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
              stroke="#10B981"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar
              yAxisId="left"
              dataKey="inversion"
              name="Inversión"
              fill="#3B82F6"
              opacity={0.8}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="clicks"
              name="Clicks"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="impresiones"
              name="Impresiones"
              stroke="#8B5CF6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#8B5CF6', r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Datos de los últimos {data.length} días
      </p>
    </div>
  )
}
