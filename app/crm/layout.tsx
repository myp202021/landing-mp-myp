'use client'

import { SimpleAuthProvider } from '@/lib/auth/simple-auth'

// Forzar renderizado dinámico para todas las páginas CRM
export const dynamic = 'force-dynamic'

export default function CRMRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SimpleAuthProvider>
      {children}
    </SimpleAuthProvider>
  )
}
