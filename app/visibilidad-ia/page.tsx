import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import VisibilidadClient from './VisibilidadClient'

export const metadata: Metadata = {
  title: '¿ChatGPT recomienda tu empresa? Pruébalo gratis | M&P',
  description: 'Descubre en un minuto si ChatGPT recomienda a tu empresa cuando un cliente pregunta por tu rubro y a quién nombra en tu lugar. Prueba gratis y planes desde $9.990.',
  alternates: { canonical: '/visibilidad-ia' },
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <VisibilidadClient />
    </>
  )
}
