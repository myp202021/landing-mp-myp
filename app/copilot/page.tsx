import SiteHeader from '@/components/SiteHeader'
import CopilotClient from './CopilotClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'M&P Copilot — 21 Agentes de IA para Marketing Digital | Instagram + LinkedIn | Muller y Pérez',
  description: 'Copilot monitorea tu competencia en Instagram y LinkedIn con 21 agentes de IA interconectados. Genera contenido diferenciado por plataforma, audita tu marca contra la industria, y entrega acciones concretas cada mes. Desde $34.990/mes. 7 días gratis.',
  keywords: [
    'inteligencia competitiva redes sociales chile',
    'monitoreo competencia instagram linkedin chile',
    'agentes ia marketing digital',
    'generador contenido ia instagram linkedin',
    'auditoría redes sociales chile',
    'benchmark competitivo chile',
    'grilla contenido ia',
    'copiloto marketing digital',
    'análisis competencia redes sociales',
    'herramienta marketing ia chile',
    'social media intelligence chile',
    'contenido diferenciado instagram linkedin',
    'reporte ejecutivo marketing digital',
    'predictor roas chile',
    'árbol inversión marketing digital',
    'automatización marketing chile',
    'clipping digital competencia',
    'monitoreo marca chile',
  ],
  alternates: { canonical: 'https://www.mulleryperez.cl/copilot' },
  openGraph: {
    title: 'M&P Copilot — 21 Agentes de IA para Instagram + LinkedIn',
    description: '21 agentes de IA monitorean tu competencia, generan contenido profesional diferenciado por plataforma, y te entregan acciones concretas. Desde $34.990/mes.',
    url: 'https://www.mulleryperez.cl/copilot',
    siteName: 'Muller y Pérez',
    type: 'website',
    locale: 'es_CL',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'M&P Copilot — 21 Agentes de IA para Marketing Digital' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M&P Copilot — 21 Agentes de IA para Marketing Digital',
    description: 'Monitoreo competencia IG + LinkedIn, contenido diferenciado, auditoría vs industria. Desde $34.990/mes.',
    images: ['https://www.mulleryperez.cl/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

// Schema Product — actualizado con 21 agentes, precios reales, sin reviews falsas
var jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'M&P Copilot',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Sistema de 21 agentes de IA interconectados para inteligencia competitiva en Instagram y LinkedIn. Monitoreo de competencia, generación de contenido diferenciado por plataforma, auditoría vs industria, árbol de inversión y reporte ejecutivo con acciones concretas.',
  url: 'https://www.mulleryperez.cl/copilot',
  image: 'https://www.mulleryperez.cl/og-image.jpg',
  author: { '@type': 'Organization', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
  offers: [
    { '@type': 'Offer', name: 'Starter', price: '34990', priceCurrency: 'CLP', availability: 'https://schema.org/InStock', description: '5 cuentas Instagram + LinkedIn, análisis semanal con IA, 4 copies por semana, email semanal, dashboard', priceSpecification: { '@type': 'UnitPriceSpecification', price: '34990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
    { '@type': 'Offer', name: 'Pro', price: '69990', priceCurrency: 'CLP', availability: 'https://schema.org/InStock', description: '15 cuentas IG + LinkedIn, copies diferenciados por plataforma, grilla mensual 8 posts, auditoría mensual, brief estratégico, reporte ejecutivo', priceSpecification: { '@type': 'UnitPriceSpecification', price: '69990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
    { '@type': 'Offer', name: 'Business', price: '119990', priceCurrency: 'CLP', availability: 'https://schema.org/InStock', description: '30 cuentas IG + LinkedIn, grilla 16 posts + guiones video, benchmark competitivo, árbol de inversión con predictor, copies de anuncios Google + Meta', priceSpecification: { '@type': 'UnitPriceSpecification', price: '119990', priceCurrency: 'CLP', unitText: 'mes', valueAddedTaxIncluded: false } },
  ],
  featureList: [
    'Monitoreo competencia Instagram + LinkedIn',
    'Contenido diferenciado por plataforma (IG visual vs LinkedIn B2B)',
    'Auditoría mensual con score separado por red',
    'Benchmark competitivo con cuadro comparativo',
    'Árbol de inversión con 3 escenarios',
    'Reporte ejecutivo con acciones priorizadas',
    'Grilla mensual con calendario',
    'Guiones de video con storyboard',
    'QA Auditor que revisa calidad de entregables',
    'Memoria persistente — aprende de cada run',
    'Copies de anuncios Google y Meta',
    'Score por plataforma (Instagram vs LinkedIn)',
  ],
}

// FAQ actualizado
var faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Qué es M&P Copilot?', acceptedAnswer: { '@type': 'Answer', text: 'M&P Copilot es un sistema de 21 agentes de IA interconectados que monitorea tu competencia en Instagram y LinkedIn, genera contenido profesional diferenciado por plataforma, audita tu marca contra el benchmark de tu industria en Chile, y te entrega un reporte ejecutivo con acciones concretas cada mes. Aprende de tus decisiones y mejora automáticamente.' } },
    { '@type': 'Question', name: '¿Cuánto cuesta M&P Copilot?', acceptedAnswer: { '@type': 'Answer', text: 'Copilot tiene 3 planes: Starter desde $34.990/mes (5 cuentas IG + LinkedIn, análisis semanal), Pro desde $69.990/mes (15 cuentas, copies diferenciados por plataforma, auditoría mensual, reporte ejecutivo), y Business desde $119.990/mes (30 cuentas, grilla 16 posts, benchmark competitivo, árbol de inversión). Todos incluyen 7 días gratis sin tarjeta de crédito.' } },
    { '@type': 'Question', name: '¿Qué diferencia a Copilot de otras herramientas?', acceptedAnswer: { '@type': 'Answer', text: 'Copilot no solo monitorea — genera contenido listo para publicar con copies diferenciados para Instagram (visual, hooks cortos) y LinkedIn (thought leadership, datos). Tiene 21 agentes que se retroalimentan: el brief mejora los copies, la auditoría mejora el brief, el reporte corrige a los demás agentes. Ninguna herramienta en el mercado integra monitoreo + generación + auditoría + predicción en un solo sistema.' } },
    { '@type': 'Question', name: '¿Cómo funciona la diferenciación Instagram vs LinkedIn?', acceptedAnswer: { '@type': 'Answer', text: 'Copilot analiza cada red por separado porque IG y LinkedIn son mundos distintos. Para Instagram genera hooks cortos y visuales. Para LinkedIn genera contenido B2B con datos de industria. La auditoría tiene score separado por red. El reporte muestra acciones específicas para cada plataforma.' } },
    { '@type': 'Question', name: '¿Copilot funciona para mi industria?', acceptedAnswer: { '@type': 'Answer', text: 'Copilot tiene benchmarks de 22 industrias en Chile: maquinaria, inmobiliaria, tecnología, salud, educación, gastronomía, retail, turismo, construcción, transporte, y más. El predictor M&P calcula CPC, CPL y ROAS esperados específicos para tu rubro.' } },
  ],
}

// BreadcrumbList
var breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Muller y Pérez', item: 'https://www.mulleryperez.cl' },
    { '@type': 'ListItem', position: 2, name: 'Copilot', item: 'https://www.mulleryperez.cl/copilot' },
  ],
}

// WebPage con speakable para búsqueda por voz / IA
var webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'M&P Copilot — 21 Agentes de IA para Marketing Digital',
  description: 'Sistema de inteligencia competitiva con 21 agentes de IA para Instagram y LinkedIn. Monitoreo, contenido, auditoría y reporte ejecutivo.',
  url: 'https://www.mulleryperez.cl/copilot',
  isPartOf: { '@type': 'WebSite', url: 'https://www.mulleryperez.cl', name: 'Muller y Pérez' },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.subtitle'],
  },
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'M&P Copilot',
    url: 'https://www.mulleryperez.cl/copilot',
  },
  dateModified: new Date().toISOString().split('T')[0],
  inLanguage: 'es-CL',
}

export default function CopilotPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <SiteHeader />
      <CopilotClient />
    </>
  )
}
