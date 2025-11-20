// APLICAR MIGRACIÓN 004 DIRECTAMENTE EN SUPABASE
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
console.log('📊 APLICAR MIGRACIÓN 004: TABLAS DE INTEGRACIONES')
console.log('═══════════════════════════════════════════════════════════\n')

// Leer archivo SQL
const sqlPath = resolve(__dirname, '../database/migrations/004_create_integrations_tables.sql')
const sqlContent = readFileSync(sqlPath, 'utf-8')

console.log('📝 Leyendo archivo de migración...\n')

// Dividir el SQL en statements individuales
const statements = sqlContent
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))

console.log(`🔢 ${statements.length} statements a ejecutar\n`)

let successCount = 0
let errorCount = 0

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i]

  // Identificar tipo de statement
  let statementType = 'UNKNOWN'
  if (statement.toUpperCase().includes('CREATE TABLE')) {
    const match = statement.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i)
    statementType = match ? `CREATE TABLE ${match[1]}` : 'CREATE TABLE'
  } else if (statement.toUpperCase().includes('CREATE INDEX')) {
    const match = statement.match(/CREATE INDEX\s+(\w+)/i)
    statementType = match ? `CREATE INDEX ${match[1]}` : 'CREATE INDEX'
  } else if (statement.toUpperCase().includes('COMMENT ON')) {
    statementType = 'COMMENT'
  }

  try {
    console.log(`⏳ Ejecutando: ${statementType}...`)

    // Usar rpc para ejecutar SQL raw
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })

    if (error) {
      // Si el error es que la función no existe, intentar con otro método
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        // Intentar crear las tablas directamente usando el cliente
        console.log(`   ⚠️  RPC no disponible, intentando método alternativo...`)
        // Para este caso, necesitaremos ejecutar via REST API directamente
        errorCount++
      } else {
        console.log(`   ❌ Error: ${error.message}`)
        errorCount++
      }
    } else {
      console.log(`   ✅ Ejecutado exitosamente`)
      successCount++
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    errorCount++
  }
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('📊 RESULTADO DE LA MIGRACIÓN')
console.log('═══════════════════════════════════════════════════════════')
console.log(`✅ Exitosos: ${successCount}`)
console.log(`❌ Errores: ${errorCount}`)
console.log(`📊 Total: ${statements.length}\n`)

if (errorCount > 0) {
  console.log('⚠️  Hubo errores. Vamos a intentar con conexión directa PostgreSQL...\n')
  process.exit(1)
} else {
  console.log('✅ Migración completada exitosamente!\n')
  process.exit(0)
}
