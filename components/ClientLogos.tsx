'use client'

import Link from 'next/link'
import Image from 'next/image'

const clients = [
  { name: 'Dezar', industry: 'Rent a Car', logo: '/clientes/dezar.png' },
  { name: 'Antartic', industry: 'Refrigeración Industrial', logo: '/clientes/antartic.png' },
  { name: 'Charriot', industry: 'Automotriz', logo: '/clientes/charriot.png' },
  { name: 'Adimac', industry: 'Maquinaria Industrial', logo: '/clientes/adimac.png' },
  { name: 'Sistemáticos', industry: 'Protección contra Incendios', logo: '/clientes/sistematios.png' },
  { name: 'Zero Water', industry: 'Purificación de Agua', logo: '/clientes/zero-water.png' },
  { name: 'Granarolo', industry: 'Alimentos', logo: '/clientes/granarolo.png' },
  { name: 'Fundación Pro Acogida', industry: 'ONG', logo: '/clientes/pro-acogida.png' },
  { name: 'Elitsoft', industry: 'Software', logo: '/clientes/elitsoft.png' },
  { name: 'invasWMS', industry: 'Logística', logo: '/clientes/invaswms.png' },
  { name: 'First Pack', industry: 'Packaging', logo: '/clientes/first-pack.png' },
  { name: 'Power Energy', industry: 'Iluminación LED', logo: '/clientes/power-energy.png' },
  { name: 'Buses Hualpén', industry: 'Transporte', logo: '/clientes/hualpen.png' },
  { name: 'Stocks', industry: 'Propiedades', logo: '/clientes/stocks.png' },
  { name: 'Vemos tu Auto', industry: 'Automotriz', logo: '/clientes/vemos-tu-auto.png', url: 'https://vemostuauto.cl/' },
  { name: 'Clínica Mateos López', industry: 'Salud', logo: '/clientes/lopez-mateo.png' },
  { name: 'Pregiata', industry: 'Retail', logo: '/clientes/pregiata.png' },
  { name: 'Genera', industry: 'Recursos Humanos', logo: '/clientes/genera.png' },
  { name: 'JP Procesos', industry: 'Agroindustria', logo: '/clientes/jp-procesos.png' },
  { name: 'Tecnomat', industry: 'Construcción', logo: '/clientes/tecnomat.png' },
  { name: 'Forcmin', industry: 'Minería', logo: '/clientes/logo-forcmin-c.png' },
  { name: 'Distec', industry: 'Distribución Tecnológica', logo: '/clientes/distec.png' },
  { name: 'Pineapple Store', industry: 'Accesorios Apple', logo: '/clientes/pineapple-store.png' },
  { name: 'Byte Store', industry: 'Tecnología Refurbished', logo: '/clientes/byte-store.png' },
  { name: 'Rilay', industry: 'Inmobiliaria', logo: '/clientes/rilay.png' },
  { name: 'Fuxion Logistics', industry: 'Logística', logo: '/clientes/fuxion-logistics.png' },
  { name: 'HL Soluciones', industry: 'SaaS', logo: '/clientes/hl-soluciones.png' },
  { name: 'ALD Automotora', industry: 'Automotriz', logo: '/clientes/ald.png' },
  { name: 'Swing', industry: 'Producción de Eventos', logo: '/clientes/swing.png' },
  { name: 'Atacama Experience', industry: 'Turismo', logo: '/clientes/atacama-experience.png' },
  { name: 'Budnik', industry: 'Propiedades', logo: '/clientes/budnik.png' },
  { name: 'Homar', industry: 'Importadora', logo: '/clientes/homar.png' },
  { name: 'Faretto', industry: 'Iluminación', logo: '/clientes/faretto.png' },
]

const row1 = clients.slice(0, 17)
const row2 = clients.slice(17)

function ClientCard({ client }: { client: typeof clients[0] }) {
  return (
    <div
      className="flex-shrink-0 w-48 h-24 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex items-center justify-center px-5 mx-2 group"
      title={`${client.name} — ${client.industry}`}
    >
      <Image
        src={client.logo}
        alt={`Logo ${client.name} — cliente de Muller y Pérez`}
        width={160}
        height={64}
        className="object-contain max-h-14 w-auto grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
      />
    </div>
  )
}

export default function ClientLogos() {
  return (
    <div className="w-full overflow-hidden py-6 relative">
      <div className="text-center mb-6">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          +50 empresas confían en nosotros
        </p>
      </div>

      {/* Fila 1 — izquierda */}
      <div className="relative overflow-hidden mb-3">
        <div className="flex animate-scroll-left">
          {[...row1, ...row1].map((client, i) => (
            <ClientCard key={`r1-${i}`} client={client} />
          ))}
        </div>
      </div>

      {/* Fila 2 — derecha */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-right">
          {[...row2, ...row2].map((client, i) => (
            <ClientCard key={`r2-${i}`} client={client} />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />
    </div>
  )
}

export function ClientLogosGrid() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl',
    description: 'Agencia de Performance Marketing en Chile con más de 50 clientes activos en diversas industrias',
    knowsAbout: ['Performance Marketing', 'Google Ads', 'Meta Ads', 'Marketing Digital Chile'],
    member: clients.map(c => ({
      '@type': 'Organization',
      name: c.name,
      description: `Cliente de Muller y Pérez en el sector ${c.industry}`,
      ...(c.url ? { url: c.url } : {})
    }))
  }

  return (
    <section
      className="py-16 px-6 bg-gray-50 border-t border-gray-100"
      aria-label="Clientes de Muller y Pérez"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Confían en Nosotros
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            +50 empresas gestionan su performance marketing con el modelo M&P: estrategia, datos y resultados medibles cada mes
          </p>
        </header>

        <ClientLogos />

        <ul className="sr-only" role="list" aria-label="Lista completa de clientes de Muller y Pérez">
          {clients.map((client) => (
            <li key={client.name}>
              {client.name} — {client.industry}
              {client.url && <a href={client.url}>{client.url}</a>}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap justify-center gap-4 mt-10 text-sm">
          <Link
            href="/ranking-agencias-marketing-digital-chile"
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Ranking Agencias Marketing Digital Chile 2026 →
          </Link>
          <Link
            href="/mejores-agencias-performance-marketing-chile"
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Mejores Agencias Performance Marketing →
          </Link>
        </div>
        <p className="text-center mt-4 text-gray-400 text-xs">
          Clientes activos con gestión mensual continua
        </p>
      </div>
    </section>
  )
}
