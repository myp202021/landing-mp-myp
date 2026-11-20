import { notFound, redirect } from 'next/navigation'
import { accesoActual, leerIndice, leerMes, puedeVer } from '@/lib/reportes/servidor'
import { Barra } from '@/lib/reportes/Barra'
import { cap, fechaLarga, mesCorto, nombreMes, num, variacion } from '@/lib/reportes/formato'
import type { ReporteMes } from '@/lib/reportes/tipos'

export const dynamic = 'force-dynamic'

const SIN = <span className="rp-pill no">sin datos</span>

function Kpi({ valor, lbl, delta, dec = 0 }: { valor: number | null | undefined; lbl: string; delta?: ReturnType<typeof variacion>; dec?: number }) {
  return (
    <div className="rp-kpi">
      {valor == null ? <div className="num muted">sin datos</div> : <div className="num">{num(valor, dec)}</div>}
      <div className="lbl">{lbl}</div>
      {delta && <span className={'rp-delta ' + delta.tipo}>{delta.txt}</span>}
    </div>
  )
}

function Posicion({ p }: { p: number | null }) {
  if (p == null) return <span className="rp-pill no">fuera del top 10</span>
  return <span className={'rp-pill ' + (p <= 3 ? 'good' : 'mix')}>#{p}</span>
}

function ChatGPT({ v, veces, mencion }: { v: number | null | 'sin medir'; veces: string | null; mencion: boolean }) {
  if (v === 'sin medir') return <span className="rp-pill no">sin medir</span>
  if (v != null) return <span className={'rp-pill ' + (v <= 3 ? 'good' : 'mix')}>#{v}{veces ? ` · ${veces}` : ''}</span>
  if (mencion) return <span className="rp-pill warn">lo cita como fuente</span>
  return <span className="rp-pill no">no aparece</span>
}

export default async function ReporteCliente({ params, searchParams }: { params: { cliente: string }; searchParams: { mes?: string } }) {
  const acceso = await accesoActual()
  if (!acceso) redirect('/clientes/login')
  if (!puedeVer(acceso, params.cliente)) {
    if (acceso.cliente) redirect('/clientes/' + acceso.cliente)
    redirect('/clientes')
  }
  const indice = await leerIndice()
  const info = indice?.clientes[params.cliente]
  if (!info || !info.meses.length) notFound()

  const meses = info.meses
  const todos = (await Promise.all(meses.map(m => leerMes(params.cliente, m)))).filter(Boolean) as ReporteMes[]
  if (!todos.length) notFound()
  const disponibles = todos.map(r => r.mes)
  const mes = searchParams.mes && disponibles.includes(searchParams.mes) ? searchParams.mes : disponibles[disponibles.length - 1]
  const r = todos.find(x => x.mes === mes)!
  const idx = disponibles.indexOf(mes)
  const ant = idx > 0 ? todos[idx - 1] : null
  const comparar = ant && !r.periodo.parcial ? ant : null
  const g = r.gsc, a = r.ga4
  const maxClics = Math.max(1, ...todos.map(x => x.gsc?.clics || 0))
  const vis = r.visibilidad?.busquedas || []
  const enGoogle = vis.filter(b => b.google != null).length
  const enGpt = vis.filter(b => typeof b.chatgpt === 'number').length
  const citaGpt = vis.filter(b => b.chatgpt == null && b.chatgptMencion).length
  const dominio = info.sitio.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

  return (
    <div className="rp-wrap">
      <Barra email={acceso.email} volver={acceso.admin} />
      <div className="rp-sheet">
        <div className="rp-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-color.png" alt="Muller y Pérez" />
          <div className="rp-header-right">
            <div className="rp-client">{info.nombre}</div>
            <div className="rp-sub">Reporte SEO y GEO · <a href={info.sitio} target="_blank" rel="noopener noreferrer">{dominio}</a></div>
          </div>
        </div>

        <nav className="rp-tabs" aria-label="Meses">
          {disponibles.map(m => {
            const x = todos.find(t => t.mes === m)!
            return <a key={m} href={`/clientes/${params.cliente}?mes=${m}`} className={'rp-tab' + (m === mes ? ' on' : '')}>{cap(nombreMes(m))}{x.periodo.parcial && <small>en curso</small>}</a>
          })}
        </nav>

        <div className="rp-cover">
          <div className="rp-eyebrow">Reporte mensual · {nombreMes(mes)}{r.periodo.parcial ? ` · datos del ${fechaLarga(r.periodo.desde)} al ${fechaLarga(r.periodo.hasta)}` : ''}</div>
          <h1>{g ? `${num(g.clics)} visitas desde Google${a ? ` y ${num(a.ia)} desde asistentes de IA` : ''} en ${nombreMes(mes).split(' ')[0]}.` : `Reporte de ${nombreMes(mes)}`}</h1>
          <p>
            {g ? `El sitio apareció ${num(g.impresiones)} veces en los resultados de Google, en una posición promedio de ${num(g.posicion, 1)}. ` : 'Search Console no entregó datos para este mes. '}
            {r.acciones.length || r.articulos?.length ? `En el mes registramos ${r.acciones.length} ${r.acciones.length === 1 ? 'acción' : 'acciones'} de SEO y GEO${r.articulos ? ` y se publicaron ${r.articulos.length} artículos en el blog` : ''}.` : ''}
            {r.periodo.parcial ? ' El mes sigue en curso: las cifras se completan cuando Google publica los días que faltan (unos 3 días de atraso).' : ''}
          </p>
        </div>

        <h3>Indicadores del mes</h3>
        <div className="rp-grid-4">
          <Kpi valor={g?.clics} lbl="Clics desde Google" delta={comparar && variacion(g?.clics, comparar.gsc?.clics)} />
          <Kpi valor={g?.impresiones} lbl="Veces que apareció en Google" delta={comparar && variacion(g?.impresiones, comparar.gsc?.impresiones)} />
          <Kpi valor={g?.posicion} dec={1} lbl="Posición promedio en Google" delta={comparar && variacion(g?.posicion, comparar.gsc?.posicion, true)} />
          <Kpi valor={a?.ia} lbl="Visitas desde asistentes de IA" delta={comparar && variacion(a?.ia, comparar.ga4?.ia)} />
        </div>
        <div className="rp-grid-4" style={{ marginTop: 12 }}>
          <Kpi valor={a?.sesiones} lbl="Visitas totales al sitio" delta={comparar && variacion(a?.sesiones, comparar.ga4?.sesiones)} />
          <Kpi valor={a?.organico} lbl="Visitas desde buscadores" delta={comparar && variacion(a?.organico, comparar.ga4?.organico)} />
          <Kpi valor={r.articulos ? r.articulos.length : null} lbl="Artículos publicados" />
          <Kpi valor={r.acciones.length} lbl="Acciones de SEO y GEO" />
        </div>
        {r.periodo.parcial && ant && <p className="src">Mes en curso: no lo comparamos con {nombreMes(ant.mes)} porque todavía no está completo.</p>}

        <h3>Evolución mes a mes</h3>
        <div className="rp-table-wrap">
          <table>
            <thead><tr><th>Mes</th><th>Clics desde Google</th><th className="r">Apariciones</th><th className="c">Posición</th><th className="r">Visitas buscadores</th><th className="r">Visitas IA</th><th className="r">Artículos</th></tr></thead>
            <tbody>
              {todos.map(x => (
                <tr key={x.mes} className={x.mes === mes ? 'on' : ''}>
                  <td className="ink"><a href={`/clientes/${params.cliente}?mes=${x.mes}`}>{cap(mesCorto(x.mes))}</a>{x.periodo.parcial && <> <span className="rp-pill mix">en curso</span></>}</td>
                  <td style={{ minWidth: 190 }}>{x.gsc ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="rp-bar" style={{ width: Math.round(x.gsc.clics / maxClics * 120) }} /><b>{num(x.gsc.clics)}</b></div> : SIN}</td>
                  <td className="r">{x.gsc ? num(x.gsc.impresiones) : SIN}</td>
                  <td className="c">{x.gsc ? num(x.gsc.posicion, 1) : SIN}</td>
                  <td className="r">{x.ga4 ? num(x.ga4.organico) : SIN}</td>
                  <td className="r">{x.ga4 ? num(x.ga4.ia) : SIN}</td>
                  <td className="r">{x.articulos ? num(x.articulos.length) : SIN}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Lo que hicimos en {nombreMes(mes).split(' ')[0]}</h3>
        {r.acciones.length === 0 && !r.articulos?.length ? <p className="rp-empty">No registramos acciones este mes.</p> : (
          <ul className="rp-steps">
            {r.acciones.map((x, i) => <li key={i}><div className="n">{i + 1}</div><div><strong>{x.texto}</strong><span>{fechaLarga(x.fecha)}</span></div></li>)}
            {r.articulos && r.articulos.length > 0 && (
              <li><div className="n">{r.acciones.length + 1}</div><div style={{ flex: 1 }}><strong>{r.articulos.length} artículos nuevos en el blog</strong>
                <details style={{ marginTop: 4 }}><summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--indigo-500)' }}>Ver la lista</summary>
                  <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>{r.articulos.map(x => <li key={x.url} style={{ fontSize: 13.5, padding: '2px 0' }}><a href={x.url} target="_blank" rel="noopener noreferrer">{x.titulo}</a> <span style={{ color: 'var(--ink-400)' }}>· {fechaLarga(x.fecha)}</span></li>)}</ul>
                </details></div></li>
            )}
          </ul>
        )}

        <h3>Estado del sitio</h3>
        <div className="rp-grid-2">
          <div className={'rp-callout ' + (r.indexacion ? (r.indexacion.pendientes.length ? 'warn' : 'good') : 'info')}>
            <h4>Páginas en Google</h4>
            {r.indexacion ? <>
              <p><b>{num(r.indexacion.grupos.indexada || 0)} de {num(r.indexacion.total)}</b> páginas del sitio están en el índice de Google (revisión del {fechaLarga(r.indexacion.fecha)}).</p>
              {r.indexacion.pendientes.length > 0 && <><p style={{ marginTop: 6 }}>Pendientes, ya pedidas a Google:</p><ul>{r.indexacion.pendientes.map(u => <li key={u}>{u.replace(info.sitio.replace(/\/$/, ''), '') || '/'}</li>)}</ul></>}
            </> : <p>Sin revisión de indexación guardada para este mes.</p>}
          </div>
          <div className="rp-callout dark">
            <h4>Visibilidad en Google y ChatGPT</h4>
            {r.visibilidad ? <>
              <p>De las <b style={{ color: '#fff' }}>{vis.length} búsquedas</b> que seguimos, el sitio aparece en el top 10 de Google en <b style={{ color: '#fff' }}>{enGoogle}</b> y ChatGPT lo recomienda en <b style={{ color: '#fff' }}>{enGpt}</b>{citaGpt ? <>; en otras {citaGpt} lo cita como fuente</> : ''}.</p>
              <p style={{ marginTop: 6, fontSize: 13 }}>Medición del {fechaLarga(r.visibilidad.fecha)}. En ChatGPT repetimos cada búsqueda 3 veces y contamos solo lo que aparece en la mayoría.</p>
            </> : <p>Sin medición de visibilidad este mes.</p>}
          </div>
        </div>

        <h3>Búsquedas que seguimos</h3>
        {vis.length === 0 ? <p className="rp-empty">Sin medición este mes.</p> : (
          <div className="rp-table-wrap">
            <table>
              <thead><tr><th>Búsqueda</th><th className="c">Google</th><th className="c">ChatGPT</th><th>Quién más aparece en ChatGPT</th></tr></thead>
              <tbody>{vis.map(b => (
                <tr key={b.busqueda}>
                  <td className="ink">{b.busqueda}</td>
                  <td className="c">{b.googleUrl ? <a href={b.googleUrl} target="_blank" rel="noopener noreferrer"><Posicion p={b.google} /></a> : <Posicion p={b.google} />}</td>
                  <td className="c"><ChatGPT v={b.chatgpt} veces={b.chatgptVeces} mencion={b.chatgptMencion} /></td>
                  <td style={{ fontSize: 13 }}>{b.competidores.length ? b.competidores.join(', ') : '—'}</td>
                </tr>))}</tbody>
            </table>
          </div>
        )}

        <h3>Lo que busca la gente que llega desde Google</h3>
        {!g ? <p className="rp-empty">Sin datos de Search Console este mes.</p> : g.consultas.length === 0 ? <p className="rp-empty">Google no informó búsquedas para este mes.</p> : (
          <div className="rp-table-wrap">
            <table>
              <thead><tr><th>Búsqueda en Google</th><th className="r">Clics</th><th className="r">Apariciones</th><th className="c">Posición</th></tr></thead>
              <tbody>{g.consultas.map(q => <tr key={q.consulta}><td className="ink">{q.consulta}</td><td className="r">{num(q.clics)}</td><td className="r">{num(q.impresiones)}</td><td className="c">{num(q.posicion, 1)}</td></tr>)}</tbody>
            </table>
          </div>
        )}

        <div className="rp-grid-2" style={{ marginTop: 6 }}>
          <div>
            <h3>Asistentes de IA que envían visitas</h3>
            {!a ? <p className="rp-empty">Sin datos de Analytics este mes.</p> : a.fuentesIA.length === 0 ? <p className="rp-empty">Este mes no llegaron visitas desde asistentes de IA.</p> : (
              <div className="rp-table-wrap"><table>
                <thead><tr><th>Asistente</th><th className="r">Visitas</th></tr></thead>
                <tbody>{a.fuentesIA.map(f => <tr key={f.fuente}><td className="ink">{f.fuente}</td><td className="r">{num(f.sesiones)}</td></tr>)}</tbody>
              </table></div>
            )}
          </div>
          <div>
            <h3>Páginas con más clics desde Google</h3>
            {!g || g.paginas.length === 0 ? <p className="rp-empty">Sin datos este mes.</p> : (
              <div className="rp-table-wrap"><table>
                <thead><tr><th>Página</th><th className="r">Clics</th></tr></thead>
                <tbody>{g.paginas.map(p => <tr key={p.pagina}><td style={{ wordBreak: 'break-all', fontSize: 13 }}><a href={p.pagina} target="_blank" rel="noopener noreferrer">{p.pagina.replace(/^https?:\/\/[^/]+/, '') || '/'}</a></td><td className="r">{num(p.clics)}</td></tr>)}</tbody>
              </table></div>
            )}
          </div>
        </div>

        <p className="src">Fuentes: Google Search Console (clics, apariciones, posición y búsquedas), Google Analytics 4 (visitas y asistentes de IA), medición propia de M&amp;P en Google y ChatGPT, y registro de trabajo de M&amp;P. Actualizado el {fechaLarga(r.generado.slice(0, 10))}.{r.errores.length ? ' Algunos datos no se pudieron leer este mes y aparecen como «sin datos».' : ''}</p>
        <div className="rp-footer"><strong>Muller y Pérez</strong> · mulleryperez.cl · contacto@mulleryperez.cl · Reporte privado de {info.nombre}</div>
      </div>
    </div>
  )
}
