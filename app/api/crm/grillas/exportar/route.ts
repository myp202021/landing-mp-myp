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
const AMBER_LIGHT = 'FEF3C7'
const GRAY_LIGHT = 'F8FAFC'
const GRAY_BORDER = 'E2E8F0'
const WHITE = 'FFFFFF'

// Colores por tipo de contenido
const TIPO_COLORS: Record<string, { bg: string; text: string }> = {
  'educativo': { bg: 'DBEAFE', text: '1E40AF' },      // azul
  'comercial': { bg: 'D1FAE5', text: '065F46' },       // verde
  'inspiracional': { bg: 'FCE7F3', text: '9D174D' },   // rosa
  'caso': { bg: 'FEF3C7', text: '92400E' },            // amber
  'objecion': { bg: 'FEE2E2', text: '991B1B' },        // rojo
  'diferenciacion': { bg: 'F3E8FF', text: '6D28D9' },  // morado
}

interface Post {
  dia: number
  dia_semana: string
  plataforma: string
  tipo_post: string
  angulo?: string
  tipo_contenido?: string
  objetivo?: string
  copy: string
  copy_grafica: string
  hashtags: string
  nota_interna: string
  _calidad?: { score: number; fixed?: boolean; manual?: boolean }
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

    // Column widths — optimizado para diseñadores
    ws.columns = [
      { key: 'semana', width: 10 },
      { key: 'dia', width: 14 },
      { key: 'plataforma', width: 16 },
      { key: 'tipo_post', width: 12 },
      { key: 'angulo', width: 16 },
      { key: 'tipo_contenido', width: 18 },
      { key: 'objetivo', width: 16 },
      { key: 'titulo_grafico', width: 35 },
      { key: 'copy', width: 55 },
      { key: 'hashtags', width: 28 },
      { key: 'instrucciones_diseno', width: 35 },
      { key: 'imagen', width: 20 },
      { key: 'score', width: 8 },
    ]

    // ========== HEADER: M&P Branding ==========
    ws.mergeCells('A1:M1')
    const titleRow = ws.getRow(1)
    titleRow.height = 40
    const titleCell = ws.getCell('A1')
    titleCell.value = `GRILLA DE CONTENIDO — ${cliente.nombre.toUpperCase()}`
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: WHITE } }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_DARK } }
    titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }

    ws.mergeCells('A2:M2')
    const subtitleRow = ws.getRow(2)
    subtitleRow.height = 28
    const subtitleCell = ws.getCell('A2')
    subtitleCell.value = `${mesNombre} ${grilla.anio} · ${posts.length} publicaciones · Pipeline: OpenAI (estrategia) → Claude (copies) → Revisor heurístico · Muller y Pérez`
    subtitleCell.font = { name: 'Arial', size: 10, color: { argb: 'BFDBFE' } }
    subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_DARK } }
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }

    ws.getRow(3).height = 8

    // ========== COLUMN HEADERS ==========
    const headerRow = ws.getRow(4)
    headerRow.height = 32
    const headers = ['Sem', 'Día', 'Plataforma', 'Tipo Post', 'Ángulo', 'Tipo Contenido', 'Objetivo', '📐 TÍTULO GRÁFICO', 'Copy (caption)', 'Hashtags', '🎨 Instrucciones Diseño', 'Imagen/Video', 'Score']
    headers.forEach((h, i) => {
      const cell = headerRow.getCell(i + 1)
      cell.value = h
      cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: WHITE } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i === 7 ? '7C3AED' : i === 10 ? '92400E' : BLUE_PRIMARY } }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      cell.border = { bottom: { style: 'thin', color: { argb: GRAY_BORDER } } }
    })

    // ========== DATA ROWS ==========
    let currentWeek = 1
    let weekStart = posts.length > 0 ? posts[0].dia : 1

    posts.forEach((post: Post, idx: number) => {
      if (post.dia - weekStart >= 7 && idx > 0) {
        currentWeek++
        weekStart = post.dia
      }

      const rowNum = 5 + idx
      const row = ws.getRow(rowNum)
      row.height = 90

      const isEven = idx % 2 === 0
      const bgColor = isEven ? WHITE : GRAY_LIGHT
      const isLinkedIn = post.plataforma === 'LinkedIn'
      const platformBg = isLinkedIn ? BLUE_LIGHT : PURPLE_LIGHT
      const angulo = post.angulo || ''
      const anguloColors = TIPO_COLORS[angulo] || { bg: bgColor, text: '475569' }
      const score = post._calidad?.score ?? 100

      // Semana
      const semanaCell = row.getCell(1)
      semanaCell.value = `S${currentWeek}`
      semanaCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '475569' } }
      semanaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      semanaCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Día
      const diaCell = row.getCell(2)
      diaCell.value = `${post.dia_semana} ${post.dia}`
      diaCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: '1E293B' } }
      diaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      diaCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Plataforma
      const platCell = row.getCell(3)
      platCell.value = isLinkedIn ? 'LinkedIn' : 'IG / Facebook'
      platCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: isLinkedIn ? '1D4ED8' : '7C3AED' } }
      platCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: platformBg } }
      platCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Tipo Post
      const tipoCell = row.getCell(4)
      tipoCell.value = post.tipo_post
      tipoCell.font = { name: 'Arial', size: 10, color: { argb: '475569' } }
      tipoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      tipoCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Ángulo (coloreado)
      const anguloCell = row.getCell(5)
      anguloCell.value = angulo.charAt(0).toUpperCase() + angulo.slice(1)
      anguloCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: anguloColors.text } }
      anguloCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: anguloColors.bg } }
      anguloCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Tipo Contenido
      const tipoContCell = row.getCell(6)
      tipoContCell.value = post.tipo_contenido || ''
      tipoContCell.font = { name: 'Arial', size: 9, color: { argb: '475569' } }
      tipoContCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      tipoContCell.alignment = { vertical: 'top', horizontal: 'center', wrapText: true }

      // Objetivo
      const objCell = row.getCell(7)
      objCell.value = post.objetivo || ''
      objCell.font = { name: 'Arial', size: 9, color: { argb: '475569' } }
      objCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      objCell.alignment = { vertical: 'top', horizontal: 'center', wrapText: true }

      // TÍTULO GRÁFICO (destacado — columna principal para diseñador)
      const grafCell = row.getCell(8)
      grafCell.value = (post.copy_grafica || '').replace(/---/g, '\n')
      grafCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: '6D28D9' } }
      grafCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5F3FF' } }
      grafCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

      // Copy (caption)
      const copyCell = row.getCell(9)
      copyCell.value = post.copy
      copyCell.font = { name: 'Arial', size: 9, color: { argb: '334155' } }
      copyCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      copyCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

      // Hashtags
      const hashCell = row.getCell(10)
      hashCell.value = post.hashtags
      hashCell.font = { name: 'Arial', size: 9, color: { argb: '2563EB' } }
      hashCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
      hashCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

      // Instrucciones Diseño (destacado para diseñador)
      const notaCell = row.getCell(11)
      notaCell.value = post.nota_interna
      notaCell.font = { name: 'Arial', size: 9, italic: true, color: { argb: '92400E' } }
      notaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER_LIGHT } }
      notaCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }

      // Imagen (vacío, verde para que el diseñador lo llene)
      const imgCell = row.getCell(12)
      imgCell.value = ''
      imgCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN_LIGHT } }
      imgCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Score
      const scoreCell = row.getCell(13)
      scoreCell.value = score
      scoreCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: score >= 80 ? '065F46' : score >= 60 ? '92400E' : '991B1B' } }
      scoreCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: score >= 80 ? 'D1FAE5' : score >= 60 ? 'FEF3C7' : 'FEE2E2' } }
      scoreCell.alignment = { vertical: 'top', horizontal: 'center' }

      // Borders
      for (let c = 1; c <= 13; c++) {
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
    ws.mergeCells(`A${footerRowNum}:M${footerRowNum}`)
    const footerCell = ws.getCell(`A${footerRowNum}`)
    footerCell.value = `Generado por Muller y Pérez · mulleryperez.cl · ${new Date().toLocaleDateString('es-CL')} · Pipeline OpenAI→Claude`
    footerCell.font = { name: 'Arial', size: 9, italic: true, color: { argb: '94A3B8' } }
    footerCell.alignment = { horizontal: 'center' }

    // Freeze header
    ws.views = [{ state: 'frozen', ySplit: 4 }]

    // Auto filter
    ws.autoFilter = { from: 'A4', to: 'M4' }

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
