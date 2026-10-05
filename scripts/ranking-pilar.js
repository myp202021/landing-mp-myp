#!/usr/bin/env node
/**
 * Datos de la página pilar /mejores-agencias-marketing-digital-chile
 *
 * Lee el último snapshot verificado (data/ranking-agencias/AAAA-MM.json), calcula los perfiles de empresa
 * con las MISMAS reglas del ranking (scripts/ranking-agencias-verificado.js) y escribe una versión compacta
 * en data/ranking-agencias/pilar.json. No llama a ninguna API: solo transforma datos ya verificados.
 *
 * Uso: node scripts/ranking-pilar.js   (lo corre el workflow mensual después del ranking)
 */
var fs = require("fs");
var path = require("path");
var R = require("./ranking-agencias-verificado.js");

var DIR = path.join(__dirname, "..", "data", "ranking-agencias");
var archivos = fs
  .readdirSync(DIR)
  .filter(function (f) {
    return /^\d{4}-\d{2}\.json$/.test(f);
  })
  .sort();
if (!archivos.length) throw new Error("No hay snapshots en " + DIR);
var snap = JSON.parse(
  fs.readFileSync(path.join(DIR, archivos[archivos.length - 1]), "utf8"),
);

// Un dato de otra agencia cuya "fuente" es nuestro propio sitio no cuenta como verificado (evita citas circulares)
var PROPIA = "Muller y Pérez";
var actual = null;
function fuenteOk(f) {
  return !!f && (actual === PROPIA || !/mulleryperez\.cl/i.test(f));
}
function val(x) {
  return x &&
    fuenteOk(x.fuente) &&
    x.valor !== null &&
    x.valor !== undefined &&
    x.valor !== false &&
    x.valor !== ""
    ? x.valor
    : null;
}
function unicos(arr, clave) {
  var vistos = {};
  return arr.filter(function (x) {
    var k = String(clave(x)).toLowerCase();
    if (!k || vistos[k]) return false;
    vistos[k] = 1;
    return true;
  });
}
var NOMBRE_RUIDO = /partner|rgb|\d+x\d+|^[-_]|[-_]$|como posicionar|captacion/i;
function conFuente(lista) {
  return (lista || []).filter(function (x) {
    return x && x.fuente;
  });
}
function limpio(t) {
  return String(t || "")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Perfiles de empresa: mismo cálculo que el informe completo (ranking general + especializadas)
var todas = snap.ranking.concat(snap.especializadas || []);
var perfiles = R.ESCENARIOS.map(function (e) {
  var top = todas
    .map(function (r) {
      var x = R.evaluarEscenario(e, r);
      return { r: r, puntos: x.puntos, razones: x.razones, apto: x.apto };
    })
    .filter(function (x) {
      return x.apto && x.puntos > 0;
    })
    .sort(function (a, b) {
      return b.puntos - a.puntos || b.r.puntaje.total - a.r.puntaje.total;
    })
    .slice(0, 3);
  return {
    id: e.id,
    corto: e.corto,
    pregunta: e.pregunta,
    titulo: e.titulo,
    importa: e.importa,
    top: top.map(function (x) {
      return {
        nombre: x.r.nombre,
        ajuste: Math.round(x.puntos),
        razones: x.razones,
      };
    }),
  };
}).filter(function (p) {
  return p.top.length;
});

function mejorPara(nombre) {
  var out = [];
  perfiles.forEach(function (p) {
    p.top.forEach(function (t, i) {
      if (t.nombre === nombre) out.push({ perfil: p.corto, lugar: i + 1 });
    });
  });
  return out.sort(function (a, b) {
    return a.lugar - b.lugar;
  });
}

function ficha(r) {
  actual = r.nombre;
  var d = r.datos;
  var resenas =
    d.resenas_google && d.resenas_google.cantidad
      ? {
          cantidad: d.resenas_google.cantidad,
          nota: d.resenas_google.rating,
          fuente: d.resenas_google.fuente,
        }
      : null;
  var casos = conFuente(d.casos_exito)
    .filter(function (c) {
      return /\d/.test(String(c.resultado || ""));
    })
    .map(function (c) {
      return {
        cliente: limpio(c.cliente),
        resultado: limpio(c.resultado),
        fuente: c.fuente,
      };
    });
  casos = unicos(casos, function (c) {
    return c.cliente || c.resultado;
  }).slice(0, 2);
  var lid =
    d.liderazgo && d.liderazgo.fuente
      ? {
          nombre: d.liderazgo.nombre,
          formacion: d.liderazgo.formacion,
          postgrado: d.liderazgo.postgrado,
        }
      : null;
  return {
    posicion: r.posicion || null,
    nombre: r.nombre,
    total: r.puntaje.total,
    puntaje: r.puntaje,
    sitio: val(d.sitio_web),
    anio: val(d.anio_fundacion),
    ubicacion:
      d.opera_en_chile && d.opera_en_chile.fuente
        ? limpio(d.opera_en_chile.descripcion)
        : null,
    equipo:
      d.equipo && d.equipo.fuente
        ? limpio(d.equipo.tamano || d.equipo.valor)
        : null,
    tipo_clientes: val(d.tamano_clientes),
    resenas: resenas,
    precios:
      d.precios_publicados &&
      d.precios_publicados.fuente &&
      val(d.precios_publicados)
        ? {
            valor: limpio(d.precios_publicados.valor),
            fuente: d.precios_publicados.fuente,
          }
        : null,
    clientes: conFuente(d.clientes_destacados)
      .map(function (c) {
        return limpio(c.nombre);
      })
      .filter(function (n) {
        return n && !NOMBRE_RUIDO.test(n);
      })
      .filter(function (n, i, arr) {
        return arr.indexOf(n) === i;
      })
      .slice(0, 4),
    casos: casos,
    liderazgo: lid,
    ia:
      d.agentes_ia && d.agentes_ia.fuente && d.agentes_ia.valor
        ? limpio(d.agentes_ia.descripcion)
        : null,
    tecnologia:
      (d.crm_propio && d.crm_propio.fuente && d.crm_propio.valor
        ? limpio(d.crm_propio.descripcion)
        : null) ||
      (d.herramientas_propias &&
      d.herramientas_propias.fuente &&
      d.herramientas_propias.valor
        ? limpio(d.herramientas_propias.descripcion)
        : null),
    fuentes_verificadas: r.verificacion ? r.verificacion.verificados : null,
    mejor_para: mejorPara(r.nombre),
  };
}

var pilar = {
  mes: snap.mes,
  actualizado: snap.generado,
  metodologia: snap.metodologia,
  ranking: snap.ranking.map(ficha),
  especializadas: (snap.especializadas || []).map(function (r) {
    var f = ficha(r);
    f.tipo = r.tipo && r.tipo.tipo;
    return f;
  }),
  incompletas: (snap.incompletas || []).map(function (r) {
    return {
      nombre: r.nombre,
      total: r.puntaje.total,
      sitio: val(r.datos.sitio_web),
    };
  }),
  perfiles: perfiles,
};

fs.writeFileSync(path.join(DIR, "pilar.json"), JSON.stringify(pilar, null, 2));
console.log(
  "pilar.json: " +
    pilar.ranking.length +
    " agencias, " +
    perfiles.length +
    " perfiles (" +
    snap.mes +
    ")",
);
