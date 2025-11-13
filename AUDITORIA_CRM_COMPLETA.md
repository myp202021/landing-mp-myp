# 🔍 AUDITORÍA COMPLETA DEL CRM - NOVIEMBRE 2024

**Fecha**: 12 de Noviembre 2024
**Sistema**: CRM Müller & Pérez - Gestión de Leads Meta Ads
**Base de datos**: Supabase PostgreSQL
**Framework**: Next.js 14

---

## 📋 RESUMEN EJECUTIVO

Esta auditoría identifica **problemas críticos de seguridad**, archivos redundantes, inconsistencias en la base de datos y mejoras necesarias para el CRM.

### Hallazgos Principales:
- 🔴 **CRÍTICO**: Contraseña hardcodeada expuesta en múltiples archivos
- 🟠 **ALTO**: Archivos SQL duplicados y migraciones sin consolidar
- 🟠 **ALTO**: Falta sistema de recuperación de contraseñas
- 🟡 **MEDIO**: Archivos de login duplicados
- 🟡 **MEDIO**: Políticas RLS incompletas
- 🟢 **BAJO**: Optimizaciones de código pendientes

---

## 🔴 PROBLEMAS CRÍTICOS DE SEGURIDAD

### 1. Contraseña Admin Hardcodeada y Expuesta

**Ubicaciones encontradas:**
```
app/crm/login/page.tsx:162      Password: admin123
app/login/page.tsx              Password: admin123
supabase/migrations/20251028_simplify_auth.sql:98    crypt('admin123', gen_salt('bf'))
supabase/migrations/20251028_fix_admin_user.sql      crypt('admin123', gen_salt('bf'))
```

**Riesgo**: 🔴 CRÍTICO
- Contraseña expuesta en código fuente
- Visible en modo desarrollo para cualquier usuario
- Presente en múltiples archivos
- Misma contraseña en migraciones de producción

**Impacto**: Acceso no autorizado total al CRM, posible filtración de datos de clientes

**Solución requerida**:
- [ ] Eliminar credenciales hardcodeadas de archivos frontend
- [ ] Implementar sistema de primer login con cambio obligatorio de contraseña
- [ ] Agregar validación de fortaleza de contraseña
- [ ] Crear endpoint de cambio de contraseña
- [ ] Agregar logs de intentos de login fallidos

---

### 2. Sistema de Autenticación Incompleto

**Problemas detectados:**

#### No existe recuperación de contraseña
- Sin endpoint `/api/auth/forgot-password`
- Sin flujo de reset por email
- Sin tokens de recuperación temporal

#### No hay rotación de sesiones
- Cookie `mp_session` no expira adecuadamente
- No hay invalidación de sesiones antiguas
- Max-Age de 7 días sin renovación

#### Falta 2FA o métodos adicionales de autenticación
- Solo email + password
- Sin verificación de email
- Sin opciones de autenticación OAuth

**Solución requerida**:
- [ ] Implementar recuperación de contraseña por email (usando Resend)
- [ ] Crear tabla `password_reset_tokens` en Supabase
- [ ] Implementar verificación de email al crear usuario
- [ ] Agregar rate limiting en login (máx 5 intentos por IP)
- [ ] Considerar agregar 2FA opcional para admins

---

### 3. Políticas RLS (Row Level Security) Incompletas

**Archivo revisado**: `supabase/migrations/20251028_create_crm_schema.sql`

**Políticas existentes**: ✅ Correctas para `clientes`, `usuarios`, `leads`, `cargas`, `lead_audits`

**Faltantes**:
- ❌ `cotizaciones_crm` - NO tiene políticas RLS
- ❌ `sync_meta_logs` - NO tiene políticas RLS
- ❌ `catalogo_razones` - Debería ser solo lectura para clientes

**Riesgo**: 🟠 ALTO
- Clientes podrían ver cotizaciones de otros clientes
- Posible acceso a logs de sincronización de otros

**Solución requerida**:
- [ ] Habilitar RLS en `cotizaciones_crm`
- [ ] Crear políticas para `sync_meta_logs`
- [ ] Crear política de solo lectura para `catalogo_razones`

---

## 🟠 ARCHIVOS REDUNDANTES Y DUPLICADOS

### 1. Páginas de Login Duplicadas

**Ubicaciones:**
```
app/login/page.tsx          (Raíz del proyecto - NO CRM)
app/crm/login/page.tsx      (Login del CRM)
```

**Problema**: Confusión sobre cuál es el login principal. La página `/login` no pertenece al CRM pero tiene mismas credenciales.

**Solución**:
- [ ] **ELIMINAR** `app/login/page.tsx` si no se usa
- [ ] O redirigir automáticamente a `/crm/login`

---

### 2. Archivos SQL Sueltos en Root

**Archivos encontrados:**
```
reset-ids.sql                    350B  - Script temporal
supabase-add-inversion.sql       340B  - Ya migrado
supabase-cotizaciones-crm.sql    4.3K  - Ya migrado
supabase-inversiones.sql         2.6K  - Ya migrado
supabase-meta-integration.sql    2.4K  - Ya migrado
test-login.sql                   517B  - Script de prueba
```

**Problema**: Migraciones ya aplicadas pero archivos sueltos en root causan confusión.

**Solución**:
- [ ] **MOVER** todos los `.sql` a `supabase/migrations/` o `supabase/archived/`
- [ ] **ELIMINAR** scripts temporales (`reset-ids.sql`, `test-login.sql`)
- [ ] Mantener solo migraciones oficiales en `supabase/migrations/`

---

### 3. Scripts de Análisis de Duplicados (Recién creados)

**Archivos:**
```
scripts/analizar-duplicados.sql
scripts/analizar-duplicados.js
scripts/analizar-duplicados-simple.js
```

**Estado**: Scripts útiles pero hay 3 versiones. El `.sql` y `-simple.js` son suficientes.

**Solución**:
- [ ] Conservar `analizar-duplicados-simple.js` (funciona)
- [ ] Conservar `analizar-duplicados.sql` (útil para DB directa)
- [ ] **ELIMINAR** `analizar-duplicados.js` (requiere dependencias no instaladas)

---

### 4. Carpeta `cotizaciones/` en Root (Fuera del CRM)

**Contenido:**
```
cotizaciones/supabase-cotizaciones-mercator.sql
cotizaciones/supabase-cotizaciones-mercator-UPDATE.sql
```

**Problema**: Migraciones de otro proyecto (Mercator) mezcladas con CRM M&P.

**Solución**:
- [ ] **MOVER** a `projects/mercator/` o eliminar si no se usa
- [ ] Separar proyectos diferentes en carpetas distintas

---

### 5. Archivos de Inspección Temporales

**Archivos:**
```
inspect-all-rows.js
inspect.js
test-mapping.js
test-normalize.js
truncate-all.js
reset-sequence.js
```

**Problema**: Scripts de desarrollo/debugging en root.

**Solución**:
- [ ] **MOVER** a `scripts/dev/` o `scripts/debug/`
- [ ] Agregar a `.gitignore` si son temporales

---

## 🟡 PROBLEMAS DE BASE DE DATOS

### 1. Tabla `leads` - Constraints de Unicidad Problemáticos

**Schema actual** (`supabase/migrations/20251028_create_crm_schema.sql:78-79`):
```sql
CONSTRAINT unique_lead_email_fecha UNIQUE (cliente_id, email, fecha_ingreso),
CONSTRAINT unique_lead_telefono_fecha UNIQUE (cliente_id, telefono, fecha_ingreso)
```

**Problema**:
- Permite duplicados si la fecha difiere en **milisegundos**
- Un lead puede venir a las 10:00:00 y otro a 10:00:05 con mismo email y se considera único
- Meta puede enviar mismo lead en sync automático

**Solución propuesta**:
- [ ] Cambiar a `DATE_TRUNC('day', fecha_ingreso)` para comparar solo fecha (sin hora)
- [ ] O agregar columna `meta_lead_id` como UNIQUE si existe
- [ ] Agregar índice parcial para optimizar búsquedas de duplicados

```sql
-- Propuesta de migración
ALTER TABLE leads DROP CONSTRAINT IF EXISTS unique_lead_email_fecha;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS unique_lead_telefono_fecha;

-- Crear función para truncar fecha
CREATE OR REPLACE FUNCTION unique_lead_email_check()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM leads
    WHERE cliente_id = NEW.cliente_id
    AND email = NEW.email
    AND DATE(fecha_ingreso) = DATE(NEW.fecha_ingreso)
    AND id != COALESCE(NEW.id, 0)
  ) THEN
    RAISE EXCEPTION 'Lead con este email ya existe para esta fecha';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_unique_lead_email
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION unique_lead_email_check();
```

---

### 2. Tabla `usuarios` - Falta Índice en `cliente_id`

**Problema**: Búsquedas frecuentes de usuarios por cliente sin índice.

**Solución**:
```sql
CREATE INDEX IF NOT EXISTS idx_usuarios_cliente_id ON usuarios(cliente_id);
```

---

### 3. Tabla `cotizaciones_crm` - Sin Auditoría

**Problema**: No hay triggers de auditoría para cotizaciones (solo para leads).

**Solución**:
- [ ] Crear tabla `cotizaciones_audits`
- [ ] Agregar triggers INSERT/UPDATE/DELETE similares a `lead_audits`

---

### 4. Función `auth.uid()` en Triggers Puede Fallar

**Ubicación**: Triggers de auditoría usan `auth.uid()` de Supabase Auth.

**Problema**: Si usas autenticación custom (como ahora con `verificar_login`), `auth.uid()` retorna NULL.

**Solución**:
- [ ] Cambiar a usar `current_setting('app.current_user_id', true)`
- [ ] Configurar user_id en API antes de hacer operaciones
- [ ] O pasar `actor_user_id` explícitamente en cada INSERT/UPDATE

---

## 🟢 MEJORAS Y OPTIMIZACIONES

### 1. Implementar Gestión de Duplicados UI

**Archivo creado** (incompleto): `app/crm/duplicados/page.tsx`

**Propuesta**:
- [ ] Terminar página de gestión de duplicados
- [ ] Agregar endpoint API `/api/crm/duplicados` con:
  - `GET` - Listar grupos de duplicados
  - `POST /merge` - Fusionar duplicados
  - `DELETE` - Eliminar duplicados seleccionados
- [ ] Agregar sección en navegación del CRM

---

### 2. Logs y Monitoreo

**Faltantes**:
- ❌ No hay logs de acciones críticas (delete, bulk operations)
- ❌ No hay alertas de seguridad
- ❌ No hay dashboard de actividad

**Solución**:
- [ ] Crear tabla `security_logs` para eventos críticos
- [ ] Loggear: intentos fallidos de login, bulk deletes, cambios de permisos
- [ ] Agregar página `/crm/admin/logs` para admins

---

### 3. Validaciones de Entrada

**API actual**: Validaciones básicas pero sin sanitización profunda.

**Mejoras**:
- [ ] Agregar librería de validación (Zod, Yup)
- [ ] Validar emails con regex más estricto
- [ ] Sanitizar inputs para prevenir SQL Injection (aunque Supabase usa prepared statements)
- [ ] Validar teléfonos con formato internacional

---

### 4. Tests

**Estado actual**: ❌ No hay tests

**Propuesta**:
- [ ] Agregar Jest + Testing Library
- [ ] Tests unitarios para funciones de validación
- [ ] Tests de integración para APIs críticas (`/api/auth/login`, `/api/crm/upload`)
- [ ] Tests E2E con Playwright para flujo de login y upload

---

## 📝 PLAN DE EJECUCIÓN - MAÑANA (13 NOV 2024)

### ⏰ PRIORIDAD 1 - CRÍTICO (1-2 horas)

#### 1.1 Eliminar Contraseñas Hardcodeadas
```bash
# Archivos a modificar:
app/crm/login/page.tsx      # Quitar sección de credenciales
app/login/page.tsx          # Eliminar archivo completo
```

**Crear**: `app/api/auth/change-password/route.ts`
```typescript
export async function POST(req: NextRequest) {
  // Validar sesión actual
  // Validar password actual
  // Hashear nuevo password
  // Actualizar en DB
  // Forzar re-login
}
```

**Crear**: Primera migración forzada de cambio de contraseña:
```sql
-- supabase/migrations/20241113_force_password_change.sql
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS debe_cambiar_password BOOLEAN DEFAULT false;

UPDATE usuarios
SET debe_cambiar_password = true
WHERE email = 'admin@mulleryperez.cl';
```

---

#### 1.2 Implementar RLS Faltante
**Crear**: `supabase/migrations/20241113_add_missing_rls.sql`

```sql
-- RLS para cotizaciones_crm
ALTER TABLE cotizaciones_crm ENABLE ROW LEVEL SECURITY;

CREATE POLICY cotizaciones_select ON cotizaciones_crm
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = cotizaciones_crm.cliente_id
    )
  );

CREATE POLICY cotizaciones_insert ON cotizaciones_crm
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = cotizaciones_crm.cliente_id
    )
  );

-- Similar para UPDATE y DELETE...

-- RLS para sync_meta_logs
ALTER TABLE sync_meta_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY sync_logs_select ON sync_meta_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.cliente_id = sync_meta_logs.cliente_id
    )
  );

-- Catálogo de razones - solo lectura
ALTER TABLE catalogo_razones ENABLE ROW LEVEL SECURITY;

CREATE POLICY catalogo_read_all ON catalogo_razones
  FOR SELECT USING (true);
```

---

### ⏰ PRIORIDAD 2 - ALTO (2-3 horas)

#### 2.1 Limpiar Archivos Redundantes

**Script de limpieza**:
```bash
#!/bin/bash
# scripts/cleanup.sh

# Crear carpeta de archivo
mkdir -p supabase/archived

# Mover SQL sueltos del root
mv supabase-*.sql supabase/archived/
mv reset-ids.sql supabase/archived/
mv test-login.sql supabase/archived/

# Mover scripts temporales
mkdir -p scripts/debug
mv inspect*.js scripts/debug/
mv test-*.js scripts/debug/
mv truncate-all.js scripts/debug/

# Eliminar archivos duplicados
rm scripts/analizar-duplicados.js

# Mover proyecto Mercator
mkdir -p projects/mercator
mv cotizaciones/ projects/mercator/

# Eliminar login duplicado
rm -rf app/login/

echo "✅ Limpieza completada"
```

---

#### 2.2 Mejorar Constraints de Unicidad en Leads

**Crear**: `supabase/migrations/20241113_fix_lead_uniqueness.sql`

```sql
-- Eliminar constraints antiguos
ALTER TABLE leads DROP CONSTRAINT IF EXISTS unique_lead_email_fecha;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS unique_lead_telefono_fecha;

-- Función para normalizar email
CREATE OR REPLACE FUNCTION normalize_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(TRIM(email));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para normalizar teléfono
CREATE OR REPLACE FUNCTION normalize_phone(phone TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN regexp_replace(phone, '[^0-9+]', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger para detectar duplicado de email (mismo día)
CREATE OR REPLACE FUNCTION check_duplicate_lead_email()
RETURNS trigger AS $$
BEGIN
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    IF EXISTS (
      SELECT 1 FROM leads
      WHERE cliente_id = NEW.cliente_id
      AND normalize_email(email) = normalize_email(NEW.email)
      AND DATE(fecha_ingreso) = DATE(NEW.fecha_ingreso)
      AND id != COALESCE(NEW.id, 0)
    ) THEN
      RAISE EXCEPTION 'Lead con email % ya existe para esta fecha', NEW.email
        USING ERRCODE = '23505'; -- unique_violation
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para detectar duplicado de teléfono (mismo día)
CREATE OR REPLACE FUNCTION check_duplicate_lead_phone()
RETURNS trigger AS $$
BEGIN
  IF NEW.telefono IS NOT NULL AND NEW.telefono != '' THEN
    IF EXISTS (
      SELECT 1 FROM leads
      WHERE cliente_id = NEW.cliente_id
      AND normalize_phone(telefono) = normalize_phone(NEW.telefono)
      AND DATE(fecha_ingreso) = DATE(NEW.fecha_ingreso)
      AND id != COALESCE(NEW.id, 0)
    ) THEN
      RAISE EXCEPTION 'Lead con teléfono % ya existe para esta fecha', NEW.telefono
        USING ERRCODE = '23505';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_lead_email_dup
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION check_duplicate_lead_email();

CREATE TRIGGER check_lead_phone_dup
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION check_duplicate_lead_phone();
```

---

#### 2.3 Implementar Recuperación de Contraseña

**Crear tabla**:
```sql
-- supabase/migrations/20241113_password_reset.sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_reset_tokens_user ON password_reset_tokens(user_id);

-- Auto-eliminar tokens expirados
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < now() OR used = true;
END;
$$ LANGUAGE plpgsql;
```

**Crear API**:
```typescript
// app/api/auth/forgot-password/route.ts
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  // Buscar usuario
  const { data: user } = await supabase
    .from('usuarios')
    .select('id, email, nombre')
    .eq('email', email)
    .single()

  if (!user) {
    // No revelar si el email existe (seguridad)
    return NextResponse.json({
      message: 'Si el email existe, recibirás instrucciones'
    })
  }

  // Generar token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

  await supabase.from('password_reset_tokens').insert({
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString()
  })

  // Enviar email con Resend
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'CRM M&P <noreply@mulleryperez.cl>',
    to: email,
    subject: 'Recuperar contraseña - CRM M&P',
    html: `
      <h2>Recuperar contraseña</h2>
      <p>Hola ${user.nombre},</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${process.env.NEXT_PUBLIC_URL}/crm/reset-password?token=${token}">
        Restablecer contraseña
      </a>
      <p>Este enlace expira en 1 hora.</p>
    `
  })

  return NextResponse.json({
    message: 'Si el email existe, recibirás instrucciones'
  })
}
```

---

### ⏰ PRIORIDAD 3 - MEDIO (1-2 horas)

#### 3.1 Agregar Índices Faltantes
```sql
-- supabase/migrations/20241113_add_indexes.sql
CREATE INDEX IF NOT EXISTS idx_usuarios_cliente_id ON usuarios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente ON cotizaciones_crm(cliente_id);
```

#### 3.2 Crear Página de Gestión de Duplicados

- [ ] Completar `app/crm/duplicados/page.tsx`
- [ ] Crear API `/api/crm/duplicados/route.ts`
- [ ] Agregar link en navegación

#### 3.3 Logs de Seguridad

```sql
-- supabase/migrations/20241113_security_logs.sql
CREATE TABLE security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- login_failed, bulk_delete, permission_change, etc
  user_id UUID REFERENCES usuarios(id),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_security_logs_type ON security_logs(event_type);
CREATE INDEX idx_security_logs_user ON security_logs(user_id);
CREATE INDEX idx_security_logs_date ON security_logs(created_at DESC);
```

---

### ⏰ PRIORIDAD 4 - BAJO (Opcional)

- [ ] Agregar tests con Jest
- [ ] Implementar rate limiting en login
- [ ] Mejorar validaciones con Zod
- [ ] Dashboard de actividad para admins

---

## 📊 MÉTRICAS DE PROGRESO

### Checklist de Seguridad
- [ ] Contraseñas hardcodeadas eliminadas
- [ ] Sistema de cambio de contraseña implementado
- [ ] Recuperación de contraseña funcionando
- [ ] RLS habilitado en todas las tablas
- [ ] Logs de seguridad activos
- [ ] Rate limiting en login

### Checklist de Limpieza
- [ ] Archivos SQL movidos a carpeta correcta
- [ ] Scripts de debug organizados
- [ ] Login duplicado eliminado
- [ ] Proyecto Mercator separado
- [ ] Migraciones consolidadas

### Checklist de Base de Datos
- [ ] Constraints de unicidad corregidos
- [ ] Índices faltantes agregados
- [ ] Triggers de auditoría en todas las tablas
- [ ] Funciones de normalización implementadas

---

## 🎯 RESULTADO ESPERADO

Al finalizar estas tareas, el CRM tendrá:

✅ **Seguridad robusta**: Sin contraseñas expuestas, RLS completo, recuperación de contraseña
✅ **Código limpio**: Archivos organizados, sin duplicados
✅ **Base de datos sólida**: Constraints correctos, índices optimizados
✅ **Auditoría completa**: Logs de todas las acciones críticas
✅ **Gestión de duplicados**: Herramienta UI + scripts SQL

---

## 📌 NOTAS ADICIONALES

### Variables de Entorno Requeridas
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://eghqubmivhcwasxklwlc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Desde .env.production.local
RESEND_API_KEY=re_gAuPAEbW...
NEXT_PUBLIC_URL=http://localhost:3000  # o https://agencia.mulleryperez.cl
```

### Comandos Útiles

```bash
# Ejecutar migraciones nuevas
psql $DATABASE_URL -f supabase/migrations/20241113_*.sql

# Ver logs de Supabase
# (desde dashboard: Database > Logs)

# Ejecutar análisis de duplicados
node scripts/analizar-duplicados-simple.js

# Limpiar archivos
bash scripts/cleanup.sh
```

---

**Preparado por**: Claude Code
**Revisión requerida**: Christopher Müller
**Fecha límite**: 13 de Noviembre 2024

---
