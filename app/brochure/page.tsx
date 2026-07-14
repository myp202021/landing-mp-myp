import type { Metadata } from 'next'
import BrochureClient from './BrochureClient'

export const metadata: Metadata = {
  title: 'Brochure — Muller y Pérez | Performance Marketing Chile',
  description: 'Portfolio completo: +150 piezas de diseño, reels y campañas digitales para +40 clientes en 15 industrias.',
}

export default function BrochurePage() {
  return <BrochureClient />
}
