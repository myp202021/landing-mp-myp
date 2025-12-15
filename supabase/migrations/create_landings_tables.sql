-- ============================================
-- TABLAS PARA LANDING PAGE BUILDER
-- Piloto con cliente Arturo
-- ============================================

-- Tabla principal de landings
CREATE TABLE IF NOT EXISTS client_landings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    destack_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    published BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_client_slug UNIQUE(client_id, slug),
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Tabla para assets (imágenes, archivos)
CREATE TABLE IF NOT EXISTS landing_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landing_id UUID NOT NULL REFERENCES client_landings(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Index para búsquedas rápidas
    CONSTRAINT fk_landing FOREIGN KEY (landing_id) REFERENCES client_landings(id)
);

-- Tabla para analytics básicos
CREATE TABLE IF NOT EXISTS landing_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landing_id UUID NOT NULL REFERENCES client_landings(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    form_submissions INTEGER DEFAULT 0,

    -- Una fila por landing por día
    CONSTRAINT unique_landing_date UNIQUE(landing_id, visit_date)
);

-- Índices para performance
CREATE INDEX idx_landings_client ON client_landings(client_id);
CREATE INDEX idx_landings_slug ON client_landings(slug);
CREATE INDEX idx_landings_published ON client_landings(published);
CREATE INDEX idx_assets_landing ON landing_assets(landing_id);
CREATE INDEX idx_analytics_landing ON landing_analytics(landing_id);
CREATE INDEX idx_analytics_date ON landing_analytics(visit_date);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_landings_updated_at
    BEFORE UPDATE ON client_landings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE client_landings ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Los clientes solo ven SUS landings
CREATE POLICY "Clientes pueden ver sus landings"
    ON client_landings FOR SELECT
    USING (auth.uid()::text = client_id::text);

CREATE POLICY "Clientes pueden crear sus landings"
    ON client_landings FOR INSERT
    WITH CHECK (auth.uid()::text = client_id::text);

CREATE POLICY "Clientes pueden actualizar sus landings"
    ON client_landings FOR UPDATE
    USING (auth.uid()::text = client_id::text);

CREATE POLICY "Clientes pueden eliminar sus landings"
    ON client_landings FOR DELETE
    USING (auth.uid()::text = client_id::text);

-- Políticas para assets
CREATE POLICY "Clientes pueden ver assets de sus landings"
    ON landing_assets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM client_landings
            WHERE client_landings.id = landing_assets.landing_id
            AND client_landings.client_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Clientes pueden crear assets en sus landings"
    ON landing_assets FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM client_landings
            WHERE client_landings.id = landing_assets.landing_id
            AND client_landings.client_id::text = auth.uid()::text
        )
    );

-- Políticas para analytics (solo lectura para clientes)
CREATE POLICY "Clientes pueden ver analytics de sus landings"
    ON landing_analytics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM client_landings
            WHERE client_landings.id = landing_analytics.landing_id
            AND client_landings.client_id::text = auth.uid()::text
        )
    );

-- Función para incrementar page views (pública, sin auth)
CREATE OR REPLACE FUNCTION increment_landing_view(landing_uuid UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO landing_analytics (landing_id, visit_date, page_views, unique_visitors)
    VALUES (landing_uuid, CURRENT_DATE, 1, 1)
    ON CONFLICT (landing_id, visit_date)
    DO UPDATE SET
        page_views = landing_analytics.page_views + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON TABLE client_landings IS 'Landing pages creadas por clientes usando Destack builder';
COMMENT ON TABLE landing_assets IS 'Assets (imágenes, videos) de las landing pages';
COMMENT ON TABLE landing_analytics IS 'Métricas básicas de visitas por landing';

COMMENT ON COLUMN client_landings.destack_config IS 'Configuración JSON de Destack (componentes, estilos, etc.)';
COMMENT ON COLUMN client_landings.slug IS 'URL amigable para la landing (solo lowercase, números y guiones)';
COMMENT ON COLUMN client_landings.published IS 'Si false, la landing no es accesible públicamente';
