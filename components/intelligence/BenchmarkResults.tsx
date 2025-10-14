'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import type { Benchmark } from '@/lib/types/intelligence'
import { INDUSTRY_LABELS } from '@/lib/types/intelligence'
import BenchmarkChart from './BenchmarkChart'
import PercentileRing from '../ui/PercentileRing'
import Badge, { BadgeShowcase, BadgeType } from '../ui/Badge'
import { MetricTooltip } from '../ui/Tooltip'
import { generateInsights } from '@/lib/intelligence-insights'

interface BenchmarkResultsProps {
  benchmark: Benchmark
  userMetrics: {
    budget: number
    revenue: number
    cac?: number
    roas: number
    conversionRate?: number
    leads?: number
    sales?: number
  }
  totalContributions: number
  onShare: () => void
}

export default function BenchmarkResults({
  benchmark,
  userMetrics,
  totalContributions,
  onShare
}: BenchmarkResultsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const insights = generateInsights(userMetrics, benchmark)

  // Determine earned badges
  const earnedBadges: BadgeType[] = ['first_contribution']
  if (benchmark.userPosition === 'TOP_10') earnedBadges.push('top_performer')
  if (totalContributions > 100) earnedBadges.push('community_builder')

  const formatCLP = (valor: number) => {
    return '$' + Math.round(valor).toLocaleString('es-CL')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Tu benchmark
        </h3>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <Badge type="first_contribution" size="sm" showLabel={false} />
        </motion.div>
      </div>

      {/* Data Quality Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-3 rounded-lg flex items-start gap-3 ${
          benchmark.isReference
            ? 'bg-purple-50 border border-purple-200'
            : 'bg-emerald-50 border border-emerald-200'
        }`}
      >
        <div className={`p-2 rounded-full ${
          benchmark.isReference ? 'bg-purple-100' : 'bg-emerald-100'
        }`}>
          {benchmark.isReference ? (
            <Sparkles className="w-5 h-5 text-purple-600" />
          ) : (
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        <div className="flex-1 text-sm">
          {benchmark.isReference ? (
            <>
              <p className="font-semibold text-purple-800 mb-1">📚 Benchmarks de Referencia</p>
              <p className="text-purple-700">
                {benchmark.totalSamples === 0 ? (
                  <>Aún no hay datos reales para esta combinación. Mostrando benchmarks de fuentes verificadas (WordStream 2024, Triple Whale). <strong>¡Sé el primero en contribuir!</strong></>
                ) : (
                  <>Solo {benchmark.totalSamples} {benchmark.totalSamples === 1 ? 'empresa ha' : 'empresas han'} compartido datos (se necesitan 10+ para usar data real). Mostrando benchmarks de referencia mientras tanto.</>
                )}
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-emerald-800 mb-1">✅ Data de Alta Calidad</p>
              <p className="text-emerald-700">
                Basado en {benchmark.totalSamples} empresas reales de tu industria. Estos benchmarks son 100% datos de la comunidad.
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Hero Position Card */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Percentile Ring */}
          <div className="flex justify-center">
            {benchmark.userPercentiles && (
              <PercentileRing
                percentile={benchmark.userPercentiles.roas}
                label="ROAS"
                size="lg"
              />
            )}
          </div>

          {/* Position Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Tu posición</h4>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {benchmark.userPosition === 'TOP_10' && 'Top 10% 🏆'}
              {benchmark.userPosition === 'ABOVE_AVG' && 'Sobre el promedio ⭐'}
              {benchmark.userPosition === 'AVERAGE' && 'Promedio de industria'}
              {benchmark.userPosition === 'BELOW_AVG' && 'Bajo el promedio'}
              {benchmark.userPosition === 'BOTTOM_10' && 'Necesita mejoras'}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {benchmark.isReference ? (
                <>Comparado con benchmarks de referencia de {INDUSTRY_LABELS[benchmark.industry]}</>
              ) : (
                <>Basado en {benchmark.totalSamples} empresas de {INDUSTRY_LABELS[benchmark.industry]}</>
              )}
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/70 rounded-lg p-2">
                <div className="text-xs text-gray-600">Tu ROAS</div>
                <div className="text-lg font-bold text-gray-900">
                  {userMetrics.roas.toFixed(1)}x
                </div>
              </div>
              <div className="bg-white/70 rounded-lg p-2">
                <div className="text-xs text-gray-600">Promedio</div>
                <div className="text-lg font-bold text-gray-900">
                  {benchmark.avgROAS.toFixed(1)}x
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Insights automáticos
          </h4>
          <div className="space-y-3">
            {insights.slice(0, 3).map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success'
                    ? 'bg-emerald-50 border-emerald-500'
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : insight.type === 'danger'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="font-semibold text-gray-900 text-sm mb-1">
                  {insight.title}
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  {insight.description}
                </div>
                {insight.action && (
                  <div className="text-xs font-medium text-gray-600 bg-white/50 rounded px-2 py-1 inline-block">
                    💡 {insight.action}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Benchmark Charts */}
      {benchmark.percentiles && (
        <div className="space-y-6">
          {/* ROAS Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <BenchmarkChart
              yourValue={userMetrics.roas}
              p25={benchmark.percentiles.roas.p25}
              median={benchmark.percentiles.roas.median}
              p75={benchmark.percentiles.roas.p75}
              metric="roas"
              format="multiplier"
            />
          </div>

          {/* CAC Chart */}
          {userMetrics.cac && benchmark.percentiles.cac.median > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <BenchmarkChart
                yourValue={userMetrics.cac}
                p25={benchmark.percentiles.cac.p25}
                median={benchmark.percentiles.cac.median}
                p75={benchmark.percentiles.cac.p75}
                metric="cac"
                format="currency"
              />
            </div>
          )}

          {/* Conversion Rate Chart */}
          {userMetrics.conversionRate && benchmark.percentiles.conversion.median > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <BenchmarkChart
                yourValue={userMetrics.conversionRate}
                p25={benchmark.percentiles.conversion.p25}
                median={benchmark.percentiles.conversion.median}
                p75={benchmark.percentiles.conversion.p75}
                metric="conversion"
                format="percentage"
              />
            </div>
          )}
        </div>
      )}

      {/* Advanced Metrics (Collapsible) */}
      <div className="bg-white rounded-xl border border-gray-200">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-900">
            Métricas adicionales
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 p-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-600">Presupuesto</span>
                  <MetricTooltip metric="budget" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCLP(benchmark.avgBudget)}
                </div>
                <div className="text-xs text-gray-500">promedio industria</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-600">Revenue</span>
                  <MetricTooltip metric="revenue" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCLP(benchmark.avgRevenue)}
                </div>
                <div className="text-xs text-gray-500">promedio industria</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Badges Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Tus logros
        </h4>
        <BadgeShowcase earnedBadges={earnedBadges} />
      </div>

      {/* Share CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 p-4 rounded-xl">
        <p className="text-sm font-bold text-blue-900 mb-2">
          🚀 Ayuda a que la red crezca
        </p>
        <p className="text-xs text-blue-700 leading-relaxed mb-3">
          Mientras más empresas participen, más precisos son los benchmarks para todos.
          <strong className="text-blue-900"> Comparte M&P Intelligence</strong> con tu red.
        </p>
        <button
          onClick={onShare}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          📋 Copiar link para compartir
        </button>
      </div>
    </motion.div>
  )
}
