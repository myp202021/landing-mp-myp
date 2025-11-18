// Script para probar autenticación en PRODUCCIÓN
const PRODUCTION_URL = 'https://mulleryperez.cl';

async function testAuth() {
  console.log('🧪 PROBANDO AUTENTICACIÓN EN PRODUCCIÓN\n');
  console.log('URL:', PRODUCTION_URL);
  console.log('==========================================\n');

  // TEST 1: Login con usuario myp
  console.log('TEST 1: Login con usuario myp');
  console.log('  Usuario: myp');
  console.log('  Password: mypcliente2025\n');

  try {
    const loginRes = await fetch(`${PRODUCTION_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'myp',
        password: 'mypcliente2025'
      })
    });

    const loginData = await loginRes.json();

    if (loginRes.ok && loginData.success) {
      console.log('✅ LOGIN EXITOSO');
      console.log('   Usuario:', loginData.user.username);
      console.log('   Nombre:', loginData.user.nombre);
      console.log('   Rol:', loginData.user.role);
      console.log('   Cliente ID:', loginData.user.cliente_id);

      if (!loginData.user.cliente_id) {
        console.log('⚠️  ADVERTENCIA: cliente_id es null');
        return;
      }

      // TEST 2: Obtener leads del cliente
      console.log('\nTEST 2: Obtener leads del cliente');
      const leadsRes = await fetch(
        `${PRODUCTION_URL}/api/crm/leads?cliente_id=${loginData.user.cliente_id}&limit=100`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const leadsData = await leadsRes.json();

      if (leadsRes.ok && leadsData.leads) {
        console.log('✅ LEADS OBTENIDOS CORRECTAMENTE');
        console.log('   Total de leads:', leadsData.leads.length);
        console.log('   Leads de Zapier:', leadsData.leads.filter(l => l.fuente === 'zapier').length);

        if (leadsData.leads.length > 0) {
          console.log('\n   Primeros 5 leads:');
          leadsData.leads.slice(0, 5).forEach((lead, i) => {
            console.log(`   ${i + 1}. ${lead.nombre || 'Sin nombre'} - ${lead.fuente} - ${new Date(lead.fecha_ingreso).toLocaleDateString('es-CL')}`);
          });
        }
      } else {
        console.log('❌ ERROR OBTENIENDO LEADS');
        console.log('   Status:', leadsRes.status);
        console.log('   Error:', leadsData);
      }

    } else {
      console.log('❌ LOGIN FALLIDO');
      console.log('   Status:', loginRes.status);
      console.log('   Error:', loginData.error || loginData);
    }

  } catch (error) {
    console.log('❌ ERROR EN LA PRUEBA:', error.message);
  }

  console.log('\n==========================================');
  console.log('🏁 PRUEBA COMPLETADA\n');
}

testAuth();
