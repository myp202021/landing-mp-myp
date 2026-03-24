/**
 * Generador automático de artículos para el blog de M&P
 * Corre diario via GitHub Actions
 * Genera contenido con OpenAI → guarda en Supabase → el sitio lo muestra
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// Temas organizados por categoría — se rotan automáticamente
const TEMAS = [
  // Google Ads
  { categoria: 'Google Ads', tag: 'Google Ads', tema: 'Cómo reducir el CPC en Google Ads en Chile: técnicas avanzadas de Quality Score y estructura de campañas' },
  { categoria: 'Google Ads', tag: 'Google Ads', tema: 'Google Ads para empresas B2B en Chile: estrategia de keywords, landing pages y ciclos de venta largos' },
  { categoria: 'Google Ads', tag: 'Google Ads', tema: 'Remarketing en Google Ads: cómo reimpactar visitantes sin quemar presupuesto' },
  { categoria: 'Google Ads', tag: 'Google Ads', tema: 'Performance Max vs Search: cuándo usar cada tipo de campaña en Google Ads Chile' },
  { categoria: 'Google Ads', tag: 'Google Ads', tema: 'Extensiones de anuncios en Google Ads: cuáles usar y cómo impactan el CTR en Chile' },

  // Meta Ads
  { categoria: 'Meta Ads', tag: 'Meta Ads', tema: 'Estrategias de Meta Ads para e-commerce en Chile: catálogos, retargeting y ROAS' },
  { categoria: 'Meta Ads', tag: 'Meta Ads', tema: 'Cómo segmentar audiencias en Meta Ads sin depender de intereses: lookalike y custom audiences' },
  { categoria: 'Meta Ads', tag: 'Meta Ads', tema: 'Instagram Ads vs Facebook Ads: dónde invertir según tu industria en Chile 2026' },
  { categoria: 'Meta Ads', tag: 'Meta Ads', tema: 'Creatividades que convierten en Meta Ads: formatos, copy y testing para Chile' },
  { categoria: 'Meta Ads', tag: 'Meta Ads', tema: 'Cómo optimizar el CPL en Meta Ads: formularios nativos vs landing pages en Chile' },

  // Performance Marketing
  { categoria: 'Performance', tag: 'Performance', tema: 'Qué es el performance marketing y por qué es diferente al marketing digital tradicional' },
  { categoria: 'Performance', tag: 'Performance', tema: 'Cómo medir el verdadero ROI de tus campañas digitales en Chile: más allá del ROAS' },
  { categoria: 'Performance', tag: 'Performance', tema: 'Modelos de atribución en Chile: last click vs data-driven y cómo elegir el correcto' },
  { categoria: 'Performance', tag: 'Performance', tema: 'Cuánto debería invertir una PYME chilena en publicidad digital: guía por industria' },
  { categoria: 'Performance', tag: 'Performance', tema: 'KPIs que importan en performance marketing: CAC, LTV, ROAS y payback period' },

  // LinkedIn Ads
  { categoria: 'LinkedIn Ads', tag: 'B2B', tema: 'LinkedIn Ads para generación de leads B2B en Chile: segmentación, costos y formatos que funcionan' },
  { categoria: 'LinkedIn Ads', tag: 'B2B', tema: 'Thought Leader Ads en LinkedIn: cómo amplificar el perfil del CEO para generar leads B2B' },

  // Industrias
  { categoria: 'Industrias', tag: 'SaaS', tema: 'Marketing digital para SaaS en Chile: del trial al cliente pagado con campañas de performance' },
  { categoria: 'Industrias', tag: 'Inmobiliario', tema: 'Campañas digitales para inmobiliarias en Chile: Google, Meta y portales como canal de leads' },
  { categoria: 'Industrias', tag: 'Educación', tema: 'Marketing digital para instituciones educativas en Chile: captación de alumnos con performance' },
  { categoria: 'Industrias', tag: 'Salud', tema: 'Publicidad digital para clínicas y centros médicos en Chile: regulaciones y estrategias que funcionan' },
  { categoria: 'Industrias', tag: 'E-commerce', tema: 'Estrategias de paid media para e-commerce en Chile: ROAS, catálogos y estacionalidad' },
  { categoria: 'Industrias', tag: 'Servicios', tema: 'Marketing digital para empresas de servicios profesionales en Chile: abogados, contadores, consultoras' },

  // SEO & Contenido
  { categoria: 'SEO', tag: 'SEO', tema: 'SEO para empresas chilenas: cómo aparecer en Google sin pagar ads y complementar con paid' },
  { categoria: 'SEO', tag: 'SEO', tema: 'Cómo escribir contenido que rankea en Google Chile: estructura, keywords y E-E-A-T' },

  // Automatización & IA
  { categoria: 'Automatización', tag: 'IA', tema: 'Cómo usar IA en campañas de Google Ads y Meta Ads: automatización con datos reales' },
  { categoria: 'Automatización', tag: 'IA', tema: 'ChatGPT y marketing digital: casos de uso reales para agencias y empresas en Chile' },
  { categoria: 'Automatización', tag: 'IA', tema: 'Automatización de reportes de marketing: dashboards en tiempo real para clientes' },

  // Estrategia
  { categoria: 'Estrategia', tag: 'Estrategia', tema: 'Cómo elegir una agencia de marketing digital en Chile: señales de alerta y qué preguntar' },
  { categoria: 'Estrategia', tag: 'Estrategia', tema: 'Presupuesto de marketing digital: cómo distribuir entre Google, Meta, LinkedIn y SEO' },
  { categoria: 'Estrategia', tag: 'Estrategia', tema: 'Landing pages que convierten: anatomía de una landing de alto rendimiento en Chile' },
  { categoria: 'Estrategia', tag: 'Estrategia', tema: 'Errores que matan las campañas digitales: los 10 más comunes en empresas chilenas' },
  { categoria: 'Estrategia', tag: 'Estrategia', tema: 'De leads a clientes: cómo cerrar la brecha entre marketing y ventas en Chile' },
]

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

async function elegirTema() {
  // Obtener slugs ya publicados
  const { data: existentes } = await supabase
    .from('blog_posts')
    .select('slug')

  const slugsExistentes = new Set((existentes || []).map(p => p.slug))

  // Filtrar temas no usados
  const disponibles = TEMAS.filter(t => !slugsExistentes.has(slugify(t.tema)))

  if (disponibles.length === 0) {
    console.log('⚠️ Todos los temas ya fueron publicados. Saliendo.')
    process.exit(0)
  }

  // Elegir uno aleatorio
  return disponibles[Math.floor(Math.random() * disponibles.length)]
}

async function generarArticulo(tema) {
  const hoy = new Date().toISOString().split('T')[0]
  const slug = slugify(tema.tema)

  console.log(`📝 Generando artículo: ${tema.tema}`)

  const prompt = `Eres un experto en marketing digital y performance marketing en Chile. Escribe un artículo completo para el blog de Muller y Pérez (www.mulleryperez.cl), una agencia de performance marketing chilena.

TEMA: ${tema.tema}
CATEGORÍA: ${tema.categoria}
FECHA: ${hoy}

INSTRUCCIONES ESTRICTAS:

1. ESTRUCTURA HTML (usa estas clases exactas de Tailwind):
- El artículo debe estar dentro de <div class="prose prose-lg max-w-none">
- H2: <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">
- H3: <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">
- Párrafos: <p class="text-gray-700 mb-4">
- Listas: <ul class="space-y-3 text-gray-700 mb-8"> con <li class="flex items-start gap-3"><span class="text-blue-600 font-bold">•</span><span>...</span></li>
- Callout importante: <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8"><h3 class="text-xl font-bold text-gray-900 mb-4">Título</h3><p class="text-gray-700">...</p></div>
- Callout dato: <div class="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8"><p class="text-gray-700">...</p></div>
- Callout advertencia: <div class="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-xl mb-8"><p class="text-gray-700">...</p></div>

2. CONTENIDO:
- Mínimo 2000 palabras
- Al menos 5 H2 y varios H3
- Datos reales o benchmarks de Chile cuando sea posible (CPC, CPL, ROAS por industria)
- Tono profesional pero directo, sin relleno
- Mencionar a Muller y Pérez naturalmente 1-2 veces como referencia, sin ser spam
- Incluir ejemplos prácticos aplicables a empresas chilenas
- Terminar con una sección de conclusión y un CTA sutil hacia M&P

3. NO incluir:
- El H1 (se genera aparte)
- Header ni footer
- Imágenes
- Metadata (se genera aparte)
- La palabra "artículo" ni meta-referencias al texto

RESPONDE SOLO CON EL HTML DEL CONTENIDO (desde el primer <div class="prose..."> hasta el cierre </div>). Nada más.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
      temperature: 0.7
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error: ${res.status} — ${err}`)
  }

  const data = await res.json()
  const contenidoHtml = data.choices[0].message.content

  // Generar metadata
  const metaPrompt = `Para este artículo de blog de marketing digital en Chile:
TÍTULO: ${tema.tema}
CATEGORÍA: ${tema.categoria}

Genera un JSON con estos campos exactos (solo el JSON, nada más):
{
  "title": "título SEO optimizado (max 60 chars)",
  "description": "meta description SEO (max 155 chars, con keyword principal)",
  "keywords": "5-8 keywords separadas por coma, relevantes para Chile",
  "excerpt": "resumen de 1-2 frases para la tarjeta del blog (max 200 chars)",
  "readTime": "X min"
}`

  const metaRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: metaPrompt }],
      max_tokens: 500,
      temperature: 0.3
    })
  })

  const metaData = await metaRes.json()
  let meta
  try {
    const raw = metaData.choices[0].message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    meta = JSON.parse(raw)
  } catch (e) {
    console.log('⚠️ Error parseando metadata, usando defaults')
    meta = {
      title: tema.tema.substring(0, 60),
      description: tema.tema.substring(0, 155),
      keywords: tema.categoria.toLowerCase() + ', marketing digital chile, performance marketing',
      excerpt: tema.tema.substring(0, 200),
      readTime: '12 min'
    }
  }

  return {
    slug,
    title: tema.tema,
    seo_title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    excerpt: meta.excerpt,
    category: tema.categoria,
    tag: tema.tag,
    read_time: meta.readTime,
    content_html: contenidoHtml,
    date_published: hoy,
    author: 'Christopher Müller'
  }
}

async function guardarEnSupabase(articulo) {
  console.log(`💾 Guardando en Supabase: ${articulo.slug}`)

  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(articulo, { onConflict: 'slug' })
    .select()

  if (error) throw new Error(`Supabase error: ${error.message}`)
  console.log(`✅ Guardado: ${articulo.slug}`)
  return data
}

async function main() {
  console.log('🚀 Generador de blog M&P')
  console.log('========================')

  // Verificar que la tabla existe, si no crearla
  const { error: tableCheck } = await supabase.from('blog_posts').select('id').limit(1)
  if (tableCheck && tableCheck.message && tableCheck.message.includes('does not exist')) {
    console.log('📦 Tabla blog_posts no existe. Hay que crearla en Supabase.')
    console.log('Ejecuta este SQL en Supabase Dashboard → SQL Editor:')
    console.log(`
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  seo_title TEXT,
  description TEXT,
  keywords TEXT,
  excerpt TEXT,
  category TEXT,
  tag TEXT,
  read_time TEXT,
  content_html TEXT NOT NULL,
  date_published DATE NOT NULL DEFAULT CURRENT_DATE,
  author TEXT DEFAULT 'Christopher Müller',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_date ON blog_posts(date_published DESC);

-- Permitir lectura pública (para el frontend)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Service role can manage blog posts" ON blog_posts FOR ALL USING (true);
    `)
    process.exit(1)
  }

  const tema = await elegirTema()
  const articulo = await generarArticulo(tema)
  await guardarEnSupabase(articulo)

  console.log('')
  console.log(`📰 Artículo publicado: ${articulo.title}`)
  console.log(`🔗 URL: https://www.mulleryperez.cl/blog/${articulo.slug}`)
  console.log(`📂 Categoría: ${articulo.category}`)
  console.log(`⏱️  Lectura: ${articulo.read_time}`)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
