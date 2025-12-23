'use client'

/**
 * ChatBot Wrapper - Solo muestra el chat en páginas públicas
 * Excluye: /crm, /login, /cliente, /admin
 */

import { usePathname } from 'next/navigation'
import ChatBot from './ChatBot'

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
