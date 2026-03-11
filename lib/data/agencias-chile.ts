/**
 * Ranking de Agencias de Marketing Digital en Chile
 * Datos recopilados: Marzo 2026
 * Fuentes: Clutch, Sortlist, AMDD, LinkedIn, sitios oficiales, prensa especializada
 *
 * NOTA: Los campos marcados con "~" son aproximados.
 * Los campos null indican que no se pudo verificar el dato.
 */

export interface AgenciaChile {
  nombre: string;
  website: string;
  fundada: number | null;
  ciudad: string;
  tamanoEquipo: string;
  tipo: "local" | "multinacional" | "martech";
  especialidades: string[];
  clientesNotables: string[];
  industriasFoco: string[];
  techPropia: string | null;
  certificaciones: string[];
  notas: string;
}

// ─────────────────────────────────────────────
// MULLER Y PÉREZ — Datos propios
// ─────────────────────────────────────────────
export const mullerYPerez: AgenciaChile = {
  nombre: "Muller y Pérez",
  website: "https://www.mulleryperez.cl",
  fundada: 2019,
  ciudad: "Santiago",
  tamanoEquipo: "3-10",
  tipo: "local",
  especialidades: [
    "performance marketing",
    "Google Ads",
    "Meta Ads",
    "ingeniería de datos",
    "modelado predictivo",
    "dashboards ejecutivos",
    "CRM propio",
    "inteligencia competitiva",
  ],
  clientesNotables: [
    "Cobreloa",
    "Buses Hualpén",
    "Genera HR",
    "Klapp",
    "Forcmin",
    "Pacific Mining Parts",
    "Atacama Experience",
    "Empresas Tecnomat",
  ],
  industriasFoco: [
    "minería",
    "transporte",
    "SaaS",
    "inmobiliaria",
    "finanzas",
    "automotriz",
    "educación",
    "turismo",
  ],
  techPropia:
    "Predictor de Campañas (CPC/CPA por industria), Buyer Gen (segmentación IA), Radar de Industrias (benchmarks), Termómetro Marketing Digital Chile (indicadores semanales), CRM con portal cliente, Monitor de Competencia automatizado",
  certificaciones: ["Google Partner"],
  notas:
    "Agencia boutique data-driven con +40 clientes activos en +20 industrias. Fee fijo mensual ($950.000-$1.900.000 + IVA). Modelo: estrategia + datos + resultados medibles cada mes. ROI promedio +380%. Retención de clientes 95%.",
};

export const agenciasChile: AgenciaChile[] = [
  // ─────────────────────────────────────────────
  // AGENCIAS LOCALES CHILENAS
  // ─────────────────────────────────────────────
  {
    nombre: "Rompecabeza Digital",
    website: "https://www.rompecabeza.cl",
    fundada: 2016,
    ciudad: "Santiago",
    tamanoEquipo: "~140",
    tipo: "local",
    especialidades: [
      "performance marketing",
      "creatividad",
      "UX/UI",
      "desarrollo web",
      "data analytics",
    ],
    clientesNotables: [
      "Scotiabank",
      "Santander",
      "Vitamina",
      "Consorcio",
      "Hábitat",
      "Carl's Jr",
      "Flex",
      "Alborada",
    ],
    industriasFoco: ["banca", "seguros", "salud", "inmobiliaria", "retail"],
    techPropia: null,
    certificaciones: [],
    notas:
      "Fundada por Ariel Jeria y Yerko Halat. ~45 clientes activos. Equipo 1/3 ingenieros, 1/3 diseñadores, 1/3 contenido. Miembro AMDD.",
  },
  {
    nombre: "Cebra",
    website: "https://www.cebra.com",
    fundada: 2014,
    ciudad: "Santiago",
    tamanoEquipo: "~100",
    tipo: "local",
    especialidades: [
      "inbound marketing",
      "demand generation",
      "CRM/HubSpot",
      "SEO",
      "paid media",
      "desarrollo web",
      "influencer marketing",
    ],
    clientesNotables: [
      "Carozzi",
      "Tenpo",
      "Entel Empresas",
      "Skechers",
      "Nissan",
      "Assistcard",
      "Masisa",
      "Acepta (Sovos)",
    ],
    industriasFoco: ["retail", "fintech", "telecomunicaciones", "automotriz"],
    techPropia: "The Creators (content), Smartwe, SEO Journal",
    certificaciones: [
      "HubSpot Elite Partner",
      "HubSpot Partner of the Year",
      "Google Partner",
      "Facebook Partner",
      "IAB Chile",
      "Gold IAB Mixx 2025",
    ],
    notas:
      "Presencia en Chile, Colombia, Perú, USA, Brasil (Rev360), España (Esmartia), México (MediaSource). ~10 años operando. Empresa B certificada.",
  },
  {
    nombre: "IDA (Ideas Digitales Aplicadas)",
    website: "https://www.ida.cl",
    fundada: 2010,
    ciudad: "Santiago (Providencia)",
    tamanoEquipo: "10-20",
    tipo: "local",
    especialidades: [
      "UX/UI design",
      "desarrollo web",
      "estrategia digital",
      "diseño centrado en personas",
    ],
    clientesNotables: ["Fundación América Solidaria"],
    industriasFoco: ["ONGs", "gobierno", "educación"],
    techPropia: "Metodología Diseño Centrado en las Personas (HCD)",
    certificaciones: [],
    notas:
      "Equipo multidisciplinario: periodistas, diseñadores, desarrolladores. Dirección: Doctor Torres Boonen 562, Providencia.",
  },
  {
    nombre: "Jelly",
    website: "https://www.jelly.cl",
    fundada: 2010,
    ciudad: "Santiago (Vitacura)",
    tamanoEquipo: "~52",
    tipo: "local",
    especialidades: [
      "community management",
      "social media",
      "content creation",
      "social listening",
      "influencer marketing",
      "estrategia digital",
    ],
    clientesNotables: [
      "Colun",
      "Sony Music",
      "Dávila",
      "Pilares (Socovesa)",
      "Agrosuper",
      "CGE",
      "Liquimax",
    ],
    industriasFoco: ["alimentación", "música", "inmobiliaria", "energía"],
    techPropia: null,
    certificaciones: [],
    notas:
      "Se define como 'agencia con alma digital'. Av. Presidente Kennedy 5770 Of. 1018, Vitacura.",
  },
  {
    nombre: "Fusiona",
    website: "https://fusiona.cl",
    fundada: 2009, // ~17 años al 2026
    ciudad: "Santiago (Providencia)",
    tamanoEquipo: "50-100",
    tipo: "local",
    especialidades: [
      "estrategia digital",
      "desarrollo web",
      "cloud infrastructure (AWS, Azure, GCP)",
      "UX/UI",
      "digital staffing",
      "marketing digital",
    ],
    clientesNotables: [], // +120 marcas, no se especifican públicamente
    industriasFoco: ["enterprise", "gobierno", "retail", "banca"],
    techPropia: null,
    certificaciones: [],
    notas:
      "+120 marcas clientes. Satisfacción >85%. Combina IT consulting + marketing. Oficinas en Providencia.",
  },
  {
    nombre: "Moov Media Group",
    website: "https://moovmediagroup.com",
    fundada: 2012,
    ciudad: "Santiago (Las Condes)",
    tamanoEquipo: "51-200",
    tipo: "local",
    especialidades: [
      "marketing omnicanal",
      "data analytics",
      "business intelligence",
      "paid media",
      "UX/UI",
      "marketing automation",
      "branding",
      "ecommerce",
    ],
    clientesNotables: [],
    industriasFoco: ["retail", "servicios", "ecommerce"],
    techPropia: "Estructura de 3 Hubs: Moov (creatividad), Metrix (data), Forma (desarrollo)",
    certificaciones: ["ACHAP Agencia que Inspira"],
    notas:
      "Grupo de empresas: Moov + Metrix + Forma. Apoquindo 4660, Las Condes. Reconocida por ACHAP.",
  },
  {
    nombre: "Webketing",
    website: "https://www.webketing.cl",
    fundada: null, // no verificado
    ciudad: "Santiago",
    tamanoEquipo: "11-50",
    tipo: "local",
    especialidades: [
      "inbound marketing",
      "inbound sales",
      "SEO",
      "Google Ads",
      "Facebook Ads",
      "web design",
    ],
    clientesNotables: [],
    industriasFoco: ["B2B"],
    techPropia: null,
    certificaciones: ["HubSpot Partner", "Google Partner"],
    notas:
      "Presencia en Chile, Argentina, Colombia, Brasil. Enfoque B2B. También opera como RevOps Latam (HubSpot).",
  },
  {
    nombre: "Seonet Digital",
    website: "https://www.seonetdigital.com",
    fundada: null, // ~19 años de trayectoria al 2026 => ~2007
    ciudad: "Santiago (Las Condes)",
    tamanoEquipo: "50+",
    tipo: "local",
    especialidades: [
      "SEO",
      "Google Ads",
      "social media ads",
      "diseño web",
      "programmatic advertising",
    ],
    clientesNotables: ["Royal Canin", "ADT", "Vittal"],
    industriasFoco: ["retail", "salud", "seguridad", "mascotas"],
    techPropia: null,
    certificaciones: [
      "Google Premier Partner",
      "Google Premier Partner Awards (Search Excellence)",
      "Facebook Marketing Partners",
    ],
    notas:
      "Presencia en 6 países LATAM. +1.500 proyectos. Premio de manos de VP Google América en Nueva York.",
  },
  {
    nombre: "Convertible",
    website: "https://convertible.cl",
    fundada: null, // sitio activo desde ~2020
    ciudad: "Santiago",
    tamanoEquipo: "10-30",
    tipo: "local",
    especialidades: [
      "performance marketing",
      "inbound marketing",
      "lead nurturing",
      "branding",
      "estrategia de campañas",
    ],
    clientesNotables: [],
    industriasFoco: ["educación", "ecommerce"],
    techPropia: null,
    certificaciones: [],
    notas:
      "Foco en resultados digitales medibles. Metodología: diagnóstico, desarrollo de campañas, definición de KPIs.",
  },
  {
    nombre: "Porta",
    website: "https://www.porta.cl",
    fundada: 1981,
    ciudad: "Santiago",
    tamanoEquipo: "~150",
    tipo: "local",
    especialidades: [
      "publicidad masiva",
      "branding",
      "diseño",
      "producción digital",
      "diseño industrial",
      "producción audiovisual",
      "marketing promocional",
      "biometría",
    ],
    clientesNotables: [
      "Copec",
      "VTR",
      "Cristal",
      "Escudo",
      "TVN",
      "Falabella",
      "Cruz Verde",
      "Watts",
      "LATAM",
      "Banco Falabella",
      "Lexus",
      "Gobierno de Chile",
    ],
    industriasFoco: [
      "energía",
      "telecomunicaciones",
      "retail",
      "banca",
      "consumo masivo",
      "gobierno",
    ],
    techPropia: "División de biometría aplicada a marketing",
    certificaciones: [],
    notas:
      "Una de las dos agencias más grandes de Chile por volumen. Grupo multidisciplinario con varias empresas bajo el paraguas Porta.",
  },

  // ─────────────────────────────────────────────
  // MULTINACIONALES CON OFICINA EN CHILE
  // ─────────────────────────────────────────────
  {
    nombre: "Havas Chile",
    website: "https://cl.havas.com",
    fundada: null, // +20 años en Chile
    ciudad: "Santiago",
    tamanoEquipo: "300+",
    tipo: "multinacional",
    especialidades: [
      "creatividad",
      "media",
      "publicidad",
      "digital",
      "data",
    ],
    clientesNotables: [], // +100 marcas
    industriasFoco: ["todas las categorías"],
    techPropia: 'Modelo "Village" (creatividad + media + especialidades en un lugar)',
    certificaciones: [],
    notas:
      "+20 años en Chile. +300 personas. +100 marcas. Modelo Village integrado. Parte de Havas Group (Vivendi).",
  },
  {
    nombre: "VML Chile (ex Wunderman Thompson + VMLY&R)",
    website: "https://www.vml.com/es/chile",
    fundada: null, // fusión 2023-2024, ambas con décadas en Chile
    ciudad: "Santiago",
    tamanoEquipo: "100-200",
    tipo: "multinacional",
    especialidades: [
      "creatividad",
      "consultoría",
      "tecnología",
      "data",
      "CRM",
      "commerce",
      "social media",
      "brand strategy",
    ],
    clientesNotables: [],
    industriasFoco: ["consumo masivo", "tecnología", "retail"],
    techPropia: null,
    certificaciones: [],
    notas:
      "Resultado de la fusión de Wunderman Thompson Chile y VMLY&R Chile. Parte de WPP.",
  },
  {
    nombre: "McCann Worldgroup Chile",
    website: "https://mccann.cl",
    fundada: null, // McCann global desde 1912, presencia histórica en Chile
    ciudad: "Santiago",
    tamanoEquipo: "50-150",
    tipo: "multinacional",
    especialidades: [
      "creatividad",
      "digital (MRM)",
      "producción (Craft)",
      "estrategia de marca",
    ],
    clientesNotables: ["NotCo"],
    industriasFoco: ["foodtech", "consumo masivo", "tecnología"],
    techPropia: null,
    certificaciones: [
      "SCOPEN: líder en Creatividad Efectiva",
      "Clio Awards 2024 (2 oro, 3 plata, 1 bronce - MRM para NotCo)",
    ],
    notas:
      "Integra McCann + MRM (digital) + Craft (producción). CEO: Pablo Sommer. CCO: Leo Chiesi. Parte de IPG.",
  },
  {
    nombre: "Grey Chile",
    website: "https://grey.com/chile",
    fundada: null,
    ciudad: "Santiago (Las Condes)",
    tamanoEquipo: "30-80",
    tipo: "multinacional",
    especialidades: [
      "publicidad",
      "creatividad",
      "digital",
      "brand strategy",
    ],
    clientesNotables: ["Coca-Cola Chile"],
    industriasFoco: ["consumo masivo", "salud", "retail"],
    techPropia: null,
    certificaciones: [],
    notas:
      "Parte de WPP. División digital: Liquid Grey. Av. Orinoco 90 Piso 6, Las Condes.",
  },
  {
    nombre: "DDB Chile",
    website: "https://www.ddb.com",
    fundada: null,
    ciudad: "Santiago",
    tamanoEquipo: "30-80",
    tipo: "multinacional",
    especialidades: [
      "creatividad",
      "estrategia digital",
      "publicidad",
    ],
    clientesNotables: [],
    industriasFoco: [],
    techPropia: null,
    certificaciones: [],
    notas:
      "Parte de Omnicom Group. Especializada en Digital Strategy según Agency Spotter. Info pública limitada para operación Chile.",
  },
  {
    nombre: "Publicis Chile / Digitas Chile",
    website: "https://www.publicis.cl",
    fundada: null, // Digitas Chile lanzada en 2022
    ciudad: "Santiago (Las Condes)",
    tamanoEquipo: "50-150",
    tipo: "multinacional",
    especialidades: [
      "publicidad",
      "marketing digital",
      "data analytics",
      "CRM",
      "media",
      "creatividad",
      "tecnología",
    ],
    clientesNotables: [
      "Nescafé",
      "Maggi",
      "Nestlé",
      "Samsung",
      "Stellantis",
      "Oreo",
      "Visa",
      "Smirnoff",
      "Sprite",
    ],
    industriasFoco: [
      "alimentación",
      "tecnología",
      "automotriz",
      "finanzas",
      "consumo masivo",
    ],
    techPropia: null,
    certificaciones: [],
    notas:
      "Publicis Groupe lanzó Digitas en Chile en oct 2022. Digitas = brazo digital integrado. Parte de Publicis Groupe.",
  },
  {
    nombre: "Globant (Chile)",
    website: "https://www.globant.com",
    fundada: null, // oficina Chile ~2016-2017
    ciudad: "Santiago (Las Condes) + Viña del Mar",
    tamanoEquipo: "1300+",
    tipo: "multinacional",
    especialidades: [
      "transformación digital",
      "desarrollo de software",
      "consultoría digital",
      "IA",
      "data",
      "UX/UI",
    ],
    clientesNotables: [],
    industriasFoco: ["enterprise", "banca", "retail", "telecomunicaciones"],
    techPropia: "Plataformas propias de IA y digital transformation studios",
    certificaciones: [],
    notas:
      "+1.300 profesionales en Chile. Oficinas en Costanera Center y Av. Apoquindo 5950. No es agencia de marketing pura, pero compite en transformación digital.",
  },

  // ─────────────────────────────────────────────
  // MARTECH / TECH PROPIETARIA
  // ─────────────────────────────────────────────
  {
    nombre: "Admetricks (ahora Similarweb)",
    website: "https://www.admetricks.com",
    fundada: 2012,
    ciudad: "Santiago",
    tamanoEquipo: "30-60",
    tipo: "martech",
    especialidades: [
      "ad intelligence",
      "competitive intelligence publicitaria",
      "media planning",
      "SaaS",
    ],
    clientesNotables: [],
    industriasFoco: [
      "automotriz",
      "banca",
      "telecomunicaciones",
      "retail",
      "agencias",
      "medios",
    ],
    techPropia:
      "Admetricks Ad Intelligence (estimación inversión publicitaria competidores), Admetricks Media Planner",
    certificaciones: [],
    notas:
      "Fundada por Felipe del Sol (CEO) y Patricio del Sol (CTO). Adquirida por Similarweb en marzo 2024. No es agencia, sino plataforma SaaS de inteligencia publicitaria.",
  },

  // ─────────────────────────────────────────────
  // OTRAS AGENCIAS MENCIONADAS EN RANKINGS
  // ─────────────────────────────────────────────
  {
    nombre: "Adity",
    website: "https://adity.cl",
    fundada: null, // +10 años al 2022 => ~2012
    ciudad: "Santiago",
    tamanoEquipo: "10-50",
    tipo: "local",
    especialidades: [
      "SEO orgánico",
      "marketing automation",
      "social media advertising",
      "web analytics",
    ],
    clientesNotables: [],
    industriasFoco: [],
    techPropia: null,
    certificaciones: ["Google Premier Partner (desde 2014)"],
    notas: "+10 años en el mercado. Google Premier Partner desde 2014.",
  },
  {
    nombre: "Lemon Digital",
    website: "https://lemon.digital",
    fundada: null,
    ciudad: "Santiago",
    tamanoEquipo: "10-50",
    tipo: "local",
    especialidades: [
      "lead conversion",
      "atracción de usuarios",
      "retención y fidelización",
    ],
    clientesNotables: [],
    industriasFoco: [],
    techPropia: null,
    certificaciones: [],
    notas:
      "Presencia en Chile, Argentina, Colombia, Perú, México y USA. Foco en conversión.",
  },
];

// ─────────────────────────────────────────────
// Resumen estadístico
// ─────────────────────────────────────────────
export const resumenRanking = {
  totalAgencias: agenciasChile.length,
  fechaRecopilacion: "2026-03-10",
  fuentes: [
    "Clutch.co",
    "Sortlist",
    "NichoSEO",
    "AMDD Chile",
    "Agency Partners",
    "Semrush Agency Directory",
    "GoodFirms",
    "LinkedIn",
    "Sitios oficiales de cada agencia",
    "Prensa: BioBioChile, Adlatina, La Tercera, Publimark",
  ],
  categorias: {
    localesChilenas: agenciasChile.filter((a) => a.tipo === "local").length,
    multinacionales: agenciasChile.filter((a) => a.tipo === "multinacional")
      .length,
    martech: agenciasChile.filter((a) => a.tipo === "martech").length,
  },
  conTechPropia: agenciasChile.filter((a) => a.techPropia !== null).length,
};
