/**
 * Meta Pixel Utilities for B2B High-Ticket Optimization
 *
 * Estrategia:
 * 1. Trackear eventos con valor estimado para que Meta optimice hacia leads de mayor calidad
 * 2. Pasar parámetros de negocio (cargo, empresa, industria) para mejor targeting
 * 3. Usar eventos estándar que Meta reconoce para optimización automática
 */

// Declaración de tipos para fbq
declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}

// Valores estimados por tipo de servicio (para optimización de valor)
const SERVICE_VALUES: Record<string, number> = {
  'google-ads': 1500000,      // Plan Google Ads ~1.5M CLP/año
  'meta-ads': 1200000,        // Plan Meta Ads ~1.2M CLP/año
  'seo': 1800000,             // Plan SEO ~1.8M CLP/año
  'performance': 2400000,     // Plan Full Performance ~2.4M CLP/año
  'consultoria': 500000,      // Consultoría ~500K CLP
  'default': 1000000          // Valor por defecto ~1M CLP
}

// Multiplicadores por cargo (indica capacidad de decisión)
const ROLE_MULTIPLIERS: Record<string, number> = {
  'ceo': 2.0,
  'gerente-general': 2.0,
  'director': 1.8,
  'gerente-marketing': 1.5,
  'gerente-comercial': 1.5,
  'jefe-marketing': 1.2,
  'coordinador': 1.0,
  'analista': 0.8,
  'default': 1.0
}

// Multiplicadores por industria (ticket promedio)
const INDUSTRY_MULTIPLIERS: Record<string, number> = {
  'tecnologia': 1.5,
  'saas': 1.8,
  'fintech': 2.0,
  'inmobiliaria': 1.6,
  'salud': 1.4,
  'educacion': 1.3,
  'ecommerce': 1.2,
  'retail': 1.1,
  'servicios-profesionales': 1.4,
  'b2b': 1.6,
  'default': 1.0
}

/**
 * Calcula el valor estimado del lead para Meta
 */
function calculateLeadValue(params: {
  servicio?: string
  cargo?: string
  industria?: string
}): number {
  const baseValue = SERVICE_VALUES[params.servicio || 'default'] || SERVICE_VALUES.default
  const roleMultiplier = ROLE_MULTIPLIERS[params.cargo?.toLowerCase().replace(/ /g, '-') || 'default'] || ROLE_MULTIPLIERS.default
  const industryMultiplier = INDUSTRY_MULTIPLIERS[params.industria?.toLowerCase().replace(/ /g, '-') || 'default'] || INDUSTRY_MULTIPLIERS.default

  return Math.round(baseValue * roleMultiplier * industryMultiplier)
}

/**
 * Track Lead event - Cuando alguien envía el formulario de contacto
 * Este es el evento más importante para optimización B2B
 */
export function trackLead(params: {
  nombre?: string
  empresa?: string
  cargo?: string
  email?: string
  telefono?: string
  servicio?: string
  industria?: string
  fuente?: string
}) {
  if (typeof window === 'undefined' || !window.fbq) return

  const estimatedValue = calculateLeadValue({
    servicio: params.servicio,
    cargo: params.cargo,
    industria: params.industria
  })

  // Evento Lead con parámetros de valor
  window.fbq('track', 'Lead', {
    value: estimatedValue,
    currency: 'CLP',
    content_name: params.servicio || 'contacto-general',
    content_category: params.industria || 'general',
    // Parámetros personalizados para audiencias
    lead_type: 'b2b',
    company_name: params.empresa,
    job_title: params.cargo,
    source: params.fuente || 'website-form'
  })

  // También trackear como CompleteRegistration para doble señal
  window.fbq('track', 'CompleteRegistration', {
    value: estimatedValue,
    currency: 'CLP',
    content_name: 'formulario-contacto',
    status: 'completed'
  })

  console.log('[Meta Pixel] Lead tracked:', { estimatedValue, ...params })
}

/**
 * Track Contact event - Cuando hacen clic en WhatsApp
 */
export function trackWhatsAppClick(params?: {
  page?: string
  servicio?: string
}) {
  if (typeof window === 'undefined' || !window.fbq) return

  window.fbq('track', 'Contact', {
    content_name: 'whatsapp-click',
    content_category: params?.servicio || 'general',
    value: 200000, // Valor menor que Lead pero indica intención
    currency: 'CLP'
  })

  console.log('[Meta Pixel] WhatsApp click tracked:', params)
}

/**
 * Track ViewContent - Páginas de alto valor B2B
 */
export function trackViewContent(params: {
  contentName: string
  contentCategory?: string
  contentType?: string
  value?: number
}) {
  if (typeof window === 'undefined' || !window.fbq) return

  window.fbq('track', 'ViewContent', {
    content_name: params.contentName,
    content_category: params.contentCategory || 'servicios',
    content_type: params.contentType || 'page',
    value: params.value || 100000,
    currency: 'CLP'
  })
}

/**
 * Track Schedule - Cuando agendan una reunión
 */
export function trackSchedule(params?: {
  servicio?: string
  fuente?: string
}) {
  if (typeof window === 'undefined' || !window.fbq) return

  window.fbq('track', 'Schedule', {
    content_name: 'reunion-agendada',
    content_category: params?.servicio || 'consultoria',
    value: 500000, // Una reunión agendada tiene alto valor
    currency: 'CLP'
  })
}

/**
 * Track InitiateCheckout - Cuando entran al cotizador
 */
export function trackCotizadorStart() {
  if (typeof window === 'undefined' || !window.fbq) return

  window.fbq('track', 'InitiateCheckout', {
    content_name: 'cotizador-inicio',
    content_category: 'cotizacion',
    value: 300000,
    currency: 'CLP'
  })
}

/**
 * Track AddToCart - Cuando seleccionan un plan en el cotizador
 */
export function trackPlanSelected(params: {
  planName: string
  planValue: number
}) {
  if (typeof window === 'undefined' || !window.fbq) return

  window.fbq('track', 'AddToCart', {
    content_name: params.planName,
    content_category: 'plan',
    value: params.planValue,
    currency: 'CLP'
  })
}

/**
 * Custom Event para scroll depth (indica engagement)
 */
export function trackScrollDepth(percentage: number) {
  if (typeof window === 'undefined' || !window.fbq) return
  if (percentage < 50) return // Solo trackear si scrollearon más del 50%

  window.fbq('trackCustom', 'ScrollDepth', {
    depth: percentage,
    page: window.location.pathname
  })
}

/**
 * Custom Event para tiempo en página (indica engagement B2B)
 */
export function trackTimeOnPage(seconds: number) {
  if (typeof window === 'undefined' || !window.fbq) return
  if (seconds < 60) return // Solo trackear si estuvieron más de 1 minuto

  window.fbq('trackCustom', 'EngagedVisitor', {
    time_on_page: seconds,
    page: window.location.pathname,
    visitor_type: 'high_intent'
  })
}
