# 🚀 Landing Page Builder - Piloto Arturo

Integración de **Destack** en mulleryperez.cl para que clientes puedan crear sus propias landing pages.

## 📋 Lo que se implementó

### 1. **Tablas en Supabase**
- `client_landings` - Landings de clientes
- `landing_assets` - Assets (imágenes, archivos)
- `landing_analytics` - Métricas básicas

### 2. **Rutas en la App**

#### CRM (Clientes Logueados)
- `/crm/landings` - Lista de landings del cliente
- `/crm/landings/[id]/edit` - Editor visual de Destack

#### Público
- `/l/[clientId]/[slug]` - Landing pública (ej: `/l/abc123/mi-landing`)

#### API
- `/api/builder/[...destack]` - Backend de Destack

## 🔧 Instrucciones de Deploy

### Paso 1: Ejecutar Migración en Supabase

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Entra a **SQL Editor**
3. Copia el contenido de `/supabase/migrations/create_landings_tables.sql`
4. Pega y ejecuta el SQL
5. Verifica que se crearon las tablas:
   - `client_landings`
   - `landing_assets`
   - `landing_analytics`

### Paso 2: Hacer Commit y Push

```bash
cd /Users/christophermuller/landing-mp-myp-NUEVO

git add .
git commit -m "feat: Landing page builder con Destack para clientes

- Integración de Destack (editor visual)
- Tablas en Supabase para multi-tenancy
- Rutas CRM para gestión de landings
- Rutas públicas para visualización
- RLS configurado para seguridad
- Piloto con cliente Arturo"

git push origin main
```

### Paso 3: Deploy en Vercel

Vercel detectará automáticamente el push y hará deploy.

**Verificar que las env vars estén configuradas en Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🧪 Probar con Arturo

### 1. Crear usuario Arturo en Supabase (si no existe)

```sql
-- En Supabase SQL Editor
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'arturo@test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

O mejor aún, usar el dashboard de Supabase:
1. Ve a **Authentication > Users**
2. Click en **Add User**
3. Email: `arturo@test.com`
4. Password: `password123`
5. Confirmar email automáticamente

### 2. Hacer Login como Arturo

1. Ve a `mulleryperez.cl/crm/login` (o tu ruta de login)
2. Email: `arturo@test.com`
3. Password: `password123`

### 3. Crear Primera Landing

1. Una vez logueado, ve a `mulleryperez.cl/crm/landings`
2. Click en **"Nueva Landing"**
3. Nombre: `Mi Primera Landing`
4. Se abrirá el editor de Destack
5. Arrastra componentes (botones, textos, imágenes, etc.)
6. Guarda (botón Save en Destack)
7. Vuelve a `/crm/landings`
8. Click en **"Publicar"**
9. Click en el ícono de link externo para ver la landing pública

### 4. Ver Landing Pública

La URL será algo como:
```
https://mulleryperez.cl/l/550e8400-e29b-41d4-a716-446655440000/mi-primera-landing
```

Donde:
- `550e8400...` = ID de usuario de Arturo
- `mi-primera-landing` = slug generado del nombre

## 📁 Estructura de Archivos Creados

```
landing-mp-myp-NUEVO/
├── app/
│   ├── api/
│   │   └── builder/
│   │       └── [...destack]/
│   │           └── route.ts          # API de Destack
│   ├── crm/
│   │   └── landings/
│   │       ├── page.tsx               # Lista de landings
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx       # Editor Destack
│   └── l/
│       └── [clientId]/
│           └── [slug]/
│               └── page.tsx           # Landing pública
├── utils/
│   └── supabase/
│       └── server.ts                  # Cliente Supabase server-side
└── supabase/
    └── migrations/
        └── create_landings_tables.sql # Schema DB
```

## 🎨 Componentes Disponibles en Destack

Destack incluye bloques de:
- **Tailblocks** - Componentes de Tailwind CSS
- **Meraki UI** - Componentes modernos
- **Hyper UI** - Componentes premium
- **Flowbite** - Componentes de UI
- **Preline** - Componentes empresariales

Los clientes pueden arrastrar:
- Headers
- Heroes
- Features
- Testimonials
- Pricing tables
- Forms
- CTAs (Call to Action)
- Footers
- Y mucho más

## 🔒 Seguridad Implementada

### Row Level Security (RLS)

✅ **Los clientes solo ven SUS landings**
- Política en `client_landings` que filtra por `client_id = auth.uid()`
- Los assets solo son accesibles si pertenecen a landings del cliente
- Los analytics solo son visibles para el dueño de la landing

✅ **Las landings públicas son accesibles solo si están publicadas**
- Campo `published = true` requerido para ver en `/l/[clientId]/[slug]`
- Si `published = false`, la landing devuelve 404

## 📊 Analytics Básicos

Cada vez que alguien visita una landing pública, se incrementa automáticamente el contador en `landing_analytics`:

```sql
-- Se ejecuta automáticamente en cada visita
SELECT increment_landing_view('landing-uuid-here');
```

El cliente puede ver sus métricas en un dashboard futuro.

## 🚧 Próximas Mejoras (Roadmap)

### Fase 2: Analytics Dashboard
- Gráficos de visitas por día
- Bounce rate
- Tiempo promedio en página
- Conversiones de formularios

### Fase 3: Dominios Custom
- Cliente puede usar su propio dominio
- `campana.empresa.com` → apunta a su landing
- Verificación DNS
- Certificados SSL automáticos (Let's Encrypt)

### Fase 4: Templates Pre-hechos
- Landing de producto
- Landing de webinar
- Landing de ebook
- Landing de evento
- Landing de descuento

### Fase 5: Integraciones
- Formularios → Zapier/Make
- Formularios → Email Marketing (Mailchimp, SendGrid)
- Formularios → CRM (Pipedrive, HubSpot)
- Analytics → Google Analytics

### Fase 6: A/B Testing
- Crear variantes de una landing
- Dividir tráfico 50/50
- Ver qué variante convierte mejor

## 💰 Monetización

**Planes sugeridos:**

| Plan | Landings | Storage | Visitas/mes | Precio |
|------|----------|---------|-------------|--------|
| **Básico** | 3 | 50MB | 5,000 | +$10k CLP/mes |
| **Pro** | 10 | 200MB | 25,000 | +$25k CLP/mes |
| **Enterprise** | ∞ | 1GB | ∞ | +$50k CLP/mes |

## 🐛 Troubleshooting

### Error: "destack_config is undefined"

Asegúrate de que la landing tenga contenido guardado. El primer guardado puede tomar un momento.

### Error: "Row Level Security policy violated"

Verifica que:
1. El usuario esté logueado
2. El `client_id` de la landing coincida con el `auth.uid()` del usuario

### La landing no se ve en `/l/[clientId]/[slug]`

Verifica que:
1. La landing esté marcada como `published = true`
2. El slug sea correcto (sin espacios, solo lowercase y guiones)

### Destack no carga en el editor

Verifica que:
1. El archivo de CSS de GrapesJS esté importado: `import 'grapesjs/dist/css/grapes.min.css'`
2. La API route `/api/builder/[...destack]` esté funcionando

## 📞 Contacto

Para dudas o problemas:
- Christopher Müller (@chris_mullercito)
- M&P - Marketing & Performance

---

**¡Listo para que Arturo cree su primera landing! 🎉**
