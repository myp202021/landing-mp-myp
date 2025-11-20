// GUARDAR CONEXIÓN DE META ADS AUTOMÁTICAMENTE (SIN INTERACCIÓN)
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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

// Datos de conexión
const accessToken = process.argv[2]
const accountId = process.argv[3]
const accountName = process.argv[4]

if (!accessToken || !accountId || !accountName) {
  console.error('❌ Uso: node connect-meta-auto.mjs <access_token> <account_id> <account_name>')
  process.exit(1)
}

console.log('═══════════════════════════════════════════════════════════')
console.log('🔗 CONECTAR META ADS AL CRM (AUTOMÁTICO)')
console.log('═══════════════════════════════════════════════════════════\n')

console.log('📝 Datos de conexión:')
console.log(`   Account ID: ${accountId}`)
console.log(`   Account Name: ${accountName}\n`)

// PASO 1: Probar conexión con Meta API
console.log('🧪 Probando conexión con Meta API...\n')

try {
  const testUrl = `https://graph.facebook.com/v21.0/${accountId}?fields=name,account_status,currency&access_token=${accessToken}`
  const response = await fetch(testUrl)
  const data = await response.json()

  if (data.error) {
    console.error('❌ Error conectando con Meta API:')
    console.error(`   ${data.error.message}`)
    console.error('\n💡 Posibles causas:')
    console.error('   - Token expirado o inválido')
    console.error('   - Ad Account ID incorrecto')
    console.error('   - Permisos insuficientes (ads_read, ads_management)')
    process.exit(1)
  }

  console.log('✅ Conexión exitosa con Meta!')
  console.log(`   Cuenta: ${data.name}`)
  console.log(`   Estado: ${data.account_status === 1 ? 'ACTIVA' : 'INACTIVA'}`)
  console.log(`   Moneda: ${data.currency}\n`)

} catch (error) {
  console.error('❌ Error de red:', error.message)
  process.exit(1)
}

// PASO 2: Guardar en Supabase
console.log('💾 Guardando integración en Supabase...\n')

try {
  const { data: integration, error } = await supabase
    .from('platform_integrations')
    .insert({
      plataforma: 'meta_ads',
      account_id: accountId,
      account_name: accountName,
      access_token: accessToken,
      refresh_token: null,
      token_expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 días
      connected_by: 'admin@mulleryperez.cl',
      connected_at: new Date().toISOString(),
      last_sync: null,
      sync_status: 'active',
      active: true
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      console.error('❌ Esta cuenta ya está conectada')
      console.error('   Usa el script update-meta-token.mjs para actualizar el token')
    } else {
      console.error('❌ Error guardando en Supabase:', error.message)
    }
    process.exit(1)
  }

  console.log('✅ Integración guardada exitosamente!')
  console.log(`   ID: ${integration.id}`)
  console.log(`   Plataforma: ${integration.plataforma}`)
  console.log(`   Account ID: ${integration.account_id}`)
  console.log(`   Account Name: ${integration.account_name}`)

  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('✅ META ADS CONECTADO EXITOSAMENTE')
  console.log('═══════════════════════════════════════════════════════════')

  console.log('\n📋 SIGUIENTE PASO:')
  console.log('   Asigna esta cuenta a un cliente con:')
  console.log('   → node scripts/assign-meta-to-client.mjs\n')

} catch (error) {
  console.error('❌ Error inesperado:', error)
  process.exit(1)
}

process.exit(0)
