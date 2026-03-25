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
const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY
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

  const prompt = `Eres un director de performance marketing que lleva 6 años gestionando campañas para +40 empresas en Chile. Publicas en LinkedIn e Instagram contenido que lo lee un gerente general, un gerente de marketing o un CFO. No eres community manager. Eres el tipo que ve los dashboards todos los días y sabe exactamente cuánto cuesta un cliente en cada industria.

FECHA: ${hoy}
TIPO DE CONTENIDO: ${tipo}

${datosContext}

CONTEXTO M&P — USA CUANDO CALCE (no fuerces):
- Predictor M&P analiza 22 industrias en Chile con CPC y CPA real por canal
- Termómetro Marketing se actualiza semanalmente con datos de CPC, CPA, USD y UF
- CRM propio donde cada lead llega con origen trackeado (Google, Meta, LinkedIn, orgánico)
- Blog automático: 1 artículo diario con IA, posicionando en Google
- Clientes reales (sin nombrar): SaaS que bajó CPL 65% en 15 meses, iluminación que bajó CPA 95%, constructora entrando a minería, HR Tech con LinkedIn Thought Leader Ads

TIPOS:
- dato_duro: número del mercado + qué significa para el negocio del que lee
- behind_the_scenes: mostrar cómo se ve por dentro una operación real de performance
- proceso_real: un flujo concreto que implementamos (lead → CRM → WhatsApp automático → cierre)
- herramienta_en_accion: qué sale cuando metes una industria al Predictor o al Termómetro
- hot_take: opinión que la mayoría no dice pero es verdad, con datos
- encuesta: pregunta que el gerente quiere responder porque le toca directamente
- comportamiento_compra: cómo se toman las decisiones de contratar servicios digitales en Chile
- caso_industria: resultado real sin nombre, con antes/después y contexto
- resultado_cliente: el dato de impacto puro, directo, sin adornos
- quote: una frase que un gerente copiaría y pegaría en su grupo de WhatsApp

TONO — EL CONTENIDO TIENE QUE SER VIRAL Y C-LEVEL:
- El headline de la gráfica tiene que ser tan impactante que alguien deje de scrollear. Corto, directo, que genere curiosidad o reacción inmediata.
- El subtítulo complementa con el dato concreto o la implicancia de negocio.
- El dato grande tiene que ser un número que duela o sorprenda.
- El copy de LinkedIn tiene que sonar como alguien que escribe desde la trinchera, no desde un escritorio. Que el gerente que lo lea diga "este tipo sabe de lo que habla".
- El copy de Instagram es más corto, más punchy, va al grano.

PROHIBIDO (en serio, si incluyes algo de esto regenero):
- Emojis
- "En el mundo actual", "es importante", "sin lugar a dudas", "en conclusión", "cabe destacar"
- "Sabías que...?", "Te contamos", "Hoy queremos compartir", "En M&P creemos"
- Frases motivacionales genéricas
- Anything that sounds like ChatGPT wrote it
- Explicar cosas obvias. El lector es inteligente.

OBLIGATORIO:
- Primera línea: dato, pregunta o provocación. Cero preámbulo.
- Párrafos de 1-2 líneas. Ritmo de lectura rápido.
- Si mencionas un dato, di de dónde sale.
- Habla como peer, no como vendedor. No estás vendiendo — estás mostrando cómo trabajas.
- Positivo: no "las agencias hacen mal esto" sino "nosotros lo hacemos así y funciona"
- Aterrizado: nada de "la IA va a cambiar el mundo". Sí "conectamos el CRM con Google Ads y ahora sabemos qué keyword genera clientes reales, no solo clics"

RESPONDE SOLO CON ESTE JSON (nada más):
{
  "headline_grafica": "max 10 palabras, impactante, que frene el scroll",
  "subtitulo_grafica": "max 18 palabras, complementa con dato o implicancia",
  "dato_grande": "el número que duele o sorprende (ej: '65%', '$826', '22') o null si no aplica",
  "copy_linkedin": "post completo LinkedIn, 4-8 párrafos cortos, max 280 palabras, sin emojis",
  "copy_instagram": "caption IG, 2-4 párrafos, max 140 palabras, 5-7 hashtags al final, sin emojis"
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
  const dia = new Date().getDay()
  // Rotar 3 templates: lunes=1, miércoles=2, viernes=3, manual dispatch=random
  const templateNum = dia === 1 ? 1 : dia === 3 ? 2 : dia === 5 ? 3 : (Math.floor(Math.random() * 3) + 1)

  const logoUrl = 'https://www.mulleryperez.cl/logo-color.png'
  const dato = contenido.dato_grande || ''
  const headline = contenido.headline_grafica || ''
  const sub = contenido.subtitulo_grafica || ''

  const STYLE = `<style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');*{margin:0;padding:0;box-sizing:border-box;}</style>`
  const footerDark = `<div style="position:absolute;bottom:38px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;z-index:10;"><div style="display:flex;align-items:center;gap:10px;"><div style="width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#2DD4BF,#8B5CF6);"></div><div style="font-size:20px;font-weight:800;color:rgba(255,255,255,0.5);letter-spacing:0.5px;">mulleryperez.cl</div></div><div style="font-size:13px;color:rgba(168,85,247,0.4);font-weight:600;">Performance Marketing · Chile</div></div>`
  const footerLight = `<div style="position:absolute;bottom:38px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;z-index:10;"><div style="display:flex;align-items:center;gap:10px;"><div style="width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#8B5CF6,#2DD4BF);"></div><div style="font-size:20px;font-weight:800;letter-spacing:0.5px;background:linear-gradient(135deg,#4C1D95,#7C3AED,#0D9488);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">mulleryperez.cl</div></div><div style="font-size:13px;color:#A78BFA;font-weight:600;">Performance Marketing · Chile</div></div>`
  // Burbujas sólidas (sin filter:blur que Puppeteer no renderiza bien)
  const bubblesDark = `<div style="position:absolute;top:-60px;right:-30px;width:280px;height:280px;border-radius:50%;background:rgba(168,85,247,0.3);"></div><div style="position:absolute;top:30px;right:50px;width:170px;height:170px;border-radius:50%;background:rgba(192,132,252,0.2);"></div><div style="position:absolute;bottom:-40px;left:-30px;width:250px;height:250px;border-radius:50%;background:rgba(59,130,246,0.25);"></div><div style="position:absolute;bottom:40px;left:50px;width:150px;height:150px;border-radius:50%;background:rgba(96,165,250,0.15);"></div><div style="position:absolute;top:200px;right:200px;width:180px;height:180px;border-radius:50%;background:rgba(236,72,153,0.2);"></div><div style="position:absolute;bottom:250px;left:350px;width:140px;height:140px;border-radius:50%;background:rgba(45,212,191,0.18);"></div><div style="position:absolute;top:450px;right:400px;width:100px;height:100px;border-radius:50%;background:rgba(251,146,60,0.15);"></div>`
  const bubblesLight = `<div style="position:absolute;top:-60px;right:-30px;width:280px;height:280px;border-radius:50%;background:rgba(139,92,246,0.25);"></div><div style="position:absolute;top:20px;right:40px;width:180px;height:180px;border-radius:50%;background:rgba(192,132,252,0.2);"></div><div style="position:absolute;bottom:-40px;left:-30px;width:250px;height:250px;border-radius:50%;background:rgba(45,212,191,0.25);"></div><div style="position:absolute;bottom:30px;left:40px;width:150px;height:150px;border-radius:50%;background:rgba(94,234,212,0.2);"></div><div style="position:absolute;top:180px;right:250px;width:200px;height:200px;border-radius:50%;background:rgba(236,72,153,0.18);"></div><div style="position:absolute;top:50px;left:200px;width:160px;height:160px;border-radius:50%;background:rgba(251,146,60,0.18);"></div><div style="position:absolute;bottom:220px;right:60px;width:130px;height:130px;border-radius:50%;background:rgba(59,130,246,0.15);"></div><div style="position:absolute;top:600px;left:400px;width:100px;height:100px;border-radius:50%;background:rgba(168,85,247,0.12);"></div>`
  const dots = `<div style="position:absolute;top:160px;right:180px;width:14px;height:14px;border-radius:50%;background:#8B5CF6;opacity:0.4;"></div><div style="position:absolute;bottom:300px;left:110px;width:12px;height:12px;border-radius:50%;background:#EC4899;opacity:0.35;"></div><div style="position:absolute;top:400px;right:50px;width:10px;height:10px;border-radius:50%;background:#2DD4BF;opacity:0.5;"></div><div style="position:absolute;top:70px;left:380px;width:8px;height:8px;border-radius:50%;background:#F97316;opacity:0.4;"></div><div style="position:absolute;bottom:120px;right:350px;width:9px;height:9px;border-radius:50%;background:#3B82F6;opacity:0.35;"></div><div style="position:absolute;top:320px;left:80px;width:7px;height:7px;border-radius:50%;background:#A78BFA;opacity:0.45;"></div>`

  // ============================================================
  // TEMPLATE 1 — Fondo oscuro púrpura + burbujas sólidas multicolor
  // ============================================================
  if (templateNum === 1) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${STYLE}</head><body>
<div style="width:1080px;height:1080px;background:linear-gradient(160deg,#0B0B1A 0%,#1a1145 30%,#2d1b69 55%,#1a0b3e 100%);position:relative;overflow:hidden;font-family:'Plus Jakarta Sans',sans-serif;">
  ${bubblesDark}
  ${dots}
  <div style="position:absolute;top:48px;right:55px;z-index:10;"><img src="${logoUrl}" style="height:52px;width:auto;"></div>
  <div style="position:relative;z-index:5;display:flex;flex-direction:column;justify-content:center;height:100%;padding:90px 80px;">
    ${dato ? `<div style="font-size:130px;font-weight:900;line-height:0.9;letter-spacing:-6px;margin-bottom:24px;"><span style="background:linear-gradient(135deg,#2DD4BF,#34D399,#5EEAD4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${dato}</span></div>` : ''}
    <div style="font-size:${dato ? '44' : '52'}px;font-weight:900;color:#FFFFFF;line-height:1.08;max-width:85%;letter-spacing:-1.5px;">${headline}</div>
    <div style="margin-top:24px;padding-left:2px;">
      <div style="display:flex;gap:6px;margin-bottom:16px;"><div style="width:45px;height:4px;background:linear-gradient(90deg,#2DD4BF,#8B5CF6);border-radius:2px;"></div><div style="width:20px;height:4px;background:#EC4899;border-radius:2px;opacity:0.6;"></div><div style="width:10px;height:4px;background:#F97316;border-radius:2px;opacity:0.5;"></div></div>
      <div style="font-size:20px;color:rgba(255,255,255,0.5);line-height:1.5;max-width:75%;font-weight:500;">${sub}</div>
    </div>
  </div>
  ${footerDark}
</div></body></html>`
  }

  // ============================================================
  // TEMPLATE 2 — Fondo claro lavanda + burbujas sólidas + caja info
  // ============================================================
  if (templateNum === 2) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${STYLE}</head><body>
<div style="width:1080px;height:1080px;background:linear-gradient(150deg,#F5F3FF 0%,#EDE9FE 30%,#F1F0FB 60%,#FDF2F8 100%);position:relative;overflow:hidden;font-family:'Plus Jakarta Sans',sans-serif;">
  <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#2DD4BF,#8B5CF6,#EC4899,#F97316);"></div>
  ${bubblesLight}
  ${dots}
  <div style="position:absolute;top:48px;right:55px;z-index:10;"><img src="${logoUrl}" style="height:52px;width:auto;"></div>
  <div style="position:relative;z-index:5;display:flex;flex-direction:column;justify-content:center;height:100%;padding:90px 80px;">
    <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:28px;width:fit-content;"><div style="width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#2DD4BF,#8B5CF6);"></div><div style="font-size:13px;font-weight:800;color:#7C3AED;letter-spacing:2px;text-transform:uppercase;">Datos M&P</div></div>
    ${dato ? `<div style="font-size:110px;font-weight:900;line-height:0.9;letter-spacing:-5px;margin-bottom:16px;"><span style="background:linear-gradient(135deg,#1E1B4B,#4C1D95,#7C3AED);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${dato}</span></div>` : ''}
    <div style="font-size:${dato ? '40' : '48'}px;font-weight:900;color:#0F172A;line-height:1.1;max-width:85%;letter-spacing:-1px;">${headline}</div>
    <div style="margin-top:28px;background:rgba(255,255,255,0.85);border:2px solid rgba(139,92,246,0.15);border-radius:16px;padding:22px 26px;max-width:80%;box-shadow:0 4px 24px rgba(139,92,246,0.08);"><div style="font-size:18px;color:#475569;line-height:1.5;font-weight:500;">${sub}</div></div>
    <div style="margin-top:24px;display:flex;align-items:center;gap:8px;"><div style="width:40px;height:4px;background:linear-gradient(90deg,#2DD4BF,#8B5CF6);border-radius:2px;"></div><div style="width:16px;height:4px;background:#EC4899;border-radius:2px;"></div><div style="width:8px;height:4px;background:#F97316;border-radius:2px;"></div></div>
  </div>
  ${footerLight}
</div></body></html>`
  }

  // ============================================================
  // TEMPLATE 3 — Split diagonal oscuro/púrpura + burbujas sólidas
  // ============================================================
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${STYLE}</head><body>
<div style="width:1080px;height:1080px;position:relative;overflow:hidden;font-family:'Plus Jakarta Sans',sans-serif;">
  <div style="position:absolute;inset:0;background:linear-gradient(170deg,#0A0A14 0%,#0F0D24 100%);"></div>
  <div style="position:absolute;top:0;right:0;width:50%;height:100%;background:linear-gradient(160deg,#7C3AED 0%,#8B5CF6 30%,#A78BFA 60%,#C4B5FD 100%);clip-path:polygon(30% 0,100% 0,100% 100%,0% 100%);"></div>
  <!-- Burbujas sobre el split -->
  <div style="position:absolute;top:80px;right:40px;width:200px;height:200px;border-radius:50%;background:rgba(236,72,153,0.25);"></div>
  <div style="position:absolute;bottom:120px;right:180px;width:150px;height:150px;border-radius:50%;background:rgba(251,146,60,0.2);"></div>
  <div style="position:absolute;top:400px;right:320px;width:120px;height:120px;border-radius:50%;background:rgba(45,212,191,0.18);"></div>
  <div style="position:absolute;top:-40px;left:-20px;width:260px;height:260px;border-radius:50%;background:rgba(59,130,246,0.2);"></div>
  <div style="position:absolute;bottom:80px;left:80px;width:170px;height:170px;border-radius:50%;background:rgba(168,85,247,0.15);"></div>
  <div style="position:absolute;top:250px;left:200px;width:100px;height:100px;border-radius:50%;background:rgba(236,72,153,0.12);"></div>
  ${dots}
  <div style="position:absolute;top:48px;left:60px;z-index:10;"><img src="${logoUrl}" style="height:52px;width:auto;"></div>
  <div style="position:relative;z-index:5;display:flex;flex-direction:column;justify-content:center;height:100%;padding:90px 70px;max-width:58%;">
    <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;width:fit-content;"><div style="width:8px;height:8px;border-radius:50%;background:#2DD4BF;"></div><div style="font-size:12px;font-weight:800;color:#2DD4BF;letter-spacing:2px;text-transform:uppercase;">M&P Data</div></div>
    ${dato ? `<div style="font-size:100px;font-weight:900;color:#2DD4BF;line-height:0.9;letter-spacing:-4px;margin-bottom:20px;">${dato}</div>` : ''}
    <div style="font-size:${dato ? '36' : '46'}px;font-weight:900;color:#FFFFFF;line-height:1.08;letter-spacing:-1px;">${headline}</div>
    <div style="margin-top:22px;"><div style="display:flex;gap:6px;margin-bottom:14px;"><div style="width:40px;height:4px;background:#2DD4BF;border-radius:2px;"></div><div style="width:15px;height:4px;background:#8B5CF6;border-radius:2px;"></div><div style="width:8px;height:4px;background:#EC4899;border-radius:2px;"></div></div><div style="font-size:18px;color:rgba(255,255,255,0.45);line-height:1.5;font-weight:500;">${sub}</div></div>
  </div>
  <div style="position:absolute;right:55px;top:50%;transform:translateY(-50%);z-index:6;writing-mode:vertical-rl;"><div style="font-size:13px;font-weight:800;color:rgba(255,255,255,0.15);letter-spacing:5px;text-transform:uppercase;">Performance</div></div>
  ${footerDark}
</div></body></html>`
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
// PUBLICAR EN LINKEDIN VIA AYRSHARE
// ============================================================
async function subirImagenSupabase(pngBuffer) {
  const hoy = new Date().toISOString().split('T')[0]
  const filename = `social/myp-social-${hoy}.png`

  const { data, error } = await supabase.storage
    .from('public-assets')
    .upload(filename, pngBuffer, {
      contentType: 'image/png',
      upsert: true
    })

  if (error) {
    // Si el bucket no existe, intentar crearlo
    if (error.message && error.message.includes('not found')) {
      console.log('📦 Creando bucket public-assets...')
      await supabase.storage.createBucket('public-assets', { public: true })
      const { data: d2, error: e2 } = await supabase.storage
        .from('public-assets')
        .upload(filename, pngBuffer, { contentType: 'image/png', upsert: true })
      if (e2) throw new Error(`Supabase Storage error: ${e2.message}`)
    } else {
      throw new Error(`Supabase Storage error: ${error.message}`)
    }
  }

  const { data: urlData } = supabase.storage.from('public-assets').getPublicUrl(filename)
  console.log(`🖼️ Imagen subida: ${urlData.publicUrl}`)
  return urlData.publicUrl
}

async function publicarEnLinkedIn(contenido, pngBuffer) {
  if (!AYRSHARE_API_KEY) {
    console.log('⚠️ AYRSHARE_API_KEY no configurada — saltando publicación')
    return
  }

  try {
    // Subir imagen a Supabase Storage para obtener URL pública
    const imageUrl = await subirImagenSupabase(pngBuffer)

    const res = await fetch('https://app.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post: contenido.copy_linkedin,
        platforms: ['linkedin'],
        mediaUrls: [imageUrl]
      })
    })

    const data = await res.json()

    if (data.status === 'success' || data.id) {
      console.log('✅ Publicado en LinkedIn via Ayrshare')
    } else {
      console.log('⚠️ Ayrshare respuesta:', JSON.stringify(data).substring(0, 300))
    }
  } catch (err) {
    console.log('⚠️ Error publicando en LinkedIn:', err.message)
  }
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

  // 6. Enviar email (con copy LinkedIn + IG para publicar manual)
  await enviarEmail(contenido, pngBuffer)

  // 8. Guardar en Supabase
  const pngBase64 = pngBuffer.toString('base64')
  await guardarEnSupabase(contenido, pngBase64)

  console.log('')
  console.log(`📰 Contenido listo: ${contenido.headline_grafica}`)
  console.log(`📋 LinkedIn: en el email para publicar manual`)
  console.log(`📋 Instagram: en el email para publicar manual`)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
