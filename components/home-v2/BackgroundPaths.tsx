'use client'

import { motion } from 'framer-motion'

/** Líneas que fluyen (patrón "Background Paths" de 21st.dev). Decorativo. */
function Paths({ position }: { position: number }) {
  const paths = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    w: 0.5 + i * 0.03,
  }))
  return (
    <svg className="h-full w-full text-cyan-300" viewBox="0 0 696 316" fill="none" aria-hidden="true">
      {paths.map((p) => (
        <motion.path
          key={p.id}
          d={p.d}
          stroke="currentColor"
          strokeWidth={p.w}
          strokeOpacity={0.06 + p.id * 0.012}
          initial={{ pathLength: 0.3, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }}
          transition={{ duration: 20 + (p.id % 10), repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </svg>
  )
}
export default function BackgroundPaths() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Paths position={1} />
      <div className="absolute inset-0"><Paths position={-1} /></div>
    </div>
  )
}
