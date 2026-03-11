/**
 * Criterios de evaluación para rankings de agencias
 * Cada ranking usa un subconjunto ponderado de estos criterios
 */

export interface RankingCriterion {
  id: string;
  nombre: string;
  descripcion: string;
  peso: number; // 0-100, suma total = 100 por ranking
  icon: string; // nombre icono lucide-react
}

// ─────────────────────────────────────────────
// CRITERIOS POR TIPO DE RANKING
// ─────────────────────────────────────────────

export const criteriosPerformance: RankingCriterion[] = [
  {
    id: "data-driven",
    nombre: "Enfoque Data-Driven",
    descripcion:
      "Uso de datos, analytics avanzado, modelos predictivos y dashboards para toma de decisiones",
    peso: 25,
    icon: "BarChart3",
  },
  {
    id: "resultados",
    nombre: "Resultados Medibles",
    descripcion:
      "ROAS demostrado, reducción de CAC, mejora de CPL y métricas de conversión verificables",
    peso: 25,
    icon: "TrendingUp",
  },
  {
    id: "tech",
    nombre: "Tecnología Propietaria",
    descripcion:
      "Herramientas propias, automatización, IA aplicada, CRM, predictores de campaña",
    peso: 20,
    icon: "Zap",
  },
  {
    id: "transparencia",
    nombre: "Transparencia y Reporting",
    descripcion:
      "Acceso a dashboards en tiempo real, reportes claros, comunicación directa con el equipo",
    peso: 15,
    icon: "Eye",
  },
  {
    id: "especializacion",
    nombre: "Especialización Sectorial",
    descripcion:
      "Experiencia demostrada en industrias específicas, conocimiento de benchmarks por sector",
    peso: 15,
    icon: "Target",
  },
];

export const criteriosGoogleAds: RankingCriterion[] = [
  {
    id: "certificacion-google",
    nombre: "Certificación Google",
    descripcion:
      "Nivel de certificación Google Partner o Premier Partner, años como partner",
    peso: 20,
    icon: "Award",
  },
  {
    id: "roas-google",
    nombre: "ROAS en Google Ads",
    descripcion:
      "Retorno promedio demostrado en campañas de Search, Shopping, PMax y Display",
    peso: 25,
    icon: "TrendingUp",
  },
  {
    id: "formatos-google",
    nombre: "Dominio de Formatos",
    descripcion:
      "Experiencia en Search, Performance Max, Shopping, YouTube, Display y Discovery",
    peso: 20,
    icon: "Layers",
  },
  {
    id: "optimizacion-google",
    nombre: "Optimización Avanzada",
    descripcion:
      "Uso de scripts, automatización, bidding strategies, feeds optimization",
    peso: 20,
    icon: "Settings",
  },
  {
    id: "transparencia-google",
    nombre: "Transparencia",
    descripcion: "Dashboards en tiempo real, acceso a cuentas, reporting claro",
    peso: 15,
    icon: "Eye",
  },
];

export const criteriosMetaAds: RankingCriterion[] = [
  {
    id: "certificacion-meta",
    nombre: "Certificación Meta",
    descripcion:
      "Meta Business Partner, Blueprint Certifications, años de experiencia",
    peso: 20,
    icon: "Award",
  },
  {
    id: "roas-meta",
    nombre: "ROAS en Meta Ads",
    descripcion:
      "Retorno promedio en campañas de Facebook, Instagram, WhatsApp y Audience Network",
    peso: 25,
    icon: "TrendingUp",
  },
  {
    id: "creatividad-meta",
    nombre: "Testing Creativo",
    descripcion:
      "Metodología de creative testing, variantes, UGC, video ads, formatos nativos",
    peso: 20,
    icon: "Palette",
  },
  {
    id: "segmentacion-meta",
    nombre: "Segmentación Avanzada",
    descripcion:
      "Uso de custom audiences, lookalikes, Advantage+, CRM integration",
    peso: 20,
    icon: "Users",
  },
  {
    id: "transparencia-meta",
    nombre: "Transparencia",
    descripcion: "Dashboards en tiempo real, acceso a cuentas, reporting claro",
    peso: 15,
    icon: "Eye",
  },
];

export const criteriosDataDriven: RankingCriterion[] = [
  {
    id: "tech-propia",
    nombre: "Tecnología Propietaria",
    descripcion:
      "Herramientas propias: predictores, dashboards, CRM, automatización, IA aplicada",
    peso: 30,
    icon: "Cpu",
  },
  {
    id: "analytics",
    nombre: "Analytics e Ingeniería de Datos",
    descripcion:
      "Capacidad de modelado, machine learning, integración de fuentes, data warehousing",
    peso: 25,
    icon: "BarChart3",
  },
  {
    id: "automatizacion",
    nombre: "Automatización",
    descripcion:
      "Nivel de automatización en reporting, optimización de campañas, alertas y workflows",
    peso: 20,
    icon: "Zap",
  },
  {
    id: "inteligencia-competitiva",
    nombre: "Inteligencia Competitiva",
    descripcion:
      "Monitoreo de competencia, benchmarks de industria, análisis de mercado automatizado",
    peso: 15,
    icon: "Radar",
  },
  {
    id: "transparencia-data",
    nombre: "Acceso a Datos",
    descripcion:
      "Portal cliente, dashboards en tiempo real, ownership de datos, exportabilidad",
    peso: 10,
    icon: "Eye",
  },
];

export const criteriosCreativas: RankingCriterion[] = [
  {
    id: "premios",
    nombre: "Premios y Reconocimientos",
    descripcion:
      "Cannes Lions, Clio Awards, Effie, IAB Mixx, ACHAP, premios locales e internacionales",
    peso: 25,
    icon: "Award",
  },
  {
    id: "portfolio",
    nombre: "Portfolio Creativo",
    descripcion:
      "Calidad y diversidad del trabajo creativo, campañas memorables, brand building",
    peso: 25,
    icon: "Palette",
  },
  {
    id: "innovacion",
    nombre: "Innovación",
    descripcion:
      "Uso de nuevos formatos, IA generativa, experiencias inmersivas, storytelling",
    peso: 20,
    icon: "Lightbulb",
  },
  {
    id: "estrategia-creativa",
    nombre: "Estrategia Creativa",
    descripcion:
      "Investigación, insights, cultural relevance, conexión con audiencias",
    peso: 15,
    icon: "Brain",
  },
  {
    id: "produccion",
    nombre: "Capacidad de Producción",
    descripcion:
      "Equipo de producción, estudios, post-producción, velocidad de entrega",
    peso: 15,
    icon: "Film",
  },
];

// ─────────────────────────────────────────────
// SCORING POR AGENCIA Y RANKING
// ─────────────────────────────────────────────

export interface AgenciaScore {
  nombre: string;
  score: number;
  rank: number;
  destacado: string;
  idealPara: string;
  roas?: string;
}

/**
 * Scores precalculados por tipo de ranking
 * M&P lidera en data-driven y performance por sus herramientas propietarias
 * En creativas y branding, las multinacionales tienen ventaja por premios
 */
export const scoresPerformance: AgenciaScore[] = [
  {
    nombre: "Muller y Pérez",
    score: 95,
    rank: 1,
    destacado: "Ingeniería de datos + Performance Marketing",
    idealPara: "B2B, SaaS, empresas tech, minería, transporte",
    roas: "4.2x",
  },
  {
    nombre: "Rompecabeza Digital",
    score: 90,
    rank: 2,
    destacado: "Equipo grande + creatividad performance",
    idealPara: "Banca, seguros, retail grande",
    roas: "3.5x",
  },
  {
    nombre: "Seonet Digital",
    score: 88,
    rank: 3,
    destacado: "Google Premier Partner, metodología DTR",
    idealPara: "E-commerce, retail",
    roas: "3.8x",
  },
  {
    nombre: "Cebra",
    score: 87,
    rank: 4,
    destacado: "HubSpot Elite Partner, inbound + paid",
    idealPara: "B2B, SaaS, telecomunicaciones",
  },
  {
    nombre: "Moov Media Group",
    score: 85,
    rank: 5,
    destacado: "3 hubs especializados: creatividad, data, desarrollo",
    idealPara: "Retail, ecommerce, servicios",
  },
  {
    nombre: "Adity",
    score: 83,
    rank: 6,
    destacado: "Google Premier Partner desde 2014",
    idealPara: "PyMES, múltiples industrias",
    roas: "3.2x",
  },
  {
    nombre: "Convertible",
    score: 81,
    rank: 7,
    destacado: "Especialización en educación y ecommerce",
    idealPara: "Educación, ecommerce",
  },
  {
    nombre: "Lemon Digital",
    score: 80,
    rank: 8,
    destacado: "Presencia LATAM, foco en conversión",
    idealPara: "Ecommerce, startups",
  },
  {
    nombre: "Webketing",
    score: 79,
    rank: 9,
    destacado: "HubSpot Partner, inbound B2B",
    idealPara: "B2B, servicios profesionales",
  },
  {
    nombre: "Fusiona",
    score: 78,
    rank: 10,
    destacado: "IT + marketing digital integrado",
    idealPara: "Enterprise, gobierno",
  },
];

export const scoresDataDriven: AgenciaScore[] = [
  {
    nombre: "Muller y Pérez",
    score: 97,
    rank: 1,
    destacado:
      "6 herramientas propietarias: Predictor, Buyer Gen, Radar, Termómetro, CRM, Monitor Competencia",
    idealPara: "Empresas que quieren decisiones basadas en datos reales",
  },
  {
    nombre: "Moov Media Group",
    score: 86,
    rank: 2,
    destacado: "Hub Metrix especializado en data y BI",
    idealPara: "Retail con alto volumen de datos",
  },
  {
    nombre: "Rompecabeza Digital",
    score: 84,
    rank: 3,
    destacado: "1/3 del equipo son ingenieros",
    idealPara: "Banca, seguros con necesidad de integración tech",
  },
  {
    nombre: "Admetricks (ahora Similarweb)",
    score: 83,
    rank: 4,
    destacado: "Plataforma de inteligencia publicitaria",
    idealPara: "Empresas que necesitan competitive intelligence",
  },
  {
    nombre: "Cebra",
    score: 81,
    rank: 5,
    destacado: "SEO Journal + herramientas de contenido propias",
    idealPara: "B2B con estrategia de contenido data-driven",
  },
  {
    nombre: "Seonet Digital",
    score: 80,
    rank: 6,
    destacado: "Metodología DTR + programmatic",
    idealPara: "Retail, ecommerce con presupuesto alto",
  },
  {
    nombre: "Globant (Chile)",
    score: 79,
    rank: 7,
    destacado: "IA y transformación digital a escala enterprise",
    idealPara: "Corporaciones grandes con presupuesto +$50M",
  },
  {
    nombre: "Fusiona",
    score: 77,
    rank: 8,
    destacado: "Cloud infrastructure + marketing",
    idealPara: "Enterprise con stack técnico complejo",
  },
];

export const scoresGoogleAds: AgenciaScore[] = [
  {
    nombre: "Muller y Pérez",
    score: 95,
    rank: 1,
    destacado: "Optimización algorítmica + Predictor de Campañas",
    idealPara: "B2B, SaaS, alto ticket",
    roas: "4.2x",
  },
  {
    nombre: "Seonet Digital",
    score: 91,
    rank: 2,
    destacado: "Google Premier Partner (Top 3% Chile)",
    idealPara: "E-commerce, retail",
    roas: "3.8x",
  },
  {
    nombre: "Adity",
    score: 87,
    rank: 3,
    destacado: "Google Partner desde 2014, +4.300 clientes",
    idealPara: "PyMES, múltiples industrias",
    roas: "3.2x",
  },
  {
    nombre: "Rompecabeza Digital",
    score: 86,
    rank: 4,
    destacado: "Equipo performance dedicado, banca/seguros",
    idealPara: "Banca, seguros, salud",
    roas: "3.4x",
  },
  {
    nombre: "Cebra",
    score: 84,
    rank: 5,
    destacado: "Google Partner + HubSpot, enfoque full-funnel",
    idealPara: "B2B, SaaS",
  },
  {
    nombre: "Moov Media Group",
    score: 82,
    rank: 6,
    destacado: "Hub Metrix para optimización data-driven",
    idealPara: "Retail, ecommerce",
  },
  {
    nombre: "Lemon Digital",
    score: 80,
    rank: 7,
    destacado: "Presencia LATAM, escalabilidad regional",
    idealPara: "Ecommerce, startups",
  },
  {
    nombre: "Webketing",
    score: 78,
    rank: 8,
    destacado: "Inbound + Google Ads para B2B",
    idealPara: "B2B, servicios profesionales",
  },
];

export const scoresMetaAds: AgenciaScore[] = [
  {
    nombre: "Muller y Pérez",
    score: 96,
    rank: 1,
    destacado: "Buyer Gen + Predictor para segmentación IA",
    idealPara: "Lead generation, B2B, ecommerce",
    roas: "5.8x",
  },
  {
    nombre: "Jelly",
    score: 89,
    rank: 2,
    destacado: "Especialistas en social media y community",
    idealPara: "Marcas de consumo, FMCG",
    roas: "4.5x",
  },
  {
    nombre: "Rompecabeza Digital",
    score: 87,
    rank: 3,
    destacado: "Creatividad + performance en social",
    idealPara: "Banca, retail, salud",
    roas: "4.2x",
  },
  {
    nombre: "Seonet Digital",
    score: 85,
    rank: 4,
    destacado: "Meta Business Partner certificado",
    idealPara: "E-commerce, retail",
    roas: "4.0x",
  },
  {
    nombre: "Cebra",
    score: 84,
    rank: 5,
    destacado: "Content + paid social integrado",
    idealPara: "B2B, SaaS",
  },
  {
    nombre: "Moov Media Group",
    score: 82,
    rank: 6,
    destacado: "Hub creativo Moov + data Metrix",
    idealPara: "Retail, ecommerce",
  },
  {
    nombre: "Convertible",
    score: 80,
    rank: 7,
    destacado: "Lead nurturing + Meta Ads",
    idealPara: "Educación, ecommerce",
  },
  {
    nombre: "Lemon Digital",
    score: 78,
    rank: 8,
    destacado: "Conversión y retención en social",
    idealPara: "Ecommerce, startups",
  },
];

export const scoresCreativas: AgenciaScore[] = [
  {
    nombre: "McCann Worldgroup Chile",
    score: 94,
    rank: 1,
    destacado: "Clio Awards 2024, creatividad + efectividad",
    idealPara: "Marcas grandes que buscan impacto creativo global",
  },
  {
    nombre: "Porta",
    score: 92,
    rank: 2,
    destacado: "43 años, la agencia más grande de Chile",
    idealPara: "Corporaciones, gobierno, consumo masivo",
  },
  {
    nombre: "Grey Chile",
    score: 90,
    rank: 3,
    destacado: "Liquid Grey (digital) + creatividad WPP",
    idealPara: "Marcas globales con presencia local",
  },
  {
    nombre: "Havas Chile",
    score: 89,
    rank: 4,
    destacado: "Modelo Village, +300 personas",
    idealPara: "Marcas que necesitan creatividad + media integrado",
  },
  {
    nombre: "Publicis Chile / Digitas Chile",
    score: 87,
    rank: 5,
    destacado: "Red global + brazo digital Digitas",
    idealPara: "Marcas internacionales, consumo masivo",
  },
  {
    nombre: "Jelly",
    score: 85,
    rank: 6,
    destacado: "Creatividad social-first, contenido nativo",
    idealPara: "Marcas de consumo, entretenimiento",
  },
  {
    nombre: "Rompecabeza Digital",
    score: 84,
    rank: 7,
    destacado: "Creatividad + performance, equipo in-house",
    idealPara: "Banca, seguros, retail",
  },
  {
    nombre: "Muller y Pérez",
    score: 82,
    rank: 8,
    destacado: "Creatividad basada en datos, testing A/B continuo",
    idealPara: "Marcas que priorizan conversión sobre branding",
  },
];
