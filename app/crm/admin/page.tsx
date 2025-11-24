'use client'

/**
 * ADMIN PAGE - Gestión de usuarios
 * Solo accesible para admin M&P
 */

import { useState, useEffect } from 'react'

interface Cliente {
  id: string
  nombre: string
  rubro: string | null
  meta_page_id: string | null
  meta_form_id: string | null
  sync_meta_activo: boolean
  ultima_sync_meta: string | null
}

interface Usuario {
  id: string
  email: string
  nombre: string | null
  cliente_id: string
  rol: 'admin' | 'cliente'
  activo: boolean
  creado_en: string
  cliente?: Cliente
}

interface PlantillaCotizacion {
  id: string
  nombre: string
  contenido: {
    titulo: string
    subtitulo: string
    cliente: {
      nombre: string
      contacto: string
      website: string
      telefono: string
    }
    objetivo: string
    alcance: Array<{
      area: string
      entregable: string
      detalle: string
    }>
    kpis: Array<{
      nombre: string
      frecuencia: string
    }>
    equipo: Array<{
      rol: string
      funcion: string
    }>
    precio: {
      concepto: string
      valor_mensual: number
      iva: number
      duracion_minima_meses: number
      forma_pago: string
    }
  }
  activo: boolean
  creado_en: string
  actualizado_en: string
}

type TabType = 'usuarios' | 'clientes' | 'cotizaciones'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('usuarios')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [plantillas, setPlantillas] = useState<PlantillaCotizacion[]>([])
  const [selectedPlantilla, setSelectedPlantilla] = useState<PlantillaCotizacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [showNewClientForm, setShowNewClientForm] = useState(false)

  // Form state
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    nombre: '',
    cliente_id: '',
    rol: 'cliente' as 'admin' | 'cliente'
  })

  const [newClient, setNewClient] = useState({
    nombre: '',
    rubro: '',
    meta_page_id: '',
    meta_form_id: '',
    sync_meta_activo: false
  })

  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)

  // Cargar usuarios y clientes
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usuariosRes, clientesRes, plantillasRes] = await Promise.all([
        fetch('/api/crm/usuarios'),
        fetch('/api/crm/clientes'),
        fetch('/api/crm/plantillas-cotizacion')
      ])

      const usuariosData = await usuariosRes.json()
      const clientesData = await clientesRes.json()
      const plantillasData = await plantillasRes.json()

      setUsuarios(usuariosData.usuarios || [])
      setClientes(clientesData.clientes || [])
      setPlantillas(plantillasData.plantillas || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUser.email || !newUser.password || !newUser.cliente_id) {
      alert('Email, password y cliente son requeridos')
      return
    }

    if (newUser.password.length < 6) {
      alert('El password debe tener al menos 6 caracteres')
      return
    }

    try {
      const res = await fetch('/api/crm/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      alert('Usuario creado exitosamente')
      setShowNewUserForm(false)
      setNewUser({ email: '', password: '', nombre: '', cliente_id: '', rol: 'cliente' })
      fetchData()
    } catch (error: any) {
      console.error('Error creating user:', error)
      alert('Error creando usuario: ' + error.message)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/crm/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, activo: !currentStatus })
      })

      if (!res.ok) {
        throw new Error('Error updating user')
      }

      fetchData()
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Error actualizando usuario')
    }
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newClient.nombre) {
      alert('El nombre del cliente es requerido')
      return
    }

    try {
      const res = await fetch('/api/crm/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      alert('Cliente creado exitosamente')
      setShowNewClientForm(false)
      setNewClient({ nombre: '', rubro: '', meta_page_id: '', meta_form_id: '', sync_meta_activo: false })
      fetchData()
    } catch (error: any) {
      console.error('Error creating client:', error)
      alert('Error creando cliente: ' + error.message)
    }
  }

  const handleUpdateCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCliente) return

    try {
      const res = await fetch('/api/crm/clientes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCliente.id,
          nombre: editingCliente.nombre,
          rubro: editingCliente.rubro,
          meta_page_id: editingCliente.meta_page_id || null,
          meta_form_id: editingCliente.meta_form_id || null,
          sync_meta_activo: editingCliente.sync_meta_activo
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      alert('Cliente actualizado exitosamente')
      setEditingCliente(null)
      fetchData()
    } catch (error: any) {
      console.error('Error updating client:', error)
      alert('Error actualizando cliente: ' + error.message)
    }
  }

  const deleteAllLeads = async (clienteId: string, clienteNombre: string) => {
    if (!confirm(`¿ELIMINAR TODOS LOS LEADS de "${clienteNombre}"? Esta acción NO se puede deshacer.`)) {
      return
    }

    try {
      const res = await fetch(`/api/crm/leads/bulk-delete?cliente_id=${clienteId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Error eliminando leads')
      }

      const data = await res.json()
      alert(`${data.deleted} leads eliminados exitosamente`)
      fetchData()
    } catch (error: any) {
      console.error('Error deleting leads:', error)
      alert('Error eliminando leads: ' + error.message)
    }
  }

  const deleteCliente = async (clienteId: string, clienteNombre: string) => {
    if (!confirm(`¿Eliminar cliente "${clienteNombre}"? Esto también desactivará todos los usuarios asociados.`)) {
      return
    }

    try {
      const res = await fetch(`/api/crm/clientes?id=${clienteId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Error eliminando cliente')
      }

      alert('Cliente eliminado exitosamente')
      fetchData()
    } catch (error: any) {
      console.error('Error deleting cliente:', error)
      alert('Error eliminando cliente: ' + error.message)
    }
  }

  const handleUpdatePlantilla = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlantilla) return

    try {
      const res = await fetch('/api/crm/plantillas-cotizacion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPlantilla.id,
          nombre: selectedPlantilla.nombre,
          contenido: selectedPlantilla.contenido
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      alert('Plantilla actualizada exitosamente')
      setSelectedPlantilla(null)
      fetchData()
    } catch (error: any) {
      console.error('Error updating plantilla:', error)
      alert('Error actualizando plantilla: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración M&P</h1>
            <p className="text-gray-600 mt-1">Gestión de usuarios, clientes y cotizaciones</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'usuarios'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Usuarios
              </button>
              <button
                onClick={() => setActiveTab('clientes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'clientes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🏢 Clientes
              </button>
              <button
                onClick={() => setActiveTab('cotizaciones')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cotizaciones'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📄 Cotizaciones M&P
              </button>
            </nav>
          </div>

          {/* Tab Content - Usuarios */}
          {activeTab === 'usuarios' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                <button
                  onClick={() => setShowNewUserForm(!showNewUserForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {showNewUserForm ? 'Cancelar' : '+ Nuevo Usuario'}
                </button>
              </div>

          {/* Formulario nuevo usuario */}
          {showNewUserForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="usuario@ejemplo.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={newUser.nombre}
                    onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                    placeholder="Juan Pérez"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente *
                  </label>
                  <select
                    value={newUser.cliente_id}
                    onChange={(e) => setNewUser({ ...newUser, cliente_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.rubro ? `(${c.rubro})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol *
                  </label>
                  <select
                    value={newUser.rol}
                    onChange={(e) => setNewUser({ ...newUser, rol: e.target.value as 'admin' | 'cliente' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Crear Usuario
                </button>
              </form>
            </div>
          )}

          {/* Tabla de usuarios */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Creado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{usuario.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{usuario.nombre || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {usuario.cliente?.nombre || '-'}
                      {usuario.cliente?.rubro && (
                        <span className="text-xs text-gray-500 ml-1">({usuario.cliente.rubro})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        usuario.rol === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        usuario.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(usuario.creado_en).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => toggleUserStatus(usuario.id, usuario.activo)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          usuario.activo
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {usuario.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuarios.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay usuarios registrados
              </div>
            )}
          </div>
            </div>
          )}

          {/* Tab Content - Clientes */}
          {activeTab === 'clientes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
              <button
                onClick={() => setShowNewClientForm(!showNewClientForm)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {showNewClientForm ? 'Cancelar' : '+ Nuevo Cliente'}
              </button>
            </div>

            {/* Formulario nuevo cliente */}
            {showNewClientForm && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Crear Nuevo Cliente</h3>
                <form onSubmit={handleCreateClient} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Cliente *
                    </label>
                    <input
                      type="text"
                      value={newClient.nombre}
                      onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })}
                      placeholder="Empresa ABC Ltda."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rubro
                    </label>
                    <input
                      type="text"
                      value={newClient.rubro}
                      onChange={(e) => setNewClient({ ...newClient, rubro: e.target.value })}
                      placeholder="E-commerce, Servicios, etc."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Integración Meta Lead Ads (Opcional)</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Si llenas estos campos, el sistema sincronizará leads automáticamente desde Meta cada día a las 8am.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Page ID
                        </label>
                        <input
                          type="text"
                          value={newClient.meta_page_id}
                          onChange={(e) => setNewClient({ ...newClient, meta_page_id: e.target.value })}
                          placeholder="123456789"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Form ID
                        </label>
                        <input
                          type="text"
                          value={newClient.meta_form_id}
                          onChange={(e) => setNewClient({ ...newClient, meta_form_id: e.target.value })}
                          placeholder="987654321"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newClient.sync_meta_activo}
                          onChange={(e) => setNewClient({ ...newClient, sync_meta_activo: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Activar sincronización automática</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Crear Cliente
                  </button>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rubro</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Meta Sync</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{cliente.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{cliente.rubro || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        {cliente.sync_meta_activo ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
                            ✓ Activo
                          </span>
                        ) : cliente.meta_page_id ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">
                            Configurado
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Manual</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        <button
                          onClick={() => setEditingCliente(cliente)}
                          className="px-3 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => window.location.href = `/crm/clientes/${cliente.id}`}
                          className="px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          Métricas
                        </button>
                        <button
                          onClick={() => deleteAllLeads(cliente.id, cliente.nombre)}
                          className="px-3 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200"
                        >
                          Limpiar
                        </button>
                        <button
                          onClick={() => deleteCliente(cliente.id, cliente.nombre)}
                          className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {clientes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay clientes registrados
                </div>
              )}
            </div>
            </div>
          )}

          {/* Tab Content - Cotizaciones M&P */}
          {activeTab === 'cotizaciones' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Plantillas de Cotización M&P</h2>
                <p className="text-gray-600 mt-1">Gestiona y edita plantillas para cotizaciones</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de plantillas */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Plantillas Disponibles</h3>
                  <div className="space-y-2">
                    {plantillas.map((plantilla) => (
                      <button
                        key={plantilla.id}
                        onClick={() => setSelectedPlantilla(JSON.parse(JSON.stringify(plantilla)))}
                        className={`w-full text-left p-4 rounded-lg border transition ${
                          selectedPlantilla?.id === plantilla.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{plantilla.nombre}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {plantilla.contenido.titulo}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Actualizado: {new Date(plantilla.actualizado_en).toLocaleDateString('es-CL')}
                        </div>
                      </button>
                    ))}
                    {plantillas.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No hay plantillas disponibles
                      </div>
                    )}
                  </div>
                </div>

                {/* Editor de plantilla */}
                <div className="lg:col-span-2">
                  {selectedPlantilla ? (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Editar Plantilla</h3>
                        <button
                          onClick={() => setSelectedPlantilla(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleUpdatePlantilla} className="space-y-4">
                        {/* Nombre de la plantilla */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de la Plantilla
                          </label>
                          <input
                            type="text"
                            value={selectedPlantilla.nombre}
                            onChange={(e) => setSelectedPlantilla({
                              ...selectedPlantilla,
                              nombre: e.target.value
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>

                        {/* Título */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título de la Cotización
                          </label>
                          <input
                            type="text"
                            value={selectedPlantilla.contenido.titulo}
                            onChange={(e) => setSelectedPlantilla({
                              ...selectedPlantilla,
                              contenido: {
                                ...selectedPlantilla.contenido,
                                titulo: e.target.value
                              }
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>

                        {/* Subtítulo */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtítulo
                          </label>
                          <input
                            type="text"
                            value={selectedPlantilla.contenido.subtitulo}
                            onChange={(e) => setSelectedPlantilla({
                              ...selectedPlantilla,
                              contenido: {
                                ...selectedPlantilla.contenido,
                                subtitulo: e.target.value
                              }
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>

                        {/* Objetivo */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Objetivo
                          </label>
                          <textarea
                            value={selectedPlantilla.contenido.objetivo}
                            onChange={(e) => setSelectedPlantilla({
                              ...selectedPlantilla,
                              contenido: {
                                ...selectedPlantilla.contenido,
                                objetivo: e.target.value
                              }
                            })}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>

                        {/* Precio */}
                        <div className="border-t border-gray-300 pt-4 mt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Información de Precio</h4>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Concepto
                              </label>
                              <input
                                type="text"
                                value={selectedPlantilla.contenido.precio.concepto}
                                onChange={(e) => setSelectedPlantilla({
                                  ...selectedPlantilla,
                                  contenido: {
                                    ...selectedPlantilla.contenido,
                                    precio: {
                                      ...selectedPlantilla.contenido.precio,
                                      concepto: e.target.value
                                    }
                                  }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valor Mensual (CLP)
                              </label>
                              <input
                                type="number"
                                value={selectedPlantilla.contenido.precio.valor_mensual}
                                onChange={(e) => setSelectedPlantilla({
                                  ...selectedPlantilla,
                                  contenido: {
                                    ...selectedPlantilla.contenido,
                                    precio: {
                                      ...selectedPlantilla.contenido.precio,
                                      valor_mensual: parseInt(e.target.value)
                                    }
                                  }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duración Mínima (meses)
                              </label>
                              <input
                                type="number"
                                value={selectedPlantilla.contenido.precio.duracion_minima_meses}
                                onChange={(e) => setSelectedPlantilla({
                                  ...selectedPlantilla,
                                  contenido: {
                                    ...selectedPlantilla.contenido,
                                    precio: {
                                      ...selectedPlantilla.contenido.precio,
                                      duracion_minima_meses: parseInt(e.target.value)
                                    }
                                  }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Forma de Pago
                              </label>
                              <input
                                type="text"
                                value={selectedPlantilla.contenido.precio.forma_pago}
                                onChange={(e) => setSelectedPlantilla({
                                  ...selectedPlantilla,
                                  contenido: {
                                    ...selectedPlantilla.contenido,
                                    precio: {
                                      ...selectedPlantilla.contenido.precio,
                                      forma_pago: e.target.value
                                    }
                                  }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                          >
                            Guardar Cambios
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedPlantilla(null)}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                          >
                            Cancelar
                          </button>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Nota:</strong> Esta versión permite editar los campos básicos.
                            Los campos avanzados (alcance, KPIs, equipo) se pueden editar en versiones futuras
                            o directamente en la base de datos.
                          </p>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-12 text-center">
                      <div className="text-gray-400 mb-2">📄</div>
                      <p className="text-gray-600">
                        Selecciona una plantilla de la lista para editarla
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Editar Cliente */}
        {editingCliente && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Editar Cliente</h2>
                <form onSubmit={handleUpdateCliente} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Cliente *
                    </label>
                    <input
                      type="text"
                      value={editingCliente.nombre}
                      onChange={(e) => setEditingCliente({ ...editingCliente, nombre: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rubro
                    </label>
                    <input
                      type="text"
                      value={editingCliente.rubro || ''}
                      onChange={(e) => setEditingCliente({ ...editingCliente, rubro: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Integración Meta Lead Ads</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Page ID
                        </label>
                        <input
                          type="text"
                          value={editingCliente.meta_page_id || ''}
                          onChange={(e) => setEditingCliente({ ...editingCliente, meta_page_id: e.target.value })}
                          placeholder="123456789"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Form ID
                        </label>
                        <input
                          type="text"
                          value={editingCliente.meta_form_id || ''}
                          onChange={(e) => setEditingCliente({ ...editingCliente, meta_form_id: e.target.value })}
                          placeholder="987654321"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingCliente.sync_meta_activo}
                          onChange={(e) => setEditingCliente({ ...editingCliente, sync_meta_activo: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Activar sincronización automática</span>
                      </label>
                    </div>

                    {editingCliente.ultima_sync_meta && (
                      <div className="mt-3 text-sm text-gray-600">
                        Última sincronización: {new Date(editingCliente.ultima_sync_meta).toLocaleString('es-CL')}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCliente(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
