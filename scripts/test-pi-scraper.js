/**
 * Test: Scraper Portal Inmobiliario — casas usadas >15.000 UF en 4 comunas
 * Usa Apify Web Scraper (Puppeteer) para renderizar la página
 */
const fetch = require('node-fetch')
const APIFY_TOKEN = process.env.APIFY_TOKEN

const SEARCHES = [
  {
    name: 'La Dehesa',
    url: 'https://www.portalinmobiliario.com/venta/casa/usada/la-dehesa-lo-barnechea-metropolitana/_PriceRange_15000UF-0UF_OrderId_BEGINS*DESC'
  },
  {
    name: 'Vitacura',
    url: 'https://www.portalinmobiliario.com/venta/casa/usada/vitacura-metropolitana/_PriceRange_15000UF-0UF_OrderId_BEGINS*DESC'
  },
  {
    name: 'Las Condes',
    url: 'https://www.portalinmobiliario.com/venta/casa/usada/las-condes-metropolitana/_PriceRange_15000UF-0UF_OrderId_BEGINS*DESC'
  },
  {
    name: 'La Reina',
    url: 'https://www.portalinmobiliario.com/venta/casa/usada/la-reina-metropolitana/_PriceRange_15000UF-0UF_OrderId_BEGINS*DESC'
  },
]

async function scrapePI(searchUrl, searchName) {
  console.log(`\n🔍 ${searchName}: ${searchUrl}`)

  // Use Apify's Web Scraper actor with Puppeteer
  const res = await fetch(
    `https://api.apify.com/v2/acts/apify~web-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=120`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startUrls: [{ url: searchUrl }],
        pageFunction: `async function pageFunction(context) {
          const { page, request } = context;

          // Wait for listings to load
          await page.waitForSelector('.ui-search-layout__item, .andes-card', { timeout: 15000 }).catch(() => {});
          await new Promise(r => setTimeout(r, 3000));

          // Extract listings
          const listings = await page.evaluate(() => {
            const items = [];
            const cards = document.querySelectorAll('.ui-search-layout__item, .andes-card--default');

            cards.forEach(card => {
              try {
                const title = card.querySelector('.ui-search-item__title, .poly-card__title, .poly-component__title')?.textContent?.trim() || '';
                const priceEl = card.querySelector('.andes-money-amount__fraction, .price-tag-fraction, .poly-price__current .andes-money-amount__fraction');
                const price = priceEl?.textContent?.trim() || '';
                const currency = card.querySelector('.andes-money-amount__currency-symbol, .price-tag-symbol')?.textContent?.trim() || '';
                const link = card.querySelector('a[href*="portalinmobiliario"], a[href*="MLC"]')?.href || '';
                const location = card.querySelector('.ui-search-item__location, .poly-component__location, .ui-search-item__group__element--location')?.textContent?.trim() || '';

                // Attributes (bedrooms, bathrooms, m2)
                const attrs = [];
                card.querySelectorAll('.ui-search-card-attributes__attribute, .poly-attributes-list__item').forEach(a => {
                  attrs.push(a.textContent?.trim());
                });

                // Image
                const img = card.querySelector('img[src*="http"]')?.src || '';

                if (title || price) {
                  items.push({ title, price, currency, location, link, attrs, img });
                }
              } catch(e) {}
            });

            // Also get total results count
            const totalEl = document.querySelector('.ui-search-search-result__quantity-results, .poly-search-result__count');
            const total = totalEl?.textContent?.trim() || 'no count found';

            return { items, total, cardsFound: cards.length };
          });

          return listings;
        }`,
        proxyConfiguration: { useApifyProxy: true },
        maxPagesPerCrawl: 1,
      })
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.log(`   ❌ Error: ${res.status} — ${err.substring(0, 200)}`)
    return null
  }

  const data = await res.json()
  return data[0] || null
}

async function main() {
  console.log('🏠 TEST: Portal Inmobiliario — Casas usadas >15.000 UF\n')

  for (const search of SEARCHES) {
    const result = await scrapePI(search.url, search.name)

    if (!result) {
      console.log('   Sin resultados')
      continue
    }

    console.log(`   Total en PI: ${result.total}`)
    console.log(`   Cards encontradas: ${result.cardsFound}`)
    console.log(`   Listings extraídos: ${result.items?.length || 0}`)

    if (result.items?.length > 0) {
      console.log('\n   Primeros 3:')
      for (const item of result.items.slice(0, 3)) {
        console.log(`   ──────────────────`)
        console.log(`   ${item.title}`)
        console.log(`   Precio: ${item.currency} ${item.price}`)
        console.log(`   Ubicación: ${item.location}`)
        console.log(`   Attrs: ${item.attrs?.join(' | ')}`)
        console.log(`   URL: ${item.link?.substring(0, 80)}`)
      }
    }

    // Pause between searches
    await new Promise(r => setTimeout(r, 5000))
  }

  console.log('\n✅ Test completado')
}

main().catch(err => {
  console.error('💥', err.message)
  process.exit(1)
})
