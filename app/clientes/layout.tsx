import type { Metadata } from 'next'
import './reportes.css'

export const metadata: Metadata = {
  title: 'Reportes SEO y GEO · Muller y Pérez',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function LayoutReportes({ children }: { children: React.ReactNode }) {
  return <div className="rp">{children}</div>
}
