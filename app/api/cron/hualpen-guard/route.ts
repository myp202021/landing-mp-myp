import { NextResponse } from "next/server";

// Respaldo independiente de los reportes de Buses Hualpén.
// Capa principal: cron-job.org dispara competencia-hualpen.yml ~06:09 Chile, y su
// watchdog dispara el clipping. Esta ruta la llama Vercel Cron (~06:40 Chile):
// si alguno no corrió hoy, lo dispara y avisa a Christopher.
// Ambos workflows tienen anti-duplicado en Supabase, así que disparar de más no duplica correos.

const REPO = "myp202021/landing-mp-myp";
const GH = "https://api.github.com/repos/" + REPO + "/actions/workflows/";

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GH_PAT}`,
    Accept: "application/vnd.github.v3+json",
  };
}

async function corrioHoy(workflow: string, hoy: string) {
  const res = await fetch(
    `${GH}${workflow}/runs?per_page=20&created=%3E%3D${hoy}T00:00:00Z`,
    { headers: ghHeaders() },
  );
  if (!res.ok) throw new Error(`GitHub ${res.status} al consultar ${workflow}`);
  const data = await res.json();
  return (data.workflow_runs || []).some(
    (r: any) => r.status !== "completed" || r.conclusion === "success",
  );
}

async function disparar(workflow: string) {
  const res = await fetch(`${GH}${workflow}/dispatches`, {
    method: "POST",
    headers: ghHeaders(),
    body: JSON.stringify({ ref: "main" }),
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
  const habil = dow >= 1 && dow <= 5;

  const revisar = [
    {
      workflow: "clipping-prensa-hualpen.yml",
      nombre: "Clipping prensa Hualpén",
    },
  ];
  if (habil) {
    revisar.unshift({
      workflow: "competencia-hualpen.yml",
      nombre: "Competencia Hualpén (PDF)",
    });
  }

  const acciones: string[] = [];
  for (const r of revisar) {
    try {
      if (await corrioHoy(r.workflow, hoy)) continue;
      const status = await disparar(r.workflow);
      acciones.push(
        `${r.nombre}: no había corrido, disparado de respaldo (HTTP ${status}${status === 204 ? "" : " — FALLÓ, revisar"})`,
      );
    } catch (e: any) {
      acciones.push(`${r.nombre}: error consultando GitHub — ${e.message}`);
    }
  }

  if (acciones.length) {
    await alertar(`⚠️ Hualpén: capa principal falló ${hoy}`, acciones);
  }
  return NextResponse.json({ ok: true, acciones });
}
