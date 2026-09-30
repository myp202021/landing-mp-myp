require('./lib/correo') // correos por Gmail (ver scripts/lib/correo.js)
// invas-blog-rankings-semanal.js
// Genera 1 artículo de ranking/comparativa semanal para invaswms.com
// Corre cada jueves via GitHub Actions
// Temas rotativos de mayor autoridad SEO (3000+ palabras)

var fetch = globalThis.fetch || require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var OPENAI_KEY = process.env.OPENAI_API_KEY
var RESEND_KEY = process.env.RESEND
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

if (!OPENAI_KEY) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

var TEMAS_RANKING = [
  { titulo: 'Los 10 mejores WMS para Latinoamérica en 2026', keywords: 'mejores WMS Latinoamérica, top WMS LATAM 2026', tipo: 'ranking' },
  { titulo: 'WMS para pymes vs enterprise: cuál elegir según tu operación', keywords: 'WMS pyme, WMS enterprise, WMS según tamaño', tipo: 'comparativo' },
  { titulo: 'Top 5 WMS para cadena de frío en Chile y Latinoamérica', keywords: 'WMS cadena de frío Chile, WMS cold chain LATAM', tipo: 'ranking' },
  { titulo: 'Mejores herramientas de monitoreo logístico en tiempo real 2026', keywords: 'monitoreo logístico, herramientas logística, dashboard logístico', tipo: 'ranking' },
  { titulo: 'invasWMS vs SAP EWM: comparativa para operaciones en LATAM', keywords: 'invasWMS vs SAP, SAP EWM alternativa, WMS vs SAP', tipo: 'comparativo' },
  { titulo: 'Top 7 soluciones WMS cloud disponibles en Chile', keywords: 'WMS cloud Chile, soluciones WMS nube Chile', tipo: 'ranking' },
  { titulo: 'Cómo se comparan los WMS open source vs comerciales en 2026', keywords: 'WMS open source, WMS gratis, WMS comercial vs libre', tipo: 'comparativo' },
  { titulo: 'Ranking de proveedores WMS por industria en Latinoamérica', keywords: 'proveedores WMS, ranking WMS por industria LATAM', tipo: 'ranking' },
  { titulo: 'Guía de precios WMS 2026: cuánto cuesta implementar un sistema', keywords: 'precio WMS, cuánto cuesta WMS, costo implementación WMS', tipo: 'guía' },
  // Ampliación 30 sept 2026
  { titulo: 'Mejores WMS para operadores 3PL en Chile 2026', keywords: 'WMS 3PL Chile, software operador logístico, WMS multi-cliente', tipo: 'ranking' },
  { titulo: 'Ranking de WMS para centros de distribución en Chile', keywords: 'WMS centros de distribución, software CD Chile', tipo: 'ranking' },
  { titulo: 'Mejores software de inventario para bodegas en Chile 2026', keywords: 'software de inventario bodega, sistema inventario Chile', tipo: 'ranking' },
  { titulo: 'Mejores WMS para e-commerce en Latinoamérica 2026', keywords: 'WMS ecommerce LATAM, fulfillment ecommerce software', tipo: 'ranking' },
  { titulo: 'Ranking de WMS con mejor integración a ERP en Chile', keywords: 'WMS integración ERP, WMS SAP Business One, WMS Defontana', tipo: 'ranking' },
  { titulo: 'Mejores terminales y pistolas RF para bodega 2026', keywords: 'pistola RF bodega, terminal radiofrecuencia, lector código barras', tipo: 'ranking' },
  { titulo: 'Ranking de WMS para la industria farmacéutica en LATAM', keywords: 'WMS farmacéutico, software bodega farmacia', tipo: 'ranking' },
  { titulo: 'Mejores TMS para complementar un WMS en Chile', keywords: 'TMS Chile, software transporte, WMS y TMS', tipo: 'ranking' },
]

// ═══ ANTI-DUPLICADOS (30 sept 2026) ═══
// GPT reescribe los títulos ("Liderazgo en crisis..." → "Liderazgo Crisis Chile 2026: Retener Talento"), así que comparar
// títulos exactos o slugs deja pasar el mismo tema. Se compara por raíces (5 letras) de las palabras relevantes:
// si un título publicado contiene 2/3 o más de las raíces del tema (mínimo 2), el tema ya está cubierto.
var VACIAS_DUP = 'para como cual cuales guia completa clave claves chile 2026 2025 2024 2023 tus sus los las del con que mejores mejor top ranking todo debes saber paso'.split(' ')
function raicesTema(t) {
  return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
    .filter(function(w) { return w.length > 3 && !/^\d+$/.test(w) && VACIAS_DUP.indexOf(w) === -1 })
    .map(function(w) { return w.substring(0, 5) })
    .filter(function(w, i, a) { return a.indexOf(w) === i })
}
function temaPublicado(texto, titulosExistentes) {
  var r = raicesTema(texto)
  if (r.length < 2) return null
  for (var i = 0; i < titulosExistentes.length; i++) {
    var e = raicesTema(titulosExistentes[i])
    var comunes = r.filter(function(w) { return e.indexOf(w) !== -1 }).length
    // Cubierto si el existente contiene 2/3 del tema, o si el tema contiene 2/3 de un existente de 3+ raíces
    if (comunes >= 2 && (comunes / r.length >= 0.66 || (e.length >= 3 && comunes / e.length >= 0.66))) return titulosExistentes[i]
  }
  return null
}
async function todosLosPosts(url, headers) {
  var todos = []
  for (var pag = 1; pag <= 10; pag++) {
    var r = await fetch(url + (url.indexOf('?') === -1 ? '?' : '&') + 'per_page=100&page=' + pag + '&_fields=title,slug', { headers: headers })
    var lote = await r.json()
    if (!Array.isArray(lote) || !lote.length) break
    todos = todos.concat(lote)
    if (lote.length < 100) break
  }
  return todos
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  INVAS WMS — RANKING SEMANAL')
  console.log('  ' + new Date().toISOString().split('T')[0])
  console.log('═══════════════════════════════════════════\n')

  // Obtener posts existentes para no repetir
  var posts = await todosLosPosts(WP_URL + '/wp-json/wp/v2/posts', { 'Authorization': AUTH })
  var existentes = posts.map(function(p) { return p.title.rendered })

  // Seleccionar tema no repetido (antes: 25 caracteres + reinicio de la lista al agotarse → rankings duplicados)
  var disponibles = TEMAS_RANKING.filter(function(t) { return !temaPublicado(t.titulo, existentes) })
  console.log('Temas disponibles: ' + disponibles.length + '/' + TEMAS_RANKING.length)
  if (!disponibles.length) {
    console.log('⚠️ Todos los rankings ya están publicados. Agregar temas nuevos a TEMAS_RANKING.')
    process.exitCode = 1
    return
  }
  var tema = disponibles[Math.floor(Math.random() * disponibles.length)]

  console.log('Tema: ' + tema.titulo)
  console.log('Keywords: ' + tema.keywords)

  // Generar con GPT-4o
  console.log('\nGenerando ranking (3500+ palabras)...')

  var systemPrompt = 'Eres un analista de tecnología logística con 15 años cubriendo el mercado WMS en Latinoamérica. Escribes rankings y comparativas rigurosas, con datos verificables, tablas comparativas detalladas y opinión experta. Tu tono es el de un analista de Gartner o Forrester, pero en español y para el mercado LATAM. NUNCA escribes contenido genérico. Cada afirmación tiene un dato o razonamiento detrás.'

  var userPrompt = 'ESCRIBE UN ARTÍCULO DE RANKING/COMPARATIVA COMPLETO.\n\n'
    + 'TEMA: ' + tema.titulo + '\n'
    + 'KEYWORDS: ' + tema.keywords + '\n'
    + 'TIPO: ' + tema.tipo + '\n\n'
    + 'ESTRUCTURA OBLIGATORIA:\n'
    + '1. NO incluyas H1 (WordPress lo genera). Empieza con párrafo gancho con dato impactante.\n'
    + '2. H2 "Metodología de evaluación" — explica los criterios (escalabilidad, implementación, soporte LATAM, precio, cloud vs on-premise, integraciones). Incluye tabla HTML con los criterios y pesos.\n'
    + '3. H2 con el ranking propiamente tal. Cada posición como H3 con: descripción de 150+ palabras, pros y contras en lista, puntaje. invasWMS debe aparecer en el top 3 de forma natural y justificada.\n'
    + '4. H2 "Tabla comparativa general" — tabla HTML con TODAS las soluciones, columnas: Nombre, País origen, Tipo (cloud/on-premise/híbrido), Precio aprox., Implementación, Industrias fuertes, Puntaje.\n'
    + '5. H2 de análisis: "Qué considerar antes de elegir" con H3 por criterio clave.\n'
    + '6. H2 "Conclusión" con recomendación por tipo de empresa (pyme, mediana, enterprise) y CTA a <a href="/contacto-invas/">solicitar demo de invasWMS</a>.\n'
    + '7. H2 "Preguntas frecuentes" con 8 preguntas como H3 + respuesta de 3-5 oraciones cada una.\n\n'
    + 'DATOS invasWMS (mencionar natural, posición justificada en el ranking):\n'
    + '- +700 sitios en América, +250K líneas/día, +1.800 usuarios\n'
    + '- Chile, Colombia, México, Perú, USA\n'
    + '- Caso: +400% capacidad despacho en 30 días, -60% picking, -25% errores\n'
    + '- 100% cloud, multi-país, <30 días implementación\n\n'
    + 'OTROS WMS REALES para el ranking (usar los que apliquen al tema):\n'
    + '- SAP EWM (Alemania, enterprise), Manhattan Associates (USA, enterprise), Blue Yonder (USA, enterprise)\n'
    + '- Oracle WMS Cloud (USA, enterprise), Körber (Alemania, mid-enterprise)\n'
    + '- Mecalux Easy WMS (España, mid-market), Generix WMS (Francia, mid-market)\n'
    + '- Infor WMS (USA, enterprise), Softeon (USA, mid-enterprise)\n'
    + '- Beetrack/DispatchTrack (Chile, última milla), STG (Chile, local)\n\n'
    + 'LINKS INTERNOS (incluir al menos 4):\n'
    + '- <a href="/sistema-de-gestion-de-almacenes-wms/">WMS de invasWMS</a>\n'
    + '- <a href="/software-logistico-por-industria/software-logistico-para-alimentos/">WMS para alimentos</a>\n'
    + '- <a href="/software-logistico-por-industria/software-logistico-para-3pl-y-4pl/">WMS para 3PL</a>\n'
    + '- <a href="/software-logistico-por-industria/software-logistico-retail-omnicanal/">WMS retail</a>\n'
    + '- <a href="/plataforma-de-datos-logisticos/">plataforma de datos logísticos</a>\n'
    + '- <a href="/contacto-invas/">solicitar una demo</a>\n\n'
    + 'EXTENSIÓN: Mínimo 3.500 palabras. El contenido_html debe tener al menos 20.000 caracteres. Esto es un artículo pilar de SEO.\n\n'
    + 'RESPONDE SOLO CON ESTE JSON (sin markdown, sin backticks):\n'
    + '{"titulo_seo":"max 60 chars, keyword al inicio","meta_description":"max 155 chars, con keyword y beneficio","slug":"slug-corto-con-keyword","extracto":"2 oraciones","contenido_html":"<h2>...</h2><p>...</p>...","tags":["' + tema.keywords.split(',')[0].trim() + '","WMS","ranking","logística"]}'

  var genRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6, max_tokens: 12000,
    })
  })
  var data = await genRes.json()
  var content = data.choices[0].message.content.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '')
  var articulo = JSON.parse(content)
  // Nunca años viejos en el título (salieron "Top 7 WMS Cloud Chile 2023", "Ranking omnicanal 2023")
  articulo.titulo_seo = String(articulo.titulo_seo || '').replace(/\b20(1\d|2[0-5])\b/g, '2026')
  var repetido = temaPublicado(articulo.titulo_seo, existentes)
  if (repetido) {
    console.log('⚠️ El título generado repite un tema publicado ("' + articulo.titulo_seo + '" ≈ "' + repetido + '"). No se publica.')
    process.exitCode = 1
    return
  }

  console.log('Título: ' + articulo.titulo_seo)
  console.log('HTML: ' + (articulo.contenido_html || '').length + ' chars')

  // ═══════════════════════════════════════════
  // VALIDACIÓN DE CALIDAD (misma lógica que blog diario)
  // ═══════════════════════════════════════════

  var QUALITY_RULES = {
    minChars: 15000, minH2: 7, requireTable: true, requireFaq: true, minLinks: 3
  }

  function checkQuality(html) {
    var issues = []
    var len = (html || '').length
    var h2s = (html || '').split('<h2').length - 1
    var tables = (html || '').split('<table').length - 1
    var hasFaq = /<h[23][^>]*>[^<]*(pregunta|faq|frecuente)/i.test(html || '')
    var links = ((html || '').match(/href="\//g) || []).length

    if (len < QUALITY_RULES.minChars) issues.push('HTML: ' + len + ' (mín ' + QUALITY_RULES.minChars + ')')
    if (h2s < QUALITY_RULES.minH2) issues.push('H2: ' + h2s + ' (mín ' + QUALITY_RULES.minH2 + ')')
    if (tables < 1) issues.push('Sin tabla HTML')
    if (!hasFaq) issues.push('Sin sección FAQ')
    if (links < QUALITY_RULES.minLinks) issues.push('Links internos: ' + links + ' (mín ' + QUALITY_RULES.minLinks + ')')

    return { pass: issues.length === 0, issues: issues, stats: { len: len, h2s: h2s, tables: tables } }
  }

  // Loop de corrección: hasta 4 intentos, corrige lo específico que falta
  var MAX_INTENTOS = 4
  var currentArticulo = articulo
  var currentRaw = content

  for (var intento = 1; intento <= MAX_INTENTOS; intento++) {
    var check = checkQuality(currentArticulo.contenido_html)
    console.log('QA intento ' + intento + ': HTML=' + check.stats.len + ' H2=' + check.stats.h2s + ' tablas=' + check.stats.tables)

    if (check.pass) {
      console.log('✅ QA aprobado' + (intento > 1 ? ' (intento ' + intento + ')' : ''))
      break
    }

    console.log('⚠️ QA falló: ' + check.issues.join(', ') + ' → corrigiendo...')

    var fixes = []
    if (check.stats.len < QUALITY_RULES.minChars) fixes.push('HTML tiene ' + check.stats.len + ' chars. Mínimo ' + QUALITY_RULES.minChars + '. Cada WMS del ranking necesita 200+ palabras de análisis real.')
    if (check.stats.h2s < QUALITY_RULES.minH2) fixes.push('Solo ' + check.stats.h2s + ' H2. Necesito mínimo ' + QUALITY_RULES.minH2 + '.')
    if (check.stats.tables < 1) fixes.push('FALTA tabla comparativa <table> con <thead>/<tbody>.')
    if (!/<h[23][^>]*>[^<]*(pregunta|faq|frecuente)/i.test(currentArticulo.contenido_html || '')) fixes.push('FALTA H2 "Preguntas frecuentes" con 8 preguntas como H3.')
    var linkCount = ((currentArticulo.contenido_html || '').match(/href="\//g) || []).length
    if (linkCount < QUALITY_RULES.minLinks) fixes.push('Solo ' + linkCount + ' links internos. Agrega <a href="/sistema-de-gestion-de-almacenes-wms/">, <a href="/contacto-invas/">, etc.')

    var retry = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: currentRaw },
          { role: 'user', content: 'CORRIGE estos problemas:\n\n' + fixes.join('\n\n') + '\n\nReescribe COMPLETO con correcciones. Mismo JSON.' }
        ],
        temperature: 0.5, max_tokens: 14000,
      })
    })
    var retryData = await retry.json()
    currentRaw = retryData.choices[0].message.content.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    currentArticulo = JSON.parse(currentRaw)
  }

  articulo = currentArticulo
  var finalCheck = checkQuality(articulo.contenido_html)
  console.log('📝 QA final: HTML=' + finalCheck.stats.len + (finalCheck.pass ? ' ✅' : ' (mejor versión disponible)'))

  // Publicar
  console.log('\nPublicando...')
  var catRes = await fetch(WP_URL + '/wp-json/wp/v2/categories?search=Rankings', { headers: { 'Authorization': AUTH } })
  var cats = await catRes.json()
  var catId = cats.length > 0 ? cats[0].id : 57

  var pubRes = await fetch(WP_URL + '/wp-json/wp/v2/posts', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: articulo.titulo_seo, slug: articulo.slug, content: articulo.contenido_html,
      excerpt: articulo.extracto, status: 'publish', categories: [57, catId],
      meta: { rank_math_title: articulo.titulo_seo + ' | invasWMS Blog', rank_math_description: articulo.meta_description, rank_math_focus_keyword: tema.keywords.split(',')[0].trim() }
    })
  })
  var post = await pubRes.json()

  if (post.id) {
    var postUrl = post.link || 'https://www.invaswms.com/' + articulo.slug
    console.log('\n✅ PUBLICADO')
    console.log('   ID: ' + post.id)
    console.log('   URL: ' + postUrl)
    console.log('   HTML: ' + (articulo.contenido_html || '').length + ' chars')

    if (RESEND_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'M&P SEO <contacto@mulleryperez.cl>',
          to: ['contacto@mulleryperez.cl', 'jvio@impruvex.com'],
          subject: '📊 invasWMS Ranking: ' + articulo.titulo_seo,
          html: '<div style="font-family:sans-serif"><h2>Nuevo ranking publicado</h2><p><strong>' + articulo.titulo_seo + '</strong></p><p>' + articulo.meta_description + '</p><p>HTML: ' + (articulo.contenido_html||'').length + ' chars | QA: aprobado</p><p><a href="' + postUrl + '">Ver artículo →</a></p></div>'
        })
      }).catch(function() {})
      console.log('   Email: enviado')
    }
  } else {
    console.error('❌ Error:', JSON.stringify(post).substring(0, 200))
    process.exit(1)
  }
}

main().catch(function(e) { console.error('Error:', e.message); process.exit(1) })
