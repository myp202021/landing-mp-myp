/**
 * Columna semanal de Christopher Müller
 * Artículos de opinión / visión estratégica desde la trinchera de una agencia
 * Tono personal, primera persona, con datos reales
 * Corre lunes via GitHub Actions
 */

const fetch = globalThis.fetch || require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const RESEND_KEY = process.env.RESEND
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const COLUMNAS = [
  // IA y Marketing — posicionamiento como referente
  { tema: 'Construí 12 agentes de IA que corren mi agencia: esto es lo que hacen y lo que aprendí', tag: 'IA' },
  { tema: 'Cómo uso Claude, GPT-4 y agentes autónomos para generar contenido, reportes y dashboards sin intervención humana', tag: 'IA' },
  { tema: 'El blog que se escribe solo: cómo automaticé 4 agentes que publican 15 artículos por semana', tag: 'IA' },
  { tema: 'IA generativa en marketing digital: lo que realmente funciona y lo que es puro humo', tag: 'IA' },
  { tema: 'Por qué una agencia de 5 personas con IA le gana a una de 30 sin ella', tag: 'IA' },
  { tema: 'Los agentes de IA que monitorean competencia, generan grillas y envían reportes mientras duermo', tag: 'IA' },
  { tema: 'Cómo entrené una IA para que escriba como yo y por qué decidí que no debía hacerlo', tag: 'IA' },
  { tema: 'De copiar prompts a construir pipelines: la curva de aprendizaje real de la IA en una agencia', tag: 'IA' },

  // Dashboards y datos en tiempo real
  { tema: 'Por qué cada cliente nuestro tiene un dashboard en tiempo real y cómo eso cambió todo', tag: 'Datos' },
  { tema: 'El dashboard que le mostré a un cliente y que hizo que duplicara su inversión al día siguiente', tag: 'Datos' },
  { tema: 'Qué medir y qué no: la diferencia entre datos que sirven y métricas de vanidad', tag: 'Datos' },
  { tema: 'Construí un sistema de alertas automáticas con Google Sheets y Vercel: así funciona', tag: 'Datos' },
  { tema: 'La reunión mensual de resultados murió: cómo los dashboards live la reemplazaron', tag: 'Datos' },
  { tema: 'Cuando el dashboard te muestra que la campaña no funciona: la conversación difícil con el cliente', tag: 'Datos' },

  // Casos reales — lo bueno y lo malo
  { tema: 'El cliente que gastó $50 millones en Meta Ads y no vendió nada: qué salió mal', tag: 'Casos' },
  { tema: 'Cómo llevamos una corredora de propiedades de 0 a 400 leads en 30 días con Meta Ads', tag: 'Casos' },
  { tema: 'El sorteo que vendió $111 millones: qué hicimos diferente y qué haría distinto', tag: 'Casos' },
  { tema: 'La empresa que me pidió "hacerme rico con digital" y lo que le dije', tag: 'Casos' },
  { tema: 'Un cliente que facturaba $2M y hoy factura $15M: lo que hicimos juntos en 2 años', tag: 'Casos' },
  { tema: 'El caso del CPA imposible: cómo bajamos de $12.000 a $890 por lead en La Reina', tag: 'Casos' },
  { tema: 'Cuando las campañas funcionan pero el equipo comercial no cierra: el cuello de botella que nadie quiere ver', tag: 'Casos' },
  { tema: 'La campaña que funcionaba por un error de segmentación: la suerte no es estrategia', tag: 'Casos' },

  // La ilusión del digital — desmitificar
  { tema: 'No, el marketing digital no te va a hacer rico: las expectativas vs la realidad en Chile', tag: 'Realidad' },
  { tema: 'Tener una agencia no es magia: la diferencia entre invertir bien e invertir por invertir', tag: 'Realidad' },
  { tema: 'El cliente que quería ROAS 10x con $500.000 de inversión: por qué los números no mienten', tag: 'Realidad' },
  { tema: 'Por qué la mayoría de las campañas digitales en Chile fracasan y nadie habla de eso', tag: 'Realidad' },
  { tema: '"Mi sobrino sabe de redes sociales": las consecuencias de no tomar en serio el marketing digital', tag: 'Realidad' },

  // Equipos de alto rendimiento
  { tema: 'Formar un equipo de marketing digital de alto rendimiento es casi imposible: así lo intenté', tag: 'Equipos' },
  { tema: 'Por qué es tan difícil encontrar talento en marketing digital en Chile y qué estoy haciendo al respecto', tag: 'Equipos' },
  { tema: 'La rotación en agencias digitales es brutal: cómo la IA me ayudó a depender menos de las personas', tag: 'Equipos' },
  { tema: 'El día que decidí que mi equipo serían 5 personas y 20 agentes de IA', tag: 'Equipos' },
  { tema: 'Lo que busco cuando contrato a alguien para la agencia: no es lo que la mayoría piensa', tag: 'Equipos' },

  // Herramientas propias y filosofía técnica
  { tema: 'Por qué construimos nuestras propias herramientas en vez de pagar por SaaS', tag: 'Herramientas' },
  { tema: 'El CRM que le hicimos a cada cliente: por qué un Supabase propio le gana a HubSpot para PYMEs', tag: 'Herramientas' },
  { tema: 'Cómo construí un sistema de prospección automática con Apify, Supabase y Resend', tag: 'Herramientas' },
  { tema: 'Del Excel al dashboard inteligente: la evolución de cómo reportamos a nuestros clientes', tag: 'Herramientas' },

  // Estrategia y visión de negocio
  { tema: 'Cómo decidir entre invertir más en Google o en Meta: el framework que uso con cada cliente', tag: 'Estrategia' },
  { tema: 'La obsesión con el CPL está matando las campañas: lo que realmente importa medir', tag: 'Estrategia' },
  { tema: 'Las agencias que sobrevivan los próximos 3 años van a ser muy distintas a las de hoy', tag: 'Estrategia' },
  { tema: 'Lo que le diría a alguien que está partiendo una agencia de marketing digital hoy en Chile', tag: 'Estrategia' },
  { tema: 'El modelo de agencia cambió: de vender horas a vender resultados y herramientas', tag: 'Estrategia' },
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

QUIÉN ERES (usa esto como contexto, no lo copies textual):
- Diriges una agencia boutique en Chile con ~35 clientes activos
- Construiste 12+ agentes de IA que automatizan contenido, reportes, monitoreo de competencia, grillas de contenido y dashboards
- Cada cliente tiene un dashboard en tiempo real (construido con Vercel, Supabase, Google Sheets)
- Manejas campañas de Meta Ads, Google Ads y LinkedIn Ads. Ves los datos todos los días
- Has trabajado con inmobiliarias, clínicas, e-commerce, SaaS, sorteos online, educación, transporte
- Tu equipo es chico (5 personas) pero la IA multiplica la capacidad. Tienes agentes que publican 15 artículos/semana, monitorean competencia, generan informes automáticos
- Has visto clientes crecer de $2M a $15M y también clientes que quemaron presupuesto sin entender qué hacían
- Crees que el dato manda: si no se mide, no existe. Pero también que no todo se puede medir
- Has construido herramientas propias: CRM, sistema de alertas de leads, benchmarks competitivos, paneles de inversión, SEO automatizado con agentes
- Usas Claude Code, GPT-4, Apify, Supabase, Vercel, GitHub Actions como stack diario

VOZ Y TONO:
- PRIMERA PERSONA siempre. Tú eres Christopher, hablas desde la experiencia
- Tono: directo, crudo, sin filtro. Como si estuvieras en un asado contándole a un amigo empresario
- Cuenta CASOS REALES (anónimos si es necesario). Lo bueno Y lo malo. Errores propios también
- Sé polémico. Opina con convicción. No seas tibio
- Usa números concretos cuando puedas (CPC $120, CPL $3.500, ROAS 2.3x, inversión $800K/mes)
- NO uses frases de ChatGPT genérico ("en el vertiginoso mundo", "sin lugar a dudas", "en la era digital")
- Escribe como hablas. Frases cortas. Párrafos cortos. Golpes directos

ESTRUCTURA HTML (clases Tailwind):
- Dentro de <div class="prose prose-lg max-w-none">
- H2: <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">
- H3: <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">
- Párrafos: <p class="text-gray-700 mb-4">
- Listas: <ul class="space-y-3 text-gray-700 mb-8"> con <li class="flex items-start gap-3"><span class="text-blue-600 font-bold">•</span><span>...</span></li>
- Callout opinión fuerte: <div class="bg-gray-900 text-white p-6 rounded-xl mb-8"><p class="text-gray-100 font-medium italic text-lg">"Frase destacada"</p></div>
- Callout dato: <div class="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8"><p class="text-gray-700">...</p></div>

CONTENIDO:
- Mínimo 1800 palabras
- Al menos 5 H2
- Arranca con un gancho brutal — algo que pasó, un error, una verdad incómoda
- Mínimo 2 anécdotas o casos reales (pueden ser anónimos: "un cliente del rubro inmobiliario", "una clínica en zona oriente")
- Incluye datos duros: CPC, CPL, ROAS, inversión mensual, cantidad de leads, % de conversión
- Si hablas de IA, menciona herramientas específicas (Claude, GPT-4, Apify, GitHub Actions, Supabase)
- Si hablas de dashboards, describe qué muestran y por qué importan
- Cierra con tu opinión clara y sin disculpas
- NO incluyas CTA comercial. Esto es thought leadership puro

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
