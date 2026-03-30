import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getEstacionalidadMes } from '@/lib/config/estacionalidad-chile'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export async function POST(req: NextRequest) {
  try {
    const { grilla_id, plataforma, tipo_post, dia, dia_semana, instrucciones } = await req.json()
    if (!grilla_id) return NextResponse.json({ error: 'grilla_id requerido' }, { status: 400 })

    // Load grilla + client
    const { data: grilla } = await supabase
      .from('grillas_contenido')
      .select('*, clientes(nombre, rubro)')
      .eq('id', grilla_id)
      .single()

    if (!grilla) return NextResponse.json({ error: 'Grilla no encontrada' }, { status: 404 })

    const cliente = grilla.clientes as { nombre: string; rubro: string }
    const existingPosts = grilla.posts as Array<{ copy: string; dia: number; plataforma: string }>

    // Load briefing
    const { data: briefing } = await supabase
      .from('briefings_cliente')
      .select('tono, cierre_obligatorio, analisis_tono, analisis_web, productos')
      .eq('cliente_id', grilla.cliente_id)
      .single()

    const tono = (briefing?.analisis_tono as Record<string, unknown>)?.tono_general || briefing?.tono || 'profesional'
    const estacionalidad = getEstacionalidadMes(cliente.rubro || 'general', grilla.mes)

    // Existing copies to avoid repetition
    const copiesExistentes = existingPosts.map(p => p.copy?.substring(0, 100)).filter(Boolean).join('\n• ')

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Eres un copywriter senior de performance marketing en Chile. Generas UN solo post de alta calidad para redes sociales. Escribes en español de Chile con acentos correctos.`
          },
          {
            role: 'user',
            content: `Genera UN post para ${cliente.nombre} (${cliente.rubro}).

Plataforma: ${plataforma || 'Facebook/Instagram'}
Tipo: ${tipo_post || 'Post'}
Día: ${dia_semana || 'Lunes'} ${dia || 1} de ${MESES[grilla.mes]} ${grilla.anio}
Tono: ${tono}
${briefing?.productos ? `Productos: ${briefing.productos}` : ''}
${(briefing?.analisis_web as Record<string, unknown> | null)?.propuesta_valor ? `Propuesta de valor: ${(briefing!.analisis_web as Record<string, unknown>).propuesta_valor}` : ''}
${briefing?.cierre_obligatorio ? `Cierre obligatorio: "${briefing.cierre_obligatorio}"` : ''}

Estacionalidad: ${estacionalidad}

${instrucciones ? `INSTRUCCIONES ESPECÍFICAS: ${instrucciones}` : ''}

NO REPETIR estas ideas (ya están en la grilla):
• ${copiesExistentes || 'ninguna'}

REGLAS:
- ${plataforma === 'LinkedIn' ? 'MÍNIMO 180 palabras' : 'MÍNIMO 100 palabras'}
- Estructura: gancho → desarrollo con datos → resolución → CTA
- NO frases genéricas, NO buzzwords, NO "¿Sabías que...?"
- Incluir nota_interna detallada para diseño

Responde SOLO JSON (un objeto, no array):
{
  "copy": "el copy completo desarrollado",
  "hashtags": "#Tag1 #Tag2 #Tag3 #Tag4 #Tag5",
  "nota_interna": "instrucciones de diseño detalladas"
}`
          }
        ],
        temperature: 0.6,
        max_tokens: 2000,
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''

    let post
    try { post = JSON.parse(content) } catch {
      const match = content.match(/\{[\s\S]*\}/)
      if (match) post = JSON.parse(match[0])
      else throw new Error('No se pudo parsear la respuesta')
    }

    return NextResponse.json({
      success: true,
      post: {
        id: `gen-${Date.now()}`,
        dia: dia || 1,
        dia_semana: dia_semana || 'Lunes',
        plataforma: plataforma || 'Facebook/Instagram',
        tipo_post: tipo_post || 'Post',
        copy: post.copy || '',
        hashtags: post.hashtags || '',
        nota_interna: post.nota_interna || '',
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error'
    console.error('POST generar-post error:', msg)
    return NextResponse.json({ error: 'Error al generar post', details: msg }, { status: 500 })
  }
}
