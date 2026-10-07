import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { MP_CLIENTE_ID } from '@/lib/crm/leads-pipeline'
import { alertarLeadFallido } from '@/lib/crm/alerta-lead-fallido'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Webhook para recibir datos de Google Ads desde Zapier
// Endpoint: POST /api/webhooks/google-ads

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log('📊 Webhook Google Ads recibido:', JSON.stringify(body, null, 2))

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extraer datos del payload de Zapier
    // Zapier puede enviar datos en diferentes formatos según la configuración
    const {
      // Identificación del cliente (requerido)
      cliente_id,
      cliente_nombre, // Alternativa: buscar por nombre

      // Datos de la campaña
      campaign_id,
      campaign_name,
      campaign_status = 'ACTIVE',

      // Fecha (formato YYYY-MM-DD o timestamp)
      fecha,
      date,

      // Métricas principales
      inversion,
      spend,
      cost,

      impresiones,
      impressions,

      clicks,

      conversiones,
      conversions,

      // Métricas opcionales
      ctr,
      cpc,
      cpm,

      // Token de seguridad (opcional pero recomendado)
      webhook_secret
    } = body

    // Validar token de seguridad si está configurado
    const expectedSecret = process.env.GOOGLE_ADS_WEBHOOK_SECRET
    if (expectedSecret && webhook_secret !== expectedSecret) {
      console.error('❌ Token de seguridad inválido')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Determinar cliente_id
    let finalClienteId = cliente_id

    // Si no hay cliente_id pero hay nombre, buscar por nombre
    // (antes: ilike parcial + .single() fallaba en silencio con 0 o 2+ coincidencias y
    // las métricas terminaban asignadas al cliente M&P por defecto)
    if (!finalClienteId && cliente_nombre) {
      // 1) Coincidencia exacta (sin distinguir mayúsculas)
      const { data: exactos } = await supabase
        .from('clientes')
        .select('id, nombre')
        .ilike('nombre', String(cliente_nombre))
        .limit(2)

      // 2) Si no hay exacta, coincidencia parcial
      let candidatos = exactos || []
      if (candidatos.length === 0) {
        const { data: parciales } = await supabase
          .from('clientes')
          .select('id, nombre')
          .ilike('nombre', `%${cliente_nombre}%`)
          .limit(2)
        candidatos = parciales || []
      }

      if (candidatos.length === 1) {
        finalClienteId = candidatos[0].id
      } else {
        const motivo = candidatos.length === 0
          ? `Ningún cliente coincide con cliente_nombre "${cliente_nombre}"`
          : `cliente_nombre "${cliente_nombre}" es ambiguo: coincide con ${candidatos.map(c => c.nombre).join(', ')}. Envía cliente_id`
        console.error('❌', motivo)
        await alertarLeadFallido({ fuente: 'Webhook Google Ads métricas (/api/webhooks/google-ads)', motivo, datos: body })
        return NextResponse.json({ error: motivo }, { status: 404 })
      }
    }

    // Si aún no hay cliente_id, usar el cliente por defecto (Muller y Perez)
    if (!finalClienteId) {
      const { data: clienteDefault } = await supabase
        .from('clientes')
        .select('id')
        .eq('id', MP_CLIENTE_ID) // ID fijo: buscar por nombre falla si otro cliente contiene "M&P"
        .maybeSingle()

      if (clienteDefault) {
        finalClienteId = clienteDefault.id
        console.log('ℹ️ Usando cliente por defecto:', finalClienteId)
      }
    }

    if (!finalClienteId) {
      return NextResponse.json({
        error: 'No se pudo determinar el cliente. Envía cliente_id o cliente_nombre.'
      }, { status: 400 })
    }

    // Buscar o crear integración de Google Ads
    let { data: integration } = await supabase
      .from('platform_integrations')
      .select('id')
      .eq('plataforma', 'google_ads')
      .eq('active', true)
      .limit(1) // con 2+ integraciones activas .single() fallaba y creaba otra más
      .maybeSingle()

    if (!integration) {
      // Crear integración si no existe
      const { data: newIntegration, error: integrationError } = await supabase
        .from('platform_integrations')
        .insert({
          plataforma: 'google_ads',
          account_id: 'zapier_webhook',
          account_name: 'Google Ads via Zapier',
          connected_by: 'zapier',
          sync_status: 'active',
          active: true
        })
        .select('id')
        .single()

      if (integrationError) {
        console.error('Error creando integración:', integrationError)
        return NextResponse.json({ error: 'Error creando integración' }, { status: 500 })
      }

      integration = newIntegration
      console.log('✅ Integración Google Ads creada:', integration.id)
    }

    // Verificar/crear mapping cliente-integración
    const { data: existingMapping } = await supabase
      .from('client_platform_mapping')
      .select('id')
      .eq('cliente_id', finalClienteId)
      .eq('integration_id', integration.id)
      .limit(1)
      .maybeSingle()

    if (!existingMapping) {
      await supabase
        .from('client_platform_mapping')
        .insert({
          cliente_id: finalClienteId,
          integration_id: integration.id,
          assigned_by: 'zapier',
          active: true
        })
      console.log('✅ Mapping cliente-integración creado')
    }

    // Normalizar datos
    const fechaFinal = fecha || date || new Date().toISOString().split('T')[0]
    const inversionFinal = parseFloat(inversion || spend || cost || 0)
    const impresionesFinal = parseInt(impresiones || impressions || 0)
    const clicksFinal = parseInt(clicks || 0)
    const conversionesFinal = parseFloat(conversiones || conversions || 0)

    // Calcular métricas si no vienen
    const ctrFinal = ctr || (impresionesFinal > 0 ? (clicksFinal / impresionesFinal) * 100 : 0)
    const cpcFinal = cpc || (clicksFinal > 0 ? inversionFinal / clicksFinal : 0)
    const cpmFinal = cpm || (impresionesFinal > 0 ? (inversionFinal / impresionesFinal) * 1000 : 0)

    // Insertar o actualizar métricas
    const metricData = {
      cliente_id: finalClienteId,
      integration_id: integration.id,
      plataforma: 'google_ads',
      campaign_id: campaign_id || 'default',
      campaign_name: campaign_name || 'Google Ads Campaign',
      campaign_status: campaign_status,
      fecha: fechaFinal,
      inversion: inversionFinal,
      impresiones: impresionesFinal,
      clicks: clicksFinal,
      conversiones: conversionesFinal,
      ctr: Math.round(ctrFinal * 100) / 100,
      cpc: Math.round(cpcFinal * 100) / 100,
      cpm: Math.round(cpmFinal * 100) / 100,
      updated_at: new Date().toISOString()
    }

    const { error: upsertError } = await supabase
      .from('ads_metrics_daily')
      .upsert(metricData, {
        onConflict: 'cliente_id,integration_id,campaign_id,fecha'
      })

    if (upsertError) {
      console.error('Error guardando métricas:', upsertError)
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    console.log('✅ Métricas Google Ads guardadas:', {
      cliente_id: finalClienteId,
      campaign: campaign_name,
      fecha: fechaFinal,
      inversion: inversionFinal,
      clicks: clicksFinal
    })

    return NextResponse.json({
      success: true,
      message: 'Métricas de Google Ads guardadas correctamente',
      data: {
        cliente_id: finalClienteId,
        campaign_name: campaign_name,
        fecha: fechaFinal,
        inversion: inversionFinal,
        clicks: clicksFinal,
        impresiones: impresionesFinal
      }
    })

  } catch (error: any) {
    console.error('❌ Error en webhook Google Ads:', error)
    return NextResponse.json({
      error: error.message || 'Error interno del servidor'
    }, { status: 500 })
  }
}

// También permitir GET para verificar que el endpoint existe
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/google-ads',
    method: 'POST',
    description: 'Webhook para recibir datos de Google Ads desde Zapier',
    required_fields: ['campaign_name', 'fecha', 'inversion', 'clicks', 'impresiones'],
    optional_fields: ['cliente_id', 'cliente_nombre', 'campaign_id', 'conversiones', 'ctr', 'cpc', 'cpm']
  })
}
