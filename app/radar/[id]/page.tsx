import RadarDashboard from './RadarDashboard'

export const metadata = {
  title: 'Mi Radar — Inteligencia Competitiva | Muller y Perez',
  robots: 'noindex',
}

export default function RadarPage({ params }: { params: { id: string } }) {
  return <RadarDashboard suscripcionId={params.id} />
}
