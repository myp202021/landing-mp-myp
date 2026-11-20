import { NextResponse } from 'next/server'
import { supabaseServidor } from '@/lib/reportes/servidor'
import { esSlug } from '@/lib/reportes/areas'

// Enlace de acceso de un solo uso (sin escribir contraseña). Lo genera M&P con la clave de servicio
// (auth.admin.generateLink type 'magiclink') y se arma: /clientes/acceso?t=<hashed_token>&a=<slug opcional>.
// El token vence y sirve una sola vez.
export async function GET(request: Request) {
  const u = new URL(request.url)
  const t = u.searchParams.get('t') || ''
  const a = u.searchParams.get('a') || ''
  const destino = esSlug(a) ? '/' + a : '/admin-reportes'
  if (t) await supabaseServidor().auth.verifyOtp({ token_hash: t, type: 'magiclink' })
  return NextResponse.redirect(new URL(destino, request.url), { status: 303 })
}
