// Simulación del mapeo
const FIELD_MAPPING = {
  'full_name': 'nombre',
  'email': 'email',
  'número_de_teléfono': 'telefono',
  'nombre_de_la_empresa': 'empresa',
  'facturación_mensual_empresa': 'presupuesto',
  'created_time': 'fecha_ingreso',
  'campaign_name': 'campana_nombre',
  'ad_name': 'ad_nombre',
  'adset_name': 'adset_nombre',
  'form_name': 'form_nombre'
};

const row = {
  'id': '1357063689265272',
  'created_time': 45959.34737268519,
  'ad_id': '120234367128090475',
  'ad_name': 'Carrusel',
  'adset_id': '120234367128060475',
  'adset_name': 'Personalizado',
  'campaign_id': '120226622140990475',
  'campaign_name': 'Clientes potenciales - público segmentado',
  'form_id': '1110829226975102',
  'form_name': 'Formulario - MyP - 2025 - Plan Integral',
  'is_organic': false,
  'platform': 'ig',
  'facturación_mensual_empresa': '$5_-_$10_millones_',
  'nombre_de_la_empresa': 'Arriendo y transporte SEHA spa',
  'full_name': 'Jhon Leyton',
  'email': 'Jhon.leyton@hurue.cl',
  'número_de_teléfono': '+56953665429',
  'lead_status': 'complete'
};

const lead = {
  cliente_id: 'test-123',
  rubro: 'Meta Ads',
  fecha_ingreso: new Date().toISOString()
};

// Mapear campos
for (const [metaField, dbField] of Object.entries(FIELD_MAPPING)) {
  if (row[metaField]) {
    if (dbField === 'nombre' && row['full_name']) {
      const parts = row['full_name'].trim().split(/\s+/);
      lead['nombre'] = parts[0];
      if (parts.length > 1) {
        lead['apellido'] = parts.slice(1).join(' ');
      }
    } else {
      lead[dbField] = row[metaField];
    }
  }
}

console.log('Lead mapeado:');
console.log(JSON.stringify(lead, null, 2));
console.log('\n¿Tiene empresa?', lead.empresa ? 'SÍ' : 'NO');
console.log('¿Tiene teléfono?', lead.telefono ? 'SÍ' : 'NO');
