'use client'

import dynamic from 'next/dynamic'

// Cargar el popup de forma dinámica para no afectar el rendimiento inicial
const ExitIntentPopup = dynamic(() => import('./ExitIntentPopup'), {
  ssr: false
})

export default function ExitIntentWrapper() {
  return <ExitIntentPopup />
}
