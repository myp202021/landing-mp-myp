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
      "/servicios/performance-marketing",
      "/indicadores",
      "/labs/predictor",
      "/casos-de-exito",
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
      "/agentes-ia",
      "/agentes",
      "/estudio-ia-marketing-digital-chile-2026",
      "/servicios/performance-marketing",
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
    links: [
      "/servicios/geo-chile",
      "/servicios/seo-chile",
      "/agentes",
    ],
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
      "/servicios/google-ads-chile",
      "/servicios/meta-ads-chile",
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
    links: [
      "/servicios/growth-marketing",
      "/casos-de-exito",
      "/labs/predictor",
    ],
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
      "/servicios",
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
var INDEXNOW_KEY = "272d893a828539aeac2e5cb3d64cbde9"; // publicada en /public/<key>.txt

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
  var faltas = faltasOrtografia(html);
  if (faltas.length) problemas.push("sin tilde/ñ: " + faltas.join(", "));
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

// ═══ PULIDO FINAL COMÚN (blog diario, GEO diario, ranking semanal) ═══

// Palabras que la IA a veces escribe sin tilde o sin ñ
var ACENTOS = {
  tecnologia: "tecnología", compania: "compañía", informacion: "información", metodologia: "metodología",
  analisis: "análisis", busqueda: "búsqueda", busquedas: "búsquedas", pagina: "página", paginas: "páginas",
  numero: "número", numeros: "números", ultimo: "último", ultimos: "últimos", unico: "único", unica: "única",
  estrategico: "estratégico", estrategicos: "estratégicos", tambien: "también", ademas: "además",
  diseno: "diseño", campana: "campaña", campanas: "campañas", pequenas: "pequeñas", segun: "según",
  despues: "después", rapido: "rápido", economico: "económico", metricas: "métricas", optimizacion: "optimización",
  automatizacion: "automatización", organico: "orgánico", espanol: "español", tecnica: "técnica",
  grafico: "gráfico", estadisticas: "estadísticas",
};
// Fuera de la lista: palabras que también son nombres de productos en inglés ("Conversion API", "inversion").
var SIN_TILDE = Object.keys(ACENTOS);

// Reemplazo seguro palabra por palabra, solo en el texto entre etiquetas (nunca en href ni atributos)
function acentuarTexto(html) {
  var rx = new RegExp("\\b(" + SIN_TILDE.join("|") + ")\\b", "gi");
  return String(html).replace(/>([^<]+)</g, function (m, texto) {
    return ">" + texto.replace(rx, function (w) {
      var r = ACENTOS[w.toLowerCase()];
      if (!r) return w;
      return w[0] === w[0].toUpperCase() ? r[0].toUpperCase() + r.slice(1) : r;
    }) + "<";
  });
}

function faltasOrtografia(html) {
  var t = " " + String(html).replace(/<[^>]*>/g, " ").toLowerCase() + " ";
  return SIN_TILDE.filter(function (w) {
    return new RegExp("[^a-záéíóúñü]" + w + "[^a-záéíóúñü]").test(t);
  });
}

async function corregirOrtografia(html, openaiKey) {
  var faltas = faltasOrtografia(html);
  if (!faltas.length) return html;
  console.log("   Corrigiendo tildes/ñ: " + faltas.join(", "));
  var r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + openaiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0,
      max_tokens: 16000,
      messages: [{ role: "user", content: "Corrige SOLO la ortografía (tildes y ñ) de este HTML en español de Chile. No cambies ninguna otra palabra, cifra, etiqueta ni atributo. Devuelve solo el HTML.\n\n" + html }],
    }),
  });
  var data = await r.json();
  var out = data.choices && data.choices[0] ? data.choices[0].message.content.replace(/```[a-z]*/gi, "").trim() : "";
  // Si la corrección recorta el artículo, se mantiene el original
  return out.length > html.length * 0.9 ? out : html;
}

function limpiarHtml(html) {
  return String(html)
    .replace(/```[a-z]*/gi, "")
    .replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, "<h2$1>$2</h2>")
    // caja CTA: la plantilla del blog ya trae el CTA "Conversemos"
    .replace(/<div class="bg-gradient-to-r[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/div>/gi, "")
    .trim();
}

async function urlResponde(url) {
  try {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 12000);
    var r = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; MPSourceVerifier/1.0; +https://www.mulleryperez.cl)" } });
    clearTimeout(t);
    return r.status < 400 || r.status === 403 || r.status === 429;
  } catch (e) {
    return false;
  }
}

// Busca en la web fuentes reales para el tema y devuelve solo las que responden.
async function buscarFuentes(tema, openaiKey) {
  var prompt = "Busca en la web entre 4 y 6 fuentes reales y actuales (estudios, informes, documentación oficial, estadísticas) " +
    "que respalden un artículo sobre: \"" + tema + "\" en Chile o Latinoamérica. Prioriza IAB Chile, Cámara de Comercio de Santiago, " +
    "Google, Meta, Statista, Kantar, CEPAL, INE, Subtel, HubSpot Research, Think with Google.\n" +
    'Responde SOLO JSON: {"fuentes": [{"nombre": "título exacto del estudio o página", "organizacion": "quién lo publica", "anio": 2026, "url": "URL exacta"}]}';
  var herramientas = ["web_search", "web_search_preview"];
  for (var i = 0; i < herramientas.length; i++) {
    try {
      var r = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: "Bearer " + openaiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4.1", input: prompt, tools: [{ type: herramientas[i] }] }),
      });
      if (!r.ok) continue;
      var data = await r.json();
      var texto = [];
      (data.output || []).forEach(function (it) {
        if (it.type === "message") (it.content || []).forEach(function (c) { if (c.type === "output_text") texto.push(c.text); });
      });
      var raw = texto.join("\n").replace(/```json|```/g, "");
      var j = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
      var ok = [];
      for (var k = 0; k < (j.fuentes || []).length; k++) {
        var f = j.fuentes[k];
        var url = String(f.url || "").replace(/[‐-―−]/g, "-").match(/https?:\/\/[^\s"“”'<>()]+/);
        if (url && (await urlResponde(url[0]))) { f.url = url[0]; ok.push(f); }
      }
      console.log("   Fuentes: " + ok.length + " verificadas de " + (j.fuentes || []).length);
      return ok;
    } catch (e) {
      console.log("   buscarFuentes (" + herramientas[i] + ") falló: " + e.message);
    }
  }
  return [];
}

function fuentesHtml(fuentes) {
  if (!fuentes || !fuentes.length) return "";
  var esc = function (x) { return String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };
  return '<div class="mt-12 pt-8 border-t border-gray-200"><h3 class="text-lg font-semibold text-gray-900 mb-4">Fuentes</h3><ul class="list-disc pl-6 mb-6 space-y-2">' +
    fuentes.map(function (f) {
      return '<li class="text-sm text-gray-600"><a href="' + esc(f.url) + '" target="_blank" rel="noopener nofollow" class="text-indigo-600 hover:text-indigo-800 font-medium">' +
        esc(f.nombre) + "</a>" + (f.organizacion ? " — " + esc(f.organizacion) : "") + (f.anio ? " (" + esc(f.anio) + ")" : "") + "</li>";
    }).join("") + "</ul></div>";
}

// Revisión editorial final con Claude. Devuelve el original si algo sale mal.
async function revisionEditorial(html, opts) {
  if (!opts.anthropicKey) { console.log("   Sin ANTHROPIC key: se omite revisión editorial"); return html; }
  var palabras = function (h) { return h.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length; };
  var antes = palabras(html);
  var prompt = "Eres el editor jefe del blog de Muller y Pérez. Revisa este artículo (" + antes + " palabras) titulado \"" + opts.titulo + "\" y devuélvelo corregido.\n\n" +
    factsTexto() + "\nCHECKLIST (aplica todo):\n" +
    "1. Elimina repeticiones: ideas, definiciones o párrafos que se repiten entre secciones. Cada sección aporta algo nuevo.\n" +
    "2. Elimina relleno y frases de IA: \"en el vertiginoso\", \"es fundamental\", \"sin lugar a dudas\", \"en conclusión\", \"paradigma\", \"panorama actual\".\n" +
    "3. Cifras de M&P: solo las de DATOS VERIFICADOS. Corrige cualquier otra.\n" +
    "4. No inventes estudios ni cites organizaciones como fuente de un dato si no está respaldado; usa \"según benchmarks del mercado chileno\".\n" +
    "5. Preguntas frecuentes: cada pregunta como <h3> terminando en ? seguida directamente de un <p> con la respuesta.\n" +
    "6. Sin <h1>, sin cajas de CTA, sin ``` ni markdown. Mantén todas las clases CSS, tablas y links internos existentes.\n" +
    "7. Ortografía impecable en español de Chile: tildes, ñ, signos de apertura ¿ ¡.\n" +
    "8. NO acortes el artículo: mantén su extensión (mínimo " + Math.round(antes * 0.9) + " palabras).\n\n" +
    "Responde SOLO con el HTML final.\n\n" + html;
  try {
    var r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": opts.anthropicKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: 32000, messages: [{ role: "user", content: prompt }] }),
    });
    var data = await r.json();
    // Sonnet 5 puede devolver primero un bloque "thinking": se toma el bloque de texto
    var bloque = (data.content || []).filter(function (b) { return b.type === "text" && b.text; })[0];
    if (!bloque) { console.log("   Revisión editorial sin texto: " + JSON.stringify(data).substring(0, 200)); return html; }
    if (data.stop_reason === "max_tokens") { console.log("   Revisión editorial cortada por largo: se mantiene el original"); return html; }
    var out = limpiarHtml(bloque.text);
    var despues = palabras(out);
    if (despues < antes * 0.85) { console.log("   Revisión editorial recortó " + antes + "→" + despues + " palabras: se mantiene el original"); return html; }
    console.log("   Revisión editorial OK: " + antes + " → " + despues + " palabras");
    return out;
  } catch (e) {
    console.log("   Revisión editorial falló: " + e.message);
    return html;
  }
}

// Orquesta el pulido: limpieza → revisión editorial → ortografía → fuentes verificadas
async function pulirArticulo(html, opts) {
  var out = limpiarHtml(html);
  out = await revisionEditorial(out, opts);
  out = await corregirOrtografia(out, opts.openaiKey);
  var fuentes = await buscarFuentes(opts.titulo, opts.openaiKey);
  // quitar cualquier bloque "Fuentes" previo sin links y poner el verificado
  out = out.replace(/<div class="mt-12 pt-8 border-t border-gray-200"><h3[^>]*>Fuentes<\/h3>[\s\S]*?<\/div>\s*$/i, "");
  var cierre = out.lastIndexOf("</div>");
  var bloque = fuentesHtml(fuentes);
  if (bloque) out = /^<div class="prose/.test(out) && cierre > 0 ? out.slice(0, cierre) + bloque + "\n</div>" : out + bloque;
  // Al final (después de agregar fuentes): ninguna tilde faltante debe botar un artículo
  return acentuarTexto(out);
}

module.exports = {
  pulirArticulo,
  faltasOrtografia,
  limpiarHtml,
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
