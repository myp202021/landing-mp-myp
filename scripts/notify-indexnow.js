#!/usr/bin/env node

/**
 * IndexNow Notification Script
 * Notifica a Google, Bing y Yandex sobre nuevas URLs o actualizaciones
 * https://www.indexnow.org/
 */

const https = require('https');
const crypto = require('crypto');

const SITE_URL = 'https://www.mulleryperez.cl';

// URLs a notificar (sitio + blogs actuales)
const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/mp-predictor`,
  `${SITE_URL}/labs`,
  `${SITE_URL}/labs/reporte-competencia`,
  `${SITE_URL}/blog/que-es-cac-como-calcularlo-reducirlo`,
  `${SITE_URL}/blog/mejores-practicas-google-ads-2025`,
  `${SITE_URL}/blog/estrategias-meta-ads-performance`,
  `${SITE_URL}/blog/como-reducir-cpl-campanas-b2b`,
  `${SITE_URL}/blog/roi-vs-roas-diferencias-cuando-usar`,
  `${SITE_URL}/blog/errores-comunes-facebook-ads`,
  `${SITE_URL}/blog/optimizacion-landing-pages-conversion`,
  `${SITE_URL}/blog/google-analytics-4-metricas-clave`,
  `${SITE_URL}/blog/tendencias-marketing-digital-chile-2025`,
  `${SITE_URL}/blog/linkedin-ads-b2b-chile`,
  `${SITE_URL}/blog/retargeting-strategies-2025`,
  `${SITE_URL}/blog/presupuesto-google-ads-calcularlo`,
];

// IndexNow endpoints (rotamos entre Google, Bing, Yandex)
const endpoints = [
  'www.bing.com', // Bing es el más confiable para IndexNow
  'api.indexnow.org', // Endpoint oficial que distribuye a múltiples buscadores
];

/**
 * Genera una API key única basada en el dominio
 * En producción, guarda este valor en un archivo en /public/{key}.txt
 */
function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

// API Key fija para este sitio (debe existir en /public/{key}.txt)
const API_KEY = 'e7f9a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0';

/**
 * Notifica una URL a través de IndexNow
 */
function notifyUrl(endpoint, url) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: 'www.mulleryperez.cl',
      key: API_KEY,
      keyLocation: `${SITE_URL}/${API_KEY}.txt`,
      urlList: [url]
    });

    const options = {
      hostname: endpoint,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          resolve({ success: true, status: res.statusCode, url });
        } else {
          resolve({ success: false, status: res.statusCode, url, error: data });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, url, error: error.message });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Notifica todas las URLs en batch
 */
async function notifyBatch(endpoint, urls) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: 'www.mulleryperez.cl',
      key: API_KEY,
      keyLocation: `${SITE_URL}/${API_KEY}.txt`,
      urlList: urls
    });

    const options = {
      hostname: endpoint,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          resolve({ success: true, status: res.statusCode, count: urls.length });
        } else {
          resolve({ success: false, status: res.statusCode, error: data });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 IndexNow: Notificando buscadores...\n');
  console.log(`📊 Total URLs: ${urls.length}`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 16)}...`);
  console.log(`🌐 Sitio: ${SITE_URL}\n`);

  const results = [];

  // Enviar a cada endpoint en batch
  for (const endpoint of endpoints) {
    try {
      console.log(`📤 Enviando a ${endpoint}...`);
      const result = await notifyBatch(endpoint, urls);

      if (result.success) {
        console.log(`✅ ${endpoint}: ${result.count} URLs notificadas (HTTP ${result.status})`);
        results.push({ endpoint, success: true });
      } else {
        console.log(`❌ ${endpoint}: Error ${result.status}`);
        console.log(`   ${result.error}`);
        results.push({ endpoint, success: false });
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.error || error.message}`);
      results.push({ endpoint, success: false });
    }
  }

  console.log('\n📈 Resumen:');
  const successful = results.filter(r => r.success).length;
  console.log(`   ✅ Exitosos: ${successful}/${endpoints.length}`);
  console.log(`   ❌ Fallidos: ${endpoints.length - successful}/${endpoints.length}`);

  if (successful > 0) {
    console.log('\n✨ Notificación enviada. Los buscadores procesarán las URLs en las próximas horas.');
    console.log('⏱️  Tiempo estimado de indexación: 24-72 horas');
  } else {
    console.log('\n⚠️  No se pudo notificar a ningún buscador. Verifica la API key y conectividad.');
  }

  console.log('\n📝 IMPORTANTE:');
  console.log(`   Crea el archivo: /public/${API_KEY}.txt`);
  console.log(`   Contenido: ${API_KEY}`);
  console.log('   Este archivo verifica tu propiedad del dominio.');
}

// Ejecutar
main().catch(console.error);
