'use client'

import { useState, useEffect } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import MetricCard from '@/app/components/crm/MetricCard'

interface Cliente {
  id: string
  nombre: string
  activo: boolean
  inversion_mensual?: number
  rubro?: string
  creado_en: string
}

interface Lead {
  id: number
  cliente_id: string
  contactado: boolean
  vendido: boolean
  monto_vendido?: number
  fecha_ingreso: string
  clientes?: {
    nombre: string
  }
}

interface Cotizacion {
  id: number
  cliente_id: string
  nombre_proyecto: string
  cliente_nombre?: string
  total: number
  estado: string
  creado_en: string
  clientes?: {
    nombre: string
  }
}

interface MonthlyRevenue {
  label: string
  total: number
}

export default function DashboardMYPPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [resClientes, resLeads, resCotizaciones] = await Promise.all([
        fetch('/api/crm/clientes'),
        fetch('/api/crm/leads?limit=1000'),
        fetch('/api/crm/cotizaciones')
      ])

      const dataClientes = await resClientes.json()
      const dataLeads = await resLeads.json()
      const dataCotizaciones = await resCotizaciones.json()

      setClientes(dataClientes.clientes || [])
      setLeads(dataLeads.leads || [])
      setCotizaciones(dataCotizaciones.cotizaciones || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  // --- KPIs ---
  const clientesActivos = clientes.filter(c => c.activo)
  const totalClientesActivos = clientesActivos.length

  const revenueMensual = clientesActivos.reduce(
    (sum, c) => sum + (c.inversion_mensual || 0),
    0
  )

  const now = new Date()
  const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const cotizacionesEsteMes = cotizaciones.filter(c => {
    const fecha = c.creado_en?.slice(0, 7)
    return fecha === mesActual
  })

  const leadsEsteMes = leads.filter(l => {
    const fecha = l.fecha_ingreso?.slice(0, 7)
    return fecha === mesActual
  })

  // --- Revenue chart: last 6 months ---
  const getMonthlyRevenue = (): MonthlyRevenue[] => {
    const months: MonthlyRevenue[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })
      // For simplicity we use current active clients * fee as estimate per month
      // A more precise approach would track historical active status, but we use
      // what's available.
      months.push({ label, total: revenueMensual })
    }
    return months
  }

  const monthlyRevenue = getMonthlyRevenue()
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.total), 1)

  // --- Top 10 clients by fee ---
  const topClients = [...clientes]
    .sort((a, b) => (b.inversion_mensual || 0) - (a.inversion_mensual || 0))
    .slice(0, 10)

  // --- Recent cotizaciones ---
  const recentCotizaciones = [...cotizaciones]
    .sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())
    .slice(0, 10)

  // --- Recent leads ---
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.fecha_ingreso).getTime() - new Date(a.fecha_ingreso).getTime())
    .slice(0, 10)

  // --- Estado badge ---
  const getEstadoBadge = (estado: string) => {
    const map: Record<string, string> = {
      borrador: 'bg-gray-100 text-gray-700 border-gray-300',
      enviada: 'bg-blue-100 text-blue-700 border-blue-300',
      aceptada: 'bg-green-100 text-green-700 border-green-300',
      rechazada: 'bg-red-100 text-red-700 border-red-300',
    }
    return map[estado] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  if (loading) {
    return (
      <CRMLayout title="Dashboard M&P">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-4">Cargando dashboard...</p>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="Dashboard M&P" onRefresh={loadData}>
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Clientes Activos"
          value={totalClientesActivos}
          subtitle={`de ${clientes.length} totales`}
          icon="👥"
          color="blue"
        />
        <MetricCard
          title="Revenue Mensual Estimado"
          value={`$${revenueMensual.toLocaleString('es-CL')}`}
          subtitle="Suma fees activos"
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Cotizaciones Este Mes"
          value={cotizacionesEsteMes.length}
          subtitle={`${cotizaciones.length} totales`}
          icon="📄"
          color="purple"
        />
        <MetricCard
          title="Leads Este Mes"
          value={leadsEsteMes.length}
          subtitle={`${leads.length} totales`}
          icon="📊"
          color="orange"
        />
      </div>

      {/* Row 2: Revenue Chart (CSS bars) */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Mensual Estimado (Ultimos 6 Meses)</h2>
        <div className="flex items-end gap-3 h-48">
          {monthlyRevenue.map((m, i) => {
            const pct = maxRevenue > 0 ? (m.total / maxRevenue) * 100 : 0
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  ${m.total.toLocaleString('es-CL')}
                </div>
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500"
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
                <div className="text-[10px] text-gray-500 mt-2 text-center leading-tight">
                  {m.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Row 3: Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Top 10 clients by fee */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Top 10 Clientes por Fee</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Fee Mensual</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topClients.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500 font-medium">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{c.nombre}</div>
                      {c.rubro && <div className="text-xs text-gray-500">{c.rubro}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                      ${(c.inversion_mensual || 0).toLocaleString('es-CL')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full border ${
                        c.activo
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}>
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
                {topClients.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                      Sin clientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent cotizaciones */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Ultimas 10 Cotizaciones</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Proyecto</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentCotizaciones.map(cot => (
                  <tr key={cot.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {cot.nombre_proyecto || '-'}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {cot.clientes?.nombre || cot.cliente_nombre || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                      ${Number(cot.total).toLocaleString('es-CL')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full border ${getEstadoBadge(cot.estado)}`}>
                        {cot.estado.charAt(0).toUpperCase() + cot.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 text-right whitespace-nowrap">
                      {new Date(cot.creado_en).toLocaleDateString('es-CL')}
                    </td>
                  </tr>
                ))}
                {recentCotizaciones.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                      Sin cotizaciones registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4: Recent leads */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-orange-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Ultimos 10 Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Contactado</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Vendido</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {lead.clientes?.nombre || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(lead.fecha_ingreso).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      lead.contactado ? 'bg-green-500' : 'bg-gray-300'
                    }`} title={lead.contactado ? 'Si' : 'No'} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      lead.vendido ? 'bg-green-500' : 'bg-gray-300'
                    }`} title={lead.vendido ? 'Si' : 'No'} />
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                    {lead.monto_vendido
                      ? `$${Number(lead.monto_vendido).toLocaleString('es-CL')}`
                      : '-'}
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                    Sin leads registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CRMLayout>
  )
}
