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
