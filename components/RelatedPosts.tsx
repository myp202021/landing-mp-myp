'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RelatedPost {
  slug: string
  title: string
  category: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
  title?: string
}

export default function RelatedPosts({ posts, title = "Artículos Relacionados" }: RelatedPostsProps) {
  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all"
          >
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">
              {post.category}
            </span>
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
              {post.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">
              Leer más <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Pre-defined related post groups for easy reuse
export const relatedPostGroups = {
  googleAds: [
    { slug: 'costo-google-ads-chile-2025', title: 'Costo Real de Google Ads en Chile 2025', category: 'Google Ads' },
    { slug: 'como-aumentar-conversiones-google-ads', title: 'Cómo Aumentar Conversiones en Google Ads', category: 'Google Ads' },
    { slug: 'campanas-performance-max-google-ads-2025', title: 'Campañas Performance Max 2025', category: 'Google Ads' },
  ],
  metaAds: [
    { slug: 'optimizar-roas-meta-ads-2025', title: 'Optimizar ROAS en Meta Ads 2025', category: 'Meta Ads' },
    { slug: 'estrategia-meta-ads-ecommerce-chile', title: 'Estrategia Meta Ads para Ecommerce', category: 'Meta Ads' },
    { slug: 'google-ads-vs-meta-ads-cual-elegir-chile-2025', title: 'Google Ads vs Meta Ads: Cuál Elegir', category: 'Comparativa' },
  ],
  presupuesto: [
    { slug: 'presupuesto-marketing-digital-chile-2025', title: 'Cómo Planificar tu Presupuesto 2025', category: 'Presupuesto' },
    { slug: 'cuanto-invertir-publicidad-digital-chile-2025', title: 'Cuánto Invertir en Publicidad Digital', category: 'Inversión' },
    { slug: 'publicidad-digital-chile-2025-costos-industria-region', title: 'Costos por Industria y Región', category: 'Benchmark' },
  ],
  metricas: [
    { slug: 'que-es-cac-como-calcularlo-reducirlo', title: 'Qué es CAC y Cómo Reducirlo', category: 'Métricas' },
    { slug: 'roi-roas-agencia-marketing-digital-chile-2025', title: 'ROI vs ROAS: Guía Completa', category: 'Métricas' },
    { slug: 'kpis-marketing-digital-chile', title: 'KPIs de Marketing Digital', category: 'Métricas' },
  ],
  seo: [
    { slug: 'seo-ia-agencia-marketing-digital-chile-2025', title: 'SEO + IA en Chile 2025', category: 'SEO' },
    { slug: 'google-ads-vs-seo-chile-2025', title: 'Google Ads vs SEO: Cuál Elegir', category: 'Comparativa' },
    { slug: 'tendencias-busqueda-marketing-digital-chile-2025', title: 'Tendencias de Búsqueda 2025', category: 'SEO' },
  ],
  ecommerce: [
    { slug: 'marketing-retail-ecommerce-agencia-marketing-digital-chile-2025', title: 'Marketing para Retail y Ecommerce', category: 'Industria' },
    { slug: 'estrategia-meta-ads-ecommerce-chile', title: 'Meta Ads para Ecommerce', category: 'Meta Ads' },
    { slug: 'optimizar-roas-meta-ads-2025', title: 'Optimizar ROAS en Ecommerce', category: 'Performance' },
  ],
  b2b: [
    { slug: 'marketing-b2b-agencia-marketing-digital-chile-2025', title: 'Marketing B2B en Chile 2025', category: 'Industria' },
    { slug: 'linkedin-ads-b2b-chile-2025', title: 'LinkedIn Ads para B2B', category: 'LinkedIn' },
    { slug: 'que-es-cac-como-calcularlo-reducirlo', title: 'CAC en B2B: Cómo Optimizarlo', category: 'Métricas' },
  ],
  saas: [
    { slug: 'marketing-saas-agencia-marketing-digital-chile-2025', title: 'Marketing para SaaS en Chile', category: 'Industria' },
    { slug: 'linkedin-ads-b2b-chile-2025', title: 'LinkedIn Ads para SaaS', category: 'LinkedIn' },
    { slug: 'inbound-marketing-agencia-marketing-digital-chile-2025', title: 'Inbound Marketing para SaaS', category: 'Inbound' },
  ],
}

// Service links component for industry pages
interface ServiceLink {
  href: string
  title: string
  description: string
}

export function RelatedServices({ services }: { services: ServiceLink[] }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Servicios Relacionados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group block bg-white hover:bg-blue-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
              <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">
                Ver servicio <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export const serviceLinks = {
  ecommerce: [
    { href: '/servicios/google-ads-chile', title: 'Google Shopping', description: 'Campañas de Shopping para tu catálogo de productos' },
    { href: '/servicios/meta-ads-chile', title: 'Meta Ads', description: 'Facebook e Instagram Ads para ecommerce' },
    { href: '/servicios/performance-marketing', title: 'Performance Marketing', description: 'Estrategia integral para maximizar ventas' },
  ],
  b2b: [
    { href: '/servicios/google-ads-chile', title: 'Google Ads', description: 'Campañas de búsqueda para leads B2B' },
    { href: '/servicios/meta-ads-chile', title: 'LinkedIn Ads', description: 'Targeting por cargo e industria' },
    { href: '/servicios/seo-chile', title: 'SEO B2B', description: 'Posicionamiento para palabras clave de alta intención' },
  ],
  saas: [
    { href: '/servicios/google-ads-chile', title: 'Google Ads', description: 'Captura demanda de software específico' },
    { href: '/servicios/meta-ads-chile', title: 'Meta Ads', description: 'Awareness y remarketing para SaaS' },
    { href: '/servicios/performance-marketing', title: 'Performance', description: 'Optimización de CAC y LTV' },
  ],
}
