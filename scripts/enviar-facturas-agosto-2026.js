#!/usr/bin/env node
// Facturación Agosto 2026 — Muller y Pérez
// Usage: node facturacion-agosto-2026.js [--dry-run]

const fs = require('fs');
const path = require('path');
const os = require('os');

const DRY_RUN = process.argv.includes('--dry-run');
const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND;
const FROM = 'Muller y Pérez <gestionclientes@mulleryperez.cl>';
const CC = ['gestionclientes@mulleryperez.cl', 'christopher@mulleryperez.cl'];
const DOWNLOADS = path.join(os.homedir(), 'Downloads');
const PAUSE_MS = 2500;

// ── Client data ──────────────────────────────────────────────────────

const clientes = [
  {
    nombre: 'Buses Hualpén',
    emails: ['felipe.munoz@buseshualpen.cl', 'rgutierrez@buseshualpen.cl'],
    esHualpen: true,
    facturas: [
      { num: '2455', mes: 'Abril 2026', concepto: 'Servicios Marzo 2026', neto: 952000, iva: 180880, total: 1132880, vencida: true },
    ],
    cotizaciones: [
      'Cotizacion_Hualpen_Abr_2026.pdf',
      'Cotizacion_Hualpen_May_2026.pdf',
      'Cotizacion_Hualpen_Jun_2026.pdf',
      'Cotizacion_Hualpen_Jul_2026.pdf',
      'Cotizacion_Buses_Hualpen_Ago_2026.pdf',
    ],
    pendientes: [
      { mes: 'Mayo 2026', concepto: 'Servicios Abril 2026', total: 1132880, vencida: true },
      { mes: 'Junio 2026', concepto: 'Servicios Mayo 2026', total: 1132880, vencida: true },
      { mes: 'Julio 2026', concepto: 'Servicios Junio 2026', total: 1132880, vencida: true },
      { mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', total: 1132880, vencida: false },
    ],
    subject: 'Regularización servicios pendientes — Buses Hualpén — M&P',
  },
  {
    nombre: 'ALD Automotora',
    emails: ['mmontes@gandarillas.cl', 'arturo@mulleryperez.cl'],
    facturas: [
      { num: '2396', mes: 'Junio 2026', concepto: 'Servicios Mayo 2026', neto: 450000, iva: 85500, total: 535500, vencida: true },
      { num: '2440', mes: 'Julio 2026', concepto: 'Servicios Junio 2026', neto: 450000, iva: 85500, total: 535500, vencida: false },
    ],
  },
  {
    nombre: 'Reciclados',
    emails: ['j.gonzalez@recicla2chile.cl', 'arturo@mulleryperez.cl'],
    facturas: [
      { num: '2398', mes: 'Junio 2026', concepto: 'Servicios Mayo 2026', neto: 900000, iva: 171000, total: 1071000, vencida: true },
      { num: '2442', mes: 'Julio 2026', concepto: 'Servicios Junio 2026', neto: 900000, iva: 171000, total: 1071000, vencida: false },
    ],
  },
  {
    nombre: 'Dezar',
    emails: ['rodrigo@dezarrentacar.com', 'francisco.ortuzar@mail.udp.cl'],
    facturas: [
      { num: '2416', mes: 'Julio 2026', concepto: 'Viña Fee', neto: 147000, iva: 27930, total: 174930, vencida: false },
      { num: '2422', mes: 'Julio 2026', concepto: 'Viña Publicidad', neto: 187000, iva: 35530, total: 222530, vencida: false },
      { num: '2463', mes: 'Agosto 2026', concepto: 'Viña Fee', neto: 147000, iva: 27930, total: 174930, vencida: false },
      { num: '2465', mes: 'Agosto 2026', concepto: 'Santiago Fee', neto: 343000, iva: 65170, total: 408170, vencida: false },
      { num: '2467', mes: 'Agosto 2026', concepto: 'Viña Publicidad', neto: 187000, iva: 35530, total: 222530, vencida: false },
      { num: '2466', mes: 'Agosto 2026', concepto: 'Santiago Publicidad', neto: 293000, iva: 55670, total: 348670, vencida: false },
    ],
  },
  {
    nombre: 'Charriot',
    emails: ['proveedores@charriot.cl', 'mcastillo@charriot.cl'],
    facturas: [
      { num: '2418', mes: 'Julio 2026', concepto: 'Servicios Junio 2026', neto: 450000, iva: 85500, total: 535500, vencida: false },
      { num: '2468', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 450000, iva: 85500, total: 535500, vencida: false },
    ],
  },
  {
    nombre: 'HL Soluciones',
    emails: ['gonzalo.labra@hlsoluciones.cl', 'arturo@mulleryperez.cl'],
    facturas: [
      { num: '2439', mes: 'Julio 2026', concepto: 'Servicios Junio 2026', neto: 750000, iva: 142500, total: 892500, vencida: false },
    ],
  },
  {
    nombre: 'Atacama Experience',
    emails: ['logistic@atacamaexperience.cl'],
    facturas: [
      { num: '2441', mes: 'Julio 2026', concepto: 'Servicios Junio 2026', neto: 590000, iva: 112100, total: 702100, vencida: false },
      { num: '2490', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 590000, iva: 112100, total: 702100, vencida: false },
    ],
  },
  {
    nombre: 'Voxa',
    emails: ['david.silva@voxa.cl', 'alejandra.fusil@voxa.cl'],
    facturas: [
      { num: '2447', mes: 'Julio 2026', concepto: 'Servicios Junio 2026', neto: 700000, iva: 133000, total: 833000, vencida: false },
    ],
  },
  {
    nombre: 'Tecnoinver',
    emails: ['yenny.reyes@tecnoinver.cl', 'Karelys.camacho@tecnoinver.cl'],
    facturas: [
      { num: '2450', mes: 'Julio 2026', concepto: 'Servicios Junio 2026', neto: 1200000, iva: 228000, total: 1428000, vencida: false },
      { num: '2497', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 1200000, iva: 228000, total: 1428000, vencida: false },
    ],
  },
  {
    nombre: 'Irurzun',
    emails: ['tduenass@irurzun.cl', 'arturo@mulleryperez.cl'],
    facturas: [
      { num: '2456', mes: 'Julio 2026', concepto: 'Adicional', neto: 289000, iva: 54910, total: 343910, vencida: false },
      { num: '2495', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 950000, iva: 180500, total: 1130500, vencida: false },
    ],
  },
  {
    nombre: 'INACAP Educación Continua',
    emails: ['dquintanilla@inacap.cl'],
    esInacap: true,
    facturas: [
      { num: '2459', mes: 'Julio 2026', concepto: 'Campaña Talca — Servicios Junio 2026', neto: 1806723, iva: 343277, total: 2150000, vencida: false },
    ],
    subject: 'Factura pendiente + OC Curicó — INACAP Educación Continua — M&P',
  },
  {
    nombre: 'Swing',
    emails: ['teresa.rodriguez@swingmanagement.cl', 'carlos.lara@swingmanagement.cl'],
    facturas: [
      { num: '2461', mes: 'Agosto 2026', concepto: 'Fee Agosto', neto: 1550000, iva: 294500, total: 1844500, vencida: false },
      { num: '2462', mes: 'Agosto 2026', concepto: 'Pantallas', neto: 900000, iva: 171000, total: 1071000, vencida: false },
    ],
  },
  {
    nombre: 'Antartic',
    emails: ['mgutierrez@antartic.cl', 'jose@antartic.cl'],
    facturas: [
      { num: '2464', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 500000, iva: 95000, total: 595000, vencida: false },
    ],
  },
  {
    nombre: 'Sistemáticos',
    emails: ['andrea.c@sistematicos.cl'],
    facturas: [
      { num: '2469', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 577500, iva: 109725, total: 687225, vencida: false },
    ],
  },
  {
    nombre: 'Zero Water',
    emails: ['rodrigo.garfias@zerowater.cl', 'nicolas.ibarra@zerowater.cl'],
    facturas: [
      { num: '2470', mes: 'Agosto 2026', concepto: 'Fee Agosto', neto: 720000, iva: 136800, total: 856800, vencida: false },
    ],
  },
  {
    nombre: 'Granarolo',
    emails: ['elisa.gonzalez@granarolo.cl', 'macarena.dougnac@granarolo.cl'],
    facturas: [
      { num: '2471', mes: 'Agosto 2026', concepto: 'Fee Agosto', neto: 300000, iva: 57000, total: 357000, vencida: false },
      { num: '2472', mes: 'Agosto 2026', concepto: 'Publicidad', neto: 99896, iva: 18980, total: 118876, vencida: false },
    ],
  },
  {
    nombre: 'Elitsoft',
    emails: ['constanza.flores@elitsoft-chile.com', 'rodolfo.costa@elitsoft-chile.com'],
    facturas: [
      { num: '2473', mes: 'Agosto 2026', concepto: 'Fee Agosto', neto: 550000, iva: 104500, total: 654500, vencida: false },
    ],
  },
  {
    nombre: 'Invas',
    emails: ['ncrespo@impruvex.com', 'jvio@impruvex.com'],
    facturas: [
      { num: '2474', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 650000, iva: 123500, total: 773500, vencida: false },
    ],
  },
  {
    nombre: 'Firstpack',
    emails: ['jdeliz@inversol.cl', 'nhassi@inversol.cl'],
    facturas: [
      { num: '2475', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 550000, iva: 104500, total: 654500, vencida: false },
    ],
  },
  {
    nombre: 'VemosTuAuto',
    emails: ['ventas@vemostuauto.cl'],
    facturas: [
      { num: '2476', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 250000, iva: 47500, total: 297500, vencida: false },
    ],
  },
  {
    nombre: 'Sillas Pregiata',
    emails: ['jdeliz@inversol.cl', 'nhassi@inversol.cl'],
    facturas: [
      { num: '2477', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 400000, iva: 76000, total: 476000, vencida: false },
    ],
  },
  {
    nombre: 'Power Energy',
    emails: ['svillagra@grupopower.cl', 'leonardo.ormazabal@powerenergy.cl'],
    facturas: [
      { num: '2478', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 950000, iva: 180500, total: 1130500, vencida: false },
    ],
  },
  {
    nombre: 'Genera',
    emails: ['ncarrillo@genera.cl'],
    facturas: [
      { num: '2479', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 2000000, iva: 380000, total: 2380000, vencida: false },
    ],
  },
  {
    nombre: 'Empresas Tecnomat',
    emails: ['contabilidad@empresastecnomat.cl', 'cibar@empresastecnomat.cl'],
    facturas: [
      { num: '2480', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 475000, iva: 90250, total: 565250, vencida: false },
    ],
  },
  {
    nombre: 'Distec',
    emails: ['alex.matheu@distecchile.cl'],
    facturas: [
      { num: '2481', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 550000, iva: 104500, total: 654500, vencida: true },
    ],
  },
  {
    nombre: 'Rilay',
    emails: ['carolyn@rilay.cl'],
    facturas: [
      { num: '2488', mes: 'Agosto 2026', concepto: 'Fee Agosto', neto: 1000000, iva: 190000, total: 1190000, vencida: false },
      { num: '2489', mes: 'Agosto 2026', concepto: 'Publicidad', neto: 2590944, iva: 492279, total: 3083223, vencida: false },
    ],
  },
  {
    nombre: 'Fuxion Logistics',
    emails: ['Rodrigo.conejera@fuxionlogistics.cl', 'Nancy.avila@fuxionlogistics.cl'],
    facturas: [
      { num: '2482', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 450000, iva: 85500, total: 535500, vencida: false },
    ],
  },
  {
    nombre: 'Pineapple Store',
    emails: ['jjsepulveda@pineapplestore.cl'],
    facturas: [
      { num: '2483', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 325000, iva: 61750, total: 386750, vencida: true },
    ],
  },
  {
    nombre: 'One Waite',
    emails: ['r.cumsille@onewaite.com', 'n.lopez@onewaite.com'],
    facturas: [
      { num: '2484', mes: 'Agosto 2026', concepto: 'Inmob. Los Arrayanes', neto: 195000, iva: 37050, total: 232050, vencida: false },
      { num: '2485', mes: 'Agosto 2026', concepto: 'Sociedad Talleres', neto: 195000, iva: 37050, total: 232050, vencida: false },
      { num: '2486', mes: 'Agosto 2026', concepto: 'Inmob. Aite', neto: 195000, iva: 37050, total: 232050, vencida: false },
      { num: '2487', mes: 'Agosto 2026', concepto: 'One Waite 4', neto: 195000, iva: 37050, total: 232050, vencida: false },
    ],
  },
  {
    nombre: '4Life',
    emails: ['fperez@4lifehipotecario.cl', 'paraya@4lifehipotecario.cl'],
    facturas: [
      { num: '2491', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 750000, iva: 142500, total: 892500, vencida: true },
    ],
  },
  {
    nombre: 'CyM Propiedades',
    emails: ['rsoto@cympropiedades.cl', 'acy@cympropiedades.cl', 'jmarshall@cympropiedades.cl'],
    facturas: [
      { num: '2492', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 1900000, iva: 361000, total: 2261000, vencida: false },
    ],
  },
  {
    nombre: 'Devuelve Mi Pie',
    emails: ['rcibie@devuelvemipie.cl'],
    facturas: [
      { num: '2493', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 800000, iva: 152000, total: 952000, vencida: false },
    ],
  },
  {
    nombre: 'Halterlift',
    emails: ['jorge.sepulveda@halter.cl'],
    facturas: [
      { num: '2494', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 900000, iva: 171000, total: 1071000, vencida: false },
    ],
  },
  {
    nombre: 'Cioccolati',
    emails: ['MATIASLOVISA@gmail.com', 'ALFREDO.BRA@gmail.com'],
    facturas: [
      { num: '2496', mes: 'Agosto 2026', concepto: 'Servicios Julio 2026', neto: 950000, iva: 180500, total: 1130500, vencida: false },
    ],
  },
  {
    nombre: 'Codify',
    emails: ['nicolas.abud@codifyanalytics.com', 'arturo@mulleryperez.cl'],
    facturas: [
      { num: '2498', mes: 'Agosto 2026', concepto: 'Proporcional Julio', neto: 290323, iva: 55161, total: 345484, vencida: false },
      { num: '2499', mes: 'Agosto 2026', concepto: 'Fee Agosto', neto: 900000, iva: 171000, total: 1071000, vencida: false },
      { num: '2500', mes: 'Agosto 2026', concepto: 'Active Campaign', neto: 90885, iva: 17268, total: 108153, vencida: false },
    ],
  },
  {
    nombre: 'LabLab',
    emails: ['david.faille@lablab.cl', 'arturo@mulleryperez.cl'],
    facturas: [
      { num: '2501', mes: 'Agosto 2026', concepto: 'Proporcional Julio', neto: 1064516, iva: 202258, total: 1266774, vencida: false },
      { num: '2502', mes: 'Agosto 2026', concepto: 'Agosto', neto: 1500000, iva: 285000, total: 1785000, vencida: false },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────

function fmt(n) {
  return '$' + n.toLocaleString('es-CL');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function readPDF(filename) {
  const p = path.join(DOWNLOADS, filename);
  if (!fs.existsSync(p)) {
    console.warn(`  ⚠ PDF no encontrado: ${p}`);
    return null;
  }
  return fs.readFileSync(p).toString('base64');
}

// ── HTML builder ─────────────────────────────────────────────────────

function buildHTML(cliente) {
  const tieneVencidas = cliente.facturas.some((f) => f.vencida) ||
    (cliente.pendientes && cliente.pendientes.some((p) => p.vencida));
  const esHualpen = !!cliente.esHualpen;

  // Intro paragraph
  let intro;
  if (esHualpen) {
    intro = `
      <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
        Junto con saludar, nos comunicamos para regularizar el estado de los servicios prestados desde marzo 2026 a la fecha.
      </p>
      <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
        Actualmente existe <strong>una factura emitida (N° 2455, abril 2026)</strong> y <strong>cuatro meses pendientes de facturación</strong> (mayo, junio, julio y agosto 2026) que requieren Orden de Compra para proceder con la emisión de las facturas correspondientes.
      </p>
      <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
        Adjuntamos la factura emitida junto con las cotizaciones de cada mes pendiente para facilitar la gestión interna. <strong>Solicitamos coordinar el envío de las OC a la brevedad</strong> para regularizar los meses vencidos y mantener al día la relación comercial.
      </p>`;
  } else if (cliente.esInacap) {
    intro = `
      <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
        Junto con saludar, adjuntamos la factura N° 2459 correspondiente a la campaña de <strong>Talca</strong> (servicios de junio 2026, $2.150.000). Solicitamos confirmar la <strong>fecha de pago</strong> de esta factura.
      </p>
      <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
        Adicionalmente, necesitamos la <strong>Orden de Compra para la campaña de Curicó</strong> por el mismo monto ($2.150.000) para proceder con la emisión de la factura correspondiente. Solicitamos coordinar el envío de la OC a la brevedad.
      </p>`;
  } else if (tieneVencidas) {
    intro = `
      <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
        Adjuntamos la(s) factura(s) pendientes. <strong>Solicitamos regularizar a la brevedad las facturas vencidas correspondientes a meses anteriores.</strong>
      </p>`;
  } else {
    intro = `
      <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
        Adjuntamos la(s) factura(s) correspondientes al mes de agosto 2026. El plazo de pago es el <strong>31 de agosto de 2026</strong>.
      </p>`;
  }

  // Build table rows for facturas
  let rows = '';
  let grandTotal = 0;

  for (const f of cliente.facturas) {
    const style = f.vencida
      ? 'color:#DC2626;font-weight:600;'
      : 'color:#374151;';
    const tag = f.vencida
      ? ' <span style="background:#FEE2E2;color:#DC2626;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">⚠️ Vencida</span>'
      : '';
    rows += `
      <tr style="border-bottom:1px solid #E5E7EB;">
        <td style="padding:10px 12px;${style}">${f.num}</td>
        <td style="padding:10px 12px;${style}">${f.mes}${tag}</td>
        <td style="padding:10px 12px;${style}">${f.concepto}</td>
        <td style="padding:10px 12px;text-align:right;${style}">${fmt(f.neto)}</td>
        <td style="padding:10px 12px;text-align:right;${style}">${fmt(f.iva)}</td>
        <td style="padding:10px 12px;text-align:right;${style}font-weight:700;">${fmt(f.total)}</td>
      </tr>`;
    grandTotal += f.total;
  }

  // Hualpén pendientes rows
  if (esHualpen && cliente.pendientes) {
    for (const p of cliente.pendientes) {
      const style = p.vencida
        ? 'color:#DC2626;font-weight:600;'
        : 'color:#374151;';
      const tag = p.vencida
        ? ' <span style="background:#FEE2E2;color:#DC2626;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">⚠️ Vencida</span>'
        : '';
      rows += `
      <tr style="border-bottom:1px solid #E5E7EB;">
        <td style="padding:10px 12px;${style}font-style:italic;">Pend.</td>
        <td style="padding:10px 12px;${style}">${p.mes}${tag}</td>
        <td style="padding:10px 12px;${style}">${p.concepto} (pendiente OC)</td>
        <td style="padding:10px 12px;text-align:right;${style}">—</td>
        <td style="padding:10px 12px;text-align:right;${style}">—</td>
        <td style="padding:10px 12px;text-align:right;${style}font-weight:700;">${fmt(p.total)}</td>
      </tr>`;
      grandTotal += p.total;
    }
  }

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:680px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;margin-top:24px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:32px 40px;">
      <h1 style="margin:0;color:#FFFFFF;font-size:22px;font-weight:700;">Facturación — ${cliente.nombre}</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Muller y Pérez · Agosto 2026</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
        Estimados,
      </p>
      ${intro}

      <!-- Table -->
      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:13px;">
        <thead>
          <tr style="background:#F9FAFB;">
            <th style="padding:10px 12px;text-align:left;color:#6B7280;font-weight:600;border-bottom:2px solid #E5E7EB;">N° Factura</th>
            <th style="padding:10px 12px;text-align:left;color:#6B7280;font-weight:600;border-bottom:2px solid #E5E7EB;">Período</th>
            <th style="padding:10px 12px;text-align:left;color:#6B7280;font-weight:600;border-bottom:2px solid #E5E7EB;">Concepto</th>
            <th style="padding:10px 12px;text-align:right;color:#6B7280;font-weight:600;border-bottom:2px solid #E5E7EB;">Neto</th>
            <th style="padding:10px 12px;text-align:right;color:#6B7280;font-weight:600;border-bottom:2px solid #E5E7EB;">IVA</th>
            <th style="padding:10px 12px;text-align:right;color:#6B7280;font-weight:600;border-bottom:2px solid #E5E7EB;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background:#F9FAFB;">
            <td colspan="5" style="padding:12px;text-align:right;font-weight:700;color:#1F2937;font-size:14px;">TOTAL</td>
            <td style="padding:12px;text-align:right;font-weight:700;color:#4F46E5;font-size:14px;">${fmt(grandTotal)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Bank details -->
      <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px 24px;margin:24px 0;">
        <h3 style="margin:0 0 12px;color:#1F2937;font-size:14px;font-weight:700;">Datos de transferencia</h3>
        <table style="font-size:13px;color:#374151;line-height:1.8;">
          <tr><td style="padding-right:16px;color:#6B7280;">Banco:</td><td><strong>Banco Santander</strong></td></tr>
          <tr><td style="padding-right:16px;color:#6B7280;">Cuenta corriente:</td><td><strong>0-000-7762290-0</strong></td></tr>
          <tr><td style="padding-right:16px;color:#6B7280;">Rut:</td><td><strong>77.125.595-7</strong></td></tr>
          <tr><td style="padding-right:16px;color:#6B7280;">Razón Social:</td><td><strong>Muller y Perez SPA</strong></td></tr>
          <tr><td style="padding-right:16px;color:#6B7280;">Mail:</td><td><strong>gestionclientes@mulleryperez.cl</strong></td></tr>
        </table>
      </div>

      <p style="margin:24px 0 0;color:#6B7280;font-size:13px;line-height:1.5;">
        Quedamos atentos ante cualquier consulta.
      </p>
      <p style="margin:8px 0 0;color:#374151;font-size:13px;font-weight:600;">
        Saludos cordiales,<br>Equipo Muller y Pérez
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#F9FAFB;padding:20px 40px;border-top:1px solid #E5E7EB;text-align:center;">
      <p style="margin:0;color:#9CA3AF;font-size:12px;">
        Muller y Pérez · contacto@mulleryperez.cl · +56 9 5419 7432
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ── Build attachments ────────────────────────────────────────────────

function buildAttachments(cliente) {
  const attachments = [];

  for (const f of cliente.facturas) {
    const content = readPDF(`${f.num}.pdf`);
    if (content) {
      attachments.push({ filename: `${f.num}.pdf`, content });
    }
  }

  // Hualpén cotizaciones
  if (cliente.esHualpen && cliente.cotizaciones) {
    for (const c of cliente.cotizaciones) {
      const content = readPDF(c);
      if (content) {
        attachments.push({ filename: c, content });
      }
    }
  }

  // Codify: adjuntar invoice Active Campaign
  if (cliente.nombre === 'Codify') {
    const acContent = readPDF('ac_invoice_2026_07_29.pdf');
    if (acContent) {
      attachments.push({ filename: 'ActiveCampaign_Invoice_Jul2026.pdf', content: acContent });
    }
  }

  return attachments;
}

// ── Send email via Resend ────────────────────────────────────────────

async function sendEmail(cliente, html, attachments) {
  const subject = cliente.subject || `Facturas pendientes — ${cliente.nombre} — M&P`;

  const body = {
    from: FROM,
    to: cliente.emails,
    cc: CC,
    subject,
    html,
    attachments,
  };

  if (DRY_RUN) {
    console.log(`  [DRY-RUN] TO: ${cliente.emails.join(', ')}`);
    console.log(`  [DRY-RUN] Subject: ${subject}`);
    console.log(`  [DRY-RUN] Attachments: ${attachments.map((a) => a.filename).join(', ')}`);
    return { id: 'dry-run', status: 'OK (dry-run)' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${JSON.stringify(data)}`);
  }

  return data;
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(60));
  console.log(`  FACTURACIÓN AGOSTO 2026 — MULLER Y PÉREZ`);
  console.log(`  ${DRY_RUN ? '🧪 MODO DRY-RUN (no se envían emails)' : '🚀 MODO PRODUCCIÓN'}`);
  console.log(`  Clientes: ${clientes.length}`);
  console.log('='.repeat(60));
  console.log('');

  let sent = 0;
  let failed = 0;
  let totalAmount = 0;

  for (let i = 0; i < clientes.length; i++) {
    const c = clientes[i];
    const clientTotal = c.facturas.reduce((s, f) => s + f.total, 0) +
      (c.pendientes ? c.pendientes.reduce((s, p) => s + p.total, 0) : 0);
    const nFacturas = c.facturas.length + (c.pendientes ? c.pendientes.length : 0);
    const tieneVencidas = c.facturas.some((f) => f.vencida) ||
      (c.pendientes && c.pendientes.some((p) => p.vencida));

    console.log(`[${i + 1}/${clientes.length}] ${c.nombre}`);
    console.log(`  Facturas: ${nFacturas} | Total: ${fmt(clientTotal)}${tieneVencidas ? ' | ⚠️ VENCIDAS' : ''}`);

    try {
      const html = buildHTML(c);
      const attachments = buildAttachments(c);
      const result = await sendEmail(c, html, attachments);

      console.log(`  ✅ Enviado — ID: ${result.id || 'OK'}`);
      sent++;
      totalAmount += clientTotal;
    } catch (err) {
      console.error(`  ❌ ERROR: ${err.message}`);
      failed++;
    }

    // Pause between sends (except last)
    if (i < clientes.length - 1) {
      if (!DRY_RUN) {
        await sleep(PAUSE_MS);
      }
    }

    console.log('');
  }

  // Summary
  console.log('='.repeat(60));
  console.log('  RESUMEN');
  console.log('='.repeat(60));
  console.log(`  Emails enviados: ${sent}`);
  if (failed > 0) console.log(`  Emails fallidos: ${failed}`);
  console.log(`  Monto total facturado: ${fmt(totalAmount)}`);
  console.log(`  Modo: ${DRY_RUN ? 'DRY-RUN' : 'PRODUCCIÓN'}`);
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
