/**
 * Lógica compartida de la sección "Campañas Meta" del CRM (campañas TEST de Christopher, operadas por Claude).
 * Misma regla de calificación y atención que el panel myp-meta-test.vercel.app (api/panel.js).
 */

export const PREFIJO_TEST = 'TEST Claude'

export function letraDe(nombre: string | null | undefined): 'A' | 'B' | '?' {
  const m = String(nombre || '').match(/TEST\s*Claude\s+([AB])\b/i)
  return m ? (m[1].toUpperCase() as 'A' | 'B') : '?'
}

const RUBROS_A = ['inmobiliar', 'salud', 'clínica', 'clinica', 'médic', 'medic', 'dental', 'educa', 'colegio', 'universidad', 'legal', 'abogad', 'jurídic', 'juridic', 'servicios profesionales', 'consultor', 'contab']
const RUBROS_B = ['retail', 'ecommerce', 'e-commerce', 'tienda', 'industrial', 'importad', 'distribu', 'tecnolog', 'software', 'saas', 'energ', 'solar']
const DECISOR = /(dueñ|duen|propietari|fundador|founder|socio|ceo|gerente|director|presidente|owner|jefe de marketing|head of|marketing manager|gerencia|administrador)/i
const GRATIS = /@(gmail|hotmail|outlook|yahoo|live|icloud)\./i

type Fila = Record<string, any>

function texto(l: Fila) {
  return [l.notas, l.mensaje, l.observaciones, l.servicio].filter(Boolean).join(' \n ')
}
function campo(l: Fila, ...nombres: string[]): string {
  for (const n of nombres) if (l[n]) return String(l[n])
  const t = texto(l)
  for (const n of nombres) {
    const m = t.match(new RegExp(n.replace('_', '[ _]?') + '\\s*[:=]\\s*([^\\n|;]+)', 'i'))
    if (m) return m[1].trim()
  }
  return ''
}
function montoPresupuesto(s: string): number | null {
  if (!s) return null
  const t = String(s).toLowerCase().replace(/\./g, '').replace(/\s/g, '')
  const nums = (t.match(/\d+/g) || []).map(Number)
  if (!nums.length) return null
  let v = Math.max(...nums)
  if (/mm|millon/.test(t) && v < 1000) v *= 1e6
  else if (/(mil|k)\b/.test(t) && v < 100000) v *= 1e3
  return v
}

export function califica(l: Fila) {
  const rubro = (campo(l, 'rubro') || '').toLowerCase()
  const cargo = campo(l, 'cargo', 'puesto', 'job_title')
  const pres = montoPresupuesto(campo(l, 'presupuesto', 'presupuesto_marketing'))
  const empresa = campo(l, 'empresa', 'nombre_empresa', 'company_name')
  const web = campo(l, 'web', 'sitio', 'website')
  const pts = { presupuesto: 0, cargo: 0, rubro: 0, empresa: 0 }
  if (pres != null) pts.presupuesto = pres >= 1e6 ? 2 : pres >= 5e5 ? 1 : 0
  if (DECISOR.test(cargo)) pts.cargo = 2
  if ([...RUBROS_A, ...RUBROS_B].some(r => rubro.includes(r))) pts.rubro = 1
  if ((empresa && web) || (l.email && !GRATIS.test(l.email) && empresa)) pts.empresa = 1
  const score = pts.presupuesto + pts.cargo + pts.rubro + pts.empresa
  const nota: 'A' | 'B' | 'C' = score >= 5 ? 'A' : score >= 3 ? 'B' : 'C'
  return { score, nota, pts, rubro: campo(l, 'rubro'), cargo, presupuesto: campo(l, 'presupuesto', 'presupuesto_marketing'), presupuesto_monto: pres, empresa, web }
}

export function estadoDe(l: Fila): string {
  const e = String(l.estado || '').toLowerCase()
  if (l.vendido) return 'Ganado'
  if (/gan|vend|cerr/.test(e)) return 'Ganado'
  if (/perd|descart|no inter/.test(e) || l.razon_no_venta) return 'Perdido'
  if (/propuest|cotiz/.test(e)) return 'Propuesta'
  if (/reuni/.test(e)) return 'Reunión'
  if (l.contactado || /contact/.test(e)) return 'Contactado'
  return 'Nuevo'
}

export interface LeadMeta {
  id: number
  fecha: string
  nombre: string
  email: string
  telefono: string
  empresa: string
  cargo: string
  rubro: string
  presupuesto: string
  presupuesto_monto: number | null
  zona: string
  campana: string
  letra: 'A' | 'B' | '?'
  conjunto: string
  anuncio: string
  estado: string
  contactado: boolean
  horas_a_contacto: number | null
  calificacion: 'A' | 'B' | 'C'
  score: number
  monto_vendido: number
}

export function normaLead(l: Fila): LeadMeta {
  const c = califica(l)
  const ingreso = l.fecha_ingreso || l.creado_en
  const horas = l.fecha_contacto && ingreso ? (new Date(l.fecha_contacto).getTime() - new Date(ingreso).getTime()) / 36e5 : null
  const camp = l.campana_nombre || l.fuente || ''
  const est = estadoDe(l)
  return {
    id: l.id,
    fecha: ingreso,
    nombre: [l.nombre, l.apellido].filter(Boolean).join(' '),
    email: l.email || '',
    telefono: l.telefono || '',
    empresa: c.empresa,
    cargo: c.cargo,
    rubro: c.rubro,
    presupuesto: c.presupuesto,
    presupuesto_monto: c.presupuesto_monto,
    zona: [l.ciudad, l.region].filter(Boolean).join(', '),
    campana: camp,
    letra: letraDe(camp),
    conjunto: l.adset_nombre || '',
    anuncio: l.ad_nombre || '',
    estado: est,
    contactado: !!l.contactado || ['Contactado', 'Reunión', 'Propuesta', 'Ganado', 'Perdido'].includes(est),
    horas_a_contacto: horas != null && horas >= 0 ? Math.round(horas * 10) / 10 : null,
    calificacion: c.nota,
    score: c.score,
    monto_vendido: Number(l.monto_vendido) || 0,
  }
}

export interface CampanaMeta {
  id: string
  nombre: string
  letra: 'A' | 'B' | '?'
  estado: string
  presupuesto_diario: number | null
  inicio: string | null
  totales: { spend: number; impressions: number; reach: number; frequency: number; clicks: number; link_clicks: number; leads: number } | null
  diario: { fecha: string; spend: number; impressions: number; clicks: number; leads: number }[]
  anuncios: { id: string; nombre: string; conjunto: string; spend: number; impressions: number; clicks: number; leads: number }[]
}

export interface MetaDatos {
  generado: string | null
  fuente: string
  aviso?: string
  campanas: CampanaMeta[]
}
