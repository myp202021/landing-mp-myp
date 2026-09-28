/**
 * Página Servicio: GEO Chile (Generative Engine Optimization)
 * Target: "agencia geo chile", "aparecer en chatgpt", "posicionamiento en ia"
 * Pilar del cluster SEO/GEO: los agentes de blog enlazan aquí (scripts/lib/myp-seo-focus.js)
 * Pieza central: el flujo de 5 pasos, cada uno con el agente que lo ejecuta y su entregable.
 * Evidencia: auditoría real de mulleryperez.cl, artículo GEO real, informe de avance real (cliente anonimizado).
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  createMetadata,
  createServiceSchema,
  createFAQPageSchema,
  createBreadcrumbSchema,
} from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Agencia GEO en Chile: aparece en ChatGPT, Gemini y Claude",
  description:
    "GEO en Chile: hacemos que ChatGPT, Gemini, Claude y Perplexity mencionen tu empresa. Auditoría SEO + GEO, datos estructurados, contenido de respuesta directa y medición mensual con agentes de IA.",
  keywords: [
    "agencia geo chile",
    "geo generative engine optimization",
    "aparecer en chatgpt",
    "posicionamiento en ia",
    "posicionamiento en chatgpt chile",
    "aeo chile",
    "seo para ia",
    "ai overviews chile",
    "optimización para motores de ia",
  ],
  path: "/servicios/geo-chile",
});

const RESPUESTA_DIRECTA =
  "Para aparecer en ChatGPT, Gemini y Claude una empresa necesita tres cosas: menciones en fuentes de terceros que las IA consultan (rankings, directorios con reseñas, prensa), contenido propio que responda preguntas concretas con datos verificables, y datos estructurados coherentes en todo su sitio. El GEO ordena y ejecuta esas tres capas y mide cada mes si la IA te menciona.";

const PASOS = [
  {
    titulo: "Auditoría SEO + GEO",
    cuando: "Semana 1",
    que: "Revisamos SEO técnico, contenido, rendimiento y señales GEO de tu sitio, y lo comparamos con tus competidores. Consultamos a ChatGPT, Gemini, Claude y Perplexity las preguntas que hace tu cliente para ver quién aparece hoy.",
    agente: "Agente de auditoría SEO + GEO",
    entrega: "Informe con puntaje por área y plan priorizado",
  },
  {
    titulo: "Base técnica para las IA",
    cuando: "Semanas 1 y 2",
    que: "Datos estructurados (Organization, Service, FAQPage), archivo llms.txt, acceso de los bots de IA en robots.txt y los mismos datos de tu empresa en todas las páginas: dirección, servicios, cifras.",
    agente: "Equipo SEO de M&P",
    entrega: "Cambios publicados en tu sitio",
  },
  {
    titulo: "Contenido de respuesta directa",
    cuando: "Desde la semana 2, de lunes a viernes",
    que: "Un agente publica artículos que responden en el primer párrafo la pregunta que tu cliente le hace a la IA, con tablas, datos y preguntas frecuentes. Otro agente revisa cada artículo y verifica cada fuente antes de publicar.",
    agente: "Agente GEO, revisor editorial y verificador de fuentes",
    entrega: "Artículos publicados en tu blog",
  },
  {
    titulo: "Fuentes de terceros",
    cuando: "Mensual",
    que: "Las IA confían más en lo que dicen otros que en tu propio sitio. Trabajamos tu presencia en directorios con reseñas, rankings del sector y prensa especializada.",
    agente: "Equipo SEO de M&P",
    entrega: "Perfiles y menciones nuevas",
  },
  {
    titulo: "Medición e informe",
    cuando: "Semanal y mensual",
    que: "Repetimos las mismas preguntas en los motores de IA y registramos si te mencionan, en qué posición y junto a qué competidores. Te enviamos el avance con lo hecho y lo que sigue.",
    agente: "Agente de informes",
    entrega: "Informe de avance con puntajes antes y ahora",
  },
];

// Informe real enviado el 21 de septiembre de 2026 a un cliente de planificación financiera (nombre omitido)
const INFORME = [
  ["SEO técnico", 4, 7, 8],
  ["On-page", 3, 8, 9],
  ["Datos estructurados", 3, 8, 9],
  ["Contenido y blog", 4, 7, 8],
  ["GEO / IA", 4, 7, 9],
  ["SEO local", 5, 8, 9],
] as const;

const faqs = [
  {
    q: "¿Qué es GEO (Generative Engine Optimization)?",
    a: "GEO es la optimización de una marca y su sitio para que los motores de inteligencia artificial, como ChatGPT, Gemini, Claude, Perplexity y los AI Overviews de Google, la citen o la recomienden cuando alguien pregunta por su categoría. El SEO busca que tu página aparezca en la lista de resultados; el GEO busca que tu marca aparezca dentro de la respuesta de la IA.",
  },
  {
    q: "¿Cómo decide ChatGPT qué empresas recomendar?",
    a: "Los motores de IA combinan lo que aprendieron en su entrenamiento con búsquedas web en tiempo real. En la práctica pesan tres cosas: menciones en fuentes de terceros (rankings, directorios con reseñas, prensa), contenido propio que responde la pregunta de forma directa y verificable, y datos estructurados que dicen sin ambigüedad quién eres, qué haces y dónde operas.",
  },
  {
    q: "¿Cuál es la diferencia entre SEO y GEO?",
    a: "El SEO optimiza para rankear en Google: keywords, enlaces, velocidad e intención de búsqueda. El GEO optimiza para ser citado: respuestas directas al inicio del contenido, datos propios con fuente, preguntas frecuentes con schema FAQPage, un archivo llms.txt, datos coherentes de la empresa y presencia en listados de terceros. Se complementan: sin SEO técnico sólido, las IA tampoco encuentran tu contenido.",
  },
  {
    q: "¿Cuánto tarda en verse resultados de GEO?",
    a: 'Los cambios técnicos se reflejan en las búsquedas en vivo de los motores de IA en semanas. Aparecer de forma consistente en preguntas amplias como "mejor empresa de X en Chile" suele tomar de 2 a 4 meses, porque depende de acumular contenido citable y menciones en fuentes de terceros.',
  },
  {
    q: "¿Cómo se mide el GEO?",
    a: "Con un set fijo de preguntas que haría tu cliente ideal, consultadas periódicamente en ChatGPT, Gemini, Claude y Perplexity. Se registra si tu marca aparece, en qué posición, junto a qué competidores y qué fuentes cita la IA. Es el equivalente al reporte de posiciones del SEO clásico.",
  },
  {
    q: "¿Sirve el GEO para empresas B2B?",
    a: 'Sí, y especialmente. Los compradores B2B usan asistentes de IA para armar listas cortas de proveedores antes de contactar a alguno. Si tu empresa no aparece en esa respuesta, no entra a la comparación. En B2B las preguntas son específicas, como "mejor software WMS en Chile", y eso hace más alcanzable aparecer.',
  },
  {
    q: "¿Cuánto cuesta el servicio de GEO?",
    a: "El GEO se trabaja junto al SEO dentro de los planes de Muller y Pérez. El alcance depende del punto de partida que muestra la auditoría: cuánto contenido tienes, cómo están tus datos estructurados y cuánta presencia tienes en fuentes de terceros.",
  },
  {
    q: "¿Necesito cambiar mi sitio web para hacer GEO?",
    a: "Casi nunca. La mayoría de los cambios se hacen sobre el sitio que ya tienes: datos estructurados, llms.txt, ajustes de contenido y un blog con artículos de respuesta directa. Si el sitio tiene problemas técnicos graves, la auditoría lo muestra antes de empezar.",
  },
];

export default function GEOChilePage() {
  const serviceSchema = createServiceSchema({
    name: "GEO Chile: posicionamiento en motores de IA",
    description:
      "Optimización para que ChatGPT, Gemini, Claude, Perplexity y Google AI Overviews citen y recomienden tu empresa: auditoría SEO + GEO, datos estructurados, contenido de respuesta directa y medición mensual.",
    serviceType: "Generative Engine Optimization",
    price: "1500000",
    priceCurrency: "CLP",
  });
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo lograr que ChatGPT, Gemini y Claude mencionen tu empresa",
    description: RESPUESTA_DIRECTA,
    step: PASOS.map((p, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: p.titulo,
      text: p.que,
    })),
  };
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Inicio", url: "https://www.mulleryperez.cl" },
    { name: "Servicios", url: "https://www.mulleryperez.cl/servicios" },
    {
      name: "GEO Chile",
      url: "https://www.mulleryperez.cl/servicios/geo-chile",
    },
  ]);
  const faqSchema = createFAQPageSchema(
    faqs.map((f) => ({ question: f.q, answer: f.a })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-[#F7F7FB] text-[#1B1740]">
        {/* Hero */}
        <section className="bg-[#1B1740] text-white pt-28 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <nav
              className="mb-10 text-sm text-indigo-200"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-white">
                Inicio
              </Link>
              <span className="mx-2 text-indigo-400">/</span>
              <Link href="/servicios" className="hover:text-white">
                Servicios
              </Link>
              <span className="mx-2 text-indigo-400">/</span>
              <span className="text-white">GEO Chile</span>
            </nav>
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-end">
              <div>
                <h1 className="text-4xl md:text-[3.25rem] font-black leading-[1.05] tracking-tight mb-6">
                  Que ChatGPT, Gemini y Claude nombren a tu empresa cuando tu
                  cliente pregunta
                </h1>
                <p className="text-lg text-indigo-100/90 leading-relaxed max-w-xl mb-8">
                  Cada vez más clientes le preguntan a una IA antes de buscar en
                  Google. Hacemos GEO junto al SEO, con agentes de IA que
                  auditan, publican contenido citable y miden cada mes si los
                  motores de IA te mencionan.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/#contacto"
                    className="text-center px-6 py-3.5 bg-white text-[#1B1740] rounded-xl font-bold hover:bg-indigo-50"
                  >
                    Pedir auditoría SEO + GEO
                  </Link>
                  <Link
                    href="/agentes-ia"
                    className="text-center px-6 py-3.5 border border-white/30 rounded-xl font-semibold hover:bg-white/10"
                  >
                    Ver los agentes trabajando
                  </Link>
                </div>
              </div>
              <div className="bg-white/[0.06] border border-white/15 rounded-2xl p-7">
                <h2 className="text-lg font-bold mb-3">Respuesta directa</h2>
                <p className="text-indigo-100 leading-relaxed">
                  {RESPUESTA_DIRECTA}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Flujo: la pieza central */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Cómo funciona, paso a paso
            </h2>
            <p className="text-slate-600 max-w-2xl mb-14">
              Cinco pasos en orden. Cada uno tiene un responsable, sea un agente
              de IA o nuestro equipo, y algo concreto que recibes.
            </p>
            <ol className="relative grid gap-6 lg:grid-cols-5 lg:gap-4">
              <div
                aria-hidden
                className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-[#4F46E5]/30"
              />
              {PASOS.map((p, i) => (
                <li
                  key={p.titulo}
                  className="relative flex lg:flex-col gap-5 lg:gap-0"
                >
                  <span className="relative z-10 shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#4F46E5] text-white text-lg font-black ring-8 ring-[#F7F7FB] lg:mb-6">
                    {i + 1}
                  </span>
                  <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-200 flex-1 flex flex-col">
                    <p className="text-sm font-semibold text-[#4F46E5] mb-1">
                      {p.cuando}
                    </p>
                    <h3 className="text-lg font-black leading-snug mb-3">
                      {p.titulo}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                      {p.que}
                    </p>
                    <dl className="text-sm space-y-2 border-t border-slate-100 pt-4">
                      <div>
                        <dt className="text-slate-500">Quién lo hace</dt>
                        <dd className="font-semibold">{p.agente}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Qué recibes</dt>
                        <dd className="font-semibold">{p.entrega}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Lo que recibes: evidencia real */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Lo que recibes, con ejemplos reales
            </h2>
            <p className="text-slate-600 max-w-2xl mb-14">
              Nada de maquetas: son entregables reales. Cuando son de un
              cliente, omitimos su nombre.
            </p>

            <div className="grid lg:grid-cols-2 gap-14 items-start mb-20">
              <div>
                <div className="relative aspect-[1000/819] overflow-hidden rounded-xl ring-1 ring-slate-200">
                  <Image
                    src="/agentes/auditoria-geo.jpg"
                    alt="Portada del informe de auditoría SEO + GEO generado por el agente de auditoría"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-3">
                  1. El informe de auditoría
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Así se ve la auditoría que entrega nuestro agente. Este
                  ejemplo es la de nuestro propio sitio, hecha el 28 de
                  septiembre de 2026: 94 de 100, con puntaje separado para SEO
                  técnico, contenido, rendimiento y preparación para motores de
                  IA.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Cada área trae sus hallazgos, su prioridad y la comparación
                  con los competidores que tú elijas.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-14 items-start mb-20">
              <div className="lg:order-2">
                <div className="relative aspect-[1000/654] overflow-hidden rounded-xl ring-1 ring-slate-200">
                  <Image
                    src="/agentes/blog-geo.jpg"
                    alt="Artículo GEO con respuesta directa publicado por el agente"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              </div>
              <div className="lg:order-1">
                <h3 className="text-2xl font-black mb-3">
                  2. Artículos que la IA puede citar
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  El agente GEO escribe la respuesta en el primer párrafo,
                  destacada, y después la desarrolla con tablas, datos y
                  preguntas frecuentes. Es el formato que los motores de IA
                  toman para armar sus respuestas.
                </p>
                <Link
                  href="/blog"
                  className="font-semibold text-[#4F46E5] hover:underline"
                >
                  Ver los artículos publicados en nuestro blog
                </Link>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-14 items-start">
              <figure className="rounded-2xl ring-1 ring-slate-200 overflow-hidden bg-[#F7F7FB]">
                <div className="bg-white px-6 py-4 border-b border-slate-200 text-sm">
                  <p>
                    <span className="text-slate-500">De:</span> Muller y Pérez
                  </p>
                  <p>
                    <span className="text-slate-500">Asunto:</span> Avance SEO +
                    GEO de tu sitio
                  </p>
                  <p>
                    <span className="text-slate-500">Fecha:</span> 21 de
                    septiembre de 2026
                  </p>
                </div>
                <div className="p-6">
                  <p className="font-bold mb-1">
                    Puntaje: 4,1 → 7,1 de 10 (meta 8,3)
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
                    Cliente de planificación financiera, nombre omitido.
                  </p>
                  <table className="w-full text-sm tabular-nums">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-200">
                        <th className="py-2 font-medium">Área</th>
                        <th className="py-2 font-medium text-right">Antes</th>
                        <th className="py-2 font-medium text-right">Ahora</th>
                        <th className="py-2 font-medium text-right">Meta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INFORME.map(([area, antes, ahora, meta]) => (
                        <tr key={area} className="border-b border-slate-100">
                          <td className="py-2">{area}</td>
                          <td className="py-2 text-right text-slate-500">
                            {antes}
                          </td>
                          <td className="py-2 text-right font-bold text-[#16A34A]">
                            {ahora}
                          </td>
                          <td className="py-2 text-right text-slate-500">
                            {meta}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-sm text-slate-600 mt-4">
                    Lo ejecutado incluyó títulos H1 en las páginas principales,
                    preguntas frecuentes con schema en 5 páginas, ocho tipos de
                    datos estructurados, llms.txt, 11 artículos publicados y el
                    agente de blog diario activo.
                  </p>
                </div>
              </figure>
              <div>
                <h3 className="text-2xl font-black mb-3">
                  3. El informe de avance
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Este es un informe real que enviamos a un cliente de
                  planificación financiera tres semanas después de empezar.
                  Muestra el puntaje de cada área antes, ahora y la meta, junto
                  con lo ejecutado y lo que falta.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  El área de GEO pasó de 4 a 7 de 10 en ese periodo: datos
                  estructurados completos, llms.txt activo y contenido de
                  respuesta directa publicándose todos los días hábiles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO vs GEO */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
              SEO y GEO: qué cambia cuando tu cliente le pregunta a una IA
            </h2>
            <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#1B1740] text-white text-left">
                    <th className="px-5 py-4 font-semibold">Criterio</th>
                    <th className="px-5 py-4 font-semibold">SEO clásico</th>
                    <th className="px-5 py-4 font-semibold">GEO</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Objetivo",
                      "Rankear una página en Google",
                      "Ser citado o recomendado dentro de la respuesta de la IA",
                    ],
                    [
                      "Dónde compites",
                      "Una lista de 10 resultados",
                      "Una respuesta que menciona entre 3 y 5 marcas",
                    ],
                    [
                      "Señal clave",
                      "Keywords, enlaces y velocidad",
                      "Menciones de terceros, respuestas directas y datos estructurados",
                    ],
                    [
                      "Formato que gana",
                      "Contenido largo optimizado",
                      "Respuesta citable al inicio, datos propios y preguntas frecuentes",
                    ],
                    [
                      "Cómo se mide",
                      "Posición por keyword",
                      "Menciones en ChatGPT, Gemini, Claude y Perplexity",
                    ],
                  ].map(([c, seo, geo]) => (
                    <tr key={c} className="border-t border-slate-100">
                      <td className="px-5 py-4 font-semibold align-top">{c}</td>
                      <td className="px-5 py-4 text-slate-600 align-top">
                        {seo}
                      </td>
                      <td className="px-5 py-4 text-slate-600 align-top">
                        {geo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 mt-6">
              El GEO funciona mejor conectado al{" "}
              <Link
                href="/servicios/seo-chile"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                SEO técnico
              </Link>{" "}
              y a tus campañas en{" "}
              <Link
                href="/servicios/google-ads-chile"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                Google Ads
              </Link>
              : las búsquedas pagadas nos dicen qué preguntas hace tu cliente, y
              esas son las que optimizamos para las IA.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-10">
              Preguntas frecuentes sobre GEO
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
        <section className="px-6 py-24">
          <div className="max-w-6xl mx-auto bg-[#1B1740] text-white rounded-3xl px-8 py-14 md:px-14 grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-3">
                ¿Te menciona ChatGPT hoy?
              </h2>
              <p className="text-indigo-100/90">
                La auditoría te muestra en qué preguntas apareces, en cuáles
                aparecen tus competidores y qué hace falta para entrar.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/#contacto"
                className="text-center px-6 py-3.5 bg-white text-[#1B1740] rounded-xl font-bold hover:bg-indigo-50"
              >
                Pedir auditoría SEO + GEO
              </Link>
              <Link
                href="/agentes-ia"
                className="text-center px-6 py-3.5 border border-white/30 rounded-xl font-semibold hover:bg-white/10"
              >
                Ver los 27 agentes trabajando
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
