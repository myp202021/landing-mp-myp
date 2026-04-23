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

  // Construir contexto de posts top 20
  var postsSummary = posts.slice(0, 20).map(function(p) {
    return '[' + (p.red || p.plataforma || 'IG') + '] ' + (p.nombre || p.handle || '') + ': "'
      + (p.texto || '').substring(0, 100) + '" (' + (p.likes || 0) + ' likes)'
  }).join('\n')

  // Contexto de copies ya generados esta semana
  var copiesCtx = ''
  if (copiesGenerados && copiesGenerados.length > 0) {
    copiesCtx = '\nCOPIES YA GENERADOS ESTA SEMANA (no repetir temas):\n'
    copiesCtx += copiesGenerados.map(function(c) {
      return '- ' + (c.plataforma || '') + ' ' + (c.tipo || '') + ': ' + (c.titulo || '')
    }).join('\n')
  }

  var prompt = 'Eres un creador de contenido de video para redes sociales en Chile. '
    + 'Analiza la competencia y crea guiones de video para el cliente.\n\n'
    + 'CLIENTE:\n'
    + '- Empresa: ' + nombreEmpresa + '\n'
    + '- Rubro: ' + rubro + '\n'
    + '- Tono: ' + tono + '\n'
    + (propuestaValor ? '- Propuesta de valor: ' + propuestaValor + '\n' : '')
    + '\nPOSTS DE LA COMPETENCIA:\n' + postsSummary + '\n'
    + copiesCtx + '\n\n'
    + 'Genera 2 guiones de video corto para ' + nombreEmpresa + ' (' + rubro + ').\n\n'
    + 'Guion 1: Reel de 30 segundos\n'
    + 'Guion 2: Story de 15 segundos\n\n'
    + 'Cada guion debe tener:\n'
    + '- titulo: titulo atractivo del video\n'
    + '- tipo: "reel" o "story"\n'
    + '- duracion: "15s", "30s" o "60s"\n'
    + '- gancho: frase de apertura que capte atencion en los primeros 3 segundos\n'
    + '- desarrollo: contenido principal del video (2-3 oraciones)\n'
    + '- cierre: llamado a accion o cierre memorable\n'
    + '- sugerencia_visual: descripcion de lo que se debe filmar/mostrar\n'
    + '- hashtags: 5 hashtags relevantes\n\n'
    + 'Responde SOLO JSON: { "guiones": [...] }'

  try {
    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1200,
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
