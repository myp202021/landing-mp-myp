# 🗄️ DATABASE SETUP - CRM Müller & Pérez

Este directorio contiene todos los scripts SQL necesarios para configurar la base de datos del CRM en Supabase.

---

## 🚨 PROBLEMA CRÍTICO RESUELTO

**Error anterior**: "Could not find the 'username' column of 'usuarios' in the schema cache"

**Causa**: La tabla `usuarios` no existía en la base de datos.

**Solución**: Ejecutar el script `update_schema_complete.sql` en Supabase.

---

## 📋 ARCHIVOS DISPONIBLES

### 1. `update_schema_complete.sql` ⭐ **RECOMENDADO**
**Propósito**: Script completo y actualizado que crea TODAS las tablas necesarias.

**Incluye**:
- ✅ Tabla `usuarios` (sistema de autenticación)
- ✅ Tabla `cotizaciones` (gestión de cotizaciones)
- ✅ Tabla `plantillas_cotizacion` (plantillas predefinidas)
- ✅ Triggers y funciones auxiliares
- ✅ Índices para optimización
- ✅ Usuario admin por defecto

**Cuándo usar**:
- Primera vez configurando la base de datos
- Después de un reset completo
- Para actualizar el schema con nuevas tablas

---

### 2. `create_usuarios_table.sql`
**Propósito**: Script específico para crear solo la tabla `usuarios`.

**Usa este script si**:
- Ya tienes las demás tablas configuradas
- Solo necesitas agregar la tabla de usuarios
- Estás actualizando de una versión antigua

---

### 3. `schema.sql`
**Propósito**: Documentación del schema anterior (solo cotizaciones y leads).

**Nota**: Este archivo es para referencia. Usa `update_schema_complete.sql` en su lugar.

---

### 4. `create_templates_table.sql`
**Propósito**: Script para crear la tabla `plantillas_cotizacion` con plantillas de ejemplo.

**Nota**: Ya incluido en `update_schema_complete.sql`

---

## 🚀 CÓMO EJECUTAR LOS SCRIPTS

### Opción 1: Supabase SQL Editor (Recomendado)

1. **Acceder a Supabase**:
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto
   - Ve a **SQL Editor** en el menú lateral

2. **Ejecutar script**:
   - Haz clic en **"+ New query"**
   - Copia y pega el contenido de `update_schema_complete.sql`
   - Haz clic en **"Run"** (Ejecutar)

3. **Verificar**:
   - Deberías ver un mensaje de éxito
   - Ve a **Table Editor** y verifica que las tablas existan:
     - `usuarios`
     - `cotizaciones`
     - `plantillas_cotizacion`

---

### Opción 2: Supabase CLI

```bash
# Conectar a tu proyecto
supabase link --project-ref tu-project-ref

# Ejecutar el script
psql postgresql://[TU_URL_SUPABASE] -f database/update_schema_complete.sql
```

---

## 📊 ESTRUCTURA DE LA TABLA `usuarios`

```sql
CREATE TABLE usuarios (
  id                SERIAL PRIMARY KEY,
  username          TEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  nombre            TEXT NOT NULL,
  rol               TEXT NOT NULL CHECK (rol IN ('admin', 'cliente')),
  cliente_id        UUID REFERENCES clientes(id) ON DELETE CASCADE,
  activo            BOOLEAN DEFAULT true,
  creado_en         TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en    TIMESTAMPTZ DEFAULT NOW()
);
```

### Campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | ID único autoincremental |
| `username` | TEXT | Nombre de usuario único |
| `password_hash` | TEXT | Contraseña (usar bcrypt en producción) |
| `nombre` | TEXT | Nombre completo del usuario |
| `rol` | TEXT | Rol: 'admin' o 'cliente' |
| `cliente_id` | UUID | ID del cliente asociado (solo para rol=cliente) |
| `activo` | BOOLEAN | Si el usuario puede acceder |
| `creado_en` | TIMESTAMPTZ | Fecha de creación |
| `actualizado_en` | TIMESTAMPTZ | Última actualización |

---

## 🔐 USUARIO ADMIN POR DEFECTO

El script `update_schema_complete.sql` crea automáticamente un usuario administrador:

- **Username**: `admin`
- **Password**: `2025Chile!`
- **Rol**: `admin`

**⚠️ IMPORTANTE EN PRODUCCIÓN**:
- Cambia la contraseña inmediatamente después del primer login
- Usa bcrypt para hashear contraseñas (actualmente guardadas en texto plano)

---

## 🔄 MIGRACIONES

Si ya tienes datos en las tablas y necesitas actualizar:

1. **Backup primero**:
   ```bash
   pg_dump -h [host] -U [user] -d [database] > backup_$(date +%Y%m%d).sql
   ```

2. **Ejecutar migración**:
   - Los scripts usan `CREATE TABLE IF NOT EXISTS`
   - No sobrescribirán tablas existentes
   - Solo agregarán las que falten

3. **Verificar datos**:
   ```sql
   -- Ver usuarios existentes
   SELECT id, username, nombre, rol, activo FROM usuarios;

   -- Contar registros
   SELECT
     'usuarios' as tabla, COUNT(*) as registros FROM usuarios
   UNION ALL
     SELECT 'cotizaciones', COUNT(*) FROM cotizaciones
   UNION ALL
     SELECT 'plantillas_cotizacion', COUNT(*) FROM plantillas_cotizacion;
   ```

---

## ✅ VERIFICACIÓN POST-INSTALACIÓN

Después de ejecutar los scripts, verifica que todo funcione:

### 1. Verificar tablas en Supabase

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('usuarios', 'cotizaciones', 'plantillas_cotizacion');
```

Deberías ver las 3 tablas listadas.

### 2. Verificar usuario admin

```sql
SELECT id, username, nombre, rol
FROM usuarios
WHERE username = 'admin';
```

Deberías ver el usuario admin creado.

### 3. Probar creación de usuario desde el CRM

1. Ve a `https://www.mulleryperez.cl/crm/usuarios`
2. Login como admin (`admin` / `2025Chile!`)
3. Haz clic en **"+ Nuevo Usuario"**
4. Crea un usuario de prueba
5. Si se crea exitosamente, ¡todo funciona! ✅

---

## 🐛 TROUBLESHOOTING

### Error: "relation 'clientes' does not exist"

**Problema**: La tabla `clientes` no existe en tu base de datos.

**Solución**:
```sql
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  rubro TEXT,
  email TEXT,
  inversion_mensual NUMERIC(12,2),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);
```

### Error: "function uuid_generate_v4() does not exist"

**Problema**: La extensión UUID no está habilitada.

**Solución**:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Error: "permission denied"

**Problema**: No tienes permisos suficientes.

**Solución**:
- Asegúrate de estar usando `SUPABASE_SERVICE_ROLE_KEY`
- Verifica que el usuario tenga permisos de escritura
- Ejecuta desde Supabase SQL Editor (ya tiene permisos)

---

## 📞 SOPORTE

Si tienes problemas:

1. **Revisa los logs de Supabase**: Dashboard → Logs
2. **Verifica las variables de entorno**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. **Contacta al desarrollador**: Christopher Müller

---

## 🔄 ACTUALIZACIONES FUTURAS

Cuando agregues nuevas tablas o campos:

1. Crea un nuevo archivo SQL: `database/migration_YYYYMMDD_descripcion.sql`
2. Documenta los cambios en este README
3. Actualiza `update_schema_complete.sql` con los nuevos cambios

---

✅ **¡Base de datos configurada correctamente! Ahora puedes crear usuarios desde el CRM Admin.**
