# Plan de Test Radar — De punta a punta

**Fecha:** 21 abril 2026
**Objetivo:** Verificar el flujo completo del producto Radar desde el registro hasta la grilla mensual.
**Usuario test:** chmuller5@gmail.com (se registra desde el sitio como cualquier cliente)
**Regla:** NO se llaman APIs de pago desde terminal. NO se disparan workflows manualmente. Todo lo prueba el usuario.

---

## Pre-requisitos

Antes de iniciar el test, verificar:

- [ ] Flow.cl: 0 clientes activos (limpiar si hay)
- [ ] Supabase: 0 suscripciones para chmuller5@gmail.com
- [ ] El plan RADAR-TEST ($1.000) existe en Flow
- [ ] Vercel desplegó el último commit
- [ ] La página /clipping carga sin errores
- [ ] La página /clipping/contratar/[id] carga sin errores (verificar con un ID inexistente que muestre "Suscripción no encontrada", no "Error al procesar")

---

## FASE 1: Registro trial

**Quién ejecuta:** El usuario (Christopher) desde el browser.

### Pasos:
1. Ir a https://www.mulleryperez.cl/clipping
2. Scroll al formulario de trial
3. Llenar:
   - Email: chmuller5@gmail.com
   - Empresa: Muller y Perez
   - Descripción: Agencia de performance marketing digital
   - Cuenta 1: instagram.com/rompecabeza.digital (Rompecabeza)
   - Cuenta 2: instagram.com/caboradcl (Cebra)
   - Cuenta 3: instagram.com/moov.media (Moov Media)
4. Clic "Activar Radar"

### Verificaciones:
- [ ] La landing muestra "Radar activado" con botones "Configurar mis cuentas" y "Ver mi dashboard"
- [ ] **Email CLIENTE** llega a chmuller5@gmail.com:
  - Asunto: "Muller y Perez, bienvenido a Radar | Tu prueba de 7 dias comienza ahora"
  - Contiene: botón "Configurar mis cuentas" → /radar/configurar/[id]
  - Contiene: botón "Contratar plan" → /clipping/contratar/[id]
  - Contiene: links privados (dashboard + configurar)
  - NO contiene link al CRM admin
- [ ] **Email ADMIN** llega a contacto@mulleryperez.cl:
  - Asunto: "[Admin] Nuevo trial Radar: Muller y Perez"
  - Contiene: link al CRM
- [ ] Supabase: suscripción creada con estado=trial, plan=starter, 3 cuentas IG
- [ ] CRM /crm/radar: muestra el nuevo trial

---

## FASE 2: Configuración

**Quién ejecuta:** El usuario desde el browser.

### Pasos:
1. Clic en "Configurar mis cuentas" del email de bienvenida
2. Agregar datos en "Tu presencia digital": web, IG propio, LI, FB
3. Agregar una cuenta más en LinkedIn (pegar URL completa para verificar auto-limpieza)
4. Agregar keywords de prensa
5. Guardar configuración

### Verificaciones:
- [ ] Config page carga sin errores
- [ ] Campos "Tu presencia digital" visibles y editables
- [ ] Al pegar URL completa de LinkedIn, se limpia a solo el slug al guardar
- [ ] Mensaje "Guardado" aparece
- [ ] Supabase: cuentas actualizadas, perfil_empresa con web/IG/LI/FB
- [ ] Muestra "4/5" cuentas y botón "Subir de plan" si llega al límite

---

## FASE 3: Pago

**Quién ejecuta:** El usuario desde el browser. NADIE más toca Flow.

### Pasos:
1. Desde el email de bienvenida, clic en "Contratar plan"
2. La página /clipping/contratar/[id] carga con planes (Test $1.000 visible porque email es M&P)
3. Seleccionar plan Test, periodo mensual
4. Clic "Suscribirme"
5. Flow redirige a página de registro de tarjeta
6. Completar datos de tarjeta en Flow
7. Flow redirige a /clipping/confirmacion?email=chmuller5@gmail.com

### Verificaciones:
- [ ] Contratar page carga sin "Error al procesar"
- [ ] Plan Test $1.000 visible (sin necesidad de ?test=1)
- [ ] Flow crea customer nuevo + registra tarjeta
- [ ] Confirmación muestra "Radar activado" con botones config/dashboard
- [ ] **Email CLIENTE** llega: "Muller y Perez, tu Radar esta activo | Configura tus cuentas"
- [ ] **Email ADMIN** llega: "[Admin] Pago confirmado: Muller y Perez"
- [ ] Supabase: estado=activo, plan=test, flow_customer_id y flow_subscription_id presentes
- [ ] Flow dashboard: cliente activo con suscripción

### Posibles problemas:
- Si Flow rechaza por customer duplicado: el checkout maneja esto y activa de todas formas
- Si la firma del webhook no coincide: el webhook procesa igual (log warning)
- Si el webhook tarda: la confirmación page intenta activar la suscripción server-side

---

## FASE 4: Email diario

**Quién ejecuta:** Nadie. El cron corre automáticamente a las 7:30 AM Chile (10:30 UTC).
**Alternativa para test:** Disparar workflow desde GitHub Actions → Run workflow → pegar suscriptor_id para procesar SOLO el test.

### Verificaciones:
- [ ] Email llega a chmuller5@gmail.com
- [ ] Asunto: "Muller y Perez | Tu Radar diario | N posts | YYYY-MM-DD"
- [ ] Header: "Tu Radar diario" con fecha y ventana 72 horas
- [ ] KPIs: Posts, Redes activas, Likes, Empresas (solo Rompecabeza, Cebra, Moov)
- [ ] Análisis IA presente (OpenAI)
- [ ] CTA: "Configurar cuentas" (NO "Contrata tu plan" porque ya es activo)
- [ ] CTA secundario: "Ver dashboard"
- [ ] Tabla por empresa: solo las empresas del suscriptor, NO Genera/Buk/Talana
- [ ] PDF adjunto
- [ ] Posts persisten en radar_posts con suscripcion_id correcto

---

## FASE 5: Email semanal

**Quién ejecuta:** Cron lunes 9:00 AM Chile (12:00 UTC).
**Alternativa:** workflow_dispatch con suscriptor_id.

### Verificaciones:
- [ ] Email llega a chmuller5@gmail.com
- [ ] Asunto: "Muller y Perez | Resumen semanal | N posts | YYYY-MM-DD"
- [ ] Análisis IA con Claude (más profundo que el diario)
- [ ] **Contenido sugerido**: 3 copies con plataforma, tipo, ángulo, copy completo, score QA
- [ ] Cada copy usa el perfil del cliente (nombre, rubro, tono, web)
- [ ] CTA: "Configurar cuentas"
- [ ] PDF adjunto
- [ ] Copies persisten en radar_contenido (tipo=copy, mes, score_promedio)
- [ ] Dashboard pestaña Contenido muestra los copies

### Pipeline de agentes (verificar en logs del workflow):
1. **Agente Brief (OpenAI):** analiza posts → genera 3 briefs
2. **Agente Copy (Claude):** toma cada brief → escribe copy completo
3. **Agente QA (OpenAI):** revisa copy → score ≥ 70 → aprueba o corrige

---

## FASE 6: Email mensual

**Quién ejecuta:** Cron 1ro del mes 9:00 AM Chile (12:00 UTC).
**Alternativa:** workflow_dispatch con suscriptor_id.

### Verificaciones:
- [ ] Email llega a chmuller5@gmail.com
- [ ] Asunto: "Muller y Perez | Resumen mensual | N posts | YYYY-MM-DD"
- [ ] Análisis IA consolidado del mes
- [ ] **Grilla mensual** en el cuerpo del email: tabla con N posts (según plan)
  - Cada post: fecha, plataforma, tipo, título, copy
- [ ] **PDF adjunto** con el informe completo
- [ ] **Excel adjunto** (.xlsx) con la grilla: fecha, plataforma, tipo, copy, hashtags, nota diseño, score
- [ ] Contenido sugerido (copies) también presente
- [ ] Grilla persiste en radar_contenido (tipo=grilla, mes, score_promedio)
- [ ] Dashboard pestaña Contenido muestra la grilla con tabla visual
- [ ] Botón "Descargar Excel" funciona en el dashboard

### Pipeline de agentes (verificar en logs):
1. **Agente Perfil (OpenAI):** si perfil incompleto, scrape web + posts → genera perfil
2. **Agente Brief Grilla (OpenAI):** genera plan de N posts con estacionalidad
3. **Agente Copy Grilla (Claude):** escribe copy para cada post
4. **Agente QA Grilla (OpenAI):** revisa cada copy, corrige si score < 70
5. **Agente Brief Copies (OpenAI):** genera 3 briefs de contenido sugerido
6. **Agente Copy Sugerido (Claude):** escribe copies
7. **Agente QA Copies (OpenAI):** revisa y aprueba

### Cantidad de posts en grilla por plan:
- starter: 4 posts
- pro: 8 posts
- business: 16 posts
- test: 16 posts

---

## FASE 7: Dashboard

**Quién ejecuta:** El usuario desde el browser.

### Verificaciones:
- [ ] /radar/[id] carga sin errores
- [ ] Tab "Competencia": KPIs, gráfico barras, tabla empresas, posts recientes
- [ ] Tab "Contenido": KPIs (copies totales, posts en grillas, entregas)
- [ ] Filtro por mes funciona
- [ ] Grilla mensual como tabla: #, fecha, plataforma, tipo, copy, score
- [ ] Copies semanales como cards con score
- [ ] Botón "Descargar Excel" genera archivo .xlsx válido
- [ ] Botón "Configurar" en header funciona

---

## FASE 8: CRM Admin

**Quién ejecuta:** El usuario desde el browser.

### Verificaciones:
- [ ] /crm/radar carga
- [ ] KPIs: Total, Trial, Activos, Suspendidos, Cancelados
- [ ] Tabla muestra el suscriptor test con datos correctos
- [ ] Filtros por estado funcionan
- [ ] Botón "Eliminar" borra posts + contenido + suscripción (cascade)

---

## FASE 9: Lifecycle emails

**No se testean en este ciclo.** Requieren que pasen 5-7 días reales.

### Lo que debería pasar:
- Día 0: email bienvenida (ya verificado en Fase 1)
- Día 5: "Ya llevas 5 dias usando Radar | Que tal la experiencia?"
- Día 6: "Tu prueba termina manana | Elige tu plan"
- Día 7+: si no pagó → "Tu Radar se desactivo | Reactivalo aqui"
- Pago fallido +3 días: "Tu pago no se proceso | Actualiza tu tarjeta"

### Verificación futura:
- [ ] Revisar que el cron radar-lifecycle.yml corre diario a las 8 AM
- [ ] Crear un trial con trial_ends en el pasado para simular vencimiento

---

## Mejoras identificadas

### Prioridad alta:
1. **Onboarding post-pago:** después de activar, mostrar checklist de configuración (no solo links)
2. **Email de bienvenida post-pago:** diferente al de trial, con links de dashboard + instrucciones
3. **Webhook robusto:** guardar logs de cada webhook recibido para debugging

### Prioridad media:
4. **Diseño gráfico en grillas:** templates HTML→PNG o integración con herramienta de diseño
5. **Upload de logo** en config page para personalizar emails y gráficas
6. **Notificación push** cuando llega el informe (WhatsApp API o Telegram)
7. **Multi-destinatario configurable:** que el cliente pueda agregar más emails en config

### Prioridad baja:
8. **Dashboard público** con URL compartible (para que el cliente muestre a su equipo)
9. **Comparativa mensual:** benchmark acumulativo mes a mes
10. **Integración Slack/Discord:** enviar resumen a un canal

---

## Limpieza post-test

Después de completar todas las fases:
1. Decidir si mantener el suscriptor test o eliminarlo
2. Si se elimina: borrar en Flow + Supabase (radar_contenido, radar_posts, clipping_suscripciones)
3. Documentar resultados en este archivo (marcar checkboxes)
