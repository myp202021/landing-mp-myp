// scrape-competencia.js
// Corre todos los días L-V a las 08:50 AM via GitHub Actions
// Scrape Instagram de competidores de Buses Hualpén y guarda en Supabase

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = process.env.APIFY_TOKEN
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const COMPETIDORES = [
  { nombre: 'Viggo',                 instagram: 'viggo_chile',           web: 'viggo.cl' },
  { nombre: 'Tándem Industrial',     instagram: 'tandem.industrial',     web: 'tandemindustrial.cl' },
  { nombre: 'Yanguas',               instagram: 'yanguas.cl',            web: 'yanguas.cl' },
  { nombre: 'Buses JM',              instagram: 'busesjm.cl',            web: 'busesjm.cl' },
  { nombre: 'CVU',                   instagram: 'transportescvu_ssee',   web: 'transportescvu.cl' },
  { nombre: 'Nortrans',              instagram: 'nortransspa',           web: 'nortrans.cl' },
  { nombre: 'Géminis',               instagram: 'busesgeminis',          web: 'geminis.cl' },
  { nombre: 'Verschae',              instagram: 'flota_verschae',        web: 'verschae.cl' },
  { nombre: 'Transportes Calderón',  instagram: 'transportescalderon',   web: 'transportescalderon.cl' },
  { nombre: 'Pullman Yuris',         instagram: 'busesyuris',            web: 'pullmanyuris.cl' },
  // Sokol y Pullman San Luis sin Instagram confirmado — aparecen como sin actividad
  { nombre: 'Sokol',                 instagram: null,                    web: 'gruposokol.com' },
  { nombre: 'Pullman San Luis',      instagram: null,                    web: 'pullmansanluis.cl' },
]

async function main() {
  const hoy = new Date().toISOString().split('T')[0]
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

  console.log(`📅 Generando reporte para ${hoy}...`)

  // Eliminar reporte del día (para evitar duplicados si se corre de nuevo)
  await supabase.from('reportes_competencia').delete().eq('fecha_reporte', hoy)

  // Competidores con Instagram
  const conIG = COMPETIDORES.filter(c => c.instagram)
  const profileUrls = conIG.map(c => `https://www.instagram.com/${c.instagram}/`)

  let posts = []

  try {
    console.log(`🔍 Scrapeando ${profileUrls.length} perfiles de Instagram...`)

    // Llamada sincrónica a Apify (espera hasta 5 min)
    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=280`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directUrls: profileUrls,
          resultsType: 'posts',
          resultsLimit: 6,          // últimos 6 posts por perfil
          addParentData: true,      // incluye ownerUsername
        }),
      }
    )

    if (!res.ok) {
      throw new Error(`Apify error: ${res.status} ${await res.text()}`)
    }

    const allPosts = await res.json()

    // Filtrar solo posts de las últimas 24 horas
    posts = allPosts.filter(p => p.timestamp && new Date(p.timestamp) > hace24h)
    console.log(`✅ ${posts.length} posts nuevos en las últimas 24h`)

  } catch (err) {
    console.error('❌ Error en scraping:', err.message)
    // Continua para registrar sin_actividad en todos
  }

  // Insertar posts encontrados
  const competidoresConPost = new Set()

  for (const post of posts) {
    const handle = post.ownerUsername?.toLowerCase()
    const competidor = conIG.find(c => c.instagram?.toLowerCase() === handle)
    if (!competidor) continue

    competidoresConPost.add(competidor.nombre)

    const { error } = await supabase.from('reportes_competencia').insert({
      competidor:       competidor.nombre,
      instagram_handle: competidor.instagram,
      red_social:       'Instagram',
      post_url:         post.url || `https://www.instagram.com/p/${post.shortCode}/`,
      post_texto:       (post.caption || '').substring(0, 600),
      post_imagen:      post.displayUrl || null,
      likes:            post.likesCount || 0,
      comentarios:      post.commentsCount || 0,
      fecha_post:       post.timestamp || null,
      fecha_reporte:    hoy,
      sin_actividad:    false,
    })

    if (error) console.error(`Error guardando post de ${competidor.nombre}:`, error.message)
  }

  // Insertar sin_actividad para los que no publicaron
  for (const comp of COMPETIDORES) {
    if (competidoresConPost.has(comp.nombre)) continue

    await supabase.from('reportes_competencia').insert({
      competidor:       comp.nombre,
      instagram_handle: comp.instagram || null,
      red_social:       'Instagram',
      post_url:         null,
      post_texto:       null,
      post_imagen:      null,
      likes:            null,
      comentarios:      null,
      fecha_post:       null,
      fecha_reporte:    hoy,
      sin_actividad:    true,
    })
  }

  console.log(`🏁 Reporte listo: ${competidoresConPost.size} competidores con actividad, ${COMPETIDORES.length - competidoresConPost.size} sin actividad.`)
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
