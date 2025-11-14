'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'
import { useSimpleAuth } from '@/lib/auth/simple-auth'

interface Cliente {
  id: string
  nombre: string
  zapier_activo: boolean
  zapier_webhook_url: string | null
  google_ads_activo: boolean
  meta_ads_activo: boolean
}

interface ResumenIntegracion {
  clientesConZapier: number
  clientesConGoogleAds: number
  clientesConMeta: number
  ultimaActividad?: string
}

export default function IntegracionesPage() {
  const router = useRouter()
  const { user } = useSimpleAuth()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [resumen, setResumen] = useState<ResumenIntegracion>({
    clientesConZapier: 0,
    clientesConGoogleAds: 0,
    clientesConMeta: 0
  })

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/crm/clientes?limit=1000')
      const data = await res.json()
      const clientesData = data.clientes || []
      setClientes(clientesData)

      // Calcular resumen
      const zapier = clientesData.filter((c: Cliente) => c.zapier_activo).length
      const googleAds = clientesData.filter((c: Cliente) => c.google_ads_activo).length
      const meta = clientesData.filter((c: Cliente) => c.meta_ads_activo).length

      setResumen({
        clientesConZapier: zapier,
        clientesConGoogleAds: googleAds,
        clientesConMeta: meta
      })
    } catch (error) {
      console.error('Error cargando clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDesactivarZapier = async (clienteId: string, clienteNombre: string) => {
    if (!confirm(`¿Desactivar integración Zapier para ${clienteNombre}?`)) return

    try {
      const res = await fetch(`/api/crm/clientes/${clienteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zapier_activo: false })
      })

      if (!res.ok) throw new Error('Error desactivando Zapier')

      // Registrar en historial
      await fetch('/api/crm/integraciones/historial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: clienteId,
          tipo: 'zapier',
          accion: 'desactivado',
          descripcion: `Integración Zapier desactivada para ${clienteNombre}`,
          user_id: user?.id
        })
      })

      alert('Integración desactivada exitosamente')
      fetchClientes()
    } catch (error) {
      console.error('Error:', error)
      alert('Error desactivando la integración')
    }
  }

  const getEstadoBadge = (activo: boolean, configurado: boolean) => {
    if (activo) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-300 flex items-center gap-1">
          <span>✅</span> Activo
        </span>
      )
    } else if (configurado) {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold border border-yellow-300 flex items-center gap-1">
          <span>⚠️</span> Inactivo
        </span>
      )
    } else {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-300 flex items-center gap-1">
          <span>⏸️</span> No configurado
        </span>
      )
    }
  }

  return (
    <CRMLayout title="Integraciones">
      <div className="space-y-8">
        {/* Encabezado con botón de historial */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integraciones Externas</h1>
            <p className="text-gray-600 mt-1">Gestiona las conexiones con plataformas externas</p>
          </div>
          <Button onClick={() => router.push('/crm/historial-integraciones')}>
            📜 Ver Historial Completo
          </Button>
        </div>

        {/* Resumen de integraciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-900 font-semibold text-sm">Zapier</p>
                <p className="text-3xl font-bold text-blue-700 mt-1">{resumen.clientesConZapier}</p>
                <p className="text-blue-600 text-xs mt-1">clientes activos</p>
              </div>
              <div className="text-5xl">⚡</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-900 font-semibold text-sm">Google Ads</p>
                <p className="text-3xl font-bold text-green-700 mt-1">{resumen.clientesConGoogleAds}</p>
                <p className="text-green-600 text-xs mt-1">proximamente</p>
              </div>
              <div className="text-5xl">🎯</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-900 font-semibold text-sm">Meta Ads</p>
                <p className="text-3xl font-bold text-purple-700 mt-1">{resumen.clientesConMeta}</p>
                <p className="text-purple-600 text-xs mt-1">proximamente</p>
              </div>
              <div className="text-5xl">📘</div>
            </div>
          </div>
        </div>

        {/* Sección Zapier con tabla de clientes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">⚡</span>
                <div>
                  <h2 className="text-xl font-bold text-white">Zapier</h2>
                  <p className="text-blue-100 text-sm">Conecta formularios de Facebook Lead Ads</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-white text-blue-700 rounded-full text-sm font-bold">
                {resumen.clientesConZapier} activos
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
              <h3 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                <span>ℹ️</span> Información General
              </h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Los leads de Facebook llegarán automáticamente al CRM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Cada cliente tiene su propia URL de webhook única</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Puedes activar/desactivar la integración por cliente</span>
                </li>
              </ul>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando clientes...</p>
                </div>
              </div>
            ) : clientes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No hay clientes registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Estado Zapier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Webhook URL
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientes.map((cliente) => (
                      <tr key={cliente.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-bold text-gray-900">{cliente.nombre}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getEstadoBadge(cliente.zapier_activo, !!cliente.zapier_webhook_url)}
                        </td>
                        <td className="px-6 py-4">
                          {cliente.zapier_webhook_url ? (
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-blue-600 border border-gray-300">
                              {cliente.zapier_webhook_url.substring(0, 50)}...
                            </code>
                          ) : (
                            <span className="text-sm text-gray-400">No configurado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => router.push(`/crm/integraciones/zapier/${cliente.id}`)}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                            >
                              {cliente.zapier_activo ? '⚙️ Reconfigurar' : '🔧 Configurar'}
                            </button>
                            {cliente.zapier_activo && (
                              <button
                                onClick={() => handleDesactivarZapier(cliente.id, cliente.nombre)}
                                className="text-red-600 hover:text-red-800 font-semibold text-sm"
                              >
                                ❌ Desactivar
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/crm/historial-integraciones?cliente_id=${cliente.id}`)}
                              className="text-gray-600 hover:text-gray-800 font-semibold text-sm"
                            >
                              📜 Historial
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Google Ads */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎯</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Google Ads</h2>
                <p className="text-gray-600 text-sm">Sincroniza datos de campañas y costos</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold border border-yellow-300">
              Disponible Pronto
            </span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4">
            <h3 className="text-blue-900 font-semibold mb-3 flex items-center gap-2">
              <span>📊</span> Datos que obtendrás automáticamente:
            </h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Métricas por campaña (impresiones, clicks, costo, CTR)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Costo por lead automático desde campañas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>ROAS calculado en tiempo real</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Leads desde Google Ads Lead Form Extensions</span>
              </li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => alert('Funcionalidad en desarrollo.\n\nRequiere:\n1. Configuración de Google Ads API\n2. OAuth 2.0\n3. Developer Token de Google\n\nEstará disponible próximamente.')}
            >
              Conectar Google Ads
            </Button>
            <Button
              variant="secondary"
              onClick={() => alert('Documentación técnica en desarrollo')}
            >
              Ver Plan Técnico
            </Button>
          </div>
        </div>

        {/* Meta/Facebook */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">📘</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Meta Business Manager</h2>
                <p className="text-gray-600 text-sm">Datos de campañas de Facebook e Instagram</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-semibold">
              Próximamente
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Integración con Meta Business Manager para obtener métricas de campañas de Facebook e Instagram Ads.
          </p>
          <Button variant="secondary" disabled>
            Próximamente
          </Button>
        </div>
      </div>
    </CRMLayout>
  )
}
