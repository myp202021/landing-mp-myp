'use client'

/**
 * PÁGINA DE MÉTRICAS POR CLIENTE
 * - Gestión de inversiones mensuales
 * - Cálculo inteligente de ROAS
 * - Gráficos de evolución
 * - Análisis de tasas de contacto y conversión
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Cliente {
  id: string
  nombre: string
  rubro: string | null
}

interface Inversion {
  id: string
  ano: number
  mes: number
  monto: number
  moneda: string
}

interface MetricasMensual {
  ano: number
  mes: number
  total_leads: number
  contactados: number
  vendidos: number
  monto_ventas: number
  inversion: number
  tasa_contacto: number
  tasa_conversion: number
  roas: number | null
}

export default function ClienteMetricasPage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params.id as string

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [inversiones, setInversiones] = useState<Inversion[]>([])
  const [metricas, setMetricas] = useState<MetricasMensual[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddInversion, setShowAddInversion] = useState(false)

  // Form state para nueva inversión
  const [newInversion, setNewInversion] = useState({
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    monto: ''
  })

  useEffect(() => {
    fetchData()
  }, [clienteId])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch cliente info
      const clienteRes = await fetch(`/api/crm/clientes?id=${clienteId}`)
      const clienteData = await clienteRes.json()
      setCliente(clienteData.cliente)

      // Fetch inversiones
      const inversionesRes = await fetch(`/api/crm/inversiones?cliente_id=${clienteId}`)
      const inversionesData = await inversionesRes.json()
      setInversiones(inversionesData.inversiones || [])

      // Fetch métricas calculadas
      const metricasRes = await fetch(`/api/crm/metricas?cliente_id=${clienteId}`)
      const metricasData = await metricasRes.json()
      setMetricas(metricasData.metricas || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddInversion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newInversion.monto || parseFloat(newInversion.monto) <= 0) {
      alert('Ingresa un monto válido')
      return
    }

    try {
      const res = await fetch('/api/crm/inversiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: clienteId,
          ano: newInversion.ano,
          mes: newInversion.mes,
          monto: parseFloat(newInversion.monto)
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      alert('Inversión registrada exitosamente')
      setShowAddInversion(false)
      setNewInversion({
        ano: new Date().getFullYear(),
        mes: new Date().getMonth() + 1,
        monto: ''
      })
      fetchData()
    } catch (error: any) {
      console.error('Error adding inversion:', error)
      alert('Error registrando inversión: ' + error.message)
    }
  }

  const handleDeleteInversion = async (inversionId: string) => {
    if (!confirm('¿Eliminar esta inversión?')) return

    try {
      const res = await fetch(`/api/crm/inversiones?id=${inversionId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Error eliminando inversión')
      }

      alert('Inversión eliminada')
      fetchData()
    } catch (error: any) {
      console.error('Error deleting inversion:', error)
      alert('Error: ' + error.message)
    }
  }

  // Calcular totales
  const calcularTotales = () => {
    const totalInversion = inversiones.reduce((sum, inv) => sum + inv.monto, 0)
    const totalVentas = metricas.reduce((sum, m) => sum + m.monto_ventas, 0)
    const totalLeads = metricas.reduce((sum, m) => sum + m.total_leads, 0)
    const totalContactados = metricas.reduce((sum, m) => sum + m.contactados, 0)
    const totalVendidos = metricas.reduce((sum, m) => sum + m.vendidos, 0)
    const roasTotal = totalInversion > 0 ? totalVentas / totalInversion : null

    return {
      totalInversion,
      totalVentas,
      totalLeads,
      totalContactados,
      totalVendidos,
      roasTotal,
      tasaContactoPromedio: totalLeads > 0 ? (totalContactados / totalLeads) * 100 : 0,
      tasaConversionPromedio: totalLeads > 0 ? (totalVendidos / totalLeads) * 100 : 0
    }
  }

  const totales = calcularTotales()

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(monto)
  }

  const getNombreMes = (mes: number) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return meses[mes - 1]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando métricas...</div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Cliente no encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/crm/admin')}
            className="text-blue-600 hover:underline mb-2"
          >
            ← Volver al Admin
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{cliente.nombre}</h1>
          <p className="text-gray-600">{cliente.rubro || 'Sin rubro'}</p>
        </div>

        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Inversión Total</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatMonto(totales.totalInversion)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Ventas Totales</div>
            <div className="text-2xl font-bold text-green-600">
              {formatMonto(totales.totalVentas)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">ROAS Total</div>
            <div className="text-2xl font-bold text-purple-600">
              {totales.roasTotal !== null ? totales.roasTotal.toFixed(2) + 'x' : '-'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Leads</div>
            <div className="text-2xl font-bold text-gray-900">{totales.totalLeads}</div>
            <div className="text-xs text-gray-500 mt-1">
              {totales.totalVendidos} vendidos ({totales.tasaConversionPromedio.toFixed(1)}%)
            </div>
          </div>
        </div>

        {/* Sección Inversiones */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Inversiones Mensuales</h2>
            <button
              onClick={() => setShowAddInversion(!showAddInversion)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {showAddInversion ? 'Cancelar' : '+ Nueva Inversión'}
            </button>
          </div>

          {/* Formulario nueva inversión */}
          {showAddInversion && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Registrar Inversión</h3>
              <form onSubmit={handleAddInversion} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año *
                  </label>
                  <input
                    type="number"
                    value={newInversion.ano}
                    onChange={(e) => setNewInversion({ ...newInversion, ano: parseInt(e.target.value) })}
                    min="2020"
                    max="2030"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mes *
                  </label>
                  <select
                    value={newInversion.mes}
                    onChange={(e) => setNewInversion({ ...newInversion, mes: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <option key={m} value={m}>{getNombreMes(m)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto (CLP) *
                  </label>
                  <input
                    type="number"
                    value={newInversion.monto}
                    onChange={(e) => setNewInversion({ ...newInversion, monto: e.target.value })}
                    placeholder="1000000"
                    min="0"
                    step="1000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="md:col-span-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Registrar Inversión
                </button>
              </form>
            </div>
          )}

          {/* Tabla inversiones */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Período</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Monto</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inversiones.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {getNombreMes(inv.mes)} {inv.ano}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                      {formatMonto(inv.monto)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={() => handleDeleteInversion(inv.id)}
                        className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {inversiones.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay inversiones registradas. Agrega una para comenzar a calcular ROAS.
              </div>
            )}
          </div>
        </div>

        {/* Sección Métricas Mensuales */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Métricas Mensuales</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Período</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Leads</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Contactados</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Vendidos</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ventas</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Inversión</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">ROAS</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Tasa Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metricas.map((m, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {getNombreMes(m.mes)} {m.ano}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{m.total_leads}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {m.contactados} <span className="text-xs text-gray-500">({m.tasa_contacto.toFixed(1)}%)</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{m.vendidos}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                      {formatMonto(m.monto_ventas)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {formatMonto(m.inversion)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {m.roas !== null ? (
                        <span className={`font-bold ${m.roas >= 3 ? 'text-green-600' : m.roas >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {m.roas.toFixed(2)}x
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{m.tasa_conversion.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {metricas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay métricas disponibles. Sube leads y registra inversiones para ver el análisis.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
