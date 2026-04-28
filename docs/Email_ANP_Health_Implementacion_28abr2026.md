**Asunto:** ANP Health — Resumen implementación tracking Google Ads (28 abril 2026)

---

Hola equipo,

Les comparto el resumen de todo lo que revisamos, configuramos y testeamos hoy para el tracking de conversiones de Google Ads en ANP Health. Queda documentado por plataforma para que todos tengamos la misma foto.

---

## 1. GoHighLevel (GHL)

**Cuenta:** ANP Health - Channel A (Bradenton, FL)

### Workflows verificados y actualizados

**1.1 US - Lead Form + WSP** (Published — 10,028 enrolled, 1,295 activos)
- Trigger: Form Submitted (Lead Form US, Form A1 - US)
- Calificación verificada:
  - ✅ Licenciado/a en Enfermería
  - ✅ Estudiante de Licenciatura en Enfermería
  - ✅ Técnico Superior en Enfermería (VE/AR/SV — filtro de país se maneja en el formulario)
  - ❌ Auxiliar de Enfermería
  - ❌ Otro profesional/estudiante
  - Inglés NO se usa como filtro
- Webhook actualizado (14:45): POST → https://anphealthsolutions.com/api/v1/webhook/go-high-level
  - Custom Data agregados: `event_name=schedule`, `google_conversion_id=17156646359`, `google_conversion_label=E7bICIHUn6QcENfL9vQ_`
- Pipeline: FUN-EVG - US 01

**1.1 LAT - Lead Form + WSP** (Published — 17,911 enrolled, 2,440 activos)
- Calificación: idéntica a US
- Webhook actualizado (~14:46): mismo endpoint
  - Custom Data agregados: `event_name=schedule`, `google_conversion_id=17396136629`, `google_conversion_label=94wXCKqVoKQcELX1j-dA`

**Importante:** Los webhooks solo disparan para leads que pasan por la rama "Qualified". Leads descalificados no envían evento.

---

## 2. Google Tag Manager

**Cuenta:** ANP Health - A

### Containers Web (landings de campañas Google Ads)

**landing usa — GTM-KLNXT7ZL**
- Instalado en: usa.anphealthsolutions.com
- Tags:
  - Google Ads (Etiqueta de Google) — Initialization All Pages
  - Clic agendamiento (Vinculación de conversiones) — Vista agendamiento reunión
  - **Reservar cita (1)** (Seguimiento de conversiones Google Ads) — ID: 17156646359 / Label: E7bICIHUn6QcENfL9vQ_
- **Fix realizado:** El tag "Reservar cita (1)" fue creado por Camila (v4) pero SIN activador asignado — nunca disparaba. Asignamos activador "Vista agendamiento reunión" (Page URL contiene usa.anphe...).
- **Versión 5 publicada** — 28/04/2026 15:17 por christopher@mulleryperez.cl
- **Versión 6 publicada** — 28/04/2026 15:38: Agregado `server_container_url=https://ss.anphealthsolutions.com` al tag Google Ads para enviar datos al sGTM vía Stape

**landing latam — GTM-T8B4BPV9**
- Instalado en: latam.anphealthsolutions.com (para campañas Google Ads)
- Tags:
  - **Google Ads Chris** (Etiqueta de Google) — ID: AW-17396136629 — Initialization All Pages — con `server_container_url=https://ss.anphealthsolutions.com`
  - **Reservar cita (1)** (Seguimiento de conversiones Google Ads) — ID: 17396136629 / Label: 94wXCKqVoKQcELX1j-dA
- **Fixes realizados:**
  1. Tag "Reservar cita (1)" sin activador → creamos "Vista agendamiento reunión LAT" (Page URL contiene consultation-appointment-lat) — v4 publicada 15:25
  2. Tag base Google Ads no existía → creado "Google Ads Chris" con server_container_url hacia sGTM — v5 publicada 15:44

### Containers Server-Side (sGTM)

**A - US - Funnel 01 (Server) — GTM-5P9DNDHC**
- Tags publicados que disparan con evento "schedule":
  - FB - Schedule (Meta)
  - **G Ads - Reservar Cita USA** (NUEVO — ID: 17156646359, Label: E7bICIHUn6QcENfL9vQ_) — v6 publicada 13:06
  - G Ads - Schedule (existente)
  - G Ads - Schedule Enhanced Conversions
  - TT - Schedule (TikTok)

**A - LAT - Funnel 01 (Server) — GTM-P9NK4NVT**
- **G Ads - Reservar Cita LATAM** (NUEVO — ID: 17396136629, Label: 94wXCKqVoKQcELX1j-dA) — v2 publicada 13:13

### Todos los containers de la cuenta

| Container | Tipo | ID |
|-----------|------|----|
| A - US - Funnel 01 (Server) | Servidor | GTM-5P9DNDHC |
| A - US - Funnel 01 (Web) | Web | GTM-MJGD8MF9 |
| A - LAT - Funnel 01 (Server) | Servidor | GTM-P9NK4NVT |
| A - LAT - Funnel 01 (Web) | Web | GTM-M52WJSCX |
| landing usa | Web | GTM-KLNXT7ZL |
| landing latam | Web | GTM-T8B4BPV9 |

---

## 3. Stape (Hosting sGTM)

- Container: **Channel A - US** — Running, Pro+
- Server URL: **https://ss.anphealthsolutions.com**
- CNAME: ss.anphealthsolutions.com → usa.stape.io
- Uso: 84,813 de 2,000,000 requests (4%)
- Ubicación: US East (South Carolina)
- Vencimiento: 24 mayo 2026
- Cuenta: anphealthsolutions.marketing@gmail.com
- **No existe container LATAM separado** — ambas landings usan el mismo sGTM

### Logs verificados
- Evento `schedule` confirmado llegando al sGTM desde latam.anphealthsolutions.com y program.anphealthsolutions.com
- usa.anphealthsolutions.com NO envía al sGTM (usa container web diferente, tracking es client-side directo)

---

## 4. Google Ads

**Cuenta US: 961-187-1894 ANP Health - US**
- Acceso: christopher@mulleryperez.cl
- Campañas: detenidas (pendiente activar)
- Conversiones configuradas:
  - "Reservar cita (1)" — ID: 17156646359 / Label: E7bICIHUn6QcENfL9vQ_ ✅
  - "Schedule" — importar desde clics
  - "Reservar cita" — secundario

**Cuenta LATAM:** Pendiente — christopher@mulleryperez.cl no tiene acceso. Necesitamos que Alejandro otorgue acceso para verificar que las conversiones LATAM estén configuradas con ID: 17396136629 / Label: 94wXCKqVoKQcELX1j-dA.

---

## 5. Landings

| Landing | Uso | Container GTM Web | Envía al sGTM |
|---------|-----|-------------------|---------------|
| usa.anphealthsolutions.com | Campañas Google US | GTM-KLNXT7ZL | Sí (server_container_url configurado v6 15:38) |
| latam.anphealthsolutions.com | Campañas Meta + Google LAT | GTM-T8B4BPV9 | Sí (server_container_url configurado v5 15:44) |
| program.anphealthsolutions.com | Funnel con pre-calificación | Otro | Sí |

---

## 6. Tests realizados

- Test 1: Agendamiento completo en usa.anphealthsolutions.com → "Registro confirmado" ✅
- Test 2: Agendamiento completo en program.anphealthsolutions.com → Página de rechazo (datos no calificados) ✅ — confirma que la pre-calificación funciona
- Tag Assistant: Conversión "Reservar cita (1)" detectada con ID y Label correctos ✅
- Stape logs: Eventos "schedule" llegando correctamente desde latam y program ✅

---

## 7. Etiquetas de conversión (Camila)

| Región | Conversion ID | Conversion Label | Uso |
|--------|--------------|-----------------|-----|
| USA | 17156646359 | E7bICIHUn6QcENfL9vQ_ | Tag GTM sGTM + Tag GTM landing usa |
| LATAM | 17396136629 | 94wXCKqVoKQcELX1j-dA | Tag GTM sGTM + Tag GTM landing latam |

---

## 8. Qué falta

### Para activar campañas (bloqueante)
- [ ] **Acceso a Google Ads LATAM** — Alejandro debe dar acceso a christopher@mulleryperez.cl para verificar conversiones
- [ ] **Verificar conversiones en cuenta LATAM** — confirmar que existen con los IDs/Labels correctos
- [ ] **Activar campañas** — Alejandro/Camila habilitan las campañas en Google Ads
- [ ] **Monitorear primeras conversiones** — verificar en Google Ads que "Reservar cita (1)" pase de "Inactiva" a activa (puede tardar unas horas después de la primera conversión)

### Post-activación
- [ ] **Looker Studio** — Agregar Google Ads como fuente de datos al reporte existente "Reporte ANP Health". Métricas a incluir: conversiones Google Ads, CPA, CTR, gasto, comparación vs Meta
- [ ] **Reportei** — Conectar Google Ads para reportes mensuales automatizados con variables: Conversiones, CPA, CTR, Impresiones, Clics, Gasto, ROAS, segmentado por US vs LAT y por tipo de conversión
- [ ] **Habilitar outgoing request logging en Stape** — para monitorear que los tags envían correctamente a Google Ads
- [ ] **Verificar que el webhook GHL → API ANP procesa los custom data de Google** — los datos event_name, conversion_id y conversion_label que agregamos dependen de que el backend de ANP los utilice

---

Además, toda esta documentación está versionada en nuestro repositorio de GitHub con el detalle técnico completo. Si necesitan acceso para revisarlo, me avisan y se los comparto.

Cualquier duda me avisan.

Christopher Müller
Muller y Pérez
christopher@mulleryperez.cl
