'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const portfolioItems = [
  {
    src: '/portfolio/marco-antonio-solis.png',
    alt: 'Diseño campaña digital Marco Antonio Solís Tour Gratitud 2026 - Muller y Pérez agencia de marketing digital Chile',
    client: 'Swing Producciones',
    type: 'Campaña de evento',
    description: 'Marco Antonio Solís · Tour Gratitud 2026 · Movistar Arena',
    category: 'Eventos',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/kuina-mint.png',
    alt: 'Diseño lanzamiento plataforma MINT streaming música en vivo Kuina - Muller y Pérez agencia marketing Chile',
    client: 'MINT',
    type: 'Lanzamiento de plataforma',
    description: 'Kuina · Plataforma de streaming en vivo',
    category: 'Tecnología',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/il-volo-monticello.png',
    alt: 'Diseño anuncio Il Volo Gran Arena Monticello 2026 - Muller y Pérez performance marketing Chile',
    client: 'Swing Producciones',
    type: 'Campaña de evento',
    description: 'Il Volo · Gran Arena Monticello',
    category: 'Eventos',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/genera-asistencia.png',
    alt: 'Diseño campaña SaaS Genera control de asistencia software RRHH - Muller y Pérez agencia marketing digital',
    client: 'Genera',
    type: 'Campaña SaaS B2B',
    description: 'Control de asistencia · Software integral',
    category: 'Tecnología',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/zero-water.png',
    alt: 'Diseño producto Zero Water purificador de agua premium Chile - Muller y Pérez marketing digital',
    client: 'Zero Water',
    type: 'Campaña de producto',
    description: 'Purificador de agua premium',
    category: 'Producto',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/rilay-puerto-varas.png',
    alt: 'Diseño campaña inmobiliaria Rilay Puerto Varas construcción de casas - Muller y Pérez agencia Chile',
    client: 'Rilay Inmobiliaria',
    type: 'Campaña inmobiliaria',
    description: 'Construye tu casa ideal en Puerto Varas',
    category: 'Inmobiliaria',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/pineapple-airpods.png',
    alt: 'Diseño anuncio AirPods Pro 3 PineApple Store distribuidor autorizado Apple Chile - Muller y Pérez',
    client: 'PineApple Store',
    type: 'Campaña de producto',
    description: 'AirPods Pro 3 · Distribuidor autorizado',
    category: 'Producto',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/forcmin-soldadora.png',
    alt: 'Diseño campaña Forcmin Mining Solution soldadora extrusión LEISTER minería Chile - Muller y Pérez',
    client: 'Forcmin Mining',
    type: 'Campaña industrial',
    description: 'Soldadora de extrusión LEISTER',
    category: 'Industria',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/tecnomat-siding.png',
    alt: 'Diseño campaña Tecnomat siding PVC revestimiento construcción Chile - Muller y Pérez marketing digital',
    client: 'Tecnomat',
    type: 'Campaña de producto',
    description: 'Siding PVC · Revestimiento duradero',
    category: 'Industria',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/jp-procesos.png',
    alt: 'Diseño campaña JP Procesos agroindustria respaldo operativo Chile - Muller y Pérez agencia performance',
    client: 'JP Procesos',
    type: 'Campaña B2B',
    description: 'Agroindustria · Respaldo operativo',
    category: 'Industria',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/mocedades.png',
    alt: 'Diseño anuncio Mocedades Teatro Nescafé de las Artes 2026 - Muller y Pérez agencia marketing Chile',
    client: 'Swing Producciones',
    type: 'Campaña de evento',
    description: 'Mocedades · Teatro Nescafé de las Artes',
    category: 'Eventos',
    width: 800,
    height: 1000,
  },
  {
    src: '/portfolio/zero-water-botella.png',
    alt: 'Diseño lanzamiento nueva botella Zero Water agua purificada premium Chile - Muller y Pérez',
    client: 'Zero Water',
    type: 'Lanzamiento de producto',
    description: 'Nueva botella premium',
    category: 'Producto',
    width: 800,
    height: 1000,
  },
]

const categories = ['Todos', 'Eventos', 'Tecnología', 'Producto', 'Inmobiliaria', 'Industria']

export default function PortfolioGrid() {
  const [filter, setFilter] = useState('Todos')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const filtered = filter === 'Todos' ? portfolioItems : portfolioItems.filter(p => p.category === filter)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Portfolio de trabajos - Muller y Pérez',
    description: 'Portfolio de diseño, campañas digitales y performance marketing para más de 20 industrias en Chile. Eventos, tecnología, inmobiliaria, producto e industria.',
    url: 'https://www.mulleryperez.cl/#portfolio',
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: portfolioItems.length,
      itemListElement: portfolioItems.map((item, i) => ({
        '@type': 'CreativeWork',
        position: i + 1,
        name: `${item.description} — ${item.client}`,
        description: item.alt,
        creator: { '@type': 'Organization', name: 'Muller y Pérez' },
        image: `https://www.mulleryperez.cl${item.src}`,
        genre: item.category,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white text-3xl font-light"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >
            &times;
          </button>
          <Image
            src={lightbox}
            alt="Portfolio Muller y Pérez"
            width={1080}
            height={1350}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}

      <section
        id="portfolio"
        className="py-20 px-6 bg-gradient-to-b from-slate-900 via-[#0A0A14] to-slate-900"
        aria-label="Portfolio de trabajos de Muller y Pérez"
      >
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-10">
            <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">
              Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Portfolio de marketing digital y diseño en Chile
            </h2>
            <p className="text-lg text-blue-200/70 max-w-2xl mx-auto mb-4">
              Diseño de campañas, anuncios y contenido para más de 20 industrias. Cada pieza está pensada para convertir, no solo para verse bien.
            </p>
            <p className="text-sm text-blue-200/40 max-w-3xl mx-auto leading-relaxed">
              Campañas para eventos masivos como Marco Antonio Solís e Il Volo, plataformas SaaS como Genera, productos premium como Zero Water y PineApple Store, inmobiliarias como Rilay, soluciones industriales para Forcmin Mining y Tecnomat, y agroindustria con JP Procesos. Diseño y performance marketing medible para empresas en Chile y Latinoamérica.
            </p>
          </header>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((item, i) => (
              <div
                key={`${item.src}-${i}`}
                className="group relative rounded-xl overflow-hidden cursor-pointer bg-[#0A0A14] hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 hover:-translate-y-1"
                onClick={() => setLightbox(item.src)}
                style={{ aspectRatio: '4/5' }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  title={`${item.client} — ${item.description} | Muller y Pérez`}
                  width={item.width}
                  height={item.height}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-bold text-sm">{item.client}</p>
                  <p className="text-white/60 text-xs mt-0.5">{item.type}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/casos-de-exito"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors text-sm"
            >
              Ver nuestros casos de éxito con datos reales →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
