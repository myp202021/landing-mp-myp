import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST: Recibir lead desde Zapier/Meta
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cliente_id = searchParams.get('cliente_id')

    if (!cliente_id) {
      return NextResponse.json(
        { error: 'cliente_id es requerido en la URL' },
        { status: 400 }
      )
    }

    // Verificar que el cliente existe y tiene integración activa
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', cliente_id)
      .single()

    if (clienteError || !cliente) {
      console.error('❌ Cliente no encontrado:', cliente_id)
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    if (!cliente.zapier_activo) {
      console.warn('⚠️  Integración Zapier desactivada para cliente:', cliente.nombre)
      return NextResponse.json(
        { error: 'Integración Zapier no está activa para este cliente' },
        { status: 403 }
      )
    }

    // Obtener datos del lead desde el body
    const body = await req.json()

    // Mapeo flexible de campos (Zapier puede enviar diferentes nombres)
    const leadData = {
      cliente_id,
      nombre: body.nombre || body.full_name || body.name || 'Sin nombre',
      email: body.email || body.correo || null,
      telefono: body.telefono || body.phone || body.phone_number || null,
      empresa: body.empresa || body.company || null,
      cargo: body.cargo || body.job_title || null,
      mensaje: body.mensaje || body.message || body.comments || null,
      origen: 'Meta Ads (Zapier)',
      utm_source: body.utm_source || 'facebook',
      utm_medium: body.utm_medium || 'cpc',
      utm_campaign: body.utm_campaign || cliente.nombre,
      contactado: false,
      vendido: false
    }

    console.log('📥 Creando lead desde Zapier:', {
      cliente: cliente.nombre,
      nombre: leadData.nombre,
      email: leadData.email
    })

    // Insertar lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()

    if (leadError) {
      console.error('❌ Error creando lead:', leadError)
      return NextResponse.json(
        { error: 'Error creando lead', details: leadError.message },
        { status: 500 }
      )
    }

    console.log('✅ Lead creado exitosamente:', lead.id)

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      message: 'Lead recibido y creado exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Error en POST /api/webhooks/meta-leads:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// GET: Verificación del webhook (para testing)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cliente_id = searchParams.get('cliente_id')

  if (!cliente_id) {
    return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })
  }

  return NextResponse.json({
    status: 'active',
    mensaje: 'Webhook de Meta Leads está activo',
    cliente_id,
    instrucciones: 'Envía un POST con los datos del lead en el body'
  })
}
