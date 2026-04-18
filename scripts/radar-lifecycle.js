// radar-lifecycle.js
// Envia emails de ciclo de vida para suscriptores Radar
// Cron: diario 08:00 AM Chile (11:00 UTC)
// Dia 0: bienvenida | Dia 5: engagement | Dia 6: fin trial | Post-trial sin pago: desactivacion

var fetch = require('node-fetch')
var { createClient } = require('@supabase/supabase-js')

var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
var RESEND_KEY = process.env.RESEND

async function main() {
  var hoy = new Date()
  var hoyStr = hoy.toISOString().split('T')[0]
  console.log('RADAR LIFECYCLE | ' + hoyStr)

  var result = await supabase.from('clipping_suscripciones').select('*')
  if (result.error) { console.error('BD error:', result.error.message); process.exit(1) }
  var subs = result.data || []
  console.log('Total suscriptores: ' + subs.length)

  for (var i = 0; i < subs.length; i++) {
    var sub = subs[i]
    if (!sub.created_at) continue

    var created = new Date(sub.created_at)
    var diasDesdeCreacion = Math.floor((hoy.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))

    // DIA 0: Bienvenida (solo trials creados hoy)
    if (sub.estado === 'trial' && diasDesdeCreacion === 0) {
      console.log('  Dia 0 (bienvenida): ' + sub.email)
      await enviarEmail(sub.email, 'Bienvenido a Radar | Tu primer informe llega manana',
        emailBienvenida(sub))
    }

    // DIA 5: Engagement
    if (sub.estado === 'trial' && diasDesdeCreacion === 5) {
      console.log('  Dia 5 (engagement): ' + sub.email)
      await enviarEmail(sub.email, 'Llevas 5 dias con Radar | Ya detectaste algo que no sabias?',
        emailDia5(sub))
    }

    // DIA 6: Fin trial manana
    if (sub.estado === 'trial' && diasDesdeCreacion === 6) {
      console.log('  Dia 6 (fin trial): ' + sub.email)
      await enviarEmail(sub.email, 'Tu prueba de Radar termina manana | Elige tu plan',
        emailFinTrial(sub))
    }

    // TRIAL VENCIDO: desactivar
    if (sub.estado === 'trial' && sub.trial_ends && new Date(sub.trial_ends) < hoy) {
      console.log('  Trial vencido: ' + sub.email + ' -> cancelado')
      await supabase.from('clipping_suscripciones')
        .update({ estado: 'cancelado', updated_at: hoy.toISOString() })
        .eq('id', sub.id)
      await enviarEmail(sub.email, 'Tu Radar se desactivo | Reactivalo aqui',
        emailDesactivado(sub))
    }

    // PAGO FALLIDO (suspendido hace mas de 3 dias sin reactivar)
    if (sub.estado === 'suspendido' && sub.updated_at) {
      var diasSuspendido = Math.floor((hoy.getTime() - new Date(sub.updated_at).getTime()) / (1000 * 60 * 60 * 24))
      if (diasSuspendido === 3) {
        console.log('  Pago fallido (3 dias): ' + sub.email)
        await enviarEmail(sub.email, 'Tu pago no se proceso | Actualiza tu tarjeta',
          emailPagoFallido(sub))
      }
    }
  }
  console.log('Lifecycle completado')
}

// ═══ TEMPLATES ═══

function header(titulo, subtitulo) {
  return '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:580px;margin:0 auto;color:#1a1a1a;">'
    + '<div style="background:linear-gradient(135deg,#4338CA,#7C3AED);color:white;padding:28px 32px;border-radius:16px 16px 0 0;">'
    + '<p style="margin:0;font-size:11px;opacity:0.6;letter-spacing:1px;">RADAR BY MULLER Y PEREZ</p>'
    + '<h1 style="margin:8px 0 4px;font-size:22px;font-weight:800;">' + titulo + '</h1>'
    + '<p style="margin:0;font-size:14px;opacity:0.9;">' + subtitulo + '</p>'
    + '</div>'
}

function footer() {
  return '<div style="padding:20px 28px;background:#1e1b4b;border-radius:0 0 16px 16px;text-align:center;">'
    + '<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);">Radar by Muller y Perez</p>'
    + '<p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.4);">mulleryperez.cl/clipping</p>'
    + '</div></div>'
}

function boton(texto, url) {
  return '<div style="text-align:center;margin:24px 0;">'
    + '<a href="' + url + '" style="background:#4338CA;color:white;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;display:inline-block;">' + texto + '</a>'
    + '</div>'
}

function emailBienvenida(sub) {
  var nCuentas = (sub.cuentas || []).filter(function(c) { return c.red !== 'prensa' }).length
  return header('Bienvenido a Radar', 'Tu prueba gratuita esta activa')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + (sub.nombre || sub.email.split('@')[0]) + ',</p>'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Tu Radar esta configurado con <strong>' + nCuentas + ' cuentas</strong> en plan <strong>' + sub.plan + '</strong>. Esto es lo que va a pasar:</p>'
    + '<div style="background:#f5f3ff;padding:16px 20px;border-radius:10px;margin:16px 0;">'
    + '<p style="margin:0 0 8px;font-size:14px;color:#4c1d95;"><strong>Manana 7:30 AM</strong> — Llega tu primer informe diario</p>'
    + '<p style="margin:0 0 8px;font-size:14px;color:#4c1d95;"><strong>Cada lunes 9:00 AM</strong> — Resumen semanal con ranking y contenido sugerido</p>'
    + '<p style="margin:0;font-size:14px;color:#4c1d95;"><strong>1ro de cada mes</strong> — Informe mensual con benchmarking y PDF</p>'
    + '</div>'
    + '<p style="font-size:14px;color:#6b7280;">Tu prueba dura 7 dias. Si te sirve, eliges un plan. Si no, se desactiva solo. Sin cargos.</p>'
    + '</div>'
    + footer()
}

function emailDia5(sub) {
  return header('Llevas 5 dias con Radar', 'Ya detectaste algo que no sabias?')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + (sub.nombre || sub.email.split('@')[0]) + ',</p>'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">En estos 5 dias tu Radar ha monitoreado tu competencia en <strong>Instagram, LinkedIn, Facebook y prensa</strong>. Algunas preguntas para reflexionar:</p>'
    + '<ul style="font-size:14px;color:#374151;line-height:2;">'
    + '<li>Descubriste alguna promo o campana de tu competencia que no conocias?</li>'
    + '<li>Hay algun competidor publicando mas (o menos) de lo que pensabas?</li>'
    + '<li>Te sirvieron las recomendaciones de la IA?</li>'
    + '</ul>'
    + '<p style="font-size:14px;color:#6b7280;">Tu prueba termina en 2 dias. Si Radar te esta sirviendo, elige tu plan para seguir recibiendo informes.</p>'
    + boton('Ver planes', 'https://www.mulleryperez.cl/clipping#planes')
    + '</div>'
    + footer()
}

function emailFinTrial(sub) {
  return header('Tu prueba termina manana', 'Elige tu plan para seguir con Radar')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + (sub.nombre || sub.email.split('@')[0]) + ',</p>'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Manana se desactiva tu prueba gratuita de Radar. Si quieres seguir recibiendo informes diarios, resumen semanal y analisis con IA, elige tu plan:</p>'
    + '<div style="background:#f0fdf4;padding:16px 20px;border-radius:10px;margin:16px 0;border:1px solid #bbf7d0;">'
    + '<p style="margin:0 0 6px;font-size:14px;color:#166534;"><strong>Starter</strong> — $27.990/mes (anual) — 5 cuentas Instagram</p>'
    + '<p style="margin:0 0 6px;font-size:14px;color:#166534;"><strong>Pro</strong> — $54.990/mes (anual) — 15 cuentas multi-red + IA</p>'
    + '<p style="margin:0;font-size:14px;color:#166534;"><strong>Business</strong> — $94.990/mes (anual) — 30 cuentas + benchmarking + PDF</p>'
    + '</div>'
    + boton('Elegir plan', 'https://www.mulleryperez.cl/clipping#planes')
    + '<p style="font-size:13px;color:#9ca3af;text-align:center;">Si no eliges plan, el servicio se desactiva solo. Sin cargos.</p>'
    + '</div>'
    + footer()
}

function emailDesactivado(sub) {
  return header('Tu Radar se desactivo', 'Puedes reactivarlo en cualquier momento')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + (sub.nombre || sub.email.split('@')[0]) + ',</p>'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Tu prueba gratuita de Radar termino y no elegiste un plan. Tus informes diarios, semanales y mensuales dejaran de llegar.</p>'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Si cambias de opinion, puedes reactivar tu Radar en cualquier momento:</p>'
    + boton('Reactivar Radar', 'https://www.mulleryperez.cl/clipping#planes')
    + '<p style="font-size:13px;color:#9ca3af;text-align:center;">Tus cuentas monitoreadas se mantienen guardadas. Al suscribirte, todo vuelve a funcionar.</p>'
    + '</div>'
    + footer()
}

function emailPagoFallido(sub) {
  return header('Tu pago no se proceso', 'Actualiza tu tarjeta para mantener Radar activo')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + (sub.nombre || sub.email.split('@')[0]) + ',</p>'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Intentamos cobrar tu plan <strong>' + sub.plan + '</strong> pero el pago fue rechazado. Tu Radar esta suspendido temporalmente.</p>'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Para seguir recibiendo informes, actualiza tu medio de pago:</p>'
    + boton('Actualizar pago', 'https://www.mulleryperez.cl/clipping#planes')
    + '<p style="font-size:13px;color:#9ca3af;text-align:center;">Si el pago no se regulariza en 7 dias, tu suscripcion se cancelara.</p>'
    + '</div>'
    + footer()
}

// ═══ ENVIAR ═══
async function enviarEmail(to, subject, html) {
  try {
    var res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Radar <contacto@mulleryperez.cl>',
        to: [to],
        subject: subject,
        html: html,
      }),
    })
    var data = await res.json()
    if (!res.ok) console.error('    Email error:', data)
    else console.log('    Email OK: ' + data.id)
  } catch (err) { console.error('    Resend: ' + err.message) }
}

main().catch(function(e) { console.error(e); process.exit(1) })
