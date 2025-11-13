# 📅 PLAN DE EJECUCIÓN - 13 NOVIEMBRE 2024

**Tiempo estimado total**: 4-6 horas
**Prioridad**: CRÍTICO - Seguridad

---

## ✅ CHECKLIST RÁPIDO

### Fase 1: Seguridad (CRÍTICO) - 2h
- [ ] Ejecutar migración de RLS faltante
- [ ] Ejecutar migración de cambio de contraseña
- [ ] Ejecutar migración de logs de seguridad
- [ ] Eliminar credenciales hardcodeadas del frontend
- [ ] Crear endpoint de cambio de contraseña
- [ ] Probar sistema de cambio de contraseña

### Fase 2: Base de Datos (ALTO) - 1-2h
- [ ] Ejecutar migración de constraints de unicidad
- [ ] Verificar que RLS funciona correctamente
- [ ] Probar detección de duplicados mejorada

### Fase 3: Limpieza de Archivos (MEDIO) - 1h
- [ ] Ejecutar script de limpieza
- [ ] Verificar que aplicación sigue funcionando
- [ ] Commit y push de cambios

### Fase 4: Testing (BAJO) - 1h
- [ ] Probar login con credenciales
- [ ] Probar cambio de contraseña
- [ ] Probar upload de leads
- [ ] Verificar duplicados no se insertan

---

## 🚀 EJECUCIÓN PASO A PASO

### PASO 1: Backup de Seguridad

```bash
# Conectar a Supabase desde dashboard
# SQL Editor > New query

-- Exportar datos críticos
COPY (SELECT * FROM usuarios) TO '/tmp/usuarios_backup.csv' CSV HEADER;
COPY (SELECT * FROM clientes) TO '/tmp/clientes_backup.csv' CSV HEADER;
COPY (SELECT COUNT(*) FROM leads) TO '/tmp/leads_count.txt';
```

**Verificar**: Guardar estos archivos localmente

---

### PASO 2: Ejecutar Migraciones de Seguridad

**Orden de ejecución**:

1. **RLS Faltante** (PRIMERO - más importante)
```bash
# Desde Supabase Dashboard > SQL Editor
# Copiar y pegar: supabase/migrations/20241113_add_missing_rls.sql
```

**Verificar**:
```sql
-- Debe retornar TRUE para todas las tablas críticas
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('cotizaciones_crm', 'sync_meta_logs', 'catalogo_razones');
```

2. **Sistema de Contraseñas**
```bash
# Copiar y pegar: supabase/migrations/20241113_force_password_change.sql
```

**Verificar**:
```sql
-- Debe mostrar que admin debe cambiar password
SELECT email, debe_cambiar_password FROM usuarios;
```

3. **Logs de Seguridad**
```bash
# Copiar y pegar: supabase/migrations/20241113_security_logs.sql
```

**Verificar**:
```sql
-- Debe retornar filas (logs de creación de usuarios)
SELECT * FROM security_logs ORDER BY created_at DESC LIMIT 5;
```

4. **Constraints de Unicidad**
```bash
# Copiar y pegar: supabase/migrations/20241113_fix_lead_uniqueness.sql
```

**Verificar**:
```sql
-- Test: Intentar insertar duplicado (debe fallar)
-- Cambiar cliente_id por uno real
INSERT INTO leads (cliente_id, email, fecha_ingreso)
VALUES ('00000000-0000-0000-0000-000000000001', 'test@test.com', NOW());

-- Segundo intento (debe dar error)
INSERT INTO leads (cliente_id, email, fecha_ingreso)
VALUES ('00000000-0000-0000-0000-000000000001', 'test@test.com', NOW());

-- Limpiar test
DELETE FROM leads WHERE email = 'test@test.com';
```

---

### PASO 3: Eliminar Contraseñas del Frontend

**Archivos a modificar**:

1. **app/crm/login/page.tsx**

```typescript
// ELIMINAR estas líneas (157-163):
{process.env.NODE_ENV === 'development' && (
  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-xs text-yellow-800">
    <p className="font-semibold mb-1">Credenciales por defecto:</p>
    <p>Email: admin@mulleryperez.cl</p>
    <p>Password: admin123</p>
  </div>
)}
```

2. **Eliminar app/login/page.tsx completo**

```bash
rm -rf app/login
```

**Verificar**: Aplicación sigue funcionando en `http://localhost:3000/crm/login`

---

### PASO 4: Crear Endpoint de Cambio de Contraseña

**Crear**: `app/api/auth/change-password/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Obtener sesión actual
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('mp_session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const { oldPassword, newPassword } = await req.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Contraseñas requeridas' },
        { status: 400 }
      )
    }

    // Llamar a función SQL de cambio de contraseña
    const { data, error } = await supabase.rpc('cambiar_password', {
      p_user_id: session.userId,
      p_old_password: oldPassword,
      p_new_password: newPassword
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

---

### PASO 5: Crear Página de Cambio de Contraseña

**Crear**: `app/crm/cambiar-password/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CambiarPasswordPage() {
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/crm/login')
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-green-900 mb-2">
            ✅ Contraseña actualizada
          </h2>
          <p className="text-green-700">
            Redirigiendo al login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Cambiar Contraseña
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres, con letras y números
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

---

### PASO 6: Limpieza de Archivos

```bash
# Hacer ejecutable el script
chmod +x scripts/cleanup.sh

# Ejecutar limpieza
./scripts/cleanup.sh
```

**Verificar**: Que la aplicación siga funcionando después de mover archivos

---

### PASO 7: Testing Final

**Checklist de pruebas**:

1. **Login**
```bash
# Abrir http://localhost:3000/crm/login
# Intentar login con admin@mulleryperez.cl / admin123
# Debe pedir cambio de contraseña
```

2. **Cambio de contraseña**
```bash
# Ir a /crm/cambiar-password
# Cambiar a una contraseña nueva (ej: AdminSeguro2024!)
```

3. **Re-login**
```bash
# Cerrar sesión
# Login con nueva contraseña
# Debe funcionar
```

4. **Upload de leads**
```bash
# Ir a /crm/upload
# Subir archivo CSV de prueba
# Verificar que detecta duplicados
```

5. **RLS**
```bash
# Desde SQL Editor:
SELECT * FROM cotizaciones_crm;
# Solo debe mostrar cotizaciones del cliente autenticado
```

---

### PASO 8: Commit y Deploy

```bash
git add .
git commit -m "🔒 Seguridad: RLS completo, cambio de contraseña, logs

- Agregar RLS faltante en cotizaciones_crm y sync_meta_logs
- Implementar sistema de cambio de contraseña forzado
- Agregar logs de seguridad para eventos críticos
- Mejorar constraints de unicidad en leads (por fecha, no hora)
- Eliminar credenciales hardcodeadas
- Limpiar archivos redundantes
- Organizar migraciones SQL

BREAKING CHANGES:
- Usuario admin debe cambiar contraseña en próximo login
- Detección de duplicados ahora por fecha (no timestamp exacto)"

git push origin main
```

**Deploy automático** si tienes Vercel conectado

---

## 🔍 VERIFICACIÓN POST-DEPLOY

### 1. Supabase Dashboard
- [ ] Todas las tablas tienen RLS habilitado
- [ ] Hay logs en `security_logs`
- [ ] Triggers funcionando correctamente

### 2. Aplicación en Producción
- [ ] Login funciona
- [ ] Cambio de contraseña funciona
- [ ] Upload de leads funciona
- [ ] Duplicados se bloquean correctamente

### 3. Logs
```sql
-- Ver eventos recientes
SELECT * FROM security_logs ORDER BY created_at DESC LIMIT 20;

-- Ver alertas críticas
SELECT * FROM v_security_alerts;

-- Ver resumen de seguridad
SELECT * FROM v_security_summary WHERE fecha >= CURRENT_DATE - 7;
```

---

## 📞 SI ALGO SALE MAL

### Rollback de Migraciones

```sql
-- Deshabilitar RLS (temporal)
ALTER TABLE cotizaciones_crm DISABLE ROW LEVEL SECURITY;

-- Eliminar triggers problemáticos
DROP TRIGGER IF EXISTS check_lead_email_dup ON leads;
DROP TRIGGER IF EXISTS check_lead_phone_dup ON leads;

-- Restaurar constraints antiguos
ALTER TABLE leads
  ADD CONSTRAINT unique_lead_email_fecha UNIQUE (cliente_id, email, fecha_ingreso);
```

### Recuperar Contraseña Admin

```sql
-- Resetear a admin123 (SOLO EN EMERGENCIA)
UPDATE usuarios
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE email = 'admin@mulleryperez.cl';
```

---

## 📊 MÉTRICAS DE ÉXITO

Al finalizar, deberías tener:

- ✅ 0 contraseñas hardcodeadas en código
- ✅ 100% de tablas críticas con RLS
- ✅ Sistema de logs de seguridad activo
- ✅ 0 duplicados permitidos en misma fecha
- ✅ Estructura de archivos organizada

---

**Tiempo total estimado**: 4-6 horas
**Prioridad**: CRÍTICO
**Revisión**: Christopher Müller

¡Buena suerte! 🚀
