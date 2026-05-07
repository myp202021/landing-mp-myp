// copilot-reset-todo.js
// Borra TODOS los datos de Copilot para empezar de cero
// Uso: node scripts/copilot-reset-todo.js
// Requiere: SUPABASE_URL y SUPABASE_SERVICE_KEY en env o .env.local

var { createClient } = require('@supabase/supabase-js')

// Intentar leer de .env.local si existe
try {
  var fs = require('fs')
  var envFile = fs.readFileSync('.env.local', 'utf8')
  envFile.split('\n').forEach(function(line) {
    var match = line.match(/^([^=]+)=(.*)$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim()
  })
} catch(e) {}

var SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
var SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan SUPABASE_URL y SUPABASE_SERVICE_KEY')
  console.error('Opciones:')
  console.error('  1. Tener .env.local con las keys')
  console.error('  2. SUPABASE_URL=xxx SUPABASE_SERVICE_KEY=xxx node scripts/copilot-reset-todo.js')
  process.exit(1)
}

var supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Tablas a borrar en orden (dependencias primero)
var TABLAS = [
  'copilot_aprendizajes',
  'copilot_reportes',
  'copilot_benchmarks',
  'copilot_auditorias',
  'copilot_ideas',
  'copilot_guiones',
  'copilot_ads_creativos',
  'copilot_arboles',
  'copilot_access_log',
  'radar_contenido',
  'radar_posts',
  'clipping_suscripciones',  // al final — es la tabla madre
]

async function main() {
  console.log('═══════════════════════════════════════')
  console.log('  COPILOT — RESET COMPLETO')
  console.log('  Borrando TODOS los datos de prueba')
  console.log('═══════════════════════════════════════\n')

  for (var tabla of TABLAS) {
    try {
      // Contar antes de borrar
      var { count } = await supabase.from(tabla).select('*', { count: 'exact', head: true })

      if (count === 0 || count === null) {
        console.log('  ⏭️  ' + tabla + ' — vacía o no existe')
        continue
      }

      // Borrar todo (neq a un UUID imposible = matchea todo)
      var { error } = await supabase.from(tabla).delete().neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) {
        // Intentar con otro approach si falla
        var { error: error2 } = await supabase.from(tabla).delete().gte('created_at', '2000-01-01')
        if (error2) {
          console.log('  ❌ ' + tabla + ' — error: ' + (error2.message || error.message))
        } else {
          console.log('  ✅ ' + tabla + ' — ' + count + ' filas borradas')
        }
      } else {
        console.log('  ✅ ' + tabla + ' — ' + count + ' filas borradas')
      }
    } catch (e) {
      console.log('  ⚠️  ' + tabla + ' — ' + e.message)
    }
  }

  console.log('\n═══════════════════════════════════════')
  console.log('  RESET COMPLETO')
  console.log('  Copilot está limpio para test desde 0')
  console.log('═══════════════════════════════════════')
}

main().catch(function(e) { console.error('Error:', e.message); process.exit(1) })
