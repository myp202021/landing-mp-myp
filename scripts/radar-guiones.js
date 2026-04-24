// radar-guiones.js
// Genera guiones de reels y stories basado en competencia + perfil
// Se llama desde radar-clipping.js en modo semanal/mensual (solo plan business)
// Requiere: OPENAI_API_KEY

var fetch = require('node-fetch')

var OPENAI_KEY = process.env.OPENAI_API_KEY

// ═══════════════════════════════════════════════
// GENERAR GUIONES DE VIDEO
// ═══════════════════════════════════════════════
async function generarGuiones(posts, empresas, perfil, copiesGenerados, supabase, suscripcionId) {
  console.log('\n   === PIPELINE GUIONES DE VIDEO ===')

  if (!OPENAI_KEY) {
    console.log('   Falta OPENAI_API_KEY, saltando guiones')
    return []
  }

  if (!posts || posts.length < 2) {
    console.log('   Pocos posts (' + (posts ? posts.length : 0) + '), saltando guiones')
    return []
  }

  perfil = perfil || {}
  var nombreEmpresa = perfil.nombre || 'Mi empresa'
  var rubro = perfil.rubro || 'general'
  var tono = perfil.tono || 'profesional y directo'
  var propuestaValor = perfil.propuesta_valor || ''
  var diferenciadores = (perfil.diferenciadores && perfil.diferenciadores.length) ? perfil.diferenciadores.join(', ') : ''

  // Ordenar posts por engagement y filtrar videos/reels
  var postsOrdenados = posts.slice().sort(function(a, b) {
    var engA = (parseInt(a.likes) || 0) + (parseInt(a.comments) || 0)
    var engB = (parseInt(b.likes) || 0) + (parseInt(b.comments) || 0)
    return engB - engA
  })

  // Top 10 posts con detalle completo
  var top10 = postsOrdenados.slice(0, 10).map(function(p, idx) {
    var eng = (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0)
    var esVideo = (p.type || '').toLowerCase().includes('video') || (p.type || '').toLowerCase().includes('reel')
      || (p.type || '').toLowerCase().includes('sidecar')
    return 'TOP ' + (idx + 1) + ' [' + (p.red || p.plataforma || 'IG') + '] ' + (p.nombre || p.handle || '')
      + ' | Engagement: ' + eng + ' | Tipo: ' + (p.type || 'post') + (esVideo ? ' (VIDEO)' : '')
      + '\nTexto: "' + (p.texto || '').substring(0, 300) + '"'
  }).join('\n---\n')

  // Contexto de copies ya generados esta semana
  var copiesCtx = ''
  if (copiesGenerados && copiesGenerados.length > 0) {
    copiesCtx = '\nCOPIES YA GENERADOS ESTA SEMANA (NO repetir estos temas ni angulos):\n'
    copiesCtx += copiesGenerados.map(function(c) {
      return '- [' + (c.plataforma || '') + ' ' + (c.tipo || '') + '] ' + (c.titulo || '') + ' (angulo: ' + (c.angulo || '') + ')'
    }).join('\n')
  }

  // Contexto estacional
  var ahora = new Date()
  var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  var mesActual = meses[ahora.getMonth()]

  var prompt = 'Eres un DIRECTOR CREATIVO DE VIDEO con 10 anos de experiencia en produccion de contenido para redes sociales en Chile. '
    + 'NO generas ideas genericas. Cada guion debe ser un documento de produccion COMPLETO que un equipo de filmacion pueda ejecutar.\n\n'
    + '══════════════════════════════════\n'
    + 'CLIENTE:\n'
    + '══════════════════════════════════\n'
    + '- Empresa: ' + nombreEmpresa + '\n'
    + '- Rubro: ' + rubro + '\n'
    + '- Tono de marca: ' + tono + '\n'
    + (propuestaValor ? '- Propuesta de valor: ' + propuestaValor + '\n' : '')
    + (diferenciadores ? '- Diferenciadores clave: ' + diferenciadores + '\n' : '')
    + '- Mes actual: ' + mesActual + ' ' + ahora.getFullYear() + '\n'
    + '\n══════════════════════════════════\n'
    + 'TOP 10 POSTS DE COMPETENCIA POR ENGAGEMENT (analiza que formatos de video funcionan):\n'
    + '══════════════════════════════════\n'
    + top10 + '\n'
    + copiesCtx + '\n\n'
    + '══════════════════════════════════\n'
    + 'TAREA: Genera 2 guiones de video PROFESIONALES para ' + nombreEmpresa + '.\n'
    + '══════════════════════════════════\n\n'
    + 'Guion 1: Reel de 30-60 segundos (formato educativo o storytelling)\n'
    + 'Guion 2: Story de 15 segundos (formato directo, impacto inmediato)\n\n'
    + 'CADA guion debe tener MINIMO 100 palabras en total y los siguientes campos:\n\n'
    + '- titulo: titulo atractivo y especifico al rubro (no generico)\n'
    + '- tipo: "reel" o "story"\n'
    + '- duracion: "15s", "30s" o "60s"\n'
    + '- referencia_competencia: "Este formato funciona porque [competidor] tuvo [X] engagement con formato similar de [tipo]. Nuestro diferencial es [Y]."\n\n'
    + '- gancho: objeto con:\n'
    + '  * frase: la frase EXACTA que se dice o aparece en pantalla (debe generar curiosidad o tension en 3 segundos)\n'
    + '  * texto_pantalla: texto overlay que aparece (maximo 8 palabras, alto contraste)\n'
    + '  * timing: "0-3s"\n'
    + '  * visual: que se ve en pantalla (plano, angulo de camara, sujeto)\n\n'
    + '- escenas: array de 3-5 escenas, cada una con:\n'
    + '  * numero: 1, 2, 3...\n'
    + '  * timing: "3-8s", "8-15s", etc.\n'
    + '  * voiceover: texto EXACTO del locutor/narrador (si aplica)\n'
    + '  * texto_pantalla: texto overlay que aparece en esta escena\n'
    + '  * visual: descripcion de camara (plano cerrado/abierto, movimiento, transicion)\n'
    + '  * accion: que esta pasando en la escena\n\n'
    + '- cierre: objeto con:\n'
    + '  * frase_cta: frase EXACTA del llamado a accion\n'
    + '  * accion_medible: que debe hacer el viewer (ej: "guardar para despues", "enviar a un amigo del rubro", "comentar su experiencia")\n'
    + '  * texto_pantalla: texto final en pantalla\n'
    + '  * timing: "25-30s" (o lo que corresponda)\n\n'
    + '- direccion_visual: objeto con:\n'
    + '  * estilo_camara: "talking head", "b-roll", "screen recording", "mix", etc.\n'
    + '  * transiciones: tipo de transiciones sugeridas (corte seco, zoom, swipe, etc.)\n'
    + '  * paleta_colores: 2-3 colores dominantes sugeridos (hex o descriptivo)\n'
    + '  * tipografia: estilo de texto overlay (bold sans-serif, handwritten, etc.)\n'
    + '  * musica: tipo de musica/audio de fondo sugerido (ej: "trending audio motivacional", "beats suaves corporativos")\n\n'
    + '- hashtags: 5-8 hashtags relevantes al contenido y rubro\n\n'
    + 'REGLAS ESTRICTAS:\n'
    + '- CADA guion debe tener minimo 100 palabras sumando todos los campos de texto\n'
    + '- Las frases de gancho deben ser PROVOCADORAS y especificas al rubro de ' + rubro + ' (nunca genericas)\n'
    + '- El CTA debe ser una ACCION MEDIBLE, no "siguenos" o "dale like"\n'
    + '- Incluir referencia a por que el formato elegido funciona basado en los datos de competencia\n'
    + '- Adaptar el tono a ' + tono + '\n'
    + '- Si hay contexto estacional de ' + mesActual + ', incorporarlo\n'
    + '- NO uses frases cliche: "no es solo", "en la era digital", "descubre como", "te invitamos"\n\n'
    + 'Responde SOLO JSON valido: { "guiones": [...] }'

  try {
    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) throw new Error('OpenAI guiones: HTTP ' + res.status)

    var data = await res.json()
    var content = data.choices[0].message.content
    var parsed = JSON.parse(content)
    var guiones = parsed.guiones || []

    console.log('   Guiones generados: ' + guiones.length)

    // Guardar en Supabase
    if (supabase && suscripcionId && guiones.length > 0) {
      try {
        var ahora = new Date()
        await supabase.from('copilot_guiones').insert({
          suscripcion_id: suscripcionId,
          mes: ahora.getMonth() + 1,
          anio: ahora.getFullYear(),
          datos: guiones,
        })
        console.log('   Guiones guardados en copilot_guiones')
      } catch (e) {
        console.log('   Error guardando guiones: ' + e.message)
      }
    }

    console.log('   === GUIONES COMPLETADO ===\n')
    return guiones
  } catch (e) {
    console.error('   Error generando guiones: ' + e.message)
    return []
  }
}

module.exports = { generarGuiones: generarGuiones }
