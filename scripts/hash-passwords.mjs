// Script para hashear contraseñas con bcrypt y actualizar en Supabase
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
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

async function hashAndUpdatePasswords() {
  console.log('🔐 Hasheando contraseñas con bcrypt...\n')

  const users = [
    { username: 'admin', password: 'MYP@admin2025!' },
    { username: 'myp', password: 'mypcliente2025' },
    { username: 'cliente1', password: 'Cliente@2025!' }
  ]

  for (const user of users) {
    console.log(`\n📝 Procesando usuario: ${user.username}`)
    console.log(`   Contraseña: ${user.password}`)

    // Hashear con bcrypt (salt rounds = 10)
    const hash = await bcrypt.hash(user.password, 10)
    console.log(`   Hash: ${hash.substring(0, 30)}...`)

    // Actualizar en la base de datos
    const { error } = await supabase
      .from('usuarios')
      .update({ password_hash: hash })
      .eq('username', user.username)

    if (error) {
      console.error(`   ❌ Error: ${error.message}`)
    } else {
      console.log(`   ✅ Actualizado en DB`)
    }
  }

  console.log('\n\n✅ ¡Proceso completado!')
  console.log('\n🔐 Contraseñas hasheadas y actualizadas:')
  console.log('   admin:    "MYP@admin2025!"')
  console.log('   myp:      "mypcliente2025"')
  console.log('   cliente1: "Cliente@2025!"')
}

hashAndUpdatePasswords()
