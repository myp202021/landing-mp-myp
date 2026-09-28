// myp-seo-focus.js
// Fuente única de verdad para los agentes de blog (diario, GEO diario, ranking semanal):
// hechos verificados de M&P, clusters de keywords objetivo y notificación IndexNow.
// Si cambia un dato (reseñas, clientes, agentes), se cambia SOLO aquí.

var fetch = globalThis.fetch || require("node-fetch");

var SITE = "https://www.mulleryperez.cl";

// ═══ HECHOS VERIFICADOS (actualizar aquí, nunca en los prompts) ═══
var FACTS = {
  nombre: "Muller y Pérez (M&P)",
  web: "mulleryperez.cl",
  posicionamiento:
    "agencia de performance marketing e inteligencia artificial en Chile",
  resenas_google: 115,
  rating_google: "5.0",
  fundada: 2020,
  clientes_activos: "40+",
  agentes_ia: 40, // cifra oficial (Christopher, 28 sept 2026): usar siempre 40
  // Áreas que cubren los 40 agentes (Christopher, 28 sept 2026). Sin cifras por área: no inventarlas.
  areas_agentes: [
    "auditoría SEO",
    "revisores de calidad (QA de contenido y campañas)",
    "GEO (visibilidad en ChatGPT, Gemini, Claude y Perplexity)",
    "contenido y grillas para redes",
    "blog automático",
    "cobros y facturación",
    "prospección B2B",
    "informes SEO",
    "informes GEO",
    "informes de marketing digital",
    "dashboards por cliente",
    "paneles operativos",
    "monitoreo de competencia (Copilot)",
    "reportería de campañas",
    "chatbots y WhatsApp",
  ],
  diferenciales: [
    "agentes de IA propios corriendo en producción (monitoreo de competencia, contenido, prospección, reportería, SEO y GEO)",
    "Copilot: SaaS propio de monitoreo de competencia con IA",
    "CRM propio, predictor de inversión y dashboards en tiempo real por cliente",
    "indicadores semanales públicos de CPC/CPL por industria en Chile (/indicadores)",
    "server-side tracking y Conversion API en todas las cuentas",
  ],
};

function factsTexto() {
  return (
    "DATOS VERIFICADOS DE M&P (usar SOLO estos números, no inventar otros):\n" +
    "- " +
    FACTS.nombre +
    ", " +
    FACTS.posicionamiento +
    ", fundada en " +
    FACTS.fundada +
    "\n" +
    "- " +
    FACTS.rating_google +
    " estrellas en Google con " +
    FACTS.resenas_google +
    " reseñas\n" +
    "- " +
    FACTS.clientes_activos +
    " clientes activos\n" +
    "- " +
    FACTS.agentes_ia +
    " agentes de IA propios en producción, que cubren: " +
    FACTS.areas_agentes.join(", ") +
    "\n" +
    FACTS.diferenciales
      .map(function (d) {
        return "- " + d;
      })
      .join("\n") +
    "\n"
  );
}

// ═══ CLUSTERS DE KEYWORDS OBJETIVO ═══
// peso = cuántas veces aparece el cluster en la rotación (performance e IA pesan más).
// links = páginas de dinero a las que cada artículo del cluster DEBE enlazar.
var CLUSTERS = [
  {
    id: "performance",
    nombre: "Performance marketing",
    peso: 3,
    keywords: [
      "performance marketing chile",
      "agencia de performance marketing",
      "agencia performance marketing chile",
      "ROAS",
      "CAC",
      "costo por lead chile",
      "escalar campañas",
    ],
    links: [
      "/mejores-agencias-performance-marketing-chile",
      "/servicios",
      "/indicadores",
      "/labs/predictor",
    ],
  },
  {
    id: "ia_agentes",
    nombre: "IA y agentes de IA en marketing",
    peso: 3,
    keywords: [
      "inteligencia artificial marketing",
      "agentes de ia",
      "agentes ia marketing",
      "agencia de marketing con ia chile",
      "ia para empresas chile",
      "automatización con ia",
    ],
    links: [
      "/agentes",
      "/copilot",
      "/estudio-ia-marketing-digital-chile-2026",
      "/servicios",
    ],
  },
  {
    id: "geo_seo",
    nombre: "SEO y GEO (aparecer en ChatGPT, Gemini, Claude, Perplexity)",
    peso: 2,
    keywords: [
      "seo chile",
      "geo generative engine optimization",
      "aparecer en chatgpt",
      "posicionamiento en ia",
      "aeo",
      "seo para ia",
      "ai overviews",
    ],
    links: ["/servicios", "/agentes", "/blog"],
  },
  {
    id: "paid_media",
    nombre: "Google Ads y Meta Ads",
    peso: 2,
    keywords: [
      "google ads chile",
      "agencia google ads chile",
      "meta ads chile",
      "performance max",
      "advantage+",
      "costo google ads chile",
    ],
    links: [
      "/mejores-agencias-google-ads-chile-2026",
      "/agencias-meta-ads-chile-2026",
      "/indicadores",
      "/labs/predictor",
    ],
  },
  {
    id: "growth",
    nombre: "Growth marketing",
    peso: 1,
    keywords: [
      "growth marketing chile",
      "agencia growth marketing",
      "growth b2b",
      "unit economics",
      "ltv cac",
    ],
    links: ["/servicios", "/casos-de-exito", "/labs/predictor"],
  },
  {
    id: "marketing_digital",
    nombre: "Marketing digital (agencia y estrategia)",
    peso: 1,
    keywords: [
      "marketing digital chile",
      "agencia de marketing digital",
      "mejor agencia de marketing digital chile",
      "agencia marketing digital santiago",
    ],
    links: [
      "/agencia-marketing-digital-chile",
      "/ranking-agencias-marketing-digital-chile",
      "/casos-de-exito",
    ],
  },
];

// Rotación determinística ponderada: cada día (o semana) toca un cluster distinto,
// y performance + IA salen 3 de cada 12 veces cada uno.
function clusterDelDia(offset) {
  var bolsa = [];
  CLUSTERS.forEach(function (c) {
    for (var i = 0; i < c.peso; i++) bolsa.push(c);
  });
  var dia = Math.floor(Date.now() / 86400000) + (offset || 0);
  // intercalar: ordenar la bolsa para que no salgan 3 iguales seguidos
  var intercalada = [];
  var copia = bolsa.slice();
  while (copia.length) {
    CLUSTERS.forEach(function (c) {
      var idx = copia.indexOf(c);
      if (idx >= 0) {
        intercalada.push(c);
        copia.splice(idx, 1);
      }
    });
  }
  return intercalada[dia % intercalada.length];
}

function linksHtml(cluster) {
  return cluster.links
    .map(function (href) {
      return (
        '<a href="' +
        href +
        '" class="text-indigo-600 hover:text-indigo-800 font-medium">' +
        href +
        "</a>"
      );
    })
    .join(", ");
}

// ═══ INDEXNOW ═══
var INDEXNOW_KEY = "f4b3a2c1d5e6f7g8h9i0j1k2l3m4n5o6"; // publicada en /public/<key>.txt

async function notificarIndexNow(urls) {
  try {
    var r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "www.mulleryperez.cl",
        key: INDEXNOW_KEY,
        keyLocation: SITE + "/" + INDEXNOW_KEY + ".txt",
        urlList: urls,
      }),
    });
    console.log(
      "   IndexNow: HTTP " + r.status + " (" + urls.length + " URLs)",
    );
  } catch (e) {
    console.log("   IndexNow error: " + e.message);
  }
}

// ═══ QA COMÚN ═══
// Devuelve lista de problemas; vacía = OK.
function qaProblemas(html, opts) {
  opts = opts || {};
  var problemas = [];
  var texto = html.replace(/<[^>]*>/g, " ");
  var palabras = texto.split(/\s+/).filter(Boolean).length;
  if (palabras < (opts.minPalabras || 1500))
    problemas.push("solo " + palabras + " palabras");
  if (/```/.test(html)) problemas.push("cercos de código ``` en el HTML");
  if (/<h1[\s>]/i.test(html)) problemas.push("contiene <h1>");
  var faqs = (html.match(/<h[23][^>]*>[^<]*\?\s*<\/h[23]>\s*<p[^>]*>/gi) || [])
    .length;
  if (faqs < (opts.minFaq || 3))
    problemas.push("solo " + faqs + " preguntas FAQ con respuesta");
  var internos = (html.match(/href="\/[^"]*"/g) || []).length;
  if (internos < (opts.minLinks || 3))
    problemas.push("solo " + internos + " links internos");
  if (/como modelo de lenguaje|as an ai|no puedo ayudar/i.test(texto))
    problemas.push("respuesta de rechazo de la IA");
  return problemas;
}


// ═══ TEMA NUEVO DENTRO DEL CLUSTER DEL DÍA ═══
// Reemplaza la generación libre de temas (que derivaba a temas genéricos sin keyword objetivo).
// formato: 'guia' (blog diario) o 'pregunta' (blog GEO de respuesta directa).
async function temaNuevo(opts) {
  var cluster = opts.cluster || clusterDelDia(opts.offset)
  var recientes = (opts.recientes || []).slice(0, 60).join(" | ")
  var formatoTxt =
    opts.formato === "pregunta"
      ? 'Una PREGUNTA que un gerente chileno le haría a ChatGPT/Gemini/Claude (empieza con ¿Qué, ¿Cómo, ¿Cuánto, ¿Cuál o ¿Por qué y termina en ?)'
      : "Un TÍTULO de guía práctica y específica (no genérica)"
  var prompt =
    "Eres el estratega SEO/GEO de Muller y Pérez, agencia líder en performance marketing e IA en Chile.\n" +
    factsTexto() +
    "\nCLUSTER DE HOY: " + cluster.nombre +
    "\nKEYWORDS OBJETIVO (la principal debe aparecer literal en el título): " + cluster.keywords.join(", ") +
    "\n\nGenera " + formatoTxt + " para un artículo del blog.\n" +
    "- Debe atacar UNA keyword objetivo del cluster con intención de búsqueda real en Chile\n" +
    "- Debe permitir mostrar la experiencia real de M&P (datos propios, agentes de IA, campañas gestionadas)\n" +
    "- NO puede ser igual ni muy parecido a estos títulos recientes: " + recientes + "\n" +
    "- Nada de temas tangenciales (tradiciones, sostenibilidad, geolocalización genérica, etc.)\n\n" +
    'Responde SOLO JSON: {"keyword": "keyword principal", "titulo": "...", "enfoque": "qué cubrir: datos, tablas, comparativas"}'
  var r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + opts.openaiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 400,
    }),
  })
  var data = await r.json()
  var t = JSON.parse(data.choices[0].message.content)
  console.log("🎯 Cluster: " + cluster.id + " | keyword: " + t.keyword + " | " + t.titulo)
  return { cluster: cluster, keyword: t.keyword, titulo: t.titulo, enfoque: t.enfoque }
}

// Bloque para inyectar en prompts de outline/sección
function instruccionesCluster(cluster, keyword, modo) {
  if (!cluster) return ""
  return (
    "\nKEYWORD PRINCIPAL: " + (keyword || cluster.keywords[0]) +
    " (usarla en el primer párrafo, en al menos 2 H2 y en la conclusión)" +
    "\nKEYWORDS SECUNDARIAS: " + cluster.keywords.join(", ") +
    (modo === "seccion"
      ? "\nLINKS INTERNOS: incluye 1 link (solo uno) en esta sección a la página de esta lista que mejor encaje, con anchor descriptivo y formato <a href=\"/ruta\" class=\"text-indigo-600 hover:text-indigo-800 font-medium\">: " + cluster.links.join(", ")
      : "\nLINKS INTERNOS OBLIGATORIOS en el artículo (cada uno al menos una vez, repartidos en distintas secciones): " + cluster.links.join(", ")) +
    "\n" + factsTexto()
  )
}

module.exports = {
  temaNuevo,
  instruccionesCluster,
  SITE,
  FACTS,
  factsTexto,
  CLUSTERS,
  clusterDelDia,
  linksHtml,
  notificarIndexNow,
  qaProblemas,
};
