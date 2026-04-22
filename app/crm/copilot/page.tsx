'use client'

import React, { useState, useEffect } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const ESTADO_COLORS: Record<string, string> = {
  trial: 'bg-blue-100 text-blue-800',
  activo: 'bg-green-100 text-green-800',
  suspendido: 'bg-yellow-100 text-yellow-800',
  cancelado: 'bg-red-100 text-red-800',
}

export default function RadarAdminPage() {
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [stats, setStats] = useState({ total: 0, trial: 0, activo: 0, suspendido: 0, cancelado: 0 })

  useEffect(function() {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const { data, error } = await supabase
      .from('clipping_suscripciones')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setSubs(data)
      setStats({
        total: data.length,
        trial: data.filter(function(s: any) { return s.estado === 'trial' }).length,
        activo: data.filter(function(s: any) { return s.estado === 'activo' }).length,
        suspendido: data.filter(function(s: any) { return s.estado === 'suspendido' }).length,
        cancelado: data.filter(function(s: any) { return s.estado === 'cancelado' }).length,
      })
    }
    setLoading(false)
  }

  async function deleteSub(id: string) {
    await supabase.from('radar_posts').delete().eq('suscripcion_id', id)
    await supabase.from('clipping_suscripciones').delete().eq('id', id)
    loadData()
  }

  const filtered = filtro === 'todos' ? subs : subs.filter(function(s: any) { return s.estado === filtro })

  function formatDate(d: string) {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <CRMLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Copilot — Suscriptores</h1>
            <p className="text-sm text-gray-500 mt-1">Gestiona suscriptores del producto Copilot de inteligencia competitiva</p>
          </div>
          <button onClick={loadData} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
            Actualizar
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center cursor-pointer hover:border-indigo-300" onClick={function() { setFiltro('todos') }}>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Total</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center cursor-pointer hover:border-blue-300" onClick={function() { setFiltro('trial') }}>
            <div className="text-2xl font-bold text-blue-600">{stats.trial}</div>
            <div className="text-xs text-gray-500 mt-1">Trial</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center cursor-pointer hover:border-green-300" onClick={function() { setFiltro('activo') }}>
            <div className="text-2xl font-bold text-green-600">{stats.activo}</div>
            <div className="text-xs text-gray-500 mt-1">Activos</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center cursor-pointer hover:border-yellow-300" onClick={function() { setFiltro('suspendido') }}>
            <div className="text-2xl font-bold text-yellow-600">{stats.suspendido}</div>
            <div className="text-xs text-gray-500 mt-1">Suspendidos</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center cursor-pointer hover:border-red-300" onClick={function() { setFiltro('cancelado') }}>
            <div className="text-2xl font-bold text-red-500">{stats.cancelado}</div>
            <div className="text-xs text-gray-500 mt-1">Cancelados</div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Plan</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Periodo</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Cuentas</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Trial termina</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Creado</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Sin suscriptores {filtro !== 'todos' ? 'con estado ' + filtro : ''}</td></tr>
              )}
              {filtered.map(function(sub: any) {
                var cuentas = Array.isArray(sub.cuentas) ? sub.cuentas : []
                var redes = new Set(cuentas.map(function(c: any) { return c.red }))
                return (
                  <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{sub.email}</div>
                      {sub.nombre && <div className="text-xs text-gray-500">{sub.nombre}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold capitalize">{sub.plan}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{sub.periodo}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={'px-2.5 py-1 rounded-full text-xs font-semibold ' + (ESTADO_COLORS[sub.estado] || 'bg-gray-100 text-gray-600')}>
                        {sub.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold">{cuentas.filter(function(c: any) { return c.red !== 'prensa' }).length}</span>
                      <span className="text-xs text-gray-400 ml-1">
                        ({Array.from(redes).filter(function(r) { return r !== 'prensa' }).join('/')})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(sub.trial_ends)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(sub.created_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={function() { if (confirm('Eliminar ' + sub.email + '? Se detienen todos los envios.')) { deleteSub(sub.id) } }} className="text-xs text-red-500 hover:text-red-700 font-semibold">Eliminar</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </CRMLayout>
  )
}
