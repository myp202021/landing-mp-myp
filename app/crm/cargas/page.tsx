'use client'

/**
 * CARGAS PAGE - Historial de archivos subidos
 */

import { useState, useEffect } from 'react'

interface Cliente {
  id: string
  nombre: string
  rubro: string | null
}

interface Carga {
  id: number
  cliente_id: string
  uploader_user_id: string | null
  filename: string
  storage_url: string | null
  size_bytes: number | null
  mime_type: string | null
  checksum_sha256: string | null
  columnas_detectadas: string[] | null
  mapeo_campos: Record<string, string> | null
  rows_ok: number
  rows_error: number
  rows_duplicados: number
  ejemplos_error: any[] | null
  meta: any | null
  estado: 'procesando' | 'completado' | 'error'
  creado_en: string
}

export default function CargasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [cargas, setCargas] = useState<Carga[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCarga, setSelectedCarga] = useState<Carga | null>(null)

  useEffect(() => {
    fetchClientes()
  }, [])

  useEffect(() => {
    if (selectedCliente) {
      fetchCargas()
    }
  }, [selectedCliente])

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/crm/clientes')
      const data = await res.json()
      setClientes(data.clientes || [])
    } catch (error) {
      console.error('Error fetching clientes:', error)
    }
  }

  const fetchCargas = async () => {
    if (!selectedCliente) return

    setLoading(true)
    try {
      const res = await fetch(`/api/crm/cargas?clientId=${selectedCliente}`)
      const data = await res.json()
      setCargas(data.cargas || [])
    } catch (error) {
      console.error('Error fetching cargas:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Historial de Cargas</h1>
            <p className="text-gray-600 mt-1">Archivos subidos y procesados</p>
          </div>

          {/* Cliente selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Cliente *
            </label>
            <select
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.rubro ? `(${c.rubro})` : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedCliente && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-gray-500">Cargando...</div>
              ) : cargas.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No hay cargas registradas
                </div>
              ) : (
                cargas.map((carga) => (
                  <div
                    key={carga.id}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedCarga?.id === carga.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCarga(carga)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{carga.filename}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            carga.estado === 'completado'
                              ? 'bg-green-100 text-green-800'
                              : carga.estado === 'error'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {carga.estado}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Fecha</p>
                            <p className="text-gray-900">
                              {new Date(carga.creado_en).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Tamaño</p>
                            <p className="text-gray-900">
                              {carga.size_bytes ? `${(carga.size_bytes / 1024).toFixed(1)} KB` : '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Procesadas ✅</p>
                            <p className="text-green-600 font-semibold">{carga.rows_ok}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Errores ❌</p>
                            <p className="text-red-600 font-semibold">{carga.rows_error}</p>
                          </div>
                        </div>

                        {/* Detalles expandidos */}
                        {selectedCarga?.id === carga.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                            <div>
                              <p className="text-sm font-semibold mb-2">Duplicados detectados:</p>
                              <p className="text-2xl font-bold text-orange-600">{carga.rows_duplicados}</p>
                            </div>

                            {carga.columnas_detectadas && (
                              <div>
                                <p className="text-sm font-semibold mb-2">Columnas detectadas:</p>
                                <div className="flex flex-wrap gap-2">
                                  {carga.columnas_detectadas.map((col, i) => (
                                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                      {col}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {carga.mapeo_campos && Object.keys(carga.mapeo_campos).length > 0 && (
                              <div>
                                <p className="text-sm font-semibold mb-2">Mapeo de campos aplicado:</p>
                                <div className="bg-gray-50 rounded p-3 text-xs space-y-1">
                                  {Object.entries(carga.mapeo_campos).map(([key, value], i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <span className="text-gray-600">{key}</span>
                                      <span className="text-gray-400">→</span>
                                      <span className="text-gray-900 font-medium">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {carga.ejemplos_error && carga.ejemplos_error.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-red-700 mb-2">Ejemplos de errores:</p>
                                <div className="bg-red-50 rounded p-3 space-y-2">
                                  {carga.ejemplos_error.slice(0, 5).map((err: any, i: number) => (
                                    <div key={i} className="text-xs border-l-2 border-red-300 pl-2">
                                      <p className="text-red-700">Fila {err.row}: {err.error}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {carga.checksum_sha256 && (
                              <div>
                                <p className="text-sm font-semibold mb-1">Checksum (SHA-256):</p>
                                <p className="text-xs text-gray-500 font-mono">{carga.checksum_sha256}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
