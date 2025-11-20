#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "📋 INSTRUCCIONES PARA APLICAR MIGRACIÓN 004"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "PASO 1: Ve a Supabase Dashboard"
echo "  → https://supabase.com/dashboard/project/_/sql"
echo ""
echo "PASO 2: Abre SQL Editor (menú lateral izquierdo)"
echo ""
echo "PASO 3: Copia COMPLETO el contenido del archivo:"
echo "  → database/migrations/004_create_integrations_tables.sql"
echo ""
echo "PASO 4: Pégalo en el SQL Editor y haz clic en 'Run'"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📄 Abriendo archivo de migración..."
echo ""

cat database/migrations/004_create_integrations_tables.sql

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Copia el SQL de arriba y pégalo en Supabase SQL Editor"
echo "═══════════════════════════════════════════════════════════"
