// Bitácora financiera de M&P: www.mulleryperez.cl/admin-finanzas (el middleware la reescribe aquí). SOLO Christopher (superadmin + app_metadata.reportes.finanzas = true).
// Datos: bucket privado «reportes-seo», archivo _finanzas/facturas.json, generado desde la hoja «Facturas»
// de «Planilla números M&P» con ~/bin/finanzas/sync.sh (exportar.mjs + procesar.py). Nunca va al navegador sin sesión superadmin.
import { redirect } from "next/navigation";
import { accesoActual, leerFinanzas } from "@/lib/reportes/servidor";
import { Barra } from "@/lib/reportes/Barra";
import Finanzas from "./Finanzas";
import "./finanzas.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Bitácora financiera · Muller y Pérez",
  robots: { index: false, follow: false },
};

export default async function PaginaFinanzas() {
  const acceso = await accesoActual();
  if (!acceso) redirect("/admin-finanzas");
  if (!acceso.finanzas) redirect("/admin-reportes");
  const datos = await leerFinanzas();
  return (
    <div className="rp-wrap">
      <Barra email={acceso.email} volver />
      {datos ? (
        <Finanzas filas={datos.filas} generado={datos.generado} />
      ) : (
        <div className="rp-sheet">
          <div className="rp-callout warn">
            <h4>Sin datos</h4>
            <p>
              Falta cargar _finanzas/facturas.json (correr
              ~/bin/finanzas/sync.sh).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
