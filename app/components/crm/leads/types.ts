import type { Estado } from "@/lib/crm/leads-pipeline";

export interface Lead {
  id: number;
  cliente_id: string;
  campana_nombre: string | null;
  adset_nombre: string | null;
  ad_nombre: string | null;
  form_nombre: string | null;
  fecha_ingreso: string;
  nombre: string | null;
  apellido: string | null;
  empresa: string | null;
  nombre_empresa: string | null;
  telefono: string | null;
  email: string | null;
  ciudad: string | null;
  region: string | null;
  mensaje: string | null;
  presupuesto: string | null;
  servicio: string | null;
  contactado: boolean;
  fecha_contacto: string | null;
  vendido: boolean;
  monto_vendido: number | null;
  razon_no_venta: string | null;
  observaciones: string | null;
  notas: string | null;
  fuente: string | null;
  estado: Estado;
  prioridad: boolean | null;
}

export type Agrupacion = "dia" | "semana" | "mes";

const TZ = "America/Santiago";

/** YYYY-MM-DD en hora de Chile */
export function fechaLocal(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });
}

export function periodoDe(iso: string, agrupacion: Agrupacion): string {
  const dia = fechaLocal(iso);
  if (agrupacion === "dia") return dia;
  if (agrupacion === "mes") return dia.slice(0, 7);
  // semana: lunes de esa semana
  const d = new Date(`${dia}T12:00:00Z`);
  const offset = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export function etiquetaPeriodo(
  periodo: string,
  agrupacion: Agrupacion,
): string {
  const [y, m, d] = periodo.split("-");
  const mes = MESES[parseInt(m) - 1];
  if (agrupacion === "mes") return `${mes} ${y}`;
  if (agrupacion === "semana") return `Sem ${parseInt(d)} ${mes}`;
  return `${parseInt(d)} ${mes}`;
}

export function nombreCompleto(lead: Lead): string {
  return (
    [lead.nombre, lead.apellido].filter(Boolean).join(" ").trim() ||
    "Sin nombre"
  );
}

export function empresaDe(lead: Lead): string | null {
  return lead.empresa || lead.nombre_empresa || null;
}

export function formatCLP(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

/** Siguiente período (para rellenar huecos en el gráfico) */
export function siguientePeriodo(periodo: string, agrupacion: Agrupacion): string {
  if (agrupacion === "mes") {
    const [y, m] = periodo.split("-").map(Number);
    return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  }
  const d = new Date(`${periodo}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + (agrupacion === "semana" ? 7 : 1));
  return d.toISOString().slice(0, 10);
}

/** Link wa.me desde un teléfono chileno (9 dígitos o con +56) */
export function whatsappUrl(tel: string | null) {
  if (!tel) return null;
  let n = tel.replace(/\D/g, "");
  if (n.length === 9 && n.startsWith("9")) n = "56" + n;
  if (n.length < 10) return null;
  return `https://wa.me/${n}`;
}
