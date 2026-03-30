import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// WordPress/LinkedIn legacy query params that cause redirect loops in next.config.js
const STRIP_PARAMS = ['page_id', 'trk', 'p', 'm', 'cat', 's', 'preview', 'attachment_id', 'layout_sidebar']

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // Check if URL has any legacy query params to strip
  const hasLegacyParam = STRIP_PARAMS.some(param => searchParams.has(param))

  if (hasLegacyParam) {
    const url = request.nextUrl.clone()

    // Remove all legacy params
    STRIP_PARAMS.forEach(param => url.searchParams.delete(param))

    // If path is root and had blog-related params, redirect to /blog
    const hadBlogParam = searchParams.has('m') || searchParams.has('cat')
    if (hadBlogParam && url.pathname === '/') {
      url.pathname = '/blog'
    }

    // 301 permanent redirect to clean URL
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only run on paths that might have legacy query params
    // Skip static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
