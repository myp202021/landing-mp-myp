'use client'

import { useState } from 'react'
import Image from 'next/image'

type Category = 'all' | 'eventos' | 'tech' | 'industria' | 'inmobiliaria' | 'retail' | 'educacion' | 'transporte' | 'alimentos' | 'variados'
type MediaType = 'all' | 'post' | 'reel'

interface Piece {
  src: string
  client: string
  category: Category
  type: 'post' | 'reel'
}

// Featured reels — the best ones shown as hero
const featuredReels = [
  { src: 'reel-swing-6.mp4', client: 'Swing Producciones', desc: 'Il Volo — Aftermovie' },
  { src: 'reel-swing-1.mp4', client: 'Swing Producciones', desc: 'Pimpinela — Aftermovie' },
  { src: 'reel-swing-4.mp4', client: 'Swing Producciones', desc: 'Concierto — Aftermovie' },
  { src: 'reel-mint-1.mp4', client: 'MINT', desc: 'Kuina — Streaming en vivo' },
  { src: 'reel-halterlift-1.mp4', client: 'Halterlift', desc: 'Grúas eléctricas — Producto' },
  { src: 'reel-power-energy-1.mp4', client: 'Power Energy', desc: 'Iluminación LED' },
  { src: 'reel-rilay-1.mp4', client: 'Rilay', desc: 'Inmobiliaria — Puerto Varas' },
  { src: 'reel-premios-2.mp4', client: 'Premios Increíbles', desc: 'Sorteo en vivo' },
]

// Industry showcase — best piece per industry
const industryShowcase = [
  { label: 'Eventos', img: 'swing-55.jpg', client: 'Swing Producciones' },
  { label: 'Tecnología', img: 'genera-grilla-ig-2.jpg', client: 'Genera' },
  { label: 'Industria', img: 'halterlift-propuesta-1.jpg', client: 'Halterlift' },
  { label: 'Inmobiliaria', img: 'rilay-grilla-1.jpg', client: 'Rilay' },
  { label: 'Retail', img: 'pregiata-14.jpg', client: 'Pregiata' },
  { label: 'Alimentos', img: 'iruzun-06-07.jpg', client: 'Irurzun' },
]

const pieces: Piece[] = [
  // SWING
  { src: 'swing-0.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-01.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-16.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-17.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-19.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-21.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-5-dias.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-55.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-56.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-59.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'swing-65.jpg', client: 'Swing', category: 'eventos', type: 'post' },
  { src: 'reel-swing-1.mp4', client: 'Swing', category: 'eventos', type: 'reel' },
  { src: 'reel-swing-2.mp4', client: 'Swing', category: 'eventos', type: 'reel' },
  { src: 'reel-swing-3.mp4', client: 'Swing', category: 'eventos', type: 'reel' },
  { src: 'reel-swing-4.mp4', client: 'Swing', category: 'eventos', type: 'reel' },
  { src: 'reel-swing-5.mp4', client: 'Swing', category: 'eventos', type: 'reel' },
  { src: 'reel-swing-6.mp4', client: 'Swing', category: 'eventos', type: 'reel' },
  // MINT
  { src: 'mint-03.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-03p.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-copia-de-bryartz.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-copia-de-kuina.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-copia-de-kuroh97.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-of.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'reel-mint-1.mp4', client: 'MINT', category: 'eventos', type: 'reel' },
  { src: 'reel-mint-2.mp4', client: 'MINT', category: 'eventos', type: 'reel' },
  // GENERA
  { src: 'genera-grilla-ig-2.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-grilla-ig-6.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-grilla-ig-19.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-carrusel-mesa-de-trabajo-5.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-carrusel-mesa-de-trabajo-6.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-carrusel-mesa-de-trabajo-7.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-carrusel-mesa-de-trabajo-8.jpg', client: 'Genera', category: 'tech', type: 'post' },
  // TECNOINVER
  { src: 'tecnoinver-alta-disponibilidad-servidores-vps.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-4.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-5.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-6.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-12.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-14.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-15.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'reel-tecnoinver-1.mp4', client: 'Tecnoinver', category: 'tech', type: 'reel' },
  // INVAS
  { src: 'invas-03-07-post-1.jpg', client: 'Invas WMS', category: 'tech', type: 'post' },
  { src: 'invas-10-07.jpg', client: 'Invas WMS', category: 'tech', type: 'post' },
  { src: 'invas-13-07.jpg', client: 'Invas WMS', category: 'tech', type: 'post' },
  // HALTERLIFT
  { src: 'halterlift-propuesta-1.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-2.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-3.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-4.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-5.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-10.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'reel-halterlift-1.mp4', client: 'Halterlift', category: 'industria', type: 'reel' },
  { src: 'reel-halterlift-2.mp4', client: 'Halterlift', category: 'industria', type: 'reel' },
  { src: 'reel-halterlift-3.mp4', client: 'Halterlift', category: 'industria', type: 'reel' },
  // POWER ENERGY
  { src: 'power-energy-147.jpg', client: 'Power Energy', category: 'industria', type: 'post' },
  { src: 'power-energy-77.jpg', client: 'Power Energy', category: 'industria', type: 'post' },
  { src: 'power-energy-78.jpg', client: 'Power Energy', category: 'industria', type: 'post' },
  { src: 'power-energy-81.jpg', client: 'Power Energy', category: 'industria', type: 'post' },
  { src: 'reel-power-energy-1.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  { src: 'reel-power-energy-2.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  { src: 'reel-power-energy-3.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  { src: 'reel-power-energy-4.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  { src: 'reel-power-energy-5.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  // FUXION
  { src: 'fuxion-11.jpg', client: 'Fuxion Logistics', category: 'industria', type: 'post' },
  { src: 'fuxion-12--1-.jpg', client: 'Fuxion Logistics', category: 'industria', type: 'post' },
  { src: 'fuxion-2--1-.jpg', client: 'Fuxion Logistics', category: 'industria', type: 'post' },
  { src: 'fuxion-4--1-.jpg', client: 'Fuxion Logistics', category: 'industria', type: 'post' },
  { src: 'reel-fuxion-1.mp4', client: 'Fuxion Logistics', category: 'industria', type: 'reel' },
  { src: 'reel-fuxion-2.mp4', client: 'Fuxion Logistics', category: 'industria', type: 'reel' },
  // JP PROCESOS
  { src: 'jp-procesos-01-06.jpg', client: 'JP Procesos', category: 'industria', type: 'post' },
  { src: 'jp-procesos-05-06.jpg', client: 'JP Procesos', category: 'industria', type: 'post' },
  { src: 'jp-procesos-08-06.jpg', client: 'JP Procesos', category: 'industria', type: 'post' },
  { src: 'jp-procesos-24-06.jpg', client: 'JP Procesos', category: 'industria', type: 'post' },
  // RILAY
  { src: 'rilay-grilla-1.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'rilay-grilla-4.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'rilay-grilla-8.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'rilay-grilla-11.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'rilay-grilla-16.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'reel-rilay-1.mp4', client: 'Rilay', category: 'inmobiliaria', type: 'reel' },
  { src: 'reel-rilay-2.mp4', client: 'Rilay', category: 'inmobiliaria', type: 'reel' },
  { src: 'reel-rilay-3.mp4', client: 'Rilay', category: 'inmobiliaria', type: 'reel' },
  // 4LIFE
  { src: '4life-01-07.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  { src: '4life-03-07.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  { src: '4life-24-07.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  { src: '4life-carrusel-4.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  { src: '4life-carrusel-5.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  { src: '4life-carrusel-6.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  { src: '4life-carrusel-7.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  { src: '4life-carrusel-8.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  { src: '4life-carrusel-9--1-.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  { src: '4life-carrusel-10.jpg', client: '4Life', category: 'inmobiliaria', type: 'post' },
  // STOCKS
  { src: 'reel-stocks-1.mp4', client: 'Stocks', category: 'inmobiliaria', type: 'reel' },
  { src: 'reel-stocks-2.mp4', client: 'Stocks', category: 'inmobiliaria', type: 'reel' },
  { src: 'reel-stocks-3.mp4', client: 'Stocks', category: 'inmobiliaria', type: 'reel' },
  // PREGIATA
  { src: 'pregiata-11.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'pregiata-13.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'pregiata-14.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'pregiata-24.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'pregiata-27.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'reel-pregiata-1.mp4', client: 'Pregiata', category: 'retail', type: 'reel' },
  { src: 'reel-pregiata-2.mp4', client: 'Pregiata', category: 'retail', type: 'reel' },
  // CIOCCOLATI
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-09-09.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-11-49.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-11-56.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-12-03.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-12-10.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'reel-cioccolati-1.mp4', client: 'Cioccolati', category: 'retail', type: 'reel' },
  // INACAP
  { src: 'variados-inacap-mesa--7-.jpg', client: 'INACAP', category: 'educacion', type: 'post' },
  // HUALPEN
  { src: 'hualpen-96.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'hualpen-97.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'hualpen-98.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'hualpen-105.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'hualpen-corregido02.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'reel-hualpen-1.mp4', client: 'Buses Hualpén', category: 'transporte', type: 'reel' },
  { src: 'reel-hualpen-2.mp4', client: 'Buses Hualpén', category: 'transporte', type: 'reel' },
  // IRUZUN
  { src: 'iruzun-06-07.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  { src: 'iruzun-15-07.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  { src: 'iruzun-27-07.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  { src: 'iruzun-28-07.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  { src: 'iruzun-grilla-irurzun---julio--4-.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  // PREMIOS
  { src: 'reel-premios-1.mp4', client: 'Premios Increíbles', category: 'retail', type: 'reel' },
  { src: 'reel-premios-2.mp4', client: 'Premios Increíbles', category: 'retail', type: 'reel' },
  { src: 'reel-premios-3.mp4', client: 'Premios Increíbles', category: 'retail', type: 'reel' },
  // PINEAPPLE
  { src: 'variados-mesa-pinneapple--2-.jpg', client: 'PineApple Store', category: 'retail', type: 'post' },
  // VARIADOS
  { src: 'variados-1.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-9.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-20.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-22.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-23.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-27.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-28.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-31.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-35.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-38.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-40.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-42.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-50.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-121.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-126.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-203.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-207.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-215.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-218.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-v01-calisto.jpg', client: 'Variados', category: 'variados', type: 'post' },
  { src: 'variados-u--5-.jpg', client: 'Variados', category: 'variados', type: 'post' },
]

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'Todo' },
  { key: 'eventos', label: 'Eventos' },
  { key: 'tech', label: 'Tech & SaaS' },
  { key: 'industria', label: 'Industria' },
  { key: 'inmobiliaria', label: 'Inmobiliaria' },
  { key: 'retail', label: 'Retail' },
  { key: 'transporte', label: 'Transporte' },
  { key: 'alimentos', label: 'Alimentos' },
  { key: 'variados', label: 'Otros' },
]

function posterFor(src: string) {
  return `/brochure/${src.replace('.mp4', '-poster.jpg')}`
}

// Video component with poster thumbnail
function ReelCard({ src, client, onOpen }: { src: string; client: string; onOpen: () => void }) {
  return (
    <div
      className="group cursor-pointer relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.15] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5"
      onClick={onOpen}
    >
      <div className="relative aspect-[9/16]">
        <video
          src={`/brochure/${src}`}
          poster={posterFor(src)}
          className="w-full h-full object-cover"
          muted loop playsInline
          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
          onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
        />
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19"/></svg>
          <span className="text-[10px] font-semibold tracking-wide uppercase">Reel</span>
        </div>
        {/* Play icon center */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-0 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19"/></svg>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
        <div className="bg-black/40 backdrop-blur-md rounded-lg px-3 py-2 w-full">
          <p className="text-xs font-semibold">{client}</p>
        </div>
      </div>
    </div>
  )
}

// Featured reel — larger with poster thumbnail
function FeaturedReelCard({ reel, onOpen }: { reel: typeof featuredReels[0]; onOpen: () => void }) {
  return (
    <div
      className="flex-shrink-0 w-[220px] md:w-[260px] cursor-pointer group"
      onClick={onOpen}
    >
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/[0.06] group-hover:border-white/[0.2] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
        <video
          src={`/brochure/${reel.src}`}
          poster={posterFor(reel.src)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          muted loop playsInline
          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
          onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-0 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center border border-white/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19"/></svg>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      <p className="text-sm font-semibold mt-3 text-white/80 group-hover:text-white transition-colors">{reel.client}</p>
      <p className="text-xs text-white/30">{reel.desc}</p>
    </div>
  )
}

export default function BrochureClient() {
  const [cat, setCat] = useState<Category>('all')
  const [media, setMedia] = useState<MediaType>('all')
  const [lightbox, setLightbox] = useState<{ src: string; client: string; type: 'post' | 'reel' } | null>(null)

  const filtered = pieces.filter(
    (p) => (cat === 'all' || p.category === cat) && (media === 'all' || p.type === media)
  )

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.07] blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.07] blur-[150px]" />
      </div>

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
            <span className="text-sm font-medium">{lightbox.client}</span>
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

      {/* ═══════════ HERO ═══════════ */}
      <header className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Video background */}
        <video
          src="/brochure/hero-bg.mp4"
          poster={posterFor('reel-swing-6.mp4')}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay muted loop playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050510] via-[#050510]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-[#050510]/50" />

        <div className="max-w-7xl mx-auto px-6 py-20 relative w-full">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/logo-blanco.png" alt="Muller y Pérez" width={180} height={45} className="h-9 w-auto opacity-90" />
            <div className="h-6 w-px bg-white/20" />
            <span className="text-sm text-white/30 tracking-wider uppercase">Brochure creativo</span>
          </div>

          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">
              Más que performance
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-8">
              Publicistas,<br />
              diseñadores y<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                filmmakers.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl mb-4">
              En Muller y Pérez no solo optimizamos campañas y medimos conversiones. Detrás de cada anuncio hay un equipo creativo que diseña, produce y filma contenido pensado para que tu marca destaque.
            </p>
            <p className="text-base text-white/30 leading-relaxed max-w-xl mb-10">
              Tres diseñadores especializados. Producción de reels y aftermovies. Grillas de contenido. Campañas completas de principio a fin — desde la idea hasta el resultado.
            </p>
            <a
              href="#gallery"
              className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur text-white font-medium px-6 py-3 rounded-full border border-white/[0.1] transition-all duration-200 text-sm"
            >
              Ver portfolio completo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 13l5 5 5-5M12 18V6"/></svg>
            </a>
          </div>
        </div>
      </header>

      {/* ═══════════ FEATURED REELS ═══════════ */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <h2 className="text-2xl font-bold">Reels destacados</h2>
          <p className="text-sm text-white/30 mt-1">Aftermovies, producto y contenido audiovisual</p>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-6 pb-4" style={{ minWidth: 'min-content' }}>
            {featuredReels.map((reel) => (
              <FeaturedReelCard
                key={reel.src}
                reel={reel}
                onOpen={() => setLightbox({ src: reel.src, client: reel.client, type: 'reel' })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ INDUSTRIES ═══════════ */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Industrias</h2>
          <p className="text-sm text-white/30 mb-8">Contenido especializado por sector</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {industryShowcase.map((ind) => (
              <div
                key={ind.label}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
                onClick={() => {
                  const catKey = categories.find(c => c.label === ind.label)?.key
                  if (catKey) setCat(catKey)
                  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Image
                  src={`/brochure/${ind.img}`}
                  alt={ind.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width:768px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-bold">{ind.label}</p>
                  <p className="text-[10px] text-white/40">{ind.client}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY ═══════════ */}
      <div id="gallery">
        {/* Filters */}
        <div className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-y border-white/[0.04] py-3 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCat(c.key)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    cat === c.key
                      ? 'bg-white text-black'
                      : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.1] hover:text-white/70'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {[
                { key: 'all' as MediaType, label: 'Todo' },
                { key: 'post' as MediaType, label: 'Posts' },
                { key: 'reel' as MediaType, label: 'Reels' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMedia(m.key)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    media === m.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.1] hover:text-white/70'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((piece, i) => (
              piece.type === 'reel' ? (
                <div key={`${piece.src}-${i}`} className="break-inside-avoid">
                  <ReelCard
                    src={piece.src}
                    client={piece.client}
                    onOpen={() => setLightbox({ src: piece.src, client: piece.client, type: 'reel' })}
                  />
                </div>
              ) : (
                <div
                  key={`${piece.src}-${i}`}
                  className="break-inside-avoid group cursor-pointer relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.15] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5"
                  onClick={() => setLightbox({ src: piece.src, client: piece.client, type: 'post' })}
                >
                  <Image
                    src={`/brochure/${piece.src}`}
                    alt={`${piece.client} — Muller y Pérez`}
                    width={600} height={750}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                    sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                    <div className="bg-black/40 backdrop-blur-md rounded-lg px-3 py-2 w-full">
                      <p className="text-xs font-semibold">{piece.client}</p>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>
      </div>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent" />
        <div className="max-w-2xl mx-auto text-center relative">
          <p className="text-sm text-blue-400 uppercase tracking-widest font-semibold mb-4">Performance + creatividad</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            No solo medimos.<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Creamos.
            </span>
          </h2>
          <p className="text-white/35 mb-10 max-w-lg mx-auto">
            Datos, conversión, ROAS — pero también diseño, guion, dirección de arte y producción audiovisual. Todo en un solo equipo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/56962143960?text=Hola%2C%20vi%20el%20brochure%20y%20me%20interesa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20"
            >
              WhatsApp directo
            </a>
            <a
              href="https://www.mulleryperez.cl/#contacto"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur text-white font-semibold px-8 py-3.5 rounded-full border border-white/[0.1] transition-all duration-200"
            >
              Agendar reunión
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/logo-blanco.png" alt="Muller y Pérez" width={120} height={30} className="h-6 w-auto opacity-30" />
          <p className="text-xs text-white/20">mulleryperez.cl — Performance Marketing Chile</p>
        </div>
      </footer>
    </div>
  )
}
