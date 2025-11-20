// APLICAR MIGRACIÓN 004 - MÉTODO DIRECTO
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

console.log('═══════════════════════════════════════════════════════════')
console.log('📊 APLICAR MIGRACIÓN 004 VIA REST API')
console.log('═══════════════════════════════════════════════════════════\n')
console.log(`🔗 Supabase URL: ${supabaseUrl}\n`)

// Leer SQL completo
const sqlPath = resolve(__dirname, '../database/migrations/004_create_integrations_tables.sql')
const sqlContent = readFileSync(sqlPath, 'utf-8')

// Usar REST API de Supabase para ejecutar SQL
const executeSQL = async (sql) => {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    },
    body: JSON.stringify({ query: sql })
  })

  return response
}

// Intentar con query endpoint
console.log('📡 Ejecutando migración via REST API...\n')

try {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ query: sqlContent })
  })

  if (!response.ok) {
    const error = await response.text()
    console.log('⚠️  REST API no disponible para ejecutar SQL raw')
    console.log('   Vamos a crear las tablas programáticamente...\n')
  } else {
    console.log('✅ Migración ejecutada exitosamente!\n')
    process.exit(0)
  }
} catch (error) {
  console.log('⚠️  Error con REST API, usando método alternativo...\n')
}

// Método alternativo: Usar SQL programático
console.log('🔄 Creando tablas programáticamente...\n')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Las tablas se tienen que crear via SQL Editor en Supabase
// Por ahora, vamos a mostrar las instrucciones
console.log('📋 INSTRUCCIONES:')
console.log('')
console.log('1. Ve a Supabase Dashboard → SQL Editor')
console.log('   URL: https://supabase.com/dashboard/project/faitwrutauavjwnsnlzq/sql')
console.log('')
console.log('2. Copia y pega el siguiente contenido del archivo:')
console.log('   database/migrations/004_create_integrations_tables.sql')
console.log('')
console.log('3. Click en "Run" para ejecutar')
console.log('')
console.log('═══════════════════════════════════════════════════════════')
console.log('')
console.log('💡 TIP: Puedes copiar el SQL con:')
console.log('   cat database/migrations/004_create_integrations_tables.sql | pbcopy')
console.log('')

// Mostrar un extracto del SQL
console.log('📄 VISTA PREVIA DEL SQL:')
console.log('───────────────────────────────────────────────────────────')
const lines = sqlContent.split('\n').slice(0, 30)
console.log(lines.join('\n'))
console.log('...')
console.log('───────────────────────────────────────────────────────────\n')

process.exit(1)
