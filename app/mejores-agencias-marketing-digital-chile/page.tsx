/**
 * Página pilar: Las mejores agencias de marketing digital en Chile (2026)
 * Versión resumida y citable del ranking verificado mensual.
 * Datos: data/ranking-agencias/pilar.json (lo genera scripts/ranking-pilar.js a partir del snapshot mensual).
 * En producción se lee la última versión desde GitHub cada 6 horas; si falla, usa la copia incluida en el build.
 */
import { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import pilarLocal from "@/data/ranking-agencias/pilar.json";

export const revalidate = 21600;

const URL_PAGINA =
  "https://www.mulleryperez.cl/mejores-agencias-marketing-digital-chile";
const URL_INFORME =
  "https://www.mulleryperez.cl/blog/ranking-agencias-marketing-digital-chile-verificado";
const DATOS_REMOTOS =
  "https://raw.githubusercontent.com/myp202021/landing-mp-myp/main/data/ranking-agencias/pilar.json";
const PUBLICADO = "2026-10-05";

type Pilar = typeof pilarLocal;
type Agencia = Pilar["ranking"][number];

async function getPilar(): Promise<Pilar> {
  try {
    const r = await fetch(DATOS_REMOTOS, { next: { revalidate } });
    if (r.ok) {
      const j = await r.json();
      if (j && Array.isArray(j.ranking) && j.ranking.length) return j as Pilar;
    }
  } catch {}
  return pilarLocal;
}

const MAX: Record<string, number> = {
  reputacion: 20,
  casos: 20,
  trayectoria: 10,
  equipo: 10,
  clientes: 15,
  especialidades: 5,
  tecnologia: 5,
  ia: 5,
  liderazgo: 10,
};
const NOMBRE_CRITERIO: Record<string, string> = {
  reputacion: "reputación verificable",
  casos: "casos de éxito",
  trayectoria: "trayectoria",
  equipo: "equipo",
  clientes: "clientes destacados",
  especialidades: "especialidades",
  tecnologia: "tecnología propia",
  ia: "IA en producción",
  liderazgo: "liderazgo y formación",
};
const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function mesTexto(mes: string) {
  const [a, m] = mes.split("-").map(Number);
  return `${MESES[m - 1]} de ${a}`;
}
const fmt = (n: number) =>
  n.toLocaleString("es-CL", {
    minimumFractionDigits: n % 1 ? 1 : 0,
    maximumFractionDigits: 1,
  });
const ordinal = (n: number) => `${n}.º`;

function ciudad(a: Agencia) {
  const u = a.ubicacion || "";
  const m = u.match(/(Las Condes|Providencia|Vitacura|Viña del Mar|Santiago)/i);
  return m ? m[1] : "Chile";
}

function fortalezas(a: Agencia): string[] {
  const p = a.puntaje as Record<string, number>;
  const orden = Object.keys(MAX)
    .filter((k) => k !== "especialidades" && (p[k] || 0) / MAX[k] >= 0.6)
    .sort((x, y) => (p[y] || 0) / MAX[y] - (p[x] || 0) / MAX[x]);
  const out: string[] = [];
  for (const k of orden) {
    if (out.length >= 3) break;
    if (k === "reputacion" && a.resenas)
      out.push(
        `${a.resenas.cantidad} reseñas en Google con nota ${fmt(a.resenas.nota)}`,
      );
    else if (k === "casos" && a.casos.length)
      out.push(
        `casos con resultados publicados${a.casos[0].cliente ? ` (por ejemplo, ${a.casos[0].cliente}: ${a.casos[0].resultado})` : ` (${a.casos[0].resultado})`}`,
      );
    else if (k === "trayectoria" && a.anio)
      out.push(`trayectoria desde ${a.anio}`);
    else if (k === "equipo" && a.equipo)
      out.push(`equipo interno (${a.equipo})`);
    else if (k === "clientes" && a.clientes.length)
      out.push(`clientes publicados como ${a.clientes.slice(0, 3).join(", ")}`);
    else if (k === "liderazgo" && a.liderazgo)
      out.push(
        `dirección con formación verificable (${[a.liderazgo.formacion, a.liderazgo.postgrado].filter(Boolean).join("; ")})`,
      );
    else if (k === "tecnologia" && a.tecnologia)
      out.push("tecnología propia documentada");
    else if (k === "ia" && a.ia)
      out.push("agentes de IA operando para clientes");
  }
  return out;
}

function sinInfo(a: Agencia): string[] {
  const p = a.puntaje as Record<string, number>;
  return Object.keys(MAX)
    .filter((k) => !p[k])
    .map((k) => NOMBRE_CRITERIO[k]);
}

function paraQuien(a: Agencia): string {
  if (a.mejor_para.length) {
    return a.mejor_para
      .slice(0, 3)
      .map((m) => `${m.perfil.charAt(0).toLowerCase() + m.perfil.slice(1)} (${ordinal(m.lugar)} lugar)`)
      .join("; ");
  }
  if (a.tipo_clientes && a.tipo_clientes !== "mixto")
    return `empresas ${a.tipo_clientes}`;
  return "empresas de distintos tamaños; no destaca en ningún perfil específico este mes";
}

function mejorParaCorto(a: Agencia): string {
  if (a.mejor_para.length) return a.mejor_para[0].perfil;
  if (a.tipo_clientes && a.tipo_clientes !== "mixto")
    return `Empresas ${a.tipo_clientes}`.slice(0, 60);
  return "Uso general";
}

export async function generateMetadata(): Promise<Metadata> {
  const d = await getPilar();
  const n = d.ranking.length;
  const title = `Las ${n} mejores agencias de marketing digital en Chile (2026)`;
  const description = `Las mejores agencias de marketing digital en Chile en 2026: ranking verificado de ${n} agencias con puntaje, para quién conviene cada una, precios publicados y fuentes enlazadas. Actualizado ${mesTexto(d.mes)}.`;
  return {
    title: { absolute: title },
    description,
    keywords: [
      "mejores agencias de marketing digital en Chile",
      "ranking agencias marketing digital chile 2026",
      "agencias de marketing digital chile",
      "mejor agencia de marketing digital",
      "agencias performance chile",
    ],
    alternates: { canonical: URL_PAGINA },
    openGraph: {
      title,
      description,
      url: URL_PAGINA,
      type: "article",
      locale: "es_CL",
      siteName: "Muller y Pérez",
      publishedTime: `${PUBLICADO}T00:00:00-03:00`,
      modifiedTime: d.actualizado,
      images: [
        {
          url: "https://www.mulleryperez.cl/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MejoresAgenciasPage() {
  const d = await getPilar();
  const ranking = d.ranking;
  const n = ranking.length;
  const top10 = ranking.slice(0, 10);
  const actualizado = d.actualizado;
  const mes = mesTexto(d.mes);
  const myp = ranking.find((a) => a.nombre === "Muller y Pérez");
  const perfil = (id: string) => d.perfiles.find((p) => p.id === id);
  const conPrecio = ranking.filter((a) => a.precios);

  const faqs: { q: string; a: string }[] = [
    {
      q: "¿Cuáles son las mejores agencias de marketing digital en Chile?",
      a: `Según el ranking verificado de ${mes}, las mejores agencias de marketing digital en Chile son ${top10
        .slice(0, 5)
        .map((x) => `${x.nombre} (${fmt(x.total)})`)
        .join(", ")}, seguidas por ${top10
        .slice(5)
        .map((x) => x.nombre)
        .join(
          ", ",
        )}. El puntaje (de 100) se calcula con reglas públicas y cada dato tiene una fuente enlazada.`,
    },
    {
      q: "¿Cuál es la mejor agencia de marketing digital B2B en Chile?",
      a: perfil("b2b_leads")
        ? `Para empresas B2B que buscan leads calificados, las de mejor ajuste son ${perfil(
            "b2b_leads",
          )!
            .top.map((t) => t.nombre)
            .join(
              ", ",
            )}. En B2B pesan el CRM con trazabilidad del lead a la venta, los paneles con CAC y ROI, Google Search y LinkedIn, y los casos B2B con cifras.`
        : 'Depende del caso; revisa la sección "Cómo elegir según tu empresa".',
    },
    {
      q: "¿Cuál es la mejor agencia para un e-commerce en Chile?",
      a: `Para e-commerce grandes, el mejor ajuste lo tienen ${
        perfil("ecommerce_grande")
          ?.top.map((t) => t.nombre)
          .join(", ") || "—"
      }. Para e-commerce pequeños y medianos, ${
        perfil("ecommerce_pyme")
          ?.top.map((t) => t.nombre)
          .join(", ") || "—"
      }. La diferencia está en el volumen: a gran escala pesan Shopping, Performance Max y equipo grande; en pymes, la gestión conjunta de Meta y Google y los precios publicados.`,
    },
    {
      q: "¿Cuánto cuesta una agencia de marketing digital en Chile?",
      a: `Entre las agencias que publican precios, los fees van desde cerca de $150.000 mensuales hasta varios millones según el alcance. Ejemplos publicados: ${conPrecio
        .slice(0, 4)
        .map((a) => `${a.nombre}, ${a.precios!.valor}`)
        .join(
          "; ",
        )}. La inversión en medios (Google, Meta, LinkedIn) se paga aparte.`,
    },
    {
      q: "¿Cómo se calcula el puntaje del ranking?",
      a: "Son 100 puntos repartidos en nueve criterios: reputación verificable (20), casos de éxito (20), clientes destacados (15), trayectoria (10), equipo (10), liderazgo y formación (10), especialidades (5), tecnología propia (5) e IA en producción (5). Solo cuenta lo que tiene una fuente pública que se pueda revisar; lo que no se pudo verificar no suma.",
    },
    {
      q: "¿Quién hace este ranking y es imparcial?",
      a: "Lo publica Muller y Pérez, que también es una agencia y aparece evaluada con exactamente las mismas reglas que el resto. Para que sea revisable, la metodología es pública, cada dato tiene su fuente enlazada y los datos crudos de cada mes quedan en un repositorio público.",
    },
    {
      q: "¿Cada cuánto se actualiza?",
      a: `El primer día de cada mes se vuelve a investigar a cada agencia, se verifican las fuentes y se recalcula el puntaje. Esta versión corresponde a ${mes}.`,
    },
    {
      q: "¿Por qué no aparece una agencia conocida?",
      a: 'Solo reciben puntaje las agencias de performance o marketing integral que operan en Chile y de las que se pudo verificar información suficiente. Las especializadas (creativas, influencers, SEO) se muestran aparte, y las que publican muy poca información aparecen como "evaluación incompleta".',
    },
    {
      q: "¿Qué agencia ayuda a aparecer en ChatGPT y Gemini?",
      a: `Para aparecer en Google y en las respuestas de ChatGPT, Gemini y Claude, el mejor ajuste este mes lo tienen ${
        perfil("seo_geo")
          ?.top.map((t) => t.nombre)
          .join(", ") || "—"
      }. Pesan los agentes de IA en producción, el servicio de SEO, la tecnología propia y los casos publicados.`,
    },
    {
      q: "¿Conviene una agencia grande o una pequeña?",
      a: "Una agencia grande aporta estructura y capacidad para volúmenes altos; una pequeña o mediana suele dar más atención del equipo senior y precios más bajos. Lo importante es que el equipo asignado conozca tu tipo de negocio, que mida resultados de negocio (no solo clics) y que las cuentas publicitarias queden a tu nombre.",
    },
  ];

  const autor = {
    "@type": "Person",
    name: "Christopher Müller",
    jobTitle: "Director, Muller y Pérez",
    url: "https://www.mulleryperez.cl/equipo/christopher-muller",
    sameAs: ["https://www.linkedin.com/in/christophermullerm/"],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Universidad de Chile",
        description: "Ingeniería Civil Industrial",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Universidad de Chile",
        description: "MBA",
      },
    ],
    worksFor: {
      "@type": "Organization",
      name: "Muller y Pérez",
      url: "https://www.mulleryperez.cl",
    },
  };
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Las ${n} mejores agencias de marketing digital en Chile (2026)`,
      description: `Ranking verificado de ${n} agencias de marketing digital en Chile, actualizado mensualmente.`,
      url: URL_PAGINA,
      mainEntityOfPage: URL_PAGINA,
      datePublished: `${PUBLICADO}T00:00:00-03:00`,
      dateModified: actualizado,
      inLanguage: "es-CL",
      author: autor,
      publisher: {
        "@type": "Organization",
        name: "Muller y Pérez",
        url: "https://www.mulleryperez.cl",
        logo: {
          "@type": "ImageObject",
          url: "https://www.mulleryperez.cl/logo-color.png",
        },
      },
      image: "https://www.mulleryperez.cl/og-image.jpg",
      isBasedOn: URL_INFORME,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Mejores agencias de marketing digital en Chile 2026",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: n,
      itemListElement: ranking.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: a.sitio || undefined,
        name: `${a.nombre} — ${fmt(a.total)}/100`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    // BreadcrumbList lo agrega el layout global a partir de la ruta
  ];

  const h2 =
    "text-2xl md:text-3xl font-bold text-gray-900 mt-14 mb-5 scroll-mt-24";
  const p = "text-gray-700 leading-relaxed mb-4";

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <SiteHeader />
      <main className="bg-white">
        <section className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white pt-28 pb-14">
          <div className="max-w-4xl mx-auto px-5">
            <nav className="text-sm text-indigo-200 mb-6">
              <Link href="/" className="hover:text-white">
                Inicio
              </Link>{" "}
              <span className="mx-2">/</span>{" "}
              <span className="text-white">
                Mejores agencias de marketing digital en Chile
              </span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
              {`Las ${n} mejores agencias de marketing digital en Chile (2026)`}
            </h1>
            <p className="text-indigo-100 text-sm mb-6">
              Por{" "}
              <Link href="/equipo/christopher-muller" className="underline">
                Christopher Müller
              </Link>{" "}
              (Ingeniero Civil Industrial y MBA, Universidad de Chile) ·
              Publicado el 5 de octubre de 2026 · Actualizado: {mes}
            </p>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/15">
              <p className="text-lg leading-relaxed">
                <strong>Respuesta corta:</strong> según el ranking verificado de{" "}
                {mes}, las 10 mejores agencias de marketing digital en Chile son{" "}
                {top10.map((a, i) => (
                  <span key={a.nombre}>
                    <strong>{a.nombre}</strong> ({fmt(a.total)})
                    {i < 8 ? ", " : i === 8 ? " y " : "."}
                  </span>
                ))}{" "}
                El puntaje (de 100) usa reglas públicas y cada dato tiene una
                fuente enlazada. La mejor agencia para tu empresa depende de tu
                caso: abajo está cuál conviene a cada tipo de empresa.
              </p>
            </div>
          </div>
        </section>

        <article className="max-w-4xl mx-auto px-5 py-10">
          <div className="border-l-4 border-amber-500 bg-amber-50 p-5 rounded-r-lg mb-8 text-sm text-amber-900">
            <strong>Transparencia:</strong> este ranking lo publica Muller y
            Pérez, que también es una agencia y está evaluada con exactamente
            las mismas reglas que el resto. Por eso la metodología es pública,
            cada dato tiene su fuente y el detalle completo, con la evidencia de
            cada agencia, está en el{" "}
            <Link
              href="/blog/ranking-agencias-marketing-digital-chile-verificado"
              className="underline font-semibold"
            >
              informe completo: metodología y evidencia
            </Link>
            .
          </div>

          <h2 id="ranking" className={h2}>
            El ranking: las {n} mejores agencias de marketing digital en Chile
          </h2>
          <p className={p}>
            Solo reciben puntaje las agencias de performance o marketing
            integral que operan en Chile y de las que se pudo verificar
            información suficiente (confianza alta). Las especializadas en
            creatividad o influencers y las evaluaciones incompletas se muestran
            más abajo.
          </p>

          <ol className="space-y-8 list-none p-0">
            {ranking.map((a, i) => {
              const f = fortalezas(a);
              const sin = sinInfo(a);
              return (
                <li
                  key={a.nombre}
                  className="border border-gray-200 rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {i + 1}. {a.nombre} — {fmt(a.total)}/100
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {[
                      a.anio ? `Fundada en ${a.anio}` : null,
                      ciudad(a),
                      a.equipo ? `Equipo: ${a.equipo}` : null,
                      a.fuentes_verificadas
                        ? `${a.fuentes_verificadas} datos verificados`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className={p}>
                    <strong>Para quién conviene:</strong> {paraQuien(a)}.
                  </p>
                  {f.length > 0 && (
                    <p className={p}>
                      <strong>Fortalezas verificadas:</strong> {f.join("; ")}.
                    </p>
                  )}
                  <p className={p}>
                    <strong>Precio de referencia:</strong>{" "}
                    {a.precios ? (
                      <>
                        {a.precios.valor} (
                        <a
                          href={a.precios.fuente}
                          target="_blank"
                          rel="noopener"
                          className="text-indigo-700 underline"
                        >
                          fuente
                        </a>
                        ).
                      </>
                    ) : (
                      "no publica precios en su sitio."
                    )}
                  </p>
                  {sin.length > 0 && (
                    <p className="text-sm text-gray-500 mb-2">
                      Sin información pública verificable en: {sin.join(", ")}{" "}
                      (no suma puntos).
                    </p>
                  )}
                  {a.sitio && (
                    <a
                      href={a.sitio}
                      target="_blank"
                      rel="noopener"
                      className="text-sm text-indigo-700 font-semibold underline"
                    >
                      Sitio de {a.nombre}
                    </a>
                  )}
                </li>
              );
            })}
          </ol>

          <h2 id="tabla" className={h2}>
            Tabla resumen del ranking
          </h2>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Agencia</th>
                  <th className="p-3 text-right">Puntaje</th>
                  <th className="p-3 text-left">Mejor para</th>
                  <th className="p-3 text-left">Ciudad</th>
                  <th className="p-3 text-right">Fundación</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((a, i) => (
                  <tr
                    key={a.nombre}
                    className={i % 2 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-semibold">{a.nombre}</td>
                    <td className="p-3 text-right font-bold">{fmt(a.total)}</td>
                    <td className="p-3">{mejorParaCorto(a)}</td>
                    <td className="p-3">{ciudad(a)}</td>
                    <td className="p-3 text-right">{a.anio || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mt-8 mb-3">
            Agencias especializadas (no compiten en el ranking general)
          </h3>
          <p className={p}>
            Tienen otra especialidad principal y se consideran solo en los
            perfiles donde su especialidad aplica:{" "}
            {d.especializadas.map((a, i) => (
              <span key={a.nombre}>
                {a.nombre} ({(a as any).tipo || "especializada"}, {fmt(a.total)}
                ){i < d.especializadas.length - 1 ? "; " : "."}
              </span>
            ))}
          </p>
          {d.incompletas.length > 0 && (
            <p className={p}>
              <strong>Evaluación incompleta este mes</strong> (publican muy poca
              información verificable, por lo que no reciben lugar en el
              ranking): {d.incompletas.map((a) => a.nombre).join(", ")}.
            </p>
          )}

          <h2 id="que-es" className={h2}>
            Qué es una agencia de marketing digital y qué hace
          </h2>
          <p className={p}>
            Una agencia de marketing digital planifica, ejecuta y mide la
            presencia de una empresa en los canales digitales: publicidad en
            Google, Meta (Facebook e Instagram), LinkedIn y TikTok;
            posicionamiento orgánico en buscadores (SEO) y, cada vez más, en las
            respuestas de los asistentes de IA como ChatGPT o Gemini (GEO);
            contenido para redes sociales; sitios y landing pages; y la medición
            de todo eso hasta la venta.
          </p>
          <p className={p}>
            No todas hacen lo mismo. Las agencias de{" "}
            <strong>performance</strong> se miden por resultados de negocio:
            leads calificados, ventas, costo por adquisición y retorno de la
            inversión publicitaria. Las <strong>creativas o de branding</strong>{" "}
            trabajan la notoriedad y el recuerdo de marca, con producción
            audiovisual y campañas de alto impacto. Las de{" "}
            <strong>influencers</strong> gestionan creadores de contenido, y las
            de <strong>SEO</strong> se concentran en el tráfico orgánico. Este
            ranking compara solo agencias de performance o integrales entre sí,
            porque comparar una agencia creativa con una de performance es como
            comparar una productora con un equipo de ventas.
          </p>
          <p className={p}>
            Lo que conviene revisar en cualquier agencia, más allá del ranking:
            que las cuentas publicitarias, las audiencias y los datos queden a
            nombre de tu empresa; que la inversión en medios se pague directo a
            las plataformas, sin comisiones ocultas; que el equipo que trabajará
            tu cuenta sea propio y no subcontratado; y que el reporte mida
            cuántos leads o ventas trajo cada peso invertido, no solo clics e
            impresiones.
          </p>

          <h2 id="como-elegir" className={h2}>
            Cómo elegir según tu empresa
          </h2>
          <p className={p}>
            La mejor agencia depende del caso. El ranking calcula, con los
            mismos datos verificados, qué agencias se ajustan mejor a ocho
            perfiles de empresa. Cada perfil pondera distinto lo que importa: no
            necesita lo mismo una empresa B2B con ciclos de venta largos que un
            e-commerce que vende en un día.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {d.perfiles.map((pf) => (
              <div
                key={pf.id}
                className="border border-gray-200 rounded-xl p-5"
              >
                <h3 className="font-bold text-gray-900 mb-2">{pf.titulo}</h3>
                <p className="text-sm text-gray-600 mb-3">{pf.importa}</p>
                <p className="text-sm">
                  <strong>Mejor ajuste:</strong>{" "}
                  {pf.top.map((t, i) => `${i + 1}. ${t.nombre}`).join(" · ")}
                </p>
              </div>
            ))}
          </div>

          <h2 id="precios" className={h2}>
            Cuánto cuesta una agencia de marketing digital en Chile
          </h2>
          <p className={p}>
            El costo de una agencia tiene dos partes: el{" "}
            <strong>fee de gestión</strong>, que es lo que cobra la agencia, y
            la <strong>inversión en medios</strong>, que se paga directo a
            Google, Meta o LinkedIn y no debería tener comisión. La mayoría de
            las agencias no publica precios; estas sí lo hacen en su sitio:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-3 text-left">Agencia</th>
                  <th className="p-3 text-left">Precio publicado</th>
                  <th className="p-3 text-left">Fuente</th>
                </tr>
              </thead>
              <tbody>
                {conPrecio.map((a, i) => (
                  <tr key={a.nombre} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="p-3 font-semibold">{a.nombre}</td>
                    <td className="p-3">{a.precios!.valor}</td>
                    <td className="p-3">
                      <a
                        href={a.precios!.fuente}
                        target="_blank"
                        rel="noopener"
                        className="text-indigo-700 underline"
                      >
                        ver
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={p}>
            En términos generales, un servicio básico de una sola persona o de
            una agencia pequeña parte cerca de los $150.000 a $500.000
            mensuales; una agencia profesional con equipo de paid media,
            contenido y diseño se mueve entre $600.000 y $2.500.000 mensuales
            más IVA; y los servicios corporativos o de grupos con más de 100
            personas superan esos montos. A eso hay que sumar la inversión en
            medios: para ver resultados medibles en Google o Meta, un piso
            razonable son $300.000 a $500.000 mensuales, y en LinkedIn algo más,
            porque el clic es más caro.
          </p>
          <p className={p}>
            Una advertencia: el precio más bajo no siempre es el más barato.
            Antes de comparar fees, compara qué incluye cada uno (cuántas
            campañas, cuántos contenidos, quién los hace, cada cuánto reportan)
            y quién queda como dueño de las cuentas. Para estimar cuánto
            invertir en publicidad según tu rubro puedes usar el{" "}
            <Link href="/predictor" className="text-indigo-700 underline">
              predictor de campañas
            </Link>
            .
          </p>

          <h2 id="antes-de-contratar" className={h2}>
            Qué preguntar antes de contratar una agencia de marketing digital
          </h2>
          <p className={p}>
            El ranking ayuda a armar una lista corta, pero la decisión final se toma en las reuniones. Estas son las preguntas que separan a una agencia que va a mover tus ventas de una que solo va a administrar anuncios:
          </p>
          <ol className="list-decimal pl-6 text-gray-700 space-y-3 mb-6">
            <li><strong>¿Quién va a trabajar mi cuenta y cuánta experiencia tiene?</strong> Pide nombres y cargos. En muchas agencias el socio vende y un ejecutivo junior opera; no es malo en sí, pero conviene saberlo antes de firmar.</li>
            <li><strong>¿Las cuentas de Google Ads, Meta y Analytics quedan a nombre de mi empresa?</strong> Deben quedar a tu nombre desde el primer día. Si la agencia las crea en su propio administrador y te vas, pierdes el historial y el aprendizaje de las campañas.</li>
            <li><strong>¿Cómo cobran la inversión en medios?</strong> Lo sano es que pagues directo a las plataformas con tu tarjeta o con facturación a tu nombre. Desconfía de los presupuestos que mezclan fee y medios en una sola cifra.</li>
            <li><strong>¿Qué miden en el reporte?</strong> Un buen reporte habla de leads calificados, ventas, costo por adquisición (CAC) y retorno, no solo de clics, alcance e impresiones. Pregunta si conectan las campañas con tu CRM o con tu e-commerce.</li>
            <li><strong>¿Tienen casos en mi industria o con un ciclo de venta parecido?</strong> Una empresa B2B con ventas de tres meses necesita otra estrategia que una tienda online que vende en minutos. Pide un caso con cifras y, si es posible, un cliente al que puedas llamar.</li>
            <li><strong>¿Cuál es el plazo mínimo y cómo se termina el contrato?</strong> Tres meses es un plazo razonable para que las campañas aprendan y se puedan medir resultados. Contratos de 12 meses sin salida son una señal de alerta.</li>
            <li><strong>¿Qué pasa el primer mes?</strong> Una agencia seria parte con una auditoría de lo que ya existe (cuentas, medición, sitio, competencia) y un plan con metas, no lanzando anuncios a ciegas.</li>
          </ol>

          <h2 id="senales-de-alerta" className={h2}>
            Señales de alerta al elegir agencia
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>Promete resultados garantizados (primer lugar en Google, cierto número de ventas) sin conocer tu negocio.</li>
            <li>No muestra casos con cifras ni clientes identificables, o solo muestra métricas de alcance y seguidores.</li>
            <li>Se queda con la propiedad de las cuentas publicitarias, del sitio web o de las audiencias.</li>
            <li>Cobra un porcentaje de la inversión en medios sin un tope, lo que la incentiva a recomendar gastar más y no a gastar mejor.</li>
            <li>No tiene reseñas públicas verificables o tiene muy pocas en relación con los años que dice tener en el mercado.</li>
            <li>No puede explicar en una frase cómo va a medir si la campaña funcionó.</li>
          </ul>
          <p className={p}>
            Estas mismas señales son las que el ranking intenta medir de forma objetiva: la reputación verificable, los casos con cifras, el equipo propio y la tecnología para medir resultados suman puntos; las afirmaciones que no se pueden comprobar no suman.
          </p>

          <h2 id="agencia-inhouse-freelance" className={h2}>
            Agencia, equipo interno o freelance: qué conviene
          </h2>
          <p className={p}>
            <strong>Un freelance</strong> sirve cuando el presupuesto es acotado y se necesita una sola especialidad, por ejemplo administrar una campaña de Google Ads. Es la opción más económica, pero depende de una persona: si se enferma, se va o se satura, la cuenta queda detenida, y rara vez cubre diseño, contenido, medición y estrategia a la vez.
          </p>
          <p className={p}>
            <strong>Un equipo interno</strong> conoce mejor el negocio y responde más rápido, pero armarlo es caro: un especialista en paid media, un diseñador y un analista con experiencia suman varias veces el fee de una agencia, además del tiempo de selección y de las herramientas que hay que pagar aparte. Tiene sentido cuando la inversión publicitaria es alta y estable.
          </p>
          <p className={p}>
            <strong>Una agencia</strong> entrega un equipo completo por un costo fijo y trae aprendizajes de muchas cuentas a la vez, lo que acelera las pruebas. Su desventaja es que no vive dentro de tu empresa; por eso importa tanto que tenga una persona de contacto senior y reportes claros. Un modelo mixto, con una persona interna que coordine y una agencia que ejecute, suele ser el más eficiente para empresas medianas. Hay una comparación más detallada en{" "}
            <Link href="/agencia-marketing-digital-vs-inhouse" className="text-indigo-700 underline">
              agencia de marketing digital vs. equipo interno
            </Link>
            .
          </p>

          <h2 id="tendencias" className={h2}>
            Qué está cambiando en las agencias de marketing digital en Chile
          </h2>
          <p className={p}>
            <strong>La búsqueda ya no es solo Google.</strong> Cada vez más personas preguntan a ChatGPT, Gemini o Perplexity qué empresa contratar. Estas herramientas arman su respuesta a partir de páginas que pueden citar, con datos verificables y fuentes. Por eso varias agencias empezaron a ofrecer GEO (optimización para motores generativos) junto al SEO tradicional; el ranking mide, por su parte, si tienen agentes de IA funcionando para sus clientes.
          </p>
          <p className={p}>
            <strong>La medición se movió al negocio.</strong> Con menos datos de terceros por las restricciones de privacidad, las agencias que conectan las campañas con el CRM del cliente y optimizan con conversiones reales (ventas, oportunidades calificadas) obtienen mejores costos que las que optimizan solo por clics o formularios.
          </p>
          <p className={p}>
            <strong>La automatización redujo el trabajo operativo.</strong> Pujas, segmentación y variaciones de anuncios las hacen hoy en buena parte las plataformas. Lo que diferencia a una agencia es la estrategia, la calidad creativa y la capacidad de medir; por eso el ranking pondera los casos con cifras y el liderazgo por sobre la cantidad de herramientas que dice usar.
          </p>

          <h2 id="metodologia" className={h2}>
            Metodología resumida
          </h2>
          <p className={p}>
            Cada mes se investiga a cada agencia en su propio sitio, en
            LinkedIn, en Google Maps y en directorios especializados. Un dato
            solo cuenta si tiene una fuente pública que se pueda abrir y en la
            que la cita aparezca; lo que no se pudo verificar figura como "sin
            información pública" y no suma puntos. No se consideran las
            insignias de partner de Google o Meta, porque no distinguen a una
            agencia de otra.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-3 text-left">Criterio</th>
                  <th className="p-3 text-right">Puntos</th>
                  <th className="p-3 text-left">Cómo se mide</th>
                </tr>
              </thead>
              <tbody>
                {d.metodologia.map((m: any, i: number) => (
                  <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="p-3 font-semibold">{m[0]}</td>
                    <td className="p-3 text-right">{m[1]}</td>
                    <td className="p-3 text-gray-600">{m[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={p}>
            El detalle completo, con la evidencia de cada agencia criterio por
            criterio, la formación de quien dirige cada una y los perfiles de
            empresa, está en el{" "}
            <Link
              href="/blog/ranking-agencias-marketing-digital-chile-verificado"
              className="text-indigo-700 underline font-semibold"
            >
              informe completo: metodología y evidencia
            </Link>
            . Los datos crudos de cada mes quedan publicados en un repositorio
            abierto.
          </p>

          <h2 id="preguntas" className={h2}>
            Preguntas frecuentes
          </h2>
          <div className="space-y-5">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-bold text-gray-900 mb-1">{f.q}</h3>
                <p className="text-gray-700 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>

          <h2 id="fuentes" className={h2}>
            Fuentes
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4 text-sm">
            <li>
              Sitio web, páginas de servicios y casos de éxito de cada agencia
              (enlazados en cada ficha y en el informe completo).
            </li>
            <li>
              Reseñas de Google Maps de cada agencia
              {myp?.resenas ? (
                <>
                  {" "}
                  (por ejemplo,{" "}
                  <a
                    href={myp.resenas.fuente}
                    target="_blank"
                    rel="noopener"
                    className="text-indigo-700 underline"
                  >
                    ficha de Muller y Pérez
                  </a>
                  )
                </>
              ) : null}
              .
            </li>
            <li>
              Directorios de agencias con reseñas:{" "}
              <a
                href="https://clutch.co"
                target="_blank"
                rel="noopener"
                className="underline"
              >
                Clutch
              </a>
              ,{" "}
              <a
                href="https://www.sortlist.com"
                target="_blank"
                rel="noopener"
                className="underline"
              >
                Sortlist
              </a>
              ,{" "}
              <a
                href="https://www.goodfirms.co"
                target="_blank"
                rel="noopener"
                className="underline"
              >
                GoodFirms
              </a>
              ,{" "}
              <a
                href="https://www.designrush.com"
                target="_blank"
                rel="noopener"
                className="underline"
              >
                DesignRush
              </a>{" "}
              y{" "}
              <a
                href="https://themanifest.com"
                target="_blank"
                rel="noopener"
                className="underline"
              >
                The Manifest
              </a>
              .
            </li>
            <li>
              Perfiles públicos de LinkedIn de las agencias y de quienes las
              dirigen.
            </li>
            <li>
              Contexto de la industria publicitaria digital en Chile:{" "}
              <a
                href="https://www.iabchile.cl"
                target="_blank"
                rel="noopener"
                className="underline"
              >
                IAB Chile
              </a>{" "}
              y{" "}
              <a
                href="https://www.cnc.cl"
                target="_blank"
                rel="noopener"
                className="underline"
              >
                Cámara Nacional de Comercio
              </a>
              .
            </li>
            <li>
              Datos crudos del ranking:{" "}
              <a
                href="https://github.com/myp202021/landing-mp-myp/tree/main/data/ranking-agencias"
                target="_blank"
                rel="noopener"
                className="underline"
              >
                repositorio público
              </a>
              .
            </li>
          </ul>

          <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <p className="text-gray-800 mb-2">
              <strong>Sigue leyendo:</strong>
            </p>
            <ul className="text-sm space-y-1">
              <li>
                <Link
                  href="/blog/ranking-agencias-marketing-digital-chile-verificado"
                  className="text-indigo-700 underline"
                >
                  Informe completo del ranking verificado (metodología y
                  evidencia)
                </Link>
              </li>
              <li>
                <Link
                  href="/cuanto-cuesta-agencia-marketing-digital-chile"
                  className="text-indigo-700 underline"
                >
                  Cuánto cuesta una agencia de marketing digital en Chile
                </Link>
              </li>
              <li>
                <Link
                  href="/mejores-agencias-performance-marketing-chile"
                  className="text-indigo-700 underline"
                >
                  Agencias de performance marketing en Chile
                </Link>
              </li>
              <li>
                <Link
                  href="/guia-definitiva-elegir-agencia-marketing-chile-2026"
                  className="text-indigo-700 underline"
                >
                  Guía para elegir agencia de marketing
                </Link>
              </li>
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}
