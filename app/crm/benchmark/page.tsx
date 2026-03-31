'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'

export default function BenchmarkHubPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Array<{ id: string; nombre: string; rubro: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/clientes').then(r => r.json()).then(d => {
      setClientes((d.clientes || []).filter((c: { activo: boolean }) => c.activo))
      setLoading(false)
    })
  }, [])

  return (
    <CRMLayout title="Benchmark Competitivo">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Benchmark Competitivo</h2>
          <p className="text-gray-500 mt-1">Análisis de tono, posicionamiento y comunicación vs competidores</p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Cargando clientes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientes.map(c => (
              <div
                key={c.id}
                onClick={() => router.push(`/crm/benchmark/${c.id}`)}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 cursor-pointer transition"
              >
                <h3 className="font-bold text-gray-900 text-lg">{c.nombre}</h3>
                <p className="text-sm text-gray-500">{c.rubro || 'Sin rubro'}</p>
                <p className="text-xs text-blue-600 mt-2 font-medium">Ver benchmark →</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </CRMLayout>
  )
}
