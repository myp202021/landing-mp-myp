import { AuthProvider } from '@/lib/auth/supabase-auth'

export const metadata = {
  title: 'CRM - Muller & Pérez',
  description: 'Sistema de gestión de clientes y leads',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  }
}

export default function CRMRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
