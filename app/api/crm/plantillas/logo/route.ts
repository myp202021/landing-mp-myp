/**
 * API: ACTUALIZAR LOGO DE PLANTILLA
 * PATCH /api/crm/plantillas/logo
 *
 * Actualiza el logo de una plantilla existente
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(req: NextRequest) {
  try {
    const { plantilla_id, logo_url, logo_filename } = await req.json()

    // Validaciones
    if (!plantilla_id) {
      return NextResponse.json(
        { error: 'plantilla_id es requerido' },
        { status: 400 }
      )
    }

    if (!logo_url || !logo_filename) {
      return NextResponse.json(
        { error: 'logo_url y logo_filename son requeridos' },
        { status: 400 }
      )
    }

    // Llamar a función SQL para actualizar logo
    const { data, error: updateError } = await supabase.rpc(
      'actualizar_logo_plantilla',
      {
        p_plantilla_id: plantilla_id,
        p_logo_url: logo_url,
        p_logo_filename: logo_filename
      }
    )

    if (updateError) {
      console.error('Error actualizando logo:', updateError)
      return NextResponse.json(
        { error: updateError.message || 'Error al actualizar logo' },
        { status: 500 }
      )
    }

    // Obtener plantilla actualizada
    const { data: plantilla, error: fetchError } = await supabase
      .from('plantillas_cotizacion')
      .select(`
        *,
        clientes (
          id,
          nombre,
          empresa
        )
      `)
      .eq('id', plantilla_id)
      .single()

    if (fetchError) {
      console.error('Error obteniendo plantilla:', fetchError)
    }

    return NextResponse.json({
      success: true,
      message: 'Logo actualizado correctamente',
      plantilla
    })
  } catch (error: any) {
    console.error('Error en PATCH /api/crm/plantillas/logo:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar logo' },
      { status: 500 }
    )
  }
}
