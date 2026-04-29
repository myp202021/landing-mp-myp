// radar-lifecycle.js
// Emails de ciclo de vida para suscriptores Copilot
// Cron: diario 08:00 AM Chile (11:00 UTC)
// Dia 0: bienvenida | Dia 3: primer valor | Dia 5: engagement | Dia 6: fin trial
// Post-trial sin pago: desactivacion | Pago fallido: aviso

var fetch = require('node-fetch')
var { createClient } = require('@supabase/supabase-js')

var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
var RESEND_KEY = process.env.RESEND

async function main() {
  var hoy = new Date()
  var hoyStr = hoy.toISOString().split('T')[0]
  console.log('COPILOT LIFECYCLE | ' + hoyStr)

  var result = await supabase.from('clipping_suscripciones').select('*')
  if (result.error) { console.error('BD error:', result.error.message); process.exit(1) }
  var subs = result.data || []
  console.log('Total suscriptores: ' + subs.length)

  for (var i = 0; i < subs.length; i++) {
    var sub = subs[i]
    if (!sub.created_at) continue

    var created = new Date(sub.created_at)
    var diasDesdeCreacion = Math.floor((hoy.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))

    // DIA 0: Bienvenida
    if (sub.estado === 'trial' && diasDesdeCreacion === 0) {
      console.log('  Dia 0 (bienvenida): ' + sub.email)
      await enviarEmail(sub.email, 'Tu departamento de marketing digital esta activo',
        emailBienvenida(sub))
    }

    // DIA 3: Primer valor entregado (con data real)
    if (sub.estado === 'trial' && diasDesdeCreacion === 3) {
      console.log('  Dia 3 (valor): ' + sub.email)
      var dataCliente = await cargarDataCliente(sub.id)
      await enviarEmail(sub.email, dataCliente.topCompetidor
        ? dataCliente.topCompetidor + ' publico ' + dataCliente.topPosts + ' posts | Tu analisis esta listo'
        : 'Tu primer analisis de competencia esta listo',
        emailDia3(sub, dataCliente))
    }

    // DIA 5: Engagement (con data real)
    if (sub.estado === 'trial' && diasDesdeCreacion === 5) {
      console.log('  Dia 5 (engagement): ' + sub.email)
      var dataCliente5 = await cargarDataCliente(sub.id)
      await enviarEmail(sub.email, 'Copilot ya aprendio algo de tu negocio',
        emailDia5(sub, dataCliente5))
    }

    // DIA 6: Fin trial manana (con data real — muestra lo que pierde)
    if (sub.estado === 'trial' && diasDesdeCreacion === 6) {
      console.log('  Dia 6 (fin trial): ' + sub.email)
      var dataCliente6 = await cargarDataCliente(sub.id)
      await enviarEmail(sub.email, dataCliente6.totalPosts > 0
        ? 'Copilot analizo ' + dataCliente6.totalPosts + ' posts de tu competencia | Manana se desactiva'
        : 'Manana se desactiva tu Copilot | Elige tu plan',
        emailFinTrial(sub, dataCliente6))
    }

    // TRIAL VENCIDO: desactivar (con data real — muestra lo que pierde)
    if (sub.estado === 'trial' && sub.trial_ends && new Date(sub.trial_ends) < hoy) {
      console.log('  Trial vencido: ' + sub.email + ' -> cancelado')
      var dataClienteVencido = await cargarDataCliente(sub.id)
      await supabase.from('clipping_suscripciones')
        .update({ estado: 'cancelado', updated_at: hoy.toISOString() })
        .eq('id', sub.id)
      await enviarEmail(sub.email, 'Tu Copilot se desactivo | Reactivalo cuando quieras',
        emailDesactivado(sub, dataClienteVencido))
    }

    // PAGO FALLIDO
    if (sub.estado === 'suspendido' && sub.updated_at) {
      var diasSuspendido = Math.floor((hoy.getTime() - new Date(sub.updated_at).getTime()) / (1000 * 60 * 60 * 24))
      if (diasSuspendido === 3) {
        console.log('  Pago fallido (3 dias): ' + sub.email)
        await enviarEmail(sub.email, 'Tu pago no se proceso | Actualiza tu medio de pago',
          emailPagoFallido(sub))
      }
    }
  }
  console.log('Lifecycle completado')
}

// ═══ DATA REAL DEL CLIENTE ═══
async function cargarDataCliente(suscripcionId) {
  var data = { totalPosts: 0, empresas: [], topCompetidor: null, topPosts: 0, topEng: 0, avgEng: 0, contenidoCount: 0, auditoriaScore: 0, arbolRamas: 0, reporteAcciones: 0, aprendizajes: 0 }
  try {
    // Posts
    var postsRes = await supabase.from('radar_posts').select('nombre_empresa, handle, likes, comments').eq('suscripcion_id', suscripcionId)
    var posts = postsRes.data || []
    data.totalPosts = posts.length
    if (posts.length > 0) {
      var porEmpresa = {}
      posts.forEach(function(p) {
        var n = p.nombre_empresa || p.handle || '?'
        if (!porEmpresa[n]) porEmpresa[n] = { posts: 0, eng: 0 }
        porEmpresa[n].posts++
        porEmpresa[n].eng += (p.likes || 0) + (p.comments || 0)
      })
      data.empresas = Object.keys(porEmpresa).map(function(n) {
        return { nombre: n, posts: porEmpresa[n].posts, avgEng: Math.round(porEmpresa[n].eng / porEmpresa[n].posts) }
      }).sort(function(a, b) { return b.posts - a.posts })
      data.topCompetidor = data.empresas[0].nombre
      data.topPosts = data.empresas[0].posts
      data.topEng = data.empresas[0].avgEng
      data.avgEng = Math.round(posts.reduce(function(s, p) { return s + (p.likes || 0) + (p.comments || 0) }, 0) / posts.length)
    }
    // Contenido
    var contRes = await supabase.from('radar_contenido').select('id').eq('suscripcion_id', suscripcionId)
    data.contenidoCount = (contRes.data || []).length
    // Auditoría
    var audRes = await supabase.from('copilot_auditorias').select('score_general').eq('suscripcion_id', suscripcionId).order('created_at', { ascending: false }).limit(1)
    if (audRes.data && audRes.data[0]) data.auditoriaScore = audRes.data[0].score_general
    // Árbol
    var arbRes = await supabase.from('copilot_arboles').select('datos').eq('suscripcion_id', suscripcionId).limit(1)
    if (arbRes.data && arbRes.data[0] && arbRes.data[0].datos) data.arbolRamas = (arbRes.data[0].datos.ramas || []).length
    // Reporte
    var repRes = await supabase.from('copilot_reportes').select('datos').eq('suscripcion_id', suscripcionId).order('created_at', { ascending: false }).limit(1)
    if (repRes.data && repRes.data[0] && repRes.data[0].datos) data.reporteAcciones = (repRes.data[0].datos.acciones_inteligentes || []).length
    // Aprendizajes
    var apRes = await supabase.from('copilot_aprendizajes').select('id').eq('suscripcion_id', suscripcionId).eq('activo', true)
    data.aprendizajes = (apRes.data || []).length
  } catch (e) { console.log('    Data error: ' + e.message) }
  return data
}

// ═══ TEMPLATES ═══

function header(titulo, subtitulo) {
  return '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:580px;margin:0 auto;color:#1a1a1a;">'
    + '<div style="background:linear-gradient(135deg,#4338CA,#7C3AED);color:white;padding:28px 32px;border-radius:16px 16px 0 0;">'
    + '<p style="margin:0;font-size:11px;opacity:0.6;letter-spacing:1px;">M&P COPILOT</p>'
    + '<h1 style="margin:8px 0 4px;font-size:22px;font-weight:800;">' + titulo + '</h1>'
    + '<p style="margin:0;font-size:14px;opacity:0.9;">' + subtitulo + '</p>'
    + '</div>'
}

function footer() {
  return '<div style="padding:20px 28px;background:#1e1b4b;border-radius:0 0 16px 16px;text-align:center;">'
    + '<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);">M&P Copilot by Muller y P\u00e9rez</p>'
    + '<p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.4);">mulleryperez.cl/copilot</p>'
    + '</div></div>'
}

function boton(texto, url) {
  return '<div style="text-align:center;margin:24px 0;">'
    + '<a href="' + url + '" style="background:#4338CA;color:white;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;display:inline-block;">' + texto + '</a>'
    + '</div>'
}

function dashUrl(sub) {
  return 'https://www.mulleryperez.cl/copilot/dashboard/' + sub.id
}

// ═══ DIA 0: BIENVENIDA ═══
function emailBienvenida(sub) {
  var nombre = (sub.perfil_empresa || {}).nombre || sub.nombre || sub.email.split('@')[0]
  var nCuentas = (sub.cuentas || []).filter(function(c) { return c.red !== 'prensa' }).length
  return header('Tu Copilot est\u00e1 activo', 'Tu departamento de marketing digital')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + nombre + ',</p>'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Copilot ya est\u00e1 analizando tu mercado. Configuramos <strong>' + nCuentas + ' cuentas</strong> de competidores. Esto es lo que vas a recibir:</p>'
    + '<div style="background:#f5f3ff;padding:16px 20px;border-radius:10px;margin:16px 0;">'
    + '<p style="margin:0 0 10px;font-size:14px;color:#4c1d95;"><strong>\uD83D\uDD0D Inteligencia competitiva</strong> \u2014 Qu\u00e9 publica tu competencia, qu\u00e9 les funciona, d\u00f3nde hay oportunidades para ti</p>'
    + '<p style="margin:0 0 10px;font-size:14px;color:#4c1d95;"><strong>\u270D\uFE0F Contenido profesional</strong> \u2014 Copies, grilla con calendario, guiones de video. Listos para publicar</p>'
    + '<p style="margin:0 0 10px;font-size:14px;color:#4c1d95;"><strong>\uD83D\uDCCA Auditor\u00eda vs tu industria</strong> \u2014 Tus n\u00fameros comparados con el benchmark de tu rubro en Chile</p>'
    + '<p style="margin:0 0 10px;font-size:14px;color:#4c1d95;"><strong>\uD83C\uDF33 \u00c1rbol de inversi\u00f3n</strong> \u2014 D\u00f3nde invertir cada peso y qu\u00e9 esperar de cada canal</p>'
    + '<p style="margin:0;font-size:14px;color:#4c1d95;"><strong>\uD83C\uDFAF Reporte con acciones</strong> \u2014 Qu\u00e9 hacer este mes, con qu\u00e9 prioridad y por qu\u00e9</p>'
    + '</div>'
    + '<p style="font-size:14px;color:#6b7280;">Tu prueba dura 7 d\u00edas. Si te sirve, eliges un plan. Si no, se desactiva solo. Sin cargos.</p>'
    + boton('Ver tu dashboard', dashUrl(sub))
    + '</div>'
    + footer()
}

// ═══ DIA 3: PRIMER VALOR (con data real) ═══
function emailDia3(sub, data) {
  data = data || {}
  var nombre = (sub.perfil_empresa || {}).nombre || sub.nombre || sub.email.split('@')[0]
  var html = header('Tu an\u00e1lisis de competencia est\u00e1 listo', '3 d\u00edas con Copilot')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + nombre + ',</p>'

  if (data.totalPosts > 0 && data.empresas.length > 0) {
    html += '<p style="font-size:15px;line-height:1.7;color:#374151;">Copilot analiz\u00f3 <strong>' + data.totalPosts + ' posts</strong> de ' + data.empresas.length + ' competidores. Esto es lo que encontr\u00f3:</p>'
    html += '<div style="background:#f5f3ff;padding:16px 20px;border-radius:10px;margin:16px 0;">'
    data.empresas.slice(0, 4).forEach(function(e) {
      var engColor = e.avgEng >= 50 ? '#059669' : e.avgEng >= 20 ? '#D97706' : '#DC2626'
      html += '<p style="margin:0 0 8px;font-size:14px;color:#4c1d95;"><strong>' + e.nombre + '</strong> \u2014 ' + e.posts + ' posts, <span style="color:' + engColor + ';font-weight:700;">' + e.avgEng + ' eng/post</span></p>'
    })
    html += '<p style="margin:8px 0 0;font-size:12px;color:#7c3aed;">Engagement = likes + comentarios por post. Promedio de la industria: ~40</p>'
    html += '</div>'
  } else {
    html += '<p style="font-size:15px;line-height:1.7;color:#374151;">Copilot ya analiz\u00f3 a tus competidores. En tu dashboard puedes ver qu\u00e9 publican, qu\u00e9 les funciona, y d\u00f3nde hay oportunidades.</p>'
  }

  if (data.contenidoCount > 0) {
    html += '<p style="font-size:14px;color:#374151;">Adem\u00e1s, ya tienes <strong>' + data.contenidoCount + ' batches de contenido</strong> sugerido basado en lo que funciona en tu mercado.</p>'
  }

  html += boton('Ver an\u00e1lisis completo', dashUrl(sub))
    + '<p style="font-size:13px;color:#9ca3af;text-align:center;">Cada dato se explica, se compara con la industria, y viene con una acci\u00f3n concreta.</p>'
    + '</div>'
    + footer()
  return html
}

// ═══ DIA 5: ENGAGEMENT (con data real) ═══
function emailDia5(sub, data) {
  data = data || {}
  var nombre = (sub.perfil_empresa || {}).nombre || sub.nombre || sub.email.split('@')[0]
  var html = header('Copilot ya aprendi\u00f3 de tu negocio', '5 d\u00edas \u2014 y mejorando')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + nombre + ',</p>'

  // Stats reales
  var statsHtml = ''
  if (data.totalPosts > 0 || data.auditoriaScore > 0 || data.arbolRamas > 0) {
    statsHtml = '<div style="background:#f5f3ff;padding:16px 20px;border-radius:10px;margin:16px 0;">'
    statsHtml += '<p style="margin:0 0 4px;font-size:13px;color:#7c3aed;font-weight:700;">Lo que Copilot hizo por ti en 5 d\u00edas:</p>'
    if (data.totalPosts > 0) statsHtml += '<p style="margin:4px 0;font-size:14px;color:#4c1d95;">\uD83D\uDD0D Analiz\u00f3 <strong>' + data.totalPosts + ' posts</strong> de ' + data.empresas.length + ' competidores (promedio ' + data.avgEng + ' eng/post)</p>'
    if (data.contenidoCount > 0) statsHtml += '<p style="margin:4px 0;font-size:14px;color:#4c1d95;">\u270D\uFE0F Gener\u00f3 <strong>' + data.contenidoCount + ' batches</strong> de contenido profesional</p>'
    if (data.auditoriaScore > 0) statsHtml += '<p style="margin:4px 0;font-size:14px;color:#4c1d95;">\uD83D\uDCCA Tu score de auditor\u00eda: <strong>' + data.auditoriaScore + '/100</strong> vs benchmark de tu industria</p>'
    if (data.arbolRamas > 0) statsHtml += '<p style="margin:4px 0;font-size:14px;color:#4c1d95;">\uD83C\uDF33 \u00c1rbol de inversi\u00f3n con <strong>' + data.arbolRamas + ' ramas</strong> y 3 escenarios</p>'
    if (data.reporteAcciones > 0) statsHtml += '<p style="margin:4px 0;font-size:14px;color:#4c1d95;">\uD83C\uDFAF Reporte con <strong>' + data.reporteAcciones + ' acciones</strong> inteligentes priorizadas</p>'
    if (data.aprendizajes > 0) statsHtml += '<p style="margin:4px 0;font-size:14px;color:#4c1d95;">\uD83E\uDDE0 Acumul\u00f3 <strong>' + data.aprendizajes + ' aprendizajes</strong> sobre tu mercado</p>'
    statsHtml += '</div>'
  }

  html += '<p style="font-size:15px;line-height:1.7;color:#374151;">En 5 d\u00edas, Copilot ya entiende tu mercado mejor que la mayor\u00eda de las herramientas despu\u00e9s de meses.</p>'
  html += statsHtml
  html += '<p style="font-size:15px;line-height:1.7;color:#374151;">Y esto reci\u00e9n empieza \u2014 cada mes que pasa, las recomendaciones son m\u00e1s precisas porque Copilot aprende de tus datos y tu feedback.</p>'
  html += '<p style="font-size:14px;color:#6b7280;">Tu prueba termina en 2 d\u00edas. Si Copilot te est\u00e1 sirviendo, elige tu plan:</p>'
  html += boton('Ver planes desde $34.990/mes', 'https://www.mulleryperez.cl/copilot/contratar/' + sub.id)
  html += '</div>'
  html += footer()
  return html
}

// ═══ DIA 6: FIN TRIAL (con data real) ═══
function emailFinTrial(sub, data) {
  data = data || {}
  var nombre = (sub.perfil_empresa || {}).nombre || sub.nombre || sub.email.split('@')[0]
  return header('Ma\u00f1ana se desactiva tu Copilot', 'Elige tu plan para seguir')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + nombre + ',</p>'
    + (data.totalPosts > 0
      ? '<p style="font-size:15px;line-height:1.7;color:#374151;">En 7 d\u00edas, Copilot analiz\u00f3 <strong>' + data.totalPosts + ' posts</strong> de ' + data.empresas.length + ' competidores'
        + (data.auditoriaScore > 0 ? ', te dio un score de <strong>' + data.auditoriaScore + '/100</strong>' : '')
        + (data.reporteAcciones > 0 ? ', y gener\u00f3 <strong>' + data.reporteAcciones + ' acciones</strong> priorizadas' : '')
        + '. Ma\u00f1ana todo eso se desactiva.</p>'
      : '<p style="font-size:15px;line-height:1.7;color:#374151;">Ma\u00f1ana se desactiva tu prueba gratuita.</p>')
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Elige tu plan para seguir recibiendo inteligencia competitiva, contenido profesional y plan de acci\u00f3n:</p>'
    + '<div style="background:#f5f3ff;padding:16px 20px;border-radius:10px;margin:16px 0;">'
    + '<p style="margin:0 0 8px;font-size:14px;color:#4c1d95;"><strong>Starter $34.990/mes</strong> \u2014 Competencia + contenido + auditor\u00eda vs industria</p>'
    + '<p style="margin:0 0 8px;font-size:14px;color:#4c1d95;"><strong>Pro $69.990/mes</strong> \u2014 Todo Starter + copies semanales + guiones + ads + reporte con acciones</p>'
    + '<p style="margin:0;font-size:14px;color:#4c1d95;"><strong>Business $119.990/mes</strong> \u2014 Todo Pro + benchmark estrat\u00e9gico + \u00e1rbol de inversi\u00f3n + reuni\u00f3n</p>'
    + '</div>'
    + boton('Elegir plan', 'https://www.mulleryperez.cl/copilot/contratar/' + sub.id)
    + '<p style="font-size:13px;color:#9ca3af;text-align:center;">Si no eliges plan, se desactiva solo. Sin cargos. Tus datos se mantienen guardados.</p>'
    + '</div>'
    + footer()
}

// ═══ DESACTIVADO (con data real — muestra lo que pierde) ═══
function emailDesactivado(sub, data) {
  data = data || {}
  var nombre = (sub.perfil_empresa || {}).nombre || sub.nombre || sub.email.split('@')[0]
  var html = header('Tu Copilot se desactiv\u00f3', 'Reactivalo cuando quieras')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + nombre + ',</p>'

  if (data.totalPosts > 0) {
    html += '<p style="font-size:15px;line-height:1.7;color:#374151;">Tu prueba termin\u00f3. Mientras tanto, tu competencia sigue publicando:</p>'
    html += '<div style="background:#FEF2F2;padding:16px 20px;border-radius:10px;margin:16px 0;border:1px solid #FECACA;">'
    data.empresas.slice(0, 3).forEach(function(e) {
      html += '<p style="margin:0 0 6px;font-size:14px;color:#991B1B;"><strong>' + e.nombre + '</strong> public\u00f3 ' + e.posts + ' posts (' + e.avgEng + ' eng/post) y t\u00fa ya no lo sabes</p>'
    })
    html += '</div>'
    if (data.aprendizajes > 0) {
      html += '<p style="font-size:14px;color:#374151;">Copilot acumul\u00f3 <strong>' + data.aprendizajes + ' aprendizajes</strong> sobre tu mercado. Est\u00e1n guardados y esperando.</p>'
    }
  } else {
    html += '<p style="font-size:15px;line-height:1.7;color:#374151;">Tu prueba termin\u00f3 y no elegiste plan. Tu competencia sigue publicando pero Copilot dej\u00f3 de avisarte.</p>'
  }

  html += '<p style="font-size:15px;line-height:1.7;color:#374151;">Cuando quieras reactivar, todo vuelve a funcionar con tus cuentas y aprendizajes guardados:</p>'
    + boton('Reactivar Copilot desde $34.990/mes', 'https://www.mulleryperez.cl/copilot/contratar/' + sub.id)
    + '</div>'
    + footer()
  return html
}

// ═══ PAGO FALLIDO ═══
function emailPagoFallido(sub) {
  var nombre = (sub.perfil_empresa || {}).nombre || sub.nombre || sub.email.split('@')[0]
  return header('Tu pago no se proces\u00f3', 'Actualiza tu medio de pago')
    + '<div style="background:white;padding:28px 32px;">'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">Hola ' + nombre + ',</p>'
    + '<p style="font-size:15px;line-height:1.7;color:#374151;">El cobro de tu plan <strong>' + (sub.plan || 'Pro') + '</strong> fue rechazado. Tu Copilot est\u00e1 suspendido \u2014 no recibir\u00e1s informes ni se actualizar\u00e1 tu dashboard hasta que se regularice.</p>'
    + boton('Actualizar pago', 'https://www.mulleryperez.cl/copilot#planes')
    + '<p style="font-size:13px;color:#9ca3af;text-align:center;">Si no se regulariza en 7 d\u00edas, se cancela la suscripci\u00f3n.</p>'
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
        from: 'Copilot <contacto@mulleryperez.cl>',
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
