// radar-perfil.js
// Genera perfil automatico del suscriptor basado en:
// 1. Web del dominio del email
// 2. Posts de las cuentas de competencia que monitorea
// 3. Posts de la propia cuenta del cliente (si tiene)
// Se llama desde trial API y desde pipeline de contenido si perfil esta vacio
//
// Requiere: OPENAI_API_KEY, APIFY_TOKEN

var fetch = require('node-fetch')

var OPENAI_KEY = process.env.OPENAI_API_KEY
var APIFY_TOKEN = process.env.APIFY_TOKEN

async function generarPerfil(suscriptor) {
  var email = suscriptor.email || ''
  var cuentas = suscriptor.cuentas || []
  var perfilExistente = suscriptor.perfil_empresa || {}

  // Si ya tiene perfil completo, no regenerar
  if (perfilExistente.rubro && perfilExistente.productos && perfilExistente.propuesta_valor) {
    console.log('   Perfil ya completo, saltando')
    return perfilExistente
  }

  console.log('   PERFIL: generando para ' + email)

  var infoWeb = ''
  var infoCompetencia = ''
  var infoPropios = ''

  // ═══ 1. Scrapear web del dominio del email ═══
  var domain = email.split('@')[1] || ''
  if (domain && domain !== 'gmail.com' && domain !== 'hotmail.com' && domain !== 'yahoo.com' && domain !== 'outlook.com') {
    console.log('   Scrapeando web: ' + domain)
    try {
      var webRes = await fetch('https://' + domain, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        redirect: 'follow',
        timeout: 10000,
      })
      if (webRes.ok) {
        var html = await webRes.text()
        // Extraer texto visible (sin tags)
        var text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 3000)
        // Extraer meta description
        var metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
        var metaDesc = metaMatch ? metaMatch[1] : ''
        // Extraer title
        var titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        var title = titleMatch ? titleMatch[1].trim() : ''
        infoWeb = 'Web: ' + domain + '\nTitle: ' + title + '\nMeta: ' + metaDesc + '\nContenido: ' + text.substring(0, 1500)
        console.log('   Web OK: ' + title.substring(0, 60))
      }
    } catch (e) { console.log('   Web error: ' + e.message) }
  }

  // ═══ 2. Leer posts de competencia (de radar_posts si hay, o scrapear) ═══
  var competidores = cuentas.filter(function(c) { return c.red !== 'prensa' })
  if (competidores.length > 0) {
    // Scrapear los ultimos 3 posts de cada competidor en IG
    var igComps = competidores.filter(function(c) { return c.red === 'instagram' }).slice(0, 5)
    if (igComps.length > 0 && APIFY_TOKEN) {
      console.log('   Scrapeando ' + igComps.length + ' cuentas de competencia...')
      try {
        var urls = igComps.map(function(c) { return 'https://www.instagram.com/' + c.handle + '/' })
        var r = await fetch('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=120', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directUrls: urls, resultsType: 'posts', resultsLimit: 3, addParentData: true }),
        })
        if (r.ok) {
          var posts = await r.json()
          infoCompetencia = 'Posts de competencia:\n' + posts.slice(0, 15).map(function(p) {
            return '[@' + (p.ownerUsername || '') + '] ' + (p.caption || '').substring(0, 150)
          }).join('\n')
          console.log('   Competencia OK: ' + posts.length + ' posts')
        }
      } catch (e) { console.log('   Competencia error: ' + e.message) }
    }
  }

  // ═══ 3. Si el nombre de empresa coincide con una cuenta, scrapear posts propios ═══
  var nombreEmp = (perfilExistente.nombre || suscriptor.nombre || '').toLowerCase()
  // Intentar encontrar la cuenta propia por nombre
  var cuentaPropia = cuentas.find(function(c) {
    return c.nombre && c.nombre.toLowerCase().includes(nombreEmp.substring(0, 4))
  })
  // Si no, inferir del dominio del email
  if (!cuentaPropia && domain) {
    var domBase = domain.split('.')[0].toLowerCase()
    cuentaPropia = cuentas.find(function(c) {
      return c.handle && c.handle.toLowerCase().includes(domBase)
    })
  }

  if (cuentaPropia && cuentaPropia.red === 'instagram' && APIFY_TOKEN) {
    console.log('   Scrapeando cuenta propia: @' + cuentaPropia.handle)
    try {
      var r = await fetch('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=60', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directUrls: ['https://www.instagram.com/' + cuentaPropia.handle + '/'], resultsType: 'posts', resultsLimit: 5, addParentData: true }),
      })
      if (r.ok) {
        var propios = await r.json()
        infoPropios = 'Posts propios de la empresa:\n' + propios.slice(0, 5).map(function(p) {
          return (p.caption || '').substring(0, 200)
        }).join('\n')
        console.log('   Propios OK: ' + propios.length + ' posts')
      }
    } catch (e) { console.log('   Propios error: ' + e.message) }
  }

  // ═══ 4. OpenAI analiza todo y genera perfil ═══
  if (!OPENAI_KEY) {
    console.log('   Sin OPENAI_KEY, retornando perfil basico')
    return perfilExistente
  }

  var prompt = 'Eres un analista de negocios. Analiza toda la informacion disponible y genera un perfil de empresa.\n\n'
  if (infoWeb) prompt += '=== WEB DE LA EMPRESA ===\n' + infoWeb + '\n\n'
  if (perfilExistente.nombre) prompt += '=== DATOS INGRESADOS ===\nNombre: ' + perfilExistente.nombre + '\nDescripcion: ' + (perfilExistente.descripcion || '') + '\nTono: ' + (perfilExistente.tono || '') + '\n\n'
  if (infoCompetencia) prompt += '=== POSTS DE LA COMPETENCIA ===\n' + infoCompetencia + '\n\n'
  if (infoPropios) prompt += '=== POSTS PROPIOS DE LA EMPRESA ===\n' + infoPropios + '\n\n'

  prompt += '=== TAREA ===\n'
    + 'Genera un JSON con el perfil de la empresa. NO inventes datos — usa SOLO lo que esta en la informacion de arriba.\n'
    + 'Si algo no esta claro, pon "no definido".\n\n'
    + '{"rubro":"sector/industria real de la empresa",'
    + '"productos":"lista de productos o servicios reales",'
    + '"propuesta_valor":"que los hace unicos (1 frase)",'
    + '"tono":"como se comunican basado en sus posts",'
    + '"publico_objetivo":"a quien le venden",'
    + '"diferenciadores":["diferenciador 1","diferenciador 2"],'
    + '"competidores_detectados":["competidor 1","competidor 2"],'
    + '"territorios_contenido":["pilar tematico 1","pilar tematico 2","pilar tematico 3"]}'

  console.log('   OpenAI analizando perfil...')
  try {
    var r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini', temperature: 0.3, max_tokens: 800,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    var data = await r.json()
    var perfil = JSON.parse(data.choices[0].message.content)

    // Merge con datos existentes (no sobreescribir lo que el usuario puso)
    var resultado = {
      nombre: perfilExistente.nombre || suscriptor.nombre || perfil.nombre || '',
      descripcion: perfilExistente.descripcion || perfil.productos || '',
      tono: perfilExistente.tono || perfil.tono || 'profesional',
      rubro: perfil.rubro || perfilExistente.rubro || '',
      productos: perfil.productos || '',
      propuesta_valor: perfil.propuesta_valor || '',
      publico_objetivo: perfil.publico_objetivo || '',
      diferenciadores: perfil.diferenciadores || [],
      competidores_detectados: perfil.competidores_detectados || [],
      territorios_contenido: perfil.territorios_contenido || [],
      auto_generado: true,
      fecha_generado: new Date().toISOString().split('T')[0],
    }

    console.log('   Perfil generado: ' + resultado.rubro + ' | ' + resultado.propuesta_valor.substring(0, 60))
    return resultado
  } catch (e) {
    console.error('   OpenAI perfil error: ' + e.message)
    return perfilExistente
  }
}

module.exports = { generarPerfil: generarPerfil }
