const fetch = globalThis.fetch || require('node-fetch')
const fs = require('fs')
const RESEND_KEY = 're_e6Gs2cLm_9mCewc5qHqsFQeZDX5GHSTTp'
const FROM = 'Muller y Pérez <contacto@mulleryperez.cl>'
const GESTION = 'gestionclientes@mulleryperez.cl'

var BANCO = '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px 20px;margin:16px 0;">'
  + '<p style="font-size:13px;font-weight:700;color:#166534;margin:0 0 8px;">Datos de transferencia:</p>'
  + '<p style="font-size:13px;color:#166534;margin:2px 0;"><strong>Banco:</strong> Banco Santander</p>'
  + '<p style="font-size:13px;color:#166534;margin:2px 0;"><strong>Cuenta corriente:</strong> 0-000-7762290-0</p>'
  + '<p style="font-size:13px;color:#166534;margin:2px 0;"><strong>RUT:</strong> 77.125.595-7</p>'
  + '<p style="font-size:13px;color:#166534;margin:2px 0;"><strong>Razón Social:</strong> Muller y Pérez SPA</p>'
  + '<p style="font-size:13px;color:#166534;margin:2px 0;"><strong>Mail comprobante:</strong> gestionclientes@mulleryperez.com</p>'
  + '</div>'

var clientes = [
  // ═══ MAYO PENDIENTES ═══
  { cliente: 'Charriot', emails: ['proveedores@charriot.cl', 'mcastillo@charriot.cl'], facturas: [
    { num: '2317', mes: 'Mayo 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
    { num: '2372', mes: 'Junio 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
  ]},
  { cliente: 'Granarolo', emails: ['elisa.gonzalez@granarolo.cl', 'macarena.dougnac@granarolo.cl'], facturas: [
    { num: '2321', mes: 'Mayo 2026', concepto: 'Fee', neto: '$300.000', iva: '$57.000', total: '$357.000' },
    { num: '2322', mes: 'Mayo 2026', concepto: 'Publicidad', neto: '$99.987', iva: '$18.998', total: '$118.985' },
    { num: '2375', mes: 'Junio 2026', concepto: 'Fee', neto: '$300.000', iva: '$57.000', total: '$357.000' },
    { num: '2376', mes: 'Junio 2026', concepto: 'Publicidad', neto: '$99.896', iva: '$18.980', total: '$118.876' },
  ]},
  { cliente: 'Genera', emails: ['ncarrillo@genera.cl'], facturas: [
    { num: '2331', mes: 'Mayo 2026', neto: '$2.000.000', iva: '$380.000', total: '$2.380.000' },
    { num: '2384', mes: 'Junio 2026', neto: '$2.000.000', iva: '$380.000', total: '$2.380.000' },
  ]},
  { cliente: 'ALD Automotora', emails: ['mmontes@gandarillas.cl'], facturas: [
    { num: '2350', mes: 'Mayo 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
    { num: '2396', mes: 'Junio 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
  ]},
  { cliente: 'Atacama Experience', emails: [], facturas: [
    { num: '2342', mes: 'Mayo 2026', neto: '$590.000', iva: '$112.100', total: '$702.100' },
    { num: '2397', mes: 'Junio 2026', neto: '$590.000', iva: '$112.100', total: '$702.100' },
  ]},
  { cliente: 'Reciclados', emails: [], facturas: [
    { num: '2349', mes: 'Mayo 2026', neto: '$900.000', iva: '$171.000', total: '$1.071.000' },
    { num: '2398', mes: 'Junio 2026', neto: '$900.000', iva: '$171.000', total: '$1.071.000' },
  ]},
  { cliente: '4Life', emails: [], facturas: [
    { num: '2352', mes: 'Mayo 2026', neto: '$750.000', iva: '$142.500', total: '$892.500' },
    { num: '2400', mes: 'Junio 2026', neto: '$750.000', iva: '$142.500', total: '$892.500', nota: 'Mes vencido' },
  ]},
  { cliente: 'Halterlift', emails: [], facturas: [
    { num: '2355', mes: 'Mayo 2026', neto: '$900.000', iva: '$171.000', total: '$1.071.000' },
  ]},
  { cliente: 'Premios Increíbles', emails: [], facturas: [
    { num: '2360', mes: 'Mayo 2026', neto: '$2.500.000', iva: '$475.000', total: '$2.975.000' },
  ]},
  // ═══ JUNIO PENDIENTES ═══
  { cliente: 'Antartic', emails: ['mgutierrez@antartic.cl', 'jose@antartic.cl'], facturas: [
    { num: '2367', mes: 'Junio 2026', neto: '$500.000', iva: '$95.000', total: '$595.000' },
  ]},
  { cliente: 'Dezar', emails: ['rodrigo@dezarrentacar.com', 'francisco.ortuzar@mail.udp.cl'], facturas: [
    { num: '2368', mes: 'Junio 2026', concepto: 'Viña Fee', neto: '$147.000', iva: '$27.930', total: '$174.930' },
    { num: '2369', mes: 'Junio 2026', concepto: 'Santiago Fee', neto: '$343.000', iva: '$65.170', total: '$408.170' },
    { num: '2370', mes: 'Junio 2026', concepto: 'Viña Publicidad', neto: '$187.000', iva: '$35.530', total: '$222.530' },
    { num: '2371', mes: 'Junio 2026', concepto: 'Santiago Publicidad', neto: '$293.000', iva: '$55.670', total: '$348.670' },
  ]},
  { cliente: 'Sistemáticos', emails: ['andrea.c@sistematicos.cl'], facturas: [
    { num: '2373', mes: 'Junio 2026', neto: '$577.500', iva: '$109.725', total: '$687.225' },
  ]},
  { cliente: 'Zero Water', emails: ['rodrigo.garfias@zerowater.cl', 'nicolas.ibarra@zerowater.cl'], facturas: [
    { num: '2374', mes: 'Junio 2026', concepto: 'Fee', neto: '$720.000', iva: '$136.800', total: '$856.800' },
  ]},
  { cliente: 'Elitsoft', emails: ['constanza.flores@elitsoft-chile.com', 'rodolfo.costa@elitsoft-chile.com'], facturas: [
    { num: '2377', mes: 'Junio 2026', neto: '$550.000', iva: '$104.500', total: '$654.500' },
  ]},
  { cliente: 'Invas', emails: ['ncrespo@impruvex.com', 'jvio@impruvex.com'], facturas: [
    { num: '2378', mes: 'Junio 2026', neto: '$650.000', iva: '$123.500', total: '$773.500' },
  ]},
  { cliente: 'Firstpack', emails: ['jdeliz@inversol.cl', 'nhassi@inversol.cl'], facturas: [
    { num: '2379', mes: 'Junio 2026', neto: '$550.000', iva: '$104.500', total: '$654.500' },
  ]},
  { cliente: 'Stock Inmobiliaria', emails: ['mfroimovich@mfroimovich.cl'], facturas: [
    { num: '2380', mes: 'Junio 2026', neto: '$300.000', iva: '$57.000', total: '$357.000' },
  ]},
  { cliente: 'Vemostuauto', emails: ['ventas@vemostuauto.cl'], facturas: [
    { num: '2381', mes: 'Junio 2026', neto: '$250.000', iva: '$47.500', total: '$297.500' },
  ]},
  { cliente: 'Sillas Pregiata', emails: ['jdeliz@inversol.cl', 'nhassi@inversol.cl'], facturas: [
    { num: '2382', mes: 'Junio 2026', neto: '$400.000', iva: '$76.000', total: '$476.000' },
  ]},
  { cliente: 'Power Energy', emails: ['svillagra@grupopower.cl', 'leonardo.ormazabal@powerenergy.cl'], facturas: [
    { num: '2383', mes: 'Junio 2026', neto: '$950.000', iva: '$180.500', total: '$1.130.500' },
  ]},
  { cliente: 'JP Procesos Agroindustriales', emails: ['jai.poblete@gmail.com'], facturas: [
    { num: '2385', mes: 'Junio 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
  ]},
  { cliente: 'Empresas Tecnomat', emails: ['contabilidad@empresastecnomat.cl', 'cibar@empresastecnomat.cl'], facturas: [
    { num: '2386', mes: 'Junio 2026', neto: '$950.000', iva: '$180.500', total: '$1.130.500' },
  ]},
  { cliente: 'Distec', emails: ['alex.matheu@distecchile.cl'], facturas: [
    { num: '2387', mes: 'Junio 2026', neto: '$550.000', iva: '$104.500', total: '$654.500', nota: 'Mes vencido' },
  ]},
  { cliente: 'Rilay', emails: ['carolyn@rilay.cl'], facturas: [
    { num: '2388', mes: 'Junio 2026', concepto: 'Fee', neto: '$1.000.000', iva: '$190.000', total: '$1.190.000' },
    { num: '2389', mes: 'Junio 2026', concepto: 'Publicidad', neto: '$1.800.000', iva: '$342.000', total: '$2.142.000' },
  ]},
  { cliente: 'FuxionLogistics', emails: ['Rodrigo.conejera@fuxionlogistics.cl', 'Nancy.avila@fuxionlogistics.cl'], facturas: [
    { num: '2390', mes: 'Junio 2026', neto: '$450.000', iva: '$85.500', total: '$535.500' },
  ]},
  { cliente: 'Pineapple Store', emails: ['jjsepulveda@pineapplestore.cl'], facturas: [
    { num: '2391', mes: 'Junio 2026', neto: '$325.000', iva: '$61.750', total: '$386.750', nota: 'Mes vencido' },
  ]},
  { cliente: 'OneWaite', emails: ['r.cumsille@onewaite.com', 'n.lopez@onewaite.com'], facturas: [
    { num: '2392', mes: 'Junio 2026', concepto: 'OneWaite 1', neto: '$260.000', iva: '$49.400', total: '$309.400' },
    { num: '2393', mes: 'Junio 2026', concepto: 'OneWaite 2', neto: '$260.000', iva: '$49.400', total: '$309.400' },
    { num: '2394', mes: 'Junio 2026', concepto: 'OneWaite 3', neto: '$260.000', iva: '$49.400', total: '$309.400' },
  ]},
  { cliente: 'HL Soluciones', emails: ['gonzalo.labra@hlsoluciones.cl'], facturas: [
    { num: '2395', mes: 'Junio 2026', neto: '$750.000', iva: '$142.500', total: '$892.500' },
  ]},
  { cliente: 'SGO', emails: [], facturas: [
    { num: '2399', mes: 'Junio 2026', neto: '$1.200.000', iva: '$228.000', total: '$1.428.000' },
  ]},
  { cliente: 'CyM Propiedades', emails: [], facturas: [
    { num: '2401', mes: 'Junio 2026', neto: '$1.900.000', iva: '$361.000', total: '$2.261.000' },
  ]},
  { cliente: 'Devuelve mi Pie', emails: [], facturas: [
    { num: '2402', mes: 'Junio 2026', neto: '$800.000', iva: '$152.000', total: '$952.000' },
  ]},
  // ═══ BIENVENIDA + COBRO ═══
  { cliente: 'Voxa', emails: [], bienvenida: true, facturas: [
    { num: '2403', mes: 'Junio 2026', neto: '$700.000', iva: '$133.000', total: '$833.000' },
  ]},
  { cliente: 'Cioccolati', emails: [], bienvenida: true, facturas: [
    { num: '2404', mes: 'Junio 2026', neto: '$950.000', iva: '$180.500', total: '$1.130.500' },
  ]},
  { cliente: 'Irurzun', emails: [], bienvenida: true, facturas: [
    { num: '2405', mes: 'Junio 2026', neto: '$950.000', iva: '$180.500', total: '$1.130.500' },
  ]},
  { cliente: 'PMP', emails: [], bienvenida: true, facturas: [
    { num: '2406', mes: 'Junio 2026', neto: '$650.000', iva: '$123.500', total: '$773.500' },
  ]},
  // ═══ HUALPÉN (con cotización adjunta) ═══
  { cliente: 'Buses Hualpén', emails: ['felipe.munoz@buseshualpen.cl'], hualpen: true, facturas: [
    { num: 'COT-HLP-06-2026', mes: 'Junio 2026', concepto: 'Servicios Mayo 2026', neto: '$952.000', iva: '$180.880', total: '$1.132.880' },
  ]},
]

function generarHTML(c) {
  var totalGeneral = 0
  var filasFacturas = c.facturas.map(function(f) {
    var monto = parseInt((f.total || '0').replace(/[$.\s]/g, '').replace(',', ''))
    totalGeneral += monto
    var concepto = f.concepto ? ' — ' + f.concepto : ''
    var nota = f.nota ? ' <em style="color:#f59e0b;font-size:11px;">(' + f.nota + ')</em>' : ''
    return '<tr>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">' + f.num + '</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">' + f.mes + concepto + nota + '</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">' + f.neto + '</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">' + f.iva + '</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">' + f.total + '</td>'
      + '</tr>'
  }).join('')

  var saludo = c.bienvenida
    ? '<p style="font-size:14px;line-height:1.6;color:#374151;">Estimado equipo de ' + c.cliente + ',</p>'
      + '<p style="font-size:14px;line-height:1.6;color:#374151;">Les damos la bienvenida a Muller y Pérez. Es un gusto comenzar a trabajar juntos. A continuación, adjuntamos la primera factura correspondiente a los servicios de marketing digital.</p>'
      + '<p style="font-size:14px;line-height:1.6;color:#374151;">Agradecemos gestionar el pago dentro del mes en curso.</p>'
    : c.hualpen
    ? '<p style="font-size:14px;line-height:1.6;color:#374151;">Estimado equipo de Buses Hualpén,</p>'
      + '<p style="font-size:14px;line-height:1.6;color:#374151;">Adjuntamos la cotización correspondiente a la Orden de Compra de Junio 2026 por servicios prestados durante Mayo 2026. Agradecemos gestionar el pago dentro del mes en curso.</p>'
    : '<p style="font-size:14px;line-height:1.6;color:#374151;">Estimado equipo de ' + c.cliente + ',</p>'
      + '<p style="font-size:14px;line-height:1.6;color:#374151;">Junto con saludar, adjuntamos la(s) factura(s) correspondiente(s) a los servicios de marketing digital prestados. Agradecemos gestionar el pago dentro del mes en curso.</p>'

  var bancoSection = c.bienvenida ? BANCO : ''

  var totalLine = c.facturas.length > 1
    ? '<p style="font-size:13px;color:#6b7280;text-align:right;">Total pendiente: <strong style="color:#0f172a;">$' + totalGeneral.toLocaleString('es-CL') + '</strong></p>'
    : ''

  var alertaMeses = c.facturas.some(function(f) { return f.mes.includes('Mayo') }) && c.facturas.some(function(f) { return f.mes.includes('Junio') })
    ? '<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:12px 16px;margin:12px 0;">'
      + '<p style="font-size:12px;color:#92400e;margin:0;font-weight:600;">Nota: Hay facturas de más de un mes pendientes de pago.</p></div>'
    : ''

  return '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;color:#1a1a1a;">'
    + '<div style="background:linear-gradient(135deg,#2563eb,#6366f1);color:white;padding:24px 28px;border-radius:12px 12px 0 0;">'
    + '<h1 style="margin:0;font-size:20px;font-weight:800;">' + (c.bienvenida ? 'Bienvenida + Factura' : c.hualpen ? 'Orden de Compra' : 'Factura pendiente') + ' — Junio 2026</h1>'
    + '<p style="margin:4px 0 0;font-size:14px;opacity:0.9;">' + c.cliente + '</p>'
    + '</div>'
    + '<div style="background:white;padding:24px 28px;border:1px solid #e5e7eb;border-top:none;">'
    + saludo
    + '<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">'
    + '<thead><tr style="background:#0f172a;color:white;">'
    + '<th style="padding:8px 12px;text-align:left;">N°</th>'
    + '<th style="padding:8px 12px;text-align:left;">Período</th>'
    + '<th style="padding:8px 12px;text-align:right;">Neto</th>'
    + '<th style="padding:8px 12px;text-align:right;">IVA</th>'
    + '<th style="padding:8px 12px;text-align:right;">Total</th>'
    + '</tr></thead><tbody>' + filasFacturas + '</tbody></table>'
    + totalLine
    + alertaMeses
    + bancoSection
    + '<p style="font-size:14px;line-height:1.6;color:#374151;margin-top:16px;">Quedamos atentos ante cualquier consulta.</p>'
    + '<p style="font-size:14px;color:#374151;">Saludos cordiales,<br><strong>Muller y Pérez</strong></p>'
    + '</div>'
    + '<div style="padding:12px 28px;background:#f8fafc;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center;">'
    + '<p style="margin:0;font-size:11px;color:#94a3b8;">Muller y Pérez · contacto@mulleryperez.cl · +56 9 5419 7432</p>'
    + '</div></div>'
}

async function enviar() {
  console.log('=== ENVÍO DE FACTURAS JUNIO 2026 ===')
  console.log('Clientes: ' + clientes.length)
  console.log('Facturas: ' + clientes.reduce(function(s, c) { return s + c.facturas.length }, 0))
  console.log('Bienvenidas: ' + clientes.filter(function(c) { return c.bienvenida }).length)
  console.log('Destino: ' + GESTION)
  console.log('')

  var enviados = 0, errores = 0

  for (var i = 0; i < clientes.length; i++) {
    var c = clientes[i]
    var html = generarHTML(c)
    var subject = (c.bienvenida ? 'Bienvenida + Factura' : c.hualpen ? 'OC' : 'Factura') + ' Junio 2026 — ' + c.cliente + ' — M&P'

    // Adjuntar PDFs
    var attachments = []
    for (var j = 0; j < c.facturas.length; j++) {
      var num = c.facturas[j].num
      var pdfPath = '/Users/chmuller5gmail.com/Downloads/' + num + '.pdf'
      if (fs.existsSync(pdfPath)) {
        var content = fs.readFileSync(pdfPath).toString('base64')
        attachments.push({ filename: 'Factura_' + num + '_MYP.pdf', content: content })
      }
    }
    // Hualpén: adjuntar cotización
    if (c.hualpen) {
      var cotPath = '/Users/chmuller5gmail.com/Desktop/Cotizaciones/Cotizacion_Buses_Hualpen_Jun_2026.pdf'
      if (fs.existsSync(cotPath)) {
        var cotContent = fs.readFileSync(cotPath).toString('base64')
        attachments.push({ filename: 'Cotizacion_Hualpen_Jun_2026.pdf', content: cotContent })
      }
    }

    var emailData = {
      from: FROM,
      to: [GESTION],
      subject: subject,
      html: html
    }
    if (attachments.length > 0) emailData.attachments = attachments

    var factNums = c.facturas.map(function(f) { return f.num }).join(', ')
    var emailsStr = c.emails.length ? ' → ' + c.emails.join(', ') : ''
    console.log((i + 1) + '/' + clientes.length + ' ' + c.cliente + emailsStr + ' | F: ' + factNums + ' | PDFs: ' + attachments.length + (c.bienvenida ? ' [BIENVENIDA]' : '') + (c.hualpen ? ' [OC+COT]' : ''))

    try {
      var res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      })
      var data = await res.json()
      if (data.id) { enviados++; console.log('  ✅ ' + data.id) }
      else { errores++; console.log('  ❌ ' + JSON.stringify(data).substring(0, 100)) }
    } catch (e) { errores++; console.log('  ❌ ' + e.message) }
  }

  console.log('\n=== RESULTADO ===')
  console.log('Enviados: ' + enviados + ' | Errores: ' + errores)
}

enviar()
