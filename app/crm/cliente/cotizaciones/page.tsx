'use client'

import { useState, useEffect } from 'react'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CotizacionCard from '@/app/components/crm/CotizacionCard'

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

export default function ClienteCotizacionesPage() {
  const { user, isAuthenticated } = useSimpleAuth()
  const router = useRouter()
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)
  const [filterEstado, setFilterEstado] = useState<string>('all')

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/crm/login')
      return
    }

    if (user.role !== 'cliente') {
      router.push('/crm')
      return
    }

    loadData()
  }, [isAuthenticated, user, router])

  const loadData = async () => {
    if (!user?.cliente_id) return

    setLoading(true)
    try {
      const res = await fetch('/api/crm/cotizaciones')
      const data = await res.json()

      // Filtrar solo las cotizaciones de este cliente
      const misCotizaciones = (data.cotizaciones || []).filter(
        (cot: Cotizacion) => cot.cliente_id === user.cliente_id
      )

      setCotizaciones(misCotizaciones)
    } catch (error) {
      console.error('Error cargando cotizaciones:', error)
    }
    setLoading(false)
  }

  const filteredCotizaciones = cotizaciones.filter(cot => {
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

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Cotizaciones</h1>
              <p className="text-blue-200 mt-1">Sistema de Gestión de Clientes · M&P Marketing y Performance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition"
                aria-label="Actualizar datos"
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
                Cerrar Sesión
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
            <div className="flex items-center gap-2 px-4 py-4 text-blue-600 font-semibold border-b-2 border-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Cotizaciones
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido, {user.nombre}</h2>
          <p className="text-gray-600">Aquí puedes ver tus cotizaciones generadas por M&P</p>
        </div>

        {/* Métricas */}
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

        {/* Filtros (SOLO por estado, NO por cliente) */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
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
            <div className="flex-1">
              <p className="text-sm text-gray-600 italic">
                Las cotizaciones son generadas por M&P Marketing y Performance
              </p>
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
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-lg mb-2">No hay cotizaciones que mostrar</p>
            <p className="text-gray-500 text-sm">M&P generará cotizaciones para ti cuando sea necesario</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCotizaciones.map(cotizacion => (
              <CotizacionCard
                key={cotizacion.id}
                id={cotizacion.id}
                nombre_proyecto={cotizacion.nombre_proyecto}
                cliente_nombre={cotizacion.clientes?.nombre || cotizacion.cliente_nombre || user.nombre}
                total={cotizacion.total}
                estado={cotizacion.estado}
                creado_en={cotizacion.creado_en}
                enviada_en={cotizacion.enviada_en}
                aceptada_en={cotizacion.aceptada_en}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
