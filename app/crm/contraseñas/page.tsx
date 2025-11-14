'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'

interface Usuario {
  id: number
  username: string
  nombre: string
  rol: 'admin' | 'cliente'
  cliente_id?: string
  actualizado_en?: string
  clientes?: {
    nombre: string
  }
}

export default function ContrasenasPage() {
  const { isAuthenticated, user } = useSimpleAuth()
  const router = useRouter()

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [resetting, setResetting] = useState(false)

  // Redirigir si no es admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/crm/login')
    } else if (user?.role !== 'admin') {
      router.push('/crm')
    } else {
      loadUsuarios()
    }
  }, [isAuthenticated, user, router])

  const loadUsuarios = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/crm/usuarios')
      const data = await res.json()
      setUsuarios(data.usuarios || [])
    } catch (error) {
      console.error('Error cargando usuarios:', error)
    }
    setLoading(false)
  }

  const openResetModal = (usuario: Usuario) => {
    setSelectedUser(usuario)
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
  }

  const validatePassword = (): boolean => {
    if (!newPassword) {
      setPasswordError('Ingresa una contraseña')
      return false
    }

    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres')
      return false
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return false
    }

    setPasswordError('')
    return true
  }

  const handleResetPassword = async () => {
    if (!validatePassword() || !selectedUser) return

    setResetting(true)

    try {
      const res = await fetch('/api/crm/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedUser.id,
          password: newPassword
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert(`Contraseña actualizada exitosamente para ${selectedUser.nombre}`)
        closeModal()
        loadUsuarios()
      } else {
        setPasswordError(data.error || 'Error actualizando contraseña')
      }
    } catch (error) {
      console.error('Error:', error)
      setPasswordError('Error al conectar con el servidor')
    }

    setResetting(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated || user?.role !== 'admin') {
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
      <CRMLayout title="Gestión de Contraseñas" authenticated onRefresh={loadUsuarios}>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="Gestión de Contraseñas" authenticated onRefresh={loadUsuarios}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Gestión de Contraseñas
        </h2>
        <p className="text-gray-600 mt-2">
          Administra las contraseñas de todos los usuarios del sistema
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-blue-900 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Usuarios del Sistema</h3>
        </div>

        {usuarios.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay usuarios
            </h3>
            <p className="text-gray-600">
              No se encontraron usuarios en el sistema
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Cliente Asignado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Última Actualización
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map(usuario => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {usuario.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{usuario.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {usuario.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {usuario.rol === 'admin' ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                          Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                          Cliente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {usuario.cliente_id ? (
                        <span>{usuario.clientes?.nombre || `ID: ${usuario.cliente_id}`}</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(usuario.actualizado_en)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openResetModal(usuario)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-sm"
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Reset Password */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Reset Password</h2>
              <p className="text-orange-100 text-sm mt-1">
                {selectedUser.nombre} ({selectedUser.username})
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nueva Contraseña *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="Mínimo 8 caracteres"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="Repite la contraseña"
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium">{passwordError}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-xs">
                  <strong>Requisitos:</strong> La contraseña debe tener al menos 8 caracteres.
                  Se recomienda usar una combinación de letras, números y símbolos.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={closeModal}
                  variant="secondary"
                  disabled={resetting}
                >
                  Cancelar
                </Button>
                <button
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetting ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  )
}
