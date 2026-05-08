// invas-blog-diario.js
// Genera 1 artículo de blog diario para invaswms.com
// Publica via WordPress REST API
// Corre via GitHub Actions L-V a las 07:00 AM Chile
//
// Uso: node scripts/invas-blog-diario.js
// Requiere: OPENAI_API_KEY, INVAS_WP_USER, INVAS_WP_APP_PASSWORD, INVAS_WP_URL

var fetch = require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var OPENAI_KEY = process.env.OPENAI_API_KEY
var RESEND_KEY = process.env.RESEND
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

if (!OPENAI_KEY) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

// ═══════════════════════════════════════════
// TEMAS PREDEFINIDOS (40+ temas en rotación)
// ═══════════════════════════════════════════
var TEMAS = [
  // WMS General
  { titulo: 'Qué es un WMS y por qué tu empresa lo necesita', categoria: 'WMS', keywords: 'qué es un WMS, sistema de gestión de almacenes, WMS definición', tipo: 'educativo' },
  { titulo: 'Tipos de WMS: cloud vs on-premise vs híbrido', categoria: 'WMS', keywords: 'tipos de WMS, WMS cloud, WMS on premise', tipo: 'comparativo' },
  { titulo: 'WMS vs ERP: diferencias y cuándo necesitas cada uno', categoria: 'WMS', keywords: 'WMS vs ERP, diferencia WMS ERP', tipo: 'comparativo' },
  { titulo: 'Cómo elegir el WMS adecuado para tu operación', categoria: 'WMS', keywords: 'cómo elegir WMS, seleccionar sistema WMS', tipo: 'guía' },
  { titulo: 'Los 7 errores más comunes al implementar un WMS', categoria: 'WMS', keywords: 'errores implementación WMS, problemas WMS', tipo: 'educativo' },
  { titulo: 'ROI de un WMS: cómo calcular el retorno de inversión', categoria: 'WMS', keywords: 'ROI WMS, retorno inversión WMS', tipo: 'educativo' },
  { titulo: 'Indicadores clave (KPIs) para medir tu operación de almacén', categoria: 'WMS', keywords: 'KPIs almacén, indicadores logísticos, métricas WMS', tipo: 'educativo' },
  { titulo: 'Automatización de bodegas: del picking manual al WMS inteligente', categoria: 'WMS', keywords: 'automatización bodega, picking automático, WMS inteligente', tipo: 'tendencia' },

  // Industria Alimentos
  { titulo: 'WMS para alimentos: control de cadena de frío y trazabilidad', categoria: 'Industria', keywords: 'WMS alimentos, cadena de frío, trazabilidad alimentos', tipo: 'industria' },
  { titulo: 'FIFO vs FEFO: qué método usar en tu almacén de alimentos', categoria: 'Industria', keywords: 'FIFO FEFO alimentos, gestión vencimientos almacén', tipo: 'educativo' },
  { titulo: 'Normativa sanitaria y WMS: cómo cumplir sin complicaciones', categoria: 'Industria', keywords: 'normativa sanitaria almacén, regulación alimentos WMS', tipo: 'guía' },
  { titulo: 'Cómo reducir mermas en la distribución de alimentos con tecnología', categoria: 'Industria', keywords: 'reducir mermas alimentos, pérdida alimentos distribución', tipo: 'educativo' },

  // Industria 3PL
  { titulo: 'WMS para operadores logísticos 3PL: gestión multi-cliente', categoria: 'Industria', keywords: 'WMS 3PL, operador logístico WMS, multi-cliente', tipo: 'industria' },
  { titulo: 'Facturación por actividad en 3PL: cómo hacerlo bien con un WMS', categoria: 'Industria', keywords: 'facturación actividad 3PL, cobro por servicio logístico', tipo: 'guía' },
  { titulo: 'SLA en operaciones 3PL: cómo medirlos y cumplirlos', categoria: 'Industria', keywords: 'SLA 3PL, acuerdo nivel servicio logística', tipo: 'educativo' },

  // Industria Retail
  { titulo: 'WMS para retail omnicanal: fulfillment desde la tienda y el CD', categoria: 'Industria', keywords: 'WMS retail omnicanal, fulfillment tienda, ship from store', tipo: 'industria' },
  { titulo: 'Preparación de pedidos e-commerce: picking por olas vs por pedido', categoria: 'Industria', keywords: 'picking ecommerce, picking por olas, preparación pedidos', tipo: 'educativo' },
  { titulo: 'Peak season: cómo preparar tu almacén para Cyber Day y Black Friday', categoria: 'Industria', keywords: 'peak season almacén, Cyber Day logística, preparar bodega', tipo: 'estacional' },

  // Tendencias
  { titulo: 'Inteligencia artificial en logística: casos reales en Latinoamérica', categoria: 'Tendencias', keywords: 'IA logística, inteligencia artificial almacén, IA Latinoamérica', tipo: 'tendencia' },
  { titulo: 'WMS en la nube: por qué 2026 es el año del cloud en logística', categoria: 'Tendencias', keywords: 'WMS cloud 2026, WMS en la nube, cloud logística', tipo: 'tendencia' },
  { titulo: 'Sostenibilidad en almacenes: cómo la tecnología reduce la huella', categoria: 'Tendencias', keywords: 'sostenibilidad almacén, logística verde, reducir huella carbono', tipo: 'tendencia' },
  { titulo: 'Robótica y WMS: cómo trabajan juntos en el almacén del futuro', categoria: 'Tendencias', keywords: 'robótica almacén, robots WMS, automatización logística', tipo: 'tendencia' },
  { titulo: 'La cadena de suministro post-pandemia: lecciones para Latinoamérica', categoria: 'Tendencias', keywords: 'cadena suministro post pandemia, resiliencia supply chain', tipo: 'tendencia' },

  // Casos y datos
  { titulo: 'Caso de éxito: cómo aumentar 400% la capacidad de despacho en 30 días', categoria: 'Casos', keywords: 'caso éxito WMS, aumentar capacidad despacho, implementación rápida', tipo: 'caso' },
  { titulo: 'Caso de éxito: reducción de 60% en tiempo de picking con WMS', categoria: 'Casos', keywords: 'caso éxito picking, reducir tiempo picking, eficiencia WMS', tipo: 'caso' },
  { titulo: 'Benchmark logístico Chile 2026: costos, tiempos y eficiencia', categoria: 'Datos', keywords: 'benchmark logístico Chile, costos logísticos 2026, eficiencia almacén', tipo: 'datos' },
  { titulo: 'El mercado WMS en Latinoamérica: tamaño, players y proyecciones', categoria: 'Datos', keywords: 'mercado WMS Latinoamérica, industria WMS, software logístico mercado', tipo: 'datos' },

  // Operaciones
  { titulo: 'Inventario cíclico vs inventario completo: cuándo usar cada uno', categoria: 'Operaciones', keywords: 'inventario cíclico, conteo inventario, auditoría stock', tipo: 'educativo' },
  { titulo: 'Slotting: cómo optimizar la ubicación de productos en tu almacén', categoria: 'Operaciones', keywords: 'slotting almacén, ubicación productos, optimizar bodega', tipo: 'guía' },
  { titulo: 'Cross-docking: qué es y cómo implementarlo con WMS', categoria: 'Operaciones', keywords: 'cross docking, cross docking WMS, logística directa', tipo: 'educativo' },
  { titulo: 'Last mile y WMS: cómo el almacén impacta la última milla', categoria: 'Operaciones', keywords: 'last mile WMS, última milla almacén, despacho eficiente', tipo: 'educativo' },
  { titulo: 'Gestión de devoluciones: logística inversa con WMS', categoria: 'Operaciones', keywords: 'logística inversa, devoluciones WMS, reverse logistics', tipo: 'guía' },

  // Comparativas
  { titulo: 'invasWMS vs SAP EWM: comparativa para operaciones en LATAM', categoria: 'Comparativa', keywords: 'invasWMS vs SAP, comparativa WMS, SAP EWM alternativa', tipo: 'comparativo' },
  { titulo: 'invasWMS vs Manhattan Associates: cuál elegir en Latinoamérica', categoria: 'Comparativa', keywords: 'invasWMS vs Manhattan, WMS comparativa, Manhattan WMS alternativa', tipo: 'comparativo' },
  { titulo: 'WMS para pymes vs WMS enterprise: diferencias reales', categoria: 'Comparativa', keywords: 'WMS pymes, WMS enterprise, WMS según tamaño empresa', tipo: 'comparativo' },

  // Chile / LATAM específico
  { titulo: 'Los 10 mejores WMS disponibles en Chile (2026)', categoria: 'Rankings', keywords: 'mejores WMS Chile, top WMS Chile 2026, ranking WMS', tipo: 'ranking' },
  { titulo: 'Logística en Chile: desafíos y oportunidades para 2026', categoria: 'LATAM', keywords: 'logística Chile 2026, desafíos logísticos Chile, supply chain Chile', tipo: 'datos' },
  { titulo: 'Costos logísticos en Latinoamérica: cómo reducirlos con tecnología', categoria: 'LATAM', keywords: 'costos logísticos Latinoamérica, reducir costos logística', tipo: 'educativo' },

  // Implementación
  { titulo: 'Guía paso a paso: cómo implementar un WMS en menos de 30 días', categoria: 'Guías', keywords: 'implementar WMS, guía implementación WMS, WMS rápido', tipo: 'guía' },
  { titulo: 'Capacitación de equipos en WMS: mejores prácticas', categoria: 'Guías', keywords: 'capacitación WMS, entrenar equipo WMS, adopción tecnología', tipo: 'guía' },
  { titulo: 'Migración de WMS: cómo cambiar de sistema sin perder datos', categoria: 'Guías', keywords: 'migración WMS, cambiar sistema WMS, migrar datos almacén', tipo: 'guía' },
]

// ═══════════════════════════════════════════
// FUNCIONES
// ═══════════════════════════════════════════

async function verificarPublicadoHoy() {
  var hoy = new Date().toISOString().split('T')[0]
  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?after=' + hoy + 'T00:00:00&status=publish&per_page=5', {
    headers: { 'Authorization': AUTH }
  })
  var posts = await res.json()
  return Array.isArray(posts) && posts.length > 0
}

async function obtenerPostsExistentes() {
  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?per_page=50&_fields=title,slug', {
    headers: { 'Authorization': AUTH }
  })
  var posts = await res.json()
  return posts.map(function(p) { return p.title.rendered.toLowerCase() })
}

function seleccionarTema(existentes) {
  // Filtrar temas ya publicados
  var disponibles = TEMAS.filter(function(t) {
    return !existentes.some(function(e) {
      return e.includes(t.titulo.substring(0, 30).toLowerCase())
    })
  })
  if (disponibles.length === 0) disponibles = TEMAS // Si ya se publicaron todos, reiniciar
  // Aleatorio
  return disponibles[Math.floor(Math.random() * disponibles.length)]
}

async function generarArticulo(tema) {
  var systemPrompt = `Eres un periodista especializado en logística y supply chain con 15 años de experiencia en Latinoamérica. Escribes para el blog de invasWMS (software WMS 100% cloud). Tu escritura es directa, con datos concretos, ejemplos reales y opinión fundamentada. NUNCA escribes contenido genérico ni relleno.

REGLAS DE ESCRITURA OBLIGATORIAS:
- Párrafos cortos (3-4 oraciones máximo). El lector escanea, no lee todo.
- Cada H2 debe prometer algo concreto y cumplirlo en esa sección.
- Datos duros: cifras, porcentajes, estudios reales, nombres de empresas. Si no tienes el dato exacto, da un rango realista con fuente ("según Gartner, entre 15% y 25%").
- Ejemplos situacionales: "Imagina un centro de distribución en Santiago que despacha 5.000 pedidos/día..." — el lector se tiene que ver reflejado.
- CERO frases vacías tipo: "en el vertiginoso mundo de", "sinergia", "potenciar", "apalancarse", "es importante destacar que", "cabe señalar", "en la actualidad".
- NO empieces párrafos con "Es importante", "Cabe destacar", "En este sentido", "Por otro lado".
- Tono: como si le explicaras a un gerente de operaciones inteligente que no tiene tiempo. Directo, útil, sin rodeos.

DATOS DE invasWMS (mencionar natural, 2-3 veces máximo, NO como publicidad):
- +700 sitios conectados en América, +250.000 líneas/día, +1.800 usuarios
- Chile, Colombia, México, Perú, USA
- Caso real: +400% capacidad de despacho en 30 días
- Caso real: -60% tiempo de picking, -25% errores
- Implementación <30 días, 100% cloud, multi-país`

  var userPrompt = `ESCRIBE UN ARTÍCULO DE BLOG COMPLETO.

TEMA: ${tema.titulo}
KEYWORDS PRINCIPALES: ${tema.keywords}
TIPO DE ARTÍCULO: ${tema.tipo}

ESTRUCTURA OBLIGATORIA DEL HTML:
1. NO incluyas H1 (WordPress lo genera del título).
2. Empieza con un párrafo gancho de 2-3 oraciones que enganche: un dato impactante, una pregunta provocadora o un problema real.
3. Mínimo 6 secciones H2, cada una con 200-400 palabras. Algunas con H3 dentro.
4. Usa listas (<ul><li>) donde haya enumeraciones. Usa <strong> para conceptos clave.
5. Incluye AL MENOS una tabla HTML comparativa o de datos en el artículo.
6. Sección final H2 "Conclusión" con CTA suave: link a <a href="/contacto-invas/">contactar a invasWMS</a>.
7. Última sección H2 "Preguntas frecuentes" con 5 preguntas en formato <h3>pregunta</h3><p>respuesta</p>.

LINKS INTERNOS (incluir al menos 3, distribuidos naturalmente):
- <a href="/sistema-de-gestion-de-almacenes-wms/">sistema WMS de invasWMS</a>
- <a href="/software-logistico-por-industria/software-logistico-para-alimentos/">WMS para alimentos</a>
- <a href="/software-logistico-por-industria/software-logistico-para-3pl-y-4pl/">WMS para operadores 3PL</a>
- <a href="/software-logistico-por-industria/software-logistico-retail-omnicanal/">WMS retail omnicanal</a>
- <a href="/plataforma-de-datos-logisticos/">plataforma de datos logísticos</a>
- <a href="/contacto-invas/">solicitar una demo</a>

EXTENSIÓN: Mínimo 2.000 palabras de contenido real (no relleno). El contenido_html debe tener al menos 12.000 caracteres.

RESPONDE SOLO CON ESTE JSON (sin markdown, sin backticks):
{
  "titulo_seo": "Título para Google, max 60 caracteres, con keyword principal al inicio",
  "meta_description": "155 caracteres máximo. Debe incluir la keyword, un beneficio concreto y un call-to-action implícito. NO empieces con 'Descubre' ni 'En este artículo'.",
  "slug": "slug-con-keyword-principal-corto",
  "extracto": "2 oraciones: qué aprenderá el lector y por qué le importa.",
  "contenido_html": "<h2>...</h2><p>...</p>...",
  "categoria": "${tema.categoria}",
  "tags": ["${tema.keywords.split(',')[0].trim()}", "WMS", "logística", "${tema.categoria.toLowerCase()}"]
}`

  var res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 8000,
    })
  })

  var data = await res.json()
  var content = data.choices[0].message.content.trim()
  // Limpiar markdown code blocks si los tiene
  content = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
  var articulo = JSON.parse(content)

  // Validar calidad mínima
  var htmlLen = (articulo.contenido_html || '').length
  var h2Count = (articulo.contenido_html || '').split('<h2').length - 1
  var hasTable = (articulo.contenido_html || '').includes('<table')
  var hasFaq = (articulo.contenido_html || '').toLowerCase().includes('pregunta')

  console.log('  HTML: ' + htmlLen + ' chars, H2s: ' + h2Count + ', tabla: ' + hasTable + ', FAQ: ' + hasFaq)

  if (htmlLen < 8000) {
    console.error('❌ Artículo muy corto (' + htmlLen + ' chars, mínimo 8000). Reintentando...')
    // Reintentar una vez con instrucción más agresiva
    var retry = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: content },
          { role: 'user', content: 'El artículo tiene solo ' + htmlLen + ' caracteres. Necesito MÍNIMO 12.000 caracteres de HTML. Reescríbelo completo, mucho más extenso. Cada sección H2 debe tener 300-500 palabras. Agrega más ejemplos, más datos, más análisis. Mismo formato JSON.' }
        ],
        temperature: 0.6,
        max_tokens: 10000,
      })
    })
    var retryData = await retry.json()
    var retryContent = retryData.choices[0].message.content.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    articulo = JSON.parse(retryContent)
    console.log('  Reintento HTML: ' + (articulo.contenido_html || '').length + ' chars')
  }

  if (h2Count < 4) {
    console.warn('⚠️ Solo ' + h2Count + ' secciones H2 (mínimo esperado: 6)')
  }

  return articulo
}

async function obtenerOCrearCategoria(nombre) {
  // Buscar categoría existente
  var res = await fetch(WP_URL + '/wp-json/wp/v2/categories?search=' + encodeURIComponent(nombre), {
    headers: { 'Authorization': AUTH }
  })
  var cats = await res.json()
  if (cats.length > 0) return cats[0].id

  // Crear categoría
  var res2 = await fetch(WP_URL + '/wp-json/wp/v2/categories', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nombre })
  })
  var cat = await res2.json()
  return cat.id
}

async function publicarEnWordPress(articulo) {
  // Categoría 57 = "Documentos Técnicos" — aparece en la página de blog de Elementor
  var catId = 57
  // También agregar categoría específica si existe
  var catExtra = await obtenerOCrearCategoria(articulo.categoria)

  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: articulo.titulo_seo,
      slug: articulo.slug,
      content: articulo.contenido_html,
      excerpt: articulo.extracto,
      status: 'publish',
      categories: [catId, catExtra].filter(function(v,i,a) { return a.indexOf(v) === i }),
      meta: {
        rank_math_title: articulo.titulo_seo + ' | invasWMS Blog',
        rank_math_description: articulo.meta_description,
        rank_math_focus_keyword: articulo.tags ? articulo.tags[0] : '',
      }
    })
  })

  var post = await res.json()
  return post
}

async function notificarEmail(articulo, postUrl) {
  if (!RESEND_KEY) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'M&P SEO <contacto@mulleryperez.cl>',
        to: ['contacto@mulleryperez.cl', 'jvio@impruvex.com'],
        subject: '📝 Blog invasWMS: ' + articulo.titulo_seo,
        html: '<div style="font-family:sans-serif;max-width:500px">'
          + '<h2 style="color:#1a1a2e">Nuevo artículo publicado en invasWMS</h2>'
          + '<p><strong>' + articulo.titulo_seo + '</strong></p>'
          + '<p>' + articulo.meta_description + '</p>'
          + '<p>Categoría: ' + articulo.categoria + '</p>'
          + '<p><a href="' + postUrl + '" style="color:#2563EB">Ver artículo →</a></p>'
          + '</div>'
      })
    })
  } catch (e) { console.log('Email notification failed (non-critical)') }
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  INVAS WMS — BLOG DIARIO')
  console.log('  ' + new Date().toISOString().split('T')[0])
  console.log('═══════════════════════════════════════════\n')

  // 1. Verificar si ya se publicó hoy
  var yaPublicado = await verificarPublicadoHoy()
  if (yaPublicado) {
    console.log('Ya se publicó un artículo hoy. Saltando.')
    return
  }

  // 2. Obtener posts existentes para no repetir
  var existentes = await obtenerPostsExistentes()
  console.log('Posts existentes: ' + existentes.length)

  // 3. Seleccionar tema
  var tema = seleccionarTema(existentes)
  console.log('Tema seleccionado: ' + tema.titulo)
  console.log('Keywords: ' + tema.keywords)
  console.log('Tipo: ' + tema.tipo)

  // 4. Generar artículo con OpenAI
  console.log('\nGenerando artículo con GPT-4o...')
  var articulo = await generarArticulo(tema)
  console.log('Artículo generado: ' + articulo.titulo_seo)
  console.log('Slug: ' + articulo.slug)
  console.log('Largo HTML: ' + (articulo.contenido_html || '').length + ' chars')

  // 5. Publicar en WordPress
  console.log('\nPublicando en WordPress...')
  var post = await publicarEnWordPress(articulo)

  if (post.id) {
    var postUrl = post.link || (WP_URL + '/' + articulo.slug + '/')
    console.log('\n✅ PUBLICADO')
    console.log('   ID: ' + post.id)
    console.log('   URL: ' + postUrl)
    console.log('   Título: ' + articulo.titulo_seo)
    console.log('   Categoría: ' + articulo.categoria)

    // 6. Notificar
    await notificarEmail(articulo, postUrl)
    console.log('   Email: enviado a contacto@mulleryperez.cl')

    // Outputs para GitHub Actions
    console.log('\n::set-output name=title::' + articulo.titulo_seo)
    console.log('::set-output name=url::' + postUrl)
    console.log('::set-output name=category::' + articulo.categoria)
  } else {
    console.error('❌ Error publicando:', JSON.stringify(post).substring(0, 200))
    process.exit(1)
  }
}

main().catch(function(e) {
  console.error('Error fatal:', e.message)
  process.exit(1)
})
