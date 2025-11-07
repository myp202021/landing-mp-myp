'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CRMLayoutProps {
  children: ReactNode
  title?: string
  authenticated?: boolean
  onRefresh?: () => void
}

export default function CRMLayout({ children, title, authenticated = true, onRefresh }: CRMLayoutProps) {
  const pathname = usePathname()

  if (!authenticated) {
    return <>{children}</>
  }

  const navItems = [
    { href: '/crm', label: 'CRM Admin', icon: '🏠' },
    { href: '/crm/cotizaciones', label: 'Cotizaciones', icon: '📄' },
    { href: '/crm/metricas', label: 'Metricas', icon: '📊' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {title || 'CRM Muller y Perez'}
              </h1>
              <p className="text-blue-200 text-sm mt-1">Sistema de Gestion de Clientes</p>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition text-sm font-medium shadow-md"
              >
                Actualizar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 flex items-center gap-2 font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white border-b-2 border-blue-300'
                      : 'text-blue-200 hover:text-white hover:bg-slate-700/50'
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}
