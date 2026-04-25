// copilot-setup-auth.js
// Configura auth para Copilot: agrega password_hash a clipping_suscripciones
// y crea el primer usuario con password
// Requiere: SUPABASE_URL, SUPABASE_SERVICE_KEY
// Uso: node scripts/copilot-setup-auth.js --email=x@y.com --password=abc123
// Si se ejecuta sin args, solo verifica el estado

var fetch = require('node-fetch')
var supabaseLib = require('@supabase/supabase-js')
var crypto = require('crypto')

var SUPABASE_URL = process.env.SUPABASE_URL
var SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
var EMAIL = (process.argv.find(function(a) { return a.startsWith('--email=') }) || '').replace('--email=', '')
var PASSWORD = (process.argv.find(function(a) { return a.startsWith('--password=') }) || '').replace('--password=', '')

// Simple bcrypt-like hash using crypto (no bcrypt dependency needed in GitHub Actions)
// We use SHA-256 with salt — the API route will use bcryptjs for proper comparison
function hashPassword(password) {
  var salt = crypto.randomBytes(16).toString('hex')
  var hash = crypto.createHash('sha256').update(salt + password).digest('hex')
  return 'sha256:' + salt + ':' + hash
}

function verifyPassword(password, stored) {
  if (stored.startsWith('sha256:')) {
    var parts = stored.split(':')
    var salt = parts[1]
    var hash = parts[2]
    var check = crypto.createHash('sha256').update(salt + password).digest('hex')
    return check === hash
  }
  // bcrypt format: $2a$... or $2b$...
  // Can't verify bcrypt without bcryptjs, return null to indicate "use bcrypt"
  return null
}

async function main() {
  console.log('\n╔══════════════════════════════════════╗')
  console.log('║    COPILOT AUTH SETUP                 ║')
  console.log('╚══════════════════════════════════════╝')

  var supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY)

  // 1. Check if password_hash column exists
  console.log('\n   Verificando columnas auth...')
  var testRes = await supabase.from('clipping_suscripciones').select('id, email').limit(1)
  if (testRes.error) {
    console.error('   ERROR: no se puede acceder a clipping_suscripciones:', testRes.error.message)
    process.exit(1)
  }

  // Try to read password_hash — if it doesn't exist, we need to run SQL
  var hashRes = await supabase.from('clipping_suscripciones').select('id, email, password_hash').limit(1)
  if (hashRes.error && hashRes.error.message.includes('password_hash')) {
    console.log('   ❌ Columna password_hash NO existe')
    console.log('')
    console.log('   ═══ EJECUTAR ESTE SQL EN SUPABASE DASHBOARD ═══')
    console.log('   https://supabase.com/dashboard/project/faitwrutauavjwnsnlzq/sql')
    console.log('')
    console.log('   ALTER TABLE clipping_suscripciones ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT NULL;')
    console.log('   ALTER TABLE clipping_suscripciones ADD COLUMN IF NOT EXISTS debe_cambiar_password BOOLEAN DEFAULT true;')
    console.log('   ALTER TABLE clipping_suscripciones ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMPTZ DEFAULT NULL;')
    console.log('')
    console.log('   Después de ejecutar el SQL, correr este script de nuevo.')
    process.exit(1)
  }

  console.log('   ✅ Columna password_hash existe')

  // 2. List all suscripciones and their auth status
  var allRes = await supabase.from('clipping_suscripciones').select('id, email, nombre, plan, estado, password_hash')
  var subs = allRes.data || []
  console.log('\n   Suscripciones: ' + subs.length)
  subs.forEach(function(s) {
    var hasPass = !!(s.password_hash)
    console.log('   ' + (hasPass ? '🔑' : '⚠️ ') + ' ' + s.email + ' (' + s.plan + '/' + s.estado + ')' + (hasPass ? ' — tiene password' : ' — SIN PASSWORD'))
  })

  // 3. Set password if --email and --password provided
  if (EMAIL && PASSWORD) {
    console.log('\n   Configurando password para ' + EMAIL + '...')
    var sub = subs.find(function(s) { return s.email === EMAIL })
    if (!sub) {
      console.error('   ERROR: email ' + EMAIL + ' no encontrado en suscripciones')
      process.exit(1)
    }
    if (PASSWORD.length < 6) {
      console.error('   ERROR: password debe tener al menos 6 caracteres')
      process.exit(1)
    }

    var hash = hashPassword(PASSWORD)
    var upd = await supabase.from('clipping_suscripciones')
      .update({ password_hash: hash, debe_cambiar_password: false })
      .eq('id', sub.id)
    if (upd.error) {
      console.error('   ERROR:', upd.error.message)
      process.exit(1)
    }

    // Verify
    var verify = verifyPassword(PASSWORD, hash)
    console.log('   ✅ Password configurado para ' + EMAIL)
    console.log('   ✅ Verificación: ' + (verify ? 'OK' : 'FAIL'))
    console.log('   Hash: ' + hash.substring(0, 30) + '...')
  } else if (!EMAIL && !PASSWORD) {
    console.log('\n   Para configurar un password:')
    console.log('   node scripts/copilot-setup-auth.js --email=x@y.com --password=miClave123')
  }

  console.log('\n   Done.\n')
}

main().catch(function(e) { console.error('FATAL:', e.message); process.exit(1) })

module.exports = { hashPassword: hashPassword, verifyPassword: verifyPassword }
