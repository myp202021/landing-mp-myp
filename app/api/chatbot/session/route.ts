import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST: Crear nueva sesión
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_agent: body.user_agent || null,
        landing_page: body.landing_page || null,
        referrer: body.referrer || null,
        started_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating chat session:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sessionId: data.id })
  } catch (error: any) {
    console.error('Error in POST /api/chatbot/session:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH: Actualizar sesión (lead data, messages, etc)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, ...updateData } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId es requerido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('chat_sessions')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (error) {
      console.error('Error updating chat session:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in PATCH /api/chatbot/session:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
