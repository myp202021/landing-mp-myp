// invas-rankings-iniciales.js
// Genera 5 rankings de WMS por industria como artículos largos (3000+ palabras)
// Se ejecuta una vez para crear el contenido pilar
// Uso: node scripts/invas-rankings-iniciales.js

var fetch = require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var OPENAI_KEY = process.env.OPENAI_API_KEY
var RESEND_KEY = process.env.RESEND
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

if (!OPENAI_KEY) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

var RANKINGS = [
  {
    titulo: 'Los 10 Mejores WMS en Chile 2026: Ranking Completo',
    slug: 'mejores-wms-chile-2026',
    keywords: 'mejores WMS Chile, ranking WMS Chile 2026, top WMS Chile',
    descripcion_corta: 'Ranking actualizado de los 10 mejores sistemas WMS disponibles en Chile. Comparativa por funcionalidades, precio, industria y soporte local.',
    enfoque: 'Ranking general de WMS en Chile. Incluir: invasWMS (#1), SAP EWM, Manhattan Associates, Blue Yonder, Oracle WMS Cloud, Körber, Infor WMS, Check WMS, Cerca Technology, Softeon. Para cada uno: descripción breve, fortalezas, debilidades, precio estimado, mejor para qué industria. invasWMS destaca por: 100% cloud, +700 sitios en LATAM, implementación <30 días, presencia local en Chile.',
  },
  {
    titulo: 'Mejores WMS para Alimentos y Cadena de Frío 2026',
    slug: 'mejores-wms-alimentos-cadena-frio-2026',
    keywords: 'WMS alimentos, WMS cadena de frío, software logístico alimentos',
    descripcion_corta: 'Los mejores sistemas WMS especializados en distribución de alimentos, cadena de frío, control de lotes y trazabilidad. Comparativa 2026.',
    enfoque: 'Ranking de WMS especializados en alimentos y cold chain. Requerimientos clave: FIFO/FEFO, control de lotes, fechas de vencimiento, trazabilidad, temperatura, cumplimiento normativo. Incluir invasWMS como líder en LATAM con caso Emergent Cold (-60% picking). Comparar con: SAP EWM, Manhattan, Infor, Körber, Softeon.',
  },
  {
    titulo: 'Mejores WMS para Operadores Logísticos 3PL 2026',
    slug: 'mejores-wms-3pl-operadores-logisticos-2026',
    keywords: 'WMS 3PL, WMS operador logístico, software 3PL',
    descripcion_corta: 'Ranking de los mejores WMS para operadores logísticos 3PL y 4PL. Multi-cliente, multi-bodega, facturación por actividad.',
    enfoque: 'Ranking enfocado en 3PL/4PL. Requerimientos: multi-cliente, multi-bodega, billing por actividad, SLA por cliente, visibilidad del cliente, integraciones. invasWMS destaca por multi-bodega, +700 sitios, presencia en 5 países. Comparar con: Manhattan, Blue Yonder, Körber, 3PL Central, Extensiv.',
  },
  {
    titulo: 'Mejores WMS para Retail y eCommerce Omnicanal 2026',
    slug: 'mejores-wms-retail-ecommerce-omnicanal-2026',
    keywords: 'WMS retail, WMS ecommerce, WMS omnicanal, fulfillment',
    descripcion_corta: 'Los mejores WMS para operaciones retail omnicanal: fulfillment, ship-from-store, picking por olas, integración con marketplaces.',
    enfoque: 'Ranking para retail/ecommerce. Requerimientos: fulfillment, ship-from-store, picking por olas, integración marketplaces, peak season. invasWMS: caso +400% capacidad despacho en 30 días. Comparar con: Manhattan, Blue Yonder, Deposco, ShipBob, Extensiv.',
  },
  {
    titulo: 'invasWMS vs Check WMS: Comparativa Completa 2026',
    slug: 'invaswms-vs-check-wms-comparativa-2026',
    keywords: 'invasWMS vs Check WMS, comparativa WMS Chile, Check WMS vs Invas',
    descripcion_corta: 'Comparativa detallada entre invasWMS y Check WMS. Funcionalidades, precio, soporte, industrias, escalabilidad. ¿Cuál elegir?',
    enfoque: 'Comparativa directa invasWMS vs Check WMS. invasWMS: enterprise, multi-país, suite completa (WMS+OMS+Monitor+DataLake), +700 sitios, 100% cloud. Check WMS: pymes, precio bajo, sin costo implementación, integra ERPs chilenos. Ser honesto en la comparación — invasWMS gana en escalabilidad y funcionalidades, Check gana en precio para pymes. Conclusión: depende del tamaño de la operación.',
  },
]

async function generarRanking(ranking) {
  var prompt = `Eres un analista senior de tecnología logística. Genera un artículo de ranking/comparativa profesional para el blog de invasWMS.

DATOS DE invasWMS:
- +700 sitios conectados, +250.000 líneas/día, +1.800 usuarios
- Chile, Colombia, México, Perú, USA
- 100% cloud, implementación <30 días
- Suite: invasWMS + invasOMS + invasMONITOR + invasDATALAKE + invasANALYTICS
- Caso: +400% capacidad despacho (Emergent Cold)
- Caso: -60% tiempo picking (Dimaplac)
- Caso: -25% errores picking, +40% velocidad procesamiento

ARTÍCULO: ${ranking.titulo}
KEYWORDS: ${ranking.keywords}
ENFOQUE: ${ranking.enfoque}

INSTRUCCIONES:
1. Mínimo 2500 palabras, máximo 4000
2. Estructura: introducción, metodología, ranking (tabla + detalle), FAQ, conclusión
3. Tabla comparativa HTML con: nombre, tipo (cloud/on-prem), mejor para, precio estimado, score
4. Para cada WMS del ranking: 1 párrafo con fortalezas y debilidades
5. FAQ con mínimo 8 preguntas relevantes (schema-ready con <h3> para pregunta y <p> para respuesta)
6. Links internos HTML:
   - <a href="/sistema-de-gestion-de-almacenes-wms/">invasWMS</a>
   - <a href="/software-logistico-por-industria/software-logistico-para-alimentos/">WMS para alimentos</a>
   - <a href="/software-logistico-por-industria/software-logistico-para-3pl-y-4pl/">WMS para 3PL</a>
   - <a href="/software-logistico-por-industria/software-logistico-retail-omnicanal/">WMS para retail</a>
   - <a href="/contacto-invas/">solicitar demo</a>
7. Tono: analítico, objetivo, basado en datos. No vendedor.
8. invasWMS aparece como opción destacada pero no la única. Ser honesto con las alternativas.
9. NO usar: "en el vertiginoso mundo", "sinergia", "potenciar", "paradigma"
10. Incluir datos reales del mercado WMS (citar Gartner, G2, Capterra donde aplique)

FORMATO JSON:
{
  "titulo_seo": "max 60 chars",
  "meta_description": "max 155 chars",
  "slug": "${ranking.slug}",
  "extracto": "2 líneas resumen",
  "contenido_html": "<h2>...</h2>...",
  "tags": ["tag1","tag2","tag3","tag4","tag5"]
}

Solo JSON, sin texto adicional.`

  var res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 6000,
    })
  })

  var data = await res.json()
  var content = data.choices[0].message.content.trim()
  content = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(content)
}

async function obtenerOCrearCategoria(nombre) {
  var res = await fetch(WP_URL + '/wp-json/wp/v2/categories?search=' + encodeURIComponent(nombre), { headers: { 'Authorization': AUTH } })
  var cats = await res.json()
  if (cats.length > 0) return cats[0].id
  var res2 = await fetch(WP_URL + '/wp-json/wp/v2/categories', {
    method: 'POST', headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nombre })
  })
  return (await res2.json()).id
}

async function publicar(articulo, ranking) {
  var catId = await obtenerOCrearCategoria('Rankings')
  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: articulo.titulo_seo,
      slug: articulo.slug || ranking.slug,
      content: articulo.contenido_html,
      excerpt: articulo.extracto || ranking.descripcion_corta,
      status: 'publish',
      categories: [catId],
      meta: {
        rank_math_title: articulo.titulo_seo + ' | invasWMS Blog',
        rank_math_description: articulo.meta_description || ranking.descripcion_corta,
        rank_math_focus_keyword: ranking.keywords.split(',')[0].trim(),
      }
    })
  })
  return await res.json()
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  INVAS WMS — 5 RANKINGS INICIALES')
  console.log('═══════════════════════════════════════════\n')

  for (var i = 0; i < RANKINGS.length; i++) {
    var r = RANKINGS[i]
    console.log((i + 1) + '/5: ' + r.titulo)
    console.log('   Keywords: ' + r.keywords)

    try {
      console.log('   Generando con GPT-4o...')
      var articulo = await generarRanking(r)
      console.log('   HTML: ' + (articulo.contenido_html || '').length + ' chars')

      console.log('   Publicando...')
      var post = await publicar(articulo, r)

      if (post.id) {
        console.log('   ✅ ID: ' + post.id + ' | URL: ' + (post.link || r.slug))
      } else {
        console.log('   ❌ Error: ' + JSON.stringify(post).substring(0, 150))
      }
    } catch (e) {
      console.log('   ❌ Error: ' + e.message)
    }
    console.log('')
  }

  // Notificar
  if (RESEND_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'M&P SEO <contacto@mulleryperez.cl>',
          to: ['contacto@mulleryperez.cl', 'jvio@impruvex.com'],
          subject: '📊 invasWMS: 5 Rankings publicados',
          html: '<h2>5 Rankings de WMS publicados en invaswms.com</h2>'
            + RANKINGS.map(function(r) { return '<p>→ <a href="https://www.invaswms.com/' + r.slug + '/">' + r.titulo + '</a></p>' }).join('')
            + '<p style="color:#666;font-size:12px">Generado automáticamente por M&P SEO</p>'
        })
      })
      console.log('📧 Email enviado a contacto@ y jvio@impruvex.com')
    } catch (e) { console.log('Email error: ' + e.message) }
  }

  console.log('\n═══════════════════════════════════════════')
  console.log('  5 RANKINGS COMPLETADOS')
  console.log('═══════════════════════════════════════════')
}

main().catch(function(e) { console.error('Error:', e.message); process.exit(1) })
