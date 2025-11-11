'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import MetricCard from '@/app/components/crm/MetricCard'
import Button from '@/app/components/crm/Button'

interface Lead {
  id: number
  cliente_id: string
  nombre?: string
  email?: string
  telefono?: string
  empresa?: string
  fuente: string
  campana_nombre?: string
  ad_nombre?: string
  form_nombre?: string
  contactado: boolean
  fecha_contacto?: string
  vendido: boolean
  monto_vendido?: number
  razon_no_venta?: string
  observaciones?: string
  notas?: string
  fecha_ingreso: string
  prioridad?: boolean
  costo_publicidad?: number
}

export default function ClienteDashboard() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  // Configuración de inversión mensual (hardcoded por ahora, debería venir de la BD)
  const INVERSION_MENSUAL = 5000000 // CLP

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
      // Filtrar leads por cliente_id del usuario
      let url = '/api/crm/leads?limit=500'
      if (user?.cliente_id) {
        url += `&cliente_id=${user.cliente_id}`
      }

      const resLeads = await fetch(url)
      const dataLeads = await resLeads.json()

      setLeads(dataLeads.leads || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  // Función para calcular horas desde ingreso
  const getHorasSinContacto = (lead: Lead): number => {
    if (lead.contactado) return 0
    const fechaIngreso = new Date(lead.fecha_ingreso)
    const ahora = new Date()
    const diff = ahora.getTime() - fechaIngreso.getTime()
    return Math.floor(diff / (1000 * 60 * 60)) // horas
  }

  // Función para obtener color del semáforo
  const getSemaforoColor = (horas: number): string => {
    if (horas === 0) return 'bg-gray-400' // Contactado
    if (horas < 24) return 'bg-green-500' // Verde: menos de 24h
    if (horas < 48) return 'bg-yellow-500' // Amarillo: 24-48h
    return 'bg-red-500' // Rojo: más de 48h
  }

  // Función para obtener texto del semáforo
  const getSemaforoTexto = (horas: number): string => {
    if (horas === 0) return 'Ya contactado'
    if (horas < 24) return `${horas}h`
    const dias = Math.floor(horas / 24)
    const horasRestantes = horas % 24
    return `${dias}d ${horasRestantes}h`
  }

  const updateLead = async (leadId: number, updates: any) => {
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, ...updates })
      })

      if (res.ok) {
        await loadData()
        setEditingLead(null)
        alert('Lead actualizado exitosamente')
      }
    } catch (error) {
      console.error('Error actualizando lead:', error)
      alert('Error actualizando lead')
    }
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

  // Calcular métricas
  const totalLeads = leads.length
  const leadsContactados = leads.filter(l => l.contactado).length
  const leadsVendidos = leads.filter(l => l.vendido).length
  const totalVendido = leads.filter(l => l.monto_vendido).reduce((sum, l) => sum + Number(l.monto_vendido || 0), 0)
  const tasaConversion = totalLeads > 0 ? ((leadsVendidos / totalLeads) * 100).toFixed(1) : '0'
  const roas = INVERSION_MENSUAL > 0 ? (totalVendido / INVERSION_MENSUAL).toFixed(2) : '0.00'

  // Ordenar leads por prioridad y fecha
  const sortedLeads = [...leads].sort((a, b) => {
    // Primero por prioridad (prioritarios arriba)
    if (a.prioridad && !b.prioridad) return -1
    if (!a.prioridad && b.prioridad) return 1
    // Luego por fecha (más recientes primero)
    return new Date(b.fecha_ingreso).getTime() - new Date(a.fecha_ingreso).getTime()
  })

  return (
    <CRMLayout title="Dashboard Cliente - Muller y Perez" authenticated onRefresh={loadData}>
      {/* Bienvenida */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user.nombre}
        </h2>
        <p className="text-gray-600 mt-2">
          Aquí puedes ver y gestionar tus leads de marketing
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <MetricCard
          title="Total Leads"
          value={totalLeads}
          icon="📊"
          color="blue"
        />
        <MetricCard
          title="Contactados"
          value={leadsContactados}
          subtitle={`${totalLeads > 0 ? ((leadsContactados / totalLeads) * 100).toFixed(1) : 0}%`}
          icon="📞"
          color="blue"
        />
        <MetricCard
          title="Vendidos"
          value={leadsVendidos}
          subtitle={`${tasaConversion}% conversión`}
          icon="✅"
          color="green"
        />
        <MetricCard
          title="Total Vendido"
          value={`$${totalVendido.toLocaleString('es-CL')}`}
          icon="💰"
          color="green"
        />
        <MetricCard
          title="ROAS"
          value={`${roas}x`}
          subtitle={`Inversión: $${INVERSION_MENSUAL.toLocaleString('es-CL')}`}
          icon="📈"
          color="purple"
        />
      </div>

      {/* Tabla de Leads */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-blue-900 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Mis Leads</h3>
        </div>

        {sortedLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes leads
            </h3>
            <p className="text-gray-600">
              Aún no se han recibido leads para tu cuenta
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Fuente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">
                    Tiempo sin contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedLeads.map(lead => (
                  <tr
                    key={lead.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      lead.prioridad ? 'bg-yellow-50 border-l-4 border-l-yellow-500' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(lead.fecha_ingreso).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{lead.nombre || 'Sin nombre'}</div>
                      <div className="text-sm text-gray-600">{lead.email || lead.telefono}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lead.fuente}<br/>
                      <span className="text-xs text-gray-500">{lead.ad_nombre || lead.form_nombre}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const horas = getHorasSinContacto(lead)
                        return (
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getSemaforoColor(horas)} animate-pulse`} />
                            <span className="text-sm font-medium text-gray-700">{getSemaforoTexto(horas)}</span>
                          </div>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.vendido ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                          Vendido
                        </span>
                      ) : lead.contactado ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                          Contactado
                        </span>
                      ) : lead.razon_no_venta ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">
                          Negativo
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                          Nuevo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.monto_vendido ? `$${Number(lead.monto_vendido).toLocaleString('es-CL')}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditingLead(lead)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de edición de lead */}
      {editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Editar Lead</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contactado
                  </label>
                  <select
                    value={editingLead.contactado ? 'true' : 'false'}
                    onChange={(e) => setEditingLead({...editingLead, contactado: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Vendido
                  </label>
                  <select
                    value={editingLead.vendido ? 'true' : 'false'}
                    onChange={(e) => setEditingLead({...editingLead, vendido: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
              </div>

              {editingLead.vendido && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Monto Vendido (CLP)
                  </label>
                  <input
                    type="number"
                    value={editingLead.monto_vendido || ''}
                    onChange={(e) => setEditingLead({...editingLead, monto_vendido: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Ej: 1500000"
                  />
                </div>
              )}

              {!editingLead.vendido && editingLead.contactado && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Razón de no venta
                  </label>
                  <input
                    type="text"
                    value={editingLead.razon_no_venta || ''}
                    onChange={(e) => setEditingLead({...editingLead, razon_no_venta: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Ej: Precio muy alto, no está interesado, etc."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={editingLead.observaciones || ''}
                  onChange={(e) => setEditingLead({...editingLead, observaciones: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={2}
                  placeholder="Observaciones generales..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notas Detalladas
                </label>
                <textarea
                  value={editingLead.notas || ''}
                  onChange={(e) => setEditingLead({...editingLead, notas: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={4}
                  placeholder="Detalles de la conversación, seguimientos, próximos pasos..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => setEditingLead(null)}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => updateLead(editingLead.id, {
                    contactado: editingLead.contactado,
                    vendido: editingLead.vendido,
                    monto_vendido: editingLead.monto_vendido || null,
                    razon_no_venta: editingLead.razon_no_venta || null,
                    observaciones: editingLead.observaciones || null,
                    notas: editingLead.notas || null
                  })}
                  variant="primary"
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
