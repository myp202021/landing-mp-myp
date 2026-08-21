#!/usr/bin/env node
// Factura Tritec Energy — Bienvenida + Factura 2504
// Usage: node scripts/factura-tritec.js [--dry-run]

const fs = require('fs');
const path = require('path');
const os = require('os');

const DRY_RUN = process.argv.includes('--dry-run');
const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND;
const FROM = 'Muller y Pérez <gestionclientes@mulleryperez.cl>';
const DOWNLOADS = path.join(os.homedir(), 'Downloads');

function readPDF(filename) {
  const p = path.join(DOWNLOADS, filename);
  if (!fs.existsSync(p)) {
    console.error(`  ✗ PDF no encontrado: ${p}`);
    process.exit(1);
  }
  return fs.readFileSync(p).toString('base64');
}

const html = `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:680px;margin:0 auto;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:28px 36px;border-radius:8px 8px 0 0;">
    <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Facturación — Tritec Energy</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:4px;">Muller y Pérez · Agosto 2026</div>
  </div>
  <div style="padding:32px 36px;">
    <p style="margin:0 0 16px;color:#1E293B;font-size:15px;line-height:1.6;"><strong>Estimados,</strong></p>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
      Junto con saludar y darles la más cordial bienvenida como nuevo cliente de Muller y Pérez, adjuntamos la factura correspondiente al mes de agosto 2026. El plazo de pago es el <strong>31 de agosto de 2026</strong>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 8px;font-size:14px;">
      <thead>
        <tr>
          <th style="background:#4F46E5;color:#fff;padding:10px 14px;text-align:left;font-weight:600;">N° Factura</th>
          <th style="background:#4F46E5;color:#fff;padding:10px 14px;text-align:left;font-weight:600;">Período</th>
          <th style="background:#4F46E5;color:#fff;padding:10px 14px;text-align:left;font-weight:600;">Concepto</th>
          <th style="background:#4F46E5;color:#fff;padding:10px 14px;text-align:right;font-weight:600;">Neto</th>
          <th style="background:#4F46E5;color:#fff;padding:10px 14px;text-align:right;font-weight:600;">IVA</th>
          <th style="background:#4F46E5;color:#fff;padding:10px 14px;text-align:right;font-weight:600;">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;color:#1E293B;font-weight:600;">2504</td>
          <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;color:#374151;">Agosto 2026</td>
          <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;color:#374151;">Servicio de Marketing Ago</td>
          <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;color:#374151;text-align:right;">$900.000</td>
          <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;color:#374151;text-align:right;">$171.000</td>
          <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;color:#1E293B;text-align:right;font-weight:700;">$1.071.000</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5" style="padding:10px 14px;text-align:right;font-weight:700;color:#4F46E5;font-size:15px;">TOTAL</td>
          <td style="padding:10px 14px;text-align:right;font-weight:700;color:#4F46E5;font-size:15px;">$1.071.000</td>
        </tr>
      </tfoot>
    </table>
    <p style="font-size:12px;color:#6B7280;margin:0 0 24px;">Referencia: Orden de Compra N° Z725-103</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;font-size:14px;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
      <tr><td colspan="2" style="background:#F9FAFB;padding:10px 14px;font-weight:700;color:#1E293B;border-bottom:1px solid #E5E7EB;">Datos de transferencia</td></tr>
      <tr><td style="padding:8px 14px;color:#6B7280;border-bottom:1px solid #E5E7EB;width:160px;font-weight:600;">Banco</td><td style="padding:8px 14px;color:#1E293B;border-bottom:1px solid #E5E7EB;">Banco Santander</td></tr>
      <tr><td style="padding:8px 14px;color:#6B7280;border-bottom:1px solid #E5E7EB;font-weight:600;">Cuenta corriente</td><td style="padding:8px 14px;color:#1E293B;border-bottom:1px solid #E5E7EB;">0-000-7762290-0</td></tr>
      <tr><td style="padding:8px 14px;color:#6B7280;border-bottom:1px solid #E5E7EB;font-weight:600;">Rut</td><td style="padding:8px 14px;color:#1E293B;border-bottom:1px solid #E5E7EB;">77.125.595-7</td></tr>
      <tr><td style="padding:8px 14px;color:#6B7280;border-bottom:1px solid #E5E7EB;font-weight:600;">Razón Social</td><td style="padding:8px 14px;color:#1E293B;border-bottom:1px solid #E5E7EB;">Muller y Perez SPA</td></tr>
      <tr><td style="padding:8px 14px;color:#6B7280;font-weight:600;">Mail</td><td style="padding:8px 14px;color:#1E293B;">gestionclientes@mulleryperez.cl</td></tr>
    </table>
    <p style="margin:0 0 8px;color:#374151;font-size:15px;line-height:1.6;">Quedamos atentos ante cualquier consulta.</p>
    <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">Saludos cordiales,<br><strong>Equipo Muller y Pérez</strong></p>
  </div>
  <div style="padding:16px 36px;border-top:1px solid #E5E7EB;text-align:center;">
    <span style="font-size:12px;color:#9CA3AF;">Muller y Pérez · contacto@mulleryperez.cl · +56 9 5419 7432</span>
  </div>
</div>`;

async function send() {
  if (!RESEND_API_KEY && !DRY_RUN) {
    console.error('✗ RESEND_API_KEY no configurada');
    process.exit(1);
  }

  const pdfData = readPDF('2504.pdf');
  console.log('✓ PDF 2504.pdf leído');

  const payload = {
    from: FROM,
    to: ['gestionclientes@mulleryperez.cl'],
    subject: 'Factura Agosto 2026 — Tritec Energy — M&P',
    html,
    attachments: [
      { filename: '2504.pdf', content: pdfData },
    ],
  };

  if (DRY_RUN) {
    console.log('\n── DRY RUN ──');
    console.log('To:', payload.to.join(', '));
    console.log('Subject:', payload.subject);
    console.log('Attachments:', payload.attachments.map(a => a.filename).join(', '));
    console.log('HTML length:', payload.html.length);
    console.log('✓ Todo listo, correr sin --dry-run para enviar');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (res.ok) {
    console.log(`✓ Enviado a gestionclientes@ — ID: ${data.id}`);
  } else {
    console.error('✗ Error:', JSON.stringify(data));
  }
}

send().catch(console.error);
