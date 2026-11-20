// Reporte SEO y GEO por cliente (mulleryperez.cl/clientes/<id>) — solo servidor.
// Login: Supabase Auth. Acceso: app_metadata.reportes = { rol: 'cliente', cliente: '<id>' } (lo fija el script, el usuario no puede cambiarlo).
// Superadmin (ve todas las áreas + índice /admin-reportes): app_metadata.reportes.rol === 'superadmin' (o 'admin', compatibilidad).
// Solo app_metadata (la fija el servidor con la clave de servicio); nunca user_metadata ni el correo.
// Datos: bucket privado "reportes-seo" de Supabase Storage, cargado por myp-daily-agent/scripts/reportes-seo/recolectar.mjs.
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { IndiceReportes, ReporteMes } from './tipos'

const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL!
const BUCKET = 'reportes-seo'

export function supabaseServidor() {
  const cookieStore = cookies()
  return createServerClient(URL_SB, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(lista) {
        try { lista.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { /* Server Component: lo refresca el middleware */ }
      },
    },
  })
}

export type Acceso = { email: string; admin: boolean; cliente: string | null }

export async function accesoActual(): Promise<Acceso | null> {
  const { data: { user } } = await supabaseServidor().auth.getUser()
  if (!user) return null
  const meta = (user.app_metadata?.reportes || {}) as { rol?: string; cliente?: string }
  const email = (user.email || '').toLowerCase()
  const admin = meta.rol === 'superadmin' || meta.rol === 'admin'
  return { email, admin, cliente: meta.cliente || null }
}

export function puedeVer(a: Acceso, cliente: string) {
  return a.admin || a.cliente === cliente
}

async function leerJson<T>(ruta: string): Promise<T | null> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY')
  const r = await fetch(`${URL_SB}/storage/v1/object/authenticated/${BUCKET}/${ruta}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (r.status === 404 || r.status === 400) return null
  if (!r.ok) throw new Error(`Storage ${r.status}`)
  return r.json() as Promise<T>
}

export const leerIndice = () => leerJson<IndiceReportes>('_clientes.json')
export const leerMes = (cliente: string, mes: string) =>
  /^[a-z0-9-]+$/.test(cliente) && /^\d{4}-\d{2}$/.test(mes) ? leerJson<ReporteMes>(`${cliente}/${mes}.json`) : Promise.resolve(null)
