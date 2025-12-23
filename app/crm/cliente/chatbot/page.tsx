'use client'

/**
 * M&P ChatBot - Dashboard Cliente
 * Panel para ver conversaciones del chatbot de la landing page
 * Cliente: Muller & Pérez (usuario Arturo Vargas)
 */

import React, { useState, useEffect } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import { supabase } from '@/lib/supabase'
import {
  MessageSquare,
  Users,
  TrendingUp,
  Download,
  Search,
  ChevronRight,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface ChatSession {
  id: string
  started_at: string
  ended_at: string | null
  categoria: string | null
  subcategoria: string | null
  resuelto: boolean
  escalo_humano: boolean
  intent_score: string
  nombre: string | null
  email: string | null
  telefono: string | null
  empresa: string | null
  total_messages: number
  total_turns: number
}

interface ChatMessage {
  id: string
  session_id: string
  role: string
  content: string
  node_id: string | null
  option_selected: string | null
  created_at: string
}

// ============================================
// COMPONENT
// ============================================

export default function ClienteChatbotPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('7d')

  // Stats
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalLeads: 0,
    intentAlto: 0,
    avgTurns: 0
  })

  // ============================================
  // DATA FETCHING
  // ============================================

  useEffect(() => {
    fetchSessions()
  }, [dateFilter])

  const fetchSessions = async () => {
    setLoading(true)
    setError(null)

    try {
      // Calculate date range
      const now = new Date()
      let startDate = new Date()
      switch (dateFilter) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24)
          break
        case '7d':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(startDate.getDate() - 30)
          break
        case 'all':
          startDate = new Date('2024-01-01')
          break
      }

      const { data, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('*')
        .gte('started_at', startDate.toISOString())
        .order('started_at', { ascending: false })
        .limit(100)

      if (fetchError) {
        // Si la tabla no existe, mostrar mensaje amigable
        if (fetchError.code === 'PGRST205') {
          setError('Las tablas del ChatBot no están configuradas. Contacta al administrador.')
          setSessions([])
          return
        }
        throw fetchError
      }

      setSessions(data || [])

      // Calculate stats
      if (data) {
        const totalSessions = data.length
        const totalLeads = data.filter(s => s.email).length
        const intentAlto = data.filter(s => s.intent_score === 'alto').length
        const avgTurns = totalSessions > 0
          ? data.reduce((sum, s) => sum + (s.total_turns || 0), 0) / totalSessions
          : 0

        setStats({
          totalSessions,
          totalLeads,
          intentAlto,
          avgTurns: Math.round(avgTurns * 10) / 10
        })
      }

    } catch (err: any) {
      console.error('Error fetching sessions:', err)
      setError('Error al cargar las conversaciones')
    } finally {
      setLoading(false)
    }
  }

  const fetchSessionMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setSessionMessages(data || [])
      setSelectedSession(sessionId)
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  // ============================================
  // EXPORT
  // ============================================

  const exportCSV = () => {
    const headers = ['Fecha', 'Hora', 'Nombre', 'Email', 'Telefono', 'Empresa', 'Categoria', 'Intent', 'Turnos']
    const rows = sessions.map(s => [
      new Date(s.started_at).toLocaleDateString('es-CL'),
      new Date(s.started_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      s.nombre || '',
      s.email || '',
      s.telefono || '',
      s.empresa || '',
      s.categoria || '',
      s.intent_score,
      s.total_turns
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `chatbot-leads-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // ============================================
  // FILTERED SESSIONS
  // ============================================

  const filteredSessions = sessions.filter(s => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      s.nombre?.toLowerCase().includes(search) ||
      s.email?.toLowerCase().includes(search) ||
      s.empresa?.toLowerCase().includes(search) ||
      s.categoria?.toLowerCase().includes(search)
    )
  })

  // ============================================
  // RENDER
  // ============================================

  return (
    <CRMLayout title="ChatBot M&P" onRefresh={fetchSessions}>
      <div className="space-y-6">
        {/* Header con descripcion */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Conversaciones del ChatBot
              </h2>
              <p className="text-gray-600 mb-4">
                Visualiza las conversaciones que los visitantes tienen con el chatbot de tu landing page.
                Aqui puedes ver leads potenciales, preguntas frecuentes y nivel de interes.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600">Leads capturados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-600">Intent alto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-600">Conversaciones</span>
                </div>
              </div>
            </div>
            <button
              onClick={exportCSV}
              disabled={sessions.length === 0}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!error && (
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Conversaciones"
              value={stats.totalSessions}
              icon={MessageSquare}
              color="blue"
            />
            <StatCard
              title="Leads Capturados"
              value={stats.totalLeads}
              icon={Users}
              color="green"
            />
            <StatCard
              title="Intent Alto"
              value={stats.intentAlto}
              icon={Target}
              color="orange"
            />
            <StatCard
              title="Turnos Promedio"
              value={stats.avgTurns}
              icon={TrendingUp}
              color="purple"
            />
          </div>
        )}

        {/* Filters */}
        {!error && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
              {[
                { key: '24h', label: '24 horas' },
                { key: '7d', label: '7 dias' },
                { key: '30d', label: '30 dias' },
                { key: 'all', label: 'Todo' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setDateFilter(key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    dateFilter === key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-72 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-6">
            {/* Sessions List */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Sesiones Recientes</h3>
                <span className="text-sm text-gray-500">
                  {filteredSessions.length} conversaciones
                </span>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredSessions.length === 0 ? (
                  <div className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No hay conversaciones
                    </h4>
                    <p className="text-gray-500">
                      Las conversaciones del chatbot apareceran aqui
                    </p>
                  </div>
                ) : (
                  filteredSessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => fetchSessionMessages(session.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedSession === session.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {session.nombre || 'Visitante Anonimo'}
                            </span>
                            {session.email && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Lead
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              session.intent_score === 'alto' ? 'bg-orange-100 text-orange-700' :
                              session.intent_score === 'medio' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {session.intent_score}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {session.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {session.email}
                              </span>
                            )}
                            {session.telefono && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {session.telefono}
                              </span>
                            )}
                            {session.empresa && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {session.empresa}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(session.started_at).toLocaleDateString('es-CL')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(session.started_at).toLocaleTimeString('es-CL', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span>{session.total_turns} turnos</span>
                            {session.categoria && (
                              <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">
                                {session.categoria}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Conversation Detail */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Detalle de Conversacion</h3>
              </div>
              <div className="h-[556px] overflow-y-auto">
                {!selectedSession ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Selecciona una conversacion para ver el detalle
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {sessionMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`rounded-lg p-3 ${
                          msg.role === 'user'
                            ? 'bg-blue-50 ml-4'
                            : 'bg-gray-50 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${
                            msg.role === 'user' ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {msg.role === 'user' ? 'Visitante' : 'ChatBot'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(msg.created_at).toLocaleTimeString('es-CL', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          msg.role === 'user' ? 'text-blue-900' : 'text-gray-700'
                        }`}>
                          {msg.content.length > 300
                            ? msg.content.slice(0, 300) + '...'
                            : msg.content}
                        </p>
                        {msg.option_selected && (
                          <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Opcion: {msg.option_selected}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-gray-500">
              <span>ChatBot activo en: <strong className="text-gray-900">mulleryperez.cl</strong></span>
              <span>|</span>
              <span>Datos actualizados en tiempo real</span>
            </div>
            <a
              href="mailto:contacto@mulleryperez.cl"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Soporte
            </a>
          </div>
        </div>
      </div>
    </CRMLayout>
  )
}

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({
  title,
  value,
  icon: Icon,
  color
}: {
  title: string
  value: number | string
  icon: React.ElementType
  color: 'blue' | 'green' | 'orange' | 'purple'
}) {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' }
  }

  const colors = colorClasses[color]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
      <div className={`text-3xl font-bold ${colors.text}`}>{value}</div>
    </div>
  )
}
