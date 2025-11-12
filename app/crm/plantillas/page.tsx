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
  const [previewPlantilla, setPreviewPlantilla] = useState<Plantilla | null>(null)

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

  const inicializarPlantillasPredefinidas = async () => {
    if (!confirm('¿Crear plantillas Silver, Gold y Platinum M&P predefinidas?')) return

    setLoading(true)
    try {
      const res = await fetch('/api/crm/plantillas/inicializar', {
        method: 'POST'
      })
      const data = await res.json()

      if (res.ok) {
        alert(data.message || 'Plantillas predefinidas creadas exitosamente')
        loadPlantillas()
      } else {
        alert(data.error || data.message || 'Error al crear plantillas')
      }
    } catch (error) {
      console.error('Error inicializando plantillas:', error)
      alert('Error al crear plantillas predefinidas')
    } finally {
      setLoading(false)
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
        <div className="flex gap-3">
          <Button variant="secondary" onClick={inicializarPlantillasPredefinidas}>
            Crear Planes M&P (Silver/Gold/Platinum)
          </Button>
          <Link href="/crm/plantillas/nueva">
            <Button variant="primary">+ Nueva Plantilla</Button>
          </Link>
        </div>
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
                        onClick={() => setPreviewPlantilla(plantilla)}
                        className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition text-sm font-semibold"
                      >
                        Vista Previa
                      </button>
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

      {/* Modal de Vista Previa - MEJORADO */}
      {previewPlantilla && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8 mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del modal - FIJO */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold truncate mr-4">Vista Previa: {previewPlantilla.nombre}</h2>
                <button
                  onClick={() => setPreviewPlantilla(null)}
                  className="text-white hover:text-gray-200 text-3xl font-bold leading-none flex-shrink-0"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenido del preview estilo cotización - CON SCROLL */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              {/* Encabezado de la cotización */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 md:p-8 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="flex items-start gap-4">
                    <img src="/logo-myp.png" alt="M&P Logo" className="h-14 w-14 md:h-16 md:w-16 object-contain flex-shrink-0" />
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">COTIZACIÓN</h3>
                      <p className="text-blue-200 text-sm md:text-base">Müller y Pérez</p>
                      <p className="text-blue-200 text-xs md:text-sm">Agencia de Marketing Digital</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-sm text-blue-200 mb-1">Proyecto</div>
                    <div className="text-xl md:text-2xl font-bold break-words">{previewPlantilla.nombre}</div>
                    <div className="text-sm text-blue-200 mt-4">
                      Vigencia: {previewPlantilla.vigencia_dias_default} días
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del proyecto */}
              {previewPlantilla.descripcion && (
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-6 border-l-4 border-blue-500">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">DESCRIPCIÓN</h4>
                  <p className="text-gray-700 text-sm md:text-base break-words">{previewPlantilla.descripcion}</p>
                </div>
              )}

              {/* Tabla de items - RESPONSIVE */}
              <div className="mb-6">
                <h4 className="text-base md:text-lg font-bold text-gray-900 mb-4">DETALLE DE SERVICIOS</h4>
                <div className="overflow-x-auto -mx-2 md:mx-0">
                  <div className="inline-block min-w-full align-middle px-2 md:px-0">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          <th className="px-3 md:px-4 py-3 text-left font-semibold text-sm md:text-base">Descripción</th>
                          <th className="px-3 md:px-4 py-3 text-center font-semibold text-sm md:text-base whitespace-nowrap">Cant.</th>
                          <th className="px-3 md:px-4 py-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">Precio Unit.</th>
                          <th className="px-3 md:px-4 py-3 text-right font-semibold text-sm md:text-base">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewPlantilla.items_default.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-3 md:px-4 py-3 border-t border-gray-200 text-gray-900 text-sm break-words max-w-xs">{item.descripcion}</td>
                            <td className="px-3 md:px-4 py-3 border-t border-gray-200 text-center text-gray-900 text-sm whitespace-nowrap">{item.cantidad}</td>
                            <td className="px-3 md:px-4 py-3 border-t border-gray-200 text-right text-gray-900 text-sm whitespace-nowrap">
                              ${item.precio.toLocaleString('es-CL')}
                            </td>
                            <td className="px-3 md:px-4 py-3 border-t border-gray-200 text-right font-semibold text-gray-900 text-sm whitespace-nowrap">
                              ${(item.cantidad * item.precio).toLocaleString('es-CL')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Totales - RESPONSIVE */}
              <div className="flex justify-end mb-6">
                <div className="w-full md:w-96">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700 text-sm md:text-base">Subtotal:</span>
                    <span className="font-semibold text-gray-900 text-sm md:text-base">
                      ${calcularTotal(previewPlantilla.items_default).toLocaleString('es-CL')}
                    </span>
                  </div>
                  {previewPlantilla.descuento_default > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-700 text-sm md:text-base">Descuento ({previewPlantilla.descuento_default}%):</span>
                      <span className="text-red-600 font-semibold text-sm md:text-base">
                        -${((calcularTotal(previewPlantilla.items_default) * previewPlantilla.descuento_default) / 100).toLocaleString('es-CL')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg mt-2">
                    <span className="text-base md:text-lg font-bold text-blue-900">TOTAL:</span>
                    <span className="text-base md:text-lg font-bold text-blue-900">
                      ${(calcularTotal(previewPlantilla.items_default) - (calcularTotal(previewPlantilla.items_default) * previewPlantilla.descuento_default / 100)).toLocaleString('es-CL')} CLP
                    </span>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {previewPlantilla.notas_default && (
                <div className="bg-yellow-50 p-4 md:p-6 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">NOTAS ADICIONALES</h4>
                  <p className="text-gray-700 text-xs md:text-sm whitespace-pre-line break-words">{previewPlantilla.notas_default}</p>
                </div>
              )}
            </div>

            {/* Footer del modal - FIJO */}
            <div className="bg-gray-100 p-4 md:p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setPreviewPlantilla(null)}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg"
              >
                Cerrar Vista Previa
              </button>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  )
}
