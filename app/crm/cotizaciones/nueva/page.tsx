'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'

interface Cliente {
  id: string
  nombre: string
  rubro?: string
}

interface Lead {
  id: number
  nombre?: string
  email?: string
  telefono?: string
  cliente_id: string
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
}

export default function NuevaCotizacionPage() {
  const router = useRouter()

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsFiltered, setLeadsFiltered] = useState<Lead[]>([])
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [plantillaAsignada, setPlantillaAsignada] = useState<Plantilla | null>(null)
  const [clienteLogo, setClienteLogo] = useState<string | null>(null)

  const [clienteId, setClienteId] = useState('')
  const [leadId, setLeadId] = useState<number | null>(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
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
  const [estado, setEstado] = useState<'borrador' | 'enviada'>('borrador')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  // Cargar parámetros de URL cuando los datos estén listos
  useEffect(() => {
    if (!initialLoadDone && leads.length > 0 && clientes.length > 0) {
      const searchParams = new URLSearchParams(window.location.search)
      const urlLeadId = searchParams.get('lead_id')
      const urlClienteId = searchParams.get('cliente_id')

      if (urlClienteId) {
        setClienteId(urlClienteId)
      }

      if (urlLeadId) {
        setLeadId(parseInt(urlLeadId))
      }

      setInitialLoadDone(true)
    }
  }, [leads, clientes, initialLoadDone])

  useEffect(() => {
    if (clienteId) {
      const filtered = leads.filter(l => l.cliente_id === clienteId)
      setLeadsFiltered(filtered)
    } else {
      setLeadsFiltered([])
    }
  }, [clienteId, leads])

  useEffect(() => {
    if (leadId) {
      const lead = leads.find(l => l.id === leadId)
      if (lead) {
        setClienteNombre(lead.nombre || '')
        setClienteEmail(lead.email || '')
      }
    }
  }, [leadId, leads])

  // Detectar plantilla asignada al cliente cuando se selecciona
  useEffect(() => {
    const fetchPlantillaCliente = async () => {
      if (!clienteId) {
        setPlantillaAsignada(null)
        setClienteLogo(null)
        return
      }

      try {
        const res = await fetch(`/api/crm/plantillas/cliente?cliente_id=${clienteId}`)
        const data = await res.json()

        if (data.plantilla) {
          setPlantillaAsignada(data.plantilla)
          setClienteLogo(data.plantilla.logo_url || null)

          // Auto-aplicar la plantilla asignada
          if (data.plantilla.items_default && data.plantilla.items_default.length > 0) {
            const itemsConvertidos = data.plantilla.items_default.map((item: any) => ({
              descripcion: item.descripcion,
              cantidad: item.cantidad,
              precio_unitario: item.precio,
              total: item.cantidad * item.precio
            }))

            setItems(itemsConvertidos)
            setNotas(data.plantilla.notas_default || '')
            setVigenciaDias(data.plantilla.vigencia_dias_default || 30)

            // Calcular descuento en pesos
            const subtotal = itemsConvertidos.reduce((sum: number, item: any) => sum + item.total, 0)
            const descuentoPesos = (subtotal * (data.plantilla.descuento_default || 0)) / 100
            setDescuento(descuentoPesos)
          }
        } else {
          setPlantillaAsignada(null)
          setClienteLogo(null)
        }
      } catch (error) {
        console.error('Error obteniendo plantilla del cliente:', error)
      }
    }

    fetchPlantillaCliente()
  }, [clienteId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [resClientes, resLeads, resPlantillas] = await Promise.all([
        fetch('/api/crm/clientes'),
        fetch('/api/crm/leads?limit=500'),
        fetch('/api/crm/plantillas')
      ])

      const dataClientes = await resClientes.json()
      const dataLeads = await resLeads.json()
      const dataPlantillas = await resPlantillas.json()

      setClientes(dataClientes.clientes || [])
      setLeads(dataLeads.leads || [])
      setPlantillas(dataPlantillas.plantillas || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  const aplicarPlantilla = (plantillaId: string) => {
    if (!plantillaId) return

    const plantilla = plantillas.find(p => p.id === parseInt(plantillaId))
    if (!plantilla) return

    // Convertir items de la plantilla al formato de cotización
    const itemsConvertidos = plantilla.items_default.map(item => ({
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      precio_unitario: item.precio,
      total: item.cantidad * item.precio
    }))

    setItems(itemsConvertidos)
    setNotas(plantilla.notas_default || '')
    setVigenciaDias(plantilla.vigencia_dias_default)

    // Calcular descuento en pesos
    const subtotal = itemsConvertidos.reduce((sum, item) => sum + item.total, 0)
    const descuentoPesos = (subtotal * plantilla.descuento_default) / 100
    setDescuento(descuentoPesos)

    alert(`✅ Plantilla "${plantilla.nombre}" aplicada correctamente`)
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
    if (!clienteId) {
      alert('Selecciona un cliente')
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
          cliente_id: clienteId,
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
        router.push(`/crm/cotizaciones/${data.cotizacion.id}`)
      } else {
        alert('Error creando cotizacion: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creando cotizacion')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <CRMLayout title="Nueva Cotizacion">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-white mt-4">Cargando...</p>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="Nueva Cotizacion">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6">
            <h2 className="text-2xl font-bold">Crear Nueva Cotizacion</h2>
            <p className="text-blue-200 text-sm mt-1">Completa los datos del proyecto y servicios</p>
          </div>

          {/* Formulario */}
          <div className="p-6 space-y-6">
            {/* Logo del cliente (si tiene plantilla asignada) */}
            {clienteLogo && plantillaAsignada && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5 shadow-sm">
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
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-lg font-bold text-green-900">
                        Plantilla Personalizada Detectada
                      </h3>
                    </div>
                    <p className="text-green-800 text-sm mb-1">
                      <strong>{plantillaAsignada.nombre}</strong>
                    </p>
                    <p className="text-green-700 text-xs">
                      La plantilla personalizada de este cliente se ha aplicado automáticamente con {plantillaAsignada.items_default?.length || 0} items predefinidos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selector de plantilla */}
            {plantillas.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  📋 Usar Plantilla (Opcional)
                </label>
                <div className="flex gap-3">
                  <select
                    onChange={(e) => aplicarPlantilla(e.target.value)}
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Selecciona una plantilla predefinida...</option>
                    {plantillas.map(plantilla => (
                      <option key={plantilla.id} value={plantilla.id}>
                        {plantilla.nombre} - ${plantilla.items_default.reduce((sum, item) => sum + (item.cantidad * item.precio), 0).toLocaleString('es-CL')}
                      </option>
                    ))}
                  </select>
                  <Link href="/crm/plantillas">
                    <Button variant="secondary" className="text-sm whitespace-nowrap">
                      Gestionar
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  {plantillaAsignada
                    ? 'Puedes cambiar a otra plantilla si lo necesitas.'
                    : 'Al seleccionar una plantilla, se llenarán automáticamente los items, notas y configuración.'
                  }
                </p>
              </div>
            )}

            {/* Seleccion de cliente y lead */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cliente *
                </label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.rubro ? `- ${cliente.rubro}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lead (Opcional)
                </label>
                <select
                  value={leadId || ''}
                  onChange={(e) => setLeadId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!clienteId}
                >
                  <option value="">Sin lead asociado</option>
                  {leadsFiltered.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.nombre || lead.email || `Lead #${lead.id}`}
                    </option>
                  ))}
                </select>
              </div>
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
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Campana Google Ads Q1 2025"
              />
            </div>

            {/* Datos del cliente */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Datos del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre Contacto
                  </label>
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del contacto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={clienteEmail}
                    onChange={(e) => setClienteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Empresa
                  </label>
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
                <Button onClick={addItem} variant="primary" className="text-sm">
                  + Agregar Item
                </Button>
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
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Descripcion del servicio"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => updateItem(index, 'cantidad', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Cant."
                          min="0"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          type="number"
                          value={item.precio_unitario}
                          onChange={(e) => updateItem(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
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
                            ✕
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
                      className="w-32 px-2 py-1 border border-slate-300 rounded text-sm text-right focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Terminos y condiciones, notas adicionales..."
                />
              </div>
            </div>

            {/* Botones de accion */}
            <div className="border-t border-slate-200 pt-6 flex justify-end gap-3">
              <Button
                onClick={() => router.push('/crm/cotizaciones')}
                variant="secondary"
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                variant="secondary"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar como Borrador'}
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                variant="success"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Crear y Enviar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  )
}
