'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Bug, WifiOff, Database } from 'lucide-react'

interface ErrorStateProps {
  type?: 'network' | 'validation' | 'server' | 'unknown'
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  type = 'unknown',
  message,
  onRetry
}: ErrorStateProps) {
  const errorConfig = {
    network: {
      icon: WifiOff,
      title: 'Error de conexión',
      description: 'No pudimos conectarnos al servidor. Verifica tu conexión a internet e intenta nuevamente.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    validation: {
      icon: AlertCircle,
      title: 'Datos inválidos',
      description: message || 'Algunos campos tienen valores incorrectos. Revisa los datos ingresados.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    server: {
      icon: Database,
      title: 'Error del servidor',
      description: 'Ocurrió un problema en nuestros servidores. Estamos trabajando en solucionarlo.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    unknown: {
      icon: Bug,
      title: 'Error inesperado',
      description: message || 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  }

  const config = errorConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-4`}
      >
        <Icon className={`w-8 h-8 ${config.color}`} />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center max-w-md"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">{config.title}</h3>
        <p className="text-gray-600 text-sm mb-6">{config.description}</p>

        {/* Error details (if provided) */}
        {message && type !== 'validation' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 text-left">
            <div className="text-xs font-mono text-gray-600 break-all">{message}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Recargar página
          </motion.button>
        </div>
      </motion.div>

      {/* Help text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-gray-500 mt-6 text-center"
      >
        Si el problema persiste, contacta a{' '}
        <a href="mailto:soporte@mulleryperez.cl" className="text-blue-600 hover:underline">
          soporte@mulleryperez.cl
        </a>
      </motion.p>
    </motion.div>
  )
}

// Inline error for form fields
export function FieldError({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 text-red-600 text-sm mt-1"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </motion.div>
  )
}

// Toast-style error notification
export function ErrorToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 max-w-md bg-red-50 border-l-4 border-red-600 rounded-lg shadow-lg p-4 z-50"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-red-900 text-sm">Error</div>
          <div className="text-red-700 text-sm mt-0.5">{message}</div>
        </div>
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          ×
        </button>
      </div>
    </motion.div>
  )
}
