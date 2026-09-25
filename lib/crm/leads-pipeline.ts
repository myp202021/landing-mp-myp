/**
 * Pipeline de leads M&P: canales (fuente normalizada), estados y motivos.
 * La columna `fuente` llega con valores heterogéneos según el origen
 * (zapier, lead_magnet, "Meta Ads - Instagram", predictor_v2, ...).
 */

// Cliente "M&P Marketing y Performance" en tabla clientes
export const MP_CLIENTE_ID = "1ecabf3e-27a1-4715-bfa7-eb54b078d7d3";

export type Canal =
  | "zapier"
  | "meta"
  | "google"
  | "lead_magnet"
  | "predictor"
  | "whatsapp"
  | "formulario"
  | "chatbot"
  | "organico"
  | "otro";

export const CANALES: { id: Canal; label: string; color: string }[] = [
  { id: "zapier", label: "Zapier", color: "#f97316" },
  { id: "meta", label: "Meta", color: "#3b82f6" },
  { id: "google", label: "Google", color: "#ef4444" },
  { id: "lead_magnet", label: "Lead Magnet", color: "#a855f7" },
  { id: "predictor", label: "Predictor", color: "#14b8a6" },
  { id: "whatsapp", label: "WhatsApp", color: "#22c55e" },
  { id: "formulario", label: "Formulario web", color: "#64748b" },
  { id: "chatbot", label: "Chatbot", color: "#eab308" },
  { id: "organico", label: "Orgánico", color: "#84cc16" },
  { id: "otro", label: "Otro", color: "#94a3b8" },
];

export const CANAL_MAP = Object.fromEntries(
  CANALES.map((c) => [c.id, c]),
) as Record<Canal, (typeof CANALES)[number]>;

export function canalDeFuente(fuente: string | null | undefined): Canal {
  const f = (fuente || "").toLowerCase();
  if (!f) return "otro";
  if (f === "zapier") return "zapier";
  if (f.includes("whatsapp") || f === "wsp" || f === "wa") return "whatsapp";
  if (f.includes("meta") || f.includes("facebook") || f.includes("instagram"))
    return "meta";
  if (f.includes("google")) return "google";
  if (f.includes("magnet")) return "lead_magnet";
  if (f.includes("predictor")) return "predictor";
  if (f.includes("chatbot")) return "chatbot";
  if (f.includes("organico") || f.includes("orgánico") || f === "seo")
    return "organico";
  if (
    f.includes("formulario") ||
    f.includes("landing") ||
    f.includes("calculadora")
  )
    return "formulario";
  return "otro";
}

// Fuentes disponibles al crear un lead manual (valor guardado en `fuente`)
export const FUENTES_MANUALES: { value: string; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "meta_ads", label: "Meta" },
  { value: "google_ads", label: "Google" },
  { value: "formulario_web", label: "Formulario web" },
  { value: "organico", label: "Orgánico" },
  { value: "email", label: "Email" },
  { value: "referido", label: "Referido" },
];

export type Estado =
  | "nuevo"
  | "contactado"
  | "cotizacion"
  | "vendido"
  | "no_contesta"
  | "desechado";

export const ESTADOS: {
  id: Estado;
  label: string;
  badge: string;
  color: string;
}[] = [
  {
    id: "nuevo",
    label: "Nuevo",
    badge: "bg-sky-100 text-sky-800",
    color: "#0ea5e9",
  },
  {
    id: "contactado",
    label: "Contactado",
    badge: "bg-indigo-100 text-indigo-800",
    color: "#6366f1",
  },
  {
    id: "cotizacion",
    label: "Cotización",
    badge: "bg-amber-100 text-amber-800",
    color: "#f59e0b",
  },
  {
    id: "vendido",
    label: "Vendido",
    badge: "bg-green-100 text-green-800",
    color: "#16a34a",
  },
  {
    id: "no_contesta",
    label: "No contesta",
    badge: "bg-orange-100 text-orange-800",
    color: "#f97316",
  },
  {
    id: "desechado",
    label: "Desechado",
    badge: "bg-gray-200 text-gray-700",
    color: "#6b7280",
  },
];

export const ESTADO_MAP = Object.fromEntries(
  ESTADOS.map((e) => [e.id, e]),
) as Record<Estado, (typeof ESTADOS)[number]>;

export const ESTADOS_VALIDOS = ESTADOS.map((e) => e.id);

// Sugerencias de motivo por estado (el campo es texto libre)
export const MOTIVOS: Partial<Record<Estado, string[]>> = {
  desechado: [
    "Fuera de presupuesto",
    "Persona natural / sin empresa",
    "Busca empleo o práctica",
    "Rubro que no atendemos",
    "No es tomador de decisión",
    "Ya tiene agencia",
    "Datos falsos / spam",
    "Duplicado",
    "Solo estaba cotizando",
  ],
  no_contesta: [
    "No contesta llamada",
    "Se dejó WhatsApp",
    "Se envió email",
    "Número inválido",
  ],
  cotizacion: ["Cotización enviada", "Reunión agendada", "Esperando respuesta"],
  vendido: ["Plan Silver", "Plan Gold", "Plan Platinum", "Servicio puntual"],
};

/** Mantiene los booleanos legacy (usados por /crm admin) alineados con el estado. */
export function booleanosDeEstado(estado: Estado) {
  return {
    contactado: estado !== "nuevo",
    vendido: estado === "vendido",
  };
}
