#!/usr/bin/env node

/**
 * Script para listar todos los clientes en Supabase
 * Esto ayuda a identificar qué client_id usar en Zapier
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Leer variables de entorno de .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  let currentKey = null
  let currentValue = ''

  envContent.split('\n').forEach(line => {
    // Si línea empieza con una variable (KEY=)
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (match) {
      // Guardar variable anterior si existe
      if (currentKey) {
        process.env[currentKey] = currentValue.replace(/^["']|["']$/g, '').replace(/\n/g, '')
      }
      // Empezar nueva variable
      currentKey = match[1].trim()
      currentValue = match[2].trim()
    } else if (currentKey && line.trim()) {
      // Continuar valor multilínea
      currentValue += line.trim()
    }
  })

  // Guardar última variable
  if (currentKey) {
    process.env[currentKey] = currentValue.replace(/^["']|["']$/g, '').replace(/\n/g, '')
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Faltan variables de entorno')
  console.error('Necesitas NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listClients() {
  console.log('\n🔍 Consultando clientes en Supabase...\n')

  const { data: clients, error } = await supabase
    .from('clientes')
    .select('id, nombre, activo')
    .order('nombre', { ascending: true })

  if (error) {
    console.error('❌ Error consultando clientes:', error.message)
    process.exit(1)
  }

  if (!clients || clients.length === 0) {
    console.log('⚠️  No hay clientes registrados en la base de datos')
    console.log('\n💡 Necesitas crear al menos un cliente primero.')
    process.exit(0)
  }

  console.log(`✅ Se encontraron ${clients.length} clientes:\n`)
  console.log('─'.repeat(80))

  clients.forEach((client, index) => {
    console.log(`${index + 1}. ${client.nombre}`)
    console.log(`   ID: ${client.id}`)
    console.log(`   Activo: ${client.activo ? 'Sí' : 'No'}`)
    console.log('─'.repeat(80))
  })

  console.log('\n📋 IDs para copiar en Zapier:\n')
  clients.forEach(client => {
    console.log(`${client.nombre}: ${client.id}`)
  })

  console.log('\n✅ Consulta completada\n')
}

listClients().catch(error => {
  console.error('❌ Error inesperado:', error)
  process.exit(1)
})
