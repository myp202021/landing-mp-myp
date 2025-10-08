# 📝 Workflow para Crear 50 Blogs

## 🎯 Objetivo
Crear 50 blogs optimizados para SEO en Chile, con contenido de calidad y estrategia de keywords long-tail.

## 📊 Estado Actual
- **Publicados:** 7 blogs
- **Pendientes:** 43 blogs
- **Total:** 50 blogs

## 🚀 Cómo Generar Nuevos Blogs

### Opción 1: Generar 1 blog específico
```bash
npx tsx scripts/generate-blog-post.ts <slug>
```

Ejemplo:
```bash
npx tsx scripts/generate-blog-post.ts como-aumentar-conversiones-google-ads
```

### Opción 2: Generar múltiples blogs en batch
```bash
npx tsx scripts/generate-batch-blogs.ts 5
```

Esto creará los próximos 5 blogs pendientes automáticamente.

---

## 📋 Lista de Blogs (50 Total)

### ✅ Publicados (7)
1. costo-google-ads-chile-2025
2. kpis-marketing-digital-chile
3. optimizar-roas-meta-ads-2025
4. agencia-marketing-digital-santiago-2025
5. agencia-performance-marketing-las-condes
6. cuanto-cuesta-agencia-marketing-digital-chile-2025
7. mejor-agencia-google-ads-santiago-2025

### ⏳ Pendientes (43)
Ver `content/blog-topics.json` para la lista completa.

---

## ✍️ Proceso de Creación de Contenido

### 1. Generar Estructura
```bash
npx tsx scripts/generate-blog-post.ts <slug>
```

### 2. Completar Contenido
Edita `app/blog/<slug>/page.tsx` y completa:
- **Descripción introductoria**
- **Lista "Lo que aprenderás"**
- **Secciones principales** (mínimo 3)
- **Ejemplos reales** con datos de Chile
- **Conclusión** con CTA

### 3. Usar IA para Contenido Base
Prompt recomendado:
```
Escribe un artículo de blog sobre [TEMA] para una agencia de marketing digital en Chile.

Audiencia: CMOs, gerentes de marketing, emprendedores
Tono: Profesional pero cercano, data-driven
Largo: 1500-2000 palabras
Formato:
- Intro con gancho
- 3-5 secciones con H2
- Ejemplos concretos
- Datos/benchmarks Chile 2025
- CTA final

Keywords principales: [KEYWORDS DEL JSON]
```

### 4. Edición Humana
- ✅ Agrega tu experiencia personal
- ✅ Verifica datos y benchmarks
- ✅ Ajusta tono a la voz de M&P
- ✅ Agrega internal links a otros blogs
- ✅ Optimiza meta description

### 5. Prueba Local
```bash
npm run dev
```
Visita: `http://localhost:3000/blog/<slug>`

### 6. Deploy
```bash
git add .
git commit -m "feat: Agregar blog <título>"
git push
```

---

## 🎯 Estrategia de Keywords

### Long-Tail Keywords Chile
Todos los blogs están optimizados para keywords específicas de Chile:
- "como aumentar conversiones google ads **chile**"
- "mejor agencia meta ads **santiago**"
- "precio google ads **chile 2025**"

### Distribución por Categoría
- **Google Ads:** 10 blogs
- **Meta Ads:** 6 blogs
- **Performance Marketing:** 8 blogs
- **SEO:** 4 blogs
- **Analytics:** 3 blogs
- **Tendencias/IA:** 5 blogs
- **Otros:** 14 blogs

---

## 📈 SEO Checklist

Cada blog debe incluir:
- ✅ Título H1 optimizado (< 60 caracteres)
- ✅ Meta description (< 160 caracteres)
- ✅ Keywords primarias y secundarias
- ✅ URL amigable (slug)
- ✅ Internal links (mínimo 3)
- ✅ External links a fuentes (mínimo 2)
- ✅ Imágenes optimizadas (WebP, alt text)
- ✅ Schema Article/BlogPosting
- ✅ Canonical URL
- ✅ Fecha de publicación
- ✅ Categoría
- ✅ CTA final

---

## 🤖 Automatización con IndexNow

Cada vez que publiques un nuevo blog, envíalo a IndexNow:
```bash
curl -X POST https://www.mulleryperez.cl/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://www.mulleryperez.cl/blog/<slug>"]}'
```

O usa el script:
```bash
npx tsx scripts/submit-sitemap-to-indexnow.ts
```

---

## 📊 Tracking

Después de publicar:
1. Verifica en Google Search Console (indexación)
2. Monitorea GA4 (tráfico)
3. Revisa ranking de keywords (después de 2-4 semanas)
4. Actualiza content/blog-topics.json (status: "published")

---

## 💡 Tips para Escalar a 50 Blogs

### Semana 1-2: Crear estructura (10 blogs/semana)
- Usa `generate-batch-blogs.ts` para crear estructura
- Genera contenido base con IA
- Edición humana básica

### Semana 3-4: Contenido y optimización (10 blogs/semana)
- Completa contenido de calidad
- Agrega ejemplos reales
- Internal linking entre blogs

### Semana 5: Publicación y promoción
- Deploy de todos los blogs
- Envío a IndexNow
- Compartir en redes sociales
- Email newsletter

---

## 🎨 Personalización

Para cambiar el template por defecto:
1. Edita `scripts/generate-blog-post.ts`
2. Modifica la función `generateBlogTemplate()`
3. Regenera blogs si es necesario

---

## 🔗 Internal Linking Strategy

Enlaza blogs relacionados:
- Google Ads ↔ Performance Marketing
- Meta Ads ↔ Social Commerce
- SEO ↔ Content Marketing
- Analytics ↔ Conversion Optimization

Agrega links en:
- Intro (contexto)
- Secciones relevantes (profundización)
- Conclusión (próximos pasos)

---

## 📞 ¿Necesitas Ayuda?

Si tienes dudas sobre el workflow:
1. Revisa `scripts/generate-blog-post.ts`
2. Consulta `content/blog-topics.json`
3. Mira ejemplos en `app/blog/`

¡A escribir! 🚀
