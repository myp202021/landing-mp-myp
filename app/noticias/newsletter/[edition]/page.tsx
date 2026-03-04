import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, BarChart2, ExternalLink } from 'lucide-react'
import { notFound } from 'next/navigation'
import SubscribeForm from '../SubscribeForm'

export const dynamic = 'force-dynamic'

const formatoLabel: Record<string, string> = {
  reel:     'Reels',
  carrusel: 'Carruseles',
  imagen:   'Imágenes estáticas',
}
const formatoEmoji: Record<string, string> = {
  reel:     '🎬',
  carrusel: '📑',
  imagen:   '🖼️',
}

export async function generateMetadata({ params }: { params: { edition: string } }): Promise<Metadata> {
  return {
    title: `Newsletter Semana ${params.edition} — Datos de Marketing Digital | M&P`,
    description: 'Análisis semanal de tendencias de marketing digital con datos reales de engagement por formato, benchmarks y recomendaciones para Chile.',
    alternates: { canonical: `https://www.mulleryperez.cl/noticias/newsletter/${params.edition}` }
  }
}

export default async function NewsletterEdicionPage({ params }: { params: { edition: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('radar_marketing')
    .select('*')
    .eq('slug', params.edition)
    .single()

  if (error || !data) notFound()

  const dist: Record<string, number>    = data.dist_formatos || {}
  const prom: Record<string, number>    = data.promedios_formatos || {}
  const top                             = data.top_post
  const posts: any[]                    = (data.posts_raw || []).slice(0, 6)

  const formatosBarra = Object.entries(formatoLabel).map(([key, label]) => ({
    key, label,
    pct:        dist[key] || 0,
    avg:        prom[key] || 0,
    esGanador:  key === data.formato_ganador,
    esMenor:    key === data.formato_perdedor,
  })).sort((a, b) => b.avg - a.avg)

  const maxAvg = Math.max(...formatosBarra.map(f => f.avg)) || 1

  const fechaInicio = data.fecha_inicio
    ? new Date(data.fecha_inicio + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })
    : ''
  const fechaFin = data.fecha_fin
    ? new Date(data.fecha_fin + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-9 w-auto" /></Link>
          <Link href="/noticias/newsletter" className="text-gray-500 hover:text-gray-900 text-sm flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Newsletter
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-200">
              Semana {data.semana} · {data.año}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
              {fechaInicio} — {fechaFin}
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mb-3 text-gray-900">
            Marketing Digital en Datos — Semana {data.semana}
          </h1>
          <p className="text-gray-500 text-lg">
            {data.total_posts} publicaciones analizadas · {data.cuentas_analizadas} cuentas de referencia global
          </p>
        </div>

        {/* Métricas clave */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Posts analizados',       value: String(data.total_posts) },
            { label: 'Cuentas monitoreadas',   value: String(data.cuentas_analizadas) },
            { label: 'Formato ganador',        value: `${formatoEmoji[data.formato_ganador] || ''} ${formatoLabel[data.formato_ganador] || data.formato_ganador}` },
            { label: 'Eng. promedio ganador',  value: data.eng_ganador?.toLocaleString('es-CL') || '—' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-xl font-black text-gray-900 mb-1">{item.value}</div>
              <div className="text-gray-400 text-xs">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Engagement por formato */}
        <section className="mb-10">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" /> Engagement promedio por formato esta semana
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-5">
            {formatosBarra.map((f) => {
              const pctBarra = Math.round((f.avg / maxAvg) * 100)
              return (
                <div key={f.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{formatoEmoji[f.key]}</span>
                      <span className="font-semibold text-gray-900">{f.label}</span>
                      {f.esGanador && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">Ganador</span>}
                      {f.esMenor && <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded-full text-xs font-bold">Menor</span>}
                    </div>
                    <span className="font-bold text-gray-900">{f.avg.toLocaleString('es-CL')} <span className="text-gray-400 text-xs font-normal">eng. avg</span></span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${f.esGanador ? 'bg-green-500' : f.esMenor ? 'bg-red-400' : 'bg-blue-500'}`}
                      style={{ width: `${pctBarra}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400 text-xs">{f.pct}% del contenido publicado</span>
                    {f.esGanador && formatosBarra[formatosBarra.length - 1]?.avg > 0 && f.avg > 0 && (
                      <span className="text-green-600 text-xs font-bold">
                        +{Math.round(((f.avg - formatosBarra[formatosBarra.length - 1].avg) / formatosBarra[formatosBarra.length - 1].avg) * 100)}% vs formato menor
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Top post */}
        {top && (
          <section className="mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Post más viral de la semana
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex gap-5">
              <a href={top.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </a>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-blue-600">@{top.cuenta}</span>
                  <a href={top.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                  </a>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">{top.caption}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">❤️ {Number(top.likes || 0).toLocaleString('es-CL')}</span>
                  <span className="text-gray-500">💬 {Number(top.comments || 0).toLocaleString('es-CL')}</span>
                  <span className="text-green-600 font-bold">{Number(top.eng || 0).toLocaleString('es-CL')} eng total</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Posts destacados */}
        {posts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">
              Publicaciones destacadas de la semana
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {posts.map((p: any, i: number) => (
                <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 hover:border-gray-400 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-lg">
                    📸
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-blue-600 text-xs font-bold mb-1">@{p.ownerUsername}</div>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{p.caption}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      <span>❤️ {Number(p.likesCount || 0).toLocaleString('es-CL')}</span>
                      <span>💬 {Number(p.commentsCount || 0).toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA suscripción */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <p className="text-blue-800 font-bold mb-1">¿Quieres recibir esto cada semana?</p>
          <p className="text-blue-600 text-sm mb-4">Datos reales de marketing digital, sin opiniones. Gratis.</p>
          <SubscribeForm />
        </div>

      </main>

      <footer className="border-t border-gray-200 py-8 px-6 text-center mt-12">
        <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-8 w-auto mx-auto mb-3 opacity-40" /></Link>
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Muller y Pérez — Marketing & Performance</p>
      </footer>
    </div>
  )
}
