const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetSequence() {
  console.log('🔄 Reseteando secuencia de IDs...');

  // Primero verificar cuántos leads hay
  const { count, error: countError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error contando leads:', countError);
    return;
  }

  console.log(`📊 Leads actuales: ${count}`);

  if (count === 0) {
    console.log('✅ No hay leads, procediendo a resetear secuencia...');

    // Ejecutar SQL para resetear la secuencia
    const { data, error } = await supabase.rpc('reset_leads_sequence');

    if (error) {
      console.error('❌ Error reseteando secuencia:', error);
      console.log('\n⚠️  Necesitas ejecutar este SQL manualmente en Supabase:');
      console.log('ALTER SEQUENCE leads_id_seq RESTART WITH 1;');
    } else {
      console.log('✅ Secuencia reseteada exitosamente!');
      console.log('   Los próximos leads empezarán desde ID 1');
    }
  } else {
    console.log('⚠️  Hay leads en la base de datos. Primero elimínalos todos.');
  }
}

resetSequence();
