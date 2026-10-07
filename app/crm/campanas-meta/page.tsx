'use client'

/**
 * Campañas Meta — campañas TEST de Christopher (operadas por Claude).
 * Visible para admin y comercial de M&P. Mismos datos que myp-meta-test.vercel.app:
 * Meta (insights) + CRM (leads TEST). API: /api/crm/campanas-meta (cookie de sesión del CRM).
 */
import { useEffect, useMemo, useState } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import type { CampanaMeta, LeadMeta, MetaDatos } from '@/lib/crm/campanas-meta'

interface Datos { meta: MetaDatos; leads: LeadMeta[]; crm_error: string | null; ahora: string }

const clp = (v: number | null | undefined) => (v == null || !isFinite(v) ? '—' : '$' + Math.round(v).toLocaleString('es-CL'))
const n0 = (v: number | null | undefined) => (v == null || !isFinite(v) ? '—' : Math.round(v).toLocaleString('es-CL'))
const pct = (v: number | null | undefined) => (v == null || !isFinite(v) ? '—' : (v * 100).toLocaleString('es-CL', { maximumFractionDigits: 1 }) + '%')
const div = (a: number, b: number) => (b ? a / b : null)
const corto = (s: string) => String(s || '').replace(/^TEST Claude\s+[AB]\s*[—-]\s*/, '') || '—'
const COLOR: Record<string, string> = { A: '#4F46E5', B: '#0EA5A4', '?': '#94a3b8' }
const TAG: Record<string, string> = { A: 'bg-indigo-100 text-indigo-700', B: 'bg-teal-100 text-teal-700', '?': 'bg-gray-100 text-gray-600' }
const NOTA: Record<string, string> = { A: 'bg-green-100 text-green-800', B: 'bg-yellow-100 text-yellow-800', C: 'bg-red-100 text-red-800' }
const ESTADOS = ['Nuevo', 'Contactado', 'Reunión', 'Propuesta', 'Ganado', 'Perdido']
const DECISOR = /(dueñ|duen|propietari|fundador|socio|ceo|gerente|director|presidente|owner|jefe de marketing|head|gerencia|administrador)/i

function Card({ title, sub, children, right }: { title: string; sub?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}
const Vacio = ({ t = 'Sin datos todavía.' }: { t?: string }) => <div className="text-center text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-lg py-6">{t}</div>

function Barras({ items, total, color = '#4F46E5' }: { items: [string, number, string?][]; total: number; color?: string }) {
  if (!items.length) return <Vacio t="Sin leads todavía." />
  return (
    <div className="space-y-2">
      {items.map(([k, v, c]) => (
        <div key={k} className="grid grid-cols-[130px_1fr_40px] gap-2 items-center text-xs">
          <div className="truncate text-gray-700" title={k}>{k}</div>
          <div className="h-2 bg-gray-100 rounded overflow-hidden"><div className="h-full rounded" style={{ width: `${Math.max(3, (v / (total || 1)) * 100)}%`, background: c || color }} /></div>
          <div className="text-right font-semibold">{v}</div>
        </div>
      ))}
    </div>
  )
}
function cuenta<T>(arr: T[], f: (x: T) => string | null | undefined): [string, number][] {
  const m: Record<string, number> = {}
  arr.forEach(x => { const k = f(x) || 'Sin dato'; m[k] = (m[k] || 0) + 1 })
  return Object.entries(m).sort((a, b) => b[1] - a[1])
}

export default function CampanasMetaPage() {
  const { user } = useSimpleAuth()
  const [datos, setDatos] = useState<Datos | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [serie, setSerie] = useState<'spend' | 'clicks' | 'leads' | 'cpl'>('spend')
  const [f, setF] = useState({ q: '', c: '', n: '', e: '', r: '' })

  const carga = async (refresh = false) => {
    setCargando(true)
    setError(null)
    try {
      const r = await fetch('/api/crm/campanas-meta' + (refresh ? '?refresh=1' : ''), { credentials: 'same-origin', cache: 'no-store' })
      const j = await r.json()
      if (r.status === 401) setError(j.mensaje || 'Inicia sesión de nuevo en el CRM para ver esta sección.')
      else if (!r.ok) setError(j.error || 'Error ' + r.status)
      else setDatos(j)
    } catch (e: any) {
      setError(e.message)
    }
    setCargando(false)
  }
  useEffect(() => { carga() }, [])

  const M = useMemo(() => {
    if (!datos) return null
    const camps = datos.meta?.campanas || []
    const leads = datos.leads || []
    const porC: Record<'A' | 'B', any> = {} as any
    for (const k of ['A', 'B'] as const) {
      const c: CampanaMeta | null = camps.find(x => x.letra === k) || null
      const t: any = (c && c.totales) || {}
      const ls = leads.filter(l => l.letra === k)
      const gan = ls.filter(l => l.estado === 'Ganado')
      porC[k] = {
        c, nombre: c ? c.nombre : '(no encontrada)', estado: c ? c.estado : null,
        spend: t.spend || 0, impressions: t.impressions || 0, reach: t.reach || 0, frequency: t.frequency || null, clicks: t.link_clicks || t.clicks || 0,
        leads: Math.max(t.leads || 0, ls.length), leadsCrm: ls.length,
        calif: ls.filter(l => l.calificacion !== 'C').length, cont: ls.filter(l => l.contactado).length,
        reun: ls.filter(l => ['Reunión', 'Propuesta', 'Ganado'].includes(l.estado)).length,
        ventas: gan.reduce((s, l) => s + (l.monto_vendido || 0), 0),
        diario: (c && c.diario) || [], anuncios: (c && c.anuncios) || [],
      }
    }
    return { porC, leads, camps }
  }, [datos])

  const leadsFiltrados = useMemo(() => {
    if (!M) return []
    const q = f.q.toLowerCase()
    return M.leads
      .filter(l => (!f.c || l.letra === f.c) && (!f.n || l.calificacion === f.n) && (!f.e || l.estado === f.e) && (!f.r || l.rubro === f.r)
        && (!q || [l.nombre, l.empresa, l.telefono, l.email].join(' ').toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }, [M, f])

  return (
    <CRMLayout title="Campañas Meta" onRefresh={() => carga(true)}>
      <div className="space-y-5">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex gap-3 items-start">
          <div className="text-2xl">🧪</div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-900">Campañas de prueba de Christopher (operadas por Claude)</h3>
            <p className="text-sm text-amber-800 mt-0.5">
              Sus leads están en Leads M&amp;P con la etiqueta <b>Campaña TEST de Christopher</b>: los gestiona Christopher.
              Prueba A vs B · presupuesto total $70.000 (7 al 14 de octubre).
            </p>
          </div>
          <a href="/api/crm/campanas-meta?formato=csv" className="px-3 py-2 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 whitespace-nowrap">⤓ CSV leads</a>
        </div>

        {cargando && !datos && <div className="text-center text-gray-500 py-10">Cargando…</div>}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
            {/sesi/i.test(error) && user && <span> Cierra sesión y vuelve a entrar para habilitar esta sección.</span>}
          </div>
        )}

        {M && datos && (
          <>
            <div className="flex flex-wrap gap-2 items-center text-xs text-gray-600">
              {M.camps.length ? M.camps.map(c => (
                <span key={c.id} className={`px-2.5 py-1 rounded-full font-semibold ${/ACTIVE/.test(c.estado || '') ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {c.letra} · {/ACTIVE/.test(c.estado || '') ? 'Activa' : 'En pausa'}
                </span>
              )) : <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">Campañas aún no encontradas</span>}
              <span>Meta: {datos.meta?.fuente || '—'}{datos.meta?.generado ? ' · ' + new Date(datos.meta.generado).toLocaleString('es-CL') : ''}</span>
              <span>· CRM: {datos.crm_error ? <b className="text-red-600">{datos.crm_error}</b> : `${M.leads.length} leads TEST`}</span>
            </div>
            {datos.meta?.aviso && <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">{datos.meta.aviso}</div>}

            {(() => {
              const P = M.porC, t = (k: string) => (P.A[k] || 0) + (P.B[k] || 0)
              const sp = t('spend'), cl = t('clicks'), ld = t('leads'), im = t('impressions'), ca = t('calif'), co = t('cont')
              const kpis: [string, string, string, boolean?][] = [
                ['Inversión', clp(sp), 'A + B · tope $70.000'],
                ['Clics', n0(cl), `CTR ${pct(div(cl, im))} · ${n0(im)} impresiones`],
                ['CPC', clp(div(sp, cl)), 'costo por clic en enlace'],
                ['Leads', n0(ld), `conversión ${pct(div(ld, cl))} de clics`, true],
                ['CPL', clp(div(sp, ld)), 'costo por lead'],
                ['Calificados (A+B)', n0(ca), `costo ${clp(div(sp, ca))} · ${pct(div(co, M.leads.length))} contactados`],
              ]
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {kpis.map(([l, v, s, dark]) => (
                    <div key={l} className={`rounded-xl p-4 border ${dark ? 'bg-gradient-to-br from-blue-900 to-indigo-700 text-white border-transparent' : 'bg-white border-gray-200'}`}>
                      <div className={`text-[11px] font-bold uppercase tracking-wide ${dark ? 'text-blue-100' : 'text-gray-500'}`}>{l}</div>
                      <div className="text-2xl font-extrabold mt-1">{v}</div>
                      <div className={`text-xs mt-1 ${dark ? 'text-blue-100' : 'text-gray-500'}`}>{s}</div>
                    </div>
                  ))}
                </div>
              )
            })()}

            {M.porC.A.spend + M.porC.B.spend === 0 && M.leads.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">⏳ Aún sin gasto ni leads: Meta tarda entre 30 minutos y unas horas en empezar a entregar, y las métricas llegan con 15–30 minutos de retraso.</div>
            )}

            <Card title="A vs B — quién gana" sub="Totales desde el inicio. Costos: gana el menor; volumen y tasas: gana el mayor.">
              {(() => {
                const A = M.porC.A, B = M.porC.B
                const filas: [string, number | null, number | null, (v: any) => string, number][] = [
                  ['Inversión', A.spend, B.spend, clp, 0], ['Impresiones', A.impressions, B.impressions, n0, 1], ['Alcance', A.reach, B.reach, n0, 1],
                  ['Frecuencia', A.frequency, B.frequency, v => (v ? v.toFixed(2) : '—'), 0], ['Clics en enlace', A.clicks, B.clicks, n0, 1],
                  ['CTR', div(A.clicks, A.impressions), div(B.clicks, B.impressions), pct, 1], ['CPC', div(A.spend, A.clicks), div(B.spend, B.clicks), clp, -1],
                  ['Leads', A.leads, B.leads, n0, 1], ['Tasa de conversión', div(A.leads, A.clicks), div(B.leads, B.clicks), pct, 1],
                  ['CPL', div(A.spend, A.leads), div(B.spend, B.leads), clp, -1], ['Leads calificados (A+B)', A.calif, B.calif, n0, 1],
                  ['Costo por lead calificado', div(A.spend, A.calif), div(B.spend, B.calif), clp, -1], ['% contactados', div(A.cont, A.leadsCrm), div(B.cont, B.leadsCrm), pct, 1],
                  ['Reuniones / propuestas', A.reun, B.reun, n0, 1], ['Costo por reunión', div(A.spend, A.reun), div(B.spend, B.reun), clp, -1], ['Ventas (CRM)', A.ventas, B.ventas, clp, 1],
                ]
                const gana = (a: number | null, b: number | null, d: number) => {
                  if (!d || a == null || b == null || (!a && !b) || !isFinite(a) || !isFinite(b)) return ''
                  if (a === b) return '='
                  return (d > 0 ? a > b : a < b) ? 'A' : 'B'
                }
                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-[11px] uppercase text-gray-500 border-b-2 border-gray-800">
                        <th className="text-left py-2 px-2">Métrica</th>
                        <th className="text-right py-2 px-2"><span className={`px-1.5 rounded ${TAG.A}`}>A</span> {corto(A.nombre)}</th>
                        <th className="text-right py-2 px-2"><span className={`px-1.5 rounded ${TAG.B}`}>B</span> {corto(B.nombre)}</th>
                        <th className="text-left py-2 px-2">Ganador</th>
                      </tr></thead>
                      <tbody>{filas.map(([l, a, b, fmt, d]) => {
                        const w = gana(a, b, d)
                        return (
                          <tr key={l} className="border-b border-gray-100">
                            <td className="py-2 px-2">{l}</td>
                            <td className="py-2 px-2 text-right font-mono">{fmt(a)}</td>
                            <td className="py-2 px-2 text-right font-mono">{fmt(b)}</td>
                            <td className="py-2 px-2">{w === 'A' || w === 'B' ? <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">🏆 {w}</span> : w === '=' ? 'empate' : '—'}</td>
                          </tr>
                        )
                      })}</tbody>
                    </table>
                  </div>
                )
              })()}
            </Card>

            <Card title="Evolución diaria" sub="A en índigo, B en turquesa" right={
              <div className="inline-flex bg-gray-100 rounded-lg p-1 text-xs">
                {(['spend', 'clicks', 'leads', 'cpl'] as const).map(k => (
                  <button key={k} onClick={() => setSerie(k)} className={`px-2.5 py-1 rounded-md font-semibold ${serie === k ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>
                    {{ spend: 'Gasto', clicks: 'Clics', leads: 'Leads', cpl: 'CPL' }[k]}
                  </button>
                ))}
              </div>
            }>
              {(() => {
                const P = M.porC
                const fechas = Array.from(new Set([...P.A.diario, ...P.B.diario].map((d: any) => d.fecha))).sort() as string[]
                if (!fechas.length) return <Vacio t="Sin días con datos todavía." />
                const val = (d: any) => (!d ? null : serie === 'cpl' ? (d.leads ? d.spend / d.leads : null) : d[serie])
                const ser = (['A', 'B'] as const).map(L => ({ L, v: fechas.map(fe => val(P[L].diario.find((d: any) => d.fecha === fe))) }))
                const all = ser.flatMap(s => s.v).filter((v): v is number => v != null)
                const mx = Math.max(1, ...all) * 1.15
                const W = 1100, H = 260, x0 = 64, y0 = 16, x1 = W - 16, y1 = H - 36
                const X = (i: number) => x0 + (fechas.length === 1 ? (x1 - x0) / 2 : (i * (x1 - x0)) / (fechas.length - 1))
                const Y = (v: number) => y1 - (v / mx) * (y1 - y0)
                const fmt = serie === 'spend' || serie === 'cpl' ? clp : n0
                return (
                  <>
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Evolución diaria">
                      {[0, 1, 2, 3, 4].map(i => { const v = (mx * i) / 4, y = Y(v); return <g key={i}><line x1={x0} x2={x1} y1={y} y2={y} stroke="#eef0f7" /><text x={x0 - 8} y={y + 4} fontSize="11" textAnchor="end" fill="#6b7189">{fmt(v)}</text></g> })}
                      {fechas.map((fe, i) => <text key={fe} x={X(i)} y={H - 14} fontSize="11" textAnchor="middle" fill="#6b7189">{fe.slice(8)}/{fe.slice(5, 7)}</text>)}
                      {ser.map(({ L, v }) => {
                        const pts = v.map((y, i) => (y == null ? null : [X(i), Y(y)])).filter(Boolean) as number[][]
                        return <g key={L}>
                          <polyline fill="none" stroke={COLOR[L]} strokeWidth="2.5" points={pts.map(p => p.join(',')).join(' ')} />
                          {v.map((y, i) => y == null ? null : <circle key={i} cx={X(i)} cy={Y(y)} r="3.5" fill="#fff" stroke={COLOR[L]} strokeWidth="2"><title>{`${L} · ${fechas[i]}: ${fmt(y)}`}</title></circle>)}
                        </g>
                      })}
                    </svg>
                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span><i className="inline-block w-2.5 h-2.5 rounded-sm mr-1 align-middle" style={{ background: COLOR.A }} />A · {corto(P.A.nombre)}</span>
                      <span><i className="inline-block w-2.5 h-2.5 rounded-sm mr-1 align-middle" style={{ background: COLOR.B }} />B · {corto(P.B.nombre)}</span>
                    </div>
                  </>
                )
              })()}
            </Card>

            <Card title="Anuncios" sub="★ = creativo ganador de su campaña (menor CPL con leads; si no hay leads, mayor CTR)">
              {(() => {
                const rows: any[] = []
                for (const L of ['A', 'B'] as const) {
                  const ads = M.porC[L].anuncios.map((a: any) => ({ ...a, L, ctr: div(a.clicks, a.impressions), cpc: div(a.spend, a.clicks), cpl: div(a.spend, a.leads) }))
                  const conLeads = ads.filter((a: any) => a.leads > 0).sort((a: any, b: any) => a.cpl - b.cpl)
                  const g = conLeads[0] || [...ads].sort((a: any, b: any) => (b.ctr || 0) - (a.ctr || 0))[0]
                  if (g && g.spend > 0) g.win = true
                  rows.push(...ads)
                }
                if (!rows.length) return <Vacio t="Los anuncios aparecen cuando las campañas tengan impresiones." />
                rows.sort((a, b) => b.spend - a.spend)
                return (
                  <div className="overflow-x-auto"><table className="w-full text-sm">
                    <thead><tr className="text-[11px] uppercase text-gray-500 border-b-2 border-gray-800">
                      {['Camp.', 'Anuncio', 'Conjunto', 'Gasto', 'Impr.', 'Clics', 'CTR', 'CPC', 'Leads', 'CPL'].map((h, i) => <th key={h} className={`py-2 px-2 ${i > 2 ? 'text-right' : 'text-left'}`}>{h}</th>)}
                    </tr></thead>
                    <tbody>{rows.map(r => (
                      <tr key={r.id || r.nombre} className="border-b border-gray-100">
                        <td className="py-2 px-2"><span className={`px-1.5 rounded text-xs font-bold ${TAG[r.L]}`}>{r.L}</span></td>
                        <td className="py-2 px-2">{r.win && <b>★ </b>}{r.nombre}</td>
                        <td className="py-2 px-2 text-xs text-gray-500">{r.conjunto}</td>
                        <td className="py-2 px-2 text-right font-mono">{clp(r.spend)}</td>
                        <td className="py-2 px-2 text-right font-mono">{n0(r.impressions)}</td>
                        <td className="py-2 px-2 text-right font-mono">{n0(r.clicks)}</td>
                        <td className="py-2 px-2 text-right font-mono">{pct(r.ctr)}</td>
                        <td className="py-2 px-2 text-right font-mono">{clp(r.cpc)}</td>
                        <td className="py-2 px-2 text-right font-mono">{n0(r.leads)}</td>
                        <td className="py-2 px-2 text-right font-mono">{clp(r.cpl)}</td>
                      </tr>
                    ))}</tbody>
                  </table></div>
                )
              })()}
            </Card>

            <div className="grid md:grid-cols-2 gap-5">
              <Card title="Calidad de leads" sub="Calificación por campaña">
                {!M.leads.length ? <Vacio t="Sin leads todavía." /> : (['A', 'B'] as const).map(L => {
                  const ls = M.leads.filter(l => l.letra === L), n = ls.length || 1, c = (x: string) => ls.filter(l => l.calificacion === x).length
                  return (
                    <div key={L} className="mb-4">
                      <div className="flex justify-between text-sm font-semibold"><span><span className={`px-1.5 rounded text-xs ${TAG[L]}`}>{L}</span> {ls.length} leads</span><span>{pct(div(c('A') + c('B'), ls.length))} calificados</span></div>
                      <div className="flex h-3.5 rounded overflow-hidden bg-gray-100 mt-1.5">
                        <div style={{ width: `${(c('A') / n) * 100}%`, background: '#16a34a' }} /><div style={{ width: `${(c('B') / n) * 100}%`, background: '#eab308' }} /><div style={{ width: `${(c('C') / n) * 100}%`, background: '#ef4444' }} />
                      </div>
                      <div className="flex gap-3 text-xs text-gray-500 mt-1"><span>A {c('A')}</span><span>B {c('B')}</span><span>C {c('C')}</span></div>
                    </div>
                  )
                })}
                <ul className="text-xs text-gray-600 space-y-1 mt-2 list-disc pl-4">
                  <li><b>Presupuesto mensual de marketing</b>: ≥ $1.000.000 → 2 pts · $500.000–999.999 → 1 pt</li>
                  <li><b>Cargo decisor</b> (dueño, socio, gerente, director, CEO, jefe/head de marketing) → 2 pts</li>
                  <li><b>Rubro objetivo</b> de las campañas → 1 pt · <b>Empresa identificable</b> (nombre + web o correo corporativo) → 1 pt</li>
                  <li><span className={`px-1 rounded ${NOTA.A}`}>A</span> 5–6 pts · <span className={`px-1 rounded ${NOTA.B}`}>B</span> 3–4 · <span className={`px-1 rounded ${NOTA.C}`}>C</span> 0–2 · &quot;Calificado&quot; = A o B</li>
                </ul>
              </Card>

              <Card title="Atención del lead" sub="Estado en el CRM y velocidad de contacto">
                {!M.leads.length ? <Vacio t="Sin leads todavía." /> : (() => {
                  const L = M.leads, hs = L.map(l => l.horas_a_contacto).filter((v): v is number => v != null).sort((a, b) => a - b)
                  const med = hs.length ? hs[Math.floor(hs.length / 2)] : null
                  const atras = L.filter(l => !l.contactado && (Date.now() - new Date(l.fecha).getTime()) / 36e5 > 24).length
                  return (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div><div className="text-[11px] font-bold uppercase text-gray-500">Contactados</div><div className="text-xl font-extrabold">{pct(div(L.filter(l => l.contactado).length, L.length))}</div></div>
                        <div><div className="text-[11px] font-bold uppercase text-gray-500">Mediana 1er contacto</div><div className="text-xl font-extrabold">{med == null ? '—' : med < 1 ? Math.round(med * 60) + ' min' : med.toFixed(1) + ' h'}</div></div>
                        <div><div className="text-[11px] font-bold uppercase text-gray-500">Sin contactar &gt;24 h</div><div className={`text-xl font-extrabold ${atras ? 'text-red-600' : 'text-green-600'}`}>{atras}</div></div>
                      </div>
                      <div className="space-y-1.5">{ESTADOS.map(e => {
                        const v = L.filter(l => l.estado === e).length
                        return (
                          <div key={e} className="grid grid-cols-[90px_1fr_50px] gap-2 items-center text-xs">
                            <div>{e}</div>
                            <div className="h-6 rounded text-white font-bold flex items-center pl-2" style={{ width: `${Math.max(4, (v / L.length) * 100)}%`, background: e === 'Perdido' ? '#94a3b8' : 'linear-gradient(90deg,#1e3a8a,#4F46E5)' }}>{v || ''}</div>
                            <div className="text-right font-mono">{pct(div(v, L.length))}</div>
                          </div>
                        )
                      })}</div>
                    </>
                  )
                })()}
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <Card title="Rubro" sub="Empresas que dejaron sus datos"><Barras items={cuenta(M.leads, l => l.rubro).slice(0, 8)} total={M.leads.length} /></Card>
              <Card title="Perfil / cargo" sub="Decisores vs otros cargos">
                <Barras total={M.leads.length} items={cuenta(M.leads, l => (!l.cargo ? 'Sin dato' : DECISOR.test(l.cargo) ? 'Decisor' : 'Otro cargo')).map(([k, v]) => [k, v, k === 'Decisor' ? '#16a34a' : k === 'Otro cargo' ? '#eab308' : '#cbd5e1'])} />
              </Card>
              <Card title="Presupuesto y zona" sub="Presupuesto mensual declarado · zona">
                <Barras total={M.leads.length} items={cuenta(M.leads, l => l.presupuesto_monto == null ? (l.presupuesto || 'Sin dato') : l.presupuesto_monto >= 3e6 ? '≥ $3M' : l.presupuesto_monto >= 1e6 ? '$1M – $3M' : l.presupuesto_monto >= 5e5 ? '$500K – $1M' : '< $500K')} />
                <div className="mt-4"><Barras total={M.leads.length} color="#0EA5A4" items={cuenta(M.leads, l => l.zona).slice(0, 6)} /></div>
              </Card>
            </div>

            <Card title="Detalle por lead" sub="Rojo = sin contactar hace más de 24 h. Etiqueta: Campaña TEST de Christopher.">
              <div className="flex flex-wrap gap-2 mb-3 text-sm">
                <input value={f.q} onChange={e => setF({ ...f, q: e.target.value })} placeholder="Buscar nombre, empresa, teléfono" className="border border-gray-300 rounded-lg px-3 py-1.5 flex-1 min-w-[200px]" />
                <select value={f.c} onChange={e => setF({ ...f, c: e.target.value })} className="border border-gray-300 rounded-lg px-2 py-1.5"><option value="">A y B</option><option>A</option><option>B</option></select>
                <select value={f.n} onChange={e => setF({ ...f, n: e.target.value })} className="border border-gray-300 rounded-lg px-2 py-1.5"><option value="">Toda calificación</option><option>A</option><option>B</option><option>C</option></select>
                <select value={f.e} onChange={e => setF({ ...f, e: e.target.value })} className="border border-gray-300 rounded-lg px-2 py-1.5"><option value="">Todo estado</option>{ESTADOS.map(e => <option key={e}>{e}</option>)}</select>
                <select value={f.r} onChange={e => setF({ ...f, r: e.target.value })} className="border border-gray-300 rounded-lg px-2 py-1.5"><option value="">Todo rubro</option>{Array.from(new Set(M.leads.map(l => l.rubro).filter(Boolean))).sort().map(r => <option key={r}>{r}</option>)}</select>
                <span className="text-xs text-gray-500 self-center ml-auto">{leadsFiltrados.length} de {M.leads.length} leads</span>
              </div>
              {!leadsFiltrados.length ? <Vacio t="Sin leads todavía." /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm">
                  <thead><tr className="text-[11px] uppercase text-gray-500 border-b-2 border-gray-800">
                    {['Fecha', 'Nombre', 'Empresa', 'Cargo', 'Rubro', 'Presupuesto', 'WhatsApp', 'Camp.', 'Anuncio', 'Estado', '1er contacto', 'Calif.'].map(h => <th key={h} className="text-left py-2 px-2 whitespace-nowrap">{h}</th>)}
                  </tr></thead>
                  <tbody>{leadsFiltrados.map(l => {
                    const rojo = !l.contactado && (Date.now() - new Date(l.fecha).getTime()) / 36e5 > 24
                    return (
                      <tr key={l.id} className={`border-b border-gray-100 ${rojo ? 'bg-red-50' : ''}`}>
                        <td className="py-2 px-2 text-xs whitespace-nowrap">{l.fecha ? new Date(l.fecha).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                        <td className="py-2 px-2 font-semibold">{l.nombre}<div className="mt-0.5"><span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">🧪 Campaña TEST de Christopher</span></div></td>
                        <td className="py-2 px-2">{l.empresa || '—'}</td>
                        <td className="py-2 px-2">{l.cargo || '—'}</td>
                        <td className="py-2 px-2">{l.rubro || '—'}</td>
                        <td className="py-2 px-2">{l.presupuesto || '—'}</td>
                        <td className="py-2 px-2 whitespace-nowrap">{l.telefono ? <a className="text-blue-700 underline" href={`https://wa.me/${String(l.telefono).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{l.telefono}</a> : '—'}</td>
                        <td className="py-2 px-2"><span className={`px-1.5 rounded text-xs font-bold ${TAG[l.letra]}`}>{l.letra}</span></td>
                        <td className="py-2 px-2 text-xs">{l.anuncio || '—'}</td>
                        <td className="py-2 px-2">{l.estado}</td>
                        <td className="py-2 px-2 text-right font-mono">{l.horas_a_contacto == null ? '—' : l.horas_a_contacto + ' h'}</td>
                        <td className="py-2 px-2"><span className={`px-1.5 rounded text-xs font-bold ${NOTA[l.calificacion]}`} title={`${l.score} pts`}>{l.calificacion}</span></td>
                      </tr>
                    )
                  })}</tbody>
                </table></div>
              )}
            </Card>

            <p className="text-xs text-gray-400 text-center">
              Datos: Meta Ads (cuenta M&amp;P, campañas &quot;TEST Claude&quot;) + CRM M&amp;P (leads TEST). Mismos datos que el panel myp-meta-test.vercel.app.
            </p>
          </>
        )}
      </div>
    </CRMLayout>
  )
}
