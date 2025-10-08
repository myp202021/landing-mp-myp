/**
 * Script COMPLETO para crear y publicar blogs automáticamente
 * Uso: npx tsx scripts/create-blog-complete.ts <slug>
 *
 * ✅ Crea el archivo page.tsx con validación JSX
 * ✅ Agrega automáticamente al array de app/blog/page.tsx
 * ✅ Valida caracteres < y > (los escapa correctamente)
 * ✅ Ejecuta build local para validar
 * ✅ (Opcional) Commit y push automático
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import blogTopics from '../content/blog-topics.json'

// Helper: Escapar < y > en texto para JSX
function escapeJSXOperators(text: string): string {
  // Reemplaza > seguido de espacio o $ con {'>'}
  text = text.replace(/>\s+\$/g, "{'>'}  $")
  text = text.replace(/>\s+/g, "{'>'} ")

  // Reemplaza < seguido de espacio o número con {'<'}
  text = text.replace(/<\s+\d/g, "{'<'} ")
  text = text.replace(/<\s+\$/g, "{'<'} $")

  return text
}

function generateBlogTemplate(topic: any): string {
  const date = new Date().toISOString()
  const displayDate = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })

  // Escapar operadores en título y descripción
  const safeTitle = escapeJSXOperators(topic.title)

  return `import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, BarChart3, Target, CheckCircle, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: '${topic.title}',
  description: '${topic.title}. Guía completa con ejemplos reales, datos de Chile 2025 y estrategias prácticas.',
  keywords: '${topic.keywords}',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog/${topic.slug}'
  },
  openGraph: {
    title: '${topic.title}',
    description: 'Guía completa con ejemplos reales y datos de Chile 2025.',
    type: 'article',
    url: 'https://www.mulleryperez.cl/blog/${topic.slug}',
    publishedTime: '${date}'
  }
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/"><img src="/logo-color.png" alt="Muller y Pérez" className="h-11 w-auto" /></Link>
          <Link href="/blog" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
        </div>
      </header>

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">${topic.category}</span>
            <p className="text-gray-500 mt-4">${displayDate} · 12 min de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            ${safeTitle}
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            [DESCRIPCIÓN INTRODUCTORIA - COMPLETAR AQUÍ]
          </p>

          <div className="prose prose-lg max-w-none">
            {/* INTRO */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                📌 Lo que aprenderás en este artículo
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>[PUNTO CLAVE 1]</li>
                <li>[PUNTO CLAVE 2]</li>
                <li>[PUNTO CLAVE 3]</li>
                <li>[PUNTO CLAVE 4]</li>
              </ul>
            </div>

            {/* SECCIÓN 1 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              [TÍTULO SECCIÓN 1]
            </h2>

            <p className="text-gray-700 mb-6">
              [CONTENIDO SECCIÓN 1 - COMPLETAR AQUÍ]
            </p>

            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Ejemplo Real Chile 2025</h3>
              <p className="text-gray-700 mb-4">
                [CASO DE ÉXITO O EJEMPLO - COMPLETAR AQUÍ]
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Resultados:</strong> [MÉTRICAS - COMPLETAR AQUÍ]
                </p>
              </div>
            </div>

            {/* SECCIÓN 2 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              [TÍTULO SECCIÓN 2]
            </h2>

            <p className="text-gray-700 mb-6">
              [CONTENIDO SECCIÓN 2 - COMPLETAR AQUÍ]
            </p>

            {/* SECCIÓN 3 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-600" />
              [TÍTULO SECCIÓN 3]
            </h2>

            <p className="text-gray-700 mb-6">
              [CONTENIDO SECCIÓN 3 - COMPLETAR AQUÍ]
            </p>

            {/* CONCLUSIÓN */}
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              🎯 Conclusión
            </h2>

            <p className="text-gray-700 mb-6">
              [CONCLUSIÓN - RESUMEN DE PUNTOS CLAVE]
            </p>

            {/* CTA FINAL */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center mt-16">
              <h3 className="text-3xl font-black text-white mb-4">
                ¿Necesitas Ayuda con tu Estrategia?
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                En M&P optimizamos campañas basadas en datos reales y resultados medibles.
              </p>
              <Link
                href="https://wa.me/56992258137"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Hablar con un Especialista
              </Link>
            </div>
          </div>
        </div>
      </article>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/"><img src="/logo-blanco.png" alt="Muller y Pérez" className="h-10 w-auto mx-auto mb-6" /></Link>
          <p className="text-gray-400">© 2025 Muller y Pérez. Marketing Digital Basado en Datos.</p>
        </div>
      </footer>
    </div>
  )
}
`
}

function addBlogToListingPage(topic: any) {
  const listingPagePath = path.join(process.cwd(), 'app', 'blog', 'page.tsx')
  let content = fs.readFileSync(listingPagePath, 'utf-8')

  const displayDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const newArticle = `  {
    slug: '${topic.slug}',
    title: '${topic.title}',
    excerpt: '${topic.title}. Guía completa con ejemplos reales y datos de Chile 2025.',
    date: '${displayDate}',
    category: '${topic.category}',
    readTime: '12 min',
    tag: 'Guía'
  },`

  // Insertar después de "const articles = ["
  const articlesArrayStart = content.indexOf('const articles = [')
  const insertPosition = content.indexOf('[', articlesArrayStart) + 1

  content = content.slice(0, insertPosition) + '\n' + newArticle + content.slice(insertPosition)

  fs.writeFileSync(listingPagePath, content)
  console.log('✅ Blog agregado al listado de app/blog/page.tsx')
}

async function validateBuild() {
  console.log('\n🔨 Validando build...')
  try {
    execSync('npm run build', { stdio: 'inherit' })
    console.log('✅ Build exitoso')
    return true
  } catch (error) {
    console.error('❌ Build falló. Revisa los errores arriba.')
    return false
  }
}

async function commitAndPush(slug: string) {
  console.log('\n📦 Haciendo commit y push...')
  try {
    execSync(`git add app/blog/${slug}/ app/blog/page.tsx`, { stdio: 'inherit' })
    execSync(`git commit -m "feat: Agregar blog ${slug}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"`, { stdio: 'inherit' })
    execSync('git push', { stdio: 'inherit' })
    console.log('✅ Commit y push exitosos')
    return true
  } catch (error) {
    console.error('❌ Error en commit/push')
    return false
  }
}

async function main() {
  const slug = process.argv[2]
  const autoCommit = process.argv.includes('--commit')

  if (!slug) {
    console.error('❌ Error: Debes proporcionar un slug')
    console.log('Uso: npx tsx scripts/create-blog-complete.ts <slug> [--commit]')
    console.log('\nBlog posts disponibles:')
    blogTopics.topics
      .filter(t => t.status === 'pending')
      .forEach(t => console.log(`  - ${t.slug}`))
    process.exit(1)
  }

  const topic = blogTopics.topics.find(t => t.slug === slug)

  if (!topic) {
    console.error(`❌ Error: No se encontró el topic con slug "${slug}"`)
    process.exit(1)
  }

  if (topic.status === 'published') {
    console.error(`❌ Error: El blog "${slug}" ya está publicado`)
    process.exit(1)
  }

  const blogDir = path.join(process.cwd(), 'app', 'blog', slug)

  if (fs.existsSync(blogDir)) {
    console.error(`❌ Error: El directorio app/blog/${slug} ya existe`)
    process.exit(1)
  }

  console.log(`\n🚀 Creando blog: ${topic.title}`)

  // 1. Crear directorio y archivo
  fs.mkdirSync(blogDir, { recursive: true })
  const template = generateBlogTemplate(topic)
  fs.writeFileSync(path.join(blogDir, 'page.tsx'), template)
  console.log(`✅ Archivo creado: app/blog/${slug}/page.tsx`)

  // 2. Agregar al array de blogs
  addBlogToListingPage(topic)

  // 3. Validar build
  const buildSuccess = await validateBuild()
  if (!buildSuccess) {
    console.error('\n❌ Abortando por errores de build')
    process.exit(1)
  }

  // 4. Commit y push (opcional)
  if (autoCommit) {
    await commitAndPush(slug)
  } else {
    console.log('\n📝 Próximos pasos:')
    console.log(`1. Edita app/blog/${slug}/page.tsx (completa [COMPLETAR AQUÍ])`)
    console.log(`2. Prueba en http://localhost:3000/blog/${slug}`)
    console.log(`3. Commit manualmente o ejecuta con --commit`)
    console.log('\n💡 Para commit automático: npx tsx scripts/create-blog-complete.ts <slug> --commit')
  }

  console.log('\n✅ ¡Blog creado exitosamente!')
}

main().catch(console.error)
