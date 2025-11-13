/**
 * AUTH LOGOUT API
 * POST: Cerrar sesión
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true })

  // Eliminar cookie de sesión
  response.cookies.delete('mp_session')

  return response
}
