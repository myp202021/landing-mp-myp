import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Inicializar Supabase con variables de entorno del servidor
    // IMPORTANT: Strip whitespace and newlines from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\s/g, '')
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/\s/g, '')

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase credentials not configured')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Obtener el conteo total de métricas
    const { count, error } = await supabase
      .from('campaign_metrics')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json(
        {
          error: 'Error al consultar base de datos',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      count: count || 0
    })

  } catch (error: any) {
    console.error('❌ Unexpected error in count API:', error)
    return NextResponse.json(
      {
        error: 'Error inesperado al procesar la solicitud',
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}
