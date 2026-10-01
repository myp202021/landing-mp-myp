"use client";

import React, { useState, useEffect } from "react";

function useScrollReveal() {
  useEffect(function () {
    var els = document.querySelectorAll(".reveal");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach(function (el) {
      observer.observe(el);
    });
    return function () {
      observer.disconnect();
    };
  }, []);
}

/* --- SETUP: QUÉ INCLUYE --- */
var setupItems = [
  {
    title: "Auditoría SEO + GEO inicial",
    text: "Línea base de cómo aparece hoy tu empresa en Google, ChatGPT, Gemini y Perplexity, y qué fuentes citan esas IA sobre tu rubro.",
  },
  {
    title: "H1, H2 y estructura on-page",
    text: "Un H1 por página, H2 ordenados, títulos y meta descripciones, textos alternativos en imágenes y enlaces internos entre tus páginas.",
  },
  {
    title: "Datos estructurados (schemas)",
    text: "Organization o LocalBusiness, FAQPage, servicios o productos y breadcrumbs, para que Google y las IA entiendan quién eres y qué vendes.",
  },
  {
    title: "Indexación",
    text: "Google Search Console, Bing Webmaster, sitemap, robots, canonical, IndexNow y corrección de errores y redirecciones.",
  },
  {
    title: "GEO: visibilidad en IA",
    text: "Google Business Profile, perfiles en directorios y listados, y datos de la empresa coherentes en todas partes, que es lo que leen las IA.",
  },
  {
    title: "Contenido inicial",
    text: "5 artículos base escritos para las búsquedas que importan en tu rubro, con preguntas frecuentes y datos estructurados.",
  },
];

/* --- AGENTES: QUÉ HACEN CADA MES --- */
var agentItems = [
  {
    title: "8 artículos al mes",
    text: "Los agentes escriben y publican en tu sitio artículos sobre las búsquedas de tu rubro, con control de calidad antes de publicar.",
  },
  {
    title: "Informe cada lunes",
    text: "Posiciones en Google y menciones en ChatGPT de tu marca, semana a semana, en tu correo.",
  },
  {
    title: "Indexación de cada publicación",
    text: "Cada artículo nuevo se envía a Google y Bing el mismo día para que aparezca antes.",
  },
  {
    title: "Ajustes menores",
    text: "Correcciones de títulos, metas y enlaces internos según lo que muestran los informes.",
  },
];

/* --- PLANES --- */
var plans = [
  {
    name: "Setup SEO + GEO",
    price: "$490.000",
    period: "+ IVA, pago único",
    desc: "Dejamos tu sitio listo para Google y para las IA en 2 a 3 semanas.",
    features: [
      "Auditoría SEO + GEO con línea base",
      "H1, H2, títulos y meta descripciones",
      "Schemas: Organization, FAQPage, servicios, breadcrumbs",
      "Search Console, Bing, sitemap, IndexNow",
      "Google Business Profile y directorios",
      "5 artículos iniciales",
    ],
    popular: false,
  },
  {
    name: "Agentes IA",
    price: "$99.990",
    period: "+ IVA al mes",
    desc: "Después del setup, los agentes mantienen y hacen crecer tu posicionamiento.",
    features: [
      "8 artículos al mes publicados por agentes",
      "Informe semanal: Google + ChatGPT",
      "Indexación de cada publicación",
      "Ajustes menores según resultados",
      "Permanencia mínima de 3 meses",
    ],
    popular: true,
  },
];

/* --- CASOS (posiciones medidas por M&P en septiembre de 2026) --- */
var cases = [
  {
    client: "Invas WMS",
    result: '#1 y #2 en Google para "mejor WMS Chile"',
    detail:
      "Software de bodegas. Además aparece en las respuestas de las IA consultadas.",
  },
  {
    client: "DevuelveMiPie",
    result: '#1 en Google para "abogado inmobiliario pie Chile"',
    detail:
      "Estudio jurídico. Blog automatizado con agentes desde agosto de 2026.",
  },
  {
    client: "Wiseplan",
    result: '#1 en Google para "outsourcing RRHH vs interno"',
    detail:
      "Consultora de recursos humanos. Agentes de blog y ranking semanal.",
  },
];

/* --- FAQ --- */
var faqs = [
  {
    q: "¿Qué es GEO?",
    a: "GEO (Generative Engine Optimization) es lograr que las inteligencias artificiales como ChatGPT, Gemini o Perplexity mencionen y recomienden tu empresa cuando alguien pregunta por tu rubro. Se trabaja con contenido propio, datos estructurados y presencia coherente en directorios y medios.",
  },
  {
    q: "¿Qué incluye exactamente el setup de $490.000?",
    a: "Auditoría SEO + GEO con línea base; H1, H2, títulos, meta descripciones, textos alternativos y enlaces internos; schemas Organization o LocalBusiness, FAQPage, servicios y breadcrumbs; Search Console, Bing Webmaster, sitemap, robots, canonical e IndexNow; Google Business Profile y directorios; y 5 artículos iniciales.",
  },
  {
    q: "¿Qué hacen los agentes por $99.990 al mes?",
    a: "Escriben y publican 8 artículos al mes en tu sitio con control de calidad, envían cada publicación a Google y Bing, hacen ajustes menores y te mandan cada lunes un informe con tus posiciones en Google y tus menciones en ChatGPT.",
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
    a: "Sí, con IA supervisada. Cada artículo pasa por un control de calidad automático y reglas propias de tu empresa (datos, tono, lo que se puede y no se puede decir) antes de publicarse.",
  },
  {
    q: "¿En cuánto tiempo veo resultados?",
    a: "El setup queda listo en 2 a 3 semanas. Las posiciones en Google y las menciones en IA suelen empezar a moverse entre el primer y el tercer mes, según la competencia de tu rubro. No prometemos posiciones: te mostramos cada semana dónde estás.",
  },
  {
    q: "¿Necesito tener campañas pagadas con M&P?",
    a: "No. Boost SEO + IA se contrata solo. Si además trabajas tus campañas con nosotros, se coordina con tu plan.",
  },
];

var WA_LINK =
  "https://wa.me/56992258137?text=Hola%20Christopher,%20me%20interesa%20Boost%20SEO%20%2B%20IA";

/* --- COMPONENT --- */
export default function CopilotClient() {
  var [faqOpen, setFaqOpen] = useState(-1);
  var [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    sitio: "",
  });
  var [enviando, setEnviando] = useState(false);
  var [enviado, setEnviado] = useState(false);

  useScrollReveal();

  function scrollTo(id: string) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      var res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          solicitud: "Boost SEO + IA\n\nSitio web: " + formData.sitio,
          destinatario: "contacto@mulleryperez.cl",
          fuente: "landing-boost-seo-ia",
        }),
      });
      if (res.ok) {
        setEnviado(true);
      } else {
        alert("Error al enviar. Escríbenos por WhatsApp.");
      }
    } catch {
      alert("Error al enviar. Escríbenos por WhatsApp.");
    }
    setEnviando(false);
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* --- GLOBAL STYLES --- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .revealed { opacity: 1; transform: none; }
        .gradient-text { background: linear-gradient(135deg, #4338CA, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .btn-primary { background: linear-gradient(135deg, #4338CA, #7C3AED); color: white; border: none; padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-block; text-decoration: none; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.35); }
        .btn-secondary { background: white; color: #4338CA; border: 2px solid #E0E7FF; padding: 12px 30px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-block; text-decoration: none; }
        .btn-secondary:hover { border-color: #7C3AED; background: #F5F3FF; }
        .card-hover { transition: all 0.3s; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        .plan-card { border: 2px solid #E5E7EB; border-radius: 20px; padding: 40px 32px; background: white; transition: all 0.3s; }
        .plan-card.popular { border-color: #7C3AED; box-shadow: 0 8px 40px rgba(124,58,237,0.15); position: relative; }
        .input-field { width: 100%; padding: 14px 18px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 15px; font-family: Inter, sans-serif; transition: border-color 0.3s; outline: none; box-sizing: border-box; }
        .input-field:focus { border-color: #7C3AED; }
        @media (max-width: 768px) {
          .feature-grid { grid-template-columns: 1fr !important; }
          .plans-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .hero-h1 { font-size: 34px !important; }
        }
      `,
        }}
      />

      {/* ================================================================= */}
      {/* SECTION 1 — HERO */}
      {/* ================================================================= */}
      <section
        style={{
          background:
            "linear-gradient(180deg, #0F0A2E 0%, #1a1145 50%, #0F0A2E 100%)",
          padding: "120px 24px 80px",
          color: "white",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div
            className="reveal"
            style={{
              display: "inline-block",
              background: "rgba(124,58,237,0.2)",
              border: "1px solid rgba(167,139,250,0.4)",
              color: "#C4B5FD",
              padding: "8px 18px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            Boost SEO + IA
          </div>
          <h1
            className="reveal hero-h1"
            style={{
              fontSize: 48,
              fontWeight: 800,
              lineHeight: 1.1,
              margin: "0 0 24px",
              color: "white",
              maxWidth: 820,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Que Google y ChatGPT{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #A78BFA, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              recomienden tu empresa
            </span>
          </h1>
          <p
            className="reveal"
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 720,
              margin: "0 auto 16px",
              lineHeight: 1.6,
            }}
          >
            Dejamos tu sitio listo para Google y para las inteligencias
            artificiales, y después nuestros agentes publican y miden por ti
            cada semana.
          </p>
          <p
            className="reveal"
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.6)",
              maxWidth: 720,
              margin: "0 auto 36px",
              lineHeight: 1.6,
            }}
          >
            Setup SEO + GEO por{" "}
            <strong style={{ color: "white" }}>$490.000 + IVA</strong>, pago
            único. Agentes por{" "}
            <strong style={{ color: "white" }}>$99.990 + IVA al mes</strong>.
          </p>
          <div
            className="reveal"
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 56,
            }}
          >
            <button
              className="btn-primary"
              onClick={function () {
                scrollTo("contacto");
              }}
            >
              Quiero mi auditoría
            </button>
            <button
              className="btn-secondary"
              onClick={function () {
                scrollTo("precios");
              }}
            >
              Ver qué incluye
            </button>
          </div>
          <div
            className="reveal kpi-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {[
              { num: "27", label: "Agentes IA en producción en M&P" },
              { num: "8", label: "Artículos al mes por cliente" },
              { num: "Lunes", label: "Informe semanal Google + ChatGPT" },
              { num: "2-3 sem", label: "Para dejar listo el setup" },
            ].map(function (kpi, i) {
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    padding: "20px 12px",
                  }}
                >
                  <div
                    style={{ fontSize: 30, fontWeight: 800, color: "white" }}
                  >
                    {kpi.num}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      marginTop: 4,
                    }}
                  >
                    {kpi.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2 — EL PROBLEMA */}
      {/* ================================================================= */}
      <section style={{ padding: "80px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2
            className="reveal"
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#111827",
              margin: "0 0 16px",
            }}
          >
            Tus clientes ya no solo buscan en Google:{" "}
            <span className="gradient-text">le preguntan a la IA</span>
          </h2>
          <p
            className="reveal"
            style={{
              fontSize: 18,
              color: "#6B7280",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Cuando alguien le pide a ChatGPT o a Gemini que le recomiende un
            proveedor de tu rubro, la respuesta sale de lo que esas IA
            encuentran publicado y citado en la web. Si tu sitio no está bien
            estructurado, no publica contenido útil y no aparece en directorios,
            no existes en esa respuesta. Boost SEO + IA trabaja las dos cosas a
            la vez: Google y las IA.
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3 — SETUP */}
      {/* ================================================================= */}
      <section style={{ padding: "80px 24px", background: "#FAFAFA" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              className="reveal"
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 16px",
              }}
            >
              Setup SEO + GEO: qué incluye
            </h2>
            <p
              className="reveal"
              style={{ fontSize: 18, color: "#6B7280", margin: 0 }}
            >
              $490.000 + IVA, pago único. Listo en 2 a 3 semanas.
            </p>
          </div>
          <div
            className="feature-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {setupItems.map(function (item, i) {
              return (
                <div
                  key={i}
                  className="reveal card-hover"
                  style={{
                    background: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: 16,
                    padding: 28,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #4338CA, #7C3AED)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      marginBottom: 16,
                    }}
                  >
                    {i + 1}
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#111827",
                      margin: "0 0 8px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#6B7280",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4 — AGENTES */}
      {/* ================================================================= */}
      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(180deg, #111827 0%, #1E1B4B 100%)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              className="reveal"
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#FFFFFF",
                margin: "0 0 16px",
              }}
            >
              Después, los agentes trabajan cada semana
            </h2>
            <p
              className="reveal"
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.7)",
                margin: 0,
              }}
            >
              $99.990 + IVA al mes. Permanencia mínima de 3 meses.
            </p>
          </div>
          <div
            className="feature-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            {agentItems.map(function (item, i) {
              return (
                <div
                  key={i}
                  className="reveal"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "white",
                      margin: "0 0 8px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 5 — PRECIOS */}
      {/* ================================================================= */}
      <section
        id="precios"
        style={{ padding: "80px 24px", background: "#FAFAFA" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              className="reveal"
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 16px",
              }}
            >
              Precios
            </h2>
            <p
              className="reveal"
              style={{ fontSize: 18, color: "#6B7280", margin: 0 }}
            >
              Un pago único para dejar tu sitio listo y una mensualidad para que
              siga creciendo.
            </p>
          </div>
          <div
            className="plans-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
            }}
          >
            {plans.map(function (plan, i) {
              return (
                <div
                  key={i}
                  className={
                    "reveal plan-card" + (plan.popular ? " popular" : "")
                  }
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: -14,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(135deg, #4338CA, #7C3AED)",
                        color: "white",
                        padding: "6px 16px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Mes a mes, después del setup
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#111827",
                      margin: "0 0 8px",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#9CA3AF",
                      margin: "0 0 20px",
                    }}
                  >
                    {plan.desc}
                  </p>
                  <div style={{ marginBottom: 24 }}>
                    <span
                      style={{
                        fontSize: 38,
                        fontWeight: 800,
                        color: "#111827",
                      }}
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{ fontSize: 15, color: "#9CA3AF", marginLeft: 6 }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 28px",
                    }}
                  >
                    {plan.features.map(function (f, fi) {
                      return (
                        <li
                          key={fi}
                          style={{
                            display: "flex",
                            gap: 10,
                            padding: "8px 0",
                            fontSize: 15,
                            color: "#374151",
                            borderBottom: "1px solid #F3F4F6",
                          }}
                        >
                          <span style={{ color: "#10B981", fontWeight: 800 }}>
                            ✓
                          </span>
                          {f}
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    className={plan.popular ? "btn-primary" : "btn-secondary"}
                    style={{ width: "100%" }}
                    onClick={function () {
                      scrollTo("contacto");
                    }}
                  >
                    Quiero mi auditoría
                  </button>
                </div>
              );
            })}
          </div>
          <div
            className="reveal"
            style={{
              marginTop: 28,
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: 16,
              padding: "20px 24px",
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#92400E",
                margin: "0 0 6px",
              }}
            >
              Requisito técnico
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "#78350F",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Necesitamos acceso de administrador a tu sitio. En WordPress
              funciona directo. Otros sistemas (Shopify, Wix, sitios a medida)
              quedan sujetos a una revisión técnica previa: si el servidor
              bloquea las cargas o no hay forma de publicar, lo coordinamos con
              tu desarrollador antes de partir.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 6 — CÓMO FUNCIONA */}
      {/* ================================================================= */}
      <section style={{ padding: "80px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            className="reveal"
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#111827",
              margin: "0 0 48px",
              textAlign: "center",
            }}
          >
            Cómo funciona
          </h2>
          <div
            className="steps-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            {[
              {
                step: "1",
                title: "Reunión y accesos",
                text: "Definimos contigo las búsquedas que importan y recibimos el acceso de administrador a tu sitio.",
              },
              {
                step: "2",
                title: "Auditoría",
                text: "Medimos tu línea base en Google, ChatGPT, Gemini y Perplexity.",
              },
              {
                step: "3",
                title: "Setup",
                text: "En 2 a 3 semanas dejamos lista la estructura, los schemas, la indexación, tu ficha de Google y los primeros artículos.",
              },
              {
                step: "4",
                title: "Agentes",
                text: "Cada mes publican 8 artículos y cada lunes recibes tu informe.",
              },
            ].map(function (s, i) {
              return (
                <div
                  key={i}
                  className="reveal"
                  style={{ textAlign: "center", padding: 12 }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #4338CA, #7C3AED)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 20,
                      margin: "0 auto 16px",
                    }}
                  >
                    {s.step}
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#111827",
                      margin: "0 0 8px",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#6B7280",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 7 — RESULTADOS */}
      {/* ================================================================= */}
      <section style={{ padding: "80px 24px", background: "#F5F3FF" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              className="reveal"
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 16px",
              }}
            >
              Resultados de clientes con agentes
            </h2>
            <p
              className="reveal"
              style={{ fontSize: 16, color: "#6B7280", margin: 0 }}
            >
              Posiciones medidas por M&amp;P en septiembre de 2026.
            </p>
          </div>
          <div
            className="feature-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {cases.map(function (c, i) {
              return (
                <div
                  key={i}
                  className="reveal card-hover"
                  style={{
                    background: "white",
                    borderRadius: 16,
                    padding: 28,
                    border: "1px solid #E9D5FF",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#7C3AED",
                      marginBottom: 8,
                    }}
                  >
                    {c.client}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#111827",
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {c.result}
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#6B7280",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {c.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 8 — FAQ */}
      {/* ================================================================= */}
      <section style={{ padding: "80px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            className="reveal"
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#111827",
              margin: "0 0 40px",
              textAlign: "center",
            }}
          >
            Preguntas frecuentes
          </h2>
          {faqs.map(function (f, i) {
            var open = faqOpen === i;
            return (
              <div
                key={i}
                className="reveal"
                style={{ borderBottom: "1px solid #E5E7EB" }}
              >
                <button
                  onClick={function () {
                    setFaqOpen(open ? -1 : i);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "20px 0",
                    fontSize: 17,
                    fontWeight: 600,
                    color: "#111827",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <span>{f.q}</span>
                  <span style={{ color: "#7C3AED", fontSize: 22 }}>
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open && (
                  <p
                    style={{
                      fontSize: 16,
                      color: "#6B7280",
                      lineHeight: 1.7,
                      margin: "0 0 20px",
                    }}
                  >
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 9 — CONTACTO */}
      {/* ================================================================= */}
      <section
        id="contacto"
        style={{
          padding: "80px 24px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2
              className="reveal"
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#111827",
                margin: "0 0 16px",
              }}
            >
              Pide tu auditoría
            </h2>
            <p
              className="reveal"
              style={{ fontSize: 18, color: "#6B7280", margin: 0 }}
            >
              Déjanos tu sitio y te contactamos para revisar cómo apareces hoy
              en Google y en las IA.
            </p>
          </div>
          <div
            className="contact-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 2fr",
              gap: 32,
              alignItems: "start",
            }}
          >
            <div
              className="reveal"
              style={{
                background: "white",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #E5E7EB",
              }}
            >
              {enviado ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#111827",
                      margin: "0 0 8px",
                    }}
                  >
                    ¡Recibido!
                  </h3>
                  <p style={{ fontSize: 16, color: "#6B7280", margin: 0 }}>
                    Te contactamos dentro de las próximas 24 horas hábiles.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <input
                    className="input-field"
                    required
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={function (e) {
                      setFormData(
                        Object.assign({}, formData, { nombre: e.target.value }),
                      );
                    }}
                  />
                  <input
                    className="input-field"
                    required
                    type="email"
                    placeholder="Correo"
                    value={formData.email}
                    onChange={function (e) {
                      setFormData(
                        Object.assign({}, formData, { email: e.target.value }),
                      );
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={function (e) {
                      setFormData(
                        Object.assign({}, formData, {
                          telefono: e.target.value,
                        }),
                      );
                    }}
                  />
                  <input
                    className="input-field"
                    required
                    placeholder="Sitio web (ej: www.tuempresa.cl)"
                    value={formData.sitio}
                    onChange={function (e) {
                      setFormData(
                        Object.assign({}, formData, { sitio: e.target.value }),
                      );
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={enviando}
                  >
                    {enviando ? "Enviando..." : "Quiero mi auditoría"}
                  </button>
                </form>
              )}
            </div>
            <div
              className="reveal"
              style={{
                background: "#0F0A2E",
                borderRadius: 20,
                padding: 32,
                color: "white",
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>
                ¿Prefieres conversarlo?
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.6,
                  margin: "0 0 24px",
                }}
              >
                Escríbenos por WhatsApp y te mostramos cómo responde hoy ChatGPT
                cuando alguien pregunta por tu rubro.
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  width: "100%",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
