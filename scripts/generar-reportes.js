/**
 * Generador automático de reportes mensuales para clientes M&P
 * Corre el día 1 de cada mes via GitHub Actions
 *
 * Por cada cliente:
 * 1. Lista integraciones activas
 * 2. Trae métricas del mes anterior vs el previo (filtra 0s)
 * 3. Trae data histórica del año para tabla evolutiva
 * 4. Genera reporte en Reportei (template, sin integraciones con 0)
 * 5. Arma HTML email-compatible (tablas)
 * 6. Manda email a contacto@ con HTML + link Reportei
 */

const fetch = require('node-fetch')
const path = require('path')
const config = require('./config-reportes.json')

const REPORTEI_TOKEN = process.env.REPORTEI_TOKEN
const RESEND_KEY = process.env.RESEND
const BASE = 'https://app.reportei.com/api/v2'

// ============================================================
// UTILS
// ============================================================
const sleep = (ms) => new Promise(r => setTimeout(r, ms))
let requestCount = 0
const fmt = (n) => Math.round(n).toLocaleString('es-CL')
const fmtPct = (n) => (n * 100).toFixed(1) + '%'
const fmtMoney = (n) => '$' + fmt(n)

function getMesAnterior() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() // 0-indexed, so if now is April (3), m=3, mes anterior = March (2)

  // Mes a reportar (anterior)
  const mesYear = m === 0 ? y - 1 : y
  const mesMonth = m === 0 ? 12 : m
  const start = `${mesYear}-${String(mesMonth).padStart(2, '0')}-01`
  const lastDay = new Date(mesYear, mesMonth, 0).getDate()
  const end = `${mesYear}-${String(mesMonth).padStart(2, '0')}-${lastDay}`

  // Mes de comparación (el anterior al anterior)
  const compMonth = mesMonth === 1 ? 12 : mesMonth - 1
  const compYear = mesMonth === 1 ? mesYear - 1 : mesYear
  const compStart = `${compYear}-${String(compMonth).padStart(2, '0')}-01`
  const compLastDay = new Date(compYear, compMonth, 0).getDate()
  const compEnd = `${compYear}-${String(compMonth).padStart(2, '0')}-${compLastDay}`

  const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return {
    start, end, compStart, compEnd,
    mesNombre: meses[mesMonth],
    compNombre: meses[compMonth],
    mesYear, mesMonth
  }
}

function getMesesAño(mesYear, mesMonth) {
  // Retorna array de {start, end, nombre} para cada mes del año hasta mesMonth
  const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const result = []
  for (let m = 1; m <= mesMonth; m++) {
    const lastDay = new Date(mesYear, m, 0).getDate()
    result.push({
      start: `${mesYear}-${String(m).padStart(2, '0')}-01`,
      end: `${mesYear}-${String(m).padStart(2, '0')}-${lastDay}`,
      nombre: meses[m].substring(0, 3)
    })
  }
  return result
}

// ============================================================
// API CALLS
// ============================================================
async function apiGet(endpoint) {
  requestCount++
  await sleep(3000) // 3s entre cada llamada
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${REPORTEI_TOKEN}` }
  })
  if (res.status === 429) {
    console.log(`  ⚠️ Rate limit hit — esperando 30s...`)
    await sleep(30000)
    const retry = await fetch(`${BASE}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${REPORTEI_TOKEN}` }
    })
    return retry.json()
  }
  return res.json()
}

async function apiPost(endpoint, body) {
  requestCount++
  await sleep(3000) // 3s entre cada llamada
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${REPORTEI_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (res.status === 429) {
    console.log(`  ⚠️ Rate limit hit — esperando 30s...`)
    await sleep(30000)
    const retry = await fetch(`${BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${REPORTEI_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return retry.json()
  }
  return res.json()
}

// ============================================================
// MÉTRICAS POR PLATAFORMA
// ============================================================
const METRIC_DEFS = {
  google_adwords: {
    kpis: [
      { id: 'ac783213-2807-4366-b7e7-e8022f8b4ab3', ref: 'gads:cost_micros', comp: 'number_v1', metrics: ['metrics.cost_micros'], type: ['spend'], label: 'Inversión', format: 'money' },
      { id: 'eeb90961-f47b-402a-bcf0-bcfe4e1abc99', ref: 'gads:clicks', comp: 'number_v1', metrics: ['metrics.clicks'], type: 'clicks', label: 'Clics', format: 'num' },
      { id: '514fea86-47c6-45b0-a7a1-495e6835fc18', ref: 'gads:impressions', comp: 'number_v1', metrics: ['metrics.impressions'], type: 'impressions', label: 'Impresiones', format: 'num' },
      { id: '0d2ed103-0bb8-42f0-9a46-1d89a9b6ac4f', ref: 'gads:conversions', comp: 'number_v1', metrics: ['metrics.conversions'], type: 'conversion', label: 'Conversiones', format: 'num' },
      { id: '8f09beff-8a1b-47fc-b6f2-4b972ddbb791', ref: 'gads:ctr', comp: 'number_v1', metrics: ['metrics.ctr'], type: [], label: 'CTR', format: 'pct' },
      { id: '9fd915aa-d594-44e3-acae-3c1054dba091', ref: 'gads:average_cpc', comp: 'number_v1', metrics: ['metrics.average_cpc'], type: [], label: 'CPC', format: 'money' },
      { id: 'fa5653b1-d2c9-4cff-8f34-15c4f1359f93', ref: 'gads:cost_per_conversion', comp: 'number_v1', metrics: ['metrics.cost_per_conversion'], type: [], label: 'CPA', format: 'money' }
    ],
    campaigns: { id: '7bfdda3b-1840-4073-aedd-0c330670645f', ref: 'gads:top_campaigns', comp: 'datatable_v1', metrics: ['campaign.advertising_channel_type', 'metrics.clicks', 'metrics.cost_micros', 'metrics.impressions', 'metrics.conversions', 'metrics.ctr', 'metrics.average_cpc', 'metrics.cost_per_conversion'], dimensions: ['campaign'], sort: ['-metrics.clicks'] }
  },
  facebook_ads: {
    kpis: [
      { id: 'spend', ref: 'facebook_ads:spend', comp: 'number_v1', metrics: ['spend'], type: ['spend'], label: 'Inversión', format: 'money' },
      { id: 'clicks', ref: 'facebook_ads:clicks', comp: 'number_v1', metrics: ['clicks'], type: 'clicks', label: 'Clics', format: 'num' },
      { id: 'reach', ref: 'facebook_ads:reach', comp: 'number_v1', metrics: ['reach'], type: [], label: 'Alcance', format: 'num' },
      { id: 'impressions', ref: 'facebook_ads:impressions', comp: 'number_v1', metrics: ['impressions'], type: 'impressions', label: 'Impresiones', format: 'num' },
      { id: 'wa', ref: 'facebook_ads:actions_onsite_conversion.messaging_conversation_started_7d', comp: 'number_v1', metrics: ['actions:onsite_conversion.messaging_conversation_started_7d'], type: [], label: 'WhatsApp', format: 'num' },
      { id: 'vv', ref: 'facebook_ads:actions_video_view', comp: 'number_v1', metrics: ['actions:video_view'], type: [], label: 'Video Views', format: 'num' },
      { id: 'pe', ref: 'facebook_ads:actions_post_engagement', comp: 'number_v1', metrics: ['actions:post_engagement'], type: [], label: 'Engagement', format: 'num' },
      { id: 'cpc', ref: 'facebook_ads:cpc', comp: 'number_v1', metrics: ['cpc'], type: [], label: 'CPC', format: 'money' },
      { id: 'ctr', ref: 'facebook_ads:ctr', comp: 'number_v1', metrics: ['ctr'], type: [], label: 'CTR', format: 'pct' }
    ]
  },
  instagram_business: {
    kpis: [
      { id: '58b22e4b-4f86-44fb-8366-3e73eeff7813', ref: 'ig:followers_count', comp: 'number_v1', metrics: ['followers'], type: [], label: 'Seguidores', format: 'num' },
      { id: '8e6a9ef7-ef07-4c2f-8e14-111d0f09d9d6', ref: 'ig:reach', comp: 'number_v1', metrics: ['reach'], type: [], label: 'Alcance', format: 'num' }
    ],
    posts: { id: '33cbd444-5574-4d1a-96df-3b0d2322f8e3', ref: 'ig:media_datatable', comp: 'datatable_v1', metrics: ['type', 'reach', 'views', 'total_interactions', 'post_interactions_rate', 'likes', 'comments', 'saved', 'follows', 'profile_visits', 'shares', 'created_at'], dimensions: ['media'], sort: ['-reach'] }
  },
  google_analytics_4: {
    kpis: [
      { id: 'b1', ref: 'google_analytics_4:all_sessions', comp: 'number_v1', metrics: ['sessions'], type: [], label: 'Sesiones', format: 'num' },
      { id: 'b2', ref: 'google_analytics_4:all_users', comp: 'number_v1', metrics: ['activeUsers'], type: [], label: 'Usuarios', format: 'num' },
      { id: 'b3', ref: 'google_analytics_4:new_users', comp: 'number_v1', metrics: ['newUsers'], type: [], label: 'Nuevos', format: 'num' },
      { id: 'b4', ref: 'google_analytics_4:all_pageviews', comp: 'number_v1', metrics: ['screenPageViews'], type: [], label: 'Pág. Vistas', format: 'num' }
    ],
    channels: { id: '51c233c6-7cea-4487-b538-2ba218190d57', ref: 'google_analytics_4:session_default_channel_group_datatable', comp: 'datatable_v1', metrics: ['sessions', 'activeUsers', 'newUsers', 'screenPageViews', 'screenPageViewsPerUser', 'keyevents', 'userKeyEventRate'], dimensions: ['sessionDefaultChannelGroup'], sort: ['-sessions'] }
  }
}

// ============================================================
// FETCH METRICS FOR ONE INTEGRATION
// ============================================================
async function fetchMetrics(integrationId, start, end, compStart, compEnd, slug) {
  const defs = METRIC_DEFS[slug]
  if (!defs) return null

  const metricsToFetch = []

  // KPIs
  if (defs.kpis) {
    defs.kpis.forEach(k => {
      metricsToFetch.push({ id: k.id, reference_key: k.ref, component: k.comp, metrics: k.metrics, dimensions: [], sort: [], custom: [], type: k.type })
    })
  }
  // Campaigns/posts/channels
  ;['campaigns', 'posts', 'channels'].forEach(key => {
    if (defs[key]) {
      const d = defs[key]
      metricsToFetch.push({ id: d.id, reference_key: d.ref, component: d.comp, metrics: d.metrics, dimensions: d.dimensions || [], sort: d.sort || [], custom: [], type: [] })
    }
  })

  const body = {
    integration_id: integrationId,
    start, end,
    ...(compStart ? { comparison_start: compStart, comparison_end: compEnd } : {}),
    metrics: metricsToFetch
  }

  const result = await apiPost('/metrics/get-data', body)
  if (result.errors || !result.data) return null

  // Parse results
  const parsed = { kpis: [], campaigns: null, posts: null, channels: null }

  if (defs.kpis) {
    defs.kpis.forEach(k => {
      const d = result.data[k.id]
      if (!d || d.warning || d.message) return
      let val = d.values
      if (val === undefined || val === null || val === 0 || val === '0') return
      val = parseFloat(val)
      if (isNaN(val) || val === 0) return

      const comp = d.comparison || {}
      let prevVal = comp.values ? parseFloat(comp.values) : null
      if (prevVal === 0) prevVal = null
      const change = comp.difference || null

      parsed.kpis.push({ label: k.label, value: val, prev: prevVal, change, format: k.format })
    })
  }

  // Campaigns
  if (defs.campaigns && result.data[defs.campaigns.id]) {
    const cd = result.data[defs.campaigns.id]
    if (cd.values && Array.isArray(cd.values) && cd.values.length > 0 && cd.values[0][0] !== null) {
      parsed.campaigns = cd.values
    }
  }

  // Posts
  if (defs.posts && result.data[defs.posts.id]) {
    const pd = result.data[defs.posts.id]
    if (pd.values && Array.isArray(pd.values) && pd.values.length > 0) {
      parsed.posts = pd.values
    }
  }

  // Channels
  if (defs.channels && result.data[defs.channels.id]) {
    const chd = result.data[defs.channels.id]
    if (chd.values && Array.isArray(chd.values) && chd.values.length > 0) {
      parsed.channels = chd.values
    }
  }

  return parsed.kpis.length > 0 || parsed.campaigns || parsed.posts || parsed.channels ? parsed : null
}

// ============================================================
// FETCH EVOLUTION DATA (year to date)
// ============================================================
async function fetchEvolution(integrationId, meses) {
  // Only for google_adwords — fetch cost, clicks, conversions, cpc, cpa for each month
  const evoMetrics = [
    { id: 'ac783213-2807-4366-b7e7-e8022f8b4ab3', ref: 'gads:cost_micros', comp: 'number_v1', metrics: ['metrics.cost_micros'], type: ['spend'], label: 'Inversión' },
    { id: '0d2ed103-0bb8-42f0-9a46-1d89a9b6ac4f', ref: 'gads:conversions', comp: 'number_v1', metrics: ['metrics.conversions'], type: 'conversion', label: 'Conversiones' },
    { id: '9fd915aa-d594-44e3-acae-3c1054dba091', ref: 'gads:average_cpc', comp: 'number_v1', metrics: ['metrics.average_cpc'], type: [], label: 'CPC' },
    { id: 'fa5653b1-d2c9-4cff-8f34-15c4f1359f93', ref: 'gads:cost_per_conversion', comp: 'number_v1', metrics: ['metrics.cost_per_conversion'], type: [], label: 'CPA' }
  ]

  const evolution = {}
  evoMetrics.forEach(m => { evolution[m.label] = {} })

  for (const mes of meses) {
    const body = {
      integration_id: integrationId,
      start: mes.start,
      end: mes.end,
      metrics: evoMetrics.map(m => ({ id: m.id, reference_key: m.ref, component: m.comp, metrics: m.metrics, dimensions: [], sort: [], custom: [], type: m.type }))
    }
    try {
      const result = await apiPost('/metrics/get-data', body)
      if (result && result.data) {
        evoMetrics.forEach(m => {
          if (result.data[m.id] && result.data[m.id].values !== undefined && result.data[m.id].values !== null) {
            const val = parseFloat(result.data[m.id].values)
            if (!isNaN(val) && val > 0) evolution[m.label][mes.nombre] = val
          }
        })
      }
    } catch (e) {
      console.log(`    → Error evolución ${mes.nombre}: ${e.message}`)
    }
  }

  return evolution
}

// ============================================================
// HTML GENERATORS (email-compatible tables)
// ============================================================
function formatValue(val, format) {
  if (format === 'money') return fmtMoney(val)
  if (format === 'pct') return fmtPct(val)
  return fmt(val)
}

function changeBadge(change) {
  if (change === null || change === undefined) return '<span style="font-size:8px;font-weight:bold;background:#F3F4F6;color:#6B7280;padding:1px 4px;border-radius:3px;">—</span>'
  // Regla: si baja más de 10%, no mostrar variación (solo guión)
  if (change < -10) return '<span style="font-size:8px;font-weight:bold;background:#F3F4F6;color:#6B7280;padding:1px 4px;border-radius:3px;">—</span>'
  // Nunca rojo — solo verde (positivo) o gris neutro (negativo leve)
  const isPositive = change >= 0
  const bg = isPositive ? '#D1FAE5' : '#F3F4F6'
  const color = isPositive ? '#065F46' : '#6B7280'
  const sign = change > 0 ? '+' : ''
  return `<span style="font-size:8px;font-weight:bold;background:${bg};color:${color};padding:1px 4px;border-radius:3px;">${sign}${change.toFixed(1)}%</span>`
}

function kpiCell(kpi) {
  return `<td width="25%" style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:6px;padding:8px 10px;">
    <div style="font-size:8px;color:#9CA3AF;font-weight:bold;text-transform:uppercase;">${kpi.label}</div>
    <div style="font-size:17px;font-weight:bold;color:#0A1628;">${formatValue(kpi.value, kpi.format)}</div>
    <div>${kpi.prev ? `<span style="font-size:8px;color:#C4B5FD;">${formatValue(kpi.prev, kpi.format)}</span> ` : ''}${changeBadge(kpi.change)}</div>
  </td>`
}

function renderKpis(kpis) {
  let html = ''
  for (let i = 0; i < kpis.length; i += 4) {
    const row = kpis.slice(i, i + 4)
    html += `<table width="100%" cellpadding="0" cellspacing="6" style="margin-bottom:2px;"><tr>${row.map(k => kpiCell(k)).join('')}</tr></table>`
  }
  return html
}

function renderGadsCampaigns(campaigns) {
  if (!campaigns || campaigns.length === 0) return ''
  const typeColors = { Search: '#4285f4', Performance_max: '#34A853', Shopping: '#FBBC05' }
  let rows = ''
  campaigns.forEach((c, i) => {
    const bg = i % 2 === 0 ? 'white' : '#F8FAFC'
    const name = c[0] || 'Sin nombre'
    const type = c[1] || ''
    const typeColor = typeColors[type] || '#6B7280'
    const typeTxt = type === 'Performance_max' ? 'PMax' : type
    rows += `<tr style="background:${bg};"><td style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;"><b>${name.substring(0, 35)}</b><br><span style="font-size:7px;color:white;background:${typeColor};padding:1px 4px;border-radius:3px;">${typeTxt}</span></td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${fmtMoney(c[3])}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${fmt(c[2])}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${Math.round(c[5])}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${fmtMoney(c[7])}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${fmtMoney(c[8])}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${(c[6] * 100).toFixed(1)}%</td></tr>`
  })

  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;border-collapse:collapse;">
    <tr style="background:#0A1628;"><td style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Campaña</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Inversión</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Clics</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Conv.</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">CPC</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">CPA</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">CTR</td></tr>
    ${rows}
  </table>`
}

function renderEvolution(evo, meses) {
  if (!evo || Object.keys(evo).length === 0) return ''
  const headers = meses.map(m => `<td align="center" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">${m.nombre}</td>`).join('')
  let rows = ''
  Object.keys(evo).forEach((label, i) => {
    const bg = i % 2 === 0 ? 'white' : '#F8FAFC'
    const cells = meses.map((m, mi) => {
      const val = evo[label][m.nombre]
      const isLast = mi === meses.length - 1
      const style = isLast ? 'background:#EFF6FF;font-weight:bold;color:#0055A4;' : ''
      return `<td align="center" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;${style}">${val !== undefined ? (label === 'Inversión' ? fmtMoney(val) : label === 'CPC' || label === 'CPA' ? fmtMoney(val) : fmt(val)) : '—'}</td>`
    }).join('')
    rows += `<tr style="background:${bg};"><td style="padding:5px 8px;font-size:10px;font-weight:bold;border-bottom:1px solid #F3F4F6;">${label}</td>${cells}</tr>`
  })

  return `<div style="margin-top:12px;font-size:10px;font-weight:bold;color:#0A1628;">Evolución ${meses[0].nombre.substring(0,3) === 'Ene' ? new Date().getFullYear() : ''} — Google Ads</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;border-collapse:collapse;">
    <tr style="background:#0A1628;"><td style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Métrica</td>${headers}</tr>
    ${rows}
  </table>`
}

function renderIgPosts(posts) {
  if (!posts || posts.length === 0) return ''
  let rows = ''
  posts.slice(0, 8).forEach((p, i) => {
    const bg = i % 2 === 0 ? 'white' : '#F8FAFC'
    const type = p[1] || 'Post'
    const typeColor = type === 'Reels' || type === 'Reel' ? '#EC4899' : '#8B5CF6'
    const typeLabel = type === 'Reels' || type === 'Reel' ? 'REEL' : 'IMG'
    const date = p[12] ? new Date(p[12]).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : '—'
    rows += `<tr style="background:${bg};"><td style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${date}</td><td style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;"><span style="font-size:7px;color:white;background:${typeColor};padding:1px 4px;border-radius:3px;font-weight:bold;">${typeLabel}</span></td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${p[2] || 0}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${p[3] || 0}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${p[4] || 0}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${p[6] || 0}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${p[8] || 0}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${p[11] || 0}</td></tr>`
  })

  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;border-collapse:collapse;">
    <tr style="background:#0A1628;"><td style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Fecha</td><td style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Tipo</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Alcance</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Views</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Interacc.</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Likes</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Guardados</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Shares</td></tr>
    ${rows}
  </table>`
}

function renderChannels(channels) {
  if (!channels || channels.length === 0) return ''
  const totalSessions = channels.reduce((s, c) => s + parseInt(c[1] || 0), 0)
  let rows = ''
  channels.slice(0, 7).forEach((c, i) => {
    const bg = i % 2 === 0 ? 'white' : '#F8FAFC'
    const pct = totalSessions > 0 ? ((parseInt(c[1]) / totalSessions) * 100).toFixed(1) + '%' : '—'
    rows += `<tr style="background:${bg};"><td style="padding:5px 8px;font-size:10px;font-weight:bold;border-bottom:1px solid #F3F4F6;">${c[0]}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${fmt(c[1])}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${fmt(c[2])}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${fmt(c[4])}</td><td align="right" style="padding:5px 8px;font-size:10px;border-bottom:1px solid #F3F4F6;">${pct}</td></tr>`
  })

  return `<div style="margin-top:8px;font-size:10px;font-weight:bold;color:#0A1628;">Canales de Tráfico</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;border-collapse:collapse;">
    <tr style="background:#0A1628;"><td style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Canal</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Sesiones</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Usuarios</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">Pág. Vistas</td><td align="right" style="padding:5px 8px;color:white;font-size:8px;font-weight:bold;">% Total</td></tr>
    ${rows}
  </table>`
}

function renderHighlight(label, value, sublabel, color) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;"><tr>
    <td style="background:${color || '#F0FDF4'};border-radius:6px;padding:10px 14px;">
      <span style="font-size:8px;color:#6B7280;font-weight:bold;text-transform:uppercase;">⭐ ${label}</span><br>
      <span style="font-size:15px;font-weight:bold;color:#0A1628;">${value}</span>
      ${sublabel ? `<br><span style="font-size:9px;color:#6B7280;">${sublabel}</span>` : ''}
    </td>
  </tr></table>`
}

function getBestCampaign(campaigns) {
  if (!campaigns || campaigns.length < 2) return null
  // Filtrar campañas con al menos 5 conversiones
  const valid = campaigns.filter(c => c[5] >= 5)
  if (valid.length === 0) return null
  // Ordenar por menor CPA (index 8)
  valid.sort((a, b) => (a[8] || 999999) - (b[8] || 999999))
  const best = valid[0]
  return { name: best[0], cpa: best[8], conv: Math.round(best[5]), type: best[1] }
}

function getBestPost(posts) {
  if (!posts || posts.length === 0) return null
  // El primero ya viene ordenado por alcance (sort -reach)
  const best = posts[0]
  const type = (best[1] === 'Reels' || best[1] === 'Reel') ? 'Reel' : 'Imagen'
  const date = best[12] ? new Date(best[12]).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : ''
  return { type, reach: best[2], interactions: best[4], likes: best[6], date }
}

function renderSection(title, icon, iconBg, tag, kpis, extra) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:white;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:12px;">
  <tr><td style="padding:14px 16px;border-bottom:2px solid #F3F4F6;">
    <span style="display:inline-block;width:22px;height:22px;background:${iconBg};border-radius:5px;color:white;font-size:10px;font-weight:bold;text-align:center;line-height:22px;vertical-align:middle;">${icon}</span>
    <span style="font-size:13px;font-weight:bold;color:#0A1628;vertical-align:middle;margin-left:6px;">${title}</span>
    ${tag ? `<span style="font-size:8px;color:#6B7280;background:#F3F4F6;padding:2px 6px;border-radius:4px;vertical-align:middle;margin-left:6px;">${tag}</span>` : ''}
  </td></tr>
  <tr><td style="padding:12px 16px;">
    ${renderKpis(kpis)}
    ${extra || ''}
  </td></tr>
  </table>`
}

// ============================================================
// BUILD FULL EMAIL HTML
// ============================================================
function buildEmailHtml(cliente, periodo, sections, reporteiUrl) {
  const badge = (text, bg, color, border) => `<table cellpadding="0" cellspacing="0" style="margin-bottom:12px;"><tr><td style="background:${bg};color:${color};font-size:9px;font-weight:bold;padding:3px 10px;border-radius:8px;border:1px solid ${border};text-transform:uppercase;letter-spacing:1px;">${text}</td></tr></table>`
  const divider = `<tr><td><div style="height:1px;background:linear-gradient(90deg,#E5E7EB,#0055A4,#8B5CF6,#E5E7EB);margin:8px 0;"></div></td></tr>`

  let hasPaid = sections.google_adwords || sections.facebook_ads
  let hasWeb = sections.google_analytics_4
  let hasOrganic = sections.instagram_business

  let body = ''

  if (hasPaid) {
    body += badge('PAID MEDIA', '#EFF6FF', '#1E40AF', '#BFDBFE')
    if (sections.google_adwords) body += sections.google_adwords
    if (sections.facebook_ads) body += sections.facebook_ads
  }

  if (hasWeb) {
    if (hasPaid) body += divider.replace(/<tr><td>|<\/td><\/tr>/g, '')
    body += badge('SITIO WEB · GA4', '#FDF4FF', '#86198F', '#F0ABFC')
    body += sections.google_analytics_4
  }

  if (hasOrganic) {
    if (hasPaid || hasWeb) body += divider.replace(/<tr><td>|<\/td><\/tr>/g, '')
    body += badge('ORGÁNICO', '#F0FDF4', '#166534', '#BBF7D0')
    body += sections.instagram_business
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;margin:0 auto;background:#F8FAFC;">
  <tr><td style="background:#0A1628;color:white;padding:24px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><span style="font-size:20px;font-weight:bold;color:white;">Reporte Mensual · <span style="color:#2DD4BF;">${cliente}</span></span><br><span style="font-size:11px;color:rgba(255,255,255,0.5);">${periodo.mesNombre} ${periodo.mesYear} vs ${periodo.compNombre} ${periodo.mesYear}</span></td>
      <td align="right"><img src="https://www.mulleryperez.cl/logo-color.png" height="36" alt="M&P"></td>
    </tr></table>
  </td></tr>
  ${reporteiUrl ? `<tr><td style="background:#EFF6FF;padding:14px 28px;border-bottom:1px solid #BFDBFE;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:12px;color:#1E3A5F;">Reporte completo con posts y gráficos →</td>
      <td align="right"><a href="${reporteiUrl}" style="background:#0055A4;color:white;padding:8px 18px;border-radius:5px;text-decoration:none;font-size:11px;font-weight:bold;">Ver en Reportei</a></td>
    </tr></table>
  </td></tr>` : ''}
  <tr><td style="padding:20px 28px;">
    ${body}
  </td></tr>
  <tr><td style="text-align:center;padding:16px 28px;background:white;border-top:1px solid #E5E7EB;">
    <span style="font-size:15px;font-weight:bold;color:#0055A4;">mulleryperez.cl</span><br>
    <span style="font-size:8px;color:#9CA3AF;">Reporte generado automáticamente · Performance Marketing · ${periodo.mesNombre} ${periodo.mesYear}</span>
  </td></tr>
</table></body></html>`
}

// ============================================================
// PROCESS ONE CLIENT
// ============================================================
async function processClient(cliente, periodo) {
  console.log(`\n📊 Procesando: ${cliente.nombre} (ID: ${cliente.id})`)

  // 1. Get integrations
  const intResult = await apiGet(`/integrations?project_id=${cliente.id}`)
  const intArray = intResult.data || intResult
  if (!Array.isArray(intArray)) {
    console.log(`  ⚠️ Error obteniendo integraciones:`, JSON.stringify(intResult).substring(0, 200))
    return { nombre: cliente.nombre, status: 'error', error: 'API error integraciones' }
  }
  const integrations = intArray.filter(i => i.status === 'active')

  if (integrations.length === 0) {
    console.log(`  ⚠️ Sin integraciones activas — saltando`)
    return { nombre: cliente.nombre, status: 'sin_integraciones' }
  }

  console.log(`  📡 ${integrations.length} integraciones: ${integrations.map(i => i.slug).join(', ')}`)

  const sections = {}
  const activeIntegrationIds = []
  let hasGadsIntegration = null

  // 2. Fetch metrics for each integration
  const slugOrder = ['google_adwords', 'facebook_ads', 'google_analytics_4', 'instagram_business']

  for (const slug of slugOrder) {
    const integration = integrations.find(i => i.slug === slug)
    if (!integration) continue

    console.log(`  📈 Fetching ${slug}...`)
    let data
    try {
      data = await fetchMetrics(integration.id, periodo.start, periodo.end, periodo.compStart, periodo.compEnd, slug)
    } catch (e) {
      console.log(`    → Error fetch: ${e.message}`)
      continue
    }

    if (!data) {
      console.log(`    → Sin datos`)
      continue
    }

    // Filtrar KPIs ocultos según config del cliente
    const ocultar = cliente.ocultar || []
    if (ocultar.includes('inversion')) {
      data.kpis = data.kpis.filter(k => k.label !== 'Inversión')
      // También quitar inversión de campañas (columna cost_micros / spend)
    }

    activeIntegrationIds.push(integration.id)
    console.log(`    → ${data.kpis.length} KPIs${data.campaigns ? `, ${data.campaigns.length} campañas` : ''}${data.posts ? `, ${data.posts.length} posts` : ''}${data.channels ? `, canales` : ''}`)

    // Build section HTML
    if (slug === 'google_adwords') {
      hasGadsIntegration = integration.id
      let extra = renderGadsCampaigns(data.campaigns)
      // Mejor campaña del mes
      const bestCamp = getBestCampaign(data.campaigns)
      if (bestCamp) {
        extra = renderHighlight('Mejor campaña del mes', bestCamp.name, `CPA ${fmtMoney(bestCamp.cpa)} · ${bestCamp.conv} conversiones · ${bestCamp.type}`, '#F0FDF4') + extra
      }
      sections[slug] = renderSection('Google Ads', 'G', 'linear-gradient(135deg,#4285f4,#34A853)', `${data.campaigns ? data.campaigns.length : 0} campañas`, data.kpis, extra)
    } else if (slug === 'facebook_ads') {
      sections[slug] = renderSection('Meta Ads', 'M', '#8B5CF6', 'Facebook Ads', data.kpis, '')
    } else if (slug === 'google_analytics_4') {
      let extra = renderChannels(data.channels)
      sections[slug] = renderSection('Google Analytics 4', 'GA', '#F97316', integration.name || '', data.kpis, extra)
    } else if (slug === 'instagram_business') {
      let extra = ''
      // Mejor post del mes
      const bestPost = getBestPost(data.posts)
      if (bestPost) {
        extra += renderHighlight('Mejor publicación del mes', `${bestPost.type} del ${bestPost.date}`, `Alcance ${fmt(bestPost.reach)} · ${bestPost.interactions} interacciones · ${bestPost.likes} likes`, '#FDF4FF')
      }
      extra += renderIgPosts(data.posts)
      const postsCount = data.posts ? data.posts.length : 0
      sections[slug] = renderSection('Instagram', 'IG', 'linear-gradient(135deg,#EC4899,#F97316)', `@${integration.name || ''}`, [...data.kpis, ...(postsCount > 0 ? [{ label: 'Publicaciones', value: postsCount, prev: null, change: null, format: 'num' }] : [])], extra)
    }
  }

  if (Object.keys(sections).length === 0) {
    console.log(`  ⚠️ Ninguna integración con datos — saltando`)
    return { nombre: cliente.nombre, status: 'sin_datos' }
  }

  // 3. Fetch evolution (Google Ads only)
  if (hasGadsIntegration) {
    console.log(`  📅 Fetching evolución año...`)
    const meses = getMesesAño(periodo.mesYear, periodo.mesMonth)
    if (meses.length >= 2) {
      const evo = await fetchEvolution(hasGadsIntegration, meses)
      const evoHtml = renderEvolution(evo, meses)
      if (evoHtml) {
        sections.google_adwords += evoHtml
      }
    }
  }

  // 4. Generate Reportei report
  let reporteiUrl = null
  try {
    console.log(`  📄 Generando reporte Reportei...`)
    const report = await apiPost('/reports', {
      project_id: cliente.id,
      template_id: config.template_id,
      title: `Reporte ${cliente.nombre} — ${periodo.mesNombre} ${periodo.mesYear}`,
      subtitle: `Datos del mes`,
      start: periodo.start,
      end: periodo.end,
      integration_ids: activeIntegrationIds
    })
    if (report.report && report.report.external_url) {
      reporteiUrl = report.report.external_url
      console.log(`    → ${reporteiUrl}`)
    }
  } catch (e) {
    console.log(`    → Error generando reporte Reportei: ${e.message}`)
  }

  // 5. Build email HTML
  const html = buildEmailHtml(cliente.nombre, periodo, sections, reporteiUrl)

  // 6. Send email
  console.log(`  📧 Enviando email...`)
  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'contacto@mulleryperez.cl',
        to: config.email_destino,
        subject: `Reporte Mensual — ${cliente.nombre} — ${periodo.mesNombre} ${periodo.mesYear}`,
        html
      })
    })
    const emailData = await emailRes.json()
    console.log(`  ✅ Email enviado: ${emailData.id || 'ok'}`)
    return { nombre: cliente.nombre, status: 'enviado', integraciones: Object.keys(sections).length }
  } catch (e) {
    console.log(`  ❌ Error email: ${e.message}`)
    return { nombre: cliente.nombre, status: 'error_email', error: e.message }
  }
}

// ============================================================
// MAIN
// ============================================================
async function enviarResumen(resultados, periodo) {
  const enviados = resultados.filter(r => r && r.status === 'enviado')
  const sinDatos = resultados.filter(r => r && (r.status === 'sin_datos' || r.status === 'sin_integraciones'))
  const errores = resultados.filter(r => r && r.status === 'error_email')
  const fallidos = resultados.filter(r => r && r.status === 'error')

  const listaEnviados = enviados.map(r => `  - ${r.nombre} (${r.integraciones} integraciones)`).join('\n')
  const listaSinDatos = sinDatos.map(r => `  - ${r.nombre} (${r.status})`).join('\n')
  const listaErrores = [...errores, ...fallidos].map(r => `  - ${r.nombre}: ${r.error || r.status}`).join('\n')

  const texto = `Reportes Mensuales M&P — ${periodo.mesNombre} ${periodo.mesYear}
${'='.repeat(50)}

Enviados: ${enviados.length}
${listaEnviados || '  (ninguno)'}

Sin datos: ${sinDatos.length}
${listaSinDatos || '  (ninguno)'}

${errores.length + fallidos.length > 0 ? `Errores: ${errores.length + fallidos.length}\n${listaErrores}` : 'Errores: 0'}

Total procesados: ${resultados.length}
Destinatarios: ${Array.isArray(config.email_destino) ? config.email_destino.join(', ') : config.email_destino}`

  const htmlResumen = `<div style="font-family:monospace;font-size:13px;white-space:pre-wrap;background:#F8FAFC;padding:20px;border-radius:8px;border:1px solid #E5E7EB;">${texto}</div>`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'contacto@mulleryperez.cl',
        to: 'contacto@mulleryperez.cl',
        subject: `Resumen Reportes — ${enviados.length}/${resultados.length} enviados — ${periodo.mesNombre} ${periodo.mesYear}`,
        html: htmlResumen
      })
    })
    console.log('📧 Resumen enviado a contacto@mulleryperez.cl')
  } catch (e) {
    console.log('❌ Error enviando resumen:', e.message)
  }
}

async function main() {
  console.log('📊 Generador de Reportes Mensuales M&P')
  console.log('=======================================')

  const periodo = getMesAnterior()
  console.log(`📅 Período: ${periodo.mesNombre} ${periodo.mesYear} (${periodo.start} → ${periodo.end})`)
  console.log(`📅 Comparación: ${periodo.compNombre} (${periodo.compStart} → ${periodo.compEnd})`)

  const clientesActivos = config.clientes.filter(c => c.activo)
  console.log(`👥 Clientes activos: ${clientesActivos.length}`)

  const resultados = []

  for (let i = 0; i < clientesActivos.length; i++) {
    const cliente = clientesActivos[i]

    // Pausa de 60s cada 10 clientes para no topar rate limit
    if (i > 0 && i % 10 === 0) {
      console.log(`\n⏳ Pausa de 60s después de ${i} clientes (rate limit)...\n`)
      await sleep(60000)
    } else if (i > 0) {
      // 30s entre cliente y cliente
      await sleep(30000)
    }

    try {
      const resultado = await processClient(cliente, periodo)
      resultados.push(resultado || { nombre: cliente.nombre, status: 'sin_datos' })
    } catch (err) {
      console.log(`❌ Error en ${cliente.nombre}: ${err.message}`)
      resultados.push({ nombre: cliente.nombre, status: 'error', error: err.message })
    }
  }

  // Enviar resumen
  await enviarResumen(resultados, periodo)

  console.log('\n✅ Proceso completado')
}

main().catch(err => {
  console.error('❌ Error fatal:', err.message)
  process.exit(1)
})
