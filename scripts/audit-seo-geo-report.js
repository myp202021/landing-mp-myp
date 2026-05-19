/**
 * AUDIT SEO + GEO — Generador de Reporte HTML + PDF
 * Fase 3: recibe JSON con resultados y genera HTML con diseño M&P + PDF via Chrome headless
 *
 * CommonJS — Node 18+ con fetch nativo
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const config = require('./audit-seo-geo-config')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scoreColor(score) {
  if (score >= 90) return '#10B981'
  if (score >= 70) return '#84CC16'
  if (score >= 50) return '#F59E0B'
  if (score >= 30) return '#F97316'
  return '#EF4444'
}

function scoreLabel(score) {
  if (score >= 90) return 'Excelente'
  if (score >= 70) return 'Bueno'
  if (score >= 50) return 'Mejorable'
  if (score >= 30) return 'Deficiente'
  return 'Crítico'
}

function statusIcon(status) {
  if (status === 'good' || status === 'pass') return '<span style="color:#10B981;font-weight:800;">&#10003;</span>'
  if (status === 'warn' || status === 'warning') return '<span style="color:#F59E0B;font-weight:800;">&#9888;</span>'
  return '<span style="color:#EF4444;font-weight:800;">&#10007;</span>'
}

function priorityBadge(priority) {
  if (priority === 'alta') return '<span style="display:inline-block;background:#EF4444;color:#fff;padding:2px 8px;border-radius:5px;font-size:8.5px;font-weight:700;">ALTA</span>'
  if (priority === 'media') return '<span style="display:inline-block;background:#F59E0B;color:#fff;padding:2px 8px;border-radius:5px;font-size:8.5px;font-weight:700;">MEDIA</span>'
  return '<span style="display:inline-block;background:#10B981;color:#fff;padding:2px 8px;border-radius:5px;font-size:8.5px;font-weight:700;">BAJA</span>'
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function formatDate(d) {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`
}

// ---------------------------------------------------------------------------
// SVG Generators
// ---------------------------------------------------------------------------

/** Score circular grande (portada) */
function svgScoreCircleBig(score, size = 180) {
  const r = (size - 20) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = scoreColor(score)
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display:block;margin:0 auto;">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="10"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="10"
        stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
        stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"
        style="transition:stroke-dashoffset 0.5s;"/>
      <text x="${size/2}" y="${size/2 - 8}" text-anchor="middle" font-size="42" font-weight="800"
        fill="${color}" font-family="Inter,sans-serif">${score}</text>
      <text x="${size/2}" y="${size/2 + 16}" text-anchor="middle" font-size="12" font-weight="600"
        fill="#64748B" font-family="Inter,sans-serif">${scoreLabel(score)}</text>
    </svg>`
}

/** Score circular pequeno (resumen) */
function svgScoreCircleSmall(score, label, size = 80) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = scoreColor(score)
  return `
    <div style="text-align:center;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display:block;margin:0 auto;">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="6"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="6"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
          stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"/>
        <text x="${size/2}" y="${size/2 + 6}" text-anchor="middle" font-size="22" font-weight="800"
          fill="${color}" font-family="Inter,sans-serif">${score}</text>
      </svg>
      <div style="font-size:9px;font-weight:600;color:#334155;margin-top:4px;">${escapeHtml(label)}</div>
    </div>`
}

/** Gauge semicircular para Core Web Vitals */
function svgGauge(value, unit, label, thresholdGood, thresholdBad) {
  const maxVal = thresholdBad * 2 || 10
  const pct = Math.min(value / maxVal, 1)
  let color = '#10B981'
  if (value > thresholdGood && value <= thresholdBad) color = '#F59E0B'
  if (value > thresholdBad) color = '#EF4444'
  // semicircular arc
  const r = 45
  const circ = Math.PI * r // half circle
  const offset = circ - pct * circ
  return `
    <div style="text-align:center;padding:6px;">
      <svg width="110" height="70" viewBox="0 0 110 70">
        <path d="M 10 65 A 45 45 0 0 1 100 65" fill="none" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round"/>
        <path d="M 10 65 A 45 45 0 0 1 100 65" fill="none" stroke="${color}" stroke-width="8"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
        <text x="55" y="55" text-anchor="middle" font-size="18" font-weight="800"
          fill="${color}" font-family="Inter,sans-serif">${value}${unit}</text>
      </svg>
      <div style="font-size:9px;font-weight:600;color:#334155;margin-top:2px;">${escapeHtml(label)}</div>
      <div style="font-size:8px;color:#94A3B8;">Bueno: &lt;${thresholdGood}${unit}</div>
    </div>`
}

// ---------------------------------------------------------------------------
// CSS (based on Premios Increibles template)
// ---------------------------------------------------------------------------

const CSS = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  :root {
    --ink-950: #0A0A14; --ink-900: #0F172A; --ink-800: #1E293B; --ink-700: #334155;
    --ink-500: #64748B; --ink-400: #94A3B8; --ink-300: #CBD5E1; --line: #E2E8F0;
    --soft: #F8FAFC; --tint: #EEF2FF;
    --blue-600: #2563EB; --blue-500: #3B82F6; --indigo-500: #6366F1; --violet-500: #8B5CF6; --purple-600: #9333EA;
    --grad: linear-gradient(135deg, #2563EB 0%, #6366F1 50%, #9333EA 100%);
    --grad-soft: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%);
    --good: #10B981; --good-bg: #ECFDF5; --warn: #F59E0B; --warn-bg: #FFFBEB; --bad: #EF4444; --bad-bg: #FEF2F2;
  }
  html, body { font-family: 'Inter', -apple-system, system-ui, sans-serif; color: var(--ink-900); background: #fff; line-height: 1.5; font-size: 10px; }
  .page { width: 210mm; height: 297mm; margin: 0 auto; padding: 12mm 13mm 10mm; page-break-after: always; break-after: page; position: relative; overflow: hidden; display: flex; flex-direction: column; }
  .page:last-child { page-break-after: auto; break-after: auto; }
  .page > .footer { margin-top: auto; }
  .page > *:not(.footer):not(:last-child) { flex-shrink: 0; }
  h1 { font-size: 26px; font-weight: 800; color: var(--ink-950); letter-spacing: -0.7px; line-height: 1.15; }
  h2 { font-size: 18px; font-weight: 700; color: var(--ink-900); letter-spacing: -0.3px; margin-bottom: 5px; }
  h3 { font-size: 13px; font-weight: 700; color: var(--ink-900); letter-spacing: -0.2px; margin: 14px 0 7px; display: flex; align-items: center; gap: 9px; }
  h3::before { content: ''; width: 3px; height: 15px; background: var(--grad); border-radius: 2px; }
  h4 { font-size: 10.5px; font-weight: 700; color: var(--ink-900); margin-bottom: 3px; }
  p, li, td, th { font-size: 9.5px; color: var(--ink-700); line-height: 1.55; }
  strong { color: var(--ink-900); font-weight: 700; }
  em { font-style: normal; color: var(--ink-500); font-size: 8.8px; }
  .eyebrow { font-size: 9px; font-weight: 600; letter-spacing: 1.5px; color: var(--violet-500); text-transform: uppercase; }
  .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; margin-bottom: 12px; position: relative; }
  .header::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--grad); border-radius: 2px; }
  .header .logo { height: 40px; }
  .header-right { text-align: right; }
  .header-right .client { font-size: 19px; font-weight: 800; background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; letter-spacing: -0.4px; }
  .header-right .sub { font-size: 9.5px; color: var(--ink-500); margin-top: 2px; }
  .cover { background: var(--ink-950); background-image: radial-gradient(circle at 15% 20%, rgba(37,99,235,0.35) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(147,51,234,0.35) 0%, transparent 45%), radial-gradient(circle at 50% 100%, rgba(99,102,241,0.25) 0%, transparent 55%); color: #fff; padding: 22px 26px; border-radius: 14px; margin: 8px 0 14px; border: 1px solid rgba(255,255,255,0.08); position: relative; overflow: hidden; }
  .cover::before { content: ''; position: absolute; top: -40%; right: -20%; width: 320px; height: 320px; background: radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 60%); filter: blur(40px); }
  .cover .eyebrow { color: #A5B4FC; position: relative; z-index: 1; }
  .cover h1 { color: #fff; margin: 6px 0 8px; position: relative; z-index: 1; }
  .cover h1 span { background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .cover p { color: rgba(255,255,255,0.82); font-size: 11px; line-height: 1.65; max-width: 92%; position: relative; z-index: 1; }
  .callout { border-radius: 10px; padding: 10px 14px; margin: 7px 0; position: relative; overflow: hidden; }
  .callout h4 { margin-bottom: 4px; font-size: 10.5px; font-weight: 700; }
  .callout p, .callout li { font-size: 9.5px; line-height: 1.55; }
  .callout ul { margin-left: 14px; margin-top: 4px; }
  .callout ul li { padding: 1.5px 0; }
  .callout.info { background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.06) 100%); border: 1px solid rgba(99,102,241,0.2); }
  .callout.info h4 { color: var(--indigo-500); }
  .callout.info p, .callout.info li { color: #3730A3; }
  .callout.good { background: var(--good-bg); border: 1px solid rgba(16,185,129,0.25); }
  .callout.good h4 { color: #065F46; }
  .callout.good p, .callout.good li { color: #065F46; }
  .callout.warn { background: var(--warn-bg); border: 1px solid rgba(245,158,11,0.3); }
  .callout.warn h4 { color: #92400E; }
  .callout.warn p, .callout.warn li { color: #78350F; }
  .callout.bad { background: var(--bad-bg); border: 1px solid rgba(239,68,68,0.25); }
  .callout.bad h4 { color: #991B1B; }
  .callout.bad p, .callout.bad li { color: #991B1B; }
  .callout.dark { background: var(--ink-950); background-image: radial-gradient(circle at 0% 0%, rgba(99,102,241,0.2) 0%, transparent 50%); color: #fff; border: 1px solid rgba(255,255,255,0.08); }
  .callout.dark h4 { color: #A5B4FC; }
  .callout.dark p, .callout.dark li { color: rgba(255,255,255,0.82); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .kpi { background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 10px 8px; text-align: center; position: relative; overflow: hidden; }
  .kpi::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--grad); }
  .kpi .num { font-size: 20px; font-weight: 800; letter-spacing: -0.6px; background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .kpi .num.good { background: linear-gradient(135deg, #10B981, #059669); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .kpi .num.warn { background: linear-gradient(135deg, #F59E0B, #D97706); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .kpi .lbl { font-size: 8.8px; color: var(--ink-500); margin-top: 3px; line-height: 1.35; font-weight: 500; }
  table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 6px 0; font-size: 9.2px; border-radius: 8px; overflow: hidden; border: 1px solid var(--line); }
  thead th { background: var(--ink-950); color: #fff; padding: 7px 9px; text-align: left; font-weight: 600; font-size: 9.2px; }
  tbody td { padding: 6px 9px; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--ink-700); font-size: 9.2px; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:nth-child(even) { background: var(--soft); }
  td.c { text-align: center; }
  td.ink { color: var(--ink-900); font-weight: 600; }
  .steps { list-style: none; margin: 6px 0; }
  .steps li { display: flex; gap: 12px; padding: 7px 0; border-bottom: 1px solid var(--line); align-items: flex-start; }
  .steps li:last-child { border-bottom: none; }
  .steps .num { flex-shrink: 0; width: 24px; height: 24px; background: var(--grad); color: #fff; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; box-shadow: 0 3px 8px rgba(99,102,241,0.25); }
  .steps .content strong { display: block; font-size: 10.5px; color: var(--ink-900); margin-bottom: 2px; font-weight: 700; }
  .steps .content p { font-size: 9.2px; color: var(--ink-700); line-height: 1.5; }
  .footer { text-align: center; margin-top: 14px; padding-top: 8px; border-top: 1px solid var(--line); font-size: 8.5px; color: var(--ink-500); }
  .footer strong { color: var(--ink-900); }
  .snippet-preview { border: 1px solid var(--line); border-radius: 8px; padding: 12px 14px; margin: 6px 0; background: #fff; }
  .snippet-preview .snippet-url { font-size: 9px; color: #202124; margin-bottom: 2px; }
  .snippet-preview .snippet-title { font-size: 13px; color: #1a0dab; font-weight: 500; line-height: 1.3; margin-bottom: 2px; cursor: pointer; }
  .snippet-preview .snippet-desc { font-size: 9.5px; color: #4d5156; line-height: 1.5; }
`

// ---------------------------------------------------------------------------
// Page generators
// ---------------------------------------------------------------------------

function pageHeader(siteName, subtitle, pageNum, totalPages) {
  return `
  <div class="header">
    <img src="https://www.mulleryperez.cl/logo-color.png" alt="Muller y Pérez" class="logo">
    <div class="header-right">
      <div class="client">${escapeHtml(siteName)}</div>
      <div class="sub">${escapeHtml(subtitle)}</div>
    </div>
  </div>`
}

function pageFooter(pageNum, totalPages) {
  return `<div class="footer"><strong>Muller y Pérez</strong> &middot; mulleryperez.cl &middot; contacto@mulleryperez.cl &middot; +56 9 9225 8137 &middot; Página ${pageNum} de ${totalPages}</div>`
}

// --- PAGE 1: Portada ---
function pageCover(data) {
  const { siteName, url, date, globalScore } = data
  return `
<div class="page">
  ${pageHeader(siteName, 'Auditoría SEO + GEO', 1, data.totalPages)}

  <div class="cover" style="text-align:center;padding:30px 26px;">
    <div class="eyebrow">Auditoría completa</div>
    <h1 style="margin:12px 0 6px;">Auditoría SEO + GEO<br><span>${escapeHtml(siteName)}</span></h1>
    <p style="margin:0 auto 16px;text-align:center;max-width:80%;">${escapeHtml(url)} &middot; ${escapeHtml(date)}</p>
    <div style="position:relative;z-index:1;">
      ${svgScoreCircleBig(globalScore, 180)}
    </div>
    <p style="margin-top:12px;text-align:center;font-size:12px;font-weight:600;color:#A5B4FC;">Score Global: ${globalScore}/100</p>
  </div>

  <div class="grid-4" style="margin-top:10px;">
    <div class="kpi"><div class="num ${data.scores.seoTecnico >= 70 ? 'good' : data.scores.seoTecnico >= 50 ? 'warn' : ''}">${data.scores.seoTecnico}</div><div class="lbl">SEO<br>Técnico</div></div>
    <div class="kpi"><div class="num ${data.scores.contenido >= 70 ? 'good' : data.scores.contenido >= 50 ? 'warn' : ''}">${data.scores.contenido}</div><div class="lbl">Contenido<br>On-Page</div></div>
    <div class="kpi"><div class="num ${data.scores.performance >= 70 ? 'good' : data.scores.performance >= 50 ? 'warn' : ''}">${data.scores.performance}</div><div class="lbl">Performance<br>Web Vitals</div></div>
    <div class="kpi"><div class="num ${data.scores.geo >= 70 ? 'good' : data.scores.geo >= 50 ? 'warn' : ''}">${data.scores.geo}</div><div class="lbl">GEO<br>IA Ready</div></div>
  </div>

  <div class="callout dark" style="margin-top:12px;">
    <h4>Auditoría SEO + GEO &middot; Muller y Pérez</h4>
    <p>Este reporte analiza ${escapeHtml(siteName)} en 4 dimensiones: SEO técnico, contenido on-page, rendimiento (Core Web Vitals) y optimización para motores de IA generativa (GEO). Cada sección incluye hallazgos específicos, score por categoría y recomendaciones priorizadas.</p>
  </div>

  ${pageFooter(1, data.totalPages)}
</div>`
}

// --- PAGE 2: Resumen Ejecutivo ---
function pageResumen(data) {
  const { scores, criticalFindings, strengths } = data

  const criticalHtml = (criticalFindings || []).slice(0, 3).map(f =>
    `<li><strong>${escapeHtml(f.title)}</strong> — ${escapeHtml(f.description)}</li>`
  ).join('')

  const strengthHtml = (strengths || []).slice(0, 3).map(f =>
    `<li><strong>${escapeHtml(f.title)}</strong> — ${escapeHtml(f.description)}</li>`
  ).join('')

  return `
<div class="page">
  ${pageHeader(data.siteName, 'Resumen ejecutivo', 2, data.totalPages)}

  <h3>Scores por categoría</h3>
  <div class="grid-4" style="margin-bottom:12px;">
    <div class="kpi" style="padding:14px 8px;">${svgScoreCircleSmall(scores.seoTecnico, 'SEO Técnico')}</div>
    <div class="kpi" style="padding:14px 8px;">${svgScoreCircleSmall(scores.contenido, 'Contenido')}</div>
    <div class="kpi" style="padding:14px 8px;">${svgScoreCircleSmall(scores.performance, 'Performance')}</div>
    <div class="kpi" style="padding:14px 8px;">${svgScoreCircleSmall(scores.geo, 'GEO / IA')}</div>
  </div>

  <div class="grid-2">
    <div class="callout bad">
      <h4>Top hallazgos críticos</h4>
      <ul>${criticalHtml || '<li>No se encontraron problemas críticos</li>'}</ul>
    </div>
    <div class="callout good">
      <h4>Top fortalezas</h4>
      <ul>${strengthHtml || '<li>No se identificaron fortalezas destacadas</li>'}</ul>
    </div>
  </div>

  <h3>Distribución de pesos</h3>
  <div class="callout info">
    <p>El score global (${data.globalScore}/100) se calcula ponderando: <strong>SEO Técnico 30%</strong>, <strong>Contenido 25%</strong>, <strong>Performance 20%</strong>, <strong>GEO 25%</strong>. Las categorías con mayor peso reflejan el impacto directo en visibilidad orgánica y en motores de IA generativa.</p>
  </div>

  <h3>Resumen rápido</h3>
  <table>
    <thead>
      <tr><th>Categoría</th><th style="text-align:center;">Score</th><th style="text-align:center;">Peso</th><th>Estado</th></tr>
    </thead>
    <tbody>
      <tr><td class="ink">SEO Técnico</td><td class="c">${scores.seoTecnico}/100</td><td class="c">30%</td><td>${scoreLabel(scores.seoTecnico)}</td></tr>
      <tr><td class="ink">Contenido On-Page</td><td class="c">${scores.contenido}/100</td><td class="c">25%</td><td>${scoreLabel(scores.contenido)}</td></tr>
      <tr><td class="ink">Performance</td><td class="c">${scores.performance}/100</td><td class="c">20%</td><td>${scoreLabel(scores.performance)}</td></tr>
      <tr><td class="ink">GEO / IA</td><td class="c">${scores.geo}/100</td><td class="c">25%</td><td>${scoreLabel(scores.geo)}</td></tr>
      <tr style="background:var(--tint);"><td class="ink" style="font-size:10px;">GLOBAL</td><td class="c" style="font-weight:800;font-size:10px;">${data.globalScore}/100</td><td class="c">100%</td><td style="font-weight:700;">${scoreLabel(data.globalScore)}</td></tr>
    </tbody>
  </table>

  ${pageFooter(2, data.totalPages)}
</div>`
}

// --- PAGE 3: SEO Técnico ---
function pageSeoTecnico(data) {
  const checks = data.seoTecnicoChecks || []
  const rows = checks.map(c => `
    <tr>
      <td class="ink">${escapeHtml(c.name)}</td>
      <td class="c">${statusIcon(c.status)}</td>
      <td>${escapeHtml(c.value || '—')}</td>
      <td>${escapeHtml(c.recommendation || '')}</td>
    </tr>`).join('')

  return `
<div class="page">
  ${pageHeader(data.siteName, 'SEO Técnico', 3, data.totalPages)}

  <h3>Auditoría SEO técnico</h3>
  <p style="margin-bottom:8px;">Análisis de la infraestructura técnica que afecta la indexación y rastreo del sitio por parte de buscadores.</p>

  <table>
    <thead>
      <tr>
        <th style="width:24%;">Check</th>
        <th style="width:8%;text-align:center;">Estado</th>
        <th style="width:30%;">Valor encontrado</th>
        <th>Recomendación</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="4">No se ejecutaron checks de SEO técnico</td></tr>'}
    </tbody>
  </table>

  <div class="callout ${data.scores.seoTecnico >= 70 ? 'good' : data.scores.seoTecnico >= 50 ? 'warn' : 'bad'}" style="margin-top:8px;">
    <h4>Score SEO Técnico: ${data.scores.seoTecnico}/100</h4>
    <p>${data.scores.seoTecnico >= 70 ? 'La base técnica del sitio está en buen estado. Se recomiendan mejoras menores.' : data.scores.seoTecnico >= 50 ? 'Hay aspectos técnicos que requieren atención para mejorar la indexación.' : 'Se detectaron problemas técnicos críticos que afectan la visibilidad del sitio en buscadores.'}</p>
  </div>

  ${pageFooter(3, data.totalPages)}
</div>`
}

// --- PAGE 4: Contenido y On-Page ---
function pageContenido(data) {
  const checks = data.contenidoChecks || []
  const rows = checks.map(c => `
    <tr>
      <td class="ink">${escapeHtml(c.name)}</td>
      <td class="c">${statusIcon(c.status)}</td>
      <td>${escapeHtml(c.value || '—')}</td>
      <td>${escapeHtml(c.recommendation || '')}</td>
    </tr>`).join('')

  // Google snippet preview
  const snippet = data.snippetPreview || {}
  const snippetHtml = snippet.title ? `
  <h3>Vista previa en Google</h3>
  <div class="snippet-preview">
    <div class="snippet-url">${escapeHtml(snippet.url || data.url)}</div>
    <div class="snippet-title">${escapeHtml(snippet.title)}</div>
    <div class="snippet-desc">${escapeHtml(snippet.description || '')}</div>
  </div>` : ''

  return `
<div class="page">
  ${pageHeader(data.siteName, 'Contenido y On-Page', 4, data.totalPages)}

  <h3>Auditoría de contenido on-page</h3>
  <p style="margin-bottom:8px;">Análisis de títulos, meta descriptions, estructura de encabezados, contenido y enlaces internos.</p>

  <table>
    <thead>
      <tr>
        <th style="width:24%;">Check</th>
        <th style="width:8%;text-align:center;">Estado</th>
        <th style="width:30%;">Valor encontrado</th>
        <th>Recomendación</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="4">No se ejecutaron checks de contenido</td></tr>'}
    </tbody>
  </table>

  ${snippetHtml}

  <div class="callout ${data.scores.contenido >= 70 ? 'good' : data.scores.contenido >= 50 ? 'warn' : 'bad'}" style="margin-top:8px;">
    <h4>Score Contenido: ${data.scores.contenido}/100</h4>
    <p>${data.scores.contenido >= 70 ? 'El contenido on-page está bien optimizado para buscadores.' : data.scores.contenido >= 50 ? 'Hay oportunidades de mejora en el contenido que impactarían el posicionamiento.' : 'El contenido on-page requiere mejoras significativas para competir en buscadores.'}</p>
  </div>

  ${pageFooter(4, data.totalPages)}
</div>`
}

// --- PAGE 5: Performance ---
function pagePerformance(data) {
  const perf = data.performance || {}
  const th = config.THRESHOLDS

  const fcp = perf.fcp != null ? perf.fcp : null
  const lcp = perf.lcp != null ? perf.lcp : null
  const cls = perf.cls != null ? perf.cls : null
  const tbt = perf.tbt != null ? perf.tbt : null

  const available = fcp !== null || lcp !== null

  return `
<div class="page">
  ${pageHeader(data.siteName, 'Performance — Core Web Vitals', 5, data.totalPages)}

  <h3>Core Web Vitals</h3>
  <p style="margin-bottom:10px;">Métricas de rendimiento medidas con la API de PageSpeed Insights de Google. Determinan la experiencia de usuario y afectan el ranking.</p>

  ${available ? `
  <div class="grid-4" style="margin-bottom:10px;">
    <div class="kpi" style="padding:12px 4px;">
      ${fcp !== null ? svgGauge(fcp, 's', 'FCP', th.fcp, th.fcp * 2) : '<div style="text-align:center;padding:20px 0;color:#94A3B8;font-size:9px;">No disponible</div>'}
    </div>
    <div class="kpi" style="padding:12px 4px;">
      ${lcp !== null ? svgGauge(lcp, 's', 'LCP', th.lcp, th.lcp * 2) : '<div style="text-align:center;padding:20px 0;color:#94A3B8;font-size:9px;">No disponible</div>'}
    </div>
    <div class="kpi" style="padding:12px 4px;">
      ${cls !== null ? svgGauge(cls, '', 'CLS', th.cls, th.cls * 2.5) : '<div style="text-align:center;padding:20px 0;color:#94A3B8;font-size:9px;">No disponible</div>'}
    </div>
    <div class="kpi" style="padding:12px 4px;">
      ${tbt !== null ? svgGauge(tbt, 'ms', 'TBT', th.tbt, th.tbt * 3) : '<div style="text-align:center;padding:20px 0;color:#94A3B8;font-size:9px;">No disponible</div>'}
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Métrica</th><th style="text-align:center;">Valor</th><th style="text-align:center;">Umbral bueno</th><th>Estado</th></tr>
    </thead>
    <tbody>
      <tr><td class="ink">First Contentful Paint (FCP)</td><td class="c">${fcp !== null ? fcp + 's' : '—'}</td><td class="c">&lt; ${th.fcp}s</td><td>${fcp !== null ? (fcp <= th.fcp ? '<span style="color:#10B981;font-weight:600;">Bueno</span>' : fcp <= th.fcp * 2 ? '<span style="color:#F59E0B;font-weight:600;">Mejorable</span>' : '<span style="color:#EF4444;font-weight:600;">Lento</span>') : '—'}</td></tr>
      <tr><td class="ink">Largest Contentful Paint (LCP)</td><td class="c">${lcp !== null ? lcp + 's' : '—'}</td><td class="c">&lt; ${th.lcp}s</td><td>${lcp !== null ? (lcp <= th.lcp ? '<span style="color:#10B981;font-weight:600;">Bueno</span>' : lcp <= th.lcp * 2 ? '<span style="color:#F59E0B;font-weight:600;">Mejorable</span>' : '<span style="color:#EF4444;font-weight:600;">Lento</span>') : '—'}</td></tr>
      <tr><td class="ink">Cumulative Layout Shift (CLS)</td><td class="c">${cls !== null ? cls : '—'}</td><td class="c">&lt; ${th.cls}</td><td>${cls !== null ? (cls <= th.cls ? '<span style="color:#10B981;font-weight:600;">Bueno</span>' : cls <= th.cls * 2.5 ? '<span style="color:#F59E0B;font-weight:600;">Mejorable</span>' : '<span style="color:#EF4444;font-weight:600;">Malo</span>') : '—'}</td></tr>
      <tr><td class="ink">Total Blocking Time (TBT)</td><td class="c">${tbt !== null ? tbt + 'ms' : '—'}</td><td class="c">&lt; ${th.tbt}ms</td><td>${tbt !== null ? (tbt <= th.tbt ? '<span style="color:#10B981;font-weight:600;">Bueno</span>' : tbt <= th.tbt * 3 ? '<span style="color:#F59E0B;font-weight:600;">Mejorable</span>' : '<span style="color:#EF4444;font-weight:600;">Lento</span>') : '—'}</td></tr>
    </tbody>
  </table>` : `
  <div class="callout warn">
    <h4>PageSpeed no disponible</h4>
    <p>No se pudo obtener datos de PageSpeed Insights. Es posible que no se haya configurado la API key (GOOGLE_PAGESPEED_API_KEY o PAGESPEED_API_KEY) o que el sitio no sea accesible públicamente. Score de performance: 0.</p>
  </div>`}

  <div class="callout ${data.scores.performance >= 70 ? 'good' : data.scores.performance >= 50 ? 'warn' : 'bad'}" style="margin-top:8px;">
    <h4>Score Performance: ${data.scores.performance}/100</h4>
    <p>${data.scores.performance >= 70 ? 'El rendimiento del sitio está dentro de los parámetros óptimos de Google.' : data.scores.performance >= 50 ? 'El rendimiento es aceptable pero hay oportunidades claras de optimización.' : data.scores.performance > 0 ? 'El rendimiento necesita mejoras urgentes que afectan tanto la experiencia de usuario como el posicionamiento.' : 'No se pudieron medir las métricas de rendimiento.'}</p>
  </div>

  ${pageFooter(5, data.totalPages)}
</div>`
}

// --- PAGE 6: GEO ---
function pageGeo(data) {
  const checks = data.geoChecks || []
  const rows = checks.map(c => `
    <tr>
      <td class="ink">${escapeHtml(c.name)}</td>
      <td class="c">${statusIcon(c.status)}</td>
      <td>${escapeHtml(c.value || '—')}</td>
      <td>${escapeHtml(c.whyMatters || c.recommendation || '')}</td>
    </tr>`).join('')

  const bots = data.botAccess || []
  const botRows = bots.map(b => `
    <tr>
      <td class="ink">${escapeHtml(b.name)}</td>
      <td class="c">${b.allowed ? '<span style="color:#10B981;font-weight:800;">&#10003; Permitido</span>' : '<span style="color:#EF4444;font-weight:800;">&#10007; Bloqueado</span>'}</td>
      <td>${escapeHtml(b.note || '')}</td>
    </tr>`).join('')

  return `
<div class="page">
  ${pageHeader(data.siteName, 'GEO — Generative Engine Optimization', 6, data.totalPages)}

  <h3>Auditoría GEO</h3>
  <p style="margin-bottom:8px;">Optimización para motores de IA generativa (ChatGPT, Claude, Perplexity, Google AI Overview). Los buscadores de IA priorizan sitios con datos estructurados ricos, contenido autoritativo y acceso abierto a sus crawlers.</p>

  <table>
    <thead>
      <tr>
        <th style="width:22%;">Check</th>
        <th style="width:8%;text-align:center;">Estado</th>
        <th style="width:28%;">Valor</th>
        <th>Por qué importa para IA</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="4">No se ejecutaron checks GEO</td></tr>'}
    </tbody>
  </table>

  ${botRows ? `
  <h3>Tu sitio y los buscadores de IA</h3>
  <table>
    <thead>
      <tr><th style="width:30%;">Bot / Crawler</th><th style="width:25%;text-align:center;">Estado</th><th>Nota</th></tr>
    </thead>
    <tbody>
      ${botRows}
    </tbody>
  </table>` : ''}

  <div class="callout ${data.scores.geo >= 70 ? 'good' : data.scores.geo >= 50 ? 'warn' : 'bad'}" style="margin-top:8px;">
    <h4>Score GEO: ${data.scores.geo}/100</h4>
    <p>${data.scores.geo >= 70 ? 'El sitio está bien preparado para ser citado por motores de IA generativa.' : data.scores.geo >= 50 ? 'Hay oportunidades importantes para mejorar la visibilidad en buscadores de IA.' : 'El sitio requiere mejoras significativas para ser considerado por motores de IA generativa.'}</p>
  </div>

  ${pageFooter(6, data.totalPages)}
</div>`
}

// --- PAGE 7: Top 10 Acciones ---
function pageAcciones(data) {
  const actions = (data.topActions || []).slice(0, 10)
  const stepsHtml = actions.map((a, i) => `
    <li>
      <span class="num">${i + 1}</span>
      <div class="content">
        <strong>${priorityBadge(a.priority || 'media')} ${escapeHtml(a.title)}</strong>
        <p>${escapeHtml(a.description)}${a.impact ? ` <strong>Impacto esperado:</strong> ${escapeHtml(a.impact)}` : ''}</p>
      </div>
    </li>`).join('')

  return `
<div class="page">
  ${pageHeader(data.siteName, 'Top 10 acciones prioritarias', 7, data.totalPages)}

  <h3>Plan de acción priorizado</h3>
  <p style="margin-bottom:8px;">Las acciones están ordenadas por impacto y urgencia. Implementar las primeras 3 puede mejorar significativamente el score global.</p>

  <ul class="steps">
    ${stepsHtml || '<li><div class="content"><strong>No se generaron acciones</strong><p>No se detectaron problemas que requieran acción.</p></div></li>'}
  </ul>

  <div class="callout info" style="margin-top:8px;">
    <h4>Metodología de priorización</h4>
    <p><strong>Alta:</strong> problemas que bloquean indexación o afectan severamente la visibilidad. <strong>Media:</strong> mejoras que incrementan el score en +5-15 puntos. <strong>Baja:</strong> optimizaciones finas con impacto incremental.</p>
  </div>

  ${pageFooter(7, data.totalPages)}
</div>`
}

// --- PAGE 8 (optional): Competencia ---
function pageCompetencia(data) {
  if (!data.competitors || data.competitors.length === 0) return ''

  const cats = ['seoTecnico', 'contenido', 'performance', 'geo']
  const catLabels = { seoTecnico: 'SEO Técnico', contenido: 'Contenido', performance: 'Performance', geo: 'GEO' }

  const headerCells = data.competitors.map(c => `<th>${escapeHtml(c.name || c.url)}</th>`).join('')
  const rows = cats.map(cat => {
    const mainScore = data.scores[cat]
    const compCells = data.competitors.map(c => {
      const s = (c.scores && c.scores[cat]) || 0
      return `<td class="c" style="color:${scoreColor(s)};font-weight:700;">${s}</td>`
    }).join('')
    return `<tr><td class="ink">${catLabels[cat]}</td><td class="c" style="color:${scoreColor(mainScore)};font-weight:700;">${mainScore}</td>${compCells}</tr>`
  }).join('')

  const globalRow = (() => {
    const compCells = data.competitors.map(c => {
      const s = (c.scores && c.scores.global) || 0
      return `<td class="c" style="font-weight:800;font-size:10px;color:${scoreColor(s)};">${s}</td>`
    }).join('')
    return `<tr style="background:var(--tint);"><td class="ink" style="font-size:10px;">GLOBAL</td><td class="c" style="font-weight:800;font-size:10px;color:${scoreColor(data.globalScore)};">${data.globalScore}</td>${compCells}</tr>`
  })()

  const pgNum = data.hasCompetitors ? data.totalPages - 1 : data.totalPages

  return `
<div class="page">
  ${pageHeader(data.siteName, 'Análisis comparativo', pgNum, data.totalPages)}

  <h3>Comparación con competidores</h3>
  <p style="margin-bottom:8px;">Scores lado a lado por categoría. Los competidores fueron analizados con los mismos checks aplicados al sitio principal.</p>

  <table>
    <thead>
      <tr><th style="width:20%;">Categoría</th><th style="text-align:center;">${escapeHtml(data.siteName)}</th>${headerCells}</tr>
    </thead>
    <tbody>
      ${rows}
      ${globalRow}
    </tbody>
  </table>

  <div class="callout info" style="margin-top:10px;">
    <h4>Nota sobre el análisis comparativo</h4>
    <p>Los scores de competidores se basan en un análisis simplificado (modo solo-url). Para un análisis completo de cada competidor se requiere una auditoría individual.</p>
  </div>

  ${pageFooter(pgNum, data.totalPages)}
</div>`
}

// --- LAST PAGE: CTA ---
function pageCta(data) {
  return `
<div class="page">
  ${pageHeader(data.siteName, 'Próximos pasos', data.totalPages, data.totalPages)}

  <div class="cover" style="text-align:center;padding:40px 26px;margin-top:30px;">
    <div class="eyebrow">Siguiente paso</div>
    <h1 style="margin:14px 0 10px;font-size:24px;">¿Quieres que implementemos<br><span>estas mejoras?</span></h1>
    <p style="text-align:center;margin:0 auto;max-width:85%;font-size:12px;">Nuestro equipo puede implementar todas las recomendaciones de esta auditoría. Desde correcciones técnicas hasta optimización GEO para motores de IA generativa.</p>
  </div>

  <div class="grid-3" style="margin-top:16px;">
    <div class="callout info" style="text-align:center;">
      <h4>Agenda una reunión</h4>
      <p style="margin-top:6px;"><strong>mulleryperez.cl</strong><br>Conversemos sobre tu sitio y cómo mejorar tu visibilidad en buscadores tradicionales y de IA.</p>
    </div>
    <div class="callout info" style="text-align:center;">
      <h4>Escríbenos</h4>
      <p style="margin-top:6px;"><strong>contacto@mulleryperez.cl</strong><br>+56 9 9225 8137<br>Respuesta en menos de 24 horas.</p>
    </div>
    <div class="callout info" style="text-align:center;">
      <h4>Implementación rápida</h4>
      <p style="margin-top:6px;">Las correcciones técnicas y de contenido se pueden implementar en <strong>1-2 semanas</strong>. Los cambios GEO requieren iteración continua.</p>
    </div>
  </div>

  <div class="callout dark" style="margin-top:16px;">
    <h4>Muller y Pérez &middot; Performance Marketing + IA</h4>
    <p>Somos una agencia de performance marketing con especialización en inteligencia artificial aplicada. Ayudamos a empresas a maximizar su visibilidad tanto en buscadores tradicionales (Google) como en motores de IA generativa (ChatGPT, Claude, Perplexity). <strong style="color:#fff;">Tu sitio no solo debe rankear en Google — debe ser citado por la IA.</strong></p>
  </div>

  <div class="footer">
    <strong>Muller y Pérez &middot; Performance Marketing</strong> &middot; contacto@mulleryperez.cl &middot; +56 9 9225 8137 &middot; www.mulleryperez.cl<br>
    Auditoría SEO + GEO &middot; ${escapeHtml(data.date)} &middot; Página ${data.totalPages} de ${data.totalPages}
  </div>
</div>`
}

// ---------------------------------------------------------------------------
// Main: generate HTML
// ---------------------------------------------------------------------------

/**
 * Genera el HTML completo del reporte de auditoría
 * @param {Object} auditData - Resultados completos de la auditoría
 * @param {string} auditData.url - URL auditada
 * @param {string} auditData.siteName - Nombre del sitio
 * @param {Object} auditData.scores - { seoTecnico, contenido, performance, geo }
 * @param {number} auditData.globalScore - Score global 0-100
 * @param {Array} auditData.seoTecnicoChecks - Checks de SEO técnico
 * @param {Array} auditData.contenidoChecks - Checks de contenido
 * @param {Object} auditData.performance - { fcp, lcp, cls, tbt }
 * @param {Array} auditData.geoChecks - Checks GEO
 * @param {Array} auditData.botAccess - Estado de acceso por bot IA
 * @param {Array} auditData.topActions - Top 10 acciones priorizadas
 * @param {Array} auditData.criticalFindings - Hallazgos críticos
 * @param {Array} auditData.strengths - Fortalezas
 * @param {Object} auditData.snippetPreview - { title, description, url }
 * @param {Array} [auditData.competitors] - Competidores con scores
 * @returns {string} HTML completo
 */
function generateHTML(auditData) {
  const now = new Date()
  const data = {
    ...auditData,
    date: auditData.date || formatDate(now),
    siteName: auditData.siteName || new URL(auditData.url).hostname,
    hasCompetitors: auditData.competitors && auditData.competitors.length > 0,
  }

  // Calculate total pages: 7 base + 1 if competitors + 1 CTA
  let totalPages = 8 // cover + resumen + seo + contenido + perf + geo + acciones + cta
  if (data.hasCompetitors) totalPages += 1
  data.totalPages = totalPages

  const pages = [
    pageCover(data),
    pageResumen(data),
    pageSeoTecnico(data),
    pageContenido(data),
    pagePerformance(data),
    pageGeo(data),
    pageAcciones(data),
    pageCompetencia(data),
    pageCta(data),
  ].filter(Boolean)

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Auditoría SEO + GEO — ${escapeHtml(data.siteName)} — Muller y Pérez</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Main: generate PDF via Chrome headless
// ---------------------------------------------------------------------------

/**
 * Genera PDF a partir de HTML usando Chrome headless
 * @param {string} htmlPath - Ruta absoluta al archivo HTML
 * @param {string} pdfPath - Ruta absoluta para el PDF de salida
 * @returns {boolean} true si se generó el PDF
 */
function generatePDF(htmlPath, pdfPath) {
  const chromePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ]

  let chromeBin = null
  for (const p of chromePaths) {
    if (fs.existsSync(p)) { chromeBin = p; break }
  }

  if (!chromeBin) {
    console.error('[report] No se encontró Chrome/Chromium instalado. PDF no generado.')
    return false
  }

  try {
    const fileUrl = `file://${htmlPath}`
    const cmd = `"${chromeBin}" --headless --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${fileUrl}"`
    execSync(cmd, { stdio: 'pipe', timeout: 30000 })
    console.log(`[report] PDF generado: ${pdfPath}`)
    return true
  } catch (err) {
    console.error(`[report] Error generando PDF: ${err.message}`)
    return false
  }
}

/**
 * Genera reporte completo: HTML + PDF
 * @param {Object} auditData - Datos de la auditoría
 * @param {string} outputPath - Ruta para el PDF (sin extensión se agrega .pdf)
 * @returns {{ htmlPath: string, pdfPath: string|null }} Rutas de los archivos generados
 */
function generateReport(auditData, outputPath) {
  const html = generateHTML(auditData)

  // Determinar paths
  const pdfPath = outputPath.endsWith('.pdf') ? outputPath : outputPath + '.pdf'
  const htmlPath = pdfPath.replace(/\.pdf$/, '.html')

  // Escribir HTML
  fs.writeFileSync(htmlPath, html, 'utf-8')
  console.log(`[report] HTML generado: ${htmlPath}`)

  // Generar PDF
  const pdfOk = generatePDF(htmlPath, pdfPath)

  return {
    htmlPath,
    pdfPath: pdfOk ? pdfPath : null,
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  generateHTML,
  generatePDF,
  generateReport,
  // Exponer helpers para testing
  scoreColor,
  scoreLabel,
  svgScoreCircleBig,
  svgScoreCircleSmall,
  svgGauge,
}
