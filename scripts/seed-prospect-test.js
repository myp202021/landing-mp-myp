/**
 * SEED datos de prueba para el sistema de prospección
 * Mete 6 empresas realistas (3 inmobiliarias + 3 SaaS) con contactos y benchmarks
 *
 * node scripts/seed-prospect-test.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BATCH_ID = 'test_seed_001'

const testCompanies = [
  // ── Inmobiliarias ──
  {
    company: {
      name: 'Inmobiliaria Almagro',
      website: 'https://www.almagro.cl',
      phone: '+56 2 2345 6789',
      city: 'Santiago',
      region: 'Región Metropolitana',
      country: 'Chile',
      industry: 'inmobiliaria',
      category: 'Inmobiliaria',
      rating: 4.2,
      reviews_count: 87,
      instagram_url: 'https://www.instagram.com/inmobiliariaalmagro/',
      linkedin_url: 'https://www.linkedin.com/company/inmobiliaria-almagro/',
      facebook_url: 'https://www.facebook.com/inmobiliariaalmagro/',
      status: 'benchmarked',
      source: 'google_maps',
      source_query: 'inmobiliarias en Santiago Chile',
      batch_id: BATCH_ID,
    },
    contacts: [
      { contact_email: 'contacto@almagro.cl', email_type: 'info', is_primary: true },
      { contact_email: 'ventas@almagro.cl', email_type: 'sales', is_primary: false },
    ],
    benchmark: {
      website_score: 14,
      instagram_score: 6,
      linkedin_score: 3,
      facebook_score: 4,
      seo_score: 6,
      paid_readiness_score: 10,
      brand_clarity_score: 6,
      technical_score: 3,
      final_score: 52,
      pagespeed_mobile: 45,
      pagespeed_desktop: 72,
      has_analytics: true,
      has_meta_pixel: true,
      has_form: true,
      has_whatsapp: false,
      has_cta: true,
      has_ssl: true,
      technologies_detected: ['WordPress', 'Bootstrap'],
      ig_followers: 3200,
      ig_posts_30d: 3,
      ig_engagement_rate: 1.2,
      li_followers: 450,
      li_posts_30d: 1,
      li_engagement_rate: 0.3,
      fb_followers: 5800,
      fb_posts_30d: 2,
      fb_engagement_rate: 0.4,
      fb_has_ads: false,
      fortalezas: [
        'Sitio web con formulario y CTA claros',
        'Google Analytics y Meta Pixel instalados',
        'Comunidad Instagram de 3.200 seguidores',
      ],
      brechas: [
        'Instagram casi inactivo (3 posts en 30 días) — la competencia publica 4x más',
        'LinkedIn sin publicaciones recientes — oportunidad perdida en B2B',
        'Sin WhatsApp en el sitio — pierde consultas en caliente',
        'Sitio lento en móvil (45/100) — rebote alto',
        'Facebook con bajo engagement (0.4%) — contenido no genera interacción',
      ],
      acciones: [
        'Aumentar frecuencia de publicación en Instagram a mínimo 3x/semana',
        'Optimizar velocidad del sitio — comprimir imágenes y revisar hosting',
        'Agregar WhatsApp flotante en todas las páginas',
      ],
      resumen_ejecutivo: 'Inmobiliaria Almagro tiene un nivel de madurez digital medio (52/100). Oportunidad comercial media. Principal brecha: Instagram casi inactivo (3 posts en 30 días).',
      angulo_comercial: 'Almagro tiene las bases técnicas (pixel, analytics, formulario) pero no las está explotando. Con una estrategia de contenido ordenada en Instagram y LinkedIn, más optimización de velocidad, pueden multiplicar los contactos que genera su sitio.',
    },
  },
  {
    company: {
      name: 'Siena Inmobiliaria',
      website: 'https://www.siena.cl',
      phone: '+56 2 2987 1234',
      city: 'Las Condes',
      region: 'Región Metropolitana',
      country: 'Chile',
      industry: 'inmobiliaria',
      category: 'Inmobiliaria',
      rating: 4.5,
      reviews_count: 142,
      instagram_url: 'https://www.instagram.com/sienainmobiliaria/',
      facebook_url: 'https://www.facebook.com/sienainmobiliaria/',
      status: 'benchmarked',
      source: 'google_maps',
      source_query: 'inmobiliarias en Santiago Chile',
      batch_id: BATCH_ID,
    },
    contacts: [
      { contact_email: 'info@siena.cl', email_type: 'info', is_primary: true },
    ],
    benchmark: {
      website_score: 8,
      instagram_score: 2,
      linkedin_score: 0,
      facebook_score: 3,
      seo_score: 4,
      paid_readiness_score: 3,
      brand_clarity_score: 4,
      technical_score: 2,
      final_score: 26,
      pagespeed_mobile: 32,
      pagespeed_desktop: 58,
      has_analytics: false,
      has_meta_pixel: false,
      has_form: true,
      has_whatsapp: true,
      has_cta: true,
      has_ssl: true,
      technologies_detected: ['Wix'],
      ig_followers: 890,
      ig_posts_30d: 1,
      ig_engagement_rate: 0.8,
      fb_followers: 2100,
      fb_posts_30d: 1,
      fb_engagement_rate: 0.2,
      fortalezas: [
        'Conexión segura (SSL) implementada',
        'WhatsApp disponible en el sitio',
      ],
      brechas: [
        'No tiene Meta Pixel — no puede hacer remarketing ni medir conversiones de Meta Ads',
        'No tiene Google Analytics — sin visibilidad de tráfico ni comportamiento del usuario',
        'Sin presencia en LinkedIn — invisible para decisores B2B',
        'Sitio muy lento en móvil (32/100) — rebote alto',
        'Instagram casi inactivo (1 post en 30 días)',
      ],
      acciones: [
        'Instalar Meta Pixel y configurar eventos de conversión',
        'Implementar Google Analytics 4 con eventos clave',
        'Crear página de empresa en LinkedIn y comenzar a publicar contenido de valor',
      ],
      resumen_ejecutivo: 'Siena Inmobiliaria tiene un nivel de madurez digital bajo (26/100). Oportunidad comercial alta. Principal brecha: no tiene Meta Pixel ni Analytics.',
      angulo_comercial: 'Siena está invirtiendo en presencia digital pero sin medir resultados. Sin pixel ni analytics, cada peso en publicidad es a ciegas. Hay una oportunidad clara de ordenar la medición y demostrar ROI desde el día 1.',
    },
  },
  {
    company: {
      name: 'Paz Corp',
      website: 'https://www.pazcorp.com',
      phone: '+56 2 2600 0000',
      city: 'Providencia',
      region: 'Región Metropolitana',
      country: 'Chile',
      industry: 'inmobiliaria',
      category: 'Inmobiliaria',
      rating: 3.8,
      reviews_count: 320,
      instagram_url: 'https://www.instagram.com/pazcorp/',
      linkedin_url: 'https://www.linkedin.com/company/paz-corp/',
      facebook_url: 'https://www.facebook.com/PazCorp/',
      status: 'benchmarked',
      source: 'google_maps',
      source_query: 'inmobiliarias en Santiago Chile',
      batch_id: BATCH_ID,
    },
    contacts: [
      { contact_email: 'contacto@pazcorp.com', email_type: 'info', is_primary: true },
    ],
    benchmark: {
      website_score: 18,
      instagram_score: 12,
      linkedin_score: 10,
      facebook_score: 7,
      seo_score: 8,
      paid_readiness_score: 13,
      brand_clarity_score: 8,
      technical_score: 4,
      final_score: 80,
      pagespeed_mobile: 68,
      pagespeed_desktop: 85,
      has_analytics: true,
      has_meta_pixel: true,
      has_form: true,
      has_whatsapp: true,
      has_cta: true,
      has_ssl: true,
      technologies_detected: ['React', 'Next.js'],
      ig_followers: 45000,
      ig_posts_30d: 12,
      ig_engagement_rate: 2.8,
      li_followers: 8500,
      li_posts_30d: 6,
      li_engagement_rate: 1.5,
      fb_followers: 32000,
      fb_posts_30d: 8,
      fb_engagement_rate: 1.1,
      fb_has_ads: true,
      fortalezas: [
        'Sitio web bien optimizado con CTAs y formularios claros',
        'Instagram con buen engagement (2.8%)',
        'LinkedIn activo con 6 publicaciones/mes',
      ],
      brechas: [
        'Velocidad móvil mejorable (68/100)',
        'Podrían explotar más LinkedIn para captación B2B',
      ],
      acciones: [
        'Optimizar Core Web Vitals para mejorar velocidad móvil',
      ],
      resumen_ejecutivo: 'Paz Corp tiene un nivel de madurez digital alto (80/100). Oportunidad comercial baja pero con upsell. Sin brechas críticas detectadas.',
      angulo_comercial: 'Paz Corp tiene bases sólidas. Con optimización de su embudo digital y una estrategia de contenido + pauta coordinada, pueden multiplicar sus resultados actuales.',
    },
  },
  // ── SaaS ──
  {
    company: {
      name: 'Bsale',
      website: 'https://www.bsale.cl',
      phone: '+56 2 2345 0000',
      city: 'Santiago',
      region: 'Región Metropolitana',
      country: 'Chile',
      industry: 'saas',
      category: 'Software empresas',
      rating: 4.3,
      reviews_count: 210,
      instagram_url: 'https://www.instagram.com/bsale.cl/',
      linkedin_url: 'https://www.linkedin.com/company/bsale/',
      facebook_url: 'https://www.facebook.com/bsale.cl/',
      status: 'benchmarked',
      source: 'google_maps',
      source_query: 'empresas SaaS Chile',
      batch_id: BATCH_ID,
    },
    contacts: [
      { contact_email: 'hola@bsale.cl', email_type: 'info', is_primary: true },
      { contact_email: 'ventas@bsale.cl', email_type: 'sales', is_primary: false },
    ],
    benchmark: {
      website_score: 16,
      instagram_score: 9,
      linkedin_score: 8,
      facebook_score: 5,
      seo_score: 8,
      paid_readiness_score: 12,
      brand_clarity_score: 8,
      technical_score: 4,
      final_score: 70,
      pagespeed_mobile: 55,
      pagespeed_desktop: 78,
      has_analytics: true,
      has_meta_pixel: true,
      has_form: true,
      has_whatsapp: true,
      has_cta: true,
      has_ssl: true,
      technologies_detected: ['Next.js', 'React', 'Tailwind'],
      ig_followers: 12000,
      ig_posts_30d: 6,
      ig_engagement_rate: 1.8,
      li_followers: 5200,
      li_posts_30d: 4,
      li_engagement_rate: 1.2,
      fb_followers: 8900,
      fb_posts_30d: 3,
      fb_engagement_rate: 0.6,
      fortalezas: [
        'Tracking completo: Google Analytics + Meta Pixel instalados',
        'Instagram con buen engagement (1.8%)',
        'LinkedIn activo con 4 publicaciones/mes',
      ],
      brechas: [
        'Velocidad móvil mejorable (55/100) — afecta conversiones',
        'Facebook con bajo engagement — contenido no genera interacción',
        'Podrían explotar más contenido educativo en LinkedIn',
      ],
      acciones: [
        'Optimizar velocidad del sitio — comprimir imágenes y revisar hosting',
        'Crear estrategia de contenido educativo para LinkedIn',
      ],
      resumen_ejecutivo: 'Bsale tiene un nivel de madurez digital medio-alto (70/100). Oportunidad comercial baja pero con upsell.',
      angulo_comercial: 'Bsale tiene bases sólidas pero no está explotando LinkedIn al máximo para B2B. Con contenido educativo y thought leadership, pueden posicionarse mucho más fuerte en su vertical.',
    },
  },
  {
    company: {
      name: 'Centry',
      website: 'https://www.centry.cl',
      phone: '+56 2 3210 5555',
      city: 'Santiago',
      region: 'Región Metropolitana',
      country: 'Chile',
      industry: 'saas',
      category: 'Software e-commerce',
      rating: 4.0,
      reviews_count: 45,
      instagram_url: 'https://www.instagram.com/centry.cl/',
      linkedin_url: 'https://www.linkedin.com/company/centry/',
      status: 'benchmarked',
      source: 'google_maps',
      source_query: 'empresas SaaS Chile',
      batch_id: BATCH_ID,
    },
    contacts: [
      { contact_email: 'info@centry.cl', email_type: 'info', is_primary: true },
    ],
    benchmark: {
      website_score: 10,
      instagram_score: 4,
      linkedin_score: 5,
      facebook_score: 0,
      seo_score: 6,
      paid_readiness_score: 7,
      brand_clarity_score: 5,
      technical_score: 3,
      final_score: 40,
      pagespeed_mobile: 42,
      pagespeed_desktop: 65,
      has_analytics: true,
      has_meta_pixel: false,
      has_form: true,
      has_whatsapp: false,
      has_cta: true,
      has_ssl: true,
      technologies_detected: ['WordPress'],
      ig_followers: 1500,
      ig_posts_30d: 2,
      ig_engagement_rate: 1.0,
      li_followers: 800,
      li_posts_30d: 2,
      li_engagement_rate: 0.8,
      fortalezas: [
        'Conexión segura (SSL) implementada',
        'Google Analytics instalado',
      ],
      brechas: [
        'No tiene Meta Pixel — no puede hacer remarketing ni medir conversiones de Meta Ads',
        'Sin WhatsApp en el sitio — pierde consultas en caliente',
        'Instagram casi inactivo (2 posts en 30 días)',
        'Sin presencia en Facebook — canal perdido',
        'Sitio lento en móvil (42/100)',
      ],
      acciones: [
        'Instalar Meta Pixel y configurar eventos de conversión',
        'Agregar WhatsApp flotante en todas las páginas',
        'Aumentar frecuencia de publicación en Instagram a mínimo 3x/semana',
      ],
      resumen_ejecutivo: 'Centry tiene un nivel de madurez digital medio (40/100). Oportunidad comercial media. Principal brecha: no tiene Meta Pixel.',
      angulo_comercial: 'Centry no tiene las bases técnicas para hacer publicidad digital efectiva. Antes de invertir en pauta, necesitan instalar tracking, optimizar conversiones y estructurar un embudo. Ese orden es exactamente lo que M&P hace.',
    },
  },
  {
    company: {
      name: 'Nubox',
      website: 'https://www.nubox.com',
      phone: '+56 2 2890 0000',
      city: 'Santiago',
      region: 'Región Metropolitana',
      country: 'Chile',
      industry: 'saas',
      category: 'Software contabilidad',
      rating: 3.9,
      reviews_count: 180,
      instagram_url: 'https://www.instagram.com/nubox.chile/',
      linkedin_url: 'https://www.linkedin.com/company/nubox/',
      facebook_url: 'https://www.facebook.com/nubox.chile/',
      status: 'benchmarked',
      source: 'google_maps',
      source_query: 'empresas SaaS Chile',
      batch_id: BATCH_ID,
    },
    contacts: [
      { contact_email: 'contacto@nubox.com', email_type: 'info', is_primary: true },
    ],
    benchmark: {
      website_score: 12,
      instagram_score: 5,
      linkedin_score: 4,
      facebook_score: 3,
      seo_score: 5,
      paid_readiness_score: 6,
      brand_clarity_score: 5,
      technical_score: 3,
      final_score: 43,
      pagespeed_mobile: 38,
      pagespeed_desktop: 60,
      has_analytics: true,
      has_meta_pixel: false,
      has_form: true,
      has_whatsapp: false,
      has_cta: true,
      has_ssl: true,
      technologies_detected: ['WordPress', 'Bootstrap'],
      ig_followers: 4500,
      ig_posts_30d: 3,
      ig_engagement_rate: 0.9,
      li_followers: 3200,
      li_posts_30d: 2,
      li_engagement_rate: 0.5,
      fb_followers: 6800,
      fb_posts_30d: 2,
      fb_engagement_rate: 0.3,
      fortalezas: [
        'Google Analytics instalado',
        'Formulario de contacto visible',
      ],
      brechas: [
        'No tiene Meta Pixel — no puede hacer remarketing ni medir conversiones de Meta Ads',
        'Sin WhatsApp — pierde consultas en caliente',
        'Sitio muy lento en móvil (38/100) — rebote alto',
        'Instagram casi inactivo (3 posts en 30 días)',
        'LinkedIn sin publicaciones frecuentes — oportunidad perdida en B2B',
      ],
      acciones: [
        'Instalar Meta Pixel y configurar eventos de conversión',
        'Optimizar velocidad del sitio — comprimir imágenes y revisar hosting',
        'Aumentar frecuencia en LinkedIn con contenido educativo sobre contabilidad',
      ],
      resumen_ejecutivo: 'Nubox tiene un nivel de madurez digital medio (43/100). Oportunidad comercial media. Principal brecha: no tiene Meta Pixel.',
      angulo_comercial: 'Nubox tiene presencia en redes pero está prácticamente inactiva. Sus competidores están publicando y captando atención. Con una estrategia de contenido ordenada, pueden recuperar terreno rápidamente.',
    },
  },
]

async function main() {
  console.log('🌱 Insertando datos de prueba de prospección...\n')

  // Limpiar datos de prueba anteriores
  await supabase.from('prospect_outreach_events').delete().neq('id', 0)
  await supabase.from('prospect_outreach').delete().neq('id', 0)
  await supabase.from('prospect_benchmarks').delete().neq('id', 0)
  await supabase.from('prospect_contacts').delete().neq('id', 0)
  await supabase.from('prospect_companies').delete().eq('batch_id', BATCH_ID)

  for (const item of testCompanies) {
    // 1. Insertar empresa
    const { data: company, error: compError } = await supabase
      .from('prospect_companies')
      .insert(item.company)
      .select()
      .single()

    if (compError) {
      console.error(`❌ Error insertando ${item.company.name}: ${compError.message}`)
      continue
    }

    console.log(`✅ ${company.name} (id: ${company.id})`)

    // 2. Insertar contactos
    for (const contact of item.contacts) {
      const { error: contError } = await supabase
        .from('prospect_contacts')
        .insert({ ...contact, company_id: company.id, source: 'test_seed' })

      if (contError) {
        console.error(`   ⚠️ Error contacto: ${contError.message}`)
      } else {
        console.log(`   📧 ${contact.contact_email}`)
      }
    }

    // 3. Insertar benchmark
    const { error: benchError } = await supabase
      .from('prospect_benchmarks')
      .insert({ ...item.benchmark, company_id: company.id })

    if (benchError) {
      console.error(`   ⚠️ Error benchmark: ${benchError.message}`)
    } else {
      console.log(`   📊 Benchmark: ${item.benchmark.final_score}/100`)
    }

    console.log('')
  }

  console.log('════════════════════════════════════════')
  console.log('🎉 Datos de prueba insertados!')
  console.log('')
  console.log('Resumen:')
  console.log('  3 inmobiliarias: Almagro (52), Siena (26), Paz Corp (80)')
  console.log('  3 SaaS: Bsale (70), Centry (40), Nubox (43)')
  console.log('')
  console.log('Flujo esperado:')
  console.log('  → Siena (26) y Centry (40) = oportunidad ALTA → aprobar')
  console.log('  → Almagro (52) y Nubox (43) = oportunidad MEDIA → aprobar')
  console.log('  → Bsale (70) y Paz Corp (80) = oportunidad BAJA → descartar o upsell')
  console.log('')
  console.log('Ahora ve a /crm/prospeccion → tab Benchmarks')
  console.log('Revisa cada uno, haz click en "👁 Email" para preview')
  console.log('Aprueba los que quieras enviar → botón "Aprobar"')
  console.log('════════════════════════════════════════')
}

main().catch(err => {
  console.error('💥', err)
  process.exit(1)
})
