/**
 * MÉTRICAS API
 * Calcula KPIs: ROAS, CPL, CPA, tasa de conversión, etc.
 *
 * IMPORTANTE: La inversión se calcula multiplicando inversion_mensual por
 * la cantidad de meses desde el primer lead, proporcional al día actual
 * para meses no cerrados.
 *
 * GET /api/crm/metricas?cliente_id=UUID
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Palabras clave para identificar leads de test
const TEST_KEYWORDS = ['test', 'prueba', 'demo', 'ejemplo', 'fake', 'dummy', 'asdf', 'qwerty', '@test.', '@prueba.', '@example.']

function isTestLead(lead: any): boolean {
  const fieldsToCheck = [
    lead.nombre?.toLowerCase() || '',
    lead.email?.toLowerCase() || '',
    lead.nombre_empresa?.toLowerCase() || '',
    lead.observaciones?.toLowerCase() || ''
  ]

  return fieldsToCheck.some(field =>
    TEST_KEYWORDS.some(keyword => field.includes(keyword))
  )
}

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

    // Obtener todas las métricas de leads CON fecha de ingreso
    const { data: allLeads, error: leadsError } = await supabase
      .from('leads')
      .select('id, nombre, email, nombre_empresa, observaciones, contactado, vendido, monto_vendido, fecha_ingreso, mes_ingreso')
      .eq('cliente_id', cliente_id)
      .order('fecha_ingreso', { ascending: true })

    if (leadsError) {
      return NextResponse.json(
        { error: 'Error obteniendo leads' },
        { status: 500 }
      )
    }

    // Filtrar leads de test
    const leads = (allLeads || []).filter(lead => !isTestLead(lead))
    const leadsExcluidos = (allLeads || []).length - leads.length

    // Calcular métricas básicas
    const total_leads = leads.length
    const leads_contactados = leads.filter(l => l.contactado).length
    const leads_vendidos = leads.filter(l => l.vendido).length
    const total_ventas = leads.reduce((sum, l) => sum + (l.monto_vendido || 0), 0)

    // Parsear inversión mensual
    let inversion_mensual = 0
    if (cliente.inversion_mensual !== null && cliente.inversion_mensual !== undefined) {
      const parsed = Number(cliente.inversion_mensual)
      inversion_mensual = isNaN(parsed) ? 0 : parsed
    }

    // ========================================
    // CÁLCULO DE INVERSIÓN TOTAL (mensual × meses)
    // ========================================
    let inversion_total = 0
    let meses_activos = 0

    if (leads.length > 0 && inversion_mensual > 0) {
      // Encontrar fecha del primer lead
      const primerLead = leads[0]
      const fechaPrimerLead = primerLead.fecha_ingreso
        ? new Date(primerLead.fecha_ingreso)
        : new Date(primerLead.mes_ingreso + '-01')

      const ahora = new Date()

      // Calcular meses completos desde el primer lead
      const mesInicio = new Date(fechaPrimerLead.getFullYear(), fechaPrimerLead.getMonth(), 1)
      const mesFin = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

      // Meses completos
      let mesesCompletos = 0
      let mesActual = new Date(mesInicio)
      while (mesActual < mesFin) {
        mesesCompletos++
        mesActual.setMonth(mesActual.getMonth() + 1)
      }

      // Proporción del mes actual
      const diasEnMesActual = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).getDate()
      const diaActual = ahora.getDate()
      const proporcionMesActual = diaActual / diasEnMesActual

      // Total de meses (completos + proporción del actual)
      meses_activos = mesesCompletos + proporcionMesActual

      // Inversión total = mensual × meses
      inversion_total = inversion_mensual * meses_activos
    }

    // KPIs calculados con inversión total correcta
    const cpl = total_leads > 0 ? inversion_total / total_leads : 0
    const cpa = leads_vendidos > 0 ? inversion_total / leads_vendidos : 0
    const roas = inversion_total > 0 ? total_ventas / inversion_total : 0
    const conversion_rate = total_leads > 0 ? (leads_vendidos / total_leads) * 100 : 0
    const contact_rate = total_leads > 0 ? (leads_contactados / total_leads) * 100 : 0

    const metricas = {
      total_leads,
      leads_contactados,
      leads_vendidos,
      total_ventas,
      // Inversión desglosada
      inversion_mensual,
      inversion_total: Math.round(inversion_total),
      meses_activos: Math.round(meses_activos * 100) / 100,
      // KPIs calculados
      cpl: Math.round(cpl),
      cpa: Math.round(cpa),
      roas: Math.round(roas * 100) / 100,
      conversion_rate: Math.round(conversion_rate * 10) / 10,
      contact_rate: Math.round(contact_rate * 10) / 10,
      // Info adicional
      leads_excluidos_test: leadsExcluidos
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
