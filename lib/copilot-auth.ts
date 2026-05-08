import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Genera un token de sesión seguro y lo guarda en Supabase.
 * Retorna el valor de cookie: "subId:token"
 */
export async function createSessionToken(subId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  await supabase
    .from('clipping_suscripciones')
    .update({ session_token: token })
    .eq('id', subId)
  return subId + ':' + token
}

/**
 * Verifica que el cookie de sesión sea válido contra la DB.
 * Retorna el subId si válido, null si inválido.
 */
export async function verifySessionToken(request: NextRequest): Promise<string | null> {
  const cookie = request.cookies.get('copilot_session')
  if (!cookie || !cookie.value) return null

  const parts = cookie.value.split(':')
  if (parts.length < 2) return null

  const subId = parts[0]
  const token = parts.slice(1).join(':') // por si el token tiene ':'
  if (!subId || !token) return null

  const { data } = await supabase
    .from('clipping_suscripciones')
    .select('id, session_token')
    .eq('id', subId)
    .single()

  if (!data || data.session_token !== token) return null

  return subId
}

/**
 * Verifica sesión + ownership (que el subId del cookie coincida con el ID de la URL).
 * Para rutas API que reciben un subId como parámetro.
 * Retorna true si autorizado.
 */
export async function verifyOwnership(request: NextRequest, urlSubId: string): Promise<boolean> {
  const sessionSubId = await verifySessionToken(request)
  if (!sessionSubId) return false
  return sessionSubId === urlSubId
}

/**
 * Cookie options consistentes para toda la app
 */
export function cookieOptions(maxAgeDays: number = 30) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeDays * 24 * 60 * 60,
  }
}
