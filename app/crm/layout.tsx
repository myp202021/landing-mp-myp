'use client'

import { SimpleAuthProvider } from '@/lib/auth/simple-auth.tsx'

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
