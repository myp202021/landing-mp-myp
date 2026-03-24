import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Artículo no encontrado' }

  return {
    title: post.seo_title || post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://www.mulleryperez.cl/blog/${post.slug}`
    },
    openGraph: {
      title: post.seo_title || post.title,
      description: post.description,
      type: 'article',
      url: `https://www.mulleryperez.cl/blog/${post.slug}`,
      publishedTime: `${post.date_published}T00:00:00.000Z`,
      images: [
        {
          url: 'https://www.mulleryperez.cl/og-image.svg',
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    }
  }
}

export const revalidate = 3600 // Revalidar cada 1 hora

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const fechaFormateada = new Date(post.date_published + 'T12:00:00').toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url: `https://www.mulleryperez.cl/blog/${post.slug}`,
    datePublished: `${post.date_published}T00:00:00.000Z`,
    dateModified: `${post.date_published}T00:00:00.000Z`,
    author: {
      '@type': 'Person',
      name: 'Christopher Müller',
      url: 'https://www.mulleryperez.cl/equipo/christopher-muller',
      sameAs: [
        'https://www.linkedin.com/in/christophermullerm/',
        'https://www.mulleryperez.cl'
      ],
      jobTitle: 'CEO & Founder',
      worksFor: {
        '@type': 'Organization',
        name: 'Muller y Pérez',
        url: 'https://www.mulleryperez.cl'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mulleryperez.cl/logo-color.png'
      }
    },
    image: 'https://www.mulleryperez.cl/og-image.jpg',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.mulleryperez.cl/blog/${post.slug}`
    },
    articleSection: post.category || 'Marketing Digital',
    keywords: post.keywords,
    inLanguage: 'es-CL'
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.mulleryperez.cl' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.mulleryperez.cl/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.mulleryperez.cl/blog/${post.slug}` }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <SiteHeader />

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">{post.category}</span>
            <p className="text-gray-500 mt-4">{fechaFormateada} · {post.read_time} de lectura</p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            {post.excerpt}
          </p>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">¿Necesitas resultados reales en marketing digital?</h3>
            <p className="text-blue-100 mb-6">En Muller y Pérez gestionamos campañas de performance con datos y transparencia total.</p>
            <Link
              href="/#contacto"
              className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all"
            >
              Conversemos →
            </Link>
          </div>

          {/* Navegación */}
          <div className="mt-12 text-center">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              ← Ver todos los artículos del blog
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
