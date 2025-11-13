'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Button from '@/app/components/crm/Button'
import { generarPDFCotizacion } from '@/lib/utils/pdfGenerator'

interface CotizacionItem {
  descripcion: string
  cantidad: number
  precio_unitario: number
  total: number
}

interface Cotizacion {
  id: number
  cliente_id: string
  lead_id?: number
  nombre_proyecto: string
  cliente_nombre?: string
  cliente_email?: string
  cliente_empresa?: string
  items: CotizacionItem[]
  subtotal: number
  descuento?: number
  total: number
  notas?: string
  estado: string
  vigencia_dias?: number
  creado_en: string
  enviada_en?: string
  aceptada_en?: string
  logo_url?: string | null
  plantilla_id?: number | null
  clientes?: {
    nombre: string
    rubro?: string
  }
  leads?: {
    nombre?: string
    email?: string
    telefono?: string
  }
}

export default function CotizacionPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedCotizacion, setEditedCotizacion] = useState<Cotizacion | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      loadCotizacion()
    }
  }, [id])

  const loadCotizacion = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/cotizaciones?id=${id}`)
      const data = await res.json()

      if (res.ok) {
        setCotizacion(data.cotizacion)
        setEditedCotizacion(data.cotizacion)
      } else {
        alert('Error cargando cotizacion')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error cargando cotizacion')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!editedCotizacion) return

    setSaving(true)
    try {
      const res = await fetch('/api/crm/cotizaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editedCotizacion.id,
          nombre_proyecto: editedCotizacion.nombre_proyecto,
          cliente_nombre: editedCotizacion.cliente_nombre,
          cliente_email: editedCotizacion.cliente_email,
          cliente_empresa: editedCotizacion.cliente_empresa,
          items: editedCotizacion.items,
          subtotal: editedCotizacion.subtotal,
          descuento: editedCotizacion.descuento,
          total: editedCotizacion.total,
          notas: editedCotizacion.notas,
          vigencia_dias: editedCotizacion.vigencia_dias,
        })
      })

      if (res.ok) {
        alert('Cotizacion actualizada')
        setEditing(false)
        await loadCotizacion()
      } else {
        alert('Error actualizando cotizacion')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error actualizando cotizacion')
    }
    setSaving(false)
  }

  const handleEstadoChange = async (nuevoEstado: string) => {
    if (!cotizacion) return

    if (!confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) return

    try {
      const res = await fetch('/api/crm/cotizaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cotizacion.id,
          estado: nuevoEstado
        })
      })

      if (res.ok) {
        alert('Estado actualizado')
        await loadCotizacion()
      } else {
        alert('Error actualizando estado')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error actualizando estado')
    }
  }

  const handleDelete = async () => {
    if (!cotizacion) return

    if (!confirm('¿Estas seguro de eliminar esta cotizacion? Esta accion no se puede deshacer.')) return

    try {
      const res = await fetch(`/api/crm/cotizaciones?id=${cotizacion.id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('Cotizacion eliminada')
        router.push('/crm/cotizaciones')
      } else {
        alert('Error eliminando cotizacion')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error eliminando cotizacion')
    }
  }

  const addItem = () => {
    if (!editedCotizacion) return

    const newItem: CotizacionItem = {
      descripcion: '',
      cantidad: 1,
      precio_unitario: 0,
      total: 0
    }

    const newItems = [...editedCotizacion.items, newItem]
    updateCotizacion({ items: newItems })
  }

  const removeItem = (index: number) => {
    if (!editedCotizacion) return

    const newItems = editedCotizacion.items.filter((_, i) => i !== index)
    updateCotizacion({ items: newItems })
  }

  const updateItem = (index: number, field: keyof CotizacionItem, value: any) => {
    if (!editedCotizacion) return

    const newItems = [...editedCotizacion.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Recalcular total del item
    if (field === 'cantidad' || field === 'precio_unitario') {
      newItems[index].total = newItems[index].cantidad * newItems[index].precio_unitario
    }

    updateCotizacion({ items: newItems })
  }

  const updateCotizacion = (updates: Partial<Cotizacion>) => {
    if (!editedCotizacion) return

    const updated = { ...editedCotizacion, ...updates }

    // Recalcular subtotal
    const subtotal = updated.items.reduce((sum, item) => sum + item.total, 0)
    updated.subtotal = subtotal
    updated.total = subtotal - (updated.descuento || 0)

    setEditedCotizacion(updated)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-600">Cargando cotizacion...</p>
        </div>
      </div>
    )
  }

  if (!cotizacion || !editedCotizacion) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600">Cotizacion no encontrada</p>
          <Button onClick={() => router.push('/crm/cotizaciones')} className="mt-4">
            Volver a Cotizaciones
          </Button>
        </div>
      </div>
    )
  }

  const estadoColors = {
    borrador: 'bg-gray-100 text-gray-700 border-gray-300',
    enviada: 'bg-blue-100 text-blue-700 border-blue-300',
    aceptada: 'bg-green-100 text-green-700 border-green-300',
    rechazada: 'bg-red-100 text-red-700 border-red-300',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header con acciones */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Cotizacion #{cotizacion.id}</h1>
              <p className="text-blue-200 text-sm mt-1">{cotizacion.nombre_proyecto}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/crm/cotizaciones')}
                variant="secondary"
                className="text-sm"
              >
                Volver
              </Button>
              {editing ? (
                <>
                  <Button onClick={() => setEditing(false)} variant="secondary" className="text-sm">
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} variant="success" disabled={saving} className="text-sm">
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setEditing(true)} variant="primary" className="text-sm">
                    Editar
                  </Button>
                  <Button
                    onClick={async () => {
                      await generarPDFCotizacion({
                        id: cotizacion.id,
                        nombre_proyecto: cotizacion.nombre_proyecto,
                        cliente_nombre: cotizacion.cliente_nombre,
                        cliente_email: cotizacion.cliente_email,
                        cliente_telefono: cotizacion.leads?.telefono,
                        items: cotizacion.items,
                        subtotal: cotizacion.subtotal,
                        descuento: cotizacion.descuento,
                        total: cotizacion.total,
                        notas: cotizacion.notas,
                        vigencia_dias: cotizacion.vigencia_dias,
                        creado_en: cotizacion.creado_en,
                        logo_url: cotizacion.logo_url
                      })
                    }}
                    variant="success"
                    className="text-sm"
                  >
                    📥 Exportar PDF
                  </Button>
                  <Button onClick={() => window.print()} variant="secondary" className="text-sm">
                    🖨️ Imprimir
                  </Button>
                  <Button onClick={handleDelete} variant="danger" className="text-sm">
                    Eliminar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la cotizacion */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Estado y acciones rapidas */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Estado:</span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${estadoColors[cotizacion.estado as keyof typeof estadoColors] || estadoColors.borrador}`}>
              {cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}
            </span>
          </div>
          {!editing && (
            <div className="flex gap-2">
              {cotizacion.estado === 'borrador' && (
                <Button onClick={() => handleEstadoChange('enviada')} variant="primary" className="text-sm">
                  Marcar como Enviada
                </Button>
              )}
              {cotizacion.estado === 'enviada' && (
                <>
                  <Button onClick={() => handleEstadoChange('aceptada')} variant="success" className="text-sm">
                    Marcar como Aceptada
                  </Button>
                  <Button onClick={() => handleEstadoChange('rechazada')} variant="danger" className="text-sm">
                    Marcar como Rechazada
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Logo del Cliente (si existe) */}
        {cotizacion.logo_url && (
          <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6 flex items-center gap-4">
            <div className="flex-shrink-0 bg-gray-50 p-4 rounded-lg">
              <Image
                src={cotizacion.logo_url}
                alt="Logo del cliente"
                width={200}
                height={75}
                className="max-w-full h-auto"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-green-800">Cotización con Branding Personalizado</span>
              </div>
              <p className="text-xs text-gray-600">
                Esta cotización incluye el logo del cliente para mantener consistencia de marca
              </p>
            </div>
          </div>
        )}

        {/* Encabezado de la cotizacion */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8 rounded-t-lg print:rounded-none">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <img src="/logo-myp.png" alt="M&P Logo" className="h-16 w-16 object-contain" />
              <div>
                <h2 className="text-3xl font-bold mb-2">COTIZACION</h2>
                <p className="text-blue-200">Muller y Perez</p>
                <p className="text-blue-200 text-sm">Agencia de Marketing Digital</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200 mb-1">N° Cotizacion</div>
              <div className="text-3xl font-bold">#{cotizacion.id}</div>
              <div className="text-sm text-blue-200 mt-4">
                Fecha: {new Date(cotizacion.creado_en).toLocaleDateString('es-CL')}
              </div>
              {cotizacion.vigencia_dias && (
                <div className="text-sm text-blue-200">
                  Vigencia: {cotizacion.vigencia_dias} dias
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informacion del cliente */}
        <div className="bg-gray-50 p-8 border-x border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">CLIENTE</h3>
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedCotizacion.cliente_nombre || ''}
                    onChange={(e) => updateCotizacion({ cliente_nombre: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="Nombre del cliente"
                  />
                  <input
                    type="email"
                    value={editedCotizacion.cliente_email || ''}
                    onChange={(e) => updateCotizacion({ cliente_email: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={editedCotizacion.cliente_empresa || ''}
                    onChange={(e) => updateCotizacion({ cliente_empresa: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="Empresa"
                  />
                </div>
              ) : (
                <div className="text-gray-700">
                  <p className="font-medium">{cotizacion.cliente_nombre || cotizacion.clientes?.nombre}</p>
                  <p className="text-sm">{cotizacion.cliente_email || cotizacion.leads?.email}</p>
                  <p className="text-sm">{cotizacion.cliente_empresa}</p>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">PROYECTO</h3>
              {editing ? (
                <input
                  type="text"
                  value={editedCotizacion.nombre_proyecto}
                  onChange={(e) => updateCotizacion({ nombre_proyecto: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="Nombre del proyecto"
                />
              ) : (
                <p className="text-slate-700 font-medium">{cotizacion.nombre_proyecto}</p>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border-x border-gray-200 p-8">
          <h3 className="font-bold text-gray-900 mb-4">DETALLE DE SERVICIOS</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 text-sm font-semibold text-gray-700">Descripcion</th>
                <th className="text-center py-3 text-sm font-semibold text-gray-700 w-24">Cant.</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700 w-32">Precio Unit.</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700 w-32">Total</th>
                {editing && <th className="w-16"></th>}
              </tr>
            </thead>
            <tbody>
              {editedCotizacion.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="py-3">
                    {editing ? (
                      <input
                        type="text"
                        value={item.descripcion}
                        onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Descripcion del servicio"
                      />
                    ) : (
                      <span className="text-slate-700">{item.descripcion}</span>
                    )}
                  </td>
                  <td className="text-center py-3">
                    {editing ? (
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => updateItem(index, 'cantidad', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded text-sm text-center"
                        min="0"
                      />
                    ) : (
                      <span className="text-slate-700">{item.cantidad}</span>
                    )}
                  </td>
                  <td className="text-right py-3">
                    {editing ? (
                      <input
                        type="number"
                        value={item.precio_unitario}
                        onChange={(e) => updateItem(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded text-sm text-right"
                        min="0"
                      />
                    ) : (
                      <span className="text-slate-700">${item.precio_unitario.toLocaleString('es-CL')}</span>
                    )}
                  </td>
                  <td className="text-right py-3">
                    <span className="text-slate-900 font-medium">
                      ${item.total.toLocaleString('es-CL')}
                    </span>
                  </td>
                  {editing && (
                    <td className="text-center py-3">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {editing && (
            <button
              onClick={addItem}
              className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              + Agregar Item
            </button>
          )}
        </div>

        {/* Totales */}
        <div className="bg-gray-50 border-x border-b border-gray-200 p-8 rounded-b-lg print:rounded-none">
          <div className="flex justify-end">
            <div className="w-80">
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium text-gray-900">
                  ${editedCotizacion.subtotal.toLocaleString('es-CL')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span className="text-gray-700">Descuento:</span>
                <span className="font-medium text-gray-900">
                  {editing ? (
                    <input
                      type="number"
                      value={editedCotizacion.descuento || 0}
                      onChange={(e) => updateCotizacion({ descuento: parseFloat(e.target.value) || 0 })}
                      className="w-32 px-2 py-1 border rounded text-sm text-right"
                      min="0"
                    />
                  ) : (
                    `-$${(editedCotizacion.descuento || 0).toLocaleString('es-CL')}`
                  )}
                </span>
              </div>
              <div className="flex justify-between py-3 bg-blue-50 border-2 border-blue-600 text-blue-900 px-4 rounded mt-2">
                <span className="font-bold text-lg">TOTAL:</span>
                <span className="font-bold text-2xl">
                  ${editedCotizacion.total.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        {(editing || cotizacion.notas) && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">NOTAS / OBSERVACIONES</h3>
            {editing ? (
              <textarea
                value={editedCotizacion.notas || ''}
                onChange={(e) => updateCotizacion({ notas: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm"
                rows={4}
                placeholder="Notas adicionales, terminos y condiciones, etc."
              />
            ) : (
              <p className="text-slate-700 whitespace-pre-wrap">{cotizacion.notas}</p>
            )}
          </div>
        )}

        {/* Footer para impresion */}
        <div className="hidden print:block mt-12 pt-6 border-t border-slate-300 text-center text-sm text-slate-600">
          <p>Muller y Perez - Agencia de Marketing Digital</p>
          <p>contacto@mulleryperez.cl | www.mulleryperez.cl</p>
        </div>
      </div>
    </div>
  )
}
