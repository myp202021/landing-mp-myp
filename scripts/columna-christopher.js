/**
 * Columna semanal de Christopher Müller
 * Artículos de opinión / visión estratégica desde la trinchera de una agencia
 * Tono personal, primera persona, con datos reales
 * Corre lunes via GitHub Actions
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const RESEND_KEY = process.env.RESEND
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const COLUMNAS = [
  // Visión de agencia
  { tema: 'Lo que nadie te dice cuando contratas una agencia de marketing digital en Chile', tag: 'Opinión' },
  { tema: 'Por qué dejamos de ofrecer SEO orgánico y nos enfocamos solo en performance', tag: 'Opinión' },
  { tema: 'El mito del ROAS 10x: qué significa realmente un buen retorno en Chile', tag: 'Opinión' },
  { tema: 'Clientes que crecen vs clientes que se estancan: los patrones que veo después de 5 años', tag: 'Opinión' },
  { tema: 'La agencia del futuro no tiene 50 personas: tiene 5 y usa IA para todo lo demás', tag: 'Opinión' },

  // Tendencias y mercado
  { tema: 'El presupuesto digital de las PYMEs chilenas en 2026: dónde se está yendo la plata', tag: 'Mercado' },
  { tema: 'Google vs Meta en Chile: dónde conviene invertir según lo que veo en las campañas reales', tag: 'Mercado' },
  { tema: 'La IA ya cambió el marketing digital: esto es lo que estoy usando todos los días', tag: 'Tendencias' },
  { tema: 'LinkedIn Ads en Chile: por qué el B2B sigue subestimando esta plataforma', tag: 'Mercado' },
  { tema: 'El mercado inmobiliario digital en Chile: lo que aprendí manejando campañas para corredoras', tag: 'Mercado' },

  // Lecciones y errores
  { tema: 'Los 3 errores más caros que he visto en campañas de Google Ads en Chile', tag: 'Lecciones' },
  { tema: 'Cuando un cliente quiere resultados en 2 semanas: cómo manejar expectativas sin mentir', tag: 'Lecciones' },
  { tema: 'Lo que aprendí perdiendo un cliente grande: la honestidad brutal como estrategia', tag: 'Lecciones' },
  { tema: 'Por qué los dashboards en tiempo real cambiaron la relación con nuestros clientes', tag: 'Lecciones' },
  { tema: 'El día que automaticé el 80% del trabajo de la agencia y qué pasó después', tag: 'Lecciones' },

  // Estrategia real
  { tema: 'Cómo decidir entre invertir más en Google o en Meta: el framework que uso con cada cliente', tag: 'Estrategia' },
  { tema: 'La obsesión con el CPL está matando las campañas: lo que realmente importa medir', tag: 'Estrategia' },
  { tema: 'Campañas que funcionan solas vs campañas que necesitan optimización diaria: cuándo usar cada una', tag: 'Estrategia' },
  { tema: 'Por qué le digo a mis clientes que no todo se puede medir (y por qué eso está bien)', tag: 'Estrategia' },
  { tema: 'El embudo de conversión está roto: cómo estamos repensando el journey del cliente en 2026', tag: 'Estrategia' },

  // Industrias desde la experiencia
  { tema: 'Lo que aprendí haciendo campañas para clínicas: el sector salud tiene reglas distintas', tag: 'Industrias' },
  { tema: 'E-commerce en Chile: por qué el Cyber no es la estrategia y qué hacer el resto del año', tag: 'Industrias' },
  { tema: 'Campañas para educación superior: cómo llenar matrículas cuando todos compiten por lo mismo', tag: 'Industrias' },
  { tema: 'SaaS chileno y marketing digital: el desafío de vender software con presupuesto de PYME', tag: 'Industrias' },
  { tema: 'Sorteos online como modelo de negocio: lo que los datos me enseñaron sobre conversión y recompra', tag: 'Industrias' },

  // Futuro y filosofía
  { tema: 'Las agencias que sobrevivan los próximos 3 años van a ser muy distintas a las de hoy', tag: 'Futuro' },
  { tema: 'El marketing digital dejó de ser digital: es simplemente marketing con mejores herramientas', tag: 'Futuro' },
  { tema: 'Por qué construimos nuestras propias herramientas en vez de pagar por SaaS', tag: 'Futuro' },
  { tema: 'La automatización no reemplaza al estratega: reemplaza al ejecutor', tag: 'Futuro' },
  { tema: 'Lo que le diría a alguien que está partiendo una agencia de marketing digital hoy en Chile', tag: 'Futuro' },
]

function slugify(text) {
  return 'columna-' + text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

async function elegirTema() {
  const { data: existentes } = await supabase
    .from('blog_posts')
    .select('slug')
    .like('slug', 'columna-%')

  const slugsUsados = new Set((existentes || []).map(p => p.slug))
  const disponibles = COLUMNAS.filter(t => !slugsUsados.has(slugify(t.tema)))

  if (disponibles.length > 0) {
    return disponibles[Math.floor(Math.random() * disponibles.length)]
  }

  // Generar tema nuevo
  console.log('Temas predefinidos agotados, generando con IA...')
  const usados = [...slugsUsados].join(', ')
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Eres Christopher Müller, fundador de una agencia de performance marketing en Chile. Genera UN tema para tu columna semanal de opinión. Debe ser personal, con visión estratégica, basado en experiencia real. NO repetir estos ya publicados: ' + usados + '\n\nResponde SOLO JSON: {"tema": "título", "tag": "Opinión|Mercado|Lecciones|Estrategia|Industrias|Futuro"}' }],
      max_tokens: 200, temperature: 0.9
    })
  })
  const data = await res.json()
  try {
    return JSON.parse(data.choices[0].message.content.replace(/```json?\n?/g, '').replace(/```/g, '').trim())
  } catch {
    return { tema: 'Reflexiones de una agencia digital en Chile: lo que está cambiando en ' + new Date().getFullYear(), tag: 'Opinión' }
  }
}

async function generarColumna(tema) {
  const hoy = new Date().toISOString().split('T')[0]
  const slug = slugify(tema.tema)

  console.log('Generando columna: ' + tema.tema)

  const prompt = `Eres Christopher Müller, fundador de Muller y Pérez (www.mulleryperez.cl), una agencia de performance marketing en Chile. Escribe tu columna semanal.

TEMA: ${tema.tema}
FECHA: ${hoy}

INSTRUCCIONES:

VOZ Y TONO:
- Escribe en PRIMERA PERSONA. Tú eres Christopher, estás hablando directamente.
- Tono: directo, honesto, sin rodeos. Como si hablaras con un colega tomando café.
- Puedes decir "en mi experiencia", "lo que he visto", "con nuestros clientes", "en la agencia".
- NO uses tono de artículo corporativo ni de ChatGPT genérico.
- Sé polémico si el tema lo amerita. Opina con convicción.
- Usa datos reales de Chile cuando puedas (CPC, CPL, inversión, tendencias).

ESTRUCTURA HTML (clases Tailwind):
- Dentro de <div class="prose prose-lg max-w-none">
- H2: <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">
- H3: <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">
- Párrafos: <p class="text-gray-700 mb-4">
- Listas: <ul class="space-y-3 text-gray-700 mb-8"> con <li class="flex items-start gap-3"><span class="text-blue-600 font-bold">•</span><span>...</span></li>
- Callout opinión: <div class="bg-gray-900 text-white p-6 rounded-xl mb-8"><p class="text-gray-100 font-medium italic text-lg">"Frase destacada o reflexión fuerte"</p></div>
- Callout dato: <div class="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8"><p class="text-gray-700">...</p></div>

CONTENIDO:
- Mínimo 1500 palabras
- Al menos 4 H2
- Arranca con un gancho fuerte — una afirmación, una pregunta, algo que pasó
- Incluye al menos 1 anécdota o caso real (puede ser anónimo)
- Termina con tu opinión clara y un pensamiento final
- NO incluyas CTA comercial explícito — esto es contenido de liderazgo, no venta
- Menciona a M&P solo si es natural al contexto

NO incluir: H1, header, footer, imágenes, metadata.
RESPONDE SOLO con el HTML del contenido.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }], max_tokens: 4096, temperature: 0.8 })
  })

  if (!res.ok) throw new Error('OpenAI error: ' + res.status)
  const data = await res.json()
  const html = data.choices[0].message.content

  // Metadata
  const metaRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Para esta columna de opinión de Christopher Müller sobre marketing digital en Chile:\nTÍTULO: ' + tema.tema + '\n\nGenera JSON:\n{"title":"título SEO max 60 chars","description":"meta description max 155 chars","keywords":"5 keywords","excerpt":"resumen 1-2 frases max 200 chars","readTime":"X min"}' }],
      max_tokens: 300, temperature: 0.3
    })
  })
  const metaData = await metaRes.json()
  let meta
  try {
    meta = JSON.parse(metaData.choices[0].message.content.replace(/```json?\n?/g, '').replace(/```/g, '').trim())
  } catch {
    meta = { title: tema.tema.substring(0, 60), description: tema.tema, keywords: 'marketing digital chile, columna, opinión', excerpt: tema.tema, readTime: '8 min' }
  }

  return {
    slug, title: tema.tema, seo_title: meta.title, description: meta.description,
    keywords: meta.keywords, excerpt: meta.excerpt, category: 'Columna',
    tag: tema.tag, read_time: meta.readTime, content_html: html,
    date_published: hoy, author: 'Christopher Müller'
  }
}

async function notificar(asunto, cuerpo) {
  if (!RESEND_KEY) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'M&P Blog <contacto@mulleryperez.cl>', to: ['contacto@mulleryperez.cl'], subject: asunto, html: cuerpo })
    })
  } catch (e) { console.log('Email error: ' + e.message) }
}

async function main() {
  console.log('=== Columna Christopher Müller ===')

  // Idempotencia: no publicar si ya hay columna esta semana
  const hoy = new Date()
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7))
  const lunesStr = lunes.toISOString().split('T')[0]

  const { data: yaPublicado } = await supabase
    .from('blog_posts')
    .select('slug')
    .like('slug', 'columna-%')
    .gte('date_published', lunesStr)

  if (yaPublicado && yaPublicado.length > 0) {
    console.log('Ya hay columna esta semana: ' + yaPublicado[0].slug)
    return
  }

  const tema = await elegirTema()
  const articulo = await generarColumna(tema)

  const { error } = await supabase.from('blog_posts').upsert(articulo, { onConflict: 'slug' })
  if (error) throw new Error('Supabase: ' + error.message)

  console.log('Publicado: ' + articulo.slug)
  console.log('URL: https://www.mulleryperez.cl/blog/' + articulo.slug)

  await notificar(
    'Columna publicada: ' + articulo.title,
    '<h2>' + articulo.title + '</h2><p>Categoría: ' + articulo.tag + '</p><p><a href="https://www.mulleryperez.cl/blog/' + articulo.slug + '">Ver columna</a></p>'
  )
}

main().catch(async (err) => {
  console.error('ERROR:', err.message)
  await notificar('FALLO Columna Christopher — ' + new Date().toISOString().split('T')[0], '<p>Error: ' + err.message + '</p>')
  process.exit(1)
})
