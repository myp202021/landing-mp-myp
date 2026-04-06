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
  enriched: number
  benchmarked: number
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total_empresas}</div>
            <div className="text-xs text-gray-500 mt-1">Empresas</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.enriched}</div>
            <div className="text-xs text-gray-500 mt-1">Enriquecidas</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.benchmarked}</div>
            <div className="text-xs text-gray-500 mt-1">Benchmarkeadas</div>
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
                    <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border-b">
                      <span className="text-sm font-medium text-blue-800">{selectedCompanies.size} seleccionadas</span>
                      <button
                        onClick={() => handleBulkAction('approve')}
                        disabled={actionLoading}
                        className="px-4 py-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
                      >
                        Aprobar para envío
                      </button>
                      <button
                        onClick={() => handleBulkAction('disqualify')}
                        disabled={actionLoading}
                        className="px-4 py-1.5 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 disabled:opacity-50"
                      >
                        Descartar
                      </button>
                      <button
                        onClick={() => setSelectedCompanies(new Set())}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
                      >
                        Limpiar selección
                      </button>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="px-3 py-3 w-8">
                            <input
                              type="checkbox"
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedCompanies(new Set(benchmarks.map(b => b.prospect_companies?.id).filter(Boolean)))
                                } else {
                                  setSelectedCompanies(new Set())
                                }
                              }}
                              checked={selectedCompanies.size > 0 && selectedCompanies.size === benchmarks.length}
                              className="rounded"
                            />
                          </th>
                          <th className="px-4 py-3">Empresa</th>
                          <th className="px-4 py-3">Final</th>
                          <th className="px-4 py-3">Web</th>
                          <th className="px-4 py-3">IG</th>
                          <th className="px-4 py-3">LI</th>
                          <th className="px-4 py-3">FB</th>
                          <th className="px-4 py-3">SEO</th>
                          <th className="px-4 py-3">Pauta</th>
                          <th className="px-4 py-3">Fecha</th>
                          <th className="px-4 py-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {benchmarks.map(b => {
                          const companyId = b.prospect_companies?.id
                          return (
                          <>
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="px-3 py-3">
                                {companyId && (
                                  <input
                                    type="checkbox"
                                    checked={selectedCompanies.has(companyId)}
                                    onChange={() => toggleSelectCompany(companyId)}
                                    className="rounded"
                                  />
                                )}
                              </td>
                              <td className="px-4 py-3 cursor-pointer" onClick={() => setExpandedBenchmark(expandedBenchmark === b.id ? null : b.id)}>
                                <div className="font-medium">{b.prospect_companies?.name}</div>
                                <div className="text-xs text-gray-500">{b.prospect_companies?.industry} · {b.prospect_companies?.city || 'Chile'}</div>
                              </td>
                              <td className={`px-4 py-3 ${scoreColor(b.final_score)}`}>{b.final_score}/100</td>
                              <td className="px-4 py-3">{b.website_score}/20</td>
                              <td className="px-4 py-3">{b.instagram_score}/15</td>
                              <td className="px-4 py-3">{b.linkedin_score}/15</td>
                              <td className="px-4 py-3">{b.facebook_score}/10</td>
                              <td className="px-4 py-3">{b.seo_score}/10</td>
                              <td className="px-4 py-3">{b.paid_readiness_score}/15</td>
                              <td className="px-4 py-3 text-xs text-gray-500">{formatDate(b.generated_at)}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => setPreviewEmail(previewEmail === b.id ? null : b.id)}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                                    title="Preview email"
                                  >
                                    👁 Email
                                  </button>
                                  {companyId && (
                                    <>
                                      <button
                                        onClick={() => handleSingleAction(companyId, 'approve')}
                                        disabled={actionLoading}
                                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 disabled:opacity-50"
                                        title="Aprobar para envío"
                                      >
                                        Aprobar
                                      </button>
                                      <button
                                        onClick={() => handleSingleAction(companyId, 'disqualify')}
                                        disabled={actionLoading}
                                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 disabled:opacity-50"
                                        title="Descartar"
                                      >
                                        Descartar
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {/* Preview del email */}
                            {previewEmail === b.id && (
                              <tr key={`${b.id}-email`}>
                                <td colSpan={11} className="px-6 py-4 bg-yellow-50 border-l-4 border-yellow-400">
                                  <div className="mb-2">
                                    <span className="text-xs font-semibold text-yellow-800 uppercase">Preview del email que se enviaría</span>
                                  </div>
                                  <div className="bg-white rounded border p-4 max-w-xl">
                                    <div className="text-xs text-gray-500 mb-3">
                                      <strong>De:</strong> Müller &amp; Pérez &lt;contacto@mulleryperez.cl&gt;<br/>
                                      <strong>Para:</strong> [email del contacto]<br/>
                                      <strong>Asunto:</strong> {b.prospect_companies?.name}: {b.final_score}/100 en madurez digital — benchmark gratuito
                                    </div>
                                    <hr className="my-3"/>
                                    <div className="text-sm text-gray-700 space-y-3">
                                      <p>Hola,</p>
                                      <p>Analizamos la presencia digital de <strong>{b.prospect_companies?.name}</strong> como parte de un estudio de la industria {b.prospect_companies?.industry} en {b.prospect_companies?.city || 'Chile'}.</p>
                                      <p>El resultado: <strong style={{color: b.final_score <= 39 ? '#e74c3c' : b.final_score <= 69 ? '#f39c12' : '#27ae60'}}>{b.final_score}/100</strong> en madurez digital.</p>
                                      <table className="w-full border-collapse text-xs my-2">
                                        <tbody>
                                          <tr className="bg-gray-50"><td className="p-2 border">Sitio Web</td><td className="p-2 border text-center font-bold">{b.website_score}/20</td></tr>
                                          <tr><td className="p-2 border">Redes Sociales</td><td className="p-2 border text-center font-bold">{(b.instagram_score || 0) + (b.linkedin_score || 0) + (b.facebook_score || 0)}/40</td></tr>
                                          <tr className="bg-gray-50"><td className="p-2 border">SEO</td><td className="p-2 border text-center font-bold">{b.seo_score}/10</td></tr>
                                          <tr><td className="p-2 border">Preparación para Pauta</td><td className="p-2 border text-center font-bold">{b.paid_readiness_score}/15</td></tr>
                                        </tbody>
                                      </table>
                                      <p><strong>Principal hallazgo:</strong> {b.brechas?.[0] || 'Brechas en su presencia digital'}</p>
                                      {b.brechas && b.brechas.length > 1 && (
                                        <ul className="list-disc pl-5 space-y-1">
                                          {b.brechas.slice(1, 3).map((br, i) => <li key={i}>{br}</li>)}
                                        </ul>
                                      )}
                                      <p>Tenemos el benchmark completo con acciones concretas. ¿Les interesa recibirlo? Son 15 minutos de revisión.</p>
                                      <p className="text-xs text-gray-500 mt-4">Arturo Vargas · Müller &amp; Pérez — Performance Marketing · +56 9 5419 7432</p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}

                            {/* Detalle expandido */}
                            {expandedBenchmark === b.id && (
                              <tr key={`${b.id}-detail`}>
                                <td colSpan={11} className="px-6 py-4 bg-gray-50">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <h4 className="font-semibold text-green-700 mb-2">Fortalezas</h4>
                                      <ul className="space-y-1">
                                        {(b.fortalezas || []).map((f, i) => (
                                          <li key={i} className="text-gray-700">✅ {f}</li>
                                        ))}
                                        {(!b.fortalezas || b.fortalezas.length === 0) && <li className="text-gray-400">Sin datos</li>}
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-red-700 mb-2">Brechas</h4>
                                      <ul className="space-y-1">
                                        {(b.brechas || []).map((br, i) => (
                                          <li key={i} className="text-gray-700">⚠️ {br}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-blue-700 mb-2">Acciones recomendadas</h4>
                                      <ul className="space-y-1">
                                        {(b.acciones || []).map((a, i) => (
                                          <li key={i} className="text-gray-700">🎯 {a}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  {b.resumen_ejecutivo && (
                                    <div className="mt-4 p-3 bg-white rounded border">
                                      <h4 className="font-semibold text-gray-700 mb-1">Resumen ejecutivo</h4>
                                      <p className="text-gray-600 text-sm">{b.resumen_ejecutivo}</p>
                                    </div>
                                  )}
                                  {b.angulo_comercial && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                      <h4 className="font-semibold text-blue-800 mb-1">Ángulo comercial</h4>
                                      <p className="text-blue-700 text-sm">{b.angulo_comercial}</p>
                                    </div>
                                  )}
                                  <div className="mt-3 flex gap-2">
                                    {b.prospect_companies?.website && (
                                      <a href={b.prospect_companies.website} target="_blank" rel="noopener" className="text-xs px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">🌐 Ver sitio</a>
                                    )}
                                    {b.prospect_companies?.instagram_url && (
                                      <a href={b.prospect_companies.instagram_url} target="_blank" rel="noopener" className="text-xs px-3 py-1.5 bg-pink-100 rounded hover:bg-pink-200">📸 Instagram</a>
                                    )}
                                    {b.prospect_companies?.linkedin_url && (
                                      <a href={b.prospect_companies.linkedin_url} target="_blank" rel="noopener" className="text-xs px-3 py-1.5 bg-blue-100 rounded hover:bg-blue-200">💼 LinkedIn</a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                          )
                        })}
                        {benchmarks.length === 0 && (
                          <tr><td colSpan={11} className="text-center py-12 text-gray-400">No hay benchmarks generados aún.</td></tr>
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
