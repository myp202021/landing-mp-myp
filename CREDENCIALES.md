# Credenciales de Acceso - CRM Müller y Pérez

## ADMIN - Acceso completo al CRM

**URL:** https://www.mulleryperez.cl/login

**Usuario:** `admin`
**Contraseña:** `myp2025`

**Funcionalidades disponibles:**
- Ver todos los clientes y todos sus leads
- Crear/editar/eliminar clientes
- Ver/editar/eliminar leads de cualquier cliente
- Ver métricas globales (total leads, contactados, vendidos, monto total)
- Crear cotizaciones
- Eliminar leads masivamente
- Cambiar estados de leads (Nuevo → Contactado → Vendido/Negativo)

---

## CLIENTE - Portal del Cliente M&P

**URL:** https://www.mulleryperez.cl/login

**ID de cliente (UUID):** `b1f839a4-db36-4341-b1b3-7d1ec290ca02`
**Contraseña:** `m&p-marketingdigital` (nombre del cliente en minúsculas sin espacios)

**Funcionalidades disponibles:**
- Ver dashboard con estadísticas de sus propios leads
- Ver historial completo de sus leads
- Eliminar leads (solo los propios)
- Editar estado de leads (contactado, vendido, monto)
- Ver cotizaciones asociadas a sus leads
- Crear nuevas cotizaciones

---

## Notas Importantes

1. **Portal Admin vs Portal Cliente:**
   - Admin (`/crm`): Ve TODOS los clientes y TODOS los leads
   - Cliente (`/cliente/[id]`): Solo ve SUS propios leads

2. **Contraseñas de clientes:**
   - Por defecto, la contraseña es el nombre del cliente en minúsculas sin espacios
   - Ejemplo: "M&P - Marketing Digital" → contraseña: `m&p-marketingdigital`

3. **IDs de Cliente:**
   - Para login de cliente, usa el UUID del cliente (se puede obtener desde el admin)
   - El UUID de M&P es: `b1f839a4-db36-4341-b1b3-7d1ec290ca02`

---

## Diferencias entre Portales

| Funcionalidad | Admin `/crm` | Cliente `/cliente/[id]` |
|--------------|--------------|-------------------------|
| Ver todos los clientes | ✅ Sí | ❌ No |
| Ver solo sus leads | ✅ Sí (filtrable) | ✅ Sí |
| Crear clientes | ✅ Sí | ❌ No |
| Eliminar clientes | ✅ Sí | ❌ No |
| Eliminar leads | ✅ Sí | ✅ Sí (solo propios) |
| Editar leads | ✅ Sí | ✅ Sí (solo propios) |
| Ver métricas globales | ✅ Sí | ✅ Sí (solo propias) |
| Crear cotizaciones | ✅ Sí | ✅ Sí |
