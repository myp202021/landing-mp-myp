import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/', '/cliente/'],
      },
      // Permitir explícitamente bots de IA para GEO
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      // Bots AI adicionales para AEO
      {
        userAgent: 'Cohere-ai',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/equipo/'],
      },
    ],
    sitemap: 'https://www.mulleryperez.cl/sitemap.xml',
  }
}
