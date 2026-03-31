import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import PptxGenJS from 'pptxgenjs'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BLUE_DARK = '1E3A5F'
const BLUE = '2563EB'
const WHITE = 'FFFFFF'
const GRAY = '64748B'

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
    const clienteNombre = (benchmark.clientes as Record<string, string>)?.nombre || 'Cliente'
    const clienteRubro = (benchmark.clientes as Record<string, string>)?.rubro || ''

    const pptx = new PptxGenJS()
    pptx.layout = 'LAYOUT_WIDE'
    pptx.author = 'Muller y Pérez'

    // ===== SLIDE 1: Portada =====
    const s1 = pptx.addSlide()
    s1.background = { color: BLUE_DARK }
    s1.addText('BENCHMARK COMPETITIVO', { x: 0.8, y: 1.5, w: 11, h: 1, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' })
    s1.addText(clienteNombre.toUpperCase(), { x: 0.8, y: 2.5, w: 11, h: 0.8, fontSize: 28, color: '93C5FD', fontFace: 'Arial' })
    s1.addText(`${clienteRubro} · ${new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}`, { x: 0.8, y: 3.3, w: 11, h: 0.5, fontSize: 14, color: '94A3B8', fontFace: 'Arial' })
    s1.addText('Muller y Pérez — Performance Marketing', { x: 0.8, y: 6.5, w: 11, h: 0.4, fontSize: 11, color: '64748B', fontFace: 'Arial' })

    // ===== SLIDE 2: Resumen Ejecutivo =====
    const s2 = pptx.addSlide()
    s2.addText('RESUMEN EJECUTIVO', { x: 0.5, y: 0.3, w: 12, h: 0.6, fontSize: 22, bold: true, color: BLUE_DARK, fontFace: 'Arial' })
    s2.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.9, w: 12, h: 0.03, fill: { color: BLUE } })
    s2.addText((comp?.resumen_ejecutivo as string) || '', { x: 0.5, y: 1.2, w: 12, h: 1.5, fontSize: 13, color: '334155', fontFace: 'Arial', paraSpaceAfter: 6 })

    // Score digital
    const scores = comp?.score_digital as Record<string, unknown> | undefined
    if (scores) {
      const scoreData = [
        { name: clienteNombre, score: scores.cliente as string, color: BLUE },
        ...Object.entries((scores.competidores as Record<string, string>) || {}).map(([n, s]) => ({ name: n, score: s, color: GRAY })),
      ]
      scoreData.forEach((s, i) => {
        const x = 0.5 + i * 3
        s2.addShape(pptx.ShapeType.rect, { x, y: 3, w: 2.5, h: 1.5, fill: { color: i === 0 ? 'DBEAFE' : 'F1F5F9' }, rectRadius: 0.1 })
        s2.addText(s.score + '/10', { x, y: 3.1, w: 2.5, h: 0.8, fontSize: 28, bold: true, color: s.color, align: 'center', fontFace: 'Arial' })
        s2.addText(s.name, { x, y: 3.9, w: 2.5, h: 0.4, fontSize: 10, color: GRAY, align: 'center', fontFace: 'Arial' })
      })
    }

    // ===== SLIDE 3: Análisis Cliente =====
    const s3 = pptx.addSlide()
    s3.addText(`ANÁLISIS — ${clienteNombre.toUpperCase()}`, { x: 0.5, y: 0.3, w: 12, h: 0.6, fontSize: 22, bold: true, color: BLUE_DARK, fontFace: 'Arial' })
    s3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.9, w: 12, h: 0.03, fill: { color: BLUE } })
    if (clienteData) {
      s3.addText(`Propuesta de valor: ${clienteData.propuesta_valor || ''}`, { x: 0.5, y: 1.2, w: 12, h: 0.5, fontSize: 12, color: '334155', fontFace: 'Arial' })
      s3.addText(`Tono: ${clienteData.tono || ''} (formalidad: ${clienteData.nivel_formalidad || '?'}/10)`, { x: 0.5, y: 1.7, w: 12, h: 0.4, fontSize: 12, color: '334155', fontFace: 'Arial' })
      const ideas = (clienteData.ideas_fuerza as string[]) || []
      ideas.forEach((idea, i) => {
        s3.addText(`→ ${idea}`, { x: 0.7, y: 2.3 + i * 0.35, w: 11, h: 0.35, fontSize: 11, color: '475569', fontFace: 'Arial' })
      })
    }

    // ===== SLIDES 4+: Competidores =====
    competidores.forEach((c) => {
      const sc = pptx.addSlide()
      sc.addText((c.nombre as string || '').toUpperCase(), { x: 0.5, y: 0.3, w: 12, h: 0.6, fontSize: 22, bold: true, color: BLUE_DARK, fontFace: 'Arial' })
      sc.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.9, w: 12, h: 0.03, fill: { color: GRAY } })
      sc.addText(c.web as string || '', { x: 0.5, y: 1.0, w: 12, h: 0.3, fontSize: 10, color: GRAY, fontFace: 'Arial' })

      if (c.error) {
        sc.addText(c.error as string, { x: 0.5, y: 1.5, w: 12, h: 0.5, fontSize: 12, color: 'EF4444', fontFace: 'Arial' })
      } else {
        sc.addText(`Propuesta: ${c.propuesta_valor || ''}`, { x: 0.5, y: 1.5, w: 12, h: 0.5, fontSize: 12, color: '334155', fontFace: 'Arial' })
        sc.addText(`Tono: ${c.tono || ''} · Formalidad: ${c.nivel_formalidad || '?'}/10`, { x: 0.5, y: 2.0, w: 12, h: 0.4, fontSize: 11, color: '475569', fontFace: 'Arial' })
        const ideas = (c.ideas_fuerza as string[]) || []
        ideas.forEach((idea, i) => {
          sc.addText(`→ ${idea}`, { x: 0.7, y: 2.6 + i * 0.35, w: 11, h: 0.35, fontSize: 11, color: '475569', fontFace: 'Arial' })
        })
        const diffs = (c.diferenciadores as string[]) || []
        if (diffs.length) {
          sc.addText('Diferenciadores:', { x: 0.5, y: 2.6 + ideas.length * 0.35 + 0.2, w: 12, h: 0.3, fontSize: 11, bold: true, color: '059669', fontFace: 'Arial' })
          diffs.forEach((d, i) => {
            sc.addText(`✓ ${d}`, { x: 0.7, y: 2.6 + ideas.length * 0.35 + 0.5 + i * 0.3, w: 11, h: 0.3, fontSize: 10, color: '065F46', fontFace: 'Arial' })
          })
        }
      }
    })

    // ===== SLIDE: Fortalezas + Brechas + Oportunidades =====
    const sf = pptx.addSlide()
    sf.addText('ANÁLISIS COMPARATIVO', { x: 0.5, y: 0.3, w: 12, h: 0.6, fontSize: 22, bold: true, color: BLUE_DARK, fontFace: 'Arial' })
    sf.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.9, w: 12, h: 0.03, fill: { color: BLUE } })

    // 3 columns
    const cols = [
      { title: 'Fortalezas', items: (comp?.fortalezas_cliente as string[]) || [], color: '059669', bg: 'D1FAE5' },
      { title: 'Brechas', items: (comp?.brechas_cliente as string[]) || [], color: 'DC2626', bg: 'FEE2E2' },
      { title: 'Oportunidades', items: (comp?.oportunidades as string[]) || [], color: '2563EB', bg: 'DBEAFE' },
    ]
    cols.forEach((col, ci) => {
      const x = 0.5 + ci * 4.2
      sf.addShape(pptx.ShapeType.rect, { x, y: 1.2, w: 3.8, h: 0.4, fill: { color: col.bg }, rectRadius: 0.05 })
      sf.addText(col.title, { x, y: 1.2, w: 3.8, h: 0.4, fontSize: 12, bold: true, color: col.color, align: 'center', fontFace: 'Arial' })
      col.items.forEach((item, i) => {
        sf.addText(`• ${item}`, { x: x + 0.1, y: 1.8 + i * 0.45, w: 3.6, h: 0.4, fontSize: 10, color: '334155', fontFace: 'Arial' })
      })
    })

    // ===== SLIDE: Tono Recomendado =====
    const tonoRec = comp?.tono_recomendado as Record<string, unknown> | undefined
    if (tonoRec) {
      const st = pptx.addSlide()
      st.addText('TONO RECOMENDADO', { x: 0.5, y: 0.3, w: 12, h: 0.6, fontSize: 22, bold: true, color: BLUE_DARK, fontFace: 'Arial' })
      st.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.9, w: 12, h: 0.03, fill: { color: '7C3AED' } })
      st.addText(tonoRec.descripcion as string || '', { x: 0.5, y: 1.2, w: 12, h: 0.8, fontSize: 13, color: '334155', fontFace: 'Arial' })

      const palabras = (tonoRec.palabras_clave as string[]) || []
      st.addText('Palabras clave: ' + palabras.join(' · '), { x: 0.5, y: 2.2, w: 12, h: 0.4, fontSize: 11, bold: true, color: '7C3AED', fontFace: 'Arial' })

      const frases = (tonoRec.frases_ejemplo as string[]) || []
      frases.forEach((f, i) => {
        st.addText(`"${f}"`, { x: 0.7, y: 2.8 + i * 0.45, w: 11, h: 0.4, fontSize: 11, italic: true, color: '475569', fontFace: 'Arial' })
      })

      const evitar = (tonoRec.que_evitar as string[]) || []
      if (evitar.length) {
        st.addText('QUÉ EVITAR:', { x: 0.5, y: 2.8 + frases.length * 0.45 + 0.3, w: 12, h: 0.3, fontSize: 11, bold: true, color: 'DC2626', fontFace: 'Arial' })
        evitar.forEach((e, i) => {
          st.addText(`✕ ${e}`, { x: 0.7, y: 2.8 + frases.length * 0.45 + 0.6 + i * 0.3, w: 11, h: 0.3, fontSize: 10, color: '991B1B', fontFace: 'Arial' })
        })
      }
    }

    // ===== SLIDE: Cierre =====
    const sc = pptx.addSlide()
    sc.background = { color: BLUE_DARK }
    sc.addText('Muller y Pérez', { x: 0.8, y: 2.5, w: 11, h: 1, fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial', align: 'center' })
    sc.addText('Performance Marketing · mulleryperez.cl', { x: 0.8, y: 3.5, w: 11, h: 0.5, fontSize: 14, color: '94A3B8', fontFace: 'Arial', align: 'center' })
    sc.addText('contacto@mulleryperez.cl · +56 9 5419 7432', { x: 0.8, y: 4.0, w: 11, h: 0.4, fontSize: 12, color: '64748B', fontFace: 'Arial', align: 'center' })

    // Generate
    const buf = await pptx.write({ outputType: 'nodebuffer' }) as Buffer
    const buffer = new Uint8Array(buf)
    const filename = `Benchmark_${clienteNombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pptx`

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
