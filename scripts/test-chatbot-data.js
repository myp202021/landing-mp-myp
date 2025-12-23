#!/usr/bin/env node

/**
 * Script para insertar datos de prueba del ChatBot en Supabase
 * Simula conversaciones reales para probar el dashboard
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://faitwrutauavjwnsnlzq.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY3NDcxNywiZXhwIjoyMDc3MjUwNzE3fQ.19K4-XCB-M6foGQ1b3yHXWUR9nyLR1R1dqHYVefGfx8'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Datos de prueba - simular diferentes conversaciones
const testSessions = [
  {
    categoria: 'planes',
    subcategoria: 'plan_silver',
    intent_score: 'alto',
    nombre: 'Juan Perez',
    email: 'juan.perez@empresa.cl',
    telefono: '+56912345678',
    empresa: 'Tech Solutions SpA',
    total_turns: 8,
    messages: [
      { role: 'assistant', content: 'Hola, soy el asistente de M&P. ¿En que te puedo ayudar?', node_id: 'root' },
      { role: 'user', content: 'Planes y servicios', node_id: 'root', option_selected: 'planes' },
      { role: 'assistant', content: 'Tenemos 5 planes segun tus necesidades...', node_id: 'planes_menu' },
      { role: 'user', content: 'Plan Silver ($750.000)', node_id: 'planes_menu', option_selected: 'plan_silver' },
      { role: 'assistant', content: 'Plan Silver - $750.000 + IVA/mes...', node_id: 'plan_silver' },
      { role: 'user', content: 'Agendar reunion', node_id: 'plan_silver', option_selected: 'agendar' },
      { role: 'assistant', content: 'Dejanos tus datos...', node_id: 'agendar_reunion' },
      { role: 'assistant', content: 'Listo! Tu solicitud fue enviada...', node_id: 'agendar_confirmacion' }
    ]
  },
  {
    categoria: 'precios',
    subcategoria: 'resumen',
    intent_score: 'medio',
    nombre: 'Maria Garcia',
    email: 'maria@startup.cl',
    empresa: 'Startup Innovadora',
    total_turns: 5,
    messages: [
      { role: 'assistant', content: 'Hola, soy el asistente de M&P...', node_id: 'root' },
      { role: 'user', content: 'Precios', node_id: 'root', option_selected: 'precios' },
      { role: 'assistant', content: 'Que quieres saber sobre precios?', node_id: 'precios_menu' },
      { role: 'user', content: 'Resumen de precios', node_id: 'precios_menu', option_selected: 'precios_resumen' },
      { role: 'assistant', content: 'Precios M&P 2025...', node_id: 'precios_resumen' }
    ]
  },
  {
    categoria: 'metodologia',
    subcategoria: 'proceso',
    intent_score: 'bajo',
    total_turns: 3,
    messages: [
      { role: 'assistant', content: 'Hola, soy el asistente de M&P...', node_id: 'root' },
      { role: 'user', content: 'Como trabajamos', node_id: 'root', option_selected: 'metodologia' },
      { role: 'assistant', content: 'Que quieres saber sobre como trabajamos?', node_id: 'metodologia_menu' }
    ]
  },
  {
    categoria: 'planes',
    subcategoria: 'plan_gold',
    intent_score: 'alto',
    nombre: 'Carlos Rodriguez',
    email: 'carlos@empresa.cl',
    telefono: '+56987654321',
    empresa: 'Importadora ABC',
    total_turns: 7,
    messages: [
      { role: 'assistant', content: 'Hola, soy el asistente de M&P...', node_id: 'root' },
      { role: 'user', content: 'Planes y servicios', node_id: 'root', option_selected: 'planes' },
      { role: 'assistant', content: 'Tenemos 5 planes...', node_id: 'planes_menu' },
      { role: 'user', content: 'Plan Gold ($1.200.000)', node_id: 'planes_menu', option_selected: 'plan_gold' },
      { role: 'assistant', content: 'Plan Gold - $1.200.000 + IVA/mes...', node_id: 'plan_gold' },
      { role: 'user', content: 'Agendar reunion', node_id: 'plan_gold', option_selected: 'agendar' },
      { role: 'assistant', content: 'Listo! Tu solicitud fue enviada...', node_id: 'agendar_confirmacion' }
    ]
  },
  {
    categoria: 'contacto',
    subcategoria: 'whatsapp',
    intent_score: 'medio',
    total_turns: 4,
    messages: [
      { role: 'assistant', content: 'Hola, soy el asistente de M&P...', node_id: 'root' },
      { role: 'user', content: 'Contactar a M&P', node_id: 'root', option_selected: 'contacto' },
      { role: 'assistant', content: 'Como prefieres contactarnos?', node_id: 'contacto_menu' },
      { role: 'user', content: 'WhatsApp', node_id: 'contacto_menu', option_selected: 'contacto_whatsapp' }
    ]
  }
]

async function insertTestData() {
  console.log('🧪 Insertando datos de prueba del ChatBot...\n')

  for (let i = 0; i < testSessions.length; i++) {
    const session = testSessions[i]

    // Crear sesion
    const { data: sessionData, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({
        categoria: session.categoria,
        subcategoria: session.subcategoria,
        intent_score: session.intent_score,
        nombre: session.nombre || null,
        email: session.email || null,
        telefono: session.telefono || null,
        empresa: session.empresa || null,
        total_messages: session.messages.length,
        total_turns: session.total_turns,
        user_agent: 'Mozilla/5.0 (Test Script)',
        landing_page: 'https://www.mulleryperez.cl',
        started_at: new Date(Date.now() - (i * 3600000)).toISOString() // Espaciar por horas
      })
      .select('id')
      .single()

    if (sessionError) {
      console.error(`❌ Error creando sesion ${i + 1}:`, sessionError.message)
      continue
    }

    console.log(`✅ Sesion ${i + 1} creada: ${sessionData.id}`)
    console.log(`   Categoria: ${session.categoria} | Intent: ${session.intent_score}`)
    if (session.nombre) console.log(`   Lead: ${session.nombre} (${session.email})`)

    // Insertar mensajes
    for (const msg of session.messages) {
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionData.id,
          role: msg.role,
          content: msg.content,
          node_id: msg.node_id,
          option_selected: msg.option_selected || null,
          categoria: session.categoria,
          subcategoria: session.subcategoria
        })

      if (msgError) {
        console.error(`   ❌ Error insertando mensaje:`, msgError.message)
      }
    }

    console.log(`   📝 ${session.messages.length} mensajes insertados\n`)
  }

  console.log('─'.repeat(50))
  console.log('✅ Datos de prueba insertados correctamente!')
  console.log('   Ahora puedes verificar el dashboard en:')
  console.log('   https://www.mulleryperez.cl/crm/cliente/chatbot\n')
}

insertTestData().catch(console.error)
