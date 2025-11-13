/**
 * ANÁLISIS SIMPLE DE DUPLICADOS
 * Script simplificado para analizar duplicados en CRM
 *
 * Uso: node scripts/analizar-duplicados-simple.js
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Leer .env.local manualmente
function loadEnv(filename) {
  try {
    const envPath = path.join(__dirname, '..', filename)
    const envFile = fs.readFileSync(envPath, 'utf8')
    const env = {}
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)/)
      if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        env[key] = value
      }
    })
    return env
  } catch (err) {
    return {}
  }
}

const env = loadEnv('.env.local')

console.log('🔍 ANÁLISIS SIMPLE DE DUPLICADOS EN CRM\n')
console.log('='.repeat(60))
console.log('Conectando a:', env.NEXT_PUBLIC_SUPABASE_URL)
console.log('='.repeat(60))

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function main() {
  try {
    // 1. OBTENER TODOS LOS LEADS
    console.log('\n📊 Cargando leads...\n')

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('fecha_ingreso', { ascending: false })

    if (error) {
      console.error('Error cargando leads:', error)
      return
    }

    console.log(`Total leads en DB: ${leads.length}\n`)

    // 2. ANALIZAR DUPLICADOS POR EMAIL
    console.log('='.repeat(60))
    console.log('\n📧 DUPLICADOS POR EMAIL\n')

    const emailMap = {}
    leads.forEach(lead => {
      if (lead.email && lead.email.trim() !== '') {
        const key = `${lead.cliente_id}|${lead.email.toLowerCase().trim()}`
        if (!emailMap[key]) {
          emailMap[key] = []
        }
        emailMap[key].push(lead)
      }
    })

    const emailDuplicates = Object.entries(emailMap)
      .filter(([_, leads]) => leads.length > 1)
      .sort((a, b) => b[1].length - a[1].length)

    console.log(`Grupos con email duplicado: ${emailDuplicates.length}`)
    console.log(`Total leads duplicados por email: ${emailDuplicates.reduce((sum, [_, leads]) => sum + leads.length, 0)}\n`)

    emailDuplicates.slice(0, 10).forEach(([key, dupes]) => {
      const [_, email] = key.split('|')
      console.log(`📧 ${email} (${dupes.length} duplicados)`)
      dupes.forEach((lead, i) => {
        const fecha = new Date(lead.fecha_ingreso).toLocaleDateString('es-CL')
        console.log(`   ${i+1}. ID: ${lead.id} | ${lead.nombre} ${lead.apellido || ''} | ${fecha}`)
      })
      console.log('')
    })

    if (emailDuplicates.length > 10) {
      console.log(`... y ${emailDuplicates.length - 10} grupos más\n`)
    }

    // 3. ANALIZAR DUPLICADOS POR TELÉFONO
    console.log('='.repeat(60))
    console.log('\n📱 DUPLICADOS POR TELÉFONO\n')

    const telMap = {}
    leads.forEach(lead => {
      if (lead.telefono && lead.telefono.trim() !== '') {
        // Normalizar teléfono (solo números)
        const normalizedTel = lead.telefono.replace(/[^0-9+]/g, '')
        const key = `${lead.cliente_id}|${normalizedTel}`
        if (!telMap[key]) {
          telMap[key] = []
        }
        telMap[key].push(lead)
      }
    })

    const telDuplicates = Object.entries(telMap)
      .filter(([_, leads]) => leads.length > 1)
      .sort((a, b) => b[1].length - a[1].length)

    console.log(`Grupos con teléfono duplicado: ${telDuplicates.length}`)
    console.log(`Total leads duplicados por teléfono: ${telDuplicates.reduce((sum, [_, leads]) => sum + leads.length, 0)}\n`)

    telDuplicates.slice(0, 10).forEach(([key, dupes]) => {
      const [_, tel] = key.split('|')
      console.log(`📱 ${dupes[0].telefono} (${dupes.length} duplicados)`)
      dupes.forEach((lead, i) => {
        const fecha = new Date(lead.fecha_ingreso).toLocaleDateString('es-CL')
        console.log(`   ${i+1}. ID: ${lead.id} | ${lead.nombre} ${lead.apellido || ''} | ${fecha}`)
      })
      console.log('')
    })

    if (telDuplicates.length > 10) {
      console.log(`... y ${telDuplicates.length - 10} grupos más\n`)
    }

    // 4. ESTADÍSTICAS POR CLIENTE
    console.log('='.repeat(60))
    console.log('\n👥 ESTADÍSTICAS POR CLIENTE\n')

    const { data: clientes } = await supabase
      .from('clientes')
      .select('id, nombre')
      .eq('activo', true)

    clientes?.forEach(cliente => {
      const clienteLeads = leads.filter(l => l.cliente_id === cliente.id)

      const clienteEmailDups = Object.values(emailMap)
        .filter(dupes => dupes.length > 1 && dupes[0].cliente_id === cliente.id)

      const clienteTelDups = Object.values(telMap)
        .filter(dupes => dupes.length > 1 && dupes[0].cliente_id === cliente.id)

      console.log(`${cliente.nombre}:`)
      console.log(`  Total Leads: ${clienteLeads.length}`)
      console.log(`  Grupos Email Duplicados: ${clienteEmailDups.length}`)
      console.log(`  Grupos Tel Duplicados: ${clienteTelDups.length}`)
      console.log('')
    })

    // 5. RESUMEN GENERAL
    console.log('='.repeat(60))
    console.log('\n📈 RESUMEN GENERAL\n')

    const sinEmail = leads.filter(l => !l.email || l.email.trim() === '').length
    const sinTel = leads.filter(l => !l.telefono || l.telefono.trim() === '').length
    const sinContacto = leads.filter(l => (!l.email || l.email.trim() === '') && (!l.telefono || l.telefono.trim() === '')).length

    console.log(`Total Leads: ${leads.length}`)
    console.log(`Grupos con Email Duplicado: ${emailDuplicates.length}`)
    console.log(`Grupos con Tel Duplicado: ${telDuplicates.length}`)
    console.log(`Leads sin Email: ${sinEmail}`)
    console.log(`Leads sin Teléfono: ${sinTel}`)
    console.log(`Leads sin Email ni Teléfono: ${sinContacto}`)

    console.log('\n' + '='.repeat(60))
    console.log('\n✅ Análisis completado\n')

  } catch (error) {
    console.error('\n❌ Error ejecutando análisis:', error.message)
    process.exit(1)
  }
}

main()
