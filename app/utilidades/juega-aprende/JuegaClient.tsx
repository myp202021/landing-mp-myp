'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Gamepad2, RefreshCw, Info, X, Check, TrendingUp, MessageCircle } from 'lucide-react'
import { createSoftwareAppSchema, createBreadcrumbSchema } from '@/lib/metadata'

interface MarketingOption {
  id: string
  title: string
  category: string
  cost: number
  desc: string
  extendedDesc: string
  pros: string
  cons: string
  impactTags: { name: string; level: string }[]
  impact: {
    awareness: number
    traffic: number
    leads: number
    conversion: number
    retention: number
    roi_short: number
    roi_long: number
  }
  synergies: string[]
}

const TOTAL_BUDGET = 1000000

const categories: { [key: string]: string } = {
  all: 'Todas',
  'paid-search': 'Búsqueda Pagada',
  'social-media': 'Redes Sociales',
  content: 'Contenido',
  conversion: 'Conversión',
  email: 'Email Marketing',
  automation: 'Automatización'
}

const marketingOptions: MarketingOption[] = [
  {
    id: 'search-1',
    title: 'Google Ads Search',
    category: 'paid-search',
    cost: 250000,
    desc: 'Anuncios en el buscador de Google para captar tráfico de personas que buscan activamente tus productos o servicios.',
    extendedDesc: 'Las campañas de Google Ads Search te permiten aparecer en los resultados de búsqueda cuando potenciales clientes buscan tus productos o servicios. Incluye palabras clave con alta intención de compra, ideal para generar tráfico cualificado a tu sitio web y convertir usuarios en clientes.',
    pros: 'Altamente enfocado en usuarios con intención de compra, resultados a corto plazo',
    cons: 'Competencia elevada, costo por clic puede ser alto en ciertos sectores',
    impactTags: [
      { name: 'Tráfico cualificado', level: 'high' },
      { name: 'Conversión', level: 'medium' },
      { name: 'ROI a corto plazo', level: 'high' }
    ],
    impact: { awareness: 2, traffic: 4, leads: 3, conversion: 3, retention: 0, roi_short: 4, roi_long: 2 },
    synergies: ['remarketing-1', 'landing-1', 'landing-2']
  },
  {
    id: 'remarketing-1',
    title: 'Remarketing',
    category: 'paid-search',
    cost: 180000,
    desc: 'Campaña para impactar nuevamente a usuarios que ya visitaron tu sitio web pero no convirtieron.',
    extendedDesc: 'El remarketing te permite mostrar anuncios específicos a personas que ya visitaron tu sitio web pero no realizaron la acción deseada (compra, registro, etc.). Esta estrategia incluye anuncios en la red de display de Google con mensajes para reconectar con estos usuarios y aumentar la conversión.',
    pros: 'Mayor tasa de conversión, menor costo por conversión, aprovecha tráfico ya generado',
    cons: 'Alcance limitado a visitantes previos, puede generar fatiga de anuncios si no se configura correctamente',
    impactTags: [
      { name: 'Reconversión', level: 'high' },
      { name: 'Costo-efectividad', level: 'high' },
      { name: 'Recordación', level: 'medium' }
    ],
    impact: { awareness: 1, traffic: 2, leads: 3, conversion: 4, retention: 2, roi_short: 4, roi_long: 2 },
    synergies: ['search-1', 'social-1', 'social-2', 'landing-1']
  },
  {
    id: 'social-1',
    title: 'Meta Ads - Tráfico',
    category: 'social-media',
    cost: 150000,
    desc: 'Campaña en Facebook e Instagram optimizada para dirigir usuarios a tu sitio web.',
    extendedDesc: 'Las campañas de tráfico en Meta Ads (Facebook e Instagram) están diseñadas para atraer visitantes a tu sitio web utilizando el algoritmo de optimización de Facebook. Incluye configuración de audiencias basadas en intereses y comportamientos similares a tus clientes actuales.',
    pros: 'Gran alcance, buena segmentación por intereses, costos por clic competitivos',
    cons: 'El tráfico suele tener menor intención de compra que el de búsqueda',
    impactTags: [
      { name: 'Volumen de tráfico', level: 'high' },
      { name: 'Segmentación', level: 'medium' },
      { name: 'Intención de compra', level: 'low' }
    ],
    impact: { awareness: 4, traffic: 5, leads: 2, conversion: 2, retention: 1, roi_short: 3, roi_long: 2 },
    synergies: ['remarketing-1', 'landing-1', 'content-1']
  },
  {
    id: 'social-2',
    title: 'Meta Ads - Leads',
    category: 'social-media',
    cost: 200000,
    desc: 'Campaña de captación de datos mediante formularios nativos de Facebook e Instagram.',
    extendedDesc: 'Las campañas de generación de leads en Meta utilizan formularios integrados directamente en la plataforma, eliminando la fricción de redirigir a una landing page. Estos formularios precargados con datos del usuario facilitan la captación de información de contacto, ideal para negocios B2B o servicios que requieren seguimiento.',
    pros: 'Formularios de fácil completado, menor fricción para el usuario, datos de contacto de calidad',
    cons: 'A veces menor calidad de leads que otras fuentes, requiere seguimiento rápido',
    impactTags: [
      { name: 'Volumen de leads', level: 'high' },
      { name: 'Facilidad de captación', level: 'high' },
      { name: 'Calidad variable', level: 'medium' }
    ],
    impact: { awareness: 3, traffic: 2, leads: 5, conversion: 3, retention: 1, roi_short: 3, roi_long: 2 },
    synergies: ['email-1', 'crm-1', 'automation-1']
  },
  {
    id: 'social-4',
    title: 'Campaña de WhatsApp',
    category: 'social-media',
    cost: 150000,
    desc: 'Anuncios que dirigen al usuario a iniciar una conversación de WhatsApp con tu negocio.',
    extendedDesc: 'Las campañas de WhatsApp combinan anuncios en Facebook e Instagram con la capacidad de iniciar conversaciones directas por WhatsApp. Esta estrategia es ideal para negocios donde la comunicación directa y personal es clave para la conversión, como servicios profesionales, consultas o reservas.',
    pros: 'Comunicación directa, alta tasa de respuesta, canal preferido por muchos usuarios',
    cons: 'Requiere personal disponible para responder mensajes, puede saturarse si hay muchas consultas',
    impactTags: [
      { name: 'Interacción directa', level: 'high' },
      { name: 'Personalización', level: 'high' },
      { name: 'Recursos humanos', level: 'medium' }
    ],
    impact: { awareness: 2, traffic: 1, leads: 4, conversion: 4, retention: 3, roi_short: 3, roi_long: 3 },
    synergies: ['crm-1', 'automation-1', 'email-1']
  },
  {
    id: 'content-1',
    title: 'Video para Redes Sociales',
    category: 'content',
    cost: 180000,
    desc: 'Producción de videos cortos y atractivos optimizados para Facebook, Instagram y TikTok.',
    extendedDesc: 'La creación de contenido audiovisual para redes sociales incluye el desarrollo de videos cortos (15-60 segundos) con mensajes claros y atractivos adaptados a cada plataforma. Los videos generan mayor engagement que cualquier otro formato y son fundamentales para aumentar la visibilidad orgánica.',
    pros: 'Alto engagement, mayor reach orgánico, versatilidad para usar en distintas plataformas',
    cons: 'Producción más costosa que otros formatos, pueden quedar obsoletos rápidamente',
    impactTags: [
      { name: 'Engagement', level: 'high' },
      { name: 'Branding', level: 'high' },
      { name: 'Algoritmos favorables', level: 'medium' }
    ],
    impact: { awareness: 5, traffic: 3, leads: 2, conversion: 2, retention: 3, roi_short: 2, roi_long: 4 },
    synergies: ['social-1', 'social-2', 'remarketing-1']
  },
  {
    id: 'content-3',
    title: 'Campaña con Influencers',
    category: 'content',
    cost: 250000,
    desc: 'Colaboración con creadores de contenido relevantes para tu audiencia.',
    extendedDesc: 'Las campañas con influencers consisten en colaborar con creadores de contenido que tienen audiencias alineadas con tu público objetivo. En lugar de usar macro-influencers, esta estrategia se enfoca en micro-influencers (10-50K seguidores) con comunidades más pequeñas pero altamente comprometidas y relevantes para tu sector.',
    pros: 'Alcance a audiencias nicho, mayor credibilidad y confianza, contenido auténtico',
    cons: 'Resultados variables según el influencer, menor control sobre el mensaje final',
    impactTags: [
      { name: 'Credibilidad', level: 'high' },
      { name: 'Audiencias específicas', level: 'medium' },
      { name: 'Difícil medición', level: 'medium' }
    ],
    impact: { awareness: 5, traffic: 3, leads: 3, conversion: 2, retention: 1, roi_short: 2, roi_long: 3 },
    synergies: ['social-1', 'social-2', 'content-1']
  },
  {
    id: 'landing-1',
    title: 'Landing Page Optimizada',
    category: 'conversion',
    cost: 250000,
    desc: 'Diseño de página de aterrizaje enfocada en convertir visitantes en leads o clientes.',
    extendedDesc: 'Una landing page optimizada incluye diseño orientado a conversión con un mensaje claro, propuesta de valor, testimonios y un formulario optimizado. Este tipo de página se enfoca en una única acción deseada, eliminando distracciones y aumentando las tasas de conversión.',
    pros: 'Enfoque en una sola acción, elimina distracciones, facilita medición',
    cons: 'Limitada a un solo objetivo o producto, requiere tráfico de calidad',
    impactTags: [
      { name: 'Tasa de conversión', level: 'high' },
      { name: 'Enfoque', level: 'high' },
      { name: 'Experiencia de usuario', level: 'medium' }
    ],
    impact: { awareness: 1, traffic: 0, leads: 3, conversion: 5, retention: 1, roi_short: 4, roi_long: 2 },
    synergies: ['search-1', 'social-1', 'social-2', 'remarketing-1', 'email-1']
  },
  {
    id: 'conversion-1',
    title: 'Optimización de Conversión (CRO)',
    category: 'conversion',
    cost: 180000,
    desc: 'Análisis y mejora sistemática de los puntos de conversión en tu sitio web.',
    extendedDesc: 'La optimización de la tasa de conversión (CRO) incluye análisis de comportamiento de usuarios, mapas de calor, grabaciones de sesiones y pruebas A/B para identificar y resolver los obstáculos que impiden las conversiones. Este enfoque sistemático mejora el rendimiento de todo el tráfico que ya recibes.',
    pros: 'Maximiza el rendimiento del tráfico existente, mejoras basadas en datos reales',
    cons: 'Requiere tráfico suficiente para obtener datos significativos, proceso iterativo',
    impactTags: [
      { name: 'Análisis de datos', level: 'high' },
      { name: 'Optimización web', level: 'high' },
      { name: 'Valor del tráfico', level: 'medium' }
    ],
    impact: { awareness: 0, traffic: 0, leads: 3, conversion: 5, retention: 2, roi_short: 4, roi_long: 3 },
    synergies: ['search-1', 'remarketing-1', 'landing-1']
  },
  {
    id: 'email-1',
    title: 'Email Marketing',
    category: 'email',
    cost: 120000,
    desc: 'Creación y envío de newsletters y campañas de email marketing para tu base de datos.',
    extendedDesc: 'El email marketing incluye la configuración de una plataforma de envío, diseño de plantillas, creación de contenido relevante y envío regular de comunicaciones a tu base de datos. Este canal directo te permite mantener el contacto con leads y clientes a un costo muy eficiente.',
    pros: 'Canal directo, control total del mensaje, bajo costo por contacto',
    cons: 'Requiere base de datos propia, tasas de apertura variables',
    impactTags: [
      { name: 'Canal directo', level: 'high' },
      { name: 'Costo-efectividad', level: 'high' },
      { name: 'Requiere BBDD', level: 'medium' }
    ],
    impact: { awareness: 1, traffic: 2, leads: 1, conversion: 3, retention: 5, roi_short: 4, roi_long: 3 },
    synergies: ['social-2', 'social-4', 'landing-1']
  },
  {
    id: 'email-3',
    title: 'Secuencias Automatizadas',
    category: 'email',
    cost: 200000,
    desc: 'Flujos de emails que se envían automáticamente según acciones o momentos específicos.',
    extendedDesc: 'Las secuencias automatizadas de email son series de mensajes que se envían automáticamente en respuesta a acciones específicas o en momentos clave. Incluyen secuencias de bienvenida, nutrición de leads, recuperación de carritos abandonados y reactivación de clientes inactivos.',
    pros: 'Funciona 24/7, guía al usuario en el funnel de conversión, personalización por comportamiento',
    cons: 'Configuración técnica inicial más compleja, requiere mantenimiento periódico',
    impactTags: [
      { name: 'Automatización', level: 'high' },
      { name: 'Nutrición de leads', level: 'high' },
      { name: 'Ciclo de vida', level: 'high' }
    ],
    impact: { awareness: 0, traffic: 1, leads: 3, conversion: 4, retention: 5, roi_short: 3, roi_long: 5 },
    synergies: ['landing-1', 'crm-1', 'automation-1']
  },
  {
    id: 'crm-1',
    title: 'CRM',
    category: 'automation',
    cost: 180000,
    desc: 'Implementación de sistema de gestión de relaciones con clientes para seguimiento de leads y ventas.',
    extendedDesc: 'Un CRM organiza toda la información de tus contactos, leads y clientes en un sistema centralizado. Permite seguimiento de interacciones, gestión de oportunidades de venta y análisis del embudo comercial, mejorando la coordinación entre marketing y ventas.',
    pros: 'Organización centralizada, visibilidad del pipeline de ventas, seguimiento de interacciones',
    cons: 'Requiere adopción por el equipo, curva de aprendizaje inicial',
    impactTags: [
      { name: 'Gestión de leads', level: 'high' },
      { name: 'Seguimiento', level: 'high' },
      { name: 'Adopción interna', level: 'medium' }
    ],
    impact: { awareness: 0, traffic: 0, leads: 2, conversion: 4, retention: 4, roi_short: 2, roi_long: 5 },
    synergies: ['social-2', 'social-4', 'email-1', 'email-3']
  },
  {
    id: 'automation-1',
    title: 'Chatbot Inteligente',
    category: 'automation',
    cost: 150000,
    desc: 'Asistente virtual para tu web que responde consultas, califica leads y programa citas automáticamente.',
    extendedDesc: 'Un chatbot inteligente proporciona atención inmediata a los visitantes de tu web, respondiendo consultas frecuentes, calificando el potencial de cada lead, y programando citas automáticamente. Este asistente virtual atiende 24/7, mejora la experiencia del usuario y captura información valiosa de clientes potenciales.',
    pros: 'Atención inmediata 24/7, calificación automática de leads, ahorro de tiempo en consultas básicas',
    cons: 'Limitaciones para manejar consultas complejas, puede generar frustración si no está bien configurado',
    impactTags: [
      { name: 'Disponibilidad 24/7', level: 'high' },
      { name: 'Captura de datos', level: 'medium' },
      { name: 'Experiencia de usuario', level: 'medium' }
    ],
    impact: { awareness: 1, traffic: 0, leads: 3, conversion: 3, retention: 2, roi_short: 3, roi_long: 3 },
    synergies: ['social-4', 'landing-1', 'crm-1']
  }
]

export default function JuegaAprende() {

  const simuladorSchema = createSoftwareAppSchema(
    'El Planificador - Simulador de Marketing Digital',
    'Juego educativo interactivo para crear estrategias de marketing digital con presupuesto de $1.000.000. Explora Google Ads, Meta Ads, remarketing, contenido, email marketing, automatización y más. Recibe diagnóstico con ROI estimado y recomendaciones personalizadas.',
    'https://www.mulleryperez.cl/utilidades/juega-aprende'
  )

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Inicio', url: 'https://www.mulleryperez.cl' },
    { name: 'Utilidades', url: 'https://www.mulleryperez.cl/utilidades' },
    { name: 'Juega y Aprende', url: 'https://www.mulleryperez.cl/utilidades/juega-aprende' }
  ])

  const [remainingBudget, setRemainingBudget] = useState(TOTAL_BUDGET)
  const [selectedOptions, setSelectedOptions] = useState<MarketingOption[]>([])
  const [currentCategory, setCurrentCategory] = useState('all')
  const [showResults, setShowResults] = useState(false)
  const [roi, setRoi] = useState(0)
  const [effectivenessLevel, setEffectivenessLevel] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [selectedModalOption, setSelectedModalOption] = useState<MarketingOption | null>(null)
  const [combinedImpact, setCombinedImpact] = useState({
    awareness: 0,
    traffic: 0,
    leads: 0,
    conversion: 0,
    retention: 0,
    roi_short: 0,
    roi_long: 0
  })

  useEffect(() => {
    updateStrategyStats()
  }, [selectedOptions])

  const formatNumber = (number: number) => {
    return '$' + number.toLocaleString('es-CL')
  }

  const toggleOption = (option: MarketingOption) => {
    const index = selectedOptions.findIndex(item => item.id === option.id)

    if (index === -1) {
      if (option.cost <= remainingBudget) {
        setSelectedOptions([...selectedOptions, option])
        setRemainingBudget(remainingBudget - option.cost)
      }
    } else {
      const newSelected = selectedOptions.filter(item => item.id !== option.id)
      setSelectedOptions(newSelected)
      setRemainingBudget(remainingBudget + option.cost)
    }
  }

  const removeOption = (option: MarketingOption) => {
    const newSelected = selectedOptions.filter(item => item.id !== option.id)
    setSelectedOptions(newSelected)
    setRemainingBudget(remainingBudget + option.cost)
  }

  const updateStrategyStats = () => {
    if (selectedOptions.length === 0) {
      setCombinedImpact({
        awareness: 0,
        traffic: 0,
        leads: 0,
        conversion: 0,
        retention: 0,
        roi_short: 0,
        roi_long: 0
      })
      return
    }

    const impact = {
      awareness: 0,
      traffic: 0,
      leads: 0,
      conversion: 0,
      retention: 0,
      roi_short: 0,
      roi_long: 0
    }

    selectedOptions.forEach(option => {
      for (const key in impact) {
        impact[key as keyof typeof impact] += option.impact[key as keyof typeof option.impact]
      }
    })

    const maxPossibleImpact = 10
    for (const key in impact) {
      impact[key as keyof typeof impact] = Math.min(
        Math.round(impact[key as keyof typeof impact] * 10) / 10,
        maxPossibleImpact
      )
    }

    setCombinedImpact(impact)
  }

  const calculateResults = () => {
    if (selectedOptions.length === 0) return

    const weights = {
      awareness: 0.05,
      traffic: 0.15,
      leads: 0.15,
      conversion: 0.25,
      retention: 0.15,
      roi_short: 0.10,
      roi_long: 0.15
    }

    let weightedScore = 0
    for (const key in combinedImpact) {
      weightedScore += combinedImpact[key as keyof typeof combinedImpact] * weights[key as keyof typeof weights]
    }

    const calculatedRoi = 1 + (weightedScore / 10) * 5
    const roundedRoi = Math.round(calculatedRoi * 10) / 10

    setRoi(roundedRoi)

    let level: string
    if (calculatedRoi > 4) {
      setEffectivenessLevel('Muy Efectivo')
      level = 'high'
    } else if (calculatedRoi >= 2.5) {
      setEffectivenessLevel('Aceptable')
      level = 'medium'
    } else {
      setEffectivenessLevel('Requiere Mejoras')
      level = 'low'
    }

    setDiagnosis(generateDiagnosis(level, roundedRoi))
    setShowResults(true)

    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const generateDiagnosis = (level: string, roiValue: number): string => {
    const strengths: string[] = []
    const weaknesses: string[] = []

    const threshold = {
      high: 7,
      medium: 5,
      low: 3
    }

    const levelThreshold = threshold[level as keyof typeof threshold]

    if (combinedImpact.awareness >= levelThreshold) strengths.push('reconocimiento de marca')
    else if (combinedImpact.awareness <= 3) weaknesses.push('reconocimiento de marca')

    if (combinedImpact.traffic >= levelThreshold) strengths.push('generación de tráfico')
    else if (combinedImpact.traffic <= 3) weaknesses.push('generación de tráfico')

    if (combinedImpact.leads >= levelThreshold) strengths.push('captación de leads')
    else if (combinedImpact.leads <= 3) weaknesses.push('captación de leads')

    if (combinedImpact.conversion >= levelThreshold) strengths.push('conversión')
    else if (combinedImpact.conversion <= 3) weaknesses.push('conversión')

    if (combinedImpact.retention >= levelThreshold) strengths.push('retención de clientes')
    else if (combinedImpact.retention <= 3) weaknesses.push('retención de clientes')

    let text = ''

    if (level === 'high') {
      text += `<strong>¡Excelente estrategia!</strong> Has creado un plan con un ROI estimado de ${roiValue}x, lo que significa que por cada peso invertido, podrías recibir ${roiValue} pesos de retorno.<br><br>`
      text += 'Tu estrategia logra un equilibrio entre captación, conversión y retención, los tres pilares fundamentales del embudo de marketing digital.<br><br>'
    } else if (level === 'medium') {
      text += `<strong>Buen trabajo.</strong> Tu estrategia tiene un ROI estimado de ${roiValue}x, lo que indica un retorno positivo pero con margen de mejora.<br><br>`
      text += 'Has cubierto algunos aspectos clave del marketing digital, pero aún hay áreas que podrían optimizarse para aumentar el rendimiento global.<br><br>'
    } else {
      text += `<strong>Atención:</strong> Tu estrategia actual tiene un ROI estimado bajo de ${roiValue}x, lo que significa que el retorno podría no justificar adecuadamente la inversión.<br><br>`
      text += 'Existe un desequilibrio en la distribución del presupuesto que no aprovecha el efecto sinérgico de combinar acciones complementarias a lo largo del embudo de conversión.<br><br>'
    }

    if (strengths.length > 0) {
      text += `<strong>Puntos fuertes:</strong> Tu estrategia destaca en ${formatList(strengths)}.<br><br>`
    }

    if (weaknesses.length > 0) {
      text += `<strong>Áreas de mejora:</strong> Tu estrategia necesita fortalecer ${formatList(weaknesses)}.<br><br>`
    }

    if (level === 'high') {
      text += '<strong>Conclusión:</strong> Estás listo para implementar esta estrategia. ¿Te gustaría recibir una asesoría personalizada para llevar tu estrategia al siguiente nivel?'
    } else if (level === 'medium') {
      text += '<strong>Conclusión:</strong> Con los ajustes sugeridos, podrás mejorar significativamente tus resultados. ¿Quieres que te ayudemos a optimizarla?'
    } else {
      text += '<strong>Conclusión:</strong> Recomendamos replantear tu estrategia siguiendo un enfoque más balanceado. Nuestro equipo puede ayudarte a desarrollar una estrategia más efectiva para tu negocio.'
    }

    return text
  }

  const formatList = (items: string[]): string => {
    if (items.length === 0) return ''
    if (items.length === 1) return items[0]
    if (items.length === 2) return `${items[0]} y ${items[1]}`

    const last = items[items.length - 1]
    const rest = items.slice(0, -1)
    return `${rest.join(', ')} y ${last}`
  }

  const resetGame = () => {
    setRemainingBudget(TOTAL_BUDGET)
    setSelectedOptions([])
    setShowResults(false)
    setCurrentCategory('all')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredOptions = currentCategory === 'all'
    ? marketingOptions
    : marketingOptions.filter(option => option.category === currentCategory)

  const getBudgetColor = () => {
    const percentage = remainingBudget / TOTAL_BUDGET
    if (percentage < 0.1) return 'text-red-600'
    if (percentage < 0.3) return 'text-orange-600'
    return 'text-white'
  }

  const getStatColor = (value: number) => {
    if (value >= 7) return 'bg-green-500'
    if (value >= 4) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(simuladorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 backdrop-blur-sm">
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-200 text-sm font-semibold">Juego Educativo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Crea tu estrategia digital<br />con $1.000.000
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Explora estrategias de marketing digital, selecciona las que más te interesen y descubre qué combinación genera mejores resultados
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-blue-900 mb-3">¿Cómo jugar?</h3>
          <div className="text-blue-800 space-y-2">
            <p>1. Explora las estrategias de marketing digital disponibles en las diferentes categorías</p>
            <p>2. Selecciona las que más te interesen hasta agotar tu presupuesto disponible</p>
            <p>3. Analiza la efectividad de tu estrategia y descubre qué combinación genera mejores resultados</p>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-center">
          <span className="text-white text-lg">Presupuesto disponible:</span>
          <div className={`text-4xl font-bold ${getBudgetColor()} mt-2`}>
            {formatNumber(remainingBudget)}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCurrentCategory(key)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                currentCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredOptions.map(option => {
            const isSelected = selectedOptions.some(item => item.id === option.id)
            const isDisabled = !isSelected && option.cost > remainingBudget

            return (
              <div
                key={option.id}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : isDisabled
                    ? 'border-gray-200 opacity-60'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {categories[option.category]}
                  </span>
                  <button
                    onClick={() => setSelectedModalOption(option)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.desc}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {option.impactTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded ${
                        tag.level === 'high'
                          ? 'bg-green-100 text-green-700'
                          : tag.level === 'medium'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-lg">{formatNumber(option.cost)}</span>
                  <button
                    onClick={() => toggleOption(option)}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSelected ? 'Quitar' : 'Agregar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Options */}
        {selectedOptions.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Estrategia Digital Seleccionada</h3>

            {/* Strategy Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { key: 'awareness', label: 'Reconocimiento', icon: '👁' },
                { key: 'traffic', label: 'Tráfico', icon: '🚀' },
                { key: 'leads', label: 'Leads', icon: '🎯' },
                { key: 'conversion', label: 'Conversión', icon: '💰' },
                { key: 'retention', label: 'Retención', icon: '🔄' }
              ].map(stat => (
                <div key={stat.key} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    {stat.icon} {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {combinedImpact[stat.key as keyof typeof combinedImpact].toFixed(1)}
                  </div>
                  <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatColor(combinedImpact[stat.key as keyof typeof combinedImpact])} transition-all`}
                      style={{ width: `${combinedImpact[stat.key as keyof typeof combinedImpact] * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Items */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {selectedOptions.map(option => (
                <div key={option.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div>
                    <div className="font-semibold text-gray-900">{option.title}</div>
                    <div className="text-blue-600 font-bold text-sm">{formatNumber(option.cost)}</div>
                  </div>
                  <button
                    onClick={() => removeOption(option)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-2 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={calculateResults}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
            >
              Analizar Resultados
            </button>
          </div>
        )}

        {selectedOptions.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-xl border border-gray-200">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-600">
              Aún no has seleccionado ninguna estrategia.<br />Elige al menos una para comenzar tu plan digital.
            </p>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div id="results" className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-8 shadow-xl border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Diagnóstico de tu Estrategia Digital</h2>

            <div className="bg-white rounded-xl p-6 mb-6 text-center">
              <div className="text-xl text-gray-700 mb-2">ROI Estimado</div>
              <div className="text-5xl font-bold text-blue-600 mb-4">{roi.toFixed(1)}x</div>
              <div className="text-lg text-gray-700 mb-2">Nivel de Efectividad</div>
              <div
                className={`inline-block px-6 py-3 rounded-full font-bold text-white ${
                  effectivenessLevel === 'Muy Efectivo'
                    ? 'bg-green-600'
                    : effectivenessLevel === 'Aceptable'
                    ? 'bg-orange-600'
                    : 'bg-red-600'
                }`}
              >
                {effectivenessLevel}
              </div>
            </div>

            <div
              className="bg-white rounded-xl p-6 mb-6 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: diagnosis }}
            />

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                <RefreshCw className="w-5 h-5" /> Reiniciar Planificador
              </button>
              <Link
                href="/contacto"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
              >
                <TrendingUp className="w-5 h-5" /> Solicitar Asesoría
              </Link>
              <a
                href="https://wa.me/56992225813"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedModalOption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedModalOption(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{selectedModalOption.title}</h3>
              <button onClick={() => setSelectedModalOption(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <strong>Descripción:</strong>
                <p className="text-gray-700 mt-2">{selectedModalOption.extendedDesc}</p>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-b">
                <div>
                  <strong>Inversión:</strong> {formatNumber(selectedModalOption.cost)}
                </div>
                <div>
                  <strong>Categoría:</strong> {categories[selectedModalOption.category]}
                </div>
              </div>

              <div>
                <strong className="text-green-600">Beneficios:</strong>
                <p className="text-gray-700 mt-2">{selectedModalOption.pros}</p>
              </div>

              <div>
                <strong className="text-red-600">Consideraciones:</strong>
                <p className="text-gray-700 mt-2">{selectedModalOption.cons}</p>
              </div>

              <div>
                <strong>Impacto en:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedModalOption.impactTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded ${
                        tag.level === 'high'
                          ? 'bg-green-100 text-green-700'
                          : tag.level === 'medium'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong>Sinergias recomendadas:</strong>
                <p className="text-gray-700 mt-2">Esta estrategia funciona especialmente bien cuando se combina con:</p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                  {selectedModalOption.synergies.map(synergyId => {
                    const synergy = marketingOptions.find(opt => opt.id === synergyId)
                    return synergy ? <li key={synergyId}>{synergy.title}</li> : null
                  })}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSelectedModalOption(null)}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      
      </div>
    </>
  )
}
