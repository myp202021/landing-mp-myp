import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, BarChart2, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Newsletter Semanal — Datos de Marketing Digital Chile | Muller y Pérez',
  description: 'Análisis semanal de tendencias de marketing digital con datos reales: engagement por formato, benchmarks y recomendaciones accionables para Chile.',
  alternates: { canonical: 'https://www.mulleryperez.cl/noticias/newsletter' }
}

const formatoLabel: Record<string, string> = {
  reel: 'Reels',
  carrusel: 'Carruseles',
  imagen: 'Imágenes estáticas',
}

export default async function NewsletterIndexPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: ediciones } = await supabase
    .from('radar_marketing')
    .select('*')
    .order('semana', { ascending: false })
    .order('semana', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-9 w-auto" /></Link>
          <Link href="/" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
            Actualizado cada lunes · Automatizado
          </span>
          <h1 className="text-4xl font-black mt-4 mb-3">Newsletter Semanal M&P</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Análisis semanal de tendencias de marketing digital basado en datos reales.
            {' '}{ediciones?.[0]?.cuentas_analizadas || 8} cuentas monitoreadas. Números, no opiniones.
          </p>
        </div>

        {!ediciones || ediciones.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">La primera edición se publicará el próximo lunes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ediciones.map((e, i) => (
              <Link
                key={e.slug}
                href={`/noticias/newsletter/${e.slug}`}
                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-black text-sm">{e.semana}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                        Semana {e.semana} · {e.año}
                      </span>
                      {i === 0 && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">Nuevo</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {e.fecha_inicio && new Date(e.fecha_inicio + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
                      {' '}—{' '}
                      {e.fecha_fin && new Date(e.fecha_fin + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right hidden md:block">
                    <div className="text-white font-bold">{formatoLabel[e.formato_ganador] || e.formato_ganador}</div>
                    <div className="text-gray-500 text-xs">Formato ganador</div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-green-400 font-bold">{e.total_posts} posts</div>
                    <div className="text-gray-500 text-xs">analizados</div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-8 px-6 text-center mt-12">
        <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-8 w-auto mx-auto mb-3 opacity-50" /></Link>
        <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Muller y Pérez — Marketing & Performance</p>
      </footer>
    </div>
  )
}
