import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { leerSesion, esAdminOComercial } from '@/lib/crm/session'
import { normaLead, PREFIJO_TEST, type MetaDatos } from '@/lib/crm/campanas-meta'

export const dynamic = 'force-dynamic'

// Sección "Campañas Meta" del CRM: campañas TEST de Christopher (operadas por Claude).
// Solo admin y comercial de M&P (cookie de sesión firmada). Misma fuente que myp-meta-test.vercel.app:
//   - Meta: endpoint ?accion=meta del panel (misma lectura META_TOKEN / respaldo), sin datos personales.
//   - Leads: tabla leads de Supabase (fuente/campaña "TEST Claude" o nota "Campaña TEST").
const PANEL = process.env.META_TEST_PANEL_URL || 'https://myp-meta-test.vercel.app'

async function metaDatos(refresh: boolean): Promise<MetaDatos> {
  const key = crypto.createHash('sha256').update('meta-test-crm:' + (process.env.SUPABASE_SERVICE_ROLE_KEY || '')).digest('hex')
  try {
    const r = await fetch(`${PANEL}/api/panel?accion=meta${refresh ? '&refresh=1' : ''}`, { headers: { 'x-crm-key': key }, cache: 'no-store' })
    if (!r.ok) return { generado: null, fuente: 'sin datos', aviso: `No se pudieron leer los datos de Meta (${r.status}).`, campanas: [] }
    return await r.json()
  } catch (e: any) {
    return { generado: null, fuente: 'sin datos', aviso: 'No se pudieron leer los datos de Meta: ' + e.message, campanas: [] }
  }
}

async function leadsTest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return { error: 'CRM no configurado', filas: [] as any[] }
  const filtro = encodeURIComponent(`(campana_nombre.ilike.*${PREFIJO_TEST}*,fuente.ilike.*${PREFIJO_TEST}*,notas.ilike.*CAMPAÑA TEST*)`)
  const r = await fetch(`${url}/rest/v1/leads?select=*&or=${filtro}&order=fecha_ingreso.desc&limit=2000`, {
    headers: { apikey: key, Authorization: 'Bearer ' + key },
    cache: 'no-store',
  })
  if (!r.ok) return { error: 'CRM ' + r.status, filas: [] as any[] }
  return { filas: (await r.json()) as any[] }
}

const csvCelda = (v: any) => (/[",\n;]/.test(String(v ?? '')) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v ?? ''))

export async function GET(req: NextRequest) {
  const s = leerSesion(req)
  if (!esAdminOComercial(s)) {
    return NextResponse.json({ error: 'sesion', mensaje: 'Inicia sesión de nuevo en el CRM para ver esta sección.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }
  const sp = req.nextUrl.searchParams
  const [meta, crm] = await Promise.all([metaDatos(sp.get('refresh') === '1'), leadsTest()])
  const leads = crm.filas.map(normaLead)

  if (sp.get('formato') === 'csv') {
    const cols = ['fecha', 'nombre', 'empresa', 'cargo', 'rubro', 'presupuesto', 'telefono', 'email', 'zona', 'campana', 'conjunto', 'anuncio', 'estado', 'horas_a_contacto', 'calificacion', 'score'] as const
    const csv = [cols.join(';'), ...leads.map(l => cols.map(c => csvCelda((l as any)[c])).join(';'))].join('\n')
    return new NextResponse('﻿' + csv, {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="leads-campanas-test-christopher.csv"', 'Cache-Control': 'no-store' },
    })
  }
  return NextResponse.json({ meta, crm_error: crm.error || null, leads, ahora: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } })
}
