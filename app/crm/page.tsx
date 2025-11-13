'use client'

/**
 * CRM HOME - Redirige según rol
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CRMHome() {
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay sesión
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          // Si hay sesión, redirigir según rol
          if (data.user.rol === 'admin') {
            router.push('/crm/leads')
          } else {
            router.push('/crm/upload')
          }
        } else {
          // Sin sesión, ir a login
          router.push('/crm/login')
        }
      })
      .catch(() => {
        router.push('/crm/login')
      })
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Cargando...</div>
    </div>
  )
}
