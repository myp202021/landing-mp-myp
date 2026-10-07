/**
 * Campañas TEST de Meta gestionadas por Claude (octubre 2026).
 * Sus leads van al cliente "M&P · TEST Claude (Meta)" (no al cliente M&P que ve Arturo)
 * y avisan solo a Christopher.
 */

export const TEST_CLAUDE_CLIENTE_ID = 'db2bd241-6a62-497b-a7b9-aac9229913be'

export const TEST_CLAUDE_NOTA = 'CAMPAÑA TEST (Claude) — la gestiona Christopher, no Arturo'

export const TEST_CLAUDE_AVISO = 'christopher@mulleryperez.cl'

/** Formularios instantáneos de las campañas TEST (form_id → variante). */
export const TEST_CLAUDE_FORMS: Record<string, 'A' | 'B'> = {}

/** Devuelve 'A' | 'B' si el lead viene de una campaña TEST de Claude, por formulario o por nombre. */
export function varianteTestClaude(...textos: (string | null | undefined)[]): 'A' | 'B' | null {
  for (const t of textos) {
    if (!t) continue
    const id = String(t).trim()
    if (TEST_CLAUDE_FORMS[id]) return TEST_CLAUDE_FORMS[id]
    const m = id.match(/TEST\s*Claude\s*([AB])\b/i)
    if (m) return m[1].toUpperCase() as 'A' | 'B'
  }
  return null
}

export function fuenteTestClaude(v: 'A' | 'B') {
  return `Meta — Campaña TEST Claude ${v}`
}
