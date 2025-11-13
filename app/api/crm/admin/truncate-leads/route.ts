/**
 * TRUNCATE LEADS TABLE
 * Elimina TODOS los leads y resetea la secuencia a 1
 *
 * ⚠️ PELIGRO: Esta operación es IRREVERSIBLE
 *
 * Uso: POST /api/crm/admin/truncate-leads
 * Body: { "confirm": "DELETE_ALL_LEADS" }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Requerir confirmación explícita
    if (body.confirm !== 'DELETE_ALL_LEADS') {
      return NextResponse.json(
        {
          error: 'Confirmación requerida',
          message: 'Debes enviar { "confirm": "DELETE_ALL_LEADS" } en el body'
        },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('⚠️  TRUNCATE LEADS - Eliminando TODOS los leads...')

    // Contar leads actuales
    const { count: beforeCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Leads actuales: ${beforeCount}`)

    // Eliminar TODOS los leads (sin filtro)
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .neq('id', 0) // Esto elimina todos los registros

    if (deleteError) {
      console.error('❌ Error eliminando leads:', deleteError)
      return NextResponse.json(
        { error: `Error eliminando leads: ${deleteError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Todos los leads eliminados')

    // Verificar que se eliminaron todos
    const { count: afterCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Leads después de eliminar: ${afterCount}`)

    return NextResponse.json({
      success: true,
      deleted: beforeCount,
      remaining: afterCount,
      message: `${beforeCount} leads eliminados. Ahora ejecuta en Supabase SQL Editor: ALTER SEQUENCE leads_id_seq RESTART WITH 1;`
    })

  } catch (error: any) {
    console.error('❌ Error en truncate-leads:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
