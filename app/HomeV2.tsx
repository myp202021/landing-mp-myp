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
import { clients, logoSize } from "@/components/ClientLogos";
import { aniosMyP } from "@/lib/anios-myp";
import { trackLead, trackWhatsAppClick } from "@/lib/meta-pixel";
import {
  businessSchema,
  organizationSchema,
  faqSchema,
  serviceSchema,
} from "@/lib/home-schemas";
import Spotlight from "@/components/home-v2/Spotlight";
import CountUp from "@/components/home/CountUp";
import SiteHeader from '@/components/SiteHeader'
import Testimonios from "@/components/home-v2/Testimonios";
import DesktopOnly from "@/components/home-v2/DesktopOnly";
import SmartRobot from "@/components/home-v2/SmartRobot";
import Image from "next/image";

const PortfolioBrochure = dynamic(() => import("@/components/PortfolioBrochure"));
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


function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> {children}
    </div>
  );
}

/* ---------------- Datos ---------------- */

const STATS = [
  { v: String(aniosMyP()), l: "años en el mercado" },
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
    det: "Recomendado primero en arriendo de grúas eléctricas en Santiago, con contenido SEO hecho por nuestros agentes.",
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

const REPORTE = [
  {
    plataforma: 'Google Search',
    inversion: '$1.609.500',
    leads: 87,
    costoLead: '$18.500',
    ventasNum: 42,
    ventasMonto: '$6.762.000',
    costoCliente: '$38.320',
    proyeccion: '+15%',
    accion: 'incrementar',
    color: 'blue'
  },
  {
    plataforma: 'Google PMax',
    inversion: '$2.124.800',
    leads: 134,
    costoLead: '$15.860',
    ventasNum: 67,
    ventasMonto: '$10.454.000',
    costoCliente: '$31.700',
    proyeccion: '+22%',
    accion: 'incrementar',
    color: 'blue'
  },
  {
    plataforma: 'Google Remarketing',
    inversion: '$892.300',
    leads: 56,
    costoLead: '$15.930',
    ventasNum: 34,
    ventasMonto: '$5.168.000',
    costoCliente: '$26.240',
    proyeccion: '+8%',
    accion: 'modificar',
    color: 'blue'
  },
  {
    plataforma: 'Meta Formularios',
    inversion: '$1.456.200',
    leads: 203,
    costoLead: '$7.170',
    ventasNum: 89,
    ventasMonto: '$13.568.000',
    costoCliente: '$16.360',
    proyeccion: '+18%',
    accion: 'incrementar',
    color: 'purple'
  },
  {
    plataforma: 'Meta WhatsApp',
    inversion: '$1.817.600',
    leads: 312,
    costoLead: '$5.820',
    ventasNum: 142,
    ventasMonto: '$21.624.000',
    costoCliente: '$12.800',
    proyeccion: '+25%',
    accion: 'incrementar',
    color: 'purple'
  },
  {
    plataforma: 'Meta Remarketing',
    inversion: '$1.103.400',
    leads: 178,
    costoLead: '$6.200',
    ventasNum: 98,
    ventasMonto: '$14.896.000',
    costoCliente: '$11.260',
    proyeccion: '+12%',
    accion: 'incrementar',
    color: 'purple'
  },
  {
    plataforma: 'LinkedIn Ads',
    inversion: '$1.041.900',
    leads: 23,
    costoLead: '$45.300',
    ventasNum: 12,
    ventasMonto: '$4.896.000',
    costoCliente: '$86.820',
    proyeccion: '-5%',
    accion: 'pausar',
    color: 'cyan'
  },
  {
    plataforma: 'TikTok Ads',
    inversion: '$2.558.400',
    leads: 312,
    costoLead: '$8.200',
    ventasNum: 124,
    ventasMonto: '$18.848.000',
    costoCliente: '$20.630',
    proyeccion: '+30%',
    accion: 'incrementar',
    color: 'pink'
  }
]

const CAC_TABLA = [
  ['Google Search - Marca', '$28.400', '8.2%'],
  ['Google Search - Genérico', '$52.100', '4.1%'],
  ['Meta - Retargeting', '$31.800', '6.5%'],
  ['Meta - Prospecting', '$89.200', '2.3%'],
]

const METODOLOGIA = [
  ['Día 1', 'Plan de Trabajo', 'Roles claros, entregables definidos, expectativas alineadas.'],
  ['Semana 1', 'Benchmark + Setup', 'Análisis de mercado, competencia y configuración inicial de campañas.'],
  ['Semana 2', 'Lanzamiento', 'Campañas activas, testeo de mensajes y creatividades.'],
  ['Semana 3', 'Optimización', 'Ajustes según ciclo de venta y comparativa con competencia.'],
  ['Semana 4', 'Reporte 360°', 'Visión completa del negocio con métricas ejecutivas.'],
]

const HERRAMIENTAS = [
  { href: '/labs/mp-intelligence', t: 'M&P Intelligence', d: 'Benchmarks en tiempo real de Google Ads, Meta Ads y LinkedIn. Compara tu performance con la industria.', tag: '15 industrias' },
  { href: '/labs/buyer-gen', t: 'Buyer Gen', d: 'Genera buyer personas completas con IA en 4 pasos. Incluye estrategia de contenido y KPIs validados.', tag: 'IA generativa' },
  { href: '/labs/predictor', t: 'Predictor + Diagnóstico', d: 'Analiza tu negocio y descubre si Google, Meta o LinkedIn es mejor para ti. Proyección y alertas de viabilidad.', tag: 'Nuevo v2' },
  { href: '/utilidades/calculadora-cac', t: 'Calculadora CAC', d: 'Calcula el costo de adquisición de cliente y compara entre Google Ads, Meta y LinkedIn.', tag: '3 canales' },
  { href: '/utilidades/calculadora-ltv', t: 'Calculadora LTV', d: 'Calcula el valor de vida del cliente y optimiza tu inversión en marketing digital.', tag: 'LTV/CAC' },
  { href: '/labs/simulador-inversion', t: 'Simulador de inversión', d: 'Evalúa si tu negocio está listo para invertir en marketing digital. Anti-humo.', tag: 'Score M&P' },
]


/* ---------------- Componentes de sección ---------------- */

function Hero() {
  return (
    <section
      aria-label="Sección principal"
      className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_70%_0%,#1e3a8a_0%,#0b1640_45%,#081030_100%)] pt-32 text-white"
    >
      <div className="v2-grid absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-6 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Eyebrow>
            Performance marketing con datos reales · desde 2020
          </Eyebrow>
          <h1 className="text-[2.4rem] font-black uppercase leading-[0.98] tracking-tight sm:text-5xl xl:text-6xl">
            Agencia de Marketing Digital que vincula Marketing{" "}
            <span className="v2-shimmer">con Comercial</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-blue-100/80 md:text-xl">
            Convertimos tu inversión publicitaria en clientes. El primer paso es
            tener un número:{" "}
            <strong className="text-white">
              el costo de adquisición por tipo de campaña.
            </strong>{" "}
            Con ese dato puedes proyectar ventas y corregir errores.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contacto"
              className="v2-btn group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-slate-900 hover:bg-blue-50"
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
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 font-semibold hover:bg-white/10"
            >
              <MessageSquare className="h-5 w-5 text-emerald-400" /> Conversemos
              por WhatsApp
            </a>
          </div>
        </div>

        <div className="relative h-[380px] lg:h-[560px]" aria-hidden="true">
          <div className="absolute inset-0 m-auto h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.55),rgba(124,58,237,0.25)_45%,transparent_70%)] blur-2xl" />
          <SmartRobot scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
          {CHIPS.map((c) => (
            <div key={c.t} className={`v2-glass absolute hidden rounded-2xl px-4 py-3 shadow-2xl sm:block ${c.pos}`}>
              <p className="text-[11px] uppercase tracking-wider text-blue-200/70">{c.t}</p>
              <p className={`text-lg font-black ${c.c}`}>{c.v}</p>
            </div>
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
  const clientesSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Muller y Pérez",
    url: "https://www.mulleryperez.cl",
    description: "Agencia de Performance Marketing en Chile con más de 50 clientes activos en diversas industrias",
    knowsAbout: ["Performance Marketing", "Google Ads", "Meta Ads", "Marketing Digital Chile"],
    member: clients.map((c) => ({ "@type": "Organization", name: c.name, description: `Cliente de Muller y Pérez en el sector ${c.industry}`, ...(c.url ? { url: c.url } : {}) })),
  };
  return (
    <section
      aria-label="Clientes"
      className="relative overflow-hidden border-y border-white/5 bg-[#081030] py-10"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clientesSchema) }} />
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Empresas que confían en M&amp;P
      </p>
      <div className="v2-mask flex w-max animate-scroll-left gap-4">
        {row.map((c, i) => (
          <div key={i} className="flex h-16 w-44 shrink-0 items-center justify-center rounded-xl bg-white px-4">
            <Image
              src={c.logo}
              alt={`${c.name}, ${c.industry}`}
              {...logoSize(c.ar)}
              sizes="150px"
              className="object-contain"
            />
          </div>
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
      className="relative overflow-hidden bg-[#081030] py-28 text-white"
    >
      
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
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
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {VERDAD.si.map((q, i) => (
            <div
              key={q}
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
            </div>
          ))}
        </div>

        <div
          
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
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div
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
          </div>
          <div
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
          </div>
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
      className="relative overflow-hidden bg-[#0b1640] py-28 text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
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
        </div>

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
                <span className="flex items-center gap-2 rounded-lg bg-[#081030]/80 px-3 py-1.5 text-sm font-bold text-white">
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
      className="relative bg-[#081030] py-28 text-white"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
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
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {ARBOL.map((n, k) => (
            <button
              type="button"
              key={n.q}
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
            </button>
          ))}
        </div>

        <div
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
        </div>
      </div>
    </section>
  );
}

function Agentes() {
  return (
    <section
      aria-labelledby="agentes-t"
      className="relative overflow-hidden bg-[#0b1640] py-28 text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative order-2 flex h-[420px] items-center justify-center [perspective:1200px] lg:order-1 lg:h-[560px]" aria-hidden="true">
          <div className="absolute h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.45),transparent_70%)] blur-2xl" />
          <div className="relative h-[340px] w-[340px] [transform-style:preserve-3d] md:h-[420px] md:w-[420px]" style={{ transform: "rotateX(58deg)" }}>
            <div className="absolute inset-0 rounded-full border border-blue-300/30" />
            <div className="absolute inset-[18%] rounded-full border border-violet-300/30" />
            <div className="absolute inset-[36%] rounded-full border border-cyan-300/30" />
          </div>
          <div className="absolute flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 text-center text-sm font-black shadow-[0_20px_60px_-10px_rgba(99,102,241,0.8)]">
            M&amp;P<br />Agentes IA
          </div>
          {AGENTES.map((ag, k) => {
            const ang = (k / AGENTES.length) * Math.PI * 2 - Math.PI / 2
            const x = Math.cos(ang) * 175
            const y = Math.sin(ang) * 95
            return (
              <div key={ag.t} className="v2-glass absolute flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-xl"
                style={{ transform: `translate(${x}px, ${y}px)` }}>
                <ag.icon className="h-4 w-4 text-cyan-300" />{ag.t}
              </div>
            )
          })}
        </div>
        <div className="order-1 lg:order-2">
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
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-6">
        <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Casos comprobables de SEO y GEO
        </h3>
        <div className="grid gap-5 md:grid-cols-3">
          {CASOS_GEO.map((c) => (
            <div
              key={c.rubro}
              className="v2-glass v2-tilt rounded-2xl p-7"
            >
              <p className="text-sm text-slate-400">{c.rubro}</p>
              <p className="my-3 text-4xl font-black text-white">{c.dato}</p>
              <p className="text-slate-300">{c.det}</p>
              <p className="mt-4 text-xs text-slate-500">{c.fecha}</p>
            </div>
          ))}
          <div
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
          </div>
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
      className="relative overflow-hidden bg-[#081030] py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
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
        </div>
        <div className="hidden lg:block"><DesktopOnly><Marquee3D images={imgs} /></DesktopOnly></div>
        <div className="flex snap-x gap-4 overflow-x-auto pb-2 lg:hidden">
          {imgs.map((im) => (
            <a key={im.href} href={im.href} target="_blank" rel="noopener noreferrer" className="w-64 shrink-0 snap-start overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image src={im.src} alt={im.alt} width={480} height={270} sizes="256px" className="aspect-video w-full object-cover" />
              <p className="p-2 text-xs text-slate-300">{im.alt}</p>
            </a>
          ))}
        </div>
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
        <div className="text-center">
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
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIOS.map(([id, n]) => (
            <div
              key={id}
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
            </div>
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
      className="relative overflow-hidden bg-[#081030] py-28 text-white"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.25),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
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
        </div>
        <div className="mt-14 grid gap-6 [perspective:1200px] md:grid-cols-3">
          {PLANES.map((p, k) => (
            <div
              key={p.n}
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
            </div>
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
      className="relative overflow-hidden bg-[#081030] py-28 text-white"
    >
      <Spotlight className="-top-40 right-0" fill="#a78bfa" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2">
        <div>
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
        </div>
        <form
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
        </form>
      </div>
    </section>
  );
}



function Cac() {
  return (
    <section aria-labelledby="cac-t" className="relative overflow-hidden bg-[#0b1640] py-28 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <Eyebrow>Para el dueño / CEO</Eyebrow>
          <h2 id="cac-t" className="text-4xl font-black tracking-tight md:text-6xl">¿Cuánto te cuesta <span className="v2-shimmer">conseguir un cliente?</span></h2>
          <p className="mt-5 text-lg text-slate-400">Si no tienes ese número, estás invirtiendo a ciegas.</p>
          <ul className="mt-6 space-y-3 text-slate-300">
            <li><strong className="text-white">Proyección de ventas confiable:</strong> con CAC definido puedes proyectar cuántos clientes obtendrás con X presupuesto.</li>
            <li><strong className="text-white">ROI predecible:</strong> sabes cuánto invertir para crecer de forma sostenible.</li>
            <li><strong className="text-white">Decisiones basadas en datos:</strong> no en corazonadas o &quot;feeling&quot;.</li>
          </ul>
          <div className="mt-12">
            <Eyebrow>Para el gerente comercial</Eyebrow>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">Con estas tablas <span className="v2-shimmer">proyectas ventas</span></h2>
            <p className="mt-4 text-slate-400">Sabes exactamente cuántos leads necesitas para cerrar X ventas, y cuánto cuesta generarlos.</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><strong className="text-white">Proyección de pipeline:</strong> &quot;Si invierto $5M en Google Search, obtengo ~96 leads, cierro ~24 ventas&quot;.</li>
              <li><strong className="text-white">Optimización de presupuesto:</strong> asignas más a canales con mejor CAC.</li>
              <li><strong className="text-white">Corrección rápida:</strong> si el CAC sube, detectas el problema en días, no en meses.</li>
            </ul>
          </div>
        </div>
        <div className="[perspective:1400px]">
          <div style={{ transform: "rotateY(-10deg) rotateX(5deg)" }}
            className="v2-glass rounded-3xl p-6 shadow-[0_40px_100px_-30px_rgba(34,211,238,0.35)]">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-bold">Dashboard Comercial M&amp;P</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-400">Ejemplo ilustrativo</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-400">CAC promedio</p><p className="text-3xl font-black">$47.200</p><p className="text-xs text-emerald-400">↓ 18% vs mes anterior</p></div>
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-400">Clientes proyectados (próximo mes)</p><p className="text-3xl font-black">127</p><p className="text-xs text-slate-400">Con presupuesto actual</p></div>
            </div>
            <table className="mt-5 w-full text-sm">
              <caption className="mb-2 text-left text-xs text-slate-400">Tabla CAC por tipo de campaña</caption>
              <thead><tr className="text-left text-xs text-slate-500"><th className="py-2">Tipo de campaña</th><th>CAC</th><th>Conv. %</th></tr></thead>
              <tbody>
                {CAC_TABLA.map(([a, b, c]) => <tr key={a} className="border-t border-white/5"><td className="py-2.5 text-slate-200">{a}</td><td>{b}</td><td className="text-cyan-300">{c}</td></tr>)}
                <tr className="border-t border-white/10 font-bold"><td className="py-2.5">CAC ponderado</td><td>$47.200</td><td /></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function Metodologia() {
  return (
    <section aria-labelledby="metodologia" className="relative bg-[#081030] py-28 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <Eyebrow>Metodología</Eyebrow>
          <h2 id="metodologia" className="text-4xl font-black tracking-tight md:text-6xl">Metodología ordenada <span className="v2-shimmer">por semanas</span></h2>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 md:block" aria-hidden="true" />
          <ol className="grid gap-6 md:grid-cols-5">
            {METODOLOGIA.map(([sem, t, d], k) => (
              <li key={sem} className="relative">
                <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/40 bg-[#081030] text-sm font-black text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.35)]">{k + 1}</div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{sem}</p>
                <h3 className="mt-1 text-lg font-bold">{t}</h3>
                <p className="mt-1 text-sm text-slate-400">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Reporte() {
  const acc: Record<string, string> = { incrementar: 'bg-emerald-400/15 text-emerald-300', mantener: 'bg-amber-400/15 text-amber-300', pausar: 'bg-rose-400/15 text-rose-300', optimizar: 'bg-sky-400/15 text-sky-300', modificar: 'bg-sky-400/15 text-sky-300' }
  return (
    <section aria-labelledby="reporte-ejecutivo" className="relative overflow-hidden bg-[#0b1640] py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <Eyebrow>Reporte ejecutivo</Eyebrow>
          <h2 id="reporte-ejecutivo" className="text-4xl font-black tracking-tight md:text-6xl">Esto es lo que ningún cliente de M&amp;P <span className="v2-shimmer">deja de ver</span></h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-400">Este tipo de cuadro es lo que separa el &quot;me gusta tu post&quot; de <strong className="text-white">saber si realmente estás ganando clientes</strong> con tu inversión.</p>
        </div>
        <div className="v2-glass mt-12 overflow-x-auto rounded-3xl p-2">
          <table className="w-full min-w-[900px] text-sm">
            <caption className="p-3 text-right text-xs text-slate-500">Ejemplo ilustrativo</caption>
            <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-500">{['Plataforma', 'Inversión', 'Leads', 'Costo/lead', 'Venta #', 'Venta $', 'Costo/cliente', 'Proyección', 'Acción'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {REPORTE.map((r) => (
                <tr key={r.plataforma} className="border-t border-white/5 transition hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold">{r.plataforma}</td><td className="px-4">{r.inversion}</td><td className="px-4">{r.leads}</td><td className="px-4">{r.costoLead}</td>
                  <td className="px-4">{r.ventasNum}</td><td className="px-4">{r.ventasMonto}</td><td className="px-4 text-cyan-300">{r.costoCliente}</td><td className="px-4 text-emerald-300">{r.proyeccion}</td>
                  <td className="px-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${acc[r.accion] || 'bg-white/10'}`}>{r.accion}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">CPL = costo por lead · Venta # = número de ventas cerradas · Venta $ = monto total de ventas · Costo/cliente = costo de adquisición por cliente · Proyección = crecimiento proyectado del mes siguiente</p>
      </div>
    </section>
  )
}

function ToolPreview({ k }: { k: number }) {
  // Mini pantallas en CSS (sin imágenes): una por herramienta
  const bars = [62, 88, 45, 74, 96, 58]
  if (k === 0) return (
    <div className="flex h-full items-end gap-1.5 p-3">
      {bars.map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-blue-500 to-cyan-300" style={{ height: `${h}%` }} />)}
    </div>
  )
  if (k === 1) return (
    <div className="flex h-full items-center gap-3 p-3">
      <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
      <div className="flex-1 space-y-1.5"><div className="h-2 w-3/4 rounded bg-white/70" /><div className="h-2 w-1/2 rounded bg-white/40" /><div className="h-2 w-2/3 rounded bg-white/30" /></div>
    </div>
  )
  if (k === 2) return (
    <div className="flex h-full items-center justify-center p-3">
      <div className="relative h-16 w-32 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 rounded-full border-[10px] border-white/15 border-t-emerald-400 border-r-cyan-400" />
        <p className="absolute inset-x-0 bottom-0 text-center text-lg font-black">78</p>
      </div>
    </div>
  )
  if (k === 3) return (
    <div className="grid h-full grid-cols-3 gap-2 p-3 text-center text-[10px]">
      {[['Google', '$38K'], ['Meta', '$21K'], ['LinkedIn', '$86K']].map(([c, v]) => <div key={c} className="flex flex-col justify-center rounded-lg bg-white/10"><span className="text-blue-200/70">{c}</span><span className="text-sm font-black">{v}</span></div>)}
    </div>
  )
  if (k === 4) return (
    <svg viewBox="0 0 120 50" className="h-full w-full p-3" aria-hidden="true">
      <polyline points="0,45 20,38 40,40 60,26 80,22 100,12 120,6" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" />
      <polyline points="0,45 20,38 40,40 60,26 80,22 100,12 120,6 120,50 0,50" fill="rgba(103,232,249,0.15)" />
    </svg>
  )
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-3">
      {[['Margen', 80], ['Demanda', 65], ['Operación', 45]].map(([l, v]) => (
        <div key={l as string} className="text-[10px]"><div className="mb-0.5 flex justify-between text-blue-200/70"><span>{l}</span><span>{v}</span></div><div className="h-1.5 rounded bg-white/10"><div className="h-1.5 rounded bg-gradient-to-r from-amber-300 to-rose-400" style={{ width: `${v}%` }} /></div></div>
      ))}
    </div>
  )
}

const TOOL_ICONS = [LineChart, Sparkles, Target, Search, ArrowRight, ShieldCheck]
const TOOL_COLORS = ['from-blue-500 to-cyan-400', 'from-violet-500 to-fuchsia-400', 'from-emerald-400 to-cyan-400', 'from-sky-400 to-blue-600', 'from-cyan-400 to-teal-400', 'from-amber-400 to-rose-400']

function Herramientas() {
  return (
    <section aria-labelledby="tools-t" className="relative overflow-hidden bg-[#081030] py-28 text-white">
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.25),transparent)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <Eyebrow>Herramientas gratuitas</Eyebrow>
          <h2 id="tools-t" className="text-4xl font-black tracking-tight md:text-6xl">Herramientas profesionales <span className="v2-shimmer">100% gratis</span></h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100/70">Potencia tu estrategia de marketing con nuestras herramientas basadas en datos reales de campañas en Chile.</p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {HERRAMIENTAS.map((h, k) => {
            const Icon = TOOL_ICONS[k]
            return (
              <Link key={h.href} href={h.href} className="tool3d group block [perspective:1000px]">
                <div className="tool3d-card relative flex h-full flex-col rounded-3xl border border-blue-300/20 bg-gradient-to-b from-white/[0.09] to-white/[0.03] p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
                  <div className="tool3d-screen mb-6 h-32 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b4d] shadow-[0_25px_50px_-20px_rgba(59,130,246,0.6)]">
                    <ToolPreview k={k} />
                  </div>
                  <div className="flex items-start gap-4">
                    <div className={`tool3d-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${TOOL_COLORS[k]} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">{h.tag}</span>
                      <h3 className="text-xl font-bold">{h.t}</h3>
                    </div>
                  </div>
                  <p className="mt-3 flex-1 text-sm text-blue-100/70">{h.d}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white">Usar gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mt-10 text-center"><Link href="/labs" className="font-semibold text-cyan-300 hover:text-cyan-200">Ver todas las herramientas →</Link></div>
      </div>
    </section>
  )
}

function Nosotros() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-t" className="relative overflow-hidden bg-[#0b1640] py-28 text-white">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2">
        <div>
          <Eyebrow>Quiénes somos</Eyebrow>
          <h2 id="nosotros-t" className="text-4xl font-black tracking-tight md:text-6xl">M&amp;P = <span className="v2-shimmer">Marketing &amp; Performance</span></h2>
          <p className="mt-5 text-lg text-slate-400">20+ años de experiencia en empresas que viven de números, no de likes.</p>
          <div className="v2-glass mt-8 rounded-2xl p-6">
            <h3 className="text-xl font-bold"><Link href="/equipo/christopher-muller" className="hover:underline">Christopher Müller</Link></h3>
            <p className="text-sm text-cyan-300">Fundador y Director de Estrategia</p>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li>Ingeniero Civil Industrial, Universidad de Chile</li>
              <li>MBA + experto en marketing digital y herramientas de IA</li>
              <li>Ex Cencosud, Transbank, Banco Internacional y Hibu (empresa inglesa líder en marketing digital)</li>
              <li>Marketing con foco en performance, ROI y metodología de ingeniería</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 content-center gap-4">
          {[['3', 'Áreas especializadas: Paid Media, Publicista, Diseñador'], ['+20', 'Profesionales en equipo; cada cliente recibe 3 asignados'], ['7', 'Años en el mercado'], ['+$800M', 'Gestionados en inversión publicitaria']].map(([v, l], k) => (
            <div key={l} className="v2-glass v2-tilt rounded-2xl p-6">
              <p className="text-4xl font-black">{v}</p><p className="mt-2 text-sm text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FairPlay() {
  return (
    <section aria-labelledby="fair-t" className="bg-[#081030] py-28 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <Eyebrow>Así trabajamos contigo</Eyebrow>
          <h2 id="fair-t" className="text-4xl font-black tracking-tight md:text-6xl">Fair Play &amp; <span className="v2-shimmer">Orden</span></h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="v2-glass v2-tilt rounded-3xl p-8">
            <h3 className="text-2xl font-bold">Todo tiene orden</h3>
            <ul className="mt-5 space-y-3 text-slate-300">
              {['Reuniones semanales o quincenales según el plan', 'Grupo de WhatsApp para consultas rápidas', 'Acceso a CRM para ver el estado de tus leads en tiempo real', 'Reportes ejecutivos semanales y mensuales automáticos'].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />{x}</li>)}
            </ul>
          </div>
          <div className="v2-glass v2-tilt rounded-3xl p-8">
            <h3 className="text-2xl font-bold">Fair Play en cobros</h3>
            <p className="mt-5 text-slate-300"><strong className="text-white">Trabajos adicionales fuera del plan: se cobran aparte.</strong> Ej: diseñar menú para restaurant, folleto para evento, video institucional.</p>
            <ul className="mt-4 space-y-3 text-slate-300">
              {['Siempre avisamos antes de hacer trabajos extra', 'Presupuestos claros y anticipados'].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />{x}</li>)}
            </ul>
            <p className="mt-5 text-slate-400"><strong className="text-white">Transparencia total.</strong> Sabes qué estás pagando, qué incluye, y qué queda fuera.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomeV2() {
  return (
    <div className="bg-[#081030] antialiased">
      {[businessSchema, organizationSchema, faqSchema, serviceSchema].map(
        (s, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
          />
        ),
      )}
      <SiteHeader />
      <main>
        <Hero />
        <Logos />
        <Verdad />
        <Cac />
        <Areas />
        <Arbol />
        <Metodologia />
        <Reporte />
        <Agentes />
        <Herramientas />
        <Videos />
        <PortfolioBrochure />
        <Nosotros />
        <FairPlay />
        <Casos />
        <Testimonios />
        <Planes />
        <Faq />
        <Contacto />
      </main>
    </div>
  );
}
