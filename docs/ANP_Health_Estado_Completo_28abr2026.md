# ANP Health — Estado Completo de Implementacion
### Documento de trabajo M&P — 28 abril 2026

---

## 1. RESUMEN EJECUTIVO

Configuracion de tracking de Google Ads para las campanas de ANP Health (USA + LATAM) usando las etiquetas de conversion de Camila. El objetivo es medir conversiones "Reservar Cita" solo para leads calificados.

**Estado: Implementacion completada. Pendiente activar campanas.**

---

## 2. CAMBIOS REALIZADOS HOY (28 abril 2026)

### 2.1 GTM Server-Side — Tags publicados
| Region | Container | Tag creado | Conversion ID | Label | Version |
|--------|-----------|-----------|---------------|-------|---------|
| USA | GTM-5P9DNDHC (A - US - Funnel 01 Server) | G Ads - Reservar Cita USA | 17156646359 | E7bICIHUn6QcENfL9vQ_ | v6 publicada 13:06 |
| LATAM | GTM-P9NK4NVT (A - LAT - Funnel 01 Server) | G Ads - Reservar Cita LATAM | 17396136629 | 94wXCKqVoKQcELX1j-dA | v2 publicada 13:13 |

- Activador: evento personalizado `schedule`
- Estos tags son **ADICIONALES** a los existentes (G Ads - Schedule, FB - Schedule, TT - Schedule, etc.)
- El trigger `schedule` dispara 5 tags: FB-Schedule, G Ads-Reservar Cita, G Ads-Schedule, G Ads-Schedule Enhanced Conversions, TT-Schedule

### 2.2 GHL — Webhooks actualizados con Custom Data
**Workflow 1.1 US - Lead Form + WSP** (actualizado 14:45)
- Webhook: POST → `https://anphealthsolutions.com/api/v1/webhook/go-high-level`
- Custom Data agregados:
  - `event_name` = `schedule`
  - `google_conversion_id` = `17156646359`
  - `google_conversion_label` = `E7bICIHUn6QcENfL9vQ_`

**Workflow 1.1 LAT - Lead Form + WSP** (actualizado ~14:46)
- Webhook: POST → `https://anphealthsolutions.com/api/v1/webhook/go-high-level`
- Custom Data agregados:
  - `event_name` = `schedule`
  - `google_conversion_id` = `17396136629`
  - `google_conversion_label` = `94wXCKqVoKQcELX1j-dA`

**Importante:** Los webhooks solo disparan para leads CALIFICADOS (rama Qualified del workflow).

---

## 3. ESTADO POR PLATAFORMA

### 3.1 GoHighLevel (GHL)
| Item | US | LATAM | Estado |
|------|----|----|--------|
| Workflow 1.1 Lead Form + WSP | Published (10,028 enrolled) | Published (17,911 enrolled) | OK |
| Condition calificacion | Licenciado + Est. Lic + Tecnico Superior | Identico a US | OK |
| Condition descalificacion | Auxiliar + Otro | Identico a US | OK |
| Webhook con Custom Data Google | Configurado (14:45) | Configurado (~14:46) | OK |
| Pipeline | FUN-EVG - US 01 | FUN-EVG - LAT 01 (presumido) | OK |

**Criterios de calificacion (confirmados por Alejandro):**
- Licenciado/a en Enfermeria → Calificado
- Estudiante de Licenciatura en Enfermeria → Calificado
- Tecnico Superior en Enfermeria (solo VE/AR/SV) → Calificado
- Auxiliar de Enfermeria → Descalificado
- Otro profesional/estudiante → Descalificado
- Ingles → NO se usa como filtro
- Filtro de pais del tecnico se maneja en el formulario (campo condicional), no en el workflow

**Limitacion conocida:** El formulario esta embebido en el calendario, no se puede bloquear el agendamiento. Solucion: automatizacion cancela sesion si descalificado + no envia evento.

### 3.2 Stape (sGTM Hosting)
| Item | Detalle | Estado |
|------|---------|--------|
| Container | Channel A - US | Running |
| Plan | Pro+ (2M requests/mes) | OK |
| Uso actual | 84,813 requests (4%) | OK |
| Server URL | `https://ss.anphealthsolutions.com` | Ready |
| CNAME | ss.anphealthsolutions.com → usa.stape.io | OK |
| Server location | US East (South Carolina) | OK |
| Container identifier | fawpyrbd | — |
| GTM container ID | GTM-5P9DNDHC | — |
| Vencimiento | May 24, 2026 (renueva en 26 dias) | OK |
| Cuenta | anphealthsolutions.marketing@gmail.com | — |
| Container LATAM separado | No existe, no necesario | OK |

**Nota:** Ambas landings (USA + LATAM) envian al mismo sGTM (ss.anphealthsolutions.com).

### 3.3 Google Tag Manager
**Cuenta: ANP Health - A**

| Container | Tipo | ID | Uso |
|-----------|------|----|-----|
| A - US - Funnel 01 (Server) | Servidor | GTM-5P9DNDHC | sGTM principal |
| A - US - Funnel 01 (Web) | Web | GTM-MJGD8MF9 | Landing USA |
| A - LAT - Funnel 01 (Server) | Servidor | GTM-P9NK4NVT | sGTM LATAM |
| A - LAT - Funnel 01 (Web) | Web | GTM-M52WJSCX | Landing LATAM |
| landing latam | Web | GTM-T8B4BPV9 | Landing LATAM (alt) |
| landing usa | Web | GTM-KLNXT7ZL | Landing USA (alt) |

**Triggers en sGTM US:**
| Trigger | Tipo | Tags que dispara |
|---------|------|-----------------|
| schedule | Evento personalizado | 5 (FB-Schedule, G Ads-Reservar Cita USA, G Ads-Schedule, G Ads-Enhanced Conversions, TT-Schedule) |
| generate_lead | Evento personalizado | 4 |
| FB - Events | Evento personalizado | 1 |
| GA4 - Trigger Events | Personalizado (Client=GA4) | 1 |
| TT - Events | Evento personalizado | 1 |

### 3.4 Google Ads
**Cuenta US: 961-187-1894 ANP Health - US**
- Acceso: christopher@mulleryperez.cl
- Campanas: DETENIDAS (pendiente activar)
- Conversiones configuradas:
  - "Reservar cita (1)" — Principal — Inactiva
  - "Schedule" — Principal — Requiere atencion (importar desde clics)
  - "Reservar cita" — Secundario — Sin conversiones recientes
  - "Clientes potenciales que generaron conversion" — Config incorrecta

**Cuenta LATAM:** Pendiente verificar acceso y configuracion.

### 3.5 Looker Studio (Dashboard existente)
- Nombre: "Reporte ANP Health"
- Paginas: Reporte de conversiones + Reporte de visitas
- Periodo: 29 mar - 27 abr 2026
- Metricas actuales:
  - Conversiones totales: 1,920 (+73.6%)
  - Formulario enviado: 1,160 (+77.9%)
  - Cita agendada: 760 (+67.4%)
- Filtros: Session source, Session medium, Session campaign
- Fuentes principales: fb/paid (49.2%), ig/paid (11%), instagram/organic (7.3%)
- Conversiones por fuente: fb/paid generate_lead (614), fb/paid schedule (331), ig/paid generate_lead (282), ig/paid schedule (149)
- **No incluye Google Ads aun** (campanas no activas)

### 3.6 Logs sGTM (verificacion)
- Evento `schedule` confirmado en logs del 28/04/2026
- Ejemplo: Melissa Cordova, Ecuador, 17:46 UTC, desde fb/paid campaign Ecuador NUR
- El evento llega CLIENT-SIDE (Web GTM → sGTM), no desde el webhook de GHL
- GA4 Measurement ID: G-LFLNEWT9P3

---

## 4. ARQUITECTURA DEL SISTEMA

```
LANDING (usa/latam.anphealthsolutions.com)
    |
    ├─ Web GTM (client-side)
    |   └─ Evento "schedule" cuando alguien agenda
    |       └─ → ss.anphealthsolutions.com (sGTM)
    |           ├─ FB - Schedule (Meta CAPI)
    |           ├─ G Ads - Reservar Cita USA/LATAM (NUEVO)
    |           ├─ G Ads - Schedule (existente)
    |           ├─ G Ads - Enhanced Conversions
    |           └─ TT - Schedule (TikTok)
    |
    └─ Formulario → GHL
        └─ Workflow 1.1 (US/LAT)
            ├─ Condition: Calificado? (Licenciado/Est.Lic/Tecnico)
            |   ├─ SI → Add Tag → Create Opportunity → Add Tag 1.1
            |   |   └─ Webhook POST (con custom data Google Ads)
            |   |       → anphealthsolutions.com/api/v1/webhook/go-high-level
            |   |       → Wait 30m → Pipeline check → WSP sequence
            |   └─ NO → Cancelar sesion + No enviar evento
            └─ None → END
```

---

## 5. PENDIENTES / PASOS A SEGUIR

### Prioridad Alta (para activar campanas)
- [ ] **Verificar cuenta Google Ads LATAM** — confirmar acceso y que las conversiones estan configuradas con los labels de Camila
- [ ] **Resolver estados de conversiones en Google Ads US** — "Reservar cita (1)" inactiva, "Schedule" requiere atencion
- [ ] **Activar campanas de Google Ads** (Alejandro/Camila) — una vez confirmado que todo trackea
- [ ] **Test end-to-end** — enviar lead de prueba por formulario → verificar que conversion llega a Google Ads

### Prioridad Media (Looker Studio)
- [ ] **Replicar dashboard Looker Studio para Google Ads** — Agregar pagina/seccion con:
  - Conversiones Google Ads (Reservar Cita USA + LATAM)
  - Costo por conversion
  - ROAS
  - Filtros por campana, ad group, keyword
  - Comparacion vs Meta (fb/paid)
- [ ] **Conectar Google Ads como fuente de datos en Looker Studio** — El reporte actual usa GA4, agregar Google Ads directamente
- [ ] **Proponer enlace con Reportei** — Cuando las campanas esten corriendo:
  - Automatizar reporte mensual con template M&P
  - Variables sugeridas: Conversiones, CPA, CTR, Impresiones, Clics, Gasto, ROAS
  - Segmentar por: Campana (US vs LAT), Tipo conversion (generate_lead vs schedule), Fuente (Google vs Meta)

### Prioridad Baja (mejoras futuras)
- [ ] **Container LATAM en Stape** — Hoy ambas landings usan el mismo sGTM US. Si crece el volumen LATAM, considerar container separado
- [ ] **Verificar que webhook GHL → ANP API realmente envia a sGTM** — El custom data que agregamos depende de que el API de ANP lo procese. Si no, considerar webhook directo al sGTM
- [ ] **Outgoing request logging en Stape** — Habilitar para verificar que los tags estan enviando correctamente a Google Ads, Meta, TikTok

---

## 6. INFORMACION DE ACCESO

| Plataforma | Cuenta/URL | Acceso |
|-----------|-----------|--------|
| GHL | ANP Health - Channel A (Bradenton, FL) | christopher@mulleryperez.cl |
| Stape | app.stape.io | anphealthsolutions.marketing@gmail.com |
| GTM | tagmanager.google.com (ANP Health - A) | christopher@mulleryperez.cl |
| Google Ads US | 961-187-1894 | christopher@mulleryperez.cl |
| Google Ads LATAM | Pendiente verificar | — |
| Looker Studio | "Reporte ANP Health" | christopher@mulleryperez.cl |
| sGTM URL | https://ss.anphealthsolutions.com | — |
| Webhook endpoint | https://anphealthsolutions.com/api/v1/webhook/go-high-level | — |
| GA4 Measurement ID | G-LFLNEWT9P3 | — |

---

## 7. ETIQUETAS DE CONVERSION (Camila)

| Region | Google Ads Conversion ID | Conversion Label | Tag GTM | Estado |
|--------|------------------------|-----------------|---------|--------|
| USA | 17156646359 | E7bICIHUn6QcENfL9vQ_ | G Ads - Reservar Cita USA | Publicado v6 |
| LATAM | 17396136629 | 94wXCKqVoKQcELX1j-dA | G Ads - Reservar Cita LATAM | Publicado v2 |

---

*Documento generado por M&P — 28 abril 2026*
