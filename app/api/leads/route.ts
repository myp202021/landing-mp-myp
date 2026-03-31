import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Cliente ID para leads internos de M&P (predictor, landing, etc.)
const MYP_INTERNAL_CLIENT_ID = '1ecabf3e-27a1-4715-bfa7-eb54b078d7d3'

/**
 * API para captura de leads del Predictor y otras herramientas M&P
 *
 * Integra directamente con el CRM existente en Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, name, phone, source, data } = body

    // Validación básica
    if (!email && !name && !phone) {
      return NextResponse.json(
        { error: 'Se requiere al menos email, nombre o teléfono' },
        { status: 400 }
      )
    }

    // Preparar observaciones con datos del predictor
    let observaciones = `Fuente: ${source || 'web'}\n`
    if (data) {
      if (data.industria) observaciones += `Industria: ${data.industria}\n`
      if (data.presupuesto) observaciones += `Presupuesto: $${(data.presupuesto / 1000000).toFixed(1)}M CLP\n`
      if (data.viable !== undefined) observaciones += `Viable: ${data.viable ? 'Sí' : 'No'}\n`
      if (data.score) observaciones += `Score: ${data.score}/100\n`
      if (data.plataforma_recomendada) observaciones += `Plataforma recomendada: ${data.plataforma_recomendada}\n`
    }

    // Insertar en la tabla leads del CRM
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        cliente_id: MYP_INTERNAL_CLIENT_ID,
        nombre: name || null,
        email: email || null,
        telefono: phone || null,
        empresa: data?.empresa || null,
        fuente: source || 'predictor_v2',
        observaciones: observaciones.trim(),
        contactado: false,
        vendido: false,
        fecha_ingreso: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error guardando lead en CRM:', error)

      // Si falla Supabase, al menos logueamos el lead
      console.log('📧 Lead capturado (fallback):', {
        email,
        name,
        source,
        data,
        timestamp: new Date().toISOString()
      })

      return NextResponse.json({
        success: true,
        message: 'Lead registrado (modo offline)',
        offline: true
      })
    }

    console.log(`✅ Lead del Predictor guardado en CRM: ${lead.id} - ${email || name}`)

    return NextResponse.json({
      success: true,
      message: 'Lead registrado en CRM',
      lead_id: lead.id
    })

  } catch (error: any) {
    console.error('❌ Error capturando lead:', error)

    return NextResponse.json(
      { error: 'Error al registrar lead', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Leads API - M&P',
    description: 'Endpoint para captura de leads del predictor y herramientas M&P',
    integration: 'Supabase CRM'
  })
}
