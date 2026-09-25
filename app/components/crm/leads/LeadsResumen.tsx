"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  CANALES,
  ESTADOS,
  canalDeFuente,
  type Canal,
  type Estado,
} from "@/lib/crm/leads-pipeline";
import {
  type Lead,
  type Agrupacion,
  periodoDe,
  siguientePeriodo,
  etiquetaPeriodo,
} from "./types";
import LeadsInsights from "./LeadsInsights";

interface Props {
  leads: Lead[];
  agrupacion: Agrupacion;
  onFiltrar: (f: { canal?: Canal; estado?: Estado }) => void;
}

type Conteo = Record<Estado, number> & { total: number; monto: number };

function conteoVacio(): Conteo {
  return {
    nuevo: 0,
    contactado: 0,
    cotizacion: 0,
    vendido: 0,
    no_contesta: 0,
    desechado: 0,
    total: 0,
    monto: 0,
  };
}

function sumar(c: Conteo, lead: Lead) {
  c.total++;
  c[lead.estado]++;
  if (lead.estado === "vendido") c.monto += Number(lead.monto_vendido || 0);
}

function pct(n: number, d: number) {
  return d > 0 ? `${((n / d) * 100).toFixed(1)}%` : "—";
}

export default function LeadsResumen({ leads, agrupacion, onFiltrar }: Props) {
  const data = useMemo(() => {
    const total = conteoVacio();
    const porCanal = new Map<Canal, Conteo>();
    const porPeriodo = new Map<string, Conteo & Record<string, number>>();
    const motivos = new Map<
      string,
      { estado: Estado; motivo: string; n: number }
    >();

    for (const lead of leads) {
      sumar(total, lead);

      const canal = canalDeFuente(lead.fuente);
      if (!porCanal.has(canal)) porCanal.set(canal, conteoVacio());
      sumar(porCanal.get(canal)!, lead);

      const p = periodoDe(lead.fecha_ingreso, agrupacion);
      if (!porPeriodo.has(p))
        porPeriodo.set(p, conteoVacio() as Conteo & Record<string, number>);
      const fila = porPeriodo.get(p)!;
      sumar(fila, lead);
      fila[`c_${canal}`] = (fila[`c_${canal}`] || 0) + 1;

      if (
        (lead.estado === "desechado" || lead.estado === "no_contesta") &&
        lead.razon_no_venta
      ) {
        const motivo = lead.razon_no_venta.trim();
        const key = `${lead.estado}|${motivo.toLowerCase()}`;
        const m = motivos.get(key) || { estado: lead.estado, motivo, n: 0 };
        m.n++;
        motivos.set(key, m);
      }
    }

    const periodos = Array.from(porPeriodo.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([periodo, c]) => ({
        periodo,
        label: etiquetaPeriodo(periodo, agrupacion),
        ...c,
      }));

    // Gráfico: línea de tiempo continua, con períodos sin leads en 0
    const serie: { periodo: string; label: string; [k: string]: string | number }[] = [];
    if (periodos.length) {
      const porClave = new Map(periodos.map((p) => [p.periodo, p]));
      const ultimo = periodos[periodos.length - 1].periodo;
      for (let p = periodos[0].periodo; p <= ultimo; p = siguientePeriodo(p, agrupacion)) {
        serie.push(porClave.get(p) ?? { periodo: p, label: etiquetaPeriodo(p, agrupacion) });
      }
    }

    const canales = CANALES.filter((c) => porCanal.has(c.id))
      .map((c) => ({ ...c, conteo: porCanal.get(c.id)! }))
      .sort((a, b) => b.conteo.total - a.conteo.total);

    const sinMotivo = leads.filter(
      (l) =>
        (l.estado === "desechado" || l.estado === "no_contesta") &&
        !l.razon_no_venta,
    ).length;

    return {
      total,
      periodos,
      serie,
      canales,
      motivos: Array.from(motivos.values()).sort((a, b) => b.n - a.n),
      sinMotivo,
    };
  }, [leads, agrupacion]);

  const { total } = data;
  const gestionados = total.total - total.nuevo;

  const kpis: {
    label: string;
    value: string;
    sub?: string;
    estado?: Estado;
    cls: string;
  }[] = [
    {
      label: "Leads",
      value: String(total.total),
      cls: "bg-slate-900 text-white",
    },
    {
      label: "Sin gestionar",
      value: String(total.nuevo),
      sub: pct(total.nuevo, total.total),
      estado: "nuevo",
      cls: "bg-sky-50 text-sky-900",
    },
    {
      label: "Contactados",
      value: String(total.contactado),
      sub: pct(total.contactado, total.total),
      estado: "contactado",
      cls: "bg-indigo-50 text-indigo-900",
    },
    {
      label: "En cotización",
      value: String(total.cotizacion),
      sub: pct(total.cotizacion, total.total),
      estado: "cotizacion",
      cls: "bg-amber-50 text-amber-900",
    },
    {
      label: "Vendidos",
      value: String(total.vendido),
      sub: pct(total.vendido, total.total),
      estado: "vendido",
      cls: "bg-green-50 text-green-900",
    },
    {
      label: "No contesta",
      value: String(total.no_contesta),
      sub: pct(total.no_contesta, total.total),
      estado: "no_contesta",
      cls: "bg-orange-50 text-orange-900",
    },
    {
      label: "Desechados",
      value: String(total.desechado),
      sub: pct(total.desechado, total.total),
      estado: "desechado",
      cls: "bg-gray-100 text-gray-800",
    },
    {
      label: "Tasa de venta",
      value: pct(total.vendido, total.total),
      sub: `${pct(total.vendido, gestionados)} de gestionados`,
      cls: "bg-emerald-600 text-white",
    },
  ];

  if (total.total === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No hay leads en este período.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpis.map((k) => (
          <button
            key={k.label}
            type="button"
            disabled={!k.estado}
            onClick={() => k.estado && onFiltrar({ estado: k.estado })}
            className={`rounded-lg p-3 text-left ${k.cls} ${k.estado ? "hover:ring-2 hover:ring-blue-300" : "cursor-default"}`}
          >
            <p className="text-xs font-medium opacity-80">{k.label}</p>
            <p className="text-2xl font-bold tabular-nums">{k.value}</p>
            {k.sub && (
              <p className="text-xs opacity-70 tabular-nums">{k.sub}</p>
            )}
          </button>
        ))}
      </div>

      <LeadsInsights leads={leads} />


      {/* Evolución por fuente */}
      <section className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Leads por {agrupacion === "dia" ? "día" : agrupacion} y fuente
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.serie}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {data.canales.map((c) => (
                <Bar
                  key={c.id}
                  dataKey={`c_${c.id}`}
                  name={c.label}
                  stackId="a"
                  fill={c.color}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Por fuente */}
        <section className="border border-gray-200 rounded-lg p-4 xl:col-span-2 overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-3">
            Resultado por fuente
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b">
                <th className="text-left py-2 pr-2">Fuente</th>
                <th className="text-right px-2">Leads</th>
                {ESTADOS.map((e) => (
                  <th key={e.id} className="text-right px-2">
                    {e.label}
                  </th>
                ))}
                <th className="text-right px-2">% venta</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 tabular-nums">
              {data.canales.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onFiltrar({ canal: c.id })}
                >
                  <td className="py-2 pr-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                      style={{ background: c.color }}
                    />
                    {c.label}
                  </td>
                  <td className="text-right px-2 font-semibold">
                    {c.conteo.total}
                  </td>
                  {ESTADOS.map((e) => (
                    <td key={e.id} className="text-right px-2 text-gray-700">
                      {c.conteo[e.id] || "·"}
                    </td>
                  ))}
                  <td className="text-right px-2">
                    {pct(c.conteo.vendido, c.conteo.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Motivos */}
        <section className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Motivos de pérdida
          </h3>
          {data.motivos.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aún no hay motivos registrados.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.motivos.slice(0, 12).map((m) => (
                <li
                  key={`${m.estado}|${m.motivo}`}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="truncate">
                    <span
                      className={`text-[10px] uppercase font-semibold mr-2 ${m.estado === "desechado" ? "text-gray-500" : "text-orange-600"}`}
                    >
                      {m.estado === "desechado" ? "Desech." : "No cont."}
                    </span>
                    {m.motivo}
                  </span>
                  <span className="font-semibold tabular-nums">{m.n}</span>
                </li>
              ))}
            </ul>
          )}
          {data.sinMotivo > 0 && (
            <p className="text-xs text-amber-700 mt-3">
              {data.sinMotivo} desechados / no contesta sin motivo.
            </p>
          )}
        </section>
      </div>

      {/* Por período */}
      <section className="border border-gray-200 rounded-lg p-4 overflow-x-auto">
        <h3 className="font-semibold text-gray-900 mb-3">
          Detalle por {agrupacion === "dia" ? "día" : agrupacion}
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left py-2 pr-2">Período</th>
              <th className="text-right px-2">Leads</th>
              {ESTADOS.map((e) => (
                <th key={e.id} className="text-right px-2">
                  {e.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 tabular-nums">
            {[...data.periodos].reverse().map((p) => (
              <tr key={p.periodo}>
                <td className="py-1.5 pr-2">{p.label}</td>
                <td className="text-right px-2 font-semibold">{p.total}</td>
                {ESTADOS.map((e) => (
                  <td key={e.id} className="text-right px-2 text-gray-700">
                    {p[e.id] || "·"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
