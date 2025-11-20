import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const clienteId = searchParams.get('clienteId')
    const dias = parseInt(searchParams.get('dias') || '30')

    if (!clienteId) {
      return NextResponse.json({ error: 'Cliente ID requerido' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Calcular rango de fechas
    const fechaFin = new Date()
    const fechaInicio = new Date()
    fechaInicio.setDate(fechaInicio.getDate() - dias)

    // Obtener métricas diarias
    const { data: metricas, error: metricasError } = await supabase
      .from('ads_metrics_daily')
      .select('*')
      .eq('cliente_id', clienteId)
      .gte('fecha', fechaInicio.toISOString().split('T')[0])
      .lte('fecha', fechaFin.toISOString().split('T')[0])
      .order('fecha', { ascending: false })

    if (metricasError) {
      console.error('Error obteniendo métricas:', metricasError)
      return NextResponse.json({ error: metricasError.message }, { status: 500 })
    }

    // Calcular resumen
    const resumen = {
      totalInversion: 0,
      totalClicks: 0,
      totalImpresiones: 0,
      totalConversiones: 0,
      ctrPromedio: 0,
      cpcPromedio: 0,
      cpmPromedio: 0,
      campanasActivas: 0
    }

    const campanasUnicas = new Set<string>()

    metricas?.forEach((metrica: any) => {
      resumen.totalInversion += parseFloat(metrica.inversion || 0)
      resumen.totalClicks += parseInt(metrica.clicks || 0)
      resumen.totalImpresiones += parseInt(metrica.impresiones || 0)
      resumen.totalConversiones += parseFloat(metrica.conversiones || 0)

      if (metrica.campaign_status === 'ACTIVE') {
        campanasUnicas.add(metrica.campaign_id)
      }
    })

    resumen.campanasActivas = campanasUnicas.size

    // Calcular promedios
    if (resumen.totalImpresiones > 0) {
      resumen.ctrPromedio = (resumen.totalClicks / resumen.totalImpresiones) * 100
    }

    if (resumen.totalClicks > 0) {
      resumen.cpcPromedio = resumen.totalInversion / resumen.totalClicks
    }

    if (resumen.totalImpresiones > 0) {
      resumen.cpmPromedio = (resumen.totalInversion / resumen.totalImpresiones) * 1000
    }

    // Agrupar por campaña
    const campanasPorId = new Map<string, any>()

    metricas?.forEach((metrica: any) => {
      const campaignId = metrica.campaign_id

      if (!campanasPorId.has(campaignId)) {
        campanasPorId.set(campaignId, {
          campaign_id: campaignId,
          campaign_name: metrica.campaign_name,
          campaign_status: metrica.campaign_status,
          plataforma: metrica.plataforma,
          inversion: 0,
          clicks: 0,
          impresiones: 0,
          conversiones: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
          dias: []
        })
      }

      const campana = campanasPorId.get(campaignId)
      campana.inversion += parseFloat(metrica.inversion || 0)
      campana.clicks += parseInt(metrica.clicks || 0)
      campana.impresiones += parseInt(metrica.impresiones || 0)
      campana.conversiones += parseFloat(metrica.conversiones || 0)
      campana.dias.push({
        fecha: metrica.fecha,
        inversion: parseFloat(metrica.inversion || 0),
        clicks: parseInt(metrica.clicks || 0),
        impresiones: parseInt(metrica.impresiones || 0),
        ctr: parseFloat(metrica.ctr || 0)
      })
    })

    // Calcular métricas por campaña
    const campanasArray = Array.from(campanasPorId.values()).map(campana => {
      if (campana.impresiones > 0) {
        campana.ctr = (campana.clicks / campana.impresiones) * 100
      }
      if (campana.clicks > 0) {
        campana.cpc = campana.inversion / campana.clicks
      }
      if (campana.impresiones > 0) {
        campana.cpm = (campana.inversion / campana.impresiones) * 1000
      }
      return campana
    })

    // Ordenar por inversión descendente
    campanasArray.sort((a, b) => b.inversion - a.inversion)

    // Preparar datos para gráfico (inversión por día)
    const inversionPorDia = new Map<string, number>()

    metricas?.forEach((metrica: any) => {
      const fecha = metrica.fecha
      const inversion = parseFloat(metrica.inversion || 0)

      if (!inversionPorDia.has(fecha)) {
        inversionPorDia.set(fecha, 0)
      }

      inversionPorDia.set(fecha, inversionPorDia.get(fecha)! + inversion)
    })

    const chartData = Array.from(inversionPorDia.entries())
      .map(([fecha, inversion]) => ({
        fecha,
        inversion: Math.round(inversion)
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha))

    return NextResponse.json({
      resumen: {
        totalInversion: Math.round(resumen.totalInversion),
        totalClicks: resumen.totalClicks,
        totalImpresiones: resumen.totalImpresiones,
        totalConversiones: Math.round(resumen.totalConversiones * 100) / 100,
        ctrPromedio: Math.round(resumen.ctrPromedio * 100) / 100,
        cpcPromedio: Math.round(resumen.cpcPromedio),
        cpmPromedio: Math.round(resumen.cpmPromedio),
        campanasActivas: resumen.campanasActivas
      },
      campanas: campanasArray,
      chartData,
      periodo: {
        dias,
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0]
      }
    })

  } catch (error: any) {
    console.error('Error en /api/crm/campaigns:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
