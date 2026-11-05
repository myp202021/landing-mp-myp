'use client'

import { useEffect, useState } from 'react'

/** Monta efectos pesados (WebGL, video, Spline) solo en escritorio y después del primer pintado. */
export default function DesktopOnly({ children, minWidth = 1024 }: { children: React.ReactNode; minWidth?: number }) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    if (!window.matchMedia(`(min-width: ${minWidth}px) and (pointer: fine)`).matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number }
    const go = () => setOk(true)
    if (document.readyState === 'complete') (w.requestIdleCallback ? w.requestIdleCallback(go) : setTimeout(go, 300))
    else window.addEventListener('load', () => (w.requestIdleCallback ? w.requestIdleCallback(go) : setTimeout(go, 300)), { once: true })
  }, [minWidth])
  return ok ? <>{children}</> : null
}
