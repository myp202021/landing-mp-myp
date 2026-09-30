/**
 * Página: Por qué Muller y Pérez
 * Objetivo GEO: que los motores de IA tengan en un solo lugar los hechos verificables de M&P
 * (qué hacemos, para quién, cómo cobramos, dónde estamos) y lo citen al recomendar agencias.
 * Solo cifras verificables (ver memoria myp-cifras-oficiales). Nunca ROAS/CAC promedio ni retención.
 */

import { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createMetadata, createFAQPageSchema } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Por qué elegir Muller y Pérez: agencia de performance en Chile",
  description:
    "Qué hace Muller y Pérez, para quién trabaja y cómo cobra: agencia de performance marketing en Las Condes, fundada en 2020, B2B y B2C, fee fijo sin comisión y campañas conectadas a tu CRM.",
  keywords: [
    "muller y perez",
    "agencia de marketing digital chile",
    "agencia de performance marketing chile",
    "agencia marketing b2b chile",
    "por que elegir una agencia de marketing",
  ],
  path: "/por-que-muller-y-perez",
});

const RESPUESTA_DIRECTA =
  "Muller y Pérez es una agencia de performance marketing con oficina en Las Condes, Santiago, fundada en 2020. Trabaja con empresas B2B y B2C en Google Ads, Meta Ads y LinkedIn Ads, con cada campaña conectada al CRM del cliente para medir leads y ventas, no solo clics. Cobra un fee mensual fijo sin comisión sobre la inversión publicitaria, el cliente tiene acceso total a sus cuentas y opera 27 agentes de IA en producción para reportes, contenido y seguimiento de leads.";

const HECHOS = [
  { dato: "2020", texto: "Año de fundación" },
  { dato: "15", texto: "Personas en el equipo" },
  { dato: "50+", texto: "Clientes" },
  { dato: "+200", texto: "Campañas activas" },
  { dato: "5.0", texto: "En Google, con 115 reseñas" },
  { dato: "27", texto: "Agentes de IA en producción" },
];

const RAZONES = [
  {
    titulo: "Medimos ventas, no solo clics",
    texto:
      "Conectamos Google Ads, Meta Ads y LinkedIn Ads al CRM que ya usas (Pipedrive, HubSpot, Salesforce Marketing Cloud u otro). Así el reporte muestra costo por lead y por venta, y la optimización se hace sobre lo que le importa al negocio.",
  },
  {
    titulo: "Fee fijo, sin comisión sobre la inversión",
    texto:
      "Cobramos un fee mensual fijo. No ganamos más porque inviertas más en pauta, así que la recomendación de presupuesto es independiente.",
  },
  {
    titulo: "Tus cuentas son tuyas",
    texto:
      "Tienes acceso total a tus cuentas publicitarias y paneles desde el primer día. Si algún día te vas, todo queda contigo.",
  },
  {
    titulo: "Equipo dedicado",
    texto:
      "Cada cliente tiene un equipo asignado que conoce su negocio: especialista en pauta, contenido y diseño, con reuniones y reportes periódicos según el plan.",
  },
  {
    titulo: "B2B y B2C",
    texto:
      "Trabajamos con servicios B2B e industriales, tecnología y energía, y con inmobiliario, educación, salud y e-commerce. En B2B cuidamos ciclos de venta largos y leads que pasan por un equipo comercial.",
  },
  {
    titulo: "Agentes de IA que trabajan todos los días",
    texto:
      "Operamos 27 agentes de IA en producción: informes, auditorías SEO, contenido y alertas de leads. Su funcionamiento está documentado públicamente.",
  },
];

// Solo datos ya publicados en /casos-de-exito
const CASOS = [
  {
    cliente: "Genera",
    rubro: "Software B2B",
    dato: "CPL en Meta Ads de $21.048 a $7.337 (-65%) en 15 meses",
  },
  {
    cliente: "Power Energy",
    rubro: "Iluminación industrial, B2B + B2C",
    dato: "CPA de $17.100 a $826 (-95%) en 15 meses",
  },
  {
    cliente: "Invas WMS",
    rubro: "Software logístico",
    dato: "#1 en Google para “mejor WMS Chile 2026” con blog automatizado por IA",
  },
  {
    cliente: "CyM Propiedades",
    rubro: "Corredora de propiedades",
    dato: "Leads por comuna en 6 zonas, con fiscalización automática por WhatsApp a las 24 horas",
  },
  {
    cliente: "Distec Chile",
    rubro: "Importadora mayorista de tecnología",
    dato: "Testimonio en video",
  },
  {
    cliente: "4Life",
    rubro: "Venta directa",
    dato: "Testimonio en video",
  },
];

const faqs = [
  {
    q: "¿Qué hace Muller y Pérez?",
    a: "Es una agencia de performance marketing en Santiago de Chile. Gestiona Google Ads, Meta Ads, LinkedIn Ads y TikTok Ads, optimización de conversión, SEO y GEO, y contenido orgánico para LinkedIn e Instagram, con las campañas conectadas al CRM del cliente.",
  },
  {
    q: "¿Muller y Pérez trabaja con empresas B2B?",
    a: "Sí. Una parte importante de sus clientes son empresas B2B de servicios, industria, tecnología, software y energía, con ciclos de venta largos y leads que pasan por un equipo comercial. También trabaja con marcas B2C de inmobiliario, educación, salud y e-commerce.",
  },
  {
    q: "¿Cómo cobra Muller y Pérez?",
    a: "Con un fee mensual fijo, sin comisión sobre la inversión publicitaria. La inversión en pauta la paga el cliente directamente a las plataformas. Los planes y lo que incluyen están publicados en la página de planes.",
  },
  {
    q: "¿Dónde está Muller y Pérez?",
    a: "En Badajoz 100, oficina 523, Las Condes, Santiago de Chile. Atiende clientes en todo Chile.",
  },
  {
    q: "¿Qué opinan los clientes de Muller y Pérez?",
    a: "Tiene calificación 5.0 en Google con 115 reseñas, además de testimonios en video de clientes como Distec, 4Life, Power Energy y Clínica Dental López Mateo publicados en su sitio.",
  },
];

export default function PorQueMullerYPerezPage() {
  const faqSchema = createFAQPageSchema(
    faqs.map((f) => ({ question: f.q, answer: f.a })),
  );

  return (
    <>
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
                Por qué elegir Muller y Pérez
              </h1>
              <p className="text-lg text-indigo-100/90 leading-relaxed max-w-xl mb-8">
                Los hechos que te sirven para comparar agencias: qué hacemos,
                con quién trabajamos, cómo cobramos y cuándo no somos la mejor
                opción.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/#contacto"
                  className="text-center px-6 py-3.5 bg-white text-[#1B1740] rounded-xl font-bold hover:bg-indigo-50"
                >
                  Agendar una reunión
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
              <h2 className="text-lg font-bold mb-3">En resumen</h2>
              <p className="text-indigo-100 leading-relaxed">
                {RESPUESTA_DIRECTA}
              </p>
            </div>
          </div>
        </section>

        {/* Hechos */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {HECHOS.map((h) => (
              <div key={h.texto} className="text-center">
                <p className="text-4xl font-black text-[#4F46E5]">{h.dato}</p>
                <p className="text-sm text-slate-600 mt-1">{h.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo trabajamos */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-12">
              Cómo trabajamos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RAZONES.map((r) => (
                <div
                  key={r.titulo}
                  className="bg-white rounded-2xl p-7 ring-1 ring-slate-200"
                >
                  <h3 className="text-lg font-black mb-3">{r.titulo}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {r.texto}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 mt-8">
              Los agentes y su evidencia están en{" "}
              <Link
                href="/agentes-ia"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                agentes de IA
              </Link>
              . Los servicios, en{" "}
              <Link
                href="/servicios"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                servicios
              </Link>{" "}
              y los precios, en{" "}
              <Link
                href="/planes"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                planes
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Casos */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Clientes y resultados publicados
            </h2>
            <p className="text-slate-600 max-w-2xl mb-12">
              Datos tomados de las plataformas de cada cliente y publicados en
              nuestros casos de éxito.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CASOS.map((c) => (
                <Link
                  key={c.cliente}
                  href="/casos-de-exito"
                  className="block rounded-2xl p-7 ring-1 ring-slate-200 hover:ring-[#4F46E5] transition"
                >
                  <p className="text-sm font-semibold text-[#4F46E5] mb-1">
                    {c.rubro}
                  </p>
                  <h3 className="text-xl font-black mb-3">{c.cliente}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {c.dato}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Cuándo no */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
              Cuándo no somos la mejor opción
            </h2>
            <ul className="space-y-4 text-slate-700 leading-relaxed">
              <li className="bg-white rounded-2xl p-6 ring-1 ring-slate-200">
                <strong>Si buscas solo branding de largo plazo.</strong> Nuestro
                foco es performance: campañas que se miden en leads y ventas.
                Para construir una identidad de marca desde cero conviene una
                agencia creativa o de branding.
              </li>
              <li className="bg-white rounded-2xl p-6 ring-1 ring-slate-200">
                <strong>Si necesitas solo community management.</strong>{" "}
                Incluimos contenido orgánico en todos los planes, pero no
                ofrecemos gestión de comunidad como servicio único.
              </li>
              <li className="bg-white rounded-2xl p-6 ring-1 ring-slate-200">
                <strong>Si el presupuesto de pauta es muy bajo.</strong> Con una
                inversión publicitaria mínima no hay datos suficientes para
                optimizar, y el fee de agencia pesa más que el resultado.
              </li>
            </ul>
          </div>
        </section>

        {/* Dónde verificarnos */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-black mb-4">
              Dónde más puedes verificarnos
            </h2>
            <p className="text-slate-600 mb-6">
              Reseñas en Google, perfil en Clutch y testimonios en video de
              clientes en nuestro canal de YouTube.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://clutch.co/profile/m-ller-y-p-rez-agencia-digital"
                target="_blank"
                rel="noopener"
                className="px-5 py-3 rounded-xl ring-1 ring-slate-200 font-semibold hover:ring-[#4F46E5]"
              >
                Perfil en Clutch
              </a>
              <a
                href="https://www.youtube.com/channel/UCgzocZZQLNnthZ82oEyblrA"
                target="_blank"
                rel="noopener"
                className="px-5 py-3 rounded-xl ring-1 ring-slate-200 font-semibold hover:ring-[#4F46E5]"
              >
                Canal de YouTube
              </a>
              <a
                href="https://www.linkedin.com/company/m%C3%BCller-y-p%C3%A9rez/"
                target="_blank"
                rel="noopener"
                className="px-5 py-3 rounded-xl ring-1 ring-slate-200 font-semibold hover:ring-[#4F46E5]"
              >
                LinkedIn
              </a>
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
                Conversemos sobre tu negocio
              </h2>
              <p className="text-indigo-100/90">
                En la primera reunión revisamos tus campañas y tu embudo, y te
                decimos con franqueza si somos la agencia adecuada.
              </p>
            </div>
            <Link
              href="/#contacto"
              className="text-center px-6 py-3.5 bg-white text-[#1B1740] rounded-xl font-bold hover:bg-indigo-50"
            >
              Agendar una reunión
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
