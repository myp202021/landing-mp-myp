/**
 * UTM & Source Tracking Utility
 * Captura y clasifica el origen del tráfico (Google Ads, Meta, Orgánico, etc.)
 */

export interface TrackingData {
  // UTM Parameters
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  // Google Ads
  gclid: string | null
  // Meta Ads
  fbclid: string | null
  // Clasificación
  source_type: 'google_ads' | 'meta_ads' | 'organic' | 'direct' | 'referral' | 'email' | 'other'
  source_detail: string
}

const STORAGE_KEY = 'myp_tracking_data'

/**
 * Extrae parámetros de tracking de una URL
 */
export function extractTrackingFromUrl(url: string): TrackingData {
  try {
    const urlObj = new URL(url)
    const params = urlObj.searchParams

    const data: TrackingData = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      gclid: params.get('gclid'),
      fbclid: params.get('fbclid'),
      source_type: 'direct',
      source_detail: 'Tráfico directo'
    }

    // Clasificar fuente
    data.source_type = classifySource(data)
    data.source_detail = getSourceDetail(data)

    return data
  } catch {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      gclid: null,
      fbclid: null,
      source_type: 'direct',
      source_detail: 'Tráfico directo'
    }
  }
}

/**
 * Clasifica el tipo de fuente basado en los parámetros
 */
function classifySource(data: Partial<TrackingData>): TrackingData['source_type'] {
  // Google Ads - tiene gclid o UTM de google con cpc/ppc
  if (data.gclid) {
    return 'google_ads'
  }

  if (data.utm_source?.toLowerCase().includes('google') &&
      (data.utm_medium?.toLowerCase() === 'cpc' ||
       data.utm_medium?.toLowerCase() === 'ppc' ||
       data.utm_medium?.toLowerCase() === 'paid')) {
    return 'google_ads'
  }

  // Meta Ads - tiene fbclid o UTM de facebook/instagram/meta
  if (data.fbclid) {
    return 'meta_ads'
  }

  const metaSources = ['facebook', 'fb', 'instagram', 'ig', 'meta']
  if (metaSources.some(s => data.utm_source?.toLowerCase().includes(s)) &&
      (data.utm_medium?.toLowerCase() === 'cpc' ||
       data.utm_medium?.toLowerCase() === 'paid' ||
       data.utm_medium?.toLowerCase() === 'social')) {
    return 'meta_ads'
  }

  // Email
  if (data.utm_source?.toLowerCase() === 'email' ||
      data.utm_medium?.toLowerCase() === 'email') {
    return 'email'
  }

  // Organic search
  const organicSources = ['google', 'bing', 'yahoo', 'duckduckgo']
  if (organicSources.some(s => data.utm_source?.toLowerCase().includes(s)) &&
      data.utm_medium?.toLowerCase() === 'organic') {
    return 'organic'
  }

  // Referral
  if (data.utm_medium?.toLowerCase() === 'referral') {
    return 'referral'
  }

  // Si tiene UTM pero no clasificado
  if (data.utm_source || data.utm_medium) {
    return 'other'
  }

  return 'direct'
}

/**
 * Genera descripción legible de la fuente
 */
function getSourceDetail(data: TrackingData): string {
  switch (data.source_type) {
    case 'google_ads':
      if (data.utm_campaign) {
        return `Google Ads: ${data.utm_campaign}`
      }
      return 'Google Ads'

    case 'meta_ads':
      if (data.utm_campaign) {
        return `Meta Ads: ${data.utm_campaign}`
      }
      return 'Meta Ads (Facebook/Instagram)'

    case 'organic':
      return `Búsqueda orgánica: ${data.utm_source || 'Google'}`

    case 'email':
      if (data.utm_campaign) {
        return `Email: ${data.utm_campaign}`
      }
      return 'Email marketing'

    case 'referral':
      return `Referido: ${data.utm_source || 'Sitio externo'}`

    case 'other':
      return `${data.utm_source || 'Otro'} / ${data.utm_medium || '-'}`

    default:
      return 'Tráfico directo'
  }
}

/**
 * Guarda datos de tracking en localStorage (para persistir entre páginas)
 */
export function saveTrackingData(data: TrackingData): void {
  if (typeof window === 'undefined') return

  try {
    // Solo guardar si hay datos significativos (no sobrescribir con directo)
    const existing = getStoredTrackingData()
    if (data.source_type === 'direct' && existing && existing.source_type !== 'direct') {
      return // No sobrescribir datos útiles con "directo"
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      timestamp: Date.now()
    }))
  } catch {
    // localStorage no disponible
  }
}

/**
 * Obtiene datos de tracking guardados
 */
export function getStoredTrackingData(): TrackingData | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const data = JSON.parse(stored)

    // Expirar después de 30 días
    if (data.timestamp && Date.now() - data.timestamp > 30 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return data
  } catch {
    return null
  }
}

/**
 * Inicializa tracking al cargar la página
 * Llamar esto en el layout o componente principal
 */
export function initTracking(): TrackingData {
  if (typeof window === 'undefined') {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      gclid: null,
      fbclid: null,
      source_type: 'direct',
      source_detail: 'Tráfico directo'
    }
  }

  // Extraer de URL actual
  const currentData = extractTrackingFromUrl(window.location.href)

  // Si la URL tiene parámetros de tracking, guardarlos
  if (currentData.source_type !== 'direct' || currentData.gclid || currentData.fbclid) {
    saveTrackingData(currentData)
    return currentData
  }

  // Si no, intentar recuperar datos guardados
  const storedData = getStoredTrackingData()
  if (storedData) {
    return storedData
  }

  // Verificar referrer para clasificar
  const referrer = document.referrer
  if (referrer) {
    try {
      const referrerUrl = new URL(referrer)
      const referrerHost = referrerUrl.hostname.toLowerCase()

      // Búsqueda orgánica
      if (referrerHost.includes('google.com') || referrerHost.includes('google.cl')) {
        currentData.source_type = 'organic'
        currentData.source_detail = 'Búsqueda orgánica: Google'
      } else if (referrerHost.includes('bing.com')) {
        currentData.source_type = 'organic'
        currentData.source_detail = 'Búsqueda orgánica: Bing'
      } else if (referrerHost.includes('facebook.com') || referrerHost.includes('instagram.com')) {
        // Sin fbclid = orgánico de redes
        currentData.source_type = 'referral'
        currentData.source_detail = 'Referido: Redes sociales'
      } else if (!referrerHost.includes('mulleryperez.cl')) {
        currentData.source_type = 'referral'
        currentData.source_detail = `Referido: ${referrerHost}`
      }
    } catch {
      // URL inválida
    }
  }

  return currentData
}

/**
 * Obtiene el nombre de fuente para guardar en la base de datos
 */
export function getFuenteForDB(trackingData: TrackingData): string {
  switch (trackingData.source_type) {
    case 'google_ads':
      return 'google_ads'
    case 'meta_ads':
      return 'meta_ads'
    case 'organic':
      return 'organico'
    case 'email':
      return 'email'
    case 'referral':
      return 'referido'
    default:
      return 'directo'
  }
}
