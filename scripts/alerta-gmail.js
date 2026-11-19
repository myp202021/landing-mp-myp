// alerta-gmail.js — alerta interna por Gmail desde christopher@ (nunca Resend).
// Uso: ASUNTO="..." HTML="<p>...</p>" [PARA=x@y] node scripts/alerta-gmail.js
// Credenciales: secretos GMAIL_USER / GMAIL_APP_PASSWORD.
const nodemailer = require('nodemailer')
const t = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } })
t.sendMail({
  from: '"Christopher Müller" <' + process.env.GMAIL_USER + '>',
  to: process.env.PARA || 'christopher@mulleryperez.cl',
  subject: process.env.ASUNTO || 'Alerta M&P',
  html: process.env.HTML || '<p>(sin detalle)</p>',
}).then(() => console.log('Alerta enviada por Gmail')).catch((e) => { console.error('Alerta Gmail falló: ' + e.message); process.exit(1) })
