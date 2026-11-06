'use client'

import Link from 'next/link'
import Image from 'next/image'

export const clients = [
  { name: 'BHI Hair Institute', industry: 'Salud Capilar', logo: '/clientes/n/bhi.png', ar: 3.56, url: 'https://bhi.cl/' },
  { name: 'Codify', industry: 'Analítica de Datos', logo: '/clientes/n/codify.png', ar: 3.75 },
  { name: 'Wiseplan', industry: 'Software de RR.HH.', logo: '/clientes/n/wiseplan.png', ar: 2.73 },
  { name: 'Tritec Energy', industry: 'Energía Solar', logo: '/clientes/n/tritec.png', ar: 1.98 },
  { name: 'LabLab', industry: 'Outplacement', logo: '/clientes/n/lablab.png', ar: 1.05 },
  { name: 'Metcorp', industry: 'Construcción con Paneles SIP', logo: '/clientes/n/metcorp.png', ar: 6.08 },
  { name: 'Dezar', industry: 'Rent a Car', logo: '/clientes/n/dezar.png', ar: 6.03 },
  { name: 'Antartic', industry: 'Refrigeración Industrial', logo: '/clientes/n/antartic.png', ar: 3.49 },
  { name: 'Charriot', industry: 'Automotriz', logo: '/clientes/n/charriot.png', ar: 5.93 },
  { name: 'Adimac', industry: 'Maquinaria Industrial', logo: '/clientes/n/adimac.png', ar: 3.65 },
  { name: 'Sistemáticos', industry: 'Protección contra Incendios', logo: '/clientes/n/sistematios.png', ar: 4.19 },
  { name: 'Zero Water', industry: 'Purificación de Agua', logo: '/clientes/n/zero-water.png', ar: 2.83 },
  { name: 'Granarolo', industry: 'Alimentos', logo: '/clientes/n/granarolo.png', ar: 2.37 },
  { name: 'Fundación Pro Acogida', industry: 'ONG', logo: '/clientes/n/pro-acogida.png', ar: 3.4 },
  { name: 'Elitsoft', industry: 'Software', logo: '/clientes/n/elitsoft.png', ar: 3.85 },
  { name: 'invasWMS', industry: 'Logística', logo: '/clientes/n/invaswms.png', ar: 1.89 },
  { name: 'Horizontes Nature Experiences', industry: 'Turismo de Naturaleza', logo: '/clientes/n/horizontes.png', ar: 1.73 },
  { name: 'Merlin Comunicaciones', industry: 'Comunicaciones', logo: '/clientes/n/merlin.png', ar: 2.18, url: 'https://merlincomunicaciones.com/' },
  { name: 'Irurzun', industry: 'Mercado Mayorista', logo: '/clientes/n/irurzun.png', ar: 3.21 },
  { name: 'Tecnoinver', industry: 'Cloud y Hosting', logo: '/clientes/n/tecnoinver.png', ar: 4.67 },
  { name: 'Onewaite', industry: 'Desarrollo Inmobiliario', logo: '/clientes/n/onewaite.png', ar: 6.87 },
  { name: 'Vikö', industry: 'Agua Purificada', logo: '/clientes/n/viko.png', ar: 1.8 },
  { name: 'First Pack', industry: 'Packaging', logo: '/clientes/n/first-pack.png', ar: 2.62 },
  { name: 'Power Energy', industry: 'Iluminación LED', logo: '/clientes/n/power-energy.png', ar: 4.18 },
  { name: 'Buses Hualpén', industry: 'Transporte', logo: '/clientes/n/hualpen.png', ar: 4.02 },
  { name: 'Stocks', industry: 'Propiedades', logo: '/clientes/n/stocks.png', ar: 3.73 },
  { name: 'Vemos tu Auto', industry: 'Automotriz', logo: '/clientes/n/vemos-tu-auto.png', ar: 2.57, url: 'https://vemostuauto.cl/' },
  { name: 'Clínica Mateos López', industry: 'Salud', logo: '/clientes/n/lopez-mateo.png', ar: 2.7 },
  { name: 'Pregiata', industry: 'Retail', logo: '/clientes/n/pregiata.png', ar: 1.1 },
  { name: 'Genera', industry: 'Recursos Humanos', logo: '/clientes/n/genera.png', ar: 4.53 },
  { name: 'JP Procesos', industry: 'Agroindustria', logo: '/clientes/n/jp-procesos.png', ar: 1.84 },
  { name: 'Forcmin', industry: 'Minería', logo: '/clientes/n/logo-forcmin-c.png', ar: 4.61 },
  { name: 'Pineapple Store', industry: 'Accesorios Apple', logo: '/clientes/n/pineapple-store.png', ar: 5.84 },
  { name: 'Byte Store', industry: 'Tecnología Refurbished', logo: '/clientes/n/byte-store.png', ar: 4.78 },
  { name: 'Rilay', industry: 'Inmobiliaria', logo: '/clientes/n/rilay.png', ar: 3.01 },
  { name: 'Fuxion Logistics', industry: 'Logística', logo: '/clientes/n/fuxion-logistics.png', ar: 3.12 },
  { name: 'HL Soluciones', industry: 'SaaS', logo: '/clientes/n/hl-soluciones.png', ar: 2.52 },
  { name: 'ALD Automotora', industry: 'Automotriz', logo: '/clientes/n/ald.png', ar: 1.6 },
  { name: 'Swing', industry: 'Producción de Eventos', logo: '/clientes/n/swing.png', ar: 2.79 },
  { name: 'Atacama Experience', industry: 'Turismo', logo: '/clientes/n/atacama-experience.png', ar: 1.4 },
  { name: 'Homar', industry: 'Importadora', logo: '/clientes/n/homar.png', ar: 2.44 },
  { name: 'Faretto', industry: 'Iluminación', logo: '/clientes/n/faretto.png', ar: 5.44 },
  { name: 'Halterlift', industry: 'Grúas Horquilla', logo: '/clientes/n/halterlift.png', ar: 4.52 },
  { name: 'Premios Increíbles', industry: 'Sorteos Online', logo: '/clientes/n/premios-increibles.png', ar: 1.0 },
  { name: 'CyM Propiedades', industry: 'Corretaje Inmobiliario', logo: '/clientes/n/cym.png', ar: 1.73 },
  { name: 'INACAP', industry: 'Educación Continua', logo: '/clientes/n/inacap.png', ar: 6.07 },
  { name: 'DevuelveMiPie', industry: 'Legal Inmobiliario', logo: '/clientes/n/dmp.png', ar: 3.77 },
  { name: 'SGO', industry: 'Libro de Obras Digital', logo: '/clientes/n/sgo.png', ar: 0.8 },
  { name: 'Voxa', industry: 'Tecnología', logo: '/clientes/n/voxa.png', ar: 1.12 },
]



/** Tamaño de despliegue con peso visual parejo: logos anchos más bajos, cuadrados más altos. */
export function logoSize(ar: number, maxH = 44, maxW = 136) {
  const area = maxH * maxH * 2.2
  let h = Math.min(maxH, Math.sqrt(area / ar))
  let w = h * ar
  if (w > maxW) { w = maxW; h = w / ar }
  return { width: Math.round(w), height: Math.round(h) }
}

const row1 = clients.slice(0, 25)
const row2 = clients.slice(25)

function ClientCard({ client }: { client: typeof clients[0] }) {
  return (
    <div
      className="flex-shrink-0 w-48 h-24 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center px-5 mx-2"
      title={`${client.name} — ${client.industry}`}
    >
      <Image
        src={client.logo}
        alt={`Logo ${client.name} — cliente de Muller y Pérez`}
        {...logoSize(client.ar, 48, 150)}
        className="object-contain"
        loading="lazy"
      />
    </div>
  )
}

export default function ClientLogos() {
  return (
    <div className="w-full overflow-hidden py-4 relative">
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

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10" />
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
      id="clientes"
      className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
      aria-label="Clientes de Muller y Pérez"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">
            +50 empresas confían en nosotros
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Resultados reales para empresas reales
          </h2>
          <p className="text-lg text-blue-200/80 max-w-2xl mx-auto">
            Desde startups hasta empresas con operaciones internacionales, gestionamos performance marketing con datos y transparencia total
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
          <a
            href="#portfolio"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Ver nuestro portfolio de trabajos ↓
          </a>
          <Link
            href="/mejores-agencias-marketing-digital-chile"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Ranking Agencias Marketing Digital Chile 2026 →
          </Link>
          <Link
            href="/mejores-agencias-performance-marketing-chile"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Mejores Agencias Performance Marketing →
          </Link>
          <Link
            href="/casos-de-exito"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Casos de Éxito con Datos Reales →
          </Link>
        </div>
        <p className="text-center mt-4 text-blue-300/50 text-xs">
          Clientes activos con gestión mensual continua
        </p>
      </div>
    </section>
  )
}
