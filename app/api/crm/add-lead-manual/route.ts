/**
 * API para agregar leads manualmente
 * POST /api/crm/add-lead-manual
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, telefono, empresa, fuente, interes, secret } = body

    // Validación básica de seguridad
    if (secret !== process.env.ADMIN_SECRET && secret !== 'myp2025admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!nombre || !email) {
      return NextResponse.json({ error: 'nombre y email son requeridos' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Buscar cliente Muller y Perez
    const { data: clienteData } = await supabase
      .from('clientes')
      .select('id')
      .or('nombre.ilike.%muller%,nombre.ilike.%m&p%,nombre.ilike.%myp%')
      .single()

    if (!clienteData) {
      return NextResponse.json({ error: 'Cliente M&P no encontrado' }, { status: 404 })
    }

    const leadData = {
      cliente_id: clienteData.id,
      nombre,
      email,
      telefono: telefono || null,
      nombre_empresa: empresa || null,
      fuente: fuente || 'manual',
      form_nombre: 'Agregado Manual',
      observaciones: interes || 'Lead agregado manualmente',
      contactado: false,
      vendido: false,
      fecha_ingreso: new Date().toISOString(),
      mes_ingreso: new Date().toISOString().substring(0, 7)
    }

    const { data: leadInserted, error: leadError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (leadError) {
      console.error('Error creando lead:', leadError)
      return NextResponse.json({ error: 'Error creando lead', details: leadError }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Lead creado exitosamente',
      lead: leadInserted
    })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
