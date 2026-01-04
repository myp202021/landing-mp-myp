import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mulleryperez.cl'
  const currentDate = new Date().toISOString()

  // Leer automáticamente todas las carpetas de blog
  const blogDir = path.join(process.cwd(), 'app', 'blog')
  let blogPosts: string[] = []

  try {
    const entries = fs.readdirSync(blogDir, { withFileTypes: true })
    blogPosts = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('_'))
      .map(entry => entry.name)
  } catch (error) {
    console.warn('No se pudo leer el directorio de blog:', error)
  }

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
