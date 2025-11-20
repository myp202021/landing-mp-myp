// SINCRONIZAR CAMPAÑAS DE META ADS
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Leer variables de entorno
const envPath = resolve(__dirname, '../.env.local')
const envFile = readFileSync(envPath, 'utf-8')
const envVars = {}

envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    let value = match[2].trim()
    value = value.replace(/^[\"']|[\"']$/g, '')
    value = value.replace(/\n/g, '')
    envVars[key] = value
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('═══════════════════════════════════════════════════════════')
console.log('🔄 SINCRONIZAR CAMPAÑAS DE META ADS')
console.log('═══════════════════════════════════════════════════════════\n')

// PASO 1: Obtener integración de Meta Ads
console.log('🔍 Obteniendo integración de Meta Ads...\n')

const { data: integration, error: integrationError } = await supabase
  .from('platform_integrations')
  .select('*')
  .eq('plataforma', 'meta_ads')
  .eq('active', true)
  .single()

if (integrationError || !integration) {
  console.error('❌ No se encontró integración de Meta Ads')
  console.error('   Ejecuta primero: node scripts/connect-meta-ads-manual.mjs')
  process.exit(1)
}

console.log('✅ Integración encontrada:')
console.log(`   Account ID: ${integration.account_id}`)
console.log(`   Account Name: ${integration.account_name}\n`)

const accessToken = integration.access_token
const accountId = integration.account_id

// PASO 2: Obtener clientes asignados a esta integración
console.log('🔍 Obteniendo clientes asignados...\n')

const { data: mappings, error: mappingsError } = await supabase
  .from('client_platform_mapping')
  .select('*, clientes(*)')
  .eq('integration_id', integration.id)
  .eq('active', true)

if (mappingsError || !mappings || mappings.length === 0) {
  console.error('❌ No hay clientes asignados a esta integración')
  console.error('   Ejecuta primero: node scripts/assign-meta-to-client.mjs')
  process.exit(1)
}

console.log(`✅ ${mappings.length} cliente(s) asignado(s):`)
mappings.forEach(m => {
  console.log(`   - ${m.clientes.nombre}`)
})
console.log('')

// PASO 3: Obtener campañas de Meta Ads API
console.log('📡 Obteniendo campañas de Meta Marketing API...\n')

// Últimos 30 días
const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)

const since = thirtyDaysAgo.toISOString().split('T')[0]
const until = today.toISOString().split('T')[0]

console.log(`   Periodo: ${since} a ${until}\n`)

try {
  // Obtener campañas
  const campaignsUrl = `https://graph.facebook.com/v21.0/${accountId}/campaigns?fields=id,name,status,objective&access_token=${accessToken}`

  console.log('📊 Obteniendo lista de campañas...')

  const campaignsResponse = await fetch(campaignsUrl)
  const campaignsData = await campaignsResponse.json()

  if (campaignsData.error) {
    console.error('❌ Error obteniendo campañas:', campaignsData.error.message)
    process.exit(1)
  }

  const campaigns = campaignsData.data || []

  console.log(`✅ ${campaigns.length} campaña(s) encontrada(s)\n`)

  if (campaigns.length === 0) {
    console.log('⚠️  No hay campañas en esta cuenta')
    console.log('   Verifica que el Ad Account tenga campañas activas\n')
    process.exit(0)
  }

  // Mostrar campañas
  console.log('📋 Campañas:')
  campaigns.forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.name} (${c.status})`)
  })
  console.log('')

  // PASO 4: Para cada campaña, obtener insights
  let totalMetricsInserted = 0

  for (const campaign of campaigns) {
    console.log(`📊 Sincronizando: ${campaign.name}...`)

    const insightsUrl = `https://graph.facebook.com/v21.0/${campaign.id}/insights?` +
      `fields=campaign_name,spend,impressions,clicks,reach,frequency,actions&` +
      `time_range={"since":"${since}","until":"${until}"}&` +
      `time_increment=1&` +
      `access_token=${accessToken}`

    const insightsResponse = await fetch(insightsUrl)
    const insightsData = await insightsResponse.json()

    if (insightsData.error) {
      console.log(`   ⚠️  Error: ${insightsData.error.message}`)
      continue
    }

    const insights = insightsData.data || []

    if (insights.length === 0) {
      console.log(`   ⚠️  Sin datos en el periodo`)
      continue
    }

    // PASO 5: Guardar métricas por día
    for (const day of insights) {
      const conversions = day.actions ?
        day.actions.find(a => a.action_type === 'offsite_conversion.fb_pixel_purchase')?.value || 0
        : 0

      const clicks = parseInt(day.clicks || 0)
      const impressions = parseInt(day.impressions || 0)
      const spend = parseFloat(day.spend || 0)

      const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : 0
      const cpc = clicks > 0 ? (spend / clicks).toFixed(2) : 0
      const cpm = impressions > 0 ? ((spend / impressions) * 1000).toFixed(2) : 0

      // Insertar para cada cliente asignado
      for (const mapping of mappings) {
        const metricData = {
          cliente_id: mapping.cliente_id,
          integration_id: integration.id,
          plataforma: 'meta_ads',
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          campaign_status: campaign.status,
          fecha: day.date_start,
          inversion: spend,
          impresiones: impressions,
          clicks: clicks,
          conversiones: parseFloat(conversions),
          ctr: parseFloat(ctr),
          cpc: parseFloat(cpc),
          cpm: parseFloat(cpm),
          reach: parseInt(day.reach || 0),
          frequency: parseFloat(day.frequency || 0)
        }

        const { error } = await supabase
          .from('ads_metrics_daily')
          .upsert(metricData, {
            onConflict: 'cliente_id,integration_id,campaign_id,fecha'
          })

        if (error) {
          console.log(`   ❌ Error guardando métricas: ${error.message}`)
        } else {
          totalMetricsInserted++
        }
      }
    }

    console.log(`   ✅ ${insights.length} día(s) sincronizado(s)`)
  }

  // PASO 6: Actualizar last_sync
  await supabase
    .from('platform_integrations')
    .update({
      last_sync: new Date().toISOString(),
      sync_status: 'active'
    })
    .eq('id', integration.id)

  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('✅ SINCRONIZACIÓN COMPLETADA')
  console.log('═══════════════════════════════════════════════════════════')

  console.log('\n📊 RESUMEN:')
  console.log(`   Campañas procesadas: ${campaigns.length}`)
  console.log(`   Métricas guardadas: ${totalMetricsInserted}`)
  console.log(`   Clientes actualizados: ${mappings.length}`)

  console.log('\n📋 SIGUIENTE PASO:')
  console.log('   Ve al dashboard del cliente y verifica los datos en el tab "Campañas"\n')

} catch (error) {
  console.error('\n❌ Error inesperado:', error.message)

  // Marcar integración con error
  await supabase
    .from('platform_integrations')
    .update({
      sync_status: 'error',
      sync_error: error.message
    })
    .eq('id', integration.id)

  process.exit(1)
}

process.exit(0)
