/**
 * Generador automático de contenido social + gráficas para M&P
 * Corre 3x/semana via GitHub Actions (lunes, miércoles, viernes)
 * OpenAI genera contenido → HTML genera gráfica → Puppeteer convierte a PNG → Email con imagen + copy
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')
const puppeteer = require('puppeteer')
const fs = require('fs')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const RESEND_API_KEY = process.env.RESEND
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// ============================================================
// TIPOS DE CONTENIDO (10 tipos, se rotan)
// ============================================================
const TIPOS = [
  'dato_duro',
  'behind_the_scenes',
  'proceso_real',
  'herramienta_en_accion',
  'hot_take',
  'encuesta',
  'comportamiento_compra',
  'caso_industria',
  'resultado_cliente',
  'quote'
]

// ============================================================
// DATOS REALES DE M&P (del Termómetro y herramientas)
// ============================================================
async function obtenerDatosReales() {
  try {
    const { data } = await supabase
      .from('indicadores_semanales')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)

    if (data && data[0] && data[0].cpc_data) {
      const cpc = typeof data[0].cpc_data === 'string' ? JSON.parse(data[0].cpc_data) : data[0].cpc_data
      const usd = data[0].usd_clp
      const uf = data[0].uf_clp
      // Elegir 3 industrias al azar para dar variedad
      const industrias = cpc.sort(() => Math.random() - 0.5).slice(0, 3)
      return {
        usd, uf,
        industrias: industrias.map(i => ({ nombre: i.label, cpc_google: i.google_clp, cpc_meta: i.meta_clp, cpa_google: i.cpa_google_clp, cvr: i.cvr })),
        semana: data[0].semana,
        año: data[0].año
      }
    }
  } catch (e) {
    console.log('⚠️ No se pudieron obtener datos del Termómetro')
  }
  return null
}

// ============================================================
// GENERAR CONTENIDO CON OPENAI
// ============================================================
async function generarContenido(tipo, datosReales) {
  const hoy = new Date().toISOString().split('T')[0]
  const datosContext = datosReales
    ? `DATOS REALES DEL TERMÓMETRO M&P (esta semana):
USD/CLP: $${datosReales.usd} | UF: $${datosReales.uf}
${datosReales.industrias.map(i => `${i.nombre}: CPC Google $${i.cpc_google} CLP, CPC Meta $${i.cpc_meta} CLP, CPA Google $${i.cpa_google} CLP, CVR ${i.cvr}%`).join('\n')}
`
    : ''

  const prompt = `Eres Christopher Müller, CEO de Muller y Pérez (www.mulleryperez.cl), una agencia de performance marketing en Chile con +40 clientes y 6 años de experiencia. Generas contenido para LinkedIn e Instagram.

FECHA: ${hoy}
TIPO DE CONTENIDO: ${tipo}

${datosContext}

HERRAMIENTAS PROPIAS M&P (menciona naturalmente cuando calce):
- Predictor M&P: analiza 22 industrias en Chile, predice CPC y CPA por canal
- Termómetro Marketing: actualiza CPC/CPA semanal por industria con USD y UF
- Radar Industrias: madurez digital por sector
- Calculadora CAC: costo de adquisición por canal
- Comparador Web: velocidad y Core Web Vitals
- CRM propio M&P: leads con origen trackeado, panel comercial, semáforo de estado
- Blog automático con IA: 1 post diario generado y publicado

CLIENTES (sin nombrar, referir por industria):
- SaaS B2B: CPL bajó de $21.048 a $7.337 (65% menos) en 15 meses
- Iluminación: CPA bajó de $17.100 a $826 (95% menos) en 15 meses
- Transporte de pasajeros: monitor de competencia diario con IA
- HR Tech: campañas LinkedIn + branding "Hablemos de Productividad"
- Educación continua: funnel de 3 meses con remarketing ex alumnos
- Constructora: 4 objetivos (ventas, visibilidad, captación, fidelización)

TIPOS DE CONTENIDO:
- dato_duro: número impactante del Termómetro o del mercado chileno + implicancia para el negocio
- behind_the_scenes: cómo se ve nuestro CRM, un dashboard, la config de una campaña
- proceso_real: flujo paso a paso de algo que hacemos (lead → CRM → WhatsApp → cierre)
- herramienta_en_accion: mostrar qué sale del Predictor, Termómetro, Calculadora CAC
- hot_take: opinión fundamentada que genera debate (sin atacar a nadie)
- encuesta: pregunta con 2-3 opciones que genera participación
- comportamiento_compra: cómo las empresas buscan y contratan servicios digitales en Chile
- caso_industria: resultado real anonimizado con contexto de industria
- resultado_cliente: dato de impacto (antes/después) sin nombre
- quote: frase directa, compartible, tipo tweet provocador

REGLAS DE TONO — PROHIBIDO:
- Emojis (cero, ninguno, jamás)
- "En el mundo actual", "es importante destacar", "sin lugar a dudas", "en conclusión"
- "Sabías que...?", "Te contamos", "Hoy queremos compartir"
- "En M&P creemos que..."
- Listas con "1️⃣ 2️⃣ 3️⃣"
- Cualquier cosa que suene a manual corporativo o a ChatGPT
- Frases motivacionales vacías

REGLAS DE TONO — OBLIGATORIO:
- Empezar con el dato, la pregunta o la provocación. Nunca con contexto.
- Párrafos de 1-2 líneas máximo
- Si hay dato, poner fuente (Termómetro M&P, benchmark propio)
- Hablar como alguien que trabaja en esto todos los días
- Ser técnico pero entendible para un gerente de marketing o gerente general
- CTA natural si aplica, nunca "contáctanos para saber más"
- Positivo y constructivo: no "las agencias hacen esto mal" sino "así lo resolvemos nosotros"
- Aterrizado: no la solución de oro, sino el paso concreto

RESPONDE CON UN JSON (solo el JSON, nada más):
{
  "headline_grafica": "texto principal para la gráfica (max 12 palabras, impactante)",
  "subtitulo_grafica": "texto secundario para la gráfica (max 20 palabras)",
  "dato_grande": "el número o dato destacado si aplica (ej: '65%', '$7.337', '22 industrias') o null",
  "copy_linkedin": "el post completo para LinkedIn (4-8 párrafos cortos, max 300 palabras)",
  "copy_instagram": "el caption para Instagram (más corto, 2-4 párrafos, max 150 palabras, con 5-8 hashtags al final)",
  "tipo_layout": "uno de: dato_grande | mockup | lista | antes_despues | quote | paso_a_paso",
  "color_acento": "uno de: blue | green | purple | orange | teal"
}`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }], max_tokens: 1500, temperature: 0.8 })
  })

  if (!res.ok) throw new Error(`OpenAI error: ${res.status} — ${await res.text()}`)
  const data = await res.json()
  const raw = data.choices[0].message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(raw)
}

// ============================================================
// GENERAR HTML DE LA GRÁFICA
// ============================================================
function generarHtmlGrafica(contenido) {
  const layout = contenido.tipo_layout || 'dato_grande'
  const dia = new Date().getDay()
  // Rotar 3 templates: lunes=1, miércoles=2, viernes=3
  const templateNum = dia === 1 ? 1 : dia === 3 ? 2 : 3

  const logoUrl = 'https://www.mulleryperez.cl/logo-color.png'

  // ============================================================
  // TEMPLATE 1 — Fondo oscuro con gradiente púrpura/azul + dato grande
  // Estilo: "¿SEO o SEM?" — dramático, headline teal, fondo profundo
  // ============================================================
  if (templateNum === 1) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
</style></head><body>
<div style="width:1080px; height:1080px; background:linear-gradient(160deg, #0B0B1A 0%, #1a1145 35%, #2d1b69 60%, #1a0b3e 100%); position:relative; overflow:hidden; font-family:'Plus Jakarta Sans',sans-serif;">

  <!-- Orbes decorativos -->
  <div style="position:absolute; top:-120px; right:-80px; width:450px; height:450px; border-radius:50%; background:radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%);"></div>
  <div style="position:absolute; bottom:-100px; left:-60px; width:380px; height:380px; border-radius:50%; background:radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%);"></div>
  <div style="position:absolute; top:40%; right:10%; width:200px; height:200px; border-radius:50%; background:radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%);"></div>

  <!-- Líneas decorativas -->
  <div style="position:absolute; top:0; left:50px; width:1px; height:100%; background:linear-gradient(to bottom, transparent 0%, rgba(139,92,246,0.2) 30%, rgba(139,92,246,0.2) 70%, transparent 100%);"></div>
  <div style="position:absolute; top:0; right:80px; width:1px; height:100%; background:linear-gradient(to bottom, transparent 0%, rgba(59,130,246,0.15) 40%, rgba(59,130,246,0.15) 60%, transparent 100%);"></div>

  <!-- Logo -->
  <div style="position:absolute; top:50px; right:60px; z-index:10;">
    <img src="${logoUrl}" style="height:55px; width:auto;">
  </div>

  <!-- Contenido principal -->
  <div style="position:relative; z-index:5; display:flex; flex-direction:column; justify-content:center; height:100%; padding:80px 70px;">

    ${contenido.dato_grande ? `
    <div style="font-size:120px; font-weight:900; color:#2DD4BF; line-height:0.95; letter-spacing:-5px; margin-bottom:24px; text-shadow: 0 0 80px rgba(45,212,191,0.3);">${contenido.dato_grande}</div>
    ` : ''}

    <div style="font-size:${contenido.dato_grande ? '42' : '52'}px; font-weight:900; color:#FFFFFF; line-height:1.1; max-width:90%; letter-spacing:-1.5px;">
      ${contenido.headline_grafica}
    </div>

    <div style="margin-top:20px; padding-left:4px;">
      <div style="width:60px; height:4px; background:linear-gradient(90deg, #2DD4BF, #8B5CF6); border-radius:2px; margin-bottom:16px;"></div>
      <div style="font-size:20px; color:rgba(255,255,255,0.55); line-height:1.5; max-width:80%; font-weight:500;">
        ${contenido.subtitulo_grafica}
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="position:absolute; bottom:45px; left:70px; right:70px; display:flex; justify-content:space-between; align-items:center; z-index:10;">
    <div style="display:flex; align-items:center; gap:12px;">
      <div style="font-size:15px; color:rgba(255,255,255,0.4); font-weight:600; letter-spacing:1px;">mulleryperez.cl</div>
    </div>
    <div style="font-size:13px; color:rgba(139,92,246,0.5); font-weight:600;">Performance Marketing · Chile</div>
  </div>

</div>
</body></html>`
  }

  // ============================================================
  // TEMPLATE 2 — Fondo claro con acento de color + cajas
  // Estilo: limpio, corporativo, info estructurada
  // ============================================================
  if (templateNum === 2) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
</style></head><body>
<div style="width:1080px; height:1080px; background:#F8FAFC; position:relative; overflow:hidden; font-family:'Plus Jakarta Sans',sans-serif;">

  <!-- Barra superior de color -->
  <div style="position:absolute; top:0; left:0; right:0; height:8px; background:linear-gradient(90deg, #2DD4BF, #8B5CF6, #3B82F6);"></div>

  <!-- Forma decorativa esquina -->
  <div style="position:absolute; top:-200px; right:-200px; width:500px; height:500px; border-radius:50%; background:linear-gradient(135deg, rgba(139,92,246,0.06), rgba(45,212,191,0.04));"></div>
  <div style="position:absolute; bottom:-150px; left:-150px; width:400px; height:400px; border-radius:50%; background:rgba(59,130,246,0.04);"></div>

  <!-- Logo -->
  <div style="position:absolute; top:50px; right:60px; z-index:10;">
    <img src="${logoUrl}" style="height:50px; width:auto;">
  </div>

  <!-- Contenido -->
  <div style="position:relative; z-index:5; display:flex; flex-direction:column; justify-content:center; height:100%; padding:80px 70px;">

    <!-- Tag -->
    <div style="display:inline-block; background:linear-gradient(135deg, #2DD4BF, #0D9488); color:white; font-size:13px; font-weight:800; padding:6px 18px; border-radius:20px; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:28px; width:fit-content;">DATOS M&P</div>

    ${contenido.dato_grande ? `
    <div style="font-size:100px; font-weight:900; color:#0F172A; line-height:0.95; letter-spacing:-4px; margin-bottom:16px;">${contenido.dato_grande}</div>
    ` : ''}

    <div style="font-size:${contenido.dato_grande ? '38' : '48'}px; font-weight:900; color:#0F172A; line-height:1.1; max-width:90%; letter-spacing:-1px;">
      ${contenido.headline_grafica}
    </div>

    <!-- Caja de subtítulo -->
    <div style="margin-top:28px; background:white; border:2px solid #E2E8F0; border-radius:16px; padding:24px 28px; max-width:85%; box-shadow:0 4px 20px rgba(0,0,0,0.04);">
      <div style="font-size:19px; color:#475569; line-height:1.55; font-weight:500;">${contenido.subtitulo_grafica}</div>
    </div>

    <!-- Línea decorativa -->
    <div style="margin-top:28px; display:flex; align-items:center; gap:12px;">
      <div style="width:40px; height:3px; background:#2DD4BF; border-radius:2px;"></div>
      <div style="width:20px; height:3px; background:#8B5CF6; border-radius:2px;"></div>
      <div style="width:10px; height:3px; background:#3B82F6; border-radius:2px;"></div>
    </div>
  </div>

  <!-- Footer -->
  <div style="position:absolute; bottom:45px; left:70px; right:70px; display:flex; justify-content:space-between; align-items:center; z-index:10;">
    <div style="font-size:15px; color:#94A3B8; font-weight:600;">mulleryperez.cl</div>
    <div style="font-size:13px; color:#CBD5E1; font-weight:600;">Termómetro M&P · Chile 2026</div>
  </div>

</div>
</body></html>`
  }

  // ============================================================
  // TEMPLATE 3 — Split: mitad oscura + mitad gradiente teal
  // Estilo: bold, moderno, impactante
  // ============================================================
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
</style></head><body>
<div style="width:1080px; height:1080px; position:relative; overflow:hidden; font-family:'Plus Jakarta Sans',sans-serif;">

  <!-- Fondo split diagonal -->
  <div style="position:absolute; inset:0; background:#0A0A14;"></div>
  <div style="position:absolute; top:0; right:0; width:55%; height:100%; background:linear-gradient(160deg, #0D9488 0%, #2DD4BF 40%, #14B8A6 100%); clip-path:polygon(25% 0, 100% 0, 100% 100%, 0% 100%);"></div>

  <!-- Textura sobre el gradiente -->
  <div style="position:absolute; top:0; right:0; width:55%; height:100%; clip-path:polygon(25% 0, 100% 0, 100% 100%, 0% 100%); opacity:0.1;">
    <div style="position:absolute; top:20%; right:10%; width:300px; height:300px; border:2px solid white; border-radius:50%;"></div>
    <div style="position:absolute; bottom:15%; right:25%; width:180px; height:180px; border:2px solid white; border-radius:50%;"></div>
  </div>

  <!-- Logo -->
  <div style="position:absolute; top:50px; left:60px; z-index:10;">
    <img src="${logoUrl}" style="height:50px; width:auto;">
  </div>

  <!-- Contenido principal — lado izquierdo oscuro -->
  <div style="position:relative; z-index:5; display:flex; flex-direction:column; justify-content:center; height:100%; padding:80px 70px; max-width:60%;">

    ${contenido.dato_grande ? `
    <div style="font-size:90px; font-weight:900; color:#2DD4BF; line-height:0.95; letter-spacing:-4px; margin-bottom:20px;">${contenido.dato_grande}</div>
    ` : ''}

    <div style="font-size:${contenido.dato_grande ? '36' : '46'}px; font-weight:900; color:#FFFFFF; line-height:1.1; letter-spacing:-1px;">
      ${contenido.headline_grafica}
    </div>

    <div style="margin-top:20px;">
      <div style="width:50px; height:4px; background:#2DD4BF; border-radius:2px; margin-bottom:14px;"></div>
      <div style="font-size:18px; color:rgba(255,255,255,0.5); line-height:1.5; font-weight:500; max-width:95%;">
        ${contenido.subtitulo_grafica}
      </div>
    </div>
  </div>

  <!-- Lado derecho — texto vertical o acento -->
  <div style="position:absolute; right:60px; top:50%; transform:translateY(-50%); z-index:6; writing-mode:vertical-rl; text-orientation:mixed;">
    <div style="font-size:14px; font-weight:800; color:rgba(10,10,20,0.3); letter-spacing:4px; text-transform:uppercase;">PERFORMANCE</div>
  </div>

  <!-- Footer -->
  <div style="position:absolute; bottom:45px; left:70px; z-index:10;">
    <div style="font-size:15px; color:rgba(255,255,255,0.35); font-weight:600;">mulleryperez.cl</div>
  </div>
  <div style="position:absolute; bottom:45px; right:70px; z-index:10;">
    <div style="font-size:13px; color:rgba(10,10,20,0.4); font-weight:700;">M&P · Chile</div>
  </div>

</div>
</body></html>`
}

// ============================================================
// RENDERIZAR PNG CON PUPPETEER
// ============================================================
async function renderizarPNG(html) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1080, height: 1080 })
  await page.setContent(html, { waitUntil: 'networkidle0' })
  const buffer = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1080 } })
  await browser.close()
  return buffer
}

// ============================================================
// ENVIAR EMAIL
// ============================================================
async function enviarEmail(contenido, pngBuffer) {
  const hoy = new Date().toISOString().split('T')[0]
  const base64 = pngBuffer.toString('base64')

  const emailHtml = `
<div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;">
  <div style="background:#0A1628;color:white;padding:20px 24px;border-radius:10px 10px 0 0;">
    <h2 style="margin:0;font-size:16px;">Contenido social listo para publicar</h2>
    <p style="margin:4px 0 0;font-size:13px;opacity:0.7;">${hoy} · Tipo: ${contenido.tipo_layout}</p>
  </div>
  <div style="padding:20px 24px;border:1px solid #E5E7EB;border-top:none;">
    <h3 style="color:#0055A4;margin:0 0 12px;font-size:15px;">LinkedIn</h3>
    <div style="background:#F8FAFC;padding:16px;border-radius:8px;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#1C1C1C;">${contenido.copy_linkedin}</div>

    <h3 style="color:#7C3AED;margin:20px 0 12px;font-size:15px;">Instagram</h3>
    <div style="background:#F8FAFC;padding:16px;border-radius:8px;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#1C1C1C;">${contenido.copy_instagram}</div>
  </div>
  <p style="color:#9CA3AF;font-size:12px;margin-top:12px;text-align:center;">Gráfica 1080×1080 adjunta · Contenido social M&P</p>
</div>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'contacto@mulleryperez.cl',
      to: 'contacto@mulleryperez.cl',
      subject: `Contenido social: ${contenido.headline_grafica}`,
      html: emailHtml,
      attachments: [{ filename: `myp-social-${hoy}.png`, content: base64 }]
    })
  })

  console.log('📧 Email enviado a contacto@mulleryperez.cl')
}

// ============================================================
// GUARDAR EN SUPABASE
// ============================================================
async function guardarEnSupabase(contenido, pngBase64) {
  const hoy = new Date().toISOString().split('T')[0]

  // Verificar si la tabla existe
  const { error: check } = await supabase.from('social_posts').select('id').limit(1)
  if (check && check.message && check.message.includes('does not exist')) {
    console.log('⚠️ Tabla social_posts no existe. Crear en Supabase.')
    return
  }

  await supabase.from('social_posts').insert({
    date_created: hoy,
    tipo: contenido.tipo_layout,
    headline: contenido.headline_grafica,
    subtitulo: contenido.subtitulo_grafica,
    dato: contenido.dato_grande,
    copy_linkedin: contenido.copy_linkedin,
    copy_instagram: contenido.copy_instagram,
    color: contenido.color_acento,
    imagen_base64: pngBase64
  })

  console.log('💾 Guardado en Supabase')
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('🎨 Generador de contenido social M&P')
  console.log('=====================================')

  // 1. Obtener datos reales del Termómetro
  const datosReales = await obtenerDatosReales()
  if (datosReales) {
    console.log(`📊 Datos del Termómetro: USD $${datosReales.usd} · ${datosReales.industrias.length} industrias`)
  }

  // 2. Elegir tipo de contenido (rotación)
  const dia = new Date().getDay() // 1=lun, 3=mie, 5=vie
  const tipo = TIPOS[Math.floor(Math.random() * TIPOS.length)]
  console.log(`📝 Tipo: ${tipo}`)

  // 3. Generar contenido con OpenAI
  const contenido = await generarContenido(tipo, datosReales)
  console.log(`✅ Contenido: ${contenido.headline_grafica}`)
  console.log(`🎨 Layout: ${contenido.tipo_layout} · Color: ${contenido.color_acento}`)

  // 4. Generar HTML de la gráfica
  const html = generarHtmlGrafica(contenido)

  // 5. Renderizar PNG
  console.log('🖼️ Renderizando PNG 1080×1080...')
  const pngBuffer = await renderizarPNG(html)
  console.log(`✅ PNG generado: ${(pngBuffer.length / 1024).toFixed(0)} KB`)

  // 6. Enviar email
  await enviarEmail(contenido, pngBuffer)

  // 7. Guardar en Supabase
  const pngBase64 = pngBuffer.toString('base64')
  await guardarEnSupabase(contenido, pngBase64)

  console.log('')
  console.log(`📰 Contenido listo: ${contenido.headline_grafica}`)
  console.log(`📋 LinkedIn: ${contenido.copy_linkedin.substring(0, 80)}...`)
  console.log(`📋 Instagram: ${contenido.copy_instagram.substring(0, 80)}...`)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
