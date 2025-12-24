/**
 * MUTANTE - Asistente IA de Marketing Digital
 * Chatbot inteligente de M&P con utilidades de marketing
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
  // MENU PRINCIPAL - MUTANTE
  // ========================================
  'root': {
    id: 'root',
    type: 'menu',
    text: `Hola! Soy **Mutante**, tu asistente de marketing digital.

Te ayudo con estrategias, tips y herramientas para hacer crecer tu negocio. ¿Que necesitas hoy?`,
    options: [
      { id: 'tips', label: 'Tips de Marketing', emoji: '💡', nextNodeId: 'tips_menu' },
      { id: 'herramientas', label: 'Herramientas Gratis', emoji: '🛠️', nextNodeId: 'herramientas_menu' },
      { id: 'servicios', label: 'Servicios M&P', emoji: '🚀', nextNodeId: 'servicios_menu' },
      { id: 'consulta', label: 'Hacer una consulta', emoji: '❓', nextNodeId: 'consulta_menu' },
      { id: 'contacto', label: 'Hablar con un humano', emoji: '👤', nextNodeId: 'contacto_lead' }
    ],
    category: 'inicio'
  },

  // ========================================
  // RAMA: TIPS DE MARKETING
  // ========================================
  'tips_menu': {
    id: 'tips_menu',
    type: 'menu',
    text: '¿Sobre que tema quieres aprender?',
    options: [
      { id: 'tips_google', label: 'Google Ads', emoji: '🔍', nextNodeId: 'tips_google' },
      { id: 'tips_meta', label: 'Meta Ads (FB/IG)', emoji: '📱', nextNodeId: 'tips_meta' },
      { id: 'tips_contenido', label: 'Contenido organico', emoji: '📝', nextNodeId: 'tips_contenido' },
      { id: 'tips_metricas', label: 'Metricas clave', emoji: '📊', nextNodeId: 'tips_metricas' },
      { id: 'tips_conversion', label: 'Conversion y ventas', emoji: '💰', nextNodeId: 'tips_conversion' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'tips'
  },

  'tips_google': {
    id: 'tips_google',
    type: 'menu',
    text: `**5 Tips de Google Ads que funcionan en Chile 2025:**

1️⃣ **Usa palabras clave negativas**
Excluye "gratis", "como hacer", "curso" para evitar clics basura.

2️⃣ **Segmenta por ubicacion**
Apunta a comunas especificas, no "todo Chile".

3️⃣ **Activa extensiones de llamada**
En Chile la gente prefiere llamar que llenar formularios.

4️⃣ **Bid por dispositivo**
Mobile convierte diferente que desktop. Ajusta ofertas.

5️⃣ **Remarketing agresivo**
El 97% no convierte en la primera visita. Persiguelos.

*¿Quieres que M&P maneje tus campanas de Google Ads?*`,
    options: [
      { id: 'mas_tips', label: 'Mas tips de Google', emoji: '💡', nextNodeId: 'tips_google_avanzado' },
      { id: 'cotizar', label: 'Quiero una cotizacion', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Otros temas', nextNodeId: 'tips_menu' }
    ],
    category: 'tips',
    subcategory: 'google_ads'
  },

  'tips_google_avanzado': {
    id: 'tips_google_avanzado',
    type: 'menu',
    text: `**Tips avanzados de Google Ads:**

🎯 **Performance Max**
Usa assets variados (imagenes, videos, textos). Google optimiza solo.

📈 **Conversion value tracking**
No solo cuentes leads, asignales valor segun ticket promedio.

🔄 **Test de anuncios RSA**
Minimo 3 titulos y 2 descripciones diferentes por grupo.

⏰ **Horarios de conversion**
Revisa cuando convierte tu audiencia y concentra presupuesto ahi.

💳 **Landing pages dedicadas**
Cada campana debe tener su propia landing. No mandes a Home.

*El CPL promedio en Chile para B2B es $15.000-$45.000 CLP*`,
    options: [
      { id: 'calculadora', label: 'Calcular mi CPL ideal', emoji: '🧮', nextNodeId: 'herramientas_menu' },
      { id: 'cotizar', label: 'Cotizar gestion Google Ads', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'tips',
    subcategory: 'google_ads_avanzado'
  },

  'tips_meta': {
    id: 'tips_meta',
    type: 'menu',
    text: `**5 Tips de Meta Ads (Facebook/Instagram) 2025:**

1️⃣ **Advantage+ Shopping**
Para ecommerce, deja que Meta optimice automaticamente.

2️⃣ **Audiencias amplias**
Ya no segmentes tan especifico. El algoritmo encuentra a tu gente.

3️⃣ **Videos cortos (< 15 seg)**
Reels y Stories convierten mejor que imagenes estaticas.

4️⃣ **CBO (Campaign Budget Optimization)**
Deja el presupuesto a nivel campana, no ad set.

5️⃣ **UGC (User Generated Content)**
Contenido "casero" supera a creatividades ultra producidas.

*El CTR promedio en Meta para Chile es 1.5%-3%*`,
    options: [
      { id: 'tipos_campana', label: 'Tipos de campana', emoji: '📊', nextNodeId: 'tips_meta_tipos' },
      { id: 'cotizar', label: 'Cotizar gestion Meta Ads', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Otros temas', nextNodeId: 'tips_menu' }
    ],
    category: 'tips',
    subcategory: 'meta_ads'
  },

  'tips_meta_tipos': {
    id: 'tips_meta_tipos',
    type: 'menu',
    text: `**Tipos de campana en Meta y cuando usarlas:**

🎯 **Conversiones**
Para generar leads o ventas. Necesitas pixel instalado.

📢 **Reconocimiento**
Para branding. Bajo CPM pero sin conversion directa.

🔄 **Remarketing**
Para quienes ya visitaron tu web. El ROAS mas alto.

🛒 **Catalogo**
Para ecommerce. Muestra productos automaticamente.

📹 **Video Views**
Para calentar audiencias frias antes de vender.

💬 **Mensajes**
Para generar conversaciones en WhatsApp o Messenger.

*Recomendacion: empieza con Conversiones + Remarketing*`,
    options: [
      { id: 'cotizar', label: 'Quiero implementar esto', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'tips',
    subcategory: 'meta_tipos'
  },

  'tips_contenido': {
    id: 'tips_contenido',
    type: 'menu',
    text: `**Tips de contenido organico que funciona:**

📅 **Frecuencia ideal**
- Instagram: 4-5 posts/semana + stories diarias
- LinkedIn: 3-4 posts/semana
- TikTok: 1 video/dia minimo

🎬 **Formatos que funcionan en 2025**
- Carruseles educativos (10 slides)
- Reels < 30 segundos
- Behind the scenes
- Memes de nicho

✍️ **Copywriting**
- Hook en primera linea
- Usa numeros (7 tips, 3 errores)
- CTA claro al final
- Emojis con moderacion

*El engagement rate promedio en Chile es 2-4%*`,
    options: [
      { id: 'calendario', label: 'Como hacer calendario', emoji: '📆', nextNodeId: 'tips_calendario' },
      { id: 'cotizar', label: 'Cotizar gestion de RRSS', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Otros temas', nextNodeId: 'tips_menu' }
    ],
    category: 'tips',
    subcategory: 'contenido'
  },

  'tips_calendario': {
    id: 'tips_calendario',
    type: 'menu',
    text: `**Como armar un calendario de contenido:**

**Paso 1: Define pilares (3-5 temas)**
- Educativo (ensenar algo)
- Entretenimiento (memes, trends)
- Venta (productos/servicios)
- Autoridad (casos, testimonios)
- Comunidad (interaccion)

**Paso 2: Distribuye por semana**
Lunes: Educativo
Miercoles: Entretenimiento
Viernes: Venta

**Paso 3: Batch content**
Dedica 1 dia a grabar todo el mes.

**Paso 4: Programa**
Usa Meta Business Suite o Later.

*En M&P creamos 20-44 contenidos mensuales*`,
    options: [
      { id: 'cotizar', label: 'Quiero que M&P lo haga', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'tips',
    subcategory: 'calendario'
  },

  'tips_metricas': {
    id: 'tips_metricas',
    type: 'menu',
    text: `**Las metricas que realmente importan:**

✅ **CPL (Costo por Lead)**
Cuanto pagas por cada contacto. El norte de toda campana.

✅ **CPA (Costo por Adquisicion)**
Cuanto pagas por cada cliente real.

✅ **ROAS (Return on Ad Spend)**
Por cada peso invertido, cuanto vuelve. Minimo 3x.

✅ **CAC (Costo Adquisicion Cliente)**
CPL + costos de venta. El costo real de un cliente.

✅ **LTV (Lifetime Value)**
Cuanto vale un cliente en toda su vida.

**Formula clave:** LTV > 3x CAC

❌ **Metricas vanidad (ignoralas):**
Likes, impresiones, alcance sin contexto.`,
    options: [
      { id: 'calculadora', label: 'Calcular mis metricas', emoji: '🧮', nextNodeId: 'herramientas_menu' },
      { id: 'auditoria', label: 'Quiero una auditoria', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Otros temas', nextNodeId: 'tips_menu' }
    ],
    category: 'tips',
    subcategory: 'metricas'
  },

  'tips_conversion': {
    id: 'tips_conversion',
    type: 'menu',
    text: `**Tips para mejorar la conversion:**

🎯 **Landing pages**
- 1 objetivo por landing
- CTA above the fold
- Testimonios visibles
- Formulario corto (3-5 campos)

⚡ **Velocidad**
Cada segundo de carga = -7% conversion.

📱 **Mobile first**
70%+ del trafico es mobile. Optimiza ahi.

🔥 **Urgencia**
"Solo hoy", "Ultimos cupos" funciona.

💬 **WhatsApp**
En Chile convierte mejor que formularios.

🔄 **Remarketing**
Persigue a quien no convirtio. Insiste.

*Conversion rate promedio en Chile: 2-5%*`,
    options: [
      { id: 'auditoria', label: 'Auditar mi landing', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Otros temas', nextNodeId: 'tips_menu' }
    ],
    category: 'tips',
    subcategory: 'conversion'
  },

  // ========================================
  // RAMA: HERRAMIENTAS GRATIS
  // ========================================
  'herramientas_menu': {
    id: 'herramientas_menu',
    type: 'menu',
    text: `**Herramientas gratuitas de M&P Labs:**

Desarrollamos herramientas para ayudarte con tu marketing digital. Todas gratis y sin registro.`,
    options: [
      { id: 'buyer_gen', label: 'Buyer Gen - Personas', emoji: '👤', nextNodeId: 'tool_buyer_gen' },
      { id: 'mp_predictor', label: 'MP Predictor - ROI', emoji: '📈', nextNodeId: 'tool_predictor' },
      { id: 'calculadora', label: 'Calculadora CPL/ROAS', emoji: '🧮', nextNodeId: 'tool_calculadora' },
      { id: 'benchmarks', label: 'Benchmarks Chile 2025', emoji: '📊', nextNodeId: 'benchmarks_menu' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'herramientas'
  },

  'tool_buyer_gen': {
    id: 'tool_buyer_gen',
    type: 'menu',
    text: `**Buyer Gen - Generador de Buyer Personas**

Crea perfiles detallados de tus clientes ideales en 4 pasos:

✅ Selecciona tu industria
✅ Define tu modelo de negocio
✅ Recibe 3 buyer personas
✅ Obtiene keywords, KPIs y estrategia

**Incluye:**
• Benchmarks Chile 2025
• Recomendaciones de canales
• Estrategia de contenido
• Exportar a PDF

*Herramienta 100% gratis*`,
    options: [
      { id: 'usar', label: 'Usar Buyer Gen', emoji: '🚀', nextNodeId: 'link_buyer_gen' },
      { id: 'volver', label: '← Otras herramientas', nextNodeId: 'herramientas_menu' }
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
    category: 'herramientas',
    subcategory: 'buyer_gen_link'
  },

  'tool_predictor': {
    id: 'tool_predictor',
    type: 'menu',
    text: `**MP Predictor - Proyeccion de ROI**

Simula el rendimiento de tus campanas antes de invertir:

✅ Ingresa tu presupuesto
✅ Selecciona industria y plataforma
✅ Recibe proyeccion de leads
✅ Calcula tu ROI esperado

**Usa datos reales de:**
• +200 campanas en Chile
• Benchmarks actualizados 2025
• Ajustado por industria

*Ideal para planificar inversiones*`,
    options: [
      { id: 'usar', label: 'Usar MP Predictor', emoji: '🚀', nextNodeId: 'link_predictor' },
      { id: 'volver', label: '← Otras herramientas', nextNodeId: 'herramientas_menu' }
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
    category: 'herramientas',
    subcategory: 'predictor_link'
  },

  'tool_calculadora': {
    id: 'tool_calculadora',
    type: 'menu',
    text: `**Calculadora rapida de metricas:**

Dime tu industria y te doy los benchmarks:

**B2B Software/Tech:**
• CPL: $15.000-$45.000
• CTR: 2.5%-4%
• Conversion: 3%-8%

**E-commerce:**
• CPL: $2.000-$8.000
• CTR: 1%-2.5%
• ROAS minimo: 3x

**Servicios profesionales:**
• CPL: $12.000-$40.000
• CTR: 2%-4%
• Conversion: 3%-8%

*Estos son promedios Chile 2025*`,
    options: [
      { id: 'benchmarks', label: 'Ver todas las industrias', emoji: '📊', nextNodeId: 'benchmarks_menu' },
      { id: 'consulta', label: 'Consultar mi caso', emoji: '❓', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Otras herramientas', nextNodeId: 'herramientas_menu' }
    ],
    category: 'herramientas',
    subcategory: 'calculadora'
  },

  'benchmarks_menu': {
    id: 'benchmarks_menu',
    type: 'menu',
    text: '¿Que industria te interesa?',
    options: [
      { id: 'bench_tech', label: 'Tecnologia/SaaS', nextNodeId: 'bench_tech' },
      { id: 'bench_ecommerce', label: 'E-commerce', nextNodeId: 'bench_ecommerce' },
      { id: 'bench_salud', label: 'Salud/Medicina', nextNodeId: 'bench_salud' },
      { id: 'bench_inmobiliaria', label: 'Inmobiliaria', nextNodeId: 'bench_inmobiliaria' },
      { id: 'bench_servicios', label: 'Servicios B2B', nextNodeId: 'bench_servicios' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'benchmarks'
  },

  'bench_tech': {
    id: 'bench_tech',
    type: 'response',
    text: '',
    response: `**Benchmarks Tecnologia/SaaS Chile 2025:**

📊 **Google Ads**
• CPL: $15.000 - $45.000
• CTR: 2.5% - 4%
• Conversion: 3% - 8%

📱 **Meta Ads**
• CPL: $8.000 - $25.000
• CTR: 0.8% - 1.5%
• Conversion: 2% - 5%

💼 **LinkedIn**
• CPL: $25.000 - $60.000
• CTR: 0.4% - 0.8%
• Conversion: 5% - 12%

**KPIs clave:** CAC, MRR, Churn Rate, NPS

**Canales recomendados:** LinkedIn Ads + Google Search + Webinars`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks',
    subcategory: 'tech'
  },

  'bench_ecommerce': {
    id: 'bench_ecommerce',
    type: 'response',
    text: '',
    response: `**Benchmarks E-commerce Chile 2025:**

📊 **Google Shopping**
• CPC: $150 - $400
• CTR: 1% - 2%
• ROAS minimo: 3x

📱 **Meta Ads**
• CPL: $2.000 - $8.000
• CTR: 1% - 2.5%
• ROAS: 2x - 5x

🎵 **TikTok Ads**
• CPL: $1.500 - $5.000
• CTR: 1.5% - 3%
• Engagement: Alto

**KPIs clave:** ROAS, CPA, Ticket promedio, Abandono carrito

**Canales recomendados:** Meta Ads + Google Shopping + Influencers`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks',
    subcategory: 'ecommerce'
  },

  'bench_salud': {
    id: 'bench_salud',
    type: 'response',
    text: '',
    response: `**Benchmarks Salud/Medicina Chile 2025:**

📊 **Google Ads**
• CPL: $8.000 - $25.000
• CTR: 3% - 6%
• Conversion: 5% - 12%

📱 **Meta Ads**
• CPL: $5.000 - $15.000
• CTR: 1.5% - 3%
• Conversion: 3% - 8%

**KPIs clave:** Costo por paciente, Show rate, NPS

**Canales recomendados:** Google Search + Meta Ads + Google My Business

**Importante:** Cumplir regulaciones de publicidad de salud.`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks',
    subcategory: 'salud'
  },

  'bench_inmobiliaria': {
    id: 'bench_inmobiliaria',
    type: 'response',
    text: '',
    response: `**Benchmarks Inmobiliaria Chile 2025:**

📊 **Google Ads**
• CPL: $20.000 - $80.000
• CTR: 1.5% - 3%
• Conversion: 1% - 3%

📱 **Meta Ads**
• CPL: $15.000 - $50.000
• CTR: 1% - 2%
• Conversion: 1% - 2%

🏠 **Portales (Portal Inmobiliario, Yapo)**
• CPL: $10.000 - $30.000

**KPIs clave:** Costo por visita, Tiempo de cierre, ROI por proyecto

**Canales recomendados:** Google Search + Meta Ads + Portales + Email a inversionistas`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks',
    subcategory: 'inmobiliaria'
  },

  'bench_servicios': {
    id: 'bench_servicios',
    type: 'response',
    text: '',
    response: `**Benchmarks Servicios B2B Chile 2025:**

📊 **Google Ads**
• CPL: $12.000 - $40.000
• CTR: 2% - 4%
• Conversion: 3% - 8%

💼 **LinkedIn Ads**
• CPL: $20.000 - $50.000
• CTR: 0.4% - 0.8%
• Conversion: 5% - 10%

📧 **Email Marketing**
• Open rate: 20% - 30%
• Click rate: 2% - 5%

**KPIs clave:** CPL calificado, Tasa de cierre, Ticket promedio

**Canales recomendados:** LinkedIn + Google Search + Email nurturing + Webinars`,
    nextNode: 'benchmarks_menu',
    category: 'benchmarks',
    subcategory: 'servicios'
  },

  // ========================================
  // RAMA: SERVICIOS M&P
  // ========================================
  'servicios_menu': {
    id: 'servicios_menu',
    type: 'menu',
    text: `**Servicios de M&P:**

Somos una agencia de marketing digital enfocada en performance. Esto es lo que hacemos:`,
    options: [
      { id: 'planes', label: 'Planes mensuales', emoji: '📋', nextNodeId: 'planes_menu' },
      { id: 'metodologia', label: 'Como trabajamos', emoji: '🧠', nextNodeId: 'metodologia_info' },
      { id: 'diferencial', label: 'Por que M&P', emoji: '⭐', nextNodeId: 'diferencial_info' },
      { id: 'casos', label: 'Casos de exito', emoji: '🏆', nextNodeId: 'casos_info' },
      { id: 'cotizar', label: 'Pedir cotizacion', emoji: '💰', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'servicios'
  },

  'planes_menu': {
    id: 'planes_menu',
    type: 'menu',
    text: `**Planes M&P 2025:**

| Plan | Precio | Campanas | Contenidos |
|------|--------|----------|------------|
| Campanas | $490K | 2 | - |
| Contenidos | $650K | - | 20 |
| Silver | $750K | 2 | 20 |
| Gold | $1.2M | 4 | 28 |
| Platinum | $1.9M | 6 | 44 |

*Precios + IVA. Sin contratos de permanencia.*

¿Cual te interesa conocer?`,
    options: [
      { id: 'plan_campanas', label: 'Plan Campanas', nextNodeId: 'plan_campanas' },
      { id: 'plan_silver', label: 'Plan Silver ⭐', nextNodeId: 'plan_silver' },
      { id: 'plan_gold', label: 'Plan Gold', nextNodeId: 'plan_gold' },
      { id: 'comparar', label: 'Comparar todos', nextNodeId: 'planes_comparar' },
      { id: 'volver', label: '← Menu servicios', nextNodeId: 'servicios_menu' }
    ],
    category: 'planes'
  },

  'plan_campanas': {
    id: 'plan_campanas',
    type: 'menu',
    text: `**Plan Campanas - $490.000 + IVA/mes**

Solo publicidad pagada, sin contenido organico.

**Incluye:**
• 2 campanas mensuales
• 6 piezas graficas
• Google Ads, Meta, LinkedIn, TikTok
• Monitoreo y optimizacion
• Reuniones mensuales
• Equipo: Paid Media + Disenador

**Tambien:**
• Diagnostico inicial
• Benchmarking
• Proyeccion al 3er mes

*Ideal si ya tienes contenido y solo necesitas ads.*`,
    options: [
      { id: 'cotizar', label: 'Cotizar este plan', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'otros', label: 'Ver otros planes', nextNodeId: 'planes_menu' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'planes',
    subcategory: 'plan_campanas'
  },

  'plan_silver': {
    id: 'plan_silver',
    type: 'menu',
    text: `**Plan Silver - $750.000 + IVA/mes** ⭐ Mas popular

Campanas + contenido organico. El combo completo.

**Campanas Pagadas:**
• 2 campanas mensuales
• 6 piezas graficas

**Contenido Organico:**
• 20 contenidos (8 posts, 8 stories, 4 reels)
• Media jornada de grabacion

**Incluye:**
• Equipo de 3 personas dedicado
• Diagnostico, benchmarking, proyecciones
• Reuniones mensuales
• Acceso 24/7 a tus cuentas

*El mas elegido por empresas que estan partiendo.*`,
    options: [
      { id: 'cotizar', label: 'Cotizar este plan', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'otros', label: 'Ver otros planes', nextNodeId: 'planes_menu' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'planes',
    subcategory: 'plan_silver'
  },

  'plan_gold': {
    id: 'plan_gold',
    type: 'menu',
    text: `**Plan Gold - $1.200.000 + IVA/mes**

Mas volumen + email marketing.

**Campanas Pagadas:**
• 4 campanas mensuales
• 6 piezas graficas

**Contenido Organico:**
• 28 contenidos (16 posts, 8 stories, 4 reels)
• Media jornada de grabacion

**Email Marketing:**
• 2 campanas de email/mes

**Incluye:**
• Reuniones quincenales
• Equipo dedicado de 3 personas

*Para empresas en crecimiento con base de datos activa.*`,
    options: [
      { id: 'cotizar', label: 'Cotizar este plan', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'platinum', label: 'Ver Plan Platinum', nextNodeId: 'plan_platinum' },
      { id: 'otros', label: 'Ver otros planes', nextNodeId: 'planes_menu' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'planes',
    subcategory: 'plan_gold'
  },

  'plan_platinum': {
    id: 'plan_platinum',
    type: 'menu',
    text: `**Plan Platinum - $1.900.000 + IVA/mes**

El plan mas completo. Todo incluido.

**Campanas Pagadas:**
• 6 campanas mensuales
• 10 piezas graficas

**Contenido Organico:**
• 44 contenidos (28 posts, 8 stories, 8 reels)
• Jornada completa de grabacion

**Email Marketing:**
• 4 campanas de email/mes

**Adicional:**
• Gestion de Influencers
• Reuniones quincenales

*Para empresas que necesitan presencia intensiva.*`,
    options: [
      { id: 'cotizar', label: 'Cotizar este plan', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'otros', label: 'Ver otros planes', nextNodeId: 'planes_menu' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'planes',
    subcategory: 'plan_platinum'
  },

  'planes_comparar': {
    id: 'planes_comparar',
    type: 'menu',
    text: `**Comparacion de Planes M&P:**

| | Campanas | Silver | Gold | Platinum |
|---|:---:|:---:|:---:|:---:|
| **Precio** | $490K | $750K | $1.2M | $1.9M |
| **Campanas** | 2 | 2 | 4 | 6 |
| **Contenidos** | - | 20 | 28 | 44 |
| **Email** | - | - | 2 | 4 |
| **Grabacion** | - | 1/2 dia | 1/2 dia | 1 dia |
| **Reuniones** | Mensual | Mensual | Quincenal | Quincenal |
| **Influencers** | - | - | - | ✓ |

*Todos incluyen: Diagnostico, Benchmarking, Equipo dedicado, Acceso a cuentas.*`,
    options: [
      { id: 'cotizar', label: 'Solicitar cotizacion', emoji: '📋', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'planes',
    subcategory: 'comparacion'
  },

  'metodologia_info': {
    id: 'metodologia_info',
    type: 'menu',
    text: `**Como trabaja M&P:**

**Dia 1:** Plan de trabajo
Roles claros, entregables definidos.

**Semana 1:** Benchmark + Setup
Analisis de mercado y configuracion.

**Semana 2:** Lanzamiento
Campanas activas, testeo inicial.

**Semana 3:** Optimizacion
Ajustes segun datos reales.

**Semana 4:** Reporte 360°
Informe completo + plan siguiente mes.

**Comunicacion:**
• WhatsApp directo (respuesta < 2hrs)
• Reportes semanales y mensuales
• Reuniones de seguimiento`,
    options: [
      { id: 'diferencial', label: 'Por que elegirnos', emoji: '⭐', nextNodeId: 'diferencial_info' },
      { id: 'cotizar', label: 'Empezar con M&P', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu servicios', nextNodeId: 'servicios_menu' }
    ],
    category: 'metodologia'
  },

  'diferencial_info': {
    id: 'diferencial_info',
    type: 'menu',
    text: `**Por que elegir M&P:**

✅ **Transparencia total**
Acceso 24/7 a tus cuentas. Ves todo.

✅ **Sin contratos**
Si no funciona, te vas cuando quieras.

✅ **Equipo dedicado**
3 profesionales trabajando tu cuenta.

✅ **Metricas reales**
CPL, CAC, ROAS. No likes ni impresiones.

✅ **Benchmark incluido**
Cada mes vs tu competencia.

**Numeros:**
• +200 campanas activas
• 95% retencion de clientes
• ROI promedio +380%`,
    options: [
      { id: 'casos', label: 'Ver casos de exito', emoji: '🏆', nextNodeId: 'casos_info' },
      { id: 'cotizar', label: 'Quiero trabajar con M&P', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu servicios', nextNodeId: 'servicios_menu' }
    ],
    category: 'diferencial'
  },

  'casos_info': {
    id: 'casos_info',
    type: 'menu',
    text: `**Casos de exito M&P:**

🏢 **Empresa SaaS B2B**
CPL de $45K a $22K (-51%)
ROAS de 2x a 5.2x

🛒 **E-commerce moda**
ROAS de 1.8x a 4.3x
+180% ventas en 3 meses

🏥 **Clinica dental**
Costo por paciente -40%
Agenda llena 2 meses

🏠 **Inmobiliaria**
CPL de $80K a $35K
+120% leads calificados

*Resultados reales de clientes activos.*

[Ver mas casos en web →](https://www.mulleryperez.cl/casos)`,
    options: [
      { id: 'cotizar', label: 'Quiero resultados asi', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu servicios', nextNodeId: 'servicios_menu' }
    ],
    category: 'casos'
  },

  // ========================================
  // RAMA: CONSULTAS
  // ========================================
  'consulta_menu': {
    id: 'consulta_menu',
    type: 'menu',
    text: '¿Que tipo de consulta tienes?',
    options: [
      { id: 'consulta_presupuesto', label: 'Cuanto deberia invertir', emoji: '💰', nextNodeId: 'consulta_presupuesto' },
      { id: 'consulta_canal', label: 'Que canal me conviene', emoji: '📢', nextNodeId: 'consulta_canal' },
      { id: 'consulta_tiempo', label: 'En cuanto vere resultados', emoji: '⏱️', nextNodeId: 'consulta_tiempo' },
      { id: 'consulta_otra', label: 'Otra consulta', emoji: '💬', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Menu principal', nextNodeId: 'root' }
    ],
    category: 'consultas'
  },

  'consulta_presupuesto': {
    id: 'consulta_presupuesto',
    type: 'menu',
    text: `**¿Cuanto deberia invertir en marketing digital?**

**Regla general:**
• Empresas nuevas: 10-15% de ingresos
• Empresas establecidas: 5-10% de ingresos
• Fase de crecimiento agresivo: 15-20%

**Inversion minima recomendada en ads:**
• Google Ads: $400.000/mes
• Meta Ads: $300.000/mes
• LinkedIn: $500.000/mes

**Formula practica:**
Si tu ticket promedio es $100.000 y quieres 10 clientes nuevos al mes con un CPL de $20.000 y conversion del 20%:
• Necesitas 50 leads
• Inversion: 50 x $20.000 = $1.000.000/mes

*Lo ideal es calcularlo con tus numeros reales.*`,
    options: [
      { id: 'calculadora', label: 'Usar MP Predictor', emoji: '🧮', nextNodeId: 'tool_predictor' },
      { id: 'asesoria', label: 'Asesorarme con M&P', emoji: '👤', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Otras consultas', nextNodeId: 'consulta_menu' }
    ],
    category: 'consultas',
    subcategory: 'presupuesto'
  },

  'consulta_canal': {
    id: 'consulta_canal',
    type: 'menu',
    text: `**¿Que canal de marketing me conviene?**

**Si vendes B2B (a empresas):**
• LinkedIn Ads (decision makers)
• Google Search (busqueda activa)
• Email marketing (nurturing)

**Si vendes B2C (consumidor final):**
• Meta Ads (FB/IG) para discovery
• Google Search para intencion
• TikTok para awareness

**Si tienes e-commerce:**
• Google Shopping (obligatorio)
• Meta con catalogo
• Remarketing en ambas

**Si tienes ticket alto (>$500K):**
• LinkedIn + Google
• Webinars
• Contenido de autoridad

**Si tienes ticket bajo (<$50K):**
• Meta Ads + Google Shopping
• Influencers
• Remarketing agresivo`,
    options: [
      { id: 'asesoria', label: 'Analizar mi caso', emoji: '🔍', nextNodeId: 'contacto_lead' },
      { id: 'benchmarks', label: 'Ver benchmarks', emoji: '📊', nextNodeId: 'benchmarks_menu' },
      { id: 'volver', label: '← Otras consultas', nextNodeId: 'consulta_menu' }
    ],
    category: 'consultas',
    subcategory: 'canal'
  },

  'consulta_tiempo': {
    id: 'consulta_tiempo',
    type: 'menu',
    text: `**¿En cuanto tiempo vere resultados?**

**Google Ads:**
• Primeros leads: 1-2 semanas
• Optimizacion: 4-6 semanas
• Resultados estables: 2-3 meses

**Meta Ads:**
• Primeros resultados: 1-2 semanas
• Aprendizaje algoritmo: 2-4 semanas
• Escala: 2-3 meses

**SEO/Contenido organico:**
• Primeros resultados: 3-6 meses
• Traccion real: 6-12 meses

**Email Marketing:**
• Primeras campanas: inmediato
• Resultados consistentes: 2-3 meses

**Factores que afectan:**
• Presupuesto
• Competencia
• Calidad del producto/servicio
• Landing pages
• Seguimiento comercial`,
    options: [
      { id: 'empezar', label: 'Quiero empezar ya', emoji: '🚀', nextNodeId: 'contacto_lead' },
      { id: 'volver', label: '← Otras consultas', nextNodeId: 'consulta_menu' }
    ],
    category: 'consultas',
    subcategory: 'tiempo'
  },

  // ========================================
  // CAPTURA DE LEAD
  // ========================================
  'contacto_lead': {
    id: 'contacto_lead',
    type: 'capture_lead',
    text: `**Dejame tus datos**

Completa el formulario y un especialista de M&P te contactara en menos de 24 horas.

*Tu informacion es confidencial.*`,
    captureFields: ['nombre', 'empresa', 'email', 'telefono', 'interes'],
    nextNode: 'contacto_confirmacion',
    category: 'conversion',
    subcategory: 'captura_lead'
  },

  'contacto_confirmacion': {
    id: 'contacto_confirmacion',
    type: 'menu',
    text: `**¡Listo! Tus datos fueron enviados**

Un especialista de M&P te contactara en menos de 24 horas habiles.

📧 Tambien recibiras un email de confirmacion.

¿Hay algo mas en lo que pueda ayudarte mientras tanto?`,
    options: [
      { id: 'tips', label: 'Ver tips de marketing', emoji: '💡', nextNodeId: 'tips_menu' },
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
    response: `**¡Gracias por usar Mutante!**

Si necesitas mas ayuda, aqui estare.

🌐 www.mulleryperez.cl
📧 contacto@mulleryperez.cl
📱 +56 9 9225 8137

¡Exito con tu marketing! 🚀`,
    nextNode: 'root',
    category: 'cierre',
    subcategory: 'despedida'
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
