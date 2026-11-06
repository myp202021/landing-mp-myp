'use client'

import Image from 'next/image'
import { Suspense, lazy, useEffect, useState } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

/**
 * Robot 3D "inteligente":
 * 1. Muestra al instante una imagen fija del robot (liviana, no bloquea la carga).
 * 2. Solo en escritorio, cuando la página ya cargó y el usuario interactúa (mueve el mouse o hace scroll),
 *    descarga la escena 3D de Spline y hace un fundido desde la imagen.
 * 3. Si el 3D falla o el equipo no lo soporta, se queda la imagen.
 */
export default function SmartRobot({ scene, className = '' }: { scene: string; className?: string }) {
  const [load3d, setLoad3d] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    const slow = conn?.saveData || /2g/.test(conn?.effectiveType || '')
    if (!desktop || reduce || slow) return
    let done = false
    const go = () => {
      if (done) return
      done = true
      window.removeEventListener('pointermove', go)
      window.removeEventListener('scroll', go)
      setLoad3d(true)
    }
    const arm = () => {
      window.addEventListener('pointermove', go, { once: true, passive: true })
      window.addEventListener('scroll', go, { once: true, passive: true })
    }
    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })
    return () => {
      window.removeEventListener('pointermove', go)
      window.removeEventListener('scroll', go)
    }
  }, [])

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Image
        src="/home/robot.png"
        alt=""
        aria-hidden="true"
        width={880}
        height={920}
        sizes="(min-width: 1024px) 540px, 70vw"
        fetchPriority="high"
        loading="eager"
        className={`absolute inset-0 m-auto h-full w-auto max-w-full object-contain transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}
      />
      {load3d && (
        <Suspense fallback={null}>
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <Spline scene={scene} onLoad={() => setReady(true)} className="h-full w-full" />
          </div>
        </Suspense>
      )}
    </div>
  )
}
