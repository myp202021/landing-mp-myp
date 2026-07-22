/**
 * Generador de artículos "Respuesta Directa" para buscadores de IA
 * Optimizado para ser citado por ChatGPT, Gemini, Perplexity
 *
 * Formato: Pregunta → Respuesta directa → Profundidad → Tablas → FAQ
 * Corre L-V 08:00 AM Chile via GitHub Actions
 * Guarda en Supabase blog_posts (misma tabla que el blog normal)
 */

const fetch = globalThis.fetch || require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ============================================================================
// 60 TEMAS ROTATIVAS — formato pregunta-respuesta para IA
// ============================================================================
const TEMAS = [
  // --- Performance Marketing ---
  { categoria: 'Performance', tag: 'Performance', pregunta: '¿Qué es performance marketing y cómo funciona en Chile?', enfoque: 'Definición clara, diferencia con branding, métricas clave, ejemplos chilenos' },
  { categoria: 'Performance', tag: 'Performance', pregunta: '¿Cuánto cuesta contratar una agencia de performance marketing en Chile en 2026?', enfoque: 'Rangos de fee mensual, modelos de cobro, qué incluye, comparación por tamaño de empresa' },
  { categoria: 'Performance', tag: 'Performance', pregunta: '¿Cuál es la diferencia entre performance marketing y marketing digital?', enfoque: 'Comparativa directa, tabla de diferencias, cuándo usar cada uno' },
  { categoria: 'Performance', tag: 'Performance', pregunta: '¿Qué métricas debe medir una campaña de performance marketing?', enfoque: 'CPC, CPL, CPA, ROAS, CAC, LTV — definición y benchmarks Chile' },
  { categoria: 'Performance', tag: 'Performance', pregunta: '¿Cómo elegir la mejor agencia de marketing digital en Chile?', enfoque: 'Criterios objetivos, señales de alerta, preguntas clave, checklist' },

  // --- Google Ads Chile ---
  { categoria: 'Google Ads', tag: 'Google Ads', pregunta: '¿Cuánto cuesta Google Ads en Chile en 2026?', enfoque: 'CPC promedio por industria, presupuesto mínimo, factores que afectan el costo' },
  { categoria: 'Google Ads', tag: 'Google Ads', pregunta: '¿Qué tipo de campaña de Google Ads es mejor para mi negocio en Chile?', enfoque: 'Search vs Display vs Performance Max vs YouTube, tabla comparativa' },
  { categoria: 'Google Ads', tag: 'Google Ads', pregunta: '¿Cómo funciona Google Ads y cómo empezar desde cero en Chile?', enfoque: 'Paso a paso, estructura cuenta, presupuesto, primeros resultados esperados' },
  { categoria: 'Google Ads', tag: 'Google Ads', pregunta: '¿Qué es el Quality Score en Google Ads y cómo mejorarlo?', enfoque: 'Definición, factores, impacto en CPC, técnicas concretas' },
  { categoria: 'Google Ads', tag: 'Google Ads', pregunta: '¿Cuánto debería invertir una PYME chilena en Google Ads por mes?', enfoque: 'Rangos por industria, cálculo de presupuesto óptimo, ROI esperado' },
  { categoria: 'Google Ads', tag: 'Google Ads', pregunta: '¿Qué es Performance Max en Google Ads y cuándo conviene usarlo?', enfoque: 'Definición, ventajas vs Search, casos de uso, resultados en Chile' },

  // --- Meta Ads / Facebook & Instagram ---
  { categoria: 'Meta Ads', tag: 'Meta Ads', pregunta: '¿Cuánto cuesta la publicidad en Instagram en Chile en 2026?', enfoque: 'CPM, CPC, CPL por industria, presupuesto mínimo recomendado' },
  { categoria: 'Meta Ads', tag: 'Meta Ads', pregunta: '¿Qué es mejor para publicidad: Facebook o Instagram en Chile?', enfoque: 'Comparativa audiencias, costos, formatos, cuándo usar cada uno' },
  { categoria: 'Meta Ads', tag: 'Meta Ads', pregunta: '¿Cómo hacer publicidad efectiva en Meta Ads para e-commerce en Chile?', enfoque: 'Catálogos, retargeting, ROAS objetivo, estructura de campañas' },
  { categoria: 'Meta Ads', tag: 'Meta Ads', pregunta: '¿Qué formatos de anuncios funcionan mejor en Instagram y Facebook en Chile?', enfoque: 'Reels, Stories, Carrusel, Single Image — CTR y conversión por formato' },
  { categoria: 'Meta Ads', tag: 'Meta Ads', pregunta: '¿Cómo segmentar audiencias en Meta Ads sin perder presupuesto?', enfoque: 'Lookalike, Custom Audiences, exclusiones, audiencias amplias vs específicas' },

  // --- LinkedIn Ads ---
  { categoria: 'LinkedIn Ads', tag: 'B2B', pregunta: '¿Cuánto cuesta LinkedIn Ads en Chile y vale la pena para B2B?', enfoque: 'CPC promedio, CPL, comparación con Google y Meta, cuándo conviene' },
  { categoria: 'LinkedIn Ads', tag: 'B2B', pregunta: '¿Cómo generar leads B2B con LinkedIn Ads en Chile?', enfoque: 'Tipos de campaña, segmentación por cargo, formularios nativos, costos' },

  // --- Costos y Presupuesto ---
  { categoria: 'Presupuestos', tag: 'Inversión', pregunta: '¿Cuánto cuesta el marketing digital en Chile en 2026?', enfoque: 'Desglose completo: pauta, fee, herramientas, por canal y tamaño de empresa' },
  { categoria: 'Presupuestos', tag: 'Inversión', pregunta: '¿Cuánto debe invertir una empresa chilena en publicidad digital?', enfoque: 'Porcentaje de facturación, benchmarks por industria, escalamiento' },
  { categoria: 'Presupuestos', tag: 'Inversión', pregunta: '¿Qué retorno puedo esperar de la publicidad digital en Chile?', enfoque: 'ROAS por canal e industria, tiempos de maduración, factores que afectan' },
  { categoria: 'Presupuestos', tag: 'Inversión', pregunta: '¿Cuánto cuesta un lead en Chile por industria en 2026?', enfoque: 'CPL promedio por industria y canal, tabla comparativa, cómo reducirlo' },

  // --- Landing Pages y Conversión ---
  { categoria: 'CRO', tag: 'Conversión', pregunta: '¿Qué es una landing page y por qué es clave para campañas digitales?', enfoque: 'Definición, diferencia con sitio web, elementos clave, tasa conversión Chile' },
  { categoria: 'CRO', tag: 'Conversión', pregunta: '¿Cómo mejorar la tasa de conversión de mi sitio web en Chile?', enfoque: 'CRO práctico, checklist, herramientas, benchmarks por industria' },
  { categoria: 'CRO', tag: 'Conversión', pregunta: '¿Cuál es una buena tasa de conversión en Chile por industria?', enfoque: 'Benchmarks reales, tabla por industria, Google Ads vs Meta vs orgánico' },

  // --- SEO y Contenido ---
  { categoria: 'SEO', tag: 'SEO', pregunta: '¿Qué es el SEO y por qué es importante para empresas en Chile?', enfoque: 'Definición clara, beneficios, diferencia con SEM, tiempos de resultado' },
  { categoria: 'SEO', tag: 'SEO', pregunta: '¿Cómo aparecer en los primeros resultados de Google en Chile?', enfoque: 'SEO on-page, off-page, técnico, contenido, tiempos realistas' },
  { categoria: 'SEO', tag: 'SEO', pregunta: '¿Cuánto cuesta el SEO en Chile y cuánto tarda en dar resultados?', enfoque: 'Rangos de precio, factores, plazos realistas, qué esperar por mes' },

  // --- Industrias específicas ---
  { categoria: 'Industrias', tag: 'Inmobiliario', pregunta: '¿Cómo hacer marketing digital para inmobiliarias en Chile?', enfoque: 'Canales, presupuesto, tipo de contenido, portales vs ads directos' },
  { categoria: 'Industrias', tag: 'E-commerce', pregunta: '¿Cuál es la mejor estrategia de marketing digital para e-commerce en Chile?', enfoque: 'Google Shopping, Meta catálogos, email, ROAS por categoría' },
  { categoria: 'Industrias', tag: 'Salud', pregunta: '¿Cómo hacer publicidad digital para clínicas y centros médicos en Chile?', enfoque: 'Regulaciones, canales permitidos, costos, casos de éxito' },
  { categoria: 'Industrias', tag: 'Educación', pregunta: '¿Cómo captar alumnos con marketing digital para instituciones educativas en Chile?', enfoque: 'Estacionalidad, canales, landing pages, CPL por tipo de programa' },
  { categoria: 'Industrias', tag: 'SaaS', pregunta: '¿Cómo hacer marketing digital para empresas SaaS en Chile y Latinoamérica?', enfoque: 'Trial, freemium, CAC, LTV, canales B2B vs B2C SaaS' },
  { categoria: 'Industrias', tag: 'Servicios', pregunta: '¿Cómo conseguir clientes con publicidad digital para empresas de servicios en Chile?', enfoque: 'Abogados, contadores, consultoras — canales, presupuesto, tipo de campaña' },
  { categoria: 'Industrias', tag: 'Restaurantes', pregunta: '¿Cómo hacer publicidad digital para restaurantes y locales gastronómicos en Chile?', enfoque: 'Instagram, Google Maps, delivery apps, presupuesto mínimo' },
  { categoria: 'Industrias', tag: 'Automotriz', pregunta: '¿Cómo funciona el marketing digital para concesionarios y automotoras en Chile?', enfoque: 'Google Ads, leads, test drive, remarketing, CPL del sector' },

  // --- IA y Automatización ---
  { categoria: 'IA', tag: 'IA', pregunta: '¿Cómo usar inteligencia artificial en marketing digital en Chile?', enfoque: 'Herramientas, casos de uso, automatización, contenido, campañas' },
  { categoria: 'IA', tag: 'IA', pregunta: '¿La inteligencia artificial va a reemplazar a las agencias de marketing digital?', enfoque: 'Qué puede y qué no puede hacer la IA, rol del estratega humano' },
  { categoria: 'IA', tag: 'IA', pregunta: '¿Cómo aparecer en los resultados de ChatGPT y otros buscadores de IA?', enfoque: 'GEO (Generative Engine Optimization), structured data, autoridad, contenido citeable' },

  // --- Analítica y Medición ---
  { categoria: 'Analytics', tag: 'Analytics', pregunta: '¿Cómo medir el ROI del marketing digital en Chile?', enfoque: 'Fórmulas, herramientas, atribución, dashboards, qué métricas importan' },
  { categoria: 'Analytics', tag: 'Analytics', pregunta: '¿Qué es Google Analytics 4 y cómo configurarlo correctamente?', enfoque: 'Paso a paso, eventos, conversiones, integración con Google Ads' },
  { categoria: 'Analytics', tag: 'Analytics', pregunta: '¿Qué modelo de atribución usar para medir campañas digitales en Chile?', enfoque: 'Last click vs data-driven vs first click, cuándo usar cada uno' },

  // --- Estrategia y Tendencias ---
  { categoria: 'Estrategia', tag: 'Estrategia', pregunta: '¿Cuáles son las tendencias de marketing digital en Chile para 2026?', enfoque: 'IA, video corto, performance, first-party data, automation' },
  { categoria: 'Estrategia', tag: 'Estrategia', pregunta: '¿Cómo distribuir el presupuesto de marketing digital entre canales?', enfoque: 'Google vs Meta vs LinkedIn vs SEO, por objetivo y etapa del funnel' },
  { categoria: 'Estrategia', tag: 'Estrategia', pregunta: '¿Qué errores cometen las empresas chilenas en marketing digital?', enfoque: 'Top 10 errores, cómo evitarlos, ejemplos reales' },
  { categoria: 'Estrategia', tag: 'Estrategia', pregunta: '¿Cómo crear un plan de marketing digital para mi empresa en Chile?', enfoque: 'Paso a paso, plantilla, objetivos, canales, presupuesto, KPIs' },
  { categoria: 'Estrategia', tag: 'Estrategia', pregunta: '¿Marketing digital in-house o agencia externa? Pros y contras en Chile', enfoque: 'Comparación costos, velocidad, expertise, cuándo conviene cada uno' },

  // --- Remarketing y Retargeting ---
  { categoria: 'Remarketing', tag: 'Remarketing', pregunta: '¿Qué es el remarketing y cómo funciona en Google Ads y Meta Ads?', enfoque: 'Definición, tipos, configuración, presupuesto, mejores prácticas' },
  { categoria: 'Remarketing', tag: 'Remarketing', pregunta: '¿Cómo recuperar carritos abandonados con remarketing en Chile?', enfoque: 'Email, ads, WhatsApp, secuencias, tasas de recuperación' },

  // --- Email Marketing ---
  { categoria: 'Email', tag: 'Email', pregunta: '¿Cómo hacer email marketing efectivo para empresas en Chile?', enfoque: 'Plataformas, automatización, tasas apertura, RGPD Chile, mejores prácticas' },

  // --- Comparativas y Decisiones ---
  { categoria: 'Comparativas', tag: 'Comparativas', pregunta: '¿Google Ads o Meta Ads? Cuál es mejor para mi negocio en Chile', enfoque: 'Comparación directa por objetivo, industria, presupuesto, tabla decisión' },
  { categoria: 'Comparativas', tag: 'Comparativas', pregunta: '¿Cuál es la mejor plataforma de publicidad digital para Chile en 2026?', enfoque: 'Google, Meta, LinkedIn, TikTok — por objetivo, audiencia y presupuesto' },
  { categoria: 'Comparativas', tag: 'Comparativas', pregunta: '¿TikTok Ads funciona para empresas en Chile? Análisis completo', enfoque: 'Audiencia, costos, formatos, casos de uso, comparación con Meta' },

  // --- Conceptos Clave ---
  { categoria: 'Conceptos', tag: 'Glosario', pregunta: '¿Qué es el ROAS y cómo calcularlo correctamente?', enfoque: 'Fórmula, ejemplo numérico, benchmarks Chile, errores comunes' },
  { categoria: 'Conceptos', tag: 'Glosario', pregunta: '¿Qué es el CAC (Costo de Adquisición de Cliente) y cómo reducirlo?', enfoque: 'Fórmula, benchmarks, estrategias de reducción, relación con LTV' },
  { categoria: 'Conceptos', tag: 'Glosario', pregunta: '¿Qué es el funnel de ventas digital y cómo aplicarlo en Chile?', enfoque: 'TOFU-MOFU-BOFU, contenido por etapa, canales, métricas' },
  { categoria: 'Conceptos', tag: 'Glosario', pregunta: '¿Qué es el CPC, CPM, CPL y CPA en publicidad digital?', enfoque: 'Definiciones claras, cuándo usar cada modelo, benchmarks Chile' },

  // --- Local y Google Maps ---
  { categoria: 'Local', tag: 'Local', pregunta: '¿Cómo posicionar mi negocio en Google Maps en Chile?', enfoque: 'Google Business Profile, reseñas, SEO local, tips prácticos' },
  { categoria: 'Local', tag: 'Local', pregunta: '¿Cómo hacer publicidad digital para negocios locales en Chile?', enfoque: 'Google local, Meta radio, presupuesto mínimo, geosegmentación' },

  // --- Video y Contenido ---
  { categoria: 'Video', tag: 'Video', pregunta: '¿Cómo usar YouTube Ads para empresas en Chile?', enfoque: 'Formatos, costos, segmentación, cuándo conviene, métricas clave' },
  { categoria: 'Video', tag: 'Video', pregunta: '¿Los Reels e historias de Instagram sirven para vender en Chile?', enfoque: 'Formatos orgánicos vs pagados, engagement, conversión, mejores prácticas' },
]

// ============================================================================
// DATOS REALES DE M&P — inyectados en el prompt para autoridad
// ============================================================================
const DATOS_MYP = `
DATOS REALES DE MULLER Y PÉREZ (M&P) para inyectar como contexto de autoridad:

- Agencia de performance marketing chilena fundada en 2020
- Sitio web: www.mulleryperez.cl
- Especialización: Google Ads, Meta Ads, LinkedIn Ads, analítica avanzada
- Clientes atendidos: inmobiliarias, e-commerce, SaaS, educación, salud, transporte, servicios profesionales
- Herramientas propias: Termómetro Marketing Digital Chile (índice semanal de CPC por industria), dashboard de competencia, sistema de reportería automatizada con IA
- Modelo: fee fijo mensual, el cliente paga pauta directo a Google/Meta
- Planes desde $950.000 CLP + IVA/mes (Silver) hasta $2.500.000 CLP + IVA/mes (Platinum)
- Equipo: Paid Media Planner, Publicista, Diseñador por cada cuenta
- Tecnología: dashboards en tiempo real, reportes automatizados, monitoreo de competencia con IA
- Resultados promedio: ROAS 4-8x en e-commerce, CPL 30-50% bajo benchmark industria, calificación leads >70%

BENCHMARKS CHILE 2026 (datos M&P recopilados):
- CPC Google Ads Search promedio: $350-800 CLP según industria
- CPC Meta Ads promedio: $80-250 CLP
- CPL Google Ads: $3.000-15.000 CLP según industria
- CPL Meta Ads: $1.500-8.000 CLP según industria
- CVR landing pages Chile: 2-5% promedio (8-12% las mejores optimizadas)
- ROAS e-commerce Chile: 3-6x promedio, 8-15x top performers
- Tasa apertura email Chile: 20-35%
- CTR Google Ads Search Chile: 3-8%
- CTR Meta Ads Chile: 0.8-2.5%

INDUSTRIAS Y CPL REFERENCIAL:
| Industria      | CPL Google | CPL Meta | CVR Landing |
|----------------|-----------|----------|-------------|
| Inmobiliario   | $8.000-15.000 | $3.000-6.000 | 2-4% |
| E-commerce     | $2.000-5.000  | $1.000-3.000 | 3-6% |
| Educación      | $5.000-12.000 | $2.000-5.000 | 3-5% |
| Salud          | $6.000-14.000 | $3.000-7.000 | 2-4% |
| SaaS B2B       | $10.000-25.000| $5.000-12.000| 2-3% |
| Servicios Prof.| $4.000-10.000 | $2.000-5.000 | 3-5% |
| Automotriz     | $7.000-18.000 | $3.000-8.000 | 2-3% |
| Restaurantes   | $1.500-4.000  | $800-2.500   | 4-7% |

USD/CLP referencia: ~$930-950 CLP (mayo 2026)
UF referencia: ~$38.800 CLP (mayo 2026)
`

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 90)
}

async function elegirTema() {
  // Obtener slugs ya publicados
  const { data: existentes } = await supabase
    .from('blog_posts')
    .select('slug')

  const slugsExistentes = new Set((existentes || []).map(p => p.slug))

  // Filtrar temas no usados
  const disponibles = TEMAS.filter(t => !slugsExistentes.has(slugify(t.pregunta)))

  if (disponibles.length > 0) {
    // Rotar por día para ser predecible y no repetir
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const index = dayOfYear % disponibles.length
    return disponibles[index]
  }

  // Todos usados — generar con IA
  console.log('🤖 60 temas predefinidos agotados. Generando tema nuevo con IA...')

  const slugsList = [...slugsExistentes].slice(-30).join(', ')

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
        content: `Eres un estratega de contenido para Muller y Pérez, agencia de performance marketing en Chile. Genera UNA pregunta nueva tipo "respuesta directa" para un artículo de blog optimizado para buscadores de IA (ChatGPT, Gemini, Perplexity).

La pregunta debe:
1. Empezar con ¿Qué, ¿Cómo, ¿Cuánto, ¿Cuál o similar
2. Ser específica sobre marketing digital, performance o publicidad en Chile
3. NO repetir estos temas ya publicados: ${slugsList}
4. Orientada a empresarios chilenos que buscan respuestas concretas

Responde SOLO con JSON:
{"categoria": "nombre", "tag": "etiqueta", "pregunta": "¿Pregunta completa?", "enfoque": "qué cubrir en el artículo"}`
      }],
      max_tokens: 300,
      temperature: 0.9
    })
  })

  const data = await res.json()
  try {
    const raw = data.choices[0].message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const nuevoTema = JSON.parse(raw)
    console.log(`💡 Tema generado: ${nuevoTema.pregunta}`)
    return nuevoTema
  } catch (e) {
    return {
      categoria: 'Performance',
      tag: 'Performance',
      pregunta: '¿Cuáles son las mejores estrategias de publicidad digital para empresas en Chile en 2026?',
      enfoque: 'Panorama completo de canales, costos y resultados esperados'
    }
  }
}

async function generarArticulo(tema) {
  const hoy = new Date().toISOString().split('T')[0]
  const slug = slugify(tema.pregunta)

  console.log(`📝 Generando artículo GEO: ${tema.pregunta}`)

  const prompt = `Eres un experto en marketing digital y performance marketing en Chile. Escribe un artículo tipo "respuesta directa" para el blog de Muller y Pérez (www.mulleryperez.cl), optimizado para ser citado por buscadores de IA como ChatGPT, Gemini y Perplexity.

PREGUNTA PRINCIPAL: ${tema.pregunta}
ENFOQUE: ${tema.enfoque}
CATEGORÍA: ${tema.categoria}
FECHA: ${hoy}

${DATOS_MYP}

INSTRUCCIONES DE ESTRUCTURA (OBLIGATORIAS):

1. RESPUESTA DIRECTA (primer elemento después del prose div):
   <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
     <p class="text-lg text-gray-800 font-medium leading-relaxed">
       [Respuesta directa en 2-3 oraciones. Clara, factual, sin ambigüedad. Esta es la respuesta que un buscador de IA citaría textualmente. Incluir dato numérico o benchmark de Chile.]
     </p>
   </div>

2. ESTRUCTURA HTML OBLIGATORIA (mínimo 2000 palabras, usar estas clases Tailwind):
   - Wrapper: <div class="prose prose-lg max-w-none">
   - H2: <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">
   - H3: <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">
   - Párrafos: <p class="text-gray-700 mb-4">
   - Listas: <ul class="space-y-3 text-gray-700 mb-8"> con <li class="flex items-start gap-3"><span class="text-blue-600 font-bold">•</span><span>...</span></li>
   - Callout importante: <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8"><h3 class="text-xl font-bold text-gray-900 mb-4">Título</h3><p class="text-gray-700">...</p></div>
   - Callout dato: <div class="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8"><p class="text-gray-700">...</p></div>
   - Callout advertencia: <div class="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-xl mb-8"><p class="text-gray-700">...</p></div>

3. TABLA COMPARATIVA OBLIGATORIA (al menos una):
   <div class="overflow-x-auto mb-8">
     <table class="min-w-full border border-gray-200 rounded-xl overflow-hidden">
       <thead class="bg-gray-50">
         <tr>
           <th class="px-4 py-3 text-left text-sm font-bold text-gray-900 border-b">...</th>
         </tr>
       </thead>
       <tbody>
         <tr class="border-b border-gray-100">
           <td class="px-4 py-3 text-sm text-gray-700">...</td>
         </tr>
       </tbody>
     </table>
   </div>

4. SECCIÓN FAQ OBLIGATORIA (mínimo 5 preguntas relacionadas):
   <div class="bg-gray-50 rounded-2xl p-8 mb-8">
     <h2 class="text-3xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
     <div class="space-y-6">
       <div>
         <h3 class="text-lg font-bold text-gray-900 mb-2">¿Pregunta?</h3>
         <p class="text-gray-700">Respuesta directa y concisa.</p>
       </div>
       [... mínimo 5 preguntas ...]
     </div>
   </div>

5. CONTENIDO:
   - Mínimo 2000 palabras, idealmente 2500+
   - Primer párrafo es LA RESPUESTA DIRECTA (2-3 líneas, citeable por IA)
   - Al menos 5 H2 con profundidad real
   - Datos numéricos concretos de Chile (CPC, CPL, ROAS, precios)
   - Al menos 1 tabla comparativa con datos
   - FAQ con 5+ preguntas derivadas
   - Mencionar Muller y Pérez 1-2 veces naturalmente como fuente de datos
   - Tono: experto, directo, sin relleno. Como si respondieras a un gerente chileno
   - Incluir la sección FAQ con markup que los buscadores IA puedan parsear
   - Conclusión con resumen y CTA sutil

6. NO incluir:
   - H1 (se genera aparte)
   - Header ni footer
   - Imágenes
   - Metadata (se genera aparte)
   - La palabra "artículo" ni meta-referencias

RESPONDE SOLO CON EL HTML (desde <div class="prose..."> hasta el cierre </div>). Nada más.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 8192,
      temperature: 0.7
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error: ${res.status} — ${err}`)
  }

  const data = await res.json()
  let contenidoHtml = data.choices[0].message.content

  // Limpiar markdown wrappers si vienen
  contenidoHtml = contenidoHtml.replace(/^```html\n?/g, '').replace(/\n?```$/g, '').trim()

  // Verificar largo mínimo (2000 palabras ~ 12000 chars aprox)
  if (contenidoHtml.length < 8000) {
    console.log(`⚠️ Contenido corto (${contenidoHtml.length} chars). Aceptando de todas formas.`)
  } else {
    console.log(`✅ Contenido generado: ${contenidoHtml.length} chars`)
  }

  // Generar metadata + FAQ schema
  const metaPrompt = `Para este artículo de blog optimizado para buscadores de IA:
PREGUNTA: ${tema.pregunta}
CATEGORÍA: ${tema.categoria}
ENFOQUE: ${tema.enfoque}

Genera un JSON con estos campos exactos (solo el JSON, nada más):
{
  "title": "título SEO optimizado (max 60 chars, incluir la pregunta o keyword principal)",
  "description": "meta description (max 155 chars, respuesta directa a la pregunta + keyword)",
  "keywords": "7-10 keywords separadas por coma, long-tail y Chile-specific",
  "excerpt": "resumen citeable de 1-2 frases (max 200 chars). DEBE ser la respuesta directa a la pregunta.",
  "readTime": "X min",
  "faqQuestions": ["pregunta1", "pregunta2", "pregunta3", "pregunta4", "pregunta5"]
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
      max_tokens: 600,
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
      title: tema.pregunta.substring(0, 60),
      description: tema.pregunta.substring(0, 155),
      keywords: tema.categoria.toLowerCase() + ', marketing digital chile, performance marketing, ' + tema.tag.toLowerCase(),
      excerpt: tema.pregunta.substring(0, 200),
      readTime: '15 min',
      faqQuestions: []
    }
  }

  return {
    slug,
    title: tema.pregunta,
    seo_title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    excerpt: meta.excerpt,
    category: tema.categoria,
    tag: tema.tag,
    read_time: meta.readTime || '15 min',
    content_html: contenidoHtml,
    date_published: hoy,
    author: 'Christopher Müller'
  }
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 80)
}

async function generarImagenGeo(titulo) {
  try {
    console.log('🎨 Generando imagen...')
    const prompt = `Professional, modern blog header image about: ${titulo}. Digital marketing, performance marketing and business context. Clean minimalist design, blue and purple gradient tones, tech and data visualization elements. NO text, NO words, NO letters.`
    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size: '1536x1024', quality: 'low' })
    })
    const data = await r.json()
    if (!data.data?.[0]) return null

    let imgBuffer
    if (data.data[0].b64_json) {
      imgBuffer = Buffer.from(data.data[0].b64_json, 'base64')
    } else if (data.data[0].url) {
      imgBuffer = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer())
    } else return null

    const filename = `geo-${slugify(titulo).substring(0, 50)}-${Date.now()}.png`
    const { data: uploadData, error } = await supabase.storage
      .from('blog-images')
      .upload(filename, imgBuffer, { contentType: 'image/png', upsert: true })

    if (error) { console.log('⚠️ Upload error:', error.message); return null }

    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(filename)
    console.log('✅ Imagen subida:', urlData.publicUrl)
    return urlData.publicUrl
  } catch (e) {
    console.log('⚠️ Error imagen:', e.message)
    return null
  }
}

async function guardarEnSupabase(articulo) {
  console.log(`💾 Guardando en Supabase: ${articulo.slug}`)

  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(articulo, { onConflict: 'slug' })
    .select()

  if (error) throw new Error(`Supabase error: ${error.message}`)
  console.log(`✅ Guardado en blog_posts: ${articulo.slug}`)
  return data
}

async function main() {
  console.log('🚀 Blog GEO Diario — Respuesta Directa para IA')
  console.log('=================================================')
  console.log(`📅 Fecha: ${new Date().toISOString().split('T')[0]}`)

  const tema = await elegirTema()
  console.log(`🎯 Tema seleccionado: ${tema.pregunta}`)

  const articulo = await generarArticulo(tema)

  // Generate image
  const imageUrl = await generarImagenGeo(articulo.title)
  if (imageUrl) articulo.image_url = imageUrl

  await guardarEnSupabase(articulo)

  console.log('')
  console.log(`📰 Artículo publicado: ${articulo.title}`)
  console.log(`🔗 URL: https://www.mulleryperez.cl/blog/${articulo.slug}`)
  console.log(`📂 Categoría: ${articulo.category}`)
  console.log(`⏱️  Lectura: ${articulo.read_time}`)
  console.log(`📏 Contenido: ${articulo.content_html.length} chars`)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
