import CRMNavigation from '@/components/crm/Navigation'

export const metadata = {
  title: 'CRM - Muller y Pérez',
  description: 'Sistema de gestión de leads Meta Ads'
}

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CRMNavigation />
      {children}
    </>
  )
}
