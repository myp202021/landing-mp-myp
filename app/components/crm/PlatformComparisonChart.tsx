'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Instagram, Facebook } from 'lucide-react'

interface PlatformData {
  platform: string
  inversion: number
  clicks: number
  impresiones: number
  ctr: number
  cpc: number
}

interface PlatformComparisonChartProps {
  data: PlatformData[]
}

export default function PlatformComparisonChart({ data }: PlatformComparisonChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  const getPlatformIcon = (platform: string) => {
    const normalized = platform.toLowerCase()
    if (normalized.includes('instagram')) {
      return <Instagram className="w-5 h-5" />
    }
    if (normalized.includes('facebook')) {
      return <Facebook className="w-5 h-5" />
    }
    return null
  }

  const getPlatformColor = (platform: string) => {
    const normalized = platform.toLowerCase()
    if (normalized.includes('instagram')) {
      return '#E1306C' // Instagram gradient pink
    }
    if (normalized.includes('facebook')) {
      return '#1877F2' // Facebook blue
    }
    if (normalized.includes('audience')) {
      return '#9333EA' // Purple for Audience Network
    }
    if (normalized.includes('messenger')) {
      return '#0084FF' // Messenger blue
    }
    return '#64748B' // Gray for unknown
  }

  const getPlatformLabel = (platform: string) => {
    const normalized = platform.toLowerCase()
    if (normalized.includes('instagram')) return 'Instagram'
    if (normalized.includes('facebook')) return 'Facebook'
    if (normalized.includes('audience')) return 'Audience Network'
    if (normalized.includes('messenger')) return 'Messenger'
    return platform
  }

  const chartData = data.map(item => ({
    ...item,
    platformLabel: getPlatformLabel(item.platform),
    color: getPlatformColor(item.platform)
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            {getPlatformIcon(data.platform)}
            <p className="font-semibold text-gray-800">{data.platformLabel}</p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Inversión:</span> {formatCurrency(data.inversion)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Clicks:</span> {formatNumber(data.clicks)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Impresiones:</span> {formatNumber(data.impresiones)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">CTR:</span> {data.ctr.toFixed(2)}%
            </p>
            <p className="text-gray-600">
              <span className="font-medium">CPC:</span> {formatCurrency(data.cpc)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Comparación por Plataforma
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>No hay datos por plataforma disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          📱 Comparación por Plataforma
        </h3>
        <p className="text-sm text-gray-600">
          Rendimiento de tus campañas en Instagram vs Facebook
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="border-2 rounded-lg p-4"
            style={{ borderColor: item.color }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div style={{ color: item.color }}>
                  {getPlatformIcon(item.platform)}
                </div>
                <span className="font-semibold text-gray-900">{item.platformLabel}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold" style={{ color: item.color }}>
                {formatCurrency(item.inversion)}
              </p>
              <p className="text-xs text-gray-600">
                {formatNumber(item.clicks)} clicks · {item.ctr.toFixed(1)}% CTR
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="platformLabel"
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Bar dataKey="inversion" name="Inversión" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
