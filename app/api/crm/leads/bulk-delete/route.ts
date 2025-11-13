/**
 * BULK DELETE LEADS API
 * Elimina todos los leads de un cliente específico
 *
 * Uso: DELETE /api/crm/leads/bulk-delete?cliente_id=UUID
 *
 * Seguridad: Requiere confirmación en frontend
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * DELETE /api/crm/leads/bulk-delete
 *
 * Query params:
 *   - cliente_id: UUID (requerido)
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { searchParams } = new URL(req.url)
    const cliente_id = searchParams.get('cliente_id')

    // Validación
    if (!cliente_id) {
      return NextResponse.json(
        { error: 'cliente_id es requerido' },
        { status: 400 }
      )
    }

    // Primero contar cuántos leads hay
    const { count: totalLeads, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('cliente_id', cliente_id)

    if (countError) {
      return NextResponse.json(
        { error: 'Error contando leads' },
        { status: 500 }
      )
    }

    // Limitar a máximo 1000 leads por vez
    if (totalLeads && totalLeads > 1000) {
      return NextResponse.json(
        { error: `Demasiados leads para eliminar (${totalLeads}). Máximo permitido: 1000 por operación` },
        { status: 400 }
      )
    }

    // Eliminar todos los leads del cliente
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('cliente_id', cliente_id)

    if (deleteError) {
      return NextResponse.json(
        { error: `Error eliminando leads: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      deleted: totalLeads,
      message: `${totalLeads} leads eliminados exitosamente`
    })

  } catch (error: any) {
    console.error('Error en bulk-delete:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
