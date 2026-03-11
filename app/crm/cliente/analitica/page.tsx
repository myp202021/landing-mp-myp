'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'

interface Lead {
  id: number
  contactado: boolean
  vendido: boolean
  monto_vendido?: number
  fecha_ingreso: string
  fuente?: string
}

interface DayData {
  fecha: string
  label: string
  total: number
  contactados: number
  vendidos: number
}

export default function AnaliticaCliente() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [fechaDesde, setFechaDesde] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().split('T')[0]
  })
  const [fechaHasta, setFechaHasta] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [agrupacion, setAgrupacion] = useState<'dia' | 'semana'>('dia')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
      return
    }
    if (user?.role !== 'cliente') {
      router.push('/crm')
      return
    }
    loadData()
  }, [isAuthenticated, user, router])

  const loadData = async () => {
    if (!user?.cliente_id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/leads?limit=500&cliente_id=${user.cliente_id}`)
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Error cargando leads:', error)
    }
    setLoading(false)
  }

  // Agrupar leads por día o semana
  const chartData = useMemo(() => {
    const desde = new Date(fechaDesde + 'T00:00:00')
    const hasta = new Date(fechaHasta + 'T23:59:59')

    const filtered = leads.filter(l => {
      const f = new Date(l.fecha_ingreso)
      return f >= desde && f <= hasta
    })

    if (agrupacion === 'dia') {
      const map: Record<string, DayData> = {}
      // Crear todos los días del rango
      const current = new Date(desde)
      while (current <= hasta) {
        const key = current.toISOString().split('T')[0]
        map[key] = {
          fecha: key,
          label: current.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }),
          total: 0,
          contactados: 0,
          vendidos: 0
        }
        current.setDate(current.getDate() + 1)
      }

      filtered.forEach(lead => {
        const key = new Date(lead.fecha_ingreso).toISOString().split('T')[0]
        if (map[key]) {
          map[key].total++
          if (lead.contactado) map[key].contactados++
          if (lead.vendido) map[key].vendidos++
        }
      })

      return Object.values(map)
    } else {
      // Agrupar por semana
      const map: Record<string, DayData> = {}
      filtered.forEach(lead => {
        const d = new Date(lead.fecha_ingreso)
        const day = d.getDay()
        const monday = new Date(d)
        monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
        const key = monday.toISOString().split('T')[0]

        if (!map[key]) {
          map[key] = {
            fecha: key,
            label: `Sem ${monday.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}`,
            total: 0,
            contactados: 0,
            vendidos: 0
          }
        }
        map[key].total++
        if (lead.contactado) map[key].contactados++
        if (lead.vendido) map[key].vendidos++
      })

      return Object.values(map).sort((a, b) => a.fecha.localeCompare(b.fecha))
    }
  }, [leads, fechaDesde, fechaHasta, agrupacion])

  // Totales del período
  const totals = useMemo(() => {
    const desde = new Date(fechaDesde + 'T00:00:00')
    const hasta = new Date(fechaHasta + 'T23:59:59')
    const filtered = leads.filter(l => {
      const f = new Date(l.fecha_ingreso)
      return f >= desde && f <= hasta
    })
    return {
      total: filtered.length,
      contactados: filtered.filter(l => l.contactado).length,
      vendidos: filtered.filter(l => l.vendido).length,
      montoVendido: filtered.reduce((s, l) => s + Number(l.monto_vendido || 0), 0),
      sinContactar: filtered.filter(l => !l.contactado).length
    }
  }, [leads, fechaDesde, fechaHasta])

  const maxValue = Math.max(...chartData.map(d => d.total), 1)

  if (!isAuthenticated || user?.role !== 'cliente') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <CRMLayout title="Dashboard Cliente - Muller y Perez" authenticated onRefresh={loadData}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Analítica de Leads</h2>
        <p className="text-gray-600 mt-1">Evolución de leads en el tiempo</p>
      </div>

      {/* Filtros */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-6 mb-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">Fecha Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">Fecha Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">Agrupar por</label>
            <select
              value={agrupacion}
              onChange={(e) => setAgrupacion(e.target.value as 'dia' | 'semana')}
              className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="dia">Día</option>
              <option value="semana">Semana</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                const d = new Date()
                d.setDate(d.getDate() - 30)
                setFechaDesde(d.toISOString().split('T')[0])
                setFechaHasta(new Date().toISOString().split('T')[0])
                setAgrupacion('dia')
              }}
              className="w-full px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition font-semibold"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Resumen del período */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-blue-600">{totals.total}</div>
          <div className="text-sm text-gray-600 mt-1">Total Leads</div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-yellow-600">{totals.contactados}</div>
          <div className="text-sm text-gray-600 mt-1">Contactados</div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-green-600">{totals.vendidos}</div>
          <div className="text-sm text-gray-600 mt-1">Vendidos</div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-red-500">{totals.sinContactar}</div>
          <div className="text-sm text-gray-600 mt-1">Sin Contactar</div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-emerald-600">${totals.montoVendido.toLocaleString('es-CL')}</div>
          <div className="text-sm text-gray-600 mt-1">Monto Vendido</div>
        </div>
      </div>

      {/* Tasas */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Tasa de Contacto</div>
            <div className="text-3xl font-bold text-yellow-600">
              {totals.total > 0 ? ((totals.contactados / totals.total) * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-xs text-gray-500 mt-1">{totals.contactados} de {totals.total} leads contactados</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-yellow-200 flex items-center justify-center">
            <span className="text-2xl">📞</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Tasa de Venta</div>
            <div className="text-3xl font-bold text-green-600">
              {totals.total > 0 ? ((totals.vendidos / totals.total) * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-xs text-gray-500 mt-1">{totals.vendidos} de {totals.total} leads vendidos</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-green-200 flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-600">No hay datos en el rango seleccionado</p>
        </div>
      ) : (
        <>
          {/* Gráfico de barras */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Leads por {agrupacion === 'dia' ? 'Día' : 'Semana'}</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span> Total
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-yellow-500 inline-block"></span> Contactados
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-green-500 inline-block"></span> Vendidos
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Eje Y labels */}
                <div className="flex">
                  <div className="w-10 flex flex-col justify-between text-xs text-gray-400 text-right pr-2" style={{ height: '240px' }}>
                    <span>{maxValue}</span>
                    <span>{Math.round(maxValue / 2)}</span>
                    <span>0</span>
                  </div>

                  {/* Barras */}
                  <div className="flex-1 flex items-end gap-1 border-l border-b border-gray-200 pl-2" style={{ height: '240px' }}>
                    {chartData.map((d, i) => {
                      const barWidth = Math.max(100 / chartData.length, 2)
                      const totalH = (d.total / maxValue) * 100
                      const contactH = (d.contactados / maxValue) * 100
                      const vendidoH = (d.vendidos / maxValue) * 100

                      return (
                        <div
                          key={d.fecha}
                          className="flex flex-col items-center justify-end group relative"
                          style={{ width: `${barWidth}%`, height: '100%' }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-lg">
                            <div className="font-semibold mb-1">{d.label}</div>
                            <div>Total: {d.total}</div>
                            <div>Contactados: {d.contactados}</div>
                            <div>Vendidos: {d.vendidos}</div>
                          </div>

                          {/* Barras apiladas lado a lado */}
                          <div className="flex items-end gap-px w-full justify-center" style={{ height: '100%' }}>
                            <div
                              className="bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                              style={{ height: `${totalH}%`, width: '30%', minHeight: d.total > 0 ? '4px' : '0' }}
                            />
                            <div
                              className="bg-yellow-500 rounded-t-sm transition-all duration-300 hover:bg-yellow-600"
                              style={{ height: `${contactH}%`, width: '30%', minHeight: d.contactados > 0 ? '4px' : '0' }}
                            />
                            <div
                              className="bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600"
                              style={{ height: `${vendidoH}%`, width: '30%', minHeight: d.vendidos > 0 ? '4px' : '0' }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Labels eje X */}
                <div className="flex ml-12">
                  {chartData.map((d, i) => {
                    // Mostrar label cada N barras para evitar solapamiento
                    const showLabel = chartData.length <= 15 || i % Math.ceil(chartData.length / 15) === 0
                    return (
                      <div
                        key={d.fecha}
                        className="text-center"
                        style={{ width: `${100 / chartData.length}%` }}
                      >
                        {showLabel && (
                          <span className="text-xs text-gray-500 transform -rotate-45 inline-block mt-2">
                            {d.label}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de datos */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-blue-900 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Detalle por {agrupacion === 'dia' ? 'Día' : 'Semana'}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">{agrupacion === 'dia' ? 'Fecha' : 'Semana'}</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Contactados</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Vendidos</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-blue-900 uppercase">% Contacto</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-blue-900 uppercase">% Conversión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {chartData.filter(d => d.total > 0).reverse().map(d => (
                    <tr key={d.fecha} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{d.label}</td>
                      <td className="px-6 py-3 text-center text-sm font-bold text-blue-600">{d.total}</td>
                      <td className="px-6 py-3 text-center text-sm text-yellow-700">{d.contactados}</td>
                      <td className="px-6 py-3 text-center text-sm text-green-700">{d.vendidos}</td>
                      <td className="px-6 py-3 text-center text-sm text-gray-600">
                        {d.total > 0 ? ((d.contactados / d.total) * 100).toFixed(0) : 0}%
                      </td>
                      <td className="px-6 py-3 text-center text-sm text-gray-600">
                        {d.total > 0 ? ((d.vendidos / d.total) * 100).toFixed(0) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </CRMLayout>
  )
}
