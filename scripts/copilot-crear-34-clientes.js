// copilot-crear-34-clientes.js
// Crea suscripciones en clipping_suscripciones para los 34 clientes de grillas
// Sin scraping — solo perfil básico desde tabla clientes
// Cada uno queda con UUID accesible en /copilot/dashboard/[uuid]

var supabaseLib = require('@supabase/supabase-js')
var supabase = supabaseLib.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function main() {
  console.log('═══ CREAR 34 CLIENTES EN COPILOT ═══\n')

  // 1. Leer clientes existentes de tabla clientes
  var clientesRes = await supabase.from('clientes').select('id, nombre, rubro, contacto_email')
  if (clientesRes.error) { console.error('Error leyendo clientes:', clientesRes.error.message); return }
  var clientes = clientesRes.data || []
  console.log('Clientes en tabla: ' + clientes.length)

  // 2. Leer suscripciones existentes para no duplicar
  var subsRes = await supabase.from('clipping_suscripciones').select('id, email, perfil_empresa')
  var subsExistentes = (subsRes.data || []).map(function(s) {
    return ((s.perfil_empresa || {}).nombre || '').toLowerCase()
  })
  console.log('Suscripciones existentes: ' + subsExistentes.length)

  var creados = 0
  var saltados = 0

  for (var i = 0; i < clientes.length; i++) {
    var c = clientes[i]
    var nombre = c.nombre || ''

    // Verificar si ya existe
    if (subsExistentes.indexOf(nombre.toLowerCase()) !== -1) {
      console.log('  SKIP: ' + nombre + ' (ya existe)')
      saltados++
      continue
    }

    var email = c.contacto_email || 'contacto@mulleryperez.cl'
    var rubro = c.rubro || 'general'

    // Crear suscripción
    var insertRes = await supabase.from('clipping_suscripciones').insert({
      email: email,
      estado: 'activo',
      plan: 'test',
      perfil_empresa: {
        nombre: nombre,
        rubro: rubro,
        descripcion: '',
        tono: 'profesional y directo',
        propuesta_valor: '',
        diferenciadores: [],
        web: '',
        fuente: 'migrado_desde_clientes_grillas',
      },
      cuentas: [], // sin scraping por ahora
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertRes.error) {
      console.log('  ERROR: ' + nombre + ' — ' + insertRes.error.message)
    } else {
      creados++
      // Obtener el ID recién creado
      var newRes = await supabase.from('clipping_suscripciones')
        .select('id')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)

      var newId = newRes.data && newRes.data[0] ? newRes.data[0].id : '?'
      console.log('  ✓ ' + nombre + ' (' + rubro + ') → /copilot/dashboard/' + newId)
    }
  }

  console.log('\n═══ RESULTADO ═══')
  console.log('Creados: ' + creados)
  console.log('Saltados: ' + saltados)
  console.log('Total suscripciones ahora: ' + (subsExistentes.length + creados))
  console.log('\nDashboards accesibles en: https://www.mulleryperez.cl/copilot/dashboard/[uuid]')
}

main().catch(function(e) { console.error(e); process.exit(1) })
