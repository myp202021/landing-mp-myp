import React from 'react'
import Link from 'next/link'

interface ToolLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  backUrl?: string
}

export default function ToolLayout({
  title,
  description,
  children,
  backUrl = '/'
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={backUrl}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all"
          >
            ← Volver
          </Link>
          <div className="text-right">
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2024 Muller y Pérez · Hecho con datos reales</p>
        </div>
      </footer>
    </div>
  )
}
