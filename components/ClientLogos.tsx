'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

// Lista de clientes con logos reales - optimizados para SEO
const clients = [
  { name: 'DEZAR', logo: '/clientes/dezar.png', industry: 'Rent a Car' },
  { name: 'Antartic', logo: '/clientes/antartic.png', industry: 'Refrigeración' },
  { name: 'Charriot', logo: '/clientes/charriot.png', industry: 'Hotelería' },
  { name: 'IMESTRE', logo: '/clientes/imestre.png', industry: 'Construcción' },
  { name: 'ADIMAC', logo: '/clientes/adimac.png', industry: 'Maquinaria' },
  { name: "O'Higgins", logo: '/clientes/ohiggins.png', industry: 'Herramientas' },
  { name: 'qiiip', logo: '/clientes/qiiip.png', industry: 'Tecnología' },
  { name: 'Bombas Braun', logo: '/clientes/bombas-braun.png', industry: 'Industrial' },
  { name: 'eLock', logo: '/clientes/elock.png', industry: 'Seguridad' },
  { name: 'QUALIS', logo: '/clientes/qualis.png', industry: 'Calidad' },
  { name: 'SAFETECK', logo: '/clientes/safeteck.png', industry: 'Seguridad' },
  { name: 'GRANAROLO', logo: '/clientes/granarolo.png', industry: 'Alimentos' },
  { name: 'Fundación Proacogida', logo: '/clientes/fundacion.png', industry: 'ONG' },
  { name: 'DEKASA', logo: '/clientes/dekasa.png', industry: 'Retail' },
  { name: 'ELITSOFT', logo: '/clientes/elitsoft.png', industry: 'Software' },
  { name: 'Holdo', logo: '/clientes/holdo.png', industry: 'Fintech' },
  { name: 'PHERSU', logo: '/clientes/phersu.png', industry: 'Seguros' },
  { name: 'CHECK', logo: '/clientes/check.png', industry: 'Fintech' },
  { name: 'INVAS', logo: '/clientes/invas.png', industry: 'Logística' },
  { name: 'ROCCA', logo: '/clientes/rocca.png', industry: 'Construcción' },
  { name: 'Klapp', logo: '/clientes/klapp.png', industry: 'Educación' },
  { name: 'First Pack', logo: '/clientes/firstpack.png', industry: 'Logística' },
  { name: 'BESTON', logo: '/clientes/beston.png', industry: 'Muebles' },
  { name: 'Power Energy', logo: '/clientes/power-energy.png', industry: 'Iluminación' },
  { name: 'Plus RRHH', logo: '/clientes/plus-rrhh.png', industry: 'RRHH' },
  { name: 'Zero Water', logo: '/clientes/zerowater.png', industry: 'Tecnología' },
  { name: 'LIM Chile', logo: '/clientes/lim.png', industry: 'Limpieza' },
  { name: 'Sistemáticos', logo: '/clientes/sistematicos.png', industry: 'Tecnología' },
  { name: 'Evalc', logo: '/clientes/evalc.png', industry: 'Electromovilidad' },
  { name: 'REES', logo: '/clientes/rees.png', industry: 'Automotriz' },
  { name: 'Praxis', logo: '/clientes/praxis.png', industry: 'Educación' },
  { name: 'Pellet', logo: '/clientes/pellet.png', industry: 'Energía' },
  { name: 'Forestal', logo: '/clientes/forestal.png', industry: 'Forestal' },
  { name: 'Cleaning Pro', logo: '/clientes/cleaning.png', industry: 'Limpieza' },
  { name: 'Bodevir', logo: '/clientes/bodevir.png', industry: 'Vinos' },
  { name: 'El Boletín', logo: '/clientes/boletin.png', industry: 'Medios' },
  { name: 'Ingefire', logo: '/clientes/ingefire.png', industry: 'Seguridad' },
  { name: 'Intranet Corp', logo: '/clientes/intranet-corporativa.png', industry: 'Software' },
  { name: 'LB Consulting', logo: '/clientes/lb.png', industry: 'Consultoría' },
  { name: 'Cobreloa', logo: '/clientes/cobreloa.png', industry: 'Deportes' },
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

  const duplicatedClients = [...clients, ...clients]

  return (
    <div className="w-full overflow-hidden py-8 relative">
      <div className="text-center mb-8">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          +40 empresas confían en nosotros
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-hidden whitespace-nowrap"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedClients.map((client, index) => (
          <div
            key={`${client.name}-${index}`}
            className="flex-shrink-0 w-32 h-20 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-3"
          >
            <Image
              src={client.logo}
              alt={`Logo ${client.name} - Cliente M&P`}
              width={100}
              height={60}
              loading="lazy"
              className="object-contain max-h-14 w-auto grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
    </div>
  )
}

// Versión estática en grid - optimizada para SEO y PageSpeed
export function ClientLogosGrid() {
  return (
    <section
      className="py-16 px-6 bg-gray-50 border-t border-gray-100"
      aria-label="Clientes de Muller y Pérez"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Han Confiado en Nosotros
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Más de 40 empresas de diferentes industrias han elegido M&P para potenciar su marketing digital
          </p>
        </header>

        <ul
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 list-none p-0"
          role="list"
          aria-label="Logos de clientes"
        >
          {clients.map((client) => (
            <li
              key={client.name}
              className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 aspect-square"
              title={`${client.name} - ${client.industry}`}
            >
              <Image
                src={client.logo}
                alt={`Logo de ${client.name}, cliente de Muller y Pérez en ${client.industry}`}
                width={80}
                height={80}
                loading="lazy"
                sizes="(max-width: 640px) 80px, (max-width: 768px) 70px, 80px"
                className="object-contain max-h-16 w-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
            </li>
          ))}
        </ul>

        <p className="text-center mt-10 text-gray-500">
          Y sumamos nuevos clientes cada mes
        </p>
      </div>
    </section>
  )
}
