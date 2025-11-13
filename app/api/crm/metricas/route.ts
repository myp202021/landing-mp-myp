/**
 * MÉTRICAS API
 * Calcula KPIs: ROAS, CPL, CPA, tasa de conversión, etc.
 *
 * GET /api/crm/metricas?cliente_id=UUID
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Obtener datos del cliente (inversión)
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('inversion_mensual')
      .eq('id', cliente_id)
      .single()

    if (clienteError || !cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Obtener todas las métricas de leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, contactado, vendido, monto_vendido')
      .eq('cliente_id', cliente_id)

    if (leadsError) {
      return NextResponse.json(
        { error: 'Error obteniendo leads' },
        { status: 500 }
      )
    }

    // Calcular métricas
    const total_leads = leads?.length || 0
    const leads_contactados = leads?.filter(l => l.contactado).length || 0
    const leads_vendidos = leads?.filter(l => l.vendido).length || 0
    const total_ventas = leads?.reduce((sum, l) => sum + (l.monto_vendido || 0), 0) || 0

    // Parsear inversión de forma robusta
    let inversion = 0
    if (cliente.inversion_mensual !== null && cliente.inversion_mensual !== undefined) {
      const parsed = Number(cliente.inversion_mensual)
      inversion = isNaN(parsed) ? 0 : parsed
    }

    // KPIs calculados
    const cpl = total_leads > 0 ? inversion / total_leads : 0 // Costo por lead
    const cpa = leads_vendidos > 0 ? inversion / leads_vendidos : 0 // Costo por adquisición
    const roas = inversion > 0 ? total_ventas / inversion : 0 // Return on ad spend
    const conversion_rate = total_leads > 0 ? (leads_vendidos / total_leads) * 100 : 0 // Tasa de conversión
    const contact_rate = total_leads > 0 ? (leads_contactados / total_leads) * 100 : 0 // Tasa de contacto

    const metricas = {
      total_leads,
      leads_contactados,
      leads_vendidos,
      total_ventas,
      inversion,
      // Calculadas
      cpl,
      cpa,
      roas,
      conversion_rate,
      contact_rate
    }

    return NextResponse.json({ metricas })

  } catch (error: any) {
    console.error('Error en metricas:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
