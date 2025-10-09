# Setup del Ebook Lead Magnet

## Descripción

El ebook "La Guía Definitiva del Marketing de Datos 2025" está disponible en:
- URL: https://www.mulleryperez.cl/recursos/ebook-marketing-datos-2025
- PDF ubicado en: `/public/recursos/ebook-marketing-datos-2025.pdf`

## Flujo de Funcionamiento

1. Usuario completa formulario (Nombre, Email, Empresa opcional)
2. Sistema guarda en Google Sheets
3. Sistema envía email a `contacto@mulleryperez.cl` con datos del lead
4. Sistema envía email de confirmación al usuario con link de descarga
5. PDF se descarga automáticamente

## Configuración Requerida

### 1. Google Sheets API

#### Crear Google Sheet:
1. Ve a https://sheets.google.com
2. Crea una nueva hoja llamada "Leads M&P"
3. Renombra la primera pestaña a "Leads"
4. En la fila 1, agrega los encabezados:
   - A1: `Timestamp`
   - B1: `Nombre`
   - C1: `Email`
   - D1: `Empresa`
   - E1: `Recurso`

#### Obtener ID del Sheet:
- La URL será algo como: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`
- El ID es: `ABC123XYZ`

#### Crear API Key:
1. Ve a https://console.cloud.google.com/apis/credentials
2. Crea un proyecto nuevo o selecciona uno existente
3. Habilita "Google Sheets API"
4. Crea credenciales → API Key
5. **Importante**: Restringe la API Key:
   - Application restrictions: HTTP referrers
   - Agregar: `*.vercel.app/*` y `*.mulleryperez.cl/*`
   - API restrictions: Google Sheets API

#### Dar permisos al Sheet:
1. Abre tu Google Sheet
2. Click en "Compartir"
3. Cambia a "Cualquier persona con el enlace puede ver"
4. O comparte con el email de servicio de tu proyecto GCP

### 2. Resend API (para emails)

1. Ve a https://resend.com
2. Crea una cuenta gratuita (100 emails/día)
3. Verifica tu dominio (opcional pero recomendado)
4. Ve a https://resend.com/api-keys
5. Crea una nueva API Key
6. Copia la key (solo se muestra una vez)

**Nota**: Si usas el dominio gratuito `onboarding@resend.dev`, los emails pueden ir a spam. Para producción, verifica tu propio dominio.

### 3. Variables de Entorno

Actualiza `.env.local` con tus valores reales:

```bash
# Google Sheets API
GOOGLE_SHEET_ID=tu_id_real_del_sheet
GOOGLE_SHEETS_API_KEY=tu_api_key_de_google_sheets

# Resend API
RESEND_API_KEY=tu_resend_api_key
```

### 4. Variables en Vercel (Producción)

1. Ve a tu proyecto en https://vercel.com
2. Settings → Environment Variables
3. Agrega las mismas variables:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SHEETS_API_KEY`
   - `RESEND_API_KEY`
4. Aplica a: Production, Preview, Development
5. Redeploy tu aplicación

## Testing Local

```bash
npm run dev
```

Visita: http://localhost:3000/recursos/ebook-marketing-datos-2025

## Estructura de Archivos

```
/app
  /recursos
    /ebook-marketing-datos-2025
      page.tsx                 # Landing page con formulario
  /api
    /ebook-download
      route.ts                 # Endpoint que procesa el formulario

/public
  /recursos
    ebook-marketing-datos-2025.pdf   # PDF del ebook
```

## Alternativa: Google Sheets sin API Key

Si prefieres no usar Google Sheets API, puedes usar **Google Forms**:

1. Crea un Google Form
2. Conecta el form a un Google Sheet
3. Usa la URL del form como iframe o redirige ahí

O usa **Zapier/Make.com**:
1. Webhook recibe el POST
2. Zapier/Make guarda en Google Sheets
3. Zapier/Make envía emails

## Monitoreo

- Los leads se guardarán en tu Google Sheet en tiempo real
- Los emails de notificación llegarán a `contacto@mulleryperez.cl`
- Los usuarios recibirán confirmación con link de descarga
- Puedes ver logs en Vercel: https://vercel.com/dashboard → tu proyecto → Logs

## Troubleshooting

### Problema: No se guardan leads en Google Sheets
- Verifica que el GOOGLE_SHEET_ID sea correcto
- Verifica que la hoja se llame "Leads"
- Verifica permisos del Sheet (debe ser público o compartido)
- Revisa logs en Vercel

### Problema: No llegan emails
- Verifica que RESEND_API_KEY sea válida
- Verifica límites de Resend (100/día en plan free)
- Revisa spam del email destino
- Considera verificar tu dominio en Resend

### Problema: 404 al descargar PDF
- Verifica que el archivo existe en `/public/recursos/ebook-marketing-datos-2025.pdf`
- El archivo debe estar commiteado en Git
- Redeploy en Vercel

## Próximos Pasos (Opcional)

- [ ] Verificar dominio en Resend para emails desde @mulleryperez.cl
- [ ] Configurar secuencia de emails automatizada (drip campaign)
- [ ] Agregar tracking de conversión con Google Analytics
- [ ] A/B testing del formulario
- [ ] Agregar más recursos descargables
