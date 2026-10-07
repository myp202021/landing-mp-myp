import crypto from 'crypto'
import type { NextRequest } from 'next/server'
import { MP_CLIENTE_ID } from '@/lib/crm/leads-pipeline'

/**
 * Sesión de servidor del CRM (cookie httpOnly firmada), para rutas API con datos sensibles.
 * El resto del CRM sigue usando el usuario en localStorage; esta cookie se emite en /api/auth/login.
 * Secreto: CRM_SESSION_SECRET o, si no existe, derivado de SUPABASE_SERVICE_ROLE_KEY (solo servidor).
 */
export const CRM_COOKIE = 'crm_sess'
const DIAS = 30

export interface SesionCRM {
  id: string
  role: string
  cliente_id: string | null
  exp: number
}

function secreto(): string {
  const base = process.env.CRM_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return crypto.createHash('sha256').update('crm-sess:' + base).digest('hex')
}

function firma(payload: string): string {
  return crypto.createHmac('sha256', secreto()).update(payload).digest('base64url')
}

export function crearCookieSesion(u: { id: string; role: string; cliente_id?: string | null }) {
  const s: SesionCRM = { id: String(u.id), role: u.role, cliente_id: u.cliente_id || null, exp: Date.now() + DIAS * 864e5 }
  const payload = Buffer.from(JSON.stringify(s)).toString('base64url')
  return {
    name: CRM_COOKIE,
    value: payload + '.' + firma(payload),
    options: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: DIAS * 86400 },
  }
}

export function leerSesion(req: NextRequest): SesionCRM | null {
  const v = req.cookies.get(CRM_COOKIE)?.value
  if (!v) return null
  const [payload, sig] = v.split('.')
  if (!payload || !sig) return null
  const esperada = firma(payload)
  const a = Buffer.from(sig), b = Buffer.from(esperada)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString()) as SesionCRM
    return s.exp > Date.now() ? s : null
  } catch {
    return null
  }
}

/** Admin o comercial de M&P (equipo asociado al cliente M&P). Mismo criterio que esComercial(). */
export function esAdminOComercial(s: SesionCRM | null): boolean {
  return !!s && (s.role === 'admin' || (s.role === 'equipo' && s.cliente_id === MP_CLIENTE_ID))
}
