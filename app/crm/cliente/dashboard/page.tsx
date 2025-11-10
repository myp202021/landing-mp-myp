'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import MetricCard from '@/app/components/crm/MetricCard'

interface Cotizacion {
  id: number
  cliente_id: string
  lead_id?: number
  nombre_proyecto: string
  cliente_nombre?: string
  subtotal: number
  descuento?: number
  total: number
  notas?: string
  estado: string
  creado_en: string
  enviada_en?: string
  aceptada_en?: string
}

export default function ClienteDashboard() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)

  // Redirigir si no es cliente
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
    } else if (user?.role !== 'cliente') {
      router.push('/crm')
    } else {
      loadData()
    }
  }, [isAuthenticated, user, router])

  const loadData = async () => {
    setLoading(true)
    try {
      // En el futuro, esto se filtrará por el cliente_id del usuario
      const resCotizaciones = await fetch('/api/crm/cotizaciones')
      const dataCotizaciones = await resCotizaciones.json()

      setCotizaciones(dataCotizaciones.cotizaciones || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
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
      <CRMLayout title="Dashboard Cliente" authenticated onRefresh={loadData}>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </CRMLayout>
    )
  }

  const cotizacionesEnviadas = cotizaciones.filter(c => c.estado === 'enviada' || c.estado === 'aceptada' || c.estado === 'rechazada')
  const cotizacionesAceptadas = cotizaciones.filter(c => c.estado === 'aceptada')
  const totalInvertido = cotizacionesAceptadas.reduce((sum, c) => sum + Number(c.total), 0)

  return (
    <CRMLayout title="Dashboard Cliente - Muller y Perez" authenticated onRefresh={loadData}>
      {/* Bienvenida */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user.nombre}
        </h2>
        <p className="text-gray-600 mt-2">
          Aquí puedes ver tus cotizaciones y el estado de tus proyectos
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Cotizaciones Totales"
          value={cotizacionesEnviadas.length}
          icon="📄"
          color="blue"
        />
        <MetricCard
          title="Proyectos Aceptados"
          value={cotizacionesAceptadas.length}
          icon="✅"
          color="green"
        />
        <MetricCard
          title="Inversión Total"
          value={`$${totalInvertido.toLocaleString('es-CL')}`}
          icon="💰"
          color="purple"
        />
      </div>

      {/* Tabla de Cotizaciones */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-blue-900 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Mis Cotizaciones</h3>
        </div>

        {cotizacionesEnviadas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes cotizaciones
            </h3>
            <p className="text-gray-600">
              Aún no se han enviado cotizaciones para tu cuenta
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cotizacionesEnviadas.map((cot) => {
                  const estadoColor = {
                    enviada: 'bg-blue-100 text-blue-800',
                    aceptada: 'bg-green-100 text-green-800',
                    rechazada: 'bg-red-100 text-red-800'
                  }[cot.estado] || 'bg-gray-100 text-gray-800'

                  return (
                    <tr key={cot.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {cot.nombre_proyecto}
                        </div>
                        {cot.notas && (
                          <div className="text-xs text-gray-500 mt-1">
                            {cot.notas.substring(0, 60)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(cot.creado_en).toLocaleDateString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${Number(cot.total).toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoColor}`}>
                          {cot.estado.charAt(0).toUpperCase() + cot.estado.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => router.push(`/crm/cotizaciones/${cot.id}`)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información de contacto */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">
          ¿Necesitas ayuda?
        </h4>
        <p className="text-blue-800">
          Contacta a tu ejecutivo de cuenta o escríbenos a <a href="mailto:contacto@mulleryperez.cl" className="underline font-medium">contacto@mulleryperez.cl</a>
        </p>
      </div>
    </CRMLayout>
  )
}
