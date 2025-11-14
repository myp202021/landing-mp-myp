'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'

interface HistorialLead {
  id: number
  lead_id: number
  usuario: string
  accion: string
  campo_cambiado?: string
  valor_anterior?: string
  valor_nuevo?: string
  descripcion?: string
  created_at: string
}

interface HistorialCotizacion {
  id: number
  cotizacion_id: number
  nombre_proyecto?: string
  usuario: string
  accion: string
  estado_anterior?: string
  estado_nuevo?: string
  descripcion?: string
  created_at: string
}

interface Lead {
  id: number
  nombre?: string
  email?: string
}

export default function ClienteHistorialPage() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'leads' | 'cotizaciones'>('leads')
  const [loading, setLoading] = useState(true)

  // Tab Leads
  const [historialLeads, setHistorialLeads] = useState<HistorialLead[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadSeleccionado, setLeadSeleccionado] = useState<string>('')
  const [fechaDesdeLeads, setFechaDesdeLeads] = useState<string>('')
  const [fechaHastaLeads, setFechaHastaLeads] = useState<string>('')
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [paginaLeads, setPaginaLeads] = useState(0)

  // Tab Cotizaciones
  const [historialCotizaciones, setHistorialCotizaciones] = useState<HistorialCotizacion[]>([])
  const [estadoFiltro, setEstadoFiltro] = useState<string>('')
  const [fechaDesdeCotizaciones, setFechaDesdeCotizaciones] = useState<string>('')
  const [fechaHastaCotizaciones, setFechaHastaCotizaciones] = useState<string>('')
  const [loadingCotizaciones, setLoadingCotizaciones] = useState(false)
  const [paginaCotizaciones, setPaginaCotizaciones] = useState(0)

  const ITEMS_POR_PAGINA = 50

  // Redirigir si no es cliente
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
    } else if (user?.role !== 'cliente') {
      router.push('/crm')
    } else {
      loadInitialData()
    }
  }, [isAuthenticated, user, router])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Cargar lista de leads del cliente para el filtro
      if (user?.cliente_id) {
        const resLeads = await fetch(`/api/crm/leads?cliente_id=${user.cliente_id}&limit=500`)
        const dataLeads = await resLeads.json()
        setLeads(dataLeads.leads || [])
      }
    } catch (error) {
      console.error('Error cargando datos iniciales:', error)
    }
    setLoading(false)
  }

  const loadHistorialLeads = async () => {
    if (!user?.cliente_id) return

    setLoadingLeads(true)
    try {
      let url = `/api/crm/leads/historial?cliente_id=${user.cliente_id}&limit=${ITEMS_POR_PAGINA}&offset=${paginaLeads * ITEMS_POR_PAGINA}`

      if (leadSeleccionado) {
        url = `/api/crm/leads/historial?lead_id=${leadSeleccionado}`
      }

      const res = await fetch(url)
      const data = await res.json()

      let historial = data.historial || []

      // Filtrar por fechas si están definidas
      if (fechaDesdeLeads) {
        historial = historial.filter((h: HistorialLead) =>
          new Date(h.created_at) >= new Date(fechaDesdeLeads)
        )
      }
      if (fechaHastaLeads) {
        const fechaHasta = new Date(fechaHastaLeads)
        fechaHasta.setHours(23, 59, 59, 999) // Fin del día
        historial = historial.filter((h: HistorialLead) =>
          new Date(h.created_at) <= fechaHasta
        )
      }

      setHistorialLeads(historial)
    } catch (error) {
      console.error('Error cargando historial de leads:', error)
    }
    setLoadingLeads(false)
  }

  const loadHistorialCotizaciones = async () => {
    if (!user?.cliente_id) return

    setLoadingCotizaciones(true)
    try {
      const url = `/api/crm/cotizaciones/historial?cliente_id=${user.cliente_id}&limit=${ITEMS_POR_PAGINA}&offset=${paginaCotizaciones * ITEMS_POR_PAGINA}`

      const res = await fetch(url)
      const data = await res.json()

      let historial = data.historial || []

      // Filtrar por estado
      if (estadoFiltro) {
        historial = historial.filter((h: HistorialCotizacion) =>
          h.estado_nuevo?.toLowerCase().includes(estadoFiltro.toLowerCase()) ||
          h.estado_anterior?.toLowerCase().includes(estadoFiltro.toLowerCase())
        )
      }

      // Filtrar por fechas
      if (fechaDesdeCotizaciones) {
        historial = historial.filter((h: HistorialCotizacion) =>
          new Date(h.created_at) >= new Date(fechaDesdeCotizaciones)
        )
      }
      if (fechaHastaCotizaciones) {
        const fechaHasta = new Date(fechaHastaCotizaciones)
        fechaHasta.setHours(23, 59, 59, 999)
        historial = historial.filter((h: HistorialCotizacion) =>
          new Date(h.created_at) <= fechaHasta
        )
      }

      setHistorialCotizaciones(historial)
    } catch (error) {
      console.error('Error cargando historial de cotizaciones:', error)
    }
    setLoadingCotizaciones(false)
  }

  useEffect(() => {
    if (activeTab === 'leads' && user?.cliente_id) {
      loadHistorialLeads()
    }
  }, [activeTab, paginaLeads, user?.cliente_id])

  useEffect(() => {
    if (activeTab === 'cotizaciones' && user?.cliente_id) {
      loadHistorialCotizaciones()
    }
  }, [activeTab, paginaCotizaciones, user?.cliente_id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const limpiarFiltrosLeads = () => {
    setLeadSeleccionado('')
    setFechaDesdeLeads('')
    setFechaHastaLeads('')
    setPaginaLeads(0)
    setTimeout(() => loadHistorialLeads(), 100)
  }

  const limpiarFiltrosCotizaciones = () => {
    setEstadoFiltro('')
    setFechaDesdeCotizaciones('')
    setFechaHastaCotizaciones('')
    setPaginaCotizaciones(0)
    setTimeout(() => loadHistorialCotizaciones(), 100)
  }

  if (!isAuthenticated || user?.role !== 'cliente') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <CRMLayout title="Historial" authenticated>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="Historial" authenticated>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Historial de Cambios
        </h2>
        <p className="text-gray-600 mt-2">
          Revisa el historial de todos los cambios en tus leads y cotizaciones
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition ${
              activeTab === 'leads'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Historial de Leads
          </button>
          <button
            onClick={() => setActiveTab('cotizaciones')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition ${
              activeTab === 'cotizaciones'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Historial de Cotizaciones
          </button>
        </div>

        {/* Tab Content: Historial de Leads */}
        {activeTab === 'leads' && (
          <div className="p-6">
            {/* Filtros */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-blue-900 mb-3">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-blue-900 mb-1">
                    Lead Específico
                  </label>
                  <select
                    value={leadSeleccionado}
                    onChange={(e) => setLeadSeleccionado(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Todos los leads</option>
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.id}>
                        {lead.nombre || lead.email || `Lead #${lead.id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-900 mb-1">
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    value={fechaDesdeLeads}
                    onChange={(e) => setFechaDesdeLeads(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-900 mb-1">
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    value={fechaHastaLeads}
                    onChange={(e) => setFechaHastaLeads(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={loadHistorialLeads}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold text-sm"
                  >
                    Aplicar
                  </button>
                  <button
                    onClick={limpiarFiltrosLeads}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-semibold text-sm"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de historial de leads */}
            {loadingLeads ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Cargando historial...</p>
              </div>
            ) : historialLeads.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay historial
                </h3>
                <p className="text-gray-600">
                  No se encontraron cambios en los leads con los filtros aplicados
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                          Lead
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                          Acción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                          Cambios
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historialLeads.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(item.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Lead #{item.lead_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.accion === 'insert' ? 'bg-green-100 text-green-800' :
                              item.accion === 'update' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.accion}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                            {item.usuario}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.descripcion || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setPaginaLeads(Math.max(0, paginaLeads - 1))}
                    disabled={paginaLeads === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-gray-700">
                    Página {paginaLeads + 1}
                  </span>
                  <button
                    onClick={() => setPaginaLeads(paginaLeads + 1)}
                    disabled={historialLeads.length < ITEMS_POR_PAGINA}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab Content: Historial de Cotizaciones */}
        {activeTab === 'cotizaciones' && (
          <div className="p-6">
            {/* Filtros */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-green-900 mb-3">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-green-900 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    placeholder="Ej: enviada, aprobada..."
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-green-900 mb-1">
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    value={fechaDesdeCotizaciones}
                    onChange={(e) => setFechaDesdeCotizaciones(e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-green-900 mb-1">
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    value={fechaHastaCotizaciones}
                    onChange={(e) => setFechaHastaCotizaciones(e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={loadHistorialCotizaciones}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-semibold text-sm"
                  >
                    Aplicar
                  </button>
                  <button
                    onClick={limpiarFiltrosCotizaciones}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-semibold text-sm"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de historial de cotizaciones */}
            {loadingCotizaciones ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-600">Cargando historial...</p>
              </div>
            ) : historialCotizaciones.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay historial
                </h3>
                <p className="text-gray-600">
                  No se encontraron cambios en las cotizaciones con los filtros aplicados
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-green-900 uppercase">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-green-900 uppercase">
                          Cotización
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-green-900 uppercase">
                          Estado Anterior
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-green-900 uppercase">
                          Estado Nuevo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-green-900 uppercase">
                          Usuario
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historialCotizaciones.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(item.created_at)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {item.nombre_proyecto || `Cotización #${item.cotizacion_id}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.estado_anterior || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {item.estado_nuevo || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                            {item.usuario}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setPaginaCotizaciones(Math.max(0, paginaCotizaciones - 1))}
                    disabled={paginaCotizaciones === 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-gray-700">
                    Página {paginaCotizaciones + 1}
                  </span>
                  <button
                    onClick={() => setPaginaCotizaciones(paginaCotizaciones + 1)}
                    disabled={historialCotizaciones.length < ITEMS_POR_PAGINA}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </CRMLayout>
  )
}
