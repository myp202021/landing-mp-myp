// Importa al CRM los leads de las campañas TEST de Claude (Meta Lead Ads).
// Respaldo del flujo Zapier: Claude baja los leads de los formularios TEST con la sesión de Chrome
// (GET /{form_id}/leads?fields=id,created_time,field_data,ad_name,adset_name,campaign_name,form_id)
// y los deja en un JSON; este script los inserta sin duplicar (por meta_lead_id).
// Uso: node scripts/importar-leads-meta-test.mjs ruta/leads.json
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const TEST_CLAUDE_CLIENTE_ID = '1ecabf3e-27a1-4715-bfa7-eb54b078d7d3' // cliente M&P (CRM único; 7 oct)
const NOTA = 'Campaña TEST de Christopher — la gestiona Christopher'

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n').filter((l) => l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, '')] }),
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const leads = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const campo = (fd, ...nombres) => {
  const f = fd.find((x) => nombres.some((n) => x.name.toLowerCase() === n || x.name.toLowerCase().includes(n)))
  return f ? f.values[0] : null
}

let nuevos = 0, repetidos = 0
for (const l of leads) {
  const { data: ya } = await supabase.from('leads').select('id').eq('meta_lead_id', l.id).maybeSingle()
  if (ya) { repetidos++; continue }
  const v = (String(l.campaign_name || l.form_name || '').match(/TEST\s*Claude\s*([AB])/i) || [])[1] || '?'
  const fd = l.field_data || []
  const extras = fd.filter((x) => !/full_name|email|phone_number|company_name/.test(x.name))
    .map((x) => `${x.name}: ${x.values.join(', ')}`)
  const { error } = await supabase.from('leads').insert({
    cliente_id: TEST_CLAUDE_CLIENTE_ID,
    meta_lead_id: l.id,
    nombre: campo(fd, 'full_name', 'nombre') || 'Sin nombre',
    email: campo(fd, 'email', 'correo'),
    telefono: campo(fd, 'phone_number', 'whatsapp', 'telefono'),
    empresa: campo(fd, 'company_name', 'empresa'),
    nombre_empresa: campo(fd, 'company_name', 'empresa'),
    fuente: `Meta — Campaña TEST Claude ${v.toUpperCase()}`,
    campana_nombre: l.campaign_name || null,
    adset_nombre: l.adset_name || null,
    ad_nombre: l.ad_name || null,
    form_nombre: l.form_name || l.form_id || null,
    notas: NOTA,
    observaciones: extras.join(' | ') || null,
    fecha_ingreso: new Date(l.created_time).toISOString(),
    mes_ingreso: new Date(l.created_time).toISOString().slice(0, 7),
    estado: 'nuevo',
    contactado: false,
    vendido: false,
  })
  if (error) { console.error('Error', l.id, error.message); continue }
  nuevos++
}
console.log(`Leads TEST importados: ${nuevos} nuevos, ${repetidos} ya estaban.`)
