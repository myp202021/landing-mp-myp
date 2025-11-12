'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'

interface Cliente {
  id: string
  nombre: string
  rubro: string
}

interface Usuario {
  id: number
  username: string
  nombre: string
  rol: 'admin' | 'cliente'
  cliente_id: string | null
  activo: boolean
  creado_en: string
  clientes?: Cliente
}

export default function UsuariosPage() {
  const { user, permissions } = useSimpleAuth()
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Formulario
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
    rol: 'cliente' as 'admin' | 'cliente',
    cliente_id: ''
  })

  // Verificar permisos
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/crm')
    }
  }, [user, router])

  // Cargar usuarios y clientes
  useEffect(() => {
    if (user?.role === 'admin') {
      loadUsuarios()
      loadClientes()
    }
  }, [user])

  const loadUsuarios = async () => {
    try {
      const res = await fetch('/api/crm/usuarios')
      if (!res.ok) throw new Error('Error cargando usuarios')
      const data = await res.json()
      setUsuarios(data.usuarios || [])
    } catch (error: any) {
      setError('Error cargando usuarios: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadClientes = async () => {
    try {
      const res = await fetch('/api/crm/clientes')
      if (!res.ok) throw new Error('Error cargando clientes')
      const data = await res.json()
      setClientes(data.clientes || [])
    } catch (error: any) {
      console.error('Error cargando clientes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingUser) {
        // Editar usuario existente
        const res = await fetch('/api/crm/usuarios', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingUser.id,
            username: formData.username,
            password: formData.password || undefined, // Solo enviar si hay nueva contraseña
            nombre: formData.nombre
          })
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Error actualizando usuario')
        }

        setSuccess('Usuario actualizado exitosamente')
      } else {
        // Crear nuevo usuario
        console.log('📤 Enviando datos:', formData)
        const res = await fetch('/api/crm/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        const responseData = await res.json()
        console.log('📥 Respuesta del servidor:', responseData)

        if (!res.ok) {
          // Mostrar el error detallado del servidor
          const errorMsg = responseData.details
            ? `${responseData.error}: ${responseData.details}`
            : responseData.error || 'Error creando usuario'
          throw new Error(errorMsg)
        }

        setSuccess('Usuario creado exitosamente')
      }

      setShowModal(false)
      setFormData({
        username: '',
        password: '',
        nombre: '',
        role: 'cliente',
        cliente_id: ''
      })
      setEditingUser(null)
      loadUsuarios()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario)
    setFormData({
      username: usuario.username,
      password: '', // No prellenar contraseña por seguridad
      nombre: usuario.nombre,
      rol: usuario.rol,
      cliente_id: usuario.cliente_id || ''
    })
    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (usuario: Usuario) => {
    if (!confirm(`¿Estás seguro de eliminar el usuario "${usuario.username}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/crm/usuarios?id=${usuario.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error eliminando usuario')
      }

      setSuccess('Usuario eliminado exitosamente')
      loadUsuarios()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleToggleActivo = async (usuario: Usuario) => {
    try {
      const res = await fetch('/api/crm/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: usuario.id,
          activo: !usuario.activo
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error actualizando usuario')
      }

      setSuccess(`Usuario ${!usuario.activo ? 'activado' : 'desactivado'} exitosamente`)
      loadUsuarios()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({
      username: '',
      password: '',
      nombre: '',
      rol: 'cliente',
      cliente_id: ''
    })
    setShowModal(true)
    setError('')
    setSuccess('')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Crear y administrar usuarios del CRM</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Usuario</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Nombre</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rol</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Cliente Asignado</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Creado</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-semibold text-gray-900">
                    {usuario.username}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-900">{usuario.nombre}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    usuario.rol === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {usuario.rol === 'admin' ? 'Admin' : 'Cliente'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {usuario.clientes ? (
                    <div>
                      <div className="font-semibold text-gray-900">{usuario.clientes.nombre}</div>
                      <div className="text-xs text-gray-500">{usuario.clientes.rubro}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Sin cliente</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActivo(usuario)}
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      usuario.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {new Date(usuario.creado_en).toLocaleDateString('es-CL')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    Editar
                  </button>
                  {usuario.username !== 'admin' && (
                    <button
                      onClick={() => handleDelete(usuario)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuarios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay usuarios registrados</p>
          </div>
        )}
      </div>

      {/* Modal de crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={!!editingUser} // No se puede cambiar username al editar
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition text-gray-900 disabled:bg-gray-100"
                  placeholder="usuario123"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña {editingUser && '(dejar en blanco para no cambiar)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition text-gray-900"
                  placeholder="••••••••"
                />
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition text-gray-900"
                  placeholder="Juan Pérez"
                />
              </div>

              {/* Rol - solo al crear */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'admin' | 'cliente' })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition text-gray-900"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              {/* Cliente - solo si rol es cliente */}
              {formData.rol === 'cliente' && !editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cliente asignado
                  </label>
                  <select
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition text-gray-900"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} - {cliente.rubro}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
