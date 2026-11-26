import { notFound, redirect } from 'next/navigation'
import { LayoutDashboard, ExternalLink, Activity, Bot, CalendarDays, FileText, Gauge, Globe2, ListChecks, MousePointerClick, Search, Sparkles, Target, TrendingUp, Wrench, Eye, Newspaper, Layers } from 'lucide-react'
import { accesoActual, leerIndice, leerMes, puedeVer } from '@/lib/reportes/servidor'
import { Barra } from '@/lib/reportes/Barra'
import { AREAS, esSlug, urlPanel } from '@/lib/reportes/areas'
import { cap, fechaLarga, mesCorto, nombreMes, num, variacion } from '@/lib/reportes/formato'
import { Anillo, AreaDiaria, BarrasLinea, Horizontales } from '@/lib/reportes/graficos'
import type { Medida, ReporteMes } from '@/lib/reportes/tipos'

export const dynamic = 'force-dynamic'

const SIN = <span className="rp-pill no">sin datos</span>
const TIPOS: Record<string, string> = { marca: 'Marca', servicio: 'Servicio', ciudad: 'Servicio + ciudad', 'pregunta-ia': 'Pregunta tipo IA', contenido: 'Contenido (trae visitas)' }
const TIPO_ACCION: Record<string, string> = { 'técnico': 'tec', contenido: 'con', GEO: 'geo', 'indexación': 'idx' }

function Seccion({ icono: I, titulo, sub, children, id }: { icono: React.ElementType; titulo: string; sub?: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="rp-sec" id={id}>
      <div className="rp-sec-h"><div className="ic"><I size={20} strokeWidth={2.2} /></div><div><h2>{titulo}</h2>{sub && <p>{sub}</p>}</div></div>
      {children}
    </section>
  )
}

function Kpi({ icono: I, valor, lbl, delta, dec = 0 }: { icono: React.ElementType; valor: number | null | undefined; lbl: string; delta?: ReturnType<typeof variacion>; dec?: number }) {
  return (
    <div className="rp-kpi2">
      <div className="ic"><I size={18} strokeWidth={2.2} /></div>
      {valor == null ? <div className="num muted">sin datos</div> : <div className="num">{num(valor, dec)}</div>}
      <div className="lbl">{lbl}</div>
      {delta && <span className={'rp-delta ' + delta.tipo}>{delta.txt}</span>}
    </div>
  )
}

function IA({ v, veces, mencion }: { v: Medida; veces: string | null; mencion: boolean }) {
  if (v === 'no aplica') return <span className="rp-pill no">solo Google</span>
  if (v === 'sin medir') return <span className="rp-pill no">se mide desde diciembre</span>
  if (v != null) return <span className={'rp-pill ' + (v <= 3 ? 'good' : 'mix')}>#{v}{veces ? ` · ${veces}` : ''}</span>
  if (mencion) return <span className="rp-pill warn">lo nombra sin lugar</span>
  return <span className="rp-pill no">no aparece</span>
}

// Estados permitidos al cliente: solo «terminado», «pendiente» o «atrasado» (nunca «en curso»).
// «atrasado» solo si el registro trae fecha comprometida (plazo) y ya venció.
function estadoNosotros(p: { estado: string; plazo?: string | null }): 'terminado' | 'pendiente' | 'atrasado' {
  const e = (p.estado || '').toLowerCase().trim()
  if (e === 'hecho' || e === 'terminado' || e === 'listo') return 'terminado'
  if (e === 'atrasado') return 'atrasado'
  const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' })
  if (p.plazo && /^\d{4}-\d{2}-\d{2}/.test(p.plazo) && p.plazo.slice(0, 10) < hoy) return 'atrasado'
  return 'pendiente'
}

export default async function ReporteCliente({ params, searchParams }: { params: { cliente: string }; searchParams: { mes?: string; vista?: string } }) {
  const acceso = await accesoActual()
  if (!acceso) redirect('/' + params.cliente)
  if (!esSlug(params.cliente)) notFound()
  if (!puedeVer(acceso, params.cliente)) return <OtraArea email={acceso.email} propia={acceso.cliente} />
  const indice = await leerIndice()
  const info0 = indice?.clientes[params.cliente]
  const area = AREAS[params.cliente] || null
  const todos = info0 ? (await Promise.all(info0.meses.map(m => leerMes(params.cliente, m)))).filter(Boolean) as ReporteMes[] : []
  if (!todos.length && !area) notFound()
  const nombreCliente = info0?.nombre || area!.nombre
  // Pestañas del área: Reporte SEO y GEO + paneles del cliente
  const conReporte = area?.reporte !== false
  const vista = searchParams.vista && /^panel-\d+$/.test(searchParams.vista) && area?.paneles[+searchParams.vista.slice(6)] ? searchParams.vista : conReporte ? 'reporte' : 'panel-0'
  const pestanas = area && (area.paneles.length > 1 || (conReporte && area.paneles.length)) ? (
    <nav className="rp-area-tabs" aria-label="Secciones del área de cliente">
      {conReporte && <a href={`/${params.cliente}`} className={vista === 'reporte' ? 'on' : ''}><Search size={16} /> Reporte SEO y GEO</a>}
      {area.paneles.map((p, i) => <a key={i} href={`/${params.cliente}?vista=panel-${i}`} className={vista === 'panel-' + i ? 'on' : ''}><LayoutDashboard size={16} /> {p.nombre}</a>)}
    </nav>
  ) : null
  if (vista !== 'reporte' || !todos.length) {
    const panel = vista !== 'reporte' ? area!.paneles[+vista.slice(6)] : null
    if (panel?.completo) redirect(panel.url)
    const src = panel ? urlPanel(panel) : null
    return (
      <div className="rp-wrap">
        <Barra email={acceso.email} volver={acceso.admin} area={params.cliente} />
        <header className="rp-hero3 compacto">
          <div className="rp-brands3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-blanco.png" alt="Muller y Pérez" className="myp" />
            {area?.logo && params.cliente !== 'mulleryperez' && <><span className="x">×</span>{/* eslint-disable-next-line @next/next/no-img-element */}<span className={"cli" + (area.logoOscuro ? " oscuro" : "")}><img src={area.logo} alt={nombreCliente} /></span></>}
          </div>
          <div className="rp-pill3"><span className="dot" />Área de clientes</div>
          <h1><em>{nombreCliente}</em></h1>
        </header>
        {pestanas}
        {!panel ? (
          <div className="rp-sheet"><div className="rp-callout info"><h4>Reporte SEO y GEO en preparación</h4><p>El primer reporte mensual de {nombreCliente} se publica aquí a partir del 1 de diciembre de 2026.{info0?.falta ? ' Falta: ' + info0.falta + '.' : ''}</p></div></div>
        ) : !src ? (
          <div className="rp-sheet"><div className="rp-callout warn"><h4>{panel.nombre}</h4><p>Este panel todavía no está disponible desde el área de clientes. {panel.nota || ''}</p></div></div>
        ) : panel.embebible ? (
          <div className="rp-panel">
            <div className="bar"><span>{panel.nombre}</span><a href={src} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> Abrir en otra pestaña</a></div>
            <iframe src={src} title={panel.nombre} loading="lazy" referrerPolicy="no-referrer" />
          </div>
        ) : (
          <div className="rp-sheet"><div className="rp-callout dark"><h4>{panel.nombre}</h4><p>Este panel se abre en una pestaña aparte.</p><p style={{ marginTop: 10 }}><a className="rp-open" href={src} target="_blank" rel="noopener noreferrer">Abrir panel</a></p></div></div>
        )}
      </div>
    )
  }
  const info = info0!
  const disponibles = todos.map(r => r.mes)
  const mes = searchParams.mes && disponibles.includes(searchParams.mes) ? searchParams.mes : disponibles[disponibles.length - 1]
  const idx = disponibles.indexOf(mes)
  const r = todos[idx]
  const ant = idx > 0 ? todos[idx - 1] : null
  const comparar = ant && !r.periodo.parcial ? ant : null
  const g = r.gsc, a = r.ga4, nota = r.notaSeo || null
  const mesNombre = nombreMes(mes).split(' ')[0]
  const dominio = info.sitio.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  const seg = r.seguimiento || null
  const segGoogle = seg ? seg.busquedas.filter(b => b.gsc).length : 0
  const segTop10 = seg ? seg.busquedas.filter(b => b.gsc && b.gsc.posicion <= 10).length : 0
  const medida = (v: Medida) => v !== 'sin medir' && v !== 'no aplica'
  const preg = seg?.preguntasIA?.length ? seg.preguntasIA : null
  const iaFilas: { chatgpt: Medida; gemini: Medida }[] = preg || seg?.busquedas || []
  const segGptMedidas = iaFilas.filter(b => medida(b.chatgpt)).length
  const segGpt = iaFilas.filter(b => typeof b.chatgpt === 'number').length
  const segGemMedidas = iaFilas.filter(b => medida(b.gemini)).length
  const segGem = iaFilas.filter(b => typeof b.gemini === 'number').length
  // Bitácora: de la más reciente a la más antigua (el cliente ve arriba lo último)
  const bit = [...(r.bitacora || [])].sort((a, b) => b.fecha.localeCompare(a.fecha))
  const conteo = bit.reduce((o, x) => { o[x.tipo] = (o[x.tipo] || 0) + 1; return o }, {} as Record<string, number>)
  const etiquetas = todos.map(x => cap(mesCorto(x.mes)) + (x.periodo.parcial ? '*' : ''))
  const logoCliente = params.cliente !== 'mulleryperez' ? (area?.logo || info.logo || null) : null
  const esMyP = params.cliente === 'mulleryperez'
  // Indexación: solo el formato con «indexadas» (el anterior, por grupos, ya no se muestra)
  const ix = r.indexacion && typeof r.indexacion.indexadas === 'number' && r.indexacion.total > 0 ? r.indexacion : null

  return (
    <div className="rp-wrap">
      <Barra email={acceso.email} volver={acceso.admin} area={params.cliente} />

      {/* ── Portada (estilo Presentación de Agencia M&P 2026 / home: azul marino, robot, tarjetas de vidrio) ── */}
      <header className="rp-hero3">
        <div className="rp-hero3-grid">
          <div className="rp-hero3-txt">
            <div className="rp-brands3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-blanco.png" alt="Muller y Pérez" className="myp" />
              {logoCliente && !esMyP && <><span className="x">×</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <span className={"cli" + (area?.logoOscuro ? " oscuro" : "")}><img src={logoCliente} alt={info.nombre} /></span></>}
            </div>
            <div className="rp-pill3"><span className="dot" />Reporte SEO y GEO · {nombreMes(mes)}{r.periodo.parcial ? ' · en curso' : ''}</div>
            <h1>{(() => { const w = info.nombre.split(' '); return w.length > 1 ? <>{w.slice(0, -1).join(' ')} <em>{w[w.length - 1]}</em></> : <em>{info.nombre}</em> })()}</h1>
            <p className="lead">
              {g ? <>En {mesNombre} el sitio sumó <b>{num(g.clics)} visitas desde Google</b>{a ? <> y <b>{num(a.ia)} desde asistentes de IA</b></> : ''}, y apareció {num(g.impresiones)} veces en los resultados de búsqueda.</> : 'Search Console no entregó datos para este mes.'}
              {r.periodo.parcial ? ` Datos del ${fechaLarga(r.periodo.desde)} al ${fechaLarga(r.periodo.hasta)}; Google publica con unos 3 días de atraso.` : ''}
            </p>
            <div className="rp-foot3"><Globe2 size={14} /> <a href={info.sitio} target="_blank" rel="noopener noreferrer">{dominio}</a> · {esMyP ? 'Reporte interno de M&P' : 'Preparado por Muller y Pérez'}</div>
          </div>
          <div className="rp-robot" aria-hidden="true">
            <div className="glow" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/robot.png" alt="" />
            <div className="chip c1"><p>Clics desde Google</p><b className="cyan">{g ? num(g.clics) : 'sin datos'}</b></div>
            <div className="chip c2"><p>Visitas desde IA</p><b className="violet">{a ? num(a.ia) : 'sin datos'}</b></div>
            <div className="chip c3"><p>Nota SEO y GEO</p><b className="green">{nota?.nota != null ? `${nota.nota} / 100` : 'sin auditoría'}</b></div>
          </div>
        </div>
        <div className="rp-stats3">
          <div><b>{g ? num(g.impresiones) : '—'}</b><span>apariciones en Google</span></div>
          <div><b>{g ? num(g.posicion, 1) : '—'}</b><span>posición promedio</span></div>
          <div><b>{seg ? `${segTop10}/${seg.busquedas.length}` : '—'}</b><span>búsquedas en el top 10</span></div>
          {segGptMedidas || !segGemMedidas
            ? <div><b>{segGptMedidas ? `${segGpt}/${segGptMedidas}` : '—'}</b><span>ChatGPT nos recomienda{segGptMedidas && seg?.medicion ? ` · medido el ${fechaLarga(seg.medicion)}` : ''}</span></div>
            : <div><b>{`${segGem}/${segGemMedidas}`}</b><span>Gemini nos recomienda{seg?.medicion ? ` · medido el ${fechaLarga(seg.medicion)}` : ''}</span></div>}
          <div><b>{bit.length || '—'}</b><span>acciones en el sitio</span></div>
        </div>
      </header>

      {pestanas}
      <nav className="rp-tabs" aria-label="Meses">
        <CalendarDays size={16} className="cal" />
        {disponibles.map(m => {
          const x = todos.find(t => t.mes === m)!
          return <a key={m} href={`/${params.cliente}?mes=${m}`} className={'rp-tab' + (m === mes ? ' on' : '')}>{cap(nombreMes(m))}{x.periodo.parcial && <small>en curso</small>}</a>
        })}
        <div className="rp-index">
          <a href="#nota">Nota</a><a href="#busquedas">Búsquedas</a><a href="#bitacora">Bitácora</a>{ix && <a href="#indexacion">Indexación</a>}
        </div>
      </nav>

      <div className="rp-sheet">
        {/* ── KPIs ── */}
        <Seccion icono={Activity} titulo="Indicadores del mes" sub={comparar ? `Comparado con ${nombreMes(comparar.mes)}.` : r.periodo.parcial && ant ? `Mes en curso: no lo comparamos con ${nombreMes(ant.mes)} hasta que esté completo.` : undefined}>
          <div className="rp-grid-4">
            <Kpi icono={MousePointerClick} valor={g?.clics} lbl="Clics desde Google" delta={comparar && variacion(g?.clics, comparar.gsc?.clics)} />
            <Kpi icono={Eye} valor={g?.impresiones} lbl="Veces que apareció en Google" delta={comparar && variacion(g?.impresiones, comparar.gsc?.impresiones)} />
            <Kpi icono={Target} valor={g?.posicion} dec={1} lbl="Posición promedio en Google" delta={comparar && variacion(g?.posicion, comparar.gsc?.posicion, true)} />
            <Kpi icono={Bot} valor={a?.ia} lbl="Visitas desde asistentes de IA" delta={comparar && variacion(a?.ia, comparar.ga4?.ia)} />
            <Kpi icono={Globe2} valor={a?.sesiones} lbl="Visitas totales al sitio" delta={comparar && variacion(a?.sesiones, comparar.ga4?.sesiones)} />
            <Kpi icono={Search} valor={a?.organico} lbl="Visitas desde buscadores" delta={comparar && variacion(a?.organico, comparar.ga4?.organico)} />
            <Kpi icono={Newspaper} valor={r.articulos ? r.articulos.length : null} lbl="Artículos publicados" />
            <Kpi icono={Wrench} valor={bit.length} lbl="Acciones en el sitio" />
          </div>
        </Seccion>

        {/* ── Evolución ── */}
        <Seccion icono={TrendingUp} titulo="Evolución mes a mes" sub={todos.some(x => x.periodo.parcial) ? '* Mes en curso, todavía incompleto.' : undefined}>
          <div className="rp-grid-2">
            <div className="rp-card2"><h4>Clics desde Google y visitas desde IA</h4>
              <BarrasLinea meses={etiquetas} barras={todos.map(x => x.gsc?.clics ?? null)} linea={todos.map(x => x.ga4?.ia ?? null)} nombreBarras="Clics desde Google" nombreLinea="Visitas desde IA" sel={idx} /></div>
            <div className="rp-card2"><h4>Nota SEO y GEO del sitio</h4>
              <BarrasLinea meses={etiquetas} barras={todos.map(x => x.notaSeo?.nota ?? null)} nombreBarras="Nota de 0 a 100 (meses sin auditoría: «sin datos»)" sel={idx} /></div>
            <div className="rp-card2"><h4>Visitas desde buscadores y totales</h4>
              <BarrasLinea meses={etiquetas} barras={todos.map(x => x.ga4?.sesiones ?? null)} linea={todos.map(x => x.ga4?.organico ?? null)} nombreBarras="Visitas totales" nombreLinea="Desde buscadores" sel={idx} /></div>
            <div className="rp-card2"><h4>Clics por día en {mesNombre}</h4>
              <AreaDiaria dias={(g?.porDia || []).map(d => ({ fecha: d.fecha, v: d.clics }))} nombre="Clics diarios desde Google" /></div>
          </div>
        </Seccion>

        {/* ── Nota SEO ── */}
        <Seccion id="nota" icono={Gauge} titulo="Nota SEO y GEO del sitio" sub={`Auditoría automática con los mismos ${nota ? nota.criterios.filter(c => c.max).length : 25} criterios cada mes: técnico, contenido, autoridad en Google y preparación para IA. 25 puntos por categoría.`}>
          {!nota ? <div className="rp-callout info"><h4>Sin auditoría en {mesNombre}</h4><p>La nota se empezó a medir en noviembre de 2026. Los meses anteriores no tienen auditoría y no se rellenan.</p></div> : <>
            <div className="rp-nota">
              <div className="rp-nota-ring"><Anillo valor={nota.nota} tam={190} /><span>Revisión del {fechaLarga(nota.fecha)}<br />{nota.muestra} páginas de {num(nota.urlsSitemap)} del sitemap</span></div>
              <div className="rp-nota-cats">
                <Horizontales filas={nota.categorias.map(c => ({ nombre: c.nombre, v: c.puntos, max: 25 }))} max={25} sufijo=" / 25" />
                {nota.categorias.some(c => c.sinMedir.length) && <p className="src">No medido este mes (no suma ni resta): {nota.categorias.flatMap(c => c.sinMedir).join('; ')}.</p>}
              </div>
            </div>
            <h4 className="rp-h4">Lo que más le resta puntos</h4>
            <ol className="rp-probs">
              {nota.problemas.map((p, i) => <li key={i}><div className="n">−{num(p.pierde, 1)}</div><div><strong>{p.problema}</strong><span>{p.categoria} · {p.detalle}</span></div></li>)}
            </ol>
            <details className="rp-det"><summary>Ver los {nota.criterios.filter(c => c.max).length} criterios y su puntaje</summary>
              <div className="rp-table-wrap"><table>
                <thead><tr><th>Categoría</th><th>Criterio</th><th className="c">Puntos</th><th>Detalle</th></tr></thead>
                <tbody>{nota.criterios.filter(c => c.max).map((c, i) => <tr key={i}><td style={{ whiteSpace: 'nowrap' }}>{c.categoria}</td><td className="ink">{c.nombre}</td><td className="c">{c.pts == null ? <span className="rp-pill no">sin medir</span> : `${num(c.pts, c.pts % 1 ? 1 : 0)} / ${c.max}`}</td><td style={{ fontSize: 13 }}>{c.detalle}</td></tr>)}</tbody>
              </table></div>
              <p className="src">{nota.noMide} Versión del método: {nota.version}.</p>
            </details>
          </>}
        </Seccion>

        {/* ── Búsquedas ── */}
        <Seccion id="busquedas" icono={Search} titulo="Búsquedas que seguimos" sub={seg ? `${seg.busquedas.length} búsquedas: marca, servicios, ciudades y preguntas como las que la gente le hace a una IA.` : undefined}>
          {!seg ? <p className="rp-empty">Este cliente todavía no tiene su set de búsquedas.</p> : (<>
            <div className="rp-grid-3">
              <div className="rp-mini"><div className="ic g"><Search size={18} /></div><b>{segGoogle} / {seg.busquedas.length}</b><span>aparecen en Google · {segTop10} en el top 10</span></div>
              <div className="rp-mini"><div className="ic c"><Sparkles size={18} /></div><b>{segGptMedidas ? `${segGpt} / ${segGptMedidas}` : 'desde diciembre'}</b><span>ChatGPT nos recomienda{segGptMedidas ? (preg ? ' (preguntas medidas)' : ' (búsquedas medidas)') : ''}</span></div>
              <div className="rp-mini"><div className="ic m"><Bot size={18} /></div><b>{segGemMedidas ? `${segGem} / ${segGemMedidas}` : 'desde diciembre'}</b><span>Gemini nos recomienda</span></div>
            </div>
            <div className="rp-table-wrap" style={{ marginTop: 14 }}>
              <table>
                <thead><tr><th>Búsqueda</th><th>Tipo</th>{disponibles.map(m => <th key={m} className="c">Google · {mesCorto(m)}</th>)}{!preg && <><th className="c">ChatGPT</th><th className="c">Gemini</th><th>Quién más aparece en ChatGPT</th></>}</tr></thead>
                <tbody>{seg.busquedas.map(b => (
                  <tr key={b.q}>
                    <td className="ink">{b.q}</td>
                    <td><span className={'rp-tipo t-' + b.tipo}>{TIPOS[b.tipo] || b.tipo}</span></td>
                    {todos.map(x => {
                      const s2 = x.seguimiento?.busquedas.find(y => y.q === b.q)
                      return <td key={x.mes} className={'c' + (x.mes === mes ? ' sel' : '')}>{!x.seguimiento ? SIN : s2?.gsc ? <span className={'rp-pill ' + (s2.gsc.posicion <= 3 ? 'good' : s2.gsc.posicion <= 10 ? 'mix' : 'no')} title={`${num(s2.gsc.clics)} clics · ${num(s2.gsc.impresiones)} apariciones`}>#{num(s2.gsc.posicion, 1)}</span> : <span className="rp-pill no">no aparece</span>}</td>
                    })}
                    {!preg && <><td className="c"><IA v={b.chatgpt} veces={b.chatgptVeces} mencion={b.chatgptMencion} /></td>
                    <td className="c"><IA v={b.gemini} veces={b.geminiVeces} mencion={b.geminiMencion} /></td>
                    <td style={{ fontSize: 13 }}>{b.competidores.length ? b.competidores.join(', ') : '—'}</td></>}
                  </tr>))}</tbody>
              </table>
            </div>
            {preg ? <p className="src">Google: posición promedio del mes en Search Console (#3 o mejor en verde, top 10 en morado). ChatGPT y Gemini se miden con preguntas de recomendación (sección siguiente).</p> : <p className="src">Google: posición promedio del mes en Search Console (#3 o mejor en verde, top 10 en morado). ChatGPT y Gemini: lugar en que recomiendan a {info.nombre} en {mesNombre}{seg.medicion ? `, medición del ${fechaLarga(seg.medicion)}` : ''}, preguntando en chatgpt.com y gemini.google.com igual que una persona en Chile (chat temporal, sin historial ni preferencias). Las IA cambian sus respuestas: es una foto del día de la medición. «se mide desde diciembre» = esa IA todavía no se midió para esta búsqueda. «solo Google» = búsqueda que no preguntamos a las IA.</p>}
          </>)}
        </Seccion>

        {preg && (
          <Seccion id="preguntas-ia" icono={Bot} titulo="Preguntas a asistentes de IA" sub={`${preg.length} preguntas de recomendación, como las haría un cliente: ¿a quién nos recomiendan ChatGPT y Gemini?${seg?.medicion ? ` Medido el ${fechaLarga(seg.medicion)}.` : ''}`}>
            <div className="rp-table-wrap">
              <table>
                <thead><tr><th>Pregunta</th><th className="c">ChatGPT</th><th className="c">Gemini</th><th>A quién más recomiendan</th></tr></thead>
                <tbody>{preg.map(b => (
                  <tr key={b.q}>
                    <td className="ink">{b.q}</td>
                    <td className="c"><IA v={b.chatgpt} veces={null} mencion={b.chatgptMencion} /></td>
                    <td className="c"><IA v={b.gemini} veces={null} mencion={b.geminiMencion} /></td>
                    <td style={{ fontSize: 13 }}>{b.competidores.length ? b.competidores.join(', ') : '—'}</td>
                  </tr>))}</tbody>
              </table>
            </div>
            <p className="src">Lugar en que ChatGPT (chatgpt.com) y Gemini (app, sesión con ubicación Chile) recomiendan a {info.nombre}, preguntando como una persona en Chile en chat temporal, sin historial, con un chat nuevo por pregunta. «lo nombra sin lugar» = aparece en la respuesta pero no en la lista ordenada. Las IA cambian sus respuestas: es una foto del día de la medición. «se mide desde diciembre» = esa IA todavía no se midió para esta pregunta.</p>
          </Seccion>
        )}

        {/* ── Bitácora ── */}
        <Seccion id="bitacora" icono={ListChecks} titulo={`Bitácora: lo que hicimos en el sitio en ${mesNombre}`} sub="Cada cambio con su fecha, la página afectada y de dónde sale el registro.">
          {bit.length === 0 ? <p className="rp-empty">No registramos acciones este mes.</p> : (<>
            <div className="rp-chips">{Object.entries(conteo).map(([t, n]) => <span key={t} className={'rp-chip ' + (TIPO_ACCION[t] || '')}>{cap(t)} · {n}</span>)}</div>
            <ol className="rp-timeline">
              {bit.map((x, i) => (
                <li key={i} className={TIPO_ACCION[x.tipo] || ''}>
                  <div className="d">{fechaLarga(x.fecha)}</div>
                  <div className="b">
                    <div className="a"><span className={'rp-chip sm ' + (TIPO_ACCION[x.tipo] || '')}>{cap(x.tipo)}</span>{x.accion}</div>
                    {x.enlaces && x.enlaces.length > 1
                      ? <details><summary>Ver los {x.enlaces.length} artículos</summary><ul>{x.enlaces.map(e => <li key={e.url}><a href={e.url} target="_blank" rel="noopener noreferrer">{e.titulo}</a></li>)}</ul></details>
                      : <div className="m">{x.url && x.url !== 'todo el sitio' && x.url.startsWith('/') && !x.url.includes(',') ? <a href={info.sitio.replace(/\/$/, '') + x.url} target="_blank" rel="noopener noreferrer">{x.url}</a> : (x.url || 'sin página específica')} · <span>{x.fuente}</span></div>}
                  </div>
                </li>
              ))}
            </ol>
          </>)}
        </Seccion>

        {/* ── Estado del sitio ── */}
        {r.pendientes && r.pendientes.cliente.length > 0 && (
          <Seccion id="pendientes" icono={ListChecks} titulo="Pendientes para avanzar" sub={`Al ${fechaLarga(r.pendientes.actualizado)}.`}>
            <div className="rp-pend">
              <div className="rp-pend-col">
                <h4>Lo que necesitamos de {info.nombre}</h4>
                <ul>{r.pendientes.cliente.map((p, i) => <li key={i}>{p.texto}</li>)}</ul>
              </div>
              <div className="rp-pend-col">
                <h4>Lo que estamos haciendo nosotros</h4>
                <ul>{r.pendientes.nosotros.map((p, i) => { const e = estadoNosotros(p); return <li key={i}><span className={'rp-pill ' + (e === 'terminado' ? 'good' : e === 'atrasado' ? 'bad' : 'warn')}>{e}</span> {p.texto}</li> })}</ul>
              </div>
            </div>
          </Seccion>
        )}
        {/* ── Indexación en Google (Search Console, foto del día de la medición) ── */}
        {ix && (
          <Seccion id="indexacion" icono={Layers} titulo="Indexación en Google" sub={`Cuántas páginas del sitio ya están en Google y pueden aparecer en sus resultados. Revisión del ${fechaLarga(ix.fecha)}, página por página, en Google Search Console.`}>
            <div className="rp-idx">
              <div className="rp-idx-top"><b>{num(ix.indexadas)} de {num(ix.total)}</b><span>páginas indexadas · {Math.round(ix.indexadas / ix.total * 100)} %</span></div>
              <div className="rp-idx-track" role="img" aria-label={`${ix.indexadas} de ${ix.total} páginas indexadas`}><div className="rp-bar" style={{ width: `${ix.indexadas / ix.total * 100}%` }} /></div>
            </div>
            <div className="rp-table-wrap" style={{ marginTop: 14 }}><table>
              <thead><tr><th>Estado en Google</th><th className="r">Páginas</th><th className="r">%</th></tr></thead>
              <tbody>{Object.entries(ix.porEstado).sort((x, y) => (y[0] === 'Indexada' ? 1 : 0) - (x[0] === 'Indexada' ? 1 : 0) || y[1] - x[1]).map(([e, n]) => (
                <tr key={e}><td className="ink"><span className={'rp-pill ' + (e === 'Indexada' ? 'good' : /aún sin indexar|no la conoce/.test(e) ? 'warn' : 'no')}>{e}</span></td><td className="r">{num(n)}</td><td className="r">{Math.round(n / ix.total * 100)} %</td></tr>
              ))}</tbody>
            </table></div>
            {ix.noIndexadas.length > 0 && (
              <details className="rp-det"><summary>Ver las {num(ix.noIndexadas.length)} páginas que aún no están indexadas</summary>
                <div className="rp-table-wrap"><table>
                  <thead><tr><th>Página</th><th>Estado</th></tr></thead>
                  <tbody>{ix.noIndexadas.map(p => <tr key={p.url}><td style={{ fontSize: 13, wordBreak: 'break-all' }}><a href={p.url} target="_blank" rel="noopener noreferrer">{p.url.replace(/^https?:\/\/[^/]+/, '') || '/'}</a></td><td style={{ whiteSpace: 'nowrap' }}>{p.estado}</td></tr>)}</tbody>
                </table></div>
              </details>
            )}
            <p className="src">«Descubierta, aún sin indexar»: Google sabe que la página existe pero todavía no la visita. «Rastreada, aún sin indexar»: Google la visitó y aún no decide incluirla. «Google aún no la conoce»: todavía no la encuentra. Las redirecciones, las páginas excluidas a propósito y las duplicadas no necesitan estar en Google. Las páginas nuevas suelen tardar días o semanas en entrar.</p>
          </Seccion>
        )}

        {/* ── Tráfico ── */}
        <div className="rp-grid-2">
          <Seccion icono={Bot} titulo="Asistentes de IA que envían visitas">
            {!a ? <p className="rp-empty">Sin datos de Analytics este mes.</p> : a.fuentesIA.length === 0 ? <p className="rp-empty">Este mes no llegaron visitas desde asistentes de IA.</p>
              : <Horizontales filas={a.fuentesIA.map(f => ({ nombre: f.fuente, v: f.sesiones }))} sufijo=" visitas" />}
          </Seccion>
          <Seccion icono={FileText} titulo="Páginas con más clics desde Google">
            {!g || g.paginas.length === 0 ? <p className="rp-empty">Sin datos este mes.</p>
              : <Horizontales filas={g.paginas.map(p => ({ nombre: p.pagina.replace(/^https?:\/\/[^/]+/, '') || '/', v: p.clics }))} sufijo=" clics" />}
          </Seccion>
        </div>

        <Seccion icono={MousePointerClick} titulo="Lo que busca la gente que llega desde Google">
          {!g ? <p className="rp-empty">Sin datos de Search Console este mes.</p> : g.consultas.length === 0 ? <p className="rp-empty">Google no informó búsquedas para este mes.</p> : (
            <div className="rp-table-wrap"><table>
              <thead><tr><th>Búsqueda en Google</th><th className="r">Clics</th><th className="r">Apariciones</th><th className="c">Posición</th></tr></thead>
              <tbody>{g.consultas.map(q => <tr key={q.consulta}><td className="ink">{q.consulta}</td><td className="r">{num(q.clics)}</td><td className="r">{num(q.impresiones)}</td><td className="c">{num(q.posicion, 1)}</td></tr>)}</tbody>
            </table></div>
          )}
        </Seccion>

        <p className="src">Fuentes: Google Search Console (clics, apariciones, posición y búsquedas), Google Analytics 4 (visitas y asistentes de IA), medición propia de M&amp;P en Google y ChatGPT, auditoría automática de M&amp;P, registro de trabajo y cambios publicados en el sitio. Actualizado el {fechaLarga(r.generado.slice(0, 10))}.{r.errores.length ? ' Algunos datos no se pudieron leer este mes y aparecen como «sin datos».' : ''}</p>
        <div className="rp-footer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-color.png" alt="Muller y Pérez" />
          <div><strong>Muller y Pérez</strong> · mulleryperez.cl · contacto@mulleryperez.cl<br />Reporte privado de {info.nombre}</div>
        </div>
      </div>
    </div>
  )
}

// Sesión de otro cliente: no se muestra nada del área pedida
function OtraArea({ email, propia }: { email: string; propia: string | null }) {
  return (
    <div className="rp-wrap">
      <Barra email={email} />
      <div className="rp-sheet"><div className="rp-callout warn"><h4>Esta área no corresponde a tu usuario</h4>
        <p>{propia && AREAS[propia] ? <>Tu área es <a href={'/' + propia}>mulleryperez.cl/{propia}</a>. </> : null}Si necesitas entrar con otro usuario, cierra sesión arriba a la derecha.</p></div></div>
    </div>
  )
}
