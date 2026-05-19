'use client'

/**
 * ChatBot Wrapper - Solo muestra el chat en páginas públicas
 * Excluye: /crm, /login, /cliente, /admin
 * Carga dinámica para no bloquear LCP (framer-motion es pesado)
 */

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const ChatBot = dynamic(() => import('./ChatBot'), {
  ssr: false,
})

// Rutas donde NO mostrar el chatbot
const EXCLUDED_PATHS = [
  '/crm',
  '/login',
  '/cliente',
  '/admin',
  '/api'
]

export default function ChatBotWrapper() {
  const pathname = usePathname()

  // Verificar si la ruta actual está excluida
  const isExcluded = EXCLUDED_PATHS.some(path => pathname?.startsWith(path))

  if (isExcluded) {
    return null
  }

  return <ChatBot />
}
