import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.mulleryperez.cl'
  const currentDate = new Date().toISOString()

  // Leer carpetas estáticas de blog
  const blogDir = path.join(process.cwd(), 'app', 'blog')
  let staticBlogPosts: string[] = []

  try {
    const entries = fs.readdirSync(blogDir, { withFileTypes: true })
    staticBlogPosts = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('['))
      .map(entry => entry.name)
  } catch (error) {
    console.warn('No se pudo leer el directorio de blog:', error)
  }

  // Leer posts dinámicos de Supabase
  let supabasePosts: { slug: string; date_published: string }[] = []
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data } = await supabase
        .from('blog_posts')
        .select('slug, date_published')
        .order('date_published', { ascending: false })
      if (data) supabasePosts = data
    }
  } catch (error) {
    console.warn('No se pudo leer blog_posts de Supabase:', error)
  }

  // Combinar slugs de blog (estáticos + Supabase, sin duplicados)
  const allBlogSlugs = new Set([
    ...staticBlogPosts,
    ...supabasePosts.map(p => p.slug)
  ])
  const blogPosts = Array.from(allBlogSlugs)

  // Leer automáticamente todas las herramientas de labs
  const labsDir = path.join(process.cwd(), 'app', 'labs')
  let labsTools: string[] = []

  try {
    const entries = fs.readdirSync(labsDir, { withFileTypes: true })
    labsTools = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('_'))
      .map(entry => entry.name)
  } catch (error) {
    console.warn('No se pudo leer el directorio de labs:', error)
  }

  // Para cada tool de labs, verificar si tiene subdirectorios que no debemos indexar
  const labsToolsFiltered: string[] = []
  for (const tool of labsTools) {
    labsToolsFiltered.push(tool)
    // Verificar si hay subdirectorios dentro de cada tool
    try {
      const toolDir = path.join(labsDir, tool)
      const toolEntries = fs.readdirSync(toolDir, { withFileTypes: true })
      // Filtrar subdirectorios, excluyendo internal-stats y otros privados
      const subDirs = toolEntries
        .filter(entry => entry.isDirectory() && !entry.name.startsWith('_') && entry.name !== 'internal-stats')
      // Por ahora no agregamos subdirectorios al sitemap ya que internal-stats es el único
    } catch (error) {
      // Ignorar errores de lectura de subdirectorios
    }
  }

  // Leer automáticamente todas las utilidades
  const utilidadesDir = path.join(process.cwd(), 'app', 'utilidades')
  let utilidades: string[] = []

  try {
    const entries = fs.readdirSync(utilidadesDir, { withFileTypes: true })
    utilidades = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('_'))
      .map(entry => entry.name)
  } catch (error) {
    console.warn('No se pudo leer el directorio de utilidades:', error)
  }

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Copilot - Inteligencia Competitiva
    {
      url: `${baseUrl}/copilot`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    // Nosotros
    {
      url: `${baseUrl}/nosotros`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Planes
    {
      url: `${baseUrl}/planes`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    // Indicadores / Termómetro Marketing Digital
    {
      url: `${baseUrl}/indicadores`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    // Agentes IA SEO
    {
      url: `${baseUrl}/agentes`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Investigación Hub
    {
      url: `${baseUrl}/investigacion`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    // Equipo - Christopher Müller
    {
      url: `${baseUrl}/equipo/christopher-muller`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Comparativa M&P vs Agencias
    {
      url: `${baseUrl}/comparativa/muller-perez-vs-agencias-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    // Página Pilar SEO - Agencia Marketing Digital Chile
    {
      url: `${baseUrl}/agencia-marketing-digital-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    // Hub Pages - Industrias y Recursos
    {
      url: `${baseUrl}/industrias`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/recursos`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Landing Pages SEO - Variaciones de Keywords
    {
      url: `${baseUrl}/agencia-marketing-digital-santiago`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-vina-del-mar`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-concepcion`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-valparaiso`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-temuco`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-antofagasta`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-puerto-montt`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-la-serena`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-iquique`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-rancagua`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-talca`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    // Comunas Santiago - Sector Oriente
    {
      url: `${baseUrl}/agencia-marketing-digital-las-condes`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-vitacura`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-la-dehesa`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/agencia-publicidad-digital-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/consultora-marketing-digital-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/empresa-marketing-digital-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/marketing-digital-pymes-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Páginas GEO - Rankings y Estadísticas
    {
      url: `${baseUrl}/ranking-agencias-marketing-digital-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/mejores-agencias-performance-marketing-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ranking-agencias-data-driven-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ranking-agencias-creativas-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/comparativa-agencias-marketing-digital-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/estadisticas-marketing-digital-chile-2025`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/estadisticas-marketing-digital-chile-2026`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/precios-agencia-marketing-digital-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/guia-contratar-agencia-marketing-digital`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cuanto-cuesta-agencia-marketing-digital-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    // Páginas por Industria - Alto Intent Comercial
    {
      url: `${baseUrl}/marketing-digital-ecommerce-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-b2b-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-saas-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-fintech-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-servicios-profesionales-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-inmobiliario-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-salud-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-educacion-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-legal-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-seguros-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-turismo-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketing-digital-manufactura-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Páginas Comparativas VS
    {
      url: `${baseUrl}/google-ads-vs-meta-ads-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agencia-marketing-digital-vs-inhouse`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Páginas de Conversión
    {
      url: `${baseUrl}/cotizador`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/benchmarks`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    // Estudio Benchmark CPL Chile 2025 - Alta prioridad para AEO
    {
      url: `${baseUrl}/benchmark-cpl-chile-2025`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    // Estudio Benchmark CPL Chile 2026
    {
      url: `${baseUrl}/benchmark-cpl-chile-2026`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    // Tecnología
    {
      url: `${baseUrl}/tecnologia`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Casos de Éxito
    {
      url: `${baseUrl}/casos-de-exito`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Portfolio
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Servicios Hub
    {
      url: `${baseUrl}/servicios`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Páginas de Servicio
    {
      url: `${baseUrl}/servicios/google-ads-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios/meta-ads-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios/performance-marketing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios/seo-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios/facebook-ads-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios/instagram-ads-chile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Recursos - Rankings Agencias
    {
      url: `${baseUrl}/recursos/ranking-agencias-performance-marketing-chile-2025`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/recursos/mejores-agencias-google-ads-chile-2025`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/recursos/mejores-agencias-meta-ads-chile-2025`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/recursos/ranking-agencias-performance-marketing-chile-2026`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/recursos/mejores-agencias-google-ads-chile-2026`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/recursos/mejores-agencias-meta-ads-chile-2026`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    // M&P Labs Hub
    {
      url: `${baseUrl}/labs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // M&P Labs Tools (automático, excluyendo internal-stats)
    ...labsToolsFiltered.map(tool => ({
      url: `${baseUrl}/labs/${tool}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    // Utilidades Hub
    {
      url: `${baseUrl}/utilidades`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Utilidades Tools (automático)
    ...utilidades.map(utilidad => ({
      url: `${baseUrl}/utilidades/${utilidad}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    // Blog Hub
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Blog Articles (automático)
    ...blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
