"use client";

/**
 * LEADS M&P - Pipeline de leads propios de M&P
 * Vista principal de Arturo (rol equipo); admin también puede entrar.
 * Resumen por fuente/estado/período + gestión de estado, motivo y datos.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import EquipoNav from "@/app/components/crm/EquipoNav";
import AuthGuard from "@/app/components/crm/AuthGuard";
import { useSimpleAuth } from "@/lib/auth/simple-auth";
import {
  CANALES,
  CANAL_MAP,
  ESTADOS,
  ESTADO_MAP,
  MP_CLIENTE_ID,
  canalDeLead,
  detalleOrigen,
  type Canal,
  type Estado,
} from "@/lib/crm/leads-pipeline";
import {
  type Lead,
  type Agrupacion,
  fechaLocal,
  nombreCompleto,
  empresaDe,
} from "@/app/components/crm/leads/types";
import { whatsappUrl } from "@/app/components/crm/leads/types";
import LeadsResumen from "@/app/components/crm/leads/LeadsResumen";
import LeadDrawer from "@/app/components/crm/leads/LeadDrawer";
import NuevoLeadModal from "@/app/components/crm/leads/NuevoLeadModal";

type Rango =
  | "7d"
  | "30d"
  | "mes"
  | "mes_ant"
  | "90d"
  | "anio"
  | "todo"
  | "custom";

const RANGOS: { id: Rango; label: string }[] = [
  { id: "7d", label: "7 días" },
  { id: "30d", label: "30 días" },
  { id: "mes", label: "Este mes" },
  { id: "mes_ant", label: "Mes anterior" },
  { id: "90d", label: "90 días" },
  { id: "anio", label: "Este año" },
  { id: "todo", label: "Todo" },
  { id: "custom", label: "Personalizado" },
];

const AGRUPACIONES: { id: Agrupacion; label: string }[] = [
  { id: "dia", label: "Día" },
  { id: "semana", label: "Semana" },
  { id: "mes", label: "Mes" },
];

const PAGE_SIZE = 100;

function rangoFechas(
  rango: Rango,
  desde: string,
  hasta: string,
): [string, string] {
  const hoy = fechaLocal(new Date().toISOString());
  const menos = (dias: number) => {
    const d = new Date(`${hoy}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - dias);
    return d.toISOString().slice(0, 10);
  };
  switch (rango) {
    case "7d":
      return [menos(6), hoy];
    case "30d":
      return [menos(29), hoy];
    case "90d":
      return [menos(89), hoy];
    case "mes":
      return [`${hoy.slice(0, 7)}-01`, hoy];
    case "mes_ant": {
      const d = new Date(`${hoy.slice(0, 7)}-01T12:00:00Z`);
      d.setUTCDate(0); // último día del mes anterior
      const fin = d.toISOString().slice(0, 10);
      return [`${fin.slice(0, 7)}-01`, fin];
    }
    case "anio":
      return [`${hoy.slice(0, 4)}-01-01`, hoy];
    case "custom":
      return [desde || "0000-01-01", hasta || "9999-12-31"];
    default:
      return ["0000-01-01", "9999-12-31"];
  }
}

function descargarCSV(leads: Lead[]) {
  const cols: [string, (l: Lead) => unknown][] = [
    ["ID", (l) => l.id],
    ["Fecha", (l) => fechaLocal(l.fecha_ingreso)],
    ["Fuente", (l) => CANAL_MAP[canalDeLead(l)].label],
    ["Fuente original", (l) => l.fuente],
    ["Nombre", (l) => nombreCompleto(l)],
    ["Empresa", (l) => empresaDe(l)],
    ["Email", (l) => l.email],
    ["Teléfono", (l) => l.telefono],
    ["Estado", (l) => ESTADO_MAP[l.estado]?.label],
    ["Motivo", (l) => l.razon_no_venta],
    ["Notas", (l) => l.notas],
    ["Observaciones", (l) => l.observaciones],
  ];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    cols.map((c) => esc(c[0])).join(","),
    ...leads.map((l) => cols.map((c) => esc(c[1](l))).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-myp-${fechaLocal(new Date().toISOString())}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsPage() {
  return (
    <AuthGuard>
      <LeadsMP />
    </AuthGuard>
  )
}

function LeadsMP() {
  const { user } = useSimpleAuth();
  const usuario = user?.nombre || user?.username || "Equipo";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<"dashboard" | "leads">(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab") === "dashboard"
      ? "dashboard"
      : "leads",
  );
  const cambiarTab = (t: "dashboard" | "leads") => {
    setTab(t);
    try {
      window.history.replaceState(null, "", t === "dashboard" ? "?tab=dashboard" : window.location.pathname);
    } catch {}
  };
  const [rango, setRango] = useState<Rango>("todo");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [agrupacion, setAgrupacion] = useState<Agrupacion>("mes");
  const [canales, setCanales] = useState<Set<Canal>>(new Set());
  const [estados, setEstados] = useState<Set<Estado>>(new Set());
  const [search, setSearch] = useState("");
  const [visibles, setVisibles] = useState(PAGE_SIZE);

  const [abierto, setAbierto] = useState<Lead | null>(null);
  const [nuevo, setNuevo] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/crm/leads?cliente_id=${MP_CLIENTE_ID}&limit=20000`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);
      setLeads(
        (data.leads || []).map((l: Lead) => ({
          ...l,
          estado: l.estado || (l.vendido ? "vendido" : l.contactado ? "contactado" : "nuevo"),
        })),
      );
    } catch (e: any) {
      setError(e.message || "Error cargando leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    setVisibles(PAGE_SIZE);
  }, [rango, desde, hasta, canales, estados, search]);

  // Filtros de período y fuente aplican a resumen y lista
  const enPeriodo = useMemo(() => {
    const [d, h] = rangoFechas(rango, desde, hasta);
    return leads.filter((l) => {
      const f = fechaLocal(l.fecha_ingreso);
      if (f < d || f > h) return false;
      if (canales.size && !canales.has(canalDeLead(l))) return false;
      return true;
    });
  }, [leads, rango, desde, hasta, canales]);

  // Estado y búsqueda solo aplican a la lista
  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enPeriodo.filter((l) => {
      if (estados.size && !estados.has(l.estado)) return false;
      if (!q) return true;
      return [
        l.nombre,
        l.apellido,
        l.empresa,
        l.nombre_empresa,
        l.email,
        l.telefono,
        l.notas,
        l.razon_no_venta,
      ].some((v) => v?.toLowerCase().includes(q));
    });
  }, [enPeriodo, estados, search]);

  const toggle = <T,>(set: Set<T>, v: T) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    return n;
  };

  const actualizarLocal = (lead: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, ...lead } : l)),
    );
  };

  const cambiarEstado = async (lead: Lead, estado: Estado) => {
    const previo = lead;
    const optimista = { ...lead, estado, razon_no_venta: null };
    actualizarLocal(optimista);
    try {
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.id,
          estado,
          razon_no_venta: null,
          _usuario: usuario,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);
      actualizarLocal(data.lead);
      // Pedir motivo en la ficha
      if (
        estado === "desechado" || estado === "no_contesta"
      )
        setAbierto(data.lead);
    } catch (e: any) {
      actualizarLocal(previo);
      alert(`No se pudo cambiar el estado: ${e.message}`);
    }
  };

  const irALista = (f: { canal?: Canal; estado?: Estado }) => {
    if (f.canal) setCanales(new Set([f.canal]));
    if (f.estado) setEstados(new Set([f.estado]));
    cambiarTab("leads");
  };

  const hayFiltros = canales.size > 0 || estados.size > 0 || search !== "";
  const limpiar = () => {
    setCanales(new Set());
    setEstados(new Set());
    setSearch("");
  };

  const pill = (activo: boolean) =>
    `px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
      activo
        ? "bg-gray-900 text-white border-gray-900"
        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <EquipoNav />
      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-5 md:p-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              {user?.role === "admin" && (
                <Link
                  href="/crm"
                  className="text-xs text-blue-600 hover:underline"
                >
                  ← CRM Admin
                </Link>
              )}
              <h1 className="text-2xl font-bold text-gray-900">Leads M&P</h1>
              <p className="text-sm text-gray-500">
                {loading
                  ? "Cargando…"
                  : `${leads.length} leads en total · ${enPeriodo.length} en el período`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => descargarCSV(filtrados)}
                className="px-3 py-2 rounded text-sm border border-gray-300 hover:bg-gray-50"
              >
                Exportar CSV
              </button>
              <button
                onClick={() => setNuevo(true)}
                className="px-3 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                + Agregar lead
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-3 mb-5 border-b border-gray-200 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 w-16">
                Período
              </span>
              {RANGOS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRango(r.id)}
                  className={pill(rango === r.id)}
                >
                  {r.label}
                </button>
              ))}
              {rango === "custom" && (
                <span className="flex items-center gap-1">
                  <input
                    type="date"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                  <span className="text-xs text-gray-400">a</span>
                  <input
                    type="date"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </span>
              )}
            </div>
            {tab === "dashboard" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 w-16">
                Ver por
              </span>
              {AGRUPACIONES.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAgrupacion(a.id)}
                  className={pill(agrupacion === a.id)}
                >
                  {a.label}
                </button>
              ))}
            </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 w-16">
                Fuente
              </span>
              {CANALES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCanales((s) => toggle(s, c.id))}
                  className={pill(canales.has(c.id))}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                    style={{ background: c.color }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
            {hayFiltros && (
              <button
                onClick={limpiar}
                className="text-xs text-blue-600 hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-5 border-b border-gray-200">
            {(["leads", "dashboard"] as const).map((t) => (
              <button
                key={t}
                onClick={() => cambiarTab(t)}
                className={`-mb-px pb-3 text-base font-semibold border-b-2 ${tab === t ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
              >
                {t === "dashboard" ? "Dashboard" : `Leads (${filtrados.length})`}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded p-3 mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Cargando leads…
            </div>
          ) : tab === "dashboard" ? (
            <LeadsResumen
              leads={enPeriodo}
              agrupacion={agrupacion}
              onFiltrar={irALista}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
                <button
                  onClick={() => setEstados(new Set())}
                  className={`rounded-lg p-3 text-left bg-slate-900 text-white ${estados.size === 0 ? "ring-2 ring-offset-1 ring-slate-400" : "opacity-80 hover:opacity-100"}`}
                >
                  <p className="text-xs opacity-80">Total leads</p>
                  <p className="text-2xl font-bold tabular-nums">{enPeriodo.length}</p>
                </button>
                {ESTADOS.map((e) => {
                  const n = enPeriodo.filter((l) => l.estado === e.id).length;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setEstados((s) => toggle(s, e.id))}
                      className={`rounded-lg p-3 text-left ${e.badge} ${estados.has(e.id) ? "ring-2 ring-offset-1 ring-gray-500" : "hover:ring-1 hover:ring-gray-300"}`}
                    >
                      <p className="text-xs font-medium opacity-80">{e.id === "nuevo" ? "Sin contactar" : e.label}</p>
                      <p className="text-2xl font-bold tabular-nums">{n}</p>
                      <p className="text-[11px] opacity-70 tabular-nums">
                        {enPeriodo.length ? `${((n / enPeriodo.length) * 100).toFixed(1)}%` : "—"}
                      </p>
                    </button>
                  );
                })}
              </div>
              <div className="mb-4">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar nombre, empresa, email, teléfono, notas…"
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-96"
                />
              </div>

              {filtrados.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  No hay leads con estos filtros.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
                      <tr>
                        <th className="px-3 py-2 text-left">Fecha</th>
                        <th className="px-3 py-2 text-left">Fuente</th>
                        <th className="px-3 py-2 text-left">Nombre / empresa</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Teléfono</th>
                        <th className="px-3 py-2 text-left">Estado</th>
                        <th className="px-3 py-2 text-left">Motivo / notas</th>
                        <th className="px-3 py-2 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtrados.slice(0, visibles).map((lead) => {
                        const canal = CANAL_MAP[canalDeLead(lead)];
                        const est = ESTADO_MAP[lead.estado];
                        return (
                          <tr
                            key={lead.id}
                            className="hover:bg-blue-50/40 cursor-pointer"
                            onClick={() => setAbierto(lead)}
                          >
                            <td className="px-3 py-2 text-xs text-gray-600 whitespace-nowrap">
                              {new Date(lead.fecha_ingreso).toLocaleDateString(
                                "es-CL",
                                {
                                  timeZone: "America/Santiago",
                                  day: "2-digit",
                                  month: "short",
                                  year: "2-digit",
                                },
                              )}
                              <div className="text-[10px] text-gray-400">#{lead.id}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                                style={{ background: canal.color }}
                                title={lead.fuente || ""}
                              >
                                {canal.label}
                              </span>
                              {detalleOrigen(lead) && (
                                <div className="text-[11px] text-gray-500 mt-1 max-w-[180px] truncate" title={detalleOrigen(lead) || ""}>
                                  {detalleOrigen(lead)}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-medium text-gray-900">
                                {nombreCompleto(lead)}
                              </div>
                              {empresaDe(lead) && (
                                <div className="text-xs text-gray-500">
                                  {empresaDe(lead)}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-700 max-w-[190px] truncate">
                              {lead.email || "—"}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-700 whitespace-nowrap">
                              {lead.telefono || "—"}
                            </td>
                            <td
                              className="px-3 py-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <select
                                value={lead.estado}
                                onChange={(e) =>
                                  cambiarEstado(lead, e.target.value as Estado)
                                }
                                className={`text-xs font-medium rounded px-2 py-1 border-0 ${est?.badge || ""}`}
                              >
                                {ESTADOS.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 max-w-[180px]">
                              {lead.razon_no_venta && (
                                <div className="font-medium text-gray-800">
                                  {lead.razon_no_venta}
                                </div>
                              )}
                              {lead.notas && (
                                <div className="truncate">{lead.notas}</div>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setAbierto(lead)}
                                  className="px-2 py-1 rounded text-xs bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  Ver
                                </button>
                                {whatsappUrl(lead.telefono) && (
                                  <a
                                    href={whatsappUrl(lead.telefono)!}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-1 rounded text-xs bg-green-600 text-white hover:bg-green-700"
                                  >
                                    WhatsApp
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filtrados.length > visibles && (
                    <div className="text-center py-4">
                      <button
                        onClick={() => setVisibles((v) => v + PAGE_SIZE)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Ver más ({filtrados.length - visibles} restantes)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {abierto && (
        <LeadDrawer
          lead={abierto}
          usuario={usuario}
          onClose={() => setAbierto(null)}
          onSaved={actualizarLocal}
          onDeleted={(id) =>
            setLeads((prev) => prev.filter((l) => l.id !== id))
          }
        />
      )}
      {nuevo && (
        <NuevoLeadModal
          onClose={() => setNuevo(false)}
          onCreated={(lead) =>
            setLeads((prev) => [
              { ...lead, estado: lead.estado || "nuevo" },
              ...prev,
            ])
          }
        />
      )}
    </div>
  );
}
