'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'

interface Plantilla {
  id: number
  nombre: string
  descripcion?: string
  items_default: Array<{ descripcion: string; cantidad: number; precio: number }>
  notas_default?: string
  vigencia_dias_default: number
  descuento_default: number
  activa: boolean
  creado_en: string
  actualizado_en: string
}

export default function PlantillasPage() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    loadPlantillas()
  }, [])

  const loadPlantillas = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/crm/plantillas')
      const data = await res.json()
      setPlantillas(data.plantillas || [])
    } catch (error) {
      console.error('Error cargando plantillas:', error)
    }
    setLoading(false)
  }

  const eliminarPlantilla = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta plantilla?')) return

    try {
      const res = await fetch(`/api/crm/plantillas?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('Plantilla eliminada correctamente')
        loadPlantillas()
      }
    } catch (error) {
      console.error('Error eliminando plantilla:', error)
      alert('Error al eliminar plantilla')
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const calcularTotal = (items: Array<{ cantidad: number; precio: number }>) => {
    return items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0)
  }

  return (
    <CRMLayout title="Plantillas de Cotización" onRefresh={loadPlantillas}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Plantillas</h2>
          <p className="text-gray-600 mt-1">
            Administra plantillas predefinidas para agilizar la creación de cotizaciones
          </p>
        </div>
        <Link href="/crm/plantillas/nueva">
          <Button variant="primary">+ Nueva Plantilla</Button>
        </Link>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Total Plantillas</div>
          <div className="text-3xl font-bold text-blue-900">{plantillas.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Marketing Digital</div>
          <div className="text-3xl font-bold text-green-600">
            {plantillas.filter(p => p.nombre.includes('Marketing')).length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Desarrollo Web</div>
          <div className="text-3xl font-bold text-purple-600">
            {plantillas.filter(p => p.nombre.includes('Desarrollo') || p.nombre.includes('Web')).length}
          </div>
        </div>
      </div>

      {/* Lista de plantillas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-4">Cargando plantillas...</p>
        </div>
      ) : plantillas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
          <p className="text-gray-600 text-lg">No hay plantillas disponibles</p>
          <Link href="/crm/plantillas/nueva">
            <Button variant="primary" className="mt-4">
              Crear primera plantilla
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {plantillas.map((plantilla) => {
            const isExpanded = expandedId === plantilla.id
            const total = calcularTotal(plantilla.items_default)
            const totalConDescuento = total - (total * plantilla.descuento_default / 100)

            return (
              <div
                key={plantilla.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all"
              >
                {/* Header de la plantilla */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{plantilla.nombre}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {plantilla.items_default.length} items
                        </span>
                      </div>
                      {plantilla.descripcion && (
                        <p className="text-gray-600 text-sm mb-3">{plantilla.descripcion}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Vigencia: {plantilla.vigencia_dias_default} días</span>
                        <span>•</span>
                        <span>Descuento: {plantilla.descuento_default}%</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-900">
                          Total estimado: ${totalConDescuento.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleExpand(plantilla.id)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-semibold"
                      >
                        {isExpanded ? 'Ocultar' : 'Ver detalles'}
                      </button>
                      <Link href={`/crm/plantillas/${plantilla.id}`}>
                        <Button variant="secondary" className="text-sm">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="text-sm"
                        onClick={() => eliminarPlantilla(plantilla.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Detalles expandibles */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">ITEMS INCLUIDOS</h4>
                    <div className="space-y-2 mb-4">
                      {plantilla.items_default.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">{item.descripcion}</p>
                            <p className="text-gray-500 text-sm">Cantidad: {item.cantidad}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 font-semibold">
                              ${(item.cantidad * item.precio).toLocaleString('es-CL')}
                            </p>
                            <p className="text-gray-500 text-sm">
                              ${item.precio.toLocaleString('es-CL')} c/u
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {plantilla.notas_default && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">NOTAS POR DEFECTO</h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-700 text-sm whitespace-pre-line">
                            {plantilla.notas_default}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </CRMLayout>
  )
}
