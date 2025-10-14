/**
 * Test Meta Graph API - Análisis de páginas de Facebook públicas
 */

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

async function testFacebookPages() {
  console.log('🔍 Explorando páginas de Facebook públicas...\n');

  try {
    // 1. Obtener tus páginas de Facebook
    console.log('1️⃣ Obteniendo tus páginas de Facebook...');
    const myPagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,followers_count,fan_count,category,website,about&access_token=${ACCESS_TOKEN}`
    );
    const myPagesData = await myPagesResponse.json();

    if (myPagesData.data && myPagesData.data.length > 0) {
      console.log(`✅ Encontradas ${myPagesData.data.length} páginas tuyas:\n`);
      myPagesData.data.forEach(page => {
        console.log(`📄 ${page.name}`);
        console.log(`   ID: ${page.id}`);
        console.log(`   Seguidores: ${page.followers_count || 'N/A'}`);
        console.log(`   Fans: ${page.fan_count || 'N/A'}`);
        console.log(`   Categoría: ${page.category || 'N/A'}`);
        console.log(`   Website: ${page.website || 'N/A'}`);
        console.log('');
      });

      // Obtener posts de tu primera página
      const firstPage = myPagesData.data[0];
      console.log(`\n2️⃣ Obteniendo posts de "${firstPage.name}"...`);
      const postsResponse = await fetch(
        `https://graph.facebook.com/v18.0/${firstPage.id}/posts?fields=id,message,created_time,likes.summary(true),comments.summary(true),shares&limit=10&access_token=${ACCESS_TOKEN}`
      );
      const postsData = await postsResponse.json();

      if (postsData.data && postsData.data.length > 0) {
        console.log(`\n📊 Últimos ${postsData.data.length} posts:\n`);
        postsData.data.forEach((post, i) => {
          const likes = post.likes?.summary?.total_count || 0;
          const comments = post.comments?.summary?.total_count || 0;
          const shares = post.shares?.count || 0;
          const engagement = likes + comments + shares;

          console.log(`Post ${i + 1}:`);
          console.log(`  📅 ${new Date(post.created_time).toLocaleDateString('es-CL')}`);
          console.log(`  📝 ${(post.message || 'Sin mensaje').substring(0, 80)}...`);
          console.log(`  ❤️  Likes: ${likes}`);
          console.log(`  💬 Comentarios: ${comments}`);
          console.log(`  🔄 Shares: ${shares}`);
          console.log(`  📊 Engagement total: ${engagement}`);
          console.log('');
        });
      } else {
        console.log('⚠️ No se encontraron posts públicos');
      }
    } else {
      console.log('⚠️ No tienes páginas de Facebook administradas con esta cuenta');
      console.log('Respuesta:', JSON.stringify(myPagesData, null, 2));
    }

    // 3. Buscar páginas públicas de competidores
    console.log('\n3️⃣ Buscando páginas de competidores (agencias marketing Chile)...');

    // Lista de agencias conocidas para analizar
    const competidores = [
      'Zéfiro Digital',
      'Acid Labs',
      'Adity',
      'Genosha',
      'La Maison'
    ];

    for (const competidor of competidores) {
      console.log(`\n🔍 Buscando: ${competidor}...`);
      const searchResponse = await fetch(
        `https://graph.facebook.com/v18.0/search?type=page&q=${encodeURIComponent(competidor)}&fields=id,name,followers_count,fan_count,category,website&limit=3&access_token=${ACCESS_TOKEN}`
      );
      const searchData = await searchResponse.json();

      if (searchData.data && searchData.data.length > 0) {
        searchData.data.forEach(page => {
          console.log(`  ✅ ${page.name}`);
          console.log(`     ID: ${page.id}`);
          console.log(`     Fans: ${page.fan_count || 'N/A'}`);
          console.log(`     Categoría: ${page.category || 'N/A'}`);
        });
      } else {
        console.log(`  ❌ No encontrada o sin acceso público`);
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testFacebookPages();
