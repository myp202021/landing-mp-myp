// VERIFICACIÓN COMPLETA DEL SISTEMA CRM
// Base de datos + APIs + Autenticación + Lógica
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer variables de entorno
const envPath = resolve(__dirname, '../.env.local');
const envFile = readFileSync(envPath, 'utf-8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    value = value.replace(/^["']|["']$/g, '');
    value = value.replace(/\n/g, '');
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const PRODUCTION_URL = 'https://mulleryperez.cl';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA CRM');
console.log('═══════════════════════════════════════════════════════════\n');

let errores = [];
let warnings = [];
let exitos = [];

// ============================================================
// 1. VERIFICAR BASE DE DATOS
// ============================================================
console.log('📊 1. VERIFICANDO BASE DE DATOS (SUPABASE)\n');

// 1.1 Verificar tabla usuarios
console.log('   1.1 Verificando tabla USUARIOS...');
try {
  const { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('*')
    .limit(10);

  if (error) {
    errores.push(`❌ Error en tabla usuarios: ${error.message}`);
    console.log(`      ❌ Error: ${error.message}`);
  } else {
    exitos.push(`✅ Tabla usuarios OK (${usuarios.length} registros)`);
    console.log(`      ✅ Tabla usuarios OK (${usuarios.length} registros)`);

    // Verificar estructura
    const camposRequeridos = ['id', 'username', 'password_hash', 'rol', 'cliente_id', 'activo'];
    const primeraFila = usuarios[0];
    const camposFaltantes = camposRequeridos.filter(campo => !(campo in primeraFila));

    if (camposFaltantes.length > 0) {
      warnings.push(`⚠️  Campos faltantes en usuarios: ${camposFaltantes.join(', ')}`);
      console.log(`      ⚠️  Campos faltantes: ${camposFaltantes.join(', ')}`);
    }

    // Verificar usuario myp específicamente
    const userMyp = usuarios.find(u => u.username === 'myp');
    if (userMyp) {
      console.log(`\n      Usuario 'myp':`);
      console.log(`         ID: ${userMyp.id}`);
      console.log(`         Cliente ID: ${userMyp.cliente_id}`);
      console.log(`         Rol: ${userMyp.rol}`);
      console.log(`         Activo: ${userMyp.activo}`);
      console.log(`         Password hash: ${userMyp.password_hash?.substring(0, 20)}...`);

      if (!userMyp.cliente_id) {
        errores.push('❌ Usuario myp no tiene cliente_id asignado');
        console.log(`         ❌ NO TIENE CLIENTE_ID ASIGNADO`);
      } else {
        exitos.push('✅ Usuario myp tiene cliente_id asignado');
        console.log(`         ✅ Cliente_id asignado correctamente`);
      }

      if (!userMyp.password_hash?.startsWith('$2')) {
        errores.push('❌ Usuario myp no tiene password con bcrypt');
        console.log(`         ❌ Password NO está hasheado con bcrypt`);
      } else {
        exitos.push('✅ Usuario myp tiene password con bcrypt');
        console.log(`         ✅ Password hasheado con bcrypt`);
      }
    } else {
      errores.push('❌ Usuario myp no existe en la base de datos');
      console.log(`      ❌ Usuario 'myp' NO ENCONTRADO`);
    }
  }
} catch (error) {
  errores.push(`❌ Error conectando a tabla usuarios: ${error.message}`);
  console.log(`      ❌ Error: ${error.message}`);
}

// 1.2 Verificar tabla clientes
console.log('\n   1.2 Verificando tabla CLIENTES...');
try {
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*')
    .limit(10);

  if (error) {
    errores.push(`❌ Error en tabla clientes: ${error.message}`);
    console.log(`      ❌ Error: ${error.message}`);
  } else {
    exitos.push(`✅ Tabla clientes OK (${clientes.length} registros)`);
    console.log(`      ✅ Tabla clientes OK (${clientes.length} registros)`);

    clientes.forEach(c => {
      console.log(`         - ${c.nombre} (ID: ${c.id.substring(0, 8)}...)`);
    });
  }
} catch (error) {
  errores.push(`❌ Error conectando a tabla clientes: ${error.message}`);
  console.log(`      ❌ Error: ${error.message}`);
}

// 1.3 Verificar tabla leads
console.log('\n   1.3 Verificando tabla LEADS...');
try {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('fecha_ingreso', { ascending: false })
    .limit(10);

  if (error) {
    errores.push(`❌ Error en tabla leads: ${error.message}`);
    console.log(`      ❌ Error: ${error.message}`);
  } else {
    exitos.push(`✅ Tabla leads OK (${leads.length} registros)`);
    console.log(`      ✅ Tabla leads OK (${leads.length} registros)`);

    // Contar por fuente
    const porFuente = leads.reduce((acc, lead) => {
      acc[lead.fuente] = (acc[lead.fuente] || 0) + 1;
      return acc;
    }, {});

    console.log(`\n      Leads por fuente:`);
    Object.entries(porFuente).forEach(([fuente, count]) => {
      console.log(`         - ${fuente}: ${count}`);
    });

    // Verificar leads del usuario myp
    const { data: userMyp } = await supabase
      .from('usuarios')
      .select('cliente_id')
      .eq('username', 'myp')
      .single();

    if (userMyp?.cliente_id) {
      const { data: leadsMyp, error: errorLeadsMyp } = await supabase
        .from('leads')
        .select('*')
        .eq('cliente_id', userMyp.cliente_id);

      if (errorLeadsMyp) {
        errores.push(`❌ Error obteniendo leads de myp: ${errorLeadsMyp.message}`);
        console.log(`\n      ❌ Error obteniendo leads de myp: ${errorLeadsMyp.message}`);
      } else {
        exitos.push(`✅ Usuario myp tiene ${leadsMyp.length} leads`);
        console.log(`\n      ✅ Usuario 'myp' tiene ${leadsMyp.length} leads`);
        console.log(`         Últimos 5 leads:`);
        leadsMyp.slice(0, 5).forEach((l, i) => {
          const fecha = new Date(l.fecha_ingreso).toLocaleDateString('es-CL');
          console.log(`         ${i+1}. ${l.nombre || 'Sin nombre'} - ${l.fuente} - ${fecha}`);
        });
      }
    }
  }
} catch (error) {
  errores.push(`❌ Error conectando a tabla leads: ${error.message}`);
  console.log(`      ❌ Error: ${error.message}`);
}

// ============================================================
// 2. VERIFICAR APIs EN PRODUCCIÓN
// ============================================================
console.log('\n\n🌐 2. VERIFICANDO APIs EN PRODUCCIÓN\n');

// 2.1 Verificar API de login
console.log('   2.1 Verificando API /api/auth/login...');
try {
  const response = await fetch(`${PRODUCTION_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'myp',
      password: 'mypcliente2025'
    })
  });

  const data = await response.json();

  if (response.ok && data.success) {
    exitos.push('✅ API de login funciona correctamente');
    console.log(`      ✅ Login exitoso`);
    console.log(`         Username: ${data.user.username}`);
    console.log(`         Rol: ${data.user.role}`);
    console.log(`         Cliente ID: ${data.user.cliente_id}`);

    if (!data.user.cliente_id) {
      errores.push('❌ API de login retorna cliente_id null');
      console.log(`         ❌ Cliente_id es NULL`);
    }
  } else {
    errores.push(`❌ API de login falló: ${data.error || 'Error desconocido'}`);
    console.log(`      ❌ Login falló: ${data.error}`);
  }
} catch (error) {
  errores.push(`❌ Error llamando API de login: ${error.message}`);
  console.log(`      ❌ Error: ${error.message}`);
}

// 2.2 Verificar API de sesión
console.log('\n   2.2 Verificando API /api/auth/session...');
try {
  const response = await fetch(`${PRODUCTION_URL}/api/auth/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'myp' })
  });

  const data = await response.json();

  if (response.ok && data.success) {
    exitos.push('✅ API de sesión funciona correctamente');
    console.log(`      ✅ Sesión actualizada correctamente`);
    console.log(`         Cliente ID: ${data.user.cliente_id}`);
  } else {
    errores.push(`❌ API de sesión falló: ${data.error || 'Error desconocido'}`);
    console.log(`      ❌ Error: ${data.error}`);
  }
} catch (error) {
  errores.push(`❌ Error llamando API de sesión: ${error.message}`);
  console.log(`      ❌ Error: ${error.message}`);
}

// 2.3 Verificar API de leads (requiere autenticación)
console.log('\n   2.3 Verificando acceso a API /api/crm/leads...');
console.log(`      ⚠️  Esta API requiere autenticación - verificando endpoint`);

try {
  const response = await fetch(`${PRODUCTION_URL}/api/crm/leads?limit=5`);

  if (response.status === 401) {
    exitos.push('✅ API de leads requiere autenticación (correcto)');
    console.log(`      ✅ API correctamente protegida (401 sin auth)`);
  } else if (response.ok) {
    warnings.push('⚠️  API de leads no requiere autenticación');
    console.log(`      ⚠️  API NO requiere autenticación (posible problema de seguridad)`);
  }
} catch (error) {
  warnings.push(`⚠️  No se pudo verificar API de leads: ${error.message}`);
  console.log(`      ⚠️  Error: ${error.message}`);
}

// ============================================================
// 3. VERIFICAR LÓGICA DE NEGOCIO
// ============================================================
console.log('\n\n🧠 3. VERIFICANDO LÓGICA DE NEGOCIO\n');

// 3.1 Verificar relación usuarios-clientes
console.log('   3.1 Verificando relación usuarios-clientes...');
try {
  const { data: usuarios } = await supabase
    .from('usuarios')
    .select('username, cliente_id')
    .eq('rol', 'cliente');

  const usuariosSinCliente = usuarios?.filter(u => !u.cliente_id) || [];

  if (usuariosSinCliente.length > 0) {
    warnings.push(`⚠️  ${usuariosSinCliente.length} usuarios cliente sin cliente_id`);
    console.log(`      ⚠️  ${usuariosSinCliente.length} usuarios sin cliente_id:`);
    usuariosSinCliente.forEach(u => {
      console.log(`         - ${u.username}`);
    });
  } else {
    exitos.push('✅ Todos los usuarios cliente tienen cliente_id');
    console.log(`      ✅ Todos los usuarios cliente tienen cliente_id asignado`);
  }
} catch (error) {
  errores.push(`❌ Error verificando relación usuarios-clientes: ${error.message}`);
  console.log(`      ❌ Error: ${error.message}`);
}

// 3.2 Verificar integridad de leads
console.log('\n   3.2 Verificando integridad de leads...');
try {
  const { data: leads } = await supabase
    .from('leads')
    .select('id, cliente_id, fuente')
    .limit(100);

  const leadsSinCliente = leads?.filter(l => !l.cliente_id) || [];

  if (leadsSinCliente.length > 0) {
    warnings.push(`⚠️  ${leadsSinCliente.length} leads sin cliente_id`);
    console.log(`      ⚠️  ${leadsSinCliente.length} leads sin cliente_id asignado`);
  } else {
    exitos.push('✅ Todos los leads tienen cliente_id');
    console.log(`      ✅ Todos los leads tienen cliente_id asignado`);
  }
} catch (error) {
  errores.push(`❌ Error verificando integridad de leads: ${error.message}`);
  console.log(`      ❌ Error: ${error.message}`);
}

// ============================================================
// RESUMEN FINAL
// ============================================================
console.log('\n\n═══════════════════════════════════════════════════════════');
console.log('📋 RESUMEN DE VERIFICACIÓN');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`✅ ÉXITOS: ${exitos.length}`);
exitos.forEach(e => console.log(`   ${e}`));

if (warnings.length > 0) {
  console.log(`\n⚠️  ADVERTENCIAS: ${warnings.length}`);
  warnings.forEach(w => console.log(`   ${w}`));
}

if (errores.length > 0) {
  console.log(`\n❌ ERRORES: ${errores.length}`);
  errores.forEach(e => console.log(`   ${e}`));
}

console.log('\n═══════════════════════════════════════════════════════════');

if (errores.length === 0) {
  console.log('✅ SISTEMA COMPLETAMENTE FUNCIONAL');
} else {
  console.log('❌ SISTEMA TIENE ERRORES QUE REQUIEREN ATENCIÓN');
}

console.log('═══════════════════════════════════════════════════════════\n');

// Exit code
process.exit(errores.length > 0 ? 1 : 0);
