const fetch = require('node-fetch');
const fs = require('fs');

async function main() {
  const filePath = 'temp-licitacion/Consultas_Licitacion_IEST_MYP.xlsx';
  const content = fs.readFileSync(filePath).toString('base64');
  console.log('Adjunto:', Math.round(fs.statSync(filePath).size/1024) + 'KB');

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;color:#222">
<p>Christopher,</p>
<p>Adjunto el Excel con las <strong>18 consultas</strong> para la licitacion IEST (Santo Tomas), listo para reenviar a <strong>gcampos9@santotomas.cl</strong>.</p>
<p>Revisalo, ajusta lo que quieras, y reenvialo antes del <strong>3 de septiembre</strong>.</p>
<ul>
<li>7 consultas administrativas (azul)</li>
<li>11 consultas tecnicas (verde)</li>
</ul>
<p>El Excel ya tiene los datos del oferente al final (Muller y Perez SpA, christopher@mulleryperez.cl, fecha 3 sept 2026).</p>
<p style="color:#888;font-size:12px;margin-top:20px">M&P — Licitacion IEST</p>
</div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + process.env.RESEND, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'M&P Licitaciones <contacto@mulleryperez.cl>',
      to: 'christopher@mulleryperez.cl',
      subject: 'Consultas Licitacion IEST — Excel para reenviar a Santo Tomas',
      html,
      attachments: [{ filename: 'Consultas_Licitacion_IEST_MYP.xlsx', content }]
    })
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Email ID:', data.id || JSON.stringify(data));
}
main().catch(e => { console.error(e); process.exit(1); });
