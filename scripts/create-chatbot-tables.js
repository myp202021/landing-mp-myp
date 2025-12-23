#!/usr/bin/env node

/**
 * Script para crear las tablas del ChatBot en Supabase
 * Ejecutar con: node scripts/create-chatbot-tables.js
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://faitwrutauavjwnsnlzq.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY3NDcxNywiZXhwIjoyMDc3MjUwNzE3fQ.19K4-XCB-M6foGQ1b3yHXWUR9nyLR1R1dqHYVefGfx8'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkTable(tableName) {
  const { error } = await supabase.from(tableName).select('id').limit(1)
  return error?.code !== 'PGRST205'
}

async function main() {
  console.log('🔍 Verificando tablas del ChatBot en Supabase...\n')

  const tables = [
    'chat_sessions',
    'chat_messages',
    'chat_analytics_daily',
    'chat_unhandled_questions'
  ]

  const results = {}

  for (const table of tables) {
    const exists = await checkTable(table)
    results[table] = exists ? '✅ Existe' : '❌ No existe'
    console.log(`  ${table}: ${results[table]}`)
  }

  const allExist = Object.values(results).every(r => r.includes('✅'))

  console.log('\n' + '─'.repeat(50))

  if (allExist) {
    console.log('✅ Todas las tablas del ChatBot están creadas!')
    console.log('   El sistema está listo para usar.\n')
  } else {
    console.log('⚠️  Algunas tablas no existen.')
    console.log('\n📋 Para crearlas, sigue estos pasos:\n')
    console.log('   1. Ve a https://supabase.com/dashboard')
    console.log('   2. Selecciona el proyecto: faitwrutauavjwnsnlzq')
    console.log('   3. Ve a "SQL Editor" en el menú lateral')
    console.log('   4. Copia y pega el contenido de: supabase/chatbot-schema.sql')
    console.log('   5. Haz clic en "Run"\n')
    console.log('─'.repeat(50))
    console.log('📁 Archivo SQL: supabase/chatbot-schema.sql\n')
  }
}

main().catch(console.error)
