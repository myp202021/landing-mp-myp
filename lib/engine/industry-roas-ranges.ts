// @ts-nocheck
/**
 * RANGOS DE ROAS ESPERADOS POR INDUSTRIA
 *
 * Basados en data de mercado 2026 (WordStream, Get-Ryze, M&P data propia).
 * Un resultado fuera de estos rangos es una desviación que necesita calibración.
 *
 * Regla: a mayor ticket → ROAS puede ser más alto (pero capeado por roas_maximo del benchmark).
 * A menor ticket → ROAS tiende a ser más bajo.
 */

export interface ROASRange {
  min: number      // ROAS mínimo razonable (por debajo = campaña no viable)
  tipico: number   // ROAS mediana esperada
  max: number      // ROAS máximo realista (por encima = modelo sobreestima)
  fuente: string
}

export const ROAS_RANGES: Record<string, ROASRange> = {
  // TICKET BAJO (<$100K): ROAS modesto
  GASTRONOMIA:              { min: 0.5, tipico: 1.5, max: 4.0, fuente: 'Ticket bajo ($15-20K), decisión rápida, alta competencia local' },
  BELLEZA_PERSONAL:         { min: 0.5, tipico: 1.5, max: 5.0, fuente: 'Ticket bajo ($30-40K), alta CVR, volumen' },
  DEPORTES_FITNESS:         { min: 0.3, tipico: 1.0, max: 4.0, fuente: 'Ticket bajo ($50K), membresías, churn alto' },
  VETERINARIA_MASCOTAS:     { min: 0.5, tipico: 2.0, max: 5.0, fuente: 'Ticket bajo ($40K), alta CVR (16%), fidelidad' },

  // TICKET MEDIO-BAJO ($50K-$200K): ROAS moderado
  ECOMMERCE:                { min: 1.5, tipico: 4.0, max: 8.0, fuente: 'WordStream Shopping/Apparel 2026, ROAS benchmark 2.5-4x' },
  MODA_RETAIL:              { min: 1.5, tipico: 4.0, max: 8.0, fuente: 'Similar a ecommerce general' },
  HOGAR_DECORACION:         { min: 1.0, tipico: 3.0, max: 8.0, fuente: 'E-commerce, ticket medio $100K' },
  SALUD_MEDICINA:           { min: 0.8, tipico: 2.5, max: 6.0, fuente: 'Physicians CVR 12.43%, ticket variable' },

  // TICKET MEDIO ($200K-$1M): ROAS medio-alto
  TURISMO:                  { min: 1.0, tipico: 3.0, max: 8.0, fuente: 'Ticket $250K, CVR 5.83%, estacionalidad' },
  EDUCACION:                { min: 2.0, tipico: 5.0, max: 10.0, fuente: 'CVR 13.14% (más alto), ticket $500K' },
  SEGUROS:                  { min: 0.3, tipico: 1.5, max: 5.0, fuente: 'CPC alto ($520), CVR 2.64%, competencia intensa' },
  FINTECH:                  { min: 0.3, tipico: 1.5, max: 5.0, fuente: 'CPC $479, CVR 2.64%, ticket variable' },

  // TICKET ALTO ($1M-$5M): ROAS puede ser alto
  TECNOLOGIA_SAAS:          { min: 1.0, tipico: 3.0, max: 8.0, fuente: 'CPC bajo ($39), LTV alto, ciclo largo B2B' },
  SERVICIOS_LEGALES:        { min: 1.5, tipico: 4.0, max: 10.0, fuente: 'Ticket $2M, CVR 5.55%, alto valor por caso' },
  SERVICIOS_PROFESIONALES:  { min: 1.0, tipico: 3.0, max: 8.0, fuente: 'B2B, ticket $800K, ciclo medio' },
  LOGISTICA_TRANSPORTE:     { min: 1.0, tipico: 3.0, max: 8.0, fuente: 'B2B, ticket $1M, contratos recurrentes' },
  CONSTRUCCION_REMODELACION:{ min: 1.0, tipico: 3.0, max: 8.0, fuente: 'Ticket $3M, ciclo largo, local' },

  // TICKET MUY ALTO (>$5M): ROAS capeado
  INMOBILIARIA:             { min: 2.0, tipico: 5.0, max: 8.0, fuente: 'Ticket $150M pero tasa cierre <1%, ciclo 3-6 meses' },
  AUTOMOTRIZ:               { min: 2.0, tipico: 6.0, max: 12.0, fuente: 'Ticket $18M, tasa cierre 1%, concesionarios' },
  MANUFACTURA_INDUSTRIAL:   { min: 1.0, tipico: 4.0, max: 10.0, fuente: 'B2B, ticket $10M, contratos grandes, ciclo largo' },
  ENERGIA_UTILITIES:        { min: 1.0, tipico: 3.0, max: 8.0, fuente: 'B2B/B2G, ticket $5M, licitaciones' },
  AGRICULTURA_AGROINDUSTRIA:{ min: 1.0, tipico: 3.0, max: 8.0, fuente: 'B2B, ticket $3M, estacional' },
}

/**
 * Obtiene el rango ROAS esperado para una industria.
 * Retorna null si la industria no existe.
 */
export function getROASRange(industria: string): ROASRange | null {
  return ROAS_RANGES[industria] || null
}

/**
 * Evalúa si un ROAS está dentro del rango esperado.
 */
export function evaluateROAS(industria: string, roas: number): {
  status: 'OK' | 'MUY_BAJO' | 'MUY_ALTO' | 'MARGINAL'
  detail: string
} {
  const range = ROAS_RANGES[industria]
  if (!range) return { status: 'OK', detail: 'Sin rango definido' }

  if (roas > range.max * 1.2) return { status: 'MUY_ALTO', detail: `${roas.toFixed(1)}x > max ${range.max}x` }
  if (roas < range.min * 0.8) return { status: 'MUY_BAJO', detail: `${roas.toFixed(1)}x < min ${range.min}x` }
  if (roas < range.min) return { status: 'MARGINAL', detail: `${roas.toFixed(1)}x cerca del mínimo ${range.min}x` }
  return { status: 'OK', detail: `${roas.toFixed(1)}x dentro de [${range.min}x, ${range.max}x]` }
}
