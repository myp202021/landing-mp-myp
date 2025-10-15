/**
 * PÁGINA INTERNA DE ESTADÍSTICAS - M&P INTELLIGENCE
 *
 * IMPORTANTE: Esta página es solo para uso interno.
 * NO debe ser enlazada desde ninguna parte pública del sitio.
 *
 * Acceso: /labs/mp-intelligence/internal-stats
 */

import InternalStatsClient from './InternalStatsClient'

export const metadata = {
  title: 'Stats Internas - M&P Intelligence',
  robots: {
    index: false,
    follow: false,
  }
}

export default function InternalStatsPage() {
  return <InternalStatsClient />
}
