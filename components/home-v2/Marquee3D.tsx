'use client'

/** Muro de videos en perspectiva 3D: filas que se desplazan en sentidos opuestos (inspirado en "3D Marquee" de 21st.dev). */
export default function Marquee3D({ images }: { images: { src: string; alt: string; href?: string }[] }) {
  const rows = [0, 1, 2].map((r) => images.filter((_, i) => i % 3 === r))
  return (
    <div className="relative h-[560px] overflow-hidden rounded-3xl [perspective:1400px] max-sm:h-[380px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_55%,transparent_100%)]">
      <div className="absolute inset-[-20%] flex flex-col justify-center gap-6"
        style={{ transform: 'rotateX(24deg) rotateY(-16deg) rotateZ(6deg)', transformStyle: 'preserve-3d' }}>
        {rows.map((row, r) => {
          const loop = [...row, ...row, ...row]
          return (
            <div key={r} className={`flex w-max gap-6 ${r % 2 ? 'animate-scroll-right' : 'animate-scroll-left'}`} style={{ animationDuration: `${50 + r * 12}s` }}>
              {loop.map((img, i) => (
                <a key={i} href={img.href} target="_blank" rel="noopener noreferrer"
                  className="group relative block w-[340px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 transition-transform duration-300 hover:-translate-y-2 hover:ring-cyan-300/60 max-sm:w-[220px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} loading="lazy" width={480} height={270} className="aspect-video w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">{img.alt}</span>
                </a>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
