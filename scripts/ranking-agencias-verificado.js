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
  "casos_exito": [{"cliente": "nombre", "resultado": "resultado con número si existe", "fuente": "https://..."}],
  "resenas_google": {"cantidad": 115, "rating": 5.0, "fuente": "https://..."},
  "directorios": [{"sitio": "Clutch | Sortlist | GoodFirms | DesignRush | The Manifest (solo estos)", "resenas": 10, "fuente": "https://..."}],
  "tamano_clientes": {"valor": "pymes | medianas | grandes | mixto", "fuente": "https://..."},
  "certificaciones": {"valor": "p.ej. Google Partner, Meta Business Partner, HubSpot Partner", "fuente": "https://..."}
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
    '- No infieras ni estimes. "La agencia ofrece SEO" solo es true si una página lo dice.\n' +
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

var cacheSitios = {};
async function frasesDelSitio(web) {
  if (cacheSitios[web]) return cacheSitios[web];
  var urls = await urlsDelSitio(web);
  var frases = [];
  for (var i = 0; i < urls.length; i++) {
    var html = await htmlDe(urls[i]);
    frasesDe(html).forEach(function (f) { frases.push({ frase: f, url: urls[i] }); });
  }
  console.log("   Sitio recorrido: " + urls.length + " páginas, " + frases.length + " frases");
  cacheSitios[web] = frases;
  return frases;
}

async function confirmarDesdeSitio(agencia, campo, frases) {
  var vistos = {};
  var candidatas = frases.filter(function (x) {
    if (!PALABRAS_CRITERIO[campo].test(x.frase) || vistos[x.frase]) return false;
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
          '\n\n¿Alguna frase, por sí sola, demuestra que se cumple el criterio? Responde SOLO JSON: {"indice": número de la frase que mejor lo demuestra o 0 si ninguna, "descripcion": "qué es, en una frase breve"}',
      }],
    }),
  });
  var data = await r.json();
  var j = JSON.parse(data.choices[0].message.content);
  var c = candidatas[(j.indice || 0) - 1];
  if (!c) return { valor: false, descripcion: null, fuente: null };
  return { valor: true, descripcion: j.descripcion, fuente: c.url, cita: c.frase, comprobado: "frase publicada en el sitio de la agencia" };
}

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
  var busquedas = agencias.map(function (a) { return a.nombre + " agencia marketing digital"; });
  try {
    var r = await fetch("https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=" + token + "&timeout=600", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: busquedas,
        locationQuery: "Santiago, Chile",
        maxCrawledPlacesPerSearch: 2, // ~40 fichas al mes en total
        language: "es",
        maxReviews: 0,
        maxImages: 0,
        scrapePlaceDetailPage: false,
      }),
    });
    if (!r.ok) { console.log("Apify Google Maps: HTTP " + r.status); return {}; }
    var items = await r.json();
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

// ═══ ESTABILIDAD ENTRE MESES ═══
// La búsqueda web no encuentra siempre lo mismo. Un dato verificado el mes anterior se mantiene si su fuente
// sigue respondiendo; así una agencia no baja solo porque la IA no lo encontró esta vez.
async function heredarDelMesAnterior(datos, previo, nombre) {
  if (!previo) return 0;
  var ant = (previo.ranking || []).filter(function (r) { return r.nombre === nombre; })[0];
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

function puntaje(a) {
  var p = {};
  var anios =
    a.anio_fundacion && a.anio_fundacion.valor
      ? Math.max(0, ANIO - a.anio_fundacion.valor)
      : 0;
  p.trayectoria = Math.round((Math.min(anios, 15) / 15) * 10 * 10) / 10;

  var g = a.resenas_google || {};
  var rep = 0;
  if (g.cantidad && g.rating && g.fuente)
    rep +=
      Math.min(Math.log10(g.cantidad + 1) / Math.log10(301), 1) *
      9 *
      (g.rating / 5);
  var dirs = (a.directorios || []).filter(function (d) {
    return d.fuente && DIRECTORIOS_VALIDOS.test((d.sitio || "") + " " + d.fuente);
  });
  rep += Math.min(dirs.length, 3) * 2;
  p.reputacion = Math.round(rep * 10) / 10;

  p.casos = Math.min((a.casos_exito || []).length, 5) * 3;

  p.tecnologia =
    (tiene(a.herramientas_propias) ? 7 : 0) +
    (tiene(a.crm_propio) ? 4 : 0) +
    (tiene(a.paneles_financieros) ? 4 : 0);
  p.ia = tiene(a.agentes_ia) ? 15 : 0;

  var eq =
    a.equipo && a.equipo.fuente
      ? String(a.equipo.valor || "").toLowerCase()
      : "";
  p.equipo =
    eq.indexOf("interno") >= 0
      ? 10
      : eq.indexOf("mixto") >= 0
        ? 6
        : eq.indexOf("freelance") >= 0
          ? 3
          : 0;

  var esp = a.especialidades || {};
  var n = [
    "performance",
    "contenido",
    "creatividad",
    "seo",
    "ecommerce",
    "b2b",
  ].filter(function (k) {
    return tiene(esp[k]);
  }).length;
  p.especialidades = Math.round(((n * 10) / 6) * 10) / 10;

  // Liderazgo y formación del equipo directivo (10 pts), solo con fuente
  var l = a.liderazgo || {};
  p.liderazgo = 0;
  if (l.fuente && l.nombre) {
    if (/ingenier|econom|administraci|comercial|negocios|finanzas|estad[ií]stic|matem[aá]tic|contador|auditor/i.test(l.formacion || "")) p.liderazgo += 3;
    if (l.postgrado && /mba|mag[ií]ster|master|doctor|phd|diplomado en (gesti|direcci|negocios)/i.test(l.postgrado)) p.liderazgo += 3;
    if (Number(l.anios_experiencia) >= 10) p.liderazgo += 2;
    if (l.experiencia_previa && !NEGATIVO.test(String(l.experiencia_previa))) p.liderazgo += 2;
  }

  p.total =
    Math.round(
      (p.trayectoria +
        p.reputacion +
        p.casos +
        p.tecnologia +
        p.ia +
        p.equipo +
        p.especialidades +
        p.liderazgo) *
        10,
    ) / 10;
  return p;
}

var METODOLOGIA = [
  ["Trayectoria", 10, "Años desde la fundación (tope 15 años), con fuente."],
  [
    "Reputación verificable",
    15,
    "Reseñas de Google leídas directamente de la ficha de Google Maps de cada agencia (cantidad en escala logarítmica × nota) hasta 9 pts + 2 pts por directorio con reseñas (Clutch, Sortlist, GoodFirms, DesignRush, The Manifest), tope 6.",
  ],
  [
    "Casos de éxito publicados",
    15,
    "3 pts por caso con cliente identificable y fuente, tope 5 casos.",
  ],
  [
    "Tecnología propia",
    15,
    "Herramientas o dashboards propios 7 pts, CRM propio 4 pts, paneles financieros (ROI, CAC) 4 pts.",
  ],
  [
    "IA en producción",
    15,
    "Agentes o automatizaciones de IA propios y publicados, operando para clientes. Usar ChatGPT u otras herramientas de terceros no suma.",
  ],
  [
    "Equipo",
    10,
    "Equipo interno 10 pts, mixto 6 pts, freelance 3 pts, sin información 0.",
  ],
  [
    "Especialidades",
    10,
    "Puntaje proporcional a las especialidades publicadas: performance, contenido, creatividad, SEO, e-commerce, B2B.",
  ],
  [
    "Liderazgo y formación",
    10,
    "Perfil verificable del fundador o gerente general: formación universitaria analítica o de negocios 3 pts, postgrado (MBA o magíster) 3 pts, 10 o más años de experiencia 2 pts, experiencia previa en gestión, finanzas o datos 2 pts.",
  ],
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

async function redactar(ranking, anterior, fechaTxt) {
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
      ", las agencias con mayor puntaje son " +
      esc(top) +
      ". " +
      "El puntaje combina trayectoria, reputación verificable, casos de éxito publicados, tecnología propia, IA en producción, equipo y especialidades.</p></div>",
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
      ["#", "Agencia", "Puntaje", "vs mes anterior", "Fortalezas verificadas"],
      ranking.map(function (r) {
        var f = [];
        if (r.puntaje.ia) f.push("IA en producción");
        if (r.puntaje.tecnologia >= 7) f.push("tecnología propia");
        if (r.puntaje.casos >= 9) f.push("casos publicados");
        if (r.puntaje.reputacion >= 12) f.push("reputación");
        if (r.puntaje.trayectoria >= 7) f.push("trayectoria");
        if (r.puntaje.liderazgo >= 6) f.push("liderazgo con formación en negocios");
        return [
          r.posicion,
          "<strong>" + esc(r.nombre) + "</strong>",
          r.puntaje.total,
          movimiento(r.nombre, r.posicion, anterior),
          f.join(", ") || "—",
        ];
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

  // Rankings por categoría
  function cat(titulo, intro, filtro, orden) {
    var lista = ranking.filter(filtro).sort(
      orden ||
        function (a, b) {
          return b.puntaje.total - a.puntaje.total;
        },
    );
    partes.push(
      '<h2 class="' +
        CL.h2 +
        '">' +
        titulo +
        '</h2><p class="' +
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
  cat(
    "Mejores agencias de performance marketing",
    "Agencias que publican servicio de performance (campañas pagadas orientadas a resultados medibles), ordenadas por puntaje total.",
    function (r) {
      return evEsp(r, "performance");
    },
  );
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
    "Mejores agencias para e-commerce",
    "Agencias que publican especialización en comercio electrónico.",
    function (r) {
      return evEsp(r, "ecommerce");
    },
  );
  cat(
    "Mejores agencias B2B",
    "Agencias que publican especialización en empresas B2B.",
    function (r) {
      return evEsp(r, "b2b");
    },
  );
  cat(
    "Mejores agencias de contenido",
    "Agencias que publican servicio de contenido.",
    function (r) {
      return evEsp(r, "contenido");
    },
  );
  cat(
    "Mejores agencias creativas",
    "Agencias que publican servicio de creatividad y diseño.",
    function (r) {
      return evEsp(r, "creatividad");
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

  // Por tamaño de empresa
  partes.push(
    '<h2 class="' +
      CL.h2 +
      '">Qué agencia conviene según el tamaño de tu empresa</h2>',
  );
  partes.push(
    tabla(
      ["Agencia", "Tipo de cliente publicado", "Equipo", "Fuente"],
      ranking.map(function (r) {
        var t = r.datos.tamano_clientes || {};
        var e = r.datos.equipo || {};
        return [
          esc(r.nombre),
          esc(t.valor || "Sin información pública"),
          esc(
            [e.valor, e.tamano].filter(Boolean).join(", ") ||
              "Sin información pública",
          ),
          t.fuente ? link(t.fuente) : e.fuente ? link(e.fuente) : "—",
        ];
      }),
    ),
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
  var faq = await chat(
    "Escribe la sección de preguntas frecuentes de un ranking verificado de agencias de marketing digital en Chile (" +
      fechaTxt +
      "). " +
      "Top 5 del mes: " +
      ranking
        .slice(0, 5)
        .map(function (r) {
          return r.nombre + " (" + r.puntaje.total + ")";
        })
        .join(", ") +
      ". " +
      "Metodología: " +
      METODOLOGIA.map(function (m) {
        return m[0] + " " + m[1] + " pts";
      }).join(", ") +
      ".\n" +
      'Formato: 6 preguntas, cada una como <h3 class="' +
      CL.h3 +
      '"> terminando en ? seguida directamente de <p class="' +
      CL.p +
      '"> con 60 a 100 palabras. ' +
      "Incluye: cuál es la mejor agencia de marketing digital en Chile, cómo elegir agencia según tamaño de empresa, qué agencias usan IA, por qué este ranking es verificable, cada cuánto se actualiza, cuánto cuesta una agencia (sin inventar precios de otras agencias). " +
      "Usa solo los datos entregados. Español de Chile con tildes y ñ. Devuelve solo el HTML, sin título de sección.",
    2500,
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
    '<div class="prose prose-lg max-w-none">\n' + partes.join("\n") + "\n</div>"
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
  var maps = await resenasGoogleMaps(lista);
  var evaluadas = [];
  for (var i = 0; i < lista.length; i++) {
    var ag = lista[i];
    console.log("\n[" + (i + 1) + "/" + lista.length + "] " + ag.nombre);
    try {
      var datos = await investigar(ag);
      var stats = await verificar(datos);
      if (stats.descartados > stats.verificados) {
        // Una investigación con mayoría de fuentes caídas no es justa con la agencia: se reintenta una vez
        console.log("   " + stats.descartados + " descartadas vs " + stats.verificados + " verificadas → reintento");
        var datos2 = await investigar(ag);
        var stats2 = await verificar(datos2);
        if (stats2.verificados > stats.verificados) {
          datos = datos2;
          stats = stats2;
        }
      }
      var cambios = await confirmarTecnologia(ag, datos);
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

  evaluadas.sort(function (a, b) {
    return b.puntaje.total - a.puntaje.total;
  });
  evaluadas.forEach(function (r, idx) {
    r.posicion = idx + 1;
  });

  var anterior = snapshotAnterior(mes);
  var html = await redactar(evaluadas, anterior, fechaTxt);

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
        verificacion: r.verificacion,
        datos: r.datos,
      };
    }),
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

  var titulo =
    "Ranking de agencias de marketing digital en Chile " +
    hoy.getFullYear() +
    ": verificado con fuentes (" +
    fechaTxt +
    ")";
  var post = {
    slug: SLUG,
    title: titulo,
    seo_title:
      "Ranking agencias marketing digital Chile " +
      hoy.getFullYear() +
      " (verificado)",
    description:
      "Ranking mensual de agencias de marketing digital en Chile con fuentes verificables: performance, IA, e-commerce, B2B, contenido y creatividad. Actualizado " +
      fechaTxt +
      ".",
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
