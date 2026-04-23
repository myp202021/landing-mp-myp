import { redirect } from 'next/navigation'

export const metadata = {
  title: 'M&P Copilot — Dashboard | Muller y Perez',
  robots: 'noindex',
}

export default function CopilotDashboardIndex() {
  redirect('/copilot')
}
