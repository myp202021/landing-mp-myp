// blog-rankings-semanal.js
// Genera artículos semanales de autoridad: rankings, tendencias, análisis de mercado
// Pipeline: OpenAI (research + draft) → Claude (review + optimize) → Supabase (publish)
// Cron: miércoles 8:00 AM Chile (11:00 UTC)
// Requiere: OPENAI_API_KEY, ANTHROPIC_API_KEY_GRILLAS, SUPABASE_URL, SUPABASE_SERVICE_KEY

var fetch = require('node-fetch')
var supabaseLib = require('@supabase/supabase-js')

var OPENAI_KEY = process.env.OPENAI_API_KEY
var ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_GRILLAS
var supabase = supabaseLib.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ═══ TEMAS ROTATIVOS (semana del mes) ═══
var TEMAS = [
  {
    tipo: 'ranking_agencias',
    titulo_base: 'Ranking agencias de marketing digital Chile',
    prompt_research: 'Investiga las principales agencias de marketing digital en Chile en 2026. Busca datos de: número de clientes, especialidades, presencia en redes, premios, casos de éxito publicados. Incluye agencias de Santiago, Valparaíso y Concepción. Menciona tendencias del mercado de agencias.',
    category: 'Rankings',
    keywords_base: 'ranking agencias marketing digital chile, mejores agencias marketing chile, agencias performance chile',
  },
  {
    tipo: 'tendencias_consumidores',
    titulo_base: 'Tendencias consumidores digitales Chile',
    prompt_research: 'Investiga las tendencias actuales de consumidores digitales en Chile en 2026. Busca datos de: penetración móvil, redes sociales más usadas, hábitos de compra online, métodos de pago preferidos, cambios post-pandemia, generación Z vs millennials. Usa datos de fuentes como CCS, Cámara de Comercio de Santiago, estudios de mercado recientes.',
    category: 'Tendencias',
    keywords_base: 'tendencias consumidores digitales chile, comportamiento consumidor digital, ecommerce chile tendencias',
  },
  {
    tipo: 'ranking_herramientas_ia',
    titulo_base: 'Ranking herramientas de IA para marketing',
    prompt_research: 'Investiga las mejores herramientas de inteligencia artificial para marketing digital en 2026. Categorías: generación de contenido, análisis de datos, automatización de campañas, SEO con IA, diseño con IA, chatbots. Para cada herramienta: nombre, precio, qué hace, pros y contras, ideal para qué tipo de empresa.',
    category: 'IA',
    keywords_base: 'herramientas ia marketing, inteligencia artificial marketing digital, ia para agencias',
  },
  {
    tipo: 'tendencias_sector',
    titulo_base: 'Tendencias marketing digital por sector Chile',
    prompt_research: 'Investiga las tendencias de marketing digital por sector en Chile 2026. Sectores: inmobiliario, salud, fintech, educación, ecommerce, B2B, turismo, retail. Para cada sector: canales que funcionan, CPC promedio, tipo de contenido que convierte, casos de éxito. Usa datos reales de Google Ads y Meta Ads.',
    category: 'Tendencias',
    keywords_base: 'marketing digital por sector chile, tendencias marketing inmobiliario, marketing digital salud chile',
  },
]

// ═══ DATOS PROPIOS DE M&P (ventaja competitiva) ═══
async function getDatosPropios() {
  try {
    // Indicadores semanales (CPC, CPA por industria)
    var { data: indicadores } = await supabase
      .from('indicadores_semanales')
      .select('*')
      .order('id', { ascending: false })
      .limit(4)

    // Últimos blog posts para no repetir temas
    var { data: ultimosPosts } = await supabase
      .from('blog_posts')
      .select('slug, title, category')
      .order('date_published', { ascending: false })
      .limit(10)

    return {
      indicadores: indicadores || [],
      ultimosPosts: (ultimosPosts || []).map(function(p) { return p.title }).join(', '),
      usd_clp: indicadores && indicadores[0] ? indicadores[0].usd_clp : 935,
    }
  } catch (e) {
    console.error('Error obteniendo datos propios:', e.message)
    return { indicadores: [], ultimosPosts: '', usd_clp: 935 }
  }
}

// ═══ PASO 1: RESEARCH (OpenAI) ═══
async function paso1_research(tema, datosPropios) {
  console.log('   PASO 1: OpenAI investiga...')

  var hoy = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  var mes = new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

  var prompt = tema.prompt_research + '\n\n'
  prompt += 'Fecha actual: ' + hoy + '\n'
  prompt += 'Datos propios de M&P (usar como fuente):\n'
  prompt += '- USD/CLP: $' + datosPropios.usd_clp + '\n'
  if (datosPropios.indicadores.length > 0) {
    var ind = datosPropios.indicadores[0]
    if (ind.cpc_data) prompt += '- CPC promedio Chile: ' + JSON.stringify(ind.cpc_data).substring(0, 300) + '\n'
  }
  prompt += '\nÚltimos artículos publicados (NO repetir estos temas): ' + datosPropios.ultimosPosts + '\n'
  prompt += '\nResponde con un JSON con esta estructura:\n'
  prompt += '{\n'
  prompt += '  "titulo": "título optimizado SEO (incluir Chile y año)",\n'
  prompt += '  "descripcion": "meta description de 155 caracteres max",\n'
  prompt += '  "keywords": "lista de keywords separadas por coma",\n'
  prompt += '  "secciones": [\n'
  prompt += '    { "h2": "título de sección", "contenido": "3-5 párrafos de contenido rico con datos" },\n'
  prompt += '    ...\n'
  prompt += '  ],\n'
  prompt += '  "tabla_ranking": { "headers": ["Col1","Col2",...], "rows": [["val1","val2",...], ...] },\n'
  prompt += '  "fuentes": ["fuente1", "fuente2", ...],\n'
  prompt += '  "datos_clave": ["dato1", "dato2", ...]\n'
  prompt += '}\n'
  prompt += '\nIMPORTANTE: mínimo 6 secciones. Contenido largo y detallado (1500+ palabras total). Datos reales, no inventados. Si no tienes un dato, di "según estimaciones del mercado". Incluir al menos 1 tabla con ranking o comparativa.'

  try {
    var r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Eres un analista senior de marketing digital en Chile. Generas contenido de autoridad con datos reales. Respondes SOLO en JSON válido.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      })
    })
    var data = await r.json()
    var content = data.choices[0].message.content
    var research = JSON.parse(content)
    console.log('   Research: ' + research.secciones.length + ' secciones, título: ' + research.titulo)
    return research
  } catch (e) {
    console.error('   Research error:', e.message)
    return null
  }
}

// ═══ PASO 2: REDACCIÓN HTML (OpenAI) ═══
async function paso2_redactar(research, tema) {
  console.log('   PASO 2: OpenAI redacta HTML...')

  var prompt = 'Convierte este research en un artículo HTML profesional para un blog de marketing digital.\n\n'
  prompt += 'Research:\n' + JSON.stringify(research, null, 2) + '\n\n'
  prompt += 'REGLAS:\n'
  prompt += '- HTML con clases Tailwind (prose prose-lg)\n'
  prompt += '- Mínimo 1500 palabras\n'
  prompt += '- H2 para cada sección, H3 para subsecciones\n'
  prompt += '- Tablas con border-collapse y padding\n'
  prompt += '- Listas con datos concretos\n'
  prompt += '- NO incluir <html>, <head>, <body> — solo el contenido del artículo\n'
  prompt += '- Incluir la tabla del ranking con formato profesional\n'
  prompt += '- Citar fuentes al final\n'
  prompt += '- Tono: profesional pero accesible, como un analista hablándole a un gerente\n'
  prompt += '- NO usar frases de IA: "en el vertiginoso", "es fundamental", "sin lugar a dudas"\n'
  prompt += '- Incluir datos numéricos reales en cada sección\n'
  prompt += '- Responde SOLO con el HTML, nada más\n'

  try {
    var r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Eres un redactor senior de contenido SEO para marketing digital en Chile. Escribes artículos de autoridad con datos reales. Respondes SOLO con HTML.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 6000,
      })
    })
    var data = await r.json()
    var html = data.choices[0].message.content
    // Limpiar markdown code blocks si los hay
    html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '')
    var wordCount = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(function(w) { return w.length > 0 }).length
    console.log('   Redacción: ' + wordCount + ' palabras')
    return { html: html, wordCount: wordCount }
  } catch (e) {
    console.error('   Redacción error:', e.message)
    return null
  }
}

// ═══ PASO 3: REVISIÓN Y OPTIMIZACIÓN (Claude) ═══
async function paso3_revisar(html, research, wordCount) {
  console.log('   PASO 3: Claude revisa y optimiza...')

  var prompt = 'Revisa y optimiza este artículo de blog sobre marketing digital en Chile.\n\n'
  prompt += 'HTML actual:\n' + html + '\n\n'
  prompt += 'Título: ' + research.titulo + '\n'
  prompt += 'Palabras actuales: ' + wordCount + '\n\n'
  prompt += 'CHECKLIST DE REVISIÓN:\n'
  prompt += '1. ¿Tiene mínimo 1500 palabras? Si no, EXPANDIR secciones con más datos y análisis\n'
  prompt += '2. ¿Suena a IA genérica? Eliminar frases como "en el vertiginoso", "es importante destacar", "paradigma"\n'
  prompt += '3. ¿Tiene datos concretos en cada sección? Si faltan, agregar estimaciones realistas del mercado chileno\n'
  prompt += '4. ¿La tabla del ranking está bien formateada? Verificar HTML de tabla\n'
  prompt += '5. ¿Hay links internos a mulleryperez.cl? Agregar 2-3 links relevantes:\n'
  prompt += '   - /indicadores (termómetro de marketing)\n'
  prompt += '   - /copilot (monitoreo de competencia)\n'
  prompt += '   - /predictor (predictor de costos)\n'
  prompt += '6. ¿El tono es de analista, no de vendedor? Ajustar si es necesario\n'
  prompt += '7. ¿Las fuentes están citadas al final?\n\n'
  prompt += 'Responde SOLO con el HTML corregido y optimizado. Nada más.'

  try {
    var r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    var data = await r.json()
    var revisado = data.content[0].text
    revisado = revisado.replace(/^```html\n?/, '').replace(/\n?```$/, '')
    var newWordCount = revisado.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(function(w) { return w.length > 0 }).length
    console.log('   Revisión: ' + newWordCount + ' palabras (antes: ' + wordCount + ')')
    return revisado
  } catch (e) {
    console.error('   Revisión error:', e.message)
    return html // Devolver original si falla
  }
}

// ═══ PASO 4: PUBLICAR EN SUPABASE ═══
async function paso4_publicar(research, htmlFinal) {
  console.log('   PASO 4: Publicando en Supabase...')

  var hoy = new Date().toISOString().split('T')[0]
  var slug = research.titulo
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)

  var wordCount = htmlFinal.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(function(w) { return w.length > 0 }).length
  var readTime = Math.max(3, Math.ceil(wordCount / 200)) + ' min'

  var post = {
    slug: slug,
    title: research.titulo,
    seo_title: research.titulo,
    description: research.descripcion || research.titulo,
    keywords: research.keywords || '',
    excerpt: (research.descripcion || '').substring(0, 200),
    category: 'Rankings',
    tag: 'Rankings',
    read_time: readTime,
    content_html: htmlFinal,
    date_published: hoy,
    author: 'Christopher Müller',
  }

  try {
    // Check if slug exists
    var { data: existing } = await supabase.from('blog_posts').select('id').eq('slug', slug).limit(1)
    if (existing && existing.length > 0) {
      // Update
      await supabase.from('blog_posts').update({ content_html: htmlFinal, date_published: hoy }).eq('slug', slug)
      console.log('   Actualizado: /blog/' + slug)
    } else {
      // Insert
      await supabase.from('blog_posts').insert(post)
      console.log('   Publicado: /blog/' + slug)
    }
    console.log('   ' + wordCount + ' palabras | ' + readTime + ' lectura')
    return slug
  } catch (e) {
    console.error('   Publicación error:', e.message)
    return null
  }
}

// ═══ MAIN ═══
async function main() {
  console.log('BLOG RANKINGS SEMANAL | ' + new Date().toISOString().split('T')[0])

  // Determinar tema de esta semana (rotación por semana del mes)
  var weekOfMonth = Math.ceil(new Date().getDate() / 7)
  var temaIdx = (weekOfMonth - 1) % TEMAS.length
  var tema = TEMAS[temaIdx]
  console.log('Tema: ' + tema.tipo + ' (semana ' + weekOfMonth + ')\n')

  // Datos propios de M&P
  var datosPropios = await getDatosPropios()
  console.log('Datos propios: ' + datosPropios.indicadores.length + ' indicadores, USD ' + datosPropios.usd_clp)

  // Pipeline
  var research = await paso1_research(tema, datosPropios)
  if (!research) { console.error('Research falló — abortando'); return }

  var draft = await paso2_redactar(research, tema)
  if (!draft) { console.error('Redacción falló — abortando'); return }

  var htmlFinal = draft.html
  if (draft.wordCount < 1500) {
    console.log('   Artículo corto (' + draft.wordCount + ' palabras) — Claude va a expandir')
  }
  htmlFinal = await paso3_revisar(htmlFinal, research, draft.wordCount)

  var slug = await paso4_publicar(research, htmlFinal)
  if (slug) {
    console.log('\n✅ Publicado: https://www.mulleryperez.cl/blog/' + slug)
  }
}

main().catch(function(e) { console.error(e); process.exit(1) })
