'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'

interface Item {
  descripcion: string
  cantidad: number
  precio: number
}

export default function NuevaPlantillaPage() {
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
          items_default: itemsValidos
        })
      })

      if (!res.ok) throw new Error('Error al crear plantilla')

      alert('Plantilla creada exitosamente')
      router.push('/crm/plantillas')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la plantilla')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRMLayout title="Nueva Plantilla">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Plantilla</h2>
          <p className="text-gray-600 mt-1">
            Define una plantilla para agilizar la creación de cotizaciones futuras
          </p>
        </div>

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
                  placeholder="Ej: Marketing Digital Básico"
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

          {/* Items */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Items de la Plantilla</h3>
              <Button type="button" variant="secondary" onClick={agregarItem}>
                + Agregar Item
              </Button>
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
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Plantilla'}
            </Button>
          </div>
        </form>
      </div>
    </CRMLayout>
  )
}
