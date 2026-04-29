// radar-linkedin-api.js
// Módulo LinkedIn con fallback: Apify harvestapi → LinkdAPI
// Si Apify falla o devuelve 0 posts → usa LinkdAPI como respaldo
// Costo: Apify $2/1K posts, LinkdAPI $49/mes (solo si Apify falla)
//
// Uso desde el orquestador:
//   var liModule = require('./radar-linkedin-api.js')
//   var posts = await liModule.obtenerPostsLinkedIn(handles, limite)

var fetch = require('node-fetch')

var LINKDAPI_KEY = process.env.LINKDAPI_KEY || ''

// ═══════════════════════════════════════════════
// LinkdAPI: obtener ID de empresa desde slug
// ═══════════════════════════════════════════════
async function obtenerCompanyId(slug) {
  if (!LINKDAPI_KEY) return null
  try {
    var res = await fetch('https://linkdapi.com/api/v1/companies/company/universal-name-to-id?universalName=' + encodeURIComponent(slug), {
      headers: { 'X-linkdapi-apikey': LINKDAPI_KEY }
    })
    var data = await res.json()
    if (data.success && data.data && data.data.id) {
      return data.data.id
    }
    return null
  } catch (e) {
    console.log('   LinkdAPI ID error (' + slug + '): ' + e.message)
    return null
  }
}

// ═══════════════════════════════════════════════
// LinkdAPI: obtener posts de una empresa por ID
// ═══════════════════════════════════════════════
async function obtenerPostsLinkdAPI(companyId, slug, nombre, limite) {
  if (!LINKDAPI_KEY || !companyId) return []
  limite = limite || 10
  try {
    var res = await fetch('https://linkdapi.com/api/v1/companies/company/posts?id=' + companyId + '&start=0', {
      headers: { 'X-linkdapi-apikey': LINKDAPI_KEY }
    })
    var data = await res.json()
    if (!data.success || !data.data) return []

    var rawPosts = data.data.posts || data.data || []
    if (!Array.isArray(rawPosts)) return []

    return rawPosts.slice(0, limite).map(function(p) {
      var eng = p.engagements || {}
      var postedAt = p.postedAt || {}
      var timestamp = postedAt.timestamp ? new Date(postedAt.timestamp).toISOString() : (postedAt.fullDate || null)

      return {
        red: 'LinkedIn',
        handle: slug,
        nombre: nombre || p.author && p.author.name || slug,
        texto: (p.text || '').substring(0, 1000),
        likes: eng.totalReactions || 0,
        comments: eng.commentsCount || 0,
        shares: eng.repostsCount || 0,
        url: p.url || '',
        type: p.mediaContent ? 'media' : 'article',
        timestamp: timestamp,
        fuente: 'linkdapi',
      }
    })
  } catch (e) {
    console.log('   LinkdAPI posts error (' + slug + '): ' + e.message)
    return []
  }
}

// ═══════════════════════════════════════════════
// FUNCIÓN PRINCIPAL: obtener posts con fallback
// Paso 1: intenta Apify (harvestapi)
// Paso 2: si Apify falla o devuelve 0 → usa LinkdAPI
// ═══════════════════════════════════════════════
async function obtenerPostsLinkedIn(handles, limite, apifyToken) {
  limite = limite || 10
  var todosLosPosts = []
  var usaronLinkdAPI = false

  for (var i = 0; i < handles.length; i++) {
    var h = handles[i]
    var slug = h.handle || h
    var nombre = h.nombre || slug

    // Paso 1: Intentar con Apify si hay token
    var apifyPosts = []
    if (apifyToken && apifyToken !== 'SKIP') {
      // El orquestador ya maneja Apify — este módulo es el fallback
      // Si llega aquí es porque Apify ya falló
    }

    // Paso 2: LinkdAPI
    if (apifyPosts.length === 0 && LINKDAPI_KEY) {
      var companyId = await obtenerCompanyId(slug)
      if (companyId) {
        var liPosts = await obtenerPostsLinkdAPI(companyId, slug, nombre, limite)
        if (liPosts.length > 0) {
          todosLosPosts = todosLosPosts.concat(liPosts)
          usaronLinkdAPI = true
          console.log('   LinkdAPI ' + nombre + ': ' + liPosts.length + ' posts')
        } else {
          console.log('   LinkdAPI ' + nombre + ': 0 posts')
        }
      } else {
        console.log('   LinkdAPI ' + nombre + ': company no encontrada')
      }

      // Rate limiting: 1 segundo entre llamadas
      if (i < handles.length - 1) {
        await new Promise(function(r) { setTimeout(r, 1000) })
      }
    }
  }

  if (usaronLinkdAPI) {
    console.log('   LinkedIn total (LinkdAPI): ' + todosLosPosts.length + ' posts')
  }

  return todosLosPosts
}

module.exports = {
  obtenerPostsLinkedIn: obtenerPostsLinkedIn,
  obtenerCompanyId: obtenerCompanyId,
  obtenerPostsLinkdAPI: obtenerPostsLinkdAPI,
}
