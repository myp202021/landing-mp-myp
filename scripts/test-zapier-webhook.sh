#!/bin/bash

# Script para testear el webhook de Zapier
# Simula una petición de Zapier con datos de Facebook Lead Ads

# CLIENTE ACTIVO:
CLIENT_ID="bf1b925e-8799-4db4-bd12-d12fbd106020"  # M&P Marketing y Performance

echo "======================================"
echo "🧪 TEST WEBHOOK ZAPIER"
echo "======================================"
echo ""
echo "Cliente: M&P Marketing y Performance"
echo "ID: $CLIENT_ID"
echo ""
echo "Enviando lead de prueba..."
echo ""

# Test endpoint local (si estás corriendo en dev)
# URL="http://localhost:3000/api/leads/zapier"

# Test endpoint producción
URL="https://www.mulleryperez.cl/api/leads/zapier"

# Payload de prueba (simula datos de Facebook Lead Ads via Zapier)
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "'"$CLIENT_ID"'",
    "full_name": "Juan Pérez Test",
    "email": "juan.test@example.com",
    "phone_number": "+56912345678",
    "form_name": "Formulario Test Zapier",
    "ad_name": "Anuncio Test",
    "campaign_name": "Campaña Test Zapier"
  }'

echo ""
echo ""
echo "======================================"
echo "✅ Test completado"
echo "======================================"
echo ""
echo "Si ves un mensaje de éxito, el webhook está funcionando."
echo "Revisa el CRM en https://www.mulleryperez.cl/crm para ver el lead creado."
echo ""
