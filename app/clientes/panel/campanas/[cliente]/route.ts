// Panel de campañas y ventas del sitio por cliente: HTML autocontenido en Storage privado (reportes-seo/<cliente>/campanas.json).
// Solo usuarios con acceso a esa área o superadmin. noindex, sin caché.
import { NextResponse } from 'next/server'
import { accesoActual, leerCampanas, puedeVer } from '@/lib/reportes/servidor'
import { AREAS } from '@/lib/reportes/areas'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { cliente: string } }) {
  const cliente = params.cliente
  if (!AREAS[cliente]) return new NextResponse('No encontrado', { status: 404 })
  const acceso = await accesoActual()
  if (!acceso) return NextResponse.redirect(new URL('/' + cliente, req.url))
  if (!puedeVer(acceso, cliente)) return new NextResponse('Sin acceso', { status: 403 })
  const datos = await leerCampanas(cliente)
  if (!datos) return new NextResponse('Panel en preparación', { status: 503 })
  return new NextResponse(datos.html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  })
}
