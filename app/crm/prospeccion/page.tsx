'use client'

import { useState, useEffect } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'

// ── Tipos ────────────────────────────────────────────────

interface Company {
  id: number
  name: string
  website: string
  phone: string | null
  city: string | null
  industry: string
  category: string | null
  rating: number | null
  reviews_count: number
  instagram_url: string | null
  linkedin_url: string | null
  facebook_url: string | null
  status: string
  source_query: string | null
  batch_id: string | null
  creado_en: string
  prospect_contacts: Array<{ id: number; contact_email: string; email_type: string; is_primary: boolean; is_valid: boolean; verification_status: string | null }>
  prospect_benchmarks: Array<{ id: number; final_score: number; generated_at: string }>
}

interface Outreach {
  id: number
  status: string
  current_step: number
  email_1_sent_at: string | null
  email_2_sent_at: string | null
  email_3_sent_at: string | null
  next_send_at: string | null
  creado_en: string
  prospect_companies: { id: number; name: string; website: string; industry: string; city: string | null }
  prospect_contacts: { contact_email: string; contact_name: string | null }
  prospect_benchmarks: { final_score: number } | null
}

interface Benchmark {
  id: number
  final_score: number
  website_score: number
  instagram_score: number
  linkedin_score: number
  facebook_score: number
  seo_score: number
  paid_readiness_score: number
  brand_clarity_score: number
  technical_score: number
  resumen_ejecutivo: string | null
  fortalezas: string[]
  brechas: string[]
  acciones: string[]
  angulo_comercial: string | null
  generated_at: string
  prospect_companies: { id: number; name: string; website: string; industry: string; city: string | null; instagram_url: string | null; linkedin_url: string | null; facebook_url: string | null }
}

interface Stats {
  total_empresas: number
  con_email: number
  enriched: number
  qualified: number
  emailed: number
  replied: number
}

// ── Helpers ──────────────────────────────────────────────

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  discovered: { label: 'Descubierta', color: 'bg-gray-100 text-gray-700' },
  enriched: { label: 'Enriquecida', color: 'bg-blue-100 text-blue-700' },
  benchmarked: { label: 'Benchmarkeada', color: 'bg-purple-100 text-purple-700' },
  qualified: { label: 'Calificada', color: 'bg-indigo-100 text-indigo-700' },
  emailed: { label: 'Email enviado', color: 'bg-yellow-100 text-yellow-700' },
  replied: { label: 'Respondió', color: 'bg-green-100 text-green-700' },
  converted: { label: 'Convertido', color: 'bg-emerald-100 text-emerald-800' },
  disqualified: { label: 'Descartada', color: 'bg-red-100 text-red-700' },
}

const OUTREACH_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-gray-100 text-gray-700' },
  email_1_sent: { label: 'Email 1', color: 'bg-blue-100 text-blue-700' },
  email_2_sent: { label: 'Email 2', color: 'bg-indigo-100 text-indigo-700' },
  email_3_sent: { label: 'Email 3', color: 'bg-purple-100 text-purple-700' },
  replied: { label: 'Respondió', color: 'bg-green-100 text-green-700' },
  bounced: { label: 'Rebotó', color: 'bg-red-100 text-red-700' },
  unsubscribed: { label: 'No contactar', color: 'bg-red-100 text-red-600' },
  completed: { label: 'Completada', color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-500' },
}

function scoreColor(score: number): string {
  if (score <= 39) return 'text-red-600 font-bold'
  if (score <= 69) return 'text-yellow-600 font-bold'
  return 'text-green-600 font-bold'
}

const VERIFY_LABELS: Record<string, { label: string; color: string }> = {
  valid: { label: 'Verificado', color: 'bg-green-100 text-green-700' },
  invalid: { label: 'Inválido', color: 'bg-red-100 text-red-700' },
  disposable: { label: 'Desechable', color: 'bg-red-100 text-red-600' },
  catch_all: { label: 'Catch-all', color: 'bg-yellow-100 text-yellow-700' },
  pending: { label: 'Pendiente', color: 'bg-gray-100 text-gray-500' },
  unknown: { label: 'Sin verificar', color: 'bg-gray-100 text-gray-400' },
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Componente principal ─────────────────────────────────

export default function ProspeccionPage() {
  const [activeTab, setActiveTab] = useState<'empresas' | 'outreach' | 'benchmarks'>('empresas')
  const [stats, setStats] = useState<Stats | null>(null)
  const [empresas, setEmpresas] = useState<Company[]>([])
  const [outreach, setOutreach] = useState<Outreach[]>([])
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')
  const [expandedBenchmark, setExpandedBenchmark] = useState<number | null>(null)
  const [previewEmail, setPreviewEmail] = useState<number | null>(null)
  const [selectedCompanies, setSelectedCompanies] = useState<Set<number>>(new Set())
  const [actionLoading, setActionLoading] = useState(false)

  const LIMIT = 50

  // Cargar stats
  useEffect(() => {
    fetch('/api/crm/prospeccion?tab=stats')
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  // Cargar datos del tab activo
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ tab: activeTab, page: String(page), limit: String(LIMIT) })
    if (filterStatus) params.set('status', filterStatus)
    if (filterIndustry) params.set('industry', filterIndustry)

    fetch(`/api/crm/prospeccion?${params}`)
      .then(r => r.json())
      .then(data => {
        if (activeTab === 'empresas') {
          setEmpresas(data.empresas || [])
          setTotal(data.total || 0)
        } else if (activeTab === 'outreach') {
          setOutreach(data.outreach || [])
          setTotal(data.total || 0)
        } else {
          setBenchmarks(data.benchmarks || [])
          setTotal(data.total || 0)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeTab, page, filterStatus, filterIndustry])

  // Aprobar / descartar empresas
  const handleBulkAction = async (action: 'approve' | 'disqualify') => {
    if (selectedCompanies.size === 0) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/crm/prospeccion/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_ids: Array.from(selectedCompanies), action }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Refrescar datos
      setSelectedCompanies(new Set())
      // Re-trigger useEffect
      setPage(p => p) // force re-render
      window.location.reload()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSingleAction = async (companyId: number, action: 'approve' | 'disqualify') => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/crm/prospeccion/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: companyId, action }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      window.location.reload()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const toggleSelectCompany = (id: number) => {
    setSelectedCompanies(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const tabs = [
    { key: 'empresas' as const, label: 'Empresas Scrapeadas', icon: '🏢' },
    { key: 'outreach' as const, label: 'Outreach', icon: '✉️' },
    { key: 'benchmarks' as const, label: 'Benchmarks', icon: '📊' },
  ]

  return (
    <CRMLayout title="Prospección Automática">
      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total_empresas}</div>
            <div className="text-xs text-gray-500 mt-1">Empresas</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.con_email}</div>
            <div className="text-xs text-gray-500 mt-1">Emails válidos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.enriched}</div>
            <div className="text-xs text-gray-500 mt-1">Enriquecidas</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.qualified}</div>
            <div className="text-xs text-gray-500 mt-1">Aprobadas</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.emailed}</div>
            <div className="text-xs text-gray-500 mt-1">Emails enviados</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
            <div className="text-xs text-gray-500 mt-1">Respondieron</div>
          </div>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); setFilterStatus('') }}
              className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.key
                  ? 'text-blue-900 border-blue-600 bg-blue-50'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-3 p-4 border-b bg-gray-50">
          {activeTab === 'empresas' && (
            <>
              <select
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
                className="text-sm border rounded-lg px-3 py-2"
              >
                <option value="">Todos los estados</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <select
                value={filterIndustry}
                onChange={e => { setFilterIndustry(e.target.value); setPage(1) }}
                className="text-sm border rounded-lg px-3 py-2"
              >
                <option value="">Todas las industrias</option>
                <option value="inmobiliaria">Inmobiliaria</option>
                <option value="saas">SaaS</option>
              </select>
            </>
          )}
          {activeTab === 'outreach' && (
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
              className="text-sm border rounded-lg px-3 py-2"
            >
              <option value="">Todos los estados</option>
              {Object.entries(OUTREACH_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          )}
          <div className="ml-auto text-sm text-gray-500 py-2">
            {total} resultados
          </div>
        </div>

        {/* Contenido */}
        <div className="p-0">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando...</div>
          ) : (
            <>
              {/* ── Tab Empresas ── */}
              {activeTab === 'empresas' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-3">Empresa</th>
                        <th className="px-4 py-3">Industria</th>
                        <th className="px-4 py-3">Ciudad</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">RRSS</th>
                        <th className="px-4 py-3">Score</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {empresas.map(emp => {
                        const primaryContact = emp.prospect_contacts?.find(c => c.is_primary) || emp.prospect_contacts?.[0]
                        const benchmark = emp.prospect_benchmarks?.[0]
                        const st = STATUS_LABELS[emp.status] || { label: emp.status, color: 'bg-gray-100 text-gray-600' }
                        const socials = [
                          emp.instagram_url && 'IG',
                          emp.linkedin_url && 'LI',
                          emp.facebook_url && 'FB',
                        ].filter(Boolean)

                        return (
                          <tr key={emp.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{emp.name}</div>
                              {emp.website && (
                                <a href={emp.website} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline">
                                  {emp.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                </a>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{emp.industry}</td>
                            <td className="px-4 py-3 text-gray-600">{emp.city || '—'}</td>
                            <td className="px-4 py-3">
                              {primaryContact ? (
                                <div>
                                  <span className="text-xs text-gray-700">{primaryContact.contact_email}</span>
                                  {(() => {
                                    const vs = primaryContact.verification_status || 'pending'
                                    const vl = VERIFY_LABELS[vs] || VERIFY_LABELS.unknown
                                    return <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold ${vl.color}`}>{vl.label}</span>
                                  })()}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">Sin email</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {socials.length > 0 ? socials.map(s => (
                                  <span key={s} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium">{s}</span>
                                )) : <span className="text-xs text-gray-400">—</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {benchmark ? (
                                <span className={scoreColor(benchmark.final_score)}>{benchmark.final_score}/100</span>
                              ) : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{formatDate(emp.creado_en)}</td>
                          </tr>
                        )
                      })}
                      {empresas.length === 0 && (
                        <tr><td colSpan={8} className="text-center py-12 text-gray-400">No hay empresas aún. Ejecuta el pipeline de descubrimiento.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Tab Outreach ── */}
              {activeTab === 'outreach' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-3">Empresa</th>
                        <th className="px-4 py-3">Email destino</th>
                        <th className="px-4 py-3">Score</th>
                        <th className="px-4 py-3">Paso</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Email 1</th>
                        <th className="px-4 py-3">Email 2</th>
                        <th className="px-4 py-3">Email 3</th>
                        <th className="px-4 py-3">Próximo envío</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {outreach.map(o => {
                        const st = OUTREACH_LABELS[o.status] || { label: o.status, color: 'bg-gray-100 text-gray-600' }
                        return (
                          <tr key={o.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium">{o.prospect_companies?.name}</div>
                              <div className="text-xs text-gray-500">{o.prospect_companies?.industry} · {o.prospect_companies?.city || 'Chile'}</div>
                            </td>
                            <td className="px-4 py-3 text-xs">{o.prospect_contacts?.contact_email}</td>
                            <td className="px-4 py-3">
                              {o.prospect_benchmarks ? (
                                <span className={scoreColor(o.prospect_benchmarks.final_score)}>{o.prospect_benchmarks.final_score}</span>
                              ) : '—'}
                            </td>
                            <td className="px-4 py-3 text-center font-mono">{o.current_step}/3</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{formatDate(o.email_1_sent_at)}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{formatDate(o.email_2_sent_at)}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{formatDate(o.email_3_sent_at)}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{formatDate(o.next_send_at)}</td>
                          </tr>
                        )
                      })}
                      {outreach.length === 0 && (
                        <tr><td colSpan={9} className="text-center py-12 text-gray-400">No hay emails enviados aún.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Tab Benchmarks ── */}
              {activeTab === 'benchmarks' && (
                <div>
                  {/* Barra de acciones bulk */}
                  {selectedCompanies.size > 0 && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border-b">
                      <span className="text-sm font-medium text-green-800">{selectedCompanies.size} seleccionadas</span>
                      <button
                        onClick={() => handleBulkAction('approve')}
                        disabled={actionLoading}
                        className="px-4 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading ? 'Enviando...' : `Enviar benchmark a ${selectedCompanies.size} empresas`}
                      </button>
                      <button
                        onClick={() => handleBulkAction('disqualify')}
                        disabled={actionLoading}
                        className="px-4 py-1.5 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 disabled:opacity-50"
                      >
                        Descartar
                      </button>
                      <button onClick={() => setSelectedCompanies(new Set())} className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  )}

                  {/* Filtro por industria */}
                  <div className="flex gap-3 px-4 py-3 bg-gray-50 border-b">
                    <select
                      value={filterIndustry}
                      onChange={e => { setFilterIndustry(e.target.value); setPage(1) }}
                      className="text-sm border rounded-lg px-3 py-2"
                    >
                      <option value="">Todas las industrias</option>
                      <option value="inmobiliaria">Inmobiliaria</option>
                      <option value="saas">SaaS</option>
                    </select>
                    <a
                      href={`/benchmarks/${filterIndustry === 'saas' ? 'saas' : 'inmobiliarias'}.html`}
                      target="_blank" rel="noopener"
                      className="text-xs px-3 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                    >
                      Ver benchmark HTML ↗
                    </a>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="px-3 py-3 w-8">
                            <input type="checkbox"
                              onChange={e => {
                                if (e.target.checked) setSelectedCompanies(new Set(benchmarks.map((b: any) => b.id)))
                                else setSelectedCompanies(new Set())
                              }}
                              checked={selectedCompanies.size > 0 && selectedCompanies.size === benchmarks.length}
                              className="rounded"
                            />
                          </th>
                          <th className="px-4 py-3">Empresa</th>
                          <th className="px-4 py-3">Industria</th>
                          <th className="px-4 py-3">Ciudad</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Snov.io</th>
                          <th className="px-4 py-3">Estado</th>
                          <th className="px-4 py-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {benchmarks.map((b: any) => {
                          const contacts = b.prospect_contacts || []
                          const primaryContact = contacts.find((c: any) => c.is_primary) || contacts[0]
                          const vs = primaryContact?.verification_status || 'pending'
                          const vl = VERIFY_LABELS[vs] || VERIFY_LABELS.unknown
                          const st = STATUS_LABELS[b.status] || { label: b.status, color: 'bg-gray-100 text-gray-600' }

                          return (
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="px-3 py-3">
                                <input type="checkbox" checked={selectedCompanies.has(b.id)} onChange={() => toggleSelectCompany(b.id)} className="rounded" />
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">{b.name}</div>
                                {b.website && <a href={b.website} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline">{b.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>}
                              </td>
                              <td className="px-4 py-3 text-gray-600">{b.industry}</td>
                              <td className="px-4 py-3 text-gray-600">{b.city || '—'}</td>
                              <td className="px-4 py-3">
                                {primaryContact ? (
                                  <span className="text-xs text-gray-700">{primaryContact.contact_email}</span>
                                ) : <span className="text-xs text-gray-400">Sin email</span>}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${vl.color}`}>{vl.label}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleSingleAction(b.id, 'approve')}
                                    disabled={actionLoading || !primaryContact}
                                    className="px-2.5 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 disabled:opacity-30"
                                  >
                                    {actionLoading ? '...' : 'Enviar'}
                                  </button>
                                  <button
                                    onClick={() => handleSingleAction(b.id, 'disqualify')}
                                    disabled={actionLoading}
                                    className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-medium hover:bg-red-200 disabled:opacity-50"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                        {benchmarks.length === 0 && (
                          <tr><td colSpan={8} className="text-center py-12 text-gray-400">No hay empresas con email pendientes de envío.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Paginación */}
        {total > LIMIT && (
          <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-40"
            >
              ← Anterior
            </button>
            <span className="text-sm text-gray-500">
              Página {page} de {Math.ceil(total / LIMIT)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / LIMIT)}
              className="px-4 py-2 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </CRMLayout>
  )
}
