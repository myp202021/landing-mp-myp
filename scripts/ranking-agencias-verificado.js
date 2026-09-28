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
  "equipo": {"valor": "interno | mixto | freelance", "tamano": "p.ej. 25 personas", "fuente": "https://..."},
  "especialidades": {
    "performance": {"valor": true, "fuente": "https://..."},
    "contenido": {"valor": true, "fuente": "https://..."},
    "creatividad": {"valor": true, "fuente": "https://..."},
    "seo": {"valor": true, "fuente": "https://..."},
    "ecommerce": {"valor": true, "fuente": "https://..."},
    "b2b": {"valor": true, "fuente": "https://..."}
  },
  "herramientas_propias": {"valor": "descripción de software, dashboards o herramientas desarrolladas por la agencia", "fuente": "https://..."},
  "crm_propio": {"valor": "descripción", "fuente": "https://..."},
  "paneles_financieros": {"valor": "descripción de paneles de ROI/CAC/finanzas para clientes", "fuente": "https://..."},
  "agentes_ia": {"valor": "descripción concreta de agentes o automatizaciones de IA en producción", "fuente": "https://..."},
  "casos_exito": [{"cliente": "nombre", "resultado": "resultado con número si existe", "fuente": "https://..."}],
  "resenas_google": {"cantidad": 115, "rating": 5.0, "fuente": "https://..."},
  "directorios": [{"sitio": "Clutch | Sortlist | GoodFirms | DesignRush", "resenas": 10, "fuente": "https://..."}],
  "tamano_clientes": {"valor": "pymes | medianas | grandes | mixto", "fuente": "https://..."},
  "certificaciones": {"valor": "p.ej. Google Partner, Meta Business Partner, HubSpot Partner", "fuente": "https://..."}
}`;

function extraerJson(texto) {
  var limpio = texto.replace(/```json|```/g, "");
  var ini = limpio.indexOf("{");
  var fin = limpio.lastIndexOf("}");
  if (ini < 0 || fin < 0) throw new Error("La investigación no devolvió JSON");
  return JSON.parse(limpio.slice(ini, fin + 1));
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
    '- Cada dato DEBE llevar en "fuente" la URL exacta donde aparece. Si no encuentras una URL que lo respalde, pon null en ese campo.\n' +
    '- No infieras ni estimes. "La agencia ofrece SEO" solo es true si una página lo dice.\n' +
    "- casos_exito: solo casos publicados con cliente identificable. Máximo 5.\n" +
    "- herramientas_propias / crm_propio / paneles_financieros / agentes_ia: solo si la agencia los desarrolló o los opera ella misma y lo publica; revender HubSpot o usar ChatGPT no cuenta.\n" +
    "- Escribe en español de Chile con tildes y ñ correctas.\n\n" +
    "Responde SOLO con este JSON:\n" +
    ESQUEMA;
  var data = await llamarResponses({ model: MODEL, input: prompt });
  var json = extraerJson(textoDeRespuesta(data));
  json.nombre = agencia.nombre;
  return json;
}

// ═══ PASO 2: VERIFICAR FUENTES ═══
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
    ok = r.status < 400 || r.status === 403 || r.status === 429;
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
          v.cantidad;
        if (!tieneValor) continue;
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

// ═══ PASO 3: PUNTAJE CON REGLAS FIJAS (publicadas en la metodología) ═══
var ANIO = new Date().getFullYear();
function tiene(x) {
  return !!(x && x.valor);
}

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
      12 *
      (g.rating / 5);
  var dirs = (a.directorios || []).filter(function (d) {
    return d.fuente;
  });
  rep += Math.min(dirs.length, 4) * 2;
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
  p.especialidades = n * 2.5;

  p.total =
    Math.round(
      (p.trayectoria +
        p.reputacion +
        p.casos +
        p.tecnologia +
        p.ia +
        p.equipo +
        p.especialidades) *
        10,
    ) / 10;
  return p;
}

var METODOLOGIA = [
  ["Trayectoria", 10, "Años desde la fundación (tope 15 años), con fuente."],
  [
    "Reputación verificable",
    20,
    "Reseñas de Google (cantidad en escala logarítmica × nota) hasta 12 pts + 2 pts por directorio con reseñas (Clutch, Sortlist, GoodFirms, DesignRush), tope 8.",
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
    "Agentes o automatizaciones de IA propios y publicados, operando para clientes.",
  ],
  [
    "Equipo",
    10,
    "Equipo interno 10 pts, mixto 6 pts, freelance 3 pts, sin información 0.",
  ],
  [
    "Especialidades",
    15,
    "2,5 pts por especialidad publicada: performance, contenido, creatividad, SEO, e-commerce, B2B.",
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
    r._evidencia =
      x && x.valor ? esc(typeof x.valor === "string" ? x.valor : "Sí") : "—";
    r._fuente = x && x.fuente ? link(x.fuente) : "—";
    return !!(x && x.valor);
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
  var evaluadas = [];
  for (var i = 0; i < lista.length; i++) {
    var ag = lista[i];
    console.log("\n[" + (i + 1) + "/" + lista.length + "] " + ag.nombre);
    try {
      var datos = await investigar(ag);
      var stats = await verificar(datos);
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
