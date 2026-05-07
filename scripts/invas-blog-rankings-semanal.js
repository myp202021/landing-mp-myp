// invas-blog-rankings-semanal.js
// Genera 1 artículo de ranking/comparativa semanal para invaswms.com
// Corre cada jueves via GitHub Actions
// Temas rotativos de mayor autoridad SEO (3000+ palabras)

var fetch = require('node-fetch')

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
  { titulo: 'Las 10 funcionalidades que todo WMS moderno debe tener', keywords: 'funcionalidades WMS, features WMS, qué debe tener un WMS', tipo: 'ranking' },
  { titulo: 'Ranking de proveedores WMS por industria en Latinoamérica', keywords: 'proveedores WMS, ranking WMS por industria LATAM', tipo: 'ranking' },
  { titulo: 'Guía de precios WMS 2026: cuánto cuesta implementar un sistema', keywords: 'precio WMS, cuánto cuesta WMS, costo implementación WMS', tipo: 'guía' },
]

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  INVAS WMS — RANKING SEMANAL')
  console.log('  ' + new Date().toISOString().split('T')[0])
  console.log('═══════════════════════════════════════════\n')

  // Obtener posts existentes para no repetir
  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?per_page=50&_fields=title', { headers: { 'Authorization': AUTH } })
  var posts = await res.json()
  var existentes = posts.map(function(p) { return p.title.rendered.toLowerCase() })

  // Seleccionar tema no repetido
  var disponibles = TEMAS_RANKING.filter(function(t) {
    return !existentes.some(function(e) { return e.includes(t.titulo.substring(0, 25).toLowerCase()) })
  })
  if (disponibles.length === 0) disponibles = TEMAS_RANKING
  var tema = disponibles[Math.floor(Math.random() * disponibles.length)]

  console.log('Tema: ' + tema.titulo)
  console.log('Keywords: ' + tema.keywords)

  // Generar con GPT-4o
  console.log('\nGenerando ranking (3000+ palabras)...')
  var genRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Genera un artículo de ranking/comparativa profesional para invasWMS blog. TEMA: ' + tema.titulo + '. KEYWORDS: ' + tema.keywords + '. Mínimo 2500 palabras, tabla comparativa HTML, FAQ con 8+ preguntas, links internos a /sistema-de-gestion-de-almacenes-wms/ y /contacto-invas/. invasWMS destaca: +700 sitios, 100% cloud, <30 días implementación, +400% despacho, -60% picking. Tono analítico. JSON: {"titulo_seo":"max 60","meta_description":"max 155","slug":"url-slug","extracto":"2 líneas","contenido_html":"<h2>...</h2>...","tags":["t1","t2","t3"]}. Solo JSON.' }],
      temperature: 0.7, max_tokens: 6000,
    })
  })
  var data = await genRes.json()
  var content = data.choices[0].message.content.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '')
  var articulo = JSON.parse(content)

  console.log('Título: ' + articulo.titulo_seo)
  console.log('HTML: ' + (articulo.contenido_html || '').length + ' chars')

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
    console.log('\n✅ PUBLICADO')
    console.log('   ID: ' + post.id)
    console.log('   URL: ' + (post.link || articulo.slug))

    if (RESEND_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'M&P SEO <contacto@mulleryperez.cl>',
          to: ['contacto@mulleryperez.cl', 'jvio@impruvex.com'],
          subject: '📊 invasWMS Ranking: ' + articulo.titulo_seo,
          html: '<h2>Nuevo ranking publicado</h2><p><strong>' + articulo.titulo_seo + '</strong></p><p>' + articulo.meta_description + '</p><p><a href="' + (post.link || 'https://www.invaswms.com/' + articulo.slug) + '">Ver artículo →</a></p>'
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
