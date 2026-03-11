import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

interface RankingHeroProps {
  title: string
  subtitle: string
  breadcrumbs: Breadcrumb[]
  badge?: string
  fecha?: string
}

export default function RankingHero({ title, subtitle, breadcrumbs, badge, fecha = 'Marzo 2026' }: RankingHeroProps) {
  return (
    <header className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white py-16 md:py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-300">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {badge && (
          <span className="inline-block bg-blue-600/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-blue-500/30">
            {badge}
          </span>
        )}

        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
          <span>Última actualización: {fecha}</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span>Por Muller y Pérez</span>
        </div>
      </div>
    </header>
  )
}
