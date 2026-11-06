"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_MAS, NAV_PRINCIPAL, sinCromo } from "./nav-links";

/**
 * Menú único del sitio (azul marino). Se monta una vez en app/layout.tsx.
 * Todos los enlaces quedan en el HTML (también los del menú móvil y el "Más"),
 * para conservar el enlazado interno.
 */
export default function SiteNav() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  useEffect(() => setAbierto(false), [pathname]);

  if (sinCromo(pathname)) return null;

  return (
    <>
      <header className="site-nav fixed inset-x-0 top-0 z-50 h-[72px] border-b border-white/10 bg-[#081030] text-white">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-8"
        >
          <Link
            href="/"
            aria-label="Muller y Pérez, inicio"
            className="flex shrink-0 items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-blanco-144.png"
              alt="Muller y Pérez"
              width={36}
              height={36}
              className="h-9 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex">
            {NAV_PRINCIPAL.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-white"
              >
                {l.t}
              </Link>
            ))}
            <div className="group relative">
              <button
                type="button"
                className="py-6 transition-colors hover:text-white"
                aria-haspopup="true"
              >
                Más ▾
              </button>
              <div className="invisible absolute right-0 top-full z-50 grid w-[860px] grid-cols-6 gap-5 rounded-2xl border border-white/10 bg-[#0b1640] p-6 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {NAV_MAS.map((g) => (
                  <div key={g.titulo}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                      {g.titulo}
                    </p>
                    <ul className="space-y-1.5">
                      {g.links.map(([href, t]) => (
                        <li key={href + t}>
                          <Link
                            href={href}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            {t}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/#contacto"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-cyan-100"
              aria-label="Agendar reunión con Muller y Pérez"
            >
              Agendar reunión
            </Link>
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 lg:hidden"
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                {abierto ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        <div
          id="menu-movil"
          className={`${abierto ? "block" : "hidden"} max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/10 bg-[#081030] px-5 pb-8 pt-4 lg:hidden`}
        >
          <ul className="mb-6 grid grid-cols-2 gap-2">
            {NAV_PRINCIPAL.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold"
                >
                  {l.t}
                </Link>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-6">
            {NAV_MAS.map((g) => (
              <div key={g.titulo}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                  {g.titulo}
                </p>
                <ul className="space-y-2">
                  {g.links.map(([href, t]) => (
                    <li key={href + t}>
                      <Link href={href} className="text-sm text-slate-300">
                        {t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </header>
      {/* Reserva el alto del menú en páginas que no traen su propio espacio arriba. */}
      <div
        className="site-nav-spacer h-[72px] bg-[#081030]"
        aria-hidden="true"
      />
    </>
  );
}
