/**
 * Script para generar múltiples blog posts en batch
 * Uso: npx tsx scripts/generate-batch-blogs.ts [cantidad]
 */

import { execSync } from 'child_process'
import blogTopics from '../content/blog-topics.json'

async function main() {
  const cantidad = parseInt(process.argv[2] || '5')

  const pendingTopics = blogTopics.topics.filter(t => t.status === 'pending')

  if (pendingTopics.length === 0) {
    console.log('✅ ¡Todos los blogs ya están creados!')
    return
  }

  const topicsToGenerate = pendingTopics.slice(0, cantidad)

  console.log(`🚀 Generando ${topicsToGenerate.length} blog posts...\n`)

  for (const topic of topicsToGenerate) {
    try {
      console.log(`📝 Creando: ${topic.slug}`)
      execSync(`npx tsx scripts/generate-blog-post.ts ${topic.slug}`, { stdio: 'inherit' })
      console.log(`✅ ${topic.slug} creado\n`)
    } catch (error) {
      console.error(`❌ Error creando ${topic.slug}:`, error)
    }
  }

  console.log(`\n✅ ¡${topicsToGenerate.length} blogs creados exitosamente!`)
  console.log(`\n📋 Blogs pendientes restantes: ${pendingTopics.length - topicsToGenerate.length}`)
  console.log(`\n💡 Para generar más blogs, ejecuta:`)
  console.log(`   npx tsx scripts/generate-batch-blogs.ts 5`)
}

main().catch(console.error)
