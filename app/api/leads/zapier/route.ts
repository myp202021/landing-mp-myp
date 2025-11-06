import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log('📥 Webhook recibido de Zapier:', JSON.stringify(body, null, 2))

    // Validar datos requeridos
    if (!body.client_id) {
      return NextResponse.json(
        { error: 'client_id es requerido' },
        { status: 400 }
      )
    }

    if (!body.full_name && !body.email && !body.phone_number) {
      return NextResponse.json(
        { error: 'Se requiere al menos: full_name, email o phone_number' },
        { status: 400 }
      )
    }

    // Verificar que el cliente existe
    const { data: clienteData, error: clienteError } = await supabase
      .from('clientes')
      .select('id, nombre')
      .eq('id', body.client_id)
      .single()

    if (clienteError || !clienteData) {
      console.error('❌ Cliente no encontrado:', body.client_id)
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Cliente encontrado:', clienteData.nombre)

    // Insertar el lead
    const leadData = {
      cliente_id: body.client_id,
      nombre: body.full_name || 'Sin nombre',
      email: body.email || null,
      telefono: body.phone_number || null,
      form_nombre: body.form_name || null,
      ad_nombre: body.ad_name || null,
      campana_nombre: body.campaign_name || null,
      meta_lead_id: body.form_id || null,
      fuente: 'zapier',
      contactado: false,
      vendido: false,
      monto_vendido: null,
      observaciones: null,
      fecha_ingreso: new Date().toISOString(),
      mes_ingreso: new Date().toISOString().substring(0, 7)
    }

    const { data: leadInserted, error: leadError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (leadError) {
      console.error('❌ Error insertando lead:', leadError)
      return NextResponse.json(
        { error: 'Error creando lead', details: leadError.message },
        { status: 500 }
      )
    }

    console.log('✅ Lead creado exitosamente:', leadInserted.id)

    return NextResponse.json({
      success: true,
      lead_id: leadInserted.id,
      message: 'Lead creado exitosamente'
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Error en webhook Zapier:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
