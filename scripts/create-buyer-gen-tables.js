#!/usr/bin/env node

/**
 * Script para crear las tablas de Buyer Gen en Supabase
 * Ejecutar: node scripts/create-buyer-gen-tables.js
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://faitwrutauavjwnsnlzq.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY3NDcxNywiZXhwIjoyMDc3MjUwNzE3fQ.19K4-XCB-M6foGQ1b3yHXWUR9nyLR1R1dqHYVefGfx8'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function testAndCreateTables() {
  console.log('🔧 Verificando/creando tablas buyer_gen...\n')

  // Test 1: buyer_gen_sessions
  console.log('1. Verificando buyer_gen_sessions...')
  const { data: sessions, error: sessionsErr } = await supabase
    .from('buyer_gen_sessions')
    .select('id')
    .limit(1)

  if (sessionsErr) {
    console.log('   ❌ Tabla no existe - necesita crearse manualmente')
    console.log('   Error:', sessionsErr.message)
  } else {
    console.log('   ✅ Tabla existe')
  }

  // Test 2: buyer_gen_leads
  console.log('\n2. Verificando buyer_gen_leads...')
  const { data: leads, error: leadsErr } = await supabase
    .from('buyer_gen_leads')
    .select('id')
    .limit(1)

  if (leadsErr) {
    console.log('   ❌ Tabla no existe - necesita crearse manualmente')
    console.log('   Error:', leadsErr.message)
  } else {
    console.log('   ✅ Tabla existe')
  }

  // Si alguna tabla no existe, mostrar el SQL
  if (sessionsErr || leadsErr) {
    console.log('\n' + '─'.repeat(60))
    console.log('📋 EJECUTAR ESTE SQL EN SUPABASE DASHBOARD:')
    console.log('   https://supabase.com/dashboard/project/faitwrutauavjwnsnlzq/sql')
    console.log('─'.repeat(60))
    console.log(`
-- Tabla de sesiones de Buyer Gen
CREATE TABLE IF NOT EXISTS buyer_gen_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  industry VARCHAR(50) NOT NULL,
  business_model VARCHAR(20) NOT NULL,
  company_size VARCHAR(20),
  main_goal VARCHAR(50),
  monthly_budget VARCHAR(20),
  channels TEXT[],
  sales_cycle VARCHAR(20),
  personas_generated INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de leads de Buyer Gen
CREATE TABLE IF NOT EXISTS buyer_gen_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  industry VARCHAR(50),
  business_model VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE buyer_gen_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_gen_leads ENABLE ROW LEVEL SECURITY;

-- Politicas para insercion publica
CREATE POLICY "Allow public insert sessions" ON buyer_gen_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert leads" ON buyer_gen_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read sessions" ON buyer_gen_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public read leads" ON buyer_gen_leads FOR SELECT USING (true);
`)
    console.log('─'.repeat(60) + '\n')
  } else {
    console.log('\n✅ Todas las tablas existen correctamente!')
  }
}

testAndCreateTables().catch(console.error)
