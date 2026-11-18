/**
 * Prueba del control editorial de los agentes de blog de M&P (sin publicar nada).
 * 18 nov 2026, pedido de Christopher: títulos autopromocionales y duplicados de oct–nov.
 *
 * 1) Los casos reales de oct–nov (títulos con la marca y pares duplicados) deben quedar RECHAZADOS.
 * 2) Lista cuántos temas de TEMAS (blog diario y blog GEO) siguen disponibles y por qué se descartan los otros.
 *
 * Uso: SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/control-temas-blog.js
 * (también acepta NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY de .env.local)
 */
process.env.SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

const { createClient } = require('@supabase/supabase-js')
const focus = require('./lib/myp-seo-focus')
const diario = require('./generar-blog')
const geo = require('./blog-geo-diario')

// Casos reales publicados por los agentes (slug → título y seo_title que salieron)
const CASOS = [
  ['como-m-p-revoluciona-el-performance-marketing-en-chile-casos-y-herramientas-de-i', 'Cómo M&P Revoluciona el Performance Marketing en Chile: Casos y Herramientas de IA en Acción'],
  ['como-muller-y-perez-revoluciona-el-performance-marketing-en-chile-con-ia-y-datos', 'Cómo Muller y Pérez Revoluciona el Performance Marketing en Chile con IA y Datos Propios'],
  ['como-muller-y-perez-optimiza-el-seo-en-chile-usando-agentes-de-ia-propios', 'Cómo Muller y Pérez Optimiza el SEO en Chile Usando Agentes de IA Propios'],
  ['como-elegir-la-mejor-agencia-google-ads-en-chile-comparativa-basada-en-datos-y-e', 'Cómo Elegir la Mejor Agencia Google Ads en Chile: Comparativa Basada en Datos y Experiencia de M&P'],
  ['como-muller-y-perez-potencia-el-growth-marketing-en-chile-estrategias-y-herramie', 'Cómo Muller y Pérez Potencia el Growth Marketing en Chile: Estrategias y Herramientas de IA en Acción'],
  ['como-muller-y-perez-se-destaca-como-la-mejor-agencia-de-marketing-digital-en-chi', 'Muller y Pérez: La Mejor Agencia de Marketing Digital en Chile'],
  ['optimizacion-de-performance-marketing-en-chile-estrategias-y-herramientas-de-ia-', 'Optimización de Performance Marketing en Chile: Estrategias y Herramientas de IA de Muller y Pérez'],
  ['como-muller-y-perez-potencia-el-seo-en-chile-con-agentes-de-ia-estrategias-y-eje', 'Cómo Muller y Pérez Potencia el SEO en Chile con Agentes de IA: Estrategias y Ejemplos Reales'],
  ['como-mejorar-tu-roas-en-performance-marketing-en-chile-estrategias-y-datos-de-ag', 'Cómo Mejorar tu ROAS en Performance Marketing en Chile: Estrategias y Datos de Agentes de IA de M&P'],
  // duplicados sin marca: el segundo de cada par llegó a publicarse
  ['que-es-mcp-model-context-protocol-y-por-que-importa-a-los-equipos-de-marketing', 'Qué es MCP (Model Context Protocol) y por qué importa a los equipos de marketing'],
  ['performance-max-en-chile-cuando-sirve-cuando-quema-presupuesto-y-como-auditarla', 'Performance Max en Chile: cuándo sirve, cuándo quema presupuesto y cómo auditarla'],
  ['como-aparecer-en-las-respuestas-de-chatgpt-y-gemini-guia-geo-para-empresas-chile', 'Cómo aparecer en las respuestas de ChatGPT y Gemini: guía GEO para empresas chilenas'],
]
// Títulos sanos que NO deben bloquearse por autopromoción
const SANOS = ['¿Cómo elegir la mejor agencia de marketing digital en Chile?', '¿Qué es Demand Gen en Google Ads y para quién sirve?', 'Lo que aprendí poniendo agentes de IA a trabajar en una agencia de marketing']

async function main() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  const { data, error } = await supabase.from('blog_posts').select('title, slug, date_published')
  if (error) throw new Error(error.message)
  let fallas = 0

  console.log('1) Casos reales de oct–nov 2026 (deben quedar rechazados)')
  for (const [slug, titulo] of CASOS) {
    const propio = data.find(p => p.slug === slug)
    // se simula que el artículo es nuevo: se compara contra lo publicado ANTES de él
    const antes = data.filter(p => p.slug !== slug && (!propio || p.date_published <= propio.date_published))
    let motivo = null
    try { focus.controlPublicacion({ title: titulo, seo_title: titulo.substring(0, 60), slug: slug + '-nuevo' }, antes) } catch (e) { motivo = e.message.replace('CONTROL EDITORIAL: ', '') }
    if (!motivo) fallas++
    console.log((motivo ? '   ✅ RECHAZADO  ' : '   ❌ PASA      ') + titulo.substring(0, 80) + (motivo ? '\n                 → ' + motivo.substring(0, 160) : ''))
  }
  for (const t of SANOS) {
    const a = focus.tituloAutopromocional(t)
    if (a) fallas++
    console.log((a ? '   ❌ BLOQUEADO SIN RAZÓN ' : '   ✅ título permitido ') + t)
  }

  console.log('\n2) Temas predefinidos que quedan disponibles hoy')
  for (const [nombre, mod, campo] of [['Blog diario (generar-blog.js)', diario, 'tema'], ['Blog GEO (blog-geo-diario.js)', geo, 'pregunta']]) {
    const libres = [], fuera = []
    for (const t of mod.TEMAS) {
      const r = mod.temaRechazado(t[campo], data)
      if (r) fuera.push(t[campo] + ' → ' + r); else libres.push(t[campo])
    }
    console.log('   ' + nombre + ': ' + libres.length + ' disponibles, ' + fuera.length + ' descartados por el control')
    libres.slice(0, 8).forEach(t => console.log('      · ' + t))
  }

  console.log(fallas ? '\n❌ ' + fallas + ' casos no se comportaron como se esperaba' : '\n✅ Control editorial OK (no se publicó nada)')
  process.exit(fallas ? 1 : 0)
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
