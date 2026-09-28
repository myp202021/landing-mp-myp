// agentes-evidencia.js
// Genera data/agentes-evidencia.json con la evidencia real de cada agente de data/agentes-ia.json:
// última ejecución y ejecuciones exitosas de los últimos 30 días, leídas de GitHub Actions.
// La página /agentes-ia la muestra. Corre cada lunes (.github/workflows/agentes-evidencia.yml).
// Env: GH_PAT (token con lectura de Actions en todos los repos de myp202021)

var fs = require("fs");
var path = require("path");

var TOKEN = process.env.GH_PAT || process.env.GITHUB_TOKEN;
var RAIZ = path.join(__dirname, "..", "data");
var agentes = JSON.parse(
  fs.readFileSync(path.join(RAIZ, "agentes-ia.json"), "utf8"),
);

async function gh(url) {
  var r = await fetch("https://api.github.com" + url, {
    headers: {
      Authorization: "Bearer " + TOKEN,
      Accept: "application/vnd.github+json",
      "User-Agent": "myp-agentes-evidencia",
    },
  });
  if (!r.ok) throw new Error(r.status + " " + url);
  return r.json();
}

async function main() {
  if (!TOKEN) throw new Error("Falta GH_PAT");
  var desde = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  var out = {
    generado: new Date().toISOString(),
    ventana_dias: 30,
    agentes: {},
  };
  var cache = {};

  for (var i = 0; i < agentes.length; i++) {
    var a = agentes[i];
    if (!a.workflow) {
      out.agentes[a.id] = { tipo: "sin_workflow" };
      continue;
    }
    var clave = a.repo + "/" + a.workflow;
    try {
      if (!cache[clave]) {
        var runs = [];
        for (var page = 1; page <= 3; page++) {
          var d = await gh(
            "/repos/" +
              a.repo +
              "/actions/workflows/" +
              a.workflow +
              "/runs?per_page=100&page=" +
              page +
              "&created=%3E%3D" +
              desde,
          );
          runs = runs.concat(d.workflow_runs || []);
          if (!d.workflow_runs || d.workflow_runs.length < 100) break;
        }
        var exitosas = runs.filter(function (r) { return r.conclusion === "success" });
        // Última exitosa = la más reciente por fecha (no confiar en el orden de la API)
        var ultima = exitosas.map(function (r) { return r.updated_at }).sort().pop() || null;
        // Registro por día (hora de Chile): "ok" si hubo al menos una ejecución exitosa, "fallo" si solo fallas
        var dias = {};
        runs.forEach(function (r) {
          if (!r.conclusion) return;
          var d = new Date(r.created_at).toLocaleDateString("sv-SE", { timeZone: "America/Santiago" });
          if (r.conclusion === "success") dias[d] = "ok";
          else if (!dias[d]) dias[d] = "fallo";
        });
        cache[clave] = {
          tipo: "workflow",
          ejecuciones_30d: runs.length,
          exitosas_30d: exitosas.length,
          ultima_exitosa: ultima,
          dias: dias,
        };
      }
      out.agentes[a.id] = cache[clave];
      console.log(
        a.id +
          ": " +
          cache[clave].exitosas_30d +
          " exitosas / " +
          cache[clave].ejecuciones_30d,
      );
    } catch (e) {
      console.log(a.id + ": ERROR " + e.message);
      out.agentes[a.id] = { tipo: "error" };
    }
  }
  fs.writeFileSync(
    path.join(RAIZ, "agentes-evidencia.json"),
    JSON.stringify(out, null, 2),
  );
}

main().catch(function (e) {
  console.error(e.message);
  process.exit(1);
});
