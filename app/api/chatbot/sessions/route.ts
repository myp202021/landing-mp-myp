import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Obtener sesiones del chatbot
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '7')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Calculate date range
    const startDate = new Date()
    if (days === -1) {
      startDate.setFullYear(2024, 0, 1) // All time
    } else {
      startDate.setDate(startDate.getDate() - days)
    }

    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .gte('started_at', startDate.toISOString())
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching chat sessions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate stats
    const totalSessions = sessions?.length || 0
    const totalLeads = sessions?.filter(s => s.email).length || 0
    const intentAlto = sessions?.filter(s => s.intent_score === 'alto').length || 0
    const avgTurns = totalSessions > 0
      ? sessions.reduce((sum, s) => sum + (s.total_turns || 0), 0) / totalSessions
      : 0

    return NextResponse.json({
      sessions: sessions || [],
      stats: {
        totalSessions,
        totalLeads,
        intentAlto,
        avgTurns: Math.round(avgTurns * 10) / 10
      }
    })
  } catch (error: any) {
    console.error('Error in GET /api/chatbot/sessions:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
