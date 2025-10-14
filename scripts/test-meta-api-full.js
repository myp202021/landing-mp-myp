/**
 * Test Meta Graph API - Exploración completa con permisos avanzados
 */

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

async function testMetaAPIFull() {
  console.log('🔍 Iniciando exploración completa de Meta Graph API...\n');

  try {
    // 1. Obtener información de tu cuenta
    console.log('1️⃣ Obteniendo información de tu cuenta...');
    const meResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,accounts{id,name,followers_count,instagram_business_account{id,username,followers_count,media_count}}&access_token=${ACCESS_TOKEN}`
    );
    const meData = await meResponse.json();
    console.log('Tu cuenta:', JSON.stringify(meData, null, 2));
    console.log('');

    // Guardar IDs para siguientes pruebas
    let igBusinessAccountId = null;
    if (meData.accounts && meData.accounts.data.length > 0) {
      const firstAccount = meData.accounts.data[0];
      if (firstAccount.instagram_business_account) {
        igBusinessAccountId = firstAccount.instagram_business_account.id;
        console.log(`✅ Instagram Business Account encontrada: ${firstAccount.instagram_business_account.username}`);
      }
    }
    console.log('');

    // 2. Si tienes cuenta de Instagram Business, obtener insights
    if (igBusinessAccountId) {
      console.log('2️⃣ Obteniendo insights de Instagram...');
      const insightsResponse = await fetch(
        `https://graph.facebook.com/v18.0/${igBusinessAccountId}?fields=username,followers_count,follows_count,media_count,media.limit(10){id,caption,like_count,comments_count,timestamp,media_type,media_url,permalink}&access_token=${ACCESS_TOKEN}`
      );
      const insightsData = await insightsResponse.json();
      console.log('Insights:', JSON.stringify(insightsData, null, 2));
      console.log('');

      // 3. Obtener métricas de los últimos posts
      if (insightsData.media && insightsData.media.data.length > 0) {
        console.log('3️⃣ Análisis de engagement de últimos posts:');
        insightsData.media.data.forEach((post, i) => {
          const engagement = post.like_count + post.comments_count;
          console.log(`\nPost ${i + 1}:`);
          console.log(`  📅 Fecha: ${new Date(post.timestamp).toLocaleDateString('es-CL')}`);
          console.log(`  📝 Caption: ${(post.caption || '').substring(0, 60)}...`);
          console.log(`  ❤️  Likes: ${post.like_count}`);
          console.log(`  💬 Comentarios: ${post.comments_count}`);
          console.log(`  📊 Engagement total: ${engagement}`);
          console.log(`  🔗 URL: ${post.permalink}`);
        });
      }
    }

    // 4. Probar búsqueda de Instagram hashtag (si está disponible)
    console.log('\n4️⃣ Probando búsqueda de hashtags trending...');
    const hashtagResponse = await fetch(
      `https://graph.facebook.com/v18.0/ig_hashtag_search?user_id=${igBusinessAccountId}&q=marketingdigital&access_token=${ACCESS_TOKEN}`
    );
    const hashtagData = await hashtagResponse.json();
    if (hashtagData.data) {
      console.log('Hashtags encontrados:', JSON.stringify(hashtagData, null, 2));
    } else {
      console.log('⚠️ Búsqueda de hashtags requiere permisos adicionales o no está disponible');
      console.log('Respuesta:', JSON.stringify(hashtagData, null, 2));
    }
    console.log('');

    // 5. Probar Instagram Business Discovery (ver cuentas públicas)
    console.log('5️⃣ Probando Instagram Business Discovery...');
    // Nota: Requiere username de cuenta pública a analizar
    const testUsername = 'natgeo'; // Cuenta pública de ejemplo
    const discoveryResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igBusinessAccountId}?fields=business_discovery.username(${testUsername}){username,followers_count,media_count,media.limit(5){like_count,comments_count,caption,timestamp}}&access_token=${ACCESS_TOKEN}`
    );
    const discoveryData = await discoveryResponse.json();
    console.log('Discovery test (NatGeo):', JSON.stringify(discoveryData, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar test completo
testMetaAPIFull();
