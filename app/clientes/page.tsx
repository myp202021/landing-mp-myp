// Índice del superadmin: www.mulleryperez.cl/admin-reportes (el middleware lo reescribe aquí).
// Lista todas las áreas de clientes (lib/reportes/areas.ts) con el estado de sus datos y un enlace a cada una.
import { redirect } from "next/navigation";
import { accesoActual, leerIndice } from "@/lib/reportes/servidor";
import { nombreMes } from "@/lib/reportes/formato";
import { Barra } from "@/lib/reportes/Barra";
import { AREAS } from "@/lib/reportes/areas";

export const dynamic = "force-dynamic";

export default async function InicioReportes() {
  const acceso = await accesoActual();
  if (!acceso) redirect("/admin-reportes");
  if (!acceso.admin) {
    if (acceso.cliente && AREAS[acceso.cliente]) redirect("/" + acceso.cliente);
    return <SinAcceso email={acceso.email} />;
  }
  const indice = await leerIndice();
  const datos = indice?.clientes || {};
  const filas = Object.entries(AREAS).map(([slug, a]) => {
    const d = datos[slug];
    const meses = d?.meses || [];
    const estado = !a.reporte
      ? { t: "Solo panel (sin servicio SEO/GEO)", c: "no" }
      : meses.length
        ? {
            t: `${meses.length} mes${meses.length > 1 ? "es" : ""} · último ${nombreMes(meses[meses.length - 1])}`,
            c: d?.falta ? "mix" : "good",
          }
        : { t: "Reporte en preparación", c: "warn" };
    return { slug, a, d, estado };
  });
  return (
    <div className="rp-wrap">
      <Barra email={acceso.email} />
      <div className="rp-sheet">
        <div className="rp-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-color.png" alt="Muller y Pérez" />
          <div className="rp-header-right">
            <div className="rp-client">Áreas de clientes</div>
            <div className="rp-sub">
              Superadmin · {filas.length} áreas ·{" "}
              {filas.filter((f) => f.d?.meses?.length).length} con reporte
              cargado
            </div>
          </div>
        </div>
        <div className="rp-table-wrap">
          <table className="rp-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Reporte</th>
                <th>Search Console</th>
                <th>Analytics</th>
                <th>Paneles</th>
                <th>Falta</th>
              </tr>
            </thead>
            <tbody>
              {filas.map(({ slug, a, d, estado }) => (
                <tr key={slug}>
                  <td>
                    <strong>{a.nombre}</strong>
                    {d?.sitio && (
                      <div className="rp-mini-txt">
                        {d.sitio.replace(/^https?:\/\/(www\.)?/, "")}
                      </div>
                    )}
                  </td>
                  <td>
                    <a href={"/" + slug}>mulleryperez.cl/{slug}</a>
                  </td>
                  <td>
                    <span className={"rp-pill " + estado.c}>{estado.t}</span>
                  </td>
                  <td>
                    {!a.reporte ? (
                      "—"
                    ) : d?.fuentes ? (
                      d.fuentes.gsc ? (
                        <span className="rp-pill good">conectado</span>
                      ) : (
                        <span className="rp-pill no">sin acceso aún</span>
                      )
                    ) : (
                      "sin datos"
                    )}
                  </td>
                  <td>
                    {!a.reporte ? (
                      "—"
                    ) : d?.fuentes ? (
                      d.fuentes.ga4 ? (
                        <span className="rp-pill good">conectado</span>
                      ) : (
                        <span className="rp-pill no">sin acceso aún</span>
                      )
                    ) : (
                      "sin datos"
                    )}
                  </td>
                  <td>
                    {a.paneles.length
                      ? a.paneles.map((p) => p.nombre).join(" · ")
                      : "—"}
                  </td>
                  <td>
                    {d?.falta || (a.reporte && !d ? "cargar datos" : "—")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rp-footer">
          <strong>Muller y Pérez</strong> · Vista interna, no la compartas
          {indice ? "" : " · No se pudo leer el índice de datos"}
        </div>
      </div>
    </div>
  );
}

function SinAcceso({ email }: { email: string }) {
  return (
    <div className="rp-wrap">
      <Barra email={email} />
      <div className="rp-sheet">
        <div className="rp-callout warn">
          <h4>Tu usuario aún no tiene un área asignada</h4>
          <p>Escríbenos a contacto@mulleryperez.cl y lo dejamos listo.</p>
        </div>
      </div>
    </div>
  );
}
