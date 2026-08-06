// @ts-nocheck
/**
 * PAÍSES LATAM — Factores de Ajuste 2026
 * Fuentes: Adamigo 2026 (Meta Ads CPM & CPC by Country), Statista LATAM 2024-2026
 * Fecha: Agosto 2026
 *
 * Chile es el baseline (factor 1.0). Los demás países se expresan como
 * multiplicadores relativos a Chile para CPCs y CPMs.
 */

export interface CountryConfig {
  code: string
  name: string
  flag: string
  currency: string
  currency_symbol: string
  usd_exchange_rate: number  // 1 USD = X moneda local (ago 2026 aprox)

  // Meta Ads benchmarks por país (Adamigo 2026)
  meta_cpm_usd: number
  meta_cpc_usd: number

  // Factores relativos a Chile (Chile = 1.0)
  google_cpc_factor: number   // Ajuste CPC Google vs Chile
  meta_cpc_factor: number     // Ajuste CPC Meta vs Chile
  meta_cpm_factor: number     // Ajuste CPM Meta vs Chile

  // Contexto del mercado
  digital_maturity: number    // 0-1 (madurez digital del mercado)
  population_digital: number  // Millones de usuarios digitales
  timezone: string
  locale: string
  notes: string
}

export const LATAM_COUNTRIES: Record<string, CountryConfig> = {

  CL: {
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    currency: 'CLP',
    currency_symbol: '$',
    usd_exchange_rate: 935,
    meta_cpm_usd: 5.20,
    meta_cpc_usd: 0.60,
    google_cpc_factor: 1.0,
    meta_cpc_factor: 1.0,
    meta_cpm_factor: 1.0,
    digital_maturity: 0.78,
    population_digital: 16.5,
    timezone: 'America/Santiago',
    locale: 'es-CL',
    notes: 'Mercado LATAM más estable. CPCs calibrados con Ubersuggest Chile (333 keywords).'
  },

  MX: {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    currency: 'MXN',
    currency_symbol: '$',
    usd_exchange_rate: 17.2,
    meta_cpm_usd: 4.50,
    meta_cpc_usd: 0.45,
    google_cpc_factor: 0.85,    // Google ~15% más barato que Chile
    meta_cpc_factor: 0.75,      // Meta 25% más barato (0.45/0.60)
    meta_cpm_factor: 0.87,      // CPM 13% más bajo (4.50/5.20)
    digital_maturity: 0.72,
    population_digital: 100.0,
    timezone: 'America/Mexico_City',
    locale: 'es-MX',
    notes: 'Mayor mercado hispanohablante. Volumen alto, CPCs competitivos. Oportunidad de scaling.'
  },

  CO: {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    currency: 'COP',
    currency_symbol: '$',
    usd_exchange_rate: 4150,
    meta_cpm_usd: 4.00,
    meta_cpc_usd: 0.42,
    google_cpc_factor: 0.78,    // Google ~22% más barato que Chile
    meta_cpc_factor: 0.70,      // Meta 30% más barato (0.42/0.60)
    meta_cpm_factor: 0.77,      // CPM 23% más bajo (4.00/5.20)
    digital_maturity: 0.68,
    population_digital: 39.0,
    timezone: 'America/Bogota',
    locale: 'es-CO',
    notes: 'Adopción digital creciente. E-commerce en expansión. Costos atractivos para testing.'
  },

  AR: {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    currency: 'ARS',
    currency_symbol: '$',
    usd_exchange_rate: 920,
    meta_cpm_usd: 3.80,
    meta_cpc_usd: 0.38,
    google_cpc_factor: 0.72,    // Google ~28% más barato que Chile
    meta_cpc_factor: 0.63,      // Meta 37% más barato (0.38/0.60)
    meta_cpm_factor: 0.73,      // CPM 27% más bajo (3.80/5.20)
    digital_maturity: 0.74,
    population_digital: 36.0,
    timezone: 'America/Argentina/Buenos_Aires',
    locale: 'es-AR',
    notes: 'Alta madurez digital pero volatilidad económica. CPCs baratos en USD, fluctuación cambiaria.'
  },

  BR: {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    currency: 'BRL',
    currency_symbol: 'R$',
    usd_exchange_rate: 5.15,
    meta_cpm_usd: 4.20,
    meta_cpc_usd: 0.35,
    google_cpc_factor: 0.80,    // Google ~20% más barato que Chile
    meta_cpc_factor: 0.58,      // Meta 42% más barato (0.35/0.60)
    meta_cpm_factor: 0.81,      // CPM 19% más bajo (4.20/5.20)
    digital_maturity: 0.76,
    population_digital: 181.0,
    timezone: 'America/Sao_Paulo',
    locale: 'pt-BR',
    notes: 'Mayor mercado LATAM. Pix revolucionó pagos. Idioma portugués requiere contenido específico.'
  },

  PE: {
    code: 'PE',
    name: 'Perú',
    flag: '🇵🇪',
    currency: 'PEN',
    currency_symbol: 'S/',
    usd_exchange_rate: 3.75,
    meta_cpm_usd: 3.70,
    meta_cpc_usd: 0.36,
    google_cpc_factor: 0.70,    // Google ~30% más barato que Chile
    meta_cpc_factor: 0.60,      // Meta 40% más barato (0.36/0.60)
    meta_cpm_factor: 0.71,      // CPM 29% más bajo (3.70/5.20)
    digital_maturity: 0.62,
    population_digital: 24.0,
    timezone: 'America/Lima',
    locale: 'es-PE',
    notes: 'Mercado emergente en e-commerce. CPCs más bajos de LATAM. Adopción móvil creciente.'
  }
}

// ═══ Helpers ═══

export function getCountry(code: string): CountryConfig {
  return LATAM_COUNTRIES[code] || LATAM_COUNTRIES['CL']
}

export function getCountryFactor(code: string, platform: 'google' | 'meta'): number {
  const country = getCountry(code)
  return platform === 'google' ? country.google_cpc_factor : country.meta_cpc_factor
}

export function convertUSDtoLocal(usd: number, countryCode: string): number {
  const country = getCountry(countryCode)
  return Math.round(usd * country.usd_exchange_rate)
}

export function convertLocalToUSD(local: number, countryCode: string): number {
  const country = getCountry(countryCode)
  return +(local / country.usd_exchange_rate).toFixed(2)
}

export function getAllCountryCodes(): string[] {
  return Object.keys(LATAM_COUNTRIES)
}

export function getCountryList(): { code: string; name: string; flag: string }[] {
  return Object.values(LATAM_COUNTRIES).map(c => ({
    code: c.code, name: c.name, flag: c.flag
  }))
}
