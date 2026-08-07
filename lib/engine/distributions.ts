/**
 * DISTRIBUCIONES ESTADÍSTICAS — Sampling para Monte Carlo
 *
 * LogNormal: para CPC (bounded at 0, right-skewed)
 * Beta: para CTR y CVR (bounded [0,1])
 *
 * Implementación sin dependencias externas.
 * PRNG seedeado para reproducibilidad.
 */

// ═══════════════════════════════════════════════════════════════════
// PRNG SEEDEADO — Mulberry32
// ═══════════════════════════════════════════════════════════════════

export class SeededRNG {
  private state: number

  constructor(seed: number) {
    this.state = seed
  }

  /** Retorna un float en [0, 1) */
  next(): number {
    this.state |= 0
    this.state = (this.state + 0x6D2B79F5) | 0
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  /** Box-Muller: genera un par de normales estándar N(0,1) */
  normalPair(): [number, number] {
    const u1 = this.next()
    const u2 = this.next()
    const r = Math.sqrt(-2 * Math.log(u1))
    const theta = 2 * Math.PI * u2
    return [r * Math.cos(theta), r * Math.sin(theta)]
  }

  /** Normal(mu, sigma) */
  normal(mu: number, sigma: number): number {
    const [z] = this.normalPair()
    return mu + sigma * z
  }
}

// ═══════════════════════════════════════════════════════════════════
// LOGNORMAL — Para CPC
// ═══════════════════════════════════════════════════════════════════

export interface LogNormalParams {
  mu: number    // location (log-scale mean)
  sigma: number // spread (log-scale std dev)
}

/**
 * Crea parámetros LogNormal desde una mediana observada y sigma.
 * Para LogNormal, la mediana = exp(mu), así que mu = ln(mediana).
 */
export function logNormalFromMedian(median: number, sigma: number): LogNormalParams {
  return {
    mu: Math.log(median),
    sigma
  }
}

/**
 * Samplea de una distribución LogNormal.
 * X ~ LogNormal(mu, sigma) ↔ ln(X) ~ Normal(mu, sigma)
 */
export function sampleLogNormal(rng: SeededRNG, params: LogNormalParams): number {
  const z = rng.normal(0, 1)
  return Math.exp(params.mu + params.sigma * z)
}

/**
 * Percentiles teóricos de LogNormal (para validación).
 */
export function logNormalPercentile(params: LogNormalParams, p: number): number {
  // Inversa normal estándar aproximada (Beasley-Springer-Moro)
  const z = invNormalCDF(p)
  return Math.exp(params.mu + params.sigma * z)
}

// ═══════════════════════════════════════════════════════════════════
// BETA — Para CTR y CVR
// ═══════════════════════════════════════════════════════════════════

export interface BetaParams {
  alpha: number
  beta: number
}

/**
 * Crea parámetros Beta desde media y coeficiente de variación.
 *
 * @param mean - Media de la tasa (ej: 0.041 para CTR 4.1%)
 * @param cv - Coeficiente de variación (0.40 para CTR, 0.50 para CVR)
 */
export function betaFromMeanCV(mean: number, cv: number): BetaParams {
  // Clampear mean para evitar problemas numéricos
  const m = Math.max(0.001, Math.min(0.999, mean))
  const variance = (m * cv) ** 2

  // Asegurar que variance < m*(1-m) (requisito Beta)
  const maxVariance = m * (1 - m) * 0.99
  const v = Math.min(variance, maxVariance)

  const common = m * (1 - m) / v - 1
  const alpha = m * common
  const beta = (1 - m) * common

  return {
    alpha: Math.max(alpha, 0.5), // Floor para estabilidad
    beta: Math.max(beta, 0.5)
  }
}

/**
 * Samplea de una distribución Beta usando el método Gamma.
 * Beta(a,b) = Gamma(a,1) / (Gamma(a,1) + Gamma(b,1))
 */
export function sampleBeta(rng: SeededRNG, params: BetaParams): number {
  const x = sampleGamma(rng, params.alpha)
  const y = sampleGamma(rng, params.beta)
  return x / (x + y)
}

/**
 * Samplea de Gamma(shape, 1) usando el algoritmo de Marsaglia & Tsang.
 */
function sampleGamma(rng: SeededRNG, shape: number): number {
  if (shape < 1) {
    // Para shape < 1: Gamma(a) = Gamma(a+1) * U^(1/a)
    const u = rng.next()
    return sampleGamma(rng, shape + 1) * Math.pow(u, 1 / shape)
  }

  const d = shape - 1 / 3
  const c = 1 / Math.sqrt(9 * d)

  while (true) {
    let x: number
    let v: number

    do {
      x = rng.normal(0, 1)
      v = 1 + c * x
    } while (v <= 0)

    v = v * v * v
    const u = rng.next()

    if (u < 1 - 0.0331 * (x * x) * (x * x)) {
      return d * v
    }

    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      return d * v
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════

/**
 * Inversa aproximada de la CDF normal estándar.
 * Algoritmo de Beasley-Springer-Moro.
 */
function invNormalCDF(p: number): number {
  const a = [
    -3.969683028665376e+01, 2.209460984245205e+02,
    -2.759285104469687e+02, 1.383577518672690e+02,
    -3.066479806614716e+01, 2.506628277459239e+00
  ]
  const b = [
    -5.447609879822406e+01, 1.615858368580409e+02,
    -1.556989798598866e+02, 6.680131188771972e+01,
    -1.328068155288572e+01
  ]
  const c = [
    -7.784894002430293e-03, -3.223964580411365e-01,
    -2.400758277161838e+00, -2.549732539343734e+00,
    4.374664141464968e+00, 2.938163982698783e+00
  ]
  const d = [
    7.784695709041462e-03, 3.224671290700398e-01,
    2.445134137142996e+00, 3.754408661907416e+00
  ]

  const pLow = 0.02425
  const pHigh = 1 - pLow

  let q: number, r: number

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p))
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  } else if (p <= pHigh) {
    q = p - 0.5
    r = q * q
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
           (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p))
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
}

/**
 * Calcula percentiles de un array ordenado.
 */
export function percentile(sortedArr: number[], p: number): number {
  const index = (p / 100) * (sortedArr.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight
}

/**
 * Ordena un array in-place y extrae múltiples percentiles.
 */
export function extractPercentiles(
  arr: number[],
  percentiles: number[] = [5, 25, 50, 75, 95]
): Record<string, number> {
  arr.sort((a, b) => a - b)
  const result: Record<string, number> = {}
  for (const p of percentiles) {
    result[`p${p}`] = percentile(arr, p)
  }
  return result
}
