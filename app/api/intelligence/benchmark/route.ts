import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Industry, Channel } from '@/lib/types/intelligence'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const industry = searchParams.get('industry') as Industry | null
    const channel = searchParams.get('channel') as Channel | null

    console.log('📊 Obteniendo benchmark:', { industry, channel })

    if (!industry || !channel) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos: industry y channel' },
        { status: 400 }
      )
    }

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

    // Obtener todos los datos de esta industria y canal
    const { data, error } = await supabase
      .from('campaign_metrics')
      .select('*')
      .eq('industry', industry)
      .eq('channel', channel)

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

    console.log(`✅ Encontrados ${data.length} registros para ${industry} - ${channel}`)

    // Retornar los datos crudos para que el cliente haga los cálculos
    // Esto permite que el cliente use sus funciones de percentiles
    return NextResponse.json({
      success: true,
      data: data,
      totalSamples: data.length
    })

  } catch (error: any) {
    console.error('❌ Unexpected error in benchmark API:', error)
    return NextResponse.json(
      {
        error: 'Error inesperado al procesar la solicitud',
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}
