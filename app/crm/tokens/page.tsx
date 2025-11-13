'use client'

/**
 * PÁGINA PARA AGREGAR PAGE ACCESS TOKENS MANUALMENTE
 * Esta es la solución práctica mientras OAuth requiere App Review
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Cliente {
  id: string
  nombre: string
}

interface PageToken {
  id: string
  cliente_id: string
  page_id: string
  page_name: string
  page_access_token: string
  created_at: string
}

export default function TokensPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [pageId, setPageId] = useState('')
  const [pageName, setPageName] = useState('')
  const [pageAccessToken, setPageAccessToken] = useState('')
  const [tokens, setTokens] = useState<PageToken[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkAuth()
    fetchClientes()
  }, [])

  useEffect(() => {
    if (selectedCliente) {
      fetchTokens()
    } else {
      setTokens([])
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

  const fetchTokens = async () => {
    if (!selectedCliente) return

    setLoading(true)
    try {
      const res = await fetch(`/api/meta/tokens?cliente_id=${selectedCliente}`)
      const data = await res.json()
      setTokens(data.tokens || [])
    } catch (error) {
      console.error('Error fetching tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCliente || !pageId || !pageName || !pageAccessToken) {
      setMessage('Error: Todos los campos son requeridos')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/meta/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: selectedCliente,
          page_id: pageId,
          page_name: pageName,
          page_access_token: pageAccessToken
        })
      })

      if (res.ok) {
        setMessage('Token agregado exitosamente')
        setPageId('')
        setPageName('')
        setPageAccessToken('')
        fetchTokens()
      } else {
        const data = await res.json()
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error adding token:', error)
      setMessage('Error al agregar token')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (tokenId: string) => {
    if (!confirm('¿Estás seguro de eliminar este token?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/meta/tokens?token_id=${tokenId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setMessage('Token eliminado exitosamente')
        fetchTokens()
      } else {
        setMessage('Error al eliminar token')
      }
    } catch (error) {
      console.error('Error deleting token:', error)
      setMessage('Error al eliminar token')
    } finally {
      setLoading(false)
    }
  }

  const handleSyncLeads = async (pageId: string) => {
    setLoading(true)
    setMessage('Sincronizando leads...')

    try {
      const res = await fetch('/api/meta/sync-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_id: pageId })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || 'Leads sincronizados exitosamente')
      } else {
        setMessage(`Error: ${data.error || 'Error al sincronizar leads'}`)
      }
    } catch (error) {
      console.error('Error syncing leads:', error)
      setMessage('Error al sincronizar leads')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Page Access Tokens
          </h1>
          <p className="text-gray-600">
            Agrega manualmente los Page Access Tokens de Facebook para cada cliente
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

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-blue-900 mb-3">
            📖 Cómo obtener un Page Access Token
          </h2>
          <ol className="text-sm text-blue-800 space-y-2">
            <li>1. Ve a <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="underline">Graph API Explorer</a></li>
            <li>2. Selecciona tu App en el dropdown</li>
            <li>3. Haz clic en "Get Token" → "Get Page Access Token"</li>
            <li>4. Selecciona la página de Facebook</li>
            <li>5. Acepta los permisos (pages_show_list, pages_read_engagement, leads_retrieval)</li>
            <li>6. Copia el token generado y pégalo aquí</li>
          </ol>
        </div>

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

        {/* Formulario para agregar token */}
        {selectedCliente && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Agregar Nuevo Page Access Token
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page ID
                </label>
                <input
                  type="text"
                  value={pageId}
                  onChange={(e) => setPageId(e.target.value)}
                  placeholder="123456789012345"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  El ID numérico de la página de Facebook
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Página
                </label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  placeholder="Mi Página de Facebook"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Access Token
                </label>
                <textarea
                  value={pageAccessToken}
                  onChange={(e) => setPageAccessToken(e.target.value)}
                  placeholder="EAAG..."
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  El token que obtuviste del Graph API Explorer
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Agregando...' : 'Agregar Token'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de tokens existentes */}
        {selectedCliente && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tokens Configurados
            </h2>

            {loading && !tokens.length ? (
              <p className="text-gray-500">Cargando...</p>
            ) : tokens.length === 0 ? (
              <p className="text-gray-500">No hay tokens configurados para este cliente</p>
            ) : (
              <div className="space-y-3">
                {tokens.map(token => (
                  <div
                    key={token.id}
                    className="border border-gray-200 rounded-lg p-4 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {token.page_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Page ID: {token.page_id}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Token: {token.page_access_token.substring(0, 20)}...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Agregado: {new Date(token.created_at).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSyncLeads(token.page_id)}
                        disabled={loading}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Sincronizar Leads
                      </button>
                      <button
                        onClick={() => handleDelete(token.id)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
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
