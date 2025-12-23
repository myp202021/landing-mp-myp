'use client'

/**
 * M&P ChatBot - Componente Principal
 * Diseño premium con navegación por árbol de decisión
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  X,
  Send,
  ArrowLeft,
  ChevronRight,
  User,
  Loader2
} from 'lucide-react'
import { chatTree, getNode, getRootNode, ChatNode, ChatOption } from '@/lib/chatbot/decision-tree'
import { supabase } from '@/lib/supabase'

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

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ============================================
  // EFFECTS
  // ============================================

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize session when chat opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      initSession()
    }
  }, [isOpen, sessionId])

  // Show initial message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      showWelcomeMessage()
    }
  }, [isOpen, messages.length])

  // Show notification bubble after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasUnread(true)
      }
    }, 5000) // 5 seconds after page load

    return () => clearTimeout(timer)
  }, [])

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  const initSession = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_agent: navigator.userAgent,
          landing_page: window.location.href,
          referrer: document.referrer || null
        })
        .select('id')
        .single()

      if (data && !error) {
        setSessionId(data.id)
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
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role,
        content,
        node_id: nodeId,
        option_selected: optionSelected,
        categoria,
        subcategoria
      })

      // Update session metrics
      await supabase
        .from('chat_sessions')
        .update({
          total_messages: messages.length + 1,
          total_turns: Math.floor((messages.length + 1) / 2),
          categoria: categoria || undefined,
          subcategoria: subcategoria || undefined
        })
        .eq('id', sessionId)
    } catch (err) {
      console.error('Error saving message:', err)
    }
  }

  const updateSessionLead = async (data: LeadData) => {
    if (!sessionId) return

    try {
      await supabase
        .from('chat_sessions')
        .update({
          nombre: data.nombre,
          empresa: data.empresa,
          email: data.email,
          telefono: data.telefono,
          intent_score: 'alto'
        })
        .eq('id', sessionId)
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

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false)

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

      // Enviar email via API
      await fetch('/api/chatbot/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          sessionId,
          source: 'chatbot'
        })
      })

      setShowLeadForm(false)

      // Show confirmation
      const confirmNode = getNode('agendar_confirmacion')
      if (confirmNode) {
        setMessages(prev => [...prev, {
          id: `bot-confirm-${Date.now()}`,
          role: 'assistant',
          content: confirmNode.text,
          options: confirmNode.options,
          nodeId: 'agendar_confirmacion'
        }])
        setCurrentNodeId('agendar_confirmacion')
        saveMessage('assistant', confirmNode.text, 'agendar_confirmacion', undefined, 'conversion', 'confirmacion')
      }
    } catch (err) {
      console.error('Error submitting lead:', err)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleClose = async () => {
    if (sessionId) {
      try {
        await supabase
          .from('chat_sessions')
          .update({ ended_at: new Date().toISOString() })
          .eq('id', sessionId)
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
      {/* Chat Button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-7 h-7 text-white" />

        {/* Notification Badge */}
        <AnimatePresence>
          {hasUnread && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">1</span>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-25" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo-color.png"
                    alt="M&P"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Asistente M&P</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-blue-100 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3'
                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100'
                    }`}
                  >
                    {/* Message Content with Markdown-like formatting */}
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
                            className="w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-sm text-gray-700 hover:text-blue-700 transition-all duration-200 flex items-center justify-between group"
                          >
                            <span className="flex items-center gap-2">
                              {option.emoji && <span>{option.emoji}</span>}
                              <span>{option.label}</span>
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
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
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Lead Form */}
              {showLeadForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Tu nombre *"
                      value={leadData.nombre}
                      onChange={(e) => setLeadData(prev => ({ ...prev, nombre: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Empresa"
                      value={leadData.empresa}
                      onChange={(e) => setLeadData(prev => ({ ...prev, empresa: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={leadData.email}
                      onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      placeholder="Telefono"
                      value={leadData.telefono}
                      onChange={(e) => setLeadData(prev => ({ ...prev, telefono: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={leadData.interes}
                      onChange={(e) => setLeadData(prev => ({ ...prev, interes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">¿Que plan te interesa?</option>
                      <option value="Plan Campanas">Plan Campanas ($490K)</option>
                      <option value="Plan Contenidos">Plan Contenidos ($650K)</option>
                      <option value="Plan Silver">Plan Silver ($750K)</option>
                      <option value="Plan Gold">Plan Gold ($1.2M)</option>
                      <option value="Plan Platinum">Plan Platinum ($1.9M)</option>
                      <option value="No estoy seguro">No estoy seguro aun</option>
                    </select>
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                Powered by <span className="font-medium text-gray-600">M&P</span> • Marketing & Performance
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
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Line breaks
    .replace(/\n/g, '<br />')
    // Lists with bullets
    .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>')
    // Checkmarks
    .replace(/✅/g, '<span class="text-green-600">✅</span>')
    .replace(/❌/g, '<span class="text-red-600">❌</span>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
}
