# Instrucciones para Configurar el CRM

## 1. Crear tabla de cotizaciones en Supabase

Ve a tu proyecto en Supabase → SQL Editor → New Query

Ejecuta el siguiente SQL:

```sql
-- Crear tabla de cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones (
  id SERIAL PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  lead_id INT8 REFERENCES leads(id) ON DELETE SET NULL,
  nombre_proyecto TEXT NOT NULL,
  cliente_nombre TEXT,
  cliente_email TEXT,
  cliente_empresa TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  descuento NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  notas TEXT,
  vigencia_dias INT DEFAULT 30,
  estado TEXT DEFAULT 'borrador',
  enviada_en TIMESTAMPTZ,
  aceptada_en TIMESTAMPTZ,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente ON cotizaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_lead ON cotizaciones(lead_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_cotizaciones_updated_at ON cotizaciones;
CREATE TRIGGER update_cotizaciones_updated_at
    BEFORE UPDATE ON cotizaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 2. Acceso al CRM

### Admin (Christopher):
- URL: https://www.mulleryperez.cl/crm
- Contraseña: `myp2025`
- Funciones:
  - Ver todos los leads de todos los clientes
  - Editar estado de leads (contactado, vendido, monto)
  - Ver listado de clientes
  - Ver todas las cotizaciones

### Clientes:
Cada cliente tiene su propia URL única:
- URL: https://www.mulleryperez.cl/cliente/[UUID]
- Ejemplo: https://www.mulleryperez.cl/cliente/02b52b98-c4b6-4359-97cd-d42b9230bb19

Cada cliente ve:
- Dashboard con métricas (total leads, tasa de contacto, tasa de conversión, monto total)
- Historial completo de sus leads
- Sus cotizaciones generadas

## 3. Configuración de Zapier

Ya está configurado en Zapier:

**Trigger:** Facebook Lead Ads - New Lead
**Action:** Webhooks by Zapier - POST

**URL:** https://www.mulleryperez.cl/api/leads/zapier

**Campos a enviar:**
- `client_id`: UUID del cliente (importante: debe existir en tabla clientes)
- `full_name`: Nombre completo del lead
- `email`: Email del lead
- `phone_number`: Teléfono del lead
- `form_id`: ID del formulario de Facebook
- `form_name`: Nombre del formulario
- `ad_id`: ID del anuncio (opcional)
- `ad_name`: Nombre del anuncio
- `campaign_id`: ID de la campaña (opcional)
- `campaign_name`: Nombre de la campaña

## 4. Agregar un Nuevo Cliente

### Opción 1: Desde el CRM Admin
1. Ve a https://www.mulleryperez.cl/crm
2. Ingresa con la contraseña
3. Ve a la pestaña "Clientes"
4. (Por ahora necesitas hacerlo manual en Supabase, pronto agregaremos botón "Nuevo Cliente")

### Opción 2: Directamente en Supabase
1. Ve a Supabase → Table Editor → clientes
2. Click "Insert row"
3. Completa:
   - `nombre`: Nombre del cliente
   - `email`: Email del cliente
   - `empresa`: Nombre de la empresa (opcional)
   - `telefono`: Teléfono (opcional)
   - `activo`: true
4. Copia el UUID generado

### Configurar Zapier para el nuevo cliente:
1. En Zapier, edita el Zap o crea uno nuevo
2. En el paso de Webhook, configura `client_id` con el UUID del cliente
3. Publica el Zap

## 5. Flujo de Trabajo

1. **Lead llega desde Facebook:**
   - Usuario llena formulario en Facebook Lead Ad
   - Zapier captura el lead automáticamente
   - Zapier envía POST a /api/leads/zapier con client_id
   - Lead se guarda en Supabase

2. **Christopher (Admin) gestiona el lead:**
   - Ve el lead en https://www.mulleryperez.cl/crm
   - Filtra por cliente si es necesario
   - Hace click en "Editar"
   - Marca como contactado y/o vendido
   - Agrega monto de venta si corresponde
   - Guarda cambios

3. **Cliente revisa sus métricas:**
   - Accede a su URL única
   - Ve dashboard con KPIs actualizados en tiempo real
   - Revisa historial de leads
   - Ve cotizaciones generadas

## 6. Próximas Mejoras

- [ ] Botón "Nuevo Cliente" en CRM admin
- [ ] Generador de cotizaciones integrado (sin logo M&P)
- [ ] Exportar leads a Excel/CSV
- [ ] Notificaciones por email cuando llega nuevo lead
- [ ] Filtros avanzados en historial de leads

## 7. Seguridad

**IMPORTANTE:**
- La contraseña admin (`myp2025`) está en el código. En producción deberías cambiarla o usar una variable de entorno.
- Las URLs de clientes son públicas si conoces el UUID. Para mayor seguridad, podrías agregar autenticación por email.
