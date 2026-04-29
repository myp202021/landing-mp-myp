import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// WordPress/LinkedIn legacy query params that cause redirect loops
const STRIP_PARAMS = ['page_id', 'trk', 'p', 'm', 'cat', 's', 'preview', 'attachment_id', 'layout_sidebar']

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // ═══ COPILOT AUTH: proteger /copilot/dashboard/* ═══
  if (pathname.startsWith('/copilot/dashboard/')) {
    // Bypass con token de preview (para testing y acceso admin)
    if (searchParams.get('preview') === 'myp2026') {
      return NextResponse.next()
    }

    const session = request.cookies.get('copilot_session')
    if (!session || !session.value) {
      const loginUrl = new URL('/copilot/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar que el session token corresponde al dashboard que intenta acceder
    const parts = session.value.split(':')
    const sessionSubId = parts[0]
    // Extraer el ID del dashboard de la URL
    const dashId = pathname.replace('/copilot/dashboard/', '').split('/')[0]

    if (dashId && sessionSubId && dashId !== sessionSubId) {
      // Intenta acceder al dashboard de otro suscriptor → redirect a su propio dashboard
      const ownDash = new URL('/copilot/dashboard/' + sessionSubId, request.url)
      return NextResponse.redirect(ownDash)
    }
  }

  // ═══ COPILOT AUTH: proteger /copilot/configurar/* ═══
  if (pathname.startsWith('/copilot/configurar/')) {
    const session = request.cookies.get('copilot_session')
    if (!session || !session.value) {
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
