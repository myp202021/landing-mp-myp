/**
 * Agentes IA que cuentan como "en producción": ≥70% de ejecuciones exitosas en 30 días.
 * Única fuente de la cifra para /agentes-ia y /boost-seo-ia (antes una decía 19 y la otra 27).
 * Datos: data/agentes-ia.json + data/agentes-evidencia.json (workflow agentes-evidencia, lunes).
 */
import inventario from "@/data/agentes-ia.json";
import evidencia from "@/data/agentes-evidencia.json";

type Ev = { tipo: string; ejecuciones_30d?: number; exitosas_30d?: number };
const EV = evidencia as unknown as { agentes: Record<string, Ev> };

export function agenteFunciona(e?: Ev) {
  if (!e || e.tipo !== "workflow" || !e.exitosas_30d || !e.ejecuciones_30d) return false;
  return e.exitosas_30d / e.ejecuciones_30d >= 0.7;
}

export const AGENTES_ACTIVOS = (inventario as { id: string }[]).filter((a) => agenteFunciona(EV.agentes[a.id])).length;
