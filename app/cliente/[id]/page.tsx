'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Lead {
  id: number
  nombre?: string
  email?: string
  telefono?: string
  fuente: string
  campana_nombre?: string
  ad_nombre?: string
  contactado: boolean
  vendido: boolean
  monto_vendido?: number
  fecha_ingreso: string
}

interface Cotizacion {
  id: number
  nombre_proyecto: string
  cliente_nombre?: string
  total: number
  estado: string
  creado_en: string
}

interface ClienteInfo {
  nombre: string
  rubro?: string
}

interface Estadisticas {
  total_leads: number
  contactados: number
  vendidos: number
  monto_total: number
  tasa_contacto: string
  tasa_conversion: string
}

export default function ClientePortal() {
  const params = useParams()
  const clienteId = params.id as string

  const [cliente, setCliente] = useState<ClienteInfo | null>(null)
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [view, setView] = useState<'dashboard' | 'leads' | 'cotizaciones'>('dashboard')
  const [loading, setLoading] = useState(true)
  const [selectedLeads, setSelectedLeads] = useState<number[]>([])
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadData()
  }, [clienteId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Cargar info del cliente
      const resCliente = await fetch(`/api/crm/clientes?id=${clienteId}`)
      const dataCliente = await resCliente.json()
      setCliente(dataCliente.cliente)
      setEstadisticas(dataCliente.estadisticas)

      // Cargar leads del cliente
      const resLeads = await fetch(`/api/crm/leads?cliente_id=${clienteId}`)
      const dataLeads = await resLeads.json()
      setLeads(dataLeads.leads || [])

      // Cargar cotizaciones del cliente
      const resCotizaciones = await fetch(`/api/crm/cotizaciones?cliente_id=${clienteId}`)
      const dataCotizaciones = await resCotizaciones.json()
      setCotizaciones(dataCotizaciones.cotizaciones || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(leads.map(lead => lead.id))
    }
  }

  const deleteSelectedLeads = async () => {
    if (selectedLeads.length === 0) {
      alert('No hay leads seleccionados')
      return
    }

    if (!confirm(`¿Estás seguro de eliminar ${selectedLeads.length} lead(s)? Esta acción no se puede deshacer.`)) {
      return
    }

    setDeleting(true)
    try {
      const deletePromises = selectedLeads.map(leadId =>
        fetch(`/api/crm/leads?id=${leadId}`, {
          method: 'DELETE'
        })
      )

      const results = await Promise.all(deletePromises)
      const allSuccess = results.every(res => res.ok)

      if (allSuccess) {
        alert(`${selectedLeads.length} lead(s) eliminado(s) exitosamente`)
        setSelectedLeads([])
        await loadData()
      } else {
        alert('Algunos leads no pudieron ser eliminados')
      }
    } catch (error) {
      console.error('Error eliminando leads:', error)
      alert('Error eliminando leads')
    }
    setDeleting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cliente no encontrado</h1>
          <p className="text-gray-600">El ID proporcionado no corresponde a ningún cliente activo.</p>
        </div>
      </div>
    )
  }

  const leadsNuevos = leads.filter(l => !l.contactado && !l.vendido).length
  const leadsEnProceso = leads.filter(l => l.contactado && !l.vendido).length
  const leadsVendidos = leads.filter(l => l.vendido).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{cliente.nombre}</h1>
              <p className="text-gray-600 mt-1">Portal de Leads</p>
            </div>
            <button
              onClick={() => loadData()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setView('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  view === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('leads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  view === 'leads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Historial de Leads ({leads.length})
              </button>
              <button
                onClick={() => setView('cotizaciones')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  view === 'cotizaciones'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cotizaciones ({cotizaciones.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard View */}
        {view === 'dashboard' && estadisticas && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{estadisticas.total_leads}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Tasa de Contacto</p>
                    <p className="text-3xl font-bold text-yellow-600">{estadisticas.tasa_contacto}%</p>
                    <p className="text-xs text-gray-500 mt-1">{estadisticas.contactados} contactados</p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                    <p className="text-3xl font-bold text-green-600">{estadisticas.tasa_conversion}%</p>
                    <p className="text-xs text-gray-500 mt-1">{estadisticas.vendidos} vendidos</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Monto Total</p>
                    <p className="text-3xl font-bold text-blue-600">${Number(estadisticas.monto_total).toLocaleString('es-CL')}</p>
                    <p className="text-xs text-gray-500 mt-1">Ventas cerradas</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de Leads */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Estado de Leads</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nuevos</p>
                      <p className="text-2xl font-bold text-gray-900">{leadsNuevos}</p>
                    </div>
                    <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-gray-600 font-bold">{leadsNuevos}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-700">En Proceso</p>
                      <p className="text-2xl font-bold text-yellow-900">{leadsEnProceso}</p>
                    </div>
                    <div className="bg-yellow-200 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-yellow-700 font-bold">{leadsEnProceso}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Vendidos</p>
                      <p className="text-2xl font-bold text-green-900">{leadsVendidos}</p>
                    </div>
                    <div className="bg-green-200 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-green-700 font-bold">{leadsVendidos}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Últimos Leads */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Últimos 10 Leads</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.slice(0, 10).map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(lead.fecha_ingreso).toLocaleDateString('es-CL')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lead.nombre || 'Sin nombre'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.email || lead.telefono || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.vendido ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Vendido
                            </span>
                          ) : lead.contactado ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              En Proceso
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Nuevo
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Leads View */}
        {view === 'leads' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Historial Completo de Leads</h2>
              {selectedLeads.length > 0 && (
                <button
                  onClick={deleteSelectedLeads}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {deleting ? 'Eliminando...' : `Eliminar ${selectedLeads.length} seleccionado(s)`}
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === leads.length && leads.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleLeadSelection(lead.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.fecha_ingreso).toLocaleDateString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.nombre || 'Sin nombre'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.email || '-'}</div>
                        <div className="text-sm text-gray-500">{lead.telefono || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.fuente}
                        {lead.campana_nombre && (
                          <div className="text-xs text-gray-400">{lead.campana_nombre}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.vendido ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Vendido
                          </span>
                        ) : lead.contactado ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            En Proceso
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Nuevo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.monto_vendido ? `$${Number(lead.monto_vendido).toLocaleString('es-CL')}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cotizaciones View */}
        {view === 'cotizaciones' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Cotizaciones Generadas</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proyecto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cotizaciones.map(cot => (
                    <tr key={cot.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(cot.creado_en).toLocaleDateString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cot.nombre_proyecto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cot.cliente_nombre || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${Number(cot.total).toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cot.estado === 'aceptada' ? 'bg-green-100 text-green-800' :
                          cot.estado === 'enviada' ? 'bg-blue-100 text-blue-800' :
                          cot.estado === 'rechazada' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {cot.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
