import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { CampaignMetric, Industry, Channel, Region, CompanySize } from '@/lib/types/intelligence'

// Validaciones de rangos razonables (basado en mercado chileno)
const VALIDATIONS = {
  budget: { min: 50000, max: 50000000 },
  revenue: { min: 0, max: 500000000 },
  roas: { min: 0.05, max: 50 },
  cac: { min: 100, max: 5000000 },
  conversion_rate: { min: 0.05, max: 80 },
  leads: { min: 1, max: 100000 },
  sales: { min: 1, max: 50000 }
}

const VALID_INDUSTRIES: Industry[] = [
  'ECOMMERCE', 'TECNOLOGIA_SAAS', 'SERVICIOS_PROFESIONALES', 'SALUD_MEDICINA',
  'EDUCACION_ONLINE', 'INMOBILIARIA', 'AUTOMOTRIZ', 'FINTECH', 'MODA_RETAIL',
  'TURISMO', 'CONSTRUCCION', 'VETERINARIA', 'DEPORTES', 'GASTRONOMIA', 'SEGUROS'
]

const VALID_CHANNELS: Channel[] = [
  'GOOGLE_ADS', 'META_ADS', 'LINKEDIN_ADS', 'TIKTOK_ADS', 'EMAIL_MARKETING'
]

const VALID_REGIONS: Region[] = [
  'METROPOLITANA', 'VALPARAISO', 'BIOBIO', 'ARAUCANIA', 'LOS_LAGOS',
  'MAULE', 'ANTOFAGASTA', 'COQUIMBO', 'OTRA'
]

const VALID_COMPANY_SIZES: CompanySize[] = [
  'STARTUP', 'PYME', 'EMPRESA', 'CORPORACION'
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      industry,
      channel,
      budget_monthly,
      revenue,
      leads_generated,
      sales_generated,
      cac,
      roas,
      conversion_rate,
      region,
      company_size,
      anonymous_user_id
    } = body

    console.log('📥 Received metrics submission:', JSON.stringify({
      industry,
      channel,
      budget_monthly,
      revenue,
      leads_generated,
      sales_generated,
      cac,
      roas,
      conversion_rate,
      region,
      company_size,
      anonymous_user_id
    }, null, 2))

    // Validar campos requeridos
    if (!industry || !channel || !budget_monthly || !revenue || !anonymous_user_id) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: industry, channel, budget_monthly, revenue, anonymous_user_id' },
        { status: 400 }
      )
    }

    // Validar enums
    if (!VALID_INDUSTRIES.includes(industry as Industry)) {
      return NextResponse.json(
        { error: `Industry inválida: ${industry}` },
        { status: 400 }
      )
    }

    if (!VALID_CHANNELS.includes(channel as Channel)) {
      return NextResponse.json(
        { error: `Channel inválido: ${channel}` },
        { status: 400 }
      )
    }

    if (region && !VALID_REGIONS.includes(region as Region)) {
      return NextResponse.json(
        { error: `Region inválida: ${region}` },
        { status: 400 }
      )
    }

    if (company_size && !VALID_COMPANY_SIZES.includes(company_size as CompanySize)) {
      return NextResponse.json(
        { error: `Company size inválido: ${company_size}` },
        { status: 400 }
      )
    }

    // Validar números
    const budgetNum = Number(budget_monthly)
    const revenueNum = Number(revenue)

    if (isNaN(budgetNum) || budgetNum < VALIDATIONS.budget.min || budgetNum > VALIDATIONS.budget.max) {
      return NextResponse.json(
        { error: `Presupuesto debe estar entre ${VALIDATIONS.budget.min} y ${VALIDATIONS.budget.max}` },
        { status: 400 }
      )
    }

    if (isNaN(revenueNum) || revenueNum < VALIDATIONS.revenue.min || revenueNum > VALIDATIONS.revenue.max) {
      return NextResponse.json(
        { error: `Revenue debe estar entre ${VALIDATIONS.revenue.min} y ${VALIDATIONS.revenue.max}` },
        { status: 400 }
      )
    }

    // Validar ROAS
    const roasNum = Number(roas)
    if (isNaN(roasNum) || roasNum < VALIDATIONS.roas.min || roasNum > VALIDATIONS.roas.max) {
      return NextResponse.json(
        { error: `ROAS de ${roasNum.toFixed(2)}x está fuera del rango válido (${VALIDATIONS.roas.min}x - ${VALIDATIONS.roas.max}x)` },
        { status: 400 }
      )
    }

    // Construir objeto para Supabase - solo campos con valores válidos
    const metric: Partial<CampaignMetric> = {
      industry: industry as Industry,
      channel: channel as Channel,
      budget_monthly: budgetNum,
      revenue: revenueNum,
      roas: roasNum,
      anonymous_user_id: String(anonymous_user_id)
    }

    // Agregar campos opcionales solo si son válidos
    if (leads_generated !== undefined && leads_generated !== null && leads_generated !== '') {
      const leadsNum = Number(leads_generated)
      if (!isNaN(leadsNum) && leadsNum >= VALIDATIONS.leads.min && leadsNum <= VALIDATIONS.leads.max) {
        metric.leads_generated = leadsNum
      }
    }

    if (sales_generated !== undefined && sales_generated !== null && sales_generated !== '') {
      const salesNum = Number(sales_generated)
      if (!isNaN(salesNum) && salesNum >= VALIDATIONS.sales.min && salesNum <= VALIDATIONS.sales.max) {
        metric.sales_generated = salesNum
      }
    }

    if (cac !== undefined && cac !== null && cac !== '') {
      const cacNum = Number(cac)
      if (!isNaN(cacNum) && isFinite(cacNum) && cacNum >= VALIDATIONS.cac.min && cacNum <= VALIDATIONS.cac.max) {
        metric.cac = cacNum
      }
    }

    if (conversion_rate !== undefined && conversion_rate !== null && conversion_rate !== '') {
      const convNum = Number(conversion_rate)
      if (!isNaN(convNum) && isFinite(convNum) && convNum >= VALIDATIONS.conversion_rate.min && convNum <= VALIDATIONS.conversion_rate.max) {
        metric.conversion_rate = convNum
      }
    }

    if (region && region !== '') {
      metric.region = region as Region
    }

    if (company_size && company_size !== '') {
      metric.company_size = company_size as CompanySize
    }

    console.log('✅ Validated metric object:', JSON.stringify(metric, null, 2))

    // Inicializar Supabase con variables de entorno del servidor
    // IMPORTANT: Strip whitespace and newlines from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\s/g, '')
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/\s/g, '')

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase credentials not configured')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('campaign_metrics')
      .insert(metric)
      .select()

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json(
        {
          error: 'Error al guardar en base de datos',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    console.log('✅ Metric saved successfully:', data)

    return NextResponse.json({
      success: true,
      message: 'Métricas guardadas exitosamente',
      data: data
    })

  } catch (error: any) {
    console.error('❌ Unexpected error in metrics API:', error)
    return NextResponse.json(
      {
        error: 'Error inesperado al procesar la solicitud',
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}
