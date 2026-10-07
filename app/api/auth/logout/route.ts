/**
 * AUTH LOGOUT API
 * POST: Cerrar sesión (cookie legacy mp_session + cookie de sesión del CRM)
 */

import { NextResponse } from 'next/server'
import { CRM_COOKIE } from '@/lib/crm/session'

export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Eliminar cookies de sesión
  response.cookies.delete('mp_session')
  response.cookies.set(CRM_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })

  return response
}
