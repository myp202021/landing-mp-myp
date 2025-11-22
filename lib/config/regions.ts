// @ts-nocheck
// =====================================================
// BIBLIOTECA CENTRAL DE REGIONES DE CHILE
// Este archivo define las regiones soportadas con sus multiplicadores
// Usado por frontend y backend para garantizar consistencia
// =====================================================

export interface RegionConfig {
  value: string
  label: string
  multiplier: number
  marketSize: 'very_large' | 'large' | 'medium' | 'small' | 'very_small'
  competitionLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low'
  digitalAdoption: number // 0-1
}

export const REGIONS: RegionConfig[] = [
  {
    value: 'RM',
    label: 'Región Metropolitana (Santiago)',
    multiplier: 1.0,
    marketSize: 'very_large',
    competitionLevel: 'very_high',
    digitalAdoption: 0.95
  },
  {
    value: 'VAL',
    label: 'Valparaíso',
    multiplier: 0.85,
    marketSize: 'large',
    competitionLevel: 'high',
    digitalAdoption: 0.88
  },
  {
    value: 'BIO',
    label: 'Biobío',
    multiplier: 0.78,
    marketSize: 'large',
    competitionLevel: 'medium',
    digitalAdoption: 0.82
  },
  {
    value: 'ANT',
    label: 'Antofagasta',
    multiplier: 0.92,
    marketSize: 'medium',
    competitionLevel: 'medium',
    digitalAdoption: 0.85
  },
  {
    value: 'ARA',
    label: 'Araucanía',
    multiplier: 0.68,
    marketSize: 'medium',
    competitionLevel: 'low',
    digitalAdoption: 0.75
  },
  {
    value: 'COQ',
    label: 'Coquimbo',
    multiplier: 0.71,
    marketSize: 'medium',
    competitionLevel: 'low',
    digitalAdoption: 0.78
  },
  {
    value: 'MAU',
    label: 'Maule',
    multiplier: 0.64,
    marketSize: 'medium',
    competitionLevel: 'low',
    digitalAdoption: 0.72
  },
  {
    value: 'TAR',
    label: 'Tarapacá',
    multiplier: 0.89,
    marketSize: 'small',
    competitionLevel: 'medium',
    digitalAdoption: 0.80
  },
  {
    value: 'ATT',
    label: 'Atacama',
    multiplier: 0.82,
    marketSize: 'small',
    competitionLevel: 'low',
    digitalAdoption: 0.77
  },
  {
    value: 'LLA',
    label: 'Los Lagos',
    multiplier: 0.74,
    marketSize: 'medium',
    competitionLevel: 'low',
    digitalAdoption: 0.74
  },
  {
    value: 'AYS',
    label: 'Aysén',
    multiplier: 0.58,
    marketSize: 'very_small',
    competitionLevel: 'very_low',
    digitalAdoption: 0.65
  },
  {
    value: 'MAG',
    label: 'Magallanes',
    multiplier: 0.69,
    marketSize: 'small',
    competitionLevel: 'very_low',
    digitalAdoption: 0.70
  },
  {
    value: 'OHI',
    label: 'O\'Higgins',
    multiplier: 0.66,
    marketSize: 'medium',
    competitionLevel: 'low',
    digitalAdoption: 0.73
  },
  {
    value: 'LRI',
    label: 'Los Ríos',
    multiplier: 0.65,
    marketSize: 'small',
    competitionLevel: 'low',
    digitalAdoption: 0.72
  },
  {
    value: 'ARI',
    label: 'Arica y Parinacota',
    multiplier: 0.75,
    marketSize: 'small',
    competitionLevel: 'low',
    digitalAdoption: 0.76
  }
]

// Función para obtener región por valor
export function getRegionByValue(value: string): RegionConfig | undefined {
  return REGIONS.find(region => region.value === value)
}

// Función para obtener regiones por tamaño de mercado
export function getRegionsByMarketSize(marketSize: string): RegionConfig[] {
  return REGIONS.filter(region => region.marketSize === marketSize)
}

// Función para validar si una región existe
export function isValidRegion(value: string): boolean {
  return REGIONS.some(region => region.value === value)
}

// Obtener todas las regiones ordenadas por multiplicador (mayor a menor)
export function getRegionsByMultiplier(): RegionConfig[] {
  return [...REGIONS].sort((a, b) => b.multiplier - a.multiplier)
}

// Estadísticas de la biblioteca
export const REGION_STATS = {
  total: REGIONS.length,
  averageMultiplier: REGIONS.reduce((sum, region) => sum + region.multiplier, 0) / REGIONS.length,
  highestMultiplier: Math.max(...REGIONS.map(region => region.multiplier)),
  lowestMultiplier: Math.min(...REGIONS.map(region => region.multiplier))
}