'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import CampaignSummaryCards from '@/app/components/crm/CampaignSummaryCards'
import CampaignsTable from '@/app/components/crm/CampaignsTable'
import InvestmentChart from '@/app/components/crm/InvestmentChart'

export default function ClienteCampaniasPage() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [campanasData, setCampanasData] = useState<any>(null)
  const [periodo, setPeriodo] = useState(30)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
      return
    }

    if (user?.role !== 'cliente') {
      router.push('/crm')
      return
    }

    if (!user?.cliente_id) {
      alert('Tu cuenta no tiene un cliente asignado. Contacta al administrador.')
      router.push('/crm/login')
      return
    }

    loadCampanasData()
  }, [isAuthenticated, user, periodo])

  const loadCampanasData = async () => {
    if (!user?.cliente_id) return

    setLoading(true)

    try {
      const response = await fetch(`/api/crm/campaigns?clienteId=${user.cliente_id}&dias=${periodo}`)

      if (!response.ok) {
        throw new Error('Error al cargar campañas')
      }

      const data = await response.json()
      setCampanasData(data)
    } catch (error) {
      console.error('Error cargando campañas:', error)
      alert('Error al cargar las campañas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <CRMLayout title="Mis Campañas Publicitarias" authenticated>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </CRMLayout>
    )
  }

  if (!campanasData) {
    return (
      <CRMLayout title="Mis Campañas Publicitarias" authenticated>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            No se pudieron cargar los datos de campañas. Intenta nuevamente.
          </p>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="Mis Campañas Publicitarias" authenticated onRefresh={loadCampanasData}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Campañas Publicitarias
        </h2>
        <p className="text-gray-600 mt-2">
          Visualiza el rendimiento de tus campañas en Meta Ads
        </p>
      </div>

      {/* Filtro de periodo */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 mb-8 shadow-sm">
        <label className="block text-sm font-semibold text-purple-900 mb-3">
          📅 Periodo de Análisis
        </label>
        <div className="flex gap-3">
          {[7, 30, 90].map((dias) => (
            <button
              key={dias}
              onClick={() => setPeriodo(dias)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                periodo === dias
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50'
              }`}
            >
              Últimos {dias} días
            </button>
          ))}
        </div>
        <p className="text-xs text-purple-700 mt-3">
          Periodo actual: {campanasData.periodo.fechaInicio} a {campanasData.periodo.fechaFin}
        </p>
      </div>

      {/* Cards de resumen */}
      <CampaignSummaryCards resumen={campanasData.resumen} />

      {/* Gráfico de inversión por día */}
      <InvestmentChart data={campanasData.chartData || []} />

      {/* Tabla de campañas */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Detalle por Campaña
        </h3>
        <CampaignsTable campanas={campanasData.campanas} />
      </div>

      {/* Info adicional */}
      {campanasData.campanas.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800">
            No hay campañas con datos en el periodo seleccionado.
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Prueba seleccionando un periodo mayor o verifica que tus campañas estén activas.
          </p>
        </div>
      )}
    </CRMLayout>
  )
}
