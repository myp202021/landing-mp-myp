/**
 * /agentes-ia — Agentes de IA de M&P en producción, con evidencia.
 * Lista SOLO los agentes con ejecuciones exitosas comprobadas en los últimos 30 días.
 * Datos: data/agentes-ia.json (inventario) + data/agentes-evidencia.json (ejecuciones reales en GitHub Actions,
 * se refresca cada lunes con .github/workflows/agentes-evidencia.yml).
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  createMetadata,
  createFAQPageSchema,
  createBreadcrumbSchema,
} from "@/lib/metadata";
import inventario from "@/data/agentes-ia.json";
import evidencia from "@/data/agentes-evidencia.json";

export const metadata: Metadata = createMetadata({
  title: "Agentes de IA en producción: lista y evidencia",
  description:
    "Los agentes de inteligencia artificial que Muller y Pérez tiene corriendo para sus clientes: qué hace cada uno, cada cuánto corre y su registro real de ejecuciones.",
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
  imagen?: string | null;
};
type Evidencia = {
  tipo: string;
  ejecuciones_30d?: number;
  exitosas_30d?: number;
  ultima_exitosa?: string | null;
};

const ev = (
  evidencia as { generado: string; agentes: Record<string, Evidencia> }
).agentes;

// Solo se muestran agentes que funcionan: al menos 1 ejecución exitosa y 70% o más de éxito en 30 días
function funciona(e?: Evidencia) {
  if (!e || e.tipo !== "workflow" || !e.exitosas_30d || !e.ejecuciones_30d)
    return false;
  return e.exitosas_30d / e.ejecuciones_30d >= 0.7;
}

const activos = (inventario as Agente[]).filter((a) => funciona(ev[a.id]));
const totalEjecuciones = activos.reduce(
  (s, a) => s + (ev[a.id].exitosas_30d || 0),
  0,
);

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

function fecha(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    timeZone: "America/Santiago",
  });
}

const faqs = [
  {
    q: "¿Qué es un agente de IA en marketing?",
    a: "Es un programa que combina modelos de inteligencia artificial con datos y reglas para ejecutar una tarea completa sin intervención manual: investigar, redactar, revisar, publicar, monitorear o reportar. A diferencia de usar ChatGPT a mano, un agente corre solo con una frecuencia definida y entrega un resultado que se puede medir.",
  },
  {
    q: "¿Cómo se comprueba que estos agentes funcionan?",
    a: "Cada agente corre como un proceso programado y cada ejecución queda registrada con fecha y resultado. Esta página muestra, para cada uno, cuántas ejecuciones exitosas tuvo en los últimos 30 días y cuándo fue la última. Solo aparecen los agentes con al menos 70% de ejecuciones exitosas; el registro se actualiza cada semana.",
  },
  {
    q: "¿Por qué no aparecen los nombres de los clientes?",
    a: "Por confidencialidad. Los agentes que trabajan para clientes se identifican por rubro (software logístico, energía, outplacement, etc.). Los que producen contenido público de Muller y Pérez incluyen el enlace a lo que publican.",
  },
  {
    q: "¿Qué modelos de IA usan los agentes?",
    a: "Principalmente modelos de OpenAI para investigación y redacción y Claude de Anthropic para revisión editorial. Cada artículo pasa por una revisión automática de calidad antes de publicarse: extensión, preguntas frecuentes, enlaces, ortografía y fuentes con URL comprobada.",
  },
  {
    q: "¿Puedo tener estos agentes trabajando para mi empresa?",
    a: "Sí. Los agentes de blog, GEO, monitoreo de competencia, informes y dashboards se configuran para cada cliente dentro de los planes de Muller y Pérez.",
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
  const breadcrumb = createBreadcrumbSchema([
    { name: "Inicio", url: "https://www.mulleryperez.cl" },
    { name: "Agentes de IA", url: "https://www.mulleryperez.cl/agentes-ia" },
  ]);
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white pt-28 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link
                href="/"
                className="text-indigo-200 hover:text-white transition"
              >
                Inicio
              </Link>
              <span className="mx-2 text-indigo-300">/</span>
              <span className="text-white font-semibold">Agentes de IA</span>
            </nav>
            <p className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-4">
              Evidencia, no promesas
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Agentes de IA en producción
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
              Estos son los agentes de inteligencia artificial que Muller y
              Pérez tiene trabajando hoy para sus clientes y para su propia
              marca. De cada uno mostramos qué hace, cada cuánto corre y su
              registro real de ejecuciones.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <p className="text-4xl font-black text-purple-300">
                  {activos.length}
                </p>
                <p className="text-sm text-indigo-200 mt-1">
                  agentes con evidencia
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <p className="text-4xl font-black text-purple-300">
                  {totalEjecuciones.toLocaleString("es-CL")}
                </p>
                <p className="text-sm text-indigo-200 mt-1">
                  ejecuciones exitosas en 30 días
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <p className="text-4xl font-black text-purple-300">
                  {areas.length}
                </p>
                <p className="text-sm text-indigo-200 mt-1">áreas de trabajo</p>
              </div>
            </div>
            <p className="text-xs text-indigo-300/70 mt-6">
              Registro actualizado el{" "}
              {fecha((evidencia as { generado: string }).generado)}. Ventana:
              últimos 30 días.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg mb-16">
            <p className="text-indigo-900">
              <strong>Cómo leer la evidencia:</strong> cada agente es un proceso
              programado que deja registro de cada ejecución. Mostramos las
              ejecuciones exitosas de los últimos 30 días y la fecha de la
              última. Solo listamos agentes con al menos 70% de ejecuciones
              exitosas; los clientes aparecen por rubro por confidencialidad.
            </p>
          </div>

          {areas.map((g) => (
            <section key={g.area} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {g.area}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {g.agentes.map((a) => {
                  const e = ev[a.id];
                  return (
                    <article
                      key={a.id}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col"
                    >
                      {a.imagen && (
                        <div className="relative aspect-[16/10] bg-gray-100 border-b border-gray-200">
                          <Image
                            src={a.imagen}
                            alt={`Resultado publicado por: ${a.nombre}`}
                            fill
                            className="object-cover object-top"
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {a.nombre}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                          {a.que_hace}
                        </p>
                        <dl className="text-sm space-y-1 mb-4">
                          <div className="flex justify-between gap-4">
                            <dt className="text-gray-500">Frecuencia</dt>
                            <dd className="text-gray-900 font-medium text-right">
                              {a.frecuencia}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-gray-500">
                              Ejecuciones exitosas (30 días)
                            </dt>
                            <dd className="text-emerald-700 font-bold">
                              {e.exitosas_30d}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-gray-500">Última ejecución</dt>
                            <dd className="text-gray-900 font-medium">
                              {fecha(e.ultima_exitosa)}
                            </dd>
                          </div>
                        </dl>
                        {a.url_publica && (
                          <Link
                            href={a.url_publica}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                          >
                            Ver lo que publica →
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Preguntas frecuentes
            </h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {f.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Quieres agentes trabajando para tu empresa?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Blog, GEO, monitoreo de competencia, informes y dashboards,
              configurados para tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contacto"
                className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold text-lg"
              >
                Agendar reunión
              </Link>
              <Link
                href="/casos-de-exito"
                className="px-8 py-4 bg-white text-indigo-900 rounded-lg hover:bg-indigo-50 transition font-semibold text-lg"
              >
                Ver casos de éxito
              </Link>
              <Link href="/agentes" className="px-8 py-4 bg-white/10 text-white border border-white/30 rounded-lg hover:bg-white/20 transition font-semibold text-lg">
                Agente de blog para tu sitio
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
