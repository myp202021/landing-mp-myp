'use client'

/**
 * LEADS DASHBOARD - Gestión de leads con filtros y edición inline
 */

import { useState, useEffect } from 'react'

interface Cliente {
  id: string
  nombre: string
  rubro: string | null
}

interface Lead {
  id: number
  cliente_id: string
  rubro: string
  campana_nombre: string | null
  adset_nombre: string | null
  ad_nombre: string | null
  form_nombre: string | null
  fecha_ingreso: string
  mes_ingreso: string
  nombre: string | null
  apellido: string | null
  empresa: string | null
  telefono: string | null
  email: string | null
  ciudad: string | null
  region: string | null
  mensaje: string | null
  presupuesto: string | null
  servicio: string | null
  contactado: boolean
  fecha_contacto: string | null
  vendido: boolean
  monto_vendido: number | null
  razon_no_venta: string | null
  observaciones: string | null
  creado_en: string
  actualizado_en: string
}

export default function LeadsPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [allLeads, setAllLeads] = useState<Lead[]>([])

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    fecha_desde: '',
    fecha_hasta: '',
    contactado: '',
    vendido: ''
  })

  // Edición inline
  const [editingLead, setEditingLead] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Lead>>({})

  useEffect(() => {
    fetchClientes()
  }, [])

  useEffect(() => {
    if (selectedCliente) {
      fetchAllLeads()
      fetchLeads()
    } else {
      setAllLeads([])
      setLeads([])
    }
  }, [selectedCliente])

  useEffect(() => {
    if (selectedCliente) {
      fetchLeads()
    }
  }, [filters])

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/crm/clientes')
      const data = await res.json()
      setClientes(data.clientes || [])
    } catch (error) {
      console.error('Error fetching clientes:', error)
    }
  }

  const fetchAllLeads = async () => {
    if (!selectedCliente) return

    try {
      // Fetch ALL leads without filters for stats calculation
      const params = new URLSearchParams({ clientId: selectedCliente, limit: '10000' })
      const res = await fetch(`/api/crm/leads?${params}`)
      const data = await res.json()
      setAllLeads(data.leads || [])
    } catch (error) {
      console.error('Error fetching all leads:', error)
    }
  }

  const fetchLeads = async () => {
    if (!selectedCliente) return

    setLoading(true)
    try {
      // Only include non-empty filters
      const params = new URLSearchParams({
        clientId: selectedCliente,
        limit: '10000' // Aumentar límite para mostrar todos los leads
      })

      if (filters.search) params.append('search', filters.search)
      if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde)
      if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta)
      if (filters.contactado) params.append('contactado', filters.contactado)
      if (filters.vendido) params.append('vendido', filters.vendido)

      const res = await fetch(`/api/crm/leads?${params}`)
      const data = await res.json()

      setLeads(data.leads || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      fecha_desde: '',
      fecha_hasta: '',
      contactado: '',
      vendido: ''
    })
  }

  const startEdit = (lead: Lead) => {
    setEditingLead(lead.id)
    setEditValues({
      contactado: lead.contactado,
      fecha_contacto: lead.fecha_contacto,
      vendido: lead.vendido,
      monto_vendido: lead.monto_vendido,
      razon_no_venta: lead.razon_no_venta,
      observaciones: lead.observaciones
    })
  }

  const cancelEdit = () => {
    setEditingLead(null)
    setEditValues({})
  }

  const saveEdit = async (leadId: number) => {
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, ...editValues })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error actualizando lead')
      }

      const data = await res.json()
      console.log('Lead actualizado:', data)

      setEditingLead(null)
      setEditValues({})
      fetchAllLeads()
      fetchLeads()
    } catch (error: any) {
      console.error('Error saving:', error)
      alert(`Error guardando cambios: ${error.message}`)
    }
  }

  const deleteLead = async (leadId: number) => {
    if (!confirm('¿Eliminar este lead?')) return

    try {
      const res = await fetch(`/api/crm/leads?id=${leadId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Error eliminando lead')
      }

      fetchAllLeads()
      fetchLeads()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error eliminando lead')
    }
  }

  const getStats = () => {
    // Use allLeads for stats to show total stats regardless of filters
    const contactados = allLeads.filter(l => l.contactado).length
    const vendidos = allLeads.filter(l => l.vendido).length
    const sinContactar = allLeads.filter(l => !l.contactado).length
    const totalVentas = allLeads
      .filter(l => l.vendido && l.monto_vendido)
      .reduce((sum, l) => sum + (l.monto_vendido || 0), 0)

    return { contactados, vendidos, sinContactar, totalVentas }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Leads</h1>
            <p className="text-gray-600 mt-1">Gestión y seguimiento de leads</p>
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
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-blue-600 font-medium">Total Leads</p>
                  <p className="text-3xl font-bold text-blue-900">{allLeads.length}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-xs text-orange-600 font-medium">Sin Contactar</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.sinContactar}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-purple-600 font-medium">Contactados</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.contactados}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-green-600 font-medium">Vendidos</p>
                  <p className="text-3xl font-bold text-green-900">{stats.vendidos}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-xs text-emerald-600 font-medium">Total Ventas</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    ${stats.totalVentas.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email, teléfono..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    placeholder="Desde"
                    value={filters.fecha_desde}
                    onChange={(e) => setFilters({ ...filters, fecha_desde: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                    title="Fecha desde"
                  />
                  <input
                    type="date"
                    placeholder="Hasta"
                    value={filters.fecha_hasta}
                    onChange={(e) => setFilters({ ...filters, fecha_hasta: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                    title="Fecha hasta"
                  />
                  <select
                    value={filters.contactado}
                    onChange={(e) => setFilters({ ...filters, contactado: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Todos (contacto)</option>
                    <option value="true">Contactados</option>
                    <option value="false">Sin contactar</option>
                  </select>
                  <select
                    value={filters.vendido}
                    onChange={(e) => setFilters({ ...filters, vendido: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Todos (venta)</option>
                    <option value="true">Vendidos</option>
                    <option value="false">No vendidos</option>
                  </select>
                </div>
                {(filters.search || filters.fecha_desde || filters.fecha_hasta || filters.contactado || filters.vendido) && (
                  <div className="mt-3 text-xs text-gray-600">
                    Mostrando {leads.length} de {allLeads.length} leads
                  </div>
                )}
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-12 text-gray-500">Cargando...</div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No hay leads que mostrar
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">ID</th>
                        <th className="px-3 py-2 text-left font-semibold">Nombre</th>
                        <th className="px-3 py-2 text-left font-semibold">Empresa</th>
                        <th className="px-3 py-2 text-left font-semibold">Email</th>
                        <th className="px-3 py-2 text-left font-semibold">Teléfono</th>
                        <th className="px-3 py-2 text-left font-semibold">Campaña</th>
                        <th className="px-3 py-2 text-left font-semibold">Fecha</th>
                        <th className="px-3 py-2 text-left font-semibold">Contactado</th>
                        <th className="px-3 py-2 text-left font-semibold">Vendido</th>
                        <th className="px-3 py-2 text-left font-semibold">Monto</th>
                        <th className="px-3 py-2 text-left font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leads.map((lead) => {
                        const isEditing = editingLead === lead.id

                        return (
                          <tr key={lead.id} className={isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                            <td className="px-3 py-2 text-gray-700">{lead.id}</td>
                            <td className="px-3 py-2 text-gray-900">
                              {lead.nombre} {lead.apellido}
                            </td>
                            <td className="px-3 py-2 text-gray-700 font-medium">{lead.empresa || '-'}</td>
                            <td className="px-3 py-2 text-gray-700">{lead.email || '-'}</td>
                            <td className="px-3 py-2 text-gray-700">{lead.telefono || '-'}</td>
                            <td className="px-3 py-2 text-gray-600 text-xs">
                              {lead.campana_nombre || '-'}
                            </td>
                            <td className="px-3 py-2 text-gray-600 text-xs">
                              {new Date(lead.fecha_ingreso).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2">
                              {isEditing ? (
                                <input
                                  type="checkbox"
                                  checked={editValues.contactado || false}
                                  onChange={(e) => setEditValues({
                                    ...editValues,
                                    contactado: e.target.checked
                                  })}
                                  className="w-4 h-4"
                                />
                              ) : (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  lead.contactado
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {lead.contactado ? 'Sí' : 'No'}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {isEditing ? (
                                <input
                                  type="checkbox"
                                  checked={editValues.vendido || false}
                                  onChange={(e) => setEditValues({
                                    ...editValues,
                                    vendido: e.target.checked
                                  })}
                                  className="w-4 h-4"
                                />
                              ) : (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  lead.vendido
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {lead.vendido ? 'Sí' : 'No'}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editValues.monto_vendido || ''}
                                  onChange={(e) => setEditValues({
                                    ...editValues,
                                    monto_vendido: parseFloat(e.target.value) || null
                                  })}
                                  className="w-24 border border-gray-300 rounded px-2 py-1 text-xs"
                                  placeholder="$"
                                />
                              ) : (
                                <span className="text-gray-700">
                                  {lead.monto_vendido ? `$${lead.monto_vendido.toLocaleString()}` : '-'}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {isEditing ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => saveEdit(lead.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="bg-gray-400 text-white px-3 py-1 rounded text-xs hover:bg-gray-500"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => window.location.href = `/crm/cotizar/${lead.id}`}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                    title="Crear cotización"
                                  >
                                    Cotizar
                                  </button>
                                  <button
                                    onClick={() => startEdit(lead)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => deleteLead(lead.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
