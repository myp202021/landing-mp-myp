/**
 * CRM INVERSIONES API
 * GET: Listar inversiones de un cliente
 * POST: Crear inversión
 * DELETE: Eliminar inversión
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

/**
 * GET /api/crm/inversiones?cliente_id=xxx
 */
export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { searchParams } = new URL(req.url)
    const clienteId = searchParams.get('cliente_id')

    if (!clienteId) {
      return NextResponse.json(
        { error: 'cliente_id es requerido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('inversiones')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('ano', { ascending: false })
      .order('mes', { ascending: false })

    if (error) {
      console.error('Error fetching inversiones:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ inversiones: data })

  } catch (error: any) {
    console.error('Error en GET inversiones:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/crm/inversiones
 *
 * Body: {
 *   cliente_id: string
 *   ano: number
 *   mes: number
 *   monto: number
 * }
 */
export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const body = await req.json()
    const { cliente_id, ano, mes, monto } = body

    if (!cliente_id || !ano || !mes || !monto) {
      return NextResponse.json(
        { error: 'cliente_id, ano, mes y monto son requeridos' },
        { status: 400 }
      )
    }

    // Validar mes
    if (mes < 1 || mes > 12) {
      return NextResponse.json(
        { error: 'mes debe estar entre 1 y 12' },
        { status: 400 }
      )
    }

    // Validar monto
    if (monto <= 0) {
      return NextResponse.json(
        { error: 'monto debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Insertar o actualizar si ya existe (upsert)
    const { data, error } = await supabase
      .from('inversiones')
      .upsert({
        cliente_id,
        ano,
        mes,
        monto,
        moneda: 'CLP'
      }, {
        onConflict: 'cliente_id,ano,mes'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating inversion:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ inversion: data })

  } catch (error: any) {
    console.error('Error en POST inversion:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/crm/inversiones?id=xxx
 */
export async function DELETE(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('inversiones')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting inversion:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error en DELETE inversion:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
