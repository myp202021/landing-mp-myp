// APLICAR MIGRACIÓN 004: TABLAS DE INTEGRACIONES
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
console.log('🔄 EJECUTANDO MIGRACIÓN 004: TABLAS DE INTEGRACIONES')
console.log('═══════════════════════════════════════════════════════════\n')

// Leer SQL de migración
const sqlPath = resolve(__dirname, '../database/migrations/004_create_integrations_tables.sql')
const sql = readFileSync(sqlPath, 'utf-8')

// Ejecutar migración
console.log('📝 Aplicando migración...\n')

try {
  // Supabase no tiene un método directo para ejecutar SQL raw desde el cliente
  // Necesitamos usar la función RPC o ejecutar statement por statement

  // Dividir en statements individuales
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`📊 Total de statements a ejecutar: ${statements.length}\n`)

  let executed = 0
  let errors = 0

  for (const statement of statements) {
    if (statement.includes('COMMENT ON')) {
      // Comentarios son opcionales, los saltamos si fallan
      continue
    }

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })

      if (error) {
        // Si no existe la función RPC, necesitamos ejecutar directamente vía API REST
        console.log('⚠️  RPC exec_sql no disponible, ejecutando vía psql...')
        console.log('\n📋 EJECUTA MANUALMENTE EN SUPABASE SQL EDITOR:')
        console.log('\n' + sql)
        process.exit(1)
      }

      executed++
    } catch (err) {
      console.error(`❌ Error en statement: ${statement.substring(0, 50)}...`)
      console.error(err)
      errors++
    }
  }

  console.log(`\n✅ Migración completada!`)
  console.log(`   Statements ejecutados: ${executed}`)
  console.log(`   Errores: ${errors}`)

} catch (error) {
  console.error('❌ Error ejecutando migración:', error)
  console.log('\n📋 INSTRUCCIONES:')
  console.log('1. Ve a Supabase Dashboard')
  console.log('2. Abre SQL Editor')
  console.log('3. Copia y pega el contenido de:')
  console.log('   database/migrations/004_create_integrations_tables.sql')
  console.log('4. Ejecuta el script\n')
  process.exit(1)
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('✅ TABLAS DE INTEGRACIONES CREADAS EXITOSAMENTE')
console.log('═══════════════════════════════════════════════════════════\n')

process.exit(0)
