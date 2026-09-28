/**
 * M&P Landing Page v3 - Server Component with Metadata
 * Landing de alta conversión - Performance Marketing con datos reales
 * SEO Optimizado - Nivel Mundial
 */

import { defaultMetadata } from '@/lib/metadata'
import LandingClient from './LandingClient'

// Usa el metadata centralizado de /lib/metadata.ts
// Incluye: 55+ keywords, og:image JPG, Schema.org completo
export const metadata = { ...defaultMetadata, alternates: { canonical: '/' } }

export default function LandingPage() {
  return <LandingClient />
}
