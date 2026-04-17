import ClippingClient from './ClippingClient'

export const metadata = {
  title: 'Radar — Monitoreo de Competencia en Redes Sociales | Muller y Pérez',
  description: 'Recibe cada mañana un email con todo lo que publica tu competencia en Instagram, Facebook y LinkedIn. Análisis con IA, resumen semanal y mensual. Prueba gratis 7 días.',
  alternates: { canonical: 'https://www.mulleryperez.cl/clipping' },
}

export default function ClippingPage() {
  return <ClippingClient />
}
