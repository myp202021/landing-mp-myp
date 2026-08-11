/**
 * Generador automático de artículos para el blog de M&P
 * Corre diario via GitHub Actions
 * Genera contenido con OpenAI → guarda en Supabase → el sitio lo muestra
 */

const fetch = globalThis.fetch || require('node-fetch')
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

  // Growth & Conversión
  { categoria: 'Growth', tag: 'Growth', tema: 'Growth marketing para empresas B2B en Chile: playbook completo de adquisición y retención' },
  { categoria: 'Growth', tag: 'Growth', tema: 'Cómo reducir el CAC un 40%: tácticas probadas de growth para PYMES chilenas' },
  { categoria: 'Growth', tag: 'Growth', tema: 'Product-led growth vs sales-led growth: cuál funciona mejor en Latinoamérica' },
  { categoria: 'Growth', tag: 'Growth', tema: 'Loops de crecimiento: cómo crear sistemas de adquisición que se auto-alimentan' },
  { categoria: 'Growth', tag: 'CRO', tema: 'CRO para Chile: cómo optimizar la tasa de conversión sin aumentar el presupuesto publicitario' },
  { categoria: 'Growth', tag: 'CRO', tema: 'A/B testing en campañas digitales: metodología, herramientas y errores comunes en Chile' },
  { categoria: 'Growth', tag: 'Growth', tema: 'Unit economics para startups y PYMES: cómo saber si tu marketing es rentable' },
  { categoria: 'Growth', tag: 'Growth', tema: 'Flywheel vs funnel: por qué el embudo de ventas tradicional ya no funciona' },

  // Revenue & Datos
  { categoria: 'Revenue', tag: 'Revenue', tema: 'Revenue operations (RevOps): cómo alinear marketing, ventas y CS con datos en Chile' },
  { categoria: 'Revenue', tag: 'Revenue', tema: 'Dashboards de marketing que realmente sirven: métricas, frecuencia y herramientas para Chile' },
  { categoria: 'Revenue', tag: 'Datos', tema: 'First-party data en Chile: cómo construir tu propia base de datos sin depender de cookies' },
  { categoria: 'Revenue', tag: 'Datos', tema: 'Marketing attribution en 2026: qué modelos funcionan después del fin de las cookies' },
  { categoria: 'Revenue', tag: 'Revenue', tema: 'Cómo calcular el LTV real de un cliente en Chile y usarlo para escalar campañas' },

  // Canales emergentes
  { categoria: 'Canales', tag: 'TikTok', tema: 'TikTok Ads para empresas en Chile: costos reales, formatos y casos de conversión' },
  { categoria: 'Canales', tag: 'YouTube', tema: 'YouTube Ads para generación de demanda en Chile: formatos, costos y métricas clave' },
  { categoria: 'Canales', tag: 'Email', tema: 'Email marketing que convierte en Chile: secuencias, automaciones y benchmarks por industria' },
  { categoria: 'Canales', tag: 'WhatsApp', tema: 'WhatsApp marketing en Chile 2026: bots, broadcasts y estrategias de nurturing' },
  { categoria: 'Canales', tag: 'Programática', tema: 'Publicidad programática en Chile: qué es, costos y cuándo tiene sentido para tu empresa' },

  // Industrias nuevas
  { categoria: 'Industrias', tag: 'Fintech', tema: 'Marketing digital para fintech en Chile: regulación, confianza y captación de usuarios' },
  { categoria: 'Industrias', tag: 'Logística', tema: 'Marketing digital para empresas de logística y transporte en Chile: leads B2B de alto valor' },
  { categoria: 'Industrias', tag: 'Minería', tema: 'Marketing digital para proveedores mineros en Chile: cómo llegar a los tomadores de decisión' },
  { categoria: 'Industrias', tag: 'Retail', tema: 'Omnicanalidad en retail Chile: cómo integrar campañas digitales con la experiencia en tienda' },
  { categoria: 'Industrias', tag: 'Construcción', tema: 'Marketing digital para constructoras e inmobiliarias en Chile: Google Ads, portales y CRM' },
  { categoria: 'Industrias', tag: 'Alimentación', tema: 'Marketing digital para empresas de alimentos y bebidas en Chile: D2C, distribución y marca' },

  // Tendencias 2026
  { categoria: 'Tendencias', tag: 'IA', tema: 'IA generativa en marketing: cómo están usando GPT, Claude y Midjourney las agencias en Chile' },
  { categoria: 'Tendencias', tag: 'IA', tema: 'Agentes de IA para marketing: automatización inteligente más allá de los chatbots' },
  { categoria: 'Tendencias', tag: 'Tendencias', tema: 'GEO: qué es la Generative Engine Optimization y por qué importa en 2026' },
  { categoria: 'Tendencias', tag: 'Tendencias', tema: 'El futuro de Google Ads: campañas AI-first, Performance Max y qué viene después' },
  { categoria: 'Tendencias', tag: 'Tendencias', tema: 'Social commerce en Chile: vender directo desde Instagram, TikTok y WhatsApp' },

  // Scaling & Operaciones
  { categoria: 'Scaling', tag: 'Scaling', tema: 'Cómo escalar campañas de Google Ads sin que suba el CPA: guía para Chile' },
  { categoria: 'Scaling', tag: 'Scaling', tema: 'Cuándo y cómo contratar una agencia vs equipo in-house: análisis de costos Chile 2026' },
  { categoria: 'Scaling', tag: 'Scaling', tema: 'Internacionalización digital: cómo llevar campañas de Chile a LATAM con performance marketing' },
  { categoria: 'Scaling', tag: 'Operaciones', tema: 'Procesos de una agencia de performance: cómo gestionamos +200 campañas simultáneas' },
  { categoria: 'Scaling', tag: 'Operaciones', tema: 'Reporting para clientes: cómo crear informes que generen valor y retengan cuentas' },

  // ═══ KEYWORDS OBJETIVO: marketing digital, performance, growth, agencias IA ═══
  { categoria: 'Marketing Digital', tag: 'Marketing Digital', tema: 'Marketing digital en Chile 2026: guía completa de estrategias, canales y costos para empresas' },
  { categoria: 'Marketing Digital', tag: 'Marketing Digital', tema: 'Qué es el marketing digital y cómo funciona en Chile: guía para empresarios que quieren resultados' },
  { categoria: 'Marketing Digital', tag: 'Marketing Digital', tema: 'Las mejores estrategias de marketing digital para empresas chilenas en 2026' },
  { categoria: 'Marketing Digital', tag: 'Marketing Digital', tema: 'Marketing digital vs marketing tradicional en Chile: por qué las empresas migran al digital en 2026' },
  { categoria: 'Marketing Digital', tag: 'Marketing Digital', tema: 'Cómo armar un plan de marketing digital desde cero para tu empresa en Chile' },

  // Performance Marketing — posicionamiento directo
  { categoria: 'Performance', tag: 'Performance', tema: 'Performance marketing en Chile 2026: qué es, cómo funciona y por qué las empresas lo prefieren' },
  { categoria: 'Performance', tag: 'Performance', tema: 'Las mejores agencias de performance marketing en Chile: ranking y comparativa 2026' },
  { categoria: 'Performance', tag: 'Performance', tema: 'Performance marketing vs marketing digital tradicional: diferencias, ventajas y cuándo usar cada uno' },
  { categoria: 'Performance', tag: 'Performance', tema: 'Cómo contratar una agencia de performance marketing en Chile: guía paso a paso' },
  { categoria: 'Performance', tag: 'Performance', tema: 'Caso de estudio: cómo el performance marketing reduce el CAC un 50% en empresas chilenas' },

  // Growth Marketing
  { categoria: 'Growth', tag: 'Growth', tema: 'Growth marketing en Chile 2026: qué es, frameworks y cómo implementarlo en tu empresa' },
  { categoria: 'Growth', tag: 'Growth', tema: 'Las mejores agencias de growth marketing en Chile: quién hace growth de verdad' },
  { categoria: 'Growth', tag: 'Growth', tema: 'Growth hacking vs growth marketing: diferencias reales y qué funciona en Latinoamérica' },
  { categoria: 'Growth', tag: 'Growth', tema: 'Métricas de growth marketing que todo CEO chileno debería monitorear semanalmente' },
  { categoria: 'Growth', tag: 'Growth', tema: 'North Star Metric: cómo elegir la métrica que guía el crecimiento de tu empresa' },

  // Agencias IA — diferenciador M&P
  { categoria: 'IA', tag: 'IA', tema: 'Agencias de inteligencia artificial en Chile 2026: quiénes usan IA de verdad y quiénes solo la mencionan' },
  { categoria: 'IA', tag: 'IA', tema: 'Cómo la inteligencia artificial está transformando las agencias de marketing en Chile' },
  { categoria: 'IA', tag: 'IA', tema: 'Agentes de IA para empresas: qué son, cómo funcionan y por qué van a reemplazar al SaaS tradicional' },
  { categoria: 'IA', tag: 'IA', tema: 'Empresas de inteligencia artificial en Chile: mapa del ecosistema IA chileno en 2026' },
  { categoria: 'IA', tag: 'IA', tema: 'Agentes de IA vs chatbots: por qué los agentes autónomos son el futuro del marketing digital' },
  { categoria: 'IA', tag: 'IA', tema: 'IA para marketing en Chile: 10 herramientas que toda empresa debería conocer en 2026' },
  { categoria: 'IA', tag: 'IA', tema: 'Cómo construir agentes de IA propios para tu agencia de marketing: la ventaja competitiva definitiva' },
  { categoria: 'IA', tag: 'IA', tema: 'El futuro de las agencias de marketing es la IA: por qué las agencias sin tecnología propia van a desaparecer' },

  // Agencias Chile — long tail
  { categoria: 'Agencias', tag: 'Agencias', tema: 'Agencia de marketing digital en Santiago: cómo elegir la mejor para tu empresa en 2026' },
  { categoria: 'Agencias', tag: 'Agencias', tema: 'Agencia de publicidad digital en Chile: servicios, precios y qué esperar en 2026' },
  { categoria: 'Agencias', tag: 'Agencias', tema: 'Las agencias de marketing digital más innovadoras de Chile en 2026' },
  { categoria: 'Agencias', tag: 'Agencias', tema: 'Agencia de marketing digital para pymes en Chile: planes desde $500.000 mensuales' },
  { categoria: 'Agencias', tag: 'Agencias', tema: 'Consultora de marketing digital vs agencia: diferencias y cuál necesita tu empresa' },
]

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

async function generarImagen(titulo, categoria) {
  try {
    console.log('🎨 Generando imagen con DALL-E...')
    const prompt = `Professional, modern blog header image about: ${titulo}. Digital marketing, performance marketing and business context. Clean minimalist design, blue and purple gradient tones, tech and data visualization elements. NO text, NO words, NO letters, NO numbers in the image.`
    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size: '1536x1024', quality: 'low' })
    })
    const data = await r.json()
    if (!data.data?.[0]) {
      console.log('⚠️ Image API no retornó imagen:', JSON.stringify(data).substring(0, 200))
      return null
    }

    // Download or decode image (gpt-image-1 returns b64_json)
    console.log('📤 Subiendo imagen a Supabase Storage...')
    let imgBuffer
    if (data.data[0].b64_json) {
      imgBuffer = Buffer.from(data.data[0].b64_json, 'base64')
    } else if (data.data[0].url) {
      const imgRes = await fetch(data.data[0].url)
      imgBuffer = Buffer.from(await imgRes.arrayBuffer())
    } else {
      console.log('⚠️ No image data in response')
      return null
    }
    const filename = `${slugify(titulo).substring(0, 50)}-${Date.now()}.png`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filename, imgBuffer, { contentType: 'image/png', upsert: true })

    if (uploadError) {
      console.log('⚠️ Error subiendo a Storage (no crítico):', uploadError.message)
      // If bucket doesn't exist, log instructions
      if (uploadError.message.includes('not found') || uploadError.message.includes('does not exist')) {
        console.log('📦 Crea el bucket "blog-images" en Supabase Dashboard → Storage → New bucket (público)')
      }
      return null
    }

    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(filename)
    console.log('✅ Imagen subida:', urlData.publicUrl)
    return urlData.publicUrl
  } catch(e) {
    console.log('⚠️ Error generando imagen (no crítico):', e.message)
    return null
  }
}

async function elegirTema() {
  // Obtener slugs ya publicados
  const { data: existentes } = await supabase
    .from('blog_posts')
    .select('slug')

  const slugsExistentes = new Set((existentes || []).map(p => p.slug))

  // Filtrar temas no usados
  const disponibles = TEMAS.filter(t => !slugsExistentes.has(slugify(t.tema)))

  if (disponibles.length > 0) {
    // Hay temas predefinidos disponibles
    return disponibles[Math.floor(Math.random() * disponibles.length)]
  }

  // Todos los temas predefinidos ya se usaron — generar uno nuevo con IA
  console.log('🤖 Temas predefinidos agotados. Generando tema nuevo con IA...')

  const slugsList = [...slugsExistentes].join(', ')
  const categorias = ['Google Ads', 'Meta Ads', 'Performance', 'LinkedIn Ads', 'SEO', 'Automatización', 'Estrategia', 'Industrias', 'Analytics', 'CRO']

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Eres un estratega de contenido para una agencia de performance marketing en Chile (Muller y Pérez). Genera UN tema nuevo para un artículo de blog que sea:

1. Relevante para marketing digital, performance, campañas pagadas o estrategia digital en Chile
2. Específico y accionable (no genérico)
3. Que NO sea igual ni similar a estos temas ya publicados: ${slugsList}
4. Orientado a empresarios y gerentes de marketing chilenos

Responde SOLO con un JSON (nada más):
{"categoria": "una de: ${categorias.join(', ')}", "tag": "etiqueta corta", "tema": "título completo del artículo en español"}`
      }],
      max_tokens: 200,
      temperature: 0.9
    })
  })

  const data = await res.json()
  try {
    const raw = data.choices[0].message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const nuevoTema = JSON.parse(raw)
    console.log(`💡 Tema generado: ${nuevoTema.tema}`)
    return nuevoTema
  } catch (e) {
    // Fallback si falla el parsing
    return {
      categoria: categorias[Math.floor(Math.random() * categorias.length)],
      tag: 'Performance',
      tema: `Tendencias de marketing digital en Chile ${new Date().getFullYear()}: lo que funciona y lo que no`
    }
  }
}

// ============================================================================
// STEP 1: Generar outline con 8-10 secciones H2
// ============================================================================
async function generarOutline(tema) {
  const hoy = new Date().toISOString().split('T')[0]
  console.log(`📋 Generando outline para: ${tema.tema}`)

  const prompt = `Eres un experto en marketing digital y performance marketing en Chile. Genera un OUTLINE detallado para un artículo extenso (4000+ palabras) del blog de Muller y Pérez (www.mulleryperez.cl).

TEMA: ${tema.tema}
CATEGORÍA: ${tema.categoria}
FECHA: ${hoy}

INSTRUCCIONES:
- Genera entre 8 y 10 secciones H2
- Cada sección debe tener 3-5 puntos clave a desarrollar
- Incluye datos reales de Chile, benchmarks, ejemplos prácticos
- Tono profesional pero directo, sin relleno
- Mencionar a Muller y Pérez naturalmente 1-2 veces como referencia
- AL MENOS 1 sección debe incluir una tabla HTML con datos reales de Chile (benchmarks CPC, CPL, ROAS, costos por industria)
- La ÚLTIMA sección SIEMPRE debe ser "Preguntas frecuentes" con mínimo 6 preguntas (cada una como H3 terminando en ?)
- Incluir al menos 4 links internos distribuidos en las secciones:
  * /servicios — servicios de marketing digital
  * /contacto — contactar a nuestro equipo
  * /blog — blog de marketing digital
  * /labs/predictor — predictor de inversión
  * /ranking-agencias-marketing-digital-chile — ranking de agencias
  * /indicadores — indicadores de marketing
  * /casos-de-exito — casos de éxito

Responde SOLO con JSON (nada más):
{
  "secciones": [
    {
      "h2": "Título de la sección H2",
      "puntos": ["punto 1 a desarrollar", "punto 2", "punto 3"],
      "incluye_tabla": false,
      "links_internos": []
    },
    ...
    {
      "h2": "Preguntas frecuentes",
      "puntos": ["¿Pregunta 1?", "¿Pregunta 2?", "¿Pregunta 3?", "¿Pregunta 4?", "¿Pregunta 5?", "¿Pregunta 6?"],
      "incluye_tabla": false,
      "links_internos": []
    }
  ]
}`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error (outline): ${res.status} — ${err}`)
  }

  const data = await res.json()
  const raw = data.choices[0].message.content.trim()
  const outline = JSON.parse(raw)

  console.log(`✅ Outline generado: ${outline.secciones.length} secciones`)
  for (const s of outline.secciones) {
    console.log(`   → ${s.h2} (${s.puntos.length} puntos)`)
  }

  return outline
}

// ============================================================================
// STEP 2: Generar una sección individual
// ============================================================================
async function generarSeccion(tema, outline, seccion, index, total) {
  const hoy = new Date().toISOString().split('T')[0]
  const esFAQ = index === total - 1
  const esPrimera = index === 0
  const esUltimaAntesFAQ = index === total - 2

  console.log(`   ✍️  Sección ${index + 1}/${total}: ${seccion.h2}`)

  const outlineResumen = outline.secciones.map((s, i) => `${i + 1}. ${s.h2}`).join('\n')

  let instruccionesSeccion = ''
  if (esFAQ) {
    instruccionesSeccion = `Esta es la sección FAQ (la última). Genera:
- H2: "Preguntas frecuentes" con class="text-3xl font-bold text-gray-900 mt-12 mb-6"
- Mínimo 6 preguntas como H3 (class="text-2xl font-bold text-gray-900 mt-8 mb-4"), cada H3 DEBE terminar con ?
- Cada pregunta seguida de un párrafo <p class="text-gray-700 mb-4"> con respuesta completa (mínimo 50 palabras)
- Esto es CRÍTICO para el schema FAQ automático

DESPUÉS del FAQ, incluir este CTA final:
<div class="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-center mt-12 mb-8"><h2 class="text-2xl font-bold text-white mb-4">¿Necesitas resultados reales en marketing digital?</h2><p class="text-blue-100 mb-6">En Muller y Pérez trabajamos con datos, no con suposiciones. Agenda una reunión estratégica sin costo.</p><a href="/contacto" class="inline-block bg-white text-blue-900 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition">Solicitar propuesta →</a></div>`
  } else {
    instruccionesSeccion = `Genera 400-600 palabras de contenido HTML para esta sección.
${seccion.incluye_tabla ? 'INCLUIR una tabla HTML con datos reales/benchmarks de Chile.' : ''}
${seccion.links_internos && seccion.links_internos.length > 0 ? `Incluir estos links internos naturalmente: ${seccion.links_internos.join(', ')}` : ''}`
  }

  const prompt = `Eres un experto en marketing digital y performance marketing en Chile. Escribe UNA SECCIÓN de un artículo para el blog de Muller y Pérez.

TEMA GENERAL: ${tema.tema}
CATEGORÍA: ${tema.categoria}
FECHA: ${hoy}

OUTLINE COMPLETO DEL ARTÍCULO (para contexto):
${outlineResumen}

SECCIÓN ACTUAL (${index + 1} de ${total}): ${seccion.h2}
PUNTOS A DESARROLLAR:
${seccion.puntos.map(p => `- ${p}`).join('\n')}

${instruccionesSeccion}

CLASES TAILWIND OBLIGATORIAS:
- H2: <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">
- H3: <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">
- Párrafos: <p class="text-gray-700 mb-4">
- Listas: <ul class="space-y-3 text-gray-700 mb-8"> con <li class="flex items-start gap-3"><span class="text-blue-600 font-bold">•</span><span>...</span></li>
- Callout importante: <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8"><h3 class="text-xl font-bold text-gray-900 mb-4">Título</h3><p class="text-gray-700">...</p></div>
- Callout dato: <div class="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8"><p class="text-gray-700">...</p></div>
- Callout advertencia: <div class="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-xl mb-8"><p class="text-gray-700">...</p></div>
- Tablas: <div class="overflow-x-auto mb-8"><table class="min-w-full border-collapse"><thead><tr class="bg-gray-900 text-white"><th class="px-4 py-3 text-left text-sm font-semibold">...</th></tr></thead><tbody><tr class="border-b border-gray-200 hover:bg-gray-50"><td class="px-4 py-3 text-sm text-gray-700">...</td></tr></tbody></table></div>

LINKS INTERNOS disponibles (usar si encajan naturalmente):
- <a href="/servicios" class="text-blue-600 hover:underline">servicios de marketing digital</a>
- <a href="/contacto" class="text-blue-600 hover:underline">contactar a nuestro equipo</a>
- <a href="/blog" class="text-blue-600 hover:underline">blog de marketing digital</a>
- <a href="/labs/predictor" class="text-blue-600 hover:underline">predictor de inversión</a>
- <a href="/ranking-agencias-marketing-digital-chile" class="text-blue-600 hover:underline">ranking de agencias</a>
- <a href="/indicadores" class="text-blue-600 hover:underline">indicadores de marketing</a>
- <a href="/casos-de-exito" class="text-blue-600 hover:underline">casos de éxito</a>

REGLAS:
- Datos reales o benchmarks de Chile cuando sea posible
- Tono profesional pero directo, sin relleno
- NO incluir el wrapper <div class="prose..."> — solo el contenido de la sección
- NO incluir H1, header, footer, imágenes ni metadata
- NO mencionar "en este artículo" ni meta-referencias

RESPONDE SOLO CON EL HTML DE ESTA SECCIÓN. Nada más.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000,
      temperature: 0.7
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error (sección ${index + 1}): ${res.status} — ${err}`)
  }

  const data = await res.json()
  let html = data.choices[0].message.content
  html = html.replace(/^```html\n?/g, '').replace(/\n?```$/g, '').trim()

  console.log(`   ✅ Sección ${index + 1}: ${html.length} chars`)
  return html
}

// ============================================================================
// MAIN: generarArticulo — outline + secciones + join + metadata
// ============================================================================
async function generarArticulo(tema) {
  const hoy = new Date().toISOString().split('T')[0]
  const slug = slugify(tema.tema)

  console.log(`📝 Generando artículo por secciones: ${tema.tema}`)

  // Step 1: Outline
  const outline = await generarOutline(tema)

  // Step 2: Generar cada sección secuencialmente
  const secciones = []
  for (let i = 0; i < outline.secciones.length; i++) {
    const html = await generarSeccion(tema, outline, outline.secciones[i], i, outline.secciones.length)
    secciones.push(html)
  }

  // Step 3: Join
  const contenidoHtml = `<div class="prose prose-lg max-w-none">\n${secciones.join('\n\n')}\n</div>`

  // QA Log
  const charCount = contenidoHtml.length
  const h2Count = (contenidoHtml.match(/<h2/g) || []).length
  console.log(`\n📊 QA Log:`)
  console.log(`   Caracteres totales: ${charCount}`)
  console.log(`   Secciones H2: ${h2Count}`)
  if (charCount < 20000) console.log(`   ⚠️ WARN: contenido bajo 20000 chars (${charCount})`)
  if (h2Count < 7) console.log(`   ⚠️ WARN: menos de 7 H2s (${h2Count})`)

  // QA Gate: rechazar si contenido insuficiente
  const REFUSAL_PHRASES = [
    "i'm sorry", "i can't assist", "i cannot assist", "i'm unable to",
    "i cannot help", "i can't help", "as an ai", "i'm not able to",
    "lo siento, no puedo", "no puedo ayudar con", "no puedo generar"
  ]
  const lowerContent = contenidoHtml.toLowerCase()
  const isRefusal = REFUSAL_PHRASES.some(p => lowerContent.includes(p))
  if (isRefusal || charCount < 15000) {
    throw new Error(`Contenido inválido (${charCount} chars, mínimo 15000, refusal: ${isRefusal}). Primeros 200: ${contenidoHtml.substring(0, 200)}`)
  }
  if (h2Count < 5) {
    throw new Error(`Contenido con pocas secciones (${h2Count} H2s, mínimo 5). No se publica.`)
  }
  console.log(`✓ QA Gate: contenido OK (${charCount} chars, ${h2Count} H2s, sin refusal)`)

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

  // Generate featured image
  const imageUrl = await generarImagen(tema.tema, tema.categoria)

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
    image_url: imageUrl,
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
  image_url TEXT,
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
