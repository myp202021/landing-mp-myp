// backfill-blog-images.js
// Genera imagen con gpt-image-1 para todos los posts de Supabase que no tienen image_url
// Sube a Supabase Storage y actualiza el campo
//
// Requiere: SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY

const { createClient } = require('@supabase/supabase-js')
const fetch = globalThis.fetch || require('node-fetch')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const OPENAI = process.env.OPENAI_API_KEY

if (!OPENAI) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50)
}

async function main() {
  console.log('Backfill Blog Images — mulleryperez.cl')
  console.log('=======================================\n')

  // Get all posts
  var { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, image_url')
    .order('date_published', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
    process.exit(1)
  }

  var sinImagen = posts.filter(function(p) { return !p.image_url })
  console.log('Total posts:', posts.length)
  console.log('Con imagen:', posts.length - sinImagen.length)
  console.log('Sin imagen:', sinImagen.length)

  if (sinImagen.length === 0) {
    console.log('\n✅ Todos los posts ya tienen imagen')
    return
  }

  var ok = 0, fail = 0

  for (var i = 0; i < sinImagen.length; i++) {
    var post = sinImagen[i]
    var title = post.title || post.slug
    console.log('\n[' + (i + 1) + '/' + sinImagen.length + '] ' + title.substring(0, 55))

    try {
      // Generate image
      var prompt = 'Professional blog header about: ' + title.substring(0, 80) + '. Digital marketing, performance, business. Clean minimalist design, blue-purple gradient tones, tech and data elements. NO text, NO words, NO letters.'
      var imgRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + OPENAI, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-image-1', prompt: prompt, n: 1, size: '1536x1024', quality: 'low' })
      })
      var imgData = await imgRes.json()

      if (!imgData.data || !imgData.data[0]) {
        console.log('  SKIP — no image generated:', JSON.stringify(imgData).substring(0, 100))
        fail++
        continue
      }

      // Get buffer
      var buffer
      if (imgData.data[0].b64_json) {
        buffer = Buffer.from(imgData.data[0].b64_json, 'base64')
      } else if (imgData.data[0].url) {
        var dlRes = await fetch(imgData.data[0].url)
        buffer = Buffer.from(await dlRes.arrayBuffer())
      } else {
        console.log('  SKIP — no image data')
        fail++
        continue
      }

      // Upload to Supabase Storage
      var filename = slugify(title) + '-' + Date.now() + '.png'
      var { error: upErr } = await supabase.storage
        .from('blog-images')
        .upload(filename, buffer, { contentType: 'image/png', upsert: true })

      if (upErr) {
        console.log('  SKIP upload:', upErr.message)
        fail++
        continue
      }

      // Get public URL
      var { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(filename)

      // Update post
      var { error: updErr } = await supabase
        .from('blog_posts')
        .update({ image_url: urlData.publicUrl })
        .eq('id', post.id)

      if (updErr) {
        console.log('  SKIP update:', updErr.message)
        fail++
        continue
      }

      console.log('  ✅ ' + urlData.publicUrl.substring(0, 60) + '...')
      ok++

      // Rate limit
      await new Promise(function(r) { setTimeout(r, 2000) })
    } catch (e) {
      console.log('  ❌ ' + e.message)
      fail++
    }
  }

  console.log('\n=======================================')
  console.log('DONE: ' + ok + ' ok, ' + fail + ' fail')
  console.log('=======================================')
}

main().catch(function(e) { console.error('FATAL:', e); process.exit(1) })
