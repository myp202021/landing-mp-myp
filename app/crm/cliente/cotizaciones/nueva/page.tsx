'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Lead {
  id: number
  nombre?: string
  email?: string
  telefono?: string
}

interface CotizacionItem {
  descripcion: string
  cantidad: number
  precio_unitario: number
  total: number
}

interface Plantilla {
  id: number
  nombre: string
  descripcion?: string
  items_default: Array<{ descripcion: string; cantidad: number; precio: number }>
  notas_default?: string
  vigencia_dias_default: number
  descuento_default: number
  logo_url?: string
}

interface PlanMYP {
  id: number
  nombre: string
  descripcion?: string
  items_incluidos: Array<{ descripcion: string; cantidad: number; precio_unitario: number }>
  precio_base: number
  descuento_default: number
  vigencia_dias: number
}

export default function ClienteNuevaCotizacionPage() {
  const { user, isAuthenticated } = useSimpleAuth()
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [plantillaAsignada, setPlantillaAsignada] = useState<Plantilla | null>(null)
  const [clienteLogo, setClienteLogo] = useState<string | null>(null)
  const [planesMYP, setPlanesMYP] = useState<PlanMYP[]>([])
  const [planMYPSeleccionado, setPlanMYPSeleccionado] = useState<string>('')

  const [leadId, setLeadId] = useState<number | null>(null)
  const [nombreProyecto, setNombreProyecto] = useState('')
  const [clienteNombre, setClienteNombre] = useState('')
  const [clienteEmail, setClienteEmail] = useState('')
  const [clienteEmpresa, setClienteEmpresa] = useState('')
  const [items, setItems] = useState<CotizacionItem[]>([
    { descripcion: '', cantidad: 1, precio_unitario: 0, total: 0 }
  ])
  const [descuento, setDescuento] = useState(0)
  const [notas, setNotas] = useState('')
  const [vigenciaDias, setVigenciaDias] = useState(30)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Protección de acceso
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/crm/login')
      return
    }

    if (user.role !== 'cliente' || !user.cliente_id) {
      router.push('/crm')
      return
    }

    loadData()
  }, [isAuthenticated, user, router])

  const loadData = async () => {
    if (!user?.cliente_id) return

    setLoading(true)
    try {
      // Cargar leads del cliente
      const resLeads = await fetch('/api/crm/leads?limit=500')
      const dataLeads = await resLeads.json()
      const misLeads = (dataLeads.leads || []).filter((l: Lead & { cliente_id: string }) => l.cliente_id === user.cliente_id)
      setLeads(misLeads)

      // Cargar plantilla asignada al cliente
      const resPlantilla = await fetch(`/api/crm/plantillas/cliente?cliente_id=${user.cliente_id}`)
      const dataPlantilla = await resPlantilla.json()

      if (dataPlantilla.plantilla) {
        setPlantillaAsignada(dataPlantilla.plantilla)
        setClienteLogo(dataPlantilla.plantilla.logo_url || null)

        // Auto-aplicar plantilla
        if (dataPlantilla.plantilla.items_default && dataPlantilla.plantilla.items_default.length > 0) {
          const itemsConvertidos = dataPlantilla.plantilla.items_default.map((item: any) => ({
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
            total: item.cantidad * item.precio
          }))

          setItems(itemsConvertidos)
          setNotas(dataPlantilla.plantilla.notas_default || '')
          setVigenciaDias(dataPlantilla.plantilla.vigencia_dias_default || 30)

          const subtotal = itemsConvertidos.reduce((sum: number, item: any) => sum + item.total, 0)
          const descuentoPesos = (subtotal * (dataPlantilla.plantilla.descuento_default || 0)) / 100
          setDescuento(descuentoPesos)
        }
      }

      // Cargar planes M&P
      const resPlanes = await fetch('/api/crm/planes-myp')
      const dataPlanes = await resPlanes.json()
      setPlanesMYP(dataPlanes.planes || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (leadId) {
      const lead = leads.find(l => l.id === leadId)
      if (lead) {
        setClienteNombre(lead.nombre || '')
        setClienteEmail(lead.email || '')
      }
    }
  }, [leadId, leads])

  const aplicarPlanMYP = (planId: string) => {
    if (!planId) {
      setPlanMYPSeleccionado('')
      return
    }

    const plan = planesMYP.find(p => p.id === parseInt(planId))
    if (!plan) return

    const itemsConvertidos = plan.items_incluidos.map(item => ({
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      total: item.cantidad * item.precio_unitario
    }))

    setItems(itemsConvertidos)
    setVigenciaDias(plan.vigencia_dias)

    const subtotal = itemsConvertidos.reduce((sum, item) => sum + item.total, 0)
    const descuentoPesos = (subtotal * plan.descuento_default) / 100
    setDescuento(descuentoPesos)

    setPlanMYPSeleccionado(planId)
    alert(`Plan M&P "${plan.nombre}" aplicado correctamente`)
  }

  const limpiarFormulario = () => {
    setItems([{ descripcion: '', cantidad: 1, precio_unitario: 0, total: 0 }])
    setDescuento(0)
    setNotas('')
    setVigenciaDias(30)
    setPlanMYPSeleccionado('')
  }

  const addItem = () => {
    setItems([...items, { descripcion: '', cantidad: 1, precio_unitario: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof CotizacionItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === 'cantidad' || field === 'precio_unitario') {
      newItems[index].total = newItems[index].cantidad * newItems[index].precio_unitario
    }

    setItems(newItems)
  }

  const calcularSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const calcularTotal = () => {
    return calcularSubtotal() - descuento
  }

  const handleSubmit = async (enviar: boolean = false) => {
    if (!user?.cliente_id) {
      alert('Error: No se pudo identificar tu cuenta de cliente')
      return
    }

    if (!nombreProyecto.trim()) {
      alert('Ingresa un nombre para el proyecto')
      return
    }

    if (items.length === 0 || items.every(i => !i.descripcion.trim())) {
      alert('Agrega al menos un item a la cotizacion')
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/crm/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: user.cliente_id,
          lead_id: leadId || null,
          nombre_proyecto: nombreProyecto,
          cliente_nombre: clienteNombre,
          cliente_email: clienteEmail,
          cliente_empresa: clienteEmpresa,
          items: items.filter(i => i.descripcion.trim()),
          subtotal: calcularSubtotal(),
          descuento: descuento,
          total: calcularTotal(),
          notas: notas,
          vigencia_dias: vigenciaDias,
          estado: enviar ? 'enviada' : 'borrador',
          logo_url: clienteLogo || null,
          plantilla_id: plantillaAsignada?.id || null
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert(enviar ? 'Cotizacion creada y enviada' : 'Cotizacion guardada como borrador')
        router.push(`/crm/cliente/cotizaciones`)
      } else {
        alert('Error creando cotizacion: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creando cotizacion')
    }

    setSaving(false)
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-4">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Nueva Cotizacion</h1>
              <p className="text-blue-200 mt-1">Sistema de Gestion de Clientes - M&P Marketing y Performance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/crm/cliente/cotizaciones')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition"
              >
                Volver
              </button>
              <button
                onClick={() => router.push('/crm/login')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Cerrar Sesion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Selector de Plan M&P */}
            {planesMYP.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-lg p-5 shadow-md">
                <label className="block text-sm font-bold text-emerald-900 mb-3">
                  Usar Plan M&P (Silver / Gold / Platinum)
                </label>
                <div className="flex gap-3">
                  <select
                    value={planMYPSeleccionado}
                    onChange={(e) => aplicarPlanMYP(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-emerald-400 rounded-md focus:ring-2 focus:ring-emerald-500 text-gray-900 font-medium"
                  >
                    <option value="">Selecciona un plan M&P...</option>
                    {planesMYP.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.nombre} - ${plan.precio_base.toLocaleString('es-CL')} ({plan.items_incluidos.length} servicios)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={limpiarFormulario}
                    className="px-6 py-3 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition font-semibold shadow-md whitespace-nowrap"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}

            {/* Logo del cliente */}
            {clienteLogo && plantillaAsignada && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-white p-3 rounded-lg shadow-md">
                    <Image
                      src={clienteLogo}
                      alt="Logo del cliente"
                      width={200}
                      height={75}
                      className="max-w-full h-auto"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-900 mb-1">
                      Plantilla Personalizada Detectada
                    </h3>
                    <p className="text-green-800 text-sm">
                      <strong>{plantillaAsignada.nombre}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Lead asociado */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lead Asociado (Opcional)
              </label>
              <select
                value={leadId || ''}
                onChange={(e) => setLeadId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin lead asociado</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.nombre || lead.email || `Lead #${lead.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre del proyecto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                value={nombreProyecto}
                onChange={(e) => setNombreProyecto(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Campana Google Ads Q1 2025"
              />
            </div>

            {/* Datos del cliente */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Datos del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Contacto</label>
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del contacto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={clienteEmail}
                    onChange={(e) => setClienteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Empresa</label>
                  <input
                    type="text"
                    value={clienteEmpresa}
                    onChange={(e) => setClienteEmpresa(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de la empresa"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Servicios / Items</h3>
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  + Agregar Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-12 md:col-span-5">
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                          placeholder="Descripcion del servicio"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => updateItem(index, 'cantidad', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                          placeholder="Cant."
                          min="0"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          type="number"
                          value={item.precio_unitario}
                          onChange={(e) => updateItem(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                          placeholder="Precio"
                          min="0"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2 flex items-center">
                        <span className="text-sm font-medium text-slate-900">
                          ${item.total.toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className="col-span-1 md:col-span-1 flex items-center justify-end">
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700 text-lg font-bold"
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex justify-end">
                <div className="w-80">
                  <div className="flex justify-between py-2 border-b border-slate-300">
                    <span className="text-slate-700">Subtotal:</span>
                    <span className="font-medium text-slate-900">
                      ${calcularSubtotal().toLocaleString('es-CL')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-300">
                    <span className="text-slate-700">Descuento:</span>
                    <input
                      type="number"
                      value={descuento}
                      onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
                      className="w-32 px-2 py-1 border border-slate-300 rounded text-sm text-right"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between py-3 bg-blue-900 text-white px-4 rounded mt-2">
                    <span className="font-bold text-lg">TOTAL:</span>
                    <span className="font-bold text-2xl">
                      ${calcularTotal().toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuracion adicional */}
            <div className="border-t border-slate-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vigencia (dias)
                </label>
                <input
                  type="number"
                  value={vigenciaDias}
                  onChange={(e) => setVigenciaDias(parseInt(e.target.value) || 30)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notas / Observaciones
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  rows={3}
                  placeholder="Terminos y condiciones..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="border-t border-slate-200 pt-6 flex justify-end gap-3">
              <button
                onClick={() => router.push('/crm/cliente/cotizaciones')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar como Borrador'}
              </button>
              <button
                onClick={() => handleSubmit(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Crear y Enviar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
