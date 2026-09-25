"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ESTADOS,
  ESTADO_MAP,
  MOTIVOS,
  CANAL_MAP,
  canalDeLead,
  type Estado,
} from "@/lib/crm/leads-pipeline";
import { type Lead, nombreCompleto, empresaDe, whatsappUrl } from "./types";

interface Historial {
  id: number;
  usuario: string;
  accion: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  descripcion: string | null;
  created_at: string;
}

interface Props {
  lead: Lead;
  usuario: string;
  onClose: () => void;
  onSaved: (lead: Lead) => void;
  onDeleted: (id: number) => void;
}

const CAMPOS_CONTACTO: { key: keyof Lead; label: string; type?: string }[] = [
  { key: "nombre", label: "Nombre" },
  { key: "apellido", label: "Apellido" },
  { key: "empresa", label: "Empresa" },
  { key: "email", label: "Email", type: "email" },
  { key: "telefono", label: "Teléfono", type: "tel" },
  { key: "ciudad", label: "Ciudad" },
  { key: "presupuesto", label: "Presupuesto" },
  { key: "servicio", label: "Servicio de interés" },
];


export default function LeadDrawer({
  lead,
  usuario,
  onClose,
  onSaved,
  onDeleted,
}: Props) {
  const [form, setForm] = useState(() => ({
    ...lead,
    empresa: empresaDe(lead),
  }));
  const [saving, setSaving] = useState(false);
  const [historial, setHistorial] = useState<Historial[]>([]);

  useEffect(() => {
    setForm({ ...lead, empresa: empresaDe(lead) });
    fetch(`/api/crm/leads/historial?lead_id=${lead.id}`)
      .then((r) => r.json())
      .then((d) => setHistorial(d.historial || []))
      .catch(() => setHistorial([]));
  }, [lead]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (key: keyof Lead, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setEstado = (estado: Estado) => {
    // El motivo es propio de cada estado: al cambiar, limpiar si no aplica
    setForm((f) => ({
      ...f,
      estado,
      razon_no_venta: estado === lead.estado ? lead.razon_no_venta : null,
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        id: lead.id,
        _usuario: usuario,
        estado: form.estado,
        razon_no_venta: form.razon_no_venta?.trim() || null,
        notas: form.notas?.trim() || null,
        nombre: form.nombre?.trim() || null,
        apellido: form.apellido?.trim() || null,
        empresa: form.empresa?.trim() || null,
        nombre_empresa: form.empresa?.trim() || null,
        email: form.email?.trim() || null,
        telefono: form.telefono?.trim() || null,
        ciudad: form.ciudad?.trim() || null,
        presupuesto: form.presupuesto?.trim() || null,
        servicio: form.servicio?.trim() || null,
      };
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.details || data.error || "Error guardando");
      onSaved(data.lead);
      onClose();
    } catch (e: any) {
      alert(`No se pudo guardar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (
      !confirm(
        `¿Eliminar el lead de ${nombreCompleto(lead)}? No se puede deshacer.`,
      )
    )
      return;
    const res = await fetch(`/api/crm/leads?id=${lead.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onDeleted(lead.id);
      onClose();
    } else {
      alert("Error eliminando lead");
    }
  };

  const canal = CANAL_MAP[canalDeLead(lead)];
  const wa = whatsappUrl(form.telefono);
  const motivos = MOTIVOS[form.estado] || [];
  const pideMotivo =
    form.estado === "desechado" || form.estado === "no_contesta";

  const origen: [string, string | null][] = [
    [
      "Fuente",
      `${canal.label}${lead.fuente && lead.fuente !== canal.label ? ` (${lead.fuente})` : ""}`,
    ],
    [
      "Ingreso",
      new Date(lead.fecha_ingreso).toLocaleString("es-CL", {
        timeZone: "America/Santiago",
      }),
    ],
    ["Formulario", lead.form_nombre],
    ["Campaña", lead.campana_nombre],
    ["Conjunto", lead.adset_nombre],
    ["Anuncio", lead.ad_nombre],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="relative w-full max-w-xl h-full bg-white shadow-xl overflow-y-auto">
        <header className="sticky top-0 bg-white border-b px-5 py-4 flex items-start justify-between gap-3 z-10">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                style={{ background: canal.color }}
              >
                {canal.label}
              </span>
              Lead #{lead.id} ·{" "}
              {new Date(lead.fecha_ingreso).toLocaleDateString("es-CL", {
                timeZone: "America/Santiago",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {nombreCompleto(lead)}
            </h2>
            {empresaDe(lead) && (
              <p className="text-sm text-gray-600 truncate">
                {empresaDe(lead)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <div className="p-5 space-y-6">
          {/* Acciones rápidas */}
          <div className="flex flex-wrap gap-2">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-green-600 text-white text-sm hover:bg-green-700"
              >
                WhatsApp
              </a>
            )}
            {form.telefono && (
              <a
                href={`tel:${form.telefono}`}
                className="px-3 py-1.5 rounded bg-gray-100 text-gray-800 text-sm hover:bg-gray-200"
              >
                Llamar
              </a>
            )}
            {form.email && (
              <a
                href={`mailto:${form.email}`}
                className="px-3 py-1.5 rounded bg-gray-100 text-gray-800 text-sm hover:bg-gray-200"
              >
                Email
              </a>
            )}
            <Link
              href={`/crm/cotizar/${lead.id}`}
              className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Cotizar
            </Link>
          </div>

          {/* Estado */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Estado</h3>
            <div className="grid grid-cols-3 gap-2">
              {ESTADOS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEstado(e.id)}
                  className={`px-2 py-2 rounded text-sm font-medium border ${
                    form.estado === e.id
                      ? `${e.badge} border-transparent ring-2 ring-offset-1 ring-gray-400`
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>

            <label className="block mt-3">
              <span className="text-xs text-gray-600">
                Motivo{" "}
                {pideMotivo && (
                  <span className="text-amber-700">(recomendado)</span>
                )}
              </span>
              <input
                list={`motivos-${form.estado}`}
                value={form.razon_no_venta || ""}
                onChange={(e) => set("razon_no_venta", e.target.value)}
                placeholder={motivos.length ? "Elegir o escribir…" : "Opcional"}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <datalist id={`motivos-${form.estado}`}>
                {motivos.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </label>
            {motivos.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {motivos.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => set("razon_no_venta", m)}
                    className={`text-xs px-2 py-1 rounded-full border ${form.razon_no_venta === m ? "bg-gray-800 text-white border-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            <label className="block mt-3">
              <span className="text-xs text-gray-600">
                Notas de seguimiento
              </span>
              <textarea
                rows={3}
                value={form.notas || ""}
                onChange={(e) => set("notas", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </label>
          </section>

          {/* Datos del contacto */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Datos del contacto
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {CAMPOS_CONTACTO.map((c) => (
                <label key={c.key} className="block">
                  <span className="text-xs text-gray-600">{c.label}</span>
                  <input
                    type={c.type || "text"}
                    value={(form[c.key] as string) || ""}
                    onChange={(e) => set(c.key, e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Lo que dejó el lead */}
          {(lead.mensaje || lead.observaciones) && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Información del formulario
              </h3>
              <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap space-y-2">
                {lead.mensaje && <p>{lead.mensaje}</p>}
                {lead.observaciones && <p>{lead.observaciones}</p>}
              </div>
            </section>
          )}

          {/* Origen */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Origen</h3>
            <dl className="grid grid-cols-[110px_1fr] gap-y-1 text-sm">
              {origen
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="text-gray-800 break-words">{v}</dd>
                  </div>
                ))}
            </dl>
          </section>

          {/* Historial */}
          {historial.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Historial
              </h3>
              <ul className="space-y-1.5 text-sm">
                {historial.map((h) => (
                  <li key={h.id} className="text-gray-700">
                    <span className="text-xs text-gray-500 mr-2">
                      {new Date(h.created_at).toLocaleString("es-CL", {
                        timeZone: "America/Santiago",
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                    <span className="font-medium">{h.usuario}</span>{" "}
                    {h.accion === "estado" ? (
                      <>
                        cambió a{" "}
                        <b>
                          {ESTADO_MAP[h.valor_nuevo as Estado]?.label ||
                            h.valor_nuevo}
                        </b>
                        {h.descripcion
                          ? ` · ${h.descripcion.replace(/^Motivo: /, "")}`
                          : ""}
                      </>
                    ) : (
                      h.descripcion
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <footer className="sticky bottom-0 bg-white border-t px-5 py-3 flex items-center justify-between">
          <button
            onClick={remove}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Eliminar lead
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="px-4 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
