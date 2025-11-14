'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import Image from 'next/image'
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

export default function ClienteCotizacionPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useSimpleAuth()
  const id = params?.id as string

  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedCotizacion, setEditedCotizacion] = useState<Cotizacion | null>(null)
  const [saving, setSaving] = useState(false)

  // Proteccion de acceso
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/crm/login')
      return
    }

    if (user.role !== 'cliente' || !user.cliente_id) {
      router.push('/crm')
      return
    }

    if (id) {
      loadCotizacion()
    }
  }, [isAuthenticated, user, router, id])

  const loadCotizacion = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/cotizaciones?id=${id}`)
      const data = await res.json()

      if (res.ok) {
        // VALIDACION IMPORTANTE: Verificar que la cotizacion pertenece al cliente
        if (data.cotizacion.cliente_id !== user?.cliente_id) {
          alert('No tienes permiso para ver esta cotizacion')
          router.push('/crm/cliente/cotizaciones')
          return
        }

        setCotizacion(data.cotizacion)
        setEditedCotizacion(data.cotizacion)
      } else {
        alert(data.error || 'Error cargando cotizacion')
        router.push('/crm/cliente/cotizaciones')
      }
    } catch (error: any) {
      alert(error.message || 'Error cargando cotizacion')
      router.push('/crm/cliente/cotizaciones')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!editedCotizacion) return

    // Validar que sigue siendo del cliente (por seguridad)
    if (editedCotizacion.cliente_id !== user?.cliente_id) {
      alert('No tienes permiso para editar esta cotizacion')
      return
    }

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
        const data = await res.json()
        alert(data.error || 'Error actualizando cotizacion')
      }
    } catch (error: any) {
      alert(error.message || 'Error actualizando cotizacion')
    } finally {
      setSaving(false)
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

    if (field === 'cantidad' || field === 'precio_unitario') {
      newItems[index].total = newItems[index].cantidad * newItems[index].precio_unitario
    }

    updateCotizacion({ items: newItems })
  }

  const updateCotizacion = (updates: Partial<Cotizacion>) => {
    if (!editedCotizacion) return

    const updated = { ...editedCotizacion, ...updates }

    const subtotal = updated.items.reduce((sum, item) => sum + item.total, 0)
    updated.subtotal = subtotal
    updated.total = subtotal - (updated.descuento || 0)

    setEditedCotizacion(updated)
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-4">Cargando cotizacion...</p>
        </div>
      </div>
    )
  }

  if (!cotizacion || !editedCotizacion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Cotizacion no encontrada</p>
          <button
            onClick={() => router.push('/crm/cliente/cotizaciones')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a Cotizaciones
          </button>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Cotizacion #{cotizacion.id}</h1>
              <p className="text-blue-200 text-sm mt-1">{cotizacion.nombre_proyecto}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/crm/cliente/cotizaciones')}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition text-sm"
              >
                Volver
              </button>
              {editing ? (
                <>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setEditedCotizacion(cotizacion)
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </>
              ) : (
                <>
                  {/* Solo permitir editar si esta en borrador */}
                  {cotizacion.estado === 'borrador' && (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
                    >
                      Editar
                    </button>
                  )}
                  <button
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Exportar PDF
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    Imprimir
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Estado */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm text-gray-600">Estado:</span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${estadoColors[cotizacion.estado as keyof typeof estadoColors] || estadoColors.borrador}`}>
            {cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}
          </span>
          {cotizacion.estado === 'borrador' && (
            <span className="text-sm text-gray-600 italic">
              (Puedes editar mientras este en borrador)
            </span>
          )}
        </div>

        {/* Logo del Cliente */}
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
              <span className="text-sm font-semibold text-green-800">Cotizacion con Branding Personalizado</span>
            </div>
          </div>
        )}

        {/* Encabezado de la cotizacion */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8 rounded-t-lg">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">COTIZACION</h2>
              <p className="text-blue-200">M&P Marketing y Performance</p>
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
                <p className="text-gray-700 font-medium">{cotizacion.nombre_proyecto}</p>
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
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3">
                    {editing ? (
                      <input
                        type="text"
                        value={item.descripcion}
                        onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Descripcion"
                      />
                    ) : (
                      <span className="text-gray-700">{item.descripcion}</span>
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
                      <span className="text-gray-700">{item.cantidad}</span>
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
                      <span className="text-gray-700">${item.precio_unitario.toLocaleString('es-CL')}</span>
                    )}
                  </td>
                  <td className="text-right py-3">
                    <span className="text-gray-900 font-medium">
                      ${item.total.toLocaleString('es-CL')}
                    </span>
                  </td>
                  {editing && (
                    <td className="text-center py-3">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        X
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
        <div className="bg-gray-50 border-x border-b border-gray-200 p-8 rounded-b-lg">
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
                placeholder="Notas adicionales..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{cotizacion.notas}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
