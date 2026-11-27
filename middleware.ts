import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { sesionReportes } from '@/lib/reportes/middleware'
import { esRutaReportes } from '@/lib/reportes/areas'

// WordPress/LinkedIn legacy query params that cause redirect loops
const STRIP_PARAMS = ['page_id', 'trk', 'p', 'm', 'cat', 's', 'attachment_id', 'layout_sidebar']

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // ═══ REPORTES SEO Y GEO: /clientes/* con login (Supabase Auth), noindex ═══
  // Ojo: /clientes/*.png|webp|svg son logos públicos del home (public/clientes): esos NO pasan por el login
  // Áreas de clientes en la raíz (/<slug> de la lista cerrada en lib/reportes/areas.ts) e índice /admin-reportes
  // Índices internos fuera de la web (Christopher, 27 nov 2026): no existen para nadie, ni con sesión
  if (/^\/(admin-reportes|admin-finanzas|clientes|clientes\/finanzas)\/?$/.test(pathname)) {
    return new NextResponse('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } })
  }
  if (esRutaReportes(pathname) && !/\.[a-z0-9]+$/i.test(pathname)) {
    return sesionReportes(request)
  }

  // ═══ COPILOT AUTH: helper para verificar sesión + ownership ═══
  function verifyCopilotSession(request: NextRequest, pathname: string, prefix: string): NextResponse | null {
    const session = request.cookies.get('copilot_session')
    if (!session || !session.value) {
      return NextResponse.redirect(new URL('/copilot/login', request.url))
    }
    const parts = session.value.split(':')
    if (parts.length < 2) {
      return NextResponse.redirect(new URL('/copilot/login', request.url))
    }
    const sessionSubId = parts[0]
    const urlId = pathname.replace(prefix, '').split('/')[0]
    if (urlId && sessionSubId && urlId !== sessionSubId) {
      return NextResponse.redirect(new URL(prefix + sessionSubId, request.url))
    }
    return null // OK — continuar
  }

  // ═══ COPILOT AUTH: proteger /copilot/dashboard/* ═══
  if (pathname.startsWith('/copilot/dashboard/')) {
    const result = verifyCopilotSession(request, pathname, '/copilot/dashboard/')
    if (result) return result
  }

  // ═══ COPILOT AUTH: proteger /copilot/configurar/* ═══
  if (pathname.startsWith('/copilot/configurar/')) {
    const result = verifyCopilotSession(request, pathname, '/copilot/configurar/')
    if (result) return result
  }

  // ═══ COPILOT AUTH: proteger /copilot/contratar/* ═══
  if (pathname.startsWith('/copilot/contratar/')) {
    const result = verifyCopilotSession(request, pathname, '/copilot/contratar/')
    if (result) return result
  }

  // ═══ COPILOT AUTH: proteger /copilot/admin ═══
  if (pathname === '/copilot/admin') {
    const session = request.cookies.get('copilot_session')
    const crmCookie = request.cookies.get('mp_session')
    const isCrm = crmCookie && crmCookie.value === 'myp2025'
    if (!session && !isCrm) {
      return NextResponse.redirect(new URL('/copilot/login', request.url))
    }
  }

  // ═══ LEGACY PARAMS: strip WordPress/LinkedIn junk ═══
  const hasLegacyParam = STRIP_PARAMS.some(param => searchParams.has(param))
  if (hasLegacyParam) {
    const url = request.nextUrl.clone()
    STRIP_PARAMS.forEach(param => url.searchParams.delete(param))
    const hadBlogParam = searchParams.has('m') || searchParams.has('cat')
    if (hadBlogParam && url.pathname === '/') {
      url.pathname = '/blog'
    }
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
