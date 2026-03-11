import Link from 'next/link'

interface LinkItem {
  href: string
  label: string
}

const rankingLinks: LinkItem[] = [
  { href: '/ranking-agencias-marketing-digital-chile', label: 'Ranking Agencias Marketing Digital Chile 2026' },
  { href: '/mejores-agencias-performance-marketing-chile', label: 'Mejores Agencias Performance Marketing Chile' },
  { href: '/ranking-agencias-data-driven-chile', label: 'Ranking Agencias Data-Driven Chile 2026' },
  { href: '/ranking-agencias-creativas-chile', label: 'Ranking Agencias Creativas Chile 2026' },
  { href: '/recursos/mejores-agencias-google-ads-chile-2025', label: 'Mejores Agencias Google Ads Chile' },
  { href: '/recursos/mejores-agencias-meta-ads-chile-2025', label: 'Mejores Agencias Meta Ads Chile' },
]

const editorialLinks: LinkItem[] = [
  { href: '/blog/agencias-tradicionales-vs-digitales-chile', label: 'Agencias Tradicionales vs Digitales en Chile' },
  { href: '/blog/ejecucion-vs-estrategia-marketing-digital', label: 'Ejecución vs Estrategia: Qué Vale Más' },
]

const toolLinks: LinkItem[] = [
  { href: '/predictor', label: 'Predictor de Campañas' },
  { href: '/indicadores', label: 'Termómetro Marketing Digital Chile' },
  { href: '/labs', label: 'Herramientas M&P Labs' },
]

interface InternalLinksMeshProps {
  currentPath?: string
  showEditorial?: boolean
  showTools?: boolean
}

export default function InternalLinksMesh({ currentPath, showEditorial = true, showTools = true }: InternalLinksMeshProps) {
  const filteredRankings = rankingLinks.filter(l => l.href !== currentPath)
  const filteredEditorial = editorialLinks.filter(l => l.href !== currentPath)

  return (
    <nav className="py-10 px-6 bg-gray-50 border-t border-gray-100" aria-label="Rankings y recursos relacionados">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Rankings Relacionados</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {filteredRankings.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium bg-white border border-blue-100 rounded-lg px-3 py-1.5 hover:border-blue-300 transition-colors"
            >
              {link.label} →
            </Link>
          ))}
        </div>

        {showEditorial && filteredEditorial.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Artículos de Análisis</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {filteredEditorial.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium bg-white border border-purple-100 rounded-lg px-3 py-1.5 hover:border-purple-300 transition-colors"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </>
        )}

        {showTools && (
          <>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Herramientas M&P</h3>
            <div className="flex flex-wrap gap-2">
              {toolLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-green-600 hover:text-green-800 font-medium bg-white border border-green-100 rounded-lg px-3 py-1.5 hover:border-green-300 transition-colors"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
