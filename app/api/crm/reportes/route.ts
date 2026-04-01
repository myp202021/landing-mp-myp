import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CONFIG_PATH = path.join(process.cwd(), 'scripts', 'config-reportes.json')

function readConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8')
  return JSON.parse(raw)
}

function writeConfig(config: Record<string, unknown>) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
}

// GET: lista clientes de reportes + historial
export async function GET(req: NextRequest) {
  try {
    const mes = new URL(req.url).searchParams.get('mes')
    const anio = new URL(req.url).searchParams.get('anio')

    const config = readConfig()
    const clientes = config.clientes as Array<{ id: number; nombre: string; activo: boolean; ocultar?: string[] }>

    // Get historial
    let query = supabase.from('reportes_historial').select('*').order('enviado_en', { ascending: false })
    if (mes && anio) {
      query = query.eq('mes', parseInt(mes)).eq('anio', parseInt(anio))
    }
    const { data: historial } = await query.limit(500)

    // Merge: for each client, find their latest report
    const clientesConEstado = clientes.map(c => {
      const reportes = (historial || []).filter(h => h.cliente_reportei_id === c.id)
      const ultimo = reportes[0] || null
      return {
        ...c,
        ultimo_reporte: ultimo ? {
          mes: ultimo.mes,
          anio: ultimo.anio,
          estado: ultimo.estado,
          integraciones: ultimo.integraciones,
          reportei_url: ultimo.reportei_url,
          enviado_en: ultimo.enviado_en,
        } : null,
        total_reportes: reportes.length,
      }
    })

    return NextResponse.json({
      clientes: clientesConEstado,
      historial: historial || [],
      template_id: config.template_id,
      email_destino: config.email_destino,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// PATCH: insertar registros de historial en batch
export async function PATCH(req: NextRequest) {
  try {
    const { registros } = await req.json()
    if (!registros?.length) return NextResponse.json({ error: 'registros requeridos' }, { status: 400 })

    const { error } = await supabase.from('reportes_historial').insert(registros)
    if (error) throw error
    return NextResponse.json({ success: true, insertados: registros.length })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// POST: agregar cliente a reportes
export async function POST(req: NextRequest) {
  try {
    const { id, nombre, ocultar } = await req.json()
    if (!id || !nombre) return NextResponse.json({ error: 'id y nombre requeridos' }, { status: 400 })

    const config = readConfig()
    const exists = (config.clientes as Array<{ id: number }>).find(c => c.id === id)
    if (exists) return NextResponse.json({ error: 'Cliente ya existe en reportes' }, { status: 409 })

    const newClient: Record<string, unknown> = { id, nombre, activo: true }
    if (ocultar?.length) newClient.ocultar = ocultar

    config.clientes.push(newClient)
    writeConfig(config)

    return NextResponse.json({ success: true, total: config.clientes.length })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// DELETE: eliminar cliente de reportes
export async function DELETE(req: NextRequest) {
  try {
    const id = parseInt(new URL(req.url).searchParams.get('id') || '0')
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    const config = readConfig()
    config.clientes = (config.clientes as Array<{ id: number }>).filter(c => c.id !== id)
    writeConfig(config)

    return NextResponse.json({ success: true, total: config.clientes.length })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
