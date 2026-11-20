// Middleware de /clientes: refresca la sesión de Supabase Auth (cookies) y marca todo como noindex.
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function sesionReportes(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(lista) {
        lista.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        lista.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  const enLogin = request.nextUrl.pathname === '/clientes/login'
  if (!user && !enLogin) {
    const url = request.nextUrl.clone(); url.pathname = '/clientes/login'; url.search = ''
    response = NextResponse.redirect(url)
  }
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
