'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  logo_url?: string | null
  logo_filename?: string | null
  cliente_id?: string | null
  es_base?: boolean
  creado_en: string
  actualizado_en: string
  clientes?: {
    id: string
    nombre: string
    empresa: string
  }
}

export default function PlantillasPage() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [filtro, setFiltro] = useState<'todas' | 'base' | 'cliente'>('todas')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    loadPlantillas()
  }, [filtro])

  const loadPlantillas = async () => {
    setLoading(true)
    try {
      const url = filtro === 'todas'
        ? '/api/crm/plantillas'
        : `/api/crm/plantillas?tipo=${filtro}`

      const res = await fetch(url)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  // Separar plantillas
  const plantillasBase = plantillas.filter(p => p.es_base === true)
  const plantillasCliente = plantillas.filter(p => p.es_base === false)

  return (
    <CRMLayout title="Plantillas de Cotización" onRefresh={loadPlantillas}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Plantillas</h2>
          <p className="text-gray-600 mt-1">
            Administra plantillas base y plantillas personalizadas por cliente
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/crm/plantillas/crear-para-cliente">
            <Button variant="secondary">+ Crear para Cliente</Button>
          </Link>
          <Link href="/crm/plantillas/nueva">
            <Button variant="primary">+ Nueva Plantilla Base</Button>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFiltro('todas')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filtro === 'todas'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Todas ({plantillas.length})
        </button>
        <button
          onClick={() => setFiltro('base')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filtro === 'base'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Plantillas Base ({plantillasBase.length})
        </button>
        <button
          onClick={() => setFiltro('cliente')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filtro === 'cliente'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Por Cliente ({plantillasCliente.length})
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Total</div>
          <div className="text-3xl font-bold text-blue-900">{plantillas.length}</div>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-md p-5 border border-purple-200">
          <div className="text-sm font-semibold text-purple-600 mb-1">Base/Maestras</div>
          <div className="text-3xl font-bold text-purple-900">{plantillasBase.length}</div>
        </div>
        <div className="bg-green-50 rounded-xl shadow-md p-5 border border-green-200">
          <div className="text-sm font-semibold text-green-600 mb-1">Por Cliente</div>
          <div className="text-3xl font-bold text-green-900">{plantillasCliente.length}</div>
        </div>
        <div className="bg-orange-50 rounded-xl shadow-md p-5 border border-orange-200">
          <div className="text-sm font-semibold text-orange-600 mb-1">Con Logo</div>
          <div className="text-3xl font-bold text-orange-900">
            {plantillas.filter(p => p.logo_url).length}
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
          <div className="flex gap-3 justify-center mt-4">
            <Link href="/crm/plantillas/nueva">
              <Button variant="primary">Crear Plantilla Base</Button>
            </Link>
            <Link href="/crm/plantillas/crear-para-cliente">
              <Button variant="secondary">Crear para Cliente</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {plantillas.map((plantilla) => {
            const isExpanded = expandedId === plantilla.id
            const total = calcularTotal(plantilla.items_default || [])

            return (
              <div
                key={plantilla.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
              >
                {/* Header de la tarjeta */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {plantilla.nombre}
                        </h3>

                        {/* Badge de tipo */}
                        {plantilla.es_base ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                            Base/Maestra
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            Cliente
                          </span>
                        )}

                        {/* Badge de logo */}
                        {plantilla.logo_url && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            Logo
                          </span>
                        )}
                      </div>

                      {/* Cliente asignado */}
                      {plantilla.clientes && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Cliente:</strong> {plantilla.clientes.nombre}
                          {plantilla.clientes.empresa && ` - ${plantilla.clientes.empresa}`}
                        </p>
                      )}

                      {plantilla.descripcion && (
                        <p className="text-gray-600 mb-3">{plantilla.descripcion}</p>
                      )}

                      {/* Preview del logo */}
                      {plantilla.logo_url && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg inline-block">
                          <Image
                            src={plantilla.logo_url}
                            alt={`Logo ${plantilla.nombre}`}
                            width={200}
                            height={75}
                            className="max-w-full h-auto"
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      )}

                      <div className="flex gap-6 text-sm text-gray-600">
                        <span>
                          <strong>{plantilla.items_default?.length || 0}</strong> items
                        </span>
                        <span>
                          Vigencia: <strong>{plantilla.vigencia_dias_default} días</strong>
                        </span>
                        {plantilla.descuento_default > 0 && (
                          <span>
                            Descuento: <strong>{plantilla.descuento_default}%</strong>
                          </span>
                        )}
                        <span>
                          Total aprox: <strong className="text-blue-600">{formatCurrency(total)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleExpand(plantilla.id)}
                        className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                      >
                        {isExpanded ? 'Ocultar' : 'Ver'} Detalles
                      </button>

                      <Link href={`/crm/plantillas/${plantilla.id}`}>
                        <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                          Editar
                        </button>
                      </Link>

                      {/* Solo permitir eliminar plantillas base o plantillas de cliente (no admin) */}
                      <button
                        onClick={() => eliminarPlantilla(plantilla.id)}
                        className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detalles expandidos */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h4 className="font-bold text-gray-900 mb-3">Items Incluidos:</h4>
                    <div className="space-y-2">
                      {(plantilla.items_default || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.descripcion}</p>
                            <p className="text-sm text-gray-600">
                              Cantidad: {item.cantidad} × {formatCurrency(item.precio)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">
                              {formatCurrency(item.cantidad * item.precio)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {plantilla.notas_default && (
                      <div className="mt-4">
                        <h4 className="font-bold text-gray-900 mb-2">Notas por Defecto:</h4>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-700 whitespace-pre-wrap">{plantilla.notas_default}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Creado: {new Date(plantilla.creado_en).toLocaleDateString('es-CL')}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal:</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
                          {plantilla.descuento_default > 0 && (
                            <p className="text-sm text-green-600">
                              Con {plantilla.descuento_default}% descuento: {formatCurrency(total * (1 - plantilla.descuento_default / 100))}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
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
