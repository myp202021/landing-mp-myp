import SiteHeader from "@/components/SiteHeader";
import CopilotClient from "./CopilotClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boost SEO + IA: aparece en Google y en ChatGPT",
  description:
    "Setup SEO + GEO por $490.000 + IVA (H1, H2, schemas, FAQ, indexación, Google Business) y agentes IA por $99.990 + IVA al mes con 8 artículos e informe semanal.",
  keywords: [
    "seo y geo chile",
    "posicionamiento en chatgpt",
    "aparecer en chatgpt empresa",
    "generative engine optimization chile",
    "agentes ia seo",
    "seo con inteligencia artificial chile",
    "auditoría seo geo",
    "blog automatizado con ia",
  ],
  alternates: { canonical: "https://www.mulleryperez.cl/copilot" },
  openGraph: {
    title: "Boost SEO + IA — Que Google y ChatGPT recomienden tu empresa",
    description:
      "Setup SEO + GEO por $490.000 + IVA y agentes IA por $99.990 + IVA al mes: 8 artículos e informe semanal de Google y ChatGPT.",
    url: "https://www.mulleryperez.cl/copilot",
    siteName: "Muller y Pérez",
    type: "website",
    locale: "es_CL",
    images: [
      {
        url: "https://www.mulleryperez.cl/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Boost SEO + IA — Muller y Pérez",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boost SEO + IA — Muller y Pérez",
    description:
      "Setup SEO + GEO por $490.000 + IVA y agentes IA por $99.990 + IVA al mes.",
    images: ["https://www.mulleryperez.cl/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Schema FAQPage
var faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es GEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GEO (Generative Engine Optimization) es lograr que las inteligencias artificiales como ChatGPT, Gemini o Perplexity mencionen y recomienden tu empresa cuando alguien pregunta por tu rubro. Se trabaja con contenido propio, datos estructurados y presencia coherente en directorios y medios.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué incluye el setup de $490.000?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Auditoría SEO + GEO con línea base; H1, H2, títulos, meta descripciones, textos alternativos y enlaces internos; schemas Organization o LocalBusiness, FAQPage, servicios y breadcrumbs; Search Console, Bing Webmaster, sitemap, robots, canonical e IndexNow; Google Business Profile y directorios; y 5 artículos iniciales.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué hacen los agentes por $99.990 al mes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Escriben y publican 8 artículos al mes con control de calidad, envían cada publicación a Google y Bing, hacen ajustes menores y envían cada lunes un informe con las posiciones en Google y las menciones en ChatGPT.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hay permanencia mínima?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, 3 meses para los agentes. El setup es un pago único.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué necesito para empezar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Acceso de administrador a tu sitio. En WordPress funciona directo. Otros sistemas quedan sujetos a una revisión técnica previa y, si el servidor bloquea las cargas, se coordina con tu desarrollador.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito tener campañas pagadas con M&P?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Boost SEO + IA se contrata solo.",
      },
    },
  ],
};

// Schema Service
var serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Boost SEO + IA",
  description:
    "Setup SEO + GEO para aparecer en Google y en las respuestas de ChatGPT, Gemini y Perplexity, más agentes IA que publican 8 artículos al mes y entregan un informe semanal.",
  provider: {
    "@type": "Organization",
    name: "Muller y Pérez",
    url: "https://www.mulleryperez.cl",
  },
  url: "https://www.mulleryperez.cl/copilot",
  areaServed: { "@type": "Country", name: "Chile" },
  serviceType: "SEO y GEO con inteligencia artificial",
  offers: [
    {
      "@type": "Offer",
      name: "Setup SEO + GEO",
      price: "490000",
      priceCurrency: "CLP",
      description:
        "Pago único más IVA. Auditoría SEO + GEO, H1 y H2, schemas, FAQ, indexación, Google Business Profile, directorios y 5 artículos iniciales.",
    },
    {
      "@type": "Offer",
      name: "Agentes IA",
      price: "99990",
      priceCurrency: "CLP",
      description:
        "Mensual más IVA, permanencia mínima 3 meses. 8 artículos al mes, indexación e informe semanal de Google y ChatGPT.",
    },
  ],
};

// BreadcrumbList
var breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Muller y Pérez",
      item: "https://www.mulleryperez.cl",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Boost SEO + IA",
      item: "https://www.mulleryperez.cl/copilot",
    },
  ],
};

export default function CopilotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <SiteHeader />
      <CopilotClient />
    </>
  );
}
