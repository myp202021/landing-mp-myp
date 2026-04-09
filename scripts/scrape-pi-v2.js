const fetch = require('node-fetch')
const fs = require('fs')

// Lo Barnechea incluye La Dehesa como barrio
const SEARCHES = [
  { comuna: 'Lo Barnechea', url: 'https://www.portalinmobiliario.com/venta/casa/usada/lo-barnechea-metropolitana/_PriceRange_15000UF-0UF_OrderId_BEGINS*DESC', validNames: ['lo barnechea', 'la dehesa', 'valle la dehesa', 'el arrayán', 'farellones', 'los trapenses'] },
  { comuna: 'Vitacura', url: 'https://www.portalinmobiliario.com/venta/casa/usada/vitacura-metropolitana/_PriceRange_15000UF-0UF_OrderId_BEGINS*DESC', validNames: ['vitacura', 'lo curro', 'santa maría de manquehue', 'kennedy'] },
  { comuna: 'Las Condes', url: 'https://www.portalinmobiliario.com/venta/casa/usada/las-condes-metropolitana/_PriceRange_15000UF-0UF_OrderId_BEGINS*DESC', validNames: ['las condes', 'los dominicos', 'san carlos de apoquindo', 'la dehesa', 'lo curro', 'san damián', 'apoquindo', 'paul harris', 'el golf'] },
  { comuna: 'La Reina', url: 'https://www.portalinmobiliario.com/venta/casa/usada/la-reina-metropolitana/_PriceRange_15000UF-0UF_OrderId_BEGINS*DESC', validNames: ['la reina', 'la reina alta', 'príncipe de gales', 'álvaro casanova', 'plaza egaña'] },
]

async function scrapePage(search) {
  const cookieRes = await fetch('https://www.portalinmobiliario.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
    redirect: 'follow',
  })
  const cookies = cookieRes.headers.raw()['set-cookie']?.map(c => c.split(';')[0]).join('; ') || ''

  const res = await fetch(search.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'es-CL,es;q=0.9',
      'Cookie': cookies,
    },
    redirect: 'follow',
  })
  const html = await res.text()

  const titleMatches = [...html.matchAll(/class="poly-component__title"[^>]*>([\s\S]*?)<\//g)]
  const locMatches = [...html.matchAll(/class="[^"]*location[^"]*"[^>]*>([^<]+)</g)]
  const priceMatches = [...html.matchAll(/aria-label="([\d.,]+)\s*(UF|unidades de fomento|pesos)/gi)]
  const linkMatches = [...new Set([...html.matchAll(/href="(https:\/\/[^"]*portalinmobiliario[^"]*MLC[^"]*)"/g)].map(m => m[1]))]
  const attrMatches = [...html.matchAll(/class="poly-component__attributes-list"[^>]*>([\s\S]*?)<\/ul/g)]

  const count = Math.min(titleMatches.length, priceMatches.length, locMatches.length)
  const listings = []

  for (let i = 0; i < count; i++) {
    const title = titleMatches[i]?.[1]?.replace(/<[^>]+>/g, '').trim() || ''
    const priceRaw = (priceMatches[i]?.[1] || '0').replace(/[.,]/g, '')
    const currency = (priceMatches[i]?.[2] || '').toLowerCase()
    let priceUF = parseInt(priceRaw)

    // If price is in pesos, convert to UF (1 UF ≈ 38.000 CLP aprox)
    if (currency === 'pesos' || priceUF > 500000) {
      priceUF = Math.round(priceUF / 38000)
    }

    const location = locMatches[i]?.[1]?.trim() || ''
    const link = linkMatches[i] || ''
    const id = link.match(/MLC-?\d+/)?.[0] || ''

    // Validate: location must contain the commune name or known barrio
    const locLower = location.toLowerCase()
    const isValidComuna = search.validNames.some(name => locLower.includes(name.toLowerCase()))

    // Also check: must NOT be from another region
    const invalidRegions = ['maule', 'curicó', 'valparaíso', 'biobío', 'araucanía', 'coquimbo', 'ohiggins']
    const isWrongRegion = invalidRegions.some(r => locLower.includes(r))

    if (priceUF < 15000 || isWrongRegion) continue
    // If not valid commune but also not wrong region, still include (might be a barrio we don't know)
    if (!isValidComuna && locLower.length > 0) {
      // Check if at least "metropolitana" or "santiago" is implied
      // Keep it but flag it
    }

    let beds = '', baths = '', m2 = ''
    if (attrMatches[i]) {
      const attrItems = [...attrMatches[i][1].matchAll(/<li[^>]*>([\s\S]*?)<\/li/g)].map(a => a[1].replace(/<[^>]+>/g, '').trim())
      beds = attrItems.find(a => a.includes('dormitorio'))?.match(/\d+/)?.[0] || ''
      baths = attrItems.find(a => a.includes('baño'))?.match(/\d+/)?.[0] || ''
      m2 = attrItems.find(a => a.includes('m²'))?.match(/[\d.,]+/)?.[0] || ''
    }

    // Extract barrio (first part of location before comma)
    const parts = location.split(',').map(p => p.trim())
    const barrio = parts[0] || ''
    // The commune is usually the last part
    const comunaFromLoc = parts[parts.length - 1] || search.comuna

    listings.push({
      id, comuna: search.comuna, barrio, title, price: priceUF,
      beds, baths, m2, location, link, comunaFromLoc
    })
  }
  return listings
}

async function run() {
  const all = []
  for (const s of SEARCHES) {
    process.stdout.write(s.comuna + '...')
    try {
      const listings = await scrapePage(s)
      all.push(...listings)
      console.log(' ' + listings.length + ' OK')
    } catch(e) {
      console.log(' ERROR: ' + e.message.substring(0, 50))
    }
    await new Promise(r => setTimeout(r, 2000))
  }

  all.sort((a, b) => b.price - a.price)

  console.log('\nTotal válidos:', all.length)
  const byC = {}
  all.forEach(l => byC[l.comuna] = (byC[l.comuna] || 0) + 1)
  Object.entries(byC).forEach(([k,v]) => console.log('  ', k, ':', v))
  console.log('Rango:', Math.min(...all.map(l=>l.price)).toLocaleString(), '-', Math.max(...all.map(l=>l.price)).toLocaleString(), 'UF')

  fs.writeFileSync('/tmp/pi-listings-v2.json', JSON.stringify(all, null, 2))
  console.log('Saved to /tmp/pi-listings-v2.json')
}

run()
