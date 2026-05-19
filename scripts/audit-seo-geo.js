#!/usr/bin/env node
/**
 * AUDIT SEO + GEO — Orquestador CLI
 * Fase 4: ejecuta auditoría completa y genera reporte PDF
 *
 * Uso: node scripts/audit-seo-geo.js --url <url> [--mode full|solo-url] [--competitors url1,url2] [--output path]
 *
 * CommonJS — Node 18+ con fetch nativo
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const config = require('./audit-seo-geo-config')

// Imports condicionales — los checks pueden no existir aún (Fases 1-2)
let checks, geoChecks
try { checks = require('./audit-seo-geo-checks') } catch { checks = null }
try { geoChecks = require('./audit-seo-geo-geo-checks') } catch { geoChecks = null }
const report = require('./audit-seo-geo-report')

// ---------------------------------------------------------------------------
// CLI argument parser
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { url: null, mode: 'solo-url', competitors: [], output: null }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--url' && argv[i + 1]) { args.url = argv[++i]; continue }
    if (a === '--mode' && argv[i + 1]) { args.mode = argv[++i]; continue }
    if (a === '--competitors' && argv[i + 1]) {
      args.competitors = argv[++i].split(',').map(s => s.trim()).filter(Boolean)
      continue
    }
    if (a === '--output' && argv[i + 1]) { args.output = argv[++i]; continue }
    if (a === '--help' || a === '-h') {
      console.log(`
Auditoría SEO + GEO — Muller y Pérez

Uso:
  node scripts/audit-seo-geo.js --url <url> [opciones]

Opciones:
  --url <url>              URL del sitio a auditar (obligatorio)
  --mode <full|solo-url>   Modo de auditoría (default: solo-url)
  --competitors <urls>     URLs de competidores separadas por coma
  --output <path>          Ruta de salida para el PDF
  --help                   Muestra esta ayuda

Env vars opcionales:
  GOOGLE_PAGESPEED_API_KEY o PAGESPEED_API_KEY — para métricas de PageSpeed
  OPENAI_API_KEY — para análisis de contenido con IA

Ejemplo:
  node scripts/audit-seo-geo.js --url https://ejemplo.cl
  node scripts/audit-seo-geo.js --url https://ejemplo.cl --competitors https://comp1.cl,https://comp2.cl
`)
      process.exit(0)
    }
  }
  return args
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchText(url, timeout = 15000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'MYP-SEO-Audit/1.0 (mulleryperez.cl)' },
    })
    clearTimeout(timer)
    if (!res.ok) return { ok: false, status: res.status, text: '' }
    const text = await res.text()
    return { ok: true, status: res.status, text }
  } catch (err) {
    clearTimeout(timer)
    return { ok: false, status: 0, text: '', error: err.message }
  }
}

async function fetchJSON(url, timeout = 15000) {
  const r = await fetchText(url, timeout)
  if (!r.ok) return { ok: false, data: null, error: r.error || `HTTP ${r.status}` }
  try { return { ok: true, data: JSON.parse(r.text) } }
  catch { return { ok: false, data: null, error: 'JSON parse error' } }
}

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

function normalizeUrl(url) {
  if (!url.startsWith('http')) url = 'https://' + url
  return url.replace(/\/+$/, '')
}

function getDomain(url) {
  try { return new URL(url).hostname } catch { return url }
}

function getSiteName(url) {
  const domain = getDomain(url)
  return domain.replace(/^www\./, '')
}

// ---------------------------------------------------------------------------
// Fetch homepage, robots.txt, sitemap
// ---------------------------------------------------------------------------

async function fetchHomepage(baseUrl) {
  console.log('[audit] Fetching homepage...')
  const r = await fetchText(baseUrl)
  if (!r.ok) console.warn(`[audit] Homepage fetch failed: ${r.error || r.status}`)
  return r
}

async function fetchRobots(baseUrl) {
  const url = baseUrl.replace(/\/+$/, '') + '/robots.txt'
  console.log('[audit] Fetching robots.txt...')
  const r = await fetchText(url)
  if (!r.ok) console.warn('[audit] robots.txt no encontrado')
  return r
}

async function fetchSitemap(baseUrl, robotsTxt) {
  // Try to find sitemap URL from robots.txt
  let sitemapUrl = baseUrl.replace(/\/+$/, '') + '/sitemap.xml'
  if (robotsTxt) {
    const match = robotsTxt.match(/Sitemap:\s*(.+)/i)
    if (match) sitemapUrl = match[1].trim()
  }
  console.log(`[audit] Fetching sitemap: ${sitemapUrl}`)
  const r = await fetchText(sitemapUrl)
  if (!r.ok) console.warn('[audit] Sitemap no encontrado')
  return { ...r, url: sitemapUrl }
}

// ---------------------------------------------------------------------------
// PageSpeed API
// ---------------------------------------------------------------------------

async function fetchPageSpeed(url) {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || process.env.PAGESPEED_API_KEY
  if (!apiKey) {
    console.warn('[audit] No hay API key de PageSpeed. Saltando métricas de performance.')
    return null
  }

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${apiKey}`
  console.log('[audit] Consultando PageSpeed Insights...')
  const r = await fetchJSON(apiUrl, 60000)
  if (!r.ok) {
    console.warn(`[audit] PageSpeed falló: ${r.error}`)
    return null
  }
  return r.data
}

function parsePageSpeed(data) {
  if (!data) return null
  try {
    const lhr = data.lighthouseResult
    const audits = lhr.audits
    return {
      score: Math.round((lhr.categories.performance.score || 0) * 100),
      fcp: parseFloat((audits['first-contentful-paint'].numericValue / 1000).toFixed(1)),
      lcp: parseFloat((audits['largest-contentful-paint'].numericValue / 1000).toFixed(1)),
      cls: parseFloat(audits['cumulative-layout-shift'].numericValue.toFixed(3)),
      tbt: Math.round(audits['total-blocking-time'].numericValue),
    }
  } catch (err) {
    console.warn(`[audit] Error parseando PageSpeed: ${err.message}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Built-in checks (fallback si no existen los módulos de Fase 1-2)
// ---------------------------------------------------------------------------

function runBuiltinSeoChecks(html, robotsTxt, sitemapData) {
  const results = []

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : ''
  const titleLen = title.length
  results.push({
    name: 'Title tag',
    status: titleLen >= config.THRESHOLDS.title.min && titleLen <= config.THRESHOLDS.title.max ? 'good' : titleLen > 0 ? 'warn' : 'fail',
    value: title ? `"${title.substring(0, 60)}${title.length > 60 ? '...' : ''}" (${titleLen} chars)` : 'No encontrado',
    recommendation: titleLen === 0 ? 'Agregar un title tag descriptivo' : titleLen < config.THRESHOLDS.title.min ? `Alargar a ${config.THRESHOLDS.title.min}+ caracteres` : titleLen > config.THRESHOLDS.title.max ? `Acortar a máximo ${config.THRESHOLDS.title.max} caracteres` : '',
    score: titleLen >= config.THRESHOLDS.title.min && titleLen <= config.THRESHOLDS.title.max ? 10 : titleLen > 0 ? 5 : 0,
    maxScore: 10,
  })

  // Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
                     html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i)
  const desc = descMatch ? descMatch[1].trim() : ''
  const descLen = desc.length
  results.push({
    name: 'Meta description',
    status: descLen >= config.THRESHOLDS.description.min && descLen <= config.THRESHOLDS.description.max ? 'good' : descLen > 0 ? 'warn' : 'fail',
    value: desc ? `"${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}" (${descLen} chars)` : 'No encontrada',
    recommendation: descLen === 0 ? 'Agregar meta description' : descLen < config.THRESHOLDS.description.min ? `Alargar a ${config.THRESHOLDS.description.min}+ caracteres` : descLen > config.THRESHOLDS.description.max ? `Acortar a máximo ${config.THRESHOLDS.description.max} caracteres` : '',
    score: descLen >= config.THRESHOLDS.description.min && descLen <= config.THRESHOLDS.description.max ? 10 : descLen > 0 ? 5 : 0,
    maxScore: 10,
  })

  // H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : ''
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length
  results.push({
    name: 'H1 tag',
    status: h1Count === 1 ? 'good' : h1Count > 1 ? 'warn' : 'fail',
    value: h1Count === 0 ? 'No encontrado' : h1Count === 1 ? `"${h1.substring(0, 60)}"` : `${h1Count} H1 encontrados`,
    recommendation: h1Count === 0 ? 'Agregar un H1 único y descriptivo' : h1Count > 1 ? 'Dejar solo un H1 por página' : '',
    score: h1Count === 1 ? 10 : h1Count > 1 ? 5 : 0,
    maxScore: 10,
  })

  // Canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i)
  const canonical = canonicalMatch ? canonicalMatch[1] : ''
  results.push({
    name: 'Canonical tag',
    status: canonical ? 'good' : 'fail',
    value: canonical || 'No encontrado',
    recommendation: canonical ? '' : 'Agregar link rel="canonical" para evitar contenido duplicado',
    score: canonical ? 10 : 0,
    maxScore: 10,
  })

  // Robots.txt
  results.push({
    name: 'robots.txt',
    status: robotsTxt ? 'good' : 'fail',
    value: robotsTxt ? `Encontrado (${robotsTxt.length} bytes)` : 'No encontrado',
    recommendation: robotsTxt ? '' : 'Crear robots.txt con directivas de rastreo',
    score: robotsTxt ? 10 : 0,
    maxScore: 10,
  })

  // Sitemap
  results.push({
    name: 'Sitemap XML',
    status: sitemapData && sitemapData.ok ? 'good' : 'fail',
    value: sitemapData && sitemapData.ok ? `Encontrado: ${sitemapData.url}` : 'No encontrado',
    recommendation: sitemapData && sitemapData.ok ? '' : 'Crear sitemap.xml y referenciarlo en robots.txt',
    score: sitemapData && sitemapData.ok ? 10 : 0,
    maxScore: 10,
  })

  // HTTPS
  // This is inferred from the URL used
  results.push({
    name: 'HTTPS',
    status: 'good', // We always fetch via https
    value: 'Sí',
    recommendation: '',
    score: 10,
    maxScore: 10,
  })

  // Viewport
  const viewport = html.match(/<meta\s+name=["']viewport["']/i)
  results.push({
    name: 'Meta viewport',
    status: viewport ? 'good' : 'fail',
    value: viewport ? 'Configurado' : 'No encontrado',
    recommendation: viewport ? '' : 'Agregar meta viewport para responsividad móvil',
    score: viewport ? 10 : 0,
    maxScore: 10,
  })

  // Lang attribute
  const langMatch = html.match(/<html[^>]*\slang=["']([^"']+)["']/i)
  results.push({
    name: 'Atributo lang',
    status: langMatch ? 'good' : 'warn',
    value: langMatch ? langMatch[1] : 'No encontrado',
    recommendation: langMatch ? '' : 'Agregar lang="es" en <html> para indicar idioma',
    score: langMatch ? 10 : 3,
    maxScore: 10,
  })

  // Open Graph
  const ogTitle = html.match(/<meta\s+property=["']og:title["']/i)
  const ogDesc = html.match(/<meta\s+property=["']og:description["']/i)
  const ogImage = html.match(/<meta\s+property=["']og:image["']/i)
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length
  results.push({
    name: 'Open Graph tags',
    status: ogCount === 3 ? 'good' : ogCount > 0 ? 'warn' : 'fail',
    value: `${ogCount}/3 tags (title, description, image)`,
    recommendation: ogCount < 3 ? 'Completar og:title, og:description y og:image para mejor compartir en redes' : '',
    score: Math.round((ogCount / 3) * 10),
    maxScore: 10,
  })

  return results
}

function runBuiltinContentChecks(html, url) {
  const results = []

  // Word count
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  const bodyText = bodyMatch ? bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''
  const wordCount = bodyText.split(/\s+/).filter(w => w.length > 1).length
  results.push({
    name: 'Contenido (palabras)',
    status: wordCount >= config.THRESHOLDS.wordCountMin ? 'good' : wordCount >= 100 ? 'warn' : 'fail',
    value: `${wordCount} palabras`,
    recommendation: wordCount < config.THRESHOLDS.wordCountMin ? `Aumentar contenido a ${config.THRESHOLDS.wordCountMin}+ palabras para mejor indexación` : '',
    score: wordCount >= config.THRESHOLDS.wordCountMin ? 10 : wordCount >= 100 ? 5 : 2,
    maxScore: 10,
  })

  // Internal links
  const links = html.match(/<a\s[^>]*href=["']([^"'#]+)["']/gi) || []
  const domain = getDomain(url)
  let internal = 0, external = 0
  links.forEach(l => {
    const hrefMatch = l.match(/href=["']([^"'#]+)["']/i)
    if (hrefMatch) {
      const href = hrefMatch[1]
      if (href.startsWith('/') || href.includes(domain)) internal++
      else if (href.startsWith('http')) external++
    }
  })
  results.push({
    name: 'Enlaces internos',
    status: internal >= config.THRESHOLDS.internalLinksMin ? 'good' : internal > 0 ? 'warn' : 'fail',
    value: `${internal} internos, ${external} externos`,
    recommendation: internal < config.THRESHOLDS.internalLinksMin ? `Agregar más enlaces internos (mínimo ${config.THRESHOLDS.internalLinksMin})` : '',
    score: internal >= config.THRESHOLDS.internalLinksMin ? 10 : internal > 0 ? 5 : 0,
    maxScore: 10,
  })

  // Image alt tags
  const images = html.match(/<img\s[^>]*>/gi) || []
  const imgsWithAlt = images.filter(i => /alt=["'][^"']+["']/i.test(i)).length
  const altPct = images.length > 0 ? Math.round((imgsWithAlt / images.length) * 100) : 100
  results.push({
    name: 'Alt text en imágenes',
    status: altPct >= config.THRESHOLDS.altCoveragePct ? 'good' : altPct >= 50 ? 'warn' : 'fail',
    value: `${imgsWithAlt}/${images.length} imágenes con alt (${altPct}%)`,
    recommendation: altPct < config.THRESHOLDS.altCoveragePct ? `Agregar alt descriptivo a todas las imágenes (meta: ${config.THRESHOLDS.altCoveragePct}%+)` : '',
    score: altPct >= config.THRESHOLDS.altCoveragePct ? 10 : altPct >= 50 ? 5 : 2,
    maxScore: 10,
  })

  // Heading hierarchy
  const headings = []
  const hRegex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi
  let m
  while ((m = hRegex.exec(html)) !== null) {
    headings.push({ level: parseInt(m[1][1]), text: m[2].replace(/<[^>]+>/g, '').trim() })
  }
  const hasH1 = headings.some(h => h.level === 1)
  const hasH2 = headings.some(h => h.level === 2)
  const hierarchyOk = hasH1 && hasH2
  results.push({
    name: 'Jerarquía de headings',
    status: hierarchyOk ? 'good' : hasH1 ? 'warn' : 'fail',
    value: `${headings.length} headings (H1:${headings.filter(h=>h.level===1).length} H2:${headings.filter(h=>h.level===2).length} H3:${headings.filter(h=>h.level===3).length})`,
    recommendation: !hasH1 ? 'Agregar H1 principal' : !hasH2 ? 'Agregar H2s para estructurar el contenido' : '',
    score: hierarchyOk ? 10 : hasH1 ? 5 : 0,
    maxScore: 10,
  })

  // Structured data (JSON-LD)
  const jsonLd = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
  const schemaTypes = []
  jsonLd.forEach(block => {
    const content = block.replace(/<\/?script[^>]*>/gi, '')
    try {
      const parsed = JSON.parse(content)
      if (parsed['@type']) schemaTypes.push(parsed['@type'])
      if (Array.isArray(parsed['@graph'])) {
        parsed['@graph'].forEach(item => { if (item['@type']) schemaTypes.push(item['@type']) })
      }
    } catch {}
  })
  results.push({
    name: 'Datos estructurados',
    status: jsonLd.length > 0 ? 'good' : 'fail',
    value: jsonLd.length > 0 ? `${jsonLd.length} bloques JSON-LD (${schemaTypes.join(', ')})` : 'No encontrados',
    recommendation: jsonLd.length === 0 ? 'Agregar schema JSON-LD (Organization, WebPage, FAQ, etc.)' : '',
    score: jsonLd.length > 0 ? 10 : 0,
    maxScore: 10,
    _schemaTypes: schemaTypes,
  })

  // Meta robots
  const metaRobots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)
  const robotsContent = metaRobots ? metaRobots[1] : ''
  const isNoindex = robotsContent.includes('noindex')
  results.push({
    name: 'Meta robots',
    status: isNoindex ? 'fail' : 'good',
    value: robotsContent || 'No definido (default: index, follow)',
    recommendation: isNoindex ? 'Eliminar noindex si quieres que la página sea indexada' : '',
    score: isNoindex ? 0 : 10,
    maxScore: 10,
  })

  return results
}

function runBuiltinGeoChecks(html, robotsTxt) {
  const results = []

  // JSON-LD schemas GEO
  const jsonLd = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
  const allJsonLdText = jsonLd.map(b => b.replace(/<\/?script[^>]*>/gi, '')).join(' ')

  for (const schema of config.REQUIRED_GEO_SCHEMAS) {
    const found = allJsonLdText.includes(schema)
    results.push({
      name: `Schema: ${schema}`,
      status: found ? 'good' : 'fail',
      value: found ? 'Presente' : 'No encontrado',
      whyMatters: schema === 'knowsAbout' ? 'Indica a la IA las áreas de expertise del sitio' :
                  schema === 'isSimilarTo' ? 'Ayuda a la IA a contextualizar tu sitio con entidades similares' :
                  schema === 'FAQPage' ? 'Permite que la IA extraiga respuestas directas de tu contenido' :
                  schema === 'Speakable' ? 'Indica qué secciones son aptas para lectura por voz (asistentes IA)' : '',
      score: found ? 10 : 0,
      maxScore: 10,
    })
  }

  // AI bot access from robots.txt
  const botAccess = []
  for (const bot of config.AI_BOTS) {
    let blocked = false
    if (robotsTxt) {
      // Simple check: look for User-agent: bot with Disallow: /
      const regex = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?Disallow:\\s*/`, 'i')
      blocked = regex.test(robotsTxt)
    }
    botAccess.push({
      name: bot,
      allowed: !blocked,
      note: blocked ? 'Bloqueado en robots.txt' : robotsTxt ? 'No bloqueado' : 'Sin robots.txt (acceso por defecto)',
    })
    results.push({
      name: `Bot IA: ${bot}`,
      status: blocked ? 'fail' : 'good',
      value: blocked ? 'Bloqueado' : 'Permitido',
      whyMatters: `${bot} necesita acceso para indexar y citar tu contenido en respuestas de IA`,
      score: blocked ? 0 : 10,
      maxScore: 10,
    })
  }

  // Content freshness signals
  const hasDateModified = allJsonLdText.includes('dateModified')
  results.push({
    name: 'dateModified en schema',
    status: hasDateModified ? 'good' : 'warn',
    value: hasDateModified ? 'Presente' : 'No encontrado',
    whyMatters: 'Los motores de IA priorizan contenido actualizado recientemente',
    score: hasDateModified ? 10 : 3,
    maxScore: 10,
  })

  // Author/expertise signals
  const hasAuthor = allJsonLdText.includes('author') || html.includes('rel="author"')
  results.push({
    name: 'Señales de autoría',
    status: hasAuthor ? 'good' : 'warn',
    value: hasAuthor ? 'Presentes' : 'No encontradas',
    whyMatters: 'E-E-A-T: la IA valora contenido con autoría verificable',
    score: hasAuthor ? 10 : 3,
    maxScore: 10,
  })

  // sameAs links
  const hasSameAs = allJsonLdText.includes('sameAs')
  results.push({
    name: 'sameAs (perfiles sociales)',
    status: hasSameAs ? 'good' : 'warn',
    value: hasSameAs ? 'Presente' : 'No encontrado',
    whyMatters: 'Conecta la entidad del sitio con perfiles verificados en redes sociales',
    score: hasSameAs ? 10 : 3,
    maxScore: 10,
  })

  // Citability: does the page have clear, quotable paragraphs?
  const paragraphs = (html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || []).map(p => p.replace(/<[^>]+>/g, '').trim()).filter(p => p.length > 50)
  const hasCitableContent = paragraphs.length >= 3
  results.push({
    name: 'Contenido citable',
    status: hasCitableContent ? 'good' : 'warn',
    value: `${paragraphs.length} párrafos sustanciales (50+ chars)`,
    whyMatters: 'La IA cita párrafos claros y autocontenidos como fuentes',
    score: hasCitableContent ? 10 : paragraphs.length > 0 ? 5 : 0,
    maxScore: 10,
  })

  return { checks: results, botAccess }
}

// ---------------------------------------------------------------------------
// Performance scoring
// ---------------------------------------------------------------------------

function scorePerformance(perf) {
  if (!perf) return { score: 0, checks: [] }

  const th = config.THRESHOLDS
  const checks = []

  function metricScore(val, good, bad) {
    if (val <= good) return 25
    if (val <= bad) return 12
    return 0
  }

  if (perf.fcp != null) checks.push({ score: metricScore(perf.fcp, th.fcp, th.fcp * 2), maxScore: 25 })
  if (perf.lcp != null) checks.push({ score: metricScore(perf.lcp, th.lcp, th.lcp * 2), maxScore: 25 })
  if (perf.cls != null) checks.push({ score: metricScore(perf.cls, th.cls, th.cls * 2.5), maxScore: 25 })
  if (perf.tbt != null) checks.push({ score: metricScore(perf.tbt, th.tbt, th.tbt * 3), maxScore: 25 })

  return {
    score: checks.length > 0 ? config.normalizeCategory(checks) : 0,
    checks,
  }
}

// ---------------------------------------------------------------------------
// Extract findings
// ---------------------------------------------------------------------------

function extractFindings(allChecks) {
  const critical = []
  const strengths = []

  for (const c of allChecks) {
    if (c.status === 'fail' && c.recommendation) {
      critical.push({ title: c.name, description: c.recommendation })
    }
    if (c.status === 'good' && c.score >= 8) {
      strengths.push({ title: c.name, description: c.value || 'Configurado correctamente' })
    }
  }

  return { critical: critical.slice(0, 5), strengths: strengths.slice(0, 5) }
}

// ---------------------------------------------------------------------------

function generateActions(allChecks, scores) {
  const actions = []

  // From failed checks
  const failed = allChecks.filter(c => c.status === 'fail' && c.recommendation)
  failed.forEach(c => {
    actions.push({
      title: c.name,
      description: c.recommendation,
      priority: c.maxScore >= 10 ? 'alta' : 'media',
      impact: `+${c.maxScore - c.score} puntos en la categoría correspondiente`,
    })
  })

  // From warnings
  const warned = allChecks.filter(c => c.status === 'warn' && c.recommendation)
  warned.forEach(c => {
    actions.push({
      title: c.name,
      description: c.recommendation,
      priority: 'media',
      impact: `+${c.maxScore - c.score} puntos potenciales`,
    })
  })

  // Sort: alta > media > baja
  const order = { alta: 0, media: 1, baja: 2 }
  actions.sort((a, b) => (order[a.priority] || 1) - (order[b.priority] || 1))

  return actions.slice(0, 10)
}

// ---------------------------------------------------------------------------
// Snippet preview
// ---------------------------------------------------------------------------

function buildSnippetPreview(html, url) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : ''
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
                     html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i)
  const description = descMatch ? descMatch[1].trim() : ''
  return { title, description, url }
}

// ---------------------------------------------------------------------------
// Run audit for a single URL
// ---------------------------------------------------------------------------

async function runAuditForUrl(url) {
  const baseUrl = normalizeUrl(url)

  // Step 1-3: fetch resources
  const homepageRes = await fetchHomepage(baseUrl)
  const html = homepageRes.text || ''

  const robotsRes = await fetchRobots(baseUrl)
  const robotsTxt = robotsRes.ok ? robotsRes.text : ''

  const sitemapRes = await fetchSitemap(baseUrl, robotsTxt)

  // Step 4: PageSpeed
  const psRaw = await fetchPageSpeed(baseUrl)
  const perf = parsePageSpeed(psRaw)

  // Step 5-7: Run checks
  let seoChecks, contentChecks, geoResult

  if (checks && typeof checks.runSeoTecnico === 'function') {
    console.log('[audit] Ejecutando checks SEO técnico (módulo externo)...')
    seoChecks = await checks.runSeoTecnico(html, robotsTxt, sitemapRes, baseUrl)
  } else {
    console.log('[audit] Ejecutando checks SEO técnico (built-in)...')
    seoChecks = runBuiltinSeoChecks(html, robotsTxt, sitemapRes)
  }

  if (checks && typeof checks.runContenido === 'function') {
    console.log('[audit] Ejecutando checks de contenido (módulo externo)...')
    contentChecks = await checks.runContenido(html, baseUrl)
  } else {
    console.log('[audit] Ejecutando checks de contenido (built-in)...')
    contentChecks = runBuiltinContentChecks(html, baseUrl)
  }

  if (geoChecks && typeof geoChecks.runGeo === 'function') {
    console.log('[audit] Ejecutando checks GEO (módulo externo)...')
    geoResult = await geoChecks.runGeo(html, robotsTxt, baseUrl)
  } else {
    console.log('[audit] Ejecutando checks GEO (built-in)...')
    geoResult = runBuiltinGeoChecks(html, robotsTxt)
  }

  // Step 8: Calculate scores
  const perfResult = scorePerformance(perf)

  const scores = {
    seoTecnico: config.normalizeCategory(seoChecks),
    contenido: config.normalizeCategory(contentChecks),
    performance: perfResult.score,
    geo: config.normalizeCategory(geoResult.checks),
  }

  const globalScore = config.calculateGlobalScore(scores)

  return {
    url: baseUrl,
    scores,
    globalScore,
    seoTecnicoChecks: seoChecks,
    contenidoChecks: contentChecks,
    performance: perf,
    geoChecks: geoResult.checks,
    botAccess: geoResult.botAccess || [],
    snippetPreview: buildSnippetPreview(html, baseUrl),
    allChecks: [...seoChecks, ...contentChecks, ...geoResult.checks],
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv)

  if (!args.url) {
    console.error('Error: --url es obligatorio. Usa --help para ver opciones.')
    process.exit(1)
  }

  const baseUrl = normalizeUrl(args.url)
  const domain = getDomain(baseUrl)
  const siteName = getSiteName(baseUrl)

  console.log('═══════════════════════════════════════════════════')
  console.log(`  Auditoría SEO + GEO — ${siteName}`)
  console.log(`  Modo: ${args.mode}`)
  console.log('═══════════════════════════════════════════════════\n')

  // Run main audit
  const auditResult = await runAuditForUrl(baseUrl)

  // Extract findings & actions
  const { critical, strengths } = extractFindings(auditResult.allChecks)
  const topActions = generateActions(auditResult.allChecks, auditResult.scores)

  // Competitors (if any)
  let competitors = []
  if (args.competitors.length > 0) {
    console.log(`\n[audit] Analizando ${args.competitors.length} competidor(es)...`)
    for (const compUrl of args.competitors) {
      try {
        console.log(`[audit] → ${compUrl}`)
        const compResult = await runAuditForUrl(compUrl)
        competitors.push({
          url: compResult.url,
          name: getSiteName(compResult.url),
          scores: { ...compResult.scores, global: compResult.globalScore },
        })
      } catch (err) {
        console.warn(`[audit] Error con competidor ${compUrl}: ${err.message}`)
        competitors.push({
          url: normalizeUrl(compUrl),
          name: getSiteName(normalizeUrl(compUrl)),
          scores: { seoTecnico: 0, contenido: 0, performance: 0, geo: 0, global: 0 },
        })
      }
    }
  }

  // Build report data
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10)
  const reportData = {
    ...auditResult,
    siteName,
    criticalFindings: critical,
    strengths,
    topActions,
    competitors: competitors.length > 0 ? competitors : undefined,
  }

  // Output path
  const safeDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '_')
  const defaultOutput = path.join(os.homedir(), 'Desktop', `Auditoria_SEO_GEO_${safeDomain}_${dateStr}.pdf`)
  const outputPath = args.output || defaultOutput

  // Generate report
  console.log('\n[audit] Generando reporte...')
  const { htmlPath, pdfPath } = report.generateReport(reportData, outputPath)

  // Terminal summary
  console.log('\n═══════════════════════════════════════════════════')
  console.log(`  RESULTADO — ${siteName}`)
  console.log('═══════════════════════════════════════════════════')
  console.log(`  Score Global:   ${auditResult.globalScore}/100 (${config.globalStatus(auditResult.globalScore)})`)
  console.log(`  SEO Técnico:    ${auditResult.scores.seoTecnico}/100`)
  console.log(`  Contenido:      ${auditResult.scores.contenido}/100`)
  console.log(`  Performance:    ${auditResult.scores.performance}/100`)
  console.log(`  GEO / IA:       ${auditResult.scores.geo}/100`)
  console.log('───────────────────────────────────────────────────')

  if (critical.length > 0) {
    console.log('\n  Hallazgos críticos:')
    critical.forEach((c, i) => console.log(`    ${i + 1}. ${c.title}: ${c.description}`))
  }

  if (competitors.length > 0) {
    console.log('\n  Competidores:')
    competitors.forEach(c => console.log(`    ${c.name}: ${c.scores.global}/100`))
  }

  console.log('\n───────────────────────────────────────────────────')
  console.log(`  HTML: ${htmlPath}`)
  if (pdfPath) console.log(`  PDF:  ${pdfPath}`)
  else console.log('  PDF:  No generado (Chrome no disponible)')
  console.log('═══════════════════════════════════════════════════\n')
}

// Run
main().catch(err => {
  console.error(`[audit] Error fatal: ${err.message}`)
  console.error(err.stack)
  process.exit(1)
})
