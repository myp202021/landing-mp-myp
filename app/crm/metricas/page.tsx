'use client'

import { useState, useEffect } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import MetricCard from '@/app/components/crm/MetricCard'

interface Lead {
  id: number
  cliente_id: string
  contactado: boolean
  vendido: boolean
  monto_vendido?: number
  fecha_ingreso: string
  costo_publicidad?: number
  clientes?: {
    nombre: string
  }
}

interface Cotizacion {
  id: number
  cliente_id: string
  total: number
  estado: string
  creado_en: string
  clientes?: {
    nombre: string
  }
}

interface MetricasPorMes {
  mes: string
  leads: number
  contactados: number
  vendidos: number
  monto: number
}

interface ClienteMetricas {
  nombre: string
  leads: number
  vendidos: number
  monto: number
  tasaConversion: number
}

export default function MetricasPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [resLeads, resCotizaciones] = await Promise.all([
        fetch('/api/crm/leads?limit=1000'),
        fetch('/api/crm/cotizaciones')
      ])

      const dataLeads = await resLeads.json()
      const dataCotizaciones = await resCotizaciones.json()

      setLeads(dataLeads.leads || [])
      setCotizaciones(dataCotizaciones.cotizaciones || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  // Metricas generales
  const totalLeads = leads.length
  const leadsContactados = leads.filter(l => l.contactado).length
  const leadsVendidos = leads.filter(l => l.vendido).length
  const tasaConversion = totalLeads > 0 ? ((leadsVendidos / totalLeads) * 100).toFixed(1) : '0'
  const totalVendido = leads.reduce((sum, l) => sum + (l.monto_vendido || 0), 0)

  // Calcular metricas ROAS
  const costoPorLeadGlobal = typeof window !== 'undefined'
    ? Number(localStorage.getItem('costoPorLeadGlobal') || 5000)
    : 5000

  const costoTotalPublicidad = leads.reduce((sum, lead) =>
    sum + (lead.costo_publicidad || costoPorLeadGlobal), 0
  )

  const ventasTotales = leads.reduce((sum, lead) =>
    sum + (lead.vendido ? (lead.monto_vendido || 0) : 0), 0
  )

  const roas = costoTotalPublicidad > 0
    ? (ventasTotales / costoTotalPublicidad)
    : 0

  const costoPorLeadReal = leads.length > 0
    ? costoTotalPublicidad / leads.length
    : 0

  const costoPorLeadContactado = leadsContactados > 0
    ? leads.filter(l => l.contactado).reduce((sum, l) => sum + (l.costo_publicidad || costoPorLeadGlobal), 0) / leadsContactados
    : 0

  const costoPorVenta = leadsVendidos > 0
    ? leads.filter(l => l.vendido).reduce((sum, l) => sum + (l.costo_publicidad || costoPorLeadGlobal), 0) / leadsVendidos
    : 0

  const cotizacionesEnviadas = cotizaciones.filter(c => c.estado === 'enviada').length
  const cotizacionesAceptadas = cotizaciones.filter(c => c.estado === 'aceptada').length
  const tasaAceptacion = cotizacionesEnviadas > 0
    ? ((cotizacionesAceptadas / cotizacionesEnviadas) * 100).toFixed(1)
    : '0'

  // Metricas por mes (ultimos 6 meses)
  const getMetricasPorMes = (): MetricasPorMes[] => {
    const meses: { [key: string]: MetricasPorMes } = {}
    const hoy = new Date()

    // Inicializar ultimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      const mesNombre = fecha.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })

      meses[mesKey] = {
        mes: mesNombre,
        leads: 0,
        contactados: 0,
        vendidos: 0,
        monto: 0
      }
    }

    // Contar leads por mes
    leads.forEach(lead => {
      const fecha = new Date(lead.fecha_ingreso)
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`

      if (meses[mesKey]) {
        meses[mesKey].leads++
        if (lead.contactado) meses[mesKey].contactados++
        if (lead.vendido) {
          meses[mesKey].vendidos++
          meses[mesKey].monto += lead.monto_vendido || 0
        }
      }
    })

    return Object.values(meses)
  }

  // Top clientes
  const getTopClientes = (): ClienteMetricas[] => {
    const clientesMap: { [key: string]: ClienteMetricas } = {}

    leads.forEach(lead => {
      const clienteNombre = lead.clientes?.nombre || 'Sin cliente'

      if (!clientesMap[clienteNombre]) {
        clientesMap[clienteNombre] = {
          nombre: clienteNombre,
          leads: 0,
          vendidos: 0,
          monto: 0,
          tasaConversion: 0
        }
      }

      clientesMap[clienteNombre].leads++
      if (lead.vendido) {
        clientesMap[clienteNombre].vendidos++
        clientesMap[clienteNombre].monto += lead.monto_vendido || 0
      }
    })

    // Calcular tasa de conversion
    Object.values(clientesMap).forEach(cliente => {
      cliente.tasaConversion = cliente.leads > 0
        ? (cliente.vendidos / cliente.leads) * 100
        : 0
    })

    // Ordenar por monto vendido
    return Object.values(clientesMap)
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5)
  }

  const metricasPorMes = getMetricasPorMes()
  const topClientes = getTopClientes()

  // Calcular valor promedio por venta
  const valorPromedioVenta = leadsVendidos > 0
    ? Math.round(totalVendido / leadsVendidos)
    : 0

  if (loading) {
    return (
      <CRMLayout title="Metricas y Analytics">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-4">Cargando metricas...</p>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="Metricas y Analytics" onRefresh={loadData}>
      {/* Metricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Leads"
          value={totalLeads}
          subtitle="Todos los registros"
          icon="📊"
          color="blue"
        />
        <MetricCard
          title="Tasa de Conversion"
          value={`${tasaConversion}%`}
          subtitle={`${leadsVendidos} de ${totalLeads} vendidos`}
          icon="📈"
          color="green"
        />
        <MetricCard
          title="Total Vendido"
          value={`$${totalVendido.toLocaleString('es-CL')}`}
          subtitle="Ingresos totales"
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Ticket Promedio"
          value={`$${valorPromedioVenta.toLocaleString('es-CL')}`}
          subtitle="Por venta"
          icon="💳"
          color="purple"
        />
      </div>

      {/* Metricas ROAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <MetricCard
          title="ROAS (Return on Ad Spend)"
          value={`${roas.toFixed(2)}x`}
          subtitle="Retorno de inversion"
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Inversion Publicitaria"
          value={`$${costoTotalPublicidad.toLocaleString('es-CL')}`}
          subtitle="Costo total"
          icon="💵"
          color="blue"
        />
        <MetricCard
          title="Costo por Lead"
          value={`$${Math.round(costoPorLeadReal).toLocaleString('es-CL')}`}
          subtitle="Promedio"
          icon="📊"
          color="orange"
        />
        <MetricCard
          title="Costo por Contactado"
          value={`$${Math.round(costoPorLeadContactado).toLocaleString('es-CL')}`}
          subtitle="Por lead contactado"
          icon="📞"
          color="purple"
        />
        <MetricCard
          title="Costo por Venta"
          value={`$${Math.round(costoPorVenta).toLocaleString('es-CL')}`}
          subtitle="CAC real"
          icon="✅"
          color="green"
        />
      </div>

      {/* Metricas de cotizaciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard
          title="Cotizaciones Totales"
          value={cotizaciones.length}
          subtitle="Todas las cotizaciones"
          icon="📄"
          color="blue"
        />
        <MetricCard
          title="Cotizaciones Enviadas"
          value={cotizacionesEnviadas}
          subtitle="En proceso"
          icon="📧"
          color="orange"
        />
        <MetricCard
          title="Tasa de Aceptacion"
          value={`${tasaAceptacion}%`}
          subtitle={`${cotizacionesAceptadas} aceptadas`}
          icon="✅"
          color="green"
        />
      </div>

      {/* Metricas por mes */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Evolucion Mensual (Ultimos 6 Meses)</h2>

        <div className="space-y-6">
          {metricasPorMes.map((metrica, index) => {
            const maxLeads = Math.max(...metricasPorMes.map(m => m.leads))
            const maxMonto = Math.max(...metricasPorMes.map(m => m.monto))
            const leadsPercentage = maxLeads > 0 ? (metrica.leads / maxLeads) * 100 : 0
            const montoPercentage = maxMonto > 0 ? (metrica.monto / maxMonto) * 100 : 0
            const conversionRate = metrica.leads > 0 ? ((metrica.vendidos / metrica.leads) * 100).toFixed(1) : '0'

            return (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-gray-900 w-32">{metrica.mes}</div>
                  <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Leads: </span>
                      <span className="font-medium text-gray-900">{metrica.leads}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Contactados: </span>
                      <span className="font-medium text-gray-900">{metrica.contactados}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Vendidos: </span>
                      <span className="font-medium text-green-600">{metrica.vendidos}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Monto: </span>
                      <span className="font-medium text-green-600">
                        ${metrica.monto.toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Volumen de Leads</span>
                      <span className="text-gray-900 font-medium">{metrica.leads}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${leadsPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Ingresos ({conversionRate}% conversion)</span>
                      <span className="text-green-600 font-medium">
                        ${metrica.monto.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${montoPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Clientes */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top 5 Clientes por Ventas</h2>

        <div className="space-y-4">
          {topClientes.map((cliente, index) => {
            const maxMonto = topClientes[0]?.monto || 1
            const montoPercentage = (cliente.monto / maxMonto) * 100

            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{cliente.nombre}</h3>
                        <p className="text-sm text-gray-600">
                          {cliente.leads} leads • {cliente.vendidos} vendidos • {cliente.tasaConversion.toFixed(1)}% conversion
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${cliente.monto.toLocaleString('es-CL')}
                    </div>
                    <div className="text-xs text-gray-600">Total vendido</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${montoPercentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {topClientes.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <p>No hay datos de clientes disponibles</p>
          </div>
        )}
      </div>

      {/* Insights adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">📊 Resumen de Rendimiento</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-blue-400 pb-2">
              <span className="text-blue-100">Leads Contactados</span>
              <span className="font-bold">{leadsContactados} ({totalLeads > 0 ? ((leadsContactados / totalLeads) * 100).toFixed(1) : 0}%)</span>
            </div>
            <div className="flex justify-between items-center border-b border-blue-400 pb-2">
              <span className="text-blue-100">Leads No Contactados</span>
              <span className="font-bold">{totalLeads - leadsContactados}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-100">Tasa de Cierre</span>
              <span className="font-bold text-xl">{tasaConversion}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">💰 Resumen Financiero</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-green-400 pb-2">
              <span className="text-green-100">Total Vendido</span>
              <span className="font-bold">${totalVendido.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between items-center border-b border-green-400 pb-2">
              <span className="text-green-100">Numero de Ventas</span>
              <span className="font-bold">{leadsVendidos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-100">Ticket Promedio</span>
              <span className="font-bold text-xl">${valorPromedioVenta.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  )
}
