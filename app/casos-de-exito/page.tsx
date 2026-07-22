import { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'

export const metadata: Metadata = {
  title: 'Casos de Éxito Marketing Digital Chile 2026 | Muller y Pérez',
  description:
    'Resultados reales de clientes de Muller y Pérez. 5 casos de éxito: CPL -65%, CPA -95%, SEO #1, dashboards en tiempo real y automatización IA. Casos verificables.',
  keywords: [
    'casos de exito marketing digital chile',
    'resultados agencia marketing',
    'ROAS',
    'CPL',
  ],
  alternates: {
    canonical: 'https://www.mulleryperez.cl/casos-de-exito',
  },
  openGraph: {
    title: 'Casos de Éxito Marketing Digital Chile 2026 | Muller y Pérez',
    description:
      'Resultados reales de clientes de Muller y Pérez. 5 casos de éxito: CPL -65%, CPA -95%, SEO #1, dashboards en tiempo real y automatización IA.',
    url: 'https://www.mulleryperez.cl/casos-de-exito',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    type: 'website',
  },
}

export default function CasosDeExitoPage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Casos de Éxito Marketing Digital Chile 2026',
    description:
      'Resultados reales de clientes de Muller y Pérez. CPL reducido 65%, CPA reducido 95%. Casos verificables en Google Ads y Meta Ads.',
    author: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
    },
    datePublished: '2026-03-19',
    dateModified: '2026-03-19',
    mainEntityOfPage: 'https://www.mulleryperez.cl/casos-de-exito',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://www.mulleryperez.cl',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Casos de Éxito',
        item: 'https://www.mulleryperez.cl/casos-de-exito',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <SiteHeader />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">
            Resultados Verificables
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Casos de Éxito{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Marketing Digital Chile 2026
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-200/80 max-w-3xl mx-auto mb-8">
            5 casos reales: pauta digital, SEO, dashboards y automatización IA.
            Datos extraídos directamente de las plataformas. Sin maquillaje.
          </p>
          <p className="text-sm text-blue-300/50 max-w-2xl mx-auto italic">
            Por confidencialidad no compartimos nombres, pero los datos son verificables
            en las plataformas de cada cliente.
          </p>
        </div>
      </section>

      {/* Case Study 1 — Software B2B */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-slate-700/50 px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">
                    Cliente A
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Software B2B
                  </h2>
                  <p className="text-blue-200/60 text-sm mt-1">
                    Control de asistencia, accesos y firma electrónica
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-blue-300/60">Duración</p>
                    <p className="text-white font-bold">15 meses</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-blue-300/60">Pauta/mes</p>
                    <p className="text-white font-bold">$8.5M</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-700/30">
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-green-400 mb-1">
                  -65%
                </p>
                <p className="text-blue-200/60 text-sm">CPL Meta Ads</p>
                <p className="text-white/40 text-xs mt-1">$21.048 → $7.337</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-white mb-1">
                  374
                </p>
                <p className="text-blue-200/60 text-sm">Leads/mes actuales</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-white mb-1">
                  10
                </p>
                <p className="text-blue-200/60 text-sm">Campañas activas</p>
                <p className="text-white/40 text-xs mt-1">5 Google + 5 Meta</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-blue-400 mb-1">
                  10.85%
                </p>
                <p className="text-blue-200/60 text-sm">Mejor CVR</p>
                <p className="text-white/40 text-xs mt-1">Meta &quot;Leads Oferta&quot;</p>
              </div>
            </div>

            {/* Detail */}
            <div className="px-8 py-8 space-y-6">
              <h3 className="text-lg font-semibold text-white">Campañas destacadas</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-blue-400 text-sm font-semibold">Meta Ads</p>
                  </div>
                  <p className="text-white font-bold mb-1">&quot;Leads Oferta&quot;</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/60">CVR</span>
                    <span className="text-green-400 font-bold">10.85%</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-blue-200/60">CPL</span>
                    <span className="text-white font-bold">$5.335</span>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <p className="text-red-400 text-sm font-semibold">Google Ads</p>
                  </div>
                  <p className="text-white font-bold mb-1">PMAX Remarketing</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/60">CPL</span>
                    <span className="text-white font-bold">$6.459</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study 2 — Iluminación Industrial */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-slate-700/50 px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-1">
                    Cliente B
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Iluminación Industrial
                  </h2>
                  <p className="text-amber-200/60 text-sm mt-1">
                    LED, paneles, proyectores — B2B + B2C
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-amber-300/60">Duración</p>
                    <p className="text-white font-bold">15 meses</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-amber-300/60">Pauta/mes</p>
                    <p className="text-white font-bold">$4M</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-700/30">
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-green-400 mb-1">
                  -95%
                </p>
                <p className="text-amber-200/60 text-sm">CPA</p>
                <p className="text-white/40 text-xs mt-1">$17.100 → $826</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-white mb-1">
                  327
                </p>
                <p className="text-amber-200/60 text-sm">Conversiones/mes</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-white mb-1">
                  14
                </p>
                <p className="text-amber-200/60 text-sm">Campañas activas</p>
                <p className="text-white/40 text-xs mt-1">7 Google + 7 Meta</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-amber-400 mb-1">
                  56.79%
                </p>
                <p className="text-amber-200/60 text-sm">Mejor CVR</p>
                <p className="text-white/40 text-xs mt-1">Meta POST orgánico</p>
              </div>
            </div>

            {/* Detail */}
            <div className="px-8 py-8 space-y-6">
              <h3 className="text-lg font-semibold text-white">Campañas destacadas</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-blue-400 text-sm font-semibold">Meta Ads</p>
                  </div>
                  <p className="text-white font-bold mb-1">&quot;POST orgánico boost&quot;</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-200/60">CVR</span>
                    <span className="text-green-400 font-bold">56.79%</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-amber-200/60">CPA</span>
                    <span className="text-white font-bold">$419</span>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <p className="text-red-400 text-sm font-semibold">Google Ads</p>
                  </div>
                  <p className="text-white font-bold mb-1">Posición en búsqueda</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-200/60">Above the fold</span>
                    <span className="text-white font-bold">81.44%</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-amber-200/60">Primera posición</span>
                    <span className="text-white font-bold">36.25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study 3 — WMS para Latinoamérica */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-b border-slate-700/50 px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">
                    Cliente C
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    WMS para Latinoamérica
                  </h2>
                  <p className="text-emerald-200/60 text-sm mt-1">
                    Software logístico — WMS para almacenes y centros de distribución
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-emerald-300/60">Duración</p>
                    <p className="text-white font-bold">8 meses</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-emerald-300/60">Tipo</p>
                    <p className="text-white font-bold">SEO + Blog IA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-700/30">
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-emerald-400 mb-1">
                  113
                </p>
                <p className="text-emerald-200/60 text-sm">Posts por agente IA</p>
                <p className="text-white/40 text-xs mt-1">Daily automated</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-green-400 mb-1">
                  #1
                </p>
                <p className="text-emerald-200/60 text-sm">Posición Google</p>
                <p className="text-white/40 text-xs mt-1">&quot;mejor WMS Chile 2026&quot;</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-white mb-1">
                  4
                </p>
                <p className="text-emerald-200/60 text-sm">Schemas JSON-LD</p>
                <p className="text-white/40 text-xs mt-1">Org, Software, FAQ, Web</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-white mb-1">
                  7
                </p>
                <p className="text-emerald-200/60 text-sm">Snippets SEO</p>
                <p className="text-white/40 text-xs mt-1">Personalizados</p>
              </div>
            </div>

            {/* Detail */}
            <div className="px-8 py-8 space-y-6">
              <h3 className="text-lg font-semibold text-white">Resultados destacados</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-emerald-400 text-sm font-semibold">SEO / Agentes IA</p>
                  </div>
                  <p className="text-white font-bold mb-1">Blog diario automatizado</p>
                  <p className="text-emerald-200/60 text-sm">
                    Blog automatizado L-V 7AM + ranking semanal con imagen. 113 artículos publicados sin intervención manual.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-green-400 text-sm font-semibold">Posicionamiento IA</p>
                  </div>
                  <p className="text-white font-bold mb-1">#1 en Google y motores IA</p>
                  <p className="text-emerald-200/60 text-sm">
                    #1 en &quot;mejor WMS Chile 2026&quot;, &quot;WMS para retail omnicanal&quot;, &quot;WMS para 3PL Chile&quot; en Google y motores de IA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study 4 — Inmobiliaria Sector Oriente */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-slate-700/50 px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-violet-400 text-sm font-bold uppercase tracking-wider mb-1">
                    Cliente D
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Inmobiliaria Sector Oriente
                  </h2>
                  <p className="text-violet-200/60 text-sm mt-1">
                    Corredora de propiedades — leads por zona/comuna en Santiago
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-violet-300/60">Duración</p>
                    <p className="text-white font-bold">3 meses</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-violet-300/60">Tipo</p>
                    <p className="text-white font-bold">Meta Ads + Auto</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-700/30">
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-violet-400 mb-1">
                  6
                </p>
                <p className="text-violet-200/60 text-sm">Comunas segmentadas</p>
                <p className="text-white/40 text-xs mt-1">Las Condes, Vitacura, +4</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-green-400 mb-1">
                  95%
                </p>
                <p className="text-violet-200/60 text-sm">Leads incrementales</p>
                <p className="text-white/40 text-xs mt-1">Solo 5% duplicados</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-white mb-1">
                  24h
                </p>
                <p className="text-violet-200/60 text-sm">Fiscalización auto</p>
                <p className="text-white/40 text-xs mt-1">WhatsApp post-lead</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-purple-400 mb-1">
                  Real-time
                </p>
                <p className="text-violet-200/60 text-sm">Dashboard por zona</p>
                <p className="text-white/40 text-xs mt-1">Inversión vs leads</p>
              </div>
            </div>

            {/* Detail */}
            <div className="px-8 py-8 space-y-6">
              <h3 className="text-lg font-semibold text-white">Resultados destacados</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <p className="text-violet-400 text-sm font-semibold">Dashboard por comuna</p>
                  </div>
                  <p className="text-white font-bold mb-1">Inversión y leads en tiempo real</p>
                  <p className="text-violet-200/60 text-sm">
                    Panel conectado a Google Sheets con data consolidada de Meta Ads. Inversión y leads por zona geográfica en tiempo real.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <p className="text-purple-400 text-sm font-semibold">Fiscalización WhatsApp</p>
                  </div>
                  <p className="text-white font-bold mb-1">Seguimiento automático 24h</p>
                  <p className="text-violet-200/60 text-sm">
                    24 horas después de cada lead, mensaje automático al corredor preguntando si contactó. Twilio API + cron L-V 9-17h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study 5 — Legal — Recuperación de Propiedades */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600/20 to-teal-600/20 border-b border-slate-700/50 px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-1">
                    Cliente E
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Legal — Recuperación de Propiedades
                  </h2>
                  <p className="text-cyan-200/60 text-sm mt-1">
                    Legal — servicio de recuperación de pie de propiedad
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-cyan-300/60">Duración</p>
                    <p className="text-white font-bold">5 meses</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                    <p className="text-cyan-300/60">Tipo</p>
                    <p className="text-white font-bold">Dashboard + SEO</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-700/30">
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-cyan-400 mb-1">
                  22
                </p>
                <p className="text-cyan-200/60 text-sm">Stages del embudo</p>
                <p className="text-white/40 text-xs mt-1">Data real de 1000+ contactos</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-green-400 mb-1">
                  CAC real
                </p>
                <p className="text-cyan-200/60 text-sm">Unit economics</p>
                <p className="text-white/40 text-xs mt-1">Costo por carta enviada</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-white mb-1">
                  9
                </p>
                <p className="text-cyan-200/60 text-sm">Posts SEO publicados</p>
                <p className="text-white/40 text-xs mt-1">Desde cero + schemas</p>
              </div>
              <div className="bg-slate-900 p-6 md:p-8 text-center">
                <p className="text-4xl md:text-5xl font-black text-teal-400 mb-1">
                  Embudo
                </p>
                <p className="text-cyan-200/60 text-sm">Funnel 5 pasos visual</p>
                <p className="text-white/40 text-xs mt-1">Perfilamiento por caso</p>
              </div>
            </div>

            {/* Detail */}
            <div className="px-8 py-8 space-y-6">
              <h3 className="text-lg font-semibold text-white">Resultados destacados</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <p className="text-cyan-400 text-sm font-semibold">Dashboard embudo real</p>
                  </div>
                  <p className="text-white font-bold mb-1">22 stages inferidos de data CRM</p>
                  <p className="text-cyan-200/60 text-sm">
                    Conversión = confección de carta (no el lead). CAC calculado sobre la métrica que importa al negocio.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                    <p className="text-teal-400 text-sm font-semibold">Blog SEO desde cero</p>
                  </div>
                  <p className="text-white font-bold mb-1">Sitio sin contenido → 9 artículos</p>
                  <p className="text-cyan-200/60 text-sm">
                    Schemas Organization + FAQPage + GSC verificado. Blog diario automatizado configurado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Metodología que genera resultados
            </h2>
            <p className="text-blue-200/60 text-lg">
              El mismo proceso aplicado en los 5 casos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 text-center">
              <div className="w-14 h-14 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Testear</h3>
              <p className="text-blue-200/60 text-sm">
                Múltiples campañas, audiencias y creatividades en paralelo.
                Datos reales en 15-30 días.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 text-center">
              <div className="w-14 h-14 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-green-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Optimizar</h3>
              <p className="text-blue-200/60 text-sm">
                Pausar lo que no funciona, escalar lo que sí.
                Optimización diaria basada en datos.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 text-center">
              <div className="w-14 h-14 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-amber-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Escalar</h3>
              <p className="text-blue-200/60 text-sm">
                Aumentar presupuesto en las campañas ganadoras.
                Crecimiento predecible y sostenible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Quieres resultados como estos?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Agenda una reunión estratégica gratuita. Te mostramos oportunidades concretas
              para reducir tu CPL/CPA y escalar tus resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contacto"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg text-lg"
              >
                Agendar Reunión Gratis
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold"
              >
                Ver Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
