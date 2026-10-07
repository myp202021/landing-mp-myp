import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'

/**
 * Clave de los webhooks de Zapier (Meta Lead Ads → CRM).
 * Los Zaps la envían como ?key=... en la URL. En el repo solo va la huella SHA-256
 * (el repo es público); la clave está en .env.local (ZAPIER_WEBHOOK_KEY) y en la memoria de Claude.
 *
 * ESTRICTO = false: acepta envíos sin clave (transición mientras se actualizan los Zaps).
 * Una vez que todos los Zaps envían la clave, pasar a true.
 */
const HUELLA_CLAVE = 'a4fd093fdc010c2b3f0e8a510af69f0fbc76d2307c8cd596b4ca15b1982b73ab'
const ESTRICTO = false

export function claveZapierValida(req: NextRequest): { ok: boolean; motivo?: string } {
  const clave = req.nextUrl.searchParams.get('key') || req.headers.get('x-webhook-key') || ''
  if (clave) {
    const huella = createHash('sha256').update(clave).digest('hex')
    return huella === HUELLA_CLAVE ? { ok: true } : { ok: false, motivo: 'Clave de webhook inválida' }
  }
  if (!ESTRICTO) {
    console.warn('⚠️ Webhook de Zapier sin clave (aceptado en modo transición):', req.nextUrl.pathname)
    return { ok: true }
  }
  return { ok: false, motivo: 'Falta la clave del webhook (?key=)' }
}
