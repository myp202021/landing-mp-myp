'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CRMLayout from '@/app/components/crm/CRMLayout'
import CotizacionCard from '@/app/components/crm/CotizacionCard'
import Button from '@/app/components/crm/Button'

interface Cliente {
  id: string
  nombre: string
  rubro?: string
}

interface Lead {
  id: number
  nombre?: string
  email?: string
}

interface Cotizacion {
  id: number
  cliente_id: string
  lead_id?: number
  nombre_proyecto: string
  cliente_nombre?: string
  cliente_email?: string
  subtotal: number
  descuento?: number
  total: number
  notas?: string
  estado: string
  creado_en: string
  enviada_en?: string
  aceptada_en?: string
  clientes?: Cliente
  leads?: Lead
}

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCliente, setFilterCliente] = useState<string>('all')
  const [filterEstado, setFilterEstado] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [resCotizaciones, resClientes] = await Promise.all([
        fetch('/api/crm/cotizaciones'),
        fetch('/api/crm/clientes')
      ])

      const dataCotizaciones = await resCotizaciones.json()
      const dataClientes = await resClientes.json()

      setCotizaciones(dataCotizaciones.cotizaciones || [])
      setClientes(dataClientes.clientes || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  const filteredCotizaciones = cotizaciones.filter(cot => {
    if (filterCliente !== 'all' && cot.cliente_id !== filterCliente) return false
    if (filterEstado !== 'all' && cot.estado !== filterEstado) return false
    return true
  })

  const estadosCounts = {
    borrador: cotizaciones.filter(c => c.estado === 'borrador').length,
    enviada: cotizaciones.filter(c => c.estado === 'enviada').length,
    aceptada: cotizaciones.filter(c => c.estado === 'aceptada').length,
    rechazada: cotizaciones.filter(c => c.estado === 'rechazada').length,
  }

  const totalVendido = cotizaciones
    .filter(c => c.estado === 'aceptada')
    .reduce((sum, c) => sum + Number(c.total), 0)

  return (
    <CRMLayout title="Cotizaciones" onRefresh={loadData}>
      {/* Metricas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Total</div>
          <div className="text-3xl font-bold text-blue-900">{cotizaciones.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Borradores</div>
          <div className="text-3xl font-bold text-gray-900">{estadosCounts.borrador}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Enviadas</div>
          <div className="text-3xl font-bold text-blue-600">{estadosCounts.enviada}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Aceptadas</div>
          <div className="text-3xl font-bold text-green-600">{estadosCounts.aceptada}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-1">Total Vendido</div>
          <div className="text-2xl font-bold text-green-600">
            ${totalVendido.toLocaleString('es-CL')}
          </div>
        </div>
      </div>

      {/* Filtros y boton nuevo */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filtrar por Cliente
            </label>
            <select
              value={filterCliente}
              onChange={(e) => setFilterCliente(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="all">Todos los clientes</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filtrar por Estado
            </label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="all">Todos los estados</option>
              <option value="borrador">Borrador</option>
              <option value="enviada">Enviada</option>
              <option value="aceptada">Aceptada</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>

          <div>
            <Link href="/crm/cotizaciones/nueva">
              <Button variant="success" className="whitespace-nowrap">
                + Nueva Cotizacion
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Lista de cotizaciones */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-4">Cargando cotizaciones...</p>
        </div>
      ) : filteredCotizaciones.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
          <p className="text-gray-600 text-lg">No hay cotizaciones que mostrar</p>
          <Link href="/crm/cotizaciones/nueva">
            <Button variant="primary" className="mt-4">
              Crear primera cotizacion
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCotizaciones.map(cotizacion => (
            <CotizacionCard
              key={cotizacion.id}
              id={cotizacion.id}
              nombre_proyecto={cotizacion.nombre_proyecto}
              cliente_nombre={cotizacion.clientes?.nombre || cotizacion.cliente_nombre || 'Sin cliente'}
              total={cotizacion.total}
              estado={cotizacion.estado}
              creado_en={cotizacion.creado_en}
              enviada_en={cotizacion.enviada_en}
              aceptada_en={cotizacion.aceptada_en}
            />
          ))}
        </div>
      )}
    </CRMLayout>
  )
}
