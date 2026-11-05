'use client'

import { useEffect } from 'react'

/**
 * Capa de animaciones del home, sin tocar el contenido (SEO intacto):
 * - Revela secciones y tarjetas al hacer scroll (solo si hay JS; sin JS todo queda visible).
 * - Tilt 3D en tarjetas marcadas con data-tilt.
 * - Spotlight que sigue el mouse en elementos con data-spotlight.
 */
export default function MotionLayer() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    root.classList.add('motion-ok')

    const targets = document.querySelectorAll<HTMLElement>('#home-root section > div > *, [data-reveal]')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    targets.forEach((el, i) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return // lo visible al cargar no se anima
      el.classList.add('reveal')
      el.style.setProperty('--d', `${(i % 4) * 70}ms`)
      io.observe(el)
    })

    const fine = window.matchMedia('(pointer: fine)').matches
    const tilts = fine ? Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]')) : []
    const handlers = tilts.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateZ(0)`
        el.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
        el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
      }
      const leave = () => { el.style.transform = '' }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
    })

    const spots = fine ? Array.from(document.querySelectorAll<HTMLElement>('[data-spotlight]')) : []
    const spotH = spots.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--sx', `${e.clientX - r.left}px`)
        el.style.setProperty('--sy', `${e.clientY - r.top}px`)
      }
      el.addEventListener('pointermove', move)
      return () => el.removeEventListener('pointermove', move)
    })

    return () => { io.disconnect(); handlers.forEach((f) => f()); spotH.forEach((f) => f()) }
  }, [])
  return null
}
