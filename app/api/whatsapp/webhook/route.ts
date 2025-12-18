/**
 * WhatsApp Business API Webhook
 * Recibe mensajes de WhatsApp y procesa conversaciones
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Configuración
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'myp_webhook_token_2024'
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

// GET: Verificación de webhook (Meta lo llama una vez al configurar)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado correctamente')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

// POST: Recibe mensajes de WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📨 Webhook recibido:', JSON.stringify(body, null, 2))

    // Verificar que es un mensaje válido
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 })
    }

    // Extraer datos del mensaje
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value?.messages) {
      return NextResponse.json({ status: 'no_messages' }, { status: 200 })
    }

    const message = value.messages[0]
    const from = message.from // Número de teléfono del usuario
    const messageId = message.id
    const timestamp = message.timestamp

    // Tipos de mensaje soportados
    let messageText = ''
    let messageType = message.type
    let audioId = null

    switch (messageType) {
      case 'text':
        messageText = message.text.body
        break

      case 'audio':
        audioId = message.audio.id
        messageText = '[Audio recibido]'
        // TODO: Convertir audio a texto con Whisper API
        break

      case 'button':
        messageText = message.button.text
        break

      case 'interactive':
        messageText = message.interactive.button_reply?.title || message.interactive.list_reply?.title || ''
        break

      default:
        messageText = `[Mensaje tipo ${messageType} no soportado]`
    }

    console.log(`💬 Mensaje de ${from}: ${messageText}`)

    // Buscar chatbot del cliente según el número de WhatsApp
    const { data: chatbot, error: chatbotError } = await supabase
      .from('client_chatbots')
      .select('*, clients(*)')
      .eq('whatsapp_phone', value.metadata.display_phone_number)
      .eq('active', true)
      .single()

    if (chatbotError || !chatbot) {
      console.log('⚠️ No se encontró chatbot para este número')
      // Enviar mensaje de error
      await sendWhatsAppMessage(from, 'Lo siento, este servicio no está disponible.')
      return NextResponse.json({ status: 'no_chatbot' }, { status: 200 })
    }

    // Buscar o crear conversación
    let { data: conversation, error: convError } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('chatbot_id', chatbot.id)
      .eq('user_phone', from)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (convError || !conversation) {
      // Crear nueva conversación
      const { data: newConv, error: createError } = await supabase
        .from('chatbot_conversations')
        .insert({
          chatbot_id: chatbot.id,
          user_phone: from,
          status: 'active',
          messages: [],
          captured_data: {},
          current_step: 0
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creando conversación:', createError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

      conversation = newConv

      // Enviar mensaje de bienvenida
      await sendWhatsAppMessage(from, chatbot.welcome_message || '¡Hola! ¿En qué puedo ayudarte?')
    }

    // Agregar mensaje a la conversación
    const messages = conversation.messages || []
    messages.push({
      id: messageId,
      from,
      text: messageText,
      type: messageType,
      audio_id: audioId,
      timestamp: new Date(parseInt(timestamp) * 1000).toISOString()
    })

    // Procesar respuesta según el flujo del chatbot
    const response = await processConversation(chatbot, conversation, messageText)

    // Actualizar conversación en BD
    const { error: updateError } = await supabase
      .from('chatbot_conversations')
      .update({
        messages,
        captured_data: response.capturedData,
        current_step: response.nextStep,
        status: response.completed ? 'completed' : 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', conversation.id)

    if (updateError) {
      console.error('Error actualizando conversación:', updateError)
    }

    // Enviar respuesta al usuario
    if (response.message) {
      await sendWhatsAppMessage(from, response.message)
    }

    return NextResponse.json({ status: 'success' }, { status: 200 })

  } catch (error) {
    console.error('❌ Error procesando webhook:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Enviar mensaje de WhatsApp
async function sendWhatsAppMessage(to: string, text: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Error enviando mensaje:', data)
      return null
    }

    console.log('✅ Mensaje enviado:', data.messages?.[0]?.id)
    return data
  } catch (error) {
    console.error('❌ Error enviando mensaje WhatsApp:', error)
    return null
  }
}

// Procesar conversación según flujo del chatbot
async function processConversation(
  chatbot: any,
  conversation: any,
  userMessage: string
) {
  const flows = chatbot.flows || []
  const currentStep = conversation.current_step || 0
  const capturedData = conversation.captured_data || {}

  // Si no hay flujos configurados
  if (flows.length === 0) {
    return {
      message: 'Gracias por tu mensaje. Pronto te contactaremos.',
      capturedData,
      nextStep: currentStep,
      completed: true
    }
  }

  // Obtener pregunta actual
  const currentQuestion = flows[currentStep]

  if (!currentQuestion) {
    // Flujo completado
    return {
      message: '✅ ¡Gracias! Hemos registrado tu información. Pronto nos pondremos en contacto.',
      capturedData,
      nextStep: currentStep,
      completed: true
    }
  }

  // Guardar respuesta del usuario
  const fieldName = currentQuestion.field_name
  capturedData[fieldName] = {
    value: userMessage,
    question: currentQuestion.question,
    timestamp: new Date().toISOString()
  }

  // Avanzar al siguiente paso
  const nextStep = currentStep + 1
  const nextQuestion = flows[nextStep]

  return {
    message: nextQuestion ? nextQuestion.question : '✅ ¡Gracias! Hemos registrado tu información.',
    capturedData,
    nextStep,
    completed: !nextQuestion
  }
}
