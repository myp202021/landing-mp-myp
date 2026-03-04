import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, BarChart2, Briefcase, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Termómetro de Marketing Digital Chile — Datos Semanales | Muller y Pérez',
  description: 'Panel semanal con CPC promedio por industria en Chile, indicadores económicos y mercado laboral digital actualizado cada lunes.',
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

function VarBadgeJobs({ val }: { val: number | null }) {
  if (val === null || val === undefined) return <span className="text-white/30 text-xs">—</span>
  if (val > 0) return (
    <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-bold">
      <TrendingUp className="w-3 h-3" />+{val}%
    </span>
  )
  if (val < 0) return (
    <span className="flex items-center gap-0.5 text-red-400 text-xs font-bold">
      <TrendingDown className="w-3 h-3" />{val}%
    </span>
  )
  return <span className="flex items-center gap-0.5 text-white/40 text-xs"><Minus className="w-3 h-3" />0%</span>
}

export default async function IndicadoresPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('indicadores_semanales')
    .select('*')
    .order('año', { ascending: false })
    .order('semana', { ascending: false })
    .limit(1)
    .single()

  const cpcData: any[]    = data?.cpc_data    || []
  const ofertasData: any[]= data?.ofertas_data|| []

  const fechaActualizada = data?.fecha
    ? new Date(data.fecha + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
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
            CPC promedio por industria, indicadores económicos y mercado laboral digital.
            Datos reales, actualizados cada semana.
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
                { label: 'USD · CLP', value: `$${data.usd_clp?.toLocaleString('es-CL')}`, sub: data.usd_var_pct != null ? `${data.usd_var_pct > 0 ? '+' : ''}${data.usd_var_pct}% vs sem. ant.` : 'Banco Central Chile', color: data.usd_var_pct > 0 ? '#f87171' : data.usd_var_pct < 0 ? '#34d399' : '#ffffff' },
                { label: 'UF', value: `$${Math.round(data.uf_clp)?.toLocaleString('es-CL')}`, sub: 'Valor diario', color: '#ffffff' },
                { label: 'Industrias monitoreadas', value: String(cpcData.length), sub: 'CPC Google + Meta', color: '#00d4ff' },
                { label: 'Cargos digitales', value: `${data.total_ofertas?.toLocaleString('es-CL') || '—'}`, sub: data.var_total_ofertas_pct != null ? `${data.var_total_ofertas_pct > 0 ? '+' : ''}${data.var_total_ofertas_pct}% vs sem. ant.` : 'ofertas esta semana', color: data.var_total_ofertas_pct > 0 ? '#34d399' : '#ffffff' },
              ].map((m, i) => (
                <div key={i} className="rounded-2xl p-5 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="text-2xl font-black mb-1" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-white/80 text-sm font-semibold">{m.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabla CPC por industria */}
            {cpcData.length > 0 && (
              <section className="mb-12">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color: '#00d4ff' }}>
                  <DollarSign className="w-4 h-4" /> CPC estimado por industria — Google Ads y Meta Ads
                </h2>
                <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {/* Header tabla */}
                  <div className="grid grid-cols-5 px-5 py-3 border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-wider">
                    <div className="col-span-2">Industria</div>
                    <div className="text-right">Google CPC</div>
                    <div className="text-right">Meta CPC</div>
                    <div className="text-right">Var. semana</div>
                  </div>
                  {cpcData.map((ind: any, i: number) => (
                    <div key={ind.id}
                      className="grid grid-cols-5 px-5 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                    >
                      <div className="col-span-2 text-sm font-medium text-white">{ind.label}</div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">${ind.google_clp?.toLocaleString('es-CL')}</span>
                        <span className="text-white/40 text-xs ml-1">CLP</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold" style={{ color: '#00d4ff' }}>${ind.meta_clp?.toLocaleString('es-CL')}</span>
                        <span className="text-white/40 text-xs ml-1">CLP</span>
                      </div>
                      <div className="flex justify-end">
                        <VarBadge val={ind.google_var_pct} />
                      </div>
                    </div>
                  ))}
                  <div className="px-5 py-3 text-xs text-white/25 border-t border-white/5">
                    CPC base calibrado con Ubersuggest Chile. Ajustado semanalmente por tipo de cambio USD. Meta CPC calculado por ratio de industria (benchmarks WordStream/Databox).
                  </div>
                </div>
              </section>
            )}

            {/* Tabla mercado laboral */}
            {ofertasData.length > 0 && (
              <section className="mb-12">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color: '#00d4ff' }}>
                  <Briefcase className="w-4 h-4" /> Mercado laboral digital Chile — Ofertas activas esta semana
                </h2>
                <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="grid grid-cols-3 px-5 py-3 border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-wider">
                    <div className="col-span-2">Cargo</div>
                    <div className="text-right">Ofertas / variación</div>
                  </div>
                  {ofertasData
                    .slice()
                    .sort((a: any, b: any) => b.count - a.count)
                    .map((o: any) => (
                    <div key={o.id}
                      className="grid grid-cols-3 px-5 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                    >
                      <div className="col-span-2 text-sm font-medium text-white">{o.label}</div>
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-sm font-black text-white">{o.count?.toLocaleString('es-CL') || '—'}</span>
                        <VarBadgeJobs val={o.var_pct} />
                      </div>
                    </div>
                  ))}
                  <div className="px-5 py-3 text-xs text-white/25 border-t border-white/5">
                    Fuente: Computrabajo.cl. Búsqueda por cargo en Chile, actualizado cada lunes.
                  </div>
                </div>
              </section>
            )}

            {/* Nota metodológica */}
            <div className="rounded-2xl p-6 border border-white/10 mb-10" style={{ background: 'rgba(0,212,255,0.05)', borderColor: 'rgba(0,212,255,0.15)' }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#00d4ff' }}>¿Cómo se calculan estos datos?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Los CPC de Google son benchmarks calibrados con datos reales de Ubersuggest Chile (~1.200 keywords analizadas).
                Se actualizan semanalmente multiplicando por la variación del USD (fuente: Banco Central de Chile vía mindicador.cl),
                ya que las plataformas de pauta facturan en USD. Los CPC de Meta son estimados por ratio de industria
                basados en benchmarks públicos de WordStream y Databox. Las ofertas laborales provienen de Computrabajo.cl.
              </p>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-8 text-center border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="font-bold text-white text-lg mb-1">¿Cuánto debería invertir en pauta tu empresa?</p>
              <p className="text-white/50 text-sm mb-5">Usa el Predictor M&P: proyección de ROAS, CAC y conversiones para tu industria.</p>
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
