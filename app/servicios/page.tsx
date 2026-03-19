/**
 * Página Hub: Servicios de Marketing Digital — Muller y Pérez
 * 13 servicios en 4 categorías, SEO impecable, optimizado para Google + IAs
 */

import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createMetadata, createFAQPageSchema, createWebPageSchema } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Servicios de Marketing Digital Chile | Google Ads, Meta Ads, IA, SEO, Dron y Diseño',
  description: 'Servicios de marketing digital en Chile: Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads, SEO, Performance Marketing, Inteligencia Competitiva con IA (M&P Radar), Video con Dron, Diseño Digital y Automatización. Agencia data-driven con equipo dedicado y resultados medibles.',
  keywords: [
    // Servicios core
    'servicios marketing digital chile',
    'agencia marketing digital servicios',
    'servicios agencia performance chile',
    // Paid Media
    'google ads chile', 'agencia google ads chile', 'campañas google ads',
    'meta ads chile', 'agencia meta ads', 'facebook ads chile', 'instagram ads chile',
    'linkedin ads chile', 'agencia linkedin ads', 'publicidad linkedin b2b',
    'tiktok ads chile', 'agencia tiktok ads',
    // SEO & Performance
    'seo chile', 'posicionamiento web chile', 'agencia seo santiago',
    'performance marketing chile', 'marketing basado en datos',
    // IA & Tech
    'inteligencia competitiva ia', 'monitoreo competencia redes sociales',
    'radar competencia chile', 'inteligencia artificial marketing',
    'automatización marketing chile', 'email marketing automatizado',
    // Contenido & Producción
    'diseño digital chile', 'diseño reels instagram', 'motion graphics marketing',
    'video dron chile', 'video marketing dron', 'producción audiovisual marketing',
    'community management chile', 'gestión redes sociales chile',
    // Analítica
    'analítica digital chile', 'atribución marketing', 'dashboard marketing',
    // Genéricos high-intent
    'agencia marketing digital chile', 'mejor agencia marketing digital santiago',
    'contratar agencia marketing digital', 'servicios publicidad digital'
  ],
  path: '/servicios'
})

// ─── Servicios por categoría ────────────────────────────────────
const categories = [
  {
    id: 'paid-media',
    title: 'Campañas Pagadas',
    subtitle: 'Paid Media',
    description: 'Plataformas publicitarias gestionadas por especialistas certificados. Cada peso invertido optimizado para generar leads y ventas reales.',
    services: [
      {
        slug: 'google-ads-chile',
        title: 'Google Ads',
        subtitle: 'Campañas de búsqueda, Shopping, Display y Performance Max',
        description: 'Aparece en los primeros resultados cuando tus clientes buscan tu servicio. Captura demanda activa con campañas estructuradas por intención de búsqueda. Search para leads de alta intención, Shopping para eCommerce, Display para awareness y Performance Max para máximo rendimiento automatizado.',
        icon: '🎯',
        features: [
          { label: 'Tipos de campaña', value: 'Search, Shopping, Display, Performance Max, YouTube' },
          { label: 'Intención', value: 'Alta — usuario busca activamente tu producto o servicio' },
          { label: 'Ideal para', value: 'B2B, servicios profesionales, eCommerce, leads calificados' },
          { label: 'Equipo asignado', value: 'Paid Media Planner certificado + Publicista + Diseñador' }
        ],
        benefits: [
          'Resultados medibles desde la primera semana',
          'Equipo certificado Google Partner',
          'Optimización por conversiones reales, no clics',
          'Árbol de decisión personalizado por campaña',
          'Reportería ejecutiva semanal con CPL y ROAS'
        ]
      },
      {
        slug: 'meta-ads-chile',
        title: 'Meta Ads',
        subtitle: 'Facebook, Instagram, WhatsApp y Messenger Ads',
        description: 'Campañas de alto impacto en las redes sociales donde tu audiencia pasa más tiempo. Segmentación por intereses, comportamiento, lookalike de clientes reales y remarketing automatizado. Formatos de feed, stories, reels y WhatsApp como canal directo de conversión.',
        icon: '📱',
        features: [
          { label: 'Plataformas', value: 'Facebook, Instagram, WhatsApp, Messenger' },
          { label: 'Segmentación', value: 'Intereses, comportamiento, lookalike, remarketing' },
          { label: 'Ideal para', value: 'eCommerce, B2C, generación de leads, awareness' },
          { label: 'Equipo asignado', value: 'Paid Media Planner + Publicista + Diseñador' }
        ],
        benefits: [
          'Targeting preciso por intereses y comportamiento',
          'Contenido visual de alto impacto (reels, carruseles, stories)',
          'Remarketing automatizado sobre visitantes web',
          'WhatsApp como canal directo de conversión',
          'Audiencias lookalike de compradores reales'
        ]
      },
      {
        slug: 'linkedin-ads-chile',
        title: 'LinkedIn Ads',
        subtitle: 'Publicidad B2B segmentada por cargo, industria y empresa',
        description: 'La plataforma más efectiva para llegar a tomadores de decisión en empresas. Segmentación quirúrgica por cargo, industria, tamaño de empresa y antigüedad. Formatos de contenido patrocinado, InMail y formularios nativos con filtros de calificación para leads B2B de alta calidad.',
        icon: '💼',
        features: [
          { label: 'Segmentación', value: 'Cargo, industria, tamaño empresa, seniority, skills' },
          { label: 'Formatos', value: 'Sponsored Content, InMail, Lead Gen Forms, Video' },
          { label: 'Ideal para', value: 'B2B, SaaS, servicios profesionales, reclutamiento' },
          { label: 'Equipo asignado', value: 'Paid Media Planner + Estratega B2B + Diseñador' }
        ],
        benefits: [
          'Llega a gerentes, directores y C-level directamente',
          'Formularios nativos con filtros de calificación',
          'Segmentación por empresa específica (ABM)',
          'Contenido patrocinado que genera autoridad de marca',
          'Integración con CRM para tracking de pipeline'
        ]
      },
      {
        slug: 'instagram-ads-chile',
        title: 'Instagram Ads',
        subtitle: 'Publicidad visual de alto impacto en reels, stories y feed',
        description: 'Campañas optimizadas para la plataforma de mayor engagement en Chile. Reels, stories, feed y Explore con creatividades diseñadas para captar atención y convertir. Shopping integrado para eCommerce y formatos nativos que se sienten orgánicos.',
        icon: '📸',
        features: [
          { label: 'Formatos', value: 'Reels, Stories, Feed, Explore, Shopping' },
          { label: 'Audiencia', value: '18-45 años, alto engagement, tendencias visuales' },
          { label: 'Ideal para', value: 'Moda, lifestyle, gastronomía, eCommerce, servicios' },
          { label: 'Equipo asignado', value: 'Paid Media Planner + Publicista + Diseñador' }
        ],
        benefits: [
          'Creatividades nativas que parecen contenido orgánico',
          'Audiencia altamente comprometida y activa',
          'Shopping integrado para conversión directa',
          'Reels como formato de mayor alcance orgánico + pagado',
          'A/B testing de creatividades continuo'
        ]
      },
      {
        slug: 'tiktok-ads-chile',
        title: 'TikTok Ads',
        subtitle: 'Publicidad en la plataforma de mayor crecimiento en Chile',
        description: 'TikTok no es solo para Gen Z — es la plataforma con el CPM más bajo y mayor viralidad. Campañas In-Feed, TopView y Spark Ads con contenido auténtico que conecta con audiencias nuevas. Ideal para marcas que quieren escalar alcance y generar demanda a bajo costo.',
        icon: '🎵',
        features: [
          { label: 'Formatos', value: 'In-Feed, TopView, Spark Ads, Branded Content' },
          { label: 'Audiencia', value: '18-35 años, alto engagement, contenido auténtico' },
          { label: 'Ideal para', value: 'eCommerce, apps, marcas de consumo, awareness' },
          { label: 'Equipo asignado', value: 'Paid Media Planner + Publicista + Diseñador' }
        ],
        benefits: [
          'CPM más bajo que Meta e Instagram',
          'Potencial de viralidad orgánica + pagada',
          'Spark Ads: impulsa contenido orgánico como anuncio',
          'Audiencia joven y creciente en Chile',
          'Contenido auténtico > producción costosa'
        ]
      }
    ]
  },
  {
    id: 'estrategia-data',
    title: 'Estrategia & Data',
    subtitle: 'Data-Driven Marketing',
    description: 'Decisiones basadas en datos, no en intuición. Estrategia integral, SEO y analítica avanzada para maximizar el retorno de cada peso invertido.',
    services: [
      {
        slug: 'performance-marketing',
        title: 'Performance Marketing',
        subtitle: 'Estrategia integral multicanal basada en datos',
        description: 'Estrategia que combina Google Ads, Meta Ads, LinkedIn, analítica avanzada y optimización continua en un sistema integrado. No gestionamos campañas aisladas — construimos un árbol de decisión donde cada canal cumple un rol específico en el embudo de conversión. Medimos CPL, CAC, ROAS y LTV para asegurar que la inversión genera retorno real.',
        icon: '🚀',
        features: [
          { label: 'Alcance', value: 'Google + Meta + LinkedIn + TikTok + Email' },
          { label: 'Metodología', value: 'Data-driven, test continuo A/B, optimización semanal' },
          { label: 'Ideal para', value: 'Empresas con presupuesto de pauta >$3M CLP/mes' },
          { label: 'Equipo asignado', value: '3+ profesionales dedicados exclusivamente' }
        ],
        benefits: [
          'Estrategia multicanal con atribución cruzada',
          'Árbol de decisión personalizado por campaña',
          'Benchmark de competencia mensual',
          'ROI y ROAS optimizados semanalmente',
          'Dashboard M&P con métricas en tiempo real'
        ]
      },
      {
        slug: 'seo-chile',
        title: 'SEO',
        subtitle: 'Posicionamiento orgánico en Google y plataformas de IA',
        description: 'Posiciona tu sitio en los primeros resultados de Google de forma orgánica y sostenible. SEO técnico, contenido optimizado, link building y SEO local. Además, optimización para plataformas de IA como ChatGPT, Perplexity, Claude y Gemini (AEO — Answer Engine Optimization) para que tu marca aparezca cuando los usuarios preguntan a la inteligencia artificial.',
        icon: '🔍',
        features: [
          { label: 'Servicios', value: 'SEO técnico, On-page, Off-page, Local, AEO (IA)' },
          { label: 'Resultados', value: 'Mediano-largo plazo, sostenibles y acumulativos' },
          { label: 'Ideal para', value: 'Empresas que buscan tráfico orgánico escalable' },
          { label: 'Equipo asignado', value: 'Especialista SEO + Redactor + Analista técnico' }
        ],
        benefits: [
          'Tráfico sostenible sin pagar por cada clic',
          'Optimización para Google + ChatGPT/Perplexity/Claude (AEO)',
          'Mayor autoridad y confianza de marca',
          'ROI creciente mes a mes — efecto bola de nieve',
          'Combinamos SEO + Paid Media para resultados rápidos y duraderos'
        ]
      },
      {
        slug: 'analitica-atribucion',
        title: 'Analítica & Atribución',
        subtitle: 'Dashboards, tracking avanzado y modelos de atribución',
        description: 'Sin datos correctos, toda estrategia es ciega. Implementamos tracking avanzado con Google Analytics 4, Google Tag Manager, Meta Pixel, API de conversiones server-side y modelos de atribución multi-touch. Dashboards personalizados en tiempo real para que veas exactamente qué canal, campaña y anuncio genera cada venta.',
        icon: '📊',
        features: [
          { label: 'Herramientas', value: 'GA4, GTM, Meta CAPI, Looker Studio, BigQuery' },
          { label: 'Tracking', value: 'Server-side, first-party data, cookieless ready' },
          { label: 'Ideal para', value: 'Empresas que quieren entender su funnel completo' },
          { label: 'Equipo asignado', value: 'Analista data + Paid Media Planner' }
        ],
        benefits: [
          'Dashboard personalizado con métricas de negocio real',
          'Tracking server-side (inmune a bloqueadores de cookies)',
          'Modelo de atribución multi-touch — saber qué canal cierra',
          'Integración con CRM para medir hasta la venta final',
          'Reportes ejecutivos automatizados semanales'
        ]
      }
    ]
  },
  {
    id: 'ia-tecnologia',
    title: 'IA & Tecnología',
    subtitle: 'Inteligencia Artificial aplicada al marketing',
    description: 'Desarrollos propios con inteligencia artificial que dan ventaja competitiva real. Monitoreo automatizado de la competencia, automatización de comunicaciones y sistemas que trabajan 24/7.',
    services: [
      {
        slug: 'mp-radar-inteligencia-competitiva',
        title: 'M&P Radar',
        subtitle: 'Inteligencia Competitiva con IA — monitoreo automatizado',
        description: 'Sistema propietario de Muller y Pérez que monitorea automáticamente la actividad digital de tus competidores usando inteligencia artificial. Scraping automatizado de Instagram, LinkedIn y Facebook con reportes diarios que incluyen: posts publicados, engagement, ofertas laborales detectadas, promociones agresivas y alertas ejecutivas. Sabrás qué hace tu competencia antes que ellos sepan qué hiciste tú.',
        icon: '🤖',
        features: [
          { label: 'Redes monitoreadas', value: 'Instagram, LinkedIn, Facebook — automático 24/7' },
          { label: 'Reportes', value: 'Diarios con alertas, KPIs, posts calientes y tendencias' },
          { label: 'Detección IA', value: 'Ofertas laborales, promociones, campañas agresivas' },
          { label: 'Entrega', value: 'Email ejecutivo diario + dashboard histórico' }
        ],
        benefits: [
          'Monitoreo 100% automatizado — sin trabajo manual',
          'Alertas en tiempo real: oferta laboral, promoción, campaña nueva',
          'Reportes ejecutivos diarios con ranking de actividad',
          'Historial de datos para análisis de tendencias',
          'Desarrollo propio M&P — tecnología exclusiva no disponible en otras agencias'
        ]
      },
      {
        slug: 'automatizacion-email-marketing',
        title: 'Automatización & Email Marketing',
        subtitle: 'Flujos automatizados, nurturing y respuestas inteligentes',
        description: 'Automatiza la comunicación con tus leads y clientes. Flujos de email marketing segmentados, respuestas automáticas por WhatsApp y email para leads nuevos, nurturing para leads fríos y secuencias de onboarding. Cada lead recibe el mensaje correcto en el momento correcto, sin intervención manual.',
        icon: '⚡',
        features: [
          { label: 'Canales', value: 'Email, WhatsApp Business, SMS' },
          { label: 'Flujos', value: 'Nurturing, onboarding, recuperación, cross-sell' },
          { label: 'Ideal para', value: 'Empresas con base de leads/clientes >500 contactos' },
          { label: 'Equipo asignado', value: 'Estratega automatización + Publicista + Diseñador' }
        ],
        benefits: [
          'Respuesta automática en <1 minuto a leads nuevos',
          'Nurturing que convierte leads fríos en oportunidades',
          'Segmentación dinámica por comportamiento',
          'Templates profesionales de email y WhatsApp',
          'Métricas de apertura, clic y conversión por flujo'
        ]
      }
    ]
  },
  {
    id: 'contenido-produccion',
    title: 'Contenido & Producción',
    subtitle: 'Creatividad que convierte',
    description: 'Diseño, video y estrategia de contenido que no solo se ve bien — está diseñado para generar resultados medibles en cada plataforma.',
    services: [
      {
        slug: 'diseno-digital',
        title: 'Diseño Digital',
        subtitle: 'Reels, gráficas, carruseles, motion graphics y creatividades para ads',
        description: 'Área de diseño digital especializada en crear contenido visual que convierte. Reels profesionales, gráficas para redes, carruseles informativos, motion graphics para ads y creatividades optimizadas por plataforma. Cada pieza está diseñada con data de performance — no solo estética, sino efectividad comprobada.',
        icon: '🎨',
        features: [
          { label: 'Formatos', value: 'Reels, Stories, Carruseles, Banners, Motion Graphics' },
          { label: 'Plataformas', value: 'Instagram, Facebook, LinkedIn, TikTok, Google Display' },
          { label: 'Ideal para', value: 'Marcas que necesitan contenido visual constante y profesional' },
          { label: 'Equipo asignado', value: 'Diseñador senior + Publicista + Director de arte' }
        ],
        benefits: [
          'Creatividades optimizadas por plataforma (no one-size-fits-all)',
          'A/B testing visual — data decide qué diseño funciona mejor',
          'Motion graphics para anuncios de alto impacto',
          'Reels profesionales con tendencias actuales',
          'Entrega rápida — parrilla mensual planificada'
        ]
      },
      {
        slug: 'video-marketing-dron',
        title: 'Video Marketing con Dron',
        subtitle: 'Producción audiovisual aérea para contenido y publicidad',
        description: 'Producción de video con dron profesional para campañas publicitarias, contenido de redes sociales y material corporativo. Tomas aéreas cinematográficas, recorridos de instalaciones, eventos, proyectos inmobiliarios y productos industriales. El video es el formato de mayor conversión en todas las plataformas — y las tomas con dron elevan la producción a otro nivel.',
        icon: '🎬',
        features: [
          { label: 'Equipo', value: 'Dron profesional 4K + operador certificado DGAC' },
          { label: 'Formatos', value: 'Video corporativo, reels, ads, recorridos aéreos' },
          { label: 'Ideal para', value: 'Inmobiliarias, industria, eventos, turismo, construcción' },
          { label: 'Entrega', value: 'Video editado + versiones para cada red social' }
        ],
        benefits: [
          'Tomas aéreas cinematográficas en 4K',
          'Operador certificado DGAC Chile',
          'Versiones optimizadas para cada plataforma (vertical + horizontal)',
          'Ideal para recorridos de instalaciones, proyectos y eventos',
          'El video con dron aumenta engagement 3-5x vs video estándar'
        ]
      },
      {
        slug: 'estrategia-contenido-community-management',
        title: 'Estrategia de Contenido & Community Management',
        subtitle: 'Parrilla de contenidos, gestión de redes y comunidad',
        description: 'Estrategia integral de contenido orgánico para todas tus redes sociales. Parrilla mensual planificada, publicación en Instagram, Facebook, LinkedIn y TikTok, gestión de comunidad, respuesta a comentarios y mensajes, y análisis de rendimiento. El contenido orgánico es el que construye marca — las campañas pagadas lo escalan.',
        icon: '📝',
        features: [
          { label: 'Redes', value: 'Instagram, Facebook, LinkedIn, TikTok' },
          { label: 'Frecuencia', value: '3-5 publicaciones por semana + stories diarias' },
          { label: 'Ideal para', value: 'Marcas que quieren presencia consistente y profesional' },
          { label: 'Equipo asignado', value: 'Community Manager + Publicista + Diseñador' }
        ],
        benefits: [
          'Parrilla de contenido mensual alineada a objetivos de negocio',
          'Gestión de comunidad: respuesta a comentarios y DMs',
          'Análisis de competencia y tendencias del sector',
          'Contenido orgánico coherente con campañas pagadas',
          'Reportes mensuales de crecimiento y engagement'
        ]
      }
    ]
  }
]

// Todos los servicios flat para schemas
const allServices = categories.flatMap(c => c.services)

// ─── FAQ Schema ─────────────────────────────────────────────────
const faqItems = [
  {
    question: '¿Qué servicios de marketing digital ofrece Muller y Pérez?',
    answer: 'Muller y Pérez ofrece 13 servicios de marketing digital organizados en 4 áreas: Campañas Pagadas (Google Ads, Meta Ads, LinkedIn Ads, Instagram Ads, TikTok Ads), Estrategia & Data (Performance Marketing, SEO, Analítica & Atribución), IA & Tecnología (M&P Radar — Inteligencia Competitiva con IA, Automatización & Email Marketing) y Contenido & Producción (Diseño Digital, Video con Dron, Community Management). Todos los planes incluyen equipo dedicado de 3 profesionales.'
  },
  {
    question: '¿Cuál es la diferencia entre Google Ads y Meta Ads?',
    answer: 'Google Ads captura demanda existente — usuarios que buscan activamente tu producto o servicio. Es ideal para B2B, servicios profesionales y leads de alta intención. Meta Ads (Facebook + Instagram) genera demanda nueva mediante segmentación por intereses, comportamiento y audiencias lookalike. Es ideal para eCommerce, B2C y awareness. Una estrategia completa combina ambas plataformas con un árbol de decisión que maximiza el retorno.'
  },
  {
    question: '¿Qué es M&P Radar y cómo funciona la inteligencia competitiva con IA?',
    answer: 'M&P Radar es un sistema propietario de Muller y Pérez que monitorea automáticamente la actividad digital de tus competidores usando inteligencia artificial. Hace scraping automatizado de Instagram, LinkedIn y Facebook, y envía reportes diarios con: posts publicados, niveles de engagement, ofertas laborales detectadas, promociones agresivas y alertas ejecutivas. Es tecnología exclusiva desarrollada por M&P, no disponible en otras agencias de Chile.'
  },
  {
    question: '¿Qué es Performance Marketing y por qué es diferente?',
    answer: 'Performance Marketing es una metodología que optimiza campañas basándose en resultados medibles de negocio (leads, ventas, ROAS), no en métricas de vanidad como impresiones o alcance. En M&P medimos CPL, CAC y ROAS para asegurar que cada peso invertido genera retorno real. A diferencia de agencias tradicionales, no vendemos "paquetes de posts" — construimos sistemas de generación de clientes medibles.'
  },
  {
    question: '¿Cuánto presupuesto mínimo necesito en publicidad digital?',
    answer: 'Recomendamos un mínimo de $1.500.000 CLP mensuales en pauta publicitaria para Google Ads y/o Meta Ads. Con menos presupuesto, las plataformas no obtienen suficiente data para optimizar las campañas correctamente. El presupuesto óptimo depende de tu industria, competencia y objetivos. En la reunión gratuita de diagnóstico te damos una recomendación personalizada.'
  },
  {
    question: '¿Muller y Pérez hace video con dron para publicidad?',
    answer: 'Sí. Muller y Pérez cuenta con equipo propio de dron profesional 4K y operador certificado DGAC Chile. Producimos tomas aéreas cinematográficas para campañas publicitarias, contenido de redes sociales, recorridos de instalaciones, proyectos inmobiliarios y eventos. Entregamos el video editado con versiones optimizadas para cada plataforma (vertical para reels/stories, horizontal para YouTube/web).'
  },
  {
    question: '¿Qué incluye el servicio de diseño digital de M&P?',
    answer: 'El servicio de Diseño Digital incluye: reels profesionales, gráficas para redes sociales, carruseles informativos, banners para Google Display, motion graphics para anuncios y creatividades optimizadas por plataforma. Cada pieza se diseña con data de performance (A/B testing) para maximizar conversiones, no solo estética. Incluye parrilla mensual planificada.'
  },
  {
    question: '¿Hacen LinkedIn Ads para empresas B2B?',
    answer: 'Sí. LinkedIn Ads es uno de nuestros servicios especializados para empresas B2B, SaaS y servicios profesionales. Ofrecemos segmentación por cargo (gerentes, directores, C-level), industria, tamaño de empresa y antigüedad. Usamos formularios nativos con filtros de calificación para generar leads B2B de alta calidad, no formularios genéricos. También ofrecemos estrategias ABM (Account-Based Marketing) para apuntar a empresas específicas.'
  },
  {
    question: '¿Qué incluye el servicio de SEO de Muller y Pérez?',
    answer: 'Nuestro servicio de SEO incluye: auditoría técnica completa, optimización on-page, estrategia de contenidos, link building, SEO local para Google Maps y AEO (Answer Engine Optimization) para plataformas de IA como ChatGPT, Perplexity, Claude y Gemini. Combinamos SEO con Paid Media para resultados rápidos (paid) y sostenibles (orgánico).'
  },
  {
    question: '¿Cómo funciona la automatización y email marketing?',
    answer: 'Configuramos flujos automatizados de email y WhatsApp Business para: respuesta inmediata a leads nuevos (<1 minuto), nurturing para leads fríos, secuencias de onboarding para clientes nuevos y campañas de cross-sell/upsell. Cada lead recibe el mensaje correcto en el momento correcto, sin intervención manual. Disponible en planes Gold y Platinum.'
  }
]

const faqSchema = createFAQPageSchema(faqItems)

const webPageSchema = createWebPageSchema(
  'Servicios de Marketing Digital Chile | Muller y Pérez',
  'Servicios completos de marketing digital en Chile: Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads, SEO, Performance Marketing, Inteligencia Competitiva con IA, Video con Dron, Diseño Digital y Automatización. Agencia data-driven con equipo dedicado.',
  'https://www.mulleryperez.cl/servicios'
)

// Service schema para cada servicio
const serviceSchemas = allServices.map(s => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: `${s.title} — Muller y Pérez`,
  description: s.description,
  provider: {
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Chile'
  },
  url: `https://www.mulleryperez.cl/servicios#${s.slug}`
}))

export default function ServiciosPage() {
  const whatsappNumber = '+56992258137'
  const whatsappMessage = 'Hola M&P, quiero conocer más sobre sus servicios de marketing digital'
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <>
      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchemas) }} />

    <div className="min-h-screen bg-white">
      {/* Mini Nav */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-color.png"
              alt="Muller y Pérez - Agencia de Marketing Digital Chile"
              width={130}
              height={42}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <Link
              href="/#contacto"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-600/20 rounded-lg transition-all text-sm"
            >
              Agendar Reunión
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-200 text-sm font-medium">13 Servicios · 4 Áreas Especializadas · Equipo Dedicado</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Servicios de Marketing Digital
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mt-2">
                Data-Driven en Chile
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed max-w-4xl mx-auto">
              Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads, SEO, Performance Marketing,
              Inteligencia Competitiva con IA, Video con Dron, Diseño Digital y Automatización.
              <strong className="text-white"> Equipo dedicado de 3 profesionales. Transparencia total. Métricas de negocio real.</strong>
            </p>
          </div>

          {/* Category Quick Nav */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-medium rounded-full transition-all text-sm"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services by Category */}
      {categories.map((category) => (
        <section
          key={category.id}
          id={category.id}
          className="py-16 bg-white border-b border-gray-100 last:border-b-0"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            {/* Category Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">{category.subtitle}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {category.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl">
                {category.description}
              </p>
            </div>

            {/* Services in this category */}
            <div className="space-y-14">
              {category.services.map((service) => (
                <div
                  key={service.slug}
                  id={service.slug}
                  className="scroll-mt-24 border-b border-gray-100 pb-14 last:border-b-0 last:pb-0"
                >
                  <div className="grid md:grid-cols-2 gap-10">
                    {/* Left: Service Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">{service.icon}</span>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{service.title}</h3>
                          <p className="text-sm text-gray-500">{service.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* Features table */}
                      <div className="space-y-3 mb-6">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="text-gray-400 text-sm font-semibold min-w-[130px]">{feature.label}:</span>
                            <span className="text-gray-700 text-sm">{feature.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Benefits + CTA */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Qué incluye:</h4>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-gray-700 mb-4">
                          ¿Quieres saber si <strong>{service.title}</strong> es para tu negocio?
                        </p>
                        <a
                          href={`https://wa.me/56992258137?text=${encodeURIComponent(`Hola M&P, quiero información sobre ${service.title}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                        >
                          Consultar por WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Diferenciadores */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegir a Muller y Pérez?
            </h2>
            <p className="text-lg text-gray-600">
              No somos otra agencia que promete resultados mágicos — somos ingenieros de performance
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Equipo Dedicado</h3>
              <p className="text-gray-600 text-sm">3 profesionales exclusivos: Paid Media Planner, Publicista y Diseñador.</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Transparencia Total</h3>
              <p className="text-gray-600 text-sm">Acceso 24/7 a tus cuentas. Las cuentas son tuyas, nosotros las optimizamos.</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Métricas Reales</h3>
              <p className="text-gray-600 text-sm">CPL, CPA, CAC, ROAS — métricas que mueven el negocio, no vanity metrics.</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tecnología Propia</h3>
              <p className="text-gray-600 text-sm">M&P Radar con IA, dashboards propios, automatización — tecnología que otras agencias no tienen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Preguntas Frecuentes sobre Servicios de Marketing Digital
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Respuestas directas a las dudas más comunes sobre nuestros servicios
          </p>

          <div className="space-y-5">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Link Portfolio */}
      <div className="py-8 bg-slate-900 text-center">
        <a href="/#portfolio" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors text-sm">
          Ver nuestro portfolio de trabajos en +20 industrias →
        </a>
      </div>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿No Estás Seguro Cuál Servicio Necesitas?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Agenda una reunión gratuita de 30 minutos.
              <span className="block mt-2">Analizamos tu caso y te recomendamos la estrategia que más retorno genera para tu negocio.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Conversemos por WhatsApp
              </a>
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
              >
                Agendar Reunión Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
