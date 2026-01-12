# Configuración Completa - www.mulleryperez.cl

**DOCUMENTO MAESTRO DE CONFIGURACIÓN**
**Última actualización:** Enero 2026

---

## 1. CREDENCIALES DE SERVICIOS

### Vercel
- **Proyecto:** landing-mp-myp
- **Team:** christophers-projects-2823b4cc
- **Región:** gru1 (São Paulo)
- **URL Producción:** https://www.mulleryperez.cl
- **Dashboard:** https://vercel.com/christophers-projects-2823b4cc/landing-mp-myp

### Supabase (Base de Datos)
- **URL:** https://faitwrutauavjwnsnlzq.supabase.co
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzQ3MTcsImV4cCI6MjA3NzI1MDcxN30.ZfGDfQv2UzWQR6AJz0o0Prir5IJfJppkiNwWiF24pkQ`
- **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXR3cnV0YXVhdmp3bnNubHpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY3NDcxNywiZXhwIjoyMDc3MjUwNzE3fQ.19K4-XCB-M6foGQ1b3yHXWUR9nyLR1R1dqHYVefGfx8`

### Meta (Facebook/Instagram)
- **App ID:** 1389537399297748
- **App Secret:** 787111bcec23f2c254e0dbd1748d24bc
- **Redirect URI:** https://www.mulleryperez.cl/api/auth/meta/callback
- **Pixel ID:** 555544348819002

### Google
- **Sheets API Key:** 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
- **Sheet ID:** 1GSZsjU1G8EImnEgXjfOTev77pMPH-WHtXzGhAtY-jtQ
- **GA4:** G-QV8Y7X4ZC2
- **GTM:** GTM-58VSTLZ

### Resend (Email)
- **API Key:** re_9fLk231R_7aNHqQE57aeKTnV7vMaTqiHA
- **Email de envío:** contacto@mulleryperez.cl

### GitHub
- **Repo:** https://github.com/myp202021/landing-mp-myp
- **Branch principal:** main

---

## 2. ACCESOS CRM

### Admin (Acceso Total)
- **URL:** https://www.mulleryperez.cl/login
- **Usuario:** admin
- **Contraseña:** myp2025

### Portal Cliente
- **URL:** https://www.mulleryperez.cl/login
- **ID Cliente M&P:** b1f839a4-db36-4341-b1b3-7d1ec290ca02
- **Contraseña Universal:** mypcliente2025

---

## 3. CLOUDFLARE

### DNS
- Dominio: mulleryperez.cl
- Proxy: Activado (naranja)
- SSL: Full (strict)

### Configuración AI Bots
- **Ubicación:** Security > Bots > AI Crawl Control
- **Estado:** Todos los bots permitidos (GPTBot, ClaudeBot, PerplexityBot, etc.)
- **robots.txt:** Manejado por Next.js, NO por Cloudflare

---

## 4. ESTRUCTURA DE BASE DE DATOS (Supabase)

### Tabla: clientes
```sql
id (uuid, primary key)
nombre (text)
email (text)
empresa (text)
telefono (text)
activo (boolean)
creado_en (timestamptz)
actualizado_en (timestamptz)
```

### Tabla: leads
```sql
id (int8, primary key)
cliente_id (uuid, foreign key -> clientes.id)
fuente (text) - 'facebook_lead_ads', 'manual', etc.
nombre (text)
apellido (text)
email (text)
telefono (text)
empresa (text)
ciudad (text)
region (text)
mensaje (text)
presupuesto (text)
servicio (text)
rubro (text)
campana_nombre (text)
adset_nombre (text)
ad_nombre (text)
form_nombre (text)
meta_lead_id (text)
contactado (boolean)
fecha_contacto (date)
vendido (boolean)
monto_vendido (numeric)
razon_no_venta (text)
observaciones (text)
notas (text)
fecha_ingreso (timestamptz)
mes_ingreso (text)
creado_en (timestamptz)
actualizado_en (timestamptz)
```

### Tabla: cotizaciones
```sql
id (serial, primary key)
cliente_id (uuid, foreign key)
lead_id (int8, foreign key)
nombre_proyecto (text)
cliente_nombre (text)
cliente_email (text)
cliente_empresa (text)
items (jsonb)
subtotal (numeric)
descuento (numeric)
total (numeric)
notas (text)
vigencia_dias (int)
estado (text) - 'borrador', 'enviada', 'aceptada', 'rechazada'
enviada_en (timestamptz)
aceptada_en (timestamptz)
creado_en (timestamptz)
actualizado_en (timestamptz)
```

---

## 5. APIs DISPONIBLES

```
/api/auth          - Autenticación
/api/buyer-gen     - Generador de Buyer Persona
/api/chatbot       - Chatbot
/api/contact       - Formulario de contacto
/api/cotizaciones  - CRUD cotizaciones
/api/crm           - Endpoints CRM (clientes, leads)
/api/cron          - Tareas programadas
/api/ebook-download - Descarga de ebooks
/api/facebook      - Integración Facebook
/api/indexnow      - IndexNow para SEO
/api/intelligence  - M&P Intelligence
/api/leads         - Gestión de leads
/api/meta          - Integración Meta Ads
/api/pagespeed     - PageSpeed insights
/api/predictions   - Predictor de resultados
/api/webhooks      - Webhooks externos
/api/whatsapp      - Integración WhatsApp
```

---

## 6. CRON JOBS (vercel.json)

```json
{
  "path": "/api/cron/sync-meta-leads",
  "schedule": "0 11 * * *"  // Diario a las 11:00 UTC
}
```

---

## 7. VARIABLES DE ENTORNO (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://faitwrutauavjwnsnlzq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ver arriba]"
SUPABASE_SERVICE_ROLE_KEY="[ver arriba]"

# Google
GOOGLE_SHEETS_API_KEY="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"
GOOGLE_SHEET_ID="1GSZsjU1G8EImnEgXjfOTev77pMPH-WHtXzGhAtY-jtQ"

# Meta
META_APP_ID="1389537399297748"
META_APP_SECRET="787111bcec23f2c254e0dbd1748d24bc"
NEXT_PUBLIC_META_REDIRECT_URI="https://www.mulleryperez.cl/api/auth/meta/callback"

# Email
RESEND_API_KEY="re_9fLk231R_7aNHqQE57aeKTnV7vMaTqiHA"
```

**IMPORTANTE:** Estas variables también deben estar en Vercel Dashboard > Settings > Environment Variables

---

## 8. TRACKING Y ANALYTICS

### Meta Pixel (555544348819002)
Archivo: `/components/ThirdPartyScripts.tsx`

Eventos configurados:
- PageView (automático)
- Lead (formulario enviado)
- Contact (click WhatsApp)
- CompleteRegistration (formulario enviado)

Archivo de tracking B2B: `/lib/meta-pixel.ts`

### Google Analytics (G-QV8Y7X4ZC2)
Archivo: `/components/ThirdPartyScripts.tsx`

### Google Tag Manager (GTM-58VSTLZ)
Archivo: `/components/ThirdPartyScripts.tsx`

---

## 9. ESTRUCTURA DE PÁGINAS PRINCIPALES

```
/                                    # Home (LandingClient.tsx)
/servicios                           # Servicios principales
/servicios/google-ads-chile
/servicios/meta-ads-chile
/servicios/seo-chile
/servicios/performance-marketing
/marketing-digital-ecommerce-chile   # Por industria
/marketing-digital-b2b-chile
/marketing-digital-saas-chile
/marketing-digital-salud-chile
/marketing-digital-inmobiliario-chile
/marketing-digital-educacion-chile
/marketing-digital-pymes-chile
/blog                                # 52 artículos
/recursos                            # Hub de recursos
/utilidades                          # Calculadoras
/labs                                # Herramientas avanzadas
/cotizador                           # Cotizador interactivo
/nosotros                            # Quiénes Somos
/comparativa/muller-perez-vs-agencias-chile
/gracias                             # Thank you page
/crm                                 # Panel admin
/cliente/[id]                        # Portal cliente
/login                               # Login
```

---

## 10. DEPENDENCIAS PRINCIPALES (package.json)

```
next: ^14.2.0
react: ^18.3.0
tailwindcss: ^3.4.1
@supabase/supabase-js: 2.76.1
resend: ^3.2.0
lucide-react: ^0.263.1
recharts: ^3.4.1
jspdf: ^3.0.3
framer-motion: ^12.23.24
```

---

## 11. COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Deploy preview
vercel

# Deploy producción
vercel --prod

# Ver logs Vercel
vercel logs [deployment-url]

# Push a GitHub
git add -A && git commit -m "mensaje" && git push origin main
```

---

## 12. DOCUMENTACIÓN ADICIONAL EN EL PROYECTO

| Archivo | Contenido |
|---------|-----------|
| PROYECTO-MYP-DOCUMENTACION.md | Resumen de trabajo realizado |
| CREDENCIALES.md | Accesos CRM |
| CRM_SETUP.md | Setup del CRM |
| META_OAUTH_SYSTEM.md | Integración Meta |
| FACEBOOK_LEADS_SETUP.md | Setup Facebook Leads |
| INTEGRACION_META_RESUMEN.md | Resumen integración Meta |
| database/schema.sql | Schema de base de datos |

---

## 13. PARA RETOMAR EL PROYECTO

1. **Abrir nueva sesión de Claude**
2. **Decir:**
   ```
   Lee /Users/christophermuller/landing-mp-myp-NUEVO/CONFIGURACION-COMPLETA-MYP.md
   y /Users/christophermuller/landing-mp-myp-NUEVO/PROYECTO-MYP-DOCUMENTACION.md
   para entender el proyecto www.mulleryperez.cl
   ```
3. **Continuar trabajando**

---

## 14. CONTACTO

- **Email nuevo:** christopher@mulleryperez.cl
- **Email anterior:** christopher@mulleryperez.com
- **WhatsApp:** +56 9 9225 8137
- **Sitio:** www.mulleryperez.cl

---

*Documento generado automáticamente para continuidad del proyecto.*
