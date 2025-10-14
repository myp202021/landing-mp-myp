/**
 * Calcula percentiles de un array de números
 */
export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0

  const sorted = [...values].sort((a, b) => a - b)
  const index = (percentile / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower

  if (lower === upper) {
    return sorted[lower]
  }

  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

/**
 * Calcula mediana (igual a percentil 50)
 */
export function calculateMedian(values: number[]): number {
  return calculatePercentile(values, 50)
}

/**
 * Calcula quartiles (p25, median, p75) para un array de valores
 */
export function calculateQuartiles(values: number[]): {
  p25: number
  median: number
  p75: number
} {
  return {
    p25: calculatePercentile(values, 25),
    median: calculatePercentile(values, 50),
    p75: calculatePercentile(values, 75),
  }
}

/**
 * Determina en qué percentil está un valor dado dentro de un array
 */
export function getValuePercentile(value: number, values: number[]): number {
  if (values.length === 0) return 50

  const sorted = [...values].sort((a, b) => a - b)
  const position = sorted.findIndex(v => v >= value)

  if (position === -1) return 100 // Mejor que todos
  if (position === 0) return 0 // Peor que todos

  return (position / sorted.length) * 100
}

/**
 * Determina la posición categórica del usuario basado en su percentil
 */
export function getUserPosition(
  percentile: number
): 'TOP_10' | 'ABOVE_AVG' | 'AVERAGE' | 'BELOW_AVG' | 'BOTTOM_10' {
  if (percentile <= 10) return 'TOP_10'
  if (percentile <= 40) return 'ABOVE_AVG'
  if (percentile <= 60) return 'AVERAGE'
  if (percentile <= 90) return 'BELOW_AVG'
  return 'BOTTOM_10'
}
