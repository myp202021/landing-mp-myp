const fetch = require('node-fetch');
const fs = require('fs');

async function main() {
  const attachments = [
    { path: process.env.HOME + '/licitacion-santo-tomas/papeles-empresa/representante-legal/eRUT_MullerYPerez_SPA_77125595-7.jpeg', name: 'eRUT_MullerYPerez_SPA_77125595-7.jpeg' },
    { path: process.env.HOME + '/licitacion-santo-tomas/papeles-empresa/agencia/Reducción.pdf', name: 'Reduccion_Escritura_Constitucion.pdf' },
    { path: process.env.HOME + '/licitacion-santo-tomas/papeles-empresa/agencia/CERTIFICADO DE INSCRIPCION DEL EXTRACTO.pdf', name: 'Certificado_Inscripcion_Extracto.pdf' },
    { path: process.env.HOME + '/licitacion-santo-tomas/papeles-empresa/representante-legal/CI_Christopher_Muller_Frente.jpeg', name: 'CI_Christopher_Muller_Frente.jpeg' },
    { path: process.env.HOME + '/licitacion-santo-tomas/papeles-empresa/representante-legal/CI_Christopher_Muller_Reverso.jpeg', name: 'CI_Christopher_Muller_Reverso.jpeg' },
  ].map(f => {
    const content = fs.readFileSync(f.path).toString('base64');
    console.log('Adjunto:', f.name, Math.round(fs.statSync(f.path).size/1024) + 'KB');
    return { filename: f.name, content };
  });

  const html = `<div style="font-family:Arial,sans-serif;max-width:650px;color:#222">
<p>Christopher,</p>
<p>Adjunto los documentos para completar la inscripcion en el Boletin Comercial (Cliente N°35094).</p>

<h3 style="color:#1F4E79;margin-top:20px;">Email para enviar a inscripcion-bic@ccs.cl</h3>
<p><strong>Asunto:</strong> Cliente N°35094</p>

<div style="background:#f5f5f5;border-left:4px solid #1F4E79;padding:16px;margin:12px 0;font-size:14px;">
<p>Estimados,</p>
<p>Adjunto la documentacion solicitada para completar la inscripcion de la empresa MULLERYPEREZ SPA, Cliente N°35094.</p>
<p><strong>Empresa:</strong><br>
Razon social: MULLER Y PEREZ SPA<br>
RUT: 77.125.595-7<br>
Giro: Asesorias en Marketing y Publicidad<br>
Direccion: Badajoz 100 Oficina 523, Las Condes</p>
<p><strong>Representante legal:</strong><br>
Christopher Edmundo Enrique Muller Muller<br>
RUT: 15.780.635-1</p>
<p><strong>Documentos adjuntos:</strong></p>
<ol>
<li>eRUT de MULLER Y PEREZ SPA (RUT 77.125.595-7) emitido por el SII</li>
<li>Reduccion de escritura de constitucion (acredita representante legal)</li>
<li>Certificado de inscripcion del extracto</li>
<li>Cedula de identidad del representante legal por ambos lados (con frase manuscrita y firma)</li>
</ol>
<p>Quedo atento a la confirmacion.</p>
<p>Saludos cordiales,</p>
<p>Christopher Muller<br>
MULLER Y PEREZ SPA<br>
christopher@mulleryperez.cl</p>
</div>

<h3 style="color:#c00;margin-top:20px;">IMPORTANTE</h3>
<ul style="font-size:14px;">
<li>En cada copia del carnet debes escribir A MANO: <em>"Solo para ser utilizada por la Camara de Comercio de Santiago A.G."</em> + tu firma igual a la del carnet</li>
<li><strong style="color:#c00;">Tu carnet vencio el 01 de septiembre.</strong> Renovar la proxima semana. El Boletin puede rechazarlo.</li>
</ul>

<h3 style="color:#1F4E79;margin-top:20px;">Adjuntos en este email</h3>
<ol style="font-size:14px;">
<li>eRUT_MullerYPerez_SPA_77125595-7.jpeg</li>
<li>Reduccion_Escritura_Constitucion.pdf (3.5MB)</li>
<li>Certificado_Inscripcion_Extracto.pdf</li>
<li>CI_Christopher_Muller_Frente.jpeg</li>
<li>CI_Christopher_Muller_Reverso.jpeg</li>
</ol>

<p style="color:#888;font-size:12px;margin-top:20px;">M&P — Boletin Comercial Cliente N°35094</p>
</div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + process.env.RESEND, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'M&P <contacto@mulleryperez.cl>',
      to: 'christopher@mulleryperez.cl',
      subject: 'Boletín Comercial Cliente N°35094 — Docs para enviar a inscripcion-bic@ccs.cl',
      html,
      attachments
    })
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Email ID:', data.id || JSON.stringify(data));
}
main().catch(e => { console.error(e); process.exit(1); });
