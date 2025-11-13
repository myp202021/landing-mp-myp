// Test normalización
function normalizeColumnName(col) {
  return col.toLowerCase().trim().replace(/\s+/g, '_')
}

const testCols = [
  'número_de_teléfono',
  'nombre_de_la_empresa',
  'facturación_mensual_empresa',
  'Número de teléfono',
  'Nombre de la empresa'
];

console.log('Test normalización:');
console.log('='.repeat(60));
testCols.forEach(col => {
  const normalized = normalizeColumnName(col);
  console.log(`"${col}" => "${normalized}"`);
});
