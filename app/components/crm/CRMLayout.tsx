'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSimpleAuth } from '@/lib/auth/simple-auth'
import AuthGuard from './AuthGuard'

interface CRMLayoutProps {
  children: ReactNode
  title?: string
  authenticated?: boolean
  onRefresh?: () => void
}

export default function CRMLayout({ children, title, authenticated = true, onRefresh }: CRMLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useSimpleAuth()

  if (!authenticated) {
    return <>{children}</>
  }

  // Filtrar navegación según rol
  const isAdmin = user?.role === 'admin'

  const allNavItems = [
    { href: '/crm', label: 'CRM Admin', icon: '🏠', adminOnly: true },
    { href: '/crm/clientes', label: 'Clientes', icon: '👥', adminOnly: true },
    { href: '/crm/integraciones', label: 'Integraciones', icon: '🔌', adminOnly: true },
    { href: '/crm/grillas', label: 'Grillas', icon: '📅', adminOnly: true },
    { href: '/crm/cliente/dashboard', label: 'Dashboard', icon: '🏠', adminOnly: false },
    { href: '/crm/cliente/cotizaciones', label: 'Cotizaciones', icon: '📄', adminOnly: false },
    { href: '/crm/cliente/analitica', label: 'Analítica', icon: '📈', adminOnly: false },
    { href: '/crm/cliente/chatbot', label: 'ChatBot', icon: '🤖', adminOnly: false },
    { href: '/crm/cliente/grillas', label: 'Grillas', icon: '📅', adminOnly: false },
  ]

  const navItems = allNavItems.filter(item => isAdmin ? item.adminOnly : !item.adminOnly)

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout()
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-3xl font-bold text-white truncate">
                  {title || 'CRM Muller & Pérez'}
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm mt-1 truncate">
                  Sistema de Gestión de Clientes {user && `· ${user.nombre}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {onRefresh && (
                  <button
                    onClick={onRefresh}
                    className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition text-xs sm:text-sm font-semibold shadow-lg"
                  >
                    🔄 <span className="hidden sm:inline">Actualizar</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs sm:text-sm font-semibold shadow-lg"
                >
                  🚪 <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Navigation */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-0 sm:px-6">
          <nav className="flex overflow-x-auto scrollbar-hide -mb-px">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 border-blue-600'
                      : 'text-gray-600 hover:text-blue-900 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {children}
        </div>
      </div>
    </AuthGuard>
  )
}
