/**
 * IMPORTAR GRILLAS HISTÓRICAS desde Google Sheets a Supabase
 * Lee cada sheet CSV, extrae posts (copy, tipo, plataforma, día) y los guarda
 * en una tabla para que el agente de briefing pueda analizarlos
 *
 * Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Client → Sheet ID mapping (extracted from DOCX)
const CLIENT_SHEETS = [
  { nombre: 'Adimac', sheetId: '1Tif3jBlOw_Vi6kAgQekzeqo82ynB3w-80b6q-HPrc2A' },
  { nombre: 'Charriot', sheetId: '1MNmtGDnTNF0oH73iFwzeHU3vHtjcS7faX9mGb5ygkuo' },
  { nombre: 'Dezar', sheetId: '1I_XnuGADdKFXqT1P9I_bf4Ua3zT4voN5' },
  { nombre: 'Forcmin', sheetId: '1Ho4qJdj2A0ivoQzGVVJ0HXiQunJO5y-BN-Z_DWL7TbA' },
  { nombre: 'PineApple', sheetId: '1vz6FOYSqjgF6ONLTirIJM8TXpSAges-7CzIgJ_ZQOjI' },
  { nombre: 'Sistemáticos', sheetId: '1CpsV2HfhbncdV4kN98l1hZrMjVDb34_1' },
  { nombre: 'Stocks', sheetId: '1o9BEh7X5bihbRoIff11gVHhUagq4mzabJEatth23CNA' },
  { nombre: '4life', sheetId: '1DjzrkGEgJ7rsXUjx-Pgb5l5ZtOVmAl7XP6R6DkjOIio' },
  { nombre: 'ADL', sheetId: '1FcZU89xmZQuXHWT95fzxkd64AsIhBvWorJLbwttkjDg' },
  { nombre: 'Atacama Experience', sheetId: '1bCoc_Io-zCCa95VmTYd9iYcajhuUArIqZ7Q89DRnJeg' },
  { nombre: 'ByteStore', sheetId: '1QeO9xT6WAknFLxFjuTNboEmrpdfpvKYeaNkccPI79IE' },
  { nombre: 'Distec', sheetId: '1w5QdNj1YD3C0MRvYUpSKmQmo9jEye0Q3wwWH4xKhmMY' },
  { nombre: 'Elitsoft', sheetId: '1kkI3lGtU12CV_VLpsZZeBcABqVL3x-KSBiQaPo3AmgY' },
  { nombre: 'Firstpack', sheetId: '13Qy0-c61rLI98LJH6NANSFgVGHuEtEZmvZYkKpIvVkc' },
  { nombre: 'Fuxion Logistics', sheetId: '1jtQZcWDCvgdxrCXgEzO5VgQpPTZZTgPM2xEL0qfxAxI' },
  { nombre: 'Genera', sheetId: '1iFPnPEyBlc4GpKjvBe3_o1X52PGKRzG0kbyrt8BR_HY' },
  { nombre: 'Granarolo', sheetId: '1bbWO62KMqPWf9yTqGyJODx-f2lrCra31H3rJMyyBRUg' },
  { nombre: 'HL Soluciones', sheetId: '1XSqTx6hnwKzgyfvpuzp_my2Lvz0qSVgsS6_KguPOP4U' },
  { nombre: 'Homar', sheetId: '1yFzYQGFnDZokyHZYNMI0WbNcuo3L9xYdNe94Q-PERA8' },
  { nombre: 'Invas', sheetId: '1xz524Tlz8uI2trVIBzsMCoHCU4Z5BL8JEgPWYq_ZE68' },
  { nombre: 'JP', sheetId: '18EeZQVpZlgelKg1jVVltRcx1TBZvh7ltAfuW0a4MI0A' },
  { nombre: 'PowerEnergy', sheetId: '1CEZP9D3lqWHipulzoO24lAKJaCEN8GJU5l9RWtl4Fj8' },
  { nombre: 'Pregiata', sheetId: '12wfALkrcFWxR-hLOfbPV45m5Rey61pU3' },
  { nombre: 'Swing', sheetId: '1xhubbA4PIjmk4xzWO1Vi-NoNeHw66bP0' },
  { nombre: 'Tecnomat', sheetId: '1eBEhN_stoAdHrkaQVs7_Sm4hno21I_5XaWyg9pokykU' },
  { nombre: 'Tía Foca', sheetId: '1PWt9wbHi_cgKjxAJmfWnlKECJQYw887vrll5xVGsfrI' },
  { nombre: 'ZeroWater', sheetId: '1UaJl2H2qjOxOnRsDfghSbaATXmjPROR4' },
]

// ── Parse CSV ───────────────────────────────────────────

function parseCSV(text) {
  const lines = text.split('\n')
  const rows = []
  for (const line of lines) {
    // Simple CSV parse (handles quoted fields with commas)
    const fields = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
    fields.push(current.trim())
    rows.push(fields)
  }
  return rows
}

// ── Extract posts from sheet data ───────────────────────

function extractPosts(rows, clientName) {
  const posts = []
  let currentMonth = ''

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.length < 2) continue

    // Detect month headers
    const firstCell = (row[0] || '').toUpperCase().trim()
    const MONTHS = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
    if (MONTHS.includes(firstCell)) {
      currentMonth = firstCell
      continue
    }

    // Look for "Copy" row label
    if (firstCell === 'COPY' || firstCell === 'CAPTION' || firstCell === 'TEXTO') {
      // This row and potentially following rows contain copies
      for (let j = 1; j < row.length; j++) {
        const copy = (row[j] || '').trim()
        if (copy && copy.length > 20) {
          posts.push({
            mes: currentMonth || 'desconocido',
            copy: copy.substring(0, 1000),
            posicion: j,
          })
        }
      }
      continue
    }

    // Also check for rows where cells contain long text (likely copies)
    // Look for rows after "Tipo Post" row
    for (let j = 1; j < row.length; j++) {
      const cell = (row[j] || '').trim()
      // If cell has > 50 chars and contains line breaks or is clearly a copy
      if (cell.length > 80 && (cell.includes('\n') || cell.includes('.') || cell.includes('!'))) {
        // Check it's not a header
        const upper = cell.toUpperCase()
        if (!upper.includes('FACEBOOK') && !upper.includes('INSTAGRAM') && !upper.includes('PLATAFORMA')) {
          posts.push({
            mes: currentMonth || 'desconocido',
            copy: cell.substring(0, 1000),
            posicion: j,
          })
        }
      }
    }
  }

  // Deduplicate by copy
  const seen = new Set()
  return posts.filter(p => {
    const key = p.copy.substring(0, 50)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ── Fetch sheet ─────────────────────────────────────────

async function fetchSheet(sheetId) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`
    const res = await fetch(url, { redirect: 'follow', timeout: 15000 })
    if (!res.ok) {
      // Try with gid=0
      const res2 = await fetch(`${url}&gid=0`, { redirect: 'follow', timeout: 15000 })
      if (!res2.ok) return null
      return await res2.text()
    }
    return await res.text()
  } catch (err) {
    return null
  }
}

// ── Main ────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  let limitFilter = 50
  let nombreFilter = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limitFilter = parseInt(args[++i])
    if (args[i] === '--nombre' && args[i + 1]) nombreFilter = args[++i]
  }

  const clients = nombreFilter
    ? CLIENT_SHEETS.filter(c => c.nombre.toLowerCase().includes(nombreFilter.toLowerCase()))
    : CLIENT_SHEETS.slice(0, limitFilter)

  console.log(`\n📥 IMPORTAR GRILLAS HISTÓRICAS`)
  console.log(`   Clientes: ${clients.length}\n`)

  let totalPosts = 0
  let successful = 0

  for (const client of clients) {
    process.stdout.write(`   📄 ${client.nombre}...`)

    const csv = await fetchSheet(client.sheetId)
    if (!csv) {
      console.log(' ❌ no accesible')
      continue
    }

    const rows = parseCSV(csv)
    const posts = extractPosts(rows, client.nombre)

    if (posts.length === 0) {
      console.log(` ⚠️ 0 posts extraídos (${rows.length} filas CSV)`)
      continue
    }

    // Save to client_profiles
    const { error } = await supabase
      .from('client_profiles')
      .update({
        grilla_historica_data: posts,
        grilla_historica_posts: posts.length,
      })
      .eq('nombre', client.nombre)

    if (error) {
      // Column might not exist yet
      console.log(` ⚠️ ${error.message}`)
    } else {
      console.log(` ✅ ${posts.length} posts`)
      totalPosts += posts.length
      successful++
    }

    // Pausa
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`📊 RESUMEN`)
  console.log(`   Clientes procesados: ${successful}/${clients.length}`)
  console.log(`   Posts extraídos: ${totalPosts}`)
  console.log(`════════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('💥', err)
  process.exit(1)
})
