import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import PptxGenJS from 'pptxgenjs'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DARK = '0A1628'
const BLUE = '0055A4'
const WHITE = 'FFFFFF'
const GRAY = '64748B'
const GL = 'F1F5F9'
const GREEN = '059669'
const RED = 'DC2626'
const AMBER = 'D97706'
const PURPLE = '7C3AED'

type Score = { dimension: string; nota: number; justificacion: string }

function hdr(s: PptxGenJS.Slide, p: PptxGenJS, t: string, sub?: string) {
  s.addShape(p.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 1.1, fill: { color: DARK } })
  s.addText(t, { x: 0.6, y: 0.15, w: 10, h: 0.45, fontSize: 20, bold: true, color: WHITE, fontFace: 'Arial' })
  if (sub) s.addText(sub, { x: 0.6, y: 0.6, w: 10, h: 0.3, fontSize: 10, color: '93C5FD', fontFace: 'Arial' })
  s.addText('M&P', { x: 11.5, y: 0.35, w: 1.5, h: 0.3, fontSize: 9, color: '475569', fontFace: 'Arial', align: 'right' })
}

function ftr(s: PptxGenJS.Slide, pg: number, tot: number) {
  s.addText('mulleryperez.cl · contacto@mulleryperez.cl', { x: 0.5, y: 7.1, w: 8, h: 0.25, fontSize: 7, color: '94A3B8', fontFace: 'Arial' })
  s.addText(`${pg}/${tot}`, { x: 11.5, y: 7.1, w: 1.5, h: 0.25, fontSize: 7, color: '94A3B8', fontFace: 'Arial', align: 'right' })
}

const nc = (n: number) => n === 0 ? GRAY : n >= 7 ? GREEN : n >= 5 ? AMBER : RED
const bg = (n: number) => n === 0 ? GL : n >= 7 ? 'D1FAE5' : n >= 5 ? 'FEF3C7' : 'FEE2E2'

export async function GET(req: NextRequest) {
  try {
    const cid = new URL(req.url).searchParams.get('cliente_id')
    if (!cid) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })

    const { data: bm } = await supabase.from('benchmarks_cliente').select('*, clientes(nombre, rubro)').eq('cliente_id', cid).single()
    if (!bm?.resultado) return NextResponse.json({ error: 'No hay benchmark' }, { status: 404 })

    const r = bm.resultado as Record<string, unknown>
    const cl = r.cliente as Record<string, unknown>
    const comps = (r.competidores as Array<Record<string, unknown>>).filter(c => !c.error && c.scores)
    const est = (r.estrategia || r.comparativo || {}) as Record<string, unknown>
    const nombre = (bm.clientes as Record<string, string>)?.nombre || 'Cliente'
    const rubro = (bm.clientes as Record<string, string>)?.rubro || ''
    const clScores = (cl?.scores || []) as Score[]
    const tot = 6 + comps.length

    const pptx = new PptxGenJS()
    pptx.layout = 'LAYOUT_WIDE'
    pptx.author = 'Muller y Pérez'

    // ===== S1: PORTADA =====
    const s1 = pptx.addSlide()
    s1.background = { color: DARK }
    s1.addShape(pptx.ShapeType.rect, { x: 0, y: 5.2, w: 13.33, h: 2.3, fill: { color: BLUE } })
    s1.addText('BENCHMARK', { x: 0.8, y: 1.2, w: 11, h: 0.6, fontSize: 16, color: GRAY, fontFace: 'Arial', bold: true })
    s1.addText('COMPETITIVO', { x: 0.8, y: 1.7, w: 11, h: 1, fontSize: 44, bold: true, color: WHITE, fontFace: 'Arial' })
    s1.addText(nombre.toUpperCase(), { x: 0.8, y: 2.9, w: 11, h: 0.7, fontSize: 26, color: '93C5FD', fontFace: 'Arial' })
    s1.addText(`${rubro} · ${comps.length} competidores · ${new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}`, { x: 0.8, y: 3.5, w: 11, h: 0.4, fontSize: 12, color: GRAY, fontFace: 'Arial' })
    s1.addText('Muller y Pérez — Performance Marketing', { x: 0.8, y: 5.5, w: 6, h: 0.4, fontSize: 14, bold: true, color: WHITE, fontFace: 'Arial' })
    s1.addText('mulleryperez.cl · +56 9 5419 7432', { x: 0.8, y: 5.9, w: 6, h: 0.3, fontSize: 11, color: 'BFDBFE', fontFace: 'Arial' })

    // ===== S2: RESUMEN + RANKING =====
    const s2 = pptx.addSlide()
    hdr(s2, pptx, 'RESUMEN EJECUTIVO', `${nombre} vs ${comps.length} competidores`)
    s2.addText(String(est?.resumen_ejecutivo || ''), { x: 0.6, y: 1.3, w: 12, h: 1.8, fontSize: 11, color: '334155', fontFace: 'Arial', lineSpacingMultiple: 1.4 })

    const ranking = (est?.ranking as Array<Record<string, unknown>>) || []
    ranking.slice(0, 5).forEach((rk, i) => {
      const x = 0.5 + i * 2.55
      const isCl = String(rk.nombre) === nombre
      s2.addShape(pptx.ShapeType.rect, { x, y: 3.5, w: 2.3, h: 2, fill: { color: isCl ? 'DBEAFE' : GL }, rectRadius: 0.08 })
      s2.addText(`#${i + 1}`, { x, y: 3.55, w: 2.3, h: 0.25, fontSize: 9, color: GRAY, align: 'center', fontFace: 'Arial' })
      s2.addText(String(rk.promedio || '?'), { x, y: 3.8, w: 2.3, h: 0.6, fontSize: 26, bold: true, color: isCl ? BLUE : '334155', align: 'center', fontFace: 'Arial' })
      s2.addText(String(rk.nombre), { x, y: 4.4, w: 2.3, h: 0.3, fontSize: 9, bold: true, color: '334155', align: 'center', fontFace: 'Arial' })
      s2.addText(`✓ ${String(rk.mejor_dimension || '')}`, { x, y: 4.8, w: 2.3, h: 0.25, fontSize: 7, color: GREEN, align: 'center', fontFace: 'Arial' })
      s2.addText(`✕ ${String(rk.peor_dimension || '')}`, { x, y: 5.0, w: 2.3, h: 0.25, fontSize: 7, color: RED, align: 'center', fontFace: 'Arial' })
    })
    ftr(s2, 2, tot)

    // ===== S3: TABLA 15 DIMENSIONES =====
    const s3 = pptx.addSlide()
    hdr(s3, pptx, 'EVALUACIÓN — 15 DIMENSIONES', 'Rúbrica objetiva · Cada nota con justificación')

    if (clScores.length > 0) {
      const cW = [2.8, 0.9, ...comps.map(() => 0.9), 5]
      const adjustedCW = cW.map((w, i) => i === cW.length - 1 ? 12.7 - cW.slice(0, -1).reduce((a, b) => a + b, 0) : w)

      const rows: PptxGenJS.TableRow[] = [[
        { text: 'Dimensión', options: { fill: { color: DARK }, color: WHITE, fontSize: 7, bold: true } },
        { text: nombre.substring(0, 12), options: { fill: { color: DARK }, color: '93C5FD', fontSize: 7, bold: true, align: 'center' as const } },
        ...comps.map(c => ({ text: String(c.nombre).substring(0, 12), options: { fill: { color: DARK }, color: WHITE, fontSize: 7, bold: true, align: 'center' as const } })),
        { text: 'Justificación', options: { fill: { color: DARK }, color: WHITE, fontSize: 7, bold: true } },
      ]]

      const bloques = [
        { label: 'COMUNICACIÓN', color: '1E3A5F', start: 0, end: 6 },
        { label: 'DIGITAL', color: PURPLE, start: 6, end: 11 },
        { label: 'ESTRATÉGICO', color: GREEN, start: 11, end: 15 },
      ]

      bloques.forEach(b => {
        rows.push([{ text: b.label, options: { fill: { color: b.color }, color: WHITE, fontSize: 7, bold: true, align: 'center' as const, colspan: 2 + comps.length + 1 } }])
        clScores.slice(b.start, b.end).forEach((s, i) => {
          const idx = b.start + i
          rows.push([
            { text: s.dimension, options: { fontSize: 7, bold: true, color: '334155' } },
            { text: s.nota === 0 ? '—' : String(s.nota), options: { fontSize: 8, bold: true, color: nc(s.nota), fill: { color: bg(s.nota) }, align: 'center' as const } },
            ...comps.map(c => {
              const cs = (c.scores as Score[])?.[idx]
              const n = cs?.nota || 0
              return { text: n === 0 ? '—' : String(n), options: { fontSize: 8, bold: true, color: nc(n), fill: { color: bg(n) }, align: 'center' as const } }
            }),
            { text: s.justificacion || '', options: { fontSize: 6, color: '475569', italic: true } },
          ])
        })
      })

      s3.addTable(rows, { x: 0.3, y: 1.3, w: 12.7, colW: adjustedCW, border: { pt: 0.4, color: 'E5E7EB' }, rowH: 0.28 })
    }
    ftr(s3, 3, tot)

    // ===== S4+: COMPETIDORES =====
    let pg = 4
    comps.forEach(c => {
      const sc = pptx.addSlide()
      hdr(sc, pptx, String(c.nombre).toUpperCase(), String(c.web || ''))
      sc.addText(String(c.propuesta_valor_resumida || ''), { x: 0.6, y: 1.3, w: 12, h: 0.8, fontSize: 11, color: '334155', fontFace: 'Arial' })

      const cTono = c.tono as Record<string, string> | undefined
      if (cTono) {
        sc.addText(`Tono: ${cTono.descripcion || ''} · Formalidad ${cTono.formalidad}/10 · Calidez ${cTono.calidez}/10`, { x: 0.6, y: 2.2, w: 12, h: 0.3, fontSize: 9, color: GRAY, fontFace: 'Arial' })
      }

      // Top scores for this competitor
      const cScores = (c.scores as Score[]) || []
      const sorted = [...cScores].filter(s => s.nota > 0).sort((a, b) => b.nota - a.nota)
      const top3 = sorted.slice(0, 3)
      const bot3 = sorted.slice(-3).reverse()

      sc.addShape(pptx.ShapeType.rect, { x: 0.6, y: 2.8, w: 5.8, h: 2.2, fill: { color: 'D1FAE5' }, rectRadius: 0.08 })
      sc.addText('FORTALEZAS', { x: 0.8, y: 2.9, w: 5.4, h: 0.3, fontSize: 10, bold: true, color: GREEN, fontFace: 'Arial' })
      top3.forEach((s, i) => {
        sc.addText(`${s.nota}/10 — ${s.dimension}: ${s.justificacion}`, { x: 0.8, y: 3.3 + i * 0.5, w: 5.4, h: 0.45, fontSize: 8, color: '065F46', fontFace: 'Arial' })
      })

      sc.addShape(pptx.ShapeType.rect, { x: 6.8, y: 2.8, w: 5.8, h: 2.2, fill: { color: 'FEE2E2' }, rectRadius: 0.08 })
      sc.addText('DEBILIDADES', { x: 7, y: 2.9, w: 5.4, h: 0.3, fontSize: 10, bold: true, color: RED, fontFace: 'Arial' })
      bot3.forEach((s, i) => {
        sc.addText(`${s.nota}/10 — ${s.dimension}: ${s.justificacion}`, { x: 7, y: 3.3 + i * 0.5, w: 5.4, h: 0.45, fontSize: 8, color: '991B1B', fontFace: 'Arial' })
      })

      ftr(sc, pg, tot)
      pg++
    })

    // ===== DIAGNÓSTICO =====
    const sd = pptx.addSlide()
    hdr(sd, pptx, 'DIAGNÓSTICO ESTRATÉGICO', 'Basado en scores reales')
    const secs = [
      { t: 'FORTALEZAS', items: (est?.fortalezas as string[]) || [], c: GREEN, b: 'D1FAE5' },
      { t: 'BRECHAS', items: (est?.brechas as string[]) || [], c: RED, b: 'FEE2E2' },
      { t: 'OPORTUNIDADES', items: (est?.oportunidades as string[]) || [], c: '2563EB', b: 'DBEAFE' },
    ]
    secs.forEach((sec, si) => {
      const x = 0.4 + si * 4.2
      sd.addShape(pptx.ShapeType.rect, { x, y: 1.3, w: 4, h: 5.2, fill: { color: sec.b }, rectRadius: 0.08 })
      sd.addText(sec.t, { x: x + 0.2, y: 1.4, w: 3.6, h: 0.35, fontSize: 11, bold: true, color: sec.c, fontFace: 'Arial' })
      sec.items.slice(0, 5).forEach((item, i) => {
        sd.addText(`• ${item}`, { x: x + 0.2, y: 1.9 + i * 0.85, w: 3.6, h: 0.8, fontSize: 9, color: '334155', fontFace: 'Arial', lineSpacingMultiple: 1.2 })
      })
    })
    ftr(sd, pg, tot)
    pg++

    // ===== TONO RECOMENDADO =====
    const tonoRec = est?.tono_recomendado as Record<string, unknown> | undefined
    if (tonoRec) {
      const st = pptx.addSlide()
      hdr(st, pptx, 'TONO RECOMENDADO', `Estrategia de comunicación para ${nombre}`)
      st.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 12, h: 1, fill: { color: 'F5F3FF' }, rectRadius: 0.08 })
      st.addText(String(tonoRec.descripcion || ''), { x: 0.8, y: 1.35, w: 11.5, h: 0.9, fontSize: 11, color: PURPLE, fontFace: 'Arial', lineSpacingMultiple: 1.3 })

      const palabras = (tonoRec.palabras_clave as string[]) || []
      st.addText('Palabras clave: ' + palabras.join(' · '), { x: 0.6, y: 2.5, w: 12, h: 0.3, fontSize: 10, bold: true, color: PURPLE, fontFace: 'Arial' })

      const siDecir = (tonoRec.si_decir as string[]) || (tonoRec.frases_ejemplo as string[]) || []
      const noDecir = (tonoRec.nunca_decir as string[]) || (tonoRec.que_nunca_decir as string[]) || []

      st.addShape(pptx.ShapeType.rect, { x: 0.6, y: 3.1, w: 5.8, h: 3.5, fill: { color: 'D1FAE5' }, rectRadius: 0.08 })
      st.addText('SÍ DECIR', { x: 0.8, y: 3.2, w: 5.4, h: 0.3, fontSize: 10, bold: true, color: GREEN, fontFace: 'Arial' })
      siDecir.slice(0, 5).forEach((f, i) => {
        st.addText(`"${f}"`, { x: 0.8, y: 3.6 + i * 0.55, w: 5.4, h: 0.5, fontSize: 9, italic: true, color: '065F46', fontFace: 'Arial' })
      })

      st.addShape(pptx.ShapeType.rect, { x: 6.8, y: 3.1, w: 5.8, h: 3.5, fill: { color: 'FEE2E2' }, rectRadius: 0.08 })
      st.addText('NUNCA DECIR', { x: 7, y: 3.2, w: 5.4, h: 0.3, fontSize: 10, bold: true, color: RED, fontFace: 'Arial' })
      noDecir.slice(0, 5).forEach((n, i) => {
        st.addText(`✕ ${n}`, { x: 7, y: 3.6 + i * 0.55, w: 5.4, h: 0.5, fontSize: 9, color: '991B1B', fontFace: 'Arial' })
      })
      ftr(st, pg, tot)
      pg++
    }

    // ===== CIERRE =====
    const sf = pptx.addSlide()
    sf.background = { color: DARK }
    sf.addShape(pptx.ShapeType.rect, { x: 0, y: 5, w: 13.33, h: 2.5, fill: { color: BLUE } })
    sf.addText('¿Siguiente paso?', { x: 0.8, y: 1.3, w: 11, h: 0.7, fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial' })

    const qw = (est?.quick_wins as string[]) || []
    qw.slice(0, 4).forEach((q, i) => {
      sf.addText(`${i + 1}. ${q}`, { x: 1, y: 2.3 + i * 0.55, w: 11, h: 0.5, fontSize: 13, color: '93C5FD', fontFace: 'Arial' })
    })

    sf.addText('Muller y Pérez — Performance Marketing', { x: 0.8, y: 5.3, w: 6, h: 0.4, fontSize: 15, bold: true, color: WHITE, fontFace: 'Arial' })
    sf.addText('contacto@mulleryperez.cl · +56 9 5419 7432 · mulleryperez.cl', { x: 0.8, y: 5.8, w: 6, h: 0.3, fontSize: 11, color: 'BFDBFE', fontFace: 'Arial' })

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
    console.error('Export error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
