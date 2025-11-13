#!/bin/bash

# ============================================
# SCRIPT DE LIMPIEZA DEL CRM
# Organiza archivos redundantes y duplicados
# ============================================

echo "🧹 Iniciando limpieza del CRM..."
echo ""

# Crear carpetas necesarias
echo "📁 Creando estructura de carpetas..."
mkdir -p supabase/archived
mkdir -p scripts/debug
mkdir -p projects/mercator

# Mover SQL sueltos del root a archived
echo "📦 Moviendo archivos SQL a supabase/archived/..."
if [ -f "supabase-cotizaciones-crm.sql" ]; then
  mv supabase-cotizaciones-crm.sql supabase/archived/
  echo "  ✓ supabase-cotizaciones-crm.sql"
fi

if [ -f "supabase-inversiones.sql" ]; then
  mv supabase-inversiones.sql supabase/archived/
  echo "  ✓ supabase-inversiones.sql"
fi

if [ -f "supabase-meta-integration.sql" ]; then
  mv supabase-meta-integration.sql supabase/archived/
  echo "  ✓ supabase-meta-integration.sql"
fi

if [ -f "supabase-add-inversion.sql" ]; then
  mv supabase-add-inversion.sql supabase/archived/
  echo "  ✓ supabase-add-inversion.sql"
fi

if [ -f "reset-ids.sql" ]; then
  mv reset-ids.sql supabase/archived/
  echo "  ✓ reset-ids.sql"
fi

if [ -f "test-login.sql" ]; then
  mv test-login.sql supabase/archived/
  echo "  ✓ test-login.sql"
fi

# Mover scripts temporales a debug
echo ""
echo "🔧 Moviendo scripts de debug..."
for file in inspect*.js test-*.js truncate-all.js reset-sequence.js; do
  if [ -f "$file" ]; then
    mv "$file" scripts/debug/
    echo "  ✓ $file"
  fi
done

# Eliminar script duplicado de análisis
echo ""
echo "🗑️  Eliminando archivos duplicados..."
if [ -f "scripts/analizar-duplicados.js" ]; then
  rm scripts/analizar-duplicados.js
  echo "  ✓ scripts/analizar-duplicados.js (conservando -simple.js)"
fi

# Mover proyecto Mercator
echo ""
echo "📂 Moviendo proyecto Mercator..."
if [ -d "cotizaciones" ]; then
  mv cotizaciones projects/mercator/
  echo "  ✓ cotizaciones/ → projects/mercator/"
fi

# Eliminar carpeta de login duplicado (preguntar primero)
echo ""
read -p "¿Eliminar app/login/ duplicado? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  if [ -d "app/login" ]; then
    rm -rf app/login
    echo "  ✓ app/login/ eliminado"
  fi
else
  echo "  ⊘ app/login/ conservado"
fi

# Crear README en carpeta archived
echo ""
echo "📝 Creando README en carpetas..."
cat > supabase/archived/README.md << 'EOF'
# Archivos SQL Archivados

Esta carpeta contiene migraciones SQL que ya fueron aplicadas a la base de datos.

**IMPORTANTE**: Estos archivos NO se ejecutan automáticamente.

Para aplicar una migración nueva, colocarla en `supabase/migrations/` con formato:
`YYYYMMDD_descripcion.sql`

## Archivos en esta carpeta:
- Scripts sueltos que estaban en root
- Migraciones manuales aplicadas
- Scripts de testing y debugging
EOF

cat > scripts/debug/README.md << 'EOF'
# Scripts de Debug y Testing

Scripts temporales para desarrollo y debugging del CRM.

**NO ejecutar en producción.**

## Contenido:
- `inspect*.js` - Inspección de datos
- `test-*.js` - Scripts de prueba
- `truncate-all.js` - Limpieza de tablas (PELIGROSO)
EOF

echo "  ✓ README creados"

# Resumen
echo ""
echo "=" | head -c 60
echo ""
echo "✅ LIMPIEZA COMPLETADA"
echo ""
echo "📊 Resumen:"
echo "  • Archivos SQL archivados en supabase/archived/"
echo "  • Scripts de debug en scripts/debug/"
echo "  • Proyecto Mercator en projects/mercator/"
echo "  • Script duplicado eliminado"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Revisar AUDITORIA_CRM_COMPLETA.md"
echo "  2. Ejecutar migraciones de seguridad"
echo "  3. Eliminar contraseñas hardcodeadas"
echo ""
