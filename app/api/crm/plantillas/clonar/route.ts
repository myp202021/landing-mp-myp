/**
 * API: CLONAR PLANTILLA PARA CLIENTE
 * POST /api/crm/plantillas/clonar
 *
 * Clona una plantilla base y la personaliza para un cliente específico
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const {
      plantilla_base_id,
      cliente_id,
      nombre_personalizado,
      logo_url,
      logo_filename
    } = await req.json()

    // Validaciones
    if (!plantilla_base_id || !cliente_id) {
      return NextResponse.json(
        { error: 'plantilla_base_id y cliente_id son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que la plantilla base existe
    const { data: plantillaBase, error: plantillaError } = await supabase
      .from('plantillas_cotizacion')
      .select('*')
      .eq('id', plantilla_base_id)
      .eq('es_base', true)
      .single()

    if (plantillaError || !plantillaBase) {
      return NextResponse.json(
        { error: 'Plantilla base no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que el cliente existe
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('nombre')
      .eq('id', cliente_id)
      .single()

    if (clienteError || !cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Llamar a la función SQL para clonar
    const { data: nuevaPlantillaId, error: clonarError } = await supabase.rpc(
      'clonar_plantilla_para_cliente',
      {
        p_plantilla_base_id: plantilla_base_id,
        p_cliente_id: cliente_id,
        p_nombre_personalizado: nombre_personalizado || null,
        p_logo_url: logo_url || null,
        p_logo_filename: logo_filename || null
      }
    )

    if (clonarError) {
      console.error('Error clonando plantilla:', clonarError)
      return NextResponse.json(
        { error: clonarError.message || 'Error al clonar plantilla' },
        { status: 500 }
      )
    }

    // Obtener la plantilla recién creada
    const { data: nuevaPlantilla, error: fetchError } = await supabase
      .from('plantillas_cotizacion')
      .select(`
        *,
        clientes (
          id,
          nombre,
          empresa
        )
      `)
      .eq('id', nuevaPlantillaId)
      .single()

    if (fetchError) {
      console.error('Error obteniendo nueva plantilla:', fetchError)
    }

    return NextResponse.json({
      success: true,
      message: `Plantilla clonada y asignada a ${cliente.nombre}`,
      plantilla_id: nuevaPlantillaId,
      plantilla: nuevaPlantilla
    })
  } catch (error: any) {
    console.error('Error en POST /api/crm/plantillas/clonar:', error)
    return NextResponse.json(
      { error: error.message || 'Error al clonar plantilla' },
      { status: 500 }
    )
  }
}
