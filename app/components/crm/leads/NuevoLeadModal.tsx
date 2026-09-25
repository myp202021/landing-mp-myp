"use client";

import { useState } from "react";
import {
  ESTADOS,
  FUENTES_MANUALES,
  MP_CLIENTE_ID,
  type Estado,
} from "@/lib/crm/leads-pipeline";
import type { Lead } from "./types";

interface Props {
  onClose: () => void;
  onCreated: (lead: Lead) => void;
}

export default function NuevoLeadModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
    fuente: "whatsapp",
    mensaje: "",
    estado: "nuevo" as Estado,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre && !form.email && !form.telefono) {
      alert("Ingresa al menos nombre, email o teléfono");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cliente_id: MP_CLIENTE_ID }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);
      onCreated(data.lead);
      onClose();
    } catch (err: any) {
      alert(`No se pudo crear: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const input = "mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-5 space-y-3"
      >
        <h2 className="text-lg font-bold text-gray-900">Agregar lead</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-gray-600">Fuente</span>
            <select
              value={form.fuente}
              onChange={(e) => set("fuente", e.target.value)}
              className={input}
            >
              {FUENTES_MANUALES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-gray-600">Estado inicial</span>
            <select
              value={form.estado}
              onChange={(e) => set("estado", e.target.value)}
              className={input}
            >
              {ESTADOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-gray-600">Nombre</span>
            <input
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              className={input}
              autoFocus
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-600">Apellido</span>
            <input
              value={form.apellido}
              onChange={(e) => set("apellido", e.target.value)}
              className={input}
            />
          </label>
          <label className="block col-span-2">
            <span className="text-xs text-gray-600">Empresa</span>
            <input
              value={form.empresa}
              onChange={(e) => set("empresa", e.target.value)}
              className={input}
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-600">Teléfono</span>
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => set("telefono", e.target.value)}
              className={input}
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-600">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={input}
            />
          </label>
          <label className="block col-span-2">
            <span className="text-xs text-gray-600">
              Mensaje / qué necesita
            </span>
            <textarea
              rows={3}
              value={form.mensaje}
              onChange={(e) => set("mensaje", e.target.value)}
              className={input}
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Agregar"}
          </button>
        </div>
      </form>
    </div>
  );
}
