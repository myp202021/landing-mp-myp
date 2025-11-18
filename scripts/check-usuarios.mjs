// Script para verificar usuarios en Supabase
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Leer variables de entorno del archivo .env.local
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

async function checkUsuarios() {
  console.log('🔍 Verificando usuarios en Supabase...\n')

  try {
    // Obtener todos los usuarios
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('id, username, password_hash, nombre, rol, activo')
      .order('id', { ascending: true })

    if (error) {
      console.error('❌ Error obteniendo usuarios:', error.message)
      return
    }

    console.log('📋 Usuarios en la base de datos:\n')

    usuarios.forEach(u => {
      console.log(`👤 ID: ${u.id}`)
      console.log(`   Username: ${u.username}`)
      console.log(`   Nombre: ${u.nombre}`)
      console.log(`   Rol: ${u.rol}`)
      console.log(`   Password: ${u.password_hash}`)
      console.log(`   Activo: ${u.activo}`)
      console.log('')
    })

    console.log('\n🔐 Credenciales esperadas:')
    console.log('   admin:    "MYP@admin2025!"')
    console.log('   myp:      "mypcliente2025"')
    console.log('   cliente1: "Cliente@2025!"')
    console.log('')

    // Verificar cada usuario
    console.log('✅ Verificación:')
    const admin = usuarios.find(u => u.username === 'admin')
    const myp = usuarios.find(u => u.username === 'myp')
    const cliente1 = usuarios.find(u => u.username === 'cliente1')

    if (admin) {
      const match = admin.password_hash === 'MYP@admin2025!'
      console.log(`   admin: ${match ? '✅ OK' : '❌ INCORRECTO'} (DB: "${admin.password_hash}")`)
    } else {
      console.log('   admin: ❌ NO EXISTE')
    }

    if (myp) {
      const match = myp.password_hash === 'mypcliente2025'
      console.log(`   myp: ${match ? '✅ OK' : '❌ INCORRECTO'} (DB: "${myp.password_hash}")`)
    } else {
      console.log('   myp: ❌ NO EXISTE')
    }

    if (cliente1) {
      const match = cliente1.password_hash === 'Cliente@2025!'
      console.log(`   cliente1: ${match ? '✅ OK' : '❌ INCORRECTO'} (DB: "${cliente1.password_hash}")`)
    } else {
      console.log('   cliente1: ❌ NO EXISTE')
    }

  } catch (error) {
    console.error('\n❌ Error general:', error.message)
  }
}

checkUsuarios()
