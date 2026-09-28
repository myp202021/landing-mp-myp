// ranking-agencias-verificado.js
// Ranking MENSUAL de agencias de marketing digital en Chile donde cada dato tiene fuente verificable.
//
// Por qué existe: los rankings que circulan (incluidos los de otras agencias) no citan fuentes.
// Aquí:
//   1. OpenAI con búsqueda web investiga cada agencia y SOLO acepta datos con URL de fuente.
//   2. Cada URL se comprueba (HTTP). Si no responde, el dato se descarta ("sin información pública").
//   3. El puntaje lo calcula este código con reglas fijas (no la IA opinando): reproducible y auditable.
//   4. Las tablas se arman desde los datos; la IA solo redacta perfiles a partir del JSON verificado.
//   5. Se guarda un snapshot mensual en data/ranking-agencias/AAAA-MM.json para calcular movimientos
//      (sube/baja vs mes anterior) y para que cualquiera pueda auditar el ranking.
//
// Cron: día 1 de cada mes (.github/workflows/ranking-agencias-verificado.yml)
// Env: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND (opcional)
//      DRY_RUN=1 (no publica), LIMIT=n (solo n agencias, para pruebas), RANKING_MODEL (default gpt-4.1)

var fs = require("fs");
var path = require("path");
var fetch = globalThis.fetch || require("node-fetch");
var supabaseLib = require("@supabase/supabase-js");
var focus = require("./lib/myp-seo-focus");

var OPENAI_KEY = process.env.OPENAI_API_KEY;
var MODEL = process.env.RANKING_MODEL || "gpt-4.1";
var DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
var LIMIT = parseInt(process.env.LIMIT || "0", 10);
var DATA_DIR = path.join(__dirname, "..", "data", "ranking-agencias");
var SLUG = "ranking-agencias-marketing-digital-chile-verificado";

// ═══ AGENCIAS EVALUADAS ═══
// Semilla: agencias que aparecen en los listados más citados por Google y las IA (sep 2026).
// Para agregar o quitar una agencia, editar esta lista. El sitio web lo confirma la investigación.
var AGENCIAS = [
  { nombre: "Muller y Pérez", web: "https://www.mulleryperez.cl" },
  { nombre: "Bigbuda", web: "https://www.bigbuda.cl" },
  { nombre: "Loup", web: "https://loup.cl" },
  { nombre: "Rompecabeza" },
  { nombre: "Cebra" },
  { nombre: "Moov" },
  { nombre: "MEAT Group", web: "https://www.meat.cl" },
  { nombre: "Relevant" },
  { nombre: "Nexbu", web: "https://nexbu.com" },
  { nombre: "Seonet", web: "https://www.seonetdigital.cl" },
  { nombre: "Wolf BCPP" },
  { nombre: "Milimetrix", web: "https://www.milimetrix.com" },
  { nombre: "Metrix", web: "https://metrix.digital" },
  { nombre: "Focus Ads", web: "https://focus-ads.cl" },
  { nombre: "Adinfluence", web: "https://www.adinfluence.cl" },
  { nombre: "Lagencia", web: "https://lagencia.cl" },
  { nombre: "Postedin" },
  { nombre: "Agencia Los Navegantes" },
  { nombre: "Marketboost", web: "https://agenciamarketboost.com" },
  { nombre: "OneDigital", web: "https://www.onedigital.cl" },
];

// ═══ PASO 1: INVESTIGACIÓN CON BÚSQUEDA WEB ═══
var ESQUEMA = `{
  "nombre": "nombre oficial",
  "sitio_web": {"valor": "https://...", "fuente": "https://..."},
  "opera_en_chile": {"valor": true, "descripcion": "oficina o equipo en Chile, o sede en otro país", "fuente": "https://..."},
  "anio_fundacion": {"valor": 2015, "fuente": "https://..."},
  "fundador": {"valor": "nombre(s) y perfil profesional breve (cargo, experiencia previa)", "fuente": "https://..."},
  "liderazgo": {"nombre": "fundador o gerente general", "formacion": "título de pregrado y universidad", "postgrado": "MBA o magíster y universidad, o null", "anios_experiencia": 20, "experiencia_previa": "cargos de gestión, finanzas, datos o consultoría antes de la agencia, o null", "fuente": "URL de LinkedIn o de la página de equipo donde aparece"},
  "equipo": {"valor": "interno | mixto | freelance", "tamano": "p.ej. 25 personas", "fuente": "https://..."},
  "especialidades": {
    "performance": {"valor": true, "fuente": "https://..."},
    "contenido": {"valor": true, "fuente": "https://..."},
    "creatividad": {"valor": true, "fuente": "https://..."},
    "seo": {"valor": true, "fuente": "https://..."},
    "ecommerce": {"valor": true, "fuente": "https://..."},
    "b2b": {"valor": true, "fuente": "https://..."}
  },
  "herramientas_propias": {"valor": true, "descripcion": "software, dashboards o herramientas DESARROLLADAS por la agencia", "fuente": "https://..."},
  "crm_propio": {"valor": true, "descripcion": "CRM desarrollado u operado por la agencia (no revender HubSpot/Salesforce)", "fuente": "https://..."},
  "paneles_financieros": {"valor": true, "descripcion": "paneles de ROI/CAC/finanzas entregados a clientes", "fuente": "https://..."},
  "agentes_ia": {"valor": true, "descripcion": "agentes o automatizaciones de IA PROPIOS operando en producción para clientes (usar ChatGPT o herramientas de terceros NO cuenta: valor false)", "fuente": "https://..."},
  "casos_exito": [{"cliente": "nombre", "rubro": "rubro del cliente", "resultado": "resultado con número si está publicado", "fuente": "https://..."}],
  "clientes_destacados": [{"nombre": "cliente que la agencia publica en su sitio (logos, casos)", "fuente": "https://..."}],
  "premios": [{"nombre": "premio de la industria (Effie, Cannes Lions, IAB Mixx, etc.)", "anio": 2025, "fuente": "https://..."}],
  "precios_publicados": {"valor": "p.ej. planes desde $X mensuales", "fuente": "https://..."},
  "resenas_google": {"cantidad": 115, "rating": 5.0, "fuente": "https://..."},
  "directorios": [{"sitio": "Clutch | Sortlist | GoodFirms | DesignRush | The Manifest (solo estos)", "resenas": 10, "fuente": "https://..."}],
  "tamano_clientes": {"valor": "pymes | medianas | grandes | mixto", "fuente": "https://..."},
}`;

// Toma el PRIMER objeto JSON balanceado (la IA a veces agrega texto u otro JSON después)
function extraerJson(texto) {
  var limpio = texto.replace(/```json|```/g, "");
  var ini = limpio.indexOf("{");
  if (ini < 0) throw new Error("La investigación no devolvió JSON");
  var nivel = 0, enTexto = false, escape = false;
  for (var i = ini; i < limpio.length; i++) {
    var ch = limpio[i];
    if (enTexto) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') enTexto = false;
      continue;
    }
    if (ch === '"') enTexto = true;
    else if (ch === "{") nivel++;
    else if (ch === "}" && --nivel === 0) return JSON.parse(limpio.slice(ini, i + 1));
  }
  throw new Error("JSON incompleto en la respuesta");
}

async function llamarResponses(body) {
  var herramientas = ["web_search", "web_search_preview"];
  var ultimoError;
  for (var i = 0; i < herramientas.length; i++) {
    var r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + OPENAI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        Object.assign({}, body, { tools: [{ type: herramientas[i] }] }),
      ),
    });
    var data = await r.json();
    if (r.ok) return data;
    ultimoError = r.status + " " + JSON.stringify(data).substring(0, 300);
  }
  throw new Error("OpenAI Responses falló: " + ultimoError);
}

function textoDeRespuesta(data) {
  var partes = [];
  (data.output || []).forEach(function (item) {
    if (item.type === "message") {
      (item.content || []).forEach(function (c) {
        if (c.type === "output_text") partes.push(c.text);
      });
    }
  });
  return partes.join("\n");
}

async function investigar(agencia) {
  var prompt =
    'Investiga en la web a la agencia de marketing digital chilena "' +
    agencia.nombre +
    '"' +
    (agencia.web ? " (sitio: " + agencia.web + ")" : "") +
    ".\n\n" +
    "Busca en su sitio oficial (páginas de nosotros, equipo, servicios, casos), LinkedIn, Google Business Profile, " +
    "Clutch, Sortlist, GoodFirms, DesignRush y prensa.\n\n" +
    "REGLAS ESTRICTAS:\n" +
    '- "fuente" es UNA sola URL completa, sin comentarios ni citas, con guiones normales (-). Cada dato DEBE llevar en "fuente" la URL exacta donde aparece. Si no encuentras una URL que lo respalde, pon null en ese campo.\n' +
    '- No infieras ni estimes; nunca escribas suposiciones como "presumiblemente" o "probablemente": si no está publicado, null. "La agencia ofrece SEO" solo es true si una página lo dice.\n' +
    "- casos_exito: solo casos publicados con cliente identificable. Máximo 5.\n" +
    "- liderazgo: busca al fundador o gerente general en LinkedIn y en la página de equipo o nosotros del sitio; su formación, postgrado, años de experiencia y cargos previos.\n" +
    "- herramientas_propias / crm_propio / paneles_financieros / agentes_ia: solo si la agencia los desarrolló o los opera ella misma y lo publica; revender HubSpot o usar ChatGPT no cuenta.\n" +
    "- Escribe en español de Chile con tildes y ñ correctas.\n\n" +
    "Responde SOLO con este JSON:\n" +
    ESQUEMA;
  var json;
  try {
    json = extraerJson(textoDeRespuesta(await llamarResponses({ model: MODEL, input: prompt })));
  } catch (e) {
    // A veces la respuesta no trae JSON (así falló "Relevant"): un reintento
    console.log("   " + e.message + " → reintento");
    json = extraerJson(textoDeRespuesta(await llamarResponses({ model: MODEL, input: prompt })));
  }
  json.nombre = agencia.nombre;
  return json;
}

// ═══ PASO 2: VERIFICAR FUENTES ═══
// La IA a veces devuelve 'https://clutch.co/profile/bigbuda‑0 (“27 reviews”) y https://...' con guiones Unicode.
// Se deja solo la primera URL, con guiones ASCII, para no descartar datos válidos por formato.
function normalizarUrl(u) {
  if (!u || typeof u !== "string") return u;
  var limpio = u.replace(/[\u2010-\u2015\u2212]/g, "-");
  var m = limpio.match(/https?:\/\/[^\s"“”'<>()]+/);
  return m ? m[0].replace(/[.,;:]+$/, "") : u;
}

var cacheUrls = {};
async function urlResponde(url) {
  if (!url || typeof url !== "string" || !/^https?:\/\//.test(url))
    return false;
  if (url in cacheUrls) return cacheUrls[url];
  var ok = false;
  try {
    var ctrl = new AbortController();
    var t = setTimeout(function () {
      ctrl.abort();
    }, 12000);
    var r = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MPRankingVerifier/1.0; +https://www.mulleryperez.cl)",
      },
    });
    clearTimeout(t);
    // 403/429: el sitio bloquea bots pero la URL existe → se acepta. 404/410/5xx/DNS → se descarta.
    ok = r.status < 400 || r.status === 403 || r.status === 429 || r.status === 999; // 999 = LinkedIn bloquea bots
  } catch (e) {
    ok = false;
  }
  cacheUrls[url] = ok;
  return ok;
}

// Recorre el objeto y anula todo dato cuya fuente no responde. Devuelve {verificados, descartados}.
async function verificar(obj) {
  var stats = { verificados: 0, descartados: 0 };
  async function nodo(o) {
    if (Array.isArray(o)) {
      var quedan = [];
      for (var i = 0; i < o.length; i++) {
        if (o[i] && typeof o[i] === "object" && "fuente" in o[i]) {
          o[i].fuente = normalizarUrl(o[i].fuente);
          if (await urlResponde(o[i].fuente)) {
            quedan.push(o[i]);
            stats.verificados++;
          } else stats.descartados++;
        } else quedan.push(o[i]);
      }
      o.length = 0;
      quedan.forEach(function (x) {
        o.push(x);
      });
      return;
    }
    if (!o || typeof o !== "object") return;
    for (var k in o) {
      var v = o[k];
      if (v && typeof v === "object" && !Array.isArray(v) && "fuente" in v) {
        var tieneValor =
          (v.valor !== null &&
            v.valor !== undefined &&
            v.valor !== false &&
            v.valor !== "") ||
          v.cantidad ||
          v.nombre;
        if (!tieneValor) continue;
        v.fuente = normalizarUrl(v.fuente);
        if (await urlResponde(v.fuente)) stats.verificados++;
        else {
          o[k] = { valor: null, fuente: null, descartado: true };
          stats.descartados++;
        }
      } else if (v && typeof v === "object") await nodo(v);
    }
  }
  await nodo(obj);
  return stats;
}

// ═══ PASO 2B: CONFIRMAR CRITERIOS DE TECNOLOGÍA E IA CON CITA TEXTUAL ═══
// La clasificación sí/no de la IA varía entre corridas (falsos positivos y negativos). Para los 4 criterios
// que más pesan se hace una consulta enfocada que debe devolver la frase EXACTA de la página, y el script
// descarga la página y comprueba que la frase esté ahí. La cita se publica como evidencia.
var CRITERIOS_TEC = {
  agentes_ia: "¿La agencia desarrolló y opera agentes o automatizaciones de inteligencia artificial PROPIOS en producción para sus clientes? Usar ChatGPT, Jasper u otra herramienta de terceros, o revender software de un partner, NO cuenta.",
  herramientas_propias: "¿La agencia desarrolló software, plataformas, dashboards o herramientas propias (no de terceros)?",
  crm_propio: "¿La agencia desarrolló u opera un CRM propio para gestionar los leads de sus clientes (revender HubSpot o Salesforce NO cuenta)?",
  paneles_financieros: "¿La agencia entrega a sus clientes paneles o dashboards con métricas financieras como ROI, CAC, ROAS o margen?",
};

function normalizarTexto(t) {
  return String(t || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/&[a-z#0-9]+;/g, " ")
    .replace(/[^a-z0-9ñ]+/g, " ")
    .trim();
}

var cachePaginas = {};
async function textoPagina(url) {
  if (url in cachePaginas) return cachePaginas[url];
  var r = { estado: 0, texto: "" };
  try {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 15000);
    var res = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; MPRankingVerifier/1.0; +https://www.mulleryperez.cl)" } });
    clearTimeout(t);
    r.estado = res.status;
    if (res.ok) r.texto = normalizarTexto((await res.text()).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
  } catch (e) { r.estado = 0; }
  cachePaginas[url] = r;
  return r;
}

// Juez: decide SOLO con la cita (que se publica), así cualquiera puede revisar el mismo juicio.
var DEFINICION_ESTRICTA = {
  agentes_ia: "la agencia opera agentes o automatizaciones de IA (propios o construidos por ella) en producción para clientes. Solo mencionar que 'usa IA' o herramientas de terceros NO basta.",
  herramientas_propias: "la agencia DESARROLLÓ un software, plataforma o dashboard propio que usa en su servicio. NO cuenta: desarrollar sitios o plataformas para clientes como servicio, software de un partner o aliado, ni metodologías o índices.",
  crm_propio: "la agencia desarrolló u opera un CRM propio. Revender o implementar HubSpot, Salesforce u otro CRM de terceros NO cuenta.",
  paneles_financieros: "la agencia entrega a sus clientes paneles o reportes con métricas financieras (ROI, CAC, ROAS, margen o LTV).",
};
async function juezCita(agencia, campo, cita) {
  var r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + OPENAI_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      max_tokens: 5,
      messages: [{ role: "user", content: "Criterio: " + DEFINICION_ESTRICTA[campo] + "\n\nCita publicada por " + agencia.nombre + ": \"" + cita + "\"\n\n¿La cita, por sí sola, demuestra que se cumple el criterio? Responde solo SI o NO." }],
    }),
  });
  var data = await r.json();
  var resp = data.choices && data.choices[0] ? data.choices[0].message.content.trim().toUpperCase() : "NO";
  return resp.indexOf("SI") === 0 || resp.indexOf("SÍ") === 0;
}

async function confirmarCriterio(agencia, campo) {
  var prompt = "Agencia de marketing digital chilena: \"" + agencia.nombre + "\"" + (agencia.web ? " (" + agencia.web + ")" : "") + ".\n"
    + CRITERIOS_TEC[campo] + "\n\nBusca primero en el sitio oficial de la agencia (páginas de servicios, tecnología, IA, agentes, herramientas, nosotros).\n"
    + "Responde SOLO JSON: {\"valor\": true|false, \"descripcion\": \"qué es, en una frase\", \"fuente\": \"UNA URL exacta\", \"cita\": \"frase copiada LITERALMENTE de esa página (15 a 40 palabras) que lo demuestra\"}\n"
    + "Si no hay evidencia publicada, responde {\"valor\": false, \"descripcion\": null, \"fuente\": null, \"cita\": null}.";
  var data = await llamarResponses({ model: MODEL, input: prompt });
  var j = extraerJson(textoDeRespuesta(data));
  j.fuente = normalizarUrl(j.fuente);
  if (!j.valor || !j.fuente || !j.cita) return { valor: false, descripcion: null, fuente: null };
  var pag = await textoPagina(j.fuente);
  var cita = normalizarTexto(j.cita);
  // Se compara un tramo central de la cita para tolerar diferencias de puntuación en los bordes
  var palabras = cita.split(" ");
  var tramo = palabras.slice(Math.floor(palabras.length * 0.15), Math.max(Math.ceil(palabras.length * 0.85), 6)).join(" ");
  var citaEnPagina = pag.texto && tramo.length >= 20 && pag.texto.indexOf(tramo) >= 0;
  var bloqueado = !pag.texto && (pag.estado === 403 || pag.estado === 429);
  if ((citaEnPagina || bloqueado) && !(await juezCita(agencia, campo, j.cita))) {
    return { valor: false, descripcion: null, fuente: null, descartado: "la cita no demuestra el criterio" };
  }
  if (citaEnPagina) {
    return { valor: true, descripcion: j.descripcion, fuente: j.fuente, cita: j.cita, comprobado: "cita encontrada en la página" };
  }
  if (!pag.texto && (pag.estado === 403 || pag.estado === 429)) {
    return { valor: true, descripcion: j.descripcion, fuente: j.fuente, cita: j.cita, comprobado: "sitio bloquea verificación automática" };
  }
  return { valor: false, descripcion: null, fuente: null, descartado: "cita no encontrada en " + j.fuente };
}

// ═══ PASO 2C: RECORRER EL SITIO DE LA AGENCIA ═══
// La búsqueda web varía entre corridas (M&P salió con 0 en tecnología una vez; Bigbuda con 0 en IA otra).
// Por eso primero se lee el propio sitio de cada agencia (sitemap, hasta 30 páginas priorizadas), se extraen
// las frases que hablan de cada criterio y el juez elige, entre frases REALES, la que lo demuestra.
// Mismo sitio → mismas frases → mismo resultado cada mes. Sin Apify.
var PALABRAS_CRITERIO = {
  agentes_ia: /agentes? de (ia|inteligencia artificial)|agentes? (ia|inteligentes|aut[oó]nomos)|inteligencia artificial|ia generativa|automatizaci[oó]n(es)? con ia|chatbot|machine learning/i,
  herramientas_propias: /plataforma propia|herramientas? propias?|software propio|desarrollamos|desarrollo propio|nuestra plataforma|nuestro software|predictor|dashboard|tecnolog[ií]a propia/i,
  crm_propio: /\bcrm\b/i,
  paneles_financieros: /\b(roas|cac|roi|ltv)\b|margen|dashboard|panel(es)? de (control|resultados)|reporter[ií]a/i,
};
var PRIORIDAD_URL = /servicio|nosotros|about|quienes|tecnolog|agente|\bia\b|inteligencia|herramient|plataforma|crm|dashboard|soluciones|producto|labs|predictor|metodolog|como-trabajamos|casos/i;

async function htmlDe(url) {
  try {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 15000);
    var r = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; MPRankingVerifier/1.0; +https://www.mulleryperez.cl)" } });
    clearTimeout(t);
    return r.ok ? await r.text() : "";
  } catch (e) { return ""; }
}

async function urlsDelSitio(web) {
  var base = web.replace(/\/+$/, "");
  var host = hostDe(base);
  var urls = [];
  var mapas = [base + "/sitemap.xml", base + "/sitemap_index.xml", base + "/wp-sitemap.xml", base + "/page-sitemap.xml"];
  for (var i = 0; i < mapas.length && urls.length < 400; i++) {
    var xml = await htmlDe(mapas[i]);
    var locs = (xml.match(/<loc>([^<]+)<\/loc>/g) || []).map(function (l) { return l.replace(/<\/?loc>/g, "").trim(); });
    for (var k = 0; k < locs.length; k++) {
      if (/\.xml(\?|$)/.test(locs[k]) && urls.length < 400) {
        // índice de sitemaps: se abren los sub-sitemaps de páginas (no de imágenes)
        if (!/image|attachment|media|product_cat|tag/i.test(locs[k])) {
          var sub = await htmlDe(locs[k]);
          (sub.match(/<loc>([^<]+)<\/loc>/g) || []).forEach(function (l) { urls.push(l.replace(/<\/?loc>/g, "").trim()); });
        }
      } else urls.push(locs[k]);
    }
    if (urls.length) break;
  }
  urls = Array.from(new Set(urls.filter(function (u) { return hostDe(u) === host; })));
  // Prioridad: páginas de servicios/tecnología primero; blog al final (habla de IA en general, no de lo propio)
  var puntaje = function (u) { return (PRIORIDAD_URL.test(u) ? 0 : 1) + (/\/blog\/|\/noticias\/|\/\d{4}\//.test(u) ? 2 : 0); };
  urls.sort(function (a, b) { return puntaje(a) - puntaje(b) || a.length - b.length; });
  todasLasUrls[web] = urls.slice();
  return [base + "/"].concat(urls.filter(function (u) { return u.replace(/\/+$/, "") !== base; })).slice(0, 30);
}

function frasesDe(html) {
  var texto = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>|<nav[\s\S]*?<\/nav>|<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<\/(p|li|h[1-6]|div|section|td|br)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'").replace(/&[a-z#0-9]+;/gi, " ");
  var out = [];
  texto.split(/\n+/).forEach(function (bloque) {
    bloque.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/).forEach(function (f) {
      var n = f.split(" ").length;
      if (n >= 8 && n <= 70) out.push(f.trim());
    });
  });
  return out;
}

var NO_CLIENTE = /^(image|imagen|img|foto|photo|banner|hero|icon|avatar|logo)?\s*\d*$|chatgpt|openai|claude|gemini|google|meta business|\bmeta\b|facebook|instagram|linkedin|tiktok|youtube|whatsapp|hubspot|semrush|clutch|sortlist|goodfirms|designrush|looker|midjourney|heygen|higgsfield|gohighlevel|shopify|wordpress|woocommerce|vtex|salesforce|mailchimp|canva|figma|adobe|zapier|notion|slack|apple|android|visa|mastercard|webpay/i;
function agenciaDeWeb(web) { var a = AGENCIAS.filter(function (x) { return x.web && hostDe(x.web) === hostDe(web); })[0]; return a ? a.nombre : hostDe(web).split(".")[0]; }
var cacheSitios = {};
var logosSitio = {};
var homeHtml = {};
var todasLasUrls = {};
async function frasesDelSitio(web) {
  if (cacheSitios[web]) return cacheSitios[web];
  var urls = await urlsDelSitio(web);
  var frases = [];
  var logos = {};
  for (var i = 0; i < urls.length; i++) {
    var html = await htmlDe(urls[i]);
    if (i === 0) homeHtml[web] = html;
    frasesDe(html).forEach(function (f) { frases.push({ frase: f, url: urls[i] }); });
    // Logos de clientes: imágenes cuyo alt o archivo dice logo/cliente/marca (cuenta igual para todas las agencias)
    (html.match(/<img[^>]+>/gi) || []).forEach(function (img) {
      var alt = (img.match(/alt="([^"]*)"/i) || [])[1] || "";
      var src = decodeURIComponent((img.match(/src="([^"]*)"/i) || [])[1] || "");
      if (!/logo|client|marca|brand|partner/i.test(alt + " " + src)) return;
      if (/logo[^a-z]*(de )?(la )?agencia|logotipo m&p|favicon|icon/i.test(alt)) return;
      var nombre = alt.replace(/\b[0-9a-f]{16,}\b/gi, "").replace(/^\s*(logo(tipo)?( de\b)?|cliente)\s*/i, "").replace(/\s*[—–-]\s*cliente.*$/i, "").replace(/\s*logo\s*$/i, "").trim();
      if (!nombre) nombre = (src.split("/").pop() || "").replace(/\.(png|jpe?g|webp|svg|gif).*$/i, "").replace(/[-_]+/g, " ").trim();
      nombre = nombre.replace(/\b[0-9a-f]{16,}\b/gi, "").replace(/\.(png|jpe?g|webp|svg|gif|avif)\b/gi, "")
        .replace(/mask group|versiones? de|\blogos?\b|logo(?=[a-z])|\bmarcas?\b|\bfull\b|\bcolor\b|\bblanco\b|\bnegro\b|\bwhite\b|\bblack\b|\b\d+x\b|\b\d{1,3}\b/gi, " ")
        .replace(/\s+/g, " ").trim();
      nombre = nombre.replace(/\s*logo\s*$/i, "").trim();
      if (nombre) nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      // Fuera: la propia agencia, insignias de partner/directorios, herramientas y plataformas, imágenes genéricas
      if (NO_CLIENTE.test(nombre) || /partner|trusted|certificad|award|premio/i.test(alt)) return;
      if (normalizarTexto(nombre).indexOf(normalizarTexto(agenciaDeWeb(web))) >= 0) return;
      if (nombre.length >= 2 && nombre.length <= 40) logos[normalizarTexto(nombre)] = { nombre: nombre, fuente: urls[i] };
    });
  }
  logosSitio[web] = Object.values(logos);
  console.log("   Sitio recorrido: " + urls.length + " páginas, " + frases.length + " frases, " + logosSitio[web].length + " logos de clientes");
  cacheSitios[web] = frases;
  return frases;
}

async function confirmarDesdeSitio(agencia, campo, frases) {
  var vistos = {};
  var candidatas = frases.filter(function (x) {
    if (!PALABRAS_CRITERIO[campo].test(x.frase) || vistos[x.frase]) return false;
    // Para lo "propio" (IA, herramientas, CRM) la frase debe hablar de la agencia misma, no de la industria ni de terceros
    if (campo !== "paneles_financieros" && !AUTORREFERENCIA.test(x.frase) && !/\b(desarroll|implement|cre|constru|oper|integr)amos\b/i.test(x.frase) &&
        normalizarTexto(x.frase).indexOf(normalizarTexto(agencia.nombre)) < 0) return false;
    vistos[x.frase] = 1;
    return true;
  })
    // Primero las frases que afirman algo propio ("desarrollamos", "nuestro CRM"), no las que hablan del tema en general
    .map(function (x) {
      var f = x.frase.toLowerCase();
      var fuerza = (/(propi[oa]s?|desarroll(amos|ado|o)|nuestr[oa]s?|creamos|construimos|operamos)/.test(f) ? 2 : 0) +
        (f.match(new RegExp(PALABRAS_CRITERIO[campo].source, "gi")) || []).length;
      return { frase: x.frase, url: x.url, fuerza: fuerza };
    })
    .sort(function (a, b) { return b.fuerza - a.fuerza; })
    .slice(0, 20);
  if (!candidatas.length) return { valor: false, descripcion: null, fuente: null };
  var r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + OPENAI_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      response_format: { type: "json_object" },
      max_tokens: 200,
      messages: [{
        role: "user",
        content: "Criterio: " + DEFINICION_ESTRICTA[campo] + "\n\nFrases publicadas en el sitio de " + agencia.nombre + ":\n" +
          candidatas.map(function (c, i) { return i + 1 + ". " + c.frase; }).join("\n") +
          '\n\nNO cuentan: frases generales sobre la industria o sobre lo que la IA puede hacer; productos, plataformas o asistentes de terceros o de partners; preparar al cliente para la IA de otros (ej. \"preparamos tu catálogo para agentes de IA\"); menciones en artículos o noticias. SÍ cuenta solo si la frase afirma que la propia agencia desarrolló, construyó u opera esa herramienta o agente para sus clientes.\n¿Alguna frase, por sí sola, lo demuestra? Responde SOLO JSON: {\"indice\": número de la frase que mejor lo demuestra o 0 si ninguna, \"descripcion\": \"qué es, en una frase breve\"}',
      }],
    }),
  });
  var data = await r.json();
  var j = JSON.parse(data.choices[0].message.content);
  var c = candidatas[(j.indice || 0) - 1];
  if (!c) return { valor: false, descripcion: null, fuente: null };
  return { valor: true, descripcion: j.descripcion, fuente: c.url, cita: c.frase, comprobado: "frase publicada en el sitio de la agencia" };
}

// ═══ PASO 2D: ESPECIALIDADES, CASOS Y TRAYECTORIA DESDE EL SITIO (sin IA, iguales en cada corrida) ═══
var PALABRAS_ESPECIALIDAD = {
  performance: /performance|google ads|meta ads|campañas pagadas|pauta digital|paid media|publicidad (digital|pagada)|\bsem\b/i,
  contenido: /marketing de contenidos?|contenidos? para redes|redes sociales|community manager|copywriting|gestión de redes/i,
  creatividad: /creatividad|diseño gráfico|branding|producción audiovisual|dirección de arte|piezas gráficas/i,
  seo: /\bseo\b|posicionamiento (web|orgánico|en google)/i,
  ecommerce: /e-?commerce|tiendas? (online|virtual(es)?)|comercio electr[oó]nico/i,
  b2b: /\bb2b\b|empresa a empresa|clientes (industriales|corporativos)/i,
};
var SENALES = {
  google_ads: /google ads|adwords|red de búsqueda|campañas de búsqueda/i,
  meta_ads: /meta ads|facebook ads|instagram ads|publicidad en (facebook|instagram|meta)/i,
  linkedin_ads: /linkedin ads|publicidad en linkedin|campañas (en|de) linkedin/i,
  tiktok_ads: /tiktok ads|publicidad en tiktok|campañas (en|de) tiktok/i,
  shopping: /google shopping|performance max|pmax|catálogo de productos|feed de productos|merchant center/i,
  cro: /\bcro\b|optimización de (la )?conversi[oó]n|tasa de conversi[oó]n|a\/b test|pruebas a\/b/i,
  produccion: /producci[oó]n audiovisual|filmmaker|grabaci[oó]n|video(s)? corporativo|spot|dirección de arte/i,
  influencers: /influencer|creadores de contenido|medios masivos|televisi[oó]n|radio|vía pública|btl/i,
  precios: /desde \$\s?\d|planes? (desde|mensuales?)|\$\s?\d{1,3}(\.\d{3})+ ?(\+ ?iva|mensual|clp)/i,
  whatsapp: /whatsapp/i,
};
var URL_CASO = /\/(casos?(-de-exito)?|case-stud(y|ies)|cases?|portafolio|portfolio|proyectos?|clientes)\/[^/?#]+/i;

// Blog, noticias y páginas de rankings/listados de agencias (hablan de otras agencias)
var URL_BLOG = /\/(blog|noticias|news|articulos?|recursos|insights|prensa)\/|\/(19|20)\d{2}\/|\/tag\/|\/category\/|ranking|mejores-|top-?\d|agencias-de-/i;
var AUTORREFERENCIA = /\b(somos|nuestr[oa]s?|nosotros|ofrecemos|contamos|tenemos|trabajamos|nacimos|fundamos|la agencia|nuestra agencia)\b/i;

function evidenciaDelSitio(web, todas, datos, nombreAgencia) {
  var otras = AGENCIAS.filter(function (a) { return a.nombre !== nombreAgencia; }).map(function (a) { return normalizarTexto(a.nombre); });
  var n = 0;
  // Solo páginas institucionales y de servicios: el blog habla de todo y no prueba lo que la agencia ofrece
  var frases = todas.filter(function (x) { return !URL_BLOG.test(x.url); });
  // Especialidades: la frase publicada en el sitio es la evidencia
  datos.especialidades = {};
  Object.keys(PALABRAS_ESPECIALIDAD).forEach(function (k) {
    var f = frases.filter(function (x) { return PALABRAS_ESPECIALIDAD[k].test(x.frase); })[0];
    datos.especialidades[k] = f ? { valor: true, fuente: f.url, cita: f.frase } : { valor: false, fuente: null };
    if (f) n++;
  });
  // Casos: páginas individuales de casos o portafolio en el sitemap
  var casos = Array.from(new Set((todasLasUrls[web] || []).filter(function (u) { return URL_CASO.test(u); }))).slice(0, 5);
  if (casos.length) {
    datos.casos_exito = casos.map(function (u) {
      var nombre = decodeURIComponent(u.replace(/\/+$/, "").split("/").pop()).replace(/-/g, " ");
      return { cliente: nombre, resultado: null, fuente: u };
    });
  }
  // Trayectoria: "desde 2015", "fundada en 2015", "10 años de experiencia"
  var anios = [];
  frases.forEach(function (x) {
    if (!AUTORREFERENCIA.test(x.frase) && !/fundad[ao]/i.test(x.frase)) return;
    var fn = normalizarTexto(x.frase);
    if (otras.some(function (o) { return o.length > 3 && fn.indexOf(o) >= 0; })) return; // habla de otra agencia
    var m = x.frase.match(/(fundad[ao]s?|naci(mos|ó)|desde|cread[ao]s?|comenzamos|partimos)\s+(en\s+(el\s+)?(año\s+)?)?((19|20)\d{2})/i);
    if (m && +m[6] >= 1980 && +m[6] <= ANIO) anios.push({ anio: +m[6], fuente: x.url, cita: x.frase });
    var e = x.frase.match(/(más de\s+)?(\d{1,2})\s+años de (experiencia|trayectoria)/i);
    if (e && +e[2] >= 1 && +e[2] <= 40 && /(somos|tenemos|contamos|con más de|agencia|nuestra)/i.test(x.frase)) anios.push({ anio: ANIO - +e[2], fuente: x.url, cita: x.frase });
  });
  if (anios.length) {
    // Se usa la mediana para no depender de una sola frase
    anios.sort(function (a, b) { return a.anio - b.anio; });
    var med = anios[Math.floor(anios.length / 2)];
    datos.anio_fundacion = { valor: med.anio, fuente: med.fuente, cita: med.cita };
  }
  // Señales para los perfiles: canales, e-commerce avanzado, CRO, producción, influencers, precios, WhatsApp
  datos.senales = {};
  Object.keys(SENALES).forEach(function (k) {
    var f = frases.filter(function (x) { return SENALES[k].test(x.frase); })[0];
    datos.senales[k] = f ? { valor: true, fuente: f.url, cita: f.frase } : { valor: false, fuente: null };
  });
  // Clientes destacados: si el sitio muestra más logos de clientes que los encontrados por la búsqueda, se usan los logos
  var logos = logosSitio[web] || [];
  if (logos.length > (datos.clientes_destacados || []).filter(function (c) { return c && c.fuente; }).length) datos.clientes_destacados = logos;
  return { especialidades: n, casos: casos.length, anio: anios.length ? datos.anio_fundacion.valor : null, logos: logos.length };
}

// ═══ TIPO DE AGENCIA: solo se comparan agencias de la misma categoría ═══
// Una agencia de influencers o una de SEO no compite en el ranking general contra una de performance.
var TIPOS = {
  performance: "Performance o marketing digital integral",
  seo: "SEO y contenido",
  influencers: "Marketing de influencers",
  creativa: "Creativa o de branding",
  otra: "Otra especialidad",
};
async function tipoAgencia(agencia, html, frases) {
  var titulo = ((html.match(/<title[^>]*>([^<]*)</i) || [])[1] || "").trim();
  var desc = ((html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || [])[1] || "").trim();
  var encabezados = (html.match(/<h[12][^>]*>[\s\S]*?<\/h[12]>/gi) || []).slice(0, 8).map(function (h) { return h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); });
  var prompt = "Clasifica la agencia chilena \"" + agencia.nombre + "\" según cómo se presenta en su propia página de inicio.\n" +
    "Título: " + titulo + "\nDescripción: " + desc + "\nEncabezados: " + encabezados.join(" | ") + "\n\n" +
    "Categorías: performance (campañas pagadas, Google/Meta Ads, generación de leads o ventas, marketing digital integral con foco en resultados), " +
    "seo (posicionamiento orgánico y contenido como servicio principal), influencers (marketing de influencers o creadores como servicio principal), " +
    "creativa (branding, publicidad creativa, diseño, producción), otra.\n" +
    'Responde SOLO JSON: {"tipo": "performance|seo|influencers|creativa|otra", "cita": "frase exacta del título, descripción o encabezados que lo muestra"}';
  try {
    var r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + OPENAI_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, temperature: 0, response_format: { type: "json_object" }, max_tokens: 150, messages: [{ role: "user", content: prompt }] }),
    });
    var j = JSON.parse((await r.json()).choices[0].message.content);
    if (!TIPOS[j.tipo]) j.tipo = "otra";
    return { tipo: j.tipo, cita: j.cita, fuente: agencia.web || null };
  } catch (e) {
    return { tipo: "performance", cita: null, fuente: null };
  }
}
// Confianza: cuántos datos básicos se pudieron verificar. Sin lo básico no se publica un número (sería castigar por falta de datos)
function confianza(r) {
  var a = r.datos, n = 0;
  if (a.anio_fundacion && a.anio_fundacion.valor && a.anio_fundacion.fuente) n++;
  if (a.resenas_google && a.resenas_google.cantidad) n++;
  if ((a.casos_exito || []).some(function (c) { return c && c.fuente; })) n++;
  if ((a.clientes_destacados || []).some(function (c) { return c && c.fuente; })) n++;
  if (a.equipo && a.equipo.fuente) n++;
  if (a.liderazgo && a.liderazgo.fuente) n++;
  return n >= 5 ? "alta" : n >= 3 ? "media" : "baja";
}
function operaEnChile(r) { var o = r.datos.opera_en_chile; return !(o && o.fuente && o.valor === false); }
function esComparable(r) { var t = r.datos.tipo_agencia && r.datos.tipo_agencia.tipo; return !t || t === "performance"; }

async function confirmarTecnologia(agencia, datos) {
  var web = agencia.web || (datos.sitio_web && datos.sitio_web.valor);
  var frases = web ? await frasesDelSitio(web) : [];
  var cambios = [];
  for (var campo in CRITERIOS_TEC) {
    try {
      // 1º el propio sitio (estable); 2º búsqueda web (prensa, directorios), con el mismo juez
      var c = frases.length ? await confirmarDesdeSitio(agencia, campo, frases) : { valor: false };
      if (!c.valor) c = await confirmarCriterio(agencia, campo);
      var antes = tiene(datos[campo]);
      datos[campo] = c;
      if (antes !== c.valor) cambios.push(campo + ": " + antes + " → " + c.valor + (c.descartado ? " (" + c.descartado + ")" : ""));
    } catch (e) {
      console.log("   confirmación " + campo + " falló: " + e.message);
    }
  }
  return cambios;
}

// ═══ RESEÑAS DE GOOGLE DESDE GOOGLE MAPS (Apify) ═══
// La búsqueda web encontraba las reseñas de unas agencias y de otras no (medición desigual).
// Se leen directo de la ficha de Google Maps de cada agencia, igual para todas: cantidad, nota y URL de la ficha.
function hostDe(u) {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; }
}

async function resenasGoogleMaps(agencias) {
  var token = process.env.APIFY_TOKEN;
  if (!token) { console.log("Sin APIFY_TOKEN: reseñas de Google desde la búsqueda web"); return {}; }
  // Los créditos de Apify se comparten con otros clientes (Hualpén): las pruebas nunca lo usan
  if (DRY_RUN && process.env.APIFY_EN_PRUEBA !== "1") { console.log("Prueba: se omite Apify (ahorro de créditos)"); return {}; }
  if (process.env.SIN_APIFY === "1") { console.log("Corrida manual sin Apify: reseñas desde la búsqueda web"); return {}; }
  // Igual que prospect-discover.js (que sí funciona): la ubicación va dentro de la búsqueda, sin locationQuery
  var busquedas = agencias.map(function (a) { return a.nombre + " agencia de marketing digital Santiago Chile"; });
  try {
    var r = await fetch("https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=" + token + "&timeout=600", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: busquedas,
        maxCrawledPlacesPerSearch: 2, // ~40 fichas al mes en total
        language: "es",
        includeWebResults: false,
      }),
    });
    if (!r.ok) { console.log("Apify Google Maps: HTTP " + r.status); return {}; }
    var items = await r.json();
    // Diagnóstico: en la corrida del 28 sept Apify devolvió datos pero se leyeron 0 de 20
    console.log("Google Maps: " + (Array.isArray(items) ? items.length : "respuesta no es lista") + " fichas recibidas");
    if (Array.isArray(items) && items[0]) {
      console.log("   campos: " + Object.keys(items[0]).slice(0, 40).join(", "));
      items.slice(0, 4).forEach(function (it) { console.log("   · " + JSON.stringify({ searchString: it.searchString, title: it.title, website: it.website, reviewsCount: it.reviewsCount, totalScore: it.totalScore })); });
    } else console.log("   respuesta: " + JSON.stringify(items).substring(0, 300));
    var out = {};
    agencias.forEach(function (a, i) {
      var candidatos = items.filter(function (it) { return it.searchString === busquedas[i]; });
      var host = a.web ? hostDe(a.web) : "";
      var nombre = normalizarTexto(a.nombre);
      // 1º: ficha cuyo sitio web coincide con el de la agencia; 2º: ficha cuyo nombre contiene el de la agencia
      var elegido = candidatos.filter(function (it) { return host && hostDe(it.website || "") === host; })[0]
        || candidatos.filter(function (it) { return normalizarTexto(it.title).indexOf(nombre) >= 0; })[0];
      if (elegido && elegido.reviewsCount) {
        out[a.nombre] = { cantidad: elegido.reviewsCount, rating: elegido.totalScore, fuente: elegido.url, origen: "Google Maps", ficha: elegido.title };
      }
    });
    console.log("Google Maps: reseñas encontradas para " + Object.keys(out).length + "/" + agencias.length + " agencias");
    return out;
  } catch (e) {
    console.log("Apify Google Maps falló: " + e.message);
    return {};
  }
}

// ═══ COMBINAR DOS INVESTIGACIONES ═══
function tieneDato(v) { return v && v.fuente && ((v.valor !== null && v.valor !== undefined && v.valor !== false && v.valor !== "") || v.cantidad || v.nombre); }
function combinarInvestigaciones(a, b) {
  var n = 0;
  Object.keys(b).forEach(function (k) {
    var va = a[k], vb = b[k];
    if (Array.isArray(vb)) {
      var ya = {};
      (a[k] = Array.isArray(va) ? va : []).forEach(function (x) { if (x && x.fuente) ya[x.fuente] = 1; });
      vb.forEach(function (x) { if (x && x.fuente && !ya[x.fuente]) { a[k].push(x); ya[x.fuente] = 1; n++; } });
    } else if (vb && typeof vb === "object" && !("fuente" in vb) && k === "especialidades") {
      a[k] = a[k] || {};
      Object.keys(vb).forEach(function (e) { if (!tieneDato(a[k][e]) && tieneDato(vb[e])) { a[k][e] = vb[e]; n++; } });
    } else if (!tieneDato(va) && tieneDato(vb)) { a[k] = vb; n++; }
  });
  return n;
}

// ═══ FUNDADORES VERIFICADOS (data/ranking-agencias/fundadores.json) ═══
// Perfiles del fundador o gerente general revisados con su LinkedIn o página de equipo. Si existe, reemplaza
// lo que encontró la búsqueda automática (que a veces no lo halla o lo confunde).
var FUNDADORES = (function () {
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "fundadores.json"), "utf8")); } catch (e) { return []; }
})();
function aplicarFundadorVerificado(nombre, datos) {
  var f = FUNDADORES.filter(function (x) { return x.agencia === nombre && x.fuente && x.confianza !== "baja"; })[0];
  if (!f) return;
  datos.liderazgo = { nombre: f.nombre, formacion: f.formacion, postgrado: f.postgrado, anios_experiencia: f.anios_experiencia, experiencia_previa: f.experiencia_previa, fuente: f.fuente, verificado: "perfil revisado" };
}

// ═══ ESTABILIDAD ENTRE MESES ═══
// La búsqueda web no encuentra siempre lo mismo. Un dato verificado el mes anterior se mantiene si su fuente
// sigue respondiendo; así una agencia no baja solo porque la IA no lo encontró esta vez.
async function heredarDelMesAnterior(datos, previo, nombre) {
  if (!previo) return 0;
  var ant = (previo.ranking || []).concat(previo.especializadas || [], previo.incompletas || []).filter(function (r) { return r.nombre === nombre; })[0];
  if (!ant) return 0;
  var n = 0;
  var a = ant.datos;
  var campos = ["sitio_web", "anio_fundacion", "fundador", "equipo", "herramientas_propias", "crm_propio",
    "paneles_financieros", "agentes_ia", "resenas_google", "tamano_clientes", "certificaciones"];
  for (var i = 0; i < campos.length; i++) {
    var c = campos[i], nuevo = datos[c], viejo = a[c];
    var nuevoVacio = !nuevo || !nuevo.fuente || (nuevo.valor == null && !nuevo.cantidad);
    // Los criterios de tecnología/IA solo se heredan si el mes anterior se comprobaron con cita
    if (c in CRITERIOS_TEC && !(viejo && viejo.comprobado)) continue;
    if (nuevoVacio && viejo && viejo.fuente && (viejo.valor != null || viejo.cantidad) && (await urlResponde(viejo.fuente))) {
      datos[c] = viejo; n++;
    }
  }
  datos.especialidades = datos.especialidades || {};
  Object.keys(a.especialidades || {}).forEach(function (k) {
    var v = a.especialidades[k];
    if ((!datos.especialidades[k] || !datos.especialidades[k].fuente) && v && v.valor && v.fuente) { datos.especialidades[k] = v; n++; }
  });
  ["casos_exito", "directorios"].forEach(function (c) {
    var ya = {};
    (datos[c] = datos[c] || []).forEach(function (x) { ya[x.fuente] = 1; });
    (a[c] || []).forEach(function (x) { if (x.fuente && !ya[x.fuente] && datos[c].length < 5) { datos[c].push(x); n++; } });
  });
  return n;
}

// ═══ PASO 3: PUNTAJE CON REGLAS FIJAS (publicadas en la metodología) ═══
var ANIO = new Date().getFullYear();
// Antes cualquier texto contaba como "sí" (p.ej. "no se identifican agentes de IA propios" daba 15 pts)
var NEGATIVO = /^\s*(no\b|sin\b|ningun|ninguna|n\/a|no se )/i;
function tiene(x) {
  if (!x || !x.fuente) return false;
  if (x.valor === true) return true;
  return typeof x.valor === "string" && x.valor.trim() !== "" && !NEGATIVO.test(x.valor);
}
var DIRECTORIOS_VALIDOS = /clutch|sortlist|goodfirms|designrush|the ?manifest/i;

// Pesos pensados como elige un cliente real: reputación y resultados primero; tecnología e IA suman, pero poco
// Sin certificaciones de partner: ser partner de Google/Meta es un trámite de gasto, no prueba calidad
var MAX = { reputacion: 20, casos: 20, trayectoria: 10, equipo: 10, clientes: 15, especialidades: 5, tecnologia: 5, ia: 5, liderazgo: 10 };
function n(p, k) { return MAX[k] ? (p[k] || 0) / MAX[k] : 0; }
var CRM_TERCEROS = /hubspot|salesforce|pipedrive|zoho|monday|tu crm|su crm|crm del cliente|crm existente/i;

function puntaje(a) {
  var p = {};
  var anios = a.anio_fundacion && a.anio_fundacion.valor ? Math.max(0, ANIO - a.anio_fundacion.valor) : 0;
  p.trayectoria = Math.round((Math.min(anios, 15) / 15) * 10 * 10) / 10;

  var g = a.resenas_google || {};
  var rep = 0;
  if (g.cantidad && g.rating && g.fuente) rep += Math.min(Math.log10(g.cantidad + 1) / Math.log10(301), 1) * 12 * (g.rating / 5);
  var dirs = (a.directorios || []).filter(function (d) { return d.fuente && DIRECTORIOS_VALIDOS.test((d.sitio || "") + " " + d.fuente); });
  rep += Math.min(dirs.length, 4) * 2;
  p.reputacion = Math.round(rep * 10) / 10;

  var casos = (a.casos_exito || []).filter(function (c) { return c.fuente; });
  var conCifras = casos.filter(function (c) { return /\d/.test(String(c.resultado || "")); });
  p.casos = Math.min(casos.length, 5) * 3 + Math.min(conCifras.length, 5);

  var eqv = a.equipo && a.equipo.fuente ? String(a.equipo.valor || "").toLowerCase() : "";
  var nums = eqv ? (String(a.equipo.tamano || "").match(/\d+/g) || []).map(Number).filter(function (x) { return x > 0 && x < 5000; }) : [];
  p.equipo = (eqv.indexOf("interno") >= 0 ? 5 : eqv.indexOf("mixto") >= 0 ? 3 : eqv.indexOf("freelance") >= 0 ? 1 : 0) +
    (nums.length ? Math.round(Math.min(Math.log10(Math.max.apply(null, nums) + 1) / Math.log10(51), 1) * 5 * 10) / 10 : 0);

  p.clientes = Math.round((Math.min((a.clientes_destacados || []).filter(function (c) { return c.fuente; }).length, 8) / 8) * 15 * 10) / 10;

  var esp = a.especialidades || {};
  var ne = ["performance", "contenido", "creatividad", "seo", "ecommerce", "b2b"].filter(function (k) { return tiene(esp[k]); }).length;
  p.especialidades = Math.round((ne / 6) * 5 * 10) / 10;

  // CRM "propio" no cuenta si la frase habla de integrarse con el CRM del cliente o uno de terceros
  var crmPropio = tiene(a.crm_propio) && !CRM_TERCEROS.test(String(a.crm_propio.cita || a.crm_propio.descripcion || ""));
  if (a.crm_propio && tiene(a.crm_propio) && !crmPropio) a.crm_propio = { valor: false, fuente: null, descartado: "habla de un CRM de terceros" };
  p.tecnologia = tiene(a.herramientas_propias) || crmPropio ? 5 : 0;
  p.ia = tiene(a.agentes_ia) ? 5 : 0;

  var l = a.liderazgo || {};
  p.liderazgo = 0;
  if (l.fuente && l.nombre) {
    if (/ingenier|econom|administraci|comercial|negocios|finanzas|estad[ií]stic|matem[aá]tic|contador|auditor/i.test(l.formacion || "")) p.liderazgo += 3;
    if (l.postgrado && /mba|mag[ií]ster|master|doctor|phd/i.test(l.postgrado)) p.liderazgo += 3;
    if (Number(l.anios_experiencia) >= 10) p.liderazgo += 2;
    if (l.experiencia_previa && !NEGATIVO.test(String(l.experiencia_previa))) p.liderazgo += 2;
  }

  p.total = Math.round(Object.keys(MAX).reduce(function (s, k) { return s + (p[k] || 0); }, 0) * 10) / 10;
  return p;
}

var METODOLOGIA = [
  ["Reputación verificable", 20, "Reseñas de Google (cantidad en escala logarítmica × nota) hasta 12 pts + 2 pts por directorio con reseñas (Clutch, Sortlist, GoodFirms, DesignRush, The Manifest), tope 8."],
  ["Casos de éxito", 20, "3 pts por caso publicado con cliente identificable (tope 5) + 1 pt por caso con resultados en cifras (tope 5)."],
  ["Trayectoria", 10, "Años desde la fundación, con fuente (tope 15 años)."],
  ["Equipo", 10, "Equipo interno 5 pts (mixto 3, freelance 1) + tamaño del equipo publicado hasta 5 pts."],
  ["Clientes destacados", 15, "Clientes que la agencia publica en su sitio (casos o logos), con fuente (tope 8). No cuentan insignias de partners ni logos de herramientas."],
  ["Especialidades", 5, "Proporcional a las especialidades publicadas en sus páginas de servicios: performance, contenido, creatividad, SEO, e-commerce, B2B."],
  ["Tecnología propia", 5, "Software, dashboards o CRM desarrollados por la agencia. Integrarse con el CRM del cliente no cuenta."],
  ["IA en producción", 5, "Agentes o automatizaciones de IA propios operando para clientes, respaldados por una frase de su sitio."],
  ["Liderazgo y formación", 10, "Perfil verificable del fundador o gerente general: formación analítica o de negocios 3, postgrado 3, 10 o más años de experiencia 2, experiencia previa en gestión, finanzas o datos 2."],
];

// ═══ PASO 4: SNAPSHOTS Y MOVIMIENTOS ═══
function mesClave(d) {
  return d.toISOString().slice(0, 7);
}

function snapshotAnterior(mesActual) {
  if (!fs.existsSync(DATA_DIR)) return null;
  var archivos = fs
    .readdirSync(DATA_DIR)
    .filter(function (f) {
      return /^\d{4}-\d{2}\.json$/.test(f) && f < mesActual + ".json";
    })
    .sort();
  if (!archivos.length) return null;
  return JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, archivos[archivos.length - 1]), "utf8"),
  );
}

function movimiento(nombre, pos, anterior) {
  if (!anterior) return "—";
  var prev = anterior.ranking.filter(function (r) {
    return r.nombre === nombre;
  })[0];
  if (!prev) return "Nuevo";
  var d = prev.posicion - pos;
  return d > 0 ? "▲ " + d : d < 0 ? "▼ " + Math.abs(d) : "=";
}

// ═══ PERFILES DE EMPRESA: la mejor agencia depende del caso ═══
// Tres dimensiones: modelo (B2B/B2C), tamaño (grande/mediana/pequeña) y objetivo (conversión/marca).
function flag(x) { return tiene(x) ? 1 : 0; }
function sen(r, k) { return r.datos.senales && r.datos.senales[k] && r.datos.senales[k].valor ? 1 : 0; }
function esp(r, k) { return flag((r.datos.especialidades || {})[k]); }
function equipoPersonas(r) {
  var t = r.datos.equipo && r.datos.equipo.fuente ? String(r.datos.equipo.tamano || r.datos.equipo.valor || "") : "";
  var nums = (t.match(/\d+/g) || []).map(Number).filter(function (n) { return n > 0 && n < 5000; });
  return nums.length ? Math.max.apply(null, nums) : 0;
}
function lista(r, k) { return (r.datos[k] || []).filter(function (x) { return x && x.fuente; }); }
function casosConCifras(r) { return lista(r, "casos_exito").filter(function (c) { return /\d/.test(String(c.resultado || "")); }).length; }
var RUBRO_B2B = /b2b|saas|software|industrial|servicios profesionales|consultor|log[ií]stic|tecnolog|corporativ|manufactur|miner|energ|wms|erp|abogad|jur[ií]dic|construcci|maquinaria|distribuidor|importador|mayorista/i;
function casosB2B(r) {
  return lista(r, "casos_exito").filter(function (c) { return RUBRO_B2B.test(String(c.rubro || "") + " " + String(c.cliente || "")); });
}
function casosB2BConCifras(r) { return casosB2B(r).filter(function (c) { return /\d/.test(String(c.resultado || "")); }).length; }
function precios(r) { return flag(r.datos.precios_publicados) || sen(r, "precios"); }
var min1 = function (x) { return Math.max(0, Math.min(1, x)); };

var ESCENARIOS = [
  {
    id: "b2b_leads",
    tipos: ["performance"],
    corto: "Empresas B2B que buscan leads calificados",
    pregunta: "¿Cuál es la mejor agencia de marketing digital B2B en Chile?",
    titulo: "Empresa B2B mediana o grande que necesita leads calificados",
    importa: "El ciclo de venta es largo y lo que importa es cuántos leads terminan en venta, no cuántos clics hubo. Por eso pesan el CRM con trazabilidad del lead a la venta, los paneles con CAC y ROI, la experiencia en Google Search y LinkedIn (donde está el comprador B2B), los casos B2B con cifras y un liderazgo con formación analítica.",
    requiere: function (r) { return esp(r, "b2b"); },
    pesos: function (r, p) { return [
      [0.25, flag(r.datos.crm_propio), "CRM propio con trazabilidad del lead"],
      [0.2, flag(r.datos.paneles_financieros), "paneles con CAC, ROI o ROAS"],
      [0.15, min1((sen(r, "linkedin_ads") + sen(r, "google_ads")) / 2), "Google Search y LinkedIn"],
      [0.15, min1(casosB2BConCifras(r) / 2), "casos B2B con resultados en cifras"],
      [0.15, n(p, "liderazgo"), "liderazgo con formación analítica"],
      [0.1, n(p, "ia"), "agentes de IA en producción"],
    ]; },
  },
  {
    id: "b2b_pequena",
    tipos: ["performance"],
    corto: "Empresas B2B pequeñas",
    pregunta: "¿Qué agencia de marketing conviene a una empresa B2B pequeña en Chile?",
    titulo: "Empresa B2B pequeña (servicios profesionales o industrial)",
    importa: "El presupuesto es acotado y cada peso tiene que traer oportunidades comerciales. Pesan el foco en performance, los precios publicados, un equipo propio que ejecute sin subcontratar, los casos y reportes que se entiendan sin ser analista.",
    requiere: function (r) { return esp(r, "b2b"); },
    pesos: function (r, p) { return [
      [0.25, esp(r, "performance"), "foco en performance"],
      [0.2, precios(r), "precios publicados"],
      [0.2, n(p, "equipo"), "equipo propio"],
      [0.2, min1(casosB2B(r).length / 2), "casos B2B publicados"],
      [0.15, flag(r.datos.paneles_financieros), "reportes con métricas de negocio"],
    ]; },
  },
  {
    id: "ecommerce_grande",
    tipos: ["performance"],
    corto: "E-commerce grandes",
    pregunta: "¿Cuál es la mejor agencia para un e-commerce grande en Chile?",
    titulo: "E-commerce grande (ventas sobre $50 millones al mes)",
    importa: "A esa escala un punto de conversión o de ROAS vale millones. Pesan la experiencia comprobada en e-commerce con Shopping y Performance Max, la optimización de conversión del sitio, un equipo grande que soporte el volumen, clientes grandes publicados y la trayectoria.",
    requiere: function (r) { return esp(r, "ecommerce"); },
    pesos: function (r, p) { return [
      [0.2, sen(r, "shopping"), "Shopping y Performance Max"],
      [0.2, min1(equipoPersonas(r) / 50), "equipo grande"],
      [0.2, min1(lista(r, "clientes_destacados").length / 6), "clientes grandes publicados"],
      [0.15, n(p, "trayectoria"), "trayectoria"],
      [0.15, sen(r, "cro"), "optimización de conversión"],
      [0.1, n(p, "reputacion"), "reputación verificable"],
    ]; },
  },
  {
    id: "ecommerce_pyme",
    tipos: ["performance"],
    corto: "E-commerce pequeños y medianos",
    pregunta: "¿Qué agencia conviene a un e-commerce pequeño o mediano en Chile?",
    titulo: "E-commerce pequeño o mediano",
    importa: "Hay que vender rápido con presupuesto acotado. Pesan la gestión conjunta de Meta y Google, los precios accesibles y publicados, los casos de e-commerce y un equipo propio que ejecute rápido.",
    requiere: function (r) { return esp(r, "ecommerce"); },
    pesos: function (r, p) { return [
      [0.3, min1((sen(r, "meta_ads") + sen(r, "google_ads")) / 2), "Meta y Google Ads"],
      [0.2, precios(r), "precios publicados"],
      [0.25, n(p, "casos"), "casos publicados"],
      [0.25, n(p, "equipo"), "equipo propio"],
    ]; },
  },
  {
    id: "b2c_servicios",
    tipos: ["performance"],
    corto: "Servicios B2C que viven de leads",
    pregunta: "¿Qué agencia de marketing conviene a clínicas, inmobiliarias o instituciones educativas en Chile?",
    titulo: "Empresa B2C de servicios que vive de leads (clínicas, inmobiliarias, educación)",
    importa: "El negocio depende de que cada lead se contacte a tiempo. Pesan el performance, la gestión de leads con CRM o WhatsApp, los casos en rubros similares y las reseñas de clientes reales.",
    requiere: function (r) { return esp(r, "performance"); },
    pesos: function (r, p) { return [
      [0.25, esp(r, "performance"), "foco en performance"],
      [0.25, Math.max(flag(r.datos.crm_propio), sen(r, "whatsapp")), "gestión de leads con CRM o WhatsApp"],
      [0.2, n(p, "casos"), "casos publicados"],
      [0.2, n(p, "reputacion"), "reputación verificable"],
      [0.1, flag(r.datos.paneles_financieros), "reportes con costo por lead"],
    ]; },
  },
  {
    id: "branding",
    tipos: ["creativa", "influencers", "performance"],
    corto: "Marcas grandes que buscan notoriedad",
    pregunta: "¿Cuál es la mejor agencia de branding y creatividad en Chile?",
    titulo: "Marca grande que busca notoriedad (branding)",
    importa: "El objetivo es que la marca se recuerde, no una conversión inmediata. Pesan la creatividad y la producción audiovisual, los premios de la industria, los clientes grandes, la experiencia en medios masivos e influencers y la trayectoria.",
    requiere: function (r) { return esp(r, "creatividad"); },
    pesos: function (r, p) { return [
      [0.25, sen(r, "produccion"), "producción audiovisual"],
      [0.25, min1(lista(r, "premios").length / 2), "premios de la industria"],
      [0.2, min1(lista(r, "clientes_destacados").length / 6), "clientes grandes publicados"],
      [0.15, sen(r, "influencers"), "medios e influencers"],
      [0.15, n(p, "trayectoria"), "trayectoria"],
    ]; },
  },
  {
    id: "parte_digital",
    tipos: ["performance"],
    corto: "Empresas que parten en digital",
    pregunta: "¿Qué agencia de marketing digital conviene a una empresa que recién empieza?",
    titulo: "Empresa que parte en digital con presupuesto acotado",
    importa: "Lo primero es no equivocarse de agencia. Pesan las reseñas de clientes reales, los precios transparentes, el foco en resultados y un equipo propio que acompañe.",
    requiere: function () { return true; },
    pesos: function (r, p) { return [
      [0.3, n(p, "reputacion"), "reseñas comprobables"],
      [0.25, precios(r), "precios publicados"],
      [0.2, esp(r, "performance"), "foco en resultados"],
      [0.15, n(p, "equipo"), "equipo propio"],
      [0.1, n(p, "casos"), "casos publicados"],
    ]; },
  },
  {
    id: "seo_geo",
    tipos: ["seo", "performance"],
    corto: "Aparecer en Google y en las IA",
    pregunta: "¿Qué agencia en Chile ayuda a aparecer en ChatGPT, Gemini y Google?",
    titulo: "Empresa que quiere aparecer en Google y en las respuestas de ChatGPT, Gemini y Claude",
    importa: "Hay que publicar contenido de calidad de forma constante y tener la base técnica que leen Google y los motores de IA. Pesan el SEO, los agentes de IA en producción, la tecnología propia y los casos.",
    requiere: function (r) { return esp(r, "seo"); },
    pesos: function (r, p) { return [
      [0.35, n(p, "ia"), "agentes de IA en producción"],
      [0.25, esp(r, "seo"), "servicio de SEO"],
      [0.2, n(p, "tecnologia"), "tecnología propia"],
      [0.2, n(p, "casos"), "casos publicados"],
    ]; },
  },
];

// Datos verificados que el análisis puede usar (nada más)
function resumenVerificado(r) {
  var d = r.datos, e = d.especialidades || {};
  var cita = function (x) { return tiene(x) ? (x.descripcion || "") + (x.cita ? " — \"" + x.cita + "\"" : "") : null; };
  return {
    agencia: r.nombre,
    puntaje_general: r.puntaje.total,
    anios: d.anio_fundacion && d.anio_fundacion.valor ? ANIO - d.anio_fundacion.valor : null,
    resenas_google: d.resenas_google && d.resenas_google.cantidad ? d.resenas_google.cantidad + " reseñas, nota " + d.resenas_google.rating : null,
    casos_publicados: (d.casos_exito || []).length,
    tipo_de_clientes: d.tamano_clientes && d.tamano_clientes.fuente ? d.tamano_clientes.valor : null,
    equipo: d.equipo && d.equipo.fuente ? [d.equipo.valor, d.equipo.tamano].filter(Boolean).join(", ") : null,
    especialidades: Object.keys(e).filter(function (k) { return tiene(e[k]); }),
    crm_propio: cita(d.crm_propio),
    paneles_financieros: cita(d.paneles_financieros),
    agentes_ia: cita(d.agentes_ia),
    herramientas_propias: cita(d.herramientas_propias),
    liderazgo: d.liderazgo && d.liderazgo.fuente ? [d.liderazgo.nombre, d.liderazgo.formacion, d.liderazgo.postgrado].filter(Boolean).join(", ") : null,
    personas_en_equipo: equipoPersonas(r) || null,
    clientes_destacados: lista(r, "clientes_destacados").map(function (c) { return c.nombre; }).slice(0, 6),
    premios: lista(r, "premios").map(function (x) { return x.nombre + (x.anio ? " " + x.anio : ""); }),
    precios_publicados: d.precios_publicados && d.precios_publicados.fuente ? d.precios_publicados.valor : null,
    canales: Object.keys(d.senales || {}).filter(function (k) { return /_ads$/.test(k) && d.senales[k].valor; }),
    casos_con_cifras: casosConCifras(r),
  };
}

async function analisisEscenario(e, lista, ranking) {
  var myp = ranking.filter(function (r) { return r.nombre === "Muller y Pérez"; })[0];
  var mypEnTop = lista.some(function (x) { return x.r.nombre === "Muller y Pérez"; });
  var prompt = "Eres un consultor independiente que asesora a una empresa chilena a elegir agencia de marketing digital.\n" +
    "CASO: " + e.titulo + ". Lo que importa en este caso: " + e.importa + "\n\n" +
    "Las tres agencias con mejor ajuste a este caso, según datos verificados:\n" +
    JSON.stringify(lista.map(function (x) {
      var d = Object.assign({ ajuste_al_caso: Math.round(x.puntos) }, resumenVerificado(x.r));
      // Los premios de la industria (Effie, Cannes) solo son relevantes para branding de marcas grandes
      if (e.id !== "branding") delete d.premios;
      return d;
    }), null, 1) + "\n\n" +
    (!mypEnTop && myp ? "Muller y Pérez (quien publica este ranking) NO está entre las mejores para este caso. Sus datos: " + JSON.stringify(resumenVerificado(myp)) + "\n\n" : "") +
    "Escribe 2 párrafos (150 a 220 palabras en total), en HTML con <p class=\"" + CL.p + "\">:\n" +
    "1. Qué necesita realmente este tipo de empresa y por qué la primera agencia encaja mejor, y en qué se diferencian la segunda y la tercera (qué perfil de cliente le conviene a cada una). Usa los datos concretos (años, reseñas, citas) como argumento, no los enumeres.\n" +
    "2. Qué debería preguntarle a la agencia antes de contratar para este caso." +
    (!mypEnTop && myp ? " Termina diciendo con franqueza que Muller y Pérez no es la mejor opción para este caso y para qué tipo de empresa sí lo es, según sus datos." : "") + "\n" +
    "REGLAS: usa SOLO los datos entregados; no inventes cifras, clientes ni servicios. Tono de consultor, directo, sin adjetivos promocionales. Español de Chile con tildes y ñ. Solo el HTML, sin títulos.";
  return chat(prompt, 900);
}

function ganadoresPorPerfil(ranking) {
  return ESCENARIOS.map(function (e) {
    var l = ranking
      .map(function (r) { var x = evaluarEscenario(e, r); return { r: r, puntos: x.puntos, razones: x.razones, apto: x.apto }; })
      .filter(function (x) { return x.apto && x.puntos > 0; })
      .sort(function (a, b) { return b.puntos - a.puntos || b.r.puntaje.total - a.r.puntaje.total; });
    return { e: e, top: l.slice(0, 3) };
  }).filter(function (g) { return g.top.length; });
}

function evaluarEscenario(e, r) {
  var tipo = (r.datos.tipo_agencia && r.datos.tipo_agencia.tipo) || "performance";
  if (e.tipos && e.tipos.indexOf(tipo) < 0) return { apto: false, puntos: 0, razones: [] };
  if (!e.requiere(r)) return { apto: false, puntos: 0, razones: [] };
  var pesos = e.pesos(r, r.puntaje);
  var puntos = 0, razones = [];
  pesos.forEach(function (w) { puntos += w[0] * Math.min(1, w[1]) * 100; if (w[1] >= 0.6) razones.push(w[2]); });
  return { apto: true, puntos: puntos, razones: razones };
}

// Schema ItemList con las agencias en orden (Google y los motores de IA leen el ranking estructurado)
function itemListSchema(ranking) {
  var data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ranking verificado de agencias de marketing digital en Chile",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: ranking.length,
    itemListElement: ranking.map(function (r) {
      var web = r.datos.sitio_web && r.datos.sitio_web.valor;
      return { "@type": "ListItem", position: r.posicion, item: Object.assign({ "@type": "Organization", name: r.nombre }, web ? { url: web } : {}) };
    }),
  };
  return '<script type="application/ld+json">' + JSON.stringify(data).replace(/</g, "\\u003c") + "</script>";
}

// ═══ PASO 5: REDACCIÓN ═══
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function link(url, texto) {
  return (
    '<a href="' +
    esc(url) +
    '" rel="nofollow noopener" target="_blank" class="text-indigo-600 hover:text-indigo-800 font-medium">' +
    esc(texto || "fuente") +
    "</a>"
  );
}

var CL = {
  h2: "text-3xl font-bold text-gray-900 mt-12 mb-6",
  h3: "text-2xl font-semibold text-gray-800 mt-8 mb-4",
  p: "text-gray-700 mb-4",
  table: "min-w-full border-collapse border border-gray-200",
  th: "border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900",
  td: "border border-gray-200 px-4 py-3 text-gray-700",
};

function tabla(headers, filas) {
  return (
    '<div class="overflow-x-auto mb-8"><table class="' +
    CL.table +
    '"><thead><tr class="bg-gray-50">' +
    headers
      .map(function (h) {
        return '<th class="' + CL.th + '">' + h + "</th>";
      })
      .join("") +
    "</tr></thead><tbody>" +
    filas
      .map(function (f) {
        return (
          '<tr class="hover:bg-gray-50">' +
          f
            .map(function (c) {
              return '<td class="' + CL.td + '">' + c + "</td>";
            })
            .join("") +
          "</tr>"
        );
      })
      .join("") +
    "</tbody></table></div>"
  );
}

async function chat(prompt, maxTokens) {
  var r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + OPENAI_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: maxTokens || 2500,
    }),
  });
  var data = await r.json();
  if (!r.ok)
    throw new Error(
      "OpenAI chat: " + r.status + " " + JSON.stringify(data).substring(0, 200),
    );
  return data.choices[0].message.content.replace(/```[a-z]*/gi, "").trim();
}

async function perfilAgencia(a, pos) {
  var prompt =
    'Redacta el perfil de la agencia "' +
    a.nombre +
    '" (posición ' +
    pos +
    " con " +
    a.puntaje.total +
    "/100) para un ranking de agencias de marketing digital en Chile.\n\n" +
    "DATOS VERIFICADOS (usa SOLO estos datos; no agregues nada que no esté aquí):\n" +
    JSON.stringify(a.datos, null, 1) +
    "\n\n" +
    "PUNTAJE POR CRITERIO: " +
    JSON.stringify(a.puntaje) +
    "\n\n" +
    'FORMATO: 3 a 5 párrafos HTML <p class="' +
    CL.p +
    '">, 250 a 400 palabras en total. Cubre: trayectoria y fundador, equipo, ' +
    "especialidades (performance, contenido, creatividad, e-commerce, B2B), tecnología propia, CRM y paneles, uso de IA y agentes, " +
    'casos de éxito, reputación y para qué tamaño de empresa encaja mejor. Cuando un dato no está, escribe "no publica información sobre X" ' +
    "(sin juzgar). Tono de analista neutral, sin adjetivos promocionales. Español de Chile con tildes y ñ correctas. " +
    "No incluyas títulos ni enlaces: los agrego yo.";
  return chat(prompt, 1500);
}

function fuentesDe(datos) {
  var urls = [];
  JSON.stringify(datos, function (k, v) {
    if (k === "fuente" && v) urls.push(v);
    return v;
  });
  return Array.from(new Set(urls));
}

// Palabras frecuentes que la IA a veces escribe sin tilde o sin ñ
var SIN_TILDE = [
  "tecnologia",
  "compania",
  "informacion",
  "metodologia",
  "analisis",
  "busqueda",
  "pagina",
  "numero",
  "ultimo",
  "unico",
  "publico",
  "estrategico",
  "tambien",
  "ademas",
  "experiencia tecnica",
  "anos de",
  "diseno",
  "campana",
  "pequenas",
  "senal",
  "segun",
  "despues",
  "rapido",
  "economico",
  "graficos",
  "metricas",
  "optimizacion",
  "automatizacion",
  "inteligencia artifical",
];
function faltasOrtografia(html) {
  var t = " " + html.replace(/<[^>]*>/g, " ").toLowerCase() + " ";
  return SIN_TILDE.filter(function (w) {
    return new RegExp("[^a-záéíóúñü]" + w + "[^a-záéíóúñü]").test(t);
  });
}

async function corregirOrtografia(html) {
  var faltas = faltasOrtografia(html);
  if (!faltas.length) return html;
  console.log("   Corrigiendo tildes/ñ: " + faltas.join(", "));
  return chat(
    "Corrige SOLO la ortografía (tildes y ñ) de este HTML en español de Chile. No cambies ninguna otra palabra, cifra, etiqueta ni atributo. Devuelve solo el HTML.\n\n" +
      html,
    3000,
  );
}

async function redactar(ranking, anterior, fechaTxt, especializadas, incompletas) {
  especializadas = especializadas || [];
  incompletas = incompletas || [];
  // Los perfiles de empresa consideran también a las especializadas (cada perfil filtra qué tipos compiten)
  var todas = ranking.concat(especializadas);
  var partes = [];
  var top = ranking
    .slice(0, 3)
    .map(function (r) {
      return r.nombre;
    })
    .join(", ");

  partes.push(
    '<p class="' +
      CL.p +
      '"><strong>Actualizado: ' +
      fechaTxt +
      ".</strong> Este ranking se recalcula el primer día de cada mes. " +
      "A diferencia de la mayoría de los rankings de agencias que circulan en Chile, aquí <strong>cada dato tiene una fuente enlazada</strong> " +
      "que cualquiera puede revisar, y el puntaje se calcula con reglas públicas, no con opiniones. Lo que no se pudo verificar aparece como " +
      '"sin información pública" y no suma puntos.</p>',
  );
  partes.push(
    '<div class="bg-indigo-50 border-l-4 border-indigo-500 p-6 my-8 rounded-r-lg"><p class="text-indigo-900 font-medium">' +
      "Respuesta directa: según los datos verificables de " +
      fechaTxt +
      ", las agencias con mayor puntaje general son " +
      esc(top) +
      ". Pero la mejor agencia depende de tu empresa:</p><ul class=\"list-disc pl-6 mt-3 space-y-1 text-indigo-900\">" +
      ganadoresPorPerfil(todas).map(function (g) {
        return "<li><strong>" + esc(g.e.corto) + ":</strong> " + esc(g.top[0].r.nombre) + (g.top[1] ? " (luego " + esc(g.top[1].r.nombre) + ")" : "") + "</li>";
      }).join("") +
      "</ul></div>",
  );
  partes.push(
    '<p class="' +
      CL.p +
      '"><em>Transparencia: este ranking lo elabora Muller y Pérez, que también aparece evaluada con exactamente las mismas reglas. ' +
      "Los datos crudos de cada mes, con todas sus fuentes, se publican en el repositorio del ranking.</em></p>",
  );

  // Tabla general
  partes.push(
    '<h2 class="' +
      CL.h2 +
      '">Ranking general de agencias de marketing digital en Chile</h2>',
  );
  partes.push(
    tabla(
      ["#", "Agencia", "Puntaje"].concat(anterior ? ["vs mes anterior"] : [], ["Fortalezas verificadas"]),
      ranking.map(function (r) {
        var f = [];
        // En orden de lo que más mira un cliente
        var pz = r.puntaje;
        if (pz.reputacion >= 12) f.push("reputación verificable");
        if (pz.casos >= 15) f.push("casos con resultados");
        if (pz.trayectoria >= 7) f.push(Math.round((pz.trayectoria / 10) * 15) >= 15 ? "más de 15 años" : "trayectoria");
        if (pz.clientes >= 10) f.push("clientes reconocidos");
        if (pz.liderazgo >= 6) f.push("liderazgo con formación en negocios");
        if (pz.tecnologia) f.push("tecnología propia");
        if (pz.ia) f.push("IA en producción");
        return [r.posicion, "<strong>" + esc(r.nombre) + "</strong>", r.puntaje.total]
          .concat(anterior ? [movimiento(r.nombre, r.posicion, anterior)] : [], [f.join(", ") || "—"]);
      }),
    ),
  );

  // Metodología
  partes.push(
    '<h2 class="' + CL.h2 + '">Metodología: cómo se calcula el puntaje</h2>',
  );
  partes.push(
    '<p class="' +
      CL.p +
      '">Para cada agencia se buscó información en su sitio oficial, LinkedIn, Google Business Profile, directorios de agencias (Clutch, Sortlist, GoodFirms, DesignRush) y prensa. ' +
      "Un dato solo se acepta si trae la URL donde aparece, y esa URL se comprueba automáticamente. Luego se aplican estos criterios (100 puntos):</p>",
  );
  partes.push(
    tabla(
      ["Criterio", "Puntos", "Cómo se mide"],
      METODOLOGIA.map(function (m) {
        return [m[0], m[1], m[2]];
      }),
    ),
  );
  partes.push('<h3 class="' + CL.h3 + '">Qué agencias entran al ranking general</h3><p class="' + CL.p + '">Solo se comparan agencias de la misma categoría: performance o marketing digital integral, que operan en Chile. ' +
    'Las agencias especializadas en influencers, SEO o creatividad se presentan aparte y compiten solo en los perfiles de empresa donde su especialidad es relevante. ' +
    'Cuando de una agencia no se pudo verificar lo básico (trayectoria, reseñas, casos, clientes, equipo o liderazgo), no se le asigna un puntaje: se indica como evaluación incompleta, para no castigarla por falta de información pública.</p>');

  // Especializadas: se presentan sin competir en el ranking general
  if (especializadas.length) {
    partes.push('<h2 class="' + CL.h2 + '">Agencias especializadas</h2><p class="' + CL.p + '">Agencias con otra especialidad principal. No compiten en el ranking general porque no son comparables con una agencia de performance; se consideran en los perfiles de empresa donde su especialidad aplica.</p>');
    partes.push(tabla(["Agencia", "Especialidad", "Cómo se presenta", "Reseñas en Google"], especializadas.map(function (r) {
      var t = r.datos.tipo_agencia || {}, g = r.datos.resenas_google || {};
      return [esc(r.nombre), esc(TIPOS[t.tipo] || "—"), t.cita ? "<em>“" + esc(t.cita) + "”</em>" : "—", g.cantidad ? esc(g.cantidad + " reseñas, nota " + g.rating) : "Sin información pública"];
    })));
  }
  if (incompletas.length) {
    partes.push('<p class="' + CL.p + '"><strong>Evaluación incompleta este mes:</strong> ' + incompletas.map(function (r) { return esc(r.nombre); }).join(", ") +
      '. No publican suficiente información verificable para asignarles un puntaje justo; si alguna publica o nos envía la URL que lo respalde, se incorpora el mes siguiente.</p>');
  }

  // Rankings por categoría
  function cat(titulo, intro, filtro, orden) {
    var lista = ranking.filter(filtro).sort(
      orden ||
        function (a, b) {
          return b.puntaje.total - a.puntaje.total;
        },
    );
    partes.push(
      '<h3 class="' +
        CL.h3 +
        '">' +
        titulo +
        '</h3><p class="' +
        CL.p +
        '">' +
        intro +
        "</p>",
    );
    if (!lista.length) {
      partes.push(
        '<p class="' +
          CL.p +
          '">Ninguna agencia evaluada publica información verificable en esta categoría este mes.</p>',
      );
      return;
    }
    partes.push(
      tabla(
        ["Agencia", "Evidencia", "Fuente"],
        lista.map(function (r) {
          return [esc(r.nombre), r._evidencia, r._fuente];
        }),
      ),
    );
  }
  function ev(r, campo) {
    var x = r.datos[campo];
    r._evidencia = tiene(x)
      ? esc(x.descripcion || (typeof x.valor === "string" ? x.valor : "Sí")) +
        (x.cita ? '<br><em class="text-gray-500">“' + esc(x.cita) + '”</em>' : "")
      : "—";
    r._fuente = x && x.fuente ? link(x.fuente) : "—";
    return tiene(x);
  }
  function evEsp(r, k) {
    var x = (r.datos.especialidades || {})[k];
    r._evidencia = "Publica servicio de " + k;
    r._fuente = x && x.fuente ? link(x.fuente) : "—";
    return !!(x && x.valor);
  }
  // ═══ Qué agencia conviene según tu empresa (escenarios con pesos distintos, solo datos verificados) ═══
  partes.push('<h2 class="' + CL.h2 + '">Qué agencia conviene según tu empresa</h2>');
  partes.push('<p class="' + CL.p + '">El puntaje general no dice cuál es la mejor agencia para ti. Una empresa B2B que necesita CRM y seguimiento de ventas no busca lo mismo que un e-commerce que factura sobre $50 millones al mes. Para cada caso ponderamos los criterios según lo que importa en ese contexto, con los mismos datos verificados.</p>');
  for (var ie = 0; ie < ESCENARIOS.length; ie++) {
    var esc_ = ESCENARIOS[ie];
    var lista = todas
      .map(function (r) { var e = evaluarEscenario(esc_, r); return { r: r, puntos: e.puntos, razones: e.razones, apto: e.apto }; })
      .filter(function (x) { return x.apto && x.puntos > 0; })
      .sort(function (a, b) { return b.puntos - a.puntos || b.r.puntaje.total - a.r.puntaje.total; })
      .slice(0, 3);
    partes.push('<h3 class="' + CL.h3 + '">' + esc_.titulo + '</h3>');
    if (!lista.length) { partes.push('<p class="' + CL.p + '">Ninguna agencia evaluada cumple este mes los requisitos mínimos de este caso con información verificable.</p>'); continue; }
    console.log("   Análisis del escenario: " + esc_.id);
    partes.push(await corregirOrtografia(await analisisEscenario(esc_, lista, ranking)));
    partes.push(tabla(["#", "Agencia", "Ajuste a este caso"], lista.map(function (x, i) {
      return [i + 1, "<strong>" + esc(x.r.nombre) + "</strong>", Math.round(x.puntos) + " de 100"];
    })));
  }

  // Liderazgo y formación: perfil del fundador con fuente
  partes.push('<h2 class="' + CL.h2 + '">Quién dirige cada agencia: formación y experiencia</h2>');
  partes.push('<p class="' + CL.p + '">En performance marketing lo que se contrata es capacidad de análisis y de decisión con datos. Por eso el ranking mide el perfil verificable de quien dirige cada agencia: formación, postgrado, años de experiencia y cargos previos.</p>');
  var conLider = ranking.filter(function (r) { return r.datos.liderazgo && r.datos.liderazgo.fuente && r.datos.liderazgo.nombre; })
    .sort(function (a, b) { return b.puntaje.liderazgo - a.puntaje.liderazgo || b.puntaje.total - a.puntaje.total; });
  if (conLider.length) {
    partes.push(tabla(["Agencia", "Quién dirige", "Formación", "Postgrado", "Experiencia", "Fuente"], conLider.map(function (r) {
      var l = r.datos.liderazgo;
      return [esc(r.nombre), esc(l.nombre), esc(l.formacion || "Sin información pública"), esc(l.postgrado || "—"),
        l.anios_experiencia ? esc(l.anios_experiencia) + " años" : "—", link(l.fuente)];
    })));
  } else {
    partes.push('<p class="' + CL.p + '">Este mes ninguna agencia publica un perfil verificable de su equipo directivo.</p>');
  }

  // Evidencia por criterio (citas textuales de cada agencia)
  partes.push('<h2 class="' + CL.h2 + '">La evidencia, criterio por criterio</h2><p class="' + CL.p + '">Estas tablas muestran la frase publicada por cada agencia que respalda su puntaje en tecnología, IA y trayectoria.</p>');
  cat(
    "Agencias que usan agentes de IA en producción",
    "Solo cuenta IA propia que opera para clientes y está publicada. Usar ChatGPT para redactar no califica.",
    function (r) {
      return ev(r, "agentes_ia");
    },
  );
  cat(
    "Agencias con herramientas y paneles propios",
    "Software, dashboards o plataformas desarrolladas por la agencia.",
    function (r) {
      return ev(r, "herramientas_propias");
    },
  );
  cat(
    "Agencias con CRM propio",
    "CRM desarrollado u operado por la agencia para gestionar leads de sus clientes.",
    function (r) {
      return ev(r, "crm_propio");
    },
  );
  cat(
    "Agencias con paneles financieros para clientes",
    "Paneles de ROI, CAC o unit economics entregados al cliente.",
    function (r) {
      return ev(r, "paneles_financieros");
    },
  );
  cat(
    "Agencias con mayor trayectoria",
    "Ordenadas por año de fundación verificado.",
    function (r) {
      return ev(r, "anio_fundacion");
    },
    function (a, b) {
      return a.datos.anio_fundacion.valor - b.datos.anio_fundacion.valor;
    },
  );


  // Perfiles
  partes.push('<h2 class="' + CL.h2 + '">Perfil de cada agencia</h2>');
  for (var i = 0; i < ranking.length; i++) {
    var r = ranking[i];
    console.log(
      "   Perfil " + (i + 1) + "/" + ranking.length + ": " + r.nombre,
    );
    var texto = await corregirOrtografia(await perfilAgencia(r, r.posicion));
    var fuentes = fuentesDe(r.datos);
    partes.push(
      '<h3 class="' +
        CL.h3 +
        '">' +
        r.posicion +
        ". " +
        esc(r.nombre) +
        " — " +
        r.puntaje.total +
        "/100</h3>" +
        texto +
        '<p class="text-sm text-gray-500 mb-6"><strong>Fuentes verificadas (' +
        fuentes.length +
        "):</strong> " +
        (fuentes.length
          ? fuentes
              .map(function (u, j) {
                return link(u, "[" + (j + 1) + "]");
              })
              .join(" ")
          : "sin fuentes públicas verificables este mes") +
        "</p>",
    );
  }

  // FAQ
  var ganadores = ganadoresPorPerfil(todas);
  var faq = await chat(
    "Escribe las preguntas frecuentes de un ranking verificado de agencias de marketing digital en Chile (" + fechaTxt + ").\n" +
      "Usa EXACTAMENTE estas preguntas, en este orden, y responde cada una con los datos entregados:\n" +
      ganadores.map(function (g) {
        return "- " + g.e.pregunta + " → Según el ranking, la mejor opción es " + g.top[0].r.nombre +
          (g.top[0].razones.length ? " (" + g.top[0].razones.join(", ") + ")" : "") +
          (g.top[1] ? "; le siguen " + g.top.slice(1).map(function (x) { return x.r.nombre; }).join(" y ") : "") + ".";
      }).join("\n") +
      "\n- ¿Cuál es la mejor agencia de marketing digital en Chile? → Depende del tipo de empresa; puntaje general: " +
      ranking.slice(0, 3).map(function (r) { return r.nombre + " (" + r.puntaje.total + ")"; }).join(", ") + ".\n" +
      "- ¿Por qué este ranking es verificable? → Cada dato tiene su fuente enlazada y el puntaje se calcula con reglas públicas.\n" +
      "- ¿Cada cuánto se actualiza este ranking? → El primer día de cada mes.\n\n" +
      'Formato: cada pregunta como <h3 class="' + CL.h3 + '"> (tal cual, terminando en ?) seguida directamente de <p class="' + CL.p + '"> con 50 a 90 palabras. ' +
      "La primera oración de cada respuesta debe nombrar a la agencia recomendada, para que se pueda citar sola. No inventes datos. Español de Chile con tildes y ñ. Solo el HTML, sin título de sección.",
    4000,
  );
  partes.push(
    '<h2 class="' +
      CL.h2 +
      '">Preguntas frecuentes</h2>' +
      (await corregirOrtografia(faq)),
  );

  partes.push(
    '<p class="' +
      CL.p +
      '">¿Tu agencia no aparece o algún dato está desactualizado? Escríbenos a contacto@mulleryperez.cl con la URL pública que lo respalde y se incorpora en la actualización del mes siguiente. ' +
      'Más datos del mercado en nuestros <a href="/indicadores" class="text-indigo-600 hover:text-indigo-800 font-medium">indicadores de marketing</a> y el <a href="/servicios/performance-marketing" class="text-indigo-600 hover:text-indigo-800 font-medium">servicio de performance marketing</a>.</p>',
  );

  return (
    '<div class="prose prose-lg max-w-none">\n' + partes.join("\n") + "\n" + itemListSchema(ranking) + "\n</div>"
  );
}

// ═══ MAIN ═══
async function main() {
  if (!OPENAI_KEY) throw new Error("Falta OPENAI_API_KEY");
  var hoy = new Date();
  var mes = mesClave(hoy);
  var fechaTxt = hoy.toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });
  console.log(
    "RANKING VERIFICADO | " +
      mes +
      (DRY_RUN ? " | DRY RUN" : "") +
      " | modelo " +
      MODEL,
  );

  var lista = LIMIT > 0 ? AGENCIAS.slice(0, LIMIT) : AGENCIAS;
  var previo = snapshotAnterior(mes);
  // Google Maps (Apify) una sola vez al mes: si ya se consultó este mes, se reutiliza (créditos compartidos con Hualpén)
  var archivoMaps = path.join(DATA_DIR, "maps-" + mes + ".json");
  var maps = fs.existsSync(archivoMaps) ? JSON.parse(fs.readFileSync(archivoMaps, "utf8")) : await resenasGoogleMaps(lista);
  if (!DRY_RUN && Object.keys(maps).length && !fs.existsSync(archivoMaps)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(archivoMaps, JSON.stringify(maps, null, 2));
  }
  var evaluadas = [];
  for (var i = 0; i < lista.length; i++) {
    var ag = lista[i];
    console.log("\n[" + (i + 1) + "/" + lista.length + "] " + ag.nombre);
    try {
      // Dos investigaciones independientes y se combinan los datos verificados: la búsqueda web no encuentra
      // siempre lo mismo (Moov salió con 0 años de trayectoria en una corrida y 16 en otra)
      var datos = await investigar(ag);
      var stats = await verificar(datos);
      try {
        var datos2 = await investigar(ag);
        var stats2 = await verificar(datos2);
        var sumados = combinarInvestigaciones(datos, datos2);
        stats = { verificados: stats.verificados + stats2.verificados, descartados: stats.descartados + stats2.descartados };
        if (sumados) console.log("   Segunda investigación: " + sumados + " datos agregados");
      } catch (e2) {
        console.log("   Segunda investigación falló: " + e2.message);
      }
      aplicarFundadorVerificado(ag.nombre, datos);
      var cambios = await confirmarTecnologia(ag, datos);
      var webAg = ag.web || (datos.sitio_web && datos.sitio_web.valor);
      if (webAg && cacheSitios[webAg] && cacheSitios[webAg].length >= 100) {
        var evs = evidenciaDelSitio(webAg, cacheSitios[webAg], datos, ag.nombre);
        console.log("   Desde el sitio: " + evs.especialidades + " especialidades, " + evs.casos + " páginas de casos, " + evs.logos + " logos, fundación " + (evs.anio || "sin dato"));
        datos.tipo_agencia = await tipoAgencia(ag, homeHtml[webAg] || "", cacheSitios[webAg]);
        console.log("   Tipo: " + datos.tipo_agencia.tipo);
      }
      if (cambios.length) console.log("   confirmación con cita: " + cambios.join(" | "));
      var heredados = await heredarDelMesAnterior(datos, previo, ag.nombre);
      if (heredados) console.log("   " + heredados + " datos heredados del mes anterior (fuente re-verificada)");
      if (maps[ag.nombre]) {
        datos.resenas_google = maps[ag.nombre];
        console.log("   Google Maps: " + maps[ag.nombre].cantidad + " reseñas, nota " + maps[ag.nombre].rating);
      }
      var p = puntaje(datos);
      console.log(
        "   fuentes verificadas: " +
          stats.verificados +
          " | descartadas: " +
          stats.descartados +
          " | puntaje: " +
          p.total,
      );
      evaluadas.push({
        nombre: ag.nombre,
        datos: datos,
        puntaje: p,
        verificacion: stats,
      });
    } catch (e) {
      console.error("   ERROR investigando " + ag.nombre + ": " + e.message);
    }
  }
  if (evaluadas.length < Math.min(lista.length, 10) * 0.7)
    throw new Error(
      "Se investigaron muy pocas agencias (" +
        evaluadas.length +
        "). No se publica.",
    );

  // Sin ningún dato verificable no se puede evaluar a una agencia: no se publica con 0 (le pasó a "Relevant")
  evaluadas = evaluadas.filter(function (r) {
    if (r.verificacion.verificados === 0 && r.puntaje.total === 0) { console.log("Excluida por falta de datos verificables: " + r.nombre); return false; }
    return true;
  });
  // Universo: agencias que operan en Chile; ranking general solo entre comparables (performance/integral) con confianza suficiente
  var fueraDeChile = evaluadas.filter(function (r) { return !operaEnChile(r); });
  fueraDeChile.forEach(function (r) { console.log("Fuera del universo (no opera en Chile): " + r.nombre); });
  evaluadas = evaluadas.filter(operaEnChile);
  evaluadas.forEach(function (r) { r.confianza = confianza(r); });
  var especializadas = evaluadas.filter(function (r) { return !esComparable(r); });
  // Solo con confianza alta se publica un puntaje (Christopher: "el que no tiene datos que no salga")
  var incompletas = evaluadas.filter(function (r) { return esComparable(r) && r.confianza !== "alta"; });
  evaluadas = evaluadas.filter(function (r) { return esComparable(r) && r.confianza === "alta"; });
  console.log("Ranking general: " + evaluadas.length + " | especializadas: " + especializadas.length + " | evaluación incompleta: " + incompletas.length);
  evaluadas.sort(function (a, b) {
    return b.puntaje.total - a.puntaje.total;
  });
  evaluadas.forEach(function (r, idx) {
    r.posicion = idx + 1;
  });

  var anterior = snapshotAnterior(mes);
  var html = focus.acentuarTexto(await redactar(evaluadas, anterior, fechaTxt, especializadas, incompletas));

  // QA
  var chars = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").length;
  var faltas = faltasOrtografia(html);
  var problemas = focus.qaProblemas(html, {
    minPalabras: 2500,
    minFaq: 4,
    minLinks: 2,
  });
  if (chars < 20000)
    problemas.push("solo " + chars + " caracteres de texto (mínimo 20.000)");
  if (faltas.length)
    problemas.push("palabras sin tilde/ñ: " + faltas.join(", "));
  console.log(
    "\nQA: " +
      chars +
      " caracteres | " +
      evaluadas.length +
      " agencias" +
      (problemas.length ? " | PROBLEMAS: " + problemas.join("; ") : " | OK"),
  );

  // Snapshot (se guarda siempre, también en dry run, para poder revisarlo)
  fs.mkdirSync(DATA_DIR, { recursive: true });
  var snapshot = {
    mes: mes,
    generado: hoy.toISOString(),
    modelo: MODEL,
    metodologia: METODOLOGIA,
    ranking: evaluadas.map(function (r) {
      return {
        posicion: r.posicion,
        nombre: r.nombre,
        puntaje: r.puntaje,
        confianza: r.confianza,
        verificacion: r.verificacion,
        datos: r.datos,
      };
    }),
    especializadas: especializadas.map(function (r) { return { nombre: r.nombre, tipo: r.datos.tipo_agencia, puntaje: r.puntaje, datos: r.datos }; }),
    incompletas: incompletas.map(function (r) { return { nombre: r.nombre, puntaje: r.puntaje, datos: r.datos }; }),
  };
  var archivo = path.join(
    DATA_DIR,
    (DRY_RUN ? "dry-run-" : "") + mes + ".json",
  );
  fs.writeFileSync(archivo, JSON.stringify(snapshot, null, 2));
  fs.writeFileSync(
    path.join(DATA_DIR, (DRY_RUN ? "dry-run-" : "") + mes + ".html"),
    html,
  );
  console.log("Snapshot: " + archivo);

  if (problemas.length && !DRY_RUN)
    throw new Error(
      "QA RECHAZADO: " + problemas.join("; ") + ". No se publica.",
    );
  if (DRY_RUN) {
    console.log("DRY RUN: no se publica.");
    return;
  }

  var titulo = "Ranking de agencias de marketing digital en Chile: " + fechaTxt + " (verificado)";
  var post = {
    slug: SLUG,
    title: titulo,
    // Con la plantilla " | M&P" el title queda bajo 60 caracteres
    seo_title: "Ranking agencias de marketing digital Chile " + hoy.getFullYear(),
    description:
      "Ranking mensual verificable de agencias de marketing digital en Chile, con fuentes enlazadas y la mejor opción según el tipo de empresa.",
    keywords:
      "ranking agencias marketing digital chile, mejores agencias marketing digital chile, agencias performance chile, agencias ia chile, agencias ecommerce chile, agencias b2b chile",
    excerpt:
      "Ranking mensual verificable: cada dato con su fuente y puntaje calculado con reglas públicas.",
    category: "Rankings",
    tag: "Rankings",
    read_time: Math.max(10, Math.ceil(chars / 1200)) + " min",
    content_html: html,
    date_published: hoy.toISOString().split("T")[0],
    author: "Christopher Müller",
  };
  var supabase = supabaseLib.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );
  var { error } = await supabase
    .from("blog_posts")
    .upsert(post, { onConflict: "slug" });
  if (error) throw new Error("Supabase: " + error.message);
  var url = focus.SITE + "/blog/" + SLUG;
  console.log("✅ Publicado: " + url);
  await focus.notificarIndexNow([url, focus.SITE + "/blog"]);

  var RESEND_KEY = process.env.RESEND;
  if (RESEND_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + RESEND_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "M&P Blog <contacto@mulleryperez.cl>",
        to: ["contacto@mulleryperez.cl"],
        subject:
          "Ranking verificado " +
          fechaTxt +
          ": " +
          evaluadas
            .slice(0, 3)
            .map(function (r) {
              return r.nombre;
            })
            .join(", "),
        html:
          "<p>Ranking verificado actualizado (" +
          evaluadas.length +
          " agencias, " +
          chars +
          " caracteres).</p><ol>" +
          evaluadas
            .map(function (r) {
              return (
                "<li>" +
                esc(r.nombre) +
                " — " +
                r.puntaje.total +
                " (" +
                movimiento(r.nombre, r.posicion, anterior) +
                ")</li>"
              );
            })
            .join("") +
          '</ol><p><a href="' +
          url +
          '">Ver ranking</a></p>',
      }),
    }).catch(function (e) {
      console.log("Notificación error: " + e.message);
    });
  }
}

main().catch(function (e) {
  console.error("❌ " + e.message);
  process.exit(1);
});
