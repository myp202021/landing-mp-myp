'use client'

import { useState, useEffect, useCallback } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'

interface ClienteReporte {
  id: number
  nombre: string
  activo: boolean
  ocultar?: string[]
  ultimo_reporte: { mes: number; anio: number; estado: string; integraciones: number; reportei_url: string; enviado_en: string } | null
  total_reportes: number
}

const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function ReportesPage() {
  const [clientes, setClientes] = useState<ClienteReporte[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newId, setNewId] = useState('')
  const [newNombre, setNewNombre] = useState('')

  const [mesFilter, setMesFilter] = useState(new Date().getMonth()) // mes anterior
  const [anioFilter, setAnioFilter] = useState(new Date().getFullYear())

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/reportes?mes=${mesFilter}&anio=${anioFilter}`)
      const data = await res.json()
      setClientes(data.clientes || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [mesFilter, anioFilter])

  useEffect(() => { loadData() }, [loadData])

  const handleAdd = async () => {
    if (!newId || !newNombre) return
    try {
      const res = await fetch('/api/crm/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(newId), nombre: newNombre.trim() }),
      })
      const data = await res.json()
      if (data.success) { setShowAdd(false); setNewId(''); setNewNombre(''); loadData() }
      else alert(data.error || 'Error')
    } catch (e) { console.error(e) }
  }

  const handleRemove = async (id: number, nombre: string) => {
    if (!confirm(`¿Quitar a ${nombre} de los reportes mensuales?`)) return
    try {
      await fetch(`/api/crm/reportes?id=${id}`, { method: 'DELETE' })
      loadData()
    } catch (e) { console.error(e) }
  }

  const enviados = clientes.filter(c => c.ultimo_reporte?.estado === 'enviado')
  const pendientes = clientes.filter(c => !c.ultimo_reporte || c.ultimo_reporte.estado !== 'enviado')

  const filtered = clientes.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()))

  return (
    <CRMLayout title="Reportes Mensuales">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Clientes</p>
            <p className="text-2xl font-bold text-blue-700">{clientes.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Enviados {MESES[mesFilter]}</p>
            <p className="text-2xl font-bold text-green-700">{enviados.length}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Pendientes</p>
            <p className="text-2xl font-bold text-amber-700">{pendientes.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Mes</p>
            <p className="text-2xl font-bold text-purple-700">{MESES[mesFilter]} {anioFilter}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <select value={mesFilter} onChange={e => setMesFilter(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm">
            {MESES.slice(1).map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={anioFilter} onChange={e => setAnioFilter(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm">
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition whitespace-nowrap">
            + Agregar Cliente
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">Cargando...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID Reportei</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado {MESES[mesFilter]}</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Integraciones</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Enviado</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reportei</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{c.nombre}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{c.id}</td>
                    <td className="px-4 py-3 text-center">
                      {c.ultimo_reporte?.estado === 'enviado' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">Enviado</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">Pendiente</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{c.ultimo_reporte?.integraciones || '—'}</td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                      {c.ultimo_reporte?.enviado_en ? new Date(c.ultimo_reporte.enviado_en).toLocaleDateString('es-CL') : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.ultimo_reporte?.reportei_url ? (
                        <a href={c.ultimo_reporte.reportei_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Ver ↗</a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{c.total_reportes}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleRemove(c.id, c.nombre)} className="text-xs text-red-400 hover:text-red-600">Quitar</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">No hay clientes</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowAdd(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 rounded-t-xl">
                <h2 className="text-lg font-bold">Agregar Cliente a Reportes</h2>
                <p className="text-blue-200 text-sm">El ID es el Project ID de Reportei</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Reportei *</label>
                  <input type="number" value={newId} onChange={e => setNewId(e.target.value)} placeholder="Ej: 867119"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Cliente *</label>
                  <input type="text" value={newNombre} onChange={e => setNewNombre(e.target.value)} placeholder="Nombre del cliente"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 pb-6">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 border border-gray-300">Cancelar</button>
                <button onClick={handleAdd} disabled={!newId || !newNombre} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">Agregar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CRMLayout>
  )
}
