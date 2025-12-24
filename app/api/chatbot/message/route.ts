import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST: Guardar mensaje
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { sessionId, role, content, nodeId, optionSelected, categoria, subcategoria } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId es requerido' }, { status: 400 })
    }

    // Insertar mensaje
    const { error: msgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role,
        content,
        node_id: nodeId,
        option_selected: optionSelected || null,
        categoria: categoria || null,
        subcategoria: subcategoria || null
      })

    if (msgError) {
      console.error('Error saving chat message:', msgError)
      return NextResponse.json({ error: msgError.message }, { status: 500 })
    }

    // Actualizar contadores de la sesión
    const { data: sessionData } = await supabase
      .from('chat_sessions')
      .select('total_messages')
      .eq('id', sessionId)
      .single()

    const newTotal = (sessionData?.total_messages || 0) + 1

    await supabase
      .from('chat_sessions')
      .update({
        total_messages: newTotal,
        total_turns: Math.floor(newTotal / 2),
        categoria: categoria || undefined,
        subcategoria: subcategoria || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in POST /api/chatbot/message:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
