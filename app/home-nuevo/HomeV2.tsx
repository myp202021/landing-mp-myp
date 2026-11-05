"use client";

/**
 * Home M&P v4 (rediseño nov 2026)
 * Componentes 3D al estilo 21st.dev: escena Spline, globo cobe, 3D marquee, spotlight, background paths.
 * SEO/GEO: mismo H1, mismos schemas JSON-LD, FAQ visible, texto real en HTML (sin depender de JS).
 */

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Bot,
  Search,
  Sparkles,
  Target,
  PenTool,
  Clapperboard,
  LineChart,
  Radar,
  FileText,
  BellRing,
  ShieldCheck,
  Play,
  Star,
} from "lucide-react";
import YouTubeLite from "@/components/YouTubeLite";
import { clients } from "@/components/ClientLogos";
import { trackLead, trackWhatsAppClick } from "@/lib/meta-pixel";
import {
  businessSchema,
  organizationSchema,
  faqSchema,
  serviceSchema,
} from "@/lib/home-schemas";
import Spotlight from "@/components/home-v2/Spotlight";
import CountUp from "@/components/home/CountUp";

const SplineScene = dynamic(() => import("@/components/home-v2/SplineScene"), {
  ssr: false,
});
const Globe = dynamic(() => import("@/components/home-v2/Globe"), {
  ssr: false,
});
const BackgroundPaths = dynamic(
  () => import("@/components/home-v2/BackgroundPaths"),
  { ssr: false },
);
const Marquee3D = dynamic(() => import("@/components/home-v2/Marquee3D"), {
  ssr: false,
});

const CHIPS = [
  { t: 'Costo por lead', v: 'Medido por campaña', c: 'text-cyan-300', pos: 'left-0 top-10 lg:left-4' },
  { t: 'ChatGPT y Gemini', v: '¿Te recomiendan?', c: 'text-violet-300', pos: 'right-0 top-24' },
  { t: 'CRM conectado', v: 'Hasta la venta', c: 'text-emerald-300', pos: 'left-6 bottom-16' },
  { t: 'Agentes IA', v: '27 en producción', c: 'text-amber-300', pos: 'right-6 bottom-6' },
]

const WA =
  "https://wa.me/56992258137?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20servicios%20M%26P";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number] },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> {children}
    </div>
  );
}

/* ---------------- Datos ---------------- */

const STATS = [
  { v: "7", l: "años en el mercado" },
  { v: "50+", l: "clientes activos" },
  { v: "+200", l: "campañas activas" },
  { v: "27", l: "agentes IA en producción" },
  { v: "5.0★", l: "115 reseñas en Google" },
];

const AREAS = [
  {
    icon: Target,
    n: "01",
    t: "Paid Media",
    c: "from-blue-500 to-cyan-400",
    d: "Google, Meta, LinkedIn y TikTok con un árbol de decisión por campaña: cada peso tiene audiencia, mensaje y KPI.",
    e: [
      "Árbol de decisión de campañas",
      "Optimización semanal",
      "CPL, CPA y CAC por campaña",
      "Reglas: si pasa esto, hacemos esto",
    ],
  },
  {
    icon: PenTool,
    n: "02",
    t: "Contenido y publicidad",
    c: "from-violet-500 to-fuchsia-400",
    d: "Un publicista arma la grilla mensual por red social y los mensajes de cada campaña, alineados con lo que vende tu equipo comercial.",
    e: [
      "Grilla mensual por red",
      "Copies de anuncios",
      "Guiones de reels y videos",
      "Email marketing",
    ],
  },
  {
    icon: Clapperboard,
    n: "03",
    t: "Diseño y audiovisual",
    c: "from-amber-400 to-rose-400",
    d: "Diseño de piezas, carruseles, reels y jornadas de grabación. También videos con IA cuando el caso lo pide.",
    e: [
      "Piezas y carruseles",
      "Reels y stories",
      "Jornada de grabación mensual",
      "Videos con IA",
    ],
  },
];

const BASE_LAYER = {
  t: "Capa transversal: agentes IA + CRM y medición",
  d: "Bajo las tres áreas trabajan nuestros agentes y la conexión con tu CRM (Pipedrive, HubSpot, Salesforce, GoHighLevel, Shopify o Sheets). Medimos hasta la venta, no hasta el clic.",
};

const ARBOL = [
  {
    q: "¿La gente ya busca lo que vendes?",
    si: "Google Búsqueda: capturamos la demanda que ya existe",
    no: "Meta y TikTok: generamos demanda con video y formularios",
  },
  {
    q: "¿Vendes a empresas?",
    si: "LinkedIn + Google con mensajes por cargo",
    no: "Meta y Google con audiencias por intereses y lookalikes",
  },
  {
    q: "¿El ticket es alto?",
    si: "Formulario + calificación en CRM antes de pasar a ventas",
    no: "WhatsApp o e-commerce directo para cerrar rápido",
  },
];

const REGLAS = [
  [
    "El CPL sube dos semanas seguidas",
    "Cambiamos creatividad y audiencia antes de tocar el presupuesto",
  ],
  [
    "Llegan leads, pero ventas no cierra",
    "Revisamos calidad en el CRM y ajustamos formulario y mensaje",
  ],
  [
    "Una campaña baja su costo por venta",
    "Movemos presupuesto hacia ella y probamos variantes",
  ],
  [
    "Aparece un competidor con oferta agresiva",
    "Lo detecta el agente de competencia y ajustamos mensaje esa semana",
  ],
];

const VERDAD = {
  si: [
    "Tienes presupuesto pequeño y puedes escalarlo x3",
    "Tu margen de contribución permite subir inversión publicitaria",
    "Hay demanda no saturada en el mercado",
    "Tu producto/servicio tiene capacidad de escalar",
  ],
  no: [
    "Mercado saturado con mucha competencia",
    "Ya estás gastando mucho y cerca del punto de saturación",
    "Tu margen no soporta más inversión publicitaria",
    "Limitaciones operativas para crecer rápido",
  ],
};

const AGENTES = [
  {
    icon: FileText,
    t: "Contenido SEO",
    d: "Artículos largos con fuentes reales, sin cifras inventadas, publicados en tu sitio.",
  },
  {
    icon: Bot,
    t: "GEO semanal",
    d: "Preguntamos a ChatGPT y Gemini quién recomiendan en tu rubro y medimos si apareces.",
  },
  {
    icon: Radar,
    t: "Competencia",
    d: "Monitorea anuncios y publicaciones de tus competidores y avisa cambios.",
  },
  {
    icon: BellRing,
    t: "Leads y alertas",
    d: "Cada lead llega al CRM y al responsable; si nadie responde, insiste.",
  },
  {
    icon: ShieldCheck,
    t: "Auditoría técnica",
    d: "Schemas, llms.txt, robots, velocidad y páginas duplicadas.",
  },
  {
    icon: LineChart,
    t: "Reportes",
    d: "Panel en vivo e informe mensual con lo que subió, lo que bajó y qué hacemos.",
  },
];

const CASOS_GEO = [
  {
    rubro: "Industrial B2B · grúas horquilla",
    dato: "#1 en ChatGPT",
    det: "Recomendado primero en arriendo de grúas eléctricas en Santiago, y 21 de 46 búsquedas propias en primera página de Google.",
    fecha: "Medición propia, octubre 2026",
  },
  {
    rubro: "Software de RR.HH.",
    dato: "#1 en Gemini",
    det: "Recomendado primero en software de benchmark salarial, con contenido SEO hecho por nuestros agentes.",
    fecha: "Medición propia, octubre 2026",
  },
];

const CAPSULAS = [
  ["GoY57zf1I28", "Todos quieren resultados. Pocos tienen la estrategia."],
  ["7kjkRWKq5Vw", "Cómo optimizar el CPA de tu empresa"],
  ["jwTkYDkNYmo", "M&P Labs"],
  ["Zxwm-4SUGDw", "CRM: M&P Agencia Digital"],
  ["yn4QrZP9ZlU", "Predictor de campañas"],
  ["T36AtNUnsc0", "Leads"],
  ["bdB7ysX5TwQ", "Plan de acción"],
  ["g29oRYkhios", "Árbol de decisión"],
  ["qBhfeLY-pPo", "¿Cuándo usar IA?"],
  ["uQpV08CVjgc", "¿Hacia dónde van las agencias?"],
  ["0jpmxlxjLkE", "El cliente llegó a la reunión… pero la agencia no"],
  ["qqJkKX85WqY", "Todos prometen. Nosotros cumplimos."],
  ["btXmX0Jk9as", "Tu marca no necesita suerte, necesita un plan"],
  ["R5zpS3j_wYs", "Cortometraje Influencer's, creado con IA"],
  ["qhc0bY2Wc5A", "¿Baja en tu campaña? Influencer virtual con IA"],
  ["_lYfOmPxx7E", "Más leads no es vender más"],
];

const TESTIMONIOS = [
  ["vTn18twKalI", "Clínica López Mateo"],
  ["8VZd4Sckm58", "Power Energy"],
  ["PvN8KRK99WI", "4Life"],
];

const PLANES = [
  {
    n: "Silver",
    p: "$950.000",
    dest: false,
    f: [
      "Equipo completo M&P (3 áreas)",
      "2 campañas mensuales",
      "20 contenidos orgánicos en todas las redes",
      "Media jornada de grabación al mes",
      "Gestión de RR.SS.",
      "Reuniones mensuales",
    ],
    seo: "SEO y GEO: no incluido",
  },
  {
    n: "Gold",
    p: "$1.500.000",
    dest: true,
    f: [
      "Equipo completo M&P (3 áreas)",
      "4 campañas mensuales",
      "30 contenidos orgánicos en todas las redes",
      "Media jornada de grabación al mes",
      "Email marketing (2 al mes)",
      "Reuniones quincenales",
    ],
    seo: "SEO y GEO: auditoría incluida, agentes por acordar",
  },
  {
    n: "Platinum",
    p: "$2.500.000",
    dest: false,
    f: [
      "Equipo completo M&P (3 áreas)",
      "6 campañas mensuales",
      "45 contenidos orgánicos en todas las redes",
      "Jornada completa de grabación al mes",
      "Email marketing (4 al mes)",
      "Gestión de influencers",
    ],
    seo: "SEO y GEO: incluido, con agentes IA",
  },
];

/* ---------------- Componentes de sección ---------------- */

function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 backdrop-blur-xl"
      >
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Muller y Pérez, inicio"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-blanco.png"
            alt="Muller y Pérez"
            className="h-8 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="font-bold tracking-tight text-white">M&amp;P</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#areas" className="hover:text-white">
            Cómo trabajamos
          </a>
          <Link href="/agentes-ia" className="hover:text-white">
            Agentes IA
          </Link>
          <Link href="/copilot" className="hover:text-white">
            Boost SEO + IA
          </Link>
          <a href="#planes" className="hover:text-white">
            Planes
          </a>
          <a href="#casos" className="hover:text-white">
            Casos
          </a>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
        </div>
        <a
          href="#contacto"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-100"
        >
          Agendar reunión
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const op = useTransform(scrollY, [0, 500], [1, 0.2]);
  return (
    <section
      aria-label="Sección principal"
      className="relative min-h-[100svh] overflow-hidden bg-slate-950 pt-32 text-white"
    >
      <video
        src="/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.10]"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.35),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="v2-grid absolute inset-0" aria-hidden="true" />
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="#67e8f9"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-6 lg:grid-cols-[1.1fr_1fr]">
        <motion.div style={{ y, opacity: op }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Eyebrow>
              Performance marketing con datos reales · desde 2020
            </Eyebrow>
          </motion.div>
          <h1 className="v2-h1 text-[2.6rem] font-black uppercase leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
            Agencia de Marketing Digital que vincula Marketing{" "}
            <span className="v2-shimmer">con Comercial</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mt-7 max-w-xl text-lg text-slate-300 md:text-xl"
          >
            Convertimos tu inversión publicitaria en clientes. El primer paso es
            tener un número:{" "}
            <strong className="text-white">
              el costo de adquisición por tipo de campaña.
            </strong>{" "}
            Con ese dato puedes proyectar ventas y corregir errores.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#contacto"
              className="v2-btn group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-slate-900"
            >
              <Calendar className="h-5 w-5" /> Agenda tu reunión con M&amp;P
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({ page: "hero", servicio: "general" })
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-semibold backdrop-blur hover:bg-white/10"
            >
              <MessageSquare className="h-5 w-5 text-emerald-400" /> Conversemos
              por WhatsApp
            </a>
          </motion.div>
        </motion.div>

        <div className="relative h-[420px] [perspective:1200px] lg:h-[640px]" aria-hidden="true">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[min(600px,92vw)]"><Globe /></div>
          </div>
          {CHIPS.map((c, k) => (
            <motion.div key={c.t} className={`v2-glass absolute rounded-2xl px-4 py-3 shadow-2xl ${c.pos}`}
              initial={{ opacity: 0, scale: 0.8, rotateY: -25 }} animate={{ opacity: 1, scale: 1, rotateY: -12, y: [0, -12, 0] }}
              transition={{ opacity: { delay: 0.6 + k * 0.15 }, scale: { delay: 0.6 + k * 0.15 }, y: { duration: 4 + k, repeat: Infinity, ease: 'easeInOut' } }}>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">{c.t}</p>
              <p className={`text-xl font-black ${c.c}`}>{c.v}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cifras */}
      <div className="relative z-10 mx-auto mt-4 max-w-7xl px-6 pb-14">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {STATS.map((s) => (
            <div
              key={s.l}
              className="v2-glass rounded-2xl px-4 py-5 text-center"
            >
              <div className="text-3xl font-black tabular-nums text-white md:text-4xl">
                <CountUp value={s.v} />
              </div>
              <div className="mt-1 text-xs font-medium text-slate-400 md:text-sm">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Logos() {
  const row = [...clients, ...clients];
  return (
    <section
      aria-label="Clientes"
      className="relative overflow-hidden border-y border-white/5 bg-slate-950 py-10"
    >
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Empresas que confían en M&amp;P
      </p>
      <div className="v2-mask flex w-max animate-scroll-left gap-12">
        {row.map((c, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={c.logo}
            alt={`${c.name}, ${c.industry}`}
            loading="lazy"
            className="h-10 w-auto rounded bg-white/90 px-3 py-1.5 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </section>
  );
}

function Verdad() {
  const [r, setR] = useState<(boolean | null)[]>([null, null, null, null]);
  const done = r.every((x) => x !== null);
  const yes = r.filter(Boolean).length;
  return (
    <section
      aria-labelledby="verdad"
      className="relative overflow-hidden bg-slate-950 py-28 text-white"
    >
      <BackgroundPaths />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div {...fade} className="mx-auto max-w-3xl text-center">
          <Eyebrow>Árbol de decisión</Eyebrow>
          <h2
            id="verdad"
            className="text-4xl font-black tracking-tight md:text-6xl"
          >
            La verdad sobre{" "}
            <span className="v2-shimmer">duplicar o triplicar ventas</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            Nuestra metodología es ingeniería, no magia. Responde estas cuatro
            preguntas y te decimos si es posible.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {VERDAD.si.map((q, i) => (
            <motion.div
              key={q}
              {...fade}
              transition={{ ...fade.transition, delay: i * 0.08 }}
              className={`v2-glass v2-tilt rounded-2xl p-5 ${r[i] === true ? "ring-1 ring-emerald-400/60" : r[i] === false ? "ring-1 ring-rose-400/60" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-semibold text-slate-100">
                  <span className="mr-2 text-cyan-300">{i + 1}.</span>
                  {q}
                </p>
                <div className="flex shrink-0 gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() =>
                        setR((p) => p.map((x, k) => (k === i ? v : x)))
                      }
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${r[i] === v ? (v ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950") : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
                    >
                      {v ? "Sí" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          layout
          className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/20 to-violet-600/20 p-6 text-center"
        >
          {!done ? (
            <p className="text-slate-300">
              Responde las cuatro para ver el resultado.
            </p>
          ) : yes >= 3 ? (
            <p className="text-lg">
              <CheckCircle2 className="mr-2 inline h-5 w-5 text-emerald-400" />
              <strong>Sí es posible duplicar o triplicar.</strong> Lo primero es
              medir tu costo de adquisición por campaña y escalar lo que
              funciona.
            </p>
          ) : (
            <p className="text-lg">
              <XCircle className="mr-2 inline h-5 w-5 text-rose-400" />
              <strong>Hoy no es el momento de prometer x3.</strong> Primero
              ordenamos margen, operación y medición; después escalamos.
            </p>
          )}
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.div
            {...fade}
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-7"
          >
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Cuándo SÍ es
              posible duplicar o triplicar
            </h3>
            <ul className="space-y-2.5 text-slate-300">
              {VERDAD.si.map((x) => (
                <li key={x} className="flex gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                  {x}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            {...fade}
            className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-7"
          >
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <XCircle className="h-5 w-5 text-rose-400" /> Cuándo NO es posible
            </h3>
            <ul className="space-y-2.5 text-slate-300">
              {VERDAD.no.map((x) => (
                <li key={x} className="flex gap-2">
                  <XCircle className="mt-1 h-4 w-4 shrink-0 text-rose-400" />
                  {x}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        <p className="mt-8 text-center text-slate-400">
          <strong className="text-cyan-300">
            En M&amp;P no hacemos promesas vacías.
          </strong>{" "}
          Te decimos la verdad desde el día 1: qué esperar, cuándo esperarlo, y
          con qué números vamos a medir el éxito.
        </p>
      </div>
    </section>
  );
}

function Areas() {
  const [hover, setHover] = useState(false);
  return (
    <section
      id="areas"
      aria-labelledby="areas-t"
      className="relative overflow-hidden bg-[#070b1a] py-28 text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div {...fade}>
          <Eyebrow>Cómo trabajamos</Eyebrow>
          <h2
            id="areas-t"
            className="text-4xl font-black tracking-tight md:text-6xl"
          >
            Tres áreas.
            <br />
            <span className="v2-shimmer">Un solo número.</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-slate-400">
            No somos solo campañas. Cada cliente tiene un equipo de tres áreas
            que trabaja en orden, sobre una capa de agentes IA y medición
            conectada a tu CRM.
          </p>
          <div className="mt-10 space-y-5">
            {AREAS.map((a) => (
              <div key={a.t} className="flex gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${a.c}`}
                >
                  <a.icon className="h-5 w-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-bold">
                    {a.n} · {a.t}
                  </h3>
                  <p className="text-sm text-slate-400">{a.d}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {a.e.join(" · ")}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
                <Sparkles className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <h3 className="font-bold">{BASE_LAYER.t}</h3>
                <p className="text-sm text-slate-400">{BASE_LAYER.d}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pila 3D isométrica */}
        <div
          className="relative flex h-[520px] items-center justify-center [perspective:1400px]"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-hidden="true"
        >
          <div
            className="relative h-72 w-72 [transform-style:preserve-3d] transition-transform duration-700 md:h-80 md:w-80"
            style={{ transform: "rotateX(58deg) rotateZ(-40deg)" }}
          >
            {[
              {
                t: "Agentes IA + CRM",
                c: "from-emerald-400/80 to-cyan-500/80",
                icon: Sparkles,
              },
              ...AREAS.slice()
                .reverse()
                .map((a) => ({
                  t: a.t,
                  c: a.c.replace("from-", "from-").concat(""),
                  icon: a.icon,
                })),
            ].map((l, i) => (
              <div
                key={l.t}
                className={`absolute inset-0 flex items-end justify-start rounded-3xl border border-white/20 bg-gradient-to-br ${l.c} p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] transition-transform duration-700`}
                style={{
                  transform: `translateZ(${i * (hover ? 90 : 46)}px)`,
                  opacity: 0.92,
                }}
              >
                <span className="flex items-center gap-2 rounded-lg bg-slate-950/70 px-3 py-1.5 text-sm font-bold text-white">
                  <l.icon className="h-4 w-4" />
                  {l.t}
                </span>
              </div>
            ))}
          </div>
          <p className="absolute bottom-2 text-xs text-slate-500">
            Pasa el mouse para separar las capas
          </p>
        </div>
      </div>
    </section>
  );
}

function Arbol() {
  const [i, setI] = useState(0);
  return (
    <section
      aria-labelledby="arbol-t"
      className="relative bg-slate-950 py-28 text-white"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...fade} className="text-center">
          <Eyebrow>Así decidimos cada peso</Eyebrow>
          <h2
            id="arbol-t"
            className="text-4xl font-black tracking-tight md:text-6xl"
          >
            El árbol de decisión de{" "}
            <span className="v2-shimmer">tus campañas</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Antes de invertir, cada campaña pasa por estas preguntas. Cada rama
            define campaña, audiencia, mensaje, KPI y porcentaje de la pauta.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {ARBOL.map((n, k) => (
            <motion.button
              type="button"
              key={n.q}
              {...fade}
              transition={{ ...fade.transition, delay: k * 0.1 }}
              onClick={() => setI(k)}
              className={`v2-glass rounded-2xl p-6 text-left transition ${i === k ? "ring-2 ring-cyan-400" : "hover:ring-1 hover:ring-white/20"}`}
            >
              <span className="text-xs font-semibold text-cyan-300">
                Pregunta {k + 1}
              </span>
              <h3 className="mt-2 text-lg font-bold">{n.q}</h3>
              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-xl bg-emerald-400/10 p-3">
                  <strong className="text-emerald-300">Sí →</strong>{" "}
                  <span className="text-slate-300">{n.si}</span>
                </div>
                <div className="rounded-xl bg-violet-400/10 p-3">
                  <strong className="text-violet-300">No →</strong>{" "}
                  <span className="text-slate-300">{n.no}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          {...fade}
          className="mt-12 overflow-hidden rounded-2xl border border-white/10"
        >
          <div className="grid grid-cols-2 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Si pasa esto</span>
            <span>Hacemos esto</span>
          </div>
          {REGLAS.map(([a, b]) => (
            <div
              key={a}
              className="grid grid-cols-2 gap-4 border-t border-white/5 px-6 py-4 text-sm"
            >
              <span className="text-slate-200">{a}</span>
              <span className="text-slate-400">{b}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Agentes() {
  return (
    <section
      aria-labelledby="agentes-t"
      className="relative overflow-hidden bg-[#070b1a] py-28 text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative order-2 h-[460px] lg:order-1 lg:h-[600px]">
          <div className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-600/30 to-violet-600/30 blur-3xl" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center lg:hidden"><div className="w-[min(420px,90vw)]"><Globe /></div></div>
          <div className="absolute inset-0 hidden lg:block">
            <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="h-full w-full" />
          </div>
        </div>
        <motion.div {...fade} className="order-1 lg:order-2">
          <Eyebrow>Agentes IA · SEO · GEO</Eyebrow>
          <h2
            id="agentes-t"
            className="text-4xl font-black tracking-tight md:text-6xl"
          >
            27 agentes trabajando.{" "}
            <span className="v2-shimmer">Con evidencia.</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            Que te encuentren en Google ya no basta: hoy también hay que
            aparecer cuando alguien le pregunta a ChatGPT o Gemini. Eso es GEO,
            y lo medimos todas las semanas.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {AGENTES.map((a) => (
              <div key={a.t} className="v2-glass v2-tilt rounded-xl p-4">
                <a.icon className="mb-2 h-5 w-5 text-cyan-300" />
                <h3 className="font-bold">{a.t}</h3>
                <p className="text-sm text-slate-400">{a.d}</p>
              </div>
            ))}
          </div>
          <Link
            href="/agentes-ia"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Ver los 27 agentes y su evidencia <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-6">
        <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Casos comprobables de SEO y GEO
        </h3>
        <div className="grid gap-5 md:grid-cols-3">
          {CASOS_GEO.map((c) => (
            <motion.div
              key={c.rubro}
              {...fade}
              className="v2-glass v2-tilt rounded-2xl p-7"
            >
              <p className="text-sm text-slate-400">{c.rubro}</p>
              <p className="my-3 text-4xl font-black text-white">{c.dato}</p>
              <p className="text-slate-300">{c.det}</p>
              <p className="mt-4 text-xs text-slate-500">{c.fecha}</p>
            </motion.div>
          ))}
          <motion.div
            {...fade}
            className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-7"
          >
            <div>
              <Search className="mb-3 h-6 w-6" />
              <p className="text-2xl font-black">¿Te recomienda ChatGPT?</p>
              <p className="mt-2 text-blue-50">
                Te hacemos la prueba gratis con las preguntas que harían tus
                clientes.
              </p>
            </div>
            <a
              href="#contacto"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900"
            >
              Quiero la prueba <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Videos() {
  const imgs = CAPSULAS.map(([id, t]) => ({
    src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    alt: t,
    href: `https://www.youtube.com/watch?v=${id}`,
  }));
  return (
    <section
      aria-labelledby="videos-t"
      className="relative overflow-hidden bg-slate-950 py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          {...fade}
          className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <Eyebrow>Producción propia</Eyebrow>
            <h2
              id="videos-t"
              className="text-4xl font-black tracking-tight md:text-6xl"
            >
              Grabamos, editamos{" "}
              <span className="v2-shimmer">y creamos con IA</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-slate-400">
              Cápsulas, reels, comerciales e influencers virtuales. Todo hecho
              por el equipo de diseño y audiovisual de M&amp;P.
            </p>
          </div>
          <a
            href="https://www.youtube.com/channel/UCgzocZZQLNnthZ82oEyblrA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold hover:bg-white/10"
          >
            <Play className="h-4 w-4 text-rose-400" /> Ver canal de YouTube
          </a>
        </motion.div>
        <Marquee3D images={imgs} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CAPSULAS.slice(13).map(([id, t]) => (
            <div
              key={id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="aspect-video">
                <YouTubeLite
                  videoId={id}
                  title={`${t}, M&P Agencia Digital`}
                  thumbnailQuality="hqdefault"
                />
              </div>
              <p className="p-4 text-sm font-semibold text-slate-300">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Casos() {
  return (
    <section id="casos" aria-labelledby="casos-t" className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fade} className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Casos de éxito
          </p>
          <h2
            id="casos-t"
            className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl"
          >
            Lo cuentan nuestros clientes
          </h2>
          <div className="mt-4 flex items-center justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, k) => (
              <Star key={k} className="h-5 w-5 fill-current" />
            ))}
            <span className="ml-2 text-slate-600">
              5.0 · 115 reseñas en Google
            </span>
          </div>
        </motion.div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIOS.map(([id, n]) => (
            <motion.div
              key={id}
              {...fade}
              className="overflow-hidden rounded-2xl bg-slate-50 shadow-xl ring-1 ring-slate-200"
            >
              <div className="aspect-video">
                <YouTubeLite
                  videoId={id}
                  title={`Caso de éxito: ${n}, Muller y Pérez`}
                  thumbnailQuality="hqdefault"
                />
              </div>
              <p className="p-4 font-semibold text-slate-700">{n}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Planes() {
  return (
    <section
      id="planes"
      aria-labelledby="planes-precios"
      className="relative overflow-hidden bg-slate-950 py-28 text-white"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.25),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div {...fade} className="text-center">
          <Eyebrow>Planes</Eyebrow>
          <h2
            id="planes-precios"
            className="text-4xl font-black tracking-tight md:text-6xl"
          >
            Nuestros planes
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Valores mensuales + IVA. Todos con las tres áreas y reportería.
          </p>
        </motion.div>
        <div className="mt-14 grid gap-6 [perspective:1200px] md:grid-cols-3">
          {PLANES.map((p, k) => (
            <motion.div
              key={p.n}
              {...fade}
              transition={{ ...fade.transition, delay: k * 0.1 }}
              className={`v2-tilt relative rounded-3xl p-7 ${p.dest ? "bg-gradient-to-b from-blue-600 to-violet-700 shadow-[0_30px_80px_-20px_rgba(99,102,241,0.7)] md:-translate-y-4" : "v2-glass"}`}
            >
              {p.dest && (
                <span className="absolute -top-3 left-7 rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold text-slate-950">
                  Más elegido
                </span>
              )}
              <h3 className="text-2xl font-black">{p.n}</h3>
              <p className="mt-3">
                <span className="text-4xl font-black">{p.p}</span>
                <span className="text-sm text-slate-300"> + IVA / mes</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.f.map((x) => (
                  <li key={x} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    {x}
                  </li>
                ))}
                <li className="flex gap-2 font-semibold">
                  <Bot className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  {p.seo}
                </li>
              </ul>
              <a
                href="#contacto"
                className={`mt-8 block rounded-xl py-3 text-center font-semibold ${p.dest ? "bg-white text-slate-900" : "bg-white/10 hover:bg-white/20"}`}
              >
                Cotizar {p.n}
              </a>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Mínimo 3 meses. La inversión en medios se paga aparte, directo a cada
          plataforma.
        </p>
      </div>
    </section>
  );
}

function Faq() {
  const items = faqSchema.mainEntity as {
    name: string;
    acceptedAnswer: { text: string };
  }[];
  return (
    <section aria-labelledby="faq-t" className="bg-white py-28">
      <div className="mx-auto max-w-3xl px-6">
        <h2
          id="faq-t"
          className="mb-10 text-center text-4xl font-black tracking-tight text-slate-900 md:text-5xl"
        >
          Preguntas frecuentes
        </h2>
        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
          {items.map((q) => (
            <details key={q.name} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                {q.name}
                <span className="text-2xl text-blue-600 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-slate-600">{q.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contacto() {
  const router = useRouter();
  const [f, setF] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    cargo: "",
    enviando: false,
  });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setF((p) => ({ ...p, enviando: true }));
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: f.nombre,
          empresa: f.empresa,
          email: f.email,
          telefono: f.telefono,
          solicitud: `Cargo: ${f.cargo}\n\nSolicitud de reunión desde Landing M&P`,
          destinatario: "contacto@mulleryperez.cl",
        }),
      });
      if (!r.ok) throw new Error();
      trackLead({
        nombre: f.nombre,
        empresa: f.empresa,
        cargo: f.cargo,
        email: f.email,
        telefono: f.telefono,
        servicio: "performance-marketing",
        fuente: "landing-principal",
      });
      router.push("/gracias");
    } catch {
      alert("Error al enviar. Intenta nuevamente.");
      setF((p) => ({ ...p, enviando: false }));
    }
  };
  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400";
  return (
    <section
      id="contacto"
      aria-labelledby="formulario-contacto"
      className="relative overflow-hidden bg-slate-950 py-28 text-white"
    >
      <Spotlight className="-top-40 right-0" fill="#a78bfa" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2">
        <motion.div {...fade}>
          <Eyebrow>Contacto</Eyebrow>
          <h2
            id="formulario-contacto"
            className="text-4xl font-black tracking-tight md:text-6xl"
          >
            ¿Listo para trabajar con{" "}
            <span className="v2-shimmer">datos reales?</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            Agenda una reunión y te mostramos cómo funciona nuestra metodología,
            con tu árbol de decisión y tu costo de adquisición objetivo.
          </p>
          <div className="mt-8 space-y-3 text-slate-300">
            <p>📍 Badajoz 100, oficina 523, Las Condes, Santiago</p>
            <p>✉️ contacto@mulleryperez.cl</p>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-emerald-400"
            >
              <MessageSquare className="h-4 w-4" /> +56 9 9225 8137
            </a>
          </div>
        </motion.div>
        <motion.form
          {...fade}
          onSubmit={submit}
          aria-label="Formulario de contacto"
          className="v2-glass space-y-4 rounded-3xl p-7"
        >
          <input
            required
            className={field}
            placeholder="Nombre"
            value={f.nombre}
            onChange={(e) => setF({ ...f, nombre: e.target.value })}
            aria-label="Nombre"
          />
          <input
            required
            className={field}
            placeholder="Empresa"
            value={f.empresa}
            onChange={(e) => setF({ ...f, empresa: e.target.value })}
            aria-label="Empresa"
          />
          <input
            className={field}
            placeholder="Cargo"
            value={f.cargo}
            onChange={(e) => setF({ ...f, cargo: e.target.value })}
            aria-label="Cargo"
          />
          <input
            required
            type="email"
            className={field}
            placeholder="Correo"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            aria-label="Correo"
          />
          <input
            required
            type="tel"
            className={field}
            placeholder="Teléfono"
            value={f.telefono}
            onChange={(e) => setF({ ...f, telefono: e.target.value })}
            aria-label="Teléfono"
          />
          <button
            disabled={f.enviando}
            className="v2-btn w-full rounded-xl bg-white py-4 font-semibold text-slate-900 disabled:opacity-60"
          >
            {f.enviando ? "Enviando…" : "Agendar reunión"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/5 bg-slate-950 py-12 text-sm text-slate-500"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <p>
          © {new Date().getFullYear()} Muller y Pérez · Agencia de marketing
          digital en Chile desde 2020
        </p>
        <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-5">
          <Link href="/agentes-ia" className="hover:text-white">
            Agentes IA
          </Link>
          <Link href="/copilot" className="hover:text-white">
            Boost SEO + IA
          </Link>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link href="/labs/mp-intelligence" className="hover:text-white">
            M&amp;P Labs
          </Link>
          <Link href="/equipo" className="hover:text-white">
            Equipo
          </Link>
          <Link href="/casos-de-exito" className="hover:text-white">
            Casos de éxito
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default function HomeV2() {
  return (
    <div className="bg-slate-950 antialiased">
      {[businessSchema, organizationSchema, faqSchema, serviceSchema].map(
        (s, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
          />
        ),
      )}
      <Nav />
      <main>
        <Hero />
        <Logos />
        <Verdad />
        <Areas />
        <Arbol />
        <Agentes />
        <Videos />
        <Casos />
        <Planes />
        <Faq />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
