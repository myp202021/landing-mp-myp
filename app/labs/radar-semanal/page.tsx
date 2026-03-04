import { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Minus, ArrowLeft, Zap, BarChart2, AlertCircle, CheckCircle2, Bell } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Radar Semanal M&P — Inteligencia de marketing digital en Chile',
  description: 'Lo que movió el mercado de marketing digital esta semana: tendencias, benchmarks reales y recomendaciones accionables para Chile.',
  alternates: { canonical: 'https://www.mulleryperez.cl/labs/radar-semanal' }
}

const semana = { numero: 10, desde: '3 de marzo', hasta: '9 de marzo', año: '2026' }

const plataformas = [
  {
    nombre: 'Meta Ads',
    logo: '📘',
    tendencia: 'up',
    resumen: 'CPM bajó 8% respecto a la semana anterior. Reels siguen dominando el placement con menor costo.',
    dato: 'CPM −8%',
    color: 'blue',
    detalle: 'La caída de CPM en Meta coincide con menor actividad de anunciantes grandes post-temporada verano. Ventana de oportunidad para escalar.'
  },
  {
    nombre: 'Google Ads',
    logo: '🔴',
    tendencia: 'neutral',
    resumen: 'CPC estable. Performance Max sigue ganando cuota sobre Search estándar en e-commerce.',
    dato: 'CPC =',
    color: 'red',
    detalle: 'Google anunció nuevos controles de segmentación para PMax — ahora se puede excluir términos de marca de campañas PMax.'
  },
  {
    nombre: 'LinkedIn Ads',
    logo: '🔷',
    tendencia: 'up',
    resumen: 'CTR en Lead Gen Forms subió 15% en Chile. Contenido de thought leadership supera a posts de producto.',
    dato: 'CTR +15%',
    color: 'indigo',
    detalle: 'Marzo es uno de los mejores meses del año para LinkedIn B2B en Chile. Los decisores retoman actividad post-verano.'
  },
  {
    nombre: 'TikTok Ads',
    logo: '⚫',
    tendencia: 'down',
    resumen: 'Incertidumbre regulatoria reduce inversión. Anunciantes moviendo presupuesto a Meta Reels.',
    dato: 'CPM +12%',
    color: 'gray',
    detalle: 'El CPM de TikTok subió al reducirse la competencia de anunciantes que salen de la plataforma, pero el inventario también cayó.'
  },
]

const tendenciasContenido = [
  {
    formato: 'Reel educativo 30-45 seg',
    plataforma: 'Instagram / Meta',
    engagement: '+34%',
    descripcion: 'Videos cortos con estructura "Problema → Dato → Solución" están superando al contenido de producto en engagement. El hook en los primeros 3 segundos es determinante.',
    ganador: true,
  },
  {
    formato: 'Carrusel con datos',
    plataforma: 'Instagram / LinkedIn',
    engagement: '+18%',
    descripcion: 'Carruseles con benchmarks, estadísticas o comparativas. El formato "dato en la primera slide" genera más saves y shares que cualquier otro tipo de carrusel.',
    ganador: true,
  },
  {
    formato: 'Post estático de producto',
    plataforma: 'Instagram',
    engagement: '−22%',
    descripcion: 'Los posts estáticos de producto sin contexto educativo o emocional siguen perdiendo alcance orgánico. El algoritmo prioriza tiempo de visualización.',
    ganador: false,
  },
  {
    formato: 'Stories con encuesta',
    plataforma: 'Instagram',
    engagement: '+9%',
    descripcion: 'Stories con stickers de encuesta o deslizador generan más interacción que Stories informativas. Método simple para aumentar la señal al algoritmo.',
    ganador: true,
  },
]

const noticias = [
  {
    plataforma: 'Meta',
    titulo: 'Meta lanza controles de frecuencia para Advantage+',
    resumen: 'Ahora puedes limitar cuántas veces ve tu anuncio un mismo usuario en campañas Advantage+. Antes era imposible. Reduce fatiga de audiencia.',
    impacto: 'Alto',
    color: 'blue'
  },
  {
    plataforma: 'Google',
    titulo: 'Google Ads permite excluir términos de marca en Performance Max',
    resumen: 'Uno de los pedidos más solicitados. Ya puedes evitar que PMax capture tráfico de tu propia marca y así aislar su performance real.',
    impacto: 'Alto',
    color: 'red'
  },
  {
    plataforma: 'LinkedIn',
    titulo: 'LinkedIn agrega segmentación por tamaño de empresa en Lead Gen',
    resumen: 'Nueva opción para filtrar audiencias por número de empleados de forma más granular (1-10, 11-50, 51-200, etc.).',
    impacto: 'Medio',
    color: 'indigo'
  },
]

const benchmarkSemana = {
  titulo: 'CPL promedio inmobiliaria Chile — Semana 10',
  valor: '$48.200',
  variacion: '-6%',
  tendencia: 'down_good',
  contexto: 'El CPL de inmobiliaria bajó 6% respecto a la semana anterior. El mercado post-verano está retomando actividad y la demanda de leads sube, pero la oferta publicitaria aún no alcanzó los niveles de noviembre.',
  recomendacion: 'Si estás en inmobiliaria, es buen momento para escalar inversión antes de que el CPC suba con la competencia de Q2.',
  fuente: 'Datos de campañas activas M&P — portfolio de clientes inmobiliaria Chile, semana del 3-9 marzo 2026'
}

const recomendacion = {
  titulo: 'La acción de esta semana',
  accion: 'Revisa la frecuencia de tus anuncios en Meta',
  detalle: 'Si tienes campañas corriendo más de 3 semanas sin rotar creativos, es probable que la frecuencia esté sobre 4x. Eso explica caídas de CTR y subidas de CPM. La solución no es más presupuesto — es creativos nuevos.',
  pasos: [
    'Entra a Meta Ads Manager → Informes → añade la columna "Frecuencia"',
    'Filtra campañas con frecuencia > 3.5 en los últimos 14 días',
    'Para esas campañas: duplica el conjunto de anuncios y carga 3 creativos nuevos',
    'Pausa los originales después de 72 horas si el nuevo conjunto performa igual o mejor',
  ]
}

export default function RadarSemanalPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src="/logo-color.png" alt="Muller y Pérez" className="h-9 w-auto" />
            </Link>
            <span className="text-gray-600">|</span>
            <span className="text-sm font-bold text-blue-400">Radar Semanal</span>
          </div>
          <Link href="/labs" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> M&P Labs
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
              Semana {semana.numero} · {semana.desde} – {semana.hasta}, {semana.año}
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
              Actualizado cada lunes
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold border border-orange-500/30">
              DEMO
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            Radar M&P <span className="text-blue-400">—</span> Inteligencia de marketing digital
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl">
            Lo que movió el mercado esta semana: plataformas, formatos, benchmarks reales y una recomendación accionable.
          </p>
        </div>

        {/* Pulso de plataformas */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5" /> Pulso de plataformas
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {plataformas.map((p, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.logo}</span>
                    <span className="font-bold text-white">{p.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      p.tendencia === 'up' ? 'text-green-400' :
                      p.tendencia === 'down' ? 'text-red-400' : 'text-yellow-400'
                    }`}>{p.dato}</span>
                    {p.tendencia === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                    {p.tendencia === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {p.tendencia === 'neutral' && <Minus className="w-4 h-4 text-yellow-400" />}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2">{p.resumen}</p>
                <p className="text-gray-500 text-xs">{p.detalle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benchmark de la semana */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" /> Benchmark de la semana
          </h2>
          <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="text-center md:text-left">
                <div className="text-6xl font-black text-white">{benchmarkSemana.valor}</div>
                <div className="text-green-400 font-bold text-lg mt-1">{benchmarkSemana.variacion} vs semana anterior</div>
                <div className="text-blue-300 font-semibold mt-1">{benchmarkSemana.titulo}</div>
              </div>
              <div className="flex-1 md:border-l md:border-blue-700/50 md:pl-8">
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{benchmarkSemana.contexto}</p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                  <p className="text-green-400 text-sm font-semibold">→ {benchmarkSemana.recomendacion}</p>
                </div>
                <p className="text-gray-600 text-xs mt-3">{benchmarkSemana.fuente}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tendencias de contenido */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Formatos que están ganando esta semana
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tendenciasContenido.map((t, i) => (
              <div key={i} className={`bg-gray-900 rounded-2xl p-5 border ${t.ganador ? 'border-green-800/50' : 'border-red-900/50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-bold text-white">{t.formato}</span>
                    <span className="text-gray-500 text-xs ml-2">{t.plataforma}</span>
                  </div>
                  <span className={`text-sm font-black px-2 py-1 rounded-lg ${
                    t.ganador ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>{t.engagement}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{t.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Noticias de plataformas */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Lo que cambiaron las plataformas esta semana
          </h2>
          <div className="space-y-4">
            {noticias.map((n, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex gap-4">
                <span className={`px-2 py-1 h-fit text-xs font-bold rounded-lg bg-${n.color}-500/20 text-${n.color}-400 whitespace-nowrap`}>
                  {n.plataforma}
                </span>
                <div>
                  <h3 className="font-bold text-white mb-1">{n.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{n.resumen}</p>
                  <span className={`text-xs font-bold mt-2 inline-block ${n.impacto === 'Alto' ? 'text-orange-400' : 'text-yellow-400'}`}>
                    Impacto: {n.impacto}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recomendación accionable */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> La acción de esta semana
          </h2>
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-8">
            <h3 className="text-2xl font-black text-white mb-2">{recomendacion.accion}</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{recomendacion.detalle}</p>
            <div className="space-y-3">
              {recomendacion.pasos.map((paso, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-gray-300 text-sm">{paso}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA suscripción */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <Bell className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Recibe el Radar cada lunes</h2>
          <p className="text-gray-400 mb-6">Directo a tu email. Sin spam. Solo lo que importa para tus campañas.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
              Suscribirme
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-3">Solo para clientes y contactos de M&P. Cancelar cuando quieras.</p>
        </section>

      </main>

      <footer className="border-t border-gray-800 py-8 px-6 text-center mt-12">
        <Link href="/">
          <img src="/logo-color.png" alt="Muller y Pérez" className="h-8 w-auto mx-auto mb-3 opacity-60" />
        </Link>
        <p className="text-gray-600 text-sm">© 2026 Muller y Pérez — Marketing & Performance</p>
      </footer>
    </div>
  )
}
