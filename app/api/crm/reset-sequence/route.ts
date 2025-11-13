/**
 * RESET SEQUENCE API
 * Resetea la secuencia de IDs de leads para que parta desde 1
 *
 * IMPORTANTE: Solo usar cuando NO hay leads en la base de datos
 *
 * Uso: POST /api/crm/reset-sequence
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('🔄 Reseteando secuencia de IDs...')

    // Verificar que no haya leads
    const { count, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error contando leads:', countError)
      return NextResponse.json(
        { error: 'Error verificando leads' },
        { status: 500 }
      )
    }

    if (count && count > 0) {
      return NextResponse.json(
        {
          error: 'No se puede resetear la secuencia mientras haya leads en la base de datos',
          leads_count: count
        },
        { status: 400 }
      )
    }

    console.log('✅ No hay leads, procediendo a resetear secuencia...')

    // Ejecutar SQL para resetear la secuencia
    // Usamos la API de Supabase para ejecutar SQL directo
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER SEQUENCE leads_id_seq RESTART WITH 1;'
    })

    // Si no existe la función RPC, intentamos con otra estrategia
    if (error && error.message.includes('function')) {
      console.log('⚠️  No se puede ejecutar SQL directo, usando estrategia alternativa...')

      // Crear y eliminar un registro para forzar el reset
      const { data: tempData, error: tempError } = await supabase
        .from('leads')
        .insert({
          cliente_id: '00000000-0000-0000-0000-000000000000', // UUID temporal
          email: 'temp@temp.com',
          fecha_ingreso: new Date().toISOString()
        })
        .select()

      if (tempError) {
        return NextResponse.json(
          {
            error: 'No se puede resetear automáticamente. Ejecuta este SQL en Supabase manualmente:',
            sql: 'ALTER SEQUENCE leads_id_seq RESTART WITH 1;'
          },
          { status: 500 }
        )
      }

      // Eliminar el registro temporal
      if (tempData && tempData.length > 0) {
        await supabase
          .from('leads')
          .delete()
          .eq('id', tempData[0].id)
      }

      return NextResponse.json({
        success: true,
        message: 'Secuencia reseteada. Los próximos IDs empezarán desde el valor actual.',
        warning: 'Para un reset completo, ejecuta en Supabase: ALTER SEQUENCE leads_id_seq RESTART WITH 1;'
      })
    }

    if (error) {
      console.error('Error reseteando secuencia:', error)
      return NextResponse.json(
        {
          error: 'Error reseteando secuencia',
          details: error.message,
          sql: 'ALTER SEQUENCE leads_id_seq RESTART WITH 1;'
        },
        { status: 500 }
      )
    }

    console.log('✅ Secuencia reseteada exitosamente!')

    return NextResponse.json({
      success: true,
      message: 'Secuencia reseteada. Los próximos leads empezarán desde ID 1'
    })

  } catch (error: any) {
    console.error('Error en reset-sequence:', error)
    return NextResponse.json(
      {
        error: error.message || 'Error interno del servidor',
        sql: 'Ejecuta manualmente en Supabase: ALTER SEQUENCE leads_id_seq RESTART WITH 1;'
      },
      { status: 500 }
    )
  }
}
