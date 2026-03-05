/**
 * TERMÓMETRO DE MARKETING DIGITAL CHILE
 * Actualiza semanalmente:
 * 1. USD / UF desde mindicador.cl (gratis, sin token)
 * 2. CPC estimado por industria (Google + Meta) ajustado al tipo de cambio
 * 3. CPA estimado por industria = CPC / CVR (tasas del predictor M&P)
 *
 * Guarda en Supabase tabla: indicadores_semanales
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

// ─── Clientes ──────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ─── CPC base Google en CLP (Ubersuggest Chile, calibrado Sep 2025 ~$935) ──
// metaRatio: Meta CPC ÷ Google CPC (por industria, basado en benchmarks públicos)
// cvr: tasa de conversión promedio del predictor M&P (%)
const CPC_INDUSTRIAS = [
  { id: 'ecommerce',      label: 'E-commerce',              google: 248, metaRatio: 0.65, cvr: 2.1 },
  { id: 'moda_retail',    label: 'Moda y Retail',           google: 128, metaRatio: 0.70, cvr: 2.4 },
  { id: 'gastronomia',    label: 'Gastronomía',             google: 162, metaRatio: 0.72, cvr: 2.8 },
  { id: 'educacion',      label: 'Educación',               google: 146, metaRatio: 0.58, cvr: 4.2 },
  { id: 'tecnologia',     label: 'Tecnología / SaaS',        google: 390, metaRatio: 0.52, cvr: 3.2 },
  { id: 'hogar',          label: 'Hogar y Decoración',      google: 165, metaRatio: 0.62, cvr: 2.1 },
  { id: 'belleza',        label: 'Belleza y Cuidado',       google: 251, metaRatio: 0.68, cvr: 2.9 },
  { id: 'deportes',       label: 'Deportes y Fitness',      google: 195, metaRatio: 0.65, cvr: 2.8 },
  { id: 'veterinaria',    label: 'Veterinaria y Mascotas',  google: 175, metaRatio: 0.68, cvr: 4.8 },
  { id: 'automotriz',     label: 'Automotriz',              google: 248, metaRatio: 0.55, cvr: 1.6 },
  { id: 'inmobiliaria',   label: 'Inmobiliaria',            google: 215, metaRatio: 0.58, cvr: 1.8 },
  { id: 'turismo',        label: 'Turismo y Viajes',        google: 421, metaRatio: 0.62, cvr: 2.1 },
  { id: 'salud',          label: 'Salud y Medicina',        google: 369, metaRatio: 0.55, cvr: 3.4 },
  { id: 'legal',          label: 'Servicios Legales',       google: 391, metaRatio: 0.42, cvr: 3.1 },
  { id: 'profesionales',  label: 'Servicios Profesionales', google: 295, metaRatio: 0.52, cvr: 3.2 },
  { id: 'construccion',   label: 'Construcción',            google: 385, metaRatio: 0.50, cvr: 2.1 },
  { id: 'logistica',      label: 'Logística y Transporte',  google: 310, metaRatio: 0.45, cvr: 2.4 },
  { id: 'seguros',        label: 'Seguros',                 google: 520, metaRatio: 0.50, cvr: 2.1 },
  { id: 'manufactura',    label: 'Manufactura B2B',         google: 425, metaRatio: 0.40, cvr: 2.8 },
  { id: 'energia',        label: 'Energía / Utilities',     google: 450, metaRatio: 0.42, cvr: 2.1 },
  { id: 'fintech',        label: 'Fintech',                 google: 479, metaRatio: 0.48, cvr: 2.8 },
  { id: 'agro',           label: 'Agro / Agroindustria',    google: 185, metaRatio: 0.45, cvr: 2.4 },
]
const USD_BASE = 935 // tasa de referencia cuando se calibraron los CPCs

// ─── Helpers ────────────────────────────────────────────────────────────────
function getSemanaISO(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return { semana: Math.ceil((((d - yearStart) / 86400000) + 1) / 7), año: d.getUTCFullYear() }
}

function round(n) { return Math.round(n) }
function pct(a, b) { if (!b || b === 0) return null; return Math.round(((a - b) / b) * 100 * 10) / 10 }

// ─── Fetch USD y UF desde mindicador.cl ─────────────────────────────────────
async function fetchIndicadores() {
  const [resUSD, resUF] = await Promise.all([
    fetch('https://mindicador.cl/api/dolar'),
    fetch('https://mindicador.cl/api/uf'),
  ])
  const dolarData = await resUSD.json()
  const ufData    = await resUF.json()
  return {
    usd: dolarData.serie[0].valor,
    uf:  ufData.serie[0].valor,
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const { semana, año } = getSemanaISO()
  const slug = `semana-${semana}-${año}`
  const fecha = new Date().toISOString().split('T')[0]

  console.log(`\n📊 Indicadores de Marketing — ${slug}`)

  // 1. Indicadores económicos
  console.log('💵 Obteniendo USD y UF...')
  const { usd, uf } = await fetchIndicadores()
  console.log(`   USD: $${usd} CLP | UF: $${uf.toLocaleString('es-CL')} CLP`)

  // 2. Semana anterior (para variaciones)
  const { data: prevData } = await supabase
    .from('indicadores_semanales')
    .select('usd_clp, cpc_data')
    .order('semana', { ascending: false })
    .order('año', { ascending: false })
    .limit(1)
    .single()

  const usdPrev   = prevData?.usd_clp || usd
  const usdVarPct = pct(usd, usdPrev)
  const cpcVarPct = usdVarPct // variación CPC = variación USD

  // 3. Calcular CPCs y CPAs ajustados al USD actual
  const ajuste = usd / USD_BASE
  const cpcData = CPC_INDUSTRIAS.map(ind => {
    const googleClp = round(ind.google * ajuste)
    const metaClp   = round(ind.google * ind.metaRatio * ajuste)
    // CPA = CPC / CVR   (CVR en decimal: 2.1% → 0.021)
    const cpaGoogle = round(googleClp / (ind.cvr / 100))
    const cpaMeta   = round(metaClp   / (ind.cvr / 100))
    return {
      id:             ind.id,
      label:          ind.label,
      google_clp:     googleClp,
      meta_clp:       metaClp,
      cpa_google_clp: cpaGoogle,
      cpa_meta_clp:   cpaMeta,
      cvr:            ind.cvr,
      google_var_pct: cpcVarPct,
      meta_var_pct:   cpcVarPct,
    }
  })

  console.log('✅ CPCs y CPAs calculados')
  cpcData.forEach(c => console.log(`   ${c.label}: G $${c.google_clp} / M $${c.meta_clp} | CPA G $${c.cpa_google_clp} / M $${c.cpa_meta_clp}`))

  // 4. Guardar en Supabase
  const { error } = await supabase.from('indicadores_semanales').upsert({
    slug, semana, año, fecha,
    usd_clp:     usd,
    uf_clp:      uf,
    usd_var_pct: usdVarPct,
    cpc_data:    cpcData,
  }, { onConflict: 'slug' })

  if (error) throw new Error(`Supabase error: ${error.message}`)

  console.log(`\n✅ Indicadores guardados — ${slug}`)
  console.log(`   USD: $${usd} CLP (${usdVarPct > 0 ? '+' : ''}${usdVarPct}% vs sem. ant.)`)
  console.log(`   UF: $${uf.toLocaleString('es-CL')} CLP`)
  console.log(`   CPC ajuste: ×${ajuste.toFixed(3)} vs base Sep 2025`)

  // 5. Email recordatorio para publicar en LinkedIn
  await enviarEmailLinkedin({ semana, año, fecha, usd, uf, usdVarPct, cpcData })
}

// ─── Email recordatorio LinkedIn ─────────────────────────────────────────────
async function enviarEmailLinkedin({ semana, año, fecha, usd, uf, usdVarPct, cpcData }) {
  const RESEND_API_KEY = process.env.RESEND || process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY no definida — email no enviado.')
    return
  }

  const fechaHumana = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const varIcon = usdVarPct > 0 ? '📈' : usdVarPct < 0 ? '📉' : '➡️'
  const varSign = usdVarPct > 0 ? '+' : ''

  // Top 5 industrias más caras en Google
  const top5 = [...cpcData].sort((a, b) => b.google_clp - a.google_clp).slice(0, 5)
  // Top 5 más baratas
  const bottom5 = [...cpcData].sort((a, b) => a.google_clp - b.google_clp).slice(0, 5)

  const top5Rows = top5.map(c =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #F1F5F9;font-size:13px;">${c.label}</td><td style="padding:6px 12px;border-bottom:1px solid #F1F5F9;font-size:13px;text-align:right;font-weight:700;">$${c.google_clp.toLocaleString('es-CL')}</td><td style="padding:6px 12px;border-bottom:1px solid #F1F5F9;font-size:13px;text-align:right;">$${c.meta_clp.toLocaleString('es-CL')}</td></tr>`
  ).join('')

  const bottom5Rows = bottom5.map(c =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #F1F5F9;font-size:13px;">${c.label}</td><td style="padding:6px 12px;border-bottom:1px solid #F1F5F9;font-size:13px;text-align:right;font-weight:700;">$${c.google_clp.toLocaleString('es-CL')}</td><td style="padding:6px 12px;border-bottom:1px solid #F1F5F9;font-size:13px;text-align:right;">$${c.meta_clp.toLocaleString('es-CL')}</td></tr>`
  ).join('')

  // Texto sugerido para LinkedIn (copy-paste ready)
  const textoLinkedin = `📊 Termómetro de Marketing Digital Chile — Semana ${semana}

${varIcon} Dólar hoy: $${usd} CLP (${varSign}${usdVarPct}% vs semana anterior)
📌 UF: $${uf.toLocaleString('es-CL')} CLP

🔥 Top CPC más caros (Google Ads):
${top5.map(c => `• ${c.label}: $${c.google_clp.toLocaleString('es-CL')} CLP`).join('\n')}

💡 CPC más accesibles:
${bottom5.map(c => `• ${c.label}: $${c.google_clp.toLocaleString('es-CL')} CLP`).join('\n')}

👉 Revisa todos los indicadores en: https://www.mulleryperez.cl/indicadores

#MarketingDigital #GoogleAds #MetaAds #Chile #PerformanceMarketing`

  const html = `<div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;color:#1E293B;">
    <div style="background:linear-gradient(135deg,#6C31D9,#2878F0);border-radius:12px;padding:24px;margin-bottom:24px;">
      <h1 style="color:#fff;font-size:18px;font-weight:800;margin:0 0 4px;">📊 Termómetro Marketing — Semana ${semana}</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:0;">${fechaHumana} · Recordatorio para publicar en LinkedIn</p>
    </div>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin-bottom:20px;">
      <h2 style="font-size:14px;color:#64748B;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Indicadores de la semana</h2>
      <div style="display:flex;gap:16px;margin-bottom:8px;">
        <div style="flex:1;background:#fff;border-radius:8px;padding:14px;border:1px solid #E2E8F0;">
          <div style="font-size:11px;color:#64748B;">USD/CLP</div>
          <div style="font-size:24px;font-weight:800;color:#0F172A;">$${usd}</div>
          <div style="font-size:11px;color:${usdVarPct > 0 ? '#DC2626' : usdVarPct < 0 ? '#16A34A' : '#64748B'};">${varSign}${usdVarPct}% vs sem. ant.</div>
        </div>
        <div style="flex:1;background:#fff;border-radius:8px;padding:14px;border:1px solid #E2E8F0;">
          <div style="font-size:11px;color:#64748B;">UF/CLP</div>
          <div style="font-size:24px;font-weight:800;color:#0F172A;">$${uf.toLocaleString('es-CL')}</div>
        </div>
      </div>
    </div>

    <div style="background:#fff;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin-bottom:20px;">
      <h2 style="font-size:14px;color:#DC2626;margin:0 0 10px;">🔥 Top 5 CPC más caros</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><th style="text-align:left;padding:6px 12px;font-size:11px;color:#94A3B8;border-bottom:2px solid #E2E8F0;">Industria</th><th style="text-align:right;padding:6px 12px;font-size:11px;color:#94A3B8;border-bottom:2px solid #E2E8F0;">Google</th><th style="text-align:right;padding:6px 12px;font-size:11px;color:#94A3B8;border-bottom:2px solid #E2E8F0;">Meta</th></tr>
        ${top5Rows}
      </table>
    </div>

    <div style="background:#fff;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin-bottom:20px;">
      <h2 style="font-size:14px;color:#16A34A;margin:0 0 10px;">💡 Top 5 CPC más accesibles</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><th style="text-align:left;padding:6px 12px;font-size:11px;color:#94A3B8;border-bottom:2px solid #E2E8F0;">Industria</th><th style="text-align:right;padding:6px 12px;font-size:11px;color:#94A3B8;border-bottom:2px solid #E2E8F0;">Google</th><th style="text-align:right;padding:6px 12px;font-size:11px;color:#94A3B8;border-bottom:2px solid #E2E8F0;">Meta</th></tr>
        ${bottom5Rows}
      </table>
    </div>

    <div style="background:#0F172A;border-radius:10px;padding:20px;margin-bottom:20px;">
      <h2 style="font-size:14px;color:#F59E0B;margin:0 0 10px;">📋 Texto sugerido para LinkedIn (copia y pega)</h2>
      <pre style="background:#1E293B;border-radius:8px;padding:16px;color:#E2E8F0;font-size:12px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;margin:0;">${textoLinkedin}</pre>
    </div>

    <div style="text-align:center;padding:16px;">
      <a href="https://www.mulleryperez.cl/indicadores" style="background:linear-gradient(135deg,#6C31D9,#2878F0);color:#fff;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">Ver indicadores en la web →</a>
    </div>

    <p style="text-align:center;font-size:11px;color:#94A3B8;margin-top:20px;">Müller & Pérez — Marketing & Performance · Recordatorio automático semanal (lunes 08:30 AM)</p>
  </div>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Müller & Pérez <contacto@mulleryperez.cl>',
      to: ['contacto@mulleryperez.cl'],
      subject: `📊 Termómetro Semana ${semana} — USD $${usd} (${varSign}${usdVarPct}%) · Publicar en LinkedIn`,
      html,
    }),
  })

  if (res.ok) {
    console.log('✉️  Email recordatorio enviado a contacto@mulleryperez.cl')
  } else {
    console.error('❌ Error enviando email:', await res.text())
  }
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
