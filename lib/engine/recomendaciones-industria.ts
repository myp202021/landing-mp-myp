// @ts-nocheck
/**
 * RECOMENDACIONES ESPECÍFICAS POR INDUSTRIA
 * Estrategias, creatividades, audiencias y tips de conversión
 */

export interface RecomendacionesIndustria {
  estrategia_principal: string
  tipo_campana_recomendada: string
  creatividades: string
  audiencias: string
  tip_conversion: string
}

export const RECOMENDACIONES_POR_INDUSTRIA: Record<string, RecomendacionesIndustria> = {

  ECOMMERCE: {
    estrategia_principal: "Combina Google Shopping para intención de compra con Meta Ads para descubrimiento. Remarketing dinámico es esencial.",
    tipo_campana_recomendada: "Performance Max + Advantage+ Shopping en Meta. Prioriza catálogo dinámico.",
    creatividades: "Videos cortos de producto (15-30s), carruseles con precios, UGC de clientes reales. Muestra envío gratis y garantías.",
    audiencias: "Lookalikes de compradores, remarketing carrito abandonado (1-7 días), intereses en marcas competidoras.",
    tip_conversion: "Implementa abandoned cart emails + remarketing agresivo en primeras 24h. Ofrece descuento por primera compra."
  },

  INMOBILIARIA: {
    estrategia_principal: "Google Search para búsquedas activas + Meta para awareness de proyectos. El ciclo largo requiere nurturing constante.",
    tipo_campana_recomendada: "Search con keywords de ubicación + Lead Ads en Meta con formularios precargados.",
    creatividades: "Tours virtuales 360°, videos de drone del sector, renders de alta calidad. Destaca m², ubicación y financiamiento.",
    audiencias: "Segmentos de ingresos altos, intereses en inversión, lookalikes de compradores previos, remarketing largo (30-90 días).",
    tip_conversion: "Ofrece asesoría gratuita de financiamiento. Implementa WhatsApp Business para respuesta inmediata a leads."
  },

  TURISMO: {
    estrategia_principal: "Campañas estacionales con picos en vacaciones. Google Search para búsqueda activa, Meta/YouTube para inspiración.",
    tipo_campana_recomendada: "Search por destino + Video campaigns en YouTube. Demand Gen en Google para awareness.",
    creatividades: "Videos inmersivos de destinos, carruseles de experiencias, testimonios de viajeros. Muestra precios todo incluido.",
    audiencias: "Intereses en viajes, lookalikes de reservas anteriores, remarketing de visitantes web, segmentos de ingresos medios-altos.",
    tip_conversion: "Urgencia con disponibilidad limitada. Remarketing agresivo 48h post-visita. Ofrece flexibilidad de cancelación."
  },

  GASTRONOMIA: {
    estrategia_principal: "Google Local para búsquedas 'cerca de mí' + Meta para promociones y eventos. El radio geográfico es clave.",
    tipo_campana_recomendada: "Local Services Ads + Campañas de alcance local en Meta. Google Maps optimizado.",
    creatividades: "Fotos de platos en alta calidad, videos de preparación, ambiente del local. Muestra ofertas del día y delivery.",
    audiencias: "Radio 5-10km del local, intereses gastronómicos, horarios de almuerzo/cena, remarketing de clientes anteriores.",
    tip_conversion: "Reservas online con confirmación inmediata. Ofertas de primera visita. Programa de fidelización visible."
  },

  AUTOMOTRIZ: {
    estrategia_principal: "Google Search para modelos específicos + YouTube para consideración. El test drive es el objetivo principal.",
    tipo_campana_recomendada: "Search por modelo/marca + Video Ads en YouTube. Performance Max para concesionarios.",
    creatividades: "Videos 360° del vehículo, comparativas, testimonios de propietarios. Destaca financiamiento y bono de permuta.",
    audiencias: "Intereses automotrices, búsquedas de modelos competidores, remarketing largo (60-90 días), ingresos medios-altos.",
    tip_conversion: "Test drive a domicilio como diferenciador. Cotización online instantánea. Seguimiento persistente por 90 días."
  },

  SALUD_MEDICINA: {
    estrategia_principal: "Google Search para síntomas y especialidades + Google Local para consultas 'cerca de mí'. Confianza es clave.",
    tipo_campana_recomendada: "Search por especialidad + Local Services. Evita Meta para temas sensibles (restricciones de política).",
    creatividades: "Perfiles de médicos, instalaciones, testimonios (con consentimiento). Destaca convenios y facilidades de pago.",
    audiencias: "Búsquedas de síntomas/tratamientos, geolocalización precisa, remarketing de visitantes, lookalikes de pacientes.",
    tip_conversion: "Agenda online 24/7. Confirmación por WhatsApp. Primera consulta con descuento o teleconsulta gratuita."
  },

  EDUCACION: {
    estrategia_principal: "Google Search para cursos específicos + Meta/LinkedIn para awareness de programas. Estacionalidad por períodos de matrícula.",
    tipo_campana_recomendada: "Search por carrera/curso + Lead Ads con formularios. LinkedIn para posgrados y ejecutivos.",
    creatividades: "Testimonios de egresados, campus tour, empleabilidad y sueldos de egresados. Muestra becas y financiamiento.",
    audiencias: "Edad según programa, padres (para pregrado), profesionales (para posgrado), intereses académicos, geolocalización.",
    tip_conversion: "Clase muestra gratuita. Asesoría vocacional sin costo. Descuento por matrícula anticipada."
  },

  MODA_RETAIL: {
    estrategia_principal: "Meta/TikTok para tendencias y discovery + Google Shopping para compra. El contenido visual es todo.",
    tipo_campana_recomendada: "Advantage+ Shopping en Meta + Google Shopping. TikTok Spark Ads con influencers.",
    creatividades: "Videos de outfit, UGC de clientes, behind the scenes, nuevas colecciones. Muestra tallas y política de cambio.",
    audiencias: "Intereses en moda, seguidor de influencers, lookalikes de compradores, remarketing de visitantes de categoría.",
    tip_conversion: "Envío gratis sobre X monto. Cambio fácil. Descuento primera compra. Email de carrito abandonado con incentivo."
  },

  FINTECH: {
    estrategia_principal: "Google Search para productos específicos + LinkedIn para B2B. La confianza y seguridad son fundamentales.",
    tipo_campana_recomendada: "Search por producto financiero + LinkedIn Lead Gen. Remarketing con casos de éxito.",
    creatividades: "Calculadoras interactivas, comparativas de tasas, testimonios de clientes, certificaciones de seguridad.",
    audiencias: "Búsquedas de créditos/inversión, profesionales en LinkedIn, lookalikes de clientes, remarketing de simuladores.",
    tip_conversion: "Simulador online instantáneo. Pre-aprobación en minutos. Tasa preferencial por solicitud online."
  },

  SERVICIOS_LEGALES: {
    estrategia_principal: "Google Search para casos específicos. La urgencia del problema legal impulsa la búsqueda activa.",
    tipo_campana_recomendada: "Search por tipo de caso + Local Services Ads. Evita Meta para temas legales sensibles.",
    creatividades: "Perfil del abogado, casos de éxito (sin identificar), especialidades, ubicación. Destaca primera consulta gratis.",
    audiencias: "Búsquedas de problemas legales específicos, geolocalización, remarketing de visitantes, profesionales B2B (corporativo).",
    tip_conversion: "Primera consulta gratuita. Respuesta en 24h garantizada. WhatsApp para consultas urgentes."
  },

  BELLEZA_PERSONAL: {
    estrategia_principal: "Meta/Instagram para awareness + Google Local para reservas. El contenido visual de resultados es clave.",
    tipo_campana_recomendada: "Reels y Stories en Meta + Google Local. Influencer marketing local.",
    creatividades: "Antes/después (con consentimiento), videos de procedimientos, instalaciones, equipo. Muestra promociones del mes.",
    audiencias: "Mujeres 25-55 (principalmente), intereses en belleza, seguidores de influencers beauty, geolocalización 10km.",
    tip_conversion: "Reserva online con horarios disponibles. Pack de bienvenida primera visita. Programa de referidos."
  },

  TECNOLOGIA_SAAS: {
    estrategia_principal: "Google Search para soluciones específicas + LinkedIn para decisores B2B. El contenido educativo genera leads.",
    tipo_campana_recomendada: "Search por problema/solución + LinkedIn Lead Gen. Content marketing con webinars.",
    creatividades: "Demos en video, casos de estudio, ROI calculators, comparativas con competencia. Destaca integraciones.",
    audiencias: "Títulos de trabajo específicos en LinkedIn, búsquedas de software, visitantes de competidores, remarketing largo.",
    tip_conversion: "Trial gratuito 14 días. Demo personalizada. Onboarding incluido. ROI garantizado o devolución."
  },

  CONSTRUCCION_REMODELACION: {
    estrategia_principal: "Google Search para proyectos específicos + Google Local. El portfolio de trabajos anteriores es decisivo.",
    tipo_campana_recomendada: "Search por tipo de proyecto + Local Services Ads. Meta para remarketing con portfolio.",
    creatividades: "Antes/después de proyectos, videos de proceso, testimonios de clientes, certificaciones y garantías.",
    audiencias: "Propietarios de viviendas, búsquedas de remodelación, geolocalización, remarketing de cotizaciones.",
    tip_conversion: "Cotización gratuita a domicilio. Garantía por escrito. Financiamiento propio. Muestras de materiales gratis."
  },

  DEPORTES_FITNESS: {
    estrategia_principal: "Meta/TikTok para motivación + Google Local para búsquedas de gimnasios. El contenido de transformación funciona.",
    tipo_campana_recomendada: "Video Ads en Meta/TikTok + Google Local. Influencers fitness locales.",
    creatividades: "Transformaciones de miembros, clases en acción, instalaciones, equipo de entrenadores. Muestra promoción de inscripción.",
    audiencias: "Intereses en fitness, resoluciones de año nuevo (enero), geolocalización 5km, remarketing de visitantes.",
    tip_conversion: "Semana gratis sin compromiso. Evaluación física gratuita. Congelamiento de membresía flexible."
  },

  VETERINARIA_MASCOTAS: {
    estrategia_principal: "Google Local para emergencias y servicios + Meta para productos y awareness. El contenido con mascotas genera alto engagement.",
    tipo_campana_recomendada: "Local Services + Google Shopping para productos. Meta con contenido de mascotas.",
    creatividades: "Fotos/videos de mascotas atendidas (con permiso), equipo veterinario, instalaciones, emergencias 24h.",
    audiencias: "Dueños de mascotas, intereses en cuidado animal, geolocalización 10km, remarketing de clientes.",
    tip_conversion: "Primera consulta con descuento. Plan de salud mensual. Emergencias 24/7. Recordatorios de vacunas automáticos."
  },

  MANUFACTURA_INDUSTRIAL: {
    estrategia_principal: "Google Search B2B + LinkedIn para decisores. El ciclo de venta largo requiere nurturing con contenido técnico.",
    tipo_campana_recomendada: "Search por producto/solución industrial + LinkedIn Lead Gen. Email nurturing.",
    creatividades: "Fichas técnicas, videos de producción, casos de estudio B2B, certificaciones de calidad.",
    audiencias: "Gerentes de compras/operaciones en LinkedIn, búsquedas técnicas específicas, industrias objetivo, remarketing largo.",
    tip_conversion: "Cotización en 24h. Muestras gratis. Visita a planta. Términos de pago flexibles."
  },

  LOGISTICA_TRANSPORTE: {
    estrategia_principal: "Google Search para servicios específicos + LinkedIn para carga empresarial. La cotización rápida es diferenciador.",
    tipo_campana_recomendada: "Search por ruta/servicio + LinkedIn para B2B. Remarketing con calculadora de costos.",
    creatividades: "Flota, cobertura geográfica, tiempos de entrega, tracking en tiempo real, certificaciones.",
    audiencias: "Gerentes de logística/compras, búsquedas de transporte de carga, empresas exportadoras/importadoras.",
    tip_conversion: "Cotización online instantánea. Tracking en tiempo real. Primer envío con descuento. Ejecutivo dedicado."
  },

  SEGUROS: {
    estrategia_principal: "Google Search para tipos de seguro específicos + comparadores. La confianza y el precio son decisivos.",
    tipo_campana_recomendada: "Search por tipo de seguro + Remarketing con cotizador. LinkedIn para seguros empresariales.",
    creatividades: "Calculadoras de prima, comparativas, cobertura detallada, proceso de siniestros, testimonios.",
    audiencias: "Búsquedas de seguros específicos, eventos de vida (auto nuevo, casa, hijo), profesionales para seguros de vida.",
    tip_conversion: "Cotización en 2 minutos. Comparativa con competencia. Asesor personal. Descuento por pago anual."
  },

  AGRICULTURA_AGROINDUSTRIA: {
    estrategia_principal: "Google Search para insumos específicos + LinkedIn para agroindustria. Estacionalidad por ciclos de siembra.",
    tipo_campana_recomendada: "Search por producto agrícola + YouTube para tutoriales. LinkedIn para maquinaria.",
    creatividades: "Rendimientos comprobados, testimonios de agricultores, demostraciones de producto, asesoría técnica.",
    audiencias: "Agricultores, gerentes de fundos, cooperativas agrícolas, búsquedas de insumos, geolocalización rural.",
    tip_conversion: "Asesoría técnica gratuita. Muestras de producto. Financiamiento de cosecha. Entrega en fundo."
  },

  SERVICIOS_PROFESIONALES: {
    estrategia_principal: "LinkedIn para decisores B2B + Google Search para servicios específicos. El contenido de autoridad genera confianza.",
    tipo_campana_recomendada: "LinkedIn Lead Gen + Search por servicio. Content marketing con casos de estudio.",
    creatividades: "Casos de éxito, equipo profesional, metodología, certificaciones, ROI de clientes anteriores.",
    audiencias: "Gerentes/directores en LinkedIn, búsquedas de servicios profesionales, industrias objetivo, remarketing.",
    tip_conversion: "Diagnóstico gratuito. Propuesta en 48h. Primer mes con descuento. Garantía de resultados."
  },

  ENERGIA_UTILITIES: {
    estrategia_principal: "Google Search para soluciones específicas + LinkedIn para proyectos B2B. El ROI y ahorro son argumentos clave.",
    tipo_campana_recomendada: "Search por solución energética + LinkedIn para decisores. Calculadoras de ahorro.",
    creatividades: "Casos de ahorro energético, instalaciones realizadas, certificaciones, simuladores de ROI, financiamiento.",
    audiencias: "Gerentes de operaciones/facilities, propietarios de empresas, búsquedas de eficiencia energética.",
    tip_conversion: "Auditoría energética gratuita. Simulador de ahorro. Financiamiento con ahorro. Garantía de rendimiento."
  },

  HOGAR_DECORACION: {
    estrategia_principal: "Meta/Pinterest para inspiración + Google Shopping para compra. El contenido visual aspiracional funciona.",
    tipo_campana_recomendada: "Advantage+ Shopping + Pinterest Ads. Google Shopping para productos específicos.",
    creatividades: "Ambientes decorados, videos de styling, antes/después, tendencias de temporada, ideas por espacio.",
    audiencias: "Intereses en decoración/hogar, nuevos propietarios, recién casados, lookalikes de compradores, remarketing.",
    tip_conversion: "Envío gratis sobre X monto. Asesoría de decoración gratis. Armado incluido. Garantía de devolución."
  }
}

/**
 * Obtiene las recomendaciones para una industria específica
 */
export function getRecomendacionesIndustria(industria: string): RecomendacionesIndustria | null {
  return RECOMENDACIONES_POR_INDUSTRIA[industria] || null
}
