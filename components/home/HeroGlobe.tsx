'use client'

import { useEffect, useRef } from 'react'

/**
 * Globo 3D de partículas en canvas (sin dependencias).
 * - Puntos sobre una esfera + arcos de "campañas" que viajan entre nodos.
 * - Paralaje con el mouse, se pausa fuera de pantalla y respeta prefers-reduced-motion.
 * Decorativo: aria-hidden, no afecta SEO ni LCP (el texto del hero se pinta antes).
 */
export default function HeroGlobe({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, R = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      R = Math.min(w, h) * 0.42
    }
    resize()

    // Puntos en esfera (fibonacci)
    const N = window.innerWidth < 768 ? 520 : 900
    const pts: [number, number, number][] = []
    const g = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = g * i
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r])
    }
    // Nodos y arcos
    const nodes = Array.from({ length: 14 }, () => pts[Math.floor(Math.random() * N)])
    const arcs = Array.from({ length: 10 }, () => ({
      a: nodes[Math.floor(Math.random() * nodes.length)],
      b: nodes[Math.floor(Math.random() * nodes.length)],
      p: Math.random(),
      s: 0.003 + Math.random() * 0.004,
    }))

    let rotY = 0, rotX = -0.35, mx = 0, my = 0, raf = 0, visible = true
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.6
      my = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', resize)
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !reduce) loop() })
    io.observe(canvas)

    const project = (p: [number, number, number]) => {
      const ry = rotY + mx, rx = rotX + my
      let [x, y, z] = p
      const cy = Math.cos(ry), sy = Math.sin(ry)
      ;[x, z] = [x * cy - z * sy, x * sy + z * cy]
      const cx = Math.cos(rx), sx = Math.sin(rx)
      ;[y, z] = [y * cx - z * sx, y * sx + z * cx]
      const f = 2.4 / (2.4 + z)
      return { x: w / 2 + x * R * f, y: h / 2 + y * R * f, z, f }
    }
    const slerp = (a: number[], b: number[], t: number) => {
      const v = a.map((ai, i) => ai * (1 - t) + b[i] * t)
      const l = Math.hypot(v[0], v[1], v[2]) || 1
      const lift = 1 + Math.sin(Math.PI * t) * 0.35
      return v.map((vi) => (vi / l) * lift) as [number, number, number]
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // halo
      const grd = ctx.createRadialGradient(w / 2, h / 2, R * 0.2, w / 2, h / 2, R * 1.4)
      grd.addColorStop(0, 'rgba(56,189,248,0.10)')
      grd.addColorStop(1, 'rgba(56,189,248,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      for (const p of pts) {
        const q = project(p)
        const a = q.z < 0 ? 0.85 : 0.15
        ctx.fillStyle = `rgba(147,197,253,${a * q.f * 0.9})`
        ctx.fillRect(q.x, q.y, 1.4 * q.f, 1.4 * q.f)
      }
      for (const n of nodes) {
        const q = project(n)
        if (q.z > 0.2) continue
        ctx.beginPath()
        ctx.arc(q.x, q.y, 2.6 * q.f, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(34,211,238,0.95)'
        ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 12
        ctx.fill(); ctx.shadowBlur = 0
      }
      for (const arc of arcs) {
        arc.p += arc.s
        if (arc.p > 1.25) { arc.p = 0; arc.b = nodes[Math.floor(Math.random() * nodes.length)] }
        ctx.beginPath()
        const steps = 28
        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          if (t > arc.p || t < arc.p - 0.45) continue
          const q = project(slerp(arc.a, arc.b, t))
          i === 0 || t <= Math.max(0, arc.p - 0.45) + 1 / steps ? ctx.moveTo(q.x, q.y) : ctx.lineTo(q.x, q.y)
        }
        ctx.strokeStyle = 'rgba(96,165,250,0.55)'
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
    }
    const loop = () => {
      cancelAnimationFrame(raf)
      const tick = () => {
        if (!visible) return
        rotY += 0.0022
        draw()
        raf = requestAnimationFrame(tick)
      }
      tick()
    }
    reduce ? draw() : loop()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={`w-full h-full ${className}`} />
}
