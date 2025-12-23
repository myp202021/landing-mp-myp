/**
 * M&P ChatBot - Árbol de Decisión y FAQs
 * INFORMACIÓN REAL basada en PDF Comercial 2025 y www.mulleryperez.cl
 */

export interface ChatNode {
  id: string
  type: 'menu' | 'response' | 'capture_lead'
  text: string
  options?: ChatOption[]
  response?: string
  nextNode?: string
  captureFields?: string[]
  category?: string
  subcategory?: string
}

export interface ChatOption {
  id: string
  label: string
  emoji?: string
  nextNodeId: string
}

export const chatTree: Record<string, ChatNode> = {
  // ========================================
  // MENÚ PRINCIPAL
  // ========================================
  'root': {
    id: 'root',
    type: 'menu',
    text: 'Hola, soy el asistente de M&P. ¿En qué te puedo ayudar?',
    options: [
      { id: 'planes', label: 'Planes y servicios', emoji: '📌', nextNodeId: 'planes_menu' },
      { id: 'precios', label: 'Precios', emoji: '💰', nextNodeId: 'precios_menu' },
      { id: 'metodologia', label: 'Cómo trabajamos', emoji: '🧠', nextNodeId: 'metodologia_menu' },
      { id: 'equipo', label: 'Equipo M&P', emoji: '👥', nextNodeId: 'equipo_info' },
      { id: 'contacto', label: 'Contactar a M&P', emoji: '📞', nextNodeId: 'contacto_menu' }
    ],
    category: 'inicio'
  },

  // ========================================
  // RAMA: PLANES Y SERVICIOS
  // ========================================
  'planes_menu': {
    id: 'planes_menu',
    type: 'menu',
    text: 'Tenemos 5 planes según tus necesidades:',
    options: [
      { id: 'plan_campanas', label: 'Plan Campañas ($490.000)', nextNodeId: 'plan_campanas' },
      { id: 'plan_contenidos', label: 'Plan Contenidos ($650.000)', nextNodeId: 'plan_contenidos' },
      { id: 'plan_silver', label: 'Plan Silver ($750.000)', nextNodeId: 'plan_silver' },
      { id: 'plan_gold', label: 'Plan Gold ($1.200.000)', nextNodeId: 'plan_gold' },
      { id: 'plan_platinum', label: 'Plan Platinum ($1.900.000)', nextNodeId: 'plan_platinum' },
      { id: 'volver', label: '← Volver', nextNodeId: 'root' }
    ],
    category: 'planes'
  },

  'plan_campanas': {
    id: 'plan_campanas',
    type: 'response',
    text: '',
    response: `**Plan Campañas - $490.000 + IVA/mes**

Ideal para empresas que necesitan solo publicidad pagada.

**Incluye:**
• Hasta 2 campañas mensuales
• Máximo 6 piezas gráficas
• Plataformas: Google Ads, Meta, LinkedIn, TikTok
• Monitoreo y ajustes según KPIs
• Reuniones mensuales
• Equipo: Paid Media + Diseñador

**También incluye:**
• Diagnóstico inicial de marca
• Análisis de palabras clave y competencia
• Benchmarking
• Definición de objetivos
• Proyección de rendimiento al tercer mes

*Landing pages se cotizan aparte si es necesario.*`,
    nextNode: 'planes_menu',
    category: 'planes',
    subcategory: 'plan_campanas'
  },

  'plan_contenidos': {
    id: 'plan_contenidos',
    type: 'response',
    text: '',
    response: `**Plan Contenidos - $650.000 + IVA/mes**

Ideal para gestión de redes sociales orgánicas.

**Incluye:**
• 20 contenidos orgánicos al mes:
  - 8 Posts o Carruseles
  - 8 Stories
  - 4 Reels
• Media jornada mensual de grabación (4-5 cápsulas)
• Gestión de Instagram y Facebook
• Reuniones quincenales
• Equipo: Publicista + Diseñador

**También incluye:**
• Diagnóstico inicial de marca
• Benchmarking de competencia
• Definición de objetivos y estrategias
• Proyección de rendimiento al tercer mes

*No incluye campañas de publicidad pagada.*`,
    nextNode: 'planes_menu',
    category: 'planes',
    subcategory: 'plan_contenidos'
  },

  'plan_silver': {
    id: 'plan_silver',
    type: 'response',
    text: '',
    response: `**Plan Silver - $750.000 + IVA/mes**

Combina campañas pagadas + contenido orgánico.

**Campañas Pagadas:**
• Hasta 2 campañas mensuales
• 6 piezas gráficas para ads
• Google Ads, Meta, LinkedIn, TikTok

**Contenido Orgánico:**
• 20 contenidos mensuales (8 posts, 8 stories, 4 reels)
• Media jornada de grabación (4-5 cápsulas)

**Incluye:**
• Monitoreo y optimización constante
• Reuniones mensuales
• Equipo completo: Paid Media + Publicista + Diseñador
• Diagnóstico, benchmarking y proyecciones

*Es nuestro plan más popular para empresas que están partiendo.*`,
    nextNode: 'planes_menu',
    category: 'planes',
    subcategory: 'plan_silver'
  },

  'plan_gold': {
    id: 'plan_gold',
    type: 'response',
    text: '',
    response: `**Plan Gold - $1.200.000 + IVA/mes**

Para empresas que necesitan más volumen y email marketing.

**Campañas Pagadas:**
• Hasta 4 campañas mensuales
• 6 piezas gráficas para ads

**Contenido Orgánico:**
• 28 contenidos mensuales (16 posts, 8 stories, 4 reels)
• Media jornada de grabación (4-5 cápsulas)

**Email Marketing:**
• 2 campañas de email mensuales

**Incluye:**
• Reuniones quincenales
• Equipo completo: Paid Media + Publicista + Diseñador
• Diagnóstico, benchmarking y proyecciones

*Ideal para empresas en crecimiento con base de datos activa.*`,
    nextNode: 'planes_menu',
    category: 'planes',
    subcategory: 'plan_gold'
  },

  'plan_platinum': {
    id: 'plan_platinum',
    type: 'response',
    text: '',
    response: `**Plan Platinum - $1.900.000 + IVA/mes**

Nuestro plan más completo para empresas grandes.

**Campañas Pagadas:**
• Hasta 6 campañas mensuales
• 10 piezas gráficas para ads

**Contenido Orgánico:**
• 44 contenidos mensuales (28 posts, 8 stories, 8 reels)
• Jornada completa de grabación (8-10 cápsulas)

**Email Marketing:**
• 4 campañas de email mensuales

**Adicional:**
• Gestión de Influencers incluida
• Reuniones quincenales
• Equipo completo dedicado

*Para empresas que necesitan presencia digital intensiva.*`,
    nextNode: 'planes_menu',
    category: 'planes',
    subcategory: 'plan_platinum'
  },

  // ========================================
  // RAMA: PRECIOS
  // ========================================
  'precios_menu': {
    id: 'precios_menu',
    type: 'menu',
    text: '¿Qué quieres saber sobre precios?',
    options: [
      { id: 'precios_resumen', label: 'Resumen de precios', nextNodeId: 'precios_resumen' },
      { id: 'precios_inversion', label: '¿Qué incluye el precio?', nextNodeId: 'precios_incluye' },
      { id: 'precios_ads', label: '¿Y la inversión en ads?', nextNodeId: 'precios_ads' },
      { id: 'volver', label: '← Volver', nextNodeId: 'root' }
    ],
    category: 'precios'
  },

  'precios_resumen': {
    id: 'precios_resumen',
    type: 'response',
    text: '',
    response: `**Precios M&P 2025 (fee mensual + IVA)**

| Plan | Precio | Campañas | Contenidos |
|------|--------|----------|------------|
| Campañas | $490.000 | 2 | - |
| Contenidos | $650.000 | - | 20 |
| Silver | $750.000 | 2 | 20 |
| Gold | $1.200.000 | 4 | 28 |
| Platinum | $1.900.000 | 6 | 44 |

**Importante:**
• Estos precios son el fee de agencia
• La inversión en publicidad (ads) es adicional
• Sin contratos de permanencia
• Puedes cancelar cuando quieras`,
    nextNode: 'precios_menu',
    category: 'precios',
    subcategory: 'resumen'
  },

  'precios_incluye': {
    id: 'precios_incluye',
    type: 'response',
    text: '',
    response: `**Todos los planes incluyen:**

✅ Diagnóstico inicial de marca
✅ Análisis de palabras clave y competencia
✅ Benchmarking (qué hace tu competencia)
✅ Definición de objetivos y estrategias
✅ Proyección de rendimiento al tercer mes
✅ Equipo dedicado (2-3 profesionales)
✅ Acceso 24/7 a tus cuentas publicitarias
✅ Reportería con métricas de negocio real
✅ Comunicación directa por WhatsApp

**No incluido:**
❌ Inversión en publicidad (va directo a Google/Meta)
❌ Landing pages (se cotizan aparte)
❌ Producción audiovisual extra`,
    nextNode: 'precios_menu',
    category: 'precios',
    subcategory: 'incluye'
  },

  'precios_ads': {
    id: 'precios_ads',
    type: 'response',
    text: '',
    response: `**Sobre la inversión en publicidad:**

El fee de M&P es por la gestión. La inversión en ads (lo que pagas a Google, Meta, etc.) es adicional y va directo a las plataformas.

**Inversión mínima recomendada en ads:**
• Google Ads: desde $400.000/mes
• Meta Ads: desde $300.000/mes
• LinkedIn Ads: desde $500.000/mes

**¿Por qué separado?**
• Tú controlas cuánto invertir
• Tienes acceso directo a tus cuentas
• Transparencia total en el gasto
• No cobramos % de la inversión

*La inversión ideal depende de tu rubro, ticket y objetivos. Lo definimos juntos en la primera reunión.*`,
    nextNode: 'precios_menu',
    category: 'precios',
    subcategory: 'ads'
  },

  // ========================================
  // RAMA: METODOLOGÍA
  // ========================================
  'metodologia_menu': {
    id: 'metodologia_menu',
    type: 'menu',
    text: '¿Qué quieres saber sobre cómo trabajamos?',
    options: [
      { id: 'metodo_proceso', label: 'Proceso de trabajo', nextNodeId: 'metodo_proceso' },
      { id: 'metodo_metricas', label: '¿Qué métricas miden?', nextNodeId: 'metodo_metricas' },
      { id: 'metodo_comunicacion', label: 'Comunicación y reportes', nextNodeId: 'metodo_comunicacion' },
      { id: 'metodo_diferencial', label: '¿Qué los diferencia?', nextNodeId: 'metodo_diferencial' },
      { id: 'volver', label: '← Volver', nextNodeId: 'root' }
    ],
    category: 'metodologia'
  },

  'metodo_proceso': {
    id: 'metodo_proceso',
    type: 'response',
    text: '',
    response: `**Metodología M&P - 5 fases:**

**Día 1: Plan de Trabajo**
Roles claros, entregables definidos, expectativas alineadas.

**Semana 1: Benchmark + Setup**
Análisis de mercado, competencia y configuración inicial.

**Semana 2: Lanzamiento**
Campañas activas, testeo de mensajes y creatividades.

**Semana 3: Optimización**
Ajustes según ciclo de venta y datos de rendimiento.

**Semana 4: Reporte 360°**
Visión completa con métricas ejecutivas y plan siguiente mes.

*Monitoreo permanente y ajustes inmediatos para máxima eficiencia.*`,
    nextNode: 'metodologia_menu',
    category: 'metodologia',
    subcategory: 'proceso'
  },

  'metodo_metricas': {
    id: 'metodo_metricas',
    type: 'response',
    text: '',
    response: `**Métricas que medimos (las que importan):**

✅ **CPL** - Costo por Lead
✅ **CPA** - Costo por Adquisición
✅ **CAC** - Costo de Adquisición de Cliente
✅ **ROAS** - Retorno sobre inversión en ads
✅ **LTV** - Valor de vida del cliente
✅ **ROI** - Retorno de inversión real

**Lo que NO usamos como KPI principal:**
❌ Impresiones (no pagan cuentas)
❌ Likes (vanity metric)
❌ Alcance sin contexto

*Nos enfocamos en métricas de negocio real, no en números que se ven bonitos pero no generan ventas.*`,
    nextNode: 'metodologia_menu',
    category: 'metodologia',
    subcategory: 'metricas'
  },

  'metodo_comunicacion': {
    id: 'metodo_comunicacion',
    type: 'response',
    text: '',
    response: `**Comunicación con M&P:**

**Reportes semanales:**
• KPIs clave
• Actualización de campañas
• Ajustes realizados

**Reportes mensuales:**
• Informe ejecutivo completo
• Benchmark vs competencia
• Plan del próximo mes

**Reuniones:**
• 1 reunión semanal (30 min)
• 1 reunión mensual (1 hora)

**WhatsApp directo:**
• Respuestas en menos de 2 horas
• Alertas de cambios importantes
• Dudas resueltas al instante

**Horario:** Lunes a Viernes 9:00 - 18:00`,
    nextNode: 'metodologia_menu',
    category: 'metodologia',
    subcategory: 'comunicacion'
  },

  'metodo_diferencial': {
    id: 'metodo_diferencial',
    type: 'response',
    text: '',
    response: `**¿Qué diferencia a M&P?**

✅ **Transparencia total**
Acceso 24/7 a tus cuentas publicitarias. Ves todo.

✅ **Sin contratos de permanencia**
Si no funciona, te vas cuando quieras.

✅ **Equipo dedicado de 3 profesionales**
No un freelancer compartido entre 50 clientes.

✅ **Benchmark incluido**
Cada mes te mostramos qué hace tu competencia.

✅ **Métricas de negocio real**
CPL, CAC, ROAS. No impresiones ni likes.

✅ **Retención del 95%**
(vs 60% promedio de la industria)

✅ **ROI promedio +380%**
En más de 200 campañas activas.

*Menos improvisación. Más performance.*`,
    nextNode: 'metodologia_menu',
    category: 'metodologia',
    subcategory: 'diferencial'
  },

  // ========================================
  // RAMA: EQUIPO
  // ========================================
  'equipo_info': {
    id: 'equipo_info',
    type: 'response',
    text: '',
    response: `**Tu equipo M&P - 3 profesionales dedicados:**

**1. Paid Media Planner**
• Diseña árboles de decisión de campaña
• Maneja presupuesto y distribución
• Hace reportería ejecutiva (semanal y mensual)

**2. Publicista**
• Construye el relato de la marca
• Estudia competencia en redes sociales
• Define qué, cómo y cuándo comunicar

**3. Diseñador**
• Crea piezas de paid media y contenido orgánico
• Media jornada mensual de grabación
• Garantiza dinamismo visual

**Respaldo:** +20 especialistas en la agencia.

*Las mismas personas trabajan tu cuenta durante toda la relación. No hay rotación constante.*`,
    nextNode: 'root',
    category: 'equipo',
    subcategory: 'roles'
  },

  // ========================================
  // RAMA: CONTACTO
  // ========================================
  'contacto_menu': {
    id: 'contacto_menu',
    type: 'menu',
    text: '¿Cómo prefieres contactarnos?',
    options: [
      { id: 'contacto_whatsapp', label: 'WhatsApp', nextNodeId: 'contacto_whatsapp' },
      { id: 'contacto_email', label: 'Email', nextNodeId: 'contacto_email' },
      { id: 'contacto_datos', label: 'Dejar mis datos', nextNodeId: 'contacto_datos' },
      { id: 'volver', label: '← Volver', nextNodeId: 'root' }
    ],
    category: 'contacto'
  },

  'contacto_whatsapp': {
    id: 'contacto_whatsapp',
    type: 'response',
    text: '',
    response: `**WhatsApp M&P:**

📱 **+56 9 9225 8137**

**Horario:** Lunes a Viernes, 9:00 - 18:00

Cuéntanos tu nombre, empresa y qué necesitas.

[Haz clic aquí para escribirnos →](https://wa.me/56992258137?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20servicios)`,
    nextNode: 'contacto_menu',
    category: 'contacto',
    subcategory: 'whatsapp'
  },

  'contacto_email': {
    id: 'contacto_email',
    type: 'response',
    text: '',
    response: `**Email de contacto:**

📧 **contacto@mulleryperez.cl**

**Tiempo de respuesta:** 24-48 horas hábiles

**Incluye en tu email:**
• Nombre y empresa
• Rubro/industria
• Qué problema quieres resolver
• Presupuesto aproximado (si lo tienes)

**Dirección:**
Badajoz 100, Of 523, Las Condes, Santiago`,
    nextNode: 'contacto_menu',
    category: 'contacto',
    subcategory: 'email'
  },

  'contacto_datos': {
    id: 'contacto_datos',
    type: 'capture_lead',
    text: 'Déjanos tus datos y te contactamos:',
    captureFields: ['nombre', 'empresa', 'email', 'telefono'],
    nextNode: 'contacto_confirmacion',
    category: 'contacto',
    subcategory: 'captura_lead'
  },

  'contacto_confirmacion': {
    id: 'contacto_confirmacion',
    type: 'response',
    text: '',
    response: `**¡Datos recibidos!**

Te contactaremos dentro de las próximas 24-48 horas hábiles.

Mientras tanto puedes visitar nuestra web: www.mulleryperez.cl

¡Gracias por tu interés en M&P!`,
    nextNode: 'root',
    category: 'contacto',
    subcategory: 'confirmacion'
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
