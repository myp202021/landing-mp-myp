'use client'

/**
 * M&P ChatBot - Dashboard de Analytics
 * Panel de administración para revisar conversaciones y métricas
 */

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  Users,
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  Download,
  Search,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  Building2,
  User
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

interface DailyMetrics {
  fecha: string
  total_sessions: number
  leads: number
  escalaron: number
  avg_turns: number
  intent_alto: number
  intent_medio: number
  intent_bajo: number
}

interface TopNode {
  node_id: string
  categoria: string
  subcategoria: string
  visit_count: number
  unique_sessions: number
}

// ============================================
// COMPONENT
// ============================================

export default function ChatBotDashboard() {
  // State
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics[]>([])
  const [topNodes, setTopNodes] = useState<TopNode[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [sessionMessages, setSessionMessages] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('7d')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Stats calculados
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalLeads: 0,
    avgTurns: 0,
    intentAlto: 0,
    escalados: 0,
    conversionRate: 0
  })

  // ============================================
  // DATA FETCHING
  // ============================================

  useEffect(() => {
    fetchData()
  }, [dateFilter, categoryFilter])

  const fetchData = async () => {
    setLoading(true)

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
        case '90d':
          startDate.setDate(startDate.getDate() - 90)
          break
      }

      // Fetch sessions
      let sessionsQuery = supabase
        .from('chat_sessions')
        .select('*')
        .gte('started_at', startDate.toISOString())
        .order('started_at', { ascending: false })
        .limit(100)

      if (categoryFilter !== 'all') {
        sessionsQuery = sessionsQuery.eq('categoria', categoryFilter)
      }

      const { data: sessionsData } = await sessionsQuery
      if (sessionsData) {
        setSessions(sessionsData)

        // Calculate stats
        const totalSessions = sessionsData.length
        const totalLeads = sessionsData.filter(s => s.email).length
        const avgTurns = totalSessions > 0
          ? sessionsData.reduce((sum, s) => sum + (s.total_turns || 0), 0) / totalSessions
          : 0
        const intentAlto = sessionsData.filter(s => s.intent_score === 'alto').length
        const escalados = sessionsData.filter(s => s.escalo_humano).length
        const conversionRate = totalSessions > 0 ? (totalLeads / totalSessions) * 100 : 0

        setStats({
          totalSessions,
          totalLeads,
          avgTurns: Math.round(avgTurns * 10) / 10,
          intentAlto,
          escalados,
          conversionRate: Math.round(conversionRate * 10) / 10
        })
      }

      // Fetch daily metrics from view
      const { data: metricsData } = await supabase
        .from('chat_daily_metrics')
        .select('*')
        .gte('fecha', startDate.toISOString().split('T')[0])
        .order('fecha', { ascending: false })
        .limit(30)

      if (metricsData) {
        setDailyMetrics(metricsData)
      }

      // Fetch top nodes
      const { data: nodesData } = await supabase
        .from('chat_top_nodes')
        .select('*')
        .limit(20)

      if (nodesData) {
        setTopNodes(nodesData)
      }

    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSessionMessages = async (sessionId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (data) {
      setSessionMessages(data)
    }
    setSelectedSession(sessionId)
  }

  // ============================================
  // EXPORT
  // ============================================

  const exportCSV = () => {
    const headers = ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Empresa', 'Categoría', 'Intent', 'Turnos']
    const rows = sessions.map(s => [
      new Date(s.started_at).toLocaleDateString('es-CL'),
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
      ...rows.map(r => r.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `chatbot-sessions-${new Date().toISOString().split('T')[0]}.csv`
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ChatBot Analytics</h1>
            <p className="text-gray-500 text-sm">Métricas y conversaciones del asistente virtual</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            {['24h', '7d', '30d', '90d'].map(period => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  dateFilter === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period === '24h' ? '24 horas' :
                 period === '7d' ? '7 días' :
                 period === '30d' ? '30 días' : '90 días'}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todas las categorías</option>
            <option value="planes">Planes</option>
            <option value="precios">Precios</option>
            <option value="metodologia">Metodología</option>
            <option value="contrato">Contrato</option>
            <option value="marketing">Marketing</option>
            <option value="contacto">Contacto</option>
          </select>

          <div className="flex-1" />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <StatCard
            title="Sesiones"
            value={stats.totalSessions}
            icon={MessageSquare}
            color="blue"
          />
          <StatCard
            title="Leads"
            value={stats.totalLeads}
            icon={Users}
            color="green"
          />
          <StatCard
            title="Conversión"
            value={`${stats.conversionRate}%`}
            icon={Target}
            color="purple"
          />
          <StatCard
            title="Intent Alto"
            value={stats.intentAlto}
            icon={TrendingUp}
            color="orange"
          />
          <StatCard
            title="Escalados"
            value={stats.escalados}
            icon={ArrowUpRight}
            color="red"
          />
          <StatCard
            title="Turnos Prom."
            value={stats.avgTurns}
            icon={BarChart3}
            color="teal"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Sesiones Recientes</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {filteredSessions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay sesiones en el período seleccionado
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
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {session.nombre || 'Anónimo'}
                          </span>
                          {session.email && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Lead
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            session.intent_score === 'alto' ? 'bg-orange-100 text-orange-700' :
                            session.intent_score === 'medio' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {session.intent_score}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          {session.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {session.email}
                            </span>
                          )}
                          {session.empresa && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {session.empresa}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span>{new Date(session.started_at).toLocaleDateString('es-CL')} {new Date(session.started_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span>{session.total_turns} turnos</span>
                          {session.categoria && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{session.categoria}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Session Detail */}
            {selectedSession && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Conversación</h2>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
                  {sessionMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-50 text-blue-900 rounded-lg p-2 ml-8'
                          : 'bg-gray-50 text-gray-700 rounded-lg p-2 mr-8'
                      }`}
                    >
                      <span className="text-xs text-gray-400 block mb-1">
                        {msg.role === 'user' ? 'Usuario' : 'Bot'}
                      </span>
                      {msg.content.length > 200 ? msg.content.slice(0, 200) + '...' : msg.content}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Nodes */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Top Preguntas</h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                {topNodes.slice(0, 10).map((node, idx) => (
                  <div key={node.node_id} className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-400 w-5">{idx + 1}</span>
                      <div>
                        <span className="text-sm text-gray-900 capitalize">{node.subcategoria || node.categoria}</span>
                        <span className="text-xs text-gray-400 block capitalize">{node.categoria}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-blue-600">{node.visit_count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  color: string
}) {
  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-500' }
  }

  const colors = colorClasses[color] || colorClasses.blue

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${colors.icon}`} />
        </div>
      </div>
      <div className={`text-2xl font-bold ${colors.text}`}>{value}</div>
    </div>
  )
}
