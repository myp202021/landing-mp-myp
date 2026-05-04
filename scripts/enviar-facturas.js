const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

const RESEND_KEY = process.env.RESEND_API_KEY || process.env.RESEND || ''
const FROM = 'Muller y Pérez <contacto@mulleryperez.cl>'
const GESTION = 'gestionclientes@mulleryperez.cl'
const DRY_RUN = process.argv.includes('--dry-run')

var clientes = [
  // ALD — 2 facturas (mar + abr)
  { cliente: 'ALD Automotora', email: GESTION, facturas: [
    { num: '2237', mes: 'Marzo 2026', neto: '$750.000', iva: '$142.500', total: '$892.500' },
    { num: '2278', mes: 'Abril 2026', neto: '$750.000', iva: '$142.500', total: '$892.500' },
  ]},
  // CHARRIOT — 2 facturas (abr + may)
  { cliente: 'Charriot', email: 'proveedores@charriot.cl', cc: ['mcastillo@charriot.cl', GESTION], facturas: [
    { num: '2252', mes: 'Abril 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
    { num: '2317', mes: 'Mayo 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
  ]},
  // ZERO WATER — 2 facturas (abr + may)
  { cliente: 'Zero Water', email: 'rodrigo.garfias@zerowater.cl', cc: ['nicolas.ibarra@zerowater.cl', GESTION], facturas: [
    { num: '2255', mes: 'Abril 2026', neto: '$720.000', iva: '$136.800', total: '$856.800' },
    { num: '2320', mes: 'Mayo 2026', neto: '$720.000', iva: '$136.800', total: '$856.800' },
  ]},
  // GRANAROLO — 4 facturas (abr fee + abr publi + may fee + may publi)
  { cliente: 'Granarolo', email: 'elisa.gonzalez@granarolo.cl', cc: [GESTION], facturas: [
    { num: '2256', mes: 'Abril 2026', concepto: 'Fee', neto: '$300.000', iva: '$57.000', total: '$357.000' },
    { num: '2257', mes: 'Abril 2026', concepto: 'Publicidad', neto: '$99.987', iva: '$18.998', total: '$118.985' },
    { num: '2321', mes: 'Mayo 2026', concepto: 'Fee', neto: '$300.000', iva: '$57.000', total: '$357.000' },
    { num: '2322', mes: 'Mayo 2026', concepto: 'Publicidad', neto: '$99.987', iva: '$18.998', total: '$118.985' },
  ]},
  // Atacama Experience — 2 facturas (abr + may)
  { cliente: 'Atacama Experience', email: GESTION, facturas: [
    { num: '2279', mes: 'Abril 2026', neto: '$590.000', iva: '$112.100', total: '$702.100' },
    { num: '2342', mes: 'Mayo 2026', neto: '$590.000', iva: '$112.100', total: '$702.100' },
  ]},
  // Homar — 1 factura (abr)
  { cliente: 'Homar', email: GESTION, facturas: [
    { num: '2280', mes: 'Abril 2026', neto: '$650.000', iva: '$123.500', total: '$773.500' },
  ]},
  // La tia foca — 1 factura (abr)
  { cliente: 'La Tía Foca', email: GESTION, facturas: [
    { num: '2281', mes: 'Abril 2026', neto: '$350.000', iva: '$66.500', total: '$416.500' },
  ]},
  // Reciclados — 1 factura (abr)
  { cliente: 'Reciclados', email: GESTION, facturas: [
    { num: '2299', mes: 'Abril 2026', neto: '$900.000', iva: '$171.000', total: '$1.071.000' },
  ]},
  // SWING — 1 factura (may)
  { cliente: 'Swing', email: GESTION, facturas: [
    { num: '2309', mes: 'Mayo 2026', neto: '$1.550.000', iva: '$294.500', total: '$1.844.500' },
  ]},
  // ANTARTIC
  { cliente: 'Antartic', email: 'mgutierrez@antartic.cl', cc: ['jose@antartic.cl', GESTION], facturas: [
    { num: '2310', mes: 'Mayo 2026', neto: '$500.000', iva: '$95.000', total: '$595.000' },
  ]},
  // DEZAR — 4 facturas (may)
  { cliente: 'Dezar', email: GESTION, facturas: [
    { num: '2311', mes: 'Mayo 2026', concepto: 'Viña', neto: '$147.000', iva: '$27.930', total: '$174.930' },
    { num: '2312', mes: 'Mayo 2026', concepto: 'Santiago', neto: '$343.000', iva: '$65.170', total: '$408.170' },
    { num: '2316', mes: 'Mayo 2026', concepto: 'Viña Publicidad', neto: '$187.000', iva: '$35.530', total: '$222.530' },
    { num: '2315', mes: 'Mayo 2026', concepto: 'Santiago Publicidad', neto: '$293.000', iva: '$55.670', total: '$348.670' },
  ]},
  // ADIMAC
  { cliente: 'Adimac', email: 'jcamblor@andamiosadimac.cl', cc: [GESTION], facturas: [
    { num: '2318', mes: 'Mayo 2026', neto: '$504.000', iva: '$95.760', total: '$599.760' },
  ]},
  // SISTEMATICOS
  { cliente: 'Sistemáticos', email: 'andrea.c@sistematicos.cl', cc: [GESTION], facturas: [
    { num: '2319', mes: 'Mayo 2026', neto: '$577.500', iva: '$109.725', total: '$687.225' },
  ]},
  // PROACOGIDA
  { cliente: 'Fundación Proacogida', email: 'alejandra.catan@proacogida.cl', cc: [GESTION], facturas: [
    { num: '2323', mes: 'Mayo 2026', neto: '$200.000', iva: '$38.000', total: '$238.000' },
  ]},
  // ELITSOFT
  { cliente: 'Elitsoft', email: 'constanza.flores@elitsoft-chile.com', cc: ['rodolfo.costa@elitsoft-chile.com', GESTION], facturas: [
    { num: '2324', mes: 'Mayo 2026', neto: '$550.000', iva: '$104.500', total: '$654.500' },
  ]},
  // INVAS
  { cliente: 'Invas', email: 'ncrespo@impruvex.com', cc: [GESTION], facturas: [
    { num: '2325', mes: 'Mayo 2026', neto: '$650.000', iva: '$123.500', total: '$773.500' },
  ]},
  // FIRSTPACK
  { cliente: 'Firstpack', email: 'jdeliz@inversol.cl', cc: ['nhassi@inversol.cl', GESTION], facturas: [
    { num: '2326', mes: 'Mayo 2026', neto: '$550.000', iva: '$104.500', total: '$654.500' },
  ]},
  // STOCK INMOBILIARIA
  { cliente: 'Stock Inmobiliaria', email: 'mfroimovich@mfroimovich.cl', cc: ['paguilar@mfroimovich.cl', GESTION], facturas: [
    { num: '2327', mes: 'Mayo 2026', neto: '$300.000', iva: '$57.000', total: '$357.000' },
  ]},
  // VEMOSTUAUTO
  { cliente: 'Vemostuauto', email: 'ventas@vemostuauto.cl', cc: [GESTION], facturas: [
    { num: '2328', mes: 'Mayo 2026', neto: '$250.000', iva: '$47.500', total: '$297.500' },
  ]},
  // SILLAS PREGIATA
  { cliente: 'Sillas Pregiata', email: 'jdeliz@inversol.cl', cc: ['nhassi@inversol.cl', GESTION], facturas: [
    { num: '2329', mes: 'Mayo 2026', neto: '$400.000', iva: '$76.000', total: '$476.000' },
  ]},
  // POWER ENERGY
  { cliente: 'Power Energy', email: 'svillagra@grupopower.cl', cc: ['leonardo.ormazabal@powerenergy.cl', 'jtorres@powerenergy.cl', GESTION], facturas: [
    { num: '2330', mes: 'Mayo 2026', neto: '$950.000', iva: '$180.500', total: '$1.130.500' },
  ]},
  // GENERA
  { cliente: 'Genera', email: 'ncarrilo@genera.cl', cc: ['acamus@genera.cl', GESTION], facturas: [
    { num: '2331', mes: 'Mayo 2026', neto: '$2.000.000', iva: '$380.000', total: '$2.380.000' },
  ]},
  // JP PROCESOS
  { cliente: 'JP Procesos Agroindustriales', email: 'jai.poblete@gmail.com', cc: [GESTION], facturas: [
    { num: '2332', mes: 'Mayo 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
  ]},
  // FORCMIN
  { cliente: 'Forcmin', email: GESTION, facturas: [
    { num: '2333', mes: 'Mayo 2026', neto: '$350.000', iva: '$66.500', total: '$416.500' },
  ]},
  // TECNOMAT
  { cliente: 'Empresas Tecnomat', email: GESTION, facturas: [
    { num: '2334', mes: 'Mayo 2026', neto: '$950.000', iva: '$180.500', total: '$1.130.500' },
  ]},
  // DISTEC
  { cliente: 'Distec', email: GESTION, facturas: [
    { num: '2335', mes: 'Mayo 2026', neto: '$550.000', iva: '$104.500', total: '$654.500' },
  ]},
  // RILAY — 2 facturas
  { cliente: 'Rilay', email: GESTION, facturas: [
    { num: '2336', mes: 'Mayo 2026', concepto: 'Fee', neto: '$1.000.000', iva: '$190.000', total: '$1.190.000' },
    { num: '2339', mes: 'Mayo 2026', concepto: 'Publicidad', neto: '$1.350.000', iva: '$256.500', total: '$1.606.500' },
  ]},
  // FUXIONLOGISTICS
  { cliente: 'FuxionLogistics', email: GESTION, facturas: [
    { num: '2337', mes: 'Mayo 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
  ]},
  // PINEAPPLE STORE
  { cliente: 'Pineapple Store', email: GESTION, facturas: [
    { num: '2338', mes: 'Mayo 2026', neto: '$325.000', iva: '$61.750', total: '$386.750' },
  ]},
  // ONEWAITE
  { cliente: 'OneWaite', email: GESTION, facturas: [
    { num: '2340', mes: 'Mayo 2026', neto: '$720.000', iva: '$136.800', total: '$856.800' },
  ]},
  // HL Soluciones
  { cliente: 'HL Soluciones', email: GESTION, facturas: [
    { num: '2341', mes: 'Mayo 2026', neto: '$750.000', iva: '$142.500', total: '$892.500' },
  ]},
  // Bytestore
  { cliente: 'Bytestore', email: GESTION, facturas: [
    { num: '2343', mes: 'Mayo 2026', neto: '$750.000', iva: '$142.500', total: '$892.500' },
  ]},
  // Fuhl
  { cliente: 'Fuhl', email: GESTION, facturas: [
    { num: '2344', mes: 'Mayo 2026', neto: '$650.000', iva: '$123.500', total: '$773.500' },
  ]},
]

function generarHTML(c) {
  var totalGeneral = 0
  var filasFacturas = c.facturas.map(function(f) {
    var monto = parseInt((f.total || '0').replace(/[$.]/g, '').replace(',', ''))
    totalGeneral += monto
    var concepto = f.concepto ? ' — ' + f.concepto : ''
    return '<tr>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">' + f.num + '</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">' + f.mes + concepto + '</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">' + f.neto + '</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">' + f.iva + '</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">' + f.total + '</td>'
      + '</tr>'
  }).join('')

  return '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;color:#1a1a1a;">'
    + '<div style="background:linear-gradient(135deg,#2563eb,#6366f1);color:white;padding:24px 28px;border-radius:12px 12px 0 0;">'
    + '<h1 style="margin:0;font-size:20px;font-weight:800;">Factura pendiente — Mayo 2026</h1>'
    + '<p style="margin:4px 0 0;font-size:14px;opacity:0.9;">' + c.cliente + '</p>'
    + '</div>'
    + '<div style="background:white;padding:24px 28px;border:1px solid #e5e7eb;border-top:none;">'
    + '<p style="font-size:14px;line-height:1.6;color:#374151;">Estimado equipo de ' + c.cliente + ',</p>'
    + '<p style="font-size:14px;line-height:1.6;color:#374151;">Junto con saludar, adjuntamos la(s) factura(s) correspondiente(s) a los servicios de marketing digital prestados. Agradecemos gestionar el pago a la brevedad.</p>'
    + '<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">'
    + '<thead><tr style="background:#0f172a;color:white;">'
    + '<th style="padding:8px 12px;text-align:left;">N° Factura</th>'
    + '<th style="padding:8px 12px;text-align:left;">Período</th>'
    + '<th style="padding:8px 12px;text-align:right;">Neto</th>'
    + '<th style="padding:8px 12px;text-align:right;">IVA</th>'
    + '<th style="padding:8px 12px;text-align:right;">Total</th>'
    + '</tr></thead><tbody>' + filasFacturas + '</tbody></table>'
    + (c.facturas.length > 1 ? '<p style="font-size:13px;color:#6b7280;text-align:right;">Total pendiente: <strong style="color:#0f172a;">$' + totalGeneral.toLocaleString('es-CL') + '</strong></p>' : '')
    + '<p style="font-size:14px;line-height:1.6;color:#374151;margin-top:16px;">Quedamos atentos ante cualquier consulta.</p>'
    + '<p style="font-size:14px;color:#374151;">Saludos cordiales,<br><strong>Muller y Pérez</strong></p>'
    + '</div>'
    + '<div style="padding:12px 28px;background:#f8fafc;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center;">'
    + '<p style="margin:0;font-size:11px;color:#94a3b8;">Muller y Pérez · contacto@mulleryperez.cl · +56 9 5419 7432</p>'
    + '</div></div>'
}

async function enviar() {
  console.log('=== ENVÍO DE FACTURAS MAYO 2026 ===')
  console.log('Clientes: ' + clientes.length)
  console.log('Facturas totales: ' + clientes.reduce(function(s, c) { return s + c.facturas.length }, 0))
  console.log('Modo: ' + (DRY_RUN ? 'DRY-RUN (no envía)' : 'REAL'))
  console.log('')

  var enviados = 0, errores = 0

  for (var i = 0; i < clientes.length; i++) {
    var c = clientes[i]
    var html = generarHTML(c)
    var subject = 'Factura Mayo 2026 — ' + c.cliente + ' — M&P'

    // Adjuntar PDFs
    var attachments = []
    for (var j = 0; j < c.facturas.length; j++) {
      var num = c.facturas[j].num
      var pdfPath = '/Users/chmuller5gmail.com/Downloads/' + num + '.pdf'
      if (fs.existsSync(pdfPath)) {
        var content = fs.readFileSync(pdfPath).toString('base64')
        attachments.push({ filename: 'Factura_' + num + '_MYP.pdf', content: content })
      } else {
        console.log('  ⚠️ PDF no encontrado: ' + pdfPath)
      }
    }

    var to = [GESTION]
    var cc = c.cc || []
    // Si el email principal es gestión, no duplicar en CC
    if (c.email === GESTION) cc = cc.filter(function(e) { return e !== GESTION })

    var factNums = c.facturas.map(function(f) { return f.num }).join(', ')
    console.log((i + 1) + '/' + clientes.length + ' ' + c.cliente + ' → ' + to.join(', ') + (cc.length ? ' CC: ' + cc.join(', ') : '') + ' | Facturas: ' + factNums + ' | PDFs: ' + attachments.length)

    if (DRY_RUN) { enviados++; continue }

    try {
      var payload = { from: FROM, to: to, subject: subject, html: html }
      if (cc.length > 0) payload.cc = cc
      if (attachments.length > 0) payload.attachments = attachments

      var res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      var data = await res.json()
      if (res.ok) {
        console.log('  ✅ Enviado: ' + data.id)
        enviados++
      } else {
        console.log('  ❌ Error: ' + JSON.stringify(data))
        errores++
      }
    } catch (e) {
      console.log('  ❌ Error: ' + e.message)
      errores++
    }

    // Pausa entre envíos para no saturar Resend
    await new Promise(function(r) { setTimeout(r, 1500) })
  }

  console.log('\n=== RESULTADO ===')
  console.log('Enviados: ' + enviados + ' | Errores: ' + errores)
}

enviar().catch(function(e) { console.error(e); process.exit(1) })
