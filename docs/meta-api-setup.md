# Configuración Meta Graph API - Permisos Necesarios

## 🎯 Objetivo
Extraer datos de mercado, competidores y tendencias para dashboard de marketing

## ⚙️ Permisos Requeridos

### Para analizar páginas públicas de Facebook:
1. **`pages_read_engagement`** - Leer métricas de engagement de páginas
2. **`pages_show_list`** - Listar páginas que administras
3. **`pages_read_user_content`** - Leer posts de páginas

### Para analizar cuentas de Instagram:
4. **`instagram_basic`** - Datos básicos de perfil e insights
5. **`instagram_manage_insights`** - Métricas detalladas
6. **`business_management`** - Acceso a Business Manager

### Para búsquedas y discovery:
7. **`catalog_management`** - Ya lo tienes ✅

## 📋 Cómo Solicitar Permisos

### Opción 1: Graph API Explorer (Rápido - Token temporal)
1. Ve a: https://developers.facebook.com/tools/explorer/
2. En "Permisos" → "Agregar un permiso"
3. Busca y agrega cada permiso de la lista
4. Click "Generar token de acceso"
5. Copia el nuevo token

### Opción 2: App de Facebook (Permanente)
1. Ve a: https://developers.facebook.com/apps/
2. Selecciona tu app (o crea una nueva)
3. "Configuración de la app" → "Básica"
4. Agrega los productos: "Instagram" y "Página"
5. En cada producto, solicita los permisos necesarios
6. Genera un token de acceso de larga duración

## 🔍 Qué Podrás Extraer con Permisos Completos

### 1. Análisis de Competidores
- Seguidores, engagement rate, posts recientes
- Temas más comentados/compartidos
- Horarios de publicación óptimos

### 2. Tendencias de Mercado
- Hashtags trending en marketing digital Chile
- Tipos de contenido con mejor performance
- Colaboraciones de marca detectadas

### 3. Benchmark
- Comparar tu agencia vs competencia
- Métricas: engagement, crecimiento, frecuencia

## 🚀 Próximos Pasos

1. Solicitar permisos adicionales
2. Generar nuevo token
3. Ejecutar `node scripts/test-meta-api.js` con nuevo token
4. Construir dashboard basado en datos obtenidos
