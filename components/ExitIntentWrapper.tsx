'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

// Cargar el popup de forma dinámica para no afectar el rendimiento inicial
const ExitIntentPopup = dynamic(() => import('./ExitIntentPopup'), {
  ssr: false
})

export default function ExitIntentWrapper() {
  const pathname = usePathname()
  // Área privada de clientes (reportes SEO y GEO): sin popup comercial
  if (pathname === '/clientes' || pathname?.startsWith('/clientes/')) return null
  return <ExitIntentPopup />
}
