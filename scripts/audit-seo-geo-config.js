/**
 * AUDIT SEO + GEO — Configuracion
 * Pesos, umbrales, bots IA, schemas requeridos, scoring
 *
 * CommonJS — Node 18+ con fetch nativo
 */

// ---------------------------------------------------------------------------
// 1. Pesos por categoria (suman 100)
// ---------------------------------------------------------------------------
const CATEGORY_WEIGHTS = {
  seoTecnico: 0.30,   // 30 %
  contenido: 0.25,     // 25 %
  performance: 0.20,   // 20 %
  geo: 0.25,           // 25 %
}

// ---------------------------------------------------------------------------
// 2. Umbrales
// ---------------------------------------------------------------------------
const THRESHOLDS = {
  title: { min: 50, max: 60 },
  description: { min: 150, max: 160 },
  fcp: 1.8,   // segundos
  lcp: 2.5,   // segundos
  cls: 0.1,
  tbt: 200,   // ms
  wordCountMin: 300,
  internalLinksMin: 3,
  altCoveragePct: 90,
  redirectHopsMax: 2,
  dateModifiedMonths: 6,
}

// ---------------------------------------------------------------------------
// 3. Bots IA que NO deben estar bloqueados
// ---------------------------------------------------------------------------
const AI_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'CCBot',
  'PerplexityBot',
  'Google-Extended',
  'Anthropic-ai',
  'Bytespider',
]

// ---------------------------------------------------------------------------
// 4. Schemas GEO requeridos
// ---------------------------------------------------------------------------
const REQUIRED_GEO_SCHEMAS = [
  'knowsAbout',
  'isSimilarTo',
  'FAQPage',
  'Speakable',
]

// ---------------------------------------------------------------------------
// 5. Scoring normalizado (0-100 por categoria)
// ---------------------------------------------------------------------------

/**
 * Normaliza un conjunto de checks a un score 0-100
 * @param {Array<{score: number, maxScore: number}>} checks
 * @returns {number} score 0-100
 */
function normalizeCategory(checks) {
  if (!checks || checks.length === 0) return 0
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0)
  const totalMax = checks.reduce((sum, c) => sum + c.maxScore, 0)
  if (totalMax === 0) return 0
  return Math.round((totalScore / totalMax) * 100)
}

// ---------------------------------------------------------------------------
// 6. Score global ponderado
// ---------------------------------------------------------------------------

/**
 * Calcula el score global ponderado a partir de scores por categoria
 * @param {{ seoTecnico: number, contenido: number, performance: number, geo: number }} categoryScores
 *   Cada valor es 0-100
 * @returns {number} score global 0-100
 */
function calculateGlobalScore(categoryScores) {
  const weighted =
    (categoryScores.seoTecnico || 0) * CATEGORY_WEIGHTS.seoTecnico +
    (categoryScores.contenido || 0) * CATEGORY_WEIGHTS.contenido +
    (categoryScores.performance || 0) * CATEGORY_WEIGHTS.performance +
    (categoryScores.geo || 0) * CATEGORY_WEIGHTS.geo

  return Math.round(weighted)
}

/**
 * Determina la etiqueta de status global
 * @param {number} score 0-100
 * @returns {'excelente'|'bueno'|'mejorable'|'critico'}
 */
function globalStatus(score) {
  if (score >= 90) return 'excelente'
  if (score >= 70) return 'bueno'
  if (score >= 50) return 'mejorable'
  return 'critico'
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  CATEGORY_WEIGHTS,
  THRESHOLDS,
  AI_BOTS,
  REQUIRED_GEO_SCHEMAS,
  normalizeCategory,
  calculateGlobalScore,
  globalStatus,
}
