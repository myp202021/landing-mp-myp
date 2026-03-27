import { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'

export const metadata: Metadata = {
  title: 'Tecnología Propia para Marketing Digital | Muller y Pérez',
  description:
    'CRM propio, agentes de IA, predictor de campañas, monitor de competencia y dashboard para clientes. Desarrollo propio que conecta marketing con resultados comerciales.',
  keywords: [
    'tecnologia marketing digital chile',
    'crm agencia marketing',
    'predictor campañas google ads',
    'monitor competencia redes sociales',
    'agencia marketing tecnología propia',
  ],
  alternates: {
    canonical: 'https://www.mulleryperez.cl/tecnologia',
  },
  openGraph: {
    title: 'Tecnología Propia para Marketing Digital | Muller y Pérez',
    description:
      'CRM propio, agentes de IA, predictor de campañas, monitor de competencia. Desarrollo propio que conecta marketing con ventas reales.',
    url: 'https://www.mulleryperez.cl/tecnologia',
    siteName: 'Muller y Pérez',
    locale: 'es_CL',
    type: 'website',
  },
}

export default function TecnologiaPage() {
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Tecnología Propia para Marketing Digital | Muller y Pérez',
    description: 'CRM propio, agentes de IA, predictor de campañas, monitor de competencia y dashboard para clientes. Desarrollo propio que conecta marketing con resultados comerciales.',
    url: 'https://www.mulleryperez.cl/tecnologia',
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
      logo: 'https://www.mulleryperez.cl/logo-color.png',
    },
    datePublished: '2026-03-27',
    dateModified: '2026-03-27',
    mainEntityOfPage: 'https://www.mulleryperez.cl/tecnologia',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.mulleryperez.cl' },
      { '@type': 'ListItem', position: 2, name: 'Tecnología', item: 'https://www.mulleryperez.cl/tecnologia' },
    ],
  }

  const productsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Productos Tecnológicos de Muller y Pérez',
    description: 'Suite de herramientas propias para performance marketing: CRM, agentes IA, predictor de campañas, monitor de competencia.',
    numberOfItems: 6,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'CRM Propio', description: 'Sistema de gestión de leads con integración Zapier, semáforo de estado, métricas CPL/ROAS y exportación CSV/vCard.' },
      { '@type': 'ListItem', position: 2, name: 'Portal Cliente', description: 'Dashboard privado por UUID con analítica de leads, filtros por fecha y métricas de conversión en tiempo real.' },
      { '@type': 'ListItem', position: 3, name: 'Predictor de Campañas', description: 'Simulador de resultados basado en +1.200 keywords del mercado chileno, 22 industrias y tipo de cambio actualizado semanalmente.' },
      { '@type': 'ListItem', position: 4, name: 'Monitor de Competencia', description: 'Agente automatizado que monitorea Instagram, LinkedIn y Facebook de competidores y detecta ofertas laborales.' },
      { '@type': 'ListItem', position: 5, name: 'Termómetro Marketing Digital', description: 'Indicadores semanales de CPC y CPA por industria en Chile con datos reales de Google Ads y Meta Ads.' },
      { '@type': 'ListItem', position: 6, name: 'Cotizaciones Inteligentes', description: 'Propuestas comerciales con análisis competitivo, benchmarks de mercado y simulación de escenarios.' },
    ],
  }

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl',
    logo: 'https://www.mulleryperez.cl/logo-color.png',
    description: 'Agencia de performance marketing con tecnología propia. CRM, agentes IA, predictor de campañas y monitor de competencia. +40 empresas en +20 industrias en Chile.',
    areaServed: { '@type': 'Country', name: 'Chile' },
    knowsAbout: ['Performance Marketing', 'Google Ads', 'Meta Ads', 'CRM', 'Marketing Automation', 'Competitive Intelligence', 'SEO'],
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <SiteHeader />

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-slate-900 via-blue-950/40 to-slate-950">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Performance Marketing + Desarrollo Propio
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Marketing que se conecta
            <br />
            con <span className="text-blue-400">tu operación comercial.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Desarrollamos tecnología propia, nos conectamos a tu CRM y ERP, y vinculamos cada peso invertido en marketing con resultados comerciales reales.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {['CRM propio', 'Agentes IA', 'Predictor de campañas', 'Monitor competencia', 'Integración CRM/ERP', 'Dashboard clientes', 'SEO automatizado', 'Cotizaciones con datos'].map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            {[
              { n: '+40', l: 'Empresas activas' },
              { n: '+20', l: 'Industrias' },
              { n: '6', l: 'Productos propios' },
              { n: '40h', l: 'Semana laboral' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-5xl md:text-6xl font-black text-blue-400">{s.n}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRM */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Producto 01 — CRM Propio</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Tu equipo comercial ve <span className="text-blue-400">cada lead en tiempo real</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
              Desarrollamos un CRM completo que conecta directamente con tus campañas. Cada lead tiene nombre, fuente, campaña, estado y seguimiento. Sin Excel. Sin esperar reportes.
            </p>
          </div>

          {/* Mockup CRM */}
          <div className="rounded-2xl border border-white/10 bg-[#111119] shadow-2xl shadow-black/50 overflow-hidden">
            <div className="h-10 bg-[#1a1a26] flex items-center px-4 gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs text-slate-500 font-mono">mulleryperez.cl/crm</span>
            </div>
            <div className="p-6 md:p-8">
              {/* Tabs */}
              <div className="flex gap-0 border-b border-white/5 mb-6">
                {['Dashboard', 'Leads', 'Clientes', 'Cotizaciones', 'Competencia'].map((tab, i) => (
                  <div key={tab} className={`px-5 py-3 text-sm font-bold uppercase tracking-wide ${i === 0 ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600'}`}>{tab}</div>
                ))}
              </div>
              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { v: '147', k: 'Leads este mes', c: 'text-blue-400' },
                  { v: '68%', k: 'Tasa de contacto', c: 'text-emerald-400' },
                  { v: '$7.337', k: 'CPL promedio', c: 'text-amber-400' },
                  { v: '4.2x', k: 'ROAS', c: 'text-white' },
                ].map(m => (
                  <div key={m.k} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
                    <div className={`text-3xl font-black ${m.c}`}>{m.v}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{m.k}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                {/* Chart */}
                <div className="bg-white/[0.02] rounded-xl p-5">
                  <div className="text-xs font-bold text-slate-500 mb-4">LEADS POR FUENTE</div>
                  {[
                    { name: 'Meta Ads', w: '60%', n: 81, color: 'bg-blue-500' },
                    { name: 'Google Ads', w: '35%', n: 44, color: 'bg-sky-400' },
                    { name: 'Orgánico', w: '14%', n: 15, color: 'bg-emerald-400' },
                    { name: 'Directo', w: '6%', n: 7, color: 'bg-amber-400' },
                  ].map(s => (
                    <div key={s.name} className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <div className={`${s.color} h-5 rounded`} style={{ width: s.w }} />
                      </div>
                      <span className="text-xs text-slate-500 w-28 shrink-0">{s.name} — {s.n}</span>
                    </div>
                  ))}

                  <div className="text-xs font-bold text-slate-500 mt-6 mb-3">LEADS POR DÍA</div>
                  <div className="flex items-end gap-1 h-16">
                    {[45, 60, 85, 40, 70, 95, 55, 35, 65, 80, 50, 30, 75, 100].map((h, i) => (
                      <div key={i} className={`flex-1 rounded-t bg-blue-500 ${h >= 80 ? 'opacity-100' : 'opacity-40'}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 14 }, (_, i) => (
                      <span key={i} className="flex-1 text-center text-[7px] text-slate-600">{14 + i}</span>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-3">ÚLTIMOS LEADS</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[10px] text-blue-400 uppercase tracking-wider">
                          <th className="pb-3 pr-4">Estado</th>
                          <th className="pb-3 pr-4">Nombre</th>
                          <th className="pb-3 pr-4">Fuente</th>
                          <th className="pb-3 pr-4">Campaña</th>
                          <th className="pb-3 pr-4">Teléfono</th>
                          <th className="pb-3">Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-400">
                        {[
                          { st: 'Nuevo', color: 'bg-blue-500', name: 'María González', src: 'Meta Ads', camp: 'Leads Marzo', tel: '+56 9 8xxx', date: '27/03' },
                          { st: 'Contactado', color: 'bg-amber-500', name: 'Roberto Muñoz', src: 'Google Ads', camp: 'Search Marca', tel: '+56 9 7xxx', date: '27/03' },
                          { st: 'Vendido', color: 'bg-emerald-500', name: 'Carolina Díaz', src: 'Meta Ads', camp: 'Leads Marzo', tel: '+56 9 6xxx', date: '26/03' },
                          { st: 'Nuevo', color: 'bg-blue-500', name: 'Andrés Soto', src: 'Orgánico', camp: '—', tel: '+56 9 5xxx', date: '26/03' },
                          { st: 'Contactado', color: 'bg-amber-500', name: 'Fernanda López', src: 'Meta Ads', camp: 'Retargeting', tel: '+56 9 4xxx', date: '25/03' },
                          { st: 'Vendido', color: 'bg-emerald-500', name: 'Juan Pérez', src: 'Google Ads', camp: 'Search Marca', tel: '+56 9 3xxx', date: '25/03' },
                          { st: 'Perdido', color: 'bg-red-500', name: 'Camila Reyes', src: 'Meta Ads', camp: 'Leads Marzo', tel: '+56 9 2xxx', date: '24/03' },
                        ].map((r, i) => (
                          <tr key={i} className="border-b border-white/[0.03] hover:bg-blue-500/[0.03]">
                            <td className="py-3 pr-4"><span className={`inline-block w-2 h-2 rounded-full ${r.color} mr-2`} />{r.st}</td>
                            <td className="py-3 pr-4 text-white font-medium">{r.name}</td>
                            <td className="py-3 pr-4">{r.src}</td>
                            <td className="py-3 pr-4">{r.camp}</td>
                            <td className="py-3 pr-4 font-mono text-xs">{r.tel}</td>
                            <td className="py-3">{r.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold">Exportar CSV</span>
                    <span className="px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold">Exportar vCard</span>
                    <span className="px-3 py-1.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold">+ Agregar lead</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Integración <span className="text-blue-400">Zapier</span></h3>
              <p className="text-sm text-slate-400 leading-relaxed">Leads de Facebook Lead Ads llegan automáticamente al CRM en tiempo real. Sin carga manual.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Notificación <span className="text-blue-400">instantánea</span></h3>
              <p className="text-sm text-slate-400 leading-relaxed">Email al equipo M&P + copia al cliente cada vez que un lead nuevo ingresa al sistema.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Conexión <span className="text-blue-400">CRM/ERP</span></h3>
              <p className="text-sm text-slate-400 leading-relaxed">Nos conectamos a tu sistema comercial existente para vincular marketing con ventas reales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD CLIENTE */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Producto 02 — Portal Cliente</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Tu cliente ve <span className="text-blue-400">sus datos sin pedirte nada</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
              Cada cliente tiene un portal privado con acceso directo a sus leads, métricas y analítica. Sin intermediarios, sin esperar reportes.
            </p>
          </div>

          {/* Mockup Dashboard */}
          <div className="rounded-2xl border border-white/10 bg-[#111119] shadow-2xl shadow-black/50 overflow-hidden">
            <div className="h-10 bg-[#1a1a26] flex items-center px-4 gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs text-slate-500 font-mono">mulleryperez.cl/cliente/a3f8-c2d1-...</span>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex gap-0 border-b border-white/5 mb-6">
                {['Dashboard', 'Cotizaciones', 'Analítica', 'ChatBot'].map((tab, i) => (
                  <div key={tab} className={`px-5 py-3 text-sm font-bold uppercase tracking-wide ${i === 0 ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-600'}`}>{tab}</div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="text-xl font-black">Panel de Arturo Vargas</div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold">7 días</span>
                  <span className="px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold">30 días</span>
                  <span className="px-3 py-1.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold">Personalizado</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { v: '29', k: 'Leads totales', c: 'text-blue-400' },
                  { v: '21', k: 'Contactados', c: 'text-emerald-400' },
                  { v: '$8.241', k: 'Costo por lead', c: 'text-amber-400' },
                  { v: '8', k: 'Ventas cerradas', c: 'text-white' },
                ].map(m => (
                  <div key={m.k} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
                    <div className={`text-3xl font-black ${m.c}`}>{m.v}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{m.k}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-[1.2fr_1fr] gap-6">
                <div className="bg-white/[0.02] rounded-xl p-5">
                  <div className="text-xs font-bold text-slate-500 mb-4">LEADS POR SEMANA — ÚLTIMOS 30 DÍAS</div>
                  <div className="flex items-end gap-4 h-24">
                    {[
                      { h: '50%', n: 5, label: 'Sem 1' },
                      { h: '70%', n: 7, label: 'Sem 2' },
                      { h: '80%', n: 8, label: 'Sem 3' },
                      { h: '100%', n: 9, label: 'Sem 4' },
                    ].map(w => (
                      <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-md bg-gradient-to-t from-blue-600/40 to-blue-400" style={{ height: w.h }} />
                        <span className="text-[10px] text-slate-500">{w.label}</span>
                        <span className="text-xs text-slate-400 font-bold">{w.n} leads</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500 mb-3">DETALLE DE LEADS</div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] text-blue-400 uppercase tracking-wider">
                        <th className="pb-2" />
                        <th className="pb-2">Nombre</th>
                        <th className="pb-2">Fuente</th>
                        <th className="pb-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-400">
                      {[
                        { name: 'P. Sánchez', src: 'Meta', st: 'Vendido', color: 'bg-emerald-500', tc: 'text-emerald-400' },
                        { name: 'L. Torres', src: 'Google', st: 'Contactado', color: 'bg-amber-500', tc: 'text-amber-400' },
                        { name: 'R. Morales', src: 'Meta', st: 'Nuevo', color: 'bg-blue-500', tc: 'text-blue-400' },
                        { name: 'C. Herrera', src: 'Meta', st: 'Vendido', color: 'bg-emerald-500', tc: 'text-emerald-400' },
                        { name: 'M. Ríos', src: 'Orgánico', st: 'Contactado', color: 'bg-amber-500', tc: 'text-amber-400' },
                      ].map((r, i) => (
                        <tr key={i} className="border-b border-white/[0.03]">
                          <td className="py-2.5"><span className={`inline-block w-2 h-2 rounded-full ${r.color}`} /></td>
                          <td className="py-2.5 text-white font-medium">{r.name}</td>
                          <td className="py-2.5">{r.src}</td>
                          <td className={`py-2.5 font-bold ${r.tc}`}>{r.st}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Acceso por <span className="text-blue-400">UUID privado</span></h3>
              <p className="text-sm text-slate-400 leading-relaxed">Cada cliente tiene una URL única e intransferible. Sin contraseñas compartidas. Acceso directo desde cualquier dispositivo.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Marketing → <span className="text-blue-400">Venta real</span></h3>
              <p className="text-sm text-slate-400 leading-relaxed">El cliente ve qué campaña generó cada lead, cuánto costó y si se cerró la venta. El loop completo: inversión → resultado comercial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PREDICTOR + INDICADORES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Producto 03 — Predictor de Campañas + Indicadores</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Simulamos resultados <span className="text-blue-400">antes de gastar un peso</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
              +1.200 keywords reales, 22 industrias, tipo de cambio actualizado semanalmente. El cliente decide con números, no con promesas.
            </p>
          </div>

          {/* Mockup Indicadores */}
          <div className="rounded-2xl border border-white/10 bg-[#111119] shadow-2xl shadow-black/50 overflow-hidden">
            <div className="h-10 bg-[#1a1a26] flex items-center px-4 gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs text-slate-500 font-mono">mulleryperez.cl/indicadores</span>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xl font-black">Termómetro Marketing Digital Chile — Semana 13, 2026</div>
                <span className="px-3 py-1.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold">Actualizado 22/03</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
                  <div className="text-3xl font-black text-white">$935</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">USD/CLP</div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
                  <div className="text-3xl font-black text-white">$38.726</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">UF/CLP</div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center">
                  <div className="text-2xl font-black text-red-400">▼ -0.8%</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Var. USD semana</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] text-blue-400 uppercase tracking-wider border-b border-blue-500/10">
                      <th className="pb-3 pr-6">Industria</th>
                      <th className="pb-3 pr-6">CPC Google</th>
                      <th className="pb-3 pr-6">CPC Meta</th>
                      <th className="pb-3 pr-6">CVR</th>
                      <th className="pb-3 pr-6">CPA Google</th>
                      <th className="pb-3 pr-6">CPA Meta</th>
                      <th className="pb-3">Tendencia</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    {[
                      { ind: 'E-commerce', cg: '$248', cm: '$149', cvr: '3.2%', cpag: '$7.750', cpam: '$4.656', t: '▲', tc: 'text-emerald-400' },
                      { ind: 'Educación', cg: '$310', cm: '$186', cvr: '2.8%', cpag: '$11.071', cpam: '$6.643', t: '→', tc: 'text-amber-400' },
                      { ind: 'SaaS B2B', cg: '$380', cm: '$228', cvr: '2.1%', cpag: '$18.095', cpam: '$10.857', t: '▼', tc: 'text-red-400' },
                      { ind: 'Inmobiliaria', cg: '$420', cm: '$252', cvr: '1.8%', cpag: '$23.333', cpam: '$14.000', t: '▲', tc: 'text-emerald-400' },
                      { ind: 'Salud', cg: '$290', cm: '$174', cvr: '3.5%', cpag: '$8.286', cpam: '$4.971', t: '▲', tc: 'text-emerald-400' },
                      { ind: 'Automotriz', cg: '$248', cm: '$149', cvr: '2.4%', cpag: '$10.333', cpam: '$6.208', t: '→', tc: 'text-amber-400' },
                      { ind: 'Legal', cg: '$420', cm: '$252', cvr: '2.0%', cpag: '$21.000', cpam: '$12.600', t: '▼', tc: 'text-red-400' },
                      { ind: 'Construcción', cg: '$350', cm: '$210', cvr: '1.6%', cpag: '$21.875', cpam: '$13.125', t: '→', tc: 'text-amber-400' },
                    ].map(r => (
                      <tr key={r.ind} className="border-b border-white/[0.03] hover:bg-blue-500/[0.03]">
                        <td className="py-3 pr-6 text-white font-bold">{r.ind}</td>
                        <td className="py-3 pr-6">{r.cg}</td>
                        <td className="py-3 pr-6">{r.cm}</td>
                        <td className="py-3 pr-6">{r.cvr}</td>
                        <td className="py-3 pr-6">{r.cpag}</td>
                        <td className="py-3 pr-6">{r.cpam}</td>
                        <td className={`py-3 font-bold text-lg ${r.tc}`}>{r.t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-[10px] text-slate-600 mt-4">22 industrias disponibles · CPC ponderado por volumen de búsqueda · 1.200+ keywords Chile · CVR: predictor M&P · Actualización semanal</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2"><span className="text-blue-400">1.200+</span> keywords reales</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Cada CPC está calibrado con keywords reales del mercado chileno, ponderados por volumen de búsqueda. Fuente: Ubersuggest + procesamiento propio.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Público y <span className="text-blue-400">gratuito</span></h3>
              <p className="text-sm text-slate-400 leading-relaxed">El termómetro está publicado en mulleryperez.cl/indicadores. Porque la transparencia construye confianza.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MONITOR COMPETENCIA */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Producto 04 — Monitor de Competencia</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Tu competencia publicó algo ayer.
              <br /><span className="text-blue-400">Nosotros ya lo sabemos.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
              Un agente automatizado recorre Instagram, LinkedIn y Facebook de tus competidores cada mañana y envía un informe PDF antes de las 9 AM.
            </p>
          </div>

          {/* Mockup Reporte */}
          <div className="rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/50 overflow-hidden">
            <div className="h-10 bg-[#1a1a26] flex items-center px-4 gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs text-slate-500 font-mono">Informe_Competencia_27-03-2026.pdf</span>
            </div>
            <div className="p-6 md:p-8 text-slate-800">
              <div className="flex justify-between items-center border-b-2 border-blue-600 pb-3 mb-6">
                <div className="text-xl font-black text-blue-700">Radar de Competencia — 27 Marzo 2026</div>
                <div className="text-xs text-slate-400">Generado automáticamente a las 08:50 AM</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { v: '24', k: 'Cuentas monitoreadas', bg: 'bg-blue-50', c: 'text-blue-700' },
                  { v: '17', k: 'Publicaciones nuevas', bg: 'bg-emerald-50', c: 'text-emerald-700' },
                  { v: '3', k: 'Ofertas laborales', bg: 'bg-amber-50', c: 'text-amber-700' },
                  { v: '2', k: 'Alertas', bg: 'bg-red-50', c: 'text-red-700' },
                ].map(m => (
                  <div key={m.k} className={`${m.bg} rounded-xl p-4 text-center`}>
                    <div className={`text-3xl font-black ${m.c}`}>{m.v}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{m.k}</div>
                  </div>
                ))}
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-700 text-white text-left text-xs">
                    <th className="py-2.5 px-4">Competidor</th>
                    <th className="py-2.5 px-4 text-center">IG</th>
                    <th className="py-2.5 px-4 text-center">LI</th>
                    <th className="py-2.5 px-4 text-center">FB</th>
                    <th className="py-2.5 px-4">Tipo contenido</th>
                    <th className="py-2.5 px-4">Oferta laboral</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: 'Competidor A', ig: 2, li: 1, fb: '—', tipo: 'Producto, testimonio', oferta: '' },
                    { n: 'Competidor B', ig: 3, li: '—', fb: 1, tipo: 'Promoción, evento', oferta: '⚠ Conductor' },
                    { n: 'Competidor C', ig: 1, li: 2, fb: 1, tipo: 'Noticia, RSE', oferta: '⚠ Operador' },
                    { n: 'Competidor D', ig: '—', li: 1, fb: 2, tipo: 'Flota nueva, servicio', oferta: '' },
                    { n: 'Competidor E', ig: 1, li: '—', fb: '—', tipo: 'Corporativo', oferta: '⚠ Jefe RRHH' },
                  ].map((r, i) => (
                    <tr key={i} className={`border-b border-slate-200 ${i % 2 ? 'bg-slate-50' : ''}`}>
                      <td className="py-2.5 px-4 font-bold">{r.n}</td>
                      <td className="py-2.5 px-4 text-center">{r.ig}</td>
                      <td className="py-2.5 px-4 text-center">{r.li}</td>
                      <td className="py-2.5 px-4 text-center">{r.fb}</td>
                      <td className="py-2.5 px-4 text-slate-600">{r.tipo}</td>
                      <td className="py-2.5 px-4 text-amber-600 font-bold">{r.oferta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[10px] text-slate-400 mt-3">Fuentes: Instagram, LinkedIn, Facebook · Detección ofertas: 50+ keywords · Ventana: últimas 24h</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">3 redes <span className="text-blue-400">simultáneas</span></h3>
              <p className="text-sm text-slate-400 leading-relaxed">Instagram, LinkedIn y Facebook. Hasta 24 cuentas por cliente. Corre automáticamente de lunes a viernes.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Detecta <span className="text-blue-400">ofertas laborales</span></h3>
              <p className="text-sm text-slate-400 leading-relaxed">Si tu competidor está buscando gente, lo sabes antes que el mercado. 50+ keywords de detección.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">PDF en tu <span className="text-blue-400">correo</span></h3>
              <p className="text-sm text-slate-400 leading-relaxed">Informe generado y enviado automáticamente. Sin login, sin plataformas. Abres el correo y listo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANES + CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Planes</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Fee fijo. Pauta directa. <span className="text-blue-400">Sin letra chica.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              El cliente paga la pauta directo a Google y Meta. Nuestro incentivo es que te vaya bien, no que gastes más.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { name: 'Silver', price: '$950.000', color: 'border-slate-500/30', tc: 'text-slate-400', desc: 'Empresa que parte de cero. Instalar medición, primeras campañas, validar mercado.' },
              { name: 'Gold', price: '$1.350.000', color: 'border-amber-500/30', tc: 'text-amber-400', desc: 'Escalar campañas. Multicanal, remarketing, contenido, monitor de competencia.' },
              { name: 'Platinum', price: '$2.200.000', color: 'border-blue-500/30', tc: 'text-blue-400', desc: 'Operación completa: SEO + Paid + Social + CRM + Monitor + Dashboard dedicado.' },
            ].map(p => (
              <div key={p.name} className={`bg-white/[0.03] border ${p.color} rounded-2xl p-8`}>
                <div className={`text-lg font-bold ${p.tc}`}>{p.name}</div>
                <div className="text-4xl font-black text-white mt-2">{p.price}</div>
                <div className="text-xs text-slate-500 mt-1">+ IVA / mes</div>
                <p className="text-sm text-slate-400 mt-4 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500 mb-6">3 profesionales dedicados por cliente: Paid Media Planner + Publicista + Diseñador</p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['Transporte', 'HR Tech', 'Educación Superior', 'E-commerce', 'Construcción', 'SaaS B2B', 'Inmobiliaria', 'Consultoría RRHH', 'Iluminación', 'Repuestos', 'Reciclaje Industrial', 'Eventos', 'Retail Tech', 'Minería', 'Salud', 'ERP', 'Fitness', 'Manufactura', 'Legal', 'Casas Prefabricadas'].map(ind => (
                <span key={ind} className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">{ind}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Desarrollo propio. Datos reales.
            <br />Marketing conectado con <span className="text-blue-400">tu operación comercial.</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Si tu agencia actual no puede decirte cuánto te costó cada cliente, de dónde vino y qué campaña lo generó — hablemos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#contacto" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all text-lg">
              Agendar Reunión
            </Link>
            <Link href="/#planes" className="px-8 py-4 border-2 border-blue-500/30 text-blue-400 font-bold rounded-xl hover:bg-blue-500/10 transition-all text-lg">
              Ver Planes
            </Link>
          </div>
          <div className="flex justify-center gap-12 mt-16 text-sm text-slate-500">
            <div><span className="block text-[10px] uppercase tracking-widest text-slate-600 mb-1">Web</span>mulleryperez.cl</div>
            <div><span className="block text-[10px] uppercase tracking-widest text-slate-600 mb-1">Email</span>contacto@mulleryperez.cl</div>
            <div><span className="block text-[10px] uppercase tracking-widest text-slate-600 mb-1">WhatsApp</span>+56 9 5419 7432</div>
          </div>
        </div>
      </section>
    </div>
  )
}