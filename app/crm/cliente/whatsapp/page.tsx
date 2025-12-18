'use client'

import { useEffect, useState } from 'react'
import CRMLayout from '@/app/components/crm/CRMLayout'
import { supabase } from '@/lib/supabase'
import { useSimpleAuth } from '@/lib/auth/simple-auth'

interface Chatbot {
  id: string
  name: string
  description: string
  whatsapp_phone: string
  welcome_message: string
  flows: any[]
  active: boolean
  created_at: string
  _count?: {
    conversations: number
    completed: number
  }
}

export default function WhatsAppChatbotPage() {
  const { user } = useSimpleAuth()
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (user) {
      loadChatbots()
    }
  }, [user])

  async function loadChatbots() {
    try {
      setLoading(true)

      // Obtener cliente_id del usuario
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('username', user?.username)
        .single()

      if (clientError) throw clientError

      // Cargar chatbots
      const { data, error } = await supabase
        .from('client_chatbots')
        .select('*')
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Cargar estadísticas de conversaciones para cada chatbot
      const chatbotsWithStats = await Promise.all(
        (data || []).map(async (chatbot) => {
          const { data: convData } = await supabase
            .from('chatbot_conversations')
            .select('id, status')
            .eq('chatbot_id', chatbot.id)

          const total = convData?.length || 0
          const completed = convData?.filter(c => c.status === 'completed').length || 0

          return {
            ...chatbot,
            _count: {
              conversations: total,
              completed
            }
          }
        })
      )

      setChatbots(chatbotsWithStats)
    } catch (error) {
      console.error('Error loading chatbots:', error)
      alert('Error al cargar chatbots')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <CRMLayout title="WhatsApp Chatbot">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </CRMLayout>
    )
  }

  return (
    <CRMLayout title="WhatsApp Chatbot" onRefresh={loadChatbots}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🤖 Chatbot de WhatsApp
              </h2>
              <p className="text-gray-600 mb-4">
                Configura tu chatbot para capturar leads automáticamente vía WhatsApp.
                Guarda, normaliza y tabula datos de tus clientes potenciales.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600">Mensajes de texto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-600">Notas de voz</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-600">Datos normalizados</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
            >
              + Crear Chatbot
            </button>
          </div>
        </div>

        {/* Lista de Chatbots */}
        {chatbots.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes chatbots configurados
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer chatbot para empezar a capturar leads por WhatsApp
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Crear Primer Chatbot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chatbots.map((chatbot) => (
              <div
                key={chatbot.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {chatbot.name}
                      </h3>
                      {chatbot.active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                          Inactivo
                        </span>
                      )}
                    </div>
                    {chatbot.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {chatbot.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>📱</span>
                      <span>{chatbot.whatsapp_phone}</span>
                    </div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {chatbot._count?.conversations || 0}
                    </div>
                    <div className="text-xs text-gray-600">Conversaciones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {chatbot._count?.completed || 0}
                    </div>
                    <div className="text-xs text-gray-600">Completadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {chatbot.flows?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600">Preguntas</div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <a
                    href={`/crm/cliente/whatsapp/${chatbot.id}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium text-sm"
                  >
                    Ver Dashboard
                  </a>
                  <a
                    href={`/crm/cliente/whatsapp/${chatbot.id}/config`}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium text-sm"
                  >
                    Configurar
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documentación rápida */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📚 ¿Cómo funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900 mb-1">1. Configuración</div>
              <p className="text-gray-600">
                Crea tu chatbot y define las preguntas que quieres hacer a tus clientes.
              </p>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">2. Integración</div>
              <p className="text-gray-600">
                Conecta tu número de WhatsApp Business con la API de Meta.
              </p>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">3. Captura</div>
              <p className="text-gray-600">
                El chatbot captura automáticamente respuestas por texto o voz.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <a
              href="/WHATSAPP_SETUP.md"
              target="_blank"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              📖 Ver guía completa de configuración →
            </a>
          </div>
        </div>
      </div>

      {/* Modal Crear Chatbot - TODO */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Próximamente</h3>
            <p className="text-gray-600 mb-4">
              La interfaz de creación de chatbots está en desarrollo.
              Por favor contacta al administrador para configurar tu chatbot.
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </CRMLayout>
  )
}
