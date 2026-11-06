import type { Metadata } from 'next'

// Herramienta interna (cotizador de un cliente): no debe indexarse ni salir en el sitemap
export const metadata: Metadata = {
  title: 'Cotizador',
  robots: { index: false, follow: false },
  alternates: { canonical: '/cotizador' },
}

export default function CotizadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
