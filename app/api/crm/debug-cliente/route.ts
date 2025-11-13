/**
 * DEBUG API - Ver datos raw del cliente
 * GET /api/crm/debug-cliente?id=UUID
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id es requerido' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Obtener cliente completo
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Debug info
    const debug = {
      cliente,
      tipos: {
        inversion_mensual_type: typeof cliente.inversion_mensual,
        inversion_mensual_value: cliente.inversion_mensual,
        inversion_mensual_parsed: parseFloat(cliente.inversion_mensual),
        inversion_mensual_string: String(cliente.inversion_mensual),
      }
    }

    console.log('🔍 DEBUG Cliente:', debug)

    return NextResponse.json(debug)

  } catch (error: any) {
    console.error('Error en debug:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
