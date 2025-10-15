'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Database, Users, TrendingUp, Activity, BarChart3, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { INDUSTRY_LABELS, CHANNEL_LABELS, REGION_LABELS } from '@/lib/types/intelligence'

interface Stats {
  totalContributions: number
  byIndustry: Record<string, number>
  byChannel: Record<string, number>
  byRegion: Record<string, number>
  readyForRealData: Array<{
    industry: string
    channel: string
    count: number
    avgRoas: number
    avgCac: number
  }>
  recentContributions: Array<{
    created_at: string
    industry: string
    channel: string
    budget_monthly: number
    revenue: number
    roas: number
    region?: string
  }>
  aggregateMetrics: {
    avgBudget: number
    avgRevenue: number
    avgRoas: number
    avgCac: number
  }
}

export default function InternalStatsClient() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/intelligence/stats')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al cargar estadísticas')
      }

      setStats(result.stats)
      setLastUpdate(result.timestamp)
    } catch (err: any) {
      console.error('Error loading stats:', err)
      setError(err.message || 'Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const formatCLP = (valor: number) => {
    return '$' + Math.round(valor).toLocaleString('es-CL')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-center mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo-blanco.png" alt="M&P Logo" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/labs/mp-intelligence" className="text-white font-semibold text-sm hover:text-emerald-300 transition-colors">
              ← Volver a M&P Intelligence
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">📊 Estadísticas Internas</h1>
              <p className="text-purple-200">Dashboard de uso exclusivo interno · No compartir públicamente</p>
            </div>
            <button
              onClick={loadStats}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
          {lastUpdate && (
            <p className="text-sm text-purple-300">
              Última actualización: {formatDate(lastUpdate)}
            </p>
          )}
        </div>

        {stats && (
          <>
            {/* Overview Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalContributions}</div>
                <div className="text-sm text-purple-200">Total Contribuciones</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.aggregateMetrics.avgRoas.toFixed(1)}x</div>
                <div className="text-sm text-purple-200">ROAS Promedio</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{formatCLP(stats.aggregateMetrics.avgCac)}</div>
                <div className="text-sm text-purple-200">CAC Promedio</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.readyForRealData.length}</div>
                <div className="text-sm text-purple-200">Con Data Real (10+)</div>
              </div>
            </div>

            {/* Distribuciones */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Por Industria */}
              <div className="bg-white rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Por Industria
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.byIndustry)
                    .sort(([, a], [, b]) => b - a)
                    .map(([industry, count]) => (
                      <div key={industry} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{INDUSTRY_LABELS[industry] || industry}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Por Canal */}
              <div className="bg-white rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Por Canal
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.byChannel)
                    .sort(([, a], [, b]) => b - a)
                    .map(([channel, count]) => (
                      <div key={channel} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{CHANNEL_LABELS[channel] || channel}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Por Región */}
              <div className="bg-white rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Por Región
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.byRegion).length > 0 ? (
                    Object.entries(stats.byRegion)
                      .sort(([, a], [, b]) => b - a)
                      .map(([region, count]) => (
                        <div key={region} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{REGION_LABELS[region] || region}</span>
                          <span className="font-semibold text-gray-900">{count}</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500">No hay datos de región</p>
                  )}
                </div>
              </div>
            </div>

            {/* Combinaciones con Data Real */}
            <div className="bg-white rounded-xl p-6 shadow-xl mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Combinaciones con Data Real (10+ muestras)
              </h3>
              {stats.readyForRealData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Industria</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Canal</th>
                        <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Muestras</th>
                        <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">ROAS Prom.</th>
                        <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">CAC Prom.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.readyForRealData
                        .sort((a, b) => b.count - a.count)
                        .map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-2 px-3 text-sm text-gray-900">{INDUSTRY_LABELS[item.industry]}</td>
                            <td className="py-2 px-3 text-sm text-gray-900">{CHANNEL_LABELS[item.channel]}</td>
                            <td className="py-2 px-3 text-sm text-right font-semibold text-green-600">{item.count}</td>
                            <td className="py-2 px-3 text-sm text-right text-gray-900">{item.avgRoas.toFixed(1)}x</td>
                            <td className="py-2 px-3 text-sm text-right text-gray-900">{formatCLP(item.avgCac)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aún no hay combinaciones con 10+ muestras</p>
                  <p className="text-sm text-gray-400 mt-2">Se necesitan al menos 10 contribuciones por combinación industria/canal</p>
                </div>
              )}
            </div>

            {/* Últimas Contribuciones */}
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Últimas 10 Contribuciones
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Fecha</th>
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Industria</th>
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Canal</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Presupuesto</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Revenue</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">ROAS</th>
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Región</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentContributions.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-xs text-gray-600">{formatDate(item.created_at)}</td>
                        <td className="py-2 px-3 text-sm text-gray-900">{INDUSTRY_LABELS[item.industry]}</td>
                        <td className="py-2 px-3 text-sm text-gray-900">{CHANNEL_LABELS[item.channel]}</td>
                        <td className="py-2 px-3 text-sm text-right text-gray-900">{formatCLP(item.budget_monthly)}</td>
                        <td className="py-2 px-3 text-sm text-right text-gray-900">{formatCLP(item.revenue)}</td>
                        <td className="py-2 px-3 text-sm text-right font-semibold text-blue-600">{item.roas.toFixed(1)}x</td>
                        <td className="py-2 px-3 text-sm text-gray-900">{item.region ? REGION_LABELS[item.region] : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Warning Footer */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-200 text-sm text-center">
            ⚠️ <strong>Uso Interno:</strong> Esta página contiene información sensible. No compartir públicamente ni enlazar desde el sitio.
          </p>
        </div>
      </main>
    </div>
  )
}
