'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'

interface Cliente {
  id: number
  nombre: string
  email: string
  empresa?: string
  telefono?: string
  activo: boolean
  creado_en: string
  leads?: { count: number }[]
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    telefono: ''
  })

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      const res = await fetch('/api/crm/clientes')
      const data = await res.json()
      setClientes(data.clientes || [])
    } catch (error) {
      console.error('Error cargando clientes:', error)
      alert('Error cargando clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (cliente?: Cliente) => {
    if (cliente) {
      setEditingCliente(cliente)
      setFormData({
        nombre: cliente.nombre,
        email: cliente.email,
        empresa: cliente.empresa || '',
        telefono: cliente.telefono || ''
      })
    } else {
      setEditingCliente(null)
      setFormData({
        nombre: '',
        email: '',
        empresa: '',
        telefono: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCliente(null)
    setFormData({
      nombre: '',
      email: '',
      empresa: '',
      telefono: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.email) {
      alert('Nombre y Email son obligatorios')
      return
    }

    try {
      if (editingCliente) {
        // Actualizar cliente
        const res = await fetch('/api/crm/clientes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCliente.id,
            ...formData
          })
        })

        if (!res.ok) throw new Error('Error actualizando cliente')

        alert('Cliente actualizado correctamente')
      } else {
        // Crear nuevo cliente
        const res = await fetch('/api/crm/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (!res.ok) throw new Error('Error creando cliente')

        alert('Cliente creado correctamente')
      }

      handleCloseModal()
      loadClientes()
    } catch (error) {
      console.error('Error guardando cliente:', error)
      alert('Error guardando cliente')
    }
  }

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el cliente "${nombre}"?\n\nEsto eliminará también todos los leads y cotizaciones asociados.`)) {
      return
    }

    try {
      const res = await fetch(`/api/crm/clientes?id=${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Error eliminando cliente')

      alert('Cliente eliminado correctamente')
      loadClientes()
    } catch (error) {
      console.error('Error eliminando cliente:', error)
      alert('Error eliminando cliente')
    }
  }

  const getTotalLeads = (cliente: Cliente) => {
    if (!cliente.leads || cliente.leads.length === 0) return 0
    return cliente.leads[0]?.count || 0
  }

  if (loading) {
    return (
      <CRMLayout title="Clientes" authenticated onRefresh={loadClientes}>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Cargando clientes...</p>
          </div>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="Gestión de Clientes" authenticated onRefresh={loadClientes}>
      {/* Header con botón crear */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-600 mt-1">
            Total: {clientes.length} cliente{clientes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
        >
          + Nuevo Cliente
        </Button>
      </div>

      {/* Tabla de clientes */}
      {clientes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay clientes registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer cliente para empezar a gestionar leads y cotizaciones
          </p>
          <Button onClick={() => handleOpenModal()} variant="primary">
            Crear Primer Cliente
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leads
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
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{cliente.nombre}</div>
                      <div className="text-sm text-gray-500">{cliente.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">
                        {cliente.empresa || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">
                        {cliente.telefono || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTotalLeads(cliente)} leads
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cliente.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cliente.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleOpenModal(cliente)}
                        className="text-blue-600 hover:text-blue-900 font-medium mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id, cliente.nombre)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para crear/editar cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-blue-900 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-xl font-bold">
                {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre de la empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  variant="secondary"
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                >
                  {editingCliente ? 'Guardar Cambios' : 'Crear Cliente'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CRMLayout>
  )
}
