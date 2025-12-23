/**
 * M&P ChatBot - Árbol de Decisión y FAQs
 * Sistema de navegación por menú con respuestas predefinidas
 * Tono: profesional, directo, aterrizado, sin humo
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

// ============================================
// ÁRBOL DE DECISIÓN PRINCIPAL
// ============================================

export const chatTree: Record<string, ChatNode> = {
  // ----------------------------------------
  // NODO RAÍZ - MENÚ PRINCIPAL
  // ----------------------------------------
  'root': {
    id: 'root',
    type: 'menu',
    text: 'Hola, soy el asistente de M&P. ¿En qué te puedo ayudar?',
    options: [
      { id: 'planes', label: 'Planes y qué incluyen', emoji: '📌', nextNodeId: 'planes_menu' },
      { id: 'precios', label: 'Precios y qué determina el valor', emoji: '💰', nextNodeId: 'precios_menu' },
      { id: 'metodologia', label: 'Cómo trabajamos', emoji: '🧠', nextNodeId: 'metodologia_menu' },
      { id: 'contrato', label: 'Contrato y condiciones', emoji: '📝', nextNodeId: 'contrato_menu' },
      { id: 'marketing', label: 'Preguntas de marketing digital', emoji: '📈', nextNodeId: 'marketing_menu' },
      { id: 'contacto', label: 'Hablar con un humano', emoji: '📞', nextNodeId: 'contacto_menu' }
    ],
    category: 'inicio'
  },

  // ============================================
  // RAMA 1: PLANES
  // ============================================
  'planes_menu': {
    id: 'planes_menu',
    type: 'menu',
    text: '¿Qué quieres saber sobre nuestros planes?',
    options: [
      { id: 'planes_tipos', label: '¿Qué planes tienen?', nextNodeId: 'planes_tipos' },
      { id: 'planes_entregables', label: '¿Qué entregables incluyen?', nextNodeId: 'planes_entregables' },
      { id: 'planes_plataformas', label: '¿Qué plataformas trabajan?', nextNodeId: 'planes_plataformas' },
      { id: 'planes_no_incluye', label: '¿Qué NO incluyen?', nextNodeId: 'planes_no_incluye' },
      { id: 'volver', label: '← Volver al menú', nextNodeId: 'root' }
    ],
    category: 'planes'
  },

  'planes_tipos': {
    id: 'planes_tipos',
    type: 'response',
    text: '',
    response: `**Nuestros planes de Performance Marketing:**

**Plan Integral** (más común)
• Gestión completa de campañas paid media
• Equipo de 3 profesionales dedicados
• Reporting semanal y mensual
• Benchmark de competencia incluido
• Ideal para empresas con inversión desde $800.000/mes en ads

**Plan Silver**
• Gestión de campañas en 1-2 plataformas
• Reporting mensual
• Para empresas que están partiendo o tienen presupuesto acotado
• Inversión desde $400.000/mes en ads

**Plan Custom**
• Para grandes cuentas o necesidades específicas
• Lo diseñamos según tus objetivos

*El plan ideal depende de tu inversión en ads, cantidad de campañas y complejidad. Lo definimos en una reunión de diagnóstico sin costo.*`,
    nextNode: 'planes_menu',
    category: 'planes',
    subcategory: 'tipos'
  },

  'planes_entregables': {
    id: 'planes_entregables',
    type: 'response',
    text: '',
    response: `**Entregables mensuales (Plan Integral):**

**Campañas:**
• Creación y optimización de campañas paid media
• A/B testing de anuncios
• Gestión de presupuesto y pujas
• Segmentación y audiencias

**Contenido:**
• Piezas gráficas para anuncios (cantidad según plan)
• Copys optimizados para conversión
• Media jornada de grabación (si aplica)

**Reporting:**
• Reporte ejecutivo semanal (KPIs clave)
• Reporte mensual completo con análisis
• Benchmark de competencia
• Reunión mensual de revisión

**Estrategia:**
• Plan de medios mensual
• Recomendaciones de optimización
• Análisis de oportunidades

*La cantidad exacta de piezas y campañas depende del plan y la inversión. Lo detallamos en la cotización.*`,
    nextNode: 'planes_menu',
    category: 'planes',
    subcategory: 'entregables'
  },

  'planes_plataformas': {
    id: 'planes_plataformas',
    type: 'response',
    text: '',
    response: `**Plataformas que gestionamos:**

**Principales:**
• Google Ads (Search, Display, Shopping, YouTube)
• Meta Ads (Facebook e Instagram)
• LinkedIn Ads
• TikTok Ads

**Complementarias:**
• Google Analytics 4 (configuración y análisis)
• Google Tag Manager
• Email marketing (Mailchimp, Klaviyo, etc.)
• CRM (HubSpot, Pipedrive, etc.)

**No gestionamos:**
• SEO (tenemos partners que lo hacen)
• Community management orgánico
• Desarrollo web (sí hacemos landing pages simples)

*La recomendación de plataformas depende de tu rubro, ticket y audiencia. No todas las plataformas sirven para todos.*`,
    nextNode: 'planes_menu',
    category: 'planes',
    subcategory: 'plataformas'
  },

  'planes_no_incluye': {
    id: 'planes_no_incluye',
    type: 'response',
    text: '',
    response: `**Lo que NO incluimos (y por qué):**

❌ **Promesas de resultados garantizados**
No prometemos "duplicar ventas" ni números mágicos. Trabajamos con método y mejora continua.

❌ **Campañas "spot" o por proyecto**
Salvo excepciones, no hacemos campañas de un mes. El performance marketing requiere tiempo para optimizar.

❌ **Gestión de redes orgánicas**
Nos enfocamos en paid media. El contenido orgánico es otro servicio.

❌ **Diseño de marca o branding**
Ejecutamos campañas, no creamos identidades desde cero.

❌ **Desarrollo web complejo**
Hacemos landing pages simples. Sitios complejos los derivamos a partners.

❌ **"Hacerlo todo"**
Preferimos hacer pocas cosas bien que muchas mal. Foco > cantidad.

*Somos transparentes: si algo no es nuestro fuerte, te lo decimos.*`,
    nextNode: 'planes_menu',
    category: 'planes',
    subcategory: 'no_incluye'
  },

  // ============================================
  // RAMA 2: PRECIOS
  // ============================================
  'precios_menu': {
    id: 'precios_menu',
    type: 'menu',
    text: '¿Qué quieres saber sobre precios?',
    options: [
      { id: 'precios_rangos', label: '¿Cuánto cuesta el servicio?', nextNodeId: 'precios_rangos' },
      { id: 'precios_variables', label: '¿Qué cambia el precio?', nextNodeId: 'precios_variables' },
      { id: 'precios_fee', label: '¿Cómo es el modelo de cobro?', nextNodeId: 'precios_fee' },
      { id: 'precios_setup', label: '¿Hay costo de setup?', nextNodeId: 'precios_setup' },
      { id: 'volver', label: '← Volver al menú', nextNodeId: 'root' }
    ],
    category: 'precios'
  },

  'precios_rangos': {
    id: 'precios_rangos',
    type: 'response',
    text: '',
    response: `**Rangos de inversión (fee de agencia):**

**Plan Silver:** $450.000 - $650.000 + IVA/mes
• 1-2 plataformas
• Reporting mensual
• Ideal para partir

**Plan Integral:** $850.000 - $1.500.000 + IVA/mes
• Múltiples plataformas
• Equipo de 3 dedicado
• Reporting semanal + mensual
• Benchmark incluido

**Plan Custom:** Desde $1.500.000 + IVA/mes
• Grandes cuentas
• Necesidades específicas

**Importante:**
• Esto es el fee de agencia, NO incluye la inversión en ads
• La inversión en ads es adicional y va directo a las plataformas
• El fee depende de la complejidad, no solo del presupuesto en ads

*Para una cotización precisa necesitamos conocer tu caso. ¿Quieres agendar una reunión?*`,
    nextNode: 'precios_menu',
    category: 'precios',
    subcategory: 'rangos'
  },

  'precios_variables': {
    id: 'precios_variables',
    type: 'response',
    text: '',
    response: `**¿Qué hace que el precio varíe?**

**Variables principales:**

📊 **Cantidad de plataformas**
No es lo mismo gestionar solo Google que Google + Meta + LinkedIn + TikTok

🎯 **Número de campañas activas**
Más campañas = más trabajo de optimización

🖼️ **Volumen de piezas gráficas**
¿Necesitas 10 piezas o 50 al mes?

🏢 **Número de marcas/productos**
Una marca es distinto a un holding con 5 marcas

📈 **Complejidad del tracking**
¿Tienes CRM? ¿Ecommerce? ¿Múltiples puntos de conversión?

🔄 **Frecuencia de cambios**
¿Campañas estables o muy dinámicas?

**Por eso no podemos dar un precio único sin contexto.** No es que no queramos, es que sería irresponsable.

*En una reunión de 30 minutos podemos darte una cotización ajustada a tu realidad.*`,
    nextNode: 'precios_menu',
    category: 'precios',
    subcategory: 'variables'
  },

  'precios_fee': {
    id: 'precios_fee',
    type: 'response',
    text: '',
    response: `**Modelo de cobro M&P:**

✅ **Fee fijo mensual**
Cobramos un monto fijo que no cambia si subes o bajas tu inversión en ads. Esto alinea incentivos: no ganamos más por hacerte gastar más.

✅ **Sin comisiones ocultas**
No cobramos % de la inversión en ads. Lo que cotizamos es lo que pagas.

✅ **Facturación mensual anticipada**
Se paga al inicio de cada mes.

✅ **Inversión en ads separada**
Tú pagas directo a Google/Meta/etc. Nosotros solo gestionamos. Tienes acceso completo a tus cuentas.

**¿Por qué fee fijo?**
Porque el modelo de "% del presupuesto" genera incentivos perversos: la agencia gana más si te hace gastar más, no si te hace vender más. Nosotros preferimos que inviertas de forma eficiente.

*Algunos competidores cobran 15-20% del presupuesto. Eso puede parecer barato al inicio, pero se vuelve caro cuando escalas.*`,
    nextNode: 'precios_menu',
    category: 'precios',
    subcategory: 'fee'
  },

  'precios_setup': {
    id: 'precios_setup',
    type: 'response',
    text: '',
    response: `**Setup inicial:**

Dependiendo del estado de tus cuentas, puede haber un costo de setup que incluye:

• Auditoría de cuentas existentes
• Configuración de tracking (GA4, GTM, Pixels)
• Estructuración de campañas desde cero
• Configuración de conversiones y eventos
• Integración con CRM si aplica

**¿Cuánto cuesta?**
• Si tus cuentas están bien configuradas: $0
• Setup básico: $300.000 - $500.000 (una vez)
• Setup complejo: $500.000 - $1.000.000 (una vez)

**¿Por qué cobrarlo aparte?**
Porque es trabajo que se hace una sola vez. No tiene sentido diluirlo en el fee mensual ni cobrarlo todos los meses.

*En la reunión de diagnóstico evaluamos el estado de tus cuentas y te decimos si hay setup necesario.*`,
    nextNode: 'precios_menu',
    category: 'precios',
    subcategory: 'setup'
  },

  // ============================================
  // RAMA 3: METODOLOGÍA
  // ============================================
  'metodologia_menu': {
    id: 'metodologia_menu',
    type: 'menu',
    text: '¿Qué quieres saber sobre cómo trabajamos?',
    options: [
      { id: 'metodo_inicio', label: '¿Cómo partimos?', nextNodeId: 'metodo_inicio' },
      { id: 'metodo_equipo', label: '¿Quién trabaja en mi cuenta?', nextNodeId: 'metodo_equipo' },
      { id: 'metodo_medicion', label: '¿Cómo miden resultados?', nextNodeId: 'metodo_medicion' },
      { id: 'metodo_comunicacion', label: '¿Cómo es la comunicación?', nextNodeId: 'metodo_comunicacion' },
      { id: 'metodo_diferencial', label: '¿Qué los diferencia?', nextNodeId: 'metodo_diferencial' },
      { id: 'volver', label: '← Volver al menú', nextNodeId: 'root' }
    ],
    category: 'metodologia'
  },

  'metodo_inicio': {
    id: 'metodo_inicio',
    type: 'response',
    text: '',
    response: `**Cómo partimos (primeras 2 semanas):**

**Día 1-3: Kick-off**
• Reunión "Tiempo 0" para entender tu negocio
• Definición de KPIs y objetivos
• Solicitud de accesos a cuentas

**Día 4-7: Diagnóstico**
• Auditoría de cuentas existentes
• Análisis de competencia
• Identificación de oportunidades

**Día 8-10: Estrategia**
• Propuesta de estructura de campañas
• Plan de medios inicial
• Definición de audiencias

**Día 11-14: Implementación**
• Configuración de tracking
• Creación de campañas
• Lanzamiento controlado

**Semana 3 en adelante:**
• Optimización continua
• Reporting semanal
• Ajustes según datos

*No lanzamos campañas sin entender tu negocio primero. Eso sería tirar plata.*`,
    nextNode: 'metodologia_menu',
    category: 'metodologia',
    subcategory: 'inicio'
  },

  'metodo_equipo': {
    id: 'metodo_equipo',
    type: 'response',
    text: '',
    response: `**Tu equipo M&P (3 roles):**

**1. Paid Media Planner**
• Diseña la estrategia de campañas
• Maneja presupuesto y distribución
• Hace la reportería ejecutiva
• Es tu punto de contacto principal

**2. Publicista**
• Construye el relato de marca
• Define qué comunicar y cómo
• Estudia a tu competencia
• Escribe copys que convierten

**3. Diseñador**
• Crea las piezas gráficas
• Garantiza coherencia visual
• Produce contenido audiovisual (si aplica)

**¿Por qué 3 personas?**
Porque cada rol tiene skills distintos. Un buen analista de datos no necesariamente escribe buenos copys, y viceversa. La especialización da mejores resultados.

*No rotamos equipos cada mes. Las mismas personas trabajan tu cuenta durante toda la relación.*`,
    nextNode: 'metodologia_menu',
    category: 'metodologia',
    subcategory: 'equipo'
  },

  'metodo_medicion': {
    id: 'metodo_medicion',
    type: 'response',
    text: '',
    response: `**Cómo medimos resultados:**

**Métricas que importan:**
• **CPL** (Costo por Lead)
• **CPA** (Costo por Adquisición)
• **CAC** (Costo de Adquisición de Cliente)
• **ROAS** (Retorno sobre inversión en ads)
• **Tasa de conversión** por etapa del funnel

**Métricas que NO usamos como KPI principal:**
• Impresiones (pueden ser irrelevantes)
• Likes (no pagan cuentas)
• Alcance (sin contexto no dice nada)

**Trazabilidad:**
• Configuramos UTMs en todo
• Integramos con tu CRM si tienes
• Distinguimos lead de cliente real
• Calculamos ROI real, no vanity metrics

**Reporting:**
• Semanal: KPIs clave y alertas
• Mensual: Análisis completo + recomendaciones
• Reunión mensual de revisión

*Si tu CRM no trackea bien el origen de los clientes, te ayudamos a configurarlo.*`,
    nextNode: 'metodologia_menu',
    category: 'metodologia',
    subcategory: 'medicion'
  },

  'metodo_comunicacion': {
    id: 'metodo_comunicacion',
    type: 'response',
    text: '',
    response: `**Comunicación con M&P:**

**Canales:**
• WhatsApp para coordinación del día a día
• Email para temas formales y aprobaciones
• Reuniones mensuales por videollamada
• Acceso a dashboard de reportería

**Tiempos de respuesta:**
• WhatsApp: mismo día (horario laboral)
• Email: 24-48 horas
• Urgencias: las definimos juntos

**Reuniones:**
• Kick-off inicial (1-2 horas)
• Revisión mensual (45-60 min)
• Reuniones adicionales si hay necesidad

**Lo que NO hacemos:**
• Llamadas sin agenda previa
• Reuniones semanales obligatorias (salvo que lo pidas)
• Responder fuera de horario laboral

**Horario:**
• Lunes a Viernes, 9:00 a 18:00
• Feriados no trabajamos

*Creemos en la comunicación eficiente: pocos mensajes, pero de calidad.*`,
    nextNode: 'metodologia_menu',
    category: 'metodologia',
    subcategory: 'comunicacion'
  },

  'metodo_diferencial': {
    id: 'metodo_diferencial',
    type: 'response',
    text: '',
    response: `**Qué nos diferencia de otras agencias:**

**1. Orden y metodología**
Trabajamos con procesos claros, no improvisamos. Cada cliente tiene su carpeta, su calendario, su estructura.

**2. Foco en métricas de negocio**
No vendemos "más likes". Medimos CPL, CPA, ROAS. Si no genera negocio, no sirve.

**3. Transparencia total**
Tienes acceso a tus cuentas de ads. Ves exactamente qué hacemos y cuánto gastamos.

**4. Fee fijo**
No ganamos más por hacerte gastar más. Nuestro incentivo es que inviertas eficientemente.

**5. Sin humo**
No prometemos magia. Trabajamos con data y mejora incremental. Si algo no funciona, lo decimos.

**6. Equipo estable**
Las mismas personas trabajan tu cuenta siempre. No hay rotación constante.

**7. Benchmark incluido**
Estudiamos qué hace tu competencia. No trabajamos en el vacío.

*Si buscas promesas de "triplicar ventas en 30 días", no somos tu agencia. Si buscas método y resultados sostenibles, conversemos.*`,
    nextNode: 'metodologia_menu',
    category: 'metodologia',
    subcategory: 'diferencial'
  },

  // ============================================
  // RAMA 4: CONTRATO
  // ============================================
  'contrato_menu': {
    id: 'contrato_menu',
    type: 'menu',
    text: '¿Qué quieres saber sobre el contrato?',
    options: [
      { id: 'contrato_duracion', label: '¿Cuánto dura el contrato?', nextNodeId: 'contrato_duracion' },
      { id: 'contrato_termino', label: '¿Puedo terminar antes?', nextNodeId: 'contrato_termino' },
      { id: 'contrato_recurrente', label: '¿Por qué es recurrente?', nextNodeId: 'contrato_recurrente' },
      { id: 'contrato_renovacion', label: '¿Cómo funciona la renovación?', nextNodeId: 'contrato_renovacion' },
      { id: 'volver', label: '← Volver al menú', nextNodeId: 'root' }
    ],
    category: 'contrato'
  },

  'contrato_duracion': {
    id: 'contrato_duracion',
    type: 'response',
    text: '',
    response: `**Duración del contrato:**

**Mínimo:** 6 meses

**¿Por qué 6 meses?**
• El primer mes es aprendizaje y setup
• Los meses 2-3 son de optimización inicial
• Recién en el mes 4-6 se estabiliza el performance
• Evaluar antes de 6 meses es injusto para ambos

**Después de los 6 meses:**
• El contrato continúa mes a mes
• Cualquier parte puede terminar con 30 días de aviso
• No hay renovación automática por periodos largos

**No hacemos:**
• Contratos de 12 meses con penalidad
• "Pruebas" de 1 mes (no funcionan)
• Campañas spot sin continuidad

*El performance marketing es un proceso, no un evento. Los resultados buenos requieren tiempo.*`,
    nextNode: 'contrato_menu',
    category: 'contrato',
    subcategory: 'duracion'
  },

  'contrato_termino': {
    id: 'contrato_termino',
    type: 'response',
    text: '',
    response: `**Término anticipado:**

**Durante los primeros 6 meses:**
• Se puede terminar con 30 días de aviso
• Se pagan los meses pendientes hasta completar 6

**Después de los 6 meses:**
• Aviso con 30 días de anticipación
• Sin penalidad ni costo adicional
• Entregamos todo: accesos, reportes, aprendizajes

**¿Qué pasa con las cuentas de ads?**
• Son tuyas, siempre
• Te damos acceso de administrador desde el día 1
• Al terminar, removemos nuestros accesos
• El historial y las audiencias quedan contigo

**Lo que entregamos al cierre:**
• Acceso completo a cuentas
• Reporte final con recomendaciones
• Documentación de lo aprendido

*No te amarramos. Si el servicio no te sirve, mejor terminar bien que forzar una relación que no funciona.*`,
    nextNode: 'contrato_menu',
    category: 'contrato',
    subcategory: 'termino'
  },

  'contrato_recurrente': {
    id: 'contrato_recurrente',
    type: 'response',
    text: '',
    response: `**¿Por qué trabajamos de forma recurrente?**

**El performance marketing NO es un proyecto, es un proceso:**

1. **Aprendizaje continuo**
Los algoritmos de Google y Meta aprenden de los datos. Más datos = mejor optimización. Eso toma tiempo.

2. **Optimización iterativa**
Cada semana ajustamos pujas, audiencias, creativos. Es trabajo constante, no de una vez.

3. **Estacionalidad**
Tu negocio tiene ciclos. Necesitamos ver al menos 6 meses para entender patrones.

4. **Competencia dinámica**
Tus competidores cambian sus estrategias. Hay que adaptarse constantemente.

**¿Por qué no hacemos campañas de 1 mes?**
• El mes 1 es setup y aprendizaje
• No hay datos suficientes para optimizar
• Los resultados suelen ser malos
• Genera frustración para ambos

*Una campaña de 1 mes es como ir al gimnasio una semana y esperar resultados. No funciona así.*`,
    nextNode: 'contrato_menu',
    category: 'contrato',
    subcategory: 'recurrente'
  },

  'contrato_renovacion': {
    id: 'contrato_renovacion',
    type: 'response',
    text: '',
    response: `**Renovación del contrato:**

**Cómo funciona:**
• Después de los 6 meses iniciales, el contrato es mes a mes
• No hay renovación automática por 12 meses
• Cualquier cambio de condiciones se conversa antes

**Revisión de fee:**
• El fee se mantiene estable durante los 6 meses iniciales
• Después, puede ajustarse por:
  - Inflación / IPC
  - Cambios significativos en el alcance
  - Nuevas plataformas o servicios
• Siempre se avisa con 30 días de anticipación

**¿Qué pasa si quiero más servicios?**
• Cotizamos aparte o ajustamos el fee
• Nunca agregamos cosas sin tu aprobación

*No nos gusta la letra chica. Si hay algo que ajustar, lo conversamos directamente.*`,
    nextNode: 'contrato_menu',
    category: 'contrato',
    subcategory: 'renovacion'
  },

  // ============================================
  // RAMA 5: MARKETING DIGITAL GENERAL
  // ============================================
  'marketing_menu': {
    id: 'marketing_menu',
    type: 'menu',
    text: 'Preguntas frecuentes de marketing digital:',
    options: [
      { id: 'mkt_google_meta', label: '¿Google o Meta Ads?', nextNodeId: 'mkt_google_meta' },
      { id: 'mkt_kpis', label: '¿Qué KPIs debo mirar?', nextNodeId: 'mkt_kpis' },
      { id: 'mkt_leads_malos', label: '¿Por qué tengo leads malos?', nextNodeId: 'mkt_leads_malos' },
      { id: 'mkt_linkedin', label: '¿Conviene LinkedIn Ads?', nextNodeId: 'mkt_linkedin' },
      { id: 'mkt_presupuesto', label: '¿Qué presupuesto mínimo?', nextNodeId: 'mkt_presupuesto' },
      { id: 'mkt_micromanagement', label: '¿Cómo evitar micromanagement?', nextNodeId: 'mkt_micromanagement' },
      { id: 'volver', label: '← Volver al menú', nextNodeId: 'root' }
    ],
    category: 'marketing'
  },

  'mkt_google_meta': {
    id: 'mkt_google_meta',
    type: 'response',
    text: '',
    response: `**¿Google Ads o Meta Ads?**

Depende. Algunas preguntas para definirlo:

**Elige Google Ads si:**
• Tu producto/servicio tiene demanda de búsqueda activa
• La gente busca lo que vendes en Google
• Tienes un ticket alto y ciclo de venta largo
• Eres B2B con compradores técnicos

**Elige Meta Ads si:**
• Tu producto es visual o aspiracional
• Necesitas generar demanda (la gente no te busca aún)
• Tienes un ticket bajo-medio con compra impulsiva
• Tu audiencia pasa mucho tiempo en redes

**Lo ideal: ambos**
• Google captura la demanda existente
• Meta genera demanda nueva
• Se complementan

**Ejemplo práctico:**
• Plomero de urgencia → Google Ads (la gente busca "plomero urgente")
• Marca de ropa nueva → Meta Ads (la gente no busca tu marca aún)
• Ecommerce establecido → Ambos

*La respuesta correcta depende de tu rubro, ticket y audiencia. Esto lo definimos en la estrategia inicial.*`,
    nextNode: 'marketing_menu',
    category: 'marketing',
    subcategory: 'google_meta'
  },

  'mkt_kpis': {
    id: 'mkt_kpis',
    type: 'response',
    text: '',
    response: `**¿Qué KPIs mirar según tu objetivo?**

**Si vendes online (ecommerce):**
• ROAS (Retorno sobre inversión en ads)
• CPA (Costo por compra)
• Ticket promedio
• Tasa de conversión del sitio

**Si generas leads:**
• CPL (Costo por Lead)
• Calidad del lead (% que avanza)
• CPO (Costo por Oportunidad calificada)
• CAC (Costo de Adquisición de Cliente)

**Si buscas awareness:**
• Alcance único
• Frecuencia
• CPM (Costo por mil impresiones)
• Recordación de marca (estudios)

**KPIs que NO deberían ser tu foco principal:**
• Likes (no pagan cuentas)
• Comentarios (pueden ser bots)
• Impresiones (sin contexto no dicen nada)
• CTR solo (puede ser alto con baja conversión)

*El KPI correcto depende de tu modelo de negocio. No todos los negocios deben medir lo mismo.*`,
    nextNode: 'marketing_menu',
    category: 'marketing',
    subcategory: 'kpis'
  },

  'mkt_leads_malos': {
    id: 'mkt_leads_malos',
    type: 'response',
    text: '',
    response: `**¿Por qué tengo leads de mala calidad?**

**Causas comunes:**

1. **Segmentación muy amplia**
Si apuntas a "todos", llegas a "nadie" relevante.

2. **Mensaje poco calificador**
Si tu anuncio no filtra, llega gente que no es tu cliente ideal.

3. **Landing page confusa**
Si no queda claro qué ofreces y para quién, llegan curiosos.

4. **Formulario muy simple**
Pedir solo nombre y teléfono atrae leads de baja intención.

5. **Oferta de bajo compromiso**
"Descarga gratis" atrae más cantidad, pero menos calidad.

**Cómo mejorar:**
• Agrega campos calificadores al formulario
• Sé específico en tu mensaje (precio, requisitos)
• Usa audiencias más acotadas
• Mejora el copy de tus ads
• Prueba ofertas de mayor compromiso

*Más leads ≠ mejores resultados. A veces menos leads de mejor calidad = más ventas.*`,
    nextNode: 'marketing_menu',
    category: 'marketing',
    subcategory: 'leads_malos'
  },

  'mkt_linkedin': {
    id: 'mkt_linkedin',
    type: 'response',
    text: '',
    response: `**¿Conviene LinkedIn Ads?**

**Sí conviene si:**
• Vendes B2B (empresa a empresa)
• Tu ticket es alto (+$1.000.000 o USD 1.000+)
• Necesitas llegar a cargos específicos (Gerente de X, Director de Y)
• Tu ciclo de venta es largo

**No conviene si:**
• Vendes B2C (consumidor final)
• Tu ticket es bajo (bajo $500.000)
• Tu audiencia no está activa en LinkedIn
• Tienes presupuesto muy limitado

**Costos de referencia (Chile):**
• CPC: $1.500 - $5.000 (más caro que Google/Meta)
• CPL: $15.000 - $50.000 dependiendo del rubro
• Presupuesto mínimo recomendado: $500.000/mes

**Tip:**
LinkedIn es caro pero preciso. Si tu ticket lo justifica, puede ser muy rentable. Si vendes algo de bajo valor, el CPL te va a comer el margen.

*LinkedIn no es para todos. Evalúa si tu ticket justifica el costo antes de invertir.*`,
    nextNode: 'marketing_menu',
    category: 'marketing',
    subcategory: 'linkedin'
  },

  'mkt_presupuesto': {
    id: 'mkt_presupuesto',
    type: 'response',
    text: '',
    response: `**Presupuesto mínimo recomendado (solo ads):**

**Google Ads Search:**
• Mínimo: $400.000/mes
• Recomendado: $800.000+/mes
• Para que los algoritmos aprendan bien

**Meta Ads (Facebook/Instagram):**
• Mínimo: $300.000/mes
• Recomendado: $600.000+/mes
• Menos de esto no genera datos suficientes

**LinkedIn Ads:**
• Mínimo: $500.000/mes
• Recomendado: $1.000.000+/mes
• Es la plataforma más cara

**Google Shopping:**
• Mínimo: $500.000/mes
• Recomendado: $1.000.000+/mes
• Depende del catálogo

**¿Por qué hay mínimos?**
• Los algoritmos necesitan conversiones para aprender
• Con poco presupuesto, no hay datos suficientes
• Terminas optimizando a ciegas

**Fórmula simple:**
Presupuesto mínimo = 10-20 conversiones × tu CPA esperado

*Esto es solo el presupuesto en ads. El fee de agencia es adicional.*`,
    nextNode: 'marketing_menu',
    category: 'marketing',
    subcategory: 'presupuesto'
  },

  'mkt_micromanagement': {
    id: 'mkt_micromanagement',
    type: 'response',
    text: '',
    response: `**¿Cómo evitar micromanagement con la agencia?**

**Define expectativas claras desde el inicio:**
• Qué KPIs importan
• Qué frecuencia de reporting
• Qué nivel de detalle necesitas
• Qué decisiones requieren aprobación

**Confía en el proceso:**
• Los primeros 2-3 meses son de aprendizaje
• No cambies la estrategia cada semana
• Deja que los datos hablen

**Comunicación estructurada:**
• Reuniones mensuales, no diarias
• Un canal de comunicación (no 5)
• Preguntas agrupadas, no goteo constante

**Lo que SÍ deberías revisar:**
• Reportes semanales/mensuales
• KPIs acordados
• Presupuesto gastado vs. planificado

**Lo que NO deberías hacer:**
• Pedir cambios de copy cada día
• Cuestionar cada optimización técnica
• Comparar con "lo que hace mi sobrino"

*El micromanagement quema a ambas partes y no mejora resultados. Confía en los profesionales que contrataste (o contrata otros).*`,
    nextNode: 'marketing_menu',
    category: 'marketing',
    subcategory: 'micromanagement'
  },

  // ============================================
  // RAMA 6: CONTACTO
  // ============================================
  'contacto_menu': {
    id: 'contacto_menu',
    type: 'menu',
    text: '¿Cómo prefieres contactarnos?',
    options: [
      { id: 'contacto_agendar', label: 'Agendar reunión de diagnóstico', nextNodeId: 'contacto_agendar' },
      { id: 'contacto_whatsapp', label: 'Escribir por WhatsApp', nextNodeId: 'contacto_whatsapp' },
      { id: 'contacto_email', label: 'Enviar email', nextNodeId: 'contacto_email' },
      { id: 'contacto_datos', label: 'Dejar mis datos para que me contacten', nextNodeId: 'contacto_datos' },
      { id: 'volver', label: '← Volver al menú', nextNodeId: 'root' }
    ],
    category: 'contacto'
  },

  'contacto_agendar': {
    id: 'contacto_agendar',
    type: 'response',
    text: '',
    response: `**Reunión de Diagnóstico (sin costo)**

En 30 minutos analizamos:
• Tu situación actual de marketing
• Oportunidades de mejora
• Si tiene sentido trabajar juntos

**Para agendar:**
👉 Completa el formulario en nuestra web (sección Contacto) o escríbenos directo.

**Qué necesitamos saber:**
• Tu rubro/industria
• Inversión actual en ads (aproximada)
• Qué problema quieres resolver
• Sitio web o redes sociales

**Qué NO es esta reunión:**
• Una venta agresiva
• Una auditoría completa (eso viene después)
• Compromiso de contratar

*Si no somos el fit correcto, te lo decimos. Preferimos honestidad que forzar relaciones que no funcionan.*`,
    nextNode: 'contacto_menu',
    category: 'contacto',
    subcategory: 'agendar'
  },

  'contacto_whatsapp': {
    id: 'contacto_whatsapp',
    type: 'response',
    text: '',
    response: `**WhatsApp M&P:**

📱 **+56 9 7979 8855**

**Horario de respuesta:**
Lunes a Viernes, 9:00 - 18:00

**Cuéntanos:**
• Tu nombre y empresa
• Qué servicio te interesa
• Tu situación actual (brevemente)

**Tip:** Si nos escribes fuera de horario, respondemos al día siguiente.

[Haz clic aquí para escribirnos →](https://wa.me/56979798855?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20servicios%20de%20marketing)`,
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
• Presupuesto aproximado (si lo tienes definido)
• Sitio web o redes sociales

*Los emails con más contexto reciben respuestas más útiles.*`,
    nextNode: 'contacto_menu',
    category: 'contacto',
    subcategory: 'email'
  },

  'contacto_datos': {
    id: 'contacto_datos',
    type: 'capture_lead',
    text: '¡Perfecto! Déjanos tus datos y te contactamos:',
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

Mientras tanto, puedes:
• Revisar nuestros casos de éxito en la web
• Leer el blog con tips de marketing
• Seguirnos en LinkedIn

¡Gracias por tu interés en M&P!`,
    nextNode: 'root',
    category: 'contacto',
    subcategory: 'confirmacion'
  }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

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

export function getNodesByCategory(category: string): ChatNode[] {
  return Object.values(chatTree).filter(node => node.category === category)
}
