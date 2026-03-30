'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CRMLayout from '@/app/components/crm/CRMLayout'
import GrillaStatusBadge from '@/app/components/crm/GrillaStatusBadge'
import type { GrillaEstado } from '@/app/components/crm/grillas-types'
import { MESES } from '@/app/components/crm/grillas-types'

interface ClienteRow {
  id: string
  nombre: string
  rubro: string
  grilla_estado: GrillaEstado | 'sin_grilla'
  actualizado_en: string
}

export default function GrillasAdminPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<ClienteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<GrillaEstado | 'sin_grilla' | 'todos'>('todos')
  const [mesNum, setMesNum] = useState(new Date().getMonth() + 1)
  const [anio, setAnio] = useState(new Date().getFullYear())

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // Load all active clients
      const clientesRes = await fetch('/api/crm/clientes')
      const clientesData = await clientesRes.json()
      const allClientes = (clientesData.clientes || []).filter((c: { activo: boolean }) => c.activo)

      // Load grillas for current month
      const grillasRes = await fetch(`/api/crm/grillas?mes=${mesNum}&anio=${anio}`)
      const grillasData = await grillasRes.json()
      const grillasMap = new Map<string, { estado: string; updated_at: string }>()
      for (const g of grillasData.grillas || []) {
        grillasMap.set(g.cliente_id, { estado: g.estado, updated_at: g.updated_at })
      }

      // Merge
      const merged: ClienteRow[] = allClientes.map((c: { id: string; nombre: string; rubro: string }) => {
        const g = grillasMap.get(c.id)
        return {
          id: c.id,
          nombre: c.nombre,
          rubro: c.rubro || '',
          grilla_estado: (g?.estado as GrillaEstado) || 'sin_grilla',
          actualizado_en: g?.updated_at ? new Date(g.updated_at).toLocaleDateString('es-CL') : '',
        }
      })

      setClientes(merged)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [mesNum, anio])

  useEffect(() => { loadData() }, [loadData])

  const navMes = (dir: -1 | 1) => {
    let m = mesNum + dir, a = anio
    if (m < 1) { m = 12; a-- }
    if (m > 12) { m = 1; a++ }
    setMesNum(m)
    setAnio(a)
  }

  // New client modal
  const [showNewClient, setShowNewClient] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [newRubro, setNewRubro] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [creatingClient, setCreatingClient] = useState(false)

  const handleCreateClient = async () => {
    if (!newNombre.trim()) return
    setCreatingClient(true)
    try {
      const res = await fetch('/api/crm/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newNombre.trim(), rubro: newRubro.trim(), contacto_email: newEmail.trim(), activo: true }),
      })
      const data = await res.json()
      if (data.success || data.cliente) {
        setShowNewClient(false)
        setNewNombre(''); setNewRubro(''); setNewEmail('')
        loadData()
      } else {
        alert(data.error || 'Error al crear cliente')
      }
    } catch (e) { console.error(e) }
    setCreatingClient(false)
  }

  const handleDeleteClient = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}? Se borrarán sus grillas y briefing.`)) return
    try {
      await fetch(`/api/crm/clientes?id=${id}`, { method: 'DELETE' })
      loadData()
    } catch (e) { console.error(e) }
  }

  const filtered = clientes.filter(c => {
    const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) || c.rubro.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'todos' || c.grilla_estado === filtroEstado
    return matchSearch && matchEstado
  })

  const stats = {
    total: clientes.length,
    aprobadas: clientes.filter(c => c.grilla_estado === 'aprobado').length,
    en_revision: clientes.filter(c => c.grilla_estado === 'en_revision').length,
    sin_grilla: clientes.filter(c => c.grilla_estado === 'sin_grilla').length,
  }

  return (
    <CRMLayout title="Grillas de Contenido">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Month nav */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navMes(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition">‹</button>
          <h3 className="text-lg font-bold text-gray-900 min-w-[180px] text-center">{MESES[mesNum]} {anio}</h3>
          <button onClick={() => navMes(1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition">›</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricBox label="Clientes Activos" value={stats.total} icon="👥" color="blue" />
          <MetricBox label="Aprobadas" value={stats.aprobadas} icon="✅" color="green" />
          <MetricBox label="En Revisión" value={stats.en_revision} icon="⏳" color="yellow" />
          <MetricBox label="Sin Grilla" value={stats.sin_grilla} icon="⚠️" color="red" />
        </div>

        {/* Filters + New Client */}
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
            onChange={e => setFiltroEstado(e.target.value as typeof filtroEstado)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los estados</option>
            <option value="sin_grilla">Sin Grilla</option>
            <option value="borrador">Borrador</option>
            <option value="en_revision">En Revisión</option>
            <option value="aprobado">Aprobado</option>
            <option value="enviado">Enviado</option>
          </select>
          <button onClick={() => setShowNewClient(true)} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition whitespace-nowrap">
            + Nuevo Cliente
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">Cargando clientes...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
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
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition" onClick={() => router.push(`/crm/grillas/${c.id}`)}>
                      <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{c.nombre}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{c.rubro || '—'}</td>
                      <td className="px-6 py-4"><GrillaStatusBadge estado={c.grilla_estado === 'sin_grilla' ? 'sin_grilla' : c.grilla_estado} /></td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{c.actualizado_en || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition">Ver Grilla →</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(c.id, c.nombre) }} className="px-2 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-xs" title="Eliminar cliente">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">No se encontraron clientes</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map(c => (
                <div key={c.id} className="p-4 hover:bg-blue-50/50 cursor-pointer transition" onClick={() => router.push(`/crm/grillas/${c.id}`)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{c.nombre}</span>
                    <GrillaStatusBadge estado={c.grilla_estado === 'sin_grilla' ? 'sin_grilla' : c.grilla_estado} />
                  </div>
                  <p className="text-sm text-gray-500">{c.rubro}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New client modal */}
      {showNewClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowNewClient(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 rounded-t-xl flex items-center justify-between">
              <h2 className="text-lg font-bold">Nuevo Cliente</h2>
              <button onClick={() => setShowNewClient(false)} className="text-white/70 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" value={newNombre} onChange={e => setNewNombre(e.target.value)} placeholder="Nombre del cliente"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
                <input type="text" value={newRubro} onChange={e => setNewRubro(e.target.value)} placeholder="Ej: E-commerce, HR Tech"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email de contacto</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="contacto@cliente.cl"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowNewClient(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition border border-gray-300">Cancelar</button>
              <button onClick={handleCreateClient} disabled={creatingClient || !newNombre.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {creatingClient ? 'Creando...' : 'Crear Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  )
}

function MetricBox({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colorMap: Record<string, string> = { blue: 'bg-blue-50 border-blue-200', green: 'bg-green-50 border-green-200', yellow: 'bg-yellow-50 border-yellow-200', red: 'bg-red-50 border-red-200' }
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
