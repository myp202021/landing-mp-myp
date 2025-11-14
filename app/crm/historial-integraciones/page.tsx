'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'
import { useSimpleAuth } from '@/lib/auth/simple-auth'

interface IntegracionEvento {
  id: number
  cliente_id: string
  tipo: string
  accion: string
  descripcion: string | null
  metadata: any
  webhook_url: string | null
  user_id: number | null
  creado_en: string
  clientes: { nombre: string } | null
  usuarios: { nombre: string; username: string } | null
}

interface Cliente {
  id: string
  nombre: string
}

interface Metricas {
  totalEventos: number
  integracionesActivas: number
  eventosHoy: number
  erroresHoy: number
}

export default function HistorialIntegracionesPage() {
  const router = useRouter()
  const { user } = useSimpleAuth()

  const [loading, setLoading] = useState(true)
  const [historial, setHistorial] = useState<IntegracionEvento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [metricas, setMetricas] = useState<Metricas>({
    totalEventos: 0,
    integracionesActivas: 0,
    eventosHoy: 0,
    erroresHoy: 0
  })

  // Filtros
  const [filtroCliente, setFiltroCliente] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroAccion, setFiltroAccion] = useState('')

  // Paginación
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 50

  // Modal
  const [selectedEvento, setSelectedEvento] = useState<IntegracionEvento | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Proteger ruta - solo admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Acceso denegado. Solo administradores pueden ver el historial.')
      router.push('/crm')
    }
  }, [user, router])

  // Cargar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch('/api/crm/clientes?limit=1000')
        const data = await res.json()
        setClientes(data.clientes || [])
      } catch (error) {
        console.error('Error cargando clientes:', error)
      }
    }
    fetchClientes()
  }, [])

  // Cargar historial
  useEffect(() => {
    fetchHistorial()
  }, [filtroCliente, filtroTipo, filtroAccion, page])

  const fetchHistorial = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filtroCliente) params.append('cliente_id', filtroCliente)
      if (filtroTipo) params.append('tipo', filtroTipo)
      if (filtroAccion) params.append('accion', filtroAccion)
      params.append('limit', itemsPerPage.toString())
      params.append('offset', ((page - 1) * itemsPerPage).toString())

      const res = await fetch(`/api/crm/integraciones/historial?${params}`)
      const data = await res.json()

      setHistorial(data.historial || [])
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))

      // Calcular métricas
      calcularMetricas(data.historial || [])
    } catch (error) {
      console.error('Error cargando historial:', error)
    } finally {
      setLoading(false)
    }
  }

  const calcularMetricas = (eventos: IntegracionEvento[]) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const eventosHoy = eventos.filter(e => new Date(e.creado_en) >= hoy).length
    const erroresHoy = eventos.filter(e =>
      e.accion === 'error' && new Date(e.creado_en) >= hoy
    ).length

    setMetricas({
      totalEventos: eventos.length,
      integracionesActivas: 0, // Se calculará desde la API en el futuro
      eventosHoy,
      erroresHoy
    })
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'zapier': return '⚡'
      case 'google_ads': return '🎯'
      case 'meta_ads': return '📘'
      default: return '🔌'
    }
  }

  const getAccionBadge = (accion: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      activado: { color: 'bg-green-100 text-green-800 border-green-300', text: 'Activado' },
      desactivado: { color: 'bg-gray-100 text-gray-800 border-gray-300', text: 'Desactivado' },
      configurado: { color: 'bg-blue-100 text-blue-800 border-blue-300', text: 'Configurado' },
      error: { color: 'bg-red-100 text-red-800 border-red-300', text: 'Error' },
      test_exitoso: { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'Test Exitoso' },
      test_fallido: { color: 'bg-orange-100 text-orange-800 border-orange-300', text: 'Test Fallido' }
    }
    const badge = badges[accion] || { color: 'bg-gray-100 text-gray-800 border-gray-300', text: accion }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  const handleVerDetalles = (evento: IntegracionEvento) => {
    setSelectedEvento(evento)
    setShowModal(true)
  }

  const exportarCSV = () => {
    const headers = ['Fecha', 'Cliente', 'Tipo', 'Acción', 'Descripción', 'Usuario', 'Webhook URL']
    const rows = historial.map(e => [
      formatFecha(e.creado_en),
      e.clientes?.nombre || 'N/A',
      e.tipo,
      e.accion,
      e.descripcion || '',
      e.usuarios?.nombre || 'Sistema',
      e.webhook_url || ''
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial-integraciones-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <CRMLayout title="Historial de Integraciones">
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historial de Integraciones</h1>
            <p className="text-gray-600 mt-1">Registro completo de eventos de todas las integraciones</p>
          </div>
          <Button onClick={exportarCSV} variant="secondary">
            📥 Exportar CSV
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Eventos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metricas.totalEventos}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Integraciones Activas</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{metricas.integracionesActivas}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Eventos Hoy</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{metricas.eventosHoy}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Errores Hoy</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{metricas.erroresHoy}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cliente</label>
              <select
                value={filtroCliente}
                onChange={(e) => {
                  setFiltroCliente(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos los clientes</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => {
                  setFiltroTipo(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos los tipos</option>
                <option value="zapier">⚡ Zapier</option>
                <option value="google_ads">🎯 Google Ads</option>
                <option value="meta_ads">📘 Meta Ads</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Acción</label>
              <select
                value={filtroAccion}
                onChange={(e) => {
                  setFiltroAccion(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todas las acciones</option>
                <option value="activado">Activado</option>
                <option value="desactivado">Desactivado</option>
                <option value="configurado">Configurado</option>
                <option value="error">Error</option>
                <option value="test_exitoso">Test Exitoso</option>
                <option value="test_fallido">Test Fallido</option>
              </select>
            </div>
          </div>

          {(filtroCliente || filtroTipo || filtroAccion) && (
            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setFiltroCliente('')
                  setFiltroTipo('')
                  setFiltroAccion('')
                  setPage(1)
                }}
              >
                🔄 Limpiar Filtros
              </Button>
            </div>
          )}
        </div>

        {/* Tabla de historial */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando historial...</p>
              </div>
            </div>
          ) : historial.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No hay eventos registrados</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Fecha/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Acción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historial.map((evento) => (
                      <tr key={evento.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatFecha(evento.creado_en)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {evento.clientes?.nombre || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="flex items-center gap-2">
                            <span className="text-xl">{getTipoIcon(evento.tipo)}</span>
                            <span className="font-semibold text-gray-700">{evento.tipo}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getAccionBadge(evento.accion)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {evento.descripcion || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {evento.usuarios?.nombre || 'Sistema'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleVerDetalles(evento)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Página {page} de {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      ← Anterior
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Siguiente →
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {showModal && selectedEvento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Detalles del Evento #{selectedEvento.id}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Fecha/Hora</p>
                  <p className="text-gray-900">{formatFecha(selectedEvento.creado_en)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Cliente</p>
                  <p className="text-gray-900">{selectedEvento.clientes?.nombre || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Tipo</p>
                  <p className="text-gray-900 flex items-center gap-2">
                    <span className="text-xl">{getTipoIcon(selectedEvento.tipo)}</span>
                    {selectedEvento.tipo}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Acción</p>
                  <div className="mt-1">{getAccionBadge(selectedEvento.accion)}</div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Usuario</p>
                  <p className="text-gray-900">{selectedEvento.usuarios?.nombre || 'Sistema'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">ID Usuario</p>
                  <p className="text-gray-900">{selectedEvento.user_id || 'N/A'}</p>
                </div>
              </div>

              {selectedEvento.descripcion && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Descripción</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                    {selectedEvento.descripcion}
                  </p>
                </div>
              )}

              {selectedEvento.webhook_url && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Webhook URL</p>
                  <p className="text-blue-600 bg-blue-50 p-3 rounded border border-blue-200 font-mono text-sm break-all">
                    {selectedEvento.webhook_url}
                  </p>
                </div>
              )}

              {selectedEvento.metadata && Object.keys(selectedEvento.metadata).length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Metadata (JSON)</p>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-xs">
                    {JSON.stringify(selectedEvento.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <Button onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  )
}
