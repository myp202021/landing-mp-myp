/**
 * API: OBTENER PLANTILLA ASIGNADA DE UN CLIENTE
 * GET /api/crm/plantillas/cliente?cliente_id=xxx
 *
 * Obtiene la plantilla asignada a un cliente específico
 * Si el cliente no tiene plantilla asignada, retorna null
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cliente_id = searchParams.get('cliente_id')

    if (!cliente_id) {
      return NextResponse.json(
        { error: 'cliente_id es requerido' },
        { status: 400 }
      )
    }

    // Obtener el cliente con su plantilla asignada
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('plantilla_asignada_id')
      .eq('id', cliente_id)
      .single()

    if (clienteError) {
      console.error('Error obteniendo cliente:', clienteError)
      return NextResponse.json(
        { error: clienteError.message },
        { status: 500 }
      )
    }

    // Si no tiene plantilla asignada, retornar null
    if (!cliente || !cliente.plantilla_asignada_id) {
      return NextResponse.json({
        plantilla: null,
        message: 'Cliente no tiene plantilla asignada'
      })
    }

    // Obtener la plantilla asignada con toda la información
    const { data: plantilla, error: plantillaError } = await supabase
      .from('plantillas_cotizacion')
      .select(`
        *,
        clientes (
          id,
          nombre,
          empresa
        )
      `)
      .eq('id', cliente.plantilla_asignada_id)
      .eq('activa', true)
      .single()

    if (plantillaError) {
      console.error('Error obteniendo plantilla:', plantillaError)
      return NextResponse.json(
        { error: plantillaError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      plantilla,
      message: 'Plantilla obtenida correctamente'
    })

  } catch (error: any) {
    console.error('Error en GET /api/crm/plantillas/cliente:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener plantilla del cliente' },
      { status: 500 }
    )
  }
}
