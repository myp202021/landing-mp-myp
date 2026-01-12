# Proyecto www.mulleryperez.cl - Documentación Completa

**Última actualización:** Enero 2026
**Propietario:** Christopher Muller
**Dominio:** www.mulleryperez.cl
**Hosting:** Vercel
**Framework:** Next.js 14 (App Router)

---

## Resumen del Proyecto

Landing page de alta conversión para Muller y Pérez, agencia de performance marketing en Chile. Optimizada para SEO, GEO (Generative Engine Optimization) y conversión B2B.

---

## Stack Tecnológico

- **Framework:** Next.js 14 con App Router
- **Estilos:** Tailwind CSS
- **Hosting:** Vercel
- **Analytics:** Google Analytics (G-QV8Y7X4ZC2), GTM (GTM-58VSTLZ)
- **Pixel:** Meta Pixel (555544348819002)
- **Dominio:** Cloudflare (DNS + CDN)

---

## Estructura de Carpetas Principales

```
/app
  /blog                    # 52 artículos de blog
  /servicios               # Páginas de servicios (Google Ads, Meta Ads, SEO, etc.)
  /marketing-digital-*     # Páginas por industria (ecommerce, b2b, saas, salud, etc.)
  /comparativa             # Páginas VS competidores
  /nosotros                # Página "Quiénes Somos"
  /recursos                # Hub central de recursos
  /utilidades              # Calculadoras (ROI, CAC, LTV)
  /labs                    # Herramientas avanzadas (Predictor, Buyer Gen)
  /gracias                 # Thank you page post-formulario
  /cotizador               # Cotizador interactivo
  LandingClient.tsx        # Componente principal del home

/components
  ThirdPartyScripts.tsx    # Pixel de Meta, GTM, GA
  RelatedPosts.tsx         # Componente de posts relacionados
  ClientLogos.tsx          # Logos de clientes (comentado, faltan imágenes)

/lib
  metadata.ts              # Funciones de metadata y schema (Article, FAQ, WebPage)
  meta-pixel.ts            # Tracking de Meta Pixel optimizado para B2B
  ai-search-optimization.ts # Optimización para AI search engines

/scripts
  add-article-schema.js    # Script para agregar Article Schema a blog posts
```

---

## Trabajo Realizado (Sesión Actual)

### 1. Cloudflare - AI Bots Permitidos
- Configurado en AI Crawl Control para permitir GPTBot, ClaudeBot, PerplexityBot, etc.
- Deshabilitado el override de robots.txt de Cloudflare
- Cache purgado

### 2. Article Schema en Blog
- Implementado en 40+ blog posts
- Función `createArticleSchema()` en `/lib/metadata.ts`
- Script de batch update en `/scripts/add-article-schema.js`

### 3. Páginas Nuevas Creadas
- `/nosotros` - Página "Quiénes Somos" con AboutPage schema
- `/comparativa/muller-perez-vs-agencias-chile` - Comparativa honesta M&P vs otras agencias

### 4. FAQ Optimizado para IA
- Agregado a `/servicios` con FAQPage schema
- Agregado a `/nosotros` con FAQPage schema
- Preguntas concisas y citables para AI search engines

### 5. Internal Linking Mejorado
- Páginas de industria ahora tienen:
  - Sección "Servicios Relacionados" (3 cards con links)
  - Sección "Blog Posts Relacionados" (3 cards con links)
- Páginas actualizadas:
  - `/marketing-digital-ecommerce-chile`
  - `/marketing-digital-b2b-chile`
  - `/marketing-digital-saas-chile`
  - `/marketing-digital-salud-chile`
  - `/marketing-digital-inmobiliario-chile`
  - `/marketing-digital-educacion-chile`
  - `/marketing-digital-pymes-chile`

### 6. Página /recursos Mejorada
- Ahora es hub central con 10 secciones:
  - Rankings de Agencias
  - Guías de Precios
  - Comparativas
  - Estadísticas
  - Rankings Especializados
  - Herramientas y Calculadoras
  - Marketing por Industria
  - Sobre Muller y Pérez
  - Blog Destacado

### 7. Página de Precios Mejorada
- Agregada sección de herramientas (Calculadora ROI, CAC, Predictor)
- Agregados artículos relacionados sobre presupuesto

### 8. Footer Actualizado
- Agregado link a "Quiénes Somos" (`/nosotros`)
- Agregado link a "M&P vs Agencias" (`/comparativa/muller-perez-vs-agencias-chile`)

### 9. Thank You Page
- Creada `/gracias` para redirección post-formulario
- Formulario en LandingClient.tsx ahora hace `router.push('/gracias')`

### 10. Meta Pixel Optimizado para B2B High-Ticket
- Nuevo archivo `/lib/meta-pixel.ts` con:
  - `trackLead()` - Trackea leads con valor estimado ($1M-2.4M CLP)
  - `trackWhatsAppClick()` - Trackea clicks en WhatsApp
  - Multiplicadores por cargo (CEO x2, Gerente x1.5, etc.)
  - Multiplicadores por industria (Fintech x2, SaaS x1.8, etc.)
- Implementado en:
  - Formulario de contacto (trackLead al enviar)
  - Botones de WhatsApp (trackWhatsAppClick)

---

## Configuración Importante

### Vercel
- Proyecto: `landing-mp-myp`
- Dominio: www.mulleryperez.cl
- Variables de entorno: Ver Vercel Dashboard

### Cloudflare
- DNS apuntando a Vercel
- SSL: Full (strict)
- AI Crawl Control: Todos los bots permitidos
- robots.txt: Manejado por Next.js (no Cloudflare)

### Meta Pixel
- ID: 555544348819002
- Eventos configurados:
  - PageView (automático)
  - Lead (formulario)
  - Contact (WhatsApp)
  - CompleteRegistration (formulario)

### Google Analytics
- GA4: G-QV8Y7X4ZC2
- GTM: GTM-58VSTLZ

---

## Tareas Pendientes / Ideas Futuras

### Inmediato
- [ ] Agregar logos reales de clientes (necesita archivos de imagen)
- [ ] Casos de éxito con números reales
- [ ] Testimonios con nombre y empresa

### SEO/GEO
- [ ] Crear más páginas VS competidores específicos (M&P vs Cebra, etc.)
- [ ] Agregar tracking a `/cotizador` y páginas de servicios
- [ ] Implementar CAPI (Conversion API) para tracking server-side

### Mejoras
- [ ] Cross-linking en los 10 blog posts más importantes
- [ ] Página de casos de éxito con Case Study schema
- [ ] Optimizar imágenes con mejor alt text

### Externos (Requiere acción manual)
- [ ] Registrarse en Clutch, Sortlist, etc.
- [ ] Optimizar Google Business Profile
- [ ] Crear perfil en directorios de agencias

---

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build
npm run build

# Deploy a producción
vercel --prod

# Deploy a preview
vercel
```

---

## Contacto del Proyecto

- **Email:** christopher@mulleryperez.cl (nuevo)
- **Email anterior:** christopher@mulleryperez.com
- **WhatsApp:** +56 9 9225 8137
- **Sitio:** www.mulleryperez.cl

---

## Archivos Clave para Editar

| Archivo | Propósito |
|---------|-----------|
| `/app/LandingClient.tsx` | Home page principal |
| `/app/layout.tsx` | Layout global, metadata |
| `/components/ThirdPartyScripts.tsx` | Pixel, GTM, GA |
| `/lib/meta-pixel.ts` | Funciones de tracking Meta |
| `/lib/metadata.ts` | Schemas SEO (Article, FAQ, etc.) |
| `/app/robots.ts` | Configuración robots.txt |
| `/app/sitemap.ts` | Sitemap dinámico |

---

*Documento generado para continuidad del proyecto entre sesiones de Claude.*
