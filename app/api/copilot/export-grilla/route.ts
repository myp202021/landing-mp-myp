import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import ExcelJS from 'exceljs'

const supabase = createClient(
  'https://faitwrutauavjwnsnlzq.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const HEADER_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4338CA' } }
const HEADER_FONT: Partial<ExcelJS.Font> = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
const BODY_FONT: Partial<ExcelJS.Font> = { size: 10 }
const BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
}
const ROW_EVEN: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F3FF' } }
const ROW_ODD: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }

const PLAT_COLORS: Record<string, string> = {
  Instagram: 'FFE4405F',
  LinkedIn: 'FF0A66C2',
  Facebook: 'FF1877F2',
}

export async function GET(req: NextRequest) {
  try {
    const subId = req.nextUrl.searchParams.get('id')
    const mes = req.nextUrl.searchParams.get('mes')
    if (!subId) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    let query = supabase
      .from('radar_contenido')
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

    const wb = new ExcelJS.Workbook()
    wb.creator = 'M&P Copilot'
    const ws = wb.addWorksheet('Grilla ' + mesNombre + ' ' + grilla.anio, {
      properties: { tabColor: { argb: '4338CA' } },
    })

    ws.columns = [
      { header: '#', key: 'n', width: 5 },
      { header: 'Fecha', key: 'fecha', width: 14 },
      { header: 'Plataforma', key: 'plat', width: 14 },
      { header: 'Tipo', key: 'tipo', width: 12 },
      { header: 'Ángulo', key: 'angulo', width: 16 },
      { header: 'Título', key: 'titulo', width: 30 },
      { header: 'Copy', key: 'copy', width: 55 },
      { header: 'Hashtags', key: 'hash', width: 30 },
      { header: 'Nota diseño', key: 'diseno', width: 25 },
      { header: 'Score QA', key: 'score', width: 10 },
    ]

    // Header row style
    const headerRow = ws.getRow(1)
    headerRow.height = 28
    for (let c = 1; c <= 10; c++) {
      const cell = headerRow.getCell(c)
      cell.fill = HEADER_FILL
      cell.font = HEADER_FONT
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      cell.border = BORDER
    }

    // Data rows
    posts.forEach(function(p: any, i: number) {
      const row = ws.addRow([
        i + 1,
        p.fecha_sugerida || p.dia_semana || ('Día ' + (p.dia || i + 1)),
        p.plataforma || '',
        p.tipo_post || p.tipo || '',
        p.angulo || '',
        p.titulo || p.titulo_grafico || p.gancho || '',
        p.copy || '',
        p.hashtags || '',
        p.nota_diseno || '',
        p.score || '',
      ])

      row.height = 45

      for (let c = 1; c <= 10; c++) {
        const cell = row.getCell(c)
        cell.font = BODY_FONT
        cell.alignment = { vertical: 'top', wrapText: true }
        cell.border = BORDER
        cell.fill = (i % 2 === 0) ? ROW_EVEN : ROW_ODD
      }

      // # column bold
      row.getCell(1).font = { bold: true, size: 10 }
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }

      // Platform color
      const platValue = (p.plataforma || '').toString()
      const platColor = PLAT_COLORS[platValue]
      if (platColor) {
        row.getCell(3).font = { bold: true, size: 10, color: { argb: platColor } }
      }

      // Score color
      const scoreVal = p.score || 0
      const scoreColor = scoreVal >= 80 ? 'FF166534' : scoreVal >= 70 ? 'FF92400E' : 'FF991B1B'
      row.getCell(10).font = { bold: true, size: 10, color: { argb: scoreColor } }
      row.getCell(10).alignment = { horizontal: 'center', vertical: 'middle' }
    })

    const buf = await wb.xlsx.writeBuffer()

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
