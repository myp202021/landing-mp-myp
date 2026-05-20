'use client'

import React, { useState, useEffect } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const ESTADO_COLORS: Record<string, string> = {
  pendiente: 'bg-gray-100 text-gray-800',
  activo: 'bg-green-100 text-green-800',
  suspendido: 'bg-yellow-100 text-yellow-800',
  cancelado: 'bg-red-100 text-red-800',
}

export default function AgentesAdminPage() {
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [stats, setStats] = useState({ total: 0, pendiente: 0, activo: 0, suspendido: 0, cancelado: 0 })
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', email: '', empresa: '', urlSitio: '', plataforma: 'WordPress' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(function() {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const { data } = await supabase
      .from('agentes_suscripciones')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setSubs(data)
      setStats({
        total: data.length,
        pendiente: data.filter(function(s: any) { return s.estado === 'pendiente' }).length,
        activo: data.filter(function(s: any) { return s.estado === 'activo' }).length,
        suspendido: data.filter(function(s: any) { return s.estado === 'suspendido' }).length,
        cancelado: data.filter(function(s: any) { return s.estado === 'cancelado' }).length,
      })
    }
    setLoading(false)
  }

  async function cambiarEstado(id: string, nuevoEstado: string) {
    await supabase.from('agentes_suscripciones').update({ estado: nuevoEstado, updated_at: new Date().toISOString() }).eq('id', id)
    loadData()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.email || !formData.nombre) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/agentes/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
        setShowModal(false)
        setFormData({ nombre: '', email: '', empresa: '', urlSitio: '', plataforma: 'WordPress' })
        setTimeout(loadData, 2000)
      } else {
        alert('Error: ' + (data.error || 'Error desconocido'))
      }
    } catch (err: any) {
      alert('Error: ' + err.message)
    }
    setSubmitting(false)
  }

  const filtered = filtro === 'todos' ? subs : subs.filter(function(s: any) { return s.estado === filtro })

  function formatDate(d: string) {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function formatMoney(n: number) {
    if (!n) return '-'
    return '$' + n.toLocaleString('es-CL')
  }

  return (
    <CRMLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agentes Blog IA — Suscriptores</h1>
            <p className="text-sm text-gray-500 mt-1">Gestiona suscriptores del producto Agente de Blog IA ($99.990 + IVA/mes)</p>
          </div>
          <div className="flex gap-3">
            <button onClick={loadData} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">
              Actualizar
            </button>
            <button onClick={function() { setShowModal(true) }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">
              + Suscribir nuevo cliente
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center cursor-pointer hover:border-emerald-300" onClick={function() { setFiltro('todos') }}>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Total</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center cursor-pointer hover:border-gray-400" onClick={function() { setFiltro('pendiente') }}>
            <div className="text-2xl font-bold text-gray-500">{stats.pendiente}</div>
            <div className="text-xs text-gray-500 mt-1">Pendientes</div>
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
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Empresa</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">URL Sitio</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Plataforma</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Precio</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Creado</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Sin suscriptores {filtro !== 'todos' ? 'con estado ' + filtro : ''}</td></tr>
              )}
              {filtered.map(function(sub: any) {
                return (
                  <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{sub.nombre || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{sub.email}</td>
                    <td className="px-4 py-3 text-gray-600">{sub.empresa || '-'}</td>
                    <td className="px-4 py-3">
                      {sub.url_sitio ? (
                        <a href={sub.url_sitio.startsWith('http') ? sub.url_sitio : 'https://' + sub.url_sitio} target="_blank" rel="noopener" className="text-emerald-600 hover:underline text-xs">{sub.url_sitio}</a>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{sub.plataforma || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={'px-2.5 py-1 rounded-full text-xs font-semibold ' + (ESTADO_COLORS[sub.estado] || 'bg-gray-100 text-gray-600')}>
                        {sub.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 font-medium">{formatMoney(sub.precio)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(sub.created_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        {sub.estado === 'pendiente' && (
                          <button onClick={function() { cambiarEstado(sub.id, 'activo') }} className="text-xs text-green-600 hover:text-green-800 font-semibold">Activar</button>
                        )}
                        {sub.estado === 'activo' && (
                          <button onClick={function() { if (confirm('Suspender suscripcion de ' + sub.email + '?')) { cambiarEstado(sub.id, 'suspendido') } }} className="text-xs text-yellow-600 hover:text-yellow-800 font-semibold">Suspender</button>
                        )}
                        {sub.estado === 'suspendido' && (
                          <button onClick={function() { cambiarEstado(sub.id, 'activo') }} className="text-xs text-green-600 hover:text-green-800 font-semibold">Reactivar</button>
                        )}
                        {sub.estado !== 'cancelado' && (
                          <button onClick={function() { if (confirm('Cancelar suscripcion de ' + sub.email + '?')) { cambiarEstado(sub.id, 'cancelado') } }} className="text-xs text-red-500 hover:text-red-700 font-semibold">Cancelar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Modal nuevo cliente */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Suscribir nuevo cliente — Agente Blog IA</h2>
                  <button onClick={function() { setShowModal(false) }} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                </div>
                <p className="text-sm text-gray-500 mt-1">Plan BLOG-IA-MENSUAL — $99.990 + IVA/mes</p>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
                  <input type="text" required value={formData.nombre} onChange={function(e) { setFormData({ ...formData, nombre: e.target.value }) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Juan Perez" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input type="email" required value={formData.email} onChange={function(e) { setFormData({ ...formData, email: e.target.value }) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="cliente@empresa.cl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Empresa</label>
                  <input type="text" value={formData.empresa} onChange={function(e) { setFormData({ ...formData, empresa: e.target.value }) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Empresa SPA" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">URL del sitio</label>
                  <input type="text" value={formData.urlSitio} onChange={function(e) { setFormData({ ...formData, urlSitio: e.target.value }) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="https://www.empresa.cl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Plataforma</label>
                  <select value={formData.plataforma} onChange={function(e) { setFormData({ ...formData, plataforma: e.target.value }) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="WordPress">WordPress</option>
                    <option value="Shopify">Shopify</option>
                    <option value="Wix">Wix</option>
                    <option value="Webflow">Webflow</option>
                    <option value="Next.js">Next.js</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={function() { setShowModal(false) }} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">
                    Cancelar
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
                    {submitting ? 'Procesando...' : 'Ir a pago en Flow'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CRMLayout>
  )
}
