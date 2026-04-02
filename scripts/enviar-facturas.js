/**
 * Script de envío de facturas pendientes a gestionclientes@mulleryperez.cl
 *
 * USO:
 *   node scripts/enviar-facturas.js /ruta/al/facturas.csv /ruta/a/pdfs/
 *
 * CSV debe tener columnas: Cliente, Mes, Monto, Iva, Total factura, Numero Factura, Observaciones
 * Solo procesa filas con "Pendiente Pago" en Observaciones
 * PDFs deben estar nombrados como: {numero}.pdf (ej: 2281.pdf)
 *
 * Agrupa por cliente, adjunta todos los PDFs, marca atrasados
 */

const fs = require('fs')
const path = require('path')
const { Resend } = require('resend')

const RESEND_KEY = process.env.RESEND_API_KEY || process.env.RESEND || 're_9fLk231R_7aNHqQE57aeKTnV7vMaTqiHA'
const resend = new Resend(RESEND_KEY)
const DEST = 'gestionclientes@mulleryperez.cl'
const FROM = 'Gestión Clientes <gestionclientes@mulleryperez.cl>'

const sleep = ms => new Promise(r => setTimeout(r, ms))
const fmt = n => '$' + Math.round(n).toLocaleString('es-CL')

// Parse CSV
function parseCSV(csvPath) {
  const raw = fs.readFileSync(csvPath, 'utf8')
  const lines = raw.split('\n')

  const facturas = []
  for (const line of lines) {
    if (!line.toLowerCase().includes('pendiente pago')) continue

    // Parse CSV line (handle commas in quoted fields)
    const parts = []
    let current = '', inQuotes = false
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue }
      if (char === ',' && !inQuotes) { parts.push(current.trim()); current = ''; continue }
      current += char
    }
    parts.push(current.trim())

    // Extract fields: [rut, cliente, email/contacto, mes, monto, iva, total, numFactura, observaciones, emailsExtra]
    const rut = parts[0] || ''
    const cliente = parts[1] || ''
    const emailContacto = parts[2] || ''
    const mes = parts[3] || ''
    const monto = parseInt((parts[4] || '0').replace(/\./g, '').replace(/,/g, '')) || 0
    const iva = parseInt((parts[5] || '0').replace(/\./g, '').replace(/,/g, '')) || 0
    const total = parseInt((parts[6] || '0').replace(/\./g, '').replace(/,/g, '')) || 0
    const numFactura = parseInt(parts[7]) || 0
    const obs = parts[8] || ''
    const emails = parts[9] || ''

    if (!cliente || !numFactura || !total) continue

    // Extract contact name from email field (after /)
    let contacto = ''
    const slashMatch = emailContacto.match(/\/\s*(.+)/)
    if (slashMatch) contacto = slashMatch[1].trim()

    // Detect detail (Fee, Publicidad, etc)
    let detalle = ''
    if (cliente.toLowerCase().includes('fee')) detalle = 'Fee'
    else if (cliente.toLowerCase().includes('publi')) detalle = 'Publicidad'
    else if (cliente.toLowerCase().includes('viña') && cliente.toLowerCase().includes('publi')) detalle = 'Viña Publicidad'
    else if (cliente.toLowerCase().includes('viña')) detalle = 'Viña'
    else if (cliente.toLowerCase().includes('santiago')) detalle = 'Santiago'

    // Normalize client name (remove fee/publi/etc suffixes for grouping)
    let clienteNorm = cliente
      .replace(/\s*\(\s*(FEE|PUBLICIDAD|PUBLI)\s*\)/gi, '')
      .replace(/\s*(FEE|PUBLI|PUBLICIDAD)\s*$/gi, '')
      .replace(/\s*(SANTIAGO|VIÑA|VIÑA PUBLI)\s*$/gi, '')
      .replace(/\s*-\s*CAMBIAR RUT/gi, '')
      .trim()

    // Format month
    const mesMap = { 'ene': 'Enero', 'feb': 'Febrero', 'mar': 'Marzo', 'abr': 'Abril', 'may': 'Mayo', 'jun': 'Junio', 'jul': 'Julio', 'ago': 'Agosto', 'sep': 'Septiembre', 'oct': 'Octubre', 'nov': 'Noviembre', 'dic': 'Diciembre' }
    const mesParts = mes.split('.')
    const mesNombre = mesMap[mesParts[0]?.toLowerCase()] || mesParts[0] || ''
    const anio = mesParts[1] ? '20' + mesParts[1] : '2026'
    const mesCompleto = mesNombre + ' ' + anio

    // Is old (more than 1 month)?
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const mesNum = Object.keys(mesMap).indexOf(mesParts[0]?.toLowerCase()) + 1
    const factAnio = parseInt('20' + (mesParts[1] || '26'))
    const isOld = factAnio < currentYear || (factAnio === currentYear && mesNum < currentMonth - 1)

    facturas.push({
      clienteOriginal: cliente,
      clienteNorm,
      contacto,
      mes: mesCompleto,
      total,
      numFactura,
      detalle,
      isOld,
    })
  }

  return facturas
}

// Group by normalized client name
function groupByClient(facturas) {
  const groups = new Map()
  for (const f of facturas) {
    const key = f.clienteNorm
    if (!groups.has(key)) groups.set(key, { cliente: f.clienteNorm, contacto: f.contacto, facturas: [], atrasado: false })
    const group = groups.get(key)
    group.facturas.push(f)
    if (f.isOld) group.atrasado = true
    if (f.contacto && !group.contacto) group.contacto = f.contacto
  }
  return Array.from(groups.values())
}

// Build email HTML
function buildHTML(group) {
  const saludo = group.contacto ? `Hola ${group.contacto}, ¿cómo estás?` : 'Hola, ¿cómo están?'
  const multi = group.facturas.length > 1
  const total = group.facturas.reduce((s, f) => s + f.total, 0)

  let detalle = ''
  group.facturas.forEach(f => {
    const det = f.detalle ? ` – ${f.detalle}` : ''
    detalle += `<p style="background:#f0f5ff;padding:10px 14px;border-left:4px solid #0055A4;border-radius:4px;margin:6px 0;">Factura N° <strong>${f.numFactura}</strong>${det} (${f.mes}) – <strong>${fmt(f.total)}</strong></p>`
  })

  let totalLine = multi ? `<p style="margin-top:10px;font-size:15px;"><strong>Total pendiente: ${fmt(total)}</strong></p>` : ''
  let urgencia = group.atrasado ? '<p style="background:#fef3c7;padding:10px 14px;border-left:4px solid #f59e0b;border-radius:4px;margin:10px 0;color:#92400e;">Notamos que hay facturas con más de un mes de antigüedad. Te pedimos por favor gestionar el pago a la brevedad para mantener al día la cuenta.</p>' : ''

  return `<div style="font-family:Arial,sans-serif;max-width:600px;">
    <p>${saludo}</p>
    <p>Esperamos que estés muy bien.<br>Te escribimos desde Gestión de Clientes M&P para compartir el detalle de ${multi ? 'las facturas' : 'la factura'} actualmente pendiente${multi ? 's' : ''} de pago:</p>
    <p><strong>Detalle de factura${multi ? 's' : ''} pendiente${multi ? 's' : ''}:</strong></p>
    ${detalle}${totalLine}${urgencia}
    <p>Quedamos atentos a tu confirmación de pago.</p>
    <p>Un abrazo,<br><strong>Gestión de Clientes</strong><br>M&P – Marketing & Performance</p>
  </div>`
}

// Main
async function main() {
  const csvPath = process.argv[2]
  const pdfDir = process.argv[3]

  if (!csvPath) {
    console.log('Uso: node scripts/enviar-facturas.js /ruta/facturas.csv /ruta/pdfs/')
    console.log('  CSV: debe tener "Pendiente Pago" en observaciones')
    console.log('  PDFs: nombrados como {numero}.pdf (ej: 2281.pdf)')
    process.exit(1)
  }

  const pdfDirs = pdfDir ? [pdfDir] : ['/Users/christophermuller/Downloads/', '/Users/christophermuller/Desktop/Cotizaciones/']

  console.log('📄 Leyendo CSV:', csvPath)
  const facturas = parseCSV(csvPath)
  console.log(`   ${facturas.length} facturas pendientes encontradas`)

  const groups = groupByClient(facturas)
  console.log(`   ${groups.length} clientes agrupados\n`)

  let ok = 0, err = 0
  for (const group of groups) {
    const multi = group.facturas.length > 1
    const total = group.facturas.reduce((s, f) => s + f.total, 0)

    // Find PDFs
    const attachments = []
    for (const f of group.facturas) {
      let pdfBuf = null
      for (const dir of pdfDirs) {
        const p = path.join(dir, f.numFactura + '.pdf')
        if (fs.existsSync(p)) { pdfBuf = fs.readFileSync(p); break }
      }
      if (pdfBuf) {
        attachments.push({ filename: `Factura_${f.numFactura}.pdf`, content: pdfBuf.toString('base64') })
      } else {
        console.log(`   ⚠️ PDF no encontrado: ${f.numFactura}.pdf`)
      }
    }

    const subject = `${group.cliente} - Factura${multi ? 's' : ''} pendiente${multi ? 's' : ''} M&P`
    const html = buildHTML(group)

    try {
      await resend.emails.send({ from: FROM, to: [DEST], subject, html, attachments })
      ok++
      console.log(`✅ ${group.cliente} | ${group.facturas.length} fact | ${attachments.length} PDF | ${fmt(total)}${group.atrasado ? ' ⚠️ ATRASADO' : ''}`)
    } catch (e) {
      err++
      console.log(`❌ ${group.cliente}: ${e.message}`)
    }
    await sleep(1500)
  }

  console.log(`\n📧 Total: ${ok} emails enviados | ${err} errores`)
}

main().catch(e => { console.error('Error fatal:', e.message); process.exit(1) })
