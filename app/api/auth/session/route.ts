/**
 * AUTH SESSION API
 * GET: Obtener sesión actual del usuario
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('mp_session')

    if (!sessionCookie) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    const session = JSON.parse(sessionCookie.value)

    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        rol: session.rol,
        cliente_id: session.clienteId
      }
    })

  } catch (error: any) {
    console.error('Error leyendo sesión:', error)
    return NextResponse.json(
      { user: null },
      { status: 200 }
    )
  }
}
