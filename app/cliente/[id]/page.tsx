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
  observaciones?: string
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
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [editForm, setEditForm] = useState({
    contactado: false,
    vendido: false,
    monto_vendido: '',
    observaciones: ''
  })
  const [showNewCotizacion, setShowNewCotizacion] = useState(false)
  const [cotizacionForm, setCotizacionForm] = useState({
    nombre_proyecto: '',
    cliente_nombre: '',
    cliente_email: '',
    cliente_empresa: '',
    items: [] as Array<{ descripcion: string; cantidad: number; precio_unitario: number; total: number }>,
    subtotal: 0,
    descuento: 0,
    total: 0,
    notas: '',
    vigencia_dias: 30
  })
  const [newItem, setNewItem] = useState({
    descripcion: '',
    cantidad: 1,
    precio_unitario: 0
  })

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

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead)
    setEditForm({
      contactado: lead.contactado,
      vendido: lead.vendido,
      monto_vendido: lead.monto_vendido?.toString() || '',
      observaciones: lead.observaciones || ''
    })
  }

  const closeEditModal = () => {
    setEditingLead(null)
    setEditForm({
      contactado: false,
      vendido: false,
      monto_vendido: '',
      observaciones: ''
    })
  }

  const saveLeadEdit = async () => {
    if (!editingLead) return

    try {
      const updates: any = {
        id: editingLead.id,
        contactado: editForm.contactado,
        vendido: editForm.vendido,
        observaciones: editForm.observaciones || null
      }

      if (editForm.monto_vendido) {
        updates.monto_vendido = parseFloat(editForm.monto_vendido)
      } else {
        updates.monto_vendido = null
      }

      const res = await fetch('/api/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (res.ok) {
        alert('Lead actualizado exitosamente')
        closeEditModal()
        await loadData()
      } else {
        alert('Error actualizando lead')
      }
    } catch (error) {
      console.error('Error actualizando lead:', error)
      alert('Error actualizando lead')
    }
  }

  const openNewCotizacionModal = () => {
    setShowNewCotizacion(true)
    setCotizacionForm({
      nombre_proyecto: '',
      cliente_nombre: cliente?.nombre || '',
      cliente_email: '',
      cliente_empresa: '',
      items: [],
      subtotal: 0,
      descuento: 0,
      total: 0,
      notas: '',
      vigencia_dias: 30
    })
  }

  const closeNewCotizacionModal = () => {
    setShowNewCotizacion(false)
    setNewItem({ descripcion: '', cantidad: 1, precio_unitario: 0 })
  }

  const addItemToCotizacion = () => {
    if (!newItem.descripcion || newItem.precio_unitario <= 0) {
      alert('Completa la descripción y precio del item')
      return
    }

    const itemTotal = newItem.cantidad * newItem.precio_unitario
    const updatedItems = [...cotizacionForm.items, { ...newItem, total: itemTotal }]
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0)
    const newTotal = newSubtotal - cotizacionForm.descuento

    setCotizacionForm({
      ...cotizacionForm,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newTotal
    })

    setNewItem({ descripcion: '', cantidad: 1, precio_unitario: 0 })
  }

  const removeItemFromCotizacion = (index: number) => {
    const updatedItems = cotizacionForm.items.filter((_, i) => i !== index)
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0)
    const newTotal = newSubtotal - cotizacionForm.descuento

    setCotizacionForm({
      ...cotizacionForm,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newTotal
    })
  }

  const updateDescuento = (descuento: number) => {
    const newTotal = cotizacionForm.subtotal - descuento
    setCotizacionForm({
      ...cotizacionForm,
      descuento,
      total: newTotal
    })
  }

  const saveCotizacion = async () => {
    if (!cotizacionForm.nombre_proyecto) {
      alert('El nombre del proyecto es requerido')
      return
    }

    if (cotizacionForm.items.length === 0) {
      alert('Agrega al menos un item a la cotización')
      return
    }

    try {
      const res = await fetch('/api/crm/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: clienteId,
          ...cotizacionForm
        })
      })

      if (res.ok) {
        alert('Cotización creada exitosamente')
        closeNewCotizacionModal()
        await loadData()
      } else {
        alert('Error creando cotización')
      }
    } catch (error) {
      console.error('Error creando cotización:', error)
      alert('Error creando cotización')
    }
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(lead)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
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
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Cotizaciones Generadas</h2>
              <button
                onClick={openNewCotizacionModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                + Nueva Cotización
              </button>
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

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Editar Lead</h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Nombre:</span>
                  <p className="text-gray-900">{editingLead.nombre || '-'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Email:</span>
                  <p className="text-gray-900">{editingLead.email || '-'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Teléfono:</span>
                  <p className="text-gray-900">{editingLead.telefono || '-'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Fuente:</span>
                  <p className="text-gray-900">{editingLead.fuente}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editForm.contactado}
                      onChange={(e) => setEditForm({ ...editForm, contactado: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Contactado</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editForm.vendido}
                      onChange={(e) => setEditForm({ ...editForm, vendido: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Vendido</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Vendido
                  </label>
                  <input
                    type="number"
                    value={editForm.monto_vendido}
                    onChange={(e) => setEditForm({ ...editForm, monto_vendido: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={editForm.observaciones}
                    onChange={(e) => setEditForm({ ...editForm, observaciones: e.target.value })}
                    rows={4}
                    placeholder="Notas o comentarios adicionales..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveLeadEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Cotizacion Modal */}
      {showNewCotizacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Nueva Cotización</h3>
                <button
                  onClick={closeNewCotizacionModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    value={cotizacionForm.nombre_proyecto}
                    onChange={(e) => setCotizacionForm({ ...cotizacionForm, nombre_proyecto: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Desarrollo Web E-commerce"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vigencia (días)
                  </label>
                  <input
                    type="number"
                    value={cotizacionForm.vigencia_dias}
                    onChange={(e) => setCotizacionForm({ ...cotizacionForm, vigencia_dias: parseInt(e.target.value) || 30 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Cliente
                  </label>
                  <input
                    type="text"
                    value={cotizacionForm.cliente_nombre}
                    onChange={(e) => setCotizacionForm({ ...cotizacionForm, cliente_nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Cliente
                  </label>
                  <input
                    type="email"
                    value={cotizacionForm.cliente_email}
                    onChange={(e) => setCotizacionForm({ ...cotizacionForm, cliente_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={cotizacionForm.cliente_empresa}
                    onChange={(e) => setCotizacionForm({ ...cotizacionForm, cliente_empresa: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Items</h4>

                {/* Lista de items */}
                {cotizacionForm.items.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {cotizacionForm.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.descripcion}</p>
                          <p className="text-sm text-gray-600">
                            {item.cantidad} x ${item.precio_unitario.toLocaleString('es-CL')} = ${item.total.toLocaleString('es-CL')}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItemFromCotizacion(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Agregar nuevo item */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={newItem.descripcion}
                        onChange={(e) => setNewItem({ ...newItem, descripcion: e.target.value })}
                        placeholder="Descripción del servicio"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={newItem.cantidad}
                        onChange={(e) => setNewItem({ ...newItem, cantidad: parseInt(e.target.value) || 1 })}
                        placeholder="Cant."
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={newItem.precio_unitario}
                        onChange={(e) => setNewItem({ ...newItem, precio_unitario: parseFloat(e.target.value) || 0 })}
                        placeholder="Precio unitario"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button
                        onClick={addItemToCotizacion}
                        className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 py-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Totales */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${cotizacionForm.subtotal.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Descuento:</span>
                      <input
                        type="number"
                        value={cotizacionForm.descuento}
                        onChange={(e) => updateDescuento(parseFloat(e.target.value) || 0)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-right"
                        min="0"
                      />
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">${cotizacionForm.total.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas / Observaciones
                </label>
                <textarea
                  value={cotizacionForm.notas}
                  onChange={(e) => setCotizacionForm({ ...cotizacionForm, notas: e.target.value })}
                  rows={3}
                  placeholder="Información adicional, términos y condiciones, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeNewCotizacionModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveCotizacion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Cotización
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
