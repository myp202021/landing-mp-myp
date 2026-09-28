/**
 * /agentes-ia — Agentes de IA de M&P en producción, con su registro real de ejecuciones.
 * Lista SOLO agentes con ≥70% de ejecuciones exitosas en 30 días.
 * Datos: data/agentes-ia.json (inventario) + data/agentes-evidencia.json (GitHub Actions, refresco semanal).
 * Pieza central: el tablero de 30 días (una fila por agente, un cuadro por día).
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import {
  createMetadata,
  createFAQPageSchema,
} from "@/lib/metadata";
import inventario from "@/data/agentes-ia.json";
import evidencia from "@/data/agentes-evidencia.json";

export const metadata: Metadata = createMetadata({
  title: "Agentes de IA en producción y su registro de ejecuciones",
  description:
    "Los agentes de inteligencia artificial que Muller y Pérez tiene corriendo para sus clientes: qué hace cada uno, cada cuánto corre y su registro real de ejecuciones de los últimos 30 días.",
  keywords: [
    "agentes de ia",
    "agentes ia marketing",
    "agencia de marketing con inteligencia artificial",
    "agencia marketing ia chile",
    "agentes inteligencia artificial empresas chile",
    "automatización con ia",
  ],
  path: "/agentes-ia",
});

type Agente = {
  id: string;
  nombre: string;
  area: string;
  que_hace: string;
  frecuencia: string;
  url_publica: string | null;
};
type Evidencia = {
  tipo: string;
  ejecuciones_30d?: number;
  exitosas_30d?: number;
  ultima_exitosa?: string | null;
  dias?: Record<string, string>;
};

const EV = evidencia as unknown as {
  generado: string;
  agentes: Record<string, Evidencia>;
};

function funciona(e?: Evidencia) {
  if (!e || e.tipo !== "workflow" || !e.exitosas_30d || !e.ejecuciones_30d)
    return false;
  return e.exitosas_30d / e.ejecuciones_30d >= 0.7;
}

const activos = (inventario as Agente[]).filter((a) =>
  funciona(EV.agentes[a.id]),
);
const totalEjecuciones = activos.reduce(
  (s, a) => s + (EV.agentes[a.id].exitosas_30d || 0),
  0,
);

// Ventana de 30 días que termina el día en que se generó el registro (hora de Chile)
const fin = new Date(EV.generado);
const DIAS: string[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(fin.getTime() - (29 - i) * 86400000);
  return d.toLocaleDateString("sv-SE", { timeZone: "America/Santiago" });
});

function fechaCorta(iso?: string | null) {
  if (!iso) return "sin registro";
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    timeZone: "America/Santiago",
  });
}
const rango = `${fechaCorta(DIAS[0] + "T15:00:00Z")} al ${fechaCorta(DIAS[29] + "T15:00:00Z")}`;

const ORDEN_AREAS = [
  "Blog",
  "GEO",
  "Revisores de calidad",
  "Contenido",
  "Monitoreo de competencia",
  "Datos de mercado",
  "Informes SEO y GEO",
  "Informes de marketing digital",
  "Dashboards por cliente",
  "Paneles operativos",
  "Chatbots y WhatsApp",
  "Prospección",
  "Auditoría SEO",
  "Cobros y facturación",
];
const areas = ORDEN_AREAS.map((area) => ({
  area,
  agentes: activos.filter((a) => a.area === area),
})).filter((g) => g.agentes.length);

// Nombre corto para el tablero
function corto(n: string) {
  return n
    .replace(/^Blog diario — cliente (de )?/, "Blog, ")
    .replace(/^Ranking semanal — cliente (de )?/, "Ranking, ")
    .replace(/^Reporte de competencia — cliente (de )?/, "Competencia, ")
    .replace(/^Dashboard de resultados — cliente (de )?/, "Dashboard, ")
    .replace(/: .*$/, "");
}

// Franja de 30 días: verde = corrió bien, ámbar = solo fallas, gris = no le correspondía o no corrió
function Franja({ id, grande = false }: { id: string; grande?: boolean }) {
  const dias = EV.agentes[id]?.dias || {};
  const ok = Object.values(dias).filter((v) => v === "ok").length;
  // 30 columnas iguales: la franja se adapta al ancho disponible y nunca desborda
  return (
    <div
      className={`grid grid-cols-[repeat(30,minmax(0,1fr))] ${grande ? "gap-[3px] max-w-[34rem]" : "gap-[2px] sm:gap-[3px]"}`}
      role="img"
      aria-label={`Registro de 30 días: ${ok} días con ejecución exitosa`}
    >
      {DIAS.map((d) => (
        <span
          key={d}
          title={`${d}: ${dias[d] === "ok" ? "ejecución exitosa" : dias[d] === "fallo" ? "falló" : "sin ejecución"}`}
          className={`aspect-square rounded-[2px] sm:rounded-[3px] ${
            dias[d] === "ok"
              ? "bg-[#16A34A]"
              : dias[d] === "fallo"
                ? "bg-[#F59E0B]"
                : "bg-[#E4E4EE]"
          }`}
        />
      ))}
    </div>
  );
}

const PUBLICA = [
  {
    img: "/agentes/blog-diario.jpg",
    agente: "Agente de blog diario",
    texto:
      "El artículo de hoy: más de 3.000 palabras, revisado por un segundo agente antes de publicarse.",
    href: "/blog",
  },
  {
    img: "/agentes/blog-geo.jpg",
    agente: "Agente GEO",
    texto:
      "Formato pregunta y respuesta directa, pensado para que ChatGPT, Gemini y Claude lo citen.",
    href: "/blog",
  },
  {
    img: "/agentes/termometro.jpg",
    agente: "Termómetro del marketing digital",
    texto: "CPC y CPA de 22 industrias en Chile, actualizado cada sábado.",
    href: "/indicadores",
  },
  {
    img: "/agentes/ranking-semanal.jpg",
    agente: "Agente de ranking semanal",
    texto:
      "Un análisis de autoridad con datos y fuentes enlazadas cada jueves.",
    href: "/blog",
  },
];

const faqs = [
  {
    q: "¿Qué es un agente de IA en marketing?",
    a: "Es un programa que combina modelos de inteligencia artificial con datos y reglas para completar una tarea sin intervención manual: investigar, redactar, revisar, publicar, monitorear o reportar. A diferencia de usar ChatGPT a mano, un agente corre solo con una frecuencia definida y deja un registro de cada ejecución.",
  },
  {
    q: "¿Cómo se comprueba que estos agentes funcionan?",
    a: "Cada agente corre como un proceso programado y cada ejecución queda registrada con fecha y resultado. El tablero de esta página muestra los últimos 30 días de cada uno: verde si corrió bien, ámbar si falló. Solo aparecen agentes con al menos 70% de ejecuciones exitosas, y el registro se actualiza cada lunes.",
  },
  {
    q: "¿Por qué no aparecen los nombres de los clientes?",
    a: "Por confidencialidad. Los agentes que trabajan para clientes se identifican por rubro: software logístico, energía, outplacement, legal inmobiliario, planificación financiera. Los que producen contenido público de Muller y Pérez enlazan a lo que publican.",
  },
  {
    q: "¿Qué modelos de IA usan los agentes?",
    a: "Modelos de OpenAI para investigar y redactar, y Claude de Anthropic para la revisión editorial. Antes de publicar, cada artículo pasa un control automático de extensión, preguntas frecuentes, enlaces, ortografía y fuentes con URL comprobada.",
  },
  {
    q: "¿Puedo tener estos agentes trabajando para mi empresa?",
    a: "Sí. Los agentes de blog, GEO, monitoreo de competencia, reportes y dashboards se configuran para cada cliente dentro de los planes de Muller y Pérez, conectados a nuestro CRM y a nuestro predictor de campañas.",
  },
];

export default function AgentesIAPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Agentes de IA de Muller y Pérez en producción",
    numberOfItems: activos.length,
    itemListElement: activos.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: a.nombre,
        description: a.que_hace,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        creator: {
          "@type": "Organization",
          name: "Muller y Pérez",
          url: "https://www.mulleryperez.cl",
        },
      },
    })),
  };
  const faqSchema = createFAQPageSchema(
    faqs.map((f) => ({ question: f.q, answer: f.a })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SiteHeader />
      <div className="min-h-screen bg-[#F7F7FB] text-[#1B1740]">
        {/* Hero: el tablero es la pieza central */}
        <section className="bg-[#1B1740] text-white pt-28 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 items-start [&>*]:min-w-0">
              <div>
                <h1 className="text-4xl md:text-[3.25rem] font-black leading-[1.05] tracking-tight mb-6">
                  {activos.length} agentes de IA trabajando hoy. Este es su
                  registro.
                </h1>
                <p className="text-lg text-indigo-100/90 leading-relaxed max-w-xl mb-8">
                  Cualquier agencia puede decir que usa inteligencia artificial.
                  Nosotros mostramos cada ejecución: qué agente corrió, qué día
                  y si terminó bien. Trabajan conectados a nuestro CRM propio y
                  a nuestro predictor de campañas.
                </p>
                <dl className="grid grid-cols-2 gap-6 max-w-md tabular-nums">
                  <div>
                    <dt className="text-sm text-indigo-200">
                      Ejecuciones exitosas en 30 días
                    </dt>
                    <dd className="text-3xl font-black">
                      {totalEjecuciones.toLocaleString("es-CL")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-indigo-200">
                      Áreas de trabajo
                    </dt>
                    <dd className="text-3xl font-black">{areas.length}</dd>
                  </div>
                </dl>
              </div>

              <figure className="bg-white text-[#1B1740] rounded-2xl p-5 sm:p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
                <figcaption className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                  <span className="font-bold">Registro de ejecuciones</span>
                  <span className="text-sm text-slate-500">{rango}</span>
                </figcaption>
                <ul className="space-y-[5px]">
                  {activos.map((a) => (
                    <li key={a.id} className="grid grid-cols-[minmax(0,7.5rem)_1fr] sm:grid-cols-[minmax(0,13rem)_1fr] items-center gap-3 text-xs">
                      <span className="truncate font-medium text-slate-600" title={a.nombre}>{corto(a.nombre)}</span>
                      <Franja id={a.id} />
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-[#16A34A]" />
                    Corrió bien
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-[#F59E0B]" />
                    Falló
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-[#E4E4EE]" />
                    No le correspondía correr
                  </span>
                </div>
              </figure>
            </div>
          </div>
        </section>

        {/* Lo que publican: capturas recortadas de resultados públicos */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Lo que publican
            </h2>
            <p className="text-slate-600 max-w-2xl mb-10">
              Resultados públicos de los agentes, tal como están en el sitio
              hoy.
            </p>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-12">
              {PUBLICA.map((p) => (
                <Link
                  key={p.img}
                  href={p.href}
                  className="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4F46E5]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-50">
                    <Image
                      src={p.img}
                      alt={`Captura: ${p.agente}`}
                      fill
                      className="object-contain object-top p-3"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <p className="mt-4 font-bold group-hover:text-[#4F46E5]">
                    {p.agente}
                  </p>
                  <p className="text-slate-600 text-sm mt-1">{p.texto}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Registro por área */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Qué hace cada agente
            </h2>
            <p className="text-slate-600 max-w-2xl mb-12">
              Los clientes aparecen por rubro. Para cada agente mostramos su
              frecuencia, sus ejecuciones exitosas del último mes y su franja de
              30 días.
            </p>
            <div className="space-y-14">
              {areas.map((g) => (
                <div key={g.area}>
                  <h3 className="text-xl font-black mb-2 pb-3 border-b-2 border-[#1B1740]">
                    {g.area}
                  </h3>
                  <ul className="divide-y divide-slate-200">
                    {g.agentes.map((a) => {
                      const e = EV.agentes[a.id];
                      return (
                        <li
                          key={a.id}
                          className="py-5 grid md:grid-cols-[1.4fr_1fr] gap-4 md:gap-10 items-center [&>*]:min-w-0"
                        >
                          <div>
                            <p className="font-bold">{a.nombre}</p>
                            <p className="text-slate-600 text-sm leading-relaxed mt-1">
                              {a.que_hace}
                            </p>
                            {a.url_publica && (
                              <Link
                                href={a.url_publica}
                                className="inline-block mt-2 text-sm font-semibold text-[#4F46E5] hover:underline"
                              >
                                Ver lo que publica
                              </Link>
                            )}
                          </div>
                          <div className="tabular-nums min-w-0">
                            <Franja id={a.id} grande />
                            <p className="text-sm text-slate-600 mt-2">
                              {a.frecuencia}.{" "}
                              <strong className="text-[#16A34A]">
                                {e.exitosas_30d} ejecuciones exitosas
                              </strong>
                              , la última el {fechaCorta(e.ultima_exitosa)}.
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tecnología propia */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Sobre qué trabajan los agentes
            </h2>
            <p className="text-slate-600 max-w-2xl mb-10">
              Software que desarrollamos nosotros, no herramientas arrendadas.
            </p>
            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  nombre: "Predictor de campañas",
                  texto:
                    "Estima costo por clic, costo por lead y resultados antes de invertir, con benchmarks de 22 industrias y 6 países de Latinoamérica. Lo usamos para planificar cada campaña y está abierto al público.",
                  imagen: "/agentes/predictor.jpg",
                  href: "/labs/predictor",
                  cta: "Probar el predictor",
                },
                {
                  nombre: "CRM propio",
                  texto:
                    "Cada lead llega con su fuente, campaña, estado y seguimiento. El equipo comercial del cliente lo ve en tiempo real, y los agentes de reportes y de fiscalización por WhatsApp trabajan sobre estos datos.",
                  imagen: "/agentes/crm.jpg",
                  href: "/tecnologia",
                  cta: "Ver la tecnología",
                },
              ].map((t) => (
                <div key={t.nombre}>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-50">
                    <Image
                      src={t.imagen}
                      alt={`${t.nombre} de Muller y Pérez`}
                      fill
                      className="object-contain object-top p-3"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <h3 className="text-xl font-black mt-5 mb-2">{t.nombre}</h3>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    {t.texto}
                  </p>
                  <Link
                    href={t.href}
                    className="font-semibold text-[#4F46E5] hover:underline"
                  >
                    {t.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-10">
              Preguntas frecuentes
            </h2>
            <div className="divide-y divide-slate-200">
              {faqs.map((f) => (
                <div key={f.q} className="py-6">
                  <h3 className="text-lg font-bold mb-2">{f.q}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto bg-[#1B1740] text-white rounded-3xl px-8 py-14 md:px-14 grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-3">
                Pon estos agentes a trabajar para tu empresa
              </h2>
              <p className="text-indigo-100/90">
                Blog, GEO, monitoreo de competencia, reportes y dashboards,
                configurados para tu negocio.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link
                href="/#contacto"
                className="text-center px-6 py-3.5 bg-white text-[#1B1740] rounded-xl font-bold hover:bg-indigo-50"
              >
                Agendar una reunión
              </Link>
              <Link
                href="/agentes"
                className="text-center px-6 py-3.5 border border-white/30 rounded-xl font-semibold hover:bg-white/10"
              >
                Contratar el agente de blog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
