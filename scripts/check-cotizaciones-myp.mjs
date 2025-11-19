// VERIFICAR COTIZACIONES DE MYP
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
console.log('🔍 VERIFICANDO COTIZACIONES DE MYP')
console.log('═══════════════════════════════════════════════════════════\n')

// PASO 1: Obtener cliente_id de myp
const { data: usuario } = await supabase
  .from('usuarios')
  .select('cliente_id')
  .eq('username', 'myp')
  .single()

if (!usuario || !usuario.cliente_id) {
  console.error('❌ Usuario myp no tiene cliente_id asignado')
  process.exit(1)
}

const cliente_id = usuario.cliente_id
console.log(`✅ Cliente ID de myp: ${cliente_id}\n`)

// PASO 2: Verificar cotizaciones
const { data: cotizaciones, error } = await supabase
  .from('cotizaciones')
  .select('*')
  .eq('cliente_id', cliente_id)
  .order('creado_en', { ascending: false })

if (error) {
  console.error('❌ Error obteniendo cotizaciones:', error)
  process.exit(1)
}

console.log(`📊 COTIZACIONES ENCONTRADAS: ${cotizaciones?.length || 0}\n`)

if (cotizaciones && cotizaciones.length > 0) {
  cotizaciones.forEach((cot, idx) => {
    console.log(`${idx + 1}. ${cot.nombre_proyecto}`)
    console.log(`   Estado: ${cot.estado}`)
    console.log(`   Total: $${Number(cot.total).toLocaleString('es-CL')}`)
    console.log(`   Creada: ${new Date(cot.creado_en).toLocaleDateString('es-CL')}`)
    console.log(`   ID: ${cot.id}`)
    console.log('')
  })
}

console.log(`═══════════════════════════════════════════════════════════\n`)

process.exit(0)
