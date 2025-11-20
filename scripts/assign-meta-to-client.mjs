// ASIGNAR CUENTA DE META ADS A UN CLIENTE
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

console.log('═══════════════════════════════════════════════════════════')
console.log('🔗 ASIGNAR CUENTA DE META ADS A CLIENTE')
console.log('═══════════════════════════════════════════════════════════\n')

// PASO 1: Buscar cliente "M&P Marketing y Performance"
console.log('🔍 Buscando cliente "M&P Marketing y Performance"...\n')

const { data: cliente, error: clienteError } = await supabase
  .from('clientes')
  .select('*')
  .ilike('nombre', '%m&p%')
  .single()

if (clienteError || !cliente) {
  console.error('❌ Cliente "M&P Marketing y Performance" no encontrado')
  console.error('   Verifica que existe en la tabla clientes')
  console.log('\n📋 Clientes disponibles:')

  const { data: todosClientes } = await supabase
    .from('clientes')
    .select('id, nombre, rubro')
    .limit(10)

  if (todosClientes && todosClientes.length > 0) {
    todosClientes.forEach(c => {
      console.log(`   - ${c.nombre} (${c.rubro || 'Sin rubro'})`)
    })
  }

  process.exit(1)
}

console.log('✅ Cliente encontrado:')
console.log(`   ID: ${cliente.id}`)
console.log(`   Nombre: ${cliente.nombre}`)
console.log(`   Rubro: ${cliente.rubro || 'Sin rubro'}\n`)

// PASO 2: Buscar integración de Meta Ads
console.log('🔍 Buscando integración de Meta Ads...\n')

const { data: integration, error: integrationError } = await supabase
  .from('platform_integrations')
  .select('*')
  .eq('plataforma', 'meta_ads')
  .eq('active', true)
  .order('connected_at', { ascending: false })
  .limit(1)
  .single()

if (integrationError || !integration) {
  console.error('❌ No se encontró ninguna integración activa de Meta Ads')
  console.error('   Ejecuta primero: node scripts/connect-meta-ads-manual.mjs')
  process.exit(1)
}

console.log('✅ Integración encontrada:')
console.log(`   ID: ${integration.id}`)
console.log(`   Account ID: ${integration.account_id}`)
console.log(`   Account Name: ${integration.account_name}`)
console.log(`   Conectado: ${new Date(integration.connected_at).toLocaleDateString('es-CL')}\n`)

// PASO 3: Verificar si ya existe el mapping
console.log('🔍 Verificando mappings existentes...\n')

const { data: existingMapping } = await supabase
  .from('client_platform_mapping')
  .select('*')
  .eq('cliente_id', cliente.id)
  .eq('integration_id', integration.id)
  .single()

if (existingMapping) {
  console.log('⚠️  Este cliente ya tiene asignada esta cuenta de Meta Ads')
  console.log(`   Mapping ID: ${existingMapping.id}`)
  console.log(`   Asignado: ${new Date(existingMapping.assigned_at).toLocaleDateString('es-CL')}`)
  console.log(`   Por: ${existingMapping.assigned_by}\n`)

  const respuesta = await new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    readline.question('¿Continuar de todas formas? (y/n): ', answer => {
      readline.close()
      resolve(answer)
    })
  })

  if (respuesta.toLowerCase() !== 'y') {
    console.log('\n❌ Cancelado')
    process.exit(0)
  }
}

// PASO 4: Crear mapping
console.log('💾 Creando asignación cliente → Meta Ads...\n')

const { data: mapping, error: mappingError } = await supabase
  .from('client_platform_mapping')
  .insert({
    cliente_id: cliente.id,
    integration_id: integration.id,
    assigned_at: new Date().toISOString(),
    assigned_by: 'admin@mulleryperez.cl',
    active: true
  })
  .select()
  .single()

if (mappingError) {
  if (mappingError.code === '23505') {
    console.log('✅ Mapping ya existe (actualizado)')
  } else {
    console.error('❌ Error creando mapping:', mappingError.message)
    process.exit(1)
  }
} else {
  console.log('✅ Asignación creada exitosamente!')
  console.log(`   Mapping ID: ${mapping.id}`)
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('✅ CUENTA DE META ADS ASIGNADA AL CLIENTE')
console.log('═══════════════════════════════════════════════════════════')

console.log('\n📊 RESUMEN:')
console.log(`   Cliente: ${cliente.nombre}`)
console.log(`   Meta Ads Account: ${integration.account_name}`)
console.log(`   Account ID: ${integration.account_id}`)

console.log('\n📋 SIGUIENTE PASO:')
console.log('   Sincroniza las campañas con:')
console.log('   → node scripts/sync-meta-campaigns.mjs\n')

process.exit(0)
