// @ts-nocheck
/**
 * CPCs CALIBRADOS 2026 — Chile + LATAM
 *
 * Chile: Ubersuggest 2025 (333 keywords, ponderado por volumen) como base
 *        + enriquecido con datos WordStream/Get-Ryze 2026 (USD)
 * LATAM: Factor por país aplicado sobre CPCs Chile
 *
 * Fuentes:
 * - Ubersuggest Chile 2025 (baseline CPC Chile en CLP)
 * - WordStream 2026 (CPC USD global por industria)
 * - Get-Ryze 2026 (CPC USD global + Meta)
 * - Adamigo 2026 (factores por país LATAM)
 */

import { getCPCCalibrado, getCPCData } from './cpc-calibrado-chile'
import { getCountry, convertUSDtoLocal } from './latam-countries-2026'

// CPC USD 2026 por industria (WordStream/Get-Ryze/DigitalApplied 2026)
// Usado como referencia global y para países sin data local
const CPC_USD_2026: Record<string, { google_search: number; google_display: number; meta: number }> = {
  ECOMMERCE:                { google_search: 1.16, google_display: 0.28, meta: 0.67 },
  INMOBILIARIA:             { google_search: 2.81, google_display: 0.44, meta: 0.95 },
  TURISMO:                  { google_search: 1.63, google_display: 0.31, meta: 0.61 },
  GASTRONOMIA:              { google_search: 1.84, google_display: 0.34, meta: 0.52 },
  AUTOMOTRIZ:               { google_search: 2.46, google_display: 0.39, meta: 0.89 },
  SALUD_MEDICINA:           { google_search: 2.62, google_display: 0.63, meta: 2.71 },
  EDUCACION:                { google_search: 3.12, google_display: 0.47, meta: 1.06 },
  MODA_RETAIL:              { google_search: 4.44, google_display: 0.45, meta: 0.45 },
  FINTECH:                  { google_search: 3.08, google_display: 0.51, meta: 3.77 },
  SERVICIOS_LEGALES:        { google_search: 6.75, google_display: 0.72, meta: 3.45 },
  BELLEZA_PERSONAL:         { google_search: 4.62, google_display: 0.48, meta: 1.81 },
  TECNOLOGIA_SAAS:          { google_search: 3.33, google_display: 0.52, meta: 2.52 },
  CONSTRUCCION_REMODELACION:{ google_search: 5.21, google_display: 0.59, meta: 1.62 },
  DEPORTES_FITNESS:         { google_search: 1.90, google_display: 0.38, meta: 1.90 },
  VETERINARIA_MASCOTAS:     { google_search: 4.06, google_display: 0.42, meta: 0.75 },
  MANUFACTURA_INDUSTRIAL:   { google_search: 4.18, google_display: 0.54, meta: 2.10 },
  LOGISTICA_TRANSPORTE:     { google_search: 4.90, google_display: 0.56, meta: 1.80 },
  SEGUROS:                  { google_search: 6.22, google_display: 0.68, meta: 2.98 },
  AGRICULTURA_AGROINDUSTRIA:{ google_search: 4.90, google_display: 0.56, meta: 1.50 },
  SERVICIOS_PROFESIONALES:  { google_search: 4.90, google_display: 0.56, meta: 2.00 },
  ENERGIA_UTILITIES:        { google_search: 4.18, google_display: 0.54, meta: 2.30 },
  HOGAR_DECORACION:         { google_search: 2.94, google_display: 0.60, meta: 0.73 },
}

/**
 * Obtiene CPC para una industria en un país específico
 *
 * Para Chile: usa Ubersuggest (más preciso) como base
 * Para otros países: toma CPC USD global × factor país × exchange rate
 *
 * @param industria - Código de industria
 * @param countryCode - Código país (CL, MX, CO, AR, BR, PE)
 * @param platform - google_search | google_display | meta
 * @returns CPC en moneda local del país
 */
export function getCPCForCountry(
  industria: string,
  countryCode: string = 'CL',
  platform: 'google_search' | 'google_display' | 'meta' = 'google_search'
): number {
  const country = getCountry(countryCode)
  const usdData = CPC_USD_2026[industria]

  if (countryCode === 'CL') {
    // Chile: Ubersuggest data para Google Search (más preciso)
    if (platform === 'google_search') {
      return getCPCCalibrado(industria)
    }
    // Display y Meta: calcular desde USD
    if (!usdData) return getCPCCalibrado(industria)
    return Math.round(usdData[platform] * country.usd_exchange_rate)
  }

  // Otros países: USD global × factor país × exchange rate
  if (!usdData) return 250 * country.usd_exchange_rate / 935  // fallback
  const cpcUSD = usdData[platform]
  const factor = platform === 'meta' ? country.meta_cpc_factor : country.google_cpc_factor
  return Math.round(cpcUSD * factor * country.usd_exchange_rate)
}

/**
 * Obtiene CPCs comparativos entre países para una industria
 * Útil para mostrar "en México tu presupuesto rinde X% más"
 */
export function getCPCComparison(
  industria: string,
  platform: 'google_search' | 'meta' = 'google_search'
): { code: string; name: string; flag: string; cpc_local: number; cpc_usd: number; vs_chile: number }[] {
  const countryCodes = ['CL', 'MX', 'CO', 'AR', 'BR', 'PE']
  const chileCPC_USD = getCPCForCountry(industria, 'CL', platform) / 935

  return countryCodes.map(code => {
    const country = getCountry(code)
    const cpcLocal = getCPCForCountry(industria, code, platform)
    const cpcUSD = cpcLocal / country.usd_exchange_rate
    const vsChile = +((cpcUSD / chileCPC_USD - 1) * 100).toFixed(1)

    return {
      code: country.code,
      name: country.name,
      flag: country.flag,
      cpc_local: cpcLocal,
      cpc_usd: +cpcUSD.toFixed(2),
      vs_chile: vsChile
    }
  })
}

/**
 * Obtiene CPC USD 2026 global (sin ajuste de país) para referencia
 */
export function getCPCGlobal2026(industria: string): typeof CPC_USD_2026[string] | null {
  return CPC_USD_2026[industria] || null
}
