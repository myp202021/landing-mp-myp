'use client'

import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'

/** Globo WebGL (cobe, el mismo de Magic UI / 21st.dev) con los mercados donde operamos. */
const MARKERS: { location: [number, number]; size: number }[] = [
  { location: [-33.45, -70.66], size: 0.12 }, // Santiago
  { location: [-23.65, -70.4], size: 0.05 },  // Antofagasta
  { location: [-36.82, -73.05], size: 0.05 }, // Concepción
  { location: [-41.47, -72.94], size: 0.04 }, // Puerto Montt
  { location: [-12.05, -77.04], size: 0.07 }, // Lima
  { location: [19.43, -99.13], size: 0.06 },  // CDMX
  { location: [25.76, -80.19], size: 0.07 },  // Miami
  { location: [-33.87, 151.21], size: 0.05 }, // Sídney
]

export default function Globe({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let phi = 4.4, width = 0, raf = 0, dragging: number | null = null, delta = 0
    const onResize = () => { width = canvas.offsetWidth }
    onResize()
    window.addEventListener('resize', onResize)
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta: 0.25,
      dark: 0,
      diffuse: 0.6,
      mapSamples: 16000,
      mapBrightness: 1.4,
      baseColor: [1, 1, 1],
      markerColor: [0.15, 0.39, 0.92],
      glowColor: [0.86, 0.9, 1],
      markers: MARKERS,
    })
    const tick = () => {
      if (dragging === null) phi += 0.003
      globe.update({ phi: phi + delta, width: width * 2, height: width * 2 })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const down = (e: PointerEvent) => { dragging = e.clientX - delta * 200; canvas.style.cursor = 'grabbing' }
    const up = () => { dragging = null; canvas.style.cursor = 'grab' }
    const move = (e: PointerEvent) => { if (dragging !== null) delta = (e.clientX - dragging) / 200 }
    canvas.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointermove', move)
    requestAnimationFrame(() => { canvas.style.opacity = '1' })
    return () => {
      cancelAnimationFrame(raf); globe.destroy()
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointermove', move)
    }
  }, [])
  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <canvas ref={ref} aria-hidden="true" className="h-full w-full opacity-0 transition-opacity duration-1000 cursor-grab [contain:layout_paint_size]" />
    </div>
  )
}
