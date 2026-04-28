// radar-memoria-persistente.js
// Sistema de aprendizajes persistentes entre meses
// A diferencia de radar-memoria.js (que carga data cruda), este módulo
// GUARDA y LEE conclusiones clave que los agentes descubren run tras run.
//
// Ejemplo: "Para clientes de salud, copies con dato duro convierten 3x más"
// Ejemplo: "El competidor X sube contenido los martes y jueves"
// Ejemplo: "Headlines con pregunta tienen CTR 40% mayor en esta industria"
//
// Tabla: copilot_aprendizajes
//   - suscripcion_id (uuid)
//   - agente (text): qué agente generó el aprendizaje
//   - tipo (text): patron|insight|alerta|preferencia_cliente
//   - aprendizaje (text): la conclusión
//   - confianza (float): 0.0-1.0, sube con cada confirmación
//   - confirmaciones (int): cuántas veces se ha confirmado
//   - contexto (jsonb): datos de soporte
//   - activo (boolean): false si fue invalidado
//   - created_at, updated_at
//
// Costo: $0 (pura lógica Supabase)
// Se llama desde radar-clipping.js después de cada agente

// ═══════════════════════════════════════════════
// CARGAR APRENDIZAJES ACTIVOS DE UN SUSCRIPTOR
// ═══════════════════════════════════════════════
async function cargarAprendizajes(supabase, suscripcionId) {
  try {
    var res = await supabase.from('copilot_aprendizajes')
      .select('*')
      .eq('suscripcion_id', suscripcionId)
      .eq('activo', true)
      .order('confianza', { ascending: false })
      .limit(50)

    if (res.error) {
      // Tabla puede no existir aún
      console.log('   Aprendizajes: tabla no existe o error: ' + res.error.message)
      return []
    }

    var aprendizajes = res.data || []
    if (aprendizajes.length > 0) {
      console.log('   Aprendizajes cargados: ' + aprendizajes.length + ' activos')
    }
    return aprendizajes
  } catch (e) {
    console.log('   Aprendizajes load error: ' + e.message)
    return []
  }
}

// ═══════════════════════════════════════════════
// GUARDAR UN APRENDIZAJE NUEVO O CONFIRMAR UNO EXISTENTE
// ═══════════════════════════════════════════════
async function guardarAprendizaje(supabase, suscripcionId, agente, tipo, aprendizaje, confianza, contexto) {
  try {
    // Buscar si ya existe un aprendizaje similar (mismo agente + tipo + texto similar)
    var existentes = await supabase.from('copilot_aprendizajes')
      .select('id, aprendizaje, confianza, confirmaciones')
      .eq('suscripcion_id', suscripcionId)
      .eq('agente', agente)
      .eq('tipo', tipo)
      .eq('activo', true)

    if (existentes.data && existentes.data.length > 0) {
      // Buscar si alguno es similar (> 60% de palabras en común)
      var similar = existentes.data.find(function(e) {
        return calcularSimilitud(e.aprendizaje, aprendizaje) > 0.6
      })

      if (similar) {
        // Confirmar el existente: subir confianza y confirmaciones
        var nuevaConfianza = Math.min(1.0, similar.confianza + 0.1)
        await supabase.from('copilot_aprendizajes')
          .update({
            confianza: nuevaConfianza,
            confirmaciones: (similar.confirmaciones || 1) + 1,
            contexto: contexto || {},
            updated_at: new Date().toISOString(),
          })
          .eq('id', similar.id)

        console.log('   Aprendizaje confirmado (confianza ' + similar.confianza.toFixed(1) + ' → ' + nuevaConfianza.toFixed(1) + '): ' + aprendizaje.substring(0, 60))
        return { action: 'confirmed', id: similar.id }
      }
    }

    // Insertar nuevo
    var insertRes = await supabase.from('copilot_aprendizajes').insert({
      suscripcion_id: suscripcionId,
      agente: agente,
      tipo: tipo,
      aprendizaje: aprendizaje,
      confianza: confianza || 0.5,
      confirmaciones: 1,
      contexto: contexto || {},
      activo: true,
    })

    if (insertRes.error) {
      console.log('   Aprendizaje insert error: ' + insertRes.error.message)
      return { action: 'error', error: insertRes.error.message }
    }

    console.log('   Aprendizaje nuevo guardado: ' + aprendizaje.substring(0, 60))
    return { action: 'created' }
  } catch (e) {
    console.log('   Aprendizaje save error: ' + e.message)
    return { action: 'error', error: e.message }
  }
}

// ═══════════════════════════════════════════════
// INVALIDAR UN APRENDIZAJE QUE YA NO APLICA
// ═══════════════════════════════════════════════
async function invalidarAprendizaje(supabase, aprendizajeId, razon) {
  try {
    await supabase.from('copilot_aprendizajes')
      .update({
        activo: false,
        contexto: { invalidado: true, razon: razon, fecha: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      })
      .eq('id', aprendizajeId)

    console.log('   Aprendizaje invalidado: ' + aprendizajeId)
    return true
  } catch (e) {
    console.log('   Invalidar error: ' + e.message)
    return false
  }
}

// ═══════════════════════════════════════════════
// GENERAR CONTEXTO DE APRENDIZAJES PARA UN AGENTE ESPECÍFICO
// ═══════════════════════════════════════════════
function generarContextoParaAgente(aprendizajes, agenteTarget) {
  if (!aprendizajes || aprendizajes.length === 0) return ''

  // Filtrar aprendizajes relevantes para este agente
  var relevantes = aprendizajes.filter(function(a) {
    // Aprendizajes del mismo agente siempre son relevantes
    if (a.agente === agenteTarget) return true
    // Aprendizajes de tipo "patron" o "insight" son relevantes para todos
    if (a.tipo === 'patron' || a.tipo === 'insight') return true
    // Preferencias del cliente son relevantes para todos los agentes de contenido
    if (a.tipo === 'preferencia_cliente') return true
    return false
  })

  // Ordenar por confianza
  relevantes.sort(function(a, b) { return b.confianza - a.confianza })

  // Tomar los top 15 más confiables
  var top = relevantes.slice(0, 15)

  if (top.length === 0) return ''

  var ctx = '═══ APRENDIZAJES HISTÓRICOS (de runs anteriores) ═══\n'
  ctx += 'Estos patrones fueron descubiertos y confirmados en ejecuciones previas.\n'
  ctx += 'Úsalos para mejorar tus outputs:\n\n'

  top.forEach(function(a, i) {
    var conf = a.confianza >= 0.8 ? '★★★' : a.confianza >= 0.6 ? '★★' : '★'
    ctx += (i + 1) + '. [' + conf + '] ' + a.aprendizaje
    if (a.confirmaciones > 1) ctx += ' (confirmado ' + a.confirmaciones + 'x)'
    ctx += '\n'
  })

  return ctx
}

// ═══════════════════════════════════════════════
// EXTRAER APRENDIZAJES DE LA SALIDA DE UN AGENTE
// (llamado por cada agente al terminar)
// ═══════════════════════════════════════════════
async function extraerYGuardarAprendizajes(supabase, suscripcionId, agente, datosAgente, contextoExtra) {
  var aprendizajesNuevos = []

  // Según el agente, extraer aprendizajes automáticamente
  if (agente === 'contenido' && datosAgente) {
    var copies = Array.isArray(datosAgente) ? datosAgente : (datosAgente.copies || [])
    if (copies.length >= 3) {
      // Encontrar el ángulo con mejor score
      var porAngulo = {}
      copies.forEach(function(c) {
        var ang = c.angulo || 'general'
        if (!porAngulo[ang]) porAngulo[ang] = { total: 0, count: 0 }
        porAngulo[ang].total += (c.score || 0)
        porAngulo[ang].count++
      })
      var mejorAng = null
      var mejorAvg = 0
      Object.keys(porAngulo).forEach(function(k) {
        var avg = porAngulo[k].total / porAngulo[k].count
        if (avg > mejorAvg && porAngulo[k].count >= 2) { mejorAvg = avg; mejorAng = k }
      })
      if (mejorAng && mejorAvg >= 80) {
        aprendizajesNuevos.push({
          tipo: 'patron',
          texto: 'El ángulo "' + mejorAng + '" tiene score promedio de ' + Math.round(mejorAvg) + '/100 en copies. Priorizar este ángulo.',
          confianza: 0.5,
          contexto: { angulo: mejorAng, score: mejorAvg, n_copies: porAngulo[mejorAng].count },
        })
      }
    }
  }

  if (agente === 'auditoria' && datosAgente) {
    var criterios = datosAgente.criterios || []
    // Criterios consistentemente bajos
    var bajos = criterios.filter(function(c) { return (c.puntaje || c.score || 0) <= 5 })
    bajos.forEach(function(c) {
      aprendizajesNuevos.push({
        tipo: 'alerta',
        texto: 'Criterio "' + (c.nombre || c.criterio) + '" puntúa bajo (' + (c.puntaje || c.score) + '/10). Área de mejora prioritaria.',
        confianza: 0.4,
        contexto: { criterio: c.nombre || c.criterio, score: c.puntaje || c.score },
      })
    })
  }

  if (agente === 'benchmark' && datosAgente) {
    // Competidor en crecimiento
    if (datosAgente.competidor_destacado) {
      aprendizajesNuevos.push({
        tipo: 'insight',
        texto: 'Competidor destacado: ' + datosAgente.competidor_destacado + '. ' + (datosAgente.razon_destaque || ''),
        confianza: 0.5,
        contexto: { competidor: datosAgente.competidor_destacado },
      })
    }
    // Content gaps
    if (datosAgente.content_gaps && datosAgente.content_gaps.length > 0) {
      aprendizajesNuevos.push({
        tipo: 'insight',
        texto: 'Content gaps detectados vs competencia: ' + datosAgente.content_gaps.slice(0, 3).join(', '),
        confianza: 0.5,
        contexto: { gaps: datosAgente.content_gaps },
      })
    }
  }

  if (agente === 'ads_creative' && datosAgente) {
    // Guardar qué ángulos de ads se generaron para tracking futuro
    if (datosAgente.meta_ads) {
      var angulosUsados = []
      datosAgente.meta_ads.forEach(function(conjunto) {
        (conjunto.variaciones || []).forEach(function(v) {
          if (v.angulo && angulosUsados.indexOf(v.angulo) === -1) angulosUsados.push(v.angulo)
        })
      })
      if (angulosUsados.length > 0) {
        aprendizajesNuevos.push({
          tipo: 'patron',
          texto: 'Ángulos de ads generados: ' + angulosUsados.join(', ') + '. Trackear cuáles convierten mejor.',
          confianza: 0.3,
          contexto: { angulos: angulosUsados },
        })
      }
    }
  }

  // Guardar todos los aprendizajes extraídos
  for (var i = 0; i < aprendizajesNuevos.length; i++) {
    var a = aprendizajesNuevos[i]
    await guardarAprendizaje(supabase, suscripcionId, agente, a.tipo, a.texto, a.confianza, a.contexto)
  }

  return aprendizajesNuevos.length
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function calcularSimilitud(texto1, texto2) {
  var palabras1 = (texto1 || '').toLowerCase().split(/\s+/)
  var palabras2 = (texto2 || '').toLowerCase().split(/\s+/)
  if (palabras1.length === 0 || palabras2.length === 0) return 0

  var comunes = 0
  palabras1.forEach(function(p) {
    if (palabras2.indexOf(p) !== -1) comunes++
  })

  return comunes / Math.max(palabras1.length, palabras2.length)
}

module.exports = {
  cargarAprendizajes: cargarAprendizajes,
  guardarAprendizaje: guardarAprendizaje,
  invalidarAprendizaje: invalidarAprendizaje,
  generarContextoParaAgente: generarContextoParaAgente,
  extraerYGuardarAprendizajes: extraerYGuardarAprendizajes,
}
