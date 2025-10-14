'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-12 h-12 text-blue-600" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Analizando benchmarks...
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Comparando tus métricas con la industria
        </p>
      </motion.div>
    </div>
  )
}

// Skeleton loader for benchmark cards
export function BenchmarkSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="h-64 bg-gray-200 rounded-lg mt-4" />
    </div>
  )
}

// Skeleton for form inputs
export function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>
      ))}
      <div className="h-12 bg-gray-200 rounded-lg mt-6" />
    </div>
  )
}
