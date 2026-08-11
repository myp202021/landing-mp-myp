/**
 * Reescribe posts cortos (<15K chars) a 4000+ palabras
 * usando generación por secciones (outline → sección por sección → unificar)
 *
 * Uso: node scripts/reescribir-blogs-cortos.js
 * Requiere: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
 *
 * Procesa máximo 30 posts por ejecución para no exceder rate limits
 */

const fetch = globalThis.fetch || require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const OPENAI_KEY = process.env.OPENAI_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

if (!OPENAI_KEY) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

const MAX_POSTS = 30
const MIN_CHARS = 15000  // posts con menos de esto se reescriben
const TARGET_SECTIONS = 9

// ═══ ESTILOS TAILWIND (mismos que generar-blog.js) ═══
const TAILWIND_STYLES = `
- H2: <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">
- H3: <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">
- Párrafos: <p class="text-gray-700 mb-4">
- Listas: <ul class="space-y-3 text-gray-700 mb-8"> con <li class="flex items-start gap-3"><span class="text-blue-600 font-bold">•</span><span>...</span></li>
- Callout importante: <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8"><h3 class="text-xl font-bold text-gray-900 mb-4">Título</h3><p class="text-gray-700">...</p></div>
- Callout dato: <div class="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8"><p class="text-gray-700">...</p></div>
- Tablas: <div class="overflow-x-auto mb-8"><table class="min-w-full border-collapse"><thead><tr class="bg-gray-900 text-white"><th class="px-4 py-3 text-left text-sm font-semibold">...</th></tr></thead><tbody><tr class="border-b border-gray-200 hover:bg-gray-50"><td class="px-4 py-3 text-sm text-gray-700">...</td></tr></tbody></table></div>
`.trim()

const LINKS_INTERNOS = `
Links internos (incluir al menos 4 distribuidos naturalmente):
- <a href="/servicios" class="text-blue-600 hover:underline">servicios de marketing digital</a>
- <a href="/contacto" class="text-blue-600 hover:underline">contactar a nuestro equipo</a>
- <a href="/blog" class="text-blue-600 hover:underline">blog de marketing digital</a>
- <a href="/labs/predictor" class="text-blue-600 hover:underline">predictor de inversión</a>
- <a href="/ranking-agencias-marketing-digital-chile" class="text-blue-600 hover:underline">ranking de agencias</a>
- <a href="/casos-de-exito" class="text-blue-600 hover:underline">casos de éxito</a>
`.trim()

const CTA_BLOCK = `<div class="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-center mt-12 mb-8"><h2 class="text-2xl font-bold text-white mb-4">¿Necesitas resultados reales en marketing digital?</h2><p class="text-blue-100 mb-6">En Muller y Pérez trabajamos con datos, no con suposiciones. Agenda una reunión estratégica sin costo.</p><a href="/contacto" class="inline-block bg-white text-blue-900 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition">Solicitar propuesta →</a></div>`

// ═══ OPENAI CALL ═══
async function callOpenAI(messages, opts) {
  opts = opts || {}
  var r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: messages,
      temperature: opts.temperature || 0.7,
      max_tokens: opts.max_tokens || 3000,
      response_format: opts.json ? { type: 'json_object' } : undefined
    })
  })
  var d = await r.json()
  if (!d.choices || !d.choices[0]) throw new Error('OpenAI error: ' + JSON.stringify(d).substring(0, 300))
  return d.choices[0].message.content.trim()
}

// ═══ GENERAR OUTLINE ═══
async function generarOutline(title, category, keywords) {
  var raw = await callOpenAI([{
    role: 'user',
    content: `Eres un experto en marketing digital y performance marketing en Chile. Genera un outline detallado para reescribir y expandir este artículo de blog.

TÍTULO: ${title}
CATEGORÍA: ${category}
KEYWORDS: ${keywords}

Genera un outline con 9 secciones H2, cada una con 3-4 puntos clave a desarrollar.
La penúltima sección debe ser "Conclusión" con CTA.
La última sección debe ser "Preguntas frecuentes" con 6 preguntas concretas.

Responde en JSON:
{
  "secciones": [
    {"h2": "Título de la sección", "puntos": ["punto 1", "punto 2", "punto 3"]}
  ]
}`
  }], { max_tokens: 2000, json: true })

  return JSON.parse(raw.replace(/^```json?\n?/, '').replace(/\n?```$/, ''))
}

// ═══ GENERAR SECCIÓN ═══
async function generarSeccion(title, category, outline, seccion, index, total) {
  var isLast = index === total - 1
  var isConclusion = index === total - 2
  var extra = ''

  if (isLast) {
    extra = 'Esta es la sección de PREGUNTAS FRECUENTES. Escribe 6 preguntas como H3 (cada H3 debe terminar con ?), cada una seguida de un párrafo con respuesta completa de al menos 50 palabras.'
  } else if (isConclusion) {
    extra = 'Esta es la CONCLUSIÓN. Resumen + CTA natural hacia Muller y Pérez. Menciona contactar al equipo.'
  }

  var content = await callOpenAI([{
    role: 'user',
    content: `Eres un experto en marketing digital en Chile. Escribe la sección ${index + 1} de ${total} para un artículo titulado "${title}" (categoría: ${category}).

OUTLINE COMPLETO DEL ARTÍCULO:
${outline.secciones.map(function(s, i) { return (i + 1) + '. ' + s.h2 }).join('\n')}

SECCIÓN A ESCRIBIR: ${seccion.h2}
PUNTOS A CUBRIR: ${seccion.puntos.join(', ')}

${extra}

ESTILOS HTML (usar exactamente estas clases Tailwind):
${TAILWIND_STYLES}

${LINKS_INTERNOS}

INSTRUCCIONES:
- Escribe 400-600 palabras para esta sección
- Empieza con el H2 de la sección
- Usa H3 donde aplique
- Datos reales o benchmarks de Chile cuando sea posible
- Tono profesional pero directo, sin relleno
- NO incluir H1
- NO repetir contenido de otras secciones

Responde SOLO con el HTML de esta sección.`
  }], { max_tokens: 3000 })

  return content.replace(/^```html?\n?/, '').replace(/\n?```$/, '')
}

// ═══ MAIN ═══
async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  REESCRIBIR BLOGS CORTOS → 4000+ PALABRAS')
  console.log('  ' + new Date().toISOString().split('T')[0])
  console.log('═══════════════════════════════════════════\n')

  // Obtener posts cortos
  var { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, category, keywords, content_html')
    .order('id', { ascending: true })

  if (error) { console.error('Error Supabase:', error.message); process.exit(1) }

  var short = posts.filter(function(p) {
    return (p.content_html || '').length < MIN_CHARS
  })

  console.log('Total posts: ' + posts.length)
  console.log('Posts cortos (<' + MIN_CHARS + ' chars): ' + short.length)
  console.log('Procesando: ' + Math.min(MAX_POSTS, short.length) + '\n')

  var toProcess = short.slice(0, MAX_POSTS)
  var updated = 0
  var failed = 0

  for (var i = 0; i < toProcess.length; i++) {
    var post = toProcess[i]
    var oldChars = (post.content_html || '').length
    console.log((i + 1) + '/' + toProcess.length + ' — ' + post.title.substring(0, 60))
    console.log('  Actual: ' + oldChars + ' chars')

    try {
      // Step 1: Outline
      process.stdout.write('  Outline...')
      var outline = await generarOutline(post.title, post.category || 'Marketing Digital', post.keywords || '')
      console.log(' ' + outline.secciones.length + ' secciones')

      // Step 2: Generate each section
      var sections = []
      for (var s = 0; s < outline.secciones.length; s++) {
        process.stdout.write('  Sección ' + (s + 1) + '/' + outline.secciones.length + '...')
        var html = await generarSeccion(post.title, post.category || 'Marketing Digital', outline, outline.secciones[s], s, outline.secciones.length)
        sections.push(html)
        console.log(' ' + html.length + ' chars')
        // Small delay to avoid rate limits
        await new Promise(function(r) { setTimeout(r, 500) })
      }

      // Step 3: Join + CTA
      var newContent = '<div class="prose prose-lg max-w-none">\n' + sections.join('\n\n') + '\n\n' + CTA_BLOCK + '\n</div>'
      var newChars = newContent.length
      var h2Count = (newContent.match(/<h2/g) || []).length

      console.log('  Nuevo: ' + newChars + ' chars | ' + h2Count + ' H2s | ' + Math.round(newChars / oldChars * 100) + '% del original')

      if (newChars < oldChars) {
        console.log('  ⚠️ Nuevo más corto que original — saltando')
        failed++
        continue
      }

      // Step 4: Update in Supabase
      var { error: updateErr } = await supabase
        .from('blog_posts')
        .update({ content_html: newContent })
        .eq('id', post.id)

      if (updateErr) {
        console.log('  ❌ Error Supabase: ' + updateErr.message)
        failed++
      } else {
        console.log('  ✅ Actualizado: ' + oldChars + ' → ' + newChars + ' chars')
        updated++
      }
    } catch (e) {
      console.log('  ❌ Error: ' + e.message)
      failed++
    }

    console.log('')
  }

  console.log('═══════════════════════════════════════════')
  console.log('  RESUMEN: ' + updated + ' actualizados, ' + failed + ' fallos')
  console.log('═══════════════════════════════════════════')
}

main().catch(function(e) { console.error('Error:', e.message); process.exit(1) })
