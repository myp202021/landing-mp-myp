'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

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
}

export default function ClientePlantillasPage() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [plantillasBase, setPlantillasBase] = useState<Plantilla[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Redirigir si no es cliente
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
    } else if (user?.role !== 'cliente') {
      router.push('/crm')
    } else {
      loadPlantillas()
    }
  }, [isAuthenticated, user, router])

  const loadPlantillas = async () => {
    if (!user?.cliente_id) return

    setLoading(true)
    try {
      // Cargar plantillas propias del cliente
      const resCliente = await fetch(`/api/crm/plantillas?cliente_id=${user.cliente_id}`)
      const dataCliente = await resCliente.json()
      setPlantillas(dataCliente.plantillas || [])

      // Cargar plantillas base disponibles para clonar
      const resBase = await fetch('/api/crm/plantillas?tipo=base')
      const dataBase = await resBase.json()
      setPlantillasBase(dataBase.plantillas || [])
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
      } else {
        alert('Error al eliminar plantilla')
      }
    } catch (error) {
      console.error('Error eliminando plantilla:', error)
      alert('Error al eliminar plantilla')
    }
  }

  const clonarPlantilla = async (plantillaBase: Plantilla) => {
    if (!user?.cliente_id) return
    if (!confirm(`¿Deseas crear una copia de "${plantillaBase.nombre}" para tu cuenta?`)) return

    try {
      const res = await fetch('/api/crm/plantillas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: `${plantillaBase.nombre} (Copia)`,
          descripcion: plantillaBase.descripcion,
          items_default: plantillaBase.items_default,
          notas_default: plantillaBase.notas_default,
          vigencia_dias_default: plantillaBase.vigencia_dias_default,
          descuento_default: plantillaBase.descuento_default,
          activa: true,
          cliente_id: user.cliente_id,
          es_base: false // IMPORTANTE: nunca es base
        })
      })

      if (res.ok) {
        alert('Plantilla clonada exitosamente. Ahora puedes editarla.')
        loadPlantillas()
      } else {
        alert('Error al clonar plantilla')
      }
    } catch (error) {
      console.error('Error clonando plantilla:', error)
      alert('Error al clonar plantilla')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold">Plantillas de Cotización</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Cargando plantillas...</p>
            </div>
          </div>
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
              <h1 className="text-3xl font-bold">Plantillas de Cotización</h1>
              <p className="text-blue-200 mt-1">Sistema de Gestión de Clientes · M&P Marketing y Performance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadPlantillas}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
              <button
                onClick={() => router.push('/crm/login')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <Link
              href="/crm/cliente/dashboard"
              className="flex items-center gap-2 px-4 py-4 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/crm/cliente/cotizaciones"
              className="flex items-center gap-2 px-4 py-4 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Cotizaciones
            </Link>
            <div className="flex items-center gap-2 px-4 py-4 text-blue-600 font-semibold border-b-2 border-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Plantillas
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con botón de nueva plantilla */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Plantillas</h2>
            <p className="text-gray-600 mt-1">
              Gestiona tus plantillas personalizadas de cotización
            </p>
          </div>
          <Link href="/crm/cliente/plantillas/nueva">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md">
              + Nueva Plantilla
            </button>
          </Link>
        </div>

        {/* Card de información sobre logos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Especificaciones del Logo</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Formatos aceptados:</strong> PNG, JPG, JPEG, WebP</li>
            <li>• <strong>Tamaño máximo:</strong> 512 KB</li>
            <li>• <strong>Dimensiones recomendadas:</strong> 200x200 píxeles (cuadrado)</li>
            <li>• <strong>Fondo:</strong> Preferiblemente transparente (PNG)</li>
          </ul>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <div className="text-sm font-semibold text-gray-600 mb-1">Mis Plantillas</div>
            <div className="text-3xl font-bold text-blue-900">{plantillas.length}</div>
          </div>
          <div className="bg-purple-50 rounded-xl shadow-md p-5 border border-purple-200">
            <div className="text-sm font-semibold text-purple-600 mb-1">Plantillas Base Disponibles</div>
            <div className="text-3xl font-bold text-purple-900">{plantillasBase.length}</div>
          </div>
          <div className="bg-orange-50 rounded-xl shadow-md p-5 border border-orange-200">
            <div className="text-sm font-semibold text-orange-600 mb-1">Con Logo</div>
            <div className="text-3xl font-bold text-orange-900">
              {plantillas.filter(p => p.logo_url).length}
            </div>
          </div>
        </div>

        {/* Mis Plantillas */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Mis Plantillas Personalizadas</h3>
          {plantillas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
              <p className="text-gray-600 text-lg">No tienes plantillas personalizadas aún</p>
              <div className="flex gap-3 justify-center mt-4">
                <Link href="/crm/cliente/plantillas/nueva">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    Crear Nueva Plantilla
                  </button>
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
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {plantilla.nombre}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                              Mi Plantilla
                            </span>
                            {plantilla.logo_url && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                Logo
                              </span>
                            )}
                          </div>

                          {plantilla.descripcion && (
                            <p className="text-gray-600 mb-3">{plantilla.descripcion}</p>
                          )}

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

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => toggleExpand(plantilla.id)}
                            className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                          >
                            {isExpanded ? 'Ocultar' : 'Ver'} Detalles
                          </button>

                          <Link href={`/crm/cliente/plantillas/${plantilla.id}`}>
                            <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                              Editar
                            </button>
                          </Link>

                          <button
                            onClick={() => eliminarPlantilla(plantilla.id)}
                            className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>

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
        </div>

        {/* Plantillas Base Disponibles */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Plantillas Base Disponibles</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Estas son plantillas creadas por M&P que puedes clonar y personalizar
          </p>
          {plantillasBase.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
              <p className="text-gray-600">No hay plantillas base disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plantillasBase.map((plantilla) => {
                const isExpanded = expandedId === plantilla.id
                const total = calcularTotal(plantilla.items_default || [])

                return (
                  <div
                    key={plantilla.id}
                    className="bg-white rounded-xl shadow-md border border-purple-200 overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {plantilla.nombre}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                              Plantilla Base
                            </span>
                            {plantilla.logo_url && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                Logo
                              </span>
                            )}
                          </div>

                          {plantilla.descripcion && (
                            <p className="text-gray-600 mb-3">{plantilla.descripcion}</p>
                          )}

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

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => toggleExpand(plantilla.id)}
                            className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                          >
                            {isExpanded ? 'Ocultar' : 'Ver'} Detalles
                          </button>

                          <button
                            onClick={() => clonarPlantilla(plantilla)}
                            className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium"
                          >
                            Clonar Plantilla
                          </button>
                        </div>
                      </div>
                    </div>

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
        </div>
      </div>
    </div>
  )
}
