import CopilotDashboard from './CopilotDashboard'

export const metadata = {
  title: 'M&P Copilot — Dashboard Competitiva | Muller y Perez',
  robots: 'noindex',
}

export default function CopilotPage({ params }: { params: { id: string } }) {
  return <CopilotDashboard suscripcionId={params.id} />
}
