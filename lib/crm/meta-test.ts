import { MP_CLIENTE_ID } from '@/lib/crm/leads-pipeline'

/**
 * Campañas TEST de Meta de Christopher, operadas por Claude (octubre 2026).
 * Criterio (Christopher, 7 oct): el CRM es uno solo → sus leads entran al cliente M&P (Arturo los ve),
 * marcados como campaña de Christopher; el aviso por correo va solo a Christopher y no se asignan a Arturo.
 */

export const TEST_CLAUDE_CLIENTE_ID = MP_CLIENTE_ID

/** Cliente separado usado hasta el 7 oct (quedó vacío; se mantiene solo como referencia). */
export const TEST_CLAUDE_CLIENTE_ID_ANTIGUO = 'db2bd241-6a62-497b-a7b9-aac9229913be'

export const TEST_CLAUDE_NOTA = 'Campaña TEST de Christopher — la gestiona Christopher'

export const TEST_CLAUDE_BADGE = 'Campaña TEST de Christopher'

/** true si el lead viene de las campañas TEST de Christopher (por fuente, campaña o nota). */
export function esLeadTestChristopher(l: { fuente?: string | null; campana_nombre?: string | null; notas?: string | null }): boolean {
  return /TEST\s*Claude/i.test(l.fuente || '') || /TEST\s*Claude/i.test(l.campana_nombre || '') || /campa[ñn]a\s*TEST/i.test(l.notas || '')
}

export const TEST_CLAUDE_AVISO = 'christopher@mulleryperez.cl'

/** Formularios instantáneos de las campañas TEST (form_id → variante). */
export const TEST_CLAUDE_FORMS: Record<string, 'A' | 'B'> = {
  '1405287565120379': 'A', // TEST Claude A — Boost SEO + IA — Formulario
  '28954715627524107': 'B', // TEST Claude B — Diagnóstico IA — Formulario
}

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
