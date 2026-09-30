/**
 * Página Servicio: CRO Chile (optimización de la tasa de conversión)
 * Target: "agencia cro chile", "optimización de conversión", "conversion rate optimization chile",
 * "aumentar conversiones sitio web"
 * Sin métricas inventadas: se describe el proceso y los entregables.
 */

import { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import {
  createMetadata,
  createServiceSchema,
  createFAQPageSchema,
} from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Agencia CRO en Chile: optimización de conversión B2B y B2C",
  description:
    "CRO en Chile con resultados reales: CPA de $17.100 a $826 en Power Energy y CPL de $21.048 a $7.337 en Genera. Clarity, landing pages, formularios y seguimiento hasta tu CRM.",
  keywords: [
    "agencia cro chile",
    "optimización de conversión",
    "conversion rate optimization chile",
    "aumentar conversiones sitio web",
    "cro b2b",
    "optimización de landing pages",
    "microsoft clarity chile",
  ],
  path: "/servicios/cro-chile",
});

const RESPUESTA_DIRECTA =
  "El CRO (optimización de la tasa de conversión) consiste en lograr que una mayor parte de las visitas que ya llegan a tu sitio se conviertan en leads o ventas. Se hace midiendo bien cada conversión, observando cómo navegan las personas, corrigiendo lo que las frena en landing pages y formularios, y probando cambios con datos. En Muller y Pérez lo conectamos con tus campañas y con tu CRM, para optimizar sobre ventas reales y no solo sobre formularios enviados. Con este método bajamos el costo por conversión de Power Energy de $17.100 a $826 y el costo por lead de Genera en Meta Ads de $21.048 a $7.337.";

const QUE_HACEMOS = [
  {
    titulo: "Auditoría del embudo",
    texto:
      "Revisamos el recorrido completo: anuncio, página de destino, formulario, gracias y seguimiento comercial. Identificamos dónde se pierde la mayor cantidad de personas.",
  },
  {
    titulo: "Mapas de calor y grabaciones",
    texto:
      "Instalamos Microsoft Clarity para ver dónde hacen clic, hasta dónde bajan y en qué punto abandonan. Es gratis y no afecta la velocidad del sitio de forma relevante.",
  },
  {
    titulo: "Landing pages y formularios",
    texto:
      "Ajustamos mensajes, estructura, llamados a la acción y campos de formulario. En B2B cuidamos que el formulario califique sin espantar; en B2C, que el camino a la compra sea corto.",
  },
  {
    titulo: "Medición de conversiones",
    texto:
      "Configuramos las conversiones en GA4, Google Ads y Meta Ads, con página de gracias y eventos correctos, para que cada plataforma optimice sobre datos reales.",
  },
  {
    titulo: "Seguimiento del lead hasta el CRM",
    texto:
      "Conectamos los formularios a tu CRM (Pipedrive, HubSpot, Salesforce u otro) para saber qué campañas y páginas generan ventas y no solo contactos.",
  },
  {
    titulo: "Pruebas A/B",
    texto:
      "Cuando hay tráfico suficiente, probamos variantes de página o de formulario y dejamos la que convierte más, con criterios definidos antes de empezar.",
  },
];

// Resultados reales publicados en /casos-de-exito (datos extraídos de las plataformas de cada cliente)
const RESULTADOS = [
  {
    cliente: "Power Energy",
    rubro: "Iluminación industrial · B2B + B2C · 15 meses",
    cifra: "-95%",
    etiqueta: "costo por conversión",
    antes: "$17.100",
    despues: "$826",
    detalle: [
      "327 conversiones al mes",
      "Mejor tasa de conversión: 56,79% (Meta, post orgánico potenciado)",
      "Google Ads: 81,44% de impresiones sobre el pliegue",
    ],
  },
  {
    cliente: "Genera",
    rubro: "Software B2B · 15 meses",
    cifra: "-65%",
    etiqueta: "costo por lead en Meta Ads",
    antes: "$21.048",
    despues: "$7.337",
    detalle: [
      "374 leads al mes",
      "Mejor tasa de conversión: 10,85% (Meta \"Leads Oferta\")",
      "Remarketing Performance Max: CPL $6.459",
    ],
  },
  {
    cliente: "CyM Propiedades",
    rubro: "Corredora de propiedades · 3 meses",
    cifra: "95%",
    etiqueta: "de leads incrementales",
    antes: null,
    despues: null,
    detalle: [
      "Solo 5% de leads duplicados",
      "Seguimiento automático por WhatsApp 24 horas después de cada lead",
      "Panel de inversión y leads por comuna en tiempo real",
    ],
  },
];

const PASOS = [
  {
    titulo: "Diagnóstico",
    cuando: "Semanas 1 y 2",
    que: "Auditoría del embudo, revisión de la medición actual e instalación de Microsoft Clarity.",
    entrega: "Informe con los puntos de fuga priorizados",
  },
  {
    titulo: "Medición correcta",
    cuando: "Semana 2",
    que: "Conversiones configuradas en GA4, Google Ads y Meta Ads, y formularios conectados al CRM.",
    entrega: "Conversiones verificadas en cada plataforma",
  },
  {
    titulo: "Mejoras",
    cuando: "Desde la semana 3",
    que: "Cambios en landing pages y formularios según lo que muestran los datos y las grabaciones.",
    entrega: "Páginas y formularios actualizados",
  },
  {
    titulo: "Pruebas y seguimiento",
    cuando: "Mensual",
    que: "Pruebas A/B cuando el volumen lo permite y revisión de la tasa de conversión por campaña y por página.",
    entrega: "Reporte con lo probado, lo aprendido y lo que sigue",
  },
];

const faqs = [
  {
    q: "¿Qué es el CRO?",
    a: "CRO significa Conversion Rate Optimization, u optimización de la tasa de conversión. Es el trabajo de lograr que un porcentaje mayor de las visitas de un sitio web complete la acción que importa: comprar, dejar sus datos o agendar una reunión.",
  },
  {
    q: "¿Por qué hacer CRO si ya invierto en publicidad?",
    a: "Porque cada mejora en conversión abarata todo el tráfico que ya pagas. Si la página convierte mejor, el mismo presupuesto en Google Ads o Meta Ads genera más leads o ventas.",
  },
  {
    q: "¿El CRO sirve para empresas B2B?",
    a: "Sí. En B2B el objetivo no es solo que llegue un formulario, sino que llegue un lead que el equipo comercial pueda cerrar. Por eso conectamos los formularios al CRM y medimos qué páginas y campañas generan oportunidades reales.",
  },
  {
    q: "¿Qué herramientas usan?",
    a: "Microsoft Clarity para mapas de calor y grabaciones, GA4 para analítica, las herramientas de conversión de Google Ads y Meta Ads, y el CRM que ya use tu empresa.",
  },
  {
    q: "¿Necesito cambiar mi sitio web?",
    a: "No necesariamente. La mayoría de las mejoras se hacen sobre las páginas y formularios existentes. Si hace falta una landing nueva para una campaña, la hacemos a pedido.",
  },
  {
    q: "¿Cuánto tráfico necesito para hacer pruebas A/B?",
    a: "Depende de cuántas conversiones tengas al mes. Con poco volumen, primero se corrigen los problemas evidentes que muestran los datos y las grabaciones; las pruebas A/B se hacen cuando hay suficientes conversiones para llegar a una conclusión confiable.",
  },
];

export default function CROChilePage() {
  const serviceSchema = createServiceSchema({
    name: "CRO Chile: optimización de la tasa de conversión",
    description:
      "Optimización de conversión para empresas B2B y B2C en Chile: auditoría del embudo, Microsoft Clarity, landing pages, formularios, medición en GA4 y Ads, seguimiento del lead hasta el CRM y pruebas A/B.",
    serviceType: "Conversion Rate Optimization",
    price: "950000",
    priceCurrency: "CLP",
  });
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SiteHeader />
      <div className="min-h-screen bg-[#F7F7FB] text-[#1B1740]">
        {/* Hero */}
        <section className="bg-[#1B1740] text-white pt-28 pb-20 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-12 items-end">
            <div>
              <h1 className="text-4xl md:text-[3.25rem] font-black leading-[1.05] tracking-tight mb-6">
                Más leads y ventas con el mismo tráfico
              </h1>
              <p className="text-lg text-indigo-100/90 leading-relaxed max-w-xl mb-8">
                Optimización de conversión para empresas B2B y B2C en Chile:
                medimos bien, vemos dónde se pierde la gente y corregimos
                landing pages y formularios, conectado a tus campañas y a tu
                CRM.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/#contacto"
                  className="text-center px-6 py-3.5 bg-white text-[#1B1740] rounded-xl font-bold hover:bg-indigo-50"
                >
                  Pedir diagnóstico de conversión
                </Link>
                <Link
                  href="/casos-de-exito"
                  className="text-center px-6 py-3.5 border border-white/30 rounded-xl font-semibold hover:bg-white/10"
                >
                  Ver casos de éxito
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
        </section>

        {/* Resultados reales */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Resultados reales de clientes
            </h2>
            <p className="text-slate-600 max-w-2xl mb-12">
              Datos tomados directamente de las plataformas de cada cliente,
              publicados con detalle en{" "}
              <Link href="/casos-de-exito" className="text-[#4F46E5] font-semibold underline">
                casos de éxito
              </Link>
              .
            </p>
            <div className="grid gap-6 lg:grid-cols-3">
              {RESULTADOS.map((r) => (
                <div
                  key={r.cliente}
                  className="bg-[#F7F7FB] rounded-2xl p-7 ring-1 ring-slate-200 flex flex-col"
                >
                  <p className="text-sm font-semibold text-[#4F46E5]">{r.rubro}</p>
                  <h3 className="text-xl font-black mt-1 mb-5">{r.cliente}</h3>
                  <p className="text-5xl font-black text-[#1B1740] leading-none">{r.cifra}</p>
                  <p className="text-sm text-slate-600 mt-2 mb-5">{r.etiqueta}</p>
                  {r.antes && r.despues && (
                    <div className="flex items-center gap-3 mb-5 text-sm">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 line-through">
                        {r.antes}
                      </span>
                      <span aria-hidden="true">→</span>
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                        {r.despues}
                      </span>
                    </div>
                  )}
                  <ul className="text-sm text-slate-700 space-y-2 border-t border-slate-200 pt-4 mt-auto">
                    {r.detalle.map((d) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Qué hacemos */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-12">
              Qué hacemos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {QUE_HACEMOS.map((q) => (
                <div
                  key={q.titulo}
                  className="bg-white rounded-2xl p-7 ring-1 ring-slate-200"
                >
                  <h3 className="text-lg font-black mb-3">{q.titulo}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {q.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proceso */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Cómo funciona, paso a paso
            </h2>
            <p className="text-slate-600 max-w-2xl mb-14">
              Cuatro pasos en orden, cada uno con algo concreto que recibes.
            </p>
            <ol className="grid gap-6 lg:grid-cols-4">
              {PASOS.map((p, i) => (
                <li key={p.titulo} className="flex flex-col">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4F46E5] text-white text-lg font-black mb-6">
                    {i + 1}
                  </span>
                  <div className="bg-[#F7F7FB] rounded-2xl p-6 ring-1 ring-slate-200 flex-1 flex flex-col">
                    <p className="text-sm font-semibold text-[#4F46E5] mb-1">
                      {p.cuando}
                    </p>
                    <h3 className="text-lg font-black leading-snug mb-3">
                      {p.titulo}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                      {p.que}
                    </p>
                    <div className="text-sm border-t border-slate-200 pt-4">
                      <p className="text-slate-500">Qué recibes</p>
                      <p className="font-semibold">{p.entrega}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Relación con otros servicios */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
              CRO conectado a tus campañas
            </h2>
            <p className="text-slate-600 leading-relaxed">
              El CRO rinde más cuando se trabaja junto a la pauta. Las campañas
              de{" "}
              <Link
                href="/servicios/google-ads-chile"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                Google Ads
              </Link>{" "}
              y{" "}
              <Link
                href="/servicios/meta-ads-chile"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                Meta Ads
              </Link>{" "}
              nos dicen qué buscan las personas que llegan, y las mejoras de
              conversión bajan el costo de cada lead. Para empresas B2B, revisa
              también{" "}
              <Link
                href="/marketing-digital-b2b-chile"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                marketing digital B2B
              </Link>
              .
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-10">
              Preguntas frecuentes sobre CRO
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
                ¿Dónde se te están yendo los clientes?
              </h2>
              <p className="text-indigo-100/90">
                El diagnóstico te muestra en qué paso del embudo se pierde más
                gente y qué corregir primero.
              </p>
            </div>
            <Link
              href="/#contacto"
              className="text-center px-6 py-3.5 bg-white text-[#1B1740] rounded-xl font-bold hover:bg-indigo-50"
            >
              Pedir diagnóstico de conversión
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
