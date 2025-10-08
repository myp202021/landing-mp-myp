import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mulleryperez.cl'
  const currentDate = new Date().toISOString()

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
    // M&P Labs Tools
    {
      url: `${baseUrl}/labs/predictor`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/labs/buyer-gen`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/labs/radar-industrias`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Utilidades Hub
    {
      url: `${baseUrl}/utilidades`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Utilidades Tools
    {
      url: `${baseUrl}/utilidades/calculadora-cac`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/utilidades/comparador-web`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/utilidades/generador-funnels`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/utilidades/juega-aprende`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Blog Hub
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Blog Articles
    {
      url: `${baseUrl}/blog/costo-google-ads-chile-2025`,
      lastModified: '2025-01-15',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/optimizar-roas-meta-ads-2025`,
      lastModified: '2025-01-10',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/kpis-marketing-digital-chile`,
      lastModified: '2025-01-05',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/agencia-marketing-digital-santiago-2025`,
      lastModified: '2025-01-15',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/agencia-performance-marketing-las-condes`,
      lastModified: '2025-01-15',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/cuanto-cuesta-agencia-marketing-digital-chile-2025`,
      lastModified: '2025-01-15',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/mejor-agencia-google-ads-santiago-2025`,
      lastModified: '2025-01-15',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
