import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog Marketing Digital 2025 - Guías Google Ads y Performance | M&P',
  description: 'Aprende estrategias de marketing digital, Google Ads, Meta Ads y performance marketing. Guías prácticas con datos reales de +200 campañas Chile 2025',
  keywords: 'blog marketing digital chile, guias google ads, estrategias performance marketing, tutoriales meta ads, marketing datos chile, roi roas optimización',
  alternates: {
    canonical: 'https://www.mulleryperez.cl/blog'
  },
  openGraph: {
    title: 'Blog Marketing Digital 2025 - Guías Google Ads y Performance | M&P',
    description: 'Aprende estrategias de marketing digital, Google Ads, Meta Ads y performance marketing. Guías prácticas con datos reales de +200 campañas Chile 2025',
    type: 'website',
    url: 'https://www.mulleryperez.cl/blog',
    images: [
      {
        url: 'https://www.mulleryperez.cl/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Blog Marketing Digital M&P'
      }
    ]
  }
}

const articles = [
  {
    slug: 'whatsapp-business-ia-chile-2025',
    title: 'WhatsApp Business + IA en Chile 2025: Cómo Reducir el CAC con Flujos de Lead Scoring',
    excerpt: 'Aprende cómo usar WhatsApp Business + IA en Chile 2025 para reducir CAC con flujos de lead scoring y nurturing automatizado. Casos y playbook.',
    date: '2025-10-09',
    category: 'Automatización',
    readTime: '16 min',
    tag: 'WhatsApp & IA'
  },
  {
    slug: 'linkedin-ads-b2b-chile-2025',
    title: 'LinkedIn Ads para B2B de Alto Ticket en Chile: Segmentaciones, Costos y Playbooks',
    excerpt: 'Guía completa de LinkedIn Ads en Chile 2025 para negocios B2B de alto ticket. Segmentaciones, costos reales (CPL $20-50k) y playbooks de campañas exitosas.',
    date: '2025-10-09',
    category: 'LinkedIn Ads',
    readTime: '19 min',
    tag: 'B2B'
  },
  {
    slug: 'atribucion-metricas-chile-2025',
    title: 'Atribución y Métricas en Chile 2025: del CAC y LTV al Payback con Dashboards',
    excerpt: 'Aprende cómo medir CAC, LTV y Payback en Chile 2025 con dashboards en tiempo real y modelos de atribución data-driven. Casos reales y benchmarks locales.',
    date: '2025-10-09',
    category: 'Métricas',
    readTime: '17 min',
    tag: 'Analytics'
  },
  {
    slug: 'arbol-decision-marketing-mp-ia',
    title: 'El Árbol de Decisión de Marketing de M&P: Implementación Práctica con IA',
    excerpt: 'Descubre cómo funciona el Árbol de Decisión de M&P para marketing digital en Chile 2025. Variables, pasos de implementación e integración con IA.',
    date: '2025-10-09',
    category: 'Estrategia',
    readTime: '18 min',
    tag: 'IA & Automatización'
  },
  {
    slug: 'publicidad-digital-chile-2025-costos-industria-region',
    title: 'Publicidad Digital en Chile 2025: Costos Reales por Industria y Región',
    excerpt: 'Descubre los costos reales de publicidad digital en Chile 2025. Benchmarks de Google y Meta Ads por industria y región, con ejemplos locales y proyecciones.',
    date: '2025-10-09',
    category: 'Costos',
    readTime: '16 min',
    tag: 'Benchmarks'
  },
  {
    slug: 'errores-comunes-campanas-digitales-chile',
    title: '10 Errores Comunes en Campañas Digitales en Chile (y Cómo Evitarlos)',
    excerpt: 'Los 10 errores más comunes que cometen empresas chilenas en Google Ads y Meta Ads, y cómo evitarlos. Datos reales, ejemplos y soluciones prácticas.',
    date: '2025-10-09',
    category: 'Optimización',
    readTime: '14 min',
    tag: 'Optimización'
  },
  {
    slug: 'google-ads-vs-meta-ads-cual-elegir-chile-2025',
    title: 'Google Ads vs Meta Ads: Cuál Elegir en Chile 2025 (Comparativa Completa)',
    excerpt: 'Comparativa completa Google Ads vs Meta Ads en Chile 2025. CPL, ROAS, industrias ideales y cuándo usar cada plataforma. Datos reales de +200 campañas.',
    date: '2025-10-09',
    category: 'Comparativa',
    readTime: '16 min',
    tag: 'Comparativa'
  },
  {
    slug: 'tendencias-marketing-digital-chile-2025',
    title: 'Tendencias del Marketing Digital en Chile 2025: Paid Media, IA y Performance',
    excerpt: 'Conoce las principales tendencias del marketing digital en Chile 2025: paid media, inteligencia artificial, personalización y métricas de performance.',
    date: '2025-10-09',
    category: 'Tendencias',
    readTime: '18 min',
    tag: 'Tendencias 2025'
  },
  {
    slug: 'presupuesto-marketing-digital-chile-2025',
    title: 'Cómo Planificar el Presupuesto de Marketing Digital en Chile 2025',
    excerpt: 'Aprende a planificar el presupuesto de marketing digital en Chile 2025 con escenarios conservador, medio y agresivo, y benchmarks locales.',
    date: '2025-10-09',
    category: 'Presupuesto',
    readTime: '16 min',
    tag: 'Guía Completa'
  },
  {
    slug: 'tendencias-busqueda-marketing-digital-chile-2025',
    title: 'Tendencias de Búsqueda en Marketing Digital en Chile 2025: Agencias vs. Equipos Internos',
    excerpt: 'Descubre cómo en Chile 2025 crecen las búsquedas sobre agencias, equipos internos e híbridos en marketing digital, y cuál modelo conviene más.',
    date: '2025-10-09',
    category: 'Análisis',
    readTime: '14 min',
    tag: 'Insights'
  },
  {
    slug: 'correlaciones-inesperadas-marketing-digital',
    title: '15 Correlaciones Inesperadas en Marketing Digital que Desafían la Intuición',
    excerpt: 'Descubre 15 correlaciones inesperadas en marketing digital que contradicen la intuición y pueden transformar tu CAC, ROI y resultados.',
    date: '2025-10-09',
    category: 'Performance Marketing',
    readTime: '15 min',
    tag: 'Insights'
  },
  {
    slug: 'marketing-de-datos-no-es-un-juego',
    title: 'Marketing de Datos: No es un Juego, es Ingeniería',
    excerpt: 'El marketing de datos no es azar: requiere ingeniería, modelos de decisión y métricas claras para lograr resultados sostenibles en Chile.',
    date: '2025-10-09',
    category: 'Performance Marketing',
    readTime: '12 min',
    tag: 'Estrategia'
  },
  {
    slug: 'que-es-cac-como-calcularlo-reducirlo',
    title: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos)',
    excerpt: 'Qué es CAC: Cómo Calcularlo y Reducirlo en 2025 (Fórmulas + Ejemplos). Guía completa con ejemplos reales y datos de Chile 2025.',
    date: '2025-10-08',
    category: 'Performance Marketing',
    readTime: '12 min',
    tag: 'Guía'
  },
  {
    slug: 'estrategia-meta-ads-ecommerce-chile',
    title: 'Estrategia Meta Ads para E-commerce en Chile (ROI 8.5x Comprobado)',
    excerpt: 'Estrategia completa de Meta Ads para e-commerce: prospecting, retargeting, Advantage+ Shopping y 3 casos reales Chile con ROAS 6.2x-8.5x.',
    date: '2025-10-08',
    category: 'Meta Ads',
    readTime: '16 min',
    tag: 'Estrategia'
  },
  {
    slug: 'campanas-performance-max-google-ads-2025',
    title: 'Campañas Performance Max: Guía Completa Chile 2025',
    excerpt: 'Todo sobre Performance Max (PMax): cómo funcionan, cuándo usarlas, configuración paso a paso y 3 casos de éxito Chile con ROAS 6.2x-8.5x.',
    date: '2025-10-08',
    category: 'Google Ads',
    readTime: '18 min',
    tag: 'Guía Completa'
  },
  {
    slug: 'como-aumentar-conversiones-google-ads',
    title: 'Cómo Aumentar Conversiones en Google Ads en 30 Días (Guía 2025)',
    excerpt: 'Estrategias probadas para aumentar conversiones: optimización de Quality Score, ajuste de pujas, extensiones y mejora de landing pages. 2 casos reales Chile.',
    date: '2025-10-08',
    category: 'Google Ads',
    readTime: '15 min',
    tag: 'Optimización'
  },
  {
    slug: 'mejor-agencia-google-ads-santiago-2025',
    title: 'Mejor Agencia Google Ads Santiago 2025: Cómo Elegir (Guía Completa)',
    excerpt: 'Descubre cómo elegir la mejor agencia Google Ads en Santiago 2025. Checklist de verificación, señales de alerta y benchmarks reales.',
    date: '2025-01-20',
    category: 'Agencias',
    readTime: '18 min',
    tag: 'Guía Completa'
  },
  {
    slug: 'costo-google-ads-chile-2025',
    title: 'Costo Real de Google Ads en Chile 2025: Guía Completa por Industria',
    excerpt: 'Descubre cuánto cuesta Google Ads realmente en Chile 2025. Datos de +200 campañas: CPC, CPL, CPA por industria. Calculadora incluida.',
    date: '2025-01-15',
    category: 'Google Ads',
    readTime: '12 min',
    tag: 'Datos'
  },
  {
    slug: 'optimizar-roas-meta-ads-2025',
    title: 'Cómo Optimizar ROAS en Meta Ads 2025: 7 Estrategias Probadas',
    excerpt: 'Aumenta tu ROAS en Meta Ads con estas 7 estrategias validadas con data real. Casos de éxito +380% ROI en e-commerce y B2B Chile.',
    date: '2025-01-10',
    category: 'Meta Ads',
    readTime: '15 min',
    tag: 'Estrategia'
  },
  {
    slug: 'kpis-marketing-digital-chile',
    title: 'KPIs de Marketing Digital que SÍ Importan en 2025 (No Vanity Metrics)',
    excerpt: 'CAC, LTV, ROAS, CPL, CPA: aprende a medir lo que importa. Benchmarks por industria Chile 2025 + plantilla Google Sheets gratis.',
    date: '2025-01-05',
    category: 'Performance Marketing',
    readTime: '10 min',
    tag: 'Fundamentos'
  },
  {
    slug: 'agencia-performance-marketing-las-condes',
    title: 'Agencia Performance Marketing Las Condes: Top 5 y Cómo Elegir 2025',
    excerpt: 'Las mejores agencias de performance marketing en Las Condes 2025. Comparativa de servicios, precios y resultados reales.',
    date: '2025-01-03',
    category: 'Agencias',
    readTime: '14 min',
    tag: 'Comparativa'
  },
  {
    slug: 'agencia-marketing-digital-santiago-2025',
    title: 'Agencia Marketing Digital Santiago 2025: Guía de Selección Completa',
    excerpt: 'Cómo elegir agencia de marketing digital en Santiago. Precios, servicios, casos de éxito y checklist de evaluación.',
    date: '2025-01-02',
    category: 'Agencias',
    readTime: '16 min',
    tag: 'Guía'
  },
  {
    slug: 'cuanto-cuesta-agencia-marketing-digital-chile-2025',
    title: '¿Cuánto Cuesta una Agencia de Marketing Digital en Chile 2025?',
    excerpt: 'Precios reales de agencias de marketing digital en Chile 2025. Rangos por servicio, modelos de cobro y qué incluye cada paquete.',
    date: '2025-01-01',
    category: 'Precios',
    readTime: '11 min',
    tag: 'Precios'
  },
  {
    slug: 'youtube-ads-agencia-marketing-digital-chile-2025',
    title: 'YouTube Ads en Chile 2025: Cómo una Agencia de Marketing Digital Usa Video Performance para Aumentar Conversiones',
    excerpt: 'En Chile 2025, el consumo de video online alcanzó cifras históricas: más del 92% de los usuarios de internet ven YouTube al menos una vez al mes, y el tiempo promedio diario dedicado a la plataforma supera los 60 minutos. Para las marcas, YouTube ya no es solo un canal de branding.',
    date: '2025-01-10',
    category: 'Performance',
    readTime: '11 min',
    tag: 'YouTube Ads'
  },
  {
    slug: 'tiktok-ads-agencia-marketing-digital-chile-2025',
    title: 'TikTok Ads en Chile 2025: Cómo una Agencia de Marketing Digital Transforma Creatividad en Performance',
    excerpt: 'TikTok pasó de ser una red de entretenimiento juvenil a convertirse en la plataforma con mayor crecimiento en inversión publicitaria en Chile 2025. Su algoritmo basado en intereses y comportamiento de consumo lo hace ideal no solo para awareness, sino también para performance.',
    date: '2025-01-11',
    category: 'Performance',
    readTime: '9 min',
    tag: 'TikTok Ads'
  },
  {
    slug: 'google-performance-max-agencia-marketing-digital-chile-2025',
    title: 'Google Performance Max en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Automatización en Resultados',
    excerpt: 'En Chile 2025, Google Performance Max (PMax) ya no es una novedad: es la herramienta predilecta de Google Ads para centralizar campañas multicanal con inteligencia artificial. Pero su efectividad depende directamente de cómo se configure, qué data se alimente y cómo se mida el rendimiento.',
    date: '2025-01-12',
    category: 'Performance',
    readTime: '10 min',
    tag: 'Google Ads'
  },
  {
    slug: 'email-marketing-ia-agencia-marketing-digital-chile-2025',
    title: 'Email Marketing + IA en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Correos en ROI Real',
    excerpt: 'En 2025, mientras todos hablan de TikTok, YouTube o la inteligencia artificial generativa, hay un canal silencioso que sigue siendo uno de los más rentables en Chile: el email marketing. La diferencia hoy es que ya no se trata de enviar correos masivos y esperar resultados.',
    date: '2025-01-13',
    category: 'Performance',
    readTime: '9 min',
    tag: 'Email Marketing'
  },
  {
    slug: 'seo-ia-agencia-marketing-digital-chile-2025',
    title: 'SEO + IA en Chile 2025: Cómo una Agencia de Marketing Digital Logra Posicionar en Google y en Plataformas de Inteligencia Artificial',
    excerpt: 'El SEO en Chile 2025 ya no es solo aparecer en Google. Hoy, las decisiones de los usuarios pasan por múltiples buscadores: Google, YouTube, Amazon, TikTok, y —cada vez más— plataformas de inteligencia artificial como ChatGPT, Gemini o Meta AI.',
    date: '2025-01-14',
    category: 'Performance',
    readTime: '10 min',
    tag: 'SEO'
  },
  {
    slug: 'inbound-marketing-agencia-marketing-digital-chile-2025',
    title: 'Inbound Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Contenido en Clientes',
    excerpt: 'En un mercado cada vez más saturado de anuncios, los consumidores chilenos se han vuelto inmunes a la publicidad invasiva. Hoy, el 70% de los usuarios prefiere investigar por su cuenta antes de hablar con un vendedor.',
    date: '2025-01-15',
    category: 'Performance',
    readTime: '11 min',
    tag: 'Inbound'
  },
  {
    slug: 'retargeting-agencia-marketing-digital-chile-2025',
    title: 'Estrategias de Retargeting en Chile 2025: Cómo una Agencia de Marketing Digital Maximiza Conversiones',
    excerpt: 'En Chile 2025, conseguir tráfico ya no es el problema. Las empresas invierten millones en Google Ads, Meta Ads y TikTok Ads para atraer visitantes, pero el 95% de los usuarios abandona un sitio sin comprar ni dejar sus datos.',
    date: '2025-01-16',
    category: 'Performance',
    readTime: '9 min',
    tag: 'Retargeting'
  },
  {
    slug: 'marketing-automation-agencia-marketing-digital-chile-2025',
    title: 'Marketing Automation en Chile 2025: Cómo una Agencia de Marketing Digital Integra IA y CRM para Escalar Ventas',
    excerpt: 'En Chile 2025, la mayoría de las empresas ya entendió que sin automatización no hay escalabilidad. El marketing digital dejó de ser una serie de tareas manuales y pasó a ser un ecosistema de procesos conectados por IA y CRM.',
    date: '2025-01-17',
    category: 'Performance',
    readTime: '10 min',
    tag: 'Automatización'
  },
  {
    slug: 'customer-journey-agencia-marketing-digital-chile-2025',
    title: 'Customer Journey en Chile 2025: Cómo una Agencia de Marketing Digital Diseña Mapas de Decisión para Aumentar Conversiones',
    excerpt: 'En 2025, el marketing digital en Chile dejó de centrarse en "atraer clics" y evolucionó hacia algo más profundo: entender cómo deciden los clientes. Hoy, las empresas que no tienen claridad sobre el journey de sus consumidores pierden oportunidades, gastan de más en Ads y no logran fidelización.',
    date: '2025-01-18',
    category: 'Performance',
    readTime: '10 min',
    tag: 'Customer Journey'
  },
  {
    slug: 'dashboards-agencia-marketing-digital-chile-2025',
    title: 'Dashboards de Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Datos en Decisiones',
    excerpt: 'En Chile 2025, las gerencias ya no aceptan reportes de marketing llenos de impresiones, likes o clics sin contexto. Hoy, los directorios quieren ver marketing como si fueran estados financieros: ingresos, costos, margen y retorno.',
    date: '2025-01-19',
    category: 'Performance',
    readTime: '9 min',
    tag: 'Analytics'
  },
  {
    slug: 'benchmarking-agencia-marketing-digital-chile-2025',
    title: 'Benchmarking en Chile 2025: Cómo una Agencia de Marketing Digital Compara Industrias y Optimiza Inversión',
    excerpt: 'En marketing digital, no basta con mirar solo tus propias métricas. En Chile 2025, las empresas más competitivas son aquellas que comparan su rendimiento con benchmarks reales de la industria: CPC, CPL, CAC, LTV y ROAS en distintos sectores.',
    date: '2025-01-20',
    category: 'Performance',
    readTime: '9 min',
    tag: 'Benchmarks'
  },
  {
    slug: 'marketing-b2b-agencia-marketing-digital-chile-2025',
    title: 'Marketing B2B en Chile 2025: Cómo una Agencia de Marketing Digital Genera Leads de Alto Valor',
    excerpt: 'En Chile 2025, el marketing B2B dejó de ser "hacer un par de campañas en LinkedIn" para transformarse en un ecosistema completo donde cada lead debe ser tratado como una inversión estratégica. A diferencia del B2C, donde el ticket promedio puede ser bajo y la decisión rápida, en B2B hablamos de procesos largos, decisores múltiples y contratos millonarios.',
    date: '2025-01-21',
    category: 'Performance',
    readTime: '11 min',
    tag: 'B2B'
  },
  {
    slug: 'roi-roas-agencia-marketing-digital-chile-2025',
    title: 'Estrategias de ROI y ROAS en Chile 2025: Cómo una Agencia de Marketing Digital Mide lo que Importa',
    excerpt: 'En Chile 2025, hablar de marketing digital sin mencionar ROI y ROAS es como hablar de finanzas sin ver utilidades. Las empresas ya no se conforman con "alcance" o "me gusta": quieren entender cuánto dinero vuelve por cada peso invertido.',
    date: '2025-01-22',
    category: 'Performance',
    readTime: '10 min',
    tag: 'ROI & ROAS'
  },
  {
    slug: 'seo-agencia-marketing-digital-chile-2025',
    title: 'Estrategias de SEO en Chile 2025: Cómo una Agencia de Marketing Digital Combina Ads y Contenido para Dominar Búsquedas',
    excerpt: 'En Chile 2025, las búsquedas en Google y en plataformas de inteligencia artificial (ChatGPT, Gemini, Meta AI) se han convertido en el principal canal de descubrimiento de marcas y servicios. Sin embargo, la mayoría de las empresas sigue viendo SEO y Paid Media como estrategias separadas, cuando en realidad deben funcionar de manera integrada.',
    date: '2025-01-23',
    category: 'Performance',
    readTime: '10 min',
    tag: 'SEO'
  },
  {
    slug: 'tiktok-ads-agencia-marketing-digital-chile-2025-2',
    title: 'TikTok Ads en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Awareness en Ventas',
    excerpt: 'En Chile 2025, TikTok dejó de ser solo una red de bailes virales para transformarse en una de las plataformas publicitarias más rentables y con mayor crecimiento en inversión. Con más de 9 millones de usuarios activos en el país, y un tiempo promedio de consumo que supera los 70 minutos diarios, TikTok Ads se convirtió en un canal clave no solo para awareness, sino también para ventas directas.',
    date: '2025-01-24',
    category: 'Performance',
    readTime: '9 min',
    tag: 'TikTok Ads'
  },
  {
    slug: 'email-marketing-agencia-marketing-digital-chile-2025',
    title: 'Email Marketing en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Contactos en Ventas Recurrentes',
    excerpt: 'En Chile 2025, muchos piensan que el email marketing está "pasado de moda". Nada más lejos de la realidad. Los datos muestran que el email sigue siendo el canal con mayor ROI en marketing digital, superando incluso a Google y Meta Ads en retorno por peso invertido.',
    date: '2025-01-25',
    category: 'Performance',
    readTime: '10 min',
    tag: 'Email Marketing'
  },
  {
    slug: 'marketing-inmobiliario-agencia-marketing-digital-chile-2025',
    title: 'Marketing Inmobiliario en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Leads en Ventas de Alto Ticket',
    excerpt: 'En Chile 2025, el sector inmobiliario sigue siendo uno de los más competitivos y dinámicos del país. Con proyectos en Santiago, regiones emergentes como Temuco y Concepción, y polos turísticos como Pucón o La Serena, la competencia por captar compradores e inversionistas es feroz.',
    date: '2025-01-26',
    category: 'Performance',
    readTime: '11 min',
    tag: 'Inmobiliario'
  },
  {
    slug: 'marketing-contenidos-agencia-marketing-digital-chile-2025',
    title: 'Marketing de Contenidos en Chile 2025: Cómo una Agencia de Marketing Digital Convierte Blogs y Videos en Ventas',
    excerpt: 'En 2025, el marketing de contenidos ya no es publicar un par de artículos en un blog y esperar resultados. En Chile, donde la competencia digital crece cada mes, las marcas que logran diferenciarse son aquellas que transforman contenido en ventas reales, no en métricas de vanidad.',
    date: '2025-01-27',
    category: 'Performance',
    readTime: '10 min',
    tag: 'Contenidos'
  },
  {
    slug: 'marketing-saas-agencia-marketing-digital-chile-2025',
    title: 'Marketing para SaaS en Chile 2025: Cómo una Agencia de Marketing Digital Escala Suscripciones con Performance',
    excerpt: 'El mercado SaaS (Software as a Service) en Chile 2025 está en pleno auge. Desde soluciones de RRHH y contabilidad, hasta plataformas de e-commerce y logística, cada semana surgen nuevos competidores.',
    date: '2025-01-28',
    category: 'Performance',
    readTime: '11 min',
    tag: 'SaaS'
  },
  {
    slug: 'marketing-salud-agencia-marketing-digital-chile-2025',
    title: 'Marketing en Salud Privada en Chile 2025: Cómo una Agencia de Marketing Digital Capta Pacientes y Aumenta ROI',
    excerpt: 'En Chile 2025, la salud privada es uno de los sectores más competitivos y con mayor presión digital. Clínicas, centros médicos, laboratorios y especialistas invierten cada vez más en marketing para atraer pacientes, pero pocos logran diferenciarse en un mercado donde los usuarios comparan precios, disponibilidad y reputación online antes de tomar decisiones.',
    date: '2025-01-29',
    category: 'Performance',
    readTime: '10 min',
    tag: 'Salud'
  },
  {
    slug: 'marketing-educacion-agencia-marketing-digital-chile-2025',
    title: 'Marketing en Educación en Chile 2025: Cómo una Agencia de Marketing Digital Atrae Alumnos y Optimiza CAC',
    excerpt: 'En Chile 2025, la educación privada —desde colegios hasta universidades y plataformas de e-learning— se encuentra en un escenario de alta competencia. Los estudiantes y sus familias ya no toman decisiones basadas solo en cercanía o prestigio, sino que investigan online, comparan precios, revisan reseñas y buscan confianza en el proceso de admisión.',
    date: '2025-01-30',
    category: 'Performance',
    readTime: '10 min',
    tag: 'Educación'
  },
  {
    slug: 'marketing-retail-ecommerce-agencia-marketing-digital-chile-2025',
    title: 'Marketing en Retail y E-commerce en Chile 2025: Cómo una Agencia de Marketing Digital Escala Ventas con Performance',
    excerpt: 'En Chile 2025, el retail y el e-commerce viven un crecimiento explosivo impulsado por la digitalización, la logística avanzada y el cambio en hábitos de consumo. Desde grandes cadenas hasta pequeños comercios en regiones, todos compiten por atraer al mismo usuario: un comprador digital exigente que busca conveniencia, precio competitivo y confianza.',
    date: '2025-01-31',
    category: 'Performance',
    readTime: '10 min',
    tag: 'Retail'
  },
  {
    slug: 'marketing-turismo-hotel-agencia-marketing-digital-chile-2025',
    title: 'Marketing en Turismo y Hotelería en Chile 2025: Cómo una Agencia de Marketing Digital Llena Habitaciones y Tours',
    excerpt: 'El turismo en Chile 2025 está en plena recuperación y expansión. Con el auge del turismo interno, el regreso del turismo internacional y el crecimiento del ecoturismo en regiones como Magallanes, Atacama y Los Lagos, la competencia por captar viajeros es más intensa que nunca.',
    date: '2025-02-01',
    category: 'Performance',
    readTime: '10 min',
    tag: 'Turismo'
  },
  {
    slug: 'marketing-construccion-industria-agencia-marketing-digital-chile-2025',
    title: 'Marketing en Construcción e Industria en Chile 2025: Cómo una Agencia de Marketing Digital Genera Leads B2B de Alto Valor',
    excerpt: 'En Chile 2025, la construcción y la industria enfrentan un escenario desafiante: costos en alza, presión regulatoria y necesidad de atraer contratos de gran envergadura. Ya no basta con relaciones comerciales tradicionales: los directorios exigen procesos digitales que generen leads B2B de calidad, con reportería que justifique cada peso invertido.',
    date: '2025-02-02',
    category: 'Performance',
    readTime: '11 min',
    tag: 'Construcción'
  },
  {
    slug: 'marketing-agroindustria-agencia-marketing-digital-chile-2025',
    title: 'Marketing en Agroindustria en Chile 2025: Cómo una Agencia de Marketing Digital Potencia Exportaciones y Ventas Locales',
    excerpt: 'La agroindustria chilena es un motor clave de la economía: desde la fruta fresca hasta el vino, pasando por berries, frutos secos, salmonicultura y agroprocesados. En 2025, este sector enfrenta grandes oportunidades —como el crecimiento de exportaciones a Asia— pero también desafíos: mayores exigencias de trazabilidad, competencia internacional feroz y márgenes ajustados por costos logísticos.',
    date: '2025-02-03',
    category: 'Performance',
    readTime: '11 min',
    tag: 'Agroindustria'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" aria-label="Ir a inicio">
            <img
              src="/logo-color.png"
              alt="Muller y Pérez"
              className="h-11 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Blog de Marketing <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Data-Driven</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Estrategias, guías y casos de éxito basados en data real de +200 campañas en Chile
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Google Ads</span>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">Meta Ads</span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Performance</span>
            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">ROI & ROAS</span>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-1 gap-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {article.tag}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{article.category}</span>
                    </div>
                    <span className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Leer artículo <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-black mb-4">
            ¿Necesitas ayuda con tus campañas?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Agenda una reunión gratuita con nuestro equipo de expertos
          </p>
          <Link
            href="/#contacto"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            Solicitar Auditoría Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">© 2025 Muller y Pérez - Agencia de Marketing Digital y Performance</p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <Link href="/labs" className="hover:text-blue-600 transition-colors">M&P Labs</Link>
            <Link href="/utilidades" className="hover:text-blue-600 transition-colors">Utilidades</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
