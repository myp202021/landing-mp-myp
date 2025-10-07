'use client'

import ToolLayout from '@/components/ToolLayout'

export default function ToolPage() {
  return (
    <ToolLayout
      title="Herramienta en construcción"
      description="Próximamente disponible"
      backUrl="/labs"
    >
      <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            En construcción
          </h2>
          <p className="text-gray-600 mb-8">
            Esta herramienta estará disponible pronto. Estamos trabajando para traerte la mejor experiencia.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
