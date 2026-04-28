// radar-guiones.js
// Genera guiones de reels y stories basado en competencia + perfil
// Se llama desde radar-clipping.js en modo semanal/mensual (solo plan business)
// Requiere: OPENAI_API_KEY

var fetch = require('node-fetch')

var OPENAI_KEY = process.env.OPENAI_API_KEY

// ═══════════════════════════════════════════════
// GENERAR GUIONES DE VIDEO
// ═══════════════════════════════════════════════
async function generarGuiones(posts, empresas, perfil, copiesGenerados, supabase, suscripcionId, briefEstrategico, memoria) {
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

  // Identificar videos/reels entre los top posts
  var videosTop = postsOrdenados.filter(function(p) {
    var tipo = (p.type || '').toLowerCase()
    return tipo.includes('video') || tipo.includes('reel') || tipo.includes('sidecar')
  }).slice(0, 5)
  var videoCtx = ''
  if (videosTop.length > 0) {
    videoCtx = '\nVIDEOS/REELS DE COMPETENCIA CON MEJOR ENGAGEMENT:\n'
    videosTop.forEach(function(p, idx) {
      var eng = (parseInt(p.likes) || 0) + (parseInt(p.comments) || 0)
      videoCtx += (idx + 1) + '. ' + (p.nombre || p.handle) + ': "' + (p.texto || '').substring(0, 150) + '" (eng: ' + eng + ', tipo: ' + (p.type || '') + ')\n'
    })
    videoCtx += 'IMPORTANTE: Usa estos reels como referencia directa. Cada guion debe explicar que post especifico lo inspira.\n'
  }

  // Guiones previos (dedup)
  memoria = memoria || null
  var guionesPrevCtx = ''
  if (memoria && memoria.guionesPrevios && memoria.guionesPrevios.titulosPrevios.length > 0) {
    guionesPrevCtx = '\n══════════════════════════════════\n'
    guionesPrevCtx += 'GUIONES YA GENERADOS (NO repetir estos temas/titulos):\n'
    guionesPrevCtx += '══════════════════════════════════\n'
    memoria.guionesPrevios.titulosPrevios.slice(0, 10).forEach(function(t) {
      guionesPrevCtx += '- "' + t + '"\n'
    })
    guionesPrevCtx += 'IMPORTANTE: Cada guion debe ser DIFERENTE a los anteriores.\n\n'
    console.log('   Guiones previos para dedup: ' + memoria.guionesPrevios.titulosPrevios.length)
  }

  // Contexto de aprendizaje
  var aprendizajeCtx = ''
  if (memoria) {
    var memoriaModule = require('./radar-memoria.js')
    aprendizajeCtx = memoriaModule.generarContextoAprendizaje(memoria)
  }

  // Construir contexto del brief estratégico
  briefEstrategico = briefEstrategico || null
  var briefCtx = ''
  if (briefEstrategico) {
    briefCtx = '\n══════════════════════════════════\n'
    briefCtx += 'BRIEF ESTRATEGICO (los guiones DEBEN seguir estas directrices):\n'
    briefCtx += '══════════════════════════════════\n'
    if (briefEstrategico.propuesta_valor_unica) briefCtx += '- Propuesta de valor: ' + briefEstrategico.propuesta_valor_unica + '\n'
    if (briefEstrategico.territorios_contenido && Array.isArray(briefEstrategico.territorios_contenido)) {
      briefCtx += '- Territorios autorizados (los guiones deben encajar en alguno):\n'
      briefEstrategico.territorios_contenido.forEach(function(t) {
        if (typeof t === 'object') briefCtx += '  * ' + (t.territorio || t.nombre || '') + ': ' + (t.justificacion || '') + '\n'
        else briefCtx += '  * ' + t + '\n'
      })
    }
    if (briefEstrategico.tono_comunicacion && typeof briefEstrategico.tono_comunicacion === 'object') {
      var tc = briefEstrategico.tono_comunicacion
      briefCtx += '- Tono (obligatorio): ' + (tc.estilo || '') + '\n'
      if (tc.palabras_evitar) briefCtx += '- NUNCA decir en video: ' + (Array.isArray(tc.palabras_evitar) ? tc.palabras_evitar.join(', ') : tc.palabras_evitar) + '\n'
    }
    if (briefEstrategico.reglas_contenido && Array.isArray(briefEstrategico.reglas_contenido)) {
      briefCtx += '- Reglas: ' + briefEstrategico.reglas_contenido.join(' | ') + '\n'
    }
    if (briefEstrategico.competidores_analizados && Array.isArray(briefEstrategico.competidores_analizados)) {
      briefCtx += '- Oportunidades vs competencia:\n'
      briefEstrategico.competidores_analizados.forEach(function(c) {
        if (c.oportunidad_para_cliente) briefCtx += '  * vs ' + (c.nombre || '') + ': ' + c.oportunidad_para_cliente + '\n'
      })
    }
    console.log('   Brief estratégico conectado a guiones: ' + (briefEstrategico.territorios_contenido || []).length + ' territorios')
  }

  var prompt = 'Eres un DIRECTOR DE PRODUCCION DE VIDEO que entrega guiones listos para filmar. '
    + 'NO generas ideas vagas. Cada guion es un documento COMPLETO que un camarografo y editor pueden ejecutar sin preguntar nada mas.\n\n'
    + 'REGLA FUNDAMENTAL: Cada guion DEBE referenciar un post ESPECIFICO de la competencia y explicar por que ese formato funciono y como lo adaptas para ' + nombreEmpresa + '.\n\n'
    + '══════════════════════════════════\n'
    + 'CLIENTE:\n'
    + '══════════════════════════════════\n'
    + '- Empresa: ' + nombreEmpresa + '\n'
    + '- Rubro: ' + rubro + '\n'
    + '- Tono de marca: ' + tono + '\n'
    + (propuestaValor ? '- Propuesta de valor: ' + propuestaValor + '\n' : '')
    + (diferenciadores ? '- Diferenciadores clave: ' + diferenciadores + '\n' : '')
    + '- Mes actual: ' + mesActual + ' ' + ahora.getFullYear() + '\n'
    + briefCtx
    + '\n══════════════════════════════════\n'
    + 'TOP 10 POSTS DE COMPETENCIA POR ENGAGEMENT:\n'
    + '══════════════════════════════════\n'
    + top10 + '\n'
    + videoCtx
    + copiesCtx
    + guionesPrevCtx
    + (aprendizajeCtx ? aprendizajeCtx + '\n' : '') + '\n'
    + '══════════════════════════════════\n'
    + 'TAREA: Genera 2 guiones de video LISTOS PARA PRODUCCION para ' + nombreEmpresa + '.\n'
    + '══════════════════════════════════\n\n'
    + 'Guion 1: Reel de 30-60 segundos (educativo o storytelling)\n'
    + 'Guion 2: Story de 15 segundos (impacto directo)\n\n'
    + 'CADA guion DEBE tener MINIMO 150 palabras sumando todos los campos de texto.\n\n'
    + 'Estructura OBLIGATORIA por guion:\n\n'
    + '- titulo: titulo especifico al rubro, no generico (ej: "3 errores que cometen las empresas de [rubro] en [tema]" NO "Tips para tu negocio")\n'
    + '- tipo: "reel" o "story"\n'
    + '- duracion: "15s", "30s" o "60s"\n'
    + '- referencia_competencia: "El post de [competidor] sobre [tema] tuvo [N] likes porque [razon]. Este guion usa el mismo patron de [hook/formato/ritmo] pero lo diferencia con [angulo unico de ' + nombreEmpresa + ']."\n\n'
    + '- gancho: objeto con:\n'
    + '  * frase: frase EXACTA que se dice/aparece (DEBE generar curiosidad en 3 segundos, DEBE incluir un dato o afirmacion provocadora del rubro ' + rubro + ')\n'
    + '  * texto_pantalla: texto overlay EXACTO (max 8 palabras, alto contraste). Ej: "EL 70% DE LAS EMPRESAS NO SABEN ESTO"\n'
    + '  * timing: "0-3s"\n'
    + '  * visual: plano exacto (ej: "Close-up de persona mirando a camara, fondo oficina desenfocado", "Pantalla completa con texto animado sobre fondo degradado azul")\n\n'
    + '- escenas: array de 3-5 escenas, cada una con:\n'
    + '  * numero: 1, 2, 3...\n'
    + '  * timing: "3-8s", "8-15s", etc.\n'
    + '  * voiceover: texto EXACTO palabra por palabra del narrador\n'
    + '  * texto_pantalla: texto overlay EXACTO de esta escena\n'
    + '  * visual: descripcion de camara concreta (plano, movimiento, sujeto, fondo)\n'
    + '  * accion: que esta pasando (ej: "persona muestra pantalla de laptop con grafico", "transicion swipe a imagen de producto")\n\n'
    + '- cierre: objeto con:\n'
    + '  * frase_cta: frase EXACTA del CTA (DEBE ser accion medible, NUNCA "siguenos" o "dale like")\n'
    + '  * accion_medible: accion concreta (ej: "guardar para despues", "enviar a colega del area", "comentar con emoji si les pasa")\n'
    + '  * texto_pantalla: texto final en pantalla\n'
    + '  * timing: timing correspondiente\n\n'
    + '- direccion_visual: objeto con:\n'
    + '  * estilo_camara: "talking head" / "b-roll" / "screen recording" / "mix" / "kinetic text"\n'
    + '  * transiciones: tipo especifico (corte seco, zoom in, swipe left, fade)\n'
    + '  * paleta_colores: colores hex o descriptivos (2-3)\n'
    + '  * tipografia: estilo overlay (ej: "Montserrat Bold blanca con sombra negra")\n'
    + '  * musica: audio especifico (ej: "trending audio [nombre si se conoce]", "beats lo-fi corporativos 90 bpm")\n\n'
    + '- hashtags: 5-8 hashtags relevantes\n\n'
    + 'REGLAS:\n'
    + '- MINIMO 150 palabras por guion (no negociable)\n'
    + '- El gancho NUNCA puede ser pregunta generica sin dato. Debe provocar o afirmar algo del rubro ' + rubro + '\n'
    + '- Cada escena debe tener voiceover Y texto_pantalla Y visual completo\n'
    + '- El CTA debe ser una ACCION que se pueda medir en Instagram analytics\n'
    + '- referencia_competencia OBLIGATORIA: citar post real de la competencia con engagement\n'
    + '- Tono: ' + tono + '\n'
    + '- Contexto estacional ' + mesActual + ': incorporar si aplica al rubro\n'
    + '- PROHIBIDO: "no es solo", "en la era digital", "descubre como", "te invitamos", "sabias que" sin dato\n'
    + '- El CTA NUNCA puede ser "visita nuestro sitio", "siguenos", "mas informacion". DEBE ser una ACCION MEDIBLE:\n'
    + '  Buenos CTAs: "Guarda este video para revisarlo el lunes", "Envia este reel a un colega de RRHH", "Comenta con 🔥 si tu empresa ya usa esto", "Etiqueta a alguien que necesita esto"\n'
    + '  NUNCA: "Solicita una demo", "Visita nuestro sitio", "Link en bio"\n\n'
    + 'RAZONAMIENTO OBLIGATORIO: en el campo "razonamiento", explica:\n'
    + '1. Por que elegiste ESTE post de competencia como referencia y no otro\n'
    + '2. Que patron del post original estas replicando (formato, ritmo, tema)\n'
    + '3. Como lo diferencias para ' + nombreEmpresa + '\n\n'
    + 'CADA guion tambien DEBE incluir:\n'
    + '- formato_recomendado: "reel_vertical" | "reel_horizontal" | "carousel_video" | "story_sequence" | "live_snippet"\n'
    + '- storyboard: array de 3-6 frames visuales simplificados, cada uno con:\n'
    + '  * frame: numero (1, 2, 3...)\n'
    + '  * descripcion_visual: descripcion corta de lo que se ve (1 oración)\n'
    + '  * texto_overlay: texto que aparece en pantalla en este frame\n'
    + '  * duracion: "3s", "5s", etc.\n'
    + '  * nota_produccion: tip para el editor/camarografo (ej: "usar filtro warm", "transición rápida")\n'
    + '- equipamiento: lo mínimo necesario para grabar (ej: "celular + trípode + luz natural")\n'
    + '- nivel_produccion: "bajo" (celular) | "medio" (camara + micro) | "alto" (equipo completo)\n'
    + '- tiempo_estimado_grabacion: "15 min" | "30 min" | "1 hora"\n\n'
    + 'Responde SOLO JSON valido: { "razonamiento": "...", "guiones": [...] }'

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
    if (parsed.razonamiento) console.log('   Razonamiento: ' + (parsed.razonamiento || '').substring(0, 120))

    // Post-proceso: validar y corregir CTAs genéricos
    var CTA_PROHIBIDOS = ['visita', 'siguenos', 'suscribete', 'mas informacion', 'link en bio', 'dale like', 'solicita una demo']
    guiones.forEach(function(g, i) {
      if (g.cierre && typeof g.cierre === 'object' && g.cierre.frase_cta) {
        var ctaLower = g.cierre.frase_cta.toLowerCase()
        var esGenerico = CTA_PROHIBIDOS.some(function(p) { return ctaLower.includes(p) })
        if (esGenerico) {
          console.log('   ⚠ Guion ' + (i+1) + ' CTA genérico detectado: "' + g.cierre.frase_cta + '" → reemplazando')
          // Reemplazar por CTA medible
          var ctasMedibles = [
            'Guarda este video y revisalo cuando planifiques tu semana',
            'Envia este reel a un colega que necesite esto',
            'Comenta con el emoji que mejor describe tu situacion',
            'Etiqueta a alguien de tu equipo que deberia ver esto',
          ]
          g.cierre.frase_cta = ctasMedibles[i % ctasMedibles.length]
          g.cierre.accion_medible = 'guardados / compartidos / comentarios'
        }
      }
      // Asegurar mínimo 2 escenas
      if (!g.escenas || g.escenas.length < 2) {
        console.log('   ⚠ Guion ' + (i+1) + ' tiene ' + (g.escenas||[]).length + ' escenas — mínimo 2')
      }
    })

    console.log('   Guiones validados: ' + guiones.length)

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
