# 🚀 Muller y Pérez - Web Oficial

Landing page + herramientas interactivas para Muller y Pérez, agencia de marketing digital y performance en Chile.

## 📦 Estructura del Proyecto

```
landing-mp-myp/
├── app/
│   ├── page.tsx                   # Landing principal
│   ├── layout.tsx                 # Layout global con schemas
│   ├── not-found.tsx             # Página 404 personalizada
│   ├── labs/                     # M&P Labs (3 herramientas)
│   │   ├── page.tsx              # Hub de Labs
│   │   ├── predictor/            # Predictor Google Ads
│   │   ├── buyer-gen/            # Generador Buyer Personas
│   │   └── radar-industrias/     # Radar Madurez Digital
│   └── utilidades/               # Utilidades (4 herramientas)
│       ├── page.tsx              # Hub de Utilidades
│       ├── calculadora-cac/      # Calculadora CAC
│       ├── comparador-web/       # Comparador PageSpeed
│       ├── generador-funnels/    # Generador Funnels CRM
│       └── juega-aprende/        # Simulador Marketing
├── lib/
│   └── metadata.ts               # Helpers SEO y schemas
├── public/
│   ├── og-image.svg             # OG image principal
│   ├── og-predictor.svg         # OG images específicas (7 total)
│   ├── logo-color.png
│   └── logo-blanco.png
└── OG-IMAGES-TODO.md           # Instrucciones OG images
```

## 🎯 Características

### ✅ SEO Nivel Mundial

- **Canonical URLs**: En todas las páginas
- **BreadcrumbList Schema**: 7 herramientas
- **JSON-LD Schemas**: 13 total (4 landing + 9 herramientas)
- **Open Graph**: Tags completos con imágenes específicas
- **Twitter Cards**: Summary large image
- **Sitemap.xml**: Generado dinámicamente
- **Robots.txt**: Optimizado
- **28 Keywords**: Expandidos
- **Security Headers**: Completos

### 🛠️ Herramientas (7 total)

**M&P Labs (3):**
1. Predictor Google Ads
2. Buyer Gen
3. Radar Industrias

**Utilidades (4):**
1. Calculadora CAC
2. Comparador Web
3. Generador Funnels
4. Juega y Aprende

### ⚡ Performance

- Preconnect a Google Fonts
- DNS Prefetch analytics
- Next.js 14 optimizado
- Compression habilitado

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build producción
npm run build

# Start producción
npm start

# Lint
npm run lint
```

## 📊 SEO Checklist

### ✅ Completado

- [x] Canonical URLs (8 páginas)
- [x] BreadcrumbList schemas (7 herramientas)
- [x] Open Graph + Twitter Cards
- [x] JSON-LD schemas (13 total)
- [x] Sitemap.xml dinámico
- [x] 28 keywords optimizados
- [x] ARIA accessibility
- [x] 404 personalizada
- [x] OG Images (8 SVG)

### ⚠️ Pendiente

- [ ] Convertir OG images SVG → JPG (ver `OG-IMAGES-TODO.md`)
- [ ] Google Search Console verification
- [ ] Deploy a Vercel

## 🌐 Deploy a Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## 📝 Variables de entorno

Opcional, crear `.env.local`:

```
RESEND_API_KEY=tu_api_key_aqui  # Para formularios email
```

## 📞 Contacto

- **Web**: https://agencia.mulleryperez.cl
- **WhatsApp**: +56 9 9225 8137
- **Email**: contacto@mulleryperez.cl

---

**Stack**: Next.js 14, TypeScript, Tailwind CSS
**Repositorio**: https://github.com/myp202021/landing-mp-myp
**Deploy**: Vercel
