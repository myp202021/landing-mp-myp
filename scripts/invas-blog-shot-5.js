var fetch = globalThis.fetch || require('node-fetch')
var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var OPENAI_KEY = process.env.OPENAI_API_KEY
var RESEND_KEY = process.env.RESEND
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')
if (!OPENAI_KEY) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

var TEMAS = [
  { titulo: 'Qué es un WMS y por qué tu empresa lo necesita en 2026', keywords: 'qué es un WMS, sistema WMS, WMS definición' },
  { titulo: 'WMS en la nube vs on-premise: ventajas y diferencias clave', keywords: 'WMS cloud, WMS on premise, WMS en la nube ventajas' },
  { titulo: 'Cómo un WMS reduce errores de picking y mejora la productividad', keywords: 'reducir errores picking, WMS productividad, optimizar picking' },
  { titulo: 'Guía completa: cómo implementar un WMS en menos de 30 días', keywords: 'implementar WMS, guía implementación WMS, WMS rápido 30 días' },
  { titulo: 'KPIs logísticos: los 10 indicadores que debes medir en tu almacén', keywords: 'KPIs logísticos, indicadores almacén, métricas WMS bodega' },
]

async function generar(tema) {
  var res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Genera un artículo de blog para invasWMS (software WMS cloud para Latinoamérica). TEMA: ' + tema.titulo + '. KEYWORDS: ' + tema.keywords + '. Mínimo 1500 palabras, 5+ H2, links internos a /sistema-de-gestion-de-almacenes-wms/ y /contacto-invas/. Menciona invasWMS naturalmente 2-3 veces. Datos: +700 sitios, +1800 usuarios, implementación <30 días, +400% despacho, -60% picking. Tono profesional. JSON: {"titulo_seo":"max 60","meta_description":"max 155","slug":"url-slug","extracto":"2 líneas","contenido_html":"<h2>...</h2><p>...","tags":["t1","t2"]}. Solo JSON.' }],
      temperature: 0.7, max_tokens: 4000,
    })
  })
  var d = await res.json()
  var c = d.choices[0].message.content.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(c)
}

async function main() {
  console.log('INVAS WMS — SHOT DE 5 BLOGS\n')
  for (var i = 0; i < TEMAS.length; i++) {
    var t = TEMAS[i]
    console.log((i+1) + '/5: ' + t.titulo)
    try {
      var art = await generar(t)
      var res = await fetch(WP_URL + '/wp-json/wp/v2/posts', {
        method: 'POST',
        headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: art.titulo_seo, slug: art.slug, content: art.contenido_html,
          excerpt: art.extracto, status: 'publish', categories: [57],
          meta: { rank_math_title: art.titulo_seo + ' | invasWMS', rank_math_description: art.meta_description, rank_math_focus_keyword: t.keywords.split(',')[0].trim() }
        })
      })
      var post = await res.json()
      console.log('  ✅ ' + post.id + ' | ' + (post.link || art.slug))
    } catch(e) { console.log('  ❌ ' + e.message) }
  }
  if (RESEND_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'M&P SEO <contacto@mulleryperez.cl>', to: ['contacto@mulleryperez.cl','jvio@impruvex.com'], subject: '📝 invasWMS: 5 artículos de blog publicados', html: '<h2>5 artículos nuevos en invaswms.com/blog</h2>' + TEMAS.map(function(t){return '<p>→ '+t.titulo+'</p>'}).join('') })
    }).catch(function(){})
  }
  console.log('\n5 BLOGS COMPLETADOS')
}
main().catch(function(e) { console.error(e.message); process.exit(1) })
