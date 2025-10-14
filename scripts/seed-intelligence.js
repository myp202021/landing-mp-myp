/**
 * Script para cargar seed data en M&P Intelligence
 * Ejecutar con: NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/seed-intelligence.js
 */

const { createClient } = require('@supabase/supabase-js')

// Leer directamente del .env.local o usar variables de entorno
const fs = require('fs')
const path = require('path')

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Si no están en el ambiente, leer del .env.local
if (!supabaseUrl || !supabaseKey) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local')
    const envFile = fs.readFileSync(envPath, 'utf8')
    const envLines = envFile.split('\n')

    envLines.forEach(line => {
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1].trim()
      }
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
        supabaseKey = line.split('=')[1].trim()
      }
    })
  } catch (error) {
    console.error('❌ No se pudo leer .env.local:', error.message)
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno SUPABASE')
  console.error('   Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const seedData = [
  // E-commerce
  { industry: 'ECOMMERCE', channel: 'GOOGLE_ADS', budget_monthly: 800000, revenue: 3200000, leads_generated: 120, sales_generated: 28, cac: 28571, roas: 4.0, conversion_rate: 23.3, region: 'METROPOLITANA', company_size: 'PYME', anonymous_user_id: 'seed_ecom_gads_1', created_at: '2024-10-01T10:00:00Z' },
  { industry: 'ECOMMERCE', channel: 'META_ADS', budget_monthly: 600000, revenue: 2100000, leads_generated: 95, sales_generated: 35, cac: 17143, roas: 3.5, conversion_rate: 36.8, region: 'VALPARAISO', company_size: 'PYME', anonymous_user_id: 'seed_ecom_meta_1', created_at: '2024-10-02T11:00:00Z' },
  { industry: 'ECOMMERCE', channel: 'TIKTOK_ADS', budget_monthly: 400000, revenue: 1600000, leads_generated: 180, sales_generated: 22, cac: 18182, roas: 4.0, conversion_rate: 12.2, region: 'METROPOLITANA', company_size: 'STARTUP', anonymous_user_id: 'seed_ecom_tiktok_1', created_at: '2024-10-03T09:00:00Z' },

  // Tecnología / SaaS
  { industry: 'TECNOLOGIA_SAAS', channel: 'GOOGLE_ADS', budget_monthly: 1200000, revenue: 4800000, leads_generated: 45, sales_generated: 12, cac: 100000, roas: 4.0, conversion_rate: 26.7, region: 'METROPOLITANA', company_size: 'EMPRESA', anonymous_user_id: 'seed_tech_gads_1', created_at: '2024-10-04T14:00:00Z' },
  { industry: 'TECNOLOGIA_SAAS', channel: 'LINKEDIN_ADS', budget_monthly: 1500000, revenue: 6000000, leads_generated: 38, sales_generated: 10, cac: 150000, roas: 4.0, conversion_rate: 26.3, region: 'METROPOLITANA', company_size: 'EMPRESA', anonymous_user_id: 'seed_tech_linkedin_1', created_at: '2024-10-05T15:00:00Z' },

  // Servicios Profesionales
  { industry: 'SERVICIOS_PROFESIONALES', channel: 'GOOGLE_ADS', budget_monthly: 500000, revenue: 2000000, leads_generated: 35, sales_generated: 8, cac: 62500, roas: 4.0, conversion_rate: 22.9, region: 'METROPOLITANA', company_size: 'PYME', anonymous_user_id: 'seed_serv_gads_1', created_at: '2024-10-06T10:00:00Z' },
  { industry: 'SERVICIOS_PROFESIONALES', channel: 'LINKEDIN_ADS', budget_monthly: 700000, revenue: 2800000, leads_generated: 28, sales_generated: 7, cac: 100000, roas: 4.0, conversion_rate: 25.0, region: 'VALPARAISO', company_size: 'PYME', anonymous_user_id: 'seed_serv_linkedin_1', created_at: '2024-10-07T11:00:00Z' },

  // Salud / Medicina
  { industry: 'SALUD_MEDICINA', channel: 'GOOGLE_ADS', budget_monthly: 900000, revenue: 3600000, leads_generated: 60, sales_generated: 18, cac: 50000, roas: 4.0, conversion_rate: 30.0, region: 'METROPOLITANA', company_size: 'EMPRESA', anonymous_user_id: 'seed_salud_gads_1', created_at: '2024-10-08T09:00:00Z' },
  { industry: 'SALUD_MEDICINA', channel: 'META_ADS', budget_monthly: 600000, revenue: 2400000, leads_generated: 85, sales_generated: 24, cac: 25000, roas: 4.0, conversion_rate: 28.2, region: 'BIOBIO', company_size: 'PYME', anonymous_user_id: 'seed_salud_meta_1', created_at: '2024-10-09T10:00:00Z' },

  // Educación Online
  { industry: 'EDUCACION_ONLINE', channel: 'GOOGLE_ADS', budget_monthly: 700000, revenue: 2800000, leads_generated: 150, sales_generated: 35, cac: 20000, roas: 4.0, conversion_rate: 23.3, region: 'METROPOLITANA', company_size: 'PYME', anonymous_user_id: 'seed_edu_gads_1', created_at: '2024-10-10T14:00:00Z' },
  { industry: 'EDUCACION_ONLINE', channel: 'META_ADS', budget_monthly: 500000, revenue: 2000000, leads_generated: 200, sales_generated: 40, cac: 12500, roas: 4.0, conversion_rate: 20.0, region: 'VALPARAISO', company_size: 'STARTUP', anonymous_user_id: 'seed_edu_meta_1', created_at: '2024-10-11T15:00:00Z' },

  // Inmobiliaria
  { industry: 'INMOBILIARIA', channel: 'GOOGLE_ADS', budget_monthly: 1500000, revenue: 6000000, leads_generated: 45, sales_generated: 5, cac: 300000, roas: 4.0, conversion_rate: 11.1, region: 'METROPOLITANA', company_size: 'EMPRESA', anonymous_user_id: 'seed_inmo_gads_1', created_at: '2024-10-12T09:00:00Z' },
  { industry: 'INMOBILIARIA', channel: 'META_ADS', budget_monthly: 1200000, revenue: 4800000, leads_generated: 68, sales_generated: 6, cac: 200000, roas: 4.0, conversion_rate: 8.8, region: 'VALPARAISO', company_size: 'PYME', anonymous_user_id: 'seed_inmo_meta_1', created_at: '2024-10-13T10:00:00Z' },

  // Fintech
  { industry: 'FINTECH', channel: 'GOOGLE_ADS', budget_monthly: 2000000, revenue: 8000000, leads_generated: 80, sales_generated: 16, cac: 125000, roas: 4.0, conversion_rate: 20.0, region: 'METROPOLITANA', company_size: 'CORPORACION', anonymous_user_id: 'seed_fintech_gads_1', created_at: '2024-10-14T11:00:00Z' },
  { industry: 'FINTECH', channel: 'LINKEDIN_ADS', budget_monthly: 2500000, revenue: 10000000, leads_generated: 65, sales_generated: 12, cac: 208333, roas: 4.0, conversion_rate: 18.5, region: 'METROPOLITANA', company_size: 'CORPORACION', anonymous_user_id: 'seed_fintech_linkedin_1', created_at: '2024-10-15T14:00:00Z' },

  // Moda / Retail
  { industry: 'MODA_RETAIL', channel: 'GOOGLE_ADS', budget_monthly: 600000, revenue: 2400000, leads_generated: 95, sales_generated: 30, cac: 20000, roas: 4.0, conversion_rate: 31.6, region: 'METROPOLITANA', company_size: 'PYME', anonymous_user_id: 'seed_moda_gads_1', created_at: '2024-10-16T10:00:00Z' },
  { industry: 'MODA_RETAIL', channel: 'META_ADS', budget_monthly: 800000, revenue: 3200000, leads_generated: 140, sales_generated: 45, cac: 17778, roas: 4.0, conversion_rate: 32.1, region: 'BIOBIO', company_size: 'PYME', anonymous_user_id: 'seed_moda_meta_1', created_at: '2024-10-17T15:00:00Z' },

  // Turismo
  { industry: 'TURISMO', channel: 'GOOGLE_ADS', budget_monthly: 900000, revenue: 3600000, leads_generated: 75, sales_generated: 18, cac: 50000, roas: 4.0, conversion_rate: 24.0, region: 'LOS_LAGOS', company_size: 'PYME', anonymous_user_id: 'seed_turismo_gads_1', created_at: '2024-10-18T09:00:00Z' },
  { industry: 'TURISMO', channel: 'META_ADS', budget_monthly: 700000, revenue: 2800000, leads_generated: 95, sales_generated: 22, cac: 31818, roas: 4.0, conversion_rate: 23.2, region: 'VALPARAISO', company_size: 'PYME', anonymous_user_id: 'seed_turismo_meta_1', created_at: '2024-10-19T11:00:00Z' },

  // Construcción
  { industry: 'CONSTRUCCION', channel: 'GOOGLE_ADS', budget_monthly: 1100000, revenue: 4400000, leads_generated: 35, sales_generated: 8, cac: 137500, roas: 4.0, conversion_rate: 22.9, region: 'METROPOLITANA', company_size: 'EMPRESA', anonymous_user_id: 'seed_const_gads_1', created_at: '2024-10-20T10:00:00Z' },
  { industry: 'CONSTRUCCION', channel: 'META_ADS', budget_monthly: 900000, revenue: 3600000, leads_generated: 48, sales_generated: 9, cac: 100000, roas: 4.0, conversion_rate: 18.8, region: 'BIOBIO', company_size: 'PYME', anonymous_user_id: 'seed_const_meta_1', created_at: '2024-10-21T14:00:00Z' },

  // Veterinaria / Mascotas
  { industry: 'VETERINARIA', channel: 'GOOGLE_ADS', budget_monthly: 500000, revenue: 2000000, leads_generated: 85, sales_generated: 25, cac: 20000, roas: 4.0, conversion_rate: 29.4, region: 'METROPOLITANA', company_size: 'PYME', anonymous_user_id: 'seed_vet_gads_1', created_at: '2024-10-22T09:00:00Z' },
  { industry: 'VETERINARIA', channel: 'META_ADS', budget_monthly: 400000, revenue: 1600000, leads_generated: 110, sales_generated: 32, cac: 12500, roas: 4.0, conversion_rate: 29.1, region: 'VALPARAISO', company_size: 'STARTUP', anonymous_user_id: 'seed_vet_meta_1', created_at: '2024-10-23T10:00:00Z' },

  // Deportes / Fitness
  { industry: 'DEPORTES', channel: 'GOOGLE_ADS', budget_monthly: 600000, revenue: 2400000, leads_generated: 70, sales_generated: 20, cac: 30000, roas: 4.0, conversion_rate: 28.6, region: 'METROPOLITANA', company_size: 'PYME', anonymous_user_id: 'seed_deporte_gads_1', created_at: '2024-10-24T11:00:00Z' },
  { industry: 'DEPORTES', channel: 'META_ADS', budget_monthly: 700000, revenue: 2800000, leads_generated: 95, sales_generated: 28, cac: 25000, roas: 4.0, conversion_rate: 29.5, region: 'BIOBIO', company_size: 'PYME', anonymous_user_id: 'seed_deporte_meta_1', created_at: '2024-10-25T15:00:00Z' },

  // Gastronomía / Delivery
  { industry: 'GASTRONOMIA', channel: 'GOOGLE_ADS', budget_monthly: 550000, revenue: 2200000, leads_generated: 200, sales_generated: 55, cac: 10000, roas: 4.0, conversion_rate: 27.5, region: 'METROPOLITANA', company_size: 'PYME', anonymous_user_id: 'seed_gastro_gads_1', created_at: '2024-10-26T09:00:00Z' },
  { industry: 'GASTRONOMIA', channel: 'META_ADS', budget_monthly: 650000, revenue: 2600000, leads_generated: 240, sales_generated: 65, cac: 10000, roas: 4.0, conversion_rate: 27.1, region: 'VALPARAISO', company_size: 'PYME', anonymous_user_id: 'seed_gastro_meta_1', created_at: '2024-10-27T10:00:00Z' },

  // Seguros
  { industry: 'SEGUROS', channel: 'GOOGLE_ADS', budget_monthly: 1800000, revenue: 7200000, leads_generated: 55, sales_generated: 12, cac: 150000, roas: 4.0, conversion_rate: 21.8, region: 'METROPOLITANA', company_size: 'CORPORACION', anonymous_user_id: 'seed_seguros_gads_1', created_at: '2024-10-28T14:00:00Z' },
  { industry: 'SEGUROS', channel: 'LINKEDIN_ADS', budget_monthly: 2200000, revenue: 8800000, leads_generated: 48, sales_generated: 10, cac: 220000, roas: 4.0, conversion_rate: 20.8, region: 'METROPOLITANA', company_size: 'CORPORACION', anonymous_user_id: 'seed_seguros_linkedin_1', created_at: '2024-10-29T11:00:00Z' },

  // Automotriz
  { industry: 'AUTOMOTRIZ', channel: 'GOOGLE_ADS', budget_monthly: 2000000, revenue: 8000000, leads_generated: 42, sales_generated: 6, cac: 333333, roas: 4.0, conversion_rate: 14.3, region: 'METROPOLITANA', company_size: 'CORPORACION', anonymous_user_id: 'seed_auto_gads_1', created_at: '2024-10-30T10:00:00Z' },
  { industry: 'AUTOMOTRIZ', channel: 'META_ADS', budget_monthly: 1500000, revenue: 6000000, leads_generated: 55, sales_generated: 8, cac: 187500, roas: 4.0, conversion_rate: 14.5, region: 'BIOBIO', company_size: 'EMPRESA', anonymous_user_id: 'seed_auto_meta_1', created_at: '2024-10-31T15:00:00Z' }
]

async function seedDatabase() {
  console.log('🌱 Iniciando seed de M&P Intelligence...\n')

  try {
    // Insertar todos los registros
    const { data, error } = await supabase
      .from('campaign_metrics')
      .insert(seedData)

    if (error) {
      console.error('❌ Error al insertar datos:', error)
      process.exit(1)
    }

    console.log(`✅ ${seedData.length} registros insertados exitosamente!`)
    console.log('\n📊 Distribución:')
    console.log('   - E-commerce: 3 registros')
    console.log('   - Tecnología/SaaS: 2 registros')
    console.log('   - Servicios Profesionales: 2 registros')
    console.log('   - Salud/Medicina: 2 registros')
    console.log('   - Educación Online: 2 registros')
    console.log('   - Inmobiliaria: 2 registros')
    console.log('   - Fintech: 2 registros')
    console.log('   - Moda/Retail: 2 registros')
    console.log('   - Turismo: 2 registros')
    console.log('   - Construcción: 2 registros')
    console.log('   - Veterinaria: 2 registros')
    console.log('   - Deportes: 2 registros')
    console.log('   - Gastronomía: 2 registros')
    console.log('   - Seguros: 2 registros')
    console.log('   - Automotriz: 2 registros')
    console.log('\n🎉 Seed completado!')

  } catch (error) {
    console.error('❌ Error inesperado:', error)
    process.exit(1)
  }
}

seedDatabase()
