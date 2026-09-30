#!/bin/bash

# Script para notificar a buscadores sobre el sitio
# Ejecutar después de desplegar cambios

SITE_URL="https://www.mulleryperez.cl"
SITEMAP_URL="https://www.mulleryperez.cl/sitemap.xml"
INDEXNOW_KEY="272d893a828539aeac2e5cb3d64cbde9"

echo "🚀 Notificando a buscadores..."

# 1. Ping a Google
echo "📍 Google..."
curl -s "https://www.google.com/ping?sitemap=${SITEMAP_URL}" > /dev/null
echo "✅ Google notificado"

# 2. Ping a Bing
echo "📍 Bing..."
curl -s "https://www.bing.com/ping?sitemap=${SITEMAP_URL}" > /dev/null
echo "✅ Bing notificado"

# 3. IndexNow (Bing, Yandex, etc)
echo "📍 IndexNow..."
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"www.mulleryperez.cl\",
    \"key\": \"${INDEXNOW_KEY}\",
    \"keyLocation\": \"https://www.mulleryperez.cl/indexnow-key.txt\",
    \"urlList\": [
      \"${SITE_URL}/\",
      \"${SITE_URL}/labs\",
      \"${SITE_URL}/labs/predictor\",
      \"${SITE_URL}/labs/buyer-gen\",
      \"${SITE_URL}/labs/radar-industrias\",
      \"${SITE_URL}/utilidades\",
      \"${SITE_URL}/utilidades/calculadora-cac\",
      \"${SITE_URL}/utilidades/comparador-web\",
      \"${SITE_URL}/utilidades/generador-funnels\",
      \"${SITE_URL}/utilidades/juega-aprende\",
      \"${SITE_URL}/blog\",
      \"${SITE_URL}/blog/costo-google-ads-chile-2025\",
      \"${SITE_URL}/blog/optimizar-roas-meta-ads-2025\",
      \"${SITE_URL}/blog/kpis-marketing-digital-chile\",
      \"${SITE_URL}/blog/agencia-marketing-digital-santiago-2025\",
      \"${SITE_URL}/blog/agencia-performance-marketing-las-condes\",
      \"${SITE_URL}/blog/cuanto-cuesta-agencia-marketing-digital-chile-2025\",
      \"${SITE_URL}/blog/mejor-agencia-google-ads-santiago-2025\"
    ]
  }"

echo "✅ IndexNow enviado"

echo ""
echo "🎉 ¡Listo! Los buscadores han sido notificados."
echo "⏳ La indexación puede tomar 24-48 horas."
