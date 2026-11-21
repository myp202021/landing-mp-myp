"use client";
// Bitácora financiera M&P: filtros + resumen, bitácora año×mes, clientes, atrasos/pérdidas y detalle.
// Definiciones (mostradas también en pantalla):
//  - Facturado = facturas emitidas no anuladas (cobradas + pendientes + en demanda + perdidas). «Por facturar» va aparte.
//  - Cliente vivo en un mes = tiene factura de Fee ese mes. Permanencia = meses con Fee (entre el primero y el último).
//  - Tamaño = fee neto mensual promedio del cliente en toda su historia.
//  - Atraso = días desde el fin del mes facturado hasta hoy, solo facturas abiertas (pendientes, por facturar, en demanda).
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Fila = {
  c: string;
  t: string;
  m: string;
  n: number;
  tot: number;
  fac: string;
  e: string;
  eo: string;
  obs: string;
};

const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
const TAMANOS = [
  { k: "Pequeño", d: "menos de $400 mil", max: 400000 },
  { k: "Mediano", d: "$400 mil a $800 mil", max: 800000 },
  { k: "Grande", d: "$800 mil a $1,5 millones", max: 1500000 },
  { k: "Premium", d: "más de $1,5 millones", max: Infinity },
];
const ESTADOS: Record<string, { n: string; col: string }> = {
  cobrado: { n: "Cobrado", col: "#10B981" },
  pendiente: { n: "Pendiente de pago", col: "#F59E0B" },
  por_facturar: { n: "Por facturar", col: "#94A3B8" },
  demanda: { n: "En demanda", col: "#8B5CF6" },
  perdido: { n: "Perdido (incobrable / castigado)", col: "#EF4444" },
};
const clp = (v: number) => "$" + Math.round(v).toLocaleString("es-CL");
const mill = (v: number) =>
  Math.abs(v) >= 1e6
    ? "$" +
      (v / 1e6).toLocaleString("es-CL", { maximumFractionDigits: 1 }) +
      " M"
    : clp(v);
const nm = (m: string) => MESES[Number(m.slice(5)) - 1] + " " + m.slice(2, 4);
const sumaMes = (m: string, k: number) => {
  const d = new Date(Number(m.slice(0, 4)), Number(m.slice(5)) - 1 + k, 1);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
};
const mesesEntre = (a: string, b: string) =>
  (Number(b.slice(0, 4)) - Number(a.slice(0, 4))) * 12 +
  Number(b.slice(5)) -
  Number(a.slice(5));
const tamanoDe = (prom: number) => TAMANOS.find((t) => prom < t.max)!.k;

type InfoCliente = {
  c: string;
  desde: string;
  hasta: string;
  meses: number;
  prom: number;
  tam: string;
  vivo: boolean;
};

export default function Finanzas({
  filas,
  generado,
}: {
  filas: Fila[];
  generado: string;
}) {
  // Solo en el navegador: los formatos de número/fecha difieren entre servidor y navegador
  const [listo, setListo] = useState(false);
  useEffect(() => setListo(true), []);
  const ultimoMes = useMemo(
    () => filas.reduce((a, f) => (f.m > a ? f.m : a), "0000-00"),
    [filas],
  );
  const anos = useMemo(
    () => Array.from(new Set(filas.map((f) => f.m.slice(0, 4)))).sort(),
    [filas],
  );

  // Ficha de cada cliente sobre TODA la historia (no depende de filtros)
  const clientes = useMemo(() => {
    const porC = new Map<string, Map<string, number>>();
    for (const f of filas) {
      if (f.t !== "Fee") continue;
      const mm = porC.get(f.c) || new Map<string, number>();
      mm.set(f.m, (mm.get(f.m) || 0) + f.n);
      porC.set(f.c, mm);
    }
    const out = new Map<string, InfoCliente>();
    porC.forEach((mm, c) => {
      const ms = Array.from(mm.keys()).sort();
      const total = Array.from(mm.values()).reduce((a, b) => a + b, 0);
      const prom = total / ms.length;
      out.set(c, {
        c,
        desde: ms[0],
        hasta: ms[ms.length - 1],
        meses: ms.length,
        prom,
        tam: tamanoDe(prom),
        vivo: ms[ms.length - 1] >= sumaMes(ultimoMes, -1),
      });
    });
    // Clientes solo con publicidad/web: sin ficha de fee
    for (const f of filas)
      if (!out.has(f.c))
        out.set(f.c, {
          c: f.c,
          desde: f.m,
          hasta: f.m,
          meses: 0,
          prom: 0,
          tam: "Sin fee",
          vivo: false,
        });
    return out;
  }, [filas, ultimoMes]);

  // Filtros
  const [anoSel, setAnoSel] = useState<string[]>([]);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [tamSel, setTamSel] = useState<string[]>([]);
  const [tipoSel, setTipoSel] = useState<string[]>([
    "Fee",
    "Publicidad",
    "Web y otros",
  ]);
  const [soloVivos, setSoloVivos] = useState<"" | "vivos" | "bajas">("");
  const [cliSel, setCliSel] = useState("");
  const [base, setBase] = useState<"n" | "tot">("n");
  const [tab, setTab] = useState("resumen");
  const [busca, setBusca] = useState("");
  const [orden, setOrden] = useState<{ k: string; asc: boolean }>({
    k: "fact",
    asc: false,
  });

  const mesesTodos = useMemo(
    () => Array.from(new Set(filas.map((f) => f.m))).sort(),
    [filas],
  );

  const pasaCliente = (c: string) => {
    const i = clientes.get(c)!;
    if (cliSel && c !== cliSel) return false;
    if (tamSel.length && !tamSel.includes(i.tam)) return false;
    if (soloVivos === "vivos" && !i.vivo) return false;
    if (soloVivos === "bajas" && i.vivo) return false;
    return true;
  };
  const pasaMes = (m: string) =>
    (!anoSel.length || anoSel.includes(m.slice(0, 4))) &&
    (!desde || m >= desde) &&
    (!hasta || m <= hasta);

  const sel = useMemo(
    () =>
      filas.filter(
        (f) => tipoSel.includes(f.t) && pasaMes(f.m) && pasaCliente(f.c),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filas, tipoSel, anoSel, desde, hasta, tamSel, soloVivos, cliSel, clientes],
  );
  const v = (f: Fila) => (base === "n" ? f.n : f.tot);

  // KPIs
  const k = useMemo(() => {
    const s = {
      cobrado: 0,
      pendiente: 0,
      por_facturar: 0,
      demanda: 0,
      perdido: 0,
    };
    for (const f of sel) if (f.e in s) s[f.e as keyof typeof s] += v(f);
    const facturado = s.cobrado + s.pendiente + s.demanda + s.perdido;
    const cs = new Set(sel.filter((f) => f.t === "Fee").map((f) => f.c));
    const infos = Array.from(cs).map((c) => clientes.get(c)!);
    const perm = infos.length
      ? infos.reduce((a, i) => a + i.meses, 0) / infos.length
      : 0;
    const ms = Array.from(new Set(sel.map((f) => f.m))).sort();
    const vivosUlt = ms.length
      ? new Set(
          sel
            .filter((f) => f.t === "Fee" && f.m === ms[ms.length - 1])
            .map((f) => f.c),
        ).size
      : 0;
    return {
      ...s,
      facturado,
      clientes: cs.size,
      perm,
      mesUlt: ms[ms.length - 1],
      vivosUlt,
      meses: ms.length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, base, clientes]);

  // Serie mensual
  const serie = useMemo(() => {
    const ms = mesesTodos.filter(pasaMes);
    const idx = new Map(ms.map((m, i) => [m, i]));
    const rows = ms.map((m) => ({
      m,
      mes: nm(m),
      cobrado: 0,
      pendiente: 0,
      por_facturar: 0,
      demanda: 0,
      perdido: 0,
      vivos: 0,
      altas: 0,
      bajas: 0,
      _c: new Set<string>(),
    }));
    for (const f of sel) {
      const r = rows[idx.get(f.m)!];
      if (!r) continue;
      (r as unknown as Record<string, number>)[f.e] += v(f);
      if (f.t === "Fee") r._c.add(f.c);
    }
    const visibles = Array.from(clientes.values()).filter(
      (i) => i.meses && pasaCliente(i.c),
    );
    for (const r of rows) {
      r.vivos = r._c.size;
      r.altas = visibles.filter((i) => i.desde === r.m).length;
      r.bajas = visibles.filter(
        (i) => !i.vivo && sumaMes(i.hasta, 1) === r.m,
      ).length;
    }
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sel,
    mesesTodos,
    anoSel,
    desde,
    hasta,
    base,
    clientes,
    tamSel,
    soloVivos,
    cliSel,
  ]);

  // Por año
  const porAno = useMemo(() => {
    const m = new Map<
      string,
      {
        ano: string;
        fact: number;
        cob: number;
        pend: number;
        dem: number;
        per: number;
        cli: Set<string>;
        altas: number;
        bajas: number;
        vivosDic: number;
      }
    >();
    for (const r of serie) {
      const a = r.m.slice(0, 4);
      const o = m.get(a) || {
        ano: a,
        fact: 0,
        cob: 0,
        pend: 0,
        dem: 0,
        per: 0,
        cli: new Set<string>(),
        altas: 0,
        bajas: 0,
        vivosDic: 0,
      };
      o.cob += r.cobrado;
      o.pend += r.pendiente;
      o.dem += r.demanda;
      o.per += r.perdido;
      o.fact += r.cobrado + r.pendiente + r.demanda + r.perdido;
      r._c.forEach((c) => o.cli.add(c));
      o.altas += r.altas;
      o.bajas += r.bajas;
      o.vivosDic = r.vivos;
      m.set(a, o);
    }
    return Array.from(m.values());
  }, [serie]);

  // Tabla de clientes
  const tablaClientes = useMemo(() => {
    const m = new Map<
      string,
      {
        c: string;
        fact: number;
        cob: number;
        pend: number;
        dem: number;
        per: number;
      }
    >();
    for (const f of sel) {
      const o = m.get(f.c) || {
        c: f.c,
        fact: 0,
        cob: 0,
        pend: 0,
        dem: 0,
        per: 0,
      };
      const x = v(f);
      if (f.e === "cobrado") o.cob += x;
      if (f.e === "pendiente" || f.e === "por_facturar") o.pend += x;
      if (f.e === "demanda") o.dem += x;
      if (f.e === "perdido") o.per += x;
      if (f.e !== "por_facturar") o.fact += x;
      m.set(f.c, o);
    }
    const arr = Array.from(m.values()).map((o) => ({
      ...o,
      ...clientes.get(o.c)!,
    }));
    const q = busca.trim().toUpperCase();
    const f2 = q ? arr.filter((o) => o.c.includes(q)) : arr;
    const key = orden.k as keyof (typeof arr)[number];
    return f2.sort((a, b) => {
      const x = a[key],
        y = b[key];
      const r =
        typeof x === "number"
          ? (x as number) - (y as number)
          : String(x).localeCompare(String(y));
      return orden.asc ? r : -r;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, base, clientes, busca, orden]);

  // Por tamaño y por año de entrada (cohorte)
  const porTamano = useMemo(() => {
    const infos = Array.from(clientes.values()).filter(
      (i) =>
        i.meses &&
        pasaCliente(i.c) &&
        (!anoSel.length || anoSel.includes(i.desde.slice(0, 4))),
    );
    const fact = new Map<string, number>();
    for (const f of sel)
      if (f.e !== "por_facturar") fact.set(f.c, (fact.get(f.c) || 0) + v(f));
    const g = (lista: InfoCliente[]) => ({
      n: lista.length,
      perm: lista.length
        ? lista.reduce((a, i) => a + i.meses, 0) / lista.length
        : 0,
      prom: lista.length
        ? lista.reduce((a, i) => a + i.prom, 0) / lista.length
        : 0,
      vivos: lista.filter((i) => i.vivo).length,
      fact: lista.reduce((a, i) => a + (fact.get(i.c) || 0), 0),
    });
    return {
      tam: TAMANOS.map((t) => ({
        ...t,
        ...g(infos.filter((i) => i.tam === t.k)),
      })),
      coh: Array.from(new Set(infos.map((i) => i.desde.slice(0, 4))))
        .sort()
        .map((a) => ({ a, ...g(infos.filter((i) => i.desde.startsWith(a))) })),
      todos: g(infos),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientes, sel, anoSel, tamSel, soloVivos, cliSel, base]);

  // Atrasos (facturas abiertas) y pérdidas
  const hoy = new Date();
  const atrasos = useMemo(() => {
    const abiertas = sel
      .filter(
        (f) =>
          f.e === "pendiente" || f.e === "por_facturar" || f.e === "demanda",
      )
      .map((f) => {
        const fin = new Date(Number(f.m.slice(0, 4)), Number(f.m.slice(5)), 0);
        const dias = Math.max(
          0,
          Math.floor((hoy.getTime() - fin.getTime()) / 86400000),
        );
        return { ...f, dias };
      })
      .sort((a, b) => b.dias - a.dias);
    const monto = abiertas.reduce((a, f) => a + v(f), 0);
    // Atraso promedio: solo lo que se está cobrando normal (sin las de demanda, que llevan años)
    const cobrables = abiertas.filter((f) => f.e !== "demanda");
    const montoCob = cobrables.reduce((a, f) => a + v(f), 0);
    const promPond = montoCob
      ? cobrables.reduce((a, f) => a + f.dias * v(f), 0) / montoCob
      : 0;
    const prom = cobrables.length
      ? cobrables.reduce((a, f) => a + f.dias, 0) / cobrables.length
      : 0;
    const tramos = [
      { k: "Al día (mes en curso)", min: 0, max: 0 },
      { k: "1–30 días", min: 1, max: 30 },
      { k: "31–60 días", min: 31, max: 60 },
      { k: "61–90 días", min: 61, max: 90 },
      { k: "Más de 90 días", min: 91, max: 1e9 },
    ].map((t) => {
      const l = abiertas.filter((f) => f.dias >= t.min && f.dias <= t.max);
      return { ...t, n: l.length, monto: l.reduce((a, f) => a + v(f), 0) };
    });
    const porCli = new Map<
      string,
      { c: string; n: number; monto: number; max: number }
    >();
    for (const f of abiertas) {
      const o = porCli.get(f.c) || { c: f.c, n: 0, monto: 0, max: 0 };
      o.n++;
      o.monto += v(f);
      o.max = Math.max(o.max, f.dias);
      porCli.set(f.c, o);
    }
    const perdidas = sel.filter((f) => f.e === "perdido" || f.e === "demanda");
    return {
      abiertas,
      monto,
      promPond,
      prom,
      tramos,
      porCli: Array.from(porCli.values()).sort((a, b) => b.monto - a.monto),
      perdidas,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, base]);

  const listaClientes = useMemo(
    () => Array.from(clientes.keys()).sort(),
    [clientes],
  );
  const toggle = (arr: string[], x: string, set: (a: string[]) => void) =>
    set(arr.includes(x) ? arr.filter((y) => y !== x) : [...arr, x]);
  const limpiar = () => {
    setAnoSel([]);
    setDesde("");
    setHasta("");
    setTamSel([]);
    setTipoSel(["Fee", "Publicidad", "Web y otros"]);
    setSoloVivos("");
    setCliSel("");
  };
  const th = (kk: string, label: string) => (
    <th
      onClick={() =>
        setOrden((o) => ({ k: kk, asc: o.k === kk ? !o.asc : false }))
      }
      className="fz-sort"
    >
      {label}
      {orden.k === kk ? (orden.asc ? " ▲" : " ▼") : ""}
    </th>
  );
  const tasaPerdida = k.facturado
    ? ((k.perdido + k.demanda) / k.facturado) * 100
    : 0;

  if (!listo) return <div className="rp-sheet">Cargando…</div>;
  return (
    <div className="rp-sheet fz">
      <div className="rp-header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-color.png" alt="Muller y Pérez" />
        <div className="rp-header-right">
          <div className="rp-client">Bitácora financiera</div>
          <div className="rp-sub">
            Hoja «Facturas» · {filas.length.toLocaleString("es-CL")} facturas ·{" "}
            {nm(mesesTodos[0])} a {nm(ultimoMes)} · actualizado{" "}
            {generado.replace("T", " ")}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="fz-filtros">
        <div className="fz-f">
          <label>Año</label>
          <div className="fz-chips">
            {anos.map((a) => (
              <button
                key={a}
                className={anoSel.includes(a) ? "on" : ""}
                onClick={() => toggle(anoSel, a, setAnoSel)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="fz-f">
          <label>Desde / hasta</label>
          <div className="fz-row">
            <select value={desde} onChange={(e) => setDesde(e.target.value)}>
              <option value="">inicio</option>
              {mesesTodos.map((m) => (
                <option key={m} value={m}>
                  {nm(m)}
                </option>
              ))}
            </select>
            <select value={hasta} onChange={(e) => setHasta(e.target.value)}>
              <option value="">hoy</option>
              {mesesTodos.map((m) => (
                <option key={m} value={m}>
                  {nm(m)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="fz-f">
          <label>Tamaño (fee mensual)</label>
          <div className="fz-chips">
            {TAMANOS.map((t) => (
              <button
                key={t.k}
                title={t.d}
                className={tamSel.includes(t.k) ? "on" : ""}
                onClick={() => toggle(tamSel, t.k, setTamSel)}
              >
                {t.k}
              </button>
            ))}
          </div>
        </div>
        <div className="fz-f">
          <label>Concepto</label>
          <div className="fz-chips">
            {["Fee", "Publicidad", "Web y otros"].map((t) => (
              <button
                key={t}
                className={tipoSel.includes(t) ? "on" : ""}
                onClick={() => toggle(tipoSel, t, setTipoSel)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="fz-f">
          <label>Clientes</label>
          <div className="fz-chips">
            {(
              [
                ["", "Todos"],
                ["vivos", "Vivos hoy"],
                ["bajas", "De baja"],
              ] as const
            ).map(([x, l]) => (
              <button
                key={x}
                className={soloVivos === x ? "on" : ""}
                onClick={() => setSoloVivos(x)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="fz-f">
          <label>Cliente</label>
          <select value={cliSel} onChange={(e) => setCliSel(e.target.value)}>
            <option value="">Todos ({listaClientes.length})</option>
            {listaClientes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="fz-f">
          <label>Montos</label>
          <div className="fz-chips">
            <button
              className={base === "n" ? "on" : ""}
              onClick={() => setBase("n")}
            >
              Neto
            </button>
            <button
              className={base === "tot" ? "on" : ""}
              onClick={() => setBase("tot")}
            >
              Con IVA
            </button>
          </div>
        </div>
        <div className="fz-f">
          <label>&nbsp;</label>
          <button className="rp-btn-link" onClick={limpiar}>
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="fz-kpis">
        <Kpi
          t="Facturado"
          v={mill(k.facturado)}
          s={`${k.meses} meses · promedio ${mill(k.meses ? k.facturado / k.meses : 0)}/mes`}
        />
        <Kpi
          t="Cobrado"
          v={mill(k.cobrado)}
          s={
            k.facturado
              ? ((k.cobrado / k.facturado) * 100).toFixed(1) +
                "% de lo facturado"
              : ""
          }
          c="good"
        />
        <Kpi
          t="Por cobrar"
          v={mill(k.pendiente + k.por_facturar)}
          s={`${atrasos.abiertas.filter((f) => f.e !== "demanda").length} facturas abiertas`}
          c="warn"
        />
        <Kpi
          t="Perdido + en demanda"
          v={mill(k.perdido + k.demanda)}
          s={`${tasaPerdida.toFixed(1)}% de lo facturado · demanda ${mill(k.demanda)}`}
          c="bad"
        />
        <Kpi
          t={`Clientes vivos ${k.mesUlt ? nm(k.mesUlt) : ""}`}
          v={String(k.vivosUlt)}
          s={`${k.clientes} clientes con fee en el período`}
        />
        <Kpi
          t="Permanencia promedio"
          v={k.perm.toFixed(1) + " meses"}
          s="clientes con fee en el período"
        />
        <Kpi
          t="Atraso promedio por cobrar"
          v={Math.round(atrasos.promPond) + " días"}
          s={`sin facturas en demanda · ponderado por monto (simple ${Math.round(atrasos.prom)} días)`}
          c={atrasos.promPond > 45 ? "bad" : "warn"}
        />
      </div>

      <div className="rp-tabs">
        {[
          ["resumen", "Resumen"],
          ["bitacora", "Bitácora año × mes"],
          ["clientes", "Clientes"],
          ["tamano", "Tamaño y permanencia"],
          ["atrasos", "Atrasos y pérdidas"],
          ["detalle", "Detalle de facturas"],
        ].map(([x, l]) => (
          <button
            key={x}
            className={"rp-tab" + (tab === x ? " on" : "")}
            onClick={() => setTab(x)}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "resumen" && (
        <>
          <h3 className="fz-h">Facturación por mes según estado</h3>
          <div className="fz-chart">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={serie}>
                <CartesianGrid
                  strokeDasharray="3 4"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  fontSize={11}
                  interval="preserveStartEnd"
                />
                <YAxis
                  fontSize={11}
                  tickFormatter={(x) => (x / 1e6).toFixed(0) + "M"}
                />
                <Tooltip formatter={(x) => clp(Number(x))} />
                <Legend />
                {Object.entries(ESTADOS).map(([e, s]) => (
                  <Bar
                    key={e}
                    dataKey={e}
                    name={s.n}
                    stackId="a"
                    fill={s.col}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h3 className="fz-h">Clientes vivos, altas y bajas por mes</h3>
          <div className="fz-chart">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={serie}>
                <CartesianGrid
                  strokeDasharray="3 4"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  fontSize={11}
                  interval="preserveStartEnd"
                />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="altas" name="Altas" fill="#10B981" />
                <Bar dataKey="bajas" name="Bajas" fill="#EF4444" />
                <Line
                  dataKey="vivos"
                  name="Clientes vivos"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <h3 className="fz-h">Por año</h3>
          <div className="rp-table-wrap">
            <table className="rp-table fz-t">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Facturado</th>
                  <th>Cobrado</th>
                  <th>Pendiente</th>
                  <th>En demanda</th>
                  <th>Perdido</th>
                  <th>% pérdida</th>
                  <th>Clientes con fee</th>
                  <th>Vivos al cierre</th>
                  <th>Altas</th>
                  <th>Bajas</th>
                  <th>Promedio mensual</th>
                </tr>
              </thead>
              <tbody>
                {porAno.map((a) => {
                  const nMeses = serie.filter((r) =>
                    r.m.startsWith(a.ano),
                  ).length;
                  return (
                    <tr key={a.ano}>
                      <td>
                        <strong>{a.ano}</strong>
                      </td>
                      <td>{clp(a.fact)}</td>
                      <td>{clp(a.cob)}</td>
                      <td>{clp(a.pend)}</td>
                      <td>{clp(a.dem)}</td>
                      <td>{clp(a.per)}</td>
                      <td>
                        {a.fact
                          ? (((a.per + a.dem) / a.fact) * 100).toFixed(1) + "%"
                          : "—"}
                      </td>
                      <td>{a.cli.size}</td>
                      <td>{a.vivosDic}</td>
                      <td>{a.altas}</td>
                      <td>{a.bajas}</td>
                      <td>{clp(nMeses ? a.fact / nMeses : 0)}</td>
                    </tr>
                  );
                })}
                <tr className="fz-tot">
                  <td>Total</td>
                  <td>{clp(k.facturado)}</td>
                  <td>{clp(k.cobrado)}</td>
                  <td>{clp(k.pendiente)}</td>
                  <td>{clp(k.demanda)}</td>
                  <td>{clp(k.perdido)}</td>
                  <td>{tasaPerdida.toFixed(1)}%</td>
                  <td>{k.clientes}</td>
                  <td>{k.vivosUlt}</td>
                  <td>{porAno.reduce((x, a) => x + a.altas, 0)}</td>
                  <td>{porAno.reduce((x, a) => x + a.bajas, 0)}</td>
                  <td>{clp(k.meses ? k.facturado / k.meses : 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "bitacora" && (
        <>
          <p className="fz-nota">
            Cada celda: facturado del mes (arriba) y clientes vivos con fee
            (abajo). Color = % cobrado del mes.
          </p>
          <div className="rp-table-wrap">
            <table className="rp-table fz-t fz-grid">
              <thead>
                <tr>
                  <th>Año</th>
                  {MESES.map((m) => (
                    <th key={m}>{m}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {porAno.map((a) => (
                  <tr key={a.ano}>
                    <td>
                      <strong>{a.ano}</strong>
                    </td>
                    {MESES.map((_, i) => {
                      const r = serie.find(
                        (x) =>
                          x.m === a.ano + "-" + String(i + 1).padStart(2, "0"),
                      );
                      if (!r)
                        return (
                          <td key={i} className="fz-vacio">
                            —
                          </td>
                        );
                      const fact =
                        r.cobrado + r.pendiente + r.demanda + r.perdido;
                      const pc = fact ? r.cobrado / fact : 1;
                      return (
                        <td
                          key={i}
                          className={
                            pc >= 0.999 ? "ok" : pc >= 0.8 ? "mid" : "low"
                          }
                          title={`Cobrado ${clp(r.cobrado)} · Pendiente ${clp(r.pendiente)} · Demanda ${clp(r.demanda)} · Perdido ${clp(r.perdido)}`}
                        >
                          <div className="fz-m">{mill(fact)}</div>
                          <div className="fz-v">{r.vivos} clientes</div>
                        </td>
                      );
                    })}
                    <td>
                      <div className="fz-m">
                        <strong>{mill(a.fact)}</strong>
                      </div>
                      <div className="fz-v">{a.cli.size} clientes</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "clientes" && (
        <>
          <div className="fz-row" style={{ marginBottom: 10 }}>
            <input
              className="fz-busca"
              placeholder="Buscar cliente…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <span className="fz-nota">
              {tablaClientes.length} clientes · clic en el encabezado para
              ordenar
            </span>
          </div>
          <div className="rp-table-wrap">
            <table className="rp-table fz-t">
              <thead>
                <tr>
                  {th("c", "Cliente")}
                  {th("vivo", "Estado")}
                  {th("tam", "Tamaño")}
                  {th("prom", "Fee mensual prom.")}
                  {th("desde", "Desde")}
                  {th("hasta", "Hasta")}
                  {th("meses", "Permanencia")}
                  {th("fact", "Facturado")}
                  {th("cob", "Cobrado")}
                  {th("pend", "Pendiente")}
                  {th("dem", "Demanda")}
                  {th("per", "Perdido")}
                </tr>
              </thead>
              <tbody>
                {tablaClientes.map((o) => (
                  <tr key={o.c}>
                    <td>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCliSel(o.c);
                          setTab("detalle");
                        }}
                      >
                        <strong>{o.c}</strong>
                      </a>
                    </td>
                    <td>
                      {o.meses ? (
                        <span className={"rp-pill " + (o.vivo ? "good" : "no")}>
                          {o.vivo ? "Vivo" : "Baja"}
                        </span>
                      ) : (
                        <span className="rp-pill no">Sin fee</span>
                      )}
                    </td>
                    <td>{o.tam}</td>
                    <td>{o.prom ? clp(o.prom) : "—"}</td>
                    <td>{nm(o.desde)}</td>
                    <td>{o.vivo ? "hoy" : nm(o.hasta)}</td>
                    <td>{o.meses ? o.meses + " m" : "—"}</td>
                    <td>{clp(o.fact)}</td>
                    <td>{clp(o.cob)}</td>
                    <td className={o.pend ? "fz-warn" : ""}>
                      {o.pend ? clp(o.pend) : "—"}
                    </td>
                    <td className={o.dem ? "fz-bad" : ""}>
                      {o.dem ? clp(o.dem) : "—"}
                    </td>
                    <td className={o.per ? "fz-bad" : ""}>
                      {o.per ? clp(o.per) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "tamano" && (
        <>
          <p className="fz-nota">
            Tamaño = fee neto mensual promedio de toda la historia del cliente.
            Permanencia = meses con factura de fee. Si filtras por año, aquí
            cuenta el año de <strong>entrada</strong> del cliente. «Vivo hoy» =
            facturó fee en el último mes o el anterior.
          </p>
          <h3 className="fz-h">Por tamaño</h3>
          <div className="rp-table-wrap">
            <table className="rp-table fz-t">
              <thead>
                <tr>
                  <th>Tamaño</th>
                  <th>Rango fee mensual</th>
                  <th>Clientes</th>
                  <th>Vivos hoy</th>
                  <th>Permanencia promedio</th>
                  <th>Fee mensual promedio</th>
                  <th>Facturado (período)</th>
                </tr>
              </thead>
              <tbody>
                {porTamano.tam.map((t) => (
                  <tr key={t.k}>
                    <td>
                      <strong>{t.k}</strong>
                    </td>
                    <td>{t.d}</td>
                    <td>{t.n}</td>
                    <td>{t.vivos}</td>
                    <td>{t.perm.toFixed(1)} meses</td>
                    <td>{clp(t.prom)}</td>
                    <td>{clp(t.fact)}</td>
                  </tr>
                ))}
                <tr className="fz-tot">
                  <td>Total</td>
                  <td></td>
                  <td>{porTamano.todos.n}</td>
                  <td>{porTamano.todos.vivos}</td>
                  <td>{porTamano.todos.perm.toFixed(1)} meses</td>
                  <td>{clp(porTamano.todos.prom)}</td>
                  <td>{clp(porTamano.todos.fact)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="fz-h">Por año de entrada</h3>
          <div className="rp-table-wrap">
            <table className="rp-table fz-t">
              <thead>
                <tr>
                  <th>Entraron en</th>
                  <th>Clientes nuevos</th>
                  <th>Siguen vivos</th>
                  <th>% retención</th>
                  <th>Permanencia promedio</th>
                  <th>Fee mensual promedio</th>
                </tr>
              </thead>
              <tbody>
                {porTamano.coh.map((t) => (
                  <tr key={t.a}>
                    <td>
                      <strong>{t.a}</strong>
                    </td>
                    <td>{t.n}</td>
                    <td>{t.vivos}</td>
                    <td>
                      {t.n ? ((t.vivos / t.n) * 100).toFixed(0) + "%" : "—"}
                    </td>
                    <td>{t.perm.toFixed(1)} meses</td>
                    <td>{clp(t.prom)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "atrasos" && (
        <>
          <p className="fz-nota">
            Atraso = días desde el último día del mes facturado hasta hoy. La
            hoja no tiene fecha de pago, así que solo se mide en facturas{" "}
            <strong>abiertas</strong> (pendientes, por facturar y en demanda).
            Si se agrega una columna «Fecha pago», también se puede medir el
            atraso histórico de las cobradas.
          </p>
          <div className="fz-kpis">
            <Kpi
              t="Deuda abierta"
              v={mill(atrasos.monto)}
              s={`${atrasos.abiertas.length} facturas`}
              c="warn"
            />
            <Kpi
              t="Atraso promedio"
              v={Math.round(atrasos.promPond) + " días"}
              s="sin demanda · ponderado por monto"
            />
            <Kpi
              t="Perdido histórico"
              v={mill(k.perdido)}
              s="incobrable, castigada, perdida"
              c="bad"
            />
            <Kpi
              t="En demanda"
              v={mill(k.demanda)}
              s="cobranza judicial"
              c="bad"
            />
          </div>
          <h3 className="fz-h">Deuda por antigüedad</h3>
          <div className="rp-table-wrap">
            <table className="rp-table fz-t">
              <thead>
                <tr>
                  <th>Tramo</th>
                  <th>Facturas</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {atrasos.tramos.map((t) => (
                  <tr key={t.k}>
                    <td>{t.k}</td>
                    <td>{t.n}</td>
                    <td>{clp(t.monto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="fz-h">Quién debe</h3>
          <div className="rp-table-wrap">
            <table className="rp-table fz-t">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Facturas abiertas</th>
                  <th>Monto</th>
                  <th>Atraso máximo</th>
                </tr>
              </thead>
              <tbody>
                {atrasos.porCli.map((o) => (
                  <tr key={o.c}>
                    <td>
                      <strong>{o.c}</strong>
                    </td>
                    <td>{o.n}</td>
                    <td>{clp(o.monto)}</td>
                    <td
                      className={
                        o.max > 60 ? "fz-bad" : o.max > 30 ? "fz-warn" : ""
                      }
                    >
                      {o.max} días
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="fz-h">Facturas abiertas</h3>
          <Detalle filas={atrasos.abiertas} v={v} conDias />
          <h3 className="fz-h">Perdidas y en demanda</h3>
          <Detalle filas={atrasos.perdidas} v={v} />
        </>
      )}

      {tab === "detalle" && (
        <>
          <div className="fz-row" style={{ marginBottom: 10 }}>
            <span className="fz-nota">
              {sel.length} facturas con los filtros actuales
              {cliSel ? " · " + cliSel : ""}
            </span>
            {cliSel && (
              <button className="rp-btn-link" onClick={() => setCliSel("")}>
                Quitar cliente
              </button>
            )}
          </div>
          <Detalle
            filas={[...sel].sort((a, b) => (a.m < b.m ? 1 : -1))}
            v={v}
          />
        </>
      )}

      <div className="rp-footer">
        <strong>Muller y Pérez</strong> · Vista interna, solo superadmin ·
        Fuente: «Planilla números M&P», hoja Facturas (sin anuladas ni meses «no
        por este mes»)
      </div>
    </div>
  );
}

function Kpi({ t, v, s, c }: { t: string; v: string; s?: string; c?: string }) {
  return (
    <div className={"fz-kpi " + (c || "")}>
      <div className="fz-kt">{t}</div>
      <div className="fz-kv">{v}</div>
      {s && <div className="fz-ks">{s}</div>}
    </div>
  );
}

function Detalle({
  filas,
  v,
  conDias,
}: {
  filas: (Fila & { dias?: number })[];
  v: (f: Fila) => number;
  conDias?: boolean;
}) {
  const [max, setMax] = useState(200);
  return (
    <div className="rp-table-wrap">
      <table className="rp-table fz-t">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Cliente</th>
            <th>Concepto</th>
            <th>N° factura</th>
            <th>Monto</th>
            <th>Estado</th>
            {conDias && <th>Atraso</th>}
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {filas.slice(0, max).map((f, i) => (
            <tr key={i}>
              <td>{nm(f.m)}</td>
              <td>{f.c}</td>
              <td>{f.t}</td>
              <td>{f.fac || "—"}</td>
              <td>{clp(v(f))}</td>
              <td>
                <span
                  className="fz-dot"
                  style={{ background: ESTADOS[f.e]?.col }}
                />
                {ESTADOS[f.e]?.n || f.e}
                {f.eo &&
                f.eo.toUpperCase() !== "PAGADO" &&
                f.eo.toUpperCase() !== "PENDIENTE PAGO" ? (
                  <span className="fz-eo"> ({f.eo})</span>
                ) : null}
              </td>
              {conDias && <td>{f.dias} días</td>}
              <td className="fz-eo">{f.obs}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filas.length > max && (
        <button
          className="rp-btn-link"
          style={{ margin: 10 }}
          onClick={() => setMax(max + 500)}
        >
          Ver más ({filas.length - max} restantes)
        </button>
      )}
    </div>
  );
}
