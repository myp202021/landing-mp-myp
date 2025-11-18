// Script para crear la función SQL verificar_login en Supabase
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
    value = value.replace(/^["']|["']$/g, '')
    value = value.replace(/\n/g, '')
    envVars[key] = value
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createFunction() {
  console.log('🔧 Creando función SQL verificar_login...\n')

  // Leer el archivo SQL
  const sqlPath = resolve(__dirname, '../database/create_verificar_login_function.sql')
  const sql = readFileSync(sqlPath, 'utf-8')

  // Ejecutar el SQL (sin comentarios y queries SELECT finales)
  const sqlCommands = sql
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('SELECT'))

  for (const command of sqlCommands) {
    console.log('Ejecutando:', command.substring(0, 60) + '...')

    const { error } = await supabase.rpc('exec_sql', { sql_query: command })

    if (error) {
      console.error('❌ Error:', error.message)
      // Intentar ejecutar directamente
      console.log('Intentando método alternativo...')
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql_query: command })
      })

      if (!response.ok) {
        console.error('También falló el método alternativo')
      }
    }
  }

  console.log('\n✅ Proceso completado')
  console.log('\nAhora prueba el login con:')
  console.log('  Usuario: myp')
  console.log('  Contraseña: mypcliente2025')
}

createFunction()
