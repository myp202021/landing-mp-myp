import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { alertarLeadFallido } from '@/lib/crm/alerta-lead-fallido'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST: Recibir lead desde Zapier/Meta
export async function POST(req: NextRequest) {
  let body: any = null
  let cliente_id: string | null = null
  let crmProcesado = false
  try {
    const { searchParams } = new URL(req.url)
    cliente_id = searchParams.get('cliente_id')

    // Leer el body al inicio para poder incluirlo en las alertas
    body = await req.json().catch(() => null)

    if (!cliente_id) {
      await alertarLeadFallido({ fuente: 'Webhook Meta Leads (/api/webhooks/meta-leads)', motivo: 'Webhook sin cliente_id en la URL', datos: body })
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
      await alertarLeadFallido({
        fuente: 'Webhook Meta Leads (/api/webhooks/meta-leads)',
        motivo: clienteError || `Cliente ${cliente_id} no encontrado en tabla clientes`,
        datos: body
      })
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    if (!cliente.zapier_activo) {
      console.warn('⚠️  Integración Zapier desactivada para cliente:', cliente.nombre)
      await alertarLeadFallido({
        fuente: `Webhook Meta Leads (/api/webhooks/meta-leads) — ${cliente.nombre}`,
        motivo: 'Lead rechazado: integración Zapier desactivada para este cliente (zapier_activo = false)',
        datos: body
      })
      return NextResponse.json(
        { error: 'Integración Zapier no está activa para este cliente' },
        { status: 403 }
      )
    }

    if (!body) {
      return NextResponse.json({ error: 'Body JSON inválido o vacío' }, { status: 400 })
    }

    // Mapeo flexible de campos (Zapier puede enviar diferentes nombres)
    const companyName = body.empresa || body.company || body.nombre_empresa || null

    // La tabla leads NO tiene columnas cargo/origen/utm_*: antes el insert fallaba siempre.
    // Esos datos van a observaciones; fecha_ingreso es obligatoria (NOT NULL sin default).
    const cargo = body.cargo || body.job_title || null
    const observacionesParts: string[] = []
    if (cargo) observacionesParts.push(`Cargo: ${cargo}`)
    observacionesParts.push(`UTM: ${body.utm_source || 'facebook'} / ${body.utm_medium || 'cpc'} / ${body.utm_campaign || cliente.nombre}`)

    const ahora = new Date().toISOString()
    const leadData = {
      cliente_id,
      nombre: body.nombre || body.full_name || body.name || 'Sin nombre',
      email: body.email || body.correo || null,
      telefono: body.telefono || body.phone || body.phone_number || null,
      empresa: companyName,
      nombre_empresa: companyName, // Guardar en ambos campos
      mensaje: body.mensaje || body.message || body.comments || null,
      fuente: 'Meta Ads (Zapier)',
      campana_nombre: body.utm_campaign || null,
      observaciones: observacionesParts.join(' | '),
      contactado: false,
      vendido: false,
      fecha_ingreso: ahora,
      mes_ingreso: ahora.substring(0, 7)
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
      crmProcesado = true // ya alertado
      await alertarLeadFallido({ fuente: `Webhook Meta Leads (/api/webhooks/meta-leads) — ${cliente.nombre}`, motivo: leadError, datos: leadData })
      return NextResponse.json(
        { error: 'Error creando lead', details: leadError.message },
        { status: 500 }
      )
    }

    crmProcesado = true
    console.log('✅ Lead creado exitosamente:', lead.id)

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      message: 'Lead recibido y creado exitosamente'
    })

  } catch (error: any) {
    console.error('❌ Error en POST /api/webhooks/meta-leads:', error)
    if (body && !crmProcesado) {
      await alertarLeadFallido({ fuente: 'Webhook Meta Leads (/api/webhooks/meta-leads)', motivo: error, datos: { cliente_id, ...body } })
    }
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
