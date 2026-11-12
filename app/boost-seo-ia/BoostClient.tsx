"use client";

/**
 * Boost SEO + IA — rediseño 12 nov 2026 con el lenguaje visual del home (v2-glass, v2-shimmer, v2-grid).
 * Precio: setup $490.000 + mensualidad $400.000 + IVA. Cifra y glosario de agentes desde lib/agentes-activos.
 */

import React, { useState } from "react";
import {
  ArrowRight,
  Calendar,
  MessageSquare,
  Search,
  Wrench,
  PenTool,
  FileText,
  Bot,
  Trophy,
  LineChart,
  Code2,
  CheckCircle2,
  Sparkles,
  ClipboardCheck,
  FileSearch,
  MapPin,
  Plus,
  Minus,
} from "lucide-react";
import { trackLead, trackWhatsAppClick } from "@/lib/meta-pixel";
import {
  AGENTES_ACTIVOS,
  AGENTES_EJECUCIONES_30D,
} from "@/lib/agentes-activos";

/* ---------------- Datos ---------------- */

const WA =
  "https://wa.me/56992258137?text=Hola%20Christopher,%20me%20interesa%20Boost%20SEO%20%2B%20IA";

const PASOS = [
  {
    i: Search,
    t: "Medimos",
    d: "En qué posición apareces en Google, si ChatGPT, Gemini y Perplexity te recomiendan y a quién nombran en tu lugar.",
  },
  {
    i: Wrench,
    t: "Arreglamos",
    d: "Estructura del sitio, datos estructurados, indexación y ficha de Google, para que buscadores e IA entiendan qué vendes.",
  },
  {
    i: PenTool,
    t: "Publicamos",
    d: "20 artículos y 4 rankings al mes sobre lo que buscan tus clientes. Un segundo agente revisa cada uno antes de salir.",
  },
  {
    i: FileText,
    t: "Te informamos",
    d: "Medimos cada semana y el primer día hábil del mes recibes el informe: dónde estás y qué cambió.",
  },
];

const SETUP = [
  "Auditoría SEO + GEO con línea base en Google, ChatGPT, Gemini y Perplexity",
  "H1, H2, títulos, meta descripciones, textos alternativos y enlaces internos",
  "Schemas: Organization o LocalBusiness, FAQPage, servicios y breadcrumbs",
  "Search Console, Bing Webmaster, sitemap, robots, canonical e IndexNow",
  "Google Business Profile, directorios y datos de la empresa coherentes",
  "5 artículos iniciales con preguntas frecuentes",
];

const MENSUAL = [
  {
    n: "20",
    t: "artículos al mes",
    d: "Uno por día hábil, con tablas, preguntas frecuentes y enlaces internos, revisados antes de publicar.",
  },
  {
    n: "4",
    t: "rankings al mes",
    d: "Cada viernes, una comparativa del rubro con fuentes citadas y verificadas.",
  },
  {
    n: "20",
    t: "búsquedas medidas cada semana",
    d: "En Google, más un set fijo de preguntas en ChatGPT, cada una medida 3 veces.",
  },
  {
    n: "1",
    t: "informe mensual",
    d: "El primer día hábil: posiciones, apariciones en IA, lo publicado, lo ajustado y lo que viene.",
  },
  {
    n: "100%",
    t: "de lo publicado indexado",
    d: "Cada artículo se envía a Google y Bing el mismo día.",
  },
  {
    n: "1",
    t: "revisión técnica al mes",
    d: "Títulos, metas, enlaces internos y datos estructurados según lo que muestran las mediciones.",
  },
];

const POR_QUE = [
  {
    i: Bot,
    t: "Usamos la IA de verdad, no en el discurso",
    d: `${AGENTES_ACTIVOS} agentes en producción y ${AGENTES_EJECUCIONES_30D} ejecuciones exitosas en los últimos 30 días, con registro público. Pídele a tu agencia actual que te muestre el suyo.`,
    href: "/agentes-ia",
    cta: "Ver el registro",
  },
  {
    i: Trophy,
    t: "Resultados con nombre y apellido",
    d: 'Invas WMS #1 y #2 en Google para "mejor WMS Chile". DevuelveMiPie #1 para "abogado inmobiliario pie Chile". Wiseplan #1 para "outsourcing RRHH vs interno".',
    href: "/casos-de-exito",
    cta: "Ver casos",
  },
  {
    i: LineChart,
    t: "Somos agencia de performance",
    d: "Desde 2020, más de 50 clientes y más de 200 campañas activas en Google y Meta. Trabajamos el SEO y la IA pensando en ventas, no en visitas. 5,0 en Google con 115 reseñas.",
    href: null,
    cta: "",
  },
  {
    i: Code2,
    t: "Lo construimos nosotros",
    d: "Agentes, predictor de campañas, CRM y paneles por cliente son desarrollo propio. No revendemos una herramienta: la hacemos y la operamos.",
    href: "/labs",
    cta: "Ver M&P Labs",
  },
];

/* Equipo de agentes por cliente, por categoría. Texto en primera persona (cómo se presenta cada agente). */
const EQUIPO = [
  {
    c: "Auditoría",
    i: ClipboardCheck,
    agentes: [
      { n: "Auditor SEO + GEO", f: "Al partir", d: "Reviso tu sitio completo: estructura, títulos, datos estructurados, velocidad e indexación, y qué dicen hoy las IA de tu rubro. Con eso dejo la línea base." },
    ],
  },
  {
    c: "Contenido",
    i: PenTool,
    agentes: [
      { n: "Blog diario", f: "Lunes a viernes", d: "Escribo y publico un artículo por día hábil sobre lo que buscan tus clientes, con tablas, preguntas frecuentes y enlaces internos." },
      { n: "Ranking semanal", f: "Viernes", d: "Cada semana publico una comparativa de tu rubro: el formato que más citan Google y las IA." },
      { n: "Ranking de nicho", f: "Mensual", d: "Armo rankings de tu nicho específico con fuentes que verifico una por una, para posicionarte donde está tu cliente ideal." },
      { n: "Revisor editorial", f: "Cada publicación", d: "Leo todo antes de que salga: repeticiones, relleno, cifras, ortografía, tildes y lo que tu empresa no quiere que se diga." },
      { n: "Verificador de fuentes", f: "Cada publicación", d: "Compruebo que cada enlace citado funcione y que cada cita exista en la página de origen." },
    ],
  },
  {
    c: "Indexación",
    i: FileSearch,
    agentes: [
      { n: "Agente de indexación", f: "Cada publicación", d: "Apenas sale un artículo lo envío a Google y Bing, actualizo el sitemap y reviso en Search Console qué páginas quedaron fuera para corregirlas." },
    ],
  },
  {
    c: "Google Business Profile",
    i: MapPin,
    agentes: [
      { n: "Gestor de ficha de Google", f: "Mensual", d: "Mantengo tu ficha de Google coherente con tu sitio y los directorios: datos, categorías, servicios y publicaciones. Es una de las fuentes que más leen las IA." },
    ],
  },
  {
    c: "GEO: visibilidad en IA",
    i: Sparkles,
    agentes: [
      { n: "Agente que consulta a las IA", f: "Semanal", d: "Le pregunto a ChatGPT lo mismo que preguntaría tu cliente, 3 veces cada pregunta, y anoto si te nombra, en qué lugar y a quién recomienda en tu lugar." },
      { n: "Medidor de Google", f: "Semanal", d: "Mido tu posición en hasta 20 búsquedas de tu rubro, sin personalización, para comparar semana a semana con la misma vara." },
    ],
  },
  {
    c: "Reportes y control",
    i: FileText,
    agentes: [
      { n: "Agente que reporta", f: "Primer día hábil del mes", d: "Te envío el informe: posiciones en Google, apariciones en IA, lo publicado, lo ajustado y lo que viene. Si un dato falla, no lo mando." },
      { n: "Agente supervisor", f: "Todos los días", d: "Reviso cada mañana que todos los agentes hayan corrido; si alguno falla, lo relanzo y aviso al equipo de M&P." },
    ],
  },
];

const PREGUNTAS_IA = [
  "¿Qué es Muller y Pérez (mulleryperez.cl)? Compárala con otras agencias de marketing digital en Chile.",
  "¿Quién es Christopher Müller, fundador de la agencia Muller y Pérez?",
];
const IAS: { n: string; url: (q: string) => string }[] = [
  {
    n: "ChatGPT",
    url: (q) => "https://chatgpt.com/?q=" + encodeURIComponent(q),
  },
  {
    n: "Claude",
    url: (q) => "https://claude.ai/new?q=" + encodeURIComponent(q),
  },
  {
    n: "Perplexity",
    url: (q) => "https://www.perplexity.ai/search?q=" + encodeURIComponent(q),
  },
  {
    n: "Gemini",
    url: (q) =>
      "https://www.google.com/search?udm=50&q=" + encodeURIComponent(q),
  },
];

const CASOS = [
  {
    c: "Invas WMS",
    r: "#1 y #2 en Google",
    k: '"mejor WMS Chile"',
    d: "Software de bodegas. Además aparece en las respuestas de las IA consultadas.",
  },
  {
    c: "DevuelveMiPie",
    r: "#1 en Google",
    k: '"abogado inmobiliario pie Chile"',
    d: "Estudio jurídico. Blog con agentes desde agosto de 2026.",
  },
  {
    c: "Wiseplan",
    r: "#1 en Google",
    k: '"outsourcing RRHH vs interno"',
    d: "Consultora de recursos humanos. Agentes de blog y ranking semanal.",
  },
];

const FAQS = [
  {
    q: "¿Qué es GEO?",
    a: "GEO (Generative Engine Optimization) es lograr que las inteligencias artificiales como ChatGPT, Gemini o Perplexity mencionen y recomienden tu empresa cuando alguien pregunta por tu rubro. Se trabaja con contenido propio, datos estructurados y presencia coherente en directorios y medios.",
  },
  {
    q: "¿Qué incluye exactamente el setup de $490.000?",
    a: "Auditoría SEO + GEO con línea base; H1, H2, títulos, meta descripciones, textos alternativos y enlaces internos; schemas Organization o LocalBusiness, FAQPage, servicios y breadcrumbs; Search Console, Bing Webmaster, sitemap, robots, canonical e IndexNow; Google Business Profile y directorios; y 5 artículos iniciales.",
  },
  {
    q: "¿Qué incluye la mensualidad de $400.000?",
    a: "Cada mes: 20 artículos publicados en tu sitio (uno por día hábil) y 4 rankings o comparativas del rubro, todos revisados antes de salir; medición semanal de hasta 20 búsquedas en Google y de un set fijo de preguntas en ChatGPT, cada una 3 veces; indexación en Google y Bing de cada publicación; ajustes técnicos; y un informe completo el primer día hábil del mes.",
  },
  {
    q: "¿Hay permanencia mínima?",
    a: "Sí, 3 meses para los agentes. Es el plazo mínimo para que Google y las IA alcancen a reflejar el trabajo. El setup es un pago único.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Acceso de administrador a tu sitio. En WordPress funciona directo. Otros sistemas (Shopify, Wix, sitios a medida) quedan sujetos a una revisión técnica previa: si el servidor bloquea las cargas o no hay forma de publicar, se coordina con tu desarrollador antes de partir.",
  },
  {
    q: "¿Los artículos los escribe una IA?",
    a: "Sí, con IA supervisada. Cada artículo pasa por un revisor editorial y un verificador de fuentes, con reglas propias de tu empresa (datos, tono, lo que se puede y no se puede decir), antes de publicarse.",
  },
  {
    q: "¿En cuánto tiempo veo resultados?",
    a: "El setup queda listo en 2 a 3 semanas. Las posiciones en Google y las menciones en IA suelen empezar a moverse entre el primer y el tercer mes, según la competencia de tu rubro. No prometemos posiciones: medimos cada semana y te mostramos en el informe mensual dónde estás.",
  },
  {
    q: "¿Necesito tener campañas pagadas con M&P?",
    a: "No. Boost SEO + IA se contrata solo. Si además trabajas tus campañas con nosotros, se coordina con tu plan.",
  },
];

/* ---------------- Piezas ---------------- */

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={
        light
          ? "mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700"
          : "mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300"
      }
    >
      <span
        className={
          light
            ? "h-1.5 w-1.5 rounded-full bg-blue-600"
            : "h-1.5 w-1.5 rounded-full bg-cyan-300"
        }
      />{" "}
      {children}
    </div>
  );
}

const DARK =
  "relative overflow-hidden bg-[radial-gradient(120%_80%_at_70%_0%,#1e3a8a_0%,#0b1640_45%,#081030_100%)] text-white";

/* ---------------- Página ---------------- */

export default function BoostClient() {
  const [faq, setFaq] = useState(-1);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    sitio: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");


  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          solicitud: "Boost SEO + IA\n\nSitio web: " + form.sitio,
          destinatario: "contacto@mulleryperez.cl",
          fuente: "landing-boost-seo-ia",
        }),
      });
      if (res.ok) {
        setEnviado(true);
        trackLead({ nombre: form.nombre, email: form.email, telefono: form.telefono, servicio: "boost-seo-ia", fuente: "landing-boost-seo-ia" });
      } else setError("No se pudo enviar. Escríbenos por WhatsApp.");
    } catch {
      setError("No se pudo enviar. Escríbenos por WhatsApp.");
    }
    setEnviando(false);
  }

  return (
    <main className="font-sans">
      {/* HERO */}
      <section aria-label="Boost SEO + IA" className={`${DARK} pt-32`}>
        <div className="v2-grid absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16">
          <Eyebrow>Boost SEO + IA · Google + ChatGPT + Gemini</Eyebrow>
          <h1 className="max-w-4xl text-[2.4rem] font-black uppercase leading-[0.98] tracking-tight sm:text-5xl xl:text-6xl">
            Que Google y la IA{" "}
            <span className="v2-shimmer">recomienden tu empresa</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-blue-100/80 md:text-xl">
            Dejamos tu sitio listo para Google y para las inteligencias
            artificiales. Después, nuestros agentes publican, miden y ajustan
            todos los meses.{" "}
            <strong className="text-white">
              Una herramienta te dice dónde estás; nosotros hacemos el trabajo.
            </strong>
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contacto"
              className="v2-btn group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-slate-900 hover:bg-blue-50"
            >
              <Calendar className="h-5 w-5" /> Agenda una reunión
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({
                  page: "boost-seo-ia",
                  servicio: "boost-seo-ia",
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 font-semibold hover:bg-white/10"
            >
              <MessageSquare className="h-5 w-5 text-emerald-400" /> Conversemos
              por WhatsApp
            </a>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { v: String(AGENTES_ACTIVOS), l: "agentes IA en producción" },
              { v: "20", l: "artículos al mes por cliente" },
              { v: "4", l: "rankings del rubro al mes" },
              { v: "2–3 sem", l: "para dejar listo el setup" },
            ].map((s) => (
              <div
                key={s.l}
                className="v2-glass rounded-2xl px-4 py-5 text-center"
              >
                <div className="text-3xl font-black tabular-nums md:text-4xl">
                  {s.v}
                </div>
                <div className="mt-1 text-xs font-medium text-slate-400 md:text-sm">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMA + 4 PASOS */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <Eyebrow light>Qué hacemos</Eyebrow>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Tus clientes ya no solo buscan en Google:{" "}
              <span className="text-blue-600">le preguntan a la IA</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Cuando alguien le pide a ChatGPT o a Gemini que le recomiende un
              proveedor de tu rubro, la respuesta sale de lo que esas IA
              encuentran publicado y citado en la web. Si tu sitio no está bien
              armado, no publica contenido útil y no aparece en directorios, no
              existes en esa respuesta. Trabajamos las dos cosas a la vez, en
              cuatro pasos.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p, i) => (
              <div
                key={p.t}
                className="v2-tilt rounded-2xl border border-slate-200 bg-slate-50 p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg">
                    <p.i className="h-6 w-6" />
                  </div>
                  <span className="text-5xl font-black text-slate-200">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-black text-slate-900">
                  {p.t}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ NOSOTROS */}
      <section
        aria-labelledby="porque-t"
        className="relative overflow-hidden bg-[#0b1640] py-28 text-white"
      >
        <div className="v2-grid absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <Eyebrow>Por qué M&amp;P</Eyebrow>
          <h2
            id="porque-t"
            className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl"
          >
            Todas dicen que usan IA.{" "}
            <span className="v2-shimmer">Nosotros lo demostramos.</span>
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {POR_QUE.map((p) => (
              <div key={p.t} className="v2-glass v2-tilt rounded-2xl p-8">
                <p.i className="h-8 w-8 text-cyan-300" />
                <h3 className="mt-5 text-2xl font-black">{p.t}</h3>
                <p className="mt-3 leading-relaxed text-blue-100/75">{p.d}</p>
                {p.href && (
                  <a
                    href={p.href}
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    {p.cta} <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Pregúntale a la IA */}
          <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/25 to-violet-600/25 p-8 md:p-12">
            <div className="flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-amber-300" />
              <h3 className="text-3xl font-black md:text-4xl">
                No nos creas a nosotros: pregúntale a la IA
              </h3>
            </div>
            <p className="mt-4 max-w-3xl text-lg text-blue-100/80">
              Es lo mismo que vas a querer para tu empresa: que cuando alguien
              pregunte, la IA sepa quién eres. Haz la prueba con nosotros.
            </p>
            <div className="mt-8 divide-y divide-white/10">
              {PREGUNTAS_IA.map((q) => (
                <div
                  key={q}
                  className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <p className="text-lg font-semibold lg:max-w-xl">
                    &ldquo;{q}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {IAS.map((ia) => (
                      <a
                        key={ia.n}
                        href={ia.url(q)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white hover:text-slate-900"
                      >
                        {ia.n}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TU EQUIPO DE AGENTES (por categoría, unificado para el cliente) */}
      <section aria-labelledby="agentes-t" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow light>Tu equipo de agentes</Eyebrow>
          <h2 id="agentes-t" className="max-w-4xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Un equipo completo trabajando en tu sitio. <span className="text-blue-600">Así lo explica cada agente.</span>
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-slate-600">
            No contratas un blog automático: contratas un equipo de agentes coordinado, que audita, escribe, indexa, pregunta a las IA y
            te reporta. Todo en un solo servicio.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {EQUIPO.map((cat) => (
              <div key={cat.c} className="v2-tilt flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg">
                    <cat.i className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{cat.c}</h3>
                </div>
                <div className="mt-6 space-y-5">
                  {cat.agentes.map((a) => (
                    <div key={a.n}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-bold text-slate-900">{a.n}</p>
                        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-blue-600">{a.f}</span>
                      </div>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">&ldquo;{a.d}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <a href="/agentes-ia" className="mt-10 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700">
            Ver el registro público de ejecuciones de nuestros {AGENTES_ACTIVOS} agentes <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* PRECIOS */}
      <section
        id="precios"
        aria-labelledby="precios-t"
        className={`${DARK} py-28`}
      >
        <div className="v2-grid absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <Eyebrow>Precios</Eyebrow>
          <h2
            id="precios-t"
            className="text-4xl font-black tracking-tight md:text-6xl"
          >
            Un setup y <span className="v2-shimmer">una mensualidad</span>
          </h2>
          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="v2-glass rounded-3xl p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200/70">
                Setup SEO + GEO
              </p>
              <p className="mt-4 text-5xl font-black">$490.000</p>
              <p className="mt-1 text-slate-400">
                + IVA, pago único · listo en 2 a 3 semanas
              </p>
              <ul className="mt-8 space-y-3">
                {SETUP.map((s) => (
                  <li key={s} className="flex gap-3 text-blue-100/85">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />{" "}
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-violet-700 p-8 shadow-[0_40px_100px_-30px_rgba(99,102,241,0.7)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                Agentes IA · todos los meses
              </p>
              <p className="mt-4 text-5xl font-black">$400.000</p>
              <p className="mt-1 text-blue-100/80">
                + IVA al mes · permanencia mínima de 3 meses
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {MENSUAL.map((m) => (
                  <div key={m.t} className="rounded-2xl bg-white/10 p-5">
                    <p className="text-3xl font-black">
                      {m.n} <span className="text-base font-bold">{m.t}</span>
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-blue-50/85">
                      {m.d}
                    </p>
                  </div>
                ))}
              </div>
              <a
                href="#contacto"
                className="v2-btn mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-slate-900 hover:bg-blue-50"
              >
                Quiero el Boost <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <p className="mt-8 max-w-4xl text-sm text-slate-400">
            Requisito técnico: acceso de administrador a tu sitio. En WordPress
            funciona directo; Shopify, Wix y sitios a medida pasan por una
            revisión técnica previa con tu desarrollador.
          </p>
        </div>
      </section>

      {/* CASOS */}
      <section aria-labelledby="casos-t" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow light>Resultados</Eyebrow>
          <h2
            id="casos-t"
            className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl"
          >
            Clientes con agentes,{" "}
            <span className="text-blue-600">posiciones medidas</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {CASOS.map((c) => (
              <div
                key={c.c}
                className="v2-tilt rounded-2xl bg-slate-50 p-8 shadow-xl ring-1 ring-slate-200"
              >
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                  {c.c}
                </p>
                <p className="mt-3 text-4xl font-black text-blue-600">{c.r}</p>
                <p className="mt-1 font-semibold text-slate-900">{c.k}</p>
                <p className="mt-4 text-slate-600">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-400">
            Posiciones medidas por M&amp;P en septiembre de 2026.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-t" className="bg-slate-50 py-28">
        <div className="mx-auto max-w-4xl px-6">
          <h2
            id="faq-t"
            className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl"
          >
            Preguntas frecuentes
          </h2>
          <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button
                  onClick={() => setFaq(faq === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold text-slate-900"
                  aria-expanded={faq === i}
                >
                  {f.q}
                  {faq === i ? (
                    <Minus className="h-5 w-5 shrink-0 text-blue-600" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-blue-600" />
                  )}
                </button>
                <p
                  className={
                    faq === i
                      ? "px-6 pb-6 leading-relaxed text-slate-600"
                      : "sr-only"
                  }
                >
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section
        id="contacto"
        aria-labelledby="contacto-t"
        className={`${DARK} py-28`}
      >
        <div className="v2-grid absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <Eyebrow>Contacto</Eyebrow>
            <h2
              id="contacto-t"
              className="text-4xl font-black tracking-tight md:text-6xl"
            >
              Agenda una <span className="v2-shimmer">reunión</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg text-blue-100/80">
              Déjanos tu sitio y te contactamos para conversar cómo apareces hoy
              en Google y en las IA, y qué haríamos en tu caso.
            </p>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({
                  page: "boost-seo-ia-contacto",
                  servicio: "boost-seo-ia",
                })
              }
              className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 font-semibold hover:bg-white/10"
            >
              <MessageSquare className="h-5 w-5 text-emerald-400" /> O
              escríbenos por WhatsApp
            </a>
          </div>
          <div className="v2-glass rounded-3xl p-8">
            {enviado ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <p className="mt-4 text-2xl font-black">Recibimos tus datos</p>
                <p className="mt-2 text-blue-100/80">
                  Te contactamos dentro del día hábil.
                </p>
              </div>
            ) : (
              <form onSubmit={enviar} className="space-y-4">
                {[
                  { k: "nombre", p: "Nombre", t: "text" },
                  { k: "email", p: "Correo", t: "email" },
                  { k: "telefono", p: "Teléfono", t: "tel" },
                  {
                    k: "sitio",
                    p: "Sitio web (ej: www.tuempresa.cl)",
                    t: "text",
                  },
                ].map((c) => (
                  <input
                    key={c.k}
                    required={c.k !== "telefono"}
                    type={c.t}
                    placeholder={c.p}
                    value={form[c.k as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [c.k]: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-white placeholder:text-blue-100/50 focus:border-cyan-300 focus:outline-none"
                  />
                ))}
                {error && <p className="text-sm text-rose-300">{error}</p>}
                <button
                  type="submit"
                  disabled={enviando}
                  className="v2-btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-slate-900 hover:bg-blue-50 disabled:opacity-60"
                >
                  {enviando ? "Enviando..." : "Quiero el Boost"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
