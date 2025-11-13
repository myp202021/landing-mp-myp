const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function truncateLeads() {
  console.log('⚠️  TRUNCATE LEADS - Eliminando TODOS los leads...\n');

  // Contar leads actuales
  const { count: beforeCount, error: countError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error contando leads:', countError);
    return;
  }

  console.log(`📊 Leads actuales: ${beforeCount}`);

  if (beforeCount === 0) {
    console.log('✅ No hay leads para eliminar');
    return;
  }

  // Eliminar TODOS los leads
  console.log('🗑️  Eliminando todos los leads...');
  const { error: deleteError } = await supabase
    .from('leads')
    .delete()
    .neq('id', 0); // Esto elimina TODOS los registros

  if (deleteError) {
    console.error('❌ Error eliminando leads:', deleteError);
    return;
  }

  // Verificar
  const { count: afterCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  console.log(`\n✅ ${beforeCount} leads eliminados`);
  console.log(`📊 Leads restantes: ${afterCount}`);

  if (afterCount === 0) {
    console.log('\n🔄 Ahora ejecuta este SQL en Supabase para resetear IDs:');
    console.log('   ALTER SEQUENCE leads_id_seq RESTART WITH 1;');
  }
}

truncateLeads();
