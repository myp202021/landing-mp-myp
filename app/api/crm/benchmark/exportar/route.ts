import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import PptxGenJS from 'pptxgenjs'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// M&P Brand colors
const DARK = '0A1628'
const BLUE = '0055A4'
const BLUE_LIGHT = '2563EB'
const WHITE = 'FFFFFF'
const GRAY = '64748B'
const GRAY_LIGHT = 'F1F5F9'
const GREEN = '059669'
const RED = 'DC2626'
const AMBER = 'D97706'
const PURPLE = '7C3AED'

function addHeader(slide: PptxGenJS.Slide, pptx: PptxGenJS, title: string, subtitle?: string) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 1.2, fill: { color: DARK } })
  slide.addText(title, { x: 0.6, y: 0.15, w: 10, h: 0.5, fontSize: 22, bold: true, color: WHITE, fontFace: 'Arial' })
  if (subtitle) slide.addText(subtitle, { x: 0.6, y: 0.65, w: 10, h: 0.35, fontSize: 11, color: '93C5FD', fontFace: 'Arial' })
  slide.addText('MULLER Y PÉREZ', { x: 10.5, y: 0.4, w: 2.5, h: 0.3, fontSize: 9, color: '475569', fontFace: 'Arial', align: 'right' })
}

function addFooter(slide: PptxGenJS.Slide, page: number, total: number) {
  slide.addText(`mulleryperez.cl · contacto@mulleryperez.cl · +56 9 5419 7432`, { x: 0.6, y: 7.1, w: 8, h: 0.3, fontSize: 8, color: '94A3B8', fontFace: 'Arial' })
  slide.addText(`${page}/${total}`, { x: 11.5, y: 7.1, w: 1.5, h: 0.3, fontSize: 8, color: '94A3B8', fontFace: 'Arial', align: 'right' })
}

export async function GET(req: NextRequest) {
  try {
    const clienteId = new URL(req.url).searchParams.get('cliente_id')
    if (!clienteId) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

    const { data: benchmark } = await supabase
      .from('benchmarks_cliente')
      .select('*, clientes(nombre, rubro)')
      .eq('cliente_id', clienteId)
      .single()

    if (!benchmark?.resultado) return NextResponse.json({ error: 'No hay benchmark generado' }, { status: 404 })

    const r = benchmark.resultado as Record<string, unknown>
    const clienteData = r.cliente as Record<string, unknown>
    const competidores = r.competidores as Array<Record<string, unknown>>
    const comp = r.comparativo as Record<string, unknown>
    const nombre = (benchmark.clientes as Record<string, string>)?.nombre || 'Cliente'
    const rubro = (benchmark.clientes as Record<string, string>)?.rubro || ''
    const compCount = competidores.filter(c => !c.error).length
    const totalSlides = 7 + compCount

    const pptx = new PptxGenJS()
    pptx.layout = 'LAYOUT_WIDE'
    pptx.author = 'Muller y Pérez'

    // ===== SLIDE 1: PORTADA =====
    const s1 = pptx.addSlide()
    s1.background = { color: DARK }
    s1.addShape(pptx.ShapeType.rect, { x: 0, y: 5.5, w: 13.33, h: 2, fill: { color: BLUE } })
    s1.addText('BENCHMARK', { x: 0.8, y: 1.2, w: 11, h: 0.8, fontSize: 18, color: '475569', fontFace: 'Arial', bold: true })
    s1.addText('COMPETITIVO', { x: 0.8, y: 1.8, w: 11, h: 1.2, fontSize: 48, bold: true, color: WHITE, fontFace: 'Arial' })
    s1.addText(nombre.toUpperCase(), { x: 0.8, y: 3.2, w: 11, h: 0.8, fontSize: 28, color: '93C5FD', fontFace: 'Arial' })
    s1.addText(rubro, { x: 0.8, y: 3.9, w: 11, h: 0.5, fontSize: 14, color: '64748B', fontFace: 'Arial' })
    s1.addText(`${compCount} competidores analizados · ${new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}`, { x: 0.8, y: 5.8, w: 6, h: 0.4, fontSize: 12, color: 'BFDBFE', fontFace: 'Arial' })
    s1.addText('Muller y Pérez\nPerformance Marketing', { x: 8, y: 5.7, w: 4.5, h: 0.8, fontSize: 13, color: WHITE, fontFace: 'Arial', align: 'right', bold: true })

    // ===== SLIDE 2: RESUMEN EJECUTIVO =====
    const s2 = pptx.addSlide()
    addHeader(s2, pptx, 'RESUMEN EJECUTIVO', `${nombre} vs ${compCount} competidores`)
    s2.addText((comp?.resumen_ejecutivo as string) || '', { x: 0.6, y: 1.5, w: 12, h: 1.8, fontSize: 13, color: '334155', fontFace: 'Arial', lineSpacingMultiple: 1.3 })

    // Score cards
    const scores = comp?.score_digital as Record<string, unknown> | undefined
    if (scores) {
      const dims = (scores.dimensiones as string[]) || []
      const scoresData = scores.scores as Record<string, number[]>
      const entries = Object.entries(scoresData)
      if (entries.length > 0 && dims.length > 0) {
        const tableRows: PptxGenJS.TableRow[] = [
          [{ text: '', options: { fill: { color: DARK }, color: WHITE, fontSize: 9, bold: true } },
           ...dims.map(d => ({ text: d, options: { fill: { color: DARK }, color: WHITE, fontSize: 8, bold: true, align: 'center' as const } }))]
        ]
        entries.forEach(([name, vals]) => {
          const isClient = name === nombre
          tableRows.push([
            { text: name, options: { bold: true, fontSize: 9, fill: { color: isClient ? 'DBEAFE' : GRAY_LIGHT }, color: isClient ? BLUE : '334155' } },
            ...vals.map(v => ({ text: `${v}/10`, options: { fontSize: 9, align: 'center' as const, fill: { color: v >= 7 ? 'D1FAE5' : v >= 5 ? 'FEF3C7' : 'FEE2E2' }, color: v >= 7 ? GREEN : v >= 5 ? AMBER : RED, bold: true } }))
          ])
        })
        s2.addTable(tableRows, { x: 0.6, y: 3.8, w: 12, colW: [2, ...dims.map(() => (12 - 2) / dims.length)], border: { pt: 0.5, color: 'E5E7EB' } })
      }
    }
    addFooter(s2, 2, totalSlides)

    // ===== SLIDE 3: ANÁLISIS CLIENTE =====
    const s3 = pptx.addSlide()
    addHeader(s3, pptx, `ANÁLISIS — ${nombre.toUpperCase()}`, clienteData?.web as string || '')
    if (clienteData) {
      const tono = clienteData.tono_comunicacional as Record<string, string> | undefined
      // Left column
      s3.addText('Propuesta de valor', { x: 0.6, y: 1.5, w: 5.5, h: 0.3, fontSize: 10, bold: true, color: BLUE, fontFace: 'Arial' })
      s3.addText((clienteData.propuesta_valor as string) || '', { x: 0.6, y: 1.8, w: 5.5, h: 0.8, fontSize: 10, color: '334155', fontFace: 'Arial', lineSpacingMultiple: 1.2 })

      s3.addText('Tono comunicacional', { x: 0.6, y: 2.8, w: 5.5, h: 0.3, fontSize: 10, bold: true, color: BLUE, fontFace: 'Arial' })
      s3.addText(tono?.descripcion || '', { x: 0.6, y: 3.1, w: 5.5, h: 0.6, fontSize: 10, color: '334155', fontFace: 'Arial' })
      if (tono) {
        s3.addText(`Formalidad: ${tono.formalidad}/10 · Calidez: ${tono.calidez}/10 · Tecnicismo: ${tono.tecnicismo}/10`, { x: 0.6, y: 3.7, w: 5.5, h: 0.3, fontSize: 9, color: GRAY, fontFace: 'Arial' })
        s3.addText(`Personalidad: ${tono.personalidad || ''}`, { x: 0.6, y: 4.0, w: 5.5, h: 0.3, fontSize: 9, italic: true, color: PURPLE, fontFace: 'Arial' })
      }

      // Right column — Ideas fuerza
      s3.addShape(pptx.ShapeType.rect, { x: 6.5, y: 1.5, w: 6.2, h: 3.5, fill: { color: GRAY_LIGHT }, rectRadius: 0.1 })
      s3.addText('Ideas fuerza', { x: 6.8, y: 1.6, w: 5.5, h: 0.3, fontSize: 10, bold: true, color: BLUE, fontFace: 'Arial' })
      const ideas = (clienteData.ideas_fuerza as string[]) || []
      ideas.forEach((idea, i) => {
        s3.addText(`→ ${idea}`, { x: 6.8, y: 2.0 + i * 0.35, w: 5.7, h: 0.35, fontSize: 9, color: '475569', fontFace: 'Arial' })
      })

      // Bottom — Debilidades
      s3.addShape(pptx.ShapeType.rect, { x: 0.6, y: 4.6, w: 12, h: 0.03, fill: { color: 'E5E7EB' } })
      s3.addText('Debilidades detectadas', { x: 0.6, y: 4.8, w: 12, h: 0.3, fontSize: 10, bold: true, color: RED, fontFace: 'Arial' })
      const debs = (clienteData.debilidades_comunicacion as string[]) || []
      const debCols = [debs.slice(0, 3), debs.slice(3)]
      debCols.forEach((col, ci) => {
        col.forEach((d, i) => {
          s3.addText(`⚠ ${d}`, { x: 0.6 + ci * 6.2, y: 5.2 + i * 0.35, w: 5.8, h: 0.35, fontSize: 9, color: '991B1B', fontFace: 'Arial' })
        })
      })
    }
    addFooter(s3, 3, totalSlides)

    // ===== SLIDES 4+: COMPETIDORES =====
    let slideNum = 4
    for (const c of competidores.filter(c => !c.error)) {
      const sc = pptx.addSlide()
      addHeader(sc, pptx, (c.nombre as string || '').toUpperCase(), c.web as string || '')
      const tono = c.tono_comunicacional as Record<string, string> | undefined

      sc.addText('Propuesta de valor', { x: 0.6, y: 1.5, w: 5.5, h: 0.3, fontSize: 10, bold: true, color: GRAY, fontFace: 'Arial' })
      sc.addText((c.propuesta_valor as string) || '', { x: 0.6, y: 1.8, w: 5.5, h: 0.7, fontSize: 10, color: '334155', fontFace: 'Arial' })

      if (tono) {
        sc.addText(`Tono: ${tono.descripcion || ''}`, { x: 0.6, y: 2.6, w: 5.5, h: 0.5, fontSize: 9, color: '475569', fontFace: 'Arial' })
        sc.addText(`Formalidad: ${tono.formalidad}/10 · Calidez: ${tono.calidez}/10 · Tecnicismo: ${tono.tecnicismo}/10`, { x: 0.6, y: 3.1, w: 5.5, h: 0.3, fontSize: 9, color: GRAY, fontFace: 'Arial' })
      }

      // Right — Ideas fuerza
      sc.addShape(pptx.ShapeType.rect, { x: 6.5, y: 1.5, w: 6.2, h: 2.5, fill: { color: GRAY_LIGHT }, rectRadius: 0.1 })
      sc.addText('Ideas fuerza', { x: 6.8, y: 1.6, w: 5.5, h: 0.3, fontSize: 10, bold: true, color: GRAY, fontFace: 'Arial' })
      ;((c.ideas_fuerza as string[]) || []).forEach((idea, i) => {
        sc.addText(`→ ${idea}`, { x: 6.8, y: 2.0 + i * 0.32, w: 5.7, h: 0.32, fontSize: 9, color: '475569', fontFace: 'Arial' })
      })

      // Bottom — vs cliente
      sc.addShape(pptx.ShapeType.rect, { x: 0.6, y: 4.3, w: 12, h: 0.03, fill: { color: 'E5E7EB' } })
      const mejor = (c[`que_hace_mejor_que_${nombre.toLowerCase().replace(/\s/g, '_')}`] as string[]) || (c.diferenciadores as string[]) || []
      const peor = (c.que_hace_peor as string[]) || (c.debilidades as string[]) || []

      sc.addShape(pptx.ShapeType.rect, { x: 0.6, y: 4.5, w: 5.8, h: 2.2, fill: { color: 'FEE2E2' }, rectRadius: 0.08 })
      sc.addText(`Donde le gana a ${nombre}`, { x: 0.8, y: 4.6, w: 5.4, h: 0.3, fontSize: 9, bold: true, color: RED, fontFace: 'Arial' })
      mejor.slice(0, 4).forEach((m, i) => {
        sc.addText(`• ${m}`, { x: 0.8, y: 5.0 + i * 0.35, w: 5.4, h: 0.35, fontSize: 9, color: '991B1B', fontFace: 'Arial' })
      })

      sc.addShape(pptx.ShapeType.rect, { x: 6.8, y: 4.5, w: 5.8, h: 2.2, fill: { color: 'D1FAE5' }, rectRadius: 0.08 })
      sc.addText(`Donde ${nombre} le gana`, { x: 7, y: 4.6, w: 5.4, h: 0.3, fontSize: 9, bold: true, color: GREEN, fontFace: 'Arial' })
      peor.slice(0, 4).forEach((p, i) => {
        sc.addText(`• ${p}`, { x: 7, y: 5.0 + i * 0.35, w: 5.4, h: 0.35, fontSize: 9, color: '065F46', fontFace: 'Arial' })
      })

      addFooter(sc, slideNum, totalSlides)
      slideNum++
    }

    // ===== SLIDE: TABLA COMPARATIVA =====
    const st = pptx.addSlide()
    addHeader(st, pptx, 'TABLA COMPARATIVA', 'Evaluación por dimensión')
    const tabla = (comp?.tabla_comparativa as Array<Record<string, string>>) || []
    if (tabla.length > 0) {
      const tableRows: PptxGenJS.TableRow[] = [
        [
          { text: 'Dimensión', options: { fill: { color: DARK }, color: WHITE, fontSize: 9, bold: true } },
          { text: nombre, options: { fill: { color: DARK }, color: '93C5FD', fontSize: 9, bold: true, align: 'center' as const } },
          { text: 'Mejor competidor', options: { fill: { color: DARK }, color: WHITE, fontSize: 9, bold: true, align: 'center' as const } },
          { text: 'Evaluación', options: { fill: { color: DARK }, color: WHITE, fontSize: 9, bold: true, align: 'center' as const } },
        ]
      ]
      tabla.forEach(row => {
        const evalColor = row.evaluacion === 'ventaja' ? GREEN : row.evaluacion === 'desventaja' ? RED : AMBER
        const evalBg = row.evaluacion === 'ventaja' ? 'D1FAE5' : row.evaluacion === 'desventaja' ? 'FEE2E2' : 'FEF3C7'
        tableRows.push([
          { text: row.dimension, options: { fontSize: 9, bold: true, color: '334155' } },
          { text: row.cliente, options: { fontSize: 8, color: '475569', align: 'center' as const } },
          { text: row.mejor_competidor, options: { fontSize: 8, color: '475569', align: 'center' as const } },
          { text: row.evaluacion?.toUpperCase() || '', options: { fontSize: 8, bold: true, color: evalColor, fill: { color: evalBg }, align: 'center' as const } },
        ])
      })
      st.addTable(tableRows, { x: 0.6, y: 1.5, w: 12, colW: [3, 3.5, 3.5, 2], border: { pt: 0.5, color: 'E5E7EB' } })
    }
    addFooter(st, slideNum, totalSlides)
    slideNum++

    // ===== SLIDE: FORTALEZAS + BRECHAS + OPORTUNIDADES =====
    const sf = pptx.addSlide()
    addHeader(sf, pptx, 'DIAGNÓSTICO ESTRATÉGICO', 'Fortalezas · Brechas · Oportunidades')

    const sections = [
      { title: 'FORTALEZAS', items: (comp?.fortalezas_cliente as string[]) || [], color: GREEN, bg: 'D1FAE5', icon: '✓' },
      { title: 'BRECHAS CRÍTICAS', items: (comp?.brechas_criticas as string[]) || [], color: RED, bg: 'FEE2E2', icon: '⚠' },
      { title: 'OPORTUNIDADES', items: (comp?.oportunidades_accionables as string[]) || [], color: BLUE_LIGHT, bg: 'DBEAFE', icon: '→' },
    ]
    sections.forEach((sec, si) => {
      const x = 0.4 + si * 4.2
      sf.addShape(pptx.ShapeType.rect, { x, y: 1.5, w: 4, h: 5.3, fill: { color: sec.bg }, rectRadius: 0.1 })
      sf.addText(sec.title, { x: x + 0.2, y: 1.6, w: 3.6, h: 0.4, fontSize: 11, bold: true, color: sec.color, fontFace: 'Arial' })
      sec.items.slice(0, 5).forEach((item, i) => {
        sf.addText(`${sec.icon} ${item}`, { x: x + 0.2, y: 2.2 + i * 0.6, w: 3.6, h: 0.55, fontSize: 9, color: '334155', fontFace: 'Arial', lineSpacingMultiple: 1.1 })
      })
    })
    addFooter(sf, slideNum, totalSlides)
    slideNum++

    // ===== SLIDE: TONO RECOMENDADO + PILARES =====
    const sr = pptx.addSlide()
    addHeader(sr, pptx, 'TONO RECOMENDADO', `Estrategia de comunicación para ${nombre}`)
    const tonoRec = comp?.tono_recomendado as Record<string, unknown> | undefined
    if (tonoRec) {
      sr.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.5, w: 12, h: 1.2, fill: { color: 'F5F3FF' }, rectRadius: 0.1 })
      sr.addText((tonoRec.descripcion as string) || '', { x: 0.8, y: 1.6, w: 11.5, h: 1, fontSize: 12, color: PURPLE, fontFace: 'Arial', lineSpacingMultiple: 1.3 })

      // Palabras clave
      sr.addText('Palabras clave:', { x: 0.6, y: 2.9, w: 12, h: 0.3, fontSize: 10, bold: true, color: '334155', fontFace: 'Arial' })
      const palabras = (tonoRec.palabras_clave as string[]) || []
      sr.addText(palabras.join('  ·  '), { x: 0.6, y: 3.2, w: 12, h: 0.3, fontSize: 10, bold: true, color: PURPLE, fontFace: 'Arial' })

      // Frases ejemplo + Qué nunca decir
      const frases = (tonoRec.frases_ejemplo as string[]) || []
      const nunca = (tonoRec.que_nunca_decir as string[]) || []

      sr.addShape(pptx.ShapeType.rect, { x: 0.6, y: 3.8, w: 5.8, h: 3, fill: { color: 'D1FAE5' }, rectRadius: 0.08 })
      sr.addText('SÍ DECIR', { x: 0.8, y: 3.9, w: 5.4, h: 0.3, fontSize: 10, bold: true, color: GREEN, fontFace: 'Arial' })
      frases.slice(0, 5).forEach((f, i) => {
        sr.addText(`"${f}"`, { x: 0.8, y: 4.3 + i * 0.45, w: 5.4, h: 0.4, fontSize: 9, italic: true, color: '065F46', fontFace: 'Arial' })
      })

      sr.addShape(pptx.ShapeType.rect, { x: 6.8, y: 3.8, w: 5.8, h: 3, fill: { color: 'FEE2E2' }, rectRadius: 0.08 })
      sr.addText('NUNCA DECIR', { x: 7, y: 3.9, w: 5.4, h: 0.3, fontSize: 10, bold: true, color: RED, fontFace: 'Arial' })
      nunca.slice(0, 5).forEach((n, i) => {
        sr.addText(`✕ ${n}`, { x: 7, y: 4.3 + i * 0.45, w: 5.4, h: 0.4, fontSize: 9, color: '991B1B', fontFace: 'Arial' })
      })
    }
    addFooter(sr, slideNum, totalSlides)
    slideNum++

    // ===== SLIDE: CIERRE =====
    const sc2 = pptx.addSlide()
    sc2.background = { color: DARK }
    sc2.addShape(pptx.ShapeType.rect, { x: 0, y: 5, w: 13.33, h: 2.5, fill: { color: BLUE } })
    sc2.addText('¿Siguiente paso?', { x: 0.8, y: 1.5, w: 11, h: 0.8, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' })

    const qwins = (comp?.quick_wins as string[]) || []
    qwins.slice(0, 4).forEach((qw, i) => {
      sc2.addText(`${i + 1}. ${qw}`, { x: 1, y: 2.5 + i * 0.5, w: 11, h: 0.45, fontSize: 13, color: '93C5FD', fontFace: 'Arial' })
    })

    sc2.addText('Muller y Pérez — Performance Marketing', { x: 0.8, y: 5.3, w: 6, h: 0.5, fontSize: 16, bold: true, color: WHITE, fontFace: 'Arial' })
    sc2.addText('contacto@mulleryperez.cl\n+56 9 5419 7432\nmulleryperez.cl', { x: 0.8, y: 5.9, w: 6, h: 1, fontSize: 12, color: 'BFDBFE', fontFace: 'Arial' })

    // Generate
    const buf = await pptx.write({ outputType: 'nodebuffer' }) as Buffer
    const buffer = new Uint8Array(buf)
    const filename = `Benchmark_${nombre.replace(/\s+/g, '_')}_MYP_${new Date().toISOString().split('T')[0]}.pptx`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    console.error('Export benchmark error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
