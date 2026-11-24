// Visibilidad en IA (24 nov 2026): producto autoservicio de M&P.
// Mide si ChatGPT (OpenAI + búsqueda web) recomienda a una empresa en preguntas de recomendación de su rubro y ciudad.
// Datos en Supabase Storage, bucket privado «visibilidad-ia» (sin tablas nuevas). Cobro con Flow (suscripción mensual en CLP).
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const BUCKET = "visibilidad-ia";
export const PLANES = {
  basico: {
    planId: "VISIBILIDAD-IA-BASICO",
    nombre: "Básico",
    precio: 9990,
    preguntas: 10,
    frecuencia: "mensual",
    dias: 30,
    competidores: 0,
  },
  pro: {
    planId: "VISIBILIDAD-IA-PRO",
    nombre: "Pro",
    precio: 49990,
    preguntas: 30,
    frecuencia: "semanal",
    dias: 7,
    competidores: 3,
  },
  agente: {
    planId: "VISIBILIDAD-IA-AGENTE",
    nombre: "Pro + agente",
    precio: 99990,
    preguntas: 30,
    frecuencia: "semanal",
    dias: 7,
    competidores: 3,
  },
} as const;
export type PlanKey = keyof typeof PLANES;

export const sb = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

export async function leerJson<T>(ruta: string): Promise<T | null> {
  const { data } = await sb().storage.from(BUCKET).download(ruta);
  if (!data) return null;
  try {
    return JSON.parse(await data.text()) as T;
  } catch {
    return null;
  }
}
export async function guardarJson(ruta: string, obj: unknown) {
  const s = sb();
  let r = await s.storage
    .from(BUCKET)
    .upload(ruta, JSON.stringify(obj), {
      upsert: true,
      contentType: "application/json",
    });
  if (r.error && /not found/i.test(r.error.message)) {
    await s.storage.createBucket(BUCKET, { public: false });
    r = await s.storage
      .from(BUCKET)
      .upload(ruta, JSON.stringify(obj), {
        upsert: true,
        contentType: "application/json",
      });
  }
  if (r.error) throw new Error("storage: " + r.error.message);
}
export async function listar(carpeta: string) {
  const { data } = await sb()
    .storage.from(BUCKET)
    .list(carpeta, { limit: 1000 });
  return (data || [])
    .filter((f) => f.name.endsWith(".json"))
    .map((f) => carpeta + "/" + f.name);
}

export const idEmail = (email: string) =>
  crypto
    .createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 24);
export const hoyCL = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Santiago" });
export function dominio(url: string) {
  try {
    return new URL(/^https?:/i.test(url) ? url : "https://" + url).hostname
      .replace(/^www\./, "")
      .toLowerCase();
  } catch {
    return "";
  }
}
const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Preguntas como las haría una persona (recomendación, no palabras clave).
export function preguntas(rubro: string, ciudad: string, n: number) {
  const r = rubro.trim(),
    c = ciudad.trim() || "Chile",
    enC = c.toLowerCase() === "chile" ? "en Chile" : `en ${c}, Chile`;
  const base = [
    `Recomiéndame empresas de ${r} ${enC}.`,
    `¿Cuáles son las mejores empresas de ${r} ${enC}?`,
    `¿Qué empresa de ${r} me recomiendas contratar ${enC}?`,
    `Necesito una empresa de ${r} ${enC}, ¿a quién me recomiendas?`,
    `¿Qué empresas de ${r} tienen buena reputación ${enC}?`,
    `Dame una lista de empresas confiables de ${r} ${enC}.`,
    `¿Con qué empresa de ${r} ${enC} trabajarías tú?`,
    `Compara las principales empresas de ${r} ${enC}.`,
    `¿Qué empresa de ${r} ${enC} tiene mejor relación precio y calidad?`,
    `Busco ${r} ${enC} para una empresa mediana, ¿qué opciones tengo?`,
  ];
  const out: string[] = [];
  for (let i = 0; out.length < n; i++)
    out.push(
      i < base.length
        ? base[i]
        : base[i % base.length].replace("?", " este año?"),
    );
  return out;
}

export type Resultado = {
  pregunta: string;
  puesto: number | null;
  mencion: boolean;
  empresas: string[];
  error?: string;
};

async function preguntarChatGPT(pregunta: string) {
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + (process.env.OPENAI_API_KEY_VIS || process.env.OPENAI_API_KEY),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL_VISIBILIDAD || "gpt-5-mini",
      reasoning: { effort: "low" },
      tools: [
        {
          type: "web_search",
          user_location: { type: "approximate", country: "CL" },
        },
      ],
      input:
        pregunta +
        "\n\nResponde en español de Chile con una lista numerada de empresas (nombre y sitio web), como se lo responderías a una persona.",
    }),
  });
  const j = await r.json();
  if (!r.ok)
    throw new Error(
      "OpenAI " + r.status + " " + JSON.stringify(j).slice(0, 200),
    );
  let texto = "";
  const urls: string[] = [];
  for (const it of j.output || [])
    if (it.type === "message")
      for (const c of it.content || []) {
        if (c.type === "output_text") {
          texto += c.text + "\n";
          for (const a of c.annotations || []) if (a.url) urls.push(a.url);
        }
      }
  return { texto, urls };
}

export function analizar(
  texto: string,
  urls: string[],
  empresa: string,
  dom: string,
): Omit<Resultado, "pregunta"> {
  const lineas = texto
    .split("\n")
    .filter((l) => /^\s*(\d+[.)]|[-*•])\s+/.test(l));
  const empresas = lineas
    .map((l) =>
      l
        .replace(/^\s*(\d+[.)]|[-*•])\s+/, "")
        .replace(/\*\*/g, "")
        .split(/\s[–—-]\s|:|\(|\[/)[0]
        .trim(),
    )
    .filter(Boolean)
    .slice(0, 15);
  const ne = norm(empresa),
    base = dom.split(".")[0];
  const es = (l: string) =>
    (ne.length > 2 && norm(l).includes(ne)) ||
    (!!dom && l.toLowerCase().includes(dom)) ||
    (base.length > 3 && norm(l).replace(/ /g, "").includes(base));
  const idx = lineas.findIndex(es);
  return {
    puesto: idx >= 0 ? idx + 1 : null,
    mencion:
      idx < 0 && (es(texto) || urls.some((u) => !!dom && u.includes(dom))),
    empresas,
  };
}

export async function medir(
  empresa: string,
  sitio: string,
  qs: string[],
  paralelo = 5,
): Promise<Resultado[]> {
  const dom = dominio(sitio),
    out: Resultado[] = [];
  for (let i = 0; i < qs.length; i += paralelo) {
    out.push(
      ...(await Promise.all(
        qs.slice(i, i + paralelo).map(async (pregunta) => {
          try {
            const { texto, urls } = await preguntarChatGPT(pregunta);
            return { pregunta, ...analizar(texto, urls, empresa, dom) };
          } catch (e) {
            return {
              pregunta,
              puesto: null,
              mencion: false,
              empresas: [],
              error: String((e as Error).message).slice(0, 120),
            };
          }
        }),
      )),
    );
  }
  return out;
}

// ── Flow ──
const FLOW_URL = "https://www.flow.cl/api";
function firmar(p: Record<string, string>) {
  const s = Object.keys(p)
    .sort()
    .map((k) => k + "=" + p[k])
    .join("&");
  return crypto
    .createHmac("sha256", process.env.FLOW_SECRET_KEY || "")
    .update(s)
    .digest("hex");
}
export async function flow(
  endpoint: string,
  params: Record<string, string>,
  metodo: "GET" | "POST" = "POST",
) {
  const p = { ...params, apiKey: process.env.FLOW_API_KEY || "" };
  const body = new URLSearchParams({ ...p, s: firmar(p) });
  const r =
    metodo === "GET"
      ? await fetch(FLOW_URL + endpoint + "?" + body)
      : await fetch(FLOW_URL + endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
  return r.json();
}
export function firmaValida(params: Record<string, string>) {
  const { s, ...resto } = params;
  return !!s && firmar(resto) === s;
}

export type Suscripcion = {
  id: string;
  email: string;
  nombre: string;
  empresa: string;
  sitio: string;
  rubro: string;
  ciudad: string;
  competidores: string[];
  plan: PlanKey;
  estado: "pendiente" | "activo" | "suspendido" | "cancelado";
  flowCustomerId?: string;
  flowSubscriptionId?: string;
  token: string;
  creado: string;
  actualizado: string;
  ultimaMedicion?: string;
};
