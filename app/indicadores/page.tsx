import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, BarChart2, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Termómetro de Marketing Digital Chile — CPC y CPA por Industria | Muller y Pérez',
  description: 'CPC y CPA estimado por industria en Chile para Google Ads y Meta Ads, ajustados semanalmente al tipo de cambio USD. Datos reales actualizados cada lunes.',
  alternates: { canonical: 'https://www.mulleryperez.cl/indicadores' }
}

function VarBadge({ val }: { val: number | null }) {
  if (val === null || val === undefined) return <span className="text-white/30 text-xs">—</span>
  if (val > 0) return (
    <span className="flex items-center gap-0.5 text-red-400 text-xs font-bold">
      <TrendingUp className="w-3 h-3" />+{val}%
    </span>
  )
  if (val < 0) return (
    <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-bold">
      <TrendingDown className="w-3 h-3" />{val}%
    </span>
  )
  return <span className="flex items-center gap-0.5 text-white/40 text-xs"><Minus className="w-3 h-3" />0%</span>
}

function clp(n: number | undefined | null) {
  if (n == null || isNaN(n)) return '—'
  return '$' + Math.round(n).toLocaleString('es-CL')
}

// CVR por industria (fuente: predictor M&P) — se usa para calcular CPA en frontend
const CVR_MAP: Record<string, number> = {
  ecommerce: 2.1, moda_retail: 2.4, gastronomia: 2.8, educacion: 4.2,
  tecnologia: 3.2, hogar: 2.1, belleza: 2.9, deportes: 2.8,
  veterinaria: 4.8, automotriz: 1.6, inmobiliaria: 1.8, turismo: 2.1,
  salud: 3.4, legal: 3.1, profesionales: 3.2, construccion: 2.1,
  logistica: 2.4, seguros: 2.1, manufactura: 2.8, energia: 2.1,
  fintech: 2.8, agro: 2.4,
}

export default async function IndicadoresPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('indicadores_semanales')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single()

  // Enriquecer cpc_data con CPA calculado en frontend (tolerante a datos legacy)
  const cpcData: any[] = (data?.cpc_data || []).map((ind: any) => {
    const cvr = ind.cvr ?? CVR_MAP[ind.id] ?? 2.0
    return {
      ...ind,
      cvr,
      cpa_google_clp: ind.cpa_google_clp ?? Math.round(ind.google_clp / (cvr / 100)),
      cpa_meta_clp:   ind.cpa_meta_clp   ?? Math.round(ind.meta_clp   / (cvr / 100)),
    }
  })

  const fechaActualizada = data?.fecha
    ? new Date(data.fecha + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  // CPA promedio Google entre todas las industrias
  const avgCpaGoogle = cpcData.length
    ? Math.round(cpcData.reduce((s: number, i: any) => s + (i.cpa_google_clp || 0), 0) / cpcData.length)
    : null

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d1f5c 45%, #0a1628 100%)' }}>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50" style={{ background: 'rgba(10,22,40,0.9)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-9 w-auto" /></Link>
          <Link href="/" className="text-white/50 hover:text-white text-sm flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-14">

        {/* Hero */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-5"
            style={{ background: 'rgba(0,212,255,0.1)', borderColor: 'rgba(0,212,255,0.3)', color: '#00d4ff' }}>
            <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
            Actualizado cada lunes · Automatizado
          </span>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Termómetro de<br />
            <span style={{ color: '#00d4ff' }}>Marketing Digital Chile</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            CPC y CPA estimado para Google Ads y Meta Ads en 22 industrias, ajustados semanalmente
            al tipo de cambio USD. Calculado con datos reales del mercado chileno.
          </p>
          {fechaActualizada && (
            <p className="text-white/30 text-sm mt-3">Última actualización: {fechaActualizada} · Semana {data.semana}/{data.año}</p>
          )}
        </div>

        {!data ? (
          <div className="rounded-2xl p-16 text-center border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <BarChart2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">Los indicadores se publican cada lunes.</p>
          </div>
        ) : (
          <>
            {/* Métricas macro */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {[
                {
                  label: 'USD · CLP',
                  value: `$${data.usd_clp?.toLocaleString('es-CL')}`,
                  sub: data.usd_var_pct != null ? `${data.usd_var_pct > 0 ? '+' : ''}${data.usd_var_pct}% vs sem. ant.` : 'Banco Central Chile',
                  color: data.usd_var_pct > 0 ? '#f87171' : data.usd_var_pct < 0 ? '#34d399' : '#ffffff'
                },
                {
                  label: 'UF',
                  value: `$${Math.round(data.uf_clp)?.toLocaleString('es-CL')}`,
                  sub: 'Valor diario',
                  color: '#ffffff'
                },
                {
                  label: 'Industrias analizadas',
                  value: String(cpcData.length),
                  sub: 'Google Ads + Meta Ads',
                  color: '#00d4ff'
                },
                {
                  label: 'CPA prom. Google',
                  value: avgCpaGoogle ? clp(avgCpaGoogle) : '—',
                  sub: 'Promedio entre industrias',
                  color: '#a78bfa'
                },
              ].map((m, i) => (
                <div key={i} className="rounded-2xl p-5 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="text-2xl font-black mb-1" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-white/80 text-sm font-semibold">{m.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabla principal: CPC + CPA por industria */}
            {cpcData.length > 0 && (
              <section className="mb-12">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color: '#00d4ff' }}>
                  <DollarSign className="w-4 h-4" /> CPC y CPA estimado por industria — Google Ads y Meta Ads
                </h2>
                <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>

                  {/* Header desktop */}
                  <div className="hidden md:grid px-5 py-3 border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-wider"
                    style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.6fr 0.7fr' }}>
                    <div>Industria</div>
                    <div className="text-right">G. CPC</div>
                    <div className="text-right text-emerald-400/60">G. CPA</div>
                    <div className="text-right" style={{ color: 'rgba(0,212,255,0.6)' }}>M. CPC</div>
                    <div className="text-right text-purple-400/60">M. CPA</div>
                    <div className="text-right">CVR</div>
                    <div className="text-right">Var.</div>
                  </div>

                  {/* Header mobile */}
                  <div className="grid md:hidden px-4 py-3 border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-wider"
                    style={{ gridTemplateColumns: '2fr 1fr 1fr 0.7fr' }}>
                    <div>Industria</div>
                    <div className="text-right">G. CPC</div>
                    <div className="text-right" style={{ color: 'rgba(0,212,255,0.6)' }}>M. CPC</div>
                    <div className="text-right">Var.</div>
                  </div>

                  {cpcData.map((ind: any) => (
                    <div key={ind.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">

                      {/* Row desktop */}
                      <div className="hidden md:grid px-5 py-3.5 items-center"
                        style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.6fr 0.7fr' }}>
                        <div className="text-sm font-medium text-white">{ind.label}</div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white">{clp(ind.google_clp)}</span>
                          <span className="text-white/30 text-xs ml-0.5">CLP</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-400">{clp(ind.cpa_google_clp)}</span>
                          <span className="text-white/30 text-xs ml-0.5">CLP</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold" style={{ color: '#00d4ff' }}>{clp(ind.meta_clp)}</span>
                          <span className="text-white/30 text-xs ml-0.5">CLP</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-purple-400">{clp(ind.cpa_meta_clp)}</span>
                          <span className="text-white/30 text-xs ml-0.5">CLP</span>
                        </div>
                        <div className="text-right text-white/50 text-sm">{ind.cvr}%</div>
                        <div className="flex justify-end">
                          <VarBadge val={ind.google_var_pct} />
                        </div>
                      </div>

                      {/* Row mobile */}
                      <div className="grid md:hidden px-4 py-3.5 items-center"
                        style={{ gridTemplateColumns: '2fr 1fr 1fr 0.7fr' }}>
                        <div className="text-sm font-medium text-white">{ind.label}</div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white">{clp(ind.google_clp)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold" style={{ color: '#00d4ff' }}>{clp(ind.meta_clp)}</span>
                        </div>
                        <div className="flex justify-end">
                          <VarBadge val={ind.google_var_pct} />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="px-5 py-3 text-xs text-white/25 border-t border-white/5 leading-relaxed">
                    <span className="text-white/40 font-semibold">CPC:</span> benchmarks calibrados con Ubersuggest Chile, ajustados por USD semanal. &nbsp;
                    <span className="text-emerald-400/50 font-semibold">CPA Google</span> y{' '}
                    <span className="text-purple-400/50 font-semibold">CPA Meta:</span> CPC ÷ tasa de conversión de industria (fuente: predictor M&amp;P). &nbsp;
                    <span className="text-white/40 font-semibold">CVR:</span> tasa de conversión promedio por industria.
                  </div>
                </div>
              </section>
            )}

            {/* Nota metodológica */}
            <div className="rounded-2xl p-6 border border-white/10 mb-10" style={{ background: 'rgba(0,212,255,0.05)', borderColor: 'rgba(0,212,255,0.15)' }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#00d4ff' }}>¿Cómo se calculan estos datos?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Los <strong className="text-white/80">CPC de Google</strong> son benchmarks calibrados con datos reales de Ubersuggest Chile (~1.200 keywords analizadas, base Sep 2025).
                Se ajustan semanalmente por el tipo de cambio USD (fuente: Banco Central vía mindicador.cl), ya que las plataformas facturan en dólares.
                Los <strong className="text-white/80">CPC de Meta</strong> se estiman aplicando ratios de industria sobre el CPC Google (benchmarks WordStream/Databox).
                El <strong className="text-white/80">CPA</strong> se calcula dividiendo el CPC por la tasa de conversión promedio de cada industria,
                obtenida del motor del predictor M&P.
                Un CPA más bajo indica mayor eficiencia publicitaria.
              </p>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-8 text-center border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="font-bold text-white text-lg mb-1">¿Cuánto debería invertir en pauta tu empresa?</p>
              <p className="text-white/50 text-sm mb-5">Usa el Predictor M&P: proyección de ROAS, CAC y conversiones para tu industria específica.</p>
              <Link href="/labs/predictor"
                className="inline-block px-7 py-3 rounded-xl font-bold text-sm transition-all text-white"
                style={{ background: 'linear-gradient(90deg, #0050ff, #00d4ff)' }}>
                Calcular mi inversión óptima →
              </Link>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-white/10 py-8 px-6 text-center mt-6">
        <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-8 w-auto mx-auto mb-3 opacity-30" /></Link>
        <p className="text-white/20 text-sm">© {new Date().getFullYear()} Muller y Pérez — Marketing & Performance</p>
      </footer>
    </div>
  )
}
