import CopilotDashboard from './CopilotDashboard'

export const metadata = {
  title: 'Mi Radar — Inteligencia Competitiva | Muller y Perez',
  robots: 'noindex',
}

export default function RadarPage({ params }: { params: { id: string } }) {
  return <CopilotDashboard suscripcionId={params.id} />
}
