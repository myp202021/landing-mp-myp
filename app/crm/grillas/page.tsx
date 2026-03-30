'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import GrillaStatusBadge from '@/app/components/crm/GrillaStatusBadge'
import { MOCK_CLIENTES, GrillaEstado } from '@/app/components/crm/grillas-mock-data'

export default function GrillasAdminPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<GrillaEstado | 'todos'>('todos')

  const clientesFiltrados = MOCK_CLIENTES.filter(c => {
    const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.rubro.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'todos' || c.grilla_estado === filtroEstado
    return matchSearch && matchEstado
  })

  const stats = {
    total: MOCK_CLIENTES.length,
    aprobadas: MOCK_CLIENTES.filter(c => c.grilla_estado === 'aprobado').length,
    en_revision: MOCK_CLIENTES.filter(c => c.grilla_estado === 'en_revision').length,
    sin_grilla: MOCK_CLIENTES.filter(c => c.grilla_estado === 'sin_grilla').length,
  }

  return (
    <CRMLayout title="Grillas de Contenido">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricBox label="Clientes Activos" value={stats.total} icon="👥" color="blue" />
          <MetricBox label="Aprobadas (Marzo)" value={stats.aprobadas} icon="✅" color="green" />
          <MetricBox label="En Revisión" value={stats.en_revision} icon="⏳" color="yellow" />
          <MetricBox label="Sin Grilla" value={stats.sin_grilla} icon="⚠️" color="red" />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value as GrillaEstado | 'todos')}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los estados</option>
            <option value="sin_grilla">Sin Grilla</option>
            <option value="borrador">Borrador</option>
            <option value="en_revision">En Revisión</option>
            <option value="aprobado">Aprobado</option>
            <option value="enviado">Enviado</option>
          </select>
          <div className="flex items-center px-4 py-2.5 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-200">
            📅 Marzo 2026
          </div>
        </div>

        {/* Tabla de clientes */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rubro</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado Grilla</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actualización</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(cliente => (
                  <tr
                    key={cliente.id}
                    className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition"
                    onClick={() => router.push(`/crm/grillas/${cliente.id}`)}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{cliente.nombre}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{cliente.rubro}</td>
                    <td className="px-6 py-4"><GrillaStatusBadge estado={cliente.grilla_estado} /></td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{cliente.actualizado_en || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                        Ver Grilla →
                      </button>
                    </td>
                  </tr>
                ))}
                {clientesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                      No se encontraron clientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-gray-100">
            {clientesFiltrados.map(cliente => (
              <div
                key={cliente.id}
                className="p-4 hover:bg-blue-50/50 cursor-pointer transition"
                onClick={() => router.push(`/crm/grillas/${cliente.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{cliente.nombre}</span>
                  <GrillaStatusBadge estado={cliente.grilla_estado} />
                </div>
                <p className="text-sm text-gray-500">{cliente.rubro}</p>
                {cliente.actualizado_en && (
                  <p className="text-xs text-gray-400 mt-1">Actualizado: {cliente.actualizado_en}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CRMLayout>
  )
}

function MetricBox({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
  }
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
