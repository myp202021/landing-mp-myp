'use client'

/**
 * PÁGINA DE MÉTRICAS
 * Análisis de performance: ROAS, CPL, tasa de conversión, etc.
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Cliente {
  id: string
  nombre: string
  rubro: string | null
  inversion_mensual: number
}

interface Metricas {
  total_leads: number
  leads_contactados: number
  leads_vendidos: number
  total_ventas: number
  inversion: number
  // Calculadas
  cpl: number // Costo por lead
  cpa: number // Costo por adquisición (venta)
  roas: number // Return on ad spend
  conversion_rate: number // % de leads que se convierten en venta
  contact_rate: number // % de leads contactados
}

export default function MetricasPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [metricas, setMetricas] = useState<Metricas | null>(null)
  const [loading, setLoading] = useState(false)
  const [editingInversion, setEditingInversion] = useState(false)
  const [nuevaInversion, setNuevaInversion] = useState('')

  useEffect(() => {
    fetchClientes()
  }, [])

  useEffect(() => {
    if (selectedCliente) {
      fetchMetricas()
    }
  }, [selectedCliente])

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/crm/clientes')
      const data = await res.json()
      setClientes(data.clientes || [])

      // Seleccionar primer cliente automáticamente
      if (data.clientes && data.clientes.length > 0) {
        setSelectedCliente(data.clientes[0].id)
      }
    } catch (error) {
      console.error('Error fetching clientes:', error)
    }
  }

  const fetchMetricas = async () => {
    if (!selectedCliente) return

    setLoading(true)
    try {
      const res = await fetch(`/api/crm/metricas?cliente_id=${selectedCliente}`)
      const data = await res.json()
      setMetricas(data.metricas)

      // Actualizar inversión en el input
      const cliente = clientes.find(c => c.id === selectedCliente)
      setNuevaInversion(cliente?.inversion_mensual?.toString() || '0')
    } catch (error) {
      console.error('Error fetching metricas:', error)
    } finally {
      setLoading(false)
    }
  }

  const debugCliente = async () => {
    if (!selectedCliente) return

    try {
      const res = await fetch(`/api/crm/debug-cliente?id=${selectedCliente}`)
      const data = await res.json()
      console.log('🔍 DEBUG COMPLETO:', data)
      alert(`Debug en consola. Inversión en BD: ${data.tipos?.inversion_mensual_value}`)
    } catch (error) {
      console.error('Error en debug:', error)
    }
  }

  const updateInversion = async () => {
    if (!selectedCliente) return

    const valor = parseFloat(nuevaInversion) || 0
    console.log('🔄 Actualizando inversión:', {
      cliente_id: selectedCliente,
      valor
    })

    try {
      const res = await fetch('/api/crm/clientes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCliente,
          inversion_mensual: valor
        })
      })

      const data = await res.json()
      console.log('✅ Respuesta del servidor:', data)

      if (res.ok) {
        setEditingInversion(false)

        // Verificar que la inversión se actualizó correctamente
        const inversionActualizada = data.cliente?.inversion_mensual
        console.log('💰 Inversión en respuesta:', inversionActualizada)

        if (parseFloat(inversionActualizada) === valor) {
          alert(`✅ Inversión actualizada a ${formatCurrency(valor)}`)

          // Esperar 1 segundo para que Supabase replique
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Recargar datos
          await fetchClientes()
          await fetchMetricas()

          console.log('🔄 Datos recargados')
        } else {
          alert(`⚠️ La inversión se guardó pero hay un problema de sincronización. Recarga la página.`)
        }
      } else {
        alert(`❌ Error: ${data.error || 'No se pudo actualizar'}`)
      }
    } catch (error) {
      console.error('❌ Error updating inversion:', error)
      alert('❌ Error de conexión')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const clienteActual = clientes.find(c => c.id === selectedCliente)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Métricas de Performance</h1>
            <p className="text-gray-600">Análisis de retorno de inversión y eficiencia</p>
          </div>

          {/* Selector de Cliente */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Cliente
            </label>
            <select
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.rubro ? `(${c.rubro})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Inversión */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Inversión Mensual</h3>
            {!editingInversion ? (
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(clienteActual?.inversion_mensual || 0)}
                </p>
                <button
                  onClick={() => {
                    console.log('Click en Editar')
                    setEditingInversion(true)
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={debugCliente}
                  className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm font-medium"
                >
                  🔍 Debug
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Nueva inversión mensual</label>
                  <input
                    type="number"
                    value={nuevaInversion}
                    onChange={(e) => setNuevaInversion(e.target.value)}
                    className="border-2 border-blue-300 rounded px-3 py-2 w-48 focus:outline-none focus:border-blue-500"
                    placeholder="Ej: 600000"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={updateInversion}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                  >
                    ✓ Guardar
                  </button>
                  <button
                    onClick={() => setEditingInversion(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm font-medium"
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Cargando métricas...</div>
            </div>
          ) : metricas ? (
            <>
              {/* KPIs Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* ROAS */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
                  <div className="text-sm font-semibold text-green-700 mb-1">ROAS</div>
                  <div className="text-3xl font-bold text-green-600">
                    {metricas.roas.toFixed(2)}x
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Return on Ad Spend
                  </div>
                </div>

                {/* CPL */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                  <div className="text-sm font-semibold text-blue-700 mb-1">CPL</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(metricas.cpl)}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Costo por Lead
                  </div>
                </div>

                {/* CPA */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
                  <div className="text-sm font-semibold text-purple-700 mb-1">CPA</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {formatCurrency(metricas.cpa)}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Costo por Adquisición
                  </div>
                </div>

                {/* Conversión */}
                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
                  <div className="text-sm font-semibold text-orange-700 mb-1">Conversión</div>
                  <div className="text-3xl font-bold text-orange-600">
                    {formatPercent(metricas.conversion_rate)}
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    Tasa de Conversión
                  </div>
                </div>
              </div>

              {/* Métricas Detalladas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Embudo de Conversión */}
                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Embudo de Conversión</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Leads</span>
                      <span className="font-bold text-gray-900">{metricas.total_leads}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Contactados</span>
                      <span className="font-bold text-gray-900">
                        {metricas.leads_contactados} ({formatPercent(metricas.contact_rate)})
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${metricas.contact_rate}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Vendidos</span>
                      <span className="font-bold text-gray-900">
                        {metricas.leads_vendidos} ({formatPercent(metricas.conversion_rate)})
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${metricas.conversion_rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Resumen Financiero */}
                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Inversión</span>
                      <span className="font-bold text-red-600">
                        - {formatCurrency(metricas.inversion)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Ventas Totales</span>
                      <span className="font-bold text-green-600">
                        + {formatCurrency(metricas.total_ventas)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-gray-50 rounded px-3">
                      <span className="text-gray-900 font-semibold">ROI Neto</span>
                      <span className={`font-bold text-xl ${
                        metricas.total_ventas - metricas.inversion >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {formatCurrency(metricas.total_ventas - metricas.inversion)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicadores de Salud */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Indicadores de Salud</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{metricas.roas >= 3 ? '✅' : metricas.roas >= 2 ? '⚠️' : '❌'}</span>
                    <div>
                      <div className="font-semibold text-gray-900">ROAS</div>
                      <div className="text-sm text-gray-600">
                        {metricas.roas >= 3 ? 'Excelente' : metricas.roas >= 2 ? 'Aceptable' : 'Bajo'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{metricas.conversion_rate >= 2 ? '✅' : metricas.conversion_rate >= 1 ? '⚠️' : '❌'}</span>
                    <div>
                      <div className="font-semibold text-gray-900">Conversión</div>
                      <div className="text-sm text-gray-600">
                        {metricas.conversion_rate >= 2 ? 'Excelente' : metricas.conversion_rate >= 1 ? 'Aceptable' : 'Bajo'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{metricas.contact_rate >= 70 ? '✅' : metricas.contact_rate >= 50 ? '⚠️' : '❌'}</span>
                    <div>
                      <div className="font-semibold text-gray-900">Contacto</div>
                      <div className="text-sm text-gray-600">
                        {metricas.contact_rate >= 70 ? 'Excelente' : metricas.contact_rate >= 50 ? 'Aceptable' : 'Bajo'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Selecciona un cliente para ver las métricas
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
