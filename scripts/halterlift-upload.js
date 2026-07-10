// upload-to-wp.js — Sube los 10 artículos HTML a WordPress de Halterlift
// con imagen generada por OpenAI (gpt-image-1) como featured_media
//
// Uso: OPENAI_API_KEY=sk-... node upload-to-wp.js

var fs = require('fs')
var path = require('path')
var fetch = require('node-fetch')

var WP = 'https://www.halterlift.cl'
var WP_USER = 'Admin'
var WP_PASS = 'adMHL12345!!'
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')
var OPENAI_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_KEY) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

var DIR = path.join(__dirname, 'halterlift-articles')

async function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms) }) }

function parseArticle(filepath) {
  var html = fs.readFileSync(filepath, 'utf8')

  // Extraer título del <title>
  var titleMatch = html.match(/<title>([^|]+)/)
  var title = titleMatch ? titleMatch[1].trim() : path.basename(filepath, '.html')

  // Extraer slug del canonical o comentarios
  var slugMatch = html.match(/Slug[:/]\s*([a-z0-9-]+)/i) || html.match(/slug:\s*([a-z0-9-]+)/i)
  var slug = slugMatch ? slugMatch[1] : path.basename(filepath, '.html').replace(/^\d+-/, '')

  // Extraer meta description
  var descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)
  var description = descMatch ? descMatch[1] : ''

  // Extraer keyword foco
  var kwMatch = html.match(/Keyword\s+(?:principal|foco):\s*(.+)/i)
  var keyword = kwMatch ? kwMatch[1].trim() : ''

  // Extraer contenido entre marcadores
  var startMarker = '<!-- INICIO CONTENIDO WORDPRESS -->'
  var endMarker = '<!-- FIN CONTENIDO WORDPRESS -->'
  var startIdx = html.indexOf(startMarker)
  var endIdx = html.indexOf(endMarker)
  var content = ''
  if (startIdx !== -1 && endIdx !== -1) {
    content = html.substring(startIdx + startMarker.length, endIdx).trim()
  }

  return { title: title, slug: slug, description: description, keyword: keyword, content: content }
}

async function generarImagenBuffer(titulo) {
  console.log('  🎨 Generando imagen...')
  var prompt = 'Professional, modern blog header image about: ' + titulo + '. Industrial warehouse, forklifts, electric stackers, logistics context. Clean minimalist design, industrial blue and yellow tones, machinery elements. NO text, NO words, NO letters, NO numbers in the image.'
  var r = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt: prompt, n: 1, size: '1024x1024', quality: 'low' })
  })
  var data = await r.json()
  if (!data.data || !data.data[0]) {
    console.log('  ⚠️ OpenAI no retornó imagen:', JSON.stringify(data).substring(0, 300))
    return null
  }
  if (data.data[0].b64_json) {
    console.log('  ✅ Imagen generada')
    return Buffer.from(data.data[0].b64_json, 'base64')
  }
  if (data.data[0].url) {
    var imgRes = await fetch(data.data[0].url)
    console.log('  ✅ Imagen generada')
    return await imgRes.buffer()
  }
  return null
}

async function subirImagenWP(imgBuffer, titulo) {
  console.log('  📤 Subiendo imagen a WP...')
  var slug = (titulo || 'blog').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').substring(0, 50)
  var filename = slug + '-' + Date.now() + '.png'
  var r = await fetch(WP + '/wp-json/wp/v2/media', {
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Disposition': 'attachment; filename="' + filename + '"',
      'Content-Type': 'image/png'
    },
    body: imgBuffer
  })
  var media = await r.json()
  if (media.id) {
    console.log('  ✅ Media ID: ' + media.id)
    return media.id
  }
  console.log('  ⚠️ Error media:', JSON.stringify(media).substring(0, 200))
  return null
}

async function publicarPost(art, mediaId) {
  console.log('  📝 Publicando en WordPress...')
  var body = {
    title: art.title,
    slug: art.slug,
    content: art.content,
    status: 'publish'
  }
  if (mediaId) body.featured_media = mediaId
  // Intentar setear Yoast meta
  body.meta = {}
  if (art.description) body.meta._yoast_wpseo_metadesc = art.description
  if (art.keyword) body.meta._yoast_wpseo_focuskw = art.keyword
  if (art.title) body.meta._yoast_wpseo_title = art.title + ' | Halterlift'

  var r = await fetch(WP + '/wp-json/wp/v2/posts', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  var post = await r.json()
  if (post.id) {
    console.log('  ✅ Publicado: ' + (post.link || WP + '/' + art.slug + '/'))
    return post
  }
  console.log('  ❌ Error:', JSON.stringify(post).substring(0, 300))
  return null
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  HALTERLIFT — Subir 10 artículos a WP')
  console.log('═══════════════════════════════════════════\n')

  // Verificar conexión WP
  var test = await fetch(WP + '/wp-json/wp/v2/posts?per_page=1', { headers: { Authorization: AUTH } })
  if (!test.ok) {
    console.error('❌ No se pudo conectar a WordPress. Status:', test.status)
    var err = await test.text()
    console.error(err.substring(0, 300))
    process.exit(1)
  }
  console.log('✅ Conexión a WordPress OK\n')

  // Obtener slugs existentes para no duplicar
  var existRes = await fetch(WP + '/wp-json/wp/v2/posts?per_page=100&_fields=slug', { headers: { Authorization: AUTH } })
  var existPosts = await existRes.json()
  var existSlugs = new Set(existPosts.map(function(p) { return p.slug }))
  console.log('Posts existentes: ' + existSlugs.size + '\n')

  // Leer archivos HTML
  var files = fs.readdirSync(DIR).filter(function(f) { return f.endsWith('.html') }).sort()
  console.log('Artículos a procesar: ' + files.length + '\n')

  var ok = 0, skip = 0, fail = 0

  for (var i = 0; i < files.length; i++) {
    var filepath = path.join(DIR, files[i])
    var art = parseArticle(filepath)

    console.log('[' + (i+1) + '/' + files.length + '] ' + art.title)
    console.log('  Slug: ' + art.slug)
    console.log('  Contenido: ' + art.content.length + ' chars')

    // Skip si ya existe
    if (existSlugs.has(art.slug)) {
      console.log('  ⏭️  Ya existe, saltando\n')
      skip++
      continue
    }

    if (!art.content || art.content.length < 1000) {
      console.log('  ⚠️ Contenido muy corto, saltando\n')
      fail++
      continue
    }

    try {
      // Generar imagen
      var imgBuffer = await generarImagenBuffer(art.title)
      var mediaId = null
      if (imgBuffer) {
        mediaId = await subirImagenWP(imgBuffer, art.title)
      }

      // Publicar
      var post = await publicarPost(art, mediaId)
      if (post) {
        ok++
      } else {
        fail++
      }
    } catch(e) {
      fail++
      console.log('  ❌ ' + e.message)
    }

    console.log('')

    // Rate limit
    if (i < files.length - 1) {
      console.log('  ⏳ Esperando 15s...')
      await sleep(15000)
    }
  }

  console.log('\n═══════════════════════════════════════════')
  console.log('  RESULTADO: ' + ok + ' OK, ' + skip + ' SKIP, ' + fail + ' FAIL')
  console.log('═══════════════════════════════════════════')
}

main().catch(function(e) { console.error('Error:', e.message); process.exit(1) })
