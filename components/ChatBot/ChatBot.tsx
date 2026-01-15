'use client'

/**
 * MUTANTE - Asistente IA de Marketing Digital
 * ChatBot inteligente de M&P
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Send,
  ChevronRight,
  Loader2,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { chatTree, getNode, getRootNode, ChatNode, ChatOption } from '@/lib/chatbot/decision-tree'
import { initTracking, TrackingData, getFuenteForDB } from '@/lib/utils/utm-tracking'

// ============================================
// TYPES
// ============================================

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  options?: ChatOption[]
  isTyping?: boolean
  nodeId?: string
}

interface LeadData {
  nombre: string
  empresa: string
  email: string
  telefono: string
  interes: string
}

// ============================================
// MUTANTE ICON COMPONENT
// ============================================

function MutanteIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Brain/Circuit background */}
      <circle cx="50" cy="50" r="45" fill="url(#mutante-gradient)" />

      {/* Neural network lines */}
      <path d="M30 35 L50 50 L70 35" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d="M30 65 L50 50 L70 65" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d="M50 20 L50 50 L50 80" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

      {/* Central AI eye */}
      <circle cx="50" cy="50" r="15" fill="white" opacity="0.9"/>
      <circle cx="50" cy="50" r="8" fill="#3b82f6"/>
      <circle cx="53" cy="47" r="3" fill="white"/>

      {/* Spark accents */}
      <circle cx="30" cy="35" r="4" fill="white" opacity="0.8"/>
      <circle cx="70" cy="35" r="4" fill="white" opacity="0.8"/>
      <circle cx="30" cy="65" r="4" fill="white" opacity="0.8"/>
      <circle cx="70" cy="65" r="4" fill="white" opacity="0.8"/>
      <circle cx="50" cy="20" r="4" fill="white" opacity="0.8"/>
      <circle cx="50" cy="80" r="4" fill="white" opacity="0.8"/>

      <defs>
        <linearGradient id="mutante-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="50%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#3b82f6"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ============================================
// COMPONENT
// ============================================

export default function ChatBot() {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentNodeId, setCurrentNodeId] = useState('root')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadData, setLeadData] = useState<LeadData>({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    interes: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ============================================
  // EFFECTS
  // ============================================

  // Inicializar tracking de UTM/gclid al montar
  useEffect(() => {
    const data = initTracking()
    setTrackingData(data)
    console.log('📊 Tracking inicializado:', data.source_type, data.source_detail)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && !sessionId) {
      initSession()
    }
  }, [isOpen, sessionId])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      showWelcomeMessage()
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasUnread(true)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  const initSession = async () => {
    try {
      const response = await fetch('/api/chatbot/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_agent: navigator.userAgent,
          landing_page: window.location.href,
          referrer: document.referrer || null
        })
      })

      const data = await response.json()
      if (data.sessionId) {
        setSessionId(data.sessionId)
      }
    } catch (err) {
      console.error('Error creating chat session:', err)
    }
  }

  const saveMessage = async (
    role: 'user' | 'assistant',
    content: string,
    nodeId?: string,
    optionSelected?: string,
    categoria?: string,
    subcategoria?: string
  ) => {
    if (!sessionId) return

    try {
      await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          role,
          content,
          nodeId,
          optionSelected,
          categoria,
          subcategoria
        })
      })
    } catch (err) {
      console.error('Error saving message:', err)
    }
  }

  const updateSessionLead = async (data: LeadData) => {
    if (!sessionId) return

    try {
      await fetch('/api/chatbot/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          nombre: data.nombre,
          empresa: data.empresa,
          email: data.email,
          telefono: data.telefono,
          intent_score: 'alto'
        })
      })
    } catch (err) {
      console.error('Error updating session lead:', err)
    }
  }

  // ============================================
  // MESSAGE HANDLING
  // ============================================

  const showWelcomeMessage = () => {
    const rootNode = getRootNode()
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: rootNode.text,
        options: rootNode.options,
        nodeId: 'root'
      }])
      saveMessage('assistant', rootNode.text, 'root', undefined, 'inicio')
    }, 800)
  }

  const handleOptionSelect = useCallback((option: ChatOption) => {
    const nextNode = getNode(option.nextNodeId)
    if (!nextNode) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: option.label,
      nodeId: currentNodeId
    }

    setMessages(prev => [...prev, userMessage])
    saveMessage('user', option.label, currentNodeId, option.id, nextNode.category, nextNode.subcategory)

    setCurrentNodeId(option.nextNodeId)
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)

      // Handle external link type
      if (nextNode.type === 'external_link' && nextNode.externalUrl) {
        window.open(nextNode.externalUrl, '_blank')
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: nextNode.text,
          nodeId: nextNode.id
        }
        setMessages(prev => [...prev, botMessage])

        // Show next node options after external link
        if (nextNode.nextNode) {
          const followUpNode = getNode(nextNode.nextNode)
          if (followUpNode) {
            setTimeout(() => {
              setMessages(prev => [...prev, {
                id: `bot-followup-${Date.now()}`,
                role: 'assistant',
                content: '¿En que mas te puedo ayudar?',
                options: followUpNode.options,
                nodeId: followUpNode.id
              }])
              setCurrentNodeId(followUpNode.id)
            }, 1000)
          }
        }
        return
      }

      if (nextNode.type === 'capture_lead') {
        setShowLeadForm(true)
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: nextNode.text,
          nodeId: nextNode.id
        }
        setMessages(prev => [...prev, botMessage])
        saveMessage('assistant', nextNode.text, nextNode.id, undefined, nextNode.category, nextNode.subcategory)
      } else {
        const content = nextNode.response || nextNode.text
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content,
          options: nextNode.options,
          nodeId: nextNode.id
        }
        setMessages(prev => [...prev, botMessage])
        saveMessage('assistant', content, nextNode.id, undefined, nextNode.category, nextNode.subcategory)
      }
    }, 600 + Math.random() * 400)
  }, [currentNodeId, sessionId])

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)

    try {
      // Guardar en Supabase
      await updateSessionLead(leadData)

      // Enviar email via API con datos de tracking
      const fuente = trackingData ? getFuenteForDB(trackingData) : 'chatbot_karen'
      await fetch('/api/chatbot/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          sessionId,
          source: 'mutante_chatbot',
          // Datos de tracking para clasificación
          tracking: trackingData ? {
            source_type: trackingData.source_type,
            source_detail: trackingData.source_detail,
            utm_source: trackingData.utm_source,
            utm_medium: trackingData.utm_medium,
            utm_campaign: trackingData.utm_campaign,
            gclid: trackingData.gclid,
            fbclid: trackingData.fbclid
          } : null,
          fuente_clasificada: fuente
        })
      })

      setShowLeadForm(false)

      // Show confirmation
      const confirmNode = getNode('contacto_confirmacion')
      if (confirmNode) {
        setMessages(prev => [...prev, {
          id: `bot-confirm-${Date.now()}`,
          role: 'assistant',
          content: confirmNode.text,
          options: confirmNode.options,
          nodeId: 'contacto_confirmacion'
        }])
        setCurrentNodeId('contacto_confirmacion')
        saveMessage('assistant', confirmNode.text, 'contacto_confirmacion', undefined, 'conversion', 'confirmacion')
      }

      // Reset lead form
      setLeadData({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        interes: ''
      })
    } catch (err) {
      console.error('Error submitting lead:', err)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleClose = async () => {
    if (sessionId) {
      try {
        await fetch('/api/chatbot/session', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            ended_at: new Date().toISOString()
          })
        })
      } catch (err) {
        console.error('Error closing session:', err)
      }
    }
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
    setHasUnread(false)
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* Chat Button - Mutante Style */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        aria-label="Abrir Mutante"
      >
        <MutanteIcon className="w-10 h-10" />

        {/* Notification Badge */}
        <AnimatePresence>
          {hasUnread && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">1</span>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header - Mutante Style */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <MutanteIcon className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    Mutante
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/80 text-xs">IA de Marketing</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-md px-4 py-3'
                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100'
                    }`}
                  >
                    <div
                      className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        message.role === 'assistant' ? 'prose prose-sm max-w-none' : ''
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.content)
                      }}
                    />

                    {/* Options */}
                    {message.options && message.options.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionSelect(option)}
                            className="w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl text-sm text-gray-700 hover:text-purple-700 transition-all duration-200 flex items-center justify-between group"
                          >
                            <span className="flex items-center gap-2">
                              {option.emoji && <span>{option.emoji}</span>}
                              <span>{option.label}</span>
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Lead Form */}
              {showLeadForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-md border border-purple-100"
                >
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Tu nombre *"
                      value={leadData.nombre}
                      onChange={(e) => setLeadData(prev => ({ ...prev, nombre: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Empresa"
                      value={leadData.empresa}
                      onChange={(e) => setLeadData(prev => ({ ...prev, empresa: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={leadData.email}
                      onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      placeholder="Telefono"
                      value={leadData.telefono}
                      onChange={(e) => setLeadData(prev => ({ ...prev, telefono: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <select
                      value={leadData.interes}
                      onChange={(e) => setLeadData(prev => ({ ...prev, interes: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">¿Que te interesa?</option>
                      <option value="Tips y consejos">Tips y consejos</option>
                      <option value="Herramientas gratuitas">Herramientas gratuitas</option>
                      <option value="Cotizacion de servicios">Cotizacion de servicios</option>
                      <option value="Auditoria de marketing">Auditoria de marketing</option>
                      <option value="Consulta especifica">Consulta especifica</option>
                    </select>
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {formSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar datos
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <p className="text-center text-xs text-gray-400">
                Powered by <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Mutante</span> · M&P Labs
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatMessage(content: string): string {
  return content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
    .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/✅/g, '<span class="text-green-600">✅</span>')
    .replace(/❌/g, '<span class="text-red-600">❌</span>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:underline inline-flex items-center gap-1">$1</a>')
}
