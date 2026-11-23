// Panel Merlin: HTML autocontenido (lib/merlin/plantilla.ts) + datos privados de Storage. Solo usuarios con acceso al área «merlin» o superadmin.
import { NextResponse } from 'next/server'
import { accesoActual, leerPanelMerlin, puedeVer } from '@/lib/reportes/servidor'
import { PLANTILLA } from '@/lib/merlin/plantilla'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const acceso = await accesoActual()
  if (!acceso) return NextResponse.redirect(new URL('/merlin', req.url))
  if (!puedeVer(acceso, 'merlin')) return new NextResponse('Sin acceso', { status: 403 })
  const datos = await leerPanelMerlin()
  if (!datos) return new NextResponse('Panel en preparación', { status: 503 })
  const html = PLANTILLA.replace('/*DATA*/', JSON.stringify(datos).replace(/</g, '\\u003c'))
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  })
}
