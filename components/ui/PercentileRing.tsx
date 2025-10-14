'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface PercentileRingProps {
  percentile: number // 0-100
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export default function PercentileRing({
  percentile,
  label,
  size = 'md',
  showIcon = true
}: PercentileRingProps) {
  const sizeConfig = {
    sm: { ring: 60, stroke: 4, text: 'text-lg', icon: 16 },
    md: { ring: 100, stroke: 6, text: 'text-2xl', icon: 20 },
    lg: { ring: 140, stroke: 8, text: 'text-4xl', icon: 28 },
  }

  const config = sizeConfig[size]
  const radius = (config.ring - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentile / 100) * circumference

  // Colores based on position
  const getColor = () => {
    if (percentile <= 10) return { ring: '#10b981', bg: 'bg-emerald-500', label: 'Top 10%' }
    if (percentile <= 25) return { ring: '#3b82f6', bg: 'bg-blue-500', label: 'Top 25%' }
    if (percentile <= 50) return { ring: '#8b5cf6', bg: 'bg-purple-500', label: 'Top 50%' }
    if (percentile <= 75) return { ring: '#f59e0b', bg: 'bg-amber-500', label: 'Top 75%' }
    return { ring: '#ef4444', bg: 'bg-red-500', label: 'Necesita mejorar' }
  }

  const color = getColor()

  const getIcon = () => {
    if (percentile <= 25) return <TrendingUp className={`w-${config.icon/4} h-${config.icon/4}`} />
    if (percentile <= 75) return <Minus className={`w-${config.icon/4} h-${config.icon/4}`} />
    return <TrendingDown className={`w-${config.icon/4} h-${config.icon/4}`} />
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: config.ring, height: config.ring }}>
        {/* Background ring */}
        <svg className="transform -rotate-90" width={config.ring} height={config.ring}>
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={config.stroke}
            fill="none"
          />

          {/* Animated progress ring */}
          <motion.circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            stroke={color.ring}
            strokeWidth={config.stroke}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showIcon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-gray-400 mb-1"
            >
              {getIcon()}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`font-bold ${config.text}`}
            style={{ color: color.ring }}
          >
            {Math.round(percentile)}
          </motion.div>
          <div className="text-xs text-gray-500 font-medium">percentil</div>
        </div>
      </div>

      {/* Label */}
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${color.bg} bg-opacity-10`}>
            <div className={`w-2 h-2 rounded-full ${color.bg}`} />
            <span className="text-sm font-semibold" style={{ color: color.ring }}>
              {color.label}
            </span>
          </div>
          {label && (
            <div className="text-xs text-gray-600 mt-1">{label}</div>
          )}
        </motion.div>
      )}
    </div>
  )
}
