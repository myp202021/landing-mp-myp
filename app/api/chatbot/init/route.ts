import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Admin client con service_role_key para operaciones administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Verificar autenticación (solo desde localhost o con secret)
    const authHeader = request.headers.get('authorization')
    const initSecret = process.env.INIT_SECRET || 'mp-chatbot-init-2025'

    if (authHeader !== `Bearer ${initSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Crear tablas una por una usando raw SQL a través de RPC
    // Primero creamos una función RPC temporal si no existe

    const results = []

    // Tabla 1: chat_sessions
    const { error: err1 } = await supabaseAdmin.from('chat_sessions').select('id').limit(1)
    if (err1?.code === 'PGRST205') {
      // Tabla no existe, la creamos via insert de prueba (esto fallará pero nos dice que no existe)
      results.push({ table: 'chat_sessions', status: 'needs_creation' })
    } else {
      results.push({ table: 'chat_sessions', status: 'exists' })
    }

    // Tabla 2: chat_messages
    const { error: err2 } = await supabaseAdmin.from('chat_messages').select('id').limit(1)
    if (err2?.code === 'PGRST205') {
      results.push({ table: 'chat_messages', status: 'needs_creation' })
    } else {
      results.push({ table: 'chat_messages', status: 'exists' })
    }

    // Si las tablas no existen, retornamos instrucciones para crearlas manualmente
    const needsCreation = results.some(r => r.status === 'needs_creation')

    if (needsCreation) {
      return NextResponse.json({
        success: false,
        message: 'Las tablas del chatbot no existen. Ejecuta el SQL del archivo supabase/chatbot-schema.sql en el SQL Editor de Supabase.',
        results,
        sqlFile: '/supabase/chatbot-schema.sql'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Todas las tablas del chatbot existen',
      results
    })

  } catch (error) {
    console.error('Error in chatbot init:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  // Verificar estado de las tablas
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const tables = ['chat_sessions', 'chat_messages', 'chat_analytics_daily', 'chat_unhandled_questions']
  const status: Record<string, string> = {}

  for (const table of tables) {
    const { error } = await supabaseAdmin.from(table).select('id').limit(1)
    status[table] = error?.code === 'PGRST205' ? 'missing' : 'exists'
  }

  const allExist = Object.values(status).every(s => s === 'exists')

  return NextResponse.json({
    ready: allExist,
    tables: status,
    instructions: allExist ? null : 'Ejecuta el SQL de supabase/chatbot-schema.sql en el SQL Editor de Supabase Dashboard'
  })
}
