'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Category = 'all' | 'eventos' | 'tech' | 'industria' | 'inmobiliaria' | 'retail'

interface Piece {
  src: string
  client: string
  category: Category
  type: 'post' | 'reel'
}

const pieces: Piece[] = [
  // Reels destacados primero
  { src: 'reel-swing-6.mp4', client: 'Swing — Il Volo Aftermovie', category: 'eventos', type: 'reel' },
  { src: 'reel-halterlift-1.mp4', client: 'Halterlift — Grúas Eléctricas', category: 'industria', type: 'reel' },
  { src: 'reel-mint-1.mp4', client: 'MINT — Kuina Streaming', category: 'eventos', type: 'reel' },
  // Posts top
  { src: 'swing-55.jpg', client: 'Swing Producciones', category: 'eventos', type: 'post' },
  { src: 'genera-grilla-ig-2.jpg', client: 'Genera — RR.HH.', category: 'tech', type: 'post' },
  { src: 'halterlift-propuesta-1.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'rilay-grilla-1.jpg', client: 'Rilay Inmobiliaria', category: 'inmobiliaria', type: 'post' },
  { src: 'pregiata-14.jpg', client: 'Pregiata — Mobiliario', category: 'retail', type: 'post' },
  { src: 'mint-copia-de-kuina.jpg', client: 'MINT — Plataforma', category: 'eventos', type: 'post' },
  { src: 'tecnoinver-alta-disponibilidad-servidores-vps.jpg', client: 'Tecnoinver — Cloud', category: 'tech', type: 'post' },
  { src: 'power-energy-147.jpg', client: 'Power Energy — LED', category: 'industria', type: 'post' },
  { src: 'fuxion-11.jpg', client: 'Fuxion Logistics', category: 'industria', type: 'post' },
]

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'Todo' },
  { key: 'eventos', label: 'Eventos' },
  { key: 'tech', label: 'Tech' },
  { key: 'industria', label: 'Industria' },
  { key: 'inmobiliaria', label: 'Inmobiliaria' },
  { key: 'retail', label: 'Retail' },
]

function posterFor(src: string) {
  return `/brochure/${src.replace('.mp4', '-poster.jpg')}`
}

export default function PortfolioBrochure() {
  const [cat, setCat] = useState<Category>('all')
  const [lightbox, setLightbox] = useState<Piece | null>(null)

  const filtered = cat === 'all' ? pieces : pieces.filter((p) => p.category === cat)

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center cursor-pointer backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all text-xl z-10"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>
          <div className="absolute top-6 left-6 bg-white/10 backdrop-blur rounded-full px-4 py-2 z-10">
            <span className="text-sm font-medium text-white">{lightbox.client}</span>
          </div>
          {lightbox.type === 'reel' ? (
            <video
              src={`/brochure/${lightbox.src}`}
              className="max-w-[90vw] max-h-[85vh] rounded-2xl"
              autoPlay loop muted playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Image
              src={`/brochure/${lightbox.src}`}
              alt={lightbox.client}
              width={1200} height={1500}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}

      <section
        id="portfolio"
        className="py-20 px-6 bg-[#050510] relative overflow-hidden"
        aria-label="Portfolio creativo"
      >
        {/* Ambient glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.06] blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/[0.06] blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">
              Más que performance
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Publicistas, diseñadores y filmmakers
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              No solo medimos. Creamos. Posts, reels, aftermovies y campañas completas para más de 20 marcas.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  cat === c.key
                    ? 'bg-white text-black'
                    : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12] hover:text-white/70'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((piece, i) => (
              <div
                key={`${piece.src}-${i}`}
                className="break-inside-avoid group cursor-pointer relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.15] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5"
                onClick={() => setLightbox(piece)}
              >
                {piece.type === 'reel' ? (
                  <div className="relative aspect-[9/16]">
                    <video
                      src={`/brochure/${piece.src}`}
                      poster={posterFor(piece.src)}
                      className="w-full h-full object-cover"
                      muted loop playsInline
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
                    />
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19"/></svg>
                      <span className="text-[10px] font-semibold tracking-wide uppercase text-white">Reel</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-0 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19"/></svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={`/brochure/${piece.src}`}
                    alt={`${piece.client} — Muller y Pérez`}
                    width={600} height={750}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                    sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                  <div className="bg-black/40 backdrop-blur-md rounded-lg px-3 py-2 w-full">
                    <p className="text-xs font-semibold text-white">{piece.client}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/brochure"
              className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur text-white font-semibold px-8 py-3.5 rounded-full border border-white/[0.1] transition-all duration-200 hover:shadow-lg hover:shadow-white/5"
            >
              Ver brochure completo — +150 piezas
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
