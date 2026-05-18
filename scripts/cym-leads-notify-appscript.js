// ===== CONFIGURACION DE CORREDORES POR ZONA =====
var CORREDORES = {
  'la dehesa':  { nombre: 'Eugenia Olave',     email: 'eolave@cympropiedades.cl' },
  'vitacura':   { nombre: 'Daniela Penafiel',  email: 'dpenafiel@cympropiedades.cl' },
  'las condes': { nombre: 'Anita Hernandez',   email: 'anamaria@cympropiedades.cl' },
  'la reina':   { nombre: 'James Robeson',     email: 'jrobeson@cympropiedades.cl' },
  'sca':        { nombre: 'Benjamin Ceballos', email: 'Bcf@cympropiedades.cl' },
  'deptos':     { nombre: 'Caro Paoletti',     email: 'Cpaoletti@cympropiedades.cl' }
};

var CC_MYP = 'contacto@mulleryperez.cl';

function onChangeDetect(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var hojas = sheet.getSheets();
  for (var h = 0; h < hojas.length; h++) {
    var nombre = hojas[h].getName().toLowerCase().trim();
    if (nombre === 'comunas y directores' || nombre === 'configuracion') continue;
    checkNuevosLeads(hojas[h]);
  }
}

function checkNuevosLeads(hoja) {
  var data = hoja.getDataRange().getValues();
  if (data.length < 2) return;
  var headers = [];
  for (var c = 0; c < data[0].length; c++) {
    headers.push(data[0][c].toString().toLowerCase().trim());
  }
  var colNombre = findCol(headers, 'full_name');
  var colTel = findCol(headers, 'phone_number');
  var colEmail = findCol(headers, 'email');
  var colCampaign = findCol(headers, 'campaign_name');
  var colTipo = findCol(headers, 'propiedad');
  var colPresupuesto = findCol(headers, 'presupuesto');
  var colFinanciamiento = findCol(headers, 'financiamiento');
  var colPlazo = findCol(headers, 'plazo');
  var colComuna = findCol(headers, 'comuna');
  var colNotificado = -1;
  for (var k = 0; k < headers.length; k++) {
    if (headers[k] === 'notificado') { colNotificado = k; break; }
  }
  if (colNotificado === -1) {
    colNotificado = headers.length;
    hoja.getRange(1, colNotificado + 1).setValue('notificado');
  }
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var yaNotificado = hoja.getRange(i + 1, colNotificado + 1).getValue();
    if (yaNotificado === 'SI') continue;
    var nombreLead = '';
    if (colNombre !== null) nombreLead = row[colNombre] || '';
    if (!nombreLead) continue;
    var telefono = '';
    if (colTel !== null) telefono = (row[colTel] || '').toString().replace('p:', '');
    var emailLead = '';
    if (colEmail !== null) emailLead = row[colEmail] || '';
    var campaign = '';
    if (colCampaign !== null) campaign = row[colCampaign] || '';
    var tipo = '';
    if (colTipo !== null) tipo = row[colTipo] || '';
    var presupuesto = '';
    if (colPresupuesto !== null) presupuesto = row[colPresupuesto] || '';
    var financiamiento = '';
    if (colFinanciamiento !== null) financiamiento = row[colFinanciamiento] || '';
    var plazo = '';
    if (colPlazo !== null) plazo = row[colPlazo] || '';
    var comuna = '';
    if (colComuna !== null) comuna = row[colComuna] || '';
    var zona = detectarZona(campaign, hoja.getName());
    var corredor = CORREDORES[zona];
    if (!corredor) {
      corredor = { nombre: 'Equipo CyM', email: CC_MYP };
    }
    var telLimpio = telefono.replace(/[^0-9+]/g, '');
    var waLink = 'https://wa.me/' + telLimpio.replace('+', '');
    var subject = 'Nuevo Lead ' + zona.toUpperCase() + ': ' + nombreLead;
    var body = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">'
      + '<div style="background:linear-gradient(135deg,#1B2A4A,#2D4A7A);padding:20px;border-radius:10px 10px 0 0;color:#fff">'
      + '<h2 style="margin:0;font-size:18px">Nuevo Lead - ' + zona.toUpperCase() + '</h2>'
      + '<p style="margin:5px 0 0;opacity:0.8;font-size:13px">CyM Propiedades - ' + new Date().toLocaleDateString('es-CL') + '</p>'
      + '</div>'
      + '<div style="background:#fff;padding:20px;border:1px solid #e5e7eb;border-top:none">'
      + '<table style="width:100%;border-collapse:collapse;font-size:14px">'
      + '<tr><td style="padding:8px 0;color:#6b7280;width:140px"><strong>Nombre</strong></td><td style="padding:8px 0">' + nombreLead + '</td></tr>'
      + '<tr><td style="padding:8px 0;color:#6b7280"><strong>Telefono</strong></td><td style="padding:8px 0"><a href="' + waLink + '" style="color:#25D366;font-weight:bold">' + telefono + '</a></td></tr>'
      + '<tr><td style="padding:8px 0;color:#6b7280"><strong>Email</strong></td><td style="padding:8px 0"><a href="mailto:' + emailLead + '">' + emailLead + '</a></td></tr>';
    if (tipo) body += '<tr><td style="padding:8px 0;color:#6b7280"><strong>Busca</strong></td><td style="padding:8px 0">' + tipo + '</td></tr>';
    if (presupuesto) body += '<tr><td style="padding:8px 0;color:#6b7280"><strong>Presupuesto</strong></td><td style="padding:8px 0">' + presupuesto + '</td></tr>';
    if (financiamiento) body += '<tr><td style="padding:8px 0;color:#6b7280"><strong>Financiamiento</strong></td><td style="padding:8px 0">' + limpiarTexto(financiamiento) + '</td></tr>';
    if (plazo) body += '<tr><td style="padding:8px 0;color:#6b7280"><strong>Plazo</strong></td><td style="padding:8px 0">' + limpiarTexto(plazo) + '</td></tr>';
    if (comuna) body += '<tr><td style="padding:8px 0;color:#6b7280"><strong>Comuna</strong></td><td style="padding:8px 0">' + comuna + '</td></tr>';
    body += '<tr><td style="padding:8px 0;color:#6b7280"><strong>Campana</strong></td><td style="padding:8px 0">' + campaign + '</td></tr>'
      + '</table>'
      + '<div style="margin-top:16px;text-align:center">'
      + '<a href="' + waLink + '" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">Contactar por WhatsApp</a>'
      + '</div>'
      + '</div>'
      + '<div style="background:#f9fafb;padding:12px 20px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;border-top:none;text-align:center;font-size:11px;color:#9ca3af">'
      + 'Notificacion automatica - Muller y Perez para CyM Propiedades'
      + '</div></div>';
    try {
      GmailApp.sendEmail(corredor.email, subject, 'Nuevo lead: ' + nombreLead + ' - ' + telefono, {
        htmlBody: body,
        cc: CC_MYP,
        name: 'CyM Propiedades - Leads'
      });
      hoja.getRange(i + 1, colNotificado + 1).setValue('SI');
    } catch(err) {
      Logger.log('Error enviando email: ' + err);
    }
  }
}

function detectarZona(campaign, sheetName) {
  var texto = (campaign + ' ' + sheetName).toLowerCase();
  if (texto.indexOf('dehesa') > -1) return 'la dehesa';
  if (texto.indexOf('vitacura') > -1) return 'vitacura';
  if (texto.indexOf('las condes') > -1) return 'las condes';
  if (texto.indexOf('la reina') > -1) return 'la reina';
  if (texto.indexOf('sca') > -1) return 'sca';
  if (texto.indexOf('depto') > -1) return 'deptos';
  if (texto.indexOf('departamento') > -1) return 'deptos';
  return sheetName.toLowerCase().trim();
}

function findCol(headers, keyword) {
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].indexOf(keyword) > -1) return i;
  }
  return null;
}

function limpiarTexto(texto) {
  return texto.toString()
    .replace(/_/g, ' ')
    .replace(/credito hipotecario/i, 'Credito Hipotecario')
    .replace(/compra al contado/i, 'Compra al Contado');
}

function instalarTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger('onChangeDetect')
    .timeBased()
    .everyMinutes(1)
    .create();
  Logger.log('Trigger instalado: revisa cada 1 minuto');
}
