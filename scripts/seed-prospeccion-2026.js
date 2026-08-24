// Seed script for prospeccion_2026 table
// Usage: node scripts/seed-prospeccion-2026.js
// Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

const { createClient } = require('@supabase/supabase-js')
const { readFileSync } = require('fs')
const { resolve } = require('path')

// Load .env.local
const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim()
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

const empresas = [
  { empresa: 'Cynersis', website: 'cynersis.cl', industria: 'IT / Ciberseguridad', que_hacen: 'Integrador TI B2B: ITAM, Zoom empresarial, automatizacion IA, 29 anos', email: 'info@cynersis.cl', score: 70 },
  { empresa: 'Tibox Chile', website: 'tibox.cl', industria: 'IT / Cloud', que_hacen: 'Soluciones TI, cloud, ciberseguridad y consultoria para empresas', email: 'contacto@tibox.cl', score: 65 },
  { empresa: 'TI Chile', website: 'tichile.cl', industria: 'IT / Ciberseguridad', que_hacen: 'Ciberseguridad e infraestructura TI, certificada ISO 27001', email: 'ventas@tichile.cl', score: 60 },
  { empresa: 'DataSoporte', website: 'datasoporte.cl', industria: 'IT / Outsourcing', que_hacen: 'Outsourcing TI y Microsoft Partner, soporte nivel 3 y cloud B2B', email: 'contacto@datasoporte.cl', score: 55 },
  { empresa: 'IONET', website: 'ionet.cl', industria: 'IT / Soporte TI', que_hacen: 'Soporte TI para empresas, +25 anos, Microsoft 365 y ciberseguridad', email: 'contacto@ionet.cl', score: 60 },
  { empresa: 'Alpha IT', website: 'alphait.cl', industria: 'IT / Outsourcing', que_hacen: 'Proveedor outsourcing tecnologico para empresas medianas y grandes', email: 'contacto@alphait.cl', score: 55 },
  { empresa: 'LISIT', website: 'lisit.cl', industria: 'IT / Consultoria digital', que_hacen: 'Consultoria TI y transformacion digital: SAP, comunicaciones', email: 'contacto@lisit.cl', score: 65 },
  { empresa: 'B2B Tech', website: 'b2btech.cl', industria: 'IT / Seguridad electronica', que_hacen: 'Seguridad electronica, integracion audiovisual, redes y TI', email: 'contacto@b2btech.cl', score: 50 },
  { empresa: 'Defontana', website: 'defontana.com/cl', industria: 'Software / ERP', que_hacen: 'ERP y CRM 100% cloud para pymes y grandes empresas LATAM', email: 'contacto@defontana.com', score: 80 },
  { empresa: 'Softland Chile', website: 'softland.cl', industria: 'Software / ERP', que_hacen: 'ERP, CRM y RRHH para +35.000 empresas en Latinoamerica', email: 'contacto@softland.cl', score: 85 },
  { empresa: 'Qbiz', website: 'qbiz.cl', industria: 'Software / ERP', que_hacen: 'ERP, workflow y BPM a medida para gestion empresarial', email: 'contacto@qbiz.cl', score: 60 },
  { empresa: 'Cromatic', website: 'cromatic.cl', industria: 'Software / CRM', que_hacen: 'Implementacion Zoho y PipeDrive CRM para empresas', email: 'contacto@cromatic.cl', score: 65 },
  { empresa: 'YouHR', website: 'youhr.cl', industria: 'Consultoria RR.HH.', que_hacen: 'Consultoria gestion de personas para pymes sin area RRHH', email: 'info@youhr.cl', score: 55 },
  { empresa: 'Red Recursos Humanos', website: 'redrrhh.cl', industria: 'Consultoria RR.HH.', que_hacen: 'Outsourcing personas, remuneraciones y seleccion, +17 anos', email: 'contacto@redrrhh.cl', score: 60 },
  { empresa: 'Tomic Consultores', website: 'tomicconsultores.cl', industria: 'Consultoria RR.HH.', que_hacen: 'Seleccion de personal, coaching ejecutivo, Las Condes', email: 'contacto@tomicconsultores.cl', score: 55 },
  { empresa: 'Thompson Consulting', website: 'thompsonconsulting.cl', industria: 'Consultoria RR.HH.', que_hacen: 'Reclutamiento y seleccion para +80 empresas activas', email: 'contacto@thompsonconsulting.cl', score: 60 },
  { empresa: 'SOS Group', website: 'sosgroup.cl', industria: 'Consultoria RR.HH.', que_hacen: 'Seleccion, outsourcing y servicios transitorios, +10K candidatos/ano', email: 'contacto@sosgroup.cl', score: 65 },
  { empresa: 'Activos Chile', website: 'activoschile.cl', industria: 'Consultoria RR.HH.', que_hacen: 'Outsourcing personal, remuneraciones y seleccion, +20 anos', email: 'hola@activoschile.cl', score: 55 },
  { empresa: 'Luppa', website: 'somosluppa.cl', industria: 'Consultoria RR.HH.', que_hacen: 'Consultora boutique de hunting, seleccion y desarrollo organizacional', email: 'contacto@somosluppa.cl', score: 50 },
  { empresa: 'CONSAT', website: 'consat.cl', industria: 'Consultoria Legal/Contable', que_hacen: 'Auditoria, contabilidad, asesoria legal, miembro red INPACT global', email: 'contacto@consat.cl', score: 60 },
  { empresa: 'BBSC Consulting', website: 'bbsc.cl', industria: 'Consultoria Tributaria', que_hacen: 'Asesoria tributaria y contable para empresas desde 1993', email: 'contacto@bbsc.cl', score: 55 },
  { empresa: 'MAS Consultores', website: 'masconsultores.cl', industria: 'Consultoria / Capacitacion', que_hacen: 'Formacion corporativa con ROI medible, +30 anos', email: 'info@masconsultores.cl', score: 60 },
  { empresa: 'Upskill', website: 'upskill.cl', industria: 'Capacitacion Corporativa', que_hacen: 'Capacitacion corporativa, metodologias innovadoras, Las Condes', email: 'hola@upskill.cl', score: 55 },
  { empresa: 'Celeris', website: 'celeris.cl', industria: 'Capacitacion / e-learning', que_hacen: 'e-learning corporativo, 20 anos de experiencia', email: 'paulina.silva@celeris.cl', score: 60 },
  { empresa: 'Akadem', website: 'akadem.cl', industria: 'Capacitacion / EdTech B2B', que_hacen: 'OTEC EdTech B2B, plataforma Moodle, compliance', email: 'contacto@akadem.cl', score: 55 },
  { empresa: 'Tecnipro', website: 'tecnipro.cl', industria: 'Capacitacion / OTEC', que_hacen: 'OTEC 15 anos, formacion corporativa Excel, Power BI, IFRS', email: 'contacto@tecnipro.cl', score: 50 },
  { empresa: 'Progreso', website: 'progreso.cl', industria: 'Financiero / Factoring', que_hacen: 'Factoring y leasing para pymes, +33 anos, presencia nacional', email: 'contactenos@progreso.cl', score: 70 },
  { empresa: 'ECR Servicios Financieros', website: 'ecrserviciosfinancieros.cl', industria: 'Financiero / Factoring', que_hacen: 'Factoring y leasing para pymes, +25 anos', email: 'flex@ecrserviciosfinancieros.cl', score: 60 },
  { empresa: 'Capital Express', website: 'capitalexpress.cl', industria: 'Financiero / Factoring', que_hacen: 'Factoring online para pymes con ventas B2B', email: 'ventas@capitalexpress.cl', score: 55 },
  { empresa: 'VMC Servicios Financieros', website: 'vmcserviciosfinancieros.cl', industria: 'Financiero / Factoring', que_hacen: 'Intermediacion factoring y leasing, Las Condes', email: 'info@vmcserviciosfinancieros.cl', score: 55 },
  { empresa: 'Factoring Security', website: 'factoringsecurity.cl', industria: 'Financiero / Factoring', que_hacen: 'Factoring para empresas, presencia nacional', email: 'contacto@factoringsecurity.cl', score: 65 },
  { empresa: 'EFA', website: 'efa.cl', industria: 'Financiero / Multi-producto', que_hacen: 'Factoring nacional e internacional, confirming, leasing', email: 'contacto@efa.cl', score: 60 },
  { empresa: 'Loginsa', website: 'loginsa.com', industria: 'Logistica / Almacenamiento', que_hacen: 'Operador logistico +25 anos: retail, industrial, farma, e-commerce', email: 'info@loginsa.com', score: 70 },
  { empresa: 'Logistics Chile', website: 'logisticschile.cl', industria: 'Logistica / Bodegas', que_hacen: 'Almacenamiento y logistica en Santiago', email: 'contacto@logisticschile.cl', score: 55 },
  { empresa: 'Transportes Medalla', website: 'transportesmedalla.cl', industria: 'Logistica / Transporte', que_hacen: 'Transporte carga con bodegas en Iquique, Antofagasta y Santiago', email: 'contacto@transportesmedalla.cl', score: 55 },
  { empresa: 'Procomex', website: 'procomex.cl', industria: 'Industrial / Importacion', que_hacen: 'Importacion repuestos maquinaria pesada e industrial, +20 anos', email: 'info@procomex.cl', score: 60 },
  { empresa: 'Janssen Chile', website: 'janssen.cl', industria: 'Industrial / Maquinaria', que_hacen: 'Venta y arriendo equipos construccion, mineria, forestal, +70 anos', email: 'info@janssen.cl', score: 65 },
  { empresa: 'CyD Ingenieria', website: 'cydingenieria.com', industria: 'Ingenieria / Construccion', que_hacen: 'Proyectos construccion e infraestructura, +2.200 profesionales', email: 'contacto@cydingenieria.com', score: 75 },
  { empresa: 'Diligence', website: 'diligence.cl', industria: 'Inmobiliaria Comercial', que_hacen: 'Arriendo y venta oficinas comerciales, +20 anos', email: 'contacto@diligence.cl', score: 60 },
  { empresa: 'B2B Propiedades', website: 'b2bpropiedades.cl', industria: 'Inmobiliaria Comercial', que_hacen: 'Plataforma corretaje B2B propiedades comerciales', email: 'contacto@b2bpropiedades.cl', score: 55 },
  { empresa: 'Nativa Bienes Raices', website: 'nativabienesraices.cl', industria: 'Inmobiliaria / Terrenos', que_hacen: 'Comercializacion panos y terrenos para proyectos inmobiliarios', email: 'contacto@nativabienesraices.cl', score: 55 },
  { empresa: 'Instituto Salud Ocupacional', website: 'iocupacional.cl', industria: 'Salud / Ocupacional', que_hacen: 'Examenes preocupacionales y ocupacionales para empresas', email: 'msanchez@iocupacional.cl', score: 60 },
  { empresa: 'CESO', website: 'ceso.cl', industria: 'Salud / Ocupacional', que_hacen: 'Salud ocupacional, ergonomia y medicina laboral', email: 'santiago@ceso.cl', score: 55 },
  { empresa: 'Pulso Salud', website: 'pulsosalud.com/cl', industria: 'Salud / Ocupacional', que_hacen: 'Servicios integrales salud ocupacional y prevencion', email: 'contacto.chile@pulsosalud.com', score: 60 },
  { empresa: 'Blanco Salud Ocupacional', website: 'ocupacional.blancosalud.cl', industria: 'Salud / Ocupacional', que_hacen: 'Salud ocupacional para empresas, Providencia', email: 'contacto@blancosalud.cl', score: 55 },
  { empresa: 'ICARE', website: 'icare.cl', industria: 'Capacitacion / Ejecutivos', que_hacen: 'Programas ejecutivos para lideres empresariales', email: 'capacitaciones@icare.cl', score: 70 },
  { empresa: 'GTC Capacitacion', website: 'gtc-capacitacion.cl', industria: 'Capacitacion OTEC', que_hacen: 'Capacitacion para empresas, +13 anos', email: 'contacto@gtc-capacitacion.cl', score: 50 },
  { empresa: 'CIDES', website: 'cides.com', industria: 'Capacitacion Profesional', que_hacen: 'Cursos y capacitacion profesional para empresas', email: 'contacto@cides.com', score: 50 },
  { empresa: 'Concredex', website: 'concredex.cl', industria: 'Inmobiliaria / Corretaje', que_hacen: 'Agencia inmobiliaria en +35 portales de Arica a Punta Arenas', email: 'contacto@concredex.cl', score: 55 },
  { empresa: 'BS Chile Consultores', website: 'bschileconsultores.cl', industria: 'Consultoria Contable', que_hacen: 'Contabilidad, remuneraciones, asesoria legal para pymes', email: 'contacto@bschileconsultores.cl', score: 55 },
]

async function main() {
  console.log(`Seeding ${empresas.length} empresas into prospeccion_2026...`)

  // Create table if not exists (via RPC or raw SQL)
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS prospeccion_2026 (
      id serial PRIMARY KEY,
      empresa text NOT NULL,
      website text,
      industria text,
      que_hacen text,
      email text,
      ciudad text DEFAULT 'Santiago',
      score integer DEFAULT 0,
      estado text DEFAULT 'nueva',
      notas text,
      batch text,
      creado_en timestamptz DEFAULT now()
    );
  `

  // Try to create the table via rpc
  const { error: sqlError } = await supabase.rpc('exec_sql', { query: createTableSQL })
  if (sqlError) {
    console.log('Note: Could not auto-create table (run the SQL manually in Supabase dashboard if needed):', sqlError.message)
    console.log('\nSQL to run manually:')
    console.log(createTableSQL)
  } else {
    console.log('Table prospeccion_2026 created or already exists.')
  }

  // Insert empresas in batch
  const toInsert = empresas.map(e => ({
    ...e,
    ciudad: 'Santiago',
    estado: 'nueva',
    batch: 'seed-2026-08-20',
  }))

  const { data, error } = await supabase
    .from('prospeccion_2026')
    .insert(toInsert)
    .select('id, empresa')

  if (error) {
    console.error('Error inserting:', error.message)
    process.exit(1)
  }

  console.log(`Inserted ${data.length} empresas successfully.`)
  console.log('Done!')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
