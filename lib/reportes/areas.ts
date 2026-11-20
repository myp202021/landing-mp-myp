// Área de clientes (mulleryperez.cl/clientes/<id>): pestañas extra por cliente, además del Reporte SEO y GEO.
// Solo clientes ACTIVOS (nada de ex clientes). Revisado 20 nov 2026: todos responden 200 y no envían X-Frame-Options ni CSP → se embeben.
// embebible: false → la pestaña muestra una tarjeta con botón «Abrir panel» en vez del iframe.
// tokenEnv: el enlace necesita un token (?k=) que se lee de esa variable de entorno del servidor; NUNCA va escrito aquí.
export type Panel = { nombre: string; url: string; embebible: boolean; tokenEnv?: string; nota?: string }
export type Area = { nombre: string; paneles: Panel[] }

export const AREAS: Record<string, Area> = {
  cym: { nombre: 'CyM Propiedades', paneles: [{ nombre: 'Panel de seguimiento', url: 'https://cym-dashboard-liart.vercel.app/seguimiento', embebible: true }] },
  halterlift: { nombre: 'Halterlift', paneles: [{ nombre: 'Panel de medición', url: 'https://halterlift-panel.vercel.app', embebible: true }] },
  dmp: { nombre: 'Devuelve mi Pie', paneles: [{ nombre: 'Panel', url: 'https://dmp-dashboard.vercel.app', embebible: true }] },
  genera: { nombre: 'Genera', paneles: [{ nombre: 'Panel de pauta', url: 'https://genera-agente-meta.vercel.app', embebible: true }] },
  'power-energy': { nombre: 'Power Energy', paneles: [{ nombre: 'Panel de pauta', url: 'https://power-energy-panel.vercel.app', embebible: true }] },
  tecnoinver: {
    nombre: 'Tecnoinver',
    paneles: [
      { nombre: 'Panel Google Ads', url: 'https://tecnoinver-panel.vercel.app', embebible: true },
      { nombre: 'Panel de pauta (M&P Ops)', url: 'https://myp-ops.vercel.app/paid/tecnoinver', embebible: true, tokenEnv: 'PANEL_TOKEN_TECNOINVER', nota: 'Necesita su token de acceso.' },
    ],
  },
}

export function urlPanel(p: Panel): string | null {
  if (!p.tokenEnv) return p.url
  const t = process.env[p.tokenEnv]
  return t ? p.url + (p.url.includes('?') ? '&' : '?') + 'k=' + encodeURIComponent(t) : null
}
