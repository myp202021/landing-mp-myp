/**
 * PROSPECT BENCHMARK — Benchmark automático de empresas prospectadas
 *
 * MODO BÁSICO (gratis): analiza website via fetch + PageSpeed API
 * MODO PRO ($0.50/empresa): + RRSS via Apify + competidores
 *
 * Uso:
 *   node scripts/prospect-benchmark.js                        # Básico, todas las enriched
 *   node scripts/prospect-benchmark.js --pro                  # PRO con RRSS
 *   node scripts/prospect-benchmark.js --pro --competitors 4  # PRO + 4 competidores
 *   node scripts/prospect-benchmark.js --industry saas --limit 20
 *   node scripts/prospect-benchmark.js --company-id 123       # Una empresa específica
 *
 * Env vars: APIFY_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY, GOOGLE_PAGESPEED_API_KEY (opcional)
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const PAGESPEED_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || ''
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ═══════════════════════════════════════════════════════
// ANÁLISIS WEB (GRATIS)
// ═══════════════════════════════════════════════════════

async function analyzeWebsite(url) {
  const result = {
    has_ssl: url.startsWith('https'),
    has_form: false,
    has_whatsapp: false,
    has_cta: false,
    has_analytics: false,
    has_meta_pixel: false,
    has_chat: false,
    technologies: [],
    pagespeed_mobile: null,
    pagespeed_desktop: null,
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MYPBot/1.0)' },
      redirect: 'follow',
    })
    clearTimeout(timeout)

    if (!res.ok) return result

    const html = await res.text()
    const lower = html.toLowerCase()

    // Formularios
    result.has_form = /<form[\s>]/i.test(html)
    result.has_whatsapp = /wa\.me|whatsapp|api\.whatsapp/i.test(html)
    result.has_cta = /contáctanos|cotizar|agendar|solicitar|agenda una|pedir presupuesto|hablar con/i.test(html)

    // Analytics / Pixels
    result.has_analytics = /google-analytics|gtag|analytics\.js|ga\.js|googletagmanager/i.test(html)
    result.has_meta_pixel = /fbq\(|facebook\.net\/tr|pixel\.facebook|connect\.facebook\.net/i.test(html)

    // Chat widgets
    result.has_chat = /tawk\.to|crisp\.chat|intercom|drift|hubspot|livechat|zendesk|freshdesk/i.test(html)

    // Tecnologías detectadas
    if (/wordpress|wp-content/i.test(html)) result.technologies.push('WordPress')
    if (/shopify/i.test(html)) result.technologies.push('Shopify')
    if (/wix\.com/i.test(html)) result.technologies.push('Wix')
    if (/squarespace/i.test(html)) result.technologies.push('Squarespace')
    if (/webflow/i.test(html)) result.technologies.push('Webflow')
    if (/next/i.test(html) && /__next/i.test(html)) result.technologies.push('Next.js')
    if (/react/i.test(lower)) result.technologies.push('React')
    if (/vue/i.test(lower) && /vue\.js|vuejs/i.test(html)) result.technologies.push('Vue.js')
    if (/bootstrap/i.test(html)) result.technologies.push('Bootstrap')
    if (/tailwind/i.test(html)) result.technologies.push('Tailwind')
    if (/hubspot/i.test(html)) result.technologies.push('HubSpot')
    if (/mailchimp/i.test(html)) result.technologies.push('Mailchimp')

    // SEO básico
    result.has_title = /<title[^>]*>.+<\/title>/i.test(html)
    result.has_meta_desc = /meta\s+name=["']description/i.test(html)
    result.has_h1 = /<h1[\s>]/i.test(html)
    result.has_sitemap_link = /sitemap/i.test(html)
    result.has_og_tags = /og:title|og:description|og:image/i.test(html)

  } catch (err) {
    console.log(`   ⚠️ No se pudo analizar ${url}: ${err.message}`)
  }

  return result
}

async function getPageSpeed(url) {
  try {
    const base = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
    const keyParam = PAGESPEED_KEY ? `&key=${PAGESPEED_KEY}` : ''

    // Mobile
    const mobileRes = await fetch(`${base}?url=${encodeURIComponent(url)}&strategy=mobile${keyParam}`, { timeout: 30000 })
    const mobileData = await mobileRes.json()
    const mobileScore = Math.round((mobileData.lighthouseResult?.categories?.performance?.score || 0) * 100)

    // Desktop
    const desktopRes = await fetch(`${base}?url=${encodeURIComponent(url)}&strategy=desktop${keyParam}`, { timeout: 30000 })
    const desktopData = await desktopRes.json()
    const desktopScore = Math.round((desktopData.lighthouseResult?.categories?.performance?.score || 0) * 100)

    return { mobile: mobileScore, desktop: desktopScore }
  } catch (err) {
    console.log(`   ⚠️ PageSpeed falló para ${url}: ${err.message}`)
    return { mobile: null, desktop: null }
  }
}

// ═══════════════════════════════════════════════════════
// ANÁLISIS RRSS (PRO — USA APIFY)
// ═══════════════════════════════════════════════════════

async function analyzeInstagram(profileUrl) {
  if (!profileUrl) return null
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=120`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directUrls: [profileUrl],
          resultsType: 'posts',
          resultsLimit: 12,
          addParentData: true,
        })
      }
    )
    if (!res.ok) return null

    const posts = await res.json()
    if (!posts.length) return { followers: 0, posts_30d: 0, engagement_rate: 0, last_post: null, content_types: {} }

    const now = new Date()
    const hace30d = new Date(now - 30 * 24 * 60 * 60 * 1000)

    const followers = posts[0]?.ownerFollowerCount || posts[0]?.followersCount || 0
    const recientes = posts.filter(p => p.timestamp && new Date(p.timestamp) > hace30d)

    const totalEngagement = posts.reduce((sum, p) => sum + (p.likesCount || 0) + (p.commentsCount || 0), 0)
    const engagementRate = followers > 0 ? (totalEngagement / posts.length / followers * 100) : 0

    // Tipos de contenido
    const types = {}
    for (const p of posts) {
      const type = p.type || (p.videoUrl ? 'video' : 'image')
      types[type] = (types[type] || 0) + 1
    }

    const lastPost = posts.reduce((latest, p) => {
      if (!p.timestamp) return latest
      return !latest || new Date(p.timestamp) > new Date(latest) ? p.timestamp : latest
    }, null)

    return {
      followers,
      posts_30d: recientes.length,
      engagement_rate: Math.round(engagementRate * 100) / 100,
      last_post: lastPost,
      content_types: types,
    }
  } catch (err) {
    console.log(`   ⚠️ IG error: ${err.message}`)
    return null
  }
}

async function analyzeLinkedIn(companyUrl) {
  if (!companyUrl) return null
  try {
    // Extraer company name del URL
    const match = companyUrl.match(/company\/([^/?]+)/)
    if (!match) return null

    const res = await fetch(
      `https://api.apify.com/v2/acts/harvestapi~linkedin-company-posts/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=180`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: [companyUrl],
          deepScrape: false,
          maxResults: 10,
        })
      }
    )
    if (!res.ok) return null

    const posts = await res.json()
    if (!posts.length) return { followers: 0, posts_30d: 0, engagement_rate: 0, last_post: null }

    const now = new Date()
    const hace30d = new Date(now - 30 * 24 * 60 * 60 * 1000)

    const followers = posts[0]?.companyFollowers || posts[0]?.followers || 0
    const recientes = posts.filter(p => {
      const fecha = p.postedAt?.date || p.publishedAt
      return fecha && new Date(fecha) > hace30d
    })

    const totalEngagement = posts.reduce((sum, p) => {
      const eng = p.engagement || {}
      return sum + (eng.likes || 0) + (eng.comments || 0) + (eng.shares || 0)
    }, 0)
    const engagementRate = followers > 0 ? (totalEngagement / posts.length / followers * 100) : 0

    const lastPost = posts.reduce((latest, p) => {
      const fecha = p.postedAt?.date || p.publishedAt
      if (!fecha) return latest
      return !latest || new Date(fecha) > new Date(latest) ? fecha : latest
    }, null)

    return {
      followers,
      posts_30d: recientes.length,
      engagement_rate: Math.round(engagementRate * 100) / 100,
      last_post: lastPost,
    }
  } catch (err) {
    console.log(`   ⚠️ LinkedIn error: ${err.message}`)
    return null
  }
}

async function analyzeFacebook(pageUrl) {
  if (!pageUrl) return null
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=180`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url: pageUrl }],
          resultsLimit: 10,
        })
      }
    )
    if (!res.ok) return null

    const posts = await res.json()
    if (!posts.length) return { followers: 0, posts_30d: 0, engagement_rate: 0, last_post: null, has_ads: false }

    const now = new Date()
    const hace30d = new Date(now - 30 * 24 * 60 * 60 * 1000)

    const followers = posts[0]?.pageLikes || posts[0]?.pageFollowers || 0
    const recientes = posts.filter(p => p.time && new Date(p.time) > hace30d)

    const totalEngagement = posts.reduce((sum, p) => {
      return sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0)
    }, 0)
    const engagementRate = followers > 0 ? (totalEngagement / posts.length / followers * 100) : 0

    const lastPost = posts.reduce((latest, p) => {
      if (!p.time) return latest
      return !latest || new Date(p.time) > new Date(latest) ? p.time : latest
    }, null)

    return {
      followers,
      posts_30d: recientes.length,
      engagement_rate: Math.round(engagementRate * 100) / 100,
      last_post: lastPost,
      has_ads: false, // Se puede checkear Meta Ad Library aparte
    }
  } catch (err) {
    console.log(`   ⚠️ Facebook error: ${err.message}`)
    return null
  }
}

// ═══════════════════════════════════════════════════════
// SCORING
// ═══════════════════════════════════════════════════════

function calculateScores(web, ig, li, fb) {
  const scores = {}

  // Website Score (0-20)
  let ws = 0
  if (web.has_ssl) ws += 3
  if (web.has_form) ws += 3
  if (web.has_cta) ws += 3
  if (web.has_whatsapp) ws += 2
  if (web.has_chat) ws += 2
  if (web.pagespeed_mobile >= 50) ws += 3
  if (web.pagespeed_mobile >= 80) ws += 2
  if (web.pagespeed_desktop >= 70) ws += 2
  scores.website_score = Math.min(ws, 20)

  // Instagram Score (0-15)
  let igs = 0
  if (ig) {
    if (ig.followers > 0) igs += 2
    if (ig.followers >= 500) igs += 2
    if (ig.followers >= 2000) igs += 1
    if (ig.posts_30d >= 1) igs += 2
    if (ig.posts_30d >= 4) igs += 2
    if (ig.posts_30d >= 8) igs += 2
    if (ig.engagement_rate >= 1) igs += 2
    if (ig.engagement_rate >= 3) igs += 2
  }
  scores.instagram_score = Math.min(igs, 15)

  // LinkedIn Score (0-15)
  let lis = 0
  if (li) {
    if (li.followers > 0) lis += 2
    if (li.followers >= 200) lis += 2
    if (li.followers >= 1000) lis += 2
    if (li.posts_30d >= 1) lis += 2
    if (li.posts_30d >= 4) lis += 3
    if (li.engagement_rate >= 0.5) lis += 2
    if (li.engagement_rate >= 2) lis += 2
  }
  scores.linkedin_score = Math.min(lis, 15)

  // Facebook Score (0-10)
  let fbs = 0
  if (fb) {
    if (fb.followers > 0) fbs += 2
    if (fb.followers >= 500) fbs += 2
    if (fb.posts_30d >= 1) fbs += 2
    if (fb.posts_30d >= 4) fbs += 2
    if (fb.engagement_rate >= 0.5) fbs += 2
  }
  scores.facebook_score = Math.min(fbs, 10)

  // SEO Score (0-10)
  let seo = 0
  if (web.has_title) seo += 2
  if (web.has_meta_desc) seo += 2
  if (web.has_h1) seo += 2
  if (web.has_og_tags) seo += 2
  if (web.has_sitemap_link) seo += 2
  scores.seo_score = Math.min(seo, 10)

  // Paid Readiness Score (0-15)
  let paid = 0
  if (web.has_analytics) paid += 3
  if (web.has_meta_pixel) paid += 4
  if (web.has_form) paid += 3
  if (web.has_cta) paid += 3
  if (fb && fb.has_ads) paid += 2
  scores.paid_readiness_score = Math.min(paid, 15)

  // Brand Clarity Score (0-10)
  let brand = 0
  if (web.has_ssl) brand += 2
  if (web.technologies.length > 0) brand += 2 // Tiene stack moderno
  if (web.has_og_tags) brand += 2
  if (ig && ig.followers > 0 && li && li.followers > 0) brand += 2 // Presencia multi-canal
  if (web.has_chat || web.has_whatsapp) brand += 2
  scores.brand_clarity_score = Math.min(brand, 10)

  // Technical Score (0-5)
  let tech = 0
  if (web.has_ssl) tech += 2
  if (web.pagespeed_mobile >= 50) tech += 1
  if (web.pagespeed_desktop >= 70) tech += 1
  if (web.technologies.some(t => ['Next.js', 'React', 'Vue.js', 'Webflow'].includes(t))) tech += 1
  scores.technical_score = Math.min(tech, 5)

  // Final Score
  scores.final_score = scores.website_score + scores.instagram_score + scores.linkedin_score +
    scores.facebook_score + scores.seo_score + scores.paid_readiness_score +
    scores.brand_clarity_score + scores.technical_score

  return scores
}

function generateInsights(scores, web, ig, li, fb, company) {
  const fortalezas = []
  const brechas = []
  const acciones = []

  // Fortalezas
  if (scores.website_score >= 14) fortalezas.push('Sitio web bien optimizado con CTAs y formularios claros')
  if (web.has_ssl) fortalezas.push('Conexión segura (SSL) implementada')
  if (web.has_analytics && web.has_meta_pixel) fortalezas.push('Tracking completo: Google Analytics + Meta Pixel instalados')
  if (ig && ig.engagement_rate >= 2) fortalezas.push(`Instagram con buen engagement (${ig.engagement_rate}%)`)
  if (li && li.posts_30d >= 4) fortalezas.push(`LinkedIn activo con ${li.posts_30d} publicaciones/mes`)
  if (web.pagespeed_mobile >= 70) fortalezas.push(`Buena velocidad móvil (${web.pagespeed_mobile}/100)`)
  if (ig && ig.followers >= 2000) fortalezas.push(`Comunidad Instagram consolidada (${ig.followers.toLocaleString()} seguidores)`)

  // Brechas
  if (!web.has_meta_pixel) brechas.push('No tiene Meta Pixel — no puede hacer remarketing ni medir conversiones de Meta Ads')
  if (!web.has_analytics) brechas.push('No tiene Google Analytics — sin visibilidad de tráfico ni comportamiento del usuario')
  if (!web.has_form && !web.has_whatsapp) brechas.push('Sin formulario ni WhatsApp — los visitantes no tienen cómo contactar fácil')
  if (!web.has_cta) brechas.push('Sin llamado a la acción claro — el visitante no sabe qué hacer')
  if (ig && ig.posts_30d < 2) brechas.push(`Instagram casi inactivo (${ig.posts_30d} posts en 30 días)`)
  if (!ig && company.instagram_url) brechas.push('Tiene Instagram pero sin actividad reciente detectable')
  if (li && li.posts_30d === 0) brechas.push('LinkedIn sin publicaciones recientes — oportunidad perdida en B2B')
  if (!li && !company.linkedin_url) brechas.push('Sin presencia en LinkedIn — invisible para decisores B2B')
  if (web.pagespeed_mobile && web.pagespeed_mobile < 40) brechas.push(`Sitio muy lento en móvil (${web.pagespeed_mobile}/100) — rebote alto`)
  if (!web.has_ssl) brechas.push('Sin HTTPS — Google lo penaliza y genera desconfianza')
  if (web.has_chat === false && web.has_whatsapp === false) brechas.push('Sin chat en vivo ni WhatsApp — pierde consultas en caliente')

  // Acciones
  if (!web.has_meta_pixel) acciones.push('Instalar Meta Pixel y configurar eventos de conversión')
  if (!web.has_analytics) acciones.push('Implementar Google Analytics 4 con eventos clave')
  if (!web.has_form) acciones.push('Agregar formulario de contacto visible en home y páginas clave')
  if (ig && ig.posts_30d < 4) acciones.push('Aumentar frecuencia de publicación en Instagram a mínimo 3x/semana')
  if (!company.linkedin_url) acciones.push('Crear página de empresa en LinkedIn y comenzar a publicar contenido de valor')
  if (web.pagespeed_mobile && web.pagespeed_mobile < 50) acciones.push('Optimizar velocidad del sitio — comprimir imágenes y revisar hosting')

  // Resumen ejecutivo
  const nivel = scores.final_score <= 39 ? 'bajo' : scores.final_score <= 69 ? 'medio' : 'alto'
  const oportunidad = scores.final_score <= 39 ? 'alta' : scores.final_score <= 69 ? 'media' : 'baja pero con upsell'

  const resumen = `${company.name} tiene un nivel de madurez digital ${nivel} (${scores.final_score}/100). ` +
    `Oportunidad comercial ${oportunidad}. ` +
    (brechas.length > 0 ? `Principal brecha: ${brechas[0].toLowerCase()}.` : 'Sin brechas críticas detectadas.')

  // Ángulo comercial
  let angulo = ''
  if (!web.has_meta_pixel && !web.has_analytics) {
    angulo = `${company.name} está invirtiendo en presencia digital pero sin medir resultados. Sin pixel ni analytics, cada peso en publicidad es a ciegas. Hay una oportunidad clara de ordenar la medición y demostrar ROI desde el día 1.`
  } else if (ig && ig.posts_30d < 2 && li && li.posts_30d < 2) {
    angulo = `${company.name} tiene presencia en redes pero está prácticamente inactiva. Sus competidores están publicando y captando atención. Con una estrategia de contenido ordenada, pueden recuperar terreno rápidamente.`
  } else if (scores.paid_readiness_score < 8) {
    angulo = `${company.name} no tiene las bases técnicas para hacer publicidad digital efectiva. Antes de invertir en pauta, necesitan instalar tracking, optimizar conversiones y estructurar un embudo. Ese orden es exactamente lo que M&P hace.`
  } else {
    angulo = `${company.name} tiene bases pero no las está explotando al máximo. Con optimización de su embudo digital y una estrategia de contenido + pauta coordinada, pueden multiplicar sus resultados actuales.`
  }

  return {
    fortalezas: fortalezas.slice(0, 3),
    brechas: brechas.slice(0, 5),
    acciones: acciones.slice(0, 3),
    resumen_ejecutivo: resumen,
    angulo_comercial: angulo,
  }
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2)
  let isPro = args.includes('--pro')
  let limitFilter = 100
  let industryFilter = null
  let companyId = null
  let competitorsCount = 4

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limitFilter = parseInt(args[++i])
    if (args[i] === '--industry' && args[i + 1]) industryFilter = args[++i]
    if (args[i] === '--company-id' && args[i + 1]) companyId = parseInt(args[++i])
    if (args[i] === '--competitors' && args[i + 1]) competitorsCount = parseInt(args[++i])
  }

  // Obtener empresas pendientes
  let query = supabase
    .from('prospect_companies')
    .select('*')
    .eq('status', 'enriched')
    .not('website', 'is', null)
    .order('creado_en', { ascending: true })
    .limit(limitFilter)

  if (industryFilter) query = query.eq('industry', industryFilter)
  if (companyId) query = supabase.from('prospect_companies').select('*').eq('id', companyId)

  const { data: companies, error } = await query

  if (error) {
    console.error('❌ Error consultando empresas:', error.message)
    process.exit(1)
  }

  if (!companies || companies.length === 0) {
    console.log('✅ No hay empresas pendientes de benchmark.')
    return
  }

  console.log(`\n📊 BENCHMARK ${isPro ? 'PRO' : 'BÁSICO'}`)
  console.log(`   Empresas: ${companies.length}`)
  if (isPro) console.log(`   Competidores por empresa: ${competitorsCount}`)
  console.log('')

  let totalBenchmarked = 0

  for (const company of companies) {
    console.log(`\n── ${company.name} (${company.website}) ──`)

    // 1. Análisis web (siempre, gratis)
    const web = await analyzeWebsite(company.website)

    // 2. PageSpeed (gratis)
    const ps = await getPageSpeed(company.website)
    web.pagespeed_mobile = ps.mobile
    web.pagespeed_desktop = ps.desktop
    console.log(`   🌐 Web: SSL=${web.has_ssl} Form=${web.has_form} WA=${web.has_whatsapp} CTA=${web.has_cta} GA=${web.has_analytics} Pixel=${web.has_meta_pixel}`)
    console.log(`   ⚡ PageSpeed: Mobile=${ps.mobile} Desktop=${ps.desktop}`)

    // 3. RRSS (solo modo PRO)
    let igData = null, liData = null, fbData = null

    if (isPro) {
      console.log('   📱 Analizando redes sociales...')

      if (company.instagram_url) {
        igData = await analyzeInstagram(company.instagram_url)
        if (igData) console.log(`   📸 IG: ${igData.followers} seg, ${igData.posts_30d} posts/30d, ${igData.engagement_rate}% eng`)
      }

      if (company.linkedin_url) {
        liData = await analyzeLinkedIn(company.linkedin_url)
        if (liData) console.log(`   💼 LI: ${liData.followers} seg, ${liData.posts_30d} posts/30d, ${liData.engagement_rate}% eng`)
      }

      if (company.facebook_url) {
        fbData = await analyzeFacebook(company.facebook_url)
        if (fbData) console.log(`   📘 FB: ${fbData.followers} seg, ${fbData.posts_30d} posts/30d, ${fbData.engagement_rate}% eng`)
      }
    }

    // 4. Calcular scores
    const scores = calculateScores(web, igData, liData, fbData)
    console.log(`   🎯 Score: ${scores.final_score}/100 (Web:${scores.website_score} IG:${scores.instagram_score} LI:${scores.linkedin_score} FB:${scores.facebook_score} SEO:${scores.seo_score} Paid:${scores.paid_readiness_score})`)

    // 5. Generar insights
    const insights = generateInsights(scores, web, igData, liData, fbData, company)

    // 6. Guardar benchmark
    const benchmarkData = {
      company_id: company.id,
      ...scores,
      pagespeed_mobile: web.pagespeed_mobile,
      pagespeed_desktop: web.pagespeed_desktop,
      has_analytics: web.has_analytics,
      has_meta_pixel: web.has_meta_pixel,
      has_form: web.has_form,
      has_whatsapp: web.has_whatsapp,
      has_cta: web.has_cta,
      has_ssl: web.has_ssl,
      technologies_detected: web.technologies,
      // IG
      ig_followers: igData?.followers || null,
      ig_posts_30d: igData?.posts_30d || null,
      ig_engagement_rate: igData?.engagement_rate || null,
      ig_last_post_date: igData?.last_post || null,
      ig_content_types: igData?.content_types || {},
      // LI
      li_followers: liData?.followers || null,
      li_posts_30d: liData?.posts_30d || null,
      li_engagement_rate: liData?.engagement_rate || null,
      li_last_post_date: liData?.last_post || null,
      // FB
      fb_followers: fbData?.followers || null,
      fb_posts_30d: fbData?.posts_30d || null,
      fb_engagement_rate: fbData?.engagement_rate || null,
      fb_last_post_date: fbData?.last_post || null,
      fb_has_ads: fbData?.has_ads || false,
      // Insights
      fortalezas: insights.fortalezas,
      brechas: insights.brechas,
      acciones: insights.acciones,
      resumen_ejecutivo: insights.resumen_ejecutivo,
      angulo_comercial: insights.angulo_comercial,
    }

    const { error: insertError } = await supabase
      .from('prospect_benchmarks')
      .insert(benchmarkData)

    if (insertError) {
      console.error(`   ❌ Error guardando benchmark: ${insertError.message}`)
      continue
    }

    // 7. Actualizar status de la empresa
    await supabase
      .from('prospect_companies')
      .update({ status: 'benchmarked' })
      .eq('id', company.id)

    totalBenchmarked++

    // Pausa entre empresas (PageSpeed tiene rate limit)
    if (companies.indexOf(company) < companies.length - 1) {
      const pauseSecs = isPro ? 5 : 2
      await new Promise(r => setTimeout(r, pauseSecs * 1000))
    }
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN BENCHMARK ${isPro ? 'PRO' : 'BÁSICO'}`)
  console.log(`   Empresas benchmarkeadas: ${totalBenchmarked}/${companies.length}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
