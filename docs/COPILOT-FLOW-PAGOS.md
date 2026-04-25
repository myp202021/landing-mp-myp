# Copilot — Integración Flow.cl (Pagos)

> Estado: CÓDIGO LISTO, NO PROBADO EN PRODUCCIÓN
> Keys: en .env.local (FLOW_API_KEY + FLOW_SECRET_KEY)

## Arquitectura

```
Cliente clic "Contratar"
  → /copilot/contratar/{id}
    → POST /api/copilot/checkout
      → Flow.cl /customer/create (o reutiliza existente)
      → Flow.cl /customer/register (asocia tarjeta)
      → Flow.cl /subscription/create (cobro recurrente)
    → Redirect a Flow.cl checkout page
      → Cliente paga
        → Flow.cl webhook → POST /api/webhooks/flow
          → Actualiza clipping_suscripciones.estado = 'activo'
          → Guarda flow_subscription_id
```

## Archivos

| Archivo | Función |
|---------|---------|
| `app/api/copilot/checkout/route.ts` | Crea customer + subscription en Flow |
| `app/api/webhooks/flow/route.ts` | Recibe webhook de pago exitoso |
| `app/copilot/contratar/[id]/ContratarClient.tsx` | UI de contratación |
| `.env.local` | FLOW_API_KEY + FLOW_SECRET_KEY |

## Keys Flow.cl

```
FLOW_API_KEY=437EF948-4EA6-47C9-9A5C-7C9E676LAC70
FLOW_SECRET_KEY=9ff931075880d245934fe82d8d043e5b919bf1b8
```

Estas keys están en `.env.local` y deberían estar en Vercel env vars también.

## Planes Flow.cl (por crear en panel Flow)

| Plan | Precio CLP | Periodo | planId Flow |
|------|-----------|---------|-------------|
| Starter | $34.990 | mensual | POR CREAR |
| Pro | $69.990 | mensual | POR CREAR |
| Business | $119.990 | mensual | POR CREAR |

## Pasos para activar

1. **Entrar a panel Flow.cl** → Suscripciones → Crear planes con los precios
2. **Copiar planIds** de Flow y actualizar en `ContratarClient.tsx`
3. **Agregar keys a Vercel**: Settings → Environment Variables → FLOW_API_KEY + FLOW_SECRET_KEY
4. **Verificar webhook URL**: `https://www.mulleryperez.cl/api/webhooks/flow` debe estar registrado en Flow
5. **Testear con Flow Sandbox** antes de producción
6. **Probar flujo completo**: clic contratar → pago → webhook → estado=activo

## Webhook Flow

Cuando Flow confirma un pago, envía POST a `/api/webhooks/flow` con:
- `token`: token de la transacción
- Se consulta `/payment/getStatus` con ese token
- Si status=2 (pagado): actualizar suscripción a activo

## Campos en clipping_suscripciones

- `flow_customer_id`: ID del customer en Flow
- `flow_subscription_id`: ID de la suscripción en Flow
- `estado`: cambia a 'activo' tras pago exitoso
- `plan`: se actualiza según el plan contratado

## Pendientes

- [ ] Crear planes en panel Flow.cl
- [ ] Agregar keys a Vercel
- [ ] Test con Flow Sandbox
- [ ] Probar webhook end-to-end
- [ ] Email de confirmación al pagar
- [ ] Cancelación: webhook de cancelación → estado='cancelado'
