import { redirect } from 'next/navigation'
import { accesoActual, leerIndice } from '@/lib/reportes/servidor'
import { nombreMes } from '@/lib/reportes/formato'
import { Barra } from '@/lib/reportes/Barra'

export const dynamic = 'force-dynamic'

export default async function InicioReportes() {
  const acceso = await accesoActual()
  if (!acceso) redirect('/clientes/login')
  if (!acceso.admin) {
    if (acceso.cliente) redirect('/clientes/' + acceso.cliente)
    return <SinAcceso email={acceso.email} />
  }
  const indice = await leerIndice()
  const clientes = Object.entries(indice?.clientes || {})
  return (
    <div className="rp-wrap">
      <Barra email={acceso.email} />
      <div className="rp-sheet">
        <div className="rp-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-color.png" alt="Muller y Pérez" />
          <div className="rp-header-right"><div className="rp-client">Reportes SEO y GEO</div><div className="rp-sub">Vista de administrador · {clientes.length} cliente{clientes.length === 1 ? '' : 's'}</div></div>
        </div>
        {clientes.length === 0 ? <p className="rp-empty">Todavía no hay reportes cargados.</p> : (
          <div className="rp-cards">
            {clientes.map(([id, c]) => (
              <a key={id} className="rp-card" href={'/clientes/' + id}>
                <div className="t">{c.nombre}</div>
                <div className="s">{c.sitio.replace(/^https?:\/\/(www\.)?/, '')}</div>
                <div className="s">{c.meses.length} meses · último: {nombreMes(c.meses[c.meses.length - 1])}</div>
              </a>
            ))}
          </div>
        )}
        <div className="rp-footer"><strong>Muller y Pérez</strong> · mulleryperez.cl · Reporte privado, no lo compartas</div>
      </div>
    </div>
  )
}

function SinAcceso({ email }: { email: string }) {
  return (
    <div className="rp-wrap">
      <Barra email={email} />
      <div className="rp-sheet"><div className="rp-callout warn"><h4>Tu usuario aún no tiene un reporte asignado</h4><p>Escríbenos a contacto@mulleryperez.cl y lo dejamos listo.</p></div></div>
    </div>
  )
}
