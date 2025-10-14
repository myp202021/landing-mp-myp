/**
 * Test Meta Graph API - Exploración de datos disponibles
 * Ejecutar: node scripts/test-meta-api.js
 */

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || 'TU_TOKEN_AQUI';

async function testMetaAPI() {
  console.log('🔍 Iniciando prueba de Meta Graph API...\n');

  try {
    // 1. Test básico: Verificar token y permisos
    console.log('1️⃣ Verificando token y permisos...');
    const debugResponse = await fetch(
      `https://graph.facebook.com/v18.0/debug_token?input_token=${ACCESS_TOKEN}&access_token=${ACCESS_TOKEN}`
    );
    const debugData = await debugResponse.json();
    console.log('Permisos disponibles:', debugData.data?.scopes || []);
    console.log('');

    // 2. Test: Buscar cuentas públicas de marketing digital Chile
    console.log('2️⃣ Buscando cuentas públicas de marketing digital...');
    const searchResponse = await fetch(
      `https://graph.facebook.com/v18.0/search?type=page&q=agencia+marketing+digital+chile&access_token=${ACCESS_TOKEN}`
    );
    const searchData = await searchResponse.json();

    if (searchData.data) {
      console.log(`Encontradas ${searchData.data.length} páginas:`);
      searchData.data.slice(0, 5).forEach((page, i) => {
        console.log(`${i + 1}. ${page.name} (ID: ${page.id})`);
      });
    }
    console.log('');

    // 3. Test: Obtener datos de una página pública (ejemplo)
    if (searchData.data && searchData.data[0]) {
      const pageId = searchData.data[0].id;
      console.log(`3️⃣ Obteniendo datos detallados de: ${searchData.data[0].name}`);

      const pageResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=name,followers_count,fan_count,about,website,category,posts.limit(10){message,created_time,likes.summary(true),comments.summary(true),shares}&access_token=${ACCESS_TOKEN}`
      );
      const pageData = await pageResponse.json();

      console.log('Datos disponibles:');
      console.log(JSON.stringify(pageData, null, 2));
    }

    // 4. Test: Instagram Business Discovery (si está disponible)
    console.log('\n4️⃣ Probando Instagram Business Discovery...');
    // Nota: Requiere tener una cuenta de Instagram Business conectada

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Detalles:', await error.response.text());
    }
  }
}

// Ejecutar test
testMetaAPI();
