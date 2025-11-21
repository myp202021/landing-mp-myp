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

    // Calcular rango de fechas (periodo actual)
    const fechaFin = new Date()
    const fechaInicio = new Date()
    fechaInicio.setDate(fechaInicio.getDate() - dias)

    // Calcular rango de fechas (periodo anterior para comparación)
    const fechaFinAnterior = new Date(fechaInicio)
    fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1)
    const fechaInicioAnterior = new Date(fechaFinAnterior)
    fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - dias)

    // Obtener métricas diarias (periodo actual)
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

    // Obtener métricas del periodo anterior para comparación
    const { data: metricasAnteriores } = await supabase
      .from('ads_metrics_daily')
      .select('*')
      .eq('cliente_id', clienteId)
      .gte('fecha', fechaInicioAnterior.toISOString().split('T')[0])
      .lte('fecha', fechaFinAnterior.toISOString().split('T')[0])

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

    // Calcular resumen del periodo anterior
    const resumenAnterior = {
      totalInversion: 0,
      totalClicks: 0,
      totalImpresiones: 0,
      totalConversiones: 0
    }

    metricasAnteriores?.forEach((metrica: any) => {
      resumenAnterior.totalInversion += parseFloat(metrica.inversion || 0)
      resumenAnterior.totalClicks += parseInt(metrica.clicks || 0)
      resumenAnterior.totalImpresiones += parseInt(metrica.impresiones || 0)
      resumenAnterior.totalConversiones += parseFloat(metrica.conversiones || 0)
    })

    // Calcular cambios porcentuales
    const cambios = {
      inversion: resumenAnterior.totalInversion > 0
        ? ((resumen.totalInversion - resumenAnterior.totalInversion) / resumenAnterior.totalInversion) * 100
        : 0,
      clicks: resumenAnterior.totalClicks > 0
        ? ((resumen.totalClicks - resumenAnterior.totalClicks) / resumenAnterior.totalClicks) * 100
        : 0,
      impresiones: resumenAnterior.totalImpresiones > 0
        ? ((resumen.totalImpresiones - resumenAnterior.totalImpresiones) / resumenAnterior.totalImpresiones) * 100
        : 0,
      conversiones: resumenAnterior.totalConversiones > 0
        ? ((resumen.totalConversiones - resumenAnterior.totalConversiones) / resumenAnterior.totalConversiones) * 100
        : 0,
      ctr: 0,
      cpc: 0
    }

    // Calcular CTR y CPC anteriores para comparación
    const ctrAnterior = resumenAnterior.totalImpresiones > 0
      ? (resumenAnterior.totalClicks / resumenAnterior.totalImpresiones) * 100
      : 0
    const cpcAnterior = resumenAnterior.totalClicks > 0
      ? resumenAnterior.totalInversion / resumenAnterior.totalClicks
      : 0

    if (ctrAnterior > 0) {
      cambios.ctr = ((resumen.ctrPromedio - ctrAnterior) / ctrAnterior) * 100
    }
    if (cpcAnterior > 0) {
      cambios.cpc = ((resumen.cpcPromedio - cpcAnterior) / cpcAnterior) * 100
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
          cpm: 0
        })
      }

      const campana = campanasPorId.get(campaignId)
      campana.inversion += parseFloat(metrica.inversion || 0)
      campana.clicks += parseInt(metrica.clicks || 0)
      campana.impresiones += parseInt(metrica.impresiones || 0)
      campana.conversiones += parseFloat(metrica.conversiones || 0)
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

    // Preparar datos para gráficos multi-serie (por día)
    const metricasPorDia = new Map<string, any>()

    metricas?.forEach((metrica: any) => {
      const fecha = metrica.fecha

      if (!metricasPorDia.has(fecha)) {
        metricasPorDia.set(fecha, {
          fecha,
          inversion: 0,
          clicks: 0,
          impresiones: 0,
          conversiones: 0
        })
      }

      const dia = metricasPorDia.get(fecha)
      dia.inversion += parseFloat(metrica.inversion || 0)
      dia.clicks += parseInt(metrica.clicks || 0)
      dia.impresiones += parseInt(metrica.impresiones || 0)
      dia.conversiones += parseFloat(metrica.conversiones || 0)
    })

    // Datos para gráficos (con CTR y CPC calculados)
    const chartData = Array.from(metricasPorDia.values())
      .map(dia => ({
        fecha: dia.fecha,
        inversion: Math.round(dia.inversion),
        clicks: dia.clicks,
        impresiones: dia.impresiones,
        conversiones: Math.round(dia.conversiones * 100) / 100,
        ctr: dia.impresiones > 0 ? Math.round((dia.clicks / dia.impresiones) * 10000) / 100 : 0,
        cpc: dia.clicks > 0 ? Math.round(dia.inversion / dia.clicks) : 0,
        cpm: dia.impresiones > 0 ? Math.round((dia.inversion / dia.impresiones) * 1000) : 0
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha))

    // Obtener datos por plataforma (Instagram, Facebook, etc.)
    const platformDataMap = new Map<string, any>()

    metricas?.forEach((metrica: any) => {
      const platform = metrica.publisher_platform || 'unknown'

      if (!platformDataMap.has(platform)) {
        platformDataMap.set(platform, {
          platform,
          inversion: 0,
          clicks: 0,
          impresiones: 0
        })
      }

      const platformData = platformDataMap.get(platform)
      platformData.inversion += parseFloat(metrica.inversion || 0)
      platformData.clicks += parseInt(metrica.clicks || 0)
      platformData.impresiones += parseInt(metrica.impresiones || 0)
    })

    // Calcular CTR y CPC por plataforma
    const platformData = Array.from(platformDataMap.values()).map(platform => ({
      ...platform,
      ctr: platform.impresiones > 0 ? (platform.clicks / platform.impresiones) * 100 : 0,
      cpc: platform.clicks > 0 ? platform.inversion / platform.clicks : 0
    }))

    // Obtener métricas de ads individuales
    const { data: adsData } = await supabase
      .from('ads_metrics_by_ad')
      .select('*')
      .eq('cliente_id', clienteId)
      .gte('fecha', fechaInicio.toISOString().split('T')[0])
      .lte('fecha', fechaFin.toISOString().split('T')[0])
      .order('inversion', { ascending: false })

    // Agrupar ads por ad_id para sumar métricas del periodo
    const adsByIdMap = new Map<string, any>()

    adsData?.forEach((ad: any) => {
      const adId = ad.ad_id

      if (!adsByIdMap.has(adId)) {
        adsByIdMap.set(adId, {
          ad_id: ad.ad_id,
          ad_name: ad.ad_name,
          ad_status: ad.ad_status,
          campaign_name: ad.campaign_name,
          publisher_platform: ad.publisher_platform,
          ad_creative_thumbnail_url: ad.ad_creative_thumbnail_url,
          ad_creative_body: ad.ad_creative_body,
          ad_creative_link_url: ad.ad_creative_link_url,
          inversion: 0,
          impresiones: 0,
          clicks: 0,
          conversiones: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          video_views: 0,
          reach: 0
        })
      }

      const adData = adsByIdMap.get(adId)
      adData.inversion += parseFloat(ad.inversion || 0)
      adData.impresiones += parseInt(ad.impresiones || 0)
      adData.clicks += parseInt(ad.clicks || 0)
      adData.conversiones += parseFloat(ad.conversiones || 0)
      adData.likes += parseInt(ad.likes || 0)
      adData.comments += parseInt(ad.comments || 0)
      adData.shares += parseInt(ad.shares || 0)
      adData.video_views += parseInt(ad.video_views || 0)
      adData.reach += parseInt(ad.reach || 0)
    })

    // Calcular CTR y CPC por ad
    const adsArray = Array.from(adsByIdMap.values()).map(ad => ({
      ...ad,
      ctr: ad.impresiones > 0 ? (ad.clicks / ad.impresiones) * 100 : 0,
      cpc: ad.clicks > 0 ? ad.inversion / ad.clicks : 0
    }))

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
      cambios: {
        inversion: Math.round(cambios.inversion * 10) / 10,
        clicks: Math.round(cambios.clicks * 10) / 10,
        impresiones: Math.round(cambios.impresiones * 10) / 10,
        conversiones: Math.round(cambios.conversiones * 10) / 10,
        ctr: Math.round(cambios.ctr * 10) / 10,
        cpc: Math.round(cambios.cpc * 10) / 10
      },
      campanas: campanasArray,
      chartData,
      metricasPorDia: chartData, // Tabla detallada por día
      platformData, // Datos por plataforma (Instagram, Facebook, etc.)
      adsData: adsArray, // Anuncios individuales con engagement
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
