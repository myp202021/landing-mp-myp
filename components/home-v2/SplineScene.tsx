'use client'

import { Suspense, lazy, useEffect, useState } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

/** Escena 3D interactiva de Spline (patrón "Spline Scene" de 21st.dev). Solo escritorio; se carga después del primer pintado. */
export default function SplineScene({ scene, className = '' }: { scene: string; className?: string }) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!desktop || reduce) return
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number }
    const go = () => setOk(true)
    if (w.requestIdleCallback) w.requestIdleCallback(go)
    else setTimeout(go, 800)
  }, [])
  if (!ok) return null
  return (
    <Suspense fallback={null}>
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
