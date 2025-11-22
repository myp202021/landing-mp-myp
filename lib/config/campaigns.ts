// @ts-nocheck
// =====================================================
// BIBLIOTECA CENTRAL DE TIPOS DE CAMPAÑA
// Este archivo define los tipos de campañas soportadas
// Usado por frontend y backend para garantizar consistencia
// =====================================================

export interface CampaignConfig {
  type: string
  label: string
  platform: string
  description: string
  avgCTR: number
  avgCPC: number
  avgCVR: number
  scalability: 'low' | 'medium' | 'high' | 'very_high'
  complexity: 'low' | 'medium' | 'high'
  icon: string
  objective: 'branding' | 'traffic' | 'conversion' | 'remarketing'
  category: 'awareness' | 'consideration' | 'conversion'
}

export const CAMPAIGN_TYPES: CampaignConfig[] = [
  // GOOGLE ADS
  {
    type: 'SEARCH_GOOGLE',
    label: 'Búsqueda Google',
    platform: 'Google',
    description: 'Anuncios de texto que aparecen en resultados de búsqueda',
    avgCTR: 3.2,
    avgCPC: 1.2,
    avgCVR: 2.8,
    scalability: 'high',
    complexity: 'medium',
    icon: '🔍',
    objective: 'conversion',
    category: 'conversion'
  },
  {
    type: 'DISPLAY_GOOGLE',
    label: 'Display Google',
    platform: 'Google',
    description: 'Banners visuales en sitios web de la red de display',
    avgCTR: 0.8,
    avgCPC: 0.6,
    avgCVR: 1.2,
    scalability: 'very_high',
    complexity: 'low',
    icon: '🎨',
    objective: 'branding',
    category: 'awareness'
  },
  {
    type: 'SHOPPING_GOOGLE',
    label: 'Shopping Google',
    platform: 'Google',
    description: 'Productos con imágenes en resultados de búsqueda',
    avgCTR: 4.1,
    avgCPC: 0.9,
    avgCVR: 3.4,
    scalability: 'medium',
    complexity: 'high',
    icon: '🛒',
    objective: 'conversion',
    category: 'conversion'
  },
  {
    type: 'YOUTUBE_GOOGLE',
    label: 'YouTube Ads',
    platform: 'Google',
    description: 'Videos promocionales en YouTube',
    avgCTR: 2.1,
    avgCPC: 0.4,
    avgCVR: 1.8,
    scalability: 'very_high',
    complexity: 'high',
    icon: '📹',
    objective: 'branding',
    category: 'awareness'
  },
  {
    type: 'PMAX_GOOGLE',
    label: 'Performance Max',
    platform: 'Google',
    description: 'Campañas automatizadas en todas las redes de Google',
    avgCTR: 2.8,
    avgCPC: 1.1,
    avgCVR: 2.4,
    scalability: 'very_high',
    complexity: 'low',
    icon: '🚀',
    objective: 'conversion',
    category: 'conversion'
  },

  // META ADS
  {
    type: 'FEED_META',
    label: 'Feed Meta',
    platform: 'Meta',
    description: 'Anuncios nativos en el feed de Facebook e Instagram',
    avgCTR: 2.4,
    avgCPC: 0.8,
    avgCVR: 2.1,
    scalability: 'very_high',
    complexity: 'medium',
    icon: '📱',
    objective: 'traffic',
    category: 'consideration'
  },
  {
    type: 'STORIES_META',
    label: 'Stories Meta',
    platform: 'Meta',
    description: 'Anuncios inmersivos en historias de Instagram/Facebook',
    avgCTR: 3.1,
    avgCPC: 0.7,
    avgCVR: 1.9,
    scalability: 'high',
    complexity: 'medium',
    icon: '📚',
    objective: 'branding',
    category: 'awareness'
  },
  {
    type: 'VIDEO_META',
    label: 'Video Meta',
    platform: 'Meta',
    description: 'Videos promocionales optimizados para engagement',
    avgCTR: 4.2,
    avgCPC: 0.5,
    avgCVR: 1.6,
    scalability: 'very_high',
    complexity: 'high',
    icon: '🎬',
    objective: 'branding',
    category: 'awareness'
  },
  {
    type: 'LEAD_FORMS_META',
    label: 'Lead Forms Meta',
    platform: 'Meta',
    description: 'Formularios nativos para captura de leads',
    avgCTR: 2.8,
    avgCPC: 1.2,
    avgCVR: 4.8,
    scalability: 'medium',
    complexity: 'low',
    icon: '📋',
    objective: 'conversion',
    category: 'conversion'
  },
  {
    type: 'WHATSAPP_META',
    label: 'WhatsApp Business',
    platform: 'Meta',
    description: 'Conexión directa por WhatsApp para conversiones',
    avgCTR: 3.8,
    avgCPC: 0.9,
    avgCVR: 5.2,
    scalability: 'medium',
    complexity: 'medium',
    icon: '💬',
    objective: 'conversion',
    category: 'conversion'
  },

  // LINKEDIN ADS
  {
    type: 'SPONSORED_CONTENT_LINKEDIN',
    label: 'Contenido Patrocinado LinkedIn',
    platform: 'LinkedIn',
    description: 'Anuncios nativos en el feed profesional de LinkedIn',
    avgCTR: 1.8,
    avgCPC: 3.2,
    avgCVR: 3.5,
    scalability: 'medium',
    complexity: 'medium',
    icon: '💼',
    objective: 'traffic',
    category: 'consideration'
  },
  {
    type: 'MESSAGE_ADS_LINKEDIN',
    label: 'Mensajes LinkedIn',
    platform: 'LinkedIn',
    description: 'Mensajes directos personalizados en LinkedIn',
    avgCTR: 4.5,
    avgCPC: 2.8,
    avgCVR: 6.2,
    scalability: 'low',
    complexity: 'high',
    icon: '✉️',
    objective: 'conversion',
    category: 'conversion'
  },

  // TIKTOK ADS
  {
    type: 'IN_FEED_TIKTOK',
    label: 'In-Feed TikTok',
    platform: 'TikTok',
    description: 'Videos nativos en el feed de TikTok',
    avgCTR: 5.2,
    avgCPC: 0.6,
    avgCVR: 2.3,
    scalability: 'very_high',
    complexity: 'medium',
    icon: '🎵',
    objective: 'branding',
    category: 'awareness'
  },

  // TWITTER/X ADS
  {
    type: 'PROMOTED_TWEETS_X',
    label: 'Tweets Promocionados X',
    platform: 'X',
    description: 'Tweets promocionados en la timeline de X (Twitter)',
    avgCTR: 1.9,
    avgCPC: 1.5,
    avgCVR: 2.1,
    scalability: 'medium',
    complexity: 'low',
    icon: '🐦',
    objective: 'traffic',
    category: 'consideration'
  }
]

// Función para obtener campaña por tipo
export function getCampaignByType(type: string): CampaignConfig | undefined {
  return CAMPAIGN_TYPES.find(campaign => campaign.type === type)
}

// Función para obtener campañas por plataforma
export function getCampaignsByPlatform(platform: string): CampaignConfig[] {
  return CAMPAIGN_TYPES.filter(campaign => campaign.platform === platform)
}

// Función para obtener campañas por objetivo
export function getCampaignsByObjective(objective: 'branding' | 'traffic' | 'conversion' | 'remarketing'): CampaignConfig[] {
  return CAMPAIGN_TYPES.filter(campaign => campaign.objective === objective)
}

// Función para obtener campañas por categoría
export function getCampaignsByCategory(category: 'awareness' | 'consideration' | 'conversion'): CampaignConfig[] {
  return CAMPAIGN_TYPES.filter(campaign => campaign.category === category)
}

// Función para validar si un tipo de campaña existe
export function isValidCampaignType(type: string): boolean {
  return CAMPAIGN_TYPES.some(campaign => campaign.type === type)
}

// Obtener todas las plataformas únicas
export function getPlatforms(): string[] {
  return [...new Set(CAMPAIGN_TYPES.map(campaign => campaign.platform))]
}

// Obtener todos los objetivos únicos
export function getObjectives(): string[] {
  return [...new Set(CAMPAIGN_TYPES.map(campaign => campaign.objective))]
}

// Obtener todas las categorías únicas
export function getCategories(): string[] {
  return [...new Set(CAMPAIGN_TYPES.map(campaign => campaign.category))]
}

// Estadísticas de la biblioteca
export const CAMPAIGN_STATS = {
  total: CAMPAIGN_TYPES.length,
  byPlatform: getPlatforms().reduce((acc, platform) => {
    acc[platform] = getCampaignsByPlatform(platform).length
    return acc
  }, {} as Record<string, number>),
  byObjective: getObjectives().reduce((acc, objective) => {
    acc[objective] = getCampaignsByObjective(objective as any).length
    return acc
  }, {} as Record<string, number>),
  byCategory: getCategories().reduce((acc, category) => {
    acc[category] = getCampaignsByCategory(category as any).length
    return acc
  }, {} as Record<string, number>)
}