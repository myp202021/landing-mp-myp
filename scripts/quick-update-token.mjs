// QUICK UPDATE TOKEN
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

const newToken = process.argv[2]

if (!newToken) {
  console.error('❌ Uso: node scripts/quick-update-token.mjs YOUR_TOKEN')
  process.exit(1)
}

console.log('🔄 Actualizando token...\n')

const expiryDate = new Date()
expiryDate.setDate(expiryDate.getDate() + 60)

const { error } = await supabase
  .from('platform_integrations')
  .update({
    access_token: newToken,
    token_expiry: expiryDate.toISOString(),
    sync_status: 'active',
    sync_error: null,
    connected_at: new Date().toISOString()
  })
  .eq('plataforma', 'meta_ads')

if (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}

console.log('✅ Token actualizado!')
console.log(`   Expira: ${expiryDate.toLocaleDateString('es-CL')}`)
console.log('\n📋 Ahora ejecuta:')
console.log('   node scripts/sync-meta-campaigns-enhanced.mjs\n')

process.exit(0)
