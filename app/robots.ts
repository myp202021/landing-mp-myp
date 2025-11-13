import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/crm/'],
    },
    sitemap: 'https://www.mulleryperez.cl/sitemap.xml',
  }
}
