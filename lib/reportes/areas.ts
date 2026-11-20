// Áreas de clientes en la raíz del sitio: www.mulleryperez.cl/<slug> (lista CERRADA: solo estos slugs abren un área).
// Antes de agregar un slug: verificar que no exista como ruta del sitio (app/<slug>, public/<slug>, redirects de next.config.js).
// reporte: hay Reporte SEO y GEO (datos en Storage «reportes-seo/<slug>/»). false = solo paneles (clientes sin agente SEO/GEO).
// Paneles: se embeben en iframe si el panel lo permite (sin X-Frame-Options/CSP frame-ancestors, revisado 20 nov 2026).
export type Panel = {
  nombre: string;
  url: string;
  embebible: boolean;
  tokenEnv?: string;
  nota?: string;
};
export type Area = {
  nombre: string;
  logo?: string;
  logoOscuro?: boolean; // logo blanco: va sobre fondo oscuro
  reporte: boolean;
  paneles: Panel[];
};

export const AREAS: Record<string, Area> = {
  mulleryperez: {
    nombre: "Muller y Pérez",
    logo: "/reportes/logos/mulleryperez.png",
    reporte: true,
    paneles: [],
  },
  cym: {
    nombre: "CyM Propiedades",
    logo: "/reportes/logos/cym.png",
    reporte: true,
    paneles: [
      {
        nombre: "Panel de seguimiento",
        url: "https://cym-dashboard-liart.vercel.app/seguimiento",
        embebible: true,
      },
    ],
  },
  wiseplanchile: {
    nombre: "Wiseplan",
    logo: "/reportes/logos/wiseplanchile.png",
    reporte: true,
    paneles: [],
  },
  wiseplanperu: {
    nombre: "Wiseplan Perú",
    logo: "/reportes/logos/wiseplanperu.png",
    reporte: true,
    paneles: [],
  },
  dmp: {
    nombre: "Devuelve mi Pie",
    logo: "/reportes/logos/dmp.png",
    reporte: true,
    paneles: [
      {
        nombre: "Panel",
        url: "https://dmp-dashboard.vercel.app",
        embebible: true,
      },
    ],
  },
  tritec: {
    nombre: "Tritec Energy",
    logo: "/reportes/logos/tritec.png",
    reporte: true,
    paneles: [],
  },
  lablab: {
    nombre: "LabLab",
    logo: "/reportes/logos/lablab.png",
    reporte: true,
    paneles: [],
  },
  mskhome: {
    nombre: "MSK Home",
    logo: "/reportes/logos/mskhome.png",
    reporte: true,
    paneles: [],
  },
  bhi: {
    nombre: "BHI",
    logo: "/reportes/logos/bhi.webp",
    reporte: true,
    paneles: [],
  },
  halterlift: {
    nombre: "Halterlift",
    logo: "/reportes/logos/halterlift.webp",
    reporte: true,
    paneles: [
      {
        nombre: "Panel",
        url: "https://halterlift-panel.vercel.app",
        embebible: true,
      },
    ],
  },
  codify: {
    nombre: "Codify",
    logo: "/reportes/logos/codify.png",
    reporte: true,
    paneles: [],
  },
  hualpen: {
    nombre: "Buses Hualpén",
    logo: "/reportes/logos/hualpen.png",
    reporte: true,
    paneles: [],
  },
  metcorp: {
    nombre: "Metcorp Panel SIP",
    logo: "/reportes/logos/metcorp.jpg",
    reporte: true,
    paneles: [],
  },
  genera: {
    nombre: "Genera",
    logo: "/reportes/logos/genera.svg",
    reporte: false,
    paneles: [
      {
        nombre: "Panel",
        url: "https://genera-agente-meta.vercel.app",
        embebible: true,
      },
    ],
  },
  power: {
    nombre: "Power Energy",
    logo: "/reportes/logos/power.png",

    reporte: false,
    paneles: [
      {
        nombre: "Panel",
        url: "https://power-energy-panel.vercel.app",
        embebible: true,
      },
    ],
  },
  tecnoinver: {
    nombre: "Tecnoinver",
    logo: "/reportes/logos/tecnoinver.svg",
    reporte: false,
    paneles: [
      {
        nombre: "Panel Google Ads",
        url: "https://tecnoinver-panel.vercel.app",
        embebible: true,
      },
      {
        nombre: "Panel de pauta (M&P Ops)",
        url: "https://myp-ops.vercel.app/paid/tecnoinver",
        embebible: true,
        tokenEnv: "PANEL_TOKEN_TECNOINVER",
        nota: "Lo dejamos listo en los próximos días.",
      },
    ],
  },
};

export const SLUGS = Object.keys(AREAS);
// Índice del superadmin (ve todas las áreas)
export const RUTA_ADMIN = "/admin-reportes";
export const esSlug = (s: string) =>
  Object.prototype.hasOwnProperty.call(AREAS, s);
// ¿Es una ruta privada de reportes? (para ocultar menú, pie, migas, popups y chat del sitio)
export function esRutaReportes(pathname: string | null | undefined) {
  if (!pathname) return false;
  if (
    pathname === "/clientes" ||
    pathname.startsWith("/clientes/") ||
    pathname === RUTA_ADMIN
  )
    return true;
  return esSlug(pathname.replace(/^\/|\/$/g, ""));
}

export function urlPanel(p: Panel): string | null {
  if (!p.tokenEnv) return p.url;
  const t = process.env[p.tokenEnv];
  return t
    ? p.url + (p.url.includes("?") ? "&" : "?") + "k=" + encodeURIComponent(t)
    : null;
}
