'use client'

/**
 * CREAR PLANTILLA PARA CLIENTE
 * Permite al admin clonar una plantilla base y personalizarla para un cliente
 * con logo personalizado
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LogoUploader from '@/app/components/crm/LogoUploader'

interface PlantillaBase {
  id: number
  nombre: string
  descripcion: string
  items_default: Array<{ descripcion: string; cantidad: number; precio: number }>
}

interface Cliente {
  id: string
  nombre: string
  empresa: string
}

export default function CrearPlantillaParaClientePage() {
  const router = useRouter()
  const [plantillasBase, setPlantillasBase] = useState<PlantillaBase[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Form state
  const [selectedPlantillaId, setSelectedPlantillaId] = useState<number | null>(null)
  const [selectedClienteId, setSelectedClienteId] = useState<string>('')
  const [nombrePersonalizado, setNombrePersonalizado] = useState('')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [logoFilename, setLogoFilename] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Cargar plantillas base
      const plantillasRes = await fetch('/api/crm/plantillas?tipo=base')
      const plantillasData = await plantillasRes.json()
      setPlantillasBase(plantillasData.plantillas || [])

      // Cargar clientes
      const clientesRes = await fetch('/api/crm/clientes')
      const clientesData = await clientesRes.json()
      setClientes(clientesData.clientes || [])
    } catch (err: any) {
      console.error('Error cargando datos:', err)
      setError('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = (url: string, filename: string) => {
    setLogoUrl(url)
    setLogoFilename(filename)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Validaciones
    if (!selectedPlantillaId) {
      setError('Debes seleccionar una plantilla base')
      setSubmitting(false)
      return
    }

    if (!selectedClienteId) {
      setError('Debes seleccionar un cliente')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/crm/plantillas/clonar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantilla_base_id: selectedPlantillaId,
          cliente_id: selectedClienteId,
          nombre_personalizado: nombrePersonalizado || null,
          logo_url: logoUrl || null,
          logo_filename: logoFilename || null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear plantilla')
      }

      setSuccess(true)

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/crm/plantillas')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const selectedPlantilla = plantillasBase.find(p => p.id === selectedPlantillaId)
  const selectedCliente = clientes.find(c => c.id === selectedClienteId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Plantilla Creada y Asignada
          </h2>
          <p className="text-gray-600">
            La plantilla ha sido clonada y asignada al cliente correctamente.
            Redirigiendo...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-semibold mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Crear Plantilla para Cliente
          </h1>
          <p className="text-gray-600 mt-2">
            Clona una plantilla base y personalizala con el logo del cliente
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Paso 1: Seleccionar Plantilla Base */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              1. Selecciona Plantilla Base
            </h2>

            <div className="space-y-3">
              {plantillasBase.map((plantilla) => (
                <label
                  key={plantilla.id}
                  className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                    selectedPlantillaId === plantilla.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="plantilla_base"
                      value={plantilla.id}
                      checked={selectedPlantillaId === plantilla.id}
                      onChange={() => setSelectedPlantillaId(plantilla.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{plantilla.nombre}</h3>
                      {plantilla.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{plantilla.descripcion}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {plantilla.items_default?.length || 0} items incluidos
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {plantillasBase.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No hay plantillas base disponibles
              </p>
            )}
          </div>

          {/* Paso 2: Seleccionar Cliente */}
          {selectedPlantillaId && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                2. Selecciona Cliente
              </h2>

              <select
                value={selectedClienteId}
                onChange={(e) => setSelectedClienteId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition text-gray-900"
                required
              >
                <option value="">Selecciona un cliente...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.empresa ? `- ${cliente.empresa}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Paso 3: Personalizar */}
          {selectedPlantillaId && selectedClienteId && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                3. Personalizar Plantilla
              </h2>

              {/* Nombre personalizado (opcional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la plantilla (opcional)
                </label>
                <input
                  type="text"
                  value={nombrePersonalizado}
                  onChange={(e) => setNombrePersonalizado(e.target.value)}
                  placeholder={`${selectedPlantilla?.nombre} - ${selectedCliente?.nombre}`}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Deja vacío para usar el nombre automático
                </p>
              </div>

              {/* Upload de logo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo del Cliente (opcional pero recomendado)
                </label>
                <LogoUploader
                  clienteId={selectedClienteId}
                  onUploadSuccess={handleLogoUpload}
                  onUploadError={(err) => setError(err)}
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Botones */}
          {selectedPlantillaId && selectedClienteId && (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={submitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Plantilla para Cliente'
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
