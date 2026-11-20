// Middleware de las áreas de clientes: refresca la sesión de Supabase Auth (cookies), decide qué se muestra y marca todo como noindex.
//   /<slug>            sin sesión → login con logo del cliente (rewrite, la URL no cambia); con sesión → /clientes/<slug> (rewrite)
//   /admin-reportes    índice del superadmin (rewrite a /clientes); sin sesión → login
//   /clientes/<slug>   → 308 a /<slug> (URL antigua);  /clientes → 308 a /admin-reportes
// El permiso real (quién ve qué) se valida en el servidor con app_metadata (lib/reportes/servidor.ts).
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { RUTA_ADMIN, esSlug } from "./areas";

function marcar(r: NextResponse) {
  r.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  r.headers.set("Cache-Control", "private, no-store");
  return r;
}

export async function sesionReportes(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const limpio = pathname.replace(/\/$/, "") || "/";

  // URL antiguas
  if (limpio === "/clientes") {
    const u = request.nextUrl.clone();
    u.pathname = RUTA_ADMIN;
    return marcar(NextResponse.redirect(u, 308));
  }
  const viejo = limpio.match(/^\/clientes\/([a-z0-9-]+)$/);
  if (viejo && esSlug(viejo[1])) {
    const u = request.nextUrl.clone();
    u.pathname = "/" + viejo[1];
    return marcar(NextResponse.redirect(u, 308));
  }

  // Destino interno
  const slug = esSlug(limpio.slice(1)) ? limpio.slice(1) : null;
  let destino: URL | null = null;
  if (slug) {
    destino = request.nextUrl.clone();
    destino.pathname = "/clientes/" + slug;
  } else if (limpio === RUTA_ADMIN) {
    destino = request.nextUrl.clone();
    destino.pathname = "/clientes";
  }

  const siguiente = () =>
    destino
      ? NextResponse.rewrite(destino, { request })
      : NextResponse.next({ request });
  let response = siguiente();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(lista) {
          lista.forEach(({ name, value }) => request.cookies.set(name, value));
          response = siguiente();
          lista.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (slug || limpio === RUTA_ADMIN) {
      // Login en la misma URL del cliente, con su logo
      const login = request.nextUrl.clone();
      login.pathname = "/clientes/login";
      login.search = slug ? "?area=" + slug : "";
      const r = NextResponse.rewrite(login);
      response.cookies.getAll().forEach((c) => r.cookies.set(c));
      return marcar(r);
    }
    if (limpio !== "/clientes/login" && limpio !== "/clientes/salir") {
      const u = request.nextUrl.clone();
      u.pathname = "/clientes/login";
      u.search = "";
      return marcar(NextResponse.redirect(u));
    }
  }
  return marcar(response);
}
