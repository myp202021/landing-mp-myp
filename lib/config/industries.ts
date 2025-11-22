// @ts-nocheck
// =====================================================
// BIBLIOTECA CENTRAL DE INDUSTRIAS
// Este archivo define las 50 industrias soportadas
// Usado por frontend y backend para garantizar consistencia
// =====================================================

export interface IndustryConfig {
  value: string
  label: string
  avgCPC: number
  cvr: number
  competitorDensity: 'low' | 'medium' | 'high' | 'very_high'
  category: string
  businessType: 'B2B' | 'B2C' | 'AMBOS'
  customerType: 'RECURRENTE' | 'ONE_SHOT'
}

export const INDUSTRIES: IndustryConfig[] = [
  // TECNOLOGÍA Y SOFTWARE (8)
  { value: 'ECOMMERCE', label: 'E-commerce / Retail', avgCPC: 0.8, cvr: 2.1, competitorDensity: 'high', category: 'Tecnología', businessType: 'B2C', customerType: 'ONE_SHOT' },
  { value: 'TECHNOLOGY', label: 'Tecnología / Software', avgCPC: 2.4, cvr: 3.2, competitorDensity: 'high', category: 'Tecnología', businessType: 'AMBOS', customerType: 'RECURRENTE' },
  { value: 'SAAS', label: 'SaaS / Software', avgCPC: 3.1, cvr: 4.1, competitorDensity: 'very_high', category: 'Tecnología', businessType: 'B2B', customerType: 'RECURRENTE' },
  { value: 'FINTECH', label: 'Fintech', avgCPC: 4.2, cvr: 2.8, competitorDensity: 'very_high', category: 'Tecnología', businessType: 'AMBOS', customerType: 'RECURRENTE' },
  { value: 'CRYPTOCURRENCY', label: 'Criptomonedas', avgCPC: 2.9, cvr: 1.8, competitorDensity: 'medium', category: 'Tecnología', businessType: 'B2C', customerType: 'ONE_SHOT' },
  { value: 'MOBILE_APPS', label: 'Apps Móviles', avgCPC: 2.4, cvr: 1.4, competitorDensity: 'very_high', category: 'Tecnología', businessType: 'B2C', customerType: 'RECURRENTE' },
  { value: 'GAMING', label: 'Gaming / Videojuegos', avgCPC: 1.8, cvr: 2.2, competitorDensity: 'high', category: 'Tecnología', businessType: 'B2C', customerType: 'ONE_SHOT' },
  { value: 'TELECOMMUNICATIONS', label: 'Telecomunicaciones', avgCPC: 3.1, cvr: 2.1, competitorDensity: 'high', category: 'Tecnología', businessType: 'AMBOS', customerType: 'RECURRENTE' },

  // FINANZAS Y SEGUROS (5)
  { value: 'FINANCE', label: 'Finanzas / Seguros', avgCPC: 3.8, cvr: 2.2, competitorDensity: 'high', category: 'Finanzas', businessType: 'AMBOS', customerType: 'RECURRENTE' },
  { value: 'INSURANCE', label: 'Seguros', avgCPC: 4.5, cvr: 2.1, competitorDensity: 'high', category: 'Finanzas', businessType: 'AMBOS', customerType: 'RECURRENTE' },
  { value: 'LEGAL', label: 'Servicios Legales', avgCPC: 5.2, cvr: 3.1, competitorDensity: 'high', category: 'Finanzas', businessType: 'AMBOS', customerType: 'RECURRENTE' },
  { value: 'CONSULTING', label: 'Consultoría', avgCPC: 3.8, cvr: 2.8, competitorDensity: 'medium', category: 'Finanzas', businessType: 'B2B', customerType: 'RECURRENTE' },
  { value: 'PROFESSIONAL_SERVICES', label: 'Servicios Profesionales', avgCPC: 3.1, cvr: 3.2, competitorDensity: 'medium', category: 'Finanzas', businessType: 'B2B', customerType: 'RECURRENTE' },

  // SALUD Y BIENESTAR (8)
  { value: 'HEALTH', label: 'Salud / Bienestar', avgCPC: 2.1, cvr: 3.4, competitorDensity: 'medium', category: 'Salud', businessType: 'B2C', customerType: 'ONE_SHOT' },
  { value: 'HEALTHCARE_SERVICES', label: 'Servicios Médicos', avgCPC: 3.2, cvr: 4.2, competitorDensity: 'medium', category: 'Salud', businessType: 'B2C', customerType: 'RECURRENTE' },
  { value: 'DENTAL', label: 'Odontología', avgCPC: 2.8, cvr: 5.1, competitorDensity: 'medium', category: 'Salud', businessType: 'B2C', customerType: 'RECURRENTE' },
  { value: 'VETERINARY', label: 'Veterinaria', avgCPC: 1.9, cvr: 4.8, competitorDensity: 'low', category: 'Salud' },
  { value: 'FITNESS', label: 'Fitness / Gimnasios', avgCPC: 1.4, cvr: 3.1, competitorDensity: 'medium', category: 'Salud' },
  { value: 'WELLNESS', label: 'Bienestar / Spa', avgCPC: 2.2, cvr: 3.8, competitorDensity: 'medium', category: 'Salud' },
  { value: 'BEAUTY_COSMETICS', label: 'Belleza / Cosmética', avgCPC: 1.8, cvr: 2.9, competitorDensity: 'high', category: 'Salud' },
  { value: 'PHARMACEUTICAL', label: 'Farmacéutico', avgCPC: 3.5, cvr: 2.5, competitorDensity: 'medium', category: 'Salud' },

  // EDUCACIÓN Y MARKETING (5)
  { value: 'EDUCATION', label: 'Educación / Cursos', avgCPC: 2.1, cvr: 4.2, competitorDensity: 'high', category: 'Educación', businessType: 'B2C', customerType: 'ONE_SHOT' },
  { value: 'MARKETING_AGENCIES', label: 'Agencias de Marketing', avgCPC: 2.4, cvr: 2.1, competitorDensity: 'high', category: 'Educación', businessType: 'B2B', customerType: 'RECURRENTE' },
  { value: 'MEDIA_PUBLISHING', label: 'Medios / Editorial', avgCPC: 1.8, cvr: 1.8, competitorDensity: 'high', category: 'Educación' },
  { value: 'BOOKS_LITERATURE', label: 'Libros / Literatura', avgCPC: 0.9, cvr: 2.1, competitorDensity: 'low', category: 'Educación' },
  { value: 'TRANSLATION_LANGUAGES', label: 'Traducción / Idiomas', avgCPC: 2.4, cvr: 3.1, competitorDensity: 'medium', category: 'Educación' },

  // INMOBILIARIA Y CONSTRUCCIÓN (4)
  { value: 'REAL_ESTATE', label: 'Inmobiliaria', avgCPC: 3.4, cvr: 1.8, competitorDensity: 'high', category: 'Inmobiliaria' },
  { value: 'CONSTRUCTION', label: 'Construcción', avgCPC: 2.6, cvr: 2.1, competitorDensity: 'medium', category: 'Inmobiliaria' },
  { value: 'ARCHITECTURE', label: 'Arquitectura', avgCPC: 2.8, cvr: 2.4, competitorDensity: 'medium', category: 'Inmobiliaria' },
  { value: 'FURNITURE', label: 'Muebles / Decoración', avgCPC: 1.6, cvr: 1.8, competitorDensity: 'medium', category: 'Inmobiliaria' },

  // SERVICIOS LOCALES (8)
  { value: 'LOCAL_SERVICES', label: 'Servicios Locales', avgCPC: 2.8, cvr: 4.1, competitorDensity: 'low', category: 'Servicios' },
  { value: 'CLEANING_SERVICES', label: 'Limpieza', avgCPC: 2.1, cvr: 4.8, competitorDensity: 'low', category: 'Servicios' },
  { value: 'PEST_CONTROL', label: 'Control de Plagas', avgCPC: 3.2, cvr: 5.2, competitorDensity: 'low', category: 'Servicios' },
  { value: 'SECURITY', label: 'Seguridad', avgCPC: 2.9, cvr: 3.1, competitorDensity: 'medium', category: 'Servicios' },
  { value: 'REPAIR_MAINTENANCE', label: 'Reparación / Mantención', avgCPC: 2.4, cvr: 4.2, competitorDensity: 'low', category: 'Servicios' },
  { value: 'LOGISTICS', label: 'Logística / Transporte', avgCPC: 2.8, cvr: 2.4, competitorDensity: 'medium', category: 'Servicios' },
  { value: 'PHOTOGRAPHY', label: 'Fotografía', avgCPC: 1.8, cvr: 3.8, competitorDensity: 'high', category: 'Servicios' },
  { value: 'EVENTS', label: 'Eventos', avgCPC: 2.1, cvr: 3.4, competitorDensity: 'medium', category: 'Servicios' },

  // RETAIL Y COMERCIO (6)
  { value: 'AUTOMOTIVE', label: 'Automotriz', avgCPC: 1.9, cvr: 1.6, competitorDensity: 'high', category: 'Retail' },
  { value: 'FOOD', label: 'Alimentación / Delivery', avgCPC: 0.9, cvr: 2.8, competitorDensity: 'high', category: 'Retail', businessType: 'B2C', customerType: 'ONE_SHOT' },
  { value: 'FASHION', label: 'Moda / Belleza', avgCPC: 1.1, cvr: 2.4, competitorDensity: 'high', category: 'Retail' },
  { value: 'LUXURY', label: 'Lujo / Premium', avgCPC: 2.8, cvr: 1.2, competitorDensity: 'medium', category: 'Retail' },
  { value: 'HOME_GARDEN', label: 'Hogar / Jardín', avgCPC: 1.4, cvr: 2.1, competitorDensity: 'medium', category: 'Retail' },
  { value: 'PETS', label: 'Mascotas', avgCPC: 1.6, cvr: 3.8, competitorDensity: 'medium', category: 'Retail' },

  // ENTRETENIMIENTO Y LIFESTYLE (6)
  { value: 'TRAVEL', label: 'Turismo / Viajes', avgCPC: 1.2, cvr: 2.1, competitorDensity: 'high', category: 'Entretenimiento' },
  { value: 'MUSIC_ENTERTAINMENT', label: 'Música / Entretenimiento', avgCPC: 1.2, cvr: 2.4, competitorDensity: 'medium', category: 'Entretenimiento' },
  { value: 'SPORTS', label: 'Deportes', avgCPC: 1.4, cvr: 2.8, competitorDensity: 'medium', category: 'Entretenimiento' },
  { value: 'CRAFTS_HOBBIES', label: 'Manualidades / Hobbies', avgCPC: 1.1, cvr: 3.2, competitorDensity: 'low', category: 'Entretenimiento' },
  { value: 'BABY_CHILDREN', label: 'Bebés / Niños', avgCPC: 1.4, cvr: 2.9, competitorDensity: 'high', category: 'Entretenimiento' },
  { value: 'DATING_RELATIONSHIPS', label: 'Citas / Relaciones', avgCPC: 2.8, cvr: 1.8, competitorDensity: 'high', category: 'Entretenimiento' }
]

// Función para obtener industria por valor
export function getIndustryByValue(value: string): IndustryConfig | undefined {
  return INDUSTRIES.find(industry => industry.value === value)
}

// Función para obtener industrias por categoría
export function getIndustriesByCategory(category: string): IndustryConfig[] {
  return INDUSTRIES.filter(industry => industry.category === category)
}

// Función para validar si una industria existe
export function isValidIndustry(value: string): boolean {
  return INDUSTRIES.some(industry => industry.value === value)
}

// Obtener todas las categorías únicas
export function getCategories(): string[] {
  return [...new Set(INDUSTRIES.map(industry => industry.category))]
}

// Estadísticas de la biblioteca
export const INDUSTRY_STATS = {
  total: INDUSTRIES.length,
  byCategory: getCategories().reduce((acc, category) => {
    acc[category] = getIndustriesByCategory(category).length
    return acc
  }, {} as Record<string, number>)
}