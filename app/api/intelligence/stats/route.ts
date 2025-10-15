import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * ENDPOINT ADMIN: Estadísticas de M&P Intelligence
 * GET /api/intelligence/stats
 *
 * IMPORTANTE: Este endpoint debería estar protegido con autenticación
 * en producción. Por ahora es público para facilitar el monitoreo.
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\s/g, '')
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/\s/g, '')

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Total de contribuciones
    const { count: totalCount } = await supabase
      .from('campaign_metrics')
      .select('*', { count: 'exact', head: true })

    // 2. Obtener todos los datos para análisis
    const { data: allMetrics, error } = await supabase
      .from('campaign_metrics')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching stats:', error)
      return NextResponse.json(
        { error: 'Error al consultar base de datos' },
        { status: 500 }
      )
    }

    // 3. Distribución por industria
    const byIndustry: Record<string, number> = {}
    allMetrics?.forEach(m => {
      byIndustry[m.industry] = (byIndustry[m.industry] || 0) + 1
    })

    // 4. Distribución por canal
    const byChannel: Record<string, number> = {}
    allMetrics?.forEach(m => {
      byChannel[m.channel] = (byChannel[m.channel] || 0) + 1
    })

    // 5. Distribución por región
    const byRegion: Record<string, number> = {}
    allMetrics?.forEach(m => {
      if (m.region) {
        byRegion[m.region] = (byRegion[m.region] || 0) + 1
      }
    })

    // 6. Combinaciones industria+canal con suficiente data (10+)
    const combinations: Record<string, { count: number; avgRoas: number; avgCac: number }> = {}
    allMetrics?.forEach(m => {
      const key = `${m.industry}__${m.channel}`
      if (!combinations[key]) {
        combinations[key] = { count: 0, avgRoas: 0, avgCac: 0 }
      }
      combinations[key].count++
      combinations[key].avgRoas += m.roas || 0
      combinations[key].avgCac += m.cac || 0
    })

    // Calcular promedios
    Object.keys(combinations).forEach(key => {
      combinations[key].avgRoas = combinations[key].avgRoas / combinations[key].count
      combinations[key].avgCac = combinations[key].avgCac / combinations[key].count
    })

    // Filtrar solo las que tienen 10+ muestras
    const readyForRealData = Object.entries(combinations)
      .filter(([_, data]) => data.count >= 10)
      .map(([key, data]) => {
        const [industry, channel] = key.split('__')
        return { industry, channel, ...data }
      })

    // 7. Últimas 10 contribuciones
    const recent = allMetrics?.slice(0, 10).map(m => ({
      created_at: m.created_at,
      industry: m.industry,
      channel: m.channel,
      budget_monthly: m.budget_monthly,
      revenue: m.revenue,
      roas: m.roas,
      region: m.region,
    }))

    // 8. Métricas agregadas
    const avgMetrics = {
      avgBudget: allMetrics?.reduce((sum, m) => sum + m.budget_monthly, 0) / (allMetrics?.length || 1),
      avgRevenue: allMetrics?.reduce((sum, m) => sum + m.revenue, 0) / (allMetrics?.length || 1),
      avgRoas: allMetrics?.reduce((sum, m) => sum + (m.roas || 0), 0) / (allMetrics?.length || 1),
      avgCac: allMetrics?.filter(m => m.cac).reduce((sum, m) => sum + (m.cac || 0), 0) / (allMetrics?.filter(m => m.cac).length || 1),
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalContributions: totalCount || 0,
        byIndustry,
        byChannel,
        byRegion,
        readyForRealData,
        recentContributions: recent,
        aggregateMetrics: avgMetrics,
      }
    })

  } catch (error: any) {
    console.error('Error in stats API:', error)
    return NextResponse.json(
      { error: 'Error inesperado', details: error?.message },
      { status: 500 }
    )
  }
}
