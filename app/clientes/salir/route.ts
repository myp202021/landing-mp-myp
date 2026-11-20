import { NextResponse } from 'next/server'
import { supabaseServidor } from '@/lib/reportes/servidor'

export async function POST(request: Request) {
  await supabaseServidor().auth.signOut()
  return NextResponse.redirect(new URL('/clientes/login', request.url), { status: 303 })
}
