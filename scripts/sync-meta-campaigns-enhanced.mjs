// SINCRONIZAR CAMPAÑAS DE META ADS CON DESGLOSE POR PLATAFORMA Y AD
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
console.log('🔄 SINCRONIZAR CAMPAÑAS DE META ADS (ENHANCED)')
console.log('   - Con desglose por plataforma (Instagram/Facebook)')
console.log('   - Con métricas a nivel de ad/post')
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

// PASO 3: Definir periodo
const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)

const since = thirtyDaysAgo.toISOString().split('T')[0]
const until = today.toISOString().split('T')[0]

console.log(`📅 Periodo: ${since} a ${until}\n`)

try {
  // PASO 4: Obtener campañas
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
    process.exit(0)
  }

  console.log('📋 Campañas:')
  campaigns.forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.name} (${c.status})`)
  })
  console.log('')

  let totalCampaignMetrics = 0
  let totalAdMetrics = 0

  // PASO 5: Por cada campaña, obtener insights con desglose de plataforma
  for (const campaign of campaigns) {
    console.log(`\n📊 Sincronizando campaña: ${campaign.name}`)
    console.log(`   ${'─'.repeat(60)}`)

    // 5.1 Insights a nivel de campaña CON breakdown por plataforma
    console.log('   📈 Obteniendo insights por plataforma...')

    const campaignInsightsUrl = `https://graph.facebook.com/v21.0/${campaign.id}/insights?` +
      `fields=campaign_name,spend,impressions,clicks,reach,frequency,actions&` +
      `breakdowns=publisher_platform&` +
      `time_range={"since":"${since}","until":"${until}"}&` +
      `time_increment=1&` +
      `access_token=${accessToken}`

    const campaignInsightsResponse = await fetch(campaignInsightsUrl)
    const campaignInsightsData = await campaignInsightsResponse.json()

    if (campaignInsightsData.error) {
      console.log(`   ⚠️  Error insights campaña: ${campaignInsightsData.error.message}`)
    } else {
      const insights = campaignInsightsData.data || []

      if (insights.length > 0) {
        // Guardar métricas por día y plataforma
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

          for (const mapping of mappings) {
            const metricData = {
              cliente_id: mapping.cliente_id,
              integration_id: integration.id,
              plataforma: 'meta_ads',
              campaign_id: campaign.id,
              campaign_name: campaign.name,
              campaign_status: campaign.status,
              publisher_platform: day.publisher_platform || 'unknown',
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

            await supabase
              .from('ads_metrics_daily')
              .upsert(metricData, {
                onConflict: 'cliente_id,integration_id,campaign_id,fecha,publisher_platform'
              })

            totalCampaignMetrics++
          }
        }

        console.log(`   ✅ Campaña: ${insights.length} registros guardados`)
      }
    }

    // 5.2 Obtener ads de esta campaña
    console.log('   🎨 Obteniendo ads...')

    const adsUrl = `https://graph.facebook.com/v21.0/${campaign.id}/ads?` +
      `fields=id,name,status,creative{id,name,thumbnail_url,body,object_story_spec}&` +
      `access_token=${accessToken}`

    const adsResponse = await fetch(adsUrl)
    const adsData = await adsResponse.json()

    if (adsData.error) {
      console.log(`   ⚠️  Error obteniendo ads: ${adsData.error.message}`)
      continue
    }

    const ads = adsData.data || []

    if (ads.length === 0) {
      console.log(`   ⚠️  Sin ads en esta campaña`)
      continue
    }

    console.log(`   ✅ ${ads.length} ad(s) encontrado(s)`)

    // 5.3 Por cada ad, obtener insights con breakdown de plataforma
    for (const ad of ads) {
      const adInsightsUrl = `https://graph.facebook.com/v21.0/${ad.id}/insights?` +
        `fields=ad_name,spend,impressions,clicks,reach,frequency,actions,video_play_actions&` +
        `breakdowns=publisher_platform&` +
        `time_range={"since":"${since}","until":"${until}"}&` +
        `time_increment=1&` +
        `access_token=${accessToken}`

      const adInsightsResponse = await fetch(adInsightsUrl)
      const adInsightsData = await adInsightsResponse.json()

      if (adInsightsData.error) {
        console.log(`      ⚠️  Error insights ad ${ad.name}: ${adInsightsData.error.message}`)
        continue
      }

      const adInsights = adInsightsData.data || []

      // Guardar métricas por día y plataforma
      for (const day of adInsights) {
        const conversions = day.actions ?
          day.actions.find(a => a.action_type === 'offsite_conversion.fb_pixel_purchase')?.value || 0
          : 0

        const likes = day.actions ?
          day.actions.find(a => a.action_type === 'like')?.value || 0
          : 0

        const comments = day.actions ?
          day.actions.find(a => a.action_type === 'comment')?.value || 0
          : 0

        const shares = day.actions ?
          day.actions.find(a => a.action_type === 'post')?.value || 0
          : 0

        const videoViews = day.video_play_actions ?
          day.video_play_actions.find(a => a.action_type === 'video_view')?.value || 0
          : 0

        const clicks = parseInt(day.clicks || 0)
        const impressions = parseInt(day.impressions || 0)
        const spend = parseFloat(day.spend || 0)

        const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : 0
        const cpc = clicks > 0 ? (spend / clicks).toFixed(2) : 0
        const cpm = impressions > 0 ? ((spend / impressions) * 1000).toFixed(2) : 0

        // Extraer info del creative
        const creative = ad.creative || {}
        const creativeBody = creative.body || ''
        const creativeThumbnail = creative.thumbnail_url || ''
        const creativeLink = creative.object_story_spec?.link_data?.link || ''

        for (const mapping of mappings) {
          const adMetricData = {
            cliente_id: mapping.cliente_id,
            integration_id: integration.id,
            plataforma: 'meta_ads',
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            ad_id: ad.id,
            ad_name: ad.name,
            ad_status: ad.status,
            ad_creative_id: creative.id,
            ad_creative_name: creative.name,
            ad_creative_thumbnail_url: creativeThumbnail,
            ad_creative_body: creativeBody,
            ad_creative_link_url: creativeLink,
            publisher_platform: day.publisher_platform || 'unknown',
            fecha: day.date_start,
            inversion: spend,
            impresiones: impressions,
            clicks: clicks,
            conversiones: parseFloat(conversions),
            ctr: parseFloat(ctr),
            cpc: parseFloat(cpc),
            cpm: parseFloat(cpm),
            reach: parseInt(day.reach || 0),
            frequency: parseFloat(day.frequency || 0),
            likes: parseInt(likes),
            comments: parseInt(comments),
            shares: parseInt(shares),
            video_views: parseInt(videoViews)
          }

          await supabase
            .from('ads_metrics_by_ad')
            .upsert(adMetricData, {
              onConflict: 'cliente_id,integration_id,ad_id,publisher_platform,fecha'
            })

          totalAdMetrics++
        }
      }
    }

    console.log(`   ✅ Ads: ${ads.length * mappings.length} registros guardados`)
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
  console.log(`   Métricas de campaña guardadas: ${totalCampaignMetrics}`)
  console.log(`   Métricas de ads guardadas: ${totalAdMetrics}`)
  console.log(`   Clientes actualizados: ${mappings.length}`)

  console.log('\n📋 CARACTERÍSTICAS:')
  console.log('   ✓ Desglose por plataforma (Instagram, Facebook, etc.)')
  console.log('   ✓ Métricas a nivel de ad/post individual')
  console.log('   ✓ Datos de engagement (likes, comments, shares)')
  console.log('   ✓ Información de creativos (thumbnails, textos, links)')

  console.log('\n📋 SIGUIENTE PASO:')
  console.log('   Ve al dashboard del cliente y verifica los datos mejorados\n')

} catch (error) {
  console.error('\n❌ Error inesperado:', error.message)
  console.error(error)

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
