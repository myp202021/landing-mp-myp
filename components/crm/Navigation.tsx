'use client'

/**
 * CRM NAVIGATION
 * Barra de navegación simple para el mini-CRM
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  nombre: string
  rol: 'admin' | 'cliente'
}

export default function CRMNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/crm/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Links según rol del usuario
  const links = user?.rol === 'admin'
    ? [
        { href: '/crm/leads', label: 'Dashboard', icon: '📊' },
        { href: '/crm/upload', label: 'Subir Leads', icon: '📤' },
        { href: '/crm/metricas', label: 'Métricas', icon: '📈' },
        { href: '/crm/cargas', label: 'Historial', icon: '📁' },
        { href: '/crm/cotizaciones', label: 'Cotizaciones', icon: '💰' },
        { href: '/crm/clientes', label: 'Clientes', icon: '👥' },
        { href: '/crm/plantillas', label: 'Plantillas', icon: '📋' },
        { href: '/crm/contraseñas', label: 'Contraseñas', icon: '🔑' },
        { href: '/crm/historial-integraciones', label: 'Integraciones', icon: '📜' },
        { href: '/crm/admin', label: 'Admin', icon: '⚙️' },
        { href: '/crm/cambiar-password', label: 'Cambiar Password', icon: '🔐' },
      ]
    : [
        { href: '/crm/cliente/dashboard', label: 'Dashboard', icon: '🏠' },
        { href: '/crm/cliente/cotizaciones', label: 'Cotizaciones', icon: '💰' },
        { href: '/crm/cliente/plantillas', label: 'Plantillas', icon: '📋' },
        { href: '/crm/cliente/historial', label: 'Historial', icon: '📊' },
        { href: '/crm/cliente/respuestas-automaticas', label: 'Respuestas', icon: '✉️' },
        { href: '/crm/upload', label: 'Subir Leads', icon: '📤' },
        { href: '/crm/cargas', label: 'Cargas', icon: '📦' },
        { href: '/crm/cambiar-password', label: 'Cambiar Password', icon: '🔐' },
      ]

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <span className="text-gray-500 text-sm">Cargando...</span>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link
              href={user?.rol === 'admin' ? '/crm/leads' : '/crm/upload'}
              className="text-xl font-bold text-blue-600"
            >
              M&P CRM
            </Link>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {user?.rol === 'admin' ? 'Admin' : 'Cliente'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm text-gray-600">
                {user.nombre || user.email}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 transition font-medium"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
