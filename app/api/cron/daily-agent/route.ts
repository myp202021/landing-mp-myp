import { NextResponse } from "next/server";

// Respaldo del agente maestro. La capa principal es el watchdog de
// competencia-hualpen.yml (cron-job.org, ~06:09 Chile). Esta ruta la llaman
// Vercel Cron y un segundo job de cron-job.org: si el reporte diario (L-V) o el
// informe semanal de clientes (lunes) no corrió hoy, lo dispara y avisa a Christopher.

const REPO = "myp202021/myp-daily-agent";
const GH = "https://api.github.com/repos/" + REPO + "/actions/workflows/";

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GH_PAT}`,
    Accept: "application/vnd.github.v3+json",
  };
}

async function corrioHoy(workflow: string, hoy: string) {
  const res = await fetch(
    `${GH}${workflow}/runs?per_page=10&created=%3E%3D${hoy}T00:00:00Z`,
    { headers: ghHeaders() },
  );
  if (!res.ok) throw new Error(`GitHub ${res.status} al consultar ${workflow}`);
  const data = await res.json();
  // Cuenta en curso o exitosas; un informe con algún cliente bloqueado termina en failure pero sí envió
  return (data.workflow_runs || []).some(
    (r: any) =>
      r.status !== "completed" ||
      r.conclusion === "success" ||
      workflow === "informe-semanal-clientes.yml",
  );
}

async function disparar(workflow: string, inputs?: Record<string, unknown>) {
  const res = await fetch(`${GH}${workflow}/dispatches`, {
    method: "POST",
    headers: ghHeaders(),
    body: JSON.stringify(inputs ? { ref: "main", inputs } : { ref: "main" }),
  });
  return res.status;
}

async function alertar(asunto: string, lineas: string[]) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Watchdog <contacto@mulleryperez.cl>",
      to: "christopher@mulleryperez.cl",
      subject: asunto,
      html:
        "<h2>" +
        asunto +
        "</h2><ul>" +
        lineas.map((l) => "<li>" + l + "</li>").join("") +
        "</ul>",
    }),
  });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ahora = new Date();
  const hoy = ahora.toISOString().split("T")[0];
  const dow = ahora.getUTCDay();
  if (dow === 0 || dow === 6)
    return NextResponse.json({ ok: true, message: "Fin de semana" });

  const pendientes: {
    workflow: string;
    nombre: string;
    inputs?: Record<string, unknown>;
  }[] = [{ workflow: "reporte-diario.yml", nombre: "Reporte diario M&P" }];
  if (dow === 1) {
    pendientes.push({
      workflow: "informe-semanal-clientes.yml",
      nombre: "Informe semanal SEO clientes",
      inputs: { preview: false },
    });
  }

  const acciones: string[] = [];
  try {
    for (const p of pendientes) {
      if (await corrioHoy(p.workflow, hoy)) continue;
      const status = await disparar(p.workflow, p.inputs);
      acciones.push(
        `${p.nombre}: no había corrido, disparado de respaldo (HTTP ${status}${status === 204 ? "" : " — FALLÓ, revisar"})`,
      );
    }
  } catch (e: any) {
    acciones.push("Error consultando GitHub: " + e.message);
  }

  if (acciones.length) {
    await alertar(`⚠️ Agente maestro: capa principal falló ${hoy}`, acciones);
  }
  return NextResponse.json({ ok: true, acciones });
}
