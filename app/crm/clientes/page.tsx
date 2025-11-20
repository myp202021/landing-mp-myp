'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CRMLayout from '@/app/components/crm/CRMLayout'
import Button from '@/app/components/crm/Button'

interface Cliente {
  id: string  // UUID
  nombre: string
  contacto_nombre?: string
  contacto_email?: string
  contacto_telefono?: string
  rubro?: string
  inversion_mensual?: number
  zapier_webhook_url?: string
  zapier_activo?: boolean
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
    contacto_nombre: '',
    contacto_email: '',
    contacto_telefono: '',
    rubro: '',
    inversion_mensual: '',
    zapier_webhook_url: '',
    zapier_activo: false
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
        contacto_nombre: cliente.contacto_nombre || '',
        contacto_email: cliente.contacto_email || '',
        contacto_telefono: cliente.contacto_telefono || '',
        rubro: cliente.rubro || '',
        inversion_mensual: cliente.inversion_mensual ? String(cliente.inversion_mensual) : '',
        zapier_webhook_url: cliente.zapier_webhook_url || '',
        zapier_activo: cliente.zapier_activo || false
      })
    } else {
      setEditingCliente(null)
      setFormData({
        nombre: '',
        contacto_nombre: '',
        contacto_email: '',
        contacto_telefono: '',
        rubro: '',
        inversion_mensual: '',
        zapier_webhook_url: '',
        zapier_activo: false
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCliente(null)
    setFormData({
      nombre: '',
      contacto_nombre: '',
      contacto_email: '',
      contacto_telefono: '',
      rubro: '',
      inversion_mensual: '',
      zapier_webhook_url: '',
      zapier_activo: false
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre) {
      alert('Nombre es obligatorio')
      return
    }

    try {
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre,
        contacto_nombre: formData.contacto_nombre || null,
        contacto_email: formData.contacto_email || null,
        contacto_telefono: formData.contacto_telefono || null,
        rubro: formData.rubro,
        inversion_mensual: formData.inversion_mensual ? parseFloat(formData.inversion_mensual) : null,
        zapier_webhook_url: formData.zapier_webhook_url || null,
        zapier_activo: formData.zapier_activo
      }

      if (editingCliente) {
        // Actualizar cliente
        const res = await fetch('/api/crm/clientes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCliente.id,
            ...dataToSend
          })
        })

        if (!res.ok) throw new Error('Error actualizando cliente')

        alert('Cliente actualizado correctamente')
      } else {
        // Crear nuevo cliente
        const res = await fetch('/api/crm/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
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

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el cliente "${nombre}"?\n\nEsto eliminará también todos los leads y cotizaciones asociados.`)) {
      return
    }

    const deletingButton = document.querySelector(`button[data-delete-id="${id}"]`)
    const originalText = deletingButton?.textContent || 'Eliminar'

    try {
      if (deletingButton) {
        deletingButton.textContent = 'Eliminando...'
        deletingButton.setAttribute('disabled', 'true')
      }

      const res = await fetch(`/api/crm/clientes?id=${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Error eliminando cliente')

      alert('Cliente eliminado correctamente')
      loadClientes()
    } catch (error) {
      console.error('Error eliminando cliente:', error)
      alert('Error eliminando cliente')
    } finally {
      if (deletingButton) {
        deletingButton.textContent = originalText
        deletingButton.removeAttribute('disabled')
      }
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
                    Rubro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inversión Mensual
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
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{cliente.nombre}</div>
                      {cliente.contacto_nombre && (
                        <div className="text-sm text-gray-600 mt-1">
                          👤 {cliente.contacto_nombre}
                          {cliente.contacto_email && (
                            <span className="ml-2">· {cliente.contacto_email}</span>
                          )}
                          {cliente.contacto_telefono && (
                            <span className="ml-2">· {cliente.contacto_telefono}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">
                        {cliente.rubro || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-semibold">
                        {cliente.inversion_mensual
                          ? `$${cliente.inversion_mensual.toLocaleString('es-CL')}`
                          : '-'}
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
                        data-delete-id={cliente.id}
                        onClick={() => handleDelete(cliente.id, cliente.nombre)}
                        className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Nombre Empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Nombre de la empresa"
                  />
                </div>

                {/* Datos de Persona de Contacto */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Persona de Contacto</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={formData.contacto_nombre}
                        onChange={(e) => setFormData({ ...formData, contacto_nombre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.contacto_email}
                        onChange={(e) => setFormData({ ...formData, contacto_email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="contacto@empresa.cl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.contacto_telefono}
                        onChange={(e) => setFormData({ ...formData, contacto_telefono: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rubro
                  </label>
                  <input
                    type="text"
                    value={formData.rubro}
                    onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Marketing Digital, E-commerce, Servicios B2B"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inversión Mensual (CLP)
                  </label>
                  <input
                    type="number"
                    value={formData.inversion_mensual}
                    onChange={(e) => setFormData({ ...formData, inversion_mensual: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5000000"
                    min="0"
                    step="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Inversión mensual en publicidad para calcular CPF y ROA
                  </p>
                </div>

                {/* Configuración de Zapier/Meta Leads */}
                {editingCliente && (
                  <>
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Integración Zapier / Meta Leads</h4>

                      <div className="mb-3 bg-blue-50 p-3 rounded-md">
                        <p className="text-xs font-medium text-blue-900 mb-1">URL del Webhook para Zapier:</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={`https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id=${editingCliente.id}`}
                            readOnly
                            className="flex-1 px-2 py-1 text-xs font-mono bg-white border border-blue-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`https://www.mulleryperez.cl/api/webhooks/meta-leads?cliente_id=${editingCliente.id}`)
                              alert('URL copiada al portapapeles')
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Copiar
                          </button>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          Pega esta URL en Zapier como destino del Webhook POST
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL de Retorno (opcional)
                        </label>
                        <input
                          type="url"
                          value={formData.zapier_webhook_url}
                          onChange={(e) => setFormData({ ...formData, zapier_webhook_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          URL del Zap creado (para referencia interna)
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="zapier_activo"
                          checked={formData.zapier_activo}
                          onChange={(e) => setFormData({ ...formData, zapier_activo: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="zapier_activo" className="ml-2 block text-sm text-gray-900">
                          Activar integración de Zapier
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-6">
                        Debe estar activo para recibir leads desde Meta Ads
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  variant="secondary"
                  className="w-full"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
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
