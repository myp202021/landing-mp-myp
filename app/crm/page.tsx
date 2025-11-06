'use client'

import { useState, useEffect } from 'react'

interface Cliente {
  id: string
  nombre: string
  rubro?: string
  activo: boolean
}

interface Lead {
  id: number
  cliente_id: string
  nombre?: string
  email?: string
  telefono?: string
  empresa?: string
  fuente: string
  campana_nombre?: string
  ad_nombre?: string
  form_nombre?: string
  contactado: boolean
  fecha_contacto?: string
  vendido: boolean
  monto_vendido?: number
  razon_no_venta?: string
  observaciones?: string
  notas?: string
  fecha_ingreso: string
  clientes?: Cliente
}

interface Cotizacion {
  id: number
  cliente_id: string
  lead_id?: number
  nombre_proyecto: string
  cliente_nombre?: string
  cliente_email?: string
  subtotal: number
  total: number
  estado: string
  creado_en: string
  clientes?: Cliente
}

export default function CRMAdmin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [view, setView] = useState<'leads' | 'clientes' | 'cotizaciones'>('leads')

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])

  const [selectedCliente, setSelectedCliente] = useState<string>('all')
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(false)
  const [showNewClienteModal, setShowNewClienteModal] = useState(false)
  const [newCliente, setNewCliente] = useState({ nombre: '', rubro: '', activo: true })
  const [selectedLeads, setSelectedLeads] = useState<number[]>([])
  const [showCotizacionModal, setShowCotizacionModal] = useState(false)
  const [cotizacionLead, setCotizacionLead] = useState<Lead | null>(null)
  const [proyectoNombre, setProyectoNombre] = useState('')
  const [showHistorialCotizaciones, setShowHistorialCotizaciones] = useState(false)
  const [cotizacionesLead, setCotizacionesLead] = useState<Cotizacion[]>([])
  const [leadSeleccionado, setLeadSeleccionado] = useState<Lead | null>(null)

  // Autenticación simple
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // En producción, cambiar esta contraseña
    if (password === 'myp2025') {
      setAuthenticated(true)
      loadData()
    } else {
      alert('Contraseña incorrecta')
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // Cargar clientes
      const resClientes = await fetch('/api/crm/clientes')
      const dataClientes = await resClientes.json()
      setClientes(dataClientes.clientes || [])

      // Cargar leads
      const resLeads = await fetch('/api/crm/leads?limit=500')
      const dataLeads = await resLeads.json()
      setLeads(dataLeads.leads || [])

      // Cargar cotizaciones
      const resCotizaciones = await fetch('/api/crm/cotizaciones')
      const dataCotizaciones = await resCotizaciones.json()
      setCotizaciones(dataCotizaciones.cotizaciones || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  const updateLead = async (leadId: number, updates: any) => {
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, ...updates })
      })

      if (res.ok) {
        await loadData()
        setEditingLead(null)
        alert('Lead actualizado exitosamente')
      }
    } catch (error) {
      console.error('Error actualizando lead:', error)
      alert('Error actualizando lead')
    }
  }

  const createCliente = async () => {
    if (!newCliente.nombre.trim()) {
      alert('El nombre del cliente es obligatorio')
      return
    }

    try {
      const res = await fetch('/api/crm/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCliente)
      })

      const data = await res.json()

      if (res.ok) {
        await loadData()
        setShowNewClienteModal(false)
        setNewCliente({ nombre: '', rubro: '', activo: true })
        alert('Cliente creado exitosamente')
      } else {
        alert(data.error || 'Error creando cliente')
      }
    } catch (error) {
      console.error('Error creando cliente:', error)
      alert('Error creando cliente')
    }
  }

  const deleteLead = async (leadId: number) => {
    if (!confirm('¿Estás seguro de eliminar este lead? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const res = await fetch(`/api/crm/leads?id=${leadId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await loadData()
        alert('Lead eliminado exitosamente')
      } else {
        alert('Error eliminando lead')
      }
    } catch (error) {
      console.error('Error eliminando lead:', error)
      alert('Error eliminando lead')
    }
  }

  const deleteCliente = async (clienteId: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente? Esto también eliminará todos los leads asociados. Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const res = await fetch(`/api/crm/clientes?id=${clienteId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await loadData()
        alert('Cliente eliminado exitosamente')
      } else {
        alert('Error eliminando cliente')
      }
    } catch (error) {
      console.error('Error eliminando cliente:', error)
      alert('Error eliminando cliente')
    }
  }

  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id))
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

    console.log('🗑️ Intentando eliminar leads:', selectedLeads)

    try {
      const deletePromises = selectedLeads.map(async (leadId) => {
        const response = await fetch(`/api/crm/leads?id=${leadId}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        console.log(`Lead ${leadId}:`, response.ok ? '✅ eliminado' : '❌ error', data)
        return { ok: response.ok, leadId, data }
      })

      const results = await Promise.all(deletePromises)
      const failed = results.filter(r => !r.ok)
      const successful = results.filter(r => r.ok)

      console.log(`✅ Exitosos: ${successful.length}, ❌ Fallidos: ${failed.length}`)

      if (successful.length > 0) {
        alert(`${successful.length} lead(s) eliminado(s) exitosamente${failed.length > 0 ? `, ${failed.length} fallidos` : ''}`)
        setSelectedLeads([])
        await loadData()
      } else {
        alert('No se pudo eliminar ningún lead')
        console.error('Fallos:', failed)
      }
    } catch (error) {
      console.error('❌ Error eliminando leads:', error)
      alert('Error eliminando leads')
    }
  }

  const openCotizacionModal = (lead: Lead) => {
    setCotizacionLead(lead)
    setShowCotizacionModal(true)
  }

  const createCotizacionFromLead = async () => {
    if (!cotizacionLead) return
    if (!proyectoNombre.trim()) {
      alert('Ingresa un nombre para el proyecto')
      return
    }

    try {
      const res = await fetch('/api/crm/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: cotizacionLead.cliente_id,
          lead_id: cotizacionLead.id,
          nombre_proyecto: proyectoNombre,
          cliente_nombre: cotizacionLead.nombre || '',
          cliente_email: cotizacionLead.email || '',
          items: [],
          subtotal: 0,
          total: 0,
          estado: 'borrador'
        })
      })

      if (res.ok) {
        alert('Cotización creada exitosamente')
        setShowCotizacionModal(false)
        setCotizacionLead(null)
        setProyectoNombre('')
        await loadData()
      } else {
        alert('Error creando cotización')
      }
    } catch (error) {
      console.error('Error creando cotización:', error)
      alert('Error creando cotización')
    }
  }

  // Cargar cotizaciones de un lead específico
  const viewCotizacionesLead = async (lead: Lead) => {
    setLeadSeleccionado(lead)
    setLoading(true)

    try {
      const res = await fetch(`/api/crm/cotizaciones?lead_id=${lead.id}`)
      const data = await res.json()

      if (res.ok) {
        setCotizacionesLead(data.cotizaciones || [])
        setShowHistorialCotizaciones(true)
      } else {
        alert('Error cargando cotizaciones del lead')
      }
    } catch (error) {
      console.error('Error cargando cotizaciones:', error)
      alert('Error cargando cotizaciones')
    }

    setLoading(false)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">CRM Muller y Pérez</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Admin
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese contraseña"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    )
  }

  const filteredLeads = selectedCliente === 'all'
    ? leads
    : leads.filter(l => l.cliente_id === selectedCliente)

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId)
    return cliente?.nombre || 'Desconocido'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">CRM Admin - Muller y Pérez</h1>
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
                onClick={() => setView('leads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  view === 'leads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leads ({leads.length})
              </button>
              <button
                onClick={() => setView('clientes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  view === 'clientes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Clientes ({clientes.length})
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

        {/* Vista Leads */}
        {view === 'leads' && (
          <div className="space-y-4">
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Total Leads</div>
                <div className="text-3xl font-bold text-gray-900">{leads.length}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Contactados</div>
                <div className="text-3xl font-bold text-blue-600">
                  {leads.filter(l => l.contactado).length}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {leads.length > 0 ? ((leads.filter(l => l.contactado).length / leads.length) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Vendidos</div>
                <div className="text-3xl font-bold text-green-600">
                  {leads.filter(l => l.vendido).length}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {leads.length > 0 ? ((leads.filter(l => l.vendido).length / leads.length) * 100).toFixed(1) : 0}% conversión
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">Monto Total</div>
                <div className="text-2xl font-bold text-green-600">
                  ${leads.filter(l => l.monto_vendido).reduce((sum, l) => sum + Number(l.monto_vendido || 0), 0).toLocaleString('es-CL')}
                </div>
              </div>
            </div>

            {/* Filtro por cliente */}
            <div className="bg-white p-4 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por cliente
              </label>
              <select
                value={selectedCliente}
                onChange={(e) => setSelectedCliente(e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los clientes</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.rubro || 'Sin rubro'}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla de leads */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {selectedLeads.length > 0 && (
                <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedLeads.length} lead(s) seleccionado(s)
                  </span>
                  <button
                    onClick={deleteSelectedLeads}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Eliminar seleccionados
                  </button>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map(lead => (
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
                          {getClienteNombre(lead.cliente_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.nombre || 'Sin nombre'}</div>
                          <div className="text-sm text-gray-500">{lead.email || lead.telefono}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.fuente}<br/>
                          <span className="text-xs">{lead.ad_nombre || lead.form_nombre}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.vendido ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Vendido
                            </span>
                          ) : lead.contactado ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Contactado
                            </span>
                          ) : lead.razon_no_venta ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Negativo
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => setEditingLead(lead)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => openCotizacionModal(lead)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Cotizar
                          </button>
                          <button
                            onClick={() => viewCotizacionesLead(lead)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Ver cotizaciones de este lead"
                          >
                            📄 Historial
                          </button>
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vista Clientes */}
        {view === 'clientes' && (
          <div className="space-y-4">
            {/* Botón Nuevo Cliente */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowNewClienteModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <span>+</span>
                Nuevo Cliente
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map(cliente => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cliente.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.rubro || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cliente.activo ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Activo
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={`/cliente/${cliente.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Ver Portal
                        </a>
                        <button
                          onClick={() => deleteCliente(cliente.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}

        {/* Vista Cotizaciones */}
        {view === 'cotizaciones' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proyecto
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
                        {getClienteNombre(cot.cliente_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cot.nombre_proyecto}
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

      {/* Modal de edición de lead */}
      {editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Editar Lead</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contactado
                    </label>
                    <select
                      value={editingLead.contactado ? 'true' : 'false'}
                      onChange={(e) => setEditingLead({...editingLead, contactado: e.target.value === 'true'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendido
                    </label>
                    <select
                      value={editingLead.vendido ? 'true' : 'false'}
                      onChange={(e) => setEditingLead({...editingLead, vendido: e.target.value === 'true'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>
                </div>

                {editingLead.vendido && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto Vendido (CLP)
                    </label>
                    <input
                      type="number"
                      value={editingLead.monto_vendido || ''}
                      onChange={(e) => setEditingLead({...editingLead, monto_vendido: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ej: 1500000"
                    />
                  </div>
                )}

                {!editingLead.vendido && editingLead.contactado && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razón de no venta
                    </label>
                    <input
                      type="text"
                      value={editingLead.razon_no_venta || ''}
                      onChange={(e) => setEditingLead({...editingLead, razon_no_venta: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ej: Precio muy alto, no está interesado, etc."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    value={editingLead.observaciones || ''}
                    onChange={(e) => setEditingLead({...editingLead, observaciones: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                    placeholder="Observaciones generales..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas Detalladas
                  </label>
                  <textarea
                    value={editingLead.notas || ''}
                    onChange={(e) => setEditingLead({...editingLead, notas: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Detalles de la conversación, seguimientos, próximos pasos..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setEditingLead(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => updateLead(editingLead.id, {
                      contactado: editingLead.contactado,
                      vendido: editingLead.vendido,
                      monto_vendido: editingLead.monto_vendido || null,
                      razon_no_venta: editingLead.razon_no_venta || null,
                      observaciones: editingLead.observaciones || null,
                      notas: editingLead.notas || null
                    })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nuevo cliente */}
      {showNewClienteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Nuevo Cliente</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={newCliente.nombre}
                    onChange={(e) => setNewCliente({...newCliente, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Ej: Empresa ABC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rubro / Industria
                  </label>
                  <input
                    type="text"
                    value={newCliente.rubro}
                    onChange={(e) => setNewCliente({...newCliente, rubro: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Ej: Tecnología, Retail, Servicios"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newCliente.activo}
                      onChange={(e) => setNewCliente({...newCliente, activo: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Cliente activo</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowNewClienteModal(false)
                      setNewCliente({ nombre: '', rubro: '', activo: true })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={createCliente}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Crear Cliente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Cotización */}
      {showCotizacionModal && cotizacionLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Crear Cotización</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead: {cotizacionLead.nombre}
                  </label>
                  <p className="text-sm text-gray-500">
                    {cotizacionLead.email} | {cotizacionLead.telefono}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    value={proyectoNombre}
                    onChange={(e) => setProyectoNombre(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Campaña Google Ads Q1 2025"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowCotizacionModal(false)
                      setCotizacionLead(null)
                      setProyectoNombre('')
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={createCotizacionFromLead}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Crear Cotización
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial de Cotizaciones */}
      {showHistorialCotizaciones && leadSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold">Historial de Cotizaciones</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Lead: {leadSeleccionado.nombre} ({leadSeleccionado.email})
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowHistorialCotizaciones(false)
                    setLeadSeleccionado(null)
                    setCotizacionesLead([])
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {cotizacionesLead.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay cotizaciones registradas para este lead</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cotizacionesLead.map((cot) => {
                    const estadoColor = {
                      borrador: 'bg-gray-100 text-gray-700',
                      enviada: 'bg-blue-100 text-blue-700',
                      aceptada: 'bg-green-100 text-green-700',
                      rechazada: 'bg-red-100 text-red-700'
                    }[cot.estado] || 'bg-gray-100 text-gray-700'

                    return (
                      <div key={cot.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{cot.nombre_proyecto}</h4>
                            <p className="text-sm text-gray-500">
                              Creada: {new Date(cot.creado_en).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColor}`}>
                            {cot.estado.charAt(0).toUpperCase() + cot.estado.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="ml-2 font-medium">
                              ${Number(cot.subtotal).toLocaleString('es-CL')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Descuento:</span>
                            <span className="ml-2 font-medium">
                              ${Number(cot.descuento || 0).toLocaleString('es-CL')}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Total:</span>
                            <span className="ml-2 font-bold text-lg text-blue-600">
                              ${Number(cot.total).toLocaleString('es-CL')}
                            </span>
                          </div>
                        </div>

                        {cot.notas && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600">{cot.notas}</p>
                          </div>
                        )}

                        {cot.enviada_en && (
                          <div className="mt-2 text-xs text-gray-500">
                            Enviada: {new Date(cot.enviada_en).toLocaleDateString('es-CL')}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowHistorialCotizaciones(false)
                    setLeadSeleccionado(null)
                    setCotizacionesLead([])
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
