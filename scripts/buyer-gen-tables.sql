-- Buyer Gen Tables para Supabase
-- Ejecutar en Supabase SQL Editor

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

-- Indices para mejor performance
CREATE INDEX IF NOT EXISTS idx_buyer_gen_sessions_industry ON buyer_gen_sessions(industry);
CREATE INDEX IF NOT EXISTS idx_buyer_gen_sessions_created ON buyer_gen_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_buyer_gen_leads_email ON buyer_gen_leads(email);
CREATE INDEX IF NOT EXISTS idx_buyer_gen_leads_created ON buyer_gen_leads(created_at DESC);

-- Habilitar RLS
ALTER TABLE buyer_gen_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_gen_leads ENABLE ROW LEVEL SECURITY;

-- Politicas para insercion publica (desde la landing)
CREATE POLICY "Allow public insert to buyer_gen_sessions" ON buyer_gen_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert to buyer_gen_leads" ON buyer_gen_leads
  FOR INSERT WITH CHECK (true);

-- Politicas para lectura solo autenticados (para analytics)
CREATE POLICY "Allow authenticated read buyer_gen_sessions" ON buyer_gen_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read buyer_gen_leads" ON buyer_gen_leads
  FOR SELECT USING (true);
