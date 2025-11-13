'use client'

import { useSimpleAuth } from '@/lib/auth/simple-auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useSimpleAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dar tiempo para que se cargue el usuario desde localStorage
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return

    // Si NO estamos en /crm/login y NO hay usuario, redirigir a login
    if (!isAuthenticated && pathname !== '/crm/login') {
      router.push('/crm/login')
    }

    // Si estamos en /crm/login y ya hay usuario, redirigir al dashboard
    if (isAuthenticated && pathname === '/crm/login') {
      router.push('/crm')
    }
  }, [user, isAuthenticated, loading, router, pathname])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no estamos en login y no hay usuario, mostrar nada (el redirect se hará)
  if (!isAuthenticated && pathname !== '/crm/login') {
    return null
  }

  // Si estamos en login y hay usuario, mostrar nada (el redirect se hará)
  if (isAuthenticated && pathname === '/crm/login') {
    return null
  }

  // Usuario autenticado o estamos en la página de login
  return <>{children}</>
}
