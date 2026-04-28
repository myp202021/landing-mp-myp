**Para:** Alejandro (ANP), Camila, María Inés, equipo M&P
**Asunto:** ANP Health — Implementación completa tracking Google Ads (28 abril 2026)

---

Hola a todos,

Les dejo el resumen completo de todo lo que implementamos, verificamos y corregimos hoy para el tracking de conversiones de Google Ads en ANP Health. Está ordenado por plataforma para que cada uno pueda revisar su parte.

---

## 1. GoHighLevel (GHL)

**Cuenta:** ANP Health - Channel A (Bradenton, FL)

### Workflows actualizados

**1.1 US - Lead Form + WSP**
- Estado: Published (10,028 leads enrolled, 1,295 activos)
- Webhook: POST → https://anphealthsolutions.com/api/v1/webhook/go-high-level
- Custom Data que agregamos al webhook:
  - `event_name` = `schedule`
  - `google_conversion_id` = `17156646359`
  - `google_conversion_label` = `E7bICIHUn6QcENfL9vQ_`
- Pipeline: FUN-EVG - US 01

**1.1 LAT - Lead Form + WSP**
- Estado: Published (17,911 leads enrolled, 2,440 activos)
- Webhook: POST → https://anphealthsolutions.com/api/v1/webhook/go-high-level
- Custom Data que agregamos al webhook:
  - `event_name` = `schedule`
  - `google_conversion_id` = `17396136629`
  - `google_conversion_label` = `94wXCKqVoKQcELX1j-dA`

**Los webhooks solo disparan para leads CALIFICADOS** (rama Qualified del workflow).

### Criterios de calificación (verificados en ambos workflows)

| Nivel de Educación | Estado |
|---|---|
| Licenciado/a en Enfermería | ✅ Calificado |
| Estudiante de Licenciatura en Enfermería | ✅ Calificado |
| Técnico Superior en Enfermería (VE/AR/SV) | ✅ Calificado |
| Técnico Superior de otro país | ❌ Descalificado |
| Auxiliar de Enfermería | ❌ Descalificado |
| Otro profesional/estudiante | ❌ Descalificado |

- Inglés NO se usa como filtro de calificación
- El filtro de país para técnicos se maneja en el formulario (campo condicional), no en el workflow
- Los leads descalificados: se cancela la sesión automáticamente y no se envía evento

---

## 2. Google Tag Manager

**Cuenta:** ANP Health - A (tagmanager.google.com)

### Containers Web — Landings de campañas Google Ads

**landing usa — GTM-KLNXT7ZL**
- Instalado en: https://usa.anphealthsolutions.com
- Versión actual: 6 (publicada 28/04/2026 15:38)

| Tag | Tipo | Activador | Detalle |
|-----|------|-----------|---------|
| Google Ads | Etiqueta de Google (base) | Initialization - All Pages | ID: AW-17156646359, `server_container_url=https://ss.anphealthsolutions.com` |
| Clic agendamiento | Vinculación de conversiones | Vista agendamiento reunión | Page URL contiene usa.anphe... |
| Reservar cita (1) | Seguimiento conversiones Google Ads | Vista agendamiento reunión | ID: 17156646359 / Label: E7bICIHUn6QcENfL9vQ_ |

- **Fix aplicado:** "Reservar cita (1)" estaba creado (por Camila, v4) pero SIN activador — nunca disparaba. Le asignamos el activador "Vista agendamiento reunión" (v5). Luego agregamos `server_container_url` al tag base para conectar con Stape (v6).

**landing latam — GTM-T8B4BPV9**
- Instalado en: https://latam.anphealthsolutions.com
- Versión actual: 5 (publicada 28/04/2026 15:44)

| Tag | Tipo | Activador | Detalle |
|-----|------|-----------|---------|
| Google Ads Chris | Etiqueta de Google (base) | Initialization - All Pages | ID: AW-17396136629, `server_container_url=https://ss.anphealthsolutions.com` |
| Reservar cita (1) | Seguimiento conversiones Google Ads | Vista agendamiento reunión LAT | ID: 17396136629 / Label: 94wXCKqVoKQcELX1j-dA |

- **Fixes aplicados:**
  1. "Reservar cita (1)" sin activador → creamos "Vista agendamiento reunión LAT" (Page URL contiene `consultation-appointment-lat`) — v4
  2. No existía tag base de Google → creamos "Google Ads Chris" con `server_container_url` hacia sGTM — v5

### Containers Server-Side (sGTM)

**A - US - Funnel 01 (Server) — GTM-5P9DNDHC**
- Versión: 6 (publicada 28/04/2026 13:06)
- Trigger "schedule" dispara 5 tags:

| Tag | Tipo | Etiquetas |
|-----|------|-----------|
| FB - Schedule | Meta CAPI | (existente) |
| **G Ads - Reservar Cita USA** | Google Ads Conversion | **ID: 17156646359 / Label: E7bICIHUn6QcENfL9vQ_** (NUEVO) |
| G Ads - Schedule | Google Ads Conversion | (existente) |
| G Ads - Schedule Enhanced Conversions | Google Ads | (existente) |
| TT - Schedule | TikTok | (existente) |

**A - LAT - Funnel 01 (Server) — GTM-P9NK4NVT**
- Versión: 2 (publicada 28/04/2026 13:13)
- Tag nuevo: **G Ads - Reservar Cita LATAM** — ID: 17396136629 / Label: 94wXCKqVoKQcELX1j-dA

### Todos los containers de la cuenta

| Container | Tipo | ID | Instalado en |
|-----------|------|----|-------------|
| A - US - Funnel 01 (Server) | Servidor | GTM-5P9DNDHC | sGTM principal |
| A - US - Funnel 01 (Web) | Web | GTM-MJGD8MF9 | Funnels internos |
| A - LAT - Funnel 01 (Server) | Servidor | GTM-P9NK4NVT | sGTM LATAM |
| A - LAT - Funnel 01 (Web) | Web | GTM-M52WJSCX | Funnels internos |
| landing usa | Web | GTM-KLNXT7ZL | usa.anphealthsolutions.com |
| landing latam | Web | GTM-T8B4BPV9 | latam.anphealthsolutions.com |

---

## 3. Stape (Server-Side GTM Hosting)

| Item | Detalle |
|------|---------|
| Container | Channel A - US |
| Estado | Running ✅ |
| Plan | Pro+ (2,000,000 requests/mes) |
| Uso actual | 84,813 requests (4%) |
| **Server URL** | **https://ss.anphealthsolutions.com** |
| CNAME | ss.anphealthsolutions.com → usa.stape.io |
| Ubicación | US East (South Carolina) |
| Vencimiento | 24 mayo 2026 |
| Cuenta | anphealthsolutions.marketing@gmail.com |

- Ambas landings (USA + LATAM) envían al mismo sGTM
- Logs verificados: eventos "schedule" llegando correctamente desde latam.anphealthsolutions.com y program.anphealthsolutions.com

---

## 4. Google Ads

**Cuenta US: 961-187-1894 (ANP Health - US)**
- Acceso: christopher@mulleryperez.cl
- Campañas: detenidas (pendiente activar)

| Conversión | ID | Label | Estado |
|-----------|-----|-------|--------|
| Reservar cita (1) | 17156646359 | E7bICIHUn6QcENfL9vQ_ | Inactiva (se activa con primera conversión) |
| Schedule | — | — | Requiere atención |
| Reservar cita | — | — | Secundario |

- Tag Assistant verificó que el ID y Label son correctos ✅

**Cuenta LATAM: Pendiente acceso**
- christopher@mulleryperez.cl no tiene acceso
- Necesitamos verificar que las conversiones estén con ID: 17396136629 / Label: 94wXCKqVoKQcELX1j-dA

---

## 5. Etiquetas de conversión (Camila)

| Región | Conversion ID | Conversion Label | Tag sGTM | Tag Landing | Webhook GHL |
|--------|--------------|-----------------|----------|-------------|-------------|
| USA | 17156646359 | E7bICIHUn6QcENfL9vQ_ | G Ads - Reservar Cita USA (v6) | Reservar cita (1) en GTM-KLNXT7ZL (v6) | ✅ Custom Data en 1.1 US |
| LATAM | 17396136629 | 94wXCKqVoKQcELX1j-dA | G Ads - Reservar Cita LATAM (v2) | Reservar cita (1) en GTM-T8B4BPV9 (v5) | ✅ Custom Data en 1.1 LAT |

---

## 6. Landings

| Landing | URL | Container GTM | Envía a sGTM | Formulario |
|---------|-----|--------------|-------------|------------|
| USA | https://usa.anphealthsolutions.com | GTM-KLNXT7ZL | ✅ (v6, server_container_url) | Calendario embebido, sin pre-calificación |
| LATAM | https://latam.anphealthsolutions.com | GTM-T8B4BPV9 | ✅ (v5, server_container_url) | Calendario embebido |
| Program | https://program.anphealthsolutions.com | Otro container | ✅ (ya estaba) | Formulario con pre-calificación (Nivel Educación + Inglés + País) |

---

## 7. Arquitectura del sistema

```
USUARIO VISITA LANDING (usa/latam.anphealthsolutions.com)
    │
    ├── Web GTM (landing usa/latam)
    │   ├── Google Ads tag base → envía a ss.anphealthsolutions.com (sGTM)
    │   └── Reservar cita (1) → dispara conversión Google Ads en página de confirmación
    │
    └── Formulario → Agenda cita → GHL
        └── Workflow 1.1 (US/LAT)
            ├── ¿Calificado? (Licenciado / Est. Lic / Técnico VE-AR-SV)
            │   ├── SÍ → Create Opportunity → Webhook POST con etiquetas Google
            │   └── NO → Cancelar sesión + no enviar evento
            └── Webhook → anphealthsolutions.com/api/v1/webhook/go-high-level
                         (con event_name, conversion_id, conversion_label)
```

---

## 8. Tests realizados

| Test | Resultado |
|------|-----------|
| Agendamiento usa.anphealthsolutions.com | ✅ Registro confirmado |
| Agendamiento program.anphealthsolutions.com (datos no calificados) | ✅ Página de rechazo correcta |
| Tag Assistant — verificación conversión USA | ✅ ID y Label correctos detectados |
| Stape logs — eventos schedule | ✅ Llegando desde latam y program |
| Criterios calificación GHL US | ✅ Verificados |
| Criterios calificación GHL LAT | ✅ Verificados |

---

## 9. Qué falta (pendientes)

### Bloqueantes para activar campañas

- [ ] **Alejandro:** Dar acceso a Google Ads LATAM a christopher@mulleryperez.cl para verificar conversiones
- [ ] **Verificar conversiones LATAM** en Google Ads con ID 17396136629 / Label 94wXCKqVoKQcELX1j-dA
- [ ] **Activar campañas de Google Ads** (Alejandro/Camila)
- [ ] **Monitorear primeras conversiones** — verificar que "Reservar cita (1)" pase de "Inactiva" a activa

### Post-activación

- [ ] **Looker Studio** — Agregar Google Ads como fuente al reporte existente "Reporte ANP Health" (conversiones, CPA, CTR, gasto, comparación vs Meta)
- [ ] **Reportei** — Conectar Google Ads para reportes mensuales automatizados
- [ ] **Verificar webhook GHL → API ANP** — Confirmar que el backend de ANP procesa los custom data de Google que agregamos

### Documentación

Toda la documentación técnica está versionada en nuestro repositorio de GitHub. Si necesitan acceso para revisarlo, me avisan.

---

Quedo atento a cualquier duda.

Christopher Müller
Muller y Pérez
christopher@mulleryperez.cl
