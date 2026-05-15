// radar-mock-data.js - Mock data for testing pipeline without Apify
module.exports = {
  getMockPosts: function(handles) {
    var posts = [];
    var now = Date.now();
    var types = ['Image', 'Video', 'Sidecar'];
    var captions = [
      'Nuevo servicio disponible para nuestros clientes. Contáctanos para más información 🚀 #marketing #digital',
      'Resultados que hablan por sí solos. +40% de conversiones en el primer mes 📈 #performance',
      'Nuestro equipo trabajando en la estrategia Q2 2026. Grandes cosas vienen 💪 #agencia #equipo',
      'Tips para mejorar tu presencia digital: 1. Consistencia 2. Datos 3. Creatividad #tips #socialmedia',
      'Case study: cómo triplicamos el ROAS de nuestro cliente en 90 días #casodeexito #roi',
      'El futuro del marketing es la personalización. ¿Tu marca está lista? #tendencias #ia',
      'Felices de anunciar nuestra nueva alianza estratégica 🤝 #partnership #growth',
      'Workshop interno sobre Google Ads Performance Max. Nunca paramos de aprender 📚 #capacitacion',
    ];

    handles.forEach(function(handle) {
      for (var i = 0; i < 5; i++) {
        var daysAgo = Math.floor(Math.random() * 5) + 1; // 1-5 days ago
        posts.push({
          ownerUsername: handle,
          timestamp: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
          caption: captions[Math.floor(Math.random() * captions.length)] + ' @' + handle,
          likesCount: Math.floor(Math.random() * 500) + 50,
          commentsCount: Math.floor(Math.random() * 30) + 5,
          type: types[Math.floor(Math.random() * types.length)],
          shortCode: 'MOCK' + handle.substring(0,4) + i,
          url: 'https://www.instagram.com/p/MOCK' + handle.substring(0,4) + i + '/',
        });
      }
    });
    return posts;
  },

  getMockClientPosts: function(handle) {
    var now = Date.now();
    var posts = [];
    for (var i = 0; i < 3; i++) {
      var daysAgo = Math.floor(Math.random() * 5) + 1;
      posts.push({
        ownerUsername: handle,
        timestamp: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        caption: 'Post propio del cliente @' + handle + ' #' + i,
        likesCount: Math.floor(Math.random() * 200) + 20,
        commentsCount: Math.floor(Math.random() * 15) + 2,
        type: 'Image',
        shortCode: 'OWN' + handle.substring(0,4) + i,
        url: 'https://www.instagram.com/p/OWN' + handle.substring(0,4) + i + '/',
      });
    }
    return posts;
  }
};
