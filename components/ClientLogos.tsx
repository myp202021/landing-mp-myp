'use client'

import Link from 'next/link'

// 40 clientes actuales e históricos de M&P
const clients = [
  { name: 'Dezar', industry: 'Rent a Car' },
  { name: 'Antartic', industry: 'Refrigeración Industrial' },
  { name: 'Charriot', industry: 'Automotriz' },
  { name: 'Adimac', industry: 'Maquinaria Industrial' },
  { name: 'Sistemáticos', industry: 'Protección contra Incendios' },
  { name: 'Zero Water', industry: 'Purificación de Agua' },
  { name: 'Granarolo', industry: 'Alimentos' },
  { name: 'Fundación Pro Acogida', industry: 'ONG' },
  { name: 'Elitsoft', industry: 'Software' },
  { name: 'Invas', industry: 'Logística' },
  { name: 'First Pack', industry: 'Packaging' },
  { name: 'Power Energy', industry: 'Iluminación LED' },
  { name: 'Buses Hualpén', industry: 'Transporte' },
  { name: 'Stocks', industry: 'Propiedades' },
  { name: 'Vemos tu Auto', industry: 'Automotriz', url: 'https://vemostuauto.cl/' },
  { name: 'Clínica Mateos López', industry: 'Salud' },
  { name: 'Pregiata', industry: 'Retail' },
  { name: 'Genera HR', industry: 'SaaS' },
  { name: 'JP Procesos Agroindustriales', industry: 'Agroindustria' },
  { name: 'Empresas Tecnomat', industry: 'Construcción' },
  { name: 'Forcmin', industry: 'Minería' },
  { name: 'Distec', industry: 'Distribución Tecnológica' },
  { name: 'Pineapple Store', industry: 'Accesorios Apple' },
  { name: 'Byte Store', industry: 'Tecnología Refurbished' },
  { name: 'Rilay', industry: 'Inmobiliaria' },
  { name: 'Onewaite', industry: 'Inmobiliaria' },
  { name: 'Fuxion Logistics', industry: 'Logística' },
  { name: 'HL Soluciones', industry: 'SaaS' },
  { name: 'ALD Automotora', industry: 'Automotriz' },
  { name: 'Swing Management', industry: 'Producción de Eventos' },
  { name: 'Atacama Experience', industry: 'Turismo' },
  { name: 'Budnik', industry: 'Propiedades' },
  { name: 'Homar', industry: 'Importadora' },
  { name: 'Cobreloa', industry: 'Deportes' },
  { name: 'Imestre', industry: 'Construcción' },
  { name: 'Pacific Mining Parts', industry: 'Minería' },
  { name: 'Klapp', industry: 'Educación' },
  { name: '4life Hipotecaria', industry: 'Finanzas' },
  { name: 'Security Hipotecaria', industry: 'Finanzas' },
  { name: 'Forestal Río Claro', industry: 'Forestal' },
]

const row1 = clients.slice(0, 20)
const row2 = clients.slice(20, 40)

function ClientCard({ client }: { client: typeof clients[0] }) {
  return (
    <div
      className="flex-shrink-0 w-44 h-20 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col items-center justify-center px-4 mx-2 group"
      title={`${client.name} — ${client.industry}`}
    >
      <span className="text-[13px] font-extrabold text-gray-800 group-hover:text-blue-900 text-center leading-tight whitespace-normal tracking-tight transition-colors duration-300">
        {client.name}
      </span>
      <span className="text-[9px] font-medium text-gray-400 group-hover:text-blue-500 uppercase tracking-widest mt-1 transition-colors duration-300">
        {client.industry}
      </span>
    </div>
  )
}

// Carrusel infinito CSS — dos filas, direcciones opuestas
export default function ClientLogos() {
  return (
    <div className="w-full overflow-hidden py-6 relative">
      <div className="text-center mb-6">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          +40 empresas confían en nosotros
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

// Versión grid estática — SEO + JSON-LD
export function ClientLogosGrid() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Muller y Pérez',
    url: 'https://www.mulleryperez.cl',
    description: 'Agencia de Performance Marketing en Chile con más de 40 clientes activos en diversas industrias',
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
            +40 empresas gestionan su performance marketing con el modelo M&P: estrategia, datos y resultados medibles cada mes
          </p>
        </header>

        {/* Carrusel visual */}
        <ClientLogos />

        {/* Grid oculto para SEO — crawlable por bots */}
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
