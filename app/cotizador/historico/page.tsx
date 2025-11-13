'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Cotizacion {
  id: string
  numero_cotizacion: string
  cliente: string
  total_usd_fob: number
  created_at: string
  items: any[]
}

export default function HistoricoPage() {
  const router = useRouter()
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchCotizaciones()
  }, [])

  const fetchCotizaciones = async () => {
    try {
      const response = await fetch('/api/cotizaciones')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar cotizaciones')
      }

      setCotizaciones(data.cotizaciones)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cotizaciones?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar cotización')
      }

      // Refrescar lista
      fetchCotizaciones()
      setDeleteConfirm(null)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDuplicate = async (cotizacion: Cotizacion) => {
    // Implementar duplicación
    const newNumero = `${cotizacion.numero_cotizacion}-COPIA`
    try {
      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cotizacion: {
            ...cotizacion,
            id: undefined,
            numero_cotizacion: newNumero,
            created_at: undefined,
            updated_at: undefined
          },
          items: cotizacion.items.map(item => ({
            ...item,
            id: undefined,
            cotizacion_id: undefined,
            created_at: undefined
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Error al duplicar cotización')
      }

      fetchCotizaciones()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando cotizaciones...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Histórico de Cotizaciones
              </h1>
              <p className="text-gray-600 mt-2">
                {cotizaciones.length} cotizaciones registradas
              </p>
            </div>
            <button
              onClick={() => router.push('/cotizador')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
            >
              + Nueva Cotización
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Lista de Cotizaciones */}
        {cotizaciones.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">
              No hay cotizaciones registradas
            </p>
            <button
              onClick={() => router.push('/cotizador')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
            >
              Crear Primera Cotización
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cotizaciones.map(cotizacion => (
              <div
                key={cotizacion.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        Cotización N° {cotizacion.numero_cotizacion}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {cotizacion.items?.length || 0} productos
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Cliente:</span>{' '}
                      {cotizacion.cliente}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Fecha:</span>{' '}
                      {formatDate(cotizacion.created_at)}
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mt-3">
                      USD ${formatCurrency(cotizacion.total_usd_fob || 0)} FOB
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() =>
                        router.push(`/cotizador/pdf/${cotizacion.id}`)
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold text-sm"
                    >
                      Ver PDF
                    </button>
                    <button
                      onClick={() => handleDuplicate(cotizacion)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold text-sm"
                    >
                      Duplicar
                    </button>
                    {deleteConfirm === cotizacion.id ? (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleDelete(cotizacion.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-semibold text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(cotizacion.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>

                {/* Items preview */}
                {cotizacion.items && cotizacion.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Productos incluidos:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {cotizacion.items.slice(0, 6).map((item, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-600 truncate"
                        >
                          • {item.descripcion}
                        </div>
                      ))}
                      {cotizacion.items.length > 6 && (
                        <div className="text-sm text-gray-500 italic">
                          ... y {cotizacion.items.length - 6} más
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
