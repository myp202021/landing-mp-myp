const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('/Users/christophermuller/Downloads/ODEPA_Directorio_Agroindustria.xlsx');
const sheet = workbook.Sheets['Base_datos'];
const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });

console.log('✅ Total empresas:', data.length);
console.log('\n📋 Columnas disponibles:');
const columns = Object.keys(data[0]);
columns.forEach((col, i) => {
  console.log(`   ${i + 1}. ${col}`);
});

console.log('\n🔍 Ejemplo de 2 empresas:');
data.slice(0, 2).forEach((emp, i) => {
  console.log(`\n--- Empresa ${i + 1} ---`);
  console.log(JSON.stringify(emp, null, 2));
});

// Crear CSV limpio
const csv = xlsx.utils.json_to_sheet(data);
const csvString = xlsx.utils.sheet_to_csv(csv);
fs.writeFileSync('/Users/christophermuller/Downloads/Directorio_Agroindustria_LIMPIO.csv', csvString);

console.log('\n💾 CSV limpio generado: Directorio_Agroindustria_LIMPIO.csv');
console.log(`   Total empresas: ${data.length}`);
