# 🚀 INSTRUCCIONES PARA EJECUTAR EN SUPABASE

## ⚠️ IMPORTANTE: Ejecuta los scripts EN ORDEN

### PASO 1: Limpiar funciones existentes

1. Abre Supabase Dashboard → SQL Editor
2. Copia **TODO** el contenido de: `01_LIMPIAR_FUNCIONES.sql`
3. Pega en SQL Editor
4. Click en **Run** (botón verde)
5. Espera a que termine (verás mensaje: "Funciones y tablas antiguas eliminadas")

### PASO 2: Instalar sistema de autenticación

1. En el mismo SQL Editor
2. Copia **TODO** el contenido de: `02_INSTALAR_AUTENTICACION.sql`
3. Pega en SQL Editor
4. Click en **Run** (botón verde)
5. Espera a que termine

**Debes ver al final:**
- Mensaje "✅ SISTEMA DE AUTENTICACIÓN CONFIGURADO"
- Una tabla con todos los usuarios

### PASO 3: Verificar que funcionó

Ejecuta este query para verificar:

```sql
-- Verifica que las contraseñas estén hasheadas con bcrypt
SELECT
  id,
  username,
  LEFT(password_hash, 10) as password_sample,
  debe_cambiar_password
FROM usuarios;
```

**Las contraseñas deben empezar con `$2a$` o `$2b$`**

Si ves texto plano (como "admin123"), algo salió mal.

---

## 🔐 Credenciales después de la instalación:

```
Username: admin
Password: MYP@admin2025!
```

---

## ❌ Si ves errores:

### Error: "function already exists"
- Ejecuta primero el **PASO 1** (limpiar funciones)

### Error: "column already exists"
- No es problema, significa que ya existía. Continúa.

### Error: "syntax error at or near #"
- Estás copiando el archivo markdown en lugar del SQL
- Asegúrate de copiar desde los archivos `.sql`

---

## ✅ Después de ejecutar:

1. Ve a tu aplicación: `/crm/login`
2. Ingresa: `admin` / `MYP@admin2025!`
3. Debes poder entrar
4. Ve a `/crm/usuarios` para crear usuarios
