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

const pieces: Piece[] = [
  // SWING — Eventos
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
  // MINT — Eventos/Tech
  { src: 'mint-03.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-03p.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-copia-de-bryartz.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-copia-de-kuina.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-copia-de-kuroh97.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'mint-of.jpg', client: 'MINT', category: 'eventos', type: 'post' },
  { src: 'reel-mint-1.mp4', client: 'MINT', category: 'eventos', type: 'reel' },
  { src: 'reel-mint-2.mp4', client: 'MINT', category: 'eventos', type: 'reel' },
  // GENERA — Tech/SaaS
  { src: 'genera-grilla-ig-2.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-grilla-ig-6.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-grilla-ig-19.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-carrusel-mesa-de-trabajo-5.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-carrusel-mesa-de-trabajo-6.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-carrusel-mesa-de-trabajo-7.jpg', client: 'Genera', category: 'tech', type: 'post' },
  { src: 'genera-carrusel-mesa-de-trabajo-8.jpg', client: 'Genera', category: 'tech', type: 'post' },
  // TECNOINVER — Tech
  { src: 'tecnoinver-alta-disponibilidad-servidores-vps.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-4.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-5.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-6.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-12.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-14.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'tecnoinver-15.jpg', client: 'Tecnoinver', category: 'tech', type: 'post' },
  { src: 'reel-tecnoinver-1.mp4', client: 'Tecnoinver', category: 'tech', type: 'reel' },
  // INVAS — Tech/Logística
  { src: 'invas-03-07-post-1.jpg', client: 'Invas WMS', category: 'tech', type: 'post' },
  { src: 'invas-10-07.jpg', client: 'Invas WMS', category: 'tech', type: 'post' },
  { src: 'invas-13-07.jpg', client: 'Invas WMS', category: 'tech', type: 'post' },
  // HALTERLIFT — Industria
  { src: 'halterlift-propuesta-1.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-2.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-3.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-4.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-5.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'halterlift-propuesta-10.jpg', client: 'Halterlift', category: 'industria', type: 'post' },
  { src: 'reel-halterlift-1.mp4', client: 'Halterlift', category: 'industria', type: 'reel' },
  { src: 'reel-halterlift-2.mp4', client: 'Halterlift', category: 'industria', type: 'reel' },
  { src: 'reel-halterlift-3.mp4', client: 'Halterlift', category: 'industria', type: 'reel' },
  // POWER ENERGY — Industria
  { src: 'power-energy-147.jpg', client: 'Power Energy', category: 'industria', type: 'post' },
  { src: 'power-energy-77.jpg', client: 'Power Energy', category: 'industria', type: 'post' },
  { src: 'power-energy-78.jpg', client: 'Power Energy', category: 'industria', type: 'post' },
  { src: 'power-energy-81.jpg', client: 'Power Energy', category: 'industria', type: 'post' },
  { src: 'reel-power-energy-1.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  { src: 'reel-power-energy-2.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  { src: 'reel-power-energy-3.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  { src: 'reel-power-energy-4.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  { src: 'reel-power-energy-5.mp4', client: 'Power Energy', category: 'industria', type: 'reel' },
  // FUXION — Industria/Logística
  { src: 'fuxion-11.jpg', client: 'Fuxion Logistics', category: 'industria', type: 'post' },
  { src: 'fuxion-12--1-.jpg', client: 'Fuxion Logistics', category: 'industria', type: 'post' },
  { src: 'fuxion-2--1-.jpg', client: 'Fuxion Logistics', category: 'industria', type: 'post' },
  { src: 'fuxion-4--1-.jpg', client: 'Fuxion Logistics', category: 'industria', type: 'post' },
  { src: 'reel-fuxion-1.mp4', client: 'Fuxion Logistics', category: 'industria', type: 'reel' },
  { src: 'reel-fuxion-2.mp4', client: 'Fuxion Logistics', category: 'industria', type: 'reel' },
  // JP PROCESOS — Industria
  { src: 'jp-procesos-01-06.jpg', client: 'JP Procesos', category: 'industria', type: 'post' },
  { src: 'jp-procesos-05-06.jpg', client: 'JP Procesos', category: 'industria', type: 'post' },
  { src: 'jp-procesos-08-06.jpg', client: 'JP Procesos', category: 'industria', type: 'post' },
  { src: 'jp-procesos-24-06.jpg', client: 'JP Procesos', category: 'industria', type: 'post' },
  // RILAY — Inmobiliaria
  { src: 'rilay-grilla-1.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'rilay-grilla-4.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'rilay-grilla-8.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'rilay-grilla-11.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'rilay-grilla-16.jpg', client: 'Rilay', category: 'inmobiliaria', type: 'post' },
  { src: 'reel-rilay-1.mp4', client: 'Rilay', category: 'inmobiliaria', type: 'reel' },
  { src: 'reel-rilay-2.mp4', client: 'Rilay', category: 'inmobiliaria', type: 'reel' },
  { src: 'reel-rilay-3.mp4', client: 'Rilay', category: 'inmobiliaria', type: 'reel' },
  // 4LIFE — Inmobiliaria/Financiero
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
  // STOCKS — Inmobiliaria
  { src: 'reel-stocks-1.mp4', client: 'Stocks', category: 'inmobiliaria', type: 'reel' },
  { src: 'reel-stocks-2.mp4', client: 'Stocks', category: 'inmobiliaria', type: 'reel' },
  { src: 'reel-stocks-3.mp4', client: 'Stocks', category: 'inmobiliaria', type: 'reel' },
  // PREGIATA — Retail
  { src: 'pregiata-11.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'pregiata-13.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'pregiata-14.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'pregiata-24.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'pregiata-27.jpg', client: 'Pregiata', category: 'retail', type: 'post' },
  { src: 'reel-pregiata-1.mp4', client: 'Pregiata', category: 'retail', type: 'reel' },
  { src: 'reel-pregiata-2.mp4', client: 'Pregiata', category: 'retail', type: 'reel' },
  // CIOCCOLATI — Retail
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-09-09.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-11-49.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-11-56.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-12-03.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'cioccolati-captura-de-pantalla-2026-07-14-a-la-s--10-12-10.jpg', client: 'Cioccolati', category: 'retail', type: 'post' },
  { src: 'reel-cioccolati-1.mp4', client: 'Cioccolati', category: 'retail', type: 'reel' },
  // INACAP — Educación
  { src: 'variados-inacap-mesa--7-.jpg', client: 'INACAP', category: 'educacion', type: 'post' },
  // HUALPEN — Transporte
  { src: 'hualpen-96.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'hualpen-97.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'hualpen-98.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'hualpen-105.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'hualpen-corregido02.jpg', client: 'Buses Hualpén', category: 'transporte', type: 'post' },
  { src: 'reel-hualpen-1.mp4', client: 'Buses Hualpén', category: 'transporte', type: 'reel' },
  { src: 'reel-hualpen-2.mp4', client: 'Buses Hualpén', category: 'transporte', type: 'reel' },
  // IRUZUN — Alimentos
  { src: 'iruzun-06-07.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  { src: 'iruzun-15-07.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  { src: 'iruzun-27-07.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  { src: 'iruzun-28-07.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  { src: 'iruzun-grilla-irurzun---julio--4-.jpg', client: 'Irurzun', category: 'alimentos', type: 'post' },
  // PREMIOS — Retail/Entretenimiento
  { src: 'reel-premios-1.mp4', client: 'Premios Increíbles', category: 'retail', type: 'reel' },
  { src: 'reel-premios-2.mp4', client: 'Premios Increíbles', category: 'retail', type: 'reel' },
  { src: 'reel-premios-3.mp4', client: 'Premios Increíbles', category: 'retail', type: 'reel' },
  // PINEAPPLE
  { src: 'variados-mesa-pinneapple--2-.jpg', client: 'PineApple Store', category: 'retail', type: 'post' },
  // VARIADOS (otros clientes)
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
  { key: 'educacion', label: 'Educación' },
  { key: 'transporte', label: 'Transporte' },
  { key: 'alimentos', label: 'Alimentos' },
  { key: 'variados', label: 'Otros' },
]

const mediaTypes: { key: MediaType; label: string }[] = [
  { key: 'all', label: 'Todo' },
  { key: 'post', label: 'Posts' },
  { key: 'reel', label: 'Reels' },
]

export default function BrochureClient() {
  const [cat, setCat] = useState<Category>('all')
  const [media, setMedia] = useState<MediaType>('all')
  const [lightbox, setLightbox] = useState<Piece | null>(null)

  const filtered = pieces.filter(
    (p) => (cat === 'all' || p.category === cat) && (media === 'all' || p.type === media)
  )

  const totalPosts = pieces.filter((p) => p.type === 'post').length
  const totalReels = pieces.filter((p) => p.type === 'reel').length
  const uniqueClients = Array.from(new Set(pieces.map((p) => p.client).filter((c) => c !== 'Variados')))

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center cursor-pointer backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all text-xl"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>
          <div className="absolute top-6 left-6 bg-white/10 backdrop-blur rounded-full px-4 py-2">
            <span className="text-sm font-medium">{lightbox.client}</span>
            <span className="text-white/40 text-sm ml-2">{lightbox.type === 'reel' ? 'Reel' : 'Post'}</span>
          </div>
          {lightbox.type === 'reel' ? (
            <video
              src={`/brochure/${lightbox.src}`}
              className="max-w-[90vw] max-h-[85vh] rounded-2xl"
              autoPlay
              loop
              muted
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Image
              src={`/brochure/${lightbox.src}`}
              alt={lightbox.client}
              width={1200}
              height={1500}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}

      {/* Hero */}
      <header className="relative pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/logo-blanco.png" alt="Muller y Pérez" width={180} height={45} className="h-9 w-auto opacity-90" />
            <div className="h-6 w-px bg-white/20" />
            <span className="text-sm text-white/40 tracking-wider uppercase">Portfolio 2026</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
            <span className="block">Diseño que</span>
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              convierte.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-xl mb-14 leading-relaxed">
            Posts, reels y campañas para más de {uniqueClients.length} marcas.
            Cada pieza pensada para resultados, no para decorar.
          </p>

          {/* Glass stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { n: `${totalPosts}`, l: 'Posts', accent: 'from-blue-500/20 to-blue-600/5' },
              { n: `${totalReels}`, l: 'Reels', accent: 'from-purple-500/20 to-purple-600/5' },
              { n: `${uniqueClients.length}`, l: 'Clientes', accent: 'from-cyan-500/20 to-cyan-600/5' },
              { n: '8', l: 'Industrias', accent: 'from-emerald-500/20 to-emerald-600/5' },
            ].map((s) => (
              <div
                key={s.l}
                className={`bg-gradient-to-br ${s.accent} backdrop-blur-xl rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300`}
              >
                <p className="text-3xl md:text-4xl font-bold tracking-tight">{s.n}</p>
                <p className="text-sm text-white/40 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/[0.06] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => {
              const count = c.key === 'all' ? pieces.length : pieces.filter((p) => p.category === c.key).length
              return (
                <button
                  key={c.key}
                  onClick={() => setCat(c.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    cat === c.key
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.12] hover:text-white/80'
                  }`}
                >
                  {c.label}
                  <span className="ml-1 opacity-50">{count}</span>
                </button>
              )
            })}
          </div>
          {/* Media type */}
          <div className="flex gap-1.5">
            {mediaTypes.map((m) => (
              <button
                key={m.key}
                onClick={() => setMedia(m.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  media === m.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.12] hover:text-white/80'
                }`}
              >
                {m.label}
              </button>
            ))}
            <span className="flex items-center text-xs text-white/30 ml-2">
              {filtered.length} piezas
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10 relative">
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
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
                  />
                  {/* Reel badge */}
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                    <span className="text-[10px] font-medium">Reel</span>
                  </div>
                </div>
              ) : (
                <Image
                  src={`/brochure/${piece.src}`}
                  alt={`${piece.client} — Muller y Pérez`}
                  width={600}
                  height={750}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                  sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
                />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                <div className="bg-black/40 backdrop-blur-md rounded-lg px-3 py-2 w-full">
                  <p className="text-xs font-semibold">{piece.client}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Hagamos que tu marca
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              destaque.
            </span>
          </h2>
          <p className="text-white/40 mb-10">Performance + diseño + datos = resultados.</p>
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
