# 🎯 MINI-CRM SETUP GUIDE

Sistema de gestión de leads Meta Ads - MVP completado

## ✅ LO QUE YA ESTÁ HECHO

### 1. **Database Schema** ✅
- Archivo: `supabase/migrations/20251028_create_crm_schema.sql`
- 5 tablas: `clientes`, `usuarios`, `leads`, `cargas`, `lead_audits`, `catalogo_razones`
- RLS policies configuradas
- Triggers de auditoría automáticos
- Índices para performance
- Seed data (2 clientes demo)

### 2. **API Routes** ✅
- `/api/crm/upload` - Subir y parsear archivos (.csv, .xls, .xlsx)
- `/api/crm/leads` - CRUD de leads con filtros
- `/api/crm/cargas` - Historial de cargas
- `/api/crm/audits` - Auditoría de cambios
- `/api/crm/usuarios` - Gestión de usuarios
- `/api/crm/clientes` - Gestión de clientes

### 3. **Frontend Pages** ✅
- `/crm/leads` - Dashboard principal con filtros y edición inline
- `/crm/upload` - Subir archivos con drag & drop
- `/crm/cargas` - Historial de archivos subidos
- `/crm/admin` - Gestión de usuarios (admin M&P)
- Navegación integrada en todas las páginas

### 4. **Features Implementadas** ✅
- ✅ Multi-tenant con RLS
- ✅ Upload de archivos con límites (5MB, 5k rows)
- ✅ Parsing automático de CSV/Excel
- ✅ Mapeo de campos Meta → DB
- ✅ Deduplicación automática (email/teléfono + fecha)
- ✅ Detección de archivos duplicados (SHA-256)
- ✅ Filtros: búsqueda, mes, contactado, vendido
- ✅ Edición inline de campos de gestión
- ✅ Estadísticas en tiempo real
- ✅ Audit trail automático de todos los cambios
- ✅ Historial detallado de cargas con errores

---

## 🔧 PASOS PENDIENTES PARA DEPLOYMENT

### PASO 1: Aplicar migración en Supabase

**Opción A - Desde Supabase Dashboard (Recomendado)**

1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú lateral
4. Copia todo el contenido de `supabase/migrations/20251028_create_crm_schema.sql`
5. Pégalo en el editor y haz clic en **Run**
6. Verifica que se ejecutó sin errores

**Opción B - Con Supabase CLI**

```bash
# Instalar Supabase CLI (si no lo tienes)
brew install supabase/tap/supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref TU_PROJECT_REF

# Aplicar migración
supabase db push
```

### PASO 2: Configurar variables de entorno en Vercel

Asegúrate de tener estas variables en Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_publica
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_secreta
```

**⚠️ IMPORTANTE:** `SUPABASE_SERVICE_ROLE_KEY` bypasea RLS, solo usar en APIs server-side.

### PASO 3: Deploy a Vercel

```bash
# Commit todos los cambios
git add .
git commit -m "feat: Add mini-CRM system with upload, dashboard, and admin"

# Push (si tienes Git conectado a Vercel, auto-deploys)
git push origin master

# O deploy manual
vercel --prod
```

---

## 🎯 TESTING INICIAL

### 1. Verificar tablas creadas

En Supabase SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('clientes', 'usuarios', 'leads', 'cargas', 'lead_audits', 'catalogo_razones');
```

Deberías ver las 6 tablas.

### 2. Verificar clientes demo

```sql
SELECT * FROM clientes;
```

Deberías ver 2 clientes:
- `00000000-0000-0000-0000-000000000001` - Muller y Pérez
- `00000000-0000-0000-0000-000000000002` - Cliente Demo

### 3. Crear primer usuario admin

**En Supabase Dashboard:**

1. Ve a **Authentication** → **Users**
2. Crea un nuevo usuario (ej: `admin@mulleryperez.com`)
3. Copia el UUID del usuario creado
4. En **SQL Editor**, ejecuta:

```sql
INSERT INTO usuarios (id, email, nombre, cliente_id, rol, activo)
VALUES (
  'UUID_DEL_USUARIO',
  'admin@mulleryperez.com',
  'Admin M&P',
  '00000000-0000-0000-0000-000000000001',
  'admin',
  true
);
```

### 4. Test upload con archivo real

Tienes un archivo de ejemplo en:
```
/Users/christophermuller/Downloads/Formulario - MyP - 2025 - Plan Integral_Leads_2025-10-28_2025-10-28.xls
```

1. Ve a `/crm/upload`
2. Selecciona "Cliente Demo"
3. Arrastra el archivo o selecciónalo
4. Sube y verifica resultados

---

## 📊 ESTRUCTURA DE ARCHIVOS CREADA

```
app/
├── crm/
│   ├── layout.tsx              # Layout con navegación
│   ├── leads/page.tsx          # Dashboard principal
│   ├── upload/page.tsx         # Subir archivos
│   ├── cargas/page.tsx         # Historial de cargas
│   └── admin/page.tsx          # Admin usuarios
├── api/crm/
│   ├── upload/route.ts         # Upload + parsing
│   ├── leads/route.ts          # CRUD leads
│   ├── cargas/route.ts         # Historial
│   ├── audits/route.ts         # Auditoría
│   ├── usuarios/route.ts       # Usuarios
│   └── clientes/route.ts       # Clientes

components/
└── crm/
    └── Navigation.tsx          # Navegación CRM

supabase/
└── migrations/
    └── 20251028_create_crm_schema.sql
```

---

## 🔒 SEGURIDAD IMPLEMENTADA

1. **RLS (Row Level Security)** en todas las tablas
2. **Service Role Key** solo en server-side APIs
3. **Validación de archivos**: extensión, tamaño (5MB), filas (5k)
4. **Deduplicación automática**: evita duplicar email/teléfono
5. **SHA-256 checksums**: detecta archivos ya subidos
6. **Sanitización de inputs**: solo campos permitidos en updates
7. **Audit trail automático**: triggers registran todos los cambios

---

## 📝 CÓMO USAR EL SISTEMA

### Para Admin M&P:

1. **Crear clientes nuevos:**
   - Ve a `/crm/admin` (o usa la API `/api/crm/clientes`)
   - Agrega empresa + rubro

2. **Crear usuarios:**
   - Crea usuario en Supabase Auth primero
   - Copia UUID del usuario
   - En `/crm/admin`, crea usuario vinculado al cliente

### Para Clientes:

1. **Subir leads:**
   - Ve a `/crm/upload`
   - Selecciona tu cliente
   - Arrastra archivo CSV/Excel de Meta

2. **Gestionar leads:**
   - Ve a `/crm/leads`
   - Filtra por mes, estado, búsqueda
   - Haz clic en "Editar" para marcar contactados/vendidos
   - Ingresa monto de venta

3. **Ver historial:**
   - Ve a `/crm/cargas`
   - Ve todos los archivos subidos
   - Click en una carga para ver detalles

---

## 🐛 DEBUGGING

### Si el upload falla:

1. **Verifica variables de entorno:**
   ```bash
   vercel env ls
   ```

2. **Revisa logs de Vercel:**
   ```bash
   vercel logs --follow
   ```

3. **Verifica RLS policies:**
   - Las APIs usan `SUPABASE_SERVICE_ROLE_KEY` que bypasea RLS
   - Pero asegúrate de que la key esté configurada

### Si no aparecen leads:

1. **Verifica en Supabase:**
   ```sql
   SELECT COUNT(*) FROM leads WHERE cliente_id = 'UUID_DEL_CLIENTE';
   ```

2. **Revisa logs del browser:**
   - Abre DevTools → Console
   - Busca errores de fetch

---

## 🚀 PRÓXIMOS PASOS (Futuras mejoras)

- [ ] Autenticación con Supabase Auth (login/logout)
- [ ] Exportar leads a Excel
- [ ] Gráficos de conversión por mes
- [ ] Webhooks para notificaciones
- [ ] Integración directa con Meta API
- [ ] Tags/etiquetas para leads
- [ ] Asignación de leads a vendedores
- [ ] Reportes personalizados

---

## ✅ CHECKLIST DE DEPLOYMENT

- [ ] Migración aplicada en Supabase
- [ ] Variables de entorno configuradas en Vercel
- [ ] Primer usuario admin creado
- [ ] Deploy completado en Vercel
- [ ] Test de upload con archivo real
- [ ] Test de edición de leads
- [ ] Test de filtros funcionando
- [ ] Verificar historial de cargas

---

**¿Todo listo?** Una vez completados estos pasos, el CRM estará 100% funcional en producción.

**URLs del CRM en producción:**
- Dashboard: https://mulleryperez.cl/crm/leads
- Upload: https://mulleryperez.cl/crm/upload
- Historial: https://mulleryperez.cl/crm/cargas
- Admin: https://mulleryperez.cl/crm/admin
