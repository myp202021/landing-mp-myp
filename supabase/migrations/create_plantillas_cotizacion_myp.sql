-- Tabla para almacenar plantillas de cotización M&P
CREATE TABLE IF NOT EXISTS plantillas_cotizacion_myp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  contenido JSONB NOT NULL, -- Almacena todos los campos editables de la cotización
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_plantillas_cotizacion_nombre ON plantillas_cotizacion_myp(nombre);
CREATE INDEX idx_plantillas_cotizacion_activo ON plantillas_cotizacion_myp(activo);

-- Trigger para actualizar el campo actualizado_en
CREATE OR REPLACE FUNCTION update_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plantillas_cotizacion_myp_updated
  BEFORE UPDATE ON plantillas_cotizacion_myp
  FOR EACH ROW
  EXECUTE FUNCTION update_actualizado_en();

-- Insertar plantilla por defecto basada en Gesnex
INSERT INTO plantillas_cotizacion_myp (nombre, contenido) VALUES (
  'Plan de Campañas Digitales - Plantilla Base',
  '{
    "titulo": "PLAN DE CAMPAÑAS DIGITALES",
    "subtitulo": "Propuesta Comercial para [Cliente]",
    "cliente": {
      "nombre": "[Nombre del Cliente]",
      "contacto": "[Nombre Contacto]",
      "website": "www.cliente.com",
      "telefono": "+56 9 XXXX XXXX"
    },
    "objetivo": "Implementar un sistema de campañas digitales integradas y medibles, orientado a generar oportunidades comerciales calificadas (leads).",
    "alcance": [
      {
        "area": "Estrategia de campañas",
        "entregable": "Árbol de decisión M&P",
        "detalle": "Estructura estratégica con rutas de captación y priorización de audiencias."
      },
      {
        "area": "Campañas activas",
        "entregable": "Hasta 6 campañas mensuales",
        "detalle": "Demanda activa (Google Search), remarketing, posicionamiento de marca."
      },
      {
        "area": "Optimización y gestión",
        "entregable": "Seguimiento semanal",
        "detalle": "Análisis de métricas clave: CTR, CPL, CPA, conversión a lead calificado."
      },
      {
        "area": "Benchmark competitivo",
        "entregable": "Análisis semestral",
        "detalle": "Revisión de competencia digital cada 6 meses para ajustar estrategia."
      },
      {
        "area": "Reunión mensual",
        "entregable": "Revisión estratégica",
        "detalle": "Evaluación de desempeño, insights de campañas y ajustes en el árbol de decisión."
      }
    ],
    "kpis": [
      {
        "nombre": "CPL (Costo por Lead)",
        "frecuencia": "Semanal"
      },
      {
        "nombre": "Conversión a Lead Calificado",
        "frecuencia": "Semanal"
      },
      {
        "nombre": "Costo por Demo Agendada",
        "frecuencia": "Quincenal"
      },
      {
        "nombre": "Tasa de Conversión Lead→Cliente",
        "frecuencia": "Mensual"
      },
      {
        "nombre": "ROAS (Return on Ad Spend)",
        "frecuencia": "Mensual"
      }
    ],
    "equipo": [
      {
        "rol": "Paid Media Manager",
        "funcion": "Gestión estratégica y diaria de campañas, análisis de métricas, optimización de pujas y audiencias."
      },
      {
        "rol": "Asistente",
        "funcion": "Soporte operativo en configuración técnica, seguimiento de conversiones, actualización de dashboard."
      }
    ],
    "precio": {
      "concepto": "Plan de Campañas Digitales",
      "valor_mensual": 550000,
      "iva": 0.19,
      "duracion_minima_meses": 6,
      "forma_pago": "Mensual anticipado"
    }
  }'
);

COMMENT ON TABLE plantillas_cotizacion_myp IS 'Plantillas de cotización M&P con campos editables';
