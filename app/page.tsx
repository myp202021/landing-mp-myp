/**
 * Home M&P (rediseño nov 2026). Metadata centralizada en /lib/metadata.ts.
 * La versión anterior queda en ./LandingClient.tsx para volver atrás si hace falta.
 */

import { defaultMetadata } from '@/lib/metadata'
import HomeV2 from './HomeV2'

export const metadata = { ...defaultMetadata, alternates: { canonical: '/' } }

export default function LandingPage() {
  return <HomeV2 />
}
