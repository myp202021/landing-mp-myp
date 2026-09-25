"use client";

import { useMemo } from "react";
import { CANAL_MAP, canalDeFuente, type Canal } from "@/lib/crm/leads-pipeline";
import { type Lead, periodoDe, etiquetaPeriodo, fechaLocal } from "./types";

const DIAS = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const TZ = "America/Santiago";

interface Hallazgo {
  titulo: string;
  valor: string;
  detalle: string;
  tono?: "bueno" | "alerta" | "neutro";
}

function maxPor<T>(m: Map<T, number>): [T, number] | null {
  let best: [T, number] | null = null;
  m.forEach((v, k) => {
    if (!best || v > best[1]) best = [k, v];
  });
  return best;
}

function contar<T>(m: Map<T, number>, k: T) {
  m.set(k, (m.get(k) || 0) + 1);
}

function pct(n: number, d: number) {
  return d ? Math.round((n / d) * 100) : 0;
}

export default function LeadsInsights({ leads }: { leads: Lead[] }) {
  const hallazgos = useMemo<Hallazgo[]>(() => {
    if (leads.length < 5) return [];
    const porMes = new Map<string, number>();
    const contactadosMes = new Map<string, number>();
    const ventasMes = new Map<string, number>();
    const porDia = new Map<number, number>();
    const porHora = new Map<number, number>();
    const porCanal = new Map<Canal, number>();
    const ventasCanal = new Map<Canal, number>();
    let finDeSemana = 0;
    let sinGestionarViejos = 0;
    const ahora = Date.now();

    // Cargas masivas (ej. 203 leads ingresados a mano el 31-mar): distorsionan día y hora
    const porFecha = new Map<string, number>();
    for (const l of leads) contar(porFecha, fechaLocal(l.fecha_ingreso));
    const diasOrdenados = Array.from(porFecha.values()).sort((a, b) => a - b);
    const mediana = diasOrdenados[Math.floor(diasOrdenados.length / 2)] || 1;
    const masivos = new Set(
      Array.from(porFecha.entries())
        .filter(([, n]) => n >= 20 && n > mediana * 5)
        .map(([f]) => f),
    );
    let enMasivos = 0;
    let conEmail = 0;
    let emailPersonal = 0;
    const emails = new Map<string, number>();
    let ultimaVenta = 0;

    for (const l of leads) {
      const mes = periodoDe(l.fecha_ingreso, "mes");
      contar(porMes, mes);
      if (l.estado !== "nuevo") contar(contactadosMes, mes);
      if (l.estado === "vendido") contar(ventasMes, mes);

      const d = new Date(l.fecha_ingreso);
      if (masivos.has(fechaLocal(l.fecha_ingreso))) {
        enMasivos++;
      } else {
        const dia = DIAS.indexOf(d.toLocaleDateString("es-CL", { timeZone: TZ, weekday: "long" }));
        if (dia >= 0) contar(porDia, dia);
        if (dia === 0 || dia === 6) finDeSemana++;
        contar(porHora, parseInt(d.toLocaleString("en-US", { timeZone: TZ, hour: "numeric", hour12: false })) % 24);
      }

      if (l.email) {
        conEmail++;
        const e = l.email.trim().toLowerCase();
        contar(emails, e);
        if (/@(gmail|hotmail|outlook|yahoo|live|icloud)\./.test(e)) emailPersonal++;
      }
      if (l.estado === "vendido") ultimaVenta = Math.max(ultimaVenta, d.getTime());

      const canal = canalDeFuente(l.fuente);
      contar(porCanal, canal);
      if (l.estado === "vendido") contar(ventasCanal, canal);

      if (l.estado === "nuevo" && ahora - d.getTime() > 48 * 3600 * 1000)
        sinGestionarViejos++;
    }

    const out: Hallazgo[] = [];
    const mesLabel = (m: string) => etiquetaPeriodo(m, "mes");

    const topMes = maxPor(porMes);
    if (topMes && porMes.size > 1) {
      const prom = Math.round(leads.length / porMes.size);
      out.push({
        titulo: "Mes con más leads",
        valor: mesLabel(topMes[0]),
        detalle: `${topMes[1]} leads · promedio ${prom}/mes`,
        tono: "bueno",
      });
    }

    const topContacto = maxPor(contactadosMes);
    if (topContacto && porMes.size > 1) {
      out.push({
        titulo: "Mes con más contactados",
        valor: mesLabel(topContacto[0]),
        detalle: `${topContacto[1]} gestionados de ${porMes.get(topContacto[0])} (${pct(topContacto[1], porMes.get(topContacto[0])!)}%)`,
      });
    }

    const topVentas = maxPor(ventasMes);
    if (topVentas) {
      out.push({
        titulo: "Mes con más ventas",
        valor: mesLabel(topVentas[0]),
        detalle: `${topVentas[1]} ventas de ${porMes.get(topVentas[0])} leads`,
        tono: "bueno",
      });
    }

    // Tendencia: último mes cerrado vs anterior
    const meses = Array.from(porMes.keys()).sort();
    const mesActual = periodoDe(new Date().toISOString(), "mes");
    const cerrados = meses.filter((m) => m < mesActual);
    if (cerrados.length >= 2) {
      const [a, b] = cerrados.slice(-2);
      const va = porMes.get(a)!;
      const vb = porMes.get(b)!;
      const delta = pct(vb - va, va);
      out.push({
        titulo: "Tendencia",
        valor: `${delta >= 0 ? "+" : ""}${delta}%`,
        detalle: `${mesLabel(b)} (${vb}) vs ${mesLabel(a)} (${va})`,
        tono: delta >= 0 ? "bueno" : "alerta",
      });
    }

    const topCanal = maxPor(porCanal);
    if (topCanal) {
      out.push({
        titulo: "Fuente que más trae",
        valor: CANAL_MAP[topCanal[0]].label,
        detalle: `${topCanal[1]} leads · ${pct(topCanal[1], leads.length)}% del total`,
      });
    }

    // Mejor conversión con volumen mínimo
    let mejor: { canal: Canal; tasa: number; v: number; n: number } | null =
      null;
    porCanal.forEach((n, canal) => {
      const v = ventasCanal.get(canal) || 0;
      if (n >= 10 && v > 0 && (!mejor || v / n > mejor.tasa))
        mejor = { canal, tasa: v / n, v, n };
    });
    if (mejor) {
      const m = mejor as { canal: Canal; tasa: number; v: number; n: number };
      out.push({
        titulo: "Fuente que mejor vende",
        valor: CANAL_MAP[m.canal].label,
        detalle: `${m.v} ventas de ${m.n} leads (${(m.tasa * 100).toFixed(1)}%)`,
        tono: "bueno",
      });
    }

    const topDia = maxPor(porDia);
    if (topDia) {
      out.push({
        titulo: "Día que más entran",
        valor: DIAS[topDia[0]],
        detalle: `${pct(topDia[1], leads.length - enMasivos)}% de los leads · fin de semana ${pct(finDeSemana, leads.length - enMasivos)}%`,
      });
    }

    // Franja de 3 horas con más leads
    let franja = 0;
    let franjaN = -1;
    for (let h = 0; h < 24; h++) {
      const n =
        (porHora.get(h) || 0) +
        (porHora.get((h + 1) % 24) || 0) +
        (porHora.get((h + 2) % 24) || 0);
      if (n > franjaN) {
        franjaN = n;
        franja = h;
      }
    }
    if (franjaN > 0) out.push({
      titulo: "Horario peak",
      valor: `${franja}:00 – ${(franja + 3) % 24}:00`,
      detalle: `${pct(franjaN, leads.length - enMasivos)}% de los leads entra en esa franja${enMasivos ? ` (sin ${enMasivos} de cargas masivas)` : ""}`,
    });

    // Fuente con volumen y sin ventas
    let peor: [Canal, number] | null = null;
    porCanal.forEach((n, canal) => {
      if (n >= 30 && !ventasCanal.get(canal) && (!peor || n > peor[1])) peor = [canal, n];
    });
    if (peor) {
      const [c, n] = peor as [Canal, number];
      out.push({
        titulo: "Mucho volumen, cero ventas",
        valor: CANAL_MAP[c].label,
        detalle: `${n} leads (${pct(n, leads.length)}% del total) sin ninguna venta registrada`,
        tono: "alerta",
      });
    }

    if (ultimaVenta) {
      const dias = Math.floor((ahora - ultimaVenta) / 864e5);
      out.push({
        titulo: "Última venta registrada",
        valor: `hace ${dias} días`,
        detalle: new Date(ultimaVenta).toLocaleDateString("es-CL", { timeZone: TZ, day: "numeric", month: "long" }) + (dias > 60 ? " · ¿no hubo ventas o no se están marcando?" : ""),
        tono: dias > 60 ? "alerta" : "bueno",
      });
    }

    if (conEmail >= 20) {
      out.push({
        titulo: "Correo personal (gmail, hotmail…)",
        valor: `${pct(emailPersonal, conEmail)}%`,
        detalle: `${emailPersonal} de ${conEmail} leads no dejan correo corporativo`,
        tono: pct(emailPersonal, conEmail) > 50 ? "alerta" : "neutro",
      });
    }

    const dup = Array.from(emails.values()).filter((n) => n > 1);
    if (dup.length) {
      out.push({
        titulo: "Leads repetidos",
        valor: String(dup.reduce((a, b) => a + b, 0)),
        detalle: `${dup.length} personas entraron más de una vez (mismo email)`,
      });
    }

    if (masivos.size) {
      out.push({
        titulo: "Cargas masivas detectadas",
        valor: String(enMasivos),
        detalle: `Leads ingresados en bloque (${Array.from(masivos).join(", ")}); excluidos de día y horario`,
      });
    }

    if (sinGestionarViejos > 0) {
      out.push({
        titulo: "Sin gestionar +48 h",
        valor: String(sinGestionarViejos),
        detalle: "Leads nuevos que nadie ha tomado en más de 2 días",
        tono: "alerta",
      });
    }

    return out;
  }, [leads]);

  if (!hallazgos.length) return null;

  const tonos = {
    bueno: "border-l-emerald-500",
    alerta: "border-l-red-500 bg-red-50/50",
    neutro: "border-l-slate-300",
  };

  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Hallazgos
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {hallazgos.map((h) => (
          <div
            key={h.titulo}
            className={`border border-gray-200 border-l-4 rounded-lg p-4 ${tonos[h.tono || "neutro"]}`}
          >
            <p className="text-xs text-gray-500">{h.titulo}</p>
            <p className="text-xl font-bold text-gray-900 first-letter:uppercase mt-0.5">
              {h.valor}
            </p>
            <p className="text-xs text-gray-600 mt-1">{h.detalle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
