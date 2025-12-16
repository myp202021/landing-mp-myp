'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'
import LogoUploader from '@/app/components/crm/LogoUploader'

interface Item {
  descripcion: string
  cantidad: number
  precio: number
}

interface Plantilla {
  id: number
  nombre: string
  descripcion?: string
  items_default: Item[]
  notas_default?: string
  vigencia_dias_default: number
  descuento_default: number
  activa: boolean
  logo_url?: string | null
  logo_filename?: string | null
  cliente_id?: string | null
  es_base?: boolean
  clientes?: {
    id: string
    nombre: string
    empresa: string
  }
}

export default function EditarPlantillaPage() {
  const router = useRouter()
  const params = useParams()
  const plantillaId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [plantilla, setPlantilla] = useState<Plantilla | null>(null)
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
  const [logoChanged, setLogoChanged] = useState(false)

  useEffect(() => {
    cargarPlantilla()
  }, [plantillaId])

  const cargarPlantilla = async () => {
    try {
      const res = await fetch(`/api/crm/plantillas?id=${plantillaId}`)
      if (!res.ok) throw new Error('Error al cargar plantilla')

      const response = await res.json()
      const data: Plantilla = response.plantilla

      setPlantilla(data)

      setFormData({
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        notas_default: data.notas_default || '',
        vigencia_dias_default: data.vigencia_dias_default,
        descuento_default: data.descuento_default,
        activa: data.activa
      })

      if (data.items_default && data.items_default.length > 0) {
        setItems(data.items_default)
      }

      if (data.logo_url) {
        setLogoUrl(data.logo_url)
        setLogoFilename(data.logo_filename || '')
      }

      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cargar la plantilla')
      router.push('/crm/plantillas')
    }
  }

  const handleLogoUpload = (url: string, filename: string) => {
    setLogoUrl(url)
    setLogoFilename(filename)
    setLogoChanged(true)
  }

  const handleUpdateLogo = async () => {
    if (!logoUrl || !logoFilename) {
      alert('Primero debes subir un logo')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/crm/plantillas/logo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantilla_id: plantillaId,
          logo_url: logoUrl,
          logo_filename: logoFilename
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert('Logo actualizado correctamente')
        setLogoChanged(false)
        await cargarPlantilla()
      } else {
        throw new Error(data.error || 'Error actualizando logo')
      }
    } catch (err: any) {
      console.error('Error:', err)
      alert('Error al actualizar logo: ' + err.message)
    }
    setSaving(false)
  }

  const handleRemoveLogo = async () => {
    if (!confirm('¿Estás seguro de eliminar el logo de esta plantilla?')) return

    setSaving(true)
    try {
      const res = await fetch(`/api/crm/plantillas?id=${plantillaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logo_url: null,
          logo_filename: null
        })
      })

      if (res.ok) {
        alert('Logo eliminado correctamente')
        setLogoUrl('')
        setLogoFilename('')
        setLogoChanged(false)
        await cargarPlantilla()
      } else {
        alert('Error eliminando logo')
      }
    } catch (err: any) {
      console.error('Error:', err)
      alert('Error eliminando logo')
    }
    setSaving(false)
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

    if (!formData.nombre.trim()) {
      alert('El nombre de la plantilla es requerido')
      return
    }

    const itemsValidos = items.filter(item => item.descripcion.trim())
    if (itemsValidos.length === 0) {
      alert('Debes agregar al menos un item con descripción')
      return
    }

    setSaving(true)

    try {
      const res = await fetch(`/api/crm/plantillas?id=${plantillaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items_default: itemsValidos
        })
      })

      if (!res.ok) throw new Error('Error al actualizar plantilla')

      alert('Plantilla actualizada exitosamente')
      router.push('/crm/plantillas')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar la plantilla')
    } finally {
      setSaving(false)
    }
  }

  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      return
    }

    setSaving(true)

    try {
      const res = await fetch(`/api/crm/plantillas?id=${plantillaId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Error al eliminar plantilla')

      alert('Plantilla eliminada exitosamente')
      router.push('/crm/plantillas')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar la plantilla')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <CRMLayout title="Cargando...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Cargando plantilla...</div>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="Editar Plantilla">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Editar Plantilla</h2>
          <p className="text-gray-600 mt-1">
            Modifica los datos de esta plantilla de cotización
          </p>
          {plantilla?.es_base && (
            <p className="text-sm text-purple-600 mt-1 font-semibold">
              📋 Plantilla Base/Maestra
            </p>
          )}
          {plantilla?.clientes && (
            <p className="text-sm text-green-600 mt-1 font-semibold">
              👤 Plantilla de Cliente: {plantilla.clientes.nombre}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gestión de Logo */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Logo de la Plantilla</h3>

            {/* Logo actual */}
            {plantilla?.logo_url && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Logo actual:</p>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-white p-3 rounded-lg shadow-sm">
                    <Image
                      src={plantilla.logo_url}
                      alt="Logo actual"
                      width={200}
                      height={75}
                      className="max-w-full h-auto"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-2">
                      Archivo: {plantilla.logo_filename || 'logo.png'}
                    </p>
                    <Button
                      type="button"
                      onClick={handleRemoveLogo}
                      variant="danger"
                      disabled={saving}
                      className="text-sm"
                    >
                      Eliminar Logo
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Uploader para nuevo logo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {plantilla?.logo_url ? 'Cambiar Logo' : 'Agregar Logo'}
              </label>
              <LogoUploader
                clienteId={plantilla?.cliente_id || undefined}
                plantillaId={parseInt(plantillaId)}
                onUploadSuccess={handleLogoUpload}
                onUploadError={(err) => alert(err)}
              />
              {logoChanged && logoUrl && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-3">
                    Nuevo logo cargado. Haz clic para guardar los cambios.
                  </p>
                  <Button
                    type="button"
                    onClick={handleUpdateLogo}
                    variant="success"
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar Nuevo Logo'}
                  </Button>
                </div>
              )}
            </div>
          </div>

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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activa"
                  checked={formData.activa}
                  onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="activa" className="ml-2 text-sm font-semibold text-gray-700">
                  Plantilla activa
                </label>
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
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={handleEliminar}
              disabled={saving}
              className="!bg-red-50 !text-red-600 hover:!bg-red-100"
            >
              Eliminar Plantilla
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </CRMLayout>
  )
}
