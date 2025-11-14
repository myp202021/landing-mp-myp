'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RespuestaAutomatica {
  id: number
  cliente_id: string
  nombre: string
  asunto: string
  mensaje: string
  activa: boolean
  trigger_tipo: string
  creado_en: string
  actualizado_en: string
}

interface EmailStats {
  total: number
  enviados_hoy: number
  pendientes: number
  errores_hoy: number
}

export default function RespuestasAutomaticasPage() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [respuestas, setRespuestas] = useState<RespuestaAutomatica[]>([])
  const [stats, setStats] = useState<EmailStats>({ total: 0, enviados_hoy: 0, pendientes: 0, errores_hoy: 0 })
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [sendingTest, setSendingTest] = useState<number | null>(null)

  // Redirigir si no es cliente
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
    } else if (user?.role !== 'cliente') {
      router.push('/crm')
    } else {
      loadRespuestas()
      loadStats()
    }
  }, [isAuthenticated, user, router])

  const loadRespuestas = async () => {
    if (!user?.cliente_id) return

    setLoading(true)
    try {
      const res = await fetch(`/api/crm/respuestas-automaticas?cliente_id=${user.cliente_id}`)
      const data = await res.json()
      setRespuestas(data.respuestas || [])
    } catch (error) {
      console.error('Error cargando respuestas:', error)
    }
    setLoading(false)
  }

  const loadStats = async () => {
    if (!user?.cliente_id) return

    try {
      // Aquí podrías agregar un endpoint para stats, por ahora calculamos básico
      setStats({
        total: respuestas.length,
        enviados_hoy: 0,
        pendientes: 0,
        errores_hoy: 0
      })
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    }
  }

  const toggleActiva = async (id: number, activa: boolean) => {
    setProcessingId(id)
    try {
      const res = await fetch('/api/crm/respuestas-automaticas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, activa: !activa })
      })

      if (res.ok) {
        loadRespuestas()
      } else {
        alert('Error al actualizar estado')
      }
    } catch (error) {
      console.error('Error actualizando respuesta:', error)
      alert('Error al actualizar estado')
    }
    setProcessingId(null)
  }

  const eliminarRespuesta = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar la respuesta "${nombre}"?`)) return

    try {
      const res = await fetch(`/api/crm/respuestas-automaticas?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('Respuesta eliminada correctamente')
        loadRespuestas()
      } else {
        alert('Error al eliminar respuesta')
      }
    } catch (error) {
      console.error('Error eliminando respuesta:', error)
      alert('Error al eliminar respuesta')
    }
  }

  const enviarEmailTest = async (respuesta: RespuestaAutomatica) => {
    if (!user?.username) return

    const emailUsuario = prompt('Ingresa el email donde quieres recibir la prueba:', user.username)
    if (!emailUsuario) return

    setSendingTest(respuesta.id)
    try {
      const res = await fetch('/api/crm/emails/enviar-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailUsuario,
          nombre: user.nombre || 'Usuario',
          asunto: respuesta.asunto,
          mensaje: respuesta.mensaje
        })
      })

      if (res.ok) {
        alert('Email de prueba enviado correctamente. Revisa tu bandeja de entrada.')
      } else {
        const data = await res.json()
        alert(`Error al enviar email: ${data.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error enviando test:', error)
      alert('Error al enviar email de prueba')
    }
    setSendingTest(null)
  }

  const getTriggerLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'nuevo_lead': 'Al recibir nuevo lead',
      'sin_contactar_24h': 'Lead sin contactar por 24 horas',
      'sin_contactar_48h': 'Lead sin contactar por 48 horas'
    }
    return labels[tipo] || tipo
  }

  const getTriggerBadgeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'nuevo_lead': 'bg-blue-100 text-blue-800',
      'sin_contactar_24h': 'bg-orange-100 text-orange-800',
      'sin_contactar_48h': 'bg-red-100 text-red-800'
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800'
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
            <h1 className="text-3xl font-bold">Respuestas Automaticas</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Cargando respuestas automaticas...</p>
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
              <h1 className="text-3xl font-bold">Respuestas Automaticas por Email</h1>
              <p className="text-blue-200 mt-1">Sistema de Gestion de Clientes · M&P Marketing y Performance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadRespuestas}
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
                Cerrar Sesion
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
            <Link
              href="/crm/cliente/plantillas"
              className="flex items-center gap-2 px-4 py-4 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Plantillas
            </Link>
            <div className="flex items-center gap-2 px-4 py-4 text-blue-600 font-semibold border-b-2 border-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Respuestas Automaticas
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card informativo */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Como funcionan las Respuestas Automaticas</h3>
              <p className="text-blue-800 mb-3">
                Las respuestas automaticas te permiten enviar emails personalizados a tus leads de forma automatica segun diferentes eventos.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Nuevo Lead:</strong> Se envia inmediatamente cuando recibes un nuevo lead con email</li>
                <li>• <strong>Sin contactar 24h:</strong> Se envia si el lead no ha sido contactado despues de 24 horas</li>
                <li>• <strong>Sin contactar 48h:</strong> Se envia si el lead no ha sido contactado despues de 48 horas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Estadisticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <div className="text-sm font-semibold text-gray-600 mb-1">Total Respuestas</div>
            <div className="text-3xl font-bold text-blue-900">{respuestas.length}</div>
          </div>
          <div className="bg-green-50 rounded-xl shadow-md p-5 border border-green-200">
            <div className="text-sm font-semibold text-green-600 mb-1">Activas</div>
            <div className="text-3xl font-bold text-green-900">{respuestas.filter(r => r.activa).length}</div>
          </div>
          <div className="bg-orange-50 rounded-xl shadow-md p-5 border border-orange-200">
            <div className="text-sm font-semibold text-orange-600 mb-1">Emails Enviados Hoy</div>
            <div className="text-3xl font-bold text-orange-900">{stats.enviados_hoy}</div>
          </div>
          <div className="bg-purple-50 rounded-xl shadow-md p-5 border border-purple-200">
            <div className="text-sm font-semibold text-purple-600 mb-1">Pendientes</div>
            <div className="text-3xl font-bold text-purple-900">{stats.pendientes}</div>
          </div>
        </div>

        {/* Boton nueva respuesta */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Respuestas Automaticas</h2>
            <p className="text-gray-600 mt-1">Configura emails automaticos para tus leads</p>
          </div>
          <Link href="/crm/cliente/respuestas-automaticas/nueva">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Respuesta
            </button>
          </Link>
        </div>

        {/* Lista de respuestas */}
        {respuestas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-lg mb-4">No tienes respuestas automaticas configuradas</p>
            <Link href="/crm/cliente/respuestas-automaticas/nueva">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Crear Primera Respuesta
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {respuestas.map((respuesta) => (
              <div
                key={respuesta.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{respuesta.nombre}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTriggerBadgeColor(respuesta.trigger_tipo)}`}>
                          {getTriggerLabel(respuesta.trigger_tipo)}
                        </span>
                        {respuesta.activa ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">Activa</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">Inactiva</span>
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Asunto: <strong>{respuesta.asunto}</strong></p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{respuesta.mensaje}</p>
                      </div>

                      <div className="text-xs text-gray-500">
                        Creado: {new Date(respuesta.creado_en).toLocaleDateString('es-CL')}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => toggleActiva(respuesta.id, respuesta.activa)}
                        disabled={processingId === respuesta.id}
                        className={`px-4 py-2 text-sm rounded-lg transition font-medium ${
                          respuesta.activa
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {processingId === respuesta.id ? 'Procesando...' : respuesta.activa ? 'Desactivar' : 'Activar'}
                      </button>

                      <Link href={`/crm/cliente/respuestas-automaticas/${respuesta.id}`}>
                        <button className="w-full px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium">
                          Editar
                        </button>
                      </Link>

                      <button
                        onClick={() => enviarEmailTest(respuesta)}
                        disabled={sendingTest === respuesta.id}
                        className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium"
                      >
                        {sendingTest === respuesta.id ? 'Enviando...' : 'Enviar Prueba'}
                      </button>

                      <button
                        onClick={() => eliminarRespuesta(respuesta.id, respuesta.nombre)}
                        className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
