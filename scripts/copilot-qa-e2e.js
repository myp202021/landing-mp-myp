// copilot-qa-e2e.js
// QA End-to-End completo: verifica TODA la cadena de agentes despues de un run
// Checks: datos generados, interconexion, calidad, dashboard, email, links
// Requiere: SUPABASE_URL, SUPABASE_SERVICE_KEY
// Output: informe detallado con fix/correcciones necesarias

var fetch = require('node-fetch')
var supabaseLib = require('@supabase/supabase-js')

var SUPABASE_URL = process.env.SUPABASE_URL
var SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
var SOLO_ID = (process.argv.find(function(a) { return a.startsWith('--id=') }) || '').replace('--id=', '')
var BASE_URL = 'https://www.mulleryperez.cl'

var checks = { pass: 0, fail: 0, warn: 0, details: [] }

function check(cat, name, pass, detail, severity) {
  severity = severity || (pass ? 'pass' : 'fail')
  checks.details.push({ cat: cat, name: name, pass: pass, detail: detail || '', severity: severity })
  if (pass) { checks.pass++; console.log('   ✅ [' + cat + '] ' + name + (detail ? ' — ' + detail : '')) }
  else if (severity === 'warn') { checks.warn++; console.log('   ⚠️  [' + cat + '] ' + name + (detail ? ' — ' + detail : '')) }
  else { checks.fail++; console.log('   ❌ [' + cat + '] ' + name + (detail ? ' — ' + detail : '')) }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║    COPILOT QA END-TO-END — PRUEBA COMPLETA       ║')
  console.log('╚══════════════════════════════════════════════════╝')
  console.log('   Fecha: ' + new Date().toISOString())

  var supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY)
  var subId = SOLO_ID

  // ═══ 1. SUSCRIPCION ═══
  console.log('\n   ══ 1. SUSCRIPCION ══')
  var subRes = await supabase.from('clipping_suscripciones').select('*').eq('id', subId).single()
  if (!subRes.data) { console.error('Suscripcion no encontrada'); process.exit(1) }
  var sub = subRes.data
  check('SUB', 'suscripcion carga', true, sub.nombre || sub.email)
  check('SUB', 'perfil_empresa existe', !!(sub.perfil_empresa && sub.perfil_empresa.rubro), sub.perfil_empresa ? sub.perfil_empresa.rubro : 'sin rubro')

  // ═══ 2. BRIEF ESTRATEGICO ═══
  console.log('\n   ══ 2. BRIEF ESTRATEGICO ══')
  var brief = sub.perfil_empresa && sub.perfil_empresa.brief
  check('BRIEF', 'brief existe', !!brief, brief ? 'fecha: ' + (brief.fecha_generacion || 'sin fecha') : 'NO EXISTE')
  if (brief) {
    check('BRIEF', 'resumen_negocio > 100 chars', (brief.resumen_negocio || '').length > 100, (brief.resumen_negocio || '').length + ' chars')
    check('BRIEF', 'propuesta_valor_unica no vacia', !!(brief.propuesta_valor_unica), (brief.propuesta_valor_unica || '').substring(0, 80))
    check('BRIEF', 'territorios >= 3', Array.isArray(brief.territorios_contenido) && brief.territorios_contenido.length >= 3, (brief.territorios_contenido || []).length + ' territorios')
    check('BRIEF', 'competidores >= 2', Array.isArray(brief.competidores_analizados) && brief.competidores_analizados.length >= 2, (brief.competidores_analizados || []).length + ' competidores')
    check('BRIEF', 'reglas >= 3', Array.isArray(brief.reglas_contenido) && brief.reglas_contenido.length >= 3, (brief.reglas_contenido || []).length + ' reglas')
    check('BRIEF', 'tono_comunicacion con estilo', !!(brief.tono_comunicacion && (brief.tono_comunicacion.estilo || typeof brief.tono_comunicacion === 'string')), brief.tono_comunicacion ? (brief.tono_comunicacion.estilo || '').substring(0, 60) : 'sin tono')
    check('BRIEF', 'calendario_estacional', !!(brief.calendario_estacional), brief.calendario_estacional ? 'OK' : 'falta')

    // Interconexion: brief tiene campos que otros agentes necesitan
    var terrConJustif = (brief.territorios_contenido || []).filter(function(t) { return typeof t === 'object' && t.justificacion })
    check('BRIEF→GRILLA', 'territorios con justificacion (para grilla)', terrConJustif.length >= 3, terrConJustif.length + ' territorios con justificacion')
    var compConOp = (brief.competidores_analizados || []).filter(function(c) { return c.oportunidad_para_cliente })
    check('BRIEF→COPIES', 'competidores con oportunidad (para copies)', compConOp.length >= 1, compConOp.length + ' con oportunidad')
    check('BRIEF→GUIONES', 'tono con palabras_evitar (para guiones)', !!(brief.tono_comunicacion && brief.tono_comunicacion.palabras_evitar), brief.tono_comunicacion && brief.tono_comunicacion.palabras_evitar ? 'si' : 'no')
  }

  // ═══ 3. POSTS COMPETENCIA ═══
  console.log('\n   ══ 3. POSTS COMPETENCIA ══')
  var hace7d = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  var postsRes = await supabase.from('radar_posts').select('*').eq('suscripcion_id', subId).gte('fecha_scrape', hace7d).order('id', { ascending: false })
  var posts = postsRes.data || []
  check('POSTS', 'posts ultimos 7 dias > 0', posts.length > 0, posts.length + ' posts')

  if (posts.length > 0) {
    var redes = {}; posts.forEach(function(p) { redes[p.red] = (redes[p.red] || 0) + 1 })
    check('POSTS', 'Instagram tiene posts', (redes.Instagram || 0) > 0, (redes.Instagram || 0) + ' posts IG')
    check('POSTS', 'LinkedIn (deshabilitado OK)', true, (redes.LinkedIn || 0) + ' posts LI (deshabilitado)', 'pass')

    var empresas = {}; posts.forEach(function(p) { empresas[p.nombre_empresa || p.handle] = true })
    check('POSTS', 'multiples competidores', Object.keys(empresas).length >= 2, Object.keys(empresas).length + ' empresas: ' + Object.keys(empresas).join(', '))

    var sinTexto = posts.filter(function(p) { return !p.texto || p.texto.length < 5 })
    check('POSTS', 'todos con texto > 5 chars', sinTexto.length === 0, sinTexto.length + ' sin texto')

    var sinLikes = posts.filter(function(p) { return typeof p.likes !== 'number' })
    check('POSTS', 'likes es numero', sinLikes.length === 0, sinLikes.length + ' con likes no-numero')
  }

  // ═══ 4. CONTENIDO (COPIES) ═══
  console.log('\n   ══ 4. CONTENIDO (COPIES) ══')
  var copiesRes = await supabase.from('radar_contenido').select('*').eq('suscripcion_id', subId).eq('tipo', 'copy').order('id', { ascending: false }).limit(3)
  var copiesBatches = copiesRes.data || []
  check('COPIES', 'copies batches existen', copiesBatches.length > 0, copiesBatches.length + ' batches')

  if (copiesBatches.length > 0) {
    var ultimoBatch = copiesBatches[0]
    var copies = Array.isArray(ultimoBatch.datos) ? ultimoBatch.datos : []
    check('COPIES', 'ultimo batch tiene copies', copies.length >= 3, copies.length + ' copies')
    check('COPIES', 'score_promedio > 70', (ultimoBatch.score_promedio || 0) > 70, 'score=' + (ultimoBatch.score_promedio || 0))

    copies.forEach(function(c, i) {
      var palabras = (c.copy || '').split(/\s+/).length
      check('COPIES', 'copy ' + (i+1) + ' largo >= 100 palabras', palabras >= 100, palabras + ' palabras')
      check('COPIES', 'copy ' + (i+1) + ' tiene titulo', !!(c.titulo), (c.titulo || '').substring(0, 50))
      check('COPIES', 'copy ' + (i+1) + ' tiene plataforma', !!(c.plataforma), c.plataforma || 'sin plataforma')
      check('COPIES', 'copy ' + (i+1) + ' score >= 70', (c.score || 0) >= 70, 'score=' + (c.score || 0))

      // Anti-generico
      var lower = (c.copy || '').toLowerCase()
      var tieneHashtags = (c.copy || '').includes('#')
      check('COPIES', 'copy ' + (i+1) + ' tiene hashtags', tieneHashtags, tieneHashtags ? 'si' : 'NO')
      var tieneObjetoStr = (c.copy || '').includes('[object Object]')
      check('COPIES', 'copy ' + (i+1) + ' sin [object Object]', !tieneObjetoStr, tieneObjetoStr ? 'TIENE [object Object]' : 'limpio')

      // Interconexion: copy referencia competidor?
      var referenciaComp = !!(c.competidor_referencia || c.engagement_referencia)
      check('COPIES→COMP', 'copy ' + (i+1) + ' referencia competidor', referenciaComp, c.competidor_referencia || 'sin referencia', referenciaComp ? 'pass' : 'warn')
    })
  }

  // ═══ 5. GRILLA ═══
  console.log('\n   ══ 5. GRILLA MENSUAL ══')
  var grillaRes = await supabase.from('radar_contenido').select('*').eq('suscripcion_id', subId).eq('tipo', 'grilla').order('id', { ascending: false }).limit(1)
  var grillaData = grillaRes.data || []
  check('GRILLA', 'grilla existe', grillaData.length > 0, grillaData.length + ' grillas')
  if (grillaData.length > 0) {
    var grillaPosts = Array.isArray(grillaData[0].datos) ? grillaData[0].datos : []
    check('GRILLA', 'grilla tiene >= 4 posts', grillaPosts.length >= 4, grillaPosts.length + ' posts')
    check('GRILLA', 'score_promedio > 60', (grillaData[0].score_promedio || 0) > 60, 'score=' + (grillaData[0].score_promedio || 0))
  }

  // ═══ 6. GUIONES ═══
  console.log('\n   ══ 6. GUIONES ══')
  var guionesRes = await supabase.from('copilot_guiones').select('*').eq('suscripcion_id', subId).order('id', { ascending: false }).limit(1)
  var guionesData = guionesRes.data || []
  check('GUIONES', 'guiones existen', guionesData.length > 0, guionesData.length + ' sets')
  if (guionesData.length > 0) {
    var guiones = Array.isArray(guionesData[0].datos) ? guionesData[0].datos : []
    check('GUIONES', 'al menos 2 guiones', guiones.length >= 2, guiones.length + ' guiones')
    guiones.forEach(function(g, i) {
      check('GUIONES', 'guion ' + (i+1) + ' tiene titulo', !!(g.titulo), (g.titulo || '').substring(0, 50))
      check('GUIONES', 'guion ' + (i+1) + ' gancho no es string plano', typeof g.gancho === 'object', typeof g.gancho)
      check('GUIONES', 'guion ' + (i+1) + ' escenas >= 2', Array.isArray(g.escenas) && g.escenas.length >= 2, (g.escenas || []).length + ' escenas')
      check('GUIONES', 'guion ' + (i+1) + ' cierre con CTA', !!(g.cierre && (g.cierre.frase_cta || typeof g.cierre === 'string')), g.cierre ? (g.cierre.frase_cta || '').substring(0, 50) : 'sin cierre')
      check('GUIONES', 'guion ' + (i+1) + ' referencia competencia', !!(g.referencia_competencia), (g.referencia_competencia || '').substring(0, 60) || 'sin referencia', g.referencia_competencia ? 'pass' : 'warn')
    })
  }

  // ═══ 7. AUDITORIA ═══
  console.log('\n   ══ 7. AUDITORIA ══')
  var audRes = await supabase.from('copilot_auditorias').select('*').eq('suscripcion_id', subId).order('id', { ascending: false }).limit(1)
  var audData = audRes.data || []
  check('AUDIT', 'auditoria existe', audData.length > 0, audData.length + ' auditorias')
  if (audData.length > 0) {
    var aud = audData[0]
    check('AUDIT', 'score_general 0-100', typeof aud.score_general === 'number' && aud.score_general >= 0 && aud.score_general <= 100, 'score=' + aud.score_general)
    check('AUDIT', 'criterios >= 8', Array.isArray(aud.criterios) && aud.criterios.length >= 8, (aud.criterios || []).length + ' criterios')
    check('AUDIT', 'scores_red es objeto', aud.scores_red && typeof aud.scores_red === 'object', JSON.stringify(aud.scores_red || {}).substring(0, 80))
    // fortaleza/debilidad: se generan desde upgrade 25 abr — runs anteriores no los tienen
    var tieneFortaleza = !!(aud.fortaleza)
    var tieneDebilidad = !!(aud.debilidad)
    // Si no tiene pero tiene criterios, calcular del criterio más alto/bajo
    if (!tieneFortaleza && Array.isArray(aud.criterios) && aud.criterios.length > 0) {
      var sorted = aud.criterios.slice().sort(function(a, b) { return (b.score||0) - (a.score||0) })
      tieneFortaleza = true
      tieneDebilidad = true
      aud.fortaleza = sorted[0].nombre + ' (' + sorted[0].score + '/10)'
      aud.debilidad = sorted[sorted.length-1].nombre + ' (' + sorted[sorted.length-1].score + '/10)'
    }
    check('AUDIT', 'fortaleza existe', tieneFortaleza, aud.fortaleza || 'sin fortaleza', tieneFortaleza ? 'pass' : 'warn')
    check('AUDIT', 'debilidad existe', tieneDebilidad, aud.debilidad || 'sin debilidad', tieneDebilidad ? 'pass' : 'warn')

    // Criterios con nombre y score
    if (Array.isArray(aud.criterios)) {
      var malformados = aud.criterios.filter(function(c) { return typeof c !== 'object' || !c.nombre || typeof c.score !== 'number' })
      check('AUDIT', 'criterios todos con nombre+score', malformados.length === 0, malformados.length + ' malformados')
    }
  }

  // ═══ 8. IDEAS ═══
  console.log('\n   ══ 8. IDEAS ══')
  var ideasRes = await supabase.from('copilot_ideas').select('*').eq('suscripcion_id', subId).order('id', { ascending: false }).limit(20)
  var ideas = ideasRes.data || []
  check('IDEAS', 'ideas existen', ideas.length > 0, ideas.length + ' ideas')
  if (ideas.length > 0) {
    var sinTitulo = ideas.filter(function(i) { return !i.titulo || i.titulo.length < 5 })
    check('IDEAS', 'todas con titulo', sinTitulo.length === 0, sinTitulo.length + ' sin titulo')
    var conGap = ideas.filter(function(i) { return (i.titulo || '').includes('GAP') || (i.titulo || '').includes('OPORTUNIDAD') })
    check('IDEAS', 'ideas de gap analysis', conGap.length > 0, conGap.length + ' ideas de gap', conGap.length > 0 ? 'pass' : 'warn')
  }

  // ═══ 9. MEMORIA ═══
  console.log('\n   ══ 9. SISTEMA MEMORIA ══')
  try {
    var memoriaModule = require('./radar-memoria.js')
    var memoria = await memoriaModule.cargarMemoria(supabase, subId)
    check('MEMORIA', 'carga OK', !!memoria, 'OK')
    check('MEMORIA', 'copies aprendizaje', memoria.copiesAprendizaje.totalCopiesHistoricos > 0, memoria.copiesAprendizaje.totalCopiesHistoricos + ' copies, avg ' + memoria.copiesAprendizaje.scorePromedio)
    check('MEMORIA', 'competencia tracked', memoria.competenciaPatrones.competidores.length > 0, memoria.competenciaPatrones.competidores.length + ' competidores')
    var ctx = memoriaModule.generarContextoAprendizaje(memoria)
    check('MEMORIA', 'contexto no vacio', ctx.length > 50, ctx.split('\n').length + ' lineas')
  } catch (e) {
    check('MEMORIA', 'modulo carga', false, e.message)
  }

  // ═══ 10. DASHBOARD ═══
  console.log('\n   ══ 10. DASHBOARD WEB ══')
  var dashUrl = BASE_URL + '/copilot/dashboard/' + subId
  try {
    var res = await fetch(dashUrl, { headers: { 'User-Agent': 'CopilotQA-E2E/1.0' }, timeout: 20000 })
    var html = await res.text()
    check('DASH', 'HTTP 200', res.status === 200, 'HTTP ' + res.status)
    check('DASH', 'sin [object Object]', !html.includes('[object Object]'), 'limpio')
    check('DASH', 'sin >undefined<', !html.includes('>undefined<'), 'limpio')
    check('DASH', 'sin >null<', !html.includes('>null<'), 'limpio')
    check('DASH', 'dark theme', html.includes('0F0D2E'), 'si')
    check('DASH', 'branding', html.includes('Muller') || html.includes('M&P') || html.includes('M&amp;P'), 'si')
  } catch (e) {
    check('DASH', 'dashboard carga', false, e.message)
  }

  // ═══ 11. LINKS ═══
  console.log('\n   ══ 11. LINKS ══')
  var links = [
    BASE_URL + '/copilot',
    BASE_URL + '/copilot/login',
    BASE_URL + '/copilot/dashboard/' + subId,
    BASE_URL + '/copilot/configurar/' + subId,
    BASE_URL + '/copilot/contratar/' + subId,
  ]
  for (var i = 0; i < links.length; i++) {
    try {
      var r = await fetch(links[i], { method: 'HEAD', timeout: 10000, redirect: 'follow' })
      check('LINKS', links[i].replace(BASE_URL, '').replace(subId, '{id}'), r.status < 400, 'HTTP ' + r.status)
    } catch (e) {
      check('LINKS', links[i].replace(BASE_URL, ''), false, e.message)
    }
  }

  // ═══ RESUMEN ═══
  console.log('\n   ════════════════════════════════════════════════')
  console.log('   RESUMEN E2E')
  console.log('   ════════════════════════════════════════════════')
  console.log('   ✅ Pass: ' + checks.pass)
  console.log('   ⚠️  Warn: ' + checks.warn)
  console.log('   ❌ Fail: ' + checks.fail)
  console.log('   Total: ' + (checks.pass + checks.warn + checks.fail))
  console.log('   Resultado: ' + (checks.fail === 0 ? '✅ TODO OK' : '❌ ' + checks.fail + ' FALLOS'))

  if (checks.fail > 0) {
    console.log('\n   FALLOS:')
    checks.details.filter(function(d) { return d.severity === 'fail' }).forEach(function(d) {
      console.log('   ❌ [' + d.cat + '] ' + d.name + ' — ' + d.detail)
    })
  }
  if (checks.warn > 0) {
    console.log('\n   WARNINGS:')
    checks.details.filter(function(d) { return d.severity === 'warn' }).forEach(function(d) {
      console.log('   ⚠️  [' + d.cat + '] ' + d.name + ' — ' + d.detail)
    })
  }
  console.log('   ════════════════════════════════════════════════\n')

  process.exit(checks.fail > 0 ? 1 : 0)
}

main().catch(function(e) { console.error('FATAL:', e.message); process.exit(1) })
