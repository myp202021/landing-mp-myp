import { NextResponse } from 'next/server'
import { supabaseServidor } from '@/lib/reportes/servidor'
import { esSlug } from '@/lib/reportes/areas'

// Cierra la sesión y vuelve al login de la misma área (/<slug>) o al del índice
export async function POST(request: Request) {
  await supabaseServidor().auth.signOut()
  const area = String((await request.formData().catch(() => null))?.get('area') || '')
  return NextResponse.redirect(new URL(esSlug(area) ? '/' + area : '/admin-reportes', request.url), { status: 303 })
}
