'use client'

import { useState, useEffect, useMemo } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'

// ── Tipos ────────────────────────────────────────────────

interface Empresa {
  id: number
  empresa: string
  website: string | null
  industria: string | null
  que_hacen: string | null
  email: string | null
  ciudad: string | null
  score: number
  estado: string
  notas: string | null
  batch: string | null
  creado_en: string
}

interface Stats {
  total: number
  por_industria: Record<string, number>
  contactadas: number
  con_respuesta: number
  reuniones: number
}

// ── Helpers ──────────────────────────────────────────────

const ESTADO_BADGES: Record<string, { label: string; color: string }> = {
  nueva: { label: 'Nueva', color: 'bg-gray-100 text-gray-700' },
  contactada: { label: 'Contactada', color: 'bg-blue-100 text-blue-700' },
  respondio: { label: 'Respondio', color: 'bg-green-100 text-green-700' },
  reunion: { label: 'Reunion', color: 'bg-purple-100 text-purple-700' },
  descartada: { label: 'Descartada', color: 'bg-red-100 text-red-700' },
}

function scoreBadge(score: number): string {
  if (score <= 30) return 'bg-red-100 text-red-700'
  if (score <= 60) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Componente principal ─────────────────────────────────

export default function Prospeccion2026Page() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  // Filtros
  const [filterIndustria, setFilterIndustria] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterScoreMin, setFilterScoreMin] = useState('')
  const [search, setSearch] = useState('')

  // Modal agregar
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    empresa: '', website: '', industria: '', que_hacen: '', email: '', ciudad: 'Santiago', score: 50
  })
  const [saving, setSaving] = useState(false)

  // Edicion inline
  const [editingEstado, setEditingEstado] = useState<number | null>(null)
  const [editingScore, setEditingScore] = useState<number | null>(null)
  const [editingNota, setEditingNota] = useState<number | null>(null)
  const [tempScore, setTempScore] = useState('')
  const [tempNota, setTempNota] = useState('')

  // Cargar datos
  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterIndustria) params.set('industria', filterIndustria)
      if (filterEstado) params.set('estado', filterEstado)
      if (filterScoreMin) params.set('score_min', filterScoreMin)
      if (search) params.set('search', search)

      const res = await fetch(`/api/crm/prospeccion-2026?${params}`)
      const data = await res.json()
      setEmpresas(data.empresas || [])
      setStats(data.stats || null)
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterIndustria, filterEstado, filterScoreMin])

  // Busqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 400)
    return () => clearTimeout(timer)
  }, [search])

  // Industrias unicas para el dropdown
  const industrias = useMemo(() => {
    if (!stats?.por_industria) return []
    return Object.entries(stats.por_industria)
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => key)
  }, [stats])

  // Top 3 industrias para stats bar
  const topIndustrias = useMemo(() => {
    if (!stats?.por_industria) return []
    return Object.entries(stats.por_industria)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [stats])

  // CSV export
  const downloadCSV = () => {
    const headers = ['#', 'Empresa', 'Website', 'Industria', 'Que hacen', 'Email', 'Ciudad', 'Score', 'Estado', 'Notas', 'Batch', 'Creado']
    const rows = empresas.map((e, i) => [
      i + 1,
      e.empresa,
      e.website || '',
      e.industria || '',
      (e.que_hacen || '').replace(/"/g, '""'),
      e.email || '',
      e.ciudad || '',
      e.score,
      e.estado,
      (e.notas || '').replace(/"/g, '""'),
      e.batch || '',
      formatDate(e.creado_en),
    ])
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `prospeccion-2026-${today}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Agregar empresa
  const handleAdd = async () => {
    if (!formData.empresa.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/crm/prospeccion-2026', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setShowModal(false)
      setFormData({ empresa: '', website: '', industria: '', que_hacen: '', email: '', ciudad: 'Santiago', score: 50 })
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // Update inline
  const handleUpdate = async (id: number, updates: Record<string, any>) => {
    try {
      const res = await fetch('/api/crm/prospeccion-2026', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setEmpresas(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
    } catch (err: any) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <CRMLayout title="Prospeccion 2026">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prospeccion 2026</h2>
          <p className="text-sm text-gray-500 mt-1">Base de datos de empresas B2B para outreach frio</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold shadow-sm"
          >
            Descargar CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-sm"
          >
            + Agregar empresa
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Total empresas</div>
          </div>
          {topIndustrias.map(([ind, count]) => (
            <div key={ind} className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{count}</div>
              <div className="text-xs text-gray-500 mt-1 truncate" title={ind}>{ind}</div>
            </div>
          ))}
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.contactadas}</div>
            <div className="text-xs text-gray-500 mt-1">Contactadas</div>
          </div>
          {topIndustrias.length < 2 && (
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.con_respuesta}</div>
              <div className="text-xs text-gray-500 mt-1">Con respuesta</div>
            </div>
          )}
        </div>
      )}

      {/* Filters row */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-3 p-4 border-b bg-gray-50 rounded-t-lg">
          <select
            value={filterIndustria}
            onChange={e => setFilterIndustria(e.target.value)}
            className="text-sm border rounded-lg px-3 py-2"
          >
            <option value="">Todas las industrias</option>
            {industrias.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          <select
            value={filterEstado}
            onChange={e => setFilterEstado(e.target.value)}
            className="text-sm border rounded-lg px-3 py-2"
          >
            <option value="">Todos los estados</option>
            {Object.entries(ESTADO_BADGES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={filterScoreMin}
            onChange={e => setFilterScoreMin(e.target.value)}
            className="text-sm border rounded-lg px-3 py-2"
          >
            <option value="">Score min</option>
            <option value="30">30+</option>
            <option value="50">50+</option>
            <option value="60">60+</option>
            <option value="70">70+</option>
            <option value="80">80+</option>
          </select>
          <input
            type="text"
            placeholder="Buscar empresa o website..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-sm border rounded-lg px-3 py-2 flex-1 min-w-[200px]"
          />
          <div className="ml-auto text-sm text-gray-500 py-2">
            {empresas.length} resultados
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-3 py-3 w-10">#</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Web</th>
                  <th className="px-4 py-3">Industria</th>
                  <th className="px-4 py-3 min-w-[200px]">Que hacen</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 min-w-[180px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {empresas.map((emp, idx) => {
                  const st = ESTADO_BADGES[emp.estado] || { label: emp.estado, color: 'bg-gray-100 text-gray-600' }

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{emp.empresa}</div>
                        {emp.ciudad && <div className="text-xs text-gray-400">{emp.ciudad}</div>}
                      </td>
                      <td className="px-4 py-3">
                        {emp.website ? (
                          <a
                            href={emp.website.startsWith('http') ? emp.website : `https://${emp.website}`}
                            target="_blank"
                            rel="noopener"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {emp.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                          </a>
                        ) : <span className="text-xs text-gray-400">--</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{emp.industria || '--'}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[250px]">
                        <span className="line-clamp-2">{emp.que_hacen || '--'}</span>
                      </td>
                      <td className="px-4 py-3">
                        {emp.email ? (
                          <a href={`mailto:${emp.email}`} className="text-xs text-blue-600 hover:underline">{emp.email}</a>
                        ) : <span className="text-xs text-gray-400">--</span>}
                      </td>

                      {/* Score - editable */}
                      <td className="px-4 py-3">
                        {editingScore === emp.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={tempScore}
                              onChange={e => setTempScore(e.target.value)}
                              className="w-14 text-xs border rounded px-1 py-0.5"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  handleUpdate(emp.id, { score: parseInt(tempScore) || 0 })
                                  setEditingScore(null)
                                }
                                if (e.key === 'Escape') setEditingScore(null)
                              }}
                            />
                            <button
                              onClick={() => {
                                handleUpdate(emp.id, { score: parseInt(tempScore) || 0 })
                                setEditingScore(null)
                              }}
                              className="text-green-600 text-xs"
                            >OK</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingScore(emp.id); setTempScore(String(emp.score)) }}
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${scoreBadge(emp.score)}`}
                          >
                            {emp.score}
                          </button>
                        )}
                      </td>

                      {/* Estado - editable */}
                      <td className="px-4 py-3">
                        {editingEstado === emp.id ? (
                          <select
                            value={emp.estado}
                            onChange={e => {
                              handleUpdate(emp.id, { estado: e.target.value })
                              setEditingEstado(null)
                            }}
                            onBlur={() => setEditingEstado(null)}
                            className="text-xs border rounded px-1 py-0.5"
                            autoFocus
                          >
                            {Object.entries(ESTADO_BADGES).map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditingEstado(emp.id)}
                            className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${st.color}`}
                          >
                            {st.label}
                          </button>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        {editingNota === emp.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={tempNota}
                              onChange={e => setTempNota(e.target.value)}
                              placeholder="Nota..."
                              className="text-xs border rounded px-2 py-1 w-32"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  handleUpdate(emp.id, { notas: tempNota })
                                  setEditingNota(null)
                                }
                                if (e.key === 'Escape') setEditingNota(null)
                              }}
                            />
                            <button
                              onClick={() => {
                                handleUpdate(emp.id, { notas: tempNota })
                                setEditingNota(null)
                              }}
                              className="text-green-600 text-xs font-semibold"
                            >OK</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingNota(emp.id); setTempNota(emp.notas || '') }}
                            className="text-xs text-gray-500 hover:text-blue-600"
                            title={emp.notas || 'Agregar nota'}
                          >
                            {emp.notas ? `${emp.notas.slice(0, 20)}...` : '+ Nota'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {empresas.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">
                      No hay empresas. Usa el boton &quot;Agregar empresa&quot; o ejecuta el script de seed.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal agregar empresa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Agregar empresa</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Empresa *</label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={e => setFormData(p => ({ ...p, empresa: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={e => setFormData(p => ({ ...p, website: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="empresa.cl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Industria</label>
                  <input
                    type="text"
                    value={formData.industria}
                    onChange={e => setFormData(p => ({ ...p, industria: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="IT / SaaS"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Que hacen</label>
                <input
                  type="text"
                  value={formData.que_hacen}
                  onChange={e => setFormData(p => ({ ...p, que_hacen: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Descripcion breve"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="contacto@empresa.cl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={e => setFormData(p => ({ ...p, ciudad: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={e => setFormData(p => ({ ...p, score: parseInt(e.target.value) || 0 }))}
                  className="w-24 border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || !formData.empresa.trim()}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  )
}
