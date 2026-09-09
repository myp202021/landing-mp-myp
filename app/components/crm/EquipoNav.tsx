'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSimpleAuth } from '@/lib/auth/simple-auth'

const links = [
  { href: '/crm/leads', label: 'Leads' },
  { href: '/crm/grillas', label: 'Grillas' },
  { href: '/crm/prospeccion-2026', label: 'Prospección' },
  { href: '/crm/benchmark', label: 'Benchmark' },
  { href: '/crm/reportes', label: 'Reportes' },
]

export default function EquipoNav() {
  const { user, logout } = useSimpleAuth()
  const pathname = usePathname()

  if (!user || user.role !== 'equipo') return null

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between mb-4">
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-gray-400 mr-3">M&P CRM</span>
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith(l.href)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{user.nombre || ''}</span>
        <button
          onClick={logout}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Salir
        </button>
      </div>
    </nav>
  )
}
