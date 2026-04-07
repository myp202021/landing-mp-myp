/**
 * Carga los perfiles de clientes con sus links (grilla, drive, web, RRSS) a Supabase
 * Tabla: client_profiles (nueva) o actualiza clientes existentes
 */

const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CLIENTS = [
  { nombre: 'Adimac', grilla_url: 'https://docs.google.com/spreadsheets/d/1Tif3jBlOw_Vi6kAgQekzeqo82ynB3w-80b6q-HPr', drive_url: 'https://drive.google.com/drive/folders/15GvL7S_4SmolHnNPmD9PuvQoPRjKQ7vW', web: 'https://www.andamiosadimac.cl/', rrss: ['https://www.facebook.com/adimacltda'], rubro: 'Construcción / Andamios' },
  { nombre: 'Charriot', grilla_url: 'https://docs.google.com/spreadsheets/d/1MNmtGDnTNF0oH73iFwzeHU3vHtjcS7faX9mGb5yg', drive_url: 'https://drive.google.com/drive/folders/1QcFiFfULrEI_5Ame3vagepY-xjedd9i8', web: 'https://charriot.cl/', rrss: ['https://www.facebook.com/charriot.cl', 'https://www.instagram.com/charriot_rentacar/'], rubro: 'Rent a Car' },
  { nombre: 'Dezar', grilla_url: 'https://docs.google.com/spreadsheets/d/1I_XnuGADdKFXqT1P9I_bf4Ua3zT4voN5/edit', drive_url: 'https://drive.google.com/drive/folders/1mGO5IT-3l1uxeZK46ldW2sg6FHr09b_v', web: 'https://dezarrentacar.com/', rrss: ['https://www.facebook.com/profile.php?id=100063523120686', 'https://www.instagram.com/dezarrentacar/'], rubro: 'Rent a Car' },
  { nombre: 'Forcmin', grilla_url: 'https://docs.google.com/spreadsheets/d/1Ho4qJdj2A0ivoQzGVVJ0HXiQunJO5y-BN-Z_DWL7', drive_url: 'https://drive.google.com/drive/folders/1EcHkLqGQdc2zM_9D1bTdxklzxbGnIPvI', web: 'https://forcmin.cl/', rrss: ['https://www.facebook.com/profile.php?id=61577570289394', 'https://www.instagram.com/forcmin/'], rubro: 'Minería / Servicios industriales' },
  { nombre: 'PineApple', grilla_url: 'https://docs.google.com/spreadsheets/d/1vz6FOYSqjgF6ONLTirIJM8TXpSAges-7CzIgJ_ZQ', drive_url: 'https://drive.google.com/drive/folders/1lS2X03eD-JXBrnDyE8R7zyz8PlnCJLx7', web: 'https://pineapplestore.cl/', rrss: ['https://www.facebook.com/PineAppleStoreChile', 'https://www.instagram.com/pineapple_store/'], rubro: 'Tecnología / E-commerce' },
  { nombre: 'Sistemáticos', grilla_url: 'https://docs.google.com/spreadsheets/d/1CpsV2HfhbncdV4kN98l1hZrMjVDb34_1/edit', drive_url: 'https://drive.google.com/drive/folders/1vu0QaSfelPRBu5rAI3g-v4NPf7RsugVm', web: 'http://www.sistematicos.cl/', rrss: ['https://www.facebook.com/SistematicosChile', 'https://www.instagram.com/sistematicos.cl/'], rubro: 'Tecnología / Software' },
  { nombre: 'Stocks', grilla_url: 'https://docs.google.com/spreadsheets/d/1o9BEh7X5bihbRoIff11gVHhUagq4mzabJEatth23', drive_url: 'https://drive.google.com/drive/folders/1TSSrmCvdhr_E3Lcc-WbEiT_Sya8xWf7j', web: 'https://stocks.cl/', rrss: ['https://www.facebook.com/profile.php?id=61563496924239', 'https://www.instagram.com/stocks_cl/'], rubro: 'Retail / Bazar' },
  { nombre: '4life', grilla_url: 'https://docs.google.com/spreadsheets/d/1DjzrkGEgJ7rsXUjx-Pgb5l5ZtOVmAl7XP6R6DkjO', drive_url: null, web: null, rrss: [], rubro: 'Salud / Seguros' },
  { nombre: 'ADL', grilla_url: 'https://docs.google.com/spreadsheets/d/1FcZU89xmZQuXHWT95fzxkd64AsIhBvWorJLbwttk', drive_url: 'https://drive.google.com/drive/folders/1Edq1xMykyqk0qYzpXyk1l6JgTONrYVxd', web: 'https://www.ald.cl/', rrss: ['https://www.instagram.com/ald.autos/'], rubro: 'Automotriz' },
  { nombre: 'Atacama Experience', grilla_url: 'https://docs.google.com/spreadsheets/d/1bCoc_Io-zCCa95VmTYd9iYcajhuUArIqZ7Q89DRn', drive_url: null, web: 'https://atacamaexperience.com/', rrss: ['https://www.instagram.com/atacamaexperience/'], rubro: 'Turismo' },
  { nombre: 'ByteStore', grilla_url: 'https://docs.google.com/spreadsheets/d/1QeO9xT6WAknFLxFjuTNboEmrpdfpvKYeaNkccPI7', drive_url: 'https://drive.google.com/drive/folders/1cMeV_uopT5Iad0VI57r_nemnnVXmeOot', web: 'https://bytestore.cl/', rrss: ['https://www.instagram.com/byte_store.cl/'], rubro: 'Tecnología / E-commerce' },
  { nombre: 'Distec', grilla_url: 'https://docs.google.com/spreadsheets/d/1w5QdNj1YD3C0MRvYUpSKmQmo9jEye0Q3wwWH4xKh', drive_url: 'https://drive.google.com/drive/folders/1KUsW0AGRcn-xtjx53OV1A_xXdRSXmmCP', web: 'https://distecchile.cl/', rrss: ['https://www.instagram.com/distecchile/'], rubro: 'Distribución / Tecnología' },
  { nombre: 'Elitsoft', grilla_url: 'https://docs.google.com/spreadsheets/d/1kkI3lGtU12CV_VLpsZZeBcABqVL3x-KSBiQaPo3A', drive_url: 'https://drive.google.com/drive/folders/1tSDLgo1Ug9rVZew7JB4n4SCBon0G9gXW', web: 'https://www.elitsoft.cl/', rrss: ['https://www.instagram.com/elitsoft.chile/'], rubro: 'Tecnología / Software' },
  { nombre: 'Firstpack', grilla_url: 'https://docs.google.com/spreadsheets/d/13Qy0-c61rLI98LJH6NANSFgVGHuEtEZmvZYkKpIv', drive_url: 'https://drive.google.com/drive/folders/1s5FxjTH2cMX2aNTNv3wKUkiJ8-HGIBQl', web: 'https://firstpack.cl/', rrss: ['https://www.instagram.com/firstpackcl/'], rubro: 'Packaging / Embalaje' },
  { nombre: 'Fuxion Logistics', grilla_url: 'https://docs.google.com/spreadsheets/d/1jtQZcWDCvgdxrCXgEzO5VgQpPTZZTgPM2xEL0qfx', drive_url: 'https://drive.google.com/drive/folders/1fcYNxXxfE3bMUgKUJT6ZQD5-6cYeciwS', web: 'https://fuxionlogistics.cl/', rrss: ['https://www.instagram.com/fuxionlogistics.spa/'], rubro: 'Logística / Transporte' },
  { nombre: 'Genera', grilla_url: 'https://docs.google.com/spreadsheets/d/1iFPnPEyBlc4GpKjvBe3_o1X52PGKRzG0kbyrt8BR', drive_url: 'https://drive.google.com/drive/folders/1jPYBcuUQLKyZ3g8AJHlSHh4or7By0Smw', web: 'https://www.genera.cl/', rrss: ['https://www.instagram.com/generahrdigital/'], rubro: 'RRHH / Software' },
  { nombre: 'Granarolo', grilla_url: 'https://docs.google.com/spreadsheets/d/1bbWO62KMqPWf9yTqGyJODx-f2lrCra31H3rJMyyB', drive_url: 'https://drive.google.com/drive/folders/1T4LQvJBErEA7r9R2wDmYL5KwFrZ4oCuQ', web: 'https://granarolo.cl/', rrss: ['https://www.instagram.com/granarolochile/'], rubro: 'Alimentación / Lácteos' },
  { nombre: 'HL Soluciones', grilla_url: 'https://docs.google.com/spreadsheets/d/1XSqTx6hnwKzgyfvpuzp_my2Lvz0qSVgsS6_KguPO', drive_url: 'https://drive.google.com/drive/folders/15aNhvhoFpzRvdqvG7fgqqBra5Rr3tmkv', web: 'https://hlsoluciones.cl/', rrss: ['https://www.instagram.com/hlsolucionescl/'], rubro: 'Tecnología / Soluciones IT' },
  { nombre: 'Homar', grilla_url: 'https://docs.google.com/spreadsheets/d/1yFzYQGFnDZokyHZYNMI0WbNcuo3L9xYdNe94Q-PE', drive_url: 'https://drive.google.com/drive/folders/1sSOM71QeSOVdZ2_9xRMnFDmam_iNzt6r', web: 'https://homar.cl/', rrss: ['https://www.instagram.com/importadorahomar/'], rubro: 'Importadora / Retail' },
  { nombre: 'Hualpén', grilla_url: null, drive_url: null, web: 'https://www.buseshualpen.cl/', rrss: ['https://www.instagram.com/buses.hualpen/'], rubro: 'Transporte / Buses' },
  { nombre: 'Invas', grilla_url: 'https://docs.google.com/spreadsheets/d/1xz524Tlz8uI2trVIBzsMCoHCU4Z5BL8JEgPWYq_Z', drive_url: 'https://drive.google.com/drive/folders/1F8rnl4MmwW5hqHht5_bsBA8IgFAlCXet', web: 'https://www.invassuite.com/', rrss: ['https://www.instagram.com/invassuite/'], rubro: 'Hotelería / Software' },
  { nombre: 'JP', grilla_url: 'https://docs.google.com/spreadsheets/d/18EeZQVpZlgelKg1jVVltRcx1TBZvh7ltAfuW0a4M', drive_url: 'https://drive.google.com/drive/folders/1DLgsRwMCvaUvnc1wZ9XBX42QWA4XBKxT', web: 'https://jpprocesos.cl/', rrss: ['https://www.instagram.com/jpprocesos.cl/'], rubro: 'RRHH / Outsourcing agroindustria' },
  { nombre: 'PowerEnergy', grilla_url: 'https://docs.google.com/spreadsheets/d/1CEZP9D3lqWHipulzoO24lAKJaCEN8GJU5l9RWtl4', drive_url: 'https://drive.google.com/drive/folders/15pMD3hXmo-Ovp3Wq4bSGvq_uZF89987Z', web: 'https://powerenergy.cl/', rrss: ['https://www.instagram.com/powerenergy.cl'], rubro: 'Iluminación / Energía' },
  { nombre: 'Pregiata', grilla_url: 'https://docs.google.com/spreadsheets/d/12wfALkrcFWxR-hLOfbPV45m5Rey61pU3/edit', drive_url: 'https://drive.google.com/drive/folders/1FcREPVh1GWQe0y1kFnmtbOboW500jApa', web: 'https://pregiata.cl/', rrss: ['https://www.instagram.com/pregiata_spa/'], rubro: 'Gastronomía / Vinos' },
  { nombre: 'Proacogida', grilla_url: null, drive_url: null, web: 'https://www.proacogida.cl/', rrss: ['https://www.instagram.com/proacogida/'], rubro: 'ONG / Social' },
  { nombre: 'Rilay', grilla_url: null, drive_url: 'https://drive.google.com/drive/folders/1YFJxsOTrD5oxdXE5lHvxYbX-fjD3nNsA', web: 'https://rilay.cl/', rrss: ['https://www.instagram.com/rilayinmobiliaria/'], rubro: 'Inmobiliaria' },
  { nombre: 'Swing', grilla_url: 'https://docs.google.com/spreadsheets/d/1xhubbA4PIjmk4xzWO1Vi-NoNeHw66bP0/edit', drive_url: 'https://drive.google.com/drive/folders/1iq7whAygpQy6lvYWJuD6tyutHWn19sLz', web: 'https://www.swingmanagement.cl/', rrss: ['https://www.instagram.com/swingmanagement/'], rubro: 'Eventos / Producción' },
  { nombre: 'Tecnomat', grilla_url: 'https://docs.google.com/spreadsheets/d/1eBEhN_stoAdHrkaQVs7_Sm4hno21I_5XaWyg9pok', drive_url: null, web: 'https://www.empresastecnomat.cl/', rrss: ['https://www.instagram.com/empresastecnomat/'], rubro: 'Construcción / Materiales' },
  { nombre: 'Tía Foca', grilla_url: 'https://docs.google.com/spreadsheets/d/1PWt9wbHi_cgKjxAJmfWnlKECJQYw887vrll5xVGs', drive_url: null, web: null, rrss: ['https://www.instagram.com/latiafoca/'], rubro: 'Alimentación / Helados' },
  { nombre: 'Vemos tu Auto', grilla_url: null, drive_url: 'https://drive.google.com/drive/folders/1cQMObAxBtrRCrl5K-NBemxgAbVwYibkk', web: 'https://vemostuauto.cl/', rrss: ['https://www.instagram.com/vemostuauto.cl/'], rubro: 'Automotriz / Inspección' },
  { nombre: 'ZeroWater', grilla_url: 'https://docs.google.com/spreadsheets/d/1UaJl2H2qjOxOnRsDfghSbaATXmjPROR4/edit', drive_url: 'https://drive.google.com/drive/folders/1E6sZVnP_NnoQyVgCB0ayAs8fMmvxqgR4', web: 'https://www.zerowater.cl/', rrss: ['https://www.instagram.com/zerowaterchile/'], rubro: 'Hogar / Filtros de agua' },
]

async function main() {
  console.log(`Cargando ${CLIENTS.length} perfiles de clientes...\n`)

  for (const c of CLIENTS) {
    // Buscar si el cliente ya existe en la tabla clientes
    const { data: existing } = await supabase
      .from('clientes')
      .select('id, nombre')
      .ilike('nombre', `%${c.nombre}%`)
      .limit(1)
      .single()

    const clienteId = existing?.id || null

    console.log(`${c.nombre} ${clienteId ? '(existe: ' + existing.nombre + ')' : '(nuevo)'}`)
    console.log(`  Rubro: ${c.rubro}`)
    console.log(`  Web: ${c.web || '—'}`)
    console.log(`  Grilla: ${c.grilla_url ? 'Sí' : '—'}`)
    console.log(`  Drive: ${c.drive_url ? 'Sí' : '—'}`)
    console.log(`  RRSS: ${c.rrss.length}`)
    console.log()
  }

  // Insertar en Supabase
  let inserted = 0, updated = 0

  for (const c of CLIENTS) {
    // Buscar cliente existente en tabla clientes
    const { data: existing } = await supabase
      .from('clientes')
      .select('id')
      .ilike('nombre', `%${c.nombre}%`)
      .limit(1)
      .single()

    const profile = {
      cliente_id: existing?.id || null,
      nombre: c.nombre,
      rubro: c.rubro,
      web_url: c.web,
      grilla_historica_url: c.grilla_url,
      drive_url: c.drive_url,
      rrss: c.rrss,
      plataformas_activas: c.rrss.map(u => {
        if (u.includes('instagram')) return 'instagram'
        if (u.includes('facebook')) return 'facebook'
        if (u.includes('linkedin')) return 'linkedin'
        if (u.includes('tiktok')) return 'tiktok'
        return 'otro'
      }),
      activo: true,
    }

    // Upsert por nombre
    const { error } = await supabase
      .from('client_profiles')
      .upsert(profile, { onConflict: 'nombre' })

    if (error) {
      console.error(`❌ ${c.nombre}: ${error.message}`)
    } else {
      inserted++
      console.log(`✅ ${c.nombre}`)
    }
  }

  console.log(`\n════════════════════════════════════════`)
  console.log(`✅ ${inserted} perfiles cargados en Supabase`)
  console.log(`════════════════════════════════════════`)
}

main()
