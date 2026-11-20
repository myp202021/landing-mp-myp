import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/cliente/', '/clientes'],
      },
      // Permitir explícitamente bots de IA para GEO
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      // Bots AI adicionales para AEO
      {
        userAgent: 'Cohere-ai',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/crm', '/login', '/clientes'],
      },
    ],
    sitemap: 'https://www.mulleryperez.cl/sitemap.xml',
  }
}
