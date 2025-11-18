// Script para arreglar usuarios en Supabase
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixUsuarios() {
  console.log('🔧 Arreglando usuarios en Supabase...\n')

  try {
    // 1. Actualizar admin
    console.log('1️⃣ Actualizando usuario admin...')
    const { error: adminError } = await supabase
      .from('usuarios')
      .upsert({
        username: 'admin',
        password_hash: 'MYP@admin2025!',
        nombre: 'Administrador MYP',
        rol: 'admin',
        cliente_id: null,
        activo: true
      }, {
        onConflict: 'username'
      })

    if (adminError) {
      console.error('❌ Error actualizando admin:', adminError.message)
    } else {
      console.log('✅ Admin actualizado correctamente')
    }

    // 2. Insertar/actualizar usuario M&P
    console.log('\n2️⃣ Actualizando usuario M&P...')
    const { error: mypError } = await supabase
      .from('usuarios')
      .upsert({
        username: 'myp',
        password_hash: 'mypcliente2025',
        nombre: 'M&P Marketing y Performance',
        rol: 'cliente',
        cliente_id: null,
        activo: true
      }, {
        onConflict: 'username'
      })

    if (mypError) {
      console.error('❌ Error actualizando M&P:', mypError.message)
    } else {
      console.log('✅ M&P actualizado correctamente')
    }

    // 3. Insertar/actualizar cliente1 (demo)
    console.log('\n3️⃣ Actualizando usuario cliente1...')
    const { error: cliente1Error } = await supabase
      .from('usuarios')
      .upsert({
        username: 'cliente1',
        password_hash: 'Cliente@2025!',
        nombre: 'Cliente Demo',
        rol: 'cliente',
        cliente_id: null,
        activo: true
      }, {
        onConflict: 'username'
      })

    if (cliente1Error) {
      console.error('❌ Error actualizando cliente1:', cliente1Error.message)
    } else {
      console.log('✅ Cliente1 actualizado correctamente')
    }

    // 4. Verificar usuarios
    console.log('\n4️⃣ Verificando usuarios en la base de datos...')
    const { data: usuarios, error: listError } = await supabase
      .from('usuarios')
      .select('id, username, nombre, rol, activo')
      .order('id', { ascending: true })

    if (listError) {
      console.error('❌ Error listando usuarios:', listError.message)
    } else {
      console.log('\n📋 Usuarios en la base de datos:')
      console.table(usuarios)
    }

    console.log('\n✅ ¡Proceso completado!')
    console.log('\n🔐 Credenciales actualizadas:')
    console.log('  Admin:    usuario "admin"    | contraseña "MYP@admin2025!"')
    console.log('  M&P:      usuario "myp"      | contraseña "mypcliente2025"')
    console.log('  Cliente1: usuario "cliente1" | contraseña "Cliente@2025!"')

  } catch (error: any) {
    console.error('\n❌ Error general:', error.message)
    process.exit(1)
  }
}

fixUsuarios()
