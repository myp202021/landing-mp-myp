import SiteHeader from "@/components/SiteHeader";
import BoostClient from "./BoostClient";
import { FAQS } from "./faqs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boost SEO + IA: aparece en Google y en ChatGPT",
  description:
    "Setup SEO + GEO por $490.000 + IVA (H1, H2, schemas, FAQ, indexación, Google Business) y agentes IA por $400.000 + IVA al mes con 20 artículos y 4 rankings al mes, medición semanal e informe mensual de Google y ChatGPT.",
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
  alternates: { canonical: "https://www.mulleryperez.cl/boost-seo-ia" },
  openGraph: {
    title: "Boost SEO + IA — Que Google y ChatGPT recomienden tu empresa",
    description:
      "Setup SEO + GEO por $490.000 + IVA y agentes IA por $400.000 + IVA al mes con 20 artículos y 4 rankings al mes, medición semanal e informe mensual de Google y ChatGPT.",
    url: "https://www.mulleryperez.cl/boost-seo-ia",
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
      "Setup SEO + GEO por $490.000 + IVA y agentes IA por $400.000 + IVA al mes.",
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
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// Schema Service
var serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Boost SEO + IA",
  description:
    "Setup SEO + GEO para aparecer en Google y en las respuestas de ChatGPT, Gemini y Perplexity, más agentes IA que publican 20 artículos y 4 rankings al mes, miden cada semana y entregan un informe mensual.",
  provider: {
    "@type": "Organization",
    name: "Muller y Pérez",
    url: "https://www.mulleryperez.cl",
  },
  url: "https://www.mulleryperez.cl/boost-seo-ia",
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
      price: "400000",
      priceCurrency: "CLP",
      description:
        "Mensual más IVA, permanencia mínima 3 meses. 20 artículos y 4 rankings al mes, medición semanal, indexación e informe mensual de Google y ChatGPT.",
    },
  ],
};

// BreadcrumbList

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
      <SiteHeader />
      <BoostClient />
    </>
  );
}
