'use client'

/**
 * CRM NAVIGATION
 * Barra de navegación simple para el mini-CRM
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CRMNavigation() {
  const pathname = usePathname()

  const links = [
    { href: '/crm/leads', label: 'Dashboard', icon: '📊' },
    { href: '/crm/upload', label: 'Subir Leads', icon: '📤' },
    { href: '/crm/cargas', label: 'Historial', icon: '📁' },
    { href: '/crm/admin', label: 'Admin', icon: '👥' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href="/crm/leads" className="text-xl font-bold text-blue-600">
              M&P CRM
            </Link>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Beta</span>
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

          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </nav>
  )
}
