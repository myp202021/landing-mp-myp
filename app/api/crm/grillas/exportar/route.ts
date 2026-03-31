import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import ExcelJS from 'exceljs'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// M&P brand colors
const BLUE_DARK = '1E3A5F'
const BLUE_PRIMARY = '2563EB'
const BLUE_LIGHT = 'DBEAFE'
const GREEN_LIGHT = 'D1FAE5'
const PURPLE_LIGHT = 'F3E8FF'
const GRAY_LIGHT = 'F8FAFC'
const GRAY_BORDER = 'E2E8F0'
const WHITE = 'FFFFFF'

interface Post {
  dia: number
  dia_semana: string
  plataforma: string
  tipo_post: string
  copy: string
  copy_grafica: string
  hashtags: string
  nota_interna: string
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const grillaId = searchParams.get('grilla_id')

    if (!grillaId) {
      return NextResponse.json({ error: 'grilla_id requerido' }, { status: 400 })
    }

    const { data: grilla, error } = await supabase
      .from('grillas_contenido')
      .select('*, clientes(nombre, rubro)')
      .eq('id', grillaId)
      .single()

    if (error || !grilla) {
      return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })
    }

    const cliente = grilla.clientes as { nombre: string; rubro: string }
    const posts = (grilla.posts as Post[]).sort((a: Post, b: Post) => a.dia - b.dia)
    const mesNombre = MESES[grilla.mes]

    // Create workbook
    const wb = new ExcelJS.Workbook()
    wb.creator = 'Muller y Pérez'
    wb.created = new Date()

    const ws = wb.addWorksheet(`${mesNombre} ${grilla.anio}`, {
      properties: { defaultColWidth: 15 },
      pageSetup: { orientation: 'landscape', fitToPage: true }
    })

    // Column widths
    ws.columns = [
      { key: 'semana', width: 12 },
      { key: 'dia', width: 8 },
      { key: 'dia_semana', width: 12 },
      { key: 'plataforma', width: 18 },
      { key: 'tipo', width: 12 },
      { key: 'copy', width: 55 },
      { key: 'copy_grafica', width: 40 },
      { key: 'hashtags', width: 30 },
      { key: 'imagen', width: 25 },
      { key: 'nota_interna', width: 30 },
      { key: 'comentarios', width: 25 },
    ]

    // ========== HEADER: M&P Branding ==========
    ws.mergeCells('A1:K1')
    const titleRow = ws.getRow(1)
    titleRow.height = 40
    const titleCell = ws.getCell('A1')
    titleCell.value = `GRILLA DE CONTENIDO — ${cliente.nombre.toUpperCase()}`
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: WHITE } }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_DARK } }
    titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }

    ws.mergeCells('A2:K2')
    const subtitleRow = ws.getRow(2)
    subtitleRow.height = 28
    const subtitleCell = ws.getCell('A2')
    subtitleCell.value = `${mesNombre} ${grilla.anio} · ${posts.length} publicaciones · Muller y Pérez — Performance Marketing`
    subtitleCell.font = { name: 'Arial', size: 11, color: { argb: 'BFDBFE' } }
    subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_DARK } }
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }

    // Empty row
    ws.getRow(3).height = 8

    // ========== COLUMN HEADERS ==========
    const headerRow = ws.getRow(4)
    headerRow.height = 30
    const headers = ['Semana', 'Día', 'Día', 'Plataforma', 'Tipo', 'Copy (caption)', 'Copy Gráfica', 'Hashtags', 'Imagen / Video', 'Nota Interna', 'Comentarios']
    headers.forEach((h, i) => {
      const cell = headerRow.getCell(i + 1)
      cell.value = h
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_PRIMARY } }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = {
        bottom: { style: 'thin', color: { argb: GRAY_BORDER } },
      }
    })

    // ========== DATA ROWS ==========
    // Group into weeks
    let currentWeek = 1
    let weekStart = posts.length > 0 ? posts[0].dia : 1

    posts.forEach((post: Post, idx: number) => {
      if (post.dia - weekStart >= 7 && idx > 0) {
        currentWeek++
        weekStart = post.dia
      }

      const rowNum = 5 + idx
      const row = ws.getRow(rowNum)
      row.height = 80

      const isEven = idx % 2 === 0
      const bgColor = isEven ? WHITE : GRAY_LIGHT
      const isLinkedIn = post.plataforma === 'LinkedIn'
      const platformBg = isLinkedIn ? BLUE_LIGHT : PURPLE_LIGHT

      // Semana
      const semanaCell = row.getCell(1)
      semanaCell.value = `Sem ${currentWeek}`
      semanaCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '475569' } }
      semanaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      semanaCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Día número
      const diaCell = row.getCell(2)
      diaCell.value = post.dia
      diaCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: '1E293B' } }
      diaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      diaCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Día semana
      const diaSemCell = row.getCell(3)
      diaSemCell.value = post.dia_semana
      diaSemCell.font = { name: 'Arial', size: 10, color: { argb: '64748B' } }
      diaSemCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      diaSemCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Plataforma (colored)
      const platCell = row.getCell(4)
      platCell.value = isLinkedIn ? 'LinkedIn' : 'Instagram / FB'
      platCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: isLinkedIn ? '1D4ED8' : '7C3AED' } }
      platCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: platformBg } }
      platCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Tipo
      const tipoCell = row.getCell(5)
      tipoCell.value = post.tipo_post
      tipoCell.font = { name: 'Arial', size: 10, color: { argb: '475569' } }
      tipoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      tipoCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Copy (main content)
      const copyCell = row.getCell(6)
      copyCell.value = post.copy
      copyCell.font = { name: 'Arial', size: 9, color: { argb: '334155' } }
      copyCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      copyCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

      // Hashtags
      // Copy gráfica (texto en la imagen)
      const grafCell = row.getCell(7)
      grafCell.value = (post.copy_grafica || '').replace(/---/g, '\n')
      grafCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: '6D28D9' } }
      grafCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5F3FF' } }
      grafCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

      const hashCell = row.getCell(8)
      hashCell.value = post.hashtags
      hashCell.font = { name: 'Arial', size: 9, color: { argb: '2563EB' } }
      hashCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      hashCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

      // Imagen (empty, green background to highlight)
      const imgCell = row.getCell(9)
      imgCell.value = ''
      imgCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN_LIGHT } }
      imgCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Nota interna
      const notaCell = row.getCell(10)
      notaCell.value = post.nota_interna
      notaCell.font = { name: 'Arial', size: 9, italic: true, color: { argb: '92400E' } }
      notaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } }
      notaCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

      // Comentarios (empty)
      const comCell = row.getCell(11)
      comCell.value = ''
      comCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      comCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

      // Borders for all cells
      for (let c = 1; c <= 11; c++) {
        row.getCell(c).border = {
          top: { style: 'thin', color: { argb: GRAY_BORDER } },
          bottom: { style: 'thin', color: { argb: GRAY_BORDER } },
          left: { style: 'thin', color: { argb: GRAY_BORDER } },
          right: { style: 'thin', color: { argb: GRAY_BORDER } },
        }
      }
    })

    // ========== FOOTER ==========
    const footerRowNum = 5 + posts.length + 1
    ws.mergeCells(`A${footerRowNum}:K${footerRowNum}`)
    const footerCell = ws.getCell(`A${footerRowNum}`)
    footerCell.value = `Generado por Muller y Pérez · mulleryperez.cl · ${new Date().toLocaleDateString('es-CL')}`
    footerCell.font = { name: 'Arial', size: 9, italic: true, color: { argb: '94A3B8' } }
    footerCell.alignment = { horizontal: 'center' }

    // Freeze header
    ws.views = [{ state: 'frozen', ySplit: 4 }]

    // Auto filter
    ws.autoFilter = { from: 'A4', to: 'K4' }

    // Generate buffer
    const buffer = await wb.xlsx.writeBuffer()

    const filename = `Grilla_${cliente.nombre.replace(/\s+/g, '_')}_${mesNombre}_${grilla.anio}.xlsx`

    return new NextResponse(buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('GET exportar grilla error:', message)
    return NextResponse.json({ error: 'Error al exportar', details: message }, { status: 500 })
  }
}
