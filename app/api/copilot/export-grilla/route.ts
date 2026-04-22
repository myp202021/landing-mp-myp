import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

const supabase = createClient(
  'https://faitwrutauavjwnsnlzq.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(req: NextRequest) {
  try {
    const subId = req.nextUrl.searchParams.get('id')
    const mes = req.nextUrl.searchParams.get('mes')
    if (!subId) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    let query = supabase
      .from('copilot_contenido')
      .select('*')
      .eq('suscripcion_id', subId)
      .eq('tipo', 'grilla')
      .order('created_at', { ascending: false })
      .limit(1)

    if (mes) query = query.eq('mes', parseInt(mes))

    const { data, error } = await query
    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: 'No hay grilla disponible' }, { status: 404 })
    }

    const grilla = data[0]
    const posts = grilla.datos || []
    const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const mesNombre = MESES[grilla.mes] || ''

    const rows = posts.map(function(p: any, i: number) {
      return {
        '#': i + 1,
        'Fecha': p.fecha_sugerida || p.dia_semana || ('Dia ' + (p.dia || i + 1)),
        'Plataforma': p.plataforma || '',
        'Tipo': p.tipo_post || p.tipo || '',
        'Angulo': p.angulo || '',
        'Titulo': p.titulo || p.titulo_grafico || p.gancho || '',
        'Copy': p.copy || '',
        'Hashtags': p.hashtags || '',
        'Nota diseno': p.nota_diseno || '',
        'Score QA': p.score || '',
      }
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(rows)

    ws['!cols'] = [
      { wch: 4 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 },
      { wch: 30 }, { wch: 60 }, { wch: 30 }, { wch: 25 }, { wch: 8 },
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Grilla ' + mesNombre)
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Grilla_' + mesNombre + '_' + grilla.anio + '.xlsx"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
