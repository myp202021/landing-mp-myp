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

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewUserForm, setShowNewUserForm] = useState(false)

  // Form state
  const [newUser, setNewUser] = useState({
    id: '',
    email: '',
    nombre: '',
    cliente_id: '',
    rol: 'cliente' as 'admin' | 'cliente'
  })

  // Cargar usuarios y clientes
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usuariosRes, clientesRes] = await Promise.all([
        fetch('/api/crm/usuarios'),
        fetch('/api/crm/clientes')
      ])

      const usuariosData = await usuariosRes.json()
      const clientesData = await clientesRes.json()

      setUsuarios(usuariosData.usuarios || [])
      setClientes(clientesData.clientes || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUser.id || !newUser.email || !newUser.cliente_id) {
      alert('ID (auth_user_id), email y cliente son requeridos')
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
      setNewUser({ id: '', email: '', nombre: '', cliente_id: '', rol: 'cliente' })
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600 mt-1">Panel de administración M&P</p>
            </div>
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
                    ID Usuario (auth_user_id de Supabase Auth) *
                  </label>
                  <input
                    type="text"
                    value={newUser.id}
                    onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    UUID del usuario creado en Supabase Auth
                  </p>
                </div>

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
      </div>
    </div>
  )
}
