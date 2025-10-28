/**
 * CRM CLIENTES API
 * GET: Listar clientes
 * POST: Crear cliente (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/crm/clientes
 */
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error fetching clientes:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ clientes: data })

  } catch (error: any) {
    console.error('Error en GET clientes:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/crm/clientes
 *
 * Body: {
 *   nombre: string
 *   rubro?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, rubro } = body

    if (!nombre) {
      return NextResponse.json(
        { error: 'nombre es requerido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert({
        nombre,
        rubro: rubro || null,
        activo: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating cliente:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ cliente: data })

  } catch (error: any) {
    console.error('Error en POST cliente:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
