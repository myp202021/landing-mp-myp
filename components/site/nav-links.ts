/** Enlaces del menú del sitio. Reúne los del header anterior y los del home nuevo, para no perder enlazado interno. */
export const NAV_PRINCIPAL = [
  { href: '/#areas', t: 'Cómo trabajamos' },
  { href: '/#planes', t: 'Planes' },
  { href: '/boost-seo-ia', t: 'Boost SEO + IA' },
  { href: '/labs', t: 'Labs' },
  { href: '/casos-de-exito', t: 'Casos' },
  { href: '/blog', t: 'Blog' },
] as const

export const NAV_MAS = [
  {
    titulo: 'Servicios',
    links: [
      ['/servicios', 'Todos los servicios'],
      ['/servicios/performance-marketing', 'Performance marketing'],
      ['/servicios/google-ads-chile', 'Google Ads'],
      ['/servicios/meta-ads-chile', 'Meta Ads'],
      ['/servicios/seo-chile', 'SEO'],
      ['/servicios/geo-chile', 'GEO (IA)'],
      ['/#planes', 'Planes Silver · Gold · Platinum'],
    ],
  },
  {
    titulo: 'Utilidades',
    links: [
      ['/utilidades', 'Todas las utilidades'],
      ['/utilidades/calculadora-cac', 'Calculadora CAC'],
      ['/utilidades/comparador-web', 'Comparador web'],
      ['/utilidades/generador-funnels', 'Generador de funnels'],
      ['/utilidades/juega-aprende', 'Juega y aprende'],
    ],
  },
  {
    titulo: 'Recursos',
    links: [
      ['/blog', 'Blog'],
      ['/indicadores', 'Termómetro marketing'],
      ['/investigacion', 'Investigación'],
      ['/benchmarks', 'Benchmarks 2026'],
      ['/mejores-agencias-marketing-digital-chile', 'Ranking agencias 2026'],
      ['/mejores-agencias-performance-marketing-chile', 'Mejores agencias performance'],
    ],
  },
  {
    titulo: 'Nosotros',
    links: [
      ['/nosotros', 'Quiénes somos'],
      ['/agentes-ia', 'Nuestros agentes IA'],
      ['/tecnologia', 'Tecnología'],
      ['/equipo/christopher-muller', 'Equipo'],
      ['/casos-de-exito', 'Casos de éxito'],
      ['/#clientes', 'Clientes'],
      ['/brochure', 'Brochure'],
      ['/portfolio', 'Portafolio'],
    ],
  },
  {
    titulo: 'Acceso clientes',
    links: [
      ['/crm/login', 'CRM clientes'],
      ['/copilot/login', 'Copilot'],
    ],
  },
] as const

/** Rutas de aplicación (paneles, logins, landings de clientes) que no llevan el menú ni el pie del sitio. */
const EXCLUIDAS = ['/crm', '/cliente', '/login', '/ads', '/l/', '/grilla', '/propiedades', '/noticias', '/predictor', '/predictor-v2', '/copilot/', '/admin', '/api']

export function sinCromo(pathname: string | null): boolean {
  if (!pathname) return false
  return EXCLUIDAS.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : p + '/') || (p.endsWith('/') && pathname.startsWith(p)))
}
