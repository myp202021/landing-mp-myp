'use client'

import { useEffect, useRef, useState } from 'react'

/** Anima la parte numérica de un valor ("+200", "5.0★", "950k") al entrar en pantalla. SSR muestra el valor final. */
export default function CountUp({ value }: { value: string }) {
  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  const [txt, setTxt] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const [, pre, num, post] = m
    const target = parseFloat(num)
    const dec = num.includes('.') ? num.split('.')[1].length : 0
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now(), dur = 1400
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / dur)
        const v = target * (1 - Math.pow(1 - k, 3))
        setTxt(`${pre}${v.toFixed(dec)}${post}`)
        if (k < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return <span ref={ref}>{txt}</span>
}
