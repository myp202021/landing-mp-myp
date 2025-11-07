-- Crear tabla de plantillas de cotización
CREATE TABLE IF NOT EXISTS plantillas_cotizacion (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  items_default JSONB DEFAULT '[]'::jsonb,
  notas_default TEXT,
  vigencia_dias_default INTEGER DEFAULT 15,
  descuento_default NUMERIC(12,2) DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_plantillas_activa ON plantillas_cotizacion(activa);
CREATE INDEX IF NOT EXISTS idx_plantillas_nombre ON plantillas_cotizacion(nombre);

-- Insertar plantillas por defecto
INSERT INTO plantillas_cotizacion (nombre, descripcion, items_default, notas_default, vigencia_dias_default, descuento_default) VALUES
(
  'Marketing Digital - Básico',
  'Paquete básico de marketing digital para PyMEs',
  '[
    {"descripcion": "Diseño y gestión de campañas Google Ads", "cantidad": 1, "precio": 350000},
    {"descripcion": "Gestión redes sociales (3 publicaciones/semana)", "cantidad": 1, "precio": 250000},
    {"descripcion": "Reportes mensuales de rendimiento", "cantidad": 1, "precio": 50000}
  ]'::jsonb,
  'Servicio incluye:\n- Asesoría estratégica inicial\n- Optimización continua de campañas\n- Soporte por email y WhatsApp\n\nVigencia de esta cotización: 15 días desde fecha de emisión.\nFormas de pago: Transferencia bancaria o depósito.',
  15,
  0
),
(
  'Marketing Digital - Premium',
  'Paquete completo de marketing digital para empresas',
  '[
    {"descripcion": "Diseño y gestión de campañas Google Ads (presupuesto >$500k)", "cantidad": 1, "precio": 500000},
    {"descripcion": "Gestión redes sociales (5 publicaciones/semana + stories)", "cantidad": 1, "precio": 400000},
    {"descripcion": "Email marketing (2 campañas/mes)", "cantidad": 1, "precio": 150000},
    {"descripcion": "Reportes semanales + reunión mensual", "cantidad": 1, "precio": 100000},
    {"descripcion": "Community management (respuesta a comentarios)", "cantidad": 1, "precio": 200000}
  ]'::jsonb,
  'Servicio Premium incluye:\n- Asesoría estratégica completa\n- Account Manager dedicado\n- Optimización diaria de campañas\n- Soporte prioritario 24/7\n- Análisis competitivo mensual\n\nVigencia de esta cotización: 15 días desde fecha de emisión.\nFormas de pago: Transferencia bancaria, depósito o cheque.',
  15,
  5
),
(
  'Desarrollo Web - Landing Page',
  'Diseño y desarrollo de landing page profesional',
  '[
    {"descripcion": "Diseño UX/UI personalizado", "cantidad": 1, "precio": 300000},
    {"descripcion": "Desarrollo responsive (mobile + desktop)", "cantidad": 1, "precio": 450000},
    {"descripcion": "Integración con Google Analytics y Meta Pixel", "cantidad": 1, "precio": 80000},
    {"descripcion": "Formulario de contacto + integración CRM", "cantidad": 1, "precio": 120000},
    {"descripcion": "Optimización SEO básica", "cantidad": 1, "precio": 100000}
  ]'::jsonb,
  'Proyecto incluye:\n- 2 rondas de revisiones de diseño\n- Hosting por 1 año (dominio no incluido)\n- Capacitación en gestión de contenidos\n- 1 mes de soporte técnico post-lanzamiento\n\nTiempo de entrega: 3-4 semanas.\nVigencia de esta cotización: 30 días desde fecha de emisión.\nFormas de pago: 50% al iniciar, 50% al entregar.',
  30,
  0
),
(
  'Consultoría - Auditoría Marketing',
  'Auditoría completa de estrategia de marketing digital',
  '[
    {"descripcion": "Análisis de campañas actuales (Google Ads, Meta, etc.)", "cantidad": 1, "precio": 400000},
    {"descripcion": "Auditoría de presencia digital (web, redes sociales)", "cantidad": 1, "precio": 300000},
    {"descripcion": "Análisis de competencia (5 competidores)", "cantidad": 1, "precio": 250000},
    {"descripcion": "Informe ejecutivo con recomendaciones", "cantidad": 1, "precio": 200000},
    {"descripcion": "Presentación de resultados (2 horas)", "cantidad": 1, "precio": 150000}
  ]'::jsonb,
  'Consultoría incluye:\n- Análisis profundo de métricas y KPIs\n- Identificación de oportunidades de mejora\n- Plan de acción con prioridades\n- Proyecciones de ROI\n- Documento PDF ejecutivo\n\nTiempo de entrega: 2 semanas.\nVigencia de esta cotización: 15 días desde fecha de emisión.\nForma de pago: 100% al confirmar servicio.',
  15,
  10
),
(
  'Servicio Personalizado',
  'Plantilla en blanco para cotizaciones personalizadas',
  '[
    {"descripcion": "Servicio o producto 1", "cantidad": 1, "precio": 0},
    {"descripcion": "Servicio o producto 2", "cantidad": 1, "precio": 0}
  ]'::jsonb,
  'Notas adicionales:\n\nVigencia de esta cotización: 15 días desde fecha de emisión.\nFormas de pago: A convenir con el cliente.',
  15,
  0
)
ON CONFLICT DO NOTHING;

-- Verificar
SELECT id, nombre, descripcion, activa FROM plantillas_cotizacion;
