/**
 * Script para enviar todas las URLs del sitemap a IndexNow
 * Ejecutar con: npx tsx scripts/submit-sitemap-to-indexnow.ts
 */

import { submitToIndexNow } from '../lib/indexnow'

const SITE_URL = 'https://www.mulleryperez.cl'

async function main() {
  console.log('🚀 Enviando sitemap completo a IndexNow...\n')

  // URLs principales del sitio
  const urls = [
    `${SITE_URL}`,
    `${SITE_URL}/labs`,
    `${SITE_URL}/labs/mp-predictor`,
    `${SITE_URL}/labs/comparador-web`,
    `${SITE_URL}/utilidades`,
    `${SITE_URL}/utilidades/calculadora-cac`,
    `${SITE_URL}/utilidades/generador-funnels`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/blog/que-es-performance-marketing`,
    `${SITE_URL}/blog/como-mejorar-roas-google-ads`,
    `${SITE_URL}/blog/estrategias-meta-ads-2025`,
  ]

  console.log(`📋 URLs a enviar: ${urls.length}`)
  urls.forEach(url => console.log(`  - ${url}`))
  console.log('')

  const result = await submitToIndexNow(urls)

  if (result.success) {
    console.log('✅ ¡Éxito! Todas las URLs fueron enviadas a IndexNow')
    console.log('📊 Bing, Yandex y otros buscadores indexarán tu sitio en minutos')
  } else {
    console.log('⚠️ Algunas sumisiones fallaron:')
    result.errors?.forEach(error => console.log(`  - ${error}`))
  }
}

main().catch(console.error)
