'use client'

import { useEffect, useRef } from 'react'

// Lista de 48 clientes del PDF comercial M&P 2026
const clients = [
  // Fila 1
  { name: 'DEZAR', industry: 'Automotriz' },
  { name: 'Antartic', industry: 'Refrigeración' },
  { name: 'Le Harriot', industry: 'Hotelería' },
  { name: 'IMESTRE', industry: 'Construcción' },
  { name: 'ADIMAC', industry: 'Maquinaria' },
  { name: "O'HIGGINS", industry: 'Herramientas' },
  { name: 'WOO Earplugs', industry: 'Productos' },
  // Fila 2
  { name: 'qiiip', industry: 'Tecnología' },
  { name: 'BOMBAS BRAUN', industry: 'Industrial' },
  { name: 'eLock', industry: 'Seguridad' },
  { name: 'RIOCLARO', industry: 'Minería' },
  { name: 'QUALIS', industry: 'Calidad' },
  { name: 'SAFETECK', industry: 'Seguridad' },
  // Fila 3
  { name: 'Genera', industry: 'SaaS' },
  { name: 'GRANAROLO', industry: 'Alimentos' },
  { name: 'Fundación Proacogida', industry: 'ONG' },
  { name: 'DEKASA', industry: 'Retail' },
  { name: 'ELITSOFT', industry: 'Software' },
  { name: 'VIP Parking', industry: 'Servicios' },
  { name: 'Holdo', industry: 'Fintech' },
  // Fila 4
  { name: 'Corregal', industry: 'Deportes' },
  { name: 'PHERSU', industry: 'Seguros' },
  { name: 'Grupo BT', industry: 'Tecnología' },
  { name: 'CHECK', industry: 'Fintech' },
  { name: 'INVAS', industry: 'Logística' },
  { name: 'ROCCA', industry: 'Construcción' },
  { name: 'Klapp', industry: 'Educación' },
  // Fila 5
  { name: 'FIRST PACK', industry: 'Logística' },
  { name: 'BESTON', industry: 'Muebles' },
  { name: 'Power Energy', industry: 'Iluminación' },
  { name: 'PlusRRHH', industry: 'RRHH' },
  { name: 'ZERO', industry: 'Tecnología' },
  { name: 'Hualpen', industry: 'Transporte' },
  { name: 'INGEWATER', industry: 'Ingeniería' },
  // Fila 6
  { name: 'LIMCHILE', industry: 'Limpieza' },
  { name: 'Sistemáticos', industry: 'Tecnología' },
  { name: 'Evalc', industry: 'Electromovilidad' },
  { name: 'REES', industry: 'Automotriz' },
  { name: 'Medical VIP', industry: 'Salud' },
  { name: 'Cousiño', industry: 'Vinos' },
  // Adicionales vistos en otras páginas del PDF
  { name: 'López Mateo', industry: 'Clínica Dental' },
  { name: 'GN Motors', industry: 'Automotriz' },
  { name: 'Stocks.cl', industry: 'Inmobiliaria' },
  { name: 'Ebox Fulfillment', industry: 'Logística' },
]

export default function ClientLogos() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const speed = 0.5

    const animate = () => {
      scrollPosition += speed
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [])

  // Duplicar para efecto infinito
  const duplicatedClients = [...clients, ...clients]

  return (
    <div className="w-full overflow-hidden py-8">
      <div className="text-center mb-8">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          +45 empresas confían en nosotros
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-hidden whitespace-nowrap"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedClients.map((client, index) => (
          <div
            key={`${client.name}-${index}`}
            className="flex-shrink-0 px-6 py-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-3">
              {/* Placeholder logo - círculo con inicial */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {client.name.charAt(0)}
              </div>
              <div>
                <span className="text-gray-800 font-semibold text-sm block">
                  {client.name}
                </span>
                <span className="text-gray-400 text-xs">
                  {client.industry}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gradientes de fade en los bordes */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
    </div>
  )
}

// Versión estática en grid para secciones que no necesitan animación
export function ClientLogosGrid() {
  return (
    <div className="w-full py-8">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Clientes que Respaldan Nuestro Trabajo
        </h3>
        <p className="text-gray-600">
          +45 empresas de distintas industrias confían en M&P
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {clients.slice(0, 40).map((client) => (
          <div
            key={client.name}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            {/* Placeholder logo */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-50 group-hover:to-purple-50 flex items-center justify-center text-gray-600 group-hover:text-blue-600 font-bold text-xl mb-2 transition-colors">
              {client.name.charAt(0)}
            </div>
            <span className="text-gray-700 font-medium text-xs text-center leading-tight">
              {client.name}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Y más de 5 nuevos clientes cada mes
        </p>
      </div>
    </div>
  )
}
