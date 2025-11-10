'use client'

import { SimpleAuthProvider } from '@/lib/auth/simple-auth'

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
