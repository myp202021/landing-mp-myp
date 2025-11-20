// EJECUTAR MIGRACIÓN SQL EN SUPABASE
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

console.log('═══════════════════════════════════════════════════════════')
console.log('📊 EJECUTAR MIGRACIÓN SQL EN SUPABASE')
console.log('═══════════════════════════════════════════════════════════\n')

// Leer SQL
const sqlPath = resolve(__dirname, '../database/migrations/004_create_integrations_tables.sql')
const sqlContent = readFileSync(sqlPath, 'utf-8')

// Usar PostgREST API directamente para ejecutar SQL
const executeSQL = async (sql) => {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ sql_query: sql })
  })

  return {
    ok: response.ok,
    status: response.status,
    text: await response.text()
  }
}

console.log('🔄 Intentando ejecutar SQL via RPC...\n')

try {
  const result = await executeSQL(sqlContent)

  if (result.ok) {
    console.log('✅ Migración ejecutada exitosamente!\n')
    process.exit(0)
  } else {
    console.log(`❌ Error HTTP ${result.status}`)
    console.log(`   ${result.text}\n`)

    // Si falla, usar método alternativo
    console.log('⚠️  Método RPC no disponible.')
    console.log('   Intentando crear las tablas directamente...\n')

    // Dividir en statements individuales y ejecutar cada uno
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
      .filter(s => s.toUpperCase().includes('CREATE') || s.toUpperCase().includes('COMMENT'))

    console.log(`📋 ${statements.length} statements a ejecutar\n`)

    let successCount = 0

    for (const statement of statements) {
      try {
        const statementResult = await executeSQL(statement + ';')

        // Identificar tipo
        let type = 'UNKNOWN'
        if (statement.includes('CREATE TABLE')) {
          const match = statement.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i)
          type = match ? `CREATE TABLE ${match[1]}` : 'CREATE TABLE'
        } else if (statement.includes('CREATE INDEX')) {
          const match = statement.match(/CREATE INDEX\s+(\w+)/i)
          type = match ? `CREATE INDEX ${match[1]}` : 'CREATE INDEX'
        } else if (statement.includes('COMMENT')) {
          type = 'COMMENT'
        }

        if (statementResult.ok) {
          console.log(`✅ ${type}`)
          successCount++
        } else {
          console.log(`⚠️  ${type}: ${statementResult.text}`)
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`)
      }
    }

    console.log(`\n✅ ${successCount}/${statements.length} statements ejecutados\n`)
    process.exit(successCount > 0 ? 0 : 1)
  }
} catch (error) {
  console.error('❌ Error:', error.message)
  console.error('\n💡 No se pudo ejecutar el SQL automáticamente.')
  console.error('   Necesitas aplicar la migración manualmente en Supabase Dashboard.\n')
  process.exit(1)
}
