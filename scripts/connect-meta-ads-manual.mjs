// GUARDAR CONEXIÓN DE META ADS MANUALMENTE
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
console.log('🔗 CONECTAR META ADS AL CRM (MANUAL)')
console.log('═══════════════════════════════════════════════════════════\n')

console.log('📋 Antes de continuar, asegúrate de tener:')
console.log('  1. ✅ System User Token de Meta (Token permanente - NO expira)')
console.log('  2. ✅ Ad Account ID (ejemplo: act_123456789)')
console.log('  3. ✅ Aplicado la migración 004 en Supabase')
console.log('\n💡 IMPORTANTE: Usa System User Token (no User Access Token)')
console.log('   Ver guía: docs/META-ADS-SYSTEM-USER-TOKEN.md\n')

const continuar = await question('¿Continuar? (y/n): ')

if (continuar.toLowerCase() !== 'y') {
  console.log('\n❌ Cancelado')
  rl.close()
  process.exit(0)
}

console.log('\n📝 Ingresa los datos de la conexión:\n')

const accessToken = await question('🔑 System User Token de Meta (permanente): ')
const accountId = await question('🆔 Ad Account ID (ej: act_123456789): ')
const accountName = await question('📛 Nombre de la cuenta (ej: M&P Marketing - Principal): ')

console.log('\n🔍 Validando datos...\n')

// Validaciones básicas
if (!accessToken || accessToken.length < 50) {
  console.error('❌ Access Token inválido (muy corto)')
  rl.close()
  process.exit(1)
}

if (!accountId || !accountId.startsWith('act_')) {
  console.error('❌ Ad Account ID debe empezar con "act_"')
  rl.close()
  process.exit(1)
}

// Probar conexión con Meta API
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
    rl.close()
    process.exit(1)
  }

  console.log('✅ Conexión exitosa con Meta!')
  console.log(`   Cuenta: ${data.name}`)
  console.log(`   Estado: ${data.account_status === 1 ? 'ACTIVA' : 'INACTIVA'}`)
  console.log(`   Moneda: ${data.currency}\n`)

} catch (error) {
  console.error('❌ Error de red:', error.message)
  rl.close()
  process.exit(1)
}

// Guardar en Supabase
console.log('💾 Guardando integración en Supabase...\n')

try {
  const { data: integration, error } = await supabase
    .from('platform_integrations')
    .insert({
      plataforma: 'meta_ads',
      account_id: accountId,
      account_name: accountName || `Meta Ads - ${accountId}`,
      access_token: accessToken,
      refresh_token: null, // Meta no usa refresh token
      token_expiry: null, // System User Token NO expira nunca (como Reportei)
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
    rl.close()
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
  rl.close()
  process.exit(1)
}

rl.close()
process.exit(0)
