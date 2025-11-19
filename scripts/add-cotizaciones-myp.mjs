// AGREGAR COTIZACIONES PARA CLIENTE DEMO (usuario myp)
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

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('═══════════════════════════════════════════════════════════')
console.log('📝 AGREGANDO COTIZACIONES PARA CLIENTE DEMO (myp)')
console.log('═══════════════════════════════════════════════════════════\n')

// PASO 1: Obtener cliente_id de myp y algunos leads
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

// PASO 2: Obtener algunos leads de este cliente para asociar cotizaciones
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .eq('cliente_id', cliente_id)
  .limit(6)

console.log(`✅ Leads encontrados: ${leads?.length || 0}\n`)

// PASO 3: Crear cotizaciones
const cotizaciones = [
  {
    cliente_id,
    lead_id: leads?.[0]?.id || null,
    nombre_proyecto: 'Campaña Google Ads Q1 2025',
    cliente_nombre: leads?.[0]?.nombre || 'Cliente Principal',
    cliente_email: leads?.[0]?.email || '',
    subtotal: 3500000,
    descuento: 350000,
    total: 3150000,
    estado: 'aceptada',
    notas: 'Campaña trimestral con gestión completa',
    creado_en: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    aceptada_en: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id,
    lead_id: leads?.[1]?.id || null,
    nombre_proyecto: 'Gestión Redes Sociales Premium',
    cliente_nombre: leads?.[1]?.nombre || 'Cliente 2',
    cliente_email: leads?.[1]?.email || '',
    subtotal: 2800000,
    descuento: 0,
    total: 2800000,
    estado: 'aceptada',
    notas: 'Plan premium con contenido diario',
    creado_en: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    aceptada_en: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id,
    lead_id: leads?.[2]?.id || null,
    nombre_proyecto: 'Campaña Meta Ads + Google Ads',
    cliente_nombre: leads?.[2]?.nombre || 'Cliente 3',
    cliente_email: leads?.[2]?.email || '',
    subtotal: 4200000,
    descuento: 420000,
    total: 3780000,
    estado: 'aceptada',
    notas: 'Campaña integrada multi-canal',
    creado_en: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    aceptada_en: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id,
    lead_id: leads?.[3]?.id || null,
    nombre_proyecto: 'Estrategia Digital Completa',
    cliente_nombre: leads?.[3]?.nombre || 'Cliente 4',
    cliente_email: leads?.[3]?.email || '',
    subtotal: 3200000,
    descuento: 0,
    total: 3200000,
    estado: 'enviada',
    notas: 'Pendiente de respuesta del cliente',
    creado_en: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id,
    lead_id: leads?.[4]?.id || null,
    nombre_proyecto: 'Campaña SEO + SEM Inicial',
    cliente_nombre: leads?.[4]?.nombre || 'Cliente 5',
    cliente_email: leads?.[4]?.email || '',
    subtotal: 2500000,
    descuento: 250000,
    total: 2250000,
    estado: 'rechazada',
    notas: 'Cliente rechazó por presupuesto',
    creado_en: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id,
    lead_id: null,
    nombre_proyecto: 'Consultoría Marketing Digital',
    cliente_nombre: 'Prospecto Nuevo',
    cliente_email: 'prospecto@empresa.cl',
    subtotal: 1800000,
    descuento: 0,
    total: 1800000,
    estado: 'borrador',
    notas: 'Borrador en preparación',
    creado_en: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
]

let creadas = 0

for (const cot of cotizaciones) {
  const { data, error } = await supabase
    .from('cotizaciones')
    .insert(cot)
    .select()
    .single()

  if (error) {
    console.error(`❌ Error creando cotización:`, error.message)
  } else {
    creadas++
    console.log(`✅ Cotización creada: ${cot.nombre_proyecto} (${cot.estado})`)
  }
}

console.log(`\n═══════════════════════════════════════════════════════════`)
console.log(`📊 RESUMEN:`)
console.log(`   Cotizaciones creadas: ${creadas}/${cotizaciones.length}`)
console.log(`   - Aceptadas: 3 ($12,730,000 total)`)
console.log(`   - Enviadas: 1`)
console.log(`   - Rechazadas: 1`)
console.log(`   - Borradores: 1`)
console.log(`═══════════════════════════════════════════════════════════\n`)

process.exit(0)
