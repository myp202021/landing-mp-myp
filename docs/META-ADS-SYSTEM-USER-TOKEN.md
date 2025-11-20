# 🔑 OBTENER SYSTEM USER TOKEN DE META (Token Permanente)

## ¿Por qué System User Token?

**User Access Tokens**: ❌ Expiran cada 60 días
**System User Tokens**: ✅ NO expiran nunca (como Reportei)

---

## PASO A PASO: GENERAR TOKEN PERMANENTE

### 1️⃣ **Ir a Meta Business Manager**

Ve a: https://business.facebook.com/settings/system-users

---

### 2️⃣ **Crear System User**

1. Click en **"Add"** (Agregar)
2. Nombre: `M&P CRM Integration`
3. Rol: **Admin**
4. Click en **"Create System User"**

---

### 3️⃣ **Generar Access Token**

1. Click en el System User recién creado
2. Click en **"Generate New Token"**
3. Selecciona tu **App** (la que creaste en Meta for Developers)
4. Selecciona los **permisos**:
   - ✅ `ads_read`
   - ✅ `ads_management`
   - ✅ `business_management`
5. Click en **"Generate Token"**
6. **COPIAR Y GUARDAR** el token

**⚠️ IMPORTANTE:** Este token **NO expira nunca**

---

### 4️⃣ **Asignar Ad Accounts al System User**

1. En la misma página del System User
2. Sección **"Assigned Assets"** → **"Ad accounts"**
3. Click en **"Add Assets"**
4. Selecciona las cuentas de Ads que quieres integrar
5. Permisos: **"Manage ad account"**
6. Click en **"Save Changes"**

---

### 5️⃣ **Verificar el Token**

Prueba que funciona:

```bash
curl -i -X GET "https://graph.facebook.com/v21.0/me/adaccounts?access_token=TU_TOKEN_AQUI"
```

Deberías ver la lista de Ad Accounts disponibles.

---

## ✅ VENTAJAS DE SYSTEM USER TOKEN

| Aspecto | User Token | System User Token |
|---------|------------|-------------------|
| **Expiración** | 60 días | ❌ NUNCA |
| **Renovación** | Manual | ❌ No necesaria |
| **Mantenimiento** | Alto | ❌ Cero |
| **Ideal para** | Testing | ✅ Producción |

---

## 🔧 USAR EN EL SCRIPT

El script `connect-meta-ads-manual.mjs` funciona igual, solo cambia:

**Antes (User Token):**
```javascript
token_expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 días
```

**Ahora (System User Token):**
```javascript
token_expiry: null // ¡Nunca expira!
```

---

## 🚀 SIGUIENTE PASO

Una vez que tengas el System User Token:

```bash
node scripts/connect-meta-ads-manual.mjs
```

Ingresa:
- ✅ El System User Token (permanente)
- ✅ Ad Account ID (act_123456789)
- ✅ Nombre de cuenta

**¡Y listo!** El token funcionará indefinidamente sin renovación.

---

## 📚 Referencias

- [System Users Documentation](https://www.facebook.com/business/help/503306463479099)
- [Generate System User Tokens](https://developers.facebook.com/docs/marketing-api/system-users/)

---

**Última actualización:** 2025-11-20
**Autor:** Claude Code + Christopher Muller
