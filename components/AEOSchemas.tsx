/**
 * AEO (Answer Engine Optimization) Schemas Component
 * Inyecta schemas estructurados optimizados para AI search engines
 * ChatGPT, Claude, Perplexity, Gemini, You.com, etc.
 */

import {
  createEnhancedFAQSchema,
  createItemListSchema,
  createHowToSchema,
  createSpeakableSchema,
} from '@/lib/ai-search-optimization'

interface AEOSchemasProps {
  pageType: 'home' | 'service' | 'blog' | 'tool' | 'ranking' | 'guide'
  pageName?: string
  pageUrl?: string
  // Para listicles/rankings
  listItems?: Array<{
    name: string
    description?: string
    url?: string
  }>
  listName?: string
  listDescription?: string
  // Para guías/how-to
  howToSteps?: Array<{
    name: string
    text: string
  }>
  howToName?: string
  howToDescription?: string
}

export default function AEOSchemas({
  pageType,
  pageName,
  pageUrl,
  listItems,
  listName,
  listDescription,
  howToSteps,
  howToName,
  howToDescription,
}: AEOSchemasProps) {
  const schemas: object[] = []

  // FAQ schema para home y páginas de servicio
  if (pageType === 'home' || pageType === 'service') {
    schemas.push(createEnhancedFAQSchema())
  }

  // ItemList schema para rankings y listicles
  if ((pageType === 'ranking' || pageType === 'blog') && listItems && listItems.length > 0) {
    schemas.push(
      createItemListSchema({
        name: listName || pageName || 'Lista',
        description: listDescription || '',
        items: listItems,
      })
    )
  }

  // HowTo schema para guías
  if (pageType === 'guide' && howToSteps && howToSteps.length > 0) {
    schemas.push(
      createHowToSchema({
        name: howToName || pageName || 'Guía',
        description: howToDescription || '',
        steps: howToSteps,
      })
    )
  }

  // Speakable schema para todas las páginas principales
  if (pageName && pageUrl) {
    schemas.push(
      createSpeakableSchema({
        name: pageName,
        url: pageUrl,
        speakableSelectors: ['h1', 'h2', '.speakable', '[data-speakable]'],
      })
    )
  }

  if (schemas.length === 0) return null

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`aeo-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

/**
 * Component for inline speakable content
 * Wrap content that should be read by AI voice assistants
 */
export function SpeakableContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`speakable ${className}`} data-speakable="true">
      {children}
    </div>
  )
}

/**
 * Component for citation-ready stats
 * Format: "Stat: Value (Context)"
 */
export function CitableStat({
  stat,
  value,
  context,
  className = ''
}: {
  stat: string
  value: string
  context?: string
  className?: string
}) {
  return (
    <div className={`citable-stat ${className}`} itemScope itemType="https://schema.org/Observation">
      <span itemProp="name">{stat}</span>:{' '}
      <strong itemProp="value">{value}</strong>
      {context && <span className="text-gray-600" itemProp="description"> ({context})</span>}
    </div>
  )
}
