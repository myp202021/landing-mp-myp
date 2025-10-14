export type Industry =
  | 'ECOMMERCE'
  | 'TECNOLOGIA_SAAS'
  | 'SERVICIOS_PROFESIONALES'
  | 'SALUD_MEDICINA'
  | 'EDUCACION_ONLINE'
  | 'INMOBILIARIA'
  | 'AUTOMOTRIZ'
  | 'FINTECH'
  | 'MODA_RETAIL'
  | 'TURISMO'
  | 'CONSTRUCCION'
  | 'VETERINARIA'
  | 'DEPORTES'
  | 'GASTRONOMIA'
  | 'SEGUROS'

export type Channel =
  | 'GOOGLE_ADS'
  | 'META_ADS'
  | 'LINKEDIN_ADS'
  | 'TIKTOK_ADS'
  | 'EMAIL_MARKETING'

export type Region =
  | 'METROPOLITANA'
  | 'VALPARAISO'
  | 'BIOBIO'
  | 'ARAUCANIA'
  | 'LOS_LAGOS'
  | 'MAULE'
  | 'ANTOFAGASTA'
  | 'COQUIMBO'
  | 'OTRA'

export type CompanySize =
  | 'STARTUP'
  | 'PYME'
  | 'EMPRESA'
  | 'CORPORACION'

export interface CampaignMetric {
  id?: string
  created_at?: string
  industry: Industry
  channel: Channel
  budget_monthly: number
  revenue: number
  leads_generated?: number
  sales_generated?: number
  cac?: number
  roas?: number
  conversion_rate?: number
  region?: Region
  company_size?: CompanySize
  anonymous_user_id: string
}

export interface Benchmark {
  industry: Industry
  channel: Channel
  avgBudget: number
  avgRevenue: number
  avgCAC: number
  avgROAS: number
  avgConversionRate: number
  totalSamples: number
  userPosition?: 'TOP_10' | 'ABOVE_AVG' | 'AVERAGE' | 'BELOW_AVG' | 'BOTTOM_10'
  // Percentiles for quartile visualization
  percentiles?: {
    budget: { p25: number; median: number; p75: number }
    revenue: { p25: number; median: number; p75: number }
    cac: { p25: number; median: number; p75: number }
    roas: { p25: number; median: number; p75: number }
    conversion: { p25: number; median: number; p75: number }
  }
  // User's exact percentile position for each metric
  userPercentiles?: {
    roas: number
    cac: number
    conversion: number
  }
}

export interface IndustryLabels {
  [key: string]: string
}

export const INDUSTRY_LABELS: IndustryLabels = {
  'ECOMMERCE': 'E-commerce',
  'TECNOLOGIA_SAAS': 'Tecnología / SaaS',
  'SERVICIOS_PROFESIONALES': 'Servicios Profesionales',
  'SALUD_MEDICINA': 'Salud / Medicina',
  'EDUCACION_ONLINE': 'Educación Online',
  'INMOBILIARIA': 'Inmobiliaria',
  'AUTOMOTRIZ': 'Automotriz',
  'FINTECH': 'Fintech',
  'MODA_RETAIL': 'Moda / Retail',
  'TURISMO': 'Turismo',
  'CONSTRUCCION': 'Construcción',
  'VETERINARIA': 'Veterinaria / Mascotas',
  'DEPORTES': 'Deportes / Fitness',
  'GASTRONOMIA': 'Gastronomía / Delivery',
  'SEGUROS': 'Seguros'
}

export const CHANNEL_LABELS: { [key: string]: string } = {
  'GOOGLE_ADS': 'Google Ads',
  'META_ADS': 'Meta Ads (Facebook/Instagram)',
  'LINKEDIN_ADS': 'LinkedIn Ads',
  'TIKTOK_ADS': 'TikTok Ads',
  'EMAIL_MARKETING': 'Email Marketing'
}

export const REGION_LABELS: { [key: string]: string } = {
  'METROPOLITANA': 'Región Metropolitana',
  'VALPARAISO': 'Valparaíso',
  'BIOBIO': 'Biobío',
  'ARAUCANIA': 'Araucanía',
  'LOS_LAGOS': 'Los Lagos',
  'MAULE': 'Maule',
  'ANTOFAGASTA': 'Antofagasta',
  'COQUIMBO': 'Coquimbo',
  'OTRA': 'Otra región'
}

export const COMPANY_SIZE_LABELS: { [key: string]: string } = {
  'STARTUP': 'Startup (1-10 personas)',
  'PYME': 'PYME (11-50 personas)',
  'EMPRESA': 'Empresa (51-200 personas)',
  'CORPORACION': 'Corporación (200+ personas)'
}
