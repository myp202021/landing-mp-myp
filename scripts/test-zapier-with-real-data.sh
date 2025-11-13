#!/bin/bash

# Test con datos REALES del screenshot de Zapier

CLIENT_ID="bf1b925e-8799-4db4-bd12-d12fbd106020"

echo "======================================"
echo "🧪 TEST CON DATOS REALES DE ZAPIER"
echo "======================================"
echo ""
echo "Simulando exactamente lo que Zapier está enviando..."
echo ""

curl -X POST "https://www.mulleryperez.cl/api/leads/zapier" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "'"$CLIENT_ID"'",
    "full_name": "Priscila M aldonado",
    "email": "Daluaspa@gmail.com",
    "phone_number": "+56981378588",
    "form_id": "1110829226975102",
    "form_name": "Formular io - Myp - Plan Integral",
    "ad_name": "Carrusel",
    "campaign_name": "Clientes potenc...lico segmenta do"
  }'

echo ""
echo ""
echo "======================================"
echo "✅ Test completado"
echo "======================================"
echo ""
