/**
 * Alerta por correo cuando un lead válido NO queda guardado en el CRM.
 * Usa el mismo mecanismo que /api/contact (Resend + RESEND_API_KEY, remitente noreply@mulleryperez.cl).
 * Nunca lanza excepción: si el envío falla solo se registra en consola,
 * para no romper la respuesta al usuario ni al webhook.
 */
import { Resend } from "resend";

const DESTINATARIO_ALERTA = "christopher@mulleryperez.cl";

interface AlertaLeadFallido {
  fuente: string;
  motivo: unknown;
  datos?: Record<string, unknown> | null;
}

function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function aTexto(valor: unknown): string {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "string") return valor;
  if (valor instanceof Error) return `${valor.name}: ${valor.message}`;
  try {
    return JSON.stringify(valor, null, 2);
  } catch {
    return String(valor);
  }
}

export async function alertarLeadFallido({
  fuente,
  motivo,
  datos,
}: AlertaLeadFallido): Promise<void> {
  try {
    const motivoTexto = aTexto(motivo) || "Sin detalle";
    const fecha = new Date().toLocaleString("es-CL", {
      timeZone: "America/Santiago",
    });
    const filas = Object.entries(datos || {})
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => {
        const texto = aTexto(v);
        return `<tr><td style="padding:6px 10px;border:1px solid #e5e7eb;font-weight:bold;background:#f9fafb;vertical-align:top;">${escaparHtml(k)}</td><td style="padding:6px 10px;border:1px solid #e5e7eb;white-space:pre-wrap;">${escaparHtml(texto.length > 2000 ? texto.substring(0, 2000) + "…" : texto)}</td></tr>`;
      })
      .join("");

    console.error(`[LEAD NO GUARDADO] ${fuente} | ${motivoTexto}`, datos || {});

    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "⚠️ RESEND_API_KEY no configurada. Alerta de lead fallido NO enviada.",
      );
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; color:#111827; line-height:1.5;">
  <div style="max-width:640px;margin:0 auto;padding:20px;">
    <h2 style="color:#b91c1c;margin:0 0 10px;">⚠ Lead NO guardado en CRM</h2>
    <p style="margin:0 0 16px;"><strong>Fuente:</strong> ${escaparHtml(fuente)}<br><strong>Fecha:</strong> ${escaparHtml(fecha)}</p>
    <p style="margin:0 0 6px;"><strong>Motivo / error:</strong></p>
    <pre style="background:#fef2f2;border-left:4px solid #b91c1c;padding:12px;white-space:pre-wrap;font-size:13px;margin:0 0 16px;">${escaparHtml(motivoTexto)}</pre>
    <p style="margin:0 0 6px;"><strong>Datos del lead:</strong></p>
    ${
      filas
        ? `<table style="border-collapse:collapse;width:100%;font-size:14px;">${filas}</table>`
        : '<p style="color:#6b7280;">Sin datos disponibles.</p>'
    }
    <p style="margin-top:20px;color:#6b7280;font-size:12px;">Cárgalo a mano en el CRM y revisa el error. Alerta automática de mulleryperez.cl.</p>
  </div>
</body>
</html>`.trim();

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Formulario M&P <noreply@mulleryperez.cl>",
      to: DESTINATARIO_ALERTA,
      subject: `⚠ Lead NO guardado en CRM — ${fuente}`,
      html,
      text: `Lead NO guardado en CRM — ${fuente}\nFecha: ${fecha}\n\nMotivo:\n${motivoTexto}\n\nDatos:\n${aTexto(datos || {})}`,
    });

    if (error) {
      console.error("❌ Error enviando alerta de lead fallido:", error);
    }
  } catch (err) {
    console.error("❌ Error en alertarLeadFallido:", err);
  }
}
