/**
 * MUTANTE - Asistente IA de Marketing Digital
 * Version PRO con contenido de alto valor
 */

export interface ChatNode {
  id: string
  type: 'menu' | 'response' | 'capture_lead' | 'external_link'
  text: string
  options?: ChatOption[]
  response?: string
  nextNode?: string
  captureFields?: string[]
  category?: string
  subcategory?: string
  externalUrl?: string
}

export interface ChatOption {
  id: string
  label: string
  emoji?: string
  nextNodeId: string
}

export const chatTree: Record<string, ChatNode> = {
  // ========================================
  // MENU PRINCIPAL
  // ========================================
  'root': {
    id: 'root',
    type: 'menu',
    text: `Hola! Soy **Mutante**, tu asistente de marketing digital con IA.

Tengo acceso a data de +200 campanas activas en Chile, benchmarks actualizados 2025 y estrategias probadas.

¿En que te ayudo?`,
    options: [
      { id: 'aprender', label: 'Aprender marketing digital', emoji: '🎓', nextNodeId: 'aprender_menu' },
      { id: 'diagnostico', label: 'Diagnosticar mi negocio', emoji: '🔍', nextNodeId: 'diagnostico_menu' },
      { id: 'herramientas', label: 'Herramientas gratuitas', emoji: '🛠️', nextNodeId: 'herramientas_menu' },
      { id: 'servicios', label: 'Servicios M&P', emoji: '🚀', nextNodeId: 'servicios_menu' },
      { id: 'contacto', label: 'Hablar con especialista', emoji: '👤', nextNodeId: 'contacto_lead' }
    ],
    category: 'inicio'
  },

  // ========================================
  // RAMA: APRENDER MARKETING DIGITAL
  // ========================================
  'aprender_menu': {
    id: 'aprender_menu',
    type: 'menu',
    text: `**Academia Mutante** - Aprende marketing digital gratis

¿Que tema quieres dominar?`,
    options: [
      { id: 'google', label: 'Google Ads Masterclass', emoji: '🔍', nextNodeId: 'google_menu' },
      { id: 'meta', label: 'Meta Ads Masterclass', emoji: '📱', nextNodeId: 'meta_menu' },
      { id: 'contenido', label: 'Estrategia de Contenido', emoji: '📝', nextNodeId: 'contenido_menu' },
      { id: 'metricas', label: 'Metricas y Analytics', emoji: '📊', nextNodeId: 'metricas_menu' },
      { id: 'conversion', label: 'Optimizacion de Conversion', emoji: '🎯', nextNodeId: 'conversion_menu' },
      { id: 'tendencias', label: 'Tendencias 2025', emoji: '🔮', nextNodeId: 'tendencias_2025' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'aprender'
  },

  // --- GOOGLE ADS MASTERCLASS ---
  'google_menu': {
    id: 'google_menu',
    type: 'menu',
    text: `**Google Ads Masterclass**

Desde cero hasta avanzado. ¿Por donde quieres empezar?`,
    options: [
      { id: 'google_basico', label: 'Fundamentos (principiante)', emoji: '🟢', nextNodeId: 'google_basico' },
      { id: 'google_intermedio', label: 'Optimizacion (intermedio)', emoji: '🟡', nextNodeId: 'google_intermedio' },
      { id: 'google_avanzado', label: 'Escala (avanzado)', emoji: '🔴', nextNodeId: 'google_avanzado' },
      { id: 'google_errores', label: 'Errores fatales a evitar', emoji: '⚠️', nextNodeId: 'google_errores' },
      { id: 'google_checklist', label: 'Checklist de auditoria', emoji: '✅', nextNodeId: 'google_checklist' },
      { id: 'volver', label: '← Temas de aprendizaje', nextNodeId: 'aprender_menu' }
    ],
    category: 'google_ads'
  },

  'google_basico': {
    id: 'google_basico',
    type: 'menu',
    text: `**Google Ads - Fundamentos**

**1. Tipos de campana y cuando usarlas:**

🔍 **Search (Busqueda)**
- Para: Captar demanda existente
- Ideal: Servicios, B2B, tickets altos
- CPL Chile: $8.000-$45.000

🛒 **Shopping**
- Para: E-commerce
- Ideal: Productos con buen margen
- ROAS esperado: 3x-8x

📺 **Display**
- Para: Remarketing y awareness
- Ideal: Complemento de Search
- CPC: $50-$200

🎬 **YouTube**
- Para: Branding y educacion
- Ideal: Productos que necesitan explicacion
- CPV: $15-$50

🤖 **Performance Max**
- Para: Automatizacion total
- Ideal: E-commerce con catalogo
- Requiere: +50 conversiones/mes

**2. Estructura ideal de cuenta:**
\`\`\`
Cuenta
└── Campana (1 objetivo)
    └── Grupo de anuncios (1 tema)
        └── Keywords (10-20 max)
        └── Anuncios (3-5 variantes)
\`\`\`

**3. Presupuesto minimo recomendado:**
- Search B2B: $400.000/mes
- Search B2C: $300.000/mes
- Shopping: $500.000/mes
- Display: $200.000/mes`,
    options: [
      { id: 'google_keywords', label: 'Como elegir keywords', emoji: '🔑', nextNodeId: 'google_keywords' },
      { id: 'google_anuncios', label: 'Como escribir anuncios', emoji: '✍️', nextNodeId: 'google_anuncios' },
      { id: 'google_intermedio', label: 'Pasar a intermedio', emoji: '⏭️', nextNodeId: 'google_intermedio' },
      { id: 'cotizar', label: 'Quiero que M&P lo haga', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Google Ads', nextNodeId: 'google_menu' }
    ],
    category: 'google_ads',
    subcategory: 'basico'
  },

  'google_keywords': {
    id: 'google_keywords',
    type: 'menu',
    text: `**Como elegir keywords que convierten**

**Tipos de concordancia:**

📌 **[Exacta]** - Solo esa busqueda
Ejemplo: [abogado laboral santiago]
Pros: Control total, alta relevancia
Contras: Menos volumen

📌 **"Frase"** - Incluye la frase
Ejemplo: "abogado laboral"
Pros: Balance volumen/control
Contras: Puede traer variantes

📌 **Amplia** - Relacionadas
Ejemplo: abogado laboral
Pros: Maximo volumen
Contras: Requiere muchas negativas

**Framework de keywords:**

**1. Keywords de alta intencion (prioridad):**
- "contratar [servicio]"
- "[servicio] precio"
- "[servicio] cotizacion"
- "mejor [servicio] en [ciudad]"

**2. Keywords de investigacion:**
- "como elegir [servicio]"
- "que es [servicio]"
- "[servicio] vs [alternativa]"

**3. Keywords negativas OBLIGATORIAS:**
- gratis, gratuito, free
- curso, tutorial, como hacer
- empleo, trabajo, vacante
- pdf, plantilla, ejemplo
- que es, definicion

**Pro tip Chile:**
Agrega variantes con y sin tilde:
- "credito" y "crédito"
- "informacion" e "información"`,
    options: [
      { id: 'google_anuncios', label: 'Como escribir anuncios', emoji: '✍️', nextNodeId: 'google_anuncios' },
      { id: 'cotizar', label: 'Auditoria de keywords', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Google basico', nextNodeId: 'google_basico' }
    ],
    category: 'google_ads',
    subcategory: 'keywords'
  },

  'google_anuncios': {
    id: 'google_anuncios',
    type: 'menu',
    text: `**Como escribir anuncios que convierten**

**Estructura RSA (Responsive Search Ads):**
- 15 titulos (30 caracteres c/u)
- 4 descripciones (90 caracteres c/u)
- Google combina automaticamente

**Formula de titulo efectivo:**

**Titulo 1:** Keyword + Beneficio
"Abogado Laboral - Gana Tu Caso"

**Titulo 2:** Diferenciador
"20 Anos de Experiencia | 95% Exito"

**Titulo 3:** CTA + Urgencia
"Consulta Gratis Hoy - Cupos Limitados"

**Descripciones que venden:**

✅ **Incluir:**
- Numero especifico (20 anos, 500 clientes)
- Beneficio principal
- Prueba social
- CTA claro

❌ **Evitar:**
- Texto generico
- Solo caracteristicas
- Sin diferenciacion

**Ejemplo B2B:**
Titulo: Software de Gestion | Prueba Gratis 14 Dias
Descripcion: +500 empresas chilenas ya automatizan sus procesos. Reduce 40% el tiempo administrativo. Implementacion en 48hrs.

**Ejemplo B2C:**
Titulo: Clinica Dental Las Condes | Primera Consulta $0
Descripcion: Especialistas con +10 anos. Presupuesto sin compromiso. Facilidades de pago hasta 12 cuotas. Agenda online 24/7.`,
    options: [
      { id: 'google_intermedio', label: 'Nivel intermedio', emoji: '⏭️', nextNodeId: 'google_intermedio' },
      { id: 'cotizar', label: 'Revisar mis anuncios', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Google basico', nextNodeId: 'google_basico' }
    ],
    category: 'google_ads',
    subcategory: 'anuncios'
  },

  'google_intermedio': {
    id: 'google_intermedio',
    type: 'menu',
    text: `**Google Ads - Nivel Intermedio**

**1. Optimizacion de Quality Score:**

El QS (1-10) afecta cuanto pagas:
- QS 10: Pagas 50% menos
- QS 5: Pagas precio base
- QS 1: Pagas 400% mas

**Como mejorar QS:**
✅ CTR > 5% (esperado para tu industria)
✅ Relevancia anuncio-keyword
✅ Experiencia landing page
✅ Velocidad de carga < 3 seg

**2. Estrategias de puja:**

📊 **Maximizar conversiones**
- Para: Cuentas nuevas
- Cuando: < 30 conversiones/mes
- Riesgo: Puede gastar rapido

📊 **CPA objetivo**
- Para: Cuentas con historial
- Cuando: > 30 conversiones/mes
- Requiere: CPA realista (+20% del actual)

📊 **ROAS objetivo**
- Para: E-commerce
- Cuando: > 50 conversiones/mes
- Requiere: Tracking de valor

**3. Segmentacion avanzada:**

🎯 **Audiencias:**
- Remarketing (RLSA): +50% bid
- Similar audiences: +20% bid
- In-market: +30% bid
- Custom intent: Crear con keywords

🎯 **Dispositivos:**
- Analiza conversion por device
- Ajusta bid: mobile vs desktop
- Chile: 65% mobile en B2C

🎯 **Horarios:**
- Revisa informe de horarios
- Aumenta bid en horas pico
- Reduce/pausa en horarios muertos`,
    options: [
      { id: 'google_avanzado', label: 'Nivel avanzado', emoji: '🔴', nextNodeId: 'google_avanzado' },
      { id: 'google_scripts', label: 'Scripts utiles', emoji: '💻', nextNodeId: 'google_scripts' },
      { id: 'cotizar', label: 'Optimizar mi cuenta', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Google Ads', nextNodeId: 'google_menu' }
    ],
    category: 'google_ads',
    subcategory: 'intermedio'
  },

  'google_scripts': {
    id: 'google_scripts',
    type: 'menu',
    text: `**Scripts de Google Ads utiles**

**1. Alerta de anomalias:**
Notifica si el gasto o CTR cambia drasticamente.

**2. Pausar keywords sin conversion:**
Pausa automaticamente keywords con > $X gasto y 0 conversiones.

**3. Ajuste de bid por hora:**
Sube/baja bids automaticamente segun hora del dia.

**4. Reporte de Search Terms:**
Email diario con terminos de busqueda nuevos.

**5. Negative keyword finder:**
Identifica keywords negativas potenciales.

**Donde encontrarlos:**
- Google Ads Scripts Gallery (oficial)
- Brainlabs Scripts (gratis)
- Optmyzr (freemium)

**Pro tip:**
No uses scripts sin entender que hacen. Prueba siempre en modo preview primero.

*En M&P implementamos scripts personalizados para optimizacion automatica.*`,
    options: [
      { id: 'google_avanzado', label: 'Nivel avanzado', emoji: '🔴', nextNodeId: 'google_avanzado' },
      { id: 'cotizar', label: 'Implementar scripts', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Google intermedio', nextNodeId: 'google_intermedio' }
    ],
    category: 'google_ads',
    subcategory: 'scripts'
  },

  'google_avanzado': {
    id: 'google_avanzado',
    type: 'menu',
    text: `**Google Ads - Nivel Avanzado**

**1. Atribucion y conversion:**

📈 **Modelos de atribucion:**
- Last click: Default (obsoleto)
- Data-driven: Recomendado (+30 conv/mes)
- Linear: Para ciclos largos
- Position-based: Para awareness + conversion

📈 **Conversion value:**
No todas las conversiones valen igual:
- Lead calificado: $50.000
- Lead frio: $10.000
- Venta: Valor real

📈 **Offline conversion import:**
Sube ventas reales desde tu CRM.
Google optimiza hacia lo que realmente importa.

**2. Escalar sin perder rentabilidad:**

🚀 **Expansion horizontal:**
- Nuevas keywords long-tail
- Nuevos mercados geograficos
- Nuevas audiencias

🚀 **Expansion vertical:**
- Aumentar budget gradual (+20%/semana)
- Agregar campanas Display/YouTube
- Performance Max con datos

**3. Performance Max avanzado:**

✅ **Cuando funciona:**
- +100 conversiones/mes en Search
- Catalogo de productos grande
- Assets de calidad (video, imagen)

❌ **Cuando evitar:**
- Cuenta nueva sin datos
- Ticket muy alto (>$5M)
- Necesitas control total

**4. Seasonality adjustments:**
Avisa a Google de cambios esperados:
- Cyber Monday: +200% conversiones
- Vacaciones: -50% conversiones

**5. Experimentos:**
Siempre testea antes de cambiar:
- A/B de landing pages
- Test de estrategias de puja
- Test de nuevas audiencias`,
    options: [
      { id: 'google_pmax', label: 'Deep dive Performance Max', emoji: '🤖', nextNodeId: 'google_pmax' },
      { id: 'google_errores', label: 'Errores a evitar', emoji: '⚠️', nextNodeId: 'google_errores' },
      { id: 'cotizar', label: 'Escalar mi cuenta', emoji: '📈', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Google Ads', nextNodeId: 'google_menu' }
    ],
    category: 'google_ads',
    subcategory: 'avanzado'
  },

  'google_pmax': {
    id: 'google_pmax',
    type: 'menu',
    text: `**Performance Max - Guia Completa**

**Que es:**
Campana automatizada que usa todos los canales de Google (Search, Display, YouTube, Gmail, Maps, Discovery).

**Como funciona:**
1. Le das assets (textos, imagenes, videos)
2. Le das una meta (conversiones, ROAS)
3. Google encuentra a tu cliente donde sea

**Assets necesarios:**
- 5+ imagenes (1200x1200, 1200x628)
- 5+ logos
- 5+ titulos cortos (30 chars)
- 5+ titulos largos (90 chars)
- 5+ descripciones
- 1+ video (idealmente)

**Estructura recomendada:**

**Asset Groups por intencion:**
- AG1: Alta intencion (keywords de compra)
- AG2: Media intencion (keywords de investigacion)
- AG3: Remarketing (audiencias existentes)

**Senales de audiencia (obligatorias):**
- Custom segments con keywords
- Audiencias de remarketing
- Customer Match (emails)

**Optimizacion:**
1. Revisa "Insights" semanalmente
2. Excluye ubicaciones malas
3. Excluye brand en Search aparte
4. Agrega assets nuevos cada mes

**Benchmarks Chile PMAX:**
- E-commerce: ROAS 4x-8x
- Lead gen: CPA 20-40% menor vs Search solo`,
    options: [
      { id: 'cotizar', label: 'Implementar PMAX', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Google avanzado', nextNodeId: 'google_avanzado' }
    ],
    category: 'google_ads',
    subcategory: 'pmax'
  },

  'google_errores': {
    id: 'google_errores',
    type: 'menu',
    text: `**10 Errores Fatales en Google Ads**

❌ **1. No usar conversion tracking**
Sin datos, Google no puede optimizar.
Solucion: Implementar Google Tag Manager + conversiones.

❌ **2. Demasiadas keywords por ad group**
> 20 keywords = relevancia baja.
Solucion: 10-15 keywords muy relacionadas.

❌ **3. Ignorar Search Terms**
Estas pagando por busquedas basura.
Solucion: Revisar weekly, agregar negativas.

❌ **4. Landing page = Home**
Conversion rate cae 50%+.
Solucion: Landing especifica por campana.

❌ **5. No segmentar dispositivos**
Mobile y desktop convierten diferente.
Solucion: Analizar y ajustar bids.

❌ **6. Budget limitado en campanas ganadoras**
"Limited by budget" = perdiendo ventas.
Solucion: Redistribuir de campanas malas.

❌ **7. Cambiar todo de golpe**
Rompe el aprendizaje del algoritmo.
Solucion: Cambios graduales, uno a la vez.

❌ **8. No usar extensiones**
CTR 15% menor sin extensiones.
Solucion: Todas las extensiones relevantes.

❌ **9. Pujar por brand de competencia**
CPC alto, QS bajo, conversion baja.
Solucion: Solo si tienes diferenciador claro.

❌ **10. Medir solo leads, no ventas**
Optimizas para leads basura.
Solucion: Importar conversiones offline.`,
    options: [
      { id: 'google_checklist', label: 'Checklist de auditoria', emoji: '✅', nextNodeId: 'google_checklist' },
      { id: 'cotizar', label: 'Auditar mi cuenta', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Google Ads', nextNodeId: 'google_menu' }
    ],
    category: 'google_ads',
    subcategory: 'errores'
  },

  'google_checklist': {
    id: 'google_checklist',
    type: 'menu',
    text: `**Checklist de Auditoria Google Ads**

**TRACKING (Prioridad 1):**
☐ Google Tag instalado correctamente
☐ Conversiones configuradas
☐ Valor de conversion asignado
☐ Google Analytics vinculado
☐ Atribucion data-driven activa

**ESTRUCTURA:**
☐ 1 objetivo por campana
☐ < 20 keywords por ad group
☐ Keywords bien organizadas por tema
☐ Naming convention consistente

**KEYWORDS:**
☐ Mix de concordancias
☐ Lista de negativas actualizada
☐ Search terms revisados (ultimos 30 dias)
☐ Sin keywords duplicadas

**ANUNCIOS:**
☐ 3+ anuncios RSA por ad group
☐ 15 titulos, 4 descripciones
☐ Keywords en titulos
☐ CTAs claros
☐ Sin errores de ortografia

**EXTENSIONES:**
☐ Sitelinks (4+)
☐ Callouts (4+)
☐ Structured snippets
☐ Call extension (si aplica)
☐ Location (si aplica)

**BIDDING:**
☐ Estrategia correcta segun volumen
☐ CPA/ROAS objetivo realista
☐ Ajustes por dispositivo
☐ Ajustes por ubicacion
☐ Ajustes por horario

**LANDING PAGES:**
☐ Relevante a keywords
☐ Carga < 3 segundos
☐ Mobile optimizada
☐ CTA visible
☐ Sin distracciones

*Score: 20+ checks = Cuenta saludable*`,
    options: [
      { id: 'cotizar', label: 'Auditoria profesional', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Google Ads', nextNodeId: 'google_menu' }
    ],
    category: 'google_ads',
    subcategory: 'checklist'
  },

  // --- META ADS MASTERCLASS ---
  'meta_menu': {
    id: 'meta_menu',
    type: 'menu',
    text: `**Meta Ads Masterclass**

Facebook + Instagram + WhatsApp + Messenger

¿Que nivel?`,
    options: [
      { id: 'meta_basico', label: 'Fundamentos (principiante)', emoji: '🟢', nextNodeId: 'meta_basico' },
      { id: 'meta_intermedio', label: 'Optimizacion (intermedio)', emoji: '🟡', nextNodeId: 'meta_intermedio' },
      { id: 'meta_avanzado', label: 'Escala (avanzado)', emoji: '🔴', nextNodeId: 'meta_avanzado' },
      { id: 'meta_creativos', label: 'Creativos que venden', emoji: '🎨', nextNodeId: 'meta_creativos' },
      { id: 'meta_errores', label: 'Errores a evitar', emoji: '⚠️', nextNodeId: 'meta_errores' },
      { id: 'volver', label: '← Temas de aprendizaje', nextNodeId: 'aprender_menu' }
    ],
    category: 'meta_ads'
  },

  'meta_basico': {
    id: 'meta_basico',
    type: 'menu',
    text: `**Meta Ads - Fundamentos**

**Objetivos de campana (elige UNO):**

🎯 **Ventas** (Conversiones)
- Para: E-commerce, generacion de leads
- Necesita: Pixel instalado + eventos
- CPA Chile: $5.000-$30.000

📢 **Trafico**
- Para: Llevar gente a tu web
- Util: Construir audiencias de remarketing
- CPC Chile: $100-$500

👁️ **Reconocimiento**
- Para: Branding, lanzamientos
- Metrica: CPM (costo por 1000 impresiones)
- CPM Chile: $2.000-$8.000

💬 **Mensajes**
- Para: Generar conversaciones WhatsApp
- Muy efectivo en Chile
- Costo por mensaje: $500-$2.000

**Estructura recomendada:**
\`\`\`
Campana (1 objetivo, CBO activo)
└── Ad Set 1 (Audiencia A)
    └── 3-5 anuncios
└── Ad Set 2 (Audiencia B)
    └── 3-5 anuncios
└── Ad Set 3 (Remarketing)
    └── 3-5 anuncios
\`\`\`

**Presupuesto minimo:**
- Testing: $300.000/mes
- Escala: $500.000+/mes
- Por ad set: min $15.000/dia

**Pixel events importantes:**
- PageView (basico)
- ViewContent (vio producto)
- AddToCart (agrego al carro)
- InitiateCheckout
- Purchase (compra)
- Lead (formulario)`,
    options: [
      { id: 'meta_audiencias', label: 'Como crear audiencias', emoji: '👥', nextNodeId: 'meta_audiencias' },
      { id: 'meta_creativos', label: 'Creativos que venden', emoji: '🎨', nextNodeId: 'meta_creativos' },
      { id: 'meta_intermedio', label: 'Nivel intermedio', emoji: '⏭️', nextNodeId: 'meta_intermedio' },
      { id: 'cotizar', label: 'Quiero que M&P lo haga', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Meta Ads', nextNodeId: 'meta_menu' }
    ],
    category: 'meta_ads',
    subcategory: 'basico'
  },

  'meta_audiencias': {
    id: 'meta_audiencias',
    type: 'menu',
    text: `**Audiencias en Meta Ads**

**1. Core Audiences (Intereses):**
Segmentacion por datos demograficos e intereses.

⚠️ **En 2025 menos es mas:**
- No sobresegmentes
- Deja que el algoritmo encuentre
- Audiencias de 500K-2M personas

**2. Custom Audiences (Personalizadas):**
Gente que ya te conoce.

📌 **Website visitors** (las mas valiosas)
- Visitantes ultimos 7 dias
- Visitantes ultimos 30 dias
- Visitantes 60-180 dias

📌 **Engagement**
- Interactuaron con tu IG/FB
- Vieron videos (25%, 50%, 75%)
- Abrieron lead forms

📌 **Customer list**
- Emails de clientes
- Telefonos
- Match rate: 40-60%

**3. Lookalike Audiences:**
Gente similar a tus mejores clientes.

🎯 **Mejores fuentes (en orden):**
1. Compradores (Purchase)
2. Leads calificados
3. Visitantes frecuentes
4. Engagement alto

🎯 **Porcentajes:**
- 1%: Mas similar, menor volumen
- 2-3%: Balance
- 5%+: Mayor volumen, menor similitud

**Framework de audiencias:**

**Frio (Awareness):**
- Lookalike 1-3% de compradores
- Intereses amplios

**Tibio (Consideration):**
- Visitantes web 30-60 dias
- Engagement IG/FB

**Caliente (Conversion):**
- Visitantes 7 dias
- AddToCart sin compra
- Compradores anteriores (upsell)`,
    options: [
      { id: 'meta_creativos', label: 'Creativos que venden', emoji: '🎨', nextNodeId: 'meta_creativos' },
      { id: 'meta_intermedio', label: 'Nivel intermedio', emoji: '⏭️', nextNodeId: 'meta_intermedio' },
      { id: 'cotizar', label: 'Crear mis audiencias', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Meta basico', nextNodeId: 'meta_basico' }
    ],
    category: 'meta_ads',
    subcategory: 'audiencias'
  },

  'meta_creativos': {
    id: 'meta_creativos',
    type: 'menu',
    text: `**Creativos que venden en Meta**

**La regla del 80/20:**
80% del exito es el creativo
20% es targeting y bidding

**Formatos que funcionan en 2025:**

🎬 **Video corto (< 15 seg)**
- Hook en primeros 3 segundos
- Subtitulos (85% ve sin sonido)
- Vertical 9:16 para Stories/Reels
- Conversion 2-3x vs imagen

📸 **Carrusel**
- 5-10 slides
- Historia con inicio-desarrollo-CTA
- Cada slide debe poder funcionar solo
- Ideal: producto + beneficios + social proof

🎭 **UGC (User Generated Content)**
- Parece organico, no publicidad
- Testimonios de clientes reales
- Unboxing, reviews
- Supera a creativos "profesionales"

**Estructura de video que convierte:**

**0-3 seg:** Hook (problema o resultado)
"¿Cansado de gastar en ads sin resultados?"

**3-8 seg:** Agitar el problema
"El 70% de las empresas pierde dinero en Meta"

**8-12 seg:** Presentar solucion
"Descubrimos un framework que..."

**12-15 seg:** CTA + Urgencia
"Solo 5 cupos este mes. Link en bio"

**Copy framework:**

**Headline:** Beneficio principal
**Problema:** Dolor del cliente
**Solucion:** Tu producto/servicio
**Prueba:** Numero, testimonio
**CTA:** Accion especifica + urgencia

**Ejemplo:**
"Duplica tus ventas en 90 dias
¿Tu e-commerce no crece? Probamos con +50 tiendas chilenas.
Nuestro metodo genera ROAS 4x promedio.
Agenda demo gratis (solo 3 cupos esta semana)"`,
    options: [
      { id: 'meta_testing', label: 'Como testear creativos', emoji: '🧪', nextNodeId: 'meta_testing' },
      { id: 'meta_intermedio', label: 'Nivel intermedio', emoji: '⏭️', nextNodeId: 'meta_intermedio' },
      { id: 'cotizar', label: 'Crear creativos', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Meta Ads', nextNodeId: 'meta_menu' }
    ],
    category: 'meta_ads',
    subcategory: 'creativos'
  },

  'meta_testing': {
    id: 'meta_testing',
    type: 'menu',
    text: `**Framework de Testing de Creativos**

**Fase 1: Testing amplio**
- 5-10 creativos diferentes
- $30.000-50.000 por creativo
- 3-5 dias
- Metrica: CTR > 1.5%, CPA inicial

**Fase 2: Iteracion**
- Top 2-3 creativos
- Variantes de cada uno:
  - Mismo video, diferente hook
  - Mismo mensaje, diferente formato
  - Mismo creativo, diferente copy

**Fase 3: Escala**
- Winner(s) a campana de escala
- Budget progresivo (+20%/dia)
- Monitorear fatiga (frecuencia > 3)

**Que testear (en orden):**
1. **Concepto creativo** (mayor impacto)
2. **Hook** (primeros 3 segundos)
3. **Formato** (video vs imagen vs carrusel)
4. **Copy** (headline y descripcion)
5. **CTA** (button y texto)

**Reglas de testing:**
- Solo 1 variable a la vez
- Minimo $30.000 por variante
- Minimo 1000 impresiones
- No tocar durante 3 dias
- Significancia estadistica antes de decidir

**Cuando matar un creativo:**
- CTR < 0.8% despues de 2000 impresiones
- CPA > 2x objetivo despues de 3 dias
- Frecuencia > 3.5 (audiencia saturada)`,
    options: [
      { id: 'meta_intermedio', label: 'Nivel intermedio', emoji: '⏭️', nextNodeId: 'meta_intermedio' },
      { id: 'cotizar', label: 'Testing profesional', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Creativos', nextNodeId: 'meta_creativos' }
    ],
    category: 'meta_ads',
    subcategory: 'testing'
  },

  'meta_intermedio': {
    id: 'meta_intermedio',
    type: 'menu',
    text: `**Meta Ads - Nivel Intermedio**

**1. Campaign Budget Optimization (CBO):**
Presupuesto a nivel campana, Meta distribuye.

✅ **Cuando usar:**
- Ad sets similares en tamano
- Testing de audiencias
- Escala

❌ **Cuando evitar:**
- Ad sets muy diferentes
- Remarketing vs prospeccion (separar)

**2. Advantage+ Shopping:**
IA de Meta para e-commerce.

**Setup:**
- Conectar catalogo
- Pixel con Purchase
- Budget minimo: $500.000/mes
- Dejar 7 dias sin tocar

**3. Optimizacion de eventos:**
Elige el evento mas abajo del funnel posible.

**Jerarquia (mejor a peor):**
1. Purchase (si tienes 50+/semana)
2. InitiateCheckout (20+/semana)
3. AddToCart (50+/semana)
4. Lead (si no hay e-commerce)
5. Landing Page View (ultimo recurso)

**4. Attribution settings:**

📊 **7-day click, 1-day view**
- Default recomendado
- Balance entre datos y precision

📊 **7-day click only**
- Mas conservador
- Mejor para comparar con otras plataformas

**5. Placement optimization:**

**Dejar automatico** (Advantage+):
- Meta encuentra mejor placement
- Mas alcance, menor CPM

**Manual cuando:**
- Creativos especificos por placement
- Stories vertical, Feed cuadrado
- Budget muy limitado`,
    options: [
      { id: 'meta_avanzado', label: 'Nivel avanzado', emoji: '🔴', nextNodeId: 'meta_avanzado' },
      { id: 'cotizar', label: 'Optimizar mi cuenta', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Meta Ads', nextNodeId: 'meta_menu' }
    ],
    category: 'meta_ads',
    subcategory: 'intermedio'
  },

  'meta_avanzado': {
    id: 'meta_avanzado',
    type: 'menu',
    text: `**Meta Ads - Nivel Avanzado**

**1. Conversion API (CAPI):**
Server-side tracking. Obligatorio en 2025.

**Por que:**
- iOS 14.5+ bloquea pixel
- Recuperas 30-40% de conversiones perdidas
- Mejor optimizacion

**Setup:**
- Via partner (Shopify, WordPress)
- Via Google Tag Manager Server
- Via desarrollo custom

**2. Lift Studies:**
Medir incrementalidad real.

**Conversion Lift:**
- Grupo control vs expuesto
- ¿Las ventas pasaron igual?
- Requiere budget significativo

**3. Marketing Mix Modeling:**
¿Cuanto aporta cada canal?

**4. Escala sin morir:**

🚀 **Escala horizontal:**
- Nuevos ad sets con audiencias frescas
- Duplicar winners a nuevas audiencias
- Expansion geografica

🚀 **Escala vertical:**
- +20% budget cada 3-4 dias
- No mas de 50% de golpe
- Monitorear CPA de cerca

**5. Retargeting avanzado:**

**Funnel de remarketing:**
- Dia 1-3: Urgencia alta, descuento
- Dia 4-7: Social proof, testimonios
- Dia 8-14: Contenido educativo
- Dia 15-30: Ultimo intento

**Exclusiones importantes:**
- Excluir compradores recientes
- Excluir rebotados < 10 seg
- Secuenciar mensajes

**6. Whitelisting/Spark Ads:**
Usar el handle de influencers.
- Mayor trust
- Mejor engagement
- Acceso a su audiencia`,
    options: [
      { id: 'meta_errores', label: 'Errores a evitar', emoji: '⚠️', nextNodeId: 'meta_errores' },
      { id: 'cotizar', label: 'Escalar mi cuenta', emoji: '📈', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Meta Ads', nextNodeId: 'meta_menu' }
    ],
    category: 'meta_ads',
    subcategory: 'avanzado'
  },

  'meta_errores': {
    id: 'meta_errores',
    type: 'menu',
    text: `**10 Errores Fatales en Meta Ads**

❌ **1. Audiencias muy pequenas**
< 100K = muy caro, sin escala.
Solucion: Audiencias 500K-2M+

❌ **2. Editar ads durante aprendizaje**
Cada cambio reinicia aprendizaje.
Solucion: Esperar 50 conversiones o 7 dias.

❌ **3. Demasiados ad sets**
Fragmenta el presupuesto.
Solucion: Max 3-5 ad sets por campana.

❌ **4. Creativos feos/genericos**
El creativo es el 80% del exito.
Solucion: UGC, videos cortos, hooks fuertes.

❌ **5. No usar remarketing**
El ROAS mas alto lo tienes ahi.
Solucion: Min 20% budget a remarketing.

❌ **6. Optimizar para metrica equivocada**
Trafico no paga las cuentas.
Solucion: Optimizar para conversiones reales.

❌ **7. Landing page mala**
Todo el trafico se pierde.
Solucion: Mobile-first, CTA claro, rapida.

❌ **8. No testear creativos**
1 creativo = apostar todo.
Solucion: 5-10 creativos en testing.

❌ **9. Escalar muy rapido**
+50% budget = CPA se dispara.
Solucion: +20% cada 3-4 dias.

❌ **10. Ignorar la fatiga**
Frecuencia > 3 = audiencia saturada.
Solucion: Rotar creativos cada 2-3 semanas.`,
    options: [
      { id: 'cotizar', label: 'Auditar mi cuenta', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Meta Ads', nextNodeId: 'meta_menu' }
    ],
    category: 'meta_ads',
    subcategory: 'errores'
  },

  // --- ESTRATEGIA DE CONTENIDO ---
  'contenido_menu': {
    id: 'contenido_menu',
    type: 'menu',
    text: `**Estrategia de Contenido**

Contenido organico que genera resultados.`,
    options: [
      { id: 'contenido_estrategia', label: 'Crear estrategia', emoji: '🎯', nextNodeId: 'contenido_estrategia' },
      { id: 'contenido_calendario', label: 'Calendario editorial', emoji: '📅', nextNodeId: 'contenido_calendario' },
      { id: 'contenido_formatos', label: 'Formatos que funcionan', emoji: '📱', nextNodeId: 'contenido_formatos' },
      { id: 'contenido_copywriting', label: 'Copywriting', emoji: '✍️', nextNodeId: 'contenido_copywriting' },
      { id: 'volver', label: '← Temas de aprendizaje', nextNodeId: 'aprender_menu' }
    ],
    category: 'contenido'
  },

  'contenido_estrategia': {
    id: 'contenido_estrategia',
    type: 'menu',
    text: `**Crear Estrategia de Contenido**

**Paso 1: Define pilares (3-5 temas)**

Ejemplo para agencia de marketing:
1. **Educativo** - Tips, tutoriales, how-to
2. **Casos** - Resultados, testimonios
3. **Behind scenes** - Equipo, cultura
4. **Tendencias** - Noticias, updates
5. **Venta** - Servicios, promos

**Paso 2: Define tu audiencia**
- ¿Quien es tu cliente ideal?
- ¿Que problemas tiene?
- ¿Donde consume contenido?
- ¿Que formato prefiere?

**Paso 3: Auditoria de competencia**
- ¿Que les funciona?
- ¿Que engagement tienen?
- ¿Que puedes hacer diferente?

**Paso 4: Diferenciador**
- ¿Cual es tu angulo unico?
- ¿Por que te seguirian?
- ¿Que valor aportas?

**Paso 5: Frecuencia sostenible**

**Instagram:**
- Feed: 4-5 posts/semana
- Stories: Diarias
- Reels: 3-4/semana

**LinkedIn:**
- Posts: 3-5/semana
- Articulos: 1-2/mes

**TikTok:**
- Videos: 1-2/dia

**Paso 6: KPIs**
- Engagement rate > 3%
- Crecimiento seguidores > 5%/mes
- Saves y shares (mas importantes que likes)
- Click to profile / web`,
    options: [
      { id: 'contenido_calendario', label: 'Armar calendario', emoji: '📅', nextNodeId: 'contenido_calendario' },
      { id: 'cotizar', label: 'Crear mi estrategia', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Contenido', nextNodeId: 'contenido_menu' }
    ],
    category: 'contenido',
    subcategory: 'estrategia'
  },

  'contenido_calendario': {
    id: 'contenido_calendario',
    type: 'menu',
    text: `**Calendario Editorial**

**Semana tipo (Instagram):**

📅 **Lunes:** Educativo
- Tip de la semana
- Formato: Carrusel 10 slides
- Objetivo: Saves

📅 **Martes:** Stories
- Q&A, encuestas
- Behind scenes
- Objetivo: Engagement

📅 **Miercoles:** Entretenimiento
- Meme de nicho
- Trend adaptado
- Objetivo: Shares

📅 **Jueves:** Autoridad
- Caso de exito
- Resultado con numeros
- Objetivo: Trust

📅 **Viernes:** Reel
- Video corto educativo
- Tutorial rapido
- Objetivo: Alcance

📅 **Sabado:** Stories
- Contenido personal
- Team / cultura
- Objetivo: Conexion

📅 **Domingo:** Venta suave
- CTA a servicio
- Testimonios
- Objetivo: Conversion

**Herramientas recomendadas:**
- Notion (planificacion)
- Later / Metricool (programacion)
- Canva (diseno)
- CapCut (video)

**Pro tip: Batch content**
Dedica 1-2 dias al mes para:
- Grabar todos los videos
- Disenar todos los graficos
- Escribir todos los copies
- Programar todo`,
    options: [
      { id: 'contenido_formatos', label: 'Formatos que funcionan', emoji: '📱', nextNodeId: 'contenido_formatos' },
      { id: 'cotizar', label: 'Gestion de RRSS', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Contenido', nextNodeId: 'contenido_menu' }
    ],
    category: 'contenido',
    subcategory: 'calendario'
  },

  'contenido_formatos': {
    id: 'contenido_formatos',
    type: 'menu',
    text: `**Formatos de Contenido 2025**

**🎬 REELS / TIKTOK (Rey del alcance)**

Duracion ideal: 15-30 segundos

**Formatos que explotan:**
1. Tutorial rapido (3 pasos)
2. POV / situacional
3. Before/after
4. Respuesta a comentario
5. Trend + nicho

**Estructura:**
- Hook 0-2 seg (retencion)
- Contenido 2-25 seg (valor)
- CTA 25-30 seg (accion)

**📸 CARRUSELES (Rey del engagement)**

Slides ideales: 7-10

**Estructura que funciona:**
1. Titulo llamativo (problema)
2. Contexto del problema
3-8. Solucion paso a paso
9. Resumen / conclusion
10. CTA (guarda, comparte)

**🎤 STORIES (Rey de la conexion)**

**Mix diario:**
- 1-2 de valor (tips)
- 1-2 personales (conexion)
- 1-2 interactivas (encuestas)

**Stickers que funcionan:**
- Encuestas (respuestas faciles)
- Preguntas (genera contenido)
- Quiz (educa jugando)
- Countdown (urgencia)

**📝 POST ESTATICO (Rey de la autoridad)**

**Cuando usar:**
- Anuncios importantes
- Citas/frases
- Infografias
- Datos duros`,
    options: [
      { id: 'contenido_copywriting', label: 'Copywriting', emoji: '✍️', nextNodeId: 'contenido_copywriting' },
      { id: 'cotizar', label: 'Crear contenido pro', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Contenido', nextNodeId: 'contenido_menu' }
    ],
    category: 'contenido',
    subcategory: 'formatos'
  },

  'contenido_copywriting': {
    id: 'contenido_copywriting',
    type: 'menu',
    text: `**Copywriting para Redes Sociales**

**La primera linea es TODO.**
2 segundos para captar atencion.

**Hooks que funcionan:**

🔥 **Pregunta provocadora**
"¿Por que tu competencia vende mas que tu?"

🔥 **Numero especifico**
"7 errores que te cuestan $500.000/mes"

🔥 **Contradiccion**
"Deja de postear todos los dias"

🔥 **Promesa directa**
"Como consegui 100 clientes en 30 dias"

🔥 **Miedo/Urgencia**
"El 80% de las empresas hace esto mal"

**Framework PAS:**

**P**roblema: Identifica el dolor
"¿Gastas en ads pero no ves resultados?"

**A**gitacion: Amplifica el dolor
"Cada mes que pasa, tu competencia te saca ventaja"

**S**olucion: Presenta tu respuesta
"Con nuestro metodo, el 90% de clientes ve ROI en 60 dias"

**Framework AIDA:**

**A**tencion: Hook
**I**nteres: Beneficio
**D**eseo: Prueba social
**A**ccion: CTA

**CTA efectivos:**
- "Guarda este post" (engagement)
- "Comenta X si quieres..." (interaccion)
- "Link en bio" (trafico)
- "Envia DM" (lead)
- "Etiqueta a alguien" (alcance)`,
    options: [
      { id: 'cotizar', label: 'Copy profesional', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Contenido', nextNodeId: 'contenido_menu' }
    ],
    category: 'contenido',
    subcategory: 'copywriting'
  },

  // --- METRICAS Y ANALYTICS ---
  'metricas_menu': {
    id: 'metricas_menu',
    type: 'menu',
    text: `**Metricas y Analytics**

Mide lo que importa, ignora la vanidad.`,
    options: [
      { id: 'metricas_importantes', label: 'Metricas que importan', emoji: '📊', nextNodeId: 'metricas_importantes' },
      { id: 'metricas_funnel', label: 'Metricas por funnel', emoji: '🎯', nextNodeId: 'metricas_funnel' },
      { id: 'metricas_benchmark', label: 'Benchmarks Chile 2025', emoji: '📈', nextNodeId: 'benchmarks_menu' },
      { id: 'metricas_atribucion', label: 'Modelos de atribucion', emoji: '🔄', nextNodeId: 'metricas_atribucion' },
      { id: 'volver', label: '← Temas de aprendizaje', nextNodeId: 'aprender_menu' }
    ],
    category: 'metricas'
  },

  'metricas_importantes': {
    id: 'metricas_importantes',
    type: 'menu',
    text: `**Metricas que REALMENTE importan**

**METRICAS DE ADQUISICION:**

💰 **CAC (Costo de Adquisicion de Cliente)**
Total invertido / Nuevos clientes
Meta: < 1/3 del LTV

💰 **CPL (Costo por Lead)**
Inversion / Leads generados
Chile B2B: $15K-$45K
Chile B2C: $3K-$15K

💰 **CPA (Costo por Adquisicion)**
Inversion / Conversiones
Similar a CAC pero por campana

**METRICAS DE RENTABILIDAD:**

📈 **ROAS (Return on Ad Spend)**
Ingresos / Inversion en ads
Minimo saludable: 3x
Bueno: 5x+

📈 **ROI (Return on Investment)**
(Ganancia - Inversion) / Inversion
Considera todos los costos

📈 **LTV (Lifetime Value)**
Valor total de un cliente en su vida
Formula: Ticket promedio x Frecuencia x Tiempo

**METRICAS DE EFICIENCIA:**

⚡ **CTR (Click Through Rate)**
Clicks / Impresiones
Google Search: 2-5%
Meta Feed: 0.8-1.5%

⚡ **CVR (Conversion Rate)**
Conversiones / Clicks
Landing B2B: 3-8%
E-commerce: 1-3%

**METRICAS VANIDAD (ignorar):**
❌ Impresiones (sin contexto)
❌ Likes (no pagan cuentas)
❌ Seguidores (sin engagement)
❌ Alcance (sin conversion)`,
    options: [
      { id: 'metricas_funnel', label: 'Metricas por funnel', emoji: '🎯', nextNodeId: 'metricas_funnel' },
      { id: 'cotizar', label: 'Dashboard personalizado', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Metricas', nextNodeId: 'metricas_menu' }
    ],
    category: 'metricas',
    subcategory: 'importantes'
  },

  'metricas_funnel': {
    id: 'metricas_funnel',
    type: 'menu',
    text: `**Metricas por Etapa del Funnel**

**TOFU (Top of Funnel) - Awareness**

📢 **Objetivo:** Que te conozcan

**Metricas:**
- Alcance
- Impresiones
- CPM (costo por mil)
- Video views
- Brand lift

**Benchmarks:**
- CPM Chile: $2.000-$8.000
- Video view 50%: $20-$100

**MOFU (Middle of Funnel) - Consideration**

🤔 **Objetivo:** Que te consideren

**Metricas:**
- CTR
- Tiempo en sitio
- Paginas por sesion
- Engagement rate
- Email open rate

**Benchmarks:**
- CTR: 1-3%
- Tiempo: > 1 minuto
- Email open: 20-30%

**BOFU (Bottom of Funnel) - Conversion**

💰 **Objetivo:** Que compren

**Metricas:**
- Conversion rate
- CPL / CPA
- ROAS
- Cart abandonment
- Lead to sale rate

**Benchmarks:**
- CVR landing: 3-8%
- Lead to sale: 10-30%
- Cart abandonment: 60-70%

**POST-FUNNEL - Retention**

🔄 **Objetivo:** Que vuelvan

**Metricas:**
- NPS
- Churn rate
- LTV
- Repeat purchase rate
- Referral rate`,
    options: [
      { id: 'benchmarks', label: 'Ver benchmarks', emoji: '📈', nextNodeId: 'benchmarks_menu' },
      { id: 'cotizar', label: 'Analizar mi funnel', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Metricas', nextNodeId: 'metricas_menu' }
    ],
    category: 'metricas',
    subcategory: 'funnel'
  },

  'metricas_atribucion': {
    id: 'metricas_atribucion',
    type: 'menu',
    text: `**Modelos de Atribucion**

¿Que canal recibe el credito de la venta?

**Last Click (Ultimo clic)**
- El ultimo punto de contacto
- Simple pero incompleto
- Subestima awareness

**First Click (Primer clic)**
- El primer punto de contacto
- Bueno para ver discovery
- Ignora nurturing

**Linear (Lineal)**
- Credito igual a todos
- Justo pero impreciso
- Buen balance

**Time Decay (Decaimiento)**
- Mas credito a los ultimos
- Bueno para ciclos largos
- El mas realista

**Position Based (Posicion)**
- 40% primero, 40% ultimo, 20% medio
- Balance entre discovery y cierre

**Data-Driven (Basado en datos)**
- IA analiza patrones
- El mas preciso
- Requiere +300 conversiones

**Recomendacion por negocio:**

🛒 **E-commerce:** Data-driven o Last click
💼 **B2B:** Position-based o Time decay
📱 **Apps:** First click (discovery)
🎯 **Lead gen:** Time decay

**Pro tip:**
Compara diferentes modelos.
Si un canal se ve muy diferente,
probablemente esta sub/sobre valorado.`,
    options: [
      { id: 'cotizar', label: 'Configurar atribucion', emoji: '🔧', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Metricas', nextNodeId: 'metricas_menu' }
    ],
    category: 'metricas',
    subcategory: 'atribucion'
  },

  // --- OPTIMIZACION DE CONVERSION ---
  'conversion_menu': {
    id: 'conversion_menu',
    type: 'menu',
    text: `**Optimizacion de Conversion (CRO)**

Convierte mas visitantes en clientes.`,
    options: [
      { id: 'conversion_landing', label: 'Landing pages', emoji: '📄', nextNodeId: 'conversion_landing' },
      { id: 'conversion_cta', label: 'CTAs efectivos', emoji: '🎯', nextNodeId: 'conversion_cta' },
      { id: 'conversion_forms', label: 'Formularios', emoji: '📝', nextNodeId: 'conversion_forms' },
      { id: 'conversion_psicologia', label: 'Psicologia de conversion', emoji: '🧠', nextNodeId: 'conversion_psicologia' },
      { id: 'conversion_ab', label: 'A/B Testing', emoji: '🧪', nextNodeId: 'conversion_ab' },
      { id: 'volver', label: '← Temas de aprendizaje', nextNodeId: 'aprender_menu' }
    ],
    category: 'conversion'
  },

  'conversion_landing': {
    id: 'conversion_landing',
    type: 'menu',
    text: `**Landing Pages que Convierten**

**La regla de oro:**
1 Landing = 1 Objetivo = 1 CTA

**Estructura que funciona:**

**1. Above the fold (sin scroll)**
- Headline: Beneficio principal
- Subheadline: Como lo logras
- CTA visible
- Imagen/video relevante

**2. Social proof**
- Logos de clientes
- Numero de usuarios/clientes
- Testimonios con foto
- Rating/reviews

**3. Beneficios (no caracteristicas)**
❌ "Software con 50 funciones"
✅ "Ahorra 10 horas a la semana"

**4. Como funciona**
- 3 pasos simples
- Con iconos visuales
- Reduce friccion mental

**5. Testimonios expandidos**
- Video testimonios (lo mejor)
- Caso con resultados especificos
- Antes/despues

**6. FAQ**
- Responde objeciones
- Reduce llamados al soporte
- Mejora SEO

**7. CTA final**
- Repetir el CTA
- Urgencia/escasez
- Garantia

**Checklist rapido:**
☐ Carga < 3 segundos
☐ Mobile responsive
☐ CTA visible sin scroll
☐ Un solo objetivo
☐ Sin menu de navegacion
☐ Beneficios claros
☐ Social proof visible
☐ Formulario corto`,
    options: [
      { id: 'conversion_cta', label: 'CTAs efectivos', emoji: '🎯', nextNodeId: 'conversion_cta' },
      { id: 'cotizar', label: 'Crear mi landing', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Conversion', nextNodeId: 'conversion_menu' }
    ],
    category: 'conversion',
    subcategory: 'landing'
  },

  'conversion_cta': {
    id: 'conversion_cta',
    type: 'menu',
    text: `**CTAs que Generan Clicks**

**Anatomia de un CTA perfecto:**

**1. Verbo de accion**
✅ Obtener, Descargar, Empezar, Acceder
❌ Enviar, Click aqui, Saber mas

**2. Beneficio incluido**
✅ "Obtener mi auditoria gratis"
❌ "Enviar formulario"

**3. Urgencia**
✅ "Reservar mi cupo (solo 5 disponibles)"
❌ "Reservar"

**CTAs por objetivo:**

📧 **Lead magnet:**
"Descargar guia gratis"
"Obtener mi template"

📞 **Consulta:**
"Agendar llamada gratis"
"Hablar con experto"

🛒 **E-commerce:**
"Agregar al carrito"
"Comprar ahora - Envio gratis"

📱 **App:**
"Probar 14 dias gratis"
"Crear cuenta en 30 seg"

**Colores que convierten:**
- Contraste con el fondo
- Verde: confianza, adelante
- Naranja: urgencia, accion
- Azul: profesional, seguro

**Tamano y posicion:**
- Grande pero no gritador
- Espacio blanco alrededor
- Above the fold
- Repetir al final

**Test: La regla de los 5 segundos**
Alguien deberia entender que hacer en 5 segundos de ver tu pagina.`,
    options: [
      { id: 'conversion_forms', label: 'Formularios', emoji: '📝', nextNodeId: 'conversion_forms' },
      { id: 'cotizar', label: 'Optimizar mis CTAs', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Conversion', nextNodeId: 'conversion_menu' }
    ],
    category: 'conversion',
    subcategory: 'cta'
  },

  'conversion_forms': {
    id: 'conversion_forms',
    type: 'menu',
    text: `**Formularios que Convierten**

**Regla de oro:**
Cada campo extra = -10% conversion

**Campos minimos necesarios:**
- Nombre (o solo email)
- Email
- Telefono (si necesitas llamar)

**Campos que matan conversion:**
- Direccion completa
- Fecha de nacimiento
- "¿Como nos conociste?"
- Campos abiertos largos

**Optimizaciones:**

✅ **Multi-step forms**
Dividir en 2-3 pasos cortos
+30% completion rate

✅ **Progress bar**
"Paso 1 de 3"
Reduce abandono

✅ **Placeholders vs Labels**
Usar ambos
Label arriba, placeholder ejemplo

✅ **Validacion en tiempo real**
No esperar al submit
Mostrar check verde

✅ **Autocompletar**
Permitir Chrome autofill
Menos friccion

✅ **CTA especifico**
❌ "Enviar"
✅ "Obtener mi cotizacion gratis"

**Para mobile:**
- Teclado numerico para telefono
- Email keyboard para email
- Campos grandes (44px min)
- Botones touch-friendly

**WhatsApp como alternativa:**
En Chile, WhatsApp convierte mejor que formularios.
Considera boton de WhatsApp como CTA principal.`,
    options: [
      { id: 'conversion_psicologia', label: 'Psicologia conversion', emoji: '🧠', nextNodeId: 'conversion_psicologia' },
      { id: 'cotizar', label: 'Optimizar formularios', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Conversion', nextNodeId: 'conversion_menu' }
    ],
    category: 'conversion',
    subcategory: 'forms'
  },

  'conversion_psicologia': {
    id: 'conversion_psicologia',
    type: 'menu',
    text: `**Psicologia de la Conversion**

**6 Principios de Cialdini:**

**1. Reciprocidad**
Dar antes de pedir.
- Lead magnets gratuitos
- Consultoria sin costo
- Contenido de valor

**2. Escasez**
Lo limitado es mas valioso.
- "Solo 5 cupos"
- "Oferta termina en 24hrs"
- Stock limitado (real)

**3. Autoridad**
Expertos convencen mas.
- Menciones en prensa
- Certificaciones
- Anos de experiencia

**4. Consistencia**
Pequenos compromisos llevan a grandes.
- Micro-conversiones
- "Si, quiero mejorar" antes del form
- Free trial antes de compra

**5. Simpatia**
Compramos a quienes nos caen bien.
- Fotos del equipo
- Historia de la empresa
- Valores compartidos

**6. Consenso social**
Seguimos a la mayoria.
- "+10,000 clientes"
- Testimonios
- Ratings y reviews

**Sesgos cognitivos utiles:**

🧠 **Anclaje**
Mostrar precio alto primero.
"$500.000" tachado, "Hoy $299.000"

🧠 **Aversion a la perdida**
"No pierdas la oportunidad"
vs "Aprovecha la oportunidad"

🧠 **Efecto dotacion**
Hacer sentir que ya es suyo.
"Tu plan personalizado esta listo"

🧠 **Paradoja de la eleccion**
Menos opciones = mas conversion.
3 planes, no 10.`,
    options: [
      { id: 'conversion_ab', label: 'A/B Testing', emoji: '🧪', nextNodeId: 'conversion_ab' },
      { id: 'cotizar', label: 'Aplicar a mi negocio', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Conversion', nextNodeId: 'conversion_menu' }
    ],
    category: 'conversion',
    subcategory: 'psicologia'
  },

  'conversion_ab': {
    id: 'conversion_ab',
    type: 'menu',
    text: `**A/B Testing**

**Que testear (por impacto):**

🔴 **Alto impacto:**
- Headline / propuesta de valor
- CTA (texto y color)
- Imagen principal
- Precio / oferta

🟡 **Medio impacto:**
- Layout de landing
- Formulario (campos)
- Social proof
- Copy de beneficios

🟢 **Bajo impacto:**
- Colores secundarios
- Tipografia
- Iconos
- Detalles visuales

**Metodologia:**

**1. Hipotesis clara**
"Cambiar el CTA de 'Enviar' a 'Obtener cotizacion gratis' aumentara conversiones porque reduce ambiguedad"

**2. Una variable a la vez**
Si cambias 3 cosas, no sabes cual funciono.

**3. Tamano de muestra**
Minimo 100 conversiones por variante.
Usa calculadora de significancia.

**4. Tiempo suficiente**
Minimo 1-2 semanas.
Incluir diferentes dias.

**5. 95% de confianza**
No declarar ganador antes.
Esperar significancia estadistica.

**Herramientas:**
- Google Optimize (gratis, discontinuado 2024)
- VWO (pagado)
- Optimizely (enterprise)
- AB Tasty (pagado)

**Documenta todo:**
- Que testeaste
- Hipotesis
- Resultado
- Aprendizaje`,
    options: [
      { id: 'cotizar', label: 'Programa de CRO', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Conversion', nextNodeId: 'conversion_menu' }
    ],
    category: 'conversion',
    subcategory: 'ab_testing'
  },

  // --- TENDENCIAS 2025 ---
  'tendencias_2025': {
    id: 'tendencias_2025',
    type: 'menu',
    text: `**Tendencias Marketing Digital 2025**

**1. IA Generativa**
- ChatGPT para copywriting
- MidJourney para creativos
- Video AI (Sora, Runway)
- Personalizacion a escala

**2. Cookieless Future**
- First-party data es oro
- Contextual targeting regresa
- Conversion API obligatorio
- Modeled conversions

**3. Video Corto Domina**
- TikTok sigue creciendo
- Reels > Posts estaticos
- YouTube Shorts
- < 60 segundos ideal

**4. Social Commerce**
- Instagram Shop
- TikTok Shop
- Live shopping
- Checkout in-app

**5. Micro-influencers**
- > ROI que mega influencers
- Nichos especificos
- Autenticidad > Alcance
- UGC como ads

**6. Automatizacion**
- Performance Max
- Advantage+ Shopping
- Broad targeting + IA
- Menos control manual

**7. Zero-Click Content**
- Valor sin dejar la red
- Carruseles educativos
- Threads / notas
- Menos trafico, mas brand

**8. Audio & Podcast**
- Spotify Ads
- Podcast sponsorship
- Voice search
- Audio branding

**9. Privacidad**
- iOS continua restringiendo
- Google depreca cookies
- Consent Mode v2
- Server-side tracking

**10. Community**
- Discord communities
- WhatsApp communities
- Membership models
- Owned audience`,
    options: [
      { id: 'cotizar', label: 'Actualizarme con M&P', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Temas de aprendizaje', nextNodeId: 'aprender_menu' }
    ],
    category: 'tendencias',
    subcategory: '2025'
  },

  // ========================================
  // RAMA: DIAGNOSTICO
  // ========================================
  'diagnostico_menu': {
    id: 'diagnostico_menu',
    type: 'menu',
    text: `**Diagnostico de tu Marketing**

Responde algunas preguntas y te doy recomendaciones personalizadas.`,
    options: [
      { id: 'diag_presupuesto', label: '¿Cuanto deberia invertir?', emoji: '💰', nextNodeId: 'diag_presupuesto' },
      { id: 'diag_canal', label: '¿Que canal me conviene?', emoji: '📢', nextNodeId: 'diag_canal' },
      { id: 'diag_problema', label: 'No me funcionan los ads', emoji: '😰', nextNodeId: 'diag_problema' },
      { id: 'diag_empezar', label: 'Quiero empezar desde cero', emoji: '🌱', nextNodeId: 'diag_empezar' },
      { id: 'diag_escalar', label: 'Quiero escalar', emoji: '📈', nextNodeId: 'diag_escalar' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'diagnostico'
  },

  'diag_presupuesto': {
    id: 'diag_presupuesto',
    type: 'menu',
    text: `**¿Cuanto invertir en marketing digital?**

**Formula del presupuesto ideal:**

**Paso 1: Define tu meta**
Ejemplo: 20 clientes nuevos/mes

**Paso 2: Conoce tu conversion rate**
Promedio: 10-20% de leads se convierten

**Paso 3: Calcula leads necesarios**
20 clientes / 15% = 134 leads necesarios

**Paso 4: Conoce tu CPL promedio**
B2B Chile: $20.000-$40.000
B2C Chile: $5.000-$15.000

**Paso 5: Calcula inversion**
134 leads x $25.000 = $3.350.000/mes

**Reglas generales:**

📊 **Por etapa de empresa:**
- Startup: 15-20% de ingresos
- Crecimiento: 10-15% de ingresos
- Establecida: 5-10% de ingresos

📊 **Por objetivo:**
- Awareness: $500K-$1M/mes minimo
- Lead gen: $300K-$500K/mes minimo
- E-commerce: $500K-$1M/mes minimo

📊 **Por canal:**
- Google Ads: min $400K/mes
- Meta Ads: min $300K/mes
- LinkedIn: min $500K/mes

**Importante:**
- Esto es inversion en ADS
- El fee de agencia es adicional
- Incluye margen para testing`,
    options: [
      { id: 'herramientas', label: 'Calcular con MP Predictor', emoji: '🧮', nextNodeId: 'herramientas_menu' },
      { id: 'cotizar', label: 'Planificar con M&P', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Diagnostico', nextNodeId: 'diagnostico_menu' }
    ],
    category: 'diagnostico',
    subcategory: 'presupuesto'
  },

  'diag_canal': {
    id: 'diag_canal',
    type: 'menu',
    text: `**¿Que canal de marketing me conviene?**

**SI vendes B2B (a empresas):**
1. LinkedIn Ads - decision makers
2. Google Search - busqueda activa
3. Email marketing - nurturing
4. Webinars - autoridad

**SI vendes B2C (consumidor):**
1. Meta Ads - discovery
2. Google Search - intencion
3. TikTok - awareness
4. Influencers - confianza

**SI tienes E-commerce:**
1. Google Shopping - obligatorio
2. Meta con catalogo - retargeting
3. TikTok Shop - tendencia
4. Email - abandoned cart

**SI tienes ticket alto (>$1M):**
1. LinkedIn + Google
2. Webinars y eventos
3. Contenido de autoridad
4. Outbound sales

**SI tienes ticket bajo (<$100K):**
1. Meta Ads - volumen
2. Google Shopping
3. Influencers micro
4. Remarketing agresivo

**SI tienes servicio local:**
1. Google Local/Maps
2. Meta geosegmentado
3. Google My Business
4. Reviews

**Matriz de decision:**
| Canal | B2B | B2C | Ecomm | Local |
|-------|-----|-----|-------|-------|
| Google Search | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Google Shopping | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| Meta Ads | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| LinkedIn | ⭐⭐⭐ | ⭐ | ⭐ | ⭐ |
| TikTok | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |`,
    options: [
      { id: 'benchmarks', label: 'Ver benchmarks', emoji: '📊', nextNodeId: 'benchmarks_menu' },
      { id: 'cotizar', label: 'Estrategia personalizada', emoji: '💼', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Diagnostico', nextNodeId: 'diagnostico_menu' }
    ],
    category: 'diagnostico',
    subcategory: 'canal'
  },

  'diag_problema': {
    id: 'diag_problema',
    type: 'menu',
    text: `**¿Por que no funcionan tus ads?**

**Diagnostico rapido:**

**🔴 Si tienes impresiones pero pocos clicks (CTR bajo):**
- Anuncios poco atractivos
- Audiencia incorrecta
- Keywords irrelevantes
- Solucion: Mejorar creativos y targeting

**🔴 Si tienes clicks pero pocas conversiones:**
- Landing page mala
- Oferta no atractiva
- Audiencia incorrecta
- Solucion: Optimizar landing, revisar oferta

**🔴 Si tienes conversiones pero ventas bajas:**
- Leads no calificados
- Problema de seguimiento comercial
- Targeting muy amplio
- Solucion: Refinar audiencia, mejorar proceso de venta

**🔴 Si el CPA es muy alto:**
- Competencia alta
- Budget muy bajo
- Conversion tracking malo
- Solucion: Mejorar Quality Score, aumentar budget

**🔴 Si el presupuesto no se gasta:**
- Audiencia muy pequena
- Bids muy bajos
- Restricciones de targeting
- Solucion: Ampliar audiencia o subir bids

**Checklist de emergencia:**

☐ ¿Conversion tracking funciona?
☐ ¿Landing carga en < 3 seg?
☐ ¿CTA es claro?
☐ ¿Audiencia es correcta?
☐ ¿Presupuesto es suficiente?
☐ ¿Creativos son atractivos?`,
    options: [
      { id: 'google_errores', label: 'Errores Google Ads', emoji: '🔍', nextNodeId: 'google_errores' },
      { id: 'meta_errores', label: 'Errores Meta Ads', emoji: '📱', nextNodeId: 'meta_errores' },
      { id: 'cotizar', label: 'Auditoria profesional', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Diagnostico', nextNodeId: 'diagnostico_menu' }
    ],
    category: 'diagnostico',
    subcategory: 'problema'
  },

  'diag_empezar': {
    id: 'diag_empezar',
    type: 'menu',
    text: `**Empezar Marketing Digital desde Cero**

**Paso 1: Fundamentos (Semana 1-2)**

☐ Define tu cliente ideal
☐ Analiza a tu competencia
☐ Define tu propuesta de valor unica
☐ Crea/optimiza tu sitio web
☐ Instala Google Analytics
☐ Instala Facebook Pixel

**Paso 2: Contenido base (Semana 3-4)**

☐ Crea perfiles en redes relevantes
☐ Define pilares de contenido
☐ Crea 10-20 contenidos base
☐ Optimiza SEO basico

**Paso 3: Primeras campanas (Mes 2)**

☐ Campana de awareness/trafico
☐ Construir audiencias de remarketing
☐ Primeros 1000 visitantes
☐ Testing de mensajes

**Paso 4: Conversion (Mes 3)**

☐ Campana de conversiones
☐ Landing page optimizada
☐ Lead magnet o oferta
☐ Remarketing activo

**Presupuesto inicial recomendado:**
- Mes 1-2: $300K-500K testing
- Mes 3+: $500K-1M escala

**Errores de principiante:**
❌ Empezar con budget muy bajo
❌ Esperar resultados inmediatos
❌ No trackear conversiones
❌ Cambiar todo cada 2 dias`,
    options: [
      { id: 'aprender', label: 'Aprender primero', emoji: '🎓', nextNodeId: 'aprender_menu' },
      { id: 'cotizar', label: 'M&P lo hace por ti', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Diagnostico', nextNodeId: 'diagnostico_menu' }
    ],
    category: 'diagnostico',
    subcategory: 'empezar'
  },

  'diag_escalar': {
    id: 'diag_escalar',
    type: 'menu',
    text: `**Como Escalar tu Marketing**

**Prerequisitos para escalar:**

✅ CPL/CPA estable por 30+ dias
✅ Conversion tracking confiable
✅ Landing page probada
✅ Proceso de venta funcionando
✅ Margen para invertir mas

**Estrategias de escala:**

**1. Escala vertical (mas budget)**
- Aumentar 20% cada 3-4 dias
- Nunca +50% de golpe
- Monitorear CPA de cerca
- Ajustar si sube >20%

**2. Escala horizontal (mas canales)**
- Agregar nuevo canal
- Replicar lo que funciona
- Google → Meta → LinkedIn
- Mismo mensaje, adaptado

**3. Escala de audiencias**
- Lookalikes mas amplios
- Nuevos segmentos
- Nuevas geografias
- Expansion de intereses

**4. Escala de creativos**
- Mas variantes de winners
- Nuevos angulos
- Nuevos formatos
- UGC y testimonios

**Errores al escalar:**

❌ Escalar muy rapido
❌ Ignorar fatiga de audiencia
❌ No rotar creativos
❌ Perder foco en rentabilidad
❌ No reinvertir en contenido

**KPIs de escala:**
- CPA vs objetivo
- ROAS vs baseline
- Frecuencia < 3
- Incrementalidad`,
    options: [
      { id: 'google_avanzado', label: 'Escalar Google Ads', emoji: '🔍', nextNodeId: 'google_avanzado' },
      { id: 'meta_avanzado', label: 'Escalar Meta Ads', emoji: '📱', nextNodeId: 'meta_avanzado' },
      { id: 'cotizar', label: 'Plan de escala M&P', emoji: '📈', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Diagnostico', nextNodeId: 'diagnostico_menu' }
    ],
    category: 'diagnostico',
    subcategory: 'escalar'
  },

  // ========================================
  // RAMA: HERRAMIENTAS GRATIS
  // ========================================
  'herramientas_menu': {
    id: 'herramientas_menu',
    type: 'menu',
    text: `**Herramientas Gratuitas M&P Labs**

Desarrollamos herramientas para ayudarte. 100% gratis.`,
    options: [
      { id: 'buyer_gen', label: 'Buyer Gen - Personas', emoji: '👤', nextNodeId: 'tool_buyer_gen' },
      { id: 'predictor', label: 'MP Predictor - ROI', emoji: '📈', nextNodeId: 'tool_predictor' },
      { id: 'benchmarks', label: 'Benchmarks Chile 2025', emoji: '📊', nextNodeId: 'benchmarks_menu' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'herramientas'
  },

  'tool_buyer_gen': {
    id: 'tool_buyer_gen',
    type: 'menu',
    text: `**Buyer Gen - Generador de Buyer Personas**

Crea perfiles detallados de tus clientes ideales.

**¿Que obtienes?**
✅ 3 buyer personas para tu industria
✅ Keywords recomendadas
✅ KPIs por industria
✅ Estrategia de contenido
✅ Canales recomendados
✅ Benchmarks Chile 2025
✅ Exportar a PDF

**12 industrias disponibles:**
Tecnologia, Salud, Educacion, Finanzas, Retail, Servicios, Inmobiliaria, Automotriz, Gastronomia, Turismo, Construccion, Legal

*100% gratis, sin registro*`,
    options: [
      { id: 'usar', label: 'Usar Buyer Gen', emoji: '🚀', nextNodeId: 'link_buyer_gen' },
      { id: 'volver', label: '← Herramientas', nextNodeId: 'herramientas_menu' }
    ],
    category: 'herramientas',
    subcategory: 'buyer_gen'
  },

  'link_buyer_gen': {
    id: 'link_buyer_gen',
    type: 'external_link',
    text: 'Abriendo Buyer Gen...',
    externalUrl: 'https://www.mulleryperez.cl/labs/buyer-gen',
    nextNode: 'herramientas_menu',
    category: 'herramientas'
  },

  'tool_predictor': {
    id: 'tool_predictor',
    type: 'menu',
    text: `**MP Predictor - Proyeccion de ROI**

Simula el rendimiento de tus campanas antes de invertir.

**¿Que hace?**
✅ Proyecta leads por presupuesto
✅ Calcula CPL esperado
✅ Estima ROI potencial
✅ Compara por plataforma
✅ Ajusta por industria

**Basado en:**
• Data de +200 campanas activas
• Benchmarks Chile 2025
• Ajustado por industria y modelo

*Ideal para planificar inversiones*`,
    options: [
      { id: 'usar', label: 'Usar MP Predictor', emoji: '🚀', nextNodeId: 'link_predictor' },
      { id: 'volver', label: '← Herramientas', nextNodeId: 'herramientas_menu' }
    ],
    category: 'herramientas',
    subcategory: 'predictor'
  },

  'link_predictor': {
    id: 'link_predictor',
    type: 'external_link',
    text: 'Abriendo MP Predictor...',
    externalUrl: 'https://www.mulleryperez.cl/mp-predictor',
    nextNode: 'herramientas_menu',
    category: 'herramientas'
  },

  'benchmarks_menu': {
    id: 'benchmarks_menu',
    type: 'menu',
    text: `**Benchmarks Chile 2025**

Metricas reales por industria. Data de +200 campanas.`,
    options: [
      { id: 'bench_tech', label: 'Tecnologia / SaaS', emoji: '💻', nextNodeId: 'bench_tech' },
      { id: 'bench_ecommerce', label: 'E-commerce', emoji: '🛒', nextNodeId: 'bench_ecommerce' },
      { id: 'bench_salud', label: 'Salud / Medicina', emoji: '🏥', nextNodeId: 'bench_salud' },
      { id: 'bench_inmob', label: 'Inmobiliaria', emoji: '🏠', nextNodeId: 'bench_inmob' },
      { id: 'bench_servicios', label: 'Servicios B2B', emoji: '💼', nextNodeId: 'bench_servicios' },
      { id: 'bench_educacion', label: 'Educacion', emoji: '🎓', nextNodeId: 'bench_educacion' },
      { id: 'volver', label: '← Herramientas', nextNodeId: 'herramientas_menu' }
    ],
    category: 'benchmarks'
  },

  'bench_tech': {
    id: 'bench_tech',
    type: 'response',
    text: '',
    response: `**Benchmarks Tecnologia / SaaS - Chile 2025**

**Google Ads:**
• CPL: $15.000 - $45.000
• CTR: 2.5% - 4%
• Conversion: 3% - 8%
• CPC: $500 - $2.000

**Meta Ads:**
• CPL: $8.000 - $25.000
• CTR: 0.8% - 1.5%
• Conversion: 2% - 5%
• CPM: $4.000 - $10.000

**LinkedIn Ads:**
• CPL: $25.000 - $60.000
• CTR: 0.4% - 0.8%
• Conversion: 5% - 12%
• CPC: $3.000 - $8.000

**KPIs clave:**
• CAC: $200.000 - $800.000
• LTV: $2.000.000+
• Churn: < 5% mensual
• NPS: > 40

**Canales recomendados:**
1. Google Search (demanda existente)
2. LinkedIn (decision makers)
3. Content marketing (SEO)
4. Webinars (autoridad)

**Ticket promedio SaaS Chile:**
• SMB: $50.000 - $200.000/mes
• Enterprise: $500.000+/mes`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks'
  },

  'bench_ecommerce': {
    id: 'bench_ecommerce',
    type: 'response',
    text: '',
    response: `**Benchmarks E-commerce - Chile 2025**

**Google Shopping:**
• CPC: $150 - $400
• CTR: 0.8% - 2%
• ROAS: 3x - 8x
• Conversion: 1% - 3%

**Meta Ads:**
• CPL: $2.000 - $8.000
• CTR: 1% - 2.5%
• ROAS: 2x - 5x
• CPM: $3.000 - $8.000

**TikTok Ads:**
• CPL: $1.500 - $5.000
• CTR: 1.5% - 3%
• ROAS: 2x - 4x
• CPM: $2.000 - $6.000

**KPIs clave:**
• ROAS minimo rentable: 3x
• Conversion rate: 1.5% - 3%
• Ticket promedio: $40.000 - $80.000
• Cart abandonment: 65% - 75%

**Canales recomendados:**
1. Google Shopping (intencion compra)
2. Meta Ads (discovery + retargeting)
3. Email marketing (abandoned cart)
4. Influencers (awareness)

**Temporadas clave Chile:**
• Cyber Monday (Nov)
• Black Friday (Nov)
• Navidad (Dic)
• Dia de la Madre (May)`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks'
  },

  'bench_salud': {
    id: 'bench_salud',
    type: 'response',
    text: '',
    response: `**Benchmarks Salud / Medicina - Chile 2025**

**Google Ads:**
• CPL: $8.000 - $25.000
• CTR: 3% - 6%
• Conversion: 5% - 12%
• CPC: $300 - $1.500

**Meta Ads:**
• CPL: $5.000 - $15.000
• CTR: 1.5% - 3%
• Conversion: 3% - 8%
• CPM: $3.000 - $7.000

**Google My Business:**
• Costo: Gratis
• Impacto: 30-50% de leads

**KPIs clave:**
• Costo por paciente agendado: $15.000 - $40.000
• Show rate: 70% - 85%
• Ticket promedio: $50.000 - $300.000
• NPS: > 50

**Canales recomendados:**
1. Google Search (busqueda activa)
2. Google My Business (local)
3. Meta Ads (awareness)
4. Reviews (confianza)

**Importante:**
• Cumplir regulaciones MINSAL
• No prometer resultados medicos
• Disclaimer obligatorio
• Profesionales con registro`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks'
  },

  'bench_inmob': {
    id: 'bench_inmob',
    type: 'response',
    text: '',
    response: `**Benchmarks Inmobiliaria - Chile 2025**

**Google Ads:**
• CPL: $20.000 - $80.000
• CTR: 1.5% - 3%
• Conversion: 1% - 3%
• CPC: $500 - $2.500

**Meta Ads:**
• CPL: $15.000 - $50.000
• CTR: 1% - 2%
• Conversion: 1% - 2%
• CPM: $4.000 - $10.000

**Portales:**
• Portal Inmobiliario: $10.000 - $30.000 CPL
• Yapo: $8.000 - $25.000 CPL

**KPIs clave:**
• Costo por visita agendada: $80.000 - $200.000
• Visita a promesa: 5% - 15%
• Ciclo de venta: 2 - 6 meses
• Ticket: $50M - $200M+

**Canales recomendados:**
1. Google Search (busqueda activa)
2. Portales (trafico calificado)
3. Meta Ads (retargeting + nuevos proyectos)
4. Email a base de inversionistas

**Temporadas:**
• Mar-May: Alta demanda
• Jul-Ago: Baja
• Sep-Nov: Recuperacion`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks'
  },

  'bench_servicios': {
    id: 'bench_servicios',
    type: 'response',
    text: '',
    response: `**Benchmarks Servicios B2B - Chile 2025**

**Google Ads:**
• CPL: $12.000 - $40.000
• CTR: 2% - 4%
• Conversion: 3% - 8%
• CPC: $400 - $2.000

**LinkedIn Ads:**
• CPL: $20.000 - $50.000
• CTR: 0.4% - 0.8%
• Conversion: 5% - 10%
• CPC: $2.500 - $6.000

**Email Marketing:**
• Open rate: 20% - 30%
• Click rate: 2% - 5%
• Conversion: 1% - 3%

**KPIs clave:**
• CPL calificado: $30.000 - $80.000
• Lead to opportunity: 20% - 40%
• Opportunity to close: 20% - 30%
• Ticket promedio: $500.000 - $5.000.000+

**Canales recomendados:**
1. LinkedIn (decision makers)
2. Google Search (demanda activa)
3. Email nurturing (ciclo largo)
4. Webinars/eventos (autoridad)
5. Referidos (mejor CAC)

**Ciclo de venta:**
• Ticket < $1M: 1-3 meses
• Ticket $1M-$5M: 3-6 meses
• Ticket > $5M: 6-12 meses`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks'
  },

  'bench_educacion': {
    id: 'bench_educacion',
    type: 'response',
    text: '',
    response: `**Benchmarks Educacion - Chile 2025**

**Google Ads:**
• CPL: $5.000 - $20.000
• CTR: 2% - 4%
• Conversion: 2% - 6%
• CPC: $200 - $1.000

**Meta Ads:**
• CPL: $3.000 - $12.000
• CTR: 1.5% - 3%
• Conversion: 2% - 5%
• CPM: $2.500 - $6.000

**TikTok Ads:**
• CPL: $2.000 - $8.000
• CTR: 1.5% - 3%
• Muy efectivo para jovenes

**KPIs clave:**
• Costo por matricula: $50.000 - $200.000
• Lead to matricula: 5% - 15%
• Tasa de desercion: 10% - 30%
• NPS: > 40

**Canales recomendados:**
1. Meta Ads (awareness)
2. Google Search (busqueda activa)
3. TikTok (audiencia joven)
4. Email nurturing (ciclo decision)
5. Webinars gratuitos (lead magnet)

**Temporadas clave:**
• Ene-Mar: Matriculas 1er sem
• Jul-Ago: Matriculas 2do sem
• Oct-Dic: Admision siguiente ano`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks'
  },

  // ========================================
  // RAMA: SERVICIOS M&P
  // ========================================
  'servicios_menu': {
    id: 'servicios_menu',
    type: 'menu',
    text: `**Servicios M&P**

Agencia de marketing digital enfocada en performance.
+200 campanas activas | 95% retencion | ROI +380%`,
    options: [
      { id: 'planes', label: 'Planes y precios', emoji: '💰', nextNodeId: 'planes_menu' },
      { id: 'metodologia', label: 'Como trabajamos', emoji: '🔧', nextNodeId: 'metodologia_info' },
      { id: 'diferencial', label: 'Por que M&P', emoji: '⭐', nextNodeId: 'diferencial_info' },
      { id: 'casos', label: 'Casos de exito', emoji: '🏆', nextNodeId: 'casos_info' },
      { id: 'cotizar', label: 'Pedir cotizacion', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'servicios'
  },

  'planes_menu': {
    id: 'planes_menu',
    type: 'menu',
    text: `**Planes M&P 2025**

| Plan | Precio/mes | Campanas | Contenidos |
|------|------------|----------|------------|
| Campanas | $490.000 | 2 | - |
| Contenidos | $650.000 | - | 20 |
| **Silver** | **$750.000** | **2** | **20** |
| Gold | $1.200.000 | 4 | 28 |
| Platinum | $1.900.000 | 6 | 44 |

*Precios + IVA | Sin contratos | Inversion en ads adicional*`,
    options: [
      { id: 'plan_silver', label: 'Plan Silver (mas popular)', emoji: '⭐', nextNodeId: 'plan_silver' },
      { id: 'plan_gold', label: 'Plan Gold', emoji: '🥇', nextNodeId: 'plan_gold' },
      { id: 'comparar', label: 'Comparar todos', emoji: '📊', nextNodeId: 'planes_comparar' },
      { id: 'cotizar', label: 'Cotizacion personalizada', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Servicios', nextNodeId: 'servicios_menu' }
    ],
    category: 'planes'
  },

  'plan_silver': {
    id: 'plan_silver',
    type: 'menu',
    text: `**Plan Silver - $750.000 + IVA/mes** ⭐

El mas popular. Campanas + contenido organico.

**CAMPANAS PAGADAS:**
• 2 campanas mensuales
• 6 piezas graficas para ads
• Google, Meta, LinkedIn, TikTok
• Monitoreo y optimizacion continua

**CONTENIDO ORGANICO:**
• 20 contenidos mensuales
  - 8 posts/carruseles
  - 8 stories
  - 4 reels
• Media jornada de grabacion (4-5 capsulas)

**EQUIPO DEDICADO:**
• Paid Media Planner
• Publicista
• Disenador

**INCLUIDO:**
✅ Diagnostico inicial de marca
✅ Benchmarking de competencia
✅ Proyeccion de resultados
✅ Reportes semanales
✅ Reunion mensual
✅ WhatsApp directo
✅ Acceso 24/7 a tus cuentas

*Inversion minima en ads recomendada: $500.000/mes*`,
    options: [
      { id: 'cotizar', label: 'Quiero este plan', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'gold', label: 'Ver Plan Gold', emoji: '🥇', nextNodeId: 'plan_gold' },
      { id: 'comparar', label: 'Comparar planes', emoji: '📊', nextNodeId: 'planes_comparar' },
      { id: 'volver', label: '← Planes', nextNodeId: 'planes_menu' }
    ],
    category: 'planes',
    subcategory: 'silver'
  },

  'plan_gold': {
    id: 'plan_gold',
    type: 'menu',
    text: `**Plan Gold - $1.200.000 + IVA/mes** 🥇

Mas volumen + email marketing.

**CAMPANAS PAGADAS:**
• 4 campanas mensuales
• 6 piezas graficas para ads

**CONTENIDO ORGANICO:**
• 28 contenidos mensuales
  - 16 posts/carruseles
  - 8 stories
  - 4 reels
• Media jornada de grabacion

**EMAIL MARKETING:**
• 2 campanas de email mensuales
• Templates personalizados
• Segmentacion de base

**EQUIPO DEDICADO:**
• Paid Media Planner
• Publicista
• Disenador

**INCLUIDO:**
✅ Todo lo de Silver
✅ Reuniones quincenales
✅ Estrategia de email marketing
✅ Automatizaciones basicas

*Ideal para empresas con base de datos activa*`,
    options: [
      { id: 'cotizar', label: 'Quiero este plan', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'platinum', label: 'Ver Plan Platinum', emoji: '💎', nextNodeId: 'plan_platinum' },
      { id: 'comparar', label: 'Comparar planes', emoji: '📊', nextNodeId: 'planes_comparar' },
      { id: 'volver', label: '← Planes', nextNodeId: 'planes_menu' }
    ],
    category: 'planes',
    subcategory: 'gold'
  },

  'plan_platinum': {
    id: 'plan_platinum',
    type: 'menu',
    text: `**Plan Platinum - $1.900.000 + IVA/mes** 💎

Todo incluido. Presencia digital intensiva.

**CAMPANAS PAGADAS:**
• 6 campanas mensuales
• 10 piezas graficas para ads

**CONTENIDO ORGANICO:**
• 44 contenidos mensuales
  - 28 posts/carruseles
  - 8 stories
  - 8 reels
• Jornada completa de grabacion (8-10 capsulas)

**EMAIL MARKETING:**
• 4 campanas de email mensuales

**ADICIONAL:**
• Gestion de Influencers incluida
• Estrategia de PR digital
• Reportes ejecutivos semanales

**EQUIPO:**
• Equipo dedicado completo
• Account manager exclusivo

*Para empresas que necesitan dominar su industria*`,
    options: [
      { id: 'cotizar', label: 'Quiero este plan', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'comparar', label: 'Comparar planes', emoji: '📊', nextNodeId: 'planes_comparar' },
      { id: 'volver', label: '← Planes', nextNodeId: 'planes_menu' }
    ],
    category: 'planes',
    subcategory: 'platinum'
  },

  'planes_comparar': {
    id: 'planes_comparar',
    type: 'menu',
    text: `**Comparacion de Planes M&P**

| | Campanas | Silver | Gold | Platinum |
|---|:---:|:---:|:---:|:---:|
| **Precio** | $490K | $750K | $1.2M | $1.9M |
| **Campanas ads** | 2 | 2 | 4 | 6 |
| **Piezas graficas** | 6 | 6 | 6 | 10 |
| **Contenidos** | - | 20 | 28 | 44 |
| **Grabacion** | - | 1/2 dia | 1/2 dia | 1 dia |
| **Email marketing** | - | - | 2/mes | 4/mes |
| **Influencers** | - | - | - | ✓ |
| **Reuniones** | Mensual | Mensual | Quincenal | Quincenal |

**TODOS incluyen:**
✅ Diagnostico inicial
✅ Benchmarking
✅ Proyeccion de resultados
✅ Equipo dedicado (2-3 personas)
✅ Acceso a tus cuentas
✅ WhatsApp directo
✅ Sin contratos`,
    options: [
      { id: 'cotizar', label: 'Solicitar cotizacion', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Planes', nextNodeId: 'planes_menu' }
    ],
    category: 'planes',
    subcategory: 'comparar'
  },

  'metodologia_info': {
    id: 'metodologia_info',
    type: 'menu',
    text: `**Como trabaja M&P**

**DIA 1: Plan de trabajo**
• Kick-off call
• Roles y responsabilidades claros
• Entregables definidos
• Accesos y configuraciones

**SEMANA 1: Benchmark + Setup**
• Analisis de competencia
• Auditoria de cuentas existentes
• Setup de tracking
• Estrategia inicial

**SEMANA 2: Lanzamiento**
• Primeras campanas activas
• Primeros contenidos publicados
• Testing de mensajes y audiencias

**SEMANA 3: Optimizacion**
• Ajustes basados en datos
• Nuevas variantes
• Quick wins

**SEMANA 4: Reporte 360°**
• Informe ejecutivo completo
• Benchmark vs competencia
• Plan para el siguiente mes

**COMUNICACION:**
📱 WhatsApp: Respuesta < 2 horas
📧 Email: Respuesta < 24 horas
📊 Reportes: Semanales y mensuales
🗓️ Reuniones: Segun plan

**TRANSPARENCIA:**
• Acceso 24/7 a todas tus cuentas
• Ves exactamente donde va cada peso
• Metricas en tiempo real`,
    options: [
      { id: 'diferencial', label: 'Por que elegirnos', emoji: '⭐', nextNodeId: 'diferencial_info' },
      { id: 'cotizar', label: 'Empezar con M&P', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Servicios', nextNodeId: 'servicios_menu' }
    ],
    category: 'metodologia'
  },

  'diferencial_info': {
    id: 'diferencial_info',
    type: 'menu',
    text: `**Por que elegir M&P**

**✅ TRANSPARENCIA TOTAL**
Acceso 24/7 a todas tus cuentas.
Ves cada peso, cada metrica, cada resultado.
No hay cajas negras.

**✅ SIN CONTRATOS DE PERMANENCIA**
Si no funciona, te vas.
Mes a mes. Sin letras chicas.
(Por eso tenemos 95% de retencion)

**✅ EQUIPO DEDICADO**
3 profesionales trabajando TU cuenta.
No un freelancer compartido entre 50 clientes.
Las mismas personas durante toda la relacion.

**✅ METRICAS DE NEGOCIO REAL**
CPL, CAC, ROAS, ROI.
No impresiones ni likes.
Medimos lo que paga tus cuentas.

**✅ BENCHMARK INCLUIDO**
Cada mes te mostramos que hace tu competencia.
En que canales estan, que mensajes usan, como les va.

**NUMEROS M&P:**
• +200 campanas activas
• 95% retencion de clientes
• ROI promedio +380%
• NPS +70

**CLIENTES:**
Empresas de todos los tamanos: startups, pymes, grandes empresas.
B2B y B2C. +15 industrias diferentes.`,
    options: [
      { id: 'casos', label: 'Ver casos de exito', emoji: '🏆', nextNodeId: 'casos_info' },
      { id: 'cotizar', label: 'Trabajar con M&P', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Servicios', nextNodeId: 'servicios_menu' }
    ],
    category: 'diferencial'
  },

  'casos_info': {
    id: 'casos_info',
    type: 'menu',
    text: `**Casos de Exito M&P**

**🏢 EMPRESA SAAS B2B**
*Software de gestion empresarial*

Desafio: CPL muy alto, leads no calificados
Solucion: Restructuracion de campanas + LinkedIn
Resultado:
• CPL: $45.000 → $22.000 (-51%)
• ROAS: 2x → 5.2x
• Leads calificados: +120%

---

**🛒 E-COMMERCE MODA**
*Tienda de ropa femenina*

Desafio: ROAS bajo, mucho gasto en awareness
Solucion: Catalogo dinamico + remarketing agresivo
Resultado:
• ROAS: 1.8x → 4.3x
• Ventas: +180% en 3 meses
• CAC: -35%

---

**🏥 CLINICA DENTAL**
*Clinica en Santiago*

Desafio: Costo por paciente muy alto
Solucion: Google Search + Google My Business
Resultado:
• Costo/paciente: -40%
• Agenda llena 2 meses adelante
• NPS: 85

---

**🏠 INMOBILIARIA**
*Proyectos de departamentos*

Desafio: CPL alto, baja conversion
Solucion: Funnel completo + retargeting secuenciado
Resultado:
• CPL: $80.000 → $35.000
• Leads calificados: +120%
• Visitas agendadas: +80%`,
    options: [
      { id: 'cotizar', label: 'Quiero resultados asi', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Servicios', nextNodeId: 'servicios_menu' }
    ],
    category: 'casos'
  },

  // ========================================
  // CAPTURA DE LEAD
  // ========================================
  'contacto_lead': {
    id: 'contacto_lead',
    type: 'capture_lead',
    text: `**Hablemos**

Dejame tus datos y un especialista de M&P te contactara en menos de 24 horas.

Te haremos preguntas para entender tu negocio y darte recomendaciones personalizadas (sin compromiso).`,
    captureFields: ['nombre', 'empresa', 'email', 'telefono', 'presupuesto', 'timeline', 'interes'],
    nextNode: 'contacto_confirmacion',
    category: 'conversion',
    subcategory: 'lead'
  },

  'contacto_confirmacion': {
    id: 'contacto_confirmacion',
    type: 'menu',
    text: `**¡Listo! Tus datos fueron enviados** ✅

Un especialista de M&P te contactara en menos de 24 horas habiles.

📧 Revisa tu email, te enviamos una confirmacion.

Mientras tanto, ¿hay algo mas en lo que pueda ayudarte?`,
    options: [
      { id: 'aprender', label: 'Seguir aprendiendo', emoji: '🎓', nextNodeId: 'aprender_menu' },
      { id: 'herramientas', label: 'Usar herramientas', emoji: '🛠️', nextNodeId: 'herramientas_menu' },
      { id: 'finalizar', label: 'Cerrar chat', emoji: '👋', nextNodeId: 'despedida' }
    ],
    category: 'conversion',
    subcategory: 'confirmacion'
  },

  'despedida': {
    id: 'despedida',
    type: 'response',
    text: '',
    response: `**¡Gracias por usar Mutante!** 🚀

Fue un gusto ayudarte. Si necesitas mas, aqui estare.

**Contacto M&P:**
🌐 www.mulleryperez.cl
📧 contacto@mulleryperez.cl
📱 +56 9 9225 8137

¡Exito con tu marketing digital!`,
    nextNode: 'root',
    category: 'cierre'
  }
}

// Funciones auxiliares
export function getNode(nodeId: string): ChatNode | undefined {
  return chatTree[nodeId]
}

export function getRootNode(): ChatNode {
  return chatTree['root']
}

export function getAllCategories(): string[] {
  const categories = new Set<string>()
  Object.values(chatTree).forEach(node => {
    if (node.category) categories.add(node.category)
  })
  return Array.from(categories)
}
