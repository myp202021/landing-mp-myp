'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import MetricCard from '@/app/components/crm/MetricCard'
import Button from '@/app/components/crm/Button'

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
  prioridad?: boolean
  costo_publicidad?: number
  clientes?: Cliente
}

interface Cotizacion {
  id: number
  cliente_id: string
  lead_id?: number
  nombre_proyecto: string
  cliente_nombre?: string
  subtotal: number
  descuento?: number
  total: number
  notas?: string
  estado: string
  creado_en: string
  enviada_en?: string
  aceptada_en?: string
}

export default function CRMAdmin() {
  const { isAuthenticated, user, permissions } = useSimpleAuth()
  const router = useRouter()

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])

  const [selectedCliente, setSelectedCliente] = useState<string>('all')
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<number[]>([])

  // Modal para crear cotizacion
  const [showCotizacionModal, setShowCotizacionModal] = useState(false)
  const [cotizacionLead, setCotizacionLead] = useState<Lead | null>(null)
  const [proyectoNombre, setProyectoNombre] = useState('')

  // Modal de historial de cotizaciones
  const [showHistorialCotizaciones, setShowHistorialCotizaciones] = useState(false)
  const [cotizacionesLead, setCotizacionesLead] = useState<Cotizacion[]>([])
  const [leadSeleccionado, setLeadSeleccionado] = useState<Lead | null>(null)

  // Modal para agregar lead manual
  const [showAgregarLeadModal, setShowAgregarLeadModal] = useState(false)
  const [nuevoLead, setNuevoLead] = useState({
    cliente_id: '',
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    fuente: 'email', // default
    observaciones: ''
  })

  // Función para calcular horas desde ingreso
  const getHorasSinContacto = (lead: Lead): number => {
    if (lead.contactado) return 0
    const fechaIngreso = new Date(lead.fecha_ingreso)
    const ahora = new Date()
    const diff = ahora.getTime() - fechaIngreso.getTime()
    return Math.floor(diff / (1000 * 60 * 60)) // horas
  }

  // Función para obtener color del semáforo
  const getSemaforoColor = (horas: number): string => {
    if (horas === 0) return 'bg-gray-400' // Contactado
    if (horas < 24) return 'bg-green-500' // Verde: menos de 24h
    if (horas < 48) return 'bg-yellow-500' // Amarillo: 24-48h
    return 'bg-red-500' // Rojo: más de 48h
  }

  // Función para obtener texto del semáforo
  const getSemaforoTexto = (horas: number): string => {
    if (horas === 0) return 'Ya contactado'
    if (horas < 24) return `${horas}h`
    const dias = Math.floor(horas / 24)
    const horasRestantes = horas % 24
    return `${dias}d ${horasRestantes}h`
  }

  // Redirigir a login si no está autenticado o a dashboard de cliente si es cliente
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
    } else if (user?.role === 'cliente') {
      router.push('/crm/cliente/dashboard')
    } else {
      loadData()
    }
  }, [isAuthenticated, user, router])

  const loadData = async () => {
    setLoading(true)
    try {
      const [resClientes, resLeads, resCotizaciones] = await Promise.all([
        fetch('/api/crm/clientes'),
        fetch('/api/crm/leads?limit=500'),
        fetch('/api/crm/cotizaciones')
      ])

      const dataClientes = await resClientes.json()
      const dataLeads = await resLeads.json()
      const dataCotizaciones = await resCotizaciones.json()

      setClientes(dataClientes.clientes || [])
      setLeads(dataLeads.leads || [])
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

  const deleteLead = async (leadId: number) => {
    if (!confirm('Estas seguro de eliminar este lead? Esta accion no se puede deshacer.')) {
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

  const togglePrioridad = async (leadId: number, prioridad: boolean) => {
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, prioridad })
      })
      if (res.ok) {
        await loadData()
      }
    } catch (error) {
      console.error('Error actualizando prioridad:', error)
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

    if (!confirm(`Estas seguro de eliminar ${selectedLeads.length} lead(s)? Esta accion no se puede deshacer.`)) {
      return
    }

    try {
      const deletePromises = selectedLeads.map(async (leadId) => {
        const response = await fetch(`/api/crm/leads?id=${leadId}`, {
          method: 'DELETE'
        })
        return { ok: response.ok, leadId }
      })

      const results = await Promise.all(deletePromises)
      const successful = results.filter(r => r.ok)

      if (successful.length > 0) {
        alert(`${successful.length} lead(s) eliminado(s) exitosamente`)
        setSelectedLeads([])
        await loadData()
      } else {
        alert('No se pudo eliminar ningun lead')
      }
    } catch (error) {
      console.error('Error eliminando leads:', error)
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
        alert('Cotizacion creada exitosamente')
        setShowCotizacionModal(false)
        setCotizacionLead(null)
        setProyectoNombre('')
        await loadData()
      } else {
        alert('Error creando cotizacion')
      }
    } catch (error) {
      console.error('Error creando cotizacion:', error)
      alert('Error creando cotizacion')
    }
  }

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

  const crearLeadManual = async () => {
    // Validar campos requeridos
    if (!nuevoLead.cliente_id) {
      alert('Debes seleccionar un cliente')
      return
    }

    if (!nuevoLead.nombre && !nuevoLead.email && !nuevoLead.telefono) {
      alert('Debes proporcionar al menos nombre, email o teléfono')
      return
    }

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoLead)
      })

      const data = await res.json()

      if (res.ok) {
        alert(`Lead creado exitosamente desde ${nuevoLead.fuente}`)
        setShowAgregarLeadModal(false)
        // Resetear formulario
        setNuevoLead({
          cliente_id: '',
          nombre: '',
          email: '',
          telefono: '',
          empresa: '',
          fuente: 'email',
          observaciones: ''
        })
        await loadData()
      } else {
        alert(`Error creando lead: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creando lead:', error)
      alert('Error creando lead')
    }
  }

  // Mostrar loading mientras se verifica autenticación
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si es cliente, redirigir a su dashboard (este código no debería ejecutarse por el useEffect arriba)
  if (user?.role === 'cliente') {
    return null
  }

  const filteredLeads = leads
    .filter(lead => selectedCliente === 'all' || lead.cliente_id === selectedCliente)
    .sort((a, b) => {
      // Primero por prioridad (prioritarios arriba)
      if (a.prioridad && !b.prioridad) return -1
      if (!a.prioridad && b.prioridad) return 1
      // Luego por fecha (más recientes primero)
      return new Date(b.fecha_ingreso).getTime() - new Date(a.fecha_ingreso).getTime()
    })

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId)
    return cliente?.nombre || 'Desconocido'
  }

  // Calculos de metricas
  const totalLeads = leads.length
  const leadsContactados = leads.filter(l => l.contactado).length
  const leadsVendidos = leads.filter(l => l.vendido).length
  const tasaConversion = totalLeads > 0 ? ((leadsVendidos / totalLeads) * 100).toFixed(1) : '0'
  const totalVendido = leads.filter(l => l.monto_vendido).reduce((sum, l) => sum + Number(l.monto_vendido || 0), 0)

  return (
    <CRMLayout title="CRM Admin - Muller y Perez" authenticated onRefresh={loadData}>
      {/* Dashboard de Metricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <MetricCard
          title="Total Leads"
          value={totalLeads}
          icon="📊"
          color="blue"
        />
        <MetricCard
          title="Contactados"
          value={leadsContactados}
          subtitle={`${totalLeads > 0 ? ((leadsContactados / totalLeads) * 100).toFixed(1) : 0}%`}
          icon="📞"
          color="blue"
        />
        <MetricCard
          title="Vendidos"
          value={leadsVendidos}
          subtitle={`${tasaConversion}% conversion`}
          icon="✅"
          color="green"
        />
        <MetricCard
          title="Total Vendido"
          value={`$${totalVendido.toLocaleString('es-CL')}`}
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Cotizaciones"
          value={cotizaciones.length}
          subtitle={`${cotizaciones.filter(c => c.estado === 'aceptada').length} aceptadas`}
          icon="📄"
          color="purple"
        />
      </div>

      {/* Filtro por cliente y boton agregar lead */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filtrar por cliente
            </label>
            <select
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="all">Todos los clientes</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} - {cliente.rubro || 'Sin rubro'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Button
              onClick={() => setShowAgregarLeadModal(true)}
              variant="primary"
              className="whitespace-nowrap"
            >
              + Agregar Lead Manual
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de acciones para leads seleccionados */}
      {selectedLeads.length > 0 && (
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {selectedLeads.length} lead(s) seleccionado(s)
            </span>
            <Button onClick={deleteSelectedLeads} variant="danger" className="text-sm">
              Eliminar seleccionados
            </Button>
          </div>
        </div>
      )}

      {/* Tabla de Leads */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                  Fuente
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                  Tiempo sin contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map(lead => (
                <tr
                  key={lead.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    lead.prioridad ? 'bg-yellow-50 border-l-4 border-l-yellow-500' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => toggleLeadSelection(lead.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(lead.fecha_ingreso).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getClienteNombre(lead.cliente_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{lead.nombre || 'Sin nombre'}</div>
                    <div className="text-sm text-gray-600">{lead.email || lead.telefono}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {lead.fuente}<br/>
                    <span className="text-xs text-gray-500">{lead.ad_nombre || lead.form_nombre}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const horas = getHorasSinContacto(lead)
                      return (
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getSemaforoColor(horas)} animate-pulse`} />
                          <span className="text-sm font-medium text-gray-700">{getSemaforoTexto(horas)}</span>
                        </div>
                      )
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.vendido ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                        Vendido
                      </span>
                    ) : lead.contactado ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                        Contactado
                      </span>
                    ) : lead.razon_no_venta ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">
                        Negativo
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                        Nuevo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lead.monto_vendido ? `$${Number(lead.monto_vendido).toLocaleString('es-CL')}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => togglePrioridad(lead.id, !lead.prioridad)}
                      className={`p-2 rounded-lg transition-all ${
                        lead.prioridad
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md'
                          : 'bg-white hover:bg-yellow-50 text-gray-400 hover:text-yellow-500 border border-gray-300'
                      }`}
                      title={lead.prioridad ? 'Quitar prioridad' : 'Marcar como prioritario'}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => setEditingLead(lead)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openCotizacionModal(lead)}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Cotizar
                    </button>
                    <button
                      onClick={() => viewCotizacionesLead(lead)}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                      title="Ver cotizaciones"
                    >
                      📄
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
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

      {/* Modal de edicion de lead */}
      {editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Editar Lead</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contactado
                  </label>
                  <select
                    value={editingLead.contactado ? 'true' : 'false'}
                    onChange={(e) => setEditingLead({...editingLead, contactado: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="false">No</option>
                    <option value="true">Si</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Vendido
                  </label>
                  <select
                    value={editingLead.vendido ? 'true' : 'false'}
                    onChange={(e) => setEditingLead({...editingLead, vendido: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="false">No</option>
                    <option value="true">Si</option>
                  </select>
                </div>
              </div>

              {editingLead.vendido && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Monto Vendido (CLP)
                  </label>
                  <input
                    type="number"
                    value={editingLead.monto_vendido || ''}
                    onChange={(e) => setEditingLead({...editingLead, monto_vendido: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 1500000"
                  />
                </div>
              )}

              {!editingLead.vendido && editingLead.contactado && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Razon de no venta
                  </label>
                  <input
                    type="text"
                    value={editingLead.razon_no_venta || ''}
                    onChange={(e) => setEditingLead({...editingLead, razon_no_venta: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Precio muy alto, no esta interesado, etc."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={editingLead.observaciones || ''}
                  onChange={(e) => setEditingLead({...editingLead, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Observaciones generales..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notas Detalladas
                </label>
                <textarea
                  value={editingLead.notas || ''}
                  onChange={(e) => setEditingLead({...editingLead, notas: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Detalles de la conversacion, seguimientos, proximos pasos..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => setEditingLead(null)}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => updateLead(editingLead.id, {
                    contactado: editingLead.contactado,
                    vendido: editingLead.vendido,
                    monto_vendido: editingLead.monto_vendido || null,
                    razon_no_venta: editingLead.razon_no_venta || null,
                    observaciones: editingLead.observaciones || null,
                    notas: editingLead.notas || null
                  })}
                  variant="primary"
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Cotizacion */}
      {showCotizacionModal && cotizacionLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-t-lg">
              <h3 className="text-xl font-bold">Crear Cotizacion</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lead: {cotizacionLead.nombre}
                </label>
                <p className="text-sm text-slate-500">
                  {cotizacionLead.email} | {cotizacionLead.telefono}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  value={proyectoNombre}
                  onChange={(e) => setProyectoNombre(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Campana Google Ads Q1 2025"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => {
                    setShowCotizacionModal(false)
                    setCotizacionLead(null)
                    setProyectoNombre('')
                  }}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={createCotizacionFromLead}
                  variant="primary"
                >
                  Crear Cotizacion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial de Cotizaciones */}
      {showHistorialCotizaciones && leadSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="bg-gradient-to-r from-purple-900 to-purple-800 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Historial de Cotizaciones</h3>
                  <p className="text-purple-200 text-sm mt-1">
                    Lead: {leadSeleccionado.nombre} ({leadSeleccionado.email})
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowHistorialCotizaciones(false)
                    setLeadSeleccionado(null)
                    setCotizacionesLead([])
                  }}
                  className="text-white hover:text-purple-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {cotizacionesLead.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No hay cotizaciones registradas para este lead</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cotizacionesLead.map((cot) => {
                    const estadoColor = {
                      borrador: 'bg-gray-100 text-gray-700 border-gray-300',
                      enviada: 'bg-blue-100 text-blue-700 border-blue-300',
                      aceptada: 'bg-green-100 text-green-700 border-green-300',
                      rechazada: 'bg-red-100 text-red-700 border-red-300'
                    }[cot.estado] || 'bg-gray-100 text-gray-700 border-gray-300'

                    return (
                      <div key={cot.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{cot.nombre_proyecto}</h4>
                            <p className="text-sm text-slate-500">
                              Creada: {new Date(cot.creado_en).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${estadoColor}`}>
                            {cot.estado.charAt(0).toUpperCase() + cot.estado.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                          <div>
                            <span className="text-slate-600">Subtotal:</span>
                            <span className="ml-2 font-medium">
                              ${Number(cot.subtotal).toLocaleString('es-CL')}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Descuento:</span>
                            <span className="ml-2 font-medium">
                              ${Number(cot.descuento || 0).toLocaleString('es-CL')}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-600">Total:</span>
                            <span className="ml-2 font-bold text-lg text-blue-600">
                              ${Number(cot.total).toLocaleString('es-CL')}
                            </span>
                          </div>
                        </div>

                        {cot.notas && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-sm text-slate-600">{cot.notas}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => {
                    setShowHistorialCotizaciones(false)
                    setLeadSeleccionado(null)
                    setCotizacionesLead([])
                  }}
                  variant="secondary"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Lead Manual */}
      {showAgregarLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="bg-gradient-to-r from-green-900 to-green-800 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Agregar Lead Manual</h2>
              <p className="text-green-200 text-sm mt-1">
                Leads desde Email, WhatsApp u otras fuentes
              </p>
            </div>
            <div className="p-6 space-y-4">
              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cliente *
                </label>
                <select
                  value={nuevoLead.cliente_id}
                  onChange={(e) => setNuevoLead({...nuevoLead, cliente_id: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} - {cliente.rubro || 'Sin rubro'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fuente del Lead *
                </label>
                <select
                  value={nuevoLead.fuente}
                  onChange={(e) => setNuevoLead({...nuevoLead, fuente: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="email">📧 Email</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="meta">📱 Meta (Facebook/Instagram)</option>
                  <option value="zapier">⚡ Zapier</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nuevoLead.nombre}
                    onChange={(e) => setNuevoLead({...nuevoLead, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="Nombre del contacto"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={nuevoLead.email}
                    onChange={(e) => setNuevoLead({...nuevoLead, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Telefono */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={nuevoLead.telefono}
                    onChange={(e) => setNuevoLead({...nuevoLead, telefono: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                {/* Empresa */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={nuevoLead.empresa}
                    onChange={(e) => setNuevoLead({...nuevoLead, empresa: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="Nombre de la empresa"
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={nuevoLead.observaciones}
                  onChange={(e) => setNuevoLead({...nuevoLead, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Notas adicionales sobre este lead..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Debes proporcionar al menos uno de los siguientes: nombre, email o teléfono.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => {
                    setShowAgregarLeadModal(false)
                    setNuevoLead({
                      cliente_id: '',
                      nombre: '',
                      email: '',
                      telefono: '',
                      empresa: '',
                      fuente: 'email',
                      observaciones: ''
                    })
                  }}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={crearLeadManual}
                  variant="primary"
                >
                  Crear Lead
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  )
}
