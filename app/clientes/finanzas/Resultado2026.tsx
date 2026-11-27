"use client";
// Ingresos y gastos 2026 línea por línea, mes a mes (solo Christopher, dentro de /admin-finanzas).
// Datos: reportes-seo/_finanzas/resumen2026.json, generado por ~/facturas-myp/consolidado/resumen2026.py
import { Fragment, useMemo, useState } from "react";

type Linea = { n: string; v: number[]; est?: number[]; nota?: string };
type Bloque = { t: string; filas: Linea[] };
type Mov = {
  f: string;
  t: string;
  d: string;
  m: number;
  c: string;
  x: string;
  q: string;
};
type CC = { f: string; d: string; c: number; a: number };
export type Resumen2026 = {
  generado: string;
  meses: string[];
  ingresos: Linea[];
  bloques: Bloque[];
  impuestos: Linea[];
  movimientos: Mov[];
  ctacte: CC[];
};

const N = 11; // ene-nov
const $ = (n: number) =>
  n
    ? (n < 0 ? "-$" : "$") + Math.round(Math.abs(n)).toLocaleString("es-CL")
    : "–";
const M = (n: number) =>
  "$" + (n / 1e6).toLocaleString("es-CL", { maximumFractionDigits: 1 }) + " MM";
const suma = (v: number[]) => v.slice(0, N).reduce((a, b) => a + (b || 0), 0);
const sumaV = (ls: Linea[]) =>
  Array.from({ length: N }, (_, i) =>
    ls.reduce((a, l) => a + (l.v[i] || 0), 0),
  );
const resta = (a: number[], b: number[]) => a.map((x, i) => x - (b[i] || 0));
const TARJETAS = 6; // los primeros bloques salen de movimientos de tarjeta

export default function Resultado2026({ d }: { d: Resumen2026 }) {
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({});
  const [linea, setLinea] = useState<{ b: string; n: string } | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [tar, setTar] = useState("");
  const [mes, setMes] = useState("");
  const [verPersonal, setVerPersonal] = useState(false);

  const fact = d.ingresos[0]?.v || [];
  const cobr = d.ingresos[1]?.v || [];
  const totB = d.bloques.map((b) => sumaV(b.filas));
  const gastos = Array.from({ length: N }, (_, i) =>
    totB.reduce((a, t) => a + t[i], 0),
  );
  const imp = sumaV(d.impuestos);
  const resOp = resta(fact.slice(0, N), gastos);
  const resCaja = resta(cobr.slice(0, N), gastos);
  const resCajaImp = resta(resCaja, imp);

  const cats = useMemo(
    () => Array.from(new Set(d.movimientos.map((m) => m.c))).sort(),
    [d],
  );
  const movs = useMemo(() => {
    const t = q.toLowerCase();
    return d.movimientos.filter(
      (m) =>
        (verPersonal ||
          cat === "Personal (fuera)" ||
          m.c !== "Personal (fuera)") &&
        (!cat || m.c === cat) &&
        (!tar || m.t === tar) &&
        (!mes || m.f.slice(5, 7) === mes) &&
        (!t || (m.d + " " + m.x).toLowerCase().includes(t)) &&
        (!linea || m.x === linea.n),
    );
  }, [d, q, cat, tar, mes, verPersonal, linea]);

  const Fila = ({
    l,
    b,
    clase,
    click,
  }: {
    l: Linea;
    b?: string;
    clase?: string;
    click?: boolean;
  }) => (
    <tr className={clase}>
      <td
        className={"r26-n" + (click ? " r26-link" : "")}
        title={l.nota || ""}
        onClick={
          click && b
            ? () => {
                setLinea({ b, n: l.n });
                document
                  .getElementById("r26-movs")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            : undefined
        }
      >
        {l.n}
        {l.nota ? <span className="r26-i"> ⓘ</span> : null}
      </td>
      {l.v.slice(0, N).map((x, i) => (
        <td
          key={i}
          className={"r26-v" + (l.est?.includes(i) ? " r26-est" : "")}
        >
          {$(x)}
        </td>
      ))}
      <td className="r26-v r26-t">{$(suma(l.v))}</td>
    </tr>
  );
  const Tot = ({ n, v, clase }: { n: string; v: number[]; clase: string }) => (
    <tr className={clase}>
      <td className="r26-n">{n}</td>
      {v.slice(0, N).map((x, i) => (
        <td key={i} className={"r26-v" + (x < 0 ? " r26-neg" : "")}>
          {$(x)}
        </td>
      ))}
      <td className={"r26-v r26-t" + (suma(v) < 0 ? " r26-neg" : "")}>
        {$(suma(v))}
      </td>
    </tr>
  );

  return (
    <div className="r26">
      <div className="fz-kpis">
        <K t="Facturado neto ene–nov" v={M(suma(fact))} s="sin IVA" />
        <K
          t="Cobrado"
          v={M(suma(cobr))}
          s={"pendiente " + M(suma(fact) - suma(cobr))}
        />
        <K
          t="Gastos de operación"
          v={M(suma(gastos))}
          s={"promedio " + M(suma(gastos) / N) + " al mes"}
        />
        <K
          t="Resultado operación"
          v={M(suma(resOp))}
          c={suma(resOp) < 0 ? "bad" : "good"}
          s="facturado − gastos"
        />
        <K
          t="Caja después de IVA"
          v={M(suma(resCajaImp))}
          c={suma(resCajaImp) < 0 ? "bad" : "good"}
          s={"IVA pagado " + M(suma(imp))}
        />
      </div>
      <p className="fz-nota">
        Cada bloque se abre con un clic. En las líneas de tarjetas, clic en el
        nombre para ver sus movimientos. Amarillo = estimado. ⓘ = nota (pasar el
        mouse). Actualizado {d.generado}.
      </p>

      <div className="rp-table-wrap">
        <table className="rp-table r26-tab">
          <thead>
            <tr>
              <th>Línea</th>
              {d.meses.slice(0, N).map((m) => (
                <th key={m}>{m}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="r26-sec">
              <td colSpan={N + 2}>Ingresos</td>
            </tr>
            {d.ingresos.map((l) => (
              <Fila key={l.n} l={l} />
            ))}
            <tr className="r26-sec">
              <td colSpan={N + 2}>Gastos</td>
            </tr>
            {d.bloques.map((b, k) => (
              <Fragment key={b.t}>
                <tr
                  className="r26-blq"
                  onClick={() => setAbiertos((a) => ({ ...a, [b.t]: !a[b.t] }))}
                >
                  <td className="r26-n">
                    {abiertos[b.t] ? "▾ " : "▸ "}
                    {b.t} <span className="r26-c">({b.filas.length})</span>
                  </td>
                  {totB[k].map((x, i) => (
                    <td key={i} className="r26-v">
                      {$(x)}
                    </td>
                  ))}
                  <td className="r26-v r26-t">{$(suma(totB[k]))}</td>
                </tr>
                {abiertos[b.t] &&
                  b.filas.map((l) => (
                    <Fila
                      key={l.n}
                      l={l}
                      b={b.t}
                      clase="r26-sub"
                      click={k < TARJETAS}
                    />
                  ))}
              </Fragment>
            ))}
            <Tot n="TOTAL GASTOS DE OPERACIÓN" v={gastos} clase="r26-total" />
            <tr className="r26-sec">
              <td colSpan={N + 2}>
                Impuestos pagados al SII (aparte; el ingreso ya es sin IVA)
              </td>
            </tr>
            {d.impuestos.map((l) => (
              <Fila key={l.n} l={l} />
            ))}
            <tr className="r26-sec">
              <td colSpan={N + 2}>Resultado</td>
            </tr>
            <Tot
              n="Resultado operación (facturado − gastos)"
              v={resOp}
              clase="r26-res"
            />
            <Tot
              n="Resultado de caja (cobrado − gastos)"
              v={resCaja}
              clase="r26-res"
            />
            <Tot
              n="Caja después de impuestos (− IVA)"
              v={resCajaImp}
              clase="r26-res"
            />
          </tbody>
        </table>
      </div>

      <h3 className="fz-h" id="r26-movs">
        Movimientos de tarjetas (1777, 7960 y Tenpo)
        {linea ? ` · ${linea.n}` : ""}
        {linea && (
          <button className="r26-x" onClick={() => setLinea(null)}>
            quitar filtro ✕
          </button>
        )}
      </h3>
      <div className="fz-filtros">
        <div className="fz-f">
          <label>Buscar</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="comercio o detalle"
          />
        </div>
        <div className="fz-f">
          <label>Categoría</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">Todas las de empresa</option>
            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="fz-f">
          <label>Tarjeta</label>
          <select value={tar} onChange={(e) => setTar(e.target.value)}>
            <option value="">Todas</option>
            <option>1777</option>
            <option>7960</option>
            <option value="tenpo">Tenpo</option>
          </select>
        </div>
        <div className="fz-f">
          <label>Mes</label>
          <select value={mes} onChange={(e) => setMes(e.target.value)}>
            <option value="">Todos</option>
            {d.meses.slice(0, N).map((m, i) => (
              <option key={m} value={String(i + 1).padStart(2, "0")}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="fz-f">
          <label>Personales</label>
          <label className="r26-chk">
            <input
              type="checkbox"
              checked={verPersonal}
              onChange={(e) => setVerPersonal(e.target.checked)}
            />{" "}
            mostrar (no cuentan)
          </label>
        </div>
      </div>
      <p className="fz-nota">
        {movs.length} movimientos · suma{" "}
        {$(
          movs
            .filter(
              (m) =>
                m.c !== "Personal (fuera)" && m.c !== "No es gasto de tarjeta",
            )
            .reduce((a, m) => a + m.m, 0),
        )}
      </p>
      <div className="rp-table-wrap r26-scroll">
        <table className="rp-table r26-mov">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tarjeta</th>
              <th>Comercio</th>
              <th>Cuota</th>
              <th>Categoría</th>
              <th>Línea</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {movs.slice(0, 600).map((m, i) => (
              <tr
                key={i}
                className={
                  m.c === "Personal (fuera)" || m.c === "No es gasto de tarjeta"
                    ? "r26-pers"
                    : ""
                }
              >
                <td>{m.f}</td>
                <td>{m.t}</td>
                <td>{m.d}</td>
                <td>{m.q}</td>
                <td>{m.c}</td>
                <td>{m.x}</td>
                <td className="r26-v">{$(m.m)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CtaCte cc={d.ctacte} meses={d.meses} />
    </div>
  );
}

function CtaCte({ cc, meses }: { cc: CC[]; meses: string[] }) {
  const [q, setQ] = useState("");
  const pers = useMemo(() => {
    const m: Record<string, number[]> = {};
    cc.forEach((x) => {
      const r = x.d.match(/Transf a (.+)/);
      if (r && x.c) {
        const k = r[1].trim();
        (m[k] ||= Array(N).fill(0))[+x.f.slice(5, 7) - 1] += x.c;
      }
    });
    return Object.entries(m).sort((a, b) => suma(b[1]) - suma(a[1]));
  }, [cc]);
  const lista = cc.filter(
    (x) => !q || x.d.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <h3 className="fz-h">
        Cuenta corriente empresa · transferencias por persona (cartolas ene–nov)
      </h3>
      <div className="rp-table-wrap">
        <table className="rp-table r26-tab">
          <thead>
            <tr>
              <th>Destinatario</th>
              {meses.slice(0, N).map((m) => (
                <th key={m}>{m}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {pers.map(([k, v]) => (
              <tr key={k}>
                <td className="r26-n">{k}</td>
                {v.map((x, i) => (
                  <td key={i} className="r26-v">
                    {$(x)}
                  </td>
                ))}
                <td className="r26-v r26-t">{$(suma(v))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="fz-h">Cuenta corriente · todos los movimientos</h3>
      <div className="fz-filtros">
        <div className="fz-f">
          <label>Buscar</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="SII, Previred, nombre…"
          />
        </div>
      </div>
      <p className="fz-nota">
        {lista.length} movimientos · cargos{" "}
        {$(lista.reduce((a, x) => a + x.c, 0))} · abonos{" "}
        {$(lista.reduce((a, x) => a + x.a, 0))}
      </p>
      <div className="rp-table-wrap r26-scroll">
        <table className="rp-table r26-mov">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Cargo</th>
              <th>Abono</th>
            </tr>
          </thead>
          <tbody>
            {lista.slice(0, 1000).map((x, i) => (
              <tr key={i}>
                <td>{x.f}</td>
                <td>{x.d}</td>
                <td className="r26-v">{x.c ? $(x.c) : ""}</td>
                <td className="r26-v">{x.a ? $(x.a) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function K({ t, v, s, c }: { t: string; v: string; s?: string; c?: string }) {
  return (
    <div className={"fz-kpi " + (c || "")}>
      <div className="fz-kt">{t}</div>
      <div className="fz-kv">{v}</div>
      {s && <div className="fz-ks">{s}</div>}
    </div>
  );
}
