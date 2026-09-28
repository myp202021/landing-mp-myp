/**
 * Página Servicio: GEO Chile (Generative Engine Optimization)
 * Target: "agencia geo chile", "aparecer en chatgpt", "posicionamiento en ia"
 * Pilar del cluster SEO/GEO: los agentes de blog enlazan aquí (scripts/lib/myp-seo-focus.js)
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  createMetadata,
  createServiceSchema,
  createFAQPageSchema,
  createBreadcrumbSchema,
} from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Agencia GEO Chile: Aparece en ChatGPT, Gemini y Claude",
  description:
    "GEO en Chile: hacemos que ChatGPT, Gemini, Claude y Perplexity recomienden tu empresa. Auditoría SEO+GEO, datos estructurados, contenido citeable y monitoreo con IA.",
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

const faqs = [
  {
    q: "¿Qué es GEO (Generative Engine Optimization)?",
    a: "GEO es la optimización de una marca y su sitio web para que los motores de inteligencia artificial, como ChatGPT, Gemini, Claude, Perplexity y los AI Overviews de Google, la citen o la recomienden cuando alguien pregunta por su categoría. El SEO busca que tu página aparezca en la lista de resultados; el GEO busca que tu marca aparezca dentro de la respuesta que entrega la IA.",
  },
  {
    q: "¿Cómo decide ChatGPT qué empresas recomendar?",
    a: "Los motores de IA combinan lo que aprendieron en su entrenamiento con búsquedas web en tiempo real. En la práctica, pesan mucho tres cosas: menciones en fuentes de terceros (rankings, directorios con reseñas, prensa), contenido propio que responde la pregunta de forma directa y verificable, y datos estructurados que les dicen sin ambigüedad quién eres, qué haces y dónde operas.",
  },
  {
    q: "¿Cuál es la diferencia entre SEO y GEO?",
    a: "El SEO optimiza para rankear en Google: keywords, enlaces, velocidad e intención de búsqueda. El GEO optimiza para ser citado: respuestas directas al inicio del contenido, datos propios con fuente, preguntas frecuentes con schema FAQPage, un archivo llms.txt, coherencia de datos de la empresa en toda la web y presencia en listados de terceros. Se complementan: sin SEO técnico sólido, las IA tampoco encuentran tu contenido.",
  },
  {
    q: "¿Cuánto tarda en verse resultados de GEO?",
    a: 'Los cambios técnicos (datos estructurados, llms.txt, coherencia de datos) se reflejan en las búsquedas en vivo de los motores de IA en semanas. Ganar menciones consistentes en respuestas genéricas como "mejor empresa de X en Chile" suele tomar de 2 a 4 meses, porque depende de acumular contenido citeable y menciones en fuentes de terceros.',
  },
  {
    q: "¿Cómo se mide el GEO?",
    a: "Con un set fijo de preguntas que haría tu cliente ideal, consultadas periódicamente en ChatGPT, Gemini, Claude y Perplexity. Se registra si tu marca aparece, en qué posición, junto a qué competidores y qué fuentes cita la IA. Esa medición mensual es el equivalente al reporte de posiciones del SEO clásico.",
  },
  {
    q: "¿Sirve el GEO para empresas B2B?",
    a: 'Sí, y especialmente. Los compradores B2B usan cada vez más asistentes de IA para armar listas cortas de proveedores antes de contactar a alguno. Si tu empresa no aparece en esa respuesta, no entra a la comparación. En B2B las preguntas son específicas ("mejor software WMS en Chile", "agencia de performance para SaaS") y eso hace más alcanzable aparecer.',
  },
];

export default function GEOChilePage() {
  const serviceSchema = createServiceSchema({
    name: "GEO Chile — Posicionamiento en motores de IA",
    description:
      "Optimización para que ChatGPT, Gemini, Claude, Perplexity y Google AI Overviews citen y recomienden tu empresa: auditoría SEO+GEO, datos estructurados, contenido de respuesta directa y monitoreo mensual.",
    serviceType: "Generative Engine Optimization",
    price: "1500000",
    priceCurrency: "CLP",
  });

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <Link
                href="/"
                className="text-indigo-200 hover:text-white transition"
              >
                Inicio
              </Link>
              <span className="mx-2 text-indigo-300">/</span>
              <Link
                href="/servicios"
                className="text-indigo-200 hover:text-white transition"
              >
                Servicios
              </Link>
              <span className="mx-2 text-indigo-300">/</span>
              <span className="text-white font-semibold">GEO Chile</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full mb-6">
                  <span className="text-purple-200 font-semibold">
                    SEO + GEO con 40 agentes de IA
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Agencia GEO en Chile:
                  <br />
                  <span className="text-purple-300">
                    que la IA recomiende tu empresa
                  </span>
                </h1>
                <p className="text-xl text-indigo-100 mb-8">
                  <strong>GEO (Generative Engine Optimization)</strong> es
                  lograr que ChatGPT, Gemini, Claude y Perplexity mencionen tu
                  marca cuando tu cliente les pregunta por tu categoría. En
                  Muller y Pérez lo trabajamos junto al SEO, con agentes de IA
                  propios que auditan, publican contenido citeable y miden tu
                  presencia en las respuestas de la IA.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/#contact"
                    className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold text-center"
                  >
                    Solicitar auditoría SEO + GEO
                  </Link>
                  <Link
                    href="/agentes"
                    className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-lg hover:bg-white/20 transition font-semibold text-center"
                  >
                    Ver nuestros agentes de IA
                  </Link>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold mb-6">Respuesta directa</h2>
                <p className="text-indigo-100 leading-relaxed">
                  Para aparecer en ChatGPT, Gemini y Claude una empresa necesita
                  tres cosas: menciones en fuentes de terceros que las IA
                  consultan (rankings, directorios con reseñas, prensa),
                  contenido propio que responda preguntas concretas con datos
                  verificables, y datos estructurados coherentes en todo su
                  sitio. El GEO ordena y ejecuta esas tres capas y mide mes a
                  mes si la IA te cita.
                </p>
              </div>
            </div>
          </div>
        </section>

        <article className="container mx-auto px-6 max-w-5xl py-16">
          {/* Qué cambia */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              SEO vs GEO: qué cambia cuando tu cliente le pregunta a una IA
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                      Criterio
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                      SEO clásico
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                      GEO
                    </th>
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
                      "Lista de 10 resultados",
                      "Una respuesta que menciona 3 a 5 marcas",
                    ],
                    [
                      "Señal clave",
                      "Keywords, enlaces, velocidad",
                      "Menciones de terceros, respuestas directas, datos estructurados",
                    ],
                    [
                      "Formato que gana",
                      "Contenido largo optimizado",
                      "Respuesta citeable al inicio + datos propios + FAQ",
                    ],
                    [
                      "Cómo se mide",
                      "Posición por keyword",
                      "Share of voice en ChatGPT, Gemini, Claude y Perplexity",
                    ],
                  ].map(([c, seo, geo]) => (
                    <tr key={c} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">
                        {c}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {seo}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {geo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Qué hacemos */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Qué incluye nuestro servicio de GEO
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                [
                  "1. Auditoría SEO + GEO",
                  "Nuestro agente de auditoría revisa SEO técnico, contenido, rendimiento y señales GEO: acceso de los bots de IA en robots.txt, llms.txt, schemas Organization, Service y FAQPage, coherencia de datos de la empresa y comparación directa contra tus competidores.",
                ],
                [
                  "2. Medición en motores de IA",
                  "Definimos las preguntas que hace tu cliente ideal y medimos si ChatGPT, Gemini, Claude y Perplexity te mencionan, en qué posición, junto a quién y qué fuentes citan.",
                ],
                [
                  "3. Datos estructurados y llms.txt",
                  "Implementamos los schemas que las IA leen para entender quién eres, qué vendes y por qué eres alternativa a tus competidores, y un llms.txt con tu información clave.",
                ],
                [
                  "4. Contenido de respuesta directa",
                  "Agentes de IA publican artículos con la respuesta citeable al inicio, tablas con datos, preguntas frecuentes con schema y enlaces a tus páginas de servicio. Cada artículo pasa por agentes revisores de calidad antes de publicarse.",
                ],
                [
                  "5. Fuentes de terceros",
                  "Plan para aparecer donde las IA buscan: rankings sectoriales, directorios con reseñas (Clutch, Sortlist, Google Business Profile) y prensa especializada.",
                ],
                [
                  "6. Informe GEO mensual",
                  "Informe con la evolución de tus menciones en IA, posiciones SEO y acciones del mes siguiente, generado por nuestros agentes de informes y revisado por el equipo.",
                ],
              ].map(([t, d]) => (
                <div key={t} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {t}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Por qué M&P */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Por qué hacer GEO con Muller y Pérez
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Somos una agencia de{" "}
              <Link
                href="/servicios/performance-marketing"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                performance marketing
              </Link>{" "}
              e inteligencia artificial con{" "}
              <strong>40 agentes de IA propios en producción</strong>: auditoría
              SEO, revisores de calidad, GEO, contenido, blog, prospección,
              informes SEO, GEO y de marketing digital, dashboards y paneles. No
              revendemos una herramienta: aplicamos a tu marca el mismo sistema
              que usamos para posicionar la nuestra.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              El GEO funciona mejor conectado al{" "}
              <Link
                href="/servicios/seo-chile"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                SEO técnico
              </Link>{" "}
              y a tus campañas pagadas: lo que aprendemos de las búsquedas en{" "}
              <Link
                href="/servicios/google-ads-chile"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Google Ads
              </Link>{" "}
              nos dice qué preguntas hace tu cliente, y esas preguntas son las
              que optimizamos para las IA.
            </p>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 my-8 rounded-r-lg">
              <p className="text-indigo-900 font-medium">
                5.0 estrellas en Google con 115 reseñas. Más de 40 clientes
                activos en Chile.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Preguntas frecuentes sobre GEO
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Te recomienda ChatGPT hoy?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Te mostramos en qué preguntas apareces, en cuáles aparecen tus
              competidores y qué hay que hacer para entrar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold text-lg"
              >
                Solicitar auditoría SEO + GEO
              </Link>
              <Link
                href="/blog"
                className="px-8 py-4 bg-white text-indigo-900 rounded-lg hover:bg-indigo-50 transition font-semibold text-lg"
              >
                Leer guías de GEO en el blog
              </Link>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
