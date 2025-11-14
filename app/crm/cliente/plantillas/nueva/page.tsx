'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import LogoUploader from '@/app/components/crm/LogoUploader'

interface Item {
  descripcion: string
  cantidad: number
  precio: number
}

export default function NuevaPlantillaClientePage() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    notas_default: '',
    vigencia_dias_default: 15,
    descuento_default: 0,
    activa: true
  })
  const [items, setItems] = useState<Item[]>([
    { descripcion: '', cantidad: 1, precio: 0 }
  ])
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [logoFilename, setLogoFilename] = useState<string>('')

  // Redirigir si no es cliente
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
    } else if (user?.role !== 'cliente') {
      router.push('/crm')
    }
  }, [isAuthenticated, user, router])

  const handleLogoUpload = (url: string, filename: string) => {
    setLogoUrl(url)
    setLogoFilename(filename)
  }

  const agregarItem = () => {
    setItems([...items, { descripcion: '', cantidad: 1, precio: 0 }])
  }

  const eliminarItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const actualizarItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calcularTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0)
    const descuento = subtotal * (formData.descuento_default / 100)
    return subtotal - descuento
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.cliente_id) {
      alert('Error: No se pudo identificar tu cliente ID')
      return
    }

    if (!formData.nombre.trim()) {
      alert('El nombre de la plantilla es requerido')
      return
    }

    const itemsValidos = items.filter(item => item.descripcion.trim())
    if (itemsValidos.length === 0) {
      alert('Debes agregar al menos un item con descripción')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/crm/plantillas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items_default: itemsValidos,
          logo_url: logoUrl || null,
          logo_filename: logoFilename || null,
          cliente_id: user.cliente_id, // Auto-asignar cliente_id
          es_base: false // SIEMPRE false para clientes
        })
      })

      if (!res.ok) throw new Error('Error al crear plantilla')

      alert('Plantilla creada exitosamente')
      router.push('/crm/cliente/plantillas')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la plantilla')
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Nueva Plantilla</h1>
              <p className="text-blue-200 mt-1">Crea una plantilla personalizada para tus cotizaciones</p>
            </div>
            <button
              onClick={() => router.push('/crm/cliente/plantillas')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Información Básica</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Plantilla *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Paquete Marketing Digital"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe brevemente esta plantilla..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vigencia (días)
                  </label>
                  <input
                    type="number"
                    value={formData.vigencia_dias_default}
                    onChange={(e) => setFormData({ ...formData, vigencia_dias_default: parseInt(e.target.value) || 0 })}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    value={formData.descuento_default}
                    onChange={(e) => setFormData({ ...formData, descuento_default: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Upload de Logo */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Logo de la Plantilla</h3>

            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-600">
                <p><strong>Formatos:</strong> PNG, JPG, JPEG, WebP</p>
                <p><strong>Tamaño máx:</strong> 512 KB</p>
                <p><strong>Dimensiones recomendadas:</strong> 200x200px</p>
              </div>

              <LogoUploader
                clienteId={user?.cliente_id}
                onUploadSuccess={handleLogoUpload}
                onUploadError={(err) => alert(err)}
              />

              {logoUrl && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Logo cargado correctamente. Se guardará al crear la plantilla.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Items de la Plantilla</h3>
              <button
                type="button"
                onClick={agregarItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                + Agregar Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.descripcion}
                      onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                      placeholder="Descripción del servicio"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => actualizarItem(index, 'cantidad', parseInt(e.target.value) || 0)}
                      placeholder="Cant."
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="w-32">
                    <input
                      type="number"
                      value={item.precio}
                      onChange={(e) => actualizarItem(index, 'precio', parseInt(e.target.value) || 0)}
                      placeholder="Precio"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="w-32 text-right font-semibold text-gray-900">
                    ${(item.cantidad * item.precio).toLocaleString('es-CL')}
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarItem(index)}
                      className="text-red-600 hover:text-red-800 font-semibold px-3 py-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-end gap-4 text-lg">
                <span className="font-semibold text-gray-700">Total Estimado:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${calcularTotal().toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notas por Defecto</h3>
            <textarea
              value={formData.notas_default}
              onChange={(e) => setFormData({ ...formData, notas_default: e.target.value })}
              placeholder="Notas o términos y condiciones que aparecerán en las cotizaciones generadas con esta plantilla..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Plantilla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
