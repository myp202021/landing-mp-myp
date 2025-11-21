// ACTUALIZAR TOKEN DE META ADS
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Leer variables de entorno
const envPath = resolve(__dirname, '../.env.local')
const envFile = readFileSync(envPath, 'utf-8')
const envVars = {}

envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    let value = match[2].trim()
    value = value.replace(/^[\"']|[\"']$/g, '')
    value = value.replace(/\n/g, '')
    envVars[key] = value
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

console.log('═══════════════════════════════════════════════════════════')
console.log('🔄 ACTUALIZAR TOKEN DE META ADS')
console.log('═══════════════════════════════════════════════════════════\n')

// Obtener integración actual
console.log('🔍 Buscando integración de Meta Ads...\n')

const { data: integration, error: findError } = await supabase
  .from('platform_integrations')
  .select('*')
  .eq('plataforma', 'meta_ads')
  .single()

if (findError || !integration) {
  console.error('❌ No se encontró integración de Meta Ads')
  console.error('   Ejecuta primero: node scripts/connect-meta-ads-manual.mjs')
  rl.close()
  process.exit(1)
}

console.log('✅ Integración encontrada:')
console.log(`   Account ID: ${integration.account_id}`)
console.log(`   Account Name: ${integration.account_name}`)
console.log(`   Última sincronización: ${integration.last_sync || 'Nunca'}`)
console.log(`   Estado: ${integration.sync_status}\n`)

console.log('📝 Ingresa el nuevo System User Token de Meta:\n')
console.log('💡 Dónde obtenerlo:')
console.log('   1. Ve a Meta Business Suite')
console.log('   2. Configuración de la empresa')
console.log('   3. System Users')
console.log('   4. Selecciona tu System User')
console.log('   5. Genera un nuevo token con permisos: ads_read, ads_management')
console.log('   6. Selecciona expiración: 60 días (máximo disponible)')
console.log('   ⚠️  Nota: Deberás renovar el token cada 60 días\n')

const newToken = await question('🔑 Nuevo System User Token: ')
const expiryDays = await question('⏰ Días de expiración (60 días recomendado): ')

if (!newToken || newToken.length < 50) {
  console.error('\n❌ Token inválido (muy corto)')
  rl.close()
  process.exit(1)
}

// Validar token con Meta API
console.log('\n🧪 Validando nuevo token con Meta API...\n')

try {
  const testUrl = `https://graph.facebook.com/v21.0/${integration.account_id}?fields=name,account_status,currency&access_token=${newToken}`
  const response = await fetch(testUrl)
  const data = await response.json()

  if (data.error) {
    console.error('❌ Error validando token:')
    console.error(`   ${data.error.message}`)
    console.error('\n💡 Posibles causas:')
    console.error('   - Token expirado o inválido')
    console.error('   - Permisos insuficientes')
    console.error('   - Ad Account ID incorrecto')
    rl.close()
    process.exit(1)
  }

  console.log('✅ Token válido!')
  console.log(`   Cuenta: ${data.name}`)
  console.log(`   Estado: ${data.account_status === 1 ? 'ACTIVA' : 'INACTIVA'}`)
  console.log(`   Moneda: ${data.currency}\n`)

} catch (error) {
  console.error('❌ Error de red:', error.message)
  rl.close()
  process.exit(1)
}

// Calcular fecha de expiración
const expiryDate = new Date()
expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays || 60))

// Actualizar token en Supabase
console.log('💾 Actualizando token en Supabase...\n')

try {
  const { error: updateError } = await supabase
    .from('platform_integrations')
    .update({
      access_token: newToken,
      token_expiry: expiryDate.toISOString(),
      sync_status: 'active',
      sync_error: null,
      connected_at: new Date().toISOString()
    })
    .eq('id', integration.id)

  if (updateError) {
    console.error('❌ Error actualizando:', updateError.message)
    rl.close()
    process.exit(1)
  }

  console.log('✅ Token actualizado exitosamente!')
  console.log(`   Expira: ${expiryDate.toLocaleDateString('es-CL')} (${expiryDays} días)`)

  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('✅ TOKEN ACTUALIZADO')
  console.log('═══════════════════════════════════════════════════════════')

  console.log('\n⚠️  RECORDATORIO:')
  console.log(`   El token expirará el ${expiryDate.toLocaleDateString('es-CL')}`)
  console.log('   Configura un recordatorio para renovarlo antes de esa fecha\n')

  console.log('📋 SIGUIENTE PASO:')
  console.log('   Sincroniza las campañas con:')
  console.log('   → node scripts/sync-meta-campaigns-enhanced.mjs')
  console.log('\n   O con el script básico:')
  console.log('   → node scripts/sync-meta-campaigns.mjs\n')

} catch (error) {
  console.error('❌ Error inesperado:', error)
  rl.close()
  process.exit(1)
}

rl.close()
process.exit(0)
