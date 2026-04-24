// radar-validar-cuentas.js
// Valida que los handles de IG y LI de cada suscriptor existen
// Se corre antes del pipeline principal para evitar gastar créditos Apify en cuentas rotas
// Usa: fetch directo a páginas públicas (sin Apify, $0 costo)
// Actualiza: clipping_suscripciones.cuentas con campo "validada" true/false
// Requiere: SUPABASE_URL, SUPABASE_SERVICE_KEY

var fetch = require('node-fetch')
var supabaseLib = require('@supabase/supabase-js')

var supabase = supabaseLib.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
var RESEND_KEY = process.env.RESEND

// ═══ VALIDADORES POR RED ═══

async function validarInstagram(handle) {
  try {
    var url = 'https://www.instagram.com/' + handle + '/'
    var r = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      redirect: 'follow',
      timeout: 10000,
    })
    // 200 = existe, 404 = no existe, redirect a login = probablemente existe (privada)
    if (r.status === 200) {
      var body = await r.text()
      // Si tiene "Page Not Found" o "Sorry, this page isn't available" -> no existe
      if (body.includes('Page Not Found') || body.includes("Sorry, this page isn't available")) {
        return { valida: false, motivo: 'Cuenta no encontrada' }
      }
      return { valida: true, motivo: null }
    }
    if (r.status === 404) return { valida: false, motivo: 'Cuenta no existe (404)' }
    // redirect = probablemente login wall, asumimos que existe
    return { valida: true, motivo: null }
  } catch (e) {
    return { valida: false, motivo: 'Error de conexión: ' + e.message }
  }
}

async function validarLinkedIn(handle) {
  try {
    var url = 'https://www.linkedin.com/company/' + handle + '/'
    var r = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      redirect: 'follow',
      timeout: 10000,
    })
    // Detectar redirect a otro handle (ej: bukhr → buk-cl)
    var finalUrl = r.url || ''
    var handleCorrecto = null
    var matchCompany = finalUrl.match(/linkedin\.com\/company\/([^\/\?]+)/)
    if (matchCompany && matchCompany[1].toLowerCase() !== handle.toLowerCase()) {
      handleCorrecto = matchCompany[1]
    }
    if (r.status === 200) {
      var body = await r.text()
      if (body.includes('Page not found') || body.includes('page-not-found')) {
        return { valida: false, motivo: 'Empresa no encontrada en LinkedIn' }
      }
      if (handleCorrecto) {
        return { valida: true, motivo: 'Redirige a ' + handleCorrecto + ' — handle corregido automáticamente', handle_correcto: handleCorrecto }
      }
      return { valida: true, motivo: null }
    }
    if (r.status === 404) return { valida: false, motivo: 'Empresa no existe en LinkedIn (404)' }
    if (r.status === 999) return { valida: true, motivo: null }
    return { valida: true, motivo: null }
  } catch (e) {
    return { valida: false, motivo: 'Error de conexión: ' + e.message }
  }
}

// ═══ VALIDAR CUENTA INDIVIDUAL ═══

async function validarCuenta(cuenta) {
  var red = (cuenta.red || '').toLowerCase()
  var handle = (cuenta.handle || '').trim()

  if (!handle) return { valida: false, motivo: 'Handle vacío' }

  // Limpiar handle: quitar URLs completas, dejar solo el handle
  handle = handle.replace(/https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/https?:\/\/(www\.)?linkedin\.com\/company\//i, '')
    .replace(/\/$/, '')
    .replace(/@/, '')

  if (red === 'instagram') return await validarInstagram(handle)
  if (red === 'linkedin') return await validarLinkedIn(handle)
  if (red === 'facebook') return { valida: true, motivo: null } // FB not supported, skip validation
  if (red === 'prensa') return { valida: true, motivo: null } // prensa no se valida

  return { valida: false, motivo: 'Red no reconocida: ' + red }
}

// ═══ MAIN ═══

async function main() {
  var targetId = null
  var args = process.argv.slice(2)
  for (var i = 0; i < args.length; i++) {
    if (args[i].startsWith('--id=')) targetId = args[i].replace('--id=', '')
  }

  var query = supabase.from('clipping_suscripciones')
    .select('id, email, nombre, cuentas, estado')
    .in('estado', ['activo', 'trial'])

  if (targetId) query = query.eq('id', targetId)

  var { data: subs, error } = await query
  if (error) { console.error('Error Supabase: ' + error.message); process.exit(1) }
  if (!subs || subs.length === 0) { console.log('Sin suscriptores para validar'); return }

  console.log('Validando cuentas de ' + subs.length + ' suscriptor(es)...\n')

  for (var si = 0; si < subs.length; si++) {
    var sub = subs[si]
    var cuentas = sub.cuentas || []
    console.log('━━━ ' + (sub.nombre || sub.email) + ' (' + cuentas.length + ' cuentas) ━━━')

    var cuentasActualizadas = []
    var totalValidas = 0
    var totalInvalidas = 0

    for (var ci = 0; ci < cuentas.length; ci++) {
      var cuenta = cuentas[ci]
      var resultado = await validarCuenta(cuenta)

      // Pausa entre requests para no ser bloqueado
      await new Promise(function(resolve) { setTimeout(resolve, 1500) })

      var status = resultado.valida ? '✓' : '✗'
      var color = resultado.valida ? '' : ' ← INVÁLIDA'
      console.log('   ' + status + ' ' + cuenta.red + ' @' + cuenta.handle + ' (' + (cuenta.nombre || '-') + ')' + (resultado.motivo ? ' — ' + resultado.motivo : '') + color)

      cuenta.validada = resultado.valida
      cuenta.motivo_invalida = resultado.motivo || null
      cuenta.fecha_validacion = new Date().toISOString()
      // LinkedIn: NO auto-corregir handles. Apify necesita el handle original, no el redirect.
      // Solo informar si hay redirect para que el usuario sepa.
      if (resultado.handle_correcto) {
        console.log('   ℹ LinkedIn redirige ' + cuenta.handle + ' → ' + resultado.handle_correcto + ' (NO se corrige, Apify usa el original)')
      }
      cuentasActualizadas.push(cuenta)

      if (resultado.valida) totalValidas++
      else totalInvalidas++
    }

    // Actualizar en Supabase
    await supabase.from('clipping_suscripciones')
      .update({ cuentas: cuentasActualizadas, updated_at: new Date().toISOString() })
      .eq('id', sub.id)

    console.log('   Resultado: ' + totalValidas + ' válidas, ' + totalInvalidas + ' inválidas\n')

    // Notificar al suscriptor si hay cuentas inválidas
    if (totalInvalidas > 0 && RESEND_KEY) {
      var invalidasList = cuentasActualizadas.filter(function(c) { return !c.validada })
      var configUrl = 'https://www.mulleryperez.cl/copilot/configurar/' + sub.id

      var emailHtml = '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:580px;margin:0 auto;">'
      emailHtml += '<div style="background:linear-gradient(135deg,#4338CA,#7C3AED);color:white;padding:24px 28px;border-radius:16px 16px 0 0;">'
      emailHtml += '<p style="margin:0;font-size:11px;opacity:0.6;letter-spacing:1px;">M&P COPILOT</p>'
      emailHtml += '<h1 style="margin:8px 0 0;font-size:20px;font-weight:800;">Cuentas que necesitan revisión</h1></div>'
      emailHtml += '<div style="background:white;padding:24px 28px;border:1px solid #e5e7eb;border-radius:0 0 16px 16px;">'
      emailHtml += '<p style="font-size:14px;color:#374151;line-height:1.7;">Hola ' + (sub.nombre || sub.email.split('@')[0]) + ',</p>'
      emailHtml += '<p style="font-size:14px;color:#374151;line-height:1.7;">Detectamos que <strong>' + totalInvalidas + ' cuenta(s)</strong> de tu Copilot no pudieron ser verificadas. Esto significa que no vamos a poder monitorear esas cuentas hasta que las corrijas.</p>'
      emailHtml += '<div style="background:#FEF2F2;padding:16px;border-radius:10px;margin:16px 0;border:1px solid #FECACA;">'
      for (var ii = 0; ii < invalidasList.length; ii++) {
        var inv = invalidasList[ii]
        emailHtml += '<p style="margin:0 0 6px;font-size:13px;color:#991B1B;"><strong>' + inv.red + '</strong> @' + inv.handle + ' — ' + (inv.motivo_invalida || 'No encontrada') + '</p>'
      }
      emailHtml += '</div>'
      emailHtml += '<p style="font-size:14px;color:#374151;line-height:1.7;">Puedes corregir los handles desde tu panel de configuración:</p>'
      emailHtml += '<div style="text-align:center;margin:20px 0;">'
      emailHtml += '<a href="' + configUrl + '" style="display:inline-block;background:#4338CA;color:white;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">Corregir cuentas</a></div>'
      emailHtml += '<p style="font-size:13px;color:#9CA3AF;">Las ' + totalValidas + ' cuentas válidas seguirán siendo monitoreadas normalmente.</p>'
      emailHtml += '</div></div>'

      try {
        var destinos = (sub.emails_destino && sub.emails_destino.length > 0) ? sub.emails_destino : [sub.email]
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'M&P Copilot <contacto@mulleryperez.cl>',
            to: destinos,
            subject: (sub.nombre || 'Copilot') + ' | ' + totalInvalidas + ' cuenta(s) requieren revisión',
            html: emailHtml,
          })
        })
        console.log('   Email de aviso enviado a ' + destinos.join(', '))
      } catch (e) { console.log('   Error enviando aviso: ' + e.message) }
    }
  }

  console.log('Validación completada.')
}

main().catch(function(e) { console.error(e); process.exit(1) })

module.exports = { validarCuenta: validarCuenta }
