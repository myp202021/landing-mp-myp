'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

interface TooltipProps {
  content: string | React.ReactNode
  children?: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  maxWidth?: string
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  maxWidth = '280px'
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-help"
      >
        {children || (
          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionStyles[position]}`}
            style={{ maxWidth }}
          >
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
              <div className="relative">
                {content}
                {/* Arrow */}
                <div
                  className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
                    position === 'top'
                      ? 'bottom-[-4px] left-1/2 -translate-x-1/2'
                      : position === 'bottom'
                      ? 'top-[-4px] left-1/2 -translate-x-1/2'
                      : position === 'left'
                      ? 'right-[-4px] top-1/2 -translate-y-1/2'
                      : 'left-[-4px] top-1/2 -translate-y-1/2'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Tooltip preconfigurado para métricas
export function MetricTooltip({ metric }: { metric: 'cac' | 'roas' | 'conversion' | 'budget' | 'revenue' }) {
  const tooltips = {
    cac: (
      <div>
        <div className="font-semibold mb-1">Costo de Adquisición de Cliente (CAC)</div>
        <div className="text-gray-300 text-xs">
          Cuánto cuesta conseguir un nuevo cliente.
          <div className="mt-1">Fórmula: Presupuesto ÷ Ventas</div>
          <div className="mt-1 text-emerald-300">✓ Menor es mejor</div>
        </div>
      </div>
    ),
    roas: (
      <div>
        <div className="font-semibold mb-1">Return on Ad Spend (ROAS)</div>
        <div className="text-gray-300 text-xs">
          Cuántos pesos generas por cada peso invertido en publicidad.
          <div className="mt-1">Fórmula: Revenue ÷ Presupuesto</div>
          <div className="mt-1 text-emerald-300">✓ Mayor es mejor (mínimo 2x)</div>
        </div>
      </div>
    ),
    conversion: (
      <div>
        <div className="font-semibold mb-1">Tasa de Conversión</div>
        <div className="text-gray-300 text-xs">
          Porcentaje de leads que se convierten en clientes.
          <div className="mt-1">Fórmula: (Ventas ÷ Leads) × 100</div>
          <div className="mt-1 text-emerald-300">✓ Mayor es mejor</div>
        </div>
      </div>
    ),
    budget: (
      <div>
        <div className="font-semibold mb-1">Presupuesto Mensual</div>
        <div className="text-gray-300 text-xs">
          Inversión total en publicidad digital del último mes.
          <div className="mt-1">Incluye: Google Ads, Meta Ads, LinkedIn, etc.</div>
        </div>
      </div>
    ),
    revenue: (
      <div>
        <div className="font-semibold mb-1">Ingresos Generados</div>
        <div className="text-gray-300 text-xs">
          Revenue total atribuido a la publicidad en el período.
          <div className="mt-1">No incluye ventas orgánicas o referidos.</div>
        </div>
      </div>
    ),
  }

  return <Tooltip content={tooltips[metric]} maxWidth="320px" />
}
