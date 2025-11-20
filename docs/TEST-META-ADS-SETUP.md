# 🧪 TEST: INTEGRAR META ADS PARA M&P

## Resumen del Test
Vamos a integrar Meta Ads al CRM para que el cliente "Muller y Perez" pueda ver sus campañas directamente en el dashboard.

---

## ✅ CHECKLIST COMPLETO

### FASE 1: PREPARACIÓN (10 minutos)

- [ ] **1.1** Aplicar migración de base de datos en Supabase
  ```bash
  # Copia el contenido de database/migrations/004_create_integrations_tables.sql
  # Pégalo en Supabase Dashboard → SQL Editor → Run
  ```

- [ ] **1.2** Verificar que el cliente "Muller y Perez" existe
  ```bash
  # Verifica en Supabase o con:
  node scripts/check-cotizaciones-myp.mjs
  ```

### FASE 2: OBTENER CREDENCIALES DE META (15 minutos)

- [ ] **2.1** Crear App en Meta for Developers
  - Ve a https://developers.facebook.com/
  - My Apps → Create App → Business
  - Nombre: "M&P CRM Integration"
  - Email: contacto@mulleryperez.com

- [ ] **2.2** Configurar Marketing API
  - Add Products → Marketing API → Set Up
  - App Review → Solicitar permisos:
    - `ads_read`
    - `ads_management`
    - `business_management`

- [ ] **2.3** Obtener Access Token
  - Ve a https://developers.facebook.com/tools/explorer/
  - Selecciona tu App
  - Selecciona permisos (ads_read, ads_management)
  - Click "Generate Access Token"
  - **COPIAR Y GUARDAR EL TOKEN**

- [ ] **2.4** Obtener Ad Account ID
  - Ve a https://business.facebook.com/
  - Ads Manager
  - En la URL busca: `act=123456789`
  - Tu Account ID es: `act_123456789`

### FASE 3: CONECTAR AL CRM (5 minutos)

- [ ] **3.1** Guardar conexión de Meta Ads
  ```bash
  node scripts/connect-meta-ads-manual.mjs
  ```
  Te pedirá:
  - Access Token (del paso 2.3)
  - Ad Account ID (del paso 2.4)
  - Nombre de cuenta (ejemplo: "M&P Marketing - Principal")

- [ ] **3.2** Asignar cuenta al cliente "Muller y Perez"
  ```bash
  node scripts/assign-meta-to-client.mjs
  ```

- [ ] **3.3** Sincronizar campañas
  ```bash
  node scripts/sync-meta-campaigns.mjs
  ```

### FASE 4: VERIFICACIÓN (5 minutos)

- [ ] **4.1** Verificar datos en Supabase
  ```sql
  -- Ver integración
  SELECT * FROM platform_integrations WHERE plataforma = 'meta_ads';

  -- Ver mapping
  SELECT * FROM client_platform_mapping;

  -- Ver métricas
  SELECT * FROM ads_metrics_daily WHERE plataforma = 'meta_ads'
  ORDER BY fecha DESC LIMIT 10;
  ```

- [ ] **4.2** Login como cliente "Muller y Perez"
  - Usuario: `myp`
  - Contraseña: `mypcliente2025`
  - Ve a Dashboard → Tab "Campañas"
  - **¡Deberías ver las campañas de Meta Ads!**

---

## 🎯 RESULTADO ESPERADO

El cliente verá en su dashboard:

```
┌─────────────────────────────────────────────────────────┐
│  📊 MIS CAMPAÑAS PUBLICITARIAS                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📅 Últimos 30 días                                     │
│                                                         │
│  Total Invertido: $450,000                              │
│  Total Clicks: 1,234                                    │
│  Total Conversiones: 23                                 │
│  CTR Promedio: 2.5%                                     │
│                                                         │
│  [Gráfico de inversión por día]                        │
│                                                         │
│  🔵 META ADS                                            │
│  • Campaña 1: Prospecting                              │
│    Inversión: $200,000 | Clicks: 534 | Conv: 12       │
│  • Campaña 2: Retargeting                              │
│    Inversión: $250,000 | Clicks: 700 | Conv: 11       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 TROUBLESHOOTING

### Error: "Token inválido"
**Solución:** Genera un nuevo token en Graph API Explorer (paso 2.3)

### Error: "Ad Account not found"
**Solución:** Verifica que el Account ID sea correcto y empiece con `act_`

### Error: "Insufficient permissions"
**Solución:** Verifica que la App tenga permisos `ads_read` y `ads_management`

### No se ven campañas en el dashboard
**Solución:**
1. Verifica que haya datos en `ads_metrics_daily`:
   ```sql
   SELECT COUNT(*) FROM ads_metrics_daily WHERE plataforma = 'meta_ads';
   ```
2. Si hay 0 rows, ejecuta de nuevo:
   ```bash
   node scripts/sync-meta-campaigns.mjs
   ```
3. Verifica que la cuenta de Meta tenga campañas activas en los últimos 30 días

### Cliente no ve los datos
**Solución:**
1. Verifica el mapping:
   ```sql
   SELECT * FROM client_platform_mapping
   WHERE cliente_id = (SELECT id FROM clientes WHERE nombre ILIKE '%muller%');
   ```
2. Si no existe, ejecuta:
   ```bash
   node scripts/assign-meta-to-client.mjs
   ```

---

## 📊 ESTRUCTURA DE DATOS

```
platform_integrations (Integración OAuth de M&P)
    ↓
client_platform_mapping (Asignación a cliente)
    ↓
ads_metrics_daily (Métricas diarias por campaña)
    ↓
Dashboard Cliente (Visualización)
```

---

## 🚀 PRÓXIMOS PASOS

Una vez que funcione este test:

1. **Crear panel de admin** para gestionar integraciones desde el CRM
2. **Agregar Google Ads** con la misma arquitectura
3. **Automatizar sincronización** con CRON daily
4. **Agregar gráficos** interactivos (Recharts)
5. **Comparación histórica** (últimos 30 vs 60 vs 90 días)

---

## 📝 NOTAS IMPORTANTES

- Los tokens de Meta expiran cada **60 días**
- Debes renovarlos manualmente (por ahora)
- La sincronización se hace manual con el script
- En producción, esto será automático con CRON

---

## 🎉 ¡ÉXITO!

Si ves las campañas en el dashboard del cliente, el test fue exitoso. Ahora podemos:

1. Crear la UI completa del dashboard
2. Agregar Google Ads
3. Implementar OAuth automático
4. Desplegar a producción

---

**Última actualización:** 2025-11-20
**Autor:** Claude Code + Christopher Muller
**Versión:** TEST 1.0
