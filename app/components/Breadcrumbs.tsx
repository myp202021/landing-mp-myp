'use client'

/**
 * Componente de Breadcrumbs para SEO y UX
 * Mejora la navegación y ayuda a Google a entender la estructura del sitio
 */

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href: string
}

export default function Breadcrumbs() {
  const pathname = usePathname()

  // No mostrar breadcrumbs en la homepage
  if (!pathname || pathname === '/') return null

  // Generar breadcrumbs desde la URL
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' }
  ]

  // Mapeo de nombres legibles
  const labelMap: Record<string, string> = {
    'labs': 'M&P Labs',
    'utilidades': 'Utilidades',
    'blog': 'Blog',
    'mp-intelligence': 'M&P Intelligence',
    'buyer-gen': 'Buyer Gen',
    'predictor': 'Predictor Google Ads',
    'radar-industrias': 'Radar Industrias',
    'calculadora-cac': 'Calculadora CAC',
    'calculadora-ltv': 'Calculadora LTV',
    'calculadora-roi-roas': 'Calculadora ROI/ROAS',
    'comparador-web': 'Comparador Web',
    'generador-funnels': 'Generador de Funnels',
    'juega-aprende': 'Juega y Aprende',
    'reporte-competencia': 'Reporte Competencia',
    'benchmarks': 'Benchmarks 2025',
    'planes': 'Planes'
  }

  // Construir breadcrumbs
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = labelMap[segment] || segment.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')

    breadcrumbs.push({
      label,
      href: currentPath
    })
  })

  // Schema.org BreadcrumbList para SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `https://www.mulleryperez.cl${crumb.href}`
    }))
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs visuales */}
      <nav
        aria-label="Breadcrumb"
        className="bg-gray-50 border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1

              return (
                <li key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  )}
                  {isLast ? (
                    <span className="text-gray-900 font-semibold" aria-current="page">
                      {index === 0 ? <Home className="w-4 h-4" aria-label={crumb.label} /> : crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                      {index === 0 ? (
                        <Home className="w-4 h-4" aria-label={crumb.label} />
                      ) : (
                        crumb.label
                      )}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
