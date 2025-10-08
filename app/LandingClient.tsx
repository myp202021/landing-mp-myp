'use client'

/**
 * M&P Landing Page v3 - Client Component
 * Landing de alta conversión - Performance Marketing con datos reales
 */

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle2,
  XCircle,
  Calendar,
  MessageSquare,
  Cpu,
  Megaphone,
  Palette,
  ChevronDown,
} from 'lucide-react'
import { generateAISearchSchema } from '@/lib/ai-search-optimization'

export default function LandingClient() {
  const aiSearchSchema = generateAISearchSchema()
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    cargo: '',
    enviando: false,
    enviado: false
  })

  const [labsDropdown, setLabsDropdown] = useState(false)
  const [utilidadesDropdown, setUtilidadesDropdown] = useState(false)

  // SEO: Metadata dinámica optimizada

  const problemasAgencias = [
    'Te prometen triplicar ventas sin conocer tu ticket promedio',
    'Hablan de impresiones y likes como si fueran clientes',
    'Te muestran dashboards incompletos o métricas irrelevantes',
    'No ajustan por tu ciclo de venta real',
    'No te dicen qué está haciendo tu competencia'
  ]

  const solucionMP = [
    'Medimos CPL, CPA, CAC, ROAS - Métricas de negocio real',
    'Ajustamos campañas al ciclo real de venta',
    'Benchmark de competencia y mercado incluido',
    'Reportería ejecutiva semanal y mensual',
    'Equipo dedicado de 3 profesionales'
  ]

  const equipoRoles = [
    {
      titulo: 'Paid Media Planner',
      icon: Cpu,
      responsabilidades: [
        'Diseña árboles de decisión de campaña',
        'Maneja presupuesto y distribución de inversión',
        'Hace reportería ejecutiva (semanal y mensual)'
      ]
    },
    {
      titulo: 'Publicista',
      icon: Megaphone,
      responsabilidades: [
        'Construye el relato de la marca',
        'Estudia competencia en redes sociales',
        'Define qué, cómo y cuándo comunicar'
      ]
    },
    {
      titulo: 'Diseñador',
      icon: Palette,
      responsabilidades: [
        'Crea piezas de paid media y contenido orgánico',
        'Media jornada mensual de grabación',
        'Garantiza dinamismo visual'
      ]
    }
  ]

  const metodologia = [
    {
      semana: 'Día 1',
      titulo: 'Plan de Trabajo',
      descripcion: 'Roles claros, entregables definidos, expectativas alineadas.'
    },
    {
      semana: 'Semana 1',
      titulo: 'Benchmark + Setup',
      descripcion: 'Análisis de mercado, competencia y configuración inicial de campañas.'
    },
    {
      semana: 'Semana 2',
      titulo: 'Lanzamiento',
      descripcion: 'Campañas activas, testeo de mensajes y creatividades.'
    },
    {
      semana: 'Semana 3',
      titulo: 'Optimización',
      descripcion: 'Ajustes según ciclo de venta y comparativa con competencia.'
    },
    {
      semana: 'Semana 4',
      titulo: 'Reporte 360°',
      descripcion: 'Visión completa del negocio con métricas ejecutivas.'
    }
  ]

  const reporteData = [
    { plataforma: 'Google Ads', campana: 'Search - Keywords Comerciales', objetivo: 'Lead Gen', cpl: '$18.500', conversiones: 87, cpa: '$34.200', roas: '4.2x' },
    { plataforma: 'Meta Ads', campana: 'Retargeting - Carritos', objetivo: 'Ventas', cpl: '-', conversiones: 142, cpa: '$12.800', roas: '6.8x' },
    { plataforma: 'LinkedIn Ads', campana: 'Prospecting B2B - Gerentes', objetivo: 'Lead Gen', cpl: '$45.300', conversiones: 23, cpa: '$67.900', roas: '2.1x' },
    { plataforma: 'TikTok Ads', campana: 'Awareness - Video UGC', objetivo: 'Engagement', cpl: '$8.200', conversiones: 312, cpa: '$15.400', roas: '3.4x' }
  ]

  const comunicacion = [
    { titulo: 'Semanales', items: ['Reportes de KPIs clave', 'Actualización de campañas activas', 'Ajustes realizados'] },
    { titulo: 'Mensuales', items: ['Informe ejecutivo completo', 'Benchmark vs competencia', 'Plan próximo mes'] },
    { titulo: 'Reuniones', items: ['1 reunión semanal (30 min)', '1 reunión mensual (1 hora)', 'Acceso directo vía WhatsApp'] },
    { titulo: 'WhatsApp', items: ['Respuestas en menos de 2 horas', 'Alertas de cambios importantes', 'Dudas resueltas al instante'] }
  ]

  const diferenciadores = [
    'Transparencia total: Acceso 24/7 a tus cuentas publicitarias',
    'Equipo dedicado de 3 profesionales (no un freelancer compartido)',
    'Reportería ejecutiva con métricas de negocio (no vanity metrics)',
    'Benchmark de competencia incluido en cada reporte',
    'Sin contratos de permanencia: Si no funciona, te vas cuando quieras',
    'Configuración de píxeles, eventos y tracking incluidos',
    'Media jornada mensual de grabación de contenido incluida'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormData(prev => ({ ...prev, enviando: true }))

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          empresa: formData.empresa,
          email: formData.email,
          telefono: formData.telefono,
          solicitud: `Cargo: ${formData.cargo}\n\nSolicitud de reunión desde Landing M&P`,
          destinatario: 'contacto@mulleryperez.com'
        })
      })

      if (response.ok) {
        setFormData(prev => ({ ...prev, enviado: true, enviando: false }))
      } else {
        alert('Error al enviar. Intenta nuevamente.')
        setFormData(prev => ({ ...prev, enviando: false }))
      }
    } catch (error) {
      alert('Error al enviar. Intenta nuevamente.')
      setFormData(prev => ({ ...prev, enviando: false }))
    }
  }

  // SEO: JSON-LD Schemas
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    name: 'Muller y Pérez',
    description: 'Agencia de marketing digital y performance marketing especializada en Google Ads, Meta Ads y estrategias data-driven',
    url: 'https://www.mulleryperez.cl',
    telephone: '+56992258137',
    email: 'contacto@mulleryperez.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Apoquindo 3000, Piso 10',
      addressLocality: 'Las Condes',
      addressRegion: 'Región Metropolitana',
      postalCode: '7550000',
      addressCountry: 'CL'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-33.4169',
      longitude: '-70.6036'
    },
    priceRange: '$$',
    serviceArea: {
      '@type': 'Country',
      name: 'Chile'
    },
    areaServed: 'CL',
    knowsAbout: ['Google Ads', 'Meta Ads', 'Performance Marketing', 'Marketing Digital', 'ROI', 'ROAS', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads', 'TikTok Ads'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de Marketing Digital',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Google Ads Management',
            description: 'Gestión profesional de campañas Google Ads con equipo dedicado'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Meta Ads Management',
            description: 'Gestión de campañas en Facebook e Instagram Ads'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Performance Marketing',
            description: 'Estrategias de marketing basadas en datos y resultados medibles'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'LinkedIn Ads',
            description: 'Campañas B2B en LinkedIn para generación de leads calificados'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'TikTok Ads',
            description: 'Publicidad en TikTok para alcance y engagement'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      ratingCount: '47'
    }
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl',
    logo: 'https://www.mulleryperez.cl/logo-color.png',
    description: 'Agencia de marketing digital y performance marketing con más de 6 años de experiencia en Chile',
    foundingDate: '2019',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Apoquindo 3000, Piso 10',
      addressLocality: 'Las Condes',
      addressRegion: 'Región Metropolitana',
      postalCode: '7550000',
      addressCountry: 'CL'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+56992258137',
      contactType: 'Customer Service',
      email: 'contacto@mulleryperez.com',
      availableLanguage: 'Spanish'
    },
    sameAs: [
      'https://www.linkedin.com/company/mulleryperez',
      'https://www.instagram.com/mulleryperez'
    ]
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cómo miden los resultados en Muller y Pérez?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Medimos CPL (Costo por Lead), CPA (Costo por Adquisición), CAC (Costo de Adquisición de Cliente) y ROAS (Retorno de Inversión Publicitaria) - métricas de negocio real, no vanity metrics como impresiones o likes.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué incluye el equipo dedicado de Muller y Pérez?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cada cliente cuenta con un equipo dedicado de 3 profesionales: un Paid Media Planner para estrategia y reportería, un Publicista para relato de marca y competencia, y un Diseñador para crear piezas visuales y contenido.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cuál es el precio de los servicios de Muller y Pérez?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Los planes comienzan desde $650.000 + IVA mensuales. Contamos con tres planes: Silver, Gold y Platinum, cada uno con diferentes niveles de campañas y servicios incluidos. Actualmente tenemos precios especiales los primeros 6 meses de funcionamiento.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Requieren contrato de permanencia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, en Muller y Pérez no trabajamos con contratos de permanencia. Si no funciona, te vas cuando quieras. Nuestra retención del 95% se basa en resultados, no en obligaciones contractuales.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué plataformas publicitarias manejan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Gestionamos campañas en Google Ads, Meta Ads (Facebook e Instagram), LinkedIn Ads y TikTok Ads. Cada plataforma se selecciona según los objetivos de negocio y el público objetivo del cliente.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué tipo de reportería entregan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Entregamos reportería ejecutiva semanal con KPIs clave y reportes mensuales completos que incluyen métricas de negocio, benchmark de competencia y plan para el próximo mes. También ofrecemos acceso 24/7 a las cuentas publicitarias para total transparencia.'
        }
      }
    ]
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Performance Marketing',
    provider: {
      '@type': 'Organization',
      name: 'Muller y Pérez'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Chile'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Planes de Marketing Digital',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Plan Silver',
          price: '650000',
          priceCurrency: 'CLP',
          description: '2 campañas mensuales, 20 contenidos orgánicos, media jornada grabación/mes'
        },
        {
          '@type': 'Offer',
          name: 'Plan Gold',
          description: '4 campañas mensuales, 28 contenidos orgánicos, email marketing incluido'
        },
        {
          '@type': 'Offer',
          name: 'Plan Platinum',
          description: '6 campañas mensuales, 44 contenidos orgánicos, gestión de influencers'
        }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO: JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* GEO: AI Search Optimization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiSearchSchema) }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50" role="banner">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" aria-label="Ir a inicio">
            <Image
              src="/logo-color.png"
              alt="Muller y Pérez - Agencia de Marketing Digital y Performance en Chile"
              width={140}
              height={45}
              className="h-11 w-auto"
              priority
            />
          </Link>
          <nav className="flex items-center gap-6" role="navigation" aria-label="Navegación principal">
            {/* M&P Labs Dropdown */}
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setLabsDropdown(true)}
              onMouseLeave={() => setLabsDropdown(false)}
            >
              <Link
                href="/labs"
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
                aria-expanded={labsDropdown}
                aria-haspopup="true"
                aria-label="Ir a M&P Labs"
              >
                M&P Labs
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${labsDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
              </Link>
              {labsDropdown && (
                <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/labs/predictor"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Predictor Google Ads</div>
                    <div className="text-xs text-gray-500 mt-0.5">Calcula conversiones y ROAS</div>
                  </Link>
                  <Link
                    href="/labs/buyer-gen"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Buyer Gen</div>
                    <div className="text-xs text-gray-500 mt-0.5">Genera buyer personas</div>
                  </Link>
                  <Link
                    href="/labs/radar-industrias"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Radar Industrias</div>
                    <div className="text-xs text-gray-500 mt-0.5">Madurez digital por sector</div>
                  </Link>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      href="/labs"
                      className="block px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Ver todas las herramientas →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Utilidades Dropdown */}
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setUtilidadesDropdown(true)}
              onMouseLeave={() => setUtilidadesDropdown(false)}
            >
              <Link
                href="/utilidades"
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
                aria-expanded={utilidadesDropdown}
                aria-haspopup="true"
                aria-label="Ir a Utilidades"
              >
                Utilidades
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${utilidadesDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
              </Link>
              {utilidadesDropdown && (
                <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[260px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/utilidades/calculadora-cac"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Calculadora CAC</div>
                    <div className="text-xs text-gray-500 mt-0.5">Costo de adquisición por canal</div>
                  </Link>
                  <Link
                    href="/utilidades/comparador-web"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Comparador Web</div>
                    <div className="text-xs text-gray-500 mt-0.5">Velocidad y Core Web Vitals</div>
                  </Link>
                  <Link
                    href="/utilidades/generador-funnels"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Generador Funnels</div>
                    <div className="text-xs text-gray-500 mt-0.5">Embudos de venta CRM</div>
                  </Link>
                  <Link
                    href="/utilidades/juega-aprende"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Juega y Aprende</div>
                    <div className="text-xs text-gray-500 mt-0.5">Simulador estrategias marketing</div>
                  </Link>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      href="/utilidades"
                      className="block px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Ver todas las utilidades →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="hidden md:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
              aria-label="Ir al blog"
            >
              Blog
            </Link>

            <a
              href="#contacto"
              className="hidden md:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
              aria-label="Ir a sección de contacto"
            >
              Contacto
            </a>
            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 rounded-lg"
              aria-label="Agendar reunión con Muller y Pérez"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Agendar Reunión
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-28 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden" role="main" aria-label="Sección principal">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" aria-hidden="true"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm" role="status" aria-label="Especialización en Performance Marketing">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" aria-hidden="true"></div>
              <span className="text-blue-200 text-sm font-medium">Performance Marketing con Datos Reales</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-10 leading-[1.1] tracking-tight">
              Si tu agencia no te habla<br />
              de negocios,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                no es tu agencia.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100/90 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
              En 2025, los costos de campañas subieron y la efectividad bajó. Si no tienes visibilidad real de tus números,
              <span className="block mt-3 text-white font-semibold">el problema no es el mercado: es cómo están gestionando tu marketing.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2.5 bg-white text-gray-900 hover:bg-blue-50 font-semibold text-base px-8 py-6 rounded-xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:scale-[1.02] transition-all duration-300"
                aria-label="Agendar reunión para conocer servicios de marketing digital"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                Agenda tu reunión con M&P
              </button>

              <a
                href="https://wa.me/56992258137?text=Hola%2C%20quiero%20información%20sobre%20servicios%20M%26P"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
                aria-label="Contactar por WhatsApp para información sobre servicios"
              >
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
                Conversemos
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-24 max-w-6xl mx-auto">
            {[
              { value: '6+', label: 'Años en el mercado' },
              { value: '100%', label: 'Transparencia de datos' },
              { value: '650k', label: 'Desde $650.000/mes' },
              { value: '+200', label: 'Campañas activas' },
              { value: '95%', label: 'Retención de clientes' },
              { value: '4.9★', label: 'Valoración promedio' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm text-blue-200/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problema vs Solución */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50" aria-labelledby="problema-solucion">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 id="problema-solucion" className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              La mayoría de agencias venden humo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              En M&P no trabajamos con humo, <span className="font-semibold text-gray-900">trabajamos con datos</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Problemas */}
            <div className="bg-gradient-to-br from-red-50 to-red-50/50 rounded-2xl p-8 border border-red-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Agencias tradicionales</h3>
              </div>

              <div className="space-y-3">
                {problemasAgencias.map((problema, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white/80 rounded-xl border border-red-100/50 backdrop-blur-sm">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm leading-relaxed">{problema}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solución */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-2xl p-8 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Metodología M&P</h3>
              </div>

              <div className="space-y-3">
                {solucionMP.map((solucion, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white/80 rounded-xl border border-emerald-100/50 backdrop-blur-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm leading-relaxed">{solucion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20 px-6 bg-white" aria-labelledby="equipo-dedicado">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-50 border border-blue-100" role="note">
              <span className="text-blue-700 text-sm font-semibold">TIEMPO CERO - Primera Reunión</span>
            </div>
            <h2 id="equipo-dedicado" className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              Tu equipo dedicado de 3 áreas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A cada cliente se le asignan 3 personas especializadas que estarán 100% enfocadas en hacer crecer tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {equipoRoles.map((rol, idx) => {
              const IconComponent = rol.icon
              return (
                <div key={idx} className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-5">{rol.titulo}</h3>
                  <div className="space-y-3">
                    {rol.responsabilidades.map((resp, ridx) => (
                      <div key={ridx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-sm leading-relaxed">{resp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl shadow-blue-600/30">
              <p className="text-white text-base font-medium">Este equipo dedicado es lo que te permite tener orden, consistencia y resultados que escalan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Metodología */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="metodologia">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 id="metodologia" className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              Metodología ordenada por semanas
            </h2>
            <p className="text-lg text-gray-600">No improvisamos. Cada semana tiene objetivos claros.</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 transform md:-translate-x-1/2"></div>

            <div className="space-y-12">
              {metodologia.map((item, idx) => (
                <div key={idx} className={`relative flex items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Número */}
                  <div className="absolute left-8 md:left-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-4 border-white shadow-xl transform -translate-x-1/2 flex items-center justify-center z-10">
                    <span className="text-white font-bold text-sm">{idx + 1}</span>
                  </div>

                  {/* Contenido */}
                  <div className={`ml-24 md:ml-0 md:w-5/12 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                      <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                        <span className="text-blue-700 text-xs font-semibold">{item.semana}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.titulo}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.descripcion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reporte Ejecutivo */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" aria-labelledby="reporte-ejecutivo">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm" role="note">
              <span className="text-white text-sm font-semibold">REPORTE EJECUTIVO</span>
            </div>
            <h2 id="reporte-ejecutivo" className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
              Esto es lo que ningún cliente de M&P deja de ver
            </h2>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              Este tipo de cuadro es lo que separa el "me gusta tu post" de{' '}
              <span className="text-white font-semibold">saber si realmente estás ganando clientes</span> con tu inversión.
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-400/50">
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="Tabla de métricas de campañas publicitarias">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="px-5 py-4 text-left text-sm font-bold" scope="col">Plataforma</th>
                    <th className="px-5 py-4 text-left text-sm font-bold" scope="col">Campaña</th>
                    <th className="px-5 py-4 text-left text-sm font-bold" scope="col">Objetivo</th>
                    <th className="px-5 py-4 text-right text-sm font-bold" scope="col">CPL</th>
                    <th className="px-5 py-4 text-right text-sm font-bold" scope="col">Conv.</th>
                    <th className="px-5 py-4 text-right text-sm font-bold" scope="col">CPA</th>
                    <th className="px-5 py-4 text-right text-sm font-bold" scope="col">ROAS</th>
                  </tr>
                </thead>
                <tbody className="text-gray-900">
                  {reporteData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-sm">{row.plataforma}</td>
                      <td className="px-5 py-4 text-sm">{row.campana}</td>
                      <td className="px-5 py-4 text-sm">{row.objetivo}</td>
                      <td className="px-5 py-4 text-right text-sm font-medium">{row.cpl}</td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-blue-600">{row.conversiones}</td>
                      <td className="px-5 py-4 text-right text-sm font-medium">{row.cpa}</td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-emerald-600">{row.roas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-blue-200 text-sm max-w-2xl mx-auto">
              <span className="font-semibold text-white">CPL</span> = Costo por Lead |{' '}
              <span className="font-semibold text-white">CPA</span> = Costo por Adquisición |{' '}
              <span className="font-semibold text-white">ROAS</span> = Retorno de Inversión Publicitaria
            </p>
          </div>
        </div>
      </section>

      {/* Comunicación */}
      <section className="py-20 px-6 bg-white" aria-labelledby="comunicacion">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="comunicacion" className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              Comunicación constante y transparente
            </h2>
            <p className="text-lg text-gray-600">Siempre sabrás qué está pasando con tus campañas</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comunicacion.map((canal, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{canal.titulo}</h3>
                <ul className="space-y-2.5">
                  {canal.items.map((item, iidx) => (
                    <li key={iidx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciadores */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="diferenciadores">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="diferenciadores" className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              Por qué elegir M&P
            </h2>
            <p className="text-lg text-gray-600">Claridad, resultados y equipo dedicado</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {diferenciadores.map((diferenciador, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-gray-800 text-sm leading-relaxed font-medium">{diferenciador}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-white" aria-labelledby="planes-precios">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="planes-precios" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Nuestros Planes
            </h2>
            <p className="text-lg text-gray-600">Elige el plan que mejor se adapte a tu negocio</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Plan Silver */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Silver</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Equipo completo M&P</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>2 campañas mensuales</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>20 contenidos orgánicos</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Media jornada grabación/mes</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Gestión de RR.SS.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Reuniones mensuales</span>
                </li>
              </ul>
              <button
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Conocer más
              </button>
            </div>

            {/* Plan Gold - Destacado */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-2xl border-2 border-blue-400 transform md:scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-500 rounded-full shadow-lg">
                <span className="text-white font-bold text-xs">POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 mt-2">Gold</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>Equipo completo M&P</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>4 campañas mensuales</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>28 contenidos orgánicos</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>Media jornada grabación/mes</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>Email marketing (2/mes)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>Reuniones quincenales</span>
                </li>
              </ul>
              <button
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 rounded-lg transition-all duration-300"
              >
                Conocer más
              </button>
            </div>

            {/* Plan Platinum */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Platinum</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Equipo completo M&P</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>6 campañas mensuales</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>44 contenidos orgánicos</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Jornada completa grabación/mes</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Email marketing (4/mes)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Gestión de Influencers</span>
                </li>
              </ul>
              <button
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Conocer más
              </button>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-xl font-bold text-gray-900 mb-2">
              Planes desde $650.000 + IVA mensuales
            </p>
            <p className="text-base text-blue-600 font-semibold mb-4">
              Contamos con precios especiales los primeros 6 meses de funcionamiento
            </p>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              * Todos los planes incluyen diagnóstico inicial, benchmarking y acceso directo al equipo vía WhatsApp
            </p>
            <p className="text-xs text-gray-500 mt-2">
              No incluye inversión publicitaria en plataformas (Google, Meta, LinkedIn, TikTok)
            </p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" aria-labelledby="formulario-contacto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="formulario-contacto" className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
              ¿Listo para trabajar con datos reales?
            </h2>
            <p className="text-lg text-blue-200">
              Agenda una reunión y te mostramos cómo funciona nuestra metodología
            </p>
          </div>

          {formData.enviado ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-2xl">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Mensaje enviado!</h3>
              <p className="text-gray-600 mb-6">Nos contactaremos contigo a la brevedad.</p>
              <a
                href="https://wa.me/56992258137?text=Hola%2C%20quiero%20información%20sobre%20servicios%20M%26P"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                <MessageSquare className="w-5 h-5" />
                O escríbenos por WhatsApp
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6" aria-label="Formulario de contacto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nombre" className="text-gray-900 font-semibold mb-2 block text-sm">
                      Nombre completo <span aria-label="requerido">*</span>
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Juan Pérez"
                      aria-required="true"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label htmlFor="empresa" className="text-gray-900 font-semibold mb-2 block text-sm">
                      Empresa <span aria-label="requerido">*</span>
                    </label>
                    <input
                      id="empresa"
                      name="empresa"
                      type="text"
                      required
                      value={formData.empresa}
                      onChange={(e) => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Mi Empresa SpA"
                      aria-required="true"
                      autoComplete="organization"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="text-gray-900 font-semibold mb-2 block text-sm">
                      Email <span aria-label="requerido">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="juan@empresa.cl"
                      aria-required="true"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="text-gray-900 font-semibold mb-2 block text-sm">
                      Teléfono <span aria-label="requerido">*</span>
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="+56 9 1234 5678"
                      aria-required="true"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cargo" className="text-gray-900 font-semibold mb-2 block text-sm">
                    Cargo <span aria-label="requerido">*</span>
                  </label>
                  <input
                    id="cargo"
                    name="cargo"
                    type="text"
                    required
                    value={formData.cargo}
                    onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Gerente de Marketing"
                    aria-required="true"
                    autoComplete="organization-title"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formData.enviando}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-base py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={formData.enviando ? 'Enviando formulario' : 'Enviar formulario para agendar reunión'}
                >
                  {formData.enviando ? 'Enviando...' : 'Agendar reunión'}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm mb-4">O contáctanos directamente</p>
                <a
                  href="https://wa.me/56992258137?text=Hola%2C%20quiero%20información%20sobre%20servicios%20M%26P"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30"
                >
                  <MessageSquare className="w-5 h-5" />
                  Conversemos
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sección de Videos YouTube */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              📹 Cápsulas de Marketing Digital
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Tips rápidos, estrategias y análisis de campañas reales. Contenido práctico para aplicar hoy.
            </p>
            <a
              href="https://www.youtube.com/channel/UCgzocZZQLNnthZ82oEyblrA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-all hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Ver Canal Completo
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Video 1 - Último */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/UCgzocZZQLNnthZ82oEyblrA?si=example1"
                  title="Video Marketing Digital 1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 font-semibold">Último video</p>
              </div>
            </div>

            {/* Video 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/UCgzocZZQLNnthZ82oEyblrA?si=example2"
                  title="Video Marketing Digital 2"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 font-semibold">Video destacado</p>
              </div>
            </div>

            {/* Video 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/UCgzocZZQLNnthZ82oEyblrA?si=example3"
                  title="Video Marketing Digital 3"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 font-semibold">Video popular</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6" role="contentinfo">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <Image
                src="/logo-blanco.png"
                alt="Muller y Pérez - Agencia de Marketing Digital"
                width={160}
                height={50}
                className="h-12 w-auto mb-4 mx-auto md:mx-0"
              />
              <p className="text-blue-200 text-sm max-w-md mb-6">
                Performance Marketing con datos reales desde 2019
              </p>

              {/* Redes Sociales */}
              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="https://www.linkedin.com/company/muller-y-perez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="LinkedIn M&P"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UCgzocZZQLNnthZ82oEyblrA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="YouTube M&P"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/mktdigital.myp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="Instagram M&P"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@mulleryperez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="TikTok M&P"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>

            <nav className="flex flex-col items-center md:items-end gap-4" aria-label="Contacto footer">
              <a
                href="mailto:contacto@mulleryperez.com"
                className="text-blue-200 hover:text-white transition-colors text-sm font-medium"
                aria-label="Enviar email a contacto@mulleryperez.com"
              >
                contacto@mulleryperez.com
              </a>
              <a
                href="tel:+56992258137"
                className="text-blue-200 hover:text-white transition-colors text-sm font-medium"
                aria-label="Llamar al +56 9 9225 8137"
              >
                +56 9 9225 8137
              </a>
            </nav>
          </div>

          <div className="mt-12 pt-8 border-t border-blue-900/50 text-center">
            <p className="text-blue-300 text-sm">
              © {new Date().getFullYear()} Muller y Pérez. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
