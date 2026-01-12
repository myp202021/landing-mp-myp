/**
 * Script para agregar Article Schema a todos los blog posts
 * Ejecutar: node scripts/add-article-schema.js
 */

const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../app/blog');

// Obtener todos los directorios de blog (excluyendo page.tsx principal)
const blogPosts = fs.readdirSync(blogDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log(`Encontrados ${blogPosts.length} posts de blog\n`);

let updated = 0;
let skipped = 0;
let errors = 0;

blogPosts.forEach(postSlug => {
  const filePath = path.join(blogDir, postSlug, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  No existe: ${postSlug}/page.tsx`);
    skipped++;
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Verificar si ya tiene Article Schema
  if (content.includes('createArticleSchema') || content.includes('"@type": "Article"') || content.includes("'@type': 'Article'")) {
    console.log(`⏭️  Ya tiene schema: ${postSlug}`);
    skipped++;
    return;
  }

  // Extraer información del metadata existente
  const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
  const descMatch = content.match(/description:\s*['"`]([^'"`]+)['"`]/);
  const canonicalMatch = content.match(/canonical:\s*['"`]([^'"`]+)['"`]/);
  const publishedMatch = content.match(/publishedTime:\s*['"`]([^'"`]+)['"`]/);

  if (!titleMatch || !descMatch) {
    console.log(`❌ No se pudo extraer metadata: ${postSlug}`);
    errors++;
    return;
  }

  const title = titleMatch[1];
  const description = descMatch[1];
  const url = canonicalMatch ? canonicalMatch[1] : `https://www.mulleryperez.cl/blog/${postSlug}`;
  const publishedTime = publishedMatch ? publishedMatch[1] : '2025-01-01T10:00:00Z';

  // Crear el schema JSON-LD
  const articleSchema = `
  // Article Schema JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '${title.replace(/'/g, "\\'")}',
    description: '${description.replace(/'/g, "\\'")}',
    url: '${url}',
    datePublished: '${publishedTime}',
    dateModified: '${publishedTime}',
    author: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Muller y Pérez',
      url: 'https://www.mulleryperez.cl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mulleryperez.cl/logo-color.png'
      }
    },
    image: 'https://www.mulleryperez.cl/og-image.jpg',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': '${url}'
    },
    articleSection: 'Marketing Digital',
    inLanguage: 'es-CL'
  }
`;

  // Agregar el schema después de la definición de metadata
  // Buscar el patrón "export default function"
  const functionMatch = content.match(/export default function \w+\(\)\s*\{/);

  if (!functionMatch) {
    console.log(`❌ No se encontró función default: ${postSlug}`);
    errors++;
    return;
  }

  // Insertar el schema antes del "export default function"
  const insertPoint = content.indexOf(functionMatch[0]);
  const newContent = content.slice(0, insertPoint) + articleSchema + '\n' + content.slice(insertPoint);

  // Agregar el script JSON-LD dentro del return, después del primer div
  // Buscar el primer <div o <article después del return
  const returnMatch = newContent.match(/return\s*\(\s*(<div|<article|<main)/);

  if (returnMatch) {
    const jsonLdScript = `
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
`;
    // Insertar después del primer tag de apertura
    const tagEndIndex = newContent.indexOf('>', newContent.indexOf(returnMatch[0])) + 1;
    const finalContent = newContent.slice(0, tagEndIndex) + jsonLdScript + newContent.slice(tagEndIndex);

    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log(`✅ Actualizado: ${postSlug}`);
    updated++;
  } else {
    console.log(`❌ No se encontró return statement: ${postSlug}`);
    errors++;
  }
});

console.log(`\n========================================`);
console.log(`📊 Resumen:`);
console.log(`   ✅ Actualizados: ${updated}`);
console.log(`   ⏭️  Omitidos: ${skipped}`);
console.log(`   ❌ Errores: ${errors}`);
console.log(`========================================\n`);
