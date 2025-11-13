'use client'

/**
 * PÁGINA DE INTEGRACIONES - Gestionar conexiones con Meta Lead Ads
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Cliente {
  id: string
  nombre: string
}

interface MetaConnection {
  id: string
  cliente_id: string
  meta_user_id: string
  meta_user_name: string
  status: string
  token_expires_at: string
  last_sync_at: string | null
  created_at: string
}

interface MetaPage {
  id: string
  connection_id: string
  page_id: string
  page_name: string
  sync_enabled: boolean
  last_sync_at: string | null
}

interface MetaForm {
  id: string
  page_id: string
  form_id: string
  form_name: string
  form_status: string
  sync_enabled: boolean
  auto_sync: boolean
}

export default function IntegracionesPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [connection, setConnection] = useState<MetaConnection | null>(null)
  const [pages, setPages] = useState<MetaPage[]>([])
  const [forms, setForms] = useState<MetaForm[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkAuth()
    fetchClientes()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const error = params.get('error')
    const pagesCount = params.get('pages')

    if (success === 'true') {
      setMessage(`Conexión exitosa. ${pagesCount || 0} páginas conectadas.`)
      // Limpiar URL
      window.history.replaceState({}, '', '/crm/integraciones')
    } else if (error) {
      setMessage(`Error: ${error}`)
      window.history.replaceState({}, '', '/crm/integraciones')
    }
  }, [])

  useEffect(() => {
    if (selectedCliente) {
      fetchConnection()
    } else {
      setConnection(null)
      setPages([])
      setForms([])
    }
  }, [selectedCliente])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (!data.user || data.user.rol !== 'admin') {
        router.push('/crm/login')
      }
    } catch (error) {
      router.push('/crm/login')
    }
  }

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/crm/clientes')
      const data = await res.json()
      setClientes(data.clientes || [])
    } catch (error) {
      console.error('Error fetching clientes:', error)
    }
  }

  const fetchConnection = async () => {
    if (!selectedCliente) return

    setLoading(true)
    try {
      const res = await fetch(`/api/meta/connections?cliente_id=${selectedCliente}`)
      const data = await res.json()

      setConnection(data.connection)
      setPages(data.pages || [])
      setForms(data.forms || [])
    } catch (error) {
      console.error('Error fetching connection:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = () => {
    if (!selectedCliente) {
      alert('Selecciona un cliente primero')
      return
    }

    // Redirigir al flujo OAuth
    window.location.href = `/api/meta/oauth?cliente_id=${selectedCliente}`
  }

  const handleDisconnect = async () => {
    if (!selectedCliente || !connection) return

    if (!confirm('¿Estás seguro de desconectar Meta? Se perderán todas las configuraciones.')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/meta/connections?cliente_id=${selectedCliente}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setMessage('Desconectado exitosamente')
        fetchConnection()
      } else {
        setMessage('Error al desconectar')
      }
    } catch (error) {
      console.error('Error disconnecting:', error)
      setMessage('Error al desconectar')
    } finally {
      setLoading(false)
    }
  }

  const getFormsForPage = (pageId: string) => {
    return forms.filter(f => f.page_id === pageId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Integraciones
          </h1>
          <p className="text-gray-600">
            Conecta cuentas de Meta/Facebook para sincronizar Lead Ads automáticamente
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') || message.includes('error')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message}
            <button
              onClick={() => setMessage('')}
              className="ml-4 text-sm underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Selector de Cliente */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Cliente
          </label>
          <select
            value={selectedCliente}
            onChange={(e) => setSelectedCliente(e.target.value)}
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Seleccionar cliente --</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estado de Conexión */}
        {selectedCliente && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Estado de Conexión con Meta
            </h2>

            {loading ? (
              <div className="text-gray-500">Cargando...</div>
            ) : connection ? (
              <div>
                {/* Conexión activa */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="font-semibold text-green-900">
                          Conectado
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Usuario: <strong>{connection.meta_user_name}</strong>
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Conectado el {new Date(connection.created_at).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <button
                      onClick={handleDisconnect}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Desconectar
                    </button>
                  </div>
                </div>

                {/* Páginas conectadas */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Páginas de Facebook ({pages.length})
                  </h3>

                  {pages.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No se encontraron páginas de Facebook asociadas a esta cuenta.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pages.map(page => {
                        const pageForms = getFormsForPage(page.id)
                        return (
                          <div
                            key={page.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {page.page_name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  ID: {page.page_id}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                page.sync_enabled
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {page.sync_enabled ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>

                            {/* Formularios de esta página */}
                            {pageForms.length > 0 && (
                              <div className="mt-3 pl-4 border-l-2 border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                  Formularios de Lead Ads ({pageForms.length})
                                </p>
                                <div className="space-y-2">
                                  {pageForms.map(form => (
                                    <div
                                      key={form.id}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <div>
                                        <span className="text-gray-900">
                                          {form.form_name}
                                        </span>
                                        <span className="ml-2 text-xs text-gray-500">
                                          ({form.form_status})
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {form.auto_sync && (
                                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            Auto-sync
                                          </span>
                                        )}
                                        <span className={`text-xs px-2 py-1 rounded ${
                                          form.sync_enabled
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          {form.sync_enabled ? 'Activo' : 'Inactivo'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Botón de reconectar */}
                <button
                  onClick={handleConnect}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reconectar / Actualizar Páginas
                </button>
              </div>
            ) : (
              /* Sin conexión */
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="inline-block w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay conexión con Meta
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                    Conecta tu cuenta de Facebook para sincronizar automáticamente
                    los leads de tus campañas de Lead Ads.
                  </p>
                  <button
                    onClick={handleConnect}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Conectar con Meta
                  </button>
                </div>

                {/* Info adicional */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left max-w-2xl mx-auto">
                  <h4 className="font-medium text-blue-900 mb-2">
                    ¿Qué sucede al conectar?
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Se solicitarán permisos para acceder a tus páginas de Facebook</li>
                    <li>• Se detectarán automáticamente todas tus páginas y formularios de Lead Ads</li>
                    <li>• Los nuevos leads llegarán automáticamente al CRM en tiempo real</li>
                    <li>• Los tokens no expiran mientras la conexión esté activa</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botón volver */}
        <div className="mt-8">
          <button
            onClick={() => router.push('/crm/leads')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Volver al CRM
          </button>
        </div>
      </div>
    </div>
  )
}
