/**
 * Agentes IA que cuentan como "en producción": ≥70% de ejecuciones exitosas en 30 días.
 * Única fuente de la cifra y del glosario para el home, /agentes-ia y /boost-seo-ia.
 * Datos: data/agentes-ia.json + data/agentes-evidencia.json (workflow agentes-evidencia, lunes).
 */
import inventario from "@/data/agentes-ia.json";
import evidencia from "@/data/agentes-evidencia.json";

type Ev = { tipo: string; ejecuciones_30d?: number; exitosas_30d?: number; ultima_exitosa?: string | null };
type Inv = { id: string; nombre: string; area: string; que_hace: string; frecuencia: string };
const EV = evidencia as unknown as { generado: string; agentes: Record<string, Ev> };

export function agenteFunciona(e?: Ev) {
  if (!e || e.tipo !== "workflow" || !e.exitosas_30d || !e.ejecuciones_30d) return false;
  return e.exitosas_30d / e.ejecuciones_30d >= 0.7;
}

export type AgenteActivo = Inv & { exitosas30: number };

export const AGENTES_LISTA: AgenteActivo[] = (inventario as Inv[])
  .filter((a) => agenteFunciona(EV.agentes[a.id]))
  .map((a) => ({ id: a.id, nombre: a.nombre, area: a.area, que_hace: a.que_hace, frecuencia: a.frecuencia, exitosas30: EV.agentes[a.id].exitosas_30d || 0 }));

export const AGENTES_ACTIVOS = AGENTES_LISTA.length;
export const AGENTES_EJECUCIONES_30D = AGENTES_LISTA.reduce((s, a) => s + a.exitosas30, 0);
export const AGENTES_ACTUALIZADO = EV.generado;
