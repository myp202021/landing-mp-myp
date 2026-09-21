import SiteHeader from '@/components/SiteHeader'
import CopilotClient from './CopilotClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consultoría Claude Code — Instalamos tu Sistema Operativo con IA | Muller y Pérez',
  description: 'Sesiones 1:1 para instalar Claude Code como sistema operativo de tu negocio. Agentes automáticos, SEO diario, dashboards, CRM, cotizaciones con IA. Christopher Müller — Ing. Civil Industrial + MBA U. Chile, 20+ años.',
  keywords: [
    'consultoría claude code chile',
    'claude code para empresas',
    'automatización con IA chile',
    'agentes IA negocio',
    'sistema operativo IA',
    'consultoría IA marketing chile',
    'claude code setup',
    'asesoría inteligencia artificial',
  ],
  alternates: { canonical: 'https://www.mulleryperez.cl/copilot' },
  openGraph: {
    title: 'Consultoría Claude Code — Sistema Operativo con IA para tu Negocio',
    description: 'Sesiones 1:1 para instalar Claude Code. Agentes automáticos, SEO diario, dashboards, CRM, cotizaciones con IA. Christopher Müller — 20+ años en tecnología.',
    url: 'https://www.mulleryperez.cl/copilot',
    siteName: 'Muller y Pérez',
    type: 'website',
    locale: 'es_CL',
    images: [{ url: 'https://www.mulleryperez.cl/og-image.jpg', width: 1200, height: 630, alt: 'Consultoría Claude Code — Muller y Pérez' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Consultoría Claude Code — Sistema Operativo con IA',
    description: 'Sesiones 1:1 para instalar Claude Code como sistema operativo de tu negocio. Agentes, SEO, dashboards, CRM, cotizaciones.',
    images: ['https://www.mulleryperez.cl/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

// Schema FAQPage
var faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Necesito saber programar para usar Claude Code?', acceptedAnswer: { '@type': 'Answer', text: 'No. Claude Code programa por ti. Tú describes lo que necesitas en lenguaje natural y Claude Code ejecuta: crea archivos, instala dependencias, conecta APIs, deploya sitios. No necesitas experiencia técnica previa.' } },
    { '@type': 'Question', name: '¿Qué es Claude Code?', acceptedAnswer: { '@type': 'Answer', text: 'Claude Code es la herramienta CLI de Anthropic que lee archivos, ejecuta comandos, conecta APIs y tiene memoria persistente. Es un sistema operativo con IA que puede gestionar repositorios, enviar emails, generar PDFs, publicar contenido y automatizar procesos de negocio.' } },
    { '@type': 'Question', name: '¿En qué se diferencia Claude Code de ChatGPT?', acceptedAnswer: { '@type': 'Answer', text: 'ChatGPT es un chat que genera texto. Claude Code es un sistema operativo que ejecuta acciones reales en tu computador: lee tu disco, crea archivos, conecta APIs, tiene memoria persistente que recuerda tu contexto, y corre agentes en segundo plano que trabajan mientras duermes.' } },
    { '@type': 'Question', name: '¿Cuánto dura cada sesión de consultoría?', acceptedAnswer: { '@type': 'Answer', text: 'Cada sesión dura 90 minutos por videollamada. En el programa Completo son 4 sesiones de 90 minutos cada una. El programa Agencia incluye además una sesión presencial de 4 horas en Santiago.' } },
    { '@type': 'Question', name: '¿Puedo hacer las sesiones de consultoría Claude Code online?', acceptedAnswer: { '@type': 'Answer', text: 'Sí, todas las sesiones son por videollamada. El programa Agencia incluye opción presencial en Santiago para la sesión intensiva con tu equipo.' } },
    { '@type': 'Question', name: '¿Qué resultados puedo esperar de la consultoría?', acceptedAnswer: { '@type': 'Answer', text: 'Desde la primera sesión tendrás un agente funcionando — ya sea un blog diario automatizado, un generador de reportes, o el que elijas según tu negocio. Al terminar el programa Completo tendrás un sistema operativo con IA que gestiona tareas repetitivas de forma autónoma.' } },
    { '@type': 'Question', name: '¿La consultoría Claude Code funciona para cualquier industria?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Tenemos clientes en educación, salud, inmobiliario, energía, legal, retail, logística, tecnología y más. Claude Code se adapta a cualquier negocio que tenga procesos repetitivos que puedan automatizarse.' } },
    { '@type': 'Question', name: '¿La consultoría incluye soporte después de las sesiones?', acceptedAnswer: { '@type': 'Answer', text: 'El programa Completo incluye soporte por WhatsApp entre sesiones. El programa Agencia incluye 1 mes de soporte post-implementación para asegurar que todo funcione correctamente en producción.' } },
  ],
}

// Schema Service
var serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Consultoría Claude Code',
  description: 'Sesiones 1:1 para instalar Claude Code como sistema operativo de tu negocio. Agentes automáticos, SEO diario, dashboards, CRM, cotizaciones con IA.',
  provider: { '@type': 'Organization', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
  url: 'https://www.mulleryperez.cl/copilot',
  areaServed: { '@type': 'Country', name: 'Chile' },
  serviceType: 'Consultoría en Inteligencia Artificial',
  offers: [
    { '@type': 'Offer', name: 'Setup', price: '200000', priceCurrency: 'CLP', description: '1 sesión de 90 minutos. Instalación Claude Code, memoria persistente, hooks, primer agente funcional.' },
    { '@type': 'Offer', name: 'Completo', price: '700000', priceCurrency: 'CLP', description: '4 sesiones 1:1. Agentes diarios, integraciones, cotizaciones/PDFs, Master Agent, soporte WhatsApp.' },
    { '@type': 'Offer', name: 'Agencia', price: '1500000', priceCurrency: 'CLP', description: 'Sesión presencial 4 horas, setup multi-usuario, repos por cliente, dashboard operativo, 1 mes soporte.' },
  ],
}

// Schema Person
var personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Christopher Müller',
  jobTitle: 'Fundador y Director',
  worksFor: { '@type': 'Organization', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Universidad de Chile' },
  ],
  description: 'Ingeniero Civil Industrial y MBA Universidad de Chile. 20+ años en tecnología, marketing digital e IA. Opera una agencia de 33 clientes 100% desde Claude Code.',
  knowsAbout: ['Claude Code', 'Inteligencia Artificial', 'Marketing Digital', 'Automatización', 'Performance Marketing'],
}

// Schema Course
var courseLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Programa de Consultoría Claude Code',
  description: '4 sesiones 1:1 para instalar Claude Code como sistema operativo de tu negocio. Agentes automáticos, integraciones, cotizaciones con IA, Master Agent.',
  provider: { '@type': 'Organization', name: 'Muller y Pérez', url: 'https://www.mulleryperez.cl' },
  instructor: { '@type': 'Person', name: 'Christopher Müller' },
  numberOfCredits: '4',
  educationalCredentialAwarded: 'Sistema operativo con IA implementado',
  courseMode: 'online',
  inLanguage: 'es',
  offers: { '@type': 'Offer', price: '700000', priceCurrency: 'CLP', availability: 'https://schema.org/InStock' },
}

// BreadcrumbList
var breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Muller y Pérez', item: 'https://www.mulleryperez.cl' },
    { '@type': 'ListItem', position: 2, name: 'Consultoría Claude Code', item: 'https://www.mulleryperez.cl/copilot' },
  ],
}

export default function CopilotPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SiteHeader />
      <CopilotClient />
    </>
  )
}
