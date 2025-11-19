// SETUP DE DATOS DE PRUEBA PARA CLIENTE TEST
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
console.log('🔧 SETUP DE DATOS PARA CLIENTE TEST')
console.log('═══════════════════════════════════════════════════════════\n')

// PASO 1: Verificar usuario cliente1
console.log('📝 PASO 1: Verificando usuario cliente1...\n')

const { data: usuario, error: errorUsuario } = await supabase
  .from('usuarios')
  .select('*')
  .eq('username', 'cliente1')
  .single()

if (errorUsuario || !usuario) {
  console.error('❌ Usuario cliente1 no existe')
  process.exit(1)
}

console.log(`   Usuario: ${usuario.username}`)
console.log(`   Rol: ${usuario.rol}`)
console.log(`   Cliente ID actual: ${usuario.cliente_id || 'NULL'}`)

// PASO 2: Buscar o crear cliente "Cliente Test"
console.log('\n📝 PASO 2: Verificando cliente "Cliente Test"...\n')

let clienteTest
const { data: clienteExistente } = await supabase
  .from('clientes')
  .select('*')
  .eq('nombre', 'Cliente Test')
  .single()

if (clienteExistente) {
  clienteTest = clienteExistente
  console.log(`   ✅ Cliente Test ya existe`)
  console.log(`   ID: ${clienteTest.id}`)
  console.log(`   Nombre: ${clienteTest.nombre}`)
} else {
  console.log('   Cliente Test no existe, creando...')
  const { data: nuevoCliente, error: errorCliente } = await supabase
    .from('clientes')
    .insert({
      nombre: 'Cliente Test',
      rubro: 'Servicios Profesionales',
      activo: true,
      inversion_mensual: 500000
    })
    .select()
    .single()

  if (errorCliente) {
    console.error('❌ Error creando cliente:', errorCliente)
    process.exit(1)
  }

  clienteTest = nuevoCliente
  console.log(`   ✅ Cliente Test creado`)
  console.log(`   ID: ${clienteTest.id}`)
}

// PASO 3: Asignar cliente_id al usuario cliente1
if (!usuario.cliente_id || usuario.cliente_id !== clienteTest.id) {
  console.log('\n📝 PASO 3: Asignando cliente_id a usuario cliente1...\n')

  const { error: errorUpdate } = await supabase
    .from('usuarios')
    .update({ cliente_id: clienteTest.id })
    .eq('username', 'cliente1')

  if (errorUpdate) {
    console.error('❌ Error actualizando usuario:', errorUpdate)
    process.exit(1)
  }

  console.log(`   ✅ cliente_id asignado: ${clienteTest.id}`)
} else {
  console.log('\n📝 PASO 3: Usuario cliente1 ya tiene cliente_id correcto ✅\n')
}

// PASO 4: Crear leads de prueba
console.log('\n📝 PASO 4: Creando leads de prueba...\n')

const leadsSimulados = [
  // Leads de Email
  {
    cliente_id: clienteTest.id,
    nombre: 'Juan Pérez',
    email: 'juan.perez@empresa.cl',
    telefono: '+56912345678',
    empresa: 'Empresa ABC Ltda',
    fuente: 'email',
    contactado: true,
    vendido: true,
    monto_vendido: 2500000,
    fecha_ingreso: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    observaciones: 'Cliente muy interesado en servicios de marketing digital'
  },
  {
    cliente_id: clienteTest.id,
    nombre: 'María González',
    email: 'maria.gonzalez@startup.cl',
    telefono: '+56987654321',
    fuente: 'email',
    contactado: true,
    vendido: false,
    razon_no_venta: 'Presupuesto limitado por ahora',
    fecha_ingreso: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    observaciones: 'Solicita cotización para campaña Google Ads'
  },
  {
    cliente_id: clienteTest.id,
    nombre: 'Carlos Rodríguez',
    email: 'carlos@pyme.cl',
    fuente: 'email',
    contactado: false,
    vendido: false,
    fecha_ingreso: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    observaciones: 'Lead nuevo, pendiente de contacto'
  },

  // Leads de WhatsApp
  {
    cliente_id: clienteTest.id,
    nombre: 'Ana Martínez',
    telefono: '+56911111111',
    fuente: 'whatsapp',
    contactado: true,
    vendido: true,
    monto_vendido: 1800000,
    fecha_ingreso: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    observaciones: 'Contacto por WhatsApp, muy interesada en redes sociales'
  },
  {
    cliente_id: clienteTest.id,
    nombre: 'Pedro Silva',
    telefono: '+56922222222',
    email: 'pedro.silva@comercio.cl',
    fuente: 'whatsapp',
    contactado: true,
    vendido: false,
    fecha_ingreso: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    observaciones: 'Preguntó por servicios SEO'
  },
  {
    cliente_id: clienteTest.id,
    nombre: 'Laura Soto',
    telefono: '+56933333333',
    fuente: 'whatsapp',
    contactado: false,
    vendido: false,
    fecha_ingreso: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },

  // Leads de Meta (Facebook/Instagram)
  {
    cliente_id: clienteTest.id,
    nombre: 'Roberto Vargas',
    email: 'roberto.vargas@tienda.cl',
    telefono: '+56944444444',
    empresa: 'Tienda Online XYZ',
    fuente: 'meta',
    campana_nombre: 'Campaña Instagram - Servicios',
    ad_nombre: 'Ad Carousel Servicios',
    contactado: true,
    vendido: true,
    monto_vendido: 3200000,
    fecha_ingreso: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    observaciones: 'Lead calificado desde Instagram Ads'
  },
  {
    cliente_id: clienteTest.id,
    nombre: 'Valentina Rojas',
    email: 'valentina@emprendimiento.cl',
    fuente: 'meta',
    campana_nombre: 'Campaña Facebook - Leads',
    ad_nombre: 'Video Ad Principal',
    contactado: true,
    vendido: false,
    fecha_ingreso: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    observaciones: 'Interesada en gestión de redes sociales'
  },
  {
    cliente_id: clienteTest.id,
    nombre: 'Diego Torres',
    email: 'diego.torres@negocio.cl',
    telefono: '+56955555555',
    fuente: 'meta',
    campana_nombre: 'Campaña Facebook - Conversiones',
    contactado: false,
    vendido: false,
    fecha_ingreso: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },

  // Leads de Zapier
  {
    cliente_id: clienteTest.id,
    nombre: 'Sofía Fernández',
    email: 'sofia@consultora.cl',
    telefono: '+56966666666',
    empresa: 'Consultora Estratégica',
    fuente: 'zapier',
    form_nombre: 'Formulario Contacto Web',
    contactado: true,
    vendido: true,
    monto_vendido: 2800000,
    fecha_ingreso: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    observaciones: 'Lead automático desde formulario web'
  },
  {
    cliente_id: clienteTest.id,
    nombre: 'Andrés Muñoz',
    email: 'andres.munoz@industria.cl',
    fuente: 'zapier',
    form_nombre: 'Formulario Landing Page',
    contactado: true,
    vendido: false,
    razon_no_venta: 'Ya contrató otro proveedor',
    fecha_ingreso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id: clienteTest.id,
    nombre: 'Camila Castro',
    email: 'camila@ecommerce.cl',
    telefono: '+56977777777',
    fuente: 'zapier',
    contactado: false,
    vendido: false,
    fecha_ingreso: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString()
  }
]

let leadsCreados = 0
const leadIds = []

for (const lead of leadsSimulados) {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single()

  if (error) {
    console.error(`   ❌ Error creando lead ${lead.nombre}:`, error.message)
  } else {
    leadsCreados++
    leadIds.push(data.id)
    console.log(`   ✅ Lead creado: ${lead.nombre} (${lead.fuente})`)
  }
}

console.log(`\n   Total leads creados: ${leadsCreados}/${leadsSimulados.length}`)

// PASO 5: Crear cotizaciones de prueba
console.log('\n📝 PASO 5: Creando cotizaciones de prueba...\n')

const cotizacionesSimuladas = [
  {
    cliente_id: clienteTest.id,
    lead_id: leadIds[0], // Juan Pérez
    nombre_proyecto: 'Campaña Google Ads - Empresa ABC',
    cliente_nombre: 'Juan Pérez',
    cliente_email: 'juan.perez@empresa.cl',
    subtotal: 2500000,
    descuento: 0,
    total: 2500000,
    estado: 'aceptada',
    notas: 'Campaña de 3 meses con gestión completa',
    creado_en: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    aceptada_en: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id: clienteTest.id,
    lead_id: leadIds[1], // María González
    nombre_proyecto: 'Campaña Inicial Google Ads',
    cliente_nombre: 'María González',
    cliente_email: 'maria.gonzalez@startup.cl',
    subtotal: 1500000,
    descuento: 150000,
    total: 1350000,
    estado: 'rechazada',
    notas: 'Cliente rechazó por presupuesto',
    creado_en: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id: clienteTest.id,
    lead_id: leadIds[3], // Ana Martínez
    nombre_proyecto: 'Gestión Redes Sociales - 6 meses',
    cliente_nombre: 'Ana Martínez',
    cliente_email: '',
    subtotal: 1800000,
    descuento: 0,
    total: 1800000,
    estado: 'aceptada',
    notas: 'Incluye Instagram, Facebook y LinkedIn',
    creado_en: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    aceptada_en: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id: clienteTest.id,
    lead_id: leadIds[6], // Roberto Vargas
    nombre_proyecto: 'Campaña Meta Ads + Google Ads',
    cliente_nombre: 'Roberto Vargas',
    cliente_email: 'roberto.vargas@tienda.cl',
    subtotal: 3500000,
    descuento: 300000,
    total: 3200000,
    estado: 'aceptada',
    notas: 'Campaña integrada multi-canal',
    creado_en: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    aceptada_en: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    cliente_id: clienteTest.id,
    lead_id: leadIds[9], // Sofía Fernández
    nombre_proyecto: 'Estrategia Digital Completa',
    cliente_nombre: 'Sofía Fernández',
    cliente_email: 'sofia@consultora.cl',
    subtotal: 2800000,
    descuento: 0,
    total: 2800000,
    estado: 'enviada',
    notas: 'Pendiente de respuesta del cliente',
    creado_en: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    enviada_en: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
]

let cotizacionesCreadas = 0

for (const cotizacion of cotizacionesSimuladas) {
  const { data, error } = await supabase
    .from('cotizaciones')
    .insert(cotizacion)
    .select()
    .single()

  if (error) {
    console.error(`   ❌ Error creando cotización:`, error.message)
  } else {
    cotizacionesCreadas++
    console.log(`   ✅ Cotización creada: ${cotizacion.nombre_proyecto} (${cotizacion.estado})`)
  }
}

console.log(`\n   Total cotizaciones creadas: ${cotizacionesCreadas}/${cotizacionesSimuladas.length}`)

// PASO 6: Crear historial de cambios
console.log('\n📝 PASO 6: Creando historial de cambios...\n')

const historialEntradas = [
  {
    lead_id: leadIds[0],
    usuario: 'Cliente Test',
    accion: 'crear',
    descripcion: 'Lead creado desde email',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    lead_id: leadIds[0],
    usuario: 'Cliente Test',
    accion: 'actualizar',
    descripcion: 'Cambios: contactado (No → Sí)',
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    lead_id: leadIds[0],
    usuario: 'Cliente Test',
    accion: 'actualizar',
    descripcion: 'Cambios: vendido (No → Sí), monto_vendido (0 → 2500000)',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    lead_id: leadIds[3],
    usuario: 'Cliente Test',
    accion: 'crear',
    descripcion: 'Lead creado desde whatsapp',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    lead_id: leadIds[3],
    usuario: 'Cliente Test',
    accion: 'actualizar',
    descripcion: 'Cambios: contactado (No → Sí)',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    lead_id: leadIds[3],
    usuario: 'Cliente Test',
    accion: 'actualizar',
    descripcion: 'Cambios: vendido (No → Sí), monto_vendido (0 → 1800000)',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
]

let historialCreado = 0

for (const entrada of historialEntradas) {
  const { error } = await supabase
    .from('lead_historial')
    .insert(entrada)

  if (error) {
    console.error(`   ❌ Error creando historial:`, error.message)
  } else {
    historialCreado++
    console.log(`   ✅ Historial creado: ${entrada.accion} - Lead ${entrada.lead_id}`)
  }
}

console.log(`\n   Total entradas de historial creadas: ${historialCreado}/${historialEntradas.length}`)

// RESUMEN FINAL
console.log('\n═══════════════════════════════════════════════════════════')
console.log('📊 RESUMEN FINAL')
console.log('═══════════════════════════════════════════════════════════\n')

console.log(`✅ Usuario: cliente1`)
console.log(`✅ Cliente ID asignado: ${clienteTest.id}`)
console.log(`✅ Leads creados: ${leadsCreados}`)
console.log(`   - Email: 3 leads`)
console.log(`   - WhatsApp: 3 leads`)
console.log(`   - Meta: 3 leads`)
console.log(`   - Zapier: 3 leads`)
console.log(`✅ Cotizaciones creadas: ${cotizacionesCreadas}`)
console.log(`   - Aceptadas: 3`)
console.log(`   - Enviadas: 1`)
console.log(`   - Rechazadas: 1`)
console.log(`✅ Entradas de historial: ${historialCreado}`)

console.log('\n═══════════════════════════════════════════════════════════')
console.log('🎉 ¡SETUP COMPLETADO!')
console.log('═══════════════════════════════════════════════════════════')
console.log('\nAhora puedes iniciar sesión con:')
console.log('   Usuario: cliente1')
console.log('   Contraseña: Cliente@2025!')
console.log('\n   URL: https://mulleryperez.cl/crm/login')
console.log('═══════════════════════════════════════════════════════════\n')

process.exit(0)
