'use client'

/**
 * M&P Landing Page v3 - Client Component
 * Landing de alta conversión - Performance Marketing con datos reales
 */

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { trackLead, trackWhatsAppClick } from '@/lib/meta-pixel'
import {
  CheckCircle2,
  XCircle,
  Calendar,
  MessageSquare,
  Cpu,
  Megaphone,
  Palette,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  Calculator,
  BarChart3,
  Target,
  ArrowRight,
  Award,
} from 'lucide-react'
import { generateAISearchSchema } from '@/lib/ai-search-optimization'
import YouTubeLite from '@/components/YouTubeLite'
import { ClientLogosGrid } from '@/components/ClientLogos'

export default function LandingClient() {
  const router = useRouter()
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

  const [serviciosDropdown, setServiciosDropdown] = useState(false)
  const [industriasDropdown, setIndustriasDropdown] = useState(false)
  const [recursosDropdown, setRecursosDropdown] = useState(false)
  const [labsDropdown, setLabsDropdown] = useState(false)
  const [utilidadesDropdown, setUtilidadesDropdown] = useState(false)
  const [noticiasDropdown, setNoticiasDropdown] = useState(false)

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
    {
      plataforma: 'Google Search',
      inversion: '$1.609.500',
      leads: 87,
      costoLead: '$18.500',
      ventasNum: 42,
      ventasMonto: '$6.762.000',
      costoCliente: '$38.320',
      proyeccion: '+15%',
      accion: 'incrementar',
      color: 'blue'
    },
    {
      plataforma: 'Google PMax',
      inversion: '$2.124.800',
      leads: 134,
      costoLead: '$15.860',
      ventasNum: 67,
      ventasMonto: '$10.454.000',
      costoCliente: '$31.700',
      proyeccion: '+22%',
      accion: 'incrementar',
      color: 'blue'
    },
    {
      plataforma: 'Google Remarketing',
      inversion: '$892.300',
      leads: 56,
      costoLead: '$15.930',
      ventasNum: 34,
      ventasMonto: '$5.168.000',
      costoCliente: '$26.240',
      proyeccion: '+8%',
      accion: 'modificar',
      color: 'blue'
    },
    {
      plataforma: 'Meta Formularios',
      inversion: '$1.456.200',
      leads: 203,
      costoLead: '$7.170',
      ventasNum: 89,
      ventasMonto: '$13.568.000',
      costoCliente: '$16.360',
      proyeccion: '+18%',
      accion: 'incrementar',
      color: 'purple'
    },
    {
      plataforma: 'Meta WhatsApp',
      inversion: '$1.817.600',
      leads: 312,
      costoLead: '$5.820',
      ventasNum: 142,
      ventasMonto: '$21.624.000',
      costoCliente: '$12.800',
      proyeccion: '+25%',
      accion: 'incrementar',
      color: 'purple'
    },
    {
      plataforma: 'Meta Remarketing',
      inversion: '$1.103.400',
      leads: 178,
      costoLead: '$6.200',
      ventasNum: 98,
      ventasMonto: '$14.896.000',
      costoCliente: '$11.260',
      proyeccion: '+12%',
      accion: 'incrementar',
      color: 'purple'
    },
    {
      plataforma: 'LinkedIn Ads',
      inversion: '$1.041.900',
      leads: 23,
      costoLead: '$45.300',
      ventasNum: 12,
      ventasMonto: '$4.896.000',
      costoCliente: '$86.820',
      proyeccion: '-5%',
      accion: 'pausar',
      color: 'cyan'
    },
    {
      plataforma: 'TikTok Ads',
      inversion: '$2.558.400',
      leads: 312,
      costoLead: '$8.200',
      ventasNum: 124,
      ventasMonto: '$18.848.000',
      costoCliente: '$20.630',
      proyeccion: '+30%',
      accion: 'incrementar',
      color: 'pink'
    }
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
          destinatario: 'contacto@mulleryperez.cl'
        })
      })

      if (response.ok) {
        // Track Lead en Meta Pixel con valor estimado para optimización B2B
        trackLead({
          nombre: formData.nombre,
          empresa: formData.empresa,
          cargo: formData.cargo,
          email: formData.email,
          telefono: formData.telefono,
          servicio: 'performance-marketing',
          fuente: 'landing-principal'
        })
        router.push('/gracias')
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
    email: 'contacto@mulleryperez.cl',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Badajoz 100, Of 523',
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
      streetAddress: 'Badajoz 100, Of 523',
      addressLocality: 'Las Condes',
      addressRegion: 'Región Metropolitana',
      postalCode: '7550000',
      addressCountry: 'CL'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+56992258137',
      contactType: 'Customer Service',
      email: 'contacto@mulleryperez.cl',
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
      },
      {
        '@type': 'Question',
        name: '¿Qué es una agencia de performance marketing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Una agencia de performance marketing es aquella que cobra y optimiza basándose en resultados medibles como conversiones, ventas o leads. En M&P trabajamos con modelo de performance, donde tu inversión está directamente ligada a resultados reales de negocio, no a métricas de vanidad.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cuánto cuesta una agencia de marketing digital en Chile en 2025?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Los costos de una agencia de marketing digital en Chile varían desde $650.000/mes hasta $1.5M+/mes dependiendo del alcance y nivel de servicio. En M&P ofrecemos planes Silver ($650k), Gold ($980k) y Platinum ($1.5M+), todos con equipo dedicado de 3 profesionales y reportería semanal incluida.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Qué es marketing basado en datos o data-driven marketing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El marketing basado en datos (data-driven marketing) usa información real de comportamiento de usuarios para tomar decisiones estratégicas. En lugar de confiar en intuición o métricas como "me gusta" o "impresiones", nos enfocamos en CPL, CPA, CAC y ROAS para optimizar cada peso invertido en publicidad digital.'
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
          description: '2 campañas mensuales, 20 contenidos orgánicos en todas las redes, media jornada grabación/mes'
        },
        {
          '@type': 'Offer',
          name: 'Plan Gold',
          description: '4 campañas mensuales, 30 contenidos orgánicos en todas las redes, email marketing incluido'
        },
        {
          '@type': 'Offer',
          name: 'Plan Platinum',
          description: '6 campañas mensuales, 45 contenidos orgánicos en todas las redes, gestión de influencers'
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
          <nav className="flex items-center gap-5" role="navigation" aria-label="Navegación principal">
            {/* Planes */}
            <button
              onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
            >
              Planes
            </button>

            {/* Casos de Éxito */}
            <button
              onClick={() => document.getElementById('casos-exito')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
            >
              Casos de Éxito
            </button>

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
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors bg-gradient-to-r from-indigo-50/30 to-transparent"
                  >
                    <div className="font-semibold flex items-center gap-2">
                      Predictor + Diagnóstico
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">NUEVO</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Google vs Meta vs LinkedIn</div>
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

            {/* Noticias Dropdown (Blog + Cápsulas) */}
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setNoticiasDropdown(true)}
              onMouseLeave={() => setNoticiasDropdown(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
                aria-expanded={noticiasDropdown}
                aria-haspopup="true"
                aria-label="Noticias"
              >
                Noticias
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${noticiasDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {noticiasDropdown && (
                <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/blog"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Blog</div>
                    <div className="text-xs text-gray-500 mt-0.5">Artículos y guías completas</div>
                  </Link>
                  <a
                    href="#capsulas-youtube"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('capsulas-youtube')?.scrollIntoView({ behavior: 'smooth' })
                      setNoticiasDropdown(false)
                    }}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold">Cápsulas YouTube</div>
                    <div className="text-xs text-gray-500 mt-0.5">Videos cortos y prácticos</div>
                  </a>
                  <Link
                    href="/benchmarks"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Benchmarks 2025</div>
                    <div className="text-xs text-gray-500 mt-0.5">Datos de industria Chile</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Servicios Mega Dropdown */}
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setServiciosDropdown(true)}
              onMouseLeave={() => setServiciosDropdown(false)}
            >
              <Link
                href="/servicios"
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
                aria-expanded={serviciosDropdown}
                aria-haspopup="true"
                aria-label="Ver servicios"
              >
                Servicios
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${serviciosDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
              </Link>
              {serviciosDropdown && (
                <div className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 min-w-[720px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Columna Servicios */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Servicios</h3>
                      <div className="space-y-1">
                        <Link href="/servicios/google-ads-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Google Ads Chile</Link>
                        <Link href="/servicios/meta-ads-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Meta Ads Chile</Link>
                        <Link href="/servicios/performance-marketing" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Performance Marketing</Link>
                        <Link href="/servicios/seo-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">SEO Chile</Link>
                        <div className="pt-2 border-t border-gray-100 mt-2">
                          <Link href="/servicios" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">Ver todos →</Link>
                        </div>
                      </div>
                    </div>
                    {/* Columna Industrias */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Por Industria</h3>
                      <div className="space-y-1">
                        <Link href="/marketing-digital-ecommerce-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Ecommerce</Link>
                        <Link href="/marketing-digital-b2b-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">B2B / Empresas</Link>
                        <Link href="/marketing-digital-saas-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">SaaS / Software</Link>
                        <Link href="/marketing-digital-fintech-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Fintech</Link>
                        <Link href="/marketing-digital-servicios-profesionales-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Servicios Profesionales</Link>
                        <Link href="/marketing-digital-inmobiliario-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Inmobiliario</Link>
                        <Link href="/marketing-digital-salud-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Salud / Clínicas</Link>
                        <div className="pt-2 border-t border-gray-100 mt-2">
                          <Link href="/industrias" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">Ver todas →</Link>
                        </div>
                      </div>
                    </div>
                    {/* Columna Recursos */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recursos</h3>
                      <div className="space-y-1">
                        <Link href="/ranking-agencias-marketing-digital-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Ranking Agencias</Link>
                        <Link href="/precios-agencia-marketing-digital-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Precios Agencias</Link>
                        <Link href="/google-ads-vs-meta-ads-chile" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Google vs Meta Ads</Link>
                        <Link href="/agencia-marketing-digital-vs-inhouse" className="block py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">Agencia vs In-House</Link>
                        <div className="pt-2 border-t border-gray-100 mt-2">
                          <Link href="/recursos" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">Ver todos →</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/crm/login"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 rounded-lg text-sm"
              aria-label="Acceso clientes"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Acceso Clientes
            </Link>

            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 rounded-lg text-sm"
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

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-[1.1] tracking-tight text-white">
              LA AGENCIA QUE VINCULA<br />Y COORDINA MARKETING<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                CON COMERCIAL
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-6 font-medium">
              Agencia de marketing digital y performance que convierte tu inversión en clientes reales
            </p>

            <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
              El primer paso es tener un número: <span className="text-white font-bold">el costo de adquisición por tipo de campaña.</span>
              <br />Con ese dato puedes proyectar ventas y corregir errores.
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
                onClick={() => trackWhatsAppClick({ page: 'hero', servicio: 'general' })}
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

      {/* La Verdad Sobre Promesas */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              La Verdad Sobre{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Duplicar o Triplicar Ventas
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra metodología es ingeniería, no magia. Seamos claros sobre cuándo sí y cuándo no.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Cuándo SÍ es posible */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">Cuándo SÍ es posible duplicar o triplicar</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Tienes presupuesto pequeño y puedes escalarlo x3</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Tu margen de contribución permite subir inversión publicitaria</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Hay demanda no saturada en el mercado</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Tu producto/servicio tiene capacidad de escalar</span>
                </li>
              </ul>
            </div>

            {/* Cuándo NO es posible */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900">Cuándo NO es posible</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Mercado saturado con mucha competencia</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Ya estás gastando mucho y cerca del punto de saturación</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Tu margen no soporta más inversión publicitaria</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Limitaciones operativas para crecer rápido</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200 text-center">
            <p className="text-lg text-gray-800 font-medium">
              <span className="text-blue-600 font-bold">En M&P no hacemos promesas vacías.</span>
              {' '}Te decimos la verdad desde el día 1: qué esperar, cuándo esperarlo, y con qué números vamos a medir el éxito.
            </p>
          </div>
        </div>
      </section>

      {/* Para el Dueño/CEO */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Target className="w-4 h-4" />
                Para el Dueño / CEO
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                ¿Cuánto te cuesta{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  conseguir un cliente?
                </span>
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Si no tienes ese número, estás invirtiendo a ciegas.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-bold">Proyección de ventas confiable:</span> Con CAC definido puedes proyectar cuántos clientes obtendrás con X presupuesto
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-bold">ROI predecible:</span> Sabes cuánto invertir para crecer de forma sostenible
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-bold">Decisiones basadas en datos:</span> No en corazonadas o "feeling"
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
              <div className="text-sm text-gray-500 mb-4 font-mono">Dashboard Comercial M&P</div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <div className="text-sm text-gray-600">CAC Promedio</div>
                  <div className="text-3xl font-bold text-gray-900">$47.200</div>
                  <div className="text-sm text-green-600">↓ 18% vs mes anterior</div>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <div className="text-sm text-gray-600">ROAS (Return on Ad Spend)</div>
                  <div className="text-3xl font-bold text-gray-900">4.2x</div>
                  <div className="text-sm text-green-600">↑ +0.8x vs mes anterior</div>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <div className="text-sm text-gray-600">Clientes Proyectados (próximo mes)</div>
                  <div className="text-3xl font-bold text-gray-900">127</div>
                  <div className="text-sm text-gray-600">Con presupuesto actual</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para el Gerente Comercial */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="text-sm text-gray-700 font-bold mb-6">Tabla CAC por Tipo de Campaña</div>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 text-sm font-bold text-gray-700">Tipo de Campaña</th>
                    <th className="text-right py-3 text-sm font-bold text-gray-700">CAC</th>
                    <th className="text-right py-3 text-sm font-bold text-gray-700">Conv. %</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-700">Google Search - Marca</td>
                    <td className="text-right font-mono font-bold text-green-600">$28.400</td>
                    <td className="text-right font-mono text-gray-700">8.2%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-700">Google Search - Genérico</td>
                    <td className="text-right font-mono font-bold text-blue-600">$52.100</td>
                    <td className="text-right font-mono text-gray-700">4.1%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-700">Meta - Retargeting</td>
                    <td className="text-right font-mono font-bold text-green-600">$31.800</td>
                    <td className="text-right font-mono text-gray-700">6.5%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-700">Meta - Prospecting</td>
                    <td className="text-right font-mono font-bold text-orange-600">$89.200</td>
                    <td className="text-right font-mono text-gray-700">2.3%</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 pt-6 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">CAC Ponderado</span>
                  <span className="text-2xl font-bold text-blue-600">$47.200</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Calculator className="w-4 h-4" />
                Para el Gerente Comercial
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Con estas tablas{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  proyectas ventas
                </span>
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Sabes exactamente cuántos leads necesitas para cerrar X ventas, y cuánto cuesta generarlos.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-bold">Proyección de pipeline:</span> "Si invierto $5M en Google Search, obtengo ~96 leads, cierro ~24 ventas"
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-bold">Optimización de presupuesto:</span> Asignas más a canales con mejor CAC
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-bold">Corrección rápida:</span> Si CAC sube, detectas el problema en días, no en meses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para el Gerente de Marketing */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <TrendingUp className="w-4 h-4" />
              Para el Gerente de Marketing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              No trabajas con un{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                freelancer
              </span>
              <br />
              Trabajas con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">3 áreas especializadas</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada cliente tiene 3 profesionales asignados, uno de cada área
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {equipoRoles.map((rol, idx) => {
              const IconComponent = rol.icon
              return (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{rol.titulo}</h3>
                  <ul className="space-y-3">
                    {rol.responsabilidades.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Metodología de Ingeniería</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Árbol de decisión de campaña</div>
                      <div className="text-sm text-gray-600">Qué hacer en cada escenario</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Benchmark de competencia</div>
                      <div className="text-sm text-gray-600">Qué está haciendo el mercado</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Dashboard comercial integrado</div>
                      <div className="text-sm text-gray-600">CAC, CPA, ROAS en tiempo real</div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600 mb-2">Tu equipo asignado</div>
                  <div className="text-5xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600 mt-1">profesionales</div>
                </div>
                <div className="text-center pt-4 border-t border-gray-300">
                  <div className="text-sm text-gray-600 mb-2">Equipo completo M&P</div>
                  <div className="text-4xl font-bold text-purple-600">+20</div>
                  <div className="text-sm text-gray-600 mt-1">especialistas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por eso vinculamos las 3 áreas */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg shadow-blue-600/30">
              <Users className="w-5 h-5" />
              La Diferencia M&P
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Por eso{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                vinculamos las 3 áreas
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto font-medium">
              CRM único + Métricas compartidas = <span className="text-blue-600 font-bold">Decisiones alineadas</span>
            </p>
          </div>

          {/* 3 Columnas - Qué ve cada stakeholder */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Dueño/CEO */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/40">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-6">Para el Dueño / CEO</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900">ROI consolidado</div>
                    <div className="text-sm text-gray-600">Por canal y campaña</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900">Proyección de ventas</div>
                    <div className="text-sm text-gray-600">Basada en CAC real</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900">CAC promedio ponderado</div>
                    <div className="text-sm text-gray-600">Todos los canales</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Gerente Comercial */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-600/40">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800 mb-6">Para el Gerente Comercial</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900">Pipeline en tiempo real</div>
                    <div className="text-sm text-gray-600">Leads por etapa</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900">Conversión por fuente</div>
                    <div className="text-sm text-gray-600">Google, Meta, Orgánico</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900">Proyección de cierre</div>
                    <div className="text-sm text-gray-600">Por tipo de lead</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Gerente Marketing */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/40">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800 mb-6">Para el Gerente de Marketing</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900">Performance por campaña</div>
                    <div className="text-sm text-gray-600">CPL, CPA, ROAS</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900">Benchmarks vs competencia</div>
                    <div className="text-sm text-gray-600">Industria y región</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900">Optimización sugerida</div>
                    <div className="text-sm text-gray-600">Basada en datos</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* CRM Integration Visual */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-10 md:p-16 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
                  <BarChart3 className="w-4 h-4" />
                  CRM Integrado
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                  Todos mirando el{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    mismo dashboard
                  </span>
                </h3>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Todos hablando el mismo idioma: <span className="font-bold text-white">números.</span>
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-blue-100"><span className="font-bold text-white">Sincronización automática:</span> Marketing registra lead → Comercial lo ve al instante → CEO ve el costo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-blue-100"><span className="font-bold text-white">Métricas unificadas:</span> CAC, ROAS, LTV calculados en tiempo real para todos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-blue-100"><span className="font-bold text-white">Decisiones alineadas:</span> Cuando todos ven los mismos números, se acabaron los conflictos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-2xl">
                <div className="text-sm text-cyan-300 font-mono mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Dashboard M&P - Vista en tiempo real
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-xl p-5 border-2 border-emerald-400/50 hover:scale-105 transition-transform">
                    <div className="flex flex-col">
                      <span className="text-emerald-200 text-xs font-medium mb-2">COSTO POR LEAD</span>
                      <span className="text-white font-black text-3xl">$12.400</span>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingDown className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300 text-xs font-bold">-18% vs mes anterior</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl p-5 border-2 border-blue-400/50 hover:scale-105 transition-transform">
                    <div className="flex flex-col">
                      <span className="text-blue-200 text-xs font-medium mb-2">COSTO POR CLIENTE</span>
                      <span className="text-white font-black text-3xl">$89.500</span>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingDown className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-300 text-xs font-bold">-12% optimizado</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl p-5 border-2 border-purple-400/50 hover:scale-105 transition-transform">
                    <div className="flex flex-col">
                      <span className="text-purple-200 text-xs font-medium mb-2">PROYECCIÓN VENTAS</span>
                      <span className="text-white font-black text-3xl">$14.8M</span>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3 text-purple-400" />
                        <span className="text-purple-300 text-xs font-bold">Este mes</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/10 rounded-xl p-5 border-2 border-orange-400/50 hover:scale-105 transition-transform">
                    <div className="flex flex-col">
                      <span className="text-orange-200 text-xs font-medium mb-2">MARGEN BRUTO</span>
                      <span className="text-white font-black text-3xl">42%</span>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3 text-orange-400" />
                        <span className="text-orange-300 text-xs font-bold">Sobre ventas</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <p className="text-xs text-blue-200 leading-relaxed">
                    <span className="font-bold text-white">💡 Explicación:</span> Con estos 4 números puedes tomar decisiones informadas.
                    El costo por lead te dice cuánto pagas por contacto, el costo por cliente cuánto inviertes en cada venta cerrada.
                    La proyección de ventas te muestra hacia dónde vas este mes, y el margen bruto te confirma si el negocio es rentable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-white rounded-2xl px-10 py-6 shadow-2xl border-2 border-blue-200">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Esto es <span className="text-blue-600">vincular Marketing con Comercial.</span>
              </p>
              <p className="text-gray-600">
                No promesas. Datos. Transparencia. Alineación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team M&P - Christopher Müller */}
      <section id="nosotros" className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              M&P = <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Marketing & Performance</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              20+ años de experiencia en empresas que viven de números, no de likes
            </p>
          </div>

          {/* Christopher Müller Profile */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 mb-12">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h3 className="text-4xl font-bold mb-4">Christopher Müller</h3>
                <p className="text-cyan-300 text-xl mb-8 font-medium">
                  Fundador y Director de Estrategia
                </p>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <Award className="w-7 h-7 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-white text-lg">Ingeniero Civil Industrial, Universidad de Chile</div>
                      <div className="text-blue-200">MBA + Experto en Marketing Digital y Herramientas de IA</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Award className="w-7 h-7 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-white text-lg">Ex Cencosud, Transbank, Banco Internacional y Hibu</div>
                      <div className="text-blue-200">Hibu (empresa inglesa líder en marketing digital)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Award className="w-7 h-7 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-white text-lg">+20 años de experiencia</div>
                      <div className="text-blue-200">Marketing con foco en performance, ROI y metodología de ingeniería</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-600/30 to-blue-700/30 backdrop-blur-sm rounded-2xl p-5 border-2 border-blue-400/50 shadow-xl">
                  <div className="text-4xl font-black text-white mb-2">3</div>
                  <div className="text-lg font-bold text-white mb-1">Áreas especializadas</div>
                  <div className="text-blue-100 text-sm">Paid Media, Publicista, Diseñador</div>
                </div>

                <div className="bg-gradient-to-br from-cyan-600/30 to-cyan-700/30 backdrop-blur-sm rounded-2xl p-5 border-2 border-cyan-400/50 shadow-xl">
                  <div className="text-4xl font-black text-white mb-2">+20</div>
                  <div className="text-lg font-bold text-white mb-1">Profesionales en equipo</div>
                  <div className="text-cyan-100 text-sm">Cada cliente recibe 3 asignados (uno por área)</div>
                </div>

                <div className="bg-gradient-to-br from-purple-600/30 to-purple-700/30 backdrop-blur-sm rounded-2xl p-5 border-2 border-purple-400/50 shadow-xl">
                  <div className="text-4xl font-black text-white mb-2">6+</div>
                  <div className="text-lg font-bold text-white mb-1">Años en el mercado</div>
                  <div className="text-purple-100 text-sm">Gestionando +$800M en inversión publicitaria</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fair Play & Orden */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fair Play &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Orden
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Así trabajamos contigo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Todo Tiene Orden</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Reuniones semanales o quincenales según el plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Grupo de WhatsApp para consultas rápidas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Acceso a CRM para ver el estado de tus leads en tiempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span>Reportes ejecutivos semanales y mensuales automáticos</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border-2 border-green-200">
              <div className="text-3xl mb-4">⚖️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fair Play en Cobros</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span><span className="font-bold">Trabajos adicionales fuera del plan:</span> Se cobran aparte</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Ej: Diseñar menú para restaurant, folleto para evento, video institucional</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Siempre avisamos antes de hacer trabajos extra</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>Presupuestos claros y anticipados</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 text-center">
            <p className="text-lg text-gray-800">
              <span className="font-bold text-blue-600">Transparencia total.</span> Sabes qué estás pagando, qué incluye, y qué queda fuera.
            </p>
          </div>
        </div>
      </section>

      {/* Herramientas Gratuitas */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
              <span className="text-blue-700 text-sm font-semibold">HERRAMIENTAS GRATUITAS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              Herramientas profesionales{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">100% gratis</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Potencia tu estrategia de marketing con nuestras herramientas basadas en datos reales de +500 campañas en Chile
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* M&P Intelligence */}
            <Link
              href="/labs/mp-intelligence"
              className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">M&P Intelligence</h3>
              <p className="text-sm text-gray-600 mb-3">
                Benchmarks en tiempo real de Google Ads, Meta Ads y LinkedIn. Compara tu performance con la industria.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
                <span className="px-2 py-1 bg-blue-50 rounded-full">Data Real</span>
                <span className="px-2 py-1 bg-purple-50 rounded-full">15 Industrias</span>
              </div>
            </Link>

            {/* Buyer Gen */}
            <Link
              href="/labs/buyer-gen"
              className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Buyer Gen</h3>
              <p className="text-sm text-gray-600 mb-3">
                Genera buyer personas completas con IA en 4 pasos. Incluye estrategia de contenido y KPIs validados.
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-600 font-semibold">
                <span className="px-2 py-1 bg-purple-50 rounded-full">IA Generativa</span>
                <span className="px-2 py-1 bg-pink-50 rounded-full">12+ Segmentos</span>
              </div>
            </Link>

            {/* Predictor Marketing Digital v2 - DESTACADO */}
            <Link
              href="/labs/predictor"
              className="group bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-300 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full">
                NUEVO v2
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Predictor + Diagnóstico</h3>
              <p className="text-sm text-gray-600 mb-3">
                Analiza tu negocio y descubre si Google, Meta o LinkedIn es mejor para ti. Proyección de ROAS y alertas de viabilidad.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-600 font-semibold">
                <span className="px-2 py-1 bg-indigo-100 rounded-full">12 Industrias</span>
                <span className="px-2 py-1 bg-purple-100 rounded-full">Diagnóstico</span>
                <span className="px-2 py-1 bg-emerald-100 rounded-full">Gratis</span>
              </div>
            </Link>

            {/* Calculadora CAC */}
            <Link
              href="/utilidades/calculadora-cac"
              className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Calculadora CAC</h3>
              <p className="text-sm text-gray-600 mb-3">
                Calcula el costo de adquisición de cliente y compara entre Google Ads, Meta y LinkedIn.
              </p>
              <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold">
                <span className="px-2 py-1 bg-orange-50 rounded-full">3 Canales</span>
                <span className="px-2 py-1 bg-red-50 rounded-full">LTV/CAC Ratio</span>
              </div>
            </Link>

            {/* Calculadora LTV */}
            <Link
              href="/utilidades/calculadora-ltv"
              className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-cyan-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Calculadora LTV</h3>
              <p className="text-sm text-gray-600 mb-3">
                Calcula el valor de vida del cliente y optimiza tu inversión en marketing digital.
              </p>
              <div className="flex items-center gap-2 text-xs text-cyan-600 font-semibold">
                <span className="px-2 py-1 bg-cyan-50 rounded-full">Retention</span>
                <span className="px-2 py-1 bg-blue-50 rounded-full">ARPU</span>
              </div>
            </Link>

            {/* Simulador de Inversion */}
            <Link
              href="/labs/simulador-inversion"
              className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-slate-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Simulador Inversion</h3>
              <p className="text-sm text-gray-600 mb-3">
                Evalua si tu negocio esta listo para invertir en marketing digital. Anti-humo.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                <span className="px-2 py-1 bg-slate-50 rounded-full">Score M&P</span>
                <span className="px-2 py-1 bg-slate-100 rounded-full">Stress Test</span>
              </div>
            </Link>
          </div>

          {/* CTA Ver más */}
          <div className="text-center mt-12">
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Ver todas las herramientas
              <ArrowRight className="w-5 h-5" />
            </Link>
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

          <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl border-2 border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <th className="px-4 py-4 text-left text-white font-bold text-sm border-r border-blue-500">PLATAFORMA</th>
                  <th className="px-4 py-4 text-right text-white font-bold text-sm border-r border-blue-500">INVERSIÓN</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-sm border-r border-blue-500">LEADS</th>
                  <th className="px-4 py-4 text-right text-white font-bold text-sm border-r border-blue-500">COSTO/LEAD</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-sm border-r border-blue-500">VENTA #</th>
                  <th className="px-4 py-4 text-right text-white font-bold text-sm border-r border-blue-500">VENTA $</th>
                  <th className="px-4 py-4 text-right text-white font-bold text-sm border-r border-blue-500">COSTO/CLIENTE</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-sm border-r border-blue-500">PROYECCIÓN</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-sm">ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {reporteData.map((row, idx) => (
                  <tr key={idx} className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}>
                    <td className="px-4 py-4 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          row.color === 'blue' ? 'bg-blue-600' :
                          row.color === 'purple' ? 'bg-purple-600' :
                          row.color === 'cyan' ? 'bg-cyan-600' :
                          'bg-pink-600'
                        }`}></div>
                        <span className="font-semibold text-gray-900">{row.plataforma}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-blue-600 border-r border-gray-200">
                      {row.inversion}
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-gray-900 border-r border-gray-200">
                      {row.leads}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-emerald-600 border-r border-gray-200">
                      {row.costoLead}
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-gray-900 border-r border-gray-200">
                      {row.ventasNum}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-blue-700 border-r border-gray-200">
                      {row.ventasMonto}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-orange-600 border-r border-gray-200">
                      {row.costoCliente}
                    </td>
                    <td className="px-4 py-4 text-center border-r border-gray-200">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        row.proyeccion.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {row.proyeccion}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {row.accion === 'incrementar' && (
                          <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                            ↑ Incrementar
                          </button>
                        )}
                        {row.accion === 'pausar' && (
                          <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors">
                            ⏸ Pausar
                          </button>
                        )}
                        {row.accion === 'modificar' && (
                          <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors">
                            ⚙ Modificar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
                  <td className="px-4 py-4 text-left text-white font-bold border-r border-gray-700">TOTAL</td>
                  <td className="px-4 py-4 text-right text-white font-bold border-r border-gray-700">$12.604.100</td>
                  <td className="px-4 py-4 text-center text-white font-bold border-r border-gray-700">1.305</td>
                  <td className="px-4 py-4 text-right text-white font-bold border-r border-gray-700">-</td>
                  <td className="px-4 py-4 text-center text-white font-bold border-r border-gray-700">608</td>
                  <td className="px-4 py-4 text-right text-white font-bold border-r border-gray-700">$96.216.000</td>
                  <td className="px-4 py-4 text-right text-white font-bold border-r border-gray-700">$20.730</td>
                  <td className="px-4 py-4 text-center text-white font-bold border-r border-gray-700">+16%</td>
                  <td className="px-4 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-blue-200 text-sm max-w-4xl mx-auto leading-relaxed">
              <span className="font-semibold text-white">CPL</span> = Costo por Lead |{' '}
              <span className="font-semibold text-white">Venta #</span> = Número de Ventas Cerradas |{' '}
              <span className="font-semibold text-white">Venta $</span> = Monto Total de Ventas |{' '}
              <span className="font-semibold text-white">Costo/Cliente</span> = Costo de Adquisición por Cliente |{' '}
              <span className="font-semibold text-white">Proyección</span> = Crecimiento proyectado mes siguiente
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planes" className="py-20 px-6 bg-white" aria-labelledby="planes-precios">
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
                  <span>20 contenidos orgánicos en todas las redes</span>
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
                  <span>30 contenidos orgánicos en todas las redes</span>
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
                  <span>45 contenidos orgánicos en todas las redes</span>
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
                  onClick={() => trackWhatsAppClick({ page: 'formulario', servicio: 'contacto' })}
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
      <section id="capsulas-youtube" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
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
            {/* Video 1 - CRM M&P */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <YouTubeLite
                  videoId="Zxwm-4SUGDw"
                  title="CRM: M&P Agencia Digital"
                  thumbnailQuality="hqdefault"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 font-semibold">CRM: M&P Agencia Digital</p>
              </div>
            </div>

            {/* Video 2 - Plan de acción */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <YouTubeLite
                  videoId="bdB7ysX5TwQ"
                  title="Plan de acción: M&P Agencia Digital"
                  thumbnailQuality="hqdefault"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 font-semibold">Plan de acción: M&P Agencia Digital</p>
              </div>
            </div>

            {/* Video 3 - Árbol de decisión */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <YouTubeLite
                  videoId="g29oRYkhios"
                  title="Árbol de decisión: M&P Agencia Digital"
                  thumbnailQuality="hqdefault"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 font-semibold">Árbol de decisión: M&P Agencia Digital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Éxito */}
      <section id="casos-exito" className="py-20 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg">
              <Award className="w-4 h-4" />
              Casos de Éxito Reales
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Resultados que <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Hablan por Sí Solos</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Clientes reales compartiendo su experiencia trabajando con Muller y Pérez
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Caso 1 - López Mateo */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <YouTubeLite
                  videoId="vTn18twKalI"
                  title="Caso de Éxito: López Mateo - Muller y Pérez"
                  thumbnailQuality="hqdefault"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 font-semibold">Caso de Éxito: López Mateo</p>
              </div>
            </div>

            {/* Caso 2 - Power Energy */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <YouTubeLite
                  videoId="8VZd4Sckm58"
                  title="Caso de Éxito: Power Energy - Muller y Pérez"
                  thumbnailQuality="hqdefault"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 font-semibold">Caso de Éxito: Power Energy</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">¿Quieres ser nuestro próximo caso de éxito?</p>
            <a
              href="https://wa.me/56944460270?text=Hola!%20Quiero%20ser%20un%20caso%20de%20%C3%A9xito%20con%20M%26P"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 shadow-lg"
            >
              <MessageSquare className="w-5 h-5" />
              Conversemos
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof & Resultados */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Resultados <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Comprobables</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              +500 campañas optimizadas en Chile, USA, México, Perú y Australia desde 2019
            </p>
          </div>

          {/* Métricas Clave */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div className="bg-white rounded-2xl p-8 text-center border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
                5.2x
              </div>
              <div className="text-gray-700 font-semibold text-lg">ROAS Promedio</div>
              <div className="text-sm text-gray-500 mt-2">Últimos 12 meses</div>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                +500
              </div>
              <div className="text-gray-700 font-semibold text-lg">Campañas</div>
              <div className="text-sm text-gray-500 mt-2">5 países</div>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-3">
                USD$2M+
              </div>
              <div className="text-gray-700 font-semibold text-lg">Presupuesto</div>
              <div className="text-sm text-gray-500 mt-2">Gestionado</div>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-3">
                6+
              </div>
              <div className="text-gray-700 font-semibold text-lg">Años</div>
              <div className="text-sm text-gray-500 mt-2">Desde 2019</div>
            </div>
          </div>

          {/* Clientes - Se activará cuando tengamos los logos en /public/clientes/ */}
          {/* <div className="mb-20">
            <ClientLogosGrid />
          </div> */}

          {/* Industrias - 10 con colores vivos */}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
              Industrias que trabajamos
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                SaaS & Tecnología
              </span>
              <span className="px-5 py-2.5 bg-purple-600 text-white rounded-full font-semibold text-sm hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">
                Logística & WMS
              </span>
              <span className="px-5 py-2.5 bg-green-600 text-white rounded-full font-semibold text-sm hover:bg-green-700 transition-colors shadow-md hover:shadow-lg">
                Transporte & Movilidad
              </span>
              <span className="px-5 py-2.5 bg-orange-600 text-white rounded-full font-semibold text-sm hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg">
                Salud & Medicina
              </span>
              <span className="px-5 py-2.5 bg-cyan-600 text-white rounded-full font-semibold text-sm hover:bg-cyan-700 transition-colors shadow-md hover:shadow-lg">
                E-commerce & Retail
              </span>
              <span className="px-5 py-2.5 bg-pink-600 text-white rounded-full font-semibold text-sm hover:bg-pink-700 transition-colors shadow-md hover:shadow-lg">
                Servicios B2B
              </span>
              <span className="px-5 py-2.5 bg-red-600 text-white rounded-full font-semibold text-sm hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
                Inmobiliaria
              </span>
              <span className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                Educación Online
              </span>
              <span className="px-5 py-2.5 bg-yellow-600 text-white rounded-full font-semibold text-sm hover:bg-yellow-700 transition-colors shadow-md hover:shadow-lg">
                Fintech & Seguros
              </span>
              <span className="px-5 py-2.5 bg-teal-600 text-white rounded-full font-semibold text-sm hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg">
                Gastronomía & Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Mejorado */}
      <footer className="bg-slate-900 text-white py-16 px-6" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            {/* Columna 1: Sobre M&P (span 2) */}
            <div className="col-span-2">
              <Image
                src="/logo-blanco.png"
                alt="Muller y Pérez - Agencia de Marketing Digital"
                width={140}
                height={45}
                className="h-10 w-auto mb-4"
                loading="lazy"
              />
              <p className="text-blue-200 text-sm mb-5 leading-relaxed max-w-xs">
                Agencia de Performance Marketing especializada en Google Ads, Meta Ads y estrategias data-driven.
              </p>
              <a
                href="https://wa.me/56992258137?text=Hola%20M%26P%2C%20quiero%20mejorar%20mis%20resultados%20en%20marketing%20digital"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ page: 'footer', servicio: 'general' })}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Conversemos
              </a>
            </div>

            {/* Columna 2: Servicios */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">Servicios</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/servicios/google-ads-chile" className="text-blue-200 hover:text-white transition-colors">Google Ads</Link></li>
                <li><Link href="/servicios/meta-ads-chile" className="text-blue-200 hover:text-white transition-colors">Meta Ads</Link></li>
                <li><Link href="/servicios/performance-marketing" className="text-blue-200 hover:text-white transition-colors">Performance</Link></li>
                <li><Link href="/servicios/seo-chile" className="text-blue-200 hover:text-white transition-colors">SEO</Link></li>
                <li className="pt-1"><Link href="/servicios" className="text-blue-400 hover:text-white transition-colors font-medium">Ver todos →</Link></li>
              </ul>
            </div>

            {/* Columna 3: Por Industria */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">Por Industria</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/marketing-digital-ecommerce-chile" className="text-blue-200 hover:text-white transition-colors">Ecommerce</Link></li>
                <li><Link href="/marketing-digital-b2b-chile" className="text-blue-200 hover:text-white transition-colors">B2B</Link></li>
                <li><Link href="/marketing-digital-saas-chile" className="text-blue-200 hover:text-white transition-colors">SaaS</Link></li>
                <li><Link href="/marketing-digital-fintech-chile" className="text-blue-200 hover:text-white transition-colors">Fintech</Link></li>
                <li><Link href="/marketing-digital-servicios-profesionales-chile" className="text-blue-200 hover:text-white transition-colors">Serv. Profesionales</Link></li>
                <li><Link href="/marketing-digital-inmobiliario-chile" className="text-blue-200 hover:text-white transition-colors">Inmobiliario</Link></li>
                <li><Link href="/marketing-digital-salud-chile" className="text-blue-200 hover:text-white transition-colors">Salud</Link></li>
                <li className="pt-1"><Link href="/industrias" className="text-blue-400 hover:text-white transition-colors font-medium">Ver todas →</Link></li>
              </ul>
            </div>

            {/* Columna 4: Recursos */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/nosotros" className="text-blue-200 hover:text-white transition-colors">Quiénes Somos</Link></li>
                <li><Link href="/blog" className="text-blue-200 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/labs" className="text-blue-200 hover:text-white transition-colors">M&P Labs</Link></li>
                <li><Link href="/utilidades" className="text-blue-200 hover:text-white transition-colors">Utilidades</Link></li>
                <li><Link href="/comparativa/muller-perez-vs-agencias-chile" className="text-blue-200 hover:text-white transition-colors">M&P vs Agencias</Link></li>
                <li className="pt-1"><Link href="/recursos" className="text-blue-400 hover:text-white transition-colors font-medium">Ver todos →</Link></li>
              </ul>
            </div>

            {/* Columna 5: Contacto */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">Contacto</h3>
              <ul className="space-y-3 text-sm">
                <li className="text-blue-200">
                  <strong className="text-white block">Las Condes</strong>
                  Badajoz 100, Of 523
                </li>
                <li>
                  <a href="mailto:contacto@mulleryperez.cl" className="text-blue-200 hover:text-white transition-colors">
                    contacto@mulleryperez.cl
                  </a>
                </li>
                <li>
                  <a href="tel:+56992258137" className="text-blue-200 hover:text-white transition-colors">
                    +56 9 9225 8137
                  </a>
                </li>
                <li className="text-blue-200 text-xs">
                  Lun-Jue 09:00-18:00<br />
                  Vie 09:00-15:00
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom: Redes Sociales + Copyright */}
          <div className="pt-8 border-t border-blue-900/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Redes Sociales */}
              <div className="flex gap-4">
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
                <a
                  href="https://www.google.com/maps/place/M%C3%BCller+y+P%C3%A9rez+Agencia+Digital/@-33.4082192,-70.5754085,17z/data=!3m1!4b1!4m6!3m5!1s0x9662cf8ad2cd9fbf:0xa33471793df8d335!8m2!3d-33.4082237!4d-70.5728336!16s%2Fg%2F11jvfwf3zg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="Google Business Profile M&P"
                  title="Ver en Google Maps"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 6.125 7.5 13.5 8.086 14.086a1 1 0 001.414 0C13.586 22 21.5 14.625 21.5 8.5 21.5 3.81 17.69 0 12 0zm0 12c-1.933 0-3.5-1.567-3.5-3.5S10.067 5 12 5s3.5 1.567 3.5 3.5S13.933 12 12 12z"/>
                  </svg>
                </a>
              </div>

              {/* Copyright */}
              <div className="text-center md:text-right">
                <p className="text-blue-300 text-sm">
                  © {new Date().getFullYear()} Muller y Pérez. Todos los derechos reservados.
                </p>
                <p className="text-blue-400 text-xs mt-1">
                  <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link>
                  {' '} | {' '}
                  <Link href="/crm/login" className="hover:text-white transition-colors">Acceso Clientes</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
